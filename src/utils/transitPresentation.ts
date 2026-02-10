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

export function extractHouseNumber(value: unknown): number | null {
  const parsed = Number(value)
  if (!Number.isFinite(parsed)) return null
  if (parsed < 1 || parsed > 12) return null
  return Math.round(parsed)
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
  const targetLabel = sanitizeTransitToken(params.targetLabel)
  const houseNumber = extractHouseNumber(params.houseNumber)
  const areaHouses = Array.isArray(params.areaHouses)
    ? params.areaHouses
        .map((value) => extractHouseNumber(value))
        .filter((value): value is number => value !== null)
    : []
  void areaHouses

  if (aspectLabel && targetLabel) return `${transitPlanet} em ${aspectLabel} com ${targetLabel}`
  if (aspectLabel && houseNumber) return `${transitPlanet} em ${aspectLabel} na Casa ${houseNumber}`
  if (houseNumber) return `${transitPlanet} em transito na Casa ${houseNumber}`
  if (targetLabel) return `${transitPlanet} com ${targetLabel}`
  if (aspectLabel) return `${transitPlanet} em ${aspectLabel}`
  return `${transitPlanet} em transito ativo`
}
