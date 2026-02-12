import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useAppLanguage } from '../../hooks/useAppLanguage'
import ImpactStack from '../home/impact/ImpactStack'
import type { ImpactAreaNode } from '../home/impact/buildImpactNodes'

interface AnalysisImpactStackProps {
  impactNodes: ImpactAreaNode[]
  lifeAreas?: Record<string, any> | null
  isLoading?: boolean
}

export default function AnalysisImpactStack({
  impactNodes,
  lifeAreas,
  isLoading,
}: AnalysisImpactStackProps) {
  const { t } = useAppLanguage()
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('analysis.overviewTitle')}</Text>
      <Text style={styles.subtitle}>
        {t('analysis.overviewSubtitle')}
      </Text>
      <ImpactStack
        impactNodes={impactNodes}
        lifeAreas={lifeAreas}
        isLoading={isLoading}
        showHeader={false}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  title: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
    paddingHorizontal: 16,
  },
  subtitle: {
    color: '#C7D2FE',
    fontSize: 13,
    marginTop: 6,
    paddingHorizontal: 16,
  },
})
