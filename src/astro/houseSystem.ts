import type { AppLanguage } from '../i18n/appI18n'

export const HOUSE_SYSTEMS = ['placidus', 'whole-sign', 'psychological-shift'] as const
export type HouseSystem = (typeof HOUSE_SYSTEMS)[number]

export function normalizeHouseSystem(value: unknown): HouseSystem {
  if (!value) return 'whole-sign'
  const raw = String(value).trim().toLowerCase()
  if (raw === 'placidus') return 'placidus'
  if (raw === 'whole-sign' || raw === 'whole' || raw === 'equal' || raw === 'casas inteiras' || raw === 'whole sign houses') {
    return 'whole-sign'
  }
  if (raw === 'psychological-shift' || raw === 'psychological' || raw === 'shift' || raw === 'psicologico') {
    return 'psychological-shift'
  }
  return 'whole-sign'
}

export function formatHouseSystemLabel(system: HouseSystem, language: AppLanguage = 'pt-BR'): string {
  switch (system) {
    case 'whole-sign':
      if (language === 'en-US') return 'Whole Sign Houses'
      if (language === 'es-ES') return 'Casas Enteras'
      if (language === 'it-IT') return 'Case Intere'
      return 'Casas Inteiras'
    case 'psychological-shift':
      if (language === 'en-US') return 'Psychological Shift'
      if (language === 'es-ES') return 'Cambio Psicologico'
      if (language === 'it-IT') return 'Spostamento Psicologico'
      return 'Psicologico'
    case 'placidus':
    default:
      return 'Placidus'
  }
}
