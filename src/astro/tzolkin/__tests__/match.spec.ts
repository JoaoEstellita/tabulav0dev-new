import { describe, it, expect } from 'vitest'
import { getTzolkinMatch, tzolkinMatchScore } from '../match'

describe('tzolkin match — 137 × 96 (regressão §28)', () => {
  const m = getTzolkinMatch('1989-04-10', '2003-05-29')

  it('kins corretos', () => { expect(m.a.kin).toBe(137); expect(m.b.kin).toBe(96) })

  it('não são análogos/antípodas/oculto diretos', () => {
    for (const rel of ['analog', 'antipode', 'occult', 'guide', 'same-seal', 'same-tone', 'same-kin']) {
      expect(m.directRelations.aToB).not.toContain(rel)
      expect(m.directRelations.bToA).not.toContain(rel)
    }
  })

  it('selos 16 e 17 consecutivos', () => {
    expect(m.crossConnections.some(c => c.type === 'consecutive-seals')).toBe(true)
  })

  it('Semente aparece no oráculo de ambos (selo compartilhado)', () => {
    expect(m.crossConnections.some(c => c.type === 'shared-oracle-seal' && c.aElement === 'oculto' && c.bElement === 'guia')).toBe(true)
  })

  it('regente da onda de A na família de B, e vice-versa', () => {
    expect(m.crossConnections.some(c => c.type === 'ruling-a-in-family-b')).toBe(true)
    expect(m.crossConnections.some(c => c.type === 'ruling-b-in-family-a')).toBe(true)
  })

  it('Kin da relação = 233', () => { expect(m.relationshipKin).toBe(233) })

  it('scores em [0,100]', () => {
    for (const v of Object.values(m.scores)) { expect(v).toBeGreaterThanOrEqual(0); expect(v).toBeLessThanOrEqual(100) }
    expect(m.tags.length).toBeGreaterThan(0)
  })
})

describe('tzolkin match — relações diretas', () => {
  it('mesmo Kin → same-kin', () => {
    const m = getTzolkinMatch('1989-04-10', '1989-04-10')
    expect(m.directRelations.aToB).toContain('same-kin')
    expect(m.relationshipKin).toBeGreaterThanOrEqual(1)
  })
  it('tzolkinMatchScore é número 0..100', () => {
    const s = tzolkinMatchScore('1990-01-01', '2003-05-29')
    expect(s).toBeGreaterThanOrEqual(0); expect(s).toBeLessThanOrEqual(100)
  })
})
