import { SiderealTime } from 'astronomy-engine'
import { angleDiffCCW, norm360, toDeg, toRad, withinArcCCW, makeMonotonicCuspsFromAsc } from './houses.math'
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

  // "Desenrolar" cúspides para garantir monotonicidade e partição correta
  const cusps0to360 = cusps.map(x => norm360(x))
  let cuspsMono: number[]
  try {
    cuspsMono = makeMonotonicCuspsFromAsc(cusps0to360)
  } catch {
    // se falhar por algum motivo, cai no Equal como fallback local para não quebrar a UI
    cuspsMono = Array.from({ length: 12 }, (_, i) => norm360(asc + i * 30))
  }

  const EPS = 0.03
  function pickHouseForLongitude(Ldeg: number, mono: number[]): number {
    const c13 = mono[0] + 360
    for (let i = 0; i < 12; i++) {
      const a = mono[i]
      const b = (i === 11) ? c13 : mono[i + 1]
      let L = norm360(Ldeg)
      // alinhar L ao segmento corrente [a,b)
      while (L < a) L += 360
      while (L >= b) L -= 360
      if (Math.abs(L - a) < EPS) return ((i + 1) % 12) + 1
      if (L >= a && L < b) return i + 1
    }
    return 12
  }

  // Mapeamento planeta → casa usando cúspides monotônicas
  const planetHouses: Record<Planet, number> = {} as any
  for (const p of Object.keys(planetLongitudes) as Planet[]) {
    const L = planetLongitudes[p]
    planetHouses[p] = pickHouseForLongitude(L, cuspsMono)
  }

  if (process.env.NODE_ENV !== 'production') {
    try {
      const arcs = cuspsMono.map((c, i) => (i < 11 ? cuspsMono[i + 1] : cuspsMono[0] + 360) - c)
      // eslint-disable-next-line no-console
      console.debug('HOUSES MONO OK?', {
        asc: cuspsMono[0],
        mc,
        arcsMin: Math.min(...arcs).toFixed(3),
        arcsMax: Math.max(...arcs).toFixed(3),
        arcsSum: arcs.reduce((a, b) => a + b, 0).toFixed(3),
      })
    } catch {}
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


