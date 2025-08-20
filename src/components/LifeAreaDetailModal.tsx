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
import { LinearGradient } from 'expo-linear-gradient'

interface LifeAreaDetail {
  name: string
  percentage: number
  status: string
  influences: string[]
  mainPlanets: string[]
  description?: string
}

interface LifeAreaDetailModalProps {
  visible: boolean
  onClose: () => void
  areaData: LifeAreaDetail | null
  transitData?: any // Dados completos dos trânsitos para análise detalhada
}

const { width, height } = Dimensions.get('window')

// 🎨 SISTEMA DE DESIGN CONSISTENTE
const DESIGN_SYSTEM = {
  colors: {
    primary: '#2C3E50',
    secondary: '#6C757D',
    accent: '#E67E22',
    success: '#27AE60',
    warning: '#F39C12',
    danger: '#E74C3C',
    info: '#3498DB',
    light: '#F8F9FA',
    white: '#FFFFFF',
    transparent: 'rgba(0,0,0,0.1)'
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24
  },
  borderRadius: {
    sm: 6,
    md: 10,
    lg: 12,
    xl: 15
  },
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 5
    }
  },
  typography: {
    h1: { fontSize: 24, fontWeight: 'bold' },
    h2: { fontSize: 20, fontWeight: 'bold' },
    h3: { fontSize: 18, fontWeight: 'bold' },
    h4: { fontSize: 16, fontWeight: 'bold' },
    body: { fontSize: 14, lineHeight: 20 },
    caption: { fontSize: 12, lineHeight: 16 },
    small: { fontSize: 10, lineHeight: 14 }
  }
}

// 🧩 COMPONENTES REUTILIZÁVEIS
const InfoCard = ({ title, subtitle, children, style, variant = 'default' }: {
  title?: string
  subtitle?: string
  children: React.ReactNode
  style?: any
  variant?: 'default' | 'success' | 'warning' | 'info' | 'danger'
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return { backgroundColor: DESIGN_SYSTEM.colors.success + '20', borderLeftColor: DESIGN_SYSTEM.colors.success }
      case 'warning':
        return { backgroundColor: DESIGN_SYSTEM.colors.warning + '20', borderLeftColor: DESIGN_SYSTEM.colors.warning }
      case 'info':
        return { backgroundColor: DESIGN_SYSTEM.colors.info + '20', borderLeftColor: DESIGN_SYSTEM.colors.info }
      case 'danger':
        return { backgroundColor: DESIGN_SYSTEM.colors.danger + '20', borderLeftColor: DESIGN_SYSTEM.colors.danger }
      default:
        return { backgroundColor: DESIGN_SYSTEM.colors.white, borderLeftColor: DESIGN_SYSTEM.colors.accent }
    }
  }

  return (
    <View style={[
      styles.infoCard,
      getVariantStyles(),
      style
    ]}>
      {title && <Text style={styles.infoCardTitle}>{title}</Text>}
      {subtitle && <Text style={styles.infoCardSubtitle}>{subtitle}</Text>}
      {children}
    </View>
  )
}

const MetricDisplay = ({ value, label, icon, color }: {
  value: string | number
  label: string
  icon?: string
  color?: string
}) => (
  <View style={styles.metricDisplay}>
    {icon && <Text style={styles.metricIcon}>{icon}</Text>}
    <Text style={[styles.metricValue, { color: color || DESIGN_SYSTEM.colors.accent }]}>
      {value}
    </Text>
    <Text style={styles.metricLabel}>{label}</Text>
  </View>
)

const SectionHeader = ({ title, subtitle, icon, action }: {
  title: string
  subtitle?: string
  icon?: string
  action?: React.ReactNode
}) => (
  <View style={styles.sectionHeader}>
    <View style={styles.sectionHeaderLeft}>
      {icon && <Text style={styles.sectionHeaderIcon}>{icon}</Text>}
      <View>
        <Text style={styles.sectionHeaderTitle}>{title}</Text>
        {subtitle && <Text style={styles.sectionHeaderSubtitle}>{subtitle}</Text>}
      </View>
    </View>
    {action && <View style={styles.sectionHeaderAction}>{action}</View>}
  </View>
)

// 🎨 MAPEAMENTOS VISUAIS
const AREA_ICONS: { [key: string]: string } = {
  // Português
  'amor': 'heart',
  'carreira': 'briefcase',
  'financas': 'cash',
  'saude': 'fitness',
  'familia': 'home',
  'espiritualidade': 'sparkles',
  'comunicacao': 'chatbubbles',
  'transformacao': 'refresh-circle',
  // English fallback
  'love': 'heart',
  'career': 'briefcase',
  'finances': 'cash',
  'health': 'fitness',
  'family': 'home',
  'spirituality': 'sparkles',
  'communication': 'chatbubbles',
  'transformation': 'refresh-circle'
}

const AREA_COLORS: { [key: string]: [string, string] } = {
  // Português
  'amor': ['#FF6B9D', '#C44569'],
  'carreira': ['#4834D4', '#686DE0'],
  'financas': ['#00D2D3', '#01A3A4'],
  'saude': ['#FF9FF3', '#F368E0'],
  'familia': ['#FFA502', '#FF6348'],
  'espiritualidade': ['#7D5FFF', '#B742FF'],
  'comunicacao': ['#70A1FF', '#5352ED'],
  'transformacao': ['#FF3838', '#FF4757'],
  // English fallback
  'love': ['#FF6B9D', '#C44569'],
  'career': ['#4834D4', '#686DE0'],
  'finances': ['#00D2D3', '#01A3A4'],
  'health': ['#FF9FF3', '#F368E0'],
  'family': ['#FFA502', '#FF6348'],
  'spirituality': ['#7D5FFF', '#B742FF'],
  'communication': ['#70A1FF', '#5352ED'],
  'transformation': ['#FF3838', '#FF4757']
}

const STATUS_COLORS: { [key: string]: string } = {
  'excelente': '#2ECC71',
  'bom': '#27AE60',
  'neutro': '#F39C12',
  'desafiador': '#E74C3C',
  'crítico': '#C0392B',
  // English fallback
  'excellent': '#2ECC71',
  'good': '#27AE60',
  'neutral': '#F39C12',
  'challenging': '#E74C3C',
  'critical': '#C0392B'
}

const STATUS_LABELS: { [key: string]: string } = {
  'excelente': '🌟 Excelente',
  'bom': '✨ Bom',
  'neutro': '⚖️ Neutro',
  'desafiador': '⚠️ Desafiador',
  'crítico': '🚨 Crítico',
  // English fallback
  'excellent': '🌟 Excellent',
  'good': '✨ Good',
  'neutral': '⚖️ Neutral',
  'challenging': '⚠️ Challenging',
  'critical': '🚨 Critical'
}

const PLANET_ICONS: { [key: string]: string } = {
  'Sun': '☉',
  'Moon': '☽',
  'Mercury': '☿',
  'Venus': '♀',
  'Mars': '♂',
  'Jupiter': '♃',
  'Saturn': '♄',
  'Uranus': '♅',
  'Neptune': '♆',
  'Pluto': '♇'
}

