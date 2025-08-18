export type AspectType = 'conjunção' | 'sextil' | 'quadratura' | 'trígono' | 'oposição'

const PLANET_PT: Record<string, string> = {
  Sun: 'Sol', Moon: 'Lua', Mercury: 'Mercúrio', Venus: 'Vênus', Mars: 'Marte',
  Jupiter: 'Júpiter', Saturn: 'Saturno', Uranus: 'Urano', Neptune: 'Netuno', Pluto: 'Plutão',
}

const ASPECT_SYMBOL: Record<AspectType, string> = {
  'conjunção': '☌',
  'sextil': '✶',
  'quadratura': '□',
  'trígono': '△',
  'oposição': '☍',
}

export function translatePlanetPT(name: string): string {
  return PLANET_PT[name] || name
}

export function getAspectSymbol(type: string): string {
  return ASPECT_SYMBOL[type as AspectType] || type
}

export function formatTransitCompact(leftPlanet: string, aspectType: string, rightPlanet: string): string {
  return `${translatePlanetPT(leftPlanet)} ${getAspectSymbol(aspectType)} ${translatePlanetPT(rightPlanet)}`
}

export function getTransitState(window?: { start?: string|Date, exact?: string|Date, end?: string|Date }): 'aproxima' | 'agora' | 'se afasta' | '' {
  if (!window) return ''
  const now = Date.now()
  const s = window.start ? new Date(window.start).getTime() : undefined
  const e = window.end ? new Date(window.end).getTime() : undefined
  const x = window.exact ? new Date(window.exact).getTime() : undefined
  if (x && Math.abs(now - x) < 12 * 60 * 60 * 1000) return 'agora'
  if (s && now < s) return 'aproxima'
  if (e && now > e) return 'se afasta'
  if (x && now < x) return 'aproxima'
  if (x && now > x) return 'se afasta'
  return ''
}

export function formatPeakETA(window?: { start?: string|Date, exact?: string|Date }): string {
  if (!window) return ''
  const target = window.exact || window.start
  if (!target) return ''
  const diffMs = new Date(target).getTime() - Date.now()
  const sign = diffMs >= 0 ? 1 : -1
  const abs = Math.abs(diffMs)
  const days = Math.floor(abs / (24*60*60*1000))
  const hours = Math.floor((abs % (24*60*60*1000)) / (60*60*1000))
  const label = days > 0 ? `${days}d` : `${hours}h`
  return sign >= 0 ? `pico em ${label}` : `pico há ${label}`
}

export function aspectNature(type: string): 'harmonico' | 'desafiador' | 'conjuncao' | 'outro' {
  if (type === 'trígono' || type === 'sextil') return 'harmonico'
  if (type === 'quadratura' || type === 'oposição') return 'desafiador'
  if (type === 'conjunção') return 'conjuncao'
  return 'outro'
}

export function windowsIntersect(a?: {start?: any, end?: any}, b?: {start?: any, end?: any}): boolean {
  if (!a || !b || !a.start || !a.end || !b.start || !b.end) return false
  const as = new Date(a.start).getTime()
  const ae = new Date(a.end).getTime()
  const bs = new Date(b.start).getTime()
  const be = new Date(b.end).getTime()
  return as <= be && ae >= bs
}


