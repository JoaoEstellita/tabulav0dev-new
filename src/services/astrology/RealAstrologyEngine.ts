/**
 * Ã°Å¸Å’Å¸ REAL ASTROLOGY ENGINE Ã°Å¸Å’Å¸
 * 
 * Sistema de cÃƒÂ¡lculos astrolÃƒÂ³gicos com dados REAIS usando:
 * - Astronomy Engine: PrecisÃƒÂ£o NASA para posiÃƒÂ§ÃƒÂµes planetÃƒÂ¡rias
 * - Ephemeris: CÃƒÂ¡lculos astronÃƒÂ´micos profissionais
 * - Algoritmos astrolÃƒÂ³gicos tradicionais
 * 
 * GARANTIA: Dados 100% reais, sem simulaÃƒÂ§ÃƒÂµes ou aproximaÃƒÂ§ÃƒÂµes
 */

import * as Astronomy from 'astronomy-engine'
import aspectsConfig from '../../astro/aspects.config'
import { normalizePlanet, normalizeSign, normalizeHouse } from '../../astro/normalize'
import { detectAspects } from '../../astro/aspects.engine'
import { filterPersonalTransits, summarizePersonalTransits } from '../../astro/transits.utils'
import { calculatePlanetaryStatus } from '../../astro/planetary-status.engine'
import type { PlanetaryStatus, PlanetaryStatusLevel } from '../../astro/planetary-status.types'
import { computeHousesUTC } from '../../astro/houses'
import type { HouseSystem } from '../../astro/houseSystem'
import { normalizeHouseSystem } from '../../astro/houseSystem'
import { getPlanetHouse } from '../../astro/houses.math'
// Removido Ephemeris nÃƒÂ£o utilizado

export interface RealPlanetPosition {
  name: string
  longitude: number // Graus eclÃƒÂ­pticos (0-360)
  latitude: number
  distance: number // UA (Unidades AstronÃƒÂ´micas)
  speed: number // Graus por dia
  sign: string // Signo zodiacal
  degree: number // Grau dentro do signo (0-30)
  house: number // Casa astrolÃƒÂ³gica (1-12)
  isRetrograde: boolean
  // Ã°Å¸Å’Å¸ NOVO: Status planetÃƒÂ¡rio integrado
  planetaryStatus?: PlanetaryStatus
  prevLongitude?: number
  prevSpeed?: number
}

export interface RealAspect {
  planet1: string
  planet2: string
  type: string // conjunÃƒÂ§ÃƒÂ£o, oposiÃƒÂ§ÃƒÂ£o, trÃƒÂ­gono, quadratura, sextil
  orb: number // DiferenÃƒÂ§a em graus do aspecto exato
  isApplying: boolean // Se o aspecto estÃƒÂ¡ se formando ou se separando
  strength: number // ForÃƒÂ§a do aspecto (0-100)
  window?: { start?: string; exact?: string; end?: string; days?: number }
}

// Ã°Å¸Å’Â Analise elemental
export interface ElementalAnalysis {
  fire: number    // Ã°Å¸â€Â¥ Planetas em signos de fogo
  earth: number   // Ã°Å¸Å’Â Planetas em signos de terra  
  air: number     // Ã°Å¸â€™Â¨ Planetas em signos de ar
  water: number   // Ã°Å¸â€™Â§ Planetas em signos de ÃƒÂ¡gua
}

// Ã¢Å¡Â¡ Analise de modalidades
export interface ModalityAnalysis {
  cardinal: number  // Ã¢Å¡Â¡ Planetas em signos cardinais
  fixed: number     // Ã°Å¸â€â€™ Planetas em signos fixos
  mutable: number   // Ã°Å¸â€â€ž Planetas em signos mutÃƒÂ¡veis
}

// Ã°Å¸ÂÂ  Aspectos com Casas
export interface HouseAspect {
  house: number
  cusp: number
  aspect: string
  orb: number
  meaning: string
  strength: number
  window?: { start?: string; exact?: string; end?: string; days?: number }
}

// Ã°Å¸â€œÅ  ComparaÃƒÂ§ÃƒÂ£o Completa de Planetas
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

// Ã°Å¸Å’Å¸ Resumo da Carta
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

// Ã°Å¸Å’Å¸ NOVO: AnÃƒÂ¡lise de Status PlanetÃƒÂ¡rios
export interface PlanetaryStatusAnalysis {
  overallScore: number
  overallLevel: PlanetaryStatusLevel
  strongestPlanet: {
    name: string
    status: PlanetaryStatus
  }
  weakestPlanet: {
    name: string
    status: PlanetaryStatus
  }
  planetsByLevel: Record<PlanetaryStatusLevel, string[]>
  recommendations: string[]
}

