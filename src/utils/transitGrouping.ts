/**
 * Agrupa trânsitos por horizonte de tempo, no espírito do que o Personare faz:
 * separar "o que começou agora" de "o que já vinha" e de "o que vai durar anos".
 *
 * Usa só dados que já existem em `personalTodayRich` (window + strength) — não
 * há cálculo astrológico novo aqui.
 */

export type TransitBucket = 'highlight' | 'recent' | 'active' | 'longTerm'

/** Começou nos últimos N dias → "Mudanças recentes na vida". */
export const RECENT_DAYS = 7
/** Janela acima de N dias → "Tendências de longo prazo". */
export const LONG_TERM_DAYS = 90

type AnyTransit = {
  strength?: number
  window?: { start?: string; exact?: string; end?: string; days?: number }
}

function diasDesde(iso?: string): number | null {
  if (!iso) return null
  const t = new Date(iso).getTime()
  if (!Number.isFinite(t)) return null
  return (Date.now() - t) / 86400000
}

function duracaoEmDias(t: AnyTransit): number | null {
  const d = Number(t?.window?.days)
  if (Number.isFinite(d) && d > 0) return d
  const ini = t?.window?.start ? new Date(t.window.start).getTime() : NaN
  const fim = t?.window?.end ? new Date(t.window.end).getTime() : NaN
  if (Number.isFinite(ini) && Number.isFinite(fim)) return (fim - ini) / 86400000
  return null
}

export function classifyTransit(t: AnyTransit): Exclude<TransitBucket, 'highlight'> {
  const duracao = duracaoEmDias(t)
  if (duracao !== null && duracao > LONG_TERM_DAYS) return 'longTerm'

  // "Recente" só vale para quem realmente começou há pouco. Um trânsito de anos
  // que passou a valer ontem é de longo prazo, não uma mudança recente — por isso
  // a duração é checada antes.
  const inicio = diasDesde(t?.window?.start)
  if (inicio !== null && inicio >= 0 && inicio <= RECENT_DAYS) return 'recent'

  return 'active'
}

/**
 * Separa a lista em destaque (o de maior força) + os três baldes de tempo.
 * A lista de entrada deve vir já deduplicada e ordenada por força.
 */
export function groupTransits<T extends AnyTransit>(lista: T[]) {
  const grupos: { highlight: T | null; recent: T[]; active: T[]; longTerm: T[] } = {
    highlight: null,
    recent: [],
    active: [],
    longTerm: [],
  }
  if (!Array.isArray(lista) || lista.length === 0) return grupos

  // Destaque = maior força. Sai dos baldes para não aparecer duas vezes.
  let destaque = lista[0]
  for (const t of lista) {
    if ((Number(t?.strength) || 0) > (Number(destaque?.strength) || 0)) destaque = t
  }
  grupos.highlight = destaque

  for (const t of lista) {
    if (t === destaque) continue
    grupos[classifyTransit(t)].push(t)
  }
  return grupos
}
