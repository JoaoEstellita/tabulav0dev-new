import { ASPECT_WEIGHTS, effectiveOrb } from './aspect-config';
import { AspectInputBody, DetectedAspect, AspectsConfig, AspectName } from './aspects.types'

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v))

function angularSeparation(a: number, b: number): number {
  const diff = Math.abs(((a - b + 540) % 360) - 180)
  return diff
}

// Orbe efetivo do par (min do par + branch do luminar) — fonte única em aspect-config.
function resolveOrb(config: AspectsConfig, a: AspectInputBody, b: AspectInputBody, baseOrb: number, angle: number): number {
  return effectiveOrb(config, a.name, b.name, angle, baseOrb)
}

function isApplying(a: AspectInputBody, b: AspectInputBody, exactAngle: number): boolean {
  // Refino: considerar movimento relativo e retrogradação
  // Se a diferença angular está diminuindo, é aplicante
  const speedA = a.speed ?? 0
  const speedB = b.speed ?? 0
  const posA = a.longitude ?? 0
  const posB = b.longitude ?? 0
  let diff = ((posB - posA + 360) % 360)

  // Caso especial: conjunção (angle 0)
  if (exactAngle === 0) {
    // Se ambos diretos
    if (!(a.retrograde || b.retrograde)) {
      return (diff > 0 && diff < 1) && (speedA > speedB)
    }
    // Se A retrógrado e B direto
    if (a.retrograde && !b.retrograde) {
      return (diff > 0 && diff < 1) && (speedA < speedB)
    }
    // Se B retrógrado e A direto
    if (!a.retrograde && b.retrograde) {
      return (diff > 0 && diff < 1) && (speedA > speedB)
    }
    // Se ambos retrógrados
    if (a.retrograde && b.retrograde) {
      return (diff > 0 && diff < 1) && (speedA < speedB)
    }
    // Fallback
    return speedA > speedB
  }

  // Demais aspectos
  if (!(a.retrograde || b.retrograde)) {
    return (diff > 0 && diff < exactAngle) && (speedA > speedB)
  }
  if (a.retrograde && !b.retrograde) {
    return (diff > 0 && diff < exactAngle) && (speedA < speedB)
  }
  if (!a.retrograde && b.retrograde) {
    return (diff > 0 && diff < exactAngle) && (speedA > speedB)
  }
  if (a.retrograde && b.retrograde) {
    return (diff > 0 && diff < exactAngle) && (speedA < speedB)
  }
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
          const applyBoost = applying ? 1.10 : 1.0
          const strength = Math.round(100 * (ASPECT_WEIGHTS[type] || 1) * proximity * applyBoost)
          results.push({ planet1: A.name, planet2: B.name, type, orb, isApplying: applying, strength, side1: 'A', side2: 'B' })
        }
      }
    }
  }

  // Ordenar pelo mais forte
  results.sort((a, b) => b.strength - a.strength)
  return results
}