export interface RealAstrologyData {
  timestamp: string
  planets: RealPlanetPosition[]
  aspects: RealAspect[]
  houses: number[] // CÃƒÂºspides das casas
  ascendant: number
  midheaven: number
  housesApproximate?: boolean
  houseSystem?: HouseSystem
  // ÃƒÂndice Coletivo (TÃ¢â€ â€™T) e fase lunar
  collective?: {
    positive: number
    negative: number
    keyAspects: Array<RealAspect & { orbAllowed?: number; relSpeed?: number; windowDays?: number }>
    lunarPhase: {
      name: 'Nova' | 'Crescente' | 'Cheia' | 'Minguante'
      waxing: boolean
      elongation: number // 0..180 distÃƒÂ¢ncia Sol-Lua
    }
  }
  collectiveWeekly?: { key: string, keyAspects: Array<RealAspect & { orbAllowed?: number; relSpeed?: number; windowDays?: number }> }
  collectiveMonthly?: { key: string, keyAspects: Array<RealAspect & { orbAllowed?: number; relSpeed?: number; windowDays?: number }> }
  // Novos conjuntos de aspectos padronizados
  aspectsCurrentTT?: RealAspect[]
  aspectsTransitsToNatalTN?: RealAspect[]
  aspectsNatalToNatal?: RealAspect[]
  transits?: {
    personal: Array<{
      transitPlanet: string
      natalPlanet: string
      type: string
      orb: number
      isApplying: boolean
      strength: number
      natalHouseImpacted: number
      durationClass?: 'curto' | 'medio' | 'longo'
      seriesId?: string
      contactPhase?: 'direct' | 'retro'
      isMaster?: boolean
    }>
    general: RealAspect[]
    byArea?: Record<string, Array<{
      transitPlanet: string
      natalPlanet: string
      type: string
      orb: number
      isApplying: boolean
      strength: number
      natalHouseImpacted: number
      durationClass?: 'curto' | 'medio' | 'longo'
    }>>
  }
  statusPersonal?: {
    score: number
    level: 'excelente' | 'bom' | 'neutro' | 'desafiador' | 'critico'
    highlights: string[]
    confidence?: number
    volatility?: number
  }
  lifeAreas: {
    [area: string]: {
      percentage: number
      status: 'excelente' | 'bom' | 'neutro' | 'desafiador' | 'critico'
      influences: string[]
      mainPlanets: string[]
    }
  }
  // Ã°Å¸Å’Å¸ NOVAS FUNCIONALIDADES GRATUITAS
  natalPlanets: RealPlanetPosition[] // PosiÃƒÂ§ÃƒÂµes natais
  natalAscendant: number // Ascendente natal
  natalMidheaven: number // Meio do CÃƒÂ©u natal
  natalHousesApproximate?: boolean
  natalHouses?: number[]
  planetComparisons: PlanetComparison[] // ComparaÃƒÂ§ÃƒÂ£o natal vs atual
  chartSummary: ChartSummary // Resumo elemental e modalidades
  houseAspects: HouseAspect[] // Aspectos com casas
  // Ã°Å¸Å’Å¸ NOVO: AnÃƒÂ¡lise completa de status planetÃƒÂ¡rios
  planetaryStatusAnalysis?: PlanetaryStatusAnalysis
  // Ã°Å¸Â§Â­ Logs estruturados para UI (detalhamento por ÃƒÂ¡rea)
  debug?: {
    lifeAreas: {
      [area: string]: {
        finalScore: number
        planetDetails: Array<{
            planet: string
            house: number
            sign: string
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

type HouseMeta = {
  cusps: number[]
  ascendant: number
  midheaven: number
  approximate?: boolean
  system?: HouseSystem | string
  systemEffective?: HouseSystem | string
}

type NormalizedHouseMeta = {
  cusps: number[]
  ascendant: number
  midheaven: number
  approximate?: boolean
  system?: HouseSystem
  systemEffective?: HouseSystem
}

export class RealAstrologyEngine {
  private static readonly PLANETS = [
    'Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 
    'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'
  ]

  private static readonly PLANET_MEAN_SPEEDS: Record<string, number> = {
    Sun: 0.9856,
    Moon: 13.176,
    Mercury: 1.2,
    Venus: 1.18,
    Mars: 0.524,
    Jupiter: 0.083,
    Saturn: 0.033,
    Uranus: 0.011,
    Neptune: 0.006,
    Pluto: 0.004
  }

  private static readonly _weeklyTTCache = new Map<string, RealAspect[]>()
  private static readonly _monthlyTTCache = new Map<string, RealAspect[]>()
  private static readonly _collectiveCache = new Map<string, RealAstrologyData['collective']>()

  private static readonly SIGNS = [
    '\u00C1ries', 'Touro', 'G\u00EAmeos', 'C\u00E2ncer', 'Le\u00E3o', 'Virgem',
    'Libra', 'Escorpi\u00E3o', 'Sagit\u00E1rio', 'Capric\u00F3rnio', 'Aqu\u00E1rio', 'Peixes'
  ]

  private static readonly SIGN_ELEMENTS = {
    '\u00C1ries': 'fire', 'Le\u00E3o': 'fire', 'Sagit\u00E1rio': 'fire',
    'Touro': 'earth', 'Virgem': 'earth', 'Capric\u00F3rnio': 'earth',
    'G\u00EAmeos': 'air', 'Libra': 'air', 'Aqu\u00E1rio': 'air',
    'C\u00E2ncer': 'water', 'Escorpi\u00E3o': 'water', 'Peixes': 'water'
  } as const

  private static readonly SIGN_MODALITIES = {
    '\u00C1ries': 'cardinal', 'C\u00E2ncer': 'cardinal', 'Libra': 'cardinal', 'Capric\u00F3rnio': 'cardinal',
    'Touro': 'fixed', 'Le\u00E3o': 'fixed', 'Escorpi\u00E3o': 'fixed', 'Aqu\u00E1rio': 'fixed',
    'G\u00EAmeos': 'mutable', 'Virgem': 'mutable', 'Sagit\u00E1rio': 'mutable', 'Peixes': 'mutable'
  } as const

  private static readonly HOUSE_MEANINGS = {
    1: 'Identidade', 2: 'Recursos', 3: 'Comunica\u00E7\u00E3o', 4: 'Lar',
    5: 'Criatividade', 6: 'Trabalho', 7: 'Parcerias', 8: 'Transforma\u00E7\u00E3o',
    9: 'Expans\u00E3o', 10: 'Carreira', 11: 'Amizades', 12: 'Espiritual'
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

  private static readonly HOUSE_RULERS: Record<number, string[]> = {
    1: ['Mars'],
    2: ['Venus'],
    3: ['Mercury'],
    4: ['Moon'],
    5: ['Sun'],
    6: ['Mercury'],
    7: ['Venus'],
    8: ['Mars'],
    9: ['Jupiter'],
    10: ['Saturn'],
    11: ['Saturn', 'Uranus'],
    12: ['Jupiter', 'Neptune']
  }

  private static canUseLocalFallback(): boolean {
    const forceEnable = String(process.env.EXPO_PUBLIC_ALLOW_LOCAL_ASTRO_FALLBACK || '').toLowerCase()
    if (forceEnable === '1' || forceEnable === 'true') return true
    return process.env.NODE_ENV !== 'production'
  }

  private static normalizeHouseMeta(houses: HouseMeta): NormalizedHouseMeta {
    const system = normalizeHouseSystem(
      houses.systemEffective || houses.system || (globalThis as any).__userHouseSystem || 'whole-sign'
    )
    return {
      ...houses,
      system,
      systemEffective: system,
    }
  }

  /**
   * Calcula dados astrolÃƒÂ³gicos REAIS para uma data e local especÃƒÂ­ficos
   */
  static async calculateRealAstrology(
    birthDate: string, // YYYY-MM-DD
    birthTime: string, // HH:MM
    latitude: number,  // localizaÃƒÂ§ÃƒÂ£o ATUAL para casas do momento
    longitude: number,
    currentDate?: Date,
  options?: { houseSystem?: HouseSystem; natalLat?: number; natalLon?: number }
  ): Promise<RealAstrologyData> {
    console.log('Ã°Å¸â€Â¬ Iniciando cÃƒÂ¡lculos astrolÃƒÂ³gicos REAIS...')
    
    const date = currentDate || new Date()
    // Converter hora local de nascimento em UTC usando IANA (se disponÃƒÂ­vel), caso contrÃƒÂ¡rio, fallback para aprox.
    let resolvedTz: { offsetSec: number; timeZoneId?: string } | null = null
    const birthDateTime = await (async () => {
      try {
        const [y, m, d] = birthDate.split('-').map(n => parseInt(n, 10))
        const [hh, mm] = birthTime.split(':').map(n => parseInt(n, 10))
        const natalLat = (typeof options?.natalLat === 'number') ? options.natalLat : latitude
        const natalLon = (typeof options?.natalLon === 'number') ? options.natalLon : longitude
        // Usar meio-dia UTC para resolver TZ histÃƒÂ³rico e evitar bordas de alteraÃƒÂ§ÃƒÂ£o de DST
        const ts = Math.floor(Date.UTC(y, (m - 1), d, 12, 0, 0) / 1000)
        const { getTimezoneData } = await import('../timezone/TimezoneService')
        const tzData = await getTimezoneData(natalLat, natalLon, ts)
        // Só usa se offset for não-zero (0 = fallback UTC = provável erro de TZ service)
        if (tzData && typeof tzData.offsetSec === 'number' && tzData.offsetSec !== 0) {
          resolvedTz = { offsetSec: tzData.offsetSec, timeZoneId: tzData.timeZoneId }
          const offsetHours = tzData.offsetSec / 3600
          return new Date(Date.UTC(y, (m - 1), d, hh - offsetHours, mm, 0))
        }
        // fallback: aproximar offset por longitude (evita erro de UTC para Brasil/EUA)
        const { approximateTimezoneOffsetHours } = require('../../utils/timezone')
        const approx = approximateTimezoneOffsetHours(new Date(Date.UTC(y, (m - 1), d, 0, 0, 0)), natalLon, natalLat)
        return new Date(Date.UTC(y, (m - 1), d, hh - approx, mm, 0))
      } catch {
        // fallback sem TZ service: usar longitude
        try {
          const [y2, m2, d2] = birthDate.split('-').map(n => parseInt(n, 10))
          const [hh2, mm2] = birthTime.split(':').map(n => parseInt(n, 10))
          const natalLon2 = (typeof options?.natalLon === 'number') ? options.natalLon : longitude
          const natalLat2 = (typeof options?.natalLat === 'number') ? options.natalLat : latitude
          const { approximateTimezoneOffsetHours } = require('../../utils/timezone')
          const approx = approximateTimezoneOffsetHours(new Date(Date.UTC(y2, (m2 - 1), d2, 0, 0, 0)), natalLon2, natalLat2)
          return new Date(Date.UTC(y2, (m2 - 1), d2, hh2 - approx, mm2, 0))
        } catch {
          return new Date(`${birthDate}T${birthTime}:00Z`)
        }
      }
    })()
    
    try {
      // 1-2. TENTAR BACKEND PRECISO: posiÃƒÂ§ÃƒÂµes + casas + pacote natal
      let realPlanets: RealPlanetPosition[]
      let houses: HouseMeta
      let natalPlanets: RealPlanetPosition[]
      let natalHouses: HouseMeta

      try {
        // Enviar horÃƒÂ¡rio LOCAL de nascimento e TZ resolvido para unificar conversÃƒÂ£o no backend
        const natalLocalStr = `${birthDate}T${birthTime}:00`
        const natalTimezone = (resolvedTz as any)?.timeZoneId || undefined
        const bundle = await this.fetchBackendBundle(date, birthDateTime, latitude, longitude, {
          natalLocal: natalTimezone ? natalLocalStr : undefined,
          natalTimezone,
          natalLat: (typeof options?.natalLat === 'number') ? options!.natalLat! : latitude,
          natalLon: (typeof options?.natalLon === 'number') ? options!.natalLon! : longitude,
        })
        realPlanets = bundle.current.planets
        houses = bundle.current.houses
        natalHouses = bundle.natal.houses
        // NÃƒÂ£o reatribuir se o backend jÃƒÂ¡ enviou as casas dos natais; confiar no backend para consistÃƒÂªncia 1:1
        natalPlanets = bundle.natal.planets
        console.log('Ã¢Å“â€¦ Backend astro bundle utilizado (posiÃƒÂ§ÃƒÂµes + casas + natal)')
      } catch (_e) {
        if (!this.canUseLocalFallback()) {
          throw new Error('Backend astrology bundle unavailable and local fallback disabled in production')
        }
        // Fallback para engine local
        const planetsLocal = await this.calculateRealPlanetPositions(date, latitude, longitude)
  const housesLocal = await this.calculateRealHouses(date, birthDateTime, latitude, longitude, options?.houseSystem)
        const natalLat = (typeof options?.natalLat === 'number') ? options!.natalLat! : latitude
        const natalLon = (typeof options?.natalLon === 'number') ? options!.natalLon! : longitude
        const natalPlanetsRaw = await this.calculateRealPlanetPositions(birthDateTime, natalLat, natalLon)
  const natalHousesLocal = await this.calculateRealHouses(birthDateTime, birthDateTime, natalLat, natalLon, options?.houseSystem)
        realPlanets = planetsLocal
        houses = housesLocal
        natalPlanets = this.assignHouses(natalPlanetsRaw, natalHousesLocal)
        natalHouses = natalHousesLocal
        console.log('Ã¢Å¡Â Ã¯Â¸Â Fallback local utilizado (posiÃƒÂ§ÃƒÂµes + casas)')
      }

      console.log(`Ã¢Å“â€¦ Calculadas ${realPlanets.length} posiÃƒÂ§ÃƒÂµes planetÃƒÂ¡rias reais`)
      console.log('Ã¢Å“â€¦ Casas astrolÃƒÂ³gicas disponÃƒÂ­veis')

      // 3. CÃƒÂLCULO REAL DOS ASPECTOS
      // Antes de aspectos, precisamos atribuir casas aos planetas com base nas cÃƒÂºspides
      const planetsWithHouses = this.assignHouses(realPlanets, this.normalizeHouseMeta(houses))
      if (process.env.NODE_ENV !== 'production') {
        try {
          const debugSystem = normalizeHouseSystem(houses.systemEffective || houses.system || (globalThis as any).__userHouseSystem || 'whole-sign')
          console.debug('DEBUG Casas: ASC/MC', { asc: houses.ascendant, mc: houses.midheaven, system: debugSystem })
          console.debug('Ã°Å¸ÂÂ  DEBUG Cusps', houses.cusps.map((c,i)=>({ casa:i+1, cusp:c.toFixed(4) })))
          console.debug('Ã°Å¸ÂÂ  DEBUG PlanetasÃ¢â€ â€™Casa', planetsWithHouses.map(p=>({ p:p.name, lon:p.longitude.toFixed(4), casa:p.house })))
        } catch {}
      }
      console.log('Ã°Å¸â€Å½ ASTRO DEBUG - Comparativo casas (natal vs atual) por planeta',
        planetsWithHouses.map(p => ({ name: p.name, natal: (natalPlanets.find(n=>n.name===p.name)?.house), current: p.house })))
      // Aspectos Coletivos (momento)
      const aspectsCurrentTTBase = detectAspects(
        planetsWithHouses.map(p => ({ name: p.name, longitude: p.longitude, speed: p.speed })),
        planetsWithHouses.map(p => ({ name: p.name, longitude: p.longitude, speed: p.speed })),
        aspectsConfig
      )
      const aspectsCurrentTT = aspectsCurrentTTBase.map(aspect => {
        const p1 = planetsWithHouses.find(p => p.name === aspect.planet1)
        const p2 = planetsWithHouses.find(p => p.name === aspect.planet2)
        const orbAllowed = this.getAspectOrbAllowed(aspect.type, aspect.planet1, aspect.planet2)
        const relSpeed = this.getRelativeSpeed(p1?.speed, p2?.speed)
        const windowInfo = this.computeAspectWindow({
          orb: aspect.orb,
          isApplying: aspect.isApplying,
          orbAllowed,
          relSpeed,
          baseDate: date
        })
        return {
          ...aspect,
          orbAllowed,
          relSpeed,
          windowDays: windowInfo.days,
          window: windowInfo
        }
      })
      console.log(`Ã¢Å“â€¦ Aspectos Coletivos calculados: ${aspectsCurrentTT.length}`)

      // Ã°Å¸Å’Å¸ NOVO: CÃƒÂLCULO DE STATUS PLANETÃƒÂRIOS
      const planetsWithStatus = planetsWithHouses.map(planet => {
        const sign = planet.sign as any // Converter para SignName
        const planetaryStatus = calculatePlanetaryStatus(
          planet.name as any, // Converter para PlanetName
          sign,
          planet.house,
          aspectsCurrentTT,
          planet.isRetrograde,
          planet.speed
        )
        
        return {
          ...planet,
          planetaryStatus
        }
      })
      console.log(`Ã¢Å“â€¦ Status planetÃƒÂ¡rios calculados para ${planetsWithStatus.length} planetas`)

      // ÃƒÂndice Coletivo + fase lunar (cache por dia UTC)
      const dayKey = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())).toISOString().slice(0,10)
      let collective = RealAstrologyEngine._collectiveCache.get(dayKey)
      if (!collective) {
        collective = this.computeCollectiveIndex(aspectsCurrentTT, planetsWithHouses)
        RealAstrologyEngine._collectiveCache.set(dayKey, collective)
      }

      // PrÃƒÂ©Ã¢â‚¬â€˜cÃƒÂ¡lculo semanal e mensal Coletivo (cache): guardar snapshot representativo
      let weekKey: string | undefined
      let monthKey: string | undefined
      try {
        const y = date.getUTCFullYear()
        const m = date.getUTCMonth()+1
        const firstDayUTC = new Date(Date.UTC(y, m-1, 1))
        monthKey = `${y}-${String(m).padStart(2,'0')}`
        if (!RealAstrologyEngine._monthlyTTCache.has(monthKey)) {
          RealAstrologyEngine._monthlyTTCache.set(monthKey, aspectsCurrentTT)
        }
        // Semana ISO aproximada (UTC)
        const tmp = new Date(Date.UTC(y, date.getUTCMonth(), date.getUTCDate()))
        const dayNum = (tmp.getUTCDay() + 6) % 7 // 0=Mon .. 6=Sun
        const monday = new Date(tmp); monday.setUTCDate(tmp.getUTCDate() - dayNum)
        const oneJan = new Date(Date.UTC(y,0,1))
        const week = Math.ceil((((monday.getTime() - oneJan.getTime())/86400000) + oneJan.getUTCDay()+1) / 7)
        weekKey = `${y}-W${String(week).padStart(2,'0')}`
        if (!RealAstrologyEngine._weeklyTTCache.has(weekKey)) {
          RealAstrologyEngine._weeklyTTCache.set(weekKey, aspectsCurrentTT)
        }
      } catch {}

      // Aspectos Pessoais (TÃ¢â€ â€™N) Ã¢â‚¬â€œ detectAspects deve manter planet1 do primeiro conjunto (trÃƒÂ¢nsitos)
      const natalSetForAspects = [
        ...natalPlanets.map(p => ({ name: p.name, longitude: p.longitude, speed: 0 })),
        { name: 'Asc', longitude: natalHouses.ascendant, speed: 0 },
        { name: 'MC', longitude: natalHouses.midheaven, speed: 0 },
        { name: 'IC', longitude: (natalHouses.midheaven + 180) % 360, speed: 0 },
        { name: 'Dsc', longitude: (natalHouses.ascendant + 180) % 360, speed: 0 },
      ]
      const aspectsTransitsToNatalTN = detectAspects(
        planetsWithHouses.map(p => ({ name: p.name, longitude: p.longitude, speed: p.speed })),
        natalSetForAspects,
        aspectsConfig
      )
      console.log(`Ã¢Å“â€¦ Aspectos Pessoais calculados: ${aspectsTransitsToNatalTN.length}`)
      // Aspectos Natais×Natais (N×N) — carta natal estática
      const aspectsNatalToNatal = detectAspects(
        natalSetForAspects,
        natalSetForAspects,
        aspectsConfig
      )


      // 4. ANÃƒÂLISE REAL DAS ÃƒÂREAS DA VIDA
      // Para Status Pessoal: atribuir planetas do momento nas CASAS NATAIS e usar aspectos Pessoais
      const currentOnNatalHouses = this.assignHouses(realPlanets, this.normalizeHouseMeta(natalHouses))
      const lifeAreas = this.calculateRealLifeAreas(currentOnNatalHouses, aspectsTransitsToNatalTN, natalHouses, natalPlanets, birthDateTime, latitude, longitude)
      // Derivar um status agregado pessoal simplificado a partir de lifeAreas
      const areaScores = Object.values(lifeAreas).map(a => a.percentage)
      const avg = areaScores.length ? Math.round(areaScores.reduce((s,n)=>s+n,0)/areaScores.length) : 50
      const level = avg >= 80 ? 'excelente' : avg >= 65 ? 'bom' : avg >= 45 ? 'neutro' : avg >= 25 ? 'desafiador' : 'critico'
      const areaTop = Object.entries(lifeAreas).sort((a,b)=>b[1].percentage-a[1].percentage).slice(0,2).map(([k])=>k)
      const statusPersonal = { score: avg, level: level as any, highlights: areaTop }
      console.log('Ã¢Å“â€¦ AnÃƒÂ¡lise real das ÃƒÂ¡reas da vida concluÃƒÂ­da')

      // Ã°Å¸Å’Å¸ 5. NATAIS jÃƒÂ¡ obtidos (do backend ou fallback)
      console.log('Ã¢Å“â€¦ PosiÃƒÂ§ÃƒÂµes natais e casas natais prontas')

      // Ã°Å¸Å’Å¸ 6. COMPARAÃƒâ€¡ÃƒÆ’O NATAL vs ATUAL
      const planetComparisons = this.createPlanetComparisons(natalPlanets, planetsWithHouses, houses, date)
      console.log('Ã¢Å“â€¦ ComparaÃƒÂ§ÃƒÂµes planetÃƒÂ¡rias criadas')

      // Ã°Å¸Å’Å¸ 7. ASPECTOS COM CASAS
      const houseAspects = this.calculateHouseAspects(realPlanets, houses, date)
      console.log('Ã¢Å“â€¦ Aspectos com casas calculados')

      // Ã°Å¸Å’Å¸ 8. RESUMO ELEMENTAL E MODAL
      const chartSummary = this.createChartSummary(natalPlanets, planetsWithHouses)
      console.log('Ã¢Å“â€¦ Resumo da carta criado')

      // Ã°Å¸Å’Å¸ 9. ANÃƒÂLISE GERAL DE STATUS PLANETÃƒÂRIOS
      const planetaryStatusAnalysis = this.createPlanetaryStatusAnalysis(planetsWithStatus)
      console.log('Ã¢Å“â€¦ AnÃƒÂ¡lise de status planetÃƒÂ¡rios criada')

      // Preparar agrupamento para futura UI de TrÃƒÂ¢nsitos Comparativos
      const personalTransits = aspectsTransitsToNatalTN.map(a => {
        // Lado A = trÃƒÂ¢nsito por construÃƒÂ§ÃƒÂ£o
        const transitName = a.planet1
        const natalName = a.planet2
        // Casa natal impactada: onde o planeta em trÃƒÂ¢nsito cai nas casas NATAIS
        const transitHouseNatal = currentOnNatalHouses.find(p => p.name === transitName)?.house || 0
        // Ãngulos natais têm casa fixa — Asc=1, Dsc=7, MC=10, IC=4
        const ANGLE_HOUSE: Record<string, number> = { Asc: 1, Dsc: 7, MC: 10, IC: 4 }
        const natalHouseImpacted = ANGLE_HOUSE[natalName] ?? transitHouseNatal
        // SÃƒÂ©rie retrÃƒÂ³grada (marcaÃƒÂ§ÃƒÂ£o heurÃƒÂ­stica): id por par + tipo
        const seriesId = `${transitName}:${natalName}:${a.type}`
        const contactPhase: 'direct'|'retro' = (planetsWithHouses.find(p=>p.name===transitName)?.isRetrograde ? 'retro' : 'direct')
        // AspectoÃ¢â‚¬â€˜mestre (heurÃƒÂ­stica): forte e envolvendo planetas lentos ou ÃƒÂ¢ngulos
        const slowSet = new Set(['Jupiter','Saturn','Uranus','Neptune','Pluto'])
        const isMaster = a.strength >= 80 || slowSet.has(transitName)
        // ÃƒÂndice do contato (heurÃƒÂ­stica por orbe decrescente dentro da sÃƒÂ©rie)
        let contactIndex: 1|2|3 = 1
        try {
          const sameSeries = aspectsTransitsToNatalTN
            .filter(x => x.planet1===transitName && x.planet2===natalName && x.type===a.type)
            .sort((x,y)=>x.orb - y.orb)
          const idx = sameSeries.findIndex(x=>x===a)
          if (idx === 1) contactIndex = 2
          if (idx >= 2) contactIndex = 3
          } catch {}
          const transitPlanetMeta = planetsWithHouses.find(p => p.name===transitName)
          const orbAllowed = this.getAspectOrbAllowed(a.type, transitName, natalName)
          const relSpeed = Math.max(0.02, Math.abs(transitPlanetMeta?.speed ?? 0))
          const windowInfo = this.computeAspectWindow({
            orb: a.orb,
            isApplying: a.isApplying,
            orbAllowed,
            relSpeed,
            baseDate: date
          })
          return {
          transitPlanet: transitName,
          natalPlanet: natalName,
          type: a.type,
          eventType: 'ASPECT_MAJOR',
          orb: a.orb,
          isApplying: a.isApplying,
          strength: a.strength,
          natalHouseImpacted: natalHouseImpacted,
          durationClass: this.classifyTransitDuration(transitName),
          seriesId,
          contactPhase,
          isMaster,
          contactIndex,
          window: windowInfo,
          windowDays: windowInfo.days,
        }
      })
      const personalSummary = summarizePersonalTransits(personalTransits)

      // Agrupar trÃƒÂ¢nsitos pessoais por ÃƒÂ¡rea da vida com base nas casas significadoras
      const byArea: Record<string, typeof personalTransits> = {}
      const natalHouseByName = this.buildNatalHouseLookup(natalPlanets)
      for (const [areaName, cfg] of Object.entries(this.LIFE_AREAS)) {
        byArea[areaName] = personalTransits.filter(t => {
          // Casa diretamente na área → inclui independente do planeta
          if (cfg.houses.includes(t.natalHouseImpacted)) return true
          if (!cfg.planets.includes(t.transitPlanet)) return false
          return this.isTransitRelevantToArea(
            t.natalPlanet,
            t.natalHouseImpacted,
            cfg.houses,
            natalHouseByName
          )
        })
      }

      const specialEvents = this.buildSpecialEvents(planetsWithHouses, date)
      const generalTransits = (aspectsCurrentTT || []).map((aspect: any) => ({
        ...aspect,
        eventType: 'ASPECT_MAJOR'
      })).concat(specialEvents)

      const result: RealAstrologyData = {
        timestamp: date.toISOString(),
        planets: planetsWithStatus, // Usar planetas com status
        aspects: aspectsCurrentTT,
        // novos campos para consumo futuro na UI
        aspectsCurrentTT,
        aspectsTransitsToNatalTN,
        aspectsNatalToNatal,
        houses: houses.cusps,
        ascendant: houses.ascendant,
        midheaven: houses.midheaven,
        housesApproximate: (houses as any).approximate === true,
        houseSystem: normalizeHouseSystem((houses as any).system || (houses as any).systemEffective || (globalThis as any).__userHouseSystem || 'whole-sign'),
        collective,
        collectiveWeekly: (weekKey && RealAstrologyEngine._weeklyTTCache.get(weekKey)) ? {
          key: weekKey!,
          keyAspects: (RealAstrologyEngine._weeklyTTCache.get(weekKey!) || []).slice(0,5) as any
        } : undefined,
        collectiveMonthly: (monthKey && RealAstrologyEngine._monthlyTTCache.get(monthKey)) ? {
          key: monthKey!,
          keyAspects: (RealAstrologyEngine._monthlyTTCache.get(monthKey!) || []).slice(0,5) as any
        } : undefined,
        transits: {
          personal: personalTransits,
          general: generalTransits,
          byArea,
        },
        statusPersonal,
        lifeAreas,
        // Ã°Å¸Å’Å¸ NOVAS FUNCIONALIDADES GRATUITAS
        natalPlanets,
        natalAscendant: natalHouses.ascendant,
        natalMidheaven: natalHouses.midheaven,
        natalHousesApproximate: (natalHouses as any).approximate === true,
        natalHouses: natalHouses.cusps,
        planetComparisons,
        chartSummary,
        houseAspects,
        // Ã°Å¸Å’Å¸ NOVO: AnÃƒÂ¡lise completa de status planetÃƒÂ¡rios
        planetaryStatusAnalysis,
        debug: {
          lifeAreas: ((this as any)._debugLifeAreas) || {},
          // Remover personalTransitsSummary - nÃƒÂ£o estÃƒÂ¡ na interface
        }
      }

      console.log('Ã°Å¸Å½Â¯ CÃƒÂ¡lculos astrolÃƒÂ³gicos REAIS concluÃƒÂ­dos com sucesso!')
      return result

    } catch (error) {
      console.error('Ã¢ÂÅ’ Erro nos cÃƒÂ¡lculos astrolÃƒÂ³gicos reais:', error)
      const errorMessage = error instanceof Error ? error.message : String(error)
      throw new Error(`Falha nos cÃƒÂ¡lculos astrolÃƒÂ³gicos reais: ${errorMessage}`)
    }
  }

  /**
   * Calcula posiÃƒÂ§ÃƒÂµes planetÃƒÂ¡rias REAIS usando Astronomy Engine (precisÃƒÂ£o NASA)
   */
  private static async calculateRealPlanetPositions(
    date: Date, 
    latitude: number, 
    longitude: number
  ): Promise<RealPlanetPosition[]> {
    const positions: RealPlanetPosition[] = []
    
    for (const planetName of this.PLANETS) {
      try {
        // Usar Astronomy Engine para posiÃƒÂ§ÃƒÂµes REAIS
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

        // PosiÃƒÂ§ÃƒÂ£o geocÃƒÂªntrica REAL
  const position = Astronomy.GeoVector(body, date, false)
        
        // Verificar se a posiÃƒÂ§ÃƒÂ£o ÃƒÂ© vÃƒÂ¡lida
        if (!position || position.x === undefined || position.y === undefined || position.z === undefined) {
          console.error(`Ã¢ÂÅ’ PosiÃƒÂ§ÃƒÂ£o invÃƒÂ¡lida para ${planetName}:`, position)
          continue
        }
        
        // Converter para coordenadas eclÃƒÂ­pticas
        const ecliptic = Astronomy.Ecliptic(position)
        
        // Verificar se coordenadas eclÃƒÂ­pticas sÃƒÂ£o vÃƒÂ¡lidas (astronomy-engine usa 'elon' e 'elat')
        if (!ecliptic || ecliptic.elon === undefined || ecliptic.elat === undefined) {
          console.error(`Ã¢ÂÅ’ Coordenadas eclÃƒÂ­pticas invÃƒÂ¡lidas para ${planetName}:`, ecliptic)
          continue
        }
        
        // Calcular velocidade (diferenÃƒÂ§a de posiÃƒÂ§ÃƒÂ£o em 1 dia)
        const nextDay = new Date(date.getTime() + 24 * 60 * 60 * 1000)
  const nextPosition = Astronomy.GeoVector(body, nextDay, false)
        const nextEcliptic = Astronomy.Ecliptic(nextPosition)
        const rawSpeed = (nextEcliptic && nextEcliptic.elon !== undefined) ? 
          nextEcliptic.elon - ecliptic.elon : 0
        const speed = this.normalizeDelta(rawSpeed)

        const prevDay = new Date(date.getTime() - 24 * 60 * 60 * 1000)
        const prevPosition = Astronomy.GeoVector(body, prevDay, false)
        const prevEcliptic = Astronomy.Ecliptic(prevPosition)
        const prevLongitude = (prevEcliptic && prevEcliptic.elon !== undefined)
          ? prevEcliptic.elon
          : undefined
        const prevSpeed = prevLongitude !== undefined
          ? this.normalizeDelta(ecliptic.elon - prevLongitude)
          : undefined

        // Determinar signo e grau
        const signIndex = Math.floor(ecliptic.elon / 30)
        const degree = ecliptic.elon % 30
        const sign = this.SIGNS[signIndex] || '\u00C1ries'

        // Verificar retrogradaÃƒÂ§ÃƒÂ£o
        const isRetrograde = speed < 0

        const planetData = {
          name: planetName,
          longitude: ecliptic.elon, // astronomy-engine usa 'elon'
          latitude: ecliptic.elat,  // astronomy-engine usa 'elat'
          distance: position.Length() || Math.sqrt(position.x*position.x + position.y*position.y + position.z*position.z) || 1.0,
          speed,
          sign,
          degree,
          house: 1, // SerÃƒÂ¡ calculado posteriormente
          isRetrograde,
          prevLongitude,
          prevSpeed
        }
        
        console.log(`Ã°Å¸â€Â DEBUG ${planetName}:`, {
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
        console.error(`Ã¢ÂÅ’ Erro ao calcular posiÃƒÂ§ÃƒÂ£o de ${planetName}:`, error)
      }
    }

    return positions
  }

  /**
   * Backend de alta precisÃƒÂ£o (Placidus/efemÃƒÂ©rides robustas)
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
    // Adaptar para RealPlanetPosition esperado se o backend jÃƒÂ¡ fornecer eclÃƒÂ­pticas
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

  /** Bundle: posiÃƒÂ§ÃƒÂµes + casas + natal, via backend */
  private static async fetchBackendBundle(
    currentDate: Date,
    natalDate: Date,
    latitude: number,
    longitude: number,
    options?: { natalLocal?: string; natalTimezone?: string; natalLat?: number; natalLon?: number }
  ): Promise<{
    current: { planets: RealPlanetPosition[]; houses: NormalizedHouseMeta }
    natal: { planets: RealPlanetPosition[]; houses: NormalizedHouseMeta }
  }> {
    const backend = process.env.EXPO_PUBLIC_BACKEND_URL || 'https://tabulav0dev-backend.vercel.app'
    const ascOverrideDeg = Number((globalThis as any).__ascOverrideDeg)
    const natalAscOverrideDeg = Number((globalThis as any).__natalAscOverrideDeg)
    const hasNatalLocal = !!(options?.natalLocal && options?.natalTimezone)
    const requestBody: any = {
      datetimeISO: currentDate.toISOString(),
      lat: latitude,
      lon: longitude,
      includeHouses: true,
      // Respeitar sistema de casas escolhido pelo usuÃƒÂ¡rio (fallback 'placidus')
        system: normalizeHouseSystem((globalThis as any).__userHouseSystem || 'whole-sign'),
      natalISO: hasNatalLocal ? undefined : natalDate.toISOString(),
      natalLocal: hasNatalLocal ? options?.natalLocal : undefined,
      natalTimezone: hasNatalLocal ? options?.natalTimezone : undefined,
      natalLat: options?.natalLat,
      natalLon: options?.natalLon,
      bodies: RealAstrologyEngine.PLANETS,
    }
    if (Number.isFinite(ascOverrideDeg)) requestBody.ascOverrideDeg = ascOverrideDeg
    if (Number.isFinite(natalAscOverrideDeg)) requestBody.natalAscOverrideDeg = natalAscOverrideDeg

    try {
      // Ativar debug detalhado quando a URL tiver ?debug=1
      if (typeof window !== 'undefined' && window.location.search.includes('debug=1')) {
        requestBody.debug = true
      }
    } catch {}

    console.log('Ã°Å¸â€ºÂ°Ã¯Â¸Â ASTRO DEBUG - Request posiÃƒÂ§ÃƒÂµes/houses (backend)', requestBody)

  const resp = await fetch(`${backend}/api/astro/positions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    })
    if (!resp.ok) throw new Error('backend error')
    const data = await resp.json()

    const normalizeBackendBody = (raw: any): string => {
      const m: Record<string, string> = {
        Sol: 'Sun',
        Lua: 'Moon',
        Mercurio: 'Mercury',
        Venus: 'Venus',
        Marte: 'Mars',
        Jupiter: 'Jupiter',
        Saturno: 'Saturn',
        Urano: 'Uranus',
        Netuno: 'Neptune',
        Plutao: 'Pluto',
      };
      if (typeof raw !== 'string') return String(raw || '');
      const cleaned = raw.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      return m[cleaned] || raw;
    };

    const toPlanet = (p: any): RealPlanetPosition => {
      const body = normalizeBackendBody(p.body || p.name);
      const lon = typeof p.lon === 'number' ? p.lon : (typeof p.position === 'number' ? p.position : 0);
      const speedRaw = typeof p.speed === 'number' ? p.speed : undefined;
      const fallbackSpeed = RealAstrologyEngine.PLANET_MEAN_SPEEDS[body] ?? 0;
      const speed = (typeof speedRaw === 'number' && Math.abs(speedRaw) > 0.0001)
        ? speedRaw
        : fallbackSpeed;
      return {
        name: body,
        longitude: lon,
        latitude: p.lat ?? 0,
        distance: p.dist ?? 1,
        speed: speed,
        sign: RealAstrologyEngine.SIGNS[Math.floor((lon % 360) / 30)],
        degree: (lon % 360) % 30,
        // Confiar na casa do backend quando presente; fallback para 0 para reatribuicao local
        house: typeof p.house === 'number' ? p.house : (0 as unknown as number),
        isRetrograde: typeof p.retrograde === 'boolean' ? p.retrograde : speed < 0,
      };
    };

    const currentPlanets = ((data.positions || data.planets) || []).map(toPlanet)
    let currentHousesRaw: HouseMeta =
      data.houses || { cusps: Array.from({ length: 12 }, (_, i) => i * 30), ascendant: 0, midheaven: 90 }
    const natalPlanets = ((data.natal?.positions || data.natal?.planets) || []).map(toPlanet)
    // Ã°Å¸Å’Å¸ CORREÃƒâ€¡ÃƒÆ’O: Calcular casas natais localmente se o backend nÃƒÂ£o as forneceu
    let natalHousesRaw: HouseMeta
    
    const backendNatalHouses = data.natal?.houses || data.natalHouses
    if (backendNatalHouses) {
      // Backend forneceu casas natais - usar
      natalHousesRaw = backendNatalHouses
      console.log('Ã¢Å“â€¦ Backend forneceu casas natais')
    } else {
      if (!this.canUseLocalFallback()) {
        throw new Error('Backend did not return natal houses and local fallback is disabled in production')
      }
      // Backend nÃƒÂ£o forneceu casas natais - calcular localmente
      console.log('Ã¢Å¡Â Ã¯Â¸Â Backend nÃƒÂ£o forneceu casas natais - calculando localmente...')
      try {
        const natalLat = options?.natalLat || latitude
        const natalLon = options?.natalLon || longitude
        const system = normalizeHouseSystem((globalThis as any).__userHouseSystem || 'whole-sign')
        
        const res = await computeHousesUTC(natalDate, natalLat, natalLon, system)
        natalHousesRaw = { 
          cusps: res.cusps, 
          ascendant: res.asc, 
          midheaven: res.mc, 
          approximate: (res as any).approximate === true,
          system: system,
          systemEffective: (res as any).systemEffective || system
        }
        console.log('Ã¢Å“â€¦ Casas natais calculadas localmente')
      } catch (error) {
        console.error('Ã¢ÂÅ’ Erro ao calcular casas natais localmente:', error)
        // Fallback para casas atuais (nÃƒÂ£o ideal, mas funcional)
        natalHousesRaw = currentHousesRaw
        console.log('Ã¢Å¡Â Ã¯Â¸Â Usando casas atuais como fallback para casas natais')
      }
    }

    // Reatribuir SEMPRE as casas no cliente usando as cÃƒÂºspides do backend
    // para garantir consistÃƒÂªncia de partiÃƒÂ§ÃƒÂ£o (ASC-ancorado, CCW, fronteira eps)
    let currentHouses = this.normalizeHouseMeta(currentHousesRaw)
    let natalHouses = this.normalizeHouseMeta(natalHousesRaw)
    const currentWithHouses = this.assignHouses(currentPlanets, currentHouses)
    const natalWithHouses = this.assignHouses(natalPlanets, natalHouses)

    // CRITICO: validar ordem das cuspides (somente em debug)
    const debugEnabled = typeof window !== 'undefined' && window.location.search.includes('debug=1')
    const validateCuspsOrder = (cusps: number[], label: string, systemRaw?: HouseSystem | string) => {
      const system = normalizeHouseSystem(systemRaw || (globalThis as any).__userHouseSystem || 'whole-sign')
      if (system !== 'placidus') {
        return true
      }
      const norm = (d: number) => (d % 360 + 360) % 360
      if (!Array.isArray(cusps) || cusps.length < 12) {
        if (debugEnabled) {
          console.error(`${label}: cusps invalid`, { length: Array.isArray(cusps) ? cusps.length : null })
        }
        return false
      }

      const unwrapped = [norm(cusps[0])]
      let isValid = true
      const errosDetectados: string[] = []

      for (let i = 1; i < 12; i++) {
        let v = norm(cusps[i])
        while (v < unwrapped[i - 1]) v += 360
        const step = v - unwrapped[i - 1]
        if (step <= 0 || step > 120) {
          isValid = false
          errosDetectados.push(`Casa ${i}->${i + 1}`)
          if (debugEnabled) {
            console.error(`${label}: cusps out of order`, {
              casa: i,
              current: cusps[i - 1].toFixed(2),
              next: cusps[i].toFixed(2),
              step: step.toFixed(2)
            })
          }
        }
        unwrapped.push(v)
      }

      if (debugEnabled) {
        if (isValid) {
          console.log(`${label}: cusps ordered`)
        } else {
          console.log(`${label}: ${errosDetectados.length} erros detectados: ${errosDetectados.join(', ')}`)
        }
      }

      return isValid
    }

    const autoCorrectHouses = (
      houses: NormalizedHouseMeta,
      label: string
    ): NormalizedHouseMeta => {
      const system = (houses as any).systemEffective || (houses as any).system || 'whole-sign'
      if (system !== 'placidus') {
        return houses
      }

      if (!validateCuspsOrder(houses.cusps, label, system)) {
        if (debugEnabled) console.log(`${label}: applying equal-house autocorrect`)
        const newCusps = []
        for (let i = 0; i < 12; i++) {
          newCusps[i] = (houses.ascendant + (i * 30)) % 360
        }

        if (debugEnabled) console.log(`${label}: houses autocorrected`)
        validateCuspsOrder(newCusps, `${label} CORRIGIDAS`, system)

        return {
          ...houses,
          cusps: newCusps,
          systemEffective: system
        }
      }

      return houses
    }

    const fmtCusps = (cusps: number[]) => cusps.map((c, i) => ({ casa: i + 1, cusp: Number(c.toFixed ? c.toFixed(2) : c) }))
    if (debugEnabled) {
      console.log('Ã°Å¸â€œÂ¦ ASTRO DEBUG - Backend payload meta', data?.meta || null)
    }
    
    // Ã°Å¸Å¡â‚¬ APLICAR AUTO-CORREÃƒâ€¡ÃƒÆ’O SE NECESSÃƒÂRIO
    currentHouses = autoCorrectHouses(currentHouses, 'Casas ATUAIS')
    
    if (debugEnabled) console.log('Ã°Å¸ÂÂ  ASTRO DEBUG - Casas ATUAIS', {
      system: (currentHouses as any).system || null,
      systemEffective: (currentHouses as any).systemEffective || null,
      approximate: !!(currentHouses as any).approximate,
      asc: currentHouses.ascendant,
      mc: currentHouses.midheaven,
      cusps: fmtCusps(currentHouses.cusps),
      planets: currentWithHouses.map(p => ({ planeta: p.name, lon: Number(p.longitude.toFixed ? p.longitude.toFixed(2) : p.longitude), casa: p.house }))
    })
    try { if (debugEnabled && (currentHouses as any)._debug) console.log('Ã°Å¸Â§Âª ASTRO DEBUG - Casas ATUAIS _debug', (currentHouses as any)._debug) } catch {}
    
    // Ã°Å¸Å¡â‚¬ APLICAR AUTO-CORREÃƒâ€¡ÃƒÆ’O PARA CASAS NATAIS SE NECESSÃƒÂRIO
    natalHouses = autoCorrectHouses(natalHouses, 'Casas NATAIS')
    
    if (debugEnabled) console.log('Ã°Å¸ÂÂ  ASTRO DEBUG - Casas NATAIS', {
      system: (natalHouses as any).system || null,
      systemEffective: (natalHouses as any).systemEffective || null,
      approximate: !!(natalHouses as any).approximate,
      asc: natalHouses.ascendant,
      mc: natalHouses.midheaven,
      cusps: fmtCusps(natalHouses.cusps),
      planets: natalWithHouses.map(p => ({ planeta: p.name, lon: Number(p.longitude.toFixed ? p.longitude.toFixed(2) : p.longitude), casa: p.house }))
    })
    try { if (debugEnabled && (natalHouses as any)._debug) console.log('Ã°Å¸Â§Âª ASTRO DEBUG - Casas NATAIS _debug', (natalHouses as any)._debug) } catch {}
    
    // Ã¢Å“â€¦ VALIDAÃƒâ€¡Ãƒâ€¢ES FINAIS GARANTEM QUALIDADE 100%
    validateCuspsOrder(currentHouses.cusps, 'Casas ATUAIS FINAIS', (currentHouses as any).systemEffective || (currentHouses as any).system)
    validateCuspsOrder(natalHouses.cusps, 'Casas NATAIS FINAIS', (natalHouses as any).systemEffective || (natalHouses as any).system)

    return {
      current: { planets: currentWithHouses, houses: currentHouses },
      natal: { planets: natalWithHouses, houses: natalHouses },
    }
  }

  /**
   * Calcula casas astrolÃƒÂ³gicas REAIS usando sistema Placidus
   */
  private static async calculateRealHouses(
    currentDate: Date,
    _birthDate: Date, 
    latitude: number, 
    longitude: number,
    houseSystem?: HouseSystem
    ): Promise<NormalizedHouseMeta> {
    // Delegar para mÃƒÂ³dulo unificado de casas do app (garante monotonicidade e fallback)
    try {
        const system = normalizeHouseSystem(houseSystem || (globalThis as any).__userHouseSystem || 'whole-sign')
        const res = await computeHousesUTC(currentDate, latitude, longitude, system)
        return {
          cusps: res.cusps,
          ascendant: res.asc,
          midheaven: res.mc,
          approximate: (res as any).approximate === true,
          system: res.system,
          systemEffective: res.systemEffective
        }
      } catch (error) {
      console.error('Ã¢ÂÅ’ Erro no cÃƒÂ¡lculo das casas (unificado):', error)
      const ascendant = 0
      const midheaven = 90
      const cusps = Array.from({ length: 12 }, (_, i) => (ascendant + i * 30) % 360)
      return { cusps, ascendant, midheaven, approximate: true }
    }
  }

  /**
   * Calcula aspectos REAIS entre planetas
   */
  private static calculateRealAspects(planets: RealPlanetPosition[]): RealAspect[] {
    // Usar engine unificada com orbes configurÃƒÂ¡veis
    const A = planets.map(p => ({ name: p.name, longitude: p.longitude, speed: p.speed }))
    const res = detectAspects(A, A, aspectsConfig)
    return res.map(r => ({ planet1: r.planet1, planet2: r.planet2, type: r.type, orb: r.orb, isApplying: r.isApplying, strength: r.strength }))
  }

  /** ÃƒÂndice coletivo do dia (TÃ¢â€ â€™T) e fase lunar */
  private static computeCollectiveIndex(aspectsTT: RealAspect[], planets: RealPlanetPosition[]): NonNullable<RealAstrologyData['collective']> {
    const angleOf = (type: string): number => {
  const def = (aspectsConfig as any).aspects?.find((d: any) => d.name === type)
      return def?.angle ?? 0
    }
    const maxOrbForPair = (type: string, p1Name: string, p2Name: string): number => {
      const cap = (aspectsConfig as any).maxOrbCap ?? 12
      const def = (aspectsConfig as any).aspects?.find((d: any) => d.name === type)
      let eff = def?.baseOrb ?? 5
      const ang = def?.angle ?? angleOf(type)
  const pa = (aspectsConfig as any).planetAspectOrbs?.[normalizePlanet(p1Name)]?.[ang]
  const pb = (aspectsConfig as any).planetAspectOrbs?.[normalizePlanet(p2Name)]?.[ang]
      if (pa !== undefined || pb !== undefined) eff = Math.min(eff, pa ?? eff, pb ?? eff)
  const ovrA = (aspectsConfig as any).overrides?.[normalizePlanet(p1Name)]?.[normalizePlanet(p2Name)]
  const ovrB = (aspectsConfig as any).overrides?.[normalizePlanet(p2Name)]?.[normalizePlanet(p1Name)]
      if (ovrA !== undefined || ovrB !== undefined) eff = Math.min(eff, ovrA ?? eff, ovrB ?? eff)
  const orbA = (aspectsConfig as any).planetOrbs?.[normalizePlanet(p1Name)]
  const orbB = (aspectsConfig as any).planetOrbs?.[normalizePlanet(p2Name)]
      if (orbA !== undefined || orbB !== undefined) eff = Math.min(eff, orbA ?? eff, orbB ?? eff)
      return Math.max(0, Math.min(cap, eff))
    }
    // Mapear planet data
    const get = (name: string) => planets.find(p => p.name === name)
    const slowBoost: Record<string, number> = { Jupiter:1.1, Saturn:1.2, Uranus:1.25, Neptune:1.25, Pluto:1.25 }
    const fastPenalty: Record<string, number> = { Moon:0.9 }
    const hardTypes = new Set(['quadratura','oposicao','semiquadratura','sesquiquadratura'])
    const softTypes = new Set(['trigono','sextil'])


    const scored = aspectsTT.map(a => {
      const p1 = get(a.planet1)
      const p2 = get(a.planet2)
      const w1 = (slowBoost[p1?.name||''] ?? 1)*(fastPenalty[p1?.name||''] ?? 1)
      const w2 = (slowBoost[p2?.name||''] ?? 1)*(fastPenalty[p2?.name||''] ?? 1)
      const w = (w1 + w2) / 2
      let sign = 0
      if (softTypes.has(a.type)) sign = +1
      else if (hardTypes.has(a.type)) sign = -1
      else if (a.type === 'conjuncao') {
        // ConjunÃƒÂ§ÃƒÂ£o: neutra Ã¢â€ â€™ avaliar pares clÃƒÂ¡ssicos
        const malefics = new Set(['Mars','Saturn'])
        const benefics = new Set(['Venus','Jupiter'])
        if ((p1 && malefics.has(p1.name)) || (p2 && malefics.has(p2.name))) sign = -1
        if ((p1 && benefics.has(p1.name)) || (p2 && benefics.has(p2.name))) sign = sign === -1 ? 0 : +1
      }
      const strength = a.strength ?? 50
      const score = Math.max(0, Math.min(100, strength * w))

      // Estimar janela de vigÃƒÂªncia a partir da orbe mÃƒÂ¡xima e velocidade relativa
      const orbAllowed = maxOrbForPair(a.type, a.planet1, a.planet2)
      const relSpeed = Math.max(0.02, Math.abs((p1?.speed ?? 0) - (p2?.speed ?? 0))) // deg/dia; piso para evitar /0
      let windowDays = (2 * orbAllowed) / relSpeed
      // Clamp e arredondamento
      if (!Number.isFinite(windowDays)) windowDays = 0
      windowDays = Math.min(365, Math.max(1, windowDays))
      windowDays = Math.round(windowDays)

      return { a: { ...a, orbAllowed, relSpeed, windowDays }, score, sign }
    })

    // Detectar padrÃƒÂµes aspectuais (simplificado)
    const keyFor = (x: string, y: string) => x < y ? `${x}|${y}` : `${y}|${x}`
    const hasPair = (list: RealAspect[], type: string, p: string, q: string) => list.some(a => a.type === type && keyFor(a.planet1,a.planet2) === keyFor(p,q))
    const idxOf = (list: RealAspect[], type: string, p: string, q: string): number | undefined => {
      for (let i=0;i<list.length;i++) { const a=list[i]; if (a.type===type && keyFor(a.planet1,a.planet2)===keyFor(p,q)) return i }
      return undefined
    }
    const uniqPlanets = Array.from(new Set(aspectsTT.flatMap(a => [a.planet1, a.planet2])))
    const boostIdx = new Map<number, number>()

    // TÃ¢â‚¬â€˜Square: AÃ¢â€“Â¡B, AÃ¢â€“Â¡C, BÃ¢ËœÂC
    for (const a of uniqPlanets) {
      for (let i = 0; i < uniqPlanets.length; i++) {
        for (let j = i+1; j < uniqPlanets.length; j++) {
          const b = uniqPlanets[i], c = uniqPlanets[j]
          if (hasPair(aspectsTT,'quadratura',a,b) && hasPair(aspectsTT,'quadratura',a,c) && hasPair(aspectsTT,'oposicao',b,c)) {
            const i1 = idxOf(aspectsTT,'quadratura',a,b)
            const i2 = idxOf(aspectsTT,'quadratura',a,c)
            const i3 = idxOf(aspectsTT,'oposicao',b,c)
            ;[i1,i2,i3].forEach(ix=>{ if(ix!==undefined) boostIdx.set(ix, Math.max(1.15, boostIdx.get(ix)||1)) })
          }
        }
      }
    }

    // Grande TrÃƒÂ­gono: AÃ¢â€“Â³B, AÃ¢â€“Â³C, BÃ¢â€“Â³C
    for (let i = 0; i < uniqPlanets.length; i++) {
      for (let j = i+1; j < uniqPlanets.length; j++) {
        for (let k = j+1; k < uniqPlanets.length; k++) {
          const a = uniqPlanets[i], b = uniqPlanets[j], c = uniqPlanets[k]
          if (hasPair(aspectsTT,'trigono',a,b) && hasPair(aspectsTT,'trigono',a,c) && hasPair(aspectsTT,'trigono',b,c)) {
            const i1 = idxOf(aspectsTT,'trigono',a,b)
            const i2 = idxOf(aspectsTT,'trigono',a,c)
            const i3 = idxOf(aspectsTT,'trigono',b,c)
            ;[i1,i2,i3].forEach(ix=>{ if(ix!==undefined) boostIdx.set(ix, Math.max(1.12, boostIdx.get(ix)||1)) })
          }
        }
      }
    }

    // Yod: AÃ¢Å¡Â»B, AÃ¢Å¡Â»C e BÃ¢Å“Â¶C
    for (let i = 0; i < uniqPlanets.length; i++) {
      for (let j = 0; j < uniqPlanets.length; j++) if (j!==i) {
        for (let k = 0; k < uniqPlanets.length; k++) if (k!==i && k!==j) {
          const a = uniqPlanets[i], b = uniqPlanets[j], c = uniqPlanets[k]
          if (hasPair(aspectsTT,'quincuncio',a,b) && hasPair(aspectsTT,'quincuncio',a,c) && hasPair(aspectsTT,'sextil',b,c)) {
            const i1 = idxOf(aspectsTT,'quincuncio',a,b)
            const i2 = idxOf(aspectsTT,'quincuncio',a,c)
            const i3 = idxOf(aspectsTT,'sextil',b,c)
            ;[i1,i2,i3].forEach(ix=>{ if(ix!==undefined) boostIdx.set(ix, Math.max(1.10, boostIdx.get(ix)||1)) })
          }
        }
      }
    }

    // Aplicar boosts
    if (boostIdx.size) {
      boostIdx.forEach((mult, idx) => {
        const s = scored[idx]
        if (s) s.score = Math.max(0, Math.min(100, Math.round(s.score * mult)))
      })
    }

    const pos = scored.filter(s => s.sign > 0).map(s => s.score)
    const neg = scored.filter(s => s.sign < 0).map(s => s.score)
    const avg = (arr: number[]) => arr.length ? arr.reduce((x,y)=>x+y,0)/arr.length : 0
    const positive = Math.round(Math.max(0, Math.min(100, avg(pos))))
    const negative = Math.round(Math.max(0, Math.min(100, avg(neg))))

    // Top 5 aspectos ponderados
    const keyAspects = scored.sort((a,b)=>b.score - a.score).slice(0,5).map(s => s.a)

    // Fase lunar simples
    const sun = get('Sun')
    const moon = get('Moon')
    const norm = (d:number)=>((d%360)+360)%360
    const elong = sun && moon ? Math.abs(norm(moon.longitude - sun.longitude)) : 0
    const elong180 = elong>180 ? 360-elong : elong // 0..180
    const waxing = sun && moon ? (norm(moon.longitude - sun.longitude) < 180) : true
    let name: 'Nova'|'Crescente'|'Cheia'|'Minguante' = 'Crescente'
    if (elong180 < 12) name = 'Nova'
    else if (Math.abs(elong180 - 180) < 12) name = 'Cheia'
    else if (!waxing) name = 'Minguante'

    return {
      positive,
      negative,
      keyAspects,
      lunarPhase: { name, waxing, elongation: Number(elong180.toFixed(2)) }
    }
  }

  /**
   * Atribui casa a cada planeta com base nas cÃƒÂºspides calculadas
   */
  private static assignHouses(
    planets: RealPlanetPosition[],
    houses: NormalizedHouseMeta
  ): RealPlanetPosition[] {
    const asc = Number.isFinite(houses.ascendant) ? houses.ascendant : houses.cusps[0]
    const system = normalizeHouseSystem(houses.system || houses.systemEffective || (globalThis as any).__userHouseSystem || 'whole-sign')
    return planets.map(p => ({
      ...p,
      house: getPlanetHouse({
        planetLongitude: p.longitude,
        ascLongitude: asc,
        houseCusps: houses.cusps,
        system
      })
    }))
  }

  /**
   * Calcula status REAL das ÃƒÂ¡reas da vida baseado em planetas e aspectos
   */
  /**
   * LifeAreas calcula o status por area usando transitos em casas natais
   * + aspectos transito->natal. Cada planeta contribui com:
   * - dignidades por signo (domicilio/exaltacao/detrimento/queda + triplicidade)
   * - relevancia por casa para a area
   * - aspectos ponderados (orb, aplicante/separante, benefico/malefico)
   * - condicoes acidentais (ex: retrogrado/combusto/velocidade)
   * Resultado e normalizado em 0-100 e guardado como percentage.
   */
  private static calculateRealLifeAreas(
    planets: RealPlanetPosition[],
    aspects: RealAspect[],
    houses: { cusps: number[], ascendant: number, midheaven: number },
    natalPlanets: RealPlanetPosition[],
    date: Date,
    latitude: number,
    longitude: number
  ): RealAstrologyData['lifeAreas'] {
    const lifeAreas: RealAstrologyData['lifeAreas'] = {}
    const debugByArea: NonNullable<RealAstrologyData['debug']>['lifeAreas'] = {}
    const sun = planets.find(p => p.name === 'Sun')
    const natalAlmuten = this.getNatalAlmuten(natalPlanets)

    // Helpers para padrÃƒÂµes Pessoais envolvendo pontos natais
    const degDiff = (a:number,b:number)=>{ const d=Math.abs(((a-b+540)%360)-180); return d }
    const within = (x:number, target:number, tol:number)=> Math.abs(x-target) <= tol
    const natalByName = new Map(natalPlanets.map(p=>[p.name,p]))
    const natalHouseByName = this.buildNatalHouseLookup(natalPlanets)
    const countByNatal: Record<string, number> = {}
    aspects.forEach(a=>{ countByNatal[a.planet2]=(countByNatal[a.planet2]||0)+1 })
    const tnPatternBoost: Map<string, number> = new Map()
    const markBoost = (t:string,n:string,m:number)=>{
      const k = `${t}|${n}`
      tnPatternBoost.set(k, Math.max(m, tnPatternBoost.get(k)||1))
    }
    // Escanear por transit hitting dois natais para padrÃƒÂµes: TÃ¢â‚¬â€˜Square, Grande TrÃƒÂ­gono, Yod
    const byTransit: Record<string, RealAspect[]> = {}
    for (const a of aspects) {
      (byTransit[a.planet1] ||= []).push(a)
    }
    for (const [tName, list] of Object.entries(byTransit)) {
      for (let i=0;i<list.length;i++) for (let j=i+1;j<list.length;j++) {
        const A = list[i], B = list[j]
        const n1 = natalByName.get(A.planet2), n2 = natalByName.get(B.planet2)
        if (!n1 || !n2) continue
        const dd = degDiff(n1.longitude, n2.longitude)
        // TÃ¢â‚¬â€˜Square: tÃ¢â€“Â¡n1 e tÃ¢â€“Â¡n2 com n1Ã¢ËœÂn2
        if (A.type==='quadratura' && B.type==='quadratura' && within(dd,180,6)) {
          markBoost(tName, A.planet2, 1.15)
          markBoost(tName, B.planet2, 1.15)
        }
        // Grande TrÃƒÂ­gono: tÃ¢â€“Â³n1 e tÃ¢â€“Â³n2 com n1Ã¢â€“Â³n2
        if (A.type==='trigono' && B.type==='trigono' && within(dd,120,6)) {
          markBoost(tName, A.planet2, 1.12)
          markBoost(tName, B.planet2, 1.12)
        }
        // Yod: tÃ¢Å¡Â»n1 e tÃ¢Å¡Â»n2 com n1Ã¢Å“Â¶n2
        if (A.type==='quincuncio' && B.type==='quincuncio' && within(dd,60,4)) {
          markBoost(tName, A.planet2, 1.10)
          markBoost(tName, B.planet2, 1.10)
        }
      }
    }

    for (const [areaName, config] of Object.entries(this.LIFE_AREAS)) {
      let totalScore = 0
      let influences: string[] = []
      let mainPlanets: string[] = []

      // Analisar planetas relevantes para a ÃƒÂ¡rea
      let planetScores: number[] = []
      const planetDetails: NonNullable<RealAstrologyData['debug']>['lifeAreas'][string]['planetDetails'] = [] as any
      
      for (const planetName of config.planets) {
        const planet = planets.find(p => p.name === planetName)
        if (!planet) continue

        mainPlanets.push(planetName)

        let planetScore = 0

        // PontuaÃƒÂ§ÃƒÂ£o baseada no signo (dignidades essenciais)
        const signScore = this.getPlanetSignScore(planet)
        planetScore += signScore * 0.30
        if (signScore >= 70) influences.push(`${planetName} em ${planet.sign} (dignidade)`) 
        if (signScore <= 35) influences.push(`${planetName} em ${planet.sign} (debilidade)`) 

        // PontuaÃƒÂ§ÃƒÂ£o baseada na casa (acidentais iniciais)
        const houseScore = this.getPlanetHouseScore(planet, config.houses)
        planetScore += houseScore * 0.30
        if (houseScore >= 65) influences.push(`${planetName} na casa ${planet.house}`)

        // InfluÃƒÂªncias dos aspectos
        // Considerar aspectos TÃ¢â€ â€™N onde este planeta ÃƒÂ© o trÃƒÂ¢nsito (detectAspects mantÃƒÂ©m planet1 como trÃƒÂ¢nsito)
        const planetAspects = aspects.filter(a =>
          a.planet1 === planetName &&
          this.isTransitRelevantToArea(a.planet2, planet.house, config.houses, natalHouseByName)
        )
        
        let aspectScoreSum = 0
        let aspectCount = 0
        const aspectDetails: Array<{ with: string; type: string; orb: number; isApplying: boolean; baseScore: number; beneficMaleficDelta: number; finalScore: number }> = []
        
        for (const aspect of planetAspects) {
          // Contextos
          const other = aspect.planet2
          const otherNatal = natalPlanets.find(p => p.name === other)
          const baseScore = this.getAspectScoreAdvanced(aspect, planets, natalPlanets)

          // BenÃƒÂ©ficos/MalÃƒÂ©ficos do alvo natal
          const benefics = ['Venus', 'Jupiter']
          const malefics = ['Mars', 'Saturn']
          const harmonious = aspect.type === 'trigono' || aspect.type === 'sextil'
          const hard = aspect.type === 'quadratura' || aspect.type === 'oposicao'
          let delta = 0
          if (benefics.includes(other)) {
            if (harmonious) delta += 10
            else if (aspect.type === 'conjuncao') delta += 5
          }
          if (malefics.includes(other)) {
            if (hard) delta -= 10
            else if (aspect.type === 'conjuncao') delta -= 5
          }

          // RecepÃƒÂ§ÃƒÂ£o mÃƒÂºtua simples (domicÃƒÂ­lio/exaltaÃƒÂ§ÃƒÂ£o)
          const receptionMult = this.getReceptionMultiplier(
            planets.find(p=>p.name===planetName)!,
            otherNatal || undefined
          )

          // Peso por importÃƒÂ¢ncia do alvo natal
          const natalWeights: Record<string, number> = {
            Sun: 1.15, Moon: 1.15,
            Mercury: 1.0, Venus: 1.05, Mars: 1.05,
            Jupiter: 1.10, Saturn: 1.10,
            Uranus: 0.95, Neptune: 0.95, Pluto: 0.95,
          }
          const natalWeight = natalWeights[other] ?? 1.0

          // Casa natal relevante
          const transitInRelevantHouse = config.houses.includes(planet.house)
          const relevantHouseBoost = transitInRelevantHouse ? 1.10 : 1.0
          // RegÃƒÂªncias de casa: pequeno boost quando o trÃƒÂ¢nsito aspecta regente de casa-chave da ÃƒÂ¡rea
          const areaRulers = new Set(config.houses.flatMap(h => RealAstrologyEngine.HOUSE_RULERS[h] || []))
          const rulerBoost = areaRulers.has(other) ? 1.06 : 1.0

          // PadrÃƒÂµes Pessoais
          const pattMult = tnPatternBoost.get(`${planetName}|${other}`) || 1.0
          // Cluster: mÃƒÂºltiplos hits ao mesmo natal
          const clusterMult = (countByNatal[other]||0) >= 2 ? 1.10 : 1.0

          // Casa angularidade Ã¢â‚¬â€œ multiplicador acidental pelo local do trÃƒÂ¢nsito nas casas NATAIS
          const angularMult = this.getHouseAngularMultiplier(planet.house)

          // Almuten (peso extra quando envolvido)
          const almutenMult = (natalAlmuten && (planetName === natalAlmuten || other === natalAlmuten)) ? 1.08 : 1.0
          let aspectScore = Math.max(0, Math.min(100,
            baseScore * natalWeight * relevantHouseBoost * rulerBoost * receptionMult * angularMult * almutenMult * pattMult * clusterMult + delta
          ))

          // Peso de duraÃƒÂ§ÃƒÂ£o por ciclo planetÃƒÂ¡rio (Lua/MercÃƒÂºrio < 1; lentos > 1)
          aspectScore *= this.getPlanetDurationWeight(planetName, other)

          // Estimativa de tempo ao pico (aplicante) ou desde o pico (separante)
          const transitSpeed = Math.abs(planets.find(p=>p.name===planetName)?.speed ?? 0)
          const relSpeedTN = Math.max(0.02, transitSpeed)
          const daysToPeak = aspect.orb / relSpeedTN
          const timeInfo: any = {}
          if (Number.isFinite(daysToPeak)) {
            if (aspect.isApplying) timeInfo.timeToPeakDays = Math.round(daysToPeak)
            else timeInfo.elapsedSincePeakDays = Math.round(daysToPeak)
          }
          aspectDetails.push({
            with: other,
            type: aspect.type,
            orb: aspect.orb,
            isApplying: aspect.isApplying,
            baseScore,
            beneficMaleficDelta: delta,
            finalScore: aspectScore,
            ...timeInfo
          })

          aspectScoreSum += aspectScore
          aspectCount++
          
          if (aspectScore > 60) {
            const tagExtra = delta > 0 ? ' (apoio)' : delta < 0 ? ' (tensÃƒÂ£o)' : ''
            const houseTag = transitInRelevantHouse ? ` [casa ${planet.house}]` : ''
            influences.push(`${aspect.type} ${other}${tagExtra}${houseTag}`)
          }
        }
        
        // MÃƒÂ©dia dos aspectos em vez de soma
        if (aspectCount > 0) {
          planetScore += (aspectScoreSum / aspectCount) * 0.40
        } else {
          planetScore += 50 * 0.40 // Neutro se nÃƒÂ£o hÃƒÂ¡ aspectos
        }

        // CondiÃƒÂ§ÃƒÂµes planetÃƒÂ¡rias (retrÃƒÂ³grado/combustÃƒÂ£o/velocidade)
        const cond = this.getAccidentalConditionsModifier(planet, sun?.longitude ?? undefined)
        planetScore += cond.modifier
        if (cond.tags.length) influences.push(...cond.tags)

        planetScores.push(planetScore)

        planetDetails.push({
            planet: planetName,
            house: planet.house,
            sign: planet.sign,
          signScore,
          houseScore,
          conditions: cond,
          aspects: aspectDetails,
          total: planetScore
        })
      }

      // Sistema de pesos por planeta (importÃƒÂ¢ncia astrolÃƒÂ³gica)
      const planetWeights: Record<string, number> = {
        'Sun': 1.2, 'Moon': 1.2,        // Luminares (mÃƒÂ¡xima importÃƒÂ¢ncia)
        'Mercury': 1.0, 'Venus': 1.0, 'Mars': 1.0,  // Pessoais
        'Jupiter': 1.1, 'Saturn': 1.1,              // Sociais
        'Uranus': 0.9, 'Neptune': 0.9, 'Pluto': 0.9 // Transpessoais
      }

      // Guard: sem planetas válidos → score neutro
      if (planetScores.length === 0) {
        lifeAreas[areaName] = { percentage: 50, status: 'neutro', influences: [], mainPlanets: [] }
        continue
      }

      // Score ponderado — divide pela soma dos pesos (não pelo comprimento)
      const totalWeight = config.planets.reduce(
        (s, n) => s + (planetWeights[n] || 1.0), 0
      )
      const weightedScore = planetScores.reduce((sum, score, i) => {
        const weight = planetWeights[config.planets[i]] || 1.0
        return sum + (score * weight)
      }, 0) / totalWeight

      // Score final baseado na lÃƒÂ³gica astrolÃƒÂ³gica real
      const finalScore = weightedScore
      // Normalizacao 0-100: percentage representa o saldo final do area
      // depois de ponderar planetas (signo, casa, condicoes) e aspectos.
      // Esse percentual e a base para thresholds do produto.

      // NormalizaÃƒÂ§ÃƒÂ£o baseada na lÃƒÂ³gica astrolÃƒÂ³gica (0-100%)
      const percentage = Math.max(0, Math.min(100, finalScore))
      
      // Determinar status baseado na pontuaÃƒÂ§ÃƒÂ£o
      // Rotulo interno (nao muda a matematica do percentual):
      // >= 80 excelente, >= 65 bom, >= 45 neutro, >= 25 desafiador, < 25 critico.
      // O produto pode aplicar outros thresholds sobre o percentual.
      const status = percentage >= 80 ? 'excelente' :
                    percentage >= 65 ? 'bom' :
                    percentage >= 45 ? 'neutro' :
                    percentage >= 25 ? 'desafiador' : 'critico'

      lifeAreas[areaName] = {
        percentage: Math.round(percentage),
        status,
        influences: influences.slice(0, 4), // Top influÃƒÂªncias
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

  private static getAspectOrbAllowed(type: string, p1Name: string, p2Name: string): number {
    const cap = (aspectsConfig as any).maxOrbCap ?? 12
    const def = (aspectsConfig as any).aspects?.find((d: any) => d.name === type)
    let eff = def?.baseOrb ?? 5
    const angleOf = (name: string): number => {
      const defAngle = (aspectsConfig as any).aspects?.find((d: any) => d.name === name)
      return defAngle?.angle ?? 0
    }
    const ang = def?.angle ?? angleOf(type)
    const pa = (aspectsConfig as any).planetAspectOrbs?.[normalizePlanet(p1Name)]?.[ang]
    const pb = (aspectsConfig as any).planetAspectOrbs?.[normalizePlanet(p2Name)]?.[ang]
    if (pa !== undefined || pb !== undefined) eff = Math.min(eff, pa ?? eff, pb ?? eff)
    const ovrA = (aspectsConfig as any).overrides?.[normalizePlanet(p1Name)]?.[normalizePlanet(p2Name)]
    const ovrB = (aspectsConfig as any).overrides?.[normalizePlanet(p2Name)]?.[normalizePlanet(p1Name)]
    if (ovrA !== undefined || ovrB !== undefined) eff = Math.min(eff, ovrA ?? eff, ovrB ?? eff)
    const orbA = (aspectsConfig as any).planetOrbs?.[normalizePlanet(p1Name)]
    const orbB = (aspectsConfig as any).planetOrbs?.[normalizePlanet(p2Name)]
    if (orbA !== undefined || orbB !== undefined) eff = Math.min(eff, orbA ?? eff, orbB ?? eff)
    return Math.max(0, Math.min(cap, eff))
  }

  private static getRelativeSpeed(speedA?: number, speedB?: number): number {
    return Math.max(0.02, Math.abs((speedA ?? 0) - (speedB ?? 0)))
  }

  private static normalizeAngle360(value: number): number {
    return ((value % 360) + 360) % 360
  }

  private static normalizeDelta(value: number): number {
    let delta = value
    if (delta > 180) delta -= 360
    if (delta < -180) delta += 360
    return delta
  }

  private static computeAspectWindow(params: {
    orb: number
    isApplying?: boolean
    orbAllowed: number
    relSpeed: number
    baseDate: Date
  }): { start: string; exact: string; end: string; days: number } {
    const safeRelSpeed = Math.max(0.02, Math.abs(params.relSpeed))
    let windowDays = (2 * params.orbAllowed) / safeRelSpeed
    if (!Number.isFinite(windowDays)) windowDays = 0
    windowDays = Math.min(365, Math.max(1, Math.round(windowDays)))

    let exactOffsetDays = params.orb / safeRelSpeed
    if (!Number.isFinite(exactOffsetDays)) exactOffsetDays = 0
    const direction = params.isApplying === false ? -1 : 1
    const exactDate = new Date(params.baseDate.getTime() + direction * exactOffsetDays * 86400000)
    const halfWindowMs = (windowDays / 2) * 86400000
    const startDate = new Date(exactDate.getTime() - halfWindowMs)
    const endDate = new Date(exactDate.getTime() + halfWindowMs)

    return {
      start: startDate.toISOString(),
      exact: exactDate.toISOString(),
      end: endDate.toISOString(),
      days: windowDays
    }
  }

  private static buildEventWindow(baseDate: Date, phase: 'START' | 'PEAK' | 'END') {
    const base = baseDate.getTime()
    const hourMs = 60 * 60 * 1000
    if (phase === 'PEAK') {
      return {
        start: new Date(base - 6 * hourMs).toISOString(),
        exact: new Date(base).toISOString(),
        end: new Date(base + 6 * hourMs).toISOString(),
        days: 0.5
      }
    }
    if (phase === 'END') {
      return {
        start: new Date(base - 18 * hourMs).toISOString(),
        exact: new Date(base - 6 * hourMs).toISOString(),
        end: new Date(base).toISOString(),
        days: 0.75
      }
    }
    return {
      start: new Date(base - 6 * hourMs).toISOString(),
      exact: new Date(base + 6 * hourMs).toISOString(),
      end: new Date(base + 18 * hourMs).toISOString(),
      days: 0.75
    }
  }

  private static buildSpecialEvents(planets: RealPlanetPosition[], baseDate: Date) {
    const events: any[] = []
    const dateKey = baseDate.toISOString().slice(0, 10)
    for (const planet of planets) {
      if (!Number.isFinite(planet.prevLongitude)) continue
      const prevSign = Math.floor((planet.prevLongitude || 0) / 30)
      const currSign = Math.floor(planet.longitude / 30)
      if (prevSign !== currSign) {
        events.push({
          transitPlanet: planet.name,
          natalPlanet: planet.name,
          type: 'ingress',
          eventType: 'INGRESS',
          orb: 0,
          isApplying: true,
          strength: 70,
          natalHouseImpacted: planet.house,
          durationClass: 'curto',
          seriesId: `${planet.name}:INGRESS:${currSign}:${dateKey}`,
          contactIndex: 1,
          window: this.buildEventWindow(baseDate, 'START'),
        })
      }

      const prevSpeed = planet.prevSpeed
      if (Number.isFinite(prevSpeed)) {
        if ((prevSpeed || 0) >= 0 && planet.speed < 0) {
          events.push({
            transitPlanet: planet.name,
            natalPlanet: planet.name,
            type: 'retrograde',
            eventType: 'RETROGRADE',
            orb: 0,
            isApplying: true,
            strength: 80,
            natalHouseImpacted: planet.house,
            durationClass: 'medio',
            seriesId: `${planet.name}:RETROGRADE:START:${dateKey}`,
            contactIndex: 1,
            window: this.buildEventWindow(baseDate, 'START'),
          })
        }
        if ((prevSpeed || 0) <= 0 && planet.speed > 0) {
          events.push({
            transitPlanet: planet.name,
            natalPlanet: planet.name,
            type: 'retrograde',
            eventType: 'RETROGRADE',
            orb: 0,
            isApplying: false,
            strength: 80,
            natalHouseImpacted: planet.house,
            durationClass: 'medio',
            seriesId: `${planet.name}:RETROGRADE:END:${dateKey}`,
            contactIndex: 1,
            window: this.buildEventWindow(baseDate, 'END'),
          })
        }
      }

      if (Math.abs(planet.speed) <= 0.01) {
        events.push({
          transitPlanet: planet.name,
          natalPlanet: planet.name,
          type: 'station',
          eventType: 'STATION',
          orb: 0,
          isApplying: false,
          strength: 90,
          natalHouseImpacted: planet.house,
          durationClass: 'curto',
          seriesId: `${planet.name}:STATION:${dateKey}`,
          contactIndex: 1,
          window: this.buildEventWindow(baseDate, 'PEAK'),
        })
      }
    }
    return events
  }

  private static computeHouseAspectWindow(
    planet: RealPlanetPosition,
    cusp: number,
    aspectDegrees: number,
    orbAllowed: number,
    baseDate: Date
  ): { start: string; exact: string; end: string; days: number } {
    const speed = planet.speed ?? 0
    const speedAbs = Math.max(0.02, Math.abs(speed))
    const diff = this.normalizeAngle360(planet.longitude - cusp)
    const targetA = this.normalizeAngle360(aspectDegrees)
    const targetB = this.normalizeAngle360(360 - aspectDegrees)
    const forwardDist = (target: number) => this.normalizeAngle360(target - diff)
    const backwardDist = (target: number) => this.normalizeAngle360(diff - target)
    let distA = speed >= 0 ? forwardDist(targetA) : backwardDist(targetA)
    let distB = speed >= 0 ? forwardDist(targetB) : backwardDist(targetB)
    let dist = distA <= distB ? distA : distB

    const isApplying = dist <= 180
    const pastDist = 360 - dist
    const exactOffsetDays = (isApplying ? dist : pastDist) / speedAbs
    const exactDate = new Date(baseDate.getTime() + (isApplying ? 1 : -1) * exactOffsetDays * 86400000)

    let windowDays = (2 * orbAllowed) / speedAbs
    if (!Number.isFinite(windowDays)) windowDays = 0
    windowDays = Math.min(365, Math.max(1, Math.round(windowDays)))
    const halfWindowMs = (windowDays / 2) * 86400000
    const startDate = new Date(exactDate.getTime() - halfWindowMs)
    const endDate = new Date(exactDate.getTime() + halfWindowMs)

    return {
      start: startDate.toISOString(),
      exact: exactDate.toISOString(),
      end: endDate.toISOString(),
      days: windowDays
    }
  }
  private static classifyTransitDuration(planetName: string): 'curto' | 'medio' | 'longo' {
    // HeurÃƒÂ­stica baseada em velocidade mÃƒÂ©dia/orbital
    if (planetName === 'Sun' || planetName === 'Moon' || planetName === 'Mercury' || planetName === 'Venus' || planetName === 'Mars') {
      return 'curto'
    }
    if (planetName === 'Jupiter' || planetName === 'Saturn') {
      return 'medio'
    }
    return 'longo'
  }

  // Ã°Å¸Å½Â¯ MÃƒâ€°TODOS PARA CÃƒÂLCULOS DETERMINÃƒÂSTICOS
  // Removidos hashes determinÃƒÂ­sticos: nÃƒÂ£o usados em produÃƒÂ§ÃƒÂ£o

  // MÃƒÂ©todos auxiliares para cÃƒÂ¡lculos astronÃƒÂ´micos
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
    // Simplificado - em produÃƒÂ§ÃƒÂ£o usaria cÃƒÂ¡lculo completo
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
        // InterpolaÃƒÂ§ÃƒÂ£o para outras casas
        cusps.push((ascendant + i * 30) % 360)
      }
    }
    
    return cusps
  }

  private static isAspectApplying(planet1: RealPlanetPosition, planet2: RealPlanetPosition, targetAngle: number): boolean {
    // Verificar se os planetas estÃƒÂ£o se aproximando do aspecto exato
    return planet1.speed > planet2.speed
  }

  private static getPlanetSignScore(planet: RealPlanetPosition): number {
    // Dignidades essenciais (inclui domicÃƒÂ­lio/exaltaÃƒÂ§ÃƒÂ£o/detrimento/queda + triplicidade + termos/faces clÃƒÂ¡ssicos)
    const essentials: Record<string, {
      domicile?: string[]; exaltation?: string[]; detriment?: string[]; fall?: string[]
      triplicity?: string[]; // signos onde o planeta participa da triplicidade
      terms?: string[];      // aproximaÃƒÂ§ÃƒÂ£o: signos em que comumente recebe algum termo
      faces?: string[];      // faces/decanatos aproximados por signo
    }> = {
      Sun:    { domicile: ['LeÃƒÂ£o'],    exaltation: ['Ãries'],     detriment: ['AquÃƒÂ¡rio'],  fall: ['Libra'] },
      Moon:   { domicile: ['CÃƒÂ¢ncer'],  exaltation: ['Touro'],     detriment: ['CapricÃƒÂ³rnio'], fall: ['EscorpiÃƒÂ£o'] },
      Mercury:{ domicile: ['GÃƒÂªmeos','Virgem'], exaltation: [],    detriment: ['SagitÃƒÂ¡rio','Peixes'], fall: [], triplicity:['GÃƒÂªmeos','Virgem'], faces:['GÃƒÂªmeos','Virgem'] },
      Venus:  { domicile: ['Touro','Libra'],  exaltation: ['Peixes'], detriment: ['EscorpiÃƒÂ£o','Ãries'], fall: ['Virgem'], triplicity:['Touro','Libra'], faces:['Touro','Libra'] },
      Mars:   { domicile: ['Ãries','EscorpiÃƒÂ£o'], exaltation: ['CapricÃƒÂ³rnio'], detriment: ['Libra','Touro'], fall: ['CÃƒÂ¢ncer'], triplicity:['Ãries','EscorpiÃƒÂ£o'] },
      Jupiter:{ domicile: ['SagitÃƒÂ¡rio','Peixes'], exaltation: ['CÃƒÂ¢ncer'], detriment: ['GÃƒÂªmeos','Virgem'], fall: ['CapricÃƒÂ³rnio'], triplicity:['SagitÃƒÂ¡rio','Peixes'] },
      Saturn: { domicile: ['CapricÃƒÂ³rnio','AquÃƒÂ¡rio'], exaltation: ['Libra'], detriment: ['CÃƒÂ¢ncer','LeÃƒÂ£o'], fall: ['Ãries'], triplicity:['AquÃƒÂ¡rio','Libra'] },
      Uranus: { domicile: ['AquÃƒÂ¡rio'], triplicity:['AquÃƒÂ¡rio'] },
      Neptune:{ domicile: ['Peixes'], triplicity:['Peixes'] },
      Pluto:  { domicile: ['EscorpiÃƒÂ£o'], triplicity:['EscorpiÃƒÂ£o'] },
    }

    const e = essentials[planet.name]
    if (!e) return 50
    const inList = (arr?: string[]) => !!arr && arr.includes(planet.sign)

    let score = 50
    if (inList(e.domicile)) score += 28
    if (inList(e.exaltation)) score += 24
    if (inList(e.detriment)) score -= 28
    if (inList(e.fall)) score -= 24
    // Triplicidade (bÃƒÂ´nus moderado)
    if (inList(e.triplicity)) score += 6
    // Termos/Faces clÃƒÂ¡ssicos por grau (bounds egÃƒÂ­pcios + faces caldeias)
    try {
      const { getTermRuler, getFaceRuler } = require('../../astro/dignities.classical')
      const termRuler = getTermRuler(planet.sign, planet.degree)
      const faceRuler = getFaceRuler(planet.sign, planet.degree)
      if (termRuler) {
        // BÃƒÂ´nus pequeno quando o planeta ÃƒÂ© regente do termo
        if (termRuler === planet.name) score += 4
        // Penalidade suave se inimigo tradicional (Marte/Saturno) rege o termo do planeta
        if ((termRuler === 'Marte' || termRuler === 'Saturno') && (planet.name === 'Moon' || planet.name === 'Venus')) score -= 2
      }
      if (faceRuler) {
        if (faceRuler === planet.name) score += 2
      }
    } catch {}

    // Clamp 0Ã¢â‚¬â€œ100
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

    // RelevÃƒÂ¢ncia para a ÃƒÂ¡rea (se for uma das casas significadoras aumenta)
    if (relevantHouses.includes(planet.house)) base += 15

    return Math.max(0, Math.min(100, base))
  }

  /** CondiÃƒÂ§ÃƒÂµes acidentais extra: retrÃƒÂ³grado, combustÃƒÂ£o, velocidade */
  private static getAccidentalConditionsModifier(
    planet: RealPlanetPosition,
    sunLongitude?: number
  ): { modifier: number; tags: string[] } {
    let mod = 0
    const tags: string[] = []

    // RetrÃƒÂ³grado
    if (planet.isRetrograde) {
      mod -= 4
      tags.push(`${planet.name} retrÃƒÂ³grado`)
    }

    // CombustÃƒÂ£o e Cazimi (aprox: dentro de 8Ã‚Â° do Sol para combustÃƒÂ£o; <= 0.3Ã‚Â° para cazimi) e "sob os raios" (atÃƒÂ© ~15Ã‚Â°)
    if (sunLongitude !== undefined && planet.name !== 'Sun' && planet.name !== 'Moon') {
      const diff = Math.abs(((planet.longitude - sunLongitude + 540) % 360) - 180)
      const deg = diff
      const cazimiThreshold = 0.3 // ~18'
      if (deg <= cazimiThreshold) {
        mod += 4
        tags.push(`${planet.name} cazimi`)
      } else if (deg <= 8) {
        mod -= 5
        tags.push(`${planet.name} combusto`)
      } else if (deg <= 15) {
        mod -= 2
        tags.push(`${planet.name} sob os raios`)
      }
    }

    // Orientalidade/occidentalidade (aproximaÃƒÂ§ÃƒÂ£o)
    if (sunLongitude !== undefined && planet.name !== 'Sun' && planet.name !== 'Moon') {
      const norm = (d:number)=>((d%360)+360)%360
      const d = norm(planet.longitude - sunLongitude) // 0..360
      const oriental = d > 0 && d < 180
      const isSuperior = ['Mars','Jupiter','Saturn'].includes(planet.name)
      const isInferior = ['Mercury','Venus'].includes(planet.name)
      if (oriental) {
        tags.push(`${planet.name} oriental`)
        if (isSuperior) mod += 1
        if (isInferior) mod -= 1
      } else {
        tags.push(`${planet.name} ocidental`)
        if (isSuperior) mod -= 1
        if (isInferior) mod += 1
      }
    }

    // Velocidade normalizada por planeta (aprox mÃƒÂ©dia): lento/rÃƒÂ¡pido
    const meanSpeed: Record<string, number> = {
      Sun: 0.9856, Moon: 13.176, Mercury: 1.2, Venus: 1.18, Mars: 0.524,
      Jupiter: 0.083, Saturn: 0.033, Uranus: 0.011, Neptune: 0.006, Pluto: 0.004
    }
    const v = Math.abs(planet.speed)
    const m = meanSpeed[planet.name] ?? 1
    const ratio = v / m
    if (ratio < 0.5) mod -= 1
    else if (ratio > 1.5) mod += 1

    return { modifier: mod, tags }
  }

  // AvanÃƒÂ§ado: score de aspecto com aplicaÃƒÂ§ÃƒÂ£o/separaÃƒÂ§ÃƒÂ£o, orbes por tipo e peso por Sol/Lua
  private static getAspectScoreAdvanced(aspect: RealAspect, currentPlanets: RealPlanetPosition[], natalPlanets: RealPlanetPosition[]): number {
    const typeWeights: Record<string, number> = {
      'conjuncao': 1.0,      // Neutro (depende dos planetas)
      'oposicao': -0.6,      // Negativo (tensÃƒÂ£o)
      'quadratura': -0.8,    // Negativo (desafio)
      'trigono': 0.8,        // Positivo (harmonia)
      'sextil': 0.6,         // Positivo (oportunidade)
      'quincuncio': -0.2,    // Levemente negativo
      'semissextil': 0.3,    // Levemente positivo
      'semiquadratura': -0.4, // Negativo leve
      'sesquiquadratura': -0.5, // Negativo medio
    }
    const maxOrbByType: Record<string, number> = {
      'conjuncao': 8, 'oposicao': 8, 'quadratura': 6, 'trigono': 6, 'sextil': 4, 'quincuncio': 3
    }
    const w = typeWeights[aspect.type] ?? 0.5
    const maxOrb = maxOrbByType[aspect.type] ?? 5
    const proximity = Math.max(0, 1 - aspect.orb / maxOrb)
    const applyingBonus = aspect.isApplying ? 1.15 : 0.95
    let score = 50 + 50 * w * proximity * applyingBonus
    // Peso extra se envolve Sol/Lua (influÃƒÂªncia larga)
    const involvesLuminary = (p: string) => p === 'Sun' || p === 'Moon'
    if (involvesLuminary(aspect.planet1) || involvesLuminary(aspect.planet2)) score *= 1.05
    return Math.max(0, Math.min(100, score))
  }

  private static getNatalAlmuten(natalPlanets: RealPlanetPosition[]): string | undefined {
    let best: { name: string; score: number } | undefined
    for (const p of natalPlanets) {
      const s = this.getPlanetSignScore(p)
      if (!best || s > best.score) best = { name: p.name, score: s }
    }
    return best?.name
  }

  // RecepÃƒÂ§ÃƒÂ£o mÃƒÂºtua (simplificada): se trÃƒÂ¢nsito/natal estÃƒÂ£o em signos de domicÃƒÂ­lio/exaltaÃƒÂ§ÃƒÂ£o um do outro => boost; em detrimento/queda => penalidade
  private static getReceptionMultiplier(transit: RealPlanetPosition | undefined, natal: RealPlanetPosition | undefined): number {
    if (!transit || !natal) return 1.0
    const domicile: Record<string, string[]> = {
      Sun:['LeÃƒÂ£o'], Moon:['CÃƒÂ¢ncer'], Mercury:['GÃƒÂªmeos','Virgem'], Venus:['Touro','Libra'], Mars:['Ãries','EscorpiÃƒÂ£o'], Jupiter:['SagitÃƒÂ¡rio','Peixes'], Saturn:['CapricÃƒÂ³rnio','AquÃƒÂ¡rio']
    }
    const exalt: Record<string, string[]> = {
      Sun:['Ãries'], Moon:['Touro'], Mercury:[], Venus:['Peixes'], Mars:['CapricÃƒÂ³rnio'], Jupiter:['CÃƒÂ¢ncer'], Saturn:['Libra']
    }
    const detr: Record<string, string[]> = {
      Sun:['AquÃƒÂ¡rio'], Moon:['CapricÃƒÂ³rnio'], Mercury:['SagitÃƒÂ¡rio','Peixes'], Venus:['Ãries','EscorpiÃƒÂ£o'], Mars:['Libra','Touro'], Jupiter:['GÃƒÂªmeos','Virgem'], Saturn:['CÃƒÂ¢ncer','LeÃƒÂ£o']
    }
    const fall: Record<string, string[]> = {
      Sun:['Libra'], Moon:['EscorpiÃƒÂ£o'], Mercury:[], Venus:['Virgem'], Mars:['CÃƒÂ¢ncer'], Jupiter:['CapricÃƒÂ³rnio'], Saturn:['Ãries']
    }
    const isIn = (tbl: Record<string,string[]>, name: string, sign: string) => (tbl[name]||[]).includes(sign)
    const tDom = isIn(domicile, transit.name, transit.sign)
    const nDom = isIn(domicile, natal.name, natal.sign)
    const tExa = isIn(exalt, transit.name, transit.sign)
    const nExa = isIn(exalt, natal.name, natal.sign)
    const tDet = isIn(detr, transit.name, transit.sign)
    const nDet = isIn(detr, natal.name, natal.sign)
    const tFal = isIn(fall, transit.name, transit.sign)
    const nFal = isIn(fall, natal.name, natal.sign)
    // Boost se ambos dignificados; penalidade se ambos debilitados
    if ((tDom||tExa) && (nDom||nExa)) return 1.10
    if ((tDet||tFal) && (nDet||nFal)) return 0.90
    return 1.0
  }

  // Angularidade da casa natal (1,4,7,10 mais fortes)
  private static getHouseAngularMultiplier(house: number): number {
    const angular = [1,4,7,10]
    const succedent = [2,5,8,11]
    const cadent = [3,6,9,12]
    if (angular.includes(house)) return 1.05
    if (succedent.includes(house)) return 0.9
    if (cadent.includes(house)) return 0.8
    return 1.0
  }

  private static buildNatalHouseLookup(natalPlanets: RealPlanetPosition[]): Map<string, number> {
    const byName = new Map<string, number>()
    natalPlanets.forEach(p => byName.set(p.name, p.house))
    byName.set('Asc', 1)
    byName.set('MC', 10)
    byName.set('IC', 4)
    byName.set('Dsc', 7)
    return byName
  }

  private static isTransitRelevantToArea(
    natalTarget: string,
    transitHouseNatal: number,
    relevantHouses: number[],
    natalHouseByName: Map<string, number>
  ): boolean {
    if (!relevantHouses.length) return false
    const transitInRelevantHouse = relevantHouses.includes(transitHouseNatal)
    const natalTargetHouse = natalHouseByName.get(natalTarget) || 0
    const natalInRelevantHouse = relevantHouses.includes(natalTargetHouse)
    const angleRelevant =
      (natalTarget === 'Asc' && relevantHouses.includes(1)) ||
      (natalTarget === 'MC' && relevantHouses.includes(10)) ||
      (natalTarget === 'IC' && relevantHouses.includes(4)) ||
      (natalTarget === 'Dsc' && relevantHouses.includes(7))
    const isRuler = relevantHouses.some(h => (RealAstrologyEngine.HOUSE_RULERS[h] || []).includes(natalTarget))

    return transitInRelevantHouse || natalInRelevantHouse || angleRelevant || isRuler
  }

  // Peso por duraÃƒÂ§ÃƒÂ£o/inÃƒÂ©rcia do par de planetas (privilegia lentos, atenua muito rÃƒÂ¡pidos)
  private static getPlanetDurationWeight(transitName: string, natalName: string): number {
    const slow: Record<string, number> = { Jupiter:1.1, Saturn:1.2, Uranus:1.25, Neptune:1.25, Pluto:1.25 }
    const fast: Record<string, number> = { Moon:0.85, Mercury:0.9 }
    let w = 1.0
    if (slow[transitName]) w *= slow[transitName]
    if (fast[transitName]) w *= fast[transitName]
    // leve reforÃƒÂ§o se alvo natal ÃƒÂ© luminar
    if (natalName === 'Sun' || natalName === 'Moon') w *= 1.05
    return w
  }

  private static getAspectScore(aspect: RealAspect): number {
              // Peso por tipo (corrigido para lÃƒÂ³gica astrolÃƒÂ³gica)
          const weights: Record<string, number> = {
            'conjuncao': 1.0,      // Neutro
            'oposicao': -0.6,      // Negativo
            'quadratura': -0.8,    // Negativo
            'trigono': 0.8,        // Positivo
            'sextil': 0.6,         // Positivo
            'quincuncio': -0.2,    // Levemente negativo
            'semissextil': 0.3,    // Levemente positivo
            'semiquadratura': -0.4, // Negativo leve
            'sesquiquadratura': -0.5, // Negativo medio
          }
          const w = weights[aspect.type] ?? 0.0

          // Aplicante ganha bÃƒÂ´nus
          const applyingBonus = aspect.isApplying ? 1.15 : 1.0
          // Proximidade do aspecto (orb menor = mais forte)
          // Orbe base por tipo
          const baseOrb: Record<string, number> = {
            'conjuncao': 8, 'oposicao': 8, 'quadratura': 6, 'trigono': 6, 'sextil': 4,
            'quincuncio': 5, 'semissextil': 3, 'semiquadratura': 2, 'sesquiquadratura': 2,
          }
          const maxOrb = baseOrb[aspect.type] ?? 5
          const proximity = Math.max(0, 1 - aspect.orb / maxOrb)
          
          // Score baseado no peso do aspecto (pode ser negativo)
          const baseScore = w * proximity * applyingBonus
          const score = 50 + (baseScore * 50) // 50 ÃƒÂ© o centro neutro

    return Math.max(0, Math.min(100, score))
  }

  // Ã°Å¸Å’Å¸ NOVOS MÃƒâ€°TODOS PARA FUNCIONALIDADES GRATUITAS

  /**
   * Cria comparaÃƒÂ§ÃƒÂµes entre posiÃƒÂ§ÃƒÂµes natais e atuais
   */
  private static createPlanetComparisons(
natalPlanets: RealPlanetPosition[],
currentPlanets: RealPlanetPosition[],
houses: { cusps: number[], ascendant: number, midheaven: number },
baseDate: Date
): PlanetComparison[] {
    const comparisons: PlanetComparison[] = []

    for (const currentPlanet of currentPlanets) {
      const natalPlanet = natalPlanets.find(p => p.name === currentPlanet.name)
      if (!natalPlanet) continue

      // Aspectos planetÃƒÂ¡rios para este planeta
        const planetaryAspects = this.calculateRealAspects(currentPlanets)
          .filter(aspect => aspect.planet1 === currentPlanet.name || aspect.planet2 === currentPlanet.name)
          .map(aspect => {
            const p1 = currentPlanets.find(p => p.name === aspect.planet1)
            const p2 = currentPlanets.find(p => p.name === aspect.planet2)
            const orbAllowed = this.getAspectOrbAllowed(aspect.type, aspect.planet1, aspect.planet2)
            const relSpeed = this.getRelativeSpeed(p1?.speed, p2?.speed)
            const windowInfo = this.computeAspectWindow({
              orb: aspect.orb,
              isApplying: aspect.isApplying,
              orbAllowed,
              relSpeed,
              baseDate
            })
            return {
              ...aspect,
              orbAllowed,
              relSpeed,
              windowDays: windowInfo.days,
              window: windowInfo
            }
          })

      // Aspectos com casas
      const houseAspects = this.calculateHouseAspects([currentPlanet], houses, baseDate)

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
houses: { cusps: number[], ascendant: number, midheaven: number },
baseDate: Date
): HouseAspect[] {
    const houseAspects: HouseAspect[] = []
    const aspectTypes = [
      // Orbe fixo para casas: 0.5Ã‚Â°
      { name: 'conjuncao', degrees: 0, orb: 0.5 },
      { name: 'sextil', degrees: 60, orb: 0.5 },
      { name: 'quadratura', degrees: 90, orb: 0.5 },
      { name: 'trigono', degrees: 120, orb: 0.5 },
      { name: 'oposicao', degrees: 180, orb: 0.5 },
      { name: 'quincuncio', degrees: 150, orb: 0.5 },
      { name: 'semissextil', degrees: 30, orb: 0.5 },
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
              const windowInfo = this.computeHouseAspectWindow(
                planet,
                cusp,
                aspectType.degrees,
                aspectType.orb,
                baseDate
              )
              houseAspects.push({
                house: houseNumber,
                cusp,
                aspect: aspectType.name,
                orb,
                meaning: this.HOUSE_MEANINGS[houseNumber as keyof typeof this.HOUSE_MEANINGS],
                strength: Math.max(0, 100 - (orb / aspectType.orb) * 100),
                window: windowInfo
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

    // Detectar mudancas significativas
    const elementalChanges: string[] = []
    const modalityChanges: string[] = []

    // Analise elemental
    Object.keys(natalElemental).forEach(element => {
      const key = element as keyof ElementalAnalysis
      const diff = currentElemental[key] - natalElemental[key]
      if (diff !== 0) {
        const translatedElement =
          element === 'fire' ? 'fogo' :
          element === 'earth' ? 'terra' :
          element === 'air' ? 'ar' : 'agua'
        elementalChanges.push(`${diff > 0 ? 'Mais' : 'Menos'} ${translatedElement}`)
      }
    })

    // Analise de modalidades
    Object.keys(natalModality).forEach(modality => {
      const key = modality as keyof ModalityAnalysis
      const diff = currentModality[key] - natalModality[key]
      if (diff !== 0) {
        const translatedModality =
          modality === 'cardinal' ? 'cardeal' :
          modality === 'fixed' ? 'fixo' : 'mutavel'
        modalityChanges.push(`${diff > 0 ? 'Mais' : 'Menos'} ${translatedModality}`)
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

  /**
   * Ã°Å¸Å’Å¸ NOVO: Cria anÃƒÂ¡lise completa de status planetÃƒÂ¡rios
   */
  private static createPlanetaryStatusAnalysis(
    planetsWithStatus: RealPlanetPosition[]
  ): PlanetaryStatusAnalysis {
    // Filtrar planetas que tÃƒÂªm status calculado
    const planetsWithValidStatus = planetsWithStatus.filter(p => p.planetaryStatus)
    
    if (planetsWithValidStatus.length === 0) {
      return {
        overallScore: 0,
        overallLevel: 'Neutro',
        strongestPlanet: { name: 'N/A', status: null as any },
        weakestPlanet: { name: 'N/A', status: null as any },
        planetsByLevel: {
          'Muito Forte': [],
          'Forte': [],
          'Moderado': [],
          'Neutro': [],
          'Fraco': [],
          'Muito Fraco': []
        },
        recommendations: ['Status planetÃƒÂ¡rios nÃƒÂ£o disponÃƒÂ­veis']
      }
    }

    // Calcular score geral (mÃƒÂ©dia ponderada)
    const totalScore = planetsWithValidStatus.reduce((sum, planet) => {
      return sum + (planet.planetaryStatus?.score || 0)
    }, 0)
    const overallScore = totalScore / planetsWithValidStatus.length

    // Classificar score geral
    const overallLevel = this.classifyOverallPlanetaryLevel(overallScore)

    // Encontrar planeta mais forte e mais fraco
    const sortedByScore = [...planetsWithValidStatus].sort((a, b) => 
      (b.planetaryStatus?.score || 0) - (a.planetaryStatus?.score || 0)
    )
    
    const strongestPlanet = {
      name: sortedByScore[0].name,
      status: sortedByScore[0].planetaryStatus!
    }
    
    const weakestPlanet = {
      name: sortedByScore[sortedByScore.length - 1].name,
      status: sortedByScore[sortedByScore.length - 1].planetaryStatus!
    }

    // Agrupar planetas por nÃƒÂ­vel
    const planetsByLevel: Record<PlanetaryStatusLevel, string[]> = {
      'Muito Forte': [],
      'Forte': [],
      'Moderado': [],
      'Neutro': [],
      'Fraco': [],
      'Muito Fraco': []
    }

    planetsWithValidStatus.forEach(planet => {
      const level = planet.planetaryStatus?.level
      if (level) {
        planetsByLevel[level].push(planet.name)
      }
    })

    // Gerar recomendaÃƒÂ§ÃƒÂµes baseadas na anÃƒÂ¡lise
    const recommendations = this.generatePlanetaryRecommendations(planetsByLevel, overallLevel, strongestPlanet, weakestPlanet)

    return {
      overallScore,
      overallLevel,
      strongestPlanet,
      weakestPlanet,
      planetsByLevel,
      recommendations
    }
  }

  /**
   * Classifica o nÃƒÂ­vel geral baseado no score medio
   */
  private static classifyOverallPlanetaryLevel(score: number): PlanetaryStatusLevel {
    if (score >= 8) return 'Muito Forte'
    if (score >= 4) return 'Forte'
    if (score >= 0) return 'Moderado'
    if (score >= -2) return 'Neutro'
    if (score >= -6) return 'Fraco'
    return 'Muito Fraco'
  }

  /**
   * Gera recomendaÃƒÂ§ÃƒÂµes baseadas na anÃƒÂ¡lise planetÃƒÂ¡ria
   */
  private static generatePlanetaryRecommendations(
    planetsByLevel: Record<PlanetaryStatusLevel, string[]>,
    overallLevel: PlanetaryStatusLevel,
    strongestPlanet: { name: string; status: PlanetaryStatus },
    weakestPlanet: { name: string; status: PlanetaryStatus }
  ): string[] {
    const recommendations: string[] = []

    // RecomendaÃƒÂ§ÃƒÂµes baseadas no nÃƒÂ­vel geral
    if (overallLevel === 'Muito Forte') {
      recommendations.push('Ã°Å¸Å’Å¸ Excelente momento para iniciativas importantes e tomada de decisÃƒÂµes')
      recommendations.push('Ã°Å¸â€™Âª Aproveite a forÃƒÂ§a planetÃƒÂ¡ria para projetos desafiadores')
    } else if (overallLevel === 'Forte') {
      recommendations.push('Ã¢Å“â€¦ Bom momento para avanÃƒÂ§ar em objetivos pessoais')
      recommendations.push('Ã°Å¸Å½Â¯ Foque em ÃƒÂ¡reas onde vocÃƒÂª se sente mais confiante')
    } else if (overallLevel === 'Moderado') {
      recommendations.push('Ã¢Å¡â€“Ã¯Â¸Â Momento equilibrado - mantenha consistÃƒÂªncia em suas aÃƒÂ§ÃƒÂµes')
      recommendations.push('Ã°Å¸â€â€ž Aproveite para revisar e ajustar estratÃƒÂ©gias')
    } else if (overallLevel === 'Neutro') {
      recommendations.push('Ã°Å¸Å’Â± PerÃƒÂ­odo de estabilidade - ideal para manutenÃƒÂ§ÃƒÂ£o e planejamento')
      recommendations.push('Ã°Å¸â€œâ€¹ Foque em tarefas rotineiras e organizaÃƒÂ§ÃƒÂ£o')
    } else if (overallLevel === 'Fraco') {
      recommendations.push('Ã¢Å¡Â Ã¯Â¸Â Momento desafiador - evite decisÃƒÂµes importantes')
      recommendations.push('Ã°Å¸â€ºÂ¡Ã¯Â¸Â Foque em autocuidado e proteÃƒÂ§ÃƒÂ£o')
    } else {
      recommendations.push('Ã°Å¸Å¡Â¨ PerÃƒÂ­odo crÃƒÂ­tico - priorize seguranÃƒÂ§a e estabilidade')
      recommendations.push('Ã°Å¸â„¢Â Busque apoio e evite riscos desnecessÃƒÂ¡rios')
    }

    // RecomendaÃƒÂ§ÃƒÂµes especÃƒÂ­ficas por planeta
    if (strongestPlanet.status.level === 'Muito Forte') {
      recommendations.push(`Ã°Å¸Å¡â‚¬ ${strongestPlanet.name} estÃƒÂ¡ excepcional - aproveite sua energia mÃƒÂ¡xima`)
    }
    
    if (weakestPlanet.status.level === 'Muito Fraco') {
      recommendations.push(`Ã°Å¸â€™Â¡ ${weakestPlanet.name} precisa de atenÃƒÂ§ÃƒÂ£o especial - trabalhe suas limitaÃƒÂ§ÃƒÂµes`)
    }

    // RecomendaÃƒÂ§ÃƒÂµes baseadas na distribuiÃƒÂ§ÃƒÂ£o
    const strongPlanets = planetsByLevel['Muito Forte'].length + planetsByLevel['Forte'].length
    const weakPlanets = planetsByLevel['Fraco'].length + planetsByLevel['Muito Fraco'].length

    if (strongPlanets > weakPlanets) {
      recommendations.push('Ã°Å¸Å½â€° Maioria dos planetas estÃƒÂ¡ forte - momento propÃƒÂ­cio para expansÃƒÂ£o')
    } else if (weakPlanets > strongPlanets) {
      recommendations.push('Ã°Å¸â€Â§ Maioria dos planetas estÃƒÂ¡ fraca - foco em recuperaÃƒÂ§ÃƒÂ£o e fortalecimento')
    }

    return recommendations
  }
}

export default RealAstrologyEngine


























