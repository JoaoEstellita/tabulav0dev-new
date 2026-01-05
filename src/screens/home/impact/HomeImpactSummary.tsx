import React, { useMemo } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { translatePlanetPT } from '../../../utils/astro/pt'
import type { ImpactAreaNode } from './buildImpactNodes'

interface HomeImpactSummaryProps {
  impactNodes: ImpactAreaNode[]
  lifeAreas?: Record<string, any> | null
  lunarPhaseLabel?: string | null
  onScrollToTransits?: () => void
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

const AREA_LABELS: Record<string, string> = {
  amor: 'Amor',
  carreira: 'Carreira',
  financas: 'Finan\u00E7as',
  saude: 'Sa\u00FAde',
  familia: 'Fam\u00EDlia',
  espiritualidade: 'Espiritualidade',
  comunicacao: 'Comunica\u00E7\u00E3o',
  transformacao: 'Transforma\u00E7\u00E3o',
}

const toLabel = (key: string) => AREA_LABELS[key] || (key ? key.charAt(0).toUpperCase() + key.slice(1) : '')

const getStatusText = (value: number) => {
  if (value >= 70) return 'Excelente'
  if (value >= 40) return 'Moderado'
  return 'Cr\u00EDtico'
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
  if (!leader) return 'Sem predomin\u00E2ncia clara agora.'
  if (direction === 'pressao') {
    return second ? `${leader} e ${second} pedem ajustes.` : `${leader} pede ajustes.`
  }
  if (direction === 'apoio') {
    return second ? `${leader} e ${second} sustentam avan\u00E7os.` : `${leader} sustenta avan\u00E7os.`
  }
  return 'Sem predomin\u00E2ncia clara agora.'
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
  accent,
  badge,
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
  accent: string
  badge: string
}) => {
  const iconName = (AREA_ICONS[areaKey] || 'help-circle') as any
  return (
    <View style={styles.rowCard}>
      <View style={styles.rowHeader}>
        <View style={styles.rowTitle}>
          <Ionicons name={iconName} size={14} color={accent} />
          <Text style={styles.rowLabel}>{label}</Text>
        </View>
        <Text style={styles.rowStatus}>
          {Math.round(statusValue)}% {statusText}
        </Text>
      </View>
      <Text style={styles.rowBadge}>{badge}</Text>
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

export default function HomeImpactSummary({
  impactNodes,
  lifeAreas,
  lunarPhaseLabel,
  onScrollToTransits,
}: HomeImpactSummaryProps) {
  const avgScore = useMemo(() => {
    if (!lifeAreas || typeof lifeAreas !== 'object') return null
    const values = Object.values(lifeAreas)
      .map((area: any) => (typeof area?.percentage === 'number' ? area.percentage : null))
      .filter((value): value is number => typeof value === 'number')
    if (!values.length) return null
    const total = values.reduce((sum, value) => sum + value, 0)
    return Math.round(total / values.length)
  }, [lifeAreas])

  const avgLabel = avgScore !== null ? getStatusText(avgScore) : null
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

    pressured.forEach((item) => {
      usedKeys.add(item.areaKey)
      rows.push({
        label: `${toLabel(item.areaKey)}`,
        areaKey: item.areaKey,
        node: item.node,
        areaData: item.areaData,
        direction: 'pressao',
      })
    })

    supported.forEach((item) => {
      if (usedKeys.has(item.areaKey)) return
      rows.push({
        label: `${toLabel(item.areaKey)}`,
        areaKey: item.areaKey,
        node: item.node,
        areaData: item.areaData,
        direction: 'apoio',
      })
    })

    const balanced =
      [...base]
        .filter((item) => !usedKeys.has(item.areaKey))
        .sort((a, b) => Math.abs(a.score - 50) - Math.abs(b.score - 50))[0] || null

    if (balanced) {
      rows.push({
        label: `${toLabel(balanced.areaKey)}`,
        areaKey: balanced.areaKey,
        node: balanced.node,
        areaData: balanced.areaData,
        direction: 'neutro',
      })
    }

    return rows
  }, [impactNodes, lifeAreas])

  if (!summaryRows.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Pulso do momento</Text>
        <Text style={styles.subtitle}>Sem dados suficientes para resumir agora.</Text>
      </View>
    )
  }

  const pressuredRows = summaryRows.filter((row) => row.direction === 'pressao')
  const supportedRows = summaryRows.filter((row) => row.direction === 'apoio')
  const balancedRows = summaryRows.filter((row) => row.direction === 'neutro')
  const metaParts = [
    pressuredRows.length ? `${pressuredRows.length} em ajuste` : '',
    supportedRows.length ? `${supportedRows.length} em apoio` : '',
    balancedRows.length ? `${balancedRows.length} em equil\u00EDbrio` : '',
  ].filter(Boolean)
  const metaSummary = metaParts.length ? metaParts.join(' \u2022 ') : 'Sem predomin\u00E2ncia clara.'

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pulso do momento</Text>
      <Text style={styles.subtitle}>Onde h\u00E1 mais movimento agora.</Text>
      <View style={styles.metaRow}>
        <Text style={styles.metaLine}>{metaSummary}</Text>
        {avgLabel && avgScore !== null ? (
          <Text style={styles.metaLine}>M\u00E9dia geral: {avgScore}% {avgLabel}</Text>
        ) : null}
        {lunarPhaseLabel ? (
          <Text style={styles.lunarLine}>Fase lunar: {lunarPhaseLabel}</Text>
        ) : null}
      </View>
      <View style={styles.rows}>
        {pressuredRows.length > 0 && (
          <Text style={styles.sectionLabel}>Em ajuste</Text>
        )}
        {pressuredRows.map((row) => {
          const statusValue = getAreaScore(row.areaData)
          const statusText = getStatusText(statusValue)
          const planets = getTopPlanets(row.node, row.areaData)
          const phrase = buildPhrase(row.direction, planets)
          const neutralDominance = row.node.neutralDominance
          return (
            <SummaryRow
              key={`summary-${row.areaKey}-${row.label}-pressao`}
              label={row.label}
              areaKey={row.areaKey}
              statusValue={statusValue}
              statusText={statusText}
              positivePct={row.node.positivePct}
              negativePct={row.node.negativePct}
              neutralDominance={neutralDominance}
              phrase={phrase}
              planets={planets}
              accent="#FCA5A5"
              badge="Press\u00E3o principal"
            />
          )
        })}
        {supportedRows.length > 0 && (
          <Text style={styles.sectionLabel}>Em apoio</Text>
        )}
        {supportedRows.map((row) => {
          const statusValue = getAreaScore(row.areaData)
          const statusText = getStatusText(statusValue)
          const planets = getTopPlanets(row.node, row.areaData)
          const phrase = buildPhrase(row.direction, planets)
          const neutralDominance = row.node.neutralDominance
          return (
            <SummaryRow
              key={`summary-${row.areaKey}-${row.label}-apoio`}
              label={row.label}
              areaKey={row.areaKey}
              statusValue={statusValue}
              statusText={statusText}
              positivePct={row.node.positivePct}
              negativePct={row.node.negativePct}
              neutralDominance={neutralDominance}
              phrase={phrase}
              planets={planets}
              accent="#6EE7B7"
              badge="Apoio principal"
            />
          )
        })}
        {balancedRows.length > 0 && (
          <Text style={styles.sectionLabel}>Em equil\u00EDbrio</Text>
        )}
        {balancedRows.map((row) => {
          const statusValue = getAreaScore(row.areaData)
          const statusText = getStatusText(statusValue)
          const planets = getTopPlanets(row.node, row.areaData)
          const phrase = buildPhrase(row.direction, planets)
          const neutralDominance = row.node.neutralDominance
          return (
            <SummaryRow
              key={`summary-${row.areaKey}-${row.label}-neutro`}
              label={row.label}
              areaKey={row.areaKey}
              statusValue={statusValue}
              statusText={statusText}
              positivePct={row.node.positivePct}
              negativePct={row.node.negativePct}
              neutralDominance={neutralDominance}
              phrase={phrase}
              planets={planets}
              accent="#CBD5F5"
              badge="Equil\u00EDbrio geral"
            />
          )
        })}
      </View>
      {onScrollToTransits && (
        <TouchableOpacity style={styles.ctaRow} onPress={onScrollToTransits}>
          <Text style={styles.ctaText}>Ver tr\u00E2nsitos em lista</Text>
        </TouchableOpacity>
      )}
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
  metaRow: {
    marginTop: 6,
  },
  metaLine: {
    color: '#94A3B8',
    fontSize: 12,
  },
  lunarLine: {
    color: '#E2E8F0',
    fontSize: 12,
    marginTop: 4,
  },
  rows: {
    gap: 10,
    marginTop: 12,
  },
  sectionLabel: {
    color: '#A78BFA',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 6,
  },
  rowCard: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  rowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rowLabel: {
    color: '#E2E8F0',
    fontSize: 13,
    fontWeight: '600',
  },
  rowStatus: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '600',
  },
  rowBadge: {
    color: '#A1A1AA',
    fontSize: 11,
    marginTop: 4,
  },
  stackTrack: {
    height: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
    flexDirection: 'row',
    marginTop: 8,
  },
  stackPositive: {
    backgroundColor: '#6EE7B7',
    height: '100%',
  },
  stackNegative: {
    backgroundColor: '#FCA5A5',
    height: '100%',
  },
  stackNeutral: {
    backgroundColor: '#CBD5F5',
    height: '100%',
    width: '100%',
  },
  rowPhrase: {
    color: '#E2E8F0',
    fontSize: 12,
    marginTop: 8,
  },
  rowPlanets: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 2,
  },
  ctaRow: {
    marginTop: 12,
    alignItems: 'flex-start',
  },
  ctaText: {
    color: '#FDE68A',
    fontSize: 12,
    fontWeight: '600',
  },
})
