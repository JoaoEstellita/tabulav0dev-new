import { PersonalTransitFilters, PersonalTransitItem, TransitsSummary } from './transits.types'
import { DetectedAspect } from './aspects.types'

export function filterPersonalTransits(items: PersonalTransitItem[], f: PersonalTransitFilters = {}): PersonalTransitItem[] {
  return items.filter(it => {
    if (f.types && !f.types.includes(it.type as any)) return false
    if (typeof f.maxOrb === 'number' && it.orb > f.maxOrb) return false
    if (f.onlyApplying && !it.isApplying) return false
    if (f.transitPlanets && !f.transitPlanets.includes(it.transitPlanet)) return false
    if (f.natalPlanets && !f.natalPlanets.includes(it.natalPlanet)) return false
    if (f.natalHouses && !f.natalHouses.includes(it.natalHouseImpacted)) return false
    return true
  })
}

export function summarizePersonalTransits(items: PersonalTransitItem[]): TransitsSummary {
  const countsByType: Record<string, number> = {}
  let countsApplying = 0
  let countsSeparating = 0
  let maxStrength = 0
  let minOrb = Number.POSITIVE_INFINITY
  for (const it of items) {
    countsByType[it.type] = (countsByType[it.type] ?? 0) + 1
    if (it.isApplying) countsApplying++
    else countsSeparating++
    if (it.strength > maxStrength) maxStrength = it.strength
    if (it.orb < minOrb) minOrb = it.orb
  }
  if (!isFinite(minOrb)) minOrb = 0
  return { countsByType, countsApplying, countsSeparating, maxStrength, minOrb }
}


