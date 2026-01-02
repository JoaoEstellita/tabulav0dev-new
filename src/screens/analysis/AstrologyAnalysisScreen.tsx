import React, { useMemo } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useNavigation } from '@react-navigation/native'
import { useLifeAreas } from '../../hooks/useLifeAreas'
import AnalysisImpactStack from './AnalysisImpactStack'
import PlanetaryFlowMap from './PlanetaryFlowMap'
import PredictiveTimeline from './PredictiveTimeline'
import { buildImpactNodes } from '../home/impact/buildImpactNodes'

export default function AstrologyAnalysisScreen() {
  const navigation = useNavigation<any>()
  const { transitData, loading } = useLifeAreas()
  const impactNodes = useMemo(
    () => buildImpactNodes(transitData?.currentTransits, transitData?.lifeAreas),
    [transitData?.currentTransits, transitData?.lifeAreas]
  )

  const synthesis = useMemo(() => {
    if (!transitData?.lifeAreas) return null
    const entries = Object.entries(transitData.lifeAreas)
    const pressured = entries
      .filter(([, area]) => typeof area?.percentage === 'number')
      .sort((a, b) => (a[1].percentage || 0) - (b[1].percentage || 0))
      .slice(0, 2)
      .map(([key]) => key)
    const supported = entries
      .filter(([, area]) => typeof area?.percentage === 'number')
      .sort((a, b) => (b[1].percentage || 0) - (a[1].percentage || 0))
      .slice(0, 1)
      .map(([key]) => key)

    if (!pressured.length && !supported.length) return null
    return { pressured, supported }
  }, [transitData?.lifeAreas])

  return (
    <LinearGradient colors={['#0F0F23', '#1A1A3A']} style={styles.container}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Analise Astrologica do Momento</Text>
          <Text style={styles.subtitle}>
            Leitura profunda dos transitos, aspectos e seus fluxos atuais.
          </Text>
          <Text style={styles.helper}>
            Tudo aqui representa tendencias em movimento, nao definicoes permanentes.
          </Text>
        </View>

        <View style={styles.section}>
          <AnalysisImpactStack
            impactNodes={impactNodes}
            lifeAreas={transitData?.lifeAreas}
            isLoading={loading}
          />
        </View>

        <View style={styles.section}>
          <PlanetaryFlowMap impactNodes={impactNodes} />
        </View>

        <View style={styles.section}>
          <PredictiveTimeline
            impactNodes={impactNodes}
            currentTransits={transitData?.currentTransits}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sintese final</Text>
          {synthesis ? (
            <Text style={styles.sectionBody}>
              O momento pede atencao em {synthesis.pressured.join(' e ') || 'algumas areas'},
              com apoio consistente em {synthesis.supported.join(' e ') || 'outras areas'}.
              Essa leitura muda conforme os fluxos avancam.
            </Text>
          ) : (
            <Text style={styles.sectionBody}>
              Essa leitura muda conforme os fluxos avancam. Atualize seus dados para uma sintese mais precisa.
            </Text>
          )}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate('Tabs', { screen: 'Home' })}
          >
            <Text style={styles.backButtonText}>Voltar ao Perfil</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  title: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '700',
  },
  subtitle: {
    color: '#C7D2FE',
    fontSize: 13,
    marginTop: 6,
  },
  helper: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 8,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '700',
  },
  sectionBody: {
    color: '#CBD5F5',
    fontSize: 12,
    marginTop: 8,
    lineHeight: 18,
  },
  backButton: {
    marginTop: 12,
    backgroundColor: '#FDE68A',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#0F0F23',
    fontSize: 13,
    fontWeight: '700',
  },
  bottomSpacing: {
    height: 40,
  },
})
