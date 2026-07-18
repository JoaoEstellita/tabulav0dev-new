import React, { useMemo, useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  TouchableOpacity,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../config/firebase'
import { useLifeAreas } from '../../hooks/useLifeAreas'
import { useAuth } from '../../hooks/useAuth'
import { useAppLanguage } from '../../hooks/useAppLanguage'
import { degToSign } from '../../astro'
import { translatePlanetPT } from '../../utils/astro/pt'
import { resolveSignInMidheavenText, resolveSignInHouseText, resolvePlanetInSignText, resolveNatalPlanetInHouseText, resolveNatalPlanetAspectText, resolveLunarNodeSignText, resolveLunarNodeHouseText, resolveNatalRulerInHouseText } from '../../utils/natalInterpretation'
import { normalizeSign } from '../../astro/normalize'
import StarLoader from '../../components/StarLoader'
import type { RealPlanetPosition } from '../../services/astrology/RealAstrologyEngine'

const PLANET_SYMBOLS: Record<string, string> = {
  Sun: '☉', Moon: '☽', Mercury: '☿', Venus: '♀',
  Mars: '♂', Jupiter: '♃', Saturn: '♄', Uranus: '♅',
  Neptune: '♆', Pluto: '♇',
}

const PLANET_ORDER = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto']

// Regentes modernos — mesma tradição (psicológica) dos catálogos do app.
const SIGN_RULER_EN: Record<string, string> = {
  Aries: 'Mars', Taurus: 'Venus', Gemini: 'Mercury', Cancer: 'Moon',
  Leo: 'Sun', Virgo: 'Mercury', Libra: 'Venus', Scorpio: 'Pluto',
  Sagittarius: 'Jupiter', Capricorn: 'Saturn', Aquarius: 'Uranus', Pisces: 'Neptune',
}

const SIGN_SYMBOLS: Record<string, string> = {
  Aries: '♈', Taurus: '♉', Gemini: '♊', Cancer: '♋',
  Leo: '♌', Virgo: '♍', Libra: '♎', Scorpio: '♏',
  Sagittarius: '♐', Capricorn: '♑', Aquarius: '♒', Pisces: '♓',
}

// degToSign devolve o signo em pt-BR ('Áries'), mas SIGN_SYMBOLS/SIGN_RULER_EN têm
// chave em inglês — sem normalizar, o símbolo sumia silenciosamente (|| '').
const signSymbol = (sign: string): string => SIGN_SYMBOLS[normalizeSign(sign) || ''] || ''
const signRuler = (sign: string): string | undefined => SIGN_RULER_EN[normalizeSign(sign) || '']

const ELEMENT_COLORS: Record<string, string> = {
  fire: '#f97316',
  earth: '#84cc16',
  air: '#38bdf8',
  water: '#818cf8',
}
const ELEMENT_LABELS: Record<string, Record<string, string>> = {
  'pt-BR': { fire: 'Fogo', earth: 'Terra', air: 'Ar', water: 'Água' },
  'en-US': { fire: 'Fire', earth: 'Earth', air: 'Air', water: 'Water' },
  'es-ES': { fire: 'Fuego', earth: 'Tierra', air: 'Aire', water: 'Agua' },
  'it-IT': { fire: 'Fuoco', earth: 'Terra', air: 'Aria', water: 'Acqua' },
}

const MODALITY_LABELS: Record<string, Record<string, string>> = {
  'pt-BR': { cardinal: 'Cardeal', fixed: 'Fixo', mutable: 'Mutável' },
  'en-US': { cardinal: 'Cardinal', fixed: 'Fixed', mutable: 'Mutable' },
  'es-ES': { cardinal: 'Cardinal', fixed: 'Fijo', mutable: 'Mutable' },
  'it-IT': { cardinal: 'Cardinale', fixed: 'Fisso', mutable: 'Mutevole' },
}

function OrdinalHouse({ n, lang }: { n: number; lang: string }) {
  const suffixes: Record<string, string[]> = {
    'pt-BR': ['ª', 'ª', 'ª'],
    'en-US': ['st', 'nd', 'rd'],
    'es-ES': ['ª', 'ª', 'ª'],
    'it-IT': ['ª', 'ª', 'ª'],
  }
  const s = suffixes[lang] || suffixes['pt-BR']
  const suf = n === 1 ? s[0] : n === 2 ? s[1] : n === 3 ? s[2] : s[0]
  return <>{n}{suf}</>
}

function Bar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.min((value / Math.max(max, 1)) * 100, 100)
  return (
    <View style={barStyles.track}>
      <View style={[barStyles.fill, { width: `${pct}%` as any, backgroundColor: color }]} />
    </View>
  )
}

