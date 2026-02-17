import React from 'react'
import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  StyleSheet,
  useWindowDimensions,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Ionicons } from '@expo/vector-icons'
import type { LifeArea } from '../services/prokerala/TransitService'
import type { RealAstrologyData } from '../services/astrology/RealAstrologyEngine'
import TransitInsightCard from './TransitInsightCard'
import ReadingDetailModal from './ReadingDetailModal'
import { mergeAreaTransits } from '../utils/transitsByArea'
import { buildTransitTitle as buildSharedTransitTitle } from '../utils/transitPresentation'
import { buildUnifiedTransitNarrative } from '../utils/astroInterpretation'
import { useAppLanguage } from '../hooks/useAppLanguage'
import { translatePlanet as translatePlanetLabel } from '../utils/astro/pt'
import { getPlanetImageUri, type PlanetKey } from '../config/planetImageSource'

const { height } = Dimensions.get('window')
const MODAL_FILTER_PREFS_KEY = 'life_area_modal_filter_prefs_v2'

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
    conjuncao: "conjunção",
    opposition: "oposição",
    oposicao: "oposição",
    square: "quadratura",
    quadratura: "quadratura",
    trine: "trígono",
    trigono: "trígono",
    sextile: "sextil",
    sextil: "sextil",
    quincunx: "quincúncio",
    quincuncio: "quincúncio",
    semisextile: "semissextil",
    semissextil: "semissextil",
    semisquare: "semiquadratura",
    semiquadratura: "semiquadratura",
    sesquiquadrate: "sesquiquadratura",
    sesquiquadratura: "sesquiquadratura",
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

const toIdentityToken = (value: unknown): string =>
  String(value ?? '')
    .trim()
    .toUpperCase()
    .replace(/\s+/g, '_')

const safeArray = <T,>(value: T[] | null | undefined): T[] =>
  Array.isArray(value) ? value : []

const normalizePlanetToken = (value: string): string =>
  String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()

const PLANET_IMAGE_MAP: Record<string, PlanetKey> = {
  sun: 'Sun',
  sol: 'Sun',
  moon: 'Moon',
  lua: 'Moon',
  mercury: 'Mercury',
  mercurio: 'Mercury',
  venus: 'Venus',
  mars: 'Mars',
  marte: 'Mars',
  jupiter: 'Jupiter',
  saturn: 'Saturn',
  saturno: 'Saturn',
  uranus: 'Uranus',
  urano: 'Uranus',
  neptune: 'Neptune',
  netuno: 'Neptune',
  pluto: 'Pluto',
  plutao: 'Pluto',
}

const resolvePlanetImageKey = (value: string): PlanetKey | null => {
  const token = normalizePlanetToken(value)
  return PLANET_IMAGE_MAP[token] || null
}

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

