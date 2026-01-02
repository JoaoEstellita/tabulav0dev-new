import type { RealAstrologyData } from '../../../services/astrology/RealAstrologyEngine'

export type ImpactDirection = 'apoio' | 'pressao' | 'neutro'

export interface ImpactAspect {
  type: string
  with: string
  orb?: number
  isApplying?: boolean
  finalScore?: number
}

export interface ImpactContributor {
  id: string
  planet: string
  score: number
  direction: ImpactDirection
  tags: string[]
  topAspects: ImpactAspect[]
  reason?: string
  confidence?: 'high' | 'medium' | 'low'
  sourcePath: string
}

export interface ImpactAreaNode {
  areaKey: string
  contributors: ImpactContributor[]
  positivePct: number
  negativePct: number
  neutralDominance: boolean
  hasBreakdown: boolean
  sourcePath: string
}

const SOURCE_DEBUG = 'currentTransits.debug.lifeAreas'
const SOURCE_FALLBACK = 'currentTransits.lifeAreas'

const toDirection = (score: number): ImpactDirection => {
  if (score > 0) return 'apoio'
  if (score < 0) return 'pressao'
  return 'neutro'
}

const normalizePercentages = (contributors: ImpactContributor[]) => {
  const positiveSum = contributors
    .filter((item) => item.score > 0)
    .reduce((sum, item) => sum + item.score, 0)
  const negativeSumAbs = contributors
    .filter((item) => item.score < 0)
    .reduce((sum, item) => sum + Math.abs(item.score), 0)
  const totalAbs = positiveSum + negativeSumAbs
  const positivePct = totalAbs ? positiveSum / totalAbs : 0
  const negativePct = totalAbs ? negativeSumAbs / totalAbs : 0
  const safePositive = Number.isFinite(positivePct) ? positivePct : 0
  const safeNegative = Number.isFinite(negativePct) ? negativePct : 0
  return {
    positivePct: safePositive,
    negativePct: safeNegative,
    neutralDominance: totalAbs === 0,
  }
}

const buildFromDebug = (
  debugAreas: NonNullable<RealAstrologyData['debug']>['lifeAreas']
): ImpactAreaNode[] => {
  return Object.entries(debugAreas).map(([areaKey, areaData]) => {
    const contributors = (areaData?.planetDetails || [])
      .slice()
      .sort((a, b) => Math.abs(b.total) - Math.abs(a.total))
      .map((detail, index) => {
        const topAspects = (detail.aspects || [])
          .slice()
          .sort((a, b) => Math.abs(b.finalScore) - Math.abs(a.finalScore))
          .slice(0, 2)
          .map((aspect) => ({
            type: aspect.type,
            with: aspect.with,
            orb: aspect.orb,
            isApplying: aspect.isApplying,
            finalScore: aspect.finalScore,
          }))

        const tags = detail.conditions?.tags || []
        return {
          id: `${areaKey}:${detail.planet}:${index}`,
          planet: detail.planet,
          score: detail.total,
          direction: toDirection(detail.total),
          tags,
          topAspects,
          reason: tags[0],
          confidence: 'high',
          sourcePath: SOURCE_DEBUG,
        }
      })

    const { positivePct, negativePct, neutralDominance } = normalizePercentages(contributors)

    return {
      areaKey,
      contributors,
      positivePct,
      negativePct,
      neutralDominance,
      hasBreakdown: true,
      sourcePath: SOURCE_DEBUG,
    }
  })
}

const buildFromLifeAreas = (
  lifeAreas: RealAstrologyData['lifeAreas']
): ImpactAreaNode[] => {
  return Object.entries(lifeAreas || {}).map(([areaKey, areaData]) => {
    const influences = Array.isArray(areaData?.influences)
      ? areaData.influences
      : []
    const contributors = (areaData?.mainPlanets || []).map((planet, index) => ({
      id: `${areaKey}:${planet}:${index}`,
      planet,
      score: 0,
      direction: 'neutro' as const,
      tags: influences,
      topAspects: [],
      reason: influences[0],
      confidence: 'low',
      sourcePath: SOURCE_FALLBACK,
    }))

    return {
      areaKey,
      contributors,
      positivePct: 0,
      negativePct: 0,
      neutralDominance: true,
      hasBreakdown: false,
      sourcePath: SOURCE_FALLBACK,
    }
  })
}

export const buildImpactNodes = (
  currentTransits?: RealAstrologyData | null,
  fallbackLifeAreas?: RealAstrologyData['lifeAreas'] | null
): ImpactAreaNode[] => {
  if (!currentTransits) return []

  const debugAreas = currentTransits.debug?.lifeAreas
  if (debugAreas && Object.keys(debugAreas).length > 0) {
    return buildFromDebug(debugAreas)
  }

  const lifeAreas = fallbackLifeAreas || currentTransits.lifeAreas
  if (lifeAreas && Object.keys(lifeAreas).length > 0) {
    return buildFromLifeAreas(lifeAreas)
  }

  return []
}
