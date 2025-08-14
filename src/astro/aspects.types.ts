export type AspectName =
  | 'conjunção'
  | 'oposição'
  | 'quadratura'
  | 'trígono'
  | 'sextil'
  | 'quincúncio'
  | 'semissextil'
  | 'semiquadratura'
  | 'sesquiquadratura'

export interface AspectDefinition {
  name: AspectName
  angle: number // graus
  baseOrb: number // orbe padrão em graus
}

export interface AspectsConfig {
  aspects: AspectDefinition[]
  // Orbes específicas por par de planetas (opcional)
  // Ex.: overrides['Sun']['Moon'] = 10 (graus)
  overrides?: Record<string, Record<string, number>>
  // Orbe máxima absoluta para qualquer aspecto (safety cap)
  maxOrbCap?: number
  // Orbe base por planeta (usaremos min(baseAspect, orbPlanetaA, orbPlanetaB))
  planetOrbs?: Record<string, number>
  // Orbe por planeta POR ASPECTO (ângulo em graus). Usa min(baseOrb, planetaA[angle], planetaB[angle])
  planetAspectOrbs?: Record<string, Record<number, number>>
}

export interface AspectInputBody {
  name: string
  longitude: number // graus 0..360
  speed?: number // graus/dia
}

export interface DetectedAspect {
  planet1: string
  planet2: string
  type: AspectName
  orb: number
  isApplying: boolean
  strength: number // 0..100
  side1?: 'A' | 'B'
  side2?: 'A' | 'B'
}


