import React, { useEffect, useState, useRef } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Image
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Animated } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { useAuth } from '../../hooks/useAuth'
import { useLifeAreas } from '../../hooks/useLifeAreas'
import LifeAreaCard from '../../components/LifeAreaCard'
import { useUserSettings } from '../../hooks/useUserSettings'
import { LifeAreaDetailModal } from '../../components/LifeAreaDetailModal'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../config/firebase'
import { safeEntries } from '../../utils/safeArray'
import PWADownloadButton from '../../components/PWADownloadButton'
import { AnimatedMount } from '../../ui/anim/adapter'
import StarLoader from '../../components/StarLoader'
import useAutoScheduleNotifications from '../../hooks/useAutoScheduleNotifications'
import type { HouseSystem } from '../../astro/houseSystem'
import { normalizeHouseSystem, formatHouseSystemLabel } from '../../astro/houseSystem'
import { usePressScale } from '../../ui/motion/native/micro'
import TransitComparisonCard from '../../components/TransitComparisonCard'
import { decodeUnicodeEscapes } from '../../utils/astro/pt'
import { useNotificationStore } from '../../context/NotificationStore'
import { STATUS_THRESHOLDS } from '../../constants/statusThresholds'
// Web-only effects (no-op on native)
let mountStarfield: any = null
try { const mod = require('../../ui/motion/web/starfield'); mountStarfield = mod.mountStarfield } catch {}

