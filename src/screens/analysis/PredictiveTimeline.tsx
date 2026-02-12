import React, { useMemo } from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import type { ImpactAreaNode } from '../home/impact/buildImpactNodes'
import { translatePlanetPT } from '../../utils/astro/pt'
import type { RealAstrologyData } from '../../services/astrology/RealAstrologyEngine'
import { useAppLanguage } from '../../hooks/useAppLanguage'

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

export default function PredictiveTimeline({
  impactNodes,
  currentTransits,
}: PredictiveTimelineProps) {
  const { t } = useAppLanguage()
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
        const labelKey =
          timeframe === 'curto'
            ? 'analysis.timeline.timeframe.short'
            : timeframe === 'estrutural'
            ? 'analysis.timeline.timeframe.structural'
            : 'analysis.timeline.timeframe.developing'
        const hintKey =
          timeframe === 'curto'
            ? 'analysis.timeline.hint.short'
            : timeframe === 'estrutural'
            ? 'analysis.timeline.hint.structural'
            : 'analysis.timeline.hint.developing'
        return {
          planet,
          timeframe,
          label: t(labelKey),
          hint: t(hintKey),
        }
      })
  }, [impactNodes, planetData, t])

  if (!entries.length) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyText}>
          {t('analysis.timeline.empty')}
        </Text>
      </View>
    )
  }

  return (
    <View>
      <Text style={styles.sectionTitle}>{t('analysis.timeline.title')}</Text>
      <Text style={styles.sectionSubtitle}>
        {t('analysis.timeline.subtitle')}
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
              {t('analysis.timeline.footnote')}
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
