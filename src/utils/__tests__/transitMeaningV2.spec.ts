import { expect, test } from 'vitest'
import { buildTransitMeaningV2 } from '../transitMeaningV2'

test('builds canonical meaning with area and house focus', () => {
  const meaning = buildTransitMeaningV2({
    transitKey: 'transit:saturn|quadratura|moon|10|peak',
    aspectKey: 'quadratura',
    title: 'Saturno quadratura Lua',
    lifeArea: 'carreira',
    houseLabel: 'Casa 10',
    timingLabel: 'Em pico',
    shortText: 'A fase pede ajuste de ritmo e estrutura.',
    fullText: 'O foco esta em priorizar e reduzir dispersao.',
    actionText: 'Defina uma prioridade objetiva para hoje.',
    metaText: 'Orb 0.8',
  })

  expect(meaning.transitKey).toBe('transit:saturn|quadratura|moon|10|peak')
  expect(meaning.areaFocus.toLowerCase()).toContain('carreira')
  expect(meaning.areaFocus.toLowerCase()).toContain('casa 10')
  expect(meaning.tensionVsOpportunity).toBe('alert')
})

test('keeps robust fallback when house is missing', () => {
  const meaning = buildTransitMeaningV2({
    transitKey: 'transit:neptune|conjuncao|mercury|active',
    aspectKey: 'conjuncao',
    title: 'Netuno conjuncao Mercurio',
    lifeArea: 'comunicacao',
    timingLabel: 'Em andamento',
    shortText: 'Revisar mensagens reduz ruido.',
    fullText: 'A fase pede criterio para diferenciar sinal de suposicao.',
    metaText: '',
  })

  expect(meaning.areaFocus.toLowerCase()).toContain('comunicacao')
  expect(Array.isArray(meaning.uncertaintyNotes)).toBe(true)
  expect(meaning.uncertaintyNotes.length).toBeGreaterThan(0)
})

