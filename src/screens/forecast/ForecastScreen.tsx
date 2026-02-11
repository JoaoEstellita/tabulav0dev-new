import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ActivityIndicator, Alert, InteractionManager, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useAuth } from '../../hooks/useAuth'
import { useSubscriptionCheck } from '../../hooks/useSubscriptionCheck'
import { useNavigation } from '@react-navigation/native'
import { Calendar } from 'react-native-calendars'
import AsyncStorage from '@react-native-async-storage/async-storage'
import ExpiryBanner from '../../components/ExpiryBanner'
import TransitInsightCard from '../../components/TransitInsightCard'
import ReadingDetailModal from '../../components/ReadingDetailModal'
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
import { buildAstroTransitNarrative } from '../../utils/astroInterpretation'

const BACKEND_URL = (process.env.EXPO_PUBLIC_BACKEND_URL || 'https://tabulav0dev-backend.vercel.app').replace(/\/$/, '')

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
  lifeAreas: Record<string, { percentage: number | null; status: string | null }>
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
const MONTHS_PT = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

const FORECAST_SELECTED_DATE_KEY = 'forecast_selected_date'
const FORECAST_CACHE_PREFIX = 'forecast_cache_v2'
const FORECAST_CACHE_TTL_MS = 10 * 60 * 1000
const FORECAST_DAY_STATUS_CACHE_PREFIX = 'forecast_day_status_v2'
const FORECAST_DAY_STATUS_CACHE_TTL_MS = 5 * 60 * 1000
const FORECAST_DAY_STATUS_RANGE_CACHE_PREFIX = 'forecast_day_status_range_v2'
const FORECAST_DAY_STATUS_RANGE_CACHE_TTL_MS = 10 * 60 * 1000

function labelFromScoreValue(score: number | null) {
  if (typeof score !== 'number') return '--'
  if (score < STATUS_THRESHOLDS.criticalBelow) return 'Critico'
  if (score >= STATUS_THRESHOLDS.positiveAbove) return 'Positivo'
  return 'Neutro'
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

function formatDateShort(date: Date) {
  const day = String(date.getUTCDate()).padStart(2, '0')
  const month = MONTHS_PT[date.getUTCMonth()]
  const year = date.getUTCFullYear()
  return `${day} ${month} ${year}`
}

function formatDateShortNoYear(date: Date) {
  const day = String(date.getUTCDate()).padStart(2, '0')
  const month = MONTHS_PT[date.getUTCMonth()]
  return `${day} ${month}`
}

function impactLabel(impact: ForecastEvent['impact']) {
  if (impact === 'UP') return 'Positivo'
  if (impact === 'DOWN') return 'Desafiador'
  return 'Misto'
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

function buildEventTitle(event: ForecastEvent) {
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
  })
}

