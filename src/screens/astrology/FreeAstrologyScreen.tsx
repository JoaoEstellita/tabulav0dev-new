/**
 * 🆓 FREE ASTROLOGY SCREEN 🆓
 * 
 * Tela com cálculos astrológicos GRATUITOS para todos os usuários
 * Usa sistema ephemeris local - sem custos, performance instantânea
 * 
 * FUNCIONALIDADES GRATUITAS:
 * - Status das áreas da vida (ephemeris)
 * - Trânsitos básicos
 * - Notificações push diárias
 * - Análise geral
 */

import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Dimensions } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { PieChart } from 'react-native-chart-kit'
import { useLifeAreas } from '../../hooks/useLifeAreas'

const { width } = Dimensions.get('window')

export default function FreeAstrologyScreen() {
  const { transitData, cacheStatus, loading, error, refreshData, isUsingLocalEngine } = useLifeAreas()
  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = async () => {
    setRefreshing(true)
    await refreshData(true)
    setRefreshing(false)
  }

  const getLifeAreaIcon = (areaName: string): string => {
    const icons: { [key: string]: string } = {
      amor: "💕",
      carreira: "💼", 
      financas: "💰",
      saude: "🏥",
      familia: "👨‍👩‍👧‍👦",
      espiritualidade: "🧘‍♀️",
      comunicacao: "💬",
      transformacao: "🦋"
    }
    return icons[areaName] || "🌟"
  }

  const getLifeAreaName = (areaName: string): string => {
    const names: { [key: string]: string } = {
      amor: "Amor",
      carreira: "Carreira", 
      financas: "Finanças",
      saude: "Saúde",
      familia: "Família",
      espiritualidade: "Espiritualidade",
      comunicacao: "Comunicação",
      transformacao: "Transformação"
    }
    return names[areaName] || areaName
  }

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'excelente': return '#00AA00'
      case 'bom': return '#44AA44'
      case 'neutro': return '#888888'
      case 'desafiador': return '#FF8800'
      case 'crítico': return '#FF4444'
      default: return '#888888'
    }
  }

  const getChartData = () => {
    if (!transitData?.lifeAreas) return []
    
    return Object.entries(transitData.lifeAreas).map(([area, data], index) => ({
      name: getLifeAreaName(area),
      percentage: data.percentage,
      color: getStatusColor(data.status),
      legendFontColor: '#FFFFFF',
      legendFontSize: 12,
    }))
  }

  if (loading) {
    return (
      <LinearGradient colors={['#0F0F23', '#1A1A3A']} style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>🔮 Calculando seus dados astrológicos...</Text>
          <Text style={styles.loadingSubText}>Sistema ephemeris local - 100% gratuito</Text>
        </View>
      </LinearGradient>
    )
  }

  if (error) {
    return (
      <LinearGradient colors={['#0F0F23', '#1A1A3A']} style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>❌ {error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => refreshData(true)}>
            <Text style={styles.retryButtonText}>Tentar Novamente</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    )
  }

  return (
    <LinearGradient colors={['#0F0F23', '#1A1A3A']} style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FFFFFF" />
        }
      >
        {/* Header Gratuito */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>🆓 Astrologia Gratuita</Text>
          <Text style={styles.headerSubtitle}>Cálculos reais • Sistema ephemeris</Text>
        </View>

        {/* Indicador de Sistema Gratuito */}
        {isUsingLocalEngine && (
          <View style={styles.freeIndicator}>
            <View style={styles.freeInfo}>
              <Ionicons name="gift" size={16} color="#00FF00" />
              <Text style={styles.freeText}>100% GRATUITO • Dados Reais</Text>
              <Ionicons name="infinite" size={16} color="#FFD700" />
            </View>
          </View>
        )}

        {/* Visão Geral do Dia */}
        {transitData?.dailyOverview && (
          <View style={styles.overviewCard}>
            <Text style={styles.cardTitle}>📅 Visão Geral de Hoje</Text>
            <Text style={styles.overviewText}>{transitData.dailyOverview.generalTrend}</Text>
            
            <View style={styles.bestWorstContainer}>
              <View style={styles.bestArea}>
                <Text style={styles.areaLabel}>✨ Área Favorável</Text>
                <Text style={styles.areaValue}>{getLifeAreaName(transitData.dailyOverview.bestArea)}</Text>
              </View>
              <View style={styles.challengingArea}>
                <Text style={styles.areaLabel}>⚠️ Atenção Para</Text>
                <Text style={styles.areaValue}>{getLifeAreaName(transitData.dailyOverview.challengingArea)}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Gráfico das Áreas da Vida */}
        {transitData?.lifeAreas && (
          <View style={styles.chartCard}>
            <Text style={styles.cardTitle}>📊 Status das Áreas da Vida</Text>
            <PieChart
              data={getChartData()}
              width={width - 32}
              height={220}
              chartConfig={{
                backgroundColor: '#1A1A3A',
                backgroundGradientFrom: '#1A1A3A',
                backgroundGradientTo: '#0F0F23',
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              }}
              accessor="percentage"
              backgroundColor="transparent"
              paddingLeft="15"
              center={[10, 50]}
              absolute
            />
          </View>
        )}

        {/* Lista Detalhada das Áreas */}
        {transitData?.lifeAreas && (
          <View style={styles.areasCard}>
            <Text style={styles.cardTitle}>📝 Análise Detalhada</Text>
            {Object.entries(transitData.lifeAreas).map(([area, data]) => (
              <View key={area} style={styles.areaItem}>
                <View style={styles.areaHeader}>
                  <Text style={styles.areaIcon}>{getLifeAreaIcon(area)}</Text>
                  <Text style={styles.areaName}>{getLifeAreaName(area)}</Text>
                  <Text style={[styles.areaPercentage, { color: getStatusColor(data.status) }]}>
                    {data.percentage}%
                  </Text>
                </View>
                <Text style={styles.areaStatus}>Status: {data.status}</Text>
                {data.influences.length > 0 && (
                  <Text style={styles.areaInfluences}>
                    Influências: {data.influences.join(', ')}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Call to Action Premium */}
        <View style={styles.premiumCTA}>
          <Text style={styles.ctaTitle}>🌟 Quer Análises Mais Profundas?</Text>
          <Text style={styles.ctaDescription}>
            Acesse recursos Premium para análises ultra-precisas, matching de casais e muito mais!
          </Text>
          <TouchableOpacity style={styles.ctaButton}>
            <Text style={styles.ctaButtonText}>Conhecer Premium</Text>
          </TouchableOpacity>
        </View>

        {/* Cache Info */}
        {cacheStatus && (
          <View style={styles.cacheInfo}>
            <Text style={styles.cacheText}>
              Última atualização: {cacheStatus.hoursOld < 1 ? 'agora' : `${Math.round(cacheStatus.hoursOld)}h atrás`}
            </Text>
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#AAAAAA',
  },
  freeIndicator: {
    backgroundColor: '#1A2B1A',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#00FF00',
  },
  freeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  freeText: {
    color: '#00FF00',
    fontSize: 12,
    fontWeight: 'bold',
    marginHorizontal: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  loadingSubText: {
    fontSize: 14,
    color: '#AAAAAA',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#FF4444',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  overviewCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  overviewText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 16,
    lineHeight: 22,
  },
  bestWorstContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bestArea: {
    flex: 1,
    marginRight: 8,
    padding: 12,
    backgroundColor: '#1A3A1A',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#44AA44',
  },
  challengingArea: {
    flex: 1,
    marginLeft: 8,
    padding: 12,
    backgroundColor: '#3A1A1A',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF8800',
  },
  areaLabel: {
    fontSize: 12,
    color: '#AAAAAA',
    marginBottom: 4,
  },
  areaValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  chartCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  areasCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  areaItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  areaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  areaIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  areaName: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  areaPercentage: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  areaStatus: {
    fontSize: 14,
    color: '#AAAAAA',
    marginBottom: 4,
  },
  areaInfluences: {
    fontSize: 12,
    color: '#CCCCCC',
    fontStyle: 'italic',
  },
  premiumCTA: {
    backgroundColor: '#2D1B69',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  ctaDescription: {
    fontSize: 14,
    color: '#CCCCCC',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  ctaButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  ctaButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cacheInfo: {
    padding: 16,
    alignItems: 'center',
  },
  cacheText: {
    fontSize: 12,
    color: '#888888',
  },
})