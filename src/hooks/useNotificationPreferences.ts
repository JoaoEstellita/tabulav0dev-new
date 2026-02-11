import { useEffect, useMemo, useState } from 'react'
import { doc, onSnapshot, serverTimestamp, updateDoc } from 'firebase/firestore'
import { db } from '../config/firebase'
import { useAuth } from './useAuth'

export type NotificationPreferences = {
  pushEnabled: boolean
  pushIncludeMemberName: boolean
  astroEventsPersonalEnabled?: boolean
  astroEventsCollectiveEnabled?: boolean
  astroEventsPersonalFilters?: {
    aspects: boolean
    transits: boolean
    combos: boolean
  }
  astroEventsCollectiveFilters?: {
    aspects: boolean
    transits: boolean
    combos: boolean
  }
  groupFilters?: {
    critical: boolean
    positive: boolean
    messages: boolean
  }
  forecastFilters?: {
    weekly: boolean
  }
  quietHours?: {
    enabled: boolean
    start: string
    end: string
  }
  push: {
    frequencyProfile?: 'focus' | 'balanced' | 'quiet'
    types: {
      member_status_critical: boolean
      user_status_critical: boolean
      user_status_critical_recovered?: boolean
      user_status_highlight?: boolean
      member_status_positive?: boolean
      user_status_positive?: boolean
      group_message: boolean
      astro_event_personal?: boolean
      astro_event_collective?: boolean
      weekly_digest?: boolean
      critical_active_summary?: boolean
      daily_summary?: boolean
      weekly_summary?: boolean
      forecast_weekly?: boolean
    }
    limits?: {
      member_status_critical?: { dailyLimit: number; throttleMinutes: number }
      user_status_critical?: { dailyLimit: number; throttleMinutes: number }
      user_status_critical_recovered?: { dailyLimit: number; throttleMinutes: number }
      member_status_positive?: { dailyLimit: number; throttleMinutes: number }
      user_status_positive?: { dailyLimit: number; throttleMinutes: number }
      user_status_highlight?: { dailyLimit: number; throttleMinutes: number }
      group_message?: { dailyLimit: number; throttleMinutes: number; burstWindowMinutes?: number }
      astro_event_personal?: { dailyLimit: number; throttleMinutes: number }
      astro_event_collective?: { dailyLimit: number; throttleMinutes: number }
      weekly_digest?: { dailyLimit: number; throttleMinutes: number }
      critical_active_summary?: { dailyLimit: number; throttleMinutes: number }
      daily_summary?: { dailyLimit: number; throttleMinutes: number }
      weekly_summary?: { dailyLimit: number; throttleMinutes: number }
      forecast_weekly?: { dailyLimit: number; throttleMinutes: number }
    }
  }
  inApp: {
    types: {
      daily_ready?: boolean
      user_status?: boolean
      member_status_critical: boolean
      user_status_critical: boolean
      user_status_critical_recovered?: boolean
      user_status_highlight?: boolean
      member_status_positive?: boolean
      user_status_positive?: boolean
      group_status?: boolean
      group_message: boolean
      astro_event_personal?: boolean
      astro_event_collective?: boolean
      weekly_digest?: boolean
      critical_active_summary?: boolean
      daily_summary?: boolean
      weekly_summary?: boolean
      forecast_weekly?: boolean
    }
  }
}

const DEFAULT_PREFERENCES: NotificationPreferences = {
  pushEnabled: true,
  pushIncludeMemberName: true,
  astroEventsPersonalEnabled: false,
  astroEventsCollectiveEnabled: false,
  astroEventsPersonalFilters: {
    aspects: true,
    transits: true,
    combos: true,
  },
  astroEventsCollectiveFilters: {
    aspects: true,
    transits: true,
    combos: true,
  },
  groupFilters: {
    critical: true,
    positive: false,
    messages: false,
  },
  forecastFilters: {
    weekly: false,
  },
  quietHours: {
    enabled: false,
    start: '22:00',
    end: '08:00',
  },
  push: {
    frequencyProfile: 'balanced',
    types: {
      member_status_critical: true,
      user_status_critical: true,
      user_status_critical_recovered: false,
      user_status_highlight: false,
      member_status_positive: false,
      user_status_positive: false,
      group_message: false,
      astro_event_personal: false,
      astro_event_collective: false,
      weekly_digest: false,
      critical_active_summary: false,
      daily_summary: false,
      weekly_summary: false,
      forecast_weekly: false,
    },
    limits: {
      member_status_critical: { dailyLimit: 0, throttleMinutes: 60 },
      user_status_critical: { dailyLimit: 0, throttleMinutes: 60 },
      user_status_critical_recovered: { dailyLimit: 2, throttleMinutes: 120 },
      user_status_highlight: { dailyLimit: 1, throttleMinutes: 240 },
      member_status_positive: { dailyLimit: 2, throttleMinutes: 120 },
      user_status_positive: { dailyLimit: 2, throttleMinutes: 120 },
      group_message: { dailyLimit: 20, throttleMinutes: 1, burstWindowMinutes: 1 },
      astro_event_personal: { dailyLimit: 3, throttleMinutes: 180 },
      astro_event_collective: { dailyLimit: 2, throttleMinutes: 240 },
      weekly_digest: { dailyLimit: 1, throttleMinutes: 1440 },
      critical_active_summary: { dailyLimit: 1, throttleMinutes: 720 },
      daily_summary: { dailyLimit: 1, throttleMinutes: 720 },
      weekly_summary: { dailyLimit: 1, throttleMinutes: 1440 },
      forecast_weekly: { dailyLimit: 1, throttleMinutes: 1440 },
    },
  },
  inApp: {
    types: {
      daily_ready: false,
      user_status: false,
      member_status_critical: true,
      user_status_critical: true,
      user_status_critical_recovered: false,
      user_status_highlight: false,
      member_status_positive: false,
      user_status_positive: false,
      group_status: false,
      group_message: false,
      astro_event_personal: false,
      astro_event_collective: false,
      weekly_digest: false,
      critical_active_summary: false,
      daily_summary: false,
      weekly_summary: false,
      forecast_weekly: false,
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

export const loadUserNotificationPreferences = async (
  _userId: string,
  userData?: any
): Promise<{ prefs: NotificationPreferences }> => {
  const existing = userData?.notifications || null
  const merged = mergeDeep(DEFAULT_PREFERENCES, existing || {}) as NotificationPreferences
  if (merged.push?.types?.weekly_digest === undefined) {
    const legacyWeeklyEnabled = !(
      merged.push?.types?.critical_active_summary === false &&
      merged.push?.types?.weekly_summary === false &&
      merged.push?.types?.forecast_weekly === false
    )
    merged.push.types.weekly_digest = legacyWeeklyEnabled
  }
  if (merged.inApp?.types?.weekly_digest === undefined) {
    const legacyWeeklyEnabled = !(
      merged.inApp?.types?.critical_active_summary === false &&
      merged.inApp?.types?.weekly_summary === false &&
      merged.inApp?.types?.forecast_weekly === false
    )
    merged.inApp.types.weekly_digest = legacyWeeklyEnabled
  }
  if (!merged.push?.limits?.weekly_digest) {
    const legacyLimits =
      merged.push?.limits?.weekly_summary ||
      merged.push?.limits?.forecast_weekly ||
      merged.push?.limits?.critical_active_summary
    if (legacyLimits) merged.push.limits.weekly_digest = legacyLimits
  }
  return { prefs: merged }
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
    const { prefs } = await loadUserNotificationPreferences(userId, data)
    sharedState = { preferences: prefs, loading: false }
    notifyShared()
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
