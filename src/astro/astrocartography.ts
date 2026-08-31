import { Body, Equator, SiderealTime, Observer, AstroTime } from 'astronomy-engine'
import type { Planet } from './planets'

// Astrocartografia — linhas planetárias no globo (F1: MC/IC).
// Um planeta está na MC (culminando no meridiano local) na longitude geográfica
// onde a hora sideral local = ascensão reta do planeta:
//   lon_MC = norm180((RA_horas − GAST_horas) × 15). IC = lon_MC + 180.
// RA/dec via astronomy-engine (of-date, aparente). Validado: Sol às 14:30 UTC → ~−38°.

const BODIES: { planet: Planet; body: Body }[] = [
  { planet: 'Sun', body: Body.Sun }, { planet: 'Moon', body: Body.Moon },
  { planet: 'Mercury', body: Body.Mercury }, { planet: 'Venus', body: Body.Venus },
  { planet: 'Mars', body: Body.Mars }, { planet: 'Jupiter', body: Body.Jupiter },
  { planet: 'Saturn', body: Body.Saturn }, { planet: 'Uranus', body: Body.Uranus },
  { planet: 'Neptune', body: Body.Neptune }, { planet: 'Pluto', body: Body.Pluto },
]

const norm180 = (x: number) => (((x + 180) % 360) + 360) % 360 - 180

export type AstroLine = { planet: Planet; ra: number; dec: number; lonMC: number; lonIC: number }

const D = Math.PI / 180
export type Pt = { lat: number; lon: number }
export type HorizonCurve = { planet: Planet; asc: Pt[]; dsc: Pt[] }

/**
 * Curvas ASC (nascer) e DSC (pôr) de cada planeta: onde ele está no horizonte
 * leste/oeste. Hora angular no horizonte: cos(H) = −tan(lat)·tan(dec). Latitudes
 * onde |...|>1 são circumpolares (o planeta não nasce/põe) e são puladas.
 * Validado: Sol no equador → ASC ~−128°, DSC ~+52°.
 */
export function horizonCurves(dateUTC: Date, latMin = -72, latMax = 72, step = 2): HorizonCurve[] {
  const t = new AstroTime(dateUTC)
  const obs = new Observer(0, 0, 0)
  const gast = SiderealTime(t)
  const out: HorizonCurve[] = []
  for (const { planet, body } of BODIES) {
    try {
      const eq = Equator(body, t, obs, true, true)
      const alpha = eq.ra
      const dec = eq.dec
      const asc: Pt[] = []
      const dsc: Pt[] = []
      for (let phi = latMin; phi <= latMax; phi += step) {
        const c = -Math.tan(phi * D) * Math.tan(dec * D)
        if (Math.abs(c) > 1) continue // circumpolar
        const H = Math.acos(c) / D / 15 // horas
        asc.push({ lat: phi, lon: norm180(((-H + alpha) - gast) * 15) })
        dsc.push({ lat: phi, lon: norm180(((H + alpha) - gast) * 15) })
      }
      out.push({ planet, asc, dsc })
    } catch { /* pula planeta que falhar */ }
  }
  return out
}

/** Linhas MC/IC de cada planeta para o instante UTC dado. */
export function planetaryLines(dateUTC: Date): AstroLine[] {
  const t = new AstroTime(dateUTC)
  const obs = new Observer(0, 0, 0)
  const gast = SiderealTime(t) // horas (Greenwich apparent sidereal time)
  const out: AstroLine[] = []
  for (const { planet, body } of BODIES) {
    try {
      const eq = Equator(body, t, obs, true, true) // ra (horas), dec (graus)
      const lonMC = norm180((eq.ra - gast) * 15)
      out.push({ planet, ra: eq.ra, dec: eq.dec, lonMC, lonIC: norm180(lonMC + 180) })
    } catch { /* pula planeta que falhar */ }
  }
  return out
}
