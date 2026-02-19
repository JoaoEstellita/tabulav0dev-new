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

    expect(narrative.shortText).not.toMatch(/\{[a-zA-Z0-9_.-]+\}/)
    expect(narrative.shortText.length).toBeGreaterThan(40)
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

  it('resolves catalog key for planets in houses (ingress)', () => {
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

    expect(narrative.shortText.length).toBeGreaterThan(30)
    expect(narrative.shortText).not.toMatch(/\{[a-zA-Z0-9_.-]+\}/)
  })

  it('does not mention status wording in unified narrative fields', () => {
    const narrative = buildUnifiedTransitNarrative(
      {
        transitPlanet: 'Saturn',
        aspectName: 'quadratura',
        target: { natalPlanet: 'Moon' },
        house: 4,
        phase: 'peak',
      },
      'familia',
      'pt-BR'
    )

    const merged = `${narrative.shortText} ${narrative.modalIntro} ${narrative.modalBody} ${narrative.actionText} ${narrative.metaText}`.toLowerCase()
    expect(merged).not.toContain('conexao com o status')
    expect(merged).not.toContain('status link')
    expect(merged).not.toContain('conexion con el estado')
    expect(merged).not.toContain('connessione con lo stato')
  })

  it('builds stable transitKey independent of transient id field', () => {
    const base = {
      transitPlanet: 'Saturn',
      aspectName: 'quadratura',
      target: { natalPlanet: 'Moon' },
      house: 10,
      phase: 'peak',
    }
    const a = buildUnifiedTransitNarrative({ ...base, id: 'abc-123' }, 'carreira', 'pt-BR')
    const b = buildUnifiedTransitNarrative({ ...base, id: 'xyz-999' }, 'carreira', 'pt-BR')
    expect(a.transitKey).toBe(b.transitKey)
    expect(a.transitKey).toContain('saturn')
    expect(a.transitKey).toContain('quadratura')
  })

  it('normalizes angle aliases in catalog resolver (MC/IC/DSC)', () => {
    const mc = buildUnifiedTransitNarrative(
      { transitPlanet: 'Jupiter', aspectName: 'oposicao', target: { angle: 'MC' }, phase: 'active' },
      'carreira',
      'pt-BR'
    )
    const ic = buildUnifiedTransitNarrative(
      { transitPlanet: 'Jupiter', aspectName: 'oposicao', target: { angle: 'IC' }, phase: 'active' },
      'familia',
      'pt-BR'
    )
    const dsc = buildUnifiedTransitNarrative(
      { transitPlanet: 'Jupiter', aspectName: 'oposicao', target: { angle: 'DSC' }, phase: 'active' },
      'amor',
      'pt-BR'
    )

    expect(mc.shortText.length).toBeGreaterThan(20)
    expect(ic.shortText.length).toBeGreaterThan(20)
    expect(dsc.shortText.length).toBeGreaterThan(20)
  })
})
