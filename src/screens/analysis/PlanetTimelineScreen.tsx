import React, { useMemo } from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { useLifeAreas } from '../../hooks/useLifeAreas'
import { translatePlanetPT } from '../../utils/astro/pt'

const AREA_LABELS: Record<string, string> = {
  amor: 'Amor',
  carreira: 'Carreira',
  financas: 'Financas',
  saude: 'Saude',
  familia: 'Familia',
  espiritualidade: 'Espiritualidade',
  comunicacao: 'Comunicacao',
  transformacao: 'Transformacao',
}

const formatDegree = (longitude: number) => `${longitude.toFixed(1)}\u00B0`

const getSignFromDegree = (degree: number): string => {
  const signs = [
    'Aries', 'Touro', 'Gemeos', 'Cancer', 'Leao', 'Virgem',
    'Libra', 'Escorpiao', 'Sagitario', 'Capricornio', 'Aquario', 'Peixes'
  ]
  const signIndex = Math.floor(degree / 30) % 12
  return signs[signIndex]
}

export default function PlanetTimelineScreen() {
  const { transitData } = useLifeAreas()
  const planets = transitData?.currentTransits?.planets || []
  const byArea = transitData?.currentTransits?.transits?.byArea || {}

  const areasByPlanet = useMemo(() => {
    const map: Record<string, string[]> = {}
    Object.entries(byArea).forEach(([areaKey, items]) => {
      items.forEach((item: any) => {
        if (!map[item.transitPlanet]) map[item.transitPlanet] = []
        if (!map[item.transitPlanet].includes(areaKey)) {
          map[item.transitPlanet].push(areaKey)
        }
      })
    })
    return map
  }, [byArea])

  return (
    <LinearGradient colors={['#0F0F23', '#1A1A3A']} style={styles.container}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Linha do Tempo Planetaria</Text>
          <Text style={styles.subtitle}>
            Leitura temporal qualitativa dos fluxos por planeta, sem previsoes fechadas.
          </Text>
          <Text style={styles.helper}>
            Use esta visao para acompanhar tendencias: passageiras, em desenvolvimento ou estruturais.
          </Text>
        </View>

        {!planets.length ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              Sem dados planetarios suficientes agora. Atualize seus dados astrologicos.
            </Text>
          </View>
        ) : (
          planets.map((planet) => {
            const areaKeys = areasByPlanet[planet.name] || []
            return (
              <View key={planet.name} style={styles.planetCard}>
                <View style={styles.planetHeader}>
                  <Ionicons name="planet" size={18} color="#FDE68A" />
                  <Text style={styles.planetName}>{translatePlanetPT(planet.name)}</Text>
                </View>
                <Text style={styles.planetMeta}>
                  {formatDegree(planet.longitude)} {getSignFromDegree(planet.longitude)} · Casa {planet.house}
                  {planet.isRetrograde ? ' · Retrogrado' : ''}
                </Text>
                <Text style={styles.planetFlowTitle}>Tendencia temporal</Text>
                <Text style={styles.planetFlowText}>
                  Identifique se este fluxo parece passageiro, em desenvolvimento ou estrutural.
                </Text>
                {areaKeys.length > 0 && (
                  <View style={styles.areaList}>
                    <Text style={styles.areaTitle}>Areas mais impactadas</Text>
                    {areaKeys.map((areaKey) => (
                      <Text key={`${planet.name}-${areaKey}`} style={styles.areaItem}>
                        • {AREA_LABELS[areaKey] || areaKey}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
            )
          })
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  title: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '700',
  },
  subtitle: {
    color: '#C7D2FE',
    fontSize: 13,
    marginTop: 6,
  },
  helper: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 8,
  },
  emptyState: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  emptyText: {
    color: '#CBD5F5',
    fontSize: 12,
  },
  planetCard: {
    marginTop: 16,
    marginHorizontal: 16,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    borderRadius: 12,
    padding: 14,
  },
  planetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  planetName: {
    color: '#FDE68A',
    fontSize: 14,
    fontWeight: '700',
  },
  planetMeta: {
    color: '#E2E8F0',
    fontSize: 12,
    marginTop: 6,
  },
  planetFlowTitle: {
    marginTop: 10,
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '600',
  },
  planetFlowText: {
    color: '#CBD5F5',
    fontSize: 11,
    marginTop: 4,
  },
  areaList: {
    marginTop: 10,
  },
  areaTitle: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 4,
  },
  areaItem: {
    color: '#CBD5F5',
    fontSize: 11,
    marginBottom: 2,
  },
  bottomSpacing: {
    height: 40,
  },
})
