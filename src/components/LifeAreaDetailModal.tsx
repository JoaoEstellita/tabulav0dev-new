import React from 'react'
import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StyleSheet
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import type { LifeArea } from '../services/prokerala/TransitService'
import type { RealAstrologyData } from '../services/astrology/RealAstrologyEngine'

const { width, height } = Dimensions.get('window')

// Sistema de cores e icones por area de vida (mantendo identidade original)
const AREA_ICONS: Record<string, string> = {
  amor: 'heart',
  carreira: 'briefcase',
  financas: 'cash',
  saude: 'fitness',
  familia: 'people',
  espiritualidade: 'flower',
  comunicacao: 'chatbubble',
  transformacao: 'refresh',
  love: 'heart',
  career: 'briefcase',
  health: 'fitness',
  family: 'people',
  spirituality: 'flower',
  finances: 'cash',
  communication: 'chatbubble',
  transformation: 'refresh',
}

const AREA_COLORS: Record<string, string[]> = {
  amor: ['#FF6B9D', '#FF8E8E'],
  carreira: ['#4ECDC4', '#44A08D'],
  financas: ['#FFD93D', '#FF9F40'],
  saude: ['#96E6A1', '#7BC142'],
  familia: ['#FF8A65', '#FFAB91'],
  espiritualidade: ['#B19CD9', '#8B5CF6'],
  comunicacao: ['#60A5FA', '#3B82F6'],
  transformacao: ['#F472B6', '#EC4899'],
  love: ['#FF6B9D', '#FF8E8E'],
  career: ['#4ECDC4', '#44A08D'],
  health: ['#96E6A1', '#7BC142'],
  family: ['#FF8A65', '#FFAB91'],
  spirituality: ['#B19CD9', '#8B5CF6'],
  finances: ['#FFD93D', '#FF9F40'],
  communication: ['#60A5FA', '#3B82F6'],
  transformation: ['#F472B6', '#EC4899'],
}

const DESIGN_SYSTEM = {
  colors: {
    white: '#FFFFFF',
    primary: '#FBBF24',
    secondary: '#F59E0B',
    positive: '#22C55E',
    negative: '#EF4444',
    neutral: '#F59E0B',
    warning: '#F97316',
    info: '#38BDF8',
    border: 'rgba(255,255,255,0.12)',
    light: 'rgba(255,255,255,0.08)'
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16
  },
  shadows: {
    card: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 6,
      elevation: 3
    }
  }
}

// Sistema completo de traducoes para o modal
const TRANSLATIONS = {
  // Planetas
    planets: {
    Sun: "Sol",
    Moon: "Lua",
    Mercury: "Mercúrio",
    Venus: "Vênus",
    Mars: "Marte",
    Jupiter: "Júpiter",
    Saturn: "Saturno",
    Uranus: "Urano",
    Neptune: "Netuno",
    Pluto: "Plutão",
    Asc: "Ascendente",
    MC: "Meio do Céu",
  },
  // Aspectos
    aspects: {
    conjunction: "conjunção",
    opposition: "oposição",
    square: "quadratura",
    trine: "trígono",
    sextile: "sextil",
    quincunx: "quincúncio",
    semisextile: "semissextil",
    semisquare: "semiquadratura",
    sesquiquadrate: "sesquiquadratura",
  },
  // Prioridades
  priorities: {
    high: 'Alta',
    medium: 'Média',
    low: 'Baixa',
  },
  // Casas astrologicas
  houses: {
    1: 'Identidade',
    2: 'Recursos',
    3: 'Comunicação',
    4: 'Lar',
    5: 'Criatividade',
    6: 'Trabalho',
    7: 'Parcerias',
    8: 'Transformação',
    9: 'Expansão',
    10: 'Carreira',
    11: 'Amizades',
    12: 'Espiritual',
  },
  // Duracoes
  durations: {
    curto: 'Curto',
    medio: 'Médio',
    longo: 'Longo',
  },
}

// Funcao auxiliar de traducao
const translate = (category: keyof typeof TRANSLATIONS, key: string): string => {
  const translations = TRANSLATIONS[category] as Record<string, string>
  return translations[key] || key
}

const getTransitDuration = (transit: RealTransitData): string => {
  // Velocidades medias dos planetas (graus por dia)
  const planetSpeeds: Record<string, number> = {
    Sun: 0.9856,      // Sol: ~1 grau por dia
    Moon: 13.176,     // Lua: ~13 graus por dia
    Mercury: 1.2,     // Mercúrio: ~1.2 graus por dia
    Venus: 1.18,      // Vênus: ~1.18 graus por dia
    Mars: 0.524,      // Marte: ~0.5 graus por dia
    Jupiter: 0.083,   // Júpiter: ~0.08 graus por dia
    Saturn: 0.033,    // Saturno: ~0.03 graus por dia
    Uranus: 0.011,    // Urano: ~0.01 graus por dia
    Neptune: 0.006,   // Netuno: ~0.006 graus por dia
    Pluto: 0.004      // Plutão: ~0.004 graus por dia
  }

  const speed = planetSpeeds[transit.transitPlanet] || 1.0
  const orb = transit.orb

  // Calcular tempo para sair do orbe (aproximacao)
  // Considerando que o planeta precisa "sair" do orbe maximo
  const maxOrb = getMaxOrbForAspect(transit.type)
  const timeToExit = (maxOrb - orb) / speed

  if (timeToExit <= 1) {
    return 'Menos de 1 dia'
  } else if (timeToExit <= 7) {
    return `${Math.round(timeToExit)} dias`
  } else if (timeToExit <= 30) {
    return `${Math.round(timeToExit / 7)} semanas`
  } else {
    return `${Math.round(timeToExit / 30)} meses`
  }
}

