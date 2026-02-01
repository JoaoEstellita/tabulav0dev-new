import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ActivityIndicator, Alert, FlatList, InteractionManager, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useAuth } from '../../hooks/useAuth'
import { useSubscriptionCheck } from '../../hooks/useSubscriptionCheck'
import { useNavigation } from '@react-navigation/native'
import { Calendar } from 'react-native-calendars'
import AsyncStorage from '@react-native-async-storage/async-storage'
import LifeAreaCard from '../../components/LifeAreaCard'
import ExpiryBanner from '../../components/ExpiryBanner'
import { STATUS_THRESHOLDS } from '../../constants/statusThresholds'
import {
  LIFE_AREA_LABELS,
  LIFE_AREA_ORDER,
  normalizeLifeArea,
} from '../../constants/lifeAreas'
import { getForecastMaxDays, getPlanById } from '../../constants/plans'
import { getExpiryBannerInfo } from '../../utils/expiry'

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
const FORECAST_STRENGTH_FILTER_KEY = 'forecast_strength_filter'
const FORECAST_CACHE_PREFIX = 'forecast_cache_v1'
const FORECAST_CACHE_TTL_MS = 10 * 60 * 1000
const FORECAST_DAY_STATUS_CACHE_PREFIX = 'forecast_day_status_v1'
const FORECAST_DAY_STATUS_CACHE_TTL_MS = 5 * 60 * 1000
const FORECAST_DAY_STATUS_RANGE_CACHE_PREFIX = 'forecast_day_status_range_v1'
const FORECAST_DAY_STATUS_RANGE_CACHE_TTL_MS = 10 * 60 * 1000
const FORECAST_PERIOD_EVENTS_CACHE_PREFIX = 'forecast_period_events_v1'

