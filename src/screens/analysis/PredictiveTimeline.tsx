import React, { useMemo } from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import type { ImpactAreaNode } from '../home/impact/buildImpactNodes'
import { translatePlanetPT } from '../../utils/astro/pt'
import type { RealAstrologyData } from '../../services/astrology/RealAstrologyEngine'

interface PredictiveTimelineProps {
  impactNodes: ImpactAreaNode[]
  currentTransits?: RealAstrologyData | null
}

type Timeframe = 'curto' | 'em_desenvolvimento' | 'estrutural'

type TimelineEntry = {
  planet: string
  timeframe: Timeframe
  label: string
  hint: string
}

const toTimeframe = (speed?: number, isRetrograde?: boolean): Timeframe => {
  const safeSpeed = Number.isFinite(speed) ? Math.abs(speed || 0) : 0
  if (isRetrograde || safeSpeed < 0.2) return 'estrutural'
  if (safeSpeed > 1.5) return 'curto'
  return 'em_desenvolvimento'
}

const timeframeLabel = (timeframe: Timeframe) => {
  if (timeframe === 'curto') return 'Passageiro'
  if (timeframe === 'estrutural') return 'Estrutural'
  return 'Em desenvolvimento'
}

const timeframeHint = (timeframe: Timeframe) => {
  if (timeframe === 'curto') {
    return 'Tende a mudar em breve.'
  }
  if (timeframe === 'estrutural') {
    return 'Influencia mais lenta e consistente.'
  }
  return 'Fase de ajuste em curso.'
}

export default function PredictiveTimeline({
  impactNodes,
  currentTransits,
}: PredictiveTimelineProps) {
  const planetData = useMemo(() => {
    const map: Record<string, { speed?: number; isRetrograde?: boolean }> = {}
    currentTransits?.planets?.forEach((planet) => {
      map[planet.name] = { speed: planet.speed, isRetrograde: planet.isRetrograde }
    })
    return map
  }, [currentTransits?.planets])

  const entries = useMemo(() => {
    const weights: Record<string, number> = {}
    impactNodes.forEach((node) => {
      node.contributors.forEach((contributor) => {
        if (!Number.isFinite(contributor.score)) return
        weights[contributor.planet] = (weights[contributor.planet] || 0) + Math.abs(contributor.score)
      })
    })

    return Object.entries(weights)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([planet]) => {
        const meta = planetData[planet]
        const timeframe = toTimeframe(meta?.speed, meta?.isRetrograde)
        return {
          planet,
          timeframe,
          label: timeframeLabel(timeframe),
          hint: timeframeHint(timeframe),
        }
      })
  }, [impactNodes, planetData])

  if (!entries.length) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyText}>
          Sem dados suficientes para uma leitura temporal agora.
        </Text>
      </View>
    )
  }

  return (
    <View>
      <Text style={styles.sectionTitle}>Linha do tempo</Text>
      <Text style={styles.sectionSubtitle}>
        Fases qualitativas guiadas pelo ritmo dos planetas.
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.timelineRow}
      >
        {entries.map((entry) => (
          <View key={`timeline-${entry.planet}`} style={styles.timelineCard}>
            <Text style={styles.timelinePlanet}>{translatePlanetPT(entry.planet)}</Text>
            <Text style={styles.timelineLabel}>{entry.label}</Text>
            <Text style={styles.timelineHint}>{entry.hint}</Text>
            <Text style={styles.timelineFootnote}>
              Indica tendencia, nao determinacao.
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  sectionTitle: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '700',
  },
  sectionSubtitle: {
    color: '#C7D2FE',
    fontSize: 12,
    marginTop: 6,
  },
  timelineRow: {
    marginTop: 12,
    gap: 12,
    paddingRight: 16,
  },
  timelineCard: {
    width: 200,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    borderRadius: 12,
    padding: 12,
  },
  timelinePlanet: {
    color: '#FDE68A',
    fontSize: 13,
    fontWeight: '700',
  },
  timelineLabel: {
    marginTop: 8,
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '600',
  },
  timelineHint: {
    marginTop: 6,
    color: '#CBD5F5',
    fontSize: 11,
  },
  timelineFootnote: {
    marginTop: 8,
    color: '#94A3B8',
    fontSize: 10,
  },
  emptyState: {
    paddingVertical: 12,
  },
  emptyText: {
    color: '#94A3B8',
    fontSize: 12,
  },
})
