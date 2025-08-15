export const MotionDurations = {
  xs: 120,
  sm: 180,
  md: 240,
  lg: 320,
  xl: 480,
} as const

export const MotionEasings = {
  easeOutQuad: (t: number) => t * (2 - t),
  easeOutCubic: (t: number) => 1 - Math.pow(1 - t, 3),
  easeOutQuint: (t: number) => 1 - Math.pow(1 - t, 5),
} as const

export const MotionConfig = {
  pressScale: { from: 1.0, to: 0.98 },
  modalScale: { from: 0.94, to: 1.0 },
} as const


