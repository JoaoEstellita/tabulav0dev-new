import React from 'react'
import { Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { getPlanetImageUri, type PlanetKey } from '../config/planetImageSource'

type ReadingDetailModalProps = {
  visible: boolean
  onClose: () => void
  statusLabel?: string
  statusColor?: string
  title: string
  timingLabel?: string | null
  subtitle?: string | null
  directText: string
  fullText: string
  actionText?: string | null
  metaText?: string | null
  keywords?: string[]
}

const PLANET_KEYS: PlanetKey[] = [
  'Sun',
  'Moon',
  'Mercury',
  'Venus',
  'Mars',
  'Jupiter',
  'Saturn',
  'Uranus',
  'Neptune',
  'Pluto',
]

const PLANET_LABELS_PT: Record<PlanetKey, string> = {
  Sun: 'Sol',
  Moon: 'Lua',
  Mercury: 'Mercúrio',
  Venus: 'Vênus',
  Mars: 'Marte',
  Jupiter: 'Júpiter',
  Saturn: 'Saturno',
  Uranus: 'Urano',
  Neptune: 'Netuno',
  Pluto: 'Plutão',
}

const PLANET_FALLBACK_ICON: Record<PlanetKey, string> = {
  Sun: 'sunny',
  Moon: 'moon',
  Mercury: 'swap-horizontal',
  Venus: 'heart',
  Mars: 'flame',
  Jupiter: 'planet',
  Saturn: 'timer',
  Uranus: 'flash',
  Neptune: 'water',
  Pluto: 'radio-button-on',
}

const normalizeToken = (value: unknown): string =>
  String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()

const resolvePlanetFromText = (value: string): PlanetKey | null => {
  const normalized = normalizeToken(value)
  for (const key of PLANET_KEYS) {
    const label = normalizeToken(PLANET_LABELS_PT[key])
    if (normalized.includes(label) || normalized.includes(normalizeToken(key))) {
      return key
    }
  }
  return null
}

const buildDefaultKeywords = (
  title: string,
  subtitle: string | null | undefined,
  statusLabel: string,
  timingLabel: string | null | undefined
): string[] => {
  const out: string[] = []
  const normalizedTitle = normalizeToken(title)
  const add = (token?: string | null) => {
    const value = String(token || '').trim()
    if (!value) return
    if (!out.some((item) => normalizeToken(item) === normalizeToken(value))) out.push(value)
  }

  if (normalizedTitle.includes('quadratura') || normalizedTitle.includes('oposicao') || normalizedTitle.includes('quincuncio')) {
    add('ajuste')
    add('tensão')
  }
  if (normalizedTitle.includes('trigono') || normalizedTitle.includes('sextil')) {
    add('fluidez')
    add('integração')
  }
  if (normalizedTitle.includes('casa')) add('casa ativada')
  if (normalizedTitle.includes('transito')) add('trânsito')
  if (subtitle) add(subtitle)
  if (timingLabel) add(timingLabel.split('•')[0])
  if (statusLabel) add(statusLabel)

  return out.slice(0, 4)
}

export default function ReadingDetailModal({
  visible,
  onClose,
  statusLabel = 'Neutro',
  statusColor = '#64748B',
  title,
  timingLabel,
  subtitle,
  directText,
  fullText,
  actionText,
  metaText,
  keywords,
}: ReadingDetailModalProps) {
  const { width } = useWindowDimensions()
  const isNarrow = width <= 430
  const planetKey = React.useMemo(() => resolvePlanetFromText(`${title} ${directText}`), [title, directText])
  const imageUri = planetKey ? getPlanetImageUri(planetKey) : null
  const keywordChips = React.useMemo(
    () => (Array.isArray(keywords) && keywords.length ? keywords : buildDefaultKeywords(title, subtitle, statusLabel, timingLabel)),
    [keywords, title, subtitle, statusLabel, timingLabel]
  )

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <LinearGradient colors={['#101936', '#1C2A56']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
            <View style={styles.heroLeft}>
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.heroImage} resizeMode="cover" />
              ) : planetKey ? (
                <View style={styles.heroFallback}>
                  <Ionicons name={PLANET_FALLBACK_ICON[planetKey] as any} size={18} color="#F8FAFC" />
                </View>
              ) : (
                <View style={styles.heroFallback}>
                  <Ionicons name="sparkles" size={18} color="#F8FAFC" />
                </View>
              )}
            </View>
            <View style={styles.heroBody}>
              <Text style={[styles.title, isNarrow ? styles.titleNarrow : null]}>{title}</Text>
              {subtitle ? (
                <Text style={[styles.subtitle, isNarrow ? styles.subtitleNarrow : null]}>{subtitle}</Text>
              ) : (
                <Text style={[styles.subtitle, isNarrow ? styles.subtitleNarrow : null]}>Leitura aplicada ao contexto atual</Text>
              )}
              <View style={styles.heroMetaRow}>
                <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
                  <Text style={styles.statusText}>{statusLabel}</Text>
                </View>
                {timingLabel ? <Text style={[styles.timing, isNarrow ? styles.timingNarrow : null]}>{timingLabel}</Text> : null}
              </View>
            </View>
            <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
              <Ionicons name="close" size={18} color="#0F172A" />
            </TouchableOpacity>
          </LinearGradient>

          <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
            {keywordChips.length ? (
              <View style={styles.tagsRow}>
                {keywordChips.slice(0, 4).map((keyword) => (
                  <View key={keyword} style={styles.tag}>
                    <Text style={styles.tagText}>{keyword}</Text>
                  </View>
                ))}
              </View>
            ) : null}

            <View style={styles.sectionCard}>
              <Text style={[styles.sectionLabel, isNarrow ? styles.sectionLabelNarrow : null]}>Leitura-chave</Text>
              <Text style={[styles.body, isNarrow ? styles.bodyNarrow : null]}>{directText}</Text>
            </View>

            <View style={styles.sectionCard}>
              <Text style={[styles.sectionLabel, isNarrow ? styles.sectionLabelNarrow : null]}>Interpretação aplicada</Text>
              <Text style={[styles.body, isNarrow ? styles.bodyNarrow : null]}>{fullText}</Text>
            </View>

            {actionText ? (
              <View style={styles.sectionCard}>
                <Text style={[styles.sectionLabel, isNarrow ? styles.sectionLabelNarrow : null]}>Uso prático</Text>
                <Text style={[styles.body, isNarrow ? styles.bodyNarrow : null]}>{actionText}</Text>
              </View>
            ) : null}

            {metaText ? (
              <View style={styles.sectionCard}>
                <Text style={[styles.sectionLabel, isNarrow ? styles.sectionLabelNarrow : null]}>Contexto técnico</Text>
                <Text style={[styles.meta, isNarrow ? styles.metaNarrow : null]}>{metaText}</Text>
              </View>
            ) : null}
          </ScrollView>

          <TouchableOpacity style={styles.doneButton} onPress={onClose}>
            <Text style={[styles.doneButtonText, isNarrow ? styles.doneButtonTextNarrow : null]}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(4, 10, 24, 0.78)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 14,
  },
  card: {
    width: '100%',
    maxWidth: 920,
    maxHeight: '90%',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.35)',
    backgroundColor: '#0E1A45',
    overflow: 'hidden',
  },
  hero: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  heroLeft: {
    width: 62,
    height: 62,
    borderRadius: 31,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.28)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  heroImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  heroFallback: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(2,6,23,0.35)',
  },
  heroBody: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    color: '#F8FAFC',
    fontSize: 30,
    fontWeight: '800',
  },
  titleNarrow: {
    fontSize: 24,
  },
  subtitle: {
    color: '#D6E4FF',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },
  subtitleNarrow: {
    fontSize: 12,
  },
  heroMetaRow: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  timing: {
    color: '#C7D2FE',
    fontSize: 12,
    fontWeight: '700',
  },
  timingNarrow: {
    fontSize: 11,
  },
  closeIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
  },
  scroll: {
    backgroundColor: '#132457',
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.25)',
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 8,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  tag: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#EAB308',
    backgroundColor: 'rgba(234,179,8,0.14)',
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagText: {
    color: '#FDE047',
    fontSize: 12,
    fontWeight: '700',
  },
  sectionCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.3)',
    backgroundColor: 'rgba(30, 58, 138, 0.22)',
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 10,
  },
  sectionLabel: {
    color: '#FBBF24',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 6,
  },
  sectionLabelNarrow: {
    fontSize: 14,
  },
  body: {
    color: '#F8FAFC',
    fontSize: 19,
    lineHeight: 27,
    marginBottom: 2,
  },
  bodyNarrow: {
    fontSize: 16,
    lineHeight: 23,
  },
  meta: {
    color: '#CBD5E1',
    fontSize: 17,
    lineHeight: 25,
  },
  metaNarrow: {
    fontSize: 14,
    lineHeight: 21,
  },
  doneButton: {
    marginHorizontal: 12,
    marginTop: 2,
    marginBottom: 12,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#082F8A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneButtonText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
  },
  doneButtonTextNarrow: {
    fontSize: 18,
  },
})
