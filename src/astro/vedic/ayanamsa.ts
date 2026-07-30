/**
 * Ayanamsa de Lahiri (Chitrapaksha) — o deslocamento entre o zodíaco TROPICAL
 * (usado pelo resto do app, ocidental) e o SIDERAL (usado no Jyotish/védico).
 *
 * sideral = tropical − ayanamsa
 *
 * Âncora: J2000.0 (2000-01-01 12:00 TT) ≈ 23.853° (Swiss Ephemeris SE_SIDM_LAHIRI).
 * Precessão ~50.288"/ano. Para nakshatra (13°20') e pada (3°20') um modelo linear
 * é preciso de sobra em qualquer ano de nascimento humano — o desvio vs. precessão
 * real ao longo de ±60 anos de J2000 fica bem abaixo de 0,03°.
 */

const AYANAMSA_J2000_DEG = 23.853
const PRECESSION_DEG_PER_YEAR = 50.288 / 3600 // ≈ 0.0139689°/ano
const J2000_MS = Date.UTC(2000, 0, 1, 12, 0, 0)
const JULIAN_YEAR_MS = 365.25 * 24 * 3600 * 1000

/** Ayanamsa de Lahiri em graus para uma data. */
export function lahiriAyanamsa(date: Date): number {
  const years = (date.getTime() - J2000_MS) / JULIAN_YEAR_MS
  return AYANAMSA_J2000_DEG + PRECESSION_DEG_PER_YEAR * years
}

/** Converte uma longitude eclíptica tropical (0–360) para sideral (Lahiri), normalizada. */
export function tropicalToSidereal(tropicalLon: number, date: Date): number {
  const sid = (tropicalLon - lahiriAyanamsa(date)) % 360
  return sid < 0 ? sid + 360 : sid
}
