import { normalizePlanet, normalizeSign, normalizeHouse } from '../../astro/normalize';
import { ASPECT_ORBS, ASPECT_WEIGHTS } from '../../astro/aspect-config';
import type { AspectName } from '../../astro/aspects.types';
import type { BirthData } from "../../screens/onboarding/BirthDataForm"


/**
 * ✨ SISTEMA AVANÇADO DE PRECISÃO ASTROLÓGICA
 * Baseado em técnicas profissionais de Astrosignature
 *
 * Este módulo centraliza o cálculo de áreas da vida, dignidades, aspectos e parser de dados externos.
 */

/**
 * Representa a posição de um planeta no mapa astrológico.
 */
export interface PlanetPosition {
  name: string
  longitude: number
  latitude: number
  speed: number
  sign: string
  house: number
  dignity: number // -5 (queda) a +5 (exaltação)
  retrograde: boolean
}

/**
 * Representa um aspecto astrológico entre dois planetas.
 */
export interface Aspect {
  planet1: string
  planet2: string
  aspect: string
  orb: number
  exact: number // graus exatos do aspecto
  applying: boolean
  strength: number // 0-10
}

/**
 * Estrutura de dados astrológicos padronizada para cálculos internos.
 */
export interface AstrologyData {
  planets: PlanetPosition[]
  aspects: Aspect[]
  houses: {
    number: number
    sign: string
    cusp: number
  }[]
}

/**
 * Resultado do cálculo de uma área da vida.
 */
export interface LifeAreaCalculation {
  name: string
  rawScore: number
  adjustedScore: number
  factors: {
    planetaryScore: number
    aspectScore: number
    houseScore: number
    dignityScore: number
    transitScore: number
  }
  confidence: number
  detailedBreakdown: string[]
}

// DIGNIDADES PLANETÁRIAS (valores tradicionais)
const PLANETARY_DIGNITIES: Record<string, Record<string, number>> = {
  sun: {
    leo: 5,        // domicílio
    aries: 4,      // exaltação  
    aquarius: -5,  // detrimento
    libra: -4      // queda
  },
  moon: {
    cancer: 5,     // domicílio
    taurus: 4,     // exaltação
    capricorn: -5, // detrimento
    scorpio: -4    // queda
  },
  mercury: {
    gemini: 5,     // domicílio
    virgo: 5,      // domicílio
    aquarius: 4,   // exaltação
    sagittarius: -5, // detrimento
    pisces: -5     // detrimento
  },
  venus: {
    taurus: 5,     // domicílio
    libra: 5,      // domicílio
    pisces: 4,     // exaltação
    scorpio: -5,   // detrimento
    aries: -5,     // detrimento
    virgo: -4      // queda
  },
  mars: {
    aries: 5,      // domicílio
    scorpio: 5,    // domicílio (tradicional)
    capricorn: 4,  // exaltação
    libra: -5,     // detrimento
    taurus: -5,    // detrimento
    cancer: -4     // queda
  },
  jupiter: {
    sagittarius: 5, // domicílio
    pisces: 5,     // domicílio (tradicional)
    cancer: 4,     // exaltação
    gemini: -5,    // detrimento
    virgo: -5,     // detrimento
    capricorn: -4  // queda
  },
  saturn: {
    capricorn: 5,  // domicílio
    aquarius: 5,   // domicílio (tradicional)
    libra: 4,      // exaltação
    cancer: -5,    // detrimento
    leo: -5,       // detrimento
    aries: -4      // queda
  }
}


