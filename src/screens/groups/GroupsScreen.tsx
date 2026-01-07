"use client"

import { useEffect, useState } from "react"
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
import { Ionicons } from "@expo/vector-icons"
import { useAuth } from "../../hooks/useAuth"
import GroupService, { type Group, type GroupMember, type GroupAlert, type GroupActivity } from "../../services/firebase/GroupService"
import CoupleService, { type CoupleRelationship } from "../../services/firebase/CoupleService"
import GroupNotificationService from "../../services/notifications/GroupNotificationService"
import { useNotificationPreferences } from "../../hooks/useNotificationPreferences"
import GroupDetailModal from "../../components/GroupDetailModal"
import GroupNotificationSettings from "../../components/GroupNotificationSettings"
import InviteService from "../../services/InviteService"
import Avatar from "../../components/Avatar"

const LIFE_AREA_OPTIONS = [
  { key: "amor", label: "Amor" },
  { key: "carreira", label: "Carreira" },
  { key: "financas", label: "Financas" },
  { key: "saude", label: "Saude" },
  { key: "familia", label: "Familia" },
  { key: "espiritualidade", label: "Espiritualidade" },
  { key: "comunicacao", label: "Comunicacao" },
  { key: "transformacao", label: "Transformacao" },
]

const LIFE_AREA_KEYS = LIFE_AREA_OPTIONS.map((area) => area.key)

const LIFE_AREA_LABELS = LIFE_AREA_OPTIONS.reduce((acc, area) => {
  acc[area.key] = area.label
  return acc
}, {} as Record<string, string>)

const formatLifeAreas = (areas?: string[]) => {
  if (!areas || areas.length === 0) return "Todas as áreas"
  return areas
    .map((area) => LIFE_AREA_OPTIONS.find((option) => option.key === area)?.label || area)
    .join(", ")
}

