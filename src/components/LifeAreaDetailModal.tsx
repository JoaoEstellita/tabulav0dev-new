import React from 'react'
import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StyleSheet
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import type { LifeArea } from '../services/prokerala/TransitService'
import type { RealAstrologyData } from '../services/astrology/RealAstrologyEngine'
import TransitInsightCard from './TransitInsightCard'
import { mergeAreaTransits } from '../utils/transitsByArea'

const { width, height } = Dimensions.get('window')

// Sistema de cores e icones por area de vida (mantendo identidade original)
const AREA_ICONS: Record<string, string> = {
  amor: 'heart',
  carreira: 'briefcase',
  financas: 'cash',
  saude: 'fitness',
  familia: 'people',
  espiritualidade: 'flower',
  comunicacao: 'chatbubble',
  transformacao: 'refresh',
  love: 'heart',
  career: 'briefcase',
  health: 'fitness',
  family: 'people',
  spirituality: 'flower',
  finances: 'cash',
  communication: 'chatbubble',
  transformation: 'refresh',
}

const AREA_COLORS: Record<string, string[]> = {
  amor: ['#FF6B9D', '#FF8E8E'],
  carreira: ['#4ECDC4', '#44A08D'],
  financas: ['#FFD93D', '#FF9F40'],
  saude: ['#96E6A1', '#7BC142'],
  familia: ['#FF8A65', '#FFAB91'],
  espiritualidade: ['#B19CD9', '#8B5CF6'],
  comunicacao: ['#60A5FA', '#3B82F6'],
  transformacao: ['#F472B6', '#EC4899'],
  love: ['#FF6B9D', '#FF8E8E'],
  career: ['#4ECDC4', '#44A08D'],
  health: ['#96E6A1', '#7BC142'],
  family: ['#FF8A65', '#FFAB91'],
  spirituality: ['#B19CD9', '#8B5CF6'],
  finances: ['#FFD93D', '#FF9F40'],
  communication: ['#60A5FA', '#3B82F6'],
  transformation: ['#F472B6', '#EC4899'],
}

const DESIGN_SYSTEM = {
  colors: {
    white: '#FFFFFF',
    primary: '#B45309',
    secondary: '#475569',
    positive: '#22C55E',
    negative: '#EF4444',
    neutral: '#D97706',
    warning: '#F97316',
    info: '#38BDF8',
    border: 'rgba(255,255,255,0.12)',
    light: 'rgba(255,255,255,0.08)'
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16
  },
  shadows: {
    card: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 6,
      elevation: 3
    }
  }
}

// Sistema completo de traducoes para o modal
const TRANSLATIONS = {
  // Planetas
    planets: {
    Sun: "Sol",
    Moon: "Lua",
    Mercury: "Mercúrio",
    Venus: "Vênus",
    Mars: "Marte",
    Jupiter: "Júpiter",
    Saturn: "Saturno",
    Uranus: "Urano",
    Neptune: "Netuno",
    Pluto: "Plutão",
    Asc: "Ascendente",
    MC: "Meio do Céu",
  },
  // Aspectos
    aspects: {
    conjunction: "conjunção",
    opposition: "oposição",
    square: "quadratura",
    trine: "trígono",
    sextile: "sextil",
    quincunx: "quincúncio",
    semisextile: "semissextil",
    semisquare: "semiquadratura",
    sesquiquadrate: "sesquiquadratura",
  },
  // Prioridades
  priorities: {
    high: 'Alta',
    medium: 'Média',
    low: 'Baixa',
  },
  // Casas astrologicas
  houses: {
    1: 'Identidade',
    2: 'Recursos',
    3: 'Comunicação',
    4: 'Lar',
    5: 'Criatividade',
    6: 'Trabalho',
    7: 'Parcerias',
    8: 'Transformação',
    9: 'Expansão',
    10: 'Carreira',
    11: 'Amizades',
    12: 'Espiritual',
  },
  // Duracoes
  durations: {
    curto: 'Curto',
    medio: 'Médio',
    longo: 'Longo',
  },
}

// Funcao auxiliar de traducao
const translate = (category: keyof typeof TRANSLATIONS, key: string): string => {
  const translations = TRANSLATIONS[category] as Record<string, string>
  return translations[key] || key
}

const safeNumber = (value: unknown, fallback = 0): number =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback

const safeFixed = (value: unknown, digits = 1): string =>
  safeNumber(value).toFixed(digits)

const safeArray = <T,>(value: T[] | null | undefined): T[] =>
  Array.isArray(value) ? value : []

const normalizeMetric01 = (value: unknown): number | null => {
  if (typeof value !== 'number' || !Number.isFinite(value)) return null
  if (value <= 1) return Math.max(0, Math.min(1, value))
  return Math.max(0, Math.min(1, value / 100))
}

const getSignalLevel = (value01: number | null): string | null => {
  if (value01 === null) return null
  if (value01 >= 0.7) return 'Alto'
  if (value01 >= 0.45) return 'Médio'
  return 'Baixo'
}

const getVolatilityLevel = (value01: number | null): string | null => {
  if (value01 === null) return null
  if (value01 >= 0.65) return 'Alta'
  if (value01 >= 0.35) return 'Média'
  return 'Baixa'
}