// Mapeamento de nomes de aspectos em inglês para o padrão do app (português)
const ASPECT_NAME_MAP: Record<string, AspectName> = {
  conjunction: 'conjunção',
  opposition: 'oposição',
  trine: 'trígono',
  square: 'quadratura',
  sextile: 'sextil',
  quincunx: 'quincúncio',
  semisextile: 'semissextil',
  semisquare: 'semiquadratura',
  sesquiquadrate: 'sesquiquadratura',
  // fallback para nomes já em português
  'conjunção': 'conjunção',
  'oposição': 'oposição',
  'trígono': 'trígono',
  'quadratura': 'quadratura',
  'sextil': 'sextil',
  'quincúncio': 'quincúncio',
  'semissextil': 'semissextil',
  'semiquadratura': 'semiquadratura',
  'sesquiquadratura': 'sesquiquadratura',
};

// ÁREAS DA VIDA E SUAS CORRESPONDÊNCIAS ASTROLÓGICAS
const LIFE_AREAS_CONFIG = {
  love: {
    primaryPlanets: ['venus', 'mars'],
    secondaryPlanets: ['moon', 'jupiter'],
    houses: [5, 7, 8], // romance, parcerias, intimidade
    baseScore: 60,
    criticalThreshold: 30,
    aspectMultiplier: {
      venus: 2.0,
      mars: 1.8,
      moon: 1.5,
      jupiter: 1.3
    }
  },
  
  career: {
    primaryPlanets: ['saturn', 'jupiter', 'mars'],
    secondaryPlanets: ['sun', 'mercury'],
    houses: [6, 10, 2], // trabalho, carreira, recursos
    baseScore: 60,
    criticalThreshold: 30,
    aspectMultiplier: {
      saturn: 2.0,
      jupiter: 1.8,
      mars: 1.6,
      sun: 1.4,
      mercury: 1.2
    }
  },
  
  health: {
    primaryPlanets: ['mars', 'saturn', 'sun'],
    secondaryPlanets: ['moon', 'mercury'],
    houses: [1, 6, 12], // corpo, saúde, inconsciente
    baseScore: 70,
    criticalThreshold: 35,
    aspectMultiplier: {
      mars: 2.0,
      saturn: 1.8,
      sun: 1.6,
      moon: 1.4,
      mercury: 1.2
    }
  },
  
  family: {
    primaryPlanets: ['moon', 'jupiter', 'saturn'],
    secondaryPlanets: ['venus', 'mercury'],
    houses: [4, 10, 3], // lar, família, comunicação
    baseScore: 55,
    criticalThreshold: 25,
    aspectMultiplier: {
      moon: 2.0,
      jupiter: 1.8,
      saturn: 1.6,
      venus: 1.4,
      mercury: 1.2
    }
  },
  
  spirituality: {
    primaryPlanets: ['jupiter', 'neptune', 'pluto'],
    secondaryPlanets: ['moon', 'saturn'],
    houses: [9, 12], // filosofia, transcendência
    baseScore: 65,
    criticalThreshold: 30,
    aspectMultiplier: {
      jupiter: 2.0,
      neptune: 1.8,
      pluto: 1.6,
      moon: 1.4,
      saturn: 1.2
    }
  }
}

/**
 * Centralizador dos cálculos astrológicos avançados do app.
 * Inclui métodos para cálculo de áreas da vida, parser de dados externos e breakdown detalhado.
 */
export class AstrologyCalculator {
  
