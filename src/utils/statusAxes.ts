import type { AppLanguage } from '../i18n/appI18n'

export type StatusAxisKey = 'movement' | 'attention'

export const STATUS_AXIS_COLORS: Record<StatusAxisKey, string> = {
  movement: '#22D3EE',
  attention: '#F97316',
}

export function normalizeAxisScore(value: unknown): number | null {
  const numeric = Number(value)
  if (!Number.isFinite(numeric)) return null
  return Math.round(Math.max(0, Math.min(100, numeric)))
}

export function getAxisShortLabel(axis: StatusAxisKey): string {
  return axis === 'movement' ? 'M' : 'A'
}

export function getAxisLongLabel(axis: StatusAxisKey, language: AppLanguage): string {
  if (axis === 'movement') {
    if (language === 'en-US') return 'Movement'
    if (language === 'es-ES') return 'Movimiento'
    if (language === 'it-IT') return 'Movimento'
    return 'Movimento'
  }
  if (language === 'en-US') return 'Attention'
  if (language === 'es-ES') return 'Atencion'
  if (language === 'it-IT') return 'Attenzione'
  return 'Atencao'
}