function buildDirectEventText(event: ForecastEvent) {
  const domain = (event.domains || []).map((item) => formatDomainLabel(item)).slice(0, 1).join(', ')
  const narrative = buildAstroTransitNarrative(
    {
      transitPlanet: event.transitPlanet,
      aspectName: event.aspect,
      natalPlanet: event.natalPoint,
    },
    domain || 'previsoes'
  )
  return narrative.directText
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

function buildEventKeywords(event: ForecastEvent, phaseLabel?: string | null) {
  const out: string[] = []
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
  const domains = (event.domains || []).map((d) => formatDomainLabel(d))
  domains.slice(0, 2).forEach((domain) => add(domain))
  return out.slice(0, 5)
}

function buildFullEventInterpretation(event: ForecastEvent, detailLines: string[]) {
  const domains = (event.domains || []).map((d) => formatDomainLabel(d)).join(', ')
  const narrative = buildAstroTransitNarrative(
    {
      transitPlanet: event.transitPlanet,
      aspectName: event.aspect,
      natalPlanet: event.natalPoint,
    },
    domains || 'previsoes'
  )
  const detail = detailLines.length ? `Dados tecnicos: ${detailLines.join(' - ')}.` : ''
  return [narrative.fullText, detail].filter(Boolean).join('\n\n')
}

function formatDomainLabel(domain: string) {
  const key = normalizeLifeArea(domain) || String(domain || '').trim().toLowerCase()
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

const MemoCalendar = React.memo(Calendar as any)
const MemoAreaPill = React.memo(function MemoAreaPill({
  label,
  score,
  active,
  color,
  onPress,
}: {
  label: string
  score: number | null
  active: boolean
  color: string
  onPress: () => void
}) {
  const value = typeof score === 'number' ? Math.round(score) : null
  const statusText = value === null
    ? '--'
    : value < STATUS_THRESHOLDS.criticalBelow
    ? 'Critico'
    : value >= STATUS_THRESHOLDS.positiveAbove
    ? 'Positivo'
    : 'Moderado'
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
}: {
  isLoading: boolean
  dayStatus: DayStatusResponse | null
  selectedPoint: ForecastSeriesPoint | null
  lifeAreaCards: Array<{ domain: string; score: number | null; status: string | null; critical: boolean; transitCount: number }>
  selectedDomainKey: string | null
  onSelectDomain: (domain: string | null) => void
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
            <Text style={styles.dayScorePrefix}>Status Geral </Text>
            <Text style={[styles.dayPanelScore, { color: scoreColor(score) }]}>
              {score}
            </Text>
            <Text style={[styles.dayScoreLabel, { color: scoreColor(score) }]}>
              {' '}{labelFromScoreValue(score)}
            </Text>
          </Text>
        </View>
      ) : (
        <Text style={styles.emptyText}>Sem dados para o dia selecionado.</Text>
      )}

      <View style={styles.domainSection}>
        <View style={styles.areaPillGrid}>
          {lifeAreaCards.map((item) => {
            const isActive = selectedDomainKey === item.domain
            const label = formatDomainLabel(item.domain)
            const color = getAreaColor(item.domain)
            return (
              <View
                key={item.domain}
                style={[styles.areaPillWrapper, isActive && styles.areaPillSelected]}
              >
                <MemoAreaPill
                  label={label}
                  score={item.score}
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
  selectedEvents,
  eventDisplayData,
  onOpenEventDetail,
}: {
  selectedEvents: ForecastEvent[]
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
}) {
  const visibleEvents = eventDisplayData
  return (
    <View>
      <View style={styles.eventHeaderRow}>
        <Text style={styles.dayPanelLabel}>Eventos do dia</Text>
      </View>
      {selectedEvents.length === 0 && (
        <Text style={styles.emptyText}>
          Sem eventos. Dia mais calmo para organizar suas prioridades.
        </Text>
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
  const { user } = useAuth()
  const { subscription, trialActive, trialEndsAt, isAdmin } = useSubscriptionCheck()
  const navigation = useNavigation()
  const [periodDays, setPeriodDays] = useState(7)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<ForecastResponse | null>(null)
  const [dayStatusByDate, setDayStatusByDate] = useState<Record<string, DayStatusResponse>>({})
  const [dayStatusLoadingDate, setDayStatusLoadingDate] = useState<string | null>(null)
  const [limitedBanner, setLimitedBanner] = useState(false)
  const [missingBirthData, setMissingBirthData] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null)
  const [selectedEventDetailId, setSelectedEventDetailId] = useState<string | null>(null)
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
      const token = await user.getIdToken()
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

      const url = `${BACKEND_URL}/api/forecast?userId=${encodeURIComponent(user.uid)}&from=${from}&to=${to}&granularity=${granularity}`
      const resp = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
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
          setError('Dados de nascimento incompletos')
          return
        }
        const text = payload?.error ? String(payload.error) : await resp.text()
        throw new Error(text || `Erro ${resp.status}`)
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
        const rangeUrl = `${BACKEND_URL}/api/forecast-status-range?userId=${encodeURIComponent(user.uid)}&from=${payload.range.from}&to=${payload.range.to}`
        try {
          const rangeResp = await fetch(rangeUrl, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          })
          if (rangeResp.ok) {
            const rangePayload: DayStatusRangeResponse = await rangeResp.json()
            const nextMap: Record<string, DayStatusResponse> = {}
            rangePayload.days.forEach((day) => {
              nextMap[day.date] = day
            })
          setDayStatusByDate(nextMap)
          AsyncStorage.setItem(rangeCacheKey, JSON.stringify({ cachedAt: Date.now(), payload: nextMap })).catch(() => null)
        }
      } catch (rangeError) {
        console.warn('Day status range fetch failed', rangeError)
      }
      }
    } catch (err: any) {
      console.warn('Forecast fetch failed', err?.message || err)
      setError('Nao foi possivel carregar previsoes')
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
      if (day?.badges) {
        const criticalCount = Number(day.badges.criticalCount || 0)
        const strongCount = Number(day.badges.strongCount || 0)
        if (criticalCount > 0) critical[dateKey] = criticalCount
        if (strongCount > 0) strong[dateKey] = strongCount
        return
      }
      const areas = day?.lifeAreas || {}
      let criticalCount = 0
      let strongCount = 0
      Object.values(areas).forEach((area) => {
        const score = typeof area?.percentage === 'number' ? area.percentage : null
        if (score === null) return
        if (score < STATUS_THRESHOLDS.criticalBelow) criticalCount += 1
        if (score >= STATUS_THRESHOLDS.positiveAbove) strongCount += 1
      })
      if (criticalCount > 0) critical[dateKey] = criticalCount
      if (strongCount > 0) strong[dateKey] = strongCount
    })
    return { critical, strong }
  }, [dayStatusByDate])

  const criticalCountsByDate = useMemo(() => {
    if (Object.keys(countsFromStatusRange.critical).length) return countsFromStatusRange.critical
    if (data?.dailyBadges) {
      const map: Record<string, number> = {}
      Object.entries(data.dailyBadges).forEach(([key, value]) => {
        if (typeof value?.criticalCount === 'number') map[key] = value.criticalCount
      })
      return map
    }
    if (data?.dailyCounts?.critical) return data.dailyCounts.critical
    const counts: Record<string, number> = {}
    Object.entries(eventsByDate).forEach(([dateKey, items]) => {
      const criticalCount = items.filter((event) => event.impact === 'DOWN').length
      if (criticalCount > 0) counts[dateKey] = criticalCount
    })
    return counts
  }, [countsFromStatusRange.critical, data?.dailyBadges, data?.dailyCounts?.critical, eventsByDate])

  const totalCriticalCount = useMemo(() => {
    return Object.values(criticalCountsByDate).reduce((sum, value) => sum + value, 0)
  }, [criticalCountsByDate])

  const strongCountsByDate = useMemo(() => {
    if (Object.keys(countsFromStatusRange.strong).length) return countsFromStatusRange.strong
    if (data?.dailyBadges) {
      const map: Record<string, number> = {}
      Object.entries(data.dailyBadges).forEach(([key, value]) => {
        if (typeof value?.strongCount === 'number') map[key] = value.strongCount
      })
      return map
    }
    if (data?.dailyCounts?.strong) return data.dailyCounts.strong
    const counts: Record<string, number> = {}
    Object.entries(eventsByDate).forEach(([dateKey, items]) => {
      const strongCount = items.filter((event) => event.intensity >= 0.6).length
      if (strongCount > 0) counts[dateKey] = strongCount
    })
    return counts
  }, [countsFromStatusRange.strong, data?.dailyBadges, data?.dailyCounts?.strong, eventsByDate])

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
      const token = await user.getIdToken()
      const url = `${BACKEND_URL}/api/forecast-status-day?userId=${encodeURIComponent(user.uid)}&date=${dateKey}`
      const resp = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
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
        Alert.alert('Premium', 'Seu plano atual nao libera datas fora do periodo.')
        navigation.navigate('Premium' as never)
        return
      }
      if (data?.meta?.limited) {
        Alert.alert('Limite', 'O backend limitou o periodo. Tente outro intervalo.')
      }
      return
    }
    handleSelectDate(dateKey)
  }, [data?.meta?.limited, handleSelectDate, isDateInRange, maxDaysAllowed, navigation])

  const calendarMarkedDates = useMemo(() => {
    const marks: Record<string, any> = {}
    Object.entries(eventsByDate).forEach(([dateKey, items]) => {
      const impacts = new Set(items.map((event) => event.impact))
      const dots = []
      if (impacts.has('UP')) dots.push({ color: '#4ECDC4' })
      if (impacts.has('DOWN')) dots.push({ color: '#FF6B6B' })
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
  }, [eventsByDate, selectedDate])

  const renderCalendarDay = useCallback(({ date, state }: any) => {
    const dateKey = date?.dateString
    const isSelected = selectedDate === dateKey
    const isDisabled = state === 'disabled'
    const isToday = state === 'today'
    const criticalCount = dateKey ? criticalCountsByDate[dateKey] : 0
    const strongCount = dateKey ? strongCountsByDate[dateKey] : 0
    const showCritical = typeof criticalCount === 'number' && criticalCount > 0
    const showStrong = typeof strongCount === 'number' && strongCount > 0
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
        {(showCritical || showStrong) && (
          <View style={styles.dayBadges}>
            {showCritical && (
              <View style={styles.dayBadgeCritical}>
                <Text style={styles.dayBadgeText}>{criticalCount}</Text>
              </View>
            )}
            {showStrong && (
              <View style={styles.dayBadgeStrong}>
                <Text style={styles.dayBadgeText}>{strongCount}</Text>
              </View>
            )}
          </View>
        )}
      </TouchableOpacity>
    )
  }, [criticalCountsByDate, data?.dailyBadges, handleCalendarPress, selectedDate, strongCountsByDate])


  const formatEventAreas = useCallback((domains: string[]) => {
    if (!Array.isArray(domains)) return ''
    const normalized = domains.map((domain) => normalizeLifeArea(domain)).filter(Boolean)
    const unique = Array.from(new Set(normalized))
    const ordered = LIFE_AREA_ORDER.filter((area) => unique.includes(area))
    return ordered.map((area) => formatDomainLabel(area)).join(', ')
  }, [])

  const buildEventDetailLines = useCallback((event: ForecastEvent, dateKey: string | null) => {
    if (!dateKey) return []
    const selectedDateObj = parseUTCDateString(dateKey)
    if (!selectedDateObj) return []
    const startDateObj = parseUTCDateString(event.startAt.slice(0, 10))
    const exactDateObj = parseUTCDateString(event.exactAt.slice(0, 10))
    const endDateObj = parseUTCDateString(event.endAt.slice(0, 10))
    const lines: string[] = []
    if (startDateObj && endDateObj) {
      lines.push(`Janela ${formatDateShortNoYear(startDateObj)} - ${formatDateShortNoYear(endDateObj)}`)
    }
    if (startDateObj) {
      lines.push(formatEventTiming('Comeca', diffDaysUTC(selectedDateObj, startDateObj)))
    }
    if (exactDateObj) {
      lines.push(formatEventTiming('Pico', diffDaysUTC(selectedDateObj, exactDateObj)))
    }
    if (endDateObj) {
      lines.push(formatEventTiming('Termina', diffDaysUTC(selectedDateObj, endDateObj)))
    }
    const intensity = Math.round(event.intensity * 100)
    lines.push(`Intensidade ${intensity}%`)
    if (typeof event.orbMax === 'number') {
      lines.push(`Orb ${event.orbMax.toFixed(1)} deg`)
    }
    const areas = formatEventAreas(event.domains || [])
    if (areas) {
      lines.push(`Afeta: ${areas}`)
    }
    return lines
  }, [formatEventAreas])

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
      return {
        domain,
        score,
        status: statusArea?.status || null,
        critical: typeof rawScore === 'number' && rawScore < STATUS_THRESHOLDS.criticalBelow,
        transitCount,
      }
    })
  }, [dayStatus, domainSeriesByDate, selectedEventsRaw, selectedPoint, selectedSeriesKey])
  const eventPhaseMap = useMemo(() => {
    if (!selectedDateKey) return {}
    const phases = data?.eventPhasesByDate?.[selectedDateKey] || []
    const map: Record<string, { label: string; meta?: string }> = {}
    phases.forEach((entry) => {
      if (!entry?.eventId) return
      map[entry.eventId] = { label: entry.label, meta: entry.meta }
    })
    return map
  }, [data?.eventPhasesByDate, selectedDateKey])

  const eventDisplayData = useMemo(() => {
    if (!selectedDateKey) return []
    return selectedEvents.map((event) => {
      const detailLines = buildEventDetailLines(event, selectedDateKey)
      const actionHint = buildActionHint(event)
      const orbLine = typeof event.orbMax === 'number' ? `Orb ${event.orbMax.toFixed(1)} deg` : ''
      const intensityLine = `Intensidade ${Math.round((event.intensity || 0) * 100)}%`
      const metaText = [orbLine, intensityLine].filter(Boolean).join(' • ')
      const statusLabel = impactLabel(event.impact)
      const statusColor = event.impact === 'UP' ? '#22C55E' : event.impact === 'DOWN' ? '#EF4444' : '#D97706'
      const impactValue01 = Math.max(0.08, Math.min(1, Number(event.intensity || 0)))
      return {
        event,
        title: buildEventTitle(event),
        statusLabel,
        statusColor,
        phase: eventPhaseMap[event.id] || buildEventPhase(selectedDateKey, event),
        directText: buildDirectEventText(event),
        actionHint,
        metaText,
        impactValue01,
        impactLabel: `Impacto relativo ${Math.round(impactValue01 * 100)}%`,
      }
    })
  }, [buildEventDetailLines, eventPhaseMap, selectedDateKey, selectedEvents])

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
      Alert.alert('Premium', 'Seu plano atual nao libera este periodo')
      navigation.navigate('Premium' as never)
      return
    }
    setPeriodDays(days)
  }


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View />
          <View style={styles.planBadge}>
            <Text style={styles.planBadgeText}>Plano atual: {currentPlan.name}</Text>
          </View>
        </View>
        <Text style={styles.subtitle}>Status previsto dos proximos dias</Text>
      </View>
      {expiryInfo.show && (
        <ExpiryBanner
          message={expiryMessage}
          variant={expiryInfo.variant}
          onPress={() => navigation.navigate('Premium' as never, { openTab: 'features' } as never)}
        />
      )}

      <View style={styles.periodRow}>
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

      {limitedBanner && (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>
            {rangeFrom && rangeTo
              ? `Mostrando ${formatDateShort(rangeFrom)} - ${formatDateShort(rangeTo)} (Premium desbloqueia 30/90/360)`
              : 'Mostrando 7 dias (Premium desbloqueia 30/90/360)'}
          </Text>
        </View>
      )}

      {loading && (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#FFD700" />
          <Text style={styles.loadingText}>Carregando previsoes...</Text>
        </View>
      )}

      {!loading && error && (
        <View style={styles.error}>
          <Text style={styles.errorText}>{error}</Text>
          {missingBirthData && (
            <TouchableOpacity style={styles.retryButton} onPress={() => navigation.navigate('Settings' as never)}>
              <Text style={styles.retryText}>Completar nascimento</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.retryButton} onPress={() => fetchForecast(true)}>
            <Text style={styles.retryText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      )}

      {!loading && !error && (
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.calendarWrapper}>
            <MemoCalendar
              markingType="multi-dot"
              current={selectedMonthKey || selectedDateKey || rangeFromStr || undefined}
              minDate={rangeFromStr || undefined}
              maxDate={rangeToStr || undefined}
              markedDates={calendarMarkedDates}
              dayComponent={renderCalendarDay}
              onDayPress={(day) => {
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
          </View>
          <View style={styles.dayPanel}>
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
                  {selectedDateObj ? `Status do Dia ${formatDateShort(selectedDateObj)}` : 'Status do dia'}
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
            />

            <MemoDayEvents
              selectedEvents={selectedEvents}
              eventDisplayData={eventDisplayData}
              onOpenEventDetail={openEventDetail}
            />
          </View>

          {maxDaysAllowed < 360 && (
            <TouchableOpacity style={styles.cta} onPress={() => navigation.navigate('Premium' as never)}>
              <Text style={styles.ctaText}>Desbloquear previsoes completas</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      )}
      {(() => {
        const detail = eventDisplayData.find((item) => item.event.id === selectedEventDetailId) || null
        if (!detail) return null
        const fullText = buildFullEventInterpretation(
          detail.event,
          buildEventDetailLines(detail.event, selectedDateKey || detail.event.exactAt.slice(0, 10))
        )
        return (
          <ReadingDetailModal
            visible={!!selectedEventDetailId}
            onClose={() => setSelectedEventDetailId(null)}
            statusLabel={detail.statusLabel}
            statusColor={detail.statusColor}
            title={detail.title}
            timingLabel={detail.phase ? `${detail.phase.label}${detail.phase.meta ? ` - ${detail.phase.meta}` : ''}` : null}
            directText={detail.directText}
            fullText={fullText}
            actionText={detail.actionHint}
            metaText={detail.metaText}
            keywords={buildEventKeywords(detail.event, detail.phase?.label || null)}
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
    paddingHorizontal: 16,
    gap: 8,
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
    backgroundColor: '#FFD700',
    alignItems: 'center',
  },
  dayBadgeText: {
    color: '#0F0F23',
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
  eventHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    minHeight: 40,
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




