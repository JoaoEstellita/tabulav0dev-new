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

  it('drops noisy catalog copy and falls back to generated narrative', () => {
    const narrative = buildUnifiedTransitNarrative(
      {
        transitPlanet: 'Saturn',
        aspectName: 'quadratura',
        target: { natalPlanet: 'Saturn' },
        house: 10,
        phase: 'active',
      },
      'carreira',
      'pt-BR'
    )

    const merged = `${narrative.shortText} ${narrative.modalBody}`
    expect(merged).not.toContain('Ã')
    expect(merged).not.toContain('�')
    expect(merged).not.toContain('\\"')
  })
})
