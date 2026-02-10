import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, useWindowDimensions } from 'react-native'
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
    window: { start?: string; end?: string; days?: number } | undefined
  ): { days: number | null; startLabel: string | null; endLabel: string | null } | null => {
    if (!window) return null
    const startDate = window.start ? new Date(window.start) : null
    const endDate = window.end ? new Date(window.end) : null
    if (!startDate && !endDate && !window.days) return null
    return {
      days: typeof window.days === 'number' ? window.days : null,
      startLabel: formatDate(startDate),
      endLabel: formatDate(endDate)
    }
  }


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
                const currentSignLine = `${formatDegreeInSign(comparison.current.longitude)} ${getSignFromDegree(comparison.current.longitude)} ${translateElement(comparison.current.element)} ${translateModality(comparison.current.modality)}${comparison.current.isRetrograde ? ' (Rx)' : ''}`
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
                      <Text style={styles.metricLine}>
                        {formatDegreeInSign(comparison.natal.longitude)} {getSignFromDegree(comparison.natal.longitude)}
                      </Text>
                      {renderAttributeChips(comparison.natal.element, comparison.natal.modality)}
                      <Text style={styles.metricLineStrong}>
                        Casa {comparison.natal.house}
                      </Text>
                      {renderAttributeChips(natalNaturalInfo?.element || null, natalNaturalInfo?.modality || null)}
                      <Text style={styles.metricHint}>
                        Casa por cúspide (cálculo): {natalHouseInfo?.sign || '-'} • {natalHouseInfo?.element || '-'} {natalHouseInfo?.modality || '-'}
                      </Text>
                      <Text style={styles.metricHint}>
                        Casa natural (arquétipo): {natalNaturalInfo?.sign || '-'} • {natalNaturalInfo?.element || '-'} {natalNaturalInfo?.modality || '-'}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      activeOpacity={0.86}
                      style={styles.comparisonColumn}
                      onPress={() => {
                        const signLabel = getSignFromDegree(comparison.current.longitude)
                        const interp = buildColumnInterpretation({
                          planet: translatePlanetName(comparison.name),
                          contextLabel: 'Leitura Trânsito c/ Natal',
                          signLabel,
                          signElement: translateElement(comparison.current.element),
                          signModality: translateModality(comparison.current.modality),
                          house: transitOnNatalHouse,
                          houseByCusp: transitOnNatalInfo,
                          houseNatural: transitOnNatalNaturalInfo,
                        })
                        openDetailModal({
                          title: `${translatePlanetName(comparison.name)} • Trânsito c/ Natal`,
                          subtitle: `${signLabel} • Casa ${transitOnNatalHouse || '-'}`,
                          short: interp.short,
                          long: interp.long,
                        })
                      }}
                    >
                      <Text style={styles.columnTitle}>Trânsito c/ Natal</Text>
                      <Text style={styles.metricLine}>
                        {formatDegreeInSign(comparison.current.longitude)} {getSignFromDegree(comparison.current.longitude)}{comparison.current.isRetrograde ? ' (Rx)' : ''}
                      </Text>
                      {renderAttributeChips(comparison.current.element, comparison.current.modality)}
                      <Text style={styles.metricLineStrong}>
                        Casa {transitOnNatalHouse || '-'}
                      </Text>
                      {renderAttributeChips(transitOnNatalNaturalInfo?.element || null, transitOnNatalNaturalInfo?.modality || null)}
                      <Text style={styles.metricHint}>
                        Casa por cúspide (cálculo): {transitOnNatalInfo?.sign || '-'} • {transitOnNatalInfo?.element || '-'} {transitOnNatalInfo?.modality || '-'}
                      </Text>
                      <Text style={styles.metricHint}>
                        Casa natural (arquétipo): {transitOnNatalNaturalInfo?.sign || '-'} • {transitOnNatalNaturalInfo?.element || '-'} {transitOnNatalNaturalInfo?.modality || '-'}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      activeOpacity={0.86}
                      style={styles.comparisonColumn}
                      onPress={() => {
                        const signLabel = getSignFromDegree(comparison.current.longitude)
                        const interp = buildColumnInterpretation({
                          planet: translatePlanetName(comparison.name),
                          contextLabel: 'Leitura Posição Atual',
                          signLabel,
                          signElement: translateElement(comparison.current.element),
                          signModality: translateModality(comparison.current.modality),
                          house: comparison.current.house,
                          houseByCusp: currentHouseInfo,
                          houseNatural: currentNaturalInfo,
                        })
                        openDetailModal({
                          title: `${translatePlanetName(comparison.name)} • Posição Atual`,
                          subtitle: `${signLabel} • Casa ${comparison.current.house}`,
                          short: interp.short,
                          long: interp.long,
                        })
                      }}
                    >
                      <Text style={styles.columnTitle}>Posição Atual</Text>
                      <Text style={styles.metricLine}>{currentSignLine}</Text>
                      {renderAttributeChips(comparison.current.element, comparison.current.modality)}
                      <Text style={styles.metricLineStrong}>
                        Casa {comparison.current.house}
                      </Text>
                      {renderAttributeChips(currentNaturalInfo?.element || null, currentNaturalInfo?.modality || null)}
                      <Text style={styles.metricHint}>
                        Casa por cúspide (cálculo): {currentHouseInfo?.sign || '-'} • {currentHouseInfo?.element || '-'} {currentHouseInfo?.modality || '-'}
                      </Text>
                      <Text style={styles.metricHint}>
                        Casa natural (arquétipo): {currentNaturalInfo?.sign || '-'} • {currentNaturalInfo?.element || '-'} {currentNaturalInfo?.modality || '-'}
                      </Text>
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
                  return (
                    <View key={idx} style={styles.aspectItem}>
                      <Text style={[styles.aspectIcon, { color: getAspectColor(t.type) }]}>{getAspectIcon(t.type)}</Text>
                      <View style={styles.aspectBody}>
                        <View style={styles.aspectLine}>
                          <Text style={styles.aspectText}>
                            {translatePlanetName(t.transitPlanet)} {translateAspectLabel(t.type)} {translatePlanetName(t.natalPlanet)}
                          </Text>
                          {windowInfo ? (
                            <Text style={styles.aspectMetaInline}>
                              {windowInfo.days ? `Duracao: ${windowInfo.days} dias | ` : ''}
                              Inicio: {windowInfo.startLabel || '-'} | Fim: {windowInfo.endLabel || '-'}
                            </Text>
                          ) : (
                            <Text style={styles.aspectMetaInline}>Datas reais indisponiveis.</Text>
                          )}
                        </View>
                        <TouchableOpacity
                          style={styles.readButton}
                          onPress={() =>
                            openDetailModal({
                              title: `${translatePlanetName(t.transitPlanet)} ${translateAspectLabel(t.type)} ${translatePlanetName(t.natalPlanet)}`,
                              subtitle: `Trânsito pessoal • ${translatePlanetName(comparison.name)}`,
                              short: `Aspecto ${translateAspectLabel(t.type)} entre ${translatePlanetName(t.transitPlanet)} e ${translatePlanetName(t.natalPlanet)} ativo neste ciclo.`,
                              long:
                                `Este trânsito conecta ${translatePlanetName(t.transitPlanet)} com ${translatePlanetName(t.natalPlanet)} por ${translateAspectLabel(t.type)}. ` +
                                `A leitura completa pede observar timing, intensidade e repetição de padrão. ` +
                                `Use a influência como contexto para decisões práticas nesta janela${windowInfo?.days ? ` de ${windowInfo.days} dias` : ''}.`,
                            })
                          }
                        >
                          <Text style={styles.readButtonText}>Abrir leitura</Text>
                        </TouchableOpacity>
                      </View>
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
                  return (
                    <View key={aspectIndex} style={styles.aspectItem}>
                      <Text style={[styles.aspectIcon, { color: getAspectColor(aspect.type) }]}>{getAspectIcon(aspect.type)}</Text>
                      <View style={styles.aspectBody}>
                        <View style={styles.aspectLine}>
                          <Text style={styles.aspectText}>
                            {translatePlanetName(aspect.planet1)} {translateAspectLabel(aspect.type)} {translatePlanetName(aspect.planet2)}
                          </Text>
                          {windowInfo ? (
                            <Text style={styles.aspectMetaInline}>
                              {windowInfo.days ? `Duracao: ${windowInfo.days} dias | ` : ''}
                              Inicio: {windowInfo.startLabel || '-'} | Fim: {windowInfo.endLabel || '-'}
                            </Text>
                          ) : (
                            <Text style={styles.aspectMetaInline}>Datas reais indisponiveis.</Text>
                          )}
                        </View>
                        <TouchableOpacity
                          style={styles.readButton}
                          onPress={() =>
                            openDetailModal({
                              title: `${translatePlanetName(aspect.planet1)} ${translateAspectLabel(aspect.type)} ${translatePlanetName(aspect.planet2)}`,
                              subtitle: `Aspecto coletivo • ${translatePlanetName(comparison.name)}`,
                              short: `Aspecto coletivo ${translateAspectLabel(aspect.type)} em vigor no céu atual.`,
                              long:
                                `O aspecto ${translateAspectLabel(aspect.type)} entre ${translatePlanetName(aspect.planet1)} e ${translatePlanetName(aspect.planet2)} atua como pano de fundo coletivo. ` +
                                `A interpretação prática é calibrar expectativa e escolha conforme a fase do aspecto${windowInfo?.days ? ` (janela estimada de ${windowInfo.days} dias)` : ''}.`,
                            })
                          }
                        >
                          <Text style={styles.readButtonText}>Abrir leitura</Text>
                        </TouchableOpacity>
                      </View>
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
                  return (
                    <View key={houseIndex} style={styles.aspectItem}>
                      <Text style={[styles.aspectIcon, { color: getAspectColor(houseAspect.aspect) }]}>{getAspectIcon(houseAspect.aspect)}</Text>
                      <View style={styles.aspectBody}>
                        <View style={styles.aspectLine}>
                          <Text style={styles.aspectText}>Casa {houseAspect.house} - {houseAspect.meaning}</Text>
                          {windowInfo ? (
                            <Text style={styles.aspectMetaInline}>
                              {windowInfo.days ? `Duracao: ${windowInfo.days} dias | ` : ''}
                              Inicio: {windowInfo.startLabel || '-'} | Fim: {windowInfo.endLabel || '-'}
                            </Text>
                          ) : (
                            <Text style={styles.aspectMetaInline}>Datas reais indisponiveis.</Text>
                          )}
                        </View>
                        <TouchableOpacity
                          style={styles.readButton}
                          onPress={() =>
                            openDetailModal({
                              title: `Casa ${houseAspect.house} • ${houseAspect.meaning}`,
                              subtitle: `Aspecto com casa • ${translatePlanetName(comparison.name)}`,
                              short: `Ativação de casa ${houseAspect.house} por ${translateAspectLabel(houseAspect.aspect)}.`,
                              long:
                                `Quando ${translatePlanetName(comparison.name)} ativa a Casa ${houseAspect.house}, o foco recai em ${houseAspect.meaning}. ` +
                                `A leitura precisa combina planeta, aspecto e casa para traduzir prioridade real. ` +
                                `Use esta janela para alinhar intenção e ação concreta${windowInfo?.days ? ` em até ${windowInfo.days} dias` : ''}.`,
                            })
                          }
                        >
                          <Text style={styles.readButtonText}>Abrir leitura</Text>
                        </TouchableOpacity>
                      </View>
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
          <Text style={styles.analysisLabel}>Elementos:</Text>
          <View style={styles.elementalGrid}>
            <View style={styles.elementalComparison}>
              <Text style={styles.comparisonLabel}>Natal:</Text>
              <View style={styles.elementalRow}>
                {Object.entries(chartSummary.elemental.natal).map(([element, count]) => (
                  <View key={element} style={styles.elementalItem}>
                    <Ionicons name={ELEMENT_ICONS[normalizeElementKey(element)] || FALLBACK_ICON} size={14} color="#FFD700" />
                    <Text style={styles.elementalItemText}>{translateElement(element)} {count}</Text>
                  </View>
                ))}
              </View>
            </View>
            <View style={styles.elementalComparison}>
              <Text style={styles.comparisonLabel}>Atual:</Text>
              <View style={styles.elementalRow}>
                {Object.entries(chartSummary.elemental.current).map(([element, count]) => (
                  <View key={element} style={styles.elementalItem}>
                    <Ionicons name={ELEMENT_ICONS[normalizeElementKey(element)] || FALLBACK_ICON} size={14} color="#FFD700" />
                    <Text style={styles.elementalItemText}>{translateElement(element)} {count}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>

        <View style={styles.analysisRow}>
          <Text style={styles.analysisLabel}>Modalidades:</Text>
          <View style={styles.elementalGrid}>
            <View style={styles.elementalComparison}>
              <Text style={styles.comparisonLabel}>Natal:</Text>
              <View style={styles.elementalRow}>
                {Object.entries(chartSummary.modality.natal).map(([modality, count]) => (
                  <View key={modality} style={styles.elementalItem}>
                    <Ionicons name={MODALITY_ICONS[normalizeModalityKey(modality)] || FALLBACK_ICON} size={14} color="#FFD700" />
                    <Text style={styles.elementalItemText}>{translateModality(modality)} {count}</Text>
                  </View>
                ))}
              </View>
            </View>
            <View style={styles.elementalComparison}>
              <Text style={styles.comparisonLabel}>Atual:</Text>
              <View style={styles.elementalRow}>
                {Object.entries(chartSummary.modality.current).map(([modality, count]) => (
                  <View key={modality} style={styles.elementalItem}>
                    <Ionicons name={MODALITY_ICONS[normalizeModalityKey(modality)] || FALLBACK_ICON} size={14} color="#FFD700" />
                    <Text style={styles.elementalItemText}>{translateModality(modality)} {count}</Text>
                  </View>
                ))}
              </View>
            </View>
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
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  comparisonColumn: {
    width: '32%',
    minWidth: 210,
    paddingHorizontal: 6,
    paddingVertical: 6,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    marginBottom: 8,
  },
  columnTitle: {
    color: '#A0A0A0',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  metricLine: {
    color: '#E2E8F0',
    fontSize: 13,
    marginBottom: 6,
    lineHeight: 18,
  },
  metricLineStrong: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
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
  aspectLine: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aspectText: {
    color: '#FFFFFF',
    fontSize: 12,
    flex: 1,
  },
  aspectMetaInline: {
    color: '#94A3B8',
    fontSize: 11,
    marginLeft: 8,
    textAlign: 'right',
  },
  readButton: {
    marginTop: 6,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: 'rgba(10, 22, 51, 0.5)',
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






































































