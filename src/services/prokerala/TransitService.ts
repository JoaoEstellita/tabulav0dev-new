import { normalizePlanet, normalizeSign, normalizeHouse } from '../../astro/normalize';
import axios from 'axios'
import AstrologyCalculator, { AstrologyData } from '../astrology/AstrologyCalculator'
import AstrologyCacheService, { CacheStatus } from '../astrology/AstrologyCacheService'

// Backend seguro (seguindo diretriz de segurança da Prokerala)
const BACKEND_URL = 'https://tabulav0dev-backend.vercel.app'
import type { BirthData } from '../../screens/onboarding/BirthDataForm'

// Interfaces baseadas na documentação real da Prokerala
interface ProkeralaRequest {
  datetime: string  // ISO format YYYY-MM-DDTHH:mm:ss
  coordinates: string  // "latitude,longitude"
  ayanamsa: number  // 1 for Lahiri
  birth_datetime: string
  birth_coordinates: string
  transit_datetime: string
  transit_coordinates: string
}

interface PlanetPosition {
  name: string
  longitude: number
  speed: number
  sign: string
  house: number
}

interface TransitAspect {
  planet1: string
  planet2: string
  aspect: string
  orb: number
  applying: boolean
}

export interface LifeArea {
  name: string
  status: number  // 0-100
  trend: 'positive' | 'negative' | 'stable'
  description: string
  criticalLevel: boolean
  processSynthesis?: string
  highlights?: Array<{
    headline?: string
    summary?: string
    tone?: string
    experience?: string
    salience?: number
    topFactorIds?: string[]
  }>
}

interface TransitData {
  currentTransits: PlanetPosition[]
  lifeAreas: LifeArea[]
  dailyOverview: {
    overall: number
    message: string
    bestArea: string
    challengingArea: string
  }
  warnings: string[]
}

class TransitService {
  // Usando backend seguro conforme diretriz de segurança da Prokerala
  private readonly backendUrl = BACKEND_URL

  // Log de status das credenciais
  private logCredentialStatus(systemStatus: any) {
    console.log('🔍 Status das Credenciais Prokerala:')
    console.log(`📊 Disponíveis: ${systemStatus.availableCredentials}/${systemStatus.totalCredentials}`)
    console.log(`🚫 Com limite esgotado: ${systemStatus.credentialsWithLimits}`)
    console.log(`❌ Com erros: ${systemStatus.credentialsWithErrors}`)
    
    if (systemStatus.credentials) {
      systemStatus.credentials.forEach((cred: any) => {
        const status = cred.hasCredits ? '✅' : '🚫'
        const error = cred.lastError ? ` (${cred.lastError})` : ''
        console.log(`${status} Credencial ${cred.id}: ${cred.clientId}${error}`)
      })
    }
    
    if (systemStatus.availableCredentials === 0) {
      console.warn('⚠️ ATENÇÃO: Todas as credenciais Prokerala estão indisponíveis!')
    }
  }

