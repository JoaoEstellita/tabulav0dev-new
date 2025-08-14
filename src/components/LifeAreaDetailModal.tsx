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
    }

    // Analisar influências
    areaData.influences.forEach(influence => {
      const isPositive = influence.includes('trígono') || influence.includes('sextil') || influence.includes('conjunção')
      const isNegative = influence.includes('quadratura') || influence.includes('oposição')
      
      if (isPositive) {
        analysis.positiveInfluences.push(influence)
      } else if (isNegative) {
        analysis.challengingInfluences.push(influence)
      }
    })

    // Calcular scores dos planetas (sem aleatoriedade; neutro até termos debug)
    areaData.mainPlanets.forEach(planet => {
      const aspectHint = areaData.influences.filter(inf => inf.includes(planet)).length
      const baseScore = 50 // neutro
      const aspectBonus = Math.min(20, aspectHint * 5) // leve ajuste informativo
      analysis.planetaryScores[planet] = Math.min(100, baseScore + aspectBonus)
    })

    // Enriquecer com logs estruturados do engine, se disponíveis
    const areaKeyLower = (areaData.name || '').toLowerCase()
    const debugArea = (transitData as any)?.currentTransits?.debug?.lifeAreas?.[areaKeyLower]
    if (debugArea) {
      analysis.debugArea = debugArea
      const planetDetails = Array.isArray(debugArea.planetDetails) ? debugArea.planetDetails : []
      analysis.planetDetails = planetDetails
      // Usar totais do debug como "scores" dos planetas
      planetDetails.forEach((pd: any) => {
        if (pd?.planet) analysis.planetaryScores[pd.planet] = Math.round(pd.total || 0)
      })
      // Top aspectos agregados (flaten)
      const allAspects = planetDetails.flatMap((pd: any) => Array.isArray(pd.aspects) ? pd.aspects.map((a: any) => ({...a, of: pd.planet})) : [])
      analysis.topAspects = allAspects
        .sort((a: any, b: any) => (b.finalScore || 0) - (a.finalScore || 0))
        .slice(0, 8)
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
        {/* 🎨 HEADER COM GRADIENTE */}
        <LinearGradient
          colors={colors}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
            
            <View style={styles.headerInfo}>
              <Ionicons name={icon as any} size={48} color="white" />
              <Text style={styles.areaTitle}>{areaData.name.toUpperCase()}</Text>
              <Text style={styles.percentage}>{areaData.percentage}%</Text>
            </View>
            
            <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
              <Text style={styles.statusText}>{statusLabel}</Text>
            </View>
          </View>
        </LinearGradient>

        {/* 📊 CONTEÚDO DETALHADO */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          
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
            <View style={styles.calculationCard}>
              <Text style={styles.calculationTitle}>Fórmula do Cálculo:</Text>
              <Text style={styles.calculationFormula}>
                Dignidades (30%) + Casas (30%) + Aspectos (40%) = {areaData.percentage}%
              </Text>
              {housesApprox && (
                <Text style={styles.summaryText}>
                  Cálculo das casas: método alternativo devido à sua localização.
                </Text>
              )}
              
              <Text style={styles.calculationBreakdown}>Detalhamento:</Text>
              <View style={styles.calculationItems}>
                <Text style={styles.calculationItem}>• Dignidades planetárias: domicílio/exaltação/detrimento/queda + (triplicidade/termos/faces)</Text>
                <Text style={styles.calculationItem}>
                  • Aspectos: ponderados por tipo/orbe/aplicante e natureza do outro planeta (benéfico/maléfico)
                </Text>
                <Text style={styles.calculationItem}>
                  • Força das casas: {Math.round(areaData.percentage * 0.3)}%
                </Text>
              </View>
            </View>
          </View>

          {/* ✨ ASPECTOS FAVORÁVEIS */}
          {analysis.positiveInfluences.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>✨ Aspectos Favoráveis</Text>
              {(analysis.topAspects.length > 0 ? analysis.topAspects.filter(a => (a.finalScore||0) >= 60) : analysis.positiveInfluences).map((item: any, index: number) => {
                const text = typeof item === 'string' ? item : `${item.type} ${item.with} • orb ${item.orb?.toFixed ? item.orb.toFixed(1) : item.orb}° ${item.isApplying ? '(aplicante)' : '(separante)'} `
                const score = typeof item === 'string' ? undefined : Math.round(item.finalScore || 0)
                return (
                  <View key={index} style={styles.aspectCard}>
                    <Text style={styles.aspectIcon}>✨</Text>
                    <View style={styles.aspectContent}>
                      <Text style={styles.aspectText}>{text}</Text>
                      {score !== undefined && (
                        <Text style={styles.aspectScore}>+{score}</Text>
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
              {(analysis.topAspects.length > 0 ? analysis.topAspects.filter(a => (a.finalScore||0) < 60) : analysis.challengingInfluences).map((item: any, index: number) => {
                const text = typeof item === 'string' ? item : `${item.type} ${item.with} • orb ${item.orb?.toFixed ? item.orb.toFixed(1) : item.orb}° ${item.isApplying ? '(aplicante)' : '(separante)'} `
                const score = typeof item === 'string' ? undefined : Math.round(item.finalScore || 0)
                return (
                  <View key={index} style={styles.aspectCard}>
                    <Text style={styles.aspectIcon}>⚠️</Text>
                    <View style={styles.aspectContent}>
                      <Text style={styles.aspectText}>{text}</Text>
                      {score !== undefined && (
                        <Text style={[styles.aspectScore, { color: '#E74C3C' }]}>-{Math.max(0, 100 - score)}</Text>
                      )}
                    </View>
                  </View>
                )
              })}
            </View>
          )}

          {/* 🪐 PLANETAS INFLUENTES */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🪐 Planetas Influentes</Text>
            {areaData.mainPlanets.map((planet, index) => (
              <View key={index} style={styles.planetCard}>
                <View style={styles.planetHeader}>
                  <Text style={styles.planetIcon}>{PLANET_ICONS[planet] || '🪐'}</Text>
                  <Text style={styles.planetName}>{planet}</Text>
                </View>
                <View style={styles.scoreBar}>
                  <View 
                    style={[
                      styles.scoreBarFill, 
                      { 
                        width: `${analysis.planetaryScores[planet] || 50}%`,
                        backgroundColor: colors[0]
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.scoreText}>
                  {Math.round(analysis.planetaryScores[planet] || 50)}% de influência
                </Text>
              </View>
            ))}
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
                Esta área da vida está com {areaData.percentage}% de energia positiva. 
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
  headerInfo: {
    alignItems: 'center',
    marginBottom: 20
  },
  areaTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 10,
    textAlign: 'center'
  },
  percentage: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 5
  },
  statusBadge: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20
  },
  statusText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14
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
  aspectText: {
    fontSize: 14,
    color: '#2C3E50',
    flex: 1,
  },
  aspectScore: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#27AE60',
  },
})