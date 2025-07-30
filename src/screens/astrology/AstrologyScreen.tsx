"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { LineChart, PieChart } from "react-native-chart-kit"
import { useAuth } from "../../hooks/useAuth"
import ProkeralaService, { type AstrologicalStatus, type BirthData } from "../../services/prokerala/ProkeralaService"

const { width } = Dimensions.get("window")

interface TransitData {
  planet: string
  sign: string
  house: number
  aspect: string
  intensity: number
  description: string
  startDate: Date
  endDate: Date
}

interface ChartData {
  planets: Array<{
    name: string
    sign: string
    degree: number
    house: number
  }>
  houses: Array<{
    number: number
    sign: string
    degree: number
  }>
  aspects: Array<{
    planet1: string
    planet2: string
    aspect: string
    orb: number
  }>
}

export default function AstrologyScreen() {
  const { user } = useAuth()
  const [currentStatus, setCurrentStatus] = useState<AstrologicalStatus | null>(null)
  const [transits, setTransits] = useState<TransitData[]>([])
  const [birthChart, setBirthChart] = useState<ChartData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState<"status" | "transits" | "chart">("status")

  // Dados de nascimento simulados (em produção, vir do perfil do usuário)
  const birthData: BirthData = {
    datetime: "1990-03-21T10:30:00",
    coordinates: {
      latitude: -23.5505,
      longitude: -46.6333,
    },
  }

  useEffect(() => {
    loadAstrologicalData()
  }, [])

  const loadAstrologicalData = async () => {
    try {
      setLoading(true)

      const [status, transitsData, chartData] = await Promise.all([
        ProkeralaService.getAstrologicalStatus(birthData),
        ProkeralaService.getTransits(birthData),
        ProkeralaService.getBirthChart(birthData),
      ])

      setCurrentStatus(status)
      setTransits(generateTransitData(transitsData))
      setBirthChart(chartData)
    } catch (error) {
      console.error("Erro ao carregar dados astrológicos:", error)
    } finally {
      setLoading(false)
    }
  }

  const generateTransitData = (data: any): TransitData[] => {
    // Simular dados de trânsitos baseados na resposta da API
    return [
      {
        planet: "Marte",
        sign: "Áries",
        house: 1,
        aspect: "Conjunção",
        intensity: 8,
        description: "Energia aumentada, impulsos fortes, necessidade de ação",
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      {
        planet: "Vênus",
        sign: "Touro",
        house: 2,
        aspect: "Trígono",
        intensity: 6,
        description: "Harmonia nas relações, estabilidade financeira",
        startDate: new Date(),
        endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      },
      {
        planet: "Saturno",
        sign: "Aquário",
        house: 11,
        aspect: "Quadratura",
        intensity: 9,
        description: "Desafios em grupos, necessidade de disciplina",
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    ]
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical":
        return "#FF4444"
      case "challenging":
        return "#FF8800"
      case "neutral":
        return "#888888"
      case "positive":
        return "#44AA44"
      case "excellent":
        return "#00AA00"
      default:
        return "#888888"
    }
  }

  const getIntensityColor = (intensity: number) => {
    if (intensity >= 8) return "#FF4444"
    if (intensity >= 6) return "#FF8800"
    if (intensity >= 4) return "#FFD700"
    return "#44AA44"
  }

  const energyChartData = {
    labels: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
    datasets: [
      {
        data: [65, 78, 45, 89, 67, 82, 71],
        color: (opacity = 1) => `rgba(255, 215, 0, ${opacity})`,
        strokeWidth: 3,
      },
    ],
  }

  const planetDistributionData = [
    { name: "Fogo", population: 35, color: "#FF4444", legendFontColor: "#FFFFFF" },
    { name: "Terra", population: 25, color: "#8B4513", legendFontColor: "#FFFFFF" },
    { name: "Ar", population: 20, color: "#87CEEB", legendFontColor: "#FFFFFF" },
    { name: "Água", population: 20, color: "#4169E1", legendFontColor: "#FFFFFF" },
  ]

  const renderStatusTab = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      {currentStatus && (
        <>
          {/* Status Atual */}
          <View style={styles.statusCard}>
            <View style={styles.statusHeader}>
              <Ionicons name="pulse" size={32} color={getStatusColor(currentStatus.overall)} />
              <View style={styles.statusInfo}>
                <Text style={[styles.statusTitle, { color: getStatusColor(currentStatus.overall) }]}>
                  {currentStatus.overall.toUpperCase()}
                </Text>
                <Text style={styles.statusMood}>{currentStatus.mood}</Text>
              </View>
              <View style={styles.energyMeter}>
                <Text style={styles.energyLabel}>Energia</Text>
                <Text style={styles.energyValue}>{currentStatus.energy}%</Text>
              </View>
            </View>

            <View style={styles.energyBar}>
              <View
                style={[
                  styles.energyFill,
                  {
                    width: `${currentStatus.energy}%`,
                    backgroundColor: getStatusColor(currentStatus.overall),
                  },
                ]}
              />
            </View>
          </View>

          {/* Trânsitos Críticos */}
          {currentStatus.criticalTransits.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🚨 Trânsitos Críticos</Text>
              {currentStatus.criticalTransits.map((transit, index) => (
                <View key={index} style={styles.transitCard}>
                  <View style={styles.transitHeader}>
                    <Text style={styles.transitPlanet}>{transit.planet}</Text>
                    <Text style={styles.transitAspect}>{transit.aspect}</Text>
                    <View style={[styles.intensityBadge, { backgroundColor: getIntensityColor(transit.intensity) }]}>
                      <Text style={styles.intensityText}>{transit.intensity}</Text>
                    </View>
                  </View>
                  <Text style={styles.transitDescription}>{transit.description}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Desafios e Oportunidades */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>⚡ Desafios e Oportunidades</Text>

            {currentStatus.challenges.length > 0 && (
              <View style={styles.subsection}>
                <Text style={styles.subsectionTitle}>Desafios:</Text>
                {currentStatus.challenges.map((challenge, index) => (
                  <View key={index} style={styles.listItem}>
                    <Ionicons name="warning" size={16} color="#FF8800" />
                    <Text style={styles.listText}>{challenge}</Text>
                  </View>
                ))}
              </View>
            )}

            {currentStatus.opportunities.length > 0 && (
              <View style={styles.subsection}>
                <Text style={styles.subsectionTitle}>Oportunidades:</Text>
                {currentStatus.opportunities.map((opportunity, index) => (
                  <View key={index} style={styles.listItem}>
                    <Ionicons name="star" size={16} color="#FFD700" />
                    <Text style={styles.listText}>{opportunity}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Gráfico de Energia Semanal */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📊 Energia Semanal</Text>
            <LineChart
              data={energyChartData}
              width={width - 64}
              height={200}
              chartConfig={{
                backgroundColor: "#1C1C1E",
                backgroundGradientFrom: "#1C1C1E",
                backgroundGradientTo: "#2C2C2E",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(255, 215, 0, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: { borderRadius: 16 },
                propsForDots: {
                  r: "4",
                  strokeWidth: "2",
                  stroke: "#FFD700",
                },
              }}
              bezier
              style={styles.chart}
            />
          </View>
        </>
      )}
    </ScrollView>
  )

  const renderTransitsTab = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🌟 Trânsitos Atuais</Text>
        {transits.map((transit, index) => (
          <View key={index} style={styles.transitDetailCard}>
            <View style={styles.transitDetailHeader}>
              <View style={styles.planetInfo}>
                <Text style={styles.planetName}>{transit.planet}</Text>
                <Text style={styles.planetSign}>em {transit.sign}</Text>
              </View>
              <View style={styles.transitMeta}>
                <Text style={styles.houseNumber}>Casa {transit.house}</Text>
                <View style={[styles.intensityBadge, { backgroundColor: getIntensityColor(transit.intensity) }]}>
                  <Text style={styles.intensityText}>{transit.intensity}</Text>
                </View>
              </View>
            </View>

            <Text style={styles.aspectType}>{transit.aspect}</Text>
            <Text style={styles.transitDetailDescription}>{transit.description}</Text>

            <View style={styles.transitDuration}>
              <Ionicons name="time" size={16} color="#888" />
              <Text style={styles.durationText}>
                {transit.startDate.toLocaleDateString()} - {transit.endDate.toLocaleDateString()}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  )

  const renderChartTab = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      {/* Distribuição dos Elementos */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔥 Distribuição dos Elementos</Text>
        <PieChart
          data={planetDistributionData}
          width={width - 64}
          height={200}
          chartConfig={{
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          style={styles.chart}
        />
      </View>

      {/* Planetas nas Casas */}
      {birthChart && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏠 Planetas nas Casas</Text>
          {birthChart.planets.map((planet, index) => (
            <View key={index} style={styles.planetCard}>
              <View style={styles.planetHeader}>
                <Text style={styles.planetName}>{planet.name}</Text>
                <Text style={styles.planetDegree}>{planet.degree.toFixed(1)}°</Text>
              </View>
              <Text style={styles.planetPosition}>
                {planet.sign} - Casa {planet.house}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Aspectos Principais */}
      {birthChart && birthChart.aspects.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚡ Aspectos Principais</Text>
          {birthChart.aspects.slice(0, 5).map((aspect, index) => (
            <View key={index} style={styles.aspectCard}>
              <Text style={styles.aspectPlanets}>
                {aspect.planet1} {aspect.aspect} {aspect.planet2}
              </Text>
              <Text style={styles.aspectOrb}>Orbe: {aspect.orb.toFixed(1)}°</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  )

  return (
    <LinearGradient colors={["#0F0F23", "#1A1A3A"]} style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === "status" && styles.activeTab]}
          onPress={() => setSelectedTab("status")}
        >
          <Text style={[styles.tabText, selectedTab === "status" && styles.activeTabText]}>Status</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === "transits" && styles.activeTab]}
          onPress={() => setSelectedTab("transits")}
        >
          <Text style={[styles.tabText, selectedTab === "transits" && styles.activeTabText]}>Trânsitos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === "chart" && styles.activeTab]}
          onPress={() => setSelectedTab("chart")}
        >
          <Text style={[styles.tabText, selectedTab === "chart" && styles.activeTabText]}>Mapa</Text>
        </TouchableOpacity>
      </View>

      {/* Conteúdo */}
      <View style={styles.content}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Calculando dados astrológicos...</Text>
          </View>
        ) : (
          <>
            {selectedTab === "status" && renderStatusTab()}
            {selectedTab === "transits" && renderTransitsTab()}
            {selectedTab === "chart" && renderChartTab()}
          </>
        )}
      </View>

      {/* Botão de Refresh */}
      <TouchableOpacity style={styles.refreshButton} onPress={loadAstrologicalData}>
        <Ionicons name="refresh" size={24} color="#FFD700" />
      </TouchableOpacity>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#1C1C1E",
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: "#FFD700",
  },
  tabText: {
    color: "#888",
    fontSize: 16,
    fontWeight: "500",
  },
  activeTabText: {
    color: "#000",
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  statusCard: {
    backgroundColor: "#1C1C1E",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  statusHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  statusInfo: {
    flex: 1,
    marginLeft: 16,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statusMood: {
    color: "#888",
    fontSize: 16,
  },
  energyMeter: {
    alignItems: "center",
  },
  energyLabel: {
    color: "#888",
    fontSize: 12,
    marginBottom: 4,
  },
  energyValue: {
    color: "#FFD700",
    fontSize: 18,
    fontWeight: "bold",
  },
  energyBar: {
    height: 8,
    backgroundColor: "#2C2C2E",
    borderRadius: 4,
    overflow: "hidden",
  },
  energyFill: {
    height: "100%",
    borderRadius: 4,
  },
  section: {
    backgroundColor: "#1C1C1E",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  transitCard: {
    backgroundColor: "#2C2C2E",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  transitHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  transitPlanet: {
    color: "#FFD700",
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
  },
  transitAspect: {
    color: "#FFFFFF",
    fontSize: 14,
    marginRight: 12,
  },
  intensityBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  intensityText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  transitDescription: {
    color: "#FFFFFF",
    fontSize: 14,
    lineHeight: 20,
  },
  subsection: {
    marginBottom: 16,
  },
  subsectionTitle: {
    color: "#FFD700",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  listText: {
    color: "#FFFFFF",
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  chart: {
    borderRadius: 16,
  },
  transitDetailCard: {
    backgroundColor: "#2C2C2E",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  transitDetailHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  planetInfo: {
    flex: 1,
  },
  planetName: {
    color: "#FFD700",
    fontSize: 18,
    fontWeight: "bold",
  },
  planetSign: {
    color: "#FFFFFF",
    fontSize: 14,
  },
  transitMeta: {
    alignItems: "flex-end",
  },
  houseNumber: {
    color: "#888",
    fontSize: 12,
    marginBottom: 4,
  },
  aspectType: {
    color: "#FF8800",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  transitDetailDescription: {
    color: "#FFFFFF",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  transitDuration: {
    flexDirection: "row",
    alignItems: "center",
  },
  durationText: {
    color: "#888",
    fontSize: 12,
    marginLeft: 8,
  },
  planetCard: {
    backgroundColor: "#2C2C2E",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  planetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  planetDegree: {
    color: "#FFD700",
    fontSize: 14,
    fontWeight: "bold",
  },
  planetPosition: {
    color: "#888",
    fontSize: 12,
  },
  aspectCard: {
    backgroundColor: "#2C2C2E",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  aspectPlanets: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },
  aspectOrb: {
    color: "#888",
    fontSize: 12,
  },
  refreshButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#1C1C1E",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
})
