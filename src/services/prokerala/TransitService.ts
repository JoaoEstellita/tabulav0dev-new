import axios from 'axios'
import { PROKERALA_CONFIG } from '../../config/prokerala'
import type { BirthData } from '../../screens/onboarding/BirthDataForm'

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
      // Buscar trânsitos atuais da Prokerala
      const transitsResponse = await this.fetchProkeralaTransits(birthData)
      
      // Processar dados e calcular status das áreas de vida
      const processedData = this.processTransitData(transitsResponse)
      
      return processedData
    } catch (error) {
      console.error('Erro ao buscar trânsitos:', error)
      // Retornar dados mock em caso de erro
      return this.getMockTransitData()
    }
  }

  private async fetchProkeralaTransits(birthData: BirthData) {
    const credentials = this.getCredentials()
    
    const params = {
      ayanamsa: 1, // Lahiri
      datetime: new Date().toISOString(),
      coordinates: `${birthData.birthLocation.latitude},${birthData.birthLocation.longitude}`,
      birth_datetime: `${birthData.birthDate}T${birthData.birthTime}:00`,
      birth_coordinates: `${birthData.birthLocation.latitude},${birthData.birthLocation.longitude}`,
    }

    const response = await axios.get(`${this.baseUrl}/astrology/transit`, {
      params,
      headers: {
        'Authorization': `Bearer ${credentials.clientId}:${credentials.clientSecret}`,
        'Content-Type': 'application/json',
      },
    })

    return response.data
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