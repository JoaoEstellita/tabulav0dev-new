import { useState, useEffect, useRef } from 'react'
import { Platform } from 'react-native'
import { STATUS_THRESHOLDS } from '../constants/statusThresholds'
import { useAuth } from './useAuth'
import TransitService from '../services/prokerala/TransitService'
import LocalAstrologyService, { type LocalTransitData, type CacheStatus } from '../services/astrology/LocalAstrologyService'
import UserService from '../services/firebase/UserService'
import GroupNotificationService from '../services/notifications/GroupNotificationService'
import GroupService from '../services/firebase/GroupService'
import { backendFetch } from '../services/backend/client'
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore'
import { db } from '../config/firebase'
import { publishAstrologyData } from '../context/AstrologyDataProvider'

const BACKEND_URL = (process.env.EXPO_PUBLIC_BACKEND_URL || 'https://tabulav0dev-backend.vercel.app').replace(/\/$/, '')
const ENABLE_LOCAL_ENGINE_FALLBACK = process.env.EXPO_PUBLIC_ENABLE_LOCAL_ENGINE_FALLBACK === '1'
const BACKEND_ONLY_STATUS = process.env.EXPO_PUBLIC_BACKEND_ONLY_STATUS !== '0'
const IS_PRODUCTION_BUILD = process.env.NODE_ENV === 'production'

export interface UseLifeAreasReturn {
  transitData: LocalTransitData | null
  cacheStatus: CacheStatus | null
  backendLifeAreas: Record<string, any> | null
  backendCurrentTransits: any | null
  backendStatusPersonal: { score?: number; level?: string } | null
  backendFresh: boolean
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
  const [backendCurrentTransits, setBackendCurrentTransits] = useState<any | null>(null)
  const [backendStatusPersonal, setBackendStatusPersonal] = useState<{ score?: number; level?: string } | null>(null)
  const [backendFreshState, setBackendFreshState] = useState(false)
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
  const statusRefreshInFlightRef = useRef(false)

