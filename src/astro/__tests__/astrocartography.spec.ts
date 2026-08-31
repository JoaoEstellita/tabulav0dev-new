import { describe, it, expect } from 'vitest'
import { planetaryLines, horizonCurves } from '../astrocartography'

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

  it('curvas ASC/DSC: Sol no equador ≈ −128°/+52°', () => {
    const cv = horizonCurves(new Date(Date.UTC(1990, 4, 27, 14, 30, 0)))
    const sun = cv.find((c) => c.planet === 'Sun')!
    const ascEq = sun.asc.find((p) => p.lat === 0)!
    const dscEq = sun.dsc.find((p) => p.lat === 0)!
    expect(Math.abs(ascEq.lon - (-128.2))).toBeLessThan(1.5)
    expect(Math.abs(dscEq.lon - 51.8)).toBeLessThan(1.5)
    // curva tem pontos (latitudes não-circumpolares)
    expect(sun.asc.length).toBeGreaterThan(20)
  })
})
