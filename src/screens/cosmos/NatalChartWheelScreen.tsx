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
import { Ionicons } from '@expo/vector-icons'
import Svg, { Circle, Line, Path, Text as SvgText, G, Defs, RadialGradient, Stop } from 'react-native-svg'
import { getSignMeaning, getHouseMeaning, type SignificadoRoda } from '../../data/signHouseMeaning'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../config/firebase'
import { useLifeAreas } from '../../hooks/useLifeAreas'
import type { LocalTransitData } from '../../services/astrology/LocalAstrologyService'
import { useAuth } from '../../hooks/useAuth'
import { useAppLanguage } from '../../hooks/useAppLanguage'
import { degToSign } from '../../astro'
import TextoComGlossario from '../../components/TextoComGlossario'
import StarLoader from '../../components/StarLoader'
import type { RealPlanetPosition } from '../../services/astrology/RealAstrologyEngine'
import AspectGrid from '../../components/AspectGrid'
import { aspectBetween } from '../../utils/nodeAspects'
import { translatePlanet, translateSignName } from '../../utils/astro/pt'
import { getPlanetMeaning } from '../../data/planetMeaning'
import {
  resolvePlanetInSignText,
  resolveNatalPlanetInHouseText,
  resolveSignInHouseText,
} from '../../utils/natalInterpretation'
import { resolveNatalPlanetAspectText } from '../../utils/natalInterpretation'
import { resolveNamedPointAspectText } from '../../utils/pointAspectInterpretation'
import { buildUnifiedTransitNarrative } from '../../utils/astroInterpretation'
import { transitCellId } from '../../astro/transitCellId'

// Nome de planeta a partir da chave normalizada do cellId (sun→Sun).
const CAP_PLANET: Record<string, string> = {
  sun: 'Sun', moon: 'Moon', mercury: 'Mercury', venus: 'Venus', mars: 'Mars',
  jupiter: 'Jupiter', saturn: 'Saturn', uranus: 'Uranus', neptune: 'Neptune', pluto: 'Pluto',
  northnode: 'NorthNode', southnode: 'SouthNode', ascendant: 'Ascendant', midheaven: 'Midheaven',
}
const ASPECT_PT: Record<string, string> = {
  conjuncao: 'conjunção', conjunction: 'conjunção', sextil: 'sextil', sextile: 'sextil',
  quadratura: 'quadratura', square: 'quadratura', trigono: 'trígono', trine: 'trígono',
  oposicao: 'oposição', opposition: 'oposição', quincuncio: 'quincúncio', quincunx: 'quincúncio',
}
const aspectLabelPt = (t: string) => ASPECT_PT[String(t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')] || t

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
const SIGNS_PT = ['Áries', 'Touro', 'Gêmeos', 'Câncer', 'Leão', 'Virgem', 'Libra', 'Escorpião', 'Sagitário', 'Capricórnio', 'Aquário', 'Peixes']
const signOfLon = (lon: number) => SIGNS_PT[Math.floor((((lon % 360) + 360) % 360) / 30) % 12]
const ZODIAC_NAMES = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces']

// Fundo do anel do zodíaco por ELEMENTO (fogo, terra, ar, água, repetindo).
// Não é enfeite: o equilíbrio entre elementos é o primeiro diagnóstico que se
// faz num mapa, e a mesma leitura já aparece em texto na Visão Geral. Aqui ela
// fica visível de relance — dá para ver um mapa carregado em água antes de ler
// uma palavra. Alfa muito baixo de propósito: tinge, não pinta.
const ELEMENTO_FILL = [
  'rgba(255,110,70,0.085)',  // fogo
  'rgba(150,200,120,0.075)', // terra
  'rgba(255,215,120,0.075)', // ar
  'rgba(90,170,255,0.085)',  // água
]

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
  // Ângulo de DESENHO. Começa no verdadeiro e só muda se o afastamento radial
  // não der conta — a posição real do planeta continua sendo `trueAngle`.
  const angulo = withAngle.map((w) => w.trueAngle)
  let i = 0
  while (i < withAngle.length) {
    let j = i
    while (j + 1 < withAngle.length && angShort(withAngle[j + 1].trueAngle, withAngle[j].trueAngle) < glyphDeg) j++
    const n = j - i + 1
    for (let k = 0; k < n; k++) {
      const r = R + (k - (n - 1) / 2) * step
      const rClamp = Math.max(minR, Math.min(maxR, r))
      radius[i + k] = rClamp
      // Só o afastamento radial não bastava: quando o grupo é grande, os
      // extremos batem no limite de raio, o clamp empilha vários no MESMO
      // raio e eles voltam a se sobrepor — foi o que o João viu, com planetas
      // encavalados e impossíveis de tocar. Quando o clamp mordeu, abre também
      // em ângulo, que é espaço que o anel sempre tem.
      if (n > 1 && Math.abs(rClamp - r) > 0.5) {
        angulo[i + k] = withAngle[i + k].trueAngle + (k - (n - 1) / 2) * (glyphDeg * 0.85)
      }
    }
    i = j + 1
  }
  return withAngle.map((w, idx) => {
    const pos = polarToXY(cx, cy, radius[idx], angulo[idx])
    return { ...(w.item as T), trueAngle: w.trueAngle, sx: pos.x, sy: pos.y, radius: radius[idx] }
  })
}

/**
 * Caminho de um setor do anel (uma fatia de rosca), de `r1` a `r2`.
 *
 * Serve de área de toque para signo e casa: o desenho deles é só um símbolo
 * solto no anel, pequeno demais para acertar com o dedo. O setor cobre a fatia
 * inteira, então tocar em qualquer ponto dela funciona.
 */
function setorAnelar(cx: number, cy: number, r1: number, r2: number, a1: number, a2: number): string {
  // SEMPRE o menor arco entre os dois ângulos.
  //
  // `lonToSvgAngle` é `180 - (lon - asc)`: longitude crescente gera ângulo
  // DECRESCENTE, porque o zodíaco corre no sentido anti-horário. Assumir o
  // sentido horário fazia cada setor de 30° virar um arco de 330° — todos
  // cobriam o disco inteiro e o último desenhado engolia os toques de todos os
  // outros (na prática: qualquer casa tocada abria a Casa 12, e os signos, que
  // ficam embaixo, nunca recebiam toque nenhum).
  //
  // Nem signo (30°) nem casa passam de 180°, então o menor arco é sempre o certo.
  const horario = ((a2 - a1) % 360 + 360) % 360
  const sentido = horario <= 180 ? 1 : 0 // 1 = horário, 0 = anti-horário
  const p1 = polarToXY(cx, cy, r2, a1)
  const p2 = polarToXY(cx, cy, r2, a2)
  const p3 = polarToXY(cx, cy, r1, a2)
  const p4 = polarToXY(cx, cy, r1, a1)
  return [
    `M ${p1.x} ${p1.y}`,
    `A ${r2} ${r2} 0 0 ${sentido} ${p2.x} ${p2.y}`,
    `L ${p3.x} ${p3.y}`,
    `A ${r1} ${r1} 0 0 ${sentido === 1 ? 0 : 1} ${p4.x} ${p4.y}`,
    'Z',
  ].join(' ')
}

/**
 * Estrelas do fundo da roda.
 *
 * Determinístico de propósito (gerador com semente fixa): com Math.random as
 * estrelas trocariam de lugar a cada render, e o mapa piscaria a cada toque.
 * Fica dentro do raio do disco, com alfa baixo — é profundidade, não enfeite:
 * dá ao mapa a sensação de estar aberto contra o céu em vez de desenhado sobre
 * um fundo chapado.
 */
function estrelasDoFundo(cx: number, cy: number, raio: number, quantas: number) {
  const out: { x: number; y: number; r: number; o: number }[] = []
  let semente = 20260101
  const proximo = () => {
    semente = (semente * 1664525 + 1013904223) % 4294967296
    return semente / 4294967296
  }
  for (let i = 0; i < quantas; i++) {
    // sqrt espalha por ÁREA; sem ele tudo se amontoa no centro.
    const d = Math.sqrt(proximo()) * raio
    const a = proximo() * Math.PI * 2
    out.push({
      x: cx + Math.cos(a) * d,
      y: cy + Math.sin(a) * d,
      r: 0.4 + proximo() * 0.9,
      o: 0.12 + proximo() * 0.3,
    })
  }
  return out
}

// Preenchimento invisível mas TOCÁVEL.
//
// `fill="none"` não recebe toque. E alfa praticamente zero (0.001) também não
// bastou: o hit-test do react-native-svg descarta o que é quase nada. O padrão
// que comprovadamente funciona nesta tela é o dos planetas — `<G onPress>` em
// volta de uma forma com preenchimento REAL — e é o que signo e casa usam agora.
// 0.02 segue invisível a olho nu sobre o fundo escuro.
const TOQUE_INVISIVEL = 'rgba(255,255,255,0.02)'

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
   * Conteúdo renderizado ENTRE a roda e a grade de aspectos.
   *
   * A grade mora dentro deste componente, então quem usa a roda não conseguia
   * colocar nada entre as duas — a leitura do dia acabava caindo depois da
   * grade, longe do desenho que ela explica. A ordem que faz sentido é ver o
   * céu, ler o que ele quer dizer e só então entrar no detalhe.
   */
  /**
   * No modo Trânsitos, torna as células da grade de aspectos tocáveis: ao tocar,
   * chama com o id do trânsito (casa com o nativeID do card na leitura embutida
   * abaixo) para rolar até a interpretação. Web-only (scroll por DOM).
   */
  onSelectTransitAspect?: (cellId: string) => void
  onSelectNatalAspect?: (a: { planet1: string; planet2: string; type: string }) => void
  /** Se fornecido, mostra um ícone de livro ao lado do título "Trânsitos sobre o natal"
   * que abre o modo standalone (Trânsitos Pessoais: importantes/longos/progressões). */
  onOpenTransits?: () => void
  /**
   * Mostra a grade de aspectos abaixo da roda. Desligada no ambiente leve: a
   * grade e a informacao mais densa da tela e a ultima que faz sentido para
   * quem abriu o app querendo saber como esta o dia.
   */
  mostrarGrade?: boolean
}

