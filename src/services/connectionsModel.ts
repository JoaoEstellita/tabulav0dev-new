// Modelo PURO das conexões (sem dependências) — testável sem puxar firebase.
// Espelha o backend (lib/connections/model.js).

export type ConnectionStatus = 'pending' | 'accepted' | 'declined' | 'blocked'

export type Connection = {
  id: string
  other: string
  status: ConnectionStatus
  requestedBy: string
  originGroupId: string | null
  otherName: string | null
  otherPhoto: string | null
  iShared: boolean
  otherWhatsapp: string | null
}

/** id determinístico da dupla — uids ordenados. null se for a mesma pessoa/vazio. */
export function connectionId(a: string, b: string): string | null {
  if (!a || !b || a === b) return null
  return [a, b].sort().join('_')
}
