import React from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import type { PlanetComparison, ChartSummary } from '../services/astrology/RealAstrologyEngine'

interface TransitComparisonCardProps {
  planetComparisons: PlanetComparison[]
  chartSummary: ChartSummary
}

// 🌍 Ícones dos Elementos
const ELEMENT_ICONS = {
  fire: '🔥',
  earth: '🌍', 
  air: '💨',
  water: '💧'
} as const

// ⚡ Ícones das Modalidades
const MODALITY_ICONS = {
  cardinal: '⚡',
  fixed: '🔒',
  mutable: '🔄'
} as const

// ⭐ Ícones dos Aspectos
const ASPECT_ICONS = {
  'conjunção': '☌',
  'sextil': '⚹', 
  'quadratura': '□',
  'trígono': '△',
  'oposição': '☍'
} as const

// 🎨 Cores dos Aspectos
const ASPECT_COLORS = {
  'conjunção': '#FFD700',
  'sextil': '#10B981',
  'quadratura': '#EF4444',
  'trígono': '#3B82F6',
  'oposição': '#F59E0B'
} as const

export default function TransitComparisonCard({ 
  planetComparisons, 
  chartSummary 
}: TransitComparisonCardProps) {
  
  const formatDegree = (longitude: number): string => {
    return `${longitude.toFixed(1)}°`
  }

  const formatSpeed = (speed: number): string => {
    const direction = speed >= 0 ? '↑' : '↓'
    return `${direction}${Math.abs(speed).toFixed(2)}°/dia`
  }

  const getAspectColor = (aspect: string): string => {
    return ASPECT_COLORS[aspect as keyof typeof ASPECT_COLORS] || '#6B7280'
  }

  const getAspectIcon = (aspect: string): string => {
    return ASPECT_ICONS[aspect as keyof typeof ASPECT_ICONS] || '•'
  }

  return (
    <LinearGradient
      colors={['#1E1E2E', '#2A2A3E']}
      style={styles.container}
    >
      {/* 📊 Resumo Elemental e Modal */}
      <View style={styles.summarySection}>
        <View style={styles.sectionHeader}>
          <Ionicons name="analytics" size={20} color="#FFD700" />
          <Text style={styles.sectionTitle}>Resumo da Carta</Text>
        </View>

        {/* Análise Elemental */}
        <View style={styles.analysisRow}>
          <Text style={styles.analysisLabel}>🌍 Elementos:</Text>
          <View style={styles.elementalGrid}>
            <View style={styles.elementalComparison}>
              <Text style={styles.comparisonLabel}>Natal:</Text>
              <View style={styles.elementalRow}>
                {Object.entries(chartSummary.elemental.natal).map(([element, count]) => (
                  <Text key={element} style={styles.elementalItem}>
                    {ELEMENT_ICONS[element as keyof typeof ELEMENT_ICONS]}{count}
                  </Text>
                ))}
              </View>
            </View>
            <View style={styles.elementalComparison}>
              <Text style={styles.comparisonLabel}>Atual:</Text>
              <View style={styles.elementalRow}>
                {Object.entries(chartSummary.elemental.current).map(([element, count]) => (
                  <Text key={element} style={styles.elementalItem}>
                    {ELEMENT_ICONS[element as keyof typeof ELEMENT_ICONS]}{count}
                  </Text>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Análise de Modalidades */}
        <View style={styles.analysisRow}>
          <Text style={styles.analysisLabel}>⚡ Modalidades:</Text>
          <View style={styles.elementalGrid}>
            <View style={styles.elementalComparison}>
              <Text style={styles.comparisonLabel}>Natal:</Text>
              <View style={styles.elementalRow}>
                {Object.entries(chartSummary.modality.natal).map(([modality, count]) => (
                  <Text key={modality} style={styles.elementalItem}>
                    {MODALITY_ICONS[modality as keyof typeof MODALITY_ICONS]}{count}
                  </Text>
                ))}
              </View>
            </View>
            <View style={styles.elementalComparison}>
              <Text style={styles.comparisonLabel}>Atual:</Text>
              <View style={styles.elementalRow}>
                {Object.entries(chartSummary.modality.current).map(([modality, count]) => (
                  <Text key={modality} style={styles.elementalItem}>
                    {MODALITY_ICONS[modality as keyof typeof MODALITY_ICONS]}{count}
                  </Text>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Mudanças Detectadas */}
        {(chartSummary.elemental.changes.length > 0 || chartSummary.modality.changes.length > 0) && (
          <View style={styles.changesSection}>
            <Text style={styles.changesTitle}>📈 Mudanças Detectadas:</Text>
            {chartSummary.elemental.changes.map((change, index) => (
              <Text key={`elemental-${index}`} style={styles.changeItem}>• {change}</Text>
            ))}
            {chartSummary.modality.changes.map((change, index) => (
              <Text key={`modality-${index}`} style={styles.changeItem}>• {change}</Text>
            ))}
          </View>
        )}
      </View>

      {/* 🪐 Comparações Planetárias */}
      <ScrollView style={styles.planetsSection} showsVerticalScrollIndicator={false}>
        <View style={styles.sectionHeader}>
          <Ionicons name="planet" size={20} color="#FFD700" />
          <Text style={styles.sectionTitle}>Trânsitos Comparativos</Text>
        </View>

        {planetComparisons.map((comparison, index) => (
          <View key={comparison.name} style={styles.planetCard}>
            {/* Cabeçalho do Planeta */}
            <View style={styles.planetHeader}>
              <Text style={styles.planetName}>
                {comparison.name === 'Sun' ? '☉' : 
                 comparison.name === 'Moon' ? '☽' :
                 comparison.name === 'Mercury' ? '☿' :
                 comparison.name === 'Venus' ? '♀' :
                 comparison.name === 'Mars' ? '♂' :
                 comparison.name === 'Jupiter' ? '♃' :
                 comparison.name === 'Saturn' ? '♄' :
                 comparison.name === 'Uranus' ? '♅' :
                 comparison.name === 'Neptune' ? '♆' :
                 comparison.name === 'Pluto' ? '♇' : '●'} {comparison.name}
              </Text>
            </View>

            {/* Comparação Natal vs Atual */}
            <View style={styles.comparisonGrid}>
              {/* Coluna Natal */}
              <View style={styles.comparisonColumn}>
                <Text style={styles.columnTitle}>🌟 Natal</Text>
                <Text style={styles.positionText}>
                  {formatDegree(comparison.natal.longitude)} {comparison.natal.sign}
                </Text>
                <Text style={styles.houseText}>Casa {comparison.natal.house}</Text>
                <View style={styles.attributesRow}>
                  <Text style={styles.attributeChip}>
                    {ELEMENT_ICONS[comparison.natal.element]} {comparison.natal.element}
                  </Text>
                  <Text style={styles.attributeChip}>
                    {MODALITY_ICONS[comparison.natal.modality]} {comparison.natal.modality}
                  </Text>
                </View>
              </View>

              {/* Coluna Atual */}
              <View style={styles.comparisonColumn}>
                <Text style={styles.columnTitle}>🌍 Atual</Text>
                <Text style={styles.positionText}>
                  {formatDegree(comparison.current.longitude)} {comparison.current.sign}
                  {comparison.current.isRetrograde && ' ℞'}
                </Text>
                <Text style={styles.houseText}>Casa {comparison.current.house}</Text>
                <Text style={styles.speedText}>{formatSpeed(comparison.current.speed)}</Text>
                <View style={styles.attributesRow}>
                  <Text style={styles.attributeChip}>
                    {ELEMENT_ICONS[comparison.current.element]} {comparison.current.element}
                  </Text>
                  <Text style={styles.attributeChip}>
                    {MODALITY_ICONS[comparison.current.modality]} {comparison.current.modality}
                  </Text>
                </View>
              </View>
            </View>

            {/* Aspectos Planetários */}
            {comparison.planetaryAspects.length > 0 && (
              <View style={styles.aspectsSection}>
                <Text style={styles.aspectsTitle}>⭐ Aspectos Planetários:</Text>
                {comparison.planetaryAspects.slice(0, 3).map((aspect, aspectIndex) => (
                  <View key={aspectIndex} style={styles.aspectItem}>
                    <Text style={[styles.aspectIcon, { color: getAspectColor(aspect.type) }]}>
                      {getAspectIcon(aspect.type)}
                    </Text>
                    <Text style={styles.aspectText}>
                      {aspect.planet1 === comparison.name ? aspect.planet2 : aspect.planet1} 
                      ({aspect.orb.toFixed(1)}° orbe)
                    </Text>
                    <View style={[styles.aspectStrength, { backgroundColor: getAspectColor(aspect.type) }]}>
                      <Text style={styles.aspectStrengthText}>{aspect.strength.toFixed(0)}%</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Aspectos com Casas */}
            {comparison.houseAspects.length > 0 && (
              <View style={styles.aspectsSection}>
                <Text style={styles.aspectsTitle}>🏠 Aspectos com Casas:</Text>
                {comparison.houseAspects.slice(0, 2).map((houseAspect, houseIndex) => (
                  <View key={houseIndex} style={styles.aspectItem}>
                    <Text style={[styles.aspectIcon, { color: getAspectColor(houseAspect.aspect) }]}>
                      {getAspectIcon(houseAspect.aspect)}
                    </Text>
                    <Text style={styles.aspectText}>
                      Casa {houseAspect.house} - {houseAspect.meaning} 
                      ({houseAspect.orb.toFixed(1)}° orbe)
                    </Text>
                    <View style={[styles.aspectStrength, { backgroundColor: getAspectColor(houseAspect.aspect) }]}>
                      <Text style={styles.aspectStrengthText}>{houseAspect.strength.toFixed(0)}%</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  summarySection: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  analysisRow: {
    marginBottom: 12,
  },
  analysisLabel: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  elementalGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  elementalComparison: {
    flex: 1,
    marginHorizontal: 4,
  },
  comparisonLabel: {
    color: '#A0A0A0',
    fontSize: 12,
    marginBottom: 4,
  },
  elementalRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  elementalItem: {
    color: '#FFFFFF',
    fontSize: 14,
    marginRight: 8,
    marginBottom: 2,
  },
  changesSection: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  changesTitle: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  changeItem: {
    color: '#FFFFFF',
    fontSize: 12,
    marginBottom: 2,
  },
  planetsSection: {
    flex: 1,
  },
  planetCard: {
    backgroundColor: 'rgba(42, 42, 62, 0.6)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FFD700',
  },
  planetHeader: {
    marginBottom: 12,
  },
  planetName: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: 'bold',
  },
  comparisonGrid: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  comparisonColumn: {
    flex: 1,
    paddingHorizontal: 8,
  },
  columnTitle: {
    color: '#A0A0A0',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  positionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  houseText: {
    color: '#A0A0A0',
    fontSize: 14,
    marginBottom: 4,
  },
  speedText: {
    color: '#10B981',
    fontSize: 12,
    marginBottom: 8,
  },
  attributesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  attributeChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#FFFFFF',
    fontSize: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 4,
    marginBottom: 2,
  },
  aspectsSection: {
    marginTop: 12,
  },
  aspectsTitle: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  aspectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  aspectIcon: {
    fontSize: 16,
    marginRight: 8,
    width: 20,
    textAlign: 'center',
  },
  aspectText: {
    color: '#FFFFFF',
    fontSize: 12,
    flex: 1,
  },
  aspectStrength: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    minWidth: 40,
  },
  aspectStrengthText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
})