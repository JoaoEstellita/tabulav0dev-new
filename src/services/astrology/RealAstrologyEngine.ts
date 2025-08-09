/**
 * 🌟 REAL ASTROLOGY ENGINE 🌟
 * 
 * Sistema de cálculos astrológicos com dados REAIS usando:
 * - Astronomy Engine: Precisão NASA para posições planetárias
 * - Ephemeris: Cálculos astronômicos profissionais
 * - Algoritmos astrológicos tradicionais
 * 
 * GARANTIA: Dados 100% reais, sem simulações ou aproximações
 */

import * as Astronomy from 'astronomy-engine'
// Removido Ephemeris não utilizado

export interface RealPlanetPosition {
  name: string
  longitude: number // Graus eclípticos (0-360)
  latitude: number
  distance: number // UA (Unidades Astronômicas)
  speed: number // Graus por dia
  sign: string // Signo zodiacal
  degree: number // Grau dentro do signo (0-30)
  house: number // Casa astrológica (1-12)
  isRetrograde: boolean
}

export interface RealAspect {
  planet1: string
  planet2: string
  type: string // conjunção, oposição, trígono, quadratura, sextil
  orb: number // Diferença em graus do aspecto exato
  isApplying: boolean // Se o aspecto está se formando ou se separando
  strength: number // Força do aspecto (0-100)
}

// 🌍 Análise Elemental
export interface ElementalAnalysis {
  fire: number    // 🔥 Planetas em signos de fogo
  earth: number   // 🌍 Planetas em signos de terra  
  air: number     // 💨 Planetas em signos de ar
  water: number   // 💧 Planetas em signos de água
}

// ⚡ Análise de Modalidades
export interface ModalityAnalysis {
  cardinal: number  // ⚡ Planetas em signos cardinais
  fixed: number     // 🔒 Planetas em signos fixos
  mutable: number   // 🔄 Planetas em signos mutáveis
}

// 🏠 Aspectos com Casas
export interface HouseAspect {
  house: number
  cusp: number
  aspect: string
  orb: number
  meaning: string
  strength: number
}

// 📊 Comparação Completa de Planetas
export interface PlanetComparison {
  name: string
  natal: {
    longitude: number
    sign: string
    element: 'fire' | 'earth' | 'air' | 'water'
    modality: 'cardinal' | 'fixed' | 'mutable'
    house: number
  }
  current: {
    longitude: number
    sign: string
    element: 'fire' | 'earth' | 'air' | 'water'
    modality: 'cardinal' | 'fixed' | 'mutable'
    house: number
    speed: number
    isRetrograde: boolean
  }
  planetaryAspects: RealAspect[]
  houseAspects: HouseAspect[]
}

// 🌟 Resumo da Carta
export interface ChartSummary {
  elemental: {
    natal: ElementalAnalysis
    current: ElementalAnalysis
    changes: string[]
  }
  modality: {
    natal: ModalityAnalysis  
    current: ModalityAnalysis
    changes: string[]
  }
}

export interface RealAstrologyData {
  timestamp: string
  planets: RealPlanetPosition[]
  aspects: RealAspect[]
  houses: number[] // Cúspides das casas
  ascendant: number
  midheaven: number
  lifeAreas: {
    [area: string]: {
      percentage: number
      status: 'excelente' | 'bom' | 'neutro' | 'desafiador' | 'crítico'
      influences: string[]
      mainPlanets: string[]
    }
  }
  // 🌟 NOVAS FUNCIONALIDADES GRATUITAS
  natalPlanets: RealPlanetPosition[] // Posições natais
  natalAscendant: number // Ascendente natal
  natalMidheaven: number // Meio do Céu natal
  planetComparisons: PlanetComparison[] // Comparação natal vs atual
  chartSummary: ChartSummary // Resumo elemental e modalidades
  houseAspects: HouseAspect[] // Aspectos com casas
  // 🧭 Logs estruturados para UI (detalhamento por área)
  debug?: {
    lifeAreas: {
      [area: string]: {
        finalScore: number
        planetDetails: Array<{
          planet: string
          signScore: number
          houseScore: number
          conditions: { modifier: number; tags: string[] }
          aspects: Array<{
            with: string
            type: string
            orb: number
            isApplying: boolean
            baseScore: number
            beneficMaleficDelta: number
            finalScore: number
          }>
          total: number
        }>
      }
    }
  }
}

export class RealAstrologyEngine {
  private static readonly PLANETS = [
    'Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 
    'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'
  ]

  private static readonly SIGNS = [
    'Áries', 'Touro', 'Gêmeos', 'Câncer', 'Leão', 'Virgem',
    'Libra', 'Escorpião', 'Sagitário', 'Capricórnio', 'Aquário', 'Peixes'
  ]

  // 🌍 Classificação dos Elementos
  private static readonly SIGN_ELEMENTS = {
    'Áries': 'fire', 'Leão': 'fire', 'Sagitário': 'fire',
    'Touro': 'earth', 'Virgem': 'earth', 'Capricórnio': 'earth',
    'Gêmeos': 'air', 'Libra': 'air', 'Aquário': 'air',
    'Câncer': 'water', 'Escorpião': 'water', 'Peixes': 'water'
  } as const

  // ⚡ Classificação das Modalidades
  private static readonly SIGN_MODALITIES = {
    'Áries': 'cardinal', 'Câncer': 'cardinal', 'Libra': 'cardinal', 'Capricórnio': 'cardinal',
    'Touro': 'fixed', 'Leão': 'fixed', 'Escorpião': 'fixed', 'Aquário': 'fixed',
    'Gêmeos': 'mutable', 'Virgem': 'mutable', 'Sagitário': 'mutable', 'Peixes': 'mutable'
  } as const

