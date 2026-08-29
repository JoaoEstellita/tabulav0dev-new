import React, { useEffect, useRef, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Modal, TextInput, ScrollView, Animated, Alert, Platform } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { getDoc, doc } from 'firebase/firestore'
import { db } from '../../config/firebase'
import { useAuth } from '../../hooks/useAuth'
import { useAppLanguage } from '../../hooks/useAppLanguage'
import { getDeck, swipe, getMyProfile, reportProfile, type DeckCard, type DeckFilters, type WheelPos } from '../../services/DiscoveryService'
import { requestConnection } from '../../services/ConnectionsService'
import { NETWORK_INTERESTS, interestLabel, interestEmoji, PROFILE_PROMPTS, promptLabel, promptEmoji, type NetworkLang } from '../../constants/networkInterests'
import LocationField, { type PickedLocation } from '../../components/LocationField'
import SynastryWheel from '../../components/SynastryWheel'
import AspectGrid from '../../components/AspectGrid'

const C = { bg: '#141428', card: '#1c1c34', line: '#2a2a44', gold: '#e8b84b', magenta: '#d6409f', good: '#3ecf8e', tx: '#eaeaf5', dim: '#8892a4' }
// planetEn (minúsculo) → nome capitalizado que o AspectGrid espera.
const CAP: Record<string, string> = { sun: 'Sun', moon: 'Moon', mercury: 'Mercury', venus: 'Venus', mars: 'Mars', jupiter: 'Jupiter', saturn: 'Saturn', uranus: 'Uranus', neptune: 'Neptune', pluto: 'Pluto', lilith: 'Lilith', northnode: 'NorthNode', southnode: 'SouthNode' }
const toGridPlanets = (pos?: WheelPos[]) => (pos || []).map((p) => ({ name: CAP[p.planetEn] || p.planetEn, longitude: p.longitude }))

