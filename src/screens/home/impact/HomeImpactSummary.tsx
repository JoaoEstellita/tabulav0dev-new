import React, { useMemo } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { decodeUnicodeEscapes, translatePlanetPT } from '../../../utils/astro/pt'
import { normalizeKey } from '../../../utils/astro/normalizeKey'
import { buildTransitTitle as buildSharedTransitTitle } from '../../../utils/transitPresentation'
import type { ImpactAreaNode } from './buildImpactNodes'

interface HomeImpactSummaryProps {
  impactNodes: ImpactAreaNode[]
  lifeAreas?: Record<string, any> | null
  lunarPhaseLabel?: string | null
  recentTransits?: Array<{
    transitPlanet: string
    natalPlanet: string
    type: string
    orb: number
    isApplying?: boolean
    strength?: number
  }>
}

const translateAspectLabel = (type: string): string => {
  const key = normalizeKey(type)
  const map: Record<string, string> = {
    conjuncao: 'conjun\u00E7\u00E3o',
    conjunction: 'conjun\u00E7\u00E3o',
    sextil: 'sextil',
    sextile: 'sextil',
    quadratura: 'quadratura',
    square: 'quadratura',
    trigono: 'tr\u00EDgono',
    trine: 'tr\u00EDgono',
    oposicao: 'oposi\u00E7\u00E3o',
    opposition: 'oposi\u00E7\u00E3o',
    quincuncio: 'quinc\u00FAncio',
    quincunx: 'quinc\u00FAncio',
  }
  return map[key] || decodeUnicodeEscapes(type)
}

const formatOrb = (orb?: number) => {
  if (typeof orb !== 'number') return ''
  return `${orb.toFixed(1)}\u00B0`
}

export default function HomeImpactSummary({
  impactNodes,
  lifeAreas,
  lunarPhaseLabel,
  recentTransits,
}: HomeImpactSummaryProps) {
  const recentItems = useMemo(() => {
    if (!recentTransits?.length) return []
    return [...recentTransits]
      .sort((a, b) => {
        if (a.isApplying !== b.isApplying) return a.isApplying ? -1 : 1
        if (typeof a.orb === 'number' && typeof b.orb === 'number') {
          if (a.orb !== b.orb) return a.orb - b.orb
        }
        return (b.strength || 0) - (a.strength || 0)
      })
      .slice(0, 5)
  }, [recentTransits])

  if (!recentItems.length && !impactNodes.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Pulso do momento</Text>
        <Text style={styles.subtitle}>Sem dados suficientes para resumir agora.</Text>
      </View>
    )
  }

  const lunarLabel = lunarPhaseLabel ? decodeUnicodeEscapes(lunarPhaseLabel) : null

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pulso do momento</Text>
      <View style={styles.metaRow}>
        {lunarLabel ? (
          <Text style={styles.lunarLine}>Fase lunar: {lunarLabel}</Text>
        ) : null}
      </View>
      {recentItems.length > 0 ? (
        <View style={styles.rows}>
          <Text style={styles.sectionLabel}>Trânsitos recentes</Text>
          {recentItems.map((item, index) => {
            const label = buildSharedTransitTitle({
              transitPlanet: translatePlanetPT(item.transitPlanet),
              aspectLabel: translateAspectLabel(item.type),
              targetLabel: translatePlanetPT(item.natalPlanet),
            })
            const orbLabel = formatOrb(item.orb)
            return (
              <View key={`${item.transitPlanet}-${item.natalPlanet}-${index}`} style={styles.transitItem}>
                <Text style={styles.transitTitle}>{label}</Text>
                {orbLabel ? (
                  <Text style={styles.transitMeta}>Orbe {orbLabel}{item.isApplying ? ' - aplicante' : ' - separante'}</Text>
                ) : null}
              </View>
            )
          })}
        </View>
      ) : (
        <Text style={styles.subtitle}>Sem trânsitos recentes para exibir.</Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  title: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
  },
  subtitle: {
    color: '#94A3B8',
    fontSize: 13,
    marginTop: 6,
  },
  metaRow: {
    marginTop: 6,
  },
  metaLine: {
    color: '#94A3B8',
    fontSize: 12,
  },
  lunarLine: {
    color: '#E2E8F0',
    fontSize: 12,
    marginTop: 4,
  },
  rows: {
    gap: 10,
    marginTop: 12,
  },
  sectionLabel: {
    color: '#A78BFA',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 6,
  },
  transitItem: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  transitTitle: {
    color: '#E2E8F0',
    fontSize: 13,
    fontWeight: '600',
  },
  transitMeta: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 4,
  },
  ctaRow: {
    marginTop: 12,
    alignItems: 'flex-start',
  },
  ctaText: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '600',
  },
})