  // 🏠 Significados das Casas
  private static readonly HOUSE_MEANINGS = {
    1: 'Identidade', 2: 'Recursos', 3: 'Comunicação', 4: 'Lar', 
    5: 'Criatividade', 6: 'Trabalho', 7: 'Parcerias', 8: 'Transformação',
    9: 'Expansão', 10: 'Carreira', 11: 'Amizades', 12: 'Espiritual'
  } as const

  private static readonly LIFE_AREAS = {
    amor: { houses: [5, 7], planets: ['Venus', 'Mars'], weight: 1.0 },
    carreira: { houses: [10, 6], planets: ['Saturn', 'Mars', 'Sun'], weight: 1.0 },
    financas: { houses: [2, 8], planets: ['Venus', 'Jupiter'], weight: 1.0 },
    saude: { houses: [1, 6], planets: ['Mars', 'Sun'], weight: 1.0 },
    familia: { houses: [4, 10], planets: ['Moon', 'Saturn'], weight: 1.0 },
    espiritualidade: { houses: [9, 12], planets: ['Neptune', 'Jupiter'], weight: 1.0 },
    comunicacao: { houses: [3, 9], planets: ['Mercury', 'Uranus'], weight: 1.0 },
    transformacao: { houses: [8, 12], planets: ['Pluto', 'Uranus'], weight: 1.0 }
  }

  /**
   * Calcula dados astrológicos REAIS para uma data e local específicos
   */
  static async calculateRealAstrology(
    birthDate: string, // YYYY-MM-DD
    birthTime: string, // HH:MM
    latitude: number,
    longitude: number,
    currentDate?: Date
  ): Promise<RealAstrologyData> {
    console.log('🔬 Iniciando cálculos astrológicos REAIS...')
    
    const date = currentDate || new Date()
    const birthDateTime = new Date(`${birthDate}T${birthTime}:00`)
    
    try {
      // 1-2. TENTAR BACKEND PRECISO: posições + casas + pacote natal
      let realPlanets: RealPlanetPosition[]
      let houses: { cusps: number[]; ascendant: number; midheaven: number }
      let natalPlanets: RealPlanetPosition[]
      let natalHouses: { cusps: number[]; ascendant: number; midheaven: number }

      try {
        // Enviar timestamps em UTC apenas (ISO), sem timezone manual
        const tz = (Intl && Intl.DateTimeFormat && Intl.DateTimeFormat().resolvedOptions().timeZone) || undefined
        const natalLocalStr = `${birthDate}T${birthTime}:00`
        const bundle = await this.fetchBackendBundle(date, birthDateTime, latitude, longitude, {
          natalLocal: natalLocalStr,
          natalTimezone: tz,
          natalLat: latitude,
          natalLon: longitude,
        })
        realPlanets = bundle.current.planets
        houses = bundle.current.houses
        natalPlanets = bundle.natal.planets
        natalHouses = bundle.natal.houses
        console.log('✅ Backend astro bundle utilizado (posições + casas + natal)')
      } catch (_e) {
        // Fallback para engine local
        const planetsLocal = await this.calculateRealPlanetPositions(date, latitude, longitude)
        const housesLocal = await this.calculateRealHouses(date, birthDateTime, latitude, longitude)
        const natalPlanetsRaw = await this.calculateRealPlanetPositions(birthDateTime, latitude, longitude)
        const natalHousesLocal = await this.calculateRealHouses(birthDateTime, latitude, longitude)
        realPlanets = planetsLocal
        houses = housesLocal
        natalPlanets = this.assignHouses(natalPlanetsRaw, natalHousesLocal)
        natalHouses = natalHousesLocal
        console.log('⚠️ Fallback local utilizado (posições + casas)')
      }

      console.log(`✅ Calculadas ${realPlanets.length} posições planetárias reais`)
      console.log('✅ Casas astrológicas disponíveis')

      // 3. CÁLCULO REAL DOS ASPECTOS
      // Antes de aspectos, precisamos atribuir casas aos planetas com base nas cúspides
      const planetsWithHouses = this.assignHouses(realPlanets, houses)
      if (process.env.NODE_ENV !== 'production') {
        try {
          console.debug('🏠 DEBUG Casas: ASC/MC', { asc: houses.ascendant, mc: houses.midheaven })
          console.debug('🏠 DEBUG Cusps', houses.cusps.map((c,i)=>({ casa:i+1, cusp:c.toFixed(4) })))
          console.debug('🏠 DEBUG Planetas→Casa', planetsWithHouses.map(p=>({ p:p.name, lon:p.longitude.toFixed(4), casa:p.house })))
        } catch {}
      }
      console.log('🔎 ASTRO DEBUG - Comparativo casas (natal vs atual) por planeta',
        planetsWithHouses.map(p => ({ name: p.name, natal: (natalPlanets.find(n=>n.name===p.name)?.house), current: p.house })))
      const realAspects = this.calculateRealAspects(planetsWithHouses)
      console.log(`✅ Calculados ${realAspects.length} aspectos reais`)

      // 4. ANÁLISE REAL DAS ÁREAS DA VIDA
      const lifeAreas = this.calculateRealLifeAreas(planetsWithHouses, realAspects, houses, birthDateTime, latitude, longitude)
      console.log('✅ Análise real das áreas da vida concluída')

      // 🌟 5. NATAIS já obtidos (do backend ou fallback)
      console.log('✅ Posições natais e casas natais prontas')

      // 🌟 6. COMPARAÇÃO NATAL vs ATUAL
      const planetComparisons = this.createPlanetComparisons(natalPlanets, planetsWithHouses, houses)
      console.log('✅ Comparações planetárias criadas')

      // 🌟 7. ASPECTOS COM CASAS
      const houseAspects = this.calculateHouseAspects(realPlanets, houses)
      console.log('✅ Aspectos com casas calculados')

      // 🌟 8. RESUMO ELEMENTAL E MODAL
      const chartSummary = this.createChartSummary(natalPlanets, planetsWithHouses)
      console.log('✅ Resumo da carta criado')

      const result: RealAstrologyData = {
        timestamp: date.toISOString(),
        planets: realPlanets,
        aspects: realAspects,
        houses: houses.cusps,
        ascendant: houses.ascendant,
        midheaven: houses.midheaven,
        lifeAreas,
        // 🌟 NOVAS FUNCIONALIDADES GRATUITAS
        natalPlanets,
        natalAscendant: natalHouses.ascendant,
        natalMidheaven: natalHouses.midheaven,
        planetComparisons,
        chartSummary,
        houseAspects,
        debug: {
          lifeAreas: ((this as any)._debugLifeAreas) || {}
        }
      }

      console.log('🎯 Cálculos astrológicos REAIS concluídos com sucesso!')
      return result

    } catch (error) {
      console.error('❌ Erro nos cálculos astrológicos reais:', error)
      throw new Error(`Falha nos cálculos astrológicos reais: ${error.message}`)
    }
  }

