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

describe('artefatos de imobilidade', () => {
  it('descarta conjunção do planeta lento com ele mesmo', () => {
    // Saturno progredido conjunção Saturno natal não é evento: é o planeta
    // parado onde sempre esteve. Apareceria na tela a vida inteira.
    const p = (name: string, longitude: number) => ({ name, longitude } as any)
    expect(computeProgressedAspects([p('Saturn', 100)], [p('Saturn', 100)])).toEqual([])
    expect(computeProgressedAspects([p('Neptune', 50)], [p('Neptune', 50)])).toEqual([])
    expect(computeProgressedAspects([p('Uranus', 10)], [p('Uranus', 10)])).toEqual([])
  })

  it('MANTÉM o retorno lunar — é ciclo real de ~27 anos', () => {
    const p = (name: string, longitude: number) => ({ name, longitude } as any)
    expect(computeProgressedAspects([p('Moon', 100)], [p('Moon', 100)])).toHaveLength(1)
  })

  it('mantém aspecto entre planetas lentos DIFERENTES', () => {
    const p = (name: string, longitude: number) => ({ name, longitude } as any)
    expect(computeProgressedAspects([p('Saturn', 100)], [p('Pluto', 160)])).toHaveLength(1)
  })
})
