import { describe, it, expect } from 'vitest'
import { areasAffectedByTransit, areaLabelsForTransit } from '../transitLifeAreas'

describe('areasAffectedByTransit', () => {
  it('atribui pela casa impactada', () => {
    // Casa 7 é de Amor; casa 10 é de Carreira e Família.
    expect(areasAffectedByTransit('Sun', 'Sun', 7)).toContain('amor')
    expect(areasAffectedByTransit('Moon', 'Moon', 10)).toEqual(
      expect.arrayContaining(['carreira', 'familia']),
    )
  })

  it('atribui pelo planeta, mesmo sem casa', () => {
    expect(areasAffectedByTransit('Venus', 'Saturn', null)).toEqual(
      expect.arrayContaining(['amor', 'carreira', 'financas', 'familia']),
    )
  })

  it('considera os DOIS lados — o planeta em trânsito e o ponto natal tocado', () => {
    // Mercúrio só entra por ser o alvo natal. Se olhássemos só o trânsito,
    // "Comunicação" sumiria de um trânsito que bate justamente em Mercúrio.
    expect(areasAffectedByTransit('Neptune', 'Mercury', null)).toContain('comunicacao')
  })

  it('devolve vazio quando nada bate, em vez de inventar área', () => {
    expect(areasAffectedByTransit('Chiron', 'Lilith', null)).toEqual([])
    expect(areasAffectedByTransit(null, null, null)).toEqual([])
  })

  it('ignora casa inválida sem quebrar', () => {
    expect(areasAffectedByTransit('Chiron', 'Lilith', 'Casa 7' as any)).toEqual([])
  })

  it('rótulos saem acentuados e na ordem canônica', () => {
    const labels = areaLabelsForTransit('Venus', 'Jupiter', 2)
    expect(labels).toContain('Finanças')
    expect(labels.indexOf('Amor')).toBeLessThan(labels.indexOf('Finanças'))
  })
})
