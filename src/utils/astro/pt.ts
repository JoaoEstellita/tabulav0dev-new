export type AspectType = 'conjuncao' | 'sextil' | 'quadratura' | 'trigono' | 'oposicao'
export type AppLanguage = 'pt-BR' | 'en-US' | 'es-ES' | 'it-IT'

const PLANET_BY_LANGUAGE: Record<AppLanguage, Record<string, string>> = {
  'pt-BR': {
    sun: 'Sol',
    moon: 'Lua',
    mercury: 'Mercurio',
    venus: 'Venus',
    mars: 'Marte',
    jupiter: 'Jupiter',
    saturn: 'Saturno',
    uranus: 'Urano',
    neptune: 'Netuno',
    pluto: 'Plutao',
    chiron: 'Quiron',
    lilith: 'Lilith',
    northnode: 'Nodo Norte',
    southnode: 'Nodo Sul',
    asc: 'Ascendente',
    dc: 'Descendente',
    mc: 'Meio do Ceu',
    ic: 'Fundo do Ceu',
  },
  'en-US': {
    sun: 'Sun',
    moon: 'Moon',
    mercury: 'Mercury',
    venus: 'Venus',
    mars: 'Mars',
    jupiter: 'Jupiter',
    saturn: 'Saturn',
    uranus: 'Uranus',
    neptune: 'Neptune',
    pluto: 'Pluto',
    chiron: 'Chiron',
    lilith: 'Lilith',
    northnode: 'North Node',
    southnode: 'South Node',
    asc: 'Ascendant',
    dc: 'Descendant',
    mc: 'Midheaven',
    ic: 'Imum Coeli',
  },
  'es-ES': {
    sun: 'Sol',
    moon: 'Luna',
    mercury: 'Mercurio',
    venus: 'Venus',
    mars: 'Marte',
    jupiter: 'Jupiter',
    saturn: 'Saturno',
    uranus: 'Urano',
    neptune: 'Neptuno',
    pluto: 'Pluton',
    chiron: 'Quiron',
    lilith: 'Lilith',
    northnode: 'Nodo Norte',
    southnode: 'Nodo Sur',
    asc: 'Ascendente',
    dc: 'Descendente',
    mc: 'Medio Cielo',
    ic: 'Fondo del Cielo',
  },
  'it-IT': {
    sun: 'Sole',
    moon: 'Luna',
    mercury: 'Mercurio',
    venus: 'Venere',
    mars: 'Marte',
    jupiter: 'Giove',
    saturn: 'Saturno',
    uranus: 'Urano',
    neptune: 'Nettuno',
    pluto: 'Plutone',
    chiron: 'Chirone',
    lilith: 'Lilith',
    northnode: 'Nodo Nord',
    southnode: 'Nodo Sud',
    asc: 'Ascendente',
    dc: 'Discendente',
    mc: 'Medio Cielo',
    ic: 'Fondo Cielo',
  },
}

const PLANET_ALIASES_TO_CANONICAL: Record<string, string> = {
  sun: 'sun',
  sol: 'sun',
  sole: 'sun',
  moon: 'moon',
  lua: 'moon',
  luna: 'moon',
  mercury: 'mercury',
  mercurio: 'mercury',
  venus: 'venus',
  mars: 'mars',
  marte: 'mars',
  jupiter: 'jupiter',
  giove: 'jupiter',
  saturn: 'saturn',
  saturno: 'saturn',
  uranus: 'uranus',
  urano: 'uranus',
  neptune: 'neptune',
  netuno: 'neptune',
  neptuno: 'neptune',
  nettuno: 'neptune',
  pluto: 'pluto',
  plutao: 'pluto',
  pluton: 'pluto',
  plutone: 'pluto',
  chiron: 'chiron',
  quiron: 'chiron',
  chirone: 'chiron',
  lilith: 'lilith',
  northnode: 'northnode',
  'nodo norte': 'northnode',
  southnode: 'southnode',
  'nodo sul': 'southnode',
  'nodo sur': 'southnode',
  asc: 'asc',
  ascendente: 'asc',
  ascendant: 'asc',
  dc: 'dc',
  descendant: 'dc',
  descendente: 'dc',
  discendente: 'dc',
  mc: 'mc',
  midheaven: 'mc',
  'meio do ceu': 'mc',
  meiodoceu: 'mc',
  'medio cielo': 'mc',
  ic: 'ic',
  'imum coeli': 'ic',
  imumcoeli: 'ic',
  'fundo do ceu': 'ic',
  fundodoceu: 'ic',
  'fondo del cielo': 'ic',
  'fondo cielo': 'ic',
}

const ASPECT_SYMBOL: Record<AspectType, string> = {
  conjuncao: '\u260C',
  sextil: '\u2736',
  quadratura: '\u25A1',
  trigono: '\u25B3',
  oposicao: '\u260D',
}

const normalizeText = (value: string): string =>
  String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

