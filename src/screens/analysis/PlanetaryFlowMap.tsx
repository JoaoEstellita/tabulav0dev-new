import React, { useMemo, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import Svg, { Path, Circle } from 'react-native-svg'
import type { ImpactAreaNode, ImpactContributor } from '../home/impact/buildImpactNodes'
import { translatePlanetPT } from '../../utils/astro/pt'
import { getLifeAreaLabel } from '../../constants/lifeAreas'
import { useAppLanguage } from '../../hooks/useAppLanguage'

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
  // Aspecto dominante deste fluxo — dado REAL para a curva de intensidade:
  orb?: number        // graus até o aspecto exato (menor = mais forte / mais perto do pico)
  isApplying?: boolean // true = orbe apertando (subindo p/ o pico); false = separando (descendo)
}

const directionColor = (direction: FlowDirection) => {
  if (direction === 'apoio') return '#22C55E'
  if (direction === 'pressao') return '#F97316'
  return '#FBBF24'
}

const toIntensity = (ratio: number) => {
  if (ratio >= 0.66) return 'forte'
  if (ratio >= 0.33) return 'moderada'
  return 'leve'
}

const CHART_W = 150
const CHART_H = 34
const MAX_ORB = 8 // órbita máxima considerada (graus); além disso o aspecto praticamente não pesa

// Curva de intensidade REAL de um aspecto: um sino centrado no aspecto exato.
// A intensidade cresce à medida que o orbe aperta (pico no orbe 0) e cai depois.
// O eixo x é a passagem do aspecto (aproxima → exato → afasta); marcamos "hoje"
// pela posição real: orbe pequeno = perto do pico; applying = antes do pico
// (lado esquerdo), separating = depois (lado direito).
const buildBellPath = () => {
  const steps = 24
  const pts: string[] = []
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * CHART_W
    // gaussiana centrada no meio (o aspecto exato)
    const t = (i / steps) * 2 - 1 // -1..1
    const y = CHART_H - 3 - (CHART_H - 6) * Math.exp(-(t * t) / 0.12)
    pts.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`)
  }
  return pts.join(' ')
}

// Posição de "hoje" na curva a partir do orbe real e do sentido (applying/separating).
const todayMarker = (orb?: number, isApplying?: boolean) => {
  const ratio = Number.isFinite(orb) ? Math.min(Math.abs(orb as number) / MAX_ORB, 1) : 0.5
  // orbe 0 = centro (0.5); orbe grande = extremos. applying = lado esquerdo, separating = direito.
  const x = isApplying === false
    ? 0.5 + ratio * 0.5   // separando → direita do pico
    : 0.5 - ratio * 0.5   // aplicando (ou desconhecido) → esquerda do pico
  const t = x * 2 - 1
  const y = CHART_H - 3 - (CHART_H - 6) * Math.exp(-(t * t) / 0.12)
  return { x: x * CHART_W, y }
}

const buildFlowEntries = (nodes: ImpactAreaNode[]): FlowEntry[] => {
  const map: Record<string, Record<string, {
    pos: number; neg: number; reason?: string
    bestAbs: number; orb?: number; isApplying?: boolean
  }>> = {}

  nodes.forEach((node) => {
    node.contributors.forEach((contributor: ImpactContributor) => {
      if (!Number.isFinite(contributor.score) || contributor.score === 0) return
      if (!map[contributor.planet]) map[contributor.planet] = {}
      if (!map[contributor.planet][node.areaKey]) {
        map[contributor.planet][node.areaKey] = { pos: 0, neg: 0, reason: contributor.reason, bestAbs: 0 }
      }
      const cell = map[contributor.planet][node.areaKey]
      if (contributor.score > 0) cell.pos += contributor.score
      if (contributor.score < 0) cell.neg += Math.abs(contributor.score)
      if (!cell.reason && contributor.reason) cell.reason = contributor.reason
      // Guarda o aspecto dominante (maior |finalScore|) para desenhar a curva real.
      const top = (contributor.topAspects || [])[0]
      if (top) {
        const absScore = Number.isFinite(top.finalScore) ? Math.abs(top.finalScore as number) : 0
        if (absScore >= cell.bestAbs) {
          cell.bestAbs = absScore
          cell.orb = top.orb
          cell.isApplying = top.isApplying
        }
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
        orb: stats.orb,
        isApplying: stats.isApplying,
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
  const { t } = useAppLanguage()
  const directionLabel = (direction: FlowDirection) => {
    if (direction === 'apoio') return t('analysis.flowMap.direction.support')
    if (direction === 'pressao') return t('analysis.flowMap.direction.pressure')
    return t('analysis.flowMap.direction.mixed')
  }
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
        <Text style={styles.emptyText}>{t('analysis.flowMap.empty')}</Text>
      </View>
    )
  }

  return (
    <View>
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
              <View>
                <Svg width={CHART_W} height={CHART_H} viewBox={`0 0 ${CHART_W} ${CHART_H}`}>
                  <Path
                    d={buildBellPath()}
                    stroke={directionColor(flow.direction)}
                    strokeWidth={2}
                    strokeOpacity={0.85}
                    strokeLinecap="round"
                    fill="none"
                  />
                  {(() => {
                    const m = todayMarker(flow.orb, flow.isApplying)
                    return <Circle cx={m.x} cy={m.y} r={3.5} fill={directionColor(flow.direction)} />
                  })()}
                </Svg>
                <View style={styles.axisRow}>
                  <Text style={styles.axisText}>{t('analysis.flowMap.axis.approach')}</Text>
                  <Text style={styles.axisText}>{t('analysis.flowMap.axis.peak')}</Text>
                  <Text style={styles.axisText}>{t('analysis.flowMap.axis.fade')}</Text>
                </View>
              </View>
              <View style={styles.flowMetaRow}>
                <Text style={[styles.flowMeta, { color: directionColor(flow.direction) }]}>{directionLabel(flow.direction)}</Text>
                <Text style={styles.flowMeta}>
                  {flow.intensity === 'forte'
                    ? t('analysis.flowMap.intensity.strong')
                    : flow.intensity === 'moderada'
                    ? t('analysis.flowMap.intensity.medium')
                    : t('analysis.flowMap.intensity.light')}
                </Text>
                {Number.isFinite(flow.orb) && (
                  <Text style={styles.flowMetaFaint}>
                    {flow.isApplying === false ? t('analysis.flowMap.separating') : t('analysis.flowMap.applying')}
                  </Text>
                )}
              </View>
            </View>
            <Text style={styles.flowReason}>
              {flow.reason ? flow.reason : t('analysis.flowMap.reasonDefault')}
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
    gap: 14,
  },
  axisRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: CHART_W,
    marginTop: 2,
  },
  axisText: {
    color: '#64748B',
    fontSize: 8,
  },
  flowMetaRow: {
    gap: 4,
    flex: 1,
  },
  flowMeta: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
  },
  flowMetaFaint: {
    color: '#64748B',
    fontSize: 10,
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
