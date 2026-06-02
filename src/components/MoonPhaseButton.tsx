import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  PanResponder,
  Pressable,
  Animated,
} from 'react-native'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../config/firebase'
import { useAppLanguage } from '../hooks/useAppLanguage'
import { useUserSettings } from '../hooks/useUserSettings'
import { usePressScale } from '../ui/motion/native/micro'
import MoonPhaseIcon from './MoonPhaseIcon'
import {
  formatLocalDateTime,
  formatLocalTime,
  getMoonPhaseAngle,
  getMoonPhaseKeyFromAngle,
  getMoonPhaseLabelFromAngle,
  getMoonPhaseLabelFromKey,
} from '../utils/moonPhase'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const normalizePhaseLabel = (raw?: string | null) => {
  if (!raw) return ''
  return raw
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

const extractPhaseKey = (event: any) => {
  const raw = [
    event?.phase,
    event?.title,
    event?.name,
    event?.label,
    event?.eventId,
    event?.summary,
  ].filter(Boolean).join(' ')
  const label = normalizePhaseLabel(raw)
  if (label.includes('new') || label.includes('nova')) return 'new'
  if (label.includes('full') || label.includes('cheia')) return 'full'
  if ((label.includes('first') && label.includes('quarter')) || label.includes('quarto crescente')) return 'firstQuarter'
  if ((label.includes('last') && label.includes('quarter')) || label.includes('quarto minguante')) return 'lastQuarter'
  if (label.includes('waxing') && label.includes('crescent')) return 'waxingCrescent'
  if (label.includes('waning') && label.includes('crescent')) return 'waningCrescent'
  if (label.includes('waxing') && label.includes('gibbous')) return 'waxingGibbous'
  if (label.includes('waning') && label.includes('gibbous')) return 'waningGibbous'
  if (label.includes('crescente')) return 'waxingCrescent'
  if (label.includes('minguante')) return 'waningCrescent'
  return 'new'
}

const getUserTimezone = (tz?: string | null) => tz || 'America/Sao_Paulo'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type MoonDetails = {
  phaseLabel: string
  phaseUntilLabel: string
  currentVoidLabel: string
  nextVoidLabel: string
  upcomingPhases: Array<{ label: string; when: string }>
}

interface MoonPhaseButtonProps {
  userReady: boolean
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function MoonPhaseButton({ userReady }: MoonPhaseButtonProps) {
  const { language, t } = useAppLanguage()
  const { settings } = useUserSettings()

  const tr = useCallback(
    (key: string, fallback: string, vars?: Record<string, string | number>) => {
      const value = t(key, vars as any)
      return value === key ? fallback : value
    },
    [t],
  )

  const tl = useCallback(
    (pt: string, en: string, es: string, it: string) => {
      if (language === 'en-US') return en
      if (language === 'es-ES') return es
      if (language === 'it-IT') return it
      return pt
    },
    [language],
  )

  const [moonPhaseKey, setMoonPhaseKey] = useState<string | null>(null)
  const [moonPhaseLabel, setMoonPhaseLabel] = useState<string | null>(null)
  const [moonLine2, setMoonLine2] = useState<string | null>(null)
  const [moonVoidLabel, setMoonVoidLabel] = useState<string | null>(null)
  const [moonVoidLine2, setMoonVoidLine2] = useState<string | null>(null)
  const [moonModalVisible, setMoonModalVisible] = useState(false)
  const [moonDetails, setMoonDetails] = useState<MoonDetails>({
    phaseLabel: tr('profile.moon.defaultLabel', 'Lua'),
    phaseUntilLabel: tr('profile.moon.updatingPhase', 'fase em atualizacao'),
    currentVoidLabel: tr('profile.moon.no', 'Nao'),
    nextVoidLabel: tr('profile.moon.noForecast', 'Sem previsao'),
    upcomingPhases: [],
  })

  const moonTranslateY = useRef(new Animated.Value(0)).current
  const moonPanResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, { dy, dx }) => dy > 10 && Math.abs(dy) > Math.abs(dx),
        onPanResponderMove: (_, { dy }) => {
          if (dy > 0) moonTranslateY.setValue(dy)
        },
        onPanResponderRelease: (_, { dy, vy }) => {
          if (dy > 80 || vy > 1) {
            Animated.timing(moonTranslateY, { toValue: 600, duration: 200, useNativeDriver: true }).start(() => {
              moonTranslateY.setValue(0)
              setMoonModalVisible(false)
            })
          } else {
            Animated.spring(moonTranslateY, { toValue: 0, useNativeDriver: true }).start()
          }
        },
        onPanResponderTerminate: () => {
          Animated.spring(moonTranslateY, { toValue: 0, useNativeDriver: true }).start()
        },
      }),
    [moonTranslateY],
  )

  const moonPress = usePressScale()

  const loadLunarCalendar = useCallback(async () => {
    try {
      const calendarDoc = await getDoc(doc(db, 'settings', 'astro_event_calendar'))
      if (!calendarDoc.exists()) return

      const data = calendarDoc.data()
      const events = Array.isArray(data?.events) ? data.events : []
      const now = new Date()
      const userTz = getUserTimezone(settings?.timezone)

      const toDate = (value: any) => {
        if (!value) return null
        if (typeof value?.toDate === 'function') return value.toDate()
        const parsed = new Date(value)
        return Number.isNaN(parsed.getTime()) ? null : parsed
      }

      let nextExact: Date | null = null
      let currentVoid = false
      let voidEnd: Date | null = null
      let nextVoidStart: Date | null = null
      let nextVoidEnd: Date | null = null
      const upcomingPhases: Array<{ label: string; when: string }> = []

      for (const event of events) {
        const type = String(event?.eventType || '').toUpperCase()
        if (type === 'LUNAR_PHASE') {
          const exact = toDate(event.exactAt) || toDate(event.peakAt) || toDate(event.exact)
          if (exact && exact > now && (!nextExact || exact < nextExact)) {
            nextExact = exact
          }
          if (exact && exact > now && upcomingPhases.length < 4) {
            const phaseEventKey = extractPhaseKey(event)
            upcomingPhases.push({
              label: getMoonPhaseLabelFromKey(phaseEventKey as any, language),
              when: formatLocalDateTime(exact, userTz, language),
            })
          }
        } else if (type.includes('LUNAR_VOID')) {
          const start = toDate(event.startAt) || toDate(event.beginAt) || toDate(event.start)
          const end = toDate(event.endAt) || toDate(event.finishAt) || toDate(event.end)
          if (start && end && now >= start && now <= end) {
            currentVoid = true
            voidEnd = end
          } else if (start && start > now && (!nextVoidStart || start < nextVoidStart)) {
            nextVoidStart = start
            nextVoidEnd = end
          }
        }
      }

      const angle = getMoonPhaseAngle(now)
      const angleKey = getMoonPhaseKeyFromAngle(angle)
      const phaseKey = angle >= 315 ? 'waningCrescent' : angleKey
      let phaseLabel = getMoonPhaseLabelFromAngle(angle, language)
      if (angle >= 315) phaseLabel = tl('Lua Balsâmica', 'Balsamic Moon', 'Luna balsámica', 'Luna balsamica')
      const line1 = phaseLabel
      const line2Base = nextExact
        ? tr('profile.moon.until', 'até {date}', { date: formatLocalDateTime(nextExact, userTz, language) })
        : tr('profile.moon.updatingPhase', 'phase updating')
      const line2 = line2Base
      const voidLine1 = currentVoid ? tl('Lua Vazia', 'Void Moon', 'Luna vacía', 'Luna vuota') : null
      const voidLine2 = currentVoid && voidEnd
        ? `${tl('até', 'until', 'hasta', 'fino a')} ${formatLocalTime(voidEnd, userTz, language)}`
        : null

      setMoonPhaseKey(phaseKey)
      setMoonPhaseLabel(line1)
      setMoonLine2(line2)
      setMoonVoidLabel(voidLine1)
      setMoonVoidLine2(voidLine2)
      setMoonDetails({
        phaseLabel,
        phaseUntilLabel: line2Base,
        currentVoidLabel: currentVoid && voidEnd
          ? `${tl('Sim, até', 'Yes, until', 'Sí, hasta', 'Sì, fino a')} ${formatLocalTime(voidEnd, userTz, language)}`
          : tl('Não', 'No', 'No', 'No'),
        nextVoidLabel: nextVoidStart
          ? `${formatLocalDateTime(nextVoidStart, userTz, language)}${nextVoidEnd ? ` ${tl('até', 'until', 'hasta', 'fino a')} ${formatLocalTime(nextVoidEnd, userTz, language)}` : ''}`
          : tr('profile.moon.noForecast', 'No forecast'),
        upcomingPhases,
      })
    } catch (error) {
      console.error('Erro ao carregar fases da lua:', error)
    }
  }, [settings?.timezone, language, tr, tl])

  useEffect(() => {
    if (userReady) loadLunarCalendar()
  }, [userReady, language, settings?.timezone])

  return (
    <>
      <Animated.View style={moonPress.style}>
        <TouchableOpacity
          style={styles.notificationButton}
          delayPressIn={0}
          onPressIn={moonPress.onPressIn}
          onPressOut={moonPress.onPressOut}
          onPress={() => setMoonModalVisible(true)}
        >
          <View style={styles.moonIconWrap}>
            <MoonPhaseIcon phaseKey={moonPhaseKey as any} size={36} />
          </View>
          <View style={styles.moonLegend}>
            <Text style={styles.moonLegendLine1} numberOfLines={1}>
              {moonPhaseLabel || tr('profile.moon.defaultLabel', 'Lua')}
            </Text>
            <Text style={styles.moonLegendLine2} numberOfLines={1}>
              {moonLine2 || tr('profile.moon.updatingPhase', 'phase updating')}
            </Text>
            {moonVoidLabel ? (
              <Text style={styles.moonLegendLine1} numberOfLines={1}>
                {moonVoidLabel}
              </Text>
            ) : null}
            {moonVoidLine2 ? (
              <Text style={styles.moonLegendLine2} numberOfLines={1}>
                {moonVoidLine2}
              </Text>
            ) : null}
          </View>
        </TouchableOpacity>
      </Animated.View>

      <Modal
        visible={moonModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMoonModalVisible(false)}
      >
        <View style={styles.moonModalBackdrop}>
          {/* Backdrop separado do card — evita que TouchableOpacity pai roube o toque do PanResponder filho */}
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setMoonModalVisible(false)} />
          <Animated.View
            style={[styles.moonModalCard, { transform: [{ translateY: moonTranslateY }] }]}
            {...moonPanResponder.panHandlers}
          >
            <Text style={styles.moonModalTitle}>{tr('profile.moon.modal.title', 'Lunar Calendar')}</Text>
            <ScrollView style={styles.moonModalScroll} showsVerticalScrollIndicator={false}>
              <Text style={styles.moonModalSectionTitle}>{tr('profile.moon.modal.now', 'Moon now')}</Text>
              <Text style={styles.moonModalText}>{moonDetails.phaseLabel}</Text>
              <Text style={styles.moonModalText}>{moonDetails.phaseUntilLabel}</Text>

              <Text style={styles.moonModalSectionTitle}>{tr('profile.moon.modal.void', 'Void Moon')}</Text>
              <Text style={styles.moonModalText}>{tr('profile.moon.modal.current', 'Current')}: {moonDetails.currentVoidLabel}</Text>
              <Text style={styles.moonModalText}>{tr('profile.moon.modal.next', 'Next')}: {moonDetails.nextVoidLabel}</Text>

              <Text style={styles.moonModalSectionTitle}>{tr('profile.moon.modal.upcoming', 'Upcoming phases')}</Text>
              {moonDetails.upcomingPhases.length ? (
                moonDetails.upcomingPhases.map((item) => (
                  <View key={`${item.label}-${item.when}`} style={styles.moonModalItem}>
                    <Text style={styles.moonModalItemLabel}>{item.label}</Text>
                    <Text style={styles.moonModalItemWhen}>{item.when}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.moonModalText}>{tr('profile.moon.modal.noUpcoming', 'No upcoming events in calendar.')}</Text>
              )}
            </ScrollView>
            <TouchableOpacity
              style={styles.moonModalCloseButton}
              onPress={() => setMoonModalVisible(false)}
            >
              <Text style={styles.moonModalCloseText}>{tr('common.close', 'Close')}</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  notificationButton: {
    position: 'relative',
    padding: 8,
    alignItems: 'flex-end',
  },
  moonIconWrap: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  moonLegend: {
    marginTop: 6,
    alignItems: 'flex-end',
    maxWidth: 140,
  },
  moonLegendLine1: {
    fontSize: 13,
    fontWeight: '600',
    color: '#E6E6E6',
    lineHeight: 18,
  },
  moonLegendLine2: {
    fontSize: 12,
    fontWeight: '400',
    color: '#A0A0A0',
    lineHeight: 16,
  },
  moonModalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  moonModalCard: {
    width: '100%',
    maxWidth: 420,
    maxHeight: '80%',
    backgroundColor: '#15152D',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.25)',
    padding: 16,
  },
  moonModalTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  moonModalScroll: {
    marginBottom: 12,
  },
  moonModalSectionTitle: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 10,
    marginBottom: 6,
  },
  moonModalText: {
    color: '#E6E6E6',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  moonModalItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
  },
  moonModalItemLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  moonModalItemWhen: {
    color: '#B8B8B8',
    fontSize: 13,
    marginTop: 2,
  },
  moonModalCloseButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#FFD700',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  moonModalCloseText: {
    color: '#1A1A1A',
    fontSize: 13,
    fontWeight: '700',
  },
})