  async getCurrentTransits(birthData: BirthData, userId: string, forceRefresh: boolean = false): Promise<{
    data: TransitData
    cacheStatus: CacheStatus
  }> {
    try {
      console.log('🔮 Iniciando busca de trânsitos com sistema de cache...')
      
      // 1. Verificar status do cache
      const cacheStatus = await AstrologyCacheService.getCacheStatus(userId, birthData)
      console.log('📊 Status do cache:', {
        isValid: cacheStatus.isValid,
        hoursOld: cacheStatus.hoursOld,
        requestsToday: `${cacheStatus.requestsToday}/${cacheStatus.maxRequests}`,
        canRefresh: cacheStatus.canRefresh,
        source: cacheStatus.cacheSource
      })

      // 2. Se cache é válido e não é refresh forçado, usar cache
      if (cacheStatus.isValid && !forceRefresh) {
        console.log(`✅ Usando dados do cache (${cacheStatus.hoursOld}h atrás)`)
        const cache = await AstrologyCacheService.getCache(userId)
        if (cache?.calculatedData) {
          return {
            data: {
              currentTransits: cache.calculatedData.currentTransits,
              lifeAreas: cache.calculatedData.lifeAreas,
              dailyOverview: cache.calculatedData.dailyOverview,
              warnings: []
            },
            cacheStatus
          }
        }
      }

      // 3. Se não pode fazer refresh, usar cache expirado + aviso
      if (!cacheStatus.canRefresh && !forceRefresh) {
        console.log('🚫 Limite de requisições atingido, usando cache expirado')
        const cache = await AstrologyCacheService.getCache(userId)
        if (cache?.calculatedData) {
          return {
            data: {
              currentTransits: cache.calculatedData.currentTransits,
              lifeAreas: cache.calculatedData.lifeAreas,
              dailyOverview: cache.calculatedData.dailyOverview,
              warnings: [`Dados antigos (${cacheStatus.hoursOld}h). Limite diário atingido.`]
            },
            cacheStatus
          }
        }
      }

      // 4. Buscar dados reais da API
      console.log('🌐 Buscando dados atualizados da API Prokerala...')
      const [planetPositions, transitAspects] = await Promise.allSettled([
        this.fetchPlanetPositions(birthData),
        this.fetchTransitAspects(birthData)
      ])

      console.log('📊 Resultados da API:', {
        planets: planetPositions.status,
        aspects: transitAspects.status
      })

      // 5. Processar dados se obtidos com sucesso
      if (planetPositions.status === 'fulfilled' && transitAspects.status === 'fulfilled') {
        console.log('✅ Dados planetários e aspectos obtidos com sucesso!')
        
        // Combinar dados para processamento
        const combinedData = {
          planet_position: planetPositions.value,
          transit_aspect: transitAspects.value
        }
        
        const processedData = this.processRealData(combinedData, birthData)
        
        // 6. Salvar no cache
        await AstrologyCacheService.saveCache(
          userId,
          birthData,
          planetPositions.value,
          transitAspects.value,
          processedData,
          'prokerala'
        )
        
        // Atualizar status do cache
        const newCacheStatus = await AstrologyCacheService.getCacheStatus(userId, birthData)
        
        return {
          data: processedData,
          cacheStatus: newCacheStatus
        }
      }

      // 7. Se API falhou, tentar usar cache antigo
      console.error('❌ Falha na API, tentando usar cache antigo...')
      const fallbackCache = await AstrologyCacheService.getCache(userId)
      if (fallbackCache?.calculatedData) {
        console.log('🔄 Usando cache antigo devido a falha na API')
        return {
          data: {
            currentTransits: fallbackCache.calculatedData.currentTransits,
            lifeAreas: fallbackCache.calculatedData.lifeAreas,
            dailyOverview: fallbackCache.calculatedData.dailyOverview,
            warnings: ['Falha na atualização. Usando dados anteriores.']
          },
          cacheStatus
        }
      }

      // 8. Sem cache e sem API - erro total
      throw new Error('Não foi possível obter dados astrológicos. Sem cache e API indisponível.')
      
    } catch (error) {
      console.error('❌ Erro crítico no sistema de trânsitos:', error)
      
      // Último recurso: tentar cache antigo
      const emergencyCache = await AstrologyCacheService.getCache(userId)
      if (emergencyCache?.calculatedData) {
        const emergencyStatus = await AstrologyCacheService.getCacheStatus(userId, birthData)
        return {
          data: {
            currentTransits: emergencyCache.calculatedData.currentTransits,
            lifeAreas: emergencyCache.calculatedData.lifeAreas,
            dailyOverview: emergencyCache.calculatedData.dailyOverview,
            warnings: ['Sistema temporariamente indisponível. Dados antigos.']
          },
          cacheStatus: emergencyStatus
        }
      }
      
      throw error
    }
  }