function labelFromScoreValue(score: number | null) {
  if (typeof score !== 'number') return '—'
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

function formatDomainLabel(domain: string) {
  const key = normalizeLifeArea(domain) || String(domain || '').trim().toLowerCase()
  if (LIFE_AREA_LABELS[key]) return LIFE_AREA_LABELS[key]
  if (!key) return 'Area'
  return key.charAt(0).toUpperCase() + key.slice(1)
}

function diffDaysUTC(from: Date, to: Date) {
  const ms = to.getTime() - from.getTime()
  return Math.round(ms / 86400000)
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

const MemoEventCard = React.memo(function MemoEventCard({
  event,
  phase,
  detailLines,
  expanded,
  onToggle,
}: {
  event: ForecastEvent
  phase: { label: string; meta: string } | null
  detailLines: string[]
  expanded: boolean
  onToggle: () => void
}) {
  return (
    <View style={styles.eventCard}>
      <Text style={styles.eventTitle}>{event.shortText}</Text>
      {phase ? (
        <Text style={styles.eventPhase}>{phase.label} - {phase.meta}</Text>
      ) : null}
      <Text style={styles.eventMeta}>Impacto {impactLabel(event.impact)}</Text>
      {detailLines.map((line) => (
        <Text key={`${event.id}-${line}`} style={styles.eventMeta}>{line}</Text>
      ))}
      <TouchableOpacity style={styles.eventToggle} onPress={onToggle}>
        <Text style={styles.eventToggleText}>
          {expanded ? 'Ver menos' : 'Ver mais'}
        </Text>
      </TouchableOpacity>
      {expanded && (
        <View style={styles.eventExtra}>
          <Text style={styles.eventExtraTitle}>O que fazer</Text>
          <Text style={styles.eventExtraText}>Sugestoes praticas em breve.</Text>
          <Text style={styles.eventExtraTitle}>Pontos de atencao</Text>
          <Text style={styles.eventExtraText}>Dicas de cuidado em breve.</Text>
        </View>
      )}
    </View>
  )
})

const MemoCalendar = React.memo(Calendar as any)
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
  lastStatusUpdatedAt,
}: {
  isLoading: boolean
  dayStatus: DayStatusResponse | null
  selectedPoint: ForecastSeriesPoint | null
  lifeAreaCards: Array<{ domain: string; score: number | null; status: string | null; critical: boolean; transitCount: number }>
  selectedDomainKey: string | null
  onSelectDomain: (domain: string | null) => void
  lastStatusUpdatedAt: string | null
}) {
  const score = typeof dayStatus?.global?.score === 'number'
    ? dayStatus.global.score
    : typeof selectedPoint?.score === 'number'
    ? selectedPoint.score
    : null

  return (
    <View style={styles.dayPanelCard}>
      <Text style={styles.dayPanelLabel}>Status global do dia</Text>
      {isLoading ? (
        <View style={styles.daySkeleton}>
          <View style={styles.daySkeletonLine} />
          <View style={styles.daySkeletonLineShort} />
          <View style={styles.daySkeletonLine} />
        </View>
      ) : score !== null ? (
        <Text style={[styles.dayPanelScore, { color: scoreColor(score) }]}>
          {score} {labelFromScoreValue(score)}
        </Text>
      ) : (
        <Text style={styles.emptyText}>Sem dados para o dia selecionado.</Text>
      )}
      {lastStatusUpdatedAt && (
        <Text style={styles.updatedAtText}>Atualizado agora</Text>
      )}

      <View style={styles.domainSection}>
        <Text style={styles.dayPanelLabel}>Status por area</Text>
        <View style={styles.domainRow}>
          <MemoDomainChip
            label="Todos"
            active={!selectedDomainKey}
            onPress={() => onSelectDomain(null)}
          />
        </View>
        <View style={styles.areaCardGrid}>
          {lifeAreaCards.map((item) => {
            const isActive = selectedDomainKey === item.domain
            return (
              <View
                key={item.domain}
                style={[styles.areaCardWrapper, isActive && styles.areaCardSelected]}
              >
                <LifeAreaCard
                  compact
                  area={{
                    name: item.domain,
                    status: item.score as any,
                    trend: 'stable',
                    description: '',
                    criticalLevel: item.critical,
                  } as any}
                  transitCount={0}
                  transitCount={item.transitCount}
                  onPress={() => onSelectDomain(item.domain)}
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
  effectiveEventStrengthFilter,
  hideMixedImpact,
  showFilterHint,
  selectedEvents,
  eventDisplayData,
  expandedEvents,
  dayEventsLimit,
  showAllDayEvents,
  onToggleEvent,
  onToggleShowAll,
  onSetStrengthFilter,
  onToggleMixed,
  onToggleHint,
}: {
  effectiveEventStrengthFilter: 'all' | 'strong' | 'light'
  hideMixedImpact: boolean
  showFilterHint: boolean
  selectedEvents: ForecastEvent[]
  eventDisplayData: Array<{ event: ForecastEvent; expanded: boolean; phase: { label: string; meta: string } | null; detailLines: string[] }>
  expandedEvents: Record<string, boolean>
  dayEventsLimit: number
  showAllDayEvents: boolean
  onToggleEvent: (eventId: string) => void
  onToggleShowAll: () => void
  onSetStrengthFilter: (value: 'all' | 'strong' | 'light') => void
  onToggleMixed: () => void
  onToggleHint: () => void
}) {
  return (
    <View>
      <View style={styles.eventHeaderRow}>
        <Text style={styles.dayPanelLabel}>Eventos do dia</Text>
        <View style={styles.filterActions}>
          <TouchableOpacity
            style={[
              styles.filterToggle,
              effectiveEventStrengthFilter === 'all' && styles.filterToggleActive,
            ]}
            onPress={() => onSetStrengthFilter('all')}
          >
            <Text style={[
              styles.filterToggleText,
              effectiveEventStrengthFilter === 'all' && styles.filterToggleTextActive,
            ]}>
              Todos
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterToggle,
              effectiveEventStrengthFilter === 'strong' && styles.filterToggleActive,
            ]}
            onPress={() => onSetStrengthFilter('strong')}
          >
            <Text style={[
              styles.filterToggleText,
              effectiveEventStrengthFilter === 'strong' && styles.filterToggleTextActive,
            ]}>
              Fortes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterToggle,
              effectiveEventStrengthFilter === 'light' && styles.filterToggleActive,
            ]}
            onPress={() => onSetStrengthFilter('light')}
          >
            <Text style={[
              styles.filterToggleText,
              effectiveEventStrengthFilter === 'light' && styles.filterToggleTextActive,
            ]}>
              Leves
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterToggle} onPress={onToggleMixed}>
            <Text style={styles.filterToggleText}>
              {hideMixedImpact ? 'Ocultar mistos' : 'Impacto misto'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.filterHintButton}
            onPress={onToggleHint}
          >
            <Ionicons name="help-circle" size={14} color="#FFD700" />
          </TouchableOpacity>
        </View>
      </View>
      {showFilterHint && (
        <Text style={styles.filterHintText}>
          Fortes = intensidade maior ou igual a 60%. Leves = abaixo de 60%. Impacto misto = influencia positiva e desafiadora no mesmo periodo.
        </Text>
      )}
      {selectedEvents.length === 0 && (
        <Text style={styles.emptyText}>
          {effectiveEventStrengthFilter === 'strong'
            ? 'Sem eventos fortes neste dia.'
            : effectiveEventStrengthFilter === 'light'
            ? 'Sem eventos leves neste dia.'
            : 'Sem eventos. Dia mais calmo para organizar suas prioridades.'}
        </Text>
      )}
      <FlatList
        data={eventDisplayData}
        keyExtractor={(item) => item.event.id}
        renderItem={({ item }) => (
          <MemoEventCard
            event={item.event}
            phase={item.phase}
            detailLines={item.detailLines}
            expanded={!!expandedEvents[item.event.id]}
            onToggle={() => onToggleEvent(item.event.id)}
          />
        )}
        scrollEnabled={false}
        removeClippedSubviews
        windowSize={5}
        initialNumToRender={6}
        maxToRenderPerBatch={6}
      />
      {selectedEvents.length > dayEventsLimit && (
        <TouchableOpacity
          style={styles.showMoreButton}
          onPress={onToggleShowAll}
        >
          <Text style={styles.showMoreText}>
            {showAllDayEvents ? 'Ver menos' : `Ver mais (${selectedEvents.length - dayEventsLimit})`}
          </Text>
        </TouchableOpacity>
      )}
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
  const [expandedEvents, setExpandedEvents] = useState<Record<string, boolean>>({})
  const [eventStrengthFilter, setEventStrengthFilter] = useState<'all' | 'strong' | 'light'>('all')
  const [pendingEventStrengthFilter, setPendingEventStrengthFilter] = useState<'all' | 'strong' | 'light' | null>(null)
  const [hideMixedImpact, setHideMixedImpact] = useState(false)
  const [showFilterHint, setShowFilterHint] = useState(false)
  const [showPeriodEvents, setShowPeriodEvents] = useState(false)
  const [badgeFilter, setBadgeFilter] = useState<'all' | 'critical' | 'strong'>('all')
  const [pendingBadgeFilter, setPendingBadgeFilter] = useState<'all' | 'critical' | 'strong' | null>(null)
  const [periodEventsCachedList, setPeriodEventsCachedList] = useState<{ date: string; events: ForecastEvent[] }[] | null>(null)
  const [periodEventsPage, setPeriodEventsPage] = useState(0)
  const [periodEventsComputedList, setPeriodEventsComputedList] = useState<{ date: string; events: ForecastEvent[] }[] | null>(null)
  const [periodEventsLoading, setPeriodEventsLoading] = useState(false)
  const [showAllDayEvents, setShowAllDayEvents] = useState(false)
  const [lastStatusUpdatedAt, setLastStatusUpdatedAt] = useState<string | null>(null)
  const skipNextFetchRef = useRef(false)
  const pendingFilterTimerRef = useRef<NodeJS.Timeout | null>(null)
  const pendingPrefetchRef = useRef<NodeJS.Timeout | null>(null)
  const inFlightDayStatusRef = useRef<Set<string>>(new Set())
  const pendingStrengthFilterTimerRef = useRef<NodeJS.Timeout | null>(null)
  const periodEventsBuildRef = useRef<{ cancelled: boolean } | null>(null)

  const effectiveEventStrengthFilter = pendingEventStrengthFilter ?? eventStrengthFilter

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
  const periodEventsCacheTtlMs = useMemo(() => {
    if (periodDays >= 360) return 3 * 60 * 60 * 1000
    if (periodDays >= 90) return 90 * 60 * 1000
    return 30 * 60 * 1000
  }, [periodDays])

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
              setLastStatusUpdatedAt(new Date().toISOString())
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
          setLastStatusUpdatedAt(new Date().toISOString())
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

  const criticalCountsByDate = useMemo(() => {
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
  }, [data?.dailyBadges, data?.dailyCounts?.critical, eventsByDate])

  const totalCriticalCount = useMemo(() => {
    return Object.values(criticalCountsByDate).reduce((sum, value) => sum + value, 0)
  }, [criticalCountsByDate])

  const strongCountsByDate = useMemo(() => {
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
  }, [data?.dailyBadges, data?.dailyCounts?.strong, eventsByDate])

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

  useEffect(() => {
    AsyncStorage.getItem(FORECAST_STRENGTH_FILTER_KEY)
      .then((value) => {
        if (value === 'strong' || value === 'light' || value === 'all') {
          setEventStrengthFilter(value)
        }
      })
      .catch(() => null)
  }, [])

  useEffect(() => {
    AsyncStorage.setItem(FORECAST_STRENGTH_FILTER_KEY, eventStrengthFilter).catch(() => null)
  }, [eventStrengthFilter])

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
    const badgeScore = dateKey ? data?.dailyBadges?.[dateKey]?.score : null
    const isCriticalDay = typeof badgeScore === 'number' && badgeScore < 40
    const showCritical = badgeFilter !== 'strong' && typeof criticalCount === 'number' && criticalCount > 0
    const showStrong = badgeFilter !== 'critical' && typeof strongCount === 'number' && strongCount > 0
    return (
      <TouchableOpacity
        style={[styles.dayCell, isCriticalDay && styles.dayCellCritical]}
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
  }, [badgeFilter, criticalCountsByDate, data?.dailyBadges, handleCalendarPress, selectedDate, strongCountsByDate])

  const criticalDaysList = useMemo(() => {
    return Object.entries(criticalCountsByDate)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date))
  }, [criticalCountsByDate])

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
    return eventsByDate[selectedDateKey] || []
  }, [selectedDateKey, eventsByDate])
  const selectedEvents = useMemo(() => {
    const filtered = selectedDomainKey
      ? selectedEventsRaw.filter((event) => (event.domains || []).some((domain) => normalizeLifeArea(domain) === selectedDomainKey))
      : selectedEventsRaw
    return filtered.filter((event) => {
      if (effectiveEventStrengthFilter === 'strong' && event.intensity < 0.6) return false
      if (effectiveEventStrengthFilter === 'light' && event.intensity >= 0.6) return false
      if (hideMixedImpact && event.impact === 'MIXED') return false
      return true
    })
  }, [effectiveEventStrengthFilter, hideMixedImpact, selectedDomainKey, selectedEventsRaw])
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
  const dayEventsLimit = 6
  const visibleDayEvents = useMemo(() => {
    return showAllDayEvents ? selectedEvents : selectedEvents.slice(0, dayEventsLimit)
  }, [showAllDayEvents, selectedEvents])

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
    return visibleDayEvents.map((event) => {
      const expanded = !!expandedEvents[event.id]
      return {
        event,
        expanded,
        phase: eventPhaseMap[event.id] || buildEventPhase(selectedDateKey, event),
        detailLines: expanded ? buildEventDetailLines(event, selectedDateKey) : [],
      }
    })
  }, [buildEventDetailLines, eventPhaseMap, expandedEvents, selectedDateKey, visibleDayEvents])

  const periodEventsList = useMemo(() => {
    if (periodEventsCachedList) return periodEventsCachedList
    return periodEventsComputedList || []
  }, [periodEventsCachedList, periodEventsComputedList])

  const periodEventsPerPage = useMemo(() => {
    if (periodDays >= 360) return 10
    if (periodDays >= 90) return 12
    return 20
  }, [periodDays])

  const periodEventsPageCount = useMemo(() => {
    if (!periodEventsList.length) return 0
    return Math.ceil(periodEventsList.length / periodEventsPerPage)
  }, [periodEventsList.length, periodEventsPerPage])

  const periodEventsPageItems = useMemo(() => {
    const start = periodEventsPage * periodEventsPerPage
    return periodEventsList.slice(start, start + periodEventsPerPage)
  }, [periodEventsList, periodEventsPage, periodEventsPerPage])

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
    if (!pendingEventStrengthFilter) return
    if (pendingStrengthFilterTimerRef.current) clearTimeout(pendingStrengthFilterTimerRef.current)
    pendingStrengthFilterTimerRef.current = setTimeout(() => {
      setEventStrengthFilter(pendingEventStrengthFilter)
      setPendingEventStrengthFilter(null)
    }, 150)
    return () => {
      if (pendingStrengthFilterTimerRef.current) clearTimeout(pendingStrengthFilterTimerRef.current)
    }
  }, [pendingEventStrengthFilter])

  useEffect(() => {
    if (!pendingBadgeFilter) return
    if (pendingFilterTimerRef.current) clearTimeout(pendingFilterTimerRef.current)
    pendingFilterTimerRef.current = setTimeout(() => {
      setBadgeFilter(pendingBadgeFilter)
      setPendingBadgeFilter(null)
    }, 120)
    return () => {
      if (pendingFilterTimerRef.current) clearTimeout(pendingFilterTimerRef.current)
    }
  }, [pendingBadgeFilter])

  useEffect(() => {
    setPeriodEventsPage(0)
  }, [badgeFilter, periodDays, showPeriodEvents])

  useEffect(() => {
    if (!user?.uid) return
    if (!showPeriodEvents) return
    if (!rangeFromStr || !rangeToStr) return
    if (periodDays < 90) {
      setPeriodEventsCachedList(null)
      return
    }
    const cacheKey = `${FORECAST_PERIOD_EVENTS_CACHE_PREFIX}:${user.uid}:${rangeFromStr}:${rangeToStr}:${badgeFilter}`
    const loadCache = async () => {
      try {
        const cachedRaw = await AsyncStorage.getItem(cacheKey)
        if (cachedRaw) {
          const cached = JSON.parse(cachedRaw)
          const cachedAt = Number(cached?.cachedAt || 0)
          const cachedPayload = cached?.payload as { date: string; events: ForecastEvent[] }[] | undefined
          if (cachedPayload && cachedAt && Date.now() - cachedAt < periodEventsCacheTtlMs) {
            setPeriodEventsCachedList(cachedPayload)
            return
          }
        }
      } catch (_) {
        // ignore cache errors
      }
      setPeriodEventsCachedList(null)
    }
    loadCache()
  }, [user?.uid, showPeriodEvents, rangeFromStr, rangeToStr, periodDays, badgeFilter, periodEventsCacheTtlMs])

  useEffect(() => {
    if (!showPeriodEvents) return
    if (periodDays < 90) return
    if (!user?.uid) return
    if (!rangeFromStr || !rangeToStr) return
    if (!periodEventsList.length) return
    const cacheKey = `${FORECAST_PERIOD_EVENTS_CACHE_PREFIX}:${user.uid}:${rangeFromStr}:${rangeToStr}:${badgeFilter}`
    AsyncStorage.setItem(cacheKey, JSON.stringify({ cachedAt: Date.now(), payload: periodEventsList })).catch(() => null)
  }, [showPeriodEvents, periodDays, user?.uid, rangeFromStr, rangeToStr, badgeFilter, periodEventsList])

  useEffect(() => {
    if (!showPeriodEvents) {
      setPeriodEventsComputedList(null)
      setPeriodEventsLoading(false)
      if (periodEventsBuildRef.current) periodEventsBuildRef.current.cancelled = true
      return
    }
    if (!rangeFromStr || !rangeToStr) return
    if (periodEventsCachedList) {
      setPeriodEventsComputedList(periodEventsCachedList)
      setPeriodEventsLoading(false)
      return
    }
    if (periodEventsBuildRef.current) periodEventsBuildRef.current.cancelled = true
    const guard = { cancelled: false }
    periodEventsBuildRef.current = guard
    setPeriodEventsLoading(true)
    setPeriodEventsComputedList([])
    const start = parseUTCDateString(rangeFromStr)
    const end = parseUTCDateString(rangeToStr)
    if (!start || !end) {
      setPeriodEventsLoading(false)
      return
    }
    const list: { date: string; events: ForecastEvent[] }[] = []
    let cursor = start
    const batchSize = 25
    const step = () => {
      if (guard.cancelled) return
      let processed = 0
      while (cursor <= end && processed < batchSize) {
        const key = buildDateUTCString(cursor)
        const items = eventsByDate[key] || []
        const criticalCount = criticalCountsByDate[key] || 0
        const strongCount = strongCountsByDate[key] || 0
        const matchesFilter = badgeFilter === 'all'
          || (badgeFilter === 'critical' && criticalCount > 0)
          || (badgeFilter === 'strong' && strongCount > 0)
        if (items.length && matchesFilter) list.push({ date: key, events: items })
        cursor = addDaysUTC(cursor, 1)
        processed += 1
      }
      setPeriodEventsComputedList(list.slice())
      if (cursor <= end) {
        setTimeout(step, 0)
      } else {
        setPeriodEventsLoading(false)
      }
    }
    step()
    return () => {
      guard.cancelled = true
    }
  }, [badgeFilter, criticalCountsByDate, eventsByDate, periodEventsCachedList, rangeFromStr, rangeToStr, showPeriodEvents, strongCountsByDate])

  const toggleEventDetails = useCallback((eventId: string) => {
    setExpandedEvents((prev) => ({ ...prev, [eventId]: !prev[eventId] }))
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

  const weeklySummary = useMemo(() => {
    if (!seriesSorted.length) return null
    const withScore = seriesSorted.filter((point) => typeof point.score === 'number')
    if (!withScore.length) return null
    const best = withScore.reduce((acc, cur) => (cur.score! > acc.score! ? cur : acc), withScore[0])
    const worst = withScore.reduce((acc, cur) => (cur.score! < acc.score! ? cur : acc), withScore[0])
    const bestDate = parseUTCDateString(best.date)
    const worstDate = parseUTCDateString(worst.date)
    return {
      best: { date: bestDate ? formatDateShortNoYear(bestDate) : best.date, score: best.score ?? null },
      worst: { date: worstDate ? formatDateShortNoYear(worstDate) : worst.date, score: worst.score ?? null },
    }
  }, [seriesSorted])

  const periodIndexText = useMemo(() => {
    if (!selectedDateKey || !rangeFromStr || !rangeToStr) return null
    const index = diffDaysUTC(parseUTCDateString(rangeFromStr)!, parseUTCDateString(selectedDateKey)!)
    if (!Number.isFinite(index)) return null
    const total = diffDaysUTC(parseUTCDateString(rangeFromStr)!, parseUTCDateString(rangeToStr)!) + 1
    return `Dia ${index + 1} de ${total} no periodo`
  }, [selectedDateKey, rangeFromStr, rangeToStr])

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Previsoes</Text>
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
          <Text style={styles.sectionTitle}>Calendario</Text>
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
          <View style={styles.calendarLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#4ECDC4' }]} />
              <Text style={styles.legendText}>Positivo</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#FF6B6B' }]} />
              <Text style={styles.legendText}>Desafiador</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#FFD166' }]} />
              <Text style={styles.legendText}>Misto</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={styles.legendBadgeCritical} />
              <Text style={styles.legendText}>Criticos</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={styles.legendBadgeStrong} />
              <Text style={styles.legendText}>Fortes</Text>
            </View>
            <TouchableOpacity
              style={styles.todayButton}
              onPress={() => {
                const now = new Date()
                const todayKey = buildDateUTCString(new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())))
                if (isDateInRange(todayKey)) {
                  handleSelectDate(todayKey)
                } else if (maxDaysAllowed <= 7) {
                  Alert.alert('Premium', 'Seu plano atual nao libera datas fora do periodo.')
                  navigation.navigate('Premium' as never)
                }
              }}
            >
              <Text style={styles.todayButtonText}>Hoje</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.calendarFilters}>
                <TouchableOpacity
                  style={[styles.calendarFilterButton, badgeFilter === 'all' && styles.calendarFilterButtonActive]}
                  onPress={() => setPendingBadgeFilter('all')}
                >
                  <Text style={[styles.calendarFilterText, badgeFilter === 'all' && styles.calendarFilterTextActive]}>
                    Todos
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.calendarFilterButton, badgeFilter === 'critical' && styles.calendarFilterButtonActive]}
                  onPress={() => setPendingBadgeFilter('critical')}
                >
                  <Text style={[styles.calendarFilterText, badgeFilter === 'critical' && styles.calendarFilterTextActive]}>
                    Criticos
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.calendarFilterButton, badgeFilter === 'strong' && styles.calendarFilterButtonActive]}
                  onPress={() => setPendingBadgeFilter('strong')}
                >
                  <Text style={[styles.calendarFilterText, badgeFilter === 'strong' && styles.calendarFilterTextActive]}>
                    Fortes
                  </Text>
                </TouchableOpacity>
          </View>
          <Text style={styles.badgeHint}>
            Badges: vermelho = criticos, amarelo = fortes (>= 60%).
          </Text>
          {criticalDaysList.length > 0 && (
            <View style={styles.criticalSummary}>
              <Text style={styles.criticalTitle}>Criticos no periodo: {totalCriticalCount}</Text>
              <View style={styles.criticalRow}>
                {criticalDaysList.map((item) => {
                  const dateObj = parseUTCDateString(item.date)
                  const label = dateObj ? formatDateShortNoYear(dateObj) : item.date
                  const badgeScore = data?.dailyBadges?.[item.date]?.score
                  const chipColor = typeof badgeScore === 'number' ? scoreColor(badgeScore) : null
                  const chipTextColor = chipColor ? '#0F0F23' : '#FFFFFF'
                  return (
                    <View key={item.date} style={[styles.criticalChip, chipColor ? { backgroundColor: chipColor } : null]}>
                      <Text style={[styles.criticalChipText, { color: chipTextColor }]}>{label}</Text>
                      <Text style={[styles.criticalChipCount, { color: chipTextColor }]}>{item.count}</Text>
                    </View>
                  )
                })}
              </View>
            </View>
          )}

          <View style={styles.dayPanel}>
            <View style={styles.dayTitleRow}>
              <Text style={styles.dayPanelTitle}>
                {selectedDateObj ? `Dia ${formatDateShort(selectedDateObj)}` : 'Dia selecionado'}
              </Text>
              <View style={styles.dayNavRow}>
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
                <TouchableOpacity
                  style={styles.dayNavButton}
                  onPress={() => {
                    const now = new Date()
                    const todayKey = buildDateUTCString(new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())))
                if (isDateInRange(todayKey)) {
                  handleSelectDate(todayKey)
                } else if (maxDaysAllowed <= 7) {
                  Alert.alert('Premium', 'Seu plano atual nao libera datas fora do periodo.')
                  navigation.navigate('Premium' as never)
                }
              }}
            >
                  <Text style={styles.dayNavText}>Hoje</Text>
                </TouchableOpacity>
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
            {periodIndexText && (
              <Text style={styles.periodIndexText}>{periodIndexText}</Text>
            )}
            <MemoDaySummary
              key={selectedDateKey || 'day-summary'}
              isLoading={dayStatusLoadingDate === selectedDateKey}
              dayStatus={dayStatus}
              selectedPoint={selectedPoint}
              lifeAreaCards={lifeAreaCards}
              selectedDomainKey={selectedDomainKey}
              onSelectDomain={handleSelectDomain}
              lastStatusUpdatedAt={lastStatusUpdatedAt}
            />

            <MemoDayEvents
              key={selectedDateKey || 'day-events'}
              effectiveEventStrengthFilter={effectiveEventStrengthFilter}
              hideMixedImpact={hideMixedImpact}
              showFilterHint={showFilterHint}
              selectedEvents={selectedEvents}
              eventDisplayData={eventDisplayData}
              expandedEvents={expandedEvents}
              dayEventsLimit={dayEventsLimit}
              showAllDayEvents={showAllDayEvents}
              onToggleEvent={toggleEventDetails}
              onToggleShowAll={() => setShowAllDayEvents((prev) => !prev)}
              onSetStrengthFilter={setPendingEventStrengthFilter}
              onToggleMixed={() => setHideMixedImpact((prev) => !prev)}
              onToggleHint={() => setShowFilterHint((prev) => !prev)}
            />
          </View>

          {weeklySummary && periodDays <= 30 && (
            <View style={styles.weeklySummary}>
              <Text style={styles.weeklyTitle}>Resumo do periodo</Text>
              <Text style={styles.weeklyItem}>
                Melhor dia: {weeklySummary.best.date} ({weeklySummary.best.score})
              </Text>
              <Text style={styles.weeklyItem}>
                Pior dia: {weeklySummary.worst.date} ({weeklySummary.worst.score})
              </Text>
            </View>
          )}

          <View style={styles.periodEventsSection}>
            <View style={styles.periodEventsHeader}>
              <Text style={styles.sectionTitle}>Eventos do periodo</Text>
              <TouchableOpacity onPress={() => setShowPeriodEvents((prev) => !prev)}>
                <Text style={styles.periodEventsToggle}>
                  {showPeriodEvents ? 'Ocultar' : 'Mostrar'}
                </Text>
              </TouchableOpacity>
            </View>
            {showPeriodEvents && periodEventsList.length === 0 && (
              <Text style={styles.emptyText}>Sem eventos relevantes no periodo.</Text>
            )}
            {showPeriodEvents && periodEventsLoading && (
              <View style={styles.periodSkeleton}>
                <View style={styles.periodSkeletonLine} />
                <View style={styles.periodSkeletonLine} />
                <View style={styles.periodSkeletonLineShort} />
              </View>
            )}
            {showPeriodEvents && (
              <FlatList
                data={periodEventsPageItems}
                keyExtractor={(item) => item.date}
                scrollEnabled={false}
                initialNumToRender={3}
                maxToRenderPerBatch={5}
                windowSize={5}
                removeClippedSubviews
                renderItem={({ item }) => {
                  const dateObj = parseUTCDateString(item.date)
                  const header = dateObj ? formatDateShort(dateObj) : item.date
                  return (
                    <View style={styles.periodDayBlock}>
                      <Text style={styles.periodDayTitle}>{header}</Text>
                      {item.events.map((event) => (
                        <View key={event.id} style={styles.eventCardSmall}>
                          <Text style={styles.eventTitle}>{event.shortText}</Text>
                          {(() => {
                            const phase = buildEventPhase(item.date, event)
                            return phase ? (
                              <Text style={styles.eventPhase}>{phase.label} - {phase.meta}</Text>
                            ) : null
                          })()}
                          <Text style={styles.eventMeta}>Impacto {impactLabel(event.impact)}</Text>
                        </View>
                      ))}
                    </View>
                  )
                }}
              />
            )}
            {showPeriodEvents && periodEventsPageCount > 1 && (
              <View style={styles.periodPagination}>
                <TouchableOpacity
                  style={[styles.periodPageButton, periodEventsPage === 0 && styles.periodPageButtonDisabled]}
                  onPress={() => setPeriodEventsPage((prev) => Math.max(0, prev - 1))}
                  disabled={periodEventsPage === 0}
                >
                  <Text style={styles.periodPageText}>Anterior</Text>
                </TouchableOpacity>
                <Text style={styles.periodPageLabel}>
                  {periodEventsPage + 1} de {periodEventsPageCount}
                </Text>
                <TouchableOpacity
                  style={[styles.periodPageButton, periodEventsPage >= periodEventsPageCount - 1 && styles.periodPageButtonDisabled]}
                  onPress={() => setPeriodEventsPage((prev) => Math.min(periodEventsPageCount - 1, prev + 1))}
                  disabled={periodEventsPage >= periodEventsPageCount - 1}
                >
                  <Text style={styles.periodPageText}>Proxima</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {maxDaysAllowed < 360 && (
            <TouchableOpacity style={styles.cta} onPress={() => navigation.navigate('Premium' as never)}>
              <Text style={styles.ctaText}>Desbloquear previsoes completas</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      )}
    </View>
  )
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
  emptyText: {
    color: '#808080',
    fontSize: 12,
  },
  calendarWrapper: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    padding: 8,
  },
  calendarLegend: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    marginBottom: 8,
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
  badgeHint: {
    color: '#B0B0B0',
    fontSize: 11,
    marginBottom: 12,
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
  todayButton: {
    marginLeft: 'auto',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: '#2A2A2E',
  },
  todayButtonText: {
    color: '#FFD700',
    fontSize: 11,
    fontWeight: '600',
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
    justifyContent: 'space-between',
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
  },
  dayNavRow: {
    flexDirection: 'row',
    gap: 6,
  },
  dayNavButton: {
    padding: 4,
    borderRadius: 6,
    backgroundColor: '#2A2A2E',
  },
  dayNavText: {
    color: '#FFD700',
    fontSize: 11,
    fontWeight: '600',
    paddingHorizontal: 4,
  },
  dayPanelCard: {
    marginBottom: 12,
  },
  dayPanelLabel: {
    color: '#B0B0B0',
    fontSize: 12,
    marginBottom: 6,
  },
  dayPanelScore: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 6,
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
  showMoreButton: {
    marginTop: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#2A2A2E',
  },
  showMoreText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '700',
  },
  filterActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  filterToggle: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: '#2A2A2E',
  },
  filterToggleActive: {
    backgroundColor: '#FFD700',
  },
  filterToggleText: {
    color: '#FFD700',
    fontSize: 11,
    fontWeight: '600',
  },
  filterToggleTextActive: {
    color: '#0F0F23',
  },
  filterHintButton: {
    padding: 4,
  },
  filterHintText: {
    color: '#B0B0B0',
    fontSize: 11,
    marginTop: 6,
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
  areaCardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  areaCardWrapper: {
    flexBasis: '48%',
    maxWidth: '48%',
  },
  areaCardSelected: {
    borderWidth: 2,
    borderColor: '#FFD700',
    borderRadius: 14,
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


