import React, { useMemo } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { translatePlanetPT } from '../../../utils/astro/pt'
import type { ImpactAreaNode } from './buildImpactNodes'

interface HomeImpactSummaryProps {
  impactNodes: ImpactAreaNode[]
  lifeAreas?: Record<string, any> | null
}

const AREA_ICONS: Record<string, string> = {
  amor: 'heart',
  carreira: 'briefcase',
  financas: 'cash',
  saude: 'fitness',
  familia: 'people',
  espiritualidade: 'flower',
  comunicacao: 'chatbubble',
  transformacao: 'refresh',
}

const toLabel = (key: string) =>
  key ? key.charAt(0).toUpperCase() + key.slice(1) : ''

const toDirectionLabel = (direction: 'apoio' | 'pressao' | 'neutro') => {
  if (direction === 'pressao') return 'pressao'
  if (direction === 'apoio') return 'apoio'
  return 'equilibrio'
}

const getStatusText = (value: number) => {
  if (value >= 70) return 'Excelente'
  if (value >= 40) return 'Moderado'
  return 'Critico'
}

const buildMagnitude = (node: ImpactAreaNode) => {
  const positiveSum = node.contributors
    .filter((item) => item.score > 0)
    .reduce((sum, item) => sum + item.score, 0)
  const negativeSumAbs = node.contributors
    .filter((item) => item.score < 0)
    .reduce((sum, item) => sum + Math.abs(item.score), 0)
  return { positiveSum, negativeSumAbs }
}

const getAreaScore = (areaData?: any) => {
  if (!areaData) return 0
  if (typeof areaData.percentage === 'number') return areaData.percentage
  if (typeof areaData.status === 'number') return areaData.status
  return 0
}

const getTopPlanets = (node: ImpactAreaNode, areaData?: any) => {
  const ranked = node.contributors
    .slice()
    .sort((a, b) => Math.abs(b.score) - Math.abs(a.score))
    .filter((item) => item.planet)
    .map((item) => item.planet)
  if (ranked.length >= 2) return ranked.slice(0, 2)
  if (Array.isArray(areaData?.mainPlanets) && areaData.mainPlanets.length > 0) {
    return areaData.mainPlanets.slice(0, 2)
  }
  return ranked.slice(0, 2)
}

const buildPhrase = (direction: 'apoio' | 'pressao' | 'neutro', planets: string[]) => {
  const translated = planets.map((name) => translatePlanetPT(name))
  const leader = translated[0]
  const second = translated[1]
  if (!leader) return 'Sem predominancia clara agora.'
  if (direction === 'pressao') {
    return second ? `${leader} e ${second} pedem ajustes.` : `${leader} pede ajustes.`
  }
  if (direction === 'apoio') {
    return second ? `${leader} e ${second} sustentam avancos.` : `${leader} sustenta avancos.`
  }
  return 'Sem predominancia clara agora.'
}

const SummaryRow = ({
  label,
  areaKey,
  statusValue,
  statusText,
  positivePct,
  negativePct,
  neutralDominance,
  phrase,
  planets,
}: {
  label: string
  areaKey: string
  statusValue: number
  statusText: string
  positivePct: number
  negativePct: number
  neutralDominance: boolean
  phrase: string
  planets: string[]
}) => {
  const iconName = (AREA_ICONS[areaKey] || 'help-circle') as any
  return (
    <View style={styles.rowCard}>
      <View style={styles.rowHeader}>
        <View style={styles.rowTitle}>
          <Ionicons name={iconName} size={14} color="#FDE68A" />
          <Text style={styles.rowLabel}>{label}</Text>
        </View>
        <Text style={styles.rowStatus}>
          {Math.round(statusValue)}% {statusText}
        </Text>
      </View>
      <View style={styles.stackTrack}>
        {neutralDominance ? (
          <View style={styles.stackNeutral} />
        ) : (
          <>
            <View style={[styles.stackPositive, { width: `${Math.round(positivePct * 100)}%` }]} />
            <View style={[styles.stackNegative, { width: `${Math.round(negativePct * 100)}%` }]} />
          </>
        )}
      </View>
      <Text style={styles.rowPhrase}>{phrase}</Text>
      {planets.length > 0 && (
        <Text style={styles.rowPlanets}>
          {planets.map((name) => translatePlanetPT(name)).join(', ')}
        </Text>
      )}
    </View>
  )
}

