import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../config/firebase'
import { useAuth } from '../../hooks/useAuth'
import ShareCardModal, { type ShareCardData } from '../../components/ShareCardModal'
import { useSubscription } from '../../hooks/useSubscription'
import { useLifeAreas } from '../../hooks/useLifeAreas'
import { NatalChartWheelContent } from './NatalChartWheelScreen'
import { useTourAnchor, useTourScroller, useTabTour } from '../../tour/TourProvider'
import PersonalTransitsScreen from '../transits/PersonalTransitsScreen'
import { AstroProfileContent } from './AstroProfileScreen'
import { VedicProfileContent } from './VedicProfileContent'
import TzolkinProfileContent from './TzolkinProfileContent'
import ChineseProfileContent from './ChineseProfileContent'

const TZOLKIN_ENABLED = process.env.EXPO_PUBLIC_TZOLKIN_ENABLED !== '0' // default ligado; '0' desliga
const CHINESE_ENABLED = process.env.EXPO_PUBLIC_CHINESE_ENABLED !== '0'
import PlanetQuickNav from '../../components/PlanetQuickNav'
import ScrollTopButton, { SCROLL_TOP_THRESHOLD } from '../../components/ScrollTopButton'
import { useAppLanguage } from '../../hooks/useAppLanguage'
import { degToSign } from '../../astro'
import StarLoader from '../../components/StarLoader'

const PLANET_SYMBOLS: Record<string, string> = {
  Sun: '☉', Moon: '☽', Mercury: '☿', Venus: '♀',
  Mars: '♂', Jupiter: '♃', Saturn: '♄', Uranus: '♅',
  Neptune: '♆', Pluto: '♇',
}

const SIGN_SYMBOLS: Record<string, string> = {
  Aries: '♈', Taurus: '♉', Gemini: '♊', Cancer: '♋',
  Leo: '♌', Virgo: '♍', Libra: '♎', Scorpio: '♏',
  Sagittarius: '♐', Capricorn: '♑', Aquarius: '♒', Pisces: '♓',
}

function getSignSymbol(sign: string): string {
  return SIGN_SYMBOLS[sign] || ''
}

// Data + hora exata do retorno (instante em que o Sol/Lua atinge o grau natal).
// Formatado no fuso do aparelho — o instante é absoluto (UTC), a hora é a local.
function fmtReturnMoment(d: Date, loc: string, at: string): string {
  const date = d.toLocaleDateString(loc)
  const time = d.toLocaleTimeString(loc, { hour: '2-digit', minute: '2-digit' })
  return `${date} ${at} ${time}`
}

function getPlanetNatalSign(natalPlanets: any[], name: string): string {
  const p = natalPlanets?.find((x: any) => x.name === name)
  return p?.sign || ''
}

type FeatureCard = {
  key: string
  icon: keyof typeof Ionicons.glyphMap
  titlePt: string
  titleEn: string
  titleEs: string
  titleIt: string
  descPt: string
  descEn: string
  descEs: string
  descIt: string
  premium: boolean
  screen: string
  available: boolean
}

const FREE_FEATURES: FeatureCard[] = [
  {
    key: 'natal-wheel',
    icon: 'planet-outline',
    titlePt: 'Mapa Natal',
    titleEn: 'Natal Chart',
    titleEs: 'Carta Natal',
    titleIt: 'Carta Natale',
    descPt: 'Roda astrológica com planetas e casas',
    descEn: 'Astrological wheel with planets and houses',
    descEs: 'Rueda astrológica con planetas y casas',
    descIt: 'Ruota astrologica con pianeti e case',
    premium: false,
    screen: 'NatalChartWheel',
    available: true,
  },
  {
    key: 'astro-profile',
    icon: 'star-outline',
    titlePt: 'Perfil Astrológico',
    titleEn: 'Astrological Profile',
    titleEs: 'Perfil Astrológico',
    titleIt: 'Profilo Astrologico',
    descPt: 'Todos os seus planetas, casas e elementos',
    descEn: 'All your planets, houses and elements',
    descEs: 'Todos tus planetas, casas y elementos',
    descIt: 'Tutti i tuoi pianeti, case ed elementi',
    premium: false,
    screen: 'AstroProfile',
    available: true,
  },
  {
    key: 'transits',
    icon: 'git-branch-outline',
    titlePt: 'Trânsitos do Dia',
    titleEn: 'Daily Transits',
    titleEs: 'Tránsitos del Día',
    titleIt: 'Transiti del Giorno',
    descPt: 'O que o céu faz agora no seu mapa',
    descEn: 'What the sky does now in your chart',
    descEs: 'Lo que el cielo hace ahora en tu mapa',
    descIt: 'Cosa fa il cielo ora nella tua carta',
    premium: false,
    screen: 'PersonalTransits',
    available: true,
  },
  {
    key: 'timeline',
    icon: 'time-outline',
    titlePt: 'Linha do Tempo',
    titleEn: 'Timeline',
    titleEs: 'Línea de Tiempo',
    titleIt: 'Linea del Tempo',
    descPt: 'Previsões de curto, médio e longo prazo',
    descEn: 'Short, medium and long-term forecasts',
    descEs: 'Previsiones a corto, medio y largo plazo',
    descIt: 'Previsioni a breve, medio e lungo termine',
    premium: false,
    screen: 'AstrologyAnalysis',
    available: true,
  },
]

const PREMIUM_FEATURES: FeatureCard[] = [
  {
    key: 'pdf',
    icon: 'document-text-outline',
    titlePt: 'Relatório PDF',
    titleEn: 'PDF Report',
    titleEs: 'Informe PDF',
    titleIt: 'Rapporto PDF',
    descPt: 'Mapa natal completo para download',
    descEn: 'Complete natal chart for download',
    descEs: 'Carta natal completa para descargar',
    descIt: 'Carta natale completa da scaricare',
    premium: true,
    screen: 'PdfExport',
    available: false, // Fase 2
  },
  {
    key: 'chat',
    icon: 'chatbubbles-outline',
    titlePt: 'Chat IA',
    titleEn: 'AI Chat',
    titleEs: 'Chat IA',
    titleIt: 'Chat IA',
    descPt: 'Tire dúvidas sobre seu mapa com IA',
    descEn: 'Ask questions about your chart with AI',
    descEs: 'Resuelve dudas sobre tu mapa con IA',
    descIt: 'Chiarisci i dubbi sulla tua carta con IA',
    premium: true,
    screen: 'ChatAstro',
    available: false, // Fase 2
  },
  {
    key: 'solar-return',
    icon: 'sunny-outline',
    titlePt: 'Retorno Solar',
    titleEn: 'Solar Return',
    titleEs: 'Retorno Solar',
    titleIt: 'Ritorno Solare',
    descPt: 'Mapa do seu próximo aniversário',
    descEn: 'Chart for your next birthday year',
    descEs: 'Mapa para tu próximo año de cumpleaños',
    descIt: 'Mappa per il tuo prossimo compleanno',
    premium: true,
    screen: 'SolarReturn',
    available: false, // Fase 2
  },
  {
    key: 'synastry',
    icon: 'heart-outline',
    titlePt: 'Sinastria',
    titleEn: 'Synastry',
    titleEs: 'Sinastría',
    titleIt: 'Sinastria',
    descPt: 'Compare seu mapa com outra pessoa',
    descEn: 'Compare your chart with another person',
    descEs: 'Compara tu mapa con otra persona',
    descIt: 'Confronta la tua carta con un\'altra persona',
    premium: true,
    screen: 'Synastry',
    available: false, // Fase 3
  },
  {
    key: 'diary',
    icon: 'journal-outline',
    titlePt: 'Diário Cósmico',
    titleEn: 'Cosmic Diary',
    titleEs: 'Diario Cósmico',
    titleIt: 'Diario Cosmico',
    descPt: 'Notas linkadas aos seus trânsitos',
    descEn: 'Notes linked to your transits',
    descEs: 'Notas enlazadas a tus tránsitos',
    descIt: 'Note collegate ai tuoi transiti',
    premium: true,
    screen: 'CosmicDiary',
    available: false, // Fase 3
  },
  {
    key: 'alerts',
    icon: 'notifications-outline',
    titlePt: 'Alertas Customizados',
    titleEn: 'Custom Alerts',
    titleEs: 'Alertas Personalizadas',
    titleIt: 'Avvisi Personalizzati',
    descPt: 'Avise quando um planeta tocar seu natal',
    descEn: 'Alert when a planet touches your natal',
    descEs: 'Avisa cuando un planeta toca tu natal',
    descIt: 'Avvisa quando un pianeta tocca il tuo natale',
    premium: true,
    screen: 'CustomAlerts',
    available: false, // Fase 3
  },
]

