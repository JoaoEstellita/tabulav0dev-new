import { describe, it, expect } from 'vitest'
import { PLANET_IN_RASHI_PTBR } from '../../data/vedic/planetInRashiOverridesPtBR'
import { PLANET_IN_RASHI_I18N } from '../../data/vedic/planetInRashiOverridesI18n'
import { PLANET_IN_BHAVA_PTBR } from '../../data/vedic/planetInBhavaOverridesPtBR'
import { PLANET_IN_BHAVA_I18N } from '../../data/vedic/planetInBhavaOverridesI18n'
import { LAGNA_PTBR } from '../../data/vedic/lagnaOverridesPtBR'
import { LAGNA_I18N } from '../../data/vedic/lagnaOverridesI18n'
import { NAKSHATRA_DEEP_PTBR } from '../../data/vedic/nakshatraDeepPtBR'
import { RASHIS, NAKSHATRAS } from '../../astro/vedic/nakshatra'
import { resolvePlanetInRashi, resolvePlanetInBhava, resolveLagna, resolveNakshatraDeep } from '../vedicInterpretation'

const GRAHAS = ['sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn', 'rahu', 'ketu']
const RASHI_KEYS = RASHIS.map((r) => r.key)
const I18N_LANGS = ['en-US', 'es-ES', 'it-IT'] as const

describe('conteúdo bespoke védico — cobertura', () => {
  it('planeta-em-rashi: 9 grahas × 12 rashis = 108, todos presentes e não vazios', () => {
    expect(Object.keys(PLANET_IN_RASHI_PTBR)).toHaveLength(108)
    for (const g of GRAHAS) for (const r of RASHI_KEYS) {
      const v = PLANET_IN_RASHI_PTBR[`${g}_in_${r}`]
      expect(v, `${g}_in_${r}`).toBeTruthy()
      expect(v.length, `${g}_in_${r}`).toBeGreaterThan(20)
    }
  })

  it('planeta-em-bhava: 9 grahas × 12 casas = 108, todos presentes e não vazios', () => {
    expect(Object.keys(PLANET_IN_BHAVA_PTBR)).toHaveLength(108)
    for (const g of GRAHAS) for (let h = 1; h <= 12; h++) {
      const v = PLANET_IN_BHAVA_PTBR[`${g}_in_bhava_${h}`]
      expect(v, `${g}_in_bhava_${h}`).toBeTruthy()
      expect(v.length, `${g}_in_bhava_${h}`).toBeGreaterThan(20)
    }
  })

  it('lagna: 12 rashis, todos presentes', () => {
    expect(Object.keys(LAGNA_PTBR)).toHaveLength(12)
    for (const r of RASHI_KEYS) expect(LAGNA_PTBR[r], r).toBeTruthy()
  })

  it('resolvers devolvem o texto curado (não o fallback) para combos cobertos', () => {
    // Sol em Peixes é curado — não deve conter "colorido pela natureza" (marca do fallback).
    expect(resolvePlanetInRashi('Sun', 'meena')).not.toContain('colorido pela natureza')
    expect(resolvePlanetInBhava('Jupiter', 9)).not.toContain('atua nessa área')
    expect(resolveLagna('mesha')).toContain('Áries')
  })

  it('fallback seguro para chave inexistente (nunca quebra)', () => {
    // planeta fora da tabela → fallback por karaka, ainda devolve string.
    expect(resolvePlanetInRashi('Plutao', 'mesha')).toBeTruthy()
    expect(resolvePlanetInBhava('Plutao', 1)).toBeTruthy()
  })

  it('i18n completo: en/es/it têm os 108 rashi + 108 bhava + 12 lagna', () => {
    for (const lang of I18N_LANGS) {
      expect(Object.keys(PLANET_IN_RASHI_I18N[lang] || {}), `rashi ${lang}`).toHaveLength(108)
      expect(Object.keys(PLANET_IN_BHAVA_I18N[lang] || {}), `bhava ${lang}`).toHaveLength(108)
      expect(Object.keys(LAGNA_I18N[lang] || {}), `lagna ${lang}`).toHaveLength(12)
    }
  })

  it('regras ortográficas: es/it sem acentos; it sem apóstrofo ASCII', () => {
    const accent = /[áàâãäéèêëíìîïóòôõöúùûüçñ]/i
    const collect = (lang: string) => [
      ...Object.values(PLANET_IN_RASHI_I18N[lang] || {}),
      ...Object.values(PLANET_IN_BHAVA_I18N[lang] || {}),
      ...Object.values(LAGNA_I18N[lang] || {}),
    ] as string[]
    for (const t of collect('es-ES')) expect(accent.test(t), `es acento: ${t}`).toBe(false)
    for (const t of collect('it-IT')) {
      expect(accent.test(t), `it acento: ${t}`).toBe(false)
      expect(t.includes("'"), `it apostrofo: ${t}`).toBe(false)
    }
  })

  it('resolvers devolvem a tradução certa por idioma', () => {
    expect(resolvePlanetInRashi('Sun', 'meena', 'en-US')).toContain('Pisces')
    expect(resolvePlanetInBhava('Jupiter', 9, 'es-ES')).toContain('dharma')
    expect(resolveLagna('mesha', 'it-IT')).toContain('Ariete')
  })

  it('leitura profunda: TODOS os 27 nakshatras com 5 seções ×2 gêneros ×4 padas', () => {
    const SECTIONS = ['fisico', 'carater', 'profissao', 'familia', 'saude'] as const
    expect(Object.keys(NAKSHATRA_DEEP_PTBR)).toHaveLength(27)
    for (const n of NAKSHATRAS) expect(NAKSHATRA_DEEP_PTBR[n.key], `falta ${n.key}`).toBeTruthy()
    for (const key of Object.keys(NAKSHATRA_DEEP_PTBR)) {
      const d = NAKSHATRA_DEEP_PTBR[key]
      for (const g of ['female', 'male'] as const)
        for (const s of SECTIONS) expect(d[g][s].length, `${key}.${g}.${s}`).toBeGreaterThan(30)
      for (const p of [1, 2, 3, 4]) {
        expect(d.padas[p]?.navamsa, `${key} pada ${p} navamsa`).toBeTruthy()
        expect(d.padas[p]?.female, `${key} pada ${p} fem`).toBeTruthy()
        expect(d.padas[p]?.male, `${key} pada ${p} masc`).toBeTruthy()
      }
    }
  })

  it('leitura profunda: Mrigashira pada 1 = Navamsa de Leão (bate com a fonte)', () => {
    const d = resolveNakshatraDeep('mrigashira', 'male', 1)
    expect(d?.navamsa).toBe('Leão')
    expect(d?.reading.profissao).toBeTruthy()
    // fallback: chave inexistente devolve null (nunca quebra)
    expect(resolveNakshatraDeep('inexistente', 'male', 1)).toBeNull()
  })
})
