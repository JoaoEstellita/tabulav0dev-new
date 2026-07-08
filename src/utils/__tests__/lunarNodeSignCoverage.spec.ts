import { describe, expect, it } from 'vitest'
import { LUNAR_NODE_SIGN_PTBR_OVERRIDES } from '../../data/lunarNodeSignOverridesPtBR'
import { LUNAR_NODE_SIGN_I18N_OVERRIDES } from '../../data/lunarNodeSignOverridesI18n'
import { resolveLunarNodeSignText } from '../natalInterpretation'

const SIGNS = [
  'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
  'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces',
] as const

const LOCALES = ['en-US', 'es-ES', 'it-IT'] as const

const MOJIBAKE_TOKENS = ['Ã', '�', 'â€™', 'â€œ', 'â€']
const DETERMINISTIC_TOKENS = [
  'vai acontecer', 'com certeza', 'inevitavel', 'inevitable',
  'garantido', 'garantida', 'destino inescapavel',
]

const ACCENTED_CHARS_REGEX = /[áéíóúàèìòùâêîôûãõäëïöüñ]/i
const APOSTROPHE_REGEX = /'/

const hasMojibake = (text: string): boolean =>
  MOJIBAKE_TOKENS.some((token) => String(text || '').includes(token))

const hasDeterministicLanguage = (text: string): boolean => {
  const normalized = String(text || '').toLowerCase()
  return DETERMINISTIC_TOKENS.some((token) => normalized.includes(token))
}

const countSentences = (text: string): number =>
  (text.match(/[.!?]+(?:\s|$)/g) || []).length

describe('lunar node sign axis catalog coverage', () => {
  it('has all 12 required keys in pt-BR (NN em cada signo)', () => {
    const missing: string[] = []
    for (const sign of SIGNS) {
      const key = `natal:nn_sign_${sign}`
      const text = LUNAR_NODE_SIGN_PTBR_OVERRIDES[key]
      if (!text || text.trim().length < 50) missing.push(key)
    }
    expect(missing).toEqual([])
  })

  it('keeps i18n locales in exact parity with pt-BR keyset', () => {
    const ptKeys = new Set(Object.keys(LUNAR_NODE_SIGN_PTBR_OVERRIDES))
    LOCALES.forEach((locale) => {
      const localeMap = LUNAR_NODE_SIGN_I18N_OVERRIDES[locale] || {}
      const localeKeys = new Set(Object.keys(localeMap))
      const missing = Array.from(ptKeys).filter((k) => !localeKeys.has(k))
      const extra = Array.from(localeKeys).filter((k) => !ptKeys.has(k))
      expect(missing).toEqual([])
      expect(extra).toEqual([])
    })
  })

  it('mentions both Nódulo Norte and Nódulo Sul in every pt-BR entry', () => {
    const bad: string[] = []
    Object.entries(LUNAR_NODE_SIGN_PTBR_OVERRIDES).forEach(([key, text]) => {
      if (!text.includes('Nódulo Norte') || !text.includes('Nódulo Sul')) bad.push(key)
    })
    expect(bad).toEqual([])
  })

  it('has minimum text length of 50 chars per entry in all locales', () => {
    const tooShort: Array<{ locale: string; key: string }> = []
    const checkMap = (locale: string, map: Record<string, string>) => {
      Object.entries(map).forEach(([key, text]) => {
        if ((text || '').trim().length < 50) tooShort.push({ locale, key })
      })
    }
    checkMap('pt-BR', LUNAR_NODE_SIGN_PTBR_OVERRIDES)
    LOCALES.forEach((locale) => checkMap(locale, LUNAR_NODE_SIGN_I18N_OVERRIDES[locale] || {}))
    expect(tooShort).toEqual([])
  })

  it('has at least 3 sentences per entry in all locales', () => {
    const tooFew: Array<{ locale: string; key: string; sentences: number }> = []
    const checkMap = (locale: string, map: Record<string, string>) => {
      Object.entries(map).forEach(([key, text]) => {
        const n = countSentences(String(text || ''))
        if (n < 3) tooFew.push({ locale, key, sentences: n })
      })
    }
    checkMap('pt-BR', LUNAR_NODE_SIGN_PTBR_OVERRIDES)
    LOCALES.forEach((locale) => checkMap(locale, LUNAR_NODE_SIGN_I18N_OVERRIDES[locale] || {}))
    expect(tooFew).toEqual([])
  })

  it('has no mojibake in any locale', () => {
    const bad: Array<{ locale: string; key: string }> = []
    const checkMap = (locale: string, map: Record<string, string>) => {
      Object.entries(map).forEach(([key, text]) => {
        if (hasMojibake(text)) bad.push({ locale, key })
      })
    }
    checkMap('pt-BR', LUNAR_NODE_SIGN_PTBR_OVERRIDES)
    LOCALES.forEach((locale) => checkMap(locale, LUNAR_NODE_SIGN_I18N_OVERRIDES[locale] || {}))
    expect(bad).toEqual([])
  })

  it('has no deterministic language in any locale', () => {
    const bad: Array<{ locale: string; key: string }> = []
    const checkMap = (locale: string, map: Record<string, string>) => {
      Object.entries(map).forEach(([key, text]) => {
        if (hasDeterministicLanguage(text)) bad.push({ locale, key })
      })
    }
    checkMap('pt-BR', LUNAR_NODE_SIGN_PTBR_OVERRIDES)
    LOCALES.forEach((locale) => checkMap(locale, LUNAR_NODE_SIGN_I18N_OVERRIDES[locale] || {}))
    expect(bad).toEqual([])
  })

  it('has no "will" future tense in en-US entries', () => {
    const bad: string[] = []
    Object.entries(LUNAR_NODE_SIGN_I18N_OVERRIDES['en-US'] || {}).forEach(([key, text]) => {
      if (/\bwill\b/i.test(String(text || ''))) bad.push(key)
    })
    expect(bad).toEqual([])
  })

  it('has no accented characters in es-ES entries', () => {
    const bad: Array<{ key: string; char: string }> = []
    Object.entries(LUNAR_NODE_SIGN_I18N_OVERRIDES['es-ES'] || {}).forEach(([key, text]) => {
      const match = String(text || '').match(ACCENTED_CHARS_REGEX)
      if (match) bad.push({ key, char: match[0] })
    })
    expect(bad).toEqual([])
  })

  it('has no accented characters or apostrophes in it-IT entries', () => {
    const bad: Array<{ key: string; issue: string }> = []
    Object.entries(LUNAR_NODE_SIGN_I18N_OVERRIDES['it-IT'] || {}).forEach(([key, text]) => {
      const accentMatch = String(text || '').match(ACCENTED_CHARS_REGEX)
      if (accentMatch) bad.push({ key, issue: `accented: ${accentMatch[0]}` })
      if (APOSTROPHE_REGEX.test(String(text || ''))) bad.push({ key, issue: 'apostrophe' })
    })
    expect(bad).toEqual([])
  })

  it('resolveLunarNodeSignText returns text for all 12 signs in all locales', () => {
    const missing: string[] = []
    for (const sign of SIGNS) {
      for (const locale of ['pt-BR', ...LOCALES] as const) {
        const result = resolveLunarNodeSignText(sign, locale)
        if (!result || result.length < 50) missing.push(`${locale}:natal:nn_sign_${sign}`)
      }
    }
    expect(missing).toEqual([])
  })

  it('resolveLunarNodeSignText returns null for unknown sign', () => {
    expect(resolveLunarNodeSignText('ophiuchus')).toBeNull()
    expect(resolveLunarNodeSignText('')).toBeNull()
  })
})
