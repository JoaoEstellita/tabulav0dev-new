import { describe, expect, it } from 'vitest'
import { RealAstrologyEngine } from '../../services/astrology/RealAstrologyEngine'

describe('normalizeLongitudeDiff', () => {
  it('normalizes crossing 0 degrees', () => {
    const diff = RealAstrologyEngine.normalizeLongitudeDiff(1 - 359)
    expect(diff).toBeCloseTo(2)
  })
})
