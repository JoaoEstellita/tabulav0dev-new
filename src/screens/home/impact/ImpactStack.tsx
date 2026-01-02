import React, { useMemo, useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import ImpactStackRow from './ImpactStackRow'
import type { ImpactAreaNode } from './buildImpactNodes'

interface ImpactStackProps {
  impactNodes: ImpactAreaNode[]
  lifeAreas?: Record<string, any> | null
  isLoading?: boolean
  title?: string
  subtitle?: string
  showHeader?: boolean
}

const toLabel = (key: string) =>
  key ? key.charAt(0).toUpperCase() + key.slice(1) : ''

export default function ImpactStack({
  impactNodes,
  lifeAreas,
  isLoading = false,
  title = 'Como esse momento se forma',
  subtitle = 'Entenda as principais forcas (apoio e pressao) que moldam seus status agora.',
  showHeader = true,
}: ImpactStackProps) {
  const [expandedKey, setExpandedKey] = useState<string | null>(null)

  const hasBreakdown = useMemo(
    () => impactNodes.some((node) => node.hasBreakdown),
    [impactNodes]
  )

  if (isLoading) {
    return (
      <View style={styles.container}>
        {showHeader && (
          <>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>Carregando detalhes do impacto...</Text>
          </>
        )}
      </View>
    )
  }

  if (!impactNodes.length) {
    return (
      <View style={styles.container}>
        {showHeader && (
          <>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>
              Sem dados de impacto por agora. Tente atualizar em alguns instantes.
            </Text>
          </>
        )}
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {showHeader && (
        <>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </>
      )}
      {!hasBreakdown && (
        <Text style={styles.limitedText}>
          Modo resumido: explicacao limitada nesta versao.
        </Text>
      )}
      <View style={styles.legendRow}>
        <Ionicons name="information-circle-outline" size={14} color="#94A3B8" />
        <Text style={styles.legendText}>Apoio</Text>
        <View style={[styles.legendDot, { backgroundColor: '#22C55E' }]} />
        <Text style={styles.legendText}>Pressao</Text>
        <View style={[styles.legendDot, { backgroundColor: '#F97316' }]} />
        <Text style={styles.legendText}>Intensidade relativa</Text>
      </View>
      <View style={styles.list}>
        {impactNodes.map((node) => {
          const areaData = lifeAreas?.[node.areaKey]
          const expanded = expandedKey === node.areaKey
          return (
            <ImpactStackRow
              key={node.areaKey}
              areaKey={node.areaKey}
              areaLabel={toLabel(node.areaKey)}
              areaData={areaData}
              node={node}
              expanded={expanded}
              onToggle={() =>
                setExpandedKey((current) => (current === node.areaKey ? null : node.areaKey))
              }
            />
          )
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  title: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
  },
  subtitle: {
    color: '#C7D2FE',
    fontSize: 13,
    marginTop: 6,
  },
  limitedText: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 8,
  },
  list: {
    marginTop: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    borderRadius: 16,
    paddingHorizontal: 12,
  },
  legendRow: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  legendText: {
    color: '#94A3B8',
    fontSize: 11,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
})
