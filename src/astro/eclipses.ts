import { SearchGlobalSolarEclipse, NextGlobalSolarEclipse, SearchLunarEclipse, NextLunarEclipse, Body } from 'astronomy-engine'
import { getPlanetEclipticLongitude } from './planets'

// Próximos eclipses (solar + lunar) — client-side (astronomy-engine). O signo vem
// da longitude do Sol (solar) ou da Lua (lunar) no pico. A casa é pessoal (cúspides).

export type EclipseItem = {
  type: 'solar' | 'lunar'
  kind: string // total | partial | annular | penumbral
  date: Date
  longitude: number
}

export function upcomingEclipses(from: Date = new Date(), count = 4): EclipseItem[] {
  const out: EclipseItem[] = []
  try {
    // Solar
    let s = SearchGlobalSolarEclipse(from)
    for (let i = 0; i < count && s; i++) {
      const date = s.peak.date
      out.push({ type: 'solar', kind: String(s.kind), date, longitude: getPlanetEclipticLongitude(date, Body.Sun) })
      s = NextGlobalSolarEclipse(s.peak)
    }
  } catch { /* ignora */ }
  try {
    // Lunar
    let l = SearchLunarEclipse(from)
    for (let i = 0; i < count && l; i++) {
      const date = l.peak.date
      out.push({ type: 'lunar', kind: String(l.kind), date, longitude: getPlanetEclipticLongitude(date, Body.Moon) })
      l = NextLunarEclipse(l.peak)
    }
  } catch { /* ignora */ }
  return out.sort((a, b) => a.date.getTime() - b.date.getTime()).slice(0, count)
}

/** Casa da longitude a partir das cúspides natais (12 longitudes). null se indisponível. */
export function houseFromCusps(longitude: number, cusps?: number[] | null): number | null {
  if (!Array.isArray(cusps) || cusps.length < 12) return null
  const L = (((Number(longitude) || 0) % 360) + 360) % 360
  for (let i = 0; i < 12; i++) {
    const a = ((Number(cusps[i]) % 360) + 360) % 360
    const b = ((Number(cusps[(i + 1) % 12]) % 360) + 360) % 360
    const span = (((b - a) % 360) + 360) % 360
    const rel = (((L - a) % 360) + 360) % 360
    if (span === 0 || rel < span) return i + 1
  }
  return null
}
