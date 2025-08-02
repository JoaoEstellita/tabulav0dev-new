import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import type { Transit } from '../services/prokerala/TransitService'

interface TransitCardProps {
  transit: Transit
}

const INFLUENCE_COLORS = {
  positive: ['#10B981', '#34D399'],
  negative: ['#EF4444', '#F87171'],
  neutral: ['#6B7280', '#9CA3AF'],
}

const INFLUENCE_ICONS = {
  positive: 'arrow-up-circle',
  negative: 'arrow-down-circle',
  neutral: 'remove-circle',
} as const

export default function TransitCard({ transit }: TransitCardProps) {
  const getIntensityText = (intensity: number) => {
    if (intensity >= 80) return 'Muito Forte'
    if (intensity >= 60) return 'Forte'
    if (intensity >= 40) return 'Moderado'
    return 'Fraco'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <LinearGradient
      colors={INFLUENCE_COLORS[transit.influence]}
      style={styles.card}
    >
      <View style={styles.header}>
        <View style={styles.planetInfo}>
          <Text style={styles.planetName}>{transit.planet.name}</Text>
          {transit.planet.isRetrograde && (
            <View style={styles.retrogradeIndicator}>
              <Ionicons name="refresh" size={12} color="#FFFFFF" />
              <Text style={styles.retrogradeText}>R</Text>
            </View>
          )}
        </View>
        
        <View style={styles.influenceContainer}>
          <Ionicons 
            name={INFLUENCE_ICONS[transit.influence] as any} 
            size={20} 
            color="#FFFFFF" 
          />
        </View>
      </View>

      <View style={styles.transitInfo}>
        <Text style={styles.transitText}>
          {transit.fromSign} → {transit.toSign}
        </Text>
        <Text style={styles.dateText}>
          {formatDate(transit.transitDate)}
        </Text>
      </View>

      <View style={styles.intensityContainer}>
        <Text style={styles.intensityLabel}>Intensidade:</Text>
        <View style={styles.intensityBar}>
          <View 
            style={[
              styles.intensityFill, 
              { width: `${transit.intensity}%` }
            ]} 
          />
        </View>
        <Text style={styles.intensityText}>
          {getIntensityText(transit.intensity)}
        </Text>
      </View>

      <Text style={styles.description}>{transit.description}</Text>

      {transit.areas.length > 0 && (
        <View style={styles.areasContainer}>
          <Text style={styles.areasLabel}>Áreas Afetadas:</Text>
          <View style={styles.areasRow}>
            {transit.areas.map((area, index) => (
              <View key={index} style={styles.areaTag}>
                <Text style={styles.areaTagText}>
                  {translateArea(area)}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </LinearGradient>
  )
}

function translateArea(area: string): string {
  const translations = {
    love: 'Amor',
    career: 'Carreira',
    health: 'Saúde',
    family: 'Família',
    spirituality: 'Espiritual',
  }
  return translations[area as keyof typeof translations] || area
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  planetInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  planetName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  retrogradeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 8,
  },
  retrogradeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  influenceContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    padding: 8,
  },
  transitInfo: {
    marginBottom: 12,
  },
  transitText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  intensityContainer: {
    marginBottom: 12,
  },
  intensityLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
    marginBottom: 4,
  },
  intensityBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  intensityFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
  },
  intensityText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 20,
    marginBottom: 12,
  },
  areasContainer: {
    marginTop: 8,
  },
  areasLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
    marginBottom: 6,
  },
  areasRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  areaTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  areaTagText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '500',
  },
})