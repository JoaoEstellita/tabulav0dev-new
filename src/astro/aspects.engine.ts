import { AspectInputBody, DetectedAspect, AspectsConfig, AspectName } from './aspects.types'

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v))

function angularSeparation(a: number, b: number): number {
  const diff = Math.abs(((a - b + 540) % 360) - 180)
  return diff
}

function resolveOrb(config: AspectsConfig, a: AspectInputBody, b: AspectInputBody, baseOrb: number, angle: number): number {
  const cap = config.maxOrbCap ?? 12
  // Base do aspecto
  let eff = baseOrb
  // Planet-specific por aspecto (se disponível)
  const pa = config.planetAspectOrbs?.[a.name]?.[angle]
  const pb = config.planetAspectOrbs?.[b.name]?.[angle]
  if (pa !== undefined || pb !== undefined) {
    eff = Math.min(eff, pa ?? eff, pb ?? eff)
  }
  // Overrides específicos por par (compatibilidade legada)
  const ovrA = config.overrides?.[a.name]?.[b.name]
  const ovrB = config.overrides?.[b.name]?.[a.name]
  if (ovrA !== undefined || ovrB !== undefined) {
    eff = Math.min(eff, ovrA ?? eff, ovrB ?? eff)
  }
  // planetOrbs legado (cap global por planeta)
  const orbA = config.planetOrbs?.[a.name]
  const orbB = config.planetOrbs?.[b.name]
  if (orbA !== undefined || orbB !== undefined) {
    eff = Math.min(eff, orbA ?? eff, orbB ?? eff)
  }
  return clamp(eff, 0, cap)
}

function isApplying(a: AspectInputBody, b: AspectInputBody, exactAngle: number): boolean {
  // Aproximação determinística: se a diferença angular está diminuindo, é aplicante.
  // Usar velocidades quando disponíveis.
  const speedA = a.speed ?? 0
  const speedB = b.speed ?? 0
  // Heurística: planeta mais rápido aproximando do alvo em relação ao mais lento
  // Não sofisticamos com direção retrógrada aqui; simplificação robusta para UI.
  return speedA > speedB
}

export function detectAspects(setA: AspectInputBody[], setB: AspectInputBody[], config: AspectsConfig): DetectedAspect[] {
  const results: DetectedAspect[] = []
  const sameSet = setA === setB

  for (let i = 0; i < setA.length; i++) {
    const A = setA[i]
    const jStart = sameSet ? i + 1 : 0
    for (let j = jStart; j < setB.length; j++) {
      const B = setB[j]
      const sep = angularSeparation(A.longitude, B.longitude)
      for (const def of config.aspects) {
        const orbAllowed = resolveOrb(config, A, B, def.baseOrb, def.angle)
        const orb = Math.abs(sep - def.angle)
        if (orb <= orbAllowed) {
          const proximity = clamp(1 - (orb / (orbAllowed || 1)), 0, 1)
          const type = def.name as AspectName
          const applying = isApplying(A, B, def.angle)
          // Peso simples por tipo
          const weight: Record<AspectName, number> = {
            'conjunção': 1.0,
            'oposição': 0.9,
            'quadratura': 0.8,
            'trígono': 0.8,
            'sextil': 0.6,
            'quincúncio': 0.5,
            'semissextil': 0.4,
            'semiquadratura': 0.45,
            'sesquiquadratura': 0.55,
          }
          const applyBoost = applying ? 1.10 : 1.0
          const strength = Math.round(100 * weight[type] * proximity * applyBoost)
          results.push({ planet1: A.name, planet2: B.name, type, orb, isApplying: applying, strength, side1: 'A', side2: 'B' })
        }
      }
    }
  }

  // Ordenar pelo mais forte
  results.sort((a, b) => b.strength - a.strength)
  return results
}


