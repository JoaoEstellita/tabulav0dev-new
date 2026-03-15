import { normalizeLanguage, type AppLanguage } from '../i18n/appI18n'
import { NATAL_PLANET_IN_HOUSE_PTBR_OVERRIDES } from '../data/natalPlanetInHouseOverridesPtBR'
import { NATAL_PLANET_IN_HOUSE_I18N_OVERRIDES } from '../data/natalPlanetInHouseOverridesI18n'
import { NATAL_PLANET_ASPECT_PTBR_OVERRIDES } from '../data/natalPlanetAspectOverridesPtBR'
import { NATAL_PLANET_ASPECT_I18N_OVERRIDES } from '../data/natalPlanetAspectOverridesI18n'

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

// ─── Natal Aspect Catalog ───────────────────────────────────────────────────

// Ordem canônica dos planetas por número (01=sun, 02=moon, ..., 10=pluto)
const PLANET_ORDER: Record<string, number> = {
  sun: 1, moon: 2, mercury: 3, venus: 4, mars: 5,
  jupiter: 6, saturn: 7, uranus: 8, neptune: 9, pluto: 10,
}

const KNOWN_ASPECTS = new Set([
  'conjuncao', 'sextil', 'quadratura', 'trigono', 'oposicao',
])

function normalizeAspect(value: unknown): string {
  return String(value || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '')
    // common variant normalizations
    .replace(/conjunction|conjuncao|conjuncion/g, 'conjuncao')
    .replace(/sextile|sextil/g, 'sextil')
    .replace(/square|quadrature|cuadratura/g, 'quadratura')
    .replace(/trine|trigono/g, 'trigono')
    .replace(/opposition|oposicion/g, 'oposicao')
}

function buildNatalAspectKey(planet1: string, aspect: string, planet2: string): string | null {
  const p1 = normalizePlanet(planet1)
  const p2 = normalizePlanet(planet2)
  const asp = normalizeAspect(aspect)

  if (!KNOWN_PLANETS.has(p1) || !KNOWN_PLANETS.has(p2)) return null
  if (!KNOWN_ASPECTS.has(asp)) return null
  if (p1 === p2) return null

  // Canonical order: lower planet number first
  const ord1 = PLANET_ORDER[p1] ?? 99
  const ord2 = PLANET_ORDER[p2] ?? 99
  const [first, second] = ord1 <= ord2 ? [p1, p2] : [p2, p1]

  return `natal:${first}|${asp}|${second}`
}

const ASPECT_PTBR_NORMALIZED = buildNormalizedMap(NATAL_PLANET_ASPECT_PTBR_OVERRIDES)

const ASPECT_I18N_NORMALIZED: Partial<Record<AppLanguage, Record<string, string>>> = (() => {
  const out: Partial<Record<AppLanguage, Record<string, string>>> = {}
  ;(Object.keys(NATAL_PLANET_ASPECT_I18N_OVERRIDES) as AppLanguage[]).forEach((lang) => {
    const map = NATAL_PLANET_ASPECT_I18N_OVERRIDES[lang]
    if (map) out[lang] = buildNormalizedMap(map)
  })
  return out
})()

/**
 * Retorna o texto de interpretação para um aspecto natal entre dois planetas.
 * Retorna null se a chave não existir no catálogo.
 */
export function resolveNatalPlanetAspectText(
  planet1: string,
  aspect: string,
  planet2: string,
  language?: string | null,
): string | null {
  const keyRaw = buildNatalAspectKey(planet1, aspect, planet2)
  if (!keyRaw) return null
  const key = normalizeCatalogKey(keyRaw)
  const lang = normalizeLanguage(language)

  if (lang !== 'pt-BR') {
    const i18nText =
      ASPECT_I18N_NORMALIZED[lang]?.[key] ||
      NATAL_PLANET_ASPECT_I18N_OVERRIDES[lang]?.[keyRaw]
    if (i18nText && i18nText.trim().length >= 50) return i18nText.trim()
    return null
  }

  const ptText =
    ASPECT_PTBR_NORMALIZED[key] ||
    NATAL_PLANET_ASPECT_PTBR_OVERRIDES[keyRaw]
  if (ptText && ptText.trim().length >= 50) return ptText.trim()
  return null
}

/**
 * Gera a chave canônica de aspecto natal para uso externo (testes, debug).
 */
export function buildNatalAspectKeyPublic(planet1: string, aspect: string, planet2: string): string | null {
  return buildNatalAspectKey(planet1, aspect, planet2)
}
