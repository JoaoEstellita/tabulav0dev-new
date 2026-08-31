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
