import { describe, it, expect } from 'vitest'
import { thirteenMoonDate } from '../thirteenMoon'

describe('13 luas', () => {
  it('26/07 = Lua 1, dia 1, plasma 1', () => {
    const t = thirteenMoonDate('2025-07-26')
    expect(t.moon).toBe(1); expect(t.dayOfMoon).toBe(1); expect(t.week).toBe(1); expect(t.plasma).toBe(1); expect(t.isDayOutOfTime).toBe(false)
  })
  it('25/07 = Dia Fora do Tempo', () => {
    expect(thirteenMoonDate('2025-07-25').isDayOutOfTime).toBe(true)
  })
  it('22/08 = Lua 1, dia 28 (fim da 1ª lua)', () => {
    const t = thirteenMoonDate('2025-08-22')
    expect(t.moon).toBe(1); expect(t.dayOfMoon).toBe(28); expect(t.week).toBe(4)
  })
  it('23/08 = Lua 2, dia 1', () => {
    const t = thirteenMoonDate('2025-08-23')
    expect(t.moon).toBe(2); expect(t.dayOfMoon).toBe(1)
  })
  it('sempre dentro dos limites', () => {
    for (const d of ['2026-01-01', '2026-03-15', '2025-12-31', '2026-07-24']) {
      const t = thirteenMoonDate(d)
      if (!t.isDayOutOfTime) {
        expect(t.moon).toBeGreaterThanOrEqual(1); expect(t.moon).toBeLessThanOrEqual(13)
        expect(t.dayOfMoon).toBeGreaterThanOrEqual(1); expect(t.dayOfMoon).toBeLessThanOrEqual(28)
      }
    }
  })
})
