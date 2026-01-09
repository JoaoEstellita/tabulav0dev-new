import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import type { PlanetComparison, ChartSummary } from '../services/astrology/RealAstrologyEngine'
import { decodeUnicodeEscapes, translatePlanetPT } from '../utils/astro/pt'
import { normalizeKey } from '../utils/astro/normalizeKey'
import useTransits from '../hooks/useTransits'
import { useUserSettings } from '../hooks/useUserSettings'
import UserService from '../services/firebase/UserService'
import { useAuth } from '../hooks/useAuth'
import { HOUSE_SYSTEMS, normalizeHouseSystem, formatHouseSystemLabel } from '../astro/houseSystem'
import type { HouseSystem } from '../astro/houseSystem'

interface TransitComparisonCardProps {
  planetComparisons: PlanetComparison[]
  chartSummary: ChartSummary
  ascendant?: number
  midheaven?: number
  natalAscendant?: number
  natalMidheaven?: number
  housesCusps?: number[]
  lifeAreas?: Record<string, any>
  personalWindows?: Array<{
    transitPlanet: string
    natalPlanet: string
    type: string
    window?: { start?: string; exact?: string; end?: string; days?: number }
  }>
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
  '🔥': 'flame',
  '🌍': 'leaf',
  '🌎': 'leaf',
  '🌏': 'leaf',
  '💨': 'cloud',
  '💧': 'water',
  '💦': 'water'
}

const MODALITY_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  cardinal: 'flash',
  fixed: 'square',
  mutable: 'repeat',
  cardeal: 'flash',
  fixo: 'square',
  mutavel: 'repeat',
  '⚡': 'flash',
  '🔒': 'square',
  '🔁': 'repeat'
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

const AREA_LABELS: Record<string, string> = {
  amor: 'Amor',
  carreira: 'Carreira',
  financas: 'Finan\u00E7as',
  saude: 'Sa\u00FAde',
  familia: 'Fam\u00EDlia',
  espiritualidade: 'Espiritualidade',
  comunicacao: 'Comunica\u00E7\u00E3o',
  transformacao: 'Transforma\u00E7\u00E3o'
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
  lifeAreas,
  personalWindows
}: TransitComparisonCardProps) {
  const { personal, statusPersonal } = useTransits(null)
  const { settings, updateSettings } = useUserSettings()
  const { user } = useAuth()
  const [houseSystem, setHouseSystem] = React.useState<HouseSystem>(
    normalizeHouseSystem(settings?.houseSystem || 'placidus')
  )

    // Sincronizar quando as configuracoes carregarem/alterarem
  React.useEffect(() => {
    if (settings?.houseSystem) {
      setHouseSystem(normalizeHouseSystem(settings.houseSystem))
    }
  }, [settings?.houseSystem])
  const applyHouseSystem = React.useCallback(async (sys: HouseSystem) => {
    try {
      const normalized = normalizeHouseSystem(sys)
      setHouseSystem(normalized)
      await updateSettings({ houseSystem: sys })
      ;(globalThis as any).__userHouseSystem = normalized
      if (user?.uid) { try { await UserService.setHouseSystem(user.uid, normalized) } catch {} }
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('house-system-changed'))
      }
    } catch {}
  }, [])
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

