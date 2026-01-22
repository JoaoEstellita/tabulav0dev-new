import { doc, setDoc, getDoc, Timestamp } from 'firebase/firestore'
import { db } from '../../config/firebase'
import AsyncStorage from '@react-native-async-storage/async-storage'
import type { BirthData } from '../../screens/onboarding/BirthDataForm'
import { normalizeHouseSystem } from '../../astro/houseSystem'

// Interface para os dados em cache
export interface AstrologyCache {
  lastUpdate: Date
  expiresAt: Date
  dailyRequestCount: number
  lastRequestDate: string // YYYY-MM-DD
  planetPositions: any[]
  transitAspects: any[]
  calculatedData: {
    lifeAreas: any[]
    currentTransits: any[]
    dailyOverview: any
  }
  dataVersion: string
  cacheSource: 'prokerala' | 'fallback' | 'local'
  userId: string
  houseSystem?: string
  birthDataHash: string // Para detectar mudan+ºas nos dados de nascimento
}

export interface CacheStatus {
  isValid: boolean
  isExpired: boolean
  canRefresh: boolean
  hoursOld: number
  requestsToday: number
  maxRequests: number
  nextRefreshAvailable: Date | null
  cacheSource: string
  lastUpdate: Date | null
}

class AstrologyCacheService {
  private readonly CACHE_DURATION_HOURS = 12
  private readonly MIN_REFRESH_HOURS = 6
  private readonly MAX_DAILY_REQUESTS = 2
  private readonly DATA_VERSION = '1.3'
  
  // Cache local (AsyncStorage) para acesso r+ípido
  private readonly LOCAL_CACHE_KEY = 'astrology_cache_'
  
  private getCurrentHouseSystem(): string {
    return normalizeHouseSystem((globalThis as any).__userHouseSystem || 'placidus')
  }
  
  /**
   * Gera hash dos dados de nascimento para detectar mudan+ºas
   */
  private generateBirthDataHash(birthData: BirthData): string {
    const system = this.getCurrentHouseSystem()
    return btoa(`${birthData.birthDate}-${birthData.birthTime}-${birthData.birthLocation.latitude}-${birthData.birthLocation.longitude}-${system}`)
  }

  /**
   * Obt+®m a data atual no formato YYYY-MM-DD
   */
  private getTodayString(): string {
    return new Date().toISOString().split('T')[0]
  }

