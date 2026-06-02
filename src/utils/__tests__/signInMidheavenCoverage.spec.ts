import { describe, expect, it } from 'vitest'
import { SIGN_IN_MIDHEAVEN_PTBR_OVERRIDES } from '../../data/signInMidheavenOverridesPtBR'
import { SIGN_IN_MIDHEAVEN_I18N_OVERRIDES } from '../../data/signInMidheavenOverridesI18n'
import { resolveSignInMidheavenText } from '../natalInterpretation'

const SIGNS = [
  'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
  'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces',
] as const

const LOCALES = ['en-US', 'es-ES', 'it-IT'] as const

const MOJIBAKE_TOKENS = ['Ã', '\uFFFD', 'â€™', 'â€œ', 'â€']
const DETERMINISTIC_TOKENS = [
  'vai acontecer', 'com certeza', 'inevitavel', 'inevitable',
  'garantido', 'garantida',
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

// ─── pt-BR coverage ──────────────────────────────────────────────────────────

describe('sign in midheaven catalog coverage', () => {
  it('has all 12 required keys in pt-BR (12 signs × MC)', () => {
    const missing: string[] = []
    for (const sign of SIGNS) {
      const key = `natal:mc_${sign}`
      const text = SIGN_IN_MIDHEAVEN_PTBR_OVERRIDES[key]
      if (!text || text.trim().length < 50) missing.push(key)
    }
    expect(missing).toEqual([])
  })

  it('keeps i18n locales in exact parity with pt-BR keyset', () => {
    const ptKeys = new Set(Object.keys(SIGN_IN_MIDHEAVEN_PTBR_OVERRIDES))

    LOCALES.forEach((locale) => {
      const localeMap = SIGN_IN_MIDHEAVEN_I18N_OVERRIDES[locale] || {}
      const localeKeys = new Set(Object.keys(localeMap))
      const missing = Array.from(ptKeys).filter((k) => !localeKeys.has(k))
      const extra = Array.from(localeKeys).filter((k) => !ptKeys.has(k))
      expect(missing).toEqual([])
      expect(extra).toEqual([])
    })
  })

  it('has minimum text length of 50 chars per entry in all locales', () => {
    const tooShort: Array<{ locale: string; key: string; length: number }> = []

    const checkMap = (locale: string, map: Record<string, string>) => {
      Object.entries(map).forEach(([key, text]) => {
        if ((text || '').trim().length < 50)
          tooShort.push({ locale, key, length: (text || '').trim().length })
      })
    }

    checkMap('pt-BR', SIGN_IN_MIDHEAVEN_PTBR_OVERRIDES)
    LOCALES.forEach((locale) =>
      checkMap(locale, SIGN_IN_MIDHEAVEN_I18N_OVERRIDES[locale] || {})
    )
    expect(tooShort).toEqual([])
  })

  it('has at least 2 sentences per entry in all locales', () => {
    const tooFew: Array<{ locale: string; key: string; sentences: number }> = []

    const checkMap = (locale: string, map: Record<string, string>) => {
      Object.entries(map).forEach(([key, text]) => {
        const n = countSentences(String(text || ''))
        if (n < 2) tooFew.push({ locale, key, sentences: n })
      })
    }

    checkMap('pt-BR', SIGN_IN_MIDHEAVEN_PTBR_OVERRIDES)
    LOCALES.forEach((locale) =>
      checkMap(locale, SIGN_IN_MIDHEAVEN_I18N_OVERRIDES[locale] || {})
    )
    expect(tooFew).toEqual([])
  })

  it('has no mojibake in any locale', () => {
    const badSamples: Array<{ locale: string; key: string }> = []

    const checkMap = (locale: string, map: Record<string, string>) => {
      Object.entries(map).forEach(([key, text]) => {
        if (hasMojibake(text)) badSamples.push({ locale, key })
      })
    }

    checkMap('pt-BR', SIGN_IN_MIDHEAVEN_PTBR_OVERRIDES)
    LOCALES.forEach((locale) =>
      checkMap(locale, SIGN_IN_MIDHEAVEN_I18N_OVERRIDES[locale] || {})
    )
    expect(badSamples).toEqual([])
  })

  it('has no deterministic language in any locale', () => {
    const badSamples: Array<{ locale: string; key: string }> = []

    const checkMap = (locale: string, map: Record<string, string>) => {
      Object.entries(map).forEach(([key, text]) => {
        if (hasDeterministicLanguage(text)) badSamples.push({ locale, key })
      })
    }

    checkMap('pt-BR', SIGN_IN_MIDHEAVEN_PTBR_OVERRIDES)
    LOCALES.forEach((locale) =>
      checkMap(locale, SIGN_IN_MIDHEAVEN_I18N_OVERRIDES[locale] || {})
    )
    expect(badSamples).toEqual([])
  })

  it('has no accented characters in es-ES entries', () => {
    const badSamples: Array<{ key: string; char: string }> = []
    const map = SIGN_IN_MIDHEAVEN_I18N_OVERRIDES['es-ES'] || {}

    Object.entries(map).forEach(([key, text]) => {
      const match = String(text || '').match(ACCENTED_CHARS_REGEX)
      if (match) badSamples.push({ key, char: match[0] })
    })
    expect(badSamples).toEqual([])
  })

  it('has no accented characters or apostrophes in it-IT entries', () => {
    const badSamples: Array<{ key: string; issue: string }> = []
    const map = SIGN_IN_MIDHEAVEN_I18N_OVERRIDES['it-IT'] || {}

    Object.entries(map).forEach(([key, text]) => {
      const accentMatch = String(text || '').match(ACCENTED_CHARS_REGEX)
      if (accentMatch) badSamples.push({ key, issue: `accented: ${accentMatch[0]}` })
      if (APOSTROPHE_REGEX.test(String(text || '')))
        badSamples.push({ key, issue: 'apostrophe' })
    })
    expect(badSamples).toEqual([])
  })

  it('resolveSignInMidheavenText returns text for valid sign in pt-BR', () => {
    const result = resolveSignInMidheavenText('aries', 'pt-BR')
    expect(result).not.toBeNull()
    expect(result!.length).toBeGreaterThan(50)
  })

  it('resolveSignInMidheavenText returns null for unknown sign', () => {
    expect(resolveSignInMidheavenText('ophiuchus')).toBeNull()
    expect(resolveSignInMidheavenText('chiron')).toBeNull()
    expect(resolveSignInMidheavenText('')).toBeNull()
  })

  it('resolveSignInMidheavenText returns text for all 12 signs in all locales', () => {
    const missing: string[] = []
    for (const sign of SIGNS) {
      for (const locale of ['pt-BR', ...LOCALES] as const) {
        const result = resolveSignInMidheavenText(sign, locale)
        if (!result || result.length < 50)
          missing.push(`${locale}:natal:mc_${sign}`)
      }
    }
    expect(missing).toEqual([])
  })
})
