import type { HouseSystem } from './houseSystem'
import { normalizeHouseSystem } from './houseSystem'

// Utilidades matematicas puras para calculos de casas

export function norm360(deg: number): number {
  const d = deg % 360
  return d < 0 ? d + 360 : d
}

export function toRad(deg: number): number {
  return (deg * Math.PI) / 180
}

export function toDeg(rad: number): number {
  return (rad * 180) / Math.PI
}

// Arco anti-horario de a->b em graus (0..360)
export function angleDiffCCW(a: number, b: number): number {
  return norm360(norm360(b) - norm360(a))
}

export function wrapIndex(i: number, n = 12): number {
  return ((i % n) + n) % n
}

export function withinArcCCW(start: number, end: number, x: number, eps = 1e-9): boolean {
  const span = angleDiffCCW(start, end)
  const dx = angleDiffCCW(start, x)
  return dx > -eps && dx < span - eps
}

export function signIndexFromDegree(deg: number): number {
  return Math.floor(norm360(deg) / 30) % 12
}

export const SIGNS = [
  'Áries','Touro','Gêmeos','Câncer','Leão','Virgem','Libra','Escorpião','Sagitário','Capricórnio','Aquário','Peixes'
]

export function degToSign(deg: number): { sign: string; degInSign: number } {
  const d = norm360(deg)
  const idx = signIndexFromDegree(d)
  const degIn = d - idx * 30
  return { sign: SIGNS[idx], degInSign: degIn }
}

// Gera uma copia monotonic das cuspides a partir do ASC (C1), desenrolando 360 quando necessario
export function makeMonotonicCuspsFromAsc(cuspsDeg: number[]): number[] {
  if (!Array.isArray(cuspsDeg) || cuspsDeg.length !== 12) {
    throw new Error('12 cusps expected')
  }
  const out: number[] = []
  const base = norm360(cuspsDeg[0])
  out.push(base)
  let prev = base
  for (let i = 1; i < 12; i++) {
    let x = norm360(cuspsDeg[i])
    while (x <= prev) x += 360
    out.push(x)
    prev = x
  }
  const arcs = out.map((c, i) => ((i < 11 ? out[i + 1] : out[0] + 360) - c))
  const okArcs = arcs.every(a => a > 0 && a < 180)
  const sum = arcs.reduce((a, b) => a + b, 0)
  if (!okArcs || Math.abs(sum - 360) > 0.2) {
    throw new Error(`Invalid house arcs (sum=${sum.toFixed(3)})`)
  }
  return out
}

type GetPlanetHouseInput = {
  planetLongitude: number
  ascLongitude: number
  houseCusps?: number[] | null
  system: HouseSystem
}

export function getPlanetHouse({ planetLongitude, ascLongitude, houseCusps, system }: GetPlanetHouseInput): number {
  const resolved = normalizeHouseSystem(system)

  if (resolved === 'whole-sign' || resolved === 'psychological-shift') {
    const ascSignIndex = signIndexFromDegree(ascLongitude)
    const planetSignIndex = signIndexFromDegree(planetLongitude)
    const delta = (planetSignIndex - ascSignIndex + 12) % 12
    const houseWS = delta + 1
    if (resolved === 'psychological-shift') {
      return (houseWS % 12) + 1
    }
    return houseWS
  }

  if (!Array.isArray(houseCusps) || houseCusps.length < 12) {
    const ascSignIndex = signIndexFromDegree(ascLongitude)
    const planetSignIndex = signIndexFromDegree(planetLongitude)
    const delta = (planetSignIndex - ascSignIndex + 12) % 12
    return delta + 1
  }

  const normCusps = houseCusps.slice(0, 12).map((c) => norm360(Number(c)))
  const unwrapped = [normCusps[0]]
  for (let i = 1; i < 12; i++) {
    let v = normCusps[i]
    while (v < unwrapped[i - 1]) v += 360
    unwrapped.push(v)
  }
  unwrapped.push(unwrapped[0] + 360)

  let lon = norm360(Number(planetLongitude))
  while (lon < unwrapped[0]) lon += 360
  while (lon >= unwrapped[0] + 360) lon -= 360

  for (let i = 0; i < 12; i++) {
    const start = unwrapped[i]
    const end = unwrapped[i + 1]
    if (lon >= start && lon < end) return i + 1
  }

  let minDistance = Infinity
  let closest = 1
  for (let i = 0; i < 12; i++) {
    const d = Math.min(
      Math.abs(lon - unwrapped[i]),
      Math.abs(lon - (unwrapped[i] + 360)),
      Math.abs(lon - (unwrapped[i] - 360))
    )
    if (d < minDistance) {
      minDistance = d
      closest = i + 1
    }
  }

  return closest
}
