import React, { useMemo, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import Svg, { Path } from 'react-native-svg'
import type { ImpactAreaNode, ImpactContributor } from '../home/impact/buildImpactNodes'
import { translatePlanetPT } from '../../utils/astro/pt'
import { getLifeAreaLabel } from '../../constants/lifeAreas'

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

const directionColor = (direction: FlowDirection) => {
  if (direction === 'apoio') return '#22C55E'
  if (direction === 'pressao') return '#F97316'
  return '#FBBF24'
}

const directionLabel = (direction: FlowDirection) => {
  if (direction === 'apoio') return 'Apoio'
  if (direction === 'pressao') return 'Press\u00E3o'
  return 'Misto'
}

const toIntensity = (ratio: number) => {
  if (ratio >= 0.66) return 'forte'
  if (ratio >= 0.33) return 'moderada'
  return 'leve'
}

const FLOW_WIDTHS: Record<FlowEntry['intensity'], number> = {
  leve: 90,
  moderada: 130,
  forte: 165,
}

const FLOW_WAVES: Record<FlowEntry['intensity'], number> = {
  leve: 3,
  moderada: 5,
  forte: 7,
}

const buildFlowPath = (width: number, wave: number) => {
  const w1 = Math.round(width * 0.25)
  const w2 = Math.round(width * 0.5)
  const w3 = Math.round(width * 0.75)
  const end = Math.max(width - 2, 2)
  const mid = 11
  return `M2 ${mid} C ${w1} ${mid - wave} ${w2} ${mid + wave} ${w3} ${mid - wave} S ${end - 6} ${mid + wave} ${end} ${mid}`
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
      <Text style={styles.sectionTitle}>Fluxos planet\u00E1rios</Text>
      <Text style={styles.sectionSubtitle}>
        Mapa qualitativo de como os planetas direcionam apoio e press\u00E3o.
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
                {getLifeAreaLabel(area)}
              </Text>
            </TouchableOpacity>
          )
        })}
      </View>

      <View style={styles.flowList}>
        {visibleFlows.map((flow) => (
          <View key={`${flow.planet}-${flow.areaKey}`} style={styles.flowRow}>
            <View style={styles.flowHeaderRow}>
              <Text style={styles.flowPlanet}>{translatePlanetPT(flow.planet)}</Text>
              <Ionicons name="arrow-forward" size={14} color="#64748B" />
              <Text style={styles.flowArea}>{getLifeAreaLabel(flow.areaKey)}</Text>
            </View>
            <View style={styles.flowLineWrap}>
              <Svg
                width={FLOW_WIDTHS[flow.intensity]}
                height={22}
                viewBox={`0 0 ${FLOW_WIDTHS[flow.intensity]} 22`}
              >
                <Path
                  d={buildFlowPath(FLOW_WIDTHS[flow.intensity], FLOW_WAVES[flow.intensity])}
                  stroke={directionColor(flow.direction)}
                  strokeWidth={2}
                  strokeOpacity={0.8}
                  strokeLinecap="round"
                  fill="none"
                />
              </Svg>
              <View style={styles.flowMetaRow}>
                <Text style={styles.flowMeta}>{directionLabel(flow.direction)}</Text>
                <Text style={styles.flowMeta}>{flow.intensity}</Text>
              </View>
            </View>
            <Text style={styles.flowReason}>
              {flow.reason ? flow.reason : 'Influ\u00EAncia em movimento.'}
            </Text>
          </View>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  sectionTitle: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
  },
  sectionSubtitle: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 4,
    marginBottom: 12,
  },
  selectorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  selectorChip: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  selectorChipActive: {
    backgroundColor: 'rgba(255,215,0,0.2)',
  },
  selectorText: {
    color: '#E2E8F0',
    fontSize: 12,
  },
  selectorTextActive: {
    color: '#FFD700',
    fontWeight: '600',
  },
  flowList: {
    gap: 12,
    marginTop: 6,
  },
  flowRow: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  flowHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  flowPlanet: {
    color: '#E2E8F0',
    fontSize: 13,
    fontWeight: '600',
  },
  flowArea: {
    color: '#CBD5F5',
    fontSize: 12,
  },
  flowLineWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  flowMetaRow: {
    gap: 4,
  },
  flowMeta: {
    color: '#94A3B8',
    fontSize: 11,
  },
  flowReason: {
    marginTop: 6,
    color: '#CBD5F5',
    fontSize: 12,
  },
  emptyState: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  emptyText: {
    color: '#94A3B8',
    fontSize: 12,
  },
})