export default function DiscoverDeck({ onOpenList, onGoProfile }: { onOpenList?: () => void; onGoProfile?: () => void }) {
  const { user } = useAuth()
  const { language } = useAppLanguage()
  const lang = language as NetworkLang
  const tl = (pt: string, en: string, es: string, it: string) =>
    ({ 'pt-BR': pt, 'en-US': en, 'es-ES': es, 'it-IT': it }[lang] || pt)
  const tierLabel = (tier: string) => ({
    altissima: tl('Afinidade altíssima', 'Very high affinity', 'Afinidad altisima', 'Affinita altissima'),
    alta: tl('Alta afinidade', 'High affinity', 'Alta afinidad', 'Alta affinita'),
    boa: tl('Boa afinidade', 'Good affinity', 'Buena afinidad', 'Buona affinita'),
    moderada: tl('Afinidade moderada', 'Moderate affinity', 'Afinidad moderada', 'Affinita moderata'),
    baixa: tl('Afinidade baixa', 'Low affinity', 'Afinidad baja', 'Affinita bassa'),
  }[tier] || '')

  const [cards, setCards] = useState<DeckCard[]>([])
  const [myPos, setMyPos] = useState<WheelPos[]>([])
  const [idx, setIdx] = useState(0)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [matchWith, setMatchWith] = useState<DeckCard | null>(null)
  const [myPhoto, setMyPhoto] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<DeckFilters>({})
  const [missing, setMissing] = useState<string[]>([])
  const [showAff, setShowAff] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const incomplete = missing.length > 0
  const matchAnim = useRef(new Animated.Value(0)).current

  // Gate de completude: foto + gênero + preferência são o mínimo pra o Match
  // funcionar bem (card atraente + filtro bidirecional de gênero).
  useEffect(() => {
    getMyProfile().then((r) => {
      const p: any = r.profile
      const miss: string[] = []
      if (!((p?.photos && p.photos.length) || p?.photoURL)) miss.push(tl('uma foto', 'a photo', 'una foto', 'una foto'))
      if (!p?.gender) miss.push(tl('seu gênero', 'your gender', 'tu genero', 'il tuo genere'))
      if (!p?.seeking) miss.push(tl('quem quer conhecer', 'who you want to meet', 'a quien conocer', 'chi conoscere'))
      setMissing(miss)
    }).catch(() => {})
  }, [user?.uid]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (matchWith) {
      matchAnim.setValue(0)
      Animated.spring(matchAnim, { toValue: 1, useNativeDriver: true, friction: 6, tension: 60 }).start()
    }
  }, [matchWith]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!user?.uid) return
    getDoc(doc(db, 'users', user.uid)).then((s) => setMyPhoto((s.data() as any)?.profilePhoto || null)).catch(() => {})
  }, [user?.uid])

  const load = (f: DeckFilters) => {
    setLoading(true)
    getDeck(f).then((r) => { setCards(r.cards); setMyPos(r.myPositions || []); setIdx(0) }).finally(() => setLoading(false))
  }
  useEffect(() => { load(filters) }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const current = cards[idx] || null

  const act = async (action: 'like' | 'pass') => {
    if (!current || busy) return
    setBusy(true)
    try {
      const r = await swipe(current.uid, action)
      if (r.matched) setMatchWith(current)
    } catch { /* segue mesmo se falhar */ } finally {
      setBusy(false)
      setShowAff(false)
      setIdx((i) => i + 1)
    }
  }

  // Pedir amizade: conexão não-romântica (requestConnection). Não é swipe/like —
  // só manda o pedido e avança o card. A pessoa some do baralho (deck já exclui
  // conexões pending) no próximo carregamento.
  const askFriend = async () => {
    if (!current || busy) return
    setBusy(true)
    try {
      await requestConnection(current.uid, null, false)
      setToast(tl('Pedido de amizade enviado 🤝', 'Friend request sent 🤝', 'Solicitud de amistad enviada 🤝', 'Richiesta di amicizia inviata 🤝'))
    } catch { /* segue */ } finally {
      setBusy(false); setShowAff(false); setIdx((i) => i + 1)
      setTimeout(() => setToast(null), 2200)
    }
  }

  const applyFilters = (f: DeckFilters) => { setFilters(f); setShowFilters(false); load(f) }

  const report = () => {
    if (!current) return
    const advance = () => { reportProfile(current.uid).catch(() => {}); setShowAff(false); setIdx((i) => i + 1) }
    const msg = tl('Denunciar este perfil por conteúdo impróprio? Ele será revisado.', 'Report this profile for inappropriate content? It will be reviewed.', 'Denunciar este perfil por contenido inapropiado? Sera revisado.', 'Segnalare questo profilo per contenuto inappropriato? Sara rivisto.')
    if (Platform.OS === 'web') { if (typeof window !== 'undefined' && window.confirm(msg)) advance() }
    else Alert.alert(tl('Denunciar', 'Report', 'Denunciar', 'Segnala'), msg, [
      { text: tl('Cancelar', 'Cancel', 'Cancelar', 'Annulla'), style: 'cancel' },
      { text: tl('Denunciar', 'Report', 'Denunciar', 'Segnala'), style: 'destructive', onPress: advance },
    ])
  }

  if (loading) return <ActivityIndicator color={C.gold} style={{ marginTop: 40 }} />

  return (
    <View style={s.wrap}>
      <View style={s.topRow}>
        <Text style={s.title}>{tl('Descobrir', 'Discover', 'Descubrir', 'Scopri')}</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {onOpenList ? (
            <TouchableOpacity style={s.filterBtn} onPress={onOpenList}>
              <Ionicons name="search" size={18} color={C.gold} />
              <Text style={s.filterTx}>{tl('Buscar', 'Search', 'Buscar', 'Cerca')}</Text>
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity style={s.filterBtn} onPress={() => setShowFilters(true)}>
            <Ionicons name="options-outline" size={18} color={C.gold} />
            <Text style={s.filterTx}>{tl('Filtros', 'Filters', 'Filtros', 'Filtri')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {incomplete ? (
        <TouchableOpacity style={s.incomplete} onPress={onGoProfile} activeOpacity={0.9}>
          <Ionicons name="person-circle-outline" size={22} color={C.gold} />
          <Text style={s.incompleteTx}>{tl('Complete seu Perfil', 'Complete your Profile', 'Completa tu Perfil', 'Completa il Profilo')} ({missing.join(', ')}) {tl('para dar match.', 'to match.', 'para hacer match.', 'per fare match.')}</Text>
          <Ionicons name="chevron-forward" size={18} color={C.gold} />
        </TouchableOpacity>
      ) : null}

      {!current ? (
        <View style={s.empty}>
          <Ionicons name="planet-outline" size={42} color={C.dim} />
          <Text style={s.emptyTx}>{tl('Por agora acabaram. Ajuste os filtros ou volte depois.', 'That is all for now. Adjust filters or come back later.', 'Por ahora se acabaron. Ajusta filtros o vuelve luego.', 'Per ora e tutto. Regola i filtri o torna dopo.')}</Text>
          <TouchableOpacity style={s.reload} onPress={() => load(filters)}><Text style={s.reloadTx}>{tl('Recarregar', 'Reload', 'Recargar', 'Ricarica')}</Text></TouchableOpacity>
        </View>
      ) : (
        <View style={s.cardBox}>
          <View style={s.photoWrap}>
            {(current.photos && current.photos[0]) || current.photoURL
              ? <Image source={{ uri: (current.photos && current.photos[0]) || current.photoURL || undefined }} style={s.photo} />
              : <View style={[s.photo, s.photoFb]}><Ionicons name="person" size={70} color="#3a3a5a" /></View>}
            <LinearGradient colors={['transparent', 'rgba(12,8,24,0.35)', 'rgba(12,8,24,0.96)']} locations={[0, 0.55, 1]} style={s.grad} pointerEvents="none" />
            {/* Anel de compatibilidade */}
            <View style={s.ring}>
              <Text style={s.ringPct}>{Math.round(current.score)}<Text style={s.ringSym}>%</Text></Text>
              <Text style={s.ringLbl}>{tl('afinidade', 'match', 'afinidad', 'affinita')}</Text>
            </View>
            <TouchableOpacity style={s.report} onPress={report} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="flag-outline" size={16} color="rgba(255,255,255,0.85)" />
            </TouchableOpacity>
            {/* Info sobre a foto */}
            <View style={s.overlay}>
              <Text style={s.name}>{current.displayName}{current.age ? <Text style={s.age}>, {current.age}</Text> : null}</Text>
              {current.city ? (
                <Text style={s.city}>📍 {current.city}
                  {typeof current.distanceKm === 'number'
                    ? <Text style={s.near}>  ·  {current.distanceKm <= 1 ? tl('na sua cidade', 'in your city', 'en tu ciudad', 'nella tua citta') : tl(`a ${current.distanceKm} km`, `${current.distanceKm} km away`, `a ${current.distanceKm} km`, `a ${current.distanceKm} km`)}</Text>
                    : current.sameCity ? <Text style={s.near}>  ·  {tl('perto de você', 'near you', 'cerca de ti', 'vicino a te')}</Text> : null}
                </Text>
              ) : null}
              <Text style={s.signs}>☉ {current.sunSign || '—'}   ☽ {current.moonSign || '—'}   ↑ {current.ascSign || '—'}</Text>
            </View>
          </View>
          {/* Leitura de afinidade — resumo visível, aspectos sob toggle */}
          <View style={s.detail}>
            <TouchableOpacity style={s.affToggle} onPress={() => setShowAff((v) => !v)} activeOpacity={0.8}>
              <Text style={s.tierLabel}>💫 {tierLabel(current.tier)} · {Math.round(current.score)}%</Text>
              <View style={s.affToggleRight}>
                <Text style={s.affToggleTx}>{showAff ? tl('ocultar', 'hide', 'ocultar', 'nascondi') : tl('ver aspectos', 'see aspects', 'ver aspectos', 'vedi aspetti')}</Text>
                <Ionicons name={showAff ? 'chevron-up' : 'chevron-down'} size={16} color={C.magenta} />
              </View>
            </TouchableOpacity>
            {showAff ? (
              <View style={{ marginTop: 4 }}>
                {current.harmonics?.length ? (
                  <>
                    <Text style={s.detailHead}>{tl('O que flui entre vocês', 'What flows between you', 'Lo que fluye entre ustedes', 'Cosa scorre tra voi')}</Text>
                    {current.harmonics.map((h, i) => <Text key={'h' + i} style={s.harmonic}>✨ {h}</Text>)}
                  </>
                ) : null}
                {current.tensions?.length ? (
                  <>
                    <Text style={s.detailHead}>{tl('Onde há atrito (também atrai)', 'Where there is friction (also attracts)', 'Donde hay roce (tambien atrae)', 'Dove c e attrito (attrae anche)')}</Text>
                    {current.tensions.map((t, i) => <Text key={'t' + i} style={s.tension}>⚡ {t}</Text>)}
                  </>
                ) : null}
                {!current.harmonics?.length && !current.tensions?.length ? (
                  <Text style={s.reason}>{tl('Compatibilidade sem aspectos pessoais fortes.', 'Compatibility without strong personal aspects.', 'Compatibilidad sin aspectos personales fuertes.', 'Compatibilita senza aspetti personali forti.')}</Text>
                ) : null}
                {/* Roda de sinastria: você (magenta) × a pessoa (dourado) */}
                {myPos.length && current.positions?.length ? (
                  <>
                    <Text style={s.detailHead}>{tl('Roda de sinastria', 'Synastry wheel', 'Rueda de sinastria', 'Ruota di sinastria')}</Text>
                    <SynastryWheel outer={myPos} inner={current.positions} aspects={current.grid || []} size={300} outerLabel={tl('Você', 'You', 'Tu', 'Tu')} innerLabel={current.displayName} />
                  </>
                ) : null}
                {/* Grade completa dos aspectos entre os dois mapas */}
                {current.grid?.length && myPos.length && current.positions?.length ? (
                  <View style={{ marginTop: 12 }}>
                    <Text style={s.detailHead}>{tl('Grade de aspectos', 'Aspect grid', 'Grilla de aspectos', 'Griglia aspetti')}</Text>
                    <AspectGrid cross rowPlanets={toGridPlanets(myPos)} colPlanets={toGridPlanets(current.positions)} aspects={current.grid.map((g) => ({ planet1: CAP[g.mine] || g.mine, planet2: CAP[g.theirs] || g.theirs, type: g.labelPt || '', orb: g.orb }))} />
                  </View>
                ) : null}
                {/* Dono não abriu a roda/grade — mostra só a leitura em texto */}
                {!current.positions?.length ? (
                  <Text style={[s.reason, { marginTop: 10 }]}>🔒 {tl('Este perfil não abriu a roda de sinastria.', 'This profile did not open the synastry wheel.', 'Este perfil no abrio la rueda de sinastria.', 'Questo profilo non ha aperto la ruota di sinastria.')}</Text>
                ) : null}
              </View>
            ) : null}
            {/* Sobre a pessoa: bio + favoritos */}
            {(current.bio || Object.keys(current.prompts || {}).length) ? (
              <>
                <Text style={s.detailHead}>{tl('Sobre', 'About', 'Sobre', 'Su')} {current.displayName}</Text>
                {current.bio ? <Text style={s.bio}>{current.bio}</Text> : null}
                {PROFILE_PROMPTS.filter((p) => current.prompts && current.prompts[p.key]).map((p) => (
                  <Text key={p.key} style={s.prompt}>{promptEmoji(p.key)} <Text style={s.promptLbl}>{promptLabel(p.key, lang)}:</Text> {current.prompts![p.key]}</Text>
                ))}
              </>
            ) : null}
            {/* Interesses (comuns destacados) */}
            {current.interests?.length ? (
              <>
                <Text style={s.detailHead}>{tl('Interesses', 'Interests', 'Intereses', 'Interessi')}</Text>
                <View style={s.common}>
                  {current.interests.map((c) => {
                    const shared = current.common?.includes(c)
                    return <View key={c} style={[s.commonChip, !shared && s.chipPlain]}><Text style={[s.commonTx, !shared && s.chipPlainTx]}>{interestEmoji(c)} {interestLabel(c, lang)}{shared ? ' ✓' : ''}</Text></View>
                  })}
                </View>
              </>
            ) : null}
          </View>
        </View>
      )}

      {current ? (
        <>
          <View style={s.actions}>
            <TouchableOpacity style={[s.act, s.pass]} disabled={busy} onPress={() => act('pass')} activeOpacity={0.85}>
              <Ionicons name="close" size={30} color="#ff6b6b" />
            </TouchableOpacity>
            <TouchableOpacity style={[s.act, s.friend]} disabled={busy} onPress={askFriend} activeOpacity={0.85}>
              <Text style={s.friendEmoji}>🤝</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[s.act, s.like]} disabled={busy} onPress={() => act('like')} activeOpacity={0.85}>
              <Ionicons name="heart" size={28} color="#fff" />
            </TouchableOpacity>
          </View>
          <View style={s.actionLabels}>
            <Text style={s.actLbl}>{tl('Passar', 'Pass', 'Pasar', 'Passa')}</Text>
            <Text style={s.actLbl}>{tl('Amizade', 'Friend', 'Amistad', 'Amicizia')}</Text>
            <Text style={s.actLbl}>{tl('Match', 'Match', 'Match', 'Match')}</Text>
          </View>
        </>
      ) : null}

      {toast ? <View style={s.toast}><Text style={s.toastTx}>{toast}</Text></View> : null}

      {/* Overlay de Match */}
      <Modal visible={!!matchWith} transparent animationType="fade" onRequestClose={() => setMatchWith(null)}>
        <View style={s.matchBack}>
          <Animated.View style={{ alignItems: 'center', opacity: matchAnim, transform: [{ scale: matchAnim.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1] }) }] }}>
            <Text style={s.matchSpark}>✨</Text>
            <Text style={s.matchTitle}>{tl('Deu Match!', 'It is a Match!', 'Hubo Match!', 'E Match!')} 💘</Text>
            <View style={s.matchRow}>
              <Image source={{ uri: myPhoto || undefined }} style={s.matchPhoto} />
              <View style={s.matchHeart}><Ionicons name="heart" size={26} color="#fff" /></View>
              <Image source={{ uri: (matchWith?.photos && matchWith.photos[0]) || matchWith?.photoURL || undefined }} style={s.matchPhoto} />
            </View>
            <Text style={s.matchSub}>{tl(`Você e ${matchWith?.displayName || ''} combinaram. Agora podem se falar.`, `You and ${matchWith?.displayName || ''} matched. Now you can talk.`, `Tu y ${matchWith?.displayName || ''} combinaron. Ahora pueden hablar.`, `Tu e ${matchWith?.displayName || ''} avete combinato. Ora potete parlare.`)}</Text>
            <TouchableOpacity style={s.matchCta} onPress={() => setMatchWith(null)}><Text style={s.matchCtaTx}>{tl('Continuar', 'Continue', 'Continuar', 'Continua')}</Text></TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>

      {/* Sheet de filtros */}
      <FiltersSheet visible={showFilters} initial={filters} onClose={() => setShowFilters(false)} onApply={applyFilters} tl={tl} lang={lang} />
    </View>
  )
}

