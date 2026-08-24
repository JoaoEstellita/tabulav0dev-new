import { describe, it, expect } from 'vitest'
import { Body } from 'astronomy-engine'
import { getPlanetEclipticLongitude } from '../planets'
import { findLunarReturnMoment } from '../lunarReturn'

const angDiff = (a: number, b: number) => Math.abs(((a - b + 540) % 360) - 180)

describe('findLunarReturnMoment', () => {
  it('põe a Lua de volta no grau natal (< 0.05°)', () => {
    const natalMoonLon = 128.4
    const now = new Date('2026-08-24T12:00:00Z')
    const lr = findLunarReturnMoment(natalMoonLon, now)
    expect(angDiff(getPlanetEclipticLongitude(lr, Body.Moon), natalMoonLon)).toBeLessThan(0.05)
  })

  it('o retorno é recente (últimos ~30 dias)', () => {
    const now = new Date('2026-08-24T12:00:00Z')
    const lr = findLunarReturnMoment(128.4, now)
    const daysAgo = (now.getTime() - lr.getTime()) / 86400000
    expect(daysAgo).toBeGreaterThanOrEqual(0)
    expect(daysAgo).toBeLessThan(30)
  })

  it('funciona perto de 0° (cruzamento Peixes→Áries)', () => {
    const lr = findLunarReturnMoment(359.5, new Date('2026-08-24T12:00:00Z'))
    expect(angDiff(getPlanetEclipticLongitude(lr, Body.Moon), 359.5)).toBeLessThan(0.05)
  })
})
