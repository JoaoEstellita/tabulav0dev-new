import React, { useMemo } from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useLifeAreas } from '../../hooks/useLifeAreas'
import { translatePlanetPT } from '../../utils/astro/pt'
import AnalysisImpactStack from './AnalysisImpactStack'
import { buildImpactNodes } from '../home/impact/buildImpactNodes'

export default function AstrologyAnalysisScreen() {
  const { transitData, loading } = useLifeAreas()
  const impactNodes = useMemo(
    () => buildImpactNodes(transitData?.currentTransits, transitData?.lifeAreas),
    [transitData?.currentTransits, transitData?.lifeAreas]
  )

  const planetFlows = useMemo(() => {
    const flows: Record<
      string,
      { positive: number; negative: number; areas: Set<string> }
    > = {}

    impactNodes.forEach((node) => {
      node.contributors.forEach((contributor) => {
        if (!Number.isFinite(contributor.score) || contributor.score === 0) return
        if (!flows[contributor.planet]) {
          flows[contributor.planet] = {
            positive: 0,
            negative: 0,
            areas: new Set<string>(),
          }
        }
        const bucket = flows[contributor.planet]
        if (contributor.score > 0) bucket.positive += contributor.score
        if (contributor.score < 0) bucket.negative += Math.abs(contributor.score)
        bucket.areas.add(node.areaKey)
      })
    })

    return Object.entries(flows)
      .map(([planet, data]) => {
        const direction = data.positive >= data.negative ? 'apoio' : 'pressao'
        return {
          planet,
          direction,
          areas: Array.from(data.areas),
          magnitude: Math.max(data.positive, data.negative),
        }
      })
      .sort((a, b) => b.magnitude - a.magnitude)
      .slice(0, 8)
  }, [impactNodes])

  return (
    <LinearGradient colors={['#0F0F23', '#1A1A3A']} style={styles.container}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Analise Astrologica do Momento</Text>
          <Text style={styles.subtitle}>
            Leitura detalhada dos transitos e seus fluxos.
          </Text>
        </View>

        <AnalysisImpactStack
          impactNodes={impactNodes}
          lifeAreas={transitData?.lifeAreas}
          isLoading={loading}
        />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fluxos planetarios</Text>
          <Text style={styles.sectionSubtitle}>
            Como cada planeta direciona apoio ou pressao nas areas.
          </Text>
          {planetFlows.length === 0 ? (
            <Text style={styles.emptyText}>Sem fluxos detalhados disponiveis.</Text>
          ) : (
            planetFlows.map((flow) => (
              <View key={`flow-${flow.planet}`} style={styles.flowCard}>
                <Text style={styles.flowTitle}>
                  {translatePlanetPT(flow.planet)} - {flow.direction}
                </Text>
                <Text style={styles.flowAreas}>
                  Areas: {flow.areas.map((area) => area).join(', ')}
                </Text>
              </View>
            ))
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Linha do tempo</Text>
          <Text style={styles.sectionSubtitle}>
            Essa configuracao pode ser temporaria ou estrutural. Em breve voce
            vera janelas mais detalhadas.
          </Text>
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
  section: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '700',
  },
  sectionSubtitle: {
    color: '#C7D2FE',
    fontSize: 12,
    marginTop: 6,
  },
  flowCard: {
    marginTop: 10,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    borderRadius: 12,
    padding: 12,
  },
  flowTitle: {
    color: '#FDE68A',
    fontSize: 13,
    fontWeight: '600',
  },
  flowAreas: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 4,
  },
  emptyText: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 8,
  },
  bottomSpacing: {
    height: 40,
  },
})

