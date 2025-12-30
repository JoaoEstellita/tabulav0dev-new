/**
 * Equal/whole-sign support using astronomy-engine (ASC/MC).
 * Placidus is computed on the backend.
 */

import * as Astronomy from 'astronomy-engine'
import type { HouseSystem } from './houseSystem'
import { normalizeHouseSystem } from './houseSystem'

/**
 * Normalize an angle to 0..360 degrees.
 */
const norm = (d: number) => (d % 360 + 360) % 360

/**
 * Mean obliquity of the ecliptic in radians.
 */
function getObliquityRad(d: Date): number {
  try {
    const tilt = (Astronomy as any).EarthTilt?.(d)
    if (tilt && typeof tilt.obliquity === 'number') return tilt.obliquity * Math.PI / 180
  } catch {}
  const jd = (d.getTime() / 86400000) + 2440587.5
  const T = (jd - 2451545.0) / 36525.0
  const seconds = 21.448 - 46.8150 * T - 0.00059 * T * T + 0.001813 * T * T * T
  const epsDeg = 23 + (26 / 60) + (seconds / 3600)
  return epsDeg * Math.PI / 180
}

/**
 * Compute ASC and MC for a given date and coordinates.
 */
function calculateAscMc(date: Date, latDeg: number, lonDeg: number) {
  const gmstHours = Astronomy.SiderealTime(date)
  const lstHours = ((gmstHours + (lonDeg / 15)) % 24 + 24) % 24
  const theta = lstHours * 15 * Math.PI / 180
  const eps = getObliquityRad(date)
  const phi = latDeg * Math.PI / 180
  const sin = Math.sin, cos = Math.cos, tan = Math.tan

  let alphaMC = Math.atan2(tan(theta), cos(eps))
  if (Math.cos(theta) < 0) {
    alphaMC += Math.PI
  }
  let mc = Math.atan2(sin(alphaMC) / cos(eps), Math.cos(alphaMC)) * 180 / Math.PI
  mc = norm(mc)

  let asc = Math.atan2(cos(theta), -sin(theta) * cos(eps) + tan(phi) * sin(eps)) * 180 / Math.PI
  asc = norm(asc)

  return { asc, mc }
}

export type HouseResult = {
  cusps: number[]
  asc: number
  mc: number
  approximate?: boolean
  system?: HouseSystem
  systemEffective?: HouseSystem
}

function buildWholeSignCusps(asc: number): number[] {
  const ascSignStart = Math.floor(norm(asc) / 30) * 30
  return Array.from({ length: 12 }, (_, i) => norm(ascSignStart + i * 30))
}

/**
 * Compute house cusps for a given system.
 */
export async function computeHousesUTC(
  date: Date,
  lat: number,
  lon: number,
  system: HouseSystem
): Promise<HouseResult> {
  const { asc, mc } = calculateAscMc(date, lat, lon)
  const resolvedSystem = normalizeHouseSystem(system)

  if (resolvedSystem === 'whole-sign' || resolvedSystem === 'psychological-shift') {
    return {
      cusps: buildWholeSignCusps(asc),
      asc,
      mc,
      approximate: false,
      system: resolvedSystem,
      systemEffective: 'whole-sign'
    }
  }

  return {
    cusps: Array.from({ length: 12 }, (_, i) => norm(asc + i * 30)),
    asc,
    mc,
    approximate: true,
    system: resolvedSystem
  }
}
