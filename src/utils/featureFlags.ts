const truthy = new Set(['1', 'true', 'yes', 'on'])

export function isAstroEngineV2ShadowEnabled(): boolean {
  const raw = String(process.env.EXPO_PUBLIC_ASTRO_ENGINE_V2_SHADOW || '').trim().toLowerCase()
  return truthy.has(raw)
}

export function isInterpretationV2Enabled(): boolean {
  return false
}
