import type { TzolkinKin, TzolkinProfile, FifthForceOracle, OraclePosition, Wavespell, Castle, EarthFamilyKey } from './types'
import { SEALS, TONES, COLOR_LABELS } from './constants'

const BASE_YEAR = 1987, BASE_MONTH = 7, BASE_DAY = 26, BASE_KIN = 34

export function mod(a: number, n: number): number { return ((a % n) + n) % n }

function isLeap(y: number): boolean { return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0 }
function leapsBefore(y: number): number { const n = y - 1; return Math.floor(n / 4) - Math.floor(n / 100) + Math.floor(n / 400) }
function feb29OnOrBefore(y: number, m: number, d: number): number {
  let c = leapsBefore(y)
  if (isLeap(y) && (m > 2 || (m === 2 && d === 29))) c += 1
  return c
}
// Ordinal Dreamspell: dias civis (UTC) menos os 29/02 já passados — o 29/02 não avança o Kin.
function ordinal(y: number, m: number, d: number): number {
  return Math.round(Date.UTC(y, m - 1, d) / 86400000) - feb29OnOrBefore(y, m, d)
}
function parseISO(iso: string): { y: number, m: number, d: number } {
  const [y, m, d] = iso.slice(0, 10).split('-').map(Number)
  return { y, m, d }
}

const BASE_ORD = ordinal(BASE_YEAR, BASE_MONTH, BASE_DAY)

export function kinOfDate(iso: string): number {
  const { y, m, d } = parseISO(iso)
  return mod((BASE_KIN - 1) + (ordinal(y, m, d) - BASE_ORD), 260) + 1
}

/** Ordinal de dias civis ignorando 29/02 (usado pelo calendário das 13 Luas). */
export function dayOrdinal(iso: string): number { const { y, m, d } = parseISO(iso); return ordinal(y, m, d) }

export function sealOf(kin: number): number { return ((kin - 1) % 20) + 1 }
export function toneOf(kin: number): number { return ((kin - 1) % 13) + 1 }
export function colorIndexOf(seal: number): number { return (seal - 1) % 4 }

export function calculateKin(iso: string): TzolkinKin {
  const { m, d } = parseISO(iso)
  const isHunabKuLeapDay = m === 2 && d === 29
  const kin = kinOfDate(iso)
  const seal = sealOf(kin)
  return { kin, seal, tone: toneOf(kin), colorIndex: colorIndexOf(seal), isHunabKuLeapDay }
}

// ── Oráculo da Quinta Força ────────────────────────────────────────────────
function kinFromToneSeal(tone: number, seal: number): number {
  for (let k = 1; k <= 260; k++) if (toneOf(k) === tone && sealOf(k) === seal) return k
  return 0 // impossível: 13 e 20 são coprimos → sempre existe um Kin
}
/** Kin único (1..260) com o selo e o tom dados. */
export function kinBySealTone(seal: number, tone: number): number { return kinFromToneSeal(tone, seal) }
function pos(kin: number): OraclePosition { return { kin, seal: sealOf(kin), tone: toneOf(kin) } }
function guideOffset(tone: number): number {
  if (tone === 1 || tone === 6 || tone === 11) return 0
  if (tone === 2 || tone === 7 || tone === 12) return 12
  if (tone === 3 || tone === 8 || tone === 13) return 4
  if (tone === 4 || tone === 9) return -4
  return 8 // 5, 10
}

export function getOracle(kin: number): FifthForceOracle {
  const t = toneOf(kin), s = sealOf(kin)
  const analogSeal = mod(18 - s, 20) + 1
  const antipodeSeal = mod((s - 1) + 10, 20) + 1
  const guideSeal = mod((s - 1) + guideOffset(t), 20) + 1
  return {
    destiny: pos(kin),
    guide: pos(kinFromToneSeal(t, guideSeal)),
    analog: pos(kinFromToneSeal(t, analogSeal)),
    antipode: pos(kinFromToneSeal(t, antipodeSeal)),
    occult: pos(261 - kin),
  }
}

// ── Onda / Castelo / Família ───────────────────────────────────────────────
export function getWavespell(kin: number): Wavespell {
  const index = Math.floor((kin - 1) / 13) + 1
  const position = ((kin - 1) % 13) + 1
  const startKin = (index - 1) * 13 + 1
  return { index, position, startKin, rulingSeal: sealOf(startKin) }
}

const CASTLES: Castle[] = [
  { index: 1, key: 'red', startKin: 1, endKin: 52 },
  { index: 2, key: 'white', startKin: 53, endKin: 104 },
  { index: 3, key: 'blue', startKin: 105, endKin: 156 },
  { index: 4, key: 'yellow', startKin: 157, endKin: 208 },
  { index: 5, key: 'green', startKin: 209, endKin: 260 },
]
export function getCastle(kin: number): Castle {
  return CASTLES.find(c => kin >= c.startKin && kin <= c.endKin) as Castle
}

const EARTH_FAMILY: Record<number, EarthFamilyKey> = {
  9: 'portal', 14: 'portal', 19: 'portal', 4: 'portal',
  5: 'polar', 10: 'polar', 15: 'polar', 20: 'polar',
  1: 'cardinal', 6: 'cardinal', 11: 'cardinal', 16: 'cardinal',
  17: 'core', 2: 'core', 7: 'core', 12: 'core',
  13: 'signal', 18: 'signal', 3: 'signal', 8: 'signal',
}
export function getEarthFamily(seal: number): EarthFamilyKey { return EARTH_FAMILY[seal] }

// ── Nome de exibição (Selo + Tom + Cor, concordância pt-BR) ─────────────────
// Selos de gênero feminino em pt-BR → cor no feminino (Vermelha/Branca/Amarela; Azul invariável).
const FEMININE_SEALS = new Set([3, 4, 5, 7, 8, 9, 15, 17, 19]) // Noite, Semente, Serpente, Mão, Estrela, Lua, Águia, Terra, Tormenta
function colorWord(seal: number, locale: string): string {
  const c = SEALS[seal - 1].color
  if (!locale.startsWith('pt')) return COLOR_LABELS[c].en
  const base = COLOR_LABELS[c].pt
  return FEMININE_SEALS.has(seal) ? base.replace(/o$/, 'a') : base
}
export function getKinDisplayName(kin: number, locale = 'pt-BR'): string {
  const s = SEALS[sealOf(kin) - 1], t = TONES[toneOf(kin) - 1]
  const sealName = locale.startsWith('pt') ? s.namePt : s.nameEn
  const toneName = locale.startsWith('pt') ? t.namePt : t.nameEn
  return `${sealName} ${toneName} ${colorWord(sealOf(kin), locale)}`
}

export function buildProfile(iso: string): TzolkinProfile {
  const base = calculateKin(iso)
  return {
    ...base,
    oracle: getOracle(base.kin),
    wavespell: getWavespell(base.kin),
    castle: getCastle(base.kin),
    earthFamily: getEarthFamily(base.seal),
  }
}
