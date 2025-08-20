import React from 'react'
import {
  Modal,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'

interface TransitData {
  id: string
  name: string
  weight: number
  status: 'positive' | 'negative' | 'neutral'
  planets: string[]
  aspectType: string
  contribution: number
  description: string
}

interface SuggestionData {
  transitId: string
  suggestion: string
  action: string
  influencePeriod: string
  priority: 'high' | 'medium' | 'low'
}

interface CalculationData {
  formula: string
  breakdown: { step: string; value: number; description: string }[]
  total: number
  validation: string
  astrologicalBasis: string
}

interface LifeAreaDetail {
  name: string
  percentage: number
  status: string
  transits: TransitData[]
  suggestions: SuggestionData[]
  calculations: CalculationData
}

interface LifeAreaDetailModalProps {
  visible: boolean
  onClose: () => void
  areaData: LifeAreaDetail | null
}

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
  familia: ['#FF6B9D', '#FF8E8E'], // Corrigido: diferente de Finanças, usando rosa como Amor
  espiritualidade: ['#B19CD9', '#8B5CF6'],
  comunicacao: ['#60A5FA', '#3B82F6'],
  transformacao: ['#F472B6', '#EC4899'],
  // Inglês (fallback)
  love: ['#FF6B9D', '#FF8E8E'],
  career: ['#4ECDC4', '#44A08D'],
  health: ['#96E6A1', '#7BC142'],
  family: ['#FF6B9D', '#FF8E8E'], // Corrigido: diferente de Finances
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
    md: 12,
    lg: 16,
    xl: 20
  },
  borderRadius: 8,
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2
    }
  }
}

