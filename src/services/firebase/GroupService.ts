import {
  collection,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  getDocs,
  getDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  arrayUnion,
  arrayRemove,
  Timestamp,
  runTransaction,
} from "firebase/firestore"
import { db } from "../../config/firebase"
import GroupNotificationService from "../notifications/GroupNotificationService"
import type { LocalTransitData } from "../astrology/LocalAstrologyService"
import type { AstrologicalStatus } from "../prokerala/ProkeralaService"
import { backendFetch } from "../backend/client"

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
  inviteEnabled?: boolean
  inviteExpiresAt?: Date | null
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
  sharedLifeAreas?: string[]
  notifiedLifeAreas?: string[]
  shareEnabled?: boolean
  shareStatus?: boolean
  lifeAreas?: Record<string, { percentage: number; status: string; influences?: string[]; mainPlanets?: string[] }>
  areaTransits?: Record<string, Array<{
    transitPlanet: string
    natalPlanet: string
    type: string
    orb: number
    isApplying: boolean
    strength: number
    durationClass?: 'curto' | 'medio' | 'longo'
    window?: { start?: string; exact?: string; end?: string; days?: number }
    windowDays?: number
  }>>
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
  type?: string
  area?: string | null
  percentage?: number | null
}

export interface GroupMemberSettings {
  groupId: string
  userId: string
  sharedLifeAreas: string[]
  notifiedLifeAreas: string[]
  shareStatus?: boolean
  cooldownMinutes?: number
  lastAlertByArea?: Record<string, any>
  enabled?: boolean
  types?: {
    criticalAlerts?: boolean
    favorableEvents?: boolean
    memberUpdates?: boolean
    groupMessages?: boolean
  } | null
  schedule?: {
    doNotDisturb?: boolean
    startTime?: string
    endTime?: string
  } | null
  priority?: 'all' | 'critical_only' | 'none' | null
  customAlertMessages?: Record<string, string> | null
  updatedAt: Date
}

export interface GroupActivity {
  id: string
  groupId: string
  type: string
  actorId?: string
  targetId?: string
  message?: string
  area?: string | null
  createdAt: Date
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

