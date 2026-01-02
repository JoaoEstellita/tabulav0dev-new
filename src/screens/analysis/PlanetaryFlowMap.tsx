import React, { useMemo, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import type { ImpactAreaNode, ImpactContributor } from '../home/impact/buildImpactNodes'
import { translatePlanetPT } from '../../utils/astro/pt'

interface PlanetaryFlowMapProps {
  impactNodes: ImpactAreaNode[]
}

type FlowDirection = 'apoio' | 'pressao' | 'misto'

type FlowEntry = {
  planet: string
  areaKey: string
  direction: FlowDirection
  intensity: 'leve' | 'moderada' | 'forte'
  scoreAbs: number
  reason?: string
}

const AREA_LABELS: Record<string, string> = {
  amor: 'Amor',
  carreira: 'Carreira',
  financas: 'Financas',
  saude: 'Saude',
  familia: 'Familia',
  espiritualidade: 'Espiritualidade',
  comunicacao: 'Comunicacao',
  transformacao: 'Transformacao',
}

const directionColor = (direction: FlowDirection) => {
  if (direction === 'apoio') return '#22C55E'
  if (direction === 'pressao') return '#F97316'
  return '#FBBF24'
}

const directionLabel = (direction: FlowDirection) => {
  if (direction === 'apoio') return 'Apoio'
  if (direction === 'pressao') return 'Pressao'
  return 'Misto'
}

const toIntensity = (ratio: number) => {
  if (ratio >= 0.66) return 'forte'
  if (ratio >= 0.33) return 'moderada'
  return 'leve'
}

const buildFlowEntries = (nodes: ImpactAreaNode[]): FlowEntry[] => {
  const map: Record<string, Record<string, { pos: number; neg: number; reason?: string }>> = {}

  nodes.forEach((node) => {
    node.contributors.forEach((contributor: ImpactContributor) => {
      if (!Number.isFinite(contributor.score) || contributor.score === 0) return
      if (!map[contributor.planet]) map[contributor.planet] = {}
      if (!map[contributor.planet][node.areaKey]) {
        map[contributor.planet][node.areaKey] = { pos: 0, neg: 0, reason: contributor.reason }
      }
      if (contributor.score > 0) map[contributor.planet][node.areaKey].pos += contributor.score
      if (contributor.score < 0) map[contributor.planet][node.areaKey].neg += Math.abs(contributor.score)
      if (!map[contributor.planet][node.areaKey].reason && contributor.reason) {
        map[contributor.planet][node.areaKey].reason = contributor.reason
      }
    })
  })

  const entries: FlowEntry[] = []
  Object.entries(map).forEach(([planet, areas]) => {
    Object.entries(areas).forEach(([areaKey, stats]) => {
      const direction: FlowDirection = stats.pos > 0 && stats.neg > 0
        ? 'misto'
        : stats.pos >= stats.neg
        ? 'apoio'
        : 'pressao'
      entries.push({
        planet,
        areaKey,
        direction,
        intensity: 'leve',
        scoreAbs: stats.pos + stats.neg,
        reason: stats.reason,
      })
    })
  })

  const maxAbs = Math.max(...entries.map((entry) => entry.scoreAbs), 0)
  return entries.map((entry) => {
    const ratio = maxAbs ? entry.scoreAbs / maxAbs : 0
    return { ...entry, intensity: toIntensity(ratio) }
  })
}

export default function PlanetaryFlowMap({ impactNodes }: PlanetaryFlowMapProps) {
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null)
  const [selectedArea, setSelectedArea] = useState<string | null>(null)

  const flows = useMemo(() => buildFlowEntries(impactNodes), [impactNodes])
  const planets = useMemo(
    () => Array.from(new Set(flows.map((flow) => flow.planet))),
    [flows]
  )
  const areas = useMemo(
    () => Array.from(new Set(flows.map((flow) => flow.areaKey))),
    [flows]
  )

  const visibleFlows = flows.filter((flow) => {
    if (selectedPlanet && flow.planet !== selectedPlanet) return false
    if (selectedArea && flow.areaKey !== selectedArea) return false
    return true
  })

  if (!flows.length) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyText}>Sem dados suficientes para mapear os fluxos.</Text>
      </View>
    )
  }

  return (
    <View>
      <Text style={styles.sectionTitle}>Fluxos planetarios</Text>
      <Text style={styles.sectionSubtitle}>
        Toque em um planeta ou area para focar nos fluxos principais.
      </Text>

      <View style={styles.selectorRow}>
        {planets.map((planet) => {
          const active = selectedPlanet === planet
          return (
            <TouchableOpacity
              key={`planet-${planet}`}
              style={[styles.selectorChip, active && styles.selectorChipActive]}
              onPress={() => setSelectedPlanet(active ? null : planet)}
            >
              <Text style={[styles.selectorText, active && styles.selectorTextActive]}>
                {translatePlanetPT(planet)}
              </Text>
            </TouchableOpacity>
          )
        })}
      </View>

      <View style={styles.selectorRow}>
        {areas.map((area) => {
          const active = selectedArea === area
          return (
            <TouchableOpacity
              key={`area-${area}`}
              style={[styles.selectorChip, active && styles.selectorChipActive]}
              onPress={() => setSelectedArea(active ? null : area)}
            >
              <Text style={[styles.selectorText, active && styles.selectorTextActive]}>
                {AREA_LABELS[area] || area}
              </Text>
            </TouchableOpacity>
          )
        })}
      </View>

      <View style={styles.flowList}>
        {visibleFlows.map((flow) => (
          <View key={`${flow.planet}-${flow.areaKey}`} style={styles.flowRow}>
            <Text style={styles.flowPlanet}>{translatePlanetPT(flow.planet)}</Text>
            <View style={styles.flowLineWrap}>
              <View
                style={[
                  styles.flowLine,
                  styles[`flowLine_${flow.intensity}`],
                  { backgroundColor: directionColor(flow.direction) },
                ]}
              />
              <Text style={styles.flowMeta}>
                {directionLabel(flow.direction)} {flow.intensity}
              </Text>
            </View>
            <Text style={styles.flowArea}>{AREA_LABELS[flow.areaKey] || flow.areaKey}</Text>
            {flow.reason ? (
              <Text style={styles.flowReason}>{flow.reason}</Text>
            ) : (
              <Text style={styles.flowReason}>Influencia em movimento.</Text>
            )}
          </View>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
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
  selectorRow: {
    marginTop: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectorChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.4)',
  },
  selectorChipActive: {
    backgroundColor: 'rgba(253,230,138,0.2)',
    borderColor: '#FDE68A',
  },
  selectorText: {
    color: '#CBD5F5',
    fontSize: 11,
  },
  selectorTextActive: {
    color: '#FDE68A',
    fontWeight: '700',
  },
  flowList: {
    marginTop: 12,
    gap: 12,
  },
  flowRow: {
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    borderRadius: 12,
    padding: 12,
  },
  flowPlanet: {
    color: '#E2E8F0',
    fontSize: 13,
    fontWeight: '700',
  },
  flowLineWrap: {
    marginTop: 8,
  },
  flowLine: {
    height: 6,
    borderRadius: 999,
  },
  flowLine_leve: {
    width: '30%',
  },
  flowLine_moderada: {
    width: '60%',
  },
  flowLine_forte: {
    width: '100%',
  },
  flowMeta: {
    marginTop: 6,
    color: '#94A3B8',
    fontSize: 11,
  },
  flowArea: {
    marginTop: 8,
    color: '#FDE68A',
    fontSize: 12,
    fontWeight: '600',
  },
  flowReason: {
    marginTop: 4,
    color: '#CBD5F5',
    fontSize: 11,
  },
  emptyState: {
    paddingVertical: 12,
  },
  emptyText: {
    color: '#94A3B8',
    fontSize: 12,
  },
})
