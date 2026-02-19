const truthy = new Set(['1', 'true', 'yes', 'on'])

export function isAstroEngineV2ShadowEnabled(): boolean {
  const raw = String(process.env.EXPO_PUBLIC_ASTRO_ENGINE_V2_SHADOW || '').trim().toLowerCase()
  return truthy.has(raw)
}

export function isInterpretationV2Enabled(): boolean {
  const direct = String(process.env.EXPO_PUBLIC_INTERPRETATION_V2_ENABLED || '').trim().toLowerCase()
  if (truthy.has(direct)) return true
  return isAstroEngineV2ShadowEnabled()
}