  private async fetchPlanetPositions(birthData: BirthData) {
    const now = new Date()
    const datetime = now.toISOString().split('.')[0] // Remove milissegundos
    
    // ✅ Parâmetros CORRETOS conforme documentação oficial Prokerala (FLAT, não aninhados)
    const requestData = {
      datetime: `${birthData.birthDate}T${birthData.birthTime}:00`,
      coordinates: `${birthData.birthLocation.latitude},${birthData.birthLocation.longitude}`,
      ayanamsa: 1,
      transit_datetime: datetime,
      current_coordinates: `${birthData.birthLocation.latitude},${birthData.birthLocation.longitude}`,
      house_system: 'whole-sign',
      orb: 'default',
      birth_time_rectification: 'flat-chart',
      la: 'en'
    }

    try {
      console.log('🌍 Chamando backend seguro para posições planetárias...')
      
      const response = await axios.post(`${this.backendUrl}/api/prokerala-proxy`, {
        endpoint: '/v2/astrology/transit-planet-position',
        params: requestData
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000
      })

      console.log('✅ Posições planetárias obtidas via backend seguro!')
      
      // Log de status se disponível
      if (response.data.systemStatus) {
        this.logCredentialStatus(response.data.systemStatus)
      }
      
      return response.data.data
    } catch (error: any) {
      console.error('❌ Erro no backend seguro:', error.message)
      
      // Capturar informações de status se disponíveis
      if (error.response?.data?.systemStatus) {
        this.logCredentialStatus(error.response.data.systemStatus)
      }
      
      // Tentar endpoint alternativo se o primeiro falhar
      try {
        console.log('🔄 Tentando endpoint alternativo...')
        const response = await axios.post(`${this.backendUrl}/api/prokerala-proxy`, {
          endpoint: '/astrology/transit-chart',
          params: requestData
        }, {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 30000
        })
        
        console.log('✅ Dados obtidos via endpoint alternativo!')
        return response.data.data
      } catch (fallbackError: any) {
        console.error('❌ Fallback também falhou:', fallbackError.message)
        throw error
      }
    }
  }

  private async fetchTransitAspects(birthData: BirthData) {
    const now = new Date()
    const datetime = now.toISOString().split('.')[0] // Remove milissegundos
    
    // ✅ Parâmetros CORRETOS conforme documentação oficial Prokerala (FLAT, não aninhados)
    const requestData = {
      datetime: `${birthData.birthDate}T${birthData.birthTime}:00`,
      coordinates: `${birthData.birthLocation.latitude},${birthData.birthLocation.longitude}`,
      ayanamsa: 1,
      transit_datetime: datetime,
      current_coordinates: `${birthData.birthLocation.latitude},${birthData.birthLocation.longitude}`,
      house_system: 'whole-sign',
      orb: 'default',
      birth_time_rectification: 'flat-chart',
      aspect_filter: 'major',
      la: 'en'
    }

    try {
      console.log('🔗 Chamando backend seguro para aspectos de trânsito...')
      
      const response = await axios.post(`${this.backendUrl}/api/prokerala-proxy`, {
        endpoint: '/v2/astrology/transit-aspect-chart',
        params: requestData
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000
      })

      console.log('✅ Aspectos de trânsito obtidos via backend seguro!')
      
      // Log de status se disponível
      if (response.data.systemStatus) {
        this.logCredentialStatus(response.data.systemStatus)
      }
      
      return response.data.data
    } catch (error: any) {
      console.error('❌ Erro ao buscar aspectos:', error.message)
      
      // Capturar informações de status se disponíveis
      if (error.response?.data?.systemStatus) {
        this.logCredentialStatus(error.response.data.systemStatus)
      }
      
      throw error
    }
  }

