/**
 * 🚀 LOCAL ASTROLOGY SERVICE 🚀
 * 
 * Serviço que substitui completamente as APIs externas
 * Usa o RealAstrologyEngine para cálculos locais precisos
 * 
 * BENEFÍCIOS:
 * - Performance instantânea
 * - Dados 100% reais
 * - Sem dependência de APIs externas
 * - Sem limites de requisições
 * - Custo zero
 */

import RealAstrologyEngine, { RealAstrologyData } from './RealAstrologyEngine'
import { publishAstrologyData } from '../../context/AstrologyDataProvider'
import { useUserSettings } from '../../hooks/useUserSettings'
import type { BirthData } from '../../screens/onboarding/BirthDataForm'
import AstrologyCacheService from './AstrologyCacheService'

export interface LocalTransitData {
  currentTransits: RealAstrologyData
  lifeAreas: {
    [area: string]: {
      percentage: number
      status: 'excelente' | 'bom' | 'neutro' | 'desafiador' | 'crítico'
      influences: string[]
      mainPlanets: string[]
    }
  }
  dailyOverview: {
    bestArea: string
    challengingArea: string
    generalTrend: string
    keyAspects: string[]
    message?: string
    overall?: number
    masterAspects?: Array<{ text: string; strength: number }>
    // Índice Coletivo
    collectivePositive?: number
    collectiveNegative?: number
    collectiveKeyAspects?: string[]
    collectiveKeyAspectsRich?: Array<{ planet1: string; planet2: string; type: string; strength: number; orb?: number; isApplying?: boolean }>
    lunarPhase?: { name: 'Nova' | 'Crescente' | 'Cheia' | 'Minguante'; waxing: boolean; elongation: number }
    // Campos novos para apresentação
    collectiveClimatePercent?: number
    lunarPhasePublic?: { name: string; emoji: string }
    weeklySnapshot?: { key: string, keyAspects: string[] }
    monthlySnapshot?: { key: string, keyAspects: string[] }
    // Listas pessoais agregadas por período (heurística baseada em duração)
    weeklyPersonal?: string[]
    monthlyPersonal?: string[]
    // Lista completa de trânsitos pessoais de hoje (sem porcentagem por item)
    personalToday?: string[]
    // Versões ricas com janela para navegação e exibição de datas
    personalTodayRich?: Array<{ transitPlanet: string; natalPlanet: string; type: string; window?: { start?: string; exact?: string; end?: string; days?: number } }>
    weeklyPersonalRich?: Array<{ transitPlanet: string; natalPlanet: string; type: string; window?: { start?: string; exact?: string; end?: string; days?: number } }>
    monthlyPersonalRich?: Array<{ transitPlanet: string; natalPlanet: string; type: string; window?: { start?: string; exact?: string; end?: string; days?: number } }>
  }
  warnings: string[]
}

export interface CacheStatus {
  isValid: boolean
  hoursOld: number
  requestsToday: number
  maxRequests: number
  canRefresh: boolean
  cacheSource: 'local' | 'firebase' | 'none'
}

export class LocalAstrologyService {
  
