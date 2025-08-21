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

// 🎨 SISTEMA DE CORES E EMOJIS POR ÁREA DE VIDA (MANTENDO IDENTIDADE ORIGINAL)
const AREA_ICONS: Record<string, string> = {
  // Português (sistema atual)
  amor: 'heart',
  carreira: 'briefcase',
  financas: 'cash',
  saude: 'fitness',
  familia: 'people',
  espiritualidade: 'flower',
  comunicacao: 'chatbubble',
  transformacao: 'refresh',
  // Inglês (fallback)
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
  // Português (sistema atual)
  amor: ['#FF6B9D', '#FF8E8E'],
  carreira: ['#4ECDC4', '#44A08D'],
  financas: ['#FFD93D', '#FF9F40'],
  saude: ['#96E6A1', '#7BC142'],
  familia: ['#FF8A65', '#FFAB91'], // Corrigido: coral suave, diferente de todas
  espiritualidade: ['#B19CD9', '#8B5CF6'],
  comunicacao: ['#60A5FA', '#3B82F6'],
  transformacao: ['#F472B6', '#EC4899'],
  // Inglês (fallback)
  love: ['#FF6B9D', '#FF8E8E'],
  career: ['#4ECDC4', '#44A08D'],
  health: ['#96E6A1', '#7BC142'],
  family: ['#FF8A65', '#FFAB91'], // Corrigido: coral suave, diferente de todas
  spirituality: ['#B19CD9', '#8B5CF6'],
  finances: ['#FFD93D', '#FF9F40'],
  communication: ['#60A5FA', '#3B82F6'],
  transformation: ['#F472B6', '#EC4899'],
}

// 🎨 SISTEMA DE DESIGN SIMPLIFICADO
const DESIGN_SYSTEM = {
  colors: {
    positive: '#27AE60',
    negative: '#E74C3C',
    neutral: '#3498DB',
    warning: '#F39C12',
    info: '#3498DB',
    primary: '#2C3E50',
    secondary: '#6C757D',
    light: '#F8F9FA',
    white: '#FFFFFF',
    border: '#E9ECEF'
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32
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
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3
    }
  }
}

interface LifeAreaDetailModalProps {
  visible: boolean
  onClose: () => void
  areaData: LifeArea | null
  astrologyData?: RealAstrologyData | null
}

// 🎯 INTERFACES PARA DADOS REAIS
interface RealTransitData {
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
  contactIndex?: 1 | 2 | 3
}

interface RealSuggestionData {
  transitId: string
  suggestion: string
  action: string
  influencePeriod: string
  priority: 'high' | 'medium' | 'low'
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

// 🎯 NOVAS INTERFACES PARA BREAKDOWN DETALHADO
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

  // 🎯 OBTER CORES E ÍCONES ESPECÍFICOS DA ÁREA
  const areaColors = AREA_COLORS[areaData.name] || ['#4B5563', '#6B7280']
  const areaIcon = AREA_ICONS[areaData.name] || 'help-circle'
  const headerGradient = [areaColors[0], areaColors[1]]