const ASPECT_ICONS: { [key: string]: string } = {
  'conjunção': '☌',
  'sextil': '⚹',
  'quadratura': '□',
  'trígono': '△',
  'oposição': '☍',
  // English fallback
  'conjunction': '☌',
  'sextile': '⚹',
  'square': '□',
  'trine': '△',
  'opposition': '☍'
}

export const LifeAreaDetailModal: React.FC<LifeAreaDetailModalProps> = ({
  visible,
  onClose,
  areaData,
  transitData
}) => {
  if (!areaData) return null

  const areaKey = areaData.name.toLowerCase()
  const colors = AREA_COLORS[areaKey] || ['#4B5563', '#6B7280']
  const icon = AREA_ICONS[areaKey] || 'help-circle'
  const statusColor = STATUS_COLORS[areaData.status] || '#F39C12'
  const statusLabel = STATUS_LABELS[areaData.status] || areaData.status

  // 🔍 ANÁLISE DETALHADA DOS TRÂNSITOS
  const getDetailedAnalysis = () => {
    const analysis = {
      positiveInfluences: [] as string[],
      challengingInfluences: [] as string[],
      planetaryScores: {} as { [key: string]: number },
      aspectScores: {} as { [key: string]: number },
      debugArea: null as any,
      planetDetails: [] as Array<any>,
      topAspects: [] as Array<any>,
      // 🆕 NOVOS CAMPOS PARA CÁLCULOS PRECISOS
      totalBreakdown: {
        signScore: 0,
        houseScore: 0,
        aspectScore: 0,
        total: 0
      },
      areaFormula: ''
    }

    // 🎯 OBTER DADOS REAIS DO ENGINE
    const areaKeyLower = (areaData.name || '').toLowerCase()
    const debugArea = (transitData as any)?.currentTransits?.debug?.lifeAreas?.[areaKeyLower]
    
    if (debugArea) {
      analysis.debugArea = debugArea
      const planetDetails = Array.isArray(debugArea.planetDetails) ? debugArea.planetDetails : []
      analysis.planetDetails = planetDetails
      
      // 📊 CALCULAR BREAKDOWN REAL DA FÓRMULA
      let totalSignScore = 0
      let totalHouseScore = 0
      let totalAspectScore = 0
      let planetCount = 0
      
      planetDetails.forEach((pd: any) => {
        if (pd?.planet) {
          // Usar scores reais do engine
          analysis.planetaryScores[pd.planet] = Math.round(pd.total || 0)
          
          // Acumular para breakdown
          totalSignScore += pd.signScore || 0
          totalHouseScore += pd.houseScore || 0
          
          // Calcular score de aspectos (média ponderada)
          if (Array.isArray(pd.aspects) && pd.aspects.length > 0) {
            const aspectSum = pd.aspects.reduce((sum: number, a: any) => sum + (a.finalScore || 0), 0)
            const aspectAvg = aspectSum / pd.aspects.length
            totalAspectScore += aspectAvg
          }
          
          planetCount++
        }
      })
      
      // 📈 CALCULAR MÉDIAS E BREAKDOWN FINAL
      if (planetCount > 0) {
        analysis.totalBreakdown = {
          signScore: Math.round(totalSignScore / planetCount),
          houseScore: Math.round(totalHouseScore / planetCount),
          aspectScore: Math.round(totalAspectScore / planetCount),
          total: Math.round(debugArea.finalScore || 0)
        }
      }
      
      // 🧮 GERAR FÓRMULA REAL
      analysis.areaFormula = `Signos (30%) + Casas (30%) + Aspectos (40%) = ${analysis.totalBreakdown.total}%`
      
      // ✨ TOP ASPECTOS (REAIS DO ENGINE)
      const allAspects = planetDetails.flatMap((pd: any) => 
        Array.isArray(pd.aspects) ? pd.aspects.map((a: any) => ({...a, of: pd.planet})) : []
      )
      analysis.topAspects = allAspects
        .sort((a: any, b: any) => (b.finalScore || 0) - (a.finalScore || 0))
        .slice(0, 8)
      
      // 🎯 CLASSIFICAR INFLUÊNCIAS BASEADO NOS SCORES REAIS
      analysis.positiveInfluences = []
      analysis.challengingInfluences = []
      
      // Usar aspectos reais para classificação
      analysis.topAspects.forEach((aspect: any) => {
        if (aspect.finalScore >= 60) {
          analysis.positiveInfluences.push(`${aspect.type} ${aspect.with} (${Math.round(aspect.finalScore)})`)
        } else {
          analysis.challengingInfluences.push(`${aspect.type} ${aspect.with} (${Math.round(aspect.finalScore)})`)
        }
      })
      
      // Fallback para influências textuais se não há aspectos
      if (analysis.positiveInfluences.length === 0 && analysis.challengingInfluences.length === 0) {
        areaData.influences.forEach(influence => {
          const isPositive = influence.includes('trígono') || influence.includes('sextil') || influence.includes('conjunção')
          const isNegative = influence.includes('quadratura') || influence.includes('oposição')
          
          if (isPositive) {
            analysis.positiveInfluences.push(influence)
          } else if (isNegative) {
            analysis.challengingInfluences.push(influence)
          }
        })
      }
    } else {
      // 🚨 FALLBACK: DADOS SIMPLIFICADOS (quando não há debug)
      console.warn('ASTRO DEBUG: Modal sem dados de debug - usando fallback')
      
      // Analisar influências textuais
      areaData.influences.forEach(influence => {
        const isPositive = influence.includes('trígono') || influence.includes('sextil') || influence.includes('conjunção')
        const isNegative = influence.includes('quadratura') || influence.includes('oposição')
        
        if (isPositive) {
          analysis.positiveInfluences.push(influence)
        } else if (isNegative) {
          analysis.challengingInfluences.push(influence)
        }
      })

      // Calcular scores dos planetas (fallback)
      areaData.mainPlanets.forEach(planet => {
        const aspectHint = areaData.influences.filter(inf => inf.includes(planet)).length
        const baseScore = 50 // neutro
        const aspectBonus = Math.min(20, aspectHint * 5)
        analysis.planetaryScores[planet] = Math.min(100, baseScore + aspectBonus)
      })
      
      // Fórmula fallback
      analysis.areaFormula = `Dignidades (30%) + Casas (30%) + Aspectos (40%) = ${areaData.percentage}%`
    }

    return analysis
  }

  const analysis = getDetailedAnalysis()
  const housesApprox = Boolean((transitData as any)?.currentTransits?.housesApproximate)

  // 🧠 SISTEMA DE INTELIGÊNCIA E PERSONALIZAÇÃO
  const [userPreferences, setUserPreferences] = React.useState({
    showTechnicalDetails: false,
    showAdvancedInsights: false,
    preferredLanguage: 'pt-BR',
    showDebugInfo: false
  })

  const [activeFilters, setActiveFilters] = React.useState({
    aspectScore: 'all', // 'all', 'high', 'medium', 'low'
    aspectType: 'all', // 'all', 'harmonious', 'challenging'
    planetInfluence: 'all' // 'all', 'strong', 'moderate', 'weak'
  })

  // 🎯 ANÁLISE INTELIGENTE BASEADA NO SCORE
  const getIntelligentAnalysis = () => {
    const score = areaData.percentage
    const isHighScore = score >= 70
    const isMediumScore = score >= 50 && score < 70
    const isLowScore = score < 50

    return {
      energyLevel: isHighScore ? 'excepcional' : isMediumScore ? 'equilibrado' : 'transformador',
      recommendedFocus: isHighScore ? 'expansão' : isMediumScore ? 'consolidação' : 'transformação',
      timeHorizon: isHighScore ? 'curto prazo (7-14 dias)' : isMediumScore ? 'médio prazo (2-4 semanas)' : 'longo prazo (1-2 meses)',
      riskLevel: isHighScore ? 'baixo' : isMediumScore ? 'moderado' : 'alto',
      opportunityType: isHighScore ? 'crescimento acelerado' : isMediumScore ? 'crescimento sustentável' : 'crescimento através de desafios'
    }
  }

  // 🔍 FILTROS INTELIGENTES PARA ASPECTOS
  const getFilteredAspects = () => {
    let filtered = analysis.topAspects

    // Filtro por score
    if (activeFilters.aspectScore !== 'all') {
      filtered = filtered.filter(aspect => {
        const score = aspect.finalScore || 0
        switch (activeFilters.aspectScore) {
          case 'high': return score >= 80
          case 'medium': return score >= 60 && score < 80
          case 'low': return score < 60
          default: return true
        }
      })
    }

    // Filtro por tipo
    if (activeFilters.aspectType !== 'all') {
      filtered = filtered.filter(aspect => {
        const isHarmonious = ['trígono', 'sextil', 'conjunção'].includes(aspect.type)
        switch (activeFilters.aspectType) {
          case 'harmonious': return isHarmonious
          case 'challenging': return !isHarmonious
          default: return true
        }
      })
    }

    return filtered
  }

  // 📊 MÉTRICAS INTELIGENTES
  const getIntelligentMetrics = () => {
    const filteredAspects = getFilteredAspects()
    const totalAspects = analysis.topAspects.length
    const highScoreAspects = filteredAspects.filter(a => (a.finalScore || 0) >= 80).length
    const harmoniousAspects = filteredAspects.filter(a => ['trígono', 'sextil', 'conjunção'].includes(a.type)).length

    return {
      totalAspects,
      filteredAspects: filteredAspects.length,
      highScorePercentage: totalAspects > 0 ? Math.round((highScoreAspects / totalAspects) * 100) : 0,
      harmoniousPercentage: totalAspects > 0 ? Math.round((harmoniousAspects / totalAspects) * 100) : 0,
      averageScore: filteredAspects.length > 0 ? 
        Math.round(filteredAspects.reduce((sum, a) => sum + (a.finalScore || 0), 0) / filteredAspects.length) : 0
    }
  }

  // 🎨 CONTEÚDO ADAPTATIVO BASEADO NO SCORE
  const getAdaptiveContent = () => {
    const score = areaData.percentage
    const intelligentAnalysis = getIntelligentAnalysis()

    if (score >= 70) {
      return {
        headerColor: DESIGN_SYSTEM.colors.success,
        headerMessage: `✨ Energia ${intelligentAnalysis.energyLevel}`,
        primaryAction: 'APROVEITAR',
        secondaryAction: 'EXPANDIR',
        focusMessage: 'Momento de máxima eficiência - aja com confiança!'
      }
    } else if (score >= 50) {
      return {
        headerColor: DESIGN_SYSTEM.colors.warning,
        headerMessage: `⚖️ Energia ${intelligentAnalysis.energyLevel}`,
        primaryAction: 'CONSOLIDAR',
        secondaryAction: 'AJUSTAR',
        focusMessage: 'Momento de estabilização - mantenha o que funciona!'
      }
    } else {
      return {
        headerColor: DESIGN_SYSTEM.colors.danger,
        headerMessage: `🔄 Energia ${intelligentAnalysis.energyLevel}`,
        primaryAction: 'TRANSFORMAR',
        secondaryAction: 'CRESCER',
        focusMessage: 'Momento de transformação - use os desafios como oportunidades!'
      }
    }
  }

  const intelligentMetrics = getIntelligentMetrics()
  const adaptiveContent = getAdaptiveContent()

  // 📈 MÉTRICAS DE SUCESSO E FEEDBACK
  const [userFeedback, setUserFeedback] = React.useState({
    helpful: false,
    accuracy: 0, // 1-5
    suggestions: ''
  })

  const [performanceMetrics, setPerformanceMetrics] = React.useState({
    timeSpent: 0,
    sectionsViewed: new Set<string>(),
    interactions: 0
  })

  // 🎯 SISTEMA DE FEEDBACK
  const handleFeedback = (type: 'helpful' | 'accuracy' | 'suggestion', value: any) => {
    setUserFeedback(prev => ({ ...prev, [type]: value }))
    
    // Log para análise de UX
    console.log('ASTRO UX FEEDBACK:', { type, value, area: areaData.name, timestamp: new Date().toISOString() })
  }

  // ⏱️ TRACKING DE PERFORMANCE
  React.useEffect(() => {
    const startTime = Date.now()
    
    return () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000)
      setPerformanceMetrics(prev => ({ ...prev, timeSpent }))
      
      // Log de métricas de performance
      console.log('ASTRO UX METRICS:', {
        area: areaData.name,
        timeSpent,
        sectionsViewed: Array.from(performanceMetrics.sectionsViewed),
        interactions: performanceMetrics.interactions
      })
    }
  }, [])

  // 🎨 HEADER INTELIGENTE COM CONTEÚDO ADAPTATIVO
  const renderIntelligentHeader = () => (
    <LinearGradient
      colors={colors}
      style={styles.headerCompact}
    >
      <View style={styles.headerContentCompact}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={24} color="white" />
        </TouchableOpacity>
        
        <View style={styles.headerMainCompact}>
          <View style={styles.headerIconContainerCompact}>
            <Ionicons name={icon as any} size={32} color="white" />
          </View>
          
          <Text style={styles.areaTitleCompact}>{areaData.name.toUpperCase()}</Text>
          
          <View style={styles.scoreMainContainerCompact}>
            <Text style={styles.scoreMainValueCompact}>{areaData.percentage}%</Text>
            <Text style={styles.headerAdaptiveMessage}>{adaptiveContent.headerMessage}</Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  )

  // 🔍 FILTROS INTELIGENTES INTERATIVOS
  const renderIntelligentFilters = () => (
    <InfoCard
      title="🔍 Filtros Inteligentes"
      subtitle="Personalize sua análise"
      variant="info"
    >
      <View style={styles.filterRow}>
        <Text style={styles.filterLabel}>Score dos Aspectos:</Text>
        <View style={styles.filterButtons}>
          {['all', 'high', 'medium', 'low'].map(filter => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterButton,
                activeFilters.aspectScore === filter && styles.filterButtonActive
              ]}
              onPress={() => setActiveFilters(prev => ({ ...prev, aspectScore: filter }))}
            >
              <Text style={[
                styles.filterButtonText,
                activeFilters.aspectScore === filter && styles.filterButtonTextActive
              ]}>
                {filter === 'all' ? 'Todos' : filter === 'high' ? 'Altos' : filter === 'medium' ? 'Médios' : 'Baixos'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      <View style={styles.filterRow}>
        <Text style={styles.filterLabel}>Tipo de Aspecto:</Text>
        <View style={styles.filterButtons}>
          {['all', 'harmonious', 'challenging'].map(filter => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterButton,
                activeFilters.aspectType === filter && styles.filterButtonActive
              ]}
              onPress={() => setActiveFilters(prev => ({ ...prev, aspectType: filter }))}
            >
              <Text style={[
                styles.filterButtonText,
                activeFilters.aspectType === filter && styles.filterButtonTextActive
              ]}>
                {filter === 'all' ? 'Todos' : filter === 'harmonious' ? 'Harmoniosos' : 'Desafiadores'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </InfoCard>
  )

  // 📊 MÉTRICAS INTELIGENTES VISUAIS
  const renderIntelligentMetrics = () => (
    <InfoCard
      title="📊 Métricas Inteligentes"
      subtitle="Análise baseada nos filtros ativos"
      variant="success"
    >
      <View style={styles.metricsGrid}>
        <MetricDisplay
          value={intelligentMetrics.filteredAspects}
          label="Aspectos Filtrados"
          icon="✨"
          color={DESIGN_SYSTEM.colors.info}
        />
        <MetricDisplay
          value={`${intelligentMetrics.highScorePercentage}%`}
          label="Score Alto (80%+)"
          icon="🌟"
          color={DESIGN_SYSTEM.colors.success}
        />
        <MetricDisplay
          value={`${intelligentMetrics.harmoniousPercentage}%`}
          label="Harmoniosos"
          icon="💫"
          color={DESIGN_SYSTEM.colors.primary}
        />
        <MetricDisplay
          value={intelligentMetrics.averageScore}
          label="Score Médio"
          icon="📊"
          color={DESIGN_SYSTEM.colors.accent}
        />
      </View>
    </InfoCard>
  )

  // 🎯 CALL-TO-ACTION INTELIGENTE
  const renderIntelligentCTA = () => (
    <InfoCard
      title="🎯 Ação Recomendada"
      subtitle={adaptiveContent.focusMessage}
      variant="success"
    >
      <View style={styles.ctaContainer}>
        <TouchableOpacity style={[styles.ctaButton, { backgroundColor: adaptiveContent.headerColor }]}>
          <Text style={styles.ctaButtonText}>{adaptiveContent.primaryAction}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.ctaButton, { backgroundColor: DESIGN_SYSTEM.colors.secondary }]}>
          <Text style={styles.ctaButtonText}>{adaptiveContent.secondaryAction}</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.ctaInsight}>
        💡 Foque em: <Text style={styles.ctaInsightHighlight}>{getIntelligentAnalysis().recommendedFocus}</Text>
      </Text>
      <Text style={styles.ctaInsight}>
        ⏰ Horizonte: <Text style={styles.ctaInsightHighlight}>{getIntelligentAnalysis().timeHorizon}</Text>
      </Text>
    </InfoCard>
  )

  // 📝 SISTEMA DE FEEDBACK DO USUÁRIO
  const renderUserFeedback = () => (
    <InfoCard
      title="📝 Sua Opinião"
      subtitle="Ajude-nos a melhorar"
      variant="info"
    >
      <View style={styles.feedbackRow}>
        <Text style={styles.feedbackLabel}>Esta análise foi útil?</Text>
        <View style={styles.feedbackButtons}>
          <TouchableOpacity
            style={[
              styles.feedbackButton,
              userFeedback.helpful === true && styles.feedbackButtonActive
            ]}
            onPress={() => handleFeedback('helpful', true)}
          >
            <Text style={styles.feedbackButtonText}>👍 Sim</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.feedbackButton,
              userFeedback.helpful === false && styles.feedbackButtonActive
            ]}
            onPress={() => handleFeedback('helpful', false)}
          >
            <Text style={styles.feedbackButtonText}>👎 Não</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.feedbackRow}>
        <Text style={styles.feedbackLabel}>Precisão da análise:</Text>
        <View style={styles.ratingContainer}>
          {[1, 2, 3, 4, 5].map(rating => (
            <TouchableOpacity
              key={rating}
              style={[
                styles.ratingButton,
                userFeedback.accuracy === rating && styles.ratingButtonActive
              ]}
              onPress={() => handleFeedback('accuracy', rating)}
            >
              <Text style={styles.ratingButtonText}>{rating}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </InfoCard>
  )

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* 🎨 HEADER INTELIGENTE COM CONTEÚDO ADAPTATIVO */}
        {renderIntelligentHeader()}

        {/* 📱 CONTEÚDO HIERÁRQUICO ORGANIZADO */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          
          {/* 🟢 NÍVEL 1: LEIGOS (VISÍVEL IMEDIATAMENTE) */}
          <View style={styles.section}>
            <SectionHeader
              title="📊 Resumo Executivo"
              subtitle="Visão geral da situação atual"
              icon="🎯"
            />
            <InfoCard variant="success">
              <Text style={styles.summaryTextCompact}>
                {areaData.percentage >= 70 ? 
                  `✨ Momento excepcional para ${areaData.name.toLowerCase()}! Aproveite esta energia cósmica favorável.` :
                 areaData.percentage >= 50 ? 
                  `⚖️ Energia equilibrada em ${areaData.name.toLowerCase()}. Bom momento para ajustes graduais.` :
                  `🔄 Período de transformação em ${areaData.name.toLowerCase()}. Use os desafios como oportunidades.`
                }
              </Text>
            </InfoCard>
          </View>

          {/* 🔍 FILTROS INTELIGENTES INTERATIVOS */}
          {renderIntelligentFilters()}

          {/* 📊 MÉTRICAS INTELIGENTES VISUAIS */}
          {renderIntelligentMetrics()}

          {/* 🎯 CALL-TO-ACTION INTELIGENTE */}
          {renderIntelligentCTA()}

          <View style={styles.section}>
            <SectionHeader
              title="💡 Dicas Práticas"
              subtitle="Ações específicas para este momento"
              icon="💡"
            />
            <InfoCard variant="warning">
              {areaData.percentage >= 70 && (
                <>
                  <Text style={styles.tipTextCompact}>• Aproveite a energia favorável para iniciar novos projetos</Text>
                  <Text style={styles.tipTextCompact}>• Faça conexões e networking ativo</Text>
                  <Text style={styles.tipTextCompact}>• Tome decisões importantes com confiança</Text>
                </>
              )}
              {areaData.percentage >= 50 && areaData.percentage < 70 && (
                <>
                  <Text style={styles.tipTextCompact}>• Mantenha o que está funcionando</Text>
                  <Text style={styles.tipTextCompact}>• Faça ajustes graduais e planejados</Text>
                  <Text style={styles.tipTextCompact}>• Consolide suas conquistas</Text>
                </>
              )}
              {areaData.percentage < 50 && (
                <>
                  <Text style={styles.tipTextCompact}>• Use os desafios como oportunidades de crescimento</Text>
                  <Text style={styles.tipTextCompact}>• Pratique paciência e resiliência</Text>
                  <Text style={styles.tipTextCompact}>• Foque no desenvolvimento pessoal</Text>
                </>
              )}
            </InfoCard>
          </View>

          <View style={styles.section}>
            <SectionHeader
              title="🎯 Recomendações Imediatas"
              subtitle="O que fazer agora, esta semana e o que evitar"
              icon="🎯"
            />
            <InfoCard>
              <View style={styles.recommendationItemCompact}>
                <Text style={styles.recommendationTitleCompact}>🚀 O que fazer AGORA:</Text>
                <Text style={styles.recommendationTextCompact}>
                  {areaData.percentage >= 70 ? 'Aproveite a energia favorável para avanços' : 
                   areaData.percentage >= 50 ? 'Mantenha o que está funcionando' : 
                   'Use os desafios como oportunidades de crescimento'}
                </Text>
              </View>
              <View style={styles.recommendationItemCompact}>
                <Text style={styles.recommendationTitleCompact}>⏰ Esta semana:</Text>
                <Text style={styles.recommendationTextCompact}>
                  {areaData.percentage >= 70 ? 'Foque em expansão e crescimento' : 
                   areaData.percentage >= 50 ? 'Faça ajustes graduais' : 
                   'Pratique paciência e resiliência'}
                </Text>
              </View>
              <View style={styles.recommendationItemCompact}>
                <Text style={styles.recommendationTitleCompact}>⚠️ Evite:</Text>
                <Text style={styles.recommendationTextCompact}>
                  {areaData.percentage >= 70 ? 'Perder oportunidades por indecisão' : 
                   areaData.percentage >= 50 ? 'Mudanças bruscas' : 
                   'Desistir diante dos desafios'}
                </Text>
              </View>
            </InfoCard>
          </View>

          {/* 🟡 NÍVEL 2: INTERMEDIÁRIO (EXPANSÍVEL) */}
          <View style={styles.section}>
            <SectionHeader
              title="🌟 Planetas Principais"
              subtitle="Top 3 planetas mais influentes nesta área"
              icon="🌟"
            />
            {analysis.planetDetails.slice(0, 3).map((planetData: any, index: number) => (
              <InfoCard key={index} style={styles.planetCardCompact}>
                <View style={styles.planetHeaderCompact}>
                  <Text style={styles.planetIconCompact}>{PLANET_ICONS[planetData.planet] || '🪐'}</Text>
                  <Text style={styles.planetNameCompact}>{planetData.planet}</Text>
                  <View style={styles.planetScoreCompact}>
                    <Text style={styles.planetScoreValueCompact}>{Math.round(planetData.total || 0)}%</Text>
                  </View>
                </View>
                <Text style={styles.planetImpactCompact}>
                  Impacto: {planetData.planet} contribui com {Math.round((planetData.total || 0) / (analysis.planetDetails.length || 1) * 100)}% 
                  do score total
                </Text>
              </InfoCard>
            ))}
          </View>

          <View style={styles.section}>
            <SectionHeader
              title="✨ Aspectos Destacados"
              subtitle="Aspectos mais importantes para esta área"
              icon="✨"
            />
            {getFilteredAspects().slice(0, 5).map((aspect: any, index: number) => (
              <InfoCard key={index} style={styles.aspectCardCompact}>
                <Text style={styles.aspectIconCompact}>{ASPECT_ICONS[aspect.type] || '∠'}</Text>
                <View style={styles.aspectContentCompact}>
                  <Text style={styles.aspectTextCompact}>
                    {aspect.type} com {aspect.with} • orb {aspect.orb?.toFixed ? aspect.orb.toFixed(1) : aspect.orb}°
                  </Text>
                  <Text style={styles.aspectDetailsCompact}>
                    {aspect.isApplying ? '🔄 Aplicante' : '📤 Separante'} • Score: {Math.round(aspect.finalScore || 0)}
                  </Text>
                </View>
              </InfoCard>
            ))}
          </View>

          <View style={styles.section}>
            <SectionHeader
              title="📈 Tendências"
              subtitle="Direção geral e períodos favoráveis"
              icon="📈"
            />
            <InfoCard>
              <View style={styles.trendItemCompact}>
                <Text style={styles.trendTitleCompact}>Direção Geral:</Text>
                <Text style={styles.trendTextCompact}>
                  {areaData.percentage >= 70 ? 'Muito favorável para avanços' : 
                   areaData.percentage >= 50 ? 'Moderadamente favorável' : 'Desafiador mas transformador'}
                </Text>
              </View>
              <View style={styles.trendItemCompact}>
                <Text style={styles.trendTitleCompact}>Períodos Favoráveis:</Text>
                <Text style={styles.trendTextCompact}>
                  {areaData.percentage >= 70 ? 'Próximos 7-14 dias' : 
                   areaData.percentage >= 50 ? 'Próximas 2-3 semanas' : 'Próximas 4-6 semanas'}
                </Text>
              </View>
              <View style={styles.trendItemCompact}>
                <Text style={styles.trendTitleCompact}>Alertas:</Text>
                <Text style={styles.trendTextCompact}>
                  {areaData.percentage >= 70 ? 'Aproveite ao máximo esta energia' : 
                   areaData.percentage >= 50 ? 'Mantenha o equilíbrio' : 'Foque na transformação interna'}
                </Text>
              </View>
            </InfoCard>
          </View>

          {/* 🔴 NÍVEL 3: TÉCNICO (COLAPSÁVEL) */}
          <View style={styles.section}>
            <SectionHeader
              title="🧮 Cálculos Detalhados"
              subtitle="Fórmulas e breakdowns técnicos"
              icon="🧮"
            />
            <InfoCard variant="warning">
              <Text style={styles.calculationTitleCompact}>Fórmula do Cálculo:</Text>
              <Text style={styles.calculationFormulaCompact}>
                {analysis.areaFormula}
              </Text>
              <View style={styles.calculationBreakdownCompact}>
                <Text style={styles.calculationItemCompact}>
                  • Dignidades: {analysis.totalBreakdown.signScore}%
                </Text>
                <Text style={styles.calculationItemCompact}>
                  • Casas: {analysis.totalBreakdown.houseScore}%
                </Text>
                <Text style={styles.calculationItemCompact}>
                  • Aspectos: {analysis.totalBreakdown.aspectScore}%
                </Text>
              </View>
            </InfoCard>
          </View>

          <View style={styles.section}>
            <SectionHeader
              title="🪐 Análise Planetária Completa"
              subtitle="Dados técnicos de todos os planetas"
              icon="🪐"
            />
            {analysis.planetDetails.map((planetData: any, index: number) => (
              <InfoCard key={index} style={styles.planetAnalysisCardCompact}>
                <View style={styles.planetAnalysisHeaderCompact}>
                  <Text style={styles.planetAnalysisIconCompact}>{PLANET_ICONS[planetData.planet] || '🪐'}</Text>
                  <Text style={styles.planetAnalysisNameCompact}>{planetData.planet}</Text>
                  <Text style={styles.planetAnalysisScoreCompact}>{Math.round(planetData.total || 0)}%</Text>
                </View>
                <View style={styles.planetBreakdownCompact}>
                  <Text style={styles.planetBreakdownTextCompact}>
                    Dignidades: {Math.round(planetData.signScore || 0)}% • Casa: {Math.round(planetData.houseScore || 0)}%
                  </Text>
                  {Array.isArray(planetData.aspects) && planetData.aspects.length > 0 && (
                    <Text style={styles.planetAspectsTextCompact}>
                      Aspectos: {planetData.aspects.length} • Score médio: {Math.round(planetData.aspects.reduce((sum: number, a: any) => sum + (a.finalScore || 0), 0) / planetData.aspects.length)}
                    </Text>
                  )}
                </View>
              </InfoCard>
            ))}
          </View>

          <View style={styles.section}>
            <SectionHeader
              title="🔮 Insights Avançados"
              subtitle="Análises profundas e padrões cósmicos"
              icon="🔮"
            />
            <InfoCard>
              <Text style={styles.insightTextCompact}>
                {areaData.percentage >= 70 ? 
                  `Harmonia elemental excepcional em ${areaData.name.toLowerCase()}. Elementos em perfeita sintonia criam fluxo de energia favorável.` :
                 areaData.percentage >= 50 ? 
                  `Equilíbrio elemental moderado permite crescimento estável e sustentável em ${areaData.name.toLowerCase()}.` :
                  `Tensão elemental em ${areaData.name.toLowerCase()} cria oportunidades de transformação e evolução através da superação.`
                }
              </Text>
            </InfoCard>
          </View>

          {analysis.debugArea && (
            <View style={styles.section}>
              <SectionHeader
                title="🧭 Logs e Debug"
                subtitle="Dados técnicos para desenvolvedores"
                icon="🧭"
              />
              <InfoCard variant="info">
                <Text style={styles.debugTextCompact}>
                  Área analisada: {areaData.name} • Planetas: {analysis.planetDetails.length} • 
                  Aspectos: {analysis.topAspects.length} • Score final: {analysis.totalBreakdown.total}%
                </Text>
                <Text style={styles.debugTextCompact}>
                  Dados de debug disponíveis: {analysis.debugArea ? 'Sim' : 'Não'} • 
                  Precisão: {analysis.debugArea ? 'Alta' : 'Estimada'}
                </Text>
              </InfoCard>
            </View>
          )}

          {/* 📝 SISTEMA DE FEEDBACK DO USUÁRIO */}
          {renderUserFeedback()}

        </ScrollView>

        {/* 🆕 FECHAMENTO ELEGANTE */}
        <View style={styles.section}>
          <InfoCard variant="success">
            <Text style={styles.closingTitle}>
              ✨ Análise Astrológica Completa
            </Text>
            <Text style={styles.closingSubtitle}>
              {areaData.name} • {new Date().toLocaleDateString('pt-BR')}
            </Text>
            
            <View style={styles.closingMetrics}>
              <View style={styles.closingMetric}>
                <Text style={styles.closingMetricValue}>{analysis.totalBreakdown.total || areaData.percentage}%</Text>
                <Text style={styles.closingMetricLabel}>Energia Positiva</Text>
              </View>
              <View style={styles.closingMetric}>
                <Text style={styles.closingMetricValue}>{analysis.planetDetails.length || areaData.mainPlanets.length}</Text>
                <Text style={styles.closingMetricLabel}>Planetas Analisados</Text>
              </View>
              <View style={styles.closingMetric}>
                <Text style={styles.closingMetricValue}>{analysis.topAspects.length}</Text>
                <Text style={styles.closingMetricLabel}>Aspectos Identificados</Text>
              </View>
            </View>
            
            <Text style={styles.closingMessage}>
              🌟 Que a sabedoria dos astros ilumine seu caminho em {areaData.name.toLowerCase()}. 
              Use estes insights para tomar decisões conscientes e alinhadas com a energia cósmica.
            </Text>
            
            <View style={styles.closingSignature}>
              <Text style={styles.closingSignatureText}>
                ✨ Tabula Estelar - Astrologia Profissional
              </Text>
              <Text style={styles.closingSignatureSubtext}>
                Análise gerada com precisão astrológica
              </Text>
            </View>
          </InfoCard>
        </View>

      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA'
  },
  headerCompact: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    maxHeight: 120,
  },
  headerContentCompact: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    height: 50,
  },
  closeButton: {
    position: 'absolute',
    top: -30,
    right: 0,
    padding: 10,
    zIndex: 10,
  },
  headerMainCompact: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 20,
  },
  headerIconContainerCompact: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  areaTitleCompact: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    flex: 1,
  },
  scoreMainContainerCompact: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreMainValueCompact: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
    lineHeight: 48,
  },
  influenceMap: {
    width: '100%',
    marginTop: 10,
    marginBottom: 20
  },
  influenceMapLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginBottom: 8
  },
  influenceMapBar: {
    height: 10,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 5,
    overflow: 'hidden'
  },
  influenceMapSegment: {
    height: '100%',
    borderRadius: 5
  },
  trendIndicators: {
    alignItems: 'center',
    marginBottom: 20
  },
  trendIndicator: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center'
  },
  trendIndicatorText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold'
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 10,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6C757D',
    marginBottom: 15,
    textAlign: 'center',
  },
  influenceCard: {
    padding: 15,
    borderRadius: 12,
    marginBottom: 10
  },
  positiveCard: {
    backgroundColor: '#E8F5E8',
    borderLeftWidth: 4,
    borderLeftColor: '#27AE60'
  },
  challengingCard: {
    backgroundColor: '#FDEDED',
    borderLeftWidth: 4,
    borderLeftColor: '#E74C3C'
  },
  influenceText: {
    fontSize: 16,
    color: '#2C3E50',
    fontWeight: '500'
  },
  planetCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  planetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  planetIcon: {
    fontSize: 24,
    marginRight: 10
  },
  planetName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50'
  },
  planetConditions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
    paddingHorizontal: 5,
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#B0B0B0'
  },
  planetConditionTag: {
    fontSize: 12,
    color: '#333',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 3,
    marginRight: 5,
    marginBottom: 3,
    backgroundColor: '#F0F0F0'
  },
  planetBreakdown: {
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D0D0D0'
  },
  planetBreakdownText: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center'
  },
  scoreBar: {
    height: 8,
    backgroundColor: '#E9ECEF',
    borderRadius: 4,
    marginBottom: 5
  },
  scoreBarFill: {
    height: '100%',
    borderRadius: 4
  },
  scoreText: {
    fontSize: 14,
    color: '#6C757D',
    textAlign: 'right'
  },
  summaryCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  summaryText: {
    fontSize: 16,
    color: '#2C3E50',
    lineHeight: 24,
    marginBottom: 10
  },
  tipsCard: {
    backgroundColor: '#FFF3CD',
    padding: 20,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107'
  },
  tipText: {
    fontSize: 16,
    color: '#856404',
    lineHeight: 24
  },
  // 📊 ESTILOS PARA CÁLCULOS DETALHADOS
  calculationCard: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FFD700',
  },
  calculationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  calculationFormula: {
    fontSize: 18,
    fontWeight: '600',
    color: '#E67E22',
    textAlign: 'center',
    marginBottom: 12,
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 8,
  },
  calculationBreakdown: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
  },
  calculationItems: {
    marginLeft: 8,
  },
  calculationItem: {
    fontSize: 14,
    color: '#34495E',
    marginBottom: 4,
    lineHeight: 20,
  },
  // ✨ ESTILOS PARA ASPECTOS (REORGANIZADOS)
  aspectCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  aspectIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  aspectContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  aspectTextContainer: {
    flex: 1,
  },
  aspectText: {
    fontSize: 14,
    color: '#2C3E50',
    marginBottom: 2,
  },
  aspectOrb: {
    fontSize: 12,
    color: '#6C757D',
    marginTop: 2,
  },
  aspectStatus: {
    fontSize: 12,
    color: '#6C757D',
    marginTop: 2,
  },
  aspectScore: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#27AE60',
  },
  // 🆕 ESTILOS PARA BREAKDOWN VISUAL
  breakdownVisual: {
    marginTop: 15,
    paddingHorizontal: 10,
  },
  breakdownVisualTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 10,
    textAlign: 'center',
  },
  breakdownBar: {
    flexDirection: 'row',
    height: 20,
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    overflow: 'hidden',
  },
  breakdownSegment: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  breakdownLabel: {
    fontSize: 12,
    color: '#6C757D',
    marginBottom: 2,
  },
  breakdownValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  // 🆕 ESTILOS PARA SCORE FINAL REAL
  finalScoreCard: {
    marginTop: 20,
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#FFD700',
  },
  finalScoreTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  finalScoreValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#E67E22',
    textAlign: 'center',
    marginBottom: 5,
  },
  finalScoreBreakdown: {
    fontSize: 14,
    color: '#6C757D',
    textAlign: 'center',
  },
  // 🚨 ESTILOS PARA ALERTA DE PRECISÃO
  accuracyAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3CD',
    padding: 15,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
    marginBottom: 15,
  },
  accuracyAlertIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  accuracyAlertText: {
    fontSize: 14,
    color: '#856404',
    flex: 1,
  },
  // 🆕 ESTILOS PARA RESUMO EXECUTIVO
  executiveSummaryCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 20,
  },
  executiveHeader: {
    alignItems: 'center',
    marginBottom: 15,
  },
  executiveTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
  },
  executiveSubtitle: {
    fontSize: 14,
    color: '#6C757D',
    marginTop: 5,
  },
  executiveMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  executiveMetric: {
    alignItems: 'center',
  },
  executiveMetricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E67E22',
  },
  executiveMetricLabel: {
    fontSize: 14,
    color: '#6C757D',
    marginTop: 5,
  },
  executiveInsight: {
    fontSize: 16,
    color: '#2C3E50',
    lineHeight: 24,
    textAlign: 'center',
  },
  // 🆕 ESTILOS PARA TRÂNSITOS DETALHADOS
  transitsOverviewCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 20,
  },
  transitsOverviewTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 15,
  },
  transitsOverviewMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  transitMetric: {
    alignItems: 'center',
  },
  transitMetricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E67E22',
  },
  transitMetricLabel: {
    fontSize: 14,
    color: '#6C757D',
    marginTop: 5,
  },
  planetAnalysisCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  planetAnalysisHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  planetAnalysisIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  planetAnalysisName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    flex: 1,
  },
  planetAnalysisScore: {
    alignItems: 'center',
  },
  planetAnalysisScoreValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E67E22',
  },
  planetAnalysisScoreLabel: {
    fontSize: 12,
    color: '#6C757D',
    marginTop: 2,
  },
  planetBreakdownDetailed: {
    marginBottom: 10,
  },
  planetBreakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  planetBreakdownLabel: {
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
  },
  planetBreakdownValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  planetBreakdownImpact: {
    fontSize: 12,
    color: '#6C757D',
    marginTop: 2,
  },
  planetImpactCard: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D0D0D0',
  },
  planetImpactTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  planetImpactFormula: {
    fontSize: 14,
    color: '#34495E',
    marginBottom: 10,
  },
  planetImpactBar: {
    height: 8,
    backgroundColor: '#E9ECEF',
    borderRadius: 4,
    overflow: 'hidden',
  },
  planetImpactBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  planetAspectsSection: {
    marginTop: 15,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  planetAspectsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  planetAspectCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 10,
    borderRadius: 8,
    marginBottom: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  planetAspectIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  planetAspectContent: {
    flex: 1,
  },
  planetAspectText: {
    fontSize: 14,
    color: '#2C3E50',
    marginBottom: 2,
  },
  planetAspectDetails: {
    fontSize: 12,
    color: '#6C757D',
    marginTop: 2,
  },
  planetAspectScore: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  planetFallbackInfo: {
    backgroundColor: '#FFF3CD',
    padding: 10,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
    marginTop: 10,
  },
  planetFallbackText: {
    fontSize: 14,
    color: '#856404',
    textAlign: 'center',
  },
  // 🆕 ESTILOS PARA ASPECTOS ENHANCED
  aspectCardEnhanced: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  aspectScoreContainer: {
    alignItems: 'center',
    marginLeft: 10,
  },
  aspectScoreLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  // 🆕 ESTILOS PARA ANÁLISE DE DESAFIOS
  challengesAnalysisCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginTop: 15,
    marginBottom: 15,
  },
  challengesAnalysisTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 10,
    textAlign: 'center',
  },
  challengesAnalysisText: {
    fontSize: 14,
    color: '#6C757D',
    lineHeight: 22,
    textAlign: 'center',
  },
  // 🆕 ESTILOS PARA RECOMENDAÇÕES
  recommendationsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 20,
  },
  recommendationsHeader: {
    alignItems: 'center',
    marginBottom: 15,
  },
  recommendationsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
  },
  recommendationsSubtitle: {
    fontSize: 14,
    color: '#6C757D',
    marginTop: 5,
  },
  recommendationsCategories: {
    marginTop: 15,
  },
  recommendationCategory: {
    marginBottom: 20,
  },
  recommendationCategoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 10,
  },
  recommendationItems: {
    marginLeft: 10,
  },
  recommendationItem: {
    fontSize: 14,
    color: '#34495E',
    lineHeight: 22,
    marginBottom: 5,
  },
  // 🆕 ESTILOS PARA FILTROS DE ASPECTOS
  aspectFiltersCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 15,
  },
  aspectFiltersTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 10,
    textAlign: 'center',
  },
  aspectFiltersRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 10,
  },
  aspectFilterLabel: {
    fontSize: 14,
    color: '#6C757D',
    fontWeight: '500',
  },
  aspectFilterValue: {
    fontSize: 14,
    color: '#E67E22',
    fontWeight: '600',
  },
  // 🆕 ESTILOS PARA INSIGHTS AVANÇADOS E MÁGICA ASTROLÓGICA
  cosmicPatternsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 20,
  },
  cosmicPatternsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 15,
  },
  cosmicPatternItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  cosmicPatternIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  cosmicPatternContent: {
    flex: 1,
  },
  cosmicPatternTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 5,
  },
  cosmicPatternText: {
    fontSize: 14,
    color: '#34495E',
    lineHeight: 22,
  },
  temporalPredictionsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 20,
  },
  temporalPredictionsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 15,
  },
  temporalPredictionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  temporalPredictionIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  temporalPredictionContent: {
    flex: 1,
  },
  temporalPredictionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 5,
  },
  temporalPredictionText: {
    fontSize: 14,
    color: '#34495E',
    lineHeight: 22,
  },
  astrologicalWisdomCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginTop: 15,
    marginBottom: 15,
  },
  astrologicalWisdomTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 10,
  },
  astrologicalWisdomText: {
    fontSize: 16,
    color: '#34495E',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 10,
  },
  astrologicalWisdomAuthor: {
    fontSize: 14,
    color: '#6C757D',
    textAlign: 'right',
    fontStyle: 'italic',
  },
  // 🆕 ESTILOS PARA PLANETAS ENHANCED
  planetCardEnhanced: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  planetBreakdownEnhanced: {
    marginBottom: 10,
  },
  ctaCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 20,
  },
  ctaTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 10,
  },
  ctaText: {
    fontSize: 16,
    color: '#6C757D',
    textAlign: 'center',
    marginBottom: 20,
  },
  ctaButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ctaButtonPrimary: {
    backgroundColor: '#2ECC71',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  ctaButtonSecondary: {
    backgroundColor: '#F39C12',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 10,
  },
  ctaButtonTextSecondary: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  areaConnectionsCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 20,
  },
  areaConnectionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 10,
  },
  areaConnectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  areaConnectionIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  areaConnectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  areaConnectionContent: {
    flex: 1,
  },
  areaConnectionText: {
    fontSize: 14,
    color: '#6C757D',
    marginTop: 2,
  },
  closingCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 20,
  },
  closingTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 10,
  },
  closingSubtitle: {
    fontSize: 14,
    color: '#6C757D',
    textAlign: 'center',
    marginBottom: 10,
  },
  closingMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 10,
  },
  closingMetric: {
    alignItems: 'center',
  },
  closingMetricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E67E22',
  },
  closingMetricLabel: {
    fontSize: 12,
    color: '#6C757D',
  },
  closingMessage: {
    fontSize: 16,
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 10,
  },
  closingSignature: {
    alignItems: 'center',
  },
  closingSignatureText: {
    fontSize: 14,
    color: '#6C757D',
    textAlign: 'center',
  },
  closingSignatureSubtext: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
  summaryCardCompact: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 10,
  },
  summaryTextCompact: {
    fontSize: 14,
    color: '#2C3E50',
    lineHeight: 20,
    marginBottom: 5,
  },
  tipsCardCompact: {
    backgroundColor: '#FFF3CD',
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
    marginBottom: 10,
  },
  tipTextCompact: {
    fontSize: 14,
    color: '#856404',
    lineHeight: 20,
    marginBottom: 5,
  },
  recommendationsCardCompact: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 10,
  },
  recommendationItemCompact: {
    marginBottom: 10,
  },
  recommendationTitleCompact: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 5,
  },
  recommendationTextCompact: {
    fontSize: 14,
    color: '#6C757D',
    lineHeight: 20,
  },
  planetCardCompact: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    marginBottom: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  planetHeaderCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  planetIconCompact: {
    fontSize: 20,
    marginRight: 5,
  },
  planetNameCompact: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  planetScoreCompact: {
    alignItems: 'center',
  },
  planetScoreValueCompact: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E67E22',
  },
  planetImpactCompact: {
    fontSize: 12,
    color: '#6C757D',
    marginTop: 2,
  },
  planetAnalysisCardCompact: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    marginBottom: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  planetAnalysisHeaderCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  planetAnalysisIconCompact: {
    fontSize: 20,
    marginRight: 5,
  },
  planetAnalysisNameCompact: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    flex: 1,
  },
  planetAnalysisScoreCompact: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E67E22',
  },
  planetBreakdownCompact: {
    marginBottom: 5,
  },
  planetBreakdownTextCompact: {
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
  },
  planetAspectsTextCompact: {
    fontSize: 12,
    color: '#6C757D',
    marginTop: 2,
  },
  trendsCardCompact: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 10,
  },
  trendItemCompact: {
    marginBottom: 10,
  },
  trendTitleCompact: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 5,
  },
  trendTextCompact: {
    fontSize: 14,
    color: '#6C757D',
    lineHeight: 20,
  },
  debugCardCompact: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 10,
  },
  debugTextCompact: {
    fontSize: 14,
    color: '#6C757D',
    lineHeight: 20,
    marginBottom: 5,
  },
  insightsCardCompact: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 10,
  },
  insightTextCompact: {
    fontSize: 14,
    color: '#6C757D',
    lineHeight: 20,
  },
  aspectCardCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    marginBottom: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  aspectIconCompact: {
    fontSize: 18,
    marginRight: 10,
  },
  aspectContentCompact: {
    flex: 1,
  },
  aspectTextCompact: {
    fontSize: 14,
    color: '#2C3E50',
    marginBottom: 2,
  },
  aspectDetailsCompact: {
    fontSize: 12,
    color: '#6C757D',
    marginTop: 2,
  },
  calculationCardCompact: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 10,
    padding: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#FFD700',
  },
  calculationTitleCompact: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 5,
  },
  calculationFormulaCompact: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E67E22',
    textAlign: 'center',
    marginBottom: 8,
    padding: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 5,
  },
  calculationBreakdownCompact: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 5,
  },
  calculationItemCompact: {
    fontSize: 12,
    color: '#34495E',
    marginBottom: 3,
    lineHeight: 18,
  },
  // 🎨 SISTEMA DE DESIGN CONSISTENTE
  infoCard: {
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#E67E22',
    backgroundColor: '#F8F9FA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  infoCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 5,
  },
  infoCardSubtitle: {
    fontSize: 14,
    color: '#6C757D',
    marginBottom: 10,
  },
  metricDisplay: {
    alignItems: 'center',
    marginBottom: 10,
  },
  metricIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  metricLabel: {
    fontSize: 12,
    color: '#6C757D',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionHeaderIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  sectionHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  sectionHeaderSubtitle: {
    fontSize: 14,
    color: '#6C757D',
  },
  sectionHeaderAction: {
    // Placeholder for action component if needed
  },
  // 🎨 ESTILOS PARA COMPONENTES INTELIGENTES
  headerAdaptiveMessage: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginTop: 5,
  },
  filterRow: {
    marginBottom: 15,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
  },
  filterButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
    borderWidth: 1,
    borderColor: '#D0D0D0',
  },
  filterButtonActive: {
    backgroundColor: '#E67E22',
    borderColor: '#E67E22',
  },
  filterButtonText: {
    fontSize: 12,
    color: '#6C757D',
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  ctaContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15,
  },
  ctaButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  ctaButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  ctaInsight: {
    fontSize: 14,
    color: '#6C757D',
    marginBottom: 5,
  },
  ctaInsightHighlight: {
    color: '#E67E22',
    fontWeight: '600',
  },
  feedbackRow: {
    marginBottom: 15,
  },
  feedbackLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
  },
  feedbackButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  feedbackButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
    borderWidth: 1,
    borderColor: '#D0D0D0',
    alignItems: 'center',
  },
  feedbackButtonActive: {
    backgroundColor: '#E67E22',
    borderColor: '#E67E22',
  },
  feedbackButtonText: {
    fontSize: 14,
    color: '#6C757D',
    fontWeight: '500',
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  ratingButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    borderWidth: 1,
    borderColor: '#D0D0D0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingButtonActive: {
    backgroundColor: '#E67E22',
    borderColor: '#E67E22',
  },
  ratingButtonText: {
    fontSize: 16,
    color: '#6C757D',
    fontWeight: '600',
  },
})