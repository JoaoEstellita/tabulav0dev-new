import React, { useEffect, useRef, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Modal, TextInput, ScrollView, Animated, Easing } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { getDoc, doc } from 'firebase/firestore'
import { db } from '../../config/firebase'
import { useAuth } from '../../hooks/useAuth'
import { useAppLanguage } from '../../hooks/useAppLanguage'
import { getDeck, swipe, type DeckCard, type DeckFilters } from '../../services/DiscoveryService'
import { NETWORK_INTERESTS, interestLabel, interestEmoji, type NetworkLang } from '../../constants/networkInterests'

const C = { bg: '#141428', card: '#1c1c34', line: '#2a2a44', gold: '#e8b84b', magenta: '#d6409f', good: '#3ecf8e', tx: '#eaeaf5', dim: '#8892a4' }
const ELEMENTS = ['fogo', 'terra', 'ar', 'agua'] as const

export default function DiscoverDeck({ onOpenList }: { onOpenList?: () => void }) {
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
  const [idx, setIdx] = useState(0)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [matchWith, setMatchWith] = useState<DeckCard | null>(null)
  const [myPhoto, setMyPhoto] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<DeckFilters>({})
  const matchAnim = useRef(new Animated.Value(0)).current

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
    getDeck(f).then((r) => { setCards(r.cards); setIdx(0) }).finally(() => setLoading(false))
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
      setIdx((i) => i + 1)
    }
  }

  const applyFilters = (f: DeckFilters) => { setFilters(f); setShowFilters(false); load(f) }

  if (loading) return <ActivityIndicator color={C.gold} style={{ marginTop: 40 }} />

  return (
    <View style={s.wrap}>
      <View style={s.topRow}>
        <Text style={s.title}>{tl('Descobrir', 'Discover', 'Descubrir', 'Scopri')}</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {onOpenList ? (
            <TouchableOpacity style={s.filterBtn} onPress={onOpenList}>
              <Ionicons name="list" size={18} color={C.gold} />
              <Text style={s.filterTx}>{tl('Lista', 'List', 'Lista', 'Lista')}</Text>
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity style={s.filterBtn} onPress={() => setShowFilters(true)}>
            <Ionicons name="options-outline" size={18} color={C.gold} />
            <Text style={s.filterTx}>{tl('Filtros', 'Filters', 'Filtros', 'Filtri')}</Text>
          </TouchableOpacity>
        </View>
      </View>

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
            {/* Info sobre a foto */}
            <View style={s.overlay}>
              <Text style={s.name}>{current.displayName}{current.age ? <Text style={s.age}>, {current.age}</Text> : null}</Text>
              {current.city ? <Text style={s.city}>📍 {current.city}</Text> : null}
              <Text style={s.signs}>☉ {current.sunSign || '—'}   ☽ {current.moonSign || '—'}   ↑ {current.ascSign || '—'}</Text>
            </View>
          </View>
          {/* Leitura de afinidade */}
          <View style={s.detail}>
            <Text style={s.tierLabel}>{tierLabel(current.tier)}</Text>
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
            {current.common?.length ? (
              <>
                <Text style={s.detailHead}>{tl('Interesses em comum', 'Common interests', 'Intereses en comun', 'Interessi in comune')}</Text>
                <View style={s.common}>
                  {current.common.map((c) => <View key={c} style={s.commonChip}><Text style={s.commonTx}>{interestEmoji(c)} {interestLabel(c, lang)}</Text></View>)}
                </View>
              </>
            ) : null}
          </View>
        </View>
      )}

      {current ? (
        <View style={s.actions}>
          <TouchableOpacity style={[s.act, s.pass]} disabled={busy} onPress={() => act('pass')} activeOpacity={0.85}>
            <Ionicons name="close" size={30} color="#ff6b6b" />
          </TouchableOpacity>
          <TouchableOpacity style={[s.act, s.like]} disabled={busy} onPress={() => act('like')} activeOpacity={0.85}>
            <Ionicons name="heart" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
      ) : null}

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
  const [city, setCity] = useState(initial.city || '')
  const [element, setElement] = useState<string | null>(initial.element || null)
  const [minAge, setMinAge] = useState(initial.minAge ? String(initial.minAge) : '')
  const [maxAge, setMaxAge] = useState(initial.maxAge ? String(initial.maxAge) : '')
  const [interests, setInterests] = useState<string[]>(initial.interests || [])
  const toggle = (slug: string) => setInterests((p: string[]) => p.includes(slug) ? p.filter((x) => x !== slug) : [...p, slug])
  const apply = () => onApply({
    city: city.trim() || undefined,
    element: element || undefined,
    minAge: minAge ? Number(minAge) : undefined,
    maxAge: maxAge ? Number(maxAge) : undefined,
    interests: interests.length ? interests : undefined,
  })
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={s.sheetBack}>
        <View style={s.sheet}>
          <ScrollView contentContainerStyle={{ padding: 18 }}>
            <Text style={s.sheetTitle}>{tl('Filtros', 'Filters', 'Filtros', 'Filtri')}</Text>
            <Text style={s.flabel}>{tl('Cidade', 'City', 'Ciudad', 'Citta')}</Text>
            <TextInput style={s.finput} value={city} onChangeText={setCity} placeholder={tl('Qualquer', 'Any', 'Cualquiera', 'Qualsiasi')} placeholderTextColor={C.dim} />
            <Text style={s.flabel}>{tl('Elemento', 'Element', 'Elemento', 'Elemento')}</Text>
            <View style={s.chips}>
              {ELEMENTS.map((e) => (
                <TouchableOpacity key={e} style={[s.chip, element === e && s.chipOn]} onPress={() => setElement(element === e ? null : e)}>
                  <Text style={[s.chipTx, element === e && s.chipTxOn]}>{tl(e === 'fogo' ? 'Fogo' : e === 'terra' ? 'Terra' : e === 'ar' ? 'Ar' : 'Água', e === 'fogo' ? 'Fire' : e === 'terra' ? 'Earth' : e === 'ar' ? 'Air' : 'Water', e === 'fogo' ? 'Fuego' : e === 'terra' ? 'Tierra' : e === 'ar' ? 'Aire' : 'Agua', e === 'fogo' ? 'Fuoco' : e === 'terra' ? 'Terra' : e === 'ar' ? 'Aria' : 'Acqua')}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={s.flabel}>{tl('Faixa etária', 'Age range', 'Rango de edad', 'Fascia eta')}</Text>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TextInput style={[s.finput, { flex: 1 }]} value={minAge} onChangeText={setMinAge} placeholder={tl('mín', 'min', 'min', 'min')} placeholderTextColor={C.dim} keyboardType="number-pad" />
              <TextInput style={[s.finput, { flex: 1 }]} value={maxAge} onChangeText={setMaxAge} placeholder={tl('máx', 'max', 'max', 'max')} placeholderTextColor={C.dim} keyboardType="number-pad" />
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
  cardBox: { backgroundColor: C.card, borderRadius: 22, overflow: 'hidden', borderWidth: 1, borderColor: C.line, shadowColor: C.magenta, shadowOpacity: 0.25, shadowRadius: 18, shadowOffset: { width: 0, height: 8 }, elevation: 8 },
  photoWrap: { width: '100%', height: 440, position: 'relative' },
  photo: { width: '100%', height: '100%', backgroundColor: '#000' },
  photoFb: { alignItems: 'center', justifyContent: 'center', backgroundColor: '#0d0d1c' },
  grad: { position: 'absolute', left: 0, right: 0, bottom: 0, height: '70%' },
  ring: { position: 'absolute', top: 14, right: 14, width: 62, height: 62, borderRadius: 31, borderWidth: 2.5, borderColor: C.magenta, backgroundColor: 'rgba(12,8,24,0.55)', alignItems: 'center', justifyContent: 'center' },
  ringPct: { color: '#fff', fontSize: 19, fontWeight: '900', lineHeight: 20 },
  ringSym: { fontSize: 11, fontWeight: '700' },
  ringLbl: { color: '#fff', fontSize: 8, fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase', opacity: 0.85 },
  overlay: { position: 'absolute', left: 18, right: 18, bottom: 16 },
  name: { color: '#fff', fontSize: 25, fontWeight: '900' },
  age: { color: 'rgba(255,255,255,0.9)', fontSize: 22, fontWeight: '600' },
  city: { color: 'rgba(255,255,255,0.9)', fontSize: 14, marginTop: 4 },
  signs: { color: C.gold, fontSize: 14, marginTop: 8, fontWeight: '700', letterSpacing: 0.3 },
  detail: { padding: 16 },
  tierLabel: { color: C.magenta, fontSize: 15, fontWeight: '800', marginBottom: 6 },
  detailHead: { color: C.dim, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 10, marginBottom: 4 },
  harmonic: { color: C.tx, fontSize: 13, lineHeight: 19 },
  tension: { color: C.gold, fontSize: 13, lineHeight: 19 },
  reason: { color: C.dim, fontSize: 13 },
  common: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10 },
  commonChip: { backgroundColor: 'rgba(214,64,159,0.16)', borderRadius: 14, paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderColor: 'rgba(214,64,159,0.35)' },
  commonTx: { color: C.tx, fontSize: 12, fontWeight: '600' },
  actions: { flexDirection: 'row', justifyContent: 'center', gap: 28, marginTop: 18 },
  act: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', borderWidth: 2 },
  pass: { backgroundColor: C.card, borderColor: '#ff6b6b' },
  like: { backgroundColor: C.magenta, borderColor: C.magenta },
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
