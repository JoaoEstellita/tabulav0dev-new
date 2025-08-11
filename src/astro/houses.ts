// Implementação genuína de Whole Sign e Equal usando astronomy-engine (ASC/MC precisos).
// Para Placidus, o app usa o backend. Arquivo minimalista e sem dependências internas.

import * as Astronomy from 'astronomy-engine'

export type HouseSystem = 'whole' | 'equal' | 'placidus'

const norm = (d: number) => (d % 360 + 360) % 360

function getObliquityRad(d: Date): number {
  try {
    const tilt = (Astronomy as any).EarthTilt?.(d)
    if (tilt && typeof tilt.obliquity === 'number') return tilt.obliquity * Math.PI / 180
  } catch {}
  // Meeus (mean obliquity) como fallback
  const jd = (d.getTime() / 86400000) + 2440587.5
  const T = (jd - 2451545.0) / 36525.0
  const seconds = 21.448 - 46.8150*T - 0.00059*T*T + 0.001813*T*T*T
  const epsDeg = 23 + (26/60) + (seconds/3600)
  return epsDeg * Math.PI/180
}

function calculateAscMc(date: Date, latDeg: number, lonDeg: number) {
  const gmstHours = Astronomy.SiderealTime(date)
  const lstHours = ((gmstHours + (lonDeg/15)) % 24 + 24) % 24
  const theta = lstHours * 15 * Math.PI/180
  const eps = getObliquityRad(date)
  const phi = latDeg * Math.PI/180
  const sin = Math.sin, cos = Math.cos, tan = Math.tan
  // MC
  const alphaMC = Math.atan2(tan(theta), cos(eps))
  let mc = Math.atan2(sin(alphaMC)/cos(eps), Math.cos(alphaMC)) * 180/Math.PI
  mc = norm(mc)
  // Ascendente
  let asc = Math.atan2(-cos(theta), (sin(theta)*cos(eps)) - (tan(phi)*Math.sin(eps))) * 180/Math.PI
  asc = norm(asc)
  return { asc, mc }
}

export async function computeHousesUTC(
  date: Date,
  lat: number,
  lon: number,
  system: HouseSystem
): Promise<{ cusps: number[]; asc: number; mc: number; approximate?: boolean }> {
  const { asc, mc } = calculateAscMc(date, lat, lon)
  if (system === 'whole') {
    const ascSign0 = Math.floor(asc/30)*30
    const cusps = Array.from({length:12}, (_,i)=> norm(ascSign0 + i*30))
    return { cusps, asc, mc, approximate: false }
  }
  if (system === 'equal') {
    const cusps = Array.from({length:12}, (_,i)=> norm(asc + i*30))
    return { cusps, asc, mc, approximate: false }
  }
  // placidus calculado no backend; devolver placeholder seguro
  return { cusps: Array.from({length:12},(_,i)=> norm(asc + i*30)), asc, mc, approximate: true }
}

