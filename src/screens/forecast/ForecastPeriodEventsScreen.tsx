import React, { useMemo, useState } from 'react'
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import TransitInsightCard from '../../components/TransitInsightCard'
import ReadingDetailModal from '../../components/ReadingDetailModal'
import { buildTransitTitle as buildSharedTransitTitle, extractHouseNumber } from '../../utils/transitPresentation'
import { buildAstroTransitNarrative, buildArchetypeKeywordsForTransit, mergeNarrativeSegments } from '../../utils/astroInterpretation'

type ForecastEvent = {
  id: string
  exactAt: string
  intensity: number
  impact: 'UP' | 'DOWN' | 'MIXED'
  shortText: string
  transitPlanet?: string
  natalPoint?: string
  aspect?: string
  startAt?: string
  endAt?: string
  orbMax?: number
}

type RouteParams = {
  events: ForecastEvent[]
  rangeFrom: string
  rangeTo: string
  badgeFilter?: 'all' | 'critical' | 'strong'
  dailyBadges?: Record<string, { criticalCount: number; strongCount: number }>
}

type EventDetail = {
  id: string
  event: ForecastEvent
  title: string
  statusLabel: string
  statusColor: string
  timingLabel: string
  directText: string
  metaText: string
}

const MONTHS_PT = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

function parseUTCDateString(value: string) {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!match) return null
  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  return new Date(Date.UTC(year, month - 1, day))
}

function formatDateShort(date: Date) {
  const day = String(date.getUTCDate()).padStart(2, '0')
  const month = MONTHS_PT[date.getUTCMonth()]
  const year = date.getUTCFullYear()
  return `${day} ${month} ${year}`
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
  const narrative = buildAstroTransitNarrative(
    {
      transitPlanet: event.transitPlanet,
      aspectName: event.aspect,
      natalPlanet: event.natalPoint,
    },
    'previsoes'
  )
  return narrative.directText
}

function buildFullEventInterpretation(event: ForecastEvent) {
  const narrative = buildAstroTransitNarrative(
    {
      transitPlanet: event.transitPlanet,
      aspectName: event.aspect,
      natalPlanet: event.natalPoint,
    },
    'previsoes'
  )
  return mergeNarrativeSegments([narrative.fullText], { exclude: [narrative.directText] }).join('\n\n')
}

function buildTimingLabel(event: ForecastEvent) {
  const exactDate = parseUTCDateString((event.exactAt || '').slice(0, 10))
  if (!exactDate) return 'Sem janela definida'
  return `Pico em ${formatDateShort(exactDate)}`
}

function buildEventKeywords(event: ForecastEvent) {
  const out: string[] = buildArchetypeKeywordsForTransit(
    {
      transitPlanet: event.transitPlanet,
      aspectName: event.aspect,
      natalPlanet: event.natalPoint,
    },
    'previsoes'
  )
  const add = (value?: string | null) => {
    const token = String(value || '').trim()
    if (!token) return
    if (!out.some((item) => item.toLowerCase() === token.toLowerCase())) out.push(token)
  }
  add(String(event.transitPlanet || ''))
  add(normalizeAspectLabel(event.aspect || ''))
  add(String(event.natalPoint || ''))
  add(impactLabel(event.impact))
  add(buildTimingLabel(event))
  return out.slice(0, 5)
}

function eventPriorityScore(event: ForecastEvent) {
  let score = Math.max(0, Number(event.intensity || 0)) * 100
  if (event.impact === 'DOWN') score += 22
  else if (event.impact === 'UP') score += 12
  else score += 8
  if (typeof event.orbMax === 'number' && Number.isFinite(event.orbMax)) {
    score += Math.max(0, 3 - event.orbMax) * 4
  }
  return score
}

