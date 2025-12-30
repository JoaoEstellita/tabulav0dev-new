import { describe, it, expect } from 'vitest'
import { getPlanetHouse } from '../../astro'
import type { HouseSystem } from '../../astro'

const ascLongitude = 80.0 // Gemini

const planetLongitudes = {
  Sun: 20.39405510181004,      // Aries
  Moon: 77.45668877355062,     // Gemini
  Mercury: 26.661837868503998, // Aries
  Venus: 21.75696860211736,    // Aries
  Mars: 78.33693177642418,     // Gemini
  Jupiter: 65.23845920988846,  // Gemini
  Saturn: 283.7954437916226,   // Capricorn
  Uranus: 275.3307562541403,   // Capricorn
  Neptune: 282.3791405451524,  // Capricorn
  Pluto: 224.44512326725635    // Scorpio
}

type ExpectedMap = Record<keyof typeof planetLongitudes, number>

describe('getPlanetHouse - house systems', () => {
  it('whole-sign matches expected natal mapping', () => {
    const expected: ExpectedMap = {
      Sun: 11,
      Moon: 1,
      Mercury: 11,
      Venus: 11,
      Mars: 1,
      Jupiter: 1,
      Saturn: 8,
      Uranus: 8,
      Neptune: 8,
      Pluto: 6
    }

    for (const [name, longitude] of Object.entries(planetLongitudes)) {
      const house = getPlanetHouse({
        planetLongitude: longitude,
        ascLongitude,
        houseCusps: null,
        system: 'whole-sign'
      })
      expect(house).toBe(expected[name as keyof ExpectedMap])
    }
  })

  it('psychological-shift matches expected natal mapping', () => {
    const expected: ExpectedMap = {
      Sun: 12,
      Moon: 2,
      Mercury: 12,
      Venus: 12,
      Mars: 2,
      Jupiter: 2,
      Saturn: 9,
      Uranus: 9,
      Neptune: 9,
      Pluto: 7
    }

    for (const [name, longitude] of Object.entries(planetLongitudes)) {
      const house = getPlanetHouse({
        planetLongitude: longitude,
        ascLongitude,
        houseCusps: null,
        system: 'psychological-shift'
      })
      expect(house).toBe(expected[name as keyof ExpectedMap])
    }
  })

  it('placidus falls back when cusps are missing', () => {
    const system: HouseSystem = 'placidus'
    const house = getPlanetHouse({
      planetLongitude: planetLongitudes.Sun,
      ascLongitude,
      houseCusps: null,
      system
    })
    expect(house).toBeGreaterThanOrEqual(1)
    expect(house).toBeLessThanOrEqual(12)
  })
})
