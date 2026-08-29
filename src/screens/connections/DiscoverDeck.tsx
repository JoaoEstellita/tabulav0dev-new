import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Modal, TextInput, ScrollView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { getDoc, doc } from 'firebase/firestore'
import { db } from '../../config/firebase'
import { useAuth } from '../../hooks/useAuth'
import { useAppLanguage } from '../../hooks/useAppLanguage'
import { getDeck, swipe, type DeckCard, type DeckFilters } from '../../services/DiscoveryService'
import { NETWORK_INTERESTS, interestLabel, interestEmoji, type NetworkLang } from '../../constants/networkInterests'

const C = { bg: '#141428', card: '#1c1c34', line: '#2a2a44', gold: '#e8b84b', magenta: '#d6409f', good: '#3ecf8e', tx: '#eaeaf5', dim: '#8892a4' }
const ELEMENTS = ['fogo', 'terra', 'ar', 'agua'] as const

export default function DiscoverDeck() {
  const { user } = useAuth()
  const { language } = useAppLanguage()
  const lang = language as NetworkLang
  const tl = (pt: string, en: string, es: string, it: string) =>
    ({ 'pt-BR': pt, 'en-US': en, 'es-ES': es, 'it-IT': it }[lang] || pt)

  const [cards, setCards] = useState<DeckCard[]>([])
  const [idx, setIdx] = useState(0)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [matchWith, setMatchWith] = useState<DeckCard | null>(null)
  const [myPhoto, setMyPhoto] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<DeckFilters>({})

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
        <TouchableOpacity style={s.filterBtn} onPress={() => setShowFilters(true)}>
          <Ionicons name="options-outline" size={18} color={C.gold} />
          <Text style={s.filterTx}>{tl('Filtros', 'Filters', 'Filtros', 'Filtri')}</Text>
        </TouchableOpacity>
      </View>

      {!current ? (
        <View style={s.empty}>
          <Ionicons name="planet-outline" size={42} color={C.dim} />
          <Text style={s.emptyTx}>{tl('Por agora acabaram. Ajuste os filtros ou volte depois.', 'That is all for now. Adjust filters or come back later.', 'Por ahora se acabaron. Ajusta filtros o vuelve luego.', 'Per ora e tutto. Regola i filtri o torna dopo.')}</Text>
          <TouchableOpacity style={s.reload} onPress={() => load(filters)}><Text style={s.reloadTx}>{tl('Recarregar', 'Reload', 'Recargar', 'Ricarica')}</Text></TouchableOpacity>
        </View>
      ) : (
        <View style={s.cardBox}>
          <Image source={{ uri: (current.photos && current.photos[0]) || current.photoURL || undefined }} style={s.photo} />
          <View style={s.scoreChip}><Ionicons name="heart" size={12} color="#fff" /><Text style={s.scoreTx}>{Math.round(current.score)}%</Text></View>
          <View style={s.info}>
            <Text style={s.name}>{current.displayName}{current.age ? <Text style={s.age}>, {current.age}</Text> : null}</Text>
            {current.city ? <Text style={s.city}>📍 {current.city}</Text> : null}
            <Text style={s.signs}>☉ {current.sunSign || '—'}  ·  ☽ {current.moonSign || '—'}  ·  ASC {current.ascSign || '—'}</Text>
            {current.reasons?.length ? (
              <View style={s.reasons}>
                {current.reasons.slice(0, 3).map((r, i) => <Text key={i} style={s.reason}>✨ {r}</Text>)}
              </View>
            ) : null}
            {current.common?.length ? (
              <View style={s.common}>
                {current.common.map((c) => <View key={c} style={s.commonChip}><Text style={s.commonTx}>{interestEmoji(c)} {interestLabel(c, lang)}</Text></View>)}
              </View>
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
          <Text style={s.matchTitle}>{tl('Deu Match! 💘', 'It is a Match! 💘', 'Hubo Match! 💘', 'E Match! 💘')}</Text>
          <View style={s.matchRow}>
            <Image source={{ uri: myPhoto || undefined }} style={s.matchPhoto} />
            <Ionicons name="heart" size={30} color={C.magenta} style={{ marginHorizontal: -8, zIndex: 2 }} />
            <Image source={{ uri: (matchWith?.photos && matchWith.photos[0]) || matchWith?.photoURL || undefined }} style={s.matchPhoto} />
          </View>
          <Text style={s.matchSub}>{tl(`Você e ${matchWith?.displayName || ''} combinaram. Agora podem se falar.`, `You and ${matchWith?.displayName || ''} matched. Now you can talk.`, `Tu y ${matchWith?.displayName || ''} combinaron. Ahora pueden hablar.`, `Tu e ${matchWith?.displayName || ''} avete combinato. Ora potete parlare.`)}</Text>
          <TouchableOpacity style={s.matchCta} onPress={() => setMatchWith(null)}><Text style={s.matchCtaTx}>{tl('Continuar', 'Continue', 'Continuar', 'Continua')}</Text></TouchableOpacity>
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
  cardBox: { backgroundColor: C.card, borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: C.line },
  photo: { width: '100%', height: 360, backgroundColor: '#000' },
  scoreChip: { position: 'absolute', top: 12, right: 12, flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: C.magenta, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 14 },
  scoreTx: { color: '#fff', fontSize: 13, fontWeight: '800' },
  info: { padding: 16 },
  name: { color: C.tx, fontSize: 21, fontWeight: '800' },
  age: { color: C.dim, fontSize: 19, fontWeight: '600' },
  city: { color: C.dim, fontSize: 14, marginTop: 3 },
  signs: { color: C.gold, fontSize: 13, marginTop: 8, fontWeight: '600' },
  reasons: { marginTop: 10, gap: 3 },
  reason: { color: C.tx, fontSize: 13 },
  common: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 12 },
  commonChip: { backgroundColor: 'rgba(214,64,159,0.16)', borderRadius: 14, paddingHorizontal: 10, paddingVertical: 5 },
  commonTx: { color: C.tx, fontSize: 12, fontWeight: '600' },
  actions: { flexDirection: 'row', justifyContent: 'center', gap: 28, marginTop: 18 },
  act: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', borderWidth: 2 },
  pass: { backgroundColor: C.card, borderColor: '#ff6b6b' },
  like: { backgroundColor: C.magenta, borderColor: C.magenta },
  empty: { alignItems: 'center', paddingVertical: 44, gap: 12 },
  emptyTx: { color: C.dim, fontSize: 14, textAlign: 'center', paddingHorizontal: 24 },
  reload: { backgroundColor: C.card, borderRadius: 12, paddingHorizontal: 20, paddingVertical: 10, borderWidth: 1, borderColor: C.line },
  reloadTx: { color: C.gold, fontWeight: '700' },
  matchBack: { flex: 1, backgroundColor: 'rgba(10,6,20,0.94)', alignItems: 'center', justifyContent: 'center', padding: 28 },
  matchTitle: { color: C.tx, fontSize: 28, fontWeight: '900', marginBottom: 26 },
  matchRow: { flexDirection: 'row', alignItems: 'center' },
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
