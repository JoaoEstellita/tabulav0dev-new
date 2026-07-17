import React from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useLifeAreas } from '../../hooks/useLifeAreas'
import { formatTransitCompact, getTransitState, formatPeakETA, aspectNature, windowsIntersect } from '../../utils/astro/pt'
import { useAppLanguage } from '../../hooks/useAppLanguage'

export default function PersonalTransitsScreen() {
  const { t } = useAppLanguage()
  const { transitData } = useLifeAreas()
  const personalRaw = transitData?.dailyOverview?.personalTodayRich || []

  const seen = new Set<string>()
  const personal = personalRaw.filter((item: any) => {
    const key = `${item.natalPlanet}|${item.type}|${item.transitPlanet}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })

  const collective = (transitData?.dailyOverview?.collectiveKeyAspectsRich || []).filter((a: any) => a.planet1 !== a.planet2)
  const list = personal.slice().sort((a: any, b: any) => {
    const ax = new Date(a?.window?.exact || a?.window?.start || Date.now()).getTime()
    const bx = new Date(b?.window?.exact || b?.window?.start || Date.now()).getTime()
    return ax - bx
  })

  const natureColor = (nature: string) =>
    nature === 'harmonico' ? '#9AE6B4' : nature === 'desafiador' ? '#FCA5A5' : '#FDE68A'

  return (
    <LinearGradient colors={['#0F0F23', '#1A1A3A']} style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Text style={styles.title}>{t('transits.personal.title')}</Text>

        {list.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>{t('transits.personal.empty')}</Text>
          </View>
        ) : (
          list.map((item: any, i: number) => {
            const title = formatTransitCompact(item.natalPlanet, item.type, item.transitPlanet)
            const state = getTransitState(item.window)
            const eta = formatPeakETA(item.window)
            const nature = aspectNature(item.type)
            const hasSynergy = collective.some(
              (c: any) =>
                (c.planet1 === item.natalPlanet ||
                  c.planet2 === item.natalPlanet ||
                  c.planet1 === item.transitPlanet ||
                  c.planet2 === item.transitPlanet) &&
                windowsIntersect(item.window as any, c.window as any)
            )
            const meta = [state, eta].filter(Boolean).join(' · ')

            return (
              <View key={i} style={[styles.card, { borderLeftColor: natureColor(nature) }]}>
                <Text style={[styles.cardTitle, { color: natureColor(nature) }]}>
                  {title}
                  {hasSynergy ? <Text style={styles.synergy}>  ✦ {t('transits.personal.synergy')}</Text> : null}
                </Text>
                {!!meta && <Text style={styles.cardMeta}>{meta}</Text>}
                {!!item.house && (
                  <Text style={styles.cardHouse}>{t('analysis.house')} {item.house}</Text>
                )}
              </View>
            )
          })
        )}
      </ScrollView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, minHeight: 0 },
  scroll: { flex: 1, minHeight: 0 },
  content: { padding: 16, paddingBottom: 40 },
  title: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 14,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 12,
    borderLeftWidth: 3,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  synergy: {
    color: '#C4B5FD',
    fontSize: 12,
    fontWeight: '700',
  },
  cardMeta: {
    color: '#A0AEC0',
    fontSize: 12,
    marginTop: 4,
  },
  cardHouse: {
    color: '#CBD5E1',
    fontSize: 11,
    marginTop: 2,
  },
  emptyCard: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 12,
    padding: 20,
    marginTop: 8,
  },
  emptyText: {
    color: '#94A3B8',
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
  },
})
