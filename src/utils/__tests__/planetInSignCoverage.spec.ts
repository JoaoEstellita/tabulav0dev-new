import { describe, expect, it } from 'vitest'
import { PLANET_IN_SIGN_PTBR_OVERRIDES } from '../../data/planetInSignOverridesPtBR'
import { PLANET_IN_SIGN_I18N_OVERRIDES } from '../../data/planetInSignOverridesI18n'
import { resolvePlanetInSignText } from '../natalInterpretation'

const PLANETS = [
  'sun', 'moon', 'mercury', 'venus', 'mars',
  'jupiter', 'saturn', 'uranus', 'neptune', 'pluto',
] as const

const SIGNS = [
  'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
  'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces',
] as const

const LOCALES = ['en-US', 'es-ES', 'it-IT'] as const

const MOJIBAKE_TOKENS = ['Ã', '�', 'â€™', 'â€œ', 'â€']
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

describe('planet in sign catalog coverage', () => {
  it('has all 120 required keys in pt-BR (10 planets × 12 signs)', () => {
    const missing: string[] = []
    for (const planet of PLANETS) {
      for (const sign of SIGNS) {
        const key = `natal:${planet}_in_${sign}`
        const text = PLANET_IN_SIGN_PTBR_OVERRIDES[key]
        if (!text || text.trim().length < 50) missing.push(key)
      }
    }
    expect(missing).toEqual([])
  })

  it('keeps i18n locales in exact parity with pt-BR keyset', () => {
    const ptKeys = new Set(Object.keys(PLANET_IN_SIGN_PTBR_OVERRIDES))

    LOCALES.forEach((locale) => {
      const localeMap = PLANET_IN_SIGN_I18N_OVERRIDES[locale] || {}
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

    checkMap('pt-BR', PLANET_IN_SIGN_PTBR_OVERRIDES)
    LOCALES.forEach((locale) =>
      checkMap(locale, PLANET_IN_SIGN_I18N_OVERRIDES[locale] || {})
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

    checkMap('pt-BR', PLANET_IN_SIGN_PTBR_OVERRIDES)
    LOCALES.forEach((locale) =>
      checkMap(locale, PLANET_IN_SIGN_I18N_OVERRIDES[locale] || {})
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

    checkMap('pt-BR', PLANET_IN_SIGN_PTBR_OVERRIDES)
    LOCALES.forEach((locale) =>
      checkMap(locale, PLANET_IN_SIGN_I18N_OVERRIDES[locale] || {})
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

    checkMap('pt-BR', PLANET_IN_SIGN_PTBR_OVERRIDES)
    LOCALES.forEach((locale) =>
      checkMap(locale, PLANET_IN_SIGN_I18N_OVERRIDES[locale] || {})
    )
    expect(badSamples).toEqual([])
  })

  it('has no "will" future tense in en-US entries', () => {
    const badSamples: Array<{ key: string }> = []
    const map = PLANET_IN_SIGN_I18N_OVERRIDES['en-US'] || {}

    Object.entries(map).forEach(([key, text]) => {
      if (/\bwill\b/i.test(String(text || ''))) badSamples.push({ key })
    })
    expect(badSamples).toEqual([])
  })

  it('has no accented characters in es-ES entries', () => {
    const badSamples: Array<{ key: string; char: string }> = []
    const map = PLANET_IN_SIGN_I18N_OVERRIDES['es-ES'] || {}

    Object.entries(map).forEach(([key, text]) => {
      const match = String(text || '').match(ACCENTED_CHARS_REGEX)
      if (match) badSamples.push({ key, char: match[0] })
    })
    expect(badSamples).toEqual([])
  })

  it('has no accented characters or apostrophes in it-IT entries', () => {
    const badSamples: Array<{ key: string; issue: string }> = []
    const map = PLANET_IN_SIGN_I18N_OVERRIDES['it-IT'] || {}

    Object.entries(map).forEach(([key, text]) => {
      const accentMatch = String(text || '').match(ACCENTED_CHARS_REGEX)
      if (accentMatch) badSamples.push({ key, issue: `accented: ${accentMatch[0]}` })
      if (APOSTROPHE_REGEX.test(String(text || '')))
        badSamples.push({ key, issue: 'apostrophe' })
    })
    expect(badSamples).toEqual([])
  })

  it('resolvePlanetInSignText returns text for valid planet/sign in pt-BR', () => {
    const result = resolvePlanetInSignText('sun', 'aries', 'pt-BR')
    expect(result).not.toBeNull()
    expect(result!.length).toBeGreaterThan(50)
  })

  it('resolvePlanetInSignText accepts planet/sign names with different casing', () => {
    expect(resolvePlanetInSignText('Sun', 'Aries', 'pt-BR')).not.toBeNull()
    expect(resolvePlanetInSignText('PLUTO', 'Pisces', 'en-US')).not.toBeNull()
  })

  it('resolvePlanetInSignText returns null for unknown planet or sign', () => {
    expect(resolvePlanetInSignText('chiron', 'aries')).toBeNull()
    expect(resolvePlanetInSignText('sun', 'ophiuchus')).toBeNull()
    expect(resolvePlanetInSignText('', '')).toBeNull()
  })

  it('resolvePlanetInSignText returns text for all 120 combos in all locales', () => {
    const missing: string[] = []
    for (const planet of PLANETS) {
      for (const sign of SIGNS) {
        for (const locale of ['pt-BR', ...LOCALES] as const) {
          const result = resolvePlanetInSignText(planet, sign, locale)
          if (!result || result.length < 50)
            missing.push(`${locale}:natal:${planet}_in_${sign}`)
        }
      }
    }
    expect(missing).toEqual([])
  })
})
