// Tipos para sistema de status planetários
export type PlanetName = 
  | 'Sun' | 'Moon' | 'Mercury' | 'Venus' | 'Mars'
  | 'Jupiter' | 'Saturn' | 'Uranus' | 'Neptune' | 'Pluto'

export type SignName = 
  | 'Áries' | 'Touro' | 'Gêmeos' | 'Câncer' | 'Leão' | 'Virgem'
  | 'Libra' | 'Escorpião' | 'Sagitário' | 'Capricórnio' | 'Aquário' | 'Peixes'

export type PlanetaryStatusLevel = 
  | 'Muito Forte' | 'Forte' | 'Moderado' | 'Neutro' | 'Fraco' | 'Muito Fraco'

export interface EssentialDignity {
  planet: PlanetName
  domicile: SignName[]
  exaltation: SignName[]
  detriment: SignName[]
  fall: SignName[]
  triplicity: SignName[]
}

export interface PlanetaryScore {
  essential: number
  houseStrength: number
  accidentalDignity: number
  signHouseHarmony: number
  elementalStrength: number
  aspectStrength: number
  specialConditions: number
  total: number
}

export interface AspectAnalysis {
  totalAspects: number
  majorAspects: number
  minorAspects: number
  applyingAspects: number
  strongestAspect?: {
    planet1: string
    planet2: string
    type: string
    orb: number
    isApplying: boolean
    strength: number
  }
  aspectTypes: Record<string, number>
}

export interface PlanetaryStatus {
  level: PlanetaryStatusLevel
  score: number
  breakdown: PlanetaryScore
  interpretation: string
  aspectAnalysis: AspectAnalysis
  breakdownExplanation: string[]
}

export type { DetectedAspect } from './aspects.types'
