// Astronomia mínima para o BaZi — longitude eclíptica do Sol (analítica, Meeus
// low-precision, síncrona), termos solares por bisseção e Equation of Time.
const D2R = Math.PI / 180

export function jdFromDate(d: Date): number { return d.getTime() / 86400000 + 2440587.5 }
export function dateFromJd(jd: number): Date { return new Date((jd - 2440587.5) * 86400000) }

/** Longitude eclíptica APARENTE do Sol (0..360°). Meeus, precisão ~0.01°. */
export function sunLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525
  const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T
  const M = (357.52911 + 35999.05029 * T - 0.0001537 * T * T) * D2R
  const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(M)
    + (0.019993 - 0.000101 * T) * Math.sin(2 * M)
    + 0.000289 * Math.sin(3 * M)
  const trueLon = L0 + C
  const Om = (125.04 - 1934.136 * T) * D2R
  const app = trueLon - 0.00569 - 0.00478 * Math.sin(Om)
  return ((app % 360) + 360) % 360
}

/** Diferença angular assinada de `target` para `lon`, em -180..180. */
function angleTo(lon: number, target: number): number {
  return ((lon - target + 540) % 360) - 180
}

/** Instante (UTC) em que o Sol atinge `target`° no ano, começando no mês `aroundMonth` (1..12). */
export function solarTermInstant(year: number, target: number, aroundMonth: number): Date | null {
  let t = Date.UTC(year, aroundMonth - 1, 1)
  let prev = angleTo(sunLongitude(jdFromDate(new Date(t))), target)
  const step = 6 * 3600 * 1000
  for (let i = 0; i < 160; i++) { // até ~40 dias
    const t2 = t + step
    const cur = angleTo(sunLongitude(jdFromDate(new Date(t2))), target)
    if (prev < 0 && cur >= 0) {
      let lo = t, hi = t2
      for (let j = 0; j < 40; j++) {
        const mid = (lo + hi) / 2
        if (angleTo(sunLongitude(jdFromDate(new Date(mid))), target) < 0) lo = mid; else hi = mid
      }
      return new Date((lo + hi) / 2)
    }
    prev = cur; t = t2
  }
  return null
}

/** Equation of Time em MINUTOS (Meeus/NOAA). */
export function equationOfTime(jd: number): number {
  const T = (jd - 2451545.0) / 36525
  const eps = (23.439291 - 0.0130042 * T) * D2R // obliquidade
  const L0 = ((280.46646 + 36000.76983 * T + 0.0003032 * T * T) % 360) * D2R
  const M = (357.52911 + 35999.05029 * T - 0.0001537 * T * T) * D2R
  const e = 0.016708634 - 0.000042037 * T
  const y = Math.tan(eps / 2) ** 2
  const E = y * Math.sin(2 * L0) - 2 * e * Math.sin(M) + 4 * e * y * Math.sin(M) * Math.cos(2 * L0)
    - 0.5 * y * y * Math.sin(4 * L0) - 1.25 * e * e * Math.sin(2 * M)
  return E * 4 / D2R // radianos → minutos (×4×180/π)
}

/** Julian Day Number (inteiro, meia-noite) de uma data civil — para o Pilar do Dia. */
export function julianDayNumber(y: number, m: number, d: number): number {
  if (m <= 2) { y -= 1; m += 12 }
  const A = Math.floor(y / 100), B = 2 - A + Math.floor(A / 4)
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + B - 1524
}
