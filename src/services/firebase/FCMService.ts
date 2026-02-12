import { Platform } from "react-native"
import { doc, setDoc, getDoc } from "firebase/firestore"
import { db } from "../../config/firebase"
import * as Notifications from "expo-notifications"
import * as Device from "expo-device"

// Configurar comportamento das notificações
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
})

export interface FCMNotification {
  title: string
  body: string
  data?: Record<string, any>
  imageUrl?: string
  priority?: "high" | "normal"
  sound?: string
}

export interface FCMToken {
  token: string
  platform: "ios" | "android" | "web"
  deviceId: string
  lastUpdated: Date
}

class FCMService {
  private fcmServerKey = "AAAA8yGxQpM:APA91bH8vK_example_key" // Substitua pela sua chave real
  private vapidKey = "BH7example_vapid_key" // Para web push

  async initialize(userId: string): Promise<string | null> {
    try {
      if (!Device.isDevice && Platform.OS !== "web") {
        console.log("FCM só funciona em dispositivos físicos ou web")
        return null
      }

      // Solicitar permissões
      const { status } = await Notifications.requestPermissionsAsync()
      if (status !== "granted") {
        console.log("Permissão para notificações negada")
        return null
      }

      // Obter token FCM
      const token = await this.getFCMToken()
      if (!token) {
        console.log("Não foi possível obter token FCM")
        return null
      }

      // Salvar token no Firestore
      await this.saveTokenToFirestore(userId, token)

      // Configurar listeners
      this.setupNotificationListeners()

      // Configurar canal Android
      if (Platform.OS === "android") {
        await this.setupAndroidChannel()
      }

      console.log("FCM inicializado com sucesso:", token)
      return token
    } catch (error) {
      console.error("Erro ao inicializar FCM:", error)
      return null
    }
  }

  private async getFCMToken(): Promise<string | null> {
    try {
      if (Platform.OS === "web") {
        // Para web, usar Firebase Messaging
        const { getToken } = await import("firebase/messaging")
        const { messaging } = await import("../../config/firebase")

        if (!messaging) return null

        const token = await getToken(messaging, { vapidKey: this.vapidKey })
        return token
      } else {
        // Para mobile, usar Expo Notifications
        const { data: token } = await Notifications.getExpoPushTokenAsync({
          projectId: "tabula-estelar-84fdc",
        })
        return token
      }
    } catch (error) {
      console.error("Erro ao obter token FCM:", error)
      return null
    }
  }

  private async saveTokenToFirestore(userId: string, token: string): Promise<void> {
    try {
      const tokenData: FCMToken = {
        token,
        platform: Platform.OS as "ios" | "android" | "web",
        deviceId: Device.modelName || "unknown",
        lastUpdated: new Date(),
      }

      // Salvar no documento do usuário
      const userRef = doc(db, "users", userId)
      await setDoc(
        userRef,
        {
          fcmTokens: {
            [Platform.OS]: tokenData,
          },
          lastActive: new Date(),
        },
        { merge: true },
      )

      // Salvar em coleção separada para facilitar queries
      const tokenRef = doc(db, "fcmTokens", `${userId}_${Platform.OS}`)
      await setDoc(tokenRef, {
        userId,
        ...tokenData,
      })
    } catch (error) {
      console.error("Erro ao salvar token FCM:", error)
    }
  }

  private setupNotificationListeners(): void {
    // Listener para notificações recebidas quando app está aberto
    Notifications.addNotificationReceivedListener((notification) => {
      console.log("Notificação recebida:", notification)
      this.handleNotificationReceived(notification)
    })

    // Listener para quando usuário toca na notificação
    Notifications.addNotificationResponseReceivedListener((response) => {
      console.log("Usuário tocou na notificação:", response)
      this.handleNotificationTapped(response)
    })

    // Para web, configurar listener do Firebase
    if (Platform.OS === "web") {
      this.setupWebMessageListener()
    }
  }

  private async setupWebMessageListener(): Promise<void> {
    try {
      const { onMessage } = await import("firebase/messaging")
      const { messaging } = await import("../../config/firebase")

      if (!messaging) return

      onMessage(messaging, (payload) => {
        console.log("Mensagem FCM recebida (web):", payload)

        // Mostrar notificação customizada
        if (payload.notification) {
          this.showWebNotification(payload.notification)
        }
      })
    } catch (error) {
      console.error("Erro ao configurar listener web:", error)
    }
  }

