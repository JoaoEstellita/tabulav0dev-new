import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

type TransitInsightCardProps = {
  indexLabel?: string
  statusLabel: string
  statusColor: string
  title: string
  houseLabel?: string | null
  houseLabelPrefix?: string
  timingLabel?: string | null
  technicalTypeLabel?: string | null
  directText: string
  fullExpanded: boolean
  onToggleFull: () => void
  fullTitle?: string
  fullText?: string
  actionText?: string | null
  metaText?: string | null
  impactValue01?: number | null
  impactLabel?: string | null
  impactColor?: string
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
  houseLabelPrefix = 'Casa impactada',
  timingLabel,
  technicalTypeLabel,
  directText,
  fullExpanded,
  onToggleFull,
  fullTitle = 'Leitura completa',
  fullText = '',
  actionText,
  metaText,
  impactValue01,
  impactLabel,
  impactColor = '#F59E0B',
  variant = 'light',
  featured = false,
  detailMode = 'inline',
  onOpenDetailModal,
}: TransitInsightCardProps) {
  const isDark = variant === 'dark'
  const useModalDetail = detailMode === 'modal' && typeof onOpenDetailModal === 'function'
  const normalizedImpact = Number.isFinite(impactValue01 as number)
    ? Math.max(0, Math.min(1, Number(impactValue01)))
    : null
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
          {houseLabelPrefix}: {houseLabel}
        </Text>
      ) : null}
      {technicalTypeLabel ? (
        <Text style={[styles.technicalLine, isDark ? styles.technicalLineDark : styles.technicalLineLight]}>
          Tipo: {technicalTypeLabel}
        </Text>
      ) : null}
      {timingLabel ? <Text style={styles.timing}>{timingLabel}</Text> : null}
      {normalizedImpact !== null ? (
        <View style={styles.impactRow}>
          <View style={[styles.impactTrack, isDark ? styles.impactTrackDark : styles.impactTrackLight]}>
            <View style={[styles.impactFill, { width: `${Math.round(normalizedImpact * 100)}%`, backgroundColor: impactColor }]} />
          </View>
          <Text style={[styles.impactLabel, isDark ? styles.impactLabelDark : styles.impactLabelLight]}>
            {impactLabel || `Impacto relativo ${Math.round(normalizedImpact * 100)}%`}
          </Text>
        </View>
      ) : null}

      <Text style={[styles.directText, isDark ? styles.directTextDark : styles.directTextLight]}>
        {directText}
      </Text>
      <TouchableOpacity
        style={[styles.toggleButton, isDark ? styles.toggleButtonDark : styles.toggleButtonLight]}
        onPress={useModalDetail ? onOpenDetailModal : onToggleFull}
      >
        <Text style={[styles.toggleText, isDark ? styles.toggleTextDark : styles.toggleTextLight]}>
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
    marginBottom: 6,
    fontWeight: '600',
  },
  impactRow: {
    marginBottom: 8,
  },
  impactTrack: {
    width: '100%',
    height: 6,
    borderRadius: 999,
    overflow: 'hidden',
    marginBottom: 4,
  },
  impactTrackLight: {
    backgroundColor: '#E2E8F0',
  },
  impactTrackDark: {
    backgroundColor: '#374151',
  },
  impactFill: {
    height: '100%',
    borderRadius: 999,
  },
  impactLabel: {
    fontSize: 11,
    fontWeight: '700',
  },
  impactLabelLight: {
    color: '#64748B',
  },
  impactLabelDark: {
    color: '#9CA3AF',
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
  technicalLine: {
    fontSize: 11,
    marginBottom: 6,
    fontWeight: '600',
  },
  technicalLineLight: {
    color: '#64748B',
  },
  technicalLineDark: {
    color: '#9CA3AF',
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
  },
  toggleButtonLight: {
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
  },
  toggleButtonDark: {
    borderColor: '#475569',
    backgroundColor: '#111827',
  },
  toggleText: {
    fontSize: 12,
    fontWeight: '700',
  },
  toggleTextLight: {
    color: '#1E293B',
  },
  toggleTextDark: {
    color: '#F8FAFC',
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
