import { describe, it, expect } from 'vitest'
import { synastryScore, synastryAspectLine, synastryAspectDetail, synastryToneOf, synastryHouseOverlays } from '../synastryReading'
import type { SynastryAspect, NatalChart } from '../synastry'

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

describe('synastryAspectDetail', () => {
  it('headline + body relacional; tip pela natureza', () => {
    const tenso = synastryAspectDetail(asp('venus', 'uranus', 'quadratura', 'tenso', 2), 'pt-BR')
    expect(tenso.headline.length).toBeGreaterThan(0)
    expect(tenso.body).toContain('fricção')
    const harm = synastryAspectDetail(asp('sun', 'moon', 'trigono', 'harmonioso', 1), 'pt-BR')
    expect(harm.body).toContain('flui')
  })
  it('deriva o tom quando o aspecto vem sem tone (endpoint /synastry)', () => {
    expect(synastryToneOf('quadratura')).toBe('tenso')
    expect(synastryToneOf('sextil')).toBe('harmonioso')
    expect(synastryToneOf('conjuncao')).toBe('neutro')
    const d = synastryAspectDetail({ mine: 'venus', theirs: 'mars', aspect: 'oposicao', orb: 3 }, 'pt-BR')
    expect(d.body).toContain('fricção')
  })
})

describe('synastryHouseOverlays', () => {
  const wholeSignCusps = Array.from({ length: 12 }, (_, i) => i * 30)
  const pl = (name: string, longitude: number) => ({ name, longitude } as any)
  const chart = (planets: any[]): NatalChart => ({ planets, cusps: wholeSignCusps, ascendant: 0 })

  it('coloca o planeta de A na casa de B nos dois sentidos', () => {
    const A = chart([pl('Sun', 65)]) // 65° → casa 3 nas cúspides whole-sign
    const B = chart([pl('Venus', 195)]) // 195° → casa 7
    const ov = synastryHouseOverlays(A, B, 'Ana', 'Bruno', 'pt-BR')
    const sun = ov.find((o) => o.planet === 'sun')
    const venus = ov.find((o) => o.planet === 'venus')
    expect(sun?.house).toBe(3)
    expect(sun?.toName).toBe('Bruno')
    expect(venus?.house).toBe(7)
    expect(venus?.toName).toBe('Ana')
    expect(sun?.focus.length).toBeGreaterThan(0)
  })

  it('sem cúspides → vazio', () => {
    const A: NatalChart = { planets: [pl('Sun', 10)], cusps: null, ascendant: null }
    expect(synastryHouseOverlays(A, A, 'A', 'B', 'pt-BR')).toEqual([])
  })

  it('ignora planetas não-pessoais', () => {
    const A = chart([pl('Pluto', 65)])
    const B = chart([pl('Moon', 100)])
    const ov = synastryHouseOverlays(A, B, 'A', 'B', 'pt-BR')
    expect(ov.some((o) => o.planet === 'pluto')).toBe(false)
    expect(ov.some((o) => o.planet === 'moon')).toBe(true)
  })
})