  useEffect(() => {
    if (!user) {
      setTransitData(null)
      setCacheStatus(null)
      setBackendLifeAreas(null)
      setBackendCurrentTransits(null)
      setBackendStatusPersonal(null)
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
    let backendLifeAreasValue: Record<string, any> | null = null
    let backendCurrentTransitsValue: any | null = null
    let backendStatusPersonalValue: { score?: number; level?: string } | null = null
    let statusRefreshStaleSession = false

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

      let backendComputedAtMs: number | null = null
      let backendValidUntilMs: number | null = null
      let backendCalcVersion: string | null = null
      try {
        const statusSnap = await getDoc(doc(db, 'userStatus', user.uid))
        if (statusSnap.exists()) {
          const statusData = statusSnap.data()
          backendLifeAreasValue = statusData?.lifeAreas || null
          backendCurrentTransitsValue = statusData?.currentTransits || null
          backendStatusPersonalValue = statusData?.statusPersonal || null
          backendCalcVersion = typeof statusData?.calcVersion === 'string' ? statusData.calcVersion : null
          backendComputedAtMs = statusData?.computedAt?.toDate
            ? statusData.computedAt.toDate().getTime()
            : (statusData?.computedAt instanceof Date ? statusData.computedAt.getTime() : null)
          backendValidUntilMs = statusData?.validUntil?.toDate
            ? statusData.validUntil.toDate().getTime()
            : (statusData?.validUntil instanceof Date ? statusData.validUntil.getTime() : null)
          setBackendLifeAreas(backendLifeAreasValue)
          setBackendCurrentTransits(backendCurrentTransitsValue)
          setBackendStatusPersonal(backendStatusPersonalValue)
        } else {
          setBackendLifeAreas(null)
          setBackendCurrentTransits(null)
          setBackendStatusPersonal(null)
        }
      } catch (statusError) {
        console.error('Erro ao carregar userStatus:', statusError)
      }

      let backendFresh =
        !!backendLifeAreasValue &&
        !!backendValidUntilMs &&
        backendValidUntilMs > Date.now() &&
        !!backendCalcVersion &&
        backendCalcVersion.startsWith('status-backend-')

      if (!backendFresh && BACKEND_URL && !statusRefreshInFlightRef.current) {
        statusRefreshInFlightRef.current = true
        try {
          const refreshResponse = await backendFetch(`/api/status-refresh?userId=${encodeURIComponent(user.uid)}`, {
            method: 'POST',
            auth: true,
            // Timeout de 15s: se o backend pendurar (504/quota), aborta e cai no
            // fallback (snapshot stale já lido acima ou motor local) — nunca trava
            // a tela em "Mapa em processamento".
            timeoutMs: 15000,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: user.uid }),
          })
          if (!refreshResponse.ok) {
            if (refreshResponse.status === 401) {
              statusRefreshStaleSession = true
              throw new Error('stale_session')
            }
            let errorPayload: any = null
            try {
              errorPayload = await refreshResponse.clone().json()
            } catch {
              try {
                errorPayload = await refreshResponse.text()
              } catch {
                errorPayload = null
              }
            }
            const payloadObj =
              errorPayload && typeof errorPayload === 'object'
                ? errorPayload
                : {}
            const payloadText =
              typeof errorPayload === 'string'
                ? errorPayload.toLowerCase()
                : ''
            const reason = String(payloadObj?.reason || '').toLowerCase()
            const errorCode = String(payloadObj?.error || '').toLowerCase()
            if (
              refreshResponse.status === 401 &&
              (
                reason === 'stale_auth_time' ||
                errorCode === 'stale_session' ||
                payloadText.includes('stale_auth_time') ||
                payloadText.includes('stale_session')
              )
            ) {
              statusRefreshStaleSession = true
              throw new Error('stale_session')
            }
            throw new Error(`status_refresh_${refreshResponse.status}`)
          }
          // O backend devolve o snapshot na resposta — usa direto e evita reler
          // o doc userStatus (economiza 1 leitura Firestore por carga stale).
          const refreshPayload = await refreshResponse.json().catch(() => null)
          const refreshed = refreshPayload?.snapshot
          if (refreshed?.lifeAreas) {
            backendLifeAreasValue = refreshed.lifeAreas || null
            backendCurrentTransitsValue = refreshed.currentTransits || null
            backendStatusPersonalValue = refreshed.statusPersonal || null
            backendCalcVersion = typeof refreshed.calcVersion === 'string' ? refreshed.calcVersion : null
            backendComputedAtMs = refreshed.computedAt ? new Date(refreshed.computedAt).getTime() : null
            backendValidUntilMs = refreshPayload?.validUntil ? new Date(refreshPayload.validUntil).getTime() : null
            setBackendLifeAreas(backendLifeAreasValue)
            setBackendCurrentTransits(backendCurrentTransitsValue)
            setBackendStatusPersonal(backendStatusPersonalValue)
          } else {
            // Fallback (backend antigo sem snapshot na resposta): relê o doc.
            const statusSnap = await getDoc(doc(db, 'userStatus', user.uid))
            if (statusSnap.exists()) {
              const statusData = statusSnap.data()
              backendLifeAreasValue = statusData?.lifeAreas || null
              backendCurrentTransitsValue = statusData?.currentTransits || null
              backendStatusPersonalValue = statusData?.statusPersonal || null
              backendCalcVersion = typeof statusData?.calcVersion === 'string' ? statusData.calcVersion : null
              backendComputedAtMs = statusData?.computedAt?.toDate
                ? statusData.computedAt.toDate().getTime()
                : (statusData?.computedAt instanceof Date ? statusData.computedAt.getTime() : null)
              backendValidUntilMs = statusData?.validUntil?.toDate
                ? statusData.validUntil.toDate().getTime()
                : (statusData?.validUntil instanceof Date ? statusData.validUntil.getTime() : null)
              setBackendLifeAreas(backendLifeAreasValue)
              setBackendCurrentTransits(backendCurrentTransitsValue)
              setBackendStatusPersonal(backendStatusPersonalValue)
            }
          }
        } catch (refreshError) {
          const refreshMessage =
            refreshError instanceof Error ? refreshError.message.toLowerCase() : String(refreshError || '').toLowerCase()
          if (
            refreshMessage.includes('stale_session') ||
            refreshMessage.includes('stale_auth_time') ||
            refreshMessage.includes('auth_required_missing_token')
          ) {
            statusRefreshStaleSession = true
          }
          console.warn('Falha ao atualizar status via backend:', refreshError)
        } finally {
          statusRefreshInFlightRef.current = false
        }
      }

      backendFresh =
        !!backendLifeAreasValue &&
        !!backendValidUntilMs &&
        backendValidUntilMs > Date.now() &&
        !!backendCalcVersion &&
        backendCalcVersion.startsWith('status-backend-')
      setBackendFreshState(backendFresh)

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

      const debugLocalOverride = Platform.OS === 'web' && typeof window !== 'undefined' && window.location?.search?.includes?.('debug=1')
      const shouldRunLocal =
        forceRefresh ||
        houseSystemChanged ||
        !backendLifeAreasValue ||
        !backendFresh ||
        debugLocalOverride

      const isTransitDataComplete = (data: LocalTransitData | null) => {
        const transitsByArea = data?.currentTransits?.transits?.byArea
        const comparisons = data?.currentTransits?.planetComparisons
        const chartSummary = data?.currentTransits?.chartSummary
        const personalTransits = data?.currentTransits?.transits?.personal
        const personalWindows = data?.dailyOverview?.personalTodayRich
        return (
          !!transitsByArea &&
          typeof transitsByArea === 'object' &&
          Object.keys(transitsByArea).length > 0 &&
          Array.isArray(comparisons) &&
          comparisons.length > 0 &&
          !!chartSummary &&
          Array.isArray(personalTransits) &&
          Array.isArray(personalWindows)
        )
      }

      const canUseLocalEngineFallback =
        Platform.OS !== 'web' ||
        (!BACKEND_ONLY_STATUS && (!IS_PRODUCTION_BUILD || ENABLE_LOCAL_ENGINE_FALLBACK))
      const allowEmergencyLocalFallback = statusRefreshStaleSession

      if (shouldRunLocal && !canUseLocalEngineFallback && !allowEmergencyLocalFallback && !debugLocalOverride) {
        const hasBackendSnapshot =
          !!backendLifeAreasValue &&
          typeof backendLifeAreasValue === 'object' &&
          Object.keys(backendLifeAreasValue).length > 0
        setIsUsingLocalEngine(false)
        setLocalOverrideActive(false)
        localOverrideActiveRef.current = false
        if (!hasBackendSnapshot) {
          setError(
            statusRefreshStaleSession
              ? 'Sessao expirada por seguranca. Faca login novamente para atualizar seu status.'
              : 'Status do backend indisponivel no momento. Tente novamente em instantes.'
          )
        } else if (statusRefreshStaleSession) {
          // Mantem o snapshot ja salvo e evita tela de erro fatal.
          setError(null)
        }
        return
      }

      if (shouldRunLocal && (canUseLocalEngineFallback || allowEmergencyLocalFallback || debugLocalOverride)) {
        if (__DEV__) console.log(' Usando calculos astrologicos LOCAIS (dados reais)...')
        const result = await LocalAstrologyService.getCurrentTransits(
          birthData,
          user.uid,
          forceRefresh || houseSystemChanged || debugLocalOverride
        )
        setTransitData(result.data)
        setCacheStatus(result.cacheStatus)
        setIsUsingLocalEngine(true)
        if (!backendFresh) {
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
        }

        if (__DEV__) console.log(' Dados astrologicos REAIS carregados:', {
          lifeAreas: Object.keys(result.data.lifeAreas).length,
          cacheSource: result.cacheStatus.cacheSource,
          hoursOld: result.cacheStatus.hoursOld,
          requestsToday: `${result.cacheStatus.requestsToday}/${result.cacheStatus.maxRequests}`,
          engine: 'LOCAL (dados reais)'
        })
      } else {
        // Backend fresco: usar cache local apenas se existir (sem recalcular).
        const cached = await LocalAstrologyService.getCachedTransits(user.uid)
        const cachedData = cached?.data || null
        const cachedComplete = isTransitDataComplete(cachedData)
        if (cachedData && cachedComplete) {
          setTransitData(cachedData)
          setCacheStatus(cached?.cacheStatus || null)
          if (cachedData.currentTransits) {
            publishAstrologyData(cachedData.currentTransits)
          }
        } else {
          // Sem cache local: calcular uma vez para recuperar comparativos.
          const result = await LocalAstrologyService.getCurrentTransits(
            birthData,
            user.uid,
            true
          )
          setTransitData(result.data)
          setCacheStatus(result.cacheStatus)
        }
        setIsUsingLocalEngine(false)
        if (__DEV__) console.log(' Usando status do backend (fresh).')
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
          return typeof value === 'number' && value < STATUS_THRESHOLDS.criticalBelow
        })
        .map(([name, area]) => ({
          name,
          status: typeof area?.percentage === 'number'
            ? area.percentage
            : (typeof area?.status === 'number' ? area.status : null)
        }))

