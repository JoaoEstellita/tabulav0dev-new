import { describe, it, expect } from 'vitest'
import aspectsConfig from '../aspects.config'
import { detectAspects } from '../aspects.engine'

describe('aspects.engine detectAspects', () => {
  it('detecta conjunção com orbe pequena', () => {
    const A = [{ name: 'Sun', longitude: 10, speed: 1.0 }]
    const B = [{ name: 'Moon', longitude: 12, speed: 12.0 }]
    const res = detectAspects(A, B, aspectsConfig)
    const conj = res.find(r => r.type === 'conjunção' && r.planet1 === 'Sun' && r.planet2 === 'Moon')
    expect(conj).toBeTruthy()
    expect(conj!.orb).toBeCloseTo(2, 5)
  })

  it('detecta quadratura próxima de 90°', () => {
    const A = [{ name: 'Mars', longitude: 50, speed: 0.6 }]
    const B = [{ name: 'Venus', longitude: 140, speed: 1.2 }]
    const res = detectAspects(A, B, aspectsConfig)
    const quad = res.find(r => r.type === 'quadratura')
    expect(quad).toBeTruthy()
    expect(quad!.orb).toBeLessThanOrEqual(6)
  })

  it('detecta sextil e respeita limite de orbe', () => {
    const A = [{ name: 'Mercury', longitude: 0, speed: 1.4 }]
    const B = [{ name: 'Jupiter', longitude: 66, speed: 0.2 }]
    const res = detectAspects(A, B, aspectsConfig)
    const sext = res.find(r => r.type === 'sextil')
    expect(sext).toBeTruthy()
    expect(sext!.orb).toBeCloseTo(6, 5)
  })

  it('marca aplicante quando planeta A é mais rápido que B', () => {
    const A = [{ name: 'Moon', longitude: 100, speed: 13.0 }]
    const B = [{ name: 'Saturn', longitude: 100.5, speed: 0.05 }]
    const res = detectAspects(A, B, aspectsConfig)
    const conj = res.find(r => r.type === 'conjunção')
    expect(conj).toBeTruthy()
    expect(conj!.isApplying).toBe(true)
  })
})