const formatCalendarDate = (iso?: string | null): string | null => {
  if (!iso) return null
  const date = new Date(iso)
  if (!Number.isFinite(date.getTime())) return null
  const nowYear = new Date().getFullYear()
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  if (date.getFullYear() === nowYear) return `${day}/${month}`
  const year2 = String(date.getFullYear()).slice(-2)
  return `${day}/${month}/${year2}`
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
  const endAt = transit?.endAt || transit?.window?.end || null
  const endDate = formatCalendarDate(endAt)
  if (endDate) return `até ${endDate}`
  if (!transit?.phase) return null
  const peakLabel = formatRelativeDay(transit.peakAt)
  if (transit.phase === 'peak') return peakLabel ? `Pico ${peakLabel}` : 'Pico'
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

const MINOR_ASPECT_KEYS = new Set([
  'quincuncio',
  'semissextil',
  'semiquadratura',
  'sesquiquadratura',
])

const isMinorAspectTransit = (transit: any): boolean => {
  const aspectKey = normalizeAspectKey(String(transit?.aspectName || transit?.type || ''))
  return MINOR_ASPECT_KEYS.has(aspectKey)
}

const isMajorAspectTransit = (transit: any): boolean => !isMinorAspectTransit(transit)

const getAspectLabel = (type: string): string => {
  const normalized = normalizeAspectKey(type)
  if (normalized === 'harmonic') return 'harmônico'
  if (normalized === 'tense') return 'desafiador'
  if (normalized === 'neutral') return 'neutro'
  if (!normalized) return ''
  const translated = translate('aspects', normalized)
  return translated || normalized
}

const getTransitToneCategory = (transit: any): 'harmonic' | 'challenging' | 'neutral' => {
  const aspectType = normalizeAspectKey(String(transit?.aspectName || transit?.type || ''))
  if (['trigono', 'sextil', 'harmonic'].includes(aspectType)) return 'harmonic'
  if (['quadratura', 'oposicao', 'quincuncio', 'semiquadratura', 'sesquiquadratura', 'tense'].includes(aspectType)) {
    return 'challenging'
  }
  return 'neutral'
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
  const maxOrb = getMaxOrbForAspect(transit.type || '')
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
  id?: string
  transitPlanet: string
  natalPlanet?: string
  target?: {
    natalPlanet?: string
    angle?: string
    house?: number
  }
  type?: string
  aspectName?: string
  aspectType?: string
  orb: number
  isApplying: boolean
  strength: number
  impact?: number
  natalHouseImpacted?: number
  transitHouse?: number
  currentHouse?: number
  durationClass?: 'curto' | 'medio' | 'longo'
  phase?: string
  phaseLabel?: string
  startAt?: string | null
  peakAt?: string | null
  endAt?: string | null
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
  window?: { start?: string; exact?: string; end?: string; days?: number }
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
  const { language } = useAppLanguage()
  const tl = React.useCallback((pt: string, en: string, es: string, it: string) => {
    if (language === 'en-US') return en
    if (language === 'es-ES') return es
    if (language === 'it-IT') return it
    return pt
  }, [language])
  const getAspectLabel = React.useCallback((type: string): string => {
    const normalized = normalizeAspectKey(type)
    if (normalized === 'harmonic') return tl('harmônico', 'harmonic', 'armonico', 'armonico')
    if (normalized === 'tense') return tl('desafiador', 'challenging', 'desafiante', 'impegnativo')
    if (normalized === 'neutral') return tl('neutro', 'neutral', 'neutro', 'neutro')
    if (normalized === 'trigono') return tl('trígono', 'trine', 'trígono', 'trigono')
    if (normalized === 'sextil') return tl('sextil', 'sextile', 'sextil', 'sestile')
    if (normalized === 'quadratura') return tl('quadratura', 'square', 'cuadratura', 'quadratura')
    if (normalized === 'oposicao') return tl('oposição', 'opposition', 'oposición', 'opposizione')
    if (normalized === 'quincuncio') return tl('quincúncio', 'quincunx', 'quincuncio', 'quinconce')
    if (normalized === 'semiquadratura') return tl('semiquadratura', 'semisquare', 'semi-cuadratura', 'semiquadratura')
    if (normalized === 'sesquiquadratura') return tl('sesquiquadratura', 'sesquiquadrate', 'sesquicuadratura', 'sesquiquadratura')
    if (normalized === 'semissextil') return tl('semissextil', 'semisextile', 'semisextil', 'semisestile')
    return String(type || '')
  }, [tl])
  const planetLabel = React.useCallback((value: unknown) => {
    return translatePlanetLabel(String(value || ''), language)
  }, [language])

  const [showTechnical, setShowTechnical] = React.useState(false)
  const [activeScoreComponent, setActiveScoreComponent] = React.useState<string | null>(null)
  const [selectedFacetFilters, setSelectedFacetFilters] = React.useState<Array<'major' | 'minor' | 'house'>>(['major'])
  const [selectedToneFilter, setSelectedToneFilter] = React.useState<'all' | 'challenging' | 'harmonic'>('all')
  const [selectedSortMode, setSelectedSortMode] = React.useState<'impact' | 'recent'>('impact')
  const [selectedPlanetFilters, setSelectedPlanetFilters] = React.useState<string[]>([])
  const [selectedHouseFilters, setSelectedHouseFilters] = React.useState<string[]>([])
  const [filterPrefsLoaded, setFilterPrefsLoaded] = React.useState(false)
  const { width: viewportWidth } = useWindowDimensions()
  const isCompactViewport = viewportWidth <= 430
  const [filtersExpanded, setFiltersExpanded] = React.useState(!isCompactViewport)
  const [detailView, setDetailView] = React.useState<{
    title: string
    directText: string
    fullText: string
    actionText: string | null
    metaText: string | null
    statusText: string
    statusColor: string
    timingLabel: string | null
    keywords: string[]
  } | null>(null)

  //  OBTER CORES E aÂCONES ESPECaÂFICOS DA aÂREA
  const areaColors = AREA_COLORS[areaData.name] || ['#4B5563', '#6B7280']
  const areaIcon = AREA_ICONS[areaData.name] || 'help-circle'
  const headerGradient = [areaColors[0], areaColors[1]]

  React.useEffect(() => {
    let cancelled = false
    const loadFilterPreferences = async () => {
      try {
        const raw = await AsyncStorage.getItem(MODAL_FILTER_PREFS_KEY)
        if (!raw || cancelled) return
        const parsed = JSON.parse(raw || '{}') as {
          facetFilters?: Array<'major' | 'minor' | 'house'>
          toneFilter?: 'all' | 'challenging' | 'harmonic'
          sortMode?: 'impact' | 'recent'
          filtersExpanded?: boolean
        }
        const nextFacetFilters = Array.isArray(parsed.facetFilters)
          ? parsed.facetFilters.filter(
              (value): value is 'major' | 'minor' | 'house' =>
                value === 'major' || value === 'minor' || value === 'house'
            )
          : []
        if (nextFacetFilters.length) {
          const normalized = Array.from(new Set(nextFacetFilters))
          setSelectedFacetFilters(normalized)
        }
        if (parsed.toneFilter === 'all' || parsed.toneFilter === 'challenging' || parsed.toneFilter === 'harmonic') {
          setSelectedToneFilter(parsed.toneFilter)
        }
        if (parsed.sortMode === 'impact' || parsed.sortMode === 'recent') {
          setSelectedSortMode(parsed.sortMode)
        }
        if (typeof parsed.filtersExpanded === 'boolean') {
          setFiltersExpanded(parsed.filtersExpanded)
        }
      } catch {
        // ignore preference parse/read failures and keep safe defaults
      } finally {
        if (!cancelled) setFilterPrefsLoaded(true)
      }
    }
    loadFilterPreferences()
    return () => {
      cancelled = true
    }
  }, [])

  React.useEffect(() => {
    if (!filterPrefsLoaded) return
    const payload = JSON.stringify({
      facetFilters: selectedFacetFilters,
      toneFilter: selectedToneFilter,
      sortMode: selectedSortMode,
      filtersExpanded,
    })
    AsyncStorage.setItem(MODAL_FILTER_PREFS_KEY, payload).catch(() => null)
  }, [filterPrefsLoaded, selectedFacetFilters, selectedToneFilter, selectedSortMode, filtersExpanded])

  React.useEffect(() => {
    if (!visible) {
      setSelectedPlanetFilters([])
      setSelectedHouseFilters([])
    }
  }, [visible])

  React.useEffect(() => {
    setActiveScoreComponent(null)
  }, [visible, areaData?.name])

  //  DADOS REAIS DO ENGINE ASTROLaâ€œGICO
  const mapTransitToReal = (transit: any): RealTransitData => {
    const rawTargetHouse = transit?.target?.house ?? transit?.natalHouseImpacted ?? transit?.natalHouse ?? null
    const numericTargetHouse =
      Number.isFinite(Number(rawTargetHouse)) && Number(rawTargetHouse) >= 1 && Number(rawTargetHouse) <= 12
        ? Number(rawTargetHouse)
        : undefined
    const target = {
      natalPlanet: transit?.target?.natalPlanet || transit?.natalPlanet || undefined,
      angle: transit?.target?.angle || undefined,
      house: numericTargetHouse,
    }

    return {
      id: transit?.id || undefined,
      transitPlanet: transit?.transitPlanet || 'Trânsito',
      natalPlanet: transit?.natalPlanet || transit?.target?.natalPlanet || transit?.target?.angle || undefined,
      target,
      type: transit?.type || transit?.aspectName || transit?.aspectType || undefined,
      aspectName: transit?.aspectName || transit?.type || undefined,
      aspectType: transit?.aspectType || transit?.type || undefined,
      orb: safeNumber(transit?.orb),
      isApplying:
        transit?.isApplying === true || transit?.applying === true
          ? true
          : transit?.isApplying === false || transit?.applying === false
          ? false
          : false,
      strength: safeNumber(transit?.strength, safeNumber(transit?.impact)),
      impact: safeNumber(transit?.impact),
      natalHouseImpacted: numericTargetHouse,
      transitHouse:
        Number.isFinite(Number(transit?.transitHouse)) && Number(transit?.transitHouse) >= 1 && Number(transit?.transitHouse) <= 12
          ? Number(transit.transitHouse)
          : undefined,
      currentHouse:
        Number.isFinite(Number(transit?.currentHouse)) && Number(transit?.currentHouse) >= 1 && Number(transit?.currentHouse) <= 12
          ? Number(transit.currentHouse)
          : undefined,
      durationClass: transit?.durationClass,
      phase: transit?.phase,
      phaseLabel: transit?.phaseLabel,
      startAt: transit?.startAt ?? transit?.window?.start ?? null,
      peakAt: transit?.peakAt ?? transit?.window?.exact ?? null,
      endAt: transit?.endAt ?? transit?.window?.end ?? null,
      window: transit?.window,
      seriesId: transit?.seriesId,
      contactPhase: transit?.contactPhase,
      isMaster: transit?.isMaster,
      contactIndex: transit?.contactIndex,
    }
  }

  const getActiveTransits = (): RealTransitData[] => {
    const mergedAreaTransits = mergeAreaTransits(
      areaData.name,
      astrologyData as any,
      astrologyDataFallback as any
    )
    const nowIso = new Date().toISOString()
    const areaKey = String(areaData?.name || '').toLowerCase()
    const relevantPlanets = new Set(getRelevantPlanetsForArea(areaKey).map((planet) => String(planet).toUpperCase()))
    const generatedHouseTransits: RealTransitData[] = []
    const seenPlanetHouse = new Set<string>()

    const appendPlanetHouseTransits = (source: any, sourceLabel: string) => {
      const planets = safeArray<any>(source?.planets)
      planets.forEach((planet) => {
        const transitPlanet = String(planet?.name || '').trim()
        if (!transitPlanet) return
        if (relevantPlanets.size > 0 && !relevantPlanets.has(transitPlanet.toUpperCase())) return
        const houseValue = Number(planet?.house)
        if (!Number.isFinite(houseValue) || houseValue < 1 || houseValue > 12) return
        const house = Math.round(houseValue)
        const planetHouseKey = `${transitPlanet.toUpperCase()}:${house}`
        if (seenPlanetHouse.has(planetHouseKey)) return
        seenPlanetHouse.add(planetHouseKey)

        const speedAbs = Math.abs(safeNumber(planet?.speed, 0))
        const statusStrength = safeNumber(planet?.planetaryStatus?.score, NaN)
        const strength =
          Number.isFinite(statusStrength) && statusStrength > 0
            ? Math.max(30, Math.min(95, statusStrength))
            : Math.max(35, Math.min(90, 55 + Math.round(speedAbs * 6)))

        generatedHouseTransits.push({
          id: `house:${areaKey}:${sourceLabel}:${transitPlanet}:${house}`,
          transitPlanet,
          target: { house },
          type: 'ingress',
          aspectName: 'ingress',
          aspectType: 'ingress',
          orb: 0,
          isApplying: false,
          strength,
          impact: Math.max(0, Math.min(100, Math.round(strength * 0.8))),
          natalHouseImpacted: house,
          transitHouse: house,
          currentHouse: house,
          phase: 'peak',
          phaseLabel: 'Ativo',
          startAt: source?.timestamp || nowIso,
          peakAt: source?.timestamp || nowIso,
          endAt: null,
        })
      })
    }

    appendPlanetHouseTransits(astrologyData as any, 'primary')
    appendPlanetHouseTransits(astrologyDataFallback as any, 'fallback')

    return mergedAreaTransits
      .map(mapTransitToReal)
      .concat(generatedHouseTransits)
      .sort((a, b) => b.strength - a.strength)
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
  const getAreaConfigForModal = (areaName: string): { houses: number[]; planets: string[] } => {
    const areaConfig: Record<string, { houses: number[]; planets: string[] }> = {
      amor: { houses: [5, 7], planets: ['Venus', 'Mars'] },
      carreira: { houses: [10, 6], planets: ['Saturn', 'Mars', 'Sun'] },
      financas: { houses: [2, 8], planets: ['Venus', 'Jupiter'] },
      saude: { houses: [1, 6], planets: ['Mars', 'Sun'] },
      familia: { houses: [4, 10], planets: ['Moon', 'Saturn'] },
      espiritualidade: { houses: [9, 12], planets: ['Neptune', 'Jupiter'] },
      comunicacao: { houses: [3, 9], planets: ['Mercury', 'Uranus'] },
      transformacao: { houses: [8, 12], planets: ['Pluto', 'Uranus'] }
    }
    return areaConfig[areaName] || { houses: [], planets: [] }
  }

  const getRelevantHousesForArea = (areaName: string): number[] => {
    return getAreaConfigForModal(areaName).houses
  }

  const getRelevantPlanetsForArea = (areaName: string): string[] => {
    return getAreaConfigForModal(areaName).planets
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
      const transitType = String(transit.type || '')
      const isHarmonious = ['trigono', 'sextil'].includes(transitType)
      const isChallenging = ['quadratura', 'oposicao', 'quincuncio', 'semiquadratura', 'sesquiquadratura'].includes(transitType)
      const isNeutral = transitType === 'conjuncao'

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
  const buildTransitIdentityKey = React.useCallback((transit: any) => {
    const targetHouse =
      transit?.target?.house ??
      transit?.natalHouseImpacted ??
      transit?.natalHouse ??
      ''
    const targetLabel =
      transit?.natalPlanet ||
      transit?.target?.natalPlanet ||
      transit?.target?.angle ||
      (targetHouse !== '' ? `HOUSE_${targetHouse}` : 'NA')

    return [
      toIdentityToken(transit?.transitPlanet || 'NA'),
      toIdentityToken(targetLabel),
      toIdentityToken(transit?.type || transit?.aspectName || 'NA'),
      safeFixed(transit?.orb ?? 0, 3),
      transit?.isApplying === true ? 'A' : transit?.isApplying === false ? 'S' : 'U',
      toIdentityToken(transit?.phase || ''),
      toIdentityToken(transit?.window?.start || transit?.startAt || ''),
    ].join('|')
  }, [])

  const transitItems = React.useMemo(() => {
    const fromBackend = backendActiveTransits.map(mapTransitToReal)
    const merged = [...activeTransits]
    const seen = new Set(activeTransits.map((t) => buildTransitIdentityKey(t)))
    fromBackend.forEach((t) => {
      const key = buildTransitIdentityKey(t)
      if (seen.has(key)) return
      seen.add(key)
      merged.push(t)
    })
    return merged.sort((a, b) => b.strength - a.strength)
  }, [activeTransits, backendActiveTransits, buildTransitIdentityKey])
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

  const renderScoreComponentsSection = () => {
    const statusMeta = (areaData as any)?.statusMeta || (areaData as any)?.status_meta || null
    const rawDrivers = Array.isArray(statusMeta?.drivers)
      ? statusMeta.drivers
      : Array.isArray((areaData as any)?.drivers)
      ? (areaData as any).drivers
      : []
    const aspectsCount = planetBreakdown.reduce((sum, planet) => sum + safeArray(planet.natalAspects).length, 0)
    const conditionsCount = planetBreakdown.reduce((sum, planet) => sum + safeArray(planet.accidentalConditions).length, 0)
    const dignityCount = planetBreakdown.filter((planet) => safeNumber(planet.dignityScore) > 0).length
    const houseCount = planetBreakdown.filter((planet) => safeNumber(planet.houseScore) > 0).length
    const transitsCount = transitItems.length
    const topDriversV2 = [...rawDrivers]
      .sort((a: any, b: any) => {
        const scoreA = Math.max(
          Math.abs(safeNumber(a?.impact, 0)),
          Math.abs(safeNumber(a?.contribution, 0)),
          Math.abs(safeNumber(a?.score, 0)),
          Math.abs(safeNumber(a?.attentionWeight, 0)),
          Math.abs(safeNumber(a?.movementWeight, 0))
        )
        const scoreB = Math.max(
          Math.abs(safeNumber(b?.impact, 0)),
          Math.abs(safeNumber(b?.contribution, 0)),
          Math.abs(safeNumber(b?.score, 0)),
          Math.abs(safeNumber(b?.attentionWeight, 0)),
          Math.abs(safeNumber(b?.movementWeight, 0))
        )
        return scoreB - scoreA
      })
      .slice(0, 5)
      .map((driver: any) => {
        const movement = safeNumber(
          driver?.movementWeight ??
            driver?.movement ??
            driver?.movementScore ??
            driver?.deltaMovement ??
            driver?.movementDelta,
          NaN
        )
        const attention = safeNumber(
          driver?.attentionWeight ??
            driver?.attention ??
            driver?.attentionScore ??
            driver?.deltaAttention ??
            driver?.attentionDelta,
          NaN
        )
        const combined = safeNumber(driver?.impact ?? driver?.contribution ?? driver?.score, NaN)
        const axisMeta: string[] = []
        if (Number.isFinite(movement)) axisMeta.push(`M ${movement >= 0 ? '+' : ''}${safeFixed(movement, 2)}`)
        if (Number.isFinite(attention)) axisMeta.push(`A ${attention >= 0 ? '+' : ''}${safeFixed(attention, 2)}`)
        if (!axisMeta.length && Number.isFinite(combined)) axisMeta.push(`W ${combined >= 0 ? '+' : ''}${safeFixed(combined, 2)}`)
        const confidence = String(driver?.confidence || driver?.confidenceLevel || driver?.confianca || '').trim()
        const driverType = String(driver?.type || driver?.kind || driver?.tipo || '').trim()
        const metaParts = [axisMeta.join(' • '), confidence, driverType].filter(Boolean)
        const tone = Number.isFinite(attention) && attention > 0
          ? 'challenging'
          : Number.isFinite(movement) && movement >= 0
          ? 'harmonic'
          : Number.isFinite(combined) && combined >= 0
          ? 'harmonic'
          : Number.isFinite(combined) && combined < 0
          ? 'challenging'
          : 'neutral'
        return {
          title: String(driver?.label || driver?.title || driver?.factorName || driver?.factorLabel || driver?.factorId || driver?.id || 'Driver'),
          meta: metaParts.join(' • '),
          value: axisMeta[0] || '',
          tone: tone as 'harmonic' | 'challenging' | 'neutral',
          icon: 'flash-outline',
        }
      })
    const topDignityPlanets = planetBreakdown
      .filter((planet) => safeNumber(planet.dignityScore) > 0)
      .sort((a, b) => safeNumber(b.dignityScore) - safeNumber(a.dignityScore))
    const topDignitySummary = topDignityPlanets
      .map((planet) => `${planetLabel(planet.planet)} (+${safeNumber(planet.dignityScore)})`)
      .join(', ')
    const topDignityReasons = topDignityPlanets
      .map((planet) => `${planetLabel(planet.planet)}: ${planet.dignityReason}`)
      .join(' | ')
    const topTransitSignals = [...transitItems]
      .sort((a, b) => Math.abs(safeNumber(b.impact, 0)) - Math.abs(safeNumber(a.impact, 0)))
      .map((transit) => {
        const tone = getTransitToneCategory(transit)
        const targetRaw =
          transit?.natalPlanet || transit?.target?.natalPlanet || transit?.target?.angle || getTransitNatalHouseLabel(transit)
        const targetLabel = targetRaw ? planetLabel(String(targetRaw)) : null
        const aspectLabel = getAspectLabel(String(transit?.aspectName || transit?.type || ''))
        const title = targetLabel
          ? `${planetLabel(transit?.transitPlanet)} ${aspectLabel} ${targetLabel}`
          : buildTransitTitle(transit, getTransitColumnKind(transit))
        return {
          title,
          meta: [getPhaseLabel(transit), getDurationLabel(transit)].filter(Boolean).join(' • '),
          value: `${Math.round(Math.abs(safeNumber(transit?.impact, 0)) * 100)}%`,
          tone,
          icon: 'pulse-outline',
        }
      })
    const topAspectSignals: Array<{
      title: string
      meta: string
      value: string
      icon: string
      tone: 'harmonic' | 'challenging' | 'neutral'
    }> = planetBreakdown
      .flatMap((planet) =>
        safeArray(planet.natalAspects).map((aspect) => ({
          planet: planet.planet,
          with: aspect.with,
          type: aspect.type,
          orb: safeNumber(aspect.orb, 0),
          score: safeNumber(aspect.score, 0),
        }))
      )
      .sort((a, b) => Math.abs(b.score) - Math.abs(a.score))
      .map((aspect) => {
        const normalized = normalizeAspectKey(aspect.type)
        return {
          title: `${planetLabel(aspect.planet)} ${getAspectLabel(aspect.type)} ${planetLabel(aspect.with)}`,
          meta: `Orb ${safeFixed(aspect.orb)}°`,
          value: `${safeFixed(aspect.score, 1)}`,
          icon: 'git-compare-outline',
          tone:
            normalized === 'trigono' || normalized === 'sextil' || normalized === 'harmonic'
              ? 'harmonic'
              : normalized === 'quadratura' ||
                normalized === 'oposicao' ||
                normalized === 'quincuncio' ||
                normalized === 'semiquadratura' ||
                normalized === 'sesquiquadratura' ||
                normalized === 'tense'
              ? 'challenging'
              : 'neutral',
        }
      })
    const topHouseSignals = [...planetBreakdown]
      .filter((planet) => safeNumber(planet.houseScore, 0) > 0)
      .sort((a, b) => safeNumber(b.houseScore, 0) - safeNumber(a.houseScore, 0))
      .map((planet) => ({
        title: planetLabel(planet.planet),
        meta: planet.houseReason,
        value: `+${safeNumber(planet.houseScore, 0)}`,
        tone: 'harmonic' as const,
        icon: 'home-outline',
      }))
    const topConditionSignals = planetBreakdown
      .flatMap((planet) =>
        safeArray(planet.accidentalConditions).map((condition) => ({
          planet: planet.planet,
          condition: condition.condition,
          score: safeNumber(condition.score, 0),
          description: condition.description,
        }))
      )
      .sort((a, b) => Math.abs(b.score) - Math.abs(a.score))
      .map((condition) => ({
        title: `${planetLabel(condition.planet)} • ${condition.condition}`,
        meta: condition.description,
        value: `${condition.score >= 0 ? '+' : ''}${safeNumber(condition.score, 0)}`,
        tone: condition.score > 0 ? ('harmonic' as const) : condition.score < 0 ? ('challenging' as const) : ('neutral' as const),
        icon: 'options-outline',
      }))

    const chips: Array<{ key: string; label: string; value: string; tone?: 'positive' | 'neutral' | 'warning'; info: string }> = [
      ...(rawDrivers.length
        ? [
            {
              key: 'driversV2',
              label: tl('Drivers V2', 'Drivers V2', 'Drivers V2', 'Driver V2'),
              value: String(rawDrivers.length),
              tone: 'positive' as const,
              info: tl(
                `${rawDrivers.length} fatores V2 ativos explicam a variação de movimento e atenção desta área.`,
                `${rawDrivers.length} active V2 factors explain this area movement and attention variation.`,
                `${rawDrivers.length} factores V2 activos explican la variación de movimiento y atención de esta área.`,
                `${rawDrivers.length} fattori V2 attivi spiegano la variazione di movimento e attenzione di quest area.`
              ),
            },
          ]
        : []),
      {
        key: 'transits',
        label: tl('Trânsitos', 'Transits', 'Tránsitos', 'Transiti'),
        value: String(transitsCount),
        tone: transitsCount > 0 ? 'positive' : 'neutral',
        info: tl(
          `${transitsCount} trânsitos entram nesta área. Eles são o gatilho dinâmico principal da leitura atual.`,
          `${transitsCount} transits enter this area. They are the main dynamic trigger of the current reading.`,
          `${transitsCount} tránsitos entran en esta área. Son el principal disparador dinámico de la lectura actual.`,
          `${transitsCount} transiti entrano in quest area. Sono il principale trigger dinamico della lettura attuale.`
        ),
      },
      {
        key: 'aspects',
        label: tl('Aspectos', 'Aspects', 'Aspectos', 'Aspetti'),
        value: String(aspectsCount),
        tone: aspectsCount > 0 ? 'positive' : 'neutral',
        info: tl(
          `${aspectsCount} aspectos ativos no cálculo. Eles podem ser harmônicos ou desafiadores e modulam o impacto dos trânsitos.`,
          `${aspectsCount} active aspects in calculation. They can be harmonic or challenging and modulate transit impact.`,
          `${aspectsCount} aspectos activos en el cálculo. Pueden ser armónicos o desafiantes y modulan el impacto de los tránsitos.`,
          `${aspectsCount} aspetti attivi nel calcolo. Possono essere armonici o impegnativi e modulano l impatto dei transiti.`
        ),
      },
      {
        key: 'dignity',
        label: tl('Dignidade', 'Dignity', 'Dignidad', 'Dignità'),
        value: String(dignityCount),
        tone: dignityCount > 0 ? 'positive' : 'neutral',
        info:
          dignityCount > 0
            ? `${dignityCount} planetas com dignidade relevante nesta área. Dignidade mede a afinidade do planeta com o signo (domicílio/exaltação fortalecem; detrimento/queda enfraquecem). Destaques: ${topDignitySummary}. Base técnica: ${topDignityReasons}.`
            : 'Nenhum planeta com dignidade essencial relevante nesta área agora. Dignidade é a afinidade do planeta com o signo (domicílio/exaltação fortalecem; detrimento/queda enfraquecem).',
      },
      {
        key: 'houses',
        label: tl('Força de casa', 'House strength', 'Fuerza de casa', 'Forza della casa'),
        value: String(houseCount),
        tone: houseCount > 0 ? 'positive' : 'neutral',
        info: tl(
          `${houseCount} fatores de força de casa ativos. Casas angulares e casas-chave da área tendem a aumentar peso no status.`,
          `${houseCount} active house-strength factors. Angular houses and area key-houses tend to increase status weight.`,
          `${houseCount} factores de fuerza de casa activos. Las casas angulares y casas clave del área tienden a aumentar el peso del estado.`,
          `${houseCount} fattori di forza della casa attivi. Le case angolari e le case chiave dell area tendono ad aumentare il peso dello stato.`
        ),
      },
      {
        key: 'conditions',
        label: tl('Condições', 'Conditions', 'Condiciones', 'Condizioni'),
        value: String(conditionsCount),
        tone: conditionsCount > 0 ? 'warning' : 'neutral',
        info: tl(
          `${conditionsCount} condições acidentais influenciam o score (fase, contexto, natureza do contato e outros ajustes do engine).`,
          `${conditionsCount} accidental conditions influence score (phase, context, contact nature and other engine adjustments).`,
          `${conditionsCount} condiciones accidentales influyen en la puntuación (fase, contexto, naturaleza del contacto y otros ajustes del motor).`,
          `${conditionsCount} condizioni accidentali influenzano il punteggio (fase, contesto, natura del contatto e altri aggiustamenti dell engine).`
        ),
      },
    ]

    if (signalLevel) {
      chips.push({
        key: 'signal',
        label: tl('Sinal', 'Signal', 'Señal', 'Segnale'),
        value: signalLevel,
        tone: signalLevel === 'Alto' ? 'positive' : 'neutral',
        info: tl(
          `Sinal ${signalLevel}: indica clareza e consistência do cenário geral da área.`,
          `Signal ${signalLevel}: indicates clarity and consistency of the area's overall scenario.`,
          `Señal ${signalLevel}: indica claridad y consistencia del escenario general del área.`,
          `Segnale ${signalLevel}: indica chiarezza e coerenza dello scenario generale dell area.`
        ),
      })
    }
    if (volatilityLevel) {
      chips.push({
        key: 'volatility',
        label: tl('Volatilidade', 'Volatility', 'Volatilidad', 'Volatilità'),
        value: volatilityLevel,
        tone: volatilityLevel === 'Alta' ? 'warning' : 'neutral',
        info: tl(
          `Volatilidade ${volatilityLevel}: indica variação do período e necessidade de ajuste de ritmo.`,
          `Volatility ${volatilityLevel}: indicates period variation and need for pace adjustment.`,
          `Volatilidad ${volatilityLevel}: indica variación del período y necesidad de ajustar el ritmo.`,
          `Volatilità ${volatilityLevel}: indica variazione del periodo e necessità di regolare il ritmo.`
        ),
      })
    }
    const scoreDrilldown: Record<
      string,
      {
        title: string
        summary: string
        metric: string
        rows: Array<{
          title: string
          meta?: string
          value?: string
          tone?: 'harmonic' | 'challenging' | 'neutral'
          icon?: string
        }>
      }
    > = {
      ...(rawDrivers.length
        ? {
            driversV2: {
              title: tl('Top Drivers V2', 'Top Drivers V2', 'Top Drivers V2', 'Top Driver V2'),
              summary: tl(
                'Fatores estruturais do motor V2 com maior peso no status desta área.',
                'Structural V2 engine factors with highest weight for this area status.',
                'Factores estructurales del motor V2 con mayor peso en el estado de esta área.',
                'Fattori strutturali del motore V2 con il peso maggiore nello stato di quest area.'
              ),
              metric: `${rawDrivers.length} ${tl('fatores', 'factors', 'factores', 'fattori')}`,
              rows: topDriversV2,
            },
          }
        : {}),
      transits: {
        title: tl('Trânsitos ativos no score', 'Active transits in score', 'Tránsitos activos en la puntuación', 'Transiti attivi nel punteggio'),
        summary: tl('Gatilhos dinâmicos que mais estão pesando agora para esta área.', 'Dynamic triggers weighing most for this area now.', 'Disparadores dinámicos que más pesan ahora en esta área.', 'Trigger dinamici che stanno pesando di più ora per quest area.'),
        metric: `${transitsCount} ${tl('ativos', 'active', 'activos', 'attivi')}`,
        rows: topTransitSignals,
      },
      aspects: {
        title: tl('Aspectos que modulam o impacto', 'Aspects that modulate impact', 'Aspectos que modulan el impacto', 'Aspetti che modulano l impatto'),
        summary: tl('Aspectos entre planetas e pontos natais que amplificam ou suavizam os trânsitos.', 'Aspects between planets and natal points that amplify or soften transits.', 'Aspectos entre planetas y puntos natales que amplifican o suavizan los tránsitos.', 'Aspetti tra pianeti e punti natali che amplificano o attenuano i transiti.'),
        metric: `${aspectsCount} ${tl('no cálculo', 'in calculation', 'en cálculo', 'nel calcolo')}`,
        rows: topAspectSignals,
      },
      dignity: {
        title: tl('Dignidade essencial por planeta', 'Essential dignity by planet', 'Dignidad esencial por planeta', 'Dignità essenziale per pianeta'),
        summary:
          tl('Mede afinidade do planeta com o signo atual (domicílio/exaltação fortalecem; detrimento/queda enfraquecem).', 'Measures planet affinity with current sign (domicile/exaltation strengthen; detriment/fall weaken).', 'Mide la afinidad del planeta con el signo actual (domicilio/exaltación fortalecen; detrimento/caída debilitan).', 'Misura l affinità del pianeta con il segno attuale (domicilio/esaltazione rafforzano; detrimento/caduta indeboliscono).'),
        metric: `${dignityCount} ${tl('relevantes', 'relevant', 'relevantes', 'rilevanti')}`,
        rows: topDignityPlanets.map((planet) => ({
          title: planetLabel(planet.planet),
          meta: planet.dignityReason,
          value: `+${safeNumber(planet.dignityScore, 0)}`,
          tone: 'harmonic',
          icon: 'sparkles-outline',
        })),
      },
      houses: {
        title: tl('Força de casa por planeta', 'House strength by planet', 'Fuerza de casa por planeta', 'Forza della casa per pianeta'),
        summary: tl('Mostra quais planetas recebem mais peso por posição em casas com impacto nesta área.', 'Shows which planets gain more weight by house position for this area.', 'Muestra qué planetas reciben más peso por posición en casas con impacto en esta área.', 'Mostra quali pianeti ricevono più peso per posizione nelle case con impatto in quest area.'),
        metric: `${houseCount} ${tl('com peso', 'weighted', 'con peso', 'con peso')}`,
        rows: topHouseSignals,
      },
      conditions: {
        title: tl('Condições acidentais ativas', 'Active accidental conditions', 'Condiciones accidentales activas', 'Condizioni accidentali attive'),
        summary: tl('Ajustes contextuais do engine (fase, natureza do contato e outros moduladores).', 'Engine contextual adjustments (phase, contact nature and other modulators).', 'Ajustes contextuales del motor (fase, naturaleza del contacto y otros moduladores).', 'Regolazioni contestuali dell engine (fase, natura del contatto e altri modulatori).'),
        metric: `${conditionsCount} ${tl('condições', 'conditions', 'condiciones', 'condizioni')}`,
        rows: topConditionSignals,
      },
      signal: {
        title: tl('Sinal do período', 'Period signal', 'Señal del período', 'Segnale del periodo'),
        summary: tl('Leitura de consistência global do cenário da área no momento atual.', 'Reading of overall consistency of this area scenario right now.', 'Lectura de consistencia global del escenario del área en este momento.', 'Lettura della coerenza complessiva dello scenario dell area nel momento attuale.'),
        metric: signalLevel || '-',
        rows: signalLevel
          ? [
              {
                title: `Sinal ${signalLevel}`,
                meta: 'Expressa clareza geral do cenário desta área no período atual.',
                icon: 'trending-up-outline',
              },
            ]
          : [],
      },
      volatility: {
        title: tl('Volatilidade do período', 'Period volatility', 'Volatilidad del período', 'Volatilità del periodo'),
        summary: tl('Ritmo de mudança do cenário da área, indicando necessidade de ajuste tático.', 'Pace of scenario change in this area, indicating tactical adjustment needs.', 'Ritmo de cambio del escenario del área, indicando necesidad de ajuste táctico.', 'Ritmo di cambiamento dello scenario dell area, indicando necessità di aggiustamento tattico.'),
        metric: volatilityLevel || '-',
        rows: volatilityLevel
          ? [
              {
                title: `Volatilidade ${volatilityLevel}`,
                meta: 'Mostra o nível de oscilação e necessidade de calibrar timing e expectativa.',
                icon: 'speedometer-outline',
              },
            ]
          : [],
      },
    }
    const activeChip = chips.find((chip) => chip.key === activeScoreComponent)
    const activeDetail = activeScoreComponent ? scoreDrilldown[activeScoreComponent] : null

    return (
      <View style={styles.section}>
        <View style={styles.scoreComponentsRow}>
          {chips.map((chip) => (
            <TouchableOpacity
              key={chip.key}
              onPress={() => setActiveScoreComponent((prev) => (prev === chip.key ? null : chip.key))}
              style={[
                styles.scoreComponentChip,
                chip.tone === 'positive' ? styles.scoreComponentChipPositive : null,
                chip.tone === 'warning' ? styles.scoreComponentChipWarning : null,
                activeScoreComponent === chip.key ? styles.scoreComponentChipActive : null,
              ]}
            >
              <Text style={styles.scoreComponentLabel}>{chip.label}</Text>
              <Text style={styles.scoreComponentValue}>{chip.value}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {activeChip && activeDetail ? (
          <View style={styles.scoreComponentInfoBox}>
            <View style={styles.scoreDetailHeader}>
              <Text style={styles.scoreDetailTitle}>{activeDetail.title}</Text>
              <View style={styles.scoreDetailMetricChip}>
                <Text style={styles.scoreDetailMetricText}>{activeDetail.metric}</Text>
              </View>
            </View>
            <Text style={styles.scoreComponentInfoText}>{activeChip.info}</Text>
            <Text style={styles.scoreDetailSummary}>{activeDetail.summary}</Text>
            {activeDetail.rows.length ? (
              <View style={styles.scoreDetailRows}>
                {activeDetail.rows.map((row, index) => (
                  <View
                    key={`${activeScoreComponent || 'detail'}-${index}-${row.title}`}
                    style={[
                      styles.scoreDetailRow,
                      row.tone === 'harmonic' ? styles.scoreDetailRowHarmonic : null,
                      row.tone === 'challenging' ? styles.scoreDetailRowChallenging : null,
                    ]}
                  >
                    {row.icon ? (
                      <View style={styles.scoreDetailRowIconWrap}>
                        <Ionicons name={row.icon as any} size={14} color="#475569" />
                      </View>
                    ) : null}
                    <View style={styles.scoreDetailRowText}>
                      <Text style={styles.scoreDetailRowTitle}>{row.title}</Text>
                      {row.meta ? <Text style={styles.scoreDetailRowMeta}>{row.meta}</Text> : null}
                    </View>
                    {row.value ? <Text style={styles.scoreDetailRowValue}>{row.value}</Text> : null}
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.scoreDetailEmpty}>Sem itens específicos para listar neste componente agora.</Text>
            )}
          </View>
        ) : null}
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

  const buildTransitTitle = (transit: any, _forcedKind?: 'planet' | 'house') => {
    const transitPlanet = planetLabel(transit?.transitPlanet || tl('Transito', 'Transit', 'Transito', 'Transito'))
    const rawAspect = String(transit?.aspectName || transit?.type || '').trim()
    const aspect = rawAspect ? getAspectLabel(rawAspect) : ''
    const houseTarget = getTransitNatalHouseLabel(transit)
    const personalHouse = houseTarget || getTransitOnNatalHouseLabel(transit)
    const rawTarget =
      transit?.natalPlanet ||
      transit?.target?.natalPlanet ||
      transit?.target?.angle ||
      (houseTarget ? `Casa ${houseTarget}` : '')
    const target = rawTarget ? planetLabel(String(rawTarget)) : ''
    let title = buildSharedTransitTitle({
      transitPlanet,
      aspectLabel: aspect,
      targetLabel: target,
      houseNumber: null,
      areaHouses: null,
    }, language)
    if (personalHouse) {
      const hasHouseToken = /(?:\bcasa\b|\bhouse\b)\s*\d+/i.test(String(title || ''))
      if (!hasHouseToken) {
        title = tl(
          `${title} • Casa ${personalHouse}`,
          `${title} • House ${personalHouse}`,
          `${title} • Casa ${personalHouse}`,
          `${title} • Casa ${personalHouse}`
        )
      }
    }
    return title
  }

  const getTransitCurrentHouseLabel = (transit: any): string | null => {
    const planets = safeArray<any>((astrologyData as any)?.planets)
    const planetCurrentHouse = planets.find((planet) => planet?.name === transit?.transitPlanet)?.house ?? null
    const houseValue =
      planetCurrentHouse ??
      transit?.transitHouse ??
      transit?.currentHouse ??
      null
    const numericHouse = Number(houseValue)
    if (!Number.isFinite(numericHouse) || numericHouse < 1 || numericHouse > 12) return null
    return String(Math.round(numericHouse))
  }

  const getTransitNatalHouseLabel = (transit: any): string | null => {
    const natalHouse = Number(transit?.natalHouseImpacted ?? transit?.natalHouse ?? transit?.target?.house ?? null)
    if (!Number.isFinite(natalHouse) || natalHouse < 1 || natalHouse > 12) return null
    return String(Math.round(natalHouse))
  }

  const getHouseFromCusps = (longitude: number, cusps?: number[] | null): string | null => {
    try {
      if (!Array.isArray(cusps) || cusps.length !== 12) return null
      const norm = (d: number) => ((d % 360) + 360) % 360
      const lon = norm(longitude)
      for (let i = 0; i < 12; i++) {
        const start = norm(Number(cusps[i]))
        const end = norm(Number(cusps[(i + 1) % 12]))
        const inHouse = start < end ? lon >= start && lon < end : lon >= start || lon < end
        if (inHouse) return String(i + 1)
      }
      return '1'
    } catch {
      return null
    }
  }

  const getTransitOnNatalHouseLabel = (transit: any): string | null => {
    const planets = safeArray<any>((astrologyData as any)?.planets)
    const planetLongitude = Number(planets.find((planet) => planet?.name === transit?.transitPlanet)?.longitude)
    if (!Number.isFinite(planetLongitude)) return null
    const natalCusps = (astrologyData as any)?.natalHouses
    return getHouseFromCusps(planetLongitude, natalCusps)
  }

  const getAreaHousesLabel = (): string | null => {
    const areaKey = String(areaData?.name || '').toLowerCase()
    const relevantAreaHouses = getRelevantHousesForArea(areaKey)
    return relevantAreaHouses.length ? relevantAreaHouses.join('/') : null
  }

  const getTransitHouseLabel = (transit: any): string | null => {
    return getTransitCurrentHouseLabel(transit) || getTransitNatalHouseLabel(transit)
  }

  const getTransitHousePrefix = (transit: any): string => {
    const currentHouse = getTransitCurrentHouseLabel(transit)
    if (currentHouse) return tl('Casa de trânsito atual', 'Current transit house', 'Casa de tránsito actual', 'Casa di transito attuale')
    const natalHouse = getTransitNatalHouseLabel(transit)
    if (natalHouse) return tl('Casa natal ativada', 'Activated natal house', 'Casa natal activada', 'Casa natale attivata')
    return tl('Casa de trânsito', 'Transit house', 'Casa de tránsito', 'Casa di transito')
  }

  const getHouseNameByNumber = (houseLabel: string | null): string => {
    if (!houseLabel) return ''
    const houseIndex = Number(houseLabel)
    if (!Number.isFinite(houseIndex) || houseIndex < 1 || houseIndex > 12) {
      return `${tl('Casa', 'House', 'Casa', 'Casa')} ${houseLabel}`
    }
    const names: Record<number, string> = {
      1: tl('Identidade', 'Identity', 'Identidad', 'Identita'),
      2: tl('Recursos', 'Resources', 'Recursos', 'Risorse'),
      3: tl('Comunicação', 'Communication', 'Comunicacion', 'Comunicazione'),
      4: tl('Lar', 'Home', 'Hogar', 'Casa'),
      5: tl('Criatividade', 'Creativity', 'Creatividad', 'Creativita'),
      6: tl('Trabalho', 'Work', 'Trabajo', 'Lavoro'),
      7: tl('Parcerias', 'Partnerships', 'Alianzas', 'Partnership'),
      8: tl('Transformação', 'Transformation', 'Transformacion', 'Trasformazione'),
      9: tl('Expansão', 'Expansion', 'Expansion', 'Espansione'),
      10: tl('Carreira', 'Career', 'Carrera', 'Carriera'),
      11: tl('Amizades', 'Friendships', 'Amistades', 'Amicizie'),
      12: tl('Espiritual', 'Spiritual', 'Espiritual', 'Spirituale'),
    }
    return names[houseIndex] || `${tl('Casa', 'House', 'Casa', 'Casa')} ${houseLabel}`
  }

  const getTimingLabelLocalized = (
    transit: BackendTransit | null,
    forcedKind?: 'planet' | 'house'
  ): string | null => {
    if (!transit) return null
    const transitKind = forcedKind || getTransitColumnKind(transit)
    const toDate = (iso?: string | null) => {
      if (!iso) return null
      const date = new Date(iso)
      return Number.isFinite(date.getTime()) ? date : null
    }
    const formatDate = (date: Date) =>
      date.toLocaleDateString(
        language === 'en-US' ? 'en-US' : language === 'es-ES' ? 'es-ES' : language === 'it-IT' ? 'it-IT' : 'pt-BR',
        { day: '2-digit', month: '2-digit' }
      )
    const now = new Date()
    const startDate = toDate(transit?.startAt || transit?.window?.start || null)
    const endDate = toDate(transit?.endAt || transit?.window?.end || null)
    if (transitKind === 'house') {
      if (startDate && endDate) {
        return tl(
          `de ${formatDate(startDate)} até ${formatDate(endDate)}`,
          `from ${formatDate(startDate)} to ${formatDate(endDate)}`,
          `de ${formatDate(startDate)} hasta ${formatDate(endDate)}`,
          `dal ${formatDate(startDate)} al ${formatDate(endDate)}`
        )
      }
      if (startDate) {
        return tl(
          `desde ${formatDate(startDate)}`,
          `since ${formatDate(startDate)}`,
          `desde ${formatDate(startDate)}`,
          `dal ${formatDate(startDate)}`
        )
      }
      if (endDate) {
        return tl(`até ${formatDate(endDate)}`, `until ${formatDate(endDate)}`, `hasta ${formatDate(endDate)}`, `fino al ${formatDate(endDate)}`)
      }
      return null
    }
    if (endDate) {
      const dateLabel = formatDate(endDate)
      return tl(`até ${dateLabel}`, `until ${dateLabel}`, `hasta ${dateLabel}`, `fino al ${dateLabel}`)
    }

    const peakDate = toDate(transit?.peakAt || transit?.window?.exact || null)
    const phase = String(transit?.phase || '').toLowerCase()
    if (phase === 'peak') {
      if (!peakDate) return tl('Pico', 'Peak', 'Pico', 'Picco')
      const diffDays = Math.round((peakDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      if (diffDays === 0) return tl('Pico hoje', 'Peak today', 'Pico hoy', 'Picco oggi')
      if (diffDays > 0) return tl(`Pico em ${diffDays}d`, `Peak in ${diffDays}d`, `Pico en ${diffDays}d`, `Picco tra ${diffDays}g`)
      return tl(`Pico há ${Math.abs(diffDays)}d`, `Peak ${Math.abs(diffDays)}d ago`, `Pico hace ${Math.abs(diffDays)}d`, `Picco ${Math.abs(diffDays)}g fa`)
    }
    return null
  }

  const getPhaseLabel = (transit: any) => {
    const getDaysUntil = (iso?: string | null): number | null => {
      if (!iso) return null
      const target = new Date(iso).getTime()
      if (!Number.isFinite(target)) return null
      const now = Date.now()
      return Math.max(0, Math.round((target - now) / (1000 * 60 * 60 * 24)))
    }
    const phase = String(transit?.phase || '').toLowerCase()
    if (phase === 'peak') return tl('Em pico', 'At peak', 'En pico', 'Al picco')
    if (phase === 'start') {
      const daysToPeak = getDaysUntil(transit?.peakAt || transit?.window?.exact || null)
      return Number.isFinite(daysToPeak)
        ? tl(`Em aproximação (${daysToPeak}d)`, `Approaching (${daysToPeak}d)`, `En aproximación (${daysToPeak}d)`, `In avvicinamento (${daysToPeak}d)`)
        : tl('Em aproximação', 'Approaching', 'En aproximación', 'In avvicinamento')
    }
    if (phase === 'end') return tl('Afastando', 'Moving away', 'Alejándose', 'In allontanamento')
    if (transit?.isApplying === true) {
      const daysToPeak = getDaysUntil(transit?.peakAt || transit?.window?.exact || null)
      return Number.isFinite(daysToPeak)
        ? tl(`Em aproximação (${daysToPeak}d)`, `Approaching (${daysToPeak}d)`, `En aproximación (${daysToPeak}d)`, `In avvicinamento (${daysToPeak}d)`)
        : tl('Em aproximação', 'Approaching', 'En aproximación', 'In avvicinamento')
    }
    if (transit?.isApplying === false) return tl('Afastando', 'Moving away', 'Alejándose', 'In allontanamento')
    return tl('Ativo', 'Active', 'Activo', 'Attivo')
  }

  const getDurationLabel = (transit: any) => {
    const windowDays = safeNumber(transit?.window?.days, 0)
    if (windowDays > 0) return `${windowDays} ${tl('dias', 'days', 'dias', 'giorni')}`
    const startAt = transit?.startAt || transit?.window?.start
    const endAt = transit?.endAt || transit?.window?.end
    if (startAt && endAt) {
      const start = new Date(startAt).getTime()
      const end = new Date(endAt).getTime()
      if (Number.isFinite(start) && Number.isFinite(end) && end >= start) {
        const days = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)))
        return `${days} ${tl('dias', 'days', 'dias', 'giorni')}`
      }
    }
    if (transit?.durationClass === 'curto') return tl('curto prazo', 'short term', 'corto plazo', 'breve termine')
    if (transit?.durationClass === 'medio') return tl('médio prazo', 'mid term', 'mediano plazo', 'medio termine')
    if (transit?.durationClass === 'longo') return tl('longo prazo', 'long term', 'largo plazo', 'lungo termine')
    return null
  }

  const renderTransitList = (
    items: Array<{ transit: any; facetKind: 'major' | 'minor' | 'house' }>,
    startIndex = 0,
    featured = false
  ) =>
    items.map(({ transit, facetKind }, index: number) => {
      const absoluteIndex = startIndex + index
      const toneCategory = getTransitToneCategory(transit)
      const isHarmonious = toneCategory === 'harmonic'
      const isChallenging = toneCategory === 'challenging'
      const isNeutral = toneCategory === 'neutral'
      const statusColor = isHarmonious
        ? DESIGN_SYSTEM.colors.positive
        : isChallenging
        ? DESIGN_SYSTEM.colors.negative
        : isNeutral
        ? DESIGN_SYSTEM.colors.neutral
        : DESIGN_SYSTEM.colors.secondary
      const statusText = isHarmonious
        ? tl('Harmônico', 'Harmonic', 'Armónico', 'Armonico')
        : isChallenging
        ? tl('Desafiador', 'Challenging', 'Desafiante', 'Impegnativo')
        : tl('Neutro', 'Neutral', 'Neutro', 'Neutro')
      const phaseLabel = getPhaseLabel(transit)
      const durationLabel = getDurationLabel(transit)
      const transitKind = getTransitColumnKind(transit)
      const relativeTiming = getTimingLabelLocalized(transit, transitKind)
      const timingLabel = [phaseLabel, durationLabel, relativeTiming].filter(Boolean).join(' • ')
      const transitTitle = buildTransitTitle(transit, transitKind)
      const houseLabel = getTransitHouseLabel(transit)
      const houseLabelPrefix = houseLabel ? getTransitHousePrefix(transit) : tl('Casa de trânsito', 'Transit house', 'Casa de tránsito', 'Casa di transito')
      const transitKey = `${getTransitKey(transit, absoluteIndex)}-${facetKind}`
      const suggestion = getSuggestionForTransit(transit)
      const unifiedNarrative = buildUnifiedTransitNarrative(
        {
          transitPlanet: transit?.transitPlanet,
          aspectName: transit?.aspectName || transit?.type || transit?.aspectType,
          natalPlanet: transit?.natalPlanet || transit?.target?.natalPlanet || transit?.target?.angle,
          target: transit?.target,
          house: transit?.target?.house ?? transit?.natalHouseImpacted ?? transit?.natalHouse,
          transitHouse: transit?.transitHouse ?? transit?.currentHouse,
          phase: transit?.phase,
          applying: transit?.isApplying ?? transit?.applying,
        },
        areaData?.name || '',
        language
      )
      const directText = unifiedNarrative.shortText
      const backendSuggestion =
        suggestion &&
        (typeof (suggestion as any)?.title === 'string' ||
          typeof (suggestion as any)?.card === 'object' ||
          typeof (suggestion as any)?.deep === 'object' ||
          Array.isArray((suggestion as any)?.provenance))
          ? (suggestion as BackendSuggestion)
          : null
      const titleText = backendSuggestion?.title || backendSuggestion?.card?.headline || tl('Leitura completa', 'Full reading', 'Lectura completa', 'Lettura completa')
      const actionText =
        suggestion?.action ||
        (Array.isArray(backendSuggestion?.deep?.practicalGuidance) ? backendSuggestion.deep.practicalGuidance[0] : null)
      const confidenceText =
        typeof backendSuggestion?.confidence === 'number'
          ? `${tl('Confiabilidade editorial', 'Editorial confidence', 'Confiabilidad editorial', 'Affidabilità editoriale')} ${Math.round(Math.max(0, Math.min(1, backendSuggestion.confidence)) * 100)}%`
          : null
      const sourceCount = Array.isArray(backendSuggestion?.provenance) ? backendSuggestion.provenance.length : 0
      const sourceText = sourceCount > 0 ? `${tl('Fontes mapeadas', 'Mapped sources', 'Fuentes mapeadas', 'Fonti mappate')}: ${sourceCount}` : null
      const orbText = Number.isFinite(transit?.orb) ? `Orb ${safeFixed(transit.orb)}°` : null
      const impactText = Number.isFinite(transit?.impact) ? `${tl('Impacto', 'Impact', 'Impacto', 'Impatto')} ${safeFixed(transit.impact, 2)}` : null
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
              directText: unifiedNarrative.modalIntro,
              fullText: unifiedNarrative.modalBody,
              actionText: actionText || unifiedNarrative.actionText || null,
              metaText: metaLine || null,
              statusText,
              statusColor,
              timingLabel: timingLabel || null,
              keywords: unifiedNarrative.keywords,
            })
          }
          detailMode="modal"
          modalOpenByCard
          showModalActionIcon
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

  const getTransitColumnKind = (transit: any): 'planet' | 'house' => {
    const rawTarget = String(transit?.natalPlanet || transit?.target?.natalPlanet || '').toUpperCase()
    const targetAngle = String(transit?.target?.angle || '').toUpperCase()
    if (['ASC', 'MC', 'DSC', 'IC'].includes(targetAngle)) return 'house'
    const normalizedTarget = rawTarget.replace(/^NATAL_/, '').replace(/^NATAL:/, '')
    if (['ASC', 'MC', 'DSC', 'IC'].includes(normalizedTarget)) return 'house'
    const planetTargets = new Set([
      'SUN', 'MOON', 'MERCURY', 'VENUS', 'MARS', 'JUPITER', 'SATURN', 'URANUS', 'NEPTUNE', 'PLUTO',
    ])
    const isPlanetTarget = planetTargets.has(normalizedTarget)
    if (isPlanetTarget) return 'planet'

    const targetHouse = Number(transit?.target?.house ?? transit?.natalHouseImpacted ?? transit?.natalHouse)
    const hasHouseTarget = Number.isFinite(targetHouse) && targetHouse >= 1 && targetHouse <= 12
    const explicitHouseTarget =
      rawTarget.startsWith('HOUSE_') ||
      rawTarget.startsWith('CASA') ||
      rawTarget.includes('HOUSE') ||
      rawTarget.includes('CASA')
    const rawType = String(transit?.aspectName || transit?.type || '').toLowerCase()
    const isHouseContext =
      hasHouseTarget ||
      explicitHouseTarget ||
      rawType.includes('ingress') ||
      rawType.includes('casa') ||
      rawType.includes('house') ||
      rawType.includes('planeta em casa')
    if (isHouseContext) return 'house'
    if (rawTarget && !explicitHouseTarget) return 'planet'
    return 'house'
  }

  const renderTransitsSection = () => {
    const orderedTransits = [...transitItems].sort((a, b) => getTransitPriorityScore(b) - getTransitPriorityScore(a))
    const dedupeByKey = (items: any[], keyBuilder: (transit: any) => string) => {
      const map = new Map<string, any>()
      items.forEach((item) => {
        const key = keyBuilder(item)
        const existing = map.get(key)
        if (!existing || getTransitPriorityScore(item) > getTransitPriorityScore(existing)) {
          map.set(key, item)
        }
      })
      return Array.from(map.values()).sort((a, b) => getTransitPriorityScore(b) - getTransitPriorityScore(a))
    }
    const getTransitImpactMagnitude = (transit: any): number => Math.abs(safeNumber(transit?.impact, 0))
    const getTransitRecencyDistance = (transit: any): number => {
      const toMs = (value: unknown) => {
        const ms = new Date(String(value || '')).getTime()
        return Number.isFinite(ms) ? ms : null
      }
      const now = Date.now()
      const phase = String(transit?.phase || '').toLowerCase()
      const startAt = toMs(transit?.startAt || transit?.window?.start || null)
      const peakAt = toMs(transit?.peakAt || transit?.window?.exact || null)
      const endAt = toMs(transit?.endAt || transit?.window?.end || null)
      const byPhase = phase === 'start' ? peakAt : phase === 'peak' ? peakAt : phase === 'end' ? endAt : null
      if (byPhase !== null) return Math.abs(byPhase - now)
      const candidates = [startAt, peakAt, endAt].filter((value): value is number => value !== null)
      if (!candidates.length) return Number.MAX_SAFE_INTEGER
      return Math.min(...candidates.map((value) => Math.abs(value - now)))
    }
    const sortTransitEntries = (items: Array<{ transit: any; facetKind: 'major' | 'minor' | 'house' }>) => {
      return [...items].sort((a, b) => {
        if (selectedSortMode === 'recent') {
          const recentDelta = getTransitRecencyDistance(a.transit) - getTransitRecencyDistance(b.transit)
          if (recentDelta !== 0) return recentDelta
          const impactDelta = getTransitImpactMagnitude(b.transit) - getTransitImpactMagnitude(a.transit)
          if (impactDelta !== 0) return impactDelta
          return getTransitPriorityScore(b.transit) - getTransitPriorityScore(a.transit)
        }
        if (selectedSortMode === 'impact') {
          const impactDelta = getTransitImpactMagnitude(b.transit) - getTransitImpactMagnitude(a.transit)
          if (impactDelta !== 0) return impactDelta
          const recentDelta = getTransitRecencyDistance(a.transit) - getTransitRecencyDistance(b.transit)
          if (recentDelta !== 0) return recentDelta
        }
        return getTransitPriorityScore(b.transit) - getTransitPriorityScore(a.transit)
      })
    }
    const transitStableKey = (transit: any) =>
      String(
        transit?.id ||
          [
            toIdentityToken(transit?.seriesId || ''),
            toIdentityToken(transit?.contactIndex || ''),
            toIdentityToken(transit?.transitPlanet || ''),
            toIdentityToken(transit?.natalPlanet || transit?.target?.natalPlanet || transit?.target?.angle || transit?.target?.house || ''),
            toIdentityToken(transit?.aspectName || transit?.type || ''),
            toIdentityToken(transit?.startAt || transit?.window?.start || ''),
            toIdentityToken(transit?.peakAt || transit?.window?.exact || ''),
            toIdentityToken(transit?.endAt || transit?.window?.end || ''),
          ].join('|')
      )
    const dedupedTransits = dedupeByKey(orderedTransits, transitStableKey)
    const planetOrder = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto']
    const availablePlanets = Array.from(
      new Set(
        dedupedTransits
          .map((transit) => String(transit?.transitPlanet || '').trim())
          .filter(Boolean)
      )
    ).sort((a, b) => {
      const idxA = planetOrder.indexOf(a)
      const idxB = planetOrder.indexOf(b)
      if (idxA === -1 && idxB === -1) return a.localeCompare(b)
      if (idxA === -1) return 1
      if (idxB === -1) return -1
      return idxA - idxB
    })
    const availableHouses = Array.from(
      new Set(
        dedupedTransits
          .map((transit) => getTransitHouseLabel(transit))
          .filter((value): value is string => Boolean(value))
      )
    ).sort((a, b) => Number(a) - Number(b))
    const toneMatchesFilter = (transit: any): boolean => {
      if (selectedToneFilter === 'all') return true
      const tone = getTransitToneCategory(transit)
      if (selectedToneFilter === 'harmonic') return tone === 'harmonic'
      return tone === 'challenging'
    }
    const planetHouseMatchesFilter = (transit: any): boolean => {
      const transitPlanet = String(transit?.transitPlanet || '').trim()
      const transitHouse = getTransitHouseLabel(transit)
      const planetMatch = selectedPlanetFilters.length === 0 || selectedPlanetFilters.includes(transitPlanet)
      const houseMatch = selectedHouseFilters.length === 0 || (transitHouse ? selectedHouseFilters.includes(transitHouse) : false)
      return planetMatch && houseMatch
    }
    const combinedTransitsRaw: Array<{ transit: any; facetKind: 'major' | 'minor' | 'house' }> = [
      ...(selectedFacetFilters.includes('major')
        ? dedupedTransits
            .filter((transit) => getTransitColumnKind(transit) === 'planet')
            .filter((transit) => isMajorAspectTransit(transit))
            .map((transit) => ({ transit, facetKind: 'major' as const }))
        : []),
      ...(selectedFacetFilters.includes('minor')
        ? dedupedTransits
            .filter((transit) => getTransitColumnKind(transit) === 'planet')
            .filter((transit) => isMinorAspectTransit(transit))
            .map((transit) => ({ transit, facetKind: 'minor' as const }))
        : []),
      ...(selectedFacetFilters.includes('house')
        ? dedupedTransits
            .filter((transit) => getTransitColumnKind(transit) === 'house')
            .map((transit) => ({ transit, facetKind: 'house' as const }))
        : []),
    ]
      .filter(({ transit }) => toneMatchesFilter(transit))
      .filter(({ transit }) => planetHouseMatchesFilter(transit))
    const dedupeCombinedEntries = (items: Array<{ transit: any; facetKind: 'major' | 'minor' | 'house' }>) => {
      const map = new Map<string, { transit: any; facetKind: 'major' | 'minor' | 'house' }>()
      const facetPriority: Record<'major' | 'minor' | 'house', number> = { major: 1, minor: 2, house: 3 }
      items.forEach((entry) => {
        const key = transitStableKey(entry.transit)
        const existing = map.get(key)
        if (!existing) {
          map.set(key, entry)
          return
        }
        if (facetPriority[entry.facetKind] > facetPriority[existing.facetKind]) {
          map.set(key, entry)
          return
        }
        if (getTransitPriorityScore(entry.transit) > getTransitPriorityScore(existing.transit)) {
          map.set(key, entry)
        }
      })
      return Array.from(map.values())
    }
    const combinedTransits = dedupeCombinedEntries(combinedTransitsRaw)
    const sortedTransits = sortTransitEntries(combinedTransits)
    const aspectEntries = sortedTransits.filter((entry) => entry.facetKind !== 'house')
    const houseEntries = sortedTransits.filter((entry) => entry.facetKind === 'house')
    const aspectTransitCards = renderTransitList(aspectEntries, 0, false)
    const houseTransitCards = renderTransitList(houseEntries, aspectEntries.length, false)
    const activeFiltersCount =
      (selectedToneFilter !== 'all' ? 1 : 0) +
      (selectedSortMode !== 'impact' ? 1 : 0) +
      (selectedFacetFilters.length === 1 && selectedFacetFilters[0] === 'major' ? 0 : 1) +
      (selectedPlanetFilters.length ? 1 : 0) +
      (selectedHouseFilters.length ? 1 : 0)

    return (
      <View style={styles.section}>
        {transitItems.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              {tl(
                'Nenhum trânsito ativo para esta área no momento',
                'No active transits for this area right now',
                'No hay tránsitos activos para esta área en este momento',
                'Nessun transito attivo per quest area in questo momento'
              )}
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.transitBlock}>
              <View style={styles.transitColumnHeader}>
                <TouchableOpacity style={styles.filtersToggleBar} onPress={() => setFiltersExpanded((prev) => !prev)}>
                  <Text style={styles.filtersToggleTitle}>{tl('Filtros e Ordenação', 'Filters and Sorting', 'Filtros y ordenación', 'Filtri e ordinamento')}</Text>
                  <View style={styles.filtersToggleMetaWrap}>
                    <Text style={styles.filtersToggleMeta}>
                      {activeFiltersCount} {tl('ativos', 'active', 'activos', 'attivi')}
                    </Text>
                    <Ionicons
                      name={filtersExpanded ? 'chevron-up' : 'chevron-down'}
                      size={14}
                      color="#9A3412"
                    />
                  </View>
                </TouchableOpacity>
                {filtersExpanded ? (
                  <>
                    <View style={styles.transitHeaderControlRow}>
                      <View style={styles.facetToggleRow}>
                        <TouchableOpacity
                          onPress={() =>
                            setSelectedFacetFilters((prev) =>
                              prev.includes('major') ? prev.filter((item) => item !== 'major') : [...prev, 'major']
                            )
                          }
                          style={[styles.toneToggleChip, selectedFacetFilters.includes('major') ? styles.toneToggleChipActive : null]}
                        >
                          <Text style={[styles.toneToggleText, selectedFacetFilters.includes('major') ? styles.toneToggleTextActive : null]}>
                            {tl('Aspectos maiores', 'Major aspects', 'Aspectos mayores', 'Aspetti maggiori')}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() =>
                            setSelectedFacetFilters((prev) =>
                              prev.includes('minor') ? prev.filter((item) => item !== 'minor') : [...prev, 'minor']
                            )
                          }
                          style={[styles.toneToggleChip, selectedFacetFilters.includes('minor') ? styles.toneToggleChipActive : null]}
                        >
                          <Text style={[styles.toneToggleText, selectedFacetFilters.includes('minor') ? styles.toneToggleTextActive : null]}>
                            {tl('Aspectos menores', 'Minor aspects', 'Aspectos menores', 'Aspetti minori')}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() =>
                            setSelectedFacetFilters((prev) =>
                              prev.includes('house') ? prev.filter((item) => item !== 'house') : [...prev, 'house']
                            )
                          }
                          style={[styles.toneToggleChip, selectedFacetFilters.includes('house') ? styles.toneToggleChipActive : null]}
                        >
                          <Text style={[styles.toneToggleText, selectedFacetFilters.includes('house') ? styles.toneToggleTextActive : null]}>
                            {tl('Planetas nas casas', 'Planets in houses', 'Planetas en las casas', 'Pianeti nelle case')}
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <View style={styles.toneToggleRow}>
                        <TouchableOpacity
                          onPress={() => setSelectedToneFilter('all')}
                          style={[styles.toneToggleChip, selectedToneFilter === 'all' ? styles.toneToggleChipActive : null]}
                        >
                          <Text style={[styles.toneToggleText, selectedToneFilter === 'all' ? styles.toneToggleTextActive : null]}>
                            {tl('Todos', 'All', 'Todos', 'Tutti')}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => setSelectedToneFilter('challenging')}
                          style={[styles.toneToggleChip, selectedToneFilter === 'challenging' ? styles.toneToggleChipActive : null]}
                        >
                          <Text style={[styles.toneToggleText, selectedToneFilter === 'challenging' ? styles.toneToggleTextActive : null]}>
                            {tl('Desafiador', 'Challenging', 'Desafiante', 'Impegnativo')}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => setSelectedToneFilter('harmonic')}
                          style={[styles.toneToggleChip, selectedToneFilter === 'harmonic' ? styles.toneToggleChipActive : null]}
                        >
                          <Text style={[styles.toneToggleText, selectedToneFilter === 'harmonic' ? styles.toneToggleTextActive : null]}>
                            {tl('Harmônico', 'Harmonic', 'Armónico', 'Armonico')}
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <View style={styles.toneToggleRow}>
                        <TouchableOpacity
                          onPress={() => setSelectedSortMode('impact')}
                          style={[styles.toneToggleChip, selectedSortMode === 'impact' ? styles.toneToggleChipActive : null]}
                        >
                          <Text style={[styles.toneToggleText, selectedSortMode === 'impact' ? styles.toneToggleTextActive : null]}>
                            {tl('Mais impacto', 'Most impact', 'Mayor impacto', 'Maggiore impatto')}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => setSelectedSortMode('recent')}
                          style={[styles.toneToggleChip, selectedSortMode === 'recent' ? styles.toneToggleChipActive : null]}
                        >
                          <Text style={[styles.toneToggleText, selectedSortMode === 'recent' ? styles.toneToggleTextActive : null]}>
                            {tl('Mais recente', 'Most recent', 'Más reciente', 'Più recente')}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => {
                            setSelectedFacetFilters(['major'])
                            setSelectedToneFilter('all')
                            setSelectedSortMode('impact')
                            setSelectedPlanetFilters([])
                            setSelectedHouseFilters([])
                          }}
                          style={styles.toneToggleChip}
                        >
                          <Text style={styles.toneToggleText}>{tl('Limpar', 'Clear', 'Limpiar', 'Pulisci')}</Text>
                        </TouchableOpacity>
                      </View>
                      {availablePlanets.length ? (
                        <View style={styles.filterBlock}>
                          <Text style={styles.filterTitle}>{tl('Filtro • Planetas', 'Filter • Planets', 'Filtro • Planetas', 'Filtro • Pianeti')}</Text>
                          <View style={styles.filterRow}>
                            {availablePlanets.map((planet) => {
                              const active = selectedPlanetFilters.includes(planet)
                              const imageKey = resolvePlanetImageKey(planet)
                              const imageUri = imageKey ? getPlanetImageUri(imageKey) : null
                              return (
                                <TouchableOpacity
                                  key={`planet-${planet}`}
                                  onPress={() =>
                                    setSelectedPlanetFilters((prev) =>
                                      prev.includes(planet) ? prev.filter((item) => item !== planet) : [...prev, planet]
                                    )
                                  }
                                  style={[styles.filterChip, active ? styles.filterChipSelected : null]}
                                >
                                  {imageUri ? (
                                    <Image source={{ uri: imageUri }} style={styles.filterChipPlanetImage} resizeMode="cover" />
                                  ) : (
                                    <Ionicons name="planet" size={14} color={active ? '#9A3412' : '#64748B'} />
                                  )}
                                  <Text style={[styles.filterChipText, active ? styles.filterChipTextSelected : null]}>
                                    {planetLabel(planet)}
                                  </Text>
                                </TouchableOpacity>
                              )
                            })}
                          </View>
                        </View>
                      ) : null}
                      {availableHouses.length ? (
                        <View style={styles.filterBlock}>
                          <Text style={styles.filterTitle}>{tl('Filtro • Casas', 'Filter • Houses', 'Filtro • Casas', 'Filtro • Case')}</Text>
                          <View style={styles.filterRow}>
                            {availableHouses.map((house) => {
                              const active = selectedHouseFilters.includes(house)
                              return (
                                <TouchableOpacity
                                  key={`house-${house}`}
                                  onPress={() =>
                                    setSelectedHouseFilters((prev) =>
                                      prev.includes(house) ? prev.filter((item) => item !== house) : [...prev, house]
                                    )
                                  }
                                  style={[styles.filterChip, active ? styles.filterChipSelected : null]}
                                >
                                  <Text style={[styles.filterChipText, active ? styles.filterChipTextSelected : null]}>
                                    {tl('Casa', 'House', 'Casa', 'Casa')} {house}
                                  </Text>
                                </TouchableOpacity>
                              )
                            })}
                          </View>
                        </View>
                      ) : null}
                    </View>
                  </>
                ) : null}
                <View style={styles.transitHeaderTitleWrap}>
                  <Text style={styles.transitColumnTitle}>{tl('Lista de trânsitos', 'Transit list', 'Lista de tránsitos', 'Lista dei transiti')}</Text>
                  <Text style={styles.transitColumnDescription}>{tl('Leitura combinada pelos filtros ativos', 'Combined reading from active filters', 'Lectura combinada por filtros activos', 'Lettura combinata dai filtri attivi')}</Text>
                  <Text style={styles.transitColumnMeta}>{aspectTransitCards.length + houseTransitCards.length}</Text>
                </View>
              </View>
              {selectedFacetFilters.length === 0 ? (
                <Text style={styles.emptyColumnText}>
                  {tl(
                    'Ative ao menos um tipo de filtro.',
                    'Enable at least one filter type.',
                    'Activa al menos un tipo de filtro.',
                    'Attiva almeno un tipo di filtro.'
                  )}
                </Text>
              ) : (aspectTransitCards.length + houseTransitCards.length) ? (
                <>
                  {aspectTransitCards.length ? (
                    <View style={styles.transitSubsection}>
                      <View style={styles.transitSubsectionHeader}>
                        <Text style={styles.transitSubsectionTitle}>
                          {tl('Aspectos', 'Aspects', 'Aspectos', 'Aspetti')}
                        </Text>
                        <Text style={styles.transitSubsectionMeta}>{aspectTransitCards.length}</Text>
                      </View>
                      {aspectTransitCards}
                    </View>
                  ) : null}
                  {houseTransitCards.length ? (
                    <View style={styles.transitSubsection}>
                      <View style={styles.transitSubsectionHeader}>
                        <Text style={styles.transitSubsectionTitle}>
                          {tl('Planetas nas casas', 'Planets in houses', 'Planetas en las casas', 'Pianeti nelle case')}
                        </Text>
                        <Text style={styles.transitSubsectionMeta}>{houseTransitCards.length}</Text>
                      </View>
                      {houseTransitCards}
                    </View>
                  ) : null}
                </>
              ) : (
                <Text style={styles.emptyColumnText}>{tl('Nenhum trânsito para os filtros selecionados.', 'No transits for selected filters.', 'No hay tránsitos para los filtros seleccionados.', 'Nessun transito per i filtri selezionati.')}</Text>
              )}
            </View>
          </>
        )}
      </View>
    )
  }

  const renderSuggestionsSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{tl('SUGESTÕES POR TRÂNSITO', 'SUGGESTIONS BY TRANSIT', 'SUGERENCIAS POR TRÁNSITO', 'SUGGERIMENTI PER TRANSITO')}</Text>

      {(backendSuggestions.length === 0 && realSuggestions.length === 0) ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>{tl('Nenhuma sugestão disponível no momento', 'No suggestions available right now', 'No hay sugerencias disponibles en este momento', 'Nessun suggerimento disponibile al momento')}</Text>
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
          let statusText = tl('Neutro', 'Neutral', 'Neutro', 'Neutro')
          if (isHarmonious) {
            statusColor = DESIGN_SYSTEM.colors.positive
            statusText = tl('Harmônico', 'Harmonic', 'Armónico', 'Armonico')
          } else if (isChallenging) {
            statusColor = DESIGN_SYSTEM.colors.negative
            statusText = tl('Desafiador', 'Challenging', 'Desafiante', 'Impegnativo')
          } else if (isNeutral) {
            statusColor = DESIGN_SYSTEM.colors.neutral
          }

          let transitTitle = tl('Trânsito', 'Transit', 'Tránsito', 'Transito')
          let transitMeta = ''
          let suggestionContextLabel = tl('Aspecto maior', 'Major aspect', 'Aspecto mayor', 'Aspetto maggiore')
          if (transit) {
            suggestionContextLabel = isMinorAspectTransit(transit)
              ? tl('Aspecto menor', 'Minor aspect', 'Aspecto menor', 'Aspetto minore')
              : tl('Aspecto maior', 'Major aspect', 'Aspecto mayor', 'Aspetto maggiore')
            transitTitle = buildTransitTitle(transit)
            const houseLabel = getTransitHouseLabel(transit)
            const orbLabel = Number.isFinite(transit?.orb) ? `Orb ${safeFixed(transit.orb)}°` : ''
            const houseName = getHouseNameByNumber(houseLabel)
            transitMeta = [
              houseLabel ? `${tl('Casa natal ativada', 'Activated natal house', 'Casa natal activada', 'Casa natale attivata')} ${houseLabel}` : '',
              houseName,
              transit?.natalPlanet ? `${tl('Alvo natal', 'Natal target', 'Objetivo natal', 'Target natale')}: ${planetLabel(transit.natalPlanet)}` : '',
              orbLabel,
            ]
              .filter(Boolean)
              .join(' • ')
          } else if (aspect) {
            transitTitle = `${planetLabel(aspect.planet1)} ${getAspectLabel(aspect.type)} ${planetLabel(aspect.planet2)}`
            transitMeta = `${tl('Força', 'Strength', 'Fuerza', 'Forza')} ${aspect.score} • Orb ${safeFixed(aspect.orb)}°`
            suggestionContextLabel = MINOR_ASPECT_KEYS.has(normalizeAspectKey(String(aspect.type || '')))
              ? tl('Aspecto menor', 'Minor aspect', 'Aspecto menor', 'Aspetto minore')
              : tl('Aspecto maior', 'Major aspect', 'Aspecto mayor', 'Aspetto maggiore')
          }
          const timingLabel = transit ? getTimingLabelLocalized(transit, getTransitColumnKind(transit)) : null

          return (
            <View key={suggestion.id || suggestion.transitId} style={styles.suggestionCard}>
              <View style={styles.suggestionHeader}>
                <Text style={styles.suggestionNumber}>#{index + 1}</Text>
                <View style={styles.suggestionBadges}>
                  <View style={styles.suggestionContextBadge}>
                    <Text style={styles.suggestionContextText}>{suggestionContextLabel}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
                    <Text style={styles.statusText}>{statusText}</Text>
                  </View>
                </View>
              </View>

              <Text style={styles.suggestionTransitTitle}>{transitTitle}</Text>
              {transitMeta ? <Text style={styles.suggestionTransitMeta}>{transitMeta}</Text> : null}
              {timingLabel ? <Text style={styles.suggestionTiming}>{timingLabel}</Text> : null}
              <Text style={styles.suggestionText}>{suggestion.text || suggestion.suggestion}</Text>
              {suggestion.action ? (
                <Text style={styles.suggestionMeta}>
                  {tl('Ação', 'Action', 'Acción', 'Azione')}: {suggestion.action} • {tl('Período', 'Period', 'Período', 'Periodo')}: {suggestion.influencePeriod}
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
      <Text style={styles.sectionTitle}>{tl('CÁLCULOS TÉCNICOS E BASE ASTROLÓGICA', 'TECHNICAL CALCULATIONS AND ASTROLOGICAL BASIS', 'CÁLCULOS TÉCNICOS Y BASE ASTROLÓGICA', 'CALCOLI TECNICI E BASE ASTROLOGICA')}</Text>
      
      <View style={styles.calculationCard}>
        <Text style={styles.breakdownTitle}>{tl('Fatores do status desta área:', 'Status factors for this area:', 'Factores del estado de esta área:', 'Fattori dello stato di quest area:')}</Text>
        <Text style={styles.validationText}>
          {tl('Score atual', 'Current score', 'Puntuación actual', 'Punteggio attuale')}: {safeNumber(areaData.status)}% • {tl('Trânsitos considerados', 'Considered transits', 'Tránsitos considerados', 'Transiti considerati')}: {transitItems.length}
        </Text>
        <Text style={styles.validationText}>
          {tl('Força total dos trânsitos', 'Total transit strength', 'Fuerza total de tránsitos', 'Forza totale dei transiti')}: {safeFixed(totalTransitStrength, 2)}
        </Text>
        {planetBreakdown.length ? (
          <Text style={styles.validationText}>
            {tl('Planetas com maior peso', 'Highest-weight planets', 'Planetas con mayor peso', 'Pianeti con peso maggiore')}: {planetBreakdown
              .slice()
              .sort((a, b) => safeNumber(b.totalScore) - safeNumber(a.totalScore))
              .slice(0, 5)
              .map((p) => `${planetLabel(p.planet)} (${p.totalScore})`)
              .join(' • ')}
          </Text>
        ) : null}

        <Text style={styles.formulaTitle}>{tl('Fórmula de Cálculo:', 'Calculation formula:', 'Fórmula de cálculo:', 'Formula di calcolo:')}</Text>
        <Text style={styles.formulaText}>{realCalculations.formula}</Text>
        
        <Text style={styles.breakdownTitle}>{tl('Detalhamento matemático:', 'Mathematical breakdown:', 'Detalle matemático:', 'Dettaglio matematico:')}</Text>
        
        {/* Breakdown em árvore por Planeta */}
        {planetBreakdown.map((planet, index) => (
          <View key={planet.planet} style={styles.planetBreakdownCard}>
            <View style={styles.planetHeader}>
              <Text style={styles.planetName}>{planetLabel(planet.planet)}</Text>
              <Text style={styles.planetTotal}>{planet.totalScore} pts</Text>
              <Text style={styles.planetPercentage}>({planet.percentageOfTotal}%)</Text>
            </View>
            
            {/* Dignidade Essencial */}
            <View style={styles.breakdownRow}>
              <View style={styles.breakdownLabel}>
                <Text style={styles.breakdownLabelText}>{tl('Dignidade essencial:', 'Essential dignity:', 'Dignidad esencial:', 'Dignità essenziale:')}</Text>
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
                <Text style={styles.breakdownLabelText}>{tl('Força da casa:', 'House strength:', 'Fuerza de la casa:', 'Forza della casa:')}</Text>
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
                <Text style={styles.aspectsTitle}>{tl('Aspectos de trânsito:', 'Transit aspects:', 'Aspectos de tránsito:', 'Aspetti di transito:')}</Text>
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
                           {aspectIcon} {getAspectLabel(aspect.type)} {tl('com', 'with', 'con', 'con')} {planetLabel(aspect.with)}:
                         </Text>
                      </View>
                      <View style={styles.aspectValue}>
                        <Text style={[styles.aspectValueText, { color: aspectColor }]}>
                          {isChallenging ? '-' : '+'}{Math.abs(aspect.score)}
                        </Text>
                      </View>
                      <View style={styles.aspectDescription}>
                        <Text style={styles.aspectDescriptionText}>
                          Orb: {safeFixed(aspect.orb)} {tl('graus', 'degrees', 'grados', 'gradi')} - {isHarmonious ? tl('Harmônico', 'Harmonic', 'Armónico', 'Armonico') : isChallenging ? tl('Desafiador', 'Challenging', 'Desafiante', 'Impegnativo') : tl('Neutro', 'Neutral', 'Neutro', 'Neutro')}
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
                <Text style={styles.conditionsTitle}>{tl('Condições acidentais:', 'Accidental conditions:', 'Condiciones accidentales:', 'Condizioni accidentali:')}</Text>
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
               <Text style={styles.planetTotalLabel}>{tl('Total', 'Total', 'Total', 'Totale')} {planet.planet}:</Text>
               <Text style={styles.planetTotalValue}>{planet.totalScore} {tl('pontos', 'points', 'puntos', 'punti')}</Text>
             </View>

             {/*  NOVO: BREAKDOWN DETALHADO COM MULTIPLICADORES */}
             {planet.detailedBreakdown && (
               <View style={styles.detailedBreakdownSection}>
                 <Text style={styles.detailedBreakdownTitle}>{tl('Cálculo detalhado:', 'Detailed calculation:', 'Cálculo detallado:', 'Calcolo dettagliato:')}</Text>
                 
                 {/* Score Base */}
                 <View style={styles.breakdownRow}>
                   <View style={styles.breakdownLabel}>
                     <Text style={styles.breakdownLabelText}>{tl('Score base:', 'Base score:', 'Puntuación base:', 'Punteggio base:')}</Text>
                   </View>
                   <View style={styles.breakdownValue}>
                     <Text style={styles.breakdownValueText}>+{planet.detailedBreakdown.baseScore}</Text>
                   </View>
                   <View style={styles.breakdownReason}>
                     <Text style={styles.breakdownReasonText}>
                       {tl('Dignidade', 'Dignity', 'Dignidad', 'Dignità')} ({planet.dignityScore}) + {tl('Casa', 'House', 'Casa', 'Casa')} ({planet.houseScore})
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
                   <Text style={styles.calculationStepsTitle}>{tl('Passos do cálculo:', 'Calculation steps:', 'Pasos del cálculo:', 'Passi del calcolo:')}</Text>
                   {planet.detailedBreakdown.calculationSteps.map((step, stepIndex) => (
                     <Text key={stepIndex} style={styles.calculationStepText}>
                       {stepIndex + 1}. {step}
                     </Text>
                   ))}
                 </View>

                 {/* Score Final */}
                 <View style={styles.finalScoreRow}>
                   <Text style={styles.finalScoreLabel}> {tl('Score Final', 'Final Score', 'Puntuación final', 'Punteggio finale')}:</Text>
                   <Text style={styles.finalScoreValue}>
                     {planet.detailedBreakdown.finalScore} {tl('pontos', 'points', 'puntos', 'punti')}
                   </Text>
                 </View>
               </View>
             )}
          </View>
        ))}
        
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>{tl('Total Geral', 'Overall Total', 'Total general', 'Totale generale')}:</Text>
          <Text style={styles.totalValue}>{realCalculations.total}</Text>
        </View>
        
        <Text style={styles.validationTitle}>{tl('Validação:', 'Validation:', 'Validación:', 'Validazione:')}</Text>
        <Text style={styles.validationText}>{realCalculations.validation}</Text>
        
        <Text style={styles.basisTitle}>{tl('Base Astrológica:', 'Astrological basis:', 'Base astrológica:', 'Base astrologica:')}</Text>
        <Text style={styles.basisText}>{realCalculations.astrologicalBasis}</Text>
        
        {/*  NOTA EXPLICATIVA SOBRE SCORES */}
        <View style={styles.explanationCard}>
          <Text style={styles.explanationTitle}>{tl('Como interpretar os scores:', 'How to interpret scores:', 'Cómo interpretar las puntuaciones:', 'Come interpretare i punteggi:')}</Text>
          <Text style={styles.explanationText}>
            - <Text style={{ color: DESIGN_SYSTEM.colors.positive }}>{tl('Scores positivos', 'Positive scores', 'Puntuaciones positivas', 'Punteggi positivi')}</Text> {tl('indicam influências favoráveis', 'indicate favorable influences', 'indican influencias favorables', 'indicano influenze favorevoli')}
          </Text>
          <Text style={styles.explanationText}>
            - <Text style={{ color: DESIGN_SYSTEM.colors.negative }}>{tl('Scores negativos', 'Negative scores', 'Puntuaciones negativas', 'Punteggi negativi')}</Text> {tl('indicam desafios a serem superados', 'indicate challenges to overcome', 'indican desafíos por superar', 'indicano sfide da superare')}
          </Text>
          <Text style={styles.explanationText}>
            - <Text style={{ color: DESIGN_SYSTEM.colors.neutral }}>{tl('Scores neutros', 'Neutral scores', 'Puntuaciones neutras', 'Punteggi neutri')}</Text> {tl('indicam influências equilibradas', 'indicate balanced influences', 'indican influencias equilibradas', 'indicano influenze bilanciate')}
          </Text>
          <Text style={styles.explanationText}>
            - {tl('A', 'The', 'La', 'La')} <Text style={{ fontWeight: 'bold' }}>{tl('natureza do aspecto', 'aspect nature', 'naturaleza del aspecto', 'natura dell aspetto')}</Text> ({tl('Harmônico/Desafiador/Neutro', 'Harmonic/Challenging/Neutral', 'Armónico/Desafiante/Neutro', 'Armonico/Impegnativo/Neutro')}) {tl('é baseada no tipo astrológico, não no score numérico', 'is based on astrological type, not numeric score', 'se basa en el tipo astrológico, no en la puntuación numérica', 'si basa sul tipo astrologico, non sul punteggio numerico')}
          </Text>
        </View>
      </View>
      <Text style={styles.intensityText}>
        {tl('A intensidade indica o quanto este tema tende a ocupar espaco na experiencia atual. Nao define resultados.', 'Intensity indicates how much this theme tends to occupy space in the current experience. It does not define outcomes.', 'La intensidad indica cuánto este tema tiende a ocupar espacio en la experiencia actual. No define resultados.', 'L intensita indica quanto questo tema tende a occupare spazio nell esperienza attuale. Non definisce i risultati.')}
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
            {renderScoreComponentsSection()}
            {renderTransitsSection()}
            {renderMetricLevelsSection()}
            {renderCalculationToggle()}
            {showTechnical ? renderCalculationsSection() : null}
          </ScrollView>
        </View>
      </View>

      <ReadingDetailModal
        visible={!!detailView}
        onClose={() => setDetailView(null)}
        statusLabel={detailView?.statusText || tl('Neutro', 'Neutral', 'Neutro', 'Neutro')}
        statusColor={detailView?.statusColor || '#64748B'}
        title={detailView?.title || tl('Leitura', 'Reading', 'Lectura', 'Lettura')}
        timingLabel={detailView?.timingLabel || null}
        directText={detailView?.directText || ''}
        fullText={detailView?.fullText || ''}
        actionText={detailView?.actionText || null}
        metaText={detailView?.metaText || null}
        keywords={detailView?.keywords || []}
      />
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
  scoreComponentsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    justifyContent: 'center',
  },
  scoreComponentChip: {
    minWidth: 84,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 6,
    alignItems: 'center',
  },
  scoreComponentChipPositive: {
    borderColor: '#BBF7D0',
    backgroundColor: '#F0FDF4',
  },
  scoreComponentChipWarning: {
    borderColor: '#FED7AA',
    backgroundColor: '#FFF7ED',
  },
  scoreComponentChipActive: {
    borderColor: '#B45309',
    backgroundColor: '#FFFBEB',
  },
  scoreComponentLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  scoreComponentValue: {
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '800',
    marginTop: 2,
  },
  scoreComponentInfoBox: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#FED7AA',
    backgroundColor: '#FFFBEB',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  scoreComponentInfoText: {
    fontSize: 12,
    color: '#7C2D12',
    lineHeight: 17,
    textAlign: 'left',
  },
  scoreDetailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  scoreDetailTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#9A3412',
    flex: 1,
  },
  scoreDetailMetricChip: {
    borderWidth: 1,
    borderColor: '#FDBA74',
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  scoreDetailMetricText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#9A3412',
  },
  scoreDetailSummary: {
    fontSize: 12,
    color: '#7C2D12',
    lineHeight: 17,
    marginTop: 4,
  },
  scoreDetailRows: {
    marginTop: 8,
    gap: 6,
  },
  scoreDetailRow: {
    borderWidth: 1,
    borderColor: '#FED7AA',
    borderRadius: 8,
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 8,
    paddingVertical: 7,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  scoreDetailRowHarmonic: {
    borderColor: '#BBF7D0',
    backgroundColor: '#F0FDF4',
  },
  scoreDetailRowChallenging: {
    borderColor: '#FECACA',
    backgroundColor: '#FEF2F2',
  },
  scoreDetailRowIconWrap: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreDetailRowText: {
    flex: 1,
  },
  scoreDetailRowTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
  },
  scoreDetailRowMeta: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  scoreDetailRowValue: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  scoreDetailEmpty: {
    marginTop: 8,
    fontSize: 11,
    color: '#64748B',
    fontStyle: 'italic',
  },
  sectionControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: DESIGN_SYSTEM.spacing.sm,
  },
  facetToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    width: '100%',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  toneToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    width: '100%',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  toneToggleChip: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#F8FAFC',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
    maxWidth: '100%',
    alignSelf: 'flex-start',
  },
  toneToggleChipActive: {
    borderColor: '#B45309',
    backgroundColor: '#FFF7ED',
  },
  toneToggleText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '700',
  },
  toneToggleTextActive: {
    color: '#9A3412',
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
  filtersSection: {
    marginTop: 4,
    marginBottom: 6,
    gap: 8,
  },
  filtersToggleBar: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 7,
    marginBottom: 6,
  },
  filtersToggleTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1E293B',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  filtersToggleMetaWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  filtersToggleMeta: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9A3412',
  },
  filterBlock: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderWidth: 1,
    borderRadius: 10,
    padding: 8,
  },
  filterTitle: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: '#475569',
    fontWeight: '700',
    marginBottom: 6,
    textAlign: 'center',
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    justifyContent: 'center',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#F8FAFC',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  filterChipSelected: {
    borderColor: '#B45309',
    backgroundColor: '#FFF7ED',
  },
  filterChipText: {
    fontSize: 11,
    color: '#334155',
    fontWeight: '700',
  },
  filterChipTextSelected: {
    color: '#9A3412',
  },
  filterChipPlanetImage: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FFFFFF',
  },
  transitsColumnsGrid: {
    marginTop: 8,
    gap: 10,
  },
  transitsColumnsGridWide: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  transitBlock: {
    marginTop: 0,
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
  },
  transitBlockWide: {
    flex: 1,
    minWidth: 0,
  },
  emptyColumnText: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    paddingVertical: 14,
    paddingHorizontal: 8,
  },
  transitColumnHeader: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    paddingHorizontal: 6,
    gap: 3,
  },
  transitHeaderControlRow: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    gap: 8,
    marginBottom: 2,
  },
  transitHeaderTitleWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    gap: 3,
  },
  transitColumnTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    textAlign: 'center',
  },
  transitColumnDescription: {
    fontSize: 11,
    color: '#475569',
    textAlign: 'center',
  },
  transitColumnMeta: {
    fontSize: 11,
    color: '#1E293B',
    fontWeight: '800',
    backgroundColor: '#FFF7ED',
    borderColor: '#FED7AA',
    borderWidth: 1,
    borderRadius: 999,
    overflow: 'hidden',
    paddingHorizontal: 9,
    paddingVertical: 2,
  },
  transitSubsection: {
    width: '100%',
    marginTop: 6,
  },
  transitSubsectionHeader: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
    marginBottom: 6,
  },
  transitSubsectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1E293B',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  transitSubsectionMeta: {
    fontSize: 11,
    color: '#9A3412',
    fontWeight: '800',
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
  suggestionBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  suggestionContextBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#F8FAFC',
  },
  suggestionContextText: {
    fontSize: 10,
    color: '#334155',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
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





























