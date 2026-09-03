/**
 * Conteúdo do MODO VÉDICO da aba Mapa: chart Sul-Indiano (D1) + cards de leitura
 * Jyotish (Lagna, Nakshatra, Dasha, cada graha em Rashi e Bhava). Espelha
 * AstroProfileContent (busca birthInfo, recebe transitData por prop). natalAscDeg
 * vem do CosmosScreen (já resolvido lá).
 */
import React, { useState, useEffect, useMemo } from 'react'
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../config/firebase'
import { useAuth } from '../../hooks/useAuth'
import { useAppLanguage } from '../../hooks/useAppLanguage'
import type { RealPlanetPosition } from '../../services/astrology/RealAstrologyEngine'
import type { LocalTransitData } from '../../services/astrology/LocalAstrologyService'
import { buildVedicChart, RASHIS, currentDasha, buildDashaTimeline, currentAntardasha } from '../../astro/vedic'
import { buildGochara } from '../../astro/vedic/gochara'
import { gocharaReading, planetNameVedic } from '../../data/vedic/gocharaReadings'
import { computeDignity, dignityLabel, dignityNote, dignityColor } from '../../astro/vedic/dignity'
import { navamsaRashi } from '../../astro/vedic/navamsa'
import {
  resolveLagna, resolveNakshatra, resolveDasha, resolvePlanetInRashi, resolvePlanetInBhava,
  resolveNakshatraDeep, deepReadingReady, planetPt, type VedicLang, type VedicGender,
} from '../../utils/vedicInterpretation'
import VedicChartSouth from '../../components/VedicChartSouth'

type Props = {
  transitData: LocalTransitData | null
  loading: boolean
  natalAscDeg: number
  /** Carta de outra pessoa (amigo): pula o getDoc do viewer e usa este nascimento. */
  chartMeta?: { skipSelfFetch?: boolean; birthDate?: string; birthTime?: string }
}

// Ordem de exibição dos grahas (só os védicos).
const GRAHA_ORDER = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu']
const GRAHA_SET = new Set(GRAHA_ORDER)