  private processRealData(apiData: any, birthData: BirthData): TransitData {
    // Processar dados reais da API Prokerala com PRECISÃO ASTROLÓGICA AVANÇADA
    console.log('🔮 Processando dados reais com sistema astrológico avançado...')
    
    try {
      // Debug: verificar estrutura dos dados da API
      console.log('🔍 Debug dados da API:', {
        hasData: !!apiData,
        keys: Object.keys(apiData || {}),
        hasTransitDetails: !!(apiData && apiData.transit_details),
        hasPlanetPosition: !!(apiData && apiData.planet_position),
        hasTransitAspect: !!(apiData && apiData.transit_aspect)
      })

      // 1. Converter dados da Prokerala para formato padronizado
      const astrologyData: AstrologyData = AstrologyCalculator.convertProkeralaData(apiData)
      
      console.log(`📊 Dados convertidos: ${astrologyData.planets.length} planetas, ${astrologyData.aspects.length} aspectos`)

      // 2. Calcular cada área da vida com PRECISÃO ASTROLÓGICA
      const loveCalculation = AstrologyCalculator.calculateLifeAreaStatus('love', astrologyData)
      const careerCalculation = AstrologyCalculator.calculateLifeAreaStatus('career', astrologyData)
      const healthCalculation = AstrologyCalculator.calculateLifeAreaStatus('health', astrologyData)
      const familyCalculation = AstrologyCalculator.calculateLifeAreaStatus('family', astrologyData)
      const spiritualityCalculation = AstrologyCalculator.calculateLifeAreaStatus('spirituality', astrologyData)

      // 3. Converter para formato de saída
      const lifeAreas: LifeArea[] = [
        {
          name: 'love',
          status: loveCalculation.adjustedScore,
          trend: this.calculateTrendFromFactors(loveCalculation.factors),
          description: this.generateAdvancedDescription(loveCalculation),
          criticalLevel: loveCalculation.adjustedScore < 30
        },
        {
          name: 'career',
          status: careerCalculation.adjustedScore,
          trend: this.calculateTrendFromFactors(careerCalculation.factors),
          description: this.generateAdvancedDescription(careerCalculation),
          criticalLevel: careerCalculation.adjustedScore < 30
        },
        {
          name: 'health',
          status: healthCalculation.adjustedScore,
          trend: this.calculateTrendFromFactors(healthCalculation.factors),
          description: this.generateAdvancedDescription(healthCalculation),
          criticalLevel: healthCalculation.adjustedScore < 35
        },
        {
          name: 'family',
          status: familyCalculation.adjustedScore,
          trend: this.calculateTrendFromFactors(familyCalculation.factors),
          description: this.generateAdvancedDescription(familyCalculation),
          criticalLevel: familyCalculation.adjustedScore < 25
        },
        {
          name: 'spirituality',
          status: spiritualityCalculation.adjustedScore,
          trend: this.calculateTrendFromFactors(spiritualityCalculation.factors),
          description: this.generateAdvancedDescription(spiritualityCalculation),
          criticalLevel: spiritualityCalculation.adjustedScore < 30
        }
      ]

      // 4. Extrair trânsitos para exibição
      const currentTransits: PlanetPosition[] = astrologyData.planets.map(planet => ({
        name: planet.name,
        longitude: planet.longitude,
        speed: planet.speed,
        sign: planet.sign,
        house: planet.house
      }))

      console.log('✨ Cálculos astrológicos avançados concluídos!')
      console.log(`📈 Confiança média: ${Math.round([loveCalculation, careerCalculation, healthCalculation, familyCalculation, spiritualityCalculation].reduce((sum, calc) => sum + calc.confidence, 0) / 5)}%`)
      
      return {
        currentTransits,
        lifeAreas,
        dailyOverview: this.calculateDailyOverview(lifeAreas),
        warnings: this.generateAdvancedWarnings(lifeAreas, [loveCalculation, careerCalculation, healthCalculation, familyCalculation, spiritualityCalculation])
      }
    } catch (error) {
      console.error('❌ Erro ao processar dados reais:', error)
      throw new Error(`Falha no processamento de dados astrológicos: ${error.message}`)
    }
  }

