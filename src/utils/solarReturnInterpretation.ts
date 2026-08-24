// Interpretações próprias do RETORNO SOLAR (RS).
// A carta do RS descreve o "ano astrológico" que se inicia no aniversário solar:
// os planetas do RS nas casas do RS mostram ONDE a energia do ano se concentra.
// Tom distinto do natal (que descreve a estrutura permanente da pessoa).
//
// Chave: sr:{planet}|house|{number}
// Planetas: sun, moon, mercury, venus, mars, jupiter, saturn, uranus, neptune, pluto
// Casas: 1–12
//
// Fallback: quando não há texto de RS curado para a combinação, cai no catálogo
// natal (resolveNatalPlanetInHouseText) para que a mecânica nunca fique vazia.
import { resolveNatalPlanetInHouseText, resolveSignInHouseText, resolveNatalPlanetAspectText, resolvePlanetInSignText } from './natalInterpretation'
import { SR_SIGN_FLAVOR, SR_SIGN_LINK } from '../data/solarReturnSignFlavor'
import { SOLAR_RETURN_PLANET_IN_HOUSE_PTBR_OVERRIDES } from '../data/solarReturnPlanetInHouseOverridesPtBR'
import { SOLAR_RETURN_PLANET_IN_HOUSE_I18N_OVERRIDES } from '../data/solarReturnPlanetInHouseOverridesI18n'
import { SOLAR_RETURN_ASCENDANT_PTBR_OVERRIDES, SOLAR_RETURN_ASCENDANT_I18N_OVERRIDES } from '../data/solarReturnAscendantOverrides'
import { SR_PLANET_YEAR_DOMAIN, SR_ASPECT_DYNAMIC, SR_ASPECT_LEAD } from '../data/solarReturnAspectComposer'
import { LUNAR_HOUSE_AREA, LUNAR_LEAD } from '../data/lunarReturnHouseArea'

function normalizeLanguage(language?: string | null): string {
  const l = String(language || 'pt-BR').trim()
  if (l.startsWith('en')) return 'en-US'
  if (l.startsWith('es')) return 'es-ES'
  if (l.startsWith('it')) return 'it-IT'
  return 'pt-BR'
}

