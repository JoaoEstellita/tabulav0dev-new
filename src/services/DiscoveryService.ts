import { backendFetch } from './backend/client'

export type PublicProfile = {
  uid: string
  displayName: string
  photoURL: string | null
  sunSign: string | null
  moonSign: string | null
  ascSign: string | null
  city: string | null
  photos?: string[]
  interests?: string[]
  bio?: string | null
  prompts?: Record<string, string>
  gender?: 'm' | 'f' | 'nb' | null
  age?: number | null
}
export type Gender = 'm' | 'f' | 'nb'
export type Seeking = 'm' | 'f' | 'all'

async function post(action: string, payload: Record<string, unknown>): Promise<any> {
  const res = await backendFetch(`/api/discovery?action=${action}`, {
    auth: true,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  // 402 = seção só para assinantes/trial → o cliente cai no paywall.
  if (res.status === 402) return { ok: false, gated: true }
  try { return await res.json() } catch { return { ok: false, error: 'parse' } }
}

/** Liga/desliga a visibilidade na Rede (publica/despublica o perfil público). */
export function setDiscoverable(enabled: boolean) {
  return post('set-discoverable', { enabled })
}

/**
 * Garante que o meu perfil está na vitrine (opt-out: entra visível na 1ª vez,
 * respeitando quem já se ocultou). Devolve o estado atual de visibilidade.
 */
export async function ensureSelfDiscoverable(force = false): Promise<{ discoverable: boolean; published: boolean }> {
  const r = await post('ensure-self', force ? { force: true } : {})
  return { discoverable: !!r?.discoverable, published: !!r?.published }
}

/** Diretório da Rede: todas as pessoas visíveis (menos eu). Cache TTL de 2min
 * para não reler ~200 docs a cada remontagem; `force` (pull-refresh) ignora. */
let _peopleCache: { at: number; data: PublicProfile[] } | null = null
const PEOPLE_TTL = 120000
export async function listPeople(force = false): Promise<PublicProfile[]> {
  if (!force && _peopleCache && Date.now() - _peopleCache.at < PEOPLE_TTL) return _peopleCache.data
  const r = await post('list', {})
  const data = Array.isArray(r?.results) ? r.results : []
  _peopleCache = { at: Date.now(), data }
  return data
}

/** Busca perfis por prefixo do nome + filtros opcionais. */
export async function searchProfiles(term: string, opts?: { city?: string; sunSign?: string }): Promise<PublicProfile[]> {
  const r = await post('search', { term, city: opts?.city || null, sunSign: opts?.sunSign || null })
  return Array.isArray(r?.results) ? r.results : []
}

export async function getPublicProfile(uid: string): Promise<PublicProfile | null> {
  const r = await post('get-profile', { uid })
  return r?.ok ? r.profile : null
}

export type ProfileInput = { photos: string[]; interests: string[]; bio: string; prompts?: Record<string, string>; gender?: Gender | null; seeking?: Seeking | null }

/** Meu próprio perfil estendido (pro editor). `gated` se não for assinante/trial. */
export async function getMyProfile(): Promise<{ profile: PublicProfile | null; discoverable: boolean; gated?: boolean }> {
  const r = await post('my-profile', {})
  if (r?.gated) return { profile: null, discoverable: false, gated: true }
  return { profile: r?.profile || null, discoverable: !!r?.discoverable }
}

/** Salva o perfil estendido (fotos/interesses/bio). `gated` se não for assinante/trial. */
export async function setProfile(input: ProfileInput): Promise<{ ok: boolean; gated?: boolean; profile?: ProfileInput }> {
  const r = await post('set-profile', input)
  return { ok: !!r?.ok, gated: !!r?.gated, profile: r?.profile }
}

export type SynastryAspect = { mine: string; theirs: string; aspect: string; orb: number }
export type SynastryResult = {
  premium: boolean
  target?: PublicProfile
  score?: number | null
  aspects?: SynastryAspect[]
}
/** Sinastria par-a-par (PAGA). Grátis recebe só o alvo + premium:false. */
export async function getSynastry(uid: string): Promise<SynastryResult> {
  const r = await post('synastry', { uid })
  return {
    premium: !!r?.premium,
    target: r?.target,
    score: r?.score ?? null,
    aspects: Array.isArray(r?.aspects) ? r.aspects : undefined,
  }
}

export type MatchProfile = PublicProfile & { score: number }
export type MatchResult = {
  premium: boolean
  results?: MatchProfile[]   // só premium: ranking completo
  preview?: MatchProfile[]   // top 3 com %, isca — grátis e pago
  teaser?: number            // não-premium: quantos matches fortes
  total?: number
}
// ─── Fase 2: baralho (deck), swipe e matches ────────────────────────────────
export type AffinityTier = 'altissima' | 'alta' | 'boa' | 'moderada' | 'baixa'
export type DeckCard = PublicProfile & { score: number; tier: AffinityTier; harmonics: string[]; tensions: string[]; common: string[] }
export type DeckFilters = { city?: string; element?: string; minAge?: number; maxAge?: number; interests?: string[] }

/** Baralho de descoberta (cards ordenados por sinastria). `gated` se não assinante/trial. */
export async function getDeck(filters?: DeckFilters, limit = 10): Promise<{ cards: DeckCard[]; gated?: boolean }> {
  const r = await post('deck', { filters: filters || {}, limit })
  if (r?.gated) return { cards: [], gated: true }
  return { cards: Array.isArray(r?.cards) ? r.cards : [] }
}

/** Curte (like) ou passa. Like recíproco devolve `matched:true`. */
export async function swipe(uid: string, action: 'like' | 'pass'): Promise<{ ok: boolean; matched: boolean; gated?: boolean }> {
  const r = await post('swipe', { uid, action })
  return { ok: !!r?.ok, matched: !!r?.matched, gated: !!r?.gated }
}

export type MatchRow = { uid: string; displayName: string; photoURL: string | null; age?: number | null; city?: string | null; score?: number | null; whatsapp?: string | null; iShared?: boolean }
/** Meus matches (like mútuo). WhatsApp só quando ambos liberaram. */
export async function getMyMatches(): Promise<{ matches: MatchRow[]; gated?: boolean }> {
  const r = await post('my-matches', {})
  if (r?.gated) return { matches: [], gated: true }
  return { matches: Array.isArray(r?.matches) ? r.matches : [] }
}

/** Ranking "quem mais combina" (Pro/Premium). Grátis recebe preview (top 3) + teaser. */
export async function getMatches(): Promise<MatchResult> {
  const r = await post('match', {})
  return {
    premium: !!r?.premium,
    results: Array.isArray(r?.results) ? r.results : undefined,
    preview: Array.isArray(r?.preview) ? r.preview : undefined,
    teaser: typeof r?.teaser === 'number' ? r.teaser : undefined,
    total: typeof r?.total === 'number' ? r.total : undefined,
  }
}
