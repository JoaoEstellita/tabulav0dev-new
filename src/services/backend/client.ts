import { auth, getAppCheckToken } from '../../config/firebase'
import { onAuthStateChanged, type User } from 'firebase/auth'

const rawBackendUrl = process.env.EXPO_PUBLIC_BACKEND_URL || ''

export const getBackendBaseUrl = () => rawBackendUrl.replace(/\/$/, '')

export const getAuthHeader = async () => {
  const waitForUser = async (timeoutMs = 2500): Promise<User | null> => {
    if (auth.currentUser) return auth.currentUser
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
    }
  }
  if (withAppCheck) {
    const appCheckToken = await getAppCheckToken()
    if (appCheckToken) {
      mergedHeaders.set('X-Firebase-AppCheck', appCheckToken)
    }
  }

  return fetch(`${base}${path}`, {
    ...rest,
    headers: mergedHeaders,
  })
}
