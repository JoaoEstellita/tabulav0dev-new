import * as Notifications from "expo-notifications"
import * as Device from "expo-device"
import { Platform } from "react-native"
import { doc, updateDoc } from "firebase/firestore"
import { db } from "../../config/firebase"

// Configurar como as notificações são exibidas
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
})

export interface NotificationData {
  title: string
  body: string
  data?: any
}

class NotificationService {
  private expoPushToken: string | null = null

  async initialize(userId: string) {
    try {
      // Verificar se é dispositivo físico
      if (!Device.isDevice) {
        console.log("Notificações push só funcionam em dispositivos físicos")
        return null
      }

      // Solicitar permissões
      const { status: existingStatus } = await Notifications.getPermissionsAsync()
      let finalStatus = existingStatus

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync()
        finalStatus = status
      }

      if (finalStatus !== "granted") {
        console.log("Permissão para notificações negada")
        return null
      }

      // Obter token do Expo
      const token = (await Notifications.getExpoPushTokenAsync()).data
      this.expoPushToken = token

      // Salvar token no Firestore
      await this.saveTokenToFirestore(userId, token)

      // Configurar canal para Android
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FFD700",
        })
      }

      console.log("Notificações configuradas com sucesso:", token)
      return token
    } catch (error) {
      console.error("Erro ao configurar notificações:", error)
      return null
    }
  }

  private async saveTokenToFirestore(userId: string, token: string) {
    try {
      const userRef = doc(db, "users", userId)
      await updateDoc(userRef, {
        expoPushToken: token,
        lastTokenUpdate: new Date(),
      })
    } catch (error) {
      console.error("Erro ao salvar token:", error)
    }
  }

  async sendNotificationToUser(userId: string, notification: NotificationData) {
    try {
      // Buscar token do usuário no Firestore
      const userDoc = await import("firebase/firestore").then(({ getDoc, doc }) => getDoc(doc(db, "users", userId)))

      if (!userDoc.exists()) {
        console.log("Usuário não encontrado")
        return false
      }

      const userData = userDoc.data()
      const token = userData.expoPushToken

      if (!token) {
        console.log("Token de notificação não encontrado para o usuário")
        return false
      }

      return await this.sendPushNotification(token, notification)
    } catch (error) {
      console.error("Erro ao enviar notificação:", error)
      return false
    }
  }

  async sendPushNotification(expoPushToken: string, notification: NotificationData) {
    const message = {
      to: expoPushToken,
      sound: "default",
      title: notification.title,
      body: notification.body,
      data: notification.data || {},
      badge: 1,
    }

    try {
      const response = await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Accept-encoding": "gzip, deflate",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      })

      const result = await response.json()
      console.log("Notificação enviada:", result)
      return true
    } catch (error) {
      console.error("Erro ao enviar push notification:", error)
      return false
    }
  }

  // Escutar notificações recebidas
  addNotificationReceivedListener(callback: (notification: Notifications.Notification) => void) {
    return Notifications.addNotificationReceivedListener(callback)
  }

  // Escutar quando usuário toca na notificação
  addNotificationResponseReceivedListener(callback: (response: Notifications.NotificationResponse) => void) {
    return Notifications.addNotificationResponseReceivedListener(callback)
  }
}

export default new NotificationService()