export function decodeUnicodeEscapes(value: string): string {
  return String(value || '').replace(/\\u([0-9a-fA-F]{4})/g, (_match, code) =>
    String.fromCharCode(parseInt(code, 16))
  )
}

export function translatePlanetPT(name: string): string {
  return translatePlanet(name, 'pt-BR')
}

export function translatePlanet(name: string, language: AppLanguage = 'pt-BR'): string {
  const decoded = decodeUnicodeEscapes(name)
  const normalized = normalizeText(decoded)
  const key = PLANET_ALIASES_TO_CANONICAL[normalized] || normalized
  const dictionary = PLANET_BY_LANGUAGE[language] || PLANET_BY_LANGUAGE['pt-BR']
  return dictionary[key] || PLANET_BY_LANGUAGE['pt-BR'][key] || decoded
}

// Tradução de signos. A entrada costuma vir em pt-BR (engine astrológico), mas
// aceitamos aliases em qualquer idioma via chave normalizada (sem acento/minúscula).
const SIGN_ALIAS_TO_INDEX: Record<string, number> = {
  aries: 0,
  taurus: 1, touro: 1, tauro: 1, toro: 1,
  gemini: 2, gemeos: 2, geminis: 2, gemelli: 2,
  cancer: 3, cancro: 3,
  leo: 4, leao: 4, leone: 4,
  virgo: 5, virgem: 5, vergine: 5,
  libra: 6, bilancia: 6,
  scorpio: 7, escorpiao: 7, escorpio: 7, scorpione: 7,
  sagittarius: 8, sagitario: 8, sagittario: 8,
  capricorn: 9, capricornio: 9, capricorno: 9,
  aquarius: 10, aquario: 10, acuario: 10, acquario: 10,
  pisces: 11, peixes: 11, piscis: 11, pesci: 11,
}

const SIGN_NAMES_BY_LANGUAGE: Record<AppLanguage, string[]> = {
  'pt-BR': ['Áries', 'Touro', 'Gêmeos', 'Câncer', 'Leão', 'Virgem', 'Libra', 'Escorpião', 'Sagitário', 'Capricórnio', 'Aquário', 'Peixes'],
  'en-US': ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'],
  'es-ES': ['Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo', 'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'],
  'it-IT': ['Ariete', 'Toro', 'Gemelli', 'Cancro', 'Leone', 'Vergine', 'Bilancia', 'Scorpione', 'Sagittario', 'Capricorno', 'Acquario', 'Pesci'],
}

export function translateSignName(value: string, language: AppLanguage = 'pt-BR'): string {
  const decoded = decodeUnicodeEscapes(value)
  const idx = SIGN_ALIAS_TO_INDEX[normalizeText(decoded)]
  if (idx == null) return decoded
  const names = SIGN_NAMES_BY_LANGUAGE[language] || SIGN_NAMES_BY_LANGUAGE['pt-BR']
  return names[idx] || decoded
}

export function getAspectSymbol(type: string): string {
  const key = normalizeText(type) as AspectType
  return ASPECT_SYMBOL[key] || type
}

export function formatTransitCompact(leftPlanet: string, aspectType: string, rightPlanet: string): string {
  return `${translatePlanetPT(leftPlanet)} ${getAspectSymbol(aspectType)} ${translatePlanetPT(rightPlanet)}`
}

export function getTransitState(window?: { start?: string | Date; exact?: string | Date; end?: string | Date }): 'aproxima' | 'agora' | 'se afasta' | '' {
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

export function formatPeakETA(window?: { start?: string | Date; exact?: string | Date }): string {
  if (!window) return ''
  const target = window.exact || window.start
  if (!target) return ''
  const diffMs = new Date(target).getTime() - Date.now()
  const sign = diffMs >= 0 ? 1 : -1
  const abs = Math.abs(diffMs)
  const days = Math.floor(abs / (24 * 60 * 60 * 1000))
  const hours = Math.floor((abs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000))
  const label = days > 0 ? `${days}d` : `${hours}h`
  return sign >= 0 ? `pico em ${label}` : `pico ha ${label}`
}

export function aspectNature(type: string): 'harmonico' | 'desafiador' | 'conjuncao' | 'outro' {
  const key = normalizeText(type)
  if (key === 'trigono' || key === 'sextil') return 'harmonico'
  if (key === 'quadratura' || key === 'oposicao') return 'desafiador'
  if (key === 'conjuncao') return 'conjuncao'
  return 'outro'
}

export function windowsIntersect(a?: { start?: any; end?: any }, b?: { start?: any; end?: any }): boolean {
  if (!a || !b || !a.start || !a.end || !b.start || !b.end) return false
  const as = new Date(a.start).getTime()
  const ae = new Date(a.end).getTime()
  const bs = new Date(b.start).getTime()
  const be = new Date(b.end).getTime()
  return as <= be && ae >= bs
}
