import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useAppLanguage } from '../hooks/useAppLanguage'
import { getSynastry, type SynastryResult } from '../services/DiscoveryService'
import SynastryWheel from './SynastryWheel'
import { resolvePlanetInSignText } from '../utils/natalInterpretation'

// Camada de signos (o "tempero"): planeta pessoal → signo pela longitude.
const SYN_SIGN_TOK = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces']
const SYN_SIGN_PT = ['Áries', 'Touro', 'Gêmeos', 'Câncer', 'Leão', 'Virgem', 'Libra', 'Escorpião', 'Sagitário', 'Capricórnio', 'Aquário', 'Peixes']
const SYN_PLANET_PT: Record<string, string> = { sun: 'Sol', moon: 'Lua', mercury: 'Mercúrio', venus: 'Vênus', mars: 'Marte' }
const SYN_PERSONAL = ['sun', 'moon', 'mercury', 'venus', 'mars']
const synSignIdx = (lon: number) => Math.floor((((lon % 360) + 360) % 360) / 30)
const synFirstSentence = (t: string) => { const i = t.search(/[.!?]\s/); return i > 0 ? t.slice(0, i + 1) : t }
import AspectGrid, { transitCellId } from './AspectGrid'
import SynastryAspectDetailModal from './SynastryAspectDetailModal'
import { useAuth } from '../hooks/useAuth'
import { db } from '../config/firebase'
import { doc, getDoc } from 'firebase/firestore'
import SynastryTabs from './SynastryTabs'
import { tzolkinMatchScore } from '../astro/tzolkin'

const TZOLKIN_ENABLED = process.env.EXPO_PUBLIC_TZOLKIN_ENABLED !== '0'
const CHINESE_ENABLED = process.env.EXPO_PUBLIC_CHINESE_ENABLED !== '0'
const VEDIC_ENABLED = process.env.EXPO_PUBLIC_VEDIC_ENABLED !== '0'
// Peso do Tzolkin na "Visão Integrada" exibida (astro continua base). '0' esconde o combinado.
const TZ_DISPLAY_WEIGHT = Math.max(0, Math.min(1, Number(process.env.EXPO_PUBLIC_TZOLKIN_MATCH_WEIGHT ?? '0.3')))

/**
 * Modal de sinastria com UMA pessoa (conexão). Mesmo componente de roda + grade
 * do Match/Grupos — busca via `getSynastry` (PAGA). Reutilizável em qualquer
 * lugar que tenha um uid: lista de conexões, etc.
 */
const C = { bg: '#0F0F23', card: '#161728', line: 'rgba(255,255,255,0.12)', gold: '#FFD700', magenta: '#FF4D8D', tx: '#EDEBF7', dim: '#9A9CB8' }
const CAP: Record<string, string> = { sun: 'Sun', moon: 'Moon', mercury: 'Mercury', venus: 'Venus', mars: 'Mars', jupiter: 'Jupiter', saturn: 'Saturn', uranus: 'Uranus', neptune: 'Neptune', pluto: 'Pluto' }