export default function ForecastPeriodEventsScreen({ route }: { route: { params: RouteParams } }) {
  const { events, rangeFrom, rangeTo, badgeFilter: initialFilter = 'all', dailyBadges } = route.params || {}
  const [badgeFilter, setBadgeFilter] = useState<'all' | 'critical' | 'strong'>(initialFilter)
  const [detail, setDetail] = useState<EventDetail | null>(null)

  const eventsByDate = useMemo(() => {
    const map: Record<string, ForecastEvent[]> = {}
    ;(events || []).forEach((event) => {
      const dateKey = (event.exactAt || '').slice(0, 10)
      if (!dateKey) return
      if (!map[dateKey]) map[dateKey] = []
      map[dateKey].push(event)
    })
    Object.keys(map).forEach((key) => {
      map[key] = map[key].slice().sort((a, b) => eventPriorityScore(b) - eventPriorityScore(a))
    })
    return map
  }, [events])

  const periodList = useMemo(() => {
    if (!rangeFrom || !rangeTo) return []
    const list: { date: string; events: ForecastEvent[] }[] = []
    let cursor = parseUTCDateString(rangeFrom)
    const end = parseUTCDateString(rangeTo)
    if (!cursor || !end) return []
    while (cursor <= end) {
      const dateKey = cursor.toISOString().slice(0, 10)
      const items = eventsByDate[dateKey] || []
      const badge = dailyBadges?.[dateKey]
      const criticalCount = badge ? badge.criticalCount : items.filter((event) => event.impact === 'DOWN').length
      const strongCount = badge ? badge.strongCount : items.filter((event) => event.intensity >= 0.6).length
      const matchesFilter = badgeFilter === 'all'
        || (badgeFilter === 'critical' && criticalCount > 0)
        || (badgeFilter === 'strong' && strongCount > 0)
      if (items.length && matchesFilter) list.push({ date: dateKey, events: items })
      cursor.setUTCDate(cursor.getUTCDate() + 1)
    }
    return list
  }, [badgeFilter, dailyBadges, eventsByDate, rangeFrom, rangeTo])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Eventos do periodo</Text>
      <View style={styles.filters}>
        <TouchableOpacity
          style={[styles.filterButton, badgeFilter === 'all' && styles.filterButtonActive]}
          onPress={() => setBadgeFilter('all')}
        >
          <Text style={[styles.filterText, badgeFilter === 'all' && styles.filterTextActive]}>Todos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, badgeFilter === 'critical' && styles.filterButtonActive]}
          onPress={() => setBadgeFilter('critical')}
        >
          <Text style={[styles.filterText, badgeFilter === 'critical' && styles.filterTextActive]}>Criticos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, badgeFilter === 'strong' && styles.filterButtonActive]}
          onPress={() => setBadgeFilter('strong')}
        >
          <Text style={[styles.filterText, badgeFilter === 'strong' && styles.filterTextActive]}>Fortes</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={periodList}
        keyExtractor={(item) => item.date}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const dateObj = parseUTCDateString(item.date)
          const header = dateObj ? formatDateShort(dateObj) : item.date
          return (
            <View style={styles.dayBlock}>
              <Text style={styles.dayTitle}>{header}</Text>
              {item.events.map((event) => {
                const statusLabel = impactLabel(event.impact)
                const statusColor = event.impact === 'UP' ? '#22C55E' : event.impact === 'DOWN' ? '#EF4444' : '#D97706'
                const title = buildEventTitle(event)
                const directText = buildDirectEventText(event)
                const intensity = `Intensidade ${Math.round((event.intensity || 0) * 100)}%`
                const orb = typeof event.orbMax === 'number' ? `Orb ${event.orbMax.toFixed(1)} deg` : ''
                const metaText = [intensity, orb].filter(Boolean).join(' • ')
                const impactValue01 = Math.max(0.08, Math.min(1, Number(event.intensity || 0)))
                return (
                  <TransitInsightCard
                    key={event.id}
                    statusLabel={statusLabel}
                    statusColor={statusColor}
                    title={title}
                    timingLabel={buildTimingLabel(event)}
                    directText={directText}
                    impactValue01={impactValue01}
                    impactLabel={`Impacto relativo ${Math.round(impactValue01 * 100)}%`}
                    fullExpanded={false}
                    onToggleFull={() => {}}
                    detailMode="modal"
                    onOpenDetailModal={() =>
                      setDetail({
                        id: event.id,
                        event,
                        title,
                        statusLabel,
                        statusColor,
                        timingLabel: buildTimingLabel(event),
                        directText,
                        metaText,
                      })
                    }
                    modalOpenByCard
                    showModalActionIcon
                    fullTitle="Interpretacao completa"
                    fullText=""
                    metaText={metaText}
                    variant="dark"
                  />
                )
              })}
            </View>
          )
        }}
        ListEmptyComponent={<Text style={styles.emptyText}>Sem eventos no periodo.</Text>}
      />

      <ReadingDetailModal
        visible={!!detail}
        onClose={() => setDetail(null)}
        title={detail?.title || ''}
        timingLabel={detail?.timingLabel || ''}
        directText={detail?.directText || ''}
        fullText={detail ? buildFullEventInterpretation(detail.event) : ''}
        keywords={detail ? buildEventKeywords(detail.event) : []}
        metaText={detail?.metaText || ''}
        statusLabel={detail?.statusLabel || ''}
        statusColor={detail?.statusColor || '#D97706'}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F23',
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  filters: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#1C1C1E',
  },
  filterButtonActive: {
    backgroundColor: '#FFD700',
  },
  filterText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#0F0F23',
  },
  dayBlock: {
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#1C1C1E',
  },
  dayTitle: {
    color: '#FFFFFF',
    fontWeight: '700',
    marginBottom: 6,
  },
  emptyText: {
    color: '#808080',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 12,
  },
  listContent: {
    paddingBottom: 24,
  },
})

