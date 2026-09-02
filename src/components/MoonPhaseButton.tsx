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
import { useAuth } from '../hooks/useAuth'
import Svg, { Circle } from 'react-native-svg'
import { LUNAR_HOUSE_AREA } from '../data/lunarReturnHouseArea'
import { usePressScale } from '../ui/motion/native/micro'
import MoonPhaseIcon from './MoonPhaseIcon'
import {
  formatLocalDateTime,
  formatLocalTime,
  getMoonEclipticLongitude,
  getMoonPhaseAngle,
  getMoonPhaseKeyFromAngle,
  getMoonPhaseLabelFromAngle,
  getMoonPhaseLabelFromKey,
} from '../utils/moonPhase'
import { nakshatraFromTropical } from '../astro/vedic'
import { kinOfDate, getKinDisplayName, sealOf, SEALS, COLOR_LABELS, todayISO } from '../astro/tzolkin'
import { thirteenMoonDate } from '../astro/tzolkin/thirteenMoon'
import { moonName, plasmaName, moonQuestion } from '../data/tzolkin/thirteenMoonText'
import TzolkinProfileContent from '../screens/cosmos/TzolkinProfileContent'
import { SEAL_SVG } from '../assets/tzolkin/sealGlyphs'
import { SvgCss } from 'react-native-svg/css'

const TZOLKIN_ENABLED = process.env.EXPO_PUBLIC_TZOLKIN_ENABLED !== '0'
import { MOON_SIGN_MOOD, MOON_SIGN_GLYPH, SIGN_NAMES_I18N, SIGN_KEYS } from '../data/moonSignMood'

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
  moonNakshatra: string
  currentVoidLabel: string
  nextVoidLabel: string
  upcomingPhases: Array<{ label: string; when: string }>
  moonSignName: string
  moonSignGlyph: string
  moonSignIdx: number
  moonDeg: number
  illumPct: number
  moonMood: string
}

