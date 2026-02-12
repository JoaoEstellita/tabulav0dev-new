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
        </View>

        <View style={[styles.statusRow, compact && styles.statusRowCompact]}>
          <Text style={styles.statusNumber}>
            {typeof statusValue === 'number' ? `${statusValue}%` : '—'}
          </Text>
          <Text style={[styles.statusText, { color: statusColor }]}>
            {statusText}
          </Text>
        </View>

        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${typeof statusValue === 'number' ? Math.min(100, Math.max(0, statusValue)) : 0}%`,
                backgroundColor: statusColor,
              },
            ]}
          />
        </View>

        {!compact && (
          <View style={styles.ctaRow}>
            <Text style={styles.ctaText}>{tl('Ver justificativas', 'View reasons', 'Ver justificaciones', 'Vedi motivazioni')}</Text>
            <Ionicons name="chevron-forward" size={16} color="#FFFFFF" />
          </View>
        )}
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
  progressTrack: {
    height: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
  },
  ctaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ctaText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
})
