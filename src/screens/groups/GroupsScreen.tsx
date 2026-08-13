"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Share,
  TextInput,
  Modal,
  RefreshControl,
  Animated,
  PanResponder,
  Dimensions,
  ActivityIndicator,
} from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { LinearGradient } from "expo-linear-gradient"
import * as Linking from "expo-linking"
import { useNavigation, useRoute } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import AddManagedProfileModal from "./AddManagedProfileModal"
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore"
import { useAuth } from "../../hooks/useAuth"
import { useSubscriptionCheck } from "../../hooks/useSubscriptionCheck"
import GroupService, { type Group, type GroupMember, type GroupAlert, type GroupActivity } from "../../services/firebase/GroupService"
import CoupleService, { type CoupleRelationship } from "../../services/firebase/CoupleService"
import GroupNotificationService from "../../services/notifications/GroupNotificationService"
import { useNotificationPreferences } from "../../hooks/useNotificationPreferences"
import GroupDetailModal from "../../components/GroupDetailModal"
import ReadingDetailModal from "../../components/ReadingDetailModal"
import { resolveTransitAphorism } from "../../utils/transitAphorism"
import GroupNotificationSettings from "../../components/GroupNotificationSettings"
import TransitInsightCard from "../../components/TransitInsightCard"
import InviteService from "../../services/InviteService"
import Avatar from "../../components/Avatar"
import ExpiryBanner from "../../components/ExpiryBanner"
import StarLoader from "../../components/StarLoader"
import { db } from "../../config/firebase"
import { getExpiryBannerInfo } from "../../utils/expiry"
import { buildTransitTitle as buildSharedTransitTitle } from "../../utils/transitPresentation"
import { buildUnifiedTransitNarrative } from "../../utils/astroInterpretation"
import { translatePlanet } from "../../utils/astro/pt"
import { computeSynastryAspects, computeNatalChart, type SynastryAspect, type NatalChart } from "../../astro/synastry"
import { synastryScore, synastryAspectLine, synastryHouseOverlays } from "../../astro/synastryReading"
import { gunaMilanBetween } from "../../astro/vedic"
import { resolveGunaMilan, type ResolvedGunaMilan } from "../../utils/vedicInterpretation"

// Sinastria entre dois participantes do grupo (matriz de todas as duplas, fora o viewer).
type PairSynastry = {
  id: string
  aId: string
  bId: string
  aName: string
  bName: string
  aspects: SynastryAspect[]
  guna?: ResolvedGunaMilan
}
import { useAppLanguage } from "../../hooks/useAppLanguage"
import { LIFE_AREA_ORDER as SHARED_LIFE_AREA_ORDER, LIFE_AREA_LABELS as SHARED_LIFE_AREA_LABELS } from "../../constants/lifeAreas"
import { getAxisShortLabel, normalizeAxisScore, STATUS_AXIS_COLORS } from "../../utils/statusAxes"
import { STATUS_THRESHOLDS } from "../../constants/statusThresholds"
import { backendFetch } from "../../services/backend/client"
import { ensureStatusPolicyLoaded, getStatusPolicySnapshot } from "../../services/status/StatusPolicyService"

const LIFE_AREA_OPTIONS = SHARED_LIFE_AREA_ORDER.map((key) => ({
  key,
  label: SHARED_LIFE_AREA_LABELS[key] || key,
}))
const BACKEND_URL = (process.env.EXPO_PUBLIC_BACKEND_URL || "https://tabulav0dev-backend.vercel.app").replace(/\/$/, "")

const LIFE_AREA_KEYS = LIFE_AREA_OPTIONS.map((area) => area.key)
const WINDOW_HEIGHT = Dimensions.get("window").height
const GROUP_MEMBER_MODAL_FILTER_PREFS_KEY = "groups_member_modal_filter_prefs_v1"

const LIFE_AREA_LABELS = LIFE_AREA_OPTIONS.reduce((acc, area) => {
  acc[area.key] = area.label
  return acc
}, {} as Record<string, string>)

const LIFE_AREA_COLORS: Record<string, string[]> = {
  amor: ["#FF6B9D", "#FF8E8E"],
  carreira: ["#4ECDC4", "#44A08D"],
  financas: ["#FFD93D", "#FF9F40"],
  saude: ["#96E6A1", "#7BC142"],
  familia: ["#FF9F40", "#FFD93D"],
  espiritualidade: ["#B19CD9", "#8B5CF6"],
  comunicacao: ["#60A5FA", "#3B82F6"],
  transformacao: ["#F472B6", "#EC4899"],
}

const AREA_HOUSES: Record<string, number[]> = {
  amor: [5, 7],
  carreira: [10, 6],
  financas: [2, 8],
  saude: [1, 6],
  familia: [4, 10],
  espiritualidade: [9, 12],
  comunicacao: [3, 9],
  transformacao: [8, 12],
}

type MemberTransitFacet = "major" | "minor" | "house"
type MemberTransitTone = "all" | "challenging" | "harmonic"
type MemberTransitSort = "impact" | "recent"
type MemberAreaTransitItem = {
  id: string
  rawTransit: any
  columnKind: "planet" | "house"
  rank: number
  title: string
  houseLabel: string | null
  houseLabelPrefix: string
  technicalTypeLabel: string
  statusLabel: string
  statusColor: string
  timingLabel: string
  directText: string
  fullLines: string[]
  actionText: string
  metaText: string
  impactValue01: number
  keywords: string[]
}

const getTransitSource = (transitLike: any) => transitLike?.rawTransit || transitLike || {}

