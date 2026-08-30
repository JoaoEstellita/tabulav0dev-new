import { backendFetch } from './backend/client'

// Momento Certo (eletiva pessoal). Janelas ranqueadas por intenção.
export type MomentoReason = { planet: string; aspect: string | null; target: string | null }
// Bandeira de regra clássica (F2a): Lua vazia / retrógrado.
export type MomentoFlag = { code: 'moonVoid' | 'retro'; planet?: string }
export type MomentoWindow = { dateISO: string; score: number; reasons: MomentoReason[]; cautions: (MomentoReason | MomentoFlag)[]; hourFromISO?: string; hourToISO?: string }
export type MomentoIntention = 'amor' | 'carreira' | 'decisao' | 'conversa' | 'saude' | 'viagem' | 'lancar' | 'contrato'
export type MomentoResult = { windows: MomentoWindow[]; alertEnabled?: boolean; gated?: boolean; error?: string }

export async function getMomento(uid: string, intention: MomentoIntention): Promise<MomentoResult> {
  try {
    const res = await backendFetch(
      `/api/momento-certo?userId=${encodeURIComponent(uid)}&intention=${intention}`,
      { method: 'GET', auth: true, timeoutMs: 25000, headers: { 'Content-Type': 'application/json' } },
    )
    if (res.status === 402) return { windows: [], gated: true }
    if (!res.ok) return { windows: [], error: 'http_' + res.status }
    const data = await res.json()
    return { windows: Array.isArray(data?.windows) ? data.windows : [], alertEnabled: data?.alert?.enabled === true }
  } catch {
    return { windows: [], error: 'network' }
  }
}

/** Liga/desliga o alerta "janela abrindo" (push) para a intenção dada. */
export async function setMomentoAlert(uid: string, intention: MomentoIntention, enabled: boolean): Promise<boolean> {
  try {
    const res = await backendFetch(
      `/api/momento-certo?userId=${encodeURIComponent(uid)}`,
      {
        method: 'POST', auth: true, timeoutMs: 15000,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: uid, action: 'set-alert', intention, enabled }),
      },
    )
    if (!res.ok) return false
    const data = await res.json()
    return data?.alert?.enabled === true
  } catch {
    return false
  }
}
