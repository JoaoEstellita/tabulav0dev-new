"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, RefreshControl, Alert } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { LineChart, PieChart } from "react-native-chart-kit"
import { useAuth } from "../../hooks/useAuth"
import { useLifeAreas } from "../../hooks/useLifeAreas"
import ProkeralaService, { type AstrologicalStatus } from "../../services/prokerala/ProkeralaService"
import NatalChartService, { type NatalChart } from "../../services/prokerala/NatalChartService"
import type { BirthData } from "../../screens/onboarding/BirthDataForm"
import { doc, getDoc } from "firebase/firestore"
import { db } from "../../config/firebase"

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

interface UserProfile {
  displayName: string
  birthDate: string
  birthTime: string
  birthLocation: {
    city: string
    country: string
    latitude: number
    longitude: number
  }
  zodiacSign: string
}

export default function AstrologyScreen() {
  const { user } = useAuth()
  const { transitData, cacheStatus, loading, error, refreshData } = useLifeAreas()
  const [currentStatus, setCurrentStatus] = useState<AstrologicalStatus | null>(null)
  const [birthChart, setBirthChart] = useState<ChartData | null>(null)
  const [natalChart, setNatalChart] = useState<NatalChart | null>(null)
  const [natalLoading, setNatalLoading] = useState(false)
  const [selectedTab, setSelectedTab] = useState<"status" | "transits" | "chart">("status")
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    if (user) {
      loadUserProfile()
    }
  }, [user])

  useEffect(() => {
    if (userProfile && userProfile.birthDate && userProfile.birthTime) {
      loadAdditionalData()
      // Carregar mapa natal apenas quando necessário (aba Mapa selecionada)
      if (selectedTab === "chart") {
        loadNatalChart()
      }
    }
  }, [userProfile, selectedTab])

  const loadUserProfile = async () => {
    if (!user?.uid) return

    try {
      const userDoc = await getDoc(doc(db, "users", user.uid))
      if (userDoc.exists()) {
        const profileData = userDoc.data() as UserProfile
        setUserProfile(profileData)
      }
    } catch (error) {
      console.error("Erro ao carregar perfil do usuário:", error)
    }
  }

  // Pull-to-refresh inteligente
  const handleRefresh = async () => {
    if (!cacheStatus) return

    // Verificar se pode fazer refresh
    if (!cacheStatus.canRefresh) {
      const message = cacheStatus.nextRefreshAvailable 
        ? `Próximo refresh disponível: ${cacheStatus.nextRefreshAvailable.toLocaleTimeString()}`
        : `Limite diário atingido (${cacheStatus.requestsToday}/${cacheStatus.maxRequests})`
      
      Alert.alert(
        "🕒 Aguarde um pouco",
        message,
        [{ text: "OK" }]
      )
      return
    }

    try {
      setRefreshing(true)
      console.log('🔄 Iniciando refresh manual...')
      
      await refreshData(false) // Não forçar, respeitar limites
      
      console.log('✅ Refresh concluído!')
    } catch (error) {
      console.error('❌ Erro no refresh:', error)
      Alert.alert("Erro", "Não foi possível atualizar os dados")
    } finally {
      setRefreshing(false)
    }
  }

  const getBirthData = (): BirthData | null => {
    if (!userProfile || !userProfile.birthDate || !userProfile.birthTime) {
      return null
    }
    
    return {
      fullName: userProfile.displayName || "Usuário",
      birthDate: userProfile.birthDate,
      birthTime: userProfile.birthTime,
      birthLocation: {
        latitude: userProfile.birthLocation?.latitude || -23.5505, // São Paulo como fallback
        longitude: userProfile.birthLocation?.longitude || -46.6333,
        city: userProfile.birthLocation?.city || "São Paulo",
        country: userProfile.birthLocation?.country || "Brasil"
      },
    }
  }

  const loadAdditionalData = async () => {
    const birthData = getBirthData()
    
    if (!birthData) {
      console.log("Dados de nascimento não disponíveis")
      return
    }

    try {
      // REMOVIDO: Chamadas que falhavam
      // const [status, chartData] = await Promise.all([
      //   ProkeralaService.getAstrologicalStatus(birthData),
      //   ProkeralaService.getBirthChart(birthData),
      // ])
      
      console.log('📊 loadAdditionalData executado (endpoints desabilitados)')
      // Status vem dos trânsitos via useLifeAreas
      // Mapa natal será carregado separadamente e permanente
    } catch (error) {
      console.error("Erro ao carregar dados astrológicos:", error)
    }
  }
  
  // Função para carregar mapa natal permanente
  const loadNatalChart = async () => {
    const birthData = getBirthData()
    
    if (!birthData) {
      console.log("Dados de nascimento não disponíveis para mapa natal")
      return
    }
    
    try {
      setNatalLoading(true)
      console.log('🌟 Carregando mapa natal permanente...')
      
      const natal = await NatalChartService.getNatalChart(birthData)
      setNatalChart(natal)
      
      console.log('✅ Mapa natal carregado com sucesso')
    } catch (error) {
      console.error('❌ Erro ao carregar mapa natal:', error)
    } finally {
      setNatalLoading(false)
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

  const getLifeAreaIcon = (areaName: string): string => {
    const icons: Record<string, string> = {
      love: "❤️",
      career: "💼", 
      health: "🏥",
      family: "👨‍👩‍👧‍👦",
      spirituality: "🙏"
    }
    return icons[areaName] || "🌟"
  }

  const getLifeAreaDisplayName = (areaName: string): string => {
    const names: Record<string, string> = {
      love: "Amor & Relacionamentos",
      career: "Carreira & Trabalho",
      health: "Saúde & Bem-estar", 
      family: "Família & Lar",
      spirituality: "Espiritualidade"
    }
    return names[areaName] || areaName
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
    <ScrollView 
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor="#FFD700"
          title={cacheStatus?.canRefresh ? "Puxe para atualizar" : "Aguarde para atualizar"}
        />
      }
    >
      {transitData && (
        <>
          {/* Visão Geral Diária */}
          <View style={styles.statusCard}>
            <View style={styles.statusHeader}>
              <Ionicons name="pulse" size={32} color={getStatusColor(transitData.dailyOverview.overall)} />
              <View style={styles.statusInfo}>
                <Text style={[styles.statusTitle, { color: getStatusColor(transitData.dailyOverview.overall) }]}>
                  ENERGIA: {transitData.dailyOverview.overall}%
                </Text>
                <Text style={styles.statusMood}>{transitData.dailyOverview.message}</Text>
              </View>
              <View style={styles.energyMeter}>
                <Text style={styles.energyLabel}>Geral</Text>
                <Text style={styles.energyValue}>{transitData.dailyOverview.overall}%</Text>
              </View>
            </View>

            <View style={styles.energyBar}>
              <View
                style={[
                  styles.energyFill,
                  {
                    width: `${transitData.dailyOverview.overall}%`,
                    backgroundColor: getStatusColor(transitData.dailyOverview.overall),
                  },
                ]}
              />
            </View>
          </View>

          {/* Áreas da Vida */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🌟 Áreas da Vida</Text>
            <View style={styles.bestWorstAreas}>
              <Text style={styles.bestAreaText}>
                ✨ Melhor: {transitData.dailyOverview.bestArea}
              </Text>
              <Text style={styles.worstAreaText}>
                ⚠️ Atenção: {transitData.dailyOverview.challengingArea}
              </Text>
            </View>
            
            {transitData.lifeAreas.map((area: any, index: number) => (
              <View key={index} style={styles.lifeAreaCard}>
                <View style={styles.lifeAreaHeader}>
                  <Text style={styles.lifeAreaName}>
                    {getLifeAreaIcon(area.name)} {getLifeAreaDisplayName(area.name)}
                  </Text>
                  <View style={[
                    styles.lifeAreaBadge, 
                    { backgroundColor: area.criticalLevel ? "#FF4444" : getStatusColor(area.status) }
                  ]}>
                    <Text style={styles.lifeAreaStatus}>{area.status}%</Text>
                  </View>
                </View>
                <Text style={styles.lifeAreaDescription}>{area.description}</Text>
                {area.criticalLevel && (
                  <View style={styles.criticalAlert}>
                    <Ionicons name="warning" size={16} color="#FF4444" />
                    <Text style={styles.criticalText}>Área crítica - atenção especial</Text>
                  </View>
                )}
              </View>
            ))}
          </View>

          {/* Avisos e Alertas */}
          {transitData.warnings && transitData.warnings.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>⚠️ Avisos Importantes</Text>
              {transitData.warnings.map((warning: any, index: number) => (
                <View key={index} style={styles.warningCard}>
                  <Ionicons name="alert-circle" size={20} color="#FF8800" />
                  <Text style={styles.warningText}>{warning}</Text>
                </View>
              ))}
            </View>
          )}

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
        {transitData?.currentTransits.map((transit: any, index: number) => (
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
      {natalLoading ? (
        <View style={styles.loadingSection}>
          <Text style={styles.loadingText}>Carregando mapa natal permanente...</Text>
        </View>
      ) : natalChart ? (
        <>
          {/* Informações Principais */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🌟 Mapa Natal Permanente</Text>
            <View style={styles.natalInfo}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Ascendente:</Text>
                <Text style={styles.infoValue}>{natalChart.ascendant.sign}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Meio do Céu:</Text>
                <Text style={styles.infoValue}>{natalChart.midheaven.sign}</Text>
              </View>
            </View>
          </View>

          {/* Planetas no Mapa Natal */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🌌 Posições Planetárias</Text>
            {natalChart.planets.map((planet, index) => (
              <View key={index} style={styles.planetCard}>
                <View style={styles.planetHeader}>
                  <Text style={styles.planetName}>{planet.name}</Text>
                  <View style={styles.planetFlags}>
                    {planet.dignity > 0 && (
                      <Text style={styles.dignityPositive}>+{planet.dignity}</Text>
                    )}
                    {planet.dignity < 0 && (
                      <Text style={styles.dignityNegative}>{planet.dignity}</Text>
                    )}
                    {planet.retrograde && (
                      <Text style={styles.retrograde}>R</Text>
                    )}
                  </View>
                </View>
                <Text style={styles.planetPosition}>
                  {planet.sign} - Casa {planet.house}
                </Text>
              </View>
            ))}
          </View>

          {/* Aspectos Natais */}
          {natalChart.aspects.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>⚡ Aspectos Natais</Text>
              {natalChart.aspects.slice(0, 8).map((aspect, index) => (
                <View key={index} style={styles.aspectCard}>
                  <View style={styles.aspectHeader}>
                    <Text style={styles.aspectPlanets}>
                      {aspect.planet1} {aspect.aspect} {aspect.planet2}
                    </Text>
                    <Text style={styles.aspectStrength}>Força: {aspect.strength}</Text>
                  </View>
                  <Text style={styles.aspectOrb}>Orbe: {aspect.orb.toFixed(1)}°</Text>
                </View>
              ))}
            </View>
          )}
        </>
      ) : (
        <View style={styles.emptySection}>
          <Text style={styles.emptyText}>Carregue o mapa natal permanente</Text>
          <TouchableOpacity 
            style={styles.reloadButton}
            onPress={loadNatalChart}
          >
            <Text style={styles.reloadButtonText}>Carregar Mapa Natal</Text>
          </TouchableOpacity>
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

      {/* Indicador de Cache - Apenas na aba Astrologia */}
      {cacheStatus && (
        <View style={styles.cacheIndicator}>
          <View style={styles.cacheInfo}>
            <Ionicons 
              name={cacheStatus.isValid ? "checkmark-circle" : "time-outline"} 
              size={16} 
              color={cacheStatus.isValid ? "#44AA44" : "#FF8800"} 
            />
            <Text style={styles.cacheText}>
              {cacheStatus.isValid 
                ? `Cache: ${cacheStatus.hoursOld}h atrás` 
                : `Expirado: ${cacheStatus.hoursOld}h atrás`
              }
            </Text>
          </View>
          <View style={styles.cacheInfo}>
            <Ionicons name="cloud-download-outline" size={16} color="#8E8E93" />
            <Text style={styles.cacheText}>
              {cacheStatus.requestsToday}/{cacheStatus.maxRequests} hoje
            </Text>
          </View>
          {error && (
            <View style={styles.cacheInfo}>
              <Ionicons name="warning-outline" size={16} color="#FF4444" />
              <Text style={[styles.cacheText, styles.errorText]}>{error}</Text>
            </View>
          )}
        </View>
      )}

      {/* Conteúdo */}
      <View style={styles.content}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Calculando dados astrológicos...</Text>
          </View>
        ) : !userProfile || !userProfile.birthDate || !userProfile.birthTime ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="person-outline" size={64} color="#8E8E93" />
            <Text style={styles.emptyTitle}>Dados de Nascimento Necessários</Text>
            <Text style={styles.emptyText}>
              Para ver seus dados astrológicos, complete seu perfil com:
            </Text>
            <Text style={styles.emptyList}>• Data de nascimento</Text>
            <Text style={styles.emptyList}>• Hora de nascimento</Text>
            <Text style={styles.emptyList}>• Local de nascimento</Text>
            <TouchableOpacity style={styles.profileButton}>
              <Text style={styles.profileButtonText}>Ir para Perfil</Text>
            </TouchableOpacity>
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
              <TouchableOpacity style={styles.refreshButton} onPress={loadAdditionalData}>
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 12,
    textAlign: "center",
  },
  emptyText: {
    color: "#8E8E93",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
  },
  emptyList: {
    color: "#FFFFFF",
    fontSize: 14,
    marginBottom: 8,
  },
  profileButton: {
    backgroundColor: "#FFD700",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 24,
  },
  profileButtonText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "bold",
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
  // Novos estilos para cache e áreas da vida
  cacheIndicator: {
    backgroundColor: "#1C1C1E",
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
  },
  cacheInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
    marginBottom: 4,
  },
  cacheText: {
    color: "#FFFFFF",
    fontSize: 12,
    marginLeft: 4,
  },
  errorText: {
    color: "#FF4444",
  },
  bestWorstAreas: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  bestAreaText: {
    color: "#44AA44",
    fontSize: 14,
    fontWeight: "bold",
  },
  worstAreaText: {
    color: "#FF8800",
    fontSize: 14,
    fontWeight: "bold",
  },
  lifeAreaCard: {
    backgroundColor: "#2C2C2E",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  lifeAreaHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  lifeAreaName: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
  },
  lifeAreaBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  lifeAreaStatus: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  lifeAreaDescription: {
    color: "#CCCCCC",
    fontSize: 14,
    lineHeight: 20,
  },
  criticalAlert: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    padding: 8,
    backgroundColor: "#FF444420",
    borderRadius: 8,
  },
  criticalText: {
    color: "#FF4444",
    fontSize: 12,
    marginLeft: 4,
    fontWeight: "bold",
  },
  warningCard: {
    backgroundColor: "#2C2C2E",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  warningText: {
    color: "#FF8800",
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  
  // === ESTILOS PARA MAPA NATAL ===
  loadingSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 64,
  },
  natalInfo: {
    backgroundColor: "#2C2C2E",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  infoLabel: {
    color: "#888",
    fontSize: 14,
  },
  infoValue: {
    color: "#FFD700",
    fontSize: 14,
    fontWeight: "bold",
  },
  planetFlags: {
    flexDirection: "row",
    alignItems: "center",
  },
  dignityPositive: {
    color: "#44AA44",
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 4,
  },
  dignityNegative: {
    color: "#FF4444",
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 4,
  },
  retrograde: {
    color: "#FF8800",
    fontSize: 12,
    fontWeight: "bold",
    backgroundColor: "#2C2C2E",
    paddingHorizontal: 4,
    borderRadius: 4,
  },
  aspectHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  aspectStrength: {
    color: "#FFD700",
    fontSize: 12,
    fontWeight: "bold",
  },
  emptySection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 64,
  },
  reloadButton: {
    backgroundColor: "#FFD700",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  reloadButtonText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "bold",
  },
})
