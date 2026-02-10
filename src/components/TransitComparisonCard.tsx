import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Pressable, Modal, ScrollView, useWindowDimensions } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import type { PlanetComparison, ChartSummary } from '../services/astrology/RealAstrologyEngine'
import { decodeUnicodeEscapes, translatePlanetPT } from '../utils/astro/pt'
import { normalizeKey } from '../utils/astro/normalizeKey'
import useTransits from '../hooks/useTransits'
import { useUserSettings } from '../hooks/useUserSettings'
import { normalizeHouseSystem, formatHouseSystemLabel } from '../astro/houseSystem'
import type { HouseSystem } from '../astro/houseSystem'

interface TransitComparisonCardProps {
  planetComparisons: PlanetComparison[]
  chartSummary: ChartSummary
  ascendant?: number
  midheaven?: number
  natalAscendant?: number
  natalMidheaven?: number
  housesCusps?: number[]
  natalHousesCusps?: number[]
  lifeAreas?: Record<string, any>
  lifeAreasDebug?: Record<string, any>
  personalWindows?: Array<{
    transitPlanet: string
    natalPlanet: string
    type: string
    window?: { start?: string; exact?: string; end?: string; days?: number }
  }>
  showOverviewHeader?: boolean
}
const ELEMENT_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  fire: 'flame',
  earth: 'leaf',
  air: 'cloud',
  water: 'water',
  fogo: 'flame',
  terra: 'leaf',
  ar: 'cloud',
  agua: 'water',
  '­ƒöÑ': 'flame',
  '­ƒîì': 'leaf',
  '­ƒîÄ': 'leaf',
  '­ƒîÅ': 'leaf',
  '­ƒÆ¿': 'cloud',
  '­ƒÆº': 'water',
  '­ƒÆª': 'water'
}

const MODALITY_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  cardinal: 'flash',
  fixed: 'square',
  mutable: 'repeat',
  cardeal: 'flash',
  fixo: 'square',
  mutavel: 'repeat',
  'ÔÜí': 'flash',
  '­ƒöÆ': 'square',
  '­ƒöü': 'repeat'
}

const FALLBACK_ICON: keyof typeof Ionicons.glyphMap = 'help-circle'

const ASPECT_ICONS = {
  conjuncao: '\u260C',
  sextil: '\u2736',
  quadratura: '\u25A1',
  trigono: '\u25B3',
  oposicao: '\u260D',
  quincuncio: '\u26BB'
} as const

const ASPECT_COLORS = {
  conjuncao: '#FFD700',
  sextil: '#10B981',
  quadratura: '#EF4444',
  trigono: '#3B82F6',
  oposicao: '#F59E0B',
  quincuncio: '#8B5CF6'
} as const

const PLANET_ICONS: Record<string, string> = {
  Sun: '\u2609',
  Moon: '\u263D',
  Mercury: '\u263F',
  Venus: '\u2640',
  Mars: '\u2642',
  Jupiter: '\u2643',
  Saturn: '\u2644',
  Uranus: '\u2645',
  Neptune: '\u2646',
  Pluto: '\u2647'
}

const PLANET_TOKEN = /\b(Sun|Moon|Mercury|Venus|Mars|Jupiter|Saturn|Uranus|Neptune|Pluto)\b/gi
const PLANET_KEYWORDS: Record<string, string> = {
  Sun: 'direção e identidade',
  Moon: 'emoções e segurança',
  Mercury: 'mente e comunicação',
  Venus: 'vínculos e valores',
  Mars: 'ação e iniciativa',
  Jupiter: 'expansão e visão',
  Saturn: 'estrutura e responsabilidade',
  Uranus: 'mudança e liberdade',
  Neptune: 'sensibilidade e imaginação',
  Pluto: 'profundidade e transformação'
}

const HOUSE_FOCUS: Record<number, string> = {
  1: 'identidade e presença',
  2: 'recursos e estabilidade',
  3: 'comunicação e aprendizado',
  4: 'base emocional e família',
  5: 'criatividade e expressão',
  6: 'rotina e organização',
  7: 'parcerias e acordos',
  8: 'trocas profundas e desapego',
  9: 'sentido e expansão',
  10: 'carreira e reputação',
  11: 'rede e projetos',
  12: 'fechamentos e interiorização'
}

const ELEMENT_KEYS = ['fire', 'earth', 'air', 'water'] as const
const MODALITY_KEYS = ['cardinal', 'fixed', 'mutable'] as const
const SIGN_WEIGHT = 0.6
const HOUSE_WEIGHT = 0.4

const toCanonicalElementKey = (value: string): 'fire' | 'earth' | 'air' | 'water' | null => {
  const normalized = normalizeKey(String(value || ''))
  const map: Record<string, 'fire' | 'earth' | 'air' | 'water'> = {
    fire: 'fire',
    fogo: 'fire',
    earth: 'earth',
    terra: 'earth',
    air: 'air',
    ar: 'air',
    water: 'water',
    agua: 'water'
  }
  return map[normalized] || null
}

const toCanonicalModalityKey = (value: string): 'cardinal' | 'fixed' | 'mutable' | null => {
  const normalized = normalizeKey(String(value || ''))
  const map: Record<string, 'cardinal' | 'fixed' | 'mutable'> = {
    cardinal: 'cardinal',
    cardeal: 'cardinal',
    fixed: 'fixed',
    fixo: 'fixed',
    mutable: 'mutable',
    mutavel: 'mutable'
  }
  return map[normalized] || null
}