const SECTION_CHIPS = [
  { key: 'section:ruler', pt: 'Regente', en: 'Ruler', es: 'Regente', it: 'Governatore' },
  { key: 'section:houses', pt: '12 Casas', en: '12 Houses', es: '12 Casas', it: '12 Case' },
  { key: 'section:angles', pt: 'Angulares', en: 'Angles', es: 'Angulares', it: 'Angoli' },
  { key: 'section:nodes', pt: 'Nódulos', en: 'Nodes', es: 'Nodos', it: 'Nodi' },
  { key: 'section:elements', pt: 'Elementos', en: 'Elements', es: 'Elementos', it: 'Elementi' },
]

export default function CosmosScreen() {
  const navigation = useNavigation()
  const { user } = useAuth()
  const { subscription, isInTrial } = useSubscription()
  const { transitData, loading, backendStatusPersonal } = useLifeAreas()
  const [shareOpen, setShareOpen] = useState(false)
  const [shareName, setShareName] = useState('')

  // Navegação por seção: cada bloco do Perfil registra seu nó aqui e o chip usa
  // measureLayout para achar a posição real dentro do ScrollView. Não dá para usar
  // âncora DOM como a Home faz — é web-only e colidiria com os IDs de lá.
  const scrollRef = useRef<ScrollView>(null)
  const anchorsRef = useRef<Record<string, any>>({})
  const aSystem = useTourAnchor('cosmos.system')
  const aModes = useTourAnchor('cosmos.modes')
  const aWheel = useTourAnchor('cosmos.wheel')
  useTourScroller('Cosmos', useCallback((y: number) => (scrollRef.current as any)?.scrollTo({ y, animated: true }), []))
  const [showTop, setShowTop] = useState(false)
  const [mapMode, setMapMode] = useState<'western' | 'vedic' | 'tzolkin' | 'chinese'>('western')
  // Dentro do Ocidental: roda natal pura vs bi-roda (natal + trânsitos de agora).
  const [westMode, setWestMode] = useState<'natal' | 'transitos' | 'solar' | 'lunar'>('natal')
  // Retorno Solar (carga sob demanda ao entrar no modo 'solar').
  const [srData, setSrData] = useState<any>(null)
  const [srLoading, setSrLoading] = useState(false)
  const [srMoment, setSrMoment] = useState<Date | null>(null)
  const [srNeedsCity, setSrNeedsCity] = useState(false)
  const [srError, setSrError] = useState(false)
  const [srAtBirth, setSrAtBirth] = useState(false) // RS caiu no local de nascimento (sem cidade atual)
  // Retorno Lunar (mês) — mesma mecânica do RS, Sol→Lua.
  const [lrData, setLrData] = useState<any>(null)
  const [lrLoading, setLrLoading] = useState(false)
  const [lrMoment, setLrMoment] = useState<Date | null>(null)
  const [lrError, setLrError] = useState(false)
  const [lrNeedsCity, setLrNeedsCity] = useState(false)
  const [lrAtBirth, setLrAtBirth] = useState(false)

  // Grade de aspectos (modo Trânsitos): tocar numa célula rola até a leitura do
  // trânsito na lista embutida abaixo e destaca o card por instantes. O scroll é
  // web-only (DOM); o destaque funciona nos dois.
  const [txHighlight, setTxHighlight] = useState<string | null>(null)
  const txHighlightTimer = useRef<any>(null)
  const handleSelectTransitAspect = useCallback((cellId: string) => {
    if (!cellId) return
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const el = document.getElementById(cellId)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
    setTxHighlight(cellId)
    if (txHighlightTimer.current) clearTimeout(txHighlightTimer.current)
    txHighlightTimer.current = setTimeout(() => setTxHighlight(null), 2400)
  }, [])

  const registerAnchor = useCallback((key: string, node: any) => {
    if (node) anchorsRef.current[key] = node
    else delete anchorsRef.current[key]
  }, [])

  const scrollToAnchor = useCallback((key: string) => {
    const node = anchorsRef.current[key]
    const scroll = scrollRef.current as any
    if (!node || !scroll) return
    try {
      const scrollNode = scroll.getScrollableNode ? scroll.getScrollableNode() : scroll
      node.measureLayout(
        scrollNode,
        (_x: number, y: number) => scroll.scrollTo({ y: Math.max(0, y - 12), animated: true }),
        () => { },
      )
    } catch { }
  }, [])

  // Grade natal clicável: toca numa célula (aspecto A×B) → rola até o bloco do
  // planeta (onde a leitura desse aspecto já está renderizada). Ângulos/nós não têm
  // bloco próprio → cai no outro ponto do par que for planeta real.
  const NATAL_ANCHOR_PLANETS = React.useRef(new Set(['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'])).current
  const handleSelectNatalAspect = useCallback((a: { planet1: string; planet2: string; type: string }) => {
    if (!a) return
    const target = NATAL_ANCHOR_PLANETS.has(a.planet1) ? a.planet1
      : NATAL_ANCHOR_PLANETS.has(a.planet2) ? a.planet2 : a.planet1
    scrollToAnchor(`planet:${target}`)
  }, [scrollToAnchor, NATAL_ANCHOR_PLANETS])

  const { language } = useAppLanguage()

  const isPremium = subscription?.status === 'active' || isInTrial

  const natalPlanets = transitData?.currentTransits?.natalPlanets ?? []

  const [firestoreAscDeg, setFirestoreAscDeg] = useState<number | null>(null)
  useEffect(() => {
    if (!user?.uid) return
    getDoc(doc(db, 'users', user.uid)).then(snap => {
      const d = snap.data()
      const val = d?.natalAscDeg
      if (typeof val === 'number') setFirestoreAscDeg(val)
      const nm = d?.displayName || d?.fullName
      if (nm) setShareName(String(nm))
    }).catch(() => {})
  }, [user?.uid])

  const natalAscDeg = firestoreAscDeg ?? transitData?.currentTransits?.natalAscendant ?? 0

  const sunSign = useMemo(() => getPlanetNatalSign(natalPlanets, 'Sun'), [natalPlanets])
  const moonSign = useMemo(() => getPlanetNatalSign(natalPlanets, 'Moon'), [natalPlanets])
  const ascSign = useMemo(() => {
    try { return degToSign(natalAscDeg).sign } catch { return '' }
  }, [natalAscDeg])

  // Dados do card compartilhável (natal + status do dia).
  const shareData: ShareCardData = useMemo(() => {
    const areaLabelsPt: Record<string, string> = {
      amor: 'Amor', saude: 'Saúde', familia: 'Família', comunicacao: 'Comunicação',
      carreira: 'Carreira', financas: 'Finanças', espiritualidade: 'Espiritualidade', transformacao: 'Transformação',
    }
    const levelLabelsPt: Record<string, string> = {
      positive: 'Positivo', positivo: 'Positivo', moderate: 'Moderado', moderado: 'Moderado',
      attention: 'Atenção', atencao: 'Atenção', critical: 'Crítico', critico: 'Crítico',
    }
    let focusArea: string | null = null
    const areas = transitData?.lifeAreas
    if (areas) {
      let bestKey = ''; let bestVal = -Infinity
      for (const [k, v] of Object.entries(areas as Record<string, any>)) {
        const s = typeof v?.overall === 'number' ? v.overall : (typeof v?.score === 'number' ? v.score : null)
        if (s != null && s > bestVal) { bestVal = s; bestKey = k }
      }
      const norm = bestKey.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
      focusArea = areaLabelsPt[norm] || (bestKey ? bestKey.charAt(0).toUpperCase() + bestKey.slice(1) : null)
    }
    const lvl = String(backendStatusPersonal?.level || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    const dateLabel = new Date().toLocaleDateString(
      language === 'en-US' ? 'en-US' : language === 'es-ES' ? 'es-ES' : language === 'it-IT' ? 'it-IT' : 'pt-BR',
      { weekday: 'long', day: 'numeric', month: 'long' },
    )
    return {
      name: shareName,
      sunSign, ascSign, moonSign,
      score: typeof backendStatusPersonal?.score === 'number' ? backendStatusPersonal.score : null,
      levelLabel: lvl ? (levelLabelsPt[lvl] || null) : null,
      focusArea,
      dateLabel,
    }
  }, [shareName, sunSign, ascSign, moonSign, backendStatusPersonal, transitData?.lifeAreas, language])

  // Sol natal como PRIMITIVO estável: natalPlanets muda de referência a cada render;
  // se entrasse direto nas deps do effect, o cleanup cancelava o cálculo e reiniciava
  // em loop (loader eterno). Extraindo o número, a dep fica estável.
  const srSunLon = useMemo(() => {
    const s = (natalPlanets as any[]).find((p) => p?.name === 'Sun')
    return typeof s?.longitude === 'number' ? s.longitude : null
  }, [natalPlanets])
  const srRunRef = useRef(false)

  // Carga do Retorno Solar: só no modo 'solar', só assinante, uma vez (ref-guard).
  // Lê currentLocation/currentCity → coords → computeSolarReturn (fallback nascimento).
  useEffect(() => {
    if (westMode !== 'solar') { return }
    if (!isPremium || srSunLon == null || !user?.uid) return
    if (srRunRef.current) return // já calculou/está calculando nesta sessão de Solar
    srRunRef.current = true
    const natalSunLon = srSunLon
    let cancelled = false
    // Corrida com timeout: rede lenta (geocode) não pode travar o cálculo p/ sempre.
    const withTimeout = <T,>(p: Promise<T>, ms: number): Promise<T> =>
      Promise.race([p, new Promise<T>((_, rej) => setTimeout(() => rej(new Error('timeout')), ms))])
    ;(async () => {
      setSrLoading(true); setSrError(false); setSrNeedsCity(false)
      try {
        const uSnap = await getDoc(doc(db, 'users', user.uid))
        const ud: any = uSnap.data() || {}
        const currentCity = String(ud?.currentCity || '').trim()
        // Coords natais (fallback quando não há cidade atual ou o geocode falha).
        // No doc de users o birthLocation fica no TOPO (não sob birthData).
        const natalLoc = ud?.birthLocation || ud?.birthData?.birthLocation
        const natalCoords = (natalLoc && Number.isFinite(natalLoc.latitude) && Number.isFinite(natalLoc.longitude))
          ? { latitude: natalLoc.latitude, longitude: natalLoc.longitude }
          : null

        let coords: { latitude: number; longitude: number } | null = null
        let relocated = false // true = calculado na cidade atual; false = no nascimento
        // Preferência: currentLocation já tem coords geocodadas (seleção no perfil) →
        // sem geocode em runtime, não trava. Legado (só string currentCity) → geocoda.
        const cl = ud?.currentLocation
        if (cl && Number.isFinite(cl.latitude) && Number.isFinite(cl.longitude)) {
          coords = { latitude: cl.latitude, longitude: cl.longitude }
          relocated = true
        } else if (currentCity) {
          try {
            const LocationService = (await import('../../services/LocationService')).default
            const results = await withTimeout(LocationService.searchLocations(currentCity), 8000)
            const loc: any = results?.[0]
            if (loc && Number.isFinite(loc.latitude) && Number.isFinite(loc.longitude)) {
              coords = { latitude: loc.latitude, longitude: loc.longitude }
              relocated = true
            }
          } catch (e) { console.warn('[SR] geocode falhou, usando fallback natal:', e) }
        }
        // Sem cidade preenchida E sem coords natais → pede a cidade. Senão, calcula
        // (relocado na cidade, ou no local de nascimento como fallback seguro).
        if (!coords) coords = natalCoords
        if (!coords) { if (!cancelled) setSrNeedsCity(true); return }

        const { LocalAstrologyService } = await import('../../services/astrology/LocalAstrologyService')
        const { data, moment } = await withTimeout(
          LocalAstrologyService.computeSolarReturn(natalSunLon, coords),
          20000,
        )
        if (!cancelled) { setSrData(data); setSrMoment(moment); setSrAtBirth(!relocated) }
      } catch (e) {
        console.warn('[SR] erro ao calcular Retorno Solar:', e)
        if (!cancelled) { setSrError(true); srRunRef.current = false } // permite retry
      } finally { if (!cancelled) setSrLoading(false) }
    })()
    return () => { cancelled = true }
  }, [westMode, isPremium, srSunLon, user?.uid])

  // Retorno Lunar — mesma lógica do RS (Lua natal + coords atuais/nascimento).
  const lrMoonLon = useMemo(() => {
    const m = (natalPlanets as any[]).find((p) => p?.name === 'Moon')
    return typeof m?.longitude === 'number' ? m.longitude : null
  }, [natalPlanets])
  const lrRunRef = useRef(false)
  useEffect(() => {
    if (westMode !== 'lunar') return
    if (!isPremium || lrMoonLon == null || !user?.uid) return
    if (lrRunRef.current) return
    lrRunRef.current = true
    const natalMoonLon = lrMoonLon
    let cancelled = false
    const withTimeout = <T,>(p: Promise<T>, ms: number): Promise<T> =>
      Promise.race([p, new Promise<T>((_, rej) => setTimeout(() => rej(new Error('timeout')), ms))])
    ;(async () => {
      setLrLoading(true); setLrError(false); setLrNeedsCity(false)
      try {
        const uSnap = await getDoc(doc(db, 'users', user.uid))
        const ud: any = uSnap.data() || {}
        const currentCity = String(ud?.currentCity || '').trim()
        const natalLoc = ud?.birthLocation || ud?.birthData?.birthLocation
        const natalCoords = (natalLoc && Number.isFinite(natalLoc.latitude) && Number.isFinite(natalLoc.longitude))
          ? { latitude: natalLoc.latitude, longitude: natalLoc.longitude } : null
        let coords: { latitude: number; longitude: number } | null = null
        let relocated = false
        const cl = ud?.currentLocation
        if (cl && Number.isFinite(cl.latitude) && Number.isFinite(cl.longitude)) {
          coords = { latitude: cl.latitude, longitude: cl.longitude }; relocated = true
        } else if (currentCity) {
          try {
            const LocationService = (await import('../../services/LocationService')).default
            const results = await withTimeout(LocationService.searchLocations(currentCity), 8000)
            const loc: any = results?.[0]
            if (loc && Number.isFinite(loc.latitude) && Number.isFinite(loc.longitude)) {
              coords = { latitude: loc.latitude, longitude: loc.longitude }; relocated = true
            }
          } catch (e) { console.warn('[LR] geocode falhou:', e) }
        }
        if (!coords) coords = natalCoords
        if (!coords) { if (!cancelled) setLrNeedsCity(true); return }
        const { LocalAstrologyService } = await import('../../services/astrology/LocalAstrologyService')
        const { data, moment } = await withTimeout(LocalAstrologyService.computeLunarReturn(natalMoonLon, coords), 20000)
        if (!cancelled) { setLrData(data); setLrMoment(moment); setLrAtBirth(!relocated) }
      } catch (e) {
        console.warn('[LR] erro ao calcular Retorno Lunar:', e)
        if (!cancelled) { setLrError(true); lrRunRef.current = false }
      } finally { if (!cancelled) setLrLoading(false) }
    })()
    return () => { cancelled = true }
  }, [westMode, isPremium, lrMoonLon, user?.uid])

  const tl = (pt: string, en: string, es: string, it: string) => {
    if (language === 'en-US') return en
    if (language === 'es-ES') return es
    if (language === 'it-IT') return it
    return pt
  }

  const cardTitle = (f: FeatureCard) => tl(f.titlePt, f.titleEn, f.titleEs, f.titleIt)
  const cardDesc = (f: FeatureCard) => tl(f.descPt, f.descEn, f.descEs, f.descIt)

  // Tour guiado da aba Mapa — percorre cada parte, trocando o modo sozinho (onEnter).
  const buildCosmosTour = useCallback(() => ([
    { id: 'cosmos.system', title: tl('Ocidental ou Védico', 'Western or Vedic', 'Occidental o Vedico', 'Occidentale o Vedico'),
      body: tl('Aqui você alterna entre a astrologia ocidental e a védica (indiana). Vamos começar pela ocidental.', 'Here you switch between Western and Vedic (Indian) astrology. Let\'s start with Western.', 'Aqui cambias entre astrologia occidental y vedica (india). Empecemos por la occidental.', 'Qui passi tra astrologia occidentale e vedica (indiana). Iniziamo dall\'occidentale.'),
      onEnter: () => { setMapMode('western') } },
    { id: 'cosmos.modes', title: tl('Escolha a visão', 'Choose the view', 'Elige la vista', 'Scegli la vista'),
      body: tl('Nesta barra você escolhe Natal, Trânsitos, Retorno Solar ou Retorno Lunar. Vamos passar por cada uma.', 'On this bar you pick Natal, Transits, Solar or Lunar Return. Let\'s go through each.', 'En esta barra eliges Natal, Transitos, Retorno Solar o Lunar. Vamos a ver cada una.', 'In questa barra scegli Natale, Transiti, Ritorno Solare o Lunare. Vediamole una a una.'),
      onEnter: () => { setMapMode('western') } },
    { id: 'cosmos.wheel', title: tl('Mapa Natal', 'Natal Chart', 'Carta Natal', 'Carta Natale'),
      body: tl('Sua roda de nascimento: planetas, casas e aspectos. Toque em qualquer aspecto (linhas no centro) OU numa célula da grade de aspectos para ler a interpretação. Pontos como Lilith, nódulos e a Parte da Fortuna também estão aqui.', 'Your birth wheel: planets, houses and aspects. Tap any aspect (center lines) OR a cell in the aspect grid to read the interpretation. Points like Lilith, nodes and Part of Fortune are here too.', 'Tu rueda de nacimiento: planetas, casas y aspectos. Toca cualquier aspecto (lineas del centro) O una celda de la grilla de aspectos para leer la interpretacion. Puntos como Lilith, nodos y la Parte de la Fortuna tambien estan aqui.', 'La tua ruota di nascita: pianeti, case e aspetti. Tocca un aspetto (linee al centro) O una cella della griglia per leggere l\'interpretazione. Punti come Lilith, nodi e la Parte della Fortuna sono qui.'),
      onEnter: () => { setMapMode('western'); setWestMode('natal') } },
    { id: 'cosmos.wheel', title: tl('Trânsitos do dia', 'Daily transits', 'Transitos del dia', 'Transiti del giorno'),
      body: tl('A bi-roda dos trânsitos de agora sobre o seu natal, com a grade de aspectos. Toque num aspecto na roda ou numa célula da grade para a leitura daquele trânsito.', 'The bi-wheel of current transits over your natal, with the aspect grid. Tap an aspect on the wheel or a grid cell for that transit\'s reading.', 'La bi-rueda de los transitos de ahora sobre tu natal, con la grilla. Toca un aspecto en la rueda o una celda para la lectura de ese transito.', 'La doppia ruota dei transiti attuali sul natale, con la griglia. Tocca un aspetto sulla ruota o una cella per la lettura di quel transito.'),
      onEnter: () => { setMapMode('western'); setWestMode('transitos') } },
    { id: 'cosmos.modes', title: tl('Retorno Solar', 'Solar Return', 'Retorno Solar', 'Ritorno Solare'),
      body: tl('Toque em "Solar" para o mapa do seu ano astrológico, a partir do aniversário — com a data e a hora exatas do retorno. Recurso para assinantes.', 'Tap "Solar" for your astrological year chart, from your birthday — with the exact date and time of the return. A subscriber feature.', 'Toca "Solar" para el mapa de tu ano astrologico, desde el cumpleanos — con la fecha y hora exactas del retorno. Funcion para suscriptores.', 'Tocca "Solar" per la mappa del tuo anno astrologico, dal compleanno — con data e ora esatte del ritorno. Funzione per abbonati.'),
      onEnter: () => { setMapMode('western'); setWestMode('solar') } },
    { id: 'cosmos.modes', title: tl('Retorno Lunar', 'Lunar Return', 'Retorno Lunar', 'Ritorno Lunare'),
      body: tl('Toque em "Lunar" para o mapa do mês, quando a Lua volta ao ponto de nascimento — com a data e a hora exatas. Tema do ciclo mensal.', 'Tap "Lunar" for the month chart, when the Moon returns to your birth point — with the exact date and time. The monthly cycle theme.', 'Toca "Lunar" para el mapa del mes, cuando la Luna vuelve a tu punto de nacimiento — con fecha y hora exactas. El tema del ciclo mensual.', 'Tocca "Lunar" per la mappa del mese, quando la Luna torna al punto di nascita — con data e ora esatte. Il tema del ciclo mensile.'),
      onEnter: () => { setMapMode('western'); setWestMode('lunar') } },
    { id: 'cosmos.system', title: tl('Mapa Védico', 'Vedic Chart', 'Carta Vedica', 'Carta Vedica'),
      body: tl('Toque em "Védico" para ver seu mapa no sistema indiano (sideral): signos, casas e o Guna. Uma outra lente sobre o mesmo céu.', 'Tap "Vedic" to see your chart in the Indian (sidereal) system: signs, houses and Guna. Another lens on the same sky.', 'Toca "Vedico" para ver tu carta en el sistema indio (sideral): signos, casas y Guna. Otra lente sobre el mismo cielo.', 'Tocca "Vedico" per la tua carta nel sistema indiano (siderale): segni, case e Guna. Un\'altra lente sullo stesso cielo.'),
      onEnter: () => { setMapMode('vedic') },
      onExit: () => { if (!TZOLKIN_ENABLED) { setMapMode('western'); setWestMode('natal') } } },
    ...(TZOLKIN_ENABLED ? [{
      id: 'cosmos.system', title: tl('Tzolkin — 13 Luas', 'Tzolkin — 13 Moons', 'Tzolkin — 13 Lunas', 'Tzolkin — 13 Lune'),
      body: tl('Toque em "Tzolkin" para seu Kin do Sincronário das 13 Luas: selo, tom, Oráculo da Quinta Força, Onda Encantada e o Kin do dia. Uma leitura simbólica inspirada no Tzolk\'in maia (não é o calendário maia tradicional).', 'Tap "Tzolkin" for your 13-Moon Kin: seal, tone, Fifth Force Oracle, Wavespell and the Kin of the day. A symbolic reading inspired by the Maya Tzolk\'in (not the traditional Maya calendar).', 'Toca "Tzolkin" para tu Kin del Sincronario de 13 Lunas: sello, tono, Oraculo de la Quinta Fuerza, Onda Encantada y el Kin del dia. Una lectura simbolica inspirada en el Tzolkin maya (no es el calendario maya tradicional).', 'Tocca "Tzolkin" per il tuo Kin delle 13 Lune: sigillo, tono, Oracolo della Quinta Forza, Onda Incantata e il Kin del giorno. Una lettura simbolica ispirata al Tzolk\'in maya (non e il calendario maya tradizionale).'),
      onEnter: () => { setMapMode('tzolkin') },
      onExit: () => { if (!CHINESE_ENABLED) { setMapMode('western'); setWestMode('natal') } },
    }] : []),
    ...(CHINESE_ENABLED ? [{
      id: 'cosmos.system', title: tl('Chinês — BaZi', 'Chinese — BaZi', 'Chino — BaZi', 'Cinese — BaZi'),
      body: tl('Toque em "Chinês" para seu BaZi (Quatro Pilares): signo animal, Day Master, os quatro pilares, Cinco Elementos e Dez Deuses. O núcleo é o Day Master, não só o animal.', 'Tap "Chinese" for your BaZi (Four Pillars): animal sign, Day Master, the four pillars, Five Elements and Ten Gods. The core is the Day Master, not just the animal.', 'Toca "Chino" para tu BaZi (Cuatro Pilares): signo animal, Day Master, los cuatro pilares, Cinco Elementos y Diez Dioses. El nucleo es el Day Master, no solo el animal.', 'Tocca "Cinese" per il tuo BaZi (Quattro Pilastri): segno animale, Day Master, i quattro pilastri, Cinque Elementi e Dieci Dei. Il nucleo e il Day Master, non solo l animale.'),
      onEnter: () => { setMapMode('chinese') },
      onExit: () => { setMapMode('western'); setWestMode('natal') },
    }] : []),
  ]), [language]) // eslint-disable-line react-hooks/exhaustive-deps
  // v3: reabre uma vez após incluir Tzolkin e Chinês no tour.
  const { openTour: openCosmosTour } = useTabTour('tour_seen_cosmos_v3', 'Cosmos', buildCosmosTour)

  const handleCardPress = (f: FeatureCard) => {
    // "Em breve" tem prioridade: não leva ao paywall (a feature ainda não existe).
    if (!f.available) return
    if (f.premium && !isPremium) {
      ;(navigation as any).navigate('Premium')
      return
    }
    ;(navigation as any).navigate(f.screen)
  }

  const renderCard = (f: FeatureCard) => {
    const locked = f.premium && !isPremium
    const unavailable = f.available === false
    return (
      <TouchableOpacity
        key={f.key}
        style={[styles.card, (locked || unavailable) && styles.cardLocked]}
        activeOpacity={0.78}
        onPress={() => handleCardPress(f)}
      >
        <View style={styles.cardIconWrap}>
          <Ionicons name={f.icon} size={26} color={locked || unavailable ? '#555' : '#FFD700'} />
        </View>
        <View style={styles.cardBody}>
          <Text style={[styles.cardTitle, (locked || unavailable) && styles.cardTitleLocked]} numberOfLines={1}>
            {cardTitle(f)}
          </Text>
          <Text style={[styles.cardDesc, (locked || unavailable) && styles.cardDescLocked]} numberOfLines={2}>
            {cardDesc(f)}
          </Text>
        </View>
        {unavailable ? (
          <View style={styles.soonBadge}>
            <Text style={styles.soonText}>{tl('Em breve', 'Coming soon', 'Proximamente', 'In arrivo')}</Text>
          </View>
        ) : locked ? (
          <Ionicons name="lock-closed" size={16} color="#555" style={styles.cardLockIcon} />
        ) : (
          <Ionicons name="chevron-forward" size={16} color="#FFD700" style={styles.cardLockIcon} />
        )}
      </TouchableOpacity>
    )
  }

  return (
    <LinearGradient colors={['#0F0F23', '#1A1A3A']} style={styles.container}>
      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={Platform.OS === 'web'}
        scrollEnabled={true}
        keyboardShouldPersistTaps="handled"
        scrollEventThrottle={16}
        onScroll={(e) => setShowTop(e.nativeEvent.contentOffset.y > SCROLL_TOP_THRESHOLD)}
      >
        {/* Hero */}
        <View style={styles.hero}>
          <TouchableOpacity onPress={openCosmosTour} style={{ position: 'absolute', top: 4, right: 12, padding: 6, zIndex: 2 }} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="help-circle-outline" size={22} color="#FFD700" />
          </TouchableOpacity>
          {/* Trio Sol/Lua/Asc + subtítulo removidos: já vivem no Home; aqui eram
              redundantes e roubavam espaço do próprio Mapa (pedido João). */}
          <Text style={styles.heroTitle}>✦ {tl('Mapa', 'Chart', 'Mapa', 'Mappa')}</Text>
        </View>

        {/* Mapa natal e Perfil completo embutidos: a aba se chama "Mapa" e agora
            entrega o conteúdo de cara, sem exigir dois toques. O hook roda UMA vez
            aqui e os dados descem por prop (useLifeAreas não é contexto). */}
        {/* Legenda desligada: o Perfil logo abaixo já mostra cada planeta com signo,
            grau, casa, aspectos e regências. Na tela /mapa standalone ela continua. */}

        {/* Toggle Ocidental ↔ Védico — troca a visão do Mapa (só desta aba). */}
        <View style={styles.modeToggle} {...aSystem}>
          <TouchableOpacity style={[styles.modeBtn, mapMode === 'western' && styles.modeBtnActive]} activeOpacity={0.85} onPress={() => setMapMode('western')}>
            <Text style={[styles.modeBtnText, mapMode === 'western' && styles.modeBtnTextActive]}>{tl('Ocidental', 'Western', 'Occidental', 'Occidentale')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.modeBtn, mapMode === 'vedic' && styles.modeBtnActive]} activeOpacity={0.85} onPress={() => setMapMode('vedic')}>
            <Text style={[styles.modeBtnText, mapMode === 'vedic' && styles.modeBtnTextActive]}>{tl('Védico', 'Vedic', 'Védico', 'Vedico')}</Text>
          </TouchableOpacity>
          {TZOLKIN_ENABLED && (
            <TouchableOpacity style={[styles.modeBtn, mapMode === 'tzolkin' && styles.modeBtnActive]} activeOpacity={0.85} onPress={() => setMapMode('tzolkin')}>
              <Text style={[styles.modeBtnText, mapMode === 'tzolkin' && styles.modeBtnTextActive]}>Tzolkin</Text>
            </TouchableOpacity>
          )}
          {CHINESE_ENABLED && (
            <TouchableOpacity style={[styles.modeBtn, mapMode === 'chinese' && styles.modeBtnActive]} activeOpacity={0.85} onPress={() => setMapMode('chinese')}>
              <Text style={[styles.modeBtnText, mapMode === 'chinese' && styles.modeBtnTextActive]}>{tl('Chinês', 'Chinese', 'Chino', 'Cinese')}</Text>
            </TouchableOpacity>
          )}
        </View>

        {mapMode === 'vedic' ? (
          <VedicProfileContent transitData={transitData} loading={loading} natalAscDeg={natalAscDeg} />
        ) : mapMode === 'tzolkin' ? (
          <TzolkinProfileContent />
        ) : mapMode === 'chinese' ? (
          <ChineseProfileContent />
        ) : (
          <>
            {/* Sub-toggle: roda natal pura vs bi-roda (trânsitos de agora sobre o natal). */}
            <View style={styles.modeToggle} {...aModes}>
              <TouchableOpacity style={[styles.modeBtn, westMode === 'natal' && styles.modeBtnActive]} activeOpacity={0.85} onPress={() => setWestMode('natal')}>
                <Text style={[styles.modeBtnText, westMode === 'natal' && styles.modeBtnTextActive]}>{tl('Natal', 'Natal', 'Natal', 'Natale')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modeBtn, westMode === 'transitos' && styles.modeBtnActive]} activeOpacity={0.85} onPress={() => setWestMode('transitos')}>
                <Text style={[styles.modeBtnText, westMode === 'transitos' && styles.modeBtnTextActive]}>{tl('Trânsitos', 'Transits', 'Tránsitos', 'Transiti')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modeBtn, westMode === 'solar' && styles.modeBtnActive]} activeOpacity={0.85} onPress={() => setWestMode('solar')}>
                <Text style={[styles.modeBtnText, westMode === 'solar' && styles.modeBtnTextActive]}>{tl('Solar', 'Solar', 'Solar', 'Solare')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modeBtn, westMode === 'lunar' && styles.modeBtnActive]} activeOpacity={0.85} onPress={() => setWestMode('lunar')}>
                <Text style={[styles.modeBtnText, westMode === 'lunar' && styles.modeBtnTextActive]}>{tl('Lunar', 'Lunar', 'Lunar', 'Lunare')}</Text>
              </TouchableOpacity>
            </View>

            {westMode === 'solar' ? (
              !isPremium ? (
                <TouchableOpacity style={styles.srLocked} activeOpacity={0.9} onPress={() => (navigation as any).navigate('Premium', { openTab: 'features' })}>
                  <Text style={styles.srLockedTitle}>{tl('Retorno Solar', 'Solar Return', 'Retorno Solar', 'Ritorno Solare')}</Text>
                  <Text style={styles.srLockedBody}>{tl('O mapa do seu ano astrológico — roda, grade e interpretações. Disponível para assinantes.', 'Your astrological year chart — wheel, grid and readings. For subscribers.', 'El mapa de tu año astrológico — rueda, rejilla e interpretaciones. Para suscriptores.', 'La mappa del tuo anno astrologico — ruota, griglia e letture. Per abbonati.')}</Text>
                  <View style={styles.srLockedCta}><Text style={styles.srLockedCtaText}>{tl('Ver planos', 'See plans', 'Ver planes', 'Vedi i piani')}</Text></View>
                </TouchableOpacity>
              ) : srNeedsCity ? (
                <View style={styles.srNotice}>
                  <Text style={styles.srNoticeTitle}>{tl('Onde você mora?', 'Where do you live?', '¿Dónde vives?', 'Dove vivi?')}</Text>
                  <Text style={styles.srNoticeBody}>{tl('O Retorno Solar é calculado no lugar onde você está no aniversário. Preencha sua cidade atual no perfil.', 'The Solar Return is cast where you are on your birthday. Set your current city in the profile.', 'El Retorno Solar se calcula donde estás en tu cumpleaños. Completa tu ciudad actual en el perfil.', 'Il Ritorno Solare si calcola dove sei al compleanno. Inserisci la tua città attuale nel profilo.')}</Text>
                  <TouchableOpacity style={styles.srNoticeCta} onPress={() => (navigation as any).navigate('Tabs', { screen: 'Home' })}><Text style={styles.srNoticeCtaText}>{tl('Editar perfil', 'Edit profile', 'Editar perfil', 'Modifica profilo')}</Text></TouchableOpacity>
                </View>
              ) : srError ? (
                <View style={styles.srCenter}><Text style={styles.srLoadingText}>{tl('Não consegui calcular agora. Tente de novo.', 'Could not calculate now. Try again.', 'No pude calcular ahora. Intenta de nuevo.', 'Non sono riuscito a calcolare. Riprova.')}</Text></View>
              ) : srLoading || !srData ? (
                <View style={styles.srCenter}><StarLoader /><Text style={styles.srLoadingText}>{tl('Calculando seu Retorno Solar…', 'Calculating your Solar Return…', 'Calculando tu Retorno Solar…', 'Calcolo del tuo Ritorno Solare…')}</Text></View>
              ) : (
                <>
                  {srMoment ? (
                    <Text style={styles.srCaption}>{tl(
                      `Retorno Solar de ${srMoment.getUTCFullYear()} · exato em ${fmtReturnMoment(srMoment, 'pt-BR', 'às')}`,
                      `Solar Return ${srMoment.getUTCFullYear()} · exact on ${fmtReturnMoment(srMoment, 'en-US', 'at')}`,
                      `Retorno Solar ${srMoment.getUTCFullYear()} · exacto el ${fmtReturnMoment(srMoment, 'es-ES', 'a las')}`,
                      `Ritorno Solare ${srMoment.getUTCFullYear()} · esatto il ${fmtReturnMoment(srMoment, 'it-IT', 'alle')}`,
                    )}</Text>
                  ) : null}
                  {srAtBirth ? (
                    <TouchableOpacity style={styles.srBirthBanner} activeOpacity={0.85} onPress={() => (navigation as any).navigate('Tabs', { screen: 'Settings' })}>
                      <Text style={styles.srBirthBannerText}>{tl(
                        'Calculado no seu local de nascimento. Preencha a cidade onde mora hoje nas Configurações para o Retorno Solar relocado.',
                        'Cast at your birthplace. Set the city where you live now in Settings for the relocated Solar Return.',
                        'Calculado en tu lugar de nacimiento. Completa la ciudad donde vives hoy en Configuración para el Retorno Solar relocalizado.',
                        'Calcolato nel tuo luogo di nascita. Inserisci la citta dove vivi oggi nelle Impostazioni per il Ritorno Solare rilocato.',
                      )}</Text>
                    </TouchableOpacity>
                  ) : null}
                  <NatalChartWheelContent transitData={srData} loading={false} showLegend={false} chartMeta={{ skipSelfFetch: true }} />
                  <AstroProfileContent transitData={srData} loading={false} chartMeta={{ skipSelfFetch: true }} interpMode="solar" />
                </>
              )
            ) : westMode === 'lunar' ? (
              !isPremium ? (
                <TouchableOpacity style={styles.srLocked} activeOpacity={0.9} onPress={() => (navigation as any).navigate('Premium', { openTab: 'features' })}>
                  <Text style={styles.srLockedTitle}>{tl('Retorno Lunar', 'Lunar Return', 'Retorno Lunar', 'Ritorno Lunare')}</Text>
                  <Text style={styles.srLockedBody}>{tl('O mapa do seu mês astrológico — roda, grade e interpretações. Disponível para assinantes.', 'Your astrological month chart — wheel, grid and readings. For subscribers.', 'El mapa de tu mes astrológico — rueda, rejilla e interpretaciones. Para suscriptores.', 'La mappa del tuo mese astrologico — ruota, griglia e letture. Per abbonati.')}</Text>
                  <View style={styles.srLockedCta}><Text style={styles.srLockedCtaText}>{tl('Ver planos', 'See plans', 'Ver planes', 'Vedi i piani')}</Text></View>
                </TouchableOpacity>
              ) : lrNeedsCity ? (
                <View style={styles.srNotice}>
                  <Text style={styles.srNoticeTitle}>{tl('Onde você mora?', 'Where do you live?', '¿Dónde vives?', 'Dove vivi?')}</Text>
                  <Text style={styles.srNoticeBody}>{tl('O Retorno Lunar é calculado no lugar onde você está. Preencha sua cidade atual no perfil.', 'The Lunar Return is cast where you are. Set your current city in the profile.', 'El Retorno Lunar se calcula donde estás. Completa tu ciudad actual en el perfil.', 'Il Ritorno Lunare si calcola dove sei. Inserisci la tua città attuale nel profilo.')}</Text>
                  <TouchableOpacity style={styles.srNoticeCta} onPress={() => (navigation as any).navigate('Tabs', { screen: 'Settings' })}><Text style={styles.srNoticeCtaText}>{tl('Editar perfil', 'Edit profile', 'Editar perfil', 'Modifica profilo')}</Text></TouchableOpacity>
                </View>
              ) : lrError ? (
                <View style={styles.srCenter}><Text style={styles.srLoadingText}>{tl('Não consegui calcular agora. Tente de novo.', 'Could not calculate now. Try again.', 'No pude calcular ahora. Intenta de nuevo.', 'Non sono riuscito a calcolare. Riprova.')}</Text></View>
              ) : lrLoading || !lrData ? (
                <View style={styles.srCenter}><StarLoader /><Text style={styles.srLoadingText}>{tl('Calculando seu Retorno Lunar…', 'Calculating your Lunar Return…', 'Calculando tu Retorno Lunar…', 'Calcolo del tuo Ritorno Lunare…')}</Text></View>
              ) : (
                <>
                  {lrMoment ? (
                    <Text style={styles.srCaption}>{tl(
                      `Retorno Lunar · exato em ${fmtReturnMoment(lrMoment, 'pt-BR', 'às')}`,
                      `Lunar Return · exact on ${fmtReturnMoment(lrMoment, 'en-US', 'at')}`,
                      `Retorno Lunar · exacto el ${fmtReturnMoment(lrMoment, 'es-ES', 'a las')}`,
                      `Ritorno Lunare · esatto il ${fmtReturnMoment(lrMoment, 'it-IT', 'alle')}`,
                    )}</Text>
                  ) : null}
                  {lrAtBirth ? (
                    <TouchableOpacity style={styles.srBirthBanner} activeOpacity={0.85} onPress={() => (navigation as any).navigate('Tabs', { screen: 'Settings' })}>
                      <Text style={styles.srBirthBannerText}>{tl(
                        'Calculado no seu local de nascimento. Preencha a cidade onde mora hoje nas Configurações para o Retorno Lunar relocado.',
                        'Cast at your birthplace. Set the city where you live now in Settings for the relocated Lunar Return.',
                        'Calculado en tu lugar de nacimiento. Completa la ciudad donde vives hoy en Configuración para el Retorno Lunar relocalizado.',
                        'Calcolato nel tuo luogo di nascita. Inserisci la citta dove vivi oggi nelle Impostazioni per il Ritorno Lunare rilocato.',
                      )}</Text>
                    </TouchableOpacity>
                  ) : null}
                  <NatalChartWheelContent transitData={lrData} loading={false} showLegend={false} chartMeta={{ skipSelfFetch: true }} />
                  <AstroProfileContent transitData={lrData} loading={false} chartMeta={{ skipSelfFetch: true }} interpMode="lunar" />
                </>
              )
            ) : (
            <>
            <View {...aWheel}>
            <NatalChartWheelContent transitData={transitData} loading={loading} showLegend={false} showTransits={westMode === 'transitos'} onSelectTransitAspect={handleSelectTransitAspect} onSelectNatalAspect={handleSelectNatalAspect} onOpenTransits={() => (navigation as any).navigate('PersonalTransits')} />
            </View>

            {westMode === 'transitos' ? (
              <>
                {/* Leitura dos trânsitos na MESMA página (embutida, sem navegar). */}
                <PersonalTransitsScreen embedded highlightId={txHighlight} />
              </>
            ) : (
              <>
                {/* Navegação: chips das seções acima, fita de planetas abaixo (mesma da Home) */}
                <View style={styles.navBar}>
                  <View style={styles.navChips}>
                    {SECTION_CHIPS.map((c) => (
                      <TouchableOpacity
                        key={c.key}
                        style={styles.navChip}
                        activeOpacity={0.8}
                        onPress={() => scrollToAnchor(c.key)}
                      >
                        <Text style={styles.navChipText}>{tl(c.pt, c.en, c.es, c.it)}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <PlanetQuickNav
                    onSelectPlanet={(planet) => scrollToAnchor(`planet:${planet}`)}
                    showCosmosEntry={false}
                  />
                </View>

                <AstroProfileContent transitData={transitData} loading={loading} registerAnchor={registerAnchor} />
              </>
            )}
            </>
            )}
          </>
        )}
      </ScrollView>
      <ScrollTopButton
        visible={showTop}
        onPress={() => (scrollRef.current as any)?.scrollTo({ y: 0, animated: true })}
      />
      <ShareCardModal visible={shareOpen} onClose={() => setShareOpen(false)} data={shareData} tl={tl} />
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  // minHeight:0 permite o ScrollView encolher e rolar no web (flexbox);
  // sem isso o conteúdo empurra o container e a tela fica estática.
  // Sem overflow:hidden — no react-native-web ele CORTA o conteúdo (a tela fica
  // estática, o ScrollView interno não rola). As outras telas do RootStack não
  // usam overflow:hidden e rolam normal. minHeight:0 basta para o flex encolher.
  container: { flex: 1, minHeight: 0 },
  navBar: {
    paddingTop: 4,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  modeToggle: {
    flexDirection: 'row',
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 22,
    padding: 3,
    marginTop: 4,
    marginBottom: 10,
  },
  modeBtn: {
    paddingHorizontal: 22,
    paddingVertical: 7,
    borderRadius: 20,
  },
  modeBtnActive: {
    backgroundColor: '#FFD700',
  },
  modeBtnText: {
    color: '#8892a4',
    fontSize: 13,
    fontWeight: '700',
  },
  modeBtnTextActive: {
    color: '#1A1A1A',
  },
  srCaption: { color: '#FFD700', fontSize: 12.5, fontWeight: '700', textAlign: 'center', marginBottom: 10, marginTop: 2 },
  shareCta: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'center', marginTop: 10, paddingHorizontal: 14, paddingVertical: 7, borderRadius: 18, borderWidth: 1, borderColor: 'rgba(255,215,0,0.4)', backgroundColor: 'rgba(255,215,0,0.08)' },
  shareCtaText: { color: '#FFD700', fontSize: 12.5, fontWeight: '700' },
  srBirthBanner: { backgroundColor: 'rgba(255,215,0,0.10)', borderWidth: 1, borderColor: 'rgba(255,215,0,0.35)', borderRadius: 12, paddingVertical: 10, paddingHorizontal: 12, marginBottom: 12 },
  srBirthBannerText: { color: '#E9D9A0', fontSize: 12.5, lineHeight: 18, textAlign: 'center' },
  srCenter: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40, gap: 12 },
  srLoadingText: { color: '#9A9CB8', fontSize: 14, textAlign: 'center' },
  srLocked: { backgroundColor: 'rgba(255,215,0,0.06)', borderWidth: 1, borderColor: 'rgba(255,215,0,0.3)', borderRadius: 18, padding: 22, marginTop: 8, alignItems: 'center' },
  srLockedTitle: { color: '#EDEBF7', fontSize: 20, fontWeight: '800' },
  srLockedBody: { color: '#9A9CB8', fontSize: 13.5, textAlign: 'center', lineHeight: 20, marginTop: 8 },
  srLockedCta: { backgroundColor: '#FFD700', borderRadius: 12, paddingHorizontal: 24, paddingVertical: 12, marginTop: 16 },
  srLockedCtaText: { color: '#1a1405', fontWeight: '800', fontSize: 15 },
  srNotice: { backgroundColor: '#161728', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', borderRadius: 18, padding: 22, marginTop: 8, alignItems: 'center' },
  srNoticeTitle: { color: '#EDEBF7', fontSize: 18, fontWeight: '800' },
  srNoticeBody: { color: '#9A9CB8', fontSize: 13.5, textAlign: 'center', lineHeight: 20, marginTop: 8 },
  srNoticeCta: { backgroundColor: '#FFD700', borderRadius: 12, paddingHorizontal: 22, paddingVertical: 11, marginTop: 16 },
  srNoticeCtaText: { color: '#1a1405', fontWeight: '800', fontSize: 14 },
  transitHint: {
    color: '#8892a4',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 17,
    paddingHorizontal: 24,
    marginTop: 6,
  },
  transitCta: {
    alignSelf: 'center',
    marginTop: 14,
    marginBottom: 6,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(110,231,231,0.4)',
    backgroundColor: 'rgba(110,231,231,0.08)',
  },
  transitCtaText: {
    color: '#6EE7E7',
    fontSize: 14,
    fontWeight: '700',
  },
  navChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  navChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.35)',
    backgroundColor: 'rgba(255,215,0,0.08)',
  },
  navChipText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '600',
  },
  scroll: { flex: 1, minHeight: 0 },
  scrollContent: { paddingBottom: 40 },

  hero: {
    alignItems: 'center',
    paddingTop: 28,
    paddingBottom: 20,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,215,0,0.12)',
  },
  astroMapEntry: { flexDirection: 'row', alignItems: 'center', gap: 10, marginHorizontal: 16, marginBottom: 10, backgroundColor: '#171733', borderRadius: 14, borderWidth: 1, borderColor: 'rgba(255,215,0,0.3)', paddingVertical: 12, paddingHorizontal: 14 },
  astroMapTitle: { color: '#FFD700', fontSize: 15, fontWeight: '900' },
  astroMapSub: { color: '#9aa2b8', fontSize: 12.5, marginTop: 1 },
  heroTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFD700',
    letterSpacing: 2,
    marginBottom: 12,
  },
  heroSigns: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  heroSign: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,215,0,0.08)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  heroSignSymbol: {
    fontSize: 11,
    color: '#8892a4',
    marginBottom: 2,
  },
  heroSignText: {
    fontSize: 13,
    color: '#FFD700',
    fontWeight: '600',
  },
  heroSub: {
    fontSize: 13,
    color: '#8892a4',
    marginTop: 4,
  },

  section: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: '#8892a4',
    marginBottom: 12,
  },
  sectionLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  unlockCta: {
    fontSize: 12,
    color: '#FFD700',
    fontWeight: '600',
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#161a22',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#252b38',
    padding: 14,
    marginBottom: 10,
  },
  cardLocked: {
    opacity: 0.55,
  },
  cardIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: 'rgba(255,215,0,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardBody: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: 2,
  },
  cardTitleLocked: {
    color: '#555',
  },
  cardDesc: {
    fontSize: 12,
    color: '#8892a4',
  },
  cardDescLocked: {
    color: '#444',
  },
  cardLockIcon: {
    marginLeft: 8,
  },
  soonBadge: {
    backgroundColor: 'rgba(124,106,247,0.2)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginLeft: 8,
  },
  soonText: {
    fontSize: 10,
    color: '#7c6af7',
    fontWeight: '700',
  },
})