export default function HomeImpactSummary({ impactNodes, lifeAreas }: HomeImpactSummaryProps) {
  const summaryRows = useMemo(() => {
    if (!impactNodes.length) return []

    const base = impactNodes.map((node) => {
      const areaData = lifeAreas?.[node.areaKey]
      const { positiveSum, negativeSumAbs } = buildMagnitude(node)
      return {
        node,
        areaKey: node.areaKey,
        areaData,
        positiveSum,
        negativeSumAbs,
        score: getAreaScore(areaData),
      }
    })

    const hasMagnitude = base.some((item) => item.positiveSum > 0 || item.negativeSumAbs > 0)
    let pressured: typeof base = []
    let supported: typeof base = []

    if (hasMagnitude) {
      pressured = [...base]
        .sort((a, b) => b.negativeSumAbs - a.negativeSumAbs)
        .filter((item) => item.negativeSumAbs > 0)
        .slice(0, 2)
      supported = [...base]
        .sort((a, b) => b.positiveSum - a.positiveSum)
        .filter((item) => item.positiveSum > 0)
        .slice(0, 1)
    } else {
      pressured = [...base].sort((a, b) => a.score - b.score).slice(0, 2)
      supported = [...base].sort((a, b) => b.score - a.score).slice(0, 1)
    }

    const usedKeys = new Set<string>()
    const rows: Array<{
      label: string
      areaKey: string
      node: ImpactAreaNode
      areaData: any
      direction: 'apoio' | 'pressao' | 'neutro'
    }> = []

    pressured.forEach((item, index) => {
      usedKeys.add(item.areaKey)
      rows.push({
        label: `${toLabel(item.areaKey)} (${toDirectionLabel('pressao')})`,
        areaKey: item.areaKey,
        node: item.node,
        areaData: item.areaData,
        direction: 'pressao',
      })
    })

    supported.forEach((item) => {
      if (usedKeys.has(item.areaKey)) return
      rows.push({
        label: `${toLabel(item.areaKey)} (${toDirectionLabel('apoio')})`,
        areaKey: item.areaKey,
        node: item.node,
        areaData: item.areaData,
        direction: 'apoio',
      })
    })

    return rows
  }, [impactNodes, lifeAreas])

  if (!summaryRows.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Forcas do momento</Text>
        <Text style={styles.subtitle}>Sem dados suficientes para resumir agora.</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forcas do momento</Text>
      <Text style={styles.subtitle}>
        Principais areas com apoio e pressao neste instante.
      </Text>
      <View style={styles.rows}>
        {summaryRows.map((row) => {
          const statusValue = getAreaScore(row.areaData)
          const statusText = getStatusText(statusValue)
          const planets = getTopPlanets(row.node, row.areaData)
          const phrase = buildPhrase(row.direction, planets)
          const neutralDominance = row.node.neutralDominance
          return (
            <SummaryRow
              key={`summary-${row.areaKey}-${row.label}`}
              label={row.label}
              areaKey={row.areaKey}
              statusValue={statusValue}
              statusText={statusText}
              positivePct={row.node.positivePct}
              negativePct={row.node.negativePct}
              neutralDominance={neutralDominance}
              phrase={phrase}
              planets={planets}
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
  rows: {
    marginTop: 12,
    gap: 10,
  },
  rowCard: {
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    borderRadius: 14,
    padding: 12,
  },
  rowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  rowTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rowLabel: {
    color: '#E2E8F0',
    fontSize: 13,
    fontWeight: '600',
  },
  rowStatus: {
    color: '#FDE68A',
    fontSize: 12,
    fontWeight: '600',
  },
  stackTrack: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 999,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  stackPositive: {
    backgroundColor: '#22C55E',
  },
  stackNegative: {
    backgroundColor: '#F97316',
  },
  stackNeutral: {
    flex: 1,
    backgroundColor: 'rgba(148,163,184,0.4)',
  },
  rowPhrase: {
    marginTop: 8,
    color: '#F8FAFC',
    fontSize: 12,
  },
  rowPlanets: {
    marginTop: 4,
    color: '#94A3B8',
    fontSize: 11,
  },
})
