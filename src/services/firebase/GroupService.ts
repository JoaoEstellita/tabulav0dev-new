import {
  collection,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  arrayUnion,
  Timestamp,
} from "firebase/firestore"
import { auth, db } from "../../config/firebase"
import GroupNotificationService from "../notifications/GroupNotificationService"
import type { AstrologicalStatus } from "../prokerala/ProkeralaService"

const BACKEND_URL = (process.env.EXPO_PUBLIC_BACKEND_URL || "").replace(/\/$/, "")

export interface Group {
  id: string
  name: string
  description: string
  createdBy: string
  members: string[]
  createdAt: Date
  isPrivate: boolean
  inviteCode?: string
  sharedLifeAreas?: string[]
  notifiedLifeAreas?: string[]
}

export interface GroupMember {
  userId: string
  email: string
  displayName: string
  profilePhoto?: string
  joinedAt: Date
  astrologicalStatus?: AstrologicalStatus
  lastStatusUpdate?: Date
  birthData?: {
    datetime: string
    coordinates: { latitude: number; longitude: number }
  }
}

export interface GroupAlert {
  id: string
  groupId: string
  userId: string
  userName: string
  status: AstrologicalStatus["overall"]
  message: string
  createdAt: Date
  isRead: boolean
}

export interface GroupMemberSettings {
  groupId: string
  userId: string
  sharedLifeAreas: string[]
  notifiedLifeAreas: string[]
  updatedAt: Date
}

class GroupService {
  private readonly LIFE_AREAS = [
    "amor",
    "carreira",
    "financas",
    "saude",
    "familia",
    "espiritualidade",
    "comunicacao",
    "transformacao",
  ]
  // Criar grupo
  async createGroup(
    name: string,
    description: string,
    createdBy: string,
    isPrivate = false,
    settings?: { sharedLifeAreas?: string[]; notifiedLifeAreas?: string[] }
  ): Promise<string> {
    try {
      const groupData: any = {
        name,
        description,
        createdBy,
        members: [createdBy],
        createdAt: Timestamp.now(),
        isPrivate,
        sharedLifeAreas: settings?.sharedLifeAreas || this.LIFE_AREAS,
        notifiedLifeAreas: settings?.notifiedLifeAreas || this.LIFE_AREAS,
      }
      // Gerar inviteCode para convites
      groupData.inviteCode = this.generateInviteCode()

      const docRef = await addDoc(collection(db, "groups"), groupData)

      await this.setMemberSettings(docRef.id, createdBy, {
        sharedLifeAreas: groupData.sharedLifeAreas,
        notifiedLifeAreas: groupData.notifiedLifeAreas,
      })

      return docRef.id
    } catch (error) {
      console.error("Erro ao criar grupo:", error)
      throw new Error("Não foi possível criar o grupo")
    }
  }

  // Buscar grupos do usuário
  async getUserGroups(userId: string): Promise<Group[]> {
    try {
      const q = query(
        collection(db, "groups"),
        where("members", "array-contains", userId),
        orderBy("createdAt", "desc"),
      )

      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Group[]
    } catch (error) {
      console.error("Erro ao buscar grupos:", error)
      return []
    }
  }

  // Garantir que o grupo tenha inviteCode
  async ensureInviteCode(groupId: string): Promise<string | null> {
    try {
      const groupRef = doc(db, "groups", groupId)
      const groupDoc = await getDoc(groupRef)
      if (!groupDoc.exists()) return null

      const data = groupDoc.data() as Group
      if (data.inviteCode) return data.inviteCode

      const inviteCode = this.generateInviteCode()
      await updateDoc(groupRef, { inviteCode })
      return inviteCode
    } catch (error) {
      console.error("Erro ao garantir inviteCode:", error)
      return null
    }
  }

