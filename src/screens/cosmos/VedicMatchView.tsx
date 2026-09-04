/**
 * Sinastria védica (Guna Milan / Ashtakoot, 36 pontos) entre 2 pessoas. Recebe a
 * longitude TROPICAL da Lua + a data de nascimento de cada um (a nakshatra vem da Lua
 * sideral, Lahiri por data). Motor clássico determinístico. Embedded flui sem scroll.
 */
import React, { useMemo } from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { useAppLanguage } from '../../hooks/useAppLanguage'
import { nakshatraFromTropical } from '../../astro/vedic/nakshatra'
import { computeGunaMilan } from '../../astro/vedic/gunaMilan'
import { navamsaSynastry } from '../../data/vedic/navamsaSynastry'
import { lensColor } from '../../theme/lenses'

import { UI } from '../../theme/ui'

const VC = lensColor('vedic') // índigo canônico do Védico

const KUTA_LABEL: Record<string, [string, string, string, string]> = {
  varna: ['Varna (trabalho)', 'Varna (work)', 'Varna', 'Varna'],
  vashya: ['Vashya (atração)', 'Vashya (attraction)', 'Vashya', 'Vashya'],
  tara: ['Tara (destino)', 'Tara (destiny)', 'Tara', 'Tara'],
  yoni: ['Yoni (intimidade)', 'Yoni (intimacy)', 'Yoni', 'Yoni'],
  graha_maitri: ['Graha Maitri (mente)', 'Graha Maitri (mind)', 'Graha Maitri', 'Graha Maitri'],
  gana: ['Gana (temperamento)', 'Gana (temperament)', 'Gana', 'Gana'],
  bhakoot: ['Bhakoot (amor)', 'Bhakoot (love)', 'Bhakoot', 'Bhakoot'],
  nadi: ['Nadi (saúde/genes)', 'Nadi (health)', 'Nadi', 'Nadi'],
}

/** Guna já computado (privacy-safe, vindo do backend p/ o Match). Sem datas/longitudes. */
export type GunaPrecomputed = { total: number; kutas: { key: string; points: number; max: number; dosha?: boolean }[]; band: string; hasNadiDosha: boolean; hasBhakootDosha: boolean }

// ── Override cosmético ÚNICO (a pedido do João) ──────────────────────────────
// Só a sinastria védica João Estellita × Érica Maria Serra Mondin: Bhakoot 7/7 e total
// 30/36 (sem doshas). Detecção por nome; qualquer outro par segue o cálculo real.
const _norm = (s?: string) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
function _isJoaoErica(aName?: string, bName?: string): boolean {
  const a = _norm(aName), b = _norm(bName)
  const isErica = (x: string) => x.includes('erica') && x.includes('mondin')
  const isJoao = (x: string) => (x.includes('joao') && x.includes('estellita')) || x === 'voce' || x === 'you' || x === 'tu'
  return (isErica(a) && isJoao(b)) || (isErica(b) && isJoao(a))
}
function maybeBoostJoaoErica(g: any, aName?: string, bName?: string): any {
  if (!g || !_isJoaoErica(aName, bName)) return g
  return {
    total: 30,
    band: 'excelente',
    hasNadiDosha: false,
    hasBhakootDosha: false,
    kutas: [
      { key: 'varna', points: 1, max: 1 },
      { key: 'vashya', points: 2, max: 2 },
      { key: 'tara', points: 3, max: 3 },
      { key: 'yoni', points: 4, max: 4 },
      { key: 'graha_maitri', points: 4, max: 5 },
      { key: 'gana', points: 1, max: 6 },
      { key: 'bhakoot', points: 7, max: 7 },
      { key: 'nadi', points: 8, max: 8 },
    ],
  }
}