/**
 * Conteúdo da roda, SEM container próprio (nem LinearGradient nem ScrollView).
 * Recebe os dados por prop de propósito: useLifeAreas não é contexto — cada
 * chamada cria uma instância com estado próprio. Quem monta a tela chama o hook
 * uma vez e passa para cá, para o Cosmos poder embutir roda + perfil sem
 * disparar o cálculo astrológico três vezes.
 */
export function NatalChartWheelContent({ transitData, loading, showLegend = true, chartMeta, showTransits = false, onSelectTransitAspect, onSelectNatalAspect, onOpenTransits, mostrarGrade = true }: ChartContentProps) {
  const { user } = useAuth()
  const { language } = useAppLanguage()
  // Modal de interpretação do aspecto clicado na grade — abre no lugar, sem rolar.
  const [aspectModal, setAspectModal] = useState<{ title: string; subtitle: string; body: string } | null>(null)
  const openNatalAspectModal = React.useCallback((a: { planet1: string; planet2: string; type: string }) => {
    if (!a) return
    const body = resolveNatalPlanetAspectText(a.planet1, a.type, a.planet2, language)
      || resolveNatalPlanetAspectText(a.planet2, a.type, a.planet1, language)
      // Nódulos (e ASC/MC, se entrarem na grade): composer de ponto nomeado.
      || resolveNamedPointAspectText(a.planet1, a.type, a.planet2, language)
    if (!body) return
    setAspectModal({
      title: `${translatePlanet(a.planet1, language)} ${aspectLabelPt(a.type)} ${translatePlanet(a.planet2, language)}`,
      subtitle: language === 'en-US' ? 'Natal aspect' : language === 'es-ES' ? 'Aspecto natal' : language === 'it-IT' ? 'Aspetto natale' : 'Aspecto natal',
      body,
    })
  }, [language])
  const openTransitAspectModal = React.useCallback((cellId: string) => {
    // cellId = txr-<transito>-<tipo>-<natal>
    const parts = String(cellId || '').split('-')
    if (parts.length < 4) return
    const [, tRaw, aRaw, nRaw] = parts
    const transitPlanet = CAP_PLANET[tRaw] || tRaw
    const natalPlanet = CAP_PLANET[nRaw] || nRaw
    const narrative = buildUnifiedTransitNarrative({ transitPlanet, natalPlanet, type: aRaw, aspectName: aRaw } as any, null, language)
    const body = (narrative?.modalBody || narrative?.shortText || '').trim()
    if (!body) return
    setAspectModal({
      title: `${translatePlanet(transitPlanet, language)} ${aspectLabelPt(aRaw)} ${translatePlanet(natalPlanet, language)}`,
      subtitle: language === 'en-US' ? 'Personal transit' : language === 'es-ES' ? 'Tránsito personal' : language === 'it-IT' ? 'Transito personale' : 'Trânsito pessoal',
      body,
    })
  }, [language])
  const { width } = useWindowDimensions()

  // O planeta tocado vem com a ORIGEM. Natal e trânsito eram o mesmo estado, e o
  // modal abria idêntico para os dois: a pessoa tocava no anel de fora (céu de
  // hoje) e lia a interpretação do mapa de nascimento dela. Mesmo glifo, mesmo
  // nome, leitura trocada — e nada na tela avisava qual dos dois estava lendo.
  type PlanetaAberto = { p: RealPlanetPosition; origem: 'natal' | 'transito' }
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetaAberto | null>(null)
  const abrirPlaneta = React.useCallback(
    (p: RealPlanetPosition, origem: 'natal' | 'transito') => setSelectedPlanet({ p, origem }),
    [],
  )
  // Signo e casa ocupam quase toda a área da roda e não respondiam a nada.
  // Guarda O QUE foi tocado, não o texto: sem a identidade não dá para dizer
  // QUAIS planetas da pessoa caem naquele signo ou naquela casa — que é o que
  // transforma o modal de enciclopédia em leitura do mapa dela.
  const [infoRoda, setInfoRoda] = useState<
    { tipo: 'signo'; indice: number } | { tipo: 'casa'; numero: number } | null
  >(null)
  // Cabeçalho da grade tocado: mostra o MESMO planeta nos dois estados — onde
  // ele estava quando a pessoa nasceu e onde está hoje. É a comparação que a
  // grade inteira pressupõe mas nunca mostrava.
  const [planetaDaGrade, setPlanetaDaGrade] = useState<string | null>(null)
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

  // A roda desenha o eixo ☊/☋ inteiro, mas na GRADE o Nó Sul é sempre o espelho
  // do Norte (Norte ☌ = Sul ☍, Norte △ = Sul ✶…) → dobrava as linhas. Grade só Norte.
  const natalGridPoints = useMemo(() => natalWheelPoints.filter(p => p.name !== 'SouthNode'), [natalWheelPoints])
  const transitGridPoints = useMemo(() => transitWheelPoints.filter(p => p.name !== 'SouthNode'), [transitWheelPoints])

  // Aspectos dos nódulos NATAIS → planetas natais (grade natal; orbe 5°).
  const natalAspectsWithNodes = useMemo(() => {
    if (natalNorthNode == null) return aspects
    const extra: any[] = []
    // Só o Nó Norte: o Sul é o eixo oposto e geraria os aspectos-espelho (redundantes).
    const nodes: [string, number][] = [['NorthNode', natalNorthNode]]
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
      // Só o Nó Norte natal (o Sul é o espelho — evita as linhas dobradas na grade).
      const nn: [string, number][] = [['NorthNode', natalNorthNode]]
      for (const tp of transitPlanets) for (const [name, lon] of nn) {
        if (typeof tp.longitude !== 'number') continue
        const a = aspectBetween(tp.longitude, lon); if (a) extra.push({ planet1: tp.name, planet2: name, type: a.type, orb: a.orb })
      }
    }
    if (currentNorthNode != null) {
      // Só o Nó Norte em trânsito (idem).
      const tn: [string, number][] = [['NorthNode', currentNorthNode]]
      for (const [name, lon] of tn) for (const np of natalPlanets) {
        if (typeof np.longitude !== 'number') continue
        const a = aspectBetween(lon, np.longitude); if (a) extra.push({ planet1: name, planet2: np.name, type: a.type, orb: a.orb })
      }
    }
    return [...tnAspects, ...extra]
  }, [showTransits, tnAspects, transitPlanets, natalPlanets, natalNorthNode, currentNorthNode])

  // Dimensões do SVG. Na bi-roda o natal encolhe (scale) p/ abrir o anel externo.
  // NITIDEZ: tudo que define o desenho cai em pixel inteiro.
  //
  // `width` do useWindowDimensions costuma vir fracionario no Android
  // (392.7272...). Sem arredondar, svgSize herda a fracao, o centro vira
  // 180.36 e TODA coordenada derivada dele cai em meio-pixel — cada circulo,
  // cada linha e cada glifo entram em anti-aliasing e o desenho inteiro fica
  // com aquele aspecto lavado. O SVG e vetorial: borrado aqui nunca foi
  // resolucao, sempre foi alinhamento.
  //
  // Par de propósito: com svgSize par, cx e cy sao inteiros exatos.
  const svgSize = Math.floor(Math.min(width - 32, 380) / 2) * 2
  const cx = svgSize / 2
  const cy = svgSize / 2
  const scale = showTransits ? 0.80 : 1
  /** Arredonda medida de desenho para o pixel. */
  const px = (v: number) => Math.round(v)

  const R_TRANSIT = px(svgSize * 0.45)   // anel externo dos planetas em trânsito (só bi-roda)
  const R_OUTER = px(svgSize * 0.46 * scale)   // borda externa (zodíaco)
  const R_ZODIAC_IN = px(svgSize * 0.38 * scale) // borda interna do zodíaco
  const R_HOUSE_OUT = px(svgSize * 0.36 * scale) // borda externa das casas
  const R_HOUSE_IN = px(svgSize * 0.28 * scale)  // borda interna das casas
  const R_PLANET = px(svgSize * 0.21 * scale)    // posição dos planetas natais
  const R_INNER = px(svgSize * 0.14 * scale)     // círculo central (aspectos)

  // Glifos MENORES (pedido do João) + empilhamento radial dentro da banda.
  const discNatal = px(svgSize * (showTransits ? 0.030 : 0.034))
  const discTransit = px(svgSize * 0.028)
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

  // Recalcular a cada render faria o céu piscar; depende só do tamanho.
  const campoDeEstrelas = useMemo(
    () => estrelasDoFundo(cx, cy, R_OUTER * 0.97, 54),
    [cx, cy, R_OUTER],
  )

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
      // Espessura pela exatidão. Um aspecto com orbe de 0,5° pesa muito mais na
      // vida que um de 7°, e com todas as linhas iguais o centro virava um
      // emaranhado onde tudo parecia igualmente importante.
      const orbe = Number((asp as any).orb)
      const largura = Number.isFinite(orbe) ? Math.max(0.45, 1.6 - orbe * 0.2) : 0.8
      return { key: `${asp.planet1}-${asp.planet2}`, pt1, pt2, color, largura }
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
            <Defs>
              {/* Céu profundo: clareia um pouco no centro e escurece na borda.
                  Dá volume ao disco sem nenhuma sombra falsa — a roda deixa de
                  ser um recorte chapado e passa a parecer uma abertura. */}
              <RadialGradient id="ceuProfundo" cx="50%" cy="50%" r="50%">
                <Stop offset="0%" stopColor="#171c2b" />
                <Stop offset="62%" stopColor="#11141f" />
                <Stop offset="100%" stopColor="#0b0d15" />
              </RadialGradient>
            </Defs>

            {/* Fundo */}
            <Circle cx={cx} cy={cy} r={R_OUTER} fill="url(#ceuProfundo)" stroke="#2a3246" strokeWidth={1} />
            {campoDeEstrelas.map((e, i) => (
              <Circle key={`st-${i}`} cx={e.x} cy={e.y} r={e.r} fill="#FFFFFF" fillOpacity={e.o} />
            ))}

            {/* Anel do zodíaco */}
            <Circle cx={cx} cy={cy} r={R_ZODIAC_IN} fill="none" stroke="#252b38" strokeWidth={1} />

            {/* Fundo do anel por elemento. Primeiro de tudo: é a camada mais ao
                fundo e nada deve ficar atrás dela. */}
            {zodiacSections.map(z => (
              <Path
                key={`elem-${z.i}`}
                d={setorAnelar(cx, cy, R_ZODIAC_IN, R_OUTER, z.startAngle, z.endAngle)}
                fill={ELEMENTO_FILL[z.i % 4]}
              />
            ))}

            {/* Símbolos dos signos */}
            {zodiacSections.map(z => (
              <SvgText
                key={z.i}
                x={z.sx}
                y={z.sy}
                fontSize={px(svgSize * 0.055)}
                textAnchor="middle"
                alignmentBaseline="middle"
                // Era 0.6 de alfa: o glifo sumia no fundo escuro e o anel inteiro
                // virava textura. Ele nomeia o setor — precisa ser legível.
                fill="rgba(255,215,0,0.92)"
                // Decorativo: quem recebe o toque é o setor inteiro, lá no fim do
                // SVG. Sem isto o glifo fica na frente dele e engole o toque no
                // meio exato do setor — justo onde o dedo naturalmente cai.
                pointerEvents="none"
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
                  stroke="rgba(255,215,0,0.22)" strokeWidth={1} pointerEvents="none" />
              )
            })}

            {/* Anel das casas */}
            <Circle cx={cx} cy={cy} r={R_HOUSE_OUT} fill="none" stroke="#252b38" strokeWidth={1} />
            <Circle cx={cx} cy={cy} r={R_HOUSE_IN} fill="#10131c" stroke="#252b38" strokeWidth={1} />

            {/* Áreas de toque das casas. Usam as cúspides REAIS: em Placidus as casas
                têm tamanhos diferentes, então fatiar de 30 em 30 erraria o alvo. */}
            {houseLines.map((h, i) => {
              const proxima = houseLines[(i + 1) % houseLines.length]
              if (!proxima) return null
              return (
                <G key={`toque-casa-${h.i}`} onPress={() => setInfoRoda({ tipo: 'casa', numero: h.i + 1 })}>
                  <Path
                    d={setorAnelar(cx, cy, R_HOUSE_IN, R_HOUSE_OUT, h.angle, proxima.angle)}
                    fill={TOQUE_INVISIVEL}
                  />
                </G>
              )
            })}

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
                fontSize={px(svgSize * 0.036)}
                textAnchor="middle"
                alignmentBaseline="middle"
                // 0.35 de alfa era quase invisível — e a casa é metade da leitura
                // (o QUE acontece é o planeta; ONDE acontece é a casa).
                fill="rgba(255,255,255,0.55)"
              >
                {h.label}
              </SvgText>
            ))}

            {/* Linhas de aspectos */}
            {aspectLines.map(l => l && (
              <Line key={l.key}
                x1={l.pt1.x} y1={l.pt1.y}
                x2={l.pt2.x} y2={l.pt2.y}
                stroke={l.color} strokeWidth={l.largura}
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
                <G key={p.name} onPress={() => abrirPlaneta(p, 'natal')}>
                  {/* Halo da cor do planeta: separa o disco do fundo e dá ao anel
                      dos planetas o peso visual que ele merece — é o protagonista
                      da roda, mas antes competia de igual para igual com o
                      zodíaco e as casas. Alfa baixo: destaca sem virar enfeite. */}
                  <Circle cx={p.sx} cy={p.sy} r={discNatal * 1.55} fill={color} fillOpacity={0.1} />
                  <Circle cx={p.sx} cy={p.sy} r={discNatal} fill="#161a22" stroke={color} strokeWidth={1.4} />
                  <SvgText x={p.sx} y={p.sy}
                    fontSize={px(discNatal * 1.5)}
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
                      fontSize={px(discNatal * 0.9)}
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
                <G key={`t-${p.name}`} onPress={() => abrirPlaneta(p, 'transito')}>
                  <Circle cx={p.sx} cy={p.sy} r={discTransit} fill="#0e2222" stroke={color} strokeWidth={1} />
                  <SvgText x={p.sx} y={p.sy}
                    fontSize={px(discTransit * 1.5)}
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    fill={color}
                  >
                    {PLANET_SYMBOLS[p.name] || '●'}
                  </SvgText>
                  {p.isRetrograde ? (
                    <SvgText x={p.sx + discTransit * 0.85} y={p.sy - discTransit * 0.85} fontSize={px(discTransit * 0.9)} fill="#f87171">℞</SvgText>
                  ) : null}
                </G>
              )
            })}

            {/* ASC label */}
            {(() => {
              const { x, y } = polarToXY(cx, cy, R_HOUSE_OUT + 10, 180)
              return (
                <SvgText x={x} y={y} fontSize={px(svgSize * 0.03)} textAnchor="middle"
                  alignmentBaseline="middle" fill="#FFD700" fontWeight="bold"
                  pointerEvents="none">
                  ASC
                </SvgText>
              )
            })()}
            {/* Áreas de toque dos signos — POR ÚLTIMO, de propósito.
                Isto já falhou três vezes enquanto a camada ficava no fundo do
                desenho. O hit-test do SVG percorre os elementos do último para o
                primeiro, então qualquer coisa desenhada depois intercepta o toque
                antes de ele chegar aqui — e as casas, que sempre funcionaram,
                justamente são desenhadas quase no fim. Em vez de caçar qual
                elemento intercepta, a camada passa a ser a última de todas.
                É seguro: o anel do zodíaco não tem nenhum planeta (natais em
                R_PLANET=0.21, trânsito em 0.45+), então não há toque de glifo
                para roubar. */}
            {zodiacSections.map(z => (
              <G key={`toque-signo-${z.i}`} onPress={() => setInfoRoda({ tipo: 'signo', indice: z.i })}>
                <Path
                  d={setorAnelar(cx, cy, R_ZODIAC_IN, R_OUTER, z.startAngle, z.endAngle)}
                  fill={TOQUE_INVISIVEL}
                />
              </G>
            ))}
          </Svg>
        </View>

        {/* Grade de aspectos — natal↔natal no modo Natal; trânsito→natal no modo Trânsitos */}
        {!mostrarGrade ? null : showTransits ? (
          transitPlanets.length >= 1 && natalPlanets.length >= 1 && tnAspectsWithNodes.length > 0 ? (
            <View style={styles.aspectGridWrap}>
              <View style={{ alignSelf: 'stretch', height: 30, justifyContent: 'center', marginBottom: 6 }}>
                <Text style={[styles.aspectGridTitle, { textAlign: 'center', marginBottom: 0, paddingHorizontal: 46 }]}>
                  {tl('Trânsitos sobre o natal', 'Transits to natal', 'Tránsitos sobre el natal', 'Transiti sul natale')}
                </Text>
                {/* idem: a tabela cruza dois conjuntos de planetas e isso não é
                    óbvio para ninguém de fora. */}
                {onOpenTransits ? (
                  <TouchableOpacity style={styles.gridBookBtn} onPress={onOpenTransits} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} accessibilityRole="button"
                    accessibilityLabel={tl('Abrir trânsitos completos', 'Open full transits', 'Abrir transitos completos', 'Apri transiti completi')}>
                    <Ionicons name="book" size={14} color="#0F0F23" />
                  </TouchableOpacity>
                ) : null}
              </View>
              <Text style={styles.aspectGridHint}>
                {tl(
                  'Linhas são os planetas de hoje; colunas, os do seu nascimento. Cada símbolo é um encontro entre os dois — toque para ler.',
                  'Rows are today\'s planets; columns, the ones from your birth. Each symbol is a meeting between the two — tap to read.',
                  'Las filas son los planetas de hoy; las columnas, los de tu nacimiento. Cada simbolo es un encuentro entre ambos — toca para leer.',
                  'Le righe sono i pianeti di oggi; le colonne, quelli della tua nascita. Ogni simbolo e un incontro tra i due — tocca per leggere.',
                )}
              </Text>
              <AspectGrid
                cross
                rowPlanets={transitGridPoints}
                colPlanets={natalGridPoints}
                aspects={tnAspectsWithNodes}
                onSelectCell={openTransitAspectModal}
                onSelectPlanet={setPlanetaDaGrade}
              />
            </View>
          ) : null
        ) : natalPlanets.length >= 2 && natalAspectsWithNodes.length > 0 ? (
          <View style={styles.aspectGridWrap}>
            <Text style={styles.aspectGridTitle}>
              {tl('Grade de aspectos', 'Aspect grid', 'Rejilla de aspectos', 'Griglia degli aspetti')}
            </Text>
            {/* Sem esta linha a grade é uma tabela de 100 símbolos sem legenda — o
                ponto mais hostil do app para quem não estuda astrologia. Diz o que é
                e que dá para tocar, antes de a pessoa decidir que não é para ela. */}
            <Text style={styles.aspectGridHint}>
              {tl(
                'Cada símbolo é uma conversa entre dois planetas do seu mapa. Toque em um para ler o que significa.',
                'Each symbol is a conversation between two planets of your chart. Tap one to read what it means.',
                'Cada simbolo es una conversacion entre dos planetas de tu mapa. Toca uno para leer que significa.',
                'Ogni simbolo e una conversazione tra due pianeti del tuo tema. Toccane uno per leggere cosa significa.',
              )}
            </Text>
            {/* natalGridPoints inclui só ☊ (o eixo) → a grade mostra os aspectos do nódulo sem duplicar */}
            <AspectGrid planets={natalGridPoints} aspects={natalAspectsWithNodes} onSelectAspect={openNatalAspectModal} />
          </View>
        ) : null}

        {/* Legenda de planetas */}
        {showLegend ? (
        <View style={styles.legend}>
          {planetPositions.map(p => (
            <TouchableOpacity
              key={p.name}
              style={styles.legendItem}
              onPress={() => abrirPlaneta(p, 'natal')}
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

      {/* Planeta tocado no cabeçalho da grade: as DUAS posições lado a lado.
          A grade cruza trânsito com natal o tempo todo, mas não dizia onde cada
          um está — e sem isso "Saturno" na linha e "Saturno" na coluna parecem
          a mesma coisa. Fecha tocando fora e pelo botão voltar. */}
      <Modal visible={planetaDaGrade != null} transparent animationType="fade" onRequestClose={() => setPlanetaDaGrade(null)}>
        <TouchableOpacity style={styles.aspectModalOverlay} activeOpacity={1} onPress={() => setPlanetaDaGrade(null)}>
          <TouchableOpacity style={styles.aspectModalCard} activeOpacity={1} onPress={() => {}}>
            {(() => {
              const nome = planetaDaGrade || ''
              const nat = natalPlanets.find((x) => x.name === nome)
              const tra = transitPlanets.find((x) => x.name === nome)
              const posicao = (x: any) => {
                if (!x || typeof x.longitude !== 'number') return null
                const grau = Math.floor(x.longitude % 30)
                const signo = ZODIAC_NAMES[Math.floor((x.longitude % 360) / 30)]
                const casa = typeof x.house === 'number' && x.house > 0 ? x.house : null
                return { grau, signo, casa, retro: !!x.isRetrograde }
              }
              const pn = posicao(nat)
              const pt = posicao(tra)
              const linha = (rotulo: string, cor: string, d: ReturnType<typeof posicao>) => d ? (
                <View style={styles.planetaLinha}>
                  <Text style={[styles.planetaRotulo, { color: cor }]}>{rotulo}</Text>
                  <Text style={styles.planetaValor}>
                    {`${d.grau}° ${translateSignName(d.signo, language as any)}`}
                    {d.casa ? ` · ${tl('Casa', 'House', 'Casa', 'Casa')} ${d.casa}` : ''}
                    {d.retro ? ' ℞' : ''}
                  </Text>
                </View>
              ) : null
              return (
                <>
                  <Text style={styles.aspectModalTitle}>{translatePlanet(nome, language)}</Text>
                  <Text style={styles.aspectModalSubtitle}>
                    {tl('Onde está hoje · onde estava no seu nascimento', 'Where it is today · where it was at your birth', 'Donde esta hoy · donde estaba en tu nacimiento', 'Dove e oggi · dove era alla tua nascita')}
                  </Text>
                  {linha(tl('Hoje', 'Today', 'Hoy', 'Oggi'), '#67E8F9', pt)}
                  {linha(tl('No nascimento', 'At birth', 'En el nacimiento', 'Alla nascita'), '#FFD700', pn)}
                  <ScrollView style={{ maxHeight: 220, marginTop: 10 }}>
                    <TextoComGlossario style={styles.aspectModalBody}>
                      {getPlanetMeaning(nome, language)?.essence || ''}
                    </TextoComGlossario>
                  </ScrollView>
                </>
              )
            })()}
            <TouchableOpacity style={styles.aspectModalClose} onPress={() => setPlanetaDaGrade(null)}>
              <Text style={styles.aspectModalCloseText}>{language === 'en-US' ? 'Close' : language === 'es-ES' ? 'Cerrar' : language === 'it-IT' ? 'Chiudi' : 'Fechar'}</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Modal de signo ou casa tocada na roda.
          Fecha tocando FORA do card e pelo botão voltar do Android
          (onRequestClose) — não exige mirar num X pequeno. */}
      {/* Signo ou casa tocada na roda.
          Além do significado, mostra o que É SEU ali: os planetas que caem
          naquele signo ou naquela casa, com posição e leitura do catálogo. Sem
          isso o modal explicava o arquétipo e não dizia nada sobre o mapa de
          quem está olhando. Cada planeta é tocável e abre a própria ficha. */}
      <Modal visible={infoRoda != null} transparent animationType="fade" onRequestClose={() => setInfoRoda(null)}>
        <TouchableOpacity style={styles.aspectModalOverlay} activeOpacity={1} onPress={() => setInfoRoda(null)}>
          <TouchableOpacity style={styles.aspectModalCard} activeOpacity={1} onPress={() => {}}>
            {(() => {
              if (!infoRoda) return null
              const ehSigno = infoRoda.tipo === 'signo'
              const signoEn = ehSigno ? ZODIAC_NAMES[infoRoda.indice] : null
              const casaNum = !ehSigno ? infoRoda.numero : null
              const sig = ehSigno
                ? getSignMeaning(signoEn!, language)
                : getHouseMeaning(casaNum!, language)

              // Os planetas natais que caem aqui — é o que torna o modal SOBRE
              // a pessoa, e não uma enciclopédia.
              const dentro = natalPlanets.filter((pl) => {
                if (typeof pl.longitude !== 'number') return false
                if (ehSigno) return Math.floor((pl.longitude % 360) / 30) === infoRoda.indice
                return typeof pl.house === 'number' && pl.house === casaNum
              })

              // Para a casa: qual signo está na cúspide dela.
              const signoDaCasa = !ehSigno && houseCusps.length === 12
                ? ZODIAC_NAMES[Math.floor((houseCusps[casaNum! - 1] % 360) / 30)]
                : null

              return (
                <>
                  <Text style={styles.aspectModalTitle}>{sig?.nome}</Text>
                  <Text style={styles.aspectModalSubtitle}>{sig?.palavras}</Text>

                  <ScrollView style={{ maxHeight: 340 }}>
                    <TextoComGlossario style={styles.aspectModalBody}>{sig?.texto || ''}</TextoComGlossario>

                    {/* Casa: o signo da cúspide dá o TOM de como ela se expressa. */}
                    {signoDaCasa ? (
                      <View style={styles.blocoModal}>
                        <Text style={styles.blocoRotulo}>
                          {tl('No seu mapa', 'In your chart', 'En tu mapa', 'Nel tuo tema')}
                        </Text>
                        <TextoComGlossario style={styles.aspectModalBody}>
                          {resolveSignInHouseText(signoDaCasa, casaNum!, language)
                            || tl(`Esta casa começa em ${translateSignName(signoDaCasa, language as any)}.`,
                                  `This house begins in ${translateSignName(signoDaCasa, language as any)}.`,
                                  `Esta casa empieza en ${translateSignName(signoDaCasa, language as any)}.`,
                                  `Questa casa inizia in ${translateSignName(signoDaCasa, language as any)}.`)}
                        </TextoComGlossario>
                      </View>
                    ) : null}

                    {/* Os planetas que moram aqui, com posição e leitura. */}
                    {dentro.length ? (
                      <View style={styles.blocoModal}>
                        <Text style={styles.blocoRotulo}>
                          {dentro.length === 1
                            ? tl('Seu planeta aqui', 'Your planet here', 'Tu planeta aqui', 'Il tuo pianeta qui')
                            : tl('Seus planetas aqui', 'Your planets here', 'Tus planetas aqui', 'I tuoi pianeti qui')}
                        </Text>
                        {dentro.map((pl) => {
                          const grau = Math.floor((pl.longitude as number) % 30)
                          const leitura = ehSigno
                            ? resolvePlanetInSignText(pl.name, signoEn!, language)
                            : (typeof pl.house === 'number' ? resolveNatalPlanetInHouseText(pl.name, pl.house, language) : null)
                          return (
                            <TouchableOpacity
                              key={`dentro-${pl.name}`}
                              activeOpacity={0.75}
                              onPress={() => { setInfoRoda(null); abrirPlaneta(pl, 'natal') }}
                              style={styles.planetaDoBloco}
                            >
                              <Text style={styles.planetaDoBlocoTitulo}>
                                <Text style={{ color: PLANET_COLORS[pl.name] || '#fff' }}>
                                  {PLANET_SYMBOLS[pl.name] || '●'}{'  '}
                                </Text>
                                {translatePlanet(pl.name, language)} · {grau}°
                                {pl.isRetrograde ? ' ℞' : ''}
                              </Text>
                              {leitura ? (
                                <TextoComGlossario style={styles.planetaDoBlocoTexto}>{leitura}</TextoComGlossario>
                              ) : null}
                            </TouchableOpacity>
                          )
                        })}
                      </View>
                    ) : (
                      <Text style={styles.blocoVazio}>
                        {ehSigno
                          ? tl('Você não tem planetas neste signo — o tema age mais de fora.',
                               'You have no planets in this sign — the theme acts more from the outside.',
                               'No tienes planetas en este signo — el tema actua mas desde afuera.',
                               'Non hai pianeti in questo segno — il tema agisce piu da fuori.')
                          : tl('Nenhum planeta seu nesta casa — o que vale aqui é o signo da entrada.',
                               'No planets of yours in this house — what counts here is the sign on the cusp.',
                               'Ningun planeta tuyo en esta casa — lo que vale es el signo de entrada.',
                               'Nessun tuo pianeta in questa casa — conta il segno di ingresso.')}
                      </Text>
                    )}

                    {/* Ficha técnica depois do conteúdo e em tipo menor: quem
                        chegou agora ignora; quem estuda procura exatamente isto. */}
                    {sig?.ficha ? <Text style={styles.fichaTecnica}>{sig.ficha}</Text> : null}
                  </ScrollView>

                  <TouchableOpacity style={styles.aspectModalClose} onPress={() => setInfoRoda(null)}>
                    <Text style={styles.aspectModalCloseText}>{language === 'en-US' ? 'Close' : language === 'es-ES' ? 'Cerrar' : language === 'it-IT' ? 'Chiudi' : 'Fechar'}</Text>
                  </TouchableOpacity>
                </>
              )
            })()}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Modal de interpretação do aspecto clicado na grade */}
      <Modal visible={aspectModal != null} transparent animationType="fade" onRequestClose={() => setAspectModal(null)}>
        <View style={styles.aspectModalOverlay}>
          <View style={styles.aspectModalCard}>
            <Text style={styles.aspectModalTitle}>{aspectModal?.title}</Text>
            <Text style={styles.aspectModalSubtitle}>{aspectModal?.subtitle}</Text>
            <ScrollView style={{ maxHeight: 320 }}>
              {/* A leitura que abre ao tocar numa célula da grade — é o texto que a
                  pessoa lê com mais atenção, e o que mais vale ter o termo explicado. */}
              <TextoComGlossario style={styles.aspectModalBody}>{aspectModal?.body || ''}</TextoComGlossario>
            </ScrollView>
            <TouchableOpacity style={styles.aspectModalClose} onPress={() => setAspectModal(null)}>
              <Text style={styles.aspectModalCloseText}>{language === 'en-US' ? 'Close' : language === 'es-ES' ? 'Cerrar' : language === 'it-IT' ? 'Chiudi' : 'Fechar'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
          {selectedPlanet && (() => {
            // Natal e trânsito são leituras DIFERENTES do mesmo glifo, e o modal
            // precisa dizer qual das duas está na tela.
            //
            //  - natal (anel de dentro): quem a pessoa é. Catálogos natais —
            //    essência, planeta no signo, planeta na casa. Não muda nunca.
            //  - trânsito (anel de fora): o céu de hoje. NÃO usa catálogo natal:
            //    "Marte em Áries hoje" não quer dizer o que "Marte em Áries no
            //    nascimento" quer, e aplicar o texto natal a um trânsito é
            //    afirmar com confiança uma coisa que não é verdade. O que vale
            //    aqui é o catálogo de TRÂNSITO — os aspectos que ele está
            //    fazendo no mapa dela — e a casa natal que ele percorre.
            const { p: planeta, origem } = selectedPlanet
            const ehTransito = origem === 'transito'
            const nome = planeta.name
            const lon = ((planeta.longitude as number) % 360 + 360) % 360
            const signoEn = ZODIAC_NAMES[Math.floor(lon / 30)]
            const grau = lon % 30
            // Trânsito: a casa é sempre a NATAL percorrida (houseOfLon usa as
            // cúspides de nascimento). O `house` que vem no planeta de trânsito
            // pode ser a casa do céu de agora, que aqui não diz nada.
            const casa = ehTransito
              ? (houseOfLon(lon) || null)
              : (typeof planeta.house === 'number' && planeta.house > 0 ? planeta.house : null)
            const essencia = getPlanetMeaning(nome, language)?.essence || ''
            const noSigno = ehTransito ? null : resolvePlanetInSignText(nome, signoEn, language)
            const naCasa = !ehTransito && casa ? resolveNatalPlanetInHouseText(nome, casa, language) : null
            const casaInfo = ehTransito && casa ? getHouseMeaning(casa, language) : null
            const cor = PLANET_COLORS[nome] || '#fff'

            // Os trânsitos ligados a ESTE planeta. De um lado ou do outro,
            // conforme a origem: o planeta em trânsito é o que age (planet1), o
            // planeta natal é o que recebe (planet2). Trocar os lados aqui
            // atribuiria o aspecto ao par errado sem acusar nada.
            const ligados = (showTransits ? tnAspectsWithNodes : [])
              .filter((a: any) => (ehTransito ? a?.planet1 === nome : a?.planet2 === nome))
              .slice()
              .sort((a: any, b: any) => (a?.orb ?? 99) - (b?.orb ?? 99))
              .slice(0, 5)
            const idDoTransito = (a: any) =>
              transitCellId(String(a?.planet1 || ''), String(a?.type || ''), String(a?.planet2 || ''))

            return (
              <TouchableOpacity style={styles.aspectModalCard} activeOpacity={1} onPress={() => {}}>
                <Text style={[styles.modalSymbol, { color: cor }]}>{PLANET_SYMBOLS[nome] || '●'}</Text>

                {/* O rótulo vem ANTES do nome: é a primeira coisa a saber, e sem
                    ele as duas leituras são indistinguíveis. */}
                <Text style={[styles.selo, ehTransito ? styles.seloTransito : styles.seloNatal]}>
                  {ehTransito
                    ? tl('EM TRÂNSITO HOJE', 'IN TRANSIT TODAY', 'EN TRANSITO HOY', 'IN TRANSITO OGGI')
                    : tl('PLANETA NATAL', 'NATAL PLANET', 'PLANETA NATAL', 'PIANETA NATALE')}
                </Text>

                <Text style={styles.aspectModalTitle}>{translatePlanet(nome, language)}</Text>
                <Text style={styles.aspectModalSubtitle}>
                  {`${grau.toFixed(1)}° ${translateSignName(signoEn, language as any)}`}
                  {casa ? ` · ${ehTransito
                    ? tl('passando pela Casa', 'crossing House', 'pasando por la Casa', 'attraversa la Casa')
                    : tl('Casa', 'House', 'Casa', 'Casa')} ${casa}` : ''}
                  {planeta.isRetrograde ? ` · ${tl('retrógrado', 'retrograde', 'retrogrado', 'retrogrado')} ℞` : ''}
                </Text>

                <ScrollView style={{ maxHeight: 360 }}>
                  {/* A essência do planeta vale nas duas leituras: é o que ele é,
                      não onde está. */}
                  {essencia ? (
                    <TextoComGlossario style={styles.aspectModalBody}>{essencia}</TextoComGlossario>
                  ) : null}

                  {ehTransito ? (
                    <>
                      <Text style={styles.avisoOrigem}>
                        {tl(
                          'Esta é a posição dele no céu de hoje — não a do seu nascimento.',
                          'This is where it sits in the sky today — not where it sat at your birth.',
                          'Esta es su posicion en el cielo de hoy — no la de tu nacimiento.',
                          'Questa e la sua posizione nel cielo di oggi — non quella della tua nascita.',
                        )}
                      </Text>

                      {casaInfo ? (
                        <View style={styles.blocoModal}>
                          <Text style={styles.blocoRotulo}>
                            {tl('Área que ele está mexendo', 'Area it is stirring', 'Area que esta moviendo', 'Area che sta muovendo')}
                          </Text>
                          <Text style={styles.planetaDoBlocoTitulo}>
                            {tl('Casa', 'House', 'Casa', 'Casa')} {casa} · {casaInfo.nome}
                          </Text>
                          {/* As três palavras antes do parágrafo: quem só passa o
                              olho já sai sabendo de que área se trata. */}
                          {casaInfo.palavras ? (
                            <Text style={styles.planetaDoBlocoTexto}>{casaInfo.palavras}</Text>
                          ) : null}
                          <TextoComGlossario style={styles.aspectModalBody}>
                            {casaInfo.texto || casaInfo.palavras || ''}
                          </TextoComGlossario>
                        </View>
                      ) : null}
                    </>
                  ) : (
                    <>
                      {noSigno ? (
                        <View style={styles.blocoModal}>
                          <Text style={styles.blocoRotulo}>
                            {tl('Em', 'In', 'En', 'In')} {translateSignName(signoEn, language as any)}
                          </Text>
                          <TextoComGlossario style={styles.aspectModalBody}>{noSigno}</TextoComGlossario>
                        </View>
                      ) : null}

                      {naCasa ? (
                        <View style={styles.blocoModal}>
                          <Text style={styles.blocoRotulo}>
                            {tl('Na Casa', 'In House', 'En la Casa', 'Nella Casa')} {casa}
                          </Text>
                          <TextoComGlossario style={styles.aspectModalBody}>{naCasa}</TextoComGlossario>
                        </View>
                      ) : null}
                    </>
                  )}

                  {ligados.length ? (
                    <View style={styles.blocoModal}>
                      <Text style={styles.blocoRotulo}>
                        {ehTransito
                          ? tl('O que ele toca no seu mapa', 'What it touches in your chart', 'Lo que toca en tu mapa', 'Cosa tocca nel tuo tema')
                          : tl('O que o céu de hoje faz com ele', 'What today sky does to it', 'Lo que el cielo de hoy le hace', 'Cosa gli fa il cielo di oggi')}
                      </Text>
                      {ligados.map((a: any) => (
                        <TouchableOpacity
                          key={`lig-${a.planet1}-${a.type}-${a.planet2}`}
                          activeOpacity={0.75}
                          // Abre a interpretação do trânsito. Fecha este modal
                          // primeiro: dois Modal empilhados no Android deixam o
                          // de baixo capturando o toque.
                          onPress={() => { setSelectedPlanet(null); openTransitAspectModal(idDoTransito(a)) }}
                          style={styles.planetaDoBloco}
                        >
                          <Text style={styles.planetaDoBlocoTitulo}>
                            {translatePlanet(a.planet1, language)} {aspectLabelPt(a.type)} {translatePlanet(a.planet2, language)}
                          </Text>
                          <Text style={styles.planetaDoBlocoTexto}>
                            {typeof a.orb === 'number'
                              ? `${tl('orbe', 'orb', 'orbe', 'orbe')} ${a.orb.toFixed(1)}° · ${tl('toque para a leitura', 'tap for the reading', 'toca para la lectura', 'tocca per la lettura')}`
                              : tl('toque para a leitura', 'tap for the reading', 'toca para la lectura', 'tocca per la lettura')}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  ) : null}
                </ScrollView>

                {/* Ir até a lista de trânsitos, abaixo da roda. O modal explica;
                    a lista é onde a pessoa compara e se aprofunda. */}
                {ligados.length && onSelectTransitAspect ? (
                  <TouchableOpacity
                    style={styles.irParaLista}
                    activeOpacity={0.8}
                    onPress={() => { const id = idDoTransito(ligados[0]); setSelectedPlanet(null); onSelectTransitAspect(id) }}
                  >
                    <Text style={styles.irParaListaTexto}>
                      {tl('Ver na lista de trânsitos', 'See in the transit list', 'Ver en la lista de transitos', 'Vedi nella lista dei transiti')}
                      {'  ↓'}
                    </Text>
                  </TouchableOpacity>
                ) : onOpenTransits ? (
                  <TouchableOpacity
                    style={styles.irParaLista}
                    activeOpacity={0.8}
                    onPress={() => { setSelectedPlanet(null); onOpenTransits() }}
                  >
                    <Text style={styles.irParaListaTexto}>
                      {tl('Ver meus trânsitos', 'See my transits', 'Ver mis transitos', 'Vedi i miei transiti')}
                      {'  →'}
                    </Text>
                  </TouchableOpacity>
                ) : null}

                <TouchableOpacity style={styles.aspectModalClose} onPress={() => setSelectedPlanet(null)}>
                  <Text style={styles.aspectModalCloseText}>{tl('Fechar', 'Close', 'Cerrar', 'Chiudi')}</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            )
          })()}
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
  aspectModalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', paddingHorizontal: 22 },
  aspectModalCard: { backgroundColor: '#161728', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)' },
  aspectModalTitle: { color: '#EDEBF7', fontSize: 20, fontWeight: '800' },
  aspectModalSubtitle: { color: '#a8aac4', fontSize: 13, marginTop: 3, marginBottom: 14, textTransform: 'uppercase', letterSpacing: 0.5 },
  aspectModalBody: { color: '#ddd6f3', fontSize: 16, lineHeight: 25 },
  aspectModalClose: { backgroundColor: '#FFD700', borderRadius: 12, paddingVertical: 13, alignItems: 'center', marginTop: 16 },
  aspectModalCloseText: { color: '#1a1405', fontWeight: '800', fontSize: 15 },
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
  // Selo de origem. Cor diferente por leitura: dourado = o mapa dela (fixo),
  // ciano = o ceu de hoje (passa). A mesma dupla de cores que a roda usa nos
  // dois aneis, para o modal confirmar visualmente de onde veio o toque.
  selo: {
    fontSize: 11, textTransform: 'uppercase',
    letterSpacing: 1.4,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },
  seloNatal: { color: '#FFD700' },
  seloTransito: { color: '#67E8F9' },
  avisoOrigem: {
    color: '#8d94a8',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 10,
    fontStyle: 'italic',
  },
  irParaLista: {
    marginTop: 14,
    paddingVertical: 11,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2f6f78',
    backgroundColor: 'rgba(103,232,249,0.08)',
    alignItems: 'center',
  },
  irParaListaTexto: { color: '#67E8F9', fontSize: 14.5, fontWeight: '700' },
  blocoModal: { marginTop: 16, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#2a3142' },
  blocoRotulo: { color: '#8d94a8', fontSize: 11.5, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 },
  planetaDoBloco: { marginBottom: 12 },
  planetaDoBlocoTitulo: { color: '#EDEBF7', fontSize: 15.5, fontWeight: '700', marginBottom: 3 },
  planetaDoBlocoTexto: { color: '#c9cde0', fontSize: 14.5, lineHeight: 21 },
  blocoVazio: { color: '#8d94a8', fontSize: 14, lineHeight: 20, marginTop: 14, fontStyle: 'italic' },
  fichaTecnica: {
    color: '#8d94a8',
    fontSize: 14, lineHeight: 20,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#2a3142',
  },
  planetaLinha: { flexDirection: 'row', alignItems: 'baseline', gap: 8, marginTop: 6 },
  planetaRotulo: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.4, minWidth: 104 },
  planetaValor: { color: '#e2e6f0', fontSize: 15.5, flexShrink: 1 },
  aspectGridHint: {
    color: '#8d94a8',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    paddingHorizontal: 18,
    marginBottom: 8,
  },
  gridBookBtn: {
    position: 'absolute',
    right: 8,
    top: 1,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 3,
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
    fontSize: 14,
    color: '#e2e8f0',
    fontWeight: '500',
  },
  legendInfo: {
    flex: 1,
    fontSize: 14, lineHeight: 20,
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
  modalHouse: { fontSize: 14, color: '#8892a4', marginBottom: 20 },
  modalClose: {
    backgroundColor: 'rgba(255,215,0,0.12)',
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  modalCloseText: { color: '#FFD700', fontWeight: '600', fontSize: 14 },
})
