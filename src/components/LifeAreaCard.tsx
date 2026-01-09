import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import type { LifeArea } from '../services/prokerala/TransitService'

interface LifeAreaCardProps {
  area: LifeArea
  onPress?: () => void
  calculationFactors?: string[]
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

export default function LifeAreaCard({ area, onPress, calculationFactors }: LifeAreaCardProps) {
    const getStatusColor = (status: number) => {
    if (status >= 70) return '#10B981'
    if (status >= 40) return '#F59E0B'
    return '#EF4444'
  }

  const getStatusText = (status: number) => {
    if (status >= 70) return 'Excelente'
    if (status >= 40) return 'Moderado'
    return 'Crítico'
  }

    const areaColors = AREA_COLORS[area.name] || ['#4B5563', '#6B7280']
  const areaIcon = AREA_ICONS[area.name] || 'help-circle'
  const baseFactors = calculationFactors?.length
    ? calculationFactors
    : [
        'Dignidade no signo (forca essencial do planeta).',
        'Casa astrologica ocupada e relevancia para a area.',
        'Condicoes acidentais (retrogrado, combustao, velocidade).',
        'Aspectos considerados (harmonicos e desafiadores).',
        'Peso planetario (luminares/sociais ajustam a influencia).'
      ]

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <LinearGradient
        colors={areaColors as any}
        style={[styles.card, area.criticalLevel && styles.criticalCard]}
      >
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name={areaIcon as any} size={24} color="#FFFFFF" />
          </View>
        </View>

        <Text style={styles.areaName}>{translateAreaName(area.name)}</Text>

        <View style={styles.statusContainer}>
          <Text style={styles.statusNumber}>{area.status || 0}%</Text>
          <Text style={[styles.statusText, { color: getStatusColor(area.status || 0) }]}>
            {getStatusText(area.status || 0)}
          </Text>
        </View>
        <View style={styles.factorsSection}>
          <Text style={styles.factorsTitle}>Fatores do calculo</Text>
          {baseFactors.map((factor, idx) => (
            <Text key={idx} style={styles.factorText}>- {factor}</Text>
          ))}
        </View>
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
  factorsSection: {
    marginTop: 8,
  },
  factorsTitle: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
  },
  factorText: {
    color: '#FFFFFF',
    fontSize: 11,
    lineHeight: 14,
    opacity: 0.92,
    marginBottom: 2,
  },
})
