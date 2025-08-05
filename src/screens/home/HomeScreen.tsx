import React, { useEffect, useState } from 'react'
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  RefreshControl,
  Alert,
  ActivityIndicator,
  Image 
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { useAuth } from '../../hooks/useAuth'
import { useLifeAreas } from '../../hooks/useLifeAreas'
import LifeAreaCard from '../../components/LifeAreaCard'
// TransitCard removido - usando componente inline personalizado
import PushNotificationService from '../../services/notifications/PushNotificationService'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../config/firebase'
import { safeMap, safeEntries } from '../../utils/safeArray'
import { SafeMapWrapper, useSafeArray } from '../../utils/SafeMapWrapper'

export default function HomeScreen() {
  const { user } = useAuth()
  const { transitData, loading, error, refreshData, sendCriticalAlerts } = useLifeAreas()
  const [refreshing, setRefreshing] = useState(false)
  
  // Debug: Log da estrutura completa
  React.useEffect(() => {
    if (transitData) {
      console.log('🔍 HOME DEBUG - transitData estrutura completa:', {
        hasCurrentTransits: !!transitData.currentTransits,
        currentTransitsType: typeof transitData.currentTransits,
        currentTransitsKeys: transitData.currentTransits ? Object.keys(transitData.currentTransits) : 'null',
        hasPlanets: !!transitData.currentTransits?.planets,
        planetsType: typeof transitData.currentTransits?.planets,
        planetsLength: transitData.currentTransits?.planets?.length || 'undefined',
        planetsIsArray: Array.isArray(transitData.currentTransits?.planets),
        firstPlanet: transitData.currentTransits?.planets?.[0] || 'undefined'
      })
    }
  }, [transitData])

  // Usar arrays seguros
  const safePlanets = useSafeArray(transitData?.currentTransits?.planets, 'currentTransits.planets')
  const safeWarnings = useSafeArray(transitData?.warnings, 'warnings')
  const [userProfile, setUserProfile] = useState<{
    displayName: string
    profilePhoto?: string
  } | null>(null)

  useEffect(() => {
    if (user) {
      loadUserProfile()
      initializeNotifications()
    }
  }, [user])

  const initializeNotifications = async () => {
    if (!user) return
    
    try {
      console.log('📱 Inicializando notificações push...')
      const token = await PushNotificationService.initializeForUser(user.uid)
      
      if (token) {
        console.log('✅ Notificações push configuradas com sucesso')
        
        // Agendar notificação diária se houver dados de trânsito
        if (transitData) {
          await PushNotificationService.scheduleDailyNotification(user.uid, transitData)
        }
      }
    } catch (error) {
      console.error('❌ Erro ao inicializar notificações:', error)
    }
  }

  const loadUserProfile = async () => {
    if (!user) return
    
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid))
      if (userDoc.exists()) {
        const userData = userDoc.data()
        setUserProfile({
          displayName: userData.displayName || userData.fullName || 'Usuário',
          profilePhoto: userData.profilePhoto
        })
      }
    } catch (error) {
      console.error('Erro ao carregar perfil do usuário:', error)
    }
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await refreshData()
    setRefreshing(false)
  }

  const handleSendAlerts = async () => {
    try {
      await sendCriticalAlerts()
      Alert.alert(
        'Alertas Enviados',
        'Seus alertas críticos foram enviados para todos os grupos!',
        [{ text: 'OK', style: 'default' }]
      )
    } catch (error) {
      Alert.alert(
        'Erro',
        'Não foi possível enviar os alertas. Tente novamente.',
        [{ text: 'OK', style: 'default' }]
      )
    }
  }

  const getUserDisplayName = () => {
    if (userProfile?.displayName) return userProfile.displayName
    if (user?.displayName) return user.displayName
    if (user?.email) return user.email.split('@')[0]
    return 'Usuário'
  }

  const formatDate = () => {
    return new Date().toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    })
  }

  const criticalAreas = transitData?.lifeAreas ? 
    safeEntries(transitData.lifeAreas)
      .filter(([_, area]) => area.percentage < 30)
      .map(([name, area]) => ({ name, ...area })) : []

  if (loading && !transitData) {
    return (
      <LinearGradient colors={['#0F0F23', '#1A1A3A']} style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFD700" />
          <Text style={styles.loadingText}>Carregando seus trânsitos...</Text>
        </View>
      </LinearGradient>
    )
  }

  if (error && !transitData) {
    return (
      <LinearGradient colors={['#0F0F23', '#1A1A3A']} style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
          <Text style={styles.errorTitle}>Ops! Algo deu errado</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refreshData}>
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
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#FFD700"
            colors={['#FFD700']}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.userSection}>
            <View style={styles.avatarContainer}>
              {userProfile?.profilePhoto ? (
                <Image 
                  source={{ uri: userProfile.profilePhoto }} 
                  style={styles.avatar}
                />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Ionicons name="person" size={24} color="#FFD700" />
                </View>
              )}
            </View>
            <View style={styles.headerContent}>
              <Text style={styles.greeting}>Olá, {getUserDisplayName()}!</Text>
              <Text style={styles.date}>{formatDate()}</Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color="#FFD700" />
            {criticalAreas.length > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>{criticalAreas.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Resumo Diário */}
        {transitData && (
          <View style={styles.section}>
            <LinearGradient
              colors={['#1E1E2E', '#2A2A3E']}
              style={styles.overviewCard}
            >
              <View style={styles.overviewHeader}>
                <Ionicons name="sunny" size={24} color="#FFD700" />
                <Text style={styles.overviewTitle}>Panorama Astrológico</Text>
              </View>
              
              <View style={styles.overviewContent}>
                <View style={styles.overallScore}>
                  <Text style={styles.scoreNumber}>{transitData?.dailyOverview?.overall || 0}%</Text>
                  <Text style={styles.scoreLabel}>Energia Geral</Text>
                </View>
                
                <View style={styles.overviewDetails}>
                  <Text style={styles.overviewMessage}>
                    {transitData?.dailyOverview?.message || 'Analisando dados astrológicos...'}
                  </Text>
                  
                  <View style={styles.areasSummary}>
                    <View style={styles.summaryItem}>
                      <Ionicons name="trending-up" size={16} color="#10B981" />
                      <Text style={styles.summaryText}>
                        Melhor: {transitData?.dailyOverview?.bestArea || 'N/A'}
                      </Text>
                    </View>
                    
                    <View style={styles.summaryItem}>
                      <Ionicons name="warning" size={16} color="#EF4444" />
                      <Text style={styles.summaryText}>
                        Atenção: {transitData?.dailyOverview?.challengingArea || 'N/A'}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </LinearGradient>
          </View>
        )}

        {/* Alertas Críticos */}
        {criticalAreas.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="warning" size={20} color="#EF4444" />
              <Text style={styles.sectionTitle}>Áreas Críticas</Text>
            </View>
            
            <LinearGradient
              colors={['#2D1B1B', '#3D2626']}
              style={styles.alertCard}
            >
              <Text style={styles.alertTitle}>
                {criticalAreas.length} {criticalAreas.length === 1 ? 'área precisa' : 'áreas precisam'} de atenção
              </Text>
              
              <Text style={styles.alertDescription}>
                Seus trânsitos indicam desafios em algumas áreas. Compartilhe com seu grupo para receber apoio!
              </Text>
              
              <TouchableOpacity style={styles.alertButton} onPress={handleSendAlerts}>
                <Ionicons name="send" size={16} color="#FFFFFF" />
                <Text style={styles.alertButtonText}>Enviar Alertas para Grupos</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        )}

        {/* Status das Áreas de Vida - TEMPORARIAMENTE REMOVIDO */}
        {transitData && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="grid" size={20} color="#FFD700" />
              <Text style={styles.sectionTitle}>Status das Áreas de Vida</Text>
            </View>
            
            <View style={styles.card}>
              <Text style={styles.cardText}>
                ✅ {Object.keys(transitData.lifeAreas || {}).length} áreas calculadas
              </Text>
              <Text style={styles.cardText}>
                🔍 Componente LifeAreaCard temporariamente removido para debug
              </Text>
            </View>
          </View>
        )}

        {/* Trânsitos Atuais - TEMPORARIAMENTE REMOVIDO */}
        {transitData && transitData.currentTransits && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="planet" size={20} color="#FFD700" />
              <Text style={styles.sectionTitle}>Trânsitos Atuais</Text>
            </View>
            
            <View style={styles.card}>
              <Text style={styles.cardText}>
                ✅ {safePlanets.length} planetas calculados
              </Text>
              <Text style={styles.cardText}>
                🔍 Lista de planetas temporariamente removida para debug
              </Text>
            </View>
          </View>
        )}

        {/* Avisos - TEMPORARIAMENTE REMOVIDO */}
        {transitData && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="information-circle" size={20} color="#FFD700" />
              <Text style={styles.sectionTitle}>Orientações</Text>
            </View>
            
            <View style={styles.card}>
              <Text style={styles.cardText}>
                ✅ {safeWarnings.length} orientações disponíveis
              </Text>
              <Text style={styles.cardText}>
                🔍 Lista de orientações temporariamente removida para debug
              </Text>
            </View>
          </View>
        )}

        {/* Espaçamento final */}
        <View style={styles.bottomSpacing} />
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    color: '#A0A0A0',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  retryButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2A2A3E',
    borderWidth: 2,
    borderColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: '#A0A0A0',
    textTransform: 'capitalize',
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  overviewCard: {
    margin: 16,
    borderRadius: 16,
    padding: 20,
  },
  overviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  overviewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  overviewContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  overallScore: {
    alignItems: 'center',
    marginRight: 20,
  },
  scoreNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  scoreLabel: {
    fontSize: 12,
    color: '#A0A0A0',
    marginTop: 4,
  },
  overviewDetails: {
    flex: 1,
  },
  overviewMessage: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 20,
    marginBottom: 12,
  },
  areasSummary: {
    gap: 8,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryText: {
    fontSize: 12,
    color: '#A0A0A0',
    marginLeft: 6,
  },
  alertCard: {
    margin: 16,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  alertDescription: {
    fontSize: 14,
    color: '#A0A0A0',
    lineHeight: 20,
    marginBottom: 16,
  },
  alertButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EF4444',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  alertButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  lifeAreasGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
  },
  lifeAreaItem: {
    width: '50%',
  },
  warningCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#2A2A3E',
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 12,
  },
  warningText: {
    color: '#FFFFFF',
    fontSize: 14,
    flex: 1,
    marginLeft: 12,
    lineHeight: 20,
  },
  planetCard: {
    backgroundColor: '#2A2A3E',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FFD700',
  },
  planetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  planetName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  planetSign: {
    color: '#FFD700',
    fontSize: 14,
    marginLeft: 'auto',
    fontWeight: '600',
  },
  planetPosition: {
    color: '#A0A0A0',
    fontSize: 12,
    marginLeft: 24,
  },
  bottomSpacing: {
    height: 32,
  },
  cardText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginBottom: 8,
  },
})