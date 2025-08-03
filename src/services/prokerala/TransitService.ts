import axios from 'axios'

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

interface LifeArea {
  name: string
  status: number  // 0-100
  trend: 'positive' | 'negative' | 'stable'
  description: string
  criticalLevel: boolean
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

  async getCurrentTransits(birthData: BirthData): Promise<TransitData> {
    try {
      console.log('🔮 Iniciando busca de trânsitos na Prokerala...')
      
      // Buscar dados astrológicos reais - apenas trânsitos e aspectos
      const [planetPositions, transitAspects] = await Promise.allSettled([
        this.fetchPlanetPositions(birthData),
        this.fetchTransitAspects(birthData)
      ])

      console.log('📊 Resultados da API:', {
        planets: planetPositions.status,
        aspects: transitAspects.status
      })

      // Processar dados reais se disponíveis
      let processedData = this.getMockTransitData()
      
      if (planetPositions.status === 'fulfilled') {
        console.log('✅ Dados planetários obtidos com sucesso!')
        processedData = this.processRealData(planetPositions.value, birthData)
      }

      if (transitAspects.status === 'fulfilled') {
        console.log('✅ Aspectos de trânsito obtidos com sucesso!')
        // Processar aspectos para refinar as áreas da vida
        processedData = this.enhanceWithAspects(processedData, transitAspects.value)
      }

      console.log('Dados de trânsito carregados:', processedData)
      return processedData
    } catch (error) {
      console.error('❌ Erro geral ao buscar trânsitos:', error)
      return this.getMockTransitData()
    }
  }

  private async fetchPlanetPositions(birthData: BirthData) {
    const now = new Date()
    const datetime = now.toISOString().split('.')[0] // Remove milissegundos
    
    const requestData = {
      datetime,
      coordinates: `${birthData.birthLocation.latitude},${birthData.birthLocation.longitude}`,
      ayanamsa: 1, // Lahiri (1)
      birth_datetime: `${birthData.birthDate}T${birthData.birthTime}:00`,
      birth_coordinates: `${birthData.birthLocation.latitude},${birthData.birthLocation.longitude}`,
      transit_datetime: datetime,
      transit_coordinates: `${birthData.birthLocation.latitude},${birthData.birthLocation.longitude}`
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
      return response.data.data
    } catch (error: any) {
      console.error('❌ Erro no backend seguro:', error.message)
      
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
    
    const requestData = {
      datetime,
      coordinates: `${birthData.birthLocation.latitude},${birthData.birthLocation.longitude}`,
      ayanamsa: 1, // Lahiri (1)
      birth_datetime: `${birthData.birthDate}T${birthData.birthTime}:00`,
      birth_coordinates: `${birthData.birthLocation.latitude},${birthData.birthLocation.longitude}`,
      transit_datetime: datetime,
      transit_coordinates: `${birthData.birthLocation.latitude},${birthData.birthLocation.longitude}`
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
      return response.data.data
    } catch (error: any) {
      console.error('❌ Erro ao buscar aspectos:', error.message)
      throw error
    }
  }

  private processRealData(apiData: any, birthData: BirthData): TransitData {
    // Processar dados reais da API Prokerala
    console.log('🔄 Processando dados reais da Prokerala...')
    
    try {
      const planets = apiData.planets || apiData.transits || []
      const currentTransits: PlanetPosition[] = planets.map((planet: any) => ({
        name: planet.name || 'Unknown',
        longitude: planet.longitude || 0,
        speed: planet.speed || 0,
        sign: planet.sign || 'Unknown',
        house: planet.house || 1
      }))

      // Calcular áreas da vida baseado nos trânsitos reais
      const lifeAreas = this.calculateLifeAreasFromTransits(currentTransits)
      
      return {
        currentTransits,
        lifeAreas,
        dailyOverview: this.calculateDailyOverview(lifeAreas),
        warnings: this.generateWarnings(lifeAreas)
      }
    } catch (error) {
      console.error('❌ Erro ao processar dados reais:', error)
      return this.getMockTransitData()
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
      aspect.planet1.toLowerCase().includes(planet) || 
      aspect.planet2.toLowerCase().includes(planet)
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

  private getMockTransitData(): TransitData {
    return {
      currentTransits: [],
      lifeAreas: [
        {
          name: 'love',
          status: 50,
          trend: 'stable',
          description: 'Período neutro para relacionamentos',
          criticalLevel: false
        },
        {
          name: 'career',
          status: 60,
          trend: 'stable',
          description: 'Oportunidades moderadas no trabalho',
          criticalLevel: false
        },
        {
          name: 'health',
          status: 70,
          trend: 'stable',
          description: 'Energia boa e disposição',
          criticalLevel: false
        },
        {
          name: 'family',
          status: 55,
          trend: 'stable',
          description: 'Harmonia familiar estável',
          criticalLevel: false
        },
        {
          name: 'spirituality',
          status: 65,
          trend: 'stable',
          description: 'Bom momento para reflexão',
          criticalLevel: false
        }
      ],
      dailyOverview: {
        overall: 60,
        message: 'Período equilibrado com energias estáveis.',
        bestArea: 'Saúde & Bem-estar',
        challengingArea: 'Amor & Relacionamentos'
      },
      warnings: []
    }
  }
}

export default new TransitService()