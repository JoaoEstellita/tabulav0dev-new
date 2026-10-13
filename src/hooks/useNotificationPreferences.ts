import { useEffect, useMemo, useState } from 'react'
import { doc, onSnapshot, serverTimestamp, updateDoc } from 'firebase/firestore'
import { db } from '../config/firebase'
import { useAuth } from './useAuth'

import { DEFAULT_PREFERENCES, type NotificationPreferences } from '../constants/notificationDefaults'

// Reexportados para quem ja importava daqui.
export { DEFAULT_PREFERENCES }
export type { NotificationPreferences }

const LEGACY_WEEKLY_KEYS = ['critical_active_summary', 'weekly_summary', 'forecast_weekly'] as const
const LEGACY_DAILY_KEYS = ['daily_ready', 'daily_overview'] as const
const LEGACY_GENERIC_KEYS = ['user_status', 'group_status'] as const

const sanitizePreferences = (prefs: NotificationPreferences): NotificationPreferences => {
  const clean = mergeDeep(DEFAULT_PREFERENCES, prefs || {}) as NotificationPreferences
  const pushTypes = { ...(clean.push?.types || {}) } as Record<string, any>
  const inAppTypes = { ...(clean.inApp?.types || {}) } as Record<string, any>
  const pushLimits = { ...(clean.push?.limits || {}) } as Record<string, any>

  const weeklyEnabledByLegacyPush = !LEGACY_WEEKLY_KEYS.every((key) => pushTypes[key] === false)
  const weeklyEnabledByLegacyInApp = !LEGACY_WEEKLY_KEYS.every((key) => inAppTypes[key] === false)

  if (pushTypes.weekly_digest === undefined) pushTypes.weekly_digest = weeklyEnabledByLegacyPush
  if (inAppTypes.weekly_digest === undefined) inAppTypes.weekly_digest = weeklyEnabledByLegacyInApp

  if (inAppTypes.daily_summary === undefined) {
    const dailyEnabledByLegacy = !LEGACY_DAILY_KEYS.every((key) => inAppTypes[key] === false)
    inAppTypes.daily_summary = dailyEnabledByLegacy
  }

  if (!pushLimits.weekly_digest) {
    const legacyLimit =
      pushLimits.weekly_summary ||
      pushLimits.forecast_weekly ||
      pushLimits.critical_active_summary
    if (legacyLimit) pushLimits.weekly_digest = legacyLimit
  }

  LEGACY_DAILY_KEYS.forEach((key) => {
    delete pushTypes[key]
    delete inAppTypes[key]
    delete pushLimits[key]
  })
  LEGACY_GENERIC_KEYS.forEach((key) => {
    delete pushTypes[key]
    delete inAppTypes[key]
    delete pushLimits[key]
  })
  LEGACY_WEEKLY_KEYS.forEach((key) => {
    delete pushTypes[key]
    delete inAppTypes[key]
    delete pushLimits[key]
  })

  clean.push = {
    ...(clean.push || {}),
    types: pushTypes as NotificationPreferences['push']['types'],
    limits: pushLimits as NotificationPreferences['push']['limits'],
  }
  clean.inApp = {
    ...(clean.inApp || {}),
    types: inAppTypes as NotificationPreferences['inApp']['types'],
  }
  return clean
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
  const merged = sanitizePreferences(mergeDeep(DEFAULT_PREFERENCES, existing || {}) as NotificationPreferences)
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
    const merged = sanitizePreferences(mergeDeep(preferences, updates) as NotificationPreferences)
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
