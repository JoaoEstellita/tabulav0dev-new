import axios from 'axios'
import { PROKERALA_CONFIG } from '../../config/prokerala'
import type { BirthData } from '../../screens/onboarding/BirthDataForm'

export interface NatalPlanetPosition {
  name: string
  longitude: number
  latitude: number
  sign: string
  house: number
  dignity: number
  retrograde: boolean
}

export interface NatalHouse {
  number: number
  cusp: number
  sign: string
  ruler: string
}

export interface NatalAspect {
  planet1: string
  planet2: string
  aspect: string
  orb: number
  strength: number
}

export interface NatalChart {
  planets: NatalPlanetPosition[]
  houses: NatalHouse[]
  aspects: NatalAspect[]
  ascendant: {
    sign: string
    degree: number
  }
  midheaven: {
    sign: string
    degree: number
  }
  calculatedAt: Date
  isValid: boolean
}

class NatalChartService {
  
  /**
   * Busca mapa natal permanente do usuário
   * TODO: Integrar com endpoint /v2/astrology/natal-chart quando disponível
   */
  async getNatalChart(birthData: BirthData): Promise<NatalChart> {
    try {
      console.log('🌟 Buscando mapa natal permanente...')
      
      // Tentar buscar dados reais da API primeiro
      const realChart = await this.fetchRealNatalChart(birthData)
      if (realChart) {
        console.log('✅ Mapa natal real obtido da API')
        return realChart
      }
      
      // Fallback para simulação se a API falhar
      console.log('⚠️ API falhou, usando simulação temporária')
      const simulatedChart = this.generateNatalChart(birthData)
      
      console.log('🌟 Mapa natal gerado:', {
        planets: simulatedChart.planets.length,
        houses: simulatedChart.houses.length,
        aspects: simulatedChart.aspects.length,
        ascendant: simulatedChart.ascendant.sign
      })
      
      return simulatedChart
    } catch (error) {
      console.error('❌ Erro ao buscar mapa natal:', error)
      // Em caso de erro, retornar simulação
      return this.generateNatalChart(birthData)
    }
  }

  /**
   * Busca dados reais do mapa natal via API Prokerala
   */
  private async fetchRealNatalChart(birthData: BirthData): Promise<NatalChart | null> {
    try {
      console.log('🔮 Buscando mapa natal real via API...')
      
      // Preparar parâmetros no formato correto da Prokerala
      const params = {
        'profile[datetime]': `${birthData.birthDate}T${birthData.birthTime}:00`,
        'profile[coordinates]': `${birthData.birthLocation.latitude},${birthData.birthLocation.longitude}`,
        ayanamsa: 1
      }

      console.log('📋 Parâmetros do mapa natal:', params)

      // Fazer requisição para o endpoint natal-planet-position
      const response = await axios.post(`${PROKERALA_CONFIG.backendUrl}/api/prokerala-proxy`, {
        endpoint: '/v2/astrology/natal-planet-position',
        params
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000
      })

      console.log('✅ Resposta API mapa natal:', response.status)
      
      if (response.data && response.data.success && response.data.data) {
        return this.parseNatalChartResponse(response.data.data, birthData)
      }

      return null

    } catch (error: any) {
      console.error('❌ Erro ao buscar mapa natal real:', error.message)
      if (error.response) {
        console.error('Status:', error.response.status)
        console.error('Data:', error.response.data)
      }
      return null
    }
  }

