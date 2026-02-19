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
    expect(narrative.shortText.toLowerCase()).toContain('visibilidade')
  })

  it('applies curated override for en-US when transit key matches', () => {
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
    expect(narrative.shortText.toLowerCase()).toContain('visibility')
    expect(narrative.shortText.toLowerCase()).not.toContain('will happen for sure')
  })

  it('applies curated override for es-ES and it-IT with same semantic base', () => {
    const baseTransit = {
      transitPlanet: 'Saturn',
      aspectName: 'sextil',
      target: { natalPlanet: 'Jupiter' },
      phase: 'active',
    }
    const es = buildUnifiedTransitNarrative(baseTransit, 'carreira', 'es-ES')
    const it = buildUnifiedTransitNarrative(baseTransit, 'carreira', 'it-IT')

    expect(es.shortText.toLowerCase()).toContain('expansion')
    expect(it.shortText.toLowerCase()).toContain('espansione')
    expect(es.shortText.toLowerCase()).not.toContain('inevitable')
    expect(it.shortText.toLowerCase()).not.toContain('inevitabile')
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

  it('sanitizes status wording from area labels', () => {
    const narrative = buildUnifiedTransitNarrative(
      {
        transitPlanet: 'Saturn',
        aspectName: 'quadratura',
        target: { natalPlanet: 'Moon' },
        house: 4,
        phase: 'active',
      },
      'Status Familia',
      'pt-BR'
    )
    const merged = `${narrative.shortText} ${narrative.modalIntro} ${narrative.modalBody}`.toLowerCase()
    expect(merged).not.toContain('status familia')
  })

  it('applies pt-BR override text before generated catalog entry', () => {
    const narrative = buildUnifiedTransitNarrative(
      {
        transitPlanet: 'Saturn',
        aspectName: 'quadratura',
        target: { natalPlanet: 'Sun' },
        phase: 'active',
      },
      'carreira',
      'pt-BR'
    )

    const text = narrative.shortText.toLowerCase()
    expect(text).toContain('responsabilidade')
    expect(text).toContain('foco no essencial')
    expect(text).not.toContain('vai acontecer')
    expect(text).not.toContain('inevitavel')
  })
})