  private showWebNotification(notification: any): void {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(notification.title || "Tábula Estelar", {
        body: notification.body,
        icon: "/assets/icon.png",
        badge: "/assets/badge.png",
        tag: "tabula-estelar",
        requireInteraction: true,
      })
    }
  }

  private async setupAndroidChannel(): Promise<void> {
    await Notifications.setNotificationChannelAsync("critical-alerts", {
      name: "Alertas Críticos",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF4444",
      sound: "default",
      enableVibrate: true,
      showBadge: true,
    })

    await Notifications.setNotificationChannelAsync("group-updates", {
      name: "Atualizações do Grupo",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 150, 150, 150],
      lightColor: "#FFD700",
      sound: "default",
    })
  }

  private handleNotificationReceived(notification: Notifications.Notification): void {
    const data = notification.request.content.data

    // Atualizar badge
    Notifications.setBadgeCountAsync(1)

    // Processar dados específicos
    if (data?.type === "critical_alert") {
      // Vibrar para alertas críticos
      if (Platform.OS !== "web") {
        // Vibração personalizada para alertas críticos
      }
    }
  }

  private handleNotificationTapped(response: Notifications.NotificationResponse): void {
    const data = response.notification.request.content.data

    // Navegar para tela específica baseado no tipo
    if (data?.screen) {
      // Implementar navegação
      console.log("Navegar para:", data.screen, data)
    }

    // Limpar badge
    Notifications.setBadgeCountAsync(0)
  }

  // Enviar notificação para usuário específico
  async sendNotificationToUser(userId: string, notification: FCMNotification): Promise<boolean> {
    try {
      // Buscar tokens do usuário
      const userDoc = await getDoc(doc(db, "users", userId))
      if (!userDoc.exists()) {
        console.log("Usuário não encontrado:", userId)
        return false
      }

      const userData = userDoc.data()
      const fcmTokens = userData.fcmTokens || {}

      let success = false

      // Enviar para todos os dispositivos do usuário
      for (const [platform, tokenData] of Object.entries(fcmTokens as Record<string, any>)) {
        const result = await this.sendFCMMessage((tokenData as any)?.token, notification)
        if (result) success = true
      }

      return success
    } catch (error) {
      console.error("Erro ao enviar notificação:", error)
      return false
    }
  }

  // Enviar notificação para múltiplos usuários
  async sendNotificationToUsers(userIds: string[], notification: FCMNotification): Promise<number> {
    let successCount = 0

    for (const userId of userIds) {
      const success = await this.sendNotificationToUser(userId, notification)
      if (success) successCount++
    }

    return successCount
  }

  // Enviar mensagem FCM diretamente
  private async sendFCMMessage(token: string, notification: FCMNotification): Promise<boolean> {
    try {
      const message = {
        to: token,
        notification: {
          title: notification.title,
          body: notification.body,
          image: notification.imageUrl,
          sound: notification.sound || "default",
        },
        data: {
          ...notification.data,
          timestamp: Date.now().toString(),
        },
        priority: notification.priority || "high",
        content_available: true,
        mutable_content: true,
      }

      const response = await fetch("https://fcm.googleapis.com/fcm/send", {
        method: "POST",
        headers: {
          Authorization: `key=${this.fcmServerKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      })

      const result = await response.json()

      if (result.success === 1) {
        console.log("Notificação FCM enviada com sucesso")
        return true
      } else {
        console.error("Erro ao enviar FCM:", result)
        return false
      }
    } catch (error) {
      console.error("Erro na requisição FCM:", error)
      return false
    }
  }

  // Enviar notificação para tópico (grupos)
  async sendNotificationToTopic(topic: string, notification: FCMNotification): Promise<boolean> {
    try {
      const message = {
        to: `/topics/${topic}`,
        notification: {
          title: notification.title,
          body: notification.body,
          image: notification.imageUrl,
        },
        data: notification.data || {},
        priority: notification.priority || "high",
      }

      const response = await fetch("https://fcm.googleapis.com/fcm/send", {
        method: "POST",
        headers: {
          Authorization: `key=${this.fcmServerKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      })

      const result = await response.json()
      return result.success === 1
    } catch (error) {
      console.error("Erro ao enviar para tópico:", error)
      return false
    }
  }

  // Inscrever usuário em tópico (grupo)
  async subscribeToTopic(token: string, topic: string): Promise<boolean> {
    try {
      const response = await fetch(`https://iid.googleapis.com/iid/v1/${token}/rel/topics/${topic}`, {
        method: "POST",
        headers: {
          Authorization: `key=${this.fcmServerKey}`,
          "Content-Type": "application/json",
        },
      })

      return response.ok
    } catch (error) {
      console.error("Erro ao inscrever em tópico:", error)
      return false
    }
  }

  // Desinscrever usuário de tópico
  async unsubscribeFromTopic(token: string, topic: string): Promise<boolean> {
    try {
      const response = await fetch(`https://iid.googleapis.com/iid/v1/${token}/rel/topics/${topic}`, {
        method: "DELETE",
        headers: {
          Authorization: `key=${this.fcmServerKey}`,
          "Content-Type": "application/json",
        },
      })

      return response.ok
    } catch (error) {
      console.error("Erro ao desinscrever de tópico:", error)
      return false
    }
  }

  // Agendar notificação local
  async scheduleLocalNotification(notification: FCMNotification, triggerDate: Date): Promise<string | null> {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: notification.data || {},
          sound: notification.sound || "default",
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: triggerDate,
        },
      })

      return notificationId
    } catch (error) {
      console.error("Erro ao agendar notificação:", error)
      return null
    }
  }

  // Cancelar notificação agendada
  async cancelScheduledNotification(notificationId: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId)
    } catch (error) {
      console.error("Erro ao cancelar notificação:", error)
    }
  }

  // Limpar todas as notificações
  async clearAllNotifications(): Promise<void> {
    try {
      await Notifications.dismissAllNotificationsAsync()
      await Notifications.setBadgeCountAsync(0)
    } catch (error) {
      console.error("Erro ao limpar notificações:", error)
    }
  }

  // Obter estatísticas de notificações
  async getNotificationStats(userId: string): Promise<any> {
    try {
      const userDoc = await getDoc(doc(db, "users", userId))
      if (!userDoc.exists()) return null

      const userData = userDoc.data()
      return {
        totalSent: userData.notificationStats?.totalSent || 0,
        totalReceived: userData.notificationStats?.totalReceived || 0,
        lastNotification: userData.notificationStats?.lastNotification || null,
      }
    } catch (error) {
      console.error("Erro ao obter estatísticas:", error)
      return null
    }
  }
}

export default new FCMService()
