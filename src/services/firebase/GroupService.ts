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
import { db } from "../../config/firebase"
import NotificationService from "./NotificationService"
import GroupNotificationService from "../notifications/GroupNotificationService"
import type { AstrologicalStatus } from "../prokerala/ProkeralaService"

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

      // Só adicionar inviteCode se for grupo privado
      if (isPrivate) {
        groupData.inviteCode = this.generateInviteCode()
      }

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

  // Entrar em grupo por código
  async joinGroupByCode(inviteCode: string, userId: string): Promise<boolean> {
    try {
      const q = query(collection(db, "groups"), where("inviteCode", "==", inviteCode))
      const querySnapshot = await getDocs(q)

      if (querySnapshot.empty) {
        throw new Error("Código de convite inválido")
      }

      const groupDoc = querySnapshot.docs[0]
      const groupData = groupDoc.data()

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

      await updateDoc(userStatusRef, {
        astrologicalStatus: status,
        lastStatusUpdate: Timestamp.now(),
        birthData,
      })

      // Se status crítico, criar alerta para grupos E enviar notificações
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

  // Criar alertas para grupos E enviar notificações push
  private async createGroupAlertsWithNotifications(userId: string, status: AstrologicalStatus): Promise<void> {
    try {
      const userGroups = await this.getUserGroups(userId)

      for (const group of userGroups) {
        const message = this.generateAlertMessage(status)

        // Criar alerta no Firestore
        await addDoc(collection(db, "groupAlerts"), {
          groupId: group.id,
          userId,
          userName: "Usuário", // Buscar nome real depois
          status: status.overall,
          message,
          createdAt: Timestamp.now(),
          isRead: false,
        })

        // Enviar notificações para outros membros do grupo
        await this.sendNotificationsToGroupMembers(group, userId, status, message)
      }
    } catch (error) {
      console.error("Erro ao criar alertas:", error)
    }
  }

  // Enviar notificações push para membros do grupo
  private async sendNotificationsToGroupMembers(
    group: Group,
    alertUserId: string,
    status: AstrologicalStatus,
    message: string,
  ): Promise<void> {
    try {
      // Enviar para todos os membros exceto quem gerou o alerta
      const otherMembers = group.members.filter((memberId) => memberId !== alertUserId)

      for (const memberId of otherMembers) {
        await NotificationService.sendNotificationToUser(memberId, {
          title: `🚨 Alerta no grupo ${group.name}`,
          body: message,
          data: {
            screen: "Groups",
            groupId: group.id,
            alertType: status.overall,
          },
        })
      }
    } catch (error) {
      console.error("Erro ao enviar notificações:", error)
    }
  }

  // Buscar membros do grupo com status
  async getGroupMembersWithStatus(groupId: string): Promise<GroupMember[]> {
    try {
      const groupDoc = await getDoc(doc(db, "groups", groupId))
      if (!groupDoc.exists()) return []

      const group = groupDoc.data() as Group
      const members: GroupMember[] = []

      for (const memberId of group.members) {
        const statusDoc = await getDoc(doc(db, "userStatus", memberId))
        const statusData = statusDoc.exists() ? statusDoc.data() : null

        members.push({
          userId: memberId,
          email: memberId.split("@")[0], // Buscar dados reais do usuário depois
          displayName: memberId.split("@")[0],
          joinedAt: new Date(),
          astrologicalStatus: statusData?.astrologicalStatus,
          lastStatusUpdate: statusData?.lastStatusUpdate?.toDate() || new Date(),
          birthData: statusData?.birthData,
        })
      }

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
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as GroupAlert[]
    } catch (error) {
      console.error("Erro ao buscar alertas:", error)
      return []
    }
  }

  // Escutar mudanças em tempo real
  subscribeToGroupAlerts(groupId: string, callback: (alerts: GroupAlert[]) => void) {
    const q = query(collection(db, "groupAlerts"), where("groupId", "==", groupId), orderBy("createdAt", "desc"))

    return onSnapshot(q, (querySnapshot) => {
      const alerts = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as GroupAlert[]

      callback(alerts)
    })
  }

  async getGroupByInviteCode(inviteCode: string): Promise<Group | null> {
    try {
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
      if (!settingsDoc.exists()) return null
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
      return null
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


