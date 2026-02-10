export const HOUSE_SYSTEMS = ['placidus', 'whole-sign', 'psychological-shift'] as const
export type HouseSystem = (typeof HOUSE_SYSTEMS)[number]

export function normalizeHouseSystem(value: unknown): HouseSystem {
  if (!value) return 'whole-sign'
  const raw = String(value).trim().toLowerCase()
  if (raw === 'placidus') return 'placidus'
  if (raw === 'whole-sign' || raw === 'whole' || raw === 'equal') return 'whole-sign'
  if (raw === 'psychological-shift' || raw === 'psychological' || raw === 'shift') return 'psychological-shift'
  return 'whole-sign'
}

export function formatHouseSystemLabel(system: HouseSystem): string {
  switch (system) {
    case 'whole-sign':
      return 'Casas Inteiras'
    case 'psychological-shift':
      return 'Psicologico'
    case 'placidus':
    default:
      return 'Placidus'
  }
}
