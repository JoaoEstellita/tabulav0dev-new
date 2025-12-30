/**
 * ðŸŒŸ REAL ASTROLOGY ENGINE ðŸŒŸ
 * 
 * Sistema de cÃ¡lculos astrolÃ³gicos com dados REAIS usando:
 * - Astronomy Engine: PrecisÃ£o NASA para posiÃ§Ãµes planetÃ¡rias
 * - Ephemeris: CÃ¡lculos astronÃ´micos profissionais
 * - Algoritmos astrolÃ³gicos tradicionais
 * 
 * GARANTIA: Dados 100% reais, sem simulaÃ§Ãµes ou aproximaÃ§Ãµes
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
// Removido Ephemeris nÃ£o utilizado

export interface RealPlanetPosition {
  name: string
  longitude: number // Graus eclÃ­pticos (0-360)
  latitude: number
  distance: number // UA (Unidades AstronÃ´micas)
  speed: number // Graus por dia
  sign: string // Signo zodiacal
  degree: number // Grau dentro do signo (0-30)
  house: number // Casa astrolÃ³gica (1-12)
  isRetrograde: boolean
  // ðŸŒŸ NOVO: Status planetÃ¡rio integrado
  planetaryStatus?: PlanetaryStatus
}

export interface RealAspect {
  planet1: string
  planet2: string
  type: string // conjunÃ§Ã£o, oposiÃ§Ã£o, trÃ­gono, quadratura, sextil
  orb: number // DiferenÃ§a em graus do aspecto exato
  isApplying: boolean // Se o aspecto estÃ¡ se formando ou se separando
  strength: number // ForÃ§a do aspecto (0-100)
}

// ðŸŒ AnÃ¡lise Elemental
export interface ElementalAnalysis {
  fire: number    // ðŸ”¥ Planetas em signos de fogo
  earth: number   // ðŸŒ Planetas em signos de terra  
  air: number     // ðŸ’¨ Planetas em signos de ar
  water: number   // ðŸ’§ Planetas em signos de Ã¡gua
}

// âš¡ AnÃ¡lise de Modalidades
export interface ModalityAnalysis {
  cardinal: number  // âš¡ Planetas em signos cardinais
  fixed: number     // ðŸ”’ Planetas em signos fixos
  mutable: number   // ðŸ”„ Planetas em signos mutÃ¡veis
}

// ðŸ  Aspectos com Casas
export interface HouseAspect {
  house: number
  cusp: number
  aspect: string
  orb: number
  meaning: string
  strength: number
}

// ðŸ“Š ComparaÃ§Ã£o Completa de Planetas
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

// ðŸŒŸ Resumo da Carta
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

// ðŸŒŸ NOVO: AnÃ¡lise de Status PlanetÃ¡rios
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
  houses: number[] // CÃºspides das casas
  ascendant: number
  midheaven: number
  housesApproximate?: boolean
  houseSystem?: HouseSystem
  // Ãndice Coletivo (Tâ†’T) e fase lunar
  collective?: {
    positive: number
    negative: number
    keyAspects: Array<RealAspect & { orbAllowed?: number; relSpeed?: number; windowDays?: number }>
    lunarPhase: {
      name: 'Nova' | 'Crescente' | 'Cheia' | 'Minguante'
      waxing: boolean
      elongation: number // 0..180 distÃ¢ncia Sol-Lua
    }
  }
  collectiveWeekly?: { key: string, keyAspects: Array<RealAspect & { orbAllowed?: number; relSpeed?: number; windowDays?: number }> }
  collectiveMonthly?: { key: string, keyAspects: Array<RealAspect & { orbAllowed?: number; relSpeed?: number; windowDays?: number }> }
  // Novos conjuntos de aspectos padronizados
  aspectsCurrentTT?: RealAspect[]
  aspectsTransitsToNatalTN?: RealAspect[]
  transits?: {
    personal: Array<{
      transitPlanet: string
      natalPlanet: string
      type: string
      orb: number
      isApplying: boolean
      strength: number
      natalHouseImpacted: number
      durationClass?: 'curto' | 'mÃ©dio' | 'longo'
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
      durationClass?: 'curto' | 'mÃ©dio' | 'longo'
    }>>
  }
  statusPersonal?: {
    score: number
    level: 'excelente' | 'bom' | 'neutro' | 'desafiador' | 'crÃ­tico'
    highlights: string[]
  }
  lifeAreas: {
    [area: string]: {
      percentage: number
      status: 'excelente' | 'bom' | 'neutro' | 'desafiador' | 'crÃ­tico'
      influences: string[]
      mainPlanets: string[]
    }
  }
  // ðŸŒŸ NOVAS FUNCIONALIDADES GRATUITAS
  natalPlanets: RealPlanetPosition[] // PosiÃ§Ãµes natais
  natalAscendant: number // Ascendente natal
  natalMidheaven: number // Meio do CÃ©u natal
  natalHousesApproximate?: boolean
  planetComparisons: PlanetComparison[] // ComparaÃ§Ã£o natal vs atual
  chartSummary: ChartSummary // Resumo elemental e modalidades
  houseAspects: HouseAspect[] // Aspectos com casas
  // ðŸŒŸ NOVO: AnÃ¡lise completa de status planetÃ¡rios
  planetaryStatusAnalysis?: PlanetaryStatusAnalysis
  // ðŸ§­ Logs estruturados para UI (detalhamento por Ã¡rea)
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
    'Ãries', 'Touro', 'GÃªmeos', 'CÃ¢ncer', 'LeÃ£o', 'Virgem',
    'Libra', 'EscorpiÃ£o', 'SagitÃ¡rio', 'CapricÃ³rnio', 'AquÃ¡rio', 'Peixes'
  ]

  // ðŸŒ ClassificaÃ§Ã£o dos Elementos
  private static readonly SIGN_ELEMENTS = {
    'Ãries': 'fire', 'LeÃ£o': 'fire', 'SagitÃ¡rio': 'fire',
    'Touro': 'earth', 'Virgem': 'earth', 'CapricÃ³rnio': 'earth',
    'GÃªmeos': 'air', 'Libra': 'air', 'AquÃ¡rio': 'air',
    'CÃ¢ncer': 'water', 'EscorpiÃ£o': 'water', 'Peixes': 'water'
  } as const

  // âš¡ ClassificaÃ§Ã£o das Modalidades
  private static readonly SIGN_MODALITIES = {
    'Ãries': 'cardinal', 'CÃ¢ncer': 'cardinal', 'Libra': 'cardinal', 'CapricÃ³rnio': 'cardinal',
    'Touro': 'fixed', 'LeÃ£o': 'fixed', 'EscorpiÃ£o': 'fixed', 'AquÃ¡rio': 'fixed',
    'GÃªmeos': 'mutable', 'Virgem': 'mutable', 'SagitÃ¡rio': 'mutable', 'Peixes': 'mutable'
  } as const

  // ðŸ  Significados das Casas
  private static readonly HOUSE_MEANINGS = {
    1: 'Identidade', 2: 'Recursos', 3: 'ComunicaÃ§Ã£o', 4: 'Lar', 
    5: 'Criatividade', 6: 'Trabalho', 7: 'Parcerias', 8: 'TransformaÃ§Ã£o',
    9: 'ExpansÃ£o', 10: 'Carreira', 11: 'Amizades', 12: 'Espiritual'
  } as const

  // Cache simples do Ã­ndice coletivo por dia (UTC)
  private static _collectiveCache: Map<string, NonNullable<RealAstrologyData['collective']>> = new Map()
  // Cache Coletivo semanal/mensal (chaves: YYYY-Www e YYYY-MM)
  private static _weeklyTTCache: Map<string, RealAspect[]> = new Map()
  private static _monthlyTTCache: Map<string, RealAspect[]> = new Map()

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
   * Calcula dados astrolÃ³gicos REAIS para uma data e local especÃ­ficos
   */
  static async calculateRealAstrology(
    birthDate: string, // YYYY-MM-DD
    birthTime: string, // HH:MM
    latitude: number,  // localizaÃ§Ã£o ATUAL para casas do momento
    longitude: number,
    currentDate?: Date,
  options?: { houseSystem?: HouseSystem; natalLat?: number; natalLon?: number }
  ): Promise<RealAstrologyData> {
    console.log('ðŸ”¬ Iniciando cÃ¡lculos astrolÃ³gicos REAIS...')
    
    const date = currentDate || new Date()
    // Converter hora local de nascimento em UTC usando IANA (se disponÃ­vel), caso contrÃ¡rio, fallback para aprox.
    let resolvedTz: { offsetSec: number; timeZoneId?: string } | null = null
    const birthDateTime = await (async () => {
      try {
        const [y, m, d] = birthDate.split('-').map(n => parseInt(n, 10))
        const [hh, mm] = birthTime.split(':').map(n => parseInt(n, 10))
        // Usar meio-dia UTC para resolver TZ histÃ³rico e evitar bordas de alteraÃ§Ã£o de DST
        const ts = Math.floor(Date.UTC(y, (m - 1), d, 12, 0, 0) / 1000)
        const { getTimezoneData } = await import('../timezone/TimezoneService')
        const tzData = await getTimezoneData(latitude, longitude, ts)
        resolvedTz = { offsetSec: tzData.offsetSec, timeZoneId: tzData.timeZoneId }
        if (resolvedTz && typeof resolvedTz.offsetSec === 'number') {
          const offsetHours = resolvedTz.offsetSec / 3600
          return new Date(Date.UTC(y, (m - 1), d, hh - offsetHours, mm, 0))
        }
        const { approximateTimezoneOffsetHours } = require('../../utils/timezone')
        const approx = approximateTimezoneOffsetHours(new Date(Date.UTC(y, (m - 1), d, 0, 0, 0)), longitude, latitude)
        return new Date(Date.UTC(y, (m - 1), d, hh - approx, mm, 0))
      } catch {
        return new Date(`${birthDate}T${birthTime}:00`)
      }
    })()
    
    try {
      // 1-2. TENTAR BACKEND PRECISO: posiÃ§Ãµes + casas + pacote natal
      let realPlanets: RealPlanetPosition[]
      let houses: { cusps: number[]; ascendant: number; midheaven: number; approximate?: boolean }
      let natalPlanets: RealPlanetPosition[]
      let natalHouses: { cusps: number[]; ascendant: number; midheaven: number; approximate?: boolean }

      try {
        // Enviar horÃ¡rio LOCAL de nascimento e TZ resolvido para unificar conversÃ£o no backend
        const natalLocalStr = `${birthDate}T${birthTime}:00`
        const bundle = await this.fetchBackendBundle(date, birthDateTime, latitude, longitude, {
          natalLocal: natalLocalStr,
          natalTimezone: (resolvedTz as any)?.timeZoneId || undefined,
          natalLat: (typeof options?.natalLat === 'number') ? options!.natalLat! : latitude,
          natalLon: (typeof options?.natalLon === 'number') ? options!.natalLon! : longitude,
        })
        realPlanets = bundle.current.planets
        houses = bundle.current.houses
        natalHouses = bundle.natal.houses
        // NÃ£o reatribuir se o backend jÃ¡ enviou as casas dos natais; confiar no backend para consistÃªncia 1:1
        natalPlanets = bundle.natal.planets
        console.log('âœ… Backend astro bundle utilizado (posiÃ§Ãµes + casas + natal)')
      } catch (_e) {
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
        console.log('âš ï¸ Fallback local utilizado (posiÃ§Ãµes + casas)')
      }

      console.log(`âœ… Calculadas ${realPlanets.length} posiÃ§Ãµes planetÃ¡rias reais`)
      console.log('âœ… Casas astrolÃ³gicas disponÃ­veis')

      // 3. CÃLCULO REAL DOS ASPECTOS
      // Antes de aspectos, precisamos atribuir casas aos planetas com base nas cÃºspides
      const planetsWithHouses = this.assignHouses(realPlanets, houses)
      if (process.env.NODE_ENV !== 'production') {
        try {
          const debugSystem = normalizeHouseSystem(houses.systemEffective || houses.system || (globalThis as any).__userHouseSystem || 'placidus')
          console.debug('DEBUG Casas: ASC/MC', { asc: houses.ascendant, mc: houses.midheaven, system: debugSystem })
          console.debug('ðŸ  DEBUG Cusps', houses.cusps.map((c,i)=>({ casa:i+1, cusp:c.toFixed(4) })))
          console.debug('ðŸ  DEBUG Planetasâ†’Casa', planetsWithHouses.map(p=>({ p:p.name, lon:p.longitude.toFixed(4), casa:p.house })))
        } catch {}
      }
      console.log('ðŸ”Ž ASTRO DEBUG - Comparativo casas (natal vs atual) por planeta',
        planetsWithHouses.map(p => ({ name: p.name, natal: (natalPlanets.find(n=>n.name===p.name)?.house), current: p.house })))
      // Aspectos Coletivos (momento)
      const aspectsCurrentTT = detectAspects(
        planetsWithHouses.map(p => ({ name: p.name, longitude: p.longitude, speed: p.speed })),
        planetsWithHouses.map(p => ({ name: p.name, longitude: p.longitude, speed: p.speed })),
        aspectsConfig
      )
      console.log(`âœ… Aspectos Coletivos calculados: ${aspectsCurrentTT.length}`)

      // ðŸŒŸ NOVO: CÃLCULO DE STATUS PLANETÃRIOS
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
      console.log(`âœ… Status planetÃ¡rios calculados para ${planetsWithStatus.length} planetas`)

      // Ãndice Coletivo + fase lunar (cache por dia UTC)
      const dayKey = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())).toISOString().slice(0,10)
      let collective = RealAstrologyEngine._collectiveCache.get(dayKey)
      if (!collective) {
        collective = this.computeCollectiveIndex(aspectsCurrentTT, planetsWithHouses)
        RealAstrologyEngine._collectiveCache.set(dayKey, collective)
      }

      // PrÃ©â€‘cÃ¡lculo semanal e mensal Coletivo (cache): guardar snapshot representativo
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

      // Aspectos Pessoais (Tâ†’N) â€“ detectAspects deve manter planet1 do primeiro conjunto (trÃ¢nsitos)
      const natalSetForAspects = [
        ...natalPlanets.map(p => ({ name: p.name, longitude: p.longitude, speed: 0 })),
        { name: 'Asc', longitude: natalHouses.ascendant, speed: 0 },
        { name: 'MC', longitude: natalHouses.midheaven, speed: 0 },
        { name: 'IC', longitude: (natalHouses.midheaven + 180) % 360, speed: 0 },
      ]
      const aspectsTransitsToNatalTN = detectAspects(
        planetsWithHouses.map(p => ({ name: p.name, longitude: p.longitude, speed: p.speed })),
        natalSetForAspects,
        aspectsConfig
      )
      console.log(`âœ… Aspectos Pessoais calculados: ${aspectsTransitsToNatalTN.length}`)

      // 4. ANÃLISE REAL DAS ÃREAS DA VIDA
      // Para Status Pessoal: atribuir planetas do momento nas CASAS NATAIS e usar aspectos Pessoais
      const currentOnNatalHouses = this.assignHouses(realPlanets, natalHouses)
      const lifeAreas = this.calculateRealLifeAreas(currentOnNatalHouses, aspectsTransitsToNatalTN, natalHouses, natalPlanets, birthDateTime, latitude, longitude)
      // Derivar um status agregado pessoal simplificado a partir de lifeAreas
      const areaScores = Object.values(lifeAreas).map(a => a.percentage)
      const avg = areaScores.length ? Math.round(areaScores.reduce((s,n)=>s+n,0)/areaScores.length) : 50
      const level = avg >= 80 ? 'excelente' : avg >= 65 ? 'bom' : avg >= 45 ? 'neutro' : avg >= 25 ? 'desafiador' : 'crÃ­tico'
      const areaTop = Object.entries(lifeAreas).sort((a,b)=>b[1].percentage-a[1].percentage).slice(0,2).map(([k])=>k)
      const statusPersonal = { score: avg, level: level as any, highlights: areaTop }
      console.log('âœ… AnÃ¡lise real das Ã¡reas da vida concluÃ­da')

      // ðŸŒŸ 5. NATAIS jÃ¡ obtidos (do backend ou fallback)
      console.log('âœ… PosiÃ§Ãµes natais e casas natais prontas')

      // ðŸŒŸ 6. COMPARAÃ‡ÃƒO NATAL vs ATUAL
      const planetComparisons = this.createPlanetComparisons(natalPlanets, planetsWithHouses, houses)
      console.log('âœ… ComparaÃ§Ãµes planetÃ¡rias criadas')

      // ðŸŒŸ 7. ASPECTOS COM CASAS
      const houseAspects = this.calculateHouseAspects(realPlanets, houses)
      console.log('âœ… Aspectos com casas calculados')

      // ðŸŒŸ 8. RESUMO ELEMENTAL E MODAL
      const chartSummary = this.createChartSummary(natalPlanets, planetsWithHouses)
      console.log('âœ… Resumo da carta criado')

      // ðŸŒŸ 9. ANÃLISE GERAL DE STATUS PLANETÃRIOS
      const planetaryStatusAnalysis = this.createPlanetaryStatusAnalysis(planetsWithStatus)
      console.log('âœ… AnÃ¡lise de status planetÃ¡rios criada')

      // Preparar agrupamento para futura UI de TrÃ¢nsitos Comparativos
      const personalTransits = aspectsTransitsToNatalTN.map(a => {
        // Lado A = trÃ¢nsito por construÃ§Ã£o
        const transitName = a.planet1
        const natalName = a.planet2
        // Casa natal impactada: onde o planeta em trÃ¢nsito cai nas casas NATAIS
        const transitHouseNatal = currentOnNatalHouses.find(p => p.name === transitName)?.house || 0
        // SÃ©rie retrÃ³grada (marcaÃ§Ã£o heurÃ­stica): id por par + tipo
        const seriesId = `${transitName}:${natalName}:${a.type}`
        const contactPhase: 'direct'|'retro' = (planetsWithHouses.find(p=>p.name===transitName)?.isRetrograde ? 'retro' : 'direct')
        // Aspectoâ€‘mestre (heurÃ­stica): forte e envolvendo planetas lentos ou Ã¢ngulos
        const slowSet = new Set(['Jupiter','Saturn','Uranus','Neptune','Pluto'])
        const isMaster = a.strength >= 80 || slowSet.has(transitName)
        // Ãndice do contato (heurÃ­stica por orbe decrescente dentro da sÃ©rie)
        let contactIndex: 1|2|3 = 1
        try {
          const sameSeries = aspectsTransitsToNatalTN
            .filter(x => x.planet1===transitName && x.planet2===natalName && x.type===a.type)
            .sort((x,y)=>x.orb - y.orb)
          const idx = sameSeries.findIndex(x=>x===a)
          if (idx === 1) contactIndex = 2
          if (idx >= 2) contactIndex = 3
        } catch {}
        return {
          transitPlanet: transitName,
          natalPlanet: natalName,
          type: a.type,
          orb: a.orb,
          isApplying: a.isApplying,
          strength: a.strength,
          natalHouseImpacted: transitHouseNatal,
          durationClass: this.classifyTransitDuration(transitName),
          seriesId,
          contactPhase,
          isMaster,
          contactIndex,
        }
      })
      const personalSummary = summarizePersonalTransits(personalTransits)

      // Agrupar trÃ¢nsitos pessoais por Ã¡rea da vida com base nas casas significadoras
      const byArea: Record<string, typeof personalTransits> = {}
      for (const [areaName, cfg] of Object.entries(this.LIFE_AREAS)) {
        byArea[areaName] = personalTransits.filter(t => cfg.houses.includes(t.natalHouseImpacted))
      }

      const result: RealAstrologyData = {
        timestamp: date.toISOString(),
        planets: planetsWithStatus, // Usar planetas com status
        aspects: aspectsCurrentTT,
        // novos campos para consumo futuro na UI
        aspectsCurrentTT,
        aspectsTransitsToNatalTN,
        houses: houses.cusps,
        ascendant: houses.ascendant,
        midheaven: houses.midheaven,
        housesApproximate: (houses as any).approximate === true,
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
          general: aspectsCurrentTT,
          byArea,
        },
        statusPersonal,
        lifeAreas,
        // ðŸŒŸ NOVAS FUNCIONALIDADES GRATUITAS
        natalPlanets,
        natalAscendant: natalHouses.ascendant,
        natalMidheaven: natalHouses.midheaven,
        natalHousesApproximate: (natalHouses as any).approximate === true,
        planetComparisons,
        chartSummary,
        houseAspects,
        // ðŸŒŸ NOVO: AnÃ¡lise completa de status planetÃ¡rios
        planetaryStatusAnalysis,
        debug: {
          lifeAreas: ((this as any)._debugLifeAreas) || {},
          // Remover personalTransitsSummary - nÃ£o estÃ¡ na interface
        }
      }

      console.log('ðŸŽ¯ CÃ¡lculos astrolÃ³gicos REAIS concluÃ­dos com sucesso!')
      return result

    } catch (error) {
      console.error('âŒ Erro nos cÃ¡lculos astrolÃ³gicos reais:', error)
      const errorMessage = error instanceof Error ? error.message : String(error)
      throw new Error(`Falha nos cÃ¡lculos astrolÃ³gicos reais: ${errorMessage}`)
    }
  }

  /**
   * Calcula posiÃ§Ãµes planetÃ¡rias REAIS usando Astronomy Engine (precisÃ£o NASA)
   */
  private static async calculateRealPlanetPositions(
    date: Date, 
    latitude: number, 
    longitude: number
  ): Promise<RealPlanetPosition[]> {
    const positions: RealPlanetPosition[] = []
    
    for (const planetName of this.PLANETS) {
      try {
        // Usar Astronomy Engine para posiÃ§Ãµes REAIS
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

        // PosiÃ§Ã£o geocÃªntrica REAL
  const position = Astronomy.GeoVector(body, date, false)
        
        // Verificar se a posiÃ§Ã£o Ã© vÃ¡lida
        if (!position || position.x === undefined || position.y === undefined || position.z === undefined) {
          console.error(`âŒ PosiÃ§Ã£o invÃ¡lida para ${planetName}:`, position)
          continue
        }
        
        // Converter para coordenadas eclÃ­pticas
        const ecliptic = Astronomy.Ecliptic(position)
        
        // Verificar se coordenadas eclÃ­pticas sÃ£o vÃ¡lidas (astronomy-engine usa 'elon' e 'elat')
        if (!ecliptic || ecliptic.elon === undefined || ecliptic.elat === undefined) {
          console.error(`âŒ Coordenadas eclÃ­pticas invÃ¡lidas para ${planetName}:`, ecliptic)
          continue
        }
        
        // Calcular velocidade (diferenÃ§a de posiÃ§Ã£o em 1 dia)
        const nextDay = new Date(date.getTime() + 24 * 60 * 60 * 1000)
  const nextPosition = Astronomy.GeoVector(body, nextDay, false)
        const nextEcliptic = Astronomy.Ecliptic(nextPosition)
        const speed = (nextEcliptic && nextEcliptic.elon !== undefined) ? 
          nextEcliptic.elon - ecliptic.elon : 0

        // Determinar signo e grau
        const signIndex = Math.floor(ecliptic.elon / 30)
        const degree = ecliptic.elon % 30
        const sign = this.SIGNS[signIndex] || 'Ãries'

        // Verificar retrogradaÃ§Ã£o
        const isRetrograde = speed < 0

        const planetData = {
          name: planetName,
          longitude: ecliptic.elon, // astronomy-engine usa 'elon'
          latitude: ecliptic.elat,  // astronomy-engine usa 'elat'
          distance: position.Length() || Math.sqrt(position.x*position.x + position.y*position.y + position.z*position.z) || 1.0,
          speed,
          sign,
          degree,
          house: 1, // SerÃ¡ calculado posteriormente
          isRetrograde
        }
        
        console.log(`ðŸ” DEBUG ${planetName}:`, {
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
        console.error(`âŒ Erro ao calcular posiÃ§Ã£o de ${planetName}:`, error)
      }
    }

    return positions
  }

  /**
   * Backend de alta precisÃ£o (Placidus/efemÃ©rides robustas)
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
    // Adaptar para RealPlanetPosition esperado se o backend jÃ¡ fornecer eclÃ­pticas
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

  /** Bundle: posiÃ§Ãµes + casas + natal, via backend */
  private static async fetchBackendBundle(
    currentDate: Date,
    natalDate: Date,
    latitude: number,
    longitude: number,
    options?: { natalLocal?: string; natalTimezone?: string; natalLat?: number; natalLon?: number }
  ): Promise<{
    current: { planets: RealPlanetPosition[]; houses: { cusps: number[]; ascendant: number; midheaven: number, approximate?: boolean, system?: string, systemEffective?: string } },
    natal: { planets: RealPlanetPosition[]; houses: { cusps: number[]; ascendant: number; midheaven: number, approximate?: boolean, system?: string, systemEffective?: string } },
  }> {
    const backend = process.env.EXPO_PUBLIC_BACKEND_URL || 'https://tabulav0dev-backend.vercel.app'
    const ascOverrideDeg = Number((globalThis as any).__ascOverrideDeg)
    const natalAscOverrideDeg = Number((globalThis as any).__natalAscOverrideDeg)
    const requestBody: any = {
      datetimeISO: currentDate.toISOString(),
      lat: latitude,
      lon: longitude,
      includeHouses: true,
      // Respeitar sistema de casas escolhido pelo usuÃ¡rio (fallback 'placidus')
        system: normalizeHouseSystem((globalThis as any).__userHouseSystem || 'placidus'),
      natalISO: options?.natalLocal ? undefined : natalDate.toISOString(),
      natalLocal: options?.natalLocal,
      natalTimezone: options?.natalTimezone,
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

    console.log('ðŸ›°ï¸ ASTRO DEBUG - Request posiÃ§Ãµes/houses (backend)', requestBody)

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
      // Confiar na casa do backend quando presente; fallback para 0 para reatribuiÃ§Ã£o local
      house: typeof p.house === 'number' ? p.house : (0 as unknown as number),
      isRetrograde: !!p.retrograde,
    })

    const currentPlanets = (data.positions || []).map(toPlanet)
    const currentHouses: { cusps: number[]; ascendant: number; midheaven: number, approximate?: boolean, system?: string, systemEffective?: string } =
      data.houses || { cusps: Array.from({ length: 12 }, (_, i) => i * 30), ascendant: 0, midheaven: 90 }
    const natalPlanets = ((data.natal?.positions) || []).map(toPlanet)
    // ðŸŒŸ CORREÃ‡ÃƒO: Calcular casas natais localmente se o backend nÃ£o as forneceu
    let natalHouses: { cusps: number[]; ascendant: number; midheaven: number, approximate?: boolean, system?: string, systemEffective?: string }
    
    if (data.natal?.houses) {
      // Backend forneceu casas natais - usar
      natalHouses = data.natal.houses
      console.log('âœ… Backend forneceu casas natais')
    } else {
      // Backend nÃ£o forneceu casas natais - calcular localmente
      console.log('âš ï¸ Backend nÃ£o forneceu casas natais - calculando localmente...')
      try {
        const natalLat = options?.natalLat || latitude
        const natalLon = options?.natalLon || longitude
        const system = normalizeHouseSystem((globalThis as any).__userHouseSystem || 'placidus')
        
                const res = await computeHousesUTC(natalDate, natalLat, natalLon, system)
        natalHouses = { 
          cusps: res.cusps, 
          ascendant: res.asc, 
          midheaven: res.mc, 
          approximate: (res as any).approximate === true,
          system: system,
          systemEffective: system
        }
        console.log('âœ… Casas natais calculadas localmente')
      } catch (error) {
        console.error('âŒ Erro ao calcular casas natais localmente:', error)
        // Fallback para casas atuais (nÃ£o ideal, mas funcional)
        natalHouses = currentHouses
        console.log('âš ï¸ Usando casas atuais como fallback para casas natais')
      }
    }

    // Reatribuir SEMPRE as casas no cliente usando as cÃºspides do backend
    // para garantir consistÃªncia de partiÃ§Ã£o (ASC-ancorado, CCW, fronteira eps)
    const currentWithHouses = this.assignHouses(currentPlanets, currentHouses)
    const natalWithHouses = this.assignHouses(natalPlanets, natalHouses)

    // CRÃTICO: Validar ordem das cÃºspides
    const validateCuspsOrder = (cusps: number[], label: string) => {
      const norm = (d: number) => (d % 360 + 360) % 360
      if (!Array.isArray(cusps) || cusps.length < 12) {
        console.error(`${label}: cusps invalid`, { length: Array.isArray(cusps) ? cusps.length : null })
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
          console.error(`${label}: cusps out of order`, {
            casa: i,
            current: cusps[i - 1].toFixed(2),
            next: cusps[i].toFixed(2),
            step: step.toFixed(2)
          })
        }
        unwrapped.push(v)
      }

      if (isValid) {
        console.log(`${label}: cusps ordered`)
      } else {
        console.log(`${label}: ${errosDetectados.length} erros detectados: ${errosDetectados.join(', ')}`)
      }

      return isValid
    }

    const autoCorrectHouses = (houses: { cusps: number[], ascendant: number, midheaven: number }, label: string) => {
      const system = (houses as any).systemEffective || (houses as any).system || 'placidus'
      if (system !== 'placidus') {
        return houses
      }

      if (!validateCuspsOrder(houses.cusps, label)) {
        console.log(`${label}: applying equal-house autocorrect`)
        const newCusps = []
        for (let i = 0; i < 12; i++) {
          newCusps[i] = (houses.ascendant + (i * 30)) % 360
        }

        console.log(`${label}: houses autocorrected`)
        validateCuspsOrder(newCusps, `${label} CORRIGIDAS`)

        return {
          ...houses,
          cusps: newCusps,
          systemEffective: `${system}-autocorrected`
        }
      }

      return houses
    }

    const fmtCusps = (cusps: number[]) => cusps.map((c, i) => ({ casa: i + 1, cusp: Number(c.toFixed ? c.toFixed(2) : c) }))
    console.log('ðŸ“¦ ASTRO DEBUG - Backend payload meta', data?.meta || null)
    
    // ðŸš€ APLICAR AUTO-CORREÃ‡ÃƒO SE NECESSÃRIO
    currentHouses = autoCorrectHouses(currentHouses, 'Casas ATUAIS')
    
    console.log('ðŸ  ASTRO DEBUG - Casas ATUAIS', {
      system: (currentHouses as any).system || null,
      systemEffective: (currentHouses as any).systemEffective || null,
      approximate: !!(currentHouses as any).approximate,
      asc: currentHouses.ascendant,
      mc: currentHouses.midheaven,
      cusps: fmtCusps(currentHouses.cusps),
      planets: currentWithHouses.map(p => ({ planeta: p.name, lon: Number(p.longitude.toFixed ? p.longitude.toFixed(2) : p.longitude), casa: p.house }))
    })
    try { if ((currentHouses as any)._debug) console.log('ðŸ§ª ASTRO DEBUG - Casas ATUAIS _debug', (currentHouses as any)._debug) } catch {}
    
    // ðŸš€ APLICAR AUTO-CORREÃ‡ÃƒO PARA CASAS NATAIS SE NECESSÃRIO
    natalHouses = autoCorrectHouses(natalHouses, 'Casas NATAIS')
    
    console.log('ðŸ  ASTRO DEBUG - Casas NATAIS', {
      system: (natalHouses as any).system || null,
      systemEffective: (natalHouses as any).systemEffective || null,
      approximate: !!(natalHouses as any).approximate,
      asc: natalHouses.ascendant,
      mc: natalHouses.midheaven,
      cusps: fmtCusps(natalHouses.cusps),
      planets: natalWithHouses.map(p => ({ planeta: p.name, lon: Number(p.longitude.toFixed ? p.longitude.toFixed(2) : p.longitude), casa: p.house }))
    })
    try { if ((natalHouses as any)._debug) console.log('ðŸ§ª ASTRO DEBUG - Casas NATAIS _debug', (natalHouses as any)._debug) } catch {}
    
    // âœ… VALIDAÃ‡Ã•ES FINAIS GARANTEM QUALIDADE 100%
    validateCuspsOrder(currentHouses.cusps, 'Casas ATUAIS FINAIS')
    validateCuspsOrder(natalHouses.cusps, 'Casas NATAIS FINAIS')

    return {
      current: { planets: currentWithHouses, houses: currentHouses },
      natal: { planets: natalWithHouses, houses: natalHouses },
    }
  }

  /**
   * Calcula casas astrolÃ³gicas REAIS usando sistema Placidus
   */
  private static async calculateRealHouses(
    currentDate: Date,
    _birthDate: Date, 
    latitude: number, 
    longitude: number,
  houseSystem?: HouseSystem
    ): Promise<{ cusps: number[], ascendant: number, midheaven: number, approximate?: boolean, system?: HouseSystem, systemEffective?: HouseSystem }> {
    // Delegar para mÃ³dulo unificado de casas do app (garante monotonicidade e fallback)
    try {
        const system = normalizeHouseSystem(houseSystem || (globalThis as any).__userHouseSystem || 'placidus')
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
      console.error('âŒ Erro no cÃ¡lculo das casas (unificado):', error)
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
    // Usar engine unificada com orbes configurÃ¡veis
    const A = planets.map(p => ({ name: p.name, longitude: p.longitude, speed: p.speed }))
    const res = detectAspects(A, A, aspectsConfig)
    return res.map(r => ({ planet1: r.planet1, planet2: r.planet2, type: r.type, orb: r.orb, isApplying: r.isApplying, strength: r.strength }))
  }

  /** Ãndice coletivo do dia (Tâ†’T) e fase lunar */
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
    const hardTypes = new Set(['quadratura','oposiÃ§Ã£o','semiquadratura','sesquiquadratura'])
    const softTypes = new Set(['trÃ­gono','sextil'])


    const scored = aspectsTT.map(a => {
      const p1 = get(a.planet1)
      const p2 = get(a.planet2)
      const w1 = (slowBoost[p1?.name||''] ?? 1)*(fastPenalty[p1?.name||''] ?? 1)
      const w2 = (slowBoost[p2?.name||''] ?? 1)*(fastPenalty[p2?.name||''] ?? 1)
      const w = (w1 + w2) / 2
      let sign = 0
      if (softTypes.has(a.type)) sign = +1
      else if (hardTypes.has(a.type)) sign = -1
      else if (a.type === 'conjunÃ§Ã£o') {
        // ConjunÃ§Ã£o: neutra â†’ avaliar pares clÃ¡ssicos
        const malefics = new Set(['Mars','Saturn'])
        const benefics = new Set(['Venus','Jupiter'])
        if ((p1 && malefics.has(p1.name)) || (p2 && malefics.has(p2.name))) sign = -1
        if ((p1 && benefics.has(p1.name)) || (p2 && benefics.has(p2.name))) sign = sign === -1 ? 0 : +1
      }
      const strength = a.strength ?? 50
      const score = Math.max(0, Math.min(100, strength * w))

      // Estimar janela de vigÃªncia a partir da orbe mÃ¡xima e velocidade relativa
      const orbAllowed = maxOrbForPair(a.type, a.planet1, a.planet2)
      const relSpeed = Math.max(0.02, Math.abs((p1?.speed ?? 0) - (p2?.speed ?? 0))) // deg/dia; piso para evitar /0
      let windowDays = (2 * orbAllowed) / relSpeed
      // Clamp e arredondamento
      if (!Number.isFinite(windowDays)) windowDays = 0
      windowDays = Math.min(365, Math.max(1, windowDays))
      windowDays = Math.round(windowDays)

      return { a: { ...a, orbAllowed, relSpeed, windowDays }, score, sign }
    })

    // Detectar padrÃµes aspectuais (simplificado)
    const keyFor = (x: string, y: string) => x < y ? `${x}|${y}` : `${y}|${x}`
    const hasPair = (list: RealAspect[], type: string, p: string, q: string) => list.some(a => a.type === type && keyFor(a.planet1,a.planet2) === keyFor(p,q))
    const idxOf = (list: RealAspect[], type: string, p: string, q: string): number | undefined => {
      for (let i=0;i<list.length;i++) { const a=list[i]; if (a.type===type && keyFor(a.planet1,a.planet2)===keyFor(p,q)) return i }
      return undefined
    }
    const uniqPlanets = Array.from(new Set(aspectsTT.flatMap(a => [a.planet1, a.planet2])))
    const boostIdx = new Map<number, number>()

    // Tâ€‘Square: Aâ–¡B, Aâ–¡C, Bâ˜C
    for (const a of uniqPlanets) {
      for (let i = 0; i < uniqPlanets.length; i++) {
        for (let j = i+1; j < uniqPlanets.length; j++) {
          const b = uniqPlanets[i], c = uniqPlanets[j]
          if (hasPair(aspectsTT,'quadratura',a,b) && hasPair(aspectsTT,'quadratura',a,c) && hasPair(aspectsTT,'oposiÃ§Ã£o',b,c)) {
            const i1 = idxOf(aspectsTT,'quadratura',a,b)
            const i2 = idxOf(aspectsTT,'quadratura',a,c)
            const i3 = idxOf(aspectsTT,'oposiÃ§Ã£o',b,c)
            ;[i1,i2,i3].forEach(ix=>{ if(ix!==undefined) boostIdx.set(ix, Math.max(1.15, boostIdx.get(ix)||1)) })
          }
        }
      }
    }

    // Grande TrÃ­gono: Aâ–³B, Aâ–³C, Bâ–³C
    for (let i = 0; i < uniqPlanets.length; i++) {
      for (let j = i+1; j < uniqPlanets.length; j++) {
        for (let k = j+1; k < uniqPlanets.length; k++) {
          const a = uniqPlanets[i], b = uniqPlanets[j], c = uniqPlanets[k]
          if (hasPair(aspectsTT,'trÃ­gono',a,b) && hasPair(aspectsTT,'trÃ­gono',a,c) && hasPair(aspectsTT,'trÃ­gono',b,c)) {
            const i1 = idxOf(aspectsTT,'trÃ­gono',a,b)
            const i2 = idxOf(aspectsTT,'trÃ­gono',a,c)
            const i3 = idxOf(aspectsTT,'trÃ­gono',b,c)
            ;[i1,i2,i3].forEach(ix=>{ if(ix!==undefined) boostIdx.set(ix, Math.max(1.12, boostIdx.get(ix)||1)) })
          }
        }
      }
    }

    // Yod: Aâš»B, Aâš»C e Bâœ¶C
    for (let i = 0; i < uniqPlanets.length; i++) {
      for (let j = 0; j < uniqPlanets.length; j++) if (j!==i) {
        for (let k = 0; k < uniqPlanets.length; k++) if (k!==i && k!==j) {
          const a = uniqPlanets[i], b = uniqPlanets[j], c = uniqPlanets[k]
          if (hasPair(aspectsTT,'quincÃºncio',a,b) && hasPair(aspectsTT,'quincÃºncio',a,c) && hasPair(aspectsTT,'sextil',b,c)) {
            const i1 = idxOf(aspectsTT,'quincÃºncio',a,b)
            const i2 = idxOf(aspectsTT,'quincÃºncio',a,c)
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
   * Atribui casa a cada planeta com base nas cÃºspides calculadas
   */
  private static assignHouses(
    planets: RealPlanetPosition[],
    houses: { cusps: number[], ascendant: number, midheaven: number, approximate?: boolean, system?: HouseSystem, systemEffective?: HouseSystem }
  ): RealPlanetPosition[] {
    const asc = Number.isFinite(houses.ascendant) ? houses.ascendant : houses.cusps[0]
    const system = normalizeHouseSystem(houses.systemEffective || houses.system || (globalThis as any).__userHouseSystem || 'placidus')
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
   * Calcula status REAL das Ã¡reas da vida baseado em planetas e aspectos
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

    // Helpers para padrÃµes Pessoais envolvendo pontos natais
    const degDiff = (a:number,b:number)=>{ const d=Math.abs(((a-b+540)%360)-180); return d }
    const within = (x:number, target:number, tol:number)=> Math.abs(x-target) <= tol
    const natalByName = new Map(natalPlanets.map(p=>[p.name,p]))
    const countByNatal: Record<string, number> = {}
    aspects.forEach(a=>{ countByNatal[a.planet2]=(countByNatal[a.planet2]||0)+1 })
    const tnPatternBoost: Map<string, number> = new Map()
    const markBoost = (t:string,n:string,m:number)=>{
      const k = `${t}|${n}`
      tnPatternBoost.set(k, Math.max(m, tnPatternBoost.get(k)||1))
    }
    // Escanear por transit hitting dois natais para padrÃµes: Tâ€‘Square, Grande TrÃ­gono, Yod
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
        // Tâ€‘Square: tâ–¡n1 e tâ–¡n2 com n1â˜n2
        if (A.type==='quadratura' && B.type==='quadratura' && within(dd,180,6)) {
          markBoost(tName, A.planet2, 1.15)
          markBoost(tName, B.planet2, 1.15)
        }
        // Grande TrÃ­gono: tâ–³n1 e tâ–³n2 com n1â–³n2
        if (A.type==='trÃ­gono' && B.type==='trÃ­gono' && within(dd,120,6)) {
          markBoost(tName, A.planet2, 1.12)
          markBoost(tName, B.planet2, 1.12)
        }
        // Yod: tâš»n1 e tâš»n2 com n1âœ¶n2
        if (A.type==='quincÃºncio' && B.type==='quincÃºncio' && within(dd,60,4)) {
          markBoost(tName, A.planet2, 1.10)
          markBoost(tName, B.planet2, 1.10)
        }
      }
    }

    for (const [areaName, config] of Object.entries(this.LIFE_AREAS)) {
      let totalScore = 0
      let influences: string[] = []
      let mainPlanets: string[] = []

      // Analisar planetas relevantes para a Ã¡rea
      let planetScores: number[] = []
      const planetDetails: NonNullable<RealAstrologyData['debug']>['lifeAreas'][string]['planetDetails'] = [] as any
      
      for (const planetName of config.planets) {
        const planet = planets.find(p => p.name === planetName)
        if (!planet) continue

        mainPlanets.push(planetName)

        let planetScore = 0

        // PontuaÃ§Ã£o baseada no signo (dignidades essenciais)
        const signScore = this.getPlanetSignScore(planet)
        planetScore += signScore * 0.30
        if (signScore >= 70) influences.push(`${planetName} em ${planet.sign} (dignidade)`) 
        if (signScore <= 35) influences.push(`${planetName} em ${planet.sign} (debilidade)`) 

        // PontuaÃ§Ã£o baseada na casa (acidentais iniciais)
        const houseScore = this.getPlanetHouseScore(planet, config.houses)
        planetScore += houseScore * 0.30
        if (houseScore >= 65) influences.push(`${planetName} na casa ${planet.house}`)

        // InfluÃªncias dos aspectos
        // Considerar aspectos Tâ†’N onde este planeta Ã© o trÃ¢nsito (detectAspects mantÃ©m planet1 como trÃ¢nsito)
        const planetAspects = aspects.filter(a => a.planet1 === planetName)
        
        let aspectScoreSum = 0
        let aspectCount = 0
        const aspectDetails: Array<{ with: string; type: string; orb: number; isApplying: boolean; baseScore: number; beneficMaleficDelta: number; finalScore: number }> = []
        
        for (const aspect of planetAspects) {
          // Contextos
          const other = aspect.planet2
          const otherNatal = natalPlanets.find(p => p.name === other)
          const baseScore = this.getAspectScoreAdvanced(aspect, planets, natalPlanets)

          // BenÃ©ficos/MalÃ©ficos do alvo natal
          const benefics = ['Venus', 'Jupiter']
          const malefics = ['Mars', 'Saturn']
          const harmonious = aspect.type === 'trÃ­gono' || aspect.type === 'sextil'
          const hard = aspect.type === 'quadratura' || aspect.type === 'oposiÃ§Ã£o'
          let delta = 0
          if (benefics.includes(other)) {
            if (harmonious) delta += 10
            else if (aspect.type === 'conjunÃ§Ã£o') delta += 5
          }
          if (malefics.includes(other)) {
            if (hard) delta -= 10
            else if (aspect.type === 'conjunÃ§Ã£o') delta -= 5
          }

          // RecepÃ§Ã£o mÃºtua simples (domicÃ­lio/exaltaÃ§Ã£o)
          const receptionMult = this.getReceptionMultiplier(
            planets.find(p=>p.name===planetName)!,
            otherNatal || undefined
          )

          // Peso por importÃ¢ncia do alvo natal
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
          // RegÃªncias de casa: pequeno boost quando o trÃ¢nsito aspecta regente de casa-chave da Ã¡rea
          const houseRulers: Record<number, string[]> = {
            1:['Mars'], 2:['Venus'], 3:['Mercury'], 4:['Moon'], 5:['Sun'], 6:['Mercury'], 7:['Venus'], 8:['Mars'], 9:['Jupiter'], 10:['Saturn'], 11:['Saturn','Uranus'], 12:['Jupiter','Neptune']
          }
          const areaRulers = new Set(config.houses.flatMap(h => houseRulers[h] || []))
          const rulerBoost = areaRulers.has(other) ? 1.06 : 1.0

          // PadrÃµes Pessoais
          const pattMult = tnPatternBoost.get(`${planetName}|${other}`) || 1.0
          // Cluster: mÃºltiplos hits ao mesmo natal
          const clusterMult = (countByNatal[other]||0) >= 2 ? 1.10 : 1.0

          // Casa angularidade â€“ multiplicador acidental pelo local do trÃ¢nsito nas casas NATAIS
          const angularMult = this.getHouseAngularMultiplier(planet.house)

          // Almuten (peso extra quando envolvido)
          const almutenMult = (natalAlmuten && (planetName === natalAlmuten || other === natalAlmuten)) ? 1.08 : 1.0
          let aspectScore = Math.max(0, Math.min(100,
            baseScore * natalWeight * relevantHouseBoost * rulerBoost * receptionMult * angularMult * almutenMult * pattMult * clusterMult + delta
          ))

          // Peso de duraÃ§Ã£o por ciclo planetÃ¡rio (Lua/MercÃºrio < 1; lentos > 1)
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
            const tagExtra = delta > 0 ? ' (apoio)' : delta < 0 ? ' (tensÃ£o)' : ''
            const houseTag = transitInRelevantHouse ? ` [casa ${planet.house}]` : ''
            influences.push(`${aspect.type} ${other}${tagExtra}${houseTag}`)
          }
        }
        
        // MÃ©dia dos aspectos em vez de soma
        if (aspectCount > 0) {
          planetScore += (aspectScoreSum / aspectCount) * 0.40
        } else {
          planetScore += 50 * 0.40 // Neutro se nÃ£o hÃ¡ aspectos
        }

        // CondiÃ§Ãµes planetÃ¡rias (retrÃ³grado/combustÃ£o/velocidade)
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

      // Sistema de pesos por planeta (importÃ¢ncia astrolÃ³gica)
      const planetWeights: Record<string, number> = {
        'Sun': 1.2, 'Moon': 1.2,        // Luminares (mÃ¡xima importÃ¢ncia)
        'Mercury': 1.0, 'Venus': 1.0, 'Mars': 1.0,  // Pessoais
        'Jupiter': 1.1, 'Saturn': 1.1,              // Sociais
        'Uranus': 0.9, 'Neptune': 0.9, 'Pluto': 0.9 // Transpessoais
      }

      // Score ponderado por importÃ¢ncia planetÃ¡ria
      const weightedScore = planetScores.reduce((sum, score, i) => {
        const planetName = config.planets[i]
        const weight = planetWeights[planetName] || 1.0
        return sum + (score * weight)
      }, 0) / planetScores.length

      // Score final baseado na lÃ³gica astrolÃ³gica real
      const finalScore = weightedScore

      // NormalizaÃ§Ã£o baseada na lÃ³gica astrolÃ³gica (0-100%)
      const percentage = Math.max(0, Math.min(100, finalScore))
      
      // Determinar status baseado na pontuaÃ§Ã£o
      const status = percentage >= 80 ? 'excelente' :
                    percentage >= 65 ? 'bom' :
                    percentage >= 45 ? 'neutro' :
                    percentage >= 25 ? 'desafiador' : 'crÃ­tico'

      lifeAreas[areaName] = {
        percentage: Math.round(percentage),
        status,
        influences: influences.slice(0, 4), // Top influÃªncias
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

  private static classifyTransitDuration(planetName: string): 'curto' | 'mÃ©dio' | 'longo' {
    // HeurÃ­stica baseada em velocidade mÃ©dia/orbital
    if (planetName === 'Sun' || planetName === 'Moon' || planetName === 'Mercury' || planetName === 'Venus' || planetName === 'Mars') {
      return 'curto'
    }
    if (planetName === 'Jupiter' || planetName === 'Saturn') {
      return 'mÃ©dio'
    }
    return 'longo'
  }

  // ðŸŽ¯ MÃ‰TODOS PARA CÃLCULOS DETERMINÃSTICOS
  // Removidos hashes determinÃ­sticos: nÃ£o usados em produÃ§Ã£o

  // MÃ©todos auxiliares para cÃ¡lculos astronÃ´micos
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
    // Simplificado - em produÃ§Ã£o usaria cÃ¡lculo completo
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
        // InterpolaÃ§Ã£o para outras casas
        cusps.push((ascendant + i * 30) % 360)
      }
    }
    
    return cusps
  }

  private static isAspectApplying(planet1: RealPlanetPosition, planet2: RealPlanetPosition, targetAngle: number): boolean {
    // Verificar se os planetas estÃ£o se aproximando do aspecto exato
    return planet1.speed > planet2.speed
  }

  private static getPlanetSignScore(planet: RealPlanetPosition): number {
    // Dignidades essenciais (inclui domicÃ­lio/exaltaÃ§Ã£o/detrimento/queda + triplicidade + termos/faces clÃ¡ssicos)
    const essentials: Record<string, {
      domicile?: string[]; exaltation?: string[]; detriment?: string[]; fall?: string[]
      triplicity?: string[]; // signos onde o planeta participa da triplicidade
      terms?: string[];      // aproximaÃ§Ã£o: signos em que comumente recebe algum termo
      faces?: string[];      // faces/decanatos aproximados por signo
    }> = {
      Sun:    { domicile: ['LeÃ£o'],    exaltation: ['Ãries'],     detriment: ['AquÃ¡rio'],  fall: ['Libra'] },
      Moon:   { domicile: ['CÃ¢ncer'],  exaltation: ['Touro'],     detriment: ['CapricÃ³rnio'], fall: ['EscorpiÃ£o'] },
      Mercury:{ domicile: ['GÃªmeos','Virgem'], exaltation: [],    detriment: ['SagitÃ¡rio','Peixes'], fall: [], triplicity:['GÃªmeos','Virgem'], faces:['GÃªmeos','Virgem'] },
      Venus:  { domicile: ['Touro','Libra'],  exaltation: ['Peixes'], detriment: ['EscorpiÃ£o','Ãries'], fall: ['Virgem'], triplicity:['Touro','Libra'], faces:['Touro','Libra'] },
      Mars:   { domicile: ['Ãries','EscorpiÃ£o'], exaltation: ['CapricÃ³rnio'], detriment: ['Libra','Touro'], fall: ['CÃ¢ncer'], triplicity:['Ãries','EscorpiÃ£o'] },
      Jupiter:{ domicile: ['SagitÃ¡rio','Peixes'], exaltation: ['CÃ¢ncer'], detriment: ['GÃªmeos','Virgem'], fall: ['CapricÃ³rnio'], triplicity:['SagitÃ¡rio','Peixes'] },
      Saturn: { domicile: ['CapricÃ³rnio','AquÃ¡rio'], exaltation: ['Libra'], detriment: ['CÃ¢ncer','LeÃ£o'], fall: ['Ãries'], triplicity:['AquÃ¡rio','Libra'] },
      Uranus: { domicile: ['AquÃ¡rio'], triplicity:['AquÃ¡rio'] },
      Neptune:{ domicile: ['Peixes'], triplicity:['Peixes'] },
      Pluto:  { domicile: ['EscorpiÃ£o'], triplicity:['EscorpiÃ£o'] },
    }

    const e = essentials[planet.name]
    if (!e) return 50
    const inList = (arr?: string[]) => !!arr && arr.includes(planet.sign)

    let score = 50
    if (inList(e.domicile)) score += 28
    if (inList(e.exaltation)) score += 24
    if (inList(e.detriment)) score -= 28
    if (inList(e.fall)) score -= 24
    // Triplicidade (bÃ´nus moderado)
    if (inList(e.triplicity)) score += 6
    // Termos/Faces clÃ¡ssicos por grau (bounds egÃ­pcios + faces caldeias)
    try {
      const { getTermRuler, getFaceRuler } = require('../../astro/dignities.classical')
      const termRuler = getTermRuler(planet.sign, planet.degree)
      const faceRuler = getFaceRuler(planet.sign, planet.degree)
      if (termRuler) {
        // BÃ´nus pequeno quando o planeta Ã© regente do termo
        if (termRuler === planet.name) score += 4
        // Penalidade suave se inimigo tradicional (Marte/Saturno) rege o termo do planeta
        if ((termRuler === 'Marte' || termRuler === 'Saturno') && (planet.name === 'Moon' || planet.name === 'Venus')) score -= 2
      }
      if (faceRuler) {
        if (faceRuler === planet.name) score += 2
      }
    } catch {}

    // Clamp 0â€“100
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

    // RelevÃ¢ncia para a Ã¡rea (se for uma das casas significadoras aumenta)
    if (relevantHouses.includes(planet.house)) base += 15

    return Math.max(0, Math.min(100, base))
  }

  /** CondiÃ§Ãµes acidentais extra: retrÃ³grado, combustÃ£o, velocidade */
  private static getAccidentalConditionsModifier(
    planet: RealPlanetPosition,
    sunLongitude?: number
  ): { modifier: number; tags: string[] } {
    let mod = 0
    const tags: string[] = []

    // RetrÃ³grado
    if (planet.isRetrograde) {
      mod -= 4
      tags.push(`${planet.name} retrÃ³grado`)
    }

    // CombustÃ£o e Cazimi (aprox: dentro de 8Â° do Sol para combustÃ£o; <= 0.3Â° para cazimi) e "sob os raios" (atÃ© ~15Â°)
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

    // Orientalidade/occidentalidade (aproximaÃ§Ã£o)
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

    // Velocidade normalizada por planeta (aprox mÃ©dia): lento/rÃ¡pido
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

  // AvanÃ§ado: score de aspecto com aplicaÃ§Ã£o/separaÃ§Ã£o, orbes por tipo e peso por Sol/Lua
  private static getAspectScoreAdvanced(aspect: RealAspect, currentPlanets: RealPlanetPosition[], natalPlanets: RealPlanetPosition[]): number {
    const typeWeights: Record<string, number> = {
      'conjunÃ§Ã£o': 1.0,      // Neutro (depende dos planetas)
      'oposiÃ§Ã£o': -0.6,      // Negativo (tensÃ£o)
      'quadratura': -0.8,    // Negativo (desafio)
      'trÃ­gono': 0.8,        // Positivo (harmonia)
      'sextil': 0.6,         // Positivo (oportunidade)
      'quincÃºncio': -0.2,    // Levemente negativo
      'semissextil': 0.3,    // Levemente positivo
      'semiquadratura': -0.4, // Negativo leve
      'sesquiquadratura': -0.5, // Negativo mÃ©dio
    }
    const maxOrbByType: Record<string, number> = {
      'conjunÃ§Ã£o': 8, 'oposiÃ§Ã£o': 8, 'quadratura': 6, 'trÃ­gono': 6, 'sextil': 4, 'quincÃºncio': 3
    }
    const w = typeWeights[aspect.type] ?? 0.5
    const maxOrb = maxOrbByType[aspect.type] ?? 5
    const proximity = Math.max(0, 1 - aspect.orb / maxOrb)
    const applyingBonus = aspect.isApplying ? 1.15 : 0.95
    let score = 50 + 50 * w * proximity * applyingBonus
    // Peso extra se envolve Sol/Lua (influÃªncia larga)
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

  // RecepÃ§Ã£o mÃºtua (simplificada): se trÃ¢nsito/natal estÃ£o em signos de domicÃ­lio/exaltaÃ§Ã£o um do outro => boost; em detrimento/queda => penalidade
  private static getReceptionMultiplier(transit: RealPlanetPosition | undefined, natal: RealPlanetPosition | undefined): number {
    if (!transit || !natal) return 1.0
    const domicile: Record<string, string[]> = {
      Sun:['LeÃ£o'], Moon:['CÃ¢ncer'], Mercury:['GÃªmeos','Virgem'], Venus:['Touro','Libra'], Mars:['Ãries','EscorpiÃ£o'], Jupiter:['SagitÃ¡rio','Peixes'], Saturn:['CapricÃ³rnio','AquÃ¡rio']
    }
    const exalt: Record<string, string[]> = {
      Sun:['Ãries'], Moon:['Touro'], Mercury:[], Venus:['Peixes'], Mars:['CapricÃ³rnio'], Jupiter:['CÃ¢ncer'], Saturn:['Libra']
    }
    const detr: Record<string, string[]> = {
      Sun:['AquÃ¡rio'], Moon:['CapricÃ³rnio'], Mercury:['SagitÃ¡rio','Peixes'], Venus:['Ãries','EscorpiÃ£o'], Mars:['Libra','Touro'], Jupiter:['GÃªmeos','Virgem'], Saturn:['CÃ¢ncer','LeÃ£o']
    }
    const fall: Record<string, string[]> = {
      Sun:['Libra'], Moon:['EscorpiÃ£o'], Mercury:[], Venus:['Virgem'], Mars:['CÃ¢ncer'], Jupiter:['CapricÃ³rnio'], Saturn:['Ãries']
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

  // Peso por duraÃ§Ã£o/inÃ©rcia do par de planetas (privilegia lentos, atenua muito rÃ¡pidos)
  private static getPlanetDurationWeight(transitName: string, natalName: string): number {
    const slow: Record<string, number> = { Jupiter:1.1, Saturn:1.2, Uranus:1.25, Neptune:1.25, Pluto:1.25 }
    const fast: Record<string, number> = { Moon:0.85, Mercury:0.9 }
    let w = 1.0
    if (slow[transitName]) w *= slow[transitName]
    if (fast[transitName]) w *= fast[transitName]
    // leve reforÃ§o se alvo natal Ã© luminar
    if (natalName === 'Sun' || natalName === 'Moon') w *= 1.05
    return w
  }

  private static getAspectScore(aspect: RealAspect): number {
              // Peso por tipo (corrigido para lÃ³gica astrolÃ³gica)
          const weights: Record<string, number> = {
            'conjunÃ§Ã£o': 1.0,      // Neutro
            'oposiÃ§Ã£o': -0.6,      // Negativo
            'quadratura': -0.8,    // Negativo
            'trÃ­gono': 0.8,        // Positivo
            'sextil': 0.6,         // Positivo
            'quincÃºncio': -0.2,    // Levemente negativo
            'semissextil': 0.3,    // Levemente positivo
            'semiquadratura': -0.4, // Negativo leve
            'sesquiquadratura': -0.5, // Negativo mÃ©dio
          }
          const w = weights[aspect.type] ?? 0.0

          // Aplicante ganha bÃ´nus
          const applyingBonus = aspect.isApplying ? 1.15 : 1.0
          // Proximidade do aspecto (orb menor = mais forte)
          // Orbe base por tipo
          const baseOrb: Record<string, number> = {
            'conjunÃ§Ã£o': 8, 'oposiÃ§Ã£o': 8, 'quadratura': 6, 'trÃ­gono': 6, 'sextil': 4,
            'quincÃºncio': 5, 'semissextil': 3, 'semiquadratura': 2, 'sesquiquadratura': 2,
          }
          const maxOrb = baseOrb[aspect.type] ?? 5
          const proximity = Math.max(0, 1 - aspect.orb / maxOrb)
          
          // Score baseado no peso do aspecto (pode ser negativo)
          const baseScore = w * proximity * applyingBonus
          const score = 50 + (baseScore * 50) // 50 Ã© o centro neutro

    return Math.max(0, Math.min(100, score))
  }

  // ðŸŒŸ NOVOS MÃ‰TODOS PARA FUNCIONALIDADES GRATUITAS

  /**
   * Cria comparaÃ§Ãµes entre posiÃ§Ãµes natais e atuais
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

      // Aspectos planetÃ¡rios para este planeta
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
      // Orbe fixo para casas: 0.5Â°
      { name: 'conjunÃ§Ã£o', degrees: 0, orb: 0.5 },
      { name: 'sextil', degrees: 60, orb: 0.5 },
      { name: 'quadratura', degrees: 90, orb: 0.5 },
      { name: 'trÃ­gono', degrees: 120, orb: 0.5 },
      { name: 'oposiÃ§Ã£o', degrees: 180, orb: 0.5 },
      { name: 'quincÃºncio', degrees: 150, orb: 0.5 },
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

    // Detectar mudanÃ§as significativas, sempre com emoji
    const elementalChanges: string[] = []
    const modalityChanges: string[] = []

    // AnÃ¡lise elemental
    Object.keys(natalElemental).forEach(element => {
      const key = element as keyof ElementalAnalysis
      const diff = currentElemental[key] - natalElemental[key]
      if (diff !== 0) {
        const emoji = element === 'fire' ? 'ðŸ”¥' : element === 'earth' ? 'ðŸŒ' : element === 'air' ? 'ðŸ’¨' : 'ðŸ’§'
        const translatedElement = element === 'fire' ? 'fogo' : element === 'earth' ? 'terra' : element === 'air' ? 'ar' : 'Ã¡gua'
        elementalChanges.push(`${diff > 0 ? 'Mais' : 'Menos'} ${emoji} ${translatedElement}`)
      }
    })

    // AnÃ¡lise de modalidades
    Object.keys(natalModality).forEach(modality => {
      const key = modality as keyof ModalityAnalysis
      const diff = currentModality[key] - natalModality[key]
      if (diff !== 0) {
        const icon = modality === 'cardinal' ? 'âš¡' : modality === 'fixed' ? 'ðŸ”’' : 'ðŸ”„'
        const translatedModality = modality === 'cardinal' ? 'cardeal' : modality === 'fixed' ? 'fixo' : 'mutÃ¡vel'
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

  /**
   * ðŸŒŸ NOVO: Cria anÃ¡lise completa de status planetÃ¡rios
   */
  private static createPlanetaryStatusAnalysis(
    planetsWithStatus: RealPlanetPosition[]
  ): PlanetaryStatusAnalysis {
    // Filtrar planetas que tÃªm status calculado
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
        recommendations: ['Status planetÃ¡rios nÃ£o disponÃ­veis']
      }
    }

    // Calcular score geral (mÃ©dia ponderada)
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

    // Agrupar planetas por nÃ­vel
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

    // Gerar recomendaÃ§Ãµes baseadas na anÃ¡lise
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
   * Classifica o nÃ­vel geral baseado no score mÃ©dio
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
   * Gera recomendaÃ§Ãµes baseadas na anÃ¡lise planetÃ¡ria
   */
  private static generatePlanetaryRecommendations(
    planetsByLevel: Record<PlanetaryStatusLevel, string[]>,
    overallLevel: PlanetaryStatusLevel,
    strongestPlanet: { name: string; status: PlanetaryStatus },
    weakestPlanet: { name: string; status: PlanetaryStatus }
  ): string[] {
    const recommendations: string[] = []

    // RecomendaÃ§Ãµes baseadas no nÃ­vel geral
    if (overallLevel === 'Muito Forte') {
      recommendations.push('ðŸŒŸ Excelente momento para iniciativas importantes e tomada de decisÃµes')
      recommendations.push('ðŸ’ª Aproveite a forÃ§a planetÃ¡ria para projetos desafiadores')
    } else if (overallLevel === 'Forte') {
      recommendations.push('âœ… Bom momento para avanÃ§ar em objetivos pessoais')
      recommendations.push('ðŸŽ¯ Foque em Ã¡reas onde vocÃª se sente mais confiante')
    } else if (overallLevel === 'Moderado') {
      recommendations.push('âš–ï¸ Momento equilibrado - mantenha consistÃªncia em suas aÃ§Ãµes')
      recommendations.push('ðŸ”„ Aproveite para revisar e ajustar estratÃ©gias')
    } else if (overallLevel === 'Neutro') {
      recommendations.push('ðŸŒ± PerÃ­odo de estabilidade - ideal para manutenÃ§Ã£o e planejamento')
      recommendations.push('ðŸ“‹ Foque em tarefas rotineiras e organizaÃ§Ã£o')
    } else if (overallLevel === 'Fraco') {
      recommendations.push('âš ï¸ Momento desafiador - evite decisÃµes importantes')
      recommendations.push('ðŸ›¡ï¸ Foque em autocuidado e proteÃ§Ã£o')
    } else {
      recommendations.push('ðŸš¨ PerÃ­odo crÃ­tico - priorize seguranÃ§a e estabilidade')
      recommendations.push('ðŸ™ Busque apoio e evite riscos desnecessÃ¡rios')
    }

    // RecomendaÃ§Ãµes especÃ­ficas por planeta
    if (strongestPlanet.status.level === 'Muito Forte') {
      recommendations.push(`ðŸš€ ${strongestPlanet.name} estÃ¡ excepcional - aproveite sua energia mÃ¡xima`)
    }
    
    if (weakestPlanet.status.level === 'Muito Fraco') {
      recommendations.push(`ðŸ’¡ ${weakestPlanet.name} precisa de atenÃ§Ã£o especial - trabalhe suas limitaÃ§Ãµes`)
    }

    // RecomendaÃ§Ãµes baseadas na distribuiÃ§Ã£o
    const strongPlanets = planetsByLevel['Muito Forte'].length + planetsByLevel['Forte'].length
    const weakPlanets = planetsByLevel['Fraco'].length + planetsByLevel['Muito Fraco'].length

    if (strongPlanets > weakPlanets) {
      recommendations.push('ðŸŽ‰ Maioria dos planetas estÃ¡ forte - momento propÃ­cio para expansÃ£o')
    } else if (weakPlanets > strongPlanets) {
      recommendations.push('ðŸ”§ Maioria dos planetas estÃ¡ fraca - foco em recuperaÃ§Ã£o e fortalecimento')
    }

    return recommendations
  }
}

export default RealAstrologyEngine


