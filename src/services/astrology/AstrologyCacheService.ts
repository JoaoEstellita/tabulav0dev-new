import { doc, setDoc, getDoc, Timestamp } from 'firebase/firestore'
import { db } from '../../config/firebase'
import AsyncStorage from '@react-native-async-storage/async-storage'
import type { BirthData } from '../../screens/onboarding/BirthDataForm'

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
  cacheSource: 'prokerala' | 'fallback'
  userId: string
  birthDataHash: string // Para detectar mudanças nos dados de nascimento
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
  private readonly DATA_VERSION = '1.0'
  
  // Cache local (AsyncStorage) para acesso rápido
  private readonly LOCAL_CACHE_KEY = 'astrology_cache_'
  
  /**
   * Gera hash dos dados de nascimento para detectar mudanças
   */
  private generateBirthDataHash(birthData: BirthData): string {
    return btoa(`${birthData.birthDate}-${birthData.birthTime}-${birthData.birthLocation.latitude}-${birthData.birthLocation.longitude}`)
  }

  /**
   * Obtém a data atual no formato YYYY-MM-DD
   */
  private getTodayString(): string {
    return new Date().toISOString().split('T')[0]
  }

  /**
   * Verifica se o cache é válido e pode ser usado
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
      
      // Verificar se os dados de nascimento mudaram
      const currentHash = this.generateBirthDataHash(birthData)
      if (cache.birthDataHash !== currentHash) {
        console.log('🔄 Dados de nascimento mudaram, cache invalidado')
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
      
      // Pode fazer refresh se passou 6h E não atingiu limite diário
      const canRefreshByTime = hoursOld >= this.MIN_REFRESH_HOURS
      const canRefreshByLimit = requestsToday < this.MAX_DAILY_REQUESTS
      const canRefresh = canRefreshByTime && canRefreshByLimit
      
      // Calcular próximo refresh disponível
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
      console.error('❌ Erro ao verificar status do cache:', error)
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
   * Obtém dados do cache (Firestore + AsyncStorage)
   */
  async getCache(userId: string): Promise<AstrologyCache | null> {
    try {
      // Primeiro tenta cache local (mais rápido)
      const localCacheKey = `${this.LOCAL_CACHE_KEY}${userId}`
      const localCache = await AsyncStorage.getItem(localCacheKey)
      
      if (localCache) {
        const parsedCache = JSON.parse(localCache)
        // Converter timestamps de volta para Date
        parsedCache.lastUpdate = new Date(parsedCache.lastUpdate)
        parsedCache.expiresAt = new Date(parsedCache.expiresAt)
        
        console.log('📱 Cache local encontrado')
        return parsedCache
      }
      
      // Se não tem cache local, busca no Firestore
      console.log('☁️ Buscando cache no Firestore...')
      const cacheDoc = await getDoc(doc(db, 'users', userId, 'astrologyCache', 'data'))
      
      if (cacheDoc.exists()) {
        const data = cacheDoc.data()
        const cache: AstrologyCache = {
          ...data,
          lastUpdate: data.lastUpdate.toDate(),
          expiresAt: data.expiresAt.toDate()
        }
        
        // Salva no cache local para próxima vez
        await AsyncStorage.setItem(localCacheKey, JSON.stringify({
          ...cache,
          lastUpdate: cache.lastUpdate.toISOString(),
          expiresAt: cache.expiresAt.toISOString()
        }))
        
        console.log('✅ Cache do Firestore carregado e salvo localmente')
        return cache
      }
      
      console.log('❌ Nenhum cache encontrado')
      return null
    } catch (error) {
      console.error('❌ Erro ao obter cache:', error)
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
    source: 'prokerala' | 'fallback' = 'prokerala'
  ): Promise<void> {
    try {
      const now = new Date()
      const expiresAt = new Date(now.getTime() + (this.CACHE_DURATION_HOURS * 60 * 60 * 1000))
      const today = this.getTodayString()
      
      // Obter cache atual para preservar contador diário
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
        birthDataHash: this.generateBirthDataHash(birthData)
      }
      
      // Salvar no Firestore
      await setDoc(doc(db, 'users', userId, 'astrologyCache', 'data'), {
        ...cache,
        lastUpdate: Timestamp.fromDate(cache.lastUpdate),
        expiresAt: Timestamp.fromDate(cache.expiresAt)
      })
      
      // Salvar no cache local
      const localCacheKey = `${this.LOCAL_CACHE_KEY}${userId}`
      await AsyncStorage.setItem(localCacheKey, JSON.stringify({
        ...cache,
        lastUpdate: cache.lastUpdate.toISOString(),
        expiresAt: cache.expiresAt.toISOString()
      }))
      
      console.log(`💾 Cache salvo - Fonte: ${source}, Requests hoje: ${dailyRequestCount}/${this.MAX_DAILY_REQUESTS}`)
    } catch (error) {
      console.error('❌ Erro ao salvar cache:', error)
      throw error
    }
  }

  /**
   * Limpa o cache (útil para debugging ou mudanças importantes)
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
      
      console.log('🗑️ Cache limpo com sucesso')
    } catch (error) {
      console.error('❌ Erro ao limpar cache:', error)
    }
  }

  /**
   * Obtém estatísticas de uso para monitoramento
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
      console.error('❌ Erro ao obter estatísticas:', error)
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
   * Força uma atualização (ignora limites - para uso administrativo)
   */
  async forceRefresh(userId: string): Promise<void> {
    console.log('🔧 Forçando refresh do cache (modo administrativo)')
    await this.clearCache(userId)
  }
}

export default new AstrologyCacheService()