import React, { useEffect, useState, useRef } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Image,
  Modal,
  Platform,
  useWindowDimensions,
  PanResponder,
  Pressable,
  ActivityIndicator,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Animated } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { useAuth } from '../../hooks/useAuth'
import { useLifeAreas } from '../../hooks/useLifeAreas'
import { useAppLanguage } from '../../hooks/useAppLanguage'
import LifeAreaCard from '../../components/LifeAreaCard'
import { STATUS_THRESHOLDS } from '../../constants/statusThresholds'
import { LIFE_AREA_ORDER } from '../../constants/lifeAreas'
import { useUserSettings } from '../../hooks/useUserSettings'
import { LifeAreaDetailModal } from '../../components/LifeAreaDetailModal'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../config/firebase'
import PWADownloadButton from '../../components/PWADownloadButton'
import { AnimatedMount } from '../../ui/anim/adapter'
import StarLoader from '../../components/StarLoader'
import useAutoScheduleNotifications from '../../hooks/useAutoScheduleNotifications'
import type { HouseSystem } from '../../astro/houseSystem'
import { normalizeHouseSystem } from '../../astro/houseSystem'
import { usePressScale } from '../../ui/motion/native/micro'
import TransitComparisonCard from '../../components/TransitComparisonCard'
import { decodeUnicodeEscapes } from '../../utils/astro/pt'
import { useNotificationStore } from '../../context/NotificationStore'
import MoonPhaseIcon from '../../components/MoonPhaseIcon'
import { getPlanetImageUri, type PlanetKey } from '../../config/planetImageSource'
import {
  formatLocalDateTime,
  formatLocalTime,
  getMoonPhaseAngle,
  getMoonPhaseKeyFromAngle,
  getMoonPhaseLabelFromAngle,
  getMoonPhaseLabelFromKey
} from '../../utils/moonPhase'
import { getAreaTransitCount } from '../../utils/transitsByArea'
import { normalizeAxisScore } from '../../utils/statusAxes'
// Web-only effects (no-op on native)
let mountStarfield: any = null
try { const mod = require('../../ui/motion/web/starfield'); mountStarfield = mod.mountStarfield } catch { }

const normalizePhaseLabel = (raw?: string | null) => {
  if (!raw) return ""
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
  ].filter(Boolean).join(" ")
  const label = normalizePhaseLabel(raw)
  if (label.includes("new") || label.includes("nova")) return "new"
  if (label.includes("full") || label.includes("cheia")) return "full"
  if ((label.includes("first") && label.includes("quarter")) || label.includes("quarto crescente")) return "firstQuarter"
  if ((label.includes("last") && label.includes("quarter")) || label.includes("quarto minguante")) return "lastQuarter"
  if (label.includes("waxing") && label.includes("crescent")) return "waxingCrescent"
  if (label.includes("waning") && label.includes("crescent")) return "waningCrescent"
  if (label.includes("waxing") && label.includes("gibbous")) return "waxingGibbous"
  if (label.includes("waning") && label.includes("gibbous")) return "waningGibbous"
  if (label.includes("crescente")) return "waxingCrescent"
  if (label.includes("minguante")) return "waningCrescent"
  return "new"
}

const getUserTimezone = (tz?: string | null) => tz || 'America/Sao_Paulo'