  /**
   * Converte resposta da API em NatalChart
   */
  private parseNatalChartResponse(apiData: any, birthData: BirthData): NatalChart {
    console.log('🔄 Convertendo resposta da API para NatalChart...')
    console.log('📊 Estrutura da resposta:', Object.keys(apiData))

    const planets: NatalPlanetPosition[] = []
    const houses: NatalHouse[] = []
    const aspects: NatalAspect[] = []

    // Extrair planetas da resposta
    let planetData = apiData.planets || apiData.planet_position || apiData.data || []
    
    if (Array.isArray(planetData)) {
      planetData.forEach((planet: any) => {
        planets.push({
          name: planet.name || planet.planet || 'Unknown',
          longitude: planet.longitude || planet.long || 0,
          latitude: planet.latitude || planet.lat || 0,
          sign: planet.sign?.name || planet.sign || this.getSignFromLongitude(planet.longitude || 0),
          house: planet.house?.number || planet.house || 1,
          dignity: this.calculateDignity(planet.name?.toLowerCase(), planet.sign?.name || planet.sign),
          retrograde: planet.is_retrograde || planet.retrograde || false
        })
      })
    }

    // Gerar casas astrológicas (12 casas)
    for (let i = 1; i <= 12; i++) {
      houses.push({
        number: i,
        cusp: (i - 1) * 30, // Distribuição básica
        sign: this.getSignFromLongitude((i - 1) * 30),
        ruler: this.getHouseRuler(i)
      })
    }

    // Calcular aspectos entre planetas
    for (let i = 0; i < planets.length; i++) {
      for (let j = i + 1; j < planets.length; j++) {
        const aspect = this.calculateAspect(planets[i], planets[j])
        if (aspect) {
          aspects.push(aspect)
        }
      }
    }

    // Calcular ascendente (primeira casa)
    const ascendantLongitude = houses[0]?.cusp || 0
    const ascendantSign = this.getSignFromLongitude(ascendantLongitude)

    // Calcular meio do céu (casa 10)
    const midheavenLongitude = houses[9]?.cusp || 270
    const midheavenSign = this.getSignFromLongitude(midheavenLongitude)

    console.log(`✅ Mapa natal convertido: ${planets.length} planetas, ${aspects.length} aspectos`)

    return {
      planets,
      houses,
      aspects,
      ascendant: {
        sign: ascendantSign,
        degree: ascendantLongitude % 30
      },
      midheaven: {
        sign: midheavenSign,
        degree: midheavenLongitude % 30
      },
      calculatedAt: new Date(),
      isValid: planets.length > 0
    }
  }
  
  /**
   * Gera mapa natal simulado baseado nos dados de nascimento
   * Este método será substituído pela integração real com a API
   */
  private generateNatalChart(birthData: BirthData): NatalChart {
    const birthDate = new Date(birthData.birthDate)
    const month = birthDate.getMonth() + 1
    const day = birthDate.getDate()
    const year = birthDate.getFullYear()
    
    // Calcular signo solar baseado na data
    const sunSign = this.calculateSunSign(month, day)
    
    // Seed baseado na data para consistência
    const seed = year + month * 100 + day * 10000
    
    // Gerar posições planetárias simuladas mas realistas
    const planets: NatalPlanetPosition[] = [
      {
        name: 'Sol',
        longitude: this.getSunLongitude(month, day),
        latitude: 0,
        sign: sunSign,
        house: (seed % 12) + 1,
        dignity: this.calculateDignity('sol', sunSign),
        retrograde: false
      },
      {
        name: 'Lua',
        longitude: (seed % 360),
        latitude: (seed % 10) - 5,
        sign: this.getSignFromLongitude((seed % 360)),
        house: ((seed + 123) % 12) + 1,
        dignity: this.calculateDignity('lua', this.getSignFromLongitude((seed % 360))),
        retrograde: false
      },
      {
        name: 'Mercúrio',
        longitude: (seed + 45) % 360,
        latitude: ((seed + 45) % 8) - 4,
        sign: this.getSignFromLongitude((seed + 45) % 360),
        house: ((seed + 234) % 12) + 1,
        dignity: this.calculateDignity('mercurio', this.getSignFromLongitude((seed + 45) % 360)),
        retrograde: (seed % 7) === 0
      },
      {
        name: 'Vênus',
        longitude: (seed + 90) % 360,
        latitude: ((seed + 90) % 6) - 3,
        sign: this.getSignFromLongitude((seed + 90) % 360),
        house: ((seed + 345) % 12) + 1,
        dignity: this.calculateDignity('venus', this.getSignFromLongitude((seed + 90) % 360)),
        retrograde: (seed % 11) === 0
      },
      {
        name: 'Marte',
        longitude: (seed + 135) % 360,
        latitude: ((seed + 135) % 4) - 2,
        sign: this.getSignFromLongitude((seed + 135) % 360),
        house: ((seed + 456) % 12) + 1,
        dignity: this.calculateDignity('marte', this.getSignFromLongitude((seed + 135) % 360)),
        retrograde: (seed % 13) === 0
      },
      {
        name: 'Júpiter',
        longitude: (seed + 180) % 360,
        latitude: ((seed + 180) % 3) - 1,
        sign: this.getSignFromLongitude((seed + 180) % 360),
        house: ((seed + 567) % 12) + 1,
        dignity: this.calculateDignity('jupiter', this.getSignFromLongitude((seed + 180) % 360)),
        retrograde: (seed % 17) === 0
      },
      {
        name: 'Saturno',
        longitude: (seed + 225) % 360,
        latitude: ((seed + 225) % 2) - 1,
        sign: this.getSignFromLongitude((seed + 225) % 360),
        house: ((seed + 678) % 12) + 1,
        dignity: this.calculateDignity('saturno', this.getSignFromLongitude((seed + 225) % 360)),
        retrograde: (seed % 19) === 0
      }
    ]
    
    // Gerar casas astrológicas
    const houses: NatalHouse[] = []
    for (let i = 1; i <= 12; i++) {
      const cuspLongitude = (seed + (i * 30)) % 360
      houses.push({
        number: i,
        cusp: cuspLongitude,
        sign: this.getSignFromLongitude(cuspLongitude),
        ruler: this.getHouseRuler(this.getSignFromLongitude(cuspLongitude))
      })
    }
    
    // Gerar aspectos natais
    const aspects: NatalAspect[] = []
    for (let i = 0; i < planets.length; i++) {
      for (let j = i + 1; j < planets.length; j++) {
        const planet1 = planets[i]
        const planet2 = planets[j]
        const orb = Math.abs(planet1.longitude - planet2.longitude)
        
        // Verificar aspectos principais
        const aspect = this.calculateAspect(orb)
        if (aspect) {
          aspects.push({
            planet1: planet1.name,
            planet2: planet2.name,
            aspect: aspect.name,
            orb: aspect.orb,
            strength: aspect.strength
          })
        }
      }
    }
    
    return {
      planets,
      houses,
      aspects,
      ascendant: {
        sign: houses[0].sign, // Casa 1 = Ascendente
        degree: houses[0].cusp
      },
      midheaven: {
        sign: houses[9].sign, // Casa 10 = Meio do Céu
        degree: houses[9].cusp
      },
      calculatedAt: new Date(),
      isValid: true
    }
  }
  