      if (criticalAreas.length === 0) {
        if (__DEV__) console.log(' Nenhuma area critica encontrada')
        return
      }

      // Buscar grupos do usuario
      const userGroups = await getUserGroups(user.uid)

      if (userGroups.length === 0) {
        if (__DEV__) console.log(' Usuario nao participa de nenhum grupo')
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
            const message =
              customMessage ||
              (alertMessages as Record<string, string> | undefined)?.[area.name] ||
              getDefaultMessage(area.name)

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

      if (__DEV__) console.log(` Alertas enviados para ${criticalAreas.length} areas criticas`)
    } catch (err) {
      console.error(' Erro ao enviar alertas crticos:', err)
    }
  }



  return {
    transitData,
    cacheStatus,
    backendLifeAreas,
    backendCurrentTransits,
    backendStatusPersonal,
    backendFresh: backendFreshState,
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

    if (__DEV__) console.log(` Usuario participa de ${groups.length} grupo(s)`)
    return groups
  } catch (error) {
    console.error('Erro ao buscar grupos do usuario:', error)
    return []
  }
}

function getDefaultMessage(area: string): string {
  const defaultMessages: Record<string, string> = {
    amor: "Meus transitos amorosos estao em fase critica. Preciso de apoio!",
    carreira: "Minha carreira passa por um momento desafiador. Pedindo energias positivas!",
    saude: "Minha saude precisa de atencao especial agora. Enviando amor e luz!",
    familia: "Questoes familiares requerem minha atencao. Gratidao pelo suporte!",
    espiritualidade: "Meu crescimento espiritual esta intenso. Compartilhando essa energia!",
    comunicacao: "Minha comunicacao pede atencao agora. Conto com seu apoio!",
    transformacao: "Estou em fase de transformacao intensa. Energia positiva e bem-vinda!",
    financas: "Minhas financas pedem cautela agora. Agradeco o suporte!",
  }

  return defaultMessages[area as keyof typeof defaultMessages] || `Estou passando por um momento delicado em ${area}. Pedindo energias positivas!`
}