const PLANET_ORDER: PlanetKey[] = [
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

const PLANETS_WITH_LIGHT_BG_IMAGES = new Set(['Mars', 'Jupiter', 'Saturn', 'Pluto'])
const PLANET_FALLBACK_GLYPHS: Record<PlanetKey, string> = {
  Sun: 'â˜‰',
  Moon: 'â˜½',
  Mercury: 'â˜¿',
  Venus: 'â™€',
  Mars: 'â™‚',
  Jupiter: 'â™ƒ',
  Saturn: 'â™„',
  Uranus: 'â™…',
  Neptune: 'â™†',
  Pluto: 'â™‡',
}

type MoonDetails = {
  phaseLabel: string
  phaseUntilLabel: string
  currentVoidLabel: string
  nextVoidLabel: string
  upcomingPhases: Array<{ label: string; when: string }>
}

const AREA_ITEM_STYLE = { width: '50%' as const }

const AreaCardItem = React.memo(function AreaCardItem({
  name,
  area,
  factors,
  transitCount,
  onPress,
}: {
  name: string
  area: any
  factors: string[] | undefined
  transitCount: number
  onPress: (name: string, area: any) => void
}) {
  const press = React.useCallback(() => onPress(name, area), [name, area, onPress])
  return (
    <View style={AREA_ITEM_STYLE}>
      <LifeAreaCard area={area} onPress={press} calculationFactors={factors} transitCount={transitCount} />
    </View>
  )
})

export default function HomeScreen() {
  useAutoScheduleNotifications()
  const { language, t } = useAppLanguage()
  const tr = React.useCallback((key: string, fallback: string, vars?: Record<string, string | number>) => {
    const value = t(key, vars as any)
    return value === key ? fallback : value
  }, [t])
  const tl = React.useCallback((pt: string, en: string, es: string, it: string) => {
    if (language === 'en-US') return en
    if (language === 'es-ES') return es
    if (language === 'it-IT') return it
    return pt
  }, [language])
  const { user } = useAuth()
  const navigation = useNavigation()
  const { unreadCount } = useNotificationStore()
  const {
    transitData,
    loading,
    error,
    refreshData,
    backendLifeAreas,
    backendCurrentTransits,
    localOverrideActive
  } = useLifeAreas()
  const { settings } = useUserSettings()
  const [houseSystem, setHouseSystem] = useState<HouseSystem>(normalizeHouseSystem(settings?.houseSystem || 'whole-sign'))
  const previousHouseSystemRef = useRef<HouseSystem | null>(null)
  const [moonPhaseKey, setMoonPhaseKey] = useState<string | null>(null)
  const [moonPhaseLabel, setMoonPhaseLabel] = useState<string | null>(null)
  const [moonLine2, setMoonLine2] = useState<string | null>(null)
  const [moonVoidLabel, setMoonVoidLabel] = useState<string | null>(null)
  const [moonVoidLine2, setMoonVoidLine2] = useState<string | null>(null)
  const [moonModalVisible, setMoonModalVisible] = useState(false)
  const moonTranslateY = React.useRef(new Animated.Value(0)).current
  const moonPanResponder = React.useMemo(
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
    [moonTranslateY]
  )
  const [moonDetails, setMoonDetails] = useState<MoonDetails>({
    phaseLabel: tr('profile.moon.defaultLabel', 'Lua'),
    phaseUntilLabel: tr('profile.moon.updatingPhase', 'fase em atualizacao'),
    currentVoidLabel: tr('profile.moon.no', 'Nao'),
    nextVoidLabel: tr('profile.moon.noForecast', 'Sem previsao'),
    upcomingPhases: [],
  })
  const moonPress = usePressScale()

  // Garantir que o motor use o sistema salvo ao entrar na Home
  useEffect(() => {
    const normalized = normalizeHouseSystem(settings?.houseSystem || 'whole-sign')
    setHouseSystem(normalized)
      ; (globalThis as any).__userHouseSystem = normalized
    if (previousHouseSystemRef.current && previousHouseSystemRef.current !== normalized) {
      refreshData(true)
    }
    previousHouseSystemRef.current = normalized
  }, [settings?.houseSystem, refreshData])

  const [refreshing, setRefreshing] = useState(false)
  const [selectedArea, setSelectedArea] = useState<any>(null)
  const [modalVisible, setModalVisible] = useState(false)
  const scrollRef = useRef<ScrollView>(null)
  const { width } = useWindowDimensions()
  const showDesktopScrollbar = Platform.OS === 'web' && width >= 1024
  const [failedPlanetImages, setFailedPlanetImages] = useState<Record<string, boolean>>({})
  const uiText = React.useCallback((text: string) => decodeUnicodeEscapes(text), [])

  const planetQuickNav = React.useMemo(() => {
    return PLANET_ORDER.map((planet) => {
      return {
        planet,
        imageUri: getPlanetImageUri(planet),
      }
    })
  }, [])

  const scrollToPlanetInTabula = React.useCallback((planet: PlanetKey) => {
    try {
      if (Platform.OS !== 'web' || typeof document === 'undefined') return
      const element = document.getElementById(`tabula-planet-${planet}`)
      if (!element) return
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setTimeout(() => {
        try { element.scrollIntoView({ behavior: 'smooth', block: 'start' }) } catch { }
      }, 180)
    } catch { }
  }, [])

  // ?? Fun\u00E7\u00E3o para abrir modal de detalhes
  const handleAreaPress = React.useCallback((areaName: string, areaData: any) => {
    setSelectedArea({
      name: areaName,
      ...areaData
    })
    setModalVisible(true)
  }, [])


  const getLifeAreaFactors = React.useCallback((areaName: string): string[] => {
    const debugArea = transitData?.currentTransits?.debug?.lifeAreas?.[areaName]
    const planetDetails = debugArea?.planetDetails || []
    if (!planetDetails.length) return []
    const avg = (values: number[]) =>
      Math.round(values.reduce((sum, val) => sum + val, 0) / Math.max(1, values.length))
    const avgSign = avg(planetDetails.map((p: any) => Number(p.signScore || 0)))
    const avgHouse = avg(planetDetails.map((p: any) => Number(p.houseScore || 0)))
    const tags = Array.from(
      new Set(
        planetDetails
          .flatMap((p: any) => (p.conditions?.tags || []))
          .map((tag: string) => String(tag || '').trim())
          .filter((tag: string) => tag.length > 0)
      )
    )
    const aspectsCount = planetDetails.reduce((sum: number, p: any) => {
      const count = Array.isArray(p.aspects) ? p.aspects.length : 0
      return sum + count
    }, 0)
    return [
      tl(
        `Dignidade no signo: media ${avgSign} (forca essencial do planeta).`,
        `Sign dignity: average ${avgSign} (planet essential strength).`,
        `Dignidad en el signo: media ${avgSign} (fuerza esencial del planeta).`,
        `Dignità nel segno: media ${avgSign} (forza essenziale del pianeta).`
      ),
      tl(
        `Casa astrologica: media ${avgHouse} (relevancia da casa).`,
        `Astrological house: average ${avgHouse} (house relevance).`,
        `Casa astrológica: media ${avgHouse} (relevancia de la casa).`,
        `Casa astrologica: media ${avgHouse} (rilevanza della casa).`
      ),
      tl(
        `Condicoes acidentais: ${tags.length ? tags.join(', ') : 'nenhuma destacada'}.`,
        `Accidental conditions: ${tags.length ? tags.join(', ') : 'none highlighted'}.`,
        `Condiciones accidentales: ${tags.length ? tags.join(', ') : 'ninguna destacada'}.`,
        `Condizioni accidentali: ${tags.length ? tags.join(', ') : 'nessuna evidenziata'}.`
      ),
      tl(
        `Aspectos considerados: ${aspectsCount} (harmonicos e desafiadores).`,
        `Considered aspects: ${aspectsCount} (harmonic and challenging).`,
        `Aspectos considerados: ${aspectsCount} (armónicos y desafiantes).`,
        `Aspetti considerati: ${aspectsCount} (armonici e impegnativi).`
      ),
      tl(
        'Peso planetario: luminares/sociais/transpessoais ajustam a influencia.',
        'Planetary weighting: luminaries/social/transpersonal adjust influence.',
        'Peso planetario: luminares/sociales/transpersonales ajustan la influencia.',
        'Peso planetario: luminari/sociali/transpersonali regolano l influenza.'
      )
    ]
  }, [transitData?.currentTransits?.debug?.lifeAreas, tl])

  const allLifeAreaFactors = React.useMemo<Record<string, string[]>>(() => {
    const result: Record<string, string[]> = {}
    for (const name of LIFE_AREA_ORDER) {
      result[name] = getLifeAreaFactors(name)
    }
    return result
  }, [getLifeAreaFactors])

  const [userProfile, setUserProfile] = useState<{
    displayName: string
    profilePhoto?: string
  } | null>(null)

  useEffect(() => {
    if (user) {
      loadUserProfile()
      loadLunarCalendar()
      initializeNotifications()
    }
  }, [user, language, settings?.timezone])

  // Toast simples ao reprocessar casas natais
  useEffect(() => {
    const handler = () => {
      try {
        Alert.alert(
          tl('Sucesso', 'Success', 'Éxito', 'Successo'),
          tl('Casas recalculadas com sucesso!', 'Houses recalculated successfully!', '¡Casas recalculadas con éxito!', 'Case ricalcolate con successo!')
        )
        refreshData(true)
      } catch { }
    }
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.addEventListener('natal-houses-reprocessed', handler as any)
      return () => window.removeEventListener('natal-houses-reprocessed', handler as any)
    }
  }, [])

  // Recalcular quando sistema de casas for alterado via toggle global
  useEffect(() => {
    const onSysChanged = () => {
      try { refreshData(true) } catch { }
    }
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.addEventListener('house-system-changed', onSysChanged as any)
      return () => window.removeEventListener('house-system-changed', onSysChanged as any)
    }
  }, [])

  const initializeNotifications = async () => {
    if (!user) return

    try {
      console.log('?? Inicializando notifica\u00E7\u00F5es push...')
      // TODO: Implementar notifica\u00E7\u00F5es push quando o servi\u00E7o estiver dispon\u00EDvel
      console.log('? Notifica\u00E7\u00F5es push configuradas com sucesso')
    } catch (error) {
      console.error('? Erro ao inicializar notifica\u00E7\u00F5es:', error)
    }
  }

  const loadUserProfile = async () => {
    if (!user) return

    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid))
      if (userDoc.exists()) {
        const userData = userDoc.data()
        setUserProfile({
          displayName: userData.displayName || userData.fullName || 'Usu\u00E1rio',
          profilePhoto: userData.profilePhoto
        })
      }
    } catch (error) {
      console.error('Erro ao carregar perfil do UsuÃ¡rio:', error)
    }
  }

  const loadLunarCalendar = async () => {
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
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await refreshData()
    setRefreshing(false)
  }

  const getUserDisplayName = () => {
    const raw =
      userProfile?.displayName ||
      user?.displayName ||
      (user?.email ? user.email.split('@')[0] : '') ||
      tl('Usuário', 'User', 'Usuario', 'Utente')
    return decodeUnicodeEscapes(raw)
  }

  const formatDate = () => {
    const locale = language === 'en-US' ? 'en-US' : language === 'es-ES' ? 'es-ES' : language === 'it-IT' ? 'it-IT' : 'pt-BR'
    return new Date().toLocaleDateString(locale, {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    })
  }

  const lifeAreasForDisplay = React.useMemo(() => {
    return backendLifeAreas || transitData?.lifeAreas || null
  }, [backendLifeAreas, transitData?.lifeAreas])

  const orderedLifeAreas = React.useMemo(() => {
    if (!lifeAreasForDisplay) return []
    return LIFE_AREA_ORDER
      .map((key) => [key, (lifeAreasForDisplay as any)[key]] as const)
      .filter(([_, area]) => !!area)
  }, [lifeAreasForDisplay])

  const normalizeDisplayArea = React.useCallback((name: string, area: any) => {
    const percentage = typeof area?.percentage === 'number'
      ? area.percentage
      : (typeof area?.status === 'number' ? area.status : null)
    const activeTransits = Array.isArray(area?.activeTransits) ? area.activeTransits : []
    const avgImpact = activeTransits.length
      ? activeTransits.reduce((sum: number, item: any) => {
        const raw = Number(item?.impact)
        return sum + (Number.isFinite(raw) ? Math.abs(raw) : 0)
      }, 0) / activeTransits.length
      : null
    const movementScore = (() => {
      const normalized = normalizeAxisScore((area as any)?.movementScore)
      if (normalized !== null) return normalized
      const densityScore = Math.min(100, activeTransits.length * 14)
      const impactScore = avgImpact !== null ? Math.min(100, Math.round(avgImpact * 100)) : null
      if (impactScore === null && densityScore === 0) return null
      const merged = impactScore === null
        ? densityScore
        : Math.round((densityScore * 0.55) + (impactScore * 0.45))
      return Math.max(0, Math.min(100, merged))
    })()
    return {
      name,
      ...area,
      status: typeof percentage === 'number' ? percentage : 0,
      percentage: typeof area?.percentage === 'number' ? area.percentage : percentage,
      movementScore,
      criticalLevel: typeof percentage === 'number' ? percentage < STATUS_THRESHOLDS.criticalBelow : !!area?.criticalLevel,
    }
  }, [])

  const memoizedAreas = React.useMemo(() => {
    return orderedLifeAreas.map(([name, area]) => {
      const normalizedArea = normalizeDisplayArea(name, area)
      const byAreaCount = getAreaTransitCount(
        name,
        transitData?.currentTransits as any,
        backendCurrentTransits as any
      )
      const activeTransitsCount = Array.isArray((normalizedArea as any)?.activeTransits)
        ? (normalizedArea as any).activeTransits.length
        : 0
      const transitCount = Math.max(byAreaCount, activeTransitsCount)
      return { name, normalizedArea, transitCount }
    })
  }, [orderedLifeAreas, normalizeDisplayArea, transitData?.currentTransits, backendCurrentTransits])

  if (loading && !transitData) {
    return (
      <LinearGradient colors={['#0F0F23', '#1A1A3A']} style={styles.container}>
        <View style={styles.loadingContainer}>
          <StarLoader size={36} color="#FFD700" />
          <Text style={styles.loadingText}>
            {tl('Carregando seus trânsitos...', 'Loading your transits...', 'Cargando tus tránsitos...', 'Caricamento dei tuoi transiti...')}
          </Text>
        </View>
      </LinearGradient>
    )
  }

  if (error && !transitData) {
    return (
      <LinearGradient colors={['#0F0F23', '#1A1A3A']} style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
          <Text style={styles.errorTitle}>{tl('Erro', 'Error', 'Error', 'Errore')}</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => refreshData()}>
            <Text style={styles.retryButtonText}>{tl('Tentar novamente', 'Try again', 'Intentar de nuevo', 'Riprova')}</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    )
  }

  return (
    <LinearGradient colors={['#0F0F23', '#1A1A3A']} style={styles.container}>
      {/* Starfield apenas no PWA/web */}
      {typeof document !== 'undefined' && ((globalThis as any).__effectsIntensity !== 'low') && (
        <View
          // @ts-ignore
          ref={(ref: any) => {
            try {
              if (ref && mountStarfield) mountStarfield(ref as unknown as HTMLElement, { count: 50 })
            } catch { }
          }}
          style={{ position: 'absolute', inset: 0 }}
        />
      )}
      {localOverrideActive && (
        <View style={styles.statusToast}>
          <Text style={styles.statusToastText}>{tl('Recarregando status', 'Refreshing status', 'Recargando estado', 'Aggiornamento stato')}</Text>
        </View>
      )}
      <ScrollView
        ref={scrollRef}
        style={styles.scrollView}
        showsVerticalScrollIndicator={showDesktopScrollbar}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#FFD700"
            colors={['#FFD700']}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.userSection}>
            <View style={styles.avatarContainer}>
              {userProfile?.profilePhoto ? (
                <Image
                  source={{ uri: userProfile.profilePhoto }}
                  style={styles.avatar}
                />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Ionicons name="person" size={24} color="#FFD700" />
                </View>
              )}
            </View>
            <View style={styles.headerContent}>
              <Text style={styles.greeting}>{tl('Olá', 'Hello', 'Hola', 'Ciao')}, {getUserDisplayName()}!</Text>
              <Text style={styles.houseSystemLabel}>{tl('Data Gregoriana', 'Gregorian Date', 'Fecha gregoriana', 'Data gregoriana')}</Text>
              <Text style={styles.date}>{formatDate()}</Text>
            </View>
          </View>

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
        </View>

        {/* Status das Areas de Vida */}
        {lifeAreasForDisplay && (
          <AnimatedMount>
            <View style={styles.section}>
              <View style={styles.lifeAreasGrid}>
                {memoizedAreas.map(({ name, normalizedArea, transitCount }) => (
                  <AreaCardItem
                    key={name}
                    name={name}
                    area={normalizedArea}
                    factors={allLifeAreaFactors[name]}
                    transitCount={transitCount}
                    onPress={handleAreaPress}
                  />
                ))}
              </View>
            </View>
          </AnimatedMount>
        )}


        {loading && !transitData && (
          <View style={styles.chartLoadingContainer}>
            <ActivityIndicator size="large" color="#FFD700" />
            <Text style={styles.chartLoadingText}>
              {tl('Calculando seu mapa…', 'Calculating your chart…', 'Calculando tu mapa…', 'Calcolando la tua mappa…')}
            </Text>
          </View>
        )}

        {Array.isArray(transitData?.currentTransits?.planetComparisons) &&
          transitData!.currentTransits!.planetComparisons.length > 0 &&
          transitData?.currentTransits?.chartSummary && (
            <AnimatedMount>
              <View style={styles.planetStripSection}>
                <View style={styles.planetStripRow}>
                  {planetQuickNav.map((planetItem) => (
                    <TouchableOpacity
                      key={`quick-planet-${planetItem.planet}`}
                      style={styles.planetStripItem}
                      activeOpacity={0.86}
                      delayPressIn={0}
                      onPress={() => scrollToPlanetInTabula(planetItem.planet)}
                    >
                      {planetItem.imageUri && !failedPlanetImages[planetItem.planet] ? (
                        <Image
                          source={{ uri: planetItem.imageUri }}
                          style={[
                            styles.planetStripImage,
                            PLANETS_WITH_LIGHT_BG_IMAGES.has(planetItem.planet) && styles.planetStripImageWhiteBgFix,
                            Platform.OS === 'web' && PLANETS_WITH_LIGHT_BG_IMAGES.has(planetItem.planet)
                              ? ({ mixBlendMode: 'multiply' } as any)
                              : null,
                          ]}
                          resizeMode="cover"
                          onError={() =>
                            setFailedPlanetImages((prev) => ({
                              ...prev,
                              [planetItem.planet]: true,
                            }))
                          }
                        />
                      ) : (
                        <View style={styles.planetStripFallback}>
                          <Text style={styles.planetStripFallbackText}>{PLANET_FALLBACK_GLYPHS[planetItem.planet]}</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </AnimatedMount>
          )}


        {Array.isArray(transitData?.currentTransits?.planetComparisons) &&
          transitData!.currentTransits!.planetComparisons.length > 0 &&
          transitData?.currentTransits?.chartSummary && (
            <AnimatedMount>
              <View style={styles.section}>
                <TransitComparisonCard
                  planetComparisons={transitData.currentTransits.planetComparisons}
                  chartSummary={transitData.currentTransits.chartSummary}
                  ascendant={transitData.currentTransits.ascendant}
                  midheaven={transitData.currentTransits.midheaven}
                  natalAscendant={transitData.currentTransits.natalAscendant}
                  natalMidheaven={transitData.currentTransits.natalMidheaven}
                  housesCusps={transitData.currentTransits.houses}
                  natalHousesCusps={transitData.currentTransits.natalHouses}
                  lifeAreas={lifeAreasForDisplay || transitData.lifeAreas}
                  lifeAreasDebug={transitData.currentTransits.debug?.lifeAreas || {}}
                  personalWindows={transitData.dailyOverview?.personalTodayRich || []}
                  showOverviewHeader={false}
                  housesApproximate={transitData.currentTransits.natalHousesApproximate ?? false}
                />
              </View>
            </AnimatedMount>
          )}

        {/* Espa\u00E7amento final */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* ?? MODAL DE DETALHES DA \u00C1REA */}
      <LifeAreaDetailModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        areaData={selectedArea}
        astrologyData={transitData?.currentTransits}
        astrologyDataFallback={backendCurrentTransits}
      />

      {/* PWA Download Button */}
      <PWADownloadButton />

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
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 16,
    paddingHorizontal: 16,
  },
  retryButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 4,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2A2A3E',
    borderWidth: 2,
    borderColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
    minWidth: 0,
    paddingRight: 8,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  date: {
    fontSize: 11,
    color: '#A0A0A0',
    textTransform: 'capitalize',
  },
  houseSystemLabel: {
    fontSize: 11,
    color: '#A0A0A0',
    marginTop: 2,
    lineHeight: 15,
    flexShrink: 1,
  },
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
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  overviewCard: {
    margin: 16,
    borderRadius: 16,
    padding: 20,
  },
  overviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  overviewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  overviewContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  overallScore: {
    alignItems: 'center',
    marginRight: 20,
  },
  scoreNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  scoreLabel: {
    fontSize: 12,
    color: '#A0A0A0',
    marginTop: 4,
  },
  overviewDetails: {
    flex: 1,
  },
  overviewMessage: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 20,
    marginBottom: 12,
  },
  areasSummary: {
    gap: 8,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryText: {
    fontSize: 12,
    color: '#A0A0A0',
    marginLeft: 6,
  },
  alertCard: {
    margin: 16,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  alertDescription: {
    fontSize: 14,
    color: '#A0A0A0',
    lineHeight: 20,
    marginBottom: 16,
  },
  alertButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EF4444',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  alertButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  lifeAreasGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 4,
  },
  lifeAreaItem: {
    width: '50%',
  },
  planetStripSection: {
    marginTop: -6,
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  planetStripRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  planetStripItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 2,
    minWidth: 0,
  },
  planetStripImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.45)',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  planetStripImageWhiteBgFix: {
    backgroundColor: 'rgba(8,12,30,0.92)',
  },
  planetStripFallback: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  planetStripFallbackText: {
    color: '#FFFFFF',
    fontSize: 15,
    lineHeight: 18,
  },
  warningCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#2A2A3E',
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 12,
  },
  warningText: {
    color: '#FFFFFF',
    fontSize: 14,
    flex: 1,
    marginLeft: 12,
    lineHeight: 20,
  },
  bottomSpacing: {
    height: 32,
  },
  chartLoadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  chartLoadingText: {
    color: '#FFD700',
    fontSize: 14,
    opacity: 0.8,
  },
  statusToast: {
    position: 'absolute',
    top: 10,
    alignSelf: 'center',
    backgroundColor: 'rgba(15, 15, 35, 0.9)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    zIndex: 10,
  },
  statusToastText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  cardText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginBottom: 8,
  },
  errorTextContainer: {
    color: '#A0A0A0',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: '#1E1E2E',
    borderRadius: 12,
    padding: 16,
    width: '100%',
  },
  modalTitle: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  modalText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginBottom: 16,
  },
  modalButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#FFD700',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  modalButtonText: {
    color: '#000',
    fontWeight: '600',
  },
  buildTagWrap: {
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    marginBottom: 2,
  },
  buildTagText: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.55)',
    letterSpacing: 0.2,
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
  }
})
