  private enhanceWithAspects(data: TransitData, aspects: any): TransitData {
    // Refinar as áreas da vida com base nos aspectos
    console.log('🔮 Aprimorando com aspectos de trânsito...')
    
    try {
      const aspectList: TransitAspect[] = aspects.aspects || []
      
      // Ajustar porcentagens das áreas baseado nos aspectos
      const enhancedLifeAreas = data.lifeAreas.map(area => {
        let adjustment = 0
        
        aspectList.forEach(aspect => {
          if (this.aspectAffectsArea(aspect, area.name)) {
            if (aspect.aspect === 'trine' || aspect.aspect === 'sextile') {
              adjustment += 10 // Aspectos positivos
            } else if (aspect.aspect === 'square' || aspect.aspect === 'opposition') {
              adjustment -= 10 // Aspectos desafiadores
            }
          }
        })
        
        return {
          ...area,
          status: Math.max(0, Math.min(100, area.status + adjustment))
        }
      })
      
      return {
        ...data,
        lifeAreas: enhancedLifeAreas,
        dailyOverview: this.calculateDailyOverview(enhancedLifeAreas)
      }
    } catch (error) {
      console.error('❌ Erro ao processar aspectos:', error)
      return data
    }
  }

  private aspectAffectsArea(aspect: TransitAspect, areaName: string): boolean {
    // Mapear quais planetas afetam quais áreas da vida
    const areaMapping: Record<string, string[]> = {
      love: ['venus', 'mars', 'moon'],
      career: ['saturn', 'jupiter', 'mars', 'sun'],
      health: ['mars', 'saturn', 'sun'],
      family: ['moon', 'cancer', 'jupiter'],
      spirituality: ['jupiter', 'neptune', 'pluto']
    }
    
    const relevantPlanets = areaMapping[areaName] || []
    return relevantPlanets.some(planet => 
      normalizePlanet(aspect.planet1).toLowerCase().includes(normalizePlanet(planet).toLowerCase()) || 
      normalizePlanet(aspect.planet2).toLowerCase().includes(normalizePlanet(planet).toLowerCase())
    )
  }

  private calculateLifeAreasFromTransits(transits: PlanetPosition[]): LifeArea[] {
    // Calcular status das áreas da vida baseado nas posições planetárias
    const baseStatus = 60 // Status base
    
    return [
      {
        name: 'love',
        status: this.calculateAreaStatus(transits, ['venus', 'mars'], baseStatus),
        trend: 'stable',
        description: 'Período de equilíbrio emocional',
        criticalLevel: false
      },
      {
        name: 'career',
        status: this.calculateAreaStatus(transits, ['saturn', 'jupiter', 'mars'], baseStatus),
        trend: 'stable',
        description: 'Oportunidades moderadas no trabalho',
        criticalLevel: false
      },
      {
        name: 'health',
        status: this.calculateAreaStatus(transits, ['mars', 'saturn'], baseStatus + 10),
        trend: 'stable',
        description: 'Energia boa e disposição',
        criticalLevel: false
      },
      {
        name: 'family',
        status: this.calculateAreaStatus(transits, ['moon', 'jupiter'], baseStatus - 5),
        trend: 'stable',
        description: 'Harmonia familiar estável',
        criticalLevel: false
      },
      {
        name: 'spirituality',
        status: this.calculateAreaStatus(transits, ['jupiter', 'neptune'], baseStatus + 5),
        trend: 'stable',
        description: 'Bom momento para reflexão',
        criticalLevel: false
      }
    ]
  }

  private calculateAreaStatus(transits: PlanetPosition[], relevantPlanets: string[], baseStatus: number): number {
    let adjustment = 0
    
    transits.forEach(transit => {
      if (relevantPlanets.some(planet => transit.name.toLowerCase().includes(planet))) {
        // Ajustar baseado na velocidade e posição
        if (transit.speed > 0) {
          adjustment += 5 // Planeta direto - positivo
        } else {
          adjustment -= 3 // Planeta retrógrado - desafiador
        }
      }
    })
    
    return Math.max(20, Math.min(90, baseStatus + adjustment))
  }