  /**
   * Calcula o status de uma área da vida usando dados astrológicos reais
   */
  /**
   * Calcula o status de uma área da vida usando dados astrológicos reais.
   * @param areaName Nome da área (ex: 'love', 'career')
   * @param astrologyData Dados astrológicos padronizados
   * @returns Resultado detalhado do cálculo da área
   */
  static calculateLifeAreaStatus(
    areaName: keyof typeof LIFE_AREAS_CONFIG,
    astrologyData: AstrologyData
  ): LifeAreaCalculation {
    const config = LIFE_AREAS_CONFIG[areaName]
    if (!config) {
      throw new Error(`Área da vida '${areaName}' não configurada`)
    }

    console.log(`🔮 Calculando ${areaName} com precisão astrológica avançada...`)

    // 1. PONTUAÇÃO PLANETÁRIA
    const planetaryScore = AstrologyCalculator.calculatePlanetaryScore(
      astrologyData.planets,
      config.primaryPlanets,
      config.secondaryPlanets,
      config.aspectMultiplier
    )

    // 2. PONTUAÇÃO DOS ASPECTOS
    const aspectScore = AstrologyCalculator.calculateAspectScore(
      astrologyData.aspects,
      config.primaryPlanets,
      config.aspectMultiplier
    )

    // 3. PONTUAÇÃO DAS CASAS
    const houseScore = AstrologyCalculator.calculateHouseScore(
      astrologyData.planets,
      config.houses,
      config.primaryPlanets
    )

    // 4. PONTUAÇÃO DE DIGNIDADE
    const dignityScore = AstrologyCalculator.calculateDignityScore(
      astrologyData.planets,
      config.primaryPlanets
    )

    // 5. PONTUAÇÃO DE TRÂNSITOS (placeholder para dados reais)
    const transitScore = AstrologyCalculator.calculateTransitScore(astrologyData.planets)

    // SCORE FINAL COM SISTEMA DE PESOS
    const rawScore = config.baseScore + 
      (planetaryScore * 0.25) +
      (aspectScore * 0.30) +
      (houseScore * 0.15) +
      (dignityScore * 0.20) +
      (transitScore * 0.10)

    const adjustedScore = Math.max(20, Math.min(95, Math.round(rawScore)))

    // CONFIANÇA BASEADA NA QUANTIDADE DE DADOS
    const confidence = AstrologyCalculator.calculateConfidence(astrologyData, config)

    // BREAKDOWN DETALHADO
    const detailedBreakdown = AstrologyCalculator.generateDetailedBreakdown({
      planetaryScore,
      aspectScore,
      houseScore,
      dignityScore,
      transitScore
    }, areaName)

    console.log(`✨ ${areaName}: ${adjustedScore}% (confiança: ${confidence}%)`)

    return {
      name: areaName,
      rawScore,
      adjustedScore,
      factors: {
        planetaryScore,
        aspectScore,
        houseScore,
        dignityScore,
        transitScore
      },
      confidence,
      detailedBreakdown
    }
  }

  /**
   * Calcula pontuação planetária baseada em posições e dignidades
   */
  /**
   * Calcula pontuação planetária baseada em posições e dignidades.
   */
  private static calculatePlanetaryScore(
    planets: PlanetPosition[],
    primaryPlanets: string[],
    secondaryPlanets: string[],
    multipliers: Record<string, number>
  ): number {
    let score = 0


    planets.forEach(planet => {
      const planetName = normalizePlanet(planet.name)
      const multiplier = multipliers[planetName] || 1

      if (primaryPlanets.map(normalizePlanet).includes(planetName)) {
        // Planeta primário tem peso maior
        let planetScore = 8 * multiplier

        // Retrógrado reduz força
        if (planet.retrograde) {
          planetScore *= 0.7
        }

        // Velocidade afeta (muito lento = fraco, muito rápido = instável)
        const speedFactor = AstrologyCalculator.calculateSpeedFactor(planet)
        planetScore *= speedFactor

        score += planetScore
      } else if (secondaryPlanets.map(normalizePlanet).includes(planetName)) {
        // Planeta secundário tem peso menor
        let planetScore = 4 * multiplier

        if (planet.retrograde) {
          planetScore *= 0.8
        }

        score += planetScore
      }
    })

    return Math.min(40, Math.max(-20, score))
  }

