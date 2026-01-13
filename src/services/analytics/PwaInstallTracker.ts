import { auth, db } from '../../config/firebase'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'

type PwaEventType = 'install' | 'install_click'

type PwaEventPayload = {
  type: PwaEventType
  source?: string
  path?: string
  userAgent?: string
  platform?: string
  metadata?: Record<string, unknown>
  occurredAt?: string
}

const INSTALL_ID_KEY = 'pwa_install_id'
const INSTALL_LOGGED_KEY = 'pwa_install_logged'
const PENDING_EVENT_KEY = 'pwa_install_pending'

let trackerInitialized = false

const getInstallId = () => {
  if (typeof window === 'undefined') return 'server'
  const existing = window.localStorage.getItem(INSTALL_ID_KEY)
  if (existing) return existing
  const next = (typeof crypto !== 'undefined' && crypto.randomUUID)
    ? crypto.randomUUID()
    : `pwa_${Date.now()}_${Math.random().toString(16).slice(2)}`
  window.localStorage.setItem(INSTALL_ID_KEY, next)
  return next
}

const setPendingEvent = (payload: PwaEventPayload) => {
  if (typeof window === 'undefined') return
  const snapshot = {
    ...payload,
    occurredAt: payload.occurredAt || new Date().toISOString(),
  }
  window.localStorage.setItem(PENDING_EVENT_KEY, JSON.stringify(snapshot))
}

const consumePendingEvent = () => {
  if (typeof window === 'undefined') return null
  const raw = window.localStorage.getItem(PENDING_EVENT_KEY)
  if (!raw) return null
  window.localStorage.removeItem(PENDING_EVENT_KEY)
  try {
    return JSON.parse(raw) as PwaEventPayload
  } catch {
    return null
  }
}

const writeEvent = async (uid: string, payload: PwaEventPayload) => {
  const installId = getInstallId()
  const base = {
    installId,
    userAgent: payload.userAgent || (typeof navigator !== 'undefined' ? navigator.userAgent : ''),
    platform: payload.platform || (typeof navigator !== 'undefined' ? navigator.platform : ''),
    path: payload.path || (typeof window !== 'undefined' ? window.location.pathname : ''),
    source: payload.source || 'unknown',
    metadata: payload.metadata || {},
  }

  if (payload.type === 'install') {
    const installRef = doc(db, 'users', uid, 'pwaInstalls', installId)
    await setDoc(
      installRef,
      {
        ...base,
        installedAt: serverTimestamp(),
      },
      { merge: true }
    )
  }

  const eventRef = doc(
    db,
    'users',
    uid,
    'pwaInstallEvents',
    `${payload.type}_${installId}_${Date.now()}`
  )
  await setDoc(
    eventRef,
    {
      ...base,
      type: payload.type,
      occurredAt: serverTimestamp(),
    },
    { merge: true }
  )
}

const logWithUser = async (payload: PwaEventPayload) => {
  const user = auth.currentUser
  if (!user) {
    setPendingEvent(payload)
    return
  }
  await writeEvent(user.uid, payload)
}

export const initPwaInstallTracking = () => {
  if (trackerInitialized || typeof window === 'undefined') return
  trackerInitialized = true

  auth.onAuthStateChanged(async (user) => {
    if (!user) return
    const pending = consumePendingEvent()
    if (pending) {
      await writeEvent(user.uid, pending)
    }
  })
}

export const trackPwaInstalled = async (source: string) => {
  if (typeof window === 'undefined') return
  if (window.localStorage.getItem(INSTALL_LOGGED_KEY) === 'true') return
  window.localStorage.setItem(INSTALL_LOGGED_KEY, 'true')
  await logWithUser({
    type: 'install',
    source,
    path: window.location.pathname,
  })
}

export const trackPwaInstallClick = async (source: string, metadata?: Record<string, unknown>) => {
  await logWithUser({
    type: 'install_click',
    source,
    path: typeof window !== 'undefined' ? window.location.pathname : '',
    metadata,
  })
}
