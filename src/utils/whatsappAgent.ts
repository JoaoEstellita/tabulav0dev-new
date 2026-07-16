import { Linking } from 'react-native'

// Número do Astrólogo Tábula no WhatsApp (Meta Cloud API)
export const WHATSAPP_AGENT_NUMBER = (
  process.env.EXPO_PUBLIC_WHATSAPP_AGENT_NUMBER || '5522988237163'
).replace(/\D/g, '')

/**
 * Mensagens pré-preenchidas por origem.
 *
 * Curtas e em primeira pessoa de propósito: a pessoa VÊ o texto antes de enviar,
 * e uma mensagem longa/vendedora parece que não foi ela quem escreveu. Todas
 * começam com "Oi" — isso dispara a regra de ABERTURA DO DIA do agente, que
 * responde com o panorama completo (score, áreas e trânsitos).
 */
export const WHATSAPP_AGENT_MESSAGES = {
  /** Banner da Home — primeiro contato, tom de descoberta. */
  discovery: 'Oi! Quero conhecer meu astrólogo ✨',
  /** Configurações — uso recorrente, vai direto ao ponto. */
  settings: 'Oi! Como está meu dia hoje?',
} as const

export type WhatsAppAgentOrigin = keyof typeof WHATSAPP_AGENT_MESSAGES

/** Abre a conversa com o agente. Usado pelo banner da Home e por Configurações. */
export function openWhatsAppAgent(origin: WhatsAppAgentOrigin = 'settings') {
  const text = WHATSAPP_AGENT_MESSAGES[origin] || WHATSAPP_AGENT_MESSAGES.settings
  const url = `https://wa.me/${WHATSAPP_AGENT_NUMBER}?text=${encodeURIComponent(text)}`
  return Linking.openURL(url).catch(() => {})
}