  // 🎯 DADOS REAIS DO ENGINE ASTROLÓGICO
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
    })).sort((a, b) => b.strength - a.strength) // Ordena por força
  }

  const getNatalAspects = (): NatalAspectData[] => {
    const debugData = astrologyData?.debug?.lifeAreas?.[areaData.name]
    if (!debugData?.planetDetails) return []

    const aspects: NatalAspectData[] = []
    
    // Buscar aspectos entre planetas que afetam esta área
    debugData.planetDetails.forEach(planet => {
      planet.aspects.forEach(aspect => {
        // 🎯 CORREÇÃO: Classificação baseada no TIPO, não no score
        const isHarmonious = ['trígono', 'sextil'].includes(aspect.type)
        const isChallenging = ['quadratura', 'oposição', 'quincúncio', 'semiquadratura', 'sesquiquadratura'].includes(aspect.type)
        const isNeutral = aspect.type === 'conjunção'
        
        aspects.push({
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

    return aspects.sort((a, b) => b.score - a.score)
  }

  const getDetailedPlanetBreakdown = (): PlanetBreakdown[] => {
    const debugData = astrologyData?.debug?.lifeAreas?.[areaData.name]
    if (!debugData?.planetDetails) return []

    const totalScore = debugData.finalScore || areaData.status
    
    return debugData.planetDetails.map(planet => {
      const planetTotal = planet.total || 0
      const percentageOfTotal = totalScore > 0 ? (planetTotal / totalScore) * 100 : 0

      return {
        planet: planet.planet,
        dignityScore: planet.signScore || 0,
        dignityReason: getDignityReason(planet.planet, planet.signScore || 0),
        houseScore: planet.houseScore || 0,
        houseReason: getHouseReason(planet.houseScore || 0),
        natalAspects: planet.aspects.map(aspect => ({
          with: aspect.with,
          type: aspect.type,
          orb: aspect.orb,
          score: aspect.finalScore || 0,
          description: `${planet.planet} em ${aspect.type} com ${aspect.with}`
        })),
        accidentalConditions: getAccidentalConditions(planet.planet, planet.conditions),
        totalScore: planetTotal,
        percentageOfTotal: Math.round(percentageOfTotal)
      }
    }).sort((a, b) => b.totalScore - a.totalScore)
  }

  // 🎯 FUNÇÕES AUXILIARES PARA EXPLICAÇÕES
  const getDignityReason = (planet: string, score: number): string => {
    if (score >= 45) return 'Domicílio (+28) + Exaltação (+24)'
    if (score >= 28) return 'Domicílio (+28)'
    if (score >= 24) return 'Exaltação (+24)'
    if (score >= 15) return 'Termo (+15)'
    if (score >= 10) return 'Face (+10)'
    if (score >= 5) return 'Peregrino (+5)'
    return 'Detrimento/Fall (0)'
  }

  const getHouseReason = (score: number): string => {
    if (score >= 15) return 'Casa Angular (+15)'
    if (score >= 10) return 'Casa Succedente (+10)'
    if (score >= 5) return 'Casa Cadente (+5)'
    return 'Sem influência da casa (0)'
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

    conditions.tags.forEach(tag => {
      conditionsList.push({
        condition: tag,
        score: 2,
        description: `Tag: ${tag}`
      })
    })

    return conditionsList
  }

  const getRealSuggestions = (): RealSuggestionData[] => {
    const transits = activeTransits
    const aspects = natalAspects
    
    const suggestions: RealSuggestionData[] = []

    // Sugestões baseadas em trânsitos ativos
    transits.forEach((transit, index) => {
      // 🎯 CORREÇÃO: Classificação mais abrangente
      const isHarmonious = ['trígono', 'sextil'].includes(transit.type)
      const isChallenging = ['quadratura', 'oposição', 'quincúncio', 'semiquadratura', 'sesquiquadratura'].includes(transit.type)
      const isNeutral = transit.type === 'conjunção'

      let suggestion = ''
      let action = ''
      let priority: 'high' | 'medium' | 'low' = 'high'

      if (isHarmonious) {
        suggestion = `Aproveite a harmonia entre ${transit.transitPlanet} e ${transit.natalPlanet}`
        action = 'Iniciar projetos, expandir relacionamentos'
      } else if (isChallenging) {
        suggestion = `Gerencie a tensão entre ${transit.transitPlanet} e ${transit.natalPlanet}`
        action = 'Revisar planos, buscar equilíbrio'
      } else if (isNeutral) {
        suggestion = `Integre as energias de ${transit.transitPlanet} e ${transit.natalPlanet}`
        action = 'Refletir, planejar, integrar'
      }

      const influencePeriod = transit.durationClass === 'longo' ? 'Meses' : 
                             transit.durationClass === 'médio' ? 'Semanas' : 'Dias'

      suggestions.push({
        transitId: `transit-${transit.transitPlanet}-${transit.natalPlanet}-${transit.type}`,
        suggestion,
        action,
        influencePeriod,
        priority,
        basedOn: `Trânsito: ${transit.type} ${transit.transitPlanet} → ${transit.natalPlanet}`
      })
    })

    // Sugestões baseadas em aspectos natais
    aspects.forEach((aspect, index) => {
      // 🎯 CORREÇÃO: Sugestões baseadas na natureza real do aspecto
      const suggestion = aspect.isHarmonious 
        ? `Aproveite a harmonia natal entre ${aspect.planet1} e ${aspect.planet2}`
        : aspect.isChallenging
        ? `Gerencie a tensão natal entre ${aspect.planet1} e ${aspect.planet2}`
        : `Integre as energias natais entre ${aspect.planet1} e ${aspect.planet2}`
      
      const action = aspect.isHarmonious
        ? 'Desenvolver talentos naturais, fortalecer relacionamentos'
        : aspect.isChallenging
        ? 'Trabalhar equilíbrio, transformar desafios em oportunidades'
        : 'Refletir sobre a natureza da relação entre estes planetas'

      suggestions.push({
        transitId: `natal-${aspect.planet1}-${aspect.planet2}-${aspect.type}`,
        suggestion,
        action,
        influencePeriod: 'Constante (Natal)',
        priority: 'medium',
        basedOn: `Aspecto Natal: ${aspect.type} ${aspect.planet1} → ${aspect.planet2}`
      })
    })

    return suggestions.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    })
  }

  const getRealCalculations = (): RealCalculationData => {
    const transits = activeTransits
    const aspects = natalAspects
    const debugData = astrologyData?.debug?.lifeAreas?.[areaData.name]

    // Fórmula real baseada no RealAstrologyEngine
    const formula = 'Score Final = Σ(Peso do Planeta × (Dignidade + Casa + Aspectos + Condições))'

    // Breakdown real se disponível
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
      // Fallback baseado nos trânsitos
      breakdown = transits.map(transit => {
        const aspectValue = transit.strength * (transit.isApplying ? 1.15 : 0.95)
        return {
          step: `${transit.type} ${transit.transitPlanet} → ${transit.natalPlanet}`,
          value: Math.round(aspectValue),
          description: `Força: ${transit.strength}, Orb: ${transit.orb.toFixed(1)}°, ${transit.isApplying ? 'Aplicante' : 'Separando'}`
        }
      })
    }

    const validation = 'Score calculado com base em dignidades essenciais, força das casas, aspectos planetários e condições acidentais.'
    
    const astrologicalBasis = 'A pontuação considera a tradição astrológica clássica: domicílios (+28), exaltações (+24), casas angulares (+15), aspectos harmônicos (trígonos/sextis) e desafiadores (quadraturas/oposições).'

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
      <Text style={styles.sectionTitle}>TRÂNSITOS ATIVOS E ASPECTOS NATAIS</Text>
      
      {/* Subseção: Trânsitos Ativos */}
      <View style={styles.subsection}>
        <Text style={styles.subsectionTitle}>🔄 TRÂNSITOS ATIVOS</Text>
        
        {activeTransits.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Nenhum trânsito ativo para esta área no momento</Text>
          </View>
        ) : (
          activeTransits.map((transit, index) => {
            // 🎯 CORREÇÃO: Classificação mais abrangente dos aspectos
            const isHarmonious = ['trígono', 'sextil'].includes(transit.type)
            const isChallenging = ['quadratura', 'oposição', 'quincúncio', 'semiquadratura', 'sesquiquadratura'].includes(transit.type)
            const isNeutral = transit.type === 'conjunção'
            
            // 🎯 CORREÇÃO: Cores e status baseados na natureza real
            let statusColor: string
            let statusText: string
            
            if (isHarmonious) {
              statusColor = DESIGN_SYSTEM.colors.positive
              statusText = 'Harmônico'
            } else if (isChallenging) {
              statusColor = DESIGN_SYSTEM.colors.negative
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
                  {transit.transitPlanet} em {transit.type} com {transit.natalPlanet}
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
                    <Text style={styles.detailValue}>{transit.orb.toFixed(1)}°</Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Planetas:</Text>
                    <Text style={styles.detailValue}>{transit.transitPlanet} + {transit.natalPlanet}</Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Tipo:</Text>
                    <Text style={styles.detailValue}>{transit.type}</Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Contribuição:</Text>
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

      {/* Subseção: Aspectos Natais */}
      <View style={styles.subsection}>
        <Text style={styles.subsectionTitle}>🔗 ASPECTOS NATAIS RELEVANTES</Text>
        
        {natalAspects.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Nenhum aspecto natal relevante para esta área</Text>
          </View>
        ) : (
          natalAspects.map((aspect, index) => {
            // 🎯 CORREÇÃO: Cores e status baseados na natureza real do aspecto
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
                  {aspect.planet1} em {aspect.type} com {aspect.planet2}
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
                    <Text style={styles.detailValue}>{aspect.orb.toFixed(1)}°</Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Planetas:</Text>
                    <Text style={styles.detailValue}>{aspect.planet1} + {aspect.planet2}</Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Tipo:</Text>
                    <Text style={styles.detailValue}>{aspect.type}</Text>
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
          <Text style={styles.emptyText}>Nenhuma sugestão disponível no momento</Text>
        </View>
      ) : (
        realSuggestions.map((suggestion, index) => (
          <View key={suggestion.transitId} style={styles.suggestionCard}>
            <View style={styles.suggestionHeader}>
              <Text style={styles.suggestionNumber}>#{index + 1}</Text>
              <View style={[styles.priorityBadge, { 
                backgroundColor: suggestion.priority === 'high' ? DESIGN_SYSTEM.colors.warning : 
                               suggestion.priority === 'medium' ? DESIGN_SYSTEM.colors.info : 
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
      <Text style={styles.sectionTitle}>CÁLCULOS TÉCNICOS E BASE ASTROLÓGICA</Text>
      
      <View style={styles.calculationCard}>
        <Text style={styles.formulaTitle}>Fórmula de Cálculo:</Text>
        <Text style={styles.formulaText}>{realCalculations.formula}</Text>
        
        <Text style={styles.breakdownTitle}>Breakdown Matemático Detalhado:</Text>
        
        {/* Breakdown em Árvore por Planeta */}
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
                <Text style={styles.breakdownLabelText}>🏛️ Dignidade Essencial:</Text>
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
                <Text style={styles.breakdownLabelText}>🏠 Força da Casa:</Text>
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
                <Text style={styles.aspectsTitle}>🔗 Aspectos Natais:</Text>
                {planet.natalAspects.map((aspect, aspectIndex) => {
                  // 🎯 CORREÇÃO: Mostrar natureza real do aspecto
                  const isHarmonious = ['trígono', 'sextil'].includes(aspect.type)
                  const isChallenging = ['quadratura', 'oposição', 'quincúncio', 'semiquadratura', 'sesquiquadratura'].includes(aspect.type)
                  
                  let aspectIcon = '⚪'
                  let aspectColor = DESIGN_SYSTEM.colors.secondary
                  
                  if (isHarmonious) {
                    aspectIcon = '🌿'
                    aspectColor = DESIGN_SYSTEM.colors.positive
                  } else if (isChallenging) {
                    aspectIcon = '⚡'
                    aspectColor = DESIGN_SYSTEM.colors.negative
                  }
                  
                  return (
                    <View key={aspectIndex} style={styles.aspectRow}>
                      <View style={styles.aspectLabel}>
                        <Text style={styles.aspectLabelText}>
                          {aspectIcon} {aspect.type} com {aspect.with}:
                        </Text>
                      </View>
                      <View style={styles.aspectValue}>
                        <Text style={[styles.aspectValueText, { color: aspectColor }]}>
                          {isChallenging ? '-' : '+'}{Math.abs(aspect.score)}
                        </Text>
                      </View>
                      <View style={styles.aspectDescription}>
                        <Text style={styles.aspectDescriptionText}>
                          Orb: {aspect.orb.toFixed(1)}° • {isHarmonious ? 'Harmônico' : isChallenging ? 'Desafiador' : 'Neutro'}
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
                <Text style={styles.conditionsTitle}>⚡ Condições Acidentais:</Text>
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
        
        {/* 🎯 NOTA EXPLICATIVA SOBRE SCORES */}
        <View style={styles.explanationCard}>
          <Text style={styles.explanationTitle}>ℹ️ Como Interpretar os Scores:</Text>
          <Text style={styles.explanationText}>
            • <Text style={{ color: DESIGN_SYSTEM.colors.positive }}>Scores positivos</Text> indicam influências favoráveis
          </Text>
          <Text style={styles.explanationText}>
            • <Text style={{ color: DESIGN_SYSTEM.colors.negative }}>Scores negativos</Text> indicam desafios a serem superados
          </Text>
          <Text style={styles.explanationText}>
            • <Text style={{ color: DESIGN_SYSTEM.colors.neutral }}>Scores neutros</Text> indicam influências equilibradas
          </Text>
          <Text style={styles.explanationText}>
            • A <Text style={{ fontWeight: 'bold' }}>natureza do aspecto</Text> (Harmônico/Desafiador/Neutro) é baseada no tipo astrológico, não no score numérico
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

  // 🎯 ESTILOS PARA BREAKDOWN DETALHADO EM ÁRVORE
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

  // 🎯 ESTILOS PARA NOTA EXPLICATIVA
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
  }
})