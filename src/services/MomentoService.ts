import { backendFetch } from './backend/client'

// Momento Certo (eletiva pessoal). Janelas ranqueadas por intenção.
export type MomentoReason = { planet: string; aspect: string | null; target: string | null }
// Bandeira de regra clássica (F2a): Lua vazia / retrógrado.
export type MomentoFlag = { code: 'moonVoid' | 'retro'; planet?: string }
export type MomentoWindow = { dateISO: string; score: number; reasons: MomentoReason[]; cautions: (MomentoReason | MomentoFlag)[]; hourFromISO?: string; hourToISO?: string; pctA?: number | null; pctB?: number | null }
export type MomentoIntention = 'amor' | 'carreira' | 'decisao' | 'conversa' | 'saude' | 'viagem' | 'lancar' | 'contrato'
export type MomentoResult = { windows: MomentoWindow[]; alertEnabled?: boolean; notComputed?: boolean; gated?: boolean; error?: string }

/** `cacheOnly`: só lê cache do dia (não dispara o motor) — usado pelo card da Home. */
export async function getMomento(uid: string, intention: MomentoIntention, opts?: { cacheOnly?: boolean }): Promise<MomentoResult> {
  try {
    const q = `/api/momento-certo?userId=${encodeURIComponent(uid)}&intention=${intention}${opts?.cacheOnly ? '&cacheOnly=1' : ''}`
    const res = await backendFetch(
      q,
      { method: 'GET', auth: true, timeoutMs: opts?.cacheOnly ? 8000 : 25000, headers: { 'Content-Type': 'application/json' } },
    )
    if (res.status === 402) return { windows: [], gated: true }
    if (!res.ok) return { windows: [], error: 'http_' + res.status }
    const data = await res.json()
    return { windows: Array.isArray(data?.windows) ? data.windows : [], alertEnabled: data?.alert?.enabled === true, notComputed: data?.notComputed === true }
  } catch {
    return { windows: [], error: 'network' }
  }
}

export type MomentoOverview = Partial<Record<MomentoIntention, { dateISO: string; score: number } | null>>

/** Melhor dia por intenção (as 8 de uma vez) — painel de visão geral. */
export async function getMomentoOverview(uid: string): Promise<MomentoOverview> {
  try {
    const res = await backendFetch(
      `/api/momento-certo?userId=${encodeURIComponent(uid)}&overview=1`,
      { method: 'GET', auth: true, timeoutMs: 25000, headers: { 'Content-Type': 'application/json' } },
    )
    if (!res.ok) return {}
    const data = await res.json()
    return (data?.overview && typeof data.overview === 'object') ? data.overview : {}
  } catch {
    return {}
  }
}

export type MomentoPairResult = { windows: MomentoWindow[]; gated?: boolean; notConnected?: boolean; partnerNoBirth?: boolean; error?: string }

/** Momento Certo "pra vocês dois" — janelas boas pros dois de uma conexão aceita. */
export async function getMomentoPair(uid: string, partnerUid: string, intention: MomentoIntention): Promise<MomentoPairResult> {
  try {
    const res = await backendFetch(
      `/api/momento-certo?userId=${encodeURIComponent(uid)}&pair=${encodeURIComponent(partnerUid)}&intention=${intention}`,
      { method: 'GET', auth: true, timeoutMs: 30000, headers: { 'Content-Type': 'application/json' } },
    )
    if (res.status === 402) return { windows: [], gated: true }
    if (res.status === 403) return { windows: [], notConnected: true }
    if (!res.ok) {
      let err = 'http_' + res.status
      try { const d = await res.json(); if (d?.error) err = d.error } catch { /* noop */ }
      return { windows: [], partnerNoBirth: err === 'partner_missing_birth_data', error: err }
    }
    const data = await res.json()
    return { windows: Array.isArray(data?.windows) ? data.windows : [] }
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
