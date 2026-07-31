/**
 * Mapa Rasi (D1) védico — posições SIDERAIS de todos os planetas + Lagna
 * (ascendente sideral) + casas whole-sign (padrão Jyotish). Puro/determinístico.
 * Reusa tropicalToSidereal (Lahiri), RASHIS e nakshatraFromTropical.
 *
 * Casa whole-sign: a casa 1 é o signo INTEIRO da Lagna; cada signo seguinte é a
 * próxima casa. house = ((rashiDoPlaneta − rashiDaLagna + 12) % 12) + 1.
 */
import type { RealPlanetPosition } from '../../services/astrology/RealAstrologyEngine'
import { tropicalToSidereal } from './ayanamsa'
import { RASHIS, nakshatraFromTropical, type NakshatraResult } from './nakshatra'

export interface VedicChartPlanet {
  name: string // chave do motor ('Sun', 'Moon', ...)
  siderealLon: number
  rashiIndex: number // 0–11
  rashiName: string
  house: number // 1–12 (whole-sign a partir da Lagna)
  retro: boolean
}

export interface VedicChart {
  lagna: { rashiIndex: number; rashiName: string; siderealLon: number }
  planets: VedicChartPlanet[]
  moonNakshatra: NakshatraResult | null
}

/**
 * Monta o mapa Rasi. null se faltar ASC ou data válida.
 * @param natalPlanets posições natais (longitude TROPICAL) — de transitData.currentTransits.natalPlanets
 * @param ascDeg longitude TROPICAL do Ascendente
 * @param birthDate data de nascimento (para o ayanamsa)
 */
export function buildVedicChart(
  natalPlanets: RealPlanetPosition[] | null | undefined,
  ascDeg: number,
  birthDate: Date
): VedicChart | null {
  if (!Number.isFinite(Number(ascDeg)) || !(birthDate instanceof Date) || Number.isNaN(birthDate.getTime())) {
    return null
  }
  const lagnaSid = tropicalToSidereal(Number(ascDeg), birthDate)
  const lagnaIndex = Math.floor(lagnaSid / 30) % 12

  const planets: VedicChartPlanet[] = (natalPlanets || [])
    .filter((p) => p && Number.isFinite(Number(p.longitude)))
    .map((p) => {
      const sid = tropicalToSidereal(Number(p.longitude), birthDate)
      const rIndex = Math.floor(sid / 30) % 12
      return {
        name: String(p.name),
        siderealLon: sid,
        rashiIndex: rIndex,
        rashiName: RASHIS[rIndex].name,
        house: ((rIndex - lagnaIndex + 12) % 12) + 1,
        retro: (p as any).isRetrograde === true,
      }
    })

  const moon = (natalPlanets || []).find((p) => String(p?.name || '').toLowerCase() === 'moon')
  const moonNakshatra = moon && Number.isFinite(Number(moon.longitude))
    ? nakshatraFromTropical(Number(moon.longitude), birthDate)
    : null

  return {
    lagna: { rashiIndex: lagnaIndex, rashiName: RASHIS[lagnaIndex].name, siderealLon: lagnaSid },
    planets,
    moonNakshatra,
  }
}