interface MoonPhaseButtonProps {
  userReady: boolean
  /** Glyph do signo em que a Lua está agora — exibido ao lado da figura da lua. */
  signGlyph?: string | null
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function MoonPhaseButton({ userReady, signGlyph }: MoonPhaseButtonProps) {
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
  const [moonTab, setMoonTab] = useState<'lua' | 'tzolkin'>('lua')
  const dayKin = useMemo(() => kinOfDate(todayISO()), [])
  const dayKinXml = SEAL_SVG[sealOf(dayKin)]
  const [moonDetails, setMoonDetails] = useState<MoonDetails>({
    phaseLabel: tr('profile.moon.defaultLabel', 'Lua'),
    phaseUntilLabel: tr('profile.moon.updatingPhase', 'fase em atualizacao'),
    moonNakshatra: '',
    currentVoidLabel: tr('profile.moon.no', 'Nao'),
    nextVoidLabel: tr('profile.moon.noForecast', 'Sem previsao'),
    upcomingPhases: [],
    moonSignName: '',
    moonSignGlyph: '☾',
    moonSignIdx: -1,
    moonDeg: 0,
    illumPct: 0,
    moonMood: '',
  })
  const [natalAscDeg, setNatalAscDeg] = useState<number | null>(null)
  const { user } = useAuth() as any
  useEffect(() => {
    if (!user?.uid) return
    getDoc(doc(db, 'users', user.uid)).then((snap) => {
      const v = snap.data()?.natalAscDeg
      if (typeof v === 'number') setNatalAscDeg(v)
    }).catch(() => {})
  }, [user?.uid])

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
      const moonLon = getMoonEclipticLongitude(now)
      const moonNakshatra = nakshatraFromTropical(moonLon, now).nakshatra.name
      // Signo atual da Lua + grau + iluminação (%) + clima emocional.
      const normLon = ((moonLon % 360) + 360) % 360
      const signIdx = Math.floor(normLon / 30) % 12
      const langKey = language === 'en-US' ? 'en-US' : language === 'es-ES' ? 'es-ES' : language === 'it-IT' ? 'it-IT' : 'pt-BR'
      const moonSignName = (SIGN_NAMES_I18N[langKey] || SIGN_NAMES_I18N['pt-BR'])[signIdx]
      const signKey = SIGN_KEYS[signIdx]
      const moonSignGlyph = MOON_SIGN_GLYPH[signKey] || '☾'
      const moonDeg = normLon % 30
      const illumPct = Math.round((1 - Math.cos((angle * Math.PI) / 180)) / 2 * 100)
      const moonMood = (MOON_SIGN_MOOD[langKey] || MOON_SIGN_MOOD['pt-BR'])[signKey] || ''
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
        moonNakshatra,
        currentVoidLabel: currentVoid && voidEnd
          ? `${tl('Sim, até', 'Yes, until', 'Sí, hasta', 'Sì, fino a')} ${formatLocalTime(voidEnd, userTz, language)}`
          : tl('Não', 'No', 'No', 'No'),
        nextVoidLabel: nextVoidStart
          ? `${formatLocalDateTime(nextVoidStart, userTz, language)}${nextVoidEnd ? ` ${tl('até', 'until', 'hasta', 'fino a')} ${formatLocalTime(nextVoidEnd, userTz, language)}` : ''}`
          : tr('profile.moon.noForecast', 'No forecast'),
        upcomingPhases,
        moonSignName,
        moonSignGlyph,
        moonSignIdx: signIdx,
        moonDeg,
        illumPct,
        moonMood,
      })
    } catch (error) {
      console.error('Erro ao carregar fases da lua:', error)
    }
  }, [settings?.timezone, language, tr, tl])

  useEffect(() => {
    if (userReady) loadLunarCalendar()
  }, [userReady, language, settings?.timezone])

  // Casa natal por onde a Lua passa agora (whole-sign a partir do Ascendente).
  const langKeyR = language === 'en-US' ? 'en-US' : language === 'es-ES' ? 'es-ES' : language === 'it-IT' ? 'it-IT' : 'pt-BR'
  const moonNatalHouse = (moonDetails.moonSignIdx >= 0 && natalAscDeg != null)
    ? ((moonDetails.moonSignIdx - Math.floor(natalAscDeg / 30) + 12) % 12) + 1
    : null
  const moonHouseArea = moonNatalHouse ? (LUNAR_HOUSE_AREA[langKeyR] || LUNAR_HOUSE_AREA['pt-BR'])[moonNatalHouse]?.area : null
  // Geometria do anel de iluminação (SVG).
  const RING = 34, RSTROKE = 5, RRAD = RING - RSTROKE, RCIRC = 2 * Math.PI * RRAD
  const illumDash = RCIRC * Math.max(0, Math.min(1, moonDetails.illumPct / 100))

  return (
    <>
      <Animated.View style={moonPress.style}>
        <TouchableOpacity
          style={styles.notificationButton}
          delayPressIn={0}
          onPressIn={moonPress.onPressIn}
          onPressOut={moonPress.onPressOut}
          onPress={() => { setMoonTab('lua'); setMoonModalVisible(true) }}
        >
          <View style={styles.moonIconRow}>
            {TZOLKIN_ENABLED && dayKinXml ? (
              <TouchableOpacity onPress={() => { setMoonTab('tzolkin'); setMoonModalVisible(true) }} style={styles.dayKinGlyph} activeOpacity={0.7}>
                <SvgCss xml={dayKinXml} width="100%" height="100%" />
              </TouchableOpacity>
            ) : null}
            {signGlyph ? <Text style={styles.moonSignGlyph}>{signGlyph}</Text> : null}
            <View style={styles.moonIconWrap}>
              <MoonPhaseIcon phaseKey={moonPhaseKey as any} size={36} />
            </View>
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
            {TZOLKIN_ENABLED ? (
              <View style={styles.moonTabs}>
                <TouchableOpacity style={[styles.moonTabBtn, moonTab === 'lua' && styles.moonTabBtnActive]} activeOpacity={0.85} onPress={() => setMoonTab('lua')}><Text style={[styles.moonTabTx, moonTab === 'lua' && styles.moonTabTxActive]}>{tl('Lua', 'Moon', 'Luna', 'Luna')}</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.moonTabBtn, moonTab === 'tzolkin' && styles.moonTabBtnActive]} activeOpacity={0.85} onPress={() => setMoonTab('tzolkin')}><Text style={[styles.moonTabTx, moonTab === 'tzolkin' && styles.moonTabTxActive]}>Tzolkin</Text></TouchableOpacity>
              </View>
            ) : null}
            {moonTab === 'tzolkin' ? (
              <View style={{ flex: 1, minHeight: 420 }}>
                <TzolkinProfileContent birthDateISO={todayISO()} />
              </View>
            ) : (
            <ScrollView style={styles.moonModalScroll} showsVerticalScrollIndicator={false}>
              {/* Hero: fase + signo atual da Lua + iluminação */}
              <View style={styles.moonHero}>
                <View style={styles.moonHeroIcon}>
                  <MoonPhaseIcon phaseKey={moonPhaseKey as any} size={58} />
                </View>
                <View style={styles.moonHeroText}>
                  <Text style={styles.moonHeroPhase} numberOfLines={1}>{moonDetails.phaseLabel}</Text>
                  {moonDetails.moonSignName ? (
                    <View style={styles.moonSignRow}>
                      <Text style={styles.moonSignGlyphBig}>{moonDetails.moonSignGlyph}</Text>
                      <Text style={styles.moonSignName}>
                        {tl('Lua em', 'Moon in', 'Luna en', 'Luna in')} {moonDetails.moonSignName}
                      </Text>
                      <Text style={styles.moonSignDeg}>{moonDetails.moonDeg.toFixed(0)}°</Text>
                    </View>
                  ) : null}
                  <Text style={styles.moonHeroUntil} numberOfLines={1}>{moonDetails.phaseUntilLabel}</Text>
                </View>
              </View>

              {/* Anel de iluminação + casa natal da Lua */}
              <View style={styles.illumRing}>
                <View style={styles.ringWrap}>
                  <Svg width={RING * 2} height={RING * 2}>
                    <Circle cx={RING} cy={RING} r={RRAD} stroke="rgba(255,255,255,0.10)" strokeWidth={RSTROKE} fill="none" />
                    <Circle
                      cx={RING} cy={RING} r={RRAD} stroke="#FFD700" strokeWidth={RSTROKE} fill="none"
                      strokeLinecap="round" strokeDasharray={`${illumDash} ${RCIRC}`}
                      transform={`rotate(-90 ${RING} ${RING})`}
                    />
                  </Svg>
                  <View style={styles.ringCenter}>
                    <Text style={styles.ringPct}>{moonDetails.illumPct}%</Text>
                  </View>
                </View>
                <View style={styles.illumInfo}>
                  <Text style={styles.illumTitle}>{tl('Iluminação', 'Illumination', 'Iluminación', 'Illuminazione')}</Text>
                  {moonNatalHouse ? (
                    <Text style={styles.moonHouseText}>
                      {tl('A Lua passa pela sua', 'The Moon is passing through your', 'La Luna pasa por tu', 'La Luna passa per la tua')}{' '}
                      <Text style={styles.moonHouseStrong}>{tl('Casa', 'House', 'Casa', 'Casa')} {moonNatalHouse}</Text>
                      {moonHouseArea ? ` · ${moonHouseArea}` : ''}
                    </Text>
                  ) : (
                    <Text style={styles.illumSub}>{tl('do disco lunar visível agora', 'of the lunar disc visible now', 'del disco lunar visible ahora', 'del disco lunare visibile ora')}</Text>
                  )}
                </View>
              </View>

              {/* Clima emocional da Lua no signo */}
              {moonDetails.moonMood ? (
                <View style={styles.moodCard}>
                  <Text style={styles.moodTitle}>{tl('Clima emocional', 'Emotional climate', 'Clima emocional', 'Clima emotivo')}</Text>
                  <Text style={styles.moodText}>{moonDetails.moonMood}</Text>
                </View>
              ) : null}

              {moonDetails.moonNakshatra ? (
                <Text style={styles.moonNakshatra}>
                  {tl('Nakshatra (védico)', 'Nakshatra (Vedic)', 'Nakshatra (védico)', 'Nakshatra (vedico)')}: {moonDetails.moonNakshatra}
                </Text>
              ) : null}

              {TZOLKIN_ENABLED ? (() => {
                const todayKin = kinOfDate(todayISO())
                const kinHex = COLOR_LABELS[SEALS[sealOf(todayKin) - 1].color].hex
                return (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 }}>
                    <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: kinHex, alignItems: 'center', justifyContent: 'center' }}>
                      <Text style={{ color: '#0F0F23', fontSize: 10, fontWeight: '900' }}>{sealOf(todayKin)}</Text>
                    </View>
                    <Text style={styles.moonNakshatra}>
                      {tl('Kin de hoje', 'Kin of the day', 'Kin de hoy', 'Kin di oggi')}: {todayKin} — {getKinDisplayName(todayKin, language)}
                    </Text>
                  </View>
                )
              })() : null}

              {TZOLKIN_ENABLED ? (() => {
                const tm = thirteenMoonDate(todayISO())
                if (tm.isDayOutOfTime) return (
                  <Text style={[styles.moonNakshatra, { marginTop: 6 }]}>{tl('Hoje é o Dia Fora do Tempo (25/07) — 0.0 Hunab Ku.', 'Today is the Day out of Time (Jul 25) — 0.0 Hunab Ku.', 'Hoy es el Dia Fuera del Tiempo (25/07) — 0.0 Hunab Ku.', 'Oggi e il Giorno Fuori dal Tempo (25/07) — 0.0 Hunab Ku.')}</Text>
                )
                return (
                  <View style={{ marginTop: 6 }}>
                    <Text style={styles.moonNakshatra}>
                      {tl('Sincronário', 'Synchronometer', 'Sincronario', 'Sincronario')}: {moonName(tm.moon, language)} · {tl('dia', 'day', 'dia', 'giorno')} {tm.dayOfMoon}/28 · {plasmaName(tm.plasma)}
                    </Text>
                    <Text style={[styles.moonNakshatra, { color: '#8b7cf6', fontStyle: 'italic', marginTop: 2 }]}>“{moonQuestion(tm.moon, language)}”</Text>
                  </View>
                )
              })() : null}

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
            )}
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
  moonIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  moonSignGlyph: {
    fontSize: 20,
    color: '#FFD700',
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
  dayKinGlyph: { width: 22, height: 22, marginHorizontal: 4 },
  moonTabs: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  moonTabBtn: { flex: 1, paddingVertical: 8, borderRadius: 10, backgroundColor: 'rgba(255,255,255,.06)', alignItems: 'center' },
  moonTabBtnActive: { backgroundColor: 'rgba(245,197,66,.18)', borderWidth: 1, borderColor: '#f5c542' },
  moonTabTx: { color: '#a7a2c9', fontSize: 12.5, fontWeight: '700' },
  moonTabTxActive: { color: '#f5c542' },
  moonHero: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: 'rgba(255,215,0,0.06)', borderWidth: 1, borderColor: 'rgba(255,215,0,0.22)',
    borderRadius: 16, padding: 14, marginBottom: 12,
  },
  moonHeroIcon: { width: 62, height: 62, alignItems: 'center', justifyContent: 'center' },
  moonHeroText: { flex: 1, minWidth: 0 },
  moonHeroPhase: { color: '#FFFFFF', fontSize: 17, fontWeight: '800' },
  moonSignRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 3 },
  moonSignGlyphBig: { color: '#FFD700', fontSize: 18, fontWeight: '700' },
  moonSignName: { color: '#E9D9A0', fontSize: 14, fontWeight: '700' },
  moonSignDeg: { color: '#9A9CB8', fontSize: 12, fontVariant: ['tabular-nums'] },
  moonHeroUntil: { color: '#9A9CB8', fontSize: 12, marginTop: 4 },
  illumRing: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 14 },
  ringWrap: { width: 68, height: 68, alignItems: 'center', justifyContent: 'center' },
  ringCenter: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
  ringPct: { color: '#FFD700', fontSize: 15, fontWeight: '800', fontVariant: ['tabular-nums'] },
  illumInfo: { flex: 1, minWidth: 0 },
  illumTitle: { color: '#9A9CB8', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', fontWeight: '700', marginBottom: 4 },
  illumSub: { color: '#9A9CB8', fontSize: 12.5, lineHeight: 17 },
  moonHouseText: { color: '#E6E6E6', fontSize: 13.5, lineHeight: 19 },
  moonHouseStrong: { color: '#FFD700', fontWeight: '800' },
  moodCard: {
    backgroundColor: 'rgba(124,138,192,0.10)', borderWidth: 1, borderColor: 'rgba(124,138,192,0.26)',
    borderRadius: 14, padding: 13, marginBottom: 12,
  },
  moodTitle: { color: '#B9C0E6', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', fontWeight: '700', marginBottom: 5 },
  moodText: { color: '#E6E6E6', fontSize: 13.5, lineHeight: 19 },
  moonNakshatra: { color: '#8A8AA0', fontSize: 12, marginBottom: 6 },
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