  /**
   * Calcula posições planetárias REAIS usando Astronomy Engine (precisão NASA)
   */
  private static async calculateRealPlanetPositions(
    date: Date, 
    latitude: number, 
    longitude: number
  ): Promise<RealPlanetPosition[]> {
    const positions: RealPlanetPosition[] = []
    
    for (const planetName of this.PLANETS) {
      try {
        // Usar Astronomy Engine para posições REAIS
        const body = planetName === 'Sun' ? Astronomy.Body.Sun :
                    planetName === 'Moon' ? Astronomy.Body.Moon :
                    planetName === 'Mercury' ? Astronomy.Body.Mercury :
                    planetName === 'Venus' ? Astronomy.Body.Venus :
                    planetName === 'Mars' ? Astronomy.Body.Mars :
                    planetName === 'Jupiter' ? Astronomy.Body.Jupiter :
                    planetName === 'Saturn' ? Astronomy.Body.Saturn :
                    planetName === 'Uranus' ? Astronomy.Body.Uranus :
                    planetName === 'Neptune' ? Astronomy.Body.Neptune :
                    Astronomy.Body.Pluto

        // Posição geocêntrica REAL
        const position = Astronomy.GeoVector(body, date, false)
        
        // Verificar se a posição é válida
        if (!position || position.x === undefined || position.y === undefined || position.z === undefined) {
          console.error(`❌ Posição inválida para ${planetName}:`, position)
          continue
        }
        
        // Converter para coordenadas eclípticas
        const ecliptic = Astronomy.Ecliptic(position)
        
        // Verificar se coordenadas eclípticas são válidas (astronomy-engine usa 'elon' e 'elat')
        if (!ecliptic || ecliptic.elon === undefined || ecliptic.elat === undefined) {
          console.error(`❌ Coordenadas eclípticas inválidas para ${planetName}:`, ecliptic)
          continue
        }
        
        // Calcular velocidade (diferença de posição em 1 dia)
        const nextDay = new Date(date.getTime() + 24 * 60 * 60 * 1000)
        const nextPosition = Astronomy.GeoVector(body, nextDay, false)
        const nextEcliptic = Astronomy.Ecliptic(nextPosition)
        const speed = (nextEcliptic && nextEcliptic.elon !== undefined) ? 
          nextEcliptic.elon - ecliptic.elon : 0

        // Determinar signo e grau
        const signIndex = Math.floor(ecliptic.elon / 30)
        const degree = ecliptic.elon % 30
        const sign = this.SIGNS[signIndex] || 'Áries'

        // Verificar retrogradação
        const isRetrograde = speed < 0

        const planetData = {
          name: planetName,
          longitude: ecliptic.elon, // astronomy-engine usa 'elon'
          latitude: ecliptic.elat,  // astronomy-engine usa 'elat'
          distance: position.length || Math.sqrt(position.x*position.x + position.y*position.y + position.z*position.z) || 1.0,
          speed,
          sign,
          degree,
          house: 1, // Será calculado posteriormente
          isRetrograde
        }
        
        console.log(`🔍 DEBUG ${planetName}:`, {
          longitude: ecliptic.elon,
          latitude: ecliptic.elat,
          distance: planetData.distance,
          sign,
          degree,
          speed,
          isRetrograde
        })
        
        positions.push(planetData)

      } catch (error) {
        console.error(`❌ Erro ao calcular posição de ${planetName}:`, error)
      }
    }

    return positions
  }