  /**
   * Verifica se o cache +® v+ílido e pode ser usado
   */
  async getCacheStatus(userId: string, birthData: BirthData): Promise<CacheStatus> {
    try {
      const cache = await this.getCache(userId)
      const now = new Date()
      const today = this.getTodayString()
      
      if (!cache) {
        return {
          isValid: false,
          isExpired: true,
          canRefresh: true,
          hoursOld: Infinity,
          requestsToday: 0,
          maxRequests: this.MAX_DAILY_REQUESTS,
          nextRefreshAvailable: null,
          cacheSource: 'none',
          lastUpdate: null
        }
      }
      
      if (cache.dataVersion !== this.DATA_VERSION) {
        console.log('Cache invalidado: versao de dados mudou')
        return {
          isValid: false,
          isExpired: true,
          canRefresh: true,
          hoursOld: Infinity,
          requestsToday: 0,
          maxRequests: this.MAX_DAILY_REQUESTS,
          nextRefreshAvailable: null,
          cacheSource: 'invalidated',
          lastUpdate: cache.lastUpdate
        }
      }
      // Verificar se os dados de nascimento mudaram
      const currentHash = this.generateBirthDataHash(birthData)
      if (cache.birthDataHash !== currentHash) {
        console.log('Cache invalidado: dados de nascimento mudaram')
        return {
          isValid: false,
          isExpired: true,
          canRefresh: true,
          hoursOld: Infinity,
          requestsToday: 0,
          maxRequests: this.MAX_DAILY_REQUESTS,
          nextRefreshAvailable: null,
          cacheSource: 'invalidated',
          lastUpdate: cache.lastUpdate
        }
      }

      const currentSystem = this.getCurrentHouseSystem()
      if (cache.houseSystem && cache.houseSystem !== currentSystem) {
        console.log('Cache invalidado: sistema de casas mudou')
        return {
          isValid: false,
          isExpired: true,
          canRefresh: true,
          hoursOld: Infinity,
          requestsToday: 0,
          maxRequests: this.MAX_DAILY_REQUESTS,
          nextRefreshAvailable: null,
          cacheSource: 'invalidated',
          lastUpdate: cache.lastUpdate
        }
      }

      const hoursOld = (now.getTime() - cache.lastUpdate.getTime()) / (1000 * 60 * 60)
      const isExpired = now > cache.expiresAt
      const isValid = !isExpired
      
      // Reset contador se mudou o dia
      let requestsToday = cache.dailyRequestCount
      if (cache.lastRequestDate !== today) {
        requestsToday = 0
      }
      
      // Pode fazer refresh se passou 6h E n+úo atingiu limite di+írio
      const canRefreshByTime = hoursOld >= this.MIN_REFRESH_HOURS
      const canRefreshByLimit = requestsToday < this.MAX_DAILY_REQUESTS
      const canRefresh = canRefreshByTime && canRefreshByLimit
      
      // Calcular pr+¦ximo refresh dispon+¡vel
      let nextRefreshAvailable: Date | null = null
      if (!canRefreshByTime) {
        nextRefreshAvailable = new Date(cache.lastUpdate.getTime() + (this.MIN_REFRESH_HOURS * 60 * 60 * 1000))
      } else if (!canRefreshByLimit) {
        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        tomorrow.setHours(0, 0, 0, 0)
        nextRefreshAvailable = tomorrow
      }
      
      return {
        isValid,
        isExpired,
        canRefresh,
        hoursOld: Math.round(hoursOld * 10) / 10, // 1 casa decimal
        requestsToday,
        maxRequests: this.MAX_DAILY_REQUESTS,
        nextRefreshAvailable,
        cacheSource: cache.cacheSource,
        lastUpdate: cache.lastUpdate
      }
    } catch (error) {
      console.error('ÔØî Erro ao verificar status do cache:', error)
      return {
        isValid: false,
        isExpired: true,
        canRefresh: true,
        hoursOld: Infinity,
        requestsToday: 0,
        maxRequests: this.MAX_DAILY_REQUESTS,
        nextRefreshAvailable: null,
        cacheSource: 'error',
        lastUpdate: null
      }
    }
  }

  /**
   * Obt+®m dados do cache (Firestore + AsyncStorage)
   */
  async getCache(userId: string): Promise<AstrologyCache | null> {
    try {
      // Primeiro tenta cache local (mais r+ípido)
      const localCacheKey = `${this.LOCAL_CACHE_KEY}${userId}`
      const localCache = await AsyncStorage.getItem(localCacheKey)
      
      if (localCache) {
        const parsedCache = JSON.parse(localCache)
        // Converter timestamps de volta para Date
        parsedCache.lastUpdate = new Date(parsedCache.lastUpdate)
        parsedCache.expiresAt = new Date(parsedCache.expiresAt)
        
        console.log('­ƒô¦ Cache local encontrado')
        return parsedCache
      }
      
      // Se n+úo tem cache local, busca no Firestore
      console.log('Ôÿü´©Å Buscando cache no Firestore...')
      const cacheDoc = await getDoc(doc(db, 'users', userId, 'astrologyCache', 'data'))
      
      if (cacheDoc.exists()) {
        const data = cacheDoc.data()
        const cache: AstrologyCache = {
          ...data,
          lastUpdate: data.lastUpdate.toDate(),
          expiresAt: data.expiresAt.toDate()
        }
        
        // Salva no cache local para pr+¦xima vez
        await AsyncStorage.setItem(localCacheKey, JSON.stringify({
          ...cache,
          lastUpdate: cache.lastUpdate.toISOString(),
          expiresAt: cache.expiresAt.toISOString()
        }))
        
        console.log('Ô£à Cache do Firestore carregado e salvo localmente')
        return cache
      }
      
      console.log('ÔØî Nenhum cache encontrado')
      return null
    } catch (error) {
      console.error('ÔØî Erro ao obter cache:', error)
      return null
    }
  }

