import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import ReadingOpenIcon from './ReadingOpenIcon'

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
  modalOpenByCard?: boolean
  showModalActionIcon?: boolean
  /**
   * Layout denso: o técnico vira a linha de destaque (sem o rótulo "Tipo:") e
   * casa/timing/impacto colapsam numa única linha separada por "·". Numa lista
   * longa isso corta ~3 linhas por card sem perder nenhum dado. As telas que não
   * passam a prop seguem com o layout empilhado de sempre.
   */
  dense?: boolean
  /** Áreas do status que o trânsito toca, já formatadas ("Amor · Carreira"). */
  areasLabel?: string | null
  areasLabelPrefix?: string
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
  modalOpenByCard = false,
  showModalActionIcon = false,
  dense = false,
  areasLabel,
  areasLabelPrefix = 'Afeta',
}: TransitInsightCardProps) {
  const isDark = variant === 'dark'
  const useModalDetail = detailMode === 'modal' && typeof onOpenDetailModal === 'function'
  const openModalByCard = useModalDetail && modalOpenByCard
  const showHeaderBookIcon = useModalDetail && showModalActionIcon
  const normalizedImpact = Number.isFinite(impactValue01 as number)
    ? Math.max(0, Math.min(1, Number(impactValue01)))
    : null
  const cardStyles = [
    styles.card,
    dense ? styles.cardDense : null,
    isDark ? styles.cardDark : styles.cardLight,
    featured ? styles.cardFeatured : null,
  ]

  // Casa · timing · impacto numa linha só. Cada um custava uma linha inteira
  // (a barra de impacto custava duas) para dizer uma coisa curta.
  const metaDenseLine = [
    houseLabel ? `${houseLabelPrefix} ${houseLabel}` : null,
    timingLabel || null,
    normalizedImpact !== null ? `impacto ${Math.round(normalizedImpact * 100)}%` : null,
  ]
    .filter(Boolean)
    .join('  ·  ')

  const cardContent = (
    <>
      {/* Selo na MESMA linha do título. Antes ocupava uma linha só dele, acima —
          o card crescia sem entregar informação nenhuma a mais. */}
      <View style={styles.titleRow}>
        {indexLabel ? <Text style={styles.number}>{indexLabel}</Text> : null}
        <Text style={[styles.title, isDark ? styles.titleDark : styles.titleLight]}>{title}</Text>
        <View style={styles.headerRight}>
          {showHeaderBookIcon ? (
            <View style={styles.readingIconWrap}>
              <ReadingOpenIcon
                size={16}
                color={isDark ? '#D2D2D7' : '#334155'}
              />
            </View>
          ) : null}
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Text style={styles.statusText}>{statusLabel}</Text>
          </View>
        </View>
      </View>
      {dense ? (
        <>
          {technicalTypeLabel ? (
            <Text style={[styles.techDense, isDark ? styles.techDenseDark : styles.techDenseLight]}>
              {technicalTypeLabel}
            </Text>
          ) : null}
          {metaDenseLine ? <Text style={styles.metaDense}>{metaDenseLine}</Text> : null}
          {areasLabel ? (
            <Text style={styles.areasDense}>
              <Text style={styles.areasDensePrefix}>{areasLabelPrefix}: </Text>
              {areasLabel}
            </Text>
          ) : null}
        </>
      ) : (
        <>
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
        </>
      )}

      {/* Condicional: quem quer a leitura só atrás do "Ver leitura" passa directText
          vazio — sem isso sobrava um Text vazio ocupando espaço no card. */}
      {String(directText || '').trim() ? (
        <Text style={[styles.directText, isDark ? styles.directTextDark : styles.directTextLight]}>
          {directText}
        </Text>
      ) : null}
      {!openModalByCard ? (
        <TouchableOpacity
          style={[styles.toggleButton, isDark ? styles.toggleButtonDark : styles.toggleButtonLight]}
          onPress={useModalDetail ? onOpenDetailModal : onToggleFull}
        >
          {useModalDetail && showModalActionIcon ? (
            <ReadingOpenIcon
              size={16}
              color={isDark ? '#F8FAFC' : '#1E293B'}
            />
          ) : (
            <Text style={[styles.toggleText, isDark ? styles.toggleTextDark : styles.toggleTextLight]}>
              {useModalDetail ? 'Abrir leitura' : fullExpanded ? 'Ocultar leitura' : 'Ver leitura'}
            </Text>
          )}
        </TouchableOpacity>
      ) : null}

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
    </>
  )

  if (openModalByCard) {
    return (
      <TouchableOpacity
        style={cardStyles}
        onPress={onOpenDetailModal}
        activeOpacity={0.92}
      >
        {cardContent}
      </TouchableOpacity>
    )
  }

  return (
    <View style={cardStyles}>
      {cardContent}
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  readingIconWrap: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#94A3B8',
    backgroundColor: 'rgba(255,255,255,0.06)',
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
    flexShrink: 0,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    minWidth: 0,
  },
  titleLight: {
    color: '#0F172A',
  },
  titleDark: {
    color: '#FFFFFF',
  },
  cardDense: {
    padding: 10,
    marginBottom: 6,
  },
  // O técnico deixa de ser nota de rodapé: é ele que diz QUAIS planetas e qual
  // aspecto — justamente o que o título temático não carrega.
  techDense: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 3,
  },
  techDenseLight: { color: '#334155' },
  techDenseDark: { color: '#C8CDE8' },
  metaDense: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 4,
  },
  // Cor própria: é a ponte entre o trânsito e o score que o usuário vê na Home.
  areasDense: {
    fontSize: 11,
    fontWeight: '600',
    color: '#7C3AED',
    marginBottom: 6,
  },
  areasDensePrefix: {
    color: '#94A3B8',
    fontWeight: '600',
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
