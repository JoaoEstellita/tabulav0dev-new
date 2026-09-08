import { Platform } from 'react-native'
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
export type ChatInboxItem = {
  id: string
  type: string
  text: string
  cta?: { label: string; action?: string | null; deepLink?: string } | null
  deepLink?: string
  kind?: 'message' | 'rating' | 'match'
}
export type AstrologerState = { hasNews: boolean; quota: ChatQuota | null; unread: number; inbox: ChatInboxItem[] }

/** Hint pro badge do FAB: quantas não-lidas (0 = sem badge). Compat: também há novidade do dia. */
export async function getAstrologerUnread(): Promise<number> {
  return (await getAstrologerState()).unread
}
/** Compat antiga (bool). */
export async function getAstrologerHint(): Promise<boolean> {
  const st = await getAstrologerState()
  return st.hasNews || st.unread > 0
}

/** Estado do chat na abertura: novidade + saldo/entitlement (cabeçalho) + inbox (proativas). */
export async function getAstrologerState(): Promise<AstrologerState> {
  try {
    const res = await backendFetch('/api/app-chat', { auth: true, method: 'GET' })
    if (!res.ok) return { hasNews: false, quota: null, unread: 0, inbox: [] }
    const j = await res.json()
    return {
      hasNews: !!j.hasNews,
      quota: (j.quota && typeof j.quota === 'object') ? j.quota : null,
      unread: typeof j.unread === 'number' ? j.unread : 0,
      inbox: Array.isArray(j.inbox) ? j.inbox : [],
    }
  } catch { return { hasNews: false, quota: null, unread: 0, inbox: [] } }
}

/** Marca proativas da inbox como lidas (some o número do ícone). ids vazio = todas. */
export async function markAstrologerInboxRead(ids?: string[]): Promise<void> {
  try {
    await backendFetch('/api/app-chat', {
      auth: true, method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ack: ids && ids.length ? ids : true }),
    })
  } catch { /* best-effort */ }
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
      // platform: no APK Android o backend fica Play-safe (sem PIX/preço/steering);
      // no PWA (web) mantém o checkout completo.
      body: JSON.stringify({ message, platform: Platform.OS }),
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