  /**
   * Obtém dados astrológicos usando cálculos LOCAIS
   * Substitui completamente as APIs externas
   */
  static async getCurrentTransits(
    birthData: BirthData, 
    userId: string, 
    forceRefresh: boolean = false
  ): Promise<{ data: LocalTransitData, cacheStatus: CacheStatus }> {
    try {
      console.log('🔮 Iniciando cálculos astrológicos LOCAIS...')
      
      // 1. Verificar cache primeiro (se não for refresh forçado)
      if (!forceRefresh) {
        const cachedData = await this.getCachedData(userId)
        if (cachedData) {
          console.log('✅ Usando dados do cache local')
          return cachedData
        }
      }

      // 2. Calcular dados REAIS usando engine local
      console.log('🔬 Calculando dados astrológicos REAIS localmente...')
      // Ler sistema de casas persistido (fallback placidus)
      const houseSystem = (globalThis as any).__userHouseSystem || 'placidus'

      // Determinar localização atual para casas do momento
      let currentLat = birthData.birthLocation.latitude
      let currentLon = birthData.birthLocation.longitude
      try {
        const userProfile = await (await import('../firebase/UserService')).default.getUserProfile(userId)
        const wantsShare = userProfile?.preferences?.privacy?.showStatusToGroups === true
        if (wantsShare && typeof navigator !== 'undefined' && navigator.geolocation) {
          const coords: { latitude: number, longitude: number } = await new Promise((resolve, reject) => {
            const id = navigator.geolocation.getCurrentPosition(
              pos => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
              err => reject(err),
              { enableHighAccuracy: true, timeout: 5000, maximumAge: 60000 }
            )
          })
          if (Number.isFinite(coords.latitude) && Number.isFinite(coords.longitude)) {
            currentLat = coords.latitude
            currentLon = coords.longitude
          }
        }
      } catch {}

      const realData = await RealAstrologyEngine.calculateRealAstrology(
        birthData.birthDate,
        birthData.birthTime,
        currentLat,
        currentLon,
        undefined,
        { houseSystem, natalLat: birthData.birthLocation.latitude, natalLon: birthData.birthLocation.longitude }
      )

      // Se perfil do usuário já tem cache de natal (ASC/cúspides), podemos substituir casas natais do bundle para estabilidade
      try {
        const userProfile = await (await import('../firebase/UserService')).default.getUserProfile(userId)
        if (userProfile?.natalAscDeg && Array.isArray(userProfile?.natalCusps)) {
          ;(realData as any).natal = (realData as any).natal || {}
          ;(realData as any).natal.houses = {
            ascendant: userProfile.natalAscDeg,
            midheaven: userProfile.natalMcDeg || realData.midheaven,
            cusps: userProfile.natalCusps,
            approximate: !!userProfile.natalApproximate,
            system: (userProfile.natalSystem || houseSystem)
          }
        }
      } catch {}

      // Publicar para Provider (e manter compat por enquanto)
      publishAstrologyData(realData)

      // 3. Processar dados para formato do app
      console.log('🔍 DEBUG - realData recebido:', {
        timestamp: realData.timestamp,
        planetsCount: realData.planets.length,
        aspectsCount: realData.aspects.length,
        housesCount: realData.houses.length,
        lifeAreasKeys: Object.keys(realData.lifeAreas),
        ascendant: realData.ascendant,
        midheaven: realData.midheaven
      })
      
      const processedData = this.processRealData(realData, birthData)
      
      console.log('🔍 DEBUG - processedData:', {
        lifeAreasKeys: Object.keys(processedData.lifeAreas),
        lifeAreasCount: Object.keys(processedData.lifeAreas).length,
        sample: Object.entries(processedData.lifeAreas)[0],
        currentTransitsType: typeof processedData.currentTransits,
        currentTransitsKeys: processedData.currentTransits ? Object.keys(processedData.currentTransits) : 'null',
        planetsCount: processedData.currentTransits?.planets?.length || 0,
        warningsType: typeof processedData.warnings,
        warningsLength: processedData.warnings?.length || 0
      })

      // 4. Salvar no cache
      await this.saveToCache(userId, birthData, realData, processedData)

      // 5. Status do cache
      const cacheStatus: CacheStatus = {
        isValid: true,
        hoursOld: 0,
        requestsToday: 1,
        maxRequests: 999, // Sem limite para cálculos locais!
        canRefresh: true,
        cacheSource: 'local'
      }

      console.log('🎯 Cálculos astrológicos LOCAIS concluídos com sucesso!')
      
      return {
        data: processedData,
        cacheStatus
      }

    } catch (error) {
      console.error('❌ Erro nos cálculos astrológicos locais:', error)
      const errorMessage = error instanceof Error ? error.message : String(error)
      throw new Error(`Falha nos cálculos locais: ${errorMessage}`)
    }
  }

