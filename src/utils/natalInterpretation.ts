import { normalizeLanguage, type AppLanguage } from '../i18n/appI18n'
import { NATAL_PLANET_IN_HOUSE_PTBR_OVERRIDES } from '../data/natalPlanetInHouseOverridesPtBR'
import { NATAL_PLANET_IN_HOUSE_I18N_OVERRIDES } from '../data/natalPlanetInHouseOverridesI18n'

const KNOWN_PLANETS = new Set([
  'sun', 'moon', 'mercury', 'venus', 'mars',
  'jupiter', 'saturn', 'uranus', 'neptune', 'pluto',
])

function normalizePlanet(value: unknown): string {
  return String(value || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function buildNatalPlanetInHouseKey(planet: string, house: number): string | null {
  const p = normalizePlanet(planet)
  if (!KNOWN_PLANETS.has(p)) return null
  if (!Number.isFinite(house) || house < 1 || house > 12) return null
  return `natal:${p}|house|${house}`
}

function normalizeCatalogKey(value: unknown): string {
  return String(value || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '')
}

function buildNormalizedMap(source: Record<string, string>): Record<string, string> {
  const out: Record<string, string> = {}
  Object.entries(source || {}).forEach(([rawKey, value]) => {
    const key = normalizeCatalogKey(rawKey)
    if (key && typeof out[key] === 'undefined') out[key] = value
  })
  return out
}

const PTBR_NORMALIZED = buildNormalizedMap(NATAL_PLANET_IN_HOUSE_PTBR_OVERRIDES)

const I18N_NORMALIZED: Partial<Record<AppLanguage, Record<string, string>>> = (() => {
  const out: Partial<Record<AppLanguage, Record<string, string>>> = {}
  ;(Object.keys(NATAL_PLANET_IN_HOUSE_I18N_OVERRIDES) as AppLanguage[]).forEach((lang) => {
    const map = NATAL_PLANET_IN_HOUSE_I18N_OVERRIDES[lang]
    if (map) out[lang] = buildNormalizedMap(map)
  })
  return out
})()

/**
 * Retorna o texto de interpretação para um planeta em uma casa natal.
 * Retorna null se a chave não existir no catálogo.
 */
export function resolveNatalPlanetInHouseText(
  planet: string,
  house: number,
  language?: string | null,
): string | null {
  const keyRaw = buildNatalPlanetInHouseKey(planet, house)
  if (!keyRaw) return null
  const key = normalizeCatalogKey(keyRaw)
  const lang = normalizeLanguage(language)

  if (lang !== 'pt-BR') {
    const i18nText =
      I18N_NORMALIZED[lang]?.[key] ||
      NATAL_PLANET_IN_HOUSE_I18N_OVERRIDES[lang]?.[keyRaw]
    if (i18nText && i18nText.trim().length >= 50) return i18nText.trim()
    return null
  }

  const ptText =
    PTBR_NORMALIZED[key] ||
    NATAL_PLANET_IN_HOUSE_PTBR_OVERRIDES[keyRaw]
  if (ptText && ptText.trim().length >= 50) return ptText.trim()
  return null
}

/**
 * Gera a chave canônica para uso externo (ex: testes, debug).
 */
export function buildNatalPlanetInHouseKeyPublic(planet: string, house: number): string | null {
  return buildNatalPlanetInHouseKey(planet, house)
}