  private calculateSunSign(month: number, day: number): string {
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Áries'
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Touro'
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Gêmeos'
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Câncer'
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leão'
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgem'
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Libra'
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Escorpião'
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagitário'
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Capricórnio'
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Aquário'
    if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return 'Peixes'
    return 'Áries'
  }
  
  private getSunLongitude(month: number, day: number): number {
    // Aproximação da longitude solar baseada na data
    const dayOfYear = this.getDayOfYear(month, day)
    const sunLongitude = ((dayOfYear - 81) * 360 / 365) % 360
    return sunLongitude < 0 ? sunLongitude + 360 : sunLongitude
  }
  
  private getDayOfYear(month: number, day: number): number {
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    let dayOfYear = day
    for (let i = 0; i < month - 1; i++) {
      dayOfYear += daysInMonth[i]
    }
    return dayOfYear
  }
  
  private getSignFromLongitude(longitude: number): string {
    const signs = ['Áries', 'Touro', 'Gêmeos', 'Câncer', 'Leão', 'Virgem', 
                  'Libra', 'Escorpião', 'Sagitário', 'Capricórnio', 'Aquário', 'Peixes']
    const signIndex = Math.floor(longitude / 30)
    return signs[signIndex] || 'Áries'
  }
  
  private calculateDignity(planet: string, sign: string): number {
    const dignities: Record<string, Record<string, number>> = {
      sol: { 'Leão': 5, 'Áries': 4, 'Aquário': -5, 'Libra': -4 },
      lua: { 'Câncer': 5, 'Touro': 4, 'Capricórnio': -5, 'Escorpião': -4 },
      mercurio: { 'Gêmeos': 5, 'Virgem': 5, 'Aquário': 4, 'Sagitário': -5, 'Peixes': -5 },
      venus: { 'Touro': 5, 'Libra': 5, 'Peixes': 4, 'Escorpião': -5, 'Áries': -5, 'Virgem': -4 },
      marte: { 'Áries': 5, 'Escorpião': 5, 'Capricórnio': 4, 'Libra': -5, 'Touro': -5, 'Câncer': -4 },
      jupiter: { 'Sagitário': 5, 'Peixes': 5, 'Câncer': 4, 'Gêmeos': -5, 'Virgem': -5, 'Capricórnio': -4 },
      saturno: { 'Capricórnio': 5, 'Aquário': 5, 'Libra': 4, 'Câncer': -5, 'Leão': -5, 'Áries': -4 }
    }
    
    return dignities[planet]?.[sign] || 0
  }
  
