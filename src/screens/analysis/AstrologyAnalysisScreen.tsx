import React, { useMemo } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { useLifeAreas } from '../../hooks/useLifeAreas'
import PlanetaryFlowMap from './PlanetaryFlowMap'
import PredictiveTimeline from './PredictiveTimeline'
import { buildImpactNodes } from '../home/impact/buildImpactNodes'

export default function AstrologyAnalysisScreen() {
  const navigation = useNavigation<any>()
  const { transitData } = useLifeAreas()
  const impactNodes = useMemo(
    () => buildImpactNodes(transitData?.currentTransits, transitData?.lifeAreas),
    [transitData?.currentTransits, transitData?.lifeAreas]
  )

  return (
    <LinearGradient colors={['#0F0F23', '#1A1A3A']} style={styles.container}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Analise Astrologica do Momento</Text>
          <Text style={styles.subtitle}>
            Leitura tecnica dos transitos, aspectos e casas ativadas.
          </Text>
          <Text style={styles.helper}>
            Tudo aqui indica tendencias em movimento, nunca determinacoes.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fluxos planetarios</Text>
          <Text style={styles.sectionBody}>
            Relacao qualitativa entre planetas e areas impactadas (apoio ou pressao).
          </Text>
          <PlanetaryFlowMap impactNodes={impactNodes} />
          <TouchableOpacity
            style={styles.timelineButton}
            onPress={() => navigation.navigate('PlanetTimeline')}
          >
            <Text style={styles.timelineButtonText}>Abrir linha do tempo planetaria</Text>
            <Ionicons name="arrow-forward" size={16} color="#0F0F23" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tempo e evolucao</Text>
          <Text style={styles.sectionBody}>
            Classificacao qualitativa do momento: passageiro, em desenvolvimento ou estrutural.
          </Text>
          <PredictiveTimeline
            impactNodes={impactNodes}
            currentTransits={transitData?.currentTransits}
          />
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
  timelineButton: {
    marginTop: 12,
    backgroundColor: '#FDE68A',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timelineButtonText: {
    color: '#0F0F23',
    fontSize: 13,
    fontWeight: '700',
  },
  bottomSpacing: {
    height: 40,
  },
})
