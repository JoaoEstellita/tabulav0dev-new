import { describe, it, expect } from 'vitest'
import { getChineseMatch } from '../match'
import type { ChineseInput } from '../bazi'

const A: ChineseInput = { year: 1989, month: 4, day: 10, longitude: -43.2, utc: new Date(Date.UTC(1989, 3, 10, 15)) }
const B: ChineseInput = { year: 1990, month: 8, day: 15, longitude: -43.2, utc: new Date(Date.UTC(1990, 7, 15, 15)) }

describe('chinese match', () => {
  const m = getChineseMatch(A, B)
  it('scores em [0,100]', () => {
    for (const v of Object.values(m.scores)) { expect(v).toBeGreaterThanOrEqual(0); expect(v).toBeLessThanOrEqual(100) }
  })
  it('tem relação de Day Master e tags', () => {
    expect(typeof m.dayMasterRelation).toBe('string')
    expect(m.tags.length).toBeGreaterThan(0)
  })
  it('mesmo mapa → alta sintonia', () => {
    const same = getChineseMatch(A, A)
    expect(same.scores.overall).toBeGreaterThan(50)
    expect(same.dayMasterRelation).toBe('same')
  })
})
