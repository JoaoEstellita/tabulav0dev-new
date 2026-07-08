import { describe, expect, it } from 'vitest'
import { LUNAR_NODE_HOUSE_PTBR_OVERRIDES } from '../../data/lunarNodeHouseOverridesPtBR'
import { LUNAR_NODE_HOUSE_I18N_OVERRIDES } from '../../data/lunarNodeHouseOverridesI18n'
import { resolveLunarNodeHouseText } from '../natalInterpretation'

const HOUSES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const
const LOCALES = ['en-US', 'es-ES', 'it-IT'] as const

const MOJIBAKE_TOKENS = ['Ã', '�', 'â€™', 'â€œ', 'â€']
const DETERMINISTIC_TOKENS = [
  'vai acontecer', 'com certeza', 'inevitavel', 'inevitable', 'garantido', 'garantida',
]
const ACCENTED_CHARS_REGEX = /[áéíóúàèìòùâêîôûãõäëïöüñ]/i
const APOSTROPHE_REGEX = /'/

const countSentences = (text: string): number =>
  (text.match(/[.!?]+(?:\s|$)/g) || []).length

describe('lunar node house axis catalog coverage', () => {
  it('has all 12 required keys in pt-BR (NN em cada casa)', () => {
    const missing: string[] = []
    for (const house of HOUSES) {
      const text = LUNAR_NODE_HOUSE_PTBR_OVERRIDES[`natal:nn_house_${house}`]
      if (!text || text.trim().length < 50) missing.push(`natal:nn_house_${house}`)
    }
    expect(missing).toEqual([])
  })

  it('keeps i18n locales in exact parity with pt-BR keyset', () => {
    const ptKeys = new Set(Object.keys(LUNAR_NODE_HOUSE_PTBR_OVERRIDES))
    LOCALES.forEach((locale) => {
      const localeMap = LUNAR_NODE_HOUSE_I18N_OVERRIDES[locale] || {}
      const localeKeys = new Set(Object.keys(localeMap))
      expect(Array.from(ptKeys).filter((k) => !localeKeys.has(k))).toEqual([])
      expect(Array.from(localeKeys).filter((k) => !ptKeys.has(k))).toEqual([])
    })
  })

  it('mentions both Nódulo Norte and Nódulo Sul in every pt-BR entry', () => {
    const bad: string[] = []
    Object.entries(LUNAR_NODE_HOUSE_PTBR_OVERRIDES).forEach(([key, text]) => {
      if (!text.includes('Nódulo Norte') || !text.includes('Nódulo Sul')) bad.push(key)
    })
    expect(bad).toEqual([])
  })

  it('has at least 3 sentences and no mojibake/deterministic language in all locales', () => {
    const bad: Array<{ locale: string; key: string; issue: string }> = []
    const checkMap = (locale: string, map: Record<string, string>) => {
      Object.entries(map).forEach(([key, text]) => {
        const t = String(text || '')
        if (countSentences(t) < 3) bad.push({ locale, key, issue: 'sentences' })
        if (MOJIBAKE_TOKENS.some((tok) => t.includes(tok))) bad.push({ locale, key, issue: 'mojibake' })
        if (DETERMINISTIC_TOKENS.some((tok) => t.toLowerCase().includes(tok))) bad.push({ locale, key, issue: 'deterministic' })
      })
    }
    checkMap('pt-BR', LUNAR_NODE_HOUSE_PTBR_OVERRIDES)
    LOCALES.forEach((locale) => checkMap(locale, LUNAR_NODE_HOUSE_I18N_OVERRIDES[locale] || {}))
    expect(bad).toEqual([])
  })

  it('has no "will" in en-US entries', () => {
    const bad: string[] = []
    Object.entries(LUNAR_NODE_HOUSE_I18N_OVERRIDES['en-US'] || {}).forEach(([key, text]) => {
      if (/\bwill\b/i.test(String(text || ''))) bad.push(key)
    })
    expect(bad).toEqual([])
  })

  it('has no accents in es-ES and no accents/apostrophes in it-IT', () => {
    const bad: Array<{ locale: string; key: string; issue: string }> = []
    Object.entries(LUNAR_NODE_HOUSE_I18N_OVERRIDES['es-ES'] || {}).forEach(([key, text]) => {
      const m = String(text || '').match(ACCENTED_CHARS_REGEX)
      if (m) bad.push({ locale: 'es-ES', key, issue: m[0] })
    })
    Object.entries(LUNAR_NODE_HOUSE_I18N_OVERRIDES['it-IT'] || {}).forEach(([key, text]) => {
      const m = String(text || '').match(ACCENTED_CHARS_REGEX)
      if (m) bad.push({ locale: 'it-IT', key, issue: m[0] })
      if (APOSTROPHE_REGEX.test(String(text || ''))) bad.push({ locale: 'it-IT', key, issue: 'apostrophe' })
    })
    expect(bad).toEqual([])
  })

  it('resolveLunarNodeHouseText returns text for all 12 houses in all locales', () => {
    const missing: string[] = []
    for (const house of HOUSES) {
      for (const locale of ['pt-BR', ...LOCALES] as const) {
        const result = resolveLunarNodeHouseText(house, locale)
        if (!result || result.length < 50) missing.push(`${locale}:natal:nn_house_${house}`)
      }
    }
    expect(missing).toEqual([])
  })

  it('resolveLunarNodeHouseText returns null for invalid house', () => {
    expect(resolveLunarNodeHouseText(0)).toBeNull()
    expect(resolveLunarNodeHouseText(13)).toBeNull()
    expect(resolveLunarNodeHouseText(NaN)).toBeNull()
  })
})
