import { describe, it, expect } from 'vitest'
import { planetaryLines } from '../astrocartography'

describe('astrocartography', () => {
  const lines = planetaryLines(new Date(Date.UTC(1990, 4, 27, 14, 30, 0)))
  const byPlanet = Object.fromEntries(lines.map((l) => [l.planet, l]))

  it('10 planetas com linhas MC/IC', () => {
    expect(lines.length).toBe(10)
    for (const l of lines) {
      expect(l.lonMC).toBeGreaterThanOrEqual(-180)
      expect(l.lonMC).toBeLessThanOrEqual(180)
    }
  })

  it('Sol às 14:30 UTC → linha MC perto de -38° (meio-dia solar)', () => {
    expect(byPlanet.Sun.lonMC).toBeGreaterThan(-40)
    expect(byPlanet.Sun.lonMC).toBeLessThan(-36)
  })

  it('IC é o oposto exato de MC (±180°)', () => {
    for (const l of lines) {
      const d = (((l.lonIC - l.lonMC) % 360) + 360) % 360 // deve ser 180
      expect(Math.abs(d - 180)).toBeLessThan(0.001)
    }
  })
})