  private filterLifeAreas(
    lifeAreas: Record<string, { percentage?: number; status?: string; influences?: string[]; mainPlanets?: string[] }> | undefined,
    allowedAreas: string[] | undefined
  ) {
    if (!lifeAreas) return {}
    const allowed = new Set(allowedAreas && allowedAreas.length ? allowedAreas : this.LIFE_AREAS)
    return Object.entries(lifeAreas).reduce((acc, [key, value]) => {
      if (allowed.has(key)) acc[key] = value
      return acc
    }, {} as Record<string, { percentage?: number; status?: string; influences?: string[]; mainPlanets?: string[] }>)
  }
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
        inviteEnabled: true,
        inviteExpiresAt: null,
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
      throw new Error("Nao foi possivel criar o grupo")
    }
  }

  // Buscar grupos do usuario
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

  // Entrar em grupo por codigo
  async joinGroupByCode(inviteCode: string, userId: string): Promise<boolean> {
    try {
      if (BACKEND_URL) {
        try {
          const response = await backendFetch('/api/group/join', {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            auth: true,
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
        throw new Error("Codigo de convite invalido")
      }

      const groupDoc = querySnapshot.docs[0]
      const groupData = groupDoc.data() as Group

      if (groupData.inviteEnabled === false) {
        throw new Error("Convite desativado")
      }
      if (groupData.inviteExpiresAt && (groupData.inviteExpiresAt as any).toDate) {
        const expiresAt = (groupData.inviteExpiresAt as any).toDate()
        if (expiresAt.getTime() < Date.now()) {
          throw new Error("Convite expirado")
        }
      }

      if (groupData.members.includes(userId)) {
        throw new Error("Voce ja e membro deste grupo")
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

  // Atualizar status astrologico do usuario
  async updateUserStatus(userId: string, status: AstrologicalStatus, birthData?: any): Promise<void> {
    try {
      // Security hardening:
      // userStatus is backend-owned and no longer writable by client rules.
      // Keep only group-side notifications in client flow.
      void birthData

      // Se status critico, criar alerta para grupos e enviar notificacoes
      if (status.overall === "critical" || status.overall === "challenging") {
        await this.createGroupAlertsWithNotifications(userId, status)
      }

      // Se status favoravel, enviar notificacao positiva
      if (status.overall === "excellent" || status.overall === "positive") {
        await this.createFavorableGroupNotifications(userId, status)
      }
    } catch (error) {
      console.error("Erro ao atualizar status:", error)
    }
  }

  // Atualizar status a partir das reas da vida (engine local)
  async updateUserStatusFromLifeAreas(
    userId: string,
    transitData: LocalTransitData,
    birthData?: any,
    lifeAreasSignature?: string
  ): Promise<void> {
    try {
      // Security hardening:
      // client no longer writes userStatus; keep only memberStatus sync for groups.
      void birthData
      void lifeAreasSignature
      await this.updateGroupMemberStatus(userId, transitData)
    } catch (error) {
      console.error("Erro ao atualizar status por areas:", error)
    }
  }

  private async updateGroupMemberStatus(userId: string, transitData: LocalTransitData): Promise<void> {
    try {
      const userGroups = await this.getUserGroups(userId)
      if (!userGroups.length) return

      await Promise.all(
        userGroups.map(async (group) => {
          const settings = await this.getMemberSettings(group.id, userId)
          if (settings?.enabled === false || settings?.shareStatus === false) {
            await setDoc(
              doc(db, "groups", group.id, "memberStatus", userId),
              {
                userId,
                lifeAreas: {},
                sharedLifeAreas: settings?.sharedLifeAreas || group.sharedLifeAreas || this.LIFE_AREAS,
                lastStatusUpdate: Timestamp.now(),
              },
              { merge: true }
            )
            return
          }

          const sharedLifeAreas = settings?.sharedLifeAreas || group.sharedLifeAreas || this.LIFE_AREAS
          const filteredLifeAreas = this.filterLifeAreas(transitData.lifeAreas as any, sharedLifeAreas)

          await setDoc(
            doc(db, "groups", group.id, "memberStatus", userId),
            {
              userId,
              lifeAreas: filteredLifeAreas,
              sharedLifeAreas,
              lastStatusUpdate: Timestamp.now(),
            },
            { merge: true }
          )
        })
      )
    } catch (error) {
      console.warn("Erro ao atualizar status do membro no grupo:", error)
    }
  }

  // Criar alertas para grupos e enviar notificacoes push
  private async createGroupAlertsWithNotifications(userId: string, status: AstrologicalStatus): Promise<void> {
    try {
      const userGroups = await this.getUserGroups(userId)
      const userDoc = await getDoc(doc(db, "users", userId))
      const userData = userDoc.exists() ? userDoc.data() : {}
      const userName = userData.displayName || userData.fullName || userData.name || "Usuario"

      for (const group of userGroups) {
        const message = this.generateAlertMessage(status)
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

  // Buscar membros do grupo com status (apenas do proprio usuario)
  async getGroupMembersWithStatus(groupId: string, viewerId?: string): Promise<GroupMember[]> {
    try {
      if (BACKEND_URL) {
        try {
          const response = await backendFetch('/api/group/status', {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            auth: true,
            body: JSON.stringify({ groupId }),
          })

          if (response.ok) {
            const payload = await response.json()
            if (payload?.ok && Array.isArray(payload.members)) {
              return payload.members.map((member: any) => {
                const lifeAreas = member.lifeAreas || member.astrologicalStatus?.lifeAreas || undefined
                return {
                  userId: member.userId,
                  email: member.email || member.userId,
                  displayName: member.displayName || member.userId,
                  profilePhoto: member.profilePhoto || undefined,
                  joinedAt: new Date(),
                  astrologicalStatus: member.astrologicalStatus || undefined,
                  lastStatusUpdate: member.lastStatusUpdate ? new Date(member.lastStatusUpdate) : undefined,
                  sharedLifeAreas: member.sharedLifeAreas,
                  lifeAreas,
                  areaTransits: member.areaTransits || undefined,
                }
              }) as GroupMember[]
            }
          }
        } catch (error) {
          console.warn("Status via backend falhou, tentando direto:", error)
        }
      }

      const groupDoc = await getDoc(doc(db, "groups", groupId))
      if (!groupDoc.exists()) return []

      const group = groupDoc.data() as Group
      const members = await Promise.all(
        (group.members || []).map(async (memberId) => {
          const [publicDoc, memberStatusDoc] = await Promise.all([
            getDoc(doc(db, "userPublicProfiles", memberId)),
            getDoc(doc(db, "groups", groupId, "memberStatus", memberId)),
          ])
          const publicData = publicDoc.exists() ? publicDoc.data() : {}
          const memberStatus = memberStatusDoc.exists() ? memberStatusDoc.data() : {}
          const shouldLoadStatus = memberId === viewerId
          const statusDoc = shouldLoadStatus ? await getDoc(doc(db, "userStatus", memberId)) : null
          const statusData = statusDoc && statusDoc.exists && statusDoc.exists() ? statusDoc.data() : null
          const displayName = publicData.displayName || publicData.fullName || memberId.split("@")[0] || memberId
          const email = publicData.email || memberId
          const lifeAreas = memberStatus?.lifeAreas || statusData?.lifeAreas

          return {
            userId: memberId,
            email,
            displayName,
            profilePhoto: publicData.profilePhoto,
            joinedAt: new Date(),
            astrologicalStatus: statusData?.astrologicalStatus,
            lastStatusUpdate: memberStatus?.lastStatusUpdate?.toDate?.() || statusData?.lastStatusUpdate?.toDate?.() || undefined,
            sharedLifeAreas: memberStatus?.sharedLifeAreas || group.sharedLifeAreas || this.LIFE_AREAS,
            lifeAreas,
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
          type: data.type,
          area: data.area || data.lifeArea || data.life_area || null,
          percentage: typeof data.percentage === "number" ? data.percentage : null,
        }
      }) as GroupAlert[]
      return alerts
    } catch (error) {
      console.error("Erro ao buscar alertas:", error)
      return []
    }
  }
  // Escutar mudanas em tempo real
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
          type: data.type,
          area: data.area || data.lifeArea || data.life_area || null,
          percentage: typeof data.percentage === "number" ? data.percentage : null,
        }
      }) as GroupAlert[]

      callback(alerts)
    })
  }

  async getGroupByInviteCode(inviteCode: string): Promise<Group | null> {
    try {
      if (BACKEND_URL) {
        try {
          const response = await backendFetch('/api/group/invite', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            auth: false,
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
                inviteEnabled: payload.group.inviteEnabled !== false,
                inviteExpiresAt: payload.group.inviteExpiresAt ? new Date(payload.group.inviteExpiresAt) : null,
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
      const data = docSnap.data() as any
      const inviteExpiresAt = data.inviteExpiresAt?.toDate?.() || null
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || new Date(),
        inviteEnabled: data.inviteEnabled !== false,
        inviteExpiresAt,
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
          enabled: true,
          types: null,
          schedule: null,
          priority: null,
          customAlertMessages: {},
          updatedAt: new Date(),
        } as GroupMemberSettings
      }
      const data = settingsDoc.data()
      return {
        groupId,
        userId,
        sharedLifeAreas: data.sharedLifeAreas || this.LIFE_AREAS,
        notifiedLifeAreas: data.notifiedLifeAreas || this.LIFE_AREAS,
        shareStatus: data.shareStatus ?? true,
        cooldownMinutes: data.cooldownMinutes || 0,
        lastAlertByArea: data.lastAlertByArea || {},
        enabled: data.enabled ?? true,
        types: data.types || null,
        schedule: data.schedule || null,
        priority: data.priority || null,
        customAlertMessages: data.customAlertMessages || {},
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
        shareStatus: true,
        cooldownMinutes: 0,
        lastAlertByArea: {},
        enabled: true,
        types: null,
        schedule: null,
        priority: null,
        customAlertMessages: {},
        updatedAt: new Date(),
      } as GroupMemberSettings
    }
  }

  async getGroupActivities(groupId: string): Promise<GroupActivity[]> {
    try {
      const q = query(
        collection(db, "groupActivities"),
        where("groupId", "==", groupId),
        orderBy("createdAt", "desc")
      )
      const snapshot = await getDocs(q)
      return snapshot.docs.map((docSnap) => {
        const data = docSnap.data() || {}
        const createdAt = data.createdAt?.toDate?.() || data.createdAt || new Date()
        return {
          id: docSnap.id,
          groupId,
          type: data.type || "event",
          actorId: data.actorId,
          targetId: data.targetId,
          message: data.message,
          area: data.area || null,
          createdAt,
        }
      })
    } catch (error) {
      console.error("Erro ao buscar atividades do grupo:", error)
      return []
    }
  }

  async setMemberSettings(
    groupId: string,
    userId: string,
    settings: {
      sharedLifeAreas: string[]
      notifiedLifeAreas: string[]
      shareStatus?: boolean
      cooldownMinutes?: number
      enabled?: boolean
      types?: GroupMemberSettings['types']
      schedule?: GroupMemberSettings['schedule']
      priority?: GroupMemberSettings['priority']
      customAlertMessages?: Record<string, string>
    }
  ): Promise<void> {
    await setDoc(doc(db, "groupMemberSettings", `${groupId}_${userId}`), {
      groupId,
      userId,
      sharedLifeAreas: settings.sharedLifeAreas || this.LIFE_AREAS,
      notifiedLifeAreas: settings.notifiedLifeAreas || this.LIFE_AREAS,
      shareStatus: settings.shareStatus ?? true,
      cooldownMinutes: settings.cooldownMinutes ?? 0,
      enabled: settings.enabled ?? true,
      types: settings.types || null,
      schedule: settings.schedule || null,
      priority: settings.priority || null,
      customAlertMessages: settings.customAlertMessages || null,
      updatedAt: Timestamp.now(),
    })
  }

  async updateInviteSettings(
    groupId: string,
    requesterId: string,
    settings: { inviteEnabled?: boolean; inviteExpiresAt?: Date | null; rotate?: boolean }
  ): Promise<Group> {
    if (!groupId || !requesterId) throw new Error("Dados incompletos")

    if (BACKEND_URL) {
      const response = await backendFetch('/api/group/invite-settings', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        auth: true,
        body: JSON.stringify({
          groupId,
          inviteEnabled: settings.inviteEnabled,
          inviteExpiresAt: settings.inviteExpiresAt ? settings.inviteExpiresAt.toISOString() : null,
          rotate: settings.rotate === true,
        }),
      })
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        throw new Error(payload?.error || "Nao foi possivel atualizar convite")
      }
      const payload = await response.json()
      return {
        id: groupId,
        name: "",
        description: "",
        createdBy: requesterId,
        members: [],
        createdAt: new Date(),
        isPrivate: false,
        inviteCode: payload?.group?.inviteCode,
        inviteEnabled: payload?.group?.inviteEnabled !== false,
        inviteExpiresAt: payload?.group?.inviteExpiresAt ? new Date(payload.group.inviteExpiresAt) : null,
      }
    }

    const groupRef = doc(db, "groups", groupId)
    const groupDoc = await getDoc(groupRef)
    if (!groupDoc.exists()) throw new Error("Grupo nao encontrado")
    const groupData = groupDoc.data() as Group
    if (groupData.createdBy !== requesterId) throw new Error("Sem permissao")

    const updates: any = {}
    if (typeof settings.inviteEnabled === "boolean") updates.inviteEnabled = settings.inviteEnabled
    if (settings.inviteExpiresAt === null) updates.inviteExpiresAt = null
    if (settings.inviteExpiresAt) updates.inviteExpiresAt = Timestamp.fromDate(settings.inviteExpiresAt)
    if (settings.rotate) updates.inviteCode = this.generateInviteCode()
    if (Object.keys(updates).length) await updateDoc(groupRef, updates)

    const refreshed = await getDoc(groupRef)
    const refreshedData = refreshed.data() as any
    return {
      ...refreshedData,
      id: groupId,
      createdAt: refreshedData?.createdAt?.toDate ? refreshedData.createdAt.toDate() : (refreshedData?.createdAt || new Date()),
      inviteExpiresAt: refreshedData?.inviteExpiresAt?.toDate ? refreshedData.inviteExpiresAt.toDate() : (refreshedData?.inviteExpiresAt || null),
    } as Group
  }

  async removeMember(groupId: string, memberId: string, requesterId: string): Promise<void> {
    if (!groupId || !memberId || !requesterId) return

    if (BACKEND_URL) {
      try {
        const response = await backendFetch('/api/group/remove-member', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          auth: true,
          body: JSON.stringify({ groupId, memberId }),
        })
        if (!response.ok) {
          const payload = await response.json().catch(() => ({}))
          throw new Error(payload?.error || "Nao foi possivel remover o membro")
        }
        return
      } catch (error) {
        console.warn("Remove member via backend falhou, tentando direto:", error)
      }
    }

    const groupRef = doc(db, "groups", groupId)
    const groupDoc = await getDoc(groupRef)
    if (!groupDoc.exists()) throw new Error("Grupo nao encontrado")
    const groupData = groupDoc.data() as Group
    if (groupData.createdBy !== requesterId) throw new Error("Sem permissao")
    if (memberId === groupData.createdBy) throw new Error("Nao e possivel remover o administrador")

    await updateDoc(groupRef, { members: arrayRemove(memberId) })
    await deleteDoc(doc(db, "groupMemberSettings", `${groupId}_${memberId}`))
  }

  async leaveGroup(groupId: string, userId: string): Promise<void> {
    if (!groupId || !userId) return

    if (BACKEND_URL) {
      try {
        const response = await backendFetch('/api/group/leave', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          auth: true,
          body: JSON.stringify({ groupId }),
        })
        if (!response.ok) {
          const payload = await response.json().catch(() => ({}))
          throw new Error(payload?.error || "Nao foi possivel sair do grupo")
        }
        return
      } catch (error) {
        console.warn("Leave via backend falhou, tentando direto:", error)
      }
    }

    const groupRef = doc(db, "groups", groupId)
    const groupDoc = await getDoc(groupRef)
    if (!groupDoc.exists()) throw new Error("Grupo nao encontrado")
    const groupData = groupDoc.data() as Group
    const members = Array.isArray(groupData.members) ? groupData.members : []
    if (!members.includes(userId)) return

    const remaining = members.filter((member) => member !== userId)
    if (remaining.length === 0) {
      await deleteDoc(groupRef)
    } else {
      const updates: Partial<Group> = { members: remaining }
      if (groupData.createdBy === userId) {
        updates.createdBy = remaining[0]
      }
      await updateDoc(groupRef, updates)
    }

    await deleteDoc(doc(db, "groupMemberSettings", `${groupId}_${userId}`))
  }

  private generateInviteCode(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase()
  }

  private generateAlertMessage(status: AstrologicalStatus): string {
    const messages = {
      critical: [
        "esta passando por um momento astrologico intenso e pode precisar de apoio",
        "tem transitos desafiadores hoje - que tal enviar uma mensagem carinhosa?",
        "esta enfrentando energias dificeis - sua presenca pode fazer a diferenca",
      ],
      challenging: [
        "tem alguns desafios astrologicos hoje - considere oferecer apoio",
        "pode estar se sentindo mais sensivel devido aos transitos atuais",
        "esta navegando por aguas astrologicas agitadas - sua amizade e importante",
      ],
    }

    const statusMessages = messages[status.overall as keyof typeof messages] || messages.challenging
    return statusMessages[Math.floor(Math.random() * statusMessages.length)]
  }
  
  // Criar notificacoes favoraveis para grupos
  private async createFavorableGroupNotifications(userId: string, status: AstrologicalStatus): Promise<void> {
    try {
      const userGroups = await this.getUserGroups(userId)
      
      // Buscar dados do usuario
      const userDoc = await getDoc(doc(db, 'users', userId))
      if (!userDoc.exists()) return
      
      const userData = userDoc.data()
      const userName = userData.displayName || 'Um membro'
      
      for (const group of userGroups) {
        const favorableMessage = this.generateFavorableMessage(status, userName)
        
        // Enviar notificacao favoravel via backend
        try {
          await GroupNotificationService.sendAutomaticFavorableAlert(group.id, {
            area: 'energia_geral',
            percentage: 85, // Simular alta energia
            description: favorableMessage
          })
          
          console.log(` Notificacao favoravel enviada para grupo ${group.name}`)
        } catch (notificationError) {
          console.error('Erro ao enviar notificacao favoravel:', notificationError)
        }
      }
    } catch (error) {
      console.error('Erro ao criar notificacoes favoraveis:', error)
    }
  }
  
  // Gerar mensagem favoravel
  private generateFavorableMessage(status: AstrologicalStatus, userName: string): string {
    const favorableMessages = {
      excellent: [
        `${userName} esta com energias incriveis hoje!`,
        `${userName} tem transitos muito favoraveis - e um otimo momento!`,
        `${userName} esta radiante astrologicamente - aproveitem essa energia!`,
      ],
      positive: [
        `${userName} tem boas energias hoje - momento favoravel para projetos!`,
        `${userName} esta com transitos positivos - e hora de agir!`,
        `${userName} tem o cosmos a seu favor hoje!`,
      ],
    }
    
    const statusMessages = favorableMessages[status.overall as keyof typeof favorableMessages] || favorableMessages.positive
    return statusMessages[Math.floor(Math.random() * statusMessages.length)]
  }

  private mapLevelToOverall(level?: string): AstrologicalStatus["overall"] {
    switch ((level || "").toLowerCase()) {
      case "excelente":
        return "excellent"
      case "bom":
        return "positive"
      case "neutro":
        return "neutral"
      case "desafiador":
        return "challenging"
      case "critico":
      case "critico":
        return "critical"
      default:
        return "neutral"
    }
  }
}

export default new GroupService()



