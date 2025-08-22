import { describe, it, expect, vi } from 'vitest'
import * as Astronomy from 'astronomy-engine'
import { RealAstrologyEngine } from '../RealAstrologyEngine'

describe('RealAstrologyEngine.calculateRealPlanetPositions', () => {
  it('normalizes speed when longitude crosses 0°', async () => {
    const originalPlanets = (RealAstrologyEngine as any).PLANETS
    ;(RealAstrologyEngine as any).PLANETS = ['Sun']

    vi.spyOn(Astronomy, 'GeoVector').mockImplementation(() => ({
      x: 0,
      y: 0,
      z: 0,
      Length: () => 1
    }))

    let call = 0
    vi.spyOn(Astronomy, 'Ecliptic').mockImplementation(() => {
      call++
      return { elon: call === 1 ? 359 : 1, elat: 0 }
    })

    const result = await (RealAstrologyEngine as any).calculateRealPlanetPositions(
      new Date('2024-03-20T00:00:00Z'),
      0,
      0
    )

    expect(result[0].speed).toBeCloseTo(2)
    expect(result[0].isRetrograde).toBe(false)

    ;(RealAstrologyEngine as any).PLANETS = originalPlanets
    vi.restoreAllMocks()
  })
})
