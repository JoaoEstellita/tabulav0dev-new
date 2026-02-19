import { describe, expect, it } from 'vitest'
import { buildUnifiedTransitNarrative } from '../astroInterpretation'

describe('astroInterpretation catalog integration', () => {
  it('prioritizes canonical pt-BR catalog text when transit key matches', () => {
    const narrative = buildUnifiedTransitNarrative(
      {
        transitPlanet: 'Jupiter',
        aspectName: 'conjuncao',
        target: { angle: 'MC' },
        phase: 'active',
      },
      'carreira',
      'pt-BR'
    )

    expect(narrative.shortText).toContain('Você faz o seu caminho agora usando a visão prática')
    expect(narrative.shortText).not.toMatch(/\{[a-zA-Z0-9_.-]+\}/)
  })

  it('keeps standard generator for non-pt-BR locales', () => {
    const narrative = buildUnifiedTransitNarrative(
      {
        transitPlanet: 'Jupiter',
        aspectName: 'conjuncao',
        target: { angle: 'MC' },
        phase: 'active',
      },
      'carreira',
      'en-US'
    )

    expect(narrative.shortText.toLowerCase()).toContain('jupiter')
    expect(narrative.shortText).not.toContain('Você faz o seu caminho agora')
  })
})

