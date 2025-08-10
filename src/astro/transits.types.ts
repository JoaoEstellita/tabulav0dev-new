import { AspectName } from './aspects.types'

export interface PersonalTransitItem {
  transitPlanet: string
  natalPlanet: string
  type: string
  orb: number
  isApplying: boolean
  strength: number
  natalHouseImpacted: number
}

export interface PersonalTransitFilters {
  types?: AspectName[]
  maxOrb?: number
  onlyApplying?: boolean
  transitPlanets?: string[]
  natalPlanets?: string[]
  natalHouses?: number[]
}

export interface TransitsSummary {
  countsByType: Record<string, number>
  countsApplying: number
  countsSeparating: number
  maxStrength: number
  minOrb: number
}


