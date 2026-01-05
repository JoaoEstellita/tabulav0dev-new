import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import type { LifeArea } from '../services/prokerala/TransitService'
import { translatePlanetPT } from '../utils/astro/pt'

interface LifeAreaCardProps {
  area: LifeArea
  onPress?: () => void
  onViewReasons?: () => void
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

const TREND_ICONS: Record<string, string> = {
  rising: 'trending-up',
  falling: 'trending-down',
  stable: 'remove',
  crescente: 'trending-up',
  decrescente: 'trending-down',
  estavel: 'remove',
}

const TREND_COLORS: Record<string, string> = {
  rising: '#10B981',
  falling: '#EF4444',
  stable: '#6B7280',
  crescente: '#10B981',
  decrescente: '#EF4444',
  estavel: '#6B7280',
}

const PLANET_TOKEN = /\b(Sun|Moon|Mercury|Venus|Mars|Jupiter|Saturn|Uranus|Neptune|Pluto)\b/gi

const translatePlanetTokens = (text: string): string =>
  String(text || '').replace(PLANET_TOKEN, (match) => translatePlanetPT(match))

const normalizeInfluenceText = (text: string): string =>
  translatePlanetTokens(text).replace(/\bdeg\b/gi, '\u00B0')

const translateAreaName = (name: string) => {
  const translations = {
    amor: 'Amor',
    carreira: 'Carreira',
    financas: 'Finan\u00E7as',
    saude: 'Sa\u00FAde',
    familia: 'Fam\u00EDlia',
    espiritualidade: 'Espiritualidade',
    comunicacao: 'Comunica\u00E7\u00E3o',
    transformacao: 'Transforma\u00E7\u00E3o',
    love: 'Amor e Relacionamentos',
    career: 'Carreira e Finan\u00E7as',
    health: 'Sa\u00FAde e Bem-estar',
    family: 'Fam\u00EDlia e Amizades',
    spirituality: 'Espiritualidade e Crescimento',
  }
  return translations[name as keyof typeof translations] || name
}

export default function LifeAreaCard({ area, onPress, onViewReasons }: LifeAreaCardProps) {
  const hints: string[] = Array.isArray((area as any)?.influences)
    ? ((area as any).influences as string[]).slice(0, 2)
    : []

  const getStatusColor = (status: number) => {
    if (status >= 70) return '#10B981'
    if (status >= 40) return '#F59E0B'
    return '#EF4444'
  }

  const getStatusText = (status: number) => {
    if (status >= 70) return 'Excelente'
    if (status >= 40) return 'Moderado'
    return 'Cr\u00EDtico'
  }

  const areaColors = AREA_COLORS[area.name] || ['#4B5563', '#6B7280']
  const areaIcon = AREA_ICONS[area.name] || 'help-circle'
  const trendIcon = TREND_ICONS[area.trend] || 'remove'
  const trendColor = TREND_COLORS[area.trend] || '#6B7280'

  const baseDescription = area.description || (hints.length ? `Fatores-chave: ${hints.join(' - ')}` : '\u00C1rea da vida')
  const descriptionText = normalizeInfluenceText(baseDescription)

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

          <View style={styles.trendContainer}>
            <Ionicons name={trendIcon as any} size={16} color={trendColor} />
          </View>
        </View>

        <Text style={styles.areaName}>{translateAreaName(area.name)}</Text>

        <View style={styles.statusContainer}>
          <Text style={styles.statusNumber}>{area.status || 0}%</Text>
          <Text style={[styles.statusText, { color: getStatusColor(area.status || 0) }]}>
            {getStatusText(area.status || 0)}
          </Text>
        </View>

        <View style={styles.progressBarContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${area.status || 0}%`,
                  backgroundColor: getStatusColor(area.status || 0),
                },
              ]}
            />
          </View>
        </View>

        <Text style={styles.description}>{descriptionText}</Text>

        {onViewReasons && (
          <TouchableOpacity onPress={onViewReasons} style={styles.reasonsButton}>
            <Text style={styles.reasonsText}>Ver justificativas</Text>
          </TouchableOpacity>
        )}

        {area.criticalLevel && (
          <View style={styles.criticalBadge}>
            <Ionicons name="warning" size={12} color="#FFFFFF" />
            <Text style={styles.criticalText}>Cr\u00EDtico</Text>
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
  reasonsButton: {
    marginTop: 8,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  reasonsText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
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