const getMaxOrbForAspect = (aspectType: string): number => {
  const maxOrbs: Record<string, number> = {
    conjunction: 8,
    opposition: 8,
    square: 6,
    trine: 6,
    sextile: 4,
    quincunx: 3,
    semisextile: 3,
    semisquare: 2,
    sesquiquadrate: 2,
    conjuncao: 8,
    oposicao: 8,
    quadratura: 6,
    trigono: 6,
    sextil: 4,
    quincuncio: 3,
    semissextil: 3,
    semiquadratura: 2,
    sesquiquadratura: 2,
  }
  const normalized = (aspectType || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  return maxOrbs[aspectType] || maxOrbs[normalized] || 5
}

interface LifeAreaDetailModalProps {
  visible: boolean
  onClose: () => void
  areaData: LifeArea | null
  astrologyData?: RealAstrologyData | null
}

//  INTERFACES PARA DADOS REAIS
interface RealTransitData {
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
  contactIndex?: 1 | 2 | 3
}

interface RealSuggestionData {
  transitId: string
  suggestion: string
  action: string
  influencePeriod: string
  priority: 'alta' | 'media' | 'baixa'
  basedOn: string
}

interface RealCalculationData {
  formula: string
  breakdown: Array<{
    step: string
    value: number
    description: string
  }>
  total: number
  validation: string
  astrologicalBasis: string
  planetDetails?: Array<{
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

//  NOVAS INTERFACES PARA BREAKDOWN DETALHADO
interface PlanetBreakdown {
  planet: string
  dignityScore: number
  dignityReason: string
  houseScore: number
  houseReason: string
  natalAspects: Array<{
    with: string
    type: string
    orb: number
    score: number
    description: string
  }>
  accidentalConditions: Array<{
    condition: string
    score: number
    description: string
  }>
  totalScore: number
  percentageOfTotal: number
  //  NOVO: Breakdown detalhado com multiplicadores
  detailedBreakdown: {
    baseScore: number
    multipliers: Array<{
      name: string
      value: number
      description: string
      impact: string
    }>
    finalScore: number
    calculationSteps: string[]
  }
}

interface NatalAspectData {
  planet1: string
  planet2: string
  type: string
  orb: number
  score: number
  description: string
  isHarmonious: boolean
  isChallenging: boolean
  isNeutral: boolean
}

export const LifeAreaDetailModal: React.FC<LifeAreaDetailModalProps> = ({
  visible,
  onClose,
  areaData,
  astrologyData
}) => {
  if (!areaData) return null

  //  OBTER CORES E aCONES ESPECaFICOS DA aREA
  const areaColors = AREA_COLORS[areaData.name] || ['#4B5563', '#6B7280']
  const areaIcon = AREA_ICONS[areaData.name] || 'help-circle'
  const headerGradient = [areaColors[0], areaColors[1]]

  //  DADOS REAIS DO ENGINE ASTROLa“GICO
  const getActiveTransits = (): RealTransitData[] => {
    if (!astrologyData?.transits?.byArea) return []
    
    const areaTransits = astrologyData.transits.byArea[areaData.name] || []
    return areaTransits.map(transit => ({
      transitPlanet: transit.transitPlanet,
      natalPlanet: transit.natalPlanet,
      type: transit.type,
      orb: transit.orb,
      isApplying: transit.isApplying,
      strength: transit.strength,
      natalHouseImpacted: transit.natalHouseImpacted,
      durationClass: transit.durationClass
    })).sort((a, b) => b.strength - a.strength) // Ordena por forca
  }

  const getNatalAspects = (): NatalAspectData[] => {
    const debugData = astrologyData?.debug?.lifeAreas?.[areaData.name]
    if (!debugData?.planetDetails) return []

    const results: NatalAspectData[] = []
    
    // Buscar aspectos entre planetas que afetam esta area
    debugData.planetDetails.forEach(planet => {
      const planetAspects = Array.isArray(planet.aspects) ? planet.aspects : []
      planetAspects.forEach(aspect => {
        //  CORRECAO: Classificacao baseada no TIPO, nao no score
        const isHarmonious = ['trigono', 'sextil'].includes(aspect.type)
        const isChallenging = ['quadratura', 'oposicao', 'quincuncio', 'semiquadratura', 'sesquiquadratura'].includes(aspect.type)
        const isNeutral = aspect.type === 'conjuncao'
        
        results.push({
          planet1: planet.planet,
          planet2: aspect.with,
          type: aspect.type,
          orb: aspect.orb,
          score: aspect.finalScore,
          description: `${planet.planet} em ${aspect.type} com ${aspect.with}`,
          isHarmonious,
          isChallenging,
          isNeutral
        })
      })
    })

    return results.sort((a, b) => b.score - a.score)
  }

  const getDetailedPlanetBreakdown = (): PlanetBreakdown[] => {
    const debugData = astrologyData?.debug?.lifeAreas?.[areaData.name]
    if (!debugData?.planetDetails) return []

    const totalScore = debugData.finalScore || areaData.status
    
    return debugData.planetDetails.map(planet => {
      const planetTotal = planet.total || 0
      const percentageOfTotal = totalScore > 0 ? (planetTotal / totalScore) * 100 : 0
      const aspects = Array.isArray(planet.aspects) ? planet.aspects : []

      //  CALCULAR BREAKDOWN DETALHADO COM MULTIPLICADORES
      const breakdownDetails = calculateDetailedBreakdown(planet, debugData.planetDetails)

      return {
        planet: planet.planet,
        dignityScore: planet.signScore || 0,
        dignityReason: getDignityReason(planet.planet, planet.signScore || 0),
        houseScore: planet.houseScore || 0,
        houseReason: getHouseReason(planet.houseScore || 0),
        natalAspects: aspects.map(aspect => ({
          with: aspect.with,
          type: aspect.type,
          orb: aspect.orb,
          score: aspect.finalScore || 0,
          description: `${planet.planet} em ${aspect.type} com ${aspect.with}`
        })),
        accidentalConditions: getAccidentalConditions(planet.planet, planet.conditions),
        totalScore: planetTotal,
        percentageOfTotal: Math.round(percentageOfTotal),
        //  NOVO: Breakdown detalhado com multiplicadores
        detailedBreakdown: breakdownDetails
      }
    }).sort((a, b) => b.totalScore - a.totalScore)
  }

  //  FUNCOES AUXILIARES PARA EXPLICACOES
  const getDignityReason = (planet: string, score: number): string => {
    if (score >= 45) return 'Domicilio (+28) + Exaltacao (+24)'
    if (score >= 28) return 'Domicilio (+28)'
    if (score >= 24) return 'Exaltacao (+24)'
    if (score >= 15) return 'Termo (+15)'
    if (score >= 10) return 'Face (+10)'
    if (score >= 5) return 'Peregrino (+5)'
    return 'Detrimento/Fall (0)'
  }

  const getHouseReason = (score: number): string => {
    if (score >= 15) return 'Casa Angular (+15)'
    if (score >= 10) return 'Casa Succedente (+10)'
    if (score >= 5) return 'Casa Cadente (+5)'
    return 'Sem influencia da casa (0)'
  }

  const getAccidentalConditions = (planet: string, conditions?: { modifier: number; tags: string[] }): Array<{ condition: string; score: number; description: string }> => {
    if (!conditions) return []
    
    const conditionsList: Array<{ condition: string; score: number; description: string }> = []
    
    if (conditions.modifier !== 0) {
      conditionsList.push({
        condition: 'Modificador',
        score: conditions.modifier,
        description: `Condições acidentais de ${planet}`
      })
    }

    const tags = Array.isArray(conditions.tags) ? conditions.tags : []
    tags.forEach(tag => {
      conditionsList.push({
        condition: tag,
        score: 2,
        description: `Tag: ${tag}`
      })
    })

    return conditionsList
  }

  //  FUNCOES AUXILIARES PARA CALCULOS ASTROLOGICOS
  const getRelevantHousesForArea = (areaName: string): number[] => {
    const areaConfig: Record<string, number[]> = {
      amor: [5, 7],
      carreira: [10, 6],
      financas: [2, 8],
      saude: [1, 6],
      familia: [4, 10],
      espiritualidade: [9, 12],
      comunicacao: [3, 9],
      transformacao: [8, 12]
    }
    return areaConfig[areaName] || []
  }

  const getHouseAngularMultiplier = (house: number): number => {
    const angular = [1, 4, 7, 10]
    const succedent = [2, 5, 8, 11]
    const cadent = [3, 6, 9, 12]
    if (angular.includes(house)) return 1.05
    if (succedent.includes(house)) return 0.9
    if (cadent.includes(house)) return 0.8
    return 1.0
  }

  const getReceptionMultiplier = (transit: any, natal: any): number => {
    if (!transit || !natal) return 1.0
    // Simplificado para demonstracao
    return 1.0
  }

  const getPatternMultiplier = (planet: any, allPlanets: any[]): number => {
    // Simplificado para demonstracao
    return 1.0
  }

  const getClusterMultiplier = (planet: any, allPlanets: any[]): number => {
    // Simplificado para demonstracao
    return 1.0
  }

  const getPlanetDurationWeight = (transitName: string, natalName: string): number => {
    const slow: Record<string, number> = { Jupiter:1.1, Saturn:1.2, Uranus:1.25, Neptune:1.25, Pluto:1.25 }
    const fast: Record<string, number> = { Moon:0.85, Mercury:0.9 }
    let w = 1.0
    if (slow[transitName]) w *= slow[transitName]
    if (fast[transitName]) w *= fast[transitName]
    return w
  }

  const calculateBeneficMaleficDelta = (planet: any): number => {
    // Simplificado para demonstracao
    return 0
  }

  //  NOVA FUNCAO: CALCULAR BREAKDOWN DETALHADO COM MULTIPLICADORES
  const calculateDetailedBreakdown = (planet: any, allPlanets: any[]) => {
    const baseScore = (planet.signScore || 0) + (planet.houseScore || 0)
    const multipliers: Array<{ name: string; value: number; description: string; impact: string }> = []
    const calculationSteps: string[] = []
    
    //  MULTIPLICADOR 1: Peso do Planeta (importancia astrologica)
    const planetWeights: Record<string, number> = {
      'Sun': 1.2, 'Moon': 1.2,        // Luminares (maxima importancia)
      'Mercury': 1.0, 'Venus': 1.0, 'Mars': 1.0,  // Pessoais
      'Jupiter': 1.1, 'Saturn': 1.1,              // Sociais
      'Uranus': 0.9, 'Neptune': 0.9, 'Pluto': 0.9 // Transpessoais
    }
    const planetWeight = planetWeights[planet.planet] || 1.0
    if (planetWeight !== 1.0) {
      multipliers.push({
        name: 'Peso do Planeta',
        value: planetWeight,
        description: `${planet.planet} tem peso ${planetWeight > 1 ? 'elevado' : 'reduzido'} na astrologia`,
        impact: planetWeight > 1 ? 'Aumenta' : 'Reduz'
      })
      calculationSteps.push(`Peso do planeta: ${planetWeight}`)
    }

    //  MULTIPLICADOR 2: Relevancia da Casa
    const relevantHouses = getRelevantHousesForArea(areaData.name)
    const transitInRelevantHouse = relevantHouses.includes(planet.house || 0)
    const relevantHouseBoost = transitInRelevantHouse ? 1.10 : 1.0
    if (relevantHouseBoost > 1.0) {
      multipliers.push({
        name: 'Casa Relevante',
        value: relevantHouseBoost,
        description: `Transito na casa ${planet.house} (relevante para ${areaData.name})`,
        impact: 'Aumenta'
      })
      calculationSteps.push(`Casa relevante: a—${relevantHouseBoost}`)
    }

    //  MULTIPLICADOR 3: Regencia de Casa
    const houseRulers: Record<number, string[]> = {
      1:['Mars'], 2:['Venus'], 3:['Mercury'], 4:['Moon'], 5:['Sun'], 6:['Mercury'], 
      7:['Venus'], 8:['Mars'], 9:['Jupiter'], 10:['Saturn'], 11:['Saturn','Uranus'], 12:['Jupiter','Neptune']
    }
    const areaRulers = new Set(relevantHouses.flatMap((h: number) => houseRulers[h] || []))
    const rulerBoost = areaRulers.has(planet.planet) ? 1.06 : 1.0
    if (rulerBoost > 1.0) {
      multipliers.push({
        name: 'Regencia de Casa',
        value: rulerBoost,
        description: `${planet.planet} rege uma das casas da area ${areaData.name}`,
        impact: 'Aumenta'
      })
      calculationSteps.push(`Regencia de casa: a—${rulerBoost}`)
    }

    //  MULTIPLICADOR 4: Angularidade da Casa
    const angularMult = getHouseAngularMultiplier(planet.house || 0)
    if (angularMult !== 1.0) {
      multipliers.push({
        name: 'Angularidade da Casa',
        value: angularMult,
        description: `Casa ${planet.house} e ${angularMult > 1 ? 'angular' : angularMult < 1 ? 'cadente' : 'succedente'}`,
        impact: angularMult > 1 ? 'Aumenta' : 'Reduz'
      })
      calculationSteps.push(`Angularidade: a—${angularMult}`)
    }

    //  MULTIPLICADOR 5: Recepcao Mutua
    const receptionMult = getReceptionMultiplier(planet, allPlanets.find(p => p.planet === planet.planet))
    if (receptionMult !== 1.0) {
      multipliers.push({
        name: 'Recepcao Mutua',
        value: receptionMult,
        description: receptionMult > 1 ? 'Planetas em dignidades mutuas' : 'Planetas em detrimentos mutuos',
        impact: receptionMult > 1 ? 'Aumenta' : 'Reduz'
      })
      calculationSteps.push(`Recepcao: a—${receptionMult}`)
    }

    //  MULTIPLICADOR 6: Padroes Aspectuais
    const patternMult = getPatternMultiplier(planet, allPlanets)
    if (patternMult > 1.0) {
      multipliers.push({
        name: 'Padroes Aspectuais',
        value: patternMult,
        description: 'T-Square, Grande Trigono ou Yod detectado',
        impact: 'Aumenta'
      })
      calculationSteps.push(`Padroes: a—${patternMult}`)
    }

    //  MULTIPLICADOR 7: Cluster de Aspectos
    const clusterMult = getClusterMultiplier(planet, allPlanets)
    if (clusterMult > 1.0) {
      multipliers.push({
        name: 'Cluster de Aspectos',
        value: clusterMult,
        description: 'Multiplos aspectos com o mesmo planeta natal',
        impact: 'Aumenta'
      })
      calculationSteps.push(`Cluster: a—${clusterMult}`)
    }

    //  MULTIPLICADOR 8: Peso por Duracao
    const durationWeight = getPlanetDurationWeight(planet.planet, planet.aspects[0]?.with || '')
    if (durationWeight !== 1.0) {
      multipliers.push({
        name: 'Peso por Duracao',
        value: durationWeight,
        description: durationWeight > 1 ? 'Planeta lento (maior influencia)' : 'Planeta rapido (menor influencia)',
        impact: durationWeight > 1 ? 'Aumenta' : 'Reduz'
      })
      calculationSteps.push(`Duracao: a—${durationWeight}`)
    }

    //  CALCULAR SCORE FINAL
    let finalScore = baseScore
    calculationSteps.push(`Score base: ${baseScore}`)
    
    multipliers.forEach(mult => {
      finalScore *= mult.value
      calculationSteps.push(`${mult.name}: ${finalScore.toFixed(2)}`)
    })

    //  ADICIONAR DELTAS DE BENa‰FICOS/MALa‰FICOS
    const beneficMaleficDelta = calculateBeneficMaleficDelta(planet)
    if (beneficMaleficDelta !== 0) {
      finalScore += beneficMaleficDelta
      calculationSteps.push(`Delta benefico/malefico: ${finalScore.toFixed(2)}`)
    }

    return {
      baseScore,
      multipliers,
      finalScore: Math.round(finalScore * 100) / 100,
      calculationSteps
    }
  }

  const getRealSuggestions = (): RealSuggestionData[] => {
    const transits = activeTransits
    const aspects = natalAspects
    
    const suggestions: RealSuggestionData[] = []

    // Sugestões baseadas em transitos ativos
    transits.forEach((transit, index) => {
      //  CORRECAO: Classificacao mais abrangente
      const isHarmonious = ['trigono', 'sextil'].includes(transit.type)
      const isChallenging = ['quadratura', 'oposicao', 'quincuncio', 'semiquadratura', 'sesquiquadratura'].includes(transit.type)
      const isNeutral = transit.type === 'conjuncao'

      let suggestion = ''
      let action = ''
      let priority: 'alta' | 'media' | 'baixa' = 'alta'

      if (isHarmonious) {
        suggestion = `Aproveite a harmonia entre ${transit.transitPlanet} e ${transit.natalPlanet}`
        action = 'Iniciar projetos, expandir relacionamentos'
      } else if (isChallenging) {
        suggestion = `Gerencie a tensao entre ${transit.transitPlanet} e ${transit.natalPlanet}`
        action = 'Revisar planos, buscar equilibrio'
      } else if (isNeutral) {
        suggestion = `Integre as energias de ${transit.transitPlanet} e ${transit.natalPlanet}`
        action = 'Refletir, planejar, integrar'
      }

      const influencePeriod = transit.durationClass === 'longo' ? 'Meses' : 
                             transit.durationClass === 'medio' ? 'Semanas' : 'Dias'

      suggestions.push({
        transitId: `transit-${transit.transitPlanet}-${transit.natalPlanet}-${transit.type}`,
        suggestion,
        action,
        influencePeriod,
        priority,
        basedOn: `Transito: ${transit.type} ${transit.transitPlanet} †’ ${transit.natalPlanet}`
      })
    })

    // Sugestões baseadas em aspectos natais
    aspects.forEach((aspect, index) => {
      //  CORRECAO: Sugestões baseadas na natureza real do aspecto
      const suggestion = aspect.isHarmonious 
        ? `Aproveite a harmonia do transito entre ${aspect.planet1} e ${aspect.planet2}`
        : aspect.isChallenging
        ? `Gerencie a tensao do transito entre ${aspect.planet1} e ${aspect.planet2}`
        : `Integre as energias do transito entre ${aspect.planet1} e ${aspect.planet2}`
      
      const action = aspect.isHarmonious
        ? 'Desenvolver talentos naturais, fortalecer relacionamentos'
        : aspect.isChallenging
        ? 'Trabalhar equilibrio, transformar desafios em oportunidades'
        : 'Refletir sobre a natureza da relacao entre estes planetas'

      suggestions.push({
        transitId: `natal-${aspect.planet1}-${aspect.planet2}-${aspect.type}`,
        suggestion,
        action,
                 influencePeriod: 'Variavel (Transito)',
         priority: 'media',
        basedOn: `Aspecto de Transito: ${aspect.type} ${aspect.planet1} †’ ${aspect.planet2}`
      })
    })

         return suggestions.sort((a, b) => {
       const priorityOrder = { alta: 3, media: 2, baixa: 1 }
       return priorityOrder[b.priority] - priorityOrder[a.priority]
     })
  }

  const getRealCalculations = (): RealCalculationData => {
    const transits = activeTransits
    const aspects = natalAspects
    const debugData = astrologyData?.debug?.lifeAreas?.[areaData.name]

    // Formula real baseada no RealAstrologyEngine
    const formula = 'Score final = soma(Peso do Planeta x (Dignidade + Casa + Aspectos + Condições))'

    // Breakdown real se disponivel
    let breakdown: Array<{ step: string; value: number; description: string }> = []
    let total = areaData.status

    if (debugData?.planetDetails) {
      breakdown = debugData.planetDetails.map(planet => ({
        step: `${planet.planet} (${planet.signScore} + ${planet.houseScore} + ${planet.aspects.length} aspectos)`,
        value: planet.total,
        description: `Dignidade: ${planet.signScore}, Casa: ${planet.houseScore}, Aspectos: ${planet.aspects.length}`
      }))
      total = debugData.finalScore
    } else {
      // Fallback baseado nos transitos
      breakdown = transits.map(transit => {
        const aspectValue = transit.strength * (transit.isApplying ? 1.15 : 0.95)
        return {
          step: `${transit.type} ${transit.transitPlanet} †’ ${transit.natalPlanet}`,
          value: Math.round(aspectValue),
          description: `Força: ${transit.strength}, Orb: ${transit.orb.toFixed(1)} graus, ${transit.isApplying ? 'Aplicante' : 'Separando'}`
        }
      })
    }

    const validation = 'Score calculado com base em dignidades essenciais, forca das casas, aspectos planetarios e condicoes acidentais.'
    
    const astrologicalBasis = 'A pontuacao considera a tradicao astrologica classica: domicilios (+28), exaltacoes (+24), casas angulares (+15), aspectos harmonicos (trigonos/sextis) e desafiadores (quadraturas/oposicoes).'

    return {
      formula,
      breakdown,
      total: Math.round(total),
      validation,
      astrologicalBasis,
      planetDetails: debugData?.planetDetails
    }
  }

  const activeTransits = getActiveTransits()
  const natalAspects = getNatalAspects()
  const planetBreakdown = getDetailedPlanetBreakdown()
  const realSuggestions = getRealSuggestions()
  const realCalculations = getRealCalculations()

  const renderHeader = () => (
    <View style={[styles.header, { backgroundColor: headerGradient[0] }]}>
      <View style={styles.headerContent}>
        <View style={styles.headerLeft}>
          <Ionicons name={areaIcon as any} size={24} color={DESIGN_SYSTEM.colors.white} />
          <Text style={styles.areaName}>{areaData.name.toUpperCase()}</Text>
          <Text style={styles.areaScore}>{areaData.status}%</Text>
        </View>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={24} color={DESIGN_SYSTEM.colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  )

  const renderTransitsSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>TRANSITOS ATIVOS E ASPECTOS DE TRANSITO</Text>
      
      {/* Subsecao: Transitos Ativos */}
      <View style={styles.subsection}>
        <Text style={styles.subsectionTitle}>TRÂNSITOS ATIVOS</Text>
        
        {activeTransits.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Nenhum transito ativo para esta area no momento</Text>
          </View>
        ) : (
          activeTransits.map((transit, index) => {
            //  CORRECAO: Classificacao mais abrangente dos aspectos
            const isHarmonious = ['trigono', 'sextil'].includes(transit.type)
            const isChallenging = ['quadratura', 'oposicao', 'quincuncio', 'semiquadratura', 'sesquiquadratura'].includes(transit.type)
            const isNeutral = transit.type === 'conjuncao'
            
            //  CORRECAO: Cores e status baseados na natureza real
            let statusColor: string
            let statusText: string
            
            if (isHarmonious) {
              statusColor = DESIGN_SYSTEM.colors.positive
              statusText = 'Harmônico'
            } else if (isChallenging) {
        suggestion = `Gerencie a tensao entre ${transit.transitPlanet} e ${transit.natalPlanet}`
              statusText = 'Desafiador'
            } else if (isNeutral) {
              statusColor = DESIGN_SYSTEM.colors.neutral
              statusText = 'Neutro'
            } else {
              statusColor = DESIGN_SYSTEM.colors.secondary
              statusText = 'Neutro'
            }

            return (
              <View key={`transit-${transit.transitPlanet}-${transit.natalPlanet}-${transit.type}`} style={styles.transitCard}>
                <View style={styles.transitHeader}>
                  <Text style={styles.transitNumber}>#{index + 1}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
                    <Text style={styles.statusText}>
                      {statusText}
                    </Text>
                  </View>
                </View>
                
                                 <Text style={styles.transitName}>
                   {translate('planets', transit.transitPlanet)} em {translate('aspects', transit.type)} com {translate('planets', transit.natalPlanet)}
                 </Text>
                
                <View style={styles.transitDetails}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Força:</Text>
                    <Text style={styles.detailValue}>{transit.strength}</Text>
                    <View style={[styles.strengthBar, { backgroundColor: DESIGN_SYSTEM.colors.border }]}>
                      <View style={[styles.strengthFill, { 
                        width: `${transit.strength}%`, 
                        backgroundColor: statusColor 
                      }]} />
                    </View>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Orb:</Text>
                    <Text style={styles.detailValue}>{transit.orb.toFixed(1)} graus</Text>
                  </View>
                  
                                     <View style={styles.detailRow}>
                     <Text style={styles.detailLabel}>Planetas:</Text>
                     <Text style={styles.detailValue}>{translate('planets', transit.transitPlanet)} + {translate('planets', transit.natalPlanet)}</Text>
                   </View>
                   
                   <View style={styles.detailRow}>
                     <Text style={styles.detailLabel}>Tipo:</Text>
                     <Text style={styles.detailValue}>{translate('aspects', transit.type)}</Text>
                   </View>
                  
                                     <View style={styles.detailRow}>
                     <Text style={styles.detailLabel}>Casa:</Text>
                     <Text style={styles.detailValue}>
                       {transit.natalHouseImpacted} ({TRANSLATIONS.houses[transit.natalHouseImpacted as keyof typeof TRANSLATIONS.houses]})
                     </Text>
                   </View>
                   
                   <View style={styles.detailRow}>
                     <Text style={styles.detailLabel}>Duracao:</Text>
                     <Text style={styles.detailValue}>
                       {getTransitDuration(transit)}
                     </Text>
                   </View>
                   
                   <View style={styles.detailRow}>
                     <Text style={styles.detailLabel}>Contribuicao:</Text>
                     <Text style={styles.detailValue}>
                       {Math.round((transit.strength / activeTransits.reduce((sum, t) => sum + t.strength, 0)) * 100)}%
                     </Text>
                   </View>
                </View>
              </View>
            )
          })
        )}
      </View>

      {/* Subsecao: Aspectos Natais */}
      <View style={styles.subsection}>
        <Text style={styles.subsectionTitle}>ASPECTOS DE TRANSITO RELEVANTES</Text>
        
        {natalAspects.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Nenhum aspecto de transito relevante para esta area</Text>
          </View>
        ) : (
          natalAspects.map((aspect, index) => {
            //  CORRECAO: Cores e status baseados na natureza real do aspecto
            let statusColor: string
            let statusText: string
            
            if (aspect.isHarmonious) {
              statusColor = DESIGN_SYSTEM.colors.positive
              statusText = 'Harmônico'
            } else if (aspect.isChallenging) {
              statusColor = DESIGN_SYSTEM.colors.negative
              statusText = 'Desafiador'
            } else if (aspect.isNeutral) {
              statusColor = DESIGN_SYSTEM.colors.neutral
              statusText = 'Neutro'
            } else {
              statusColor = DESIGN_SYSTEM.colors.secondary
              statusText = 'Neutro'
            }

            return (
              <View key={`natal-${aspect.planet1}-${aspect.planet2}-${aspect.type}`} style={styles.transitCard}>
                <View style={styles.transitHeader}>
                  <Text style={styles.transitNumber}>#{index + 1}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
                    <Text style={styles.statusText}>
                      {statusText}
                    </Text>
                  </View>
                </View>
                
                                 <Text style={styles.transitName}>
                   {translate('planets', aspect.planet1)} em {translate('aspects', aspect.type)} com {translate('planets', aspect.planet2)}
                 </Text>
                
                <View style={styles.transitDetails}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Força:</Text>
                    <Text style={styles.detailValue}>{aspect.score}</Text>
                    <View style={[styles.strengthBar, { backgroundColor: DESIGN_SYSTEM.colors.border }]}>
                      <View style={[styles.strengthFill, { 
                        width: `${Math.min(aspect.score, 100)}%`, 
                        backgroundColor: statusColor 
                      }]} />
                    </View>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Orb:</Text>
                    <Text style={styles.detailValue}>{aspect.orb.toFixed(1)} graus</Text>
                  </View>
                  
                                     <View style={styles.detailRow}>
                     <Text style={styles.detailLabel}>Planetas:</Text>
                     <Text style={styles.detailValue}>{translate('planets', aspect.planet1)} + {translate('planets', aspect.planet2)}</Text>
                   </View>
                   
                   <View style={styles.detailRow}>
                     <Text style={styles.detailLabel}>Tipo:</Text>
                     <Text style={styles.detailValue}>{translate('aspects', aspect.type)}</Text>
                   </View>
                  
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Natureza:</Text>
                    <Text style={styles.detailValue}>
                      {aspect.isHarmonious ? 'Harmônico' : 'Neutro'}
                    </Text>
                  </View>
                </View>
              </View>
            )
          })
        )}
      </View>
    </View>
  )

  const renderSuggestionsSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>SUGESTÕES ESPECÍFICAS POR TRÂNSITO</Text>
      
      {realSuggestions.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Nenhuma sugestao disponivel no momento</Text>
        </View>
      ) : (
        realSuggestions.map((suggestion, index) => (
          <View key={suggestion.transitId} style={styles.suggestionCard}>
            <View style={styles.suggestionHeader}>
              <Text style={styles.suggestionNumber}>#{index + 1}</Text>
                             <View style={[styles.priorityBadge, { 
                 backgroundColor: suggestion.priority === 'alta' ? DESIGN_SYSTEM.colors.warning : 
                                suggestion.priority === 'media' ? DESIGN_SYSTEM.colors.info : 
                                DESIGN_SYSTEM.colors.secondary 
               }]}>
                 <Text style={styles.priorityText}>{suggestion.priority.toUpperCase()}</Text>
               </View>
            </View>
            
            <Text style={styles.suggestionText}>{suggestion.suggestion}</Text>
            <Text style={styles.actionText}>Ação: {suggestion.action}</Text>
            <Text style={styles.periodText}>Período: {suggestion.influencePeriod}</Text>
            <Text style={styles.basedOnText}>Baseado em: {suggestion.basedOn}</Text>
          </View>
        ))
      )}
    </View>
  )

  const renderCalculationsSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>CaLCULOS Ta‰CNICOS E BASE ASTROLa“GICA</Text>
      
      <View style={styles.calculationCard}>
        <Text style={styles.formulaTitle}>Formula de Cálculo:</Text>
        <Text style={styles.formulaText}>{realCalculations.formula}</Text>
        
        <Text style={styles.breakdownTitle}>Breakdown Matematico Detalhado:</Text>
        
        {/* Breakdown em arvore por Planeta */}
        {planetBreakdown.map((planet, index) => (
          <View key={planet.planet} style={styles.planetBreakdownCard}>
            <View style={styles.planetHeader}>
              <Text style={styles.planetName}>{planet.planet}</Text>
              <Text style={styles.planetTotal}>{planet.totalScore} pts</Text>
              <Text style={styles.planetPercentage}>({planet.percentageOfTotal}%)</Text>
            </View>
            
            {/* Dignidade Essencial */}
            <View style={styles.breakdownRow}>
              <View style={styles.breakdownLabel}>
                <Text style={styles.breakdownLabelText}>Dignidade essencial:</Text>
              </View>
              <View style={styles.breakdownValue}>
                <Text style={styles.breakdownValueText}>+{planet.dignityScore}</Text>
              </View>
              <View style={styles.breakdownReason}>
                <Text style={styles.breakdownReasonText}>{planet.dignityReason}</Text>
              </View>
            </View>
            
            {/* Força da Casa */}
            <View style={styles.breakdownRow}>
              <View style={styles.breakdownLabel}>
                <Text style={styles.breakdownLabelText}>Força da casa:</Text>
              </View>
              <View style={styles.breakdownValue}>
                <Text style={styles.breakdownValueText}>+{planet.houseScore}</Text>
              </View>
              <View style={styles.breakdownReason}>
                <Text style={styles.breakdownReasonText}>{planet.houseReason}</Text>
              </View>
            </View>
            
            {/* Aspectos Natais */}
            {planet.natalAspects.length > 0 && (
              <View style={styles.aspectsSection}>
                <Text style={styles.aspectsTitle}>Aspectos de trânsito:</Text>
                {planet.natalAspects.map((aspect, aspectIndex) => {
                  //  CORRECAO: Mostrar natureza real do aspecto
                  const isHarmonious = ['trigono', 'sextil'].includes(aspect.type)
                  const isChallenging = ['quadratura', 'oposicao', 'quincuncio', 'semiquadratura', 'sesquiquadratura'].includes(aspect.type)
                  
                  let aspectIcon = 'šª'
                  let aspectColor = DESIGN_SYSTEM.colors.secondary
                  
                  if (isHarmonious) {
                    aspectIcon = '✓'
                    aspectColor = DESIGN_SYSTEM.colors.positive
                  } else if (isChallenging) {
        suggestion = `Gerencie a tensao entre ${transit.transitPlanet} e ${transit.natalPlanet}`
                    aspectColor = DESIGN_SYSTEM.colors.negative
                  }
                  
                  return (
                    <View key={aspectIndex} style={styles.aspectRow}>
                      <View style={styles.aspectLabel}>
                                                 <Text style={styles.aspectLabelText}>
                           {aspectIcon} {translate('aspects', aspect.type)} com {translate('planets', aspect.with)}:
                         </Text>
                      </View>
                      <View style={styles.aspectValue}>
                        <Text style={[styles.aspectValueText, { color: aspectColor }]}>
                          {isChallenging ? '-' : '+'}{Math.abs(aspect.score)}
                        </Text>
                      </View>
                      <View style={styles.aspectDescription}>
                        <Text style={styles.aspectDescriptionText}>
                          Orb: {aspect.orb.toFixed(1)} graus - {isHarmonious ? 'Harmônico' : isChallenging ? 'Desafiador' : 'Neutro'}
                        </Text>
                      </View>
                    </View>
                  )
                })}
              </View>
            )}
            
            {/* Condições Acidentais */}
            {planet.accidentalConditions.length > 0 && (
              <View style={styles.conditionsSection}>
                <Text style={styles.conditionsTitle}>Condições acidentais:</Text>
                {planet.accidentalConditions.map((condition, conditionIndex) => (
                  <View key={conditionIndex} style={styles.conditionRow}>
                    <View style={styles.conditionLabel}>
                      <Text style={styles.conditionLabelText}>
                        {condition.condition}:
                      </Text>
                    </View>
                    <View style={styles.conditionValue}>
                      <Text style={styles.conditionValueText}>+{condition.score}</Text>
                    </View>
                    <View style={styles.conditionDescription}>
                      <Text style={styles.conditionDescriptionText}>
                        {condition.description}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
            
                         {/* Total do Planeta */}
             <View style={styles.planetTotalRow}>
               <Text style={styles.planetTotalLabel}>Total {planet.planet}:</Text>
               <Text style={styles.planetTotalValue}>{planet.totalScore} pontos</Text>
             </View>

             {/*  NOVO: BREAKDOWN DETALHADO COM MULTIPLICADORES */}
             {planet.detailedBreakdown && (
               <View style={styles.detailedBreakdownSection}>
                 <Text style={styles.detailedBreakdownTitle}>Cálculo detalhado:</Text>
                 
                 {/* Score Base */}
                 <View style={styles.breakdownRow}>
                   <View style={styles.breakdownLabel}>
                     <Text style={styles.breakdownLabelText}>Score base:</Text>
                   </View>
                   <View style={styles.breakdownValue}>
                     <Text style={styles.breakdownValueText}>+{planet.detailedBreakdown.baseScore}</Text>
                   </View>
                   <View style={styles.breakdownReason}>
                     <Text style={styles.breakdownReasonText}>
                       Dignidade ({planet.dignityScore}) + Casa ({planet.houseScore})
                     </Text>
                   </View>
                 </View>

                 {/* Multiplicadores */}
                 {planet.detailedBreakdown.multipliers.map((mult, multIndex) => (
                   <View key={multIndex} style={styles.multiplierRow}>
                     <View style={styles.multiplierLabel}>
                       <Text style={styles.multiplierLabelText}>
                         {mult.impact === 'Aumenta' ? '+' : '-'} {mult.name}:
                       </Text>
                     </View>
                     <View style={styles.multiplierValue}>
                       <Text style={[styles.multiplierValueText, { 
                         color: mult.impact === 'Aumenta' ? DESIGN_SYSTEM.colors.positive : DESIGN_SYSTEM.colors.negative 
                       }]}>
                         a—{mult.value}
                       </Text>
                     </View>
                     <View style={styles.multiplierDescription}>
                       <Text style={styles.multiplierDescriptionText}>
                         {mult.description}
                       </Text>
                     </View>
                   </View>
                 ))}

                 {/* Passos do Cálculo */}
                 <View style={styles.calculationStepsSection}>
                   <Text style={styles.calculationStepsTitle}>Passos do cálculo:</Text>
                   {planet.detailedBreakdown.calculationSteps.map((step, stepIndex) => (
                     <Text key={stepIndex} style={styles.calculationStepText}>
                       {stepIndex + 1}. {step}
                     </Text>
                   ))}
                 </View>

                 {/* Score Final */}
                 <View style={styles.finalScoreRow}>
                   <Text style={styles.finalScoreLabel}> Score Final:</Text>
                   <Text style={styles.finalScoreValue}>
                     {planet.detailedBreakdown.finalScore} pontos
                   </Text>
                 </View>
               </View>
             )}
          </View>
        ))}
        
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Geral:</Text>
          <Text style={styles.totalValue}>{realCalculations.total}</Text>
        </View>
        
        <Text style={styles.validationTitle}>Validação:</Text>
        <Text style={styles.validationText}>{realCalculations.validation}</Text>
        
        <Text style={styles.basisTitle}>Base Astrológica:</Text>
        <Text style={styles.basisText}>{realCalculations.astrologicalBasis}</Text>
        
        {/*  NOTA EXPLICATIVA SOBRE SCORES */}
        <View style={styles.explanationCard}>
          <Text style={styles.explanationTitle}>„¹ï¸ Como Interpretar os Scores:</Text>
          <Text style={styles.explanationText}>
            - <Text style={{ color: DESIGN_SYSTEM.colors.positive }}>Scores positivos</Text> indicam influências favoráveis
          </Text>
          <Text style={styles.explanationText}>
            - <Text style={{ color: DESIGN_SYSTEM.colors.negative }}>Scores negativos</Text> indicam desafios a serem superados
          </Text>
          <Text style={styles.explanationText}>
            - <Text style={{ color: DESIGN_SYSTEM.colors.neutral }}>Scores neutros</Text> indicam influências equilibradas
          </Text>
          <Text style={styles.explanationText}>
            - A <Text style={{ fontWeight: 'bold' }}>natureza do aspecto</Text> (Harmônico/Desafiador/Neutro) é baseada no tipo astrológico, não no score numérico
          </Text>
        </View>
      </View>
    </View>
  )

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {renderHeader()}
          <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {renderTransitsSection()}
            {renderSuggestionsSection()}
            {renderCalculationsSection()}
          </ScrollView>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: DESIGN_SYSTEM.colors.white,
    borderTopLeftRadius: DESIGN_SYSTEM.borderRadius.lg,
    borderTopRightRadius: DESIGN_SYSTEM.borderRadius.lg,
    maxHeight: height * 0.9,
    minHeight: height * 0.6
  },
  header: {
    height: 60,
    borderTopLeftRadius: DESIGN_SYSTEM.borderRadius.lg,
    borderTopRightRadius: DESIGN_SYSTEM.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: DESIGN_SYSTEM.spacing.md
  },
  closeButton: {
    padding: DESIGN_SYSTEM.spacing.sm,
    borderRadius: DESIGN_SYSTEM.borderRadius.sm
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DESIGN_SYSTEM.spacing.sm
  },
  areaName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: DESIGN_SYSTEM.colors.white,
    textAlign: 'center'
  },
  areaScore: {
    fontSize: 16,
    fontWeight: '600',
    color: DESIGN_SYSTEM.colors.white,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: DESIGN_SYSTEM.spacing.sm,
    paddingVertical: 4,
    borderRadius: DESIGN_SYSTEM.borderRadius.sm
  },
  scrollContent: {
    padding: DESIGN_SYSTEM.spacing.md
  },
  section: {
    marginBottom: DESIGN_SYSTEM.spacing.xl
  },
  subsection: {
    marginBottom: DESIGN_SYSTEM.spacing.lg,
    padding: DESIGN_SYSTEM.spacing.md,
    backgroundColor: DESIGN_SYSTEM.colors.light,
    borderRadius: DESIGN_SYSTEM.borderRadius.md
  },
  subsectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: DESIGN_SYSTEM.colors.primary,
    marginBottom: DESIGN_SYSTEM.spacing.md,
    textAlign: 'center'
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: DESIGN_SYSTEM.colors.primary,
    marginBottom: DESIGN_SYSTEM.spacing.md,
    textAlign: 'center',
    backgroundColor: DESIGN_SYSTEM.colors.light,
    padding: DESIGN_SYSTEM.spacing.sm,
    borderRadius: DESIGN_SYSTEM.borderRadius.sm
  },
  emptyState: {
    padding: DESIGN_SYSTEM.spacing.lg,
    alignItems: 'center',
    backgroundColor: DESIGN_SYSTEM.colors.light,
    borderRadius: DESIGN_SYSTEM.borderRadius.md
  },
  emptyText: {
    color: DESIGN_SYSTEM.colors.secondary,
    textAlign: 'center',
    fontSize: 14
  },
  transitCard: {
    backgroundColor: DESIGN_SYSTEM.colors.white,
    padding: DESIGN_SYSTEM.spacing.md,
    borderRadius: DESIGN_SYSTEM.borderRadius.md,
    marginBottom: DESIGN_SYSTEM.spacing.md,
    ...DESIGN_SYSTEM.shadows.card
  },
  transitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: DESIGN_SYSTEM.spacing.sm
  },
  transitNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: DESIGN_SYSTEM.colors.primary,
    backgroundColor: DESIGN_SYSTEM.colors.light,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: DESIGN_SYSTEM.borderRadius.sm
  },
  statusBadge: {
    paddingHorizontal: DESIGN_SYSTEM.spacing.sm,
    paddingVertical: 4,
    borderRadius: DESIGN_SYSTEM.borderRadius.sm
  },
  statusText: {
    color: DESIGN_SYSTEM.colors.white,
    fontSize: 12,
    fontWeight: 'bold'
  },
  transitName: {
    fontSize: 16,
    fontWeight: '600',
    color: DESIGN_SYSTEM.colors.primary,
    marginBottom: DESIGN_SYSTEM.spacing.md
  },
  transitDetails: {
    gap: DESIGN_SYSTEM.spacing.sm
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DESIGN_SYSTEM.spacing.sm
  },
  detailLabel: {
    fontSize: 14,
    color: DESIGN_SYSTEM.colors.secondary,
    minWidth: 80
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: DESIGN_SYSTEM.colors.primary,
    minWidth: 40
  },
  strengthBar: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: 'hidden'
  },
  strengthFill: {
    height: '100%',
    borderRadius: 4
  },
  suggestionCard: {
    backgroundColor: DESIGN_SYSTEM.colors.white,
    padding: DESIGN_SYSTEM.spacing.md,
    borderRadius: DESIGN_SYSTEM.borderRadius.md,
    marginBottom: DESIGN_SYSTEM.spacing.md,
    ...DESIGN_SYSTEM.shadows.card
  },
  suggestionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: DESIGN_SYSTEM.spacing.sm
  },
  suggestionNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: DESIGN_SYSTEM.colors.primary,
    backgroundColor: DESIGN_SYSTEM.colors.light,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: DESIGN_SYSTEM.borderRadius.sm
  },
  priorityBadge: {
    paddingHorizontal: DESIGN_SYSTEM.spacing.sm,
    paddingVertical: 4,
    borderRadius: DESIGN_SYSTEM.borderRadius.sm
  },
  priorityText: {
    color: DESIGN_SYSTEM.colors.white,
    fontSize: 12,
    fontWeight: 'bold'
  },
  suggestionText: {
    fontSize: 16,
    fontWeight: '600',
    color: DESIGN_SYSTEM.colors.primary,
    marginBottom: DESIGN_SYSTEM.spacing.sm
  },
  actionText: {
    fontSize: 14,
    color: DESIGN_SYSTEM.colors.secondary,
    marginBottom: DESIGN_SYSTEM.spacing.xs
  },
  periodText: {
    fontSize: 14,
    color: DESIGN_SYSTEM.colors.secondary,
    marginBottom: DESIGN_SYSTEM.spacing.xs
  },
  basedOnText: {
    fontSize: 12,
    color: DESIGN_SYSTEM.colors.secondary,
    fontStyle: 'italic'
  },
  calculationCard: {
    backgroundColor: DESIGN_SYSTEM.colors.white,
    padding: DESIGN_SYSTEM.spacing.md,
    borderRadius: DESIGN_SYSTEM.borderRadius.md,
    ...DESIGN_SYSTEM.shadows.card
  },
  formulaTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: DESIGN_SYSTEM.colors.primary,
    marginBottom: DESIGN_SYSTEM.spacing.sm
  },
  formulaText: {
    fontSize: 14,
    color: DESIGN_SYSTEM.colors.secondary,
    marginBottom: DESIGN_SYSTEM.spacing.md,
    fontFamily: 'monospace',
    backgroundColor: DESIGN_SYSTEM.colors.light,
    padding: DESIGN_SYSTEM.spacing.sm,
    borderRadius: DESIGN_SYSTEM.borderRadius.sm
  },
  breakdownTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: DESIGN_SYSTEM.colors.primary,
    marginBottom: DESIGN_SYSTEM.spacing.sm
  },
  breakdownStep: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: DESIGN_SYSTEM.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: DESIGN_SYSTEM.colors.border
  },
  stepName: {
    flex: 2,
    fontSize: 14,
    color: DESIGN_SYSTEM.colors.primary
  },
  stepValue: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: DESIGN_SYSTEM.colors.primary,
    textAlign: 'center'
  },
  stepDescription: {
    flex: 3,
    fontSize: 12,
    color: DESIGN_SYSTEM.colors.secondary
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: DESIGN_SYSTEM.spacing.md,
    borderTopWidth: 2,
    borderTopColor: DESIGN_SYSTEM.colors.primary,
    marginTop: DESIGN_SYSTEM.spacing.md
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: DESIGN_SYSTEM.colors.primary
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: DESIGN_SYSTEM.colors.primary
  },
  validationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: DESIGN_SYSTEM.colors.primary,
    marginTop: DESIGN_SYSTEM.spacing.md,
    marginBottom: DESIGN_SYSTEM.spacing.sm
  },
  validationText: {
    fontSize: 14,
    color: DESIGN_SYSTEM.colors.secondary,
    marginBottom: DESIGN_SYSTEM.spacing.md
  },
  basisTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: DESIGN_SYSTEM.colors.primary,
    marginBottom: DESIGN_SYSTEM.spacing.sm
  },
  basisText: {
    fontSize: 14,
    color: DESIGN_SYSTEM.colors.secondary,
    lineHeight: 20
  },

  //  ESTILOS PARA BREAKDOWN DETALHADO EM aRVORE
  planetBreakdownCard: {
    backgroundColor: DESIGN_SYSTEM.colors.white,
    padding: DESIGN_SYSTEM.spacing.md,
    borderRadius: DESIGN_SYSTEM.borderRadius.md,
    marginBottom: DESIGN_SYSTEM.spacing.md,
    borderWidth: 1,
    borderColor: DESIGN_SYSTEM.colors.border,
    ...DESIGN_SYSTEM.shadows.card
  },
  planetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: DESIGN_SYSTEM.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: DESIGN_SYSTEM.colors.border,
    marginBottom: DESIGN_SYSTEM.spacing.md
  },
  planetName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: DESIGN_SYSTEM.colors.primary
  },
  planetTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: DESIGN_SYSTEM.colors.positive
  },
  planetPercentage: {
    fontSize: 14,
    color: DESIGN_SYSTEM.colors.secondary
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: DESIGN_SYSTEM.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: DESIGN_SYSTEM.colors.light
  },
  breakdownLabel: {
    flex: 2,
    paddingRight: DESIGN_SYSTEM.spacing.sm
  },
  breakdownLabelText: {
    fontSize: 14,
    fontWeight: '600',
    color: DESIGN_SYSTEM.colors.primary
  },
  breakdownValue: {
    flex: 1,
    alignItems: 'center'
  },
  breakdownValueText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: DESIGN_SYSTEM.colors.positive
  },
  breakdownReason: {
    flex: 3,
    paddingLeft: DESIGN_SYSTEM.spacing.sm
  },
  breakdownReasonText: {
    fontSize: 12,
    color: DESIGN_SYSTEM.colors.secondary
  },
  aspectsSection: {
    marginTop: DESIGN_SYSTEM.spacing.sm,
    paddingTop: DESIGN_SYSTEM.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: DESIGN_SYSTEM.colors.light
  },
  aspectsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: DESIGN_SYSTEM.colors.primary,
    marginBottom: DESIGN_SYSTEM.spacing.sm
  },
  aspectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: DESIGN_SYSTEM.spacing.xs,
    paddingLeft: DESIGN_SYSTEM.spacing.md
  },
  aspectLabel: {
    flex: 2,
    paddingRight: DESIGN_SYSTEM.spacing.sm
  },
  aspectLabelText: {
    fontSize: 12,
    color: DESIGN_SYSTEM.colors.primary
  },
  aspectValue: {
    flex: 1,
    alignItems: 'center'
  },
  aspectValueText: {
    fontSize: 12,
    fontWeight: '600',
    color: DESIGN_SYSTEM.colors.positive
  },
  aspectDescription: {
    flex: 2,
    paddingLeft: DESIGN_SYSTEM.spacing.sm
  },
  aspectDescriptionText: {
    fontSize: 11,
    color: DESIGN_SYSTEM.colors.secondary
  },
  conditionsSection: {
    marginTop: DESIGN_SYSTEM.spacing.sm,
    paddingTop: DESIGN_SYSTEM.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: DESIGN_SYSTEM.colors.light
  },
  conditionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: DESIGN_SYSTEM.colors.primary,
    marginBottom: DESIGN_SYSTEM.spacing.sm
  },
  conditionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: DESIGN_SYSTEM.spacing.xs,
    paddingLeft: DESIGN_SYSTEM.spacing.md
  },
  conditionLabel: {
    flex: 2,
    paddingRight: DESIGN_SYSTEM.spacing.sm
  },
  conditionLabelText: {
    fontSize: 12,
    color: DESIGN_SYSTEM.colors.primary
  },
  conditionValue: {
    flex: 1,
    alignItems: 'center'
  },
  conditionValueText: {
    fontSize: 12,
    fontWeight: '600',
    color: DESIGN_SYSTEM.colors.warning
  },
  conditionDescription: {
    flex: 3,
    paddingLeft: DESIGN_SYSTEM.spacing.sm
  },
  conditionDescriptionText: {
    fontSize: 11,
    color: DESIGN_SYSTEM.colors.secondary
  },
  planetTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: DESIGN_SYSTEM.spacing.md,
    marginTop: DESIGN_SYSTEM.spacing.md,
    borderTopWidth: 2,
    borderTopColor: DESIGN_SYSTEM.colors.primary
  },
  planetTotalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: DESIGN_SYSTEM.colors.primary
  },
  planetTotalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: DESIGN_SYSTEM.colors.positive
  },

  //  ESTILOS PARA NOTA EXPLICATIVA
  explanationCard: {
    backgroundColor: DESIGN_SYSTEM.colors.light,
    padding: DESIGN_SYSTEM.spacing.md,
    borderRadius: DESIGN_SYSTEM.borderRadius.md,
    marginTop: DESIGN_SYSTEM.spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: DESIGN_SYSTEM.colors.info
  },
  explanationTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: DESIGN_SYSTEM.colors.primary,
    marginBottom: DESIGN_SYSTEM.spacing.sm
  },
  explanationText: {
    fontSize: 12,
    color: DESIGN_SYSTEM.colors.secondary,
    lineHeight: 16,
    marginBottom: DESIGN_SYSTEM.spacing.xs
  },

  //  ESTILOS PARA BREAKDOWN DETALHADO COM MULTIPLICADORES
  detailedBreakdownSection: {
    marginTop: DESIGN_SYSTEM.spacing.md,
    padding: DESIGN_SYSTEM.spacing.md,
    backgroundColor: DESIGN_SYSTEM.colors.light,
    borderRadius: DESIGN_SYSTEM.borderRadius.md,
    borderWidth: 1,
    borderColor: DESIGN_SYSTEM.colors.border
  },
  detailedBreakdownTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: DESIGN_SYSTEM.colors.primary,
    marginBottom: DESIGN_SYSTEM.spacing.md,
    textAlign: 'center'
  },
  multiplierRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: DESIGN_SYSTEM.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: DESIGN_SYSTEM.colors.light
  },
  multiplierLabel: {
    flex: 2,
    paddingRight: DESIGN_SYSTEM.spacing.sm
  },
  multiplierLabelText: {
    fontSize: 13,
    fontWeight: '600',
    color: DESIGN_SYSTEM.colors.primary
  },
  multiplierValue: {
    flex: 1,
    alignItems: 'center'
  },
  multiplierValueText: {
    fontSize: 13,
    fontWeight: 'bold'
  },
  multiplierDescription: {
    flex: 3,
    paddingLeft: DESIGN_SYSTEM.spacing.sm
  },
  multiplierDescriptionText: {
    fontSize: 11,
    color: DESIGN_SYSTEM.colors.secondary,
    lineHeight: 14
  },
  calculationStepsSection: {
    marginTop: DESIGN_SYSTEM.spacing.md,
    paddingTop: DESIGN_SYSTEM.spacing.md,
    borderTopWidth: 1,
    borderTopColor: DESIGN_SYSTEM.colors.light
  },
  calculationStepsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: DESIGN_SYSTEM.colors.primary,
    marginBottom: DESIGN_SYSTEM.spacing.sm
  },
  calculationStepText: {
    fontSize: 11,
    color: DESIGN_SYSTEM.colors.secondary,
    lineHeight: 14,
    marginBottom: DESIGN_SYSTEM.spacing.xs,
    fontFamily: 'monospace'
  },
  finalScoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: DESIGN_SYSTEM.spacing.md,
    marginTop: DESIGN_SYSTEM.spacing.md,
    borderTopWidth: 2,
    borderTopColor: DESIGN_SYSTEM.colors.primary
  },
  finalScoreLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: DESIGN_SYSTEM.colors.primary
  },
  finalScoreValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: DESIGN_SYSTEM.colors.positive
  }
})


























