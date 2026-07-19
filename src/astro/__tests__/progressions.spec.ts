import { describe, it, expect } from 'vitest'
import { progressedDate, computeProgressedAspects } from '../progressions'

const p = (name: string, longitude: number) => ({ name, longitude } as any)

describe('progressedDate — um dia por ano', () => {
  it('37 anos de vida avançam ~37 dias no mapa', () => {
    const nascimento = new Date('1989-04-10T06:59:00Z')
    const agora = new Date('2026-04-10T06:59:00Z') // 37 anos exatos
    const prog = progressedDate(nascimento, agora)
    const dias = (prog.getTime() - nascimento.getTime()) / 86400000
    expect(dias).toBeGreaterThan(36.8)
    expect(dias).toBeLessThan(37.2)
  })

  it('avança fracionado (não aos saltos anuais)', () => {
    const nascimento = new Date('1989-04-10T06:59:00Z')
    const meio = progressedDate(nascimento, new Date('2026-10-10T06:59:00Z'))
    const cheio = progressedDate(nascimento, new Date('2026-04-10T06:59:00Z'))
    const delta = (meio.getTime() - cheio.getTime()) / 86400000
    // meio ano de vida ≈ meio dia de progressão
    expect(delta).toBeGreaterThan(0.4)
    expect(delta).toBeLessThan(0.6)
  })
})

describe('computeProgressedAspects', () => {
  it('detecta aspecto da Lua progredida ao Sol natal', () => {
    const asp = computeProgressedAspects([p('Moon', 100)], [p('Sun', 280)])
    expect(asp).toHaveLength(1)
    expect(asp[0].aspect).toBe('oposicao')
    expect(asp[0].progressedPlanet).toBe('Moon')
    expect(asp[0].natalPlanet).toBe('Sun')
  })

  it('usa orbe apertada — com orbe de trânsito tudo ficaria ativo por anos', () => {
    // 3° de distância: seria aspecto num trânsito (orbe 6), mas não na progressão
    expect(computeProgressedAspects([p('Moon', 63)], [p('Sun', 0)])).toHaveLength(0)
    expect(computeProgressedAspects([p('Moon', 61)], [p('Sun', 0)])).toHaveLength(1)
  })

  it('a Lua vem primeiro — é a única que se move de verdade', () => {
    const asp = computeProgressedAspects(
      [p('Saturn', 0), p('Moon', 0)],
      [p('Sun', 0)],
    )
    expect(asp[0].progressedPlanet).toBe('Moon')
  })

  it('entradas vazias não quebram', () => {
    expect(computeProgressedAspects(null, null)).toEqual([])
    expect(computeProgressedAspects([], [p('Sun', 0)])).toEqual([])
  })
})
