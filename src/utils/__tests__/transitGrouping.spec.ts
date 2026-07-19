import { describe, it, expect } from 'vitest'
import { groupTransits, classifyTransit, RECENT_DAYS, LONG_TERM_DAYS } from '../transitGrouping'

const dias = (n: number) => new Date(Date.now() - n * 86400000).toISOString()

describe('classifyTransit', () => {
  it('janela longa é longo prazo, mesmo tendo começado ontem', () => {
    // Netuno numa casa dura anos. Ter entrado ontem não faz disso uma "mudança
    // recente" — é o começo de um ciclo longo. A duração precisa ser checada antes.
    expect(classifyTransit({ window: { start: dias(1), days: 1600 } })).toBe('longTerm')
  })

  it('começou nos últimos dias e é curto → recente', () => {
    expect(classifyTransit({ window: { start: dias(2), days: 20 } })).toBe('recent')
  })

  it('em curso há tempo mas não é longo → ativo', () => {
    expect(classifyTransit({ window: { start: dias(40), days: 60 } })).toBe('active')
  })

  it('sem dados de janela cai em ativo (não some da tela)', () => {
    expect(classifyTransit({})).toBe('active')
  })

  it('respeita os limiares declarados', () => {
    expect(classifyTransit({ window: { start: dias(RECENT_DAYS - 1), days: 10 } })).toBe('recent')
    expect(classifyTransit({ window: { days: LONG_TERM_DAYS + 1 } })).toBe('longTerm')
  })
})

describe('groupTransits', () => {
  it('elege o de maior força como destaque e não o repete nos baldes', () => {
    const lista = [
      { strength: 40, window: { start: dias(2), days: 10 } },
      { strength: 95, window: { start: dias(3), days: 10 } },
      { strength: 10, window: { days: 500 } },
    ]
    const g = groupTransits(lista)
    expect(g.highlight?.strength).toBe(95)
    const todos = [...g.recent, ...g.active, ...g.longTerm]
    expect(todos).toHaveLength(2)
    expect(todos.some((t) => t.strength === 95)).toBe(false)
  })

  it('distribui nos baldes certos', () => {
    const g = groupTransits([
      { strength: 99, window: { days: 5 } },
      { strength: 50, window: { start: dias(1), days: 10 } },
      { strength: 40, window: { start: dias(60), days: 80 } },
      { strength: 30, window: { days: 900 } },
    ])
    expect(g.recent).toHaveLength(1)
    expect(g.active).toHaveLength(1)
    expect(g.longTerm).toHaveLength(1)
  })

  it('lista vazia não quebra', () => {
    const g = groupTransits([])
    expect(g.highlight).toBeNull()
    expect(g.recent).toEqual([])
  })
})
