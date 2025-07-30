"use client"

import { useEffect, useRef } from "react"
import * as Notifications from "expo-notifications"
import NotificationService from "../services/firebase/NotificationService"
import { useAuth } from "./useAuth"

export function useNotifications() {
  const { user } = useAuth()
  const notificationListener = useRef<any>()
  const responseListener = useRef<any>()

  useEffect(() => {
    if (user) {
      // Inicializar notificações
      NotificationService.initialize(user.uid)

      // Escutar notificações recebidas
      notificationListener.current = NotificationService.addNotificationReceivedListener((notification) => {
        console.log("Notificação recebida:", notification)
        // Aqui você pode atualizar o estado da app, mostrar badge, etc.
      })

      // Escutar quando usuário toca na notificação
      responseListener.current = NotificationService.addNotificationResponseReceivedListener((response) => {
        console.log("Usuário tocou na notificação:", response)
        // Aqui você pode navegar para tela específica
        const data = response.notification.request.content.data
        if (data.screen) {
          // Navegar para tela específica
          console.log("Navegar para:", data.screen)
        }
      })
    }

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current)
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current)
      }
    }
  }, [user])

  return {
    sendNotification: NotificationService.sendNotificationToUser,
  }
}
