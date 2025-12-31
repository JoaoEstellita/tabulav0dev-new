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


