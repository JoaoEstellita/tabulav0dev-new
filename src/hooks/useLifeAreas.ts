import { useState, useEffect, useRef } from 'react'
import { useAuth } from './useAuth'
import TransitService, { type TransitData, type LifeArea } from '../services/prokerala/TransitService'
import LocalAstrologyService, { type LocalTransitData, type CacheStatus } from '../services/astrology/LocalAstrologyService'
import UserService from '../services/firebase/UserService'
import GroupNotificationService from '../services/notifications/GroupNotificationService'
import GroupService from '../services/firebase/GroupService'
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore'
import { db } from '../config/firebase'

export interface UseLifeAreasReturn {
  transitData: LocalTransitData | null
  cacheStatus: CacheStatus | null
  backendLifeAreas: Record<string, any> | null
  loading: boolean
  error: string | null
  refreshData: (forceRefresh?: boolean) => Promise<void>
  sendCriticalAlerts: () => Promise<void>
  isUsingLocalEngine: boolean
  localOverrideActive: boolean
}

export function useLifeAreas(): UseLifeAreasReturn {
  const { user } = useAuth()
  const [transitData, setTransitData] = useState<LocalTransitData | null>(null)
  const [cacheStatus, setCacheStatus] = useState<CacheStatus | null>(null)
  const [backendLifeAreas, setBackendLifeAreas] = useState<Record<string, any> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isUsingLocalEngine, setIsUsingLocalEngine] = useState(true)
  const [localOverrideActive, setLocalOverrideActive] = useState(false)
  const localOverrideActiveRef = useRef(false)
  const lastStatusKeyRef = useRef<string | null>(null)
  const statusUpdateTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const STATUS_UPDATE_DEBOUNCE_MS = 1200
  const lastHouseSystemRef = useRef<string | null>(null)
  const lastBackendComputedAtRef = useRef<number | null>(null)
  const localOverrideStartedAtRef = useRef<number | null>(null)

  useEffect(() => {
    if (!user) {
      setTransitData(null)
      setCacheStatus(null)
      setBackendLifeAreas(null)
      setLoading(false)
      setError(null)
      setIsUsingLocalEngine(false)
      setLocalOverrideActive(false)
      localOverrideActiveRef.current = false
      lastStatusKeyRef.current = null
      lastHouseSystemRef.current = null
      lastBackendComputedAtRef.current = null
      localOverrideStartedAtRef.current = null
      return
    }

    loadTransitData()
    return () => {
      if (statusUpdateTimeoutRef.current) {
        clearTimeout(statusUpdateTimeoutRef.current)
        statusUpdateTimeoutRef.current = null
      }
    }
  }, [user])

  const loadTransitData = async (forceRefresh: boolean = false) => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)

      // Buscar dados de nascimento do usuario
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

      const activeHouseSystem =
        (globalThis as any).__userHouseSystem || userProfile?.preferences?.houseSystem || userProfile?.houseSystem
      const normalizedHouseSystem = String(activeHouseSystem || 'placidus')
      const houseSystemChanged =
        lastHouseSystemRef.current && lastHouseSystemRef.current !== normalizedHouseSystem
      lastHouseSystemRef.current = normalizedHouseSystem

      let backendLifeAreasValue: Record<string, any> | null = null
      let backendComputedAtMs: number | null = null
      let backendValidUntilMs: number | null = null
      let backendCalcVersion: string | null = null
      try {
        const statusSnap = await getDoc(doc(db, 'userStatus', user.uid))
        if (statusSnap.exists()) {
          const statusData = statusSnap.data()
          backendLifeAreasValue = statusData?.lifeAreas || null
          backendCalcVersion = typeof statusData?.calcVersion === 'string' ? statusData.calcVersion : null
          backendComputedAtMs = statusData?.computedAt?.toDate
            ? statusData.computedAt.toDate().getTime()
            : (statusData?.computedAt instanceof Date ? statusData.computedAt.getTime() : null)
          backendValidUntilMs = statusData?.validUntil?.toDate
            ? statusData.validUntil.toDate().getTime()
            : (statusData?.validUntil instanceof Date ? statusData.validUntil.getTime() : null)
          setBackendLifeAreas(backendLifeAreasValue)
        } else {
          setBackendLifeAreas(null)
        }
      } catch (statusError) {
        console.error('Erro ao carregar userStatus:', statusError)
      }

      const backendFresh =
        !!backendLifeAreasValue &&
        !!backendValidUntilMs &&
        backendValidUntilMs > Date.now() &&
        !!backendCalcVersion &&
        backendCalcVersion.startsWith('status-backend-')

      if (houseSystemChanged) {
        localOverrideActiveRef.current = true
        setLocalOverrideActive(true)
        localOverrideStartedAtRef.current = Date.now()
      }

      if (localOverrideActiveRef.current && backendComputedAtMs && localOverrideStartedAtRef.current) {
        if (backendComputedAtMs > localOverrideStartedAtRef.current) {
          localOverrideActiveRef.current = false
          setLocalOverrideActive(false)
        }
      }

      if (backendComputedAtMs && backendComputedAtMs !== lastBackendComputedAtRef.current) {
        lastBackendComputedAtRef.current = backendComputedAtMs
      }

      const shouldRunLocal =
        forceRefresh ||
        houseSystemChanged ||
        !backendLifeAreasValue ||
        !backendFresh ||
        (typeof window !== 'undefined' && window.location.search.includes('debug=1'))

      if (shouldRunLocal) {
        console.log(' Usando calculos astrologicos LOCAIS (dados reais)...')
        const result = await LocalAstrologyService.getCurrentTransits(
          birthData,
          user.uid,
          forceRefresh || houseSystemChanged || (typeof window !== 'undefined' && window.location.search.includes('debug=1'))
        )
        setTransitData(result.data)
        setCacheStatus(result.cacheStatus)
        setIsUsingLocalEngine(true)
        const lifeAreasSignature = buildLifeAreasSignature(result.data.lifeAreas)
        const statusKey = `${user.uid}:${normalizedHouseSystem}:${lifeAreasSignature}`
        if (lastStatusKeyRef.current !== statusKey) {
          lastStatusKeyRef.current = statusKey
          if (statusUpdateTimeoutRef.current) {
            clearTimeout(statusUpdateTimeoutRef.current)
          }
          // Debounce para evitar writes repetidas.
          statusUpdateTimeoutRef.current = setTimeout(() => {
            GroupService.updateUserStatusFromLifeAreas(
              user.uid,
              result.data,
              birthData,
              lifeAreasSignature
            )
          }, STATUS_UPDATE_DEBOUNCE_MS)
        }

        console.log(' Dados astrologicos REAIS carregados:', {
          lifeAreas: Object.keys(result.data.lifeAreas).length,
          cacheSource: result.cacheStatus.cacheSource,
          hoursOld: result.cacheStatus.hoursOld,
          requestsToday: `${result.cacheStatus.requestsToday}/${result.cacheStatus.maxRequests}`,
          engine: 'LOCAL (dados reais)'
        })
      } else {
        setIsUsingLocalEngine(false)
        console.log(' Usando status do backend (fresh).')
      }
    } catch (err) {
      console.error(' Erro ao carregar dados de transito:', err)
      const fallbackAllowed = backendLifeAreasValue && Object.keys(backendLifeAreasValue).length > 0
      if (!fallbackAllowed) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar dados astrologicos')
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
      // Encontrar areas criticas (abaixo de 40%)
      const criticalAreas = Object.entries(transitData.lifeAreas)
        .filter(([_, area]) => {
          const value = typeof area?.percentage === 'number'
            ? area.percentage
            : (typeof area?.status === 'number' ? area.status : null)
          return typeof value === 'number' && value < 40
        })
        .map(([name, area]) => ({
          name,
          status: typeof area?.percentage === 'number'
            ? area.percentage
            : (typeof area?.status === 'number' ? area.status : null)
        }))

      if (criticalAreas.length === 0) {
        console.log(' Nenhuma area critica encontrada')
        return
      }

      // Buscar grupos do usuario
      const userGroups = await getUserGroups(user.uid)
      
      if (userGroups.length === 0) {
        console.log(' Usuario nao participa de nenhum grupo')
        return
      }

      // Buscar mensagens personalizadas do usuario
      const userProfile = await UserService.getUserProfile(user.uid)
      const alertMessages = userProfile?.alertMessages
      const userName = userProfile?.displayName || userProfile?.fullName || 'Usuario'

      // Enviar alertas para cada area critica
      for (const area of criticalAreas) {
        for (const groupId of userGroups) {
          try {
            const memberSettings = await GroupService.getMemberSettings(groupId, user.uid)
            if (memberSettings?.enabled === false) continue
            if (memberSettings?.shareStatus === false) continue
            if (memberSettings?.types?.criticalAlerts === false) continue
            if (memberSettings?.priority === 'none') continue
            if (memberSettings?.notifiedLifeAreas && !memberSettings.notifiedLifeAreas.includes(area.name)) {
              continue
            }

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

      console.log(` Alertas enviados para ${criticalAreas.length} areas criticas`)
    } catch (err) {
      console.error(' Erro ao enviar alertas crticos:', err)
    }
  }



  return {
    transitData,
    cacheStatus,
    backendLifeAreas,
    loading,
    error,
    refreshData,
    sendCriticalAlerts,
    isUsingLocalEngine,
    localOverrideActive,
  }
}

// Funcoes auxiliares
function buildLifeAreasSignature(lifeAreas: Record<string, any> | undefined): string {
  if (!lifeAreas) return 'none'
  const entries = Object.entries(lifeAreas)
    .map(([key, value]) => {
      const raw = typeof value?.status === 'number'
        ? value.status
        : (typeof value?.percentage === 'number' ? value.percentage : null)
      const normalized = typeof raw === 'number' ? Math.round(raw) : 'null'
      return `${key}:${normalized}`
    })
    .sort((a, b) => a.localeCompare(b))
  return entries.join('|')
}

async function getUserGroups(userId: string): Promise<string[]> {
  try {
    // Buscar grupos onde o usuario e membro
    const groupsQuery = query(
      collection(db, 'groups'),
      where('members', 'array-contains', userId)
    )
    
    const snapshot = await getDocs(groupsQuery)
    const groups: string[] = []
    
    snapshot.forEach(doc => {
      groups.push(doc.id)
    })
    
    console.log(` Usuario participa de ${groups.length} grupo(s)`)
    return groups
  } catch (error) {
    console.error('Erro ao buscar grupos do usuario:', error)
    return []
  }
}

function getDefaultMessage(area: string): string {
  const defaultMessages: { [key: string]: string } = {
    amor: "Meus transitos amorosos estao em fase critica. Preciso de apoio!",
    carreira: "Minha carreira passa por um momento desafiador. Pedindo energias positivas!",
    saude: "Minha saude precisa de atencao especial agora. Enviando amor e luz!",
    familia: "Questoes familiares requerem minha atencao. Gratidao pelo suporte!",
    espiritualidade: "Meu crescimento espiritual esta intenso. Compartilhando essa energia!",
    comunicacao: "Minha comunicacao pede atencao agora. Conto com seu apoio!",
    transformacao: "Estou em fase de transformacao intensa. Energia positiva e bem-vinda!",
    financas: "Minhas financas pedem cautela agora. Agradeco o suporte!",
  }

  return defaultMessages[area] || `Estou passando por um momento critico em ${area}. Pedindo energias positivas!`
}


