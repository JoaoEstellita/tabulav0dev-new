import { backendFetch } from './backend/client'

// Atribuição de parceria (influencer). First-touch: o 1º código capturado vence.
const REF_KEY = 'tabula_partner_ref'

function clean(raw: string | null | undefined): string {
  return String(raw || '').trim().toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 40)
}
function readStore(): string | null {
  try { return typeof localStorage !== 'undefined' ? localStorage.getItem(REF_KEY) : null } catch { return null }
}
function writeStore(code: string): void {
  try { if (typeof localStorage !== 'undefined' && !localStorage.getItem(REF_KEY)) localStorage.setItem(REF_KEY, code) } catch { /* noop */ }
}
function dropStore(): void {
  try { if (typeof localStorage !== 'undefined') localStorage.removeItem(REF_KEY) } catch { /* noop */ }
}

/** Captura `?ref=` (ou `?parceria=`) da URL na 1ª visita — só web. */
export function captureReferralFromUrl(): void {
  try {
    if (typeof window === 'undefined' || !window.location?.search) return
    const p = new URLSearchParams(window.location.search)
    const code = clean(p.get('ref') || p.get('parceria'))
    if (code) writeStore(code)
  } catch { /* noop */ }
}

/** Define o código manualmente (app: campo de parceria no cadastro). */
export function setReferralCode(code: string): void {
  const c = clean(code)
  if (c) writeStore(c)
}

/** Atribui a parceria ao usuário logado (1x). Limpa o código quando resolvido. */
export async function attributeReferralIfAny(uid: string): Promise<void> {
  const code = readStore()
  if (!code || !uid) return
  try {
    const res = await backendFetch('/api/referral', {
      method: 'POST', auth: true, timeoutMs: 12000,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    })
    // Atribuído, já-tinha (200) ou parceiro inexistente/ inválido (404/400) → não retenta.
    if (res.ok || res.status === 404 || res.status === 400) dropStore()
  } catch { /* rede: mantém pra tentar no próximo login */ }
}
