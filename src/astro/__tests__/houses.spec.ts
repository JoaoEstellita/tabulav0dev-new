import { describe, it, expect } from 'vitest'
import { computeHousesUTC } from '../../astro'

const RIO = { lat: -22.9068, lon: -43.1729 }

describe('Houses basic properties', () => {
  it('whole sign: 12 cusps and arcs sum ≈ 360', async () => {
    const res = await computeHousesUTC(new Date('2025-08-08T23:59:00Z'), RIO.lat, RIO.lon, 'whole')
    expect(res.cusps).toHaveLength(12)
    let sum = 0
    for (let i=0;i<12;i++){
      const a = res.cusps[i]
      const b = res.cusps[(i+1)%12]
      const d = ((b - a + 360) % 360)
      expect(d).toBeGreaterThanOrEqual(0)
      sum += d
    }
    expect(Math.abs(sum - 360)).toBeLessThan(1e-6)
  })

  it('equal: planeta cai em exatamente 1 casa', async () => {
    const res = await computeHousesUTC(new Date('2025-08-08T23:59:00Z'), RIO.lat, RIO.lon, 'equal')
    const seen = new Set()
    for (const [p,h] of Object.entries(res.planetHouses)){
      expect(h).toBeGreaterThanOrEqual(1)
      expect(h).toBeLessThanOrEqual(12)
      const key = p+':'+h
      expect(seen.has(key)).toBe(false)
      seen.add(key)
    }
  })
})