const barStyles = StyleSheet.create({
  track: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  fill: { height: '100%', borderRadius: 3 },
})

/**
 * Lista de aspectos natais de um planeta, colapsada.
 *
 * Os textos curados têm 192–465 chars (cabem inteiros), então colapsar CADA texto
 * só gerava ruído — um "ver mais" que revelava meia linha. A densidade real vem da
 * QUANTIDADE de aspectos por planeta, então o corte é aqui: mostra os mais exatos e
 * abre o resto sob demanda. Nenhum aspecto é escondido da contagem.
 */
function AspectList({
  entries,
  language,
  initial = 2,
}: {
  entries: { label: string; text: string | null; orb: number | null }[]
  language: string
  initial?: number
}) {
  const [expanded, setExpanded] = useState(false)
  const hidden = entries.length - initial
  const shown = expanded ? entries : entries.slice(0, initial)
  const more = language === 'en-US' ? `Show ${hidden} more aspect${hidden > 1 ? 's' : ''}`
    : language === 'es-ES' ? `Ver ${hidden} aspecto${hidden > 1 ? 's' : ''} mas`
    : language === 'it-IT' ? `Mostra altri ${hidden} aspetti`
    : `Ver mais ${hidden} aspecto${hidden > 1 ? 's' : ''}`
  const less = language === 'en-US' ? 'Show less' : language === 'es-ES' ? 'Ver menos' : language === 'it-IT' ? 'Mostra meno' : 'Ver menos'
  return (
    <View>
      {shown.map((a, i) => (
        <View key={`${a.label}-${i}`} style={i > 0 ? expandStyles.aspectSpacer : undefined}>
          <Text style={expandStyles.aspectLabel}>
            {a.label}{a.orb !== null ? `  ·  ${a.orb.toFixed(1)}°` : ''}
          </Text>
          {a.text ? <Text style={expandStyles.aspectText}>{a.text}</Text> : null}
        </View>
      ))}
      {hidden > 0 ? (
        <TouchableOpacity onPress={() => setExpanded(v => !v)} activeOpacity={0.7} accessibilityRole="button">
          <Text style={expandStyles.toggle}>{expanded ? less : more}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  )
}

const expandStyles = StyleSheet.create({
  toggle: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 6,
  },
  aspectSpacer: { marginTop: 10 },
  aspectLabel: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  aspectText: {
    color: '#C8CDE8',
    fontSize: 13,
    lineHeight: 19,
  },
})

export default function AstroProfileScreen() {
  const { transitData, loading } = useLifeAreas()
  const { user } = useAuth()
  const { language } = useAppLanguage()

  const [firestoreAscDeg, setFirestoreAscDeg] = useState<number | null>(null)
  const [birthInfo, setBirthInfo] = useState<{ date?: string; time?: string }>({})
  useEffect(() => {
    if (!user?.uid) return
    getDoc(doc(db, 'users', user.uid)).then(snap => {
      const data = snap.data()
      const val = data?.natalAscDeg
      if (typeof val === 'number') setFirestoreAscDeg(val)
      setBirthInfo({ date: data?.birthDate, time: data?.birthTime })
    }).catch(() => {})
  }, [user?.uid])

  const tl = (pt: string, en: string, es: string, it: string) => {
    if (language === 'en-US') return en
    if (language === 'es-ES') return es
    if (language === 'it-IT') return it
    return pt
  }

  const ct = transitData?.currentTransits
  const natalPlanets: RealPlanetPosition[] = useMemo(
    () => ct?.natalPlanets ?? [],
    [ct?.natalPlanets]
  )
  const orderedPlanets = useMemo(
    () => PLANET_ORDER.map(name => natalPlanets.find(p => p.name === name)).filter(Boolean) as RealPlanetPosition[],
    [natalPlanets]
  )

  // Aspectos natais por planeta, com o texto curado de cada, ordenados do mais
  // exato para o mais largo. Antes limitava aos 2 mais exatos — um mapa completo
  // (como o do ZET) lista todos, e o dado já está em aspectsNatalToNatal.
  const aspectsByPlanet = useMemo(() => {
    const out: Record<string, { label: string; text: string | null; orb: number | null }[]> = {}
    const list = Array.isArray(ct?.aspectsNatalToNatal) ? ct!.aspectsNatalToNatal : []
    for (const planet of PLANET_ORDER) {
      const mine = list
        .filter(a => a.planet1 === planet || a.planet2 === planet)
        .sort((a, b) => (a.orb ?? 99) - (b.orb ?? 99))
      const entries: { label: string; text: string | null; orb: number | null }[] = []
      for (const a of mine) {
        const other = a.planet1 === planet ? a.planet2 : a.planet1
        // O aspecto entra SEMPRE. Antes só entrava se houvesse texto curado, então
        // aspectos reais do mapa sumiam sem aviso e a lista parecia incompleta.
        const text = resolveNatalPlanetAspectText(a.planet1, a.type, a.planet2, language)
        entries.push({
          label: `${translatePlanetPT(planet)} ${a.type} ${translatePlanetPT(other)}`,
          text: text || null,
          orb: Number.isFinite(a.orb) ? Number(a.orb) : null,
        })
      }
      if (entries.length) out[planet] = entries
    }
    return out
  }, [ct?.aspectsNatalToNatal, language])

  const elemental = ct?.chartSummary?.elemental?.natal
  const modality = ct?.chartSummary?.modality?.natal
  const natalAsc = firestoreAscDeg ?? ct?.natalAscendant ?? 0
  const natalMc = ct?.natalMidheaven ?? 0

  const ascSign = useMemo(() => {
    try { return degToSign(natalAsc) } catch { return { sign: '', degInSign: 0 } }
  }, [natalAsc])

  const mcSign = useMemo(() => {
    try { return degToSign(natalMc) } catch { return { sign: '', degInSign: 0 } }
  }, [natalMc])

  const ascText = useMemo(
    () => resolveSignInHouseText(ascSign.sign, 1, language),
    [ascSign.sign, language],
  )

  const mcText = useMemo(
    () => resolveSignInMidheavenText(mcSign.sign, language),
    [mcSign.sign, language],
  )

  // Eixos completos: DSC (oposto ao ASC) e IC (oposto ao MC). Um mapa completo traz
  // os quatro ângulos; o catálogo signo-na-casa já cobre as casas 7 e 4.
  const dscSign = useMemo(() => {
    try { return degToSign((natalAsc + 180) % 360) } catch { return null }
  }, [natalAsc])

  const icSign = useMemo(() => {
    try { return degToSign((natalMc + 180) % 360) } catch { return null }
  }, [natalMc])

  const dscText = useMemo(
    () => (dscSign ? resolveSignInHouseText(dscSign.sign, 7, language) : null),
    [dscSign, language],
  )

  const icText = useMemo(
    () => (icSign ? resolveSignInHouseText(icSign.sign, 4, language) : null),
    [icSign, language],
  )

  // Nódulo Norte lunar (nó médio, Meeus) — usa o valor do engine quando disponível,
  // senão calcula localmente a partir dos dados de nascimento
  const natalNorthNode = useMemo(() => {
    const fromEngine = (ct as any)?.natalNorthNode
    if (typeof fromEngine === 'number') return fromEngine
    if (!birthInfo.date) return null
    const [y, m, d] = birthInfo.date.split('-').map(Number)
    if (!y || !m || !d) return null
    const [h, min] = (birthInfo.time || '12:00').split(':').map(Number)
    const jd = Date.UTC(y, m - 1, d, h || 12, min || 0) / 86400000 + 2440587.5
    const T = (jd - 2451545.0) / 36525
    const omega = 125.04452 - 1934.136261 * T + 0.0020708 * T * T + (T * T * T) / 450000
    return ((omega % 360) + 360) % 360
  }, [ct, birthInfo])

  const nnSign = useMemo(() => {
    if (natalNorthNode === null) return null
    try { return degToSign(natalNorthNode) } catch { return null }
  }, [natalNorthNode])

  const snSign = useMemo(() => {
    if (natalNorthNode === null) return null
    try { return degToSign((natalNorthNode + 180) % 360) } catch { return null }
  }, [natalNorthNode])

  const nnText = useMemo(
    () => (nnSign ? resolveLunarNodeSignText(nnSign.sign, language) : null),
    [nnSign, language],
  )

  // Casa do Nódulo Norte via cúspides natais (quando disponíveis no engine)
  const nnHouse = useMemo(() => {
    const cusps = ct?.natalHouses
    if (natalNorthNode === null || !Array.isArray(cusps) || cusps.length < 12) return null
    for (let i = 0; i < 12; i++) {
      const start = cusps[i]
      const end = cusps[(i + 1) % 12]
      const span = ((end - start) % 360 + 360) % 360
      const offset = ((natalNorthNode - start) % 360 + 360) % 360
      if (offset < span || span === 0) return i + 1
    }
    return null
  }, [natalNorthNode, ct?.natalHouses])

  const nnHouseText = useMemo(
    () => (nnHouse ? resolveLunarNodeHouseText(nnHouse, language) : null),
    [nnHouse, language],
  )

  // Signo na cúspide de CADA uma das 12 casas. O catálogo signo-na-casa tem 12×12
  // entradas curadas, mas a tela só usava a casa 1 (via ASC) — as outras 11 nunca
  // chegavam ao usuário.
  const houseCusps = useMemo(() => {
    const cusps = ct?.natalHouses
    if (!Array.isArray(cusps) || cusps.length < 12) return []
    return cusps.slice(0, 12).map((deg: number, i: number) => {
      let s: { sign: string; degInSign: number } | null = null
      try { s = degToSign(deg) } catch { s = null }
      if (!s) return null
      const house = i + 1
      // Regente da casa: planeta que rege o signo da cúspide, e a casa que ele ocupa
      // ("o regente da 4ª está na 9ª") — leitura clássica que o catálogo 12×12 cobre.
      const rulerName = signRuler(s.sign)
      const rulerPlanet = rulerName ? natalPlanets.find((p) => p.name === rulerName) : undefined
      const rulerHouse = rulerPlanet?.house
      return {
        house,
        sign: s.sign,
        degInSign: s.degInSign,
        text: resolveSignInHouseText(s.sign, house, language),
        ruler: rulerName && rulerHouse
          ? { planet: rulerName, house: rulerHouse, text: resolveNatalRulerInHouseText(house, rulerHouse, language) }
          : null,
      }
    }).filter(Boolean) as Array<{
      house: number; sign: string; degInSign: number; text: string | null
      ruler: { planet: string; house: number; text: string | null } | null
    }>
  }, [ct?.natalHouses, natalPlanets, language])

  // Regente do mapa: o planeta que rege o signo do Ascendente e a casa que ele ocupa.
  const chartRuler = useMemo(() => {
    if (!ascSign) return null
    const rulerName = signRuler(ascSign.sign)
    if (!rulerName) return null
    const planet = natalPlanets.find((p) => p.name === rulerName)
    if (!planet || !planet.house) return null
    return {
      planet: rulerName,
      ascSign: ascSign.sign,
      house: planet.house,
      sign: planet.sign,
      text: resolveNatalRulerInHouseText(1, planet.house, language),
    }
  }, [ascSign, natalPlanets, language])

  const maxElement = elemental ? Math.max(elemental.fire, elemental.earth, elemental.air, elemental.water) : 1
  const maxModality = modality ? Math.max(modality.cardinal, modality.fixed, modality.mutable) : 1

  const elLabels = ELEMENT_LABELS[language] || ELEMENT_LABELS['pt-BR']
  const modLabels = MODALITY_LABELS[language] || MODALITY_LABELS['pt-BR']

  if (loading && natalPlanets.length === 0) {
    return (
      <LinearGradient colors={['#0F0F23', '#1A1A3A']} style={styles.container}>
        <View style={styles.center}>
          <StarLoader size={32} color="#FFD700" />
          <Text style={styles.loadingText}>{tl('Calculando perfil…', 'Calculating profile…', 'Calculando perfil…', 'Calcolo profilo…')}</Text>
        </View>
      </LinearGradient>
    )
  }

  return (
    <LinearGradient colors={['#0F0F23', '#1A1A3A']} style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={Platform.OS === 'web'}
      >
        {/* Ascendente + MC */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            {tl('Pontos Angulares', 'Angular Points', 'Puntos Angulares', 'Punti Angolari')}
          </Text>
          <View style={styles.row}>
            <View style={styles.angularItem}>
              <Text style={styles.angularLabel}>ASC</Text>
              <Text style={styles.angularValue}>
                {signSymbol(ascSign.sign)} {ascSign.sign}
              </Text>
              <Text style={styles.angularDeg}>{ascSign.degInSign.toFixed(1)}°</Text>
            </View>
            <View style={styles.angularDivider} />
            <View style={styles.angularItem}>
              <Text style={styles.angularLabel}>MC</Text>
              <Text style={styles.angularValue}>
                {signSymbol(mcSign.sign)} {mcSign.sign}
              </Text>
              <Text style={styles.angularDeg}>{mcSign.degInSign.toFixed(1)}°</Text>
            </View>
          </View>
          {dscSign || icSign ? (
            <View style={styles.row}>
              {dscSign ? (
                <View style={styles.angularItem}>
                  <Text style={styles.angularLabel}>DSC</Text>
                  <Text style={styles.angularValue}>
                    {signSymbol(dscSign.sign)} {dscSign.sign}
                  </Text>
                  <Text style={styles.angularDeg}>{dscSign.degInSign.toFixed(1)}°</Text>
                </View>
              ) : null}
              <View style={styles.angularDivider} />
              {icSign ? (
                <View style={styles.angularItem}>
                  <Text style={styles.angularLabel}>IC</Text>
                  <Text style={styles.angularValue}>
                    {signSymbol(icSign.sign)} {icSign.sign}
                  </Text>
                  <Text style={styles.angularDeg}>{icSign.degInSign.toFixed(1)}°</Text>
                </View>
              ) : null}
            </View>
          ) : null}
          {ascText ? (
            <View style={styles.angularInterpretation}>
              <Text style={styles.angularInterpretationLabel}>
                {tl('Ascendente', 'Ascendant', 'Ascendente', 'Ascendente')}
              </Text>
              <Text style={styles.angularInterpretationText}>{ascText}</Text>
            </View>
          ) : null}
          {mcText ? (
            <View style={styles.angularInterpretation}>
              <Text style={styles.angularInterpretationLabel}>
                {tl('Meio do Céu', 'Midheaven', 'Medio Cielo', 'Medio Cielo')}
              </Text>
              <Text style={styles.angularInterpretationText}>{mcText}</Text>
            </View>
          ) : null}
          {dscText ? (
            <View style={styles.angularInterpretation}>
              <Text style={styles.angularInterpretationLabel}>
                {tl('Descendente', 'Descendant', 'Descendente', 'Discendente')}
              </Text>
              <Text style={styles.angularInterpretationText}>{dscText}</Text>
            </View>
          ) : null}
          {icText ? (
            <View style={styles.angularInterpretation}>
              <Text style={styles.angularInterpretationLabel}>
                {tl('Fundo do Céu', 'Imum Coeli', 'Fondo del Cielo', 'Fondo Cielo')}
              </Text>
              <Text style={styles.angularInterpretationText}>{icText}</Text>
            </View>
          ) : null}
        </View>

        {/* Nódulos Lunares */}
        {nnSign && snSign ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              {tl('Nódulos Lunares', 'Lunar Nodes', 'Nodos Lunares', 'Nodi Lunari')}
            </Text>
            <View style={styles.row}>
              <View style={styles.angularItem}>
                <Text style={styles.angularLabel}>
                  {tl('Nódulo Norte', 'North Node', 'Nodo Norte', 'Nodo Nord')} ☊
                </Text>
                <Text style={styles.angularValue}>
                  {signSymbol(nnSign.sign)} {nnSign.sign}
                </Text>
                <Text style={styles.angularDeg}>{nnSign.degInSign.toFixed(1)}°{nnHouse ? ` · ${tl('Casa', 'House', 'Casa', 'Casa')} ${nnHouse}` : ''}</Text>
              </View>
              <View style={styles.angularDivider} />
              <View style={styles.angularItem}>
                <Text style={styles.angularLabel}>
                  {tl('Nódulo Sul', 'South Node', 'Nodo Sur', 'Nodo Sud')} ☋
                </Text>
                <Text style={styles.angularValue}>
                  {signSymbol(snSign.sign)} {snSign.sign}
                </Text>
                <Text style={styles.angularDeg}>{snSign.degInSign.toFixed(1)}°</Text>
              </View>
            </View>
            <View style={styles.angularInterpretation}>
              <Text style={styles.angularInterpretationLabel}>
                {tl('Eixo de crescimento', 'Growth axis', 'Eje de crecimiento', 'Asse di crescita')}
              </Text>
              <Text style={styles.angularInterpretationText}>
                {nnText || tl(
                  'O Nódulo Norte aponta as qualidades que sua jornada convida a desenvolver nesta vida; o Nódulo Sul indica talentos e padrões já familiares, que tendem a ser zona de conforto. Na tradição evolutiva, esse eixo é lido como direção de crescimento — um convite, não um destino.',
                  'The North Node points to the qualities your journey invites you to develop in this life; the South Node marks familiar talents and patterns that tend to be a comfort zone. In the evolutionary tradition, this axis reads as a direction of growth — an invitation, not a destiny.',
                  'El Nodo Norte apunta a las cualidades que tu camino invita a desarrollar en esta vida; el Nodo Sur indica talentos y patrones ya familiares, que tienden a ser zona de confort. En la tradición evolutiva, este eje se lee como dirección de crecimiento — una invitación, no un destino.',
                  'Il Nodo Nord indica le qualità che il tuo cammino invita a sviluppare in questa vita; il Nodo Sud segnala talenti e schemi già familiari, che tendono a essere zona di comfort. Nella tradizione evolutiva questo asse si legge come direzione di crescita — un invito, non un destino.'
                )}
              </Text>
            </View>
            {nnHouseText ? (
              <View style={styles.angularInterpretation}>
                <Text style={styles.angularInterpretationLabel}>
                  {tl('Nódulo Norte na Casa', 'North Node in House', 'Nodo Norte en la Casa', 'Nodo Nord nella Casa')} {nnHouse}
                </Text>
                <Text style={styles.angularInterpretationText}>{nnHouseText}</Text>
              </View>
            ) : null}
          </View>
        ) : null}

        {/* Regente do Mapa */}
        {chartRuler ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              {tl('Regente do Mapa', 'Chart Ruler', 'Regente de la Carta', 'Governatore del Tema')}
            </Text>
            <View style={styles.row}>
              <View style={styles.angularItem}>
                <Text style={styles.angularLabel}>
                  {PLANET_SYMBOLS[chartRuler.planet] || ''} {translatePlanetPT(chartRuler.planet)}
                </Text>
                <Text style={styles.angularValue}>
                  {tl('Casa', 'House', 'Casa', 'Casa')} {chartRuler.house}
                </Text>
                <Text style={styles.angularDeg}>
                  {tl('regente de', 'ruler of', 'regente de', 'governatore di')} {chartRuler.ascSign} (ASC)
                </Text>
              </View>
            </View>
            {chartRuler.text ? (
              <View style={styles.angularInterpretation}>
                <Text style={styles.angularInterpretationText}>{chartRuler.text}</Text>
              </View>
            ) : null}
          </View>
        ) : null}

        {/* Planetas natais */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            {tl('Planetas Natais', 'Natal Planets', 'Planetas Natales', 'Pianeti Natali')}
          </Text>
          {orderedPlanets.map(p => {
            const signText = resolvePlanetInSignText(p.name, p.sign, language)
            const houseText = p.house ? resolveNatalPlanetInHouseText(p.name, p.house, language) : null
            return (
              <View key={p.name} style={styles.planetBlock}>
                <View style={styles.planetRow}>
                  <Text style={styles.planetSymbol}>{PLANET_SYMBOLS[p.name] || '●'}</Text>
                  <Text style={styles.planetName}>{translatePlanetPT(p.name)}</Text>
                  <View style={styles.planetSignWrap}>
                    <Text style={styles.planetSign}>
                      {signSymbol(p.sign)} {p.sign}
                    </Text>
                    <Text style={styles.planetDeg}>{(p.degree ?? (p.longitude % 30)).toFixed(1)}°</Text>
                  </View>
                  <View style={styles.planetMeta}>
                    <Text style={styles.planetHouse}>
                      {tl('Casa', 'House', 'Casa', 'Casa')} {p.house}
                    </Text>
                    {p.isRetrograde && (
                      <View style={styles.retroBadge}>
                        <Text style={styles.retroText}>℞</Text>
                      </View>
                    )}
                  </View>
                </View>
                {signText ? (
                  <Text style={styles.planetSignText}>{signText}</Text>
                ) : null}
                {houseText ? (
                  <Text style={styles.planetHouseText}>{houseText}</Text>
                ) : null}
                {aspectsByPlanet[p.name]?.length ? (
                  <View style={styles.planetAspectsBlock}>
                    <Text style={styles.planetAspectsTitle}>
                      {tl('Aspectos natais', 'Natal aspects', 'Aspectos natales', 'Aspetti natali')}
                    </Text>
                    <AspectList entries={aspectsByPlanet[p.name]} language={language} />
                  </View>
                ) : null}
              </View>
            )
          })}
        </View>

        {/* As 12 Casas — signo na cúspide + texto curado */}
        {houseCusps.length > 0 ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              {tl('As 12 Casas', 'The 12 Houses', 'Las 12 Casas', 'Le 12 Case')}
            </Text>
            {houseCusps.map((h) => (
              <View key={`house-${h.house}`} style={styles.planetBlock}>
                <View style={styles.planetRow}>
                  <Text style={styles.angularLabel}>
                    {tl('Casa', 'House', 'Casa', 'Casa')} {h.house}
                  </Text>
                  <Text style={styles.angularValue}>
                    {signSymbol(h.sign)} {h.sign}
                  </Text>
                  <Text style={styles.angularDeg}>{h.degInSign.toFixed(1)}°</Text>
                </View>
                {h.text ? (
                  <Text style={styles.angularInterpretationText}>{h.text}</Text>
                ) : null}
                {h.ruler ? (
                  <View style={styles.angularInterpretation}>
                    <Text style={styles.angularInterpretationLabel}>
                      {tl('Regente', 'Ruler', 'Regente', 'Governatore')}: {PLANET_SYMBOLS[h.ruler.planet] || ''} {translatePlanetPT(h.ruler.planet)} · {tl('Casa', 'House', 'Casa', 'Casa')} {h.ruler.house}
                    </Text>
                    {h.ruler.text ? (
                      <Text style={styles.angularInterpretationText}>{h.ruler.text}</Text>
                    ) : null}
                  </View>
                ) : null}
              </View>
            ))}
          </View>
        ) : null}

        {/* Análise elemental */}
        {elemental && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              {tl('Distribuição Elemental', 'Elemental Distribution', 'Distribución Elemental', 'Distribuzione Elementale')}
            </Text>
            {(['fire', 'earth', 'air', 'water'] as const).map(el => (
              <View key={el} style={styles.statRow}>
                <Text style={[styles.statLabel, { color: ELEMENT_COLORS[el] }]}>
                  {elLabels[el]}
                </Text>
                <Bar value={elemental[el]} max={maxElement} color={ELEMENT_COLORS[el]} />
                <Text style={styles.statCount}>{elemental[el]}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Análise de modalidades */}
        {modality && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              {tl('Modalidades', 'Modalities', 'Modalidades', 'Modalità')}
            </Text>
            {(['cardinal', 'fixed', 'mutable'] as const).map(mod => (
              <View key={mod} style={styles.statRow}>
                <Text style={styles.statLabel}>{modLabels[mod]}</Text>
                <Bar value={modality[mod]} max={maxModality} color="#FFD700" />
                <Text style={styles.statCount}>{modality[mod]}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 40 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: { color: '#8892a4', fontSize: 14 },

  card: {
    backgroundColor: '#161a22',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#252b38',
    padding: 16,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: '#8892a4',
    marginBottom: 14,
  },

  row: { flexDirection: 'row', alignItems: 'center' },
  angularItem: { flex: 1, alignItems: 'center', gap: 4 },
  angularDivider: { width: 1, height: 40, backgroundColor: '#252b38' },
  angularLabel: { fontSize: 11, color: '#8892a4', fontWeight: '700' },
  angularValue: { fontSize: 16, color: '#FFD700', fontWeight: '700' },
  angularDeg: { fontSize: 11, color: '#8892a4' },
  angularInterpretation: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#252b38',
  },
  angularInterpretationLabel: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: '#8892a4',
    marginBottom: 6,
  },
  angularInterpretationText: {
    fontSize: 13,
    color: '#c8d3e0',
    lineHeight: 19,
  },

  planetBlock: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1e2430',
  },
  planetRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  planetSignText: {
    marginTop: 6,
    fontSize: 12,
    color: '#9aa7ba',
    lineHeight: 18,
  },
  planetHouseText: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.08)',
    fontSize: 12,
    color: '#9aa7ba',
    lineHeight: 18,
  },
  planetAspectsBlock: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
  planetAspectsTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFD700',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  planetAspectItem: {
    marginTop: 4,
  },
  planetAspectLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#c7d2fe',
  },
  planetAspectText: {
    fontSize: 12,
    color: '#9aa7ba',
    lineHeight: 18,
    marginTop: 2,
  },
  planetSymbol: {
    fontSize: 16,
    width: 26,
    color: '#FFD700',
    textAlign: 'center',
  },
  planetName: {
    width: 68,
    fontSize: 13,
    color: '#e2e8f0',
    fontWeight: '500',
  },
  planetSignWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  planetSign: {
    fontSize: 13,
    color: '#e2e8f0',
  },
  planetDeg: {
    fontSize: 11,
    color: '#8892a4',
  },
  planetMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  planetHouse: {
    fontSize: 11,
    color: '#8892a4',
  },
  retroBadge: {
    backgroundColor: 'rgba(248,113,113,0.15)',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  retroText: {
    fontSize: 11,
    color: '#f87171',
    fontWeight: '700',
  },

  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  statLabel: {
    width: 72,
    fontSize: 12,
    color: '#e2e8f0',
    fontWeight: '500',
  },
  statCount: {
    width: 20,
    fontSize: 12,
    color: '#8892a4',
    textAlign: 'right',
    fontVariant: ['tabular-nums'],
  },
})