const getSignFromDegree = (degree: number): string => {
  const signs = [
    '\u00C1ries', 'Touro', 'G\u00EAmeos', 'C\u00E2ncer', 'Le\u00E3o', 'Virgem',
    'Libra', 'Escorpi\u00E3o', 'Sagit\u00E1rio', 'Capric\u00F3rnio', 'Aqu\u00E1rio', 'Peixes'
  ]
  const signIndex = Math.floor(degree / 30) % 12
  return signs[signIndex]
}

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

  const estimateDurationDays = (durationClass?: string, orb?: number): number => {
    if (durationClass === 'curto') return 7
    if (durationClass === 'medio') return 30
    if (durationClass === 'longo') return 90
    if (typeof orb === 'number') {
      if (orb <= 1.5) return 7
      if (orb <= 3) return 14
      if (orb <= 5) return 30
      return 45
    }
    return 14
  }

  const formatDate = (date: Date | null): string | null => {
    if (!date || Number.isNaN(date.getTime())) return null
    return date.toLocaleDateString('pt-BR')
  }

  const resolveWindowInfo = (
    window: { start?: string; end?: string; days?: number } | undefined,
    fallbackDays: number
  ): { days: number; startLabel: string | null; endLabel: string | null } => {
    const now = new Date()
    let startDate = window?.start ? new Date(window.start) : null
    let endDate = window?.end ? new Date(window.end) : null
    const days = window?.days ?? fallbackDays
    if ((!startDate || !endDate) && days) {
      const halfWindow = Math.max(1, Math.round(days / 2))
      if (!startDate) startDate = new Date(now.getTime() - halfWindow * 86400000)
      if (!endDate) endDate = new Date(now.getTime() + halfWindow * 86400000)
    }
    return {
      days,
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

  const getAreaInfluencesForPlanet = React.useCallback((planetName: string) => {
    if (!lifeAreas || typeof lifeAreas !== 'object') return []
    const translated = translatePlanetName(planetName).toLowerCase()
    return Object.entries(lifeAreas)
      .map(([areaKey, data]) => {
        const influences = Array.isArray((data as any)?.influences) ? (data as any).influences : []
        const mainPlanets = Array.isArray((data as any)?.mainPlanets) ? (data as any).mainPlanets : []
        const matchMain = mainPlanets.includes(planetName)
        const matchInfluence = influences.filter((text: string) => {
          const lower = String(text || '').toLowerCase()
          return lower.includes(planetName.toLowerCase()) || lower.includes(translated)
        })
        if (!matchMain && matchInfluence.length === 0) return null
        return {
          areaKey,
          matchMain,
          matchCount: matchInfluence.length,
          percentage: typeof (data as any)?.percentage === 'number' ? (data as any).percentage : null,
          status: (data as any)?.status || null,
          influences: matchInfluence.length ? matchInfluence : influences.slice(0, 2)
        }
      })
      .filter(Boolean)
      .sort((a, b) => {
        if (a.matchMain !== b.matchMain) return a.matchMain ? -1 : 1
        if (a.matchCount !== b.matchCount) return b.matchCount - a.matchCount
        if (typeof a.percentage === 'number' && typeof b.percentage === 'number') {
          return a.percentage - b.percentage
        }
        return 0
      })
      .slice(0, 2) as Array<{
        areaKey: string
        matchMain: boolean
        matchCount: number
        percentage: number | null
        status: string | null
        influences: string[]
      }>
  }, [lifeAreas])

  return (
    <LinearGradient
      colors={['#1E1E2E', '#2A2A3E']}
      style={styles.container}
    >
      <View style={styles.cardHeader}>
        <Ionicons name="swap-horizontal" size={18} color="#FFD700" />
        <Text style={styles.cardTitle}>Trânsitos comparativos</Text>
      </View>
      {/* Status pessoal agregado */}
      {statusPersonal && (
        <View style={{ marginBottom: 8 }}>
          <Text style={{ color: '#fff', opacity: 0.9 }}>
            Status pessoal: {formatStatusLabel(statusPersonal.level)} ({statusPersonal.score}%)
          </Text>
        </View>
      )}

      {/* An\u00E1lise Elemental */}
      <View style={styles.summarySection}>
        <View style={styles.sectionHeader}>
          <Ionicons name="analytics" size={20} color="#FFD700" />
          <Text style={styles.sectionTitle}>Resumo da Carta</Text>
          {showApprox && (
            <Text style={{ color: '#FFD700', marginLeft: 8, fontSize: 12 }}>aprox</Text>
          )}
        </View>

        {/* An\u00E1lise Elemental */}
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

        {/* An\u00E1lise de Modalidades */}
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

      {/* Compara\u00E7\u00F5es Planet\u00E1rias */}
      <View style={styles.planetsSection}>
        <View style={styles.sectionHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="planet" size={20} color="#FFD700" />
            <Text style={styles.sectionTitle}>Planetas em trânsito</Text>
          </View>
          <View style={styles.toggleGroup}>
            <TouchableOpacity
              onPress={() => {
                const idx = HOUSE_SYSTEMS.indexOf(houseSystem)
                const next = HOUSE_SYSTEMS[(idx + 1) % HOUSE_SYSTEMS.length]
                applyHouseSystem(next)
              }}
              style={[styles.toggleBtn, styles.toggleBtnActive]}
              accessibilityRole="button"
              accessibilityLabel="Alternar sistema de casas"
            >
              <Text style={[styles.toggleText, styles.toggleTextActive]}>
                {formatHouseSystemLabel(houseSystem)}
              </Text>
            </TouchableOpacity>
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

            {/* Compara\u00E7\u00E3o Natal vs Trânsito */}
            <View style={styles.comparisonGrid}>
              <View style={styles.comparisonColumn}>
                <Text style={styles.columnTitle}>Natal</Text>
                <Text style={styles.positionText}>
                  {formatDegreeInSign(comparison.natal.longitude)} {getSignFromDegree(comparison.natal.longitude)}
                </Text>
                <Text style={styles.houseText}>Casa {comparison.natal.house}</Text>
                <View style={styles.attributesRow}>
                  <View style={styles.attributeChip}>
                    <Ionicons name={ELEMENT_ICONS[normalizeElementKey(comparison.natal.element)] || FALLBACK_ICON} size={12} color="#FFD700" />
                    <Text style={styles.attributeChipText}>{translateElement(comparison.natal.element)}</Text>
                  </View>
                  <View style={styles.attributeChip}>
                    <Ionicons name={MODALITY_ICONS[normalizeModalityKey(comparison.natal.modality)] || FALLBACK_ICON} size={12} color="#FFD700" />
                    <Text style={styles.attributeChipText}>{translateModality(comparison.natal.modality)}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.comparisonColumn}>
              <Text style={styles.columnTitle}>Trânsito</Text>
                <Text style={styles.positionText}>
                  {formatDegreeInSign(comparison.current.longitude)} {getSignFromDegree(comparison.current.longitude)}
                  {comparison.current.isRetrograde && ' (Rx)'}
                </Text>
                <Text style={styles.houseText}>Casa {comparison.current.house}</Text>
                {(() => {
                  const info = nearestCuspInfo(comparison.current.longitude)
                  if (info && info.distance <= 0.5) {
                    return (
                      <Text style={styles.nearCuspChip}>{`pr\u00F3x. cÇ§spide ${info.house} (${info.distance.toFixed(2)} graus)`}</Text>
                    )
                  }
                  return null
                })()}
                <View style={styles.attributesRow}>
                  <View style={styles.attributeChip}>
                    <Ionicons name={ELEMENT_ICONS[normalizeElementKey(comparison.current.element)] || FALLBACK_ICON} size={12} color="#FFD700" />
                    <Text style={styles.attributeChipText}>{translateElement(comparison.current.element)}</Text>
                  </View>
                  <View style={styles.attributeChip}>
                    <Ionicons name={MODALITY_ICONS[normalizeModalityKey(comparison.current.modality)] || FALLBACK_ICON} size={12} color="#FFD700" />
                    <Text style={styles.attributeChipText}>{translateModality(comparison.current.modality)}</Text>
                  </View>
                </View>
              </View>
            </View>

                        {/* Transitos pessoais para este planeta em transito */}
            {(personalByTransitPlanet[comparison.name]?.length ?? 0) > 0 && (
              <View style={styles.aspectsSection}>
                <Text style={styles.aspectsTitle}>Transitos pessoais:</Text>
                {personalByTransitPlanet[comparison.name].map((t, idx) => {
                  const key = `${t.transitPlanet}|${t.type}|${t.natalPlanet}`
                  const windowInfo = resolveWindowInfo(
                    personalWindowMap.get(key),
                    estimateDurationDays(t.durationClass, t.orb)
                  )
                  const durationLabel = windowInfo.days ? `${windowInfo.days} dias` : 'em andamento'
                  const startLabel = windowInfo.startLabel || '-'
                  const endLabel = windowInfo.endLabel || '-'
                  return (
                    <View key={idx} style={styles.aspectItem}>
                      <Text style={[styles.aspectIcon, { color: getAspectColor(t.type) }]}>{getAspectIcon(t.type)}</Text>
                      <View style={styles.aspectBody}>
                        <Text style={styles.aspectText}>
                          {translatePlanetName(t.transitPlanet)} {translateAspectLabel(t.type)} {translatePlanetName(t.natalPlanet)}
                        </Text>
                        <Text style={styles.aspectMeta}>Duracao: {durationLabel} | Inicio: {startLabel} | Fim: {endLabel}</Text>
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
                  const windowInfo = resolveWindowInfo(undefined, estimateDurationDays(undefined, aspect.orb))
                  const durationLabel = windowInfo.days ? `${windowInfo.days} dias` : 'em andamento'
                  const startLabel = windowInfo.startLabel || '-'
                  const endLabel = windowInfo.endLabel || '-'
                  return (
                    <View key={aspectIndex} style={styles.aspectItem}>
                      <Text style={[styles.aspectIcon, { color: getAspectColor(aspect.type) }]}>{getAspectIcon(aspect.type)}</Text>
                      <View style={styles.aspectBody}>
                        <Text style={styles.aspectText}>
                          {translatePlanetName(aspect.planet1)} {translateAspectLabel(aspect.type)} {translatePlanetName(aspect.planet2)}
                        </Text>
                        <Text style={styles.aspectMeta}>Duracao: {durationLabel} | Inicio: {startLabel} | Fim: {endLabel}</Text>
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
                  const windowInfo = resolveWindowInfo(undefined, estimateDurationDays(undefined, houseAspect.orb))
                  const durationLabel = windowInfo.days ? `${windowInfo.days} dias` : 'em andamento'
                  const startLabel = windowInfo.startLabel || '-'
                  const endLabel = windowInfo.endLabel || '-'
                  return (
                    <View key={houseIndex} style={styles.aspectItem}>
                      <Text style={[styles.aspectIcon, { color: getAspectColor(houseAspect.aspect) }]}>{getAspectIcon(houseAspect.aspect)}</Text>
                      <View style={styles.aspectBody}>
                        <Text style={styles.aspectText}>Casa {houseAspect.house} - {houseAspect.meaning}</Text>
                        <Text style={styles.aspectMeta}>Duracao: {durationLabel} | Inicio: {startLabel} | Fim: {endLabel}</Text>
                      </View>
                    </View>
                  )
                })}
              </View>
            )}
{(() => {
              const areaInfluences = getAreaInfluencesForPlanet(comparison.name)
              if (!areaInfluences.length) return null
              return (
                <View style={styles.aspectsSection}>
                  <Text style={styles.aspectsTitle}>Influência nos status:</Text>
                  {areaInfluences.map((area, areaIndex) => (
                    <View key={`${comparison.name}-area-${area.areaKey}-${areaIndex}`} style={styles.influenceRow}>
                      <Text style={styles.influenceArea}>
                        {AREA_LABELS[area.areaKey] || area.areaKey}
                        {typeof area.percentage === 'number' ? ` (${Math.round(area.percentage)}%)` : ''}
                        {area.status ? ` - ${formatStatusLabel(area.status)}` : ''}
                      </Text>
                      {area.influences.slice(0, 2).map((entry, idx) => (
                        <Text key={`${area.areaKey}-inf-${idx}`} style={styles.influenceText}>
                          - {translatePlanetTokens(entry)}
                        </Text>
                      ))}
                    </View>
                  ))}
                </View>
              )
            })()}
          </View>
        ))}

        
      </View>
    </LinearGradient>
  )
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
    marginBottom: 16,
  },
  comparisonColumn: {
    flex: 1,
    paddingHorizontal: 8,
  },
  columnTitle: {
    color: '#A0A0A0',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  positionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  houseText: {
    color: '#A0A0A0',
    fontSize: 14,
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
  toggleGroup: {
    flexDirection: 'row',
    gap: 6,
  },
  toggleBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.08)'
  },
  toggleBtnActive: {
    backgroundColor: 'rgba(255,215,0,0.2)'
  },
  toggleText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500'
  },
  toggleTextActive: {
    fontWeight: '700'
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
  aspectText: {
    color: '#FFFFFF',
    fontSize: 12,
    marginBottom: 2,
  },
  aspectMeta: {
    color: '#94A3B8',
    fontSize: 11,
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







































































