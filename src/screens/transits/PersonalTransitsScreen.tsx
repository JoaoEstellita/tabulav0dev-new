import React from 'react'
import { View, Text, ScrollView } from 'react-native'
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

  return (
    <ScrollView contentContainerStyle={{ padding: 16, backgroundColor: '#0F0F23', minHeight: '100%' }}>
      <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: '600', marginBottom: 8 }}>
        {t('transits.personal.title')}
      </Text>
      {list.map((item: any, i: number) => {
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

        return (
          <View key={i} style={{ marginBottom: 10 }}>
            <Text style={{ color: nature === 'harmonico' ? '#9AE6B4' : nature === 'desafiador' ? '#FCA5A5' : '#FDE68A', fontSize: 16 }}>
              • {title} {hasSynergy ? `· ${t('transits.personal.synergy')}` : ''}
            </Text>
            {!!(state || eta) && (
              <Text style={{ color: '#A0AEC0', fontSize: 12 }}>{[state, eta].filter(Boolean).join(' • ')}</Text>
            )}
            {!!item.house && <Text style={{ color: '#CBD5E1', fontSize: 11 }}>{t('analysis.house')} {item.house}</Text>}
          </View>
        )
      })}
    </ScrollView>
  )
}