  /**
   * Salva dados no cache (Firestore + AsyncStorage)
   */
  async saveCache(
    userId: string, 
    birthData: BirthData,
    planetPositions: any[], 
    transitAspects: any[], 
    calculatedData: any,
    source: 'prokerala' | 'fallback' | 'local' = 'prokerala'
  ): Promise<void> {
    try {
      const now = new Date()
      const expiresAt = new Date(now.getTime() + (this.CACHE_DURATION_HOURS * 60 * 60 * 1000))
      const today = this.getTodayString()
      
      // Obter cache atual para preservar contador di+írio
      const currentCache = await this.getCache(userId)
      let dailyRequestCount = 1
      
      if (currentCache && currentCache.lastRequestDate === today) {
        dailyRequestCount = currentCache.dailyRequestCount + 1
      }
      
      const cache: AstrologyCache = {
        lastUpdate: now,
        expiresAt,
        dailyRequestCount,
        lastRequestDate: today,
        planetPositions,
        transitAspects,
        calculatedData,
        dataVersion: this.DATA_VERSION,
        cacheSource: source,
        userId,
        birthDataHash: this.generateBirthDataHash(birthData),
        houseSystem: this.getCurrentHouseSystem()
      }
      
      // Salvar no Firestore - com valida+º+úo de undefined
      const firestoreData = {
        ...cache,
        lastUpdate: Timestamp.fromDate(cache.lastUpdate),
        expiresAt: Timestamp.fromDate(cache.expiresAt)
      }
      
      // Debug: verificar campos undefined RECURSIVAMENTE
      const findUndefinedFields = (obj, path = '') => {
        const undefinedPaths = []
        for (const [key, value] of Object.entries(obj)) {
          const currentPath = path ? `${path}.${key}` : key
          if (value === undefined) {
            undefinedPaths.push(currentPath)
          } else if (value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
            undefinedPaths.push(...findUndefinedFields(value, currentPath))
          } else if (Array.isArray(value)) {
            value.forEach((item, index) => {
              if (item === undefined) {
                undefinedPaths.push(`${currentPath}[${index}]`)
              } else if (item && typeof item === 'object') {
                undefinedPaths.push(...findUndefinedFields(item, `${currentPath}[${index}]`))
              }
            })
          }
        }
        return undefinedPaths
      }

      // Sanitizar: converter campos undefined para null para compat Firestore
      const sanitize = (obj: any): any => {
        if (obj === undefined) return null
        if (obj === null) return null
        if (Array.isArray(obj)) return obj.map(sanitize)
        if (obj && typeof obj === 'object') {
          const out: any = {}
          for (const [k, v] of Object.entries(obj)) {
            out[k] = sanitize(v as any)
          }
          return out
        }
        return obj
      }
      const firestoreDataSanitized = sanitize(firestoreData)

      const undefinedFields = findUndefinedFields(firestoreDataSanitized)
      
      if (undefinedFields.length > 0) {
        console.error('ÔØî Campos undefined detectados (recursivo):', undefinedFields)
        console.error('­ƒöì Estrutura completa:', JSON.stringify(firestoreData, null, 2))
        throw new Error(`Campos undefined encontrados: ${undefinedFields.join(', ')}`)
      }
      
      console.log('Ô£à Valida+º+úo passou - nenhum campo undefined encontrado')
      
      await setDoc(doc(db, 'users', userId, 'astrologyCache', 'data'), firestoreDataSanitized)
      
      // Salvar no cache local
      const localCacheKey = `${this.LOCAL_CACHE_KEY}${userId}`
      await AsyncStorage.setItem(localCacheKey, JSON.stringify({
        ...cache,
        lastUpdate: cache.lastUpdate.toISOString(),
        expiresAt: cache.expiresAt.toISOString()
      }))
      
      console.log(`­ƒÆ¥ Cache salvo - Fonte: ${source}, Requests hoje: ${dailyRequestCount}/${this.MAX_DAILY_REQUESTS}`)
    } catch (error) {
      console.warn('ÔÜá´©Å N+úo foi poss+¡vel salvar cache no Firestore, salvando apenas localmente:', error)
      // Ainda salva no cache local
      const localCacheKey = `${this.LOCAL_CACHE_KEY}${userId}`
      await AsyncStorage.setItem(localCacheKey, JSON.stringify({
        lastUpdate: new Date().toISOString(),
        expiresAt: new Date(Date.now() + (this.CACHE_DURATION_HOURS * 60 * 60 * 1000)).toISOString(),
        dailyRequestCount: 1,
        lastRequestDate: this.getTodayString(),
        planetPositions: planetPositions || [],
        transitAspects: transitAspects || [],
        calculatedData: calculatedData || {},
        dataVersion: this.DATA_VERSION,
        cacheSource: source,
        userId,
        birthDataHash: this.generateBirthDataHash(birthData),
        houseSystem: this.getCurrentHouseSystem()
      }))
    }
  }

