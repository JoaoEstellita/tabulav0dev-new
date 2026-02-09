type AreaRule = {
  houses: number[]
  planets: string[]
}

type PersonalTransitLike = {
  transitPlanet?: string
  natalPlanet?: string
  type?: string
  orb?: number
  isApplying?: boolean
  strength?: number
  natalHouseImpacted?: number
  durationClass?: 'curto' | 'medio' | 'longo'
  id?: string
}

type AstrologyDataLike = {
  transits?: {
    personal?: PersonalTransitLike[]
    byArea?: Record<string, PersonalTransitLike[]>
  }
}

const AREA_RULES: Record<string, AreaRule> = {
  amor: { houses: [5, 7], planets: ['Venus', 'Mars'] },
  carreira: { houses: [10, 6], planets: ['Saturn', 'Mars', 'Sun'] },
  financas: { houses: [2, 8], planets: ['Venus', 'Jupiter'] },
  saude: { houses: [1, 6], planets: ['Mars', 'Sun'] },
  familia: { houses: [4, 10], planets: ['Moon', 'Saturn'] },
  espiritualidade: { houses: [9, 12], planets: ['Neptune', 'Jupiter'] },
  comunicacao: { houses: [3, 9], planets: ['Mercury', 'Uranus'] },
  transformacao: { houses: [8, 12], planets: ['Pluto', 'Uranus'] },
}

const toAreaKey = (value: string): string => String(value || '').trim().toLowerCase()

const getTransitHouse = (transit: PersonalTransitLike): number => {
  const house = Number(transit?.natalHouseImpacted)
  return Number.isFinite(house) ? house : 0
}

const getTransitKey = (transit: PersonalTransitLike, index: number): string => {
  const id = typeof transit?.id === 'string' ? transit.id : ''
  if (id) return id
  const planet = transit?.transitPlanet || 'na'
  const target = transit?.natalPlanet || 'na'
  const type = transit?.type || 'na'
  const house = String(getTransitHouse(transit) || '0')
  return `${planet}:${target}:${type}:${house}:${index}`
}

const isTransitRelevantToArea = (areaKey: string, transit: PersonalTransitLike): boolean => {
  const rule = AREA_RULES[toAreaKey(areaKey)]
  if (!rule) return true

  const planet = String(transit?.transitPlanet || '')
  const planetOk = !rule.planets.length || rule.planets.includes(planet)
  if (!planetOk) return false

  const house = getTransitHouse(transit)
  if (!house) return true
  return !rule.houses.length || rule.houses.includes(house)
}

const getPersonal = (astrologyData: AstrologyDataLike | null | undefined): PersonalTransitLike[] => {
  return Array.isArray(astrologyData?.transits?.personal) ? astrologyData!.transits!.personal! : []
}

export const getAreaTransitsFromAstro = (
  areaKey: string,
  astrologyData: AstrologyDataLike | null | undefined
): PersonalTransitLike[] => {
  if (!astrologyData) return []
  const key = toAreaKey(areaKey)
  const byArea = astrologyData?.transits?.byArea
  const direct = byArea && Array.isArray(byArea[key]) ? byArea[key] : null
  if (direct && direct.length) return direct
  return getPersonal(astrologyData).filter((transit) => isTransitRelevantToArea(key, transit))
}

export const mergeAreaTransits = (
  areaKey: string,
  ...sources: Array<AstrologyDataLike | null | undefined>
): PersonalTransitLike[] => {
  const merged: PersonalTransitLike[] = []
  const seen = new Set<string>()
  sources.forEach((source) => {
    const items = getAreaTransitsFromAstro(areaKey, source)
    items.forEach((item, index) => {
      const key = getTransitKey(item, index)
      if (seen.has(key)) return
      seen.add(key)
      merged.push(item)
    })
  })
  return merged
}

export const getAreaTransitCount = (
  areaKey: string,
  ...sources: Array<AstrologyDataLike | null | undefined>
): number => {
  return mergeAreaTransits(areaKey, ...sources).length
}
