import { backendFetch } from './backend/client'
import type { Connection } from './connectionsModel'
export { connectionId } from './connectionsModel'
export type { Connection, ConnectionStatus } from './connectionsModel'

async function post(action: string, payload: Record<string, unknown>): Promise<any> {
  const res = await backendFetch(`/api/connections?action=${action}`, {
    auth: true,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  try { return await res.json() } catch { return { ok: false, error: 'parse' } }
}

export function requestConnection(to: string, originGroupId: string | null, shareWhatsapp: boolean) {
  return post('request', { to, originGroupId, shareWhatsapp })
}
export function respondConnection(withUid: string, accept: boolean, shareWhatsapp: boolean) {
  return post('respond', { withUid, accept, shareWhatsapp })
}
export function shareWhatsapp(withUid: string) {
  return post('share-wa', { withUid })
}
export function blockConnection(withUid: string, report?: string) {
  return post(report ? 'report' : 'block', { withUid, reason: report || null })
}
export async function listConnections(): Promise<{ ok: boolean; connections: Connection[] }> {
  const r = await post('list', {})
  return { ok: !!r?.ok, connections: Array.isArray(r?.connections) ? r.connections : [] }
}