const formatRelativeDay = (iso?: string | null): string | null => {
  if (!iso) return null
  const date = new Date(iso)
  if (!Number.isFinite(date.getTime())) return null
  const now = new Date()
  const diffDays = Math.round((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return 'hoje'
  if (diffDays === 1) return 'amanha'
  if (diffDays === -1) return 'ontem'
  if (diffDays > 1) return `em ${diffDays} dias`
  return `ha ${Math.abs(diffDays)} dias`
}

const getTimingLabel = (transit: BackendTransit): string | null => {
  if (!transit?.phase) return null
  const startLabel = formatRelativeDay(transit.startAt)
  const peakLabel = formatRelativeDay(transit.peakAt)
  const endLabel = formatRelativeDay(transit.endAt)
  if (transit.phase === 'peak') return peakLabel ? `Pico ${peakLabel}` : 'Pico'
  if (transit.phase === 'start') return startLabel ? `Inicio ${startLabel}` : 'Inicio'
  if (transit.phase === 'end') return endLabel ? `Termina ${endLabel}` : 'Fim'
  return transit.phaseLabel ? transit.phaseLabel : null
}

const normalizeAspectKey = (value: string): string => {
  const normalized = String(value || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
  if (!normalized) return ''
  if (normalized.includes('trigono') || normalized.includes('trine')) return 'trigono'
  if (normalized.includes('sesquiquadr')) return 'sesquiquadratura'
  if (normalized.includes('semiquadr')) return 'semiquadratura'
  if (normalized.includes('semissext') || normalized.includes('semisext')) return 'semissextil'
  if (normalized.includes('sext')) return 'sextil'
  if (normalized.includes('quadr')) return 'quadratura'
  if (normalized.includes('opos')) return 'oposicao'
  if (normalized.includes('quinc')) return 'quincuncio'
  if (normalized.includes('conj')) return 'conjuncao'
  if (normalized.includes('harmon')) return 'harmonic'
  if (normalized.includes('tense') || normalized.includes('desafi')) return 'tense'
  if (normalized.includes('neutral') || normalized.includes('neutro')) return 'neutral'
  return normalized
}

const getAspectLabel = (type: string): string => {
  const normalized = normalizeAspectKey(type)
  if (normalized === 'harmonic') return 'harmônico'
  if (normalized === 'tense') return 'desafiador'
  if (normalized === 'neutral') return 'neutro'
  if (!normalized) return ''
  const translated = translate('aspects', normalized)
  return translated === normalized ? '' : translated
}

const getTransitDuration = (transit: RealTransitData): string => {
  // Velocidades medias dos planetas (graus por dia)
  const planetSpeeds: Record<string, number> = {
    Sun: 0.9856,      // Sol: ~1 grau por dia
    Moon: 13.176,     // Lua: ~13 graus por dia
    Mercury: 1.2,     // Mercúrio: ~1.2 graus por dia
    Venus: 1.18,      // Vênus: ~1.18 graus por dia
    Mars: 0.524,      // Marte: ~0.5 graus por dia
    Jupiter: 0.083,   // Júpiter: ~0.08 graus por dia
    Saturn: 0.033,    // Saturno: ~0.03 graus por dia
    Uranus: 0.011,    // Urano: ~0.01 graus por dia
    Neptune: 0.006,   // Netuno: ~0.006 graus por dia
    Pluto: 0.004      // Plutão: ~0.004 graus por dia
  }

  const speed = planetSpeeds[transit.transitPlanet] || 1.0
  const orb = transit.orb

  // Calcular tempo para sair do orbe (aproximacao)
  // Considerando que o planeta precisa "sair" do orbe maximo
  const maxOrb = getMaxOrbForAspect(transit.type)
  const timeToExit = (maxOrb - orb) / speed

  if (timeToExit <= 1) {
    return 'Menos de 1 dia'
  } else if (timeToExit <= 7) {
    return `${Math.round(timeToExit)} dias`
  } else if (timeToExit <= 30) {
    return `${Math.round(timeToExit / 7)} semanas`
  } else {
    return `${Math.round(timeToExit / 30)} meses`
  }
}

const getMaxOrbForAspect = (aspectType: string): number => {
  const maxOrbs: Record<string, number> = {
    conjunction: 8,
    opposition: 8,
    square: 6,
    trine: 6,
    sextile: 4,
    quincunx: 3,
    semisextile: 3,
    semisquare: 2,
    sesquiquadrate: 2,
    conjuncao: 8,
    oposicao: 8,
    quadratura: 6,
    trigono: 6,
    sextil: 4,
    quincuncio: 3,
    semissextil: 3,
    semiquadratura: 2,
    sesquiquadratura: 2,
  }
  const normalized = (aspectType || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  return maxOrbs[aspectType] || maxOrbs[normalized] || 5
}

interface LifeAreaDetailModalProps {
  visible: boolean
  onClose: () => void
  areaData: LifeArea | null
  astrologyData?: RealAstrologyData | null
  astrologyDataFallback?: RealAstrologyData | null
}

//  INTERFACES PARA DADOS REAIS
interface RealTransitData {
  transitPlanet: string
  natalPlanet: string
  type: string
  orb: number
  isApplying: boolean
  strength: number
  natalHouseImpacted: number
  durationClass?: 'curto' | 'medio' | 'longo'
  phase?: string
  window?: { start?: string; exact?: string; end?: string; days?: number }
  seriesId?: string
  contactPhase?: 'direct' | 'retro'
  isMaster?: boolean
  contactIndex?: 1 | 2 | 3
}

interface RealSuggestionData {
  transitId: string
  suggestion: string
  action: string
  influencePeriod: string
  priority: 'alta' | 'media' | 'baixa'
  basedOn: string
}

type BackendTransit = {
  id?: string
  transitPlanet?: string
  target?: {
    natalPlanet?: string
    angle?: string
    house?: number
  }
  aspectName?: string
  aspectType?: string
  orb?: number | null
  applying?: boolean
  impact?: number
  startAt?: string | null
  peakAt?: string | null
  endAt?: string | null
  phase?: string
  phaseLabel?: string
}

type BackendSuggestion = {
  id?: string
  title?: string
  text?: string
  basedOnId?: string
  action?: string
  templateKey?: string
  influencePeriod?: string
  confidence?: number
  statusLink?: {
    area?: string
    expectedImpact?: string
    scoreEffectHint?: string
  }
  card?: {
    headline?: string
    summary?: string
    bestUse?: string
    timingHint?: string
  }
  deep?: {
    opening?: string
    astrologicalWhy?: string
    centralTension?: string
    practicalGuidance?: string[]
    reflectionPrompt?: string
    integrationNote?: string
  }
  provenance?: Array<{
    sourceTitle?: string
    author?: string
    year?: string | number
    url?: string
    evidenceNote?: string
  }>
}

interface RealCalculationData {
  formula: string
  breakdown: Array<{
    step: string
    value: number
    description: string
  }>
  total: number
  validation: string
  astrologicalBasis: string
  planetDetails?: Array<{
    planet: string
    signScore: number
    houseScore: number
    conditions: { modifier: number; tags: string[] }
    aspects: Array<{
      with: string
      type: string
      orb: number
      isApplying: boolean
      baseScore: number
      beneficMaleficDelta: number
      finalScore: number
    }>
    total: number
  }>
}

//  NOVAS INTERFACES PARA BREAKDOWN DETALHADO
interface PlanetBreakdown {
  planet: string
  dignityScore: number
  dignityReason: string
  houseScore: number
  houseReason: string
  natalAspects: Array<{
    with: string
    type: string
    orb: number
    score: number
    description: string
  }>
  accidentalConditions: Array<{
    condition: string
    score: number
    description: string
  }>
  totalScore: number
  percentageOfTotal: number
  //  NOVO: Breakdown detalhado com multiplicadores
  detailedBreakdown: {
    baseScore: number
    multipliers: Array<{
      name: string
      value: number
      description: string
      impact: string
    }>
    finalScore: number
    calculationSteps: string[]
  }
}

interface NatalAspectData {
  planet1: string
  planet2: string
  type: string
  orb: number
  score: number
  description: string
  isHarmonious: boolean
  isChallenging: boolean
  isNeutral: boolean
}

export const LifeAreaDetailModal: React.FC<LifeAreaDetailModalProps> = ({
  visible,
  onClose,
  areaData,
  astrologyData,
  astrologyDataFallback
}) => {
  if (!areaData) return null

  const [showTechnical, setShowTechnical] = React.useState(false)
  const [detailView, setDetailView] = React.useState<{
    title: string
    directText: string
    fullText: string
    actionText: string | null
    metaText: string | null
    statusText: string
    statusColor: string
    timingLabel: string | null
  } | null>(null)

  //  OBTER CORES E aÂCONES ESPECaÂFICOS DA aÂREA
  const areaColors = AREA_COLORS[areaData.name] || ['#4B5563', '#6B7280']
  const areaIcon = AREA_ICONS[areaData.name] || 'help-circle'
  const headerGradient = [areaColors[0], areaColors[1]]

  //  DADOS REAIS DO ENGINE ASTROLaâ€œGICO
  const mapTransitToReal = (transit: any): RealTransitData => ({
      transitPlanet: transit.transitPlanet,
      natalPlanet: transit.natalPlanet,
      type: transit.type,
      orb: safeNumber(transit.orb),
      isApplying: !!transit.isApplying,
      strength: safeNumber(transit.strength, safeNumber(transit.impact)),
      natalHouseImpacted: safeNumber(transit.natalHouseImpacted),
      durationClass: transit.durationClass,
      phase: transit.phase,
      window: transit.window,
    })

  const getActiveTransits = (): RealTransitData[] => {
    const mergedAreaTransits = mergeAreaTransits(
      areaData.name,
      astrologyData as any,
      astrologyDataFallback as any
    )
    return mergedAreaTransits.map(mapTransitToReal).sort((a, b) => b.strength - a.strength)
  }

  const getNatalAspects = (): NatalAspectData[] => {
    const debugData = astrologyData?.debug?.lifeAreas?.[areaData.name]
    if (!debugData?.planetDetails) return []

    const results: NatalAspectData[] = []
    
    // Buscar aspectos entre planetas que afetam esta area
    debugData.planetDetails.forEach(planet => {
      const planetAspects = Array.isArray(planet.aspects) ? planet.aspects : []
      planetAspects.forEach(aspect => {
        //  CORRECAO: Classificacao baseada no TIPO, nao no score
        const isHarmonious = ['trigono', 'sextil'].includes(aspect.type)
        const isChallenging = ['quadratura', 'oposicao', 'quincuncio', 'semiquadratura', 'sesquiquadratura'].includes(aspect.type)
        const isNeutral = aspect.type === 'conjuncao'
        
        results.push({
          planet1: planet.planet,
          planet2: aspect.with,
          type: aspect.type,
          orb: aspect.orb,
          score: aspect.finalScore,
          description: `${planet.planet} em ${aspect.type} com ${aspect.with}`,
          isHarmonious,
          isChallenging,
          isNeutral
        })
      })
    })

    return results.sort((a, b) => b.score - a.score)
  }

  const getDetailedPlanetBreakdown = (): PlanetBreakdown[] => {
    const debugData = astrologyData?.debug?.lifeAreas?.[areaData.name]
    if (!debugData?.planetDetails) return []

    const totalScore = debugData.finalScore || areaData.status
    
    return debugData.planetDetails.map(planet => {
      const planetTotal = planet.total || 0
      const percentageOfTotal = totalScore > 0 ? (planetTotal / totalScore) * 100 : 0
      const aspects = safeArray(planet.aspects)

      //  CALCULAR BREAKDOWN DETALHADO COM MULTIPLICADORES
      const breakdownDetails = calculateDetailedBreakdown(planet, debugData.planetDetails, aspects)

      return {
        planet: planet.planet,
        dignityScore: planet.signScore || 0,
        dignityReason: getDignityReason(planet.planet, planet.signScore || 0),
        houseScore: planet.houseScore || 0,
        houseReason: getHouseReason(planet.houseScore || 0),
        natalAspects: aspects.map(aspect => ({
          with: aspect.with,
          type: aspect.type,
          orb: aspect.orb,
          score: aspect.finalScore || 0,
          description: `${planet.planet} em ${aspect.type} com ${aspect.with}`
        })),
        accidentalConditions: getAccidentalConditions(planet.planet, planet.conditions),
        totalScore: planetTotal,
        percentageOfTotal: Math.round(percentageOfTotal),
        //  NOVO: Breakdown detalhado com multiplicadores
        detailedBreakdown: breakdownDetails
      }
    }).sort((a, b) => b.totalScore - a.totalScore)
  }

  //  FUNCOES AUXILIARES PARA EXPLICACOES
  const getDignityReason = (planet: string, score: number): string => {
    if (score >= 45) return 'Domicilio (+28) + Exaltacao (+24)'
    if (score >= 28) return 'Domicilio (+28)'
    if (score >= 24) return 'Exaltacao (+24)'
    if (score >= 15) return 'Termo (+15)'
    if (score >= 10) return 'Face (+10)'
    if (score >= 5) return 'Peregrino (+5)'
    return 'Detrimento/Fall (0)'
  }

  const getHouseReason = (score: number): string => {
    if (score >= 15) return 'Casa Angular (+15)'
    if (score >= 10) return 'Casa Succedente (+10)'
    if (score >= 5) return 'Casa Cadente (+5)'
    return 'Sem influência da casa (0)'
  }

  const getAccidentalConditions = (planet: string, conditions?: { modifier: number; tags: string[] }): Array<{ condition: string; score: number; description: string }> => {
    if (!conditions) return []
    
    const conditionsList: Array<{ condition: string; score: number; description: string }> = []
    
    if (conditions.modifier !== 0) {
      conditionsList.push({
        condition: 'Modificador',
        score: conditions.modifier,
        description: `Condições acidentais de ${planet}`
      })
    }

    const tags = Array.isArray(conditions.tags) ? conditions.tags : []
    tags.forEach(tag => {
      conditionsList.push({
        condition: tag,
        score: 2,
        description: `Tag: ${tag}`
      })
    })

    return conditionsList
  }

  //  FUNCOES AUXILIARES PARA CALCULOS ASTROLOGICOS
  const getRelevantHousesForArea = (areaName: string): number[] => {
    const areaConfig: Record<string, number[]> = {
      amor: [5, 7],
      carreira: [10, 6],
      financas: [2, 8],
      saude: [1, 6],
      familia: [4, 10],
      espiritualidade: [9, 12],
      comunicacao: [3, 9],
      transformacao: [8, 12]
    }
    return areaConfig[areaName] || []
  }

  const getHouseAngularMultiplier = (house: number): number => {
    const angular = [1, 4, 7, 10]
    const succedent = [2, 5, 8, 11]
    const cadent = [3, 6, 9, 12]
    if (angular.includes(house)) return 1.05
    if (succedent.includes(house)) return 0.9
    if (cadent.includes(house)) return 0.8
    return 1.0
  }

  const getReceptionMultiplier = (transit: any, natal: any): number => {
    if (!transit || !natal) return 1.0
    // Simplificado para demonstracao
    return 1.0
  }

  const getPatternMultiplier = (planet: any, allPlanets: any[]): number => {
    // Simplificado para demonstracao
    return 1.0
  }

  const getClusterMultiplier = (planet: any, allPlanets: any[]): number => {
    // Simplificado para demonstracao
    return 1.0
  }

  const getPlanetDurationWeight = (transitName: string, natalName: string): number => {
    const slow: Record<string, number> = { Jupiter:1.1, Saturn:1.2, Uranus:1.25, Neptune:1.25, Pluto:1.25 }
    const fast: Record<string, number> = { Moon:0.85, Mercury:0.9 }
    let w = 1.0
    if (slow[transitName]) w *= slow[transitName]
    if (fast[transitName]) w *= fast[transitName]
    return w
  }

  const calculateBeneficMaleficDelta = (planet: any): number => {
    // Simplificado para demonstracao
    return 0
  }

  //  NOVA FUNCAO: CALCULAR BREAKDOWN DETALHADO COM MULTIPLICADORES
  const calculateDetailedBreakdown = (planet: any, allPlanets: any[], aspects: any[]) => {
    const baseScore = (planet.signScore || 0) + (planet.houseScore || 0)
    const multipliers: Array<{ name: string; value: number; description: string; impact: string }> = []
    const calculationSteps: string[] = []
    
    //  MULTIPLICADOR 1: Peso do Planeta (importancia astrologica)
    const planetWeights: Record<string, number> = {
      'Sun': 1.2, 'Moon': 1.2,        // Luminares (maxima importancia)
      'Mercury': 1.0, 'Venus': 1.0, 'Mars': 1.0,  // Pessoais
      'Jupiter': 1.1, 'Saturn': 1.1,              // Sociais
      'Uranus': 0.9, 'Neptune': 0.9, 'Pluto': 0.9 // Transpessoais
    }
    const planetWeight = planetWeights[planet.planet] || 1.0
    if (planetWeight !== 1.0) {
      multipliers.push({
        name: 'Peso do Planeta',
        value: planetWeight,
        description: `${planet.planet} tem peso ${planetWeight > 1 ? 'elevado' : 'reduzido'} na astrologia`,
        impact: planetWeight > 1 ? 'Aumenta' : 'Reduz'
      })
      calculationSteps.push(`Peso do planeta: ${planetWeight}`)
    }

    //  MULTIPLICADOR 2: Relevancia da Casa
    const relevantHouses = getRelevantHousesForArea(areaData.name)
    const transitInRelevantHouse = relevantHouses.includes(planet.house || 0)
    const relevantHouseBoost = transitInRelevantHouse ? 1.10 : 1.0
    if (relevantHouseBoost > 1.0) {
      multipliers.push({
        name: 'Casa Relevante',
        value: relevantHouseBoost,
        description: `Trânsito na casa ${planet.house} (relevante para ${areaData.name})`,
        impact: 'Aumenta'
      })
      calculationSteps.push(`Casa relevante: x ${relevantHouseBoost}`)
    }

    //  MULTIPLICADOR 3: Regência de Casa
    const houseRulers: Record<number, string[]> = {
      1:['Mars'], 2:['Venus'], 3:['Mercury'], 4:['Moon'], 5:['Sun'], 6:['Mercury'], 
      7:['Venus'], 8:['Mars'], 9:['Jupiter'], 10:['Saturn'], 11:['Saturn','Uranus'], 12:['Jupiter','Neptune']
    }
    const areaRulers = new Set(relevantHouses.flatMap((h: number) => houseRulers[h] || []))
    const rulerBoost = areaRulers.has(planet.planet) ? 1.06 : 1.0
    if (rulerBoost > 1.0) {
      multipliers.push({
        name: 'Regência de Casa',
        value: rulerBoost,
        description: `${planet.planet} rege uma das casas da área ${areaData.name}`,
        impact: 'Aumenta'
      })
      calculationSteps.push(`Regência de casa: x ${rulerBoost}`)
    }

    //  MULTIPLICADOR 4: Angularidade da Casa
    const angularMult = getHouseAngularMultiplier(planet.house || 0)
    if (angularMult !== 1.0) {
      multipliers.push({
        name: 'Angularidade da Casa',
        value: angularMult,
        description: `Casa ${planet.house} e ${angularMult > 1 ? 'angular' : angularMult < 1 ? 'cadente' : 'succedente'}`,
        impact: angularMult > 1 ? 'Aumenta' : 'Reduz'
      })
      calculationSteps.push(`Angularidade: x ${angularMult}`)
    }

    //  MULTIPLICADOR 5: Recepção Mutua
    const receptionMult = getReceptionMultiplier(planet, allPlanets.find(p => p.planet === planet.planet))
    if (receptionMult !== 1.0) {
      multipliers.push({
        name: 'Recepção Mutua',
        value: receptionMult,
        description: receptionMult > 1 ? 'Planetas em dignidades mutuas' : 'Planetas em detrimentos mutuos',
        impact: receptionMult > 1 ? 'Aumenta' : 'Reduz'
      })
      calculationSteps.push(`Recepção: x ${receptionMult}`)
    }

    //  MULTIPLICADOR 6: Padrões Aspectuais
    const patternMult = getPatternMultiplier(planet, allPlanets)
    if (patternMult > 1.0) {
      multipliers.push({
        name: 'Padrões Aspectuais',
        value: patternMult,
        description: 'T-Square, Grande Trigono ou Yod detectado',
        impact: 'Aumenta'
      })
      calculationSteps.push(`Padrões: x ${patternMult}`)
    }

    //  MULTIPLICADOR 7: Cluster de Aspectos
    const clusterMult = getClusterMultiplier(planet, allPlanets)
    if (clusterMult > 1.0) {
      multipliers.push({
        name: 'Cluster de Aspectos',
        value: clusterMult,
        description: 'Múltiplos aspectos com o mesmo planeta natal',
        impact: 'Aumenta'
      })
      calculationSteps.push(`Cluster: x ${clusterMult}`)
    }

    //  MULTIPLICADOR 8: Peso por Duração
    const durationWeight = getPlanetDurationWeight(planet.planet, aspects[0]?.with || '')
    if (durationWeight !== 1.0) {
      multipliers.push({
        name: 'Peso por Duração',
        value: durationWeight,
        description: durationWeight > 1 ? 'Planeta lento (maior influência)' : 'Planeta rápido (menor influência)',
        impact: durationWeight > 1 ? 'Aumenta' : 'Reduz'
      })
      calculationSteps.push(`Duração: x ${durationWeight}`)
    }

    //  CALCULAR SCORE FINAL
    let finalScore = baseScore
    calculationSteps.push(`Score base: ${baseScore}`)
    
    multipliers.forEach(mult => {
      finalScore *= mult.value
      calculationSteps.push(`${mult.name}: ${finalScore.toFixed(2)}`)
    })

    //  ADICIONAR DELTAS DE BENEFICOS/MALEFICOS
    const beneficMaleficDelta = calculateBeneficMaleficDelta(planet)
    if (beneficMaleficDelta !== 0) {
      finalScore += beneficMaleficDelta
      calculationSteps.push(`Delta benéfico/maléfico: ${finalScore.toFixed(2)}`)
    }

    return {
      baseScore,
      multipliers,
      finalScore: Math.round(finalScore * 100) / 100,
      calculationSteps
    }
  }

  const getRealSuggestions = (): RealSuggestionData[] => {
    const transits = activeTransits
    const aspects = natalAspects
    
    const suggestions: RealSuggestionData[] = []

    // Sugestões baseadas em trânsitos ativos
    transits.forEach((transit) => {
      //  CORRECAO: Classificacao mais abrangente
      const isHarmonious = ['trigono', 'sextil'].includes(transit.type)
      const isChallenging = ['quadratura', 'oposicao', 'quincuncio', 'semiquadratura', 'sesquiquadratura'].includes(transit.type)
      const isNeutral = transit.type === 'conjuncao'

      let suggestion = ''
      let action = ''
      let priority: 'alta' | 'media' | 'baixa' = 'alta'

      if (isHarmonious) {
        suggestion = 'Momento favorável para aproveitar oportunidades ligadas a esta área.'
        action = 'Iniciar projetos, expandir relacionamentos'
      } else if (isChallenging) {
        suggestion = 'Período de ajustes e atenção, com aprendizados importantes.'
        action = 'Revisar planos, buscar equilíbrio'
      } else if (isNeutral) {
        suggestion = 'Fase de integração e observação das mudanças.'
        action = 'Refletir, planejar, integrar'
      }

      const influencePeriod = transit.durationClass === 'longo' ? 'Meses' : 
                             transit.durationClass === 'medio' ? 'Semanas' : 'Dias'

      suggestions.push({
        transitId: `transit-${transit.transitPlanet}-${transit.natalPlanet}-${transit.type}`,
        suggestion,
        action,
        influencePeriod,
        priority,
        basedOn: `Trânsito: ${transit.type} ${transit.transitPlanet} com ${transit.natalPlanet}`
      })
    })

    // Sugestões baseadas em aspectos natais
    aspects.forEach((aspect, index) => {
      //  CORRECAO: Sugestões baseadas na natureza real do aspecto
      const suggestion = aspect.isHarmonious 
        ? `Aproveite a harmonia do trânsito entre ${aspect.planet1} e ${aspect.planet2}`
        : aspect.isChallenging
        ? `Gerencie a tensão do trânsito entre ${aspect.planet1} e ${aspect.planet2}`
        : `Integre as energias do trânsito entre ${aspect.planet1} e ${aspect.planet2}`
      
      const action = aspect.isHarmonious
        ? 'Desenvolver talentos naturais, fortalecer relacionamentos'
        : aspect.isChallenging
        ? 'Trabalhar equilíbrio, transformar desafios em oportunidades'
        : 'Refletir sobre a natureza da relação entre estes planetas'

      suggestions.push({
        transitId: `natal-${aspect.planet1}-${aspect.planet2}-${aspect.type}`,
        suggestion,
        action,
        influencePeriod: 'Variável (Trânsito)',
        priority: 'media',
        basedOn: `Aspecto de Trânsito: ${aspect.type} ${aspect.planet1} com ${aspect.planet2}`
      })
    })

    return suggestions.sort((a, b) => {
      const priorityOrder = { alta: 3, media: 2, baixa: 1 }
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    })
  }

  const getRealCalculations = (): RealCalculationData => {
    const transits = activeTransits
    const aspects = natalAspects
    const debugData = astrologyData?.debug?.lifeAreas?.[areaData.name]

    // Formula real baseada no RealAstrologyEngine
    const formula = 'Score final = soma(Peso do Planeta x (Dignidade + Casa + Aspectos + Condições))'

    // Breakdown real se disponivel
    let breakdown: Array<{ step: string; value: number; description: string }> = []
    let total = safeNumber(areaData.status)

    if (debugData?.planetDetails) {
      breakdown = debugData.planetDetails.map(planet => ({
        step: `${planet.planet} (${planet.signScore} + ${planet.houseScore} + ${safeArray(planet.aspects).length} aspectos)`,
        value: safeNumber(planet.total),
        description: `Dignidade: ${planet.signScore}, Casa: ${planet.houseScore}, Aspectos: ${safeArray(planet.aspects).length}`
      }))
      total = safeNumber(debugData.finalScore)
    } else {
      // Fallback baseado nos trânsitos
      breakdown = transits.map(transit => {
        const strength = safeNumber(transit.strength)
        const aspectValue = strength * (transit.isApplying ? 1.15 : 0.95)
        return {
          step: `${transit.type} ${transit.transitPlanet} com ${transit.natalPlanet}`,
          value: Math.round(aspectValue),
          description: `Força: ${strength}, Orb: ${safeFixed(transit.orb)} graus, ${transit.isApplying ? 'Aplicante' : 'Separando'}`
        }
      })
    }

    const validation = 'Score calculado com base em dignidades essenciais, força das casas, aspectos planetários e condições acidentais.'
    
    const astrologicalBasis = 'A pontuação considera a tradição astrológica clássica: domicílios (+28), exaltações (+24), casas angulares (+15), aspectos harmônicos (trígonos/sextis) e desafiadores (quadraturas/oposições).'

    return {
      formula,
      breakdown,
      total: Math.round(total),
      validation,
      astrologicalBasis,
      planetDetails: debugData?.planetDetails
    }
  }

  const activeTransits = getActiveTransits()
  const backendActiveTransits: BackendTransit[] = Array.isArray((areaData as any)?.activeTransits)
    ? (areaData as any).activeTransits
    : []
  const natalAspects = getNatalAspects()
  const planetBreakdown = getDetailedPlanetBreakdown()
  const backendSuggestions: BackendSuggestion[] = Array.isArray((areaData as any)?.suggestions)
    ? (areaData as any).suggestions
    : []
  const realSuggestions = backendSuggestions.length ? [] : getRealSuggestions()
  const realCalculations = getRealCalculations()
  const confidence01 = normalizeMetric01((astrologyData as any)?.statusPersonal?.confidence)
  const volatility01 = normalizeMetric01((astrologyData as any)?.statusPersonal?.volatility)
  const signalLevel = getSignalLevel(confidence01)
  const volatilityLevel = getVolatilityLevel(volatility01)
  // Prioriza sempre a lista astrológica completa da área e adiciona itens legados ausentes.
  const transitItems = React.useMemo(() => {
    const fromBackend = backendActiveTransits.map(mapTransitToReal)
    const merged = [...activeTransits]
    const seen = new Set(
      activeTransits.map((t, i) => `${t.transitPlanet}:${t.natalPlanet}:${t.type}:${t.natalHouseImpacted}:${i}`)
    )
    fromBackend.forEach((t, i) => {
      const key = `${t.transitPlanet}:${t.natalPlanet}:${t.type}:${t.natalHouseImpacted}:${i}`
      if (seen.has(key)) return
      seen.add(key)
      merged.push(t)
    })
    return merged.sort((a, b) => b.strength - a.strength)
  }, [activeTransits, backendActiveTransits])
  const totalTransitStrength = activeTransits.reduce((sum, t) => sum + safeNumber(t.strength), 0)

  const renderHeader = () => (
    <View style={[styles.header, { backgroundColor: headerGradient[0] }]}>
      <View style={styles.headerContent}>
        <View style={styles.headerLeft}>
          <Ionicons name={areaIcon as any} size={24} color={DESIGN_SYSTEM.colors.white} />
          <Text style={styles.areaName}>{areaData.name.toUpperCase()}</Text>
          <Text style={styles.areaScore}>{safeNumber(areaData.status)}%</Text>
        </View>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={24} color={DESIGN_SYSTEM.colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  )

  const renderCalculationToggle = () => (
    <TouchableOpacity style={styles.technicalToggle} onPress={() => setShowTechnical(!showTechnical)}>
      <Text style={styles.technicalToggleText}>
        {showTechnical ? 'Ocultar detalhes do calculo' : 'Ver detalhes do calculo'}
      </Text>
      <Ionicons
        name={showTechnical ? 'chevron-up' : 'chevron-down'}
        size={16}
        color={DESIGN_SYSTEM.colors.primary}
      />
    </TouchableOpacity>
  )

  const renderMetricLevelsSection = () => {
    if (!signalLevel && !volatilityLevel) return null

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>LEITURA DO PERÍODO</Text>
        <View style={styles.metricCard}>
          {signalLevel ? (
            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>Sinal do período</Text>
              <Text style={styles.metricValue}>{signalLevel}</Text>
            </View>
          ) : null}
          {volatilityLevel ? (
            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>Volatilidade</Text>
              <Text style={styles.metricValue}>{volatilityLevel}</Text>
            </View>
          ) : null}
          <Text style={styles.metricHint}>
            Esses níveis ajudam a interpretar consistência e variação do momento, sem alterar a porcentagem final da área.
          </Text>
        </View>
      </View>
    )
  }

  const getTransitKey = (transit: any, index: number) => (
    transit?.id ||
    [
      transit?.transitPlanet || 'na',
      transit?.natalPlanet || transit?.target?.natalPlanet || transit?.target?.angle || transit?.target?.house || 'na',
      transit?.aspectName || transit?.type || 'na',
      String(index),
    ].join(':')
  )

  const getSuggestionForTransit = (transit: any) => {
    if (backendSuggestions.length && transit?.id) {
      return backendSuggestions.find((item: any) => item?.basedOnId === transit.id) || null
    }
    if (!backendSuggestions.length) {
      const fallbackKey = `transit-${transit?.transitPlanet}-${transit?.natalPlanet}-${transit?.type}`
      return realSuggestions.find((item: any) => item?.transitId === fallbackKey) || null
    }
    return null
  }

  const buildTransitTitle = (transit: any) => {
    const transitPlanet = translate('planets', transit?.transitPlanet || 'Trânsito')
    const rawAspect = String(transit?.aspectName || transit?.type || '').trim()
    const aspect = rawAspect ? getAspectLabel(rawAspect) : ''
    const houseTarget =
      transit?.target?.house ||
      transit?.natalHouseImpacted ||
      transit?.house ||
      transit?.natalHouse ||
      null
    const rawTarget =
      transit?.natalPlanet ||
      transit?.target?.natalPlanet ||
      transit?.target?.angle ||
      (houseTarget ? `Casa ${houseTarget}` : '')
    const target = rawTarget ? translate('planets', String(rawTarget)) : ''

    if (aspect && target) return `${transitPlanet} em ${aspect} com ${target}`
    if (aspect && houseTarget) return `${transitPlanet} em ${aspect} na Casa ${houseTarget}`
    if (houseTarget) return `${transitPlanet} em trânsito na Casa ${houseTarget}`
    if (aspect) return `${transitPlanet} em ${aspect}`
    if (target) return `${transitPlanet} com ${target}`
    return `${transitPlanet} em trânsito nesta área`
  }

  const getTransitHouseLabel = (transit: any): string | null => {
    const houseValue =
      transit?.target?.house ||
      transit?.natalHouseImpacted ||
      transit?.house ||
      transit?.natalHouse ||
      null
    const numericHouse = Number(houseValue)
    if (!Number.isFinite(numericHouse)) return null
    if (numericHouse < 1 || numericHouse > 12) return null
    return String(Math.round(numericHouse))
  }

  const getTransitHousePrefix = (transit: any): string => {
    const natalHouse = Number(transit?.natalHouseImpacted ?? transit?.natalHouse)
    if (Number.isFinite(natalHouse) && natalHouse >= 1 && natalHouse <= 12) return 'Casa natal ativada'
    return 'Casa de trânsito'
  }

  const getPhaseLabel = (transit: any) => {
    const phase = String(transit?.phase || '').toLowerCase()
    if (phase === 'peak') return 'Em pico'
    if (phase === 'start') return 'Em aproximação'
    if (phase === 'end') return 'Afastando'
    if (transit?.isApplying === true) return 'Em aproximação'
    if (transit?.isApplying === false) return 'Afastando'
    return 'Em andamento'
  }

  const getDurationLabel = (transit: any) => {
    const windowDays = safeNumber(transit?.window?.days, 0)
    if (windowDays > 0) return `${windowDays} dias`
    const startAt = transit?.startAt || transit?.window?.start
    const endAt = transit?.endAt || transit?.window?.end
    if (startAt && endAt) {
      const start = new Date(startAt).getTime()
      const end = new Date(endAt).getTime()
      if (Number.isFinite(start) && Number.isFinite(end) && end >= start) {
        const days = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)))
        return `${days} dias`
      }
    }
    if (transit?.durationClass === 'curto') return 'curto prazo'
    if (transit?.durationClass === 'medio') return 'médio prazo'
    if (transit?.durationClass === 'longo') return 'longo prazo'
    return null
  }

  const buildDirectText = (transit: any, suggestion: any) => {
    const directFromDatasetRaw =
      suggestion?.card?.summary ||
      suggestion?.text ||
      suggestion?.suggestion ||
      suggestion?.deep?.opening
    if (directFromDatasetRaw) {
      const firstSentence = String(directFromDatasetRaw).split('. ')[0] || String(directFromDatasetRaw)
      const sanitized = firstSentence
        .replace(/\s+/g, ' ')
        .replace(/^Leitura completa:\s*/i, '')
        .trim()
      const normalized = sanitized.toLowerCase()
      const isGeneric =
        normalized.includes('fase de integracao e calibragem') ||
        normalized.includes('momento de observacao') ||
        normalized.includes('traz uma fase')
      if (sanitized.length >= 28 && !isGeneric) return sanitized
    }
    const aspectType = normalizeAspectKey(String(transit?.aspectName || transit?.type || ''))
    const transitPlanet = translate('planets', transit?.transitPlanet)
    const phase = String(transit?.phase || '').toLowerCase()
    const houseLabel = getTransitHouseLabel(transit)
    const houseHint = houseLabel ? ` em casa ${houseLabel}` : ''
    const tone =
      ['trigono', 'sextil', 'harmonic'].includes(aspectType)
        ? phase === 'peak'
          ? 'ativa janela forte de progresso'
          : phase === 'end'
          ? 'pede consolidacao de ganhos'
          : 'favorece progresso com fluidez e consistencia'
        : ['quadratura', 'oposicao', 'quincuncio', 'semiquadratura', 'sesquiquadratura', 'tense'].includes(aspectType)
        ? phase === 'peak'
          ? 'entra em fase sensivel e exige ajuste fino'
          : phase === 'end'
          ? 'pede fechamento de ajustes com disciplina'
          : 'pede ajuste de rota com menos pressa e mais estrategia'
        : 'traz fase de observacao e calibragem'
    const areaHint = typeof areaData?.name === 'string' ? String(areaData.name).toLowerCase() : 'esta area'
    return `${transitPlanet}${houseHint}: ${tone} em ${areaHint}.`
  }

  const buildFullInterpretationText = (transit: any, suggestion: any, directText: string) => {
    if (!suggestion) {
      const aspectType = String(transit?.aspectName || transit?.type || '')
      const normalizedAspectType = normalizeAspectKey(aspectType)
      const target =
        transit?.natalPlanet ||
        transit?.target?.natalPlanet ||
        transit?.target?.angle ||
        (transit?.target?.house ? `Casa ${transit.target.house}` : 'seu mapa')
      const aspectLabel = getAspectLabel(normalizedAspectType) || 'aspecto'
      return [
        `Leitura completa: ${translate('planets', transit?.transitPlanet)} em ${aspectLabel} com ${translate('planets', target)}.`,
        directText,
        'Use esta influência como contexto para priorizar uma decisão prática e revisar seu ritmo antes de ampliar movimentos.',
      ].join('\n\n')
    }

    const segments: string[] = []
    if (suggestion?.deep?.opening) segments.push(suggestion.deep.opening)
    if (suggestion?.deep?.astrologicalWhy) segments.push(suggestion.deep.astrologicalWhy)
    if (suggestion?.deep?.centralTension) segments.push(`Tensão central: ${suggestion.deep.centralTension}`)

    const guidance = Array.isArray(suggestion?.deep?.practicalGuidance)
      ? suggestion.deep.practicalGuidance.filter(Boolean).slice(0, 4)
      : []
    if (guidance.length) {
      segments.push(`Orientação prática:\n- ${guidance.join('\n- ')}`)
    }

    if (suggestion?.deep?.reflectionPrompt) segments.push(`Pergunta-chave: ${suggestion.deep.reflectionPrompt}`)
    if (suggestion?.deep?.integrationNote) segments.push(suggestion.deep.integrationNote)
    if (suggestion?.statusLink?.scoreEffectHint) segments.push(`Conexão com score: ${suggestion.statusLink.scoreEffectHint}`)
    if (suggestion?.card?.bestUse) segments.push(`Melhor uso: ${suggestion.card.bestUse}`)
    if (suggestion?.card?.timingHint) segments.push(`Timing: ${suggestion.card.timingHint}`)

    if (!segments.length) {
      segments.push(directText)
    }
    return segments.join('\n\n')
  }

  const renderTransitList = (items: any[], startIndex = 0, featured = false) =>
    items.map((transit: any, index: number) => {
      const absoluteIndex = startIndex + index
          const aspectType = String(transit.aspectName || transit.type || '')
          const isHarmonious = ['trigono', 'sextil', 'harmonic'].includes(aspectType)
          const isChallenging = ['quadratura', 'oposicao', 'quincuncio', 'semiquadratura', 'sesquiquadratura', 'tense'].includes(aspectType)
          const isNeutral = aspectType === 'conjuncao' || aspectType === 'neutral'
          const statusColor = isHarmonious
            ? DESIGN_SYSTEM.colors.positive
            : isChallenging
            ? DESIGN_SYSTEM.colors.negative
            : isNeutral
            ? DESIGN_SYSTEM.colors.neutral
            : DESIGN_SYSTEM.colors.secondary
          const statusText = isHarmonious ? 'Harmônico' : isChallenging ? 'Desafiador' : 'Neutro'
          const phaseLabel = getPhaseLabel(transit)
          const durationLabel = getDurationLabel(transit)
          const relativeTiming = getTimingLabel(transit)
          const timingLabel = [phaseLabel, durationLabel, relativeTiming].filter(Boolean).join(' • ')
          const transitTitle = buildTransitTitle(transit)
          const houseLabel = getTransitHouseLabel(transit)
          const houseLabelPrefix = getTransitHousePrefix(transit)
          const transitKey = getTransitKey(transit, absoluteIndex)
          const suggestion = getSuggestionForTransit(transit)
          const directText = buildDirectText(transit, suggestion)
          const titleText = suggestion?.title || suggestion?.card?.headline || 'Leitura completa'
          const actionText =
            suggestion?.action ||
            (Array.isArray(suggestion?.deep?.practicalGuidance) ? suggestion.deep.practicalGuidance[0] : null)
          const confidenceText =
            typeof suggestion?.confidence === 'number'
              ? `Confiabilidade editorial ${Math.round(Math.max(0, Math.min(1, suggestion.confidence)) * 100)}%`
              : null
          const sourceCount = Array.isArray(suggestion?.provenance) ? suggestion.provenance.length : 0
          const sourceText = sourceCount > 0 ? `Fontes mapeadas: ${sourceCount}` : null
          const orbText = Number.isFinite(transit?.orb) ? `Orb ${safeFixed(transit.orb)}°` : null
          const impactText = Number.isFinite(transit?.impact) ? `Impacto ${safeFixed(transit.impact, 2)}` : null
          const metaLine = [orbText, impactText, confidenceText, sourceText].filter(Boolean).join(' • ')
          const impactValue01 = (() => {
            const impactAbs = Math.abs(safeNumber(transit?.impact, 0))
            if (impactAbs > 0) return Math.max(0.08, Math.min(1, impactAbs / 1.5))
            const orb = Math.abs(safeNumber(transit?.orb, 2.5))
            return Math.max(0.08, Math.min(1, (3 - Math.min(3, orb)) / 3))
          })()

          return (
            <TransitInsightCard
              key={transitKey}
              indexLabel={`#${absoluteIndex + 1}`}
              statusLabel={statusText}
              statusColor={statusColor}
              title={transitTitle}
              houseLabel={houseLabel}
              houseLabelPrefix={houseLabelPrefix}
              timingLabel={timingLabel}
              impactValue01={impactValue01}
              directText={directText}
              fullExpanded={false}
              onToggleFull={() => {}}
              onOpenDetailModal={() =>
                setDetailView({
                  title: transitTitle,
                  directText,
                  fullText: buildFullInterpretationText(transit, suggestion, directText),
                  actionText: actionText || null,
                  metaText: metaLine || null,
                  statusText,
                  statusColor,
                  timingLabel: timingLabel || null,
                })
              }
              detailMode="modal"
              fullTitle={titleText}
              fullText=""
              actionText={actionText}
              metaText={metaLine}
              variant="light"
              featured={featured}
            />
          )
    })

  const getTransitPriorityScore = (transit: any) => {
    const aspectType = normalizeAspectKey(String(transit?.aspectName || transit?.type || ''))
    let score = 12
    if (['quadratura', 'oposicao', 'quincuncio', 'semiquadratura', 'sesquiquadratura', 'tense'].includes(aspectType)) score += 18
    if (['trigono', 'sextil', 'harmonic'].includes(aspectType)) score += 10
    const impactAbs = Math.abs(safeNumber(transit?.impact, 0))
    score += impactAbs * 10
    const orbAbs = Math.abs(safeNumber(transit?.orb, 3))
    score += Math.max(0, 3 - Math.min(3, orbAbs)) * 4
    const phase = String(transit?.phase || '').toLowerCase()
    if (phase === 'peak') score += 10
    else if (phase === 'start') score += 6
    else if (phase === 'end') score += 3
    return score
  }

  const renderTransitsSection = () => {
    const orderedTransits = [...transitItems].sort((a, b) => getTransitPriorityScore(b) - getTransitPriorityScore(a))

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>TRÂNSITOS ATIVOS</Text>

        {transitItems.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Nenhum trânsito ativo para esta área no momento</Text>
          </View>
        ) : (
          <>
            <View style={styles.subsectionHeader}>
              <Text style={styles.subsectionLabel}>Lista de trânsitos</Text>
              <Text style={styles.subsectionMeta}>{orderedTransits.length} trânsitos na área</Text>
            </View>
            {renderTransitList(orderedTransits, 0, false)}
          </>
        )}
      </View>
    )
  }

  const renderSuggestionsSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>SUGESTÕES POR TRÂNSITO</Text>

      {(backendSuggestions.length === 0 && realSuggestions.length === 0) ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Nenhuma sugestão disponível no momento</Text>
        </View>
      ) : (
        (backendSuggestions.length ? backendSuggestions : realSuggestions).map((suggestion: any, index: number) => {
          const transit = transitItems.find((item: any) => item.id === suggestion.basedOnId) || null
          const aspect = !backendSuggestions.length
            ? natalAspects.find(
                (item) => `natal-${item.planet1}-${item.planet2}-${item.type}` === suggestion.transitId
              )
            : null

          const sourceType = transit ? (transit.aspectName || transit.type) : aspect?.type
          const isHarmonious = sourceType ? ['trigono', 'sextil', 'harmonic'].includes(sourceType) : false
          const isChallenging = sourceType ? ['quadratura', 'oposicao', 'quincuncio', 'semiquadratura', 'sesquiquadratura', 'tense'].includes(sourceType) : false
          const isNeutral = sourceType === 'conjuncao' || sourceType === 'neutral'

          let statusColor = DESIGN_SYSTEM.colors.secondary
          let statusText = 'Neutro'
          if (isHarmonious) {
            statusColor = DESIGN_SYSTEM.colors.positive
            statusText = 'Harmônico'
          } else if (isChallenging) {
            statusColor = DESIGN_SYSTEM.colors.negative
            statusText = 'Desafiador'
          } else if (isNeutral) {
            statusColor = DESIGN_SYSTEM.colors.neutral
          }

          let transitTitle = 'Trânsito'
          let transitMeta = ''
          if (transit) {
            const houseName = TRANSLATIONS.houses[transit.natalHouseImpacted as keyof typeof TRANSLATIONS.houses] || 'Casa'
            const transitTarget =
              transit.natalPlanet ||
              transit.target?.natalPlanet ||
              transit.target?.angle ||
              (transit.target?.house ? `Casa ${transit.target.house}` : '')
            transitTitle = `${translate('planets', transit.transitPlanet)} em ${translate('aspects', sourceType)} com ${translate('planets', transitTarget)}`
            transitMeta = transit.natalHouseImpacted
              ? `Casa ${transit.natalHouseImpacted} (${houseName})`
              : ''
          } else if (aspect) {
            transitTitle = `${translate('planets', aspect.planet1)} em ${translate('aspects', aspect.type)} com ${translate('planets', aspect.planet2)}`
            transitMeta = `Força ${aspect.score} • Orb ${safeFixed(aspect.orb)}°`
          }
          const timingLabel = transit ? getTimingLabel(transit) : null

          return (
            <View key={suggestion.id || suggestion.transitId} style={styles.suggestionCard}>
              <View style={styles.suggestionHeader}>
                <Text style={styles.suggestionNumber}>#{index + 1}</Text>
                <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
                  <Text style={styles.statusText}>{statusText}</Text>
                </View>
              </View>

              <Text style={styles.suggestionTransitTitle}>{transitTitle}</Text>
              {transitMeta ? <Text style={styles.suggestionTransitMeta}>{transitMeta}</Text> : null}
              {timingLabel ? <Text style={styles.suggestionTiming}>{timingLabel}</Text> : null}
              <Text style={styles.suggestionText}>{suggestion.text || suggestion.suggestion}</Text>
              {suggestion.action ? (
                <Text style={styles.suggestionMeta}>
                  Ação: {suggestion.action} • Período: {suggestion.influencePeriod}
                </Text>
              ) : null}
            </View>
          )
        })
      )}
    </View>
  )

  const renderCalculationsSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>CÁLCULOS TÉCNICOS E BASE ASTROLÓGICA</Text>
      
      <View style={styles.calculationCard}>
        <Text style={styles.breakdownTitle}>Fatores do status desta área:</Text>
        <Text style={styles.validationText}>
          Score atual: {safeNumber(areaData.status)}% • Trânsitos considerados: {transitItems.length}
        </Text>
        <Text style={styles.validationText}>
          Força total dos trânsitos: {safeFixed(totalTransitStrength, 2)}
        </Text>
        {planetBreakdown.length ? (
          <Text style={styles.validationText}>
            Planetas com maior peso: {planetBreakdown
              .slice()
              .sort((a, b) => safeNumber(b.totalScore) - safeNumber(a.totalScore))
              .slice(0, 5)
              .map((p) => `${p.planet} (${p.totalScore})`)
              .join(' • ')}
          </Text>
        ) : null}

        <Text style={styles.formulaTitle}>Fórmula de Cálculo:</Text>
        <Text style={styles.formulaText}>{realCalculations.formula}</Text>
        
        <Text style={styles.breakdownTitle}>Detalhamento matemático:</Text>
        
        {/* Breakdown em árvore por Planeta */}
        {planetBreakdown.map((planet, index) => (
          <View key={planet.planet} style={styles.planetBreakdownCard}>
            <View style={styles.planetHeader}>
              <Text style={styles.planetName}>{planet.planet}</Text>
              <Text style={styles.planetTotal}>{planet.totalScore} pts</Text>
              <Text style={styles.planetPercentage}>({planet.percentageOfTotal}%)</Text>
            </View>
            
            {/* Dignidade Essencial */}
            <View style={styles.breakdownRow}>
              <View style={styles.breakdownLabel}>
                <Text style={styles.breakdownLabelText}>Dignidade essencial:</Text>
              </View>
              <View style={styles.breakdownValue}>
                <Text style={styles.breakdownValueText}>+{planet.dignityScore}</Text>
              </View>
              <View style={styles.breakdownReason}>
                <Text style={styles.breakdownReasonText}>{planet.dignityReason}</Text>
              </View>
            </View>
            
            {/* Força da Casa */}
            <View style={styles.breakdownRow}>
              <View style={styles.breakdownLabel}>
                <Text style={styles.breakdownLabelText}>Força da casa:</Text>
              </View>
              <View style={styles.breakdownValue}>
                <Text style={styles.breakdownValueText}>+{planet.houseScore}</Text>
              </View>
              <View style={styles.breakdownReason}>
                <Text style={styles.breakdownReasonText}>{planet.houseReason}</Text>
              </View>
            </View>
            
            {/* Aspectos Natais */}
            {planet.natalAspects.length > 0 && (
              <View style={styles.aspectsSection}>
                <Text style={styles.aspectsTitle}>Aspectos de trânsito:</Text>
                {planet.natalAspects.map((aspect, aspectIndex) => {
                  //  CORRECAO: Mostrar natureza real do aspecto
                  const isHarmonious = ['trigono', 'sextil'].includes(aspect.type)
                  const isChallenging = ['quadratura', 'oposicao', 'quincuncio', 'semiquadratura', 'sesquiquadratura'].includes(aspect.type)
                  
                  let aspectIcon = '*'
                  let aspectColor = DESIGN_SYSTEM.colors.secondary
                  
                  if (isHarmonious) {
                    aspectIcon = '*'
                    aspectColor = DESIGN_SYSTEM.colors.positive
                  } else if (isChallenging) {
                    aspectColor = DESIGN_SYSTEM.colors.negative
                  }
                  
                  return (
                    <View key={aspectIndex} style={styles.aspectRow}>
                      <View style={styles.aspectLabel}>
                                                 <Text style={styles.aspectLabelText}>
                           {aspectIcon} {translate('aspects', aspect.type)} com {translate('planets', aspect.with)}:
                         </Text>
                      </View>
                      <View style={styles.aspectValue}>
                        <Text style={[styles.aspectValueText, { color: aspectColor }]}>
                          {isChallenging ? '-' : '+'}{Math.abs(aspect.score)}
                        </Text>
                      </View>
                      <View style={styles.aspectDescription}>
                        <Text style={styles.aspectDescriptionText}>
                          Orb: {safeFixed(aspect.orb)} graus - {isHarmonious ? 'Harmônico' : isChallenging ? 'Desafiador' : 'Neutro'}
                        </Text>
                      </View>
                    </View>
                  )
                })}
              </View>
            )}
            
            {/* Condições Acidentais */}
            {planet.accidentalConditions.length > 0 && (
              <View style={styles.conditionsSection}>
                <Text style={styles.conditionsTitle}>Condições acidentais:</Text>
                {planet.accidentalConditions.map((condition, conditionIndex) => (
                  <View key={conditionIndex} style={styles.conditionRow}>
                    <View style={styles.conditionLabel}>
                      <Text style={styles.conditionLabelText}>
                        {condition.condition}:
                      </Text>
                    </View>
                    <View style={styles.conditionValue}>
                      <Text style={styles.conditionValueText}>+{condition.score}</Text>
                    </View>
                    <View style={styles.conditionDescription}>
                      <Text style={styles.conditionDescriptionText}>
                        {condition.description}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
            
                         {/* Total do Planeta */}
             <View style={styles.planetTotalRow}>
               <Text style={styles.planetTotalLabel}>Total {planet.planet}:</Text>
               <Text style={styles.planetTotalValue}>{planet.totalScore} pontos</Text>
             </View>

             {/*  NOVO: BREAKDOWN DETALHADO COM MULTIPLICADORES */}
             {planet.detailedBreakdown && (
               <View style={styles.detailedBreakdownSection}>
                 <Text style={styles.detailedBreakdownTitle}>Cálculo detalhado:</Text>
                 
                 {/* Score Base */}
                 <View style={styles.breakdownRow}>
                   <View style={styles.breakdownLabel}>
                     <Text style={styles.breakdownLabelText}>Score base:</Text>
                   </View>
                   <View style={styles.breakdownValue}>
                     <Text style={styles.breakdownValueText}>+{planet.detailedBreakdown.baseScore}</Text>
                   </View>
                   <View style={styles.breakdownReason}>
                     <Text style={styles.breakdownReasonText}>
                       Dignidade ({planet.dignityScore}) + Casa ({planet.houseScore})
                     </Text>
                   </View>
                 </View>

                 {/* Multiplicadores */}
                 {planet.detailedBreakdown.multipliers.map((mult, multIndex) => (
                   <View key={multIndex} style={styles.multiplierRow}>
                     <View style={styles.multiplierLabel}>
                       <Text style={styles.multiplierLabelText}>
                         {mult.impact === 'Aumenta' ? '+' : '-'} {mult.name}:
                       </Text>
                     </View>
                     <View style={styles.multiplierValue}>
                       <Text style={[styles.multiplierValueText, { 
                         color: mult.impact === 'Aumenta' ? DESIGN_SYSTEM.colors.positive : DESIGN_SYSTEM.colors.negative 
                       }]}>
                         x {mult.value}
                       </Text>
                     </View>
                     <View style={styles.multiplierDescription}>
                       <Text style={styles.multiplierDescriptionText}>
                         {mult.description}
                       </Text>
                     </View>
                   </View>
                 ))}

                 {/* Passos do Cálculo */}
                 <View style={styles.calculationStepsSection}>
                   <Text style={styles.calculationStepsTitle}>Passos do cálculo:</Text>
                   {planet.detailedBreakdown.calculationSteps.map((step, stepIndex) => (
                     <Text key={stepIndex} style={styles.calculationStepText}>
                       {stepIndex + 1}. {step}
                     </Text>
                   ))}
                 </View>

                 {/* Score Final */}
                 <View style={styles.finalScoreRow}>
                   <Text style={styles.finalScoreLabel}> Score Final:</Text>
                   <Text style={styles.finalScoreValue}>
                     {planet.detailedBreakdown.finalScore} pontos
                   </Text>
                 </View>
               </View>
             )}
          </View>
        ))}
        
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Geral:</Text>
          <Text style={styles.totalValue}>{realCalculations.total}</Text>
        </View>
        
        <Text style={styles.validationTitle}>Validação:</Text>
        <Text style={styles.validationText}>{realCalculations.validation}</Text>
        
        <Text style={styles.basisTitle}>Base Astrológica:</Text>
        <Text style={styles.basisText}>{realCalculations.astrologicalBasis}</Text>
        
        {/*  NOTA EXPLICATIVA SOBRE SCORES */}
        <View style={styles.explanationCard}>
          <Text style={styles.explanationTitle}>Como interpretar os scores:</Text>
          <Text style={styles.explanationText}>
            - <Text style={{ color: DESIGN_SYSTEM.colors.positive }}>Scores positivos</Text> indicam influências favoráveis
          </Text>
          <Text style={styles.explanationText}>
            - <Text style={{ color: DESIGN_SYSTEM.colors.negative }}>Scores negativos</Text> indicam desafios a serem superados
          </Text>
          <Text style={styles.explanationText}>
            - <Text style={{ color: DESIGN_SYSTEM.colors.neutral }}>Scores neutros</Text> indicam influências equilibradas
          </Text>
          <Text style={styles.explanationText}>
            - A <Text style={{ fontWeight: 'bold' }}>natureza do aspecto</Text> (Harmônico/Desafiador/Neutro) é baseada no tipo astrológico, não no score numérico
          </Text>
        </View>
      </View>
      <Text style={styles.intensityText}>
        A intensidade indica o quanto este tema tende a ocupar espaco na experiencia atual. Nao define resultados.
      </Text>
    </View>
  )

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {renderHeader()}
          <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {renderTransitsSection()}
            {renderMetricLevelsSection()}
            {renderCalculationToggle()}
            {showTechnical ? renderCalculationsSection() : null}
          </ScrollView>
        </View>
      </View>

      <Modal
        visible={!!detailView}
        animationType="fade"
        transparent
        onRequestClose={() => setDetailView(null)}
      >
        <View style={styles.readingBackdrop}>
          <View style={styles.readingCard}>
            <View style={styles.readingHeader}>
              <View style={styles.readingTitleWrap}>
                <View style={[styles.readingStatusBadge, { backgroundColor: detailView?.statusColor || '#64748B' }]}>
                  <Text style={styles.readingStatusText}>{detailView?.statusText || 'Neutro'}</Text>
                </View>
                <Text style={styles.readingTitle}>{detailView?.title}</Text>
                {detailView?.timingLabel ? (
                  <Text style={styles.readingTiming}>{detailView.timingLabel}</Text>
                ) : null}
              </View>
              <TouchableOpacity onPress={() => setDetailView(null)} style={styles.readingCloseButton}>
                <Ionicons name="close" size={20} color="#0F172A" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.readingScroll} showsVerticalScrollIndicator={false}>
              <View style={styles.readingSection}>
                <Text style={styles.readingSectionLabel}>Frase-chave</Text>
                <Text style={styles.readingLead}>{detailView?.directText}</Text>
              </View>

              <View style={styles.readingSection}>
                <Text style={styles.readingSectionLabel}>Interpretação completa</Text>
                <Text style={styles.readingBody}>{detailView?.fullText}</Text>
              </View>

              {detailView?.actionText ? (
                <View style={styles.readingActionBox}>
                  <Text style={styles.readingActionLabel}>Ação sugerida</Text>
                  <Text style={styles.readingActionText}>{detailView.actionText}</Text>
                </View>
              ) : null}

              {detailView?.metaText ? (
                <Text style={styles.readingMeta}>{detailView.metaText}</Text>
              ) : null}
            </ScrollView>

            <TouchableOpacity style={styles.readingDoneButton} onPress={() => setDetailView(null)}>
              <Text style={styles.readingDoneText}>Fechar leitura</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: DESIGN_SYSTEM.colors.white,
    borderTopLeftRadius: DESIGN_SYSTEM.borderRadius.lg,
    borderTopRightRadius: DESIGN_SYSTEM.borderRadius.lg,
    maxHeight: height * 0.9,
    minHeight: height * 0.6
  },
  header: {
    height: 60,
    borderTopLeftRadius: DESIGN_SYSTEM.borderRadius.lg,
    borderTopRightRadius: DESIGN_SYSTEM.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: DESIGN_SYSTEM.spacing.md
  },
  closeButton: {
    padding: DESIGN_SYSTEM.spacing.sm,
    borderRadius: DESIGN_SYSTEM.borderRadius.sm
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DESIGN_SYSTEM.spacing.sm
  },
  areaName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: DESIGN_SYSTEM.colors.white,
    textAlign: 'center'
  },
  areaScore: {
    fontSize: 16,
    fontWeight: '600',
    color: DESIGN_SYSTEM.colors.white,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: DESIGN_SYSTEM.spacing.sm,
    paddingVertical: 4,
    borderRadius: DESIGN_SYSTEM.borderRadius.sm
  },
  scrollContent: {
    padding: DESIGN_SYSTEM.spacing.md
  },
  section: {
    marginBottom: DESIGN_SYSTEM.spacing.xl
  },
  summarySection: {
    marginBottom: DESIGN_SYSTEM.spacing.lg
  },
  directInsightBox: {
    marginTop: DESIGN_SYSTEM.spacing.sm,
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
    borderWidth: 1,
    borderRadius: DESIGN_SYSTEM.borderRadius.md,
    padding: DESIGN_SYSTEM.spacing.md,
  },
  directInsightTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#92400E',
    marginBottom: 6,
  },
  directInsightText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#78350F',
  },
  expandInterpretationButton: {
    marginTop: DESIGN_SYSTEM.spacing.sm,
    alignSelf: 'flex-start',
    backgroundColor: '#F59E0B',
    borderRadius: DESIGN_SYSTEM.borderRadius.sm,
    paddingHorizontal: DESIGN_SYSTEM.spacing.md,
    paddingVertical: 6,
  },
  expandInterpretationButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  fullInterpretationBox: {
    marginTop: DESIGN_SYSTEM.spacing.sm,
    backgroundColor: '#F8FAFC',
    borderColor: '#CBD5E1',
    borderWidth: 1,
    borderRadius: DESIGN_SYSTEM.borderRadius.md,
    padding: DESIGN_SYSTEM.spacing.md,
  },
  fullInterpretationTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },
  fullInterpretationBody: {
    fontSize: 14,
    lineHeight: 21,
    color: '#1E293B',
  },
  fullInterpretationMeta: {
    marginTop: 6,
    fontSize: 12,
    color: '#334155',
  },
  metricCard: {
    backgroundColor: '#FFF7ED',
    borderRadius: DESIGN_SYSTEM.borderRadius.md,
    borderWidth: 1,
    borderColor: '#FED7AA',
    padding: DESIGN_SYSTEM.spacing.md,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  metricLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7C2D12',
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#9A3412',
  },
  metricHint: {
    marginTop: DESIGN_SYSTEM.spacing.sm,
    fontSize: 12,
    lineHeight: 18,
    color: '#92400E',
  },
  summaryBlock: {
    padding: DESIGN_SYSTEM.spacing.md
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: DESIGN_SYSTEM.colors.primary,
    marginBottom: DESIGN_SYSTEM.spacing.sm
  },
  summaryText: {
    fontSize: 14,
    color: DESIGN_SYSTEM.colors.secondary,
    marginBottom: DESIGN_SYSTEM.spacing.sm,
    lineHeight: 20
  },
  intensityText: {
    fontSize: 12,
    color: DESIGN_SYSTEM.colors.secondary,
    lineHeight: 18
  },
  highlightsBlock: {
    marginTop: DESIGN_SYSTEM.spacing.sm,
    padding: DESIGN_SYSTEM.spacing.md,
    backgroundColor: DESIGN_SYSTEM.colors.light,
    borderRadius: DESIGN_SYSTEM.borderRadius.md
  },
  highlightsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: DESIGN_SYSTEM.colors.primary,
    marginBottom: DESIGN_SYSTEM.spacing.sm
  },
  highlightItem: {
    marginBottom: DESIGN_SYSTEM.spacing.sm
  },
  highlightHeadline: {
    fontSize: 13,
    fontWeight: '600',
    color: DESIGN_SYSTEM.colors.primary,
    marginBottom: DESIGN_SYSTEM.spacing.xs
  },
  highlightSummary: {
    fontSize: 12,
    color: DESIGN_SYSTEM.colors.secondary,
    lineHeight: 18
  },
  technicalToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: DESIGN_SYSTEM.spacing.xs,
    paddingVertical: DESIGN_SYSTEM.spacing.sm,
    marginBottom: DESIGN_SYSTEM.spacing.lg,
    borderRadius: DESIGN_SYSTEM.borderRadius.sm,
    backgroundColor: DESIGN_SYSTEM.colors.light
  },
  technicalToggleText: {
    fontSize: 13,
    fontWeight: '600',
    color: DESIGN_SYSTEM.colors.primary
  },
  subsection: {
    marginBottom: DESIGN_SYSTEM.spacing.lg,
    padding: DESIGN_SYSTEM.spacing.md,
    backgroundColor: DESIGN_SYSTEM.colors.light,
    borderRadius: DESIGN_SYSTEM.borderRadius.md
  },
  subsectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: DESIGN_SYSTEM.colors.primary,
    marginBottom: DESIGN_SYSTEM.spacing.md,
    textAlign: 'center'
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: DESIGN_SYSTEM.colors.primary,
    marginBottom: DESIGN_SYSTEM.spacing.sm,
    textAlign: 'center',
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
    padding: DESIGN_SYSTEM.spacing.sm,
    borderRadius: DESIGN_SYSTEM.borderRadius.sm,
  },
  subsectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: DESIGN_SYSTEM.spacing.sm,
    marginBottom: DESIGN_SYSTEM.spacing.sm,
    paddingHorizontal: 2,
  },
  subsectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  subsectionMeta: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  emptyState: {
    padding: DESIGN_SYSTEM.spacing.lg,
    alignItems: 'center',
    backgroundColor: DESIGN_SYSTEM.colors.light,
    borderRadius: DESIGN_SYSTEM.borderRadius.md
  },
  emptyText: {
    color: DESIGN_SYSTEM.colors.secondary,
    textAlign: 'center',
    fontSize: 14
  },
  transitCard: {
    backgroundColor: DESIGN_SYSTEM.colors.white,
    padding: DESIGN_SYSTEM.spacing.sm,
    borderRadius: DESIGN_SYSTEM.borderRadius.md,
    marginBottom: DESIGN_SYSTEM.spacing.sm,
    ...DESIGN_SYSTEM.shadows.card
  },
  transitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: DESIGN_SYSTEM.spacing.sm
  },
  transitNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: DESIGN_SYSTEM.colors.primary,
    backgroundColor: DESIGN_SYSTEM.colors.light,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: DESIGN_SYSTEM.borderRadius.sm
  },
  statusBadge: {
    paddingHorizontal: DESIGN_SYSTEM.spacing.sm,
    paddingVertical: 4,
    borderRadius: DESIGN_SYSTEM.borderRadius.sm
  },
  statusText: {
    color: DESIGN_SYSTEM.colors.white,
    fontSize: 12,
    fontWeight: 'bold'
  },
  transitName: {
    fontSize: 14,
    fontWeight: '600',
    color: DESIGN_SYSTEM.colors.primary,
    marginBottom: DESIGN_SYSTEM.spacing.xs
  },
  transitDetails: {
    gap: DESIGN_SYSTEM.spacing.sm
  },
  transitSummary: {
    fontSize: 12,
    color: DESIGN_SYSTEM.colors.secondary,
    lineHeight: 16
  },
  transitTiming: {
    fontSize: 12,
    color: DESIGN_SYSTEM.colors.warning,
    marginTop: DESIGN_SYSTEM.spacing.xs
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DESIGN_SYSTEM.spacing.sm
  },
  detailLabel: {
    fontSize: 14,
    color: DESIGN_SYSTEM.colors.secondary,
    minWidth: 80
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: DESIGN_SYSTEM.colors.primary,
    minWidth: 40
  },
  strengthBar: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: 'hidden'
  },
  strengthFill: {
    height: '100%',
    borderRadius: 4
  },
  suggestionCard: {
    backgroundColor: DESIGN_SYSTEM.colors.white,
    padding: DESIGN_SYSTEM.spacing.sm,
    borderRadius: DESIGN_SYSTEM.borderRadius.md,
    marginBottom: DESIGN_SYSTEM.spacing.sm,
    ...DESIGN_SYSTEM.shadows.card
  },
  suggestionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: DESIGN_SYSTEM.spacing.sm
  },
  suggestionNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: DESIGN_SYSTEM.colors.primary,
    backgroundColor: DESIGN_SYSTEM.colors.light,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: DESIGN_SYSTEM.borderRadius.sm
  },
  priorityBadge: {
    paddingHorizontal: DESIGN_SYSTEM.spacing.sm,
    paddingVertical: 4,
    borderRadius: DESIGN_SYSTEM.borderRadius.sm
  },
  priorityText: {
    color: DESIGN_SYSTEM.colors.white,
    fontSize: 12,
    fontWeight: 'bold'
  },
  suggestionText: {
    fontSize: 14,
    fontWeight: '600',
    color: DESIGN_SYSTEM.colors.primary,
    marginBottom: DESIGN_SYSTEM.spacing.sm
  },
  suggestionTransitTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: DESIGN_SYSTEM.colors.primary,
    marginBottom: DESIGN_SYSTEM.spacing.xs
  },
  suggestionTransitMeta: {
    fontSize: 12,
    color: DESIGN_SYSTEM.colors.secondary,
    marginBottom: DESIGN_SYSTEM.spacing.xs
  },
  suggestionTiming: {
    fontSize: 12,
    color: DESIGN_SYSTEM.colors.warning,
    marginBottom: DESIGN_SYSTEM.spacing.xs
  },
  suggestionMeta: {
    fontSize: 12,
    color: DESIGN_SYSTEM.colors.secondary
  },
  actionText: {
    fontSize: 14,
    color: DESIGN_SYSTEM.colors.secondary,
    marginBottom: DESIGN_SYSTEM.spacing.xs
  },
  periodText: {
    fontSize: 14,
    color: DESIGN_SYSTEM.colors.secondary,
    marginBottom: DESIGN_SYSTEM.spacing.xs
  },
  basedOnText: {
    fontSize: 12,
    color: DESIGN_SYSTEM.colors.secondary,
    fontStyle: 'italic'
  },
  calculationCard: {
    backgroundColor: DESIGN_SYSTEM.colors.white,
    padding: DESIGN_SYSTEM.spacing.md,
    borderRadius: DESIGN_SYSTEM.borderRadius.md,
    ...DESIGN_SYSTEM.shadows.card
  },
  formulaTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: DESIGN_SYSTEM.colors.primary,
    marginBottom: DESIGN_SYSTEM.spacing.sm
  },
  formulaText: {
    fontSize: 14,
    color: DESIGN_SYSTEM.colors.secondary,
    marginBottom: DESIGN_SYSTEM.spacing.md,
    fontFamily: 'monospace',
    backgroundColor: DESIGN_SYSTEM.colors.light,
    padding: DESIGN_SYSTEM.spacing.sm,
    borderRadius: DESIGN_SYSTEM.borderRadius.sm
  },
  breakdownTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: DESIGN_SYSTEM.colors.primary,
    marginBottom: DESIGN_SYSTEM.spacing.sm
  },
  breakdownStep: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: DESIGN_SYSTEM.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: DESIGN_SYSTEM.colors.border
  },
  stepName: {
    flex: 2,
    fontSize: 14,
    color: DESIGN_SYSTEM.colors.primary
  },
  stepValue: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: DESIGN_SYSTEM.colors.primary,
    textAlign: 'center'
  },
  stepDescription: {
    flex: 3,
    fontSize: 12,
    color: DESIGN_SYSTEM.colors.secondary
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: DESIGN_SYSTEM.spacing.md,
    borderTopWidth: 2,
    borderTopColor: DESIGN_SYSTEM.colors.primary,
    marginTop: DESIGN_SYSTEM.spacing.md
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: DESIGN_SYSTEM.colors.primary
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: DESIGN_SYSTEM.colors.primary
  },
  validationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: DESIGN_SYSTEM.colors.primary,
    marginTop: DESIGN_SYSTEM.spacing.md,
    marginBottom: DESIGN_SYSTEM.spacing.sm
  },
  validationText: {
    fontSize: 14,
    color: DESIGN_SYSTEM.colors.secondary,
    marginBottom: DESIGN_SYSTEM.spacing.md
  },
  basisTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: DESIGN_SYSTEM.colors.primary,
    marginBottom: DESIGN_SYSTEM.spacing.sm
  },
  basisText: {
    fontSize: 14,
    color: DESIGN_SYSTEM.colors.secondary,
    lineHeight: 20
  },

  //  ESTILOS PARA BREAKDOWN DETALHADO EM aÂRVORE
  planetBreakdownCard: {
    backgroundColor: DESIGN_SYSTEM.colors.white,
    padding: DESIGN_SYSTEM.spacing.md,
    borderRadius: DESIGN_SYSTEM.borderRadius.md,
    marginBottom: DESIGN_SYSTEM.spacing.md,
    borderWidth: 1,
    borderColor: DESIGN_SYSTEM.colors.border,
    ...DESIGN_SYSTEM.shadows.card
  },
  planetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: DESIGN_SYSTEM.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: DESIGN_SYSTEM.colors.border,
    marginBottom: DESIGN_SYSTEM.spacing.md
  },
  planetName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: DESIGN_SYSTEM.colors.primary
  },
  planetTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: DESIGN_SYSTEM.colors.positive
  },
  planetPercentage: {
    fontSize: 14,
    color: DESIGN_SYSTEM.colors.secondary
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: DESIGN_SYSTEM.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: DESIGN_SYSTEM.colors.light
  },
  breakdownLabel: {
    flex: 2,
    paddingRight: DESIGN_SYSTEM.spacing.sm
  },
  breakdownLabelText: {
    fontSize: 14,
    fontWeight: '600',
    color: DESIGN_SYSTEM.colors.primary
  },
  breakdownValue: {
    flex: 1,
    alignItems: 'center'
  },
  breakdownValueText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: DESIGN_SYSTEM.colors.positive
  },
  breakdownReason: {
    flex: 3,
    paddingLeft: DESIGN_SYSTEM.spacing.sm
  },
  breakdownReasonText: {
    fontSize: 12,
    color: DESIGN_SYSTEM.colors.secondary
  },
  aspectsSection: {
    marginTop: DESIGN_SYSTEM.spacing.sm,
    paddingTop: DESIGN_SYSTEM.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: DESIGN_SYSTEM.colors.light
  },
  aspectsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: DESIGN_SYSTEM.colors.primary,
    marginBottom: DESIGN_SYSTEM.spacing.sm
  },
  aspectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: DESIGN_SYSTEM.spacing.xs,
    paddingLeft: DESIGN_SYSTEM.spacing.md
  },
  aspectLabel: {
    flex: 2,
    paddingRight: DESIGN_SYSTEM.spacing.sm
  },
  aspectLabelText: {
    fontSize: 12,
    color: DESIGN_SYSTEM.colors.primary
  },
  aspectValue: {
    flex: 1,
    alignItems: 'center'
  },
  aspectValueText: {
    fontSize: 12,
    fontWeight: '600',
    color: DESIGN_SYSTEM.colors.positive
  },
  aspectDescription: {
    flex: 2,
    paddingLeft: DESIGN_SYSTEM.spacing.sm
  },
  aspectDescriptionText: {
    fontSize: 11,
    color: DESIGN_SYSTEM.colors.secondary
  },
  conditionsSection: {
    marginTop: DESIGN_SYSTEM.spacing.sm,
    paddingTop: DESIGN_SYSTEM.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: DESIGN_SYSTEM.colors.light
  },
  conditionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: DESIGN_SYSTEM.colors.primary,
    marginBottom: DESIGN_SYSTEM.spacing.sm
  },
  conditionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: DESIGN_SYSTEM.spacing.xs,
    paddingLeft: DESIGN_SYSTEM.spacing.md
  },
  conditionLabel: {
    flex: 2,
    paddingRight: DESIGN_SYSTEM.spacing.sm
  },
  conditionLabelText: {
    fontSize: 12,
    color: DESIGN_SYSTEM.colors.primary
  },
  conditionValue: {
    flex: 1,
    alignItems: 'center'
  },
  conditionValueText: {
    fontSize: 12,
    fontWeight: '600',
    color: DESIGN_SYSTEM.colors.warning
  },
  conditionDescription: {
    flex: 3,
    paddingLeft: DESIGN_SYSTEM.spacing.sm
  },
  conditionDescriptionText: {
    fontSize: 11,
    color: DESIGN_SYSTEM.colors.secondary
  },
  planetTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: DESIGN_SYSTEM.spacing.md,
    marginTop: DESIGN_SYSTEM.spacing.md,
    borderTopWidth: 2,
    borderTopColor: DESIGN_SYSTEM.colors.primary
  },
  planetTotalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: DESIGN_SYSTEM.colors.primary
  },
  planetTotalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: DESIGN_SYSTEM.colors.positive
  },

  //  ESTILOS PARA NOTA EXPLICATIVA
  explanationCard: {
    backgroundColor: DESIGN_SYSTEM.colors.light,
    padding: DESIGN_SYSTEM.spacing.md,
    borderRadius: DESIGN_SYSTEM.borderRadius.md,
    marginTop: DESIGN_SYSTEM.spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: DESIGN_SYSTEM.colors.info
  },
  explanationTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: DESIGN_SYSTEM.colors.primary,
    marginBottom: DESIGN_SYSTEM.spacing.sm
  },
  explanationText: {
    fontSize: 12,
    color: DESIGN_SYSTEM.colors.secondary,
    lineHeight: 16,
    marginBottom: DESIGN_SYSTEM.spacing.xs
  },

  //  ESTILOS PARA BREAKDOWN DETALHADO COM MULTIPLICADORES
  detailedBreakdownSection: {
    marginTop: DESIGN_SYSTEM.spacing.md,
    padding: DESIGN_SYSTEM.spacing.md,
    backgroundColor: DESIGN_SYSTEM.colors.light,
    borderRadius: DESIGN_SYSTEM.borderRadius.md,
    borderWidth: 1,
    borderColor: DESIGN_SYSTEM.colors.border
  },
  detailedBreakdownTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: DESIGN_SYSTEM.colors.primary,
    marginBottom: DESIGN_SYSTEM.spacing.md,
    textAlign: 'center'
  },
  multiplierRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: DESIGN_SYSTEM.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: DESIGN_SYSTEM.colors.light
  },
  multiplierLabel: {
    flex: 2,
    paddingRight: DESIGN_SYSTEM.spacing.sm
  },
  multiplierLabelText: {
    fontSize: 13,
    fontWeight: '600',
    color: DESIGN_SYSTEM.colors.primary
  },
  multiplierValue: {
    flex: 1,
    alignItems: 'center'
  },
  multiplierValueText: {
    fontSize: 13,
    fontWeight: 'bold'
  },
  multiplierDescription: {
    flex: 3,
    paddingLeft: DESIGN_SYSTEM.spacing.sm
  },
  multiplierDescriptionText: {
    fontSize: 11,
    color: DESIGN_SYSTEM.colors.secondary,
    lineHeight: 14
  },
  calculationStepsSection: {
    marginTop: DESIGN_SYSTEM.spacing.md,
    paddingTop: DESIGN_SYSTEM.spacing.md,
    borderTopWidth: 1,
    borderTopColor: DESIGN_SYSTEM.colors.light
  },
  calculationStepsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: DESIGN_SYSTEM.colors.primary,
    marginBottom: DESIGN_SYSTEM.spacing.sm
  },
  calculationStepText: {
    fontSize: 11,
    color: DESIGN_SYSTEM.colors.secondary,
    lineHeight: 14,
    marginBottom: DESIGN_SYSTEM.spacing.xs,
    fontFamily: 'monospace'
  },
  finalScoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: DESIGN_SYSTEM.spacing.md,
    marginTop: DESIGN_SYSTEM.spacing.md,
    borderTopWidth: 2,
    borderTopColor: DESIGN_SYSTEM.colors.primary
  },
  finalScoreLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: DESIGN_SYSTEM.colors.primary
  },
  finalScoreValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: DESIGN_SYSTEM.colors.positive
  },
  readingBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(2,6,23,0.62)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 18,
  },
  readingCard: {
    width: '100%',
    maxWidth: 760,
    maxHeight: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  readingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#FFF7ED',
  },
  readingTitleWrap: {
    flex: 1,
    paddingRight: 12,
  },
  readingStatusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    marginBottom: 8,
  },
  readingStatusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  readingTitle: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '800',
    color: '#0F172A',
  },
  readingTiming: {
    marginTop: 6,
    fontSize: 12,
    color: '#B45309',
    fontWeight: '600',
  },
  readingCloseButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  readingScroll: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  readingSection: {
    marginBottom: 16,
  },
  readingSectionLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    fontWeight: '700',
    color: '#B45309',
    marginBottom: 6,
  },
  readingLead: {
    fontSize: 16,
    lineHeight: 24,
    color: '#0F172A',
    fontWeight: '600',
  },
  readingBody: {
    fontSize: 15,
    lineHeight: 24,
    color: '#1E293B',
  },
  readingActionBox: {
    borderWidth: 1,
    borderColor: '#D1FAE5',
    backgroundColor: '#ECFDF5',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
  },
  readingActionLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    fontWeight: '700',
    color: '#047857',
    marginBottom: 4,
  },
  readingActionText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#065F46',
    fontWeight: '600',
  },
  readingMeta: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 12,
  },
  readingDoneButton: {
    margin: 16,
    marginTop: 8,
    backgroundColor: '#0F172A',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  readingDoneText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  }
})





























