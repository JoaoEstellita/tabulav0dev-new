import * as Astronomy from 'astronomy-engine'
import type { AppLanguage } from '../i18n/appI18n'

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

const toLocale = (language: AppLanguage) => {
  if (language === 'en-US') return 'en-US'
  if (language === 'es-ES') return 'es-ES'
  if (language === 'it-IT') return 'it-IT'
  return 'pt-BR'
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

export const getMoonPhaseLabelFromKey = (key: MoonPhaseKey, language: AppLanguage = 'pt-BR'): string => {
  switch (key) {
    case 'new':
      if (language === 'en-US') return 'New Moon'
      if (language === 'es-ES') return 'Luna Nueva'
      if (language === 'it-IT') return 'Luna Nuova'
      return 'Lua Nova'
    case 'waxingCrescent':
      if (language === 'en-US') return 'Waxing Crescent'
      if (language === 'es-ES') return 'Luna Creciente'
      if (language === 'it-IT') return 'Luna Crescente'
      return 'Lua Crescente'
    case 'firstQuarter':
      if (language === 'en-US') return 'First Quarter'
      if (language === 'es-ES') return 'Cuarto Creciente'
      if (language === 'it-IT') return 'Primo Quarto'
      return 'Quarto Crescente'
    case 'waxingGibbous':
      if (language === 'en-US') return 'Waxing Gibbous'
      if (language === 'es-ES') return 'Gibosa Creciente'
      if (language === 'it-IT') return 'Gibbosa Crescente'
      return 'Lua Gibosa Crescente'
    case 'full':
      if (language === 'en-US') return 'Full Moon'
      if (language === 'es-ES') return 'Luna Llena'
      if (language === 'it-IT') return 'Luna Piena'
      return 'Lua Cheia'
    case 'waningGibbous':
      if (language === 'en-US') return 'Waning Gibbous'
      if (language === 'es-ES') return 'Gibosa Menguante'
      if (language === 'it-IT') return 'Gibbosa Calante'
      return 'Lua Gibosa Minguante'
    case 'lastQuarter':
      if (language === 'en-US') return 'Last Quarter'
      if (language === 'es-ES') return 'Cuarto Menguante'
      if (language === 'it-IT') return 'Ultimo Quarto'
      return 'Quarto Minguante'
    case 'waningCrescent':
      if (language === 'en-US') return 'Waning Crescent'
      if (language === 'es-ES') return 'Luna Menguante'
      if (language === 'it-IT') return 'Luna Calante'
      return 'Lua Minguante'
  }
}

export const getMoonPhaseLabelFromAngle = (angle: number, language: AppLanguage = 'pt-BR'): string => {
  const a = clampAngle(angle)
  if (a >= 315) {
    if (language === 'en-US') return 'Balsamic Moon'
    if (language === 'es-ES') return 'Luna Bals�mica'
    if (language === 'it-IT') return 'Luna Balsamica'
    return 'Lua Bals�mica'
  }
  return getMoonPhaseLabelFromKey(getMoonPhaseKeyFromAngle(a), language)
}

export const getMoonPhaseAngle = (date: Date): number => Astronomy.MoonPhase(date)

/** Longitude eclíptica tropical da Lua (0–360) — para a nakshatra de trânsito (védico). */
export const getMoonEclipticLongitude = (date: Date): number =>
  ((Astronomy.EclipticGeoMoon(date).lon % 360) + 360) % 360

const safeFormat = (
  date: Date,
  timeZone: string,
  options: Intl.DateTimeFormatOptions,
  language: AppLanguage = 'pt-BR'
) => {
  const locale = toLocale(language)
  try {
    return new Intl.DateTimeFormat(locale, { timeZone, ...options }).format(date)
  } catch {
    return new Intl.DateTimeFormat(locale, options).format(date)
  }
}

export const formatLocalDateTime = (date: Date, timeZone: string, language: AppLanguage = 'pt-BR') =>
  safeFormat(date, timeZone, { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }, language)

export const formatLocalTime = (date: Date, timeZone: string, language: AppLanguage = 'pt-BR') =>
  safeFormat(date, timeZone, { hour: '2-digit', minute: '2-digit' }, language)
