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
    if (status >= 70) return 'Intensidade alta'
    if (status >= 40) return 'Intensidade moderada'
    return 'Intensidade baixa'
  }

  const areaColors = AREA_COLORS[area.name] || ['#4B5563', '#6B7280']
  const areaIcon = AREA_ICONS[area.name] || 'help-circle'
  const statusValue = typeof area.status === 'number' ? area.status : 0
  const statusColor = getStatusColor(statusValue)
  const processSynthesis =
    area.processSynthesis || 'Este periodo indica um movimento importante nesta area.'
  const highlights = Array.isArray(area.highlights) ? area.highlights : []
  const highlightsPreview = highlights.slice(0, 2)

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


        <Text style={styles.intensityHint}>
          A intensidade indica o quanto este tema tende a ocupar espaco na experiencia atual. Nao define resultados.
        </Text>

        <View style={styles.processBlock}>
          <Text style={styles.processLabel}>Processo em curso</Text>
          <Text style={styles.processText} numberOfLines={3}>
            {processSynthesis}
          </Text>
        </View>

        {highlightsPreview.length > 0 && (
          <View style={styles.highlightsBlock}>
            <Text style={styles.highlightsLabel}>Destaques do momento</Text>
            {highlightsPreview.map((item, index) => (
              <View key={`${item.headline || 'highlight'}-${index}`} style={styles.highlightItem}>
                <Text style={styles.highlightTitle} numberOfLines={1}>
                  {item.headline || 'Destaque'}
                </Text>
                <Text style={styles.highlightSummary} numberOfLines={2}>
                  {item.summary || 'Movimento em andamento nesta area.'}
                </Text>
              </View>
            ))}
            {highlights.length > highlightsPreview.length && (
              <Text style={styles.moreHighlights}>
                Ver mais ({highlights.length - highlightsPreview.length})
              </Text>
            )}
          </View>
        )}

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
  intensityHint: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.85)',
    marginBottom: 8,
    lineHeight: 14,
  },
  processBlock: {
    marginBottom: 8,
  },
  processLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 2,
  },
  processText: {
    fontSize: 12,
    color: '#FFFFFF',
    lineHeight: 16,
  },
  highlightsBlock: {
    marginBottom: 8,
  },
  highlightsLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 4,
  },
  highlightItem: {
    marginBottom: 4,
  },
  highlightTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  highlightSummary: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.85)',
    lineHeight: 14,
  },
  moreHighlights: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.75)',
    marginTop: 4,
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