  /**
   * Processa dados reais para formato do app
   */
  private static processRealData(realData: RealAstrologyData, birthData: BirthData): LocalTransitData {
    // Analisar áreas da vida
    const lifeAreas = realData.lifeAreas

    // Mapear áreas para o formato esperado pelo LifeAreaCard
    const mappedLifeAreas: Record<string, any> = {}
    
    Object.entries(lifeAreas).forEach(([areaName, areaData]) => {
      // Converter percentage para status e adicionar propriedades necessárias
      mappedLifeAreas[areaName] = {
        name: areaName,
        status: areaData.percentage, // ✅ CONVERTER percentage para status
        trend: areaData.percentage >= 70 ? 'positive' : 
               areaData.percentage >= 40 ? 'stable' : 'negative',
        description: areaData.influences?.join(' • ') || 'Área da vida',
        criticalLevel: areaData.percentage < 25,
        influences: areaData.influences || [],
        mainPlanets: areaData.mainPlanets || []
      }
    })

    // Encontrar melhor e pior área
    const areas = Object.entries(lifeAreas)
    const bestArea = areas.reduce((best, current) => 
      current[1].percentage > best[1].percentage ? current : best
    )[0]
    
    const challengingArea = areas.reduce((worst, current) => 
      current[1].percentage < worst[1].percentage ? current : worst
    )[0]

    // Analisar tendência geral
    const averageScore = areas.reduce((sum, [_, area]) => sum + area.percentage, 0) / areas.length
    const generalTrend = averageScore >= 70 ? 'Período muito favorável' :
                        averageScore >= 55 ? 'Período equilibrado' :
                        averageScore >= 40 ? 'Período de desafios moderados' :
                        'Período que requer cautela'

    // Aspectos-chave (T→T) do dia: filtrar pares triviais (planeta consigo mesmo) e pegar os mais fortes
    const keyAspects = realData.aspects
      .filter(aspect => aspect.planet1 !== aspect.planet2)
      .filter(aspect => aspect.strength > 70)
      .slice(0, 3)
      .map(aspect => `${aspect.planet1} ${aspect.type} ${aspect.planet2}`)

    // Índice coletivo (quando disponível)
    const collectivePositive = realData.collective?.positive
    const collectiveNegative = realData.collective?.negative
    // Índice único de clima coletivo (0..100; 50 neutro)
    const collectiveClimatePercent = (() => {
      const pos = collectivePositive ?? 0
      const neg = collectiveNegative ?? 0
      const netScaled = Math.round(Math.max(0, Math.min(100, (pos - neg + 100) / 2)))
      return netScaled
    })()
    // Lista completa dos coletivos do dia (sem limitar a 5 aqui; a UI controla exibição)
    const collectiveKeyAspectsRaw = (realData.collective?.keyAspects || [])
      .filter(a => a.planet1 !== a.planet2)
    const collectiveKeyAspects = collectiveKeyAspectsRaw.map(a => `${a.planet1} ${a.type} ${a.planet2}`)
    const lunarPhase = realData.collective?.lunarPhase
    const lunarPhasePublic = (() => {
      if (!lunarPhase) return undefined
      const e = lunarPhase.elongation
      const waxing = lunarPhase.waxing
      type Stage = { name: string, emoji: string }
      const stage = (): Stage => {
        if (e < 11.25) return { name: 'Nova', emoji: '🌑' }
        if (e < 33.75) return { name: waxing ? 'Crescente' : 'Balsâmica', emoji: waxing ? '🌒' : '🌘' }
        if (e < 56.25) return { name: waxing ? 'Crescente' : 'Minguante', emoji: waxing ? '🌒' : '🌘' }
        if (e < 78.75) return { name: waxing ? 'Quarto Crescente' : 'Quarto Minguante', emoji: waxing ? '🌓' : '🌗' }
        if (e < 101.25) return { name: waxing ? 'Gibosa Crescente' : 'Gibosa Minguante', emoji: waxing ? '🌔' : '🌖' }
        if (e < 123.75) return { name: waxing ? 'Gibosa Crescente' : 'Gibosa Minguante', emoji: waxing ? '🌔' : '🌖' }
        if (e < 146.25) return { name: waxing ? 'Cheia (Ápice)' : 'Cheia (Ápice)', emoji: '🌕' }
        if (e < 168.75) return { name: 'Gibosa Minguante', emoji: '🌖' }
        return { name: 'Quarto Minguante', emoji: '🌗' }
      }
      return stage()
    })()
    const weeklySnapshot = realData.collectiveWeekly ? {
      key: realData.collectiveWeekly.key,
      keyAspects: (realData.collectiveWeekly.keyAspects || [])
        .filter(a => a.planet1 !== a.planet2)
        .slice(0,5)
        .map(a => `${a.planet1} ${a.type} ${a.planet2}`)
    } : undefined
    const monthlySnapshot = realData.collectiveMonthly ? {
      key: realData.collectiveMonthly.key,
      keyAspects: (realData.collectiveMonthly.keyAspects || [])
        .filter(a => a.planet1 !== a.planet2)
        .slice(0,5)
        .map(a => `${a.planet1} ${a.type} ${a.planet2}`)
    } : undefined

    // Modulação leve do índice coletivo sobre o overall pessoal
    const overallModulated = (() => {
      const pos = collectivePositive ?? 0
      const neg = collectiveNegative ?? 0
      const net = pos - neg // -100..+100
      const shifted = averageScore + net * 0.15 // mistura 15%
      return Math.round(Math.max(0, Math.min(100, shifted)))
    })()

    // Ranking de aspectos‑mestres (heurística): T→N fortes
    const personalTransitsAll = (realData.transits?.personal || [])
    const masterAspects = personalTransitsAll
      .filter(t => t.isMaster)
      .sort((a,b)=>b.strength-a.strength)
      .slice(0,5)
      .map(t => ({ text: `${t.transitPlanet} ${t.type} ${t.natalPlanet} (${t.strength}%)`, strength: t.strength }))

    // Listas pessoais para Semana/Mês (heurística baseada em duração/força)
    const weeklyPersonal = personalTransitsAll
      .filter(t => t.durationClass !== 'curto')
      .map(t => `${t.transitPlanet} ${t.type} ${t.natalPlanet}`)
    const intersects = (w: any, start: Date, end: Date): boolean => {
      if (!w || !w.start || !w.end) return false
      const ws = new Date(w.start).getTime()
      const we = new Date(w.end).getTime()
      return ws <= end.getTime() && we >= start.getTime()
    }
    const getWeekRange = (key?: string): { start: Date, end: Date } => {
      const now = new Date()
      if (!key) {
        const day = now.getDay()
        const diffToMonday = (day === 0 ? -6 : 1 - day)
        const start = new Date(now)
        start.setHours(0,0,0,0)
        start.setDate(start.getDate() + diffToMonday)
        const end = new Date(start)
        end.setDate(start.getDate() + 6)
        end.setHours(23,59,59,999)
        return { start, end }
      }
      const m = key.match(/^(\d{4})-W(\d{2})$/)
      if (m) {
        const year = parseInt(m[1],10)
        const week = parseInt(m[2],10)
        const jan4 = new Date(Date.UTC(year,0,4))
        const jan4Day = jan4.getUTCDay() || 7
        const monday = new Date(jan4)
        monday.setUTCDate(jan4.getUTCDate() - (jan4Day - 1) + (week - 1) * 7)
        const start = new Date(monday)
        const end = new Date(start)
        end.setUTCDate(start.getUTCDate() + 6)
        return { start, end }
      }
      return getWeekRange(undefined)
    }
    const getMonthRange = (key?: string): { start: Date, end: Date } => {
      const now = new Date()
      if (!key) {
        const start = new Date(now.getFullYear(), now.getMonth(), 1)
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
        end.setHours(23,59,59,999)
        return { start, end }
      }
      const m = key.match(/^(\d{4})-(\d{2})$/)
      if (m) {
        const year = parseInt(m[1],10)
        const month = parseInt(m[2],10) - 1
        const start = new Date(year, month, 1)
        const end = new Date(year, month + 1, 0)
        end.setHours(23,59,59,999)
        return { start, end }
      }
      return getMonthRange(undefined)
    }

    const weekRange = getWeekRange(realData.collectiveWeekly?.key)
    const monthRange = getMonthRange(realData.collectiveMonthly?.key)

    // Listas Semana/Mês Pessoal por interseção real de janelas
    const weeklyList = personalTransitsAll
      .filter(t => intersects((t as any).window, weekRange.start, weekRange.end))
    const monthlyList = personalTransitsAll
      .filter(t => intersects((t as any).window, monthRange.start, monthRange.end))
    // Strings simples para compatibilidade com UI legada
    const weeklyPersonalList = weeklyList.map(t => `${t.transitPlanet} ${t.type} ${t.natalPlanet}`)
    const monthlyPersonalList = monthlyList.map(t => `${t.transitPlanet} ${t.type} ${t.natalPlanet}`)

    const dailyOverview = {
      bestArea,
      challengingArea,
      generalTrend,
      keyAspects,
      overall: overallModulated,
      message: `${generalTrend}. Destaque para ${bestArea} e atenção em ${challengingArea}.`,
      masterAspects,
      collectivePositive,
      collectiveNegative,
      collectiveClimatePercent,
      collectiveKeyAspects,
      collectiveKeyAspectsRich: collectiveKeyAspectsRaw,
      lunarPhase,
      lunarPhasePublic,
      weeklySnapshot,
      monthlySnapshot,
      weeklyPersonal: weeklyPersonalList,
      monthlyPersonal: monthlyPersonalList,
      personalToday: personalTransitsAll.map(t => `${t.transitPlanet} ${t.type} ${t.natalPlanet}`),
      personalTodayRich: personalTransitsAll.map((t:any)=> ({
        transitPlanet: t.transitPlanet,
        natalPlanet: t.natalPlanet,
        type: t.type,
        house: t.natalHouseImpacted || undefined,
        window: t.window ? { ...t.window, days: (t.windowDays||undefined) } : undefined,
      })),
      weeklyPersonalRich: weeklyList.map((t:any)=> ({
        transitPlanet: t.transitPlanet,
        natalPlanet: t.natalPlanet,
        type: t.type,
        window: t.window ? { ...t.window, days: (t.windowDays||undefined) } : undefined,
      })),
      monthlyPersonalRich: monthlyList.map((t:any)=> ({
        transitPlanet: t.transitPlanet,
        natalPlanet: t.natalPlanet,
        type: t.type,
        window: t.window ? { ...t.window, days: (t.windowDays||undefined) } : undefined,
      })),
    }

    return {
      currentTransits: realData, // RealAstrologyData já tem a estrutura correta!
      lifeAreas: mappedLifeAreas, // ✅ USAR AREAS MAPEADAS
      dailyOverview,
      warnings: [] // Sem warnings para cálculos locais!
    } as LocalTransitData
  }

