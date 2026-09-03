/**
 * Vimshottari Dasha — ciclo de 120 anos de períodos planetários (Mahadasha),
 * a espinha dorsal preditiva do Jyotish. A dasha vigente no nascimento é a do
 * regente da Janma Nakshatra; o "saldo" no nascimento = fração ainda NÃO
 * percorrida da nakshatra × os anos daquele regente. v1 = só Mahadasha (o
 * "período de vida atual"); Antardasha aninhada fica para depois.
 */
import { NAKSHATRA_ARC, nakshatraFromSidereal } from './nakshatra'

// Ordem e durações fixas (anos). Somam 120.
export const VIMSHOTTARI: Array<{ lord: string; years: number }> = [
  { lord: 'ketu', years: 7 },
  { lord: 'venus', years: 20 },
  { lord: 'sun', years: 6 },
  { lord: 'moon', years: 10 },
  { lord: 'mars', years: 7 },
  { lord: 'rahu', years: 18 },
  { lord: 'jupiter', years: 16 },
  { lord: 'saturn', years: 19 },
  { lord: 'mercury', years: 17 },
]

const YEAR_MS = 365.25 * 24 * 3600 * 1000

export interface DashaPeriod {
  lord: string
  start: Date
  end: Date
}

/** Linha do tempo de Mahadashas a partir da longitude sideral da Lua + nascimento. */
export function buildDashaTimeline(moonSiderealLon: number, birthDate: Date): DashaPeriod[] {
  const { nakshatra } = nakshatraFromSidereal(moonSiderealLon)
  const lon = ((moonSiderealLon % 360) + 360) % 360
  const within = lon - nakshatra.index * NAKSHATRA_ARC
  const fractionTraversed = within / NAKSHATRA_ARC

  const startIdx = VIMSHOTTARI.findIndex((v) => v.lord === nakshatra.lord)
  const balanceYears = VIMSHOTTARI[startIdx].years * (1 - fractionTraversed)

  const periods: DashaPeriod[] = []
  let cursor = birthDate.getTime()

  // 1º período: saldo restante do regente da nakshatra.
  let end = cursor + balanceYears * YEAR_MS
  periods.push({ lord: VIMSHOTTARI[startIdx].lord, start: new Date(cursor), end: new Date(end) })
  cursor = end

  // Demais regentes, na ordem, cada um por inteiro (cobre >120 anos a partir daqui).
  for (let k = 1; k < VIMSHOTTARI.length; k++) {
    const v = VIMSHOTTARI[(startIdx + k) % VIMSHOTTARI.length]
    end = cursor + v.years * YEAR_MS
    periods.push({ lord: v.lord, start: new Date(cursor), end: new Date(end) })
    cursor = end
  }
  return periods
}

/** Mahadasha vigente em `now` (default = agora). null se fora da timeline. */
export function currentDasha(moonSiderealLon: number, birthDate: Date, now: Date = new Date()): DashaPeriod | null {
  const t = now.getTime()
  const timeline = buildDashaTimeline(moonSiderealLon, birthDate)
  return timeline.find((p) => t >= p.start.getTime() && t < p.end.getTime()) || null
}

/** Antardashas (Bhukti) DENTRO de uma Mahadasha. Cada uma = total × (anos/120),
 * em ordem Vimshottari começando pelo lorde da Mahadasha. */
export function buildAntardashas(maha: DashaPeriod): DashaPeriod[] {
  const totalMs = maha.end.getTime() - maha.start.getTime()
  const startIdx = VIMSHOTTARI.findIndex((v) => v.lord === maha.lord)
  if (startIdx < 0) return []
  const out: DashaPeriod[] = []
  let cursor = maha.start.getTime()
  for (let k = 0; k < VIMSHOTTARI.length; k++) {
    const v = VIMSHOTTARI[(startIdx + k) % VIMSHOTTARI.length]
    const end = cursor + totalMs * (v.years / 120)
    out.push({ lord: v.lord, start: new Date(cursor), end: new Date(end) })
    cursor = end
  }
  return out
}

/** Antardasha vigente + a lista, dentro da Mahadasha atual. null se fora. */
export function currentAntardasha(moonSiderealLon: number, birthDate: Date, now: Date = new Date()):
  { maha: DashaPeriod; antars: DashaPeriod[]; current: DashaPeriod | null } | null {
  const maha = currentDasha(moonSiderealLon, birthDate, now)
  if (!maha) return null
  const antars = buildAntardashas(maha)
  const t = now.getTime()
  const current = antars.find((a) => t >= a.start.getTime() && t < a.end.getTime()) || null
  return { maha, antars, current }
}
