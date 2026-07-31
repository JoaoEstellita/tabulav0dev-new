/**
 * Astrologia Védica (Jyotish) — API de alto nível.
 *
 * Lente SIDERAL (ayanamsa Lahiri) complementar à ocidental (tropical). Tudo puro
 * e determinístico. A nakshatra/rashi vêm da LONGITUDE DA LUA (tropical → sideral
 * na data de nascimento); o Dasha usa a mesma longitude + a data.
 */
import type { RealPlanetPosition } from '../../services/astrology/RealAstrologyEngine'
import { nakshatraFromTropical, type NakshatraResult } from './nakshatra'
import { currentDasha, type DashaPeriod } from './dasha'
import { computeGunaMilan, type GunaMilanResult } from './gunaMilan'
import { tropicalToSidereal } from './ayanamsa'

export * from './ayanamsa'
export * from './nakshatra'
export * from './gunaMilan'
export * from './dasha'
export * from './chart'

/** Longitude tropical da Lua a partir de uma lista de posições natais. */
export function moonLongitudeFrom(positions: RealPlanetPosition[] | null | undefined): number | null {
  const moon = (positions || []).find((p) => String(p?.name || '').toLowerCase() === 'moon')
  const lon = Number(moon?.longitude)
  return Number.isFinite(lon) ? lon : null
}

export interface VedicProfile {
  nakshatra: NakshatraResult
  dasha: DashaPeriod | null
}

/** Perfil védico de uma pessoa (nakshatra+pada+rashi + Mahadasha atual). */
export function buildVedicProfile(
  positions: RealPlanetPosition[] | null | undefined,
  birthDate: Date,
  now: Date = new Date()
): VedicProfile | null {
  const moonLon = moonLongitudeFrom(positions)
  if (moonLon === null || !(birthDate instanceof Date) || Number.isNaN(birthDate.getTime())) return null
  const nakshatra = nakshatraFromTropical(moonLon, birthDate)
  const dasha = currentDasha(tropicalToSidereal(moonLon, birthDate), birthDate, now)
  return { nakshatra, dasha }
}

/** Nakshatra a partir de posições + data (helper direto). null se não achar a Lua. */
export function nakshatraOf(
  positions: RealPlanetPosition[] | null | undefined,
  date: Date
): NakshatraResult | null {
  const moonLon = moonLongitudeFrom(positions)
  return moonLon === null ? null : nakshatraFromTropical(moonLon, date)
}

/** Guna Milan entre duas pessoas (cada uma: posições natais + data de nascimento). */
export function gunaMilanBetween(
  aPositions: RealPlanetPosition[] | null | undefined,
  aBirth: Date,
  bPositions: RealPlanetPosition[] | null | undefined,
  bBirth: Date
): GunaMilanResult | null {
  const a = nakshatraOf(aPositions, aBirth)
  const b = nakshatraOf(bPositions, bBirth)
  if (!a || !b) return null
  return computeGunaMilan(a, b)
}
