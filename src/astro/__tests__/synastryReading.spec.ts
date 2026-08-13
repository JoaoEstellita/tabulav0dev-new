import { describe, it, expect } from 'vitest'
import { synastryScore, synastryAspectLine } from '../synastryReading'
import type { SynastryAspect } from '../synastry'

const asp = (mine: string, theirs: string, aspect: string, tone: string, orb: number): SynastryAspect =>
  ({ mine, theirs, aspect, tone, orb, symbol: '·' } as any)

describe('synastryScore', () => {
  it('conjunto harmônico pontua mais alto que conjunto tenso', () => {
    const harmonic = [
      asp('sun', 'moon', 'trigono', 'harmonioso', 0.5),
      asp('venus', 'mars', 'sextil', 'harmonioso', 1),
    ]
    const tense = [
      asp('sun', 'moon', 'quadratura', 'tenso', 0.5),
      asp('venus', 'mars', 'oposicao', 'tenso', 1),
    ]
    const h = synastryScore(harmonic)
    const t = synastryScore(tense)
    expect(h.pct).toBeGreaterThan(t.pct)
    expect(h.bandKey).toBe('harmonica')
    expect(t.bandKey).toBe('tensa')
    expect(h.harmonics).toBe(2)
    expect(t.tensions).toBe(2)
  })

  it('lista vazia → neutra em 50', () => {
    const s = synastryScore([])
    expect(s.pct).toBe(50)
    expect(s.bandKey).toBe('neutra')
  })

  it('pct fica entre 5 e 95', () => {
    const many = Array.from({ length: 12 }, () => asp('sun', 'moon', 'trigono', 'harmonioso', 0))
    expect(synastryScore(many).pct).toBeLessThanOrEqual(95)
  })
})

describe('synastryAspectLine', () => {
  it('compõe frase legível nos 4 idiomas', () => {
    const a = asp('venus', 'mars', 'quadratura', 'tenso', 2)
    for (const lang of ['pt-BR', 'en-US', 'es-ES', 'it-IT']) {
      const line = synastryAspectLine(a, lang)
      expect(line.length).toBeGreaterThan(0)
      expect(line.endsWith('.')).toBe(true)
    }
    expect(synastryAspectLine(a, 'pt-BR')).toContain('Afeto')
    expect(synastryAspectLine(a, 'en-US')).toContain('Affection')
  })

  it('planeta/aspecto desconhecido → string vazia (cai no fallback do chamador)', () => {
    expect(synastryAspectLine(asp('chiron', 'moon', 'trigono', 'harmonioso', 1), 'pt-BR')).toBe('')
    expect(synastryAspectLine(asp('sun', 'moon', 'quintil', 'neutro', 1), 'pt-BR')).toBe('')
  })
})
