import { useState, useEffect, useRef } from 'react'
import { useAuth } from './useAuth'
import TransitService, { type TransitData, type LifeArea } from '../services/prokerala/TransitService'
import LocalAstrologyService, { type LocalTransitData, type CacheStatus } from '../services/astrology/LocalAstrologyService'
import UserService from '../services/firebase/UserService'
import GroupNotificationService from '../services/notifications/GroupNotificationService'
import GroupService from '../services/firebase/GroupService'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../config/firebase'

export interface UseLifeAreasReturn {
  transitData: LocalTransitData | null
  cacheStatus: CacheStatus | null
  loading: boolean
  error: string | null
  refreshData: (forceRefresh?: boolean) => Promise<void>
  sendCriticalAlerts: () => Promise<void>
  isUsingLocalEngine: boolean
}

export function useLifeAreas(): UseLifeAreasReturn {
  const { user } = useAuth()
  const [transitData, setTransitData] = useState<LocalTransitData | null>(null)
  const [cacheStatus, setCacheStatus] = useState<CacheStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isUsingLocalEngine, setIsUsingLocalEngine] = useState(true)
  // Forçar um recálculo fresco na primeira carga para refletir correções de casas
  const [firstLoad, setFirstLoad] = useState(true)
  const lastStatusKeyRef = useRef<string | null>(null)

  useEffect(() => {
    if (user) {
      loadTransitData()
    }
  }, [user])

  const loadTransitData = async (forceRefresh: boolean = false) => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)

      // Buscar dados de nascimento do usuário
      const userProfile = await UserService.getUserProfile(user.uid)
      
      if (!userProfile?.birthDate || !userProfile?.birthTime || !userProfile?.birthLocation) {
        setError('Dados de nascimento incompletos')
        return
      }

      // Criar objeto BirthData
      const birthData = {
        birthDate: userProfile.birthDate,
        birthTime: userProfile.birthTime,
        birthLocation: userProfile.birthLocation,
      }

      // 🚀 USAR NOVO SISTEMA LOCAL (dados 100% reais, performance instantânea)
      console.log('🔬 Usando cálculos astrológicos LOCAIS (dados reais)...')
      // Regra: primeira carga ignora cache para refletir correções recentes de casas; depois volta ao fluxo normal
      const effectiveForce = forceRefresh || firstLoad || (typeof window !== 'undefined' && window.location.search.includes('debug=1'))
      const result = await LocalAstrologyService.getCurrentTransits(birthData, user.uid, effectiveForce)
      setTransitData(result.data)
      setCacheStatus(result.cacheStatus)
      setIsUsingLocalEngine(true)
      if (firstLoad) setFirstLoad(false)
      const statusKey = `${user.uid}:${result.data.currentTransits?.timestamp || result.cacheStatus.cacheSource}`
      if (lastStatusKeyRef.current !== statusKey) {
        lastStatusKeyRef.current = statusKey
        GroupService.updateUserStatusFromLifeAreas(user.uid, result.data, birthData)
      }

      console.log('📊 Dados astrológicos REAIS carregados:', {
        lifeAreas: Object.keys(result.data.lifeAreas).length,
        cacheSource: result.cacheStatus.cacheSource,
        hoursOld: result.cacheStatus.hoursOld,
        requestsToday: `${result.cacheStatus.requestsToday}/${result.cacheStatus.maxRequests}`,
        engine: 'LOCAL (dados reais)'
      })
    } catch (err) {
      console.error('❌ Erro ao carregar dados de trânsito:', err)
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados astrológicos')
    } finally {
      setLoading(false)
    }
  }

  const refreshData = async (forceRefresh: boolean = false) => {
    await loadTransitData(forceRefresh)
  }

  const sendCriticalAlerts = async () => {
    if (!transitData || !user) return

    try {
      // Verificar se deve enviar alertas críticos usando o novo sistema
      const shouldAlert = LocalAstrologyService.shouldSendCriticalAlert(transitData)
      
      if (!shouldAlert) {
        console.log('✅ Nenhuma situação crítica detectada')
        return
      }

      // Gerar mensagem personalizada
      const alertMessage = LocalAstrologyService.generateAlertMessage(transitData)
      console.log(`🚨 Alerta crítico detectado: ${alertMessage}`)

      // Buscar grupos do usuário
      const userGroups = await getUserGroups(user.uid)
      
      if (userGroups.length === 0) {
        console.log('ℹ️ Usuário não participa de nenhum grupo')
        return
      }

      // Buscar mensagens personalizadas do usuário
      const userProfile = await UserService.getUserProfile(user.uid)
      const alertMessages = userProfile?.alertMessages
      const userName = userProfile?.displayName || userProfile?.fullName || 'Usuário'

      // Encontrar áreas críticas (abaixo de 30%)
      const criticalAreas = Object.entries(transitData.lifeAreas)
        .filter(([_, area]) => {
          const value = typeof area?.percentage === 'number'
            ? area.percentage
            : (typeof area?.status === 'number' ? area.status : null)
          return typeof value === 'number' && value < 30
        })
        .map(([name, area]) => ({
          name,
          status: typeof area?.percentage === 'number'
            ? area.percentage
            : (typeof area?.status === 'number' ? area.status : null)
        }))

      if (criticalAreas.length === 0) {
        console.log('✅ Nenhuma área crítica encontrada')
        return
      }

      // Enviar alertas para cada área crítica
      for (const area of criticalAreas) {
        for (const groupId of userGroups) {
          try {
            const memberSettings = await GroupService.getMemberSettings(groupId, user.uid)
            if (memberSettings?.enabled === false) continue
            if (memberSettings?.types?.criticalAlerts === false) continue
            if (memberSettings?.priority === 'none') continue

            const customMessage = memberSettings?.customAlertMessages?.[area.name]
            const message = customMessage || alertMessages?.[area.name] || getDefaultMessage(area.name)

            await GroupNotificationService.sendGroupNotification({
              groupId,
              senderId: user.uid,
              notificationType: 'critical_alert',
              customMessage: message,
              eventData: {
                area: area.name,
                percentage: area.status,
                senderName: userName,
              },
            })
          } catch (error) {
            console.error('Erro ao enviar alerta para grupo:', error)
          }
        }
      }

      console.log(`✅ Alertas enviados para ${criticalAreas.length} áreas críticas`)
    } catch (err) {
      console.error('❌ Erro ao enviar alertas críticos:', err)
    }
  }



  return {
    transitData,
    cacheStatus,
    loading,
    error,
    refreshData,
    sendCriticalAlerts,
    isUsingLocalEngine,
  }
}

// Funções auxiliares
async function getUserGroups(userId: string): Promise<string[]> {
  try {
    // Buscar grupos onde o usuário é membro
    const groupsQuery = query(
      collection(db, 'groups'),
      where('members', 'array-contains', userId)
    )
    
    const snapshot = await getDocs(groupsQuery)
    const groups: string[] = []
    
    snapshot.forEach(doc => {
      groups.push(doc.id)
    })
    
    console.log(`👥 Usuário participa de ${groups.length} grupo(s)`)
    return groups
  } catch (error) {
    console.error('Erro ao buscar grupos do usuário:', error)
    return []
  }
}

function getDefaultMessage(area: string): string {
  const defaultMessages: { [key: string]: string } = {
    love: "Meus trânsitos amorosos estão em fase crítica. Preciso de apoio!",
    career: "Minha carreira passa por um momento desafiador. Pedindo energias positivas!",
    health: "Minha saúde precisa de atenção especial agora. Enviando amor e luz!",
    family: "Questões familiares requerem minha atenção. Gratidão pelo suporte!",
    spirituality: "Meu crescimento espiritual está intenso. Compartilhando essa energia!",
  }

  return defaultMessages[area] || `Estou passando por um momento crítico em ${area}. Pedindo energias positivas!`
}