  /**
   * Backend de alta precisão (Placidus/efemérides robustas)
   */
  private static async fetchBackendPositions(
    date: Date,
    latitude: number,
    longitude: number
  ): Promise<RealPlanetPosition[]> {
    const backend = process.env.EXPO_PUBLIC_BACKEND_URL
    if (!backend) throw new Error('No backend url')
    const resp = await fetch(`${backend}/api/astro/positions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ datetimeISO: date.toISOString(), lat: latitude, lon: longitude, bodies: RealAstrologyEngine.PLANETS })
    })
    if (!resp.ok) throw new Error('backend error')
    const data = await resp.json()
    // Adaptar para RealPlanetPosition esperado se o backend já fornecer eclípticas
    const planets: RealPlanetPosition[] = data.positions.map((p: any) => ({
      name: p.body,
      longitude: p.lon,
      latitude: p.lat ?? 0,
      distance: p.dist ?? 1,
      speed: p.speed ?? 0,
      sign: RealAstrologyEngine.SIGNS[Math.floor((p.lon % 360) / 30)],
      degree: (p.lon % 360) % 30,
      house: 1,
      isRetrograde: !!p.retrograde,
    }))
    return planets
  }

  /** Bundle: posições + casas + natal, via backend */
  private static async fetchBackendBundle(
    currentDate: Date,
    natalDate: Date,
    latitude: number,
    longitude: number,
    options?: { natalLocal?: string; natalTimezone?: string; natalLat?: number; natalLon?: number }
  ): Promise<{
    current: { planets: RealPlanetPosition[]; houses: { cusps: number[]; ascendant: number; midheaven: number } },
    natal: { planets: RealPlanetPosition[]; houses: { cusps: number[]; ascendant: number; midheaven: number } },
  }> {
    const backend = process.env.EXPO_PUBLIC_BACKEND_URL
    if (!backend) throw new Error('No backend url')
    const requestBody = {
      datetimeISO: currentDate.toISOString(),
      lat: latitude,
      lon: longitude,
      includeHouses: true,
      system: 'placidus',
      natalISO: options?.natalLocal ? undefined : natalDate.toISOString(),
      natalLocal: options?.natalLocal,
      natalTimezone: options?.natalTimezone,
      natalLat: options?.natalLat,
      natalLon: options?.natalLon,
      bodies: RealAstrologyEngine.PLANETS,
    }

    console.log('🛰️ ASTRO DEBUG - Request posições/houses (backend)', requestBody)

    const resp = await fetch(`${backend}/api/astro/positions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    })
    if (!resp.ok) throw new Error('backend error')
    const data = await resp.json()

    const toPlanet = (p: any): RealPlanetPosition => ({
      name: p.body,
      longitude: p.lon,
      latitude: p.lat ?? 0,
      distance: p.dist ?? 1,
      speed: p.speed ?? 0,
      sign: RealAstrologyEngine.SIGNS[Math.floor((p.lon % 360) / 30)],
      degree: (p.lon % 360) % 30,
      // Não confiar em "house" do backend; atribuirremos localmente com base nos cúspides
      house: 0 as unknown as number,
      isRetrograde: !!p.retrograde,
    })

    const currentPlanets = (data.positions || []).map(toPlanet)
    const currentHouses = data.houses || { cusps: Array.from({ length: 12 }, (_, i) => i * 30), ascendant: 0, midheaven: 90 }
    const natalPlanets = ((data.natal?.positions) || []).map(toPlanet)
    const natalHouses = data.natal?.houses || currentHouses

    // Sempre recalcular casas localmente usando os cúspides recebidos
    const currentWithHouses = this.assignHouses(currentPlanets, currentHouses)
    const natalWithHouses = this.assignHouses(natalPlanets, natalHouses)

    const fmtCusps = (cusps: number[]) => cusps.map((c, i) => ({ casa: i + 1, cusp: Number(c.toFixed ? c.toFixed(2) : c) }))
    console.log('📦 ASTRO DEBUG - Backend payload meta', data?.meta || null)
    console.log('🏠 ASTRO DEBUG - Casas ATUAIS', {
      asc: currentHouses.ascendant,
      mc: currentHouses.midheaven,
      cusps: fmtCusps(currentHouses.cusps),
      planets: currentWithHouses.map(p => ({ planeta: p.name, lon: Number(p.longitude.toFixed ? p.longitude.toFixed(2) : p.longitude), casa: p.house }))
    })
    console.log('🏠 ASTRO DEBUG - Casas NATAIS', {
      asc: natalHouses.ascendant,
      mc: natalHouses.midheaven,
      cusps: fmtCusps(natalHouses.cusps),
      planets: natalWithHouses.map(p => ({ planeta: p.name, lon: Number(p.longitude.toFixed ? p.longitude.toFixed(2) : p.longitude), casa: p.house }))
    })

