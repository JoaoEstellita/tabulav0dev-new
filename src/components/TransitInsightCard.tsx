import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

type TransitInsightCardProps = {
  indexLabel?: string
  statusLabel: string
  statusColor: string
  title: string
  timingLabel?: string | null
  directText: string
  fullExpanded: boolean
  onToggleFull: () => void
  fullTitle: string
  fullText: string
  actionText?: string | null
  metaText?: string | null
  variant?: 'light' | 'dark'
}

export default function TransitInsightCard({
  indexLabel,
  statusLabel,
  statusColor,
  title,
  timingLabel,
  directText,
  fullExpanded,
  onToggleFull,
  fullTitle,
  fullText,
  actionText,
  metaText,
  variant = 'light',
}: TransitInsightCardProps) {
  const isDark = variant === 'dark'
  return (
    <View style={[styles.card, isDark ? styles.cardDark : styles.cardLight]}>
      <View style={styles.header}>
        {indexLabel ? <Text style={styles.number}>{indexLabel}</Text> : <View />}
        <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
          <Text style={styles.statusText}>{statusLabel}</Text>
        </View>
      </View>

      <Text style={[styles.title, isDark ? styles.titleDark : styles.titleLight]}>{title}</Text>
      {timingLabel ? <Text style={styles.timing}>{timingLabel}</Text> : null}

      <View style={[styles.directBox, isDark ? styles.directBoxDark : styles.directBoxLight]}>
        <Text style={[styles.directText, isDark ? styles.directTextDark : styles.directTextLight]}>{directText}</Text>
        <TouchableOpacity style={styles.toggleButton} onPress={onToggleFull}>
          <Text style={styles.toggleText}>
            {fullExpanded ? 'Ocultar interpretação completa' : 'Ver interpretação completa'}
          </Text>
        </TouchableOpacity>
      </View>

      {fullExpanded ? (
        <View style={[styles.fullBox, isDark ? styles.fullBoxDark : styles.fullBoxLight]}>
          <Text style={[styles.fullTitle, isDark ? styles.fullTitleDark : styles.fullTitleLight]}>{fullTitle}</Text>
          <Text style={[styles.fullText, isDark ? styles.fullTextDark : styles.fullTextLight]}>{fullText}</Text>
          {actionText ? <Text style={styles.meta}>Ação sugerida: {actionText}</Text> : null}
          {metaText ? <Text style={styles.meta}>{metaText}</Text> : null}
        </View>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  cardLight: {
    backgroundColor: '#FFFFFF',
  },
  cardDark: {
    backgroundColor: '#1C1C1E',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  number: {
    fontSize: 14,
    fontWeight: '700',
    color: '#B45309',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  titleLight: {
    color: '#B45309',
  },
  titleDark: {
    color: '#FFFFFF',
  },
  timing: {
    fontSize: 12,
    color: '#F97316',
    marginBottom: 6,
  },
  directBox: {
    marginTop: 6,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
  directBoxLight: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
  },
  directBoxDark: {
    backgroundColor: '#202025',
    borderColor: '#2A2A2E',
  },
  directText: {
    fontSize: 14,
    lineHeight: 20,
  },
  directTextLight: {
    color: '#78350F',
  },
  directTextDark: {
    color: '#D2D2D7',
  },
  toggleButton: {
    marginTop: 8,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#3A3A42',
  },
  toggleText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '700',
  },
  fullBox: {
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    gap: 8,
  },
  fullBoxLight: {
    backgroundColor: '#F8FAFC',
    borderColor: '#CBD5E1',
  },
  fullBoxDark: {
    backgroundColor: '#141418',
    borderColor: '#2A2A2E',
  },
  fullTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  fullTitleLight: {
    color: '#0F172A',
  },
  fullTitleDark: {
    color: '#FFFFFF',
  },
  fullText: {
    fontSize: 14,
    lineHeight: 21,
  },
  fullTextLight: {
    color: '#1E293B',
  },
  fullTextDark: {
    color: '#D2D2D7',
  },
  meta: {
    fontSize: 12,
    color: '#FFD700',
  },
})
