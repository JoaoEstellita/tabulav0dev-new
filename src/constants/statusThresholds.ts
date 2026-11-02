// Runtime defaults only.
// Single source of truth must come from GET /api/status-policy loaded at app startup.
//
// ⚠️ ESTES NÚMEROS VIVEM NA ESCALA EXIBIDA (`constants/escalaExibida.ts`), onde
// 50 é o típico em toda área. Quem compara contra eles tem de remapear ANTES.
//
// ⚠️ OS ANTERIORES (35/62) ERAM DA ESCALA CRUA, cuja mediana é 41. Medido com
// o motor real em 19.200 leituras, davam 27,5% de "crítico" — e de forma
// desigual, Carreira 43,7% contra Espiritualidade 14,7% — e 4,5% de
// "favorável". Na escala exibida, 25 e 75 são os decis medidos: 8,8% e 10,8%,
// parelhos em todas as oito áreas.
export const STATUS_THRESHOLDS = {
  criticalBelow: 25,
  positiveAbove: 75,
}

export type RuntimeStatusThresholds = Partial<{
  criticalBelow: number
  positiveAbove: number
}>

export function applyRuntimeStatusThresholds(next: RuntimeStatusThresholds | null | undefined) {
  if (!next) return
  if (typeof next.criticalBelow === 'number' && Number.isFinite(next.criticalBelow)) {
    STATUS_THRESHOLDS.criticalBelow = next.criticalBelow
  }
  if (typeof next.positiveAbove === 'number' && Number.isFinite(next.positiveAbove)) {
    STATUS_THRESHOLDS.positiveAbove = next.positiveAbove
  }
}
