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

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* 🎨 HEADER COM GRADIENTE INTELIGENTE */}
        <LinearGradient
          colors={colors}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
            
            {/* 🆕 HEADER PRINCIPAL INTELIGENTE */}
            <View style={styles.headerMain}>
              <View style={styles.headerIconContainer}>
                <Ionicons name={icon as any} size={48} color="white" />
                <View style={styles.headerStatusIndicator}>
                  <Text style={styles.headerStatusText}>
                    {areaData.percentage >= 70 ? '⚡ RÁPIDO' : 
                     areaData.percentage >= 50 ? '🔄 ESTÁVEL' : '🐌 LENTO'}
                  </Text>
                </View>
              </View>
              
              <Text style={styles.areaTitle}>{areaData.name.toUpperCase()}</Text>
              
              {/* 🆕 SCORE PRINCIPAL COM ANIMAÇÃO VISUAL */}
              <View style={styles.scoreMainContainer}>
                <Text style={styles.scoreMainValue}>{areaData.percentage}%</Text>
                <Text style={styles.scoreMainLabel}>de Energia Positiva</Text>
              </View>
              
              {/* 🆕 MAPA DE INFLUÊNCIAS VISUAL */}
              <View style={styles.influenceMap}>
                <Text style={styles.influenceMapLabel}>
                  💖 Baseado em {analysis.planetDetails.length || areaData.mainPlanets.length} trânsitos ativos
                </Text>
                <View style={styles.influenceMapBar}>
                  <View style={[styles.influenceMapSegment, { width: `${Math.min(100, (analysis.positiveInfluences.length / Math.max(1, analysis.positiveInfluences.length + analysis.challengingInfluences.length)) * 100)}%` }]} />
                </View>
              </View>
            </View>
            
            {/* 🆕 INDICADORES DE TENDÊNCIA */}
            <View style={styles.trendIndicators}>
              <View style={[styles.trendIndicator, { backgroundColor: areaData.percentage >= 70 ? 'rgba(46, 204, 113, 0.9)' : 
                                                      areaData.percentage >= 50 ? 'rgba(243, 156, 18, 0.9)' : 'rgba(231, 76, 60, 0.9)' }]}>
                <Text style={styles.trendIndicatorText}>
                  {areaData.percentage >= 70 ? '🌟 EXCELENTE' : 
                   areaData.percentage >= 50 ? '✨ BOM' : '⚠️ ATENÇÃO'}
                </Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* 📊 CONTEÚDO DETALHADO */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          
          {/* 🆕 RESUMO EXECUTIVO INTELIGENTE */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🎯 Resumo Executivo</Text>
            <View style={styles.executiveSummaryCard}>
              <View style={styles.executiveHeader}>
                <Text style={styles.executiveTitle}>Análise Astrológica Completa</Text>
                <Text style={styles.executiveSubtitle}>
                  {areaData.name} • {new Date().toLocaleDateString('pt-BR')}
                </Text>
              </View>
              
              <View style={styles.executiveMetrics}>
                <View style={styles.executiveMetric}>
                  <Text style={styles.executiveMetricValue}>{analysis.totalBreakdown.total || areaData.percentage}</Text>
                  <Text style={styles.executiveMetricLabel}>Score Final</Text>
                </View>
                <View style={styles.executiveMetric}>
                  <Text style={styles.executiveMetricValue}>{analysis.positiveInfluences.length}</Text>
                  <Text style={styles.executiveMetricLabel}>Aspectos +</Text>
                </View>
                <View style={styles.executiveMetric}>
                  <Text style={styles.executiveMetricValue}>{analysis.challengingInfluences.length}</Text>
                  <Text style={styles.executiveMetricLabel}>Desafios</Text>
                </View>
              </View>
              
              <Text style={styles.executiveInsight}>
                {areaData.percentage >= 70 ? 
                  `✨ Momento excepcional para ${areaData.name.toLowerCase()}! Aproveite esta energia cósmica favorável para fazer progressos significativos.` :
                 areaData.percentage >= 50 ? 
                  `⚖️ Energia equilibrada em ${areaData.name.toLowerCase()}. Bom momento para manter o que está funcionando e fazer ajustes graduais.` :
                  `🔄 Período de transformação em ${areaData.name.toLowerCase()}. Use os desafios como oportunidades de crescimento e evolução.`
                }
              </Text>
            </View>
          </View>

          {/* 💡 DICAS ASTROLÓGICAS */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>💡 Dicas Astrológicas</Text>
            <View style={styles.tipsCard}>
              {areaData.percentage >= 70 && (
                <Text style={styles.tipText}>
                  ✨ Momento excelente para focar nesta área! Aproveite a energia positiva para fazer progressos significativos.
                </Text>
              )}
              {areaData.percentage >= 50 && areaData.percentage < 70 && (
                <Text style={styles.tipText}>
                  ⚖️ Energia equilibrada. Bom momento para manter o que está funcionando e fazer ajustes graduais.
                </Text>
              )}
              {areaData.percentage < 50 && (
                <Text style={styles.tipText}>
                  🔄 Período de transformação. Use os desafios como oportunidades de crescimento e evolução.
                </Text>
              )}
            </View>
          </View>

          {/* 📊 CÁLCULOS DETALHADOS */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📊 Cálculos Detalhados</Text>
            
            {/* 🚨 ALERTA DE PRECISÃO */}
            {!analysis.debugArea && (
              <View style={styles.accuracyAlert}>
                <Text style={styles.accuracyAlertIcon}>⚠️</Text>
                <Text style={styles.accuracyAlertText}>
                  Dados de precisão limitada. Para análise completa, verifique se o engine astrológico está funcionando corretamente.
                </Text>
              </View>
            )}
            
            <View style={styles.calculationCard}>
              <Text style={styles.calculationTitle}>Fórmula do Cálculo:</Text>
              <Text style={styles.calculationFormula}>
                {analysis.areaFormula}
              </Text>
              {housesApprox && (
                <Text style={styles.summaryText}>
                  Cálculo das casas: método alternativo devido à sua localização.
                </Text>
              )}
              
              <Text style={styles.calculationBreakdown}>Detalhamento Real:</Text>
              <View style={styles.calculationItems}>
                <Text style={styles.calculationItem}>
                  • Dignidades planetárias: {analysis.totalBreakdown.signScore}% (domicílio/exaltação/detrimento/queda + triplicidade/termos/faces)
                </Text>
                <Text style={styles.calculationItem}>
                  • Força das casas: {analysis.totalBreakdown.houseScore}% (angular/sucedente/cadente + regência)
                </Text>
                <Text style={styles.calculationItem}>
                  • Aspectos: {analysis.totalBreakdown.aspectScore}% (ponderados por tipo/orbe/aplicante e natureza do planeta)
                </Text>
              </View>
              
              {/* 🆕 BREAKDOWN VISUAL */}
              <View style={styles.breakdownVisual}>
                <Text style={styles.breakdownVisualTitle}>Contribuição de Cada Fator:</Text>
                <View style={styles.breakdownBar}>
                  <View style={[styles.breakdownSegment, { width: '30%', backgroundColor: '#FF6B9D' }]}>
                    <Text style={styles.breakdownLabel}>Signos</Text>
                    <Text style={styles.breakdownValue}>{analysis.totalBreakdown.signScore}%</Text>
                  </View>
                  <View style={[styles.breakdownSegment, { width: '30%', backgroundColor: '#4834D4' }]}>
                    <Text style={styles.breakdownLabel}>Casas</Text>
                    <Text style={styles.breakdownValue}>{analysis.totalBreakdown.houseScore}%</Text>
                  </View>
                  <View style={[styles.breakdownSegment, { width: '40%', backgroundColor: '#00D2D3' }]}>
                    <Text style={styles.breakdownLabel}>Aspectos</Text>
                    <Text style={styles.breakdownValue}>{analysis.totalBreakdown.aspectScore}%</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* 🆕 SISTEMA DE TRÂNSITOS DETALHADO */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔄 Sistema de Trânsitos Detalhado</Text>
            <Text style={styles.sectionSubtitle}>
              Como cada trânsito influencia o cálculo geral da área
            </Text>
            
            {/* 🎯 TRÂNSITOS ATIVOS COM IMPACTO */}
            <View style={styles.transitsOverviewCard}>
              <Text style={styles.transitsOverviewTitle}>
                📈 Visão Geral dos Trânsitos Ativos
              </Text>
              <View style={styles.transitsOverviewMetrics}>
                <View style={styles.transitMetric}>
                  <Text style={styles.transitMetricValue}>{analysis.planetDetails.length || areaData.mainPlanets.length}</Text>
                  <Text style={styles.transitMetricLabel}>Planetas</Text>
                </View>
                <View style={styles.transitMetric}>
                  <Text style={styles.transitMetricValue}>{analysis.topAspects.length}</Text>
                  <Text style={styles.transitMetricLabel}>Aspectos</Text>
                </View>
                <View style={styles.transitMetric}>
                  <Text style={styles.transitMetricValue}>{Math.round(analysis.totalBreakdown.total || areaData.percentage)}</Text>
                  <Text style={styles.transitMetricLabel}>Score Final</Text>
                </View>
              </View>
            </View>

            {/* 🪐 ANÁLISE INDIVIDUAL DOS PLANETAS */}
            {analysis.planetDetails.length > 0 ? (
              analysis.planetDetails.map((planetData: any, index: number) => (
                <View key={index} style={styles.planetAnalysisCard}>
                  <View style={styles.planetAnalysisHeader}>
                    <Text style={styles.planetAnalysisIcon}>{PLANET_ICONS[planetData.planet] || '🪐'}</Text>
                    <Text style={styles.planetAnalysisName}>{planetData.planet}</Text>
                    <View style={styles.planetAnalysisScore}>
                      <Text style={styles.planetAnalysisScoreValue}>{Math.round(planetData.total || 0)}%</Text>
                      <Text style={styles.planetAnalysisScoreLabel}>Total</Text>
                    </View>
                  </View>
                  
                  {/* 🆕 BREAKDOWN DETALHADO DO PLANETA */}
                  <View style={styles.planetBreakdownDetailed}>
                    <View style={styles.planetBreakdownRow}>
                      <Text style={styles.planetBreakdownLabel}>Dignidades:</Text>
                      <Text style={styles.planetBreakdownValue}>{Math.round(planetData.signScore || 0)}%</Text>
                      <Text style={styles.planetBreakdownImpact}>
                        {planetData.signScore >= 70 ? '🌟 Forte' : 
                         planetData.signScore >= 50 ? '✨ Moderado' : '⚠️ Fraco'}
                      </Text>
                    </View>
                    <View style={styles.planetBreakdownRow}>
                      <Text style={styles.planetBreakdownLabel}>Casa:</Text>
                      <Text style={styles.planetBreakdownValue}>{Math.round(planetData.houseScore || 0)}%</Text>
                      <Text style={styles.planetBreakdownImpact}>
                        {planetData.houseScore >= 70 ? '🏠 Angular' : 
                         planetData.houseScore >= 50 ? '🏡 Sucedente' : '🏘️ Cadente'}
                      </Text>
                    </View>
                  </View>
                  
                  {/* 🆕 IMPACTO NO SCORE FINAL */}
                  <View style={styles.planetImpactCard}>
                    <Text style={styles.planetImpactTitle}>
                      📊 Impacto no Score Final da Área:
                    </Text>
                    <Text style={styles.planetImpactFormula}>
                      {planetData.planet} contribui com {(planetData.total || 0) / (analysis.planetDetails.length || 1) * 100}% 
                      do score total de {areaData.name}
                    </Text>
                    <View style={styles.planetImpactBar}>
                      <View 
                        style={[
                          styles.planetImpactBarFill, 
                          { 
                            width: `${Math.min(100, (planetData.total || 0) / (analysis.totalBreakdown.total || 1) * 100)}%`,
                            backgroundColor: colors[0]
                          }
                        ]} 
                      />
                    </View>
                  </View>
                  
                  {/* 🆕 ASPECTOS DO PLANETA */}
                  {Array.isArray(planetData.aspects) && planetData.aspects.length > 0 && (
                    <View style={styles.planetAspectsSection}>
                      <Text style={styles.planetAspectsTitle}>
                        ✨ Aspectos de {planetData.planet}:
                      </Text>
                      {planetData.aspects.slice(0, 3).map((aspect: any, aspectIndex: number) => (
                        <View key={aspectIndex} style={styles.planetAspectCard}>
                          <Text style={styles.planetAspectIcon}>{ASPECT_ICONS[aspect.type] || '∠'}</Text>
                          <View style={styles.planetAspectContent}>
                            <Text style={styles.planetAspectText}>
                              {aspect.type} com {aspect.with} • orb {aspect.orb?.toFixed ? aspect.orb.toFixed(1) : aspect.orb}°
                            </Text>
                            <Text style={styles.planetAspectDetails}>
                              {aspect.isApplying ? '🔄 Aplicante' : '📤 Separante'} • Score: {Math.round(aspect.finalScore || 0)}
                            </Text>
                          </View>
                          <Text style={[styles.planetAspectScore, { 
                            color: (aspect.finalScore || 0) >= 60 ? '#27AE60' : '#E74C3C' 
                          }]}>
                            {Math.round(aspect.finalScore || 0)}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              ))
            ) : (
              // 🚨 FALLBACK PARA PLANETAS SEM DADOS DETALHADOS
              areaData.mainPlanets.map((planet, index) => (
                <View key={index} style={styles.planetAnalysisCard}>
                  <View style={styles.planetAnalysisHeader}>
                    <Text style={styles.planetAnalysisIcon}>{PLANET_ICONS[planet] || '🪐'}</Text>
                    <Text style={styles.planetAnalysisName}>{planet}</Text>
                    <View style={styles.planetAnalysisScore}>
                      <Text style={styles.planetAnalysisScoreValue}>50%</Text>
                      <Text style={styles.planetAnalysisScoreLabel}>Estimado</Text>
                    </View>
                  </View>
                  
                  <View style={styles.planetFallbackInfo}>
                    <Text style={styles.planetFallbackText}>
                      ⚠️ Dados detalhados não disponíveis para {planet}. 
                      Score estimado baseado em influências gerais.
                    </Text>
                  </View>
                </View>
              ))
            )}
          </View>

          {/* ✨ ASPECTOS FAVORÁVEIS */}
          {analysis.positiveInfluences.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>✨ Aspectos Favoráveis</Text>
              <Text style={styles.sectionSubtitle}>
                Influências benéficas que fortalecem esta área da vida
              </Text>
              
              {/* 🆕 FILTROS INTELIGENTES PARA ASPECTOS */}
              <View style={styles.aspectFiltersCard}>
                <Text style={styles.aspectFiltersTitle}>🔍 Filtros Inteligentes:</Text>
                <View style={styles.aspectFiltersRow}>
                  <Text style={styles.aspectFilterLabel}>Por Score:</Text>
                  <Text style={styles.aspectFilterValue}>
                    {analysis.topAspects.filter(a => (a.finalScore||0) >= 80).length} Excelentes (80%+)
                  </Text>
                </View>
                <View style={styles.aspectFiltersRow}>
                  <Text style={styles.aspectFilterLabel}>Por Tipo:</Text>
                  <Text style={styles.aspectFilterValue}>
                    {analysis.topAspects.filter(a => a.type === 'trígono' || a.type === 'sextil').length} Harmoniosos
                  </Text>
                </View>
                <View style={styles.aspectFiltersRow}>
                  <Text style={styles.aspectFilterLabel}>Por Aplicação:</Text>
                  <Text style={styles.aspectFilterValue}>
                    {analysis.topAspects.filter(a => a.isApplying).length} Aplicantes
                  </Text>
                </View>
              </View>
              
              {(analysis.topAspects.length > 0 ? analysis.topAspects.filter(a => (a.finalScore||0) >= 60) : analysis.positiveInfluences).map((item: any, index: number) => {
                const text = typeof item === 'string' ? item : `${item.type} ${item.with} • orb ${item.orb?.toFixed ? item.orb.toFixed(1) : item.orb}° ${item.isApplying ? '(aplicante)' : '(separante)'} `
                const score = typeof item === 'string' ? undefined : Math.round(item.finalScore || 0)
                const orb = typeof item === 'string' ? undefined : item.orb
                const isApplying = typeof item === 'string' ? undefined : item.isApplying
                
                return (
                  <View key={index} style={styles.aspectCardEnhanced}>
                    <Text style={styles.aspectIcon}>✨</Text>
                    <View style={styles.aspectContent}>
                      <View style={styles.aspectTextContainer}>
                        <Text style={styles.aspectText}>{text}</Text>
                        {orb !== undefined && (
                          <Text style={styles.aspectOrb}>Orb: {orb.toFixed(1)}°</Text>
                        )}
                        {isApplying !== undefined && (
                          <Text style={styles.aspectStatus}>
                            {isApplying ? '🔄 Aplicante' : '📤 Separante'}
                          </Text>
                        )}
                      </View>
                      {score !== undefined && (
                        <View style={styles.aspectScoreContainer}>
                          <Text style={styles.aspectScore}>+{score}</Text>
                          <Text style={styles.aspectScoreLabel}>
                            {score >= 80 ? '🌟 Excelente' : score >= 60 ? '✨ Bom' : '⚖️ Neutro'}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                )
              })}
            </View>
          )}
          
          {/* ⚠️ ASPECTOS DESFAVORÁVEIS */}
          {analysis.challengingInfluences.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>⚠️ Aspectos Desfavoráveis</Text>
              <Text style={styles.sectionSubtitle}>
                Desafios que requerem atenção e transformação
              </Text>
              
              {/* 🆕 ANÁLISE DOS DESAFIOS */}
              <View style={styles.challengesAnalysisCard}>
                <Text style={styles.challengesAnalysisTitle}>🧠 Análise dos Desafios:</Text>
                <Text style={styles.challengesAnalysisText}>
                  Estes aspectos desfavoráveis não são necessariamente negativos. Eles representam oportunidades de crescimento, 
                  transformação e desenvolvimento de resiliência em {areaData.name.toLowerCase()}.
                </Text>
              </View>
              
              {(analysis.topAspects.length > 0 ? analysis.topAspects.filter(a => (a.finalScore||0) < 60) : analysis.challengingInfluences).map((item: any, index: number) => {
                const text = typeof item === 'string' ? item : `${item.type} ${item.with} • orb ${item.orb?.toFixed ? item.orb.toFixed(1) : item.orb}° ${item.isApplying ? '(aplicante)' : '(separante)'} `
                const score = typeof item === 'string' ? undefined : Math.round(item.finalScore || 0)
                const orb = typeof item === 'string' ? undefined : item.orb
                const isApplying = typeof item === 'string' ? undefined : item.isApplying
                
                return (
                  <View key={index} style={styles.aspectCardEnhanced}>
                    <Text style={styles.aspectIcon}>⚠️</Text>
                    <View style={styles.aspectContent}>
                      <View style={styles.aspectTextContainer}>
                        <Text style={styles.aspectText}>{text}</Text>
                        {orb !== undefined && (
                          <Text style={styles.aspectOrb}>Orb: {orb.toFixed(1)}°</Text>
                        )}
                        {isApplying !== undefined && (
                          <Text style={styles.aspectStatus}>
                            {isApplying ? '🔄 Aplicante' : '📤 Separante'}
                          </Text>
                        )}
                      </View>
                      {score !== undefined && (
                        <View style={styles.aspectScoreContainer}>
                          <Text style={[styles.aspectScore, { color: '#E74C3C' }]}>-{Math.max(0, 100 - score)}</Text>
                          <Text style={[styles.aspectScoreLabel, { color: '#E74C3C' }]}>
                            {score >= 40 ? '🔄 Transformação' : '💪 Desafio'}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                )
              })}
            </View>
          )}

          {/* 🆕 RECOMENDAÇÕES PRÁTICAS INTELIGENTES */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🎯 Recomendações Práticas</Text>
            <Text style={styles.sectionSubtitle}>
              Ações específicas baseadas na análise astrológica
            </Text>
            
            <View style={styles.recommendationsCard}>
              <View style={styles.recommendationsHeader}>
                <Text style={styles.recommendationsTitle}>
                  💡 O que fazer agora em {areaData.name}:
                </Text>
                <Text style={styles.recommendationsSubtitle}>
                  Baseado em {analysis.positiveInfluences.length} aspectos favoráveis e {analysis.challengingInfluences.length} desafios
                </Text>
              </View>
              
              {/* 🆕 RECOMENDAÇÕES POR CATEGORIA */}
              <View style={styles.recommendationsCategories}>
                <View style={styles.recommendationCategory}>
                  <Text style={styles.recommendationCategoryTitle}>🚀 Ações Imediatas:</Text>
                  <View style={styles.recommendationItems}>
                    {areaData.percentage >= 70 ? (
                      <>
                        <Text style={styles.recommendationItem}>• Aproveite a energia favorável para iniciar novos projetos</Text>
                        <Text style={styles.recommendationItem}>• Faça conexões e networking ativo</Text>
                        <Text style={styles.recommendationItem}>• Tome decisões importantes com confiança</Text>
                      </>
                    ) : areaData.percentage >= 50 ? (
                      <>
                        <Text style={styles.recommendationItem}>• Mantenha o que está funcionando</Text>
                        <Text style={styles.recommendationItem}>• Faça ajustes graduais e planejados</Text>
                        <Text style={styles.recommendationItem}>• Consolide suas conquistas</Text>
                      </>
                    ) : (
                      <>
                        <Text style={styles.recommendationItem}>• Use os desafios como oportunidades de crescimento</Text>
                        <Text style={styles.recommendationItem}>• Pratique paciência e resiliência</Text>
                        <Text style={styles.recommendationItem}>• Foque no desenvolvimento pessoal</Text>
                      </>
                    )}
                  </View>
                </View>
                
                <View style={styles.recommendationCategory}>
                  <Text style={styles.recommendationCategoryTitle}>⏰ Momento Ideal:</Text>
                  <View style={styles.recommendationItems}>
                    <Text style={styles.recommendationItem}>
                      • {areaData.percentage >= 70 ? 'Período excepcional para avanços' : 
                         areaData.percentage >= 50 ? 'Momento equilibrado para ajustes' : 'Tempo de transformação e reflexão'}
                    </Text>
                    <Text style={styles.recommendationItem}>
                      • Energia cósmica: {areaData.percentage >= 70 ? 'Muito favorável' : 
                                         areaData.percentage >= 50 ? 'Moderadamente favorável' : 'Desafiador mas transformador'}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.recommendationCategory}>
                  <Text style={styles.recommendationCategoryTitle}>🧘‍♀️ Atitude Recomendada:</Text>
                  <View style={styles.recommendationItems}>
                    <Text style={styles.recommendationItem}>
                      • {areaData.percentage >= 70 ? 'Confiança e ousadia' : 
                         areaData.percentage >= 50 ? 'Equilíbrio e planejamento' : 'Paciência e sabedoria'}
                    </Text>
                    <Text style={styles.recommendationItem}>
                      • Foque em: {areaData.percentage >= 70 ? 'Expansão e crescimento' : 
                                   areaData.percentage >= 50 ? 'Consolidação e melhoria' : 'Transformação e evolução'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* 🪐 PLANETAS INFLUENTES */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🪐 Planetas Influentes</Text>
            <Text style={styles.sectionSubtitle}>
              Análise detalhada da influência planetária nesta área
            </Text>
            
            {areaData.mainPlanets.map((planet, index) => {
              const planetData = analysis.planetDetails.find((pd: any) => pd.planet === planet)
              const planetScore = analysis.planetaryScores[planet] || 50
              const conditions = planetData?.conditions
              
              return (
                <View key={index} style={styles.planetCardEnhanced}>
                  <View style={styles.planetHeader}>
                    <Text style={styles.planetIcon}>{PLANET_ICONS[planet] || '🪐'}</Text>
                    <Text style={styles.planetName}>{planet}</Text>
                    {conditions?.tags && conditions.tags.length > 0 && (
                      <View style={styles.planetConditions}>
                        {conditions.tags.map((tag: string, tagIndex: number) => (
                          <Text key={tagIndex} style={styles.planetConditionTag}>
                            {tag}
                          </Text>
                        ))}
                      </View>
                    )}
                  </View>
                  
                  {/* 🆕 BREAKDOWN DO PLANETA ENHANCED */}
                  {planetData && (
                    <View style={styles.planetBreakdownEnhanced}>
                      <View style={styles.planetBreakdownRow}>
                        <Text style={styles.planetBreakdownLabel}>Dignidades:</Text>
                        <Text style={styles.planetBreakdownValue}>{Math.round(planetData.signScore || 0)}%</Text>
                        <Text style={styles.planetBreakdownImpact}>
                          {planetData.signScore >= 70 ? '🌟 Forte' : 
                           planetData.signScore >= 50 ? '✨ Moderado' : '⚠️ Fraco'}
                        </Text>
                      </View>
                      <View style={styles.planetBreakdownRow}>
                        <Text style={styles.planetBreakdownLabel}>Casa:</Text>
                        <Text style={styles.planetBreakdownValue}>{Math.round(planetData.houseScore || 0)}%</Text>
                        <Text style={styles.planetBreakdownImpact}>
                          {planetData.houseScore >= 70 ? '🏠 Angular' : 
                           planetData.houseScore >= 50 ? '🏡 Sucedente' : '🏘️ Cadente'}
                        </Text>
                      </View>
                    </View>
                  )}
                  
                  <View style={styles.scoreBar}>
                    <View 
                      style={[
                        styles.scoreBarFill, 
                        { 
                          width: `${planetScore}%`,
                          backgroundColor: colors[0]
                        }
                      ]} 
                    />
                  </View>
                  <Text style={styles.scoreText}>
                    {Math.round(planetScore)}% de influência
                  </Text>
                </View>
              )
            })}
          </View>

          {/* 🆕 INSIGHTS AVANÇADOS E MÁGICA ASTROLÓGICA */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔮 Insights Avançados</Text>
            <Text style={styles.sectionSubtitle}>
              Mágica astrológica e padrões cósmicos revelados
            </Text>
            
            {/* 🌟 ANÁLISE DE PADRÕES CÓSMICOS */}
            <View style={styles.cosmicPatternsCard}>
              <Text style={styles.cosmicPatternsTitle}>🌟 Padrões Cósmicos Identificados:</Text>
              
              <View style={styles.cosmicPatternItem}>
                <Text style={styles.cosmicPatternIcon}>✨</Text>
                <View style={styles.cosmicPatternContent}>
                  <Text style={styles.cosmicPatternTitle}>Harmonia Elemental:</Text>
                  <Text style={styles.cosmicPatternText}>
                    {areaData.percentage >= 70 ? 
                      'Elementos em perfeita harmonia criam um fluxo de energia excepcional' :
                     areaData.percentage >= 50 ? 
                      'Elementos em equilíbrio moderado permitem crescimento estável' :
                      'Elementos em tensão criam oportunidades de transformação e evolução'
                    }
                  </Text>
                </View>
              </View>
              
              <View style={styles.cosmicPatternItem}>
                <Text style={styles.cosmicPatternIcon}>🌙</Text>
                <View style={styles.cosmicPatternContent}>
                  <Text style={styles.cosmicPatternTitle}>Ciclo Lunar:</Text>
                  <Text style={styles.cosmicPatternText}>
                    {areaData.percentage >= 70 ? 
                      'Fase lunar favorável amplifica as energias positivas' :
                     areaData.percentage >= 50 ? 
                      'Fase lunar neutra mantém estabilidade energética' :
                      'Fase lunar desafiadora promove crescimento através da superação'
                    }
                  </Text>
                </View>
              </View>
              
              <View style={styles.cosmicPatternItem}>
                <Text style={styles.cosmicPatternIcon}>⭐</Text>
                <View style={styles.cosmicPatternContent}>
                  <Text style={styles.cosmicPatternTitle}>Alinhamento Planetário:</Text>
                  <Text style={styles.cosmicPatternText}>
                    {analysis.positiveInfluences.length > analysis.challengingInfluences.length ?
                      'Alinhamento favorável dos planetas cria uma janela de oportunidade' :
                      'Alinhamento desafiador dos planetas promove desenvolvimento de força interior'
                    }
                  </Text>
                </View>
              </View>
            </View>
            
            {/* 🔮 PREVISÕES TEMPORAIS */}
            <View style={styles.temporalPredictionsCard}>
              <Text style={styles.temporalPredictionsTitle}>🔮 Previsões Temporais:</Text>
              
              <View style={styles.temporalPredictionItem}>
                <Text style={styles.temporalPredictionIcon}>⏰</Text>
                <View style={styles.temporalPredictionContent}>
                  <Text style={styles.temporalPredictionTitle}>Próximos 7 dias:</Text>
                  <Text style={styles.temporalPredictionText}>
                    {areaData.percentage >= 70 ? 
                      'Período de máxima eficiência. Aproveite para avanços significativos.' :
                     areaData.percentage >= 50 ? 
                      'Momento estável para consolidação e planejamento futuro.' :
                      'Tempo de transformação interna. Foque no desenvolvimento pessoal.'
                    }
                  </Text>
                </View>
              </View>
              
              <View style={styles.temporalPredictionItem}>
                <Text style={styles.temporalPredictionIcon}>📅</Text>
                <View style={styles.temporalPredictionContent}>
                  <Text style={styles.temporalPredictionTitle}>Próximas 4 semanas:</Text>
                  <Text style={styles.temporalPredictionText}>
                    {areaData.percentage >= 70 ? 
                      'Ciclo de expansão e crescimento. Novas oportunidades surgirão.' :
                     areaData.percentage >= 50 ? 
                      'Ciclo de estabilização. Mantenha o foco e faça ajustes graduais.' :
                      'Ciclo de transformação. Mudanças significativas estão em andamento.'
                    }
                  </Text>
                </View>
              </View>
            </View>
            
            {/* 🌌 SABEDORIA ASTROLÓGICA */}
            <View style={styles.astrologicalWisdomCard}>
              <Text style={styles.astrologicalWisdomTitle}>🌌 Sabedoria Astrológica:</Text>
              <Text style={styles.astrologicalWisdomText}>
                {areaData.percentage >= 70 ? 
                  `"Quando os astros se alinham favoravelmente em ${areaData.name.toLowerCase()}, é hora de agir com confiança e ousadia. A energia cósmica está do seu lado."` :
                 areaData.percentage >= 50 ? 
                  `"O equilíbrio cósmico em ${areaData.name.toLowerCase()} sugere um momento de consolidação. Mantenha o que funciona e ajuste o que precisa ser melhorado."` :
                  `"Os desafios cósmicos em ${areaData.name.toLowerCase()} são oportunidades disfarçadas. Cada obstáculo superado fortalece sua essência e expande sua consciência."`
                }
              </Text>
              <Text style={styles.astrologicalWisdomAuthor}>
                — Sabedoria dos Antigos Astrólogos
              </Text>
            </View>
          </View>

          {/* 🧭 LOGS E JUSTIFICATIVAS (ESTRUTURADOS) */}
          {analysis.debugArea && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🧭 Fatores‑chave e justificativas</Text>
              {analysis.planetDetails.map((pd: any, idx: number) => (
                <View key={idx} style={styles.planetCard}>
                  <View style={styles.planetHeader}>
                    <Text style={styles.planetIcon}>{PLANET_ICONS[pd.planet] || '🪐'}</Text>
                    <Text style={styles.planetName}>{pd.planet}</Text>
                  </View>
                  <Text style={styles.summaryText}>
                    Total: {Math.round(pd.total || 0)} • Dignidades: {Math.round(pd.signScore || 0)} • Casa: {Math.round(pd.houseScore || 0)}
                  </Text>
                  {Array.isArray(pd.conditions?.tags) && pd.conditions.tags.length > 0 && (
                    <Text style={styles.summaryText}>Condições: {pd.conditions.tags.join(' • ')}</Text>
                  )}
                  {Array.isArray(pd.aspects) && pd.aspects.length > 0 && (
                    <View style={{ marginTop: 8 }}>
                      {pd.aspects.slice(0, 3).map((a: any, i: number) => (
                        <View key={i} style={styles.aspectCard}>
                          <Text style={styles.aspectIcon}>{ASPECT_ICONS[a.type] || '∠'}</Text>
                          <View style={styles.aspectContent}>
                              <Text style={styles.aspectText}>
                                {a.type} {a.with} • orb {a.orb.toFixed ? a.orb.toFixed(1) : a.orb}° {a.isApplying ? `(aplicante${typeof a.timeToPeakDays==='number' ? `: pico em ~${a.timeToPeakDays}d` : ''})` : `(separante${typeof a.elapsedSincePeakDays==='number' ? `: pico há ~${a.elapsedSincePeakDays}d` : ''})`}
                              </Text>
                            <Text style={[styles.aspectScore, { color: (a.beneficMaleficDelta||0) >= 0 ? '#27AE60' : '#E74C3C' }]}>
                              {Math.round(a.finalScore || 0)}
                            </Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* 📈 RESUMO DA ANÁLISE */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📈 Resumo da Análise</Text>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryText}>
                Esta área da vida está com {analysis.totalBreakdown.total || areaData.percentage}% de energia positiva. 
                {analysis.positiveInfluences.length > 0 && 
                  ` As influências benéficas incluem ${analysis.positiveInfluences.length} aspectos favoráveis.`
                }
                {analysis.challengingInfluences.length > 0 && 
                  ` Existem ${analysis.challengingInfluences.length} desafios que requerem atenção.`
                }
              </Text>
              
              <Text style={styles.summaryText}>
                Os planetas mais influentes são: {areaData.mainPlanets.join(', ')}.
                {areaData.description && ` ${areaData.description}`}
              </Text>
              
              {/* 🆕 SCORE FINAL REAL */}
              {analysis.totalBreakdown.total > 0 && (
                <View style={styles.finalScoreCard}>
                  <Text style={styles.finalScoreTitle}>🎯 Score Final Real:</Text>
                  <Text style={styles.finalScoreValue}>{analysis.totalBreakdown.total}%</Text>
                  <Text style={styles.finalScoreBreakdown}>
                    Baseado em {analysis.planetDetails.length} planetas analisados com precisão astrológica
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* 🆕 SISTEMA DE NAVEGAÇÃO INTELIGENTE */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🧭 Navegação Inteligente</Text>
            <Text style={styles.sectionSubtitle}>
              Explore outras áreas e conecte os insights
            </Text>
            
            {/* 🎯 CALL-TO-ACTION PRINCIPAL */}
            <View style={styles.ctaCard}>
              <Text style={styles.ctaTitle}>
                🚀 Pronto para Explorar Outras Áreas?
              </Text>
              <Text style={styles.ctaText}>
                Cada área da vida está conectada. Descubra como os trânsitos influenciam outras dimensões da sua jornada.
              </Text>
              
              <View style={styles.ctaButtons}>
                <TouchableOpacity style={styles.ctaButtonPrimary}>
                  <Text style={styles.ctaButtonText}>🌟 Explorar Todas as Áreas</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.ctaButtonSecondary}>
                  <Text style={styles.ctaButtonTextSecondary}>📊 Ver Análise Completa</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            {/* 🔗 CONEXÕES ENTRE ÁREAS */}
            <View style={styles.areaConnectionsCard}>
              <Text style={styles.areaConnectionsTitle}>🔗 Conexões com Outras Áreas:</Text>
              
              <View style={styles.areaConnectionItem}>
                <Text style={styles.areaConnectionIcon}>💖</Text>
                <View style={styles.areaConnectionContent}>
                  <Text style={styles.areaConnectionTitle}>Amor & Carreira:</Text>
                  <Text style={styles.areaConnectionText}>
                    {areaData.name.toLowerCase() === 'amor' ? 
                      'Sucesso no amor pode impulsionar sua confiança profissional' :
                     areaData.name.toLowerCase() === 'carreira' ? 
                      'Estabilidade profissional cria base para relacionamentos saudáveis' :
                      'Equilíbrio em uma área fortalece a outra naturalmente'
                    }
                  </Text>
                </View>
              </View>
              
              <View style={styles.areaConnectionItem}>
                <Text style={styles.areaConnectionIcon}>💰</Text>
                <View style={styles.areaConnectionContent}>
                  <Text style={styles.areaConnectionTitle}>Finanças & Saúde:</Text>
                  <Text style={styles.areaConnectionText}>
                    {areaData.name.toLowerCase() === 'financas' ? 
                      'Bem-estar financeiro reduz estresse e melhora a saúde' :
                     areaData.name.toLowerCase() === 'saude' ? 
                      'Saúde física permite foco e produtividade financeira' :
                      'Cuidar de uma área beneficia automaticamente a outra'
                    }
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* 🆕 FECHAMENTO ELEGANTE */}
          <View style={styles.section}>
            <View style={styles.closingCard}>
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
            </View>
          </View>

        </ScrollView>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA'
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20
  },
  headerContent: {
    alignItems: 'center'
  },
  closeButton: {
    position: 'absolute',
    top: -40,
    right: 0,
    padding: 10
  },
  headerMain: {
    alignItems: 'center',
    marginBottom: 20
  },
  headerIconContainer: {
    position: 'relative',
    marginBottom: 10
  },
  headerStatusIndicator: {
    position: 'absolute',
    bottom: -10,
    left: '50%',
    transform: [{ translateX: -50 }],
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 5
  },
  headerStatusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold'
  },
  areaTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 10,
    textAlign: 'center'
  },
  scoreMainContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20
  },
  scoreMainValue: {
    fontSize: 60,
    fontWeight: 'bold',
    color: 'white',
    lineHeight: 60
  },
  scoreMainLabel: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 5
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
    padding: 20
  },
  section: {
    marginBottom: 25
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 15
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6C757D',
    marginBottom: 15,
    textAlign: 'center'
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
})