  /**
   * Calcula fator de velocidade planetária
   */
  /**
   * Calcula fator de velocidade planetária para ajuste de força.
   */
  private static calculateSpeedFactor(planet: PlanetPosition): number {
    const speedRanges = {
      sun: { min: 0.95, max: 1.02, optimal: 0.99 },
      moon: { min: 11, max: 15, optimal: 13 },
      mercury: { min: 0.5, max: 2.2, optimal: 1.3 },
      venus: { min: 0.5, max: 1.3, optimal: 0.9 },
      mars: { min: 0.3, max: 0.8, optimal: 0.5 },
      jupiter: { min: 0.08, max: 0.25, optimal: 0.15 },
      saturn: { min: 0.03, max: 0.13, optimal: 0.08 }
    }

    const planetName = planet.name.toLowerCase()
    const range = speedRanges[planetName as keyof typeof speedRanges]
    
    if (!range) return 1.0

    const speed = Math.abs(planet.speed)
    
    // Se está muito lento ou muito rápido, reduz força
    if (speed < range.min || speed > range.max) {
      return 0.8
    }
    
    // Se está próximo do ótimo, aumenta força
    const optimalDistance = Math.abs(speed - range.optimal)
    const rangeSize = range.max - range.min
    const normalizedDistance = optimalDistance / rangeSize
    
    return Math.max(0.8, 1.2 - normalizedDistance)
  }

  /**
   * Calcula pontuação dos aspectos com orbes precisos
   */
  /**
   * Calcula pontuação dos aspectos com orbes precisos.
   */
  private static calculateAspectScore(
    aspects: Aspect[],
    relevantPlanets: string[],
    multipliers: Record<string, number>
  ): number {
    let score = 0


    aspects.forEach(aspect => {
      const planet1 = normalizePlanet(aspect.planet1)
      const planet2 = normalizePlanet(aspect.planet2)
      // Converte nome do aspecto para padrão do app
      const aspectName = ASPECT_NAME_MAP[aspect.aspect.toLowerCase()] || aspect.aspect.toLowerCase();
      // Verifica se pelo menos um planeta é relevante
      const isRelevant = relevantPlanets.map(normalizePlanet).includes(planet1) || relevantPlanets.map(normalizePlanet).includes(planet2)
      if (isRelevant && ASPECT_ORBS[aspectName as AspectName]) {
        // Força base do aspecto (usando peso do config global)
        const orbMax = ASPECT_ORBS[aspectName as AspectName] || 1;
        const weight = ASPECT_WEIGHTS[aspectName as AspectName] || 1;
        const orbFactor = Math.max(0, 1 - (aspect.orb / orbMax));
        let aspectStrength = 10 * weight * orbFactor;
        // Aplica multiplicadores dos planetas
        const multiplier1 = multipliers[planet1] || 1;
        const multiplier2 = multipliers[planet2] || 1;
        const avgMultiplier = (multiplier1 + multiplier2) / 2;
        aspectStrength *= avgMultiplier;
        // Bônus se está aplicando
        if (aspect.applying) {
          aspectStrength *= 1.2;
        }
        // Aspectos harmônicos vs desafiadores
        if (['trígono', 'sextil', 'conjunção'].includes(aspectName)) {
          score += aspectStrength;
        } else if (['quadratura', 'oposição'].includes(aspectName)) {
          score -= aspectStrength * 0.6; // Desafiadores são menos negativos
        } else {
          score += aspectStrength * 0.5; // Aspectos menores
        }
      }
    });

    return Math.min(30, Math.max(-30, score))
  }

  /**
   * Calcula pontuação das casas astrológicas
   */
  /**
   * Calcula pontuação das casas astrológicas.
   */
  private static calculateHouseScore(
    planets: PlanetPosition[],
    relevantHouses: number[],
    relevantPlanets: string[]
  ): number {
    let score = 0

    planets.forEach(planet => {
      const planetName = normalizePlanet(planet.name)
      if (relevantPlanets.map(normalizePlanet).includes(planetName) && relevantHouses.includes(planet.house)) {
        // Planeta relevante em casa relevante = bônus
        score += 6
      }
    })

    return Math.min(20, score)
  }

