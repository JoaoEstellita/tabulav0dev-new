import { useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useAuth } from './useAuth'
import { useNotificationPreferences } from './useNotificationPreferences'
import UserService from '../services/firebase/UserService'
import AstroNotificationOrchestrator from '../services/notifications/AstroNotificationOrchestrator'
import { registerAndroidDeviceToken } from '../services/notifications/registerDeviceToken'

const LAST_SCHEDULE_KEY = '@tabula_estelar:last_auto_schedule_key'

export function useAutoScheduleNotifications() {
  const { user } = useAuth()
  const { preferences } = useNotificationPreferences()

  useEffect(() => {
    (async () => {
      try {
        if (!user?.uid) return
        // Registrar token Android (no-op em iOS)
        try { await registerAndroidDeviceToken(user.uid) } catch {}

        const last = await AsyncStorage.getItem(LAST_SCHEDULE_KEY)
        const today = new Date().toISOString().slice(0,10)
        if (last === today) return

        const profile = await UserService.getUserProfile(user.uid)
        if (!profile?.birthDate || !profile?.birthTime || !profile?.birthLocation) return

        const birthData = {
          birthDate: profile.birthDate,
          birthTime: profile.birthTime,
          birthLocation: profile.birthLocation,
        }

        // Disponibilizar para botão de teste
        ;(globalThis as any).__currentUserId = user.uid
        ;(globalThis as any).__currentBirthData = birthData

        const p: any = preferences || {}
        await AstroNotificationOrchestrator.scheduleAll(user.uid, birthData as any, {
          dailyTime: p.dailyTime || '08:00',
          enableDaily: p.dailyNotifications !== false,
          enableWeekly: p.weeklyNotifications !== false,
          enableMonthly: p.monthlyNotifications !== false,
          enablePersonalAlerts: p.personalAlerts !== false,
        })
        await AsyncStorage.setItem(LAST_SCHEDULE_KEY, today)
      } catch (e) {
        console.log('useAutoScheduleNotifications error', e)
      }
    })()
  }, [user?.uid, preferences?.dailyTime, preferences?.dailyNotifications, preferences?.weeklyNotifications, preferences?.monthlyNotifications, preferences?.personalAlerts])
}

export default useAutoScheduleNotifications


