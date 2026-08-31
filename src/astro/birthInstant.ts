import { approximateTimezoneOffsetHours } from '../utils/timezone'

// Resolve o INSTANTE UTC do nascimento a partir de data/hora locais + local.
// Espelha a lógica do RealAstrologyEngine (TimezoneService + fallback por longitude)
// para que a astrocartografia use exatamente o mesmo instante do mapa natal.
export async function resolveBirthInstant(
  birthDate: string, // 'AAAA-MM-DD'
  birthTime: string, // 'HH:MM'
  lat: number,
  lon: number,
): Promise<Date | null> {
  try {
    const [y, m, d] = birthDate.split('-').map((n) => parseInt(n, 10))
    const [hh, mm] = birthTime.split(':').map((n) => parseInt(n, 10))
    if (![y, m, d, hh, mm].every(Number.isFinite)) return null
    // Meio-dia UTC para resolver o TZ histórico e evitar bordas de DST.
    const ts = Math.floor(Date.UTC(y, m - 1, d, 12, 0, 0) / 1000)
    try {
      const { getTimezoneData } = await import('../services/timezone/TimezoneService')
      const tz = await getTimezoneData(lat, lon, ts)
      if (tz && typeof tz.offsetSec === 'number' && tz.offsetSec !== 0) {
        const offsetHours = tz.offsetSec / 3600
        return new Date(Date.UTC(y, m - 1, d, hh - offsetHours, mm, 0))
      }
    } catch { /* cai no fallback por longitude */ }
    const approx = approximateTimezoneOffsetHours(new Date(Date.UTC(y, m - 1, d, 0, 0, 0)), lon, lat)
    return new Date(Date.UTC(y, m - 1, d, hh - approx, mm, 0))
  } catch {
    return null
  }
}
