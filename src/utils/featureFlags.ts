const truthy = new Set(['1', 'true', 'yes', 'on'])

export function isAstroEngineV2ShadowEnabled(): boolean {
  const raw = String(process.env.EXPO_PUBLIC_ASTRO_ENGINE_V2_SHADOW || '').trim().toLowerCase()
  return truthy.has(raw)
}

export function isInterpretationV2Enabled(): boolean {
  const opt_out = String(process.env.EXPO_PUBLIC_INTERPRETATION_V2_DISABLED || '').trim().toLowerCase()
  if (truthy.has(opt_out)) return false
  return true
}