export default function SynastryModal({ visible, uid, name, onClose, targetBirth }: { visible: boolean; uid: string | null; name: string | null; onClose: () => void; targetBirth?: { datetime?: string; coordinates?: { longitude?: number } } | null }) {
  const { language } = useAppLanguage()
  const tl = (pt: string, en: string, es: string, it: string) =>
    ({ 'pt-BR': pt, 'en-US': en, 'es-ES': es, 'it-IT': it } as any)[language] || pt
  const [data, setData] = useState<SynastryResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [detail, setDetail] = useState<{ mine: string; theirs: string; aspect: string; orb: number } | null>(null)
  const { user } = useAuth()
  type Person = { date?: string; time?: string; lon?: number }
  const [people, setPeople] = useState<{ a?: Person; b?: Person }>({})

  useEffect(() => {
    if (!visible || !uid) return
    setData(null); setLoading(true)
    // Sinastria é LIVRE. Em erro/404 (alvo não-descobrível) mantém um objeto mínimo
    // pra ainda mostrar as lentes (Tzolkin/Chinês/Védico) a partir do birthData.
    getSynastry(uid).then((d) => setData(d || ({ premium: true, aspects: [] } as any)))
      .catch(() => setData({ premium: true, aspects: [] } as any)).finally(() => setLoading(false))
  }, [visible, uid])

  // Sinastrias simbólicas (Tzolkin/Chinês/Védico): nascimento das 2 pessoas (aditivo, gated).
  useEffect(() => {
    if (!visible || !uid || !user?.uid) { setPeople({}); return }
    const toPerson = (d: any): Person => {
      const loc = d?.birthLocation || d?.birthData?.birthLocation || d?.birthData?.coordinates
      // birthDate top-level ou aninhada (birthData.birthDate / datetime "YYYY-MM-DD...").
      const dt = String(d?.birthData?.datetime || '')
      const date = d?.birthDate || d?.birthData?.birthDate || (dt.length >= 10 ? dt.slice(0, 10) : undefined)
      const time = d?.birthTime || d?.birthData?.birthTime || (dt.length >= 16 ? dt.slice(11, 16) : undefined)
      return { date, time, lon: typeof loc?.longitude === 'number' ? loc.longitude : undefined }
    }
    // Alvo pode ser perfil GERENCIADO (sem doc users) — nesse caso usa o birthData passado
    // pelo grupo, senão as lentes ficariam sem data e só sobraria a aba Astral.
    const dt = String(targetBirth?.datetime || '')
    const targetPerson: Person | null = dt.length >= 10
      ? { date: dt.slice(0, 10), time: dt.length >= 16 ? dt.slice(11, 16) : undefined, lon: targetBirth?.coordinates?.longitude }
      : null
    Promise.all([
      getDoc(doc(db, 'users', user.uid)).then(s => toPerson(s.data())).catch(() => ({} as Person)),
      targetPerson ? Promise.resolve(targetPerson) : getDoc(doc(db, 'users', uid)).then(s => toPerson(s.data())).catch(() => ({} as Person)),
    ]).then(([a, b]) => setPeople({ a, b: (b?.date ? b : targetPerson) || b }))
  }, [visible, uid, user?.uid, targetBirth?.datetime])

  const moonOf = (pos?: { planetEn: string; longitude: number }[]) => {
    const m = (pos || []).find((p) => p.planetEn === 'moon')
    return typeof m?.longitude === 'number' ? m.longitude : null
  }

  const wheelAspects = (data?.aspects || []).map((a) => ({ mine: a.mine, theirs: a.theirs, labelPt: a.aspect, orb: a.orb }))
  const gridAspects = (data?.aspects || []).map((a) => ({ planet1: CAP[a.mine] || a.mine, planet2: CAP[a.theirs] || a.theirs, type: a.aspect, orb: a.orb }))
  const toGrid = (pos?: { planetEn: string; longitude: number }[]) => (pos || []).map((p) => ({ name: CAP[p.planetEn] || p.planetEn, longitude: p.longitude }))

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={s.screen}>
        <View style={s.head}>
          <Text style={s.title} numberOfLines={1}>{tl('Sinastria', 'Synastry', 'Sinastria', 'Sinastria')}{name ? ` · ${name}` : ''}</Text>
          <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}><Ionicons name="close" size={26} color={C.dim} /></TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
          {loading ? <ActivityIndicator color={C.gold} style={{ marginTop: 30 }} /> : !data ? (
            <Text style={s.empty}>{tl('Não consegui carregar a sinastria.', 'Could not load synastry.', 'No pude cargar la sinastria.', 'Non ho caricato la sinastria.')}</Text>
          ) : data.premium === false ? (
            <View style={s.paywall}>
              <Text style={s.paywallEmoji}>🔒</Text>
              <Text style={s.paywallTitle}>{tl('Sinastria é da assinatura', 'Synastry is a subscription feature', 'La sinastria es de la suscripcion', 'La sinastria e dell abbonamento')}</Text>
              <Text style={s.paywallBody}>{tl('No modo gratuito você vê o seu próprio mapa. Comparar com quem você ama — a leitura da dupla nos 4 sistemas — começa no Essential (a partir de R$ 19,90/mês).', 'On the free plan you see your own chart. Comparing with someone you love — the pair reading across the 4 systems — starts on Essential.', 'En el plan gratis ves tu propia carta. Comparar con alguien empieza en Essential.', 'Nel piano gratuito vedi la tua carta. Confrontare con qualcuno inizia con Essential.')}</Text>
            </View>
          ) : (
            <>
              {typeof data.score === 'number' ? (
                <View style={s.scoreBox}>
                  <Text style={s.scorePct}>{Math.round(typeof data.combinedScore === 'number' ? data.combinedScore : data.score)}<Text style={s.scoreSym}>%</Text></Text>
                  <Text style={s.scoreLbl}>{typeof data.combinedScore === 'number' && data.combinedScore !== Math.round(data.score) ? tl('afinidade integrada', 'integrated affinity', 'afinidad integrada', 'affinita integrata') : tl('afinidade', 'affinity', 'afinidad', 'affinita')}</Text>
                </View>
              ) : null}

              {typeof data.combinedScore === 'number' ? (() => {
                // Mesma fonte do deck (backend): Astro + cada sistema com dado → integrado.
                const parts = [`${tl('Astro', 'Astro', 'Astro', 'Astro')} ${Math.round(data.score || 0)}%`]
                if (data.tzolkinScore != null) parts.push(`Tzolkin ${Math.round(data.tzolkinScore)}%`)
                if (data.vedicScore != null) parts.push(`${tl('Védico', 'Vedic', 'Vedico', 'Vedico')} ${Math.round(data.vedicScore)}%`)
                if (data.chineseScore != null) parts.push(`${tl('Chinês', 'Chinese', 'Chino', 'Cinese')} ${Math.round(data.chineseScore)}%`)
                return parts.length > 1 ? (
                  <Text style={{ color: '#8892a4', fontSize: 12, textAlign: 'center', marginTop: -6, marginBottom: 14 }}>{parts.join(' · ')} → {Math.round(data.combinedScore!)}%</Text>
                ) : null
              })() : null}

              {(() => {
                const signList = (pos?: { planetEn: string; longitude: number }[]) => SYN_PERSONAL
                  .map((pl) => { const p = (pos || []).find((x) => x.planetEn === pl); return p ? `${SYN_PLANET_PT[pl]} em ${SYN_SIGN_PT[synSignIdx(p.longitude)]}` : null })
                  .filter(Boolean).join(' · ')
                const curatedSigns = (pos?: { planetEn: string; longitude: number }[], who?: string) => ['sun', 'moon', 'venus']
                  .map((pl) => { const p = (pos || []).find((x) => x.planetEn === pl); if (!p) return null; const t = resolvePlanetInSignText(pl, SYN_SIGN_TOK[synSignIdx(p.longitude)], language); return t ? `${who} — ${SYN_PLANET_PT[pl]} em ${SYN_SIGN_PT[synSignIdx(p.longitude)]}: ${synFirstSentence(t)}` : null })
                  .filter(Boolean) as string[]
                const uSigns = signList(data.myPositions); const tSigns = signList(data.positions)
                const astralNode = (data.myPositions?.length && data.positions?.length) ? (
                  <>
                    {(uSigns || tSigns) ? (
                      <View style={{ marginBottom: 14, backgroundColor: 'rgba(245,197,66,.07)', borderRadius: 12, padding: 12 }}>
                        <Text style={s.sect}>{tl('O tempero de cada um (planetas por signo)', 'Each one\'s flavor (planets by sign)', 'El toque de cada uno', 'Il carattere di ciascuno')}</Text>
                        {uSigns ? <Text style={{ color: '#efedfb', fontSize: 13, fontWeight: '700', marginBottom: 3 }}>{tl('Você', 'You', 'Tu', 'Tu')} — {uSigns}</Text> : null}
                        {tSigns ? <Text style={{ color: '#efedfb', fontSize: 13, fontWeight: '700' }}>{name || tl('a pessoa', 'them', 'la persona', 'la persona')} — {tSigns}</Text> : null}
                        {[...curatedSigns(data.myPositions, tl('Você', 'You', 'Tu', 'Tu')), ...curatedSigns(data.positions, name || '')].slice(0, 6).map((l, i) => (
                          <Text key={i} style={{ color: '#c9c5e2', fontSize: 12, lineHeight: 17, marginTop: 5 }}>• {l}</Text>
                        ))}
                      </View>
                    ) : null}
                    <Text style={s.sect}>{tl('Roda de sinastria', 'Synastry wheel', 'Rueda de sinastria', 'Ruota di sinastria')}</Text>
                    <SynastryWheel outer={data.myPositions} inner={data.positions} aspects={wheelAspects} size={310} outerLabel={tl('Você', 'You', 'Tu', 'Tu')} innerLabel={name || ''} />
                    <View style={{ marginTop: 14 }}>
                      <Text style={s.sect}>{tl('Grade de aspectos', 'Aspect grid', 'Grilla de aspectos', 'Griglia aspetti')}</Text>
                      <Text style={s.hint}>{tl('Toque num aspecto para a leitura da dupla', 'Tap an aspect for the pair reading', 'Toca un aspecto para la lectura de la pareja', 'Tocca un aspetto per la lettura della coppia')}</Text>
                      <AspectGrid cross rowPlanets={toGrid(data.myPositions)} colPlanets={toGrid(data.positions)} aspects={gridAspects}
                        onSelectCell={(cellId) => { const hit = (data.aspects || []).find((a) => transitCellId(CAP[a.mine] || a.mine, a.aspect, CAP[a.theirs] || a.theirs) === cellId); if (hit) setDetail(hit) }} />
                    </View>
                  </>
                ) : <Text style={s.empty}>{tl('Sem aspectos pessoais relevantes.', 'No relevant personal aspects.', 'Sin aspectos personales relevantes.', 'Nessun aspetto personale rilevante.')}</Text>
                const both = people.a?.date && people.b?.date
                const tzolkin = both ? { aDateISO: people.a!.date!, bDateISO: people.b!.date! } : null
                const chinese = both ? { aBirth: { birthDate: people.a!.date, birthTime: people.a!.time, longitude: people.a!.lon }, bBirth: { birthDate: people.b!.date, birthTime: people.b!.time, longitude: people.b!.lon } } : null
                const vedic = (both && moonOf(data.myPositions) != null && moonOf(data.positions) != null) ? { aMoonLon: moonOf(data.myPositions), aBirthDate: people.a!.date, bMoonLon: moonOf(data.positions), bBirthDate: people.b!.date } : null
                return <SynastryTabs aName={tl('Você', 'You', 'Tu', 'Tu')} bName={name || undefined} astral={astralNode} tzolkin={tzolkin} chinese={chinese} vedic={vedic} />
              })()}
            </>
          )}
        </ScrollView>
      </View>
      <SynastryAspectDetailModal
        visible={!!detail}
        aspect={detail}
        nameA={tl('Você', 'You', 'Tu', 'Tu')}
        nameB={name || ''}
        onClose={() => setDetail(null)}
      />
    </Modal>
  )
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.bg, paddingTop: 52 },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 8 },
  title: { color: C.tx, fontSize: 20, fontWeight: '900', flex: 1, marginRight: 12 },
  sect: { color: C.dim, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6, marginTop: 4 },
  scoreBox: { alignItems: 'center', marginBottom: 16 },
  scorePct: { color: C.magenta, fontSize: 40, fontWeight: '900' },
  scoreSym: { fontSize: 20 },
  scoreLbl: { color: C.dim, fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
  empty: { color: C.dim, fontSize: 14, textAlign: 'center', marginTop: 16, paddingHorizontal: 20, lineHeight: 20 },
  paywall: { alignItems: 'center', marginTop: 24, paddingHorizontal: 22, backgroundColor: 'rgba(255,215,0,0.06)', borderWidth: 1, borderColor: 'rgba(255,215,0,0.3)', borderRadius: 16, paddingVertical: 26 },
  paywallEmoji: { fontSize: 34, marginBottom: 8 },
  paywallTitle: { color: C.gold, fontSize: 18, fontWeight: '900', textAlign: 'center', marginBottom: 8 },
  paywallBody: { color: C.tx, fontSize: 14, lineHeight: 20, textAlign: 'center' },
  hint: { color: C.dim, fontSize: 12, marginBottom: 8, fontStyle: 'italic' },
  emptyCard: { alignItems: 'center', gap: 12, paddingVertical: 40 },
})
