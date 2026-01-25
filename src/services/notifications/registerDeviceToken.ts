import * as Notifications from 'expo-notifications'
import { Platform } from 'react-native'
import * as Device from 'expo-device'
import Constants from 'expo-constants'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../config/firebase'

type RegisterResult = {
  token?: string
  deviceId?: string
  error?: string
}

export async function registerDeviceToken(userId: string): Promise<RegisterResult> {
  try {
    if (!userId) return { error: 'Usuario invalido' }
    if (Platform.OS !== 'android' && Platform.OS !== 'ios') {
      return { error: 'Somente Android ou iOS' }
    }
    if (!Device.isDevice) {
      return { error: 'Push requer dispositivo fisico' }
    }

    const perm = await Notifications.requestPermissionsAsync()
    if (perm.status !== 'granted') {
      return { error: 'Permissao negada' }
    }

    const projectId =
      Constants.expoConfig?.extra?.eas?.projectId ||
      Constants.easConfig?.projectId ||
      undefined
    const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data

    const deviceId = token.replace(/[^a-zA-Z0-9]/g, '').slice(0, 32)

    await setDoc(
      doc(db, `users/${userId}/fcmTokens/${deviceId}`),
      {
        token,
        platform: Platform.OS,
        deviceId,
        provider: 'expo',
        lastUpdated: serverTimestamp(),
      },
      { merge: true },
    )

    await setDoc(
      doc(db, 'users', userId),
      {
        notificationTokens: {
          expo: {
            [deviceId]: {
              token,
              platform: Platform.OS,
              deviceId,
              isValid: true,
              updatedAt: serverTimestamp(),
            },
          },
        },
      },
      { merge: true },
    )

    return { token, deviceId }
  } catch (error: any) {
    return { error: error?.message || 'Erro ao registrar token' }
  }
}

// Backward-compatible alias for older bundles.
export async function registerAndroidDeviceToken(userId: string): Promise<RegisterResult> {
  return registerDeviceToken(userId)
}