export const LifeAreaDetailModal: React.FC<LifeAreaDetailModalProps> = ({
  visible,
  onClose,
  areaData
}) => {
  if (!areaData) return null

  // 🎯 OBTER CORES E ÍCONES ESPECÍFICOS DA ÁREA
  const areaColors = AREA_COLORS[areaData.name] || ['#4B5563', '#6B7280']
  const areaIcon = AREA_ICONS[areaData.name] || 'help-circle'
  const headerGradient = [areaColors[0], areaColors[1]]

  // 🎯 DADOS MOCKADOS PARA DEMONSTRAÇÃO
  const mockTransits: TransitData[] = [
    {
      id: '1',
      name: 'Júpiter em Trígono com Vênus',
      weight: 12.5,
      status: 'positive',
      planets: ['Júpiter', 'Vênus'],
      aspectType: 'Trígono',
      contribution: 25.0,
      description: 'Harmonia e expansão nas relações'
    },
    {
      id: '2',
      name: 'Marte em Quadratura com Saturno',
      weight: 8.3,
      status: 'negative',
      planets: ['Marte', 'Saturno'],
      aspectType: 'Quadratura',
      contribution: 16.6,
      description: 'Tensões e desafios na ação'
    },
    {
      id: '3',
      name: 'Sol em Conjunção com Mercúrio',
      weight: 6.7,
      status: 'positive',
      planets: ['Sol', 'Mercúrio'],
      aspectType: 'Conjunção',
      contribution: 13.4,
      description: 'Comunicação clara e direta'
    },
    {
      id: '4',
      name: 'Lua em Oposição com Plutão',
      weight: 5.2,
      status: 'negative',
      planets: ['Lua', 'Plutão'],
      aspectType: 'Oposição',
      contribution: 10.4,
      description: 'Transformações emocionais intensas'
    },
    {
      id: '5',
      name: 'Vênus em Sextil com Urano',
      weight: 4.8,
      status: 'positive',
      planets: ['Vênus', 'Urano'],
      aspectType: 'Sextil',
      contribution: 9.6,
      description: 'Inovação e criatividade no amor'
    }
  ]

  const mockSuggestions: SuggestionData[] = [
    {
      transitId: '1',
      suggestion: 'Aproveite a energia expansiva de Júpiter',
      action: 'Inicie novos projetos de relacionamento',
      influencePeriod: 'Próximas 2 semanas',
      priority: 'high'
    },
    {
      transitId: '2',
      suggestion: 'Mantenha paciência com os desafios',
      action: 'Evite confrontos desnecessários',
      influencePeriod: 'Próximos 5 dias',
      priority: 'medium'
    },
    {
      transitId: '3',
      suggestion: 'Comunicação será sua aliada',
      action: 'Expressar ideias com clareza',
      influencePeriod: 'Próximos 3 dias',
      priority: 'high'
    },
    {
      transitId: '4',
      suggestion: 'Transformações emocionais em andamento',
      action: 'Refletir sobre padrões antigos',
      influencePeriod: 'Próximas 3 semanas',
      priority: 'medium'
    },
    {
      transitId: '5',
      suggestion: 'Inovação no campo amoroso',
      action: 'Experimentar novas abordagens',
      influencePeriod: 'Próximas 2 semanas',
      priority: 'low'
    }
  ]

  const mockCalculations: CalculationData = {
    formula: 'Score = Σ(Peso × Coeficiente × Status)',
    breakdown: [
      { step: 'Júpiter-Vênus (Trígono)', value: 12.5, description: '12.5 × 1.0 × 1.0 = 12.5' },
      { step: 'Marte-Saturno (Quadratura)', value: 8.3, description: '8.3 × 1.0 × 0.8 = 6.64' },
      { step: 'Sol-Mercúrio (Conjunção)', value: 6.7, description: '6.7 × 1.0 × 1.0 = 6.7' },
      { step: 'Lua-Plutão (Oposição)', value: 5.2, description: '5.2 × 1.0 × 0.7 = 3.64' },
      { step: 'Vênus-Urano (Sextil)', value: 4.8, description: '4.8 × 1.0 × 0.9 = 4.32' }
    ],
    total: 33.8,
    validation: 'Score calculado: 33.8/50 = 67.6% (arredondado para 68%)',
    astrologicalBasis: 'Fórmula baseada em dignidades essenciais, força das casas e aspectos planetários. Coeficientes: Trígono (1.0), Sextil (0.9), Conjunção (1.0), Oposição (0.7), Quadratura (0.8).'
  }

  // 🎨 COMPONENTES DE RENDERIZAÇÃO

  const renderHeader = () => (
    <View style={[styles.header, { backgroundColor: headerGradient[0] }]}>
      <View style={styles.headerContent}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={24} color={DESIGN_SYSTEM.colors.white} />
        </TouchableOpacity>
        
        <View style={styles.headerMain}>
          <View style={styles.headerIconContainer}>
            <Ionicons 
              name={areaIcon as any} 
              size={32} 
              color={DESIGN_SYSTEM.colors.white} 
            />
          </View>
          
          <Text style={styles.areaTitle}>{areaData.name.toUpperCase()}</Text>
          
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreValue}>{areaData.percentage}%</Text>
          </View>
        </View>
      </View>
    </View>
  )

  const renderTransitsSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>TRÂNSITOS ATIVOS (Por Relevância)</Text>
      
      <View style={styles.transitTable}>
        <View style={styles.tableHeader}>
          <Text style={styles.headerCell}>Trânsito</Text>
          <Text style={styles.headerCell}>Peso</Text>
          <Text style={styles.headerCell}>Status</Text>
          <Text style={styles.headerCell}>Contribuição</Text>
        </View>
        
        {mockTransits.map((transit) => (
          <View key={transit.id} style={styles.transitRow}>
            <View style={styles.transitInfo}>
              <Text style={styles.transitName}>{transit.name}</Text>
              <Text style={styles.transitPlanets}>{transit.planets.join(' + ')}</Text>
              <Text style={styles.transitDescription}>{transit.description}</Text>
            </View>
            
            <View style={styles.weightCell}>
              <Text style={styles.weightValue}>{transit.weight}</Text>
              <View style={[styles.weightBar, { width: (transit.weight / 15) * 60 }]} />
            </View>
            
            <View style={styles.statusCell}>
              <View style={[styles.statusIndicator, { backgroundColor: DESIGN_SYSTEM.colors[transit.status] }]} />
              <Text style={styles.statusText}>{transit.status}</Text>
            </View>
            
            <View style={styles.contributionCell}>
              <Text style={styles.contributionValue}>{transit.contribution}%</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  )

  const renderSuggestionsSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>SUGESTÕES ESPECÍFICAS POR TRÂNSITO</Text>
      
      {mockSuggestions.map((suggestion, index) => (
        <View key={suggestion.transitId} style={styles.suggestionCard}>
          <View style={styles.suggestionHeader}>
            <Text style={styles.suggestionNumber}>#{index + 1}</Text>
            <View style={[styles.priorityBadge, { backgroundColor: DESIGN_SYSTEM.colors[suggestion.priority === 'high' ? 'warning' : suggestion.priority === 'medium' ? 'info' : 'secondary'] }]}>
              <Text style={styles.priorityText}>{suggestion.priority.toUpperCase()}</Text>
            </View>
          </View>
          
          <Text style={styles.suggestionText}>{suggestion.suggestion}</Text>
          <Text style={styles.actionText}>Ação: {suggestion.action}</Text>
          <Text style={styles.periodText}>Período: {suggestion.influencePeriod}</Text>
        </View>
      ))}
    </View>
  )

  const renderCalculationsSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>CÁLCULOS TÉCNICOS E BASE ASTROLÓGICA</Text>
      
      <View style={styles.calculationCard}>
        <Text style={styles.formulaTitle}>Fórmula de Cálculo:</Text>
        <Text style={styles.formulaText}>{mockCalculations.formula}</Text>
        
        <Text style={styles.breakdownTitle}>Breakdown Matemático:</Text>
        {mockCalculations.breakdown.map((step, index) => (
          <View key={index} style={styles.breakdownStep}>
            <Text style={styles.stepName}>{step.step}</Text>
            <Text style={styles.stepValue}>{step.value}</Text>
            <Text style={styles.stepDescription}>{step.description}</Text>
          </View>
        ))}
        
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalValue}>{mockCalculations.total}</Text>
        </View>
        
        <Text style={styles.validationTitle}>Validação:</Text>
        <Text style={styles.validationText}>{mockCalculations.validation}</Text>
        
        <Text style={styles.basisTitle}>Base Astrológica:</Text>
        <Text style={styles.basisText}>{mockCalculations.astrologicalBasis}</Text>
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
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    width: width * 0.95,
    height: height * 0.9,
    backgroundColor: DESIGN_SYSTEM.colors.white,
    borderRadius: DESIGN_SYSTEM.borderRadius,
    overflow: 'hidden'
  },
  header: {
    height: 60,
    justifyContent: 'center',
    paddingHorizontal: DESIGN_SYSTEM.spacing.lg
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  closeButton: {
    padding: DESIGN_SYSTEM.spacing.xs
  },
  headerMain: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: DESIGN_SYSTEM.spacing.lg
  },
  headerIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  areaTitle: {
    color: DESIGN_SYSTEM.colors.white,
    fontSize: 18,
    fontWeight: 'bold'
  },
  scoreContainer: {
    backgroundColor: DESIGN_SYSTEM.colors.white,
    paddingHorizontal: DESIGN_SYSTEM.spacing.md,
    paddingVertical: DESIGN_SYSTEM.spacing.xs,
    borderRadius: DESIGN_SYSTEM.borderRadius
  },
  scoreValue: {
    color: DESIGN_SYSTEM.colors.primary,
    fontSize: 20,
    fontWeight: 'bold'
  },
  scrollContent: {
    flex: 1,
    padding: DESIGN_SYSTEM.spacing.lg
  },
  section: {
    marginBottom: DESIGN_SYSTEM.spacing.xl
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: DESIGN_SYSTEM.colors.primary,
    marginBottom: DESIGN_SYSTEM.spacing.md,
    textAlign: 'center'
  },
  transitTable: {
    borderWidth: 1,
    borderColor: DESIGN_SYSTEM.colors.border,
    borderRadius: DESIGN_SYSTEM.borderRadius
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: DESIGN_SYSTEM.colors.light,
    padding: DESIGN_SYSTEM.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: DESIGN_SYSTEM.colors.border
  },
  headerCell: {
    flex: 1,
    fontSize: 12,
    fontWeight: 'bold',
    color: DESIGN_SYSTEM.colors.primary,
    textAlign: 'center'
  },
  transitRow: {
    flexDirection: 'row',
    padding: DESIGN_SYSTEM.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: DESIGN_SYSTEM.colors.border,
    alignItems: 'center'
  },
  transitInfo: {
    flex: 2,
    marginRight: DESIGN_SYSTEM.spacing.sm
  },
  transitName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: DESIGN_SYSTEM.colors.primary,
    marginBottom: 2
  },
  transitPlanets: {
    fontSize: 10,
    color: DESIGN_SYSTEM.colors.secondary,
    marginBottom: 2
  },
  transitDescription: {
    fontSize: 9,
    color: DESIGN_SYSTEM.colors.secondary,
    fontStyle: 'italic'
  },
  weightCell: {
    flex: 1,
    alignItems: 'center'
  },
  weightValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: DESIGN_SYSTEM.colors.primary,
    marginBottom: 4
  },
  weightBar: {
    height: 4,
    backgroundColor: DESIGN_SYSTEM.colors.primary,
    borderRadius: 2
  },
  statusCell: {
    flex: 1,
    alignItems: 'center'
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 4
  },
  statusText: {
    fontSize: 10,
    color: DESIGN_SYSTEM.colors.secondary,
    textTransform: 'capitalize'
  },
  contributionCell: {
    flex: 1,
    alignItems: 'center'
  },
  contributionValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: DESIGN_SYSTEM.colors.primary
  },
  suggestionCard: {
    backgroundColor: DESIGN_SYSTEM.colors.light,
    padding: DESIGN_SYSTEM.spacing.md,
    borderRadius: DESIGN_SYSTEM.borderRadius,
    marginBottom: DESIGN_SYSTEM.spacing.md,
    ...DESIGN_SYSTEM.shadows.sm
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
    color: DESIGN_SYSTEM.colors.primary
  },
  priorityBadge: {
    paddingHorizontal: DESIGN_SYSTEM.spacing.sm,
    paddingVertical: 2,
    borderRadius: 4
  },
  priorityText: {
    fontSize: 8,
    color: DESIGN_SYSTEM.colors.white,
    fontWeight: 'bold'
  },
  suggestionText: {
    fontSize: 12,
    color: DESIGN_SYSTEM.colors.primary,
    marginBottom: DESIGN_SYSTEM.spacing.xs
  },
  actionText: {
    fontSize: 11,
    color: DESIGN_SYSTEM.colors.secondary,
    marginBottom: 2
  },
  periodText: {
    fontSize: 10,
    color: DESIGN_SYSTEM.colors.secondary,
    fontStyle: 'italic'
  },
  calculationCard: {
    backgroundColor: DESIGN_SYSTEM.colors.light,
    padding: DESIGN_SYSTEM.spacing.md,
    borderRadius: DESIGN_SYSTEM.borderRadius,
    ...DESIGN_SYSTEM.shadows.sm
  },
  formulaTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: DESIGN_SYSTEM.colors.primary,
    marginBottom: DESIGN_SYSTEM.spacing.xs
  },
  formulaText: {
    fontSize: 12,
    color: DESIGN_SYSTEM.colors.secondary,
    fontFamily: 'monospace',
    marginBottom: DESIGN_SYSTEM.spacing.md
  },
  breakdownTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: DESIGN_SYSTEM.colors.primary,
    marginBottom: DESIGN_SYSTEM.spacing.sm
  },
  breakdownStep: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: DESIGN_SYSTEM.spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: DESIGN_SYSTEM.colors.border
  },
  stepName: {
    flex: 2,
    fontSize: 11,
    color: DESIGN_SYSTEM.colors.primary
  },
  stepValue: {
    flex: 1,
    fontSize: 11,
    fontWeight: 'bold',
    color: DESIGN_SYSTEM.colors.primary,
    textAlign: 'center'
  },
  stepDescription: {
    flex: 2,
    fontSize: 10,
    color: DESIGN_SYSTEM.colors.secondary,
    fontFamily: 'monospace',
    textAlign: 'right'
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: DESIGN_SYSTEM.spacing.sm,
    borderTopWidth: 2,
    borderTopColor: DESIGN_SYSTEM.colors.primary,
    marginTop: DESIGN_SYSTEM.spacing.sm
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: DESIGN_SYSTEM.colors.primary
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: DESIGN_SYSTEM.colors.primary
  },
  validationTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: DESIGN_SYSTEM.colors.primary,
    marginTop: DESIGN_SYSTEM.spacing.md,
    marginBottom: DESIGN_SYSTEM.spacing.xs
  },
  validationText: {
    fontSize: 12,
    color: DESIGN_SYSTEM.colors.secondary,
    marginBottom: DESIGN_SYSTEM.spacing.md
  },
  basisTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: DESIGN_SYSTEM.colors.primary,
    marginBottom: DESIGN_SYSTEM.spacing.xs
  },
  basisText: {
    fontSize: 11,
    color: DESIGN_SYSTEM.colors.secondary,
    lineHeight: 16
  }
})