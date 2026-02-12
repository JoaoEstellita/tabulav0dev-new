"use client"

import { useEffect, useRef, useState } from 'react'
import * as Notifications from 'expo-notifications'
import { Platform } from 'react-native'
import * as Device from 'expo-device'
import Constants from 'expo-constants'
import { useNavigation } from '@react-navigation/native'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
})

export function useNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>()
  const [notification, setNotification] = useState<Notifications.Notification>()
  const notificationListener = useRef<Notifications.Subscription | null>(null)
  const responseListener = useRef<Notifications.Subscription | null>(null)
  const navigation = useNavigation<any>()

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token))

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification)
    })

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      try {
        const data: any = response.notification.request.content.data || {}
        const target = data.navTarget as string | undefined
        if (target?.startsWith('home')) {
          navigation.navigate('Home')
          ;(globalThis as any).__homeFocus = target
        }
      } catch (e) {
        console.log('Nav from notification error', e)
      }
    })

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current)
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current)
      }
    }
  }, [])

  return {
    expoPushToken,
    notification,
  }
}

async function registerForPushNotificationsAsync() {
  if (Platform.OS !== 'android' && Platform.OS !== 'ios') return undefined
  if (!Device.isDevice) return undefined

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    })
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync()
  let finalStatus = existingStatus
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync()
    finalStatus = status
  }
  if (finalStatus !== 'granted') return undefined

  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ||
    Constants.easConfig?.projectId ||
    undefined
  const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data
  return token
}
