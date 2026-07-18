import type { AppLanguage } from '../i18n/appI18n'
import { translatePlanet } from './astro/pt'

export function normalizeTextToken(value: unknown): string {
  return String(value || '')
    .trim()
    .replace(/\s+/g, ' ')
}

function isMeaninglessToken(value: string): boolean {
  const normalized = value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
  const blocked = new Set([
    '',
    'com',
    'em',
    'na',
    'no',
    'nesta area',
    'nesta',
    'area',
    'target:any',
    'any',
    'undefined',
    'null',
  ])
  return blocked.has(normalized)
}

export function sanitizeTransitToken(value: unknown): string {
  const token = normalizeTextToken(value)
  if (!token) return ''
  if (isMeaninglessToken(token)) return ''
  return token
}

function normalizeComparableToken(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function isHouseLikeTarget(target: string): boolean {
  const normalized = normalizeComparableToken(target)
  if (!normalized) return false
  return normalized.startsWith('casa ') || normalized.startsWith('house ') || normalized.startsWith('house_')
}

export function extractHouseNumber(value: unknown): number | null {
  const parsed = Number(value)
  if (!Number.isFinite(parsed)) return null
  if (parsed < 1 || parsed > 12) return null
  return Math.round(parsed)
}

const ASPECT_SYMBOLS: Record<string, string> = {
  conjuncao: '\u260C',
  oposicao: '\u260D',
  quadratura: '\u25A1',
  trigono: '\u25B3',
  sextil: '\u2736',
  quincuncio: '\u26BB',
  semissextil: '\u26BA',
  semiquadratura: '\u2220',
  sesquiquadratura: '\u26BC',
}

const ASPECT_LABELS_BY_LANGUAGE: Record<AppLanguage, Record<string, string>> = {
  'pt-BR': {
    conjuncao: 'Conjuncao',
    oposicao: 'Oposicao',
    quadratura: 'Quadratura',
    trigono: 'Trigono',
    sextil: 'Sextil',
    quincuncio: 'Quincuncio',
    semissextil: 'Semissextil',
    semiquadratura: 'Semiquadratura',
    sesquiquadratura: 'Sesquiquadratura',
    ingress: 'Ingresso',
  },
  'en-US': {
    conjuncao: 'Conjunction',
    oposicao: 'Opposition',
    quadratura: 'Square',
    trigono: 'Trine',
    sextil: 'Sextile',
    quincuncio: 'Quincunx',
    semissextil: 'Semisextile',
    semiquadratura: 'Semisquare',
    sesquiquadratura: 'Sesquiquadrate',
    ingress: 'Ingress',
  },
  'es-ES': {
    conjuncao: 'Conjuncion',
    oposicao: 'Oposicion',
    quadratura: 'Cuadratura',
    trigono: 'Trigono',
    sextil: 'Sextil',
    quincuncio: 'Quincuncio',
    semissextil: 'Semisextil',
    semiquadratura: 'Semicuadratura',
    sesquiquadratura: 'Sesquicuadratura',
    ingress: 'Ingreso',
  },
  'it-IT': {
    conjuncao: 'Congiunzione',
    oposicao: 'Opposizione',
    quadratura: 'Quadratura',
    trigono: 'Trigono',
    sextil: 'Sestile',
    quincuncio: 'Quinconce',
    semissextil: 'Semisestile',
    semiquadratura: 'Semiquadratura',
    sesquiquadratura: 'Sesquiquadratura',
    ingress: 'Ingresso',
  },
}

function normalizeAspectToken(value: string): string {
  const normalized = value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
  if (normalized.includes('trigono') || normalized.includes('trine')) return 'trigono'
  if (normalized.includes('sesquiquadr')) return 'sesquiquadratura'
  if (normalized.includes('semiquadr')) return 'semiquadratura'
  if (normalized.includes('semissext') || normalized.includes('semisext')) return 'semissextil'
  if (normalized.includes('sext')) return 'sextil'
  if (normalized.includes('quadr')) return 'quadratura'
  if (normalized.includes('opos')) return 'oposicao'
  if (normalized.includes('quinc')) return 'quincuncio'
  if (normalized.includes('conj')) return 'conjuncao'
  if (normalized.includes('ingress') || normalized.includes('ingresso') || normalized.includes('ingreso')) return 'ingress'
  return normalized
}

export function toRomanHouse(value: unknown): string | null {
  const n = extractHouseNumber(value)
  if (!n) return null
  const roman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII']
  return roman[n - 1] || null
}

function formatHouseLabel(value: unknown, language: AppLanguage = 'pt-BR'): string {
  const houseWord =
    language === 'en-US' ? 'House' :
    language === 'es-ES' ? 'Casa' :
    language === 'it-IT' ? 'Casa' :
    'Casa'
  const roman = toRomanHouse(value)
  if (roman) return `${houseWord} ${roman}`
  const fallback = extractHouseNumber(value)
  return fallback ? `${houseWord} ${fallback}` : ''
}

function parseHouseNumberFromText(value: string): number | null {
  const match = value.match(/(?:casa|house)\s*(\d{1,2})/i)
  if (!match) return null
  return extractHouseNumber(match[1])
}

export function buildTransitTitle(params: {
  transitPlanet?: unknown
  aspectLabel?: unknown
  targetLabel?: unknown
  houseNumber?: unknown
  areaHouses?: Array<number | string> | null
}, language: AppLanguage = 'pt-BR'): string {
  const fallbackTransit = language === 'en-US' ? 'Transit' : language === 'es-ES' ? 'Transito' : language === 'it-IT' ? 'Transito' : 'Transito'
  const transitPlanetRaw = sanitizeTransitToken(params.transitPlanet) || fallbackTransit
  const transitPlanet = translatePlanet(transitPlanetRaw, language)
  const aspectLabel = sanitizeTransitToken(params.aspectLabel)
  const aspectKey = normalizeAspectToken(aspectLabel)
  const labels = ASPECT_LABELS_BY_LANGUAGE[language] || ASPECT_LABELS_BY_LANGUAGE['pt-BR']
  const aspectText = aspectKey ? (labels[aspectKey] || aspectLabel) : ''
  const aspectSymbol = aspectKey ? (ASPECT_SYMBOLS[aspectKey] || '') : ''
  const targetLabelRaw = sanitizeTransitToken(params.targetLabel)
  const targetLabel = targetLabelRaw ? translatePlanet(targetLabelRaw, language) : ''
  const houseNumber = extractHouseNumber(params.houseNumber)
  const areaHouses = Array.isArray(params.areaHouses)
    ? params.areaHouses
        .map((value) => extractHouseNumber(value))
        .filter((value): value is number => value !== null)
    : []
  const areaHousesLabel = areaHouses.length ? areaHouses.join('/') : ''
  // Rótulos "(trânsito)" / "(natal)". Só entram nos ramos cujo ALVO é um ponto
  // natal (planeta ou ângulo) — nos ramos de casa/ingresso a frase já diz "em
  // trânsito na Casa X" e o rótulo seria redundante. Sem isso, títulos como
  // "Lua □ Lua" ou "Plutão △ Júpiter" não dizem qual lado é qual.
  const transitTag =
    language === 'en-US' ? 'transit' :
    language === 'es-ES' ? 'transito' :
    language === 'it-IT' ? 'transito' : 'trânsito'
  const natalTag =
    language === 'it-IT' ? 'natale' : 'natal'
  const withTransitTag = (name: string) => `${name} (${transitTag})`
  const withNatalTag = (name: string) => `${name} (${natalTag})`

  const targetIsHouse = isHouseLikeTarget(targetLabel)
  const targetHouseNumber = targetLabel ? parseHouseNumberFromText(targetLabel) : null

  if (aspectText && targetLabel && !targetIsHouse) {
    return `${withTransitTag(transitPlanet)} ${aspectText}${aspectSymbol ? ` ${aspectSymbol}` : ''} ${withNatalTag(targetLabel)}`.trim()
  }
  if (aspectLabel && targetIsHouse) {
    const houseLabel = targetHouseNumber
      ? formatHouseLabel(targetHouseNumber, language)
      : houseNumber
      ? formatHouseLabel(houseNumber, language)
      : targetLabel
    return `${transitPlanet} ${aspectText || aspectLabel}${aspectSymbol ? ` ${aspectSymbol}` : ''} ${houseLabel}`.trim()
  }
  if (aspectText && houseNumber) return `${transitPlanet} ${aspectText}${aspectSymbol ? ` ${aspectSymbol}` : ''} ${formatHouseLabel(houseNumber, language)}`
  if (aspectText && areaHousesLabel) {
    const housesWord =
      language === 'en-US' ? 'Houses' :
      language === 'es-ES' ? 'Casas' :
      language === 'it-IT' ? 'Case' :
      'Casas'
    return `${transitPlanet} ${aspectText}${aspectSymbol ? ` ${aspectSymbol}` : ''} ${housesWord} ${areaHousesLabel}`
  }
  if (houseNumber) {
    if (language === 'en-US') return `${transitPlanet} in active transit in ${formatHouseLabel(houseNumber, language)}`
    if (language === 'es-ES') return `${transitPlanet} en transito activo en ${formatHouseLabel(houseNumber, language)}`
    if (language === 'it-IT') return `${transitPlanet} in transito attivo in ${formatHouseLabel(houseNumber, language)}`
    return `${transitPlanet} em transito na ${formatHouseLabel(houseNumber, language)}`
  }
  if (areaHousesLabel) {
    if (language === 'en-US') return `${transitPlanet} in active transit in Houses ${areaHousesLabel}`
    if (language === 'es-ES') return `${transitPlanet} en transito activo en Casas ${areaHousesLabel}`
    if (language === 'it-IT') return `${transitPlanet} in transito attivo nelle Case ${areaHousesLabel}`
    return `${transitPlanet} em transito nas Casas ${areaHousesLabel}`
  }
  if (targetLabel) {
    const t = withTransitTag(transitPlanet)
    const n = withNatalTag(targetLabel)
    if (language === 'en-US') return `${t} with ${n}`
    if (language === 'es-ES') return `${t} con ${n}`
    if (language === 'it-IT') return `${t} con ${n}`
    return `${t} com ${n}`
  }
  if (aspectText) return `${transitPlanet} ${aspectText}${aspectSymbol ? ` ${aspectSymbol}` : ''}`.trim()
  if (language === 'en-US') return `${transitPlanet} in active transit`
  if (language === 'es-ES') return `${transitPlanet} en transito activo`
  if (language === 'it-IT') return `${transitPlanet} in transito attivo`
  return `${transitPlanet} em transito ativo`
}