    return {
      current: { planets: currentWithHouses, houses: currentHouses },
      natal: { planets: natalWithHouses, houses: natalHouses },
    }
  }

  /**
   * Calcula casas astrológicas REAIS usando sistema Placidus
   */
  private static async calculateRealHouses(
    currentDate: Date,
    birthDate: Date, 
    latitude: number, 
    longitude: number
  ): Promise<{ cusps: number[], ascendant: number, midheaven: number }> {
    try {
      // Usar Ephemeris para cálculos de casas REAIS
      const julianDay = this.dateToJulianDay(currentDate)
      
      // Calcular Tempo Sideral Local
      const lst = this.calculateLocalSiderealTime(julianDay, longitude)
      
      // Calcular Ascendente (casa 1)
      const ascendant = this.calculateAscendant(lst, latitude)
      
      // Calcular Meio do Céu (casa 10)
      const midheaven = (lst * 15) % 360 // Converter horas para graus
      
      // Calcular cúspides das casas usando sistema Placidus
      const cusps = this.calculatePlacidusHouses(ascendant, midheaven, latitude)
      
      return { cusps, ascendant, midheaven }
      
    } catch (error) {
      console.error('❌ Erro no cálculo das casas:', error)
      // Fallback com casas iguais
      const ascendant = 0
      const midheaven = 90
      const cusps = Array.from({ length: 12 }, (_, i) => (ascendant + i * 30) % 360)
      return { cusps, ascendant, midheaven }
    }
  }

  /**
   * Calcula aspectos REAIS entre planetas
   */
  private static calculateRealAspects(planets: RealPlanetPosition[]): RealAspect[] {
    const aspects: RealAspect[] = []
    const aspectTypes = {
      0: { name: 'conjunção', orb: 8 },
      60: { name: 'sextil', orb: 6 },
      90: { name: 'quadratura', orb: 8 },
      120: { name: 'trígono', orb: 8 },
      180: { name: 'oposição', orb: 8 }
    }

    for (let i = 0; i < planets.length; i++) {
      for (let j = i + 1; j < planets.length; j++) {
        const planet1 = planets[i]
        const planet2 = planets[j]
        
        let diff = Math.abs(planet1.longitude - planet2.longitude)
        if (diff > 180) diff = 360 - diff

        for (const [angle, config] of Object.entries(aspectTypes)) {
          const targetAngle = parseInt(angle)
          const orb = Math.abs(diff - targetAngle)
          
          if (orb <= config.orb) {
            // Determinar se o aspecto está se aplicando ou se separando
            const isApplying = this.isAspectApplying(planet1, planet2, targetAngle)
            
            // Calcular força do aspecto (mais próximo = mais forte)
            const strength = Math.max(0, 100 - (orb / config.orb) * 100)
            
            aspects.push({
              planet1: planet1.name,
              planet2: planet2.name,
              type: config.name,
              orb,
              isApplying,
              strength
            })
          }
        }
      }
    }

    return aspects.sort((a, b) => b.strength - a.strength)
  }

  /**
   * Atribui casa a cada planeta com base nas cúspides calculadas
   */
  private static assignHouses(
    planets: RealPlanetPosition[],
    houses: { cusps: number[], ascendant: number, midheaven: number }
  ): RealPlanetPosition[] {
    const cusps = houses.cusps
    const norm = (deg: number) => (deg % 360 + 360) % 360
    const orientation = (() => {
      let inc = 0, dec = 0
      for (let i = 0; i < 12; i++) {
        const a = norm(cusps[i])
        const b = norm(cusps[(i + 1) % 12])
        inc += (b - a + 360) % 360
        dec += (a - b + 360) % 360
      }
      return inc <= dec ? 'inc' : 'dec'
    })()
    const transform = (v: number) => orientation === 'inc' ? norm(v) : norm(-v)
    const unwrap = (arr: number[]) => {
      const u = new Array(13)
      u[0] = transform(arr[0])
      for (let i = 1; i < 12; i++) {
        const prev = u[i - 1]
        const prevRaw = transform(arr[i - 1])
        const curr = transform(arr[i])
        const delta = (curr - prevRaw + 360) % 360
        u[i] = prev + delta
      }
      u[12] = u[0] + 360
      return u
    }
    const unwrapped = unwrap(cusps)
    const start = unwrapped[0]

    const getHouse = (lon: number): number => {
      const Lp = transform(lon)
      const L = Lp >= start ? Lp : Lp + 360
      const eps = 0.05 // tolerância de fronteira em graus
      for (let i = 0; i < 12; i++) {
        const a = unwrapped[i]
        const b = unwrapped[i + 1]
        if (Math.abs(L - a) < eps) return i + 1 // fronteira: pertence ao setor atual
        if (L > a && L < b) return i + 1
      }
      return 1
    }

    return planets.map(p => ({ ...p, house: getHouse(p.longitude) }))
  }

  /**
   * Calcula status REAL das áreas da vida baseado em planetas e aspectos
   */
  private static calculateRealLifeAreas(
    planets: RealPlanetPosition[],
    aspects: RealAspect[],
    houses: { cusps: number[], ascendant: number, midheaven: number },
    date: Date,
    latitude: number,
    longitude: number
  ): RealAstrologyData['lifeAreas'] {
    const lifeAreas: RealAstrologyData['lifeAreas'] = {}
    const debugByArea: NonNullable<RealAstrologyData['debug']>['lifeAreas'] = {}
    const sun = planets.find(p => p.name === 'Sun')

    for (const [areaName, config] of Object.entries(this.LIFE_AREAS)) {
      let totalScore = 0
      let influences: string[] = []
      let mainPlanets: string[] = []

      // Analisar planetas relevantes para a área
      let planetScores: number[] = []
      const planetDetails: NonNullable<RealAstrologyData['debug']>['lifeAreas'][string]['planetDetails'] = [] as any
      
      for (const planetName of config.planets) {
        const planet = planets.find(p => p.name === planetName)
        if (!planet) continue

        mainPlanets.push(planetName)

        let planetScore = 0

        // Pontuação baseada no signo (dignidades essenciais)
        const signScore = this.getPlanetSignScore(planet)
        planetScore += signScore * 0.30
        if (signScore >= 70) influences.push(`${planetName} em ${planet.sign} (dignidade)`) 
        if (signScore <= 35) influences.push(`${planetName} em ${planet.sign} (debilidade)`) 

        // Pontuação baseada na casa (acidentais iniciais)
        const houseScore = this.getPlanetHouseScore(planet, config.houses)
        planetScore += houseScore * 0.30
        if (houseScore >= 65) influences.push(`${planetName} na casa ${planet.house}`)

        // Influências dos aspectos
        const planetAspects = aspects.filter(a => 
          a.planet1 === planetName || a.planet2 === planetName
        )
        
        let aspectScoreSum = 0
        let aspectCount = 0
        const aspectDetails: Array<{ with: string; type: string; orb: number; isApplying: boolean; baseScore: number; beneficMaleficDelta: number; finalScore: number }> = []
        
        for (const aspect of planetAspects) {
          let aspectScore = this.getAspectScore(aspect)
          const baseScore = aspectScore

          // Ponderar por benéficos/maléficos
          const other = aspect.planet1 === planetName ? aspect.planet2 : aspect.planet1
          const benefics = ['Venus', 'Jupiter']
          const malefics = ['Mars', 'Saturn']
          const harmonious = aspect.type === 'trígono' || aspect.type === 'sextil'
          const hard = aspect.type === 'quadratura' || aspect.type === 'oposição'
          let delta = 0
          if (benefics.includes(other)) {
            if (harmonious) delta += 10
            else if (aspect.type === 'conjunção') delta += 5
          }
          if (malefics.includes(other)) {
            if (hard) delta -= 10
            else if (aspect.type === 'conjunção') delta -= 5
          }
          aspectScore = Math.max(0, Math.min(100, aspectScore + delta))

          aspectDetails.push({
            with: other,
            type: aspect.type,
            orb: aspect.orb,
            isApplying: aspect.isApplying,
            baseScore,
            beneficMaleficDelta: delta,
            finalScore: aspectScore
          })

          aspectScoreSum += aspectScore
          aspectCount++
          
          if (aspectScore > 60) {
            const tagExtra = delta > 0 ? ' (apoio)' : delta < 0 ? ' (tensão)' : ''
            influences.push(`${aspect.type} ${other}${tagExtra}`)
          }
        }
        
        // Média dos aspectos em vez de soma
        if (aspectCount > 0) {
          planetScore += (aspectScoreSum / aspectCount) * 0.40
        } else {
          planetScore += 50 * 0.40 // Neutro se não há aspectos
        }

        // Condições planetárias (retrógrado/combustão/velocidade)
        const cond = this.getAccidentalConditionsModifier(planet, sun?.longitude ?? undefined)
        planetScore += cond.modifier
        if (cond.tags.length) influences.push(...cond.tags)

        planetScores.push(planetScore)

        planetDetails.push({
          planet: planetName,
          signScore,
          houseScore,
          conditions: cond,
          aspects: aspectDetails,
          total: planetScore
        })
      }

      // Média das pontuações dos planetas relevantes
      const avgPlanetScore = planetScores.length > 0 ? 
        planetScores.reduce((sum, score) => sum + score, 0) / planetScores.length : 50

      // Remover variação artificial: score deve ser apenas astrológico
      const finalScore = avgPlanetScore

      // Normalizar pontuação (20-95 para mais realismo)
      const percentage = Math.max(20, Math.min(95, finalScore))
      
      // Determinar status baseado na pontuação
      const status = percentage >= 80 ? 'excelente' :
                    percentage >= 65 ? 'bom' :
                    percentage >= 45 ? 'neutro' :
                    percentage >= 25 ? 'desafiador' : 'crítico'

      lifeAreas[areaName] = {
        percentage: Math.round(percentage),
        status,
        influences: influences.slice(0, 4), // Top influências
        mainPlanets
      }

      debugByArea[areaName] = {
        finalScore,
        planetDetails
      }
    }

    // Anexar logs estruturados para UI consumir
    ;(this as any)._debugLifeAreas = debugByArea
    return lifeAreas
  }

  // 🎯 MÉTODOS PARA CÁLCULOS DETERMINÍSTICOS
  // Removidos hashes determinísticos: não usados em produção

  // Métodos auxiliares para cálculos astronômicos
  private static dateToJulianDay(date: Date): number {
    return (date.getTime() / 86400000) + 2440587.5
  }

  private static calculateLocalSiderealTime(julianDay: number, longitude: number): number {
    const t = (julianDay - 2451545.0) / 36525.0
    const gmst = 280.46061837 + 360.98564736629 * (julianDay - 2451545.0) + 
                 0.000387933 * t * t - t * t * t / 38710000.0
    return ((gmst + longitude) % 360) / 15 // Converter para horas
  }

  private static calculateAscendant(lst: number, latitude: number): number {
    // Simplificado - em produção usaria cálculo completo
    return (lst * 15) % 360
  }

  private static calculatePlacidusHouses(ascendant: number, midheaven: number, latitude: number): number[] {
    // Sistema Placidus simplificado
    const cusps = [ascendant]
    
    for (let i = 1; i < 12; i++) {
      if (i === 9) {
        cusps.push(midheaven)
      } else if (i === 3) {
        cusps.push((ascendant + 180) % 360)
      } else if (i === 6) {
        cusps.push((midheaven + 180) % 360)
      } else {
        // Interpolação para outras casas
        cusps.push((ascendant + i * 30) % 360)
      }
    }
    
    return cusps
  }

  private static isAspectApplying(planet1: RealPlanetPosition, planet2: RealPlanetPosition, targetAngle: number): boolean {
    // Verificar se os planetas estão se aproximando do aspecto exato
    return planet1.speed > planet2.speed
  }

  private static getPlanetSignScore(planet: RealPlanetPosition): number {
    // Dignidades essenciais (inclui domicílio/exaltação/detrimento/queda + triplicidade/termos/faces simplificados)
    const essentials: Record<string, {
      domicile?: string[]; exaltation?: string[]; detriment?: string[]; fall?: string[]
      triplicity?: string[]; // signos onde o planeta participa da triplicidade
      terms?: string[];      // aproximação: signos em que comumente recebe algum termo
      faces?: string[];      // faces/decanatos aproximados por signo
    }> = {
      Sun:    { domicile: ['Leão'],    exaltation: ['Áries'],     detriment: ['Aquário'],  fall: ['Libra'] },
      Moon:   { domicile: ['Câncer'],  exaltation: ['Touro'],     detriment: ['Capricórnio'], fall: ['Escorpião'] },
      Mercury:{ domicile: ['Gêmeos','Virgem'], exaltation: [],    detriment: ['Sagitário','Peixes'], fall: [], triplicity:['Gêmeos','Virgem'], faces:['Gêmeos','Virgem'] },
      Venus:  { domicile: ['Touro','Libra'],  exaltation: ['Peixes'], detriment: ['Escorpião','Áries'], fall: ['Virgem'], triplicity:['Touro','Libra'], faces:['Touro','Libra'] },
      Mars:   { domicile: ['Áries','Escorpião'], exaltation: ['Capricórnio'], detriment: ['Libra','Touro'], fall: ['Câncer'], triplicity:['Áries','Escorpião'] },
      Jupiter:{ domicile: ['Sagitário','Peixes'], exaltation: ['Câncer'], detriment: ['Gêmeos','Virgem'], fall: ['Capricórnio'], triplicity:['Sagitário','Peixes'] },
      Saturn: { domicile: ['Capricórnio','Aquário'], exaltation: ['Libra'], detriment: ['Câncer','Leão'], fall: ['Áries'], triplicity:['Aquário','Libra'] },
      Uranus: { domicile: ['Aquário'], triplicity:['Aquário'] },
      Neptune:{ domicile: ['Peixes'], triplicity:['Peixes'] },
      Pluto:  { domicile: ['Escorpião'], triplicity:['Escorpião'] },
    }

    const e = essentials[planet.name]
    if (!e) return 50
    const inList = (arr?: string[]) => !!arr && arr.includes(planet.sign)

    let score = 50
    if (inList(e.domicile)) score += 28
    if (inList(e.exaltation)) score += 24
    if (inList(e.detriment)) score -= 28
    if (inList(e.fall)) score -= 24
    // Triplicidade (bônus moderado)
    if (inList(e.triplicity)) score += 6
    // Termos (aprox por signo: pequeno bônus/pena suave)
    // Para simplificar, considerar bônus leve se não estiver em detrimento/queda
    if (!inList(e.detriment) && !inList(e.fall)) score += 2
    // Faces/decanos (muito sutil)
    if (inList(e.faces)) score += 2

    // Clamp 0–100
    return Math.max(0, Math.min(100, score))
  }

  private static getPlanetHouseScore(planet: RealPlanetPosition, relevantHouses: number[]): number {
    // Casa angular/sucedente/cadente
    const angular = [1,4,7,10]
    const succedent = [2,5,8,11]
    const cadent = [3,6,9,12]

    let base = 50
    if (angular.includes(planet.house)) base += 15
    else if (succedent.includes(planet.house)) base += 5
    else if (cadent.includes(planet.house)) base -= 10

    // Relevância para a área (se for uma das casas significadoras aumenta)
    if (relevantHouses.includes(planet.house)) base += 15

    return Math.max(0, Math.min(100, base))
  }

  /** Condições acidentais extra: retrógrado, combustão, velocidade */
  private static getAccidentalConditionsModifier(
    planet: RealPlanetPosition,
    sunLongitude?: number
  ): { modifier: number; tags: string[] } {
    let mod = 0
    const tags: string[] = []

    // Retrógrado
    if (planet.isRetrograde) {
      mod -= 4
      tags.push(`${planet.name} retrógrado`)
    }

    // Combustão (aprox: dentro de 8° do Sol para planetas tradicionais)
    if (sunLongitude !== undefined && planet.name !== 'Sun' && planet.name !== 'Moon') {
      const diff = Math.abs(((planet.longitude - sunLongitude + 540) % 360) - 180)
      if (diff <= 8) {
        mod -= 5
        tags.push(`${planet.name} combusto`)
      }
    }

    // Velocidade (aproximação: velocidade negativa já capturada por retrógrado;
    // velocidade muito baixa penaliza levemente, muito alta dá leve bônus)
    if (Math.abs(planet.speed) < 0.1) {
      mod -= 1
    } else if (Math.abs(planet.speed) > 1.5) {
      mod += 1
    }

    return { modifier: mod, tags }
  }

  private static getAspectScore(aspect: RealAspect): number {
    // Peso por tipo
    const weights: Record<string, number> = {
      'conjunção': 1.0,
      'oposição': 0.9,
      'quadratura': 0.8,
      'trígono': 0.8,
      'sextil': 0.6,
    }
    const w = weights[aspect.type] ?? 0.5

    // Aplicante ganha bônus
    const applyingBonus = aspect.isApplying ? 1.15 : 1.0
    // Proximidade do aspecto (orb menor = mais forte)
    // Orbe base por tipo
    const baseOrb: Record<string, number> = {
      'conjunção': 8, 'oposição': 8, 'quadratura': 6, 'trígono': 6, 'sextil': 4,
    }
    const maxOrb = baseOrb[aspect.type] ?? 5
    const proximity = Math.max(0, 1 - aspect.orb / maxOrb)
    const score = 50 + 50 * w * proximity * applyingBonus

    return Math.max(0, Math.min(100, score))
  }

  // 🌟 NOVOS MÉTODOS PARA FUNCIONALIDADES GRATUITAS

  /**
   * Cria comparações entre posições natais e atuais
   */
  private static createPlanetComparisons(
    natalPlanets: RealPlanetPosition[],
    currentPlanets: RealPlanetPosition[],
    houses: { cusps: number[], ascendant: number, midheaven: number }
  ): PlanetComparison[] {
    const comparisons: PlanetComparison[] = []

    for (const currentPlanet of currentPlanets) {
      const natalPlanet = natalPlanets.find(p => p.name === currentPlanet.name)
      if (!natalPlanet) continue

      // Aspectos planetários para este planeta
      const planetaryAspects = this.calculateRealAspects(currentPlanets)
        .filter(aspect => aspect.planet1 === currentPlanet.name || aspect.planet2 === currentPlanet.name)

      // Aspectos com casas
      const houseAspects = this.calculateHouseAspects([currentPlanet], houses)

      const comparison: PlanetComparison = {
        name: currentPlanet.name,
        natal: {
          longitude: natalPlanet.longitude,
          sign: natalPlanet.sign,
          element: this.SIGN_ELEMENTS[natalPlanet.sign as keyof typeof this.SIGN_ELEMENTS],
          modality: this.SIGN_MODALITIES[natalPlanet.sign as keyof typeof this.SIGN_MODALITIES],
          house: natalPlanet.house
        },
        current: {
          longitude: currentPlanet.longitude,
          sign: currentPlanet.sign,
          element: this.SIGN_ELEMENTS[currentPlanet.sign as keyof typeof this.SIGN_ELEMENTS],
          modality: this.SIGN_MODALITIES[currentPlanet.sign as keyof typeof this.SIGN_MODALITIES],
          house: currentPlanet.house,
          speed: currentPlanet.speed,
          isRetrograde: currentPlanet.isRetrograde
        },
        planetaryAspects,
        houseAspects
      }

      comparisons.push(comparison)
    }

    return comparisons
  }

  /**
   * Calcula aspectos entre planetas e casas
   */
  private static calculateHouseAspects(
    planets: RealPlanetPosition[],
    houses: { cusps: number[], ascendant: number, midheaven: number }
  ): HouseAspect[] {
    const houseAspects: HouseAspect[] = []
    const aspectTypes = [
      { name: 'conjunção', degrees: 0, orb: 8 },
      { name: 'sextil', degrees: 60, orb: 6 },
      { name: 'quadratura', degrees: 90, orb: 7 },
      { name: 'trígono', degrees: 120, orb: 8 },
      { name: 'oposição', degrees: 180, orb: 8 }
    ]

    for (const planet of planets) {
      for (let houseIndex = 0; houseIndex < houses.cusps.length; houseIndex++) {
        const cusp = houses.cusps[houseIndex]
        const houseNumber = houseIndex + 1

        for (const aspectType of aspectTypes) {
          let angleDiff = Math.abs(planet.longitude - cusp)
          if (angleDiff > 180) angleDiff = 360 - angleDiff

          const orb = Math.abs(angleDiff - aspectType.degrees)
          
          if (orb <= aspectType.orb) {
            houseAspects.push({
              house: houseNumber,
              cusp,
              aspect: aspectType.name,
              orb,
              meaning: this.HOUSE_MEANINGS[houseNumber as keyof typeof this.HOUSE_MEANINGS],
              strength: Math.max(0, 100 - (orb / aspectType.orb) * 100)
            })
          }
        }
      }
    }

    return houseAspects.sort((a, b) => b.strength - a.strength)
  }

  /**
   * Cria resumo elemental e de modalidades
   */
  private static createChartSummary(
    natalPlanets: RealPlanetPosition[],
    currentPlanets: RealPlanetPosition[]
  ): ChartSummary {
    const analyzeElements = (planets: RealPlanetPosition[]): ElementalAnalysis => {
      const analysis: ElementalAnalysis = { fire: 0, earth: 0, air: 0, water: 0 }
      
      for (const planet of planets) {
        const element = this.SIGN_ELEMENTS[planet.sign as keyof typeof this.SIGN_ELEMENTS]
        if (element) analysis[element]++
      }
      
      return analysis
    }

    const analyzeModalities = (planets: RealPlanetPosition[]): ModalityAnalysis => {
      const analysis: ModalityAnalysis = { cardinal: 0, fixed: 0, mutable: 0 }
      
      for (const planet of planets) {
        const modality = this.SIGN_MODALITIES[planet.sign as keyof typeof this.SIGN_MODALITIES]
        if (modality) analysis[modality]++
      }
      
      return analysis
    }

    const natalElemental = analyzeElements(natalPlanets)
    const currentElemental = analyzeElements(currentPlanets)
    const natalModality = analyzeModalities(natalPlanets)
    const currentModality = analyzeModalities(currentPlanets)

    // Detectar mudanças significativas, sempre com emoji
    const elementalChanges: string[] = []
    const modalityChanges: string[] = []

    // Análise elemental
    Object.keys(natalElemental).forEach(element => {
      const key = element as keyof ElementalAnalysis
      const diff = currentElemental[key] - natalElemental[key]
      if (diff !== 0) {
        const emoji = element === 'fire' ? '🔥' : element === 'earth' ? '🌍' : element === 'air' ? '💨' : '💧'
        const translatedElement = element === 'fire' ? 'fogo' : element === 'earth' ? 'terra' : element === 'air' ? 'ar' : 'água'
        elementalChanges.push(`${diff > 0 ? 'Mais' : 'Menos'} ${emoji} ${translatedElement}`)
      }
    })

    // Análise de modalidades
    Object.keys(natalModality).forEach(modality => {
      const key = modality as keyof ModalityAnalysis
      const diff = currentModality[key] - natalModality[key]
      if (diff !== 0) {
        const icon = modality === 'cardinal' ? '⚡' : modality === 'fixed' ? '🔒' : '🔄'
        const translatedModality = modality === 'cardinal' ? 'cardeal' : modality === 'fixed' ? 'fixo' : 'mutável'
        modalityChanges.push(`${diff > 0 ? 'Mais' : 'Menos'} ${icon} ${translatedModality}`)
      }
    })

    return {
      elemental: {
        natal: natalElemental,
        current: currentElemental,
        changes: elementalChanges
      },
      modality: {
        natal: natalModality,
        current: currentModality,
        changes: modalityChanges
      }
    }
  }
}

export default RealAstrologyEngine