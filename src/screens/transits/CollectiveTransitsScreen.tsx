import React from 'react'
import { View, Text, ScrollView } from 'react-native'
import { useLifeAreas } from '../../hooks/useLifeAreas'
import { formatTransitCompact, aspectNature } from '../../utils/astro/pt'
import { useAppLanguage } from '../../hooks/useAppLanguage'

export default function CollectiveTransitsScreen() {
  const { t } = useAppLanguage()
  const { transitData } = useLifeAreas()
  const rawAll = (transitData?.dailyOverview?.collectiveKeyAspectsRich || []).filter((a: any) => a.planet1 !== a.planet2)

  const seen = new Set<string>()
  const raw = rawAll.filter((a: any) => {
    const key = `${a.planet1}|${a.type}|${a.planet2}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })

  const list = raw.slice().sort((a: any, b: any) => {
    const ax = new Date(a?.window?.exact || a?.window?.start || Date.now()).getTime()
    const bx = new Date(b?.window?.exact || b?.window?.start || Date.now()).getTime()
    return ax - bx
  })

  return (
    <ScrollView contentContainerStyle={{ padding: 16, backgroundColor: '#0F0F23', minHeight: '100%' }}>
      <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: '600', marginBottom: 8 }}>
        {t('transits.collective.title')}
      </Text>
      {list.map((a: any, i: number) => {
        const title = formatTransitCompact(a.planet1, a.type, a.planet2)
        const nature = aspectNature(a.type)
        return (
          <View key={i} style={{ marginBottom: 10 }}>
            <Text style={{ color: nature === 'harmonico' ? '#9AE6B4' : nature === 'desafiador' ? '#FCA5A5' : '#FDE68A', fontSize: 16 }}>
              • {title}
            </Text>
          </View>
        )
      })}
    </ScrollView>
  )
}