  /**
   * Calcula pontuação de dignidade planetária
   */
  /**
   * Calcula pontuação de dignidade planetária.
   */
  private static calculateDignityScore(
    planets: PlanetPosition[],
    relevantPlanets: string[]
  ): number {
    let score = 0

    planets.forEach(planet => {
      const planetName = normalizePlanet(planet.name)
      if (relevantPlanets.map(normalizePlanet).includes(planetName)) {
        const signName = normalizeSign(planet.sign)
        const dignities = PLANETARY_DIGNITIES[planetName]
        if (dignities && dignities[signName]) {
          score += dignities[signName] * 2 // Multiplica por 2 para dar mais peso
        }
      }
    })

    return Math.min(15, Math.max(-15, score))
  }

  /**
   * Calcula pontuação de trânsitos (placeholder para dados reais)
   */
  /**
   * Calcula pontuação de trânsitos (placeholder para dados reais).
   */
  private static calculateTransitScore(planets: PlanetPosition[]): number {
    // Por enquanto, usa dados simulados baseados nas posições atuais
    // No futuro, isso será calculado com trânsitos reais
    return Math.floor(Math.random() * 10) - 5
  }

  /**
   * Calcula confiança baseada na quantidade de dados disponíveis
   */
  /**
   * Calcula confiança baseada na quantidade de dados disponíveis.
   */
  private static calculateConfidence(
    astrologyData: AstrologyData,
    config: any
  ): number {
    let dataPoints = 0
    let maxDataPoints = 0

    // Verifica planetas disponíveis
    config.primaryPlanets.forEach((planetName: string) => {
      maxDataPoints += 2
      const planet = astrologyData.planets.find(p => 
        normalizePlanet(p.name) === normalizePlanet(planetName)
      )
      if (planet) {
        dataPoints += 1
        if (planet.dignity !== 0) dataPoints += 1
      }
    })

    // Verifica aspectos
    maxDataPoints += 10
    dataPoints += Math.min(10, astrologyData.aspects.length)

    // Verifica casas
    maxDataPoints += 5
    dataPoints += Math.min(5, astrologyData.houses.length)

    return Math.round((dataPoints / maxDataPoints) * 100)
  }

  /**
   * Gera breakdown detalhado dos cálculos
   */
  /**
   * Gera breakdown detalhado dos cálculos.
   */
  private static generateDetailedBreakdown(
    factors: any,
    areaName: string
  ): string[] {
    const breakdown = []

    breakdown.push(`🎯 Área: ${areaName.toUpperCase()}`)
    breakdown.push(`🌟 Influência Planetária: ${factors.planetaryScore.toFixed(1)} pontos`)
    breakdown.push(`✨ Força dos Aspectos: ${factors.aspectScore.toFixed(1)} pontos`)
    breakdown.push(`🏠 Posição nas Casas: ${factors.houseScore.toFixed(1)} pontos`)
    breakdown.push(`👑 Dignidades: ${factors.dignityScore.toFixed(1)} pontos`)
    breakdown.push(`🔄 Trânsitos: ${factors.transitScore.toFixed(1)} pontos`)

    return breakdown
  }

