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
import { Ionicons } from "@expo/vector-icons"
import { useAuth } from "../../hooks/useAuth"
import GroupService, { type Group, type GroupMember, type GroupAlert } from "../../services/firebase/GroupService"
import CoupleService, { type CoupleRelationship } from "../../services/firebase/CoupleService"
import GroupNotificationService from "../../services/notifications/GroupNotificationService"
import { useNotificationPreferences } from "../../hooks/useNotificationPreferences"

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
  const [inviteCode, setInviteCode] = useState("")
  
  // Estados para casais
  const [coupleRelationship, setCoupleRelationship] = useState<CoupleRelationship | null>(null)
  const [coupleLoading, setCoupleLoading] = useState(false)
  const [showCreateCoupleModal, setShowCreateCoupleModal] = useState(false)
  const [partnerEmail, setPartnerEmail] = useState("")
  const [relationshipType, setRelationshipType] = useState<CoupleRelationship['relationshipType']>("dating")
  
  // Estados para notificações de grupo
  const [showMessageModal, setShowMessageModal] = useState(false)
  const [groupMessage, setGroupMessage] = useState("")
  const [sendingNotification, setSendingNotification] = useState(false)

  useEffect(() => {
    if (user) {
      loadUserGroups()
      loadCoupleRelationship()
    }
  }, [user])

  useEffect(() => {
    if (selectedGroup) {
      loadGroupData()
    }
  }, [selectedGroup])

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
        GroupService.getGroupMembersWithStatus(selectedGroup.id),
        GroupService.getGroupAlerts(selectedGroup.id),
      ])

      setGroupMembers(members)
      setGroupAlerts(alerts)
    } catch (error) {
      console.error("Erro ao carregar dados do grupo:", error)
    }
  }
  
  // === FUNÇÕES DE CASAIS ===
  
  const loadCoupleRelationship = async () => {
    if (!user) return
    
    try {
      setCoupleLoading(true)
      const relationship = await CoupleService.getUserCoupleRelationship(user.uid)
      setCoupleRelationship(relationship)
      
      // Se existe relacionamento, atualizar compatibilidade se necessário
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
      // Por enquanto, vou simular com um ID fictício
      Alert.alert(
        'Funcionalidade em desenvolvimento',
        'Em breve você poderá convidar seu parceiro pelo email. Por enquanto, peça para ele/ela criar uma conta no app.'
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
      Alert.alert("Erro", "Nome do grupo é obrigatório")
      return
    }

    try {
      await GroupService.createGroup(newGroupName, newGroupDescription, user!.uid)
      setShowCreateModal(false)
      setNewGroupName("")
      setNewGroupDescription("")
      await loadUserGroups()
      Alert.alert("Sucesso", "Grupo criado com sucesso!")
    } catch (error: any) {
      Alert.alert("Erro", error.message)
    }
  }

  const joinGroup = async () => {
    if (!inviteCode.trim()) {
      Alert.alert("Erro", "Código de convite é obrigatório")
      return
    }

    try {
      await GroupService.joinGroupByCode(inviteCode.toUpperCase(), user!.uid)
      setShowJoinModal(false)
      setInviteCode("")
      await loadUserGroups()
      
      // Notificar grupo sobre novo membro
      if (selectedGroup) {
        await GroupNotificationService.sendMemberJoined(selectedGroup.id, user!.uid)
      }
      
      Alert.alert("Sucesso", "Você entrou no grupo!")
    } catch (error: any) {
      Alert.alert("Erro", error.message)
    }
  }
  
  // === FUNÇÕES DE NOTIFICAÇÕES ===
  
  const sendGroupMessage = async () => {
    if (!selectedGroup || !groupMessage.trim()) {
      Alert.alert("Erro", "Mensagem é obrigatória")
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
  
  const sendCriticalAlert = async () => {
    if (!selectedGroup) return

    Alert.alert(
      "Alerta Crítico",
      "Deseja enviar um alerta crítico para todos os membros do grupo?",
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
                "Alerta enviado pelo usuário. Verifique seu mapa astral!"
              )
              
              Alert.alert("Sucesso", "Alerta crítico enviado!")
              
            } catch (error: any) {
              console.error('Erro ao enviar alerta:', error)
              Alert.alert("Erro", "Não foi possível enviar o alerta")
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
      "Energia Favorável",
      "Deseja compartilhar uma energia favorável com o grupo?",
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
              
              Alert.alert("Sucesso", "Energia favorável compartilhada!")
              
            } catch (error: any) {
              console.error('Erro ao compartilhar energia:', error)
              Alert.alert("Erro", "Não foi possível compartilhar")
            } finally {
              setSendingNotification(false)
            }
          }
        }
      ]
    )
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
            {/* Ações de Notificação */}
            <View style={styles.notificationActionsSection}>
              <Text style={styles.sectionTitle}>📢 Ações do Grupo</Text>
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
            
            {/* Alertas Críticos */}
            {groupAlerts.filter((alert) => alert.status === "critical").length > 0 && (
              <View style={styles.criticalAlertsSection}>
                <Text style={styles.sectionTitle}>🚨 Alertas Críticos</Text>
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
                          {alert.createdAt.toLocaleTimeString("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </Text>
                      </View>
                    </View>
                  ))}
              </View>
            )}

            {/* Status dos Membros */}
            <View style={styles.membersSection}>
              <Text style={styles.sectionTitle}>Status dos Membros</Text>
              {(groupMembers || []).map((member) => (
                <View key={member.userId} style={styles.memberCard}>
                  <View style={styles.memberInfo}>
                    <Text style={styles.memberName}>{member.displayName}</Text>
                    <Text style={styles.memberEmail}>{member.email}</Text>
                  </View>

                  {member.astrologicalStatus && (
                    <View style={styles.memberStatus}>
                      <Ionicons
                        name={getStatusIcon(member.astrologicalStatus.overall) as any}
                        size={24}
                        color={getStatusColor(member.astrologicalStatus.overall)}
                      />
                      <View style={styles.statusDetails}>
                        <Text style={[styles.statusText, { color: getStatusColor(member.astrologicalStatus.overall) }]}>
                          {member.astrologicalStatus.overall.toUpperCase()}
                        </Text>
                        <Text style={styles.statusMood}>{member.astrologicalStatus.mood}</Text>
                        {member.astrologicalStatus.criticalTransits.length > 0 && (
                          <Text style={styles.statusTransits}>
                            {member.astrologicalStatus.criticalTransits.length} trânsito(s) crítico(s)
                          </Text>
                        )}
                      </View>
                    </View>
                  )}
                </View>
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
                      {alert.createdAt.toLocaleDateString("pt-BR")} às{" "}
                      {alert.createdAt.toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
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

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButtonCancel} onPress={() => setShowCreateModal(false)}>
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
              placeholder="Código de convite"
              placeholderTextColor="#888"
              value={inviteCode}
              onChangeText={setInviteCode}
              autoCapitalize="characters"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButtonCancel} onPress={() => setShowJoinModal(false)}>
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
            <Text style={styles.modalTitle}>📢 Enviar Mensagem para o Grupo</Text>
            
            <Text style={styles.modalSubtitle}>
              Todos os membros do grupo receberão uma notificação
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
    lineHeight: 20,
    marginBottom: 24,
  },
  createFirstGroupButton: {
    backgroundColor: "#FFD700",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
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
  
  // Estilos para ações de notificação
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
})