export default function TransitComparisonCard({
  planetComparisons, 
  chartSummary,
  ascendant,
  midheaven,
  natalAscendant,
  natalMidheaven,
  housesCusps,
  natalHousesCusps,
  lifeAreas,
  lifeAreasDebug,
  personalWindows,
  showOverviewHeader = true
}: TransitComparisonCardProps) {
  const { width } = useWindowDimensions()
  const isNarrow = width < 900
  const { personal, statusPersonal } = useTransits(null)
  const { settings } = useUserSettings()
  const [houseSystem, setHouseSystem] = React.useState<HouseSystem>(
    normalizeHouseSystem(settings?.houseSystem || 'whole-sign')
  )

    // Sincronizar quando as configuracoes carregarem/alterarem
  React.useEffect(() => {
    if (settings?.houseSystem) {
      setHouseSystem(normalizeHouseSystem(settings.houseSystem))
    }
  }, [settings?.houseSystem])
  const showApprox = false // placeholder: card nao recebe props de housesApproximate aqui
  const personalByTransitPlanet = React.useMemo(() => {
    const map: Record<string, typeof personal> = {}
    for (const item of personal) {
      if (!map[item.transitPlanet]) map[item.transitPlanet] = []
      ;(map[item.transitPlanet] as any[]).push(item)
    }
    return map
  }, [personal])
  
  // Converter graus para 0-30 por signo
  const formatDegreeInSign = (longitude: number): string => {
    const degreeInSign = longitude % 30
    return `${degreeInSign.toFixed(1)}\u00B0`
  }

  const translatePlanetName = (planetName: string): string => translatePlanetPT(planetName)

  const formatSignLine = React.useCallback((longitude: number, isRetrograde?: boolean): string => {
    const signName = getSignFromDegree(longitude)
    const signSymbol = getSignSymbol(signName)
    return `${formatDegreeInSign(longitude)} ${signSymbol ? `${signSymbol} ` : ''}${signName}${isRetrograde ? ' (Rx)' : ''}`
  }, [])

const translatePlanetTokens = (text: string): string =>
  decodeUnicodeEscapes(String(text || ''))
    .replace(PLANET_TOKEN, (match) => translatePlanetPT(match))
    .replace(/\bdeg\b/gi, '\u00B0')

const replaceEmojiTokens = (value: string): string => {
  return String(value || '')
    .replace(/\u{1F525}/gu, 'Fogo')
    .replace(/\u{1F30D}/gu, 'Terra')
    .replace(/\u{1F4A8}/gu, 'Ar')
    .replace(/\u{1F4A7}/gu, '\u00C1gua')
    .replace(/\u{26A1}/gu, 'Cardeal')
    .replace(/\u{1F512}/gu, 'Fixo')
    .replace(/\u{1F504}/gu, 'Mut\u00E1vel')
}

const sanitizeChangeText = (value: string): string => {
  return replaceEmojiTokens(decodeUnicodeEscapes(String(value || '')))
    .replace(/[\u{1F300}-\u{1FAFF}]/gu, '')
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim()
}


const translateElement = (element: string): string => {
  const translations: Record<string, string> = {
    fire: 'Fogo',
    earth: 'Terra',
    air: 'Ar',
    water: '\u00C1gua',
    fogo: 'Fogo',
    terra: 'Terra',
    ar: 'Ar',
    agua: '\u00C1gua'
  }
  const cleaned = sanitizeChangeText(element)
  const key = normalizeKey(cleaned)
  return translations[key] || cleaned
}

const normalizeElementKey = (value: string): string => normalizeKey(sanitizeChangeText(value))
const normalizeModalityKey = (value: string): string => normalizeKey(sanitizeChangeText(value))
const getElementIconName = (value: string): keyof typeof Ionicons.glyphMap =>
  ELEMENT_ICONS[normalizeElementKey(value)] || FALLBACK_ICON
const getModalityIconName = (value: string): keyof typeof Ionicons.glyphMap =>
  MODALITY_ICONS[normalizeModalityKey(value)] || FALLBACK_ICON

const translateModality = (modality: string): string => {
  const translations: Record<string, string> = {
    cardinal: 'Cardeal',
    fixed: 'Fixo',
    mutable: 'Mut\u00E1vel',
    cardeal: 'Cardeal',
    fixo: 'Fixo',
    mutavel: 'Mut\u00E1vel'
  }
  const decoded = decodeUnicodeEscapes(modality)
  const key = normalizeKey(decoded)
  return translations[key] || decoded
}

const formatStatusLabel = (status: string | null) => {
  if (!status) return ''
  const map: Record<string, string> = {
    excelente: 'Excelente',
    bom: 'Bom',
    neutro: 'Neutro',
    desafiador: 'Desafiador',
    critico: 'Cr\u00EDtico'
  }
  return map[String(status).toLowerCase()] || decodeUnicodeEscapes(status)
}

const formatAreaStatus = (value: string | number | null | undefined) => {
  if (typeof value === 'number') {
    if (value >= 70) return 'Excelente'
    if (value >= 40) return 'Moderado'
    return 'CrÝtico'
  }
  return formatStatusLabel(value || null)
}

const getSignFromDegree = (degree: number): string => {
  const signs = [
    '\u00C1ries', 'Touro', 'G\u00EAmeos', 'C\u00E2ncer', 'Le\u00E3o', 'Virgem',
    'Libra', 'Escorpi\u00E3o', 'Sagit\u00E1rio', 'Capric\u00F3rnio', 'Aqu\u00E1rio', 'Peixes'
  ]
  const signIndex = Math.floor(degree / 30) % 12
  return signs[signIndex]
}

const SIGN_SYMBOLS: Record<string, string> = {
  aries: '♈',
  touro: '♉',
  gemeos: '♊',
  cancer: '♋',
  leao: '♌',
  virgem: '♍',
  libra: '♎',
  escorpiao: '♏',
  sagitario: '♐',
  capricornio: '♑',
  aquario: '♒',
  peixes: '♓',
}

const getSignSymbol = (signName: string): string => {
  return SIGN_SYMBOLS[normalizeKey(signName)] || ''
}

const SIGN_INFO: Record<string, { element: string; modality: string }> = {
  'Áries': { element: 'Fogo', modality: 'Cardeal' },
  'Touro': { element: 'Terra', modality: 'Fixo' },
  'Gêmeos': { element: 'Ar', modality: 'Mutável' },
  'Câncer': { element: 'Água', modality: 'Cardeal' },
  'Leão': { element: 'Fogo', modality: 'Fixo' },
  'Virgem': { element: 'Terra', modality: 'Mutável' },
  'Libra': { element: 'Ar', modality: 'Cardeal' },
  'Escorpião': { element: 'Água', modality: 'Fixo' },
  'Sagitário': { element: 'Fogo', modality: 'Mutável' },
  'Capricórnio': { element: 'Terra', modality: 'Cardeal' },
  'Aquário': { element: 'Ar', modality: 'Fixo' },
  'Peixes': { element: 'Água', modality: 'Mutável' },
}

const NATURAL_HOUSE_SIGNS = [
  'Áries',
  'Touro',
  'Gêmeos',
  'Câncer',
  'Leão',
  'Virgem',
  'Libra',
  'Escorpião',
  'Sagitário',
  'Capricórnio',
  'Aquário',
  'Peixes',
] as const

const translateAspectLabel = (type: string): string => {
  const key = normalizeKey(type)
  const map: Record<string, string> = {
    conjuncao: 'conjun\u00E7\u00E3o',
    conjunction: 'conjun\u00E7\u00E3o',
    sextil: 'sextil',
    sextile: 'sextil',
    quadratura: 'quadratura',
    square: 'quadratura',
    trigono: 'tr\u00EDgono',
    trine: 'tr\u00EDgono',
    oposicao: 'oposi\u00E7\u00E3o',
    opposition: 'oposi\u00E7\u00E3o',
    quincuncio: 'quinc\u00FAncio',
    quincunx: 'quinc\u00FAncio'
  }
  return map[key] || decodeUnicodeEscapes(type)
}
const normalizeAspectKey = (aspect: string): keyof typeof ASPECT_COLORS => {
    const base = aspect
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
    return base as keyof typeof ASPECT_COLORS
  }

  const getAspectColor = (aspect: string): string => {
    return ASPECT_COLORS[normalizeAspectKey(aspect)] || '#6B7280'
  }

  const getAspectIcon = (aspect: string): string => {
    return ASPECT_ICONS[normalizeAspectKey(aspect)] || '\u2022'
  }

  const personalWindowMap = React.useMemo(() => {
    const map = new Map<string, { start?: string; exact?: string; end?: string; days?: number }>()
    if (!personalWindows?.length) return map
    for (const item of personalWindows) {
      const key = `${item.transitPlanet}|${item.type}|${item.natalPlanet}`
      if (item.window) map.set(key, item.window)
    }
    return map
  }, [personalWindows])

  const formatDate = (date: Date | null): string | null => {
    if (!date || Number.isNaN(date.getTime())) return null
    return date.toLocaleDateString('pt-BR')
  }

  const resolveWindowInfo = (
    window: { start?: string; exact?: string; end?: string; days?: number } | undefined
  ): {
    days: number | null
    startLabel: string | null
    endLabel: string | null
    phaseLabel: string | null
    daysToPeak: number | null
  } | null => {
    if (!window) return null
    const startDate = window.start ? new Date(window.start) : null
    const exactDate = window.exact ? new Date(window.exact) : null
    const endDate = window.end ? new Date(window.end) : null
    if (!startDate && !exactDate && !endDate && !window.days) return null
    const now = new Date()
    const toDayStart = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate())
    const daysDiff = (from: Date, to: Date) => Math.max(0, Math.round((toDayStart(to).getTime() - toDayStart(from).getTime()) / 86400000))
    let phaseLabel: string | null = null
    let daysToPeak: number | null = null
    if (exactDate && !Number.isNaN(exactDate.getTime())) {
      const nowDay = toDayStart(now).getTime()
      const exactDay = toDayStart(exactDate).getTime()
      if (nowDay === exactDay) phaseLabel = 'Pico'
      else if (nowDay < exactDay) phaseLabel = 'Em aprox'
      else phaseLabel = 'Afastando'
      daysToPeak = daysDiff(now, exactDate)
    } else if (startDate && !Number.isNaN(startDate.getTime())) {
      phaseLabel = now.getTime() < startDate.getTime() ? 'Em aprox' : 'Afastando'
      daysToPeak = now.getTime() < startDate.getTime() ? daysDiff(now, startDate) : null
    }
    return {
      days: typeof window.days === 'number' ? window.days : null,
      startLabel: formatDate(startDate),
      endLabel: formatDate(endDate),
      phaseLabel,
      daysToPeak
    }
  }

  const formatWindowInline = React.useCallback(
    (windowInfo: {
      days: number | null
      startLabel: string | null
      endLabel: string | null
      phaseLabel: string | null
      daysToPeak: number | null
    } | null) => {
      if (!windowInfo) return 'Em curso'
      const parts: string[] = []
      if (windowInfo.phaseLabel === 'Em aprox') {
        const lead = typeof windowInfo.daysToPeak === 'number' ? windowInfo.daysToPeak : windowInfo.days
        parts.push(`Em aprox${typeof lead === 'number' ? ` (${lead}d)` : ''}`)
      } else if (windowInfo.phaseLabel) {
        parts.push(windowInfo.phaseLabel)
      }
      if (windowInfo.startLabel) parts.push(`Início ${windowInfo.startLabel}`)
      if (windowInfo.endLabel) parts.push(`Fim ${windowInfo.endLabel}`)
      if (windowInfo.phaseLabel === 'Pico') {
        const lead = typeof windowInfo.daysToPeak === 'number' ? windowInfo.daysToPeak : 0
        parts.push(`faltam ${lead} dias`)
      }
      return parts.length ? parts.join(' • ') : 'Em curso'
    },
    []
  )


  // \u00F0\u0178\u008F\u00B7\u00EF\u00B8\u008F Dist\u00C3\u00A2ncia at\u00C3\u00A9 a c\u00C3\u00BAspide mais pr\u00C3\u00B3xima (casas ATUAIS)
  const nearestCuspInfo = React.useCallback((longitude: number): { house: number, distance: number } | null => {
    try {
      if (!housesCusps || housesCusps.length !== 12) return null
      const norm = (d: number) => ((d % 360) + 360) % 360
      const lon = norm(longitude)
      let best: { house: number, distance: number } | null = null
      for (let i = 0; i < 12; i++) {
        const cusp = norm(housesCusps[i])
        const diff = Math.abs(lon - cusp)
        const dist = Math.min(diff, 360 - diff)
        if (!best || dist < best.distance) best = { house: i + 1, distance: dist }
      }
      return best
    } catch {
      return null
    }
  }, [housesCusps])

  const getHouseFromCusps = React.useCallback((longitude: number, cusps?: number[] | null): number | null => {
    try {
      if (!cusps || cusps.length !== 12) return null
      const norm = (d: number) => ((d % 360) + 360) % 360
      const lon = norm(longitude)
      for (let i = 0; i < 12; i++) {
        const start = norm(cusps[i])
        const end = norm(cusps[(i + 1) % 12])
        const inHouse = start < end ? lon >= start && lon < end : lon >= start || lon < end
        if (inHouse) return i + 1
      }
      return 1
    } catch {
      return null
    }
  }, [])

  const getHouseSignInfo = React.useCallback((house: number | null, cusps?: number[] | null) => {
    if (!house || !cusps || cusps.length !== 12) return null
    const cuspDegree = Number(cusps[house - 1])
    if (!Number.isFinite(cuspDegree)) return null
    const sign = getSignFromDegree(cuspDegree)
    const info = SIGN_INFO[sign]
    if (!info) return null
    return { sign, ...info }
  }, [])

  const getNaturalHouseInfo = React.useCallback((house: number | null) => {
    if (!house || house < 1 || house > 12) return null
    const sign = NATURAL_HOUSE_SIGNS[house - 1]
    const info = SIGN_INFO[sign]
    if (!info) return null
    return { sign, ...info }
  }, [])

  const getAreaInfluencesForPlanet = React.useCallback((planetName: string) => {
  if (!lifeAreasDebug || typeof lifeAreasDebug !== 'object') return []
  return Object.entries(lifeAreasDebug)
    .map(([areaKey, data]) => {
      const details = (data as any)?.planetDetails || []
      const planetDetail = details.find((entry: any) => entry.planet === planetName)
      if (!planetDetail) return null

      const statusValue = (lifeAreas as any)?.[areaKey]?.status ?? null
      const statusLabel = formatAreaStatus(statusValue)
      const signScore = Number(planetDetail.signScore || 0)
      const houseScore = Number(planetDetail.houseScore || 0)
      const houseLabel = planetDetail.house ? `Casa ${planetDetail.house}` : null
      const signLabel = planetDetail.sign ? `Signo ${decodeUnicodeEscapes(planetDetail.sign)}` : null

      const houseImpact =
        houseScore >= 65 ? 'relevante' : houseScore <= 35 ? 'pouco relevante' : 'moderada'
      const signImpact =
        signScore >= 70 ? 'dignidade' : signScore <= 35 ? 'debilidade' : 'neutro'

      const conditionTags = Array.isArray(planetDetail.conditions?.tags)
        ? planetDetail.conditions.tags
        : []
      const aspects = Array.isArray(planetDetail.aspects) ? planetDetail.aspects : []
      const isHarmonious = (type: string) => ['trigono', 'sextil'].includes(normalizeKey(type))
      const isChallenging = (type: string) =>
        ['quadratura', 'oposicao', 'quincuncio', 'semiquadratura', 'sesquiquadratura'].includes(normalizeKey(type))
      const isNeutral = (type: string) => normalizeKey(type) === 'conjuncao'

      const harmoniousCount = aspects.filter((a: any) => isHarmonious(a.type)).length
      const challengingCount = aspects.filter((a: any) => isChallenging(a.type)).length
      const neutralCount = aspects.filter((a: any) => isNeutral(a.type)).length

      const reasonLine = [
        houseLabel ? `${houseLabel} (${houseImpact})` : null,
        signLabel ? `${signLabel} (${signImpact})` : null
      ]
        .filter(Boolean)
        .join(' | ')

      const conditionLine = conditionTags.length
        ? `Condiþ§es: ${conditionTags.join(', ')}`
        : null

      const aspectLine = `Aspectos: ${harmoniousCount} harm¶nicos, ${challengingCount} desafiadores${
        neutralCount ? `, ${neutralCount} neutros` : ''
      }`

      return {
        areaKey,
        statusLabel,
        totalScore: Number(planetDetail.total || 0),
        lines: [reasonLine, conditionLine, aspectLine].filter(Boolean)
      }
    })
    .filter(Boolean)
    .sort((a, b) => (b as any).totalScore - (a as any).totalScore)
    .slice(0, 2) as Array<{
      areaKey: string
      statusLabel: string
      totalScore: number
      lines: string[]
    }>
}, [lifeAreasDebug, lifeAreas])

  const confidenceValue = typeof statusPersonal?.confidence === 'number' && Number.isFinite(statusPersonal.confidence)
    ? formatMetricPercent(statusPersonal.confidence)
    : null
  const volatilityValue = typeof statusPersonal?.volatility === 'number' && Number.isFinite(statusPersonal.volatility)
    ? formatMetricPercent(statusPersonal.volatility)
    : null
  const statusMetaLine = [confidenceValue ? `Confiança: ${confidenceValue}` : null, volatilityValue ? `Volatilidade: ${volatilityValue}` : null]
    .filter(Boolean)
    .join(' • ')

  const [detailModalOpen, setDetailModalOpen] = React.useState(false)
  const [detailModalTitle, setDetailModalTitle] = React.useState('')
  const [detailModalSubtitle, setDetailModalSubtitle] = React.useState('')
  const [detailModalShort, setDetailModalShort] = React.useState('')
  const [detailModalLong, setDetailModalLong] = React.useState('')

  React.useEffect(() => {
    try {
      if (typeof window === 'undefined') return
      if (!window.location.search.includes('debug=1')) return
      if (!planetComparisons?.length) return

      const rows = planetComparisons.map((comparison) => {
        const houseTransitOnNatal = getHouseFromCusps(comparison.current.longitude, natalHousesCusps)
        const houseOnCurrentCusps = getHouseFromCusps(comparison.current.longitude, housesCusps)
        return {
          planeta: translatePlanetName(comparison.name),
          longitudeAtual: Number(comparison.current.longitude?.toFixed?.(3) || comparison.current.longitude),
          casaComparativoNatal: houseTransitOnNatal ?? '-',
          casaColetivoViaComparacao: comparison.current.house ?? '-',
          casaColetivoRecalculada: houseOnCurrentCusps ?? '-',
          alinhadoColetivo:
            (comparison.current.house ?? null) === (houseOnCurrentCusps ?? null) ? 'sim' : 'nao',
        }
      })

      console.group('ASTRO DEBUG - Validacao casas (Transito c/Natal x Coletivo)')
      console.table(rows)
      console.groupEnd()
    } catch (error) {
      console.warn('ASTRO DEBUG - Falha ao validar casas por planeta', error)
    }
  }, [planetComparisons, housesCusps, natalHousesCusps, getHouseFromCusps])

  const openDetailModal = React.useCallback((params: {
    title: string
    subtitle?: string
    short: string
    long: string
  }) => {
    setDetailModalTitle(params.title)
    setDetailModalSubtitle(params.subtitle || '')
    setDetailModalShort(params.short)
    setDetailModalLong(params.long)
    setDetailModalOpen(true)
  }, [])

  const renderAttributeChips = React.useCallback((
    element?: string | null,
    modality?: string | null
  ) => {
    if (!element && !modality) return null
    return (
      <View style={styles.attributesRow}>
        {element ? (
          <View style={styles.attributeChip}>
            <Ionicons name={getElementIconName(element)} size={12} color="#FFD700" />
            <Text style={styles.attributeChipText}>{translateElement(element)}</Text>
          </View>
        ) : null}
        {modality ? (
          <View style={styles.attributeChip}>
            <Ionicons name={getModalityIconName(modality)} size={12} color="#FFD700" />
            <Text style={styles.attributeChipText}>{translateModality(modality)}</Text>
          </View>
        ) : null}
      </View>
    )
  }, [])

  const houseBasedCounts = React.useMemo(() => {
    const emptyElements = { fire: 0, earth: 0, air: 0, water: 0 }
    const emptyModalities = { cardinal: 0, fixed: 0, mutable: 0 }
    const result = {
      natal: { elements: { ...emptyElements }, modalities: { ...emptyModalities } },
      current: { elements: { ...emptyElements }, modalities: { ...emptyModalities } },
    }

    for (const comparison of planetComparisons || []) {
      const natalNatural = getNaturalHouseInfo(comparison.natal.house)
      const currentNatural = getNaturalHouseInfo(comparison.current.house)

      const natalElementKey = toCanonicalElementKey(natalNatural?.element || '')
      const natalModalityKey = toCanonicalModalityKey(natalNatural?.modality || '')
      const currentElementKey = toCanonicalElementKey(currentNatural?.element || '')
      const currentModalityKey = toCanonicalModalityKey(currentNatural?.modality || '')

      if (natalElementKey && natalElementKey in result.natal.elements) {
        ;(result.natal.elements as any)[natalElementKey] += 1
      }
      if (natalModalityKey && natalModalityKey in result.natal.modalities) {
        ;(result.natal.modalities as any)[natalModalityKey] += 1
      }
      if (currentElementKey && currentElementKey in result.current.elements) {
        ;(result.current.elements as any)[currentElementKey] += 1
      }
      if (currentModalityKey && currentModalityKey in result.current.modalities) {
        ;(result.current.modalities as any)[currentModalityKey] += 1
      }
    }

    return result
  }, [planetComparisons, getNaturalHouseInfo])

  const getSignCounts = React.useCallback(
    (
      source: Record<string, number>,
      kind: 'element' | 'modality'
    ): Record<string, number> => {
      const base =
        kind === 'element'
          ? { fire: 0, earth: 0, air: 0, water: 0 }
          : { cardinal: 0, fixed: 0, mutable: 0 }
      for (const [key, rawValue] of Object.entries(source || {})) {
        const canonical =
          kind === 'element'
            ? toCanonicalElementKey(key)
            : toCanonicalModalityKey(key)
        if (!canonical) continue
        ;(base as any)[canonical] += Number(rawValue) || 0
      }
      return base
    },
    []
  )

  const buildWeightedRows = React.useCallback(
    (
      signCounts: Record<string, number>,
      houseCounts: Record<string, number>,
      keys: readonly string[]
    ) => {
      return keys.map((key) => {
        const signs = Number((signCounts as any)[key] || 0)
        const houses = Number((houseCounts as any)[key] || 0)
        const weighted = signs * SIGN_WEIGHT + houses * HOUSE_WEIGHT
        return { key, signs, houses, weighted }
      })
    },
    []
  )

  const buildColumnInterpretation = React.useCallback((params: {
    planet: string
    contextLabel: string
    signLabel: string
    signElement: string
    signModality: string
    house: number | null
    houseByCusp?: { sign: string; element: string; modality: string } | null
    houseNatural?: { sign: string; element: string; modality: string } | null
  }) => {
    const houseLabel = params.house ? `Casa ${params.house}` : 'Casa indefinida'
    const short = `${params.planet} em ${params.signLabel} (${params.signElement}/${params.signModality}) atuando em ${houseLabel}.`
    const long =
      `${params.contextLabel} integra três camadas: planeta, signo e casa.\n\n` +
      `Planeta + signo: ${params.planet} em ${params.signLabel} indica expressão por ${params.signElement} e modo ${params.signModality}.\n\n` +
      `Casa ativada: ${houseLabel}.` +
      `${params.houseByCusp ? ` Casa por cúspide (cálculo): ${params.houseByCusp.sign} (${params.houseByCusp.element}/${params.houseByCusp.modality}).` : ''}` +
      `${params.houseNatural ? ` Casa natural (arquétipo): ${params.houseNatural.sign} (${params.houseNatural.element}/${params.houseNatural.modality}).` : ''}\n\n` +
      `Síntese prática: leia este ponto como junção de estilo (signo) + tema (casa) + função (planeta), priorizando decisões que combinem ritmo e contexto real do momento.`
    return { short, long }
  }, [])

  const buildAspectReading = React.useCallback((params: {
    planet: string
    aspectType: string
    targetLabel: string
    house?: number | null
    days?: number | null
    phase?: string | null
    scope: 'pessoal' | 'coletivo' | 'casa'
  }) => {
    const keyword = PLANET_KEYWORDS[params.planet] || 'dinâmica central'
    const houseFocus = params.house ? HOUSE_FOCUS[params.house] || `temas da Casa ${params.house}` : 'contexto atual'
    const aspectKey = normalizeAspectKey(params.aspectType)
    const constructive = aspectKey === 'trigono' || aspectKey === 'sextil'
    const intense = aspectKey === 'quadratura' || aspectKey === 'oposicao' || aspectKey === 'quincuncio'
    const tone = constructive
      ? 'janela favorável para avanço com consistência'
      : intense
      ? 'tensão produtiva pedindo ajuste de rota'
      : 'movimento de recalibração gradual'
    const windowLabel = params.days ? `em uma janela de cerca de ${params.days} dias` : 'neste ciclo'
    const phaseLabel = params.phase ? ` Fase atual: ${params.phase}.` : ''
    const scopeLabel =
      params.scope === 'pessoal'
        ? 'No plano pessoal,'
        : params.scope === 'coletivo'
        ? 'No plano coletivo,'
        : 'No eixo de casas,'

    return {
      short: `${scopeLabel} ${params.planet} ativa ${keyword} em ${houseFocus}: ${tone}.`,
      long:
        `${params.planet} em ${translateAspectLabel(params.aspectType)} com ${params.targetLabel} ` +
        `organiza foco em ${houseFocus}. ${tone} ${windowLabel}.${phaseLabel} ` +
        `Leitura prática: converta essa tendência em uma decisão pequena, clara e executável para evitar dispersão.`
    }
  }, [])

  const elementSignCounts = React.useMemo(
    () => ({
      natal: getSignCounts(chartSummary.elemental.natal as Record<string, number>, 'element'),
      current: getSignCounts(chartSummary.elemental.current as Record<string, number>, 'element')
    }),
    [chartSummary.elemental.current, chartSummary.elemental.natal, getSignCounts]
  )

  const modalitySignCounts = React.useMemo(
    () => ({
      natal: getSignCounts(chartSummary.modality.natal as Record<string, number>, 'modality'),
      current: getSignCounts(chartSummary.modality.current as Record<string, number>, 'modality')
    }),
    [chartSummary.modality.current, chartSummary.modality.natal, getSignCounts]
  )

  const weightedElementRows = React.useMemo(
    () => ({
      natal: buildWeightedRows(elementSignCounts.natal, houseBasedCounts.natal.elements, ELEMENT_KEYS),
      current: buildWeightedRows(elementSignCounts.current, houseBasedCounts.current.elements, ELEMENT_KEYS)
    }),
    [buildWeightedRows, elementSignCounts.current, elementSignCounts.natal, houseBasedCounts.current.elements, houseBasedCounts.natal.elements]
  )

  const weightedModalityRows = React.useMemo(
    () => ({
      natal: buildWeightedRows(modalitySignCounts.natal, houseBasedCounts.natal.modalities, MODALITY_KEYS),
      current: buildWeightedRows(modalitySignCounts.current, houseBasedCounts.current.modalities, MODALITY_KEYS)
    }),
    [buildWeightedRows, modalitySignCounts.current, modalitySignCounts.natal, houseBasedCounts.current.modalities, houseBasedCounts.natal.modalities]
  )

  const renderBalanceColumns = React.useCallback((params: {
    periodLabel: string
    signRows: Array<{ key: string; signs: number; houses: number; weighted: number }>
    kind: 'element' | 'modality'
  }) => {
    const predominant = params.signRows.reduce((acc, item) => {
      if (!acc || item.weighted > acc.weighted) return item
      return acc
    }, null as null | { key: string; signs: number; houses: number; weighted: number })

    const labelFn = params.kind === 'element' ? translateElement : translateModality
    const iconFn =
      params.kind === 'element'
        ? (k: string) => getElementIconName(k)
        : (k: string) => getModalityIconName(k)

    return (
      <View style={styles.balanceCard}>
        <Text style={styles.comparisonLabel}>{params.periodLabel}</Text>
        <View style={styles.balanceColumns}>
          <View style={styles.balanceColumn}>
            <Text style={styles.balanceColumnTitle}>Signos</Text>
            {params.signRows.map((row) => (
              <View key={`${params.periodLabel}-sign-${row.key}`} style={styles.balanceRowItem}>
                <Ionicons name={iconFn(row.key)} size={12} color="#FFD700" />
                <Text style={styles.balanceRowText}>{labelFn(row.key)} {row.signs}</Text>
              </View>
            ))}
          </View>
          <View style={styles.balanceColumn}>
            <Text style={styles.balanceColumnTitle}>Casas</Text>
            {params.signRows.map((row) => (
              <View key={`${params.periodLabel}-house-${row.key}`} style={styles.balanceRowItem}>
                <Ionicons name={iconFn(row.key)} size={12} color="#FFD700" />
                <Text style={styles.balanceRowText}>{labelFn(row.key)} {row.houses}</Text>
              </View>
            ))}
          </View>
          <View style={styles.balanceColumn}>
            <Text style={styles.balanceColumnTitle}>Balanço</Text>
            {params.signRows.map((row) => (
              <View key={`${params.periodLabel}-balance-${row.key}`} style={styles.balanceRowItem}>
                <Ionicons name={iconFn(row.key)} size={12} color={predominant?.key === row.key ? '#34D399' : '#FFD700'} />
                <Text style={[styles.balanceRowText, predominant?.key === row.key ? styles.balanceRowTextPredominant : null]}>
                  {labelFn(row.key)} {row.weighted.toFixed(1)}
                </Text>
              </View>
            ))}
            {predominant ? (
              <Text style={styles.balancePredominantText}>
                Predominante: {labelFn(predominant.key)}
              </Text>
            ) : null}
          </View>
        </View>
      </View>
    )
  }, [])

  return (
    <LinearGradient
      colors={['#1E1E2E', '#2A2A3E']}
      style={styles.container}
    >
      {showOverviewHeader ? (
        <>
          <View style={styles.cardHeader}>
            <Ionicons name="swap-horizontal" size={18} color="#FFD700" />
            <Text style={styles.cardTitle}>Visão geral do período</Text>
          </View>
          {statusPersonal ? (
            <View style={{ marginBottom: 8 }}>
              <Text style={{ color: '#fff', opacity: 0.9 }}>
                Status pessoal: {formatStatusLabel(statusPersonal.level)} ({statusPersonal.score}%)
              </Text>
              {statusMetaLine ? (
                <Text style={{ color: '#fff', opacity: 0.72, fontSize: 12 }}>{statusMetaLine}</Text>
              ) : null}
            </View>
          ) : null}
        </>
      ) : null}

      {/* Compara\u00E7\u00F5es Planet\u00E1rias */}
      <View style={styles.planetsSection}>
        <View style={styles.sectionHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="planet" size={20} color="#FFD700" />
            <Text style={styles.sectionTitle}>Tábula Estelar</Text>
          </View>
          <View style={styles.systemBadge}>
            <Text style={styles.systemBadgeText}>{formatHouseSystemLabel(houseSystem)}</Text>
          </View>
        </View>

        {planetComparisons.map((comparison) => (
          <View key={comparison.name} style={styles.planetCard}>
            {/* Cabe\u00E7alho do Planeta */}
            <View style={styles.planetHeader}>
              <Text style={styles.planetName}>
                {(PLANET_ICONS[comparison.name] || '?')} {translatePlanetName(comparison.name)}
              </Text>
            </View>

            {/* Comparacao em 3 colunas: Natal | Transito c/ Natal | Posicao Atual */}
            <View style={styles.comparisonGrid}>
              {(() => {
                const natalHouseInfo = getHouseSignInfo(comparison.natal.house, natalHousesCusps)
                const currentHouseInfo = getHouseSignInfo(comparison.current.house, housesCusps)
                const transitOnNatalHouse = getHouseFromCusps(comparison.current.longitude, natalHousesCusps)
                const transitOnNatalInfo = getHouseSignInfo(transitOnNatalHouse, natalHousesCusps)
                const natalNaturalInfo = getNaturalHouseInfo(comparison.natal.house)
                const transitOnNatalNaturalInfo = getNaturalHouseInfo(transitOnNatalHouse)
                const currentNaturalInfo = getNaturalHouseInfo(comparison.current.house)
                return (
                  <>
                    <TouchableOpacity
                      activeOpacity={0.86}
                      style={styles.comparisonColumn}
                      onPress={() => {
                        const signLabel = getSignFromDegree(comparison.natal.longitude)
                        const interp = buildColumnInterpretation({
                          planet: translatePlanetName(comparison.name),
                          contextLabel: 'Leitura Natal',
                          signLabel,
                          signElement: translateElement(comparison.natal.element),
                          signModality: translateModality(comparison.natal.modality),
                          house: comparison.natal.house,
                          houseByCusp: natalHouseInfo,
                          houseNatural: natalNaturalInfo,
                        })
                        openDetailModal({
                          title: `${translatePlanetName(comparison.name)} • Natal`,
                          subtitle: `${signLabel} • Casa ${comparison.natal.house}`,
                          short: interp.short,
                          long: interp.long,
                        })
                      }}
                    >
                      <Text style={styles.columnTitle}>Natal</Text>
                      <Text style={styles.metricLineStrong}>
                        {formatSignLine(comparison.natal.longitude)}
                      </Text>
                      {renderAttributeChips(comparison.natal.element, comparison.natal.modality)}
                      <Text style={styles.metricLineStrong}>
                        Casa {comparison.natal.house}
                      </Text>
                      {renderAttributeChips(natalNaturalInfo?.element || null, natalNaturalInfo?.modality || null)}
                    </TouchableOpacity>

                    <TouchableOpacity
                      activeOpacity={0.86}
                      style={styles.comparisonColumn}
                      onPress={() => {
                        const signLabel = getSignFromDegree(comparison.current.longitude)
                        const interp = buildColumnInterpretation({
                          planet: translatePlanetName(comparison.name),
                          contextLabel: 'Leitura Trânsito Pessoal',
                          signLabel,
                          signElement: translateElement(comparison.current.element),
                          signModality: translateModality(comparison.current.modality),
                          house: transitOnNatalHouse,
                          houseByCusp: transitOnNatalInfo,
                          houseNatural: transitOnNatalNaturalInfo,
                        })
                        openDetailModal({
                          title: `${translatePlanetName(comparison.name)} • Trânsito Pessoal`,
                          subtitle: `${signLabel} • Casa ${transitOnNatalHouse || '-'}`,
                          short: interp.short,
                          long: interp.long,
                        })
                      }}
                    >
                      <Text style={styles.columnTitle}>Trânsito Pessoal</Text>
                      <Text style={styles.metricLineStrong}>
                        {formatSignLine(comparison.current.longitude, comparison.current.isRetrograde)}
                      </Text>
                      {renderAttributeChips(comparison.current.element, comparison.current.modality)}
                      <Text style={styles.metricLineStrong}>
                        Casa {transitOnNatalHouse || '-'}
                      </Text>
                      {renderAttributeChips(transitOnNatalNaturalInfo?.element || null, transitOnNatalNaturalInfo?.modality || null)}
                    </TouchableOpacity>

                    <TouchableOpacity
                      activeOpacity={0.86}
                      style={styles.comparisonColumn}
                      onPress={() => {
                        const signLabel = getSignFromDegree(comparison.current.longitude)
                        const interp = buildColumnInterpretation({
                          planet: translatePlanetName(comparison.name),
                          contextLabel: 'Leitura Trânsito Coletivo',
                          signLabel,
                          signElement: translateElement(comparison.current.element),
                          signModality: translateModality(comparison.current.modality),
                          house: comparison.current.house,
                          houseByCusp: currentHouseInfo,
                          houseNatural: currentNaturalInfo,
                        })
                        openDetailModal({
                          title: `${translatePlanetName(comparison.name)} • Trânsito Coletivo`,
                          subtitle: `Casa ${comparison.current.house}`,
                          short: interp.short,
                          long: interp.long,
                        })
                      }}
                    >
                      <Text style={styles.columnTitle}>Trânsito Coletivo</Text>
                      <Text style={styles.metricLineStrong}>
                        {formatSignLine(comparison.current.longitude, comparison.current.isRetrograde)}
                      </Text>
                      {renderAttributeChips(comparison.current.element, comparison.current.modality)}
                      <Text style={styles.metricLineStrong}>
                        Casa {comparison.current.house}
                      </Text>
                      {renderAttributeChips(currentNaturalInfo?.element || null, currentNaturalInfo?.modality || null)}
                      {(() => {
                        const info = nearestCuspInfo(comparison.current.longitude)
                        if (info && info.distance <= 0.5) {
                          return (
                            <Text style={styles.nearCuspChip}>{`próx. cúspide ${info.house} (${info.distance.toFixed(2)}°)`}</Text>
                          )
                        }
                        return null
                      })()}
                    </TouchableOpacity>
                  </>
                )
              })()}
            </View>

                        {/* Transitos pessoais para este planeta em transito */}
            {(personalByTransitPlanet[comparison.name]?.length ?? 0) > 0 && (
              <View style={styles.aspectsSection}>
                <Text style={styles.aspectsTitle}>Transitos pessoais:</Text>
                {personalByTransitPlanet[comparison.name].map((t, idx) => {
                  const key = `${t.transitPlanet}|${t.type}|${t.natalPlanet}`
                  const windowInfo = resolveWindowInfo((t as any).window || personalWindowMap.get(key))
                  const reading = buildAspectReading({
                    planet: t.transitPlanet,
                    aspectType: t.type,
                    targetLabel: translatePlanetName(t.natalPlanet),
                    house: comparison.current.house,
                    days: windowInfo?.days || null,
                    phase: windowInfo?.phaseLabel || null,
                    scope: 'pessoal'
                  })
                  return (
                    <View key={idx} style={styles.aspectItem}>
                      <Text style={[styles.aspectIcon, { color: getAspectColor(t.type) }]}>{getAspectIcon(t.type)}</Text>
                      <Pressable
                        style={({ hovered, pressed }) => [
                          styles.aspectBodyInteractive,
                          hovered && styles.aspectBodyInteractiveHovered,
                          pressed && styles.aspectBodyInteractivePressed
                        ]}
                        onPress={() =>
                          openDetailModal({
                            title: `${translatePlanetName(t.transitPlanet)} ${translateAspectLabel(t.type)} ${translatePlanetName(t.natalPlanet)}`,
                            subtitle: `Trânsito pessoal • ${translatePlanetName(comparison.name)}`,
                            short: reading.short,
                            long: reading.long,
                          })
                        }
                      >
                        <View style={styles.aspectLine}>
                          <Text style={styles.aspectText}>
                            {translatePlanetName(t.transitPlanet)} {translateAspectLabel(t.type)} {translatePlanetName(t.natalPlanet)}
                          </Text>
                        </View>
                        <View style={styles.aspectActionsRow}>
                          <Text style={styles.aspectMetaInline}>{formatWindowInline(windowInfo)}</Text>
                          <Ionicons name="book-outline" size={16} color="#CBD5E1" />
                        </View>
                      </Pressable>
                    </View>
                  )
                })}
              </View>
            )}
            {/* Aspectos coletivos do momento para este planeta */}
            {comparison.planetaryAspects.length > 0 && (
              <View style={styles.aspectsSection}>
                <Text style={styles.aspectsTitle}>Aspectos coletivos:</Text>
                {comparison.planetaryAspects.map((aspect, aspectIndex) => {
                  const windowInfo = resolveWindowInfo((aspect as any).window)
                  const reading = buildAspectReading({
                    planet: aspect.planet1,
                    aspectType: aspect.type,
                    targetLabel: translatePlanetName(aspect.planet2),
                    house: comparison.current.house,
                    days: windowInfo?.days || null,
                    phase: windowInfo?.phaseLabel || null,
                    scope: 'coletivo'
                  })
                  return (
                    <View key={aspectIndex} style={styles.aspectItem}>
                      <Text style={[styles.aspectIcon, { color: getAspectColor(aspect.type) }]}>{getAspectIcon(aspect.type)}</Text>
                      <Pressable
                        style={({ hovered, pressed }) => [
                          styles.aspectBodyInteractive,
                          hovered && styles.aspectBodyInteractiveHovered,
                          pressed && styles.aspectBodyInteractivePressed
                        ]}
                        onPress={() =>
                          openDetailModal({
                            title: `${translatePlanetName(aspect.planet1)} ${translateAspectLabel(aspect.type)} ${translatePlanetName(aspect.planet2)}`,
                            subtitle: `Aspecto coletivo • ${translatePlanetName(comparison.name)}`,
                            short: reading.short,
                            long: reading.long,
                          })
                        }
                      >
                        <View style={styles.aspectLine}>
                          <Text style={styles.aspectText}>
                            {translatePlanetName(aspect.planet1)} {translateAspectLabel(aspect.type)} {translatePlanetName(aspect.planet2)}
                          </Text>
                        </View>
                        <View style={styles.aspectActionsRow}>
                          <Text style={styles.aspectMetaInline}>{formatWindowInline(windowInfo)}</Text>
                          <Ionicons name="book-outline" size={16} color="#CBD5E1" />
                        </View>
                      </Pressable>
                    </View>
                  )
                })}
              </View>
            )}
            {/* Aspectos com casas */}
            {comparison.houseAspects.length > 0 && (
              <View style={styles.aspectsSection}>
                <Text style={styles.aspectsTitle}>Aspectos com casas:</Text>
                {comparison.houseAspects.slice(0, 2).map((houseAspect, houseIndex) => {
                  const windowInfo = resolveWindowInfo((houseAspect as any).window)
                  const reading = buildAspectReading({
                    planet: comparison.name,
                    aspectType: houseAspect.aspect,
                    targetLabel: `Casa ${houseAspect.house} (${houseAspect.meaning})`,
                    house: houseAspect.house,
                    days: windowInfo?.days || null,
                    phase: windowInfo?.phaseLabel || null,
                    scope: 'casa'
                  })
                  return (
                    <View key={houseIndex} style={styles.aspectItem}>
                      <Text style={[styles.aspectIcon, { color: getAspectColor(houseAspect.aspect) }]}>{getAspectIcon(houseAspect.aspect)}</Text>
                      <Pressable
                        style={({ hovered, pressed }) => [
                          styles.aspectBodyInteractive,
                          hovered && styles.aspectBodyInteractiveHovered,
                          pressed && styles.aspectBodyInteractivePressed
                        ]}
                        onPress={() =>
                          openDetailModal({
                            title: `Casa ${houseAspect.house} • ${houseAspect.meaning}`,
                            subtitle: `Aspecto com casa • ${translatePlanetName(comparison.name)}`,
                            short: reading.short,
                            long: reading.long,
                          })
                        }
                      >
                        <View style={styles.aspectLine}>
                          <Text style={styles.aspectText}>Casa {houseAspect.house} - {houseAspect.meaning}</Text>
                        </View>
                        <View style={styles.aspectActionsRow}>
                          <Text style={styles.aspectMetaInline}>{formatWindowInline(windowInfo)}</Text>
                          <Ionicons name="book-outline" size={16} color="#CBD5E1" />
                        </View>
                      </Pressable>
                    </View>
                  )
                })}
              </View>
            )}
          </View>
        ))}
      </View>

      <Modal
        visible={detailModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setDetailModalOpen(false)}
      >
        <View style={styles.detailModalBackdrop}>
          <View style={[styles.detailModalCard, isNarrow ? styles.detailModalCardNarrow : styles.detailModalCardWide]}>
            <View style={styles.detailModalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.detailModalTitle}>{detailModalTitle}</Text>
                {detailModalSubtitle ? <Text style={styles.detailModalSubtitle}>{detailModalSubtitle}</Text> : null}
              </View>
              <TouchableOpacity onPress={() => setDetailModalOpen(false)} style={styles.detailCloseIcon}>
                <Ionicons name="close" size={20} color="#0A1633" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.detailModalScroll} showsVerticalScrollIndicator={false}>
              <Text style={styles.detailSectionLabel}>Frase-chave</Text>
              <Text style={styles.detailBody}>{detailModalShort}</Text>
              <Text style={styles.detailSectionLabel}>Interpretação completa</Text>
              <Text style={styles.detailBody}>{detailModalLong}</Text>
            </ScrollView>
            <TouchableOpacity style={styles.detailModalButton} onPress={() => setDetailModalOpen(false)}>
              <Text style={styles.detailModalButtonText}>Fechar leitura</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Resumo da carta (após planetas) */}
      <View style={styles.summarySection}>
        <View style={styles.sectionHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="analytics" size={20} color="#FFD700" />
            <Text style={styles.sectionTitle}>Resumo da Carta</Text>
            {showApprox ? <Text style={{ color: '#FFD700', marginLeft: 8, fontSize: 12 }}>aprox</Text> : null}
          </View>
        </View>

        <View style={styles.analysisRow}>
          <Text style={styles.analysisLabel}>Elementos (Signos | Casas | Balanço):</Text>
          <View style={styles.balanceGrid}>
            {renderBalanceColumns({
              periodLabel: 'Natal',
              signRows: weightedElementRows.natal,
              kind: 'element'
            })}
            {renderBalanceColumns({
              periodLabel: 'Atual',
              signRows: weightedElementRows.current,
              kind: 'element'
            })}
          </View>
        </View>

        <View style={styles.analysisRow}>
          <Text style={styles.analysisLabel}>Modalidades (Signos | Casas | Balanço):</Text>
          <View style={styles.balanceGrid}>
            {renderBalanceColumns({
              periodLabel: 'Natal',
              signRows: weightedModalityRows.natal,
              kind: 'modality'
            })}
            {renderBalanceColumns({
              periodLabel: 'Atual',
              signRows: weightedModalityRows.current,
              kind: 'modality'
            })}
          </View>
        </View>
      </View>
    </LinearGradient>
  )
}

