import { describe, it, expect } from 'vitest'
import { getPlanetHouse } from '../../astro'
import type { HouseSystem } from '../../astro'
import { normalizeHouseSystem } from '../houseSystem'

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

  // "psychological-shift" foi removido: não era um sistema de casas, apenas
  // deslocava todo planeta uma casa à frente do whole-sign. Perfis com esse
  // valor gravado passam a cair no padrão (Placidus).
  it('sistema legado/desconhecido cai no padrão Placidus', () => {
    expect(normalizeHouseSystem('psychological-shift')).toBe('placidus')
    expect(normalizeHouseSystem('psicologico')).toBe('placidus')
    expect(normalizeHouseSystem('xyz')).toBe('placidus')
    expect(normalizeHouseSystem(undefined)).toBe('placidus')
    // Os sistemas suportados seguem intactos
    expect(normalizeHouseSystem('whole-sign')).toBe('whole-sign')
    expect(normalizeHouseSystem('placidus')).toBe('placidus')
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
