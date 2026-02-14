import { auth } from '../../config/firebase'

const rawBackendUrl = process.env.EXPO_PUBLIC_BACKEND_URL || ''

export const getBackendBaseUrl = () => rawBackendUrl.replace(/\/$/, '')

export const getAuthHeader = async () => {
  const current = auth.currentUser
  if (!current) return {}
  const token = await current.getIdToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

type BackendFetchOptions = RequestInit & {
  auth?: boolean
}

export const backendFetch = async (path: string, options: BackendFetchOptions = {}) => {
  const base = getBackendBaseUrl()
  if (!base) {
    throw new Error('EXPO_PUBLIC_BACKEND_URL not configured')
  }

  const { auth: withAuth = false, headers, ...rest } = options
  const mergedHeaders = new Headers(headers || {})
  if (withAuth) {
    const authHeaders = await getAuthHeader()
    const authValue = authHeaders.Authorization
    if (authValue) {
      mergedHeaders.set('Authorization', authValue)
    }
  }

  return fetch(`${base}${path}`, {
    ...rest,
    headers: mergedHeaders,
  })
}
