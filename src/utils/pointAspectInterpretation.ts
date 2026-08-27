// Resolver de aspectos de PONTOS NOMEADOS (nódulos + ASC/MC) a planetas.
// Compõe significado-do-ponto + domínio-do-planeta + dinâmica-do-aspecto.
// Serve à grade natal (clique nos nódulos) e à seção Pontos Angulares (ASC/MC).
import { SR_PLANET_YEAR_DOMAIN } from '../data/solarReturnAspectComposer'
import { POINT_MEANING, POINT_ASPECT_DYNAMIC } from '../data/pointAspectComposer'

function normLang(language?: string | null): string {
  const l = String(language || 'pt-BR').trim()
  if (l.startsWith('en')) return 'en-US'
  if (l.startsWith('es')) return 'es-ES'
  if (l.startsWith('it')) return 'it-IT'
  return 'pt-BR'
}

function norm(value: string): string {
  return String(value || '').trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, '')
}

function normAspect(value: string): string {
  return norm(value)
    .replace(/conjunction|conjuncao|conjuncion|congiunzione/g, 'conjuncao')
    .replace(/sextile|sextil|sestile/g, 'sextil')
    .replace(/square|quadrature|cuadratura|quadratura/g, 'quadratura')
    .replace(/trine|trigono|trino/g, 'trigono')
    .replace(/opposition|oposicao|oposicion|opposizione/g, 'oposicao')
    .replace(/quincunx|quincuncio|quincuncion|quinconce|inconjunct/g, 'quincuncio')
}

// aliases dos pontos (o engine usa NorthNode/SouthNode/Ascendant/Midheaven)
const POINT_ALIAS: Record<string, string> = {
  northnode: 'northnode', nnode: 'northnode', nodonorte: 'northnode', truenode: 'northnode', meannode: 'northnode',
  southnode: 'southnode', snode: 'southnode', nodosul: 'southnode',
  ascendant: 'ascendant', asc: 'ascendant', ascendente: 'ascendant',
  midheaven: 'midheaven', mc: 'midheaven', meiodoceu: 'midheaven', mediocielo: 'midheaven',
}

/**
 * Texto de aspecto quando UM dos lados é ponto nomeado (nódulo/ASC/MC) e o outro é
 * planeta. Retorna null se nenhum lado é ponto nomeado ou o planeta não tem domínio.
 */
export function resolveNamedPointAspectText(
  a: string,
  aspect: string,
  b: string,
  language?: string | null,
): string | null {
  const lang = normLang(language)
  const na = POINT_ALIAS[norm(a)] || null
  const nb = POINT_ALIAS[norm(b)] || null

  // Um lado precisa ser ponto nomeado; o outro, planeta com domínio.
  let pointKey: string | null = null
  let planetKey: string | null = null
  if (na && !nb) { pointKey = na; planetKey = norm(b) }
  else if (nb && !na) { pointKey = nb; planetKey = norm(a) }
  else return null // nenhum ou ambos são pontos nomeados

  const domains = SR_PLANET_YEAR_DOMAIN[lang] || SR_PLANET_YEAR_DOMAIN['pt-BR']
  const domain = domains[planetKey]
  const point = (POINT_MEANING[lang] || POINT_MEANING['pt-BR'])[pointKey]
  const dyn = (POINT_ASPECT_DYNAMIC[lang] || POINT_ASPECT_DYNAMIC['pt-BR'])[normAspect(aspect)]
  if (!domain || !point || !dyn) return null

  return `${point} ${dyn.verb} ${domain}. ${dyn.advice}`
}