function normalizePlanet(planet: string): string {
  return String(planet || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
}

function buildKey(planet: string, house: number): string | null {
  const p = normalizePlanet(planet)
  if (!p || !Number.isFinite(house) || house < 1 || house > 12) return null
  return `sr:${p}|house|${house}`
}

/**
 * Texto de Retorno Solar para "planeta na casa do RS".
 * Se não houver texto de RS curado, cai no catálogo natal (fallback seguro).
 */
export function resolveSolarReturnPlanetInHouseText(
  planet: string,
  house: number,
  language?: string | null,
): string | null {
  const key = buildKey(planet, house)
  const lang = normalizeLanguage(language)

  if (key) {
    const srText =
      lang === 'pt-BR'
        ? SOLAR_RETURN_PLANET_IN_HOUSE_PTBR_OVERRIDES[key]
        : SOLAR_RETURN_PLANET_IN_HOUSE_I18N_OVERRIDES[lang]?.[key]
    if (srText && srText.trim().length >= 50) return srText.trim()
  }

  // Fallback: catálogo natal, para nunca deixar a interpretação vazia.
  return resolveNatalPlanetInHouseText(planet, house, language)
}

function normalizeSign(sign: string): string {
  return String(sign || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
}

/**
 * Texto do Ascendente do Retorno Solar = o "tom do ano".
 * Fallback: catálogo signo-na-casa-1 (resolveSignInHouseText) quando não curado.
 */
export function resolveSolarReturnAscendantText(
  sign: string,
  language?: string | null,
): string | null {
  const key = `srasc:${normalizeSign(sign)}`
  const lang = normalizeLanguage(language)

  const srText =
    lang === 'pt-BR'
      ? SOLAR_RETURN_ASCENDANT_PTBR_OVERRIDES[key]
      : SOLAR_RETURN_ASCENDANT_I18N_OVERRIDES[lang]?.[key]
  if (srText && srText.trim().length >= 50) return srText.trim()

  return resolveSignInHouseText(sign, 1, language)
}

function normalizeAspect(value: string): string {
  return String(value || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, '')
    .replace(/conjunction|conjuncao|conjuncion|congiunzione/g, 'conjuncao')
    .replace(/sextile|sextil|sestile/g, 'sextil')
    .replace(/square|quadrature|cuadratura|quadratura/g, 'quadratura')
    .replace(/trine|trigono|trino/g, 'trigono')
    .replace(/opposition|oposicao|oposicion|opposizione/g, 'oposicao')
}

/**
 * Texto de aspecto do Retorno Solar, COMPOSTO a partir do domínio-do-ano de cada
 * planeta + a dinâmica do aspecto (cobre todos os pares em tom de RS). Se algum dos
 * pontos não tiver domínio (nódulo, Quíron, ângulo), cai no aspecto natal curado.
 */
export function resolveSolarReturnAspectText(
  planet1: string,
  aspect: string,
  planet2: string,
  language?: string | null,
): string | null {
  const lang = normalizeLanguage(language)
  const p1 = normalizePlanet(planet1)
  const p2 = normalizePlanet(planet2)
  const asp = normalizeAspect(aspect)

  const domains = SR_PLANET_YEAR_DOMAIN[lang] || SR_PLANET_YEAR_DOMAIN['pt-BR']
  const dynamics = SR_ASPECT_DYNAMIC[lang] || SR_ASPECT_DYNAMIC['pt-BR']
  const lead = SR_ASPECT_LEAD[lang] || SR_ASPECT_LEAD['pt-BR']

  const d1 = domains[p1]
  const d2 = domains[p2]
  const dyn = dynamics[asp]
  const and = lang === 'en-US' ? 'and' : lang === 'es-ES' ? 'y' : lang === 'it-IT' ? 'e' : 'e'

  if (d1 && d2 && dyn) {
    return `${lead} ${d1} ${and} ${d2} ${dyn.verb}. ${dyn.interaction} ${dyn.advice}`
  }

  // Fallback: aspecto natal curado (pontos sem domínio de ano).
  return resolveNatalPlanetAspectText(planet1, aspect, planet2, language)
}

/**
 * Texto de planeta no signo do RS, COMPOSTO a partir do domínio-do-ano do planeta
 * + a qualidade do signo (colore COMO o domínio se expressa no ano). Fallback ao
 * planeta-no-signo natal para pontos sem domínio (Lilith, nódulos, Quíron).
 */
export function resolveSolarReturnPlanetInSignText(
  planet: string,
  sign: string,
  language?: string | null,
): string | null {
  const lang = normalizeLanguage(language)
  const p = normalizePlanet(planet)
  const s = normalizeSign(sign)

  const domains = SR_PLANET_YEAR_DOMAIN[lang] || SR_PLANET_YEAR_DOMAIN['pt-BR']
  const flavors = SR_SIGN_FLAVOR[lang] || SR_SIGN_FLAVOR['pt-BR']
  const lead = SR_ASPECT_LEAD[lang] || SR_ASPECT_LEAD['pt-BR']
  const link = SR_SIGN_LINK[lang] || SR_SIGN_LINK['pt-BR']

  const domain = domains[p]
  const flavor = flavors[s]
  if (domain && flavor) {
    return `${lead} ${domain} ${link} ${flavor.name}: ${flavor.tone}. ${flavor.how}.`
  }

  // Fallback: catálogo natal de planeta-no-signo.
  return resolvePlanetInSignText(planet, sign, language)
}

// ─── Retorno Lunar (mês) — composers (reutilizam domínios/sign-flavor/aspectos) ──

/** Planeta na casa do Retorno Lunar: foco emocional do mês por área da casa. */
export function resolveLunarReturnPlanetInHouseText(
  planet: string,
  house: number,
  language?: string | null,
): string | null {
  const lang = normalizeLanguage(language)
  const p = normalizePlanet(planet)
  const domain = (SR_PLANET_YEAR_DOMAIN[lang] || SR_PLANET_YEAR_DOMAIN['pt-BR'])[p]
  const area = (LUNAR_HOUSE_AREA[lang] || LUNAR_HOUSE_AREA['pt-BR'])[house]
  const lead = LUNAR_LEAD[lang] || LUNAR_LEAD['pt-BR']
  if (domain && area) {
    const toMap: Record<string, string> = { 'pt-BR': 'se volta para', 'en-US': 'turns toward', 'es-ES': 'se vuelca hacia', 'it-IT': 'si volge verso' }
    const forMap: Record<string, string> = { 'pt-BR': 'Um mês para', 'en-US': 'A month to', 'es-ES': 'Un mes para', 'it-IT': 'Un mese per' }
    const to = toMap[lang] || toMap['pt-BR']
    const forWord = forMap[lang] || forMap['pt-BR']
    return `${lead} ${domain} ${to} ${area.area}. ${forWord} ${area.focus}.`
  }
  return resolveNatalPlanetInHouseText(planet, house, language)
}

/** Ascendente do Retorno Lunar: o clima emocional do mês. */
export function resolveLunarReturnAscendantText(sign: string, language?: string | null): string | null {
  const lang = normalizeLanguage(language)
  const flavor = (SR_SIGN_FLAVOR[lang] || SR_SIGN_FLAVOR['pt-BR'])[normalizeSign(sign)]
  const lead = LUNAR_LEAD[lang] || LUNAR_LEAD['pt-BR']
  if (flavor) {
    const climaMap: Record<string, string> = {
      'pt-BR': 'o clima emocional é de', 'en-US': 'the emotional mood is one of',
      'es-ES': 'el clima emocional es de', 'it-IT': "il clima emotivo e di",
    }
    const clima = climaMap[lang] || climaMap['pt-BR']
    return `${lead} ${clima} ${flavor.tone}. ${flavor.how}.`
  }
  return resolveSignInHouseText(sign, 1, language)
}

/** Planeta no signo do Retorno Lunar (tom mensal). */
export function resolveLunarReturnPlanetInSignText(planet: string, sign: string, language?: string | null): string | null {
  const lang = normalizeLanguage(language)
  const domain = (SR_PLANET_YEAR_DOMAIN[lang] || SR_PLANET_YEAR_DOMAIN['pt-BR'])[normalizePlanet(planet)]
  const flavor = (SR_SIGN_FLAVOR[lang] || SR_SIGN_FLAVOR['pt-BR'])[normalizeSign(sign)]
  const lead = LUNAR_LEAD[lang] || LUNAR_LEAD['pt-BR']
  const link = SR_SIGN_LINK[lang] || SR_SIGN_LINK['pt-BR']
  if (domain && flavor) {
    return `${lead} ${domain} ${link} ${flavor.name}: ${flavor.tone}.`
  }
  return resolvePlanetInSignText(planet, sign, language)
}

/** Aspecto do Retorno Lunar (tom mensal). */
export function resolveLunarReturnAspectText(
  planet1: string, aspect: string, planet2: string, language?: string | null,
): string | null {
  const lang = normalizeLanguage(language)
  const domains = SR_PLANET_YEAR_DOMAIN[lang] || SR_PLANET_YEAR_DOMAIN['pt-BR']
  const dynamics = SR_ASPECT_DYNAMIC[lang] || SR_ASPECT_DYNAMIC['pt-BR']
  const lead = LUNAR_LEAD[lang] || LUNAR_LEAD['pt-BR']
  const d1 = domains[normalizePlanet(planet1)]
  const d2 = domains[normalizePlanet(planet2)]
  const dyn = dynamics[normalizeAspect(aspect)]
  const and = lang === 'en-US' ? 'and' : lang === 'es-ES' ? 'y' : 'e'
  if (d1 && d2 && dyn) {
    return `${lead} ${d1} ${and} ${d2} ${dyn.verb}. ${dyn.interaction} ${dyn.advice}`
  }
  return resolveNatalPlanetAspectText(planet1, aspect, planet2, language)
}
