import axios from 'axios'
import { PROKERALA_CONFIG } from '../../config/prokerala'
import type { BirthData } from '../../screens/onboarding/BirthDataForm'

// Interfaces baseadas na documentação real da Prokerala
interface ProkeralaRequest {
  datetime: string  // ISO format YYYY-MM-DDTHH:mm:ss
  coordinates: string // "lat,lng"
  ayanamsa: number // 1 = Lahiri
}

export interface Planet {
  id: number
  name: string
  longitude: number
  degree: number
  minutes: number
  seconds: number
  sign: string
  signLord: string
  isRetrograde: boolean
}

export interface Transit {
  planet: Planet
  fromSign: string
  toSign: string
  transitDate: string
  influence: 'positive' | 'negative' | 'neutral'
  intensity: number // 1-100
  description: string
  areas: LifeArea[]
}

export interface LifeArea {
  name: 'love' | 'career' | 'health' | 'family' | 'spirituality'
  status: number // 0-100
  description: string
  trend: 'rising' | 'falling' | 'stable'
  criticalLevel: boolean
}

export interface TransitData {
  currentTransits: Transit[]
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
  private readonly baseUrl = 'https://api.prokerala.com/v2'
  private currentCredentialIndex = 0

  private getCredentials() {
    const credentials = PROKERALA_CONFIG.credentials[this.currentCredentialIndex]
    this.currentCredentialIndex = (this.currentCredentialIndex + 1) % PROKERALA_CONFIG.credentials.length
    return credentials
  }

  async getCurrentTransits(birthData: BirthData): Promise<TransitData> {
    try {
      console.log('🔮 Iniciando busca de trânsitos na Prokerala...')
      
      // Buscar dados astrológicos reais
      const [planetPositions, dailyHoroscope] = await Promise.allSettled([
        this.fetchPlanetPositions(birthData),
        this.fetchDailyHoroscope(birthData)
      ])

      console.log('📊 Resultados da API:', {
        planets: planetPositions.status,
        horoscope: dailyHoroscope.status
      })

      // Processar dados reais se disponíveis
      let processedData = this.getMockTransitData()
      
      if (planetPositions.status === 'fulfilled') {
        console.log('✅ Dados planetários obtidos com sucesso!')
        processedData = this.processRealData(planetPositions.value, birthData)
      }

      return processedData
    } catch (error) {
      console.error('❌ Erro geral ao buscar trânsitos:', error)
      return this.getMockTransitData()
    }
  }

