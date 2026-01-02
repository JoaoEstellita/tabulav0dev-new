import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { translatePlanetPT } from '../../../utils/astro/pt'
import type { ImpactContributor } from './buildImpactNodes'

interface ImpactContributorItemProps {
  contributor: ImpactContributor
  showScore?: boolean
}

const DIRECTION_STYLES = {
  apoio: { label: 'Apoio', color: '#22C55E' },
  pressao: { label: 'Pressao', color: '#F97316' },
  neutro: { label: 'Neutro', color: '#94A3B8' },
}

export default function ImpactContributorItem({
  contributor,
  showScore = false,
}: ImpactContributorItemProps) {
  const [showDetails, setShowDetails] = useState(false)
  const direction = DIRECTION_STYLES[contributor.direction]

  return (
    <Pressable style={styles.container} onPress={() => setShowDetails(false)}>
      <View style={styles.row}>
        <View style={styles.left}>
          <Ionicons name="star" size={14} color="#FDE68A" />
          <Text style={styles.planetLabel}>{translatePlanetPT(contributor.planet)}</Text>
        </View>
        <View style={styles.right}>
          <View style={[styles.badge, { borderColor: direction.color }]}>
            <Text style={[styles.badgeText, { color: direction.color }]}>
              {direction.label}
            </Text>
          </View>
          {showScore && (
            <Text style={[styles.score, { color: direction.color }]}>
              {Math.round(contributor.score)}
            </Text>
          )}
          <TouchableOpacity
            onPress={() => setShowDetails((prev) => !prev)}
            style={styles.infoButton}
          >
            <Ionicons name="information-circle-outline" size={16} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </View>

      {showDetails && (
        <Pressable style={styles.detailBlock} onPress={() => setShowDetails(false)}>
          {contributor.tags?.length > 0 && (
            <Text style={styles.detailText}>
              Tags: {contributor.tags.slice(0, 3).join(', ')}
            </Text>
          )}
          {contributor.topAspects?.length > 0 ? (
            contributor.topAspects.map((aspect, index) => (
              <Text key={`${contributor.id}-asp-${index}`} style={styles.detailText}>
                {aspect.type} com {translatePlanetPT(aspect.with)}
                {typeof aspect.orb === 'number' ? ` (orb ${aspect.orb.toFixed(1)}deg)` : ''}
              </Text>
            ))
          ) : (
            <Text style={styles.detailMuted}>Detalhe indisponivel nesta versao.</Text>
          )}
        </Pressable>
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  planetLabel: {
    color: '#E5E7EB',
    fontSize: 13,
    fontWeight: '600',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  score: {
    fontSize: 12,
    fontWeight: '700',
  },
  infoButton: {
    padding: 2,
  },
  detailBlock: {
    marginTop: 6,
    paddingLeft: 20,
    gap: 4,
  },
  detailText: {
    color: '#CBD5F5',
    fontSize: 12,
  },
  detailMuted: {
    color: '#94A3B8',
    fontSize: 12,
  },
})

