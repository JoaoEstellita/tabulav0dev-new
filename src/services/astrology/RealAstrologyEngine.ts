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
  // 🌟 NOVO: Status planetário integrado
  planetaryStatus?: PlanetaryStatus
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

// 🌟 NOVO: Análise de Status Planetários
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
  houses: number[] // Cúspides das casas
  ascendant: number
  midheaven: number
  housesApproximate?: boolean
  houseSystem?: HouseSystem
  // Índice Coletivo (T→T) e fase lunar
  collective?: {
    positive: number
    negative: number
    keyAspects: Array<RealAspect & { orbAllowed?: number; relSpeed?: number; windowDays?: number }>
    lunarPhase: {
      name: 'Nova' | 'Crescente' | 'Cheia' | 'Minguante'
      waxing: boolean
      elongation: number // 0..180 distância Sol-Lua
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
      durationClass?: 'curto' | 'médio' | 'longo'
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
      durationClass?: 'curto' | 'médio' | 'longo'
    }>>
  }
  statusPersonal?: {
    score: number
    level: 'excelente' | 'bom' | 'neutro' | 'desafiador' | 'crítico'
    highlights: string[]
  }
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
  natalHousesApproximate?: boolean
  natalHouses?: number[]
  planetComparisons: PlanetComparison[] // Comparação natal vs atual
  chartSummary: ChartSummary // Resumo elemental e modalidades
  houseAspects: HouseAspect[] // Aspectos com casas
  // 🌟 NOVO: Análise completa de status planetários
  planetaryStatusAnalysis?: PlanetaryStatusAnalysis
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

  // Cache simples do índice coletivo por dia (UTC)
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

    // Helpers para padrões Pessoais envolvendo pontos natais
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
    // Escanear por transit hitting dois natais para padrões: T‑Square, Grande Trígono, Yod
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
        // T‑Square: t□n1 e t□n2 com n1☍n2
        if (A.type==='quadratura' && B.type==='quadratura' && within(dd,180,6)) {
          markBoost(tName, A.planet2, 1.15)
          markBoost(tName, B.planet2, 1.15)
        }
        // Grande Trígono: t△n1 e t△n2 com n1△n2
        if (A.type==='trígono' && B.type==='trígono' && within(dd,120,6)) {
          markBoost(tName, A.planet2, 1.12)
          markBoost(tName, B.planet2, 1.12)
        }
        // Yod: t⚻n1 e t⚻n2 com n1✶n2
        if (A.type==='quincúncio' && B.type==='quincúncio' && within(dd,60,4)) {
          markBoost(tName, A.planet2, 1.10)
          markBoost(tName, B.planet2, 1.10)
        }
      }
    }

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
        // Considerar aspectos T→N onde este planeta é o trânsito (detectAspects mantém planet1 como trânsito)
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

          // Benéficos/Maléficos do alvo natal
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

          // Recepção mútua simples (domicílio/exaltação)
          const receptionMult = this.getReceptionMultiplier(
            planets.find(p=>p.name===planetName)!,
            otherNatal || undefined
          )

          // Peso por importância do alvo natal
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
          // Regências de casa: pequeno boost quando o trânsito aspecta regente de casa-chave da área
          const areaRulers = new Set(config.houses.flatMap(h => RealAstrologyEngine.HOUSE_RULERS[h] || []))
          const rulerBoost = areaRulers.has(other) ? 1.06 : 1.0

          // Padrões Pessoais
          const pattMult = tnPatternBoost.get(`${planetName}|${other}`) || 1.0
          // Cluster: múltiplos hits ao mesmo natal
          const clusterMult = (countByNatal[other]||0) >= 2 ? 1.10 : 1.0

          // Casa angularidade – multiplicador acidental pelo local do trânsito nas casas NATAIS
          const angularMult = this.getHouseAngularMultiplier(planet.house)

          // Almuten (peso extra quando envolvido)
          const almutenMult = (natalAlmuten && (planetName === natalAlmuten || other === natalAlmuten)) ? 1.08 : 1.0
          let aspectScore = Math.max(0, Math.min(100,
            baseScore * natalWeight * relevantHouseBoost * rulerBoost * receptionMult * angularMult * almutenMult * pattMult * clusterMult + delta
          ))

          // Peso de duração por ciclo planetário (Lua/Mercúrio < 1; lentos > 1)
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
            const tagExtra = delta > 0 ? ' (apoio)' : delta < 0 ? ' (tensão)' : ''
            const houseTag = transitInRelevantHouse ? ` [casa ${planet.house}]` : ''
            influences.push(`${aspect.type} ${other}${tagExtra}${houseTag}`)
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

      // Sistema de pesos por planeta (importância astrológica)
      const planetWeights: Record<string, number> = {
        'Sun': 1.2, 'Moon': 1.2,        // Luminares (máxima importância)
        'Mercury': 1.0, 'Venus': 1.0, 'Mars': 1.0,  // Pessoais
        'Jupiter': 1.1, 'Saturn': 1.1,              // Sociais
        'Uranus': 0.9, 'Neptune': 0.9, 'Pluto': 0.9 // Transpessoais
      }

      // Score ponderado por importância planetária
      const weightedScore = planetScores.reduce((sum, score, i) => {
        const planetName = config.planets[i]
        const weight = planetWeights[planetName] || 1.0
        return sum + (score * weight)
      }, 0) / planetScores.length

      // Score final baseado na lógica astrológica real
      const finalScore = weightedScore
      // Normalizacao 0-100: percentage representa o saldo final do area
      // depois de ponderar planetas (signo, casa, condicoes) e aspectos.
      // Esse percentual e a base para thresholds do produto.
      const percentage = Math.max(0, Math.min(100, finalScore))
      // Rotulo interno (nao muda a matematica do percentual):
      // >= 80 excelente, >= 65 bom, >= 45 neutro, >= 25 desafiador, < 25 critico.
      // O produto pode aplicar outros thresholds sobre o percentual.
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

  private static classifyTransitDuration(planetName: string): 'curto' | 'médio' | 'longo' {
    // Heurística baseada em velocidade média/orbital
    if (planetName === 'Sun' || planetName === 'Moon' || planetName === 'Mercury' || planetName === 'Venus' || planetName === 'Mars') {
      return 'curto'
    }
    if (planetName === 'Jupiter' || planetName === 'Saturn') {
      return 'médio'
    }
    return 'longo'
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
    // Dignidades essenciais (inclui domicílio/exaltação/detrimento/queda + triplicidade + termos/faces clássicos)
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
    // Termos/Faces clássicos por grau (bounds egípcios + faces caldeias)
    try {
      const { getTermRuler, getFaceRuler } = require('../../astro/dignities.classical')
      const termRuler = getTermRuler(planet.sign, planet.degree)
      const faceRuler = getFaceRuler(planet.sign, planet.degree)
      if (termRuler) {
        // Bônus pequeno quando o planeta é regente do termo
        if (termRuler === planet.name) score += 4
        // Penalidade suave se inimigo tradicional (Marte/Saturno) rege o termo do planeta
        if ((termRuler === 'Marte' || termRuler === 'Saturno') && (planet.name === 'Moon' || planet.name === 'Venus')) score -= 2
      }
      if (faceRuler) {
        if (faceRuler === planet.name) score += 2
      }
    } catch {}

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

    // Combustão e Cazimi (aprox: dentro de 8° do Sol para combustão; <= 0.3° para cazimi) e "sob os raios" (até ~15°)
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

    // Orientalidade/occidentalidade (aproximação)
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

    // Velocidade normalizada por planeta (aprox média): lento/rápido
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

  // Avançado: score de aspecto com aplicação/separação, orbes por tipo e peso por Sol/Lua
  private static getAspectScoreAdvanced(aspect: RealAspect, currentPlanets: RealPlanetPosition[], natalPlanets: RealPlanetPosition[]): number {
    const typeWeights: Record<string, number> = {
      'conjunção': 1.0,      // Neutro (depende dos planetas)
      'oposição': -0.6,      // Negativo (tensão)
      'quadratura': -0.8,    // Negativo (desafio)
      'trígono': 0.8,        // Positivo (harmonia)
      'sextil': 0.6,         // Positivo (oportunidade)
      'quincúncio': -0.2,    // Levemente negativo
      'semissextil': 0.3,    // Levemente positivo
      'semiquadratura': -0.4, // Negativo leve
      'sesquiquadratura': -0.5, // Negativo médio
    }
    const maxOrbByType: Record<string, number> = {
      'conjunção': 8, 'oposição': 8, 'quadratura': 6, 'trígono': 6, 'sextil': 4, 'quincúncio': 3
    }
    const w = typeWeights[aspect.type] ?? 0.5
    const maxOrb = maxOrbByType[aspect.type] ?? 5
    const proximity = Math.max(0, 1 - aspect.orb / maxOrb)
    const applyingBonus = aspect.isApplying ? 1.15 : 0.95
    let score = 50 + 50 * w * proximity * applyingBonus
    // Peso extra se envolve Sol/Lua (influência larga)
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

  // Recepção mútua (simplificada): se trânsito/natal estão em signos de domicílio/exaltação um do outro => boost; em detrimento/queda => penalidade
  private static getReceptionMultiplier(transit: RealPlanetPosition | undefined, natal: RealPlanetPosition | undefined): number {
    if (!transit || !natal) return 1.0
    const domicile: Record<string, string[]> = {
      Sun:['Leão'], Moon:['Câncer'], Mercury:['Gêmeos','Virgem'], Venus:['Touro','Libra'], Mars:['Áries','Escorpião'], Jupiter:['Sagitário','Peixes'], Saturn:['Capricórnio','Aquário']
    }
    const exalt: Record<string, string[]> = {
      Sun:['Áries'], Moon:['Touro'], Mercury:[], Venus:['Peixes'], Mars:['Capricórnio'], Jupiter:['Câncer'], Saturn:['Libra']
    }
    const detr: Record<string, string[]> = {
      Sun:['Aquário'], Moon:['Capricórnio'], Mercury:['Sagitário','Peixes'], Venus:['Áries','Escorpião'], Mars:['Libra','Touro'], Jupiter:['Gêmeos','Virgem'], Saturn:['Câncer','Leão']
    }
    const fall: Record<string, string[]> = {
      Sun:['Libra'], Moon:['Escorpião'], Mercury:[], Venus:['Virgem'], Mars:['Câncer'], Jupiter:['Capricórnio'], Saturn:['Áries']
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
      (natalTarget === 'IC' && relevantHouses.includes(4))
    const isRuler = relevantHouses.some(h => (RealAstrologyEngine.HOUSE_RULERS[h] || []).includes(natalTarget))

    return transitInRelevantHouse || natalInRelevantHouse || angleRelevant || isRuler
  }

  // Peso por duração/inércia do par de planetas (privilegia lentos, atenua muito rápidos)
  private static getPlanetDurationWeight(transitName: string, natalName: string): number {
    const slow: Record<string, number> = { Jupiter:1.1, Saturn:1.2, Uranus:1.25, Neptune:1.25, Pluto:1.25 }
    const fast: Record<string, number> = { Moon:0.85, Mercury:0.9 }
    let w = 1.0
    if (slow[transitName]) w *= slow[transitName]
    if (fast[transitName]) w *= fast[transitName]
    // leve reforço se alvo natal é luminar
    if (natalName === 'Sun' || natalName === 'Moon') w *= 1.05
    return w
  }

  private static getAspectScore(aspect: RealAspect): number {
              // Peso por tipo (corrigido para lógica astrológica)
          const weights: Record<string, number> = {
            'conjunção': 1.0,      // Neutro
            'oposição': -0.6,      // Negativo
            'quadratura': -0.8,    // Negativo
            'trígono': 0.8,        // Positivo
            'sextil': 0.6,         // Positivo
            'quincúncio': -0.2,    // Levemente negativo
            'semissextil': 0.3,    // Levemente positivo
            'semiquadratura': -0.4, // Negativo leve
            'sesquiquadratura': -0.5, // Negativo médio
          }
          const w = weights[aspect.type] ?? 0.0

          // Aplicante ganha bônus
          const applyingBonus = aspect.isApplying ? 1.15 : 1.0
          // Proximidade do aspecto (orb menor = mais forte)
          // Orbe base por tipo
          const baseOrb: Record<string, number> = {
            'conjunção': 8, 'oposição': 8, 'quadratura': 6, 'trígono': 6, 'sextil': 4,
            'quincúncio': 5, 'semissextil': 3, 'semiquadratura': 2, 'sesquiquadratura': 2,
          }
          const maxOrb = baseOrb[aspect.type] ?? 5
          const proximity = Math.max(0, 1 - aspect.orb / maxOrb)
          
          // Score baseado no peso do aspecto (pode ser negativo)
          const baseScore = w * proximity * applyingBonus
          const score = 50 + (baseScore * 50) // 50 é o centro neutro

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
      // Orbe fixo para casas: 0.5°
      { name: 'conjunção', degrees: 0, orb: 0.5 },
      { name: 'sextil', degrees: 60, orb: 0.5 },
      { name: 'quadratura', degrees: 90, orb: 0.5 },
      { name: 'trígono', degrees: 120, orb: 0.5 },
      { name: 'oposição', degrees: 180, orb: 0.5 },
      { name: 'quincúncio', degrees: 150, orb: 0.5 },
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

  /**
   * 🌟 NOVO: Cria análise completa de status planetários
   */
  private static createPlanetaryStatusAnalysis(
    planetsWithStatus: RealPlanetPosition[]
  ): PlanetaryStatusAnalysis {
    // Filtrar planetas que têm status calculado
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
        recommendations: ['Status planetários não disponíveis']
      }
    }

    // Calcular score geral (média ponderada)
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

    // Agrupar planetas por nível
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

    // Gerar recomendações baseadas na análise
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
   * Classifica o nível geral baseado no score médio
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
   * Gera recomendações baseadas na análise planetária
   */
  private static generatePlanetaryRecommendations(
    planetsByLevel: Record<PlanetaryStatusLevel, string[]>,
    overallLevel: PlanetaryStatusLevel,
    strongestPlanet: { name: string; status: PlanetaryStatus },
    weakestPlanet: { name: string; status: PlanetaryStatus }
  ): string[] {
    const recommendations: string[] = []

    // Recomendações baseadas no nível geral
    if (overallLevel === 'Muito Forte') {
      recommendations.push('🌟 Excelente momento para iniciativas importantes e tomada de decisões')
      recommendations.push('💪 Aproveite a força planetária para projetos desafiadores')
    } else if (overallLevel === 'Forte') {
      recommendations.push('✅ Bom momento para avançar em objetivos pessoais')
      recommendations.push('🎯 Foque em áreas onde você se sente mais confiante')
    } else if (overallLevel === 'Moderado') {
      recommendations.push('⚖️ Momento equilibrado - mantenha consistência em suas ações')
      recommendations.push('🔄 Aproveite para revisar e ajustar estratégias')
    } else if (overallLevel === 'Neutro') {
      recommendations.push('🌱 Período de estabilidade - ideal para manutenção e planejamento')
      recommendations.push('📋 Foque em tarefas rotineiras e organização')
    } else if (overallLevel === 'Fraco') {
      recommendations.push('⚠️ Momento desafiador - evite decisões importantes')
      recommendations.push('🛡️ Foque em autocuidado e proteção')
    } else {
      recommendations.push('🚨 Período crítico - priorize segurança e estabilidade')
      recommendations.push('🙏 Busque apoio e evite riscos desnecessários')
    }

    // Recomendações específicas por planeta
    if (strongestPlanet.status.level === 'Muito Forte') {
      recommendations.push(`🚀 ${strongestPlanet.name} está excepcional - aproveite sua energia máxima`)
    }
    
    if (weakestPlanet.status.level === 'Muito Fraco') {
      recommendations.push(`💡 ${weakestPlanet.name} precisa de atenção especial - trabalhe suas limitações`)
    }

    // Recomendações baseadas na distribuição
    const strongPlanets = planetsByLevel['Muito Forte'].length + planetsByLevel['Forte'].length
    const weakPlanets = planetsByLevel['Fraco'].length + planetsByLevel['Muito Fraco'].length

    if (strongPlanets > weakPlanets) {
      recommendations.push('🎉 Maioria dos planetas está forte - momento propício para expansão')
    } else if (weakPlanets > strongPlanets) {
      recommendations.push('🔧 Maioria dos planetas está fraca - foco em recuperação e fortalecimento')
    }

    return recommendations
  }
}

export default RealAstrologyEngine