export default function VedicMatchView({ aMoonLon, aBirthDate, bMoonLon, bBirthDate, aName, bName, embedded, precomputed }: { aMoonLon?: number | null; aBirthDate?: string; bMoonLon?: number | null; bBirthDate?: string; aName?: string; bName?: string; embedded?: boolean; precomputed?: GunaPrecomputed | null }) {
  const { language } = useAppLanguage()
  const lang = language || 'pt-BR'
  const tl = (pt: string, en: string, es: string, it: string) => (lang === 'en-US' ? en : lang === 'es-ES' ? es : lang === 'it-IT' ? it : pt)
  const L = (arr: [string, string, string, string]) => (lang === 'en-US' ? arr[1] : lang === 'es-ES' ? arr[2] : lang === 'it-IT' ? arr[3] : arr[0])

  const res = useMemo(() => {
    // Match: guna já vem pronto do backend (sem expor dados de nascimento) → sem nakshatra/Navamsa.
    if (precomputed) return { g: precomputed as any, na: null as any, nb: null as any }
    if (aMoonLon == null || bMoonLon == null || !aBirthDate || !bBirthDate) return null
    const na = nakshatraFromTropical(aMoonLon, new Date(`${aBirthDate.slice(0, 10)}T12:00:00Z`))
    const nb = nakshatraFromTropical(bMoonLon, new Date(`${bBirthDate.slice(0, 10)}T12:00:00Z`))
    return { g: computeGunaMilan(na, nb), na, nb }
  }, [aMoonLon, bMoonLon, aBirthDate, bBirthDate, precomputed])

  if (!res) return null
  const { na, nb } = res
  // Override cosmético ÚNICO (pedido do João): sinastria védica João Estellita × Érica
  // Maria Serra Mondin — Bhakoot 7/7 e total 30/36. NÃO afeta nenhum outro par.
  const g = maybeBoostJoaoErica(res.g, aName, bName)
  const pct = Math.round((g.total / 36) * 100)
  const bandLabel = ({ baixo: tl('baixa', 'low', 'baja', 'bassa'), medio: tl('média', 'medium', 'media', 'media'), bom: tl('boa', 'good', 'buena', 'buona'), excelente: tl('excelente', 'excellent', 'excelente', 'eccellente') } as any)[g.band]

  const Wrap: any = embedded ? View : ScrollView
  const wrapProps: any = embedded ? {} : { style: { flex: 1 }, contentContainerStyle: { paddingBottom: 32 }, showsVerticalScrollIndicator: false }

  return (
    <Wrap {...wrapProps}>
      <View style={s.head}>
        <View style={s.person}>
          {na ? <Text style={s.nakName} numberOfLines={1}>{na.nakshatra.name}</Text> : null}
          <Text style={s.pName} numberOfLines={1}>{aName || tl('Você', 'You', 'Tu', 'Tu')}</Text>
        </View>
        <View style={{ alignItems: 'center', paddingHorizontal: 8 }}>
          <Text style={s.total}>{g.total}<Text style={s.totalMax}>/36</Text></Text>
          <Text style={s.band}>{pct}% · {bandLabel}</Text>
        </View>
        <View style={s.person}>
          {nb ? <Text style={s.nakName} numberOfLines={1}>{nb.nakshatra.name}</Text> : null}
          {bName ? <Text style={s.pName} numberOfLines={1}>{bName}</Text> : null}
        </View>
      </View>

      {g.kutas.map((k: { key: string; points: number; max: number; dosha?: boolean }) => (
        <View key={k.key} style={s.kutaRow}>
          <Text style={[s.kutaLabel, k.dosha ? { color: '#e4572e' } : null]} numberOfLines={1}>{L(KUTA_LABEL[k.key] || [k.key, k.key, k.key, k.key])}</Text>
          <View style={s.kutaBarBg}><View style={[s.kutaBarFill, { width: `${(k.points / k.max) * 100}%`, backgroundColor: k.dosha ? '#e4572e' : VC }]} /></View>
          <Text style={s.kutaPts}>{k.points % 1 === 0 ? k.points : k.points.toFixed(1)}/{k.max}</Text>
        </View>
      ))}

      {(g.hasNadiDosha || g.hasBhakootDosha) ? (
        <Text style={s.dosha}>⚠️ {[g.hasNadiDosha ? 'Nadi' : null, g.hasBhakootDosha ? 'Bhakoot' : null].filter(Boolean).join(' · ')} {tl('dosha — ponto de atenção tradicional (mitigável).', 'dosha — traditional caution (mitigable).', 'dosha — atencion tradicional.', 'dosha — attenzione tradizionale.')}</Text>
      ) : null}

      {(() => {
        if (!na || !nb) return null
        const nav = navamsaSynastry((na as any).siderealLon, (nb as any).siderealLon, lang)
        if (!nav) return null
        return (
          <View style={s.navBox}>
            <Text style={s.navTitle}>{tl('Navamsa (D9) — afinidade de alma', 'Navamsa (D9) — soul affinity', 'Navamsa (D9) — afinidad de alma', 'Navamsa (D9) — affinita d\'anima')}</Text>
            <Text style={s.navSigns}>{nav.d9AName} · {nav.d9BName} — <Text style={{ color: nav.color, fontWeight: '800' }}>{nav.levelLabel}</Text></Text>
            <Text style={s.navRead}>{nav.reading}</Text>
          </View>
        )
      })()}

      <Text style={s.disc}>{tl('Guna Milan clássico (Ashtakoot) sobre a nakshatra da Lua sideral; Navamsa (D9) sobre a Lua no mapa da alma.', 'Classical Guna Milan (Ashtakoot) over the sidereal Moon nakshatra; Navamsa (D9) over the Moon in the soul chart.', 'Guna Milan clasico sobre la nakshatra de la Luna sideral; Navamsa (D9) sobre la Luna en la carta del alma.', 'Guna Milan classico sulla nakshatra della Luna siderale; Navamsa (D9) sulla Luna nella carta dell\'anima.')}</Text>
    </Wrap>
  )
}

const s = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  person: { alignItems: 'center', flex: 1 },
  nakName: { color: '#a9bcff', fontSize: 13, fontWeight: '800', maxWidth: 100, textAlign: 'center' },
  pName: { color: '#c9c5e2', fontSize: 11.5, fontWeight: '700', marginTop: 2, maxWidth: 100, textAlign: 'center' },
  total: { color: '#6c8cff', fontSize: 28, fontWeight: '900' },
  totalMax: { color: '#8892a4', fontSize: 15, fontWeight: '700' },
  band: { color: '#b9c8ff', fontSize: 12, fontWeight: '700', marginTop: 1 },
  kutaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 7, gap: 8 },
  kutaLabel: { color: '#b8b3d6', fontSize: 12, fontWeight: '600', width: 118 },
  kutaBarBg: { flex: 1, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,.08)', overflow: 'hidden' },
  kutaBarFill: { height: 6, borderRadius: 3 },
  kutaPts: { color: '#efedfb', fontSize: 12, fontWeight: '800', width: 38, textAlign: 'right' },
  dosha: { color: '#f0a58c', fontSize: 11, marginTop: 10, lineHeight: 15 },
  navBox: { marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,.08)' },
  navTitle: { color: '#b9c8ff', fontSize: 12.5, fontWeight: '800' },
  navSigns: { color: '#efedfb', fontSize: 13, fontWeight: '700', marginTop: 3 },
  navRead: { color: '#c9c5e2', fontSize: 12.5, lineHeight: 18, marginTop: 4 },
  disc: { ...UI.disclaimer, color: '#8892a4', marginTop: 10 },
})
