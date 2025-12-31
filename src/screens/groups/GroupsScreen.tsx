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
import GroupService, { type Group, type GroupMember, type GroupAlert } from "../../services/firebase/GroupService"
import CoupleService, { type CoupleRelationship } from "../../services/firebase/CoupleService"
import GroupNotificationService from "../../services/notifications/GroupNotificationService"
import { useNotificationPreferences } from "../../hooks/useNotificationPreferences"
import GroupCard from "../../components/GroupCard"
import GroupDetailModal from "../../components/GroupDetailModal"
import InviteService from "../../services/InviteService"

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

const formatLifeAreas = (areas?: string[]) => {
  if (!areas || areas.length === 0) return "Todas as areas"
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
        setInvitePreviewError("Nao foi possivel validar o codigo")
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
      const [members, alerts] = await Promise.all([
        GroupService.getGroupMembersWithStatus(selectedGroup.id, user?.uid),
        GroupService.getGroupAlerts(selectedGroup.id),
      ])

      setGroupMembers(members)
      setGroupAlerts(alerts)
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
        'Em breve voce podera convidar seu parceiro pelo email. Por enquanto, peca para ele/ela criar uma conta no app.'
      )
      
      setShowCreateCoupleModal(false)
      setPartnerEmail('')
    } catch (error) {
      console.error('Erro ao criar relacionamento:', error)
      Alert.alert('Erro', 'Nao foi possivel criar o relacionamento')
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
      Alert.alert('Erro', 'Nao foi possivel atualizar a compatibilidade')
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
      Alert.alert("Erro", "Nao foi possivel enviar a mensagem")
    } finally {
      setSendingNotification(false)
    }
  }
  
  const sendCriticalAlert = async () => {
    if (!selectedGroup) return

    Alert.alert(
      "Alerta Critico",
      "Deseja enviar um alerta critico para todos os membros do grupo?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Enviar",
          style: "destructive",
          onPress: async () => {
            try {
              setSendingNotification(true)
              
              await GroupNotificationService.sendCriticalAlert(
                selectedGroup.id,
                user!.uid,
                "Alerta enviado pelo usuario. Verifique seu mapa astral!"
              )
              
              Alert.alert("Sucesso", "Alerta critico enviado!")
              
            } catch (error: any) {
              console.error('Erro ao enviar alerta:', error)
              Alert.alert("Erro", "Nao foi possivel enviar o alerta")
            } finally {
              setSendingNotification(false)
            }
          }
        }
      ]
    )
  }
  
  const sendFavorableEvent = async () => {
    if (!selectedGroup) return

    Alert.alert(
      "Energia Favoravel",
      "Deseja compartilhar uma energia favoravel com o grupo?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Compartilhar",
          onPress: async () => {
            try {
              setSendingNotification(true)
              
              await GroupNotificationService.sendFavorableEvent(
                selectedGroup.id,
                user!.uid,
                "Energia positiva detectada! Aproveitem este momento!"
              )
              
              Alert.alert("Sucesso", "Energia favoravel compartilhada!")
              
            } catch (error: any) {
              console.error('Erro ao compartilhar energia:', error)
              Alert.alert("Erro", "Nao foi possivel compartilhar")
            } finally {
              setSendingNotification(false)
            }
          }
        }
      ]
    )
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
      Alert.alert("Erro", error?.message || "Nao foi possivel remover o membro")
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
      Alert.alert("Erro", error?.message || "Nao foi possivel sair do grupo")
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
            {/* Visao geral do grupo */}
            <View style={styles.groupFocusCard}>
              <View style={styles.groupFocusHeader}>
                <View>
                  <Text style={styles.groupFocusTitle}>{selectedGroup.name}</Text>
                  <Text style={styles.groupFocusSubtitle}>
                    {selectedGroup.description || "Grupo astrologico"}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.groupFocusManage}
                  onPress={() => {
                    setSelectedGroupForDetail(selectedGroup)
                    setShowGroupDetail(true)
                  }}
                >
                  <Ionicons name="options" size={18} color="#0a0e27" />
                  <Text style={styles.groupFocusManageText}>Gerenciar</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.groupFocusMeta}>
                <View style={styles.groupMetaChip}>
                  <Ionicons name="people" size={14} color="#FFD700" />
                  <Text style={styles.groupMetaText}>
                    {selectedGroup.members?.length || groupMembers.length} membros
                  </Text>
                </View>
                <View style={styles.groupMetaChip}>
                  <Ionicons name="share-social" size={14} color="#FFD700" />
                  <Text style={styles.groupMetaText}>
                    {formatLifeAreas(selectedGroup.sharedLifeAreas)}
                  </Text>
                </View>
                <View style={styles.groupMetaChip}>
                  <Ionicons name="notifications" size={14} color="#FFD700" />
                  <Text style={styles.groupMetaText}>
                    {formatLifeAreas(selectedGroup.notifiedLifeAreas)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Acoes de Notificacao */}
            <View style={styles.notificationActionsSection}>
              <Text style={styles.sectionTitle}>Acoes do Grupo</Text>
              <View style={styles.actionButtonsRow}>
                <TouchableOpacity 
                  style={[styles.actionButton, styles.messageButton]} 
                  onPress={() => setShowMessageModal(true)}
                  disabled={sendingNotification}
                >
                  <Ionicons name="chatbubble" size={20} color="#FFFFFF" />
                  <Text style={styles.actionButtonText}>Mensagem</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.actionButton, styles.alertButton]} 
                  onPress={sendCriticalAlert}
                  disabled={sendingNotification}
                >
                  <Ionicons name="warning" size={20} color="#FFFFFF" />
                  <Text style={styles.actionButtonText}>Alerta</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.actionButton, styles.favorableButton]} 
                  onPress={sendFavorableEvent}
                  disabled={sendingNotification}
                >
                  <Ionicons name="star" size={20} color="#FFFFFF" />
                  <Text style={styles.actionButtonText}>Energia+</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            {/* Alertas Criticos */}
            {groupAlerts.filter((alert) => alert.status === "critical").length > 0 && (
              <View style={styles.criticalAlertsSection}>
              <Text style={styles.sectionTitle}>Alertas Criticos</Text>
                {(groupAlerts || [])
                  .filter((alert) => alert.status === "critical")
                  .slice(0, 3)
                  .map((alert) => (
                    <View key={alert.id} style={styles.criticalAlert}>
                      <Ionicons name="warning" size={20} color="#FF4444" />
                      <View style={styles.alertContent}>
                        <Text style={styles.alertText}>
                          <Text style={styles.alertUser}>{alert.userName}</Text> {alert.message}
                        </Text>
                        <Text style={styles.alertTime}>
                          {alert.createdAt?.toLocaleTimeString("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          }) || "Agora"}
                        </Text>
                      </View>
                    </View>
                  ))}
              </View>
            )}

            {/* NOVA INTERFACE: Cards de Grupos Modernos */}
            <View style={styles.groupsCardsSection}>
              <Text style={styles.sectionTitle}>Membros do Grupo</Text>
              
              {/* Card do Grupo Atual */}
              <GroupCard
                group={selectedGroup}
                members={groupMembers}
                onPress={() => {
                  setSelectedGroupForDetail(selectedGroup)
                  setShowGroupDetail(true)
                }}
              />

              {/* Cards dos Membros */}
              {groupMembers.map((member) => (
                <GroupCard
                  key={member.userId}
                  group={{
                    id: member.userId,
                    name: member.displayName,
                    description: member.email,
                    createdAt: new Date(),
                    createdBy: member.userId,
                    members: [member.userId],
                    isPrivate: false
                  }}
                  members={[member]}
                  onPress={() => {
                    // Abrir modal de detalhes do membro
                    Alert.alert('Perfil do Membro', `Ver detalhes de ${member.displayName}`)
                  }}
                />
              ))}
            </View>

            {/* Feed de Alertas */}
            <View style={styles.alertsSection}>
              <Text style={styles.sectionTitle}>Feed de Alertas</Text>
              {(groupAlerts || []).slice(0, 10).map((alert) => (
                <View key={alert.id} style={styles.alertCard}>
                  <Ionicons name={getStatusIcon(alert.status) as any} size={20} color={getStatusColor(alert.status)} />
                  <View style={styles.alertContent}>
                    <Text style={styles.alertText}>
                      <Text style={styles.alertUser}>{alert.userName}</Text> {alert.message}
                    </Text>
                    <Text style={styles.alertTime}>
                      {alert.createdAt?.toLocaleDateString("pt-BR")} s{" "}
                      {alert.createdAt?.toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      }) || "Agora"}
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
            <Text style={styles.emptyStateTitle}>Nenhum grupo encontrado</Text>
            <Text style={styles.emptyStateText}>
              Crie seu primeiro grupo ou entre em um existente usando um cdigo de convite
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
              placeholder="Descricao (opcional)"
              placeholderTextColor="#888"
              value={newGroupDescription}
              onChangeText={setNewGroupDescription}
              multiline
              numberOfLines={3}
            />
            <Text style={styles.modalLabel}>Areas compartilhadas (padrao do grupo)</Text>
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

            <Text style={styles.modalLabel}>Areas notificadas (padrao do grupo)</Text>
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
                  Areas compartilhadas: {formatLifeAreas(invitePreview.sharedLifeAreas)}
                </Text>
                <Text style={styles.invitePreviewText}>
                  Areas notificadas: {formatLifeAreas(invitePreview.notifiedLifeAreas)}
                </Text>
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
        onMemberProfile={(member) => {
          // Acao de ver perfil do membro
          Alert.alert('Perfil', `Ver perfil de ${member.displayName}`)
        }}
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
    backgroundColor: "#FF4444",
  },
  favorableButton: {
    backgroundColor: "#28A745",
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
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
})

