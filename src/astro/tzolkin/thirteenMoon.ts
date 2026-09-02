// Calendário das 13 Luas (Sincronário). Ano-lua começa em 26/07; 13 luas × 28
// dias = 364 + o Dia Fora do Tempo (25/07). Ignora 29/02 (mesma convenção do Kin).
import { dayOrdinal } from './engine'

export interface ThirteenMoonDate {
  moon: number        // 1..13 (0 no Dia Fora do Tempo)
  dayOfMoon: number   // 1..28 (0 no Dia Fora do Tempo)
  week: number        // 1..4 (heptad/semana da lua)
  plasma: number      // 1..7 (plasma radial / dia da semana)
  isDayOutOfTime: boolean
}

export function thirteenMoonDate(iso: string): ThirteenMoonDate {
  const [y, m, d] = iso.slice(0, 10).split('-').map(Number)
  const startYear = (m > 7 || (m === 7 && d >= 26)) ? y : y - 1
  const startOrd = dayOrdinal(`${startYear}-07-26`)
  const idx = dayOrdinal(iso) - startOrd // 0-based
  if ((m === 7 && d === 25) || idx < 0 || idx > 363) {
    return { moon: 0, dayOfMoon: 0, week: 0, plasma: 0, isDayOutOfTime: true }
  }
  const moon = Math.floor(idx / 28) + 1
  const dayOfMoon = (idx % 28) + 1
  const week = Math.floor((dayOfMoon - 1) / 7) + 1
  const plasma = ((dayOfMoon - 1) % 7) + 1
  return { moon, dayOfMoon, week, plasma, isDayOutOfTime: false }
}
