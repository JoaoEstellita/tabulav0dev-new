import { backendFetch } from './backend/client'

export type PublicProfile = {
  uid: string
  displayName: string
  photoURL: string | null
  sunSign: string | null
  moonSign: string | null
  ascSign: string | null
  city: string | null
}

async function post(action: string, payload: Record<string, unknown>): Promise<any> {
  const res = await backendFetch(`/api/discovery?action=${action}`, {
    auth: true,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  try { return await res.json() } catch { return { ok: false, error: 'parse' } }
}

/** Liga/desliga o "quero ser encontrado" (publica/despublica o perfil público). */
export function setDiscoverable(enabled: boolean) {
  return post('set-discoverable', { enabled })
}

/** Busca perfis por prefixo do nome + filtros opcionais. */
export async function searchProfiles(term: string, opts?: { city?: string; sunSign?: string }): Promise<PublicProfile[]> {
  const r = await post('search', { term, city: opts?.city || null, sunSign: opts?.sunSign || null })
  return Array.isArray(r?.results) ? r.results : []
}

export async function getPublicProfile(uid: string): Promise<PublicProfile | null> {
  const r = await post('get-profile', { uid })
  return r?.ok ? r.profile : null
}
