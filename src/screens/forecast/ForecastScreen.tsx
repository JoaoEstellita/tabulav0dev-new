import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useAuth } from '../../hooks/useAuth'
import { useSubscriptionCheck } from '../../hooks/useSubscriptionCheck'
import { useNavigation } from '@react-navigation/native'
import { Calendar } from 'react-native-calendars'

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
  highlights?: { eventId: string; summary: string; impact: string; intensity: number }[]
  meta?: { cached?: boolean; limited?: boolean; premium?: boolean; rulesVersion?: string; durationMs?: number }
}

const PERIODS = [7, 30, 90, 365]
const MONTHS_PT = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
const AREA_ORDER = [
  'amor',
  'carreira',
  'financas',
  'saude',
  'familia',
  'espiritualidade',
  'comunicacao',
  'transformacao',
]
const DOMAIN_LABELS: Record<string, string> = {
  amor: 'Amor',
  carreira: 'Carreira',
  financas: 'Financas',
  saude: 'Saude',
  familia: 'Familia',
  espiritualidade: 'Espiritualidade',
  comunicacao: 'Comunicacao',
  transformacao: 'Transformacao',
}
const DOMAIN_COLORS: Record<string, string> = {
  amor: '#FF6B9D',
  carreira: '#4ECDC4',
  financas: '#FFD93D',
  saude: '#96E6A1',
  familia: '#FF9F40',
  espiritualidade: '#B19CD9',
  comunicacao: '#60A5FA',
  transformacao: '#F472B6',
}

function labelFromScoreValue(score: number | null) {
  if (typeof score !== 'number') return '—'
  if (score < 40) return 'Critico'
  if (score >= 70) return 'Positivo'
  return 'Neutro'
}

