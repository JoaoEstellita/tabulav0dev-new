import { backendFetch } from './backend/client'

export type PublicProfile = {
  uid: string
  displayName: string
  photoURL: string | null
  sunSign: string | null
  moonSign: string | null
  ascSign: string | null
  city: string | null
}

async function post(action: string, payload: Record<string, unknown>): Promise<any> {
  const res = await backendFetch(`/api/discovery?action=${action}`, {
    auth: true,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
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
