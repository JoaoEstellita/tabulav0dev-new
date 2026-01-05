import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { translatePlanetPT } from '../../../utils/astro/pt'
import type { ImpactAreaNode } from './buildImpactNodes'
import ImpactContributorItem from './ImpactContributorItem'

interface ImpactStackRowProps {
  areaKey: string
  areaLabel: string
  areaData?: { percentage?: number; status?: number }
  node: ImpactAreaNode
  expanded: boolean
  onToggle: () => void
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

const getStatusText = (value: number) => {
  if (value >= 70) return 'Excelente'
  if (value >= 40) return 'Moderado'
  return 'Critico'
}

const buildSummary = (node: ImpactAreaNode) => {
  const negatives = node.contributors.filter((item) => item.direction === 'pressao')
  const positives = node.contributors.filter((item) => item.direction === 'apoio')
  const mainNegative = negatives.slice(0, 2).map((item) => translatePlanetPT(item.planet))
  const mainPositive = positives.slice(0, 1).map((item) => translatePlanetPT(item.planet))

  if (node.neutralDominance) {
    return 'Sem predominancia no momento.'
  }

  if (mainNegative.length === 0 && mainPositive.length === 0) {
    return 'For\u00E7as principais indispon\u00EDveis no momento.'
  }

  const negativeText = mainNegative.length ? `Pressao de ${mainNegative.join(' e ')}` : ''
  const positiveText = mainPositive.length ? `Apoio de ${mainPositive.join(' e ')}` : ''
  const joiner = negativeText && positiveText ? '; ' : ''
  return `${negativeText}${joiner}${positiveText}`.trim()
}

export default function ImpactStackRow({
  areaKey,
  areaLabel,
  areaData,
  node,
  expanded,
  onToggle,
}: ImpactStackRowProps) {
  const percentageRaw =
    typeof areaData?.percentage === 'number'
      ? areaData.percentage
      : typeof areaData?.status === 'number'
      ? areaData.status
      : 0

  const percentage = Math.max(0, Math.min(100, percentageRaw))
  const statusText = getStatusText(percentage)
  const iconName = (AREA_ICONS[areaKey] || 'help-circle') as any

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onToggle} activeOpacity={0.8}>
        <View style={styles.header}>
          <View style={styles.areaInfo}>
            <View style={styles.iconWrap}>
              <Ionicons name={iconName} size={14} color="#FDE68A" />
            </View>
            <View>
              <Text style={styles.areaLabel}>{areaLabel}</Text>
              <Text style={styles.summaryText}>{buildSummary(node)}</Text>
            </View>
          </View>
          <View style={styles.scoreWrap}>
            <Text style={styles.scoreValue}>{Math.round(percentage)}%</Text>
            <Text style={styles.scoreLabel}>{statusText}</Text>
          </View>
        </View>

        <View style={styles.stackWrapper}>
          <View style={styles.stackTrack}>
            {node.neutralDominance ? (
              <View style={styles.stackNeutral} />
            ) : (
              <>
                <View
                  style={[
                    styles.stackPositive,
                    { width: `${Math.round(node.positivePct * 100)}%` },
                  ]}
                />
                <View
                  style={[
                    styles.stackNegative,
                    { width: `${Math.round(node.negativePct * 100)}%` },
                  ]}
                />
              </>
            )}
            <View style={styles.stackMarker} />
          </View>
          <Text style={styles.stackCaption}>
            For\u00E7as principais (intensidade relativa)
          </Text>
        </View>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.detailSection}>
          {node.contributors.slice(0, 5).map((contributor) => (
            <ImpactContributorItem
              key={contributor.id}
              contributor={contributor}
              showScore={node.hasBreakdown}
            />
          ))}
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  areaInfo: {
    flexDirection: 'row',
    gap: 10,
    flex: 1,
  },
  iconWrap: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  areaLabel: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '700',
  },
  summaryText: {
    color: '#C7D2FE',
    fontSize: 12,
    marginTop: 2,
  },
  scoreWrap: {
    alignItems: 'flex-end',
  },
  scoreValue: {
    color: '#FDE68A',
    fontSize: 14,
    fontWeight: '700',
  },
  scoreLabel: {
    color: '#94A3B8',
    fontSize: 11,
  },
  stackWrapper: {
    marginTop: 10,
  },
  stackTrack: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 999,
    overflow: 'hidden',
    position: 'relative',
    flexDirection: 'row',
  },
  stackNeutral: {
    backgroundColor: 'rgba(148,163,184,0.4)',
    flex: 1,
  },
  stackPositive: {
    backgroundColor: '#22C55E',
  },
  stackNegative: {
    backgroundColor: '#F97316',
  },
  stackMarker: {
    position: 'absolute',
    left: '50%',
    top: -2,
    width: 2,
    height: 12,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  stackCaption: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 6,
  },
  detailSection: {
    marginTop: 12,
  },
})
