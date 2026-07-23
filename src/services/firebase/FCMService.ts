import { Platform } from "react-native"
import { doc, setDoc } from "firebase/firestore"
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

export interface FCMToken {
  token: string
  platform: "ios" | "android" | "web"
  deviceId: string
  lastUpdated: Date
}

class FCMService {
  async initialize(userId: string): Promise<string | null> {
    try {
      if (!Device.isDevice && Platform.OS !== "web") {
        console.log("FCM só funciona em dispositivos físicos ou web")
        return null
      }

      const { status } = await Notifications.requestPermissionsAsync()
      if (status !== "granted") {
        console.log("Permissão para notificações negada")
        return null
      }

      const token = await this.getExpoToken()
      if (!token) {
        console.log("Não foi possível obter token Expo")
        return null
      }

      await this.saveTokenToFirestore(userId, token)
      this.setupNotificationListeners()

      if (Platform.OS === "android") {
        await this.setupAndroidChannel()
      }

      return token
    } catch (error) {
      console.error("Erro ao inicializar FCM:", error)
      return null
    }
  }

  private async getExpoToken(): Promise<string | null> {
    try {
      if (Platform.OS === "web") {
        const { getToken } = await import("firebase/messaging")
        const { messaging } = await import("../../config/firebase")
        if (!messaging) return null
        const vapidKey = process.env.EXPO_PUBLIC_VAPID_KEY
        return await getToken(messaging, { vapidKey })
      }
      const { data: token } = await Notifications.getExpoPushTokenAsync({
        projectId: "tabula-estelar-84fdc",
      })
      return token
    } catch (error) {
      console.error("Erro ao obter token Expo:", error)
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
      const userRef = doc(db, "users", userId)
      await setDoc(userRef, { fcmTokens: { [Platform.OS]: tokenData }, lastActive: new Date() }, { merge: true })
    } catch (error) {
      console.error("Erro ao salvar token FCM:", error)
    }
  }

  private setupNotificationListeners(): void {
    Notifications.addNotificationReceivedListener((notification) => {
      const data = notification.request.content.data
      if (data?.type === "critical_alert") {
        Notifications.setBadgeCountAsync(1)
      }
    })

    Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data
      if (data?.screen) {
        console.log("Navegar para:", data.screen, data)
      }
      Notifications.setBadgeCountAsync(0)
    })

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
        if (payload.notification && "Notification" in window && Notification.permission === "granted") {
          new Notification(payload.notification.title || "Tábula Estelar", {
            body: payload.notification.body,
            icon: "/assets/icon.png",
            tag: "tabula-estelar",
          })
        }
      })
    } catch (error) {
      console.error("Erro ao configurar listener web:", error)
    }
  }

  private async setupAndroidChannel(): Promise<void> {
    await Notifications.setNotificationChannelAsync("critical-alerts", {
      name: "Alertas de Atenção",
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

  async clearAllNotifications(): Promise<void> {
    try {
      await Notifications.dismissAllNotificationsAsync()
      await Notifications.setBadgeCountAsync(0)
    } catch (error) {
      console.error("Erro ao limpar notificações:", error)
    }
  }
}

export default new FCMService()
