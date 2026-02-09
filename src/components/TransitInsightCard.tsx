import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

type TransitInsightCardProps = {
  indexLabel?: string
  statusLabel: string
  statusColor: string
  title: string
  houseLabel?: string | null
  timingLabel?: string | null
  directText: string
  fullExpanded: boolean
  onToggleFull: () => void
  fullTitle: string
  fullText: string
  actionText?: string | null
  metaText?: string | null
  variant?: 'light' | 'dark'
  featured?: boolean
  detailMode?: 'inline' | 'modal'
  onOpenDetailModal?: () => void
}

export default function TransitInsightCard({
  indexLabel,
  statusLabel,
  statusColor,
  title,
  houseLabel,
  timingLabel,
  directText,
  fullExpanded,
  onToggleFull,
  fullTitle,
  fullText,
  actionText,
  metaText,
  variant = 'light',
  featured = false,
  detailMode = 'inline',
  onOpenDetailModal,
}: TransitInsightCardProps) {
  const isDark = variant === 'dark'
  const useModalDetail = detailMode === 'modal' && typeof onOpenDetailModal === 'function'
  return (
    <View
      style={[
        styles.card,
        isDark ? styles.cardDark : styles.cardLight,
        featured ? styles.cardFeatured : null,
      ]}
    >
      <View style={styles.header}>
        {indexLabel ? <Text style={styles.number}>{indexLabel}</Text> : <View />}
        <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
          <Text style={styles.statusText}>{statusLabel}</Text>
        </View>
      </View>

      <Text style={[styles.title, isDark ? styles.titleDark : styles.titleLight]}>{title}</Text>
      {houseLabel ? (
        <Text style={[styles.houseLine, isDark ? styles.houseLineDark : styles.houseLineLight]}>
          Casa impactada: {houseLabel}
        </Text>
      ) : null}
      {timingLabel ? <Text style={styles.timing}>{timingLabel}</Text> : null}

      <Text style={[styles.directText, isDark ? styles.directTextDark : styles.directTextLight]}>
        {directText}
      </Text>
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={useModalDetail ? onOpenDetailModal : onToggleFull}
      >
        <Text style={styles.toggleText}>
          {useModalDetail ? 'Abrir leitura' : fullExpanded ? 'Ocultar leitura' : 'Ver leitura'}
        </Text>
      </TouchableOpacity>

      {!useModalDetail && fullExpanded ? (
        <View style={[styles.fullBox, isDark ? styles.fullBoxDark : styles.fullBoxLight]}>
          <Text style={[styles.fullTitle, isDark ? styles.fullTitleDark : styles.fullTitleLight]}>
            {fullTitle}
          </Text>
          <Text style={[styles.fullText, isDark ? styles.fullTextDark : styles.fullTextLight]}>
            {fullText}
          </Text>
          {actionText ? <Text style={styles.meta}>Acao sugerida: {actionText}</Text> : null}
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
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.08)',
  },
  cardFeatured: {
    borderColor: 'rgba(217,119,6,0.45)',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 2,
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
    color: '#0F172A',
  },
  titleDark: {
    color: '#FFFFFF',
  },
  timing: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 8,
    fontWeight: '600',
  },
  houseLine: {
    fontSize: 12,
    marginBottom: 6,
    fontWeight: '700',
  },
  houseLineLight: {
    color: '#475569',
  },
  houseLineDark: {
    color: '#A7A7B0',
  },
  directText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  directTextLight: {
    color: '#334155',
  },
  directTextDark: {
    color: '#D2D2D7',
  },
  toggleButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  toggleText: {
    color: '#1E293B',
    fontSize: 12,
    fontWeight: '600',
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
    color: '#475569',
  },
})
