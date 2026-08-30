import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Alert, InteractionManager, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import MomentoCertoView from './MomentoCertoView'
import { useAuth } from '../../hooks/useAuth'
import { useSubscriptionCheck } from '../../hooks/useSubscriptionCheck'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Calendar, LocaleConfig } from 'react-native-calendars'
import ForecastEphemerisChart from '../../components/ForecastEphemerisChart'
import AsyncStorage from '@react-native-async-storage/async-storage'
import ExpiryBanner from '../../components/ExpiryBanner'
import TransitInsightCard from '../../components/TransitInsightCard'
import ReadingDetailModal from '../../components/ReadingDetailModal'
import { useAppLanguage } from '../../hooks/useAppLanguage'
import { useTourAnchor, useTourScroller, useTabTour } from '../../tour/TourProvider'
import { translate, type AppLanguage } from '../../i18n/appI18n'
import { STATUS_THRESHOLDS } from '../../constants/statusThresholds'
import {
  LIFE_AREA_LABELS,
  LIFE_AREA_ORDER,
  LIFE_AREA_COLORS,
  normalizeLifeArea,
} from '../../constants/lifeAreas'
import { getForecastMaxDays, getPlanById } from '../../constants/plans'
import { getExpiryBannerInfo } from '../../utils/expiry'
import { buildTransitTitle as buildSharedTransitTitle, extractHouseNumber } from '../../utils/transitPresentation'
import { buildUnifiedTransitNarrative } from '../../utils/astroInterpretation'
import { getAxisShortLabel, normalizeAxisScore, STATUS_AXIS_COLORS } from '../../utils/statusAxes'
import { backendFetch } from '../../services/backend/client'
import StarLoader from '../../components/StarLoader'

type ForecastSeriesPoint = {
  date: string
  score: number | null
  label: string | null
  reasons: { eventId: string; summary: string }[]
}

type ForecastEvent = {
  id: string
  type: string
  transitPlanet: string
  natalPoint: string
  aspect: string
  startAt: string
  exactAt: string
  endAt: string
  orbMax?: number
  intensity: number
  impact: 'UP' | 'DOWN' | 'MIXED'
  shortText: string
  domains: string[]
}

type DayStatusResponse = {
  date: string
  global: { score: number | null; level: string | null }
  lifeAreas: Record<
    string,
    {
      percentage: number | null
      status: string | null
      movementScore?: number | null
      attentionScore?: number | null
    }
  >
  badges?: { criticalCount?: number; strongCount?: number }
  meta?: { cached?: boolean; rulesVersion?: string; durationMs?: number }
}

type DayStatusRangeResponse = {
  range: { from: string; to: string }
  days: DayStatusResponse[]
  meta?: { rulesVersion?: string; durationMs?: number }
}

type ForecastResponse = {
  rulesVersion: string
  range: { from: string; to: string; granularity: 'day' | 'week' }
  series: ForecastSeriesPoint[]
  events: ForecastEvent[]
  seriesByDomain?: Record<string, ForecastSeriesPoint[]>
  eventPhasesByDate?: Record<string, { eventId: string; label: string; meta?: string; deltaDays?: number }[]>
  dailyCounts?: { critical?: Record<string, number>; strong?: Record<string, number> }
  dailyBadges?: Record<string, { score: number | null; label: string | null; criticalCount: number; strongCount: number }>
  highlights?: { eventId: string; summary: string; impact: string; intensity: number }[]
  meta?: { cached?: boolean; limited?: boolean; premium?: boolean; rulesVersion?: string; durationMs?: number }
}

const PERIODS = [7, 30, 90, 360]

interface AreaSummaryDriver {
  transitPlanetPt?: string
  transitPlanet?: string
  aspectPt?: string
  aspect?: string
  natalTarget?: string | null
  house?: number | null
  valenceSign?: string
  slow?: boolean
}
interface AreaSummaryItem {
  area: string
  areaLabel?: string
  currentPct: number | null
  currentBand: string
  trend?: string
  dominantDriver?: AreaSummaryDriver | null
  classification?: string
  verdict?: string
  reading?: string
  recovery?: { dateISO: string; band: string } | null
}
interface AreaSummaryResponse {
  horizon: number
  limited?: boolean
  areas: AreaSummaryItem[]
}

const AREA_BAND_COLORS: Record<string, string> = {
  'crítico': '#FF6B6B',
  critico: '#FF6B6B',
  desafiador: '#FF9F45',
  'atenção': '#FFD700',
  atencao: '#FFD700',
  'favorável': '#4ECDC4',
  favoravel: '#4ECDC4',
  'muito favorável': '#6BCB77',
  'muito favoravel': '#6BCB77',
}
const areaBandColor = (band?: string) => AREA_BAND_COLORS[String(band || '').toLowerCase()] || '#888'

const FORECAST_SELECTED_DATE_KEY = 'forecast_selected_date'
const FORECAST_CACHE_PREFIX = 'forecast_cache_v3'
const FORECAST_CACHE_TTL_MS = 10 * 60 * 1000
const FORECAST_DAY_STATUS_CACHE_PREFIX = 'forecast_day_status_v3'
const FORECAST_DAY_STATUS_CACHE_TTL_MS = 5 * 60 * 1000
const FORECAST_DAY_STATUS_RANGE_CACHE_PREFIX = 'forecast_day_status_range_v3'
const FORECAST_DAY_STATUS_RANGE_CACHE_TTL_MS = 10 * 60 * 1000
type ForecastCondition = 'retrograde' | 'stationary' | 'applying' | 'separating' | 'exact'
type ForecastTransitKind = 'planet_planet' | 'planet_house'
type ForecastDignity = 'domicile_exalted' | 'debilitated' | 'neutral' | 'unknown'
type ForecastHouseStrength = 'angular' | 'succedent' | 'cadent' | 'unknown'

LocaleConfig.locales['pt-BR'] = {
  monthNames: ['Janeiro', 'Fevereiro', 'Marco', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
  monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
  dayNames: ['Domingo', 'Segunda-feira', 'Terca-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sabado'],
  dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
}
LocaleConfig.locales['en-US'] = {
  monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
}
LocaleConfig.locales['es-ES'] = {
  monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
  monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
  dayNames: ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'],
  dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
}
LocaleConfig.locales['it-IT'] = {
  monthNames: ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'],
  monthNamesShort: ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'],
  dayNames: ['Domenica', 'Lunedi', 'Martedi', 'Mercoledi', 'Giovedi', 'Venerdi', 'Sabato'],
  dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'],
}

function scoreColor(score: number) {
  if (score < STATUS_THRESHOLDS.criticalBelow) return '#FF6B6B'
  if (score >= STATUS_THRESHOLDS.positiveAbove) return '#4ECDC4'
  return '#FFD166'
}

function buildDateUTCString(date: Date) {
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function parseUTCDateString(value: string) {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!match) return null
  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) return null
  return new Date(Date.UTC(year, month - 1, day))
}

function formatDateShort(date: Date, language = 'pt-BR') {
  return date.toLocaleDateString(language, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

function formatDateShortNoYear(date: Date, language = 'pt-BR') {
  return date.toLocaleDateString(language, {
    day: '2-digit',
    month: 'short',
    timeZone: 'UTC',
  })
}

function impactLabel(impact: ForecastEvent['impact']) {
  if (impact === 'UP') return 'Positivo'
  if (impact === 'DOWN') return 'Desafiador'
  return 'Misto'
}

function inferTransitKind(event: ForecastEvent): ForecastTransitKind {
  const target = String(event.natalPoint || '')
  return /(?:casa|house)\s*\d{1,2}/i.test(target) ? 'planet_house' : 'planet_planet'
}

function inferConditions(event: ForecastEvent, phase?: { label: string; meta?: string } | null): ForecastCondition[] {
  const out: ForecastCondition[] = []
  const fullText = `${event.shortText || ''} ${event.aspect || ''} ${event.natalPoint || ''}`.toLowerCase()
  const phaseText = `${phase?.label || ''} ${phase?.meta || ''}`.toLowerCase()
  if (/retr[oó]grad|retrograde/.test(fullText)) out.push('retrograde')
  if (/estacion|station/.test(fullText)) out.push('stationary')
  if (phaseText.includes('aprox') || phaseText.includes('faltam') || phaseText.includes('approach')) out.push('applying')
  if (phaseText.includes('afastando') || phaseText.includes('moving away') || phaseText.includes('separat')) out.push('separating')
  if (phaseText.includes('pico') || phaseText.includes('peak') || phaseText.includes('hoje')) out.push('exact')
  if (!out.length && typeof event.orbMax === 'number' && event.orbMax <= 1) out.push('exact')
  return Array.from(new Set(out))
}

function inferDignity(event: ForecastEvent): ForecastDignity {
  const anyEvent = event as any
  const raw = String(anyEvent?.dignity || anyEvent?.dignityLevel || anyEvent?.transitDignity || '').toLowerCase()
  if (!raw) return 'unknown'
  if (/(domic|exalt|forte|strong|own sign|domicilio)/.test(raw)) return 'domicile_exalted'
  if (/(queda|fall|detrim|debil|fraca|weak)/.test(raw)) return 'debilitated'
  return 'neutral'
}

function inferHouseStrength(event: ForecastEvent): ForecastHouseStrength {
  const anyEvent = event as any
  const raw = String(anyEvent?.houseStrength || anyEvent?.house_strength || '').toLowerCase()
  if (!raw) return 'unknown'
  if (/angular/.test(raw)) return 'angular'
  if (/suced|succedent/.test(raw)) return 'succedent'
  if (/cadent|cadente/.test(raw)) return 'cadent'
  return 'unknown'
}

function normalizeEventDomains(domains: string[]) {
  return (domains || []).map((d) => normalizeLifeArea(d)).filter(Boolean) as string[]
}

function normalizeAspectLabel(rawAspect: string) {
  const value = String(rawAspect || '').trim().toLowerCase()
  const map: Record<string, string> = {
    conjunction: 'conjuncao',
    opposition: 'oposicao',
    square: 'quadratura',
    trine: 'trigono',
    sextile: 'sextil',
    quincunx: 'quincuncio',
    semisextile: 'semissextil',
    semisquare: 'semiquadratura',
    sesquiquadrate: 'sesquiquadratura',
  }
  return map[value] || value
}

function buildEventTitle(event: ForecastEvent, language: AppLanguage = 'pt-BR') {
  const transitPlanet = String(event.transitPlanet || '').trim()
  const natalPoint = String(event.natalPoint || '').trim()
  const aspect = normalizeAspectLabel(event.aspect || '')
  const houseNumber =
    extractHouseNumber((natalPoint.match(/(?:casa|house)\s*(\d{1,2})/i) || [])[1] || null) ||
    null
  return buildSharedTransitTitle({
    transitPlanet,
    aspectLabel: aspect,
    targetLabel: natalPoint,
    houseNumber,
  }, language)
}

function buildDirectEventText(event: ForecastEvent, language = 'pt-BR') {
  const domain = (event.domains || []).map((item) => formatDomainLabel(item, language as AppLanguage)).slice(0, 1).join(', ')
  const narrative = buildUnifiedTransitNarrative(
    {
      transitPlanet: event.transitPlanet,
      aspectName: event.aspect,
      natalPlanet: event.natalPoint,
    },
    domain || 'previsoes',
    language
  )
  return narrative.shortText
}

function buildActionHint(event: ForecastEvent) {
  const aspect = String(event.aspect || '').toLowerCase()
  if (/conjuncao/.test(aspect)) return 'Acao sugerida: concentre energia em uma prioridade unica.'
  if (/trigono|sextil/.test(aspect)) return 'Acao sugerida: aproveite para concluir uma entrega importante.'
  if (/quadratura|oposicao|quincuncio|semi/.test(aspect)) return 'Acao sugerida: reduza friccao e renegocie o que estiver pesado.'
  if (event.impact === 'UP') return 'Acao sugerida: avance em uma decisao pratica.'
  if (event.impact === 'DOWN') return 'Acao sugerida: reduzir excesso e ajustar rota.'
  return 'Acao sugerida: testar em pequeno passo antes de ampliar.'
}

function buildEventKeywords(event: ForecastEvent, phaseLabel?: string | null, language = 'pt-BR') {
  const out = buildUnifiedTransitNarrative(
    {
      transitPlanet: event.transitPlanet,
      aspectName: event.aspect,
      natalPlanet: event.natalPoint,
    },
    (event.domains || []).map((d) => formatDomainLabel(d, language as AppLanguage)).slice(0, 1).join(', '),
    language
  ).keywords
  const add = (value?: string | null) => {
    const token = String(value || '').trim()
    if (!token) return
    if (!out.some((item) => item.toLowerCase() === token.toLowerCase())) out.push(token)
  }
  const transitPlanet = String(event.transitPlanet || '').trim()
  const natalPoint = String(event.natalPoint || '').trim()
  const aspectLabel = normalizeAspectLabel(event.aspect || '')
  add(transitPlanet)
  add(aspectLabel)
  add(natalPoint)
  add(impactLabel(event.impact))
  add(phaseLabel || null)
  const domains = (event.domains || []).map((d) => formatDomainLabel(d, language as AppLanguage))
  domains.slice(0, 2).forEach((domain) => add(domain))
  return out.slice(0, 5)
}

function buildFullEventInterpretation(event: ForecastEvent, detailLines: string[], language = 'pt-BR') {
  const domains = (event.domains || []).map((d) => formatDomainLabel(d, language as AppLanguage)).join(', ')
  const narrative = buildUnifiedTransitNarrative(
    {
      transitPlanet: event.transitPlanet,
      aspectName: event.aspect,
      natalPlanet: event.natalPoint,
    },
    domains || 'previsoes',
    language
  )
  const detail = detailLines.length ? `Dados tecnicos: ${detailLines.join(' - ')}.` : ''
  return [narrative.modalBody, detail].filter(Boolean).join('\n\n')
}

function formatDomainLabel(domain: string, language: AppLanguage = 'pt-BR') {
  const key = normalizeLifeArea(domain) || String(domain || '').trim().toLowerCase()
  if (key) {
    const localized = translate(language, `lifeArea.${key}`)
    if (localized !== `lifeArea.${key}`) return localized
  }
  if (LIFE_AREA_LABELS[key]) return LIFE_AREA_LABELS[key]
  if (!key) return 'Area'
  return key.charAt(0).toUpperCase() + key.slice(1)
}

function getAreaColor(domain: string) {
  const colors = LIFE_AREA_COLORS[domain]
  if (Array.isArray(colors) && colors.length) return colors[0]
  return '#2A2A2E'
}

function diffDaysUTC(from: Date, to: Date) {
  const ms = to.getTime() - from.getTime()
  return Math.round(ms / 86400000)
}

function isDateKeyWithinRange(dateKey: string, startKey: string | null, endKey: string | null) {
  if (!startKey || !endKey) return false
  return dateKey >= startKey && dateKey <= endKey
}

function buildEventPhase(selectedDate: string, event: ForecastEvent) {
  const selectedDateObj = parseUTCDateString(selectedDate)
  const exactDateObj = parseUTCDateString(event.exactAt.slice(0, 10))
  if (!selectedDateObj || !exactDateObj) return null
  const delta = diffDaysUTC(selectedDateObj, exactDateObj)
  if (delta === 0) return { label: 'Pico', meta: 'hoje' }
  if (delta > 0) return { label: 'Em aprox', meta: `faltam ${delta} dias` }
  return { label: 'Afastando', meta: `ha ${Math.abs(delta)} dias` }
}

function formatEventTiming(label: string, delta: number) {
  if (delta === 0) return `${label} hoje`
  if (delta > 0) return `${label} em ${delta} dias`
  return `${label} ha ${Math.abs(delta)} dias`
}

function addDaysUTC(date: Date, days: number) {
  const next = new Date(date.getTime())
  next.setUTCDate(next.getUTCDate() + days)
  return next
}

function startOfWeekUTC(date: Date) {
  const day = date.getUTCDay()
  const diff = day === 0 ? -6 : 1 - day
  return addDaysUTC(date, diff)
}

function useDebouncedValue<T>(value: T, delayMs: number) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs)
    return () => clearTimeout(timer)
  }, [value, delayMs])
  return debounced
}