export default function HomeScreen() {
  try {
    useAutoScheduleNotifications()
    const { user } = useAuth()
    const navigation = useNavigation()
    const { unreadCount } = useNotificationStore()
    const {
      transitData,
      loading,
      error,
      refreshData,
      sendCriticalAlerts,
      backendLifeAreas,
      localOverrideActive
    } = useLifeAreas()
    const { settings } = useUserSettings()
    const [houseSystem, setHouseSystem] = useState<HouseSystem>(normalizeHouseSystem(settings?.houseSystem || 'placidus'))

    // Garantir que o motor use o sistema salvo ao entrar na Home
    useEffect(() => {
      if (settings?.houseSystem) {
        const normalized = normalizeHouseSystem(settings.houseSystem)
        setHouseSystem(normalized)
        ;(globalThis as any).__userHouseSystem = normalized
      }
    }, [settings?.houseSystem])

    const [refreshing, setRefreshing] = useState(false)
    const [selectedArea, setSelectedArea] = useState<any>(null)
    const [modalVisible, setModalVisible] = useState(false)
    const scrollRef = useRef<ScrollView>(null)
    const uiText = React.useCallback((text: string) => decodeUnicodeEscapes(text), [])

    // ?? Fun\u00E7\u00E3o para abrir modal de detalhes
    const handleAreaPress = (areaName: string, areaData: any) => {
      setSelectedArea({
        name: areaName,
        ...areaData
      })
      setModalVisible(true)
    }

    const safeWarnings = React.useMemo(() => {
      if (!transitData?.warnings) return []
      if (!Array.isArray(transitData.warnings)) {
        console.warn('?? safeWarnings: warnings n\u00E3o \u00E9 array:', typeof transitData.warnings)
        return []
      }
      return transitData.warnings
    }, [transitData?.warnings])

    const getLifeAreaFactors = React.useCallback((areaName: string): string[] => {
      const debugArea = transitData?.currentTransits?.debug?.lifeAreas?.[areaName]
      const planetDetails = debugArea?.planetDetails || []
      if (!planetDetails.length) return []
      const avg = (values: number[]) =>
        Math.round(values.reduce((sum, val) => sum + val, 0) / Math.max(1, values.length))
      const avgSign = avg(planetDetails.map((p: any) => Number(p.signScore || 0)))
      const avgHouse = avg(planetDetails.map((p: any) => Number(p.houseScore || 0)))
      const tags = Array.from(
        new Set(
          planetDetails
            .flatMap((p: any) => (p.conditions?.tags || []))
            .map((tag: string) => String(tag || '').trim())
            .filter((tag: string) => tag.length > 0)
        )
      )
      const aspectsCount = planetDetails.reduce((sum: number, p: any) => {
        const count = Array.isArray(p.aspects) ? p.aspects.length : 0
        return sum + count
      }, 0)
      return [
        `Dignidade no signo: media ${avgSign} (forca essencial do planeta).`,
        `Casa astrologica: media ${avgHouse} (relevancia da casa).`,
        `Condicoes acidentais: ${tags.length ? tags.join(', ') : 'nenhuma destacada'}.`,
        `Aspectos considerados: ${aspectsCount} (harmonicos e desafiadores).`,
        'Peso planetario: luminares/sociais/transpessoais ajustam a influencia.'
      ]
    }, [transitData?.currentTransits?.debug?.lifeAreas])

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

    // Toast simples ao reprocessar casas natais
    useEffect(() => {
      const handler = () => {
        try {
          Alert.alert('Sucesso', 'Casas recalculadas com sucesso!')
          refreshData(true)
        } catch {}
      }
      if (typeof window !== 'undefined') {
        window.addEventListener('natal-houses-reprocessed', handler as any)
        return () => window.removeEventListener('natal-houses-reprocessed', handler as any)
      }
    }, [])

    // Recalcular quando sistema de casas for alterado via toggle global
    useEffect(() => {
      const onSysChanged = () => {
        try { refreshData(true) } catch {}
      }
      if (typeof window !== 'undefined') {
        window.addEventListener('house-system-changed', onSysChanged as any)
        return () => window.removeEventListener('house-system-changed', onSysChanged as any)
      }
    }, [])

    const initializeNotifications = async () => {
      if (!user) return

      try {
        console.log('?? Inicializando notifica\u00E7\u00F5es push...')
        // TODO: Implementar notifica\u00E7\u00F5es push quando o servi\u00E7o estiver dispon\u00EDvel
        console.log('? Notifica\u00E7\u00F5es push configuradas com sucesso')
      } catch (error) {
        console.error('? Erro ao inicializar notifica\u00E7\u00F5es:', error)
      }
    }

    const loadUserProfile = async () => {
      if (!user) return

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid))
        if (userDoc.exists()) {
          const userData = userDoc.data()
          setUserProfile({
            displayName: userData.displayName || userData.fullName || 'Usu\u00E1rio',
            profilePhoto: userData.profilePhoto
          })
        }
      } catch (error) {
        console.error('Erro ao carregar perfil do Usuário:', error)
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
          uiText('Alertas Enviados'),
          uiText('Seus alertas cr\\u00EDticos foram enviados para todos os grupos!'),
          [{ text: 'OK', style: 'default' }]
        )
      } catch (error) {
        Alert.alert(
          uiText('Erro'),
          uiText('N\\u00E3o foi poss\\u00EDvel enviar os alertas. Tente novamente.'),
          [{ text: 'OK', style: 'default' }]
        )
      }
    }

    const getUserDisplayName = () => {
      const raw =
        userProfile?.displayName ||
        user?.displayName ||
        (user?.email ? user.email.split('@')[0] : '') ||
        'Usuário'
      return decodeUnicodeEscapes(raw)
    }

    const formatDate = () => {
      return new Date().toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      })
    }

    const lifeAreasForDisplay = React.useMemo(() => {
      if (localOverrideActive && transitData?.lifeAreas) {
        return transitData.lifeAreas
      }
      return backendLifeAreas || transitData?.lifeAreas || null
    }, [backendLifeAreas, transitData?.lifeAreas, localOverrideActive])

    const normalizeDisplayArea = React.useCallback((name: string, area: any) => {
      const percentage = typeof area?.percentage === 'number'
        ? area.percentage
        : (typeof area?.status === 'number' ? area.status : null)
      return {
        name,
        ...area,
        status: typeof percentage === 'number' ? percentage : 0,
        percentage: typeof area?.percentage === 'number' ? area.percentage : percentage,
        criticalLevel: typeof percentage === 'number' ? percentage < 40 : !!area?.criticalLevel,
      }
    }, [])

    const criticalAreas = React.useMemo(() => {
      if (!lifeAreasForDisplay) {
        console.log('?? criticalAreas: lifeAreasForDisplay est\u00E1 undefined')
        return []
      }

      try {
        const entries = safeEntries(lifeAreasForDisplay)
        console.log('?? criticalAreas: safeEntries retornou', entries.length, 'entradas')

        const filtered = entries.filter(([_, area]) => {
          const value = typeof area?.percentage === 'number'
            ? area.percentage
            : (typeof area?.status === 'number' ? area.status : null)
          if (typeof value !== 'number') return false
          return value < STATUS_THRESHOLDS.criticalBelow
        })

        const mapped = filtered.map(([name, area]) => normalizeDisplayArea(name, area))
        console.log('?? criticalAreas: encontradas', mapped.length, '\u00E1reas cr\u00EDticas')
        return mapped
      } catch (error) {
        console.error('? criticalAreas: erro ao processar:', error)
        return []
      }
    }, [lifeAreasForDisplay, normalizeDisplayArea])

    if (loading && !transitData) {
      return (
        <LinearGradient colors={['#0F0F23', '#1A1A3A']} style={styles.container}>
          <View style={styles.loadingContainer}>
            <StarLoader size={36} color="#FFD700" />
            <Text style={styles.loadingText}>
              {uiText('Carregando seus tr\\u00E2nsitos...')}
            </Text>
          </View>
        </LinearGradient>
      )
    }

    if (error && !transitData) {
      return (
        <LinearGradient colors={['#0F0F23', '#1A1A3A']} style={styles.container}>
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
            <Text style={styles.errorTitle}>{uiText('Ops! Algo deu errado')}</Text>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={() => refreshData()}>
              <Text style={styles.retryButtonText}>{uiText('Tentar Novamente')}</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      )
    }

    return (
      <LinearGradient colors={['#0F0F23', '#1A1A3A']} style={styles.container}>
        {/* Starfield apenas no PWA/web */}
        {typeof document !== 'undefined' && ((globalThis as any).__effectsIntensity !== 'low') && (
          <View
            // @ts-ignore
            ref={(ref: any) => {
              try {
                if (ref && mountStarfield) mountStarfield(ref as unknown as HTMLElement, { count: 50 })
              } catch {}
            }}
            style={{ position:'absolute', inset:0 }}
          />
        )}
        {localOverrideActive && (
          <View style={styles.statusToast}>
            <Text style={styles.statusToastText}>Recarregando Status</Text>
          </View>
        )}
        <ScrollView
          ref={scrollRef}
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
                <Text style={styles.houseSystemLabel}>
                  Sistema: {formatHouseSystemLabel(houseSystem)}
                </Text>
              </View>
            </View>

            {(() => {
              const press = usePressScale()
              return (
                <Animated.View style={press.style}>
                  <TouchableOpacity
                    style={styles.notificationButton}
                    onPressIn={press.onPressIn}
                    onPressOut={press.onPressOut}
                    onPress={() => navigation.navigate('Notifications' as never)}
                  >
                    <Ionicons name="star-outline" size={24} color="#FFD700" />
                    {unreadCount > 0 && (
                      <View style={styles.notificationBadge}>
                        <Text style={styles.notificationBadgeText}>
                          {unreadCount > 99 ? '99+' : unreadCount}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                </Animated.View>
              )
            })()}
          </View>

          {/* Status das Areas de Vida */}
          {lifeAreasForDisplay && (
            <AnimatedMount>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="grid" size={20} color="#FFD700" />
                <Text style={styles.sectionTitle}>
                  {uiText('Status das \\u00C1reas de Vida')}
                </Text>
              </View>

              <View style={styles.lifeAreasGrid}>
                {safeEntries(lifeAreasForDisplay).map(([name, area], index) => {
                  // ??? Prote\u00E7\u00E3o extra para cada \u00E1rea
                  if (!area || typeof area !== 'object') {
                    console.warn('?? LifeArea inv\u00E1lida:', { name, area })
                    return null
                  }

                  const transitCount =
                    transitData?.currentTransits?.transits?.byArea?.[name]?.length || 0
                  const normalizedArea = normalizeDisplayArea(name, area)

                  return (
                    <View key={name} style={styles.lifeAreaItem}>
                      <LifeAreaCard
                        area={normalizedArea}
                        onPress={() => handleAreaPress(name, normalizedArea)}
                        calculationFactors={getLifeAreaFactors(name)}
                        transitCount={transitCount}
                      />
                    </View>
                  )
                })}
              </View>
            </View>
            </AnimatedMount>
          )}


          {transitData?.currentTransits?.planetComparisons &&
          transitData?.currentTransits?.chartSummary && (
            <AnimatedMount>
              <View style={styles.section}>
                <TransitComparisonCard
                  planetComparisons={transitData.currentTransits.planetComparisons}
                  chartSummary={transitData.currentTransits.chartSummary}
                  ascendant={transitData.currentTransits.ascendant}
                  midheaven={transitData.currentTransits.midheaven}
                  natalAscendant={transitData.currentTransits.natalAscendant}
                  natalMidheaven={transitData.currentTransits.natalMidheaven}
                  housesCusps={transitData.currentTransits.houses}
                  lifeAreas={lifeAreasForDisplay || transitData.lifeAreas}
                  lifeAreasDebug={transitData.currentTransits.debug?.lifeAreas || {}}
                  personalWindows={transitData.dailyOverview?.personalTodayRich || []}
                />
              </View>
            </AnimatedMount>
          )}

          {/* Alertas Cr\u00EDticos */}
          {criticalAreas.length > 0 && (
            <AnimatedMount>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="warning" size={20} color="#EF4444" />
                <Text style={styles.sectionTitle}>
                  {uiText('\\u00C1reas Cr\\u00EDticas')}
                </Text>
              </View>

              <LinearGradient
                colors={['#2D1B1B', '#3D2626']}
                style={styles.alertCard}
              >
                <Text style={styles.alertTitle}>
                  {criticalAreas.length} {criticalAreas.length === 1
                    ? uiText('\\u00C1rea precisa')
                    : uiText('\\u00C1reas precisam')
                  } {uiText('de aten\\u00E7\\u00E3o')}
                </Text>

                <Text style={styles.alertDescription}>
                  {uiText('Seus tr\\u00E2nsitos indicam desafios em algumas \\u00E1reas. Compartilhe com seu grupo para receber apoio!')}
                </Text>

                {(() => {
                  const press = usePressScale()
                  return (
                    <Animated.View style={press.style}>
                      <TouchableOpacity style={styles.alertButton} onPress={handleSendAlerts} onPressIn={press.onPressIn} onPressOut={press.onPressOut}>
                        <Ionicons name="send" size={16} color="#FFFFFF" />
                        <Text style={styles.alertButtonText}>
                          {uiText('Enviar alertas para grupos')}
                        </Text>
                      </TouchableOpacity>
                    </Animated.View>
                  )
                })()}
              </LinearGradient>
            </View>
            </AnimatedMount>
          )}

          {/* Orienta\u00E7\u00F5es */}
          {safeWarnings.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="information-circle" size={20} color="#FFD700" />
                <Text style={styles.sectionTitle}>
                  {uiText('Orienta\\u00E7\\u00F5es')}
                </Text>
              </View>

              {safeWarnings.map((warning, index) => (
                <View key={index} style={styles.warningCard}>
                  <Ionicons name="bulb-outline" size={16} color="#FFD700" />
                  <Text style={styles.warningText}>{warning}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Espa\u00E7amento final */}
          <View style={styles.bottomSpacing} />
        </ScrollView>

        {/* ?? MODAL DE DETALHES DA \u00C1REA */}
        <LifeAreaDetailModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          areaData={selectedArea}
          astrologyData={transitData?.currentTransits}
        />

        {/* PWA Download Button */}
        <PWADownloadButton />

        {/* modal legado removido */}
      </LinearGradient>
    )
  } catch (error) {
    console.error('?? ERRO CR\u00CDTICO NO HOMESCREEN:', error)
    return (
      <LinearGradient colors={['#0F0F23', '#1A1A3A']} style={styles.container}>
        <View style={styles.loadingContainer}>
          <Ionicons name="warning" size={48} color="#EF4444" />
          <Text style={styles.loadingText}>
            {uiText('Carregando seus tr\\u00E2nsitos...')}
          </Text>
          <Text style={styles.errorText}>
            {error instanceof Error ? error.message : 'Erro desconhecido'}
          </Text>
        </View>
      </LinearGradient>
    )
  }
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
    color: '#EF4444',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 16,
    paddingHorizontal: 16,
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
  houseSystemLabel: {
    fontSize: 12,
    color: '#A0A0A0',
    marginTop: 2,
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
    paddingHorizontal: 4,
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
  bottomSpacing: {
    height: 32,
  },
  statusToast: {
    position: 'absolute',
    top: 10,
    alignSelf: 'center',
    backgroundColor: 'rgba(15, 15, 35, 0.9)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    zIndex: 10,
  },
  statusToastText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  cardText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginBottom: 8,
  },
  errorTextContainer: {
    color: '#A0A0A0',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: '#1E1E2E',
    borderRadius: 12,
    padding: 16,
    width: '100%',
  },
  modalTitle: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  modalText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginBottom: 16,
  },
  modalButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#FFD700',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  modalButtonText: {
    color: '#000',
    fontWeight: '600',
  }
})




























