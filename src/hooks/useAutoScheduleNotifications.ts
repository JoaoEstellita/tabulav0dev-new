import { useEffect } from 'react'
import { Platform } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useAuth } from './useAuth'
import { useNotificationPreferences } from './useNotificationPreferences'
import UserService from '../services/firebase/UserService'
import AstroNotificationOrchestrator from '../services/notifications/AstroNotificationOrchestrator'
import { registerDeviceToken } from '../services/notifications/registerDeviceToken'

const LAST_SCHEDULE_KEY = '@tabula_estelar:last_auto_schedule_key'

export function useAutoScheduleNotifications() {
  const { user } = useAuth()
  const { preferences } = useNotificationPreferences()

  useEffect(() => {
    (async () => {
      try {
        // Web não suporta agendamento local via expo-notifications
        if (Platform.OS === 'web') return
        if (!user?.uid) return
        // Registrar token Android (no-op em iOS)
        try { await registerDeviceToken(user.uid) } catch {}

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
        const pushTypes = p?.push?.types || {}
        await AstroNotificationOrchestrator.scheduleAll(user.uid, birthData as any, {
          dailyTime: p?.quietHours?.end || '08:00',
          enableDaily: pushTypes.daily_summary !== false,
          enableWeekly: pushTypes.weekly_digest !== false,
          enableMonthly: false,
          enablePersonalAlerts: pushTypes.user_status_critical !== false,
        })
        await AsyncStorage.setItem(LAST_SCHEDULE_KEY, today)
      } catch (e) {
        console.log('useAutoScheduleNotifications error', e)
      }
    })()
  }, [user?.uid, preferences])
}

export default useAutoScheduleNotifications