  // Entrar em grupo por código
  async joinGroupByCode(inviteCode: string, userId: string): Promise<boolean> {
    try {
      if (BACKEND_URL) {
        try {
          const token = await auth.currentUser?.getIdToken()
          const response = await fetch(`${BACKEND_URL}/api/group/join`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({ inviteCode, userId }),
          })

          if (response.ok) {
            const payload = await response.json()
            if (payload?.ok) return true
          } else {
            const payload = await response.json().catch(() => ({}))
            throw new Error(payload?.error || "Nao foi possivel entrar no grupo")
          }
        } catch (error) {
          console.warn("Join via backend falhou, tentando direto:", error)
        }
      }

      const q = query(collection(db, "groups"), where("inviteCode", "==", inviteCode))
      const querySnapshot = await getDocs(q)

      if (querySnapshot.empty) {
        throw new Error("Código de convite inválido")
      }

      const groupDoc = querySnapshot.docs[0]
      const groupData = groupDoc.data() as Group

      if (groupData.members.includes(userId)) {
        throw new Error("Você já é membro deste grupo")
      }

      await updateDoc(doc(db, "groups", groupDoc.id), {
        members: arrayUnion(userId),
      })

      const sharedLifeAreas = groupData.sharedLifeAreas || this.LIFE_AREAS
      const notifiedLifeAreas = groupData.notifiedLifeAreas || this.LIFE_AREAS
      await this.setMemberSettings(groupDoc.id, userId, { sharedLifeAreas, notifiedLifeAreas })

      return true
    } catch (error) {
      console.error("Erro ao entrar no grupo:", error)
      throw error
    }
  }

  // Atualizar status astrológico do usuário
  async updateUserStatus(userId: string, status: AstrologicalStatus, birthData?: any): Promise<void> {
    try {
      const userStatusRef = doc(db, "userStatus", userId)

      await setDoc(userStatusRef, {
        astrologicalStatus: status,
        lastStatusUpdate: Timestamp.now(),
        birthData,
      }, { merge: true })

      // Se status crítico, criar alerta para grupos e enviar notificações
      if (status.overall === "critical" || status.overall === "challenging") {
        await this.createGroupAlertsWithNotifications(userId, status)
      }

      // Se status favorável, enviar notificação positiva
      if (status.overall === "excellent" || status.overall === "positive") {
        await this.createFavorableGroupNotifications(userId, status)
      }
    } catch (error) {
      console.error("Erro ao atualizar status:", error)
    }
  }

  // Criar alertas para grupos e enviar notificações push
  private async createGroupAlertsWithNotifications(userId: string, status: AstrologicalStatus): Promise<void> {
    try {
      const userGroups = await this.getUserGroups(userId)
      const userDoc = await getDoc(doc(db, "users", userId))
      const userData = userDoc.exists() ? userDoc.data() : {}
      const userName = userData.displayName || userData.fullName || userData.name || "Usuario"

      for (const group of userGroups) {
        const message = this.generateAlertMessage(status)

        // Criar alerta no Firestore
        await addDoc(collection(db, "groupAlerts"), {
          groupId: group.id,
          userId,
          userName,
          status: status.overall,
          message,
          createdAt: Timestamp.now(),
          isRead: false,
        })

        // Enviar notificacoes push para membros do grupo
        await this.sendNotificationsToGroupMembers(group, userId, status, message, userName)
      }
    } catch (error) {
      console.error("Erro ao criar alertas:", error)
    }
  }

  // Enviar notificacoes push para membros do grupo
  private async sendNotificationsToGroupMembers(
    group: Group,
    alertUserId: string,
    status: AstrologicalStatus,
    message: string,
    senderName: string,
  ): Promise<void> {
    try {
      await GroupNotificationService.sendGroupNotification({
        groupId: group.id,
        senderId: alertUserId,
        notificationType:
          status.overall === "critical" || status.overall === "challenging"
            ? "critical_alert"
            : "favorable_event",
        customMessage: message,
        eventData: { area: "energia_geral", status: status.overall, senderName },
      })
    } catch (error) {
      console.error("Erro ao enviar notificacoes:", error)
    }
  }

  // Buscar membros do grupo com status (apenas do próprio usuário)
  async getGroupMembersWithStatus(groupId: string, viewerId?: string): Promise<GroupMember[]> {
    try {
      const groupDoc = await getDoc(doc(db, "groups", groupId))
      if (!groupDoc.exists()) return []

      const group = groupDoc.data() as Group
      const members = await Promise.all(
        (group.members || []).map(async (memberId) => {
          const shouldLoadStatus = viewerId && viewerId === memberId
          const [publicDoc, statusDoc] = await Promise.all([
            getDoc(doc(db, "userPublicProfiles", memberId)),
            shouldLoadStatus ? getDoc(doc(db, "userStatus", memberId)) : Promise.resolve(null),
          ])

          const publicData = publicDoc.exists() ? publicDoc.data() : {}
          const statusData = statusDoc && statusDoc.exists && statusDoc.exists() ? statusDoc.data() : null
          const displayName = publicData.displayName || publicData.fullName || memberId.split("@")[0] || memberId
          const email = publicData.email || memberId

          return {
            userId: memberId,
            email,
            displayName,
            profilePhoto: publicData.profilePhoto,
            joinedAt: new Date(),
            astrologicalStatus: statusData?.astrologicalStatus,
            lastStatusUpdate: statusData?.lastStatusUpdate?.toDate?.() || undefined,
            birthData: statusData?.birthData,
          } as GroupMember
        })
      )

      return members
    } catch (error) {
      console.error("Erro ao buscar membros:", error)
      return []
    }
  }

  // Buscar alertas do grupo
  async getGroupAlerts(groupId: string): Promise<GroupAlert[]> {
    try {
      const q = query(collection(db, "groupAlerts"), where("groupId", "==", groupId), orderBy("createdAt", "desc"))

      const querySnapshot = await getDocs(q)
      const alerts = querySnapshot.docs.map((doc) => {
        const data = doc.data() || {}
        const createdAt = data.createdAt?.toDate?.() || data.createdAt || new Date()
        const status =
          data.status ||
          (data.type === "critical_alert"
            ? "critical"
            : data.type === "favorable_event" || data.type === "daily_group_energy"
            ? "positive"
            : "neutral")
        const message = data.message || data.body || ""
        const userName = data.userName || data.senderName || "Usuario"
        const userId = data.userId || data.senderId || ""
        return {
          id: doc.id,
          ...data,
          userId,
          userName,
          status,
          message,
          isRead: data.isRead ?? false,
          createdAt,
        }
      }) as GroupAlert[]
      return alerts
    } catch (error) {
      console.error("Erro ao buscar alertas:", error)
      return []
    }
  }
  // Escutar mudanças em tempo real
  subscribeToGroupAlerts(groupId: string, callback: (alerts: GroupAlert[]) => void) {
    const q = query(collection(db, "groupAlerts"), where("groupId", "==", groupId), orderBy("createdAt", "desc"))

    return onSnapshot(q, (querySnapshot) => {
      const alerts = querySnapshot.docs.map((doc) => {
        const data = doc.data() || {}
        const createdAt = data.createdAt?.toDate?.() || data.createdAt || new Date()
        const status =
          data.status ||
          (data.type === "critical_alert"
            ? "critical"
            : data.type === "favorable_event" || data.type === "daily_group_energy"
            ? "positive"
            : "neutral")
        const message = data.message || data.body || ""
        const userName = data.userName || data.senderName || "Usuario"
        const userId = data.userId || data.senderId || ""
        return {
          id: doc.id,
          ...data,
          userId,
          userName,
          status,
          message,
          isRead: data.isRead ?? false,
          createdAt,
        }
      }) as GroupAlert[]

      callback(alerts)
    })
  }

  async getGroupByInviteCode(inviteCode: string): Promise<Group | null> {
    try {
      if (BACKEND_URL) {
        try {
          const response = await fetch(`${BACKEND_URL}/api/group/invite`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ inviteCode }),
          })

          if (response.ok) {
            const payload = await response.json()
            if (payload?.group) {
              return {
                id: payload.group.id,
                name: payload.group.name,
                description: payload.group.description || "",
                createdBy: payload.group.createdBy || "",
                members: payload.group.members || [],
                createdAt: payload.group.createdAt ? new Date(payload.group.createdAt) : new Date(),
                isPrivate: !!payload.group.isPrivate,
                inviteCode: payload.group.inviteCode,
                sharedLifeAreas: payload.group.sharedLifeAreas || [],
                notifiedLifeAreas: payload.group.notifiedLifeAreas || [],
              }
            }
          }
        } catch (error) {
          console.warn("Invite via backend falhou, tentando direto:", error)
        }
      }

      const q = query(collection(db, "groups"), where("inviteCode", "==", inviteCode))
      const querySnapshot = await getDocs(q)
      if (querySnapshot.empty) return null
      const docSnap = querySnapshot.docs[0]
      return {
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt?.toDate() || new Date(),
      } as Group
    } catch (error) {
      console.error("Erro ao buscar grupo por convite:", error)
      return null
    }
  }

  async getMemberSettings(groupId: string, userId: string): Promise<GroupMemberSettings | null> {
    try {
      const settingsDoc = await getDoc(doc(db, "groupMemberSettings", `${groupId}_${userId}`))
      if (!settingsDoc.exists()) {
        const defaults = {
          sharedLifeAreas: this.LIFE_AREAS,
          notifiedLifeAreas: this.LIFE_AREAS,
        }
        try {
          await this.setMemberSettings(groupId, userId, defaults)
        } catch (error) {
          console.warn("Nao foi possivel criar settings padrao:", error)
        }
        return {
          groupId,
          userId,
          sharedLifeAreas: defaults.sharedLifeAreas,
          notifiedLifeAreas: defaults.notifiedLifeAreas,
          updatedAt: new Date(),
        } as GroupMemberSettings
      }
      const data = settingsDoc.data()
      return {
        groupId,
        userId,
        sharedLifeAreas: data.sharedLifeAreas || this.LIFE_AREAS,
        notifiedLifeAreas: data.notifiedLifeAreas || this.LIFE_AREAS,
        updatedAt: data.updatedAt?.toDate?.() || new Date(),
      } as GroupMemberSettings
    } catch (error) {
      console.error("Erro ao buscar settings do membro:", error)
      const defaults = {
        sharedLifeAreas: this.LIFE_AREAS,
        notifiedLifeAreas: this.LIFE_AREAS,
      }
      try {
        await this.setMemberSettings(groupId, userId, defaults)
      } catch (createError) {
        console.warn("Nao foi possivel criar settings padrao:", createError)
      }
      return {
        groupId,
        userId,
        sharedLifeAreas: defaults.sharedLifeAreas,
        notifiedLifeAreas: defaults.notifiedLifeAreas,
        updatedAt: new Date(),
      } as GroupMemberSettings
    }
  }

  async setMemberSettings(
    groupId: string,
    userId: string,
    settings: { sharedLifeAreas: string[]; notifiedLifeAreas: string[] }
  ): Promise<void> {
    await setDoc(doc(db, "groupMemberSettings", `${groupId}_${userId}`), {
      groupId,
      userId,
      sharedLifeAreas: settings.sharedLifeAreas || this.LIFE_AREAS,
      notifiedLifeAreas: settings.notifiedLifeAreas || this.LIFE_AREAS,
      updatedAt: Timestamp.now(),
    })
  }

  private generateInviteCode(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase()
  }

  private generateAlertMessage(status: AstrologicalStatus): string {
    const messages = {
      critical: [
        "está passando por um momento astrológico intenso e pode precisar de apoio",
        "tem trânsitos desafiadores hoje - que tal enviar uma mensagem carinhosa?",
        "está enfrentando energias difíceis - sua presença pode fazer a diferença",
      ],
      challenging: [
        "tem alguns desafios astrológicos hoje - considere oferecer apoio",
        "pode estar se sentindo mais sensível devido aos trânsitos atuais",
        "está navegando por águas astrológicas agitadas - sua amizade é importante",
      ],
    }

    const statusMessages = messages[status.overall as keyof typeof messages] || messages.challenging
    return statusMessages[Math.floor(Math.random() * statusMessages.length)]
  }
  
  // Criar notificações favoráveis para grupos
  private async createFavorableGroupNotifications(userId: string, status: AstrologicalStatus): Promise<void> {
    try {
      const userGroups = await this.getUserGroups(userId)
      
      // Buscar dados do usuário
      const userDoc = await getDoc(doc(db, 'users', userId))
      if (!userDoc.exists()) return
      
      const userData = userDoc.data()
      const userName = userData.displayName || 'Um membro'
      
      for (const group of userGroups) {
        const favorableMessage = this.generateFavorableMessage(status, userName)
        
        // Enviar notificação favorável via backend
        try {
          await GroupNotificationService.sendAutomaticFavorableAlert(group.id, {
            area: 'energia_geral',
            percentage: 85, // Simular alta energia
            description: favorableMessage
          })
          
          console.log(`✨ Notificação favorável enviada para grupo ${group.name}`)
        } catch (notificationError) {
          console.error('Erro ao enviar notificação favorável:', notificationError)
        }
      }
    } catch (error) {
      console.error('Erro ao criar notificações favoráveis:', error)
    }
  }
  
  // Gerar mensagem favorável
  private generateFavorableMessage(status: AstrologicalStatus, userName: string): string {
    const favorableMessages = {
      excellent: [
        `${userName} está com energias incríveis hoje! ✨`,
        `${userName} tem trânsitos muito favoráveis - é um ótimo momento!`,
        `${userName} está radiante astrologicamente - aproveitem essa energia!`,
      ],
      positive: [
        `${userName} tem boas energias hoje - momento favorável para projetos!`,
        `${userName} está com trânsitos positivos - é hora de agir!`,
        `${userName} tem o cosmos a seu favor hoje! 🌟`,
      ],
    }
    
    const statusMessages = favorableMessages[status.overall as keyof typeof favorableMessages] || favorableMessages.positive
    return statusMessages[Math.floor(Math.random() * statusMessages.length)]
  }
}

export default new GroupService()


