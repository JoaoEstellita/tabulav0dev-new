import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import type { LifeArea } from '../services/prokerala/TransitService'

interface LifeAreaCardProps {
  area: LifeArea
}

const AREA_ICONS = {
  love: 'heart',
  career: 'briefcase',
  health: 'fitness',
  family: 'people',
  spirituality: 'flower',
} as const

const AREA_COLORS = {
  love: ['#FF6B9D', '#FF8E8E'],
  career: ['#4ECDC4', '#44A08D'],
  health: ['#96E6A1', '#7BC142'],
  family: ['#FFD93D', '#FF9F40'],
  spirituality: ['#B19CD9', '#8B5CF6'],
} as const

const TREND_ICONS = {
  rising: 'trending-up',
  falling: 'trending-down',
  stable: 'remove',
} as const

const TREND_COLORS = {
  rising: '#10B981',
  falling: '#EF4444',
  stable: '#6B7280',
}

export default function LifeAreaCard({ area }: LifeAreaCardProps) {
  const getStatusColor = (status: number) => {
    if (status >= 70) return '#10B981' // Verde
    if (status >= 40) return '#F59E0B' // Amarelo
    return '#EF4444' // Vermelho
  }

  const getStatusText = (status: number) => {
    if (status >= 70) return 'Excelente'
    if (status >= 40) return 'Moderado'
    return 'Crítico'
  }

  const translateAreaName = (name: string) => {
    const translations = {
      love: 'Amor & Relacionamentos',
      career: 'Carreira & Finanças',
      health: 'Saúde & Bem-estar',
      family: 'Família & Amizades',
      spirituality: 'Espiritualidade & Crescimento',
    }
    return translations[name as keyof typeof translations] || name
  }

  return (
    <LinearGradient
      colors={AREA_COLORS[area.name]}
      style={[styles.card, area.criticalLevel && styles.criticalCard]}
    >
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons 
            name={AREA_ICONS[area.name] as any} 
            size={24} 
            color="#FFFFFF" 
          />
        </View>
        
        <View style={styles.trendContainer}>
          <Ionicons 
            name={TREND_ICONS[area.trend] as any} 
            size={16} 
            color={TREND_COLORS[area.trend]} 
          />
        </View>
      </View>

      <Text style={styles.areaName}>{translateAreaName(area.name)}</Text>
      
      <View style={styles.statusContainer}>
        <Text style={styles.statusNumber}>{area.status}%</Text>
        <Text style={[styles.statusText, { color: getStatusColor(area.status) }]}>
          {getStatusText(area.status)}
        </Text>
      </View>

      <View style={styles.progressBarContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${area.status}%`,
                backgroundColor: getStatusColor(area.status)
              }
            ]} 
          />
        </View>
      </View>

      <Text style={styles.description}>{area.description}</Text>

      {area.criticalLevel && (
        <View style={styles.criticalBadge}>
          <Ionicons name="warning" size={12} color="#FFFFFF" />
          <Text style={styles.criticalText}>Crítico</Text>
        </View>
      )}
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    margin: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    minHeight: 160,
  },
  criticalCard: {
    borderWidth: 2,
    borderColor: '#EF4444',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  trendContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 4,
  },
  areaName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  statusNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  progressBarContainer: {
    marginBottom: 12,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  description: {
    fontSize: 13,
    color: '#FFFFFF',
    opacity: 0.9,
    lineHeight: 18,
    flex: 1,
  },
  criticalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  criticalText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 4,
  },
})