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
  const getRealTransits = (): RealTransitData[] => {
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

  const getRealSuggestions = (): RealSuggestionData[] => {
    const transits = getRealTransits()
    if (transits.length === 0) return []

    return transits.map((transit, index) => {
      const isHarmonious = ['trígono', 'sextil'].includes(transit.type)
      const isChallenging = ['quadratura', 'oposição'].includes(transit.type)
      const isNeutral = transit.type === 'conjunção'

      let suggestion = ''
      let action = ''
      let priority: 'high' | 'medium' | 'low' = 'medium'

      if (isHarmonious) {
        suggestion = `Aproveite a harmonia entre ${transit.transitPlanet} e ${transit.natalPlanet}`
        action = 'Iniciar projetos, expandir relacionamentos'
        priority = 'high'
      } else if (isChallenging) {
        suggestion = `Gerencie a tensão entre ${transit.transitPlanet} e ${transit.natalPlanet}`
        action = 'Revisar planos, buscar equilíbrio'
        priority = 'high'
      } else if (isNeutral) {
        suggestion = `Integre as energias de ${transit.transitPlanet} e ${transit.natalPlanet}`
        action = 'Refletir, planejar, integrar'
        priority = 'medium'
      }

      const influencePeriod = transit.durationClass === 'longo' ? 'Meses' : 
                             transit.durationClass === 'médio' ? 'Semanas' : 'Dias'

      return {
        transitId: `${transit.transitPlanet}-${transit.natalPlanet}-${transit.type}`,
        suggestion,
        action,
        influencePeriod,
        priority,
        basedOn: `${transit.type} ${transit.transitPlanet} → ${transit.natalPlanet}`
      }
    })
  }

  const getRealCalculations = (): RealCalculationData => {
    const transits = getRealTransits()
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

  const realTransits = getRealTransits()
  const realSuggestions = getRealSuggestions()
  const realCalculations = getRealCalculations()

  const renderHeader = () => (
    <View style={[styles.header, { backgroundColor: headerGradient[0] }]}>
      <View style={styles.headerContent}>
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={DESIGN_SYSTEM.colors.white} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Ionicons name={areaIcon as any} size={24} color={DESIGN_SYSTEM.colors.white} />
          <Text style={styles.areaName}>{areaData.name.toUpperCase()}</Text>
        </View>
        <Text style={styles.areaScore}>{areaData.status}%</Text>
      </View>
    </View>
  )

  const renderTransitsSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>TRÂNSITOS ATIVOS POR RELEVÂNCIA</Text>
      
      {realTransits.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Nenhum trânsito ativo para esta área no momento</Text>
        </View>
      ) : (
        realTransits.map((transit, index) => {
          const isHarmonious = ['trígono', 'sextil'].includes(transit.type)
          const isChallenging = ['quadratura', 'oposição'].includes(transit.type)
          const statusColor = isHarmonious ? DESIGN_SYSTEM.colors.positive : 
                             isChallenging ? DESIGN_SYSTEM.colors.negative : 
                             DESIGN_SYSTEM.colors.neutral

          return (
            <View key={`${transit.transitPlanet}-${transit.natalPlanet}-${transit.type}`} style={styles.transitCard}>
              <View style={styles.transitHeader}>
                <Text style={styles.transitNumber}>#{index + 1}</Text>
                <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
                  <Text style={styles.statusText}>
                    {isHarmonious ? 'Harmônico' : isChallenging ? 'Desafiador' : 'Neutro'}
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
                    {Math.round((transit.strength / realTransits.reduce((sum, t) => sum + t.strength, 0)) * 100)}%
                  </Text>
                </View>
              </View>
            </View>
          )
        })
      )}
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
        
        <Text style={styles.breakdownTitle}>Breakdown Matemático:</Text>
        {realCalculations.breakdown.map((step, index) => (
          <View key={index} style={styles.breakdownStep}>
            <Text style={styles.stepName}>{step.step}</Text>
            <Text style={styles.stepValue}>{step.value}</Text>
            <Text style={styles.stepDescription}>{step.description}</Text>
          </View>
        ))}
        
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalValue}>{realCalculations.total}</Text>
        </View>
        
        <Text style={styles.validationTitle}>Validação:</Text>
        <Text style={styles.validationText}>{realCalculations.validation}</Text>
        
        <Text style={styles.basisTitle}>Base Astrológica:</Text>
        <Text style={styles.basisText}>{realCalculations.astrologicalBasis}</Text>
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
  backButton: {
    padding: DESIGN_SYSTEM.spacing.sm,
    borderRadius: DESIGN_SYSTEM.borderRadius.sm
  },
  headerCenter: {
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
  }
})