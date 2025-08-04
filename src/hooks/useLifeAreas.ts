import { useState, useEffect } from 'react'
import { useAuth } from './useAuth'
import TransitService, { type TransitData, type LifeArea } from '../services/prokerala/TransitService'
import { type CacheStatus } from '../services/astrology/AstrologyCacheService'
import UserService from '../services/firebase/UserService'
import NotificationService from '../services/firebase/NotificationService'
import { doc, getDoc, collection, query, where, getDocs, addDoc } from 'firebase/firestore'
import { db } from '../config/firebase'

export interface UseLifeAreasReturn {
  transitData: TransitData | null
  cacheStatus: CacheStatus | null
  loading: boolean
  error: string | null
  refreshData: (forceRefresh?: boolean) => Promise<void>
  sendCriticalAlerts: () => Promise<void>
}

export function useLifeAreas(): UseLifeAreasReturn {
  const { user } = useAuth()
  const [transitData, setTransitData] = useState<TransitData | null>(null)
  const [cacheStatus, setCacheStatus] = useState<CacheStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

      // Buscar trânsitos atuais com cache inteligente
      const result = await TransitService.getCurrentTransits(birthData, user.uid, forceRefresh)
      setTransitData(result.data)
      setCacheStatus(result.cacheStatus)

      console.log('📊 Dados de trânsito carregados:', {
        lifeAreas: result.data.lifeAreas.length,
        cacheStatus: result.cacheStatus.cacheSource,
        hoursOld: result.cacheStatus.hoursOld,
        requestsToday: `${result.cacheStatus.requestsToday}/${result.cacheStatus.maxRequests}`
      })
    } catch (err) {
      console.error('❌ Erro ao carregar dados de trânsito:', err)
      
      // FALLBACK: Tentar cache local quando Firebase falha
      try {
        console.log('🔄 Tentando cache local como fallback...')
        const localCacheData = await getLocalCacheData(user.uid)
        
        if (localCacheData) {
          console.log('✅ Dados encontrados no cache local')
          setTransitData(localCacheData)
          setCacheStatus({
            isValid: true,
            cacheSource: 'local-fallback',
            lastUpdate: new Date(),
            hoursOld: 0,
            canRefresh: true,
            requestsToday: 0,
            maxRequests: 2
          })
          setError('Usando cache local - Firestore indisponível')
        } else {
          console.log('❌ Cache local também vazio')
          setError(err instanceof Error ? err.message : 'Erro ao carregar dados astrológicos')
        }
      } catch (fallbackErr) {
        console.error('❌ Erro no cache local:', fallbackErr)
        setError(err instanceof Error ? err.message : 'Erro ao carregar dados astrológicos')
      }
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
      // Identificar áreas críticas (status baixo OU marcadas como críticas)
      const criticalAreas = transitData.lifeAreas.filter(area => 
        area.criticalLevel || area.status < 30
      )
      
      if (criticalAreas.length === 0) {
        console.log('✅ Nenhuma área crítica detectada')
        return
      }

      console.log(`🚨 ${criticalAreas.length} área(s) crítica(s) detectada(s)`)

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

      // Enviar alertas para cada área crítica
      for (const area of criticalAreas) {
        const message = alertMessages?.[area.name] || getDefaultMessage(area.name)
        
        // Enviar para todos os grupos do usuário
        for (const groupId of userGroups) {
          // Salvar alerta no Firestore
          await sendAlertToGroup(groupId, {
            userId: user.uid,
            userName,
            area: area.name,
            message,
            status: area.status,
            timestamp: new Date(),
            type: 'critical_area'
          })

          // Enviar notificações push para outros membros do grupo
          await sendPushNotificationsToGroup(groupId, {
            title: `⚠️ Alerta de ${getAreaDisplayName(area.name)}`,
            body: `${userName} está passando por um momento crítico em ${getAreaDisplayName(area.name)} (${area.status}%)`,
            data: {
              type: 'critical_area_alert',
              userId: user.uid,
              area: area.name,
              status: area.status
            }
          })
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
  }
}

// Função para cache local como fallback
async function getLocalCacheData(userId: string) {
  try {
    const AsyncStorage = require('@react-native-async-storage/async-storage').default
    const cacheKey = `astrology_cache_${userId}`
    const cachedData = await AsyncStorage.getItem(cacheKey)
    
    if (cachedData) {
      const parsed = JSON.parse(cachedData)
      // Verificar se não está muito antigo (máximo 24h)
      const age = Date.now() - parsed.timestamp
      const maxAge = 24 * 60 * 60 * 1000 // 24 horas
      
      if (age < maxAge) {
        return parsed.data
      }
    }
    
    return null
  } catch (error) {
    console.error('❌ Erro ao ler cache local:', error)
    return null
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

async function sendAlertToGroup(groupId: string, alert: any) {
  try {
    // Salvar alerta na coleção groupAlerts
    await addDoc(collection(db, 'groupAlerts'), {
      ...alert,
      groupId,
      createdAt: new Date(),
      read: false
    })
    
    console.log(`📢 Alerta salvo para grupo ${groupId}:`, alert.area)
  } catch (error) {
    console.error('Erro ao enviar alerta para grupo:', error)
  }
}

async function sendPushNotificationsToGroup(groupId: string, notification: any) {
  try {
    // Buscar membros do grupo
    const groupDoc = await getDoc(doc(db, 'groups', groupId))
    if (!groupDoc.exists()) return

    const groupData = groupDoc.data()
    const members = groupData.members || []
    
    // Enviar notificação para cada membro (exceto o remetente)
    const promises = members
      .filter((memberId: string) => memberId !== notification.data.userId)
      .map((memberId: string) => 
        NotificationService.sendNotificationToUser(memberId, {
          title: notification.title,
          body: notification.body,
          data: notification.data
        })
      )
    
    await Promise.all(promises)
    console.log(`📱 Notificações enviadas para ${promises.length} membros do grupo`)
  } catch (error) {
    console.error('Erro ao enviar notificações push:', error)
  }
}

function getAreaDisplayName(areaName: string): string {
  const displayNames = {
    love: 'Amor',
    career: 'Carreira', 
    health: 'Saúde',
    family: 'Família',
    spirituality: 'Espiritualidade'
  }
  
  return displayNames[areaName as keyof typeof displayNames] || areaName
}

function getDefaultMessage(area: LifeArea['name']): string {
  const defaultMessages = {
    love: "Meus trânsitos amorosos estão em fase crítica. Preciso de apoio!",
    career: "Minha carreira passa por um momento desafiador. Pedindo energias positivas!",
    health: "Minha saúde precisa de atenção especial agora. Enviando amor e luz!",
    family: "Questões familiares requerem minha atenção. Gratidão pelo suporte!",
    spirituality: "Meu crescimento espiritual está intenso. Compartilhando essa energia!",
  }

  return defaultMessages[area]
}