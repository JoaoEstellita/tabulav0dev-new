import { backendFetch } from './backend/client'

export type ChatCard =
  | { type: 'natal_wheel' }
  | { type: 'action'; action: 'momento' | 'forecast' | 'groups'; label: string }
export type ChatReply = { reply: string; quickReplies?: string[]; cards?: ChatCard[]; status?: string; error?: string }

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
    return { reply: j.reply || '', quickReplies: Array.isArray(j.quickReplies) ? j.quickReplies : undefined, cards: Array.isArray(j.cards) ? j.cards : undefined, status: j.status }
  } catch {
    return { reply: 'Não consegui te responder agora. Confere sua conexão e tenta de novo 🌙', error: 'network' }
  }
}
