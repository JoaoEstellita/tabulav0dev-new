import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import type { LifeArea } from '../services/prokerala/TransitService'

interface LifeAreaCardProps {
  area: LifeArea
  onPress?: () => void
  calculationFactors?: string[]
  transitCount?: number
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
  love: 'heart',
  career: 'briefcase',
  health: 'fitness',
  family: 'people',
  spirituality: 'flower',
  finances: 'cash',
  communication: 'chatbubble',
  transformation: 'refresh',
}

const AREA_COLORS: Record<string, string[]> = {
  amor: ['#FF6B9D', '#FF8E8E'],
  carreira: ['#4ECDC4', '#44A08D'],
  financas: ['#FFD93D', '#FF9F40'],
  saude: ['#96E6A1', '#7BC142'],
  familia: ['#FF9F40', '#FFD93D'],
  espiritualidade: ['#B19CD9', '#8B5CF6'],
  comunicacao: ['#60A5FA', '#3B82F6'],
  transformacao: ['#F472B6', '#EC4899'],
  love: ['#FF6B9D', '#FF8E8E'],
  career: ['#4ECDC4', '#44A08D'],
  health: ['#96E6A1', '#7BC142'],
  family: ['#FFD93D', '#FF9F40'],
  spirituality: ['#B19CD9', '#8B5CF6'],
  finances: ['#FFD93D', '#FF9F40'],
  communication: ['#60A5FA', '#3B82F6'],
  transformation: ['#F472B6', '#EC4899'],
}

const translateAreaName = (name: string) => {
  const translations = {
    amor: 'Amor',
    carreira: 'Carreira',
    financas: 'Finanças',
    saude: 'Saúde',
    familia: 'Família',
    espiritualidade: 'Espiritualidade',
    comunicacao: 'Comunicação',
    transformacao: 'Transformação',
    love: 'Amor e Relacionamentos',
    career: 'Carreira e Finanças',
    health: 'Saúde e Bem-estar',
    family: 'Família e Amizades',
    spirituality: 'Espiritualidade e Crescimento',
  }
  return translations[name as keyof typeof translations] || name
}

export default function LifeAreaCard({
  area,
  onPress,
  calculationFactors,
  transitCount = 0,
}: LifeAreaCardProps) {
  const getStatusColor = (status: number) => {
    if (status >= 70) return '#10B981'
    if (status >= 40) return '#F59E0B'
    return '#EF4444'
  }

  const getStatusText = (status: number) => {
    if (status >= 70) return 'Excelente'
    if (status >= 40) return 'Moderado'
    return 'Cr¡tico'
  }

  const areaColors = AREA_COLORS[area.name] || ['#4B5563', '#6B7280']
  const areaIcon = AREA_ICONS[area.name] || 'help-circle'
  const statusValue = area.status || 0
  const statusColor = getStatusColor(statusValue)

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <LinearGradient
        colors={areaColors as any}
        style={[styles.card, area.criticalLevel && styles.criticalCard]}
      >
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name={areaIcon as any} size={20} color="#FFFFFF" />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.areaName} numberOfLines={1}>
              {translateAreaName(area.name)}
            </Text>
            <Text style={styles.transitMeta} numberOfLines={1}>
              Transitos: {transitCount}
            </Text>
          </View>
        </View>

        <View style={styles.statusRow}>
          <Text style={styles.statusNumber}>{statusValue}%</Text>
          <Text style={[styles.statusText, { color: statusColor }]}>
            {getStatusText(statusValue)}
          </Text>
        </View>

        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${Math.min(100, Math.max(0, statusValue))}%`,
                backgroundColor: statusColor,
              },
            ]}
          />
        </View>

        <View style={styles.ctaRow}>
          <Text style={styles.ctaText}>Ver justificativas</Text>
          <Ionicons name="chevron-forward" size={16} color="#FFFFFF" />
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
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  transitMeta: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 6,
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
