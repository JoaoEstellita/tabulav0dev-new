import type { AppLanguage } from '../i18n/appI18n'

// Placidus é o padrão: é o sistema que a maioria dos softwares e sites usa, então
// é o número que o usuário espera ao comparar com outras fontes. Casas Inteiras
// fica como alternativa (tradição helenística).
//
// "psychological-shift" foi REMOVIDO: não era um sistema de casas — deslocava
// todos os planetas uma casa à frente do whole-sign. Perfis que ainda tenham esse
// valor gravado caem no padrão (Placidus) pela normalização abaixo.
export const HOUSE_SYSTEMS = ['placidus', 'whole-sign'] as const
export type HouseSystem = (typeof HOUSE_SYSTEMS)[number]

export const DEFAULT_HOUSE_SYSTEM: HouseSystem = 'placidus'

export function normalizeHouseSystem(value: unknown): HouseSystem {
  if (!value) return DEFAULT_HOUSE_SYSTEM
  const raw = String(value).trim().toLowerCase()
  if (raw === 'placidus') return 'placidus'
  if (raw === 'whole-sign' || raw === 'whole' || raw === 'equal' || raw === 'casas inteiras' || raw === 'whole sign houses') {
    return 'whole-sign'
  }
  // Legado (psychological-shift/psicologico) e qualquer valor desconhecido → padrão.
  return DEFAULT_HOUSE_SYSTEM
}

export function formatHouseSystemLabel(system: HouseSystem, language: AppLanguage = 'pt-BR'): string {
  switch (system) {
    case 'whole-sign':
      if (language === 'en-US') return 'Whole Sign Houses'
      if (language === 'es-ES') return 'Casas Enteras'
      if (language === 'it-IT') return 'Case Intere'
      return 'Casas Inteiras'
    case 'placidus':
    default:
      return 'Placidus'
  }
}
