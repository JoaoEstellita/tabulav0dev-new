import { describe, expect, it } from 'vitest'
import { buildTransitInterpretationV2, hasUnrenderedPlaceholder } from '../transitInterpretationV2'

const sentenceCount = (text: string) => (String(text || '').match(/[.!?]+/g) || []).length
const paragraphCount = (text: string) =>
  String(text || '')
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean).length

describe('transitInterpretationV2', () => {
  it('builds deterministic output for same input', () => {
    const input = {
      title: 'Saturno quadratura Lua',
      lifeArea: 'carreira',
      houseLabel: 'Casa 10',
      statusLabel: 'Desafiador',
      timingLabel: 'Em pico',
      shortText: 'Momento sensível para ajustar ritmo e prioridades.',
      fullText: 'A pressão aumenta quando há excesso de tarefas. O foco pede revisão de estrutura e limites.',
      actionText: 'Defina uma prioridade para hoje e renegocie o restante.',
      metaText: 'Orb 0.8° • fase em pico',
    }
    const a = buildTransitInterpretationV2(input)
    const b = buildTransitInterpretationV2(input)
    expect(a).toEqual(b)
  })

  it('renders all required sections without raw placeholders', () => {
    const result = buildTransitInterpretationV2({
      title: 'Júpiter trígono Vênus',
      lifeArea: 'amor',
      houseLabel: 'Casa 7',
      statusLabel: 'Harmônico',
      timingLabel: 'Em aproximação',
      shortText: 'Boa janela para acordos afetivos e reciprocidade.',
      fullText: 'A energia facilita alianças quando há clareza de intenção.',
      actionText: 'Converse com objetividade sobre expectativas.',
      metaText: 'Orb 1.2°',
    })
    const asText = JSON.stringify(result)
    expect(hasUnrenderedPlaceholder(asText)).toBe(false)
    expect(result.tldr.length).toBeLessThanOrEqual(140)
    expect(sentenceCount(result.medium)).toBeGreaterThanOrEqual(3)
    expect(sentenceCount(result.medium)).toBeLessThanOrEqual(4)
    expect(paragraphCount(result.long)).toBeGreaterThanOrEqual(3)
    expect(paragraphCount(result.long)).toBeLessThanOrEqual(5)
    expect(result.medium.toLowerCase()).toContain('amor')
    expect(result.medium.toLowerCase()).toContain('casa 7')
  })

  it('avoids deterministic fatalistic language', () => {
    const result = buildTransitInterpretationV2({
      title: 'Netuno conjunção Mercúrio',
      lifeArea: 'comunicacao',
      houseLabel: 'Casa 3',
      statusLabel: 'Neutro',
      timingLabel: 'Afastando',
      shortText: 'Isso vai acontecer com certeza em breve.',
      fullText: 'Uma fase inevitável e garantida para confusão.',
      actionText: 'Revise mensagens antes de concluir.',
      metaText: '',
    })
    const text = `${result.tldr} ${result.medium} ${result.long}`.toLowerCase()
    expect(text).not.toContain('vai acontecer')
    expect(text).not.toContain('com certeza')
    expect(text).not.toContain('inevitavel')
    expect(text).not.toContain('garantido')
  })
})

