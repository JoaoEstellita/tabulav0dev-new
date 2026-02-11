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

const ASPECT_LABELS: Record<string, string> = {
  conjuncao: 'Conjuncao',
  oposicao: 'Oposicao',
  quadratura: 'Quadratura',
  trigono: 'Trigono',
  sextil: 'Sextil',
  quincuncio: 'Quincuncio',
  semissextil: 'Semissextil',
  semiquadratura: 'Semiquadratura',
  sesquiquadratura: 'Sesquiquadratura',
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
  return normalized
}

export function toRomanHouse(value: unknown): string | null {
  const n = extractHouseNumber(value)
  if (!n) return null
  const roman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII']
  return roman[n - 1] || null
}

function formatHouseLabel(value: unknown): string {
  const roman = toRomanHouse(value)
  if (roman) return `Casa ${roman}`
  const fallback = extractHouseNumber(value)
  return fallback ? `Casa ${fallback}` : ''
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
}): string {
  const transitPlanet = sanitizeTransitToken(params.transitPlanet) || 'Transito'
  const aspectLabel = sanitizeTransitToken(params.aspectLabel)
  const aspectKey = normalizeAspectToken(aspectLabel)
  const aspectText = aspectKey ? (ASPECT_LABELS[aspectKey] || aspectLabel) : ''
  const aspectSymbol = aspectKey ? (ASPECT_SYMBOLS[aspectKey] || '') : ''
  const targetLabel = sanitizeTransitToken(params.targetLabel)
  const houseNumber = extractHouseNumber(params.houseNumber)
  const areaHouses = Array.isArray(params.areaHouses)
    ? params.areaHouses
        .map((value) => extractHouseNumber(value))
        .filter((value): value is number => value !== null)
    : []
  const areaHousesLabel = areaHouses.length ? areaHouses.join('/') : ''
  const targetIsHouse = isHouseLikeTarget(targetLabel)
  const targetHouseNumber = targetLabel ? parseHouseNumberFromText(targetLabel) : null

  if (aspectText && targetLabel && !targetIsHouse) {
    return `${transitPlanet} ${aspectText}${aspectSymbol ? ` ${aspectSymbol}` : ''} ${targetLabel}`.trim()
  }
  if (aspectLabel && targetIsHouse) {
    const houseLabel = targetHouseNumber
      ? formatHouseLabel(targetHouseNumber)
      : houseNumber
      ? formatHouseLabel(houseNumber)
      : targetLabel
    return `${transitPlanet} ${aspectText || aspectLabel}${aspectSymbol ? ` ${aspectSymbol}` : ''} ${houseLabel}`.trim()
  }
  if (aspectText && houseNumber) return `${transitPlanet} ${aspectText}${aspectSymbol ? ` ${aspectSymbol}` : ''} ${formatHouseLabel(houseNumber)}`
  if (aspectText && areaHousesLabel) return `${transitPlanet} ${aspectText}${aspectSymbol ? ` ${aspectSymbol}` : ''} Casas ${areaHousesLabel}`
  if (houseNumber) return `${transitPlanet} em transito na ${formatHouseLabel(houseNumber)}`
  if (areaHousesLabel) return `${transitPlanet} em transito nas Casas ${areaHousesLabel}`
  if (targetLabel) return `${transitPlanet} com ${targetLabel}`
  if (aspectText) return `${transitPlanet} ${aspectText}${aspectSymbol ? ` ${aspectSymbol}` : ''}`.trim()
  return `${transitPlanet} em transito ativo`
}
