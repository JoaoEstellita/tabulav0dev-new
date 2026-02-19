import { expect, test } from 'vitest'
import { buildTransitInterpretationV2, hasUnrenderedPlaceholder } from '../transitInterpretationV2'

const sentenceCount = (text: string) => (String(text || '').match(/[.!?]+/g) || []).length
const paragraphCount = (text: string) =>
  String(text || '')
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean).length

test('builds deterministic output for same input', () => {
  const input = {
    transitKey: 'transit:saturn|quadratura|moon|10|peak',
    aspectKey: 'quadratura',
    title: 'Saturno quadratura Lua',
    lifeArea: 'carreira',
    houseLabel: 'Casa 10',
    timingLabel: 'Em pico',
    shortText: 'Momento sensivel para ajustar ritmo e prioridades.',
    fullText: 'A pressao aumenta quando ha excesso de tarefas. O foco pede revisao de estrutura e limites.',
    actionText: 'Defina uma prioridade para hoje e renegocie o restante.',
    metaText: 'Orb 0.8 deg • fase em pico',
  }
  const a = buildTransitInterpretationV2(input)
  const b = buildTransitInterpretationV2(input)
  expect(a).toEqual(b)
})

test('renders all required sections without raw placeholders', () => {
  const result = buildTransitInterpretationV2({
    transitKey: 'transit:jupiter|trigono|venus|7|applying',
    aspectKey: 'trigono',
    title: 'Jupiter trigono Venus',
    lifeArea: 'amor',
    houseLabel: 'Casa 7',
    timingLabel: 'Em aproximacao',
    shortText: 'Boa janela para acordos afetivos e reciprocidade.',
    fullText: 'A energia facilita aliancas quando ha clareza de intencao.',
    actionText: 'Converse com objetividade sobre expectativas.',
    metaText: 'Orb 1.2 deg',
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

test('avoids deterministic fatalistic language', () => {
  const result = buildTransitInterpretationV2({
    transitKey: 'transit:neptune|conjuncao|mercury|3|separating',
    aspectKey: 'conjuncao',
    title: 'Netuno conjuncao Mercurio',
    lifeArea: 'comunicacao',
    houseLabel: 'Casa 3',
    timingLabel: 'Afastando',
    shortText: 'Isso vai acontecer com certeza em breve.',
    fullText: 'Uma fase inevitavel e garantida para confusao.',
    actionText: 'Revise mensagens antes de concluir.',
    metaText: '',
  })
  const text = `${result.tldr} ${result.medium} ${result.long}`.toLowerCase()
  expect(text).not.toContain('vai acontecer')
  expect(text).not.toContain('com certeza')
  expect(text).not.toContain('inevitavel')
  expect(text).not.toContain('garantido')
})

test('derives valence from aspect semantics, not status labels', () => {
  const alertTransit = buildTransitInterpretationV2({
    transitKey: 'transit:mars|quadratura|moon|10|active',
    aspectKey: 'quadratura',
    title: 'Marte quadratura Lua',
    lifeArea: 'carreira',
    houseLabel: 'Casa 10',
    timingLabel: 'Em pico',
    shortText: 'Ajuste de ritmo em andamento.',
    fullText: 'A fase pede priorizacao e menos dispersao.',
    actionText: 'Defina o foco do dia.',
    metaText: 'Orb 0.6',
  })
  const positiveTransit = buildTransitInterpretationV2({
    transitKey: 'transit:jupiter|trigono|venus|7|active',
    aspectKey: 'trigono',
    title: 'Jupiter trigono Venus',
    lifeArea: 'amor',
    houseLabel: 'Casa 7',
    timingLabel: 'Em aproximacao',
    shortText: 'Mais fluidez para acordos.',
    fullText: 'A energia ajuda quando existe clareza de limite e valor.',
    actionText: 'Formalize um acordo simples.',
    metaText: 'Orb 1.2',
  })
  expect(alertTransit.valence).toBe('alert')
  expect(positiveTransit.valence).toBe('positive')
})

test('does not mention status wording in interpretation text blocks', () => {
  const result = buildTransitInterpretationV2({
    transitKey: 'transit:venus|sextil|moon|4|active',
    aspectKey: 'sextil',
    title: 'Venus sextil Lua',
    lifeArea: 'familia',
    houseLabel: 'Casa 4',
    timingLabel: 'Em aproximacao',
    shortText: 'A fase favorece acordos mais suaves no lar.',
    fullText: 'A leitura indica margem para alinhar rotina e afeto com mais clareza.',
    actionText: 'Escolha uma conversa objetiva e curta para hoje.',
    metaText: 'Orb 1.1',
  })

  const merged = `${result.tldr} ${result.medium} ${result.long} ${result.confidenceWhy}`.toLowerCase()
  expect(merged).not.toContain('status')
  expect(merged).not.toContain('estado')
  expect(merged).not.toContain('stato')
})
