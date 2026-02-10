import React, { useMemo, useState } from 'react'
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import TransitInsightCard from '../../components/TransitInsightCard'
import { buildTransitTitle as buildSharedTransitTitle, extractHouseNumber } from '../../utils/transitPresentation'

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
  const title = buildEventTitle(event)
  const intensity = Math.round((event.intensity || 0) * 100)
  if (event.impact === 'UP') {
    return intensity >= 65
      ? `${title}: fase favoravel para executar a prioridade principal com mais confianca.`
      : `${title}: tendencia construtiva para progresso consistente e organizado.`
  }
  if (event.impact === 'DOWN') {
    return intensity >= 65
      ? `${title}: fase sensivel, pedindo ajuste de ritmo e menos impulsividade.`
      : `${title}: revise expectativas e simplifique o proximo passo antes de ampliar.`
  }
  return `${title}: clima oscilante, avance em etapas curtas e valide cada decisao.`
}

function buildFullEventInterpretation(event: ForecastEvent) {
  const intensity = Math.round((event.intensity || 0) * 100)
  const impactText =
    event.impact === 'UP'
      ? 'A tendencia geral e construtiva quando existe foco, sequencia e consistencia.'
      : event.impact === 'DOWN'
      ? 'A tendencia geral pede realismo: menos impulso, mais calibracao de limite e prazo.'
      : 'A tendencia geral alterna avanco e revisao, exigindo decisao por camadas.'
  return `${impactText} Use o transito como contexto para decidir o proximo passo pratico sem antecipar todas as respostas.`
}

function buildTimingLabel(event: ForecastEvent) {
  const exactDate = parseUTCDateString((event.exactAt || '').slice(0, 10))
  if (!exactDate) return 'Sem janela definida'
  return `Pico em ${formatDateShort(exactDate)}`
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

      <Modal visible={!!detail} animationType="fade" transparent onRequestClose={() => setDetail(null)}>
        <View style={styles.readingBackdrop}>
          <View style={styles.readingCard}>
            {detail ? (
              <>
                <View style={styles.readingHeader}>
                  <View style={[styles.readingStatusBadge, { backgroundColor: detail.statusColor }]}>
                    <Text style={styles.readingStatusText}>{detail.statusLabel}</Text>
                  </View>
                  <TouchableOpacity style={styles.readingCloseIcon} onPress={() => setDetail(null)}>
                    <Ionicons name="close" size={16} color="#0F172A" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.readingTitle}>{detail.title}</Text>
                <Text style={styles.readingTiming}>{detail.timingLabel}</Text>
                <Text style={styles.readingSectionTitle}>Frase-chave</Text>
                <Text style={styles.readingDirect}>{detail.directText}</Text>
                <Text style={styles.readingSectionTitle}>Interpretacao completa</Text>
                <Text style={styles.readingFull}>{buildFullEventInterpretation(detail.event)}</Text>
                {detail.metaText ? <Text style={styles.readingMeta}>{detail.metaText}</Text> : null}
                <TouchableOpacity style={styles.readingCloseButton} onPress={() => setDetail(null)}>
                  <Text style={styles.readingCloseButtonText}>Fechar leitura</Text>
                </TouchableOpacity>
              </>
            ) : null}
          </View>
        </View>
      </Modal>
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
    fontSize: 18,
    lineHeight: 25,
    fontWeight: '600',
  },
  readingFull: {
    color: '#1E293B',
    fontSize: 15,
    lineHeight: 23,
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
})

