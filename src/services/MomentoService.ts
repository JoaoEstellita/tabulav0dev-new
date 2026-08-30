import { backendFetch } from './backend/client'

// Momento Certo (eletiva pessoal). Janelas ranqueadas por intenção.
export type MomentoReason = { planet: string; aspect: string | null; target: string | null }
// Bandeira de regra clássica (F2a): Lua vazia / retrógrado.
export type MomentoFlag = { code: 'moonVoid' | 'retro'; planet?: string }
export type MomentoWindow = { dateISO: string; score: number; reasons: MomentoReason[]; cautions: (MomentoReason | MomentoFlag)[]; hourFromISO?: string; hourToISO?: string }
export type MomentoIntention = 'amor' | 'carreira' | 'decisao' | 'conversa'
export type MomentoResult = { windows: MomentoWindow[]; gated?: boolean; error?: string }

export async function getMomento(uid: string, intention: MomentoIntention): Promise<MomentoResult> {
  try {
    const res = await backendFetch(
      `/api/momento-certo?userId=${encodeURIComponent(uid)}&intention=${intention}`,
      { method: 'GET', auth: true, timeoutMs: 25000, headers: { 'Content-Type': 'application/json' } },
    )
    if (res.status === 402) return { windows: [], gated: true }
    if (!res.ok) return { windows: [], error: 'http_' + res.status }
    const data = await res.json()
    return { windows: Array.isArray(data?.windows) ? data.windows : [] }
  } catch {
    return { windows: [], error: 'network' }
  }
}
