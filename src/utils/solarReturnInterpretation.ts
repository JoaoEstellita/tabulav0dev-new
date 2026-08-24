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
import { resolveNatalPlanetInHouseText } from './natalInterpretation'
import { SOLAR_RETURN_PLANET_IN_HOUSE_PTBR_OVERRIDES } from '../data/solarReturnPlanetInHouseOverridesPtBR'
import { SOLAR_RETURN_PLANET_IN_HOUSE_I18N_OVERRIDES } from '../data/solarReturnPlanetInHouseOverridesI18n'

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
