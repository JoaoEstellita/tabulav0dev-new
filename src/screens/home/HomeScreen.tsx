import React, { useEffect, useState, useRef } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Platform,
  useWindowDimensions,
  ActivityIndicator,
  InteractionManager,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { useAuth } from '../../hooks/useAuth'
import { useLifeAreas } from '../../hooks/useLifeAreas'
import { useAppLanguage } from '../../hooks/useAppLanguage'
import LifeAreaCard from '../../components/LifeAreaCard'
import { STATUS_THRESHOLDS } from '../../constants/statusThresholds'
import { LIFE_AREA_ORDER, HOME_LIFE_AREA_ORDER } from '../../constants/lifeAreas'
import { useUserSettings } from '../../hooks/useUserSettings'
import { LifeAreaDetailModal } from '../../components/LifeAreaDetailModal'
import ReadingService from '../../services/firebase/ReadingService'
import PWADownloadButton from '../../components/PWADownloadButton'
import { AnimatedMount } from '../../ui/anim/adapter'
import StarLoader from '../../components/StarLoader'
import useAutoScheduleNotifications from '../../hooks/useAutoScheduleNotifications'
import type { HouseSystem } from '../../astro/houseSystem'
import { normalizeHouseSystem } from '../../astro/houseSystem'
import TransitComparisonCard from '../../components/TransitComparisonCard'
import { NatalChartWheelContent } from '../cosmos/NatalChartWheelScreen'
import { decodeUnicodeEscapes, translatePlanet } from '../../utils/astro/pt'
import HomeHeader from '../../components/HomeHeader'
import NotificationOptInBanner from '../../components/NotificationOptInBanner'
import MatchInviteCard from './MatchInviteCard'
import PlanetQuickNav from '../../components/PlanetQuickNav'
import ScrollTopButton, { SCROLL_TOP_THRESHOLD } from '../../components/ScrollTopButton'
import WhatsAppAgentBanner from '../../components/WhatsAppAgentBanner'
import { useTourAnchor, useTourScroller, useTabTour } from '../../tour/TourProvider'
import { getAreaTransitCount } from '../../utils/transitsByArea'
import { normalizeAxisScore } from '../../utils/statusAxes'
// Web-only effects (no-op on native)
let mountStarfield: any = null
try { const mod = require('../../ui/motion/web/starfield'); mountStarfield = mod.mountStarfield } catch { }

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
  const {
    transitData,
    loading,
    error,
    refreshData,
    backendLifeAreas,
    backendCurrentTransits,
    backendStatusPersonal,
    backendFresh,
    localOverrideActive,
    isUsingLocalEngine
  } = useLifeAreas()
  const { settings } = useUserSettings()
  const [houseSystem, setHouseSystem] = useState<HouseSystem>(normalizeHouseSystem(settings?.houseSystem))
  const previousHouseSystemRef = useRef<HouseSystem | null>(null)
  // Garantir que o motor use o sistema salvo ao entrar na Home
  useEffect(() => {
    const normalized = normalizeHouseSystem(settings?.houseSystem)
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
  // A roda (SVG pesado) monta logo após a Home abrir, pra não atrasar a 1ª pintura.
  // InteractionManager pode nunca resolver se algo fica animando na tela, então há
  // um fallback por tempo — garante que a roda aparece de qualquer forma.
  const [wheelReady, setWheelReady] = useState(false)
  useEffect(() => {
    let done = false
    const mark = () => { if (!done) { done = true; setWheelReady(true) } }
    const task = InteractionManager.runAfterInteractions(mark)
    const timer = setTimeout(mark, 600)
    return () => { done = true; task.cancel(); clearTimeout(timer) }
  }, [])
  const scrollRef = useRef<ScrollView>(null)
  // Grade da roda clicável → rola até a leitura do planeta no card de comparação
  // abaixo. measureLayout funciona no PWA e no APK (não usa getElementById).
  const wheelAnchorsRef = useRef<Record<string, any>>({})
  const registerWheelAnchor = React.useCallback((key: string, node: any) => {
    if (node) wheelAnchorsRef.current[key] = node
    else delete wheelAnchorsRef.current[key]
  }, [])
  const scrollToWheelAnchor = React.useCallback((key: string) => {
    const node = wheelAnchorsRef.current[key]
    const scroll = scrollRef.current as any
    if (!node || !scroll) return
    try {
      const scrollNode = scroll.getScrollableNode ? scroll.getScrollableNode() : scroll
      node.measureLayout(scrollNode, (_x: number, y: number) => scroll.scrollTo({ y: Math.max(0, y - 12), animated: true }), () => { })
    } catch { }
  }, [])
  const anchorNorm = (s: string) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  const PERSONAL_PLANETS_SET = React.useRef(new Set(['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'])).current
  const handleSelectNatalAspect = React.useCallback((a: { planet1: string; planet2: string; type: string }) => {
    if (!a) return
    const target = PERSONAL_PLANETS_SET.has(a.planet1) ? a.planet1 : PERSONAL_PLANETS_SET.has(a.planet2) ? a.planet2 : a.planet1
    scrollToWheelAnchor(`planet:${anchorNorm(target)}`)
  }, [scrollToWheelAnchor, PERSONAL_PLANETS_SET])
  const handleSelectTransitAspect = React.useCallback((cellId: string) => {
    // txr-<transito>-<tipo>-<natal>: rola até o planeta NATAL do par (última parte)
    const natal = (cellId || '').split('-').pop() || ''
    if (natal) scrollToWheelAnchor(`planet:${natal}`)
  }, [scrollToWheelAnchor])
  const [showTop, setShowTop] = useState(false)
  // Âncoras do tour guiado (holofote) — destacam os recursos reais.
  const aHeader = useTourAnchor('home.header')
  const aMoon = useTourAnchor('home.moon')
  const aAreas = useTourAnchor('home.areas')
  const aWheel = useTourAnchor('home.wheel')
  const aTransits = useTourAnchor('home.transits')
  const aNotif = useTourAnchor('home.notif')
  useTourScroller('Home', React.useCallback((y: number) => (scrollRef.current as any)?.scrollTo({ y, animated: true }), []))
  const buildHomeTour = React.useCallback(() => ([
    { id: 'home.header', title: tl('Seu topo astrológico', 'Your astro header', 'Tu encabezado astral', 'La tua intestazione'),
      body: tl('Aqui ficam seu Sol, Lua e Ascendente (↑). Toque na foto para trocá-la.', 'Here are your Sun, Moon and Ascendant (↑). Tap the photo to change it.', 'Aqui estan tu Sol, Luna y Ascendente (↑). Toca la foto para cambiarla.', 'Qui ci sono Sole, Luna e Ascendente (↑). Tocca la foto per cambiarla.') },
    { id: 'home.moon', title: tl('Dados da Lua', 'Moon data', 'Datos de la Luna', 'Dati della Luna'),
      body: tl('Toque na Lua para ver a fase de hoje, o signo e os dados lunares.', 'Tap the Moon to see today\'s phase, sign and lunar data.', 'Toca la Luna para ver la fase de hoy, el signo y los datos lunares.', 'Tocca la Luna per la fase di oggi, il segno e i dati lunari.') },
    { id: 'home.areas', title: tl('8 Áreas da vida', '8 Life areas', '8 Areas de la vida', '8 Aree della vita'),
      body: tl('Cada card mostra como o céu de hoje mexe numa parte da sua vida. Toque num card para abrir o status completo — e, dentro dele, você vê exatamente os trânsitos que estão afetando aquela área, além dos conselhos.', 'Each card shows how today\'s sky affects a part of your life. Tap a card to open the full status — and inside it you see exactly which transits are affecting that area, plus advice.', 'Cada tarjeta muestra como el cielo de hoy afecta una parte de tu vida. Toca una tarjeta para abrir el estado completo — y dentro ves exactamente los transitos que afectan esa area, ademas de consejos.', 'Ogni card mostra come il cielo di oggi tocca una parte della tua vita. Tocca una card per aprire lo stato completo — e dentro vedi esattamente i transiti che influenzano quell\'area, oltre ai consigli.') },
    { id: 'home.wheel', title: tl('Céu de hoje (roda)', 'Today\'s sky (wheel)', 'Cielo de hoy (rueda)', 'Cielo di oggi (ruota)'),
      body: tl('A roda cruza seu mapa natal com os trânsitos de agora. Toque num aspecto na roda OU numa célula da grade (logo abaixo) para ler a interpretação daquele aspecto.', 'The wheel overlays your natal chart with current transits. Tap an aspect on the wheel OR a cell in the grid (just below) to read that aspect\'s interpretation.', 'La rueda cruza tu carta natal con los transitos de ahora. Toca un aspecto en la rueda O una celda de la grilla (abajo) para leer la interpretacion de ese aspecto.', 'La ruota incrocia la tua carta natale coi transiti attuali. Tocca un aspetto sulla ruota O una cella della griglia (sotto) per leggere l\'interpretazione.') },
    { id: 'home.transits', title: tl('Comparação de trânsitos', 'Transit comparison', 'Comparacion de transitos', 'Confronto transiti'),
      body: tl('Planeta a planeta, o que cada trânsito ativa. Toque numa célula da grade para a leitura daquele aspecto.', 'Planet by planet, what each transit activates. Tap a grid cell for that aspect\'s reading.', 'Planeta a planeta, que activa cada transito. Toca una celda de la grilla para la lectura de ese aspecto.', 'Pianeta per pianeta, cosa attiva ogni transito. Tocca una cella della griglia per la lettura di quell\'aspetto.') },
  ]), [language]) // eslint-disable-line react-hooks/exhaustive-deps
  const { openTour: openHomeTour } = useTabTour('tour_seen_home', 'Home', buildHomeTour)
  const { width } = useWindowDimensions()
  const showDesktopScrollbar = Platform.OS === 'web' && width >= 1024
  const uiText = React.useCallback((text: string) => decodeUnicodeEscapes(text), [])

  // Função para abrir modal de detalhes
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

  useEffect(() => {
    if (user) initializeNotifications()
  }, [user])

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

  const onRefresh = async () => {
    setRefreshing(true)
    await refreshData()
    setRefreshing(false)
  }

  const lifeAreasForDisplay = React.useMemo(() => {
    // Fonte única da verdade: snapshot do backend (mesmo engine que alimenta push,
    // digest e agente WhatsApp). Engine local/cache só como fallback quando o
    // backend não está fresco — evita divergência entre app e demais canais.
    if (backendFresh && backendLifeAreas && Object.keys(backendLifeAreas).length > 0) {
      return backendLifeAreas
    }
    if (transitData?.lifeAreas && Object.keys(transitData.lifeAreas).length > 0) return transitData.lifeAreas
    return backendLifeAreas || null
  }, [backendFresh, backendLifeAreas, transitData?.lifeAreas])

  // Trânsito mais intenso do dia para a frase explicativa do score
  const navigation = useNavigation<any>()

  // Headline = trânsito pessoal (trânsito→natal) de maior força. Mesma fonte da tela
  // PersonalTransits, então o texto do card bate com o 1º item da lista que ele abre.
  const topTransit = React.useMemo(() => {
    const rich = transitData?.dailyOverview?.personalTodayRich
    if (!Array.isArray(rich) || rich.length === 0) return null
    let best: { planet1: string; type: string; planet2: string; strength: number; house: number | null } | null = null
    for (const item of rich as any[]) {
      const strength = typeof item?.strength === 'number' ? item.strength : 0
      if (!best || strength > best.strength) {
        // planet1 = planeta em trânsito; planet2 = planeta natal ("com seu ...")
        best = { planet1: item.transitPlanet, type: item.type, planet2: item.natalPlanet, strength, house: typeof item.house === 'number' ? item.house : null }
      }
    }
    return best
  }, [transitData?.dailyOverview?.personalTodayRich])

  // Quantos trânsitos pessoais o dia tem — deduplicado com a MESMA chave da tela
  // PersonalTransits (natal|type|transit), para o "N hoje" bater com a lista aberta.
  const personalTransitCount = React.useMemo(() => {
    const rich = transitData?.dailyOverview?.personalTodayRich
    if (!Array.isArray(rich)) return 0
    const seen = new Set<string>()
    for (const it of rich as any[]) seen.add(`${it.natalPlanet}|${it.type}|${it.transitPlanet}`)
    return seen.size
  }, [transitData?.dailyOverview?.personalTodayRich])

  // Signos de Sol e Lua natais para o header (já vêm em pt-BR do engine).
  const natalSunSign = React.useMemo(() => {
    const comparisons = transitData?.currentTransits?.planetComparisons
    return Array.isArray(comparisons)
      ? (comparisons as any[]).find((c) => c?.name === 'Sun')?.natal?.sign
      : undefined
  }, [transitData?.currentTransits?.planetComparisons])

  const natalMoonSign = React.useMemo(() => {
    const comparisons = transitData?.currentTransits?.planetComparisons
    return Array.isArray(comparisons)
      ? (comparisons as any[]).find((c) => c?.name === 'Moon')?.natal?.sign
      : undefined
  }, [transitData?.currentTransits?.planetComparisons])

  const orderedLifeAreas = React.useMemo(() => {
    if (!lifeAreasForDisplay) return []
    return HOME_LIFE_AREA_ORDER
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

  if (!loading && !transitData && !error) {
    return (
      <LinearGradient colors={['#0F0F23', '#1A1A3A']} style={styles.container}>
        <View style={styles.emptyStateContainer}>
          <Ionicons name="planet-outline" size={56} color="#FFD700" style={{ opacity: 0.4 }} />
          <Text style={styles.emptyStateTitle}>
            {tl('Mapa em processamento', 'Chart processing', 'Mapa en proceso', 'Mappa in elaborazione')}
          </Text>
          <Text style={styles.emptyStateText}>
            {tl(
              'Seus dados astrológicos estão sendo calculados. Puxe para baixo para atualizar.',
              'Your astrological data is being calculated. Pull down to refresh.',
              'Tus datos astrológicos están siendo calculados. Desliza hacia abajo para actualizar.',
              'I tuoi dati astrologici sono in elaborazione. Trascina verso il basso per aggiornare.'
            )}
          </Text>
          <TouchableOpacity style={styles.emptyStateButton} onPress={() => refreshData()}>
            <Text style={styles.emptyStateButtonText}>
              {tl('Tentar novamente', 'Try again', 'Intentar de nuevo', 'Riprova')}
            </Text>
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
        scrollEventThrottle={16}
        onScroll={(e) => setShowTop(e.nativeEvent.contentOffset.y > SCROLL_TOP_THRESHOLD)}
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
        <View {...aHeader}>
          <HomeHeader
            sunSign={natalSunSign}
            moonSign={natalMoonSign}
            moonAnchor={aMoon}
            onPressHelp={openHomeTour}
          />
        </View>

        {/* Ativar notificações (o passo saiu do onboarding; sem isso não recebe push) */}
        <View {...aNotif}><NotificationOptInBanner /></View>

        {/* Convite proativo pra completar o perfil do Match (só se incompleto) */}
        <MatchInviteCard />

        {/* Status das Areas de Vida */}
        {lifeAreasForDisplay && (
          <View {...aAreas}>
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
          </View>
        )}


        {loading && !transitData && (
          <View style={styles.chartLoadingContainer}>
            <ActivityIndicator size="large" color="#FFD700" />
            <Text style={styles.chartLoadingText}>
              {tl('Calculando seu mapa…', 'Calculating your chart…', 'Calculando tu mapa…', 'Calcolando la tua mappa…')}
            </Text>
          </View>
        )}

        {/* Céu de hoje: roda natal + trânsitos */}
        {transitData && (
          <View {...aWheel}>
          <AnimatedMount>
            <View style={styles.section}>
              {wheelReady ? (
                <NatalChartWheelContent transitData={transitData} loading={loading} showLegend={false} showTransits onSelectTransitAspect={handleSelectTransitAspect} onSelectNatalAspect={handleSelectNatalAspect} />
              ) : (
                // Skeleton de mesma altura: a roda (SVG pesado) só monta após as
                // interações, pra não travar a abertura da Home. Não pula o layout.
                <View style={styles.wheelSkeleton}><ActivityIndicator color="#FFD700" /></View>
              )}
            </View>
          </AnimatedMount>
          </View>
        )}

        {Array.isArray(transitData?.currentTransits?.planetComparisons) &&
          transitData!.currentTransits!.planetComparisons.length > 0 &&
          transitData?.currentTransits?.chartSummary && (
            <AnimatedMount>
              <PlanetQuickNav showCosmosEntry={false} />
            </AnimatedMount>
          )}


        {Array.isArray(transitData?.currentTransits?.planetComparisons) &&
          transitData!.currentTransits!.planetComparisons.length > 0 &&
          transitData?.currentTransits?.chartSummary && (
            <View {...aTransits}>
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
                  registerAnchor={registerWheelAnchor}
                />
              </View>
            </AnimatedMount>
            </View>
          )}

        {/* Espa\u00E7amento final */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
      <ScrollTopButton
        visible={showTop}
        onPress={() => (scrollRef.current as any)?.scrollTo({ y: 0, animated: true })}
      />

      {/* ?? MODAL DE DETALHES DA \u00C1REA */}
      <LifeAreaDetailModal
        visible={modalVisible}
        onClose={() => {
          if (user?.uid && selectedArea) {
            ReadingService.logReading(user.uid, {
              areaName: selectedArea.name,
              areaScore: selectedArea.status ?? 0,
              areaTrend: selectedArea.trend ?? 'stable',
              language,
              source: 'app',
            })
          }
          setModalVisible(false)
        }}
        areaData={selectedArea}
        astrologyData={transitData?.currentTransits}
        astrologyDataFallback={backendCurrentTransits}
      />

      {/* Banners flutuantes: descoberta do agente + instalação do PWA */}
      <WhatsAppAgentBanner />
      <PWADownloadButton />

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
  emptyStateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 16,
  },
  emptyStateTitle: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  emptyStateText: {
    color: '#AAAAAA',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  },
  emptyStateButton: {
    marginTop: 8,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  emptyStateButtonText: {
    color: '#FFD700',
    fontSize: 14,
  },
  retryButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  wheelSkeleton: {
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skyLegend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#161728',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginTop: 10,
  },
  skyLegendScore: { fontSize: 22, fontWeight: '800' },
  skyLegendMax: { fontSize: 12, color: '#6E6F8C', fontWeight: '600' },
  skyLegendLevel: { fontSize: 13, fontWeight: '700' },
  skyLegendTransit: { fontSize: 12, color: '#9A9CB8', marginTop: 2 },
  skyLegendMore: { fontSize: 12, color: '#FFD700', fontWeight: '700' },
  dailyScoreCard: {
    flexDirection: 'column',
    alignItems: 'stretch',
    marginHorizontal: 16,
    marginBottom: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  dailyScoreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  dailyScoreLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    color: '#8888AA',
  },
  dailyScoreHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dailyScoreCount: {
    fontSize: 11,
    color: '#8888AA',
    marginRight: 6,
  },
  dailyScoreBody: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dailyScoreCircle: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginRight: 12,
  },
  dailyScoreNumber: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  dailyScoreMax: {
    fontSize: 10,
    color: '#888',
    marginLeft: 2,
  },
  dailyScoreInfo: {
    flex: 1,
  },
  dailyScoreLevel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 1,
  },
  dailyScoreTransit: {
    fontSize: 11,
    color: '#B0B0C0',
    lineHeight: 15,
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
})
































