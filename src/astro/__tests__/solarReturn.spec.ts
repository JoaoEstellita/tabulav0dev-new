import { describe, it, expect } from 'vitest'
import { Body } from 'astronomy-engine'
import { getPlanetEclipticLongitude } from '../planets'
import { findSolarReturnMoment } from '../solarReturn'

const angDiff = (a: number, b: number) => Math.abs(((a - b + 540) % 360) - 180)

describe('findSolarReturnMoment', () => {
  it('põe o Sol de volta no grau natal (< 0.02°)', () => {
    const natalSunLon = 20.5 // Áries ~20.5° (ex.: aniversário em abril)
    const now = new Date('2026-08-23T12:00:00Z')
    const sr = findSolarReturnMoment(natalSunLon, now)
    const sunAtSr = getPlanetEclipticLongitude(sr, Body.Sun)
    expect(angDiff(sunAtSr, natalSunLon)).toBeLessThan(0.02)
  })

  it('o retorno é o mais recente antes de now (últimos ~12 meses)', () => {
    const now = new Date('2026-08-23T12:00:00Z')
    const sr = findSolarReturnMoment(20.5, now)
    expect(sr.getTime()).toBeLessThanOrEqual(now.getTime())
    const daysAgo = (now.getTime() - sr.getTime()) / 86400000
    expect(daysAgo).toBeGreaterThanOrEqual(0)
    expect(daysAgo).toBeLessThan(366)
  })

  it('funciona para grau perto de 0° (Peixes→Áries)', () => {
    const natalSunLon = 359.3
    const now = new Date('2026-08-23T12:00:00Z')
    const sr = findSolarReturnMoment(natalSunLon, now)
    expect(angDiff(getPlanetEclipticLongitude(sr, Body.Sun), natalSunLon)).toBeLessThan(0.02)
  })
})