export function VedicProfileContent({ transitData, loading, natalAscDeg, chartMeta }: Props) {
  const { user } = useAuth()
  const { language } = useAppLanguage()
  const lang = language as VedicLang
  const [birthInfo, setBirthInfo] = useState<{ date?: string; time?: string }>({})
  const [nakGender, setNakGender] = useState<VedicGender>('female')
  const [deepOpen, setDeepOpen] = useState(false)

  const tl = (pt: string, en: string, es: string, it: string) =>
    language === 'en-US' ? en : language === 'es-ES' ? es : language === 'it-IT' ? it : pt

  useEffect(() => {
    if (chartMeta?.skipSelfFetch) {
      setBirthInfo({ date: chartMeta.birthDate, time: chartMeta.birthTime })
      return
    }
    if (!user?.uid) return
    getDoc(doc(db, 'users', user.uid)).then((snap) => {
      const data = snap.data()
      setBirthInfo({ date: data?.birthDate, time: data?.birthTime })
    }).catch(() => {})
  }, [user?.uid, chartMeta?.skipSelfFetch, chartMeta?.birthDate, chartMeta?.birthTime])

  const ct = transitData?.currentTransits
  const natalPlanets: RealPlanetPosition[] = ct?.natalPlanets ?? []
  const transitPlanets: RealPlanetPosition[] = (ct as any)?.planets ?? []

  const vedic = useMemo(() => {
    if (!birthInfo.date || natalPlanets.length === 0 || !Number.isFinite(natalAscDeg)) return null
    const bd = new Date(`${birthInfo.date}T${birthInfo.time || '12:00'}:00`)
    if (Number.isNaN(bd.getTime())) return null
    const chart = buildVedicChart(natalPlanets, natalAscDeg, bd)
    if (!chart) return null
    const moonSid = chart.moonNakshatra?.siderealLon
    const dasha = moonSid != null ? resolveDasha(currentDasha(moonSid, bd), lang) : null
    const timeline = moonSid != null ? buildDashaTimeline(moonSid, bd).slice(0, 5) : []
    const antar = moonSid != null ? currentAntardasha(moonSid, bd) : null
    const gochara = buildGochara(natalPlanets, transitPlanets, bd, new Date())
    return { chart, dasha, timeline, antar, gochara }
  }, [natalPlanets, transitPlanets, birthInfo.date, birthInfo.time, natalAscDeg, lang])

  if (loading && natalPlanets.length === 0) {
    return (
      <View style={styles.loadingWrap}>
        <ActivityIndicator color="#FFD700" />
        <Text style={styles.loadingText}>{tl('Calculando mapa védico…', 'Calculating Vedic chart…', 'Calculando carta védica…', 'Calcolo carta vedica…')}</Text>
      </View>
    )
  }
  if (!vedic) {
    return (
      <View style={styles.card}>
        <Text style={styles.cardText}>
          {tl('Cadastre data, hora e local de nascimento para ver seu mapa védico.',
            'Add your birth date, time and place to see your Vedic chart.',
            'Registra fecha, hora y lugar de nacimiento para ver tu carta védica.',
            'Inserisci data, ora e luogo di nascita per vedere la tua carta vedica.')}
        </Text>
      </View>
    )
  }

  const { chart, dasha, timeline, antar, gochara } = vedic
  const lagnaKey = RASHIS[chart.lagna.rashiIndex].key
  const grahas = GRAHA_ORDER
    .map((n) => chart.planets.find((p) => p.name === n))
    .filter(Boolean) as typeof chart.planets

  const fmtYear = (d?: Date) => (d ? String(d.getUTCFullYear()) : '')

  return (
    <View>
      {/* Chart Sul-Indiano */}
      <View style={styles.chartCard}>
        <VedicChartSouth chart={chart} size={320} />
        <Text style={styles.chartCaption}>
          {tl('Mapa Rasi (D1) — sideral, ayanamsa Lahiri. La = Lagna (Ascendente).',
            'Rasi chart (D1) — sidereal, Lahiri ayanamsa. La = Lagna (Ascendant).',
            'Carta Rasi (D1) — sideral, ayanamsa Lahiri. La = Lagna (Ascendente).',
            'Carta Rasi (D1) — siderale, ayanamsa Lahiri. La = Lagna (Ascendente).')}
        </Text>
      </View>

      {/* Lagna */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{tl('Lagna (Ascendente)', 'Lagna (Ascendant)', 'Lagna (Ascendente)', 'Lagna (Ascendente)')}</Text>
        <Text style={styles.cardValue}>{chart.lagna.rashiName}</Text>
        <Text style={styles.cardText}>{resolveLagna(lagnaKey, lang)}</Text>
      </View>

      {/* Nakshatra da Lua */}
      {chart.moonNakshatra ? (() => {
        const nak = chart.moonNakshatra.nakshatra
        const pada = chart.moonNakshatra.pada
        const r = resolveNakshatra(nak, { pada, rashiName: chart.moonNakshatra.rashi.name, lang })
        // Leitura profunda só aparece se o idioma tem os 27 (pt-BR sempre; en/es/it quando prontos).
        const deep = deepReadingReady(lang) ? resolveNakshatraDeep(nak.key, nakGender, pada, lang) : null
        const SEC = [
          { key: 'fisico', pt: 'Características físicas', en: 'Physical traits', es: 'Rasgos físicos', it: 'Tratti fisici' },
          { key: 'carater', pt: 'Caráter e vida', en: 'Character and life', es: 'Carácter y vida', it: 'Carattere e vita' },
          { key: 'profissao', pt: 'Profissão e renda', en: 'Profession and income', es: 'Profesión e ingresos', it: 'Professione e reddito' },
          { key: 'familia', pt: 'Vida familiar', en: 'Family life', es: 'Vida familiar', it: 'Vita familiare' },
          { key: 'saude', pt: 'Saúde', en: 'Health', es: 'Salud', it: 'Salute' },
        ] as const
        return (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{tl('Nakshatra (mansão lunar)', 'Nakshatra (lunar mansion)', 'Nakshatra (mansión lunar)', 'Nakshatra (dimora lunare)')}</Text>
            <Text style={styles.cardValue}>{r.name} · pada {pada}</Text>
            <Text style={styles.cardLabel}>{tl('regida por', 'ruled by', 'regida por', 'governata da')} {r.lordPt}{r.deity !== '—' ? ` · ${r.deity}` : ''}</Text>
            {r.essencia ? <Text style={styles.cardText}>{r.essencia}{r.personalidade ? `\n\n${r.personalidade}` : ''}</Text> : null}

            {deep ? (
              <>
                <TouchableOpacity style={styles.deepToggleRow} activeOpacity={0.8} onPress={() => setDeepOpen((v) => !v)}>
                  <Text style={styles.deepToggleText}>{deepOpen ? '▾ ' : '▸ '}{tl('Leitura completa', 'Full reading', 'Lectura completa', 'Lettura completa')}</Text>
                </TouchableOpacity>
                {deepOpen ? (
                  <View style={styles.deepBody}>
                    {/* Toggle Feminino / Masculino */}
                    <View style={styles.genderToggle}>
                      <TouchableOpacity style={[styles.genderBtn, nakGender === 'female' && styles.genderBtnActive]} activeOpacity={0.85} onPress={() => setNakGender('female')}>
                        <Text style={[styles.genderBtnText, nakGender === 'female' && styles.genderBtnTextActive]}>{tl('Feminino', 'Female', 'Femenino', 'Femminile')}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.genderBtn, nakGender === 'male' && styles.genderBtnActive]} activeOpacity={0.85} onPress={() => setNakGender('male')}>
                        <Text style={[styles.genderBtnText, nakGender === 'male' && styles.genderBtnTextActive]}>{tl('Masculino', 'Male', 'Masculino', 'Maschile')}</Text>
                      </TouchableOpacity>
                    </View>
                    {SEC.map((s) => (
                      <View key={s.key} style={styles.deepSection}>
                        <Text style={styles.deepSectionTitle}>{tl(s.pt, s.en, s.es, s.it)}</Text>
                        <Text style={styles.cardText}>{deep.reading[s.key]}</Text>
                      </View>
                    ))}
                    {deep.padaText ? (
                      <View style={styles.deepPada}>
                        <Text style={styles.deepSectionTitle}>{tl('Pada', 'Pada', 'Pada', 'Pada')} {pada}{deep.navamsa ? ` · Navamsa ${deep.navamsa}` : ''}</Text>
                        <Text style={styles.cardText}>{deep.padaText}</Text>
                      </View>
                    ) : null}
                  </View>
                ) : null}
              </>
            ) : null}
          </View>
        )
      })() : null}

      {/* Dasha */}
      {dasha ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{tl('Período de vida (Mahadasha)', 'Life period (Mahadasha)', 'Período de vida (Mahadasha)', 'Periodo di vita (Mahadasha)')}</Text>
          <Text style={styles.cardValue}>{dasha.nome}</Text>
          <Text style={styles.cardText}>{dasha.tema}</Text>
          {antar && antar.current ? (
            <Text style={[styles.grahaMeta, { marginTop: 6 }]}>
              {tl('Sub-fase agora (Bhukti)', 'Current sub-phase (Bhukti)', 'Subfase ahora (Bhukti)', 'Sotto-fase ora (Bhukti)')}: <Text style={{ color: '#FFD700' }}>{planetPt(antar.current.lord)}</Text> · {fmtYear(antar.current.start)}–{fmtYear(antar.current.end)}
            </Text>
          ) : null}
          {timeline.length ? (
            <View style={styles.timeline}>
              {timeline.map((p, i) => (
                <Text key={p.lord + i} style={[styles.timelineItem, p.lord === dasha.lord ? styles.timelineNow : null]}>
                  {planetPt(p.lord)} {fmtYear(p.start)}–{fmtYear(p.end)}
                </Text>
              ))}
            </View>
          ) : null}
        </View>
      ) : null}

      {/* Grahas em Rashi + Bhava */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{tl('Grahas (planetas)', 'Grahas (planets)', 'Grahas (planetas)', 'Graha (pianeti)')}</Text>
        {grahas.map((p) => (
          <View key={p.name} style={styles.grahaBlock}>
            <View style={styles.grahaHead}>
              <Text style={styles.grahaName}>{planetPt(p.name.toLowerCase())}{p.retro ? ' ℞' : ''}</Text>
              <Text style={styles.grahaMeta}>{p.rashiName} · {tl('casa', 'house', 'casa', 'casa')} {p.house}</Text>
            </View>
            {(() => {
              const dg = computeDignity(p.name, p.rashiIndex)
              if (dg === 'neutral') return null
              return <Text style={[styles.grahaMeta, { color: dignityColor(dg), marginTop: 2 }]}>★ {dignityLabel(dg, lang)} — {dignityNote(dg, lang)}</Text>
            })()}
            <Text style={styles.cardText}>{resolvePlanetInRashi(p.name, RASHIS[p.rashiIndex].key, lang)}</Text>
            <Text style={styles.grahaBhava}>{resolvePlanetInBhava(p.name, p.house, lang)}</Text>
          </View>
        ))}
      </View>

      {/* Navamsa (D9) — mapa da alma e do casamento */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{tl('Navamsa (D9) — alma e casamento', 'Navamsa (D9) — soul and marriage', 'Navamsa (D9) — alma y matrimonio', 'Navamsa (D9) — anima e matrimonio')}</Text>
        <Text style={styles.cardText}>{tl('O mapa da alma e das relações profundas. Um planeta no MESMO signo no D1 e no D9 é Vargottama — muito forte.', 'The chart of the soul and deep relationships. A planet in the SAME sign in D1 and D9 is Vargottama — very strong.', 'La carta del alma y las relaciones profundas. Un planeta en el MISMO signo en D1 y D9 es Vargottama — muy fuerte.', 'La carta dell\'anima e delle relazioni profonde. Un pianeta nello STESSO segno in D1 e D9 e Vargottama — molto forte.')}</Text>
        <Text style={[styles.grahaMeta, { marginTop: 6 }]}>{tl('Lagna D9', 'D9 Lagna', 'Lagna D9', 'Lagna D9')}: {RASHIS[navamsaRashi(chart.lagna.siderealLon)].name}</Text>
        {grahas.map((p) => {
          const d9 = navamsaRashi(p.siderealLon)
          const vargottama = d9 === p.rashiIndex
          return (
            <View key={p.name} style={styles.grahaHead}>
              <Text style={styles.grahaName}>{planetPt(p.name.toLowerCase())}</Text>
              <Text style={[styles.grahaMeta, vargottama ? { color: '#46d39a' } : null]}>{RASHIS[d9].name}{vargottama ? ' · Vargottama ★' : ''}</Text>
            </View>
          )
        })}
      </View>

      {/* Trânsitos védicos (Gochara) — lidos a partir da Lua natal */}
      {gochara && gochara.items.length ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{tl('Trânsitos de hoje (Gochara)', 'Transits today (Gochara)', 'Transitos de hoy (Gochara)', 'Transiti di oggi (Gochara)')}</Text>
          <Text style={styles.cardText}>{tl(`Lidos a partir da sua Lua em ${gochara.moonRashiName}.`, `Read from your Moon in ${gochara.moonRashiName}.`, `Leidos desde tu Luna en ${gochara.moonRashiName}.`, `Letti dalla tua Luna in ${gochara.moonRashiName}.`)}</Text>
          {gochara.items.map((it) => (
            <View key={it.planet} style={styles.grahaBlock}>
              <View style={styles.grahaHead}>
                <Text style={styles.grahaName}>{planetNameVedic(it.planet, lang)}{it.retro ? ' ℞' : ''}</Text>
                <Text style={[styles.grahaMeta, { color: it.favorable ? '#46d39a' : '#f0a58c' }]}>{it.rashiName} · {tl('casa', 'house', 'casa', 'casa')} {it.houseFromMoon} {it.favorable ? '✓' : '·'}</Text>
              </View>
              <Text style={styles.cardText}>{gocharaReading(it, lang)}</Text>
            </View>
          ))}
          <Text style={[styles.cardText, { marginTop: 8, fontSize: 12, opacity: 0.7 }]}>{tl('Gochara Phala clássico — favorável ou desafiador também depende do conjunto do seu mapa.', 'Classical Gochara Phala — favorable or challenging also depends on your whole chart.', 'Gochara Phala clasico — favorable o desafiante tambien depende de tu carta completa.', 'Gochara Phala classico — favorevole o sfidante dipende anche dalla tua carta completa.')}</Text>
        </View>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  loadingWrap: { padding: 40, alignItems: 'center' },
  loadingText: { color: '#8892a4', marginTop: 10 },
  chartCard: { alignItems: 'center', paddingVertical: 8 },
  chartCaption: { color: '#8892a4', fontSize: 11, fontStyle: 'italic', textAlign: 'center', marginTop: 6, paddingHorizontal: 20 },
  card: { backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,215,0,0.12)', padding: 16, marginHorizontal: 12, marginTop: 12 },
  cardTitle: { color: '#FFD700', fontSize: 13, fontWeight: '700', letterSpacing: 0.5, marginBottom: 8 },
  cardValue: { color: '#FFF', fontSize: 18, fontWeight: '700', marginBottom: 4 },
  cardLabel: { color: '#8892a4', fontSize: 12, marginBottom: 8 },
  cardText: { color: '#D6D9E0', fontSize: 14, lineHeight: 21 },
  timeline: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  timelineItem: { color: '#8892a4', fontSize: 11, backgroundColor: 'rgba(255,255,255,0.05)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  timelineNow: { color: '#1A1A1A', backgroundColor: '#FFD700', fontWeight: '700' },
  grahaBlock: { marginBottom: 14, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#2A2F45', paddingTop: 10 },
  grahaHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  grahaName: { color: '#FFD700', fontSize: 15, fontWeight: '700' },
  grahaMeta: { color: '#8892a4', fontSize: 12 },
  grahaBhava: { color: '#A0A4B0', fontSize: 13, lineHeight: 19, marginTop: 4, fontStyle: 'italic' },
  deepToggleRow: { marginTop: 12, paddingTop: 12, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#2A2F45' },
  deepToggleText: { color: '#FFD700', fontSize: 13, fontWeight: '700' },
  deepBody: { marginTop: 12 },
  genderToggle: { flexDirection: 'row', alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 18, padding: 3, marginBottom: 14 },
  genderBtn: { paddingHorizontal: 16, paddingVertical: 5, borderRadius: 16 },
  genderBtnActive: { backgroundColor: '#FFD700' },
  genderBtnText: { color: '#8892a4', fontSize: 12, fontWeight: '700' },
  genderBtnTextActive: { color: '#1A1A1A' },
  deepSection: { marginBottom: 12 },
  deepSectionTitle: { color: '#C9A24B', fontSize: 12, fontWeight: '700', letterSpacing: 0.3, marginBottom: 3 },
  deepPada: { marginTop: 4, paddingTop: 10, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#2A2F45' },
})
