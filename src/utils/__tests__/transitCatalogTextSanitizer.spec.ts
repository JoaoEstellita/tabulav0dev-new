import { describe, expect, it } from 'vitest'
import { buildUnifiedTransitNarrative } from '../astroInterpretation'

describe('catalog text sanitization', () => {
  it('removes redundant focus and generic phase boilerplate', () => {
    const narrative = buildUnifiedTransitNarrative(
      {
        transitPlanet: 'Uranus',
        aspectName: 'oposicao',
        target: { angle: 'DSC' },
        house: 1,
        phase: 'applying',
      },
      'amor',
      'pt-BR'
    )

    const merged = `${narrative.shortText} ${narrative.modalBody}`.toLowerCase()
    expect(merged).not.toContain('foco recai em')
    expect(merged).not.toContain('a fase atual')
    expect(merged).not.toContain('sequencia pratica')
  })
})

