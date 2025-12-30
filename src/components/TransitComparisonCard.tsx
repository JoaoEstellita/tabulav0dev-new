import React from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import type { PlanetComparison, ChartSummary } from '../services/astrology/RealAstrologyEngine'
import useTransits from '../hooks/useTransits'
import { useUserSettings } from '../hooks/useUserSettings'
import UserService from '../services/firebase/UserService'
import { useAuth } from '../hooks/useAuth'
import { HOUSE_SYSTEMS, normalizeHouseSystem, formatHouseSystemLabel } from '../astro/houseSystem'
import type { HouseSystem } from '../astro/houseSystem'

interface TransitComparisonCardProps {
  planetComparisons: PlanetComparison[]
  chartSummary: ChartSummary
  ascendant?: number
  midheaven?: number
  natalAscendant?: number
  natalMidheaven?: number
  housesCusps?: number[]
}
const ELEMENT_ICONS = {
  fire: '??',
  earth: '??',
  air: '??',
  water: '??',
  // Portugues
  fogo: '??',
  terra: '??',
  ar: '??',
  agua: '??'
} as const

// ⚡ Ícones das Modalidades
const MODALITY_ICONS = {
  cardinal: '⚡',
  fixed: '🔒',
  mutable: '🔄',
  // Português
  cardeal: '⚡',
  fixo: '🔒',
  mutavel: '🔄'
} as const

// ⭐ Ícones dos Aspectos
const ASPECT_ICONS = {
  'conjunção': '☌',
  'sextil': '⚹', 
  'quadratura': '□',
  'trígono': '△',
  'oposição': '☍'
} as const

// 🎨 Cores dos Aspectos
const ASPECT_COLORS = {
  'conjunção': '#FFD700',
  'sextil': '#10B981',
  'quadratura': '#EF4444',
  'trígono': '#3B82F6',
  'oposição': '#F59E0B'
} as const