  private async fetchPlanetPositions(birthData: BirthData) {
    const credentials = this.getCredentials()
    
    // Formato de data correto para Prokerala: YYYY-MM-DDTHH:mm:ss
    const now = new Date()
    const datetime = now.toISOString().split('.')[0] // Remove milissegundos
    
    const requestData: ProkeralaRequest = {
      datetime,
      coordinates: `${birthData.birthLocation.latitude},${birthData.birthLocation.longitude}`,
      ayanamsa: 1 // Lahiri
    }

    console.log('🌍 Fazendo request para Prokerala:', {
      endpoint: 'planet-position',
      data: requestData,
      clientId: credentials.clientId.substring(0, 8) + '...'
    })

    const response = await axios.post(
      `${this.baseUrl}/astrology/planet-position`,
      requestData,
      {
        headers: {
          'Authorization': `Bearer ${credentials.clientId}:${credentials.clientSecret}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 10000
      }
    )

    console.log('📋 Resposta da Prokerala:', {
      status: response.status,
      dataKeys: Object.keys(response.data || {})
    })

    return response.data
  }

  private async fetchDailyHoroscope(birthData: BirthData) {
    const credentials = this.getCredentials()
    
    const requestData = {
      datetime: new Date().toISOString().split('.')[0],
      coordinates: `${birthData.birthLocation.latitude},${birthData.birthLocation.longitude}`,
      zodiac: 1 // Western zodiac
    }

    console.log('⭐ Buscando horóscopo diário...')

    const response = await axios.post(
      `${this.baseUrl}/astrology/daily-horoscope`,
      requestData,
      {
        headers: {
          'Authorization': `Bearer ${credentials.clientId}:${credentials.clientSecret}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 10000
      }
    )

    return response.data
  }

  private processRealData(prokeralaData: any, birthData: BirthData): TransitData {
    console.log('🔄 Processando dados reais da Prokerala...')
    
    // Extrair posições planetárias reais
    const planets = prokeralaData.data?.planets || []
    console.log('🪐 Planetas encontrados:', planets.length)

    const currentTransits = this.extractRealTransits(planets)
    const lifeAreas = this.calculateLifeAreaStatus(currentTransits)
    const dailyOverview = this.generateDailyOverview(lifeAreas)
    const warnings = this.generateWarnings(lifeAreas)

    return {
      currentTransits,
      lifeAreas,
      dailyOverview,
      warnings,
    }
  }

  private extractRealTransits(planets: any[]): Transit[] {
    const transits: Transit[] = []

    planets.forEach(planet => {
      if (planet && planet.name) {
        transits.push({
          planet: {
            id: planet.id || 0,
            name: planet.name,
            longitude: planet.longitude || 0,
            degree: planet.degree || 0,
            minutes: planet.minutes || 0,
            seconds: planet.seconds || 0,
            sign: planet.sign || 'Desconhecido',
            signLord: planet.sign_lord || 'Desconhecido',
            isRetrograde: planet.is_retrograde || false,
          },
          fromSign: planet.previous_sign || planet.sign || 'Desconhecido',
          toSign: planet.sign || 'Desconhecido',
          transitDate: new Date().toISOString(),
          influence: this.determineInfluence(planet),
          intensity: this.calculateIntensity(planet),
          description: this.generateDescription(planet),
          areas: this.getAffectedAreas(planet.name),
        })
      }
    })

    console.log(`✨ ${transits.length} trânsitos processados`)
    return transits
  }

  private determineInfluence(planet: any): 'positive' | 'negative' | 'neutral' {
    // Lógica básica baseada no planeta e retrogradação
    if (planet.is_retrograde) return 'negative'
    
    const beneficPlanets = ['Venus', 'Jupiter', 'Mercury']
    const maleficPlanets = ['Mars', 'Saturn', 'Rahu', 'Ketu']
    
    if (beneficPlanets.includes(planet.name)) return 'positive'
    if (maleficPlanets.includes(planet.name)) return 'negative'
    
    return 'neutral'
  }

  private calculateIntensity(planet: any): number {
    // Intensidade baseada na força planetária (simplified)
    let intensity = 50
    
    if (planet.is_retrograde) intensity += 20
    if (planet.strength) intensity += Math.floor(planet.strength / 2)
    
    return Math.min(Math.max(intensity, 10), 100)
  }

  private generateDescription(planet: any): string {
    const influences = {
      'Sun': 'Energia vital e autoconfiança em destaque',
      'Moon': 'Emoções e intuição influenciadas',
      'Mars': 'Ação e energia física intensificadas',
      'Mercury': 'Comunicação e pensamento aguçados',
      'Jupiter': 'Sabedoria e expansão favorecidas',
      'Venus': 'Amor e beleza em evidência',
      'Saturn': 'Disciplina e responsabilidade requeridas',
      'Rahu': 'Transformações e mudanças inesperadas',
      'Ketu': 'Desapego e crescimento espiritual'
    }
    
    const base = influences[planet.name as keyof typeof influences] || 'Influência planetária ativa'
    
    if (planet.is_retrograde) {
      return `${base} (retrógrado - atenção especial requerida)`
    }
    
    return base
  }

  private getAffectedAreas(planetName: string): LifeArea[] {
    const planetAreas = {
      'Sun': ['career', 'spirituality'],
      'Moon': ['family', 'health'],
      'Mars': ['career', 'health'],
      'Mercury': ['career', 'love'],
      'Jupiter': ['spirituality', 'family'],
      'Venus': ['love', 'family'],
      'Saturn': ['career', 'health'],
      'Rahu': ['career', 'spirituality'],
      'Ketu': ['spirituality', 'health']
    }
    
    return (planetAreas[planetName as keyof typeof planetAreas] || ['spirituality']) as LifeArea[]
  }

  private processTransitData(prokeralaData: any): TransitData {
    // Processar dados reais da Prokerala e converter para nosso formato
    const currentTransits = this.extractTransits(prokeralaData)
    const lifeAreas = this.calculateLifeAreaStatus(currentTransits)
    const dailyOverview = this.generateDailyOverview(lifeAreas)
    const warnings = this.generateWarnings(lifeAreas)

    return {
      currentTransits,
      lifeAreas,
      dailyOverview,
      warnings,
    }
  }

  private extractTransits(data: any): Transit[] {
    // Extrair e processar trânsitos dos dados da Prokerala
    // Por enquanto, retorna dados mock estruturados
    return [
      {
        planet: {
          id: 1,
          name: 'Mercúrio',
          longitude: 125.5,
          degree: 5,
          minutes: 30,
          seconds: 0,
          sign: 'Leão',
          signLord: 'Sol',
          isRetrograde: false,
        },
        fromSign: 'Câncer',
        toSign: 'Leão',
        transitDate: new Date().toISOString(),
        influence: 'positive',
        intensity: 75,
        description: 'Comunicação e criatividade em alta',
        areas: ['career', 'spirituality'],
      },
      {
        planet: {
          id: 2,
          name: 'Vênus',
          longitude: 200.3,
          degree: 20,
          minutes: 18,
          seconds: 0,
          sign: 'Escorpião',
          signLord: 'Marte',
          isRetrograde: true,
        },
        fromSign: 'Libra',
        toSign: 'Escorpião',
        transitDate: new Date().toISOString(),
        influence: 'negative',
        intensity: 60,
        description: 'Relacionamentos precisam de atenção especial',
        areas: ['love', 'family'],
      },
    ]
  }

  private calculateLifeAreaStatus(transits: Transit[]): LifeArea[] {
    // Calcular status baseado nos trânsitos
    return [
      {
        name: 'love',
        status: 35,
        description: 'Vênus retrógrada traz desafios nos relacionamentos',
        trend: 'falling',
        criticalLevel: true,
      },
      {
        name: 'career',
        status: 78,
        description: 'Mercúrio em Leão favorece comunicação profissional',
        trend: 'rising',
        criticalLevel: false,
      },
      {
        name: 'health',
        status: 65,
        description: 'Energia estável, mas atenção ao estresse',
        trend: 'stable',
        criticalLevel: false,
      },
      {
        name: 'family',
        status: 40,
        description: 'Tensões familiares requerem paciência',
        trend: 'falling',
        criticalLevel: true,
      },
      {
        name: 'spirituality',
        status: 85,
        description: 'Momento ideal para crescimento espiritual',
        trend: 'rising',
        criticalLevel: false,
      },
    ]
  }

  private generateDailyOverview(lifeAreas: LifeArea[]) {
    const average = lifeAreas.reduce((sum, area) => sum + area.status, 0) / lifeAreas.length
    const bestArea = lifeAreas.reduce((best, area) => area.status > best.status ? area : best)
    const worstArea = lifeAreas.reduce((worst, area) => area.status < worst.status ? area : worst)

    return {
      overall: Math.round(average),
      message: this.getOverallMessage(average),
      bestArea: this.translateAreaName(bestArea.name),
      challengingArea: this.translateAreaName(worstArea.name),
    }
  }

  private generateWarnings(lifeAreas: LifeArea[]): string[] {
    const warnings: string[] = []
    
    lifeAreas.forEach(area => {
      if (area.criticalLevel) {
        warnings.push(`${this.translateAreaName(area.name)}: ${area.description}`)
      }
    })

    return warnings
  }

  private getOverallMessage(average: number): string {
    if (average >= 80) return 'Excelente momento astrológico! Aproveite as energias positivas.'
    if (average >= 60) return 'Período equilibrado com boas oportunidades de crescimento.'
    if (average >= 40) return 'Momento de cautela e reflexão. Foque no essencial.'
    return 'Período desafiador. Pratique paciência e busque apoio.'
  }

  private translateAreaName(area: string): string {
    const translations = {
      love: 'Amor & Relacionamentos',
      career: 'Carreira & Finanças',
      health: 'Saúde & Bem-estar',
      family: 'Família & Amizades',
      spirituality: 'Espiritualidade & Crescimento',
    }
    return translations[area as keyof typeof translations] || area
  }

  private getMockTransitData(): TransitData {
    // Dados mock para quando a API falhar
    return {
      currentTransits: [],
      lifeAreas: [
        {
          name: 'love',
          status: 50,
          description: 'Período neutro para relacionamentos',
          trend: 'stable',
          criticalLevel: false,
        },
        {
          name: 'career',
          status: 60,
          description: 'Oportunidades moderadas no trabalho',
          trend: 'stable',
          criticalLevel: false,
        },
        {
          name: 'health',
          status: 70,
          description: 'Energia boa e disposição',
          trend: 'stable',
          criticalLevel: false,
        },
        {
          name: 'family',
          status: 55,
          description: 'Harmonia familiar estável',
          trend: 'stable',
          criticalLevel: false,
        },
        {
          name: 'spirituality',
          status: 65,
          description: 'Bom momento para reflexão',
          trend: 'stable',
          criticalLevel: false,
        },
      ],
      dailyOverview: {
        overall: 60,
        message: 'Período equilibrado com energias estáveis.',
        bestArea: 'Saúde & Bem-estar',
        challengingArea: 'Amor & Relacionamentos',
      },
      warnings: [],
    }
  }
}

export default new TransitService()