  private calculateDailyOverview(lifeAreas: LifeArea[]) {
    const totalStatus = lifeAreas.reduce((sum, area) => sum + area.status, 0)
    const overall = Math.round(totalStatus / lifeAreas.length)
    
    const bestArea = lifeAreas.reduce((best, area) => 
      area.status > best.status ? area : best
    )
    
    const challengingArea = lifeAreas.reduce((worst, area) => 
      area.status < worst.status ? area : worst
    )
    
    const areaNames: Record<string, string> = {
      love: 'Amor & Relacionamentos',
      career: 'Carreira & Finanças',
      health: 'Saúde & Bem-estar',
      family: 'Família & Amizades',
      spirituality: 'Espiritualidade & Crescimento'
    }
    
    return {
      overall,
      message: overall >= 70 ? 'Período favorável com boas energias.' :
               overall >= 50 ? 'Período equilibrado com energias estáveis.' :
               'Período que requer atenção e cuidado.',
      bestArea: areaNames[bestArea.name] || bestArea.name,
      challengingArea: areaNames[challengingArea.name] || challengingArea.name
    }
  }

  private generateWarnings(lifeAreas: LifeArea[]): string[] {
    const warnings: string[] = []
    
    lifeAreas.forEach(area => {
      if (area.status < 30) {
        area.criticalLevel = true
        warnings.push(`Atenção especial necessária em ${area.name}`)
      }
    })
    
    return warnings
  }

  /**
   * Calcula tendência baseada nos fatores astrológicos
   */
  private calculateTrendFromFactors(factors: any): 'positive' | 'negative' | 'stable' {
    const positiveFactors = factors.planetaryScore + factors.aspectScore + 
                           factors.dignityScore + factors.houseScore
    const negativeFactors = factors.transitScore < 0 ? Math.abs(factors.transitScore) : 0
    
    const netFactor = positiveFactors - negativeFactors
    
    if (netFactor > 8) return 'positive'
    if (netFactor < -5) return 'negative'
    return 'stable'
  }

  /**
   * Gera descrição avançada baseada nos cálculos astrológicos
   */
  private generateAdvancedDescription(calculation: any): string {
    const { name, adjustedScore, factors, confidence } = calculation
    
    const descriptions = {
      love: {
        high: 'Período excelente para relacionamentos e conexões profundas',
        medium: 'Equilíbrio emocional com potencial para crescimento amoroso',
        low: 'Desafios emocionais requerem paciência e autocompreensão'
      },
      career: {
        high: 'Momento favorável para avanços profissionais e novos projetos',
        medium: 'Progresso constante com oportunidades moderadas',
        low: 'Período de consolidação e planejamento estratégico'
      },
      health: {
        high: 'Vitalidade em alta com energia para atividades físicas',
        medium: 'Bem-estar estável com foco na manutenção da saúde',
        low: 'Atenção especial ao corpo e práticas de autocuidado'
      },
      family: {
        high: 'Harmonia familiar fortalecida com laços mais próximos',
        medium: 'Relacionamentos familiares equilibrados e estáveis',
        low: 'Necessidade de diálogo e compreensão nas relações familiares'
      },
      spirituality: {
        high: 'Crescimento espiritual acelerado com insights profundos',
        medium: 'Desenvolvimento espiritual constante e reflexivo',
        low: 'Período de questionamento e busca por significado'
      }
    }

    const level = adjustedScore >= 70 ? 'high' : adjustedScore >= 50 ? 'medium' : 'low'
    const baseDescription = descriptions[name as keyof typeof descriptions]?.[level] || 'Período de equilíbrio'
    
    // Adiciona informação de confiança se for baixa
    if (confidence < 60) {
      return `${baseDescription} (precisão moderada devido a dados limitados)`
    }
    
    return baseDescription
  }

  /**
   * Gera avisos avançados baseados nos cálculos detalhados
   */
  private generateAdvancedWarnings(lifeAreas: LifeArea[], calculations: any[]): string[] {
    const warnings: string[] = []
    
    calculations.forEach((calc, index) => {
      const area = lifeAreas[index]
      
      // Avisos críticos
      if (area.criticalLevel) {
        warnings.push(`⚠️ ${area.name}: Status crítico detectado (${area.status}%)`)
      }
      
      // Avisos de baixa confiança
      if (calc.confidence < 50) {
        warnings.push(`📊 ${area.name}: Precisão limitada - dados astrológicos incompletos`)
      }
      
      // Avisos de tendência negativa
      if (area.trend === 'negative') {
        warnings.push(`📉 ${area.name}: Tendência declinante - atenção recomendada`)
      }
    })
    
    return warnings
  }

