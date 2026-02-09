import React, { useMemo, useState } from 'react'
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

type ForecastEvent = {
  id: string
  exactAt: string
  intensity: number
  impact: 'UP' | 'DOWN' | 'MIXED'
  shortText: string
}

type RouteParams = {
  events: ForecastEvent[]
  rangeFrom: string
  rangeTo: string
  badgeFilter?: 'all' | 'critical' | 'strong'
  dailyBadges?: Record<string, { criticalCount: number; strongCount: number }>
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

function buildDirectEventText(event: ForecastEvent) {
  if (event.impact === 'UP') {
    return `${event.shortText} Janela favoravel para avancar em passos simples e consistentes.`
  }
  if (event.impact === 'DOWN') {
    return `${event.shortText} Momento de ajuste: revisar ritmo e reduzir excesso.`
  }
  return `${event.shortText} Momento misto: avance com cautela e faca revisoes curtas.`
}

function buildFullEventInterpretation(event: ForecastEvent) {
  const intensity = Math.round((event.intensity || 0) * 100)
  const impact =
    event.impact === 'UP'
      ? 'A tendencia geral e construtiva se houver priorizacao e rotina.'
      : event.impact === 'DOWN'
      ? 'A tendencia geral pede realismo: menos impulso e mais ajuste de rota.'
      : 'A tendencia geral alterna avancos e freios, exigindo sequencia e metodo.'
  return `Interpretacao completa: intensidade estimada em ${intensity}%. ${impact} Use este transito como contexto para decidir o proximo passo pratico, sem tentar resolver tudo de uma vez.`
}

export default function ForecastPeriodEventsScreen({ route }: { route: { params: RouteParams } }) {
  const { events, rangeFrom, rangeTo, badgeFilter: initialFilter = 'all', dailyBadges } = route.params || {}
  const [badgeFilter, setBadgeFilter] = useState<'all' | 'critical' | 'strong'>(initialFilter)
  const [expandedEvents, setExpandedEvents] = useState<Record<string, boolean>>({})
  const [expandedFullEvents, setExpandedFullEvents] = useState<Record<string, boolean>>({})

  const eventsByDate = useMemo(() => {
    const map: Record<string, ForecastEvent[]> = {}
    ;(events || []).forEach((event) => {
      const dateKey = (event.exactAt || '').slice(0, 10)
      if (!dateKey) return
      if (!map[dateKey]) map[dateKey] = []
      map[dateKey].push(event)
    })
    Object.keys(map).forEach((key) => {
      map[key] = map[key].slice().sort((a, b) => b.intensity - a.intensity)
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
              {item.events.map((event) => (
                <View key={event.id} style={styles.eventCard}>
                  <Text style={styles.eventTitle}>{event.shortText}</Text>
                  <Text style={styles.eventMeta}>Impacto {impactLabel(event.impact)}</Text>
                  <TouchableOpacity
                    style={styles.eventToggle}
                    onPress={() => setExpandedEvents((prev) => ({ ...prev, [event.id]: !prev[event.id] }))}
                  >
                    <Text style={styles.eventToggleText}>
                      {expandedEvents[event.id] ? 'Ocultar texto direto' : 'Ver texto direto'}
                    </Text>
                  </TouchableOpacity>
                  {expandedEvents[event.id] ? (
                    <View style={styles.eventDetailBlock}>
                      <Text style={styles.eventDetailTitle}>Texto direto</Text>
                      <Text style={styles.eventDetailText}>{buildDirectEventText(event)}</Text>
                      <TouchableOpacity
                        style={styles.eventToggleSecondary}
                        onPress={() =>
                          setExpandedFullEvents((prev) => ({ ...prev, [event.id]: !prev[event.id] }))
                        }
                      >
                        <Text style={styles.eventToggleText}>
                          {expandedFullEvents[event.id]
                            ? 'Ocultar interpretacao completa'
                            : 'Ver interpretacao completa'}
                        </Text>
                      </TouchableOpacity>
                      {expandedFullEvents[event.id] ? (
                        <View style={styles.eventFullBlock}>
                          <Text style={styles.eventDetailTitle}>Interpretacao completa</Text>
                          <Text style={styles.eventDetailText}>{buildFullEventInterpretation(event)}</Text>
                        </View>
                      ) : null}
                    </View>
                  ) : null}
                </View>
              ))}
            </View>
          )
        }}
        ListEmptyComponent={<Text style={styles.emptyText}>Sem eventos no periodo.</Text>}
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
  eventCard: {
    paddingVertical: 6,
  },
  eventTitle: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  eventMeta: {
    color: '#B0B0B0',
    fontSize: 12,
    marginTop: 4,
  },
  eventToggle: {
    marginTop: 8,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#2A2A2E',
  },
  eventToggleSecondary: {
    marginTop: 4,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#3A3A42',
  },
  eventToggleText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '700',
  },
  eventDetailBlock: {
    marginTop: 8,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#2A2A2E',
    paddingTop: 8,
  },
  eventFullBlock: {
    gap: 8,
    borderWidth: 1,
    borderColor: '#2A2A2E',
    borderRadius: 10,
    backgroundColor: '#141418',
    padding: 8,
  },
  eventDetailTitle: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  eventDetailText: {
    color: '#D2D2D7',
    fontSize: 12,
    lineHeight: 18,
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
