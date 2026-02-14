export const STATUS_THRESHOLDS = {
  criticalBelow: 35,
  positiveAbove: 62,
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