function formatMetricPercent(value: number | null | undefined): string {
  if (typeof value !== 'number' || Number.isNaN(value)) return '--'
  return `${Math.round(value * 100)}%`
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  summarySection: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  analysisRow: {
    marginBottom: 12,
  },
  analysisLabel: {
    color: '#E2E8F0',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  balanceGrid: {
    gap: 8,
  },
  balanceCard: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 10,
  },
  balanceColumns: {
    flexDirection: 'row',
    gap: 8,
  },
  balanceColumn: {
    flex: 1,
    minWidth: 0,
  },
  balanceColumnTitle: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  balanceRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  balanceRowText: {
    color: '#E2E8F0',
    fontSize: 11,
    marginLeft: 4,
  },
  balanceRowTextPredominant: {
    color: '#34D399',
    fontWeight: '700',
  },
  balancePredominantText: {
    color: '#34D399',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 4,
  },
  elementalGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  elementalComparison: {
    flex: 1,
    marginHorizontal: 4,
  },
  comparisonLabel: {
    color: '#A0A0A0',
    fontSize: 12,
    marginBottom: 4,
  },
  elementalRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  elementalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
    marginBottom: 2,
  },
  elementalItemText: {
    color: '#FFFFFF',
    fontSize: 12,
    marginLeft: 4,
  },
  elementalItemMeta: {
    color: '#94A3B8',
    fontSize: 10,
  },
  planetsSection: {
    flex: 1,
  },
  planetCard: {
    backgroundColor: 'rgba(42, 42, 62, 0.6)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FFD700',
  },
  planetHeader: {
    marginBottom: 12,
  },
  planetName: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: 'bold',
  },
  comparisonGrid: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  comparisonColumn: {
    width: '31.5%',
    minWidth: 0,
    paddingHorizontal: 5,
    paddingVertical: 6,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    marginBottom: 8,
  },
  columnTitle: {
    color: '#A0A0A0',
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  metricLine: {
    color: '#E2E8F0',
    fontSize: 12,
    marginBottom: 6,
    lineHeight: 16,
  },
  metricLineStrong: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },
  metricHint: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 4,
  },
  positionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  houseText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  speedText: {
    color: '#10B981',
    fontSize: 12,
    marginBottom: 8,
  },
  attributesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  attributeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 4,
    marginBottom: 2,
  },
  attributeChipText: {
    color: '#FFFFFF',
    fontSize: 10,
    marginLeft: 4,
  },
  aspectsSection: {
    marginTop: 12,
  },
  aspectsTitle: {
    color: '#FCD34D',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  influenceRow: {
    marginBottom: 8,
  },
  influenceArea: {
    color: '#FDE68A',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  influenceText: {
    color: '#E2E8F0',
    fontSize: 11,
    marginLeft: 2,
    marginBottom: 2,
  },
  systemBadge: {
    borderRadius: 8,
    backgroundColor: 'rgba(255,215,0,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  systemBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  nearCuspChip: {
    marginLeft: 8,
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    color: '#FFD700',
    fontSize: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  aspectItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  aspectIcon: {
    fontSize: 16,
    marginRight: 8,
    width: 20,
    textAlign: 'center',
  },
  aspectBody: {
    flex: 1,
  },
  aspectBodyInteractive: {
    flex: 1,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'transparent',
    backgroundColor: 'rgba(255,255,255,0.01)',
  },
  aspectBodyInteractiveHovered: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderColor: 'rgba(252, 211, 77, 0.35)',
  },
  aspectBodyInteractivePressed: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderColor: 'rgba(252, 211, 77, 0.55)',
  },
  aspectLine: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  aspectText: {
    color: '#FFFFFF',
    fontSize: 12,
    flex: 1,
  },
  aspectMetaInline: {
    color: '#94A3B8',
    fontSize: 11,
    marginRight: 8,
  },
  aspectActionsRow: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  readButtonText: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '700',
  },
  detailModalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 14,
  },
  detailModalCard: {
    backgroundColor: '#ECE9E1',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D9C07A',
    maxHeight: '88%',
    width: '100%',
  },
  detailModalCardNarrow: {
    maxWidth: 620,
  },
  detailModalCardWide: {
    maxWidth: 840,
  },
  detailModalHeader: {
    backgroundColor: '#ECE9E1',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  detailCloseIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#EFF3FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailModalTitle: {
    color: '#0A1633',
    fontSize: 24,
    fontWeight: '800',
  },
  detailModalSubtitle: {
    color: '#A85A12',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 4,
  },
  detailModalScroll: {
    backgroundColor: '#F6F7F9',
    borderTopWidth: 1,
    borderTopColor: '#D9C07A',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  detailSectionLabel: {
    color: '#A85A12',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 8,
    marginTop: 6,
  },
  detailBody: {
    color: '#1F334F',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 10,
  },
  detailModalButton: {
    margin: 16,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#081A45',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailModalButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },
  // \u00F0\u0178\u017D\u00AF ESTILOS PARA ASCENDENTE E MEIO DO C\u00C3\u2030U
  anglesSection: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  angleCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  angleHeader: {
    marginBottom: 8,
  },
  angleName: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  angleComparison: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  angleColumn: {
    flex: 1,
    alignItems: 'center',
  },
  angleLabel: {
    color: '#CCCCCC',
    fontSize: 12,
    marginBottom: 4,
  },
  angleDegree: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  angleSign: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '600',
  },
  angleArrow: {
    color: '#FFD700',
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 16,
  },
  // \u00F0\u0178\u0152\u0152 Estilos das casas removidos (n\u00C3\u00A3o implementadas)
})






































































