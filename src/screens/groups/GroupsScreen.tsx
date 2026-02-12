"use client"

import { useEffect, useRef, useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
  RefreshControl,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import * as Linking from "expo-linking"
import { useNavigation, useRoute } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { useAuth } from "../../hooks/useAuth"
import { useSubscriptionCheck } from "../../hooks/useSubscriptionCheck"
import GroupService, { type Group, type GroupMember, type GroupAlert, type GroupActivity } from "../../services/firebase/GroupService"
import CoupleService, { type CoupleRelationship } from "../../services/firebase/CoupleService"
import GroupNotificationService from "../../services/notifications/GroupNotificationService"
import { useNotificationPreferences } from "../../hooks/useNotificationPreferences"
import GroupDetailModal from "../../components/GroupDetailModal"
import ReadingDetailModal from "../../components/ReadingDetailModal"
import GroupNotificationSettings from "../../components/GroupNotificationSettings"
import TransitInsightCard from "../../components/TransitInsightCard"
import InviteService from "../../services/InviteService"
import Avatar from "../../components/Avatar"
import ExpiryBanner from "../../components/ExpiryBanner"
import { db } from "../../config/firebase"
import { getExpiryBannerInfo } from "../../utils/expiry"
import { buildTransitTitle as buildSharedTransitTitle } from "../../utils/transitPresentation"
import { buildAstroTransitNarrative, buildArchetypeKeywordsForTransit, mergeNarrativeSegments } from "../../utils/astroInterpretation"
import { useAppLanguage } from "../../hooks/useAppLanguage"

const LIFE_AREA_OPTIONS = [
  { key: "amor", label: "Amor" },
  { key: "carreira", label: "Carreira" },
  { key: "financas", label: "Financas" },
  { key: "saude", label: "Saude" },
  { key: "familia", label: "Família" },
  { key: "espiritualidade", label: "Espiritualidade" },
  { key: "comunicacao", label: "Comunicação" },
  { key: "transformacao", label: "Transformação" },
]

const LIFE_AREA_KEYS = LIFE_AREA_OPTIONS.map((area) => area.key)

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
  } | null>(null)
  const focusHandledRef = useRef(false)
  const lastFocusKeyRef = useRef<string | null>(null)

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

  useEffect(() => {
    if (user) {
      loadUserGroups()
      loadCoupleRelationship()
    }
  }, [user])

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
      .catch(() => {})

    const subscription = Linking.addEventListener("url", ({ url }) => handleInviteUrl(url))

    return () => {
      isActive = false
      subscription?.remove?.()
    }
  }, [user])

  useEffect(() => {
    if (selectedGroup) {
      loadGroupData()
    }
  }, [selectedGroup])

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
      
      // TODO: Buscar partner por email
      // Por enquanto, vou simular com um ID ficticio
      Alert.alert(
        tr('groups.alert.inDevelopmentTitle', 'Funcionalidade em desenvolvimento'),
        tr(
          'groups.alert.partnerInviteSoon',
          'Em breve voce podera convidar seu parceiro pelo email. Por enquanto, peca para ele/ela criar uma conta no app.'
        )
      )
      
      setShowCreateCoupleModal(false)
      setPartnerEmail('')
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

  const getStatusColor = (status: string) => {
    switch (status) {
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
    switch (status) {
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
    switch (status) {
      case "critical":
        return tr('groups.status.critical', 'Critico')
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
    if (status === "critical" || status === "challenging") return "critical"
    if (status === "positive" || status === "excellent") return "positive"
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
    switch (status) {
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
    if (member.astrologicalStatus?.lifeAreas && typeof member.astrologicalStatus.lifeAreas === "object") {
      return member.astrologicalStatus.lifeAreas as Record<string, any>
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
    if (member.shareStatus === false || member.shareEnabled === false) return false
    const lifeAreas = resolveMemberLifeAreas(member)
    const sharedAreas = resolveSharedAreas(member)
    if (!sharedAreas.length) return false
    return !!lifeAreas && Object.keys(lifeAreas).length > 0
  }

  const mapPercentageToBucket = (percentage?: number | null) => {
    if (typeof percentage !== "number") return "neutral"
    if (percentage >= 60) return "positive"
    if (percentage >= 40) return "attention"
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
  const targetHouse = getTransitHouseTarget(transit)
  const currentHouse = getTransitCurrentHouse(transit)
  const target = targetPlanet
    ? formatPlanetLabel(targetPlanet)
    : targetAngle
    ? String(targetAngle)
    : targetHouse
  return buildSharedTransitTitle({
    transitPlanet,
    aspectLabel: aspect,
    targetLabel: target,
    houseNumber: currentHouse.replace("Casa ", ""),
    areaHouses: areaKey && AREA_HOUSES[areaKey] ? AREA_HOUSES[areaKey] : null,
  })
}

const buildTransitKeywords = (transit: any, areaKey?: string) => {
  const areaLabel = areaKey ? (LIFE_AREA_LABELS[areaKey] || areaKey) : ""
  const out = buildArchetypeKeywordsForTransit(
    {
      transitPlanet: transit?.transitPlanet,
      aspectName: transit?.aspectName || transit?.type || transit?.aspectType,
      natalPlanet: transit?.natalPlanet || transit?.target?.natalPlanet || transit?.target?.angle,
      house: transit?.target?.house ?? transit?.natalHouseImpacted ?? transit?.natalHouse,
    },
    areaLabel || "grupos",
    language
  )
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
  const house = getTransitHouseTarget(transit)
  if (house) return tx('groups.member.tech.house', 'Planeta em casa ({house})', { house: house.replace("Casa ", "") })
  return tx('groups.member.tech.context', 'Transito contextual da area')
}

const getTransitColumnKind = (transit: any): "planet" | "house" => {
  const targetHouse = Number(transit?.target?.house ?? transit?.natalHouseImpacted ?? transit?.natalHouse)
  const hasHouseTarget = Number.isFinite(targetHouse) && targetHouse >= 1 && targetHouse <= 12
  const explicitHouseTarget =
    String(transit?.natalPlanet || transit?.target?.natalPlanet || '')
      .toUpperCase()
      .startsWith('HOUSE_')
  const rawType = String(transit?.aspectName || transit?.type || transit?.aspectType || '').toLowerCase()
  const hasPlanetOrAngleTarget = !!(transit?.target?.natalPlanet || transit?.natalPlanet || transit?.target?.angle)
  if (hasPlanetOrAngleTarget && !explicitHouseTarget) return "planet"
  if (hasHouseTarget || explicitHouseTarget || rawType.includes('ingress')) return "house"

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
  if (hasRecognizedAspect && hasPlanetOrAngleTarget) {
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

const buildTransitDirectText = (
  transit: any,
  areaLabel: string,
  fallbackText?: string,
  areaCritical = false,
  tr?: LocalizeFn
) => {
  const tx = tr || ((_k: string, fallback: string) => fallback)
  const astroNarrative = buildAstroTransitNarrative(transit, areaLabel, language)
  if (astroNarrative?.directText) return astroNarrative.directText

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
        const bucket = mapPercentageToBucket(percentage ?? undefined)
        return {
          key,
          label: LIFE_AREA_LABELS[key] || key,
          percentage,
          bucket,
        }
      })
      .filter(Boolean) as Array<{
        key: string
        label: string
        percentage: number | null
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
  const summaryMembers = sortedMembers.filter((member) => hasVisibleStatus(member))

  const statusCounts = summaryMembers.reduce(
    (acc, member) => {
      buildMemberAreaEntries(member).forEach((entry) => {
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

  if (loading) {
    return (
      <LinearGradient colors={["#0F0F23", "#1A1A3A"]} style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>{tr('groups.loading', 'Carregando grupos...')}</Text>
        </View>
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

          
        </View>

        {expiryInfo.show && (
          <ExpiryBanner
            message={expiryMessage}
            variant={expiryInfo.variant}
            onPress={() => navigation.navigate("Premium" as never, { openTab: 'features' } as never)}
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
                    <TouchableOpacity style={styles.groupHeaderActionButton} onPress={openGroupOrder}>
                      <Ionicons name="swap-vertical" size={18} color="#FFD700" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.groupHeaderActionButton} onPress={openGroupActions}>
                      <Ionicons name="add" size={20} color="#FFD700" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.groupHeaderActionButton}
                      onPress={() => {
                        setSelectedGroupForDetail(selectedGroup)
                        setShowGroupDetail(true)
                      }}
                    >
                      <Ionicons name="ellipsis-horizontal" size={18} color="#FFD700" />
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity style={styles.groupHeaderPreferencesButton} onPress={openGroupSettings}>
                    <Ionicons name="options" size={12} color="#FFD700" />
                    <Text style={styles.groupHeaderPreferencesText}>{tr('groups.label.preferences', 'Preferencias')}</Text>
                  </TouchableOpacity>
                </View>
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

            <View style={styles.groupSummaryCard}>
              <View style={styles.groupSummaryHeader}>
                <Text style={styles.sectionTitle}>{tr('groups.section.generalStatus', 'Status geral')}</Text>
                <View style={styles.groupSummaryCounters}>
                  <View style={[styles.groupSummaryCounterCompact, styles.summaryCritical]}>
                    <Text style={styles.groupSummaryValueCompact}>{statusCounts.critical}</Text>
                    <Text style={styles.groupSummaryLabelCompact}>{tr('groups.status.criticalPlural', 'Criticos')}</Text>
                  </View>
                  <View style={[styles.groupSummaryCounterCompact, styles.summaryPositive]}>
                    <Text style={styles.groupSummaryValueCompact}>{statusCounts.positive}</Text>
                    <Text style={styles.groupSummaryLabelCompact}>{tr('groups.status.positivePlural', 'Positivos')}</Text>
                  </View>
                </View>
              </View>
              {highlightMembers.length > 0 && (
                <>
                  <View style={[styles.attentionHeader, styles.attentionHeaderCompact]}>
                    <Text style={styles.sectionTitle}>{tr('groups.section.needsAttention', 'Precisa de atencao')}</Text>
                    {visibleMembers.filter((member) => getMemberSummaryBucket(member) === "critical").length > 3 && (
                      <TouchableOpacity onPress={() => setShowGroupDetail(true)}>
                        <Text style={styles.attentionLink}>{tr('groups.action.viewAll', 'Ver todos')}</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  {highlightMembers.map((member) => {
                    const worst = getMemberWorstArea(member)
                    const percentage = typeof worst?.percentage === "number" ? Math.round(worst.percentage) : null
                    const bucket = worst ? worst.bucket : getMemberSummaryBucket(member)
                    const criticalEntries = buildMemberAreaEntries(member)
                      .filter((entry) => entry.bucket === "critical")
                    const criticalText = criticalEntries
                      .map((entry) => `${entry.label} ${entry.percentage !== null ? `${Math.round(entry.percentage)}%` : ""}`.trim())
                      .filter((text) => text.length > 0)
                      .join(" · ")
                    return (
                      <View key={member.userId} style={styles.attentionRow}>
                        <Avatar photoUrl={member.profilePhoto} name={member.displayName} size="small" />
                        <View style={styles.attentionInfo}>
                          <Text style={styles.attentionName}>{member.displayName}</Text>
                          <Text style={styles.attentionMeta}>
                            {criticalText || (worst ? worst.label : tr('groups.label.areaUnavailable', 'Area indisponivel'))}{" "}
                            {!criticalText && percentage !== null ? `- ${percentage}%` : ""}
                          </Text>
                        </View>
                        <Text style={[styles.attentionStatus, { color: mapBucketToColor(bucket) }]}>
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
                <TouchableOpacity style={styles.sectionIconButton} onPress={openMemberSort}>
                  <Ionicons name="swap-vertical" size={16} color="#FFD700" />
                </TouchableOpacity>
              </View>
              {otherMembers.map((member) => {
                const hasStatus = hasVisibleStatus(member)
                const entries = hasStatus ? buildMemberAreaEntries(member) : []
                return (
                  <View key={member.userId} style={styles.memberCardCompact}>
                    <View style={styles.memberHeaderCompact}>
                      <Avatar photoUrl={member.profilePhoto} name={member.displayName} size="small" />
                      <View style={styles.memberHeaderInfo}>
                        <Text style={styles.memberRowName} numberOfLines={1}>
                          {member.displayName}
                        </Text>
                        <Text style={styles.memberRowUpdate} numberOfLines={1}>
                          {!hasStatus
                            ? tr('groups.label.privateStatus', 'Status privado')
                            : member.lastStatusUpdate
                            ? tr('groups.label.updatedAgo', 'Atualizado ha {time}', { time: formatRelativeTime(new Date(member.lastStatusUpdate)) })
                            : tr('groups.label.noRecentUpdate', 'Sem atualizacao recente')}
                        </Text>
                      </View>
                    </View>

                    {hasStatus && entries.length > 0 ? (
                      <View style={styles.memberStatusGridCompact}>
                        {entries.map((entry) => {
                          const percentage =
                            typeof entry.percentage === "number" ? Math.round(entry.percentage) : null
                          const fillColor = mapBucketToColor(entry.bucket)
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
                              <LinearGradient colors={cardColors} style={styles.memberStatusMiniInner}>
                                <Text style={styles.memberStatusMiniLabel} numberOfLines={1}>
                                  {entry.label}
                                </Text>
                                <Text style={styles.memberStatusMiniValue}>
                                  {percentage !== null ? `${percentage}%` : "--"}
                                </Text>
                                <View style={styles.memberStatusMiniTrack}>
                                  <View
                                    style={[
                                      styles.memberStatusMiniFill,
                                      {
                                        width: `${Math.min(100, Math.max(0, percentage || 0))}%`,
                                        backgroundColor: fillColor,
                                      },
                                    ]}
                                  />
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

            <View style={styles.alertsSection}>
              <View style={styles.sectionTitleRow}>
                <Text style={styles.sectionTitle}>{tr('groups.section.groupFeed', 'Feed do grupo')}</Text>
                <TouchableOpacity style={styles.sectionIconButton} onPress={() => setShowMessageModal(true)}>
                  <Ionicons name="add" size={16} color="#FFD700" />
                </TouchableOpacity>
              </View>
              <View style={styles.feedTabs}>
                {[
                  { key: "all", label: tr('groups.feed.all', 'Todos') },
                  { key: "messages", label: tr('groups.feed.messages', 'Mensagens') },
                  { key: "alerts", label: tr('groups.feed.alerts', 'Alertas') },
                ].map((tab) => (
                  <TouchableOpacity
                    key={tab.key}
                    style={[styles.feedTab, feedFilter === tab.key && styles.feedTabActive]}
                    onPress={() => setFeedFilter(tab.key as typeof feedFilter)}
                  >
                    <Text style={[styles.feedTabText, feedFilter === tab.key && styles.feedTabTextActive]}>
                      {tab.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {(groupAlerts || [])
                .filter((alert) => {
                  if (feedFilter === "all") return true
                  const type = alert.type || "event"
                  const isMessage = type === "custom_message"
                  return feedFilter === "messages" ? isMessage : !isMessage
                })
                .slice(0, 10)
                .map((alert) => (
                  <View key={alert.id} style={styles.feedItem}>
                    <View style={styles.feedIcon}>
                      <Ionicons name={getStatusIcon(alert.status) as any} size={16} color={getStatusColor(alert.status)} />
                    </View>
                    <View style={styles.feedContent}>
                      <View style={styles.feedMeta}>
                        <View style={[styles.feedTag, styles.feedTagType]}>
                          <Text style={[styles.feedTagText, styles.feedTagTypeText]}>
                            {(alert.type || "event") === "custom_message" ? tr('groups.feed.messageTag', 'Mensagem') : tr('groups.feed.alertTag', 'Alerta')}
                          </Text>
                        </View>
                        <View style={[styles.feedTag, { borderColor: getStatusColor(alert.status) }]}>
                          <Text style={[styles.feedTagText, { color: getStatusColor(alert.status) }]}>
                            {getStatusLabel(alert.status)}
                          </Text>
                        </View>
                        {alert.area && (
                          <View style={styles.feedTag}>
                            <Text style={styles.feedTagText}>{lifeAreaLabel(alert.area)}</Text>
                          </View>
                        )}
                        <Text style={styles.feedTime}>{formatRelativeTime(alert.createdAt)}</Text>
                      </View>
                      <Text style={styles.feedMessage}>
                        <Text style={styles.alertUser}>{alert.userName}</Text> {alert.message}
                      </Text>
                    </View>
                  </View>
                ))}
            </View>
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
        onRequestClose={() => {
          setShowMemberAreaModal(false)
          setSelectedMemberArea(null)
          setSelectedMemberTransitDetail(null)
          setShowMemberAreaCalc(false)
        }}
      >
        <View style={styles.memberAreaBackdrop}>
          <View style={styles.memberAreaCard}>
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
              const transitAspects = areaTransits.map((transit) => {
                const label = `${formatPlanetLabel(transit.transitPlanet)} ${formatAspectLabel(transit.type)} ${formatPlanetLabel(transit.natalPlanet)}`
                const duration = formatTransitDuration(transit)
                return duration ? `${label} (${duration})` : label
              })
              const activeTransitLabels = activeTransitItems.map((transit) => {
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
                  : (activeTransitItems.length ? activeTransitItems : areaTransits)
                      .slice(0, 2)
                      .map((transit, index) => {
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
                  <LinearGradient colors={cardColors} style={styles.memberAreaHeader}>
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
                  >
                    {(() => {
                      const areaLabel = lifeAreaLabel(key)
                      const areaCritical = bucket === "critical"
                      const baseTransits = (areaTransits.length ? areaTransits : activeTransitItems).map((transit, index) => {
                        const status = classifyTransitStatus(transit, tr)
                        const title = buildTransitTitle(transit, key)
                        const natalHouseLabel = getTransitNatalHouse(transit)
                        const transitHouseLabel = getTransitCurrentHouse(transit)
                        const houseLabel = transitHouseLabel || natalHouseLabel || null
                        const houseLabelPrefix = transitHouseLabel
                          ? tr('groups.member.currentTransitHouse', 'Casa de transito atual')
                          : tr('groups.member.natalActivatedHouse', 'Casa natal ativada')
                        const areaHousesText = AREA_HOUSES[key]?.length ? AREA_HOUSES[key].join("/") : ""
                        const technicalParts = [getTransitTechnicalTypeLabel(transit, tr)]
                        if (transitHouseLabel && natalHouseLabel && transitHouseLabel !== natalHouseLabel) {
                          technicalParts.push(
                            tr('groups.member.natalActivatedHouseValue', 'Casa natal ativada: {house}', {
                              house: natalHouseLabel.replace("Casa ", ""),
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
                        const astroNarrative = buildAstroTransitNarrative(transit, areaLabel, language)
                        const suggestionText = String(suggestion?.text || '').trim()
                        const normalizedSuggestion = suggestionText
                          .toLowerCase()
                          .normalize("NFD")
                          .replace(/[\u0300-\u036f]/g, "")
                        const shouldUseSuggestionText = suggestionText.length > 20
                          && !normalizedSuggestion.includes("fase de integracao e calibragem")
                          && !normalizedSuggestion.includes("momento de observacao")
                        const fullLines = mergeNarrativeSegments([
                          astroNarrative.fullText,
                          shouldUseSuggestionText ? suggestionText : "",
                          suggestion?.title
                            ? tr('groups.member.focusTitle', 'Foco: {title}', { title: String(suggestion.title) })
                            : "",
                          mainPlanets.length
                            ? tr('groups.member.basePlanets', 'Planetas de base: {planets}', { planets: mainPlanets.slice(0, 5).join(", ") })
                            : "",
                        ], { exclude: [directText] })
                        const orbText = Number.isFinite(transit?.orb)
                          ? tr('groups.member.orb', 'Orb {value}deg', { value: Number(transit.orb).toFixed(1) })
                          : ""
                        const impactText = Number.isFinite(transit?.impact)
                          ? tr('groups.member.impact', 'Impacto {value}', { value: Number(transit.impact).toFixed(2) })
                          : ""
                        return {
                          id: String(transit?.id || `member-transit-${index}`),
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
                            : tr('groups.member.adjustNextStep', 'Ajuste o proximo passo com foco e constancia.'),
                          metaText: [orbText, impactText].filter(Boolean).join(" • "),
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

                      const orderedTransits = [...baseTransits]
                        .sort((a, b) => b.rank - a.rank)
                      const planetTransits = orderedTransits.filter((item) => item.columnKind === "planet")
                      const houseTransits = orderedTransits.filter((item) => item.columnKind === "house")

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
                          onToggleFull={() => {}}
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
                          {planetTransits.length ? (
                            <View style={styles.memberTransitSection}>
                              <View style={styles.memberTransitColumnHeader}>
                                <Text style={styles.memberTransitColumnTitle}>{tr('groups.member.planetPlanet', 'Planeta x Planeta')}</Text>
                                <Text style={styles.memberTransitColumnMeta}>{planetTransits.length}</Text>
                              </View>
                              {planetTransits.map((item, index) => renderTransitCard(item, index))}
                            </View>
                          ) : null}

                          {houseTransits.length ? (
                            <View style={styles.memberTransitSection}>
                              <View style={styles.memberTransitColumnHeader}>
                                <Text style={styles.memberTransitColumnTitle}>{tr('groups.member.planetHouse', 'Planeta x Casa')}</Text>
                                <Text style={styles.memberTransitColumnMeta}>{houseTransits.length}</Text>
                              </View>
                              {houseTransits.map((item, index) => renderTransitCard(item, index))}
                            </View>
                          ) : null}

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
              onPress={() => {
                setShowMemberAreaModal(false)
                setSelectedMemberArea(null)
                setSelectedMemberTransitDetail(null)
                setShowMemberAreaCalc(false)
              }}
            >
              <Text style={styles.memberAreaCloseText}>{tr('common.close', 'Fechar')}</Text>
            </TouchableOpacity>
          </View>
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
  },
  header: {
    paddingTop: 20,
    paddingBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
  },
  memberStatusMiniLabel: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "600",
  },
  memberStatusMiniValue: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 2,
  },
  memberStatusMiniTrack: {
    height: 4,
    borderRadius: 999,
    backgroundColor: "rgba(255, 255, 255, 0.35)",
    overflow: "hidden",
    marginTop: 4,
  },
  memberStatusMiniFill: {
    height: "100%",
    borderRadius: 999,
  },
  memberDetailEmpty: {
    color: "#888",
    fontSize: 11,
    marginTop: 4,
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


















