export default function GroupsScreen() {
  const { user } = useAuth()
  const { preferences } = useNotificationPreferences()
  
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
  const [expandedMemberId, setExpandedMemberId] = useState<string | null>(null)

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
        setInvitePreviewError(group ? "" : "Codigo nao encontrado")
      })
      .catch(() => {
        if (!isActive) return
        setInvitePreview(null)
        setInvitePreviewError("Não foi possível validar o codigo")
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

  const loadUserGroups = async () => {
    try {
      setLoading(true)
      const userGroups = await GroupService.getUserGroups(user!.uid)
      setGroups(userGroups)

      if (userGroups.length > 0 && !selectedGroup) {
        setSelectedGroup(userGroups[0])
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
      Alert.alert('Erro', 'Por favor, insira o email do seu parceiro')
      return
    }
    
    try {
      setCoupleLoading(true)
      
      // TODO: Buscar partner por email
      // Por enquanto, vou simular com um ID ficticio
      Alert.alert(
        'Funcionalidade em desenvolvimento',
        'Em breve você podera convidar seu parceiro pelo email. Por enquanto, peca para ele/ela criar uma conta no app.'
      )
      
      setShowCreateCoupleModal(false)
      setPartnerEmail('')
    } catch (error) {
      console.error('Erro ao criar relacionamento:', error)
      Alert.alert('Erro', 'Não foi possível criar o relacionamento')
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
      
      Alert.alert('Sucesso', 'Compatibilidade atualizada!')
    } catch (error) {
      console.error('Erro ao atualizar compatibilidade:', error)
      Alert.alert('Erro', 'Não foi possível atualizar a compatibilidade')
    } finally {
      setCoupleLoading(false)
    }
  }

  const createGroup = async () => {
    if (!newGroupName.trim()) {
      Alert.alert("Erro", "Nome do grupo e obrigatorio")
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
      Alert.alert("Sucesso", "Grupo criado com sucesso!")
    } catch (error: any) {
      Alert.alert("Erro", error.message)
    }
  }

  const joinGroup = async () => {
    if (!inviteCode.trim()) {
      Alert.alert("Erro", "Codigo de convite e obrigatorio")
      return
    }

    if (invitePreview && (invitePreview.inviteEnabled === false || invitePreview.inviteExpiresAt && invitePreview.inviteExpiresAt.getTime() < Date.now())) {
      Alert.alert("Convite indisponível", "Este convite está desativado ou expirado.")
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
      
      Alert.alert("Sucesso", "Voce entrou no grupo!")
    } catch (error: any) {
      Alert.alert("Erro", error.message)
    }
  }
  
  // === FUNCOES DE NOTIFICACOES ===
  
  const sendGroupMessage = async () => {
    if (!selectedGroup || !groupMessage.trim()) {
      Alert.alert("Erro", "Mensagem e obrigatoria")
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
      Alert.alert("Sucesso", "Mensagem enviada para o grupo!")
      
    } catch (error: any) {
      console.error('Erro ao enviar mensagem:', error)
      Alert.alert("Erro", "Não foi possível enviar a mensagem")
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
      Alert.alert("Sucesso", "Convite atualizado")
    } catch (error: any) {
      console.error("Erro ao atualizar convite:", error)
      Alert.alert("Erro", error?.message || "Não foi possível atualizar convite")
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
      Alert.alert("Sucesso", "Membro removido do grupo")
    } catch (error: any) {
      console.error("Erro ao remover membro:", error)
      Alert.alert("Erro", error?.message || "Não foi possível remover o membro")
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
      Alert.alert("Sucesso", "Voce saiu do grupo")
    } catch (error: any) {
      console.error("Erro ao sair do grupo:", error)
      Alert.alert("Erro", error?.message || "Não foi possível sair do grupo")
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
        return "Crítico"
      case "challenging":
        return "Desafiador"
      case "neutral":
        return "Neutro"
      case "positive":
        return "Positivo"
      case "excellent":
        return "Otimo"
      default:
        return "Neutro"
    }
  }

  const getStatusBucket = (status?: string) => {
    if (status === "critical" || status === "challenging") return "critical"
    if (status === "positive" || status === "excellent") return "positive"
    return "neutral"
  }

  const formatRelativeTime = (value?: Date | null) => {
    if (!value) return "Agora"
    const date = value instanceof Date ? value : new Date(value)
    const diffMs = Date.now() - date.getTime()
    const diffMinutes = Math.floor(diffMs / (1000 * 60))
    if (diffMinutes < 1) return "Agora"
    if (diffMinutes < 60) return `${diffMinutes} min`
    const diffHours = Math.floor(diffMinutes / 60)
    if (diffHours < 24) return `${diffHours} h`
    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays} d`
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
    return member.lifeAreas || member.astrologicalStatus?.lifeAreas || {}
  }

  const resolveSharedAreas = (member: GroupMember) => {
    const lifeAreas = resolveMemberLifeAreas(member)
    if (member.sharedLifeAreas && member.sharedLifeAreas.length) return member.sharedLifeAreas
    if (lifeAreas && Object.keys(lifeAreas).length) return Object.keys(lifeAreas)
    if (selectedGroup?.sharedLifeAreas && selectedGroup.sharedLifeAreas.length) return selectedGroup.sharedLifeAreas
    return LIFE_AREA_KEYS
  }

  const hasVisibleStatus = (member: GroupMember) => {
    const lifeAreas = resolveMemberLifeAreas(member)
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
        return "#FF6B6B"
      case "attention":
        return "#F2B94B"
      case "positive":
        return "#3CCF91"
      default:
        return "#888888"
    }
  }

  const mapBucketToLabel = (bucket: string) => {
    switch (bucket) {
      case "critical":
        return "Crítico"
      case "attention":
        return "Atenção"
      case "positive":
        return "Positivo"
      default:
        return "Neutro"
    }
  }

  const mapTrendLabel = (trend?: string) => {
    if (!trend) return ""
    const normalized = trend.toLowerCase()
    switch (normalized) {
      case "stable":
        return "Estável"
      case "rising":
      case "up":
        return "Em alta"
      case "falling":
      case "down":
        return "Em queda"
      case "positive":
        return "Positiva"
      case "neutral":
        return "Neutra"
      case "negative":
        return "Negativa"
      default:
        return trend
    }
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
    return sharedAreas
      .map((key) => {
        const data = (lifeAreas as any)?.[key]
        if (!data) return null
        const percentage =
          typeof data.percentage === "number"
            ? data.percentage
            : typeof data.status === "number"
            ? data.status
            : null
        const bucket = mapPercentageToBucket(percentage ?? undefined)
        return {
          key,
          label: LIFE_AREA_LABELS[key] || key,
          percentage,
          bucket,
        }
      })
      .filter((entry): entry is { key: string; label: string; percentage: number | null; bucket: string } => !!entry)
      .sort((a, b) => {
        const priorityDiff = getBucketPriority(a.bucket) - getBucketPriority(b.bucket)
        if (priorityDiff !== 0) return priorityDiff
        if (typeof a.percentage === "number" && typeof b.percentage === "number") {
          return a.percentage - b.percentage
        }
        return a.label.localeCompare(b.label)
      })
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
    const aBucket = getMemberSummaryBucket(a)
    const bBucket = getMemberSummaryBucket(b)
    const rankDiff = getSummaryRank(aBucket) - getSummaryRank(bBucket)
    if (rankDiff !== 0) return rankDiff
    return a.displayName.localeCompare(b.displayName)
  })

  const visibleMembers = sortedMembers.filter((member) => hasVisibleStatus(member))

  const statusCounts = visibleMembers.reduce(
    (acc, member) => {
      const bucket = getMemberSummaryBucket(member)
      acc[bucket] += 1
      return acc
    },
    { critical: 0, attention: 0, positive: 0 }
  )

  const lastStatusUpdate = sortedMembers.reduce<Date | null>((latest, member) => {
    const update = member.lastStatusUpdate ? new Date(member.lastStatusUpdate) : null
    if (!update || Number.isNaN(update.getTime())) return latest
    if (!latest || update.getTime() > latest.getTime()) return update
    return latest
  }, null)

  const highlightMembers = visibleMembers
    .filter((member) => getMemberSummaryBucket(member) === "critical")
    .slice(0, 3)

  if (loading) {
    return (
      <LinearGradient colors={["#0F0F23", "#1A1A3A"]} style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando grupos...</Text>
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

            <TouchableOpacity style={styles.addGroupButton} onPress={() => setShowCreateModal(true)}>
              <Ionicons name="add" size={20} color="#FFD700" />
            </TouchableOpacity>
          </ScrollView>

          <TouchableOpacity style={styles.joinButton} onPress={() => setShowJoinModal(true)}>
            <Ionicons name="enter" size={20} color="#FFD700" />
            <Text style={styles.joinButtonText}>Entrar</Text>
          </TouchableOpacity>
        </View>

        {selectedGroup && (
          <>
            <View style={styles.groupHeaderCard}>
              <View style={styles.groupHeaderTop}>
                <View style={styles.groupHeaderTitles}>
                  <Text style={styles.groupHeaderTitle}>{selectedGroup.name}</Text>
                  <Text style={styles.groupHeaderSubtitle}>{selectedGroup.description || "Grupo astrológico"}</Text>
                </View>
                <TouchableOpacity
                  style={styles.groupHeaderManage}
                  onPress={() => {
                    setSelectedGroupForDetail(selectedGroup)
                    setShowGroupDetail(true)
                  }}
                >
                  <Ionicons name="ellipsis-horizontal" size={18} color="#0a0e27" />
                </TouchableOpacity>
              </View>
              <View style={styles.groupHeaderMeta}>
                <View style={styles.groupMetaChip}>
                  <Ionicons name="people" size={14} color="#FFD700" />
                  <Text style={styles.groupMetaText}>
                    {selectedGroup.members?.length || groupMembers.length} membros
                  </Text>
                </View>
                <View style={styles.groupMetaChip}>
                  <Ionicons name="grid" size={14} color="#FFD700" />
                  <Text style={styles.groupMetaText}>
                    {(selectedGroup.sharedLifeAreas || LIFE_AREA_KEYS).length} áreas
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.membersSection}>
              <Text style={styles.sectionTitle}>Membros</Text>
              {sortedMembers.map((member) => {
                const hasStatus = hasVisibleStatus(member)
                const entries = hasStatus ? buildMemberAreaEntries(member) : []                const summaryBucket = getMemberSummaryBucket(member)
                const bucketCounts = entries.reduce(
                  (acc, entry) => {
                    acc[entry.bucket] += 1
                    return acc
                  },
                  { critical: 0, attention: 0, positive: 0, neutral: 0 }
                )
                return (
                  <TouchableOpacity
                    key={member.userId}
                    style={styles.memberRow}
                    onPress={() => {
                      setExpandedMemberId((prev) => (prev === member.userId ? null : member.userId))
                    }}
                  >
                    <Avatar photoUrl={member.profilePhoto} name={member.displayName} size="medium" />
                    <View style={styles.memberRowInfo}>
                      <View style={styles.memberRowHeader}>
                        <Text style={styles.memberRowName}>{member.displayName}</Text>
                        {hasStatus && (
                          <View style={styles.memberBadgeRow}>
                            {bucketCounts.critical > 0 && (
                              <View style={[styles.memberBadge, { backgroundColor: mapBucketToColor("critical") }]}>
                                <Text style={styles.memberBadgeText}>{bucketCounts.critical}</Text>
                              </View>
                            )}
                            {bucketCounts.attention > 0 && (
                              <View style={[styles.memberBadge, { backgroundColor: mapBucketToColor("attention") }]}>
                                <Text style={styles.memberBadgeText}>{bucketCounts.attention}</Text>
                              </View>
                            )}
                            {bucketCounts.positive > 0 && (
                              <View style={[styles.memberBadge, { backgroundColor: mapBucketToColor("positive") }]}>
                                <Text style={styles.memberBadgeText}>{bucketCounts.positive}</Text>
                              </View>
                            )}
                          </View>
                        )}
                        <View
                          style={[
                            styles.memberStatusDot,
                            { backgroundColor: hasStatus ? mapBucketToColor(summaryBucket) : "#555" },
                          ]}
                        />
                      </View>
                        <Text style={styles.memberRowUpdate}>
                          {!hasStatus
                            ? "Status privado"
                            : member.lastStatusUpdate
                            ? `Atualizado há ${formatRelativeTime(new Date(member.lastStatusUpdate))}`
                            : "Sem atualização recente"}
                        </Text>
                        {hasStatus && (
                          <Text style={styles.memberBadgeLegend}>
                            C = crítico · A = atenção · P = positivo
                          </Text>
                        )}
                        <View style={styles.memberStatusGrid}>
                          {entries.map((entry) => {
                            const chipColor = mapBucketToColor(entry.bucket)
                            const percentage =
                              typeof entry.percentage === "number" ? Math.round(entry.percentage) : null
                            return (
                              <View key={`${member.userId}-${entry.key}`} style={styles.memberStatusTile}>
                                <Text style={styles.memberStatusTitle} numberOfLines={1} ellipsizeMode="tail">
                                  {entry.label}
                                </Text>
                                <View style={styles.memberStatusMeta}>
                                  <Text style={[styles.memberStatusValue, { color: chipColor }]}>
                                    {percentage !== null ? `${percentage}%` : "--"}
                                  </Text>
                                  <Text style={[styles.memberStatusPill, { color: chipColor }]}>
                                    {mapBucketToLabel(entry.bucket)}
                                  </Text>
                                </View>
                              </View>
                            )
                          })}
                        </View>
                      {expandedMemberId === member.userId && (
                        <View style={styles.memberDetails}>
                          {!hasStatus ? (
                            <Text style={styles.memberDetailEmpty}>Status privado para este grupo.</Text>
                          ) : (
                            <View style={styles.memberDetailsGrid}>
                              {entries.map((entry) => {
                                const detail = getMemberAreaDetail(member, entry.key)
                                const percentage =
                                  typeof entry.percentage === "number" ? Math.round(entry.percentage) : null
                          const influences = formatAreaInfluences(detail)
                          return (
                            <View key={`${member.userId}-detail-${entry.key}`} style={styles.memberDetailRow}>
                                    <View style={styles.memberDetailHeader}>
                                      <Text style={styles.memberDetailTitle}>{entry.label}</Text>
                                      <Text style={[styles.memberDetailStatus, { color: mapBucketToColor(entry.bucket) }]}>
                                        {percentage !== null ? `${percentage}%` : "--"} {mapBucketToLabel(entry.bucket)}
                                      </Text>
                                    </View>
                                    {detail?.trend && (
                                      <Text style={styles.memberDetailMeta} numberOfLines={1} ellipsizeMode="tail">
                                        Tendência: {mapTrendLabel(detail.trend)}
                                      </Text>
                                    )}
                              {detail?.description && (
                                <Text style={styles.memberDetailMeta} numberOfLines={1} ellipsizeMode="tail">
                                  {detail.description}
                                </Text>
                              )}
                              {influences ? (
                                <Text style={styles.memberDetailMeta} numberOfLines={1} ellipsizeMode="tail">
                                  Planetas: {influences}
                                </Text>
                              ) : null}
                            </View>
                          )
                        })}
                            </View>
                          )}
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                )
              })}
            </View>

            <View style={styles.groupSummaryCard}>
              <View style={styles.groupSummaryHeader}>
                <Text style={styles.sectionTitle}>Status geral</Text>
                <TouchableOpacity style={styles.statusActionButton} onPress={openGroupSettings}>
                  <Ionicons name="options" size={14} color="#FFD700" />
                  <Text style={styles.statusActionText}>Preferências</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.statusUpdated}>
                Atualizado {lastStatusUpdate ? `há ${formatRelativeTime(lastStatusUpdate)}` : "agora"}
              </Text>
              <View style={styles.groupSummaryCounters}>
                <View style={[styles.groupSummaryCounter, styles.summaryCritical]}>
                  <Text style={styles.groupSummaryValue}>{statusCounts.critical}</Text>
                  <Text style={styles.groupSummaryLabel}>Críticos</Text>
                </View>
                <View style={[styles.groupSummaryCounter, styles.summaryAttention]}>
                  <Text style={styles.groupSummaryValue}>{statusCounts.attention}</Text>
                  <Text style={styles.groupSummaryLabel}>Atenção</Text>
                </View>
                <View style={[styles.groupSummaryCounter, styles.summaryPositive]}>
                  <Text style={styles.groupSummaryValue}>{statusCounts.positive}</Text>
                  <Text style={styles.groupSummaryLabel}>Positivos</Text>
                </View>
              </View>
              {visibleMembers.length === 0 ? (
                <Text style={styles.groupSummaryHint}>Sem status compartilhado no grupo</Text>
              ) : statusCounts.critical > 0 ? (
                <Text style={styles.groupSummaryHint}>Precisa de atenção</Text>
              ) : (
                <Text style={styles.groupSummaryHint}>Sem membros em status crítico-social</Text>
              )}
            </View>

            {highlightMembers.length > 0 && (
              <View style={styles.attentionCard}>
                <View style={styles.attentionHeader}>
                  <Text style={styles.sectionTitle}>Precisa de atenção</Text>
                  {sortedMembers.filter((member) => getMemberSummaryBucket(member) === "critical").length > 3 && (
                    <TouchableOpacity onPress={() => setShowGroupDetail(true)}>
                      <Text style={styles.attentionLink}>Ver todos</Text>
                    </TouchableOpacity>
                  )}
                </View>
                {highlightMembers.map((member) => {
                  const worst = getMemberWorstArea(member)
                  const percentage = typeof worst?.percentage === "number" ? Math.round(worst.percentage) : null
                  const bucket = worst ? worst.bucket : getMemberSummaryBucket(member)
                  return (
                    <View key={member.userId} style={styles.attentionRow}>
                      <Avatar photoUrl={member.profilePhoto} name={member.displayName} size="small" />
                      <View style={styles.attentionInfo}>
                        <Text style={styles.attentionName}>{member.displayName}</Text>
                        <Text style={styles.attentionMeta}>
                          {worst ? worst.label : "Área indisponível"}{" "}
                          {percentage !== null ? `• ${percentage}%` : ""}
                        </Text>
                      </View>
                      <Text style={[styles.attentionStatus, { color: mapBucketToColor(bucket) }]}>
                        {member.lastStatusUpdate
                          ? `${formatRelativeTime(member.lastStatusUpdate)}`
                          : "Agora"}
                      </Text>
                    </View>
                  )
                })}
              </View>
            )}

            <View style={styles.alertsSection}>
              <Text style={styles.sectionTitle}>Feed do grupo</Text>
              <View style={styles.feedTabs}>
                {[
                  { key: "all", label: "Todos" },
                  { key: "messages", label: "Mensagens" },
                  { key: "alerts", label: "Alertas" },
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
                            {(alert.type || "event") === "custom_message" ? "Mensagem" : "Alerta"}
                          </Text>
                        </View>
                        <View style={[styles.feedTag, { borderColor: getStatusColor(alert.status) }]}>
                          <Text style={[styles.feedTagText, { color: getStatusColor(alert.status) }]}>
                            {getStatusLabel(alert.status)}
                          </Text>
                        </View>
                        {alert.area && (
                          <View style={styles.feedTag}>
                            <Text style={styles.feedTagText}>{LIFE_AREA_LABELS[alert.area] || alert.area}</Text>
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

            <View style={styles.groupActionsCard}>
              <Text style={styles.sectionTitle}>Ações do grupo</Text>
              <View style={styles.actionButtonsRow}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.messageButton]}
                  onPress={() => setShowMessageModal(true)}
                  disabled={sendingNotification}
                >
                  <Ionicons name="chatbubble" size={18} color="#FFFFFF" />
                  <Text style={styles.actionButtonText}>Mensagem</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.alertButton]}
                  onPress={() => setFeedFilter("alerts")}
                >
                  <Ionicons name="notifications" size={18} color="#FFFFFF" />
                  <Text style={styles.actionButtonText}>Alertas</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.settingsButton]}
                  onPress={openGroupSettings}
                >
                  <Ionicons name="settings" size={18} color="#FFFFFF" />
                  <Text style={styles.actionButtonText}>Preferências</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}

        {groups.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={64} color="#666" />
            <Text style={styles.emptyStateTitle}>Nenhum grupo encontrado</Text>
            <Text style={styles.emptyStateText}>
              Crie seu primeiro grupo ou entre em um existente usando um código de convite
            </Text>
            <TouchableOpacity style={styles.createFirstGroupButton} onPress={() => setShowCreateModal(true)}>
              <Text style={styles.createFirstGroupButtonText}>Criar Primeiro Grupo</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Modal Criar Grupo */}
      <Modal visible={showCreateModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Criar Novo Grupo</Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Nome do grupo"
              placeholderTextColor="#888"
              value={newGroupName}
              onChangeText={setNewGroupName}
            />

            <TextInput
              style={[styles.modalInput, styles.modalTextArea]}
              placeholder="Descrição (opcional)"
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
                      {area.label}
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
                      {area.label}
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
                <Text style={styles.modalButtonCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButtonConfirm} onPress={createGroup}>
                <Text style={styles.modalButtonConfirmText}>Criar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Entrar no Grupo */}
      <Modal visible={showJoinModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Entrar no Grupo</Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Codigo de convite"
              placeholderTextColor="#888"
              value={inviteCode}
              onChangeText={setInviteCode}
              autoCapitalize="characters"
            />
            {invitePreviewLoading && (
              <Text style={styles.invitePreviewText}>Carregando grupo...</Text>
            )}

            {invitePreview && (
              <View style={styles.invitePreviewBox}>
                <Text style={styles.invitePreviewTitle}>{invitePreview.name}</Text>
                <Text style={styles.invitePreviewText}>
                  Áreas compartilhadas: {formatLifeAreas(invitePreview.sharedLifeAreas)}
                </Text>
                <Text style={styles.invitePreviewText}>
                  Áreas notificadas: {formatLifeAreas(invitePreview.notifiedLifeAreas)}
                </Text>
                {invitePreview.inviteEnabled === false && (
                  <Text style={styles.invitePreviewError}>Convite desativado pelo admin</Text>
                )}
                {invitePreview.inviteExpiresAt && invitePreview.inviteExpiresAt.getTime() < Date.now() && (
                  <Text style={styles.invitePreviewError}>Convite expirado</Text>
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
                <Text style={styles.modalButtonCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButtonConfirm} onPress={joinGroup}>
                <Text style={styles.modalButtonConfirmText}>Entrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      {/* Modal Enviar Mensagem */}
      <Modal visible={showMessageModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Enviar Mensagem para o Grupo</Text>
            
            <Text style={styles.modalSubtitle}>
              Todos os membros do grupo receberao uma notificacao
            </Text>

            <TextInput
              style={[styles.modalInput, styles.modalTextArea]}
              placeholder="Digite sua mensagem..."
              placeholderTextColor="#888"
              value={groupMessage}
              onChangeText={setGroupMessage}
              multiline
              numberOfLines={4}
              maxLength={200}
            />
            
            <Text style={styles.characterCount}>
              {groupMessage.length}/200 caracteres
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.modalButtonCancel} 
                onPress={() => {
                  setShowMessageModal(false)
                  setGroupMessage("")
                }}
              >
                <Text style={styles.modalButtonCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButtonConfirm, sendingNotification && styles.modalButtonDisabled]} 
                onPress={sendGroupMessage}
                disabled={sendingNotification || !groupMessage.trim()}
              >
                <Text style={styles.modalButtonConfirmText}>
                  {sendingNotification ? "Enviando..." : "Enviar"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      {/* Modal de Detalhes do Grupo */}
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
          Alert.alert('Em breve', 'Sistema de convites em desenvolvimento!')
        }}
        onLeaveGroup={handleLeaveGroup}
        onRemoveMember={(member) => handleRemoveMember(member.userId)}
        onUpdateInviteSettings={handleUpdateInviteSettings}
        onMemberProfile={(member) => {
          // Acao de ver perfil do membro
          Alert.alert('Perfil', `Ver perfil de ${member.displayName}`)
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
    paddingHorizontal: 16,
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
  addGroupButton: {
    backgroundColor: "#2C2C2E",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  joinButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2C2C2E",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  joinButtonText: {
    color: "#FFD700",
    fontSize: 14,
    marginLeft: 4,
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
  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#1C1C1E",
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
  },
  memberRowInfo: {
    flex: 1,
  },
  memberRowHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  memberStatusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  memberBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  memberBadge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
    opacity: 0.8,
  },
  memberBadgeText: {
    color: "#0B0B0F",
    fontSize: 10,
    fontWeight: "700",
  },
  memberRowName: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
    flex: 1,
  },
  memberRowMeta: {
    color: "#888",
    fontSize: 12,
    marginTop: 4,
  },
  memberRowUpdate: {
    color: "#666",
    fontSize: 11,
    marginTop: 4,
  },
  memberBadgeLegend: {
    color: "#6B6B74",
    fontSize: 10,
    marginTop: 4,
  },
  memberAreaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 8,
  },
  memberStatusGrid: {
    marginTop: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  memberStatusTile: {
    width: "48%",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  memberStatusTitle: {
    color: "#E8E8F6",
    fontSize: 12,
    fontWeight: "600",
  },
  memberStatusMeta: {
    marginTop: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  memberStatusValue: {
    fontSize: 13,
    fontWeight: "700",
  },
  memberStatusPill: {
    fontSize: 11,
    fontWeight: "600",
    opacity: 0.85,
  },
  memberAreaChip: {
    borderWidth: 1,
    borderColor: "#2C2C2E",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    maxWidth: 150,
    flexShrink: 1,
  },
  memberAreaText: {
    color: "#CCCCCC",
    fontSize: 10,
    fontWeight: "600",
    maxWidth: 134,
  },
  memberDetails: {
    marginTop: 10,
    gap: 8,
  },
  memberDetailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  memberDetailRow: {
    backgroundColor: "#15151B",
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#232333",
    flexGrow: 1,
    flexBasis: "48%",
    minWidth: 180,
  },
  memberDetailHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 4,
  },
  memberDetailTitle: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
    flex: 1,
  },
  memberDetailStatus: {
    fontSize: 12,
    fontWeight: "700",
  },
  memberDetailMeta: {
    color: "#9B9BA5",
    fontSize: 11,
    lineHeight: 16,
  },
  memberDetailEmpty: {
    color: "#888",
    fontSize: 12,
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
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modernActionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1C1C1E',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2C2C2E',
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
  groupHeaderCard: {
    backgroundColor: "#14142b",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  groupHeaderTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 12,
  },
  groupHeaderTitles: {
    flex: 1,
  },
  groupHeaderTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
  },
  groupHeaderSubtitle: {
    color: "#888",
    fontSize: 12,
    marginTop: 4,
  },
  groupHeaderManage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFD700",
    justifyContent: "center",
    alignItems: "center",
  },
  groupHeaderMeta: {
    flexDirection: "row",
    gap: 10,
    flexWrap: "wrap",
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
    padding: 16,
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
    gap: 10,
    marginTop: 12,
  },
  groupSummaryCounter: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
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
    fontSize: 20,
    fontWeight: "700",
  },
  groupSummaryLabel: {
    color: "#CCCCCC",
    fontSize: 12,
    marginTop: 4,
  },
  groupSummaryHint: {
    color: "#AAAAAA",
    fontSize: 12,
    marginTop: 12,
  },
  attentionCard: {
    backgroundColor: "#14142b",
    borderRadius: 16,
    padding: 16,
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






