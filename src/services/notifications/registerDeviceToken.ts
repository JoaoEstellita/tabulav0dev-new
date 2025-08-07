import * as Notifications from 'expo-notifications'
import { Platform } from 'react-native'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../config/firebase'

type RegisterResult = {
  token?: string
  deviceId?: string
  error?: string
}

export async function registerAndroidDeviceToken(userId: string): Promise<RegisterResult> {
  try {
    if (!userId) return { error: 'Usuário inválido' }
    if (Platform.OS !== 'android') return { error: 'Somente Android' }

    const perm = await Notifications.requestPermissionsAsync()
    if (perm.status !== 'granted') {
      return { error: 'Permissão negada' }
    }

    const pushToken = await Notifications.getDevicePushTokenAsync()
    const token = pushToken.data

    // Gerar deviceId estável a partir do token
    const deviceId = Buffer.from(token).toString('base64').replace(/[^a-zA-Z0-9]/g, '').slice(0, 32)

    await setDoc(
      doc(db, `users/${userId}/fcmTokens/${deviceId}`),
      {
        token,
        platform: 'android',
        deviceId,
        lastUpdated: serverTimestamp(),
      },
      { merge: true },
    )

    return { token, deviceId }
  } catch (error: any) {
    return { error: error?.message || 'Erro ao registrar token' }
  }
}


