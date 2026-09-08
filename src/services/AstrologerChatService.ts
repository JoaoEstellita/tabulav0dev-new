import { backendFetch } from './backend/client'

export type ChatCard =
  | { type: 'natal_wheel' }
  | { type: 'action'; action: 'momento' | 'forecast' | 'groups'; label: string }
export type ChatQuota = {
  dailyRemaining?: number
  dailyLimit?: number
  monthlyRemaining?: number
  unlimited?: boolean       // admin — sem teto, esconde saldo
  isPremium?: boolean
  isPaidPremium?: boolean    // assinante pagante → saldo + "comprar mais"; senão "assinar"
}
export type ChatReply = { reply: string; quickReplies?: string[]; cards?: ChatCard[]; quota?: ChatQuota; status?: string; error?: string }

/** Hint pro badge do FAB: há novidade real (leitura do dia fresca)? */
export async function getAstrologerHint(): Promise<boolean> {
  return (await getAstrologerState()).hasNews
}

/** Estado do chat na abertura: novidade do dia (badge) + saldo/entitlement (cabeçalho). */
export async function getAstrologerState(): Promise<{ hasNews: boolean; quota: ChatQuota | null }> {
  try {
    const res = await backendFetch('/api/app-chat', { auth: true, method: 'GET' })
    if (!res.ok) return { hasNews: false, quota: null }
    const j = await res.json()
    return { hasNews: !!j.hasNews, quota: (j.quota && typeof j.quota === 'object') ? j.quota : null }
  } catch { return { hasNews: false, quota: null } }
}

/**
 * Fala com o Astrólogo (agente) DENTRO do app — mesmo cérebro/cota/memória do
 * WhatsApp, keyed por uid (auth Firebase). Sem taxa Meta.
 */
export async function sendToAstrologer(message: string): Promise<ChatReply> {
  try {
    const res = await backendFetch('/api/app-chat', {
      auth: true,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    })
    if (res.status === 429) {
      const j = await res.json().catch(() => ({} as any))
      return { reply: j.reply || 'Você atingiu o limite de conversas por hoje 🌙', error: 'rate_limited' }
    }
    if (!res.ok) return { reply: 'Tive uma instabilidade agora 🌙 me manda de novo daqui a pouco.', error: 'http_' + res.status }
    const j = await res.json()
    return { reply: j.reply || '', quickReplies: Array.isArray(j.quickReplies) ? j.quickReplies : undefined, cards: Array.isArray(j.cards) ? j.cards : undefined, quota: j.quota, status: j.status }
  } catch {
    return { reply: 'Não consegui te responder agora. Confere sua conexão e tenta de novo 🌙', error: 'network' }
  }
}
