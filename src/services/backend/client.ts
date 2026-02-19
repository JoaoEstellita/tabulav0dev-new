import { auth, getAppCheckToken } from '../../config/firebase'
import { onAuthStateChanged, type User } from 'firebase/auth'

const rawBackendUrl = process.env.EXPO_PUBLIC_BACKEND_URL || ''

export const getBackendBaseUrl = () => rawBackendUrl.replace(/\/$/, '')

export const getAuthHeader = async () => {
  const waitForUser = async (timeoutMs = 8000): Promise<User | null> => {
    if (auth.currentUser) return auth.currentUser
    if (typeof (auth as any).authStateReady === 'function') {
      try {
        await (auth as any).authStateReady()
      } catch {}
      if (auth.currentUser) return auth.currentUser
    }
    return new Promise((resolve) => {
      let settled = false
      const timeout = setTimeout(() => {
        if (settled) return
        settled = true
        unsub()
        resolve(auth.currentUser || null)
      }, timeoutMs)
      const unsub = onAuthStateChanged(auth, (user) => {
        if (settled) return
        if (!user) return
        settled = true
        clearTimeout(timeout)
        unsub()
        resolve(user)
      })
    })
  }

  const current = await waitForUser()
  if (!current) return {}
  const token = await current.getIdToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

type BackendFetchOptions = RequestInit & {
  auth?: boolean
  appCheck?: boolean
}

export const backendFetch = async (path: string, options: BackendFetchOptions = {}) => {
  const base = getBackendBaseUrl()
  if (!base) {
    throw new Error('EXPO_PUBLIC_BACKEND_URL not configured')
  }

  const { auth: withAuth = false, appCheck: withAppCheck = true, headers, ...rest } = options
  const mergedHeaders = new Headers(headers || {})
  if (withAuth) {
    const authHeaders = await getAuthHeader()
    const authValue = authHeaders.Authorization
    if (authValue) {
      mergedHeaders.set('Authorization', authValue)
    } else {
      throw new Error('auth_required_missing_token')
    }
  }
  if (withAppCheck) {
    const appCheckToken = await getAppCheckToken()
    if (appCheckToken) {
      mergedHeaders.set('X-Firebase-AppCheck', appCheckToken)
    }
  }

  const requestInit: RequestInit = {
    ...rest,
    headers: mergedHeaders,
  }

  const doFetch = () => fetch(`${base}${path}`, requestInit)
  let response = await doFetch()

  // Retry once for stale auth sessions by forcing Firebase token refresh.
  if (withAuth && response.status === 401) {
    let shouldRetry = false
    try {
      const data = await response.clone().json().catch(() => null)
      const reason = typeof data?.reason === 'string' ? data.reason : ''
      const code = typeof data?.error === 'string' ? data.error : ''
      shouldRetry = reason === 'stale_auth_time' || code === 'stale_session'
    } catch {}

    if (shouldRetry && auth.currentUser) {
      try {
        const refreshed = await auth.currentUser.getIdToken(true)
        if (refreshed) {
          mergedHeaders.set('Authorization', `Bearer ${refreshed}`)
          response = await doFetch()
        }
      } catch {}
    }
  }

  return response
}