  private getHouseRuler(sign: string): string {
    const rulers: Record<string, string> = {
      'Áries': 'Marte',
      'Touro': 'Vênus',
      'Gêmeos': 'Mercúrio',
      'Câncer': 'Lua',
      'Leão': 'Sol',
      'Virgem': 'Mercúrio',
      'Libra': 'Vênus',
      'Escorpião': 'Marte',
      'Sagitário': 'Júpiter',
      'Capricórnio': 'Saturno',
      'Aquário': 'Saturno',
      'Peixes': 'Júpiter'
    }
    
    return rulers[sign] || 'Desconhecido'
  }
  
  private calculateAspect(planet1: NatalPlanetPosition, planet2: NatalPlanetPosition): NatalAspect | null {
    const orb = Math.abs(planet1.longitude - planet2.longitude)
    const adjustedOrb = orb > 180 ? 360 - orb : orb
    
    const aspects = [
      { degrees: 0, name: 'Conjunção', tolerance: 8, strength: 10 },
      { degrees: 60, name: 'Sextil', tolerance: 6, strength: 6 },
      { degrees: 90, name: 'Quadratura', tolerance: 7, strength: 7 },
      { degrees: 120, name: 'Trígono', tolerance: 8, strength: 9 },
      { degrees: 180, name: 'Oposição', tolerance: 8, strength: 8 }
    ]
    
    for (const aspect of aspects) {
      const diff = Math.abs(adjustedOrb - aspect.degrees)
      
      if (diff <= aspect.tolerance) {
        return {
          planet1: planet1.name,
          planet2: planet2.name,
          aspect: aspect.name,
          orb: diff,
          strength: Math.max(1, aspect.strength - Math.floor(diff))
        }
      }
    }
    
    return null
  }

  // Overload para compatibilidade com código existente
  private calculateAspect(orb: number): { name: string, orb: number, strength: number } | null {
    const aspects = [
      { degrees: 0, name: 'Conjunção', tolerance: 8, strength: 10 },
      { degrees: 60, name: 'Sextil', tolerance: 6, strength: 6 },
      { degrees: 90, name: 'Quadratura', tolerance: 7, strength: 7 },
      { degrees: 120, name: 'Trígono', tolerance: 8, strength: 9 },
      { degrees: 180, name: 'Oposição', tolerance: 8, strength: 8 }
    ]
    
    for (const aspect of aspects) {
      const diff = Math.abs(orb - aspect.degrees)
      const altDiff = Math.abs(360 - orb - aspect.degrees)
      const finalOrb = Math.min(diff, altDiff)
      
      if (finalOrb <= aspect.tolerance) {
        return {
          name: aspect.name,
          orb: finalOrb,
          strength: Math.max(1, aspect.strength - Math.floor(finalOrb))
        }
      }
    }
    
    return null
  }

  /**
   * Obtém regente da casa astrológica
   */
  private getHouseRuler(houseNumber: number): string {
    const rulers = [
      'Marte',     // Casa 1
      'Vênus',     // Casa 2
      'Mercúrio',  // Casa 3
      'Lua',       // Casa 4
      'Sol',       // Casa 5
      'Mercúrio',  // Casa 6
      'Vênus',     // Casa 7
      'Marte',     // Casa 8
      'Júpiter',   // Casa 9
      'Saturno',   // Casa 10
      'Saturno',   // Casa 11
      'Júpiter'    // Casa 12
    ]
    
    return rulers[houseNumber - 1] || 'Desconhecido'
  }
}

export default new NatalChartService()