function scoreColor(score: number) {
  if (score < 40) return '#FF6B6B'
  if (score >= 70) return '#4ECDC4'
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

function normalizeDomain(value: string) {
  return String(value || '').trim().toLowerCase()
}

function formatDomainLabel(domain: string) {
  const key = normalizeDomain(domain)
  if (DOMAIN_LABELS[key]) return DOMAIN_LABELS[key]
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
  if (delta > 0) return { label: 'Se aproximando', meta: `faltam ${delta} dias` }
  return { label: 'Se afastando', meta: `ha ${Math.abs(delta)} dias` }
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

export default function ForecastScreen() {
  const { user } = useAuth()
  const { subscription, trialActive, isAdmin } = useSubscriptionCheck()
  const navigation = useNavigation()
  const [periodDays, setPeriodDays] = useState(7)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<ForecastResponse | null>(null)
  const [dayStatusByDate, setDayStatusByDate] = useState<Record<string, DayStatusResponse>>({})
  const [dayStatusLoading, setDayStatusLoading] = useState(false)
  const [limitedBanner, setLimitedBanner] = useState(false)
  const [missingBirthData, setMissingBirthData] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null)
  const [expandedEvents, setExpandedEvents] = useState<Record<string, boolean>>({})
  const skipNextFetchRef = useRef(false)

  const isPremium = isAdmin || trialActive || subscription?.active === true
  const granularity = periodDays >= 90 ? 'week' : 'day'

  const fetchForecast = useCallback(async () => {
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
      if (payload.meta?.limited) {
        setLimitedBanner(true)
        if (periodDays !== 7) {
          skipNextFetchRef.current = true
          setPeriodDays(7)
        }
      }
      if (payload.range?.from && payload.range?.to) {
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
      const key = normalizeDomain(domain)
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

  const isDateInRange = useCallback((dateKey: string) => {
    if (!rangeFromStr || !rangeToStr) return true
    return dateKey >= rangeFromStr && dateKey <= rangeToStr
  }, [rangeFromStr, rangeToStr])

  useEffect(() => {
    if (!rangeFromStr) return
    if (!selectedDate || !isDateInRange(selectedDate)) {
      setSelectedDate(rangeFromStr)
    }
  }, [rangeFromStr, rangeToStr, selectedDate, isDateInRange])

  const fetchDayStatus = useCallback(async (dateKey: string) => {
    if (!user?.uid) return
    if (dayStatusByDate[dateKey]) return
    setDayStatusLoading(true)
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
    } catch (err: any) {
      console.warn('Day status fetch failed', err?.message || err)
    } finally {
      setDayStatusLoading(false)
    }
  }, [user?.uid, dayStatusByDate])

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

  const selectedDateKey = selectedDate
  const selectedDateObj = selectedDateKey ? parseUTCDateString(selectedDateKey) : null
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
  const selectedDomainKey = selectedDomain ? normalizeDomain(selectedDomain) : null
  const dayStatus = selectedDateKey ? dayStatusByDate[selectedDateKey] : null
  const selectedEventsRaw = selectedDateKey ? (eventsByDate[selectedDateKey] || []) : []
  const selectedEvents = selectedDomainKey
    ? selectedEventsRaw.filter((event) => (event.domains || []).some((domain) => normalizeDomain(domain) === selectedDomainKey))
    : selectedEventsRaw

  useEffect(() => {
    if (!selectedDateKey) return
    if (!isDateInRange(selectedDateKey)) return
    fetchDayStatus(selectedDateKey)
  }, [selectedDateKey, isDateInRange, fetchDayStatus])

  const formatEventAreas = useCallback((domains: string[]) => {
    if (!Array.isArray(domains)) return ''
    const normalized = domains.map((domain) => normalizeDomain(domain)).filter(Boolean)
    const unique = Array.from(new Set(normalized))
    const ordered = AREA_ORDER.filter((area) => unique.includes(area))
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
      lines.push(`Orb ${event.orbMax.toFixed(1)}°`)
    }
    const areas = formatEventAreas(event.domains || [])
    if (areas) {
      lines.push(`Afeta: ${areas}`)
    }
    return lines
  }, [formatEventAreas])

  const toggleEventDetails = useCallback((eventId: string) => {
    setExpandedEvents((prev) => ({ ...prev, [eventId]: !prev[eventId] }))
  }, [])

  const handleSelectPeriod = (days: number) => {
    if (!isPremium && days !== 7) {
      Alert.alert('Premium', 'Premium desbloqueia 30/90/365 dias')
      navigation.navigate('Premium' as never)
      return
    }
    setPeriodDays(days)
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Previsoes</Text>
        <Text style={styles.subtitle}>Status previsto dos proximos dias</Text>
      </View>

      <View style={styles.periodRow}>
        {PERIODS.map((days) => {
          const locked = !isPremium && days !== 7
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
              ? `Mostrando ${formatDateShort(rangeFrom)} - ${formatDateShort(rangeTo)} (Premium desbloqueia 30/90/365)`
              : 'Mostrando 7 dias (Premium desbloqueia 30/90/365)'}
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
          <TouchableOpacity style={styles.retryButton} onPress={fetchForecast}>
            <Text style={styles.retryText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      )}

      {!loading && !error && (
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.sectionTitle}>Calendario</Text>
          <View style={styles.calendarWrapper}>
            <Calendar
              markingType="multi-dot"
              current={selectedDateKey || rangeFromStr || undefined}
              minDate={rangeFromStr || undefined}
              maxDate={rangeToStr || undefined}
              markedDates={calendarMarkedDates}
              onDayPress={(day) => {
                if (!isDateInRange(day.dateString)) {
                  if (!isPremium) {
                    Alert.alert('Premium', 'Premium desbloqueia datas fora do periodo atual')
                    navigation.navigate('Premium' as never)
                    return
                  }
                  if (data?.meta?.limited) {
                    Alert.alert('Limite', 'O backend limitou o periodo. Tente outro intervalo.')
                  }
                  return
                }
                setSelectedDomain(null)
                setSelectedDate(day.dateString)
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
            <Text style={styles.dayPanelTitle}>
              {selectedDateObj ? `Dia ${formatDateShort(selectedDateObj)}` : 'Dia selecionado'}
            </Text>
            {selectedPoint ? (
              <View style={styles.dayPanelCard}>
                <Text style={styles.dayPanelLabel}>Status global do dia</Text>
                {(() => {
                  const score = typeof dayStatus?.global?.score === 'number' ? dayStatus.global.score : selectedPoint.score
                  if (typeof score !== 'number') {
                    return <Text style={styles.emptyText}>Sem status para este dia.</Text>
                  }
                  return (
                    <Text style={[styles.dayPanelScore, { color: scoreColor(score) }]}>
                      {score} {labelFromScoreValue(score)}
                    </Text>
                  )
                })()}
                {dayStatusLoading && <Text style={styles.emptyText}>Atualizando status do dia...</Text>}
              </View>
            ) : (
              <Text style={styles.emptyText}>Sem dados para o dia selecionado.</Text>
            )}

            <View style={styles.domainSection}>
              <Text style={styles.dayPanelLabel}>Status por area</Text>
              <View style={styles.domainRow}>
                <TouchableOpacity
                  style={[styles.domainChip, !selectedDomainKey && styles.domainChipActive]}
                  onPress={() => setSelectedDomain(null)}
                >
                  <Text style={[styles.domainChipText, !selectedDomainKey && styles.domainChipTextActive]}>Todos</Text>
                </TouchableOpacity>
                {AREA_ORDER.map((domain) => {
                  const domainPoint = selectedSeriesKey ? domainSeriesByDate[domain]?.[selectedSeriesKey] : null
                  const statusArea = dayStatus?.lifeAreas?.[domain]
                  const fallbackScore = typeof selectedPoint?.score === 'number' ? selectedPoint.score : null
                  const chipScore = typeof statusArea?.percentage === 'number'
                    ? statusArea.percentage
                    : typeof domainPoint?.score === 'number'
                    ? domainPoint.score
                    : fallbackScore
                  const chipLabel = `${formatDomainLabel(domain)} ${typeof chipScore === 'number' ? chipScore : '—'}`
                  const isActive = selectedDomainKey === domain
                  const chipColor = DOMAIN_COLORS[domain] || '#2A2A2E'
                  return (
                    <TouchableOpacity
                      key={domain}
                      style={[
                        styles.domainChip,
                        { backgroundColor: chipColor },
                        isActive && styles.domainChipActive,
                      ]}
                      onPress={() => setSelectedDomain(domain)}
                    >
                      <Text style={[styles.domainChipText, isActive && styles.domainChipTextActive]}>
                        {chipLabel}
                      </Text>
                    </TouchableOpacity>
                  )
                })}
              </View>
            </View>

            <Text style={styles.dayPanelLabel}>Eventos do dia</Text>
            {selectedEvents.length === 0 && <Text style={styles.emptyText}>Sem eventos.</Text>}
            {selectedEvents.map((event) => (
              <View key={event.id} style={styles.eventCard}>
                <Text style={styles.eventTitle}>{event.shortText}</Text>
                {selectedDateKey && (() => {
                  const phase = buildEventPhase(selectedDateKey, event)
                  return phase ? (
                    <Text style={styles.eventPhase}>{phase.label} - {phase.meta}</Text>
                  ) : null
                })()}
                <Text style={styles.eventMeta}>Impacto {event.impact}</Text>
                {buildEventDetailLines(event, selectedDateKey).map((line) => (
                  <Text key={`${event.id}-${line}`} style={styles.eventMeta}>{line}</Text>
                ))}
                <TouchableOpacity style={styles.eventToggle} onPress={() => toggleEventDetails(event.id)}>
                  <Text style={styles.eventToggleText}>
                    {expandedEvents[event.id] ? 'Ver menos' : 'Ver mais'}
                  </Text>
                </TouchableOpacity>
                {expandedEvents[event.id] && (
                  <View style={styles.eventExtra}>
                    <Text style={styles.eventExtraTitle}>O que fazer</Text>
                    <Text style={styles.eventExtraText}>Sugestoes praticas em breve.</Text>
                    <Text style={styles.eventExtraTitle}>Pontos de atencao</Text>
                    <Text style={styles.eventExtraText}>Dicas de cuidado em breve.</Text>
                  </View>
                )}
              </View>
            ))}
          </View>

          {!isPremium && (
            <TouchableOpacity style={styles.cta} onPress={() => navigation.navigate('Premium' as never)}>
              <Text style={styles.ctaText}>Desbloquear Premium</Text>
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
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFFFFF',
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
  dayPanel: {
    marginTop: 16,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#1C1C1E',
  },
  dayPanelTitle: {
    color: '#FFFFFF',
    fontWeight: '700',
    marginBottom: 8,
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
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  domainSection: {
    marginBottom: 12,
  },
  domainRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
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
