import React, { useMemo } from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { useLifeAreas } from '../../hooks/useLifeAreas'
import { translatePlanetPT } from '../../utils/astro/pt'
import { getLifeAreaLabel } from '../../constants/lifeAreas'
import { useAppLanguage } from '../../hooks/useAppLanguage'

const formatDegree = (longitude: number) => `${longitude.toFixed(1)}°`

const getSignFromDegree = (degree: number): string => {
  const signs = [
    'Aries', 'Touro', 'Gemeos', 'Cancer', 'Leao', 'Virgem',
    'Libra', 'Escorpiao', 'Sagitario', 'Capricornio', 'Aquario', 'Peixes',
  ]
  const signIndex = Math.floor(degree / 30) % 12
  return signs[signIndex]
}

export default function PlanetTimelineScreen() {
  const { t } = useAppLanguage()
  const { transitData, backendCurrentTransits } = useLifeAreas()
  const planets = backendCurrentTransits?.planets || transitData?.currentTransits?.planets || []
  const byArea = transitData?.currentTransits?.transits?.byArea || {}
  const personalTransits = transitData?.currentTransits?.transits?.personal || []

  const areasByPlanet = useMemo(() => {
    const map: Record<string, string[]> = {}
    Object.entries(byArea).forEach(([areaKey, items]) => {
      ;(items as any[]).forEach((item: any) => {
        if (!map[item.transitPlanet]) map[item.transitPlanet] = []
        if (!map[item.transitPlanet].includes(areaKey)) {
          map[item.transitPlanet].push(areaKey)
        }
      })
    })
    return map
  }, [byArea])

  const durationByPlanet = useMemo(() => {
    const counts: Record<string, Record<string, number>> = {}
    personalTransits.forEach((item: any) => {
      if (!item?.transitPlanet) return
      if (!counts[item.transitPlanet]) counts[item.transitPlanet] = {}
      const key = item.durationClass || 'medio'
      counts[item.transitPlanet][key] = (counts[item.transitPlanet][key] || 0) + 1
    })
    const pick = (planet: string) => {
      const entry = counts[planet]
      if (!entry) return 'medio'
      const sorted = Object.entries(entry).sort((a, b) => b[1] - a[1])
      return sorted[0]?.[0] || 'medio'
    }
    return { pick }
  }, [personalTransits])

  const durationLabel = (key: string) => {
    if (key === 'longo') return t('analysis.timeline.timeframe.structural')
    if (key === 'curto') return t('analysis.timeline.timeframe.short')
    return t('analysis.timeline.timeframe.developing')
  }

  return (
    <LinearGradient colors={['#0F0F23', '#1A1A3A']} style={styles.container}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('analysis.planetTimeline.title')}</Text>
          <Text style={styles.subtitle}>{t('analysis.planetTimeline.subtitle')}</Text>
          <Text style={styles.helper}>{t('analysis.planetTimeline.helper')}</Text>
        </View>

        {!planets.length ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>{t('analysis.planetTimeline.empty')}</Text>
          </View>
        ) : (
          planets.map((planet: any) => {
            const areaKeys = areasByPlanet[planet.name] || []
            return (
              <View key={planet.name} style={styles.planetCard}>
                <View style={styles.planetHeader}>
                  <Ionicons name="planet" size={18} color="#FDE68A" />
                  <Text style={styles.planetName}>{translatePlanetPT(planet.name)}</Text>
                </View>
                <Text style={styles.planetMeta}>
                  {formatDegree(planet.longitude)} {getSignFromDegree(planet.longitude)} · {t('analysis.house')} {planet.house}
                  {planet.isRetrograde ? ` · ${t('analysis.retrograde')}` : ''}
                </Text>
                <Text style={styles.planetFlowTitle}>{t('analysis.planetTimeline.trendTitle')}</Text>
                <Text style={styles.planetFlowText}>{t('analysis.planetTimeline.trendSubtitle')}</Text>
                <View style={styles.timelineRow}>
                  <View style={styles.timelineChip}>
                    <Text style={styles.timelineChipText}>{t('analysis.planetTimeline.chip.now')}</Text>
                  </View>
                  <View style={styles.timelineChip}>
                    <Text style={styles.timelineChipText}>{t('analysis.planetTimeline.chip.short')}</Text>
                  </View>
                  <View style={styles.timelineChip}>
                    <Text style={styles.timelineChipText}>{t('analysis.planetTimeline.chip.mid')}</Text>
                  </View>
                </View>
                <Text style={styles.timelineLabel}>
                  {t('analysis.planetTimeline.classification')}: {durationLabel(durationByPlanet.pick(planet.name))}
                </Text>
                {areaKeys.length > 0 && (
                  <View style={styles.areaList}>
                    <Text style={styles.areaTitle}>{t('analysis.planetTimeline.areas')}</Text>
                    {areaKeys.map((areaKey) => (
                      <Text key={`${planet.name}-${areaKey}`} style={styles.areaItem}>
                        • {getLifeAreaLabel(areaKey)}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
            )
          })
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  title: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '700',
  },
  subtitle: {
    color: '#C7D2FE',
    fontSize: 13,
    marginTop: 6,
  },
  helper: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 8,
  },
  emptyState: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  emptyText: {
    color: '#CBD5F5',
    fontSize: 12,
  },
  planetCard: {
    marginTop: 16,
    marginHorizontal: 16,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    borderRadius: 12,
    padding: 14,
  },
  planetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  planetName: {
    color: '#FDE68A',
    fontSize: 14,
    fontWeight: '700',
  },
  planetMeta: {
    color: '#E2E8F0',
    fontSize: 12,
    marginTop: 6,
  },
  planetFlowTitle: {
    marginTop: 10,
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '600',
  },
  planetFlowText: {
    color: '#CBD5F5',
    fontSize: 11,
    marginTop: 4,
  },
  timelineRow: {
    marginTop: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  timelineChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.35)',
  },
  timelineChipText: {
    color: '#CBD5F5',
    fontSize: 10,
  },
  timelineLabel: {
    marginTop: 6,
    color: '#94A3B8',
    fontSize: 11,
  },
  areaList: {
    marginTop: 10,
  },
  areaTitle: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 4,
  },
  areaItem: {
    color: '#CBD5F5',
    fontSize: 11,
    marginBottom: 2,
  },
  bottomSpacing: {
    height: 40,
  },
})