  /**
   * Conversão básica temporária dos dados da Prokerala
   */
  private basicDataConversion(apiData: any): AstrologyData {
    const planets: any[] = []
    const aspects: any[] = []
    const houses: any[] = []

    // Extrair planetas de diferentes estruturas possíveis
    const planetData = apiData.planet_position || apiData.planets || apiData.transit_details?.planets || []
    
    planetData.forEach((planet: any) => {
      planets.push({
        name: planet.name || 'Unknown',
        longitude: planet.longitude || 0,
        latitude: planet.latitude || 0,
        speed: planet.speed || 0,
        sign: planet.sign?.name || planet.sign || 'Unknown',
        house: planet.house?.number || planet.house || 1,
        dignity: 0, // Será preenchido depois
        retrograde: (planet.speed || 0) < 0
      })
    })

    // Extrair aspectos
    const aspectData = apiData.transit_aspect || apiData.aspects || []
    
    aspectData.forEach((aspect: any) => {
      aspects.push({
        planet1: aspect.planet1?.name || aspect.planet1 || 'Unknown',
        planet2: aspect.planet2?.name || aspect.planet2 || 'Unknown',
        aspect: aspect.aspect?.name || aspect.aspect || 'unknown',
        orb: aspect.orb || 0,
        exact: aspect.exact || 0,
        applying: aspect.is_applying || false,
        strength: Math.max(0, 10 - (aspect.orb || 0)) // Força baseada no orb
      })
    })

    console.log(`🔄 Conversão básica: ${planets.length} planetas, ${aspects.length} aspectos`)
    
    return { planets, aspects, houses }
  }

  /**
   * Cálculo básico temporário para áreas da vida
   */
  private basicLifeAreaCalculation(areaName: string, astrologyData: AstrologyData): any {
    // Cálculo simplificado baseado em fatores básicos
    let score = 50 // Base neutra
    
    // Planetas relevantes para cada área (simplificado)
    const areaRelevantPlanets: Record<string, string[]> = {
      love: ['venus', 'mars', 'moon'],
      career: ['sun', 'mars', 'saturn', 'jupiter'],
      health: ['sun', 'mars', 'moon'],
      family: ['moon', 'cancer', 'jupiter'],
      spirituality: ['jupiter', 'neptune', 'sun']
    }
    
    const relevantPlanets = areaRelevantPlanets[areaName] || []
    
    // Ajustar score baseado nos planetas relevantes
    astrologyData.planets.forEach(planet => {
      if (relevantPlanets.includes(planet.name.toLowerCase())) {
        // Adicionar variação baseada na velocidade e dignidade
        const speedFactor = Math.abs(planet.speed) > 1 ? 5 : -5
        const dignityFactor = planet.dignity * 3
        score += speedFactor + dignityFactor + (Math.random() * 20 - 10)
      }
    })
    
    // Ajustar baseado nos aspectos
    astrologyData.aspects.forEach(aspect => {
      if (relevantPlanets.includes(aspect.planet1.toLowerCase()) || 
          relevantPlanets.includes(aspect.planet2.toLowerCase())) {
        const aspectStrength = aspect.strength || 5
        score += (aspectStrength - 5) * 2 // Varia de -10 a +10
      }
    })
    
    // Normalizar entre 0-100
    score = Math.max(0, Math.min(100, score))
    
    return {
      name: areaName,
      rawScore: score,
      adjustedScore: score,
      factors: {
        planetaryScore: score * 0.4,
        aspectScore: score * 0.3,
        houseScore: score * 0.1,
        dignityScore: score * 0.1,
        transitScore: score * 0.1
      },
      confidence: 70, // Confiança média para cálculo básico
      detailedBreakdown: [`Cálculo básico para ${areaName}: ${Math.round(score)}%`]
    }
  }



}

export default new TransitService()
