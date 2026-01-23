import * as Astronomy from 'astronomy-engine'

export type MoonPhaseKey =
  | 'new'
  | 'waxingCrescent'
  | 'firstQuarter'
  | 'waxingGibbous'
  | 'full'
  | 'waningGibbous'
  | 'lastQuarter'
  | 'waningCrescent'

const clampAngle = (angle: number) => {
  let a = angle % 360
  if (a < 0) a += 360
  return a
}

export const getMoonPhaseKeyFromAngle = (angle: number): MoonPhaseKey => {
  const a = clampAngle(angle)
  if (a < 22.5 || a >= 337.5) return 'new'
  if (a < 67.5) return 'waxingCrescent'
  if (a < 112.5) return 'firstQuarter'
  if (a < 157.5) return 'waxingGibbous'
  if (a < 202.5) return 'full'
  if (a < 247.5) return 'waningGibbous'
  if (a < 292.5) return 'lastQuarter'
  return 'waningCrescent'
}

export const getMoonPhaseLabelFromAngle = (angle: number): string => {
  const a = clampAngle(angle)
  if (a >= 315) return 'Lua Balsâmica'
  switch (getMoonPhaseKeyFromAngle(a)) {
    case 'new':
      return 'Lua Nova'
    case 'waxingCrescent':
      return 'Lua Crescente'
    case 'firstQuarter':
      return 'Quarto Crescente'
    case 'waxingGibbous':
      return 'Lua Gibosa Crescente'
    case 'full':
      return 'Lua Cheia'
    case 'waningGibbous':
      return 'Lua Gibosa Minguante'
    case 'lastQuarter':
      return 'Quarto Minguante'
    case 'waningCrescent':
      return 'Lua Minguante'
  }
}

export const getMoonPhaseAngle = (date: Date): number => Astronomy.MoonPhase(date)

const safeFormat = (
  date: Date,
  timeZone: string,
  options: Intl.DateTimeFormatOptions
) => {
  try {
    return new Intl.DateTimeFormat('pt-BR', { timeZone, ...options }).format(date)
  } catch {
    return new Intl.DateTimeFormat('pt-BR', options).format(date)
  }
}

export const formatLocalDateTime = (date: Date, timeZone: string) =>
  safeFormat(date, timeZone, { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })

export const formatLocalTime = (date: Date, timeZone: string) =>
  safeFormat(date, timeZone, { hour: '2-digit', minute: '2-digit' })
