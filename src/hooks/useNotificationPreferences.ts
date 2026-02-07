import { useEffect, useMemo, useState } from 'react'
import { doc, getDoc, onSnapshot, serverTimestamp, updateDoc } from 'firebase/firestore'
import { db } from '../config/firebase'
import { useAuth } from './useAuth'

export type NotificationPreferences = {
  pushEnabled: boolean
  pushIncludeMemberName: boolean
  astroEventsPersonalEnabled?: boolean
  astroEventsCollectiveEnabled?: boolean
  quietHours?: {
    enabled: boolean
    start: string
    end: string
  }
  push: {
    types: {
      member_status_critical: boolean
      user_status_critical: boolean
      member_status_positive?: boolean
      user_status_positive?: boolean
      group_message: boolean
      astro_event_personal?: boolean
      daily_summary?: boolean
      daily_overview?: boolean
      forecast_weekly?: boolean
    }
    limits?: {
      member_status_critical?: { dailyLimit: number; throttleMinutes: number }
      user_status_critical?: { dailyLimit: number; throttleMinutes: number }
      member_status_positive?: { dailyLimit: number; throttleMinutes: number }
      user_status_positive?: { dailyLimit: number; throttleMinutes: number }
      group_message?: { dailyLimit: number; throttleMinutes: number; burstWindowMinutes?: number }
      astro_event_personal?: { dailyLimit: number; throttleMinutes: number }
    }
  }
  inApp: {
    types: {
      member_status_critical: boolean
      user_status_critical: boolean
      member_status_positive?: boolean
      user_status_positive?: boolean
      group_message: boolean
      astro_event_personal?: boolean
      astro_event_collective?: boolean
      daily_summary?: boolean
      daily_overview?: boolean
      forecast_weekly?: boolean
    }
  }
}

const DEFAULT_PREFERENCES: NotificationPreferences = {
  pushEnabled: true,
  pushIncludeMemberName: true,
  astroEventsPersonalEnabled: true,
  astroEventsCollectiveEnabled: false,
  quietHours: {
    enabled: false,
    start: '22:00',
    end: '08:00',
  },
  push: {
    types: {
      member_status_critical: true,
      user_status_critical: true,
      member_status_positive: true,
      user_status_positive: true,
      group_message: true,
      astro_event_personal: true,
      daily_summary: true,
      daily_overview: false,
      forecast_weekly: true,
    },
    limits: {
      member_status_critical: { dailyLimit: 0, throttleMinutes: 60 },
      user_status_critical: { dailyLimit: 0, throttleMinutes: 60 },
      member_status_positive: { dailyLimit: 2, throttleMinutes: 60 },
      user_status_positive: { dailyLimit: 2, throttleMinutes: 60 },
      group_message: { dailyLimit: 20, throttleMinutes: 1, burstWindowMinutes: 1 },
      astro_event_personal: { dailyLimit: 5, throttleMinutes: 120 },
    },
  },
  inApp: {
    types: {
      member_status_critical: true,
      user_status_critical: true,
      member_status_positive: true,
      user_status_positive: true,
      group_message: true,
      astro_event_personal: true,
      astro_event_collective: false,
      daily_summary: true,
      daily_overview: true,
      forecast_weekly: true,
    },
  },
}

const mergeDeep = (base: any, override: any) => {
  if (!override) return base
  const result = Array.isArray(base) ? [...base] : { ...base }
  Object.keys(override).forEach((key) => {
    const value = override[key]
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      result[key] = mergeDeep(base?.[key] || {}, value)
    } else if (value !== undefined) {
      result[key] = value
    }
  })
  return result
}

const isLegacyPreferenceShape = (legacy: any) => {
  if (!legacy) return false
  return (
    legacy.criticalAlerts !== undefined ||
    legacy.groupUpdates !== undefined ||
    legacy.groupNotifications !== undefined ||
    legacy.dailyHoroscope !== undefined ||
    legacy.dailyNotifications !== undefined ||
    legacy.quietHours !== undefined ||
    legacy.quietHoursStart !== undefined ||
    legacy.quietHoursEnd !== undefined ||
    legacy.pushEnabled !== undefined ||
    legacy.pushIncludeMemberName !== undefined
  )
}

const mapLegacyPreferences = (legacy: any) => {
  if (!legacy) return {}
  const mapped: any = {}
  if (typeof legacy.criticalAlerts === 'boolean') {
    mapped.push = { types: { user_status_critical: legacy.criticalAlerts } }
    mapped.inApp = { types: { user_status_critical: legacy.criticalAlerts } }
  }
  const groupFlag =
    typeof legacy.groupUpdates === 'boolean'
      ? legacy.groupUpdates
      : typeof legacy.groupNotifications === 'boolean'
        ? legacy.groupNotifications
        : null
  if (typeof groupFlag === 'boolean') {
    mapped.push = {
      ...(mapped.push || {}),
      types: {
        ...(mapped.push?.types || {}),
        member_status_critical: groupFlag,
      },
    }
    mapped.inApp = {
      ...(mapped.inApp || {}),
      types: {
        ...(mapped.inApp?.types || {}),
        member_status_critical: groupFlag,
      },
    }
  }
  if (typeof legacy.dailyHoroscope === 'boolean' || typeof legacy.dailyNotifications === 'boolean') {
    const dailyEnabled = legacy.dailyHoroscope ?? legacy.dailyNotifications
    mapped.inApp = {
      ...(mapped.inApp || {}),
      types: {
        ...(mapped.inApp?.types || {}),
        daily_ready: dailyEnabled,
      },
    }
  }
  if (legacy.quietHours || legacy.quietHoursStart || legacy.quietHoursEnd) {
    mapped.quietHours = {
      enabled: legacy.quietHours === true,
      start: legacy.quietHoursStart || DEFAULT_PREFERENCES.quietHours?.start || '22:00',
      end: legacy.quietHoursEnd || DEFAULT_PREFERENCES.quietHours?.end || '08:00',
    }
  }
  if (typeof legacy.pushEnabled === 'boolean') {
    mapped.pushEnabled = legacy.pushEnabled
  }
  if (typeof legacy.pushIncludeMemberName === 'boolean') {
    mapped.pushIncludeMemberName = legacy.pushIncludeMemberName
  }
  return mapped
}