  /**
   * Obtém dados do cache (local ou Firebase)
   */
  private static async getCachedData(userId: string): Promise<{ data: LocalTransitData, cacheStatus: CacheStatus } | null> {
    try {
      // Tentar cache do Firebase primeiro
      const cache = await AstrologyCacheService.getCache(userId)
      
      if (cache && cache.calculatedData) {
        const hoursOld = (Date.now() - new Date(cache.lastUpdate).getTime()) / (1000 * 60 * 60)
        
        // Cache válido por 12 horas
        if (hoursOld < 12) {
          const cacheStatus: CacheStatus = {
            isValid: true,
            hoursOld,
            requestsToday: 0, // Não temos essa informação no cache
            maxRequests: 999,
            canRefresh: hoursOld > 6, // Pode refreshar após 6 horas
            cacheSource: 'firebase'
          }

          return {
            data: {
              ...cache.calculatedData,
              warnings: [] // Adicionar warnings faltante
            } as unknown as LocalTransitData,
            cacheStatus
          }
        }
      }

      return null
    } catch (error) {
      console.log('ℹ️ Cache não disponível, calculando dados frescos...')
      return null
    }
  }

  /**
   * Salva dados no cache
   */
  private static async saveToCache(
    userId: string,
    birthData: BirthData,
    realData: RealAstrologyData,
    processedData: LocalTransitData
  ): Promise<void> {
    try {
      // Verificar e limpar dados undefined/null antes de salvar
      const cleanPlanets = (realData.planets || []).map(planet => ({
        ...planet,
        longitude: planet.longitude || 0,
        latitude: planet.latitude || 0,
        distance: planet.distance || 0,
        speed: planet.speed || 0,
        sign: planet.sign || 'N/A',
        degree: planet.degree || 0,
        house: planet.house || 1,
        isRetrograde: Boolean(planet.isRetrograde)
      }))
      
      const cleanAspects = realData.aspects || []
      
      // Limpar natalPlanets também (NOVO!)
      const cleanNatalPlanets = (realData.natalPlanets || []).map(planet => ({
        name: planet.name || 'Unknown',
        longitude: planet.longitude || 0,
        latitude: planet.latitude || 0,
        distance: planet.distance || 1.0, // ✅ PROTEÇÃO CRÍTICA
        speed: planet.speed || 0,
        sign: planet.sign || 'Áries',
        degree: planet.degree || 0,
        house: planet.house || 1,
        isRetrograde: Boolean(planet.isRetrograde)
      }))
      
      // Limpar dados processados também
      const deepSanitize = (obj: any): any => {
        if (obj === undefined) return null
        if (obj === null) return null
        if (Array.isArray(obj)) return obj.map(deepSanitize)
        if (obj && typeof obj === 'object') {
          const out: any = {}
          for (const [k, v] of Object.entries(obj)) out[k] = deepSanitize(v as any)
          return out
        }
        return obj
      }

      const cleanProcessedData = deepSanitize({
        ...processedData,
        currentTransits: {
          ...processedData.currentTransits,
          planets: cleanPlanets, // Usar planetas limpos
          natalPlanets: cleanNatalPlanets, // ✅ NATAL PLANETS LIMPOS
          aspects: cleanAspects,
          houses: processedData.currentTransits?.houses || [],
          ascendant: processedData.currentTransits?.ascendant || 0,
          midheaven: processedData.currentTransits?.midheaven || 0,
          natalAscendant: processedData.currentTransits?.natalAscendant || 0, // ✅ NATAL ASCENDANT
          natalMidheaven: processedData.currentTransits?.natalMidheaven || 0, // ✅ NATAL MIDHEAVEN
          lifeAreas: processedData.currentTransits?.lifeAreas || {},
          planetComparisons: processedData.currentTransits?.planetComparisons || [],
          chartSummary: processedData.currentTransits?.chartSummary || {},
          houseAspects: processedData.currentTransits?.houseAspects || []
        },
        lifeAreas: processedData.lifeAreas || {},
        dailyOverview: processedData.dailyOverview || {
          bestArea: 'N/A',
          challengingArea: 'N/A', 
          generalTrend: 'Analisando...',
          keyAspects: []
        },
        warnings: processedData.warnings || []
      })
      
      console.log('🔍 DEBUG - Salvando cache:', {
        userId: userId ? 'presente' : 'AUSENTE',
        planetsCount: cleanPlanets.length,
        aspectsCount: cleanAspects.length,
        processedDataKeys: Object.keys(cleanProcessedData),
        birthDataKeys: Object.keys(birthData)
      })

      await AstrologyCacheService.saveCache(
        userId,
        birthData,
        cleanPlanets, // Raw planet data (verificado)
        cleanAspects, // Raw aspects data (verificado)
        cleanProcessedData, // Processed data (verificado)
        'local' // Source
      )
      console.log('✅ Dados salvos no cache')
    } catch (error) {
      console.log('⚠️ Não foi possível salvar no cache:', error)
      console.log('⚠️ Mas cálculos funcionam normalmente')
    }
  }

