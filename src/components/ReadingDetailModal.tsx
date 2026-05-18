import React from 'react'
import { Image, Modal, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { getPlanetImageUri, type PlanetKey } from '../config/planetImageSource'
import { useAppLanguage } from '../hooks/useAppLanguage'
import { translatePlanet } from '../utils/astro/pt'
import { TRANSIT_MODAL_UI_PTBR } from '../i18n/transitModalUi'
import type { TransitInterpretationV2 } from '../utils/transitInterpretationV2'

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
  interpretationV2?: TransitInterpretationV2 | null
  closeLabel?: string
  secondaryActionLabel?: string | null
  onSecondaryAction?: (() => void) | null
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

const extractPlanetsFromText = (value: string): PlanetKey[] => {
  const normalized = normalizeToken(value)
  const hits: Array<{ key: PlanetKey; index: number }> = []
  for (const key of PLANET_KEYS) {
    const labels = [normalizeToken(PLANET_LABELS_PT[key]), normalizeToken(key)]
    let best = -1
    for (const label of labels) {
      const idx = normalized.indexOf(label)
      if (idx >= 0 && (best < 0 || idx < best)) best = idx
    }
    if (best >= 0) hits.push({ key, index: best })
  }
  return hits.sort((a, b) => a.index - b.index).map((item) => item.key)
}

const extractAspectSymbol = (value: string): string | null => {
  const symbols = ['△', '□', '☍', '✶', '☌', '⚻', '⚺', '⚼', '∠']
  for (const symbol of symbols) {
    if (String(value || '').includes(symbol)) return symbol
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
  statusLabel,
  statusColor = '#64748B',
  title,
  timingLabel,
  subtitle,
  directText,
  fullText,
  actionText,
  metaText,
  keywords,
  interpretationV2,
  closeLabel,
  secondaryActionLabel,
  onSecondaryAction,
}: ReadingDetailModalProps) {
  const { t, language } = useAppLanguage()
  const tr = (key: string, fallback: string) => {
    const value = t(key)
    return value === key ? fallback : value
  }
  const resolvedStatusLabel = statusLabel || tr('common.neutral', 'Neutral')
  const resolvedCloseLabel = closeLabel || tr('common.close', 'Close')
  const localizeAstroText = React.useCallback((input: string): string => {
    let text = String(input || '')
    if (!text) return text

    const aspectMap: Record<string, Record<string, string>> = {
      'en-US': {
        conjuncao: 'conjunction',
        trigono: 'trine',
        sextil: 'sextile',
        quadratura: 'square',
        oposicao: 'opposition',
        quincuncio: 'quincunx',
        semissextil: 'semisextile',
        semiquadratura: 'semisquare',
        sesquiquadratura: 'sesquiquadrate',
        harmonico: 'harmonic',
        desafiador: 'challenging',
        neutro: 'neutral',
      },
      'es-ES': {
        conjuncao: 'conjuncion',
        trigono: 'trigono',
        sextil: 'sextil',
        quadratura: 'cuadratura',
        oposicao: 'oposicion',
        quincuncio: 'quincuncio',
        semissextil: 'semisextil',
        semiquadratura: 'semicuadratura',
        sesquiquadratura: 'sesquicuadratura',
        harmonico: 'armonico',
        desafiador: 'desafiante',
        neutro: 'neutro',
      },
      'it-IT': {
        conjuncao: 'congiunzione',
        trigono: 'trigono',
        sextil: 'sestile',
        quadratura: 'quadratura',
        oposicao: 'opposizione',
        quincuncio: 'quinconce',
        semissextil: 'semisestile',
        semiquadratura: 'semiquadratura',
        sesquiquadratura: 'sesquiquadratura',
        harmonico: 'armonico',
        desafiador: 'impegnativo',
        neutro: 'neutro',
      },
      'pt-BR': {},
    }

    const map = aspectMap[language] || {}
    Object.entries(map).forEach(([from, to]) => {
      const re = new RegExp(`\\b${from}\\b`, 'gi')
      text = text.replace(re, to)
    })

    text = text.replace(/\bCasa\s+(\d{1,2})\b/gi, (_m, n) => {
      if (language === 'en-US') return `House ${n}`
      if (language === 'es-ES') return `Casa ${n}`
      if (language === 'it-IT') return `Casa ${n}`
      return `Casa ${n}`
    })

    text = text.replace(/\bPico\b/gi, language === 'en-US' ? 'Peak' : language === 'es-ES' ? 'Pico' : language === 'it-IT' ? 'Picco' : 'Pico')
    text = text.replace(/\bAfastando\b/gi, language === 'en-US' ? 'Moving away' : language === 'es-ES' ? 'Alejandose' : language === 'it-IT' ? 'In allontanamento' : 'Afastando')
    text = text.replace(/\bEm aprox\b/gi, language === 'en-US' ? 'Approaching' : language === 'es-ES' ? 'En aproximacion' : language === 'it-IT' ? 'In avvicinamento' : 'Em aprox')

    text = text.replace(/\bate\b/gi, language === 'en-US' ? 'until' : language === 'es-ES' ? 'hasta' : language === 'it-IT' ? 'fino al' : 'ate')
    text = text.replace(/\btermina hoje\b/gi, language === 'en-US' ? 'ends today' : language === 'es-ES' ? 'termina hoy' : language === 'it-IT' ? 'termina oggi' : 'termina hoje')

    PLANET_KEYS.forEach((planet) => {
      const pt = PLANET_LABELS_PT[planet]
      const translated = translatePlanet(pt, language)
      const rePt = new RegExp(`\\b${pt}\\b`, 'gi')
      const reEn = new RegExp(`\\b${planet}\\b`, 'gi')
      text = text.replace(rePt, translated).replace(reEn, translatePlanet(planet, language))
    })

    return text
  }, [language])

  const localizedTitle = React.useMemo(() => localizeAstroText(title), [title, localizeAstroText])
  const localizedSubtitle = React.useMemo(() => (subtitle ? localizeAstroText(subtitle) : subtitle), [subtitle, localizeAstroText])
  const localizedTimingLabel = React.useMemo(() => (timingLabel ? localizeAstroText(timingLabel) : timingLabel), [timingLabel, localizeAstroText])
  const localizedDirectText = React.useMemo(() => localizeAstroText(directText), [directText, localizeAstroText])
  const localizedFullText = React.useMemo(() => localizeAstroText(fullText), [fullText, localizeAstroText])
  const localizedActionText = React.useMemo(() => (actionText ? localizeAstroText(actionText) : actionText), [actionText, localizeAstroText])
  const localizedMetaText = React.useMemo(() => (metaText ? localizeAstroText(metaText) : metaText), [metaText, localizeAstroText])
  const { width } = useWindowDimensions()
  const isNarrow = width <= 430
  const [showConfidence, setShowConfidence] = React.useState(false)
  const planetKeys = React.useMemo(() => extractPlanetsFromText(`${localizedTitle} ${localizedDirectText}`), [localizedTitle, localizedDirectText])
  const planetKey = planetKeys[0] || resolvePlanetFromText(`${localizedTitle} ${localizedDirectText}`)
  const secondaryPlanetKey = planetKeys.length > 1 ? planetKeys[1] : null
  const imageUri = planetKey ? getPlanetImageUri(planetKey) : null
  const secondaryImageUri = secondaryPlanetKey ? getPlanetImageUri(secondaryPlanetKey) : null
  const aspectSymbol = React.useMemo(() => extractAspectSymbol(localizedTitle), [localizedTitle])
  const keywordChips = React.useMemo(
    () => (Array.isArray(keywords) && keywords.length ? keywords.map((k) => localizeAstroText(k)) : buildDefaultKeywords(localizedTitle, localizedSubtitle, resolvedStatusLabel, localizedTimingLabel)),
    [keywords, localizedTitle, localizedSubtitle, resolvedStatusLabel, localizedTimingLabel, localizeAstroText]
  )
  const resolvedV2 = interpretationV2 || null
  const localizedV2 = React.useMemo(() => {
    if (!resolvedV2) return null
    const mapList = (values: string[]) => values.map((value) => localizeAstroText(value))
    return {
      ...resolvedV2,
      header: localizeAstroText(resolvedV2.header),
      subheader: localizeAstroText(resolvedV2.subheader),
      tldr: localizeAstroText(resolvedV2.tldr),
      medium: localizeAstroText(resolvedV2.medium),
      long: localizeAstroText(resolvedV2.long),
      confidenceWhy: localizeAstroText(resolvedV2.confidenceWhy),
      timeWindow: localizeAstroText(resolvedV2.timeWindow),
      exactness: localizeAstroText(resolvedV2.exactness),
      actionables: mapList(resolvedV2.actionables || []),
      uncertaintyNotes: mapList(resolvedV2.uncertaintyNotes || []),
      callouts: {
        opportunities: mapList(resolvedV2.callouts?.opportunities || []),
        watchOuts: mapList(resolvedV2.callouts?.watchOuts || []),
      },
    }
  }, [resolvedV2, localizeAstroText])

  const bodyText = React.useMemo(() => {
    if (!localizedV2?.long) return ''
    const tldrStart = (localizedV2.tldr || '').slice(0, 45).toLowerCase()
    const paras = localizedV2.long.split(/\n\n+/)
    const filtered = paras.filter(p => p.toLowerCase().slice(0, 45) !== tldrStart)
    return filtered.length > 0 ? filtered.join('\n\n') : localizedV2.long
  }, [localizedV2?.long, localizedV2?.tldr])

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
            {secondaryPlanetKey ? (
              <View style={styles.secondaryPlanetWrap}>
                {aspectSymbol ? <Text style={styles.aspectSymbol}>{aspectSymbol}</Text> : null}
                {secondaryImageUri ? (
                  <Image source={{ uri: secondaryImageUri }} style={styles.secondaryPlanetImage} resizeMode="cover" />
                ) : (
                  <View style={styles.secondaryPlanetFallback}>
                    <Ionicons name={PLANET_FALLBACK_ICON[secondaryPlanetKey] as any} size={13} color="#F8FAFC" />
                  </View>
                )}
              </View>
            ) : null}
            <View style={styles.heroBody}>
              <Text style={[styles.title, isNarrow ? styles.titleNarrow : null]}>{localizedTitle}</Text>
              {localizedSubtitle ? (
                <Text style={[styles.subtitle, isNarrow ? styles.subtitleNarrow : null]}>{localizedSubtitle}</Text>
              ) : (
                <Text style={[styles.subtitle, isNarrow ? styles.subtitleNarrow : null]}>{tr('reading.modal.subtitle', 'Applied reading for the current context')}</Text>
              )}
              <View style={styles.heroMetaRow}>
                <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
                  <Text style={styles.statusText}>{resolvedStatusLabel}</Text>
                </View>
                {localizedTimingLabel ? <Text style={[styles.timing, isNarrow ? styles.timingNarrow : null]}>{localizedTimingLabel}</Text> : null}
              </View>
            </View>
            <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
              <Ionicons name="close" size={18} color="#E2E8F0" />
            </TouchableOpacity>
          </LinearGradient>

          <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
            {keywordChips.length ? (
              <View style={styles.tagsRow}>
                {keywordChips.slice(0, 4).map((keyword) => {
                  const isHouse = /^casa\s+\d/i.test(keyword.trim())
                  return (
                    <View key={keyword} style={[styles.tag, isHouse && styles.tagHouse]}>
                      <Text style={[styles.tagText, isHouse && styles.tagTextHouse]}>{keyword}</Text>
                    </View>
                  )
                })}
              </View>
            ) : null}

            {localizedV2 ? (
              <>
                <Text style={[styles.tldrHeading, isNarrow ? styles.tldrHeadingNarrow : null]}>
                  {localizedV2.tldr}
                </Text>
                <View style={styles.contentDivider} />
                <Text style={[styles.body, isNarrow ? styles.bodyNarrow : null]}>{bodyText}</Text>

                {localizedV2.callouts?.opportunities?.length ? (
                  <View style={styles.sectionCard}>
                    <Text style={[styles.sectionLabelGreen, isNarrow ? styles.sectionLabelNarrow : null]}>{TRANSIT_MODAL_UI_PTBR.opportunities}</Text>
                    {localizedV2.callouts.opportunities.slice(0, 3).map((item) => (
                      <Text key={`opp-${item}`} style={[styles.meta, isNarrow ? styles.metaNarrow : null]}>• {item}</Text>
                    ))}
                  </View>
                ) : null}

                {localizedV2.callouts?.watchOuts?.length ? (
                  <View style={styles.sectionCard}>
                    <Text style={[styles.sectionLabelAmber, isNarrow ? styles.sectionLabelNarrow : null]}>{TRANSIT_MODAL_UI_PTBR.watchOuts}</Text>
                    {localizedV2.callouts.watchOuts.slice(0, 3).map((item) => (
                      <Text key={`watch-${item}`} style={[styles.meta, isNarrow ? styles.metaNarrow : null]}>• {item}</Text>
                    ))}
                  </View>
                ) : null}

                {localizedV2.actionables?.length ? (
                  <View style={styles.sectionCard}>
                    <Text style={[styles.sectionLabelBlue, isNarrow ? styles.sectionLabelNarrow : null]}>{TRANSIT_MODAL_UI_PTBR.actionPlan}</Text>
                    {localizedV2.actionables.slice(0, 3).map((item) => (
                      <Text key={`act-${item}`} style={[styles.meta, isNarrow ? styles.metaNarrow : null]}>• {item}</Text>
                    ))}
                  </View>
                ) : null}

                <TouchableOpacity style={styles.confidenceToggle} onPress={() => setShowConfidence(v => !v)} activeOpacity={0.7}>
                  <Text style={styles.sectionLabelMuted}>{TRANSIT_MODAL_UI_PTBR.confidence}</Text>
                  <Ionicons name={showConfidence ? 'chevron-up' : 'chevron-down'} size={14} color="#94A3B8" />
                </TouchableOpacity>
                {showConfidence ? (
                  <View style={[styles.sectionCard, { marginTop: 0 }]}>
                    <Text style={[styles.meta, isNarrow ? styles.metaNarrow : null]}>
                      {Math.round((localizedV2.confidenceScore || 0) * 100)}% • {localizedV2.confidenceWhy}
                    </Text>
                    <Text style={[styles.meta, isNarrow ? styles.metaNarrow : null]}>
                      {TRANSIT_MODAL_UI_PTBR.timing}: {localizedV2.timeWindow}
                    </Text>
                    <Text style={[styles.meta, isNarrow ? styles.metaNarrow : null]}>
                      Exatidão: {localizedV2.exactness}
                    </Text>
                    {localizedV2.uncertaintyNotes?.map((item) => (
                      <Text key={`unc-${item}`} style={[styles.meta, isNarrow ? styles.metaNarrow : null]}>• {item}</Text>
                    ))}
                  </View>
                ) : null}
              </>
            ) : (
              <>
                <View style={styles.sectionCard}>
                  <Text style={[styles.body, isNarrow ? styles.bodyNarrow : null]}>{localizedFullText}</Text>
                </View>

                {localizedActionText ? (
                  <View style={styles.sectionCard}>
                    <Text style={[styles.sectionLabel, isNarrow ? styles.sectionLabelNarrow : null]}>{tr('reading.modal.practicalUse', 'Practical use')}</Text>
                    <Text style={[styles.body, isNarrow ? styles.bodyNarrow : null]}>{localizedActionText}</Text>
                  </View>
                ) : null}

                {localizedMetaText ? (
                  <View style={styles.sectionCard}>
                    <Text style={[styles.sectionLabel, isNarrow ? styles.sectionLabelNarrow : null]}>{tr('reading.modal.technicalContext', 'Technical context')}</Text>
                    <Text style={[styles.meta, isNarrow ? styles.metaNarrow : null]}>{localizedMetaText}</Text>
                  </View>
                ) : null}
              </>
            )}
          </ScrollView>

          {secondaryActionLabel && onSecondaryAction ? (
            <TouchableOpacity style={styles.secondaryButton} onPress={onSecondaryAction}>
              <Text style={[styles.secondaryButtonText, isNarrow ? styles.secondaryButtonTextNarrow : null]}>
                {secondaryActionLabel}
              </Text>
              <Ionicons name="arrow-down" size={16} color="#E2E8F0" />
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity style={styles.doneButtonOuter} onPress={onClose} activeOpacity={0.85}>
            <LinearGradient
              colors={['#1645D4', '#0A2A8A']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.doneButton}
            >
              <Text style={[styles.doneButtonText, isNarrow ? styles.doneButtonTextNarrow : null]}>{resolvedCloseLabel}</Text>
            </LinearGradient>
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
    ...Platform.select({ web: { backdropFilter: 'blur(8px)' } as any }),
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
    width: 74,
    height: 74,
    borderRadius: 37,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.28)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  heroImage: {
    width: 68,
    height: 68,
    borderRadius: 34,
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
  secondaryPlanetWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  aspectSymbol: {
    color: '#FDE047',
    fontSize: 15,
    fontWeight: '800',
  },
  secondaryPlanetImage: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  secondaryPlanetFallback: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(2,6,23,0.35)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.28)',
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
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '400',
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
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  scroll: {
    backgroundColor: '#132457',
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.25)',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  tag: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#EAB308',
    backgroundColor: 'rgba(234,179,8,0.14)',
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagHouse: {
    borderColor: '#6366F1',
    backgroundColor: 'rgba(99,102,241,0.14)',
  },
  tagText: {
    color: '#FDE047',
    fontSize: 12,
    fontWeight: '700',
  },
  tagTextHouse: {
    color: '#A5B4FC',
  },
  sectionCard: {
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.04)',
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
  },
  tldrHeading: {
    color: '#F8FAFC',
    fontSize: 17,
    fontWeight: '800',
    lineHeight: 26,
    marginBottom: 14,
    paddingHorizontal: 2,
  },
  tldrHeadingNarrow: {
    fontSize: 15,
    lineHeight: 23,
  },
  contentDivider: {
    height: 1,
    backgroundColor: 'rgba(148,163,184,0.18)',
    marginBottom: 16,
  },
  sectionLabel: {
    color: '#FBBF24',
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  sectionLabelGreen: {
    color: '#4ADE80',
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  sectionLabelAmber: {
    color: '#F97316',
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  sectionLabelBlue: {
    color: '#60A5FA',
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  sectionLabelMuted: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  sectionLabelNarrow: {
    fontSize: 11,
  },
  confidenceToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 2,
    marginBottom: 4,
  },
  body: {
    color: '#F8FAFC',
    fontSize: 16,
    lineHeight: 25,
    marginBottom: 16,
  },
  bodyNarrow: {
    fontSize: 14,
    lineHeight: 21,
  },
  meta: {
    color: '#94A3B8',
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 3,
  },
  metaNarrow: {
    fontSize: 12,
    lineHeight: 18,
  },
  doneButtonOuter: {
    marginHorizontal: 12,
    marginTop: 2,
    marginBottom: 12,
    borderRadius: 10,
    overflow: 'hidden',
  },
  doneButton: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  doneButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  doneButtonTextNarrow: {
    fontSize: 15,
  },
  secondaryButton: {
    marginHorizontal: 12,
    marginTop: 8,
    marginBottom: 8,
    height: 42,
    borderRadius: 10,
    backgroundColor: 'rgba(148,163,184,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  secondaryButtonText: {
    color: '#E2E8F0',
    fontSize: 14,
    fontWeight: '700',
  },
  secondaryButtonTextNarrow: {
    fontSize: 13,
  },
})