export const loadUserNotificationPreferences = async (
  userId: string,
  userData?: any
): Promise<{ prefs: NotificationPreferences; migrated: boolean }> => {
  const migrationVersion = Number(userData?.notificationsMigrationVersion || 0)
  const migrationDone = migrationVersion >= 1
  const existing = userData?.notifications || null
  const existingLegacy = isLegacyPreferenceShape(existing) ? existing : null
  const legacyPreferences = userData?.preferences?.notifications || null
  const legacyPreferencesMapped = isLegacyPreferenceShape(legacyPreferences)
    ? mapLegacyPreferences(legacyPreferences)
    : legacyPreferences
  let legacyData: any = null
  let migrated = false

  if (!migrationDone && (!existing || existingLegacy)) {
    try {
      const legacySnap = await getDoc(doc(db, 'users', userId, 'preferences', 'notifications'))
      legacyData = legacySnap.exists() ? legacySnap.data() : null
    } catch {
      legacyData = null
    }
  }

  const merged = mergeDeep(
    DEFAULT_PREFERENCES,
    mergeDeep(
      legacyPreferencesMapped || {},
      mergeDeep(existing || {}, mapLegacyPreferences(existingLegacy || legacyData))
    )
  ) as NotificationPreferences

  if (!migrationDone && (!existing || existingLegacy || legacyData || legacyPreferences)) {
    migrated = true
  }

  return { prefs: merged, migrated }
}

type SharedState = {
  preferences: NotificationPreferences | null
  loading: boolean
}

type SharedListener = (state: SharedState) => void

const sharedListeners = new Set<SharedListener>()
let sharedUnsub: null | (() => void) = null
let sharedUserId: string | null = null
let sharedState: SharedState = { preferences: null, loading: true }

const notifyShared = () => {
  sharedListeners.forEach((listener) => listener(sharedState))
}

const startSharedListener = (userId: string) => {
  if (!userId) return
  if (sharedUnsub) sharedUnsub()
  sharedUserId = userId
  sharedState = { preferences: null, loading: true }
  notifyShared()

  sharedUnsub = onSnapshot(doc(db, 'users', userId), async (snap) => {
    const data = snap.exists() ? snap.data() : {}
    const { prefs, migrated } = await loadUserNotificationPreferences(userId, data)
    sharedState = { preferences: prefs, loading: false }
    notifyShared()
    if (migrated) {
      try {
        await updateDoc(doc(db, 'users', userId), {
          notifications: prefs,
          lastPreferencesUpdate: serverTimestamp(),
          notificationsMigrationVersion: 1,
        })
      } catch {
        // Best effort
      }
    }
  })
}

const stopSharedListenerIfIdle = () => {
  if (sharedListeners.size > 0) return
  if (sharedUnsub) {
    sharedUnsub()
    sharedUnsub = null
  }
  sharedUserId = null
  sharedState = { preferences: null, loading: true }
}

const subscribeToSharedPreferences = (userId: string, listener: SharedListener) => {
  sharedListeners.add(listener)
  if (sharedUserId !== userId || !sharedUnsub) {
    startSharedListener(userId)
  } else {
    listener(sharedState)
  }

  return () => {
    sharedListeners.delete(listener)
    stopSharedListenerIfIdle()
  }
}

export function useNotificationPreferences() {
  const { user } = useAuth()
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.uid) {
      setPreferences(null)
      setLoading(false)
      return
    }

    const unsubscribe = subscribeToSharedPreferences(user.uid, (state) => {
      setPreferences(state.preferences)
      setLoading(state.loading)
    })

    return () => {
      unsubscribe()
    }
  }, [user?.uid])

  const updatePreferences = async (updates: Partial<NotificationPreferences>) => {
    if (!user?.uid || !preferences) return false
    const merged = mergeDeep(preferences, updates) as NotificationPreferences
    setPreferences(merged)
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        notifications: merged,
        lastPreferencesUpdate: serverTimestamp(),
      })
      return true
    } catch {
      return false
    }
  }

  const isInQuietHours = useMemo(() => {
    if (!preferences?.quietHours?.enabled) return false
    const now = new Date()
    const currentTime = now.getHours() * 60 + now.getMinutes()
    const [startHour, startMinute] = preferences.quietHours.start.split(':').map(Number)
    const [endHour, endMinute] = preferences.quietHours.end.split(':').map(Number)
    const startTime = startHour * 60 + startMinute
    const endTime = endHour * 60 + endMinute
    if (startTime > endTime) {
      return currentTime >= startTime || currentTime <= endTime
    }
    return currentTime >= startTime && currentTime <= endTime
  }, [preferences])

  return {
    preferences,
    loading,
    updatePreferences,
    isInQuietHours,
    defaults: DEFAULT_PREFERENCES,
  }
}