  /**
   * Calcula dados para TODOS os usuários (para notificações automáticas)
   */
  static async calculateDailyDataForAllUsers(): Promise<Map<string, LocalTransitData>> {
    console.log('🌅 Iniciando cálculos diários para todos os usuários...')
    
    const results = new Map<string, LocalTransitData>()
    
    try {
      // Aqui você buscaria todos os usuários do Firebase
      // Por enquanto, retornamos um mapa vazio
      // Em produção, isso seria executado como uma função serverless diária
      
      console.log('✅ Cálculos diários concluídos')
      return results
      
    } catch (error) {
      console.error('❌ Erro nos cálculos diários:', error)
      return results
    }
  }

  /**
   * Verifica se precisa enviar notificações críticas
   */
  static shouldSendCriticalAlert(data: LocalTransitData): boolean {
    // Verificar se alguma área está crítica
    const criticalAreas = Object.entries(data.lifeAreas).filter(
      ([_, area]) => area.status === 'crítico'
    )

    // Verificar aspectos muito desafiadores
    const challengingAspects = data.currentTransits.aspects.filter(
      aspect => aspect.type === 'quadratura' || aspect.type === 'oposição'
    ).filter(aspect => aspect.strength > 80)

    return criticalAreas.length > 0 || challengingAspects.length > 2
  }

  /**
   * Gera mensagem de alerta personalizada
   */
  static generateAlertMessage(data: LocalTransitData): string {
    const { bestArea, challengingArea, generalTrend } = data.dailyOverview
    
    return `🌟 Hoje: ${generalTrend}. ` +
           `💫 Área favorável: ${bestArea}. ` +
           `⚠️ Atenção para: ${challengingArea}.`
  }
}

export default LocalAstrologyService