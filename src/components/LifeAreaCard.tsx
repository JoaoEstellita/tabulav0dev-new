import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import type { LifeArea } from '../services/prokerala/TransitService'

interface LifeAreaCardProps {
  area: LifeArea
  onPress?: () => void
}

const AREA_ICONS: Record<string, string> = {
  // Português (sistema atual)
  amor: 'heart',
  carreira: 'briefcase',
  financas: 'cash',
  saude: 'fitness',
  familia: 'people',
  espiritualidade: 'flower',
  comunicacao: 'chatbubble',
  transformacao: 'refresh',
  // Inglês (fallback)
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
  // Português (sistema atual)
  amor: ['#FF6B9D', '#FF8E8E'],
  carreira: ['#4ECDC4', '#44A08D'],
  financas: ['#FFD93D', '#FF9F40'],
  saude: ['#96E6A1', '#7BC142'],
  familia: ['#FF9F40', '#FFD93D'],
  espiritualidade: ['#B19CD9', '#8B5CF6'],
  comunicacao: ['#60A5FA', '#3B82F6'],
  transformacao: ['#F472B6', '#EC4899'],
  // Inglês (fallback)
  love: ['#FF6B9D', '#FF8E8E'],
  career: ['#4ECDC4', '#44A08D'],
  health: ['#96E6A1', '#7BC142'],
  family: ['#FFD93D', '#FF9F40'],
  spirituality: ['#B19CD9', '#8B5CF6'],
  finances: ['#FFD93D', '#FF9F40'],
  communication: ['#60A5FA', '#3B82F6'],
  transformation: ['#F472B6', '#EC4899'],
}

const TREND_ICONS: Record<string, string> = {
  rising: 'trending-up',
  falling: 'trending-down',
  stable: 'remove',
  // Fallbacks
  crescente: 'trending-up',
  decrescente: 'trending-down',
  estavel: 'remove',
}

const TREND_COLORS: Record<string, string> = {
  rising: '#10B981',
  falling: '#EF4444',
  stable: '#6B7280',
  // Fallbacks
  crescente: '#10B981',
  decrescente: '#EF4444',
  estavel: '#6B7280',
}

export default function LifeAreaCard({ area, onPress }: LifeAreaCardProps) {
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

  // 🛡️ Proteções para evitar undefined
  const areaColors = AREA_COLORS[area.name] || ['#4B5563', '#6B7280'] // Cor padrão cinza
  const areaIcon = AREA_ICONS[area.name] || 'help-circle' // Ícone padrão
  const trendIcon = TREND_ICONS[area.trend] || 'remove' // Ícone padrão
  const trendColor = TREND_COLORS[area.trend] || '#6B7280' // Cor padrão

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <LinearGradient
        colors={areaColors}
        style={[styles.card, area.criticalLevel && styles.criticalCard]}
      >
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons 
            name={areaIcon as any} 
            size={24} 
            color="#FFFFFF" 
          />
        </View>
        
        <View style={styles.trendContainer}>
          <Ionicons 
            name={trendIcon as any} 
            size={16} 
            color={trendColor} 
          />
        </View>
      </View>

      <Text style={styles.areaName}>{translateAreaName(area.name)}</Text>
      
      <View style={styles.statusContainer}>
        <Text style={styles.statusNumber}>{area.percentage || area.status || 0}%</Text>
        <Text style={[styles.statusText, { color: getStatusColor(area.percentage || area.status || 0) }]}>
          {getStatusText(area.percentage || area.status || 0)}
        </Text>
      </View>

      <View style={styles.progressBarContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${area.percentage || area.status || 0}%`,
                backgroundColor: getStatusColor(area.percentage || area.status || 0)
              }
            ]} 
          />
        </View>
      </View>

      <Text style={styles.description}>{area.description || 'Área da vida'}</Text>

      {/* 📊 EQUAÇÃO DOS CÁLCULOS */}
      {area.influences && area.influences.length > 0 && (
        <View style={styles.calculationContainer}>
          <Text style={styles.calculationTitle}>📊 Cálculo:</Text>
          <Text style={styles.calculationFormula}>
            {area.mainPlanets?.slice(0, 2).join(' + ') || 'Planetas'} + Aspectos + Casas = {area.percentage || 0}%
          </Text>
          <Text style={styles.calculationDetail}>
            Base: Dignidades planetárias • Aspectos harmônicos/desafiadores • Força das casas
          </Text>
        </View>
      )}

      {area.criticalLevel && (
        <View style={styles.criticalBadge}>
          <Ionicons name="warning" size={12} color="#FFFFFF" />
          <Text style={styles.criticalText}>Crítico</Text>
        </View>
      )}
    </LinearGradient>
    </TouchableOpacity>
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
  calculationContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 8,
    marginTop: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#FFD700',
  },
  calculationTitle: {
    fontSize: 11,
    color: '#FFD700',
    fontWeight: '600',
    marginBottom: 2,
  },
  calculationFormula: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
    marginBottom: 2,
  },
  calculationDetail: {
    fontSize: 10,
    color: '#CCCCCC',
    opacity: 0.8,
    fontStyle: 'italic',
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