  /**
   * Converte dados da API Prokerala para formato interno
   */
  /**
   * Converte dados da API Prokerala para formato interno padronizado.
   * @param prokeralaData Dados brutos da API externa
   * @returns Dados astrológicos padronizados
   */
  static convertProkeralaData(prokeralaData: any): AstrologyData {
    // Conversão dos dados da Prokerala para formato padronizado
    const planets: PlanetPosition[] = []
    const aspects: Aspect[] = []
  const houses: { number: number; sign: string; cusp: number }[] = []

    console.log('🔍 Convertendo dados da Prokerala:', {
      hasTransitDetails: !!(prokeralaData.transit_details),
      hasPlanetPosition: !!(prokeralaData.planet_position),
      hasTransitAspect: !!(prokeralaData.transit_aspect),
      keys: Object.keys(prokeralaData || {})
    })

    // DEBUG COMPLETO: Estrutura da resposta da API
    console.log('🔍 === ESTRUTURA REAL DOS DADOS DA API ===')
    console.log('🔍 Chaves principais:', Object.keys(prokeralaData || {}))
    
    // Debug específico para aspectos
    if (prokeralaData.transit_aspect) {
      console.log('🔗 transit_aspect existe!')
      console.log('🔗 transit_aspect tipo:', typeof prokeralaData.transit_aspect)
      console.log('🔗 transit_aspect é array?', Array.isArray(prokeralaData.transit_aspect))
      
      if (Array.isArray(prokeralaData.transit_aspect)) {
        console.log('🔗 transit_aspect length:', prokeralaData.transit_aspect.length)
        if (prokeralaData.transit_aspect.length > 0) {
          console.log('🔗 Primeiro aspecto completo:', JSON.stringify(prokeralaData.transit_aspect[0], null, 2))
        }
      } else if (typeof prokeralaData.transit_aspect === 'object') {
        console.log('🔗 transit_aspect é objeto!')
        console.log('🔗 transit_aspect chaves:', Object.keys(prokeralaData.transit_aspect))
        console.log('🔗 transit_aspect estrutura:', JSON.stringify(prokeralaData.transit_aspect, null, 2).substring(0, 500))
      }
    } else {
      console.log('🔗 transit_aspect NÃO existe!')
    }
    
    // Debug para outras possíveis localizações de aspectos
    if (prokeralaData.aspects) {
      console.log('🔗 aspects direto existe!')
      console.log('🔗 aspects tipo:', typeof prokeralaData.aspects, 'length:', Array.isArray(prokeralaData.aspects) ? prokeralaData.aspects.length : 'not array')
    }
    
    if (prokeralaData.data) {
      console.log('🔗 data existe!')
      console.log('🔗 data chaves:', Object.keys(prokeralaData.data || {}))
    }
    
    // Extrai posições planetárias - parser robusto baseado nos logs reais
    let planetData = []
    
    // Baseado nos logs, a estrutura real é:
    // planet_position: { planets: [...] }
    if (prokeralaData.planet_position?.planets) {
      planetData = prokeralaData.planet_position.planets
      console.log('📍 Usando planet_position.planets (estrutura real)')
    } else if (Array.isArray(prokeralaData.planet_position)) {
      planetData = prokeralaData.planet_position
      console.log('📍 Usando planet_position como array direto')
    } else if (prokeralaData.planet_position?.data) {
      planetData = prokeralaData.planet_position.data
      console.log('📍 Usando planet_position.data')
    } else if (prokeralaData.transit_details?.planets) {
      planetData = prokeralaData.transit_details.planets
      console.log('📍 Usando transit_details.planets')
    } else if (prokeralaData.planets) {
      planetData = prokeralaData.planets
      console.log('📍 Usando planets direto')
    } else if (prokeralaData.data?.planets) {
      planetData = prokeralaData.data.planets
      console.log('📍 Usando data.planets')
    }

    console.log('📊 Dados planetários encontrados:', planetData?.length || 0)
    if (planetData?.length > 0) {
      console.log('📍 Primeiro planeta de exemplo:', JSON.stringify(planetData[0], null, 2))
    } else {
      console.log('❌ Nenhum planeta encontrado. Estrutura completa:', JSON.stringify(prokeralaData, null, 2))
    }

    if (planetData && Array.isArray(planetData)) {
      console.log('🔍 Processando dados planetários:', planetData.length, 'planetas')
      planetData.forEach((planet: any, index: number) => {
        // Baseado nos logs reais, a estrutura é:
        // { name: "Sun", longitude: 123.45, latitude: 0, speed: 1.0, sign: { name: "Leo" }, house: { number: 5 } }
        const planetName = normalizePlanet(planet.name || planet.planet || 'Unknown')
        const longitude = planet.longitude || planet.long || 0
        const latitude = planet.latitude || planet.lat || 0
        const speed = planet.speed || planet.velocity || 0
        const signName = normalizeSign(planet.sign?.name || planet.sign || 'Unknown')
        const houseNumber = planet.house?.number || planet.house || 1
        
        console.log(`📍 Planeta ${index + 1}: ${planetName} em ${signName} (casa ${houseNumber})`)
        
        planets.push({
          name: planetName,
          longitude,
          latitude,
          speed,
          sign: signName,
          house: houseNumber,
          dignity: 0, // Será calculado baseado no signo
          retrograde: speed < 0
        })
      })
    } else {
      console.log('❌ planetData não é um array válido:', typeof planetData, planetData)
    }

    // Adiciona dignidades baseadas nos signos
    planets.forEach(planet => {
      const planetName = normalizePlanet(planet.name)
      const signName = normalizeSign(planet.sign)
      const dignities = PLANETARY_DIGNITIES[planetName]
      if (dignities && dignities[signName]) {
        planet.dignity = dignities[signName]
      }
    })

    // Extrai aspectos de trânsito - parser robusto baseado nos logs reais
    let aspectData = []
    
    // CORREÇÃO BASEADA NOS LOGS: Os aspectos estão em transit_aspect, mas provavelmente é um objeto
    console.log('🔍 ANALISANDO transit_aspect...')
    
    if (prokeralaData.transit_aspect) {
      console.log('🔍 transit_aspect existe, tipo:', typeof prokeralaData.transit_aspect)
      console.log('🔍 É array?', Array.isArray(prokeralaData.transit_aspect))
      
      if (Array.isArray(prokeralaData.transit_aspect)) {
        aspectData = prokeralaData.transit_aspect
        console.log('🎯 ENCONTRADO! Usando transit_aspect como array direto')
      } else if (typeof prokeralaData.transit_aspect === 'object') {
        console.log('🔍 transit_aspect é objeto, explorando chaves...')
        
        // Tentar encontrar um array dentro do objeto
        const keys = Object.keys(prokeralaData.transit_aspect)
        console.log('🔍 Chaves em transit_aspect:', keys)
        
        for (const key of keys) {
          const value = prokeralaData.transit_aspect[key]
          if (Array.isArray(value) && value.length > 0) {
            console.log(`🎯 ENCONTRADO! Array de aspectos em transit_aspect.${key} com ${value.length} itens`)
            aspectData = value
            break
          }
        }
        
        // Se não encontrou, talvez o objeto inteiro seja um array mascarado
        if (!aspectData || aspectData.length === 0) {
          const values = Object.values(prokeralaData.transit_aspect)
          if (values.length > 0 && typeof values[0] === 'object') {
            console.log('🎯 TENTATIVA! Usando valores do objeto como array')
            aspectData = values
          }
        }
      }
    }
    
    // Fallbacks originais
    if (!aspectData || aspectData.length === 0) {
      if (Array.isArray(prokeralaData.aspects)) {
        aspectData = prokeralaData.aspects
        console.log('🔗 Usando aspects direto')
      } else if (prokeralaData.data?.aspects && Array.isArray(prokeralaData.data.aspects)) {
        aspectData = prokeralaData.data.aspects
        console.log('🔗 Usando data.aspects')
      } else if (prokeralaData.data && Array.isArray(prokeralaData.data)) {
        aspectData = prokeralaData.data
        console.log('🔗 Usando data como array direto')
      }
    }
    
    // Se ainda não encontrou, tentar debug completo
    if (!aspectData || aspectData.length === 0) {
      console.log('❌ Estrutura de aspectos não reconhecida. Tentando debug completo...')
      console.log('🔍 Chaves disponíveis:', Object.keys(prokeralaData || {}))
      
      // CORREÇÃO ESPECÍFICA: Se transit_aspect existe mas não é array, pode ser objeto
      if (prokeralaData.transit_aspect && typeof prokeralaData.transit_aspect === 'object') {
        console.log('🔍 transit_aspect é objeto, verificando estrutura...')
        console.log('🔍 transit_aspect chaves:', Object.keys(prokeralaData.transit_aspect))
        
        // Verificar se é um objeto que contém array
        for (const [subKey, subValue] of Object.entries(prokeralaData.transit_aspect)) {
          if (Array.isArray(subValue) && subValue.length > 0) {
            console.log(`🎯 Encontrado array de aspectos em transit_aspect.${subKey}`)
            aspectData = subValue
            break
          }
        }
      }
      
      // Se ainda não encontrou, buscar por qualquer array que contenha objetos com planet_one/planet_two
      if (!aspectData || aspectData.length === 0) {
        for (const [key, value] of Object.entries(prokeralaData || {})) {
          if (Array.isArray(value) && value.length > 0) {
            const firstItem = value[0]
            if (firstItem && (firstItem.planet_one || firstItem.planet_two || firstItem.aspect)) {
              console.log(`🎯 Encontrado array de aspectos em: ${key}`)
              aspectData = value
              break
            }
          }
        }
      }
    }

    console.log('🔗 Aspectos encontrados:', aspectData?.length || 0)
    
    // Filtrar aspectos válidos (baseado na estrutura real dos logs)
    if (aspectData && Array.isArray(aspectData)) {
      aspectData = aspectData.filter(aspect => 
        aspect && 
        aspect.planet_one && 
        aspect.planet_two &&
        aspect.aspect
      )
      console.log('🔗 Aspectos válidos após filtro:', aspectData.length)
      
      if (aspectData.length > 0 && aspectData.length < 50) {
        console.log('🔗 Primeiro aspecto de exemplo:', JSON.stringify(aspectData[0], null, 2))
      }
    }

    if (aspectData && Array.isArray(aspectData) && aspectData.length < 1000) { // Evita processar dados inválidos
      aspectData.forEach((aspect: any) => {
        // Baseado nos logs reais, a estrutura é:
        // { planet_one: { name: "Sun" }, planet_two: { name: "Moon" }, aspect: { name: "Conjunction" }, orb: 1.5 }
        const planet1 = normalizePlanet(aspect.planet_one?.name || aspect.planet1?.name || aspect.planet_1?.name || 'Unknown')
        const planet2 = normalizePlanet(aspect.planet_two?.name || aspect.planet2?.name || aspect.planet_2?.name || 'Unknown')
        // Converte nome do aspecto para padrão do app
        const aspectTypeRaw = (aspect.aspect?.name || aspect.aspect_name || aspect.aspect || 'unknown').toLowerCase();
        const aspectType = ASPECT_NAME_MAP[aspectTypeRaw] || aspectTypeRaw;
        const orb = aspect.orb || aspect.orb_value || 0;
        
        console.log(`🔗 Aspecto: ${planet1}-${planet2} ${aspectType} (orb: ${orb})`);
        
        aspects.push({
          planet1,
          planet2,
          aspect: aspectType,
          orb,
          exact: aspect.exact || aspect.exact_aspect || 0,
          applying: aspect.is_applying || aspect.applying || false,
          strength: Math.max(0, 10 - orb) // Força baseada no orb
        });
      });
    }

    console.log(`✅ Conversão concluída: ${planets.length} planetas, ${aspects.length} aspectos`)
    
    // DEBUG: Mostrar alguns exemplos se tiver dados
    if (planets.length > 0) {
      console.log(`🌟 Planetas processados: ${planets.map(p => `${p.name}(${p.sign})`).slice(0, 5).join(', ')}`)
    }
    if (aspects.length > 0 && aspects.length < 20) {
      console.log(`🔗 Aspectos processados: ${aspects.map(a => `${a.planet1}-${a.planet2}(${a.aspect})`).slice(0, 3).join(', ')}`)
    }

  return { planets, aspects, houses }
  }
}

export default AstrologyCalculator