  /**
   * Limpa o cache (+¦til para debugging ou mudan+ºas importantes)
   */
  async clearCache(userId: string): Promise<void> {
    try {
      // Limpar cache local
      const localCacheKey = `${this.LOCAL_CACHE_KEY}${userId}`
      await AsyncStorage.removeItem(localCacheKey)
      
      // Limpar cache do Firestore
      await setDoc(doc(db, 'users', userId, 'astrologyCache', 'data'), {
        cleared: true,
        clearedAt: Timestamp.now()
      })
      
      console.log('­ƒùæ´©Å Cache limpo com sucesso')
    } catch (error) {
      console.error('ÔØî Erro ao limpar cache:', error)
    }
  }

  /**
   * Obt+®m estat+¡sticas de uso para monitoramento
   */
  async getCacheStats(userId: string): Promise<{
    hasCache: boolean
    cacheAge: number
    requestsToday: number
    cacheSource: string
    dataVersion: string
  }> {
    try {
      const cache = await this.getCache(userId)
      
      if (!cache) {
        return {
          hasCache: false,
          cacheAge: 0,
          requestsToday: 0,
          cacheSource: 'none',
          dataVersion: 'none'
        }
      }
      
      const ageHours = (new Date().getTime() - cache.lastUpdate.getTime()) / (1000 * 60 * 60)
      const today = this.getTodayString()
      const requestsToday = cache.lastRequestDate === today ? cache.dailyRequestCount : 0
      
      return {
        hasCache: true,
        cacheAge: Math.round(ageHours * 10) / 10,
        requestsToday,
        cacheSource: cache.cacheSource,
        dataVersion: cache.dataVersion
      }
    } catch (error) {
      console.error('ÔØî Erro ao obter estat+¡sticas:', error)
      return {
        hasCache: false,
        cacheAge: 0,
        requestsToday: 0,
        cacheSource: 'error',
        dataVersion: 'error'
      }
    }
  }

  /**
   * For+ºa uma atualiza+º+úo (ignora limites - para uso administrativo)
   */
  async forceRefresh(userId: string): Promise<void> {
    console.log('­ƒöº For+ºando refresh do cache (modo administrativo)')
    await this.clearCache(userId)
  }
}

export default new AstrologyCacheService()