const MemoCalendar: any = React.memo(Calendar as any)
const MemoAreaPill = React.memo(function MemoAreaPill({
  label,
  score,
  statusText,
  movementScore,
  attentionScore,
  active,
  color,
  onPress,
}: {
  label: string
  score: number | null
  statusText: string
  movementScore?: number | null
  attentionScore?: number | null
  active: boolean
  color: string
  onPress: () => void
}) {
  const value = typeof score === 'number' ? Math.round(score) : null
  const movement = normalizeAxisScore(movementScore)
  const attention = normalizeAxisScore(attentionScore)
  const valueColor = value === null
    ? '#FFFFFF'
    : value < STATUS_THRESHOLDS.criticalBelow
    ? '#DC2626'
    : value >= STATUS_THRESHOLDS.positiveAbove
    ? '#16A34A'
    : '#FFFFFF'
  return (
    <TouchableOpacity
      style={[
        styles.areaPill,
        { backgroundColor: color },
        active && styles.areaPillActive,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={styles.areaPillLabel} numberOfLines={1}>{label}</Text>
      <Text style={[styles.areaPillValue, { color: valueColor }]}>
        {value ?? '--'} {statusText}
      </Text>
      <View style={styles.areaAxisRow}>
        <Text style={styles.areaAxisLabel}>{getAxisShortLabel('movement')}</Text>
        <View style={styles.areaAxisTrack}>
          <View style={[styles.areaAxisFill, styles.areaAxisFillMovement, { width: `${movement ?? 0}%` }]} />
        </View>
        <Text style={styles.areaAxisValue}>{movement ?? '--'}</Text>
      </View>
      <View style={styles.areaAxisRow}>
        <Text style={styles.areaAxisLabel}>{getAxisShortLabel('attention')}</Text>
        <View style={styles.areaAxisTrack}>
          <View style={[styles.areaAxisFill, styles.areaAxisFillAttention, { width: `${attention ?? 0}%` }]} />
        </View>
        <Text style={styles.areaAxisValue}>{attention ?? '--'}</Text>
      </View>
    </TouchableOpacity>
  )
})

const MemoDomainChip = React.memo(function MemoDomainChip({
  label,
  active,
  color,
  onPress,
}: {
  label: string
  active: boolean
  color?: string
  onPress: () => void
}) {
  return (
    <TouchableOpacity
      style={[
        styles.domainChip,
        color ? { backgroundColor: color } : null,
        active && styles.domainChipActive,
      ]}
      onPress={onPress}
    >
      <Text style={[styles.domainChipText, active && styles.domainChipTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  )
})

const MemoDaySummary = React.memo(function MemoDaySummary({
  isLoading,
  dayStatus,
  selectedPoint,
  lifeAreaCards,
  selectedDomainKey,
  onSelectDomain,
  resolveScoreLabel,
  resolveDomainLabel,
  globalStatusLabel,
  noDataLabel,
}: {
  isLoading: boolean
  dayStatus: DayStatusResponse | null
  selectedPoint: ForecastSeriesPoint | null
  lifeAreaCards: Array<{
    domain: string
    score: number | null
    status: string | null
    movementScore: number | null
    attentionScore: number | null
    critical: boolean
    transitCount: number
  }>
  selectedDomainKey: string | null
  onSelectDomain: (domain: string | null) => void
  resolveScoreLabel: (score: number | null) => string
  resolveDomainLabel: (domain: string) => string
  globalStatusLabel: string
  noDataLabel: string
}) {
  const score = typeof dayStatus?.global?.score === 'number'
    ? dayStatus.global.score
    : typeof selectedPoint?.score === 'number'
    ? selectedPoint.score
    : null

  return (
    <View style={styles.dayPanelCard}>
      {isLoading ? (
        <View style={styles.daySkeleton}>
          <View style={styles.daySkeletonLine} />
          <View style={styles.daySkeletonLineShort} />
          <View style={styles.daySkeletonLine} />
        </View>
      ) : score !== null ? (
        <View style={styles.dayScoreRow}>
          <Text style={styles.dayScoreLine}>
            <Text style={styles.dayScorePrefix}>{globalStatusLabel} </Text>
            <Text style={[styles.dayPanelScore, { color: scoreColor(score) }]}>
              {score}
            </Text>
            <Text style={[styles.dayScoreLabel, { color: scoreColor(score) }]}>
              {' '}{resolveScoreLabel(score)}
            </Text>
          </Text>
        </View>
      ) : (
        <Text style={styles.emptyText}>{noDataLabel}</Text>
      )}

      <View style={styles.domainSection}>
        <View style={styles.areaPillGrid}>
          {lifeAreaCards.map((item) => {
            const isActive = selectedDomainKey === item.domain
            const label = resolveDomainLabel(item.domain)
            const color = getAreaColor(item.domain)
            return (
              <View
                key={item.domain}
                style={[styles.areaPillWrapper, isActive && styles.areaPillSelected]}
              >
                <MemoAreaPill
                  label={label}
                  score={item.score}
                  statusText={resolveScoreLabel(item.score)}
                  movementScore={item.movementScore}
                  attentionScore={item.attentionScore}
                  active={isActive}
                  color={color}
                  onPress={() => onSelectDomain(isActive ? null : item.domain)}
                />
              </View>
            )
          })}
        </View>
      </View>
    </View>
  )
})

const MemoDayEvents = React.memo(function MemoDayEvents({
  selectedEventsCount,
  eventDisplayData,
  onOpenEventDetail,
  dayEventsLabel,
  noEventsLabel,
}: {
  selectedEventsCount: number
  eventDisplayData: Array<{
    event: ForecastEvent
    phase: { label: string; meta?: string } | null
    title: string
    statusLabel: string
    statusColor: string
    directText: string
    actionHint: string
    metaText: string
    impactValue01: number
    impactLabel: string
  }>
  onOpenEventDetail: (eventId: string) => void
  dayEventsLabel: string
  noEventsLabel: string
}) {
  const visibleEvents = eventDisplayData
  return (
    <View>
      <Text style={styles.dayPanelLabel}>{dayEventsLabel}</Text>
      {selectedEventsCount === 0 && (
        <Text style={styles.emptyText}>{noEventsLabel}</Text>
      )}
      {visibleEvents.map((item) => (
        <View key={item.event.id}>
          <TransitInsightCard
            statusLabel={item.statusLabel}
            statusColor={item.statusColor}
            title={item.title}
            timingLabel={item.phase ? `${item.phase.label}${item.phase.meta ? ` - ${item.phase.meta}` : ''}` : null}
            directText={item.directText}
            impactValue01={item.impactValue01}
            impactLabel={item.impactLabel}
            fullExpanded={false}
            onToggleFull={() => {}}
            detailMode="modal"
            onOpenDetailModal={() => onOpenEventDetail(item.event.id)}
            modalOpenByCard
            showModalActionIcon
            fullTitle="Interpretacao completa"
            fullText=""
            actionText={item.actionHint}
            metaText={item.metaText}
            variant="dark"
          />
        </View>
      ))}
    </View>
  )
})
export default function ForecastScreen() {
  const { t, language } = useAppLanguage()
  const { user } = useAuth()
  const { subscription, trialActive, trialEndsAt, isAdmin } = useSubscriptionCheck()
  const navigation = useNavigation()
  const tr = useCallback(
    (key: string, fallback: string, vars?: Record<string, string | number>) => {
      const value = t(key, vars)
      return value === key ? fallback : value
    },
    [t]
  )
  useEffect(() => {
    const locale =
      language === 'pt-BR' || language === 'en-US' || language === 'es-ES' || language === 'it-IT'
        ? language
        : 'en-US'
    LocaleConfig.defaultLocale = locale
  }, [language])

  // Tour guiado da aba Previsões
  const forecastScrollRef = useRef<any>(null)
  const aPeriod = useTourAnchor('forecast.period')
  const aSummary = useTourAnchor('forecast.summary')
  const aView = useTourAnchor('forecast.view')
  const aEvents = useTourAnchor('forecast.events')
  useTourScroller('Forecast', useCallback((y: number) => forecastScrollRef.current?.scrollTo({ y, animated: true }), []))
  const forecastViewRef = useRef<'momento' | 'grafico' | 'calendario'>('grafico')
  const buildForecastTour = useCallback(() => {
    const fl = (pt: string, en: string, es: string, it: string) => (language === 'en-US' ? en : language === 'es-ES' ? es : language === 'it-IT' ? it : pt)
    if (forecastViewRef.current === 'momento') return [
      { id: 'momento.intentions', title: fl('Escolha a intenção', 'Pick your intention', 'Elige la intencion', 'Scegli l\'intenzione'),
        body: fl('Toque no que você quer fazer — amor, carreira, uma decisão, uma conversa… O céu é lido para AQUILO, não em geral.', 'Tap what you want to do — love, career, a decision, a talk… The sky is read for THAT, not in general.', 'Toca lo que quieres hacer — amor, carrera, una decision, una conversacion… El cielo se lee para ESO, no en general.', 'Tocca cosa vuoi fare — amore, carriera, una decisione, una conversazione… Il cielo e letto per QUELLO, non in generale.') },
      { id: 'momento.windows', title: fl('Os melhores dias', 'The best days', 'Los mejores dias', 'I giorni migliori'),
        body: fl('As melhores janelas ranqueadas: dia, faixa de hora ideal, o que apoia (✨) e o que pesar (⚠️). Toque numa janela para ver tudo e adicionar ao calendário. Só aparecem dias realmente favoráveis.', 'The best ranked windows: day, ideal hour range, what supports (✨) and what to weigh (⚠️). Tap a window to see everything and add it to your calendar. Only truly favorable days show.', 'Las mejores ventanas: dia, franja horaria ideal, lo que apoya (✨) y lo que sopesar (⚠️). Toca una ventana para ver todo y anadir al calendario. Solo aparecen dias realmente favorables.', 'Le migliori finestre: giorno, fascia oraria ideale, cosa sostiene (✨) e cosa valutare (⚠️). Tocca una finestra per vedere tutto e aggiungerla al calendario. Compaiono solo giorni davvero favorevoli.') },
      { id: 'momento.alert', title: fl('Avise-me quando abrir', 'Alert me when it opens', 'Avisame cuando se abra', 'Avvisami quando si apre'),
        body: fl('Ative para receber um aviso quando uma boa janela desta intenção estiver chegando — assim você não perde o timing.', 'Turn it on to get a heads-up when a good window for this intention is near — so you don\'t miss the timing.', 'Activalo para recibir un aviso cuando una buena ventana de esta intencion se acerque — asi no pierdes el timing.', 'Attivalo per ricevere un avviso quando una buona finestra di questa intenzione si avvicina — cosi non perdi il momento.') },
    ]
    return [
      { id: 'forecast.period', title: fl('Horizonte', 'Horizon', 'Horizonte', 'Orizzonte'),
        body: fl('Escolha quantos dias olhar à frente (7, 30…). Planos maiores liberam horizontes mais longos.', 'Choose how many days to look ahead (7, 30…). Higher plans unlock longer horizons.', 'Elige cuantos dias mirar adelante (7, 30…). Planes mayores desbloquean horizontes mas largos.', 'Scegli quanti giorni guardare avanti (7, 30…). I piani superiori sbloccano orizzonti piu lunghi.') },
      { id: 'forecast.summary', title: fl('Resumo por área', 'Area summary', 'Resumen por area', 'Riepilogo per area'),
        body: fl('Toque para abrir: mostra como cada uma das 8 áreas tende a ficar no período e o trânsito que mais pesa. "Linha do tempo" abre a visão completa.', 'Tap to open: shows how each of the 8 areas tends to be over the period and the strongest transit. "Timeline" opens the full view.', 'Toca para abrir: muestra como tiende cada una de las 8 areas en el periodo y el transito que mas pesa. "Linea de tiempo" abre la vista completa.', 'Tocca per aprire: mostra come tende ognuna delle 8 aree nel periodo e il transito piu forte. "Linea del tempo" apre la vista completa.') },
      { id: 'forecast.view', title: fl('Gráfico ou calendário', 'Chart or calendar', 'Grafico o calendario', 'Grafico o calendario'),
        body: fl('Veja a intensidade dos dias em gráfico ou num calendário. Toque num dia para focar nos trânsitos dele.', 'See each day\'s intensity as a chart or a calendar. Tap a day to focus on its transits.', 'Ve la intensidad de los dias en grafico o calendario. Toca un dia para enfocar sus transitos.', 'Vedi l\'intensita dei giorni in grafico o calendario. Tocca un giorno per i suoi transiti.') },
      { id: 'forecast.events', title: fl('Eventos e timing', 'Events and timing', 'Eventos y timing', 'Eventi e tempistica'),
        body: fl('Cada card é um trânsito com a intensidade e o que ele tende a mexer. O timing diz "hoje", "em X dias" ou "há X dias" — para você se preparar na hora certa.', 'Each card is a transit with its intensity and what it tends to stir. The timing says "today", "in X days" or "X days ago" — so you prepare at the right time.', 'Cada tarjeta es un transito con su intensidad y lo que tiende a mover. El timing dice "hoy", "en X dias" o "hace X dias" — para prepararte en el momento justo.', 'Ogni card e un transito con la sua intensita e cosa tende a smuovere. La tempistica dice "oggi", "tra X giorni" o "X giorni fa" — cosi ti prepari al momento giusto.') },
    ]
  }, [language])
  const { openTour: openForecastTour } = useTabTour('tour_seen_forecast', 'Forecast', buildForecastTour)
  const resolveScoreLabel = useCallback(
    (score: number | null) => {
      if (typeof score !== 'number') return '--'
      if (score < STATUS_THRESHOLDS.criticalBelow) return tr('forecast.status.critical', 'Critical')
      if (score >= STATUS_THRESHOLDS.positiveAbove) return tr('forecast.status.positive', 'Positive')
      return tr('forecast.status.moderate', 'Moderate')
    },
    [tr]
  )
  const resolveDomainLabel = useCallback(
    (domain: string) => formatDomainLabel(domain, language),
    [language]
  )
  const formatEventTimingLabel = useCallback(
    (label: string, delta: number) => {
      if (delta === 0) return tr('forecast.timing.today', `${label}: hoje`, { label })
      if (delta > 0) return tr('forecast.timing.future', `${label}: em ${delta}d`, { label, days: delta })
      return tr('forecast.timing.past', `${label}: ha ${Math.abs(delta)}d`, {
        label,
        days: Math.abs(delta),
      })
    },
    [tr]
  )
  const [periodDays, setPeriodDays] = useState(7)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<ForecastResponse | null>(null)
  const [dayStatusByDate, setDayStatusByDate] = useState<Record<string, DayStatusResponse>>({})
  const [dayStatusLoadingDate, setDayStatusLoadingDate] = useState<string | null>(null)
  const [dayRangeError, setDayRangeError] = useState(false)
  const [limitedBanner, setLimitedBanner] = useState(false)
  const [missingBirthData, setMissingBirthData] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null)
  const [selectedEventDetailId, setSelectedEventDetailId] = useState<string | null>(null)
  const [areaSummary, setAreaSummary] = useState<AreaSummaryResponse | null>(null)
  const [areaSummaryLoading, setAreaSummaryLoading] = useState(false)
  const [areaSummaryDegraded, setAreaSummaryDegraded] = useState(false)
  const [expandedArea, setExpandedArea] = useState<string | null>(null)
  // Seção "Resumo por área" no topo é colapsável (padrão fechada) para não empurrar
  // o gráfico pra baixo — abre ao tocar no cabeçalho.
  const [areaSummaryOpen, setAreaSummaryOpen] = useState(false)
  // Menu da aba: Momento Certo | Gráfico | Calendário. Default 'grafico' por ora;
  // vira 'momento' quando o motor (F1 backend) entrar.
  const [forecastView, setForecastView] = useState<'momento' | 'grafico' | 'calendario'>('momento')
  forecastViewRef.current = forecastView
  // Deep-link de um card de área: preseleciona a intenção e força o modo Momento.
  const route = useRoute() as any
  const momentoIntention = route?.params?.momentoIntention as any
  useEffect(() => { if (momentoIntention) setForecastView('momento') }, [momentoIntention])
  const areaSummaryInFlightRef = useRef(false)
  const skipNextFetchRef = useRef(false)
  const pendingPrefetchRef = useRef<NodeJS.Timeout | null>(null)
  const inFlightDayStatusRef = useRef<Set<string>>(new Set())

  const planId = (subscription?.planId || '').toLowerCase()
  const isPremium = isAdmin || subscription?.active === true
  const currentPlan = useMemo(() => {
    if (isAdmin) return { name: 'Admin' }
    if (subscription?.active) return getPlanById(planId) || { name: 'Premium' }
    if (trialActive) return { name: 'Trial' }
    return { name: 'Free' }
  }, [isAdmin, planId, subscription?.active, trialActive])
  const maxDaysAllowed = useMemo(() => {
    return getForecastMaxDays({
      planId,
      isAdmin,
      isActive: subscription?.active === true,
    })
  }, [isAdmin, planId, subscription?.active])

  // Resumo narrativo por área para o horizonte selecionado (endpoint dedicado,
  // cache diário no backend). Degrada com graça se o backend estiver sob quota.
  useEffect(() => {
    if (!user?.uid) { setAreaSummary(null); return }
    const horizon = Math.min(periodDays, maxDaysAllowed)
    let cancelled = false
    const load = async () => {
      if (areaSummaryInFlightRef.current) return
      areaSummaryInFlightRef.current = true
      setAreaSummaryLoading(true)
      setAreaSummaryDegraded(false)
      try {
        const resp = await backendFetch(
          `/api/forecast-area-summary?userId=${encodeURIComponent(user.uid)}&horizon=${horizon}`,
          { method: 'GET', auth: true, timeoutMs: 20000, headers: { 'Content-Type': 'application/json' } }
        )
        if (cancelled) return
        if (resp.status === 503) { setAreaSummaryDegraded(true); return }
        if (!resp.ok) { setAreaSummary(null); return }
        const payload: AreaSummaryResponse = await resp.json()
        if (!cancelled) setAreaSummary(payload)
      } catch {
        if (!cancelled) setAreaSummaryDegraded(true)
      } finally {
        areaSummaryInFlightRef.current = false
        if (!cancelled) setAreaSummaryLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [user?.uid, periodDays, maxDaysAllowed])

  const hasExtendedForecast = maxDaysAllowed > 7
  const granularity = 'day'
  const expiryInfo = useMemo(() => {
    return getExpiryBannerInfo({
      featureLabel: 'Previsoes',
      trialActive,
      trialEndsAt: trialEndsAt || subscription?.trialEndsAt || null,
      subscriptionNextBillingDate: subscription?.nextBillingDate || null,
      subscriptionExpiresAt: subscription?.expiresAt || null,
      isPremium,
    })
  }, [isPremium, subscription?.expiresAt, subscription?.nextBillingDate, subscription?.trialEndsAt, trialActive, trialEndsAt])
  const expiryMessage = useMemo(() => {
    if (!expiryInfo.show) return ''
    const daysLeft = expiryInfo.daysLeft
    if (typeof daysLeft !== 'number') return expiryInfo.message
    if (daysLeft <= 0) return expiryInfo.message
    return `${expiryInfo.message} (${daysLeft} dias)`
  }, [expiryInfo])
  const fetchForecast = useCallback(async (force: boolean = false) => {
    if (!user?.uid) return
    if (skipNextFetchRef.current) {
      skipNextFetchRef.current = false
      return
    }
    setLoading(true)
    setError(null)
    setLimitedBanner(false)
    setMissingBirthData(false)
    try {
      const today = new Date()
      const utcToday = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()))
      const from = buildDateUTCString(utcToday)
      const to = buildDateUTCString(addDaysUTC(utcToday, periodDays - 1))
      const cacheKey = `${FORECAST_CACHE_PREFIX}:${user.uid}:${from}:${to}:${granularity}`
      if (!force) {
        try {
          const cachedRaw = await AsyncStorage.getItem(cacheKey)
          if (cachedRaw) {
            const cached = JSON.parse(cachedRaw)
            const cachedAt = Number(cached?.cachedAt || 0)
            const cachedPayload = cached?.payload as ForecastResponse | undefined
            if (cachedPayload && cachedAt && Date.now() - cachedAt < FORECAST_CACHE_TTL_MS) {
              setData(cachedPayload)
              setLimitedBanner(!!cachedPayload.meta?.limited)
              setMissingBirthData(false)
              setError(null)
              setLoading(false)
              return
            }
          }
        } catch (cacheError) {
          console.warn('Forecast cache read failed', cacheError)
        }
      }

      const resp = await backendFetch(`/api/forecast?userId=${encodeURIComponent(user.uid)}&from=${from}&to=${to}&granularity=${granularity}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        auth: true,
      })
      if (!resp.ok) {
        let payload: any = null
        try {
          payload = await resp.json()
        } catch (_err) {
          payload = null
        }
        if (payload?.error === 'missing_birth_data') {
          setMissingBirthData(true)
          setError(tr('forecast.error.missingBirth', 'Dados de nascimento incompletos'))
          return
        }
        const text = payload?.error ? String(payload.error) : await resp.text()
        throw new Error(text || tr('forecast.error.http', 'Erro {status}', { status: resp.status }))
      }
      const payload: ForecastResponse = await resp.json()
      setData(payload)
      AsyncStorage.setItem(cacheKey, JSON.stringify({ cachedAt: Date.now(), payload })).catch(() => null)
      if (payload.meta?.limited) {
        setLimitedBanner(true)
        if (periodDays !== 7) {
          skipNextFetchRef.current = true
          setPeriodDays(7)
        }
      }
      if (payload.range?.from && payload.range?.to) {
        const rangeCacheKey = `${FORECAST_DAY_STATUS_RANGE_CACHE_PREFIX}:${user.uid}:${payload.range.from}:${payload.range.to}`
        try {
          const cachedRangeRaw = await AsyncStorage.getItem(rangeCacheKey)
          if (cachedRangeRaw) {
            const cachedRange = JSON.parse(cachedRangeRaw)
            const cachedAt = Number(cachedRange?.cachedAt || 0)
            const cachedPayload = cachedRange?.payload as Record<string, DayStatusResponse> | undefined
            if (cachedPayload && cachedAt && Date.now() - cachedAt < FORECAST_DAY_STATUS_RANGE_CACHE_TTL_MS) {
              setDayStatusByDate(cachedPayload)
              return
            }
          }
        } catch (_) {
          // ignore cache errors
        }
        try {
          setDayRangeError(false)
          const rangeResp = await backendFetch(`/api/forecast-status-range?userId=${encodeURIComponent(user.uid)}&from=${payload.range.from}&to=${payload.range.to}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            auth: true,
          })
          if (rangeResp.ok) {
            const rangePayload: DayStatusRangeResponse = await rangeResp.json()
            const nextMap: Record<string, DayStatusResponse> = {}
            rangePayload.days.forEach((day) => {
              nextMap[day.date] = day
            })
            setDayStatusByDate(nextMap)
            AsyncStorage.setItem(rangeCacheKey, JSON.stringify({ cachedAt: Date.now(), payload: nextMap })).catch(() => null)
          } else {
            setDayRangeError(true)
          }
        } catch (rangeError) {
          console.warn('Day status range fetch failed', rangeError)
          setDayRangeError(true)
        }
      }
    } catch (err: any) {
      console.warn('Forecast fetch failed', err?.message || err)
      setError(tr('forecast.error.loadFailed', 'Nao foi possivel carregar previsoes'))
    } finally {
      setLoading(false)
    }
  }, [user?.uid, periodDays, granularity])

  useEffect(() => {
    fetchForecast()
  }, [fetchForecast])

  const series = data?.series || []
  const seriesSorted = useMemo(
    () => series.slice().sort((a, b) => a.date.localeCompare(b.date)),
    [series]
  )
  const effectiveGranularity = data?.range?.granularity || granularity
  const rangeFrom = data?.range?.from ? parseUTCDateString(data.range.from) : null
  const rangeTo = data?.range?.to ? parseUTCDateString(data.range.to) : null
  const rangeFromStr = data?.range?.from || null
  const rangeToStr = data?.range?.to || null

  const seriesByDate = useMemo(() => {
    const map: Record<string, ForecastSeriesPoint> = {}
    seriesSorted.forEach((point) => {
      map[point.date] = point
    })
    return map
  }, [seriesSorted])

  const seriesByDomain = data?.seriesByDomain || {}
  const domainSeriesByDate = useMemo(() => {
    const map: Record<string, Record<string, ForecastSeriesPoint>> = {}
    Object.entries(seriesByDomain).forEach(([domain, points]) => {
      const key = normalizeLifeArea(domain)
      if (!key) return
      map[key] = {}
      points.forEach((point) => {
        map[key][point.date] = point
      })
    })
    return map
  }, [seriesByDomain])

  const eventsByDate = useMemo(() => {
    const map: Record<string, ForecastEvent[]> = {}
    ;(data?.events || []).forEach((event) => {
      const dateKey = event.exactAt.slice(0, 10)
      if (!map[dateKey]) map[dateKey] = []
      map[dateKey].push(event)
    })
    Object.keys(map).forEach((key) => {
      map[key] = map[key].slice().sort((a, b) => b.intensity - a.intensity)
    })
    return map
  }, [data?.events])

  const countsFromStatusRange = useMemo(() => {
    const critical: Record<string, number> = {}
    const strong: Record<string, number> = {}
    Object.entries(dayStatusByDate).forEach(([dateKey, day]) => {
      const areas = day?.lifeAreas || {}
      const areaValues = Object.values(areas) as Array<any>
      const hasAreas = areaValues.length > 0
      let criticalCount = 0
      let strongCount = 0
      let numericAreasCount = 0

      // Regra de contagem alinhada ao card:
      // crítico/positivo no calendário devem refletir o mesmo critério baseado em percentage.
      areaValues.forEach((area: any) => {
        const score = typeof area?.percentage === 'number' ? area.percentage : null
        if (score === null) return
        numericAreasCount += 1
        if (score < STATUS_THRESHOLDS.criticalBelow) criticalCount += 1
        if (score >= STATUS_THRESHOLDS.positiveAbove) strongCount += 1
      })

      // Fallback: usar badges do backend apenas quando não houver percentages válidos.
      if ((!hasAreas || numericAreasCount === 0) && day?.badges) {
        criticalCount = Number(day.badges.criticalCount || 0)
        strongCount = Number(day.badges.strongCount || 0)
      }
      critical[dateKey] = criticalCount
      strong[dateKey] = strongCount
    })
    return {
      critical,
      strong,
      hasRangeData: Object.keys(dayStatusByDate).length > 0,
    }
  }, [dayStatusByDate])

  const criticalCountsByDate = useMemo(() => {
    return countsFromStatusRange.critical
  }, [countsFromStatusRange.critical])

  const totalCriticalCount = useMemo(() => {
    return Object.values(criticalCountsByDate).reduce((sum, value) => sum + value, 0)
  }, [criticalCountsByDate])

  const positiveCountsByDate = useMemo(() => {
    return countsFromStatusRange.strong
  }, [countsFromStatusRange.strong])

  const isDateInRange = useCallback((dateKey: string) => {
    if (!rangeFromStr || !rangeToStr) return true
    return dateKey >= rangeFromStr && dateKey <= rangeToStr
  }, [rangeFromStr, rangeToStr])

  useEffect(() => {
    if (!rangeFromStr) return
    const applyDefault = async () => {
      if (selectedDate && isDateInRange(selectedDate)) return
      try {
        const stored = await AsyncStorage.getItem(FORECAST_SELECTED_DATE_KEY)
        if (stored && isDateInRange(stored)) {
          setSelectedDate(stored)
          return
        }
      } catch (_) {
        // ignore storage errors
      }
      if (!selectedDate || !isDateInRange(selectedDate)) {
        setSelectedDate(rangeFromStr)
      }
    }
    applyDefault()
  }, [rangeFromStr, rangeToStr, isDateInRange, selectedDate])

  useEffect(() => {
    if (!selectedDate) return
    AsyncStorage.setItem(FORECAST_SELECTED_DATE_KEY, selectedDate).catch(() => null)
  }, [selectedDate])

  const fetchDayStatus = useCallback(async (dateKey: string, markLoading: boolean = false) => {
    if (!user?.uid) return
    if (dayStatusByDate[dateKey]) return
    if (inFlightDayStatusRef.current.has(dateKey)) return
    inFlightDayStatusRef.current.add(dateKey)
    if (markLoading) setDayStatusLoadingDate(dateKey)
    const cacheKey = `${FORECAST_DAY_STATUS_CACHE_PREFIX}:${user.uid}:${dateKey}`
    try {
      const cachedRaw = await AsyncStorage.getItem(cacheKey)
      if (cachedRaw) {
        const cached = JSON.parse(cachedRaw)
        const cachedAt = Number(cached?.cachedAt || 0)
        const cachedPayload = cached?.payload as DayStatusResponse | undefined
        if (cachedPayload && cachedAt && Date.now() - cachedAt < FORECAST_DAY_STATUS_CACHE_TTL_MS) {
          setDayStatusByDate((prev) => ({ ...prev, [dateKey]: cachedPayload }))
          if (markLoading) {
            setDayStatusLoadingDate((prev) => (prev === dateKey ? null : prev))
          }
          return
        }
      }
    } catch (_) {
      // ignore cache errors
    }
    try {
      const resp = await backendFetch(`/api/forecast-status-day?userId=${encodeURIComponent(user.uid)}&date=${dateKey}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        auth: true,
      })
      if (!resp.ok) return
      const payload: DayStatusResponse = await resp.json()
      setDayStatusByDate((prev) => ({ ...prev, [dateKey]: payload }))
      AsyncStorage.setItem(cacheKey, JSON.stringify({ cachedAt: Date.now(), payload })).catch(() => null)
    } catch (err: any) {
      console.warn('Day status fetch failed', err?.message || err)
    } finally {
      inFlightDayStatusRef.current.delete(dateKey)
      if (markLoading) {
        setDayStatusLoadingDate((prev) => (prev === dateKey ? null : prev))
      }
    }
  }, [user?.uid, dayStatusByDate])

  const handleSelectDate = useCallback((dateKey: string) => {
    setSelectedDomain(null)
    setSelectedDate(dateKey)
    if (!dayStatusByDate[dateKey]) {
      setDayStatusLoadingDate(dateKey)
    } else {
      setDayStatusLoadingDate(null)
    }
  }, [dayStatusByDate])

  const handleCalendarPress = useCallback((dateKey: string) => {
    if (!isDateInRange(dateKey)) {
      if (maxDaysAllowed <= 7) {
        Alert.alert(
          tr('forecast.alert.premiumTitle', 'Premium'),
          tr('forecast.alert.premiumRange', 'Seu plano atual nao libera datas fora do periodo.')
        )
        navigation.navigate('Premium' as never)
        return
      }
      if (data?.meta?.limited) {
        Alert.alert(
          tr('forecast.alert.limitTitle', 'Limite'),
          tr('forecast.alert.limitBody', 'O backend limitou o periodo. Tente outro intervalo.')
        )
      }
      return
    }
    handleSelectDate(dateKey)
  }, [data?.meta?.limited, handleSelectDate, isDateInRange, maxDaysAllowed, navigation])

  const calendarMarkedDates = useMemo(() => {
    const marks: Record<string, any> = {}
    const allDateKeys = Array.from(
      new Set([
        ...Object.keys(criticalCountsByDate),
        ...Object.keys(positiveCountsByDate),
      ])
    )
    allDateKeys.forEach((dateKey) => {
      const criticalCount = Number(criticalCountsByDate[dateKey] || 0)
      const positiveCount = Number(positiveCountsByDate[dateKey] || 0)
      const dots = []
      if (positiveCount > 0) dots.push({ color: '#4ECDC4' })
      if (criticalCount > 0) dots.push({ color: '#FF6B6B' })
      if (!dots.length) dots.push({ color: '#FFD166' })
      marks[dateKey] = { marked: true, dots }
    })
    if (selectedDate) {
      marks[selectedDate] = {
        ...(marks[selectedDate] || {}),
        selected: true,
        selectedColor: '#FFD700',
        selectedTextColor: '#0F0F23',
      }
    }
    return marks
  }, [criticalCountsByDate, positiveCountsByDate, selectedDate])

  const renderCalendarDay = useCallback(({ date, state }: any) => {
    const dateKey = date?.dateString
    const isSelected = selectedDate === dateKey
    const isDisabled = state === 'disabled'
    const isToday = state === 'today'
    const criticalCount = dateKey ? criticalCountsByDate[dateKey] : 0
    const positiveCount = dateKey ? positiveCountsByDate[dateKey] : 0
    const showCritical = typeof criticalCount === 'number' && criticalCount > 0
    const showPositive = typeof positiveCount === 'number' && positiveCount > 0
    return (
      <TouchableOpacity
        style={styles.dayCell}
        disabled={!dateKey || isDisabled}
        onPress={() => dateKey && handleCalendarPress(dateKey)}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.dayText,
            isDisabled && styles.dayTextDisabled,
            isToday && styles.dayTextToday,
            isSelected && styles.dayTextSelected,
          ]}
        >
          {date?.day}
        </Text>
        {(showCritical || showPositive) && (
          <View style={styles.dayBadges}>
            {showCritical && (
              <View style={styles.dayBadgeCritical}>
                <Text style={styles.dayBadgeText}>{criticalCount}</Text>
              </View>
            )}
            {showPositive && (
              <View style={styles.dayBadgeStrong}>
                <Text style={styles.dayBadgeText}>{positiveCount}</Text>
              </View>
            )}
          </View>
        )}
      </TouchableOpacity>
    )
  }, [criticalCountsByDate, data?.dailyBadges, handleCalendarPress, selectedDate, positiveCountsByDate])


  const formatEventAreas = useCallback((domains: string[]) => {
    if (!Array.isArray(domains)) return ''
    const normalized = domains.map((domain) => normalizeLifeArea(domain)).filter(Boolean)
    const unique = Array.from(new Set(normalized))
    const ordered = LIFE_AREA_ORDER.filter((area) => unique.includes(area))
    return ordered.map((area) => formatDomainLabel(area, language)).join(', ')
  }, [language])

  const buildEventDetailLines = useCallback((event: ForecastEvent, dateKey: string | null) => {
    if (!dateKey) return []
    const selectedDateObj = parseUTCDateString(dateKey)
    if (!selectedDateObj) return []
    const startDateObj = parseUTCDateString(event.startAt.slice(0, 10))
    const exactDateObj = parseUTCDateString(event.exactAt.slice(0, 10))
    const endDateObj = parseUTCDateString(event.endAt.slice(0, 10))
    const lines: string[] = []
    if (startDateObj && endDateObj) {
      lines.push(
        tr(
          'forecast.detail.window',
          `Janela ${formatDateShortNoYear(startDateObj, language)} - ${formatDateShortNoYear(endDateObj, language)}`,
          {
            start: formatDateShortNoYear(startDateObj, language),
            end: formatDateShortNoYear(endDateObj, language),
          }
        )
      )
    }
    if (startDateObj) {
      lines.push(
        formatEventTimingLabel(
          tr('forecast.phase.starts', 'Comeca'),
          diffDaysUTC(selectedDateObj, startDateObj)
        )
      )
    }
    if (exactDateObj) {
      lines.push(
        formatEventTimingLabel(
          tr('forecast.phase.peak', 'Pico'),
          diffDaysUTC(selectedDateObj, exactDateObj)
        )
      )
    }
    if (endDateObj) {
      lines.push(
        formatEventTimingLabel(
          tr('forecast.phase.ends', 'Termina'),
          diffDaysUTC(selectedDateObj, endDateObj)
        )
      )
    }
    const intensity = Math.round(event.intensity * 100)
    lines.push(tr('forecast.detail.intensity', `Intensidade ${intensity}%`, { value: intensity }))
    if (typeof event.orbMax === 'number') {
      lines.push(
        tr('forecast.detail.orb', `Orb ${event.orbMax.toFixed(1)} deg`, {
          value: event.orbMax.toFixed(1),
        })
      )
    }
    const areas = formatEventAreas(event.domains || [])
    if (areas) {
      lines.push(tr('forecast.detail.affects', `Afeta: ${areas}`, { areas }))
    }
    return lines
  }, [formatEventAreas, formatEventTimingLabel, language, tr])

  const selectedDateKey = selectedDate
  const debouncedFetchDate = useDebouncedValue(selectedDateKey, 150)
  const selectedDateObj = selectedDateKey ? parseUTCDateString(selectedDateKey) : null
  const selectedMonthKey = selectedDateKey ? selectedDateKey.slice(0, 7) : null
  const selectedSeriesKey = useMemo(() => {
    if (!selectedDateKey) return null
    if (effectiveGranularity === 'week') {
      const date = parseUTCDateString(selectedDateKey)
      if (!date) return selectedDateKey
      return buildDateUTCString(startOfWeekUTC(date))
    }
    return selectedDateKey
  }, [selectedDateKey, effectiveGranularity])
  const selectedPoint = selectedSeriesKey ? seriesByDate[selectedSeriesKey] : null
  const selectedDomainKey = selectedDomain ? normalizeLifeArea(selectedDomain) : null
  const dayStatus = selectedDateKey ? dayStatusByDate[selectedDateKey] : null
  const selectedEventsRaw = useMemo(() => {
    if (!selectedDateKey) return []
    const list = data?.events || []
    return list.filter((event) => {
      const startKey = event.startAt?.slice(0, 10) || null
      const endKey = event.endAt?.slice(0, 10) || null
      if (!startKey || !endKey) return event.exactAt?.slice(0, 10) === selectedDateKey
      return isDateKeyWithinRange(selectedDateKey, startKey, endKey)
    })
  }, [data?.events, selectedDateKey])
  const selectedEvents = useMemo(() => {
    const filtered = selectedDomainKey
      ? selectedEventsRaw.filter((event) => (event.domains || []).some((domain) => normalizeLifeArea(domain) === selectedDomainKey))
      : selectedEventsRaw
    return filtered
      .slice()
      .sort((a, b) => eventPriorityScore(b, selectedDateKey) - eventPriorityScore(a, selectedDateKey))
  }, [selectedDomainKey, selectedDateKey, selectedEventsRaw])
  const lifeAreaCards = useMemo(() => {
    return LIFE_AREA_ORDER.map((domain) => {
      const statusArea = dayStatus?.lifeAreas?.[domain]
      const domainPoint = selectedSeriesKey ? domainSeriesByDate[domain]?.[selectedSeriesKey] : null
      const fallbackScore = typeof selectedPoint?.score === 'number' ? selectedPoint.score : null
      const rawScore = typeof statusArea?.percentage === 'number'
        ? statusArea.percentage
        : typeof domainPoint?.score === 'number'
        ? domainPoint.score
        : fallbackScore
      const score = typeof rawScore === 'number' ? Math.round(rawScore) : null
      const transitCount = selectedEventsRaw.filter((event) =>
        (event.domains || []).some((value) => normalizeLifeArea(value) === domain)
      ).length
      const movementRaw = Number(statusArea?.movementScore)
      const attentionRaw = Number(statusArea?.attentionScore)
      const movementFromStatus = Number.isFinite(movementRaw) ? Math.round(Math.max(0, Math.min(100, movementRaw))) : null
      const attentionFromStatus = Number.isFinite(attentionRaw) ? Math.round(Math.max(0, Math.min(100, attentionRaw))) : null
      const movementFallback = Math.min(100, Math.max(0, Math.round(transitCount * 16)))
      const attentionFallback = score === null ? null : Math.min(100, Math.max(0, Math.round(100 - score)))
      return {
        domain,
        score,
        status: statusArea?.status || null,
        movementScore: movementFromStatus ?? movementFallback,
        attentionScore: attentionFromStatus ?? attentionFallback,
        critical: typeof rawScore === 'number' && rawScore < STATUS_THRESHOLDS.criticalBelow,
        transitCount,
      }
    })
  }, [dayStatus, domainSeriesByDate, selectedEventsRaw, selectedPoint, selectedSeriesKey])
  const eventPhaseMap = useMemo(() => {
    if (!selectedDateKey) return {}
    const map: Record<string, { label: string; meta?: string }> = {}

    // A fase é derivada AQUI, dos próprios eventos.
    //
    // Antes vinha pronta do servidor em `eventPhasesByDate`, um mapa dia -> fases
    // que é O(dias × eventos). Depois que as janelas passaram a ter tamanho real
    // (um trânsito de Plutão dura ~1 ano por passagem), todo evento lento cobria
    // todo dia: 360 × 30 ≈ 10.800 entradas, perto do limite de 1 MiB do doc do
    // Firestore — e o write falha em silêncio. Como cada evento já traz
    // startAt/exactAt/endAt, o mapa era redundante.
    const dia = new Date(`${selectedDateKey}T12:00:00Z`).getTime()
    if (!Number.isFinite(dia)) return map

    ;(data?.events || []).forEach((event: any) => {
      if (!event?.id) return
      const inicio = new Date(event.startAt).getTime()
      const fim = new Date(event.endAt).getTime()
      const pico = new Date(event.exactAt).getTime()
      if (!Number.isFinite(inicio) || !Number.isFinite(fim) || !Number.isFinite(pico)) return
      if (dia < inicio || dia > fim) return

      const delta = Math.round((pico - dia) / 86400000)
      if (delta > 0) {
        map[event.id] = {
          label: tr('forecast.phase.approaching', 'Em aprox'),
          // Fallback com valor embutido: quando a chave i18n falta, tr devolve o
          // fallback CRU (não interpola {days}) — por isso usar template literal.
          meta: tr('forecast.phase.inDays', `faltam ${delta} dias`, { days: delta }),
        }
      } else if (delta < 0) {
        map[event.id] = {
          label: tr('forecast.phase.separating', 'Afastando'),
          meta: tr('forecast.phase.daysAgo', `ha ${Math.abs(delta)} dias`, { days: Math.abs(delta) }),
        }
      } else {
        map[event.id] = { label: tr('forecast.phase.peak', 'Pico'), meta: tr('forecast.phase.today', 'hoje') }
      }
    })
    return map
  }, [data?.events, selectedDateKey, tr])

  const eventDisplayData = useMemo(() => {
    if (!selectedDateKey) return []
    const localizedImpactLabel = (impact: ForecastEvent['impact']) => {
      if (impact === 'UP') return tr('forecast.impact.up', 'Positivo')
      if (impact === 'DOWN') return tr('forecast.impact.down', 'Desafiador')
      return tr('forecast.impact.mixed', 'Misto')
    }
    const localizedActionHint = (event: ForecastEvent) => {
      const aspect = String(event.aspect || '').toLowerCase()
      if (/conjuncao/.test(aspect)) return tr('forecast.action.conjunction', 'Acao sugerida: concentre energia em uma prioridade unica.')
      if (/trigono|sextil/.test(aspect)) return tr('forecast.action.harmonic', 'Acao sugerida: aproveite para concluir uma entrega importante.')
      if (/quadratura|oposicao|quincuncio|semi/.test(aspect)) return tr('forecast.action.tense', 'Acao sugerida: reduza friccao e renegocie o que estiver pesado.')
      if (event.impact === 'UP') return tr('forecast.action.up', 'Acao sugerida: avance em uma decisao pratica.')
      if (event.impact === 'DOWN') return tr('forecast.action.down', 'Acao sugerida: reduzir excesso e ajustar rota.')
      return tr('forecast.action.default', 'Acao sugerida: testar em pequeno passo antes de ampliar.')
    }
    return selectedEvents.map((event) => {
      const detailLines = buildEventDetailLines(event, selectedDateKey)
      const actionHint = localizedActionHint(event)
      const orbLine =
        typeof event.orbMax === 'number'
          ? tr('forecast.detail.orb', `Orb ${event.orbMax.toFixed(1)} deg`, {
              value: event.orbMax.toFixed(1),
            })
          : ''
      const intensityLine = tr(
        'forecast.detail.intensity',
        `Intensidade ${Math.round((event.intensity || 0) * 100)}%`,
        { value: Math.round((event.intensity || 0) * 100) }
      )
      const metaText = [orbLine, intensityLine].filter(Boolean).join(' • ')
      const statusLabel = localizedImpactLabel(event.impact)
      const statusColor = event.impact === 'UP' ? '#22C55E' : event.impact === 'DOWN' ? '#EF4444' : '#D97706'
      const impactValue01 = Math.max(0.08, Math.min(1, Number(event.intensity || 0)))
      const unifiedNarrative = buildUnifiedTransitNarrative(
        {
          transitPlanet: event.transitPlanet,
          aspectName: event.aspect,
          natalPlanet: event.natalPoint,
        },
        (event.domains || []).map((d) => formatDomainLabel(d, language as AppLanguage)).slice(0, 1).join(', ') || 'previsoes',
        language
      )
      return {
        event,
        title: buildEventTitle(event, language),
        statusLabel,
        statusColor,
        phase: eventPhaseMap[event.id] || buildEventPhase(selectedDateKey, event),
        directText: unifiedNarrative.shortText || buildDirectEventText(event, language),
        actionHint,
        metaText,
        impactValue01,
        impactLabel: tr(
          'forecast.detail.relativeImpact',
          `Impacto relativo ${Math.round(impactValue01 * 100)}%`,
          { value: Math.round(impactValue01 * 100) }
        ),
      }
    })
  }, [buildEventDetailLines, eventPhaseMap, selectedDateKey, selectedEvents, tr, language])

  useEffect(() => {
    if (!debouncedFetchDate) return
    if (!isDateInRange(debouncedFetchDate)) return
    fetchDayStatus(debouncedFetchDate, true)
  }, [debouncedFetchDate, isDateInRange, fetchDayStatus])

  useEffect(() => {
    if (!selectedDateKey) return
    if (periodDays > 30) return
    if (pendingPrefetchRef.current) clearTimeout(pendingPrefetchRef.current)
    pendingPrefetchRef.current = setTimeout(() => {
      InteractionManager.runAfterInteractions(() => {
        const current = parseUTCDateString(selectedDateKey)
        if (!current) return
        const prevKey = buildDateUTCString(addDaysUTC(current, -1))
        const nextKey = buildDateUTCString(addDaysUTC(current, 1))
        if (isDateInRange(prevKey)) fetchDayStatus(prevKey)
        if (isDateInRange(nextKey)) fetchDayStatus(nextKey)
      })
    }, 150)
    return () => {
      if (pendingPrefetchRef.current) clearTimeout(pendingPrefetchRef.current)
    }
  }, [selectedDateKey, fetchDayStatus, isDateInRange, periodDays])

  useEffect(() => {
    setSelectedEventDetailId(null)
  }, [selectedDateKey])

  const openEventDetail = useCallback((eventId: string) => {
    setSelectedEventDetailId(eventId)
  }, [])

  const handleSelectDomain = useCallback((domain: string | null) => {
    setSelectedDomain(domain)
  }, [])

  const handleSelectPeriod = (days: number) => {
    if (days > maxDaysAllowed) {
      Alert.alert(
        tr('forecast.alert.premiumTitle', 'Premium'),
        tr('forecast.alert.premiumPeriod', 'Seu plano atual nao libera este periodo')
      )
      navigation.navigate('Premium' as never)
      return
    }
    setPeriodDays(days)
  }


  return (
    <View style={styles.container}>
      {expiryInfo.show && (
          <ExpiryBanner
            message={expiryMessage}
            variant={expiryInfo.variant}
            onPress={() => (navigation as any).navigate('Premium', { openTab: 'features' })}
          />
      )}

      {/* Menu da aba Previsões: Momento Certo | Gráfico | Calendário */}
      <View style={styles.topMenu}>
        {([
          ['momento', tr('forecast.tab.moment', 'Momento Certo')],
          ['grafico', tr('forecast.view.graph', 'Gráfico')],
          ['calendario', tr('forecast.view.calendar', 'Calendário')],
        ] as const).map(([k, lbl]) => {
          const on = forecastView === k
          return (
            <TouchableOpacity key={k} style={[styles.topMenuBtn, on && styles.topMenuBtnActive]} activeOpacity={0.85} onPress={() => setForecastView(k)}>
              <Text style={[styles.topMenuText, on && styles.topMenuTextActive]} numberOfLines={1}>{lbl}</Text>
            </TouchableOpacity>
          )
        })}
      </View>

      {forecastView === 'momento' ? (
        <View style={{ flex: 1 }}>
          <TouchableOpacity onPress={openForecastTour} style={styles.momentoHelpBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="help-circle-outline" size={22} color="#FFD700" />
          </TouchableOpacity>
          <MomentoCertoView premium={isPremium} initialIntention={momentoIntention} />
        </View>
      ) : (
      <>
      <View style={styles.periodRow} {...aPeriod}>
        <TouchableOpacity onPress={openForecastTour} style={{ padding: 6, marginRight: 4 }} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="help-circle-outline" size={20} color="#FFD700" />
        </TouchableOpacity>
        <View style={styles.periodButtonsWrap}>
          {PERIODS.map((days) => {
            const locked = days > maxDaysAllowed
            const selected = periodDays === days
            return (
              <TouchableOpacity
                key={days}
                style={[styles.periodButton, selected && styles.periodButtonActive, locked && styles.periodButtonLocked]}
                onPress={() => handleSelectPeriod(days)}
              >
                <Text style={[styles.periodText, selected && styles.periodTextActive]}>{days}d</Text>
                {locked && <Ionicons name="lock-closed" size={12} color="#888" />}
              </TouchableOpacity>
            )
          })}
        </View>
        <View style={styles.planBadge}>
          <Text style={styles.planBadgeText}>
            {tr('forecast.currentPlan', 'Plano atual: {plan}', { plan: currentPlan.name })}
          </Text>
        </View>
      </View>

      {limitedBanner && (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>
            {rangeFrom && rangeTo
              ? tr(
                  'forecast.banner.range',
                  `Mostrando ${formatDateShort(rangeFrom, language)} - ${formatDateShort(rangeTo, language)} (Premium desbloqueia 30/90/360)`,
                  {
                    from: formatDateShort(rangeFrom, language),
                    to: formatDateShort(rangeTo, language),
                  }
                )
              : tr(
                  'forecast.banner.default',
                  'Mostrando 7 dias (Premium desbloqueia 30/90/360)'
                )}
          </Text>
        </View>
      )}

      {loading && (
        <View style={styles.loading}>
          <StarLoader size={34} color="#FFD700" />
          <Text style={styles.loadingText}>
            {tr('forecast.loading', 'Carregando previsoes...')}
          </Text>
        </View>
      )}

      {!loading && error && (
        <View style={styles.error}>
          <Text style={styles.errorText}>{error}</Text>
          {missingBirthData && (
            <TouchableOpacity style={styles.retryButton} onPress={() => navigation.navigate('Settings' as never)}>
              <Text style={styles.retryText}>
                {tr('forecast.completeBirth', 'Completar nascimento')}
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.retryButton} onPress={() => fetchForecast(true)}>
            <Text style={styles.retryText}>{tr('forecast.retry', 'Tentar novamente')}</Text>
          </TouchableOpacity>
        </View>
      )}

      {!loading && !error && !data && (
        <View style={styles.emptyState}>
          <Ionicons name="telescope-outline" size={40} color="#FFD700" style={{ opacity: 0.4 }} />
          <Text style={styles.emptyStateText}>
            {tr('forecast.noData', 'Nenhuma previsão disponível. Tente novamente.')}
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => fetchForecast(true)}>
            <Text style={styles.retryText}>{tr('forecast.retry', 'Tentar novamente')}</Text>
          </TouchableOpacity>
        </View>
      )}

      {!loading && !error && data && (
        <ScrollView ref={forecastScrollRef} contentContainerStyle={styles.content}>
          {/* Resumo por área (Amor/Saúde/...) — de volta ao topo, mas COLAPSÁVEL:
              fechado por padrão pra não empurrar o gráfico; abre ao tocar. */}
          <View style={styles.areaSummarySection} {...aSummary}>
            <View style={styles.areaSummaryHeaderRow}>
              <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center', flex: 1, minWidth: 0 }}
                activeOpacity={0.8}
                onPress={() => setAreaSummaryOpen((o) => !o)}
                accessibilityRole="button"
              >
                <Ionicons name="sparkles-outline" size={16} color="#FFD700" />
                <Text style={styles.areaSummaryTitle} numberOfLines={1}>
                  {tr('forecast.areaSummary.titleShort', `Próximos ${periodDays} dias`, { days: periodDays })}
                </Text>
                <Ionicons name={areaSummaryOpen ? 'chevron-up' : 'chevron-down'} size={16} color="#888" style={{ marginLeft: 6 }} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.timelineButton}
                onPress={() => { try { (navigation as any).navigate('AstrologyAnalysis') } catch { } }}
                activeOpacity={0.75}
                accessibilityRole="button"
              >
                <Ionicons name="time-outline" size={14} color="#0F0F23" />
                <Text style={styles.timelineButtonText} numberOfLines={1}>
                  {tr('forecast.timeline.button', 'Linha do tempo')}
                </Text>
              </TouchableOpacity>
            </View>
            {areaSummaryOpen && (
              <>
                {areaSummaryLoading && !areaSummary && (
                  <Text style={styles.areaSummaryHint}>{tr('forecast.areaSummary.loading', 'Lendo seus trânsitos...')}</Text>
                )}
                {areaSummaryDegraded && (
                  <Text style={styles.areaSummaryHint}>
                    {tr('forecast.areaSummary.degraded', 'Resumo indisponível no momento. Tente novamente em instantes.')}
                  </Text>
                )}
                {areaSummary?.areas?.map((a) => {
                  const color = areaBandColor(a.currentBand)
                  const d = a.dominantDriver
                  const driverLine = d
                    ? `${d.transitPlanetPt || d.transitPlanet || ''} ${d.aspectPt || d.aspect || ''} ${d.natalTarget || ''}`.trim() + (d.house ? ` · casa ${d.house}` : '')
                    : ''
                  const expanded = expandedArea === a.area
                  return (
                    <TouchableOpacity
                      key={a.area}
                      activeOpacity={0.85}
                      style={styles.areaSummaryCard}
                      onPress={() => setExpandedArea(expanded ? null : a.area)}
                    >
                      <View style={styles.areaSummaryCardHeader}>
                        <View style={[styles.areaBandDot, { backgroundColor: color }]} />
                        <Text style={styles.areaSummaryCardTitle}>{a.areaLabel || formatDomainLabel(a.area, language)}</Text>
                        <View style={{ flex: 1 }} />
                        <Text style={[styles.areaBandLabel, { color }]}>
                          {a.currentBand}{a.currentPct != null ? ` · ${a.currentPct}%` : ''}
                        </Text>
                        <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={14} color="#888" style={{ marginLeft: 6 }} />
                      </View>
                      {!!driverLine && <Text style={styles.areaSummaryDriver}>{driverLine}</Text>}
                      <Text style={styles.areaSummaryText} numberOfLines={expanded ? undefined : 2}>
                        {a.reading || a.verdict || ''}
                      </Text>
                    </TouchableOpacity>
                  )
                })}
                {areaSummary?.limited && (
                  <Text style={styles.areaSummaryHint}>
                    {tr('forecast.areaSummary.limited', 'Horizonte maior disponível em planos superiores.')}
                  </Text>
                )}
              </>
            )}
          </View>
          <View style={styles.calendarWrapper} {...aView}>
            {forecastView === 'grafico' ? (
              <ForecastEphemerisChart
                events={(data?.events as any) || []}
                rangeFrom={data?.range?.from || rangeFromStr || ''}
                rangeTo={data?.range?.to || rangeToStr || ''}
                language={language}
                onSelectEvent={(id, dateKey) => {
                  // Tocar numa barra: foca o dia do pico (para o modal resolver o
                  // evento pela lista do dia) e abre a leitura do aspecto.
                  if (dateKey) setSelectedDate(dateKey)
                  openEventDetail(id)
                }}
              />
            ) : (
            <MemoCalendar
              locale={language}
              markingType="multi-dot"
              current={selectedMonthKey || selectedDateKey || rangeFromStr || undefined}
              minDate={rangeFromStr || undefined}
              maxDate={rangeToStr || undefined}
              markedDates={calendarMarkedDates}
              dayComponent={renderCalendarDay}
              onDayPress={(day: any) => {
                if (day?.dateString) handleCalendarPress(day.dateString)
              }}
              theme={{
                backgroundColor: '#1C1C1E',
                calendarBackground: '#1C1C1E',
                dayTextColor: '#FFFFFF',
                monthTextColor: '#FFFFFF',
                textDisabledColor: '#555',
                arrowColor: '#FFD700',
                todayTextColor: '#FFD700',
                selectedDayBackgroundColor: '#FFD700',
                selectedDayTextColor: '#0F0F23',
              }}
            />
            )}
            {dayRangeError && (
              <View style={styles.dayRangeWarning}>
                <Text style={styles.dayRangeWarningText}>
                  {tr('forecast.dayRangeError', 'Detalhes diários indisponíveis no momento.')}
                </Text>
              </View>
            )}
          </View>
          <View style={styles.dayPanel} {...aEvents}>
            <View style={styles.dayTitleRow}>
              <View style={styles.dayNavColLeft}>
                <TouchableOpacity
                  style={styles.dayNavButton}
                  onPress={() => {
                if (!selectedDateObj) return
                const prevDate = buildDateUTCString(addDaysUTC(selectedDateObj, -1))
                if (!isDateInRange(prevDate)) return
                handleSelectDate(prevDate)
              }}
            >
                  <Ionicons name="chevron-back" size={16} color="#FFD700" />
                </TouchableOpacity>
              </View>
              <View style={styles.dayNavColCenter}>
                <Text style={styles.dayPanelTitle}>
                  {selectedDateObj
                    ? tr('forecast.statusDayWithDate', `Status do Dia ${formatDateShort(selectedDateObj, language)}`, {
                        date: formatDateShort(selectedDateObj, language),
                      })
                    : tr('forecast.statusDay', 'Status do dia')}
                </Text>
              </View>
              <View style={styles.dayNavColRight}>
                <TouchableOpacity
                  style={styles.dayNavButton}
                  onPress={() => {
                    if (!selectedDateObj) return
                    const nextDate = buildDateUTCString(addDaysUTC(selectedDateObj, 1))
                    if (!isDateInRange(nextDate)) return
                    handleSelectDate(nextDate)
                  }}
                >
                  <Ionicons name="chevron-forward" size={16} color="#FFD700" />
                </TouchableOpacity>
              </View>
            </View>
            <MemoDaySummary
              isLoading={dayStatusLoadingDate === selectedDateKey}
              dayStatus={dayStatus}
              selectedPoint={selectedPoint}
              lifeAreaCards={lifeAreaCards}
              selectedDomainKey={selectedDomainKey}
              onSelectDomain={handleSelectDomain}
              resolveScoreLabel={resolveScoreLabel}
              resolveDomainLabel={resolveDomainLabel}
              globalStatusLabel={tr('forecast.globalStatus', 'Status Geral')}
              noDataLabel={tr('forecast.noDataForDay', 'Sem dados para o dia selecionado.')}
            />

            <MemoDayEvents
              selectedEventsCount={selectedEvents.length}
              eventDisplayData={eventDisplayData}
              onOpenEventDetail={openEventDetail}
              dayEventsLabel={tr('forecast.dayEvents', 'Eventos do dia')}
              noEventsLabel={tr(
                'forecast.noEventsForDay',
                'Sem eventos. Dia mais calmo para organizar suas prioridades.'
              )}
            />
          </View>

          {maxDaysAllowed < 360 && (
            <TouchableOpacity style={styles.cta} onPress={() => navigation.navigate('Premium' as never)}>
              <Text style={styles.ctaText}>
                {tr('forecast.unlockFull', 'Desbloquear previsoes completas')}
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      )}
      </>
      )}
      {(() => {
        const detail = eventDisplayData.find((item) => item.event.id === selectedEventDetailId) || null
        if (!detail) return null
        const fullText = buildFullEventInterpretation(
          detail.event,
          buildEventDetailLines(detail.event, selectedDateKey || detail.event.exactAt.slice(0, 10)),
          language
        )
        // Topo do modal: a JANELA do evento (período) + o pico — antes só mostrava
        // "Pico - hoje", que escondia quando o trânsito começa e termina.
        const winStart = parseUTCDateString((detail.event.startAt || '').slice(0, 10))
        const winEnd = parseUTCDateString((detail.event.endAt || '').slice(0, 10))
        const windowLabel = winStart && winEnd
          ? `${formatDateShortNoYear(winStart, language)} – ${formatDateShortNoYear(winEnd, language)}`
          : ''
        const peakLabel = detail.phase
          ? `${detail.phase.label}${detail.phase.meta ? ` ${detail.phase.meta}` : ''}`
          : ''
        const timingLabel = [windowLabel, peakLabel].filter(Boolean).join(' · ') || null
        return (
          <ReadingDetailModal
            visible={!!selectedEventDetailId}
            onClose={() => setSelectedEventDetailId(null)}
            statusLabel={detail.statusLabel}
            statusColor={detail.statusColor}
            title={detail.title}
            timingLabel={timingLabel}
            directText={detail.directText}
            fullText={fullText}
            actionText={detail.actionHint}
            metaText={detail.metaText}
            keywords={buildEventKeywords(detail.event, detail.phase?.label || null, language)}
          />
        )
      })()}
    </View>
  )
}

function eventPriorityScore(event: ForecastEvent, selectedDate: string | null) {
  const intensity = Math.max(0, Number(event.intensity || 0))
  let score = intensity * 100

  if (event.impact === 'DOWN') score += 24
  else if (event.impact === 'UP') score += 14
  else score += 8

  const exactDateObj = parseUTCDateString((event.exactAt || '').slice(0, 10))
  const selectedDateObj = selectedDate ? parseUTCDateString(selectedDate) : null
  if (exactDateObj && selectedDateObj) {
    const delta = Math.abs(diffDaysUTC(selectedDateObj, exactDateObj))
    if (delta === 0) score += 18
    else if (delta <= 2) score += 10
    else if (delta <= 5) score += 4
  }

  if (typeof event.orbMax === 'number' && Number.isFinite(event.orbMax)) {
    const tightness = Math.max(0, 3 - event.orbMax) * 4
    score += tightness
  }

  return score
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F23',
  },
  header: {
    padding: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  planBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#2A2A2E',
  },
  planBadgeText: {
    color: '#FFD700',
    fontSize: 11,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 13,
    color: '#B0B0B0',
    marginTop: 6,
  },
  periodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    paddingHorizontal: 16,
    gap: 8,
  },
  periodButtonsWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 1,
  },
  periodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#1C1C1E',
  },
  periodButtonActive: {
    backgroundColor: '#FFD700',
  },
  periodButtonLocked: {
    opacity: 0.6,
  },
  periodText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  periodTextActive: {
    color: '#0F0F23',
  },
  banner: {
    margin: 16,
    padding: 10,
    backgroundColor: '#2E2E3E',
    borderRadius: 10,
  },
  bannerText: {
    color: '#FFD700',
    fontSize: 12,
  },
  loading: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    color: '#B0B0B0',
    marginTop: 8,
  },
  error: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    color: '#FF6B6B',
    marginBottom: 8,
  },
  retryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#FFD700',
  },
  emptyState: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingVertical: 64,
    paddingHorizontal: 32,
    gap: 16,
  },
  emptyStateText: {
    color: '#AAAAAA',
    fontSize: 14,
    textAlign: 'center' as const,
    lineHeight: 22,
  },
  retryText: {
    color: '#0F0F23',
    fontWeight: '700',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
    marginTop: 18,
  },
  miniGraph: {
    flexGrow: 0,
  },
  pointCard: {
    width: 70,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#1C1C1E',
    marginRight: 10,
    alignItems: 'center',
  },
  pointDate: {
    color: '#B0B0B0',
    fontSize: 11,
    marginBottom: 4,
  },
  pointScore: {
    fontSize: 20,
    fontWeight: '700',
  },
  pointLabel: {
    color: '#FFFFFF',
    fontSize: 11,
    marginTop: 4,
  },
  eventCard: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#1C1C1E',
    marginBottom: 8,
  },
  eventTitle: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  eventMeta: {
    color: '#B0B0B0',
    marginTop: 4,
    fontSize: 12,
  },
  eventPhase: {
    color: '#FFD700',
    fontSize: 12,
    marginTop: 4,
  },
  eventToggle: {
    marginTop: 10,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#2A2A2E',
  },
  eventToggleText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '700',
  },
  eventExtra: {
    marginTop: 10,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#2A2A2E',
    paddingTop: 10,
  },
  eventExtraTitle: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  eventExtraText: {
    color: '#D2D2D7',
    fontSize: 12,
    lineHeight: 18,
  },
  eventFullToggle: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#3A3A42',
  },
  eventFullToggleText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '700',
  },
  eventFullBox: {
    gap: 8,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#141418',
    borderWidth: 1,
    borderColor: '#2A2A2E',
  },
  eventFullAction: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyText: {
    color: '#808080',
    fontSize: 12,
  },
  calendarWrapper: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    padding: 8,
  },
  momentoHelpBtn: { position: 'absolute', right: 12, top: 8, zIndex: 10, padding: 6 },
  topMenu: {
    flexDirection: 'row',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 14,
    padding: 4,
    marginHorizontal: 12,
    marginTop: 8,
    marginBottom: 4,
  },
  topMenuBtn: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 9, borderRadius: 10 },
  topMenuBtnActive: { backgroundColor: '#FFD700' },
  topMenuText: { color: '#B9BAD6', fontSize: 13, fontWeight: '700' },
  topMenuTextActive: { color: '#0F0F23', fontWeight: '800' },
  forecastViewToggle: {
    flexDirection: 'row',
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 20,
    padding: 3,
    marginBottom: 10,
  },
  forecastViewBtn: {
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 18,
  },
  forecastViewBtnActive: {
    backgroundColor: '#FFD700',
  },
  forecastViewText: {
    color: '#8892a4',
    fontSize: 13,
    fontWeight: '700',
  },
  forecastViewTextActive: {
    color: '#1A1A1A',
  },
  dayRangeWarning: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255, 200, 0, 0.08)',
    borderRadius: 8,
    borderLeftWidth: 2,
    borderLeftColor: '#FFD700',
  },
  dayRangeWarningText: {
    color: '#FFD700',
    fontSize: 12,
    opacity: 0.8,
  },
  criticalSummary: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
  },
  criticalTitle: {
    color: '#FF6B6B',
    fontWeight: '700',
    marginBottom: 6,
  },
  criticalRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  criticalChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#2A2A2E',
  },
  criticalChipText: {
    color: '#FFFFFF',
    fontSize: 11,
  },
  criticalChipCount: {
    color: '#FF6B6B',
    fontSize: 11,
    fontWeight: '700',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendBadgeCritical: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF6B6B',
  },
  legendBadgeStrong: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFD700',
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    color: '#B0B0B0',
    fontSize: 12,
  },
  calendarFilters: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  calendarFilterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#1C1C1E',
  },
  calendarFilterButtonActive: {
    backgroundColor: '#FFD700',
  },
  calendarFilterText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  calendarFilterTextActive: {
    color: '#0F0F23',
  },
  dayCell: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 36,
  },
  dayCellCritical: {
    backgroundColor: '#2B1B1B',
    borderRadius: 10,
  },
  dayText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  dayTextDisabled: {
    color: '#555',
  },
  dayTextToday: {
    color: '#FFD700',
  },
  dayTextSelected: {
    color: '#0F0F23',
    backgroundColor: '#FFD700',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    overflow: 'hidden',
  },
  dayBadges: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 4,
  },
  dayBadgeCritical: {
    minWidth: 16,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 8,
    backgroundColor: '#FF6B6B',
    alignItems: 'center',
  },
  dayBadgeStrong: {
    minWidth: 16,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 8,
    backgroundColor: '#22C55E',
    alignItems: 'center',
  },
  dayBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
  weeklySummary: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
  },
  weeklyTitle: {
    color: '#FFD700',
    fontWeight: '700',
    marginBottom: 6,
  },
  weeklyItem: {
    color: '#FFFFFF',
    fontSize: 12,
    marginBottom: 4,
  },
  dayTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dayPanel: {
    marginTop: 16,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#1C1C1E',
  },
  dayPanelTitle: {
    color: '#FFFFFF',
    fontWeight: '700',
    marginBottom: 0,
    textAlign: 'center',
  },
  dayNavColLeft: {
    flex: 1,
    alignItems: 'flex-start',
  },
  dayNavColCenter: {
    flex: 1,
    alignItems: 'center',
  },
  dayNavColRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  dayNavButton: {
    padding: 4,
    borderRadius: 6,
    backgroundColor: '#2A2A2E',
  },
  dayPanelCard: {
    marginBottom: 12,
  },
  dayPanelLabel: {
    color: '#B0B0B0',
    fontSize: 12,
    marginBottom: 6,
  },
  dayScoreRow: {
    gap: 4,
    marginBottom: 4,
  },
  dayScoreLine: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'baseline',
    gap: 4,
  },
  dayScoreValue: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  dayPanelScore: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 6,
  },
  dayScoreLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  dayScorePrefix: {
    color: '#B0B0B0',
    fontSize: 12,
    fontWeight: '600',
  },
  domainSection: {
    marginBottom: 12,
  },
  areaSummarySection: {
    marginBottom: 16,
  },
  areaSummaryHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  timelineButton: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFD700',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    flexShrink: 0,
  },
  timelineButtonText: {
    color: '#0F0F23',
    fontSize: 11,
    fontWeight: '700',
  },
  areaSummaryTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 6,
    flexShrink: 1,
  },
  areaSummaryHint: {
    color: '#888',
    fontSize: 12,
    marginTop: 4,
  },
  areaSummaryCard: {
    backgroundColor: '#1A1A3A',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  areaSummaryCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  areaBandDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  areaSummaryCardTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  areaBandLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  areaSummaryDriver: {
    color: '#B0B0B0',
    fontSize: 12,
    marginTop: 6,
    fontStyle: 'italic',
  },
  areaSummaryText: {
    color: '#D8D8E0',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 6,
  },
  eventHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  filterActiveText: {
    color: '#B0B0B0',
    fontSize: 12,
    fontWeight: '600',
  },
  filterButtonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
    paddingRight: 8,
  },
  filterChip: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: '#2A2A2E',
    borderWidth: 1,
    borderColor: '#3A3A42',
  },
  filterChipText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  filterChipClear: {
    borderColor: '#FFD700',
  },
  filterModalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    padding: 16,
  },
  filterModalCard: {
    backgroundColor: '#1C1C1E',
    borderWidth: 1,
    borderColor: '#2A2A2E',
    borderRadius: 14,
    maxHeight: '78%',
    overflow: 'hidden',
  },
  filterModalHeader: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2E',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  filterModalTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  filterModalBody: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  filterOption: {
    minHeight: 42,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#2A2A2E',
    backgroundColor: '#141418',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  filterOptionSelected: {
    borderColor: '#FFD700',
    backgroundColor: '#2A2A2E',
  },
  filterOptionText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  filterOptionTextSelected: {
    color: '#FFD700',
  },
  periodEventsSection: {
    marginTop: 16,
    marginBottom: 12,
  },
  periodEventsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  periodEventsToggle: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '700',
  },
  periodDayBlock: {
    marginTop: 10,
    padding: 10,
    borderRadius: 12,
    backgroundColor: '#1C1C1E',
  },
  periodSkeleton: {
    marginTop: 8,
    gap: 8,
  },
  periodSkeletonLine: {
    height: 14,
    borderRadius: 8,
    backgroundColor: '#2A2A2E',
  },
  periodSkeletonLineShort: {
    height: 12,
    width: '60%',
    borderRadius: 8,
    backgroundColor: '#2A2A2E',
  },
  periodDayTitle: {
    color: '#FFFFFF',
    fontWeight: '700',
    marginBottom: 6,
  },
  eventCardSmall: {
    paddingVertical: 6,
  },
  periodPagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  periodPageButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#2A2A2E',
  },
  periodPageButtonDisabled: {
    opacity: 0.5,
  },
  periodPageText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '700',
  },
  periodPageLabel: {
    color: '#B0B0B0',
    fontSize: 12,
  },
  updatedAtText: {
    color: '#FFD700',
    fontSize: 11,
    marginBottom: 8,
  },
  daySkeleton: {
    marginTop: 6,
    gap: 6,
  },
  daySkeletonLine: {
    height: 18,
    borderRadius: 8,
    backgroundColor: '#2A2A2E',
  },
  daySkeletonLineShort: {
    height: 12,
    width: '60%',
    borderRadius: 8,
    backgroundColor: '#2A2A2E',
  },
  periodIndexText: {
    color: '#B0B0B0',
    fontSize: 11,
    marginBottom: 4,
  },
  domainRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  areaPillGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  areaPillWrapper: {
    flexBasis: '48%',
    maxWidth: '48%',
  },
  areaPillSelected: {
    borderWidth: 2,
    borderColor: '#FFD700',
    borderRadius: 12,
  },
  areaPill: {
    borderRadius: 12,
    paddingVertical: 5,
    paddingHorizontal: 8,
    minHeight: 58,
    justifyContent: 'center',
  },
  areaPillActive: {
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  areaPillLabel: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 4,
  },
  areaPillValue: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 3,
  },
  areaAxisRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 1,
  },
  areaAxisLabel: {
    width: 10,
    color: 'rgba(255,255,255,0.8)',
    fontSize: 9,
    fontWeight: '700',
  },
  areaAxisTrack: {
    flex: 1,
    height: 3,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.2)',
    overflow: 'hidden',
  },
  areaAxisFill: {
    height: '100%',
    borderRadius: 999,
  },
  areaAxisFillMovement: {
    backgroundColor: STATUS_AXIS_COLORS.movement,
  },
  areaAxisFillAttention: {
    backgroundColor: STATUS_AXIS_COLORS.attention,
  },
  areaAxisValue: {
    minWidth: 22,
    textAlign: 'right',
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
  domainChip: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
    backgroundColor: '#2A2A2E',
  },
  domainChipActive: {
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  domainChipText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  domainChipTextActive: {
    color: '#FFFFFF',
  },
  readingBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(2,6,23,0.78)',
    justifyContent: 'center',
    padding: 16,
  },
  readingCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    padding: 14,
    gap: 10,
  },
  readingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  readingStatusBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  readingStatusText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  readingCloseIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E2E8F0',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  readingTitle: {
    color: '#0F172A',
    fontSize: 21,
    fontWeight: '800',
  },
  readingTiming: {
    color: '#475569',
    fontSize: 13,
    fontWeight: '700',
  },
  readingSectionTitle: {
    color: '#B45309',
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    marginTop: 2,
  },
  readingDirect: {
    color: '#0F172A',
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600',
  },
  readingFull: {
    color: '#1E293B',
    fontSize: 15,
    lineHeight: 23,
  },
  readingAction: {
    color: '#B45309',
    fontWeight: '700',
    fontSize: 13,
  },
  readingMeta: {
    color: '#64748B',
    fontSize: 12,
  },
  readingCloseButton: {
    marginTop: 4,
    backgroundColor: '#0F172A',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  readingCloseButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  cta: {
    marginTop: 20,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#FFD700',
    alignItems: 'center',
  },
  ctaText: {
    color: '#0F0F23',
    fontWeight: '700',
  },
})