export default function TransitComparisonCard({ 
  planetComparisons, 
  chartSummary,
  ascendant,
  midheaven,
  natalAscendant,
  natalMidheaven,
  housesCusps
}: TransitComparisonCardProps) {
  const { personal, statusPersonal } = useTransits(null)
  const { settings, updateSettings } = useUserSettings()
  const { user } = useAuth()
  const [houseSystem, setHouseSystem] = React.useState<HouseSystem>(
    normalizeHouseSystem(settings?.houseSystem || 'placidus')
  )

  // Sincronizar quando as configurações carregarem/alterarem
  React.useEffect(() => {
    if (settings?.houseSystem) {
      setHouseSystem(normalizeHouseSystem(settings.houseSystem))
    }
  }, [settings?.houseSystem])
  const applyHouseSystem = React.useCallback(async (sys: HouseSystem) => {
    try {
      const normalized = normalizeHouseSystem(sys)
      setHouseSystem(normalized)
      await updateSettings({ houseSystem: sys })
      ;(globalThis as any).__userHouseSystem = normalized
      if (user?.uid) { try { await UserService.setHouseSystem(user.uid, normalized) } catch {} }
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('house-system-changed'))
      }
    } catch {}
  }, [])
  const showApprox = false // placeholder: card não recebe props de housesApproximate aqui
  const personalByTransitPlanet = React.useMemo(() => {
    const map: Record<string, typeof personal> = {}
    for (const item of personal) {
      if (!map[item.transitPlanet]) map[item.transitPlanet] = []
      ;(map[item.transitPlanet] as any[]).push(item)
    }
    return map
  }, [personal])
  
  const formatDegree = (longitude: number): string => {
    return `${longitude.toFixed(1)}°`
  }

  // 🎯 CONVERTER GRAUS PARA 0°-30° POR SIGNO
  const formatDegreeInSign = (longitude: number): string => {
    const degreeInSign = longitude % 30
    return `${degreeInSign.toFixed(1)}°`
  }

  // 🌟 TRADUÇÃO DOS PLANETAS
  const translatePlanetName = (planetName: string): string => {
    const translations: { [key: string]: string } = {
      'Sun': 'Sol',
      'Moon': 'Lua', 
      'Mercury': 'Mercúrio',
      'Venus': 'Vênus',
      'Mars': 'Marte',
      'Jupiter': 'Júpiter',
      'Saturn': 'Saturno',
      'Uranus': 'Urano',
      'Neptune': 'Netuno',
      'Pluto': 'Plutão'
    }
    return translations[planetName] || planetName
  }\n\n  const translateElement = (element: string): string => {
    const translations: { [key: string]: string } = {
      'fire': 'Fogo',
      'earth': 'Terra',
      'air': 'Ar', 
      'water': 'Água'
    }
    return translations[element] || element
  }

  // ⚡ TRADUÇÃO DAS MODALIDADES
  const translateModality = (modality: string): string => {
    const translations: { [key: string]: string } = {
      'cardinal': 'Cardeal',
      'fixed': 'Fixo',
      'mutable': 'Mutável'
    }
    return translations[modality] || modality
  }

  const getSignFromDegree = (degree: number): string => {
    const signs = ['Áries', 'Touro', 'Gêmeos', 'Câncer', 'Leão', 'Virgem', 
                   'Libra', 'Escorpião', 'Sagitário', 'Capricórnio', 'Aquário', 'Peixes']
    const signIndex = Math.floor(degree / 30) % 12
    return signs[signIndex]
  }

  // ⚡ Velocidade removida para melhor UX - informação desnecessária

  // 🌌 Funções auxiliares removidas (casas astrológicas não implementadas)

  const getAspectColor = (aspect: string): string => {
    return ASPECT_COLORS[aspect as keyof typeof ASPECT_COLORS] || '#6B7280'
  }

  const getAspectIcon = (aspect: string): string => {
    return ASPECT_ICONS[aspect as keyof typeof ASPECT_ICONS] || '•'
  }

  // 🏷️ Distância até a cúspide mais próxima (casas ATUAIS)
  const nearestCuspInfo = React.useCallback((longitude: number): { house: number, distance: number } | null => {
    try {
      if (!housesCusps || housesCusps.length !== 12) return null
      const norm = (d: number) => ((d % 360) + 360) % 360
      const lon = norm(longitude)
      let best: { house: number, distance: number } | null = null
      for (let i = 0; i < 12; i++) {
        const cusp = norm(housesCusps[i])
        const diff = Math.abs(lon - cusp)
        const dist = Math.min(diff, 360 - diff)
        if (!best || dist < best.distance) best = { house: i + 1, distance: dist }
      }
      return best
    } catch {
      return null
    }
  }, [housesCusps])

  return (
    <LinearGradient
      colors={['#1E1E2E', '#2A2A3E']}
      style={styles.container}
    >
      {/* Status Pessoal agregado */}
      {statusPersonal && (
        <View style={{ marginBottom: 8 }}>
          <Text style={{ color:'#fff', opacity:0.9 }}>
            Status pessoal: {statusPersonal.level} ({statusPersonal.score}%)
          </Text>
        </View>
      )}
      {/* 📊 Resumo Elemental e Modal */}
      <View style={styles.summarySection}>
        <View style={styles.sectionHeader}>
          <Ionicons name="analytics" size={20} color="#FFD700" />
          <Text style={styles.sectionTitle}>📝 Resumo da Carta</Text>
          {showApprox && (
            <Text style={{ color:'#FFD700', marginLeft: 8, fontSize: 12 }}>aprox</Text>
          )}
        </View>

        {/* Análise Elemental */}
        <View style={styles.analysisRow}>
                <Text style={styles.analysisLabel}>Elementos:</Text>
          <View style={styles.elementalGrid}>
            <View style={styles.elementalComparison}>
              <Text style={styles.comparisonLabel}>Natal:</Text>
              <View style={styles.elementalRow}>
                {Object.entries(chartSummary.elemental.natal).map(([element, count]) => (
                  <Text key={element} style={styles.elementalItem}>
                    {ELEMENT_ICONS[element as keyof typeof ELEMENT_ICONS]}{count}
                  </Text>
                ))}
              </View>
            </View>
            <View style={styles.elementalComparison}>
              <Text style={styles.comparisonLabel}>Atual:</Text>
              <View style={styles.elementalRow}>
                {Object.entries(chartSummary.elemental.current).map(([element, count]) => (
                  <Text key={element} style={styles.elementalItem}>
                    {ELEMENT_ICONS[element as keyof typeof ELEMENT_ICONS]}{count}
                  </Text>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Análise de Modalidades */}
        <View style={styles.analysisRow}>
          <Text style={styles.analysisLabel}>⚡ Modalidades:</Text>
          <View style={styles.elementalGrid}>
            <View style={styles.elementalComparison}>
              <Text style={styles.comparisonLabel}>Natal:</Text>
              <View style={styles.elementalRow}>
                {Object.entries(chartSummary.modality.natal).map(([modality, count]) => (
                  <Text key={modality} style={styles.elementalItem}>
                    {MODALITY_ICONS[modality as keyof typeof MODALITY_ICONS]}{count}
                  </Text>
                ))}
              </View>
            </View>
            <View style={styles.elementalComparison}>
              <Text style={styles.comparisonLabel}>Atual:</Text>
              <View style={styles.elementalRow}>
                {Object.entries(chartSummary.modality.current).map(([modality, count]) => (
                  <Text key={modality} style={styles.elementalItem}>
                    {MODALITY_ICONS[modality as keyof typeof MODALITY_ICONS]}{count}
                  </Text>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Mudanças Detectadas */}
        {(chartSummary.elemental.changes.length > 0 || chartSummary.modality.changes.length > 0) && (
          <View style={styles.changesSection}>
            <Text style={styles.changesTitle}>📈 Mudanças Detectadas:</Text>
            {chartSummary.elemental.changes.filter(Boolean).map((change, index) => (
              <Text key={`elemental-${index}`} style={styles.changeItem}>• {change}</Text>
            ))}
            {chartSummary.modality.changes.filter(Boolean).map((change, index) => (
              <Text key={`modality-${index}`} style={styles.changeItem}>• {change}</Text>
            ))}
          </View>
        )}
      </View>

      {/* 🪐 Comparações Planetárias */}
      <ScrollView style={styles.planetsSection} showsVerticalScrollIndicator={false}>
      <View style={styles.sectionHeader}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="planet" size={20} color="#FFD700" />
          <Text style={styles.sectionTitle}>Trânsitos Comparativos</Text>
        </View>
        <View style={styles.toggleGroup}>
          <TouchableOpacity
            onPress={() => {
              const idx = HOUSE_SYSTEMS.indexOf(houseSystem)
              const next = HOUSE_SYSTEMS[(idx + 1) % HOUSE_SYSTEMS.length]
              applyHouseSystem(next)
            }}
            style={[styles.toggleBtn, styles.toggleBtnActive]}
            accessibilityRole="button"
            accessibilityLabel="Alternar sistema de casas"
          >
            <Text style={[styles.toggleText, styles.toggleTextActive]}>
              {formatHouseSystemLabel(houseSystem)}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

        {planetComparisons.map((comparison, index) => (
          <View key={comparison.name} style={styles.planetCard}>
            {/* Cabeçalho do Planeta */}
            <View style={styles.planetHeader}>
              <Text style={styles.planetName}>
                {comparison.name === 'Sun' ? '☉' : 
                 comparison.name === 'Moon' ? '☽' :
                 comparison.name === 'Mercury' ? '☿' :
                 comparison.name === 'Venus' ? '♀' :
                 comparison.name === 'Mars' ? '♂' :
                 comparison.name === 'Jupiter' ? '♃' :
                 comparison.name === 'Saturn' ? '♄' :
                 comparison.name === 'Uranus' ? '♅' :
                 comparison.name === 'Neptune' ? '♆' :
                 comparison.name === 'Pluto' ? '♇' : '●'} {translatePlanetName(comparison.name)}
              </Text>
            </View>

            {/* Comparacao Natal vs Transito */}
            <View style={styles.comparisonGrid}>
              {/* Coluna Natal */}
              <View style={styles.comparisonColumn}>
                <Text style={styles.columnTitle}>🌟 Natal</Text>
                <Text style={styles.positionText}>
                  {formatDegreeInSign(comparison.natal.longitude)} {comparison.natal.sign}
                </Text>
                <View style={styles.attributesRow}>
                  <Text style={styles.attributeChip}>
                    {ELEMENT_ICONS[comparison.natal.element]} {translateElement(comparison.natal.element)}
                  </Text>
                  <Text style={styles.attributeChip}>
                    {MODALITY_ICONS[comparison.natal.modality]} {translateModality(comparison.natal.modality)}
                  </Text>
                </View>
              </View>

              {/* Coluna Transito */}
              <View style={styles.comparisonColumn}>
                <Text style={styles.columnTitle}>Transito</Text>
                <Text style={styles.positionText}>
                  {formatDegreeInSign(comparison.current.longitude)} {comparison.current.sign}
                  {comparison.current.isRetrograde && ' ℞'}
                </Text>
                <View style={styles.attributesRow}>
                  <Text style={styles.attributeChip}>
                    {ELEMENT_ICONS[comparison.current.element]} {translateElement(comparison.current.element)}
                  </Text>
                  <Text style={styles.attributeChip}>
                    {MODALITY_ICONS[comparison.current.modality]} {translateModality(comparison.current.modality)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Linha de resumo explícita das casas + badge "próx. cúspide" */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
              <Text style={[styles.positionText, { opacity: 0.9 }]}>
                Casa natal {comparison.natal.house} → transito {comparison.current.house}
              </Text>
              {(() => {
                const info = nearestCuspInfo(comparison.current.longitude)
                if (info && info.distance <= 0.5) {
                  return (
                    <Text style={styles.nearCuspChip}>{`próx. cúspide ${info.house} (${info.distance.toFixed(2)}°)`}</Text>
                  )
                }
                return null
              })()}
            </View>

            {/* Aspectos do Momento (Coletivo) para este planeta */}
            {comparison.planetaryAspects.length > 0 && (
              <View style={styles.aspectsSection}>
                <Text style={styles.aspectsTitle}>✨ Aspectos Coletivos:</Text>
                {comparison.planetaryAspects.slice(0, 3).map((aspect, aspectIndex) => (
                  <View key={aspectIndex} style={styles.aspectItem}>
                    <Text style={[styles.aspectIcon, { color: getAspectColor(aspect.type) }]}>
                      {getAspectIcon(aspect.type)}
                    </Text>
                    <Text style={styles.aspectText}>
                      {translatePlanetName(aspect.planet1 === comparison.name ? aspect.planet2 : aspect.planet1)} 
                      ({aspect.orb.toFixed(1)}° orbe)
                    </Text>
                    <View style={[styles.aspectStrength, { backgroundColor: getAspectColor(aspect.type) }]}>
                      <Text style={styles.aspectStrengthText}>{aspect.strength.toFixed(0)}%</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Aspectos com Casas */}
            {comparison.houseAspects.length > 0 && (
              <View style={styles.aspectsSection}>
                <Text style={styles.aspectsTitle}>🏠 Aspectos com Casas:</Text>
                {comparison.houseAspects.slice(0, 2).map((houseAspect, houseIndex) => (
                  <View key={houseIndex} style={styles.aspectItem}>
                    <Text style={[styles.aspectIcon, { color: getAspectColor(houseAspect.aspect) }]}>
                      {getAspectIcon(houseAspect.aspect)}
                    </Text>
                    <Text style={styles.aspectText}>
                      Casa {houseAspect.house} - {houseAspect.meaning} 
                      ({houseAspect.orb.toFixed(1)}° orbe)
                    </Text>
                    <View style={[styles.aspectStrength, { backgroundColor: getAspectColor(houseAspect.aspect) }]}>
                      <Text style={styles.aspectStrengthText}>{houseAspect.strength.toFixed(0)}%</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Trânsitos Pessoais para este planeta em trânsito */}
            {(personalByTransitPlanet[comparison.name]?.length ?? 0) > 0 && (
              <View style={styles.aspectsSection}>
                <Text style={styles.aspectsTitle}>⭐ Trânsitos Pessoais:</Text>
                {personalByTransitPlanet[comparison.name]
                  .slice(0,3)
                  .map((t, idx) => (
                    <View key={idx} style={styles.aspectItem}>
                      <Text style={[styles.aspectIcon, { color: getAspectColor(t.type) }]}>
                        {getAspectIcon(t.type)}
                      </Text>
                      <Text style={styles.aspectText}>
                        {translatePlanetName(t.transitPlanet)} {t.type} {translatePlanetName(t.natalPlanet)}
                        {' '}({t.orb.toFixed(1)}°{t.isApplying ? ', aplicante' : ', separante'})
                      </Text>
                      {/* Remover contactIndex - não existe na interface */}
                      <View style={[styles.aspectStrength, { backgroundColor: getAspectColor(t.type) }]}>
                        <Text style={styles.aspectStrengthText}>{t.strength.toFixed(0)}%</Text>
                      </View>
                    </View>
                ))}
                {/* Casa natal -> transito apenas */}
                <Text style={{ color:'#A0A0A0', fontSize:12, marginTop:4 }}>
                  Casa natal {Number(comparison.natal.house || 0)} → transito {Number(comparison.current.house || 0)}
                </Text>
              </View>
            )}
          </View>
        ))}


      </ScrollView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  summarySection: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  analysisRow: {
    marginBottom: 12,
  },
  analysisLabel: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  elementalGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  elementalComparison: {
    flex: 1,
    marginHorizontal: 4,
  },
  comparisonLabel: {
    color: '#A0A0A0',
    fontSize: 12,
    marginBottom: 4,
  },
  elementalRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  elementalItem: {
    color: '#FFFFFF',
    fontSize: 14,
    marginRight: 8,
    marginBottom: 2,
  },
  changesSection: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  changesTitle: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  changeItem: {
    color: '#FFFFFF',
    fontSize: 12,
    marginBottom: 2,
  },
  planetsSection: {
    flex: 1,
  },
  planetCard: {
    backgroundColor: 'rgba(42, 42, 62, 0.6)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FFD700',
  },
  planetHeader: {
    marginBottom: 12,
  },
  planetName: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: 'bold',
  },
  comparisonGrid: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  comparisonColumn: {
    flex: 1,
    paddingHorizontal: 8,
  },
  columnTitle: {
    color: '#A0A0A0',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  positionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  houseText: {
    color: '#A0A0A0',
    fontSize: 14,
    marginBottom: 4,
  },
  speedText: {
    color: '#10B981',
    fontSize: 12,
    marginBottom: 8,
  },
  attributesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  attributeChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#FFFFFF',
    fontSize: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 4,
    marginBottom: 2,
  },
  aspectsSection: {
    marginTop: 12,
  },
  aspectsTitle: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  toggleGroup: {
    flexDirection: 'row',
    gap: 6,
  },
  toggleBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.08)'
  },
  toggleBtnActive: {
    backgroundColor: 'rgba(255,215,0,0.2)'
  },
  toggleText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500'
  },
  toggleTextActive: {
    fontWeight: '700'
  },
  nearCuspChip: {
    marginLeft: 8,
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    color: '#FFD700',
    fontSize: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  aspectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  aspectIcon: {
    fontSize: 16,
    marginRight: 8,
    width: 20,
    textAlign: 'center',
  },
  aspectText: {
    color: '#FFFFFF',
    fontSize: 12,
    flex: 1,
  },
  aspectStrength: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    minWidth: 40,
  },
  aspectStrengthText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  // 🎯 ESTILOS PARA ASCENDENTE E MEIO DO CÉU
  anglesSection: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  angleCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  angleHeader: {
    marginBottom: 8,
  },
  angleName: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  angleComparison: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  angleColumn: {
    flex: 1,
    alignItems: 'center',
  },
  angleLabel: {
    color: '#CCCCCC',
    fontSize: 12,
    marginBottom: 4,
  },
  angleDegree: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  angleSign: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '600',
  },
  angleArrow: {
    color: '#FFD700',
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 16,
  },
  // 🌌 Estilos das casas removidos (não implementadas)
})



