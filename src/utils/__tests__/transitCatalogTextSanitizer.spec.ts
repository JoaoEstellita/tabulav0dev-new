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

  it('normalizes escaped-quote corpus noise tokens', () => {
    const narrative = buildUnifiedTransitNarrative(
      {
        transitPlanet: 'Moon',
        aspectName: 'ingress',
        house: 2,
        phase: 'active',
      },
      'financas',
      'pt-BR'
    )

    const merged = `${narrative.shortText} ${narrative.modalBody}`.toLowerCase()
    expect(merged).not.toContain('circunst\\"ncias')
    expect(merged).not.toContain('\\"')
  })

  it('rewrites literal-translation artifacts in jupiter-midheaven catalog copy', () => {
    const narrative = buildUnifiedTransitNarrative(
      {
        transitPlanet: 'Jupiter',
        aspectName: 'conjuncao',
        target: { angle: 'MC' },
        house: 10,
        phase: 'applying',
      },
      'carreira',
      'pt-BR'
    )

    const merged = `${narrative.shortText} ${narrative.modalBody}`.toLowerCase()
    expect(merged).not.toContain('marca de alta agua')
    expect(merged).not.toContain('curva gradual para mais internacao')
    expect(merged).not.toContain('e assim por diante')
  })
})
