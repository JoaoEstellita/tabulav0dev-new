import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import type { LifeArea } from '../services/prokerala/TransitService'
import { STATUS_THRESHOLDS } from '../constants/statusThresholds'
import {
  LIFE_AREA_COLORS,
  LIFE_AREA_ICONS,
} from '../constants/lifeAreas'
import { useAppLanguage } from '../hooks/useAppLanguage'
import { normalizeKey } from '../utils/astro/normalizeKey'
import {
  getAxisShortLabel,
  getAxisLongLabel,
  normalizeAxisScore,
  STATUS_AXIS_COLORS,
} from '../utils/statusAxes'

interface LifeAreaCardProps {
  area: LifeArea
  onPress?: () => void
  calculationFactors?: string[]
  transitCount?: number
  compact?: boolean
}

export default function LifeAreaCard({
  area,
  onPress,
  calculationFactors,
  transitCount,
  compact = false,
}: LifeAreaCardProps) {
  const { language, t } = useAppLanguage()
  const tr = (key: string, fallback: string) => {
    const value = t(key)
    return value === key ? fallback : value
  }
  const tl = (pt: string, en: string, es: string, it: string) => {
    if (language === 'en-US') return en
    if (language === 'es-ES') return es
    if (language === 'it-IT') return it
    return pt
  }

  const translateAreaName = (name: string) => {
    const key = normalizeKey(String(name || ''))
    return tr(`lifeArea.${key}`, name)
  }

  const getStatusColor = (status: number) => {
    if (status >= STATUS_THRESHOLDS.positiveAbove) return '#10B981'
    if (status >= STATUS_THRESHOLDS.criticalBelow) return '#F59E0B'
    return '#EF4444'
  }

  const getStatusText = (status: number) => {
    if (status >= STATUS_THRESHOLDS.positiveAbove) return tr('groups.status.positive', 'Positive')
    if (status >= STATUS_THRESHOLDS.criticalBelow) return tl('Moderado', 'Moderate', 'Moderado', 'Moderato')
    return tr('groups.status.critical', 'Critical')
  }

  const areaColors = LIFE_AREA_COLORS[area.name] || ['#4B5563', '#6B7280']
  const areaIcon = LIFE_AREA_ICONS[area.name] || 'help-circle'
  const statusValue = Number.isFinite(area.status) ? area.status : null
  const statusColor = typeof statusValue === 'number' ? getStatusColor(statusValue) : '#B0B0B0'
  const statusText = typeof statusValue === 'number' ? getStatusText(statusValue) : '—'
  const movementFromArea = normalizeAxisScore((area as any)?.movementScore)
  const movementFromTransitCount = typeof transitCount === 'number'
    ? Math.min(100, Math.max(0, Math.round(transitCount * 16)))
    : null
  const movementValue = movementFromArea ?? movementFromTransitCount
  const attentionFromArea = normalizeAxisScore((area as any)?.attentionScore)
  const attentionFromStatus = typeof statusValue === 'number'
    ? Math.min(100, Math.max(0, Math.round(100 - statusValue)))
    : null
  const attentionValue = attentionFromArea ?? attentionFromStatus
  const movementColor = STATUS_AXIS_COLORS.movement
  const attentionColor = STATUS_AXIS_COLORS.attention
  const movementHot = typeof movementValue === 'number' && movementValue >= 70
  const attentionHot = typeof attentionValue === 'number' && attentionValue >= 70
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <LinearGradient
        colors={areaColors as any}
        style={[styles.card, compact && styles.cardCompact, area.criticalLevel && styles.criticalCard]}
      >
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name={areaIcon as any} size={20} color="#FFFFFF" />
          </View>
          <View style={styles.headerText}>
            <Text style={[styles.areaName, compact && styles.areaNameCompact]} numberOfLines={1}>
              {translateAreaName(area.name)}
            </Text>
          </View>
          {(attentionHot || movementHot) ? (
            <View style={styles.signalBadges}>
              {attentionHot ? (
                <View style={[styles.signalBadge, styles.signalBadgeAttention]}>
                  <Text style={styles.signalBadgeText}>{getAxisShortLabel('attention')}</Text>
                </View>
              ) : null}
              {movementHot ? (
                <View style={[styles.signalBadge, styles.signalBadgeMovement]}>
                  <Text style={styles.signalBadgeText}>{getAxisShortLabel('movement')}</Text>
                </View>
              ) : null}
            </View>
          ) : null}
        </View>

        <View style={[styles.statusRow, compact && styles.statusRowCompact]}>
          <Text style={styles.statusNumber}>
            {typeof statusValue === 'number' ? `${statusValue}%` : '—'}
          </Text>
          <Text style={[styles.statusText, { color: statusColor }]}>
            {statusText}
          </Text>
        </View>

        <View style={[styles.movementRow, compact && styles.movementRowCompact]}>
          <Text style={styles.movementLabel}>
            {getAxisLongLabel('movement', language)}
          </Text>
          <Text style={styles.movementValue}>
            {typeof movementValue === 'number' ? `${movementValue}%` : '—'}
          </Text>
        </View>
        <View style={styles.movementTrack}>
          <View
            style={[
              styles.movementFill,
              {
                width: `${typeof movementValue === 'number' ? Math.min(100, Math.max(0, movementValue)) : 0}%`,
                backgroundColor: movementColor,
              },
            ]}
          />
        </View>

        <View style={[styles.movementRow, compact && styles.movementRowCompact]}>
          <Text style={styles.movementLabel}>
            {getAxisLongLabel('attention', language)}
          </Text>
          <Text style={styles.movementValue}>
            {typeof attentionValue === 'number' ? `${attentionValue}%` : '—'}
          </Text>
        </View>
        <View style={styles.movementTrack}>
          <View
            style={[
              styles.movementFill,
              {
                width: `${typeof attentionValue === 'number' ? Math.min(100, Math.max(0, attentionValue)) : 0}%`,
                backgroundColor: attentionColor,
              },
            ]}
          />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    padding: 12,
    margin: 6,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    minHeight: 110,
  },
  cardCompact: {
    padding: 10,
    margin: 4,
    minHeight: 88,
  },
  criticalCard: {
    borderWidth: 2,
    borderColor: '#EF4444',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  headerText: {
    flex: 1,
  },
  areaName: {
    fontSize: 22,
    lineHeight: 24,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  areaNameCompact: {
    fontSize: 18,
    lineHeight: 20,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 6,
  },
  statusRowCompact: {
    marginBottom: 4,
  },
  statusNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginRight: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 1,
    borderRadius: 8,
  },
  movementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  movementRowCompact: {
    marginBottom: 3,
  },
  movementLabel: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.82)',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  movementValue: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  movementTrack: {
    height: 3.5,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    overflow: 'hidden',
  },
  movementFill: {
    height: '100%',
    borderRadius: 999,
  },
  signalBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  signalBadge: {
    minWidth: 20,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    backgroundColor: 'rgba(2,6,23,0.28)',
  },
  signalBadgeAttention: {
    backgroundColor: STATUS_AXIS_COLORS.attention,
  },
  signalBadgeMovement: {
    backgroundColor: STATUS_AXIS_COLORS.movement,
  },
  signalBadgeText: {
    color: '#0B1020',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
})
