import AsyncStorage from '@react-native-async-storage/async-storage'
import { applyRuntimeStatusThresholds } from '../../constants/statusThresholds'

const BACKEND_URL = (process.env.EXPO_PUBLIC_BACKEND_URL || '').replace(/\/$/, '')
const POLICY_CACHE_KEY = 'status_policy_cache_v1'
const POLICY_CACHE_TTL_MS = 12 * 60 * 60 * 1000

type StatusPolicyPayload = {
  ok?: boolean
  policyVersion?: string
  thresholds?: {
    criticalBelow?: number
    positiveAbove?: number
  }
}

let sessionInitialized = false
let inFlight: Promise<StatusPolicyPayload | null> | null = null

const readCache = async () => {
  try {
    const raw = await AsyncStorage.getItem(POLICY_CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as { fetchedAt?: number; payload?: StatusPolicyPayload }
    const fetchedAt = Number(parsed?.fetchedAt || 0)
    if (!fetchedAt || Date.now() - fetchedAt > POLICY_CACHE_TTL_MS) return null
    return parsed?.payload || null
  } catch {
    return null
  }
}

const writeCache = async (payload: StatusPolicyPayload) => {
  try {
    await AsyncStorage.setItem(
      POLICY_CACHE_KEY,
      JSON.stringify({ fetchedAt: Date.now(), payload })
    )
  } catch {
    // ignore cache errors
  }
}

const fetchPolicy = async () => {
  if (!BACKEND_URL) return null
  const resp = await fetch(`${BACKEND_URL}/api/status-policy`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })
  if (!resp.ok) return null
  const payload = (await resp.json()) as StatusPolicyPayload
  if (!payload?.ok || !payload?.thresholds) return null
  return payload
}

export const ensureStatusPolicyLoaded = async () => {
  if (sessionInitialized) return
  if (inFlight) {
    await inFlight
    return
  }
  inFlight = (async () => {
    const cached = await readCache()
    if (cached?.thresholds) {
      applyRuntimeStatusThresholds(cached.thresholds)
      sessionInitialized = true
      return cached
    }

    const remote = await fetchPolicy()
    if (remote?.thresholds) {
      applyRuntimeStatusThresholds(remote.thresholds)
      await writeCache(remote)
    }
    sessionInitialized = true
    return remote
  })()

  try {
    await inFlight
  } finally {
    inFlight = null
  }
}