export default function GroupsScreen() {
  const { t, language } = useAppLanguage()
  const route = useRoute<any>()
  const navigation = useNavigation()
  const { user } = useAuth()
  const { preferences } = useNotificationPreferences()
  const { subscription, trialActive, trialEndsAt, isAdmin } = useSubscriptionCheck()
  const tr = (key: string, fallback: string, vars?: Record<string, string | number>) => {
    const value = t(key, vars)
    return value === key ? fallback : value
  }
  const lifeAreaLabel = (key?: string | null) => {
    const normalized = String(key || '').trim().toLowerCase()
    if (!normalized) return tr('groups.label.areaUnavailable', 'Area indisponivel')
    return tr(`lifeArea.${normalized}`, LIFE_AREA_LABELS[normalized] || normalized)
  }
  const formatLifeAreasLocalized = (areas?: string[]) => {
    if (!areas || areas.length === 0) return tr('groups.label.allAreas', 'Todas as areas')
    return areas.map((area) => lifeAreaLabel(area)).join(', ')
  }

  // Estados para abas
  const [selectedTab, setSelectedTab] = useState<"groups" | "couple">("groups")

  // Estados para grupos
  const [groups, setGroups] = useState<Group[]>([])
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null)
  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([])
  const [groupAlerts, setGroupAlerts] = useState<GroupAlert[]>([])
  const [groupActivities, setGroupActivities] = useState<GroupActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showAddManaged, setShowAddManaged] = useState(false)
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [newGroupName, setNewGroupName] = useState("")
  const [newGroupDescription, setNewGroupDescription] = useState("")
  const [newGroupSharedLifeAreas, setNewGroupSharedLifeAreas] = useState<string[]>(LIFE_AREA_KEYS)
  const [newGroupNotifiedLifeAreas, setNewGroupNotifiedLifeAreas] = useState<string[]>(LIFE_AREA_KEYS)
  const [inviteCode, setInviteCode] = useState("")
  const [invitePreview, setInvitePreview] = useState<Group | null>(null)
  const [invitePreviewLoading, setInvitePreviewLoading] = useState(false)
  const [invitePreviewError, setInvitePreviewError] = useState("")
  const [updatingInvite, setUpdatingInvite] = useState(false)

  // Estados para casais
  const [coupleRelationship, setCoupleRelationship] = useState<CoupleRelationship | null>(null)
  const [coupleLoading, setCoupleLoading] = useState(false)
  const [showCreateCoupleModal, setShowCreateCoupleModal] = useState(false)
  const [partnerEmail, setPartnerEmail] = useState("")
  const [relationshipType, setRelationshipType] = useState<CoupleRelationship['relationshipType']>("dating")

  // Estados para notificacoes de grupo
  const [showMessageModal, setShowMessageModal] = useState(false)
  const [groupMessage, setGroupMessage] = useState("")
  const [sendingNotification, setSendingNotification] = useState(false)

  // Sinastria: aspectos entre o mapa do usuário e o de cada membro (Você × cada membro)
  const [synastryByMember, setSynastryByMember] = useState<Record<string, SynastryAspect[]>>({})
  const [gunaMilanByMember, setGunaMilanByMember] = useState<Record<string, ResolvedGunaMilan>>({})
  const [pairSynastry, setPairSynastry] = useState<PairSynastry[]>([])
  // Cartas natais em cache (viewer + cada membro) — alimentam a sobreposição de casas.
  const [chartByMember, setChartByMember] = useState<Record<string, NatalChart>>({})
  const [synastryLoading, setSynastryLoading] = useState(false)
  const [synastryMineMissing, setSynastryMineMissing] = useState(false)
  // Sinastria: quais leituras estão expandidas (chave = memberId ou pair.id).
  const [expandedSyn, setExpandedSyn] = useState<Set<string>>(new Set())
  const toggleSyn = useCallback((key: string) => {
    setExpandedSyn((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key); else next.add(key)
      return next
    })
  }, [])

  // Estados para modal de detalhes
  const [showGroupDetail, setShowGroupDetail] = useState(false)
  const [selectedGroupForDetail, setSelectedGroupForDetail] = useState<Group | null>(null)
  const [showGroupSettings, setShowGroupSettings] = useState(false)
  const [feedFilter, setFeedFilter] = useState<"all" | "messages" | "alerts">("all")
  const [groupOrder, setGroupOrder] = useState<string[]>([])
  const [groupOrderDraft, setGroupOrderDraft] = useState<string[]>([])
  const [showGroupOrderModal, setShowGroupOrderModal] = useState(false)
  const [showGroupActionsModal, setShowGroupActionsModal] = useState(false)
  const [memberSort, setMemberSort] = useState<"status" | "name" | "recent">("status")
  const [showMemberSortModal, setShowMemberSortModal] = useState(false)
  const [selectedMemberArea, setSelectedMemberArea] = useState<{
    member: GroupMember
    key: string
  } | null>(null)
  const [showMemberAreaModal, setShowMemberAreaModal] = useState(false)
  const [showMemberAreaCalc, setShowMemberAreaCalc] = useState(false)
  const [memberTransitFacetFilters, setMemberTransitFacetFilters] = useState<MemberTransitFacet[]>(["major", "house"])
  const [memberTransitToneFilter, setMemberTransitToneFilter] = useState<MemberTransitTone>("all")
  const [memberTransitSortMode, setMemberTransitSortMode] = useState<MemberTransitSort>("impact")
  const [memberTransitFiltersExpanded, setMemberTransitFiltersExpanded] = useState(false)
  const [memberTransitStrongOnly, setMemberTransitStrongOnly] = useState(false)
  const [memberTransitPrefsLoaded, setMemberTransitPrefsLoaded] = useState(false)
  const [memberStrongThresholdByArea, setMemberStrongThresholdByArea] = useState<Record<string, number>>({})
  const [memberStrongThresholdDefault, setMemberStrongThresholdDefault] = useState(0.6)
  const [selectedMemberTransitDetail, setSelectedMemberTransitDetail] = useState<{
    title: string
    statusLabel: string
    statusColor: string
    timingLabel: string
    directText: string
    fullText: string
    actionText?: string
    metaText?: string
    keywords?: string[]
    epigraph?: string | null
  } | null>(null)
  const focusHandledRef = useRef(false)
  const lastFocusKeyRef = useRef<string | null>(null)
  const lastSelfStatusRefreshAtRef = useRef<number>(0)
  const memberAreaScrollOffsetYRef = useRef(0)
  const memberAreaSwipeY = useRef(new Animated.Value(0)).current
  const memberAreaSwipeClosingRef = useRef(false)
  const memberTransitPrefsStorageKey = selectedMemberArea
    ? `${GROUP_MEMBER_MODAL_FILTER_PREFS_KEY}:${String(user?.uid || "anon")}:${String(selectedMemberArea.key || "unknown")}`
    : null
  const memberAreaStrongThreshold = (() => {
    const areaKey = String(selectedMemberArea?.key || "").trim().toLowerCase()
    const byArea = memberStrongThresholdByArea?.[areaKey]
    const fallback = Number.isFinite(memberStrongThresholdDefault) ? memberStrongThresholdDefault : 0.6
    const raw = Number.isFinite(byArea) ? Number(byArea) : fallback
    return Math.max(0, Math.min(1, raw))
  })()

  const isPremium = isAdmin || trialActive || subscription?.active === true
  const expiryInfo = getExpiryBannerInfo({
    featureLabel: tr('groups.title', 'Grupos'),
    trialActive,
    trialEndsAt: trialEndsAt || subscription?.trialEndsAt || null,
    subscriptionNextBillingDate: subscription?.nextBillingDate || null,
    subscriptionExpiresAt: subscription?.expiresAt || null,
    isPremium,
  })
  const expiryMessage = (() => {
    if (!expiryInfo.show) return ''
    const daysLeft = expiryInfo.daysLeft
    if (typeof daysLeft !== 'number') return expiryInfo.message
    if (daysLeft <= 0) return expiryInfo.message
    return `${expiryInfo.message} (${daysLeft} dias)`
  })()

  const closeMemberAreaModal = () => {
    setShowMemberAreaModal(false)
    setSelectedMemberArea(null)
    setSelectedMemberTransitDetail(null)
    setShowMemberAreaCalc(false)
    setMemberTransitFacetFilters(["major", "house"])
    setMemberTransitToneFilter("all")
    setMemberTransitSortMode("impact")
    setMemberTransitFiltersExpanded(false)
    setMemberTransitStrongOnly(false)
    memberAreaScrollOffsetYRef.current = 0
    memberAreaSwipeY.setValue(0)
    memberAreaSwipeClosingRef.current = false
  }

  useEffect(() => {
    let cancelled = false
    const loadMemberTransitPrefs = async () => {
      if (!memberTransitPrefsStorageKey || !showMemberAreaModal) {
        setMemberTransitPrefsLoaded(false)
        return
      }
      setMemberTransitPrefsLoaded(false)
      try {
        const raw = await AsyncStorage.getItem(memberTransitPrefsStorageKey)
        if (!raw || cancelled) return
        const parsed = JSON.parse(raw || "{}") as {
          facetFilters?: MemberTransitFacet[]
          toneFilter?: MemberTransitTone
          sortMode?: MemberTransitSort
          filtersExpanded?: boolean
          strongOnly?: boolean
        }
        const nextFacetFilters = Array.isArray(parsed.facetFilters)
          ? parsed.facetFilters.filter(
            (value): value is MemberTransitFacet =>
              value === "major" || value === "minor" || value === "house"
          )
          : []
        if (nextFacetFilters.length) {
          setMemberTransitFacetFilters(Array.from(new Set(nextFacetFilters)))
        }
        if (parsed.toneFilter === "all" || parsed.toneFilter === "challenging" || parsed.toneFilter === "harmonic") {
          setMemberTransitToneFilter(parsed.toneFilter)
        }
        if (parsed.sortMode === "impact" || parsed.sortMode === "recent") {
          setMemberTransitSortMode(parsed.sortMode)
        }
        if (typeof parsed.filtersExpanded === "boolean") {
          setMemberTransitFiltersExpanded(parsed.filtersExpanded)
        }
        if (typeof parsed.strongOnly === "boolean") {
          setMemberTransitStrongOnly(parsed.strongOnly)
        }
      } catch {
        // keep defaults on parse/read failures
      } finally {
        if (!cancelled) setMemberTransitPrefsLoaded(true)
      }
    }

    loadMemberTransitPrefs()
    return () => {
      cancelled = true
    }
  }, [memberTransitPrefsStorageKey, showMemberAreaModal])

  useEffect(() => {
    if (!memberTransitPrefsLoaded || !memberTransitPrefsStorageKey || !showMemberAreaModal) return
    const payload = JSON.stringify({
      facetFilters: memberTransitFacetFilters,
      toneFilter: memberTransitToneFilter,
      sortMode: memberTransitSortMode,
      filtersExpanded: memberTransitFiltersExpanded,
      strongOnly: memberTransitStrongOnly,
    })
    AsyncStorage.setItem(memberTransitPrefsStorageKey, payload).catch(() => null)
  }, [
    memberTransitFacetFilters,
    memberTransitFiltersExpanded,
    memberTransitPrefsLoaded,
    memberTransitPrefsStorageKey,
    memberTransitSortMode,
    memberTransitStrongOnly,
    memberTransitToneFilter,
    showMemberAreaModal,
  ])

  useEffect(() => {
    let cancelled = false
    const loadPolicyThresholds = async () => {
      try {
        await ensureStatusPolicyLoaded()
        if (cancelled) return
        const snapshot = getStatusPolicySnapshot()
        const modalFilters = snapshot?.ui?.modalFilters
        const defaultThreshold = Number(modalFilters?.strongOnlyThresholdDefault)
        if (Number.isFinite(defaultThreshold)) {
          setMemberStrongThresholdDefault(Math.max(0, Math.min(1, defaultThreshold)))
        }
        const byArea = modalFilters?.strongOnlyThresholdByArea
        if (byArea && typeof byArea === "object") {
          const next: Record<string, number> = {}
          Object.keys(byArea).forEach((key) => {
            const normalizedKey = String(key || "").trim().toLowerCase()
            const value = Number((byArea as Record<string, unknown>)[key])
            if (!normalizedKey || !Number.isFinite(value)) return
            next[normalizedKey] = Math.max(0, Math.min(1, value))
          })
          setMemberStrongThresholdByArea(next)
        }
      } catch {
        // keep default threshold on failures
      }
    }
    loadPolicyThresholds()
    return () => {
      cancelled = true
    }
  }, [])

  const animateMemberAreaSwipeBack = () => {
    Animated.spring(memberAreaSwipeY, {
      toValue: 0,
      bounciness: 0,
      speed: 24,
      useNativeDriver: true,
    }).start()
  }

  const closeMemberAreaBySwipe = () => {
    if (memberAreaSwipeClosingRef.current) return
    memberAreaSwipeClosingRef.current = true
    Animated.timing(memberAreaSwipeY, {
      toValue: WINDOW_HEIGHT * 0.72,
      duration: 180,
      useNativeDriver: true,
    }).start(() => {
      closeMemberAreaModal()
    })
  }

  const memberAreaPanResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => {
      if (!showMemberAreaModal) return false
      if (selectedMemberTransitDetail) return false
      const atTop = memberAreaScrollOffsetYRef.current <= 2
      const isDownward = gestureState.dy > 10
      const isMostlyVertical = Math.abs(gestureState.dy) > Math.abs(gestureState.dx) * 1.15
      return atTop && isDownward && isMostlyVertical
    },
    onPanResponderMove: (_, gestureState) => {
      const nextY = Math.max(0, gestureState.dy)
      memberAreaSwipeY.setValue(nextY)
    },
    onPanResponderRelease: (_, gestureState) => {
      const shouldClose = gestureState.dy > 110 || gestureState.vy > 1.05
      if (shouldClose) {
        closeMemberAreaBySwipe()
        return
      }
      animateMemberAreaSwipeBack()
    },
    onPanResponderTerminate: () => {
      animateMemberAreaSwipeBack()
    },
  })

  useEffect(() => {
    if (!user) return
    if (!isPremium) {
      setGroups([])
      setSelectedGroup(null)
      setGroupMembers([])
      setGroupAlerts([])
      setGroupActivities([])
      setLoading(false)
      return
    }
    loadUserGroups()
    loadCoupleRelationship()
  }, [user, isPremium])

  useEffect(() => {
    if (!user) return

    let isActive = true

    const handleInviteUrl = (url: string) => {
      const result = InviteService.processInviteDeepLink(url)
      if (!isActive || !result.isValid || !result.inviteCode) return
      setInviteCode(result.inviteCode)
      setShowJoinModal(true)
    }

    Linking.getInitialURL()
      .then((url) => {
        if (url) handleInviteUrl(url)
      })
      .catch(() => { })

    const subscription = Linking.addEventListener("url", ({ url }) => handleInviteUrl(url))

    return () => {
      isActive = false
      subscription?.remove?.()
    }
  }, [user])

  // Convite vindo do deep link /join/<CODIGO>: o linking do AppNavigator abre
  // esta aba passando o código por parâmetro. Mais confiável que reler a URL,
  // que a navegação pode ter reescrito.
  useEffect(() => {
    const code = route?.params?.inviteCode
    if (!user || !code) return
    const normalized = String(code).toUpperCase()
    if (!InviteService.validateInviteCode(normalized)) return
    setInviteCode(normalized)
    setShowJoinModal(true)
    // Limpa o parâmetro para o modal não reabrir ao voltar para a aba.
    navigation.setParams?.({ inviteCode: undefined } as never)
  }, [user, route?.params?.inviteCode])

  // Claim de perfil gerenciado via deep link ?claim=<grupo>~<perfil>~<token>: a
  // pessoa que recebeu o link reivindica o perfil e vira membro real do grupo.
  useEffect(() => {
    const raw = (route?.params as any)?.claim
    if (!user || !raw) return
    navigation.setParams?.({ claim: undefined } as never)
    const parts = String(raw).split('~')
    if (parts.length !== 3 || !parts[0] || !parts[1] || !parts[2]) return
    const [claimGroupId, claimProfileId, claimToken] = parts
    ;(async () => {
      try {
        await GroupService.claimManagedProfile(claimGroupId, claimProfileId, claimToken, user.uid)
        await loadUserGroups()
        Alert.alert(
          tr('groups.claim.successTitle', 'Perfil conectado'),
          tr('groups.claim.successBody', 'Voce entrou no grupo e o perfil agora esta ligado a sua conta.')
        )
      } catch (error: any) {
        Alert.alert(
          tr('groups.claim.errorTitle', 'Convite invalido'),
          error?.message || tr('groups.claim.errorBody', 'Nao foi possivel conectar o perfil (link expirado ou ja usado).')
        )
      }
    })()
  }, [user, (route?.params as any)?.claim])

  useEffect(() => {
    if (selectedGroup) {
      loadGroupData()
    }
  }, [selectedGroup])

  useEffect(() => {
    if (!isPremium || !selectedGroup?.id) {
      setGroupAlerts([])
      return
    }

    const unsubscribe = GroupService.subscribeToGroupAlerts(selectedGroup.id, (alerts) => {
      setGroupAlerts(alerts)
    })

    return () => {
      try {
        unsubscribe?.()
      } catch {
        // no-op
      }
    }
  }, [isPremium, selectedGroup?.id])

  // Sinastria: cruza o mapa natal do usuário com o de cada outro membro que compartilha
  // dados de nascimento. Cálculo pesado (resolve fuso pela coordenada) — roda 1× por
  // conjunto de membros e é abortável se o grupo mudar antes de terminar.
  useEffect(() => {
    let cancelled = false
    const run = async () => {
      if (!selectedGroup?.id || !user?.uid || groupMembers.length === 0) {
        setSynastryByMember({}); setGunaMilanByMember({}); setPairSynastry([]); setChartByMember({})
        setSynastryMineMissing(false)
        return
      }
      const mineMember = groupMembers.find((member) => member.userId === user.uid)
      const mineBirth = mineMember?.birthData
      if (!mineBirth?.datetime || !mineBirth?.coordinates) {
        setSynastryByMember({}); setGunaMilanByMember({}); setPairSynastry([]); setChartByMember({})
        setSynastryMineMissing(true)
        return
      }
      const others = groupMembers.filter(
        (member) => member.userId !== user.uid && member.birthData?.datetime && member.birthData?.coordinates
      )
      setSynastryMineMissing(false)
      if (others.length === 0) {
        setSynastryByMember({}); setGunaMilanByMember({}); setPairSynastry([]); setChartByMember({})
        return
      }
      setSynastryLoading(true)
      try {
        const mineChart = await computeNatalChart(mineBirth)
        if (cancelled) return
        if (!mineChart) {
          setSynastryByMember({}); setGunaMilanByMember({}); setPairSynastry([]); setChartByMember({})
          return
        }
        const mine = mineChart.planets
        const result: Record<string, SynastryAspect[]> = {}
        const gm: Record<string, ResolvedGunaMilan> = {}
        const mineDate = new Date(mineBirth.datetime)
        // Cache da carta COMPLETA (posições + cúspides) de cada membro — calcula 1× e
        // reusa nos aspectos, no Guna e na sobreposição de casas.
        const charts: Record<string, NatalChart> = { [user.uid]: mineChart }
        for (const member of others) {
          const theirsChart = await computeNatalChart(member.birthData)
          if (cancelled) return
          const theirDatetime = member.birthData?.datetime
          if (theirsChart && theirDatetime) {
            charts[member.userId] = theirsChart
            result[member.userId] = computeSynastryAspects(mine, theirsChart.planets, 20)
            // Guna Milan (lente védica) — determinístico, a partir das Luas natais.
            const g = gunaMilanBetween(mine, mineDate, theirsChart.planets, new Date(theirDatetime))
            if (g) gm[member.userId] = resolveGunaMilan(g)
          }
        }
        // Matriz: todas as duplas ENTRE os outros membros (fora o viewer, que já
        // tem sua própria seção). Cartas já em cache → só cruzamento, sem async.
        const withChart = others.filter((m) => charts[m.userId])
        const pairs: PairSynastry[] = []
        for (let i = 0; i < withChart.length; i++) {
          for (let j = i + 1; j < withChart.length; j++) {
            const A = withChart[i]
            const B = withChart[j]
            const aspects = computeSynastryAspects(charts[A.userId].planets, charts[B.userId].planets, 20)
            let guna: ResolvedGunaMilan | undefined
            const da = A.birthData?.datetime
            const db = B.birthData?.datetime
            if (da && db) {
              const g = gunaMilanBetween(charts[A.userId].planets, new Date(da), charts[B.userId].planets, new Date(db))
              if (g) guna = resolveGunaMilan(g)
            }
            pairs.push({ id: `${A.userId}__${B.userId}`, aId: A.userId, bId: B.userId, aName: A.displayName, bName: B.displayName, aspects, guna })
          }
        }
        if (!cancelled) { setSynastryByMember(result); setGunaMilanByMember(gm); setPairSynastry(pairs); setChartByMember(charts) }
      } finally {
        if (!cancelled) setSynastryLoading(false)
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [selectedGroup?.id, user?.uid, groupMembers])

  useEffect(() => {
    const params = route?.params || {}
    const focusKey = `${params.groupId || ""}_${params.memberId || ""}_${params.lifeArea || ""}`
    if (focusKey && lastFocusKeyRef.current !== focusKey) {
      focusHandledRef.current = false
      lastFocusKeyRef.current = focusKey
    }
  }, [route?.params])

  useEffect(() => {
    const params = route?.params || {}
    const focusGroupId = params.groupId
    if (!focusGroupId || !groups.length) return
    if (selectedGroup?.id === focusGroupId) return
    const target = groups.find((group) => group.id === focusGroupId)
    if (target) {
      setSelectedGroup(target)
    }
  }, [route?.params, groups, selectedGroup?.id])

  useEffect(() => {
    const params = route?.params || {}
    const feedTab = params.feedTab
    if (feedTab === "messages" || feedTab === "alerts" || feedTab === "all") {
      setFeedFilter(feedTab)
    }
  }, [route?.params])

  useEffect(() => {
    const params = route?.params || {}
    const focusGroupId = params.groupId
    const focusMemberId = params.memberId
    const focusArea = params.lifeArea

    if (!focusGroupId || !focusMemberId || !focusArea) return
    if (!selectedGroup || selectedGroup.id !== focusGroupId) return
    if (!groupMembers.length) return
    if (focusHandledRef.current) return

    const member = groupMembers.find((entry) => entry.userId === focusMemberId)
    if (!member) return

    setSelectedMemberArea({ member, key: focusArea })
    setShowMemberAreaCalc(false)
    setShowMemberAreaModal(true)
    focusHandledRef.current = true
  }, [route?.params, selectedGroup?.id, groupMembers])

  useEffect(() => {
    const cleanedCode = inviteCode.trim().toUpperCase()
    if (cleanedCode.length !== 6) {
      setInvitePreview(null)
      setInvitePreviewError("")
      setInvitePreviewLoading(false)
      return
    }

    let isActive = true
    setInvitePreviewLoading(true)

    GroupService.getGroupByInviteCode(cleanedCode)
      .then((group) => {
        if (!isActive) return
        setInvitePreview(group)
        setInvitePreviewError(group ? "" : tr('groups.invite.notFound', 'Codigo nao encontrado'))
      })
      .catch(() => {
        if (!isActive) return
        setInvitePreview(null)
        setInvitePreviewError(tr('groups.invite.validateFailed', 'Nao foi possivel validar o codigo'))
      })
      .finally(() => {
        if (!isActive) return
        setInvitePreviewLoading(false)
      })

    return () => {
      isActive = false
    }
  }, [inviteCode])

  const toggleLifeArea = (areas: string[], key: string) => {
    if (areas.includes(key)) {
      return areas.filter((area) => area !== key)
    }
    return [...areas, key]
  }

  const sortGroupsByOrder = (list: Group[], order: string[]) => {
    if (!order.length) return list
    const orderMap = new Map(order.map((id, index) => [id, index]))
    return [...list].sort((a, b) => {
      const aIndex = orderMap.has(a.id) ? orderMap.get(a.id)! : Number.MAX_SAFE_INTEGER
      const bIndex = orderMap.has(b.id) ? orderMap.get(b.id)! : Number.MAX_SAFE_INTEGER
      if (aIndex !== bIndex) return aIndex - bIndex
      return a.name.localeCompare(b.name)
    })
  }

  const loadGroupOrder = async () => {
    if (!user) return []
    const userDoc = await getDoc(doc(db, "users", user.uid))
    const data = userDoc.exists() ? userDoc.data() : {}
    const saved = data?.preferences?.groupOrder
    return Array.isArray(saved) ? saved : []
  }

  const saveGroupOrder = async (order: string[]) => {
    if (!user) return
    await updateDoc(doc(db, "users", user.uid), {
      "preferences.groupOrder": order,
    })
  }

  const loadUserGroups = async () => {
    try {
      setLoading(true)
      const userGroups = await GroupService.getUserGroups(user!.uid)
      const savedOrder = await loadGroupOrder()
      const orderedGroups = sortGroupsByOrder(userGroups, savedOrder)
      setGroupOrder(savedOrder)
      setGroups(orderedGroups)

      if (orderedGroups.length > 0 && !selectedGroup) {
        setSelectedGroup(orderedGroups[0])
      }
    } catch (error) {
      console.error("Erro ao carregar grupos:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadGroupData = async () => {
    if (!selectedGroup) return

    try {
      if (user?.uid && BACKEND_URL) {
        const nowMs = Date.now()
        const elapsedMs = nowMs - lastSelfStatusRefreshAtRef.current
        if (elapsedMs > 60_000) {
          try {
            await backendFetch(`/api/status-refresh?userId=${encodeURIComponent(user.uid)}`, {
              method: "POST",
              auth: true,
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ userId: user.uid, reason: "groups_screen_sync" }),
            })
            lastSelfStatusRefreshAtRef.current = Date.now()
          } catch (refreshError) {
            console.warn("Falha ao sincronizar status antes de carregar grupo:", refreshError)
          }
        }
      }

      const [members, alerts, activities] = await Promise.all([
        GroupService.getGroupMembersWithStatus(selectedGroup.id, user?.uid),
        GroupService.getGroupAlerts(selectedGroup.id),
        GroupService.getGroupActivities(selectedGroup.id),
      ])

      setGroupMembers(members)
      setGroupAlerts(alerts)
      setGroupActivities(activities)
    } catch (error) {
      console.error("Erro ao carregar dados do grupo:", error)
    }
  }

  const openGroupActions = () => {
    setShowGroupActionsModal(true)
  }

  const openGroupOrder = () => {
    const baseOrder = groupOrder.length ? groupOrder : []
    const missing = groups
      .map((group) => group.id)
      .filter((id) => !baseOrder.includes(id))
    const currentOrder = baseOrder.concat(missing)
    setGroupOrderDraft(currentOrder.length ? currentOrder : groups.map((group) => group.id))
    setShowGroupOrderModal(true)
  }

  const moveGroupOrder = (groupId: string, direction: "up" | "down") => {
    setGroupOrderDraft((prev) => {
      const current = prev.length ? [...prev] : groups.map((group) => group.id)
      const index = current.indexOf(groupId)
      if (index < 0) return current
      const target = direction === "up" ? index - 1 : index + 1
      if (target < 0 || target >= current.length) return current
      const next = [...current]
      const [item] = next.splice(index, 1)
      next.splice(target, 0, item)
      return next
    })
  }

  const applyGroupOrder = async () => {
    const order = groupOrderDraft.length ? groupOrderDraft : groups.map((group) => group.id)
    setGroupOrder(order)
    setGroups(sortGroupsByOrder(groups, order))
    await saveGroupOrder(order)
    setShowGroupOrderModal(false)
  }

  const openMemberSort = () => {
    setShowMemberSortModal(true)
  }

  // === FUNCOES DE CASAIS ===

  const loadCoupleRelationship = async () => {
    if (!user) return

    try {
      setCoupleLoading(true)
      const relationship = await CoupleService.getUserCoupleRelationship(user.uid)
      setCoupleRelationship(relationship)

      // Se existe relacionamento, atualizar compatibilidade se necessario
      if (relationship) {
        const lastUpdate = relationship.dailyCompatibility?.lastUpdated
        const now = new Date()
        const hoursSinceUpdate = lastUpdate ?
          (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60) : 24

        // Atualizar se passou mais de 12 horas
        if (hoursSinceUpdate >= 12) {
          await CoupleService.updateDailyCompatibility(relationship.id)
          // Recarregar dados atualizados
          const updatedRelationship = await CoupleService.getUserCoupleRelationship(user.uid)
          setCoupleRelationship(updatedRelationship)
        }
      }
    } catch (error) {
      console.error('Erro ao carregar relacionamento:', error)
    } finally {
      setCoupleLoading(false)
    }
  }

  const handleCreateCouple = async () => {
    if (!user || !partnerEmail.trim()) {
      Alert.alert(tr('groups.alert.errorTitle', 'Erro'), tr('groups.alert.partnerEmailRequired', 'Por favor, insira o email do seu parceiro'))
      return
    }

    try {
      setCoupleLoading(true)

      // Buscar parceiro pelo email no Firestore
      const usersRef = collection(db, 'users')
      const q = query(usersRef, where('email', '==', partnerEmail.trim().toLowerCase()))
      const snap = await getDocs(q)

      if (snap.empty) {
        Alert.alert(
          tr('groups.alert.partnerNotFoundTitle', 'Usuário não encontrado'),
          tr('groups.alert.partnerNotFoundBody', 'Nenhum usuário com este email foi encontrado. Verifique se ele já tem conta no app.')
        )
        return
      }

      const partnerId = snap.docs[0].id

      if (partnerId === user.uid) {
        Alert.alert(tr('groups.alert.errorTitle', 'Erro'), tr('groups.alert.cannotAddSelf', 'Você não pode se adicionar como parceiro.'))
        return
      }

      await CoupleService.createCoupleRelationship(user.uid, partnerId, 'dating')

      Alert.alert(
        tr('groups.alert.successTitle', 'Sucesso'),
        tr('groups.alert.coupleCreated', 'Casal criado com sucesso!')
      )

      setShowCreateCoupleModal(false)
      setPartnerEmail('')

      // Recarregar relacionamento
      const updated = await CoupleService.getUserCoupleRelationship(user.uid)
      setCoupleRelationship(updated)
    } catch (error) {
      console.error('Erro ao criar relacionamento:', error)
      Alert.alert(tr('groups.alert.errorTitle', 'Erro'), tr('groups.alert.coupleCreateFailed', 'Nao foi possivel criar o relacionamento'))
    } finally {
      setCoupleLoading(false)
    }
  }

  const handleRefreshCompatibility = async () => {
    if (!coupleRelationship) return

    try {
      setCoupleLoading(true)
      await CoupleService.updateDailyCompatibility(coupleRelationship.id)

      // Recarregar dados
      const updatedRelationship = await CoupleService.getUserCoupleRelationship(user!.uid)
      setCoupleRelationship(updatedRelationship)

      Alert.alert(tr('groups.alert.successTitle', 'Sucesso'), tr('groups.alert.compatUpdated', 'Compatibilidade atualizada!'))
    } catch (error) {
      console.error('Erro ao atualizar compatibilidade:', error)
      Alert.alert(tr('groups.alert.errorTitle', 'Erro'), tr('groups.alert.compatUpdateFailed', 'Nao foi possivel atualizar a compatibilidade'))
    } finally {
      setCoupleLoading(false)
    }
  }

  const createGroup = async () => {
    if (!newGroupName.trim()) {
      Alert.alert(tr('groups.alert.errorTitle', 'Erro'), tr('groups.alert.groupNameRequired', 'Nome do grupo e obrigatorio'))
      return
    }

    try {
      await GroupService.createGroup(newGroupName, newGroupDescription, user!.uid, false, {
        sharedLifeAreas: newGroupSharedLifeAreas,
        notifiedLifeAreas: newGroupNotifiedLifeAreas,
      })
      setShowCreateModal(false)
      setNewGroupName("")
      setNewGroupDescription("")
      setNewGroupSharedLifeAreas(LIFE_AREA_KEYS)
      setNewGroupNotifiedLifeAreas(LIFE_AREA_KEYS)
      await loadUserGroups()
      Alert.alert(tr('groups.alert.successTitle', 'Sucesso'), tr('groups.alert.groupCreated', 'Grupo criado com sucesso!'))
    } catch (error: any) {
      Alert.alert(tr('groups.alert.errorTitle', 'Erro'), error.message)
    }
  }

  const joinGroup = async () => {
    if (!inviteCode.trim()) {
      Alert.alert(tr('groups.alert.errorTitle', 'Erro'), tr('groups.alert.inviteCodeRequired', 'Codigo de convite e obrigatorio'))
      return
    }

    if (invitePreview && (invitePreview.inviteEnabled === false || invitePreview.inviteExpiresAt && invitePreview.inviteExpiresAt.getTime() < Date.now())) {
      Alert.alert(tr('groups.alert.inviteUnavailableTitle', 'Convite indisponivel'), tr('groups.alert.inviteUnavailableBody', 'Este convite esta desativado ou expirado.'))
      return
    }

    try {
      await GroupService.joinGroupByCode(inviteCode.toUpperCase(), user!.uid)
      setShowJoinModal(false)
      setInviteCode("")
      setInvitePreview(null)
      setInvitePreviewError("")
      await loadUserGroups()

      // Notificar grupo sobre novo membro
      if (invitePreview) {
        await GroupNotificationService.sendMemberJoined(invitePreview.id, user!.uid)
      }

      Alert.alert(tr('groups.alert.successTitle', 'Sucesso'), tr('groups.alert.joinedGroup', 'Voce entrou no grupo!'))
    } catch (error: any) {
      Alert.alert(tr('groups.alert.errorTitle', 'Erro'), error.message)
    }
  }

  // === FUNCOES DE NOTIFICACOES ===

  const sendGroupMessage = async () => {
    if (!selectedGroup || !groupMessage.trim()) {
      Alert.alert(tr('groups.alert.errorTitle', 'Erro'), tr('groups.alert.messageRequired', 'Mensagem e obrigatoria'))
      return
    }

    try {
      setSendingNotification(true)

      await GroupNotificationService.sendCustomMessage(
        selectedGroup.id,
        user!.uid,
        groupMessage
      )

      setShowMessageModal(false)
      setGroupMessage("")
      await loadGroupData()
      Alert.alert(tr('groups.alert.successTitle', 'Sucesso'), tr('groups.alert.messageSent', 'Mensagem enviada para o grupo!'))

    } catch (error: any) {
      console.error('Erro ao enviar mensagem:', error)
      Alert.alert(tr('groups.alert.errorTitle', 'Erro'), tr('groups.alert.messageSendFailed', 'Nao foi possivel enviar a mensagem'))
    } finally {
      setSendingNotification(false)
    }
  }

  const openGroupSettings = () => {
    if (!selectedGroup) return
    setShowGroupSettings(true)
  }

  const handleUpdateInviteSettings = async (updates: { inviteEnabled?: boolean; inviteExpiresAt?: Date | null; rotate?: boolean }) => {
    if (!selectedGroup || !user) return
    try {
      setUpdatingInvite(true)
      const result = await GroupService.updateInviteSettings(selectedGroup.id, user.uid, updates)
      setSelectedGroup((prev) =>
        prev ? { ...prev, inviteCode: result.inviteCode, inviteEnabled: result.inviteEnabled, inviteExpiresAt: result.inviteExpiresAt } : prev
      )
      setSelectedGroupForDetail((prev) =>
        prev ? { ...prev, inviteCode: result.inviteCode, inviteEnabled: result.inviteEnabled, inviteExpiresAt: result.inviteExpiresAt } : prev
      )
      Alert.alert(tr('groups.alert.successTitle', 'Sucesso'), tr('groups.alert.inviteUpdated', 'Convite atualizado'))
    } catch (error: any) {
      console.error("Erro ao atualizar convite:", error)
      Alert.alert(tr('groups.alert.errorTitle', 'Erro'), error?.message || tr('groups.alert.inviteUpdateFailed', 'Nao foi possivel atualizar convite'))
    } finally {
      setUpdatingInvite(false)
    }
  }

  const handleRemoveMember = async (memberId: string) => {
    if (!selectedGroup || !user) return
    try {
      await GroupService.removeMember(selectedGroup.id, memberId, user.uid)
      await loadGroupData()
      await loadUserGroups()
      Alert.alert(tr('groups.alert.successTitle', 'Sucesso'), tr('groups.alert.memberRemoved', 'Membro removido do grupo'))
    } catch (error: any) {
      console.error("Erro ao remover membro:", error)
      Alert.alert(tr('groups.alert.errorTitle', 'Erro'), error?.message || tr('groups.alert.memberRemoveFailed', 'Nao foi possivel remover o membro'))
    }
  }

  const handleRenameGroup = async (newName: string) => {
    const alvo = selectedGroupForDetail || selectedGroup
    if (!alvo || !user) return
    try {
      await GroupService.renameGroup(alvo.id, newName, user.uid)
      setGroups((prev) => prev.map((g) => (g.id === alvo.id ? { ...g, name: newName } : g)))
      setSelectedGroup((prev) => (prev && prev.id === alvo.id ? { ...prev, name: newName } : prev))
      setSelectedGroupForDetail((prev) => (prev && prev.id === alvo.id ? { ...prev, name: newName } : prev))
      Alert.alert(tr('groups.alert.successTitle', 'Sucesso'), tr('groups.alert.renamed', 'Nome do grupo atualizado!'))
    } catch (error: any) {
      console.error("Erro ao renomear grupo:", error)
      Alert.alert(tr('groups.alert.errorTitle', 'Erro'), error?.message || tr('groups.alert.renameFailed', 'Nao foi possivel renomear o grupo'))
    }
  }

  const handleRemoveManaged = (member: GroupMember) => {
    const grp = selectedGroup
    if (!grp || !user) return
    const id = String(member.userId || '').replace(/^managed:/, '')
    Alert.alert(
      tr('groups.managed.removeTitle', 'Remover perfil'),
      tr('groups.managed.removeBody', 'Remover {name} do grupo?', { name: member.displayName }),
      [
        { text: tr('groups.action.cancel', 'Cancelar'), style: 'cancel' },
        {
          text: tr('groups.action.remove', 'Remover'),
          style: 'destructive',
          onPress: async () => {
            try {
              await GroupService.removeManagedProfile(grp.id, user.uid, id)
              await loadGroupData()
            } catch (error: any) {
              Alert.alert(tr('groups.alert.errorTitle', 'Erro'), error?.message || tr('groups.managed.removeFailed', 'Nao foi possivel remover o perfil'))
            }
          },
        },
      ]
    )
  }

  const handleInviteManaged = async (member: GroupMember) => {
    const grp = selectedGroup
    if (!grp || !user) return
    const id = String(member.userId || '').replace(/^managed:/, '')
    try {
      const link = await GroupService.createManagedClaimLink(grp.id, user.uid, id)
      await Share.share({
        message: tr('groups.claim.shareMessage', 'Conecte seu perfil no nosso grupo astrologico da Tabula Estelar: {link}', { link }),
      })
    } catch (error: any) {
      Alert.alert(tr('groups.alert.errorTitle', 'Erro'), error?.message || tr('groups.claim.linkFailed', 'Nao foi possivel gerar o convite'))
    }
  }

  const handleLeaveGroup = async () => {
    if (!selectedGroup || !user) return
    try {
      await GroupService.leaveGroup(selectedGroup.id, user.uid)
      setShowGroupDetail(false)
      setSelectedGroupForDetail(null)
      await loadUserGroups()
      setSelectedGroup(null)
      Alert.alert(tr('groups.alert.successTitle', 'Sucesso'), tr('groups.alert.leftGroup', 'Voce saiu do grupo'))
    } catch (error: any) {
      console.error("Erro ao sair do grupo:", error)
      Alert.alert(tr('groups.alert.errorTitle', 'Erro'), error?.message || tr('groups.alert.leaveGroupFailed', 'Nao foi possivel sair do grupo'))
    }
  }

  const normalizeStatusKey = (status?: string) => {
    const value = String(status || "")
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")

    if (!value) return "neutral"
    if (["critical", "critico", "critica", "crítico", "crítica"].includes(value)) return "critical"
    if (["challenging", "desafiador", "desafiante", "desafio", "moderado", "alerta"].includes(value)) return "challenging"
    if (["neutral", "neutro", "estavel", "estável", "stable"].includes(value)) return "neutral"
    if (["positive", "positivo", "boa", "bom", "good"].includes(value)) return "positive"
    if (["excellent", "otimo", "ótimo", "excelente", "great"].includes(value)) return "excellent"
    return value
  }

  const getStatusColor = (status: string) => {
    switch (normalizeStatusKey(status)) {
      case "critical":
        return "#FF4444"
      case "challenging":
        return "#FF8800"
      case "neutral":
        return "#888888"
      case "positive":
        return "#44AA44"
      case "excellent":
        return "#00AA00"
      default:
        return "#888888"
    }
  }

  const getStatusRank = (status?: string) => {
    switch (normalizeStatusKey(status)) {
      case "critical":
        return 0
      case "challenging":
        return 1
      case "neutral":
        return 2
      case "positive":
        return 3
      case "excellent":
        return 4
      default:
        return 5
    }
  }

  const getStatusLabel = (status?: string) => {
    switch (normalizeStatusKey(status)) {
      case "critical":
        return tr('groups.status.critical', 'Atencao')
      case "challenging":
        return tr('groups.status.challenging', 'Desafiador')
      case "neutral":
        return tr('groups.status.neutral', 'Neutro')
      case "positive":
        return tr('groups.status.positive', 'Positivo')
      case "excellent":
        return tr('groups.status.excellent', 'Otimo')
      default:
        return tr('groups.status.neutral', 'Neutro')
    }
  }

  const getStatusBucket = (status?: string) => {
    const normalized = normalizeStatusKey(status)
    if (normalized === "critical" || normalized === "challenging") return "critical"
    if (normalized === "positive" || normalized === "excellent") return "positive"
    return "neutral"
  }

  const formatRelativeTime = (value?: Date | null) => {
    if (!value) return tr('groups.time.now', 'Agora')
    const date = value instanceof Date ? value : new Date(value)
    const diffMs = Date.now() - date.getTime()
    const diffMinutes = Math.floor(diffMs / (1000 * 60))
    if (diffMinutes < 1) return tr('groups.time.now', 'Agora')
    if (diffMinutes < 60) return tr('groups.time.min', '{count} min', { count: diffMinutes })
    const diffHours = Math.floor(diffMinutes / 60)
    if (diffHours < 24) return tr('groups.time.hour', '{count} h', { count: diffHours })
    const diffDays = Math.floor(diffHours / 24)
    return tr('groups.time.day', '{count} d', { count: diffDays })
  }

  const getStatusIcon = (status: string) => {
    switch (normalizeStatusKey(status)) {
      case "critical":
        return "warning"
      case "challenging":
        return "alert-circle"
      case "neutral":
        return "remove-circle"
      case "positive":
        return "checkmark-circle"
      case "excellent":
        return "star"
      default:
        return "help-circle"
    }
  }

  const resolveMemberLifeAreas = (member: GroupMember) => {
    if (member.lifeAreas && !Array.isArray(member.lifeAreas) && typeof member.lifeAreas === "object") {
      return member.lifeAreas
    }
    const statusAny = member.astrologicalStatus as any
    if (statusAny?.lifeAreas && typeof statusAny.lifeAreas === "object") {
      return statusAny.lifeAreas as Record<string, any>
    }
    return {}
  }

  const resolveSharedAreas = (member: GroupMember) => {
    if (member.shareStatus === false || member.shareEnabled === false) return []
    if (Array.isArray(member.sharedLifeAreas)) return member.sharedLifeAreas
    if (selectedGroup?.sharedLifeAreas && selectedGroup.sharedLifeAreas.length) return selectedGroup.sharedLifeAreas
    return LIFE_AREA_KEYS
  }

  const hasVisibleStatus = (member: GroupMember) => {
    if (!member.isAdmin && member.subscriptionActive === false) return false
    if (member.shareStatus === false || member.shareEnabled === false) return false
    const lifeAreas = resolveMemberLifeAreas(member)
    const sharedAreas = resolveSharedAreas(member)
    if (!sharedAreas.length) return false
    return !!lifeAreas && Object.keys(lifeAreas).length > 0
  }

  const mapPercentageToBucket = (percentage?: number | null) => {
    if (typeof percentage !== "number") return "neutral"
    if (percentage >= STATUS_THRESHOLDS.positiveAbove) return "positive"
    if (percentage >= STATUS_THRESHOLDS.criticalBelow) return "attention"
    return "critical"
  }

  const mapBucketToColor = (bucket: string) => {
    switch (bucket) {
      case "critical":
        return "#F87171"
      case "attention":
        return "#FBBF24"
      case "positive":
        return "#34D399"
      default:
        return "#9CA3AF"
    }
  }

  const PLANET_LABELS: Record<string, string> = {
    Sun: "Sol",
    Moon: "Lua",
    Mercury: "Mercurio",
    Venus: "Venus",
    Mars: "Marte",
    Jupiter: "Jupiter",
    Saturn: "Saturno",
    Uranus: "Urano",
    Neptune: "Netuno",
    Pluto: "Plutao",
    Asc: "Ascendente",
    MC: "Meio do Ceu",
  }

  const ASPECT_LABELS: Record<string, string> = {
    conjunction: "conjuncao",
    opposition: "oposicao",
    square: "quadratura",
    trine: "trigono",
    sextile: "sextil",
    quincunx: "quincuncio",
    semisextile: "semissextil",
    semisquare: "semiquadratura",
    sesquiquadrate: "sesquiquadratura",
    conjuncao: "conjuncao",
    oposicao: "oposicao",
    quadratura: "quadratura",
    trigono: "trigono",
    sextil: "sextil",
    quincuncio: "quincuncio",
    semissextil: "semissextil",
    semiquadratura: "semiquadratura",
    sesquiquadratura: "sesquiquadratura",
  }

  const formatPlanetLabel = (name: string) => PLANET_LABELS[name] || name

  const normalizeLabelKey = (value: string) =>
    String(value || "")
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")

  const formatAspectLabel = (type: string) => {
    const normalized = normalizeLabelKey(type)
    const exact = ASPECT_LABELS[normalized]
    if (exact) return exact
    if (normalized.includes("trigono") || normalized.includes("trine")) return "trigono"
    if (normalized.includes("sesquiquadr")) return "sesquiquadratura"
    if (normalized.includes("semiquadr")) return "semiquadratura"
    if (normalized.includes("semissext") || normalized.includes("semisext")) return "semissextil"
    if (normalized.includes("sext")) return "sextil"
    if (normalized.includes("quadr")) return "quadratura"
    if (normalized.includes("opos")) return "oposicao"
    if (normalized.includes("quinc")) return "quincuncio"
    if (normalized.includes("conj")) return "conjuncao"
    return ""
  }

  const formatTransitTimingLabel = (transit: any) => {
    const label = transit?.phaseLabel
    if (!label || label === "Em andamento") return ""
    return label
  }

  const formatDateShort = (value?: string) => {
    if (!value) return null
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return null
    return date.toLocaleDateString("pt-BR")
  }

  const formatTransitDuration = (transit: { window?: { start?: string; end?: string; days?: number }; windowDays?: number; durationClass?: string }) => {
    const days = transit.window?.days ?? transit.windowDays
    if (typeof days === "number") {
      const start = formatDateShort(transit.window?.start)
      const end = formatDateShort(transit.window?.end)
      if (start && end) return `duracao: ${days} dias (${start} - ${end})`
      return `duracao: ${days} dias`
    }
    if (transit.durationClass === "curto") return "duracao: curto"
    if (transit.durationClass === "medio") return "duracao: medio"
    if (transit.durationClass === "longo") return "duracao: longo"
    return ""
  }

  const getTransitCurrentHouse = (transit: any) => {
    const houseValue =
      transit?.transitHouse ??
      transit?.currentHouse ??
      null
    const houseNumber = Number(houseValue)
    if (!Number.isFinite(houseNumber)) return ""
    if (houseNumber < 1 || houseNumber > 12) return ""
    return `Casa ${Math.round(houseNumber)}`
  }

  const getTransitHouseLabels = (transit: any): string[] => {
    const targetHouseValue =
      transit?.target?.house ??
      transit?.natalHouseImpacted ??
      transit?.natalHouse ??
      null
    const targetHouseNumber = Number(targetHouseValue)
    const targetHouse =
      Number.isFinite(targetHouseNumber) && targetHouseNumber >= 1 && targetHouseNumber <= 12
        ? `Casa ${Math.round(targetHouseNumber)}`
        : ""
    const labels = [targetHouse, getTransitCurrentHouse(transit)].filter((value): value is string => Boolean(value))
    return Array.from(new Set(labels))
  }

  const getTransitHouseTarget = (transit: any) => {
    const houseValue =
      transit?.target?.house ??
      transit?.natalHouseImpacted ??
      transit?.natalHouse ??
      null
    const houseNumber = Number(houseValue)
    if (!Number.isFinite(houseNumber)) return ""
    if (houseNumber < 1 || houseNumber > 12) return ""
    return `Casa ${Math.round(houseNumber)}`
  }

  const getTransitNatalHouse = (transit: any) => {
    const houseValue = transit?.natalHouseImpacted ?? transit?.natalHouse ?? null
    const houseNumber = Number(houseValue)
    if (!Number.isFinite(houseNumber)) return ""
    if (houseNumber < 1 || houseNumber > 12) return ""
    return `Casa ${Math.round(houseNumber)}`
  }

  const buildTransitTitle = (transit: any, areaKey?: string) => {
    const transitPlanet = formatPlanetLabel(transit?.transitPlanet || "")
    const aspect = formatAspectLabel(transit?.aspectName || transit?.type || transit?.aspectType || "")
    const targetPlanet = transit?.natalPlanet || transit?.target?.natalPlanet
    const targetAngle = transit?.target?.angle
    const targetHouse = getTransitHouseTarget(transit) || getTransitCurrentHouse(transit)
    const currentHouse = getTransitCurrentHouse(transit)
    const target = targetPlanet
      ? formatPlanetLabel(targetPlanet)
      : targetAngle
        ? String(targetAngle)
        : targetHouse
    const currentHouseNumberMatch = currentHouse.match(/(\d{1,2})/)
    const currentHouseNumber = currentHouseNumberMatch ? Number(currentHouseNumberMatch[1]) : null
    return buildSharedTransitTitle({
      transitPlanet,
      aspectLabel: aspect,
      targetLabel: target,
      houseNumber: currentHouseNumber,
      areaHouses: areaKey && AREA_HOUSES[areaKey] ? AREA_HOUSES[areaKey] : null,
    }, language)
  }

  const buildTransitKeywords = (transit: any, areaKey?: string) => {
    const areaLabel = areaKey ? (LIFE_AREA_LABELS[areaKey] || areaKey) : ""
    const out = buildUnifiedTransitNarrative(
      {
        transitPlanet: transit?.transitPlanet,
        aspectName: transit?.aspectName || transit?.type || transit?.aspectType,
        natalPlanet: transit?.natalPlanet || transit?.target?.natalPlanet || transit?.target?.angle,
        house: transit?.target?.house ?? transit?.natalHouseImpacted ?? transit?.natalHouse,
      },
      areaLabel || "grupos",
      language
    ).keywords
    return out.slice(0, 5)
  }

  type LocalizeFn = (key: string, fallback: string, vars?: Record<string, string | number>) => string

  const getTransitTechnicalTypeLabel = (transit: any, tr?: LocalizeFn) => {
    const tx = tr || ((_k: string, fallback: string) => fallback)
    const targetNatalPlanet = transit?.target?.natalPlanet || transit?.natalPlanet
    if (targetNatalPlanet) return tx('groups.member.tech.natalPlanet', 'Aspecto com planeta natal')
    const targetAngle = transit?.target?.angle
    if (targetAngle) {
      return tx('groups.member.tech.angle', 'Aspecto com angulo ({angle})', { angle: String(targetAngle).toUpperCase() })
    }
    const house = getTransitHouseTarget(transit) || getTransitCurrentHouse(transit)
    if (house) return tx('groups.member.tech.house', 'Planeta em casa ({house})', { house: house.replace("Casa ", "") })
    return tx('groups.member.tech.context', 'Transito contextual da area')
  }

  const getTransitColumnKind = (transit: any): "planet" | "house" => {
    const hasAngleTarget = !!transit?.target?.angle
    if (hasAngleTarget) return "house"
    const rawTarget = String(transit?.natalPlanet || transit?.target?.natalPlanet || "").toUpperCase()
    const normalizedTarget = rawTarget.replace(/^NATAL_/, "").replace(/^NATAL:/, "")
    if (["ASC", "MC", "DSC", "IC"].includes(normalizedTarget)) return "house"

    const targetHouse = Number(transit?.target?.house ?? transit?.natalHouseImpacted ?? transit?.natalHouse)
    const hasHouseTarget = Number.isFinite(targetHouse) && targetHouse >= 1 && targetHouse <= 12
    const currentHouse = Number(transit?.transitHouse ?? transit?.currentHouse)
    const hasCurrentHouse = Number.isFinite(currentHouse) && currentHouse >= 1 && currentHouse <= 12
    const explicitHouseTarget =
      rawTarget.startsWith("HOUSE_")
    const rawType = String(transit?.aspectName || transit?.type || transit?.aspectType || '').toLowerCase()
    const hasPlanetTarget = !!(transit?.target?.natalPlanet || transit?.natalPlanet)
    if (hasPlanetTarget && !explicitHouseTarget) return "planet"
    if (hasHouseTarget || hasCurrentHouse || explicitHouseTarget || rawType.includes('ingress')) return "house"

    const aspectType = normalizeAspectType(transit?.aspectName || transit?.type || transit?.aspectType || "")
    const hasRecognizedAspect = [
      "trigono",
      "sextil",
      "quadratura",
      "oposicao",
      "quincuncio",
      "conjuncao",
      "semiquadratura",
      "sesquiquadratura",
      "semissextil",
      "harmonico",
      "desafiador",
      "neutro",
    ].includes(aspectType)
    if (hasRecognizedAspect && hasPlanetTarget) {
      return "planet"
    }
    return "house"
  }

  const normalizeAspectType = (value: string) => {
    const normalized = normalizeLabelKey(value)
    if (!normalized) return ""
    if (normalized.includes("trigono") || normalized.includes("trine")) return "trigono"
    if (normalized.includes("sesquiquadr")) return "sesquiquadratura"
    if (normalized.includes("semiquadr")) return "semiquadratura"
    if (normalized.includes("semissext") || normalized.includes("semisext")) return "semissextil"
    if (normalized.includes("sext")) return "sextil"
    if (normalized.includes("quadr")) return "quadratura"
    if (normalized.includes("opos")) return "oposicao"
    if (normalized.includes("quinc")) return "quincuncio"
    if (normalized.includes("conj")) return "conjuncao"
    if (normalized.includes("harmon")) return "harmonico"
    if (normalized.includes("tense") || normalized.includes("desafi")) return "desafiador"
    if (normalized.includes("neutral") || normalized.includes("neutro")) return "neutro"
    return normalized
  }

  const classifyTransitStatus = (transit: any, tr?: LocalizeFn) => {
    const tx = tr || ((_k: string, fallback: string) => fallback)
    const aspectType = normalizeAspectType(transit?.aspectName || transit?.type || transit?.aspectType || "")
    const isHarmonic = ["trigono", "sextil", "harmonico"].includes(aspectType)
    const isTense = [
      "quadratura",
      "oposicao",
      "quincuncio",
      "semissextil",
      "semiquadratura",
      "sesquiquadratura",
      "desafiador",
    ].includes(aspectType)
    if (isHarmonic) return { kind: "harmonic", label: tx('groups.status.harmonic', 'Harmonico'), color: "#22C55E" }
    if (isTense) return { kind: "tense", label: tx('groups.status.challenging', 'Desafiador'), color: "#EF4444" }
    return { kind: "neutral", label: tx('groups.status.neutral', 'Neutro'), color: "#64748B" }
  }

  const isMinorAspectTransit = (transit: any) => {
    const source = getTransitSource(transit)
    const type = normalizeAspectType(source?.aspectName || source?.type || source?.aspectType || "")
    return ["semissextil", "semiquadratura", "sesquiquadratura", "quincuncio"].includes(type)
  }

  const isMajorAspectTransit = (transit: any) => {
    const source = getTransitSource(transit)
    if (isMinorAspectTransit(transit)) return false
    const type = normalizeAspectType(source?.aspectName || source?.type || source?.aspectType || "")
    if (["trigono", "sextil", "quadratura", "oposicao", "conjuncao", "harmonico", "desafiador", "neutro"].includes(type)) {
      return true
    }
    const rawType = normalizeLabelKey(String(source?.aspectName || source?.type || source?.aspectType || ""))
    if (rawType.includes("ingress") || rawType.includes("casa") || rawType.includes("house")) return false
    return !!(source?.natalPlanet || source?.target?.natalPlanet)
  }

  const getTransitRecencyDistance = (transit: any): number => {
    const source = getTransitSource(transit)
    const toMs = (value: unknown) => {
      const ms = new Date(String(value || "")).getTime()
      return Number.isFinite(ms) ? ms : null
    }
    const now = Date.now()
    const phase = String(source?.phase || "").toLowerCase()
    const startAt = toMs(source?.startAt || source?.window?.start || null)
    const peakAt = toMs(source?.peakAt || source?.window?.exact || null)
    const endAt = toMs(source?.endAt || source?.window?.end || null)
    const byPhase = phase === "start" ? peakAt : phase === "peak" ? peakAt : phase === "end" ? endAt : null
    if (byPhase !== null) return Math.abs(byPhase - now)
    const candidates = [startAt, peakAt, endAt].filter((value): value is number => value !== null)
    if (!candidates.length) return Number.MAX_SAFE_INTEGER
    return Math.min(...candidates.map((value) => Math.abs(value - now)))
  }

  const buildTransitDirectText = (
    transit: any,
    areaLabel: string,
    fallbackText?: string,
    areaCritical = false,
    tr?: LocalizeFn
  ) => {
    const tx = tr || ((_k: string, fallback: string) => fallback)
    const unified = buildUnifiedTransitNarrative(transit, areaLabel, language)
    if (unified?.shortText) return unified.shortText

    const normalizedFallback = String(fallbackText || "").toLowerCase()
    const isGenericFallback =
      normalizedFallback.includes("fase de integracao e calibragem") ||
      normalizedFallback.includes("momento de observacao") ||
      normalizedFallback.includes("traz uma fase")
    if (fallbackText && fallbackText.trim().length > 25 && !isGenericFallback) return fallbackText.trim()
    const transitPlanet = formatPlanetLabel(transit?.transitPlanet || tx('groups.member.transit', 'Transito'))
    const houseTarget = getTransitHouseTarget(transit)
    const houseHint = houseTarget ? ` em ${houseTarget.toLowerCase()}` : ""
    const status = classifyTransitStatus(transit, tx).label
    const timing = formatTransitTimingLabel(transit)
    if (status === tx('groups.status.harmonic', 'Harmonico')) {
      if (areaCritical) return `${transitPlanet}${houseHint}: ${tx('groups.member.direct.harmonicCritical', 'alivio pontual em {area}, sem reverter o quadro sozinho.', { area: areaLabel.toLowerCase() })}`
      if (timing === "Em pico") return `${transitPlanet}${houseHint}: ${tx('groups.member.direct.harmonicPeak', 'fase forte para consolidar resultados em {area}.', { area: areaLabel.toLowerCase() })}`
      if (timing === "Afastando") return `${transitPlanet}${houseHint}: ${tx('groups.member.direct.harmonicAway', 'consolide ganhos e mantenha consistencia em {area}.', { area: areaLabel.toLowerCase() })}`
      return `${transitPlanet}${houseHint}: ${tx('groups.member.direct.harmonicDefault', 'janela favoravel para progresso constante em {area}.', { area: areaLabel.toLowerCase() })}`
    }
    if (status === tx('groups.status.challenging', 'Desafiador')) {
      if (timing === "Em pico") return `${transitPlanet}${houseHint}: ${tx('groups.member.direct.challengingPeak', 'fase sensivel; reduza friccao e ajuste prioridades em {area}.', { area: areaLabel.toLowerCase() })}`
      if (timing === "Afastando") return `${transitPlanet}${houseHint}: ${tx('groups.member.direct.challengingAway', 'finalize correcoes e estabilize o ritmo em {area}.', { area: areaLabel.toLowerCase() })}`
      return `${transitPlanet}${houseHint}: ${tx('groups.member.direct.challengingDefault', 'pede ajuste de rota com menos pressa em {area}.', { area: areaLabel.toLowerCase() })}`
    }
    return `${transitPlanet}${houseHint}: ${tx('groups.member.direct.neutralDefault', 'momento de observacao ativa e escolhas objetivas em {area}.', { area: areaLabel.toLowerCase() })}`
  }

  const computeTransitPriority = (transit: any, areaCritical = false) => {
    const status = classifyTransitStatus(transit)
    let score = status.kind === "tense" ? 30 : status.kind === "harmonic" ? 20 : 12
    if (areaCritical) {
      if (status.kind === "tense") score += 24
      if (status.kind === "harmonic") score -= 6
    }

    const impact = Number(transit?.impact)
    if (Number.isFinite(impact)) score += Math.abs(impact) * 10

    const orb = Number(transit?.orb)
    if (Number.isFinite(orb)) score += Math.max(0, 3 - Math.abs(orb)) * 5

    const timing = formatTransitTimingLabel(transit)
    if (timing === "Em pico") score += 14
    else if (timing === "Em aproximação") score += 8
    else if (timing === "Afastando") score += 4

    return score
  }

  const computeTransitImpactValue = (transit: any, areaCritical = false) => {
    const rank = computeTransitPriority(transit, areaCritical)
    return Math.max(0.08, Math.min(1, rank / 100))
  }

  const getBucketPriority = (bucket: string) => {
    switch (bucket) {
      case "critical":
        return 0
      case "attention":
        return 1
      case "positive":
        return 2
      default:
        return 3
    }
  }

  const normalizeAreaStatusKey = (value?: string | null) => {
    const raw = String(value || '').trim().toLowerCase()
    if (!raw) return ''
    if (raw === 'critical') return 'critico'
    if (raw === 'challenging') return 'desafiador'
    if (raw === 'neutral') return 'neutro'
    if (raw === 'positive') return 'bom'
    if (raw === 'excellent') return 'excelente'
    return raw
  }

  const mapStatusToBucket = (status?: string | null) => {
    const key = normalizeAreaStatusKey(status)
    if (key === 'critico') return 'critical'
    if (key === 'bom' || key === 'excelente') return 'positive'
    if (key === 'desafiador' || key === 'neutro') return 'attention'
    return null
  }

  const buildMemberAreaEntries = (member: GroupMember) => {
    const lifeAreas = resolveMemberLifeAreas(member)
    const sharedAreas = resolveSharedAreas(member)
    const coerceNumber = (value: unknown) => {
      if (typeof value === "number" && Number.isFinite(value)) return value
      if (typeof value === "string") {
        const parsed = Number(value)
        return Number.isFinite(parsed) ? parsed : null
      }
      return null
    }
    const orderedKeys = LIFE_AREA_KEYS.filter((key) => sharedAreas.includes(key))
    return orderedKeys
      .map((key) => {
        const data = (lifeAreas as any)?.[key]
        if (!data) return null
        const percentage = coerceNumber(data.percentage ?? data.status)
        const movementScore = coerceNumber(data.movementScore)
        const attentionScore = coerceNumber(data.attentionScore)
        // Keep group classification aligned with profile cards:
        // when percentage exists, it is the source of truth for thresholds.
        const bucket =
          percentage !== null
            ? mapPercentageToBucket(percentage)
            : (mapStatusToBucket(data.status) || "attention")
        return {
          key,
          label: lifeAreaLabel(key),
          percentage,
          movementScore,
          attentionScore,
          bucket,
        }
      })
      .filter(Boolean) as Array<{
        key: string
        label: string
        percentage: number | null
        movementScore: number | null
        attentionScore: number | null
        bucket: string
      }>
  }

  const getMemberAreaDetail = (member: GroupMember, key: string) => {
    const lifeAreas = resolveMemberLifeAreas(member)
    return (lifeAreas as any)?.[key]
  }

  const formatAreaInfluences = (detail: any) => {
    const main = Array.isArray(detail?.mainPlanets) ? detail.mainPlanets : []
    const infl = Array.isArray(detail?.influences) ? detail.influences : []
    const source = main.length ? main : infl
    if (!source.length) return ""
    return source.slice(0, 3).join(", ")
  }

  const getMemberWorstArea = (member: GroupMember) => {
    const entries = buildMemberAreaEntries(member).filter((entry) => typeof entry.percentage === "number")
    if (!entries.length) return null
    return entries.reduce((worst, entry) => (entry.percentage! < worst.percentage! ? entry : worst), entries[0])
  }

  const getMemberSummaryBucket = (member: GroupMember) => {
    if (!hasVisibleStatus(member)) return "neutral"
    const worst = getMemberWorstArea(member)
    if (worst && typeof worst.percentage === "number") {
      return mapPercentageToBucket(worst.percentage)
    }
    const overall = member.astrologicalStatus?.overall
    if (overall === "critical" || overall === "challenging") return "critical"
    if (overall === "positive" || overall === "excellent") return "positive"
    return "attention"
  }

  const getSummaryRank = (bucket: string) => {
    return getBucketPriority(bucket)
  }

  // Corpo da sinastria (compartilhado pelo Você×membro e pela matriz membro×membro):
  // índice de compatibilidade + aspectos (top-5, ou todos quando expandido, com texto
  // legível) + Guna Milan (total, ou 8 kutas detalhados quando expandido).
  const renderSynastryBody = (
    key: string,
    aspects: SynastryAspect[],
    guna?: ResolvedGunaMilan,
    chartA?: NatalChart,
    chartB?: NatalChart,
    aName?: string,
    bName?: string,
  ) => {
    const expanded = expandedSyn.has(key)
    const score = synastryScore(aspects)
    const shown = expanded ? aspects : aspects.slice(0, 5)
    const isPt = language === 'pt-BR'
    const overlays = expanded && chartA && chartB
      ? synastryHouseOverlays(chartA, chartB, aName || '', bName || '', language)
      : []
    return (
      <>
        {aspects.length > 0 ? (
          <View style={styles.synastryCompatRow}>
            <Text style={styles.synastryCompatText}>
              {`${tr('groups.synastry.compat.title', 'Compatibilidade')}: ${tr(`groups.synastry.compat.${score.bandKey}`, score.bandKey)} · ${score.pct}%`}
            </Text>
            <Text style={styles.synastryCompatMeta}>
              {`${score.harmonics} ${tr('groups.synastry.harmonics', 'harmônicos')} · ${score.tensions} ${tr('groups.synastry.tensions', 'tensos')}`}
            </Text>
          </View>
        ) : null}
        {aspects.length === 0 ? (
          <Text style={styles.synastryEmpty}>{tr('groups.synastry.none', 'Sem aspectos maiores relevantes.')}</Text>
        ) : (
          shown.map((asp, index) => {
            const toneColor = asp.tone === 'harmonioso' ? '#4ECDC4' : asp.tone === 'tenso' ? '#FF6B6B' : '#B39DDB'
            const toneLabel = tr(`groups.synastry.tone.${asp.tone}`, asp.tone)
            const line = expanded ? synastryAspectLine(asp, language) : ''
            return (
              <View key={`${key}-syn-${index}`} style={styles.synastryAspectItem}>
                <View style={styles.synastryRow}>
                  <View style={[styles.synastryToneDot, { backgroundColor: toneColor }]} />
                  <Text style={styles.synastryAspectText} numberOfLines={1}>
                    {`${translatePlanet(asp.mine, language)} ${asp.symbol} ${translatePlanet(asp.theirs, language)}`}
                  </Text>
                  <Text style={styles.synastryMeta}>{`${toneLabel} · ${asp.orb.toFixed(1)}°`}</Text>
                </View>
                {line ? <Text style={styles.synastryAspectLineText}>{line}</Text> : null}
              </View>
            )
          })
        )}
        {aspects.length > 0 ? (
          <TouchableOpacity style={styles.synastryToggle} onPress={() => toggleSyn(key)} activeOpacity={0.7}>
            <Text style={styles.synastryToggleText}>
              {expanded ? tr('groups.synastry.hideFull', 'Recolher ▴') : tr('groups.synastry.viewFull', 'Ver leitura completa ▾')}
            </Text>
          </TouchableOpacity>
        ) : null}
        {guna ? (
          <View style={styles.gunaBox}>
            {/* Só o resultado (pontos), sem veredito de bom/ruim no sistema védico. */}
            <Text style={styles.gunaTitle}>
              {tr('groups.vedic.gunaMilan', 'Guna Milan (védico)')}: {guna.total}/36
            </Text>
            {expanded ? (
              <>
                {guna.kutas.map((k) => (
                  <View key={`${key}-kuta-${k.key}`} style={styles.gunaKutaRow}>
                    <Text style={styles.gunaKutaName}>{k.nome}</Text>
                    <Text style={styles.gunaKutaMeta}>{k.points}/{k.max}{isPt && k.oQueMede ? ` · ${k.oQueMede}` : ''}</Text>
                  </View>
                ))}
              </>
            ) : null}
          </View>
        ) : null}
        {overlays.length > 0 ? (
          <View style={styles.gunaBox}>
            <Text style={styles.gunaTitle}>
              {tr('groups.synastry.housesTitle', 'Casas — o que um ativa no outro')}
            </Text>
            {overlays.map((o, i) => (
              <Text key={`${key}-ov-${i}`} style={styles.synastryAspectLineText}>
                {`${translatePlanet(o.planet, language)} (${o.fromName}) → ${tr('groups.synastry.houseWord', 'Casa')} ${o.house}${o.toName ? ` (${o.toName})` : ''}${o.focus ? `: ${o.focus}` : ''}`}
              </Text>
            ))}
          </View>
        ) : null}
      </>
    )
  }

  const sortedMembers = [...groupMembers].sort((a, b) => {
    if (memberSort === "name") {
      return a.displayName.localeCompare(b.displayName)
    }
    if (memberSort === "recent") {
      const aTime = a.lastStatusUpdate ? new Date(a.lastStatusUpdate).getTime() : 0
      const bTime = b.lastStatusUpdate ? new Date(b.lastStatusUpdate).getTime() : 0
      return bTime - aTime
    }
    const aBucket = getMemberSummaryBucket(a)
    const bBucket = getMemberSummaryBucket(b)
    const rankDiff = getSummaryRank(aBucket) - getSummaryRank(bBucket)
    if (rankDiff !== 0) return rankDiff
    return a.displayName.localeCompare(b.displayName)
  })

  const otherMembers = sortedMembers.filter((member) => member.userId !== user?.uid)
  const visibleMembers = otherMembers.filter((member) => hasVisibleStatus(member))
  // Summary must reflect the whole group state (including current user when status is visible).
  const summaryMembers = sortedMembers.filter((member) => hasVisibleStatus(member))

  const memberStatusCounts = summaryMembers.reduce(
    (acc, member) => {
      const entries = buildMemberAreaEntries(member)
      entries.forEach((entry) => {
        if (entry.bucket === "critical") acc.critical += 1
        if (entry.bucket === "positive") acc.positive += 1
      })
      return acc
    },
    { critical: 0, positive: 0 }
  )

  const highlightMembers = summaryMembers
    .filter((member) => getMemberSummaryBucket(member) === "critical")
    .slice(0, 3)

  // Resumo do grupo: TODOS os membros com status visível (não só os críticos).
  // Cada um traz a média das áreas (score geral) e a pior área. Ordenado por
  // fragilidade (pior área asc) para o mais delicado aparecer primeiro. Antes só
  // membros com área <35 apareciam, então quem tinha áreas "desafiador" (35–49)
  // sumia do panorama mesmo estando frágil.
  const memberSummaries = summaryMembers
    .map((member) => {
      const entries = buildMemberAreaEntries(member).filter((e) => typeof e.percentage === "number")
      const avg = entries.length
        ? Math.round(entries.reduce((s, e) => s + (e.percentage as number), 0) / entries.length)
        : null
      const worst = getMemberWorstArea(member)
      return { member, avg, worst, worstPct: typeof worst?.percentage === "number" ? Math.round(worst.percentage) : null }
    })
    .sort((a, b) => {
      const av = a.worstPct ?? 999
      const bv = b.worstPct ?? 999
      if (av !== bv) return av - bv
      return a.member.displayName.localeCompare(b.member.displayName)
    })

  if (loading) {
    return (
      <LinearGradient colors={["#0F0F23", "#1A1A3A"]} style={styles.container}>
        <View style={styles.loadingContainer}>
          <StarLoader size={36} color="#FFD700" />
          <Text style={styles.loadingText}>{tr('groups.loading', 'Carregando grupos...')}</Text>
        </View>
      </LinearGradient>
    )
  }

  if (!isPremium) {
    return (
      <LinearGradient colors={["#0F0F23", "#1A1A3A"]} style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.lockedState}>
            <Ionicons name="lock-closed-outline" size={56} color="#FFD700" />
            <Text style={styles.lockedStateTitle}>{tr('groupsAccess.title', 'Acesso aos grupos')}</Text>
            <Text style={styles.lockedStateText}>
              {tr('groupsAccess.subtitle', 'Ative o Premium para criar e participar de grupos.')}
            </Text>
            <TouchableOpacity
              style={styles.lockedStateButton}
              onPress={() => (navigation as any).navigate("Premium", { openTab: "features" })}
            >
              <Text style={styles.lockedStateButtonText}>{tr('groupsAccess.cta', 'Ver planos')}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    )
  }

  return (
    <LinearGradient colors={["#0F0F23", "#1A1A3A"]} style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadUserGroups} />}
      >
        {/* Header com seletor de grupos */}
        <View style={styles.header}>
          <View style={styles.headerTopRow}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.groupSelector}>
              {(groups || []).map((group) => (
                <TouchableOpacity
                  key={group.id}
                  style={[styles.groupTab, selectedGroup?.id === group.id && styles.groupTabActive]}
                  onPress={() => setSelectedGroup(group)}
                >
                  <Text style={[styles.groupTabText, selectedGroup?.id === group.id && styles.groupTabTextActive]}>
                    {group.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={styles.headerActionsInline}>
              {groups.length > 1 ? (
                <TouchableOpacity style={styles.groupHeaderActionButton} onPress={openGroupOrder}>
                  <Ionicons name="swap-vertical" size={18} color="#FFD700" />
                </TouchableOpacity>
              ) : null}
              <TouchableOpacity style={styles.groupHeaderActionButton} onPress={openGroupActions}>
                <Ionicons name="add" size={20} color="#FFD700" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {expiryInfo.show && (
          <ExpiryBanner
            message={expiryMessage}
            variant={expiryInfo.variant}
            onPress={() => (navigation as any).navigate("Premium", { openTab: 'features' })}
          />
        )}

        {selectedGroup && (
          <>
            <View style={styles.groupHeaderInline}>
              <View style={styles.groupHeaderTitleRow}>
                <View style={styles.groupHeaderTitles}>
                  <Text style={styles.groupHeaderTitle}>{selectedGroup.name}</Text>
                  <Text style={styles.groupHeaderSubtitle}>{selectedGroup.description || tr('groups.label.astroGroup', 'Grupo astrologico')}</Text>
                </View>
                <View style={styles.groupHeaderActionsColumn}>
                  <View style={styles.groupHeaderActionsRow}>
                    <TouchableOpacity
                      style={styles.groupHeaderActionButton}
                      onPress={() => {
                        setSelectedGroupForDetail(selectedGroup)
                        setShowGroupDetail(true)
                      }}
                    >
                      <Ionicons name="ellipsis-horizontal" size={18} color="#FFD700" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.groupHeaderPreferencesButton} onPress={openGroupSettings}>
                      <Ionicons name="options" size={12} color="#FFD700" />
                      <Text style={styles.groupHeaderPreferencesText}>{tr('groups.label.preferences', 'Preferencias')}</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.groupHeaderMetaRow}>
                    <Text style={styles.groupMetaTextInline}>
                      {tr('groups.label.membersCount', '{count} membros', { count: selectedGroup.members?.length || groupMembers.length })}
                    </Text>
                    <Text style={styles.groupMetaDot}>-</Text>
                    <Text style={styles.groupMetaTextInline}>
                      {tr('groups.label.areasCount', '{count} areas', {
                        count: (selectedGroup.sharedLifeAreas || LIFE_AREA_KEYS).length,
                      })}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.groupSummaryCard}>
              <View style={styles.groupSummaryHeader}>
                <Text style={styles.sectionTitle}>{tr('groups.section.generalStatus', 'Status geral')}</Text>
                <View style={styles.groupSummaryCounters}>
                  <View style={[styles.groupSummaryCounterCompact, styles.summaryCritical]}>
                    <Text style={styles.groupSummaryValueCompact}>{memberStatusCounts.critical}</Text>
                    <Text style={styles.groupSummaryLabelCompact}>{tr('groups.status.criticalAreas', 'Áreas críticas')}</Text>
                  </View>
                  <View style={[styles.groupSummaryCounterCompact, styles.summaryPositive]}>
                    <Text style={styles.groupSummaryValueCompact}>{memberStatusCounts.positive}</Text>
                    <Text style={styles.groupSummaryLabelCompact}>{tr('groups.status.positiveAreas', 'Áreas positivas')}</Text>
                  </View>
                </View>
              </View>
              {memberSummaries.length > 0 && (
                <>
                  <View style={[styles.attentionHeader, styles.attentionHeaderCompact]}>
                    <Text style={styles.sectionTitle}>{tr('groups.section.memberSummary', 'Resumo dos membros')}</Text>
                  </View>
                  {memberSummaries.map(({ member, avg, worst, worstPct }) => {
                    const worstBucket = worst ? worst.bucket : getMemberSummaryBucket(member)
                    return (
                      <View key={member.userId} style={styles.attentionRow}>
                        <Avatar photoUrl={member.profilePhoto} name={member.displayName} size="small" />
                        <View style={styles.attentionInfo}>
                          <Text style={styles.attentionName}>{member.displayName}</Text>
                          <Text style={styles.attentionMeta}>
                            {worst
                              ? `${tr('groups.label.worst', 'Mais frágil')}: ${worst.label}${worstPct !== null ? ` ${worstPct}%` : ""}`
                              : tr('groups.label.areaUnavailable', 'Area indisponivel')}
                          </Text>
                        </View>
                        {avg !== null && (
                          <View style={styles.summaryScorePill}>
                            <Text style={[styles.summaryScoreValue, { color: mapBucketToColor(mapPercentageToBucket(avg)) }]}>{avg}</Text>
                            <Text style={styles.summaryScoreLabel}>{tr('groups.label.avg', 'média')}</Text>
                          </View>
                        )}
                        <Text style={[styles.attentionStatus, { color: mapBucketToColor(worstBucket) }]}>
                          {member.lastStatusUpdate ? `${formatRelativeTime(member.lastStatusUpdate)}` : tr('groups.label.now', 'Agora')}
                        </Text>
                      </View>
                    )
                  })}
                </>
              )}
            </View>

            <View style={styles.membersSection}>
              <View style={styles.sectionTitleRow}>
                <Text style={styles.sectionTitle}>{tr('groups.section.members', 'Membros')}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  {selectedGroup?.createdBy === user?.uid ? (
                    <TouchableOpacity
                      style={styles.sectionIconButton}
                      onPress={() => setShowAddManaged(true)}
                      accessibilityRole="button"
                      accessibilityLabel={tr('groups.managed.add', 'Adicionar pessoa')}
                    >
                      <Ionicons name="person-add-outline" size={16} color="#FFD700" />
                    </TouchableOpacity>
                  ) : null}
                  <TouchableOpacity style={styles.sectionIconButton} onPress={openMemberSort}>
                    <Ionicons name="swap-vertical" size={16} color="#FFD700" />
                  </TouchableOpacity>
                </View>
              </View>
              {otherMembers.map((member) => {
                const hasStatus = hasVisibleStatus(member)
                const entries = hasStatus ? buildMemberAreaEntries(member) : []
                return (
                  <View key={member.userId} style={styles.memberCardCompact}>
                    <View style={styles.memberHeaderCompact}>
                      <Avatar photoUrl={member.profilePhoto} name={member.displayName} size="small" />
                      <View style={styles.memberHeaderInfo}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                          <Text style={[styles.memberRowName, { flexShrink: 1 }]} numberOfLines={1}>
                            {member.displayName}
                          </Text>
                          {member.isManaged ? (
                            <View style={styles.managedBadge}>
                              <Text style={styles.managedBadgeText}>{tr('groups.managed.badge', 'gerenciado')}</Text>
                            </View>
                          ) : null}
                        </View>
                        <Text style={styles.memberRowUpdate} numberOfLines={1}>
                          {member.subscriptionActive === false
                            && !member.isAdmin
                            ? tr('groups.member.noSubscription', 'Sem assinatura')
                            : !hasStatus
                              ? tr('groups.label.privateStatus', 'Status privado')
                              : member.lastStatusUpdate
                                ? tr('groups.label.updatedAgo', 'Atualizado ha {time}', { time: formatRelativeTime(new Date(member.lastStatusUpdate)) })
                                : tr('groups.label.noRecentUpdate', 'Sem atualizacao recente')}
                        </Text>
                      </View>
                      {member.birthData?.datetime && member.birthData?.coordinates ? (
                        <TouchableOpacity
                          style={styles.memberChartBtn}
                          activeOpacity={0.8}
                          accessibilityRole="button"
                          accessibilityLabel={tr('groups.member.viewChart', 'Ver mapa completo')}
                          onPress={() => (navigation as any).navigate('MemberProfile', {
                            member: { displayName: member.displayName, profilePhoto: member.profilePhoto, birthData: member.birthData },
                          })}
                        >
                          <Ionicons name="planet-outline" size={14} color="#FFD700" />
                          <Text style={styles.memberChartBtnText} numberOfLines={1}>
                            {tr('groups.member.viewChart', 'Ver mapa completo')}
                          </Text>
                        </TouchableOpacity>
                      ) : null}
                      {member.isManaged && selectedGroup?.createdBy === user?.uid ? (
                        <TouchableOpacity
                          style={styles.memberChartBtn}
                          onPress={() => handleInviteManaged(member)}
                          accessibilityRole="button"
                          accessibilityLabel={tr('groups.claim.invite', 'Convidar')}
                        >
                          <Ionicons name="link-outline" size={14} color="#FFD700" />
                          <Text style={styles.memberChartBtnText}>{tr('groups.claim.invite', 'Convidar')}</Text>
                        </TouchableOpacity>
                      ) : null}
                      {member.isManaged && selectedGroup?.createdBy === user?.uid ? (
                        <TouchableOpacity
                          style={styles.managedRemoveBtn}
                          onPress={() => handleRemoveManaged(member)}
                          accessibilityRole="button"
                          accessibilityLabel={tr('groups.managed.remove', 'Remover perfil')}
                        >
                          <Ionicons name="trash-outline" size={14} color="#FF6B6B" />
                        </TouchableOpacity>
                      ) : null}
                    </View>

                    {hasStatus && entries.length > 0 ? (
                      <View style={styles.memberStatusGridCompact}>
                        {entries.map((entry) => {
                          const percentage =
                            typeof entry.percentage === "number" ? Math.round(entry.percentage) : null
                          const fillColor = mapBucketToColor(entry.bucket)
                          const movement = normalizeAxisScore(entry.movementScore)
                          const attention = normalizeAxisScore(entry.attentionScore)
                          const movementHot = typeof movement === "number" && movement >= 70
                          const attentionHot = typeof attention === "number" && attention >= 70
                          const cardColors = LIFE_AREA_COLORS[entry.key] || ["#4B5563", "#6B7280"]
                          return (
                            <TouchableOpacity
                              key={`${member.userId}-${entry.key}`}
                              style={styles.memberStatusMiniCard}
                              activeOpacity={0.8}
                              onPress={() => {
                                setSelectedMemberArea({ member, key: entry.key })
                                setShowMemberAreaCalc(false)
                                setShowMemberAreaModal(true)
                              }}
                            >
                              <LinearGradient colors={cardColors as [string, string]} style={styles.memberStatusMiniInner}>
                                <View style={styles.memberStatusMiniHeader}>
                                  <Text style={styles.memberStatusMiniLabel} numberOfLines={1}>
                                    {entry.label}
                                  </Text>
                                  {(movementHot || attentionHot) ? (
                                    <View style={styles.memberSignalBadges}>
                                      {movementHot ? (
                                        <View style={[styles.memberSignalBadge, styles.memberSignalBadgeMovement]}>
                                          <Text style={styles.memberSignalBadgeText}>{getAxisShortLabel('movement')}</Text>
                                        </View>
                                      ) : null}
                                      {attentionHot ? (
                                        <View style={[styles.memberSignalBadge, styles.memberSignalBadgeAttention]}>
                                          <Text style={styles.memberSignalBadgeText}>{getAxisShortLabel('attention')}</Text>
                                        </View>
                                      ) : null}
                                    </View>
                                  ) : null}
                                </View>
                                <Text style={styles.memberStatusMiniValue}>
                                  {percentage !== null ? `${percentage}%` : "--"}
                                </Text>
                                <View style={styles.memberAxisRow}>
                                  <Text style={styles.memberAxisLabel}>{getAxisShortLabel('movement')}</Text>
                                  <View style={styles.memberAxisTrack}>
                                    <View
                                      style={[
                                        styles.memberAxisFill,
                                        styles.memberAxisFillMovement,
                                        { width: `${movement ?? 0}%` },
                                      ]}
                                    />
                                  </View>
                                  <Text style={styles.memberAxisValue}>{movement ?? "--"}</Text>
                                </View>
                                <View style={styles.memberAxisRow}>
                                  <Text style={styles.memberAxisLabel}>{getAxisShortLabel('attention')}</Text>
                                  <View style={styles.memberAxisTrack}>
                                    <View
                                      style={[
                                        styles.memberAxisFill,
                                        styles.memberAxisFillAttention,
                                        { width: `${attention ?? 0}%` },
                                      ]}
                                    />
                                  </View>
                                  <Text style={styles.memberAxisValue}>{attention ?? "--"}</Text>
                                </View>
                              </LinearGradient>
                            </TouchableOpacity>
                          )
                        })}
                      </View>
                    ) : (
                      <Text style={styles.memberDetailEmpty}>{tr('groups.label.privateStatusGroup', 'Status privado para este grupo.')}</Text>
                    )}
                  </View>
                )
              })}
            </View>

            {selectedGroup && !synastryMineMissing && (synastryLoading || Object.keys(synastryByMember).length > 0) ? (
              <View style={styles.synastrySection}>
                <View style={styles.synastryHeader}>
                  <Ionicons name="git-compare-outline" size={18} color="#FFD700" />
                  <Text style={styles.synastryTitle}>{tr('groups.synastry.title', 'Sinastria')}</Text>
                </View>
                <Text style={styles.synastrySubtitle}>
                  {tr('groups.synastry.subtitle', 'Aspectos entre o seu mapa e o de cada membro')}
                </Text>
                {synastryLoading && Object.keys(synastryByMember).length === 0 ? (
                  <ActivityIndicator color="#FFD700" style={{ marginVertical: 14 }} />
                ) : (
                  otherMembers
                    .filter((member) => member.birthData?.datetime && member.birthData?.coordinates)
                    .map((member) => {
                      const aspects = synastryByMember[member.userId] || []
                      return (
                        <View key={`syn-${member.userId}`} style={styles.synastryCard}>
                          <Text style={styles.synastryMemberName} numberOfLines={1}>
                            {member.displayName}
                          </Text>
                          {renderSynastryBody(member.userId, aspects, gunaMilanByMember[member.userId], chartByMember[user?.uid || ''], chartByMember[member.userId], tr('groups.synastry.you', 'Você'), member.displayName)}
                        </View>
                      )
                    })
                )}
                <Text style={styles.synastryFootnote}>
                  {tr('groups.synastry.footnote', 'Leituras detalhadas em breve.')}
                </Text>
              </View>
            ) : null}

            {/* Sinastria ENTRE os participantes (matriz de todas as duplas, fora você) */}
            {selectedGroup && pairSynastry.length > 0 ? (
              <View style={styles.synastrySection}>
                <View style={styles.synastryHeader}>
                  <Ionicons name="people-circle-outline" size={18} color="#FFD700" />
                  <Text style={styles.synastryTitle}>
                    {tr('groups.synastry.pairsTitle', 'Sinastria entre participantes')}
                  </Text>
                </View>
                <Text style={styles.synastrySubtitle}>
                  {tr('groups.synastry.pairsSubtitle', 'Aspectos entre os membros do grupo')}
                </Text>
                {pairSynastry.map((pair) => (
                  <View key={`pair-${pair.id}`} style={styles.synastryCard}>
                    <Text style={styles.synastryMemberName} numberOfLines={1}>
                      {`${pair.aName}  ×  ${pair.bName}`}
                    </Text>
                    {renderSynastryBody(pair.id, pair.aspects, pair.guna, chartByMember[pair.aId], chartByMember[pair.bId], pair.aName, pair.bName)}
                  </View>
                ))}
                <Text style={styles.synastryFootnote}>
                  {tr('groups.synastry.footnote', 'Leituras detalhadas em breve.')}
                </Text>
              </View>
            ) : null}

          </>
        )}

        {groups.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={64} color="#666" />
            <Text style={styles.emptyStateTitle}>{tr('groups.empty.title', 'Nenhum grupo encontrado')}</Text>
            <Text style={styles.emptyStateText}>
              {tr('groups.empty.body', 'Crie seu primeiro grupo ou entre em um existente usando um codigo de convite')}
            </Text>
            <TouchableOpacity style={styles.createFirstGroupButton} onPress={() => setShowCreateModal(true)}>
              <Text style={styles.createFirstGroupButtonText}>{tr('groups.empty.createFirst', 'Criar primeiro grupo')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.joinByCodeButton} onPress={() => setShowJoinModal(true)}>
              <Text style={styles.joinByCodeButtonText}>{tr('groups.empty.joinByCode', 'Inserir codigo de convite')}</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <Modal visible={showGroupOrderModal} transparent animationType="fade" onRequestClose={() => setShowGroupOrderModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.orderModalContent}>
            <Text style={styles.modalTitle}>{tr('groups.modal.orderGroups', 'Ordenar grupos')}</Text>
            <ScrollView style={styles.orderModalList}>
              {(groupOrderDraft.length ? groupOrderDraft : groups.map((group) => group.id)).map((groupId, index, arr) => {
                const group = groups.find((item) => item.id === groupId)
                if (!group) return null
                return (
                  <View key={groupId} style={styles.orderRow}>
                    <Text style={styles.orderRowText}>{group.name}</Text>
                    <View style={styles.orderRowActions}>
                      <TouchableOpacity
                        style={[styles.orderIconButton, index === 0 && styles.orderIconDisabled]}
                        onPress={() => moveGroupOrder(groupId, "up")}
                        disabled={index === 0}
                      >
                        <Ionicons name="chevron-up" size={16} color="#FFD700" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.orderIconButton, index === arr.length - 1 && styles.orderIconDisabled]}
                        onPress={() => moveGroupOrder(groupId, "down")}
                        disabled={index === arr.length - 1}
                      >
                        <Ionicons name="chevron-down" size={16} color="#FFD700" />
                      </TouchableOpacity>
                    </View>
                  </View>
                )
              })}
            </ScrollView>
            <View style={styles.orderModalFooter}>
              <TouchableOpacity style={styles.modalButtonCancel} onPress={() => setShowGroupOrderModal(false)}>
                <Text style={styles.modalButtonCancelText}>{tr('common.cancel', 'Cancelar')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButtonConfirm} onPress={applyGroupOrder}>
                <Text style={styles.modalButtonConfirmText}>{tr('groups.action.save', 'Salvar')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        visible={showGroupActionsModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowGroupActionsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{tr('groups.modal.groupsTitle', 'Grupos')}</Text>
            <Text style={styles.modalSubtitle}>{tr('groups.modal.whatToDo', 'O que deseja fazer?')}</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButtonCancel}
                onPress={() => setShowGroupActionsModal(false)}
              >
                <Text style={styles.modalButtonCancelText}>{tr('common.cancel', 'Cancelar')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButtonConfirm}
                onPress={() => {
                  setShowGroupActionsModal(false)
                  setShowCreateModal(true)
                }}
              >
                <Text style={styles.modalButtonConfirmText}>{tr('groups.action.createGroup', 'Criar grupo')}</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={[styles.modalButtonConfirm, styles.modalButtonFullWidth]}
              onPress={() => {
                setShowGroupActionsModal(false)
                setShowJoinModal(true)
              }}
            >
              <Text style={styles.modalButtonConfirmText}>{tr('groups.action.joinGroup', 'Entrar em grupo')}</Text>
            </TouchableOpacity>
            {selectedGroup ? (
              <TouchableOpacity
                style={[styles.modalButtonConfirm, styles.modalButtonFullWidth]}
                onPress={() => {
                  setShowGroupActionsModal(false)
                  setSelectedGroupForDetail(selectedGroup)
                  setShowGroupDetail(true)
                }}
              >
                <Text style={styles.modalButtonConfirmText}>
                  {tr('groups.action.inviteMember', 'Convidar um membro para este grupo')}
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </Modal>

      <Modal
        visible={showMemberSortModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMemberSortModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{tr('groups.modal.orderMembers', 'Ordenar membros')}</Text>
            <Text style={styles.modalSubtitle}>{tr('groups.modal.chooseOrder', 'Escolha a ordem de exibicao')}</Text>
            {[
              { key: "status" as const, label: tr('groups.sort.status', 'Status') },
              { key: "name" as const, label: tr('groups.sort.name', 'Nome (A-Z)') },
              { key: "recent" as const, label: tr('groups.sort.recent', 'Atualizado recente') },
            ].map((option) => (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.modalOptionButton,
                  memberSort === option.key && styles.modalOptionButtonActive,
                ]}
                onPress={() => {
                  setMemberSort(option.key)
                  setShowMemberSortModal(false)
                }}
              >
                <Text
                  style={[
                    styles.modalOptionText,
                    memberSort === option.key && styles.modalOptionTextActive,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={[styles.modalButtonCancel, styles.modalButtonFullWidth]}
              onPress={() => setShowMemberSortModal(false)}
            >
              <Text style={styles.modalButtonCancelText}>{tr('common.cancel', 'Cancelar')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Modal Criar Grupo */}
      <Modal visible={showCreateModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{tr('groups.modal.createTitle', 'Criar Novo Grupo')}</Text>

            <TextInput
              style={styles.modalInput}
              placeholder={tr('groups.modal.groupNamePlaceholder', 'Nome do grupo')}
              placeholderTextColor="#888"
              value={newGroupName}
              onChangeText={setNewGroupName}
            />

            <TextInput
              style={[styles.modalInput, styles.modalTextArea]}
              placeholder={tr('groups.modal.groupDescPlaceholder', 'Descricao (opcional)')}
              placeholderTextColor="#888"
              value={newGroupDescription}
              onChangeText={setNewGroupDescription}
              multiline
              numberOfLines={3}
            />
            <Text style={styles.modalLabel}>Áreas compartilhadas (padrão do grupo)</Text>
            <View style={styles.lifeAreaOptions}>
              {LIFE_AREA_OPTIONS.map((area) => {
                const active = newGroupSharedLifeAreas.includes(area.key)
                return (
                  <TouchableOpacity
                    key={`shared-${area.key}`}
                    style={[styles.lifeAreaOption, active && styles.lifeAreaOptionActive]}
                    onPress={() =>
                      setNewGroupSharedLifeAreas((prev) => toggleLifeArea(prev, area.key))
                    }
                  >
                    <Text style={[styles.lifeAreaOptionText, active && styles.lifeAreaOptionTextActive]}>
                      {lifeAreaLabel(area.key)}
                    </Text>
                  </TouchableOpacity>
                )
              })}
            </View>

            <Text style={styles.modalLabel}>Áreas notificadas (padrão do grupo)</Text>
            <View style={styles.lifeAreaOptions}>
              {LIFE_AREA_OPTIONS.map((area) => {
                const active = newGroupNotifiedLifeAreas.includes(area.key)
                return (
                  <TouchableOpacity
                    key={`notified-${area.key}`}
                    style={[styles.lifeAreaOption, active && styles.lifeAreaOptionActive]}
                    onPress={() =>
                      setNewGroupNotifiedLifeAreas((prev) => toggleLifeArea(prev, area.key))
                    }
                  >
                    <Text style={[styles.lifeAreaOptionText, active && styles.lifeAreaOptionTextActive]}>
                      {lifeAreaLabel(area.key)}
                    </Text>
                  </TouchableOpacity>
                )
              })}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButtonCancel}
                onPress={() => {
                  setShowCreateModal(false)
                  setNewGroupName("")
                  setNewGroupDescription("")
                  setNewGroupSharedLifeAreas(LIFE_AREA_KEYS)
                  setNewGroupNotifiedLifeAreas(LIFE_AREA_KEYS)
                }}
              >
                <Text style={styles.modalButtonCancelText}>{tr('common.cancel', 'Cancelar')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButtonConfirm} onPress={createGroup}>
                <Text style={styles.modalButtonConfirmText}>{tr('common.create', 'Criar')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Entrar no Grupo */}
      <Modal visible={showJoinModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{tr('groups.modal.joinTitle', 'Entrar no Grupo')}</Text>

            <TextInput
              style={styles.modalInput}
              placeholder={tr('groups.modal.inviteCode', 'Codigo de convite')}
              placeholderTextColor="#888"
              value={inviteCode}
              onChangeText={setInviteCode}
              autoCapitalize="characters"
            />
            {invitePreviewLoading && (
              <Text style={styles.invitePreviewText}>{tr('groups.loadingGroup', 'Carregando grupo...')}</Text>
            )}

            {invitePreview && (
              <View style={styles.invitePreviewBox}>
                <Text style={styles.invitePreviewTitle}>{invitePreview.name}</Text>
                <Text style={styles.invitePreviewText}>
                  {tr('groups.modal.sharedAreasPrefix', 'Areas compartilhadas')}: {formatLifeAreasLocalized(invitePreview.sharedLifeAreas)}
                </Text>
                <Text style={styles.invitePreviewText}>
                  {tr('groups.modal.notifiedAreasPrefix', 'Areas notificadas')}: {formatLifeAreasLocalized(invitePreview.notifiedLifeAreas)}
                </Text>
                {invitePreview.inviteEnabled === false && (
                  <Text style={styles.invitePreviewError}>{tr('groups.invite.disabledByAdmin', 'Convite desativado pelo admin')}</Text>
                )}
                {invitePreview.inviteExpiresAt && invitePreview.inviteExpiresAt.getTime() < Date.now() && (
                  <Text style={styles.invitePreviewError}>{tr('groups.invite.expired', 'Convite expirado')}</Text>
                )}
              </View>
            )}

            {!!invitePreviewError && (
              <Text style={styles.invitePreviewError}>{invitePreviewError}</Text>
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButtonCancel}
                onPress={() => {
                  setShowJoinModal(false)
                  setInviteCode("")
                  setInvitePreview(null)
                  setInvitePreviewError("")
                }}
              >
                <Text style={styles.modalButtonCancelText}>{tr('common.cancel', 'Cancelar')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButtonConfirm} onPress={joinGroup}>
                <Text style={styles.modalButtonConfirmText}>{tr('groups.action.join', 'Entrar')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Enviar Mensagem */}
      <Modal visible={showMessageModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{tr('groups.modal.messageTitle', 'Enviar Mensagem para o Grupo')}</Text>

            <Text style={styles.modalSubtitle}>
              {tr('groups.modal.messageSubtitle', 'Todos os membros do grupo receberao uma notificacao')}
            </Text>

            <TextInput
              style={[styles.modalInput, styles.modalTextArea]}
              placeholder={tr('groups.modal.typeMessage', 'Digite sua mensagem...')}
              placeholderTextColor="#888"
              value={groupMessage}
              onChangeText={setGroupMessage}
              multiline
              numberOfLines={4}
              maxLength={200}
            />

            <Text style={styles.characterCount}>
              {tr('groups.modal.charCount', '{count}/200 caracteres', { count: groupMessage.length })}
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButtonCancel}
                onPress={() => {
                  setShowMessageModal(false)
                  setGroupMessage("")
                }}
              >
                <Text style={styles.modalButtonCancelText}>{tr('common.cancel', 'Cancelar')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButtonConfirm, sendingNotification && styles.modalButtonDisabled]}
                onPress={sendGroupMessage}
                disabled={sendingNotification || !groupMessage.trim()}
              >
                <Text style={styles.modalButtonConfirmText}>
                  {sendingNotification ? tr('common.sending', 'Enviando...') : tr('common.send', 'Enviar')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de Detalhes do Grupo */}
      <Modal
        visible={showMemberAreaModal}
        transparent
        animationType="fade"
        onRequestClose={closeMemberAreaModal}
      >
        <View style={styles.memberAreaBackdrop}>
          <Animated.View
            style={[
              styles.memberAreaCard,
              {
                transform: [{ translateY: memberAreaSwipeY }],
              },
            ]}
            {...memberAreaPanResponder.panHandlers}
          >
            {(() => {
              if (!selectedMemberArea) return null
              const { member, key } = selectedMemberArea
              const detail = getMemberAreaDetail(member, key) || {}
              const percentageRaw =
                typeof detail?.percentage === "number"
                  ? detail.percentage
                  : typeof detail?.status === "number"
                    ? detail.status
                    : null
              const percentage =
                typeof percentageRaw === "number" ? Math.round(percentageRaw) : null
              const bucket = mapPercentageToBucket(percentageRaw ?? undefined)
              const barColor = mapBucketToColor(bucket)
              const mainPlanets = Array.isArray(detail?.mainPlanets) ? detail.mainPlanets : []
              const suggestionItems = Array.isArray(detail?.suggestions) ? detail.suggestions : []
              const activeTransitItems = Array.isArray(detail?.activeTransits) ? detail.activeTransits : []
              const areaTransits = Array.isArray(member.areaTransits?.[key])
                ? member.areaTransits?.[key]
                : []
              const mergedTransitItems = [...activeTransitItems, ...areaTransits]
              const transitAspects = mergedTransitItems.map((transit: any) => {
                const label = `${formatPlanetLabel(transit.transitPlanet)} ${formatAspectLabel(transit.type)} ${formatPlanetLabel(transit.natalPlanet)}`
                const duration = formatTransitDuration(transit)
                return duration ? `${label} (${duration})` : label
              })
              const activeTransitLabels = activeTransitItems.map((transit: any) => {
                const aspectLabel = formatAspectLabel(transit.aspectName || transit.type || "")
                const targetPlanet = transit.target?.natalPlanet
                const targetAngle = transit.target?.angle
                const targetHouse =
                  typeof transit.target?.house === "number" ? `Casa ${transit.target.house}` : ""
                const targetLabel =
                  targetPlanet
                    ? formatPlanetLabel(targetPlanet)
                    : targetAngle
                      ? String(targetAngle)
                      : targetHouse
                const timingLabel = formatTransitTimingLabel(transit)
                if (!targetLabel) {
                  return timingLabel
                    ? `${formatPlanetLabel(transit.transitPlanet)} ${aspectLabel} (${timingLabel})`
                    : `${formatPlanetLabel(transit.transitPlanet)} ${aspectLabel}`
                }
                return timingLabel
                  ? `${formatPlanetLabel(transit.transitPlanet)} ${aspectLabel} ${targetLabel} (${timingLabel})`
                  : `${formatPlanetLabel(transit.transitPlanet)} ${aspectLabel} ${targetLabel}`
              })
              const fallbackAspects = Array.isArray(member.astrologicalStatus?.criticalTransits)
                ? member.astrologicalStatus?.criticalTransits.map(
                  (item) => `${item.planet} ${item.aspect}: ${item.description}`
                )
                : []
              const resolvedAspects = transitAspects.length ? transitAspects : fallbackAspects
              const resolvedActiveTransits =
                activeTransitLabels.length || activeTransitItems.length
                  ? activeTransitLabels
                  : transitAspects
              const fallbackSuggestionItems =
                suggestionItems.length
                  ? suggestionItems
                  : (mergedTransitItems.length ? mergedTransitItems : [])
                    .slice(0, 2)
                    .map((transit: any, index: number) => {
                      const aspectType = String(transit.aspectType || transit.type || "")
                      const isHarmonious = ["harmonic", "trigono", "sextil"].includes(aspectType)
                      const isChallenging = [
                        "tense",
                        "quadratura",
                        "oposicao",
                        "quincuncio",
                        "semiquadratura",
                        "sesquiquadratura",
                      ].includes(aspectType)
                      const areaLabel = lifeAreaLabel(key)
                      const title = isHarmonious
                        ? tr('groups.suggestion.useOpportunities', 'Aproveitar oportunidades')
                        : isChallenging
                          ? tr('groups.suggestion.reviewAdjust', 'Rever e ajustar')
                          : tr('groups.suggestion.organizeObserve', 'Organizar e observar')
                      const text = isHarmonious
                        ? tr('groups.suggestion.goodPhase', 'Boa fase para fortalecer iniciativas em {area}.', { area: areaLabel })
                        : isChallenging
                          ? tr('groups.suggestion.adjustments', 'Periodo de ajustes e revisoes em {area}.', { area: areaLabel })
                          : tr('groups.suggestion.observeSignals', 'Momento de observar sinais e organizar passos em {area}.', { area: areaLabel })
                      return {
                        id: `fallback-${key}-${index}`,
                        title,
                        text,
                      }
                    })
              const cardColors = LIFE_AREA_COLORS[key] || ["#4B5563", "#6B7280"]

              return (
                <>
                  <LinearGradient colors={cardColors as [string, string]} style={styles.memberAreaHeader}>
                    <Text style={styles.memberAreaTitle}>{lifeAreaLabel(key)}</Text>
                    <Text style={styles.memberAreaPercent}>
                      {percentage !== null ? `${percentage}%` : "--"}
                    </Text>
                    <View style={styles.memberAreaBarTrack}>
                      <View
                        style={[
                          styles.memberAreaBarFill,
                          {
                            width: `${Math.min(100, Math.max(0, percentage || 0))}%`,
                            backgroundColor: barColor,
                          },
                        ]}
                      />
                    </View>
                  </LinearGradient>

                  <ScrollView
                    style={styles.memberAreaContent}
                    showsVerticalScrollIndicator={false}
                    scrollEventThrottle={16}
                    onScroll={(event) => {
                      memberAreaScrollOffsetYRef.current = event.nativeEvent.contentOffset.y
                    }}
                  >
                    {(() => {
                      const areaLabel = lifeAreaLabel(key)
                      const areaCritical = bucket === "critical"
                      const baseTransits: MemberAreaTransitItem[] = mergedTransitItems.map((transit: any, index: number) => {
                        const status = classifyTransitStatus(transit, tr)
                        const title = buildTransitTitle(transit, key)
                        const houseLabels = getTransitHouseLabels(transit)
                        const natalHouseLabel = getTransitNatalHouse(transit)
                        const transitHouseLabel = getTransitCurrentHouse(transit)
                        const houseLabel = houseLabels[0] || null
                        const houseLabelPrefix = natalHouseLabel
                          ? tr('groups.member.natalActivatedHouse', 'Casa natal ativada')
                          : tr('groups.member.currentTransitHouse', 'Casa de transito atual')
                        const areaHousesText = AREA_HOUSES[key]?.length ? AREA_HOUSES[key].join("/") : ""
                        const technicalParts = [getTransitTechnicalTypeLabel(transit, tr)]
                        if (houseLabels.length > 1 && transitHouseLabel && natalHouseLabel && transitHouseLabel !== natalHouseLabel) {
                          technicalParts.push(
                            tr('groups.member.natalActivatedHouseValue', 'Casa natal ativada: {house}', {
                              house: natalHouseLabel.replace("Casa ", ""),
                            })
                          )
                          technicalParts.push(
                            tr('groups.member.currentTransitHouseValue', 'Casa de transito atual: {house}', {
                              house: transitHouseLabel.replace("Casa ", ""),
                            })
                          )
                        }
                        if (areaHousesText) {
                          technicalParts.push(tr('groups.member.areaHouses', 'Casas da area: {houses}', { houses: areaHousesText }))
                        }
                        const technicalTypeLabel = technicalParts.join(" • ")
                        const timing = [formatTransitTimingLabel(transit), formatTransitDuration(transit)].filter(Boolean).join(" • ")
                        const suggestion = fallbackSuggestionItems[index]
                        const directText = buildTransitDirectText(transit, areaLabel, suggestion?.text, areaCritical, tr)
                        const statusLabel = areaCritical && status.kind === "harmonic" ? tr('groups.status.relief', 'Alivio') : status.label
                        const statusColor = areaCritical && status.kind === "harmonic" ? "#0EA5E9" : status.color
                        const unifiedNarrative = buildUnifiedTransitNarrative(transit, areaLabel, language)
                        const suggestionText = String(suggestion?.text || '').trim()
                        const normalizedSuggestion = suggestionText
                          .toLowerCase()
                          .normalize("NFD")
                          .replace(/[\u0300-\u036f]/g, "")
                        const shouldUseSuggestionText = suggestionText.length > 20
                          && !normalizedSuggestion.includes("fase de integracao e calibragem")
                          && !normalizedSuggestion.includes("momento de observacao")
                        const directTrimmed = String(directText || '').trim()
                        // A interpretação (modalBody) DEVE entrar sempre — ela é o corpo da leitura no modal.
                        // O filtro !== directText vale só para os EXTRAS (evita duplicar o texto), pois
                        // modalBody === directText por design (buildUnifiedTransitNarrative) e não pode ser filtrado.
                        const extraLines = [
                          shouldUseSuggestionText ? suggestionText : "",
                          suggestion?.title
                            ? tr('groups.member.focusTitle', 'Foco: {title}', { title: String(suggestion.title) })
                            : "",
                          mainPlanets.length
                            ? tr('groups.member.basePlanets', 'Planetas de base: {planets}', { planets: mainPlanets.slice(0, 5).join(", ") })
                            : "",
                        ].filter((line) => {
                          const value = String(line || '').trim()
                          if (!value) return false
                          return value !== directTrimmed
                        })
                        const fullLines = [String(unifiedNarrative.modalBody || '').trim(), ...extraLines]
                          .filter((line) => String(line || '').trim().length > 0)
                        const orbText = Number.isFinite(transit?.orb)
                          ? tr('groups.member.orb', 'Orb {value}deg', { value: Number(transit.orb).toFixed(1) })
                          : ""
                        const impactText = Number.isFinite(transit?.impact)
                          ? tr('groups.member.impact', 'Impacto {value}', { value: Number(transit.impact).toFixed(2) })
                          : ""
                        return {
                          id: String(transit?.id || `member-transit-${index}`),
                          rawTransit: transit,
                          columnKind: getTransitColumnKind(transit),
                          rank: computeTransitPriority(transit, areaCritical),
                          title,
                          houseLabel,
                          houseLabelPrefix,
                          technicalTypeLabel,
                          statusLabel,
                          statusColor,
                          timingLabel: timing || tr('groups.member.inProgress', 'Em andamento'),
                          directText,
                          fullLines,
                          actionText: suggestion?.title
                            ? String(suggestion.title)
                            : (unifiedNarrative.actionText || tr('groups.member.adjustNextStep', 'Ajuste o proximo passo com foco e constancia.')),
                          metaText: [unifiedNarrative.metaText, orbText, impactText].filter(Boolean).join(" • "),
                          impactValue01: computeTransitImpactValue(transit, areaCritical),
                          keywords: buildTransitKeywords(transit, key),
                        }
                      })

                      if (!baseTransits.length) {
                        return (
                          <Text style={styles.memberAreaEmpty}>
                            {tr('groups.member.noTransitForArea', 'Nenhum transito ativo para esta area.')}
                          </Text>
                        )
                      }

                      const transitStableKey = (item: MemberAreaTransitItem) =>
                        String(
                          item?.id ||
                          [
                            String(item?.title || ""),
                            String(item?.timingLabel || ""),
                            String(item?.technicalTypeLabel || ""),
                            String(item?.houseLabel || ""),
                          ].join("|")
                        )
                      const dedupedMap = new Map<string, MemberAreaTransitItem>()
                      baseTransits.forEach((item: MemberAreaTransitItem) => {
                        const key = transitStableKey(item)
                        const existing = dedupedMap.get(key)
                        if (!existing || item.rank > existing.rank) dedupedMap.set(key, item)
                      })
                      const dedupedTransits = Array.from(dedupedMap.values())

                      const toneMatches = (item: MemberAreaTransitItem) => {
                        if (memberTransitToneFilter === "all") return true
                        const tone = classifyTransitStatus(item.rawTransit, tr).kind
                        if (memberTransitToneFilter === "harmonic") return tone === "harmonic"
                        return tone === "tense"
                      }

                      const combinedRaw = [
                        ...(memberTransitFacetFilters.includes("major")
                          ? dedupedTransits
                            .filter((item: MemberAreaTransitItem) => item.columnKind === "planet")
                            .filter((item: MemberAreaTransitItem) => isMajorAspectTransit(item))
                            .map((item: MemberAreaTransitItem) => ({ item, facetKind: "major" as const }))
                          : []),
                        ...(memberTransitFacetFilters.includes("minor")
                          ? dedupedTransits
                            .filter((item: MemberAreaTransitItem) => item.columnKind === "planet")
                            .filter((item: MemberAreaTransitItem) => isMinorAspectTransit(item))
                            .map((item: MemberAreaTransitItem) => ({ item, facetKind: "minor" as const }))
                          : []),
                        ...(memberTransitFacetFilters.includes("house")
                          ? dedupedTransits
                            .filter((item: MemberAreaTransitItem) => item.columnKind === "house")
                            .map((item: MemberAreaTransitItem) => ({ item, facetKind: "house" as const }))
                          : []),
                      ]
                        .filter(({ item }) => toneMatches(item))
                        .filter(({ item }) => !memberTransitStrongOnly || item.impactValue01 >= memberAreaStrongThreshold)

                      const facetPriority: Record<MemberTransitFacet, number> = { major: 1, minor: 2, house: 3 }
                      const combinedMap = new Map<string, { item: MemberAreaTransitItem; facetKind: MemberTransitFacet }>()
                      combinedRaw.forEach((entry) => {
                        const key = transitStableKey(entry.item)
                        const existing = combinedMap.get(key)
                        if (!existing) {
                          combinedMap.set(key, entry)
                          return
                        }
                        if (facetPriority[entry.facetKind] > facetPriority[existing.facetKind]) {
                          combinedMap.set(key, entry)
                          return
                        }
                        if (entry.item.rank > existing.item.rank) {
                          combinedMap.set(key, entry)
                        }
                      })

                      const orderedTransits = Array.from(combinedMap.values())
                        .map((entry) => entry.item)
                        .sort((a, b) => {
                          if (memberTransitSortMode === "recent") {
                            const recentDelta = getTransitRecencyDistance(a) - getTransitRecencyDistance(b)
                            if (recentDelta !== 0) return recentDelta
                            return b.rank - a.rank
                          }
                          return b.rank - a.rank
                        })

                      const aspectTransits = orderedTransits.filter((item) => item.columnKind !== "house")
                      const houseTransits = orderedTransits.filter((item) => item.columnKind === "house")

                      const activeFiltersCount =
                        (memberTransitToneFilter !== "all" ? 1 : 0) +
                        (memberTransitSortMode !== "impact" ? 1 : 0) +
                        (memberTransitFacetFilters.length === 3 ? 0 : 1) +
                        (memberTransitStrongOnly ? 1 : 0)
                      const collapsedSummary = `${tr("groups.member.aspectsSection", "Aspectos")}: ${aspectTransits.length} • ${tr("groups.member.housesSection", "Casas")}: ${houseTransits.length}`

                      const renderTransitCard = (item: any, index: number) => (
                        <TransitInsightCard
                          key={item.id}
                          statusLabel={item.statusLabel}
                          statusColor={item.statusColor}
                          title={item.title}
                          houseLabel={item.houseLabel}
                          houseLabelPrefix={item.houseLabelPrefix}
                          technicalTypeLabel={item.technicalTypeLabel}
                          timingLabel={item.timingLabel}
                          directText={item.directText}
                          impactValue01={item.impactValue01}
                          fullExpanded={false}
                          onToggleFull={() => { }}
                          detailMode="modal"
                          onOpenDetailModal={() => {
                            const fullText = item.fullLines.join("\n\n")
                            const intensityLabel = item.impactValue01 >= 0.75
                              ? tr('groups.member.impactStrong', 'Impacto forte')
                              : item.impactValue01 >= 0.45
                                ? tr('groups.member.impactModerate', 'Impacto moderado')
                                : tr('groups.member.impactLight', 'Impacto leve')
                            setSelectedMemberTransitDetail({
                              title: item.title,
                              statusLabel: item.statusLabel,
                              statusColor: item.statusColor,
                              timingLabel: item.timingLabel,
                              directText: item.directText,
                              fullText,
                              actionText: item.actionText,
                              metaText: [intensityLabel, item.metaText].filter(Boolean).join(" • "),
                              keywords: item.keywords,
                              epigraph: resolveTransitAphorism(item.rawTransit, language),
                            })
                          }}
                          modalOpenByCard
                          showModalActionIcon
                          fullTitle="Interpretacao completa"
                          fullText=""
                          actionText={item.actionText}
                          metaText={item.metaText}
                          variant="dark"
                          featured={index < 2}
                        />
                      )

                      return (
                        <>
                          <View style={styles.memberAreaSectionRow}>
                            <Text style={styles.memberAreaSectionTitle}>{tr('groups.member.activeTransits', 'Transitos ativos')}</Text>
                            <Text style={styles.memberAreaSectionMeta}>
                              {tr('groups.member.transitsInArea', '{count} transitos na area', { count: orderedTransits.length })}
                            </Text>
                          </View>
                          <View style={styles.memberTransitSection}>
                            <TouchableOpacity
                              style={styles.memberTransitFiltersToggleBar}
                              onPress={() => setMemberTransitFiltersExpanded((prev) => !prev)}
                            >
                              <Text style={styles.memberTransitFiltersTitle}>{tr("groups.member.filtersAndSorting", "Filtros e Ordenacao")}</Text>
                              <View style={styles.memberTransitFiltersMetaWrap}>
                                <Text style={styles.memberTransitFiltersMeta}>{activeFiltersCount} {tr("groups.member.active", "ativos")}</Text>
                                <Ionicons
                                  name={memberTransitFiltersExpanded ? "chevron-up" : "chevron-down"}
                                  size={14}
                                  color="#9A3412"
                                />
                              </View>
                            </TouchableOpacity>
                            {!memberTransitFiltersExpanded ? (
                              <Text style={styles.memberTransitFiltersSummary}>{collapsedSummary}</Text>
                            ) : null}

                            {memberTransitFiltersExpanded ? (
                              <View style={styles.memberTransitFiltersBody}>
                                <View style={styles.memberTransitFilterRow}>
                                  <TouchableOpacity
                                    onPress={() =>
                                      setMemberTransitFacetFilters((prev) =>
                                        prev.includes("major") ? prev.filter((item) => item !== "major") : [...prev, "major"]
                                      )
                                    }
                                    style={[styles.memberTransitFilterChip, memberTransitFacetFilters.includes("major") ? styles.memberTransitFilterChipActive : null]}
                                  >
                                    <Text style={[styles.memberTransitFilterChipText, memberTransitFacetFilters.includes("major") ? styles.memberTransitFilterChipTextActive : null]}>
                                      {tr("groups.member.majorAspects", "Aspectos maiores")}
                                    </Text>
                                  </TouchableOpacity>
                                  <TouchableOpacity
                                    onPress={() =>
                                      setMemberTransitFacetFilters((prev) =>
                                        prev.includes("minor") ? prev.filter((item) => item !== "minor") : [...prev, "minor"]
                                      )
                                    }
                                    style={[styles.memberTransitFilterChip, memberTransitFacetFilters.includes("minor") ? styles.memberTransitFilterChipActive : null]}
                                  >
                                    <Text style={[styles.memberTransitFilterChipText, memberTransitFacetFilters.includes("minor") ? styles.memberTransitFilterChipTextActive : null]}>
                                      {tr("groups.member.minorAspects", "Aspectos menores")}
                                    </Text>
                                  </TouchableOpacity>
                                  <TouchableOpacity
                                    onPress={() =>
                                      setMemberTransitFacetFilters((prev) =>
                                        prev.includes("house") ? prev.filter((item) => item !== "house") : [...prev, "house"]
                                      )
                                    }
                                    style={[styles.memberTransitFilterChip, memberTransitFacetFilters.includes("house") ? styles.memberTransitFilterChipActive : null]}
                                  >
                                    <Text style={[styles.memberTransitFilterChipText, memberTransitFacetFilters.includes("house") ? styles.memberTransitFilterChipTextActive : null]}>
                                      {tr("groups.member.planetsInHouses", "Planetas nas casas")}
                                    </Text>
                                  </TouchableOpacity>
                                </View>
                                <View style={styles.memberTransitFilterRow}>
                                  <TouchableOpacity
                                    onPress={() => setMemberTransitToneFilter("all")}
                                    style={[styles.memberTransitFilterChip, memberTransitToneFilter === "all" ? styles.memberTransitFilterChipActive : null]}
                                  >
                                    <Text style={[styles.memberTransitFilterChipText, memberTransitToneFilter === "all" ? styles.memberTransitFilterChipTextActive : null]}>
                                      {tr("groups.member.all", "Todos")}
                                    </Text>
                                  </TouchableOpacity>
                                  <TouchableOpacity
                                    onPress={() => setMemberTransitToneFilter("challenging")}
                                    style={[styles.memberTransitFilterChip, memberTransitToneFilter === "challenging" ? styles.memberTransitFilterChipActive : null]}
                                  >
                                    <Text style={[styles.memberTransitFilterChipText, memberTransitToneFilter === "challenging" ? styles.memberTransitFilterChipTextActive : null]}>
                                      {tr("groups.member.challenging", "Desafiador")}
                                    </Text>
                                  </TouchableOpacity>
                                  <TouchableOpacity
                                    onPress={() => setMemberTransitToneFilter("harmonic")}
                                    style={[styles.memberTransitFilterChip, memberTransitToneFilter === "harmonic" ? styles.memberTransitFilterChipActive : null]}
                                  >
                                    <Text style={[styles.memberTransitFilterChipText, memberTransitToneFilter === "harmonic" ? styles.memberTransitFilterChipTextActive : null]}>
                                      {tr("groups.member.harmonic", "Harmonico")}
                                    </Text>
                                  </TouchableOpacity>
                                  <TouchableOpacity
                                    onPress={() => setMemberTransitSortMode("impact")}
                                    style={[styles.memberTransitFilterChip, memberTransitSortMode === "impact" ? styles.memberTransitFilterChipActive : null]}
                                  >
                                    <Text style={[styles.memberTransitFilterChipText, memberTransitSortMode === "impact" ? styles.memberTransitFilterChipTextActive : null]}>
                                      {tr("groups.member.mostImpact", "Mais impacto")}
                                    </Text>
                                  </TouchableOpacity>
                                  <TouchableOpacity
                                    onPress={() => setMemberTransitSortMode("recent")}
                                    style={[styles.memberTransitFilterChip, memberTransitSortMode === "recent" ? styles.memberTransitFilterChipActive : null]}
                                  >
                                    <Text style={[styles.memberTransitFilterChipText, memberTransitSortMode === "recent" ? styles.memberTransitFilterChipTextActive : null]}>
                                      {tr("groups.member.mostRecent", "Mais recente")}
                                    </Text>
                                  </TouchableOpacity>
                                  <TouchableOpacity
                                    onPress={() => setMemberTransitStrongOnly((prev) => !prev)}
                                    style={[styles.memberTransitFilterChip, memberTransitStrongOnly ? styles.memberTransitFilterChipActive : null]}
                                  >
                                    <Text style={[styles.memberTransitFilterChipText, memberTransitStrongOnly ? styles.memberTransitFilterChipTextActive : null]}>
                                      {tr("groups.member.strongOnly", "Somente ativos fortes")}
                                    </Text>
                                  </TouchableOpacity>
                                  <TouchableOpacity
                                    onPress={() => {
                                      setMemberTransitFacetFilters(["major", "house"])
                                      setMemberTransitToneFilter("all")
                                      setMemberTransitSortMode("impact")
                                      setMemberTransitStrongOnly(false)
                                    }}
                                    style={styles.memberTransitFilterChip}
                                  >
                                    <Text style={styles.memberTransitFilterChipText}>
                                      {tr("groups.member.clear", "Limpar")}
                                    </Text>
                                  </TouchableOpacity>
                                </View>
                              </View>
                            ) : null}

                            {memberTransitFacetFilters.length === 0 ? (
                              <Text style={styles.memberAreaEmpty}>
                                {tr("groups.member.enableAtLeastOneFilter", "Ative ao menos um tipo de filtro.")}
                              </Text>
                            ) : orderedTransits.length ? (
                              <>
                                {aspectTransits.length ? (
                                  <View style={styles.memberTransitSubsection}>
                                    <View style={styles.memberTransitSubsectionHeader}>
                                      <Text style={styles.memberTransitSubsectionTitle}>
                                        {tr("groups.member.aspectsSection", "Aspectos")}
                                      </Text>
                                      <Text style={styles.memberTransitSubsectionMeta}>{aspectTransits.length}</Text>
                                    </View>
                                    {aspectTransits.map((item, index) => renderTransitCard(item, index))}
                                  </View>
                                ) : null}
                                {houseTransits.length ? (
                                  <View style={styles.memberTransitSubsection}>
                                    <View style={styles.memberTransitSubsectionHeader}>
                                      <Text style={styles.memberTransitSubsectionTitle}>
                                        {tr("groups.member.planetsInHouses", "Planetas nas casas")}
                                      </Text>
                                      <Text style={styles.memberTransitSubsectionMeta}>{houseTransits.length}</Text>
                                    </View>
                                    {houseTransits.map((item, index) => renderTransitCard(item, aspectTransits.length + index))}
                                  </View>
                                ) : null}
                              </>
                            ) : (
                              <Text style={styles.memberAreaEmpty}>
                                {tr("groups.member.noTransitForSelectedFilters", "Nenhum transito para os filtros selecionados.")}
                              </Text>
                            )}
                          </View>

                          <TouchableOpacity
                            style={styles.memberCalcToggle}
                            onPress={() => setShowMemberAreaCalc((prev) => !prev)}
                          >
                            <Text style={styles.memberCalcToggleText}>
                              {showMemberAreaCalc
                                ? tr('groups.member.hideCalc', 'Ocultar calculo do status')
                                : tr('groups.member.showCalc', 'Visualizar calculo do status')}
                            </Text>
                            <Ionicons
                              name={showMemberAreaCalc ? "chevron-up" : "chevron-down"}
                              size={16}
                              color="#FFD700"
                            />
                          </TouchableOpacity>

                          {showMemberAreaCalc ? (
                            <View style={styles.memberCalcBox}>
                              <Text style={styles.memberCalcTitle}>{tr('groups.member.calcFactors', 'Fatores do calculo desta area')}</Text>
                              <Text style={styles.memberCalcText}>
                                {tr('groups.member.currentScoreLine', 'Score atual: {score}% • Classificacao: {classification}', {
                                  score: percentage !== null ? percentage : '--',
                                  classification: getStatusLabel(bucket === "attention" ? "neutral" : bucket),
                                })}
                              </Text>
                              <Text style={styles.memberCalcText}>
                                {tr('groups.member.consideredTransits', 'Transitos considerados: {count}', {
                                  count: orderedTransits.length,
                                })}
                              </Text>
                              {mainPlanets.length ? (
                                <Text style={styles.memberCalcText}>
                                  {tr('groups.member.basePlanets', 'Planetas de base: {planets}', {
                                    planets: mainPlanets.slice(0, 8).join(", "),
                                  })}
                                </Text>
                              ) : null}
                              {resolvedActiveTransits.length ? (
                                <Text style={styles.memberCalcText}>
                                  {tr('groups.member.activeEvents', 'Eventos ativos: {events}', {
                                    events: resolvedActiveTransits.slice(0, 8).join(" • "),
                                  })}
                                </Text>
                              ) : null}
                              {resolvedAspects.length ? (
                                <Text style={styles.memberCalcText}>
                                  {tr('groups.member.relevantAspects', 'Aspectos relevantes: {aspects}', {
                                    aspects: resolvedAspects.slice(0, 6).join(" • "),
                                  })}
                                </Text>
                              ) : null}
                            </View>
                          ) : null}
                        </>
                      )
                    })()}
                  </ScrollView>
                </>
              )
            })()}

            <TouchableOpacity
              style={styles.memberAreaClose}
              onPress={closeMemberAreaModal}
            >
              <Text style={styles.memberAreaCloseText}>{tr('common.close', 'Fechar')}</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>

      <ReadingDetailModal
        visible={!!selectedMemberTransitDetail}
        onClose={() => setSelectedMemberTransitDetail(null)}
        statusLabel={selectedMemberTransitDetail?.statusLabel}
        statusColor={selectedMemberTransitDetail?.statusColor}
        title={selectedMemberTransitDetail?.title || ''}
        timingLabel={selectedMemberTransitDetail?.timingLabel || null}
        directText={selectedMemberTransitDetail?.directText || ''}
        fullText={selectedMemberTransitDetail?.fullText || ''}
        actionText={selectedMemberTransitDetail?.actionText || null}
        metaText={selectedMemberTransitDetail?.metaText || null}
        keywords={selectedMemberTransitDetail?.keywords || []}
        epigraph={selectedMemberTransitDetail?.epigraph || null}
      />

      <GroupDetailModal
        visible={showGroupDetail}
        group={selectedGroupForDetail}
        members={selectedGroupForDetail?.id === selectedGroup?.id ? groupMembers : []}
        activities={selectedGroupForDetail?.id === selectedGroup?.id ? groupActivities : []}
        currentUserId={user?.uid || ''}
        onClose={() => {
          setShowGroupDetail(false)
          setSelectedGroupForDetail(null)
        }}
        onInvite={() => {
          // Acao de convite sera implementada na proxima etapa
          Alert.alert(tr('groups.alert.comingSoonTitle', 'Em breve'), tr('groups.alert.comingSoonInvites', 'Sistema de convites em desenvolvimento!'))
        }}
        onLeaveGroup={handleLeaveGroup}
        onRemoveMember={(member) => handleRemoveMember(member.userId)}
        onUpdateInviteSettings={handleUpdateInviteSettings}
        onRenameGroup={handleRenameGroup}
        onMemberProfile={(member) => {
          // Acao de ver perfil do membro
          Alert.alert(tr('groups.alert.profileTitle', 'Perfil'), tr('groups.alert.viewProfile', `Ver perfil de ${member.displayName}`, { name: member.displayName }))
        }}
      />

      <GroupNotificationSettings
        visible={showGroupSettings}
        group={selectedGroup}
        currentUserId={user?.uid || ""}
        onClose={() => setShowGroupSettings(false)}
      />

      <AddManagedProfileModal
        visible={showAddManaged}
        onClose={() => setShowAddManaged(false)}
        groupId={selectedGroup?.id || null}
        onCreated={() => { loadGroupData() }}
      />
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 6,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#FFFFFF",
    fontSize: 16,
    marginTop: 8,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerActionsInline: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  groupSelector: {
    flex: 1,
    marginRight: 12,
  },
  groupTab: {
    backgroundColor: "#2C2C2E",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  groupTabActive: {
    backgroundColor: "#FFD700",
  },
  groupTabText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },
  groupTabTextActive: {
    color: "#000000",
  },
  headerIconButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#2C2C2E",
    alignItems: "center",
    justifyContent: "center",
  },
  criticalAlertsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  criticalAlert: {
    flexDirection: "row",
    backgroundColor: "#2C1B1B",
    borderLeftWidth: 4,
    borderLeftColor: "#FF4444",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  alertContent: {
    flex: 1,
    marginLeft: 12,
  },
  alertText: {
    color: "#FFFFFF",
    fontSize: 14,
    lineHeight: 20,
  },
  alertUser: {
    fontWeight: "bold",
    color: "#FFD700",
  },
  alertTime: {
    color: "#888",
    fontSize: 12,
    marginTop: 4,
  },
  membersSection: {
    marginBottom: 24,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionIconButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 215, 0, 0.2)",
  },
  memberCardCompact: {
    backgroundColor: "#1C1C1E",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  memberHeaderCompact: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  memberHeaderInfo: {
    flex: 1,
  },
  memberChartBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,215,0,0.35)",
    backgroundColor: "rgba(255,215,0,0.08)",
  },
  memberChartBtnText: {
    color: "#FFD700",
    fontSize: 11,
    fontWeight: "700",
  },
  managedBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: "rgba(179,157,219,0.18)",
    borderWidth: 1,
    borderColor: "rgba(179,157,219,0.4)",
  },
  managedBadgeText: {
    color: "#B39DDB",
    fontSize: 9,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  managedRemoveBtn: {
    padding: 6,
    borderRadius: 999,
    backgroundColor: "rgba(255,107,107,0.1)",
  },
  memberRowName: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
    flex: 1,
  },
  memberRowUpdate: {
    color: "#777",
    fontSize: 10,
    marginTop: 2,
  },
  memberStatusGridCompact: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    justifyContent: "flex-start",
  },
  memberStatusMiniCard: {
    flexBasis: "23%",
    maxWidth: "23%",
  },
  memberStatusMiniInner: {
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 7,
    minHeight: 80,
  },
  memberStatusMiniHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 4,
  },
  memberStatusMiniLabel: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "600",
    flexShrink: 1,
  },
  memberStatusMiniValue: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 2,
  },
  memberSignalBadges: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  memberSignalBadge: {
    minWidth: 14,
    height: 14,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
  },
  memberSignalBadgeMovement: {
    backgroundColor: STATUS_AXIS_COLORS.movement,
  },
  memberSignalBadgeAttention: {
    backgroundColor: STATUS_AXIS_COLORS.attention,
  },
  memberSignalBadgeText: {
    color: "#0B1020",
    fontSize: 7,
    fontWeight: "800",
  },
  memberAxisRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginTop: 3,
  },
  memberAxisLabel: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 8,
    fontWeight: "700",
    width: 8,
  },
  memberAxisTrack: {
    flex: 1,
    height: 2.5,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.25)",
    overflow: "hidden",
  },
  memberAxisFill: {
    height: "100%",
    borderRadius: 999,
  },
  memberAxisFillMovement: {
    backgroundColor: STATUS_AXIS_COLORS.movement,
  },
  memberAxisFillAttention: {
    backgroundColor: STATUS_AXIS_COLORS.attention,
  },
  memberAxisValue: {
    color: "#FFFFFF",
    fontSize: 8,
    fontWeight: "700",
    minWidth: 18,
    textAlign: "right",
  },
  memberDetailEmpty: {
    color: "#888",
    fontSize: 11,
    marginTop: 4,
  },
  synastrySection: {
    marginTop: 8,
    marginBottom: 16,
    backgroundColor: "#1A1A3A",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,215,0,0.15)",
  },
  synastryHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  synastryTitle: {
    color: "#FFD700",
    fontSize: 15,
    fontWeight: "700",
  },
  synastrySubtitle: {
    color: "#9AA0C0",
    fontSize: 12,
    marginTop: 4,
    marginBottom: 12,
  },
  synastryCard: {
    backgroundColor: "rgba(255,255,255,0.03)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  synastryMemberName: {
    color: "#E2E8F0",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
  },
  synastryRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    gap: 8,
  },
  synastryToneDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  synastryAspectText: {
    color: "#F8FAFC",
    fontSize: 13,
    flex: 1,
  },
  synastryMeta: {
    color: "#8890B5",
    fontSize: 11,
  },
  synastryEmpty: {
    color: "#888",
    fontSize: 12,
  },
  synastryFootnote: {
    color: "#6B7099",
    fontSize: 11,
    fontStyle: "italic",
    marginTop: 4,
  },
  gunaBox: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#2A2F45",
  },
  gunaTitle: {
    color: "#FFD700",
    fontSize: 12,
    fontWeight: "700",
  },
  gunaMeta: {
    color: "#8892a4",
    fontSize: 11,
    marginTop: 2,
  },
  synastryCompatRow: {
    marginBottom: 8,
  },
  synastryCompatText: {
    color: "#FFD700",
    fontSize: 13,
    fontWeight: "700",
  },
  synastryCompatMeta: {
    color: "#8890B5",
    fontSize: 11,
    marginTop: 1,
  },
  synastryAspectItem: {
    marginBottom: 2,
  },
  synastryAspectLineText: {
    color: "#B8C0DC",
    fontSize: 12,
    lineHeight: 16,
    marginLeft: 16,
    marginTop: 1,
    marginBottom: 4,
  },
  synastryToggle: {
    marginTop: 8,
    alignSelf: "flex-start",
  },
  synastryToggleText: {
    color: "#8FB0FF",
    fontSize: 12,
    fontWeight: "600",
  },
  gunaKutaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 3,
    gap: 8,
  },
  gunaKutaName: {
    color: "#C8CEE6",
    fontSize: 11,
    fontWeight: "600",
  },
  gunaKutaMeta: {
    color: "#8892a4",
    fontSize: 11,
    flex: 1,
    textAlign: "right",
  },
  gunaBandText: {
    color: "#B8C0DC",
    fontSize: 11,
    lineHeight: 15,
    marginTop: 6,
    fontStyle: "italic",
  },
  memberAreaBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  memberAreaCard: {
    width: "100%",
    maxHeight: "80%",
    backgroundColor: "#14141F",
    borderRadius: 12,
    overflow: "hidden",
  },
  memberAreaHeader: {
    padding: 14,
  },
  memberAreaTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  memberAreaPercent: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
    marginTop: 6,
  },
  memberAreaBarTrack: {
    height: 6,
    borderRadius: 999,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    overflow: "hidden",
    marginTop: 8,
  },
  memberAreaBarFill: {
    height: "100%",
    borderRadius: 999,
  },
  memberAreaContent: {
    padding: 14,
  },
  memberAreaSectionTitle: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 6,
    marginBottom: 6,
  },
  memberAreaSectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
    marginBottom: 6,
  },
  memberAreaSectionMeta: {
    color: "#94A3B8",
    fontSize: 11,
    fontWeight: "600",
  },
  memberTransitSection: {
    marginTop: 8,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.25)",
    backgroundColor: "rgba(15, 23, 42, 0.35)",
  },
  memberTransitFiltersToggleBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.25)",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: "rgba(255,255,255,0.06)",
    marginBottom: 10,
  },
  memberTransitFiltersTitle: {
    color: "#E2E8F0",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  memberTransitFiltersMetaWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  memberTransitFiltersMeta: {
    color: "#FB923C",
    fontSize: 11,
    fontWeight: "700",
  },
  memberTransitFiltersSummary: {
    color: "#94A3B8",
    fontSize: 11,
    fontWeight: "600",
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  memberTransitFiltersBody: {
    gap: 8,
    marginBottom: 10,
  },
  memberTransitFilterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  memberTransitFilterChip: {
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.35)",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  memberTransitFilterChipActive: {
    borderColor: "#F59E0B",
    backgroundColor: "rgba(245, 158, 11, 0.18)",
  },
  memberTransitFilterChipText: {
    color: "#CBD5E1",
    fontSize: 11,
    fontWeight: "700",
  },
  memberTransitFilterChipTextActive: {
    color: "#FDE68A",
  },
  memberTransitColumnHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    paddingHorizontal: 2,
  },
  memberTransitColumnTitle: {
    color: "#E2E8F0",
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  memberTransitColumnMeta: {
    color: "#94A3B8",
    fontSize: 11,
    fontWeight: "700",
  },
  memberTransitSubsection: {
    width: "100%",
    marginTop: 4,
    marginBottom: 4,
  },
  memberTransitSubsectionHeader: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
    paddingHorizontal: 2,
  },
  memberTransitSubsectionTitle: {
    color: "#E2E8F0",
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  memberTransitSubsectionMeta: {
    color: "#FB923C",
    fontSize: 11,
    fontWeight: "800",
  },
  memberCalcToggle: {
    marginTop: 8,
    marginBottom: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#334155",
    backgroundColor: "#111827",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  memberCalcToggleText: {
    color: "#FFD700",
    fontSize: 12,
    fontWeight: "700",
  },
  memberCalcBox: {
    marginTop: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#2A2A2E",
    backgroundColor: "#141418",
    padding: 10,
    gap: 6,
  },
  memberCalcTitle: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  memberCalcText: {
    color: "#CBD5E1",
    fontSize: 12,
    lineHeight: 18,
  },
  memberAreaItem: {
    marginBottom: 8,
  },
  memberAreaSuggestionTitle: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "600",
    marginBottom: 2,
  },
  memberAreaText: {
    color: "#C9C9D6",
    fontSize: 11,
    lineHeight: 16,
    marginBottom: 4,
  },
  memberAreaEmpty: {
    color: "#9A9AA5",
    fontSize: 11,
    marginBottom: 6,
  },
  memberAreaClose: {
    borderTopWidth: 1,
    borderTopColor: "#242433",
    paddingVertical: 10,
    alignItems: "center",
  },
  memberAreaCloseText: {
    color: "#FFD700",
    fontSize: 13,
    fontWeight: "600",
  },
  memberReadingBackdrop: {
    flex: 1,
    backgroundColor: "rgba(2,6,23,0.78)",
    justifyContent: "center",
    padding: 16,
  },
  memberReadingCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    padding: 14,
    gap: 10,
  },
  memberReadingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  memberReadingStatusBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  memberReadingStatusText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 12,
  },
  memberReadingCloseIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E2E8F0",
    borderWidth: 1,
    borderColor: "#CBD5E1",
  },
  memberReadingTitle: {
    color: "#0F172A",
    fontSize: 21,
    fontWeight: "800",
  },
  memberReadingTiming: {
    color: "#475569",
    fontSize: 13,
    fontWeight: "700",
  },
  memberReadingSectionTitle: {
    color: "#B45309",
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    marginTop: 2,
  },
  memberReadingDirect: {
    color: "#0F172A",
    fontSize: 18,
    lineHeight: 25,
    fontWeight: "600",
  },
  memberReadingFull: {
    color: "#1E293B",
    fontSize: 15,
    lineHeight: 23,
  },
  memberReadingAction: {
    color: "#B45309",
    fontWeight: "700",
    fontSize: 13,
  },
  memberReadingMeta: {
    color: "#64748B",
    fontSize: 12,
  },
  memberReadingCloseButton: {
    marginTop: 4,
    backgroundColor: "#0F172A",
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
  },
  memberReadingCloseButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },
  memberCard: {
    backgroundColor: "#1C1C1E",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  memberEmail: {
    color: "#888",
    fontSize: 14,
  },
  memberStatus: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusDetails: {
    marginLeft: 8,
    alignItems: "flex-end",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  statusMood: {
    color: "#888",
    fontSize: 12,
  },
  statusTransits: {
    color: "#FF8800",
    fontSize: 10,
    marginTop: 2,
  },
  alertsSection: {
    marginBottom: 24,
  },
  alertCard: {
    flexDirection: "row",
    backgroundColor: "#1C1C1E",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  feedItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: "#1C1C1E",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  feedIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#2C2C2E",
    alignItems: "center",
    justifyContent: "center",
  },
  feedContent: {
    flex: 1,
  },
  feedMeta: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 6,
  },
  feedTag: {
    borderWidth: 1,
    borderColor: "#2C2C2E",
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  feedTagType: {
    borderColor: "#4A90E2",
    backgroundColor: "rgba(74, 144, 226, 0.12)",
  },
  feedTagText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#CCCCCC",
  },
  feedTagTypeText: {
    color: "#4A90E2",
  },
  feedTime: {
    color: "#8A8AA8",
    fontSize: 10,
    marginLeft: "auto",
  },
  feedMessage: {
    color: "#E5E5E5",
    fontSize: 12,
    lineHeight: 16,
  },
  alertMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  alertTag: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  alertTagType: {
    borderColor: "#4A90E2",
    backgroundColor: "rgba(74, 144, 226, 0.12)",
  },
  alertTagText: {
    fontSize: 11,
    fontWeight: "600",
  },
  alertTagTypeText: {
    color: "#4A90E2",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 64,
    paddingHorizontal: 20,
  },
  emptyStateTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    color: "#888",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 24,
  },
  createFirstGroupButton: {
    backgroundColor: "#FFD700",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  createFirstGroupButtonText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "bold",
  },
  joinByCodeButton: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#FFD700",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: "transparent",
  },
  joinByCodeButtonText: {
    color: "#FFD700",
    fontSize: 15,
    fontWeight: "700",
  },
  lockedState: {
    marginTop: 72,
    marginHorizontal: 20,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255, 215, 0, 0.35)",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    padding: 24,
    alignItems: "center",
  },
  lockedStateTitle: {
    marginTop: 12,
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "800",
  },
  lockedStateText: {
    marginTop: 10,
    color: "#C6C6D3",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  lockedStateButton: {
    marginTop: 16,
    backgroundColor: "#FFD700",
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  lockedStateButtonText: {
    color: "#1A1A1A",
    fontWeight: "800",
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  modalContent: {
    backgroundColor: "#1C1C1E",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 400,
  },
  orderModalContent: {
    backgroundColor: "#1C1C1E",
    borderRadius: 16,
    padding: 20,
    width: "100%",
    maxWidth: 420,
    maxHeight: "80%",
  },
  orderModalList: {
    maxHeight: 320,
    marginBottom: 12,
  },
  orderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.06)",
  },
  orderRowText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
  },
  orderRowActions: {
    flexDirection: "row",
    gap: 6,
  },
  orderIconButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderWidth: 1,
    borderColor: "rgba(255, 215, 0, 0.2)",
  },
  orderIconDisabled: {
    opacity: 0.35,
  },
  orderModalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  modalTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  modalInput: {
    backgroundColor: "#2C2C2E",
    borderRadius: 8,
    padding: 12,
    color: "#FFFFFF",
    fontSize: 16,
    marginBottom: 16,
  },
  modalTextArea: {
    height: 80,
    textAlignVertical: "top",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  modalButtonCancel: {
    flex: 1,
    backgroundColor: "#2C2C2E",
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 8,
  },
  modalButtonCancelText: {
    color: "#FFFFFF",
    fontSize: 16,
    textAlign: "center",
  },
  modalButtonConfirm: {
    flex: 1,
    backgroundColor: "#FFD700",
    paddingVertical: 12,
    borderRadius: 8,
    marginLeft: 8,
  },
  modalButtonConfirmText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  modalButtonFullWidth: {
    marginTop: 12,
    marginLeft: 0,
    marginRight: 0,
  },
  modalOptionButton: {
    backgroundColor: "#2C2C2E",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    marginBottom: 8,
  },
  modalOptionButtonActive: {
    backgroundColor: "#FFD700",
  },
  modalOptionText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  modalOptionTextActive: {
    color: "#000000",
  },

  // === ESTILOS PARA ABAS PRINCIPAIS ===
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#1C1C1E",
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  mainTab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  mainTabActive: {
    backgroundColor: "#2C2C2E",
  },
  mainTabText: {
    color: "#8E8E93",
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 8,
  },
  mainTabTextActive: {
    color: "#FFD700",
    fontWeight: "bold",
  },

  // === ESTILOS PARA CASAIS ===
  coupleContainer: {
    padding: 16,
  },
  coupleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  coupleNames: {
    flex: 1,
  },
  coupleNamesText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  coupleSignsText: {
    color: "#888",
    fontSize: 14,
    marginTop: 4,
  },
  refreshButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#2C2C2E",
  },
  compatibilityCard: {
    backgroundColor: "#1C1C1E",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  compatibilityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  compatibilityTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  compatibilityScore: {
    backgroundColor: "#FFD700",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  compatibilityScoreText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
  compatibilityDescription: {
    color: "#CCCCCC",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  compatibilityAreas: {
    marginBottom: 16,
  },
  areaRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  areaLabel: {
    color: "#FFFFFF",
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  areaScore: {
    color: "#FFD700",
    fontSize: 14,
    fontWeight: "bold",
  },
  adviceContainer: {
    backgroundColor: "#2C2C2E",
    padding: 12,
    borderRadius: 8,
  },
  adviceTitle: {
    color: "#FFD700",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 6,
  },
  adviceText: {
    color: "#CCCCCC",
    fontSize: 13,
    lineHeight: 18,
  },
  emptyCoupleState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 80,
  },
  emptyCoupleTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyCoupleText: {
    color: "#888",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 32,
    paddingHorizontal: 32,
    lineHeight: 22,
  },
  createCoupleButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFD700",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createCoupleButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  modalLabel: {
    color: "#FFFFFF",
    fontSize: 16,
    marginBottom: 8,
    marginTop: 16,
  },
  lifeAreaOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
    gap: 8,
  },
  lifeAreaOption: {
    backgroundColor: "#2C2C2E",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  lifeAreaOptionActive: {
    backgroundColor: "#FFD700",
  },
  lifeAreaOptionText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "500",
  },
  lifeAreaOptionTextActive: {
    color: "#000",
    fontWeight: "700",
  },
  invitePreviewBox: {
    backgroundColor: "#1C1C1E",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  invitePreviewTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
  },
  invitePreviewText: {
    color: "#888",
    fontSize: 12,
    lineHeight: 18,
  },
  invitePreviewError: {
    color: "#FF4444",
    fontSize: 12,
    marginBottom: 12,
  },
  relationshipTypes: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 24,
  },
  relationshipType: {
    backgroundColor: "#2C2C2E",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  relationshipTypeActive: {
    backgroundColor: "#FFD700",
  },
  relationshipTypeText: {
    color: "#FFFFFF",
    fontSize: 14,
  },
  relationshipTypeTextActive: {
    color: "#000",
    fontWeight: "bold",
  },

  // Estilos para acoes de notificacao
  notificationActionsSection: {
    marginBottom: 24,
  },
  actionButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
  },
  messageButton: {
    backgroundColor: "#4A90E2",
  },
  alertButton: {
    backgroundColor: "#E67E22",
  },
  settingsButton: {
    backgroundColor: "#6C63FF",
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  feedTabs: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  feedTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: "#2C2C2E",
  },
  feedTabActive: {
    backgroundColor: "#FFD700",
  },
  feedTabText: {
    color: "#AAAAAA",
    fontSize: 12,
    fontWeight: "600",
  },
  feedTabTextActive: {
    color: "#0a0e27",
  },

  // Estilos para modal de mensagem
  modalSubtitle: {
    color: "#888",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 20,
  },
  characterCount: {
    color: "#888",
    fontSize: 12,
    textAlign: "right",
    marginTop: 4,
    marginBottom: 16,
  },
  modalButtonDisabled: {
    backgroundColor: "#555",
    opacity: 0.6,
  },

  // Estilos modernos para o novo layout
  modernHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 20,
    paddingBottom: 24,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#888',
  },
  groupsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  groupsCardsSection: {
    marginBottom: 24,
  },
  groupFocusCard: {
    backgroundColor: "#14142b",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 215, 0, 0.2)",
  },
  groupHeaderInline: {
    marginBottom: 16,
  },
  groupHeaderTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  groupHeaderTitles: {
    flex: 1,
  },
  groupHeaderTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "700",
  },
  groupHeaderSubtitle: {
    color: "#888",
    fontSize: 13,
    marginTop: 4,
  },
  groupHeaderActionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  groupHeaderActionsColumn: {
    alignItems: "flex-end",
    gap: 6,
  },
  groupHeaderActionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderWidth: 1,
    borderColor: "rgba(255, 215, 0, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  groupHeaderPreferencesButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 215, 0, 0.25)",
    backgroundColor: "rgba(255, 215, 0, 0.08)",
  },
  groupHeaderPreferencesText: {
    color: "#FFD700",
    fontSize: 11,
    fontWeight: "600",
  },
  groupHeaderMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  groupMetaTextInline: {
    color: "#B5B5C5",
    fontSize: 11,
  },
  groupMetaDot: {
    color: "#515166",
    fontSize: 12,
  },
  groupFocusHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },
  groupFocusTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
  },
  groupFocusSubtitle: {
    color: "#888",
    fontSize: 13,
    marginTop: 4,
  },
  groupFocusManage: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFD700",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
  },
  groupFocusManageText: {
    color: "#0a0e27",
    fontWeight: "700",
    fontSize: 12,
  },
  groupFocusMeta: {
    gap: 8,
  },
  groupMetaChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  groupMetaText: {
    color: "#E5E5E5",
    fontSize: 12,
    flexShrink: 1,
  },
  statusPanel: {
    backgroundColor: "#14142b",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  statusHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  statusActionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderWidth: 1,
    borderColor: "rgba(255, 215, 0, 0.25)",
  },
  statusActionText: {
    color: "#FFD700",
    fontSize: 12,
    fontWeight: "600",
  },
  statusUpdated: {
    color: "#888",
    fontSize: 12,
  },
  statusCounters: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },
  statusCounter: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
  },
  statusCounterCritical: {
    borderColor: "rgba(255, 68, 68, 0.6)",
    backgroundColor: "rgba(255, 68, 68, 0.08)",
  },
  statusCounterNeutral: {
    borderColor: "rgba(136, 136, 136, 0.6)",
    backgroundColor: "rgba(136, 136, 136, 0.08)",
  },
  statusCounterPositive: {
    borderColor: "rgba(68, 170, 68, 0.6)",
    backgroundColor: "rgba(68, 170, 68, 0.08)",
  },
  groupSummaryCard: {
    backgroundColor: "#14142b",
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  groupSummaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  groupSummaryCounters: {
    flexDirection: "row",
    gap: 8,
    marginTop: 0,
    alignItems: "center",
  },
  groupSummaryCounter: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
  },
  groupSummaryCounterCompact: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    minWidth: 90,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
  },
  summaryCritical: {
    borderColor: "rgba(255, 107, 107, 0.5)",
    backgroundColor: "rgba(255, 107, 107, 0.08)",
  },
  summaryAttention: {
    borderColor: "rgba(242, 185, 75, 0.5)",
    backgroundColor: "rgba(242, 185, 75, 0.08)",
  },
  summaryPositive: {
    borderColor: "rgba(60, 207, 145, 0.5)",
    backgroundColor: "rgba(60, 207, 145, 0.08)",
  },
  groupSummaryValue: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  groupSummaryLabel: {
    color: "#CCCCCC",
    fontSize: 10,
    marginTop: 2,
  },
  groupSummaryValueCompact: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  groupSummaryLabelCompact: {
    color: "#CCCCCC",
    fontSize: 11,
    marginTop: 2,
  },
  groupSummaryHint: {
    color: "#AAAAAA",
    fontSize: 12,
    marginTop: 12,
  },
  groupSummaryHintCompact: {
    marginTop: 4,
  },
  attentionCard: {
    backgroundColor: "#14142b",
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 107, 107, 0.2)",
  },
  attentionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  attentionHeaderCompact: {
    marginTop: 14,
  },
  attentionLink: {
    color: "#FFD700",
    fontSize: 12,
    fontWeight: "600",
  },
  attentionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 8,
  },
  attentionInfo: {
    flex: 1,
  },
  attentionName: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  attentionMeta: {
    color: "#AAAAAA",
    fontSize: 12,
    marginTop: 2,
  },
  attentionStatus: {
    fontSize: 11,
    fontWeight: "600",
  },
  summaryScorePill: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 40,
    marginHorizontal: 8,
  },
  summaryScoreValue: {
    fontSize: 16,
    fontWeight: "800",
  },
  summaryScoreLabel: {
    fontSize: 9,
    color: "#8a94a6",
    marginTop: -1,
  },
  groupActionsCard: {
    backgroundColor: "#14142b",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  statusCounterValue: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
  },
  statusCounterLabel: {
    color: "#CCCCCC",
    fontSize: 12,
    marginTop: 4,
  },
  statusHighlights: {
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderRadius: 12,
    padding: 12,
  },
  statusHighlightTitle: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
  },
  statusHighlightRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  statusHighlightName: {
    color: "#E5E5E5",
    fontSize: 13,
    flex: 1,
    marginRight: 8,
  },
  statusEmpty: {
    color: "#888",
    fontSize: 12,
  },
  statusBadge: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: "600",
  },
})

















































