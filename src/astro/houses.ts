import { SiderealTime } from 'astronomy-engine'
import { angleDiffCCW, norm360, toDeg, toRad, withinArcCCW } from './houses.math'
import { PLANETS, Planet, getPlanetEclipticLongitude } from './planets'
import { getCachedHouses, makeKey, setCachedHouses } from './cache'

export type HouseSystem = 'whole' | 'equal' | 'placidus'

export interface HouseResult {
  system: HouseSystem
  asc: number
  mc: number
  cusps: number[] // 12 valores 0–360
  planetLongitudes: Record<Planet, number>
  planetHouses: Record<Planet, number>
  /** true quando o sistema 'placidus' precisou cair em aproximação/fallback */
  approximate?: boolean
}

const OBLIQUITY_DEG = 23.4392911 // obliquidade média (WGS)

export function computeAscMc(dateUTC: Date, latDeg: number, lonDeg: number): { asc: number; mc: number } {
  const lstHours = SiderealTime(dateUTC, lonDeg) // horas
  const theta = toRad(lstHours * 15) // AR do meridiano
  const eps = toRad(OBLIQUITY_DEG)
  const phi = toRad(latDeg)

  // MC: converter AR=theta em longitude eclíptica (ponto na eclíptica)
  // Fórmula estável: λ = atan2(sin α / cos ε, cos α)
  const mc = norm360(toDeg(Math.atan2(Math.sin(theta) / Math.cos(eps), Math.cos(theta))))

  // Ascendente (Meeus):
  // tan(λ) = 1 / (cos ε tan φ + sin ε sin α / cos α)
  const sinA = Math.sin(theta)
  const cosA = Math.cos(theta)
  const num = 1
  const den = Math.cos(eps) * Math.tan(phi) + (Math.sin(eps) * (sinA / cosA))
  let asc = toDeg(Math.atan2(num, den))
  if (asc < 0) asc += 360
  asc = norm360(asc)

  return { asc, mc }
}

export async function computeHousesUTC(
  dateUTC: Date,
  lat: number,
  lon: number,
  system: HouseSystem = 'whole'
): Promise<HouseResult> {
  const cacheKey = makeKey(dateUTC, lat, lon, system)
  const cached = getCachedHouses(cacheKey)
  if (cached) return cached
  const { asc, mc } = computeAscMc(dateUTC, lat, lon)

  // Cúspides
  let cusps: number[] = []
  let approximate = false as any
  if (system === 'whole') {
    const ascSign0 = Math.floor(asc / 30) * 30
    for (let i = 0; i < 12; i++) cusps.push(norm360(ascSign0 + i * 30))
  } else if (system === 'equal') {
    for (let i = 0; i < 12; i++) cusps.push(norm360(asc + i * 30))
  } else if (system === 'placidus') {
    const { computePlacidusCusps } = await import('./houses.placidus')
    const res = computePlacidusCusps(dateUTC, lat, lon, asc, mc)
    cusps = res.cusps
    approximate = res.approximate
  }

  // Longitudes planetárias
  const planetLongitudes: Record<Planet, number> = {} as any
  for (const name of Object.keys(PLANETS) as Planet[]) {
    planetLongitudes[name] = getPlanetEclipticLongitude(dateUTC, PLANETS[name])
  }

  // Mapeamento planeta → casa
  const planetHouses: Record<Planet, number> = {} as any
  const epsDeg = 0.03
  for (const p of Object.keys(planetLongitudes) as Planet[]) {
    const L = planetLongitudes[p]
    let found = 12
    for (let i = 0; i < 12; i++) {
      const a = cusps[i]
      const b = cusps[(i + 1) % 12]
      const distA = Math.abs(angleDiffCCW(a, L))
      const distB = Math.abs(angleDiffCCW(b, L))
      // Intervalo semiaberto [a, b):
      if (distA < epsDeg) { found = i + 1; break }
      if (distB < epsDeg) { found = ((i + 1) % 12) + 1; break }
      if (withinArcCCW(a, b, L, 1e-9)) { found = i + 1; break }
    }
    planetHouses[p] = found
  }

  const result: HouseResult = {
    system,
    asc,
    mc,
    cusps,
    planetLongitudes,
    planetHouses,
    // @ts-expect-error: campo opcional usado pela UI
    approximate,
  }
  setCachedHouses(cacheKey, result)
  return result
}


