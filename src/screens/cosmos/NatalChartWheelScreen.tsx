import React, { useMemo, useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Platform,
  useWindowDimensions,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Svg, { Circle, Line, Path, Text as SvgText, G } from 'react-native-svg'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../config/firebase'
import { useLifeAreas } from '../../hooks/useLifeAreas'
import type { LocalTransitData } from '../../services/astrology/LocalAstrologyService'
import { useAuth } from '../../hooks/useAuth'
import { useAppLanguage } from '../../hooks/useAppLanguage'
import { degToSign } from '../../astro'
import StarLoader from '../../components/StarLoader'
import type { RealPlanetPosition } from '../../services/astrology/RealAstrologyEngine'
import AspectGrid from '../../components/AspectGrid'

// ─── Símbolos ──────────────────────────────────────────────────────────────
const PLANET_SYMBOLS: Record<string, string> = {
  Sun: '☉', Moon: '☽', Mercury: '☿', Venus: '♀',
  Mars: '♂', Jupiter: '♃', Saturn: '♄', Uranus: '♅',
  Neptune: '♆', Pluto: '♇', Lilith: '⚸',
  NorthNode: '☊', SouthNode: '☋',
}
const PLANET_COLORS: Record<string, string> = {
  Sun: '#FFD700', Moon: '#C0C0FF', Mercury: '#A0C8FF', Venus: '#FFB0C8',
  Mars: '#FF7070', Jupiter: '#FFB060', Saturn: '#D0D070', Uranus: '#70D0D0',
  Neptune: '#8080FF', Pluto: '#C080C0', Lilith: '#B080D0',
  NorthNode: '#67E8F9', SouthNode: '#94A3B8',
}
const ZODIAC_SYMBOLS = ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓']

// Aspecto (em PT) entre duas longitudes, dentro do orbe — usado p/ os nódulos.
const NODE_ASPECT_DEFS: { type: string; angle: number }[] = [
  { type: 'conjunção', angle: 0 }, { type: 'sextil', angle: 60 }, { type: 'quadratura', angle: 90 },
  { type: 'trígono', angle: 120 }, { type: 'oposição', angle: 180 },
]
function aspectBetween(lon1: number, lon2: number, orb = 5): { type: string; orb: number } | null {
  const norm = (d: number) => ((d % 360) + 360) % 360
  const x = Math.abs(norm(lon1) - norm(lon2))
  const s = x > 180 ? 360 - x : x
  for (const def of NODE_ASPECT_DEFS) { const o = Math.abs(s - def.angle); if (o <= orb) return { type: def.type, orb: o } }
  return null
}
const SIGNS_PT = ['Áries', 'Touro', 'Gêmeos', 'Câncer', 'Leão', 'Virgem', 'Libra', 'Escorpião', 'Sagitário', 'Capricórnio', 'Aquário', 'Peixes']
const signOfLon = (lon: number) => SIGNS_PT[Math.floor((((lon % 360) + 360) % 360) / 30) % 12]
const ZODIAC_NAMES = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces']

const ASPECT_COLORS: Record<string, string> = {
  conjunction: 'rgba(255,215,0,0.7)',
  sextile: 'rgba(80,200,120,0.6)',
  square: 'rgba(240,80,80,0.6)',
  trine: 'rgba(80,120,240,0.6)',
  opposition: 'rgba(240,140,80,0.6)',
  quincunx: 'rgba(180,120,240,0.5)',
}

// ─── Geometria ──────────────────────────────────────────────────────────────
const DEG2RAD = Math.PI / 180

/** Converte longitude eclíptica → ângulo SVG (0° = direita, sentido horário) */
function lonToSvgAngle(lon: number, ascDeg: number): number {
  // ASC fica a 180° (esquerda); planetas giram no sentido anti-horário
  return (180 - (lon - ascDeg) + 360) % 360
}

function polarToXY(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = angleDeg * DEG2RAD
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

/** Distância angular mais curta (0-180) entre dois ângulos. */
function angShort(a: number, b: number) {
  return Math.abs(((a - b) % 360 + 540) % 360 - 180)
}

type PlacedPlanet<T> = T & { trueAngle: number; sx: number; sy: number; radius: number }

/**
 * Anti-colisão RADIAL: quando planetas ficam próximos em longitude (< glyphDeg),
 * eles NÃO saem do lugar — o ângulo (longitude real) é mantido e só o RAIO varia,
 * empilhando o cluster (uns mais perto do centro, outros mais longe). Clampado à
 * banda [minR, maxR] para nunca invadir o zodíaco/centro. Puro (sem estado).
 */
function declutterRing<T extends { longitude: number }>(
  items: T[], ascDeg: number, cx: number, cy: number, R: number, minR: number, maxR: number, step: number, glyphDeg: number,
): PlacedPlanet<T>[] {
  const withAngle = items
    .map((p) => ({ item: p, trueAngle: lonToSvgAngle(p.longitude, ascDeg) }))
    .sort((a, b) => a.trueAngle - b.trueAngle)
  const radius = new Array<number>(withAngle.length).fill(R)
  let i = 0
  while (i < withAngle.length) {
    let j = i
    while (j + 1 < withAngle.length && angShort(withAngle[j + 1].trueAngle, withAngle[j].trueAngle) < glyphDeg) j++
    const n = j - i + 1
    for (let k = 0; k < n; k++) {
      const r = R + (k - (n - 1) / 2) * step
      radius[i + k] = Math.max(minR, Math.min(maxR, r))
    }
    i = j + 1
  }
  return withAngle.map((w, idx) => {
    const pos = polarToXY(cx, cy, radius[idx], w.trueAngle)
    return { ...(w.item as T), trueAngle: w.trueAngle, sx: pos.x, sy: pos.y, radius: radius[idx] }
  })
}

// ─── Componente principal ─────────────────────────────────────────────────
type ChartContentProps = {
  transitData: LocalTransitData | null
  loading: boolean
  /**
   * A legenda lista cada planeta com grau e signo. No Cosmos ela é redundante —
   * o Perfil logo abaixo mostra o mesmo e muito mais. Mas na tela /mapa standalone
   * não há Perfil nenhum: sem a legenda o usuário fica sem as posições.
   */
  showLegend?: boolean
  /**
   * Carta de OUTRA pessoa (ex.: amigo no grupo): pula o getDoc do usuário logado.
   * Asc e cúspides caem no `transitData.currentTransits` (já é a carta passada).
   */
  chartMeta?: { skipSelfFetch?: boolean }
  /**
   * Bi-roda: sobrepõe os planetas EM TRÂNSITO (céu de agora) num anel externo ao
   * mapa natal, com as linhas de aspecto trânsito→natal. Encolhe o natal para
   * abrir espaço. Usado pela aba Trânsitos (toggle Natal | Trânsitos no Cosmos).
   */
  showTransits?: boolean
  /**
   * No modo Trânsitos, torna as células da grade de aspectos tocáveis: ao tocar,
   * chama com o id do trânsito (casa com o nativeID do card na leitura embutida
   * abaixo) para rolar até a interpretação. Web-only (scroll por DOM).
   */
  onSelectTransitAspect?: (cellId: string) => void
}

/**
 * Conteúdo da roda, SEM container próprio (nem LinearGradient nem ScrollView).
 * Recebe os dados por prop de propósito: useLifeAreas não é contexto — cada
 * chamada cria uma instância com estado próprio. Quem monta a tela chama o hook
 * uma vez e passa para cá, para o Cosmos poder embutir roda + perfil sem
 * disparar o cálculo astrológico três vezes.
 */
export function NatalChartWheelContent({ transitData, loading, showLegend = true, chartMeta, showTransits = false, onSelectTransitAspect }: ChartContentProps) {
  const { user } = useAuth()
  const { language } = useAppLanguage()
  const { width } = useWindowDimensions()

  const [selectedPlanet, setSelectedPlanet] = useState<RealPlanetPosition | null>(null)
  const [firestoreAscDeg, setFirestoreAscDeg] = useState<number | null>(null)
  const [firestoreCusps, setFirestoreCusps] = useState<number[] | null>(null)

  useEffect(() => {
    if (chartMeta?.skipSelfFetch) return // amigo: asc/cúspides vêm do transitData
    if (!user?.uid) return
    getDoc(doc(db, 'users', user.uid)).then(snap => {
      const data = snap.data()
      if (typeof data?.natalAscDeg === 'number') setFirestoreAscDeg(data.natalAscDeg)
      if (Array.isArray(data?.natalCusps)) setFirestoreCusps(data.natalCusps)
    }).catch(() => {})
  }, [user?.uid, chartMeta?.skipSelfFetch])

  const tl = (pt: string, en: string, es: string, it: string) => {
    if (language === 'en-US') return en
    if (language === 'es-ES') return es
    if (language === 'it-IT') return it
    return pt
  }

  const ct = transitData?.currentTransits
  const natalPlanets: RealPlanetPosition[] = ct?.natalPlanets ?? []
  const ascDeg = firestoreAscDeg ?? ct?.natalAscendant ?? 0
  const mcDeg = ct?.natalMidheaven ?? 0
  const houseCusps: number[] = firestoreCusps ?? ct?.natalHouses ?? []
  const aspects = ct?.aspectsNatalToNatal ?? []
  // Bi-roda: planetas em trânsito (céu agora) + aspectos trânsito→natal.
  const transitPlanets: RealPlanetPosition[] = showTransits ? ((ct as any)?.planets ?? []) : []
  const tnAspects: any[] = showTransits ? ((ct as any)?.aspectsTransitsToNatalTN ?? []) : []

  // Nódulos lunares ☊/☋ — natais (nó médio no nascimento) e em TRÂNSITO (na data).
  const natalNorthNode = typeof (ct as any)?.natalNorthNode === 'number' ? (ct as any).natalNorthNode : null
  const currentNorthNode = typeof (ct as any)?.currentNorthNode === 'number' ? (ct as any).currentNorthNode : null
  const houseOfLon = (lon: number) => {
    if (!Array.isArray(houseCusps) || houseCusps.length < 12) return 0
    const n = (d: number) => ((d % 360) + 360) % 360
    const L = n(lon)
    for (let i = 0; i < 12; i++) {
      const a = n(houseCusps[i]); const span = n(n(houseCusps[(i + 1) % 12]) - a)
      if (n(L - a) < span) return i + 1
    }
    return 0
  }
  const mkNode = (name: string, lon: number, withHouse: boolean): RealPlanetPosition => ({
    name, longitude: ((lon % 360) + 360) % 360, sign: signOfLon(lon), house: withHouse ? houseOfLon(lon) : 0,
    degree: (((lon % 360) + 360) % 360) % 30, isRetrograde: false, speed: 0,
  } as RealPlanetPosition)

  // ☊/☋ NATAIS no anel interno.
  const natalWheelPoints = useMemo<RealPlanetPosition[]>(() => (
    natalNorthNode == null ? natalPlanets
      : [...natalPlanets, mkNode('NorthNode', natalNorthNode, true), mkNode('SouthNode', natalNorthNode + 180, true)]
  ), [natalPlanets, natalNorthNode, houseCusps])

  // ☊/☋ em TRÂNSITO no anel externo (só na bi-roda).
  const transitWheelPoints = useMemo<RealPlanetPosition[]>(() => (
    (!showTransits || currentNorthNode == null) ? transitPlanets
      : [...transitPlanets, mkNode('NorthNode', currentNorthNode, false), mkNode('SouthNode', currentNorthNode + 180, false)]
  ), [showTransits, transitPlanets, currentNorthNode])

  // Aspectos dos nódulos NATAIS → planetas natais (grade natal; orbe 5°).
  const natalAspectsWithNodes = useMemo(() => {
    if (natalNorthNode == null) return aspects
    const extra: any[] = []
    const nodes: [string, number][] = [['NorthNode', natalNorthNode], ['SouthNode', natalNorthNode + 180]]
    for (const [nn, nl] of nodes) for (const p of natalPlanets) {
      if (typeof p.longitude !== 'number') continue
      const a = aspectBetween(nl, p.longitude); if (a) extra.push({ planet1: nn, planet2: p.name, type: a.type, orb: a.orb })
    }
    return [...aspects, ...extra]
  }, [aspects, natalPlanets, natalNorthNode])

  // Aspectos com nódulos na BI-RODA: trânsito→nódulo-natal + nódulo-trânsito→natal.
  const tnAspectsWithNodes = useMemo(() => {
    if (!showTransits) return tnAspects
    const extra: any[] = []
    if (natalNorthNode != null) {
      const nn: [string, number][] = [['NorthNode', natalNorthNode], ['SouthNode', natalNorthNode + 180]]
      for (const tp of transitPlanets) for (const [name, lon] of nn) {
        if (typeof tp.longitude !== 'number') continue
        const a = aspectBetween(tp.longitude, lon); if (a) extra.push({ planet1: tp.name, planet2: name, type: a.type, orb: a.orb })
      }
    }
    if (currentNorthNode != null) {
      const tn: [string, number][] = [['NorthNode', currentNorthNode], ['SouthNode', currentNorthNode + 180]]
      for (const [name, lon] of tn) for (const np of natalPlanets) {
        if (typeof np.longitude !== 'number') continue
        const a = aspectBetween(lon, np.longitude); if (a) extra.push({ planet1: name, planet2: np.name, type: a.type, orb: a.orb })
      }
    }
    return [...tnAspects, ...extra]
  }, [showTransits, tnAspects, transitPlanets, natalPlanets, natalNorthNode, currentNorthNode])

  // Dimensões do SVG. Na bi-roda o natal encolhe (scale) p/ abrir o anel externo.
  const svgSize = Math.min(width - 32, 380)
  const cx = svgSize / 2
  const cy = svgSize / 2
  const scale = showTransits ? 0.80 : 1

  const R_TRANSIT = svgSize * 0.45   // anel externo dos planetas em trânsito (só bi-roda)
  const R_OUTER = svgSize * 0.46 * scale   // borda externa (zodíaco)
  const R_ZODIAC_IN = svgSize * 0.38 * scale // borda interna do zodíaco
  const R_HOUSE_OUT = svgSize * 0.36 * scale // borda externa das casas
  const R_HOUSE_IN = svgSize * 0.28 * scale  // borda interna das casas
  const R_PLANET = svgSize * 0.21 * scale    // posição dos planetas natais
  const R_INNER = svgSize * 0.14 * scale     // círculo central (aspectos)

  // Glifos MENORES (pedido do João) + empilhamento radial dentro da banda.
  const discNatal = svgSize * (showTransits ? 0.030 : 0.034)
  const discTransit = svgSize * 0.028
  const stepNatal = discNatal * 2.1
  const stepTransit = discTransit * 2.1
  const glyphDegNatal = Math.min(20, (2 * discNatal / R_PLANET) * (180 / Math.PI))
  const glyphDegTransit = Math.min(18, (2 * discTransit / R_TRANSIT) * (180 / Math.PI))

  const planetPositions = useMemo(
    () => declutterRing(natalWheelPoints, ascDeg, cx, cy, R_PLANET, R_INNER + discNatal + 2, R_HOUSE_IN - discNatal - 1, stepNatal, glyphDegNatal),
    [natalWheelPoints, ascDeg, cx, cy, R_PLANET, R_INNER, R_HOUSE_IN, discNatal, stepNatal, glyphDegNatal],
  )

  const transitPositions = useMemo(
    () => (showTransits ? declutterRing(transitWheelPoints, ascDeg, cx, cy, R_TRANSIT, R_OUTER + discTransit + 2, svgSize * 0.485 - discTransit, stepTransit, glyphDegTransit) : []),
    [showTransits, transitWheelPoints, ascDeg, cx, cy, R_TRANSIT, R_OUTER, discTransit, stepTransit, glyphDegTransit, svgSize],
  )

  // Linhas de aspecto trânsito→natal: do planeta em trânsito (anel externo) ao
  // planeta natal (anel natal). Reusa o mesmo ASPECT_COLORS.
  const tnAspectLines = useMemo(() => {
    if (!showTransits) return []
    return tnAspects.slice(0, 24).map((asp: any, idx: number) => {
      const tName = asp.transitPlanet || asp.planet1 || asp.from
      const nName = asp.natalPlanet || asp.planet2 || asp.to
      const tp = transitPlanets.find((p) => p.name === tName)
      const np = natalPlanets.find((p) => p.name === nName)
      if (!tp || !np) return null
      const pt1 = polarToXY(cx, cy, R_TRANSIT - svgSize * 0.05, lonToSvgAngle(tp.longitude, ascDeg))
      const pt2 = polarToXY(cx, cy, R_PLANET, lonToSvgAngle(np.longitude, ascDeg))
      const color = ASPECT_COLORS[String(asp.type || asp.aspect || '').toLowerCase()] || 'rgba(120,200,200,0.4)'
      return { key: `tn-${idx}-${tName}-${nName}`, pt1, pt2, color }
    }).filter(Boolean)
  }, [showTransits, tnAspects, transitPlanets, natalPlanets, ascDeg, cx, cy, R_TRANSIT, R_PLANET, svgSize])

  const houseLines = useMemo(() => {
    if (houseCusps.length === 12) {
      return houseCusps.map((cusp, i) => {
        const angle = lonToSvgAngle(cusp, ascDeg)
        const inner = polarToXY(cx, cy, R_HOUSE_IN, angle)
        const outer = polarToXY(cx, cy, R_HOUSE_OUT, angle)
        return { i, angle, inner, outer }
      })
    }
    // Fallback: casas iguais (30° cada a partir do ASC)
    return Array.from({ length: 12 }, (_, i) => {
      const angle = lonToSvgAngle(ascDeg + i * 30, ascDeg)
      const inner = polarToXY(cx, cy, R_HOUSE_IN, angle)
      const outer = polarToXY(cx, cy, R_HOUSE_OUT, angle)
      return { i, angle, inner, outer }
    })
  }, [houseCusps, ascDeg, cx, cy, R_HOUSE_IN, R_HOUSE_OUT])

  const houseLabels = useMemo(() => {
    return houseLines.map((h, i) => {
      const nextAngle = houseLines[(i + 1) % 12].angle
      let midAngle = (h.angle + nextAngle) / 2
      // Corrigir quando cruzar 0°/360°
      if (Math.abs(nextAngle - h.angle) > 180) {
        midAngle = ((h.angle + nextAngle + 360) / 2) % 360
      }
      const { x, y } = polarToXY(cx, cy, (R_HOUSE_IN + R_HOUSE_OUT) / 2, midAngle)
      return { label: String(i + 1), x, y }
    })
  }, [houseLines, cx, cy, R_HOUSE_IN, R_HOUSE_OUT])

  const zodiacSections = useMemo(() => {
    return ZODIAC_SYMBOLS.map((sym, i) => {
      const startAngle = lonToSvgAngle(i * 30, ascDeg)
      const endAngle = lonToSvgAngle((i + 1) * 30, ascDeg)
      const midAngle = lonToSvgAngle(i * 30 + 15, ascDeg)
      const { x, y } = polarToXY(cx, cy, (R_ZODIAC_IN + R_OUTER) / 2, midAngle)
      return { sym, i, startAngle, endAngle, midAngle, sx: x, sy: y }
    })
  }, [ascDeg, cx, cy, R_ZODIAC_IN, R_OUTER])

  const aspectLines = useMemo(() => {
    return aspects.slice(0, 30).map(asp => {
      const p1 = natalPlanets.find(p => p.name === asp.planet1)
      const p2 = natalPlanets.find(p => p.name === asp.planet2)
      if (!p1 || !p2) return null
      const a1 = lonToSvgAngle(p1.longitude, ascDeg)
      const a2 = lonToSvgAngle(p2.longitude, ascDeg)
      const pt1 = polarToXY(cx, cy, R_INNER, a1)
      const pt2 = polarToXY(cx, cy, R_INNER, a2)
      const color = ASPECT_COLORS[asp.type] || 'rgba(200,200,200,0.3)'
      return { key: `${asp.planet1}-${asp.planet2}`, pt1, pt2, color }
    }).filter(Boolean)
  }, [aspects, natalPlanets, ascDeg, cx, cy, R_INNER])

  if (loading && natalPlanets.length === 0) {
    return (
      <View style={styles.center}>
        <StarLoader size={32} color="#FFD700" />
        <Text style={styles.loadingText}>
          {tl('Calculando mapa natal…', 'Calculating natal chart…', 'Calculando carta natal…', 'Calcolo carta natale…')}
        </Text>
      </View>
    )
  }

  return (
    <>
      {/* Roda SVG */}
        <View style={styles.wheelWrap}>
          <Svg width={svgSize} height={svgSize}>
            {/* Fundo */}
            <Circle cx={cx} cy={cy} r={R_OUTER} fill="#10131c" stroke="#252b38" strokeWidth={1} />

            {/* Anel do zodíaco */}
            <Circle cx={cx} cy={cy} r={R_ZODIAC_IN} fill="none" stroke="#252b38" strokeWidth={1} />

            {/* Símbolos dos signos */}
            {zodiacSections.map(z => (
              <SvgText
                key={z.i}
                x={z.sx}
                y={z.sy}
                fontSize={svgSize * 0.048}
                textAnchor="middle"
                alignmentBaseline="middle"
                fill="rgba(255,215,0,0.6)"
              >
                {z.sym}
              </SvgText>
            ))}

            {/* Divisões dos signos (linhas a cada 30°) */}
            {Array.from({ length: 12 }, (_, i) => {
              const angle = lonToSvgAngle(i * 30, ascDeg)
              const inner = polarToXY(cx, cy, R_ZODIAC_IN, angle)
              const outer = polarToXY(cx, cy, R_OUTER, angle)
              return (
                <Line key={i} x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y}
                  stroke="rgba(255,215,0,0.25)" strokeWidth={0.8} />
              )
            })}

            {/* Anel das casas */}
            <Circle cx={cx} cy={cy} r={R_HOUSE_OUT} fill="none" stroke="#252b38" strokeWidth={1} />
            <Circle cx={cx} cy={cy} r={R_HOUSE_IN} fill="#10131c" stroke="#252b38" strokeWidth={1} />

            {/* Linhas de cúspide das casas */}
            {houseLines.map(h => (
              <Line key={h.i}
                x1={h.inner.x} y1={h.inner.y}
                x2={h.outer.x} y2={h.outer.y}
                stroke={h.i === 0 || h.i === 3 || h.i === 6 || h.i === 9
                  ? 'rgba(255,215,0,0.7)' : 'rgba(255,255,255,0.2)'}
                strokeWidth={h.i === 0 || h.i === 3 || h.i === 6 || h.i === 9 ? 1.5 : 0.8}
              />
            ))}

            {/* Números das casas */}
            {houseLabels.map(h => (
              <SvgText key={h.label}
                x={h.x} y={h.y}
                fontSize={svgSize * 0.034}
                textAnchor="middle"
                alignmentBaseline="middle"
                fill="rgba(255,255,255,0.35)"
              >
                {h.label}
              </SvgText>
            ))}

            {/* Linhas de aspectos */}
            {aspectLines.map(l => l && (
              <Line key={l.key}
                x1={l.pt1.x} y1={l.pt1.y}
                x2={l.pt2.x} y2={l.pt2.y}
                stroke={l.color} strokeWidth={0.8}
              />
            ))}

            {/* Círculo interno (fundo aspectos) */}
            <Circle cx={cx} cy={cy} r={R_INNER} fill="#0d1018" stroke="#252b38" strokeWidth={1} />

            {/* Bi-roda: só o anel de trânsito. As linhas de aspecto trânsito→natal
                foram removidas (poluíam) — a leitura vive na grade/lista abaixo. */}
            {showTransits && (
              <Circle cx={cx} cy={cy} r={R_TRANSIT + svgSize * 0.028} fill="none" stroke="#1c3a3a" strokeWidth={1} />
            )}

            {/* Eixo dos nódulos ☊↔☋ (só no modo Natal, sutil — no trânsito polui) */}
            {!showTransits && natalNorthNode != null && (() => {
              const a = lonToSvgAngle(natalNorthNode, ascDeg)
              const p1 = polarToXY(cx, cy, R_PLANET + discNatal, a)
              const p2 = polarToXY(cx, cy, R_PLANET + discNatal, a + 180)
              return <Line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#67E8F9" strokeWidth={1} strokeDasharray="4,4" strokeOpacity={0.45} />
            })()}

            {/* Planetas natais (radial: mesmo ângulo, raios variados quando juntos) */}
            {planetPositions.map(p => {
              const color = PLANET_COLORS[p.name] || '#fff'
              return (
                <G key={p.name} onPress={() => setSelectedPlanet(p)}>
                  <Circle cx={p.sx} cy={p.sy} r={discNatal} fill="#161a22" stroke={color} strokeWidth={1.1} />
                  <SvgText x={p.sx} y={p.sy}
                    fontSize={discNatal * 1.5}
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    fill={color}
                  >
                    {PLANET_SYMBOLS[p.name] || '●'}
                  </SvgText>
                  {p.isRetrograde && (
                    <SvgText
                      x={p.sx + discNatal * 0.85}
                      y={p.sy - discNatal * 0.85}
                      fontSize={discNatal * 0.9}
                      fill="#f87171"
                    >
                      ℞
                    </SvgText>
                  )}
                </G>
              )
            })}

            {/* Planetas em TRÂNSITO (anel externo) — só na bi-roda */}
            {showTransits && transitPositions.map(p => {
              const color = PLANET_COLORS[p.name] || '#6EE7E7'
              return (
                <G key={`t-${p.name}`} onPress={() => setSelectedPlanet(p)}>
                  <Circle cx={p.sx} cy={p.sy} r={discTransit} fill="#0e2222" stroke={color} strokeWidth={1} />
                  <SvgText x={p.sx} y={p.sy}
                    fontSize={discTransit * 1.5}
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    fill={color}
                  >
                    {PLANET_SYMBOLS[p.name] || '●'}
                  </SvgText>
                  {p.isRetrograde ? (
                    <SvgText x={p.sx + discTransit * 0.85} y={p.sy - discTransit * 0.85} fontSize={discTransit * 0.9} fill="#f87171">℞</SvgText>
                  ) : null}
                </G>
              )
            })}

            {/* ASC label */}
            {(() => {
              const { x, y } = polarToXY(cx, cy, R_HOUSE_OUT + 10, 180)
              return (
                <SvgText x={x} y={y} fontSize={svgSize * 0.03} textAnchor="middle"
                  alignmentBaseline="middle" fill="#FFD700" fontWeight="bold">
                  ASC
                </SvgText>
              )
            })()}
          </Svg>
        </View>

        {/* Grade de aspectos — natal↔natal no modo Natal; trânsito→natal no modo Trânsitos */}
        {showTransits ? (
          transitPlanets.length >= 1 && natalPlanets.length >= 1 && tnAspectsWithNodes.length > 0 ? (
            <View style={styles.aspectGridWrap}>
              <Text style={styles.aspectGridTitle}>
                {tl('Trânsitos sobre o natal', 'Transits to natal', 'Tránsitos sobre el natal', 'Transiti sul natale')}
              </Text>
              <AspectGrid cross rowPlanets={transitWheelPoints} colPlanets={natalWheelPoints} aspects={tnAspectsWithNodes} onSelectCell={onSelectTransitAspect} />
            </View>
          ) : null
        ) : natalPlanets.length >= 2 && natalAspectsWithNodes.length > 0 ? (
          <View style={styles.aspectGridWrap}>
            <Text style={styles.aspectGridTitle}>
              {tl('Grade de aspectos', 'Aspect grid', 'Rejilla de aspectos', 'Griglia degli aspetti')}
            </Text>
            {/* natalWheelPoints inclui ☊/☋ → a grade mostra os aspectos dos nódulos */}
            <AspectGrid planets={natalWheelPoints} aspects={natalAspectsWithNodes} />
          </View>
        ) : null}

        {/* Legenda de planetas */}
        {showLegend ? (
        <View style={styles.legend}>
          {planetPositions.map(p => (
            <TouchableOpacity
              key={p.name}
              style={styles.legendItem}
              onPress={() => setSelectedPlanet(p)}
              activeOpacity={0.7}
            >
              <Text style={[styles.legendSymbol, { color: PLANET_COLORS[p.name] || '#fff' }]}>
                {PLANET_SYMBOLS[p.name] || '●'}
              </Text>
              <Text style={styles.legendName}>{p.name}</Text>
              <Text style={styles.legendInfo}>
                {(p.degree ?? (p.longitude % 30)).toFixed(0)}° {p.sign}
                {p.isRetrograde ? ' ℞' : ''}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        ) : null}

      {/* Modal de detalhe do planeta */}
      <Modal
        visible={selectedPlanet != null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedPlanet(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setSelectedPlanet(null)}
        >
          {selectedPlanet && (
            <View style={styles.modalCard}>
              <Text style={[styles.modalSymbol, { color: PLANET_COLORS[selectedPlanet.name] || '#fff' }]}>
                {PLANET_SYMBOLS[selectedPlanet.name] || '●'}
              </Text>
              <Text style={styles.modalTitle}>{selectedPlanet.name}</Text>
              <Text style={styles.modalSub}>
                {(selectedPlanet.degree ?? (selectedPlanet.longitude % 30)).toFixed(1)}° {selectedPlanet.sign}
                {selectedPlanet.isRetrograde ? '  ℞ retrógrado' : ''}
              </Text>
              <Text style={styles.modalHouse}>
                {tl('Casa', 'House', 'Casa', 'Casa')} {selectedPlanet.house}
              </Text>
              <TouchableOpacity style={styles.modalClose} onPress={() => setSelectedPlanet(null)}>
                <Text style={styles.modalCloseText}>
                  {tl('Fechar', 'Close', 'Cerrar', 'Chiudi')}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </TouchableOpacity>
      </Modal>
    </>
  )
}

/** Tela standalone (deep link /mapa) — mantém o container e o scroll próprios. */
export default function NatalChartWheelScreen() {
  const { transitData, loading } = useLifeAreas()
  return (
    <LinearGradient colors={['#0F0F23', '#1A1A3A']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={Platform.OS === 'web'}>
        <NatalChartWheelContent transitData={transitData} loading={loading} />
      </ScrollView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: { color: '#8892a4', fontSize: 14 },
  scrollContent: { alignItems: 'center', paddingVertical: 20, paddingHorizontal: 16 },

  wheelWrap: {
    alignItems: 'center',
    marginBottom: 16,
  },
  aspectGridWrap: {
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#12141c',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#222836',
    paddingVertical: 10,
  },
  aspectGridTitle: {
    color: '#8892a4',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },

  legend: {
    width: '100%',
    backgroundColor: '#161a22',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#252b38',
    padding: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1e2430',
  },
  legendSymbol: {
    fontSize: 16,
    width: 24,
    textAlign: 'center',
    marginRight: 8,
  },
  legendName: {
    width: 70,
    fontSize: 13,
    color: '#e2e8f0',
    fontWeight: '500',
  },
  legendInfo: {
    flex: 1,
    fontSize: 12,
    color: '#8892a4',
    textAlign: 'right',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCard: {
    backgroundColor: '#161a22',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#252b38',
    padding: 28,
    alignItems: 'center',
    minWidth: 220,
  },
  modalSymbol: { fontSize: 42, marginBottom: 8 },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#e2e8f0', marginBottom: 6 },
  modalSub: { fontSize: 14, color: '#FFD700', marginBottom: 4 },
  modalHouse: { fontSize: 13, color: '#8892a4', marginBottom: 20 },
  modalClose: {
    backgroundColor: 'rgba(255,215,0,0.12)',
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  modalCloseText: { color: '#FFD700', fontWeight: '600', fontSize: 14 },
})