function FiltersSheet({ visible, initial, onClose, onApply, tl, lang }: any) {
  const [cityLoc, setCityLoc] = useState<PickedLocation | null>(null)
  const [cityName, setCityName] = useState<string>(initial.city || '')
  const [minAge, setMinAge] = useState(initial.minAge ? String(initial.minAge) : '')
  const [maxAge, setMaxAge] = useState(initial.maxAge ? String(initial.maxAge) : '')
  const [maxKm, setMaxKm] = useState<number | null>(initial.maxKm ?? null)
  const [interests, setInterests] = useState<string[]>(initial.interests || [])
  const toggle = (slug: string) => setInterests((p: string[]) => p.includes(slug) ? p.filter((x) => x !== slug) : [...p, slug])
  const apply = () => onApply({
    city: cityName.trim() || undefined,
    minAge: minAge ? Number(minAge) : undefined,
    maxAge: maxAge ? Number(maxAge) : undefined,
    maxKm: maxKm ?? undefined,
    interests: interests.length ? interests : undefined,
  })
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={s.sheetBack}>
        <View style={s.sheet}>
          <ScrollView contentContainerStyle={{ padding: 18 }}>
            <Text style={s.sheetTitle}>{tl('Filtros', 'Filters', 'Filtros', 'Filtri')}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 16, marginBottom: 8 }}>
              <Text style={[s.flabel, { marginTop: 0, marginBottom: 0 }]}>{tl('Cidade', 'City', 'Ciudad', 'Citta')}</Text>
              {cityName ? (
                <TouchableOpacity onPress={() => { setCityLoc(null); setCityName('') }}><Text style={{ color: C.dim, fontSize: 12 }}>{tl('Qualquer cidade', 'Any city', 'Cualquier ciudad', 'Qualsiasi citta')} ✕</Text></TouchableOpacity>
              ) : null}
            </View>
            <LocationField value={cityLoc} language={lang} placeholder={cityName || tl('Qualquer', 'Any', 'Cualquiera', 'Qualsiasi')} onChange={(loc) => { setCityLoc(loc); setCityName(loc.city) }} />
            <Text style={s.flabel}>{tl('Faixa etária', 'Age range', 'Rango de edad', 'Fascia eta')}</Text>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TextInput style={[s.finput, { flex: 1 }]} value={minAge} onChangeText={setMinAge} placeholder={tl('mín', 'min', 'min', 'min')} placeholderTextColor={C.dim} keyboardType="number-pad" />
              <TextInput style={[s.finput, { flex: 1 }]} value={maxAge} onChangeText={setMaxAge} placeholder={tl('máx', 'max', 'max', 'max')} placeholderTextColor={C.dim} keyboardType="number-pad" />
            </View>
            <Text style={s.flabel}>{tl('Distância máxima', 'Max distance', 'Distancia maxima', 'Distanza massima')}</Text>
            <View style={s.chips}>
              {([[10, '10 km'], [30, '30 km'], [80, '80 km'], [300, '300 km'], [null, tl('Qualquer', 'Any', 'Cualquiera', 'Qualsiasi')]] as const).map(([v, l]) => (
                <TouchableOpacity key={String(v)} style={[s.chip, maxKm === v && s.chipOn]} onPress={() => setMaxKm(v as any)}>
                  <Text style={[s.chipTx, maxKm === v && s.chipTxOn]}>{l}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={s.flabel}>{tl('Interesses', 'Interests', 'Intereses', 'Interessi')}</Text>
            <View style={s.chips}>
              {NETWORK_INTERESTS.map((t) => (
                <TouchableOpacity key={t.slug} style={[s.chip, interests.includes(t.slug) && s.chipOn]} onPress={() => toggle(t.slug)}>
                  <Text style={[s.chipTx, interests.includes(t.slug) && s.chipTxOn]}>{t.emoji} {interestLabel(t.slug, lang)}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={s.applyBtn} onPress={apply}><Text style={s.applyTx}>{tl('Aplicar', 'Apply', 'Aplicar', 'Applica')}</Text></TouchableOpacity>
            <TouchableOpacity style={{ alignItems: 'center', marginTop: 10 }} onPress={onClose}><Text style={{ color: C.dim }}>{tl('Fechar', 'Close', 'Cerrar', 'Chiudi')}</Text></TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  )
}

const s = StyleSheet.create({
  wrap: { paddingHorizontal: 16 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  title: { color: C.tx, fontSize: 17, fontWeight: '800' },
  filterBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: C.card, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 18, borderWidth: 1, borderColor: C.line },
  filterTx: { color: C.gold, fontSize: 13, fontWeight: '700' },
  incomplete: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: 'rgba(232,184,75,0.12)', borderWidth: 1, borderColor: 'rgba(232,184,75,0.4)', borderRadius: 14, padding: 14, marginBottom: 14 },
  incompleteTx: { flex: 1, color: C.tx, fontSize: 13, fontWeight: '600' },
  cardBox: { backgroundColor: C.card, borderRadius: 22, overflow: 'hidden', borderWidth: 1, borderColor: C.line, shadowColor: C.magenta, shadowOpacity: 0.25, shadowRadius: 18, shadowOffset: { width: 0, height: 8 }, elevation: 8 },
  photoWrap: { width: '100%', height: 440, position: 'relative' },
  photo: { width: '100%', height: '100%', backgroundColor: '#000' },
  photoFb: { alignItems: 'center', justifyContent: 'center', backgroundColor: '#0d0d1c' },
  grad: { position: 'absolute', left: 0, right: 0, bottom: 0, height: '70%' },
  ring: { position: 'absolute', top: 14, right: 14, width: 62, height: 62, borderRadius: 31, borderWidth: 2.5, borderColor: C.magenta, backgroundColor: 'rgba(12,8,24,0.55)', alignItems: 'center', justifyContent: 'center' },
  report: { position: 'absolute', top: 14, left: 14, width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(12,8,24,0.5)', alignItems: 'center', justifyContent: 'center' },
  ringPct: { color: '#fff', fontSize: 19, fontWeight: '900', lineHeight: 20 },
  ringSym: { fontSize: 11, fontWeight: '700' },
  ringLbl: { color: '#fff', fontSize: 8, fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase', opacity: 0.85 },
  overlay: { position: 'absolute', left: 18, right: 18, bottom: 16 },
  name: { color: '#fff', fontSize: 25, fontWeight: '900' },
  age: { color: 'rgba(255,255,255,0.9)', fontSize: 22, fontWeight: '600' },
  city: { color: 'rgba(255,255,255,0.9)', fontSize: 14, marginTop: 4 },
  near: { color: C.good, fontSize: 13, fontWeight: '700' },
  signs: { color: C.gold, fontSize: 14, marginTop: 8, fontWeight: '700', letterSpacing: 0.3 },
  detail: { padding: 16 },
  affToggle: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  affToggleRight: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  affToggleTx: { color: C.magenta, fontSize: 12, fontWeight: '700' },
  tierLabel: { color: C.magenta, fontSize: 15, fontWeight: '800' },
  detailHead: { color: C.dim, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 10, marginBottom: 4 },
  harmonic: { color: C.tx, fontSize: 13, lineHeight: 19 },
  tension: { color: C.gold, fontSize: 13, lineHeight: 19 },
  reason: { color: C.dim, fontSize: 13 },
  common: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10 },
  commonChip: { backgroundColor: 'rgba(214,64,159,0.16)', borderRadius: 14, paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderColor: 'rgba(214,64,159,0.35)' },
  commonTx: { color: C.tx, fontSize: 12, fontWeight: '600' },
  chipPlain: { backgroundColor: C.card, borderColor: C.line },
  chipPlainTx: { color: C.dim },
  bio: { color: C.tx, fontSize: 14, lineHeight: 20, marginBottom: 6 },
  prompt: { color: C.tx, fontSize: 13, lineHeight: 20 },
  promptLbl: { color: C.dim, fontWeight: '700' },
  actions: { flexDirection: 'row', justifyContent: 'center', gap: 22, marginTop: 18 },
  act: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', borderWidth: 2 },
  pass: { backgroundColor: C.card, borderColor: '#ff6b6b' },
  friend: { backgroundColor: C.card, borderColor: C.good, width: 56, height: 56, borderRadius: 28 },
  friendEmoji: { fontSize: 24 },
  like: { backgroundColor: C.magenta, borderColor: C.magenta },
  actionLabels: { flexDirection: 'row', justifyContent: 'center', gap: 22, marginTop: 6 },
  actLbl: { width: 64, textAlign: 'center', color: C.dim, fontSize: 11, fontWeight: '700' },
  toast: { position: 'absolute', bottom: 24, alignSelf: 'center', left: 40, right: 40, backgroundColor: 'rgba(20,16,32,0.96)', borderWidth: 1, borderColor: C.good, borderRadius: 14, paddingVertical: 12, paddingHorizontal: 18 },
  toastTx: { color: C.tx, fontSize: 13.5, fontWeight: '700', textAlign: 'center' },
  empty: { alignItems: 'center', paddingVertical: 44, gap: 12 },
  emptyTx: { color: C.dim, fontSize: 14, textAlign: 'center', paddingHorizontal: 24 },
  reload: { backgroundColor: C.card, borderRadius: 12, paddingHorizontal: 20, paddingVertical: 10, borderWidth: 1, borderColor: C.line },
  reloadTx: { color: C.gold, fontWeight: '700' },
  matchBack: { flex: 1, backgroundColor: 'rgba(10,6,20,0.95)', alignItems: 'center', justifyContent: 'center', padding: 28 },
  matchSpark: { fontSize: 40, marginBottom: 6 },
  matchTitle: { color: C.tx, fontSize: 30, fontWeight: '900', marginBottom: 26 },
  matchRow: { flexDirection: 'row', alignItems: 'center' },
  matchHeart: { width: 46, height: 46, borderRadius: 23, backgroundColor: C.magenta, alignItems: 'center', justifyContent: 'center', marginHorizontal: -12, zIndex: 2, borderWidth: 3, borderColor: 'rgba(10,6,20,0.95)' },
  matchPhoto: { width: 108, height: 108, borderRadius: 54, borderWidth: 3, borderColor: C.magenta, backgroundColor: '#000' },
  matchSub: { color: C.dim, fontSize: 15, textAlign: 'center', marginTop: 26, lineHeight: 22 },
  matchCta: { marginTop: 28, backgroundColor: C.gold, borderRadius: 14, paddingVertical: 14, paddingHorizontal: 40 },
  matchCtaTx: { color: '#1a1400', fontWeight: '800', fontSize: 15 },
  sheetBack: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: C.bg, borderTopLeftRadius: 22, borderTopRightRadius: 22, maxHeight: '86%' },
  sheetTitle: { color: C.tx, fontSize: 18, fontWeight: '800', marginBottom: 8 },
  flabel: { color: C.tx, fontSize: 14, fontWeight: '700', marginTop: 16, marginBottom: 8 },
  finput: { backgroundColor: C.card, borderRadius: 10, borderWidth: 1, borderColor: C.line, color: C.tx, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 18, backgroundColor: C.card, borderWidth: 1, borderColor: C.line },
  chipOn: { backgroundColor: 'rgba(232,184,75,0.16)', borderColor: C.gold },
  chipTx: { color: C.dim, fontSize: 13, fontWeight: '600' },
  chipTxOn: { color: C.tx },
  applyBtn: { marginTop: 22, backgroundColor: C.gold, borderRadius: 14, paddingVertical: 14, alignItems: 'center' },
  applyTx: { color: '#1a1400', fontSize: 15, fontWeight: '800' },
})
