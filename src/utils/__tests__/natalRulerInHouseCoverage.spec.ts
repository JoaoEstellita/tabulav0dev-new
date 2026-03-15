import { describe, expect, it } from 'vitest'
import { NATAL_RULER_IN_HOUSE_PTBR_OVERRIDES } from '../../data/natalRulerInHouseOverridesPtBR'
import { NATAL_RULER_IN_HOUSE_I18N_OVERRIDES } from '../../data/natalRulerInHouseOverridesI18n'
import { resolveNatalRulerInHouseText } from '../natalInterpretation'

const LOCALES = ['en-US', 'es-ES', 'it-IT'] as const

const MOJIBAKE_TOKENS = ['Ã', '\uFFFD', 'â€™', 'â€œ', 'â€']
const DETERMINISTIC_TOKENS = [
  'vai acontecer', 'com certeza', 'inevitavel', 'inevitable',
  'garantido', 'garantida', 'infeliz para o sucesso',
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

describe('natal ruler-in-house catalog coverage', () => {
  it('has exactly 144 pt-BR entries (12 rulers × 12 houses)', () => {
    const count = Object.keys(NATAL_RULER_IN_HOUSE_PTBR_OVERRIDES).length
    expect(count).toBe(144)
  })

  it('keeps i18n locales in exact parity with pt-BR keyset', () => {
    const ptKeys = new Set(Object.keys(NATAL_RULER_IN_HOUSE_PTBR_OVERRIDES))
    const diffByLocale: Record<string, { missing: string[]; extra: string[] }> = {}

    LOCALES.forEach((locale) => {
      const localeMap = NATAL_RULER_IN_HOUSE_I18N_OVERRIDES[locale] || {}
      const localeKeys = new Set(Object.keys(localeMap))
      diffByLocale[locale] = {
        missing: Array.from(ptKeys).filter((k) => !localeKeys.has(k)),
        extra:   Array.from(localeKeys).filter((k) => !ptKeys.has(k)),
      }
    })

    LOCALES.forEach((locale) => {
      expect(diffByLocale[locale].missing).toEqual([])
      expect(diffByLocale[locale].extra).toEqual([])
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

    checkMap('pt-BR', NATAL_RULER_IN_HOUSE_PTBR_OVERRIDES)
    LOCALES.forEach((locale) =>
      checkMap(locale, NATAL_RULER_IN_HOUSE_I18N_OVERRIDES[locale] || {})
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

    checkMap('pt-BR', NATAL_RULER_IN_HOUSE_PTBR_OVERRIDES)
    LOCALES.forEach((locale) =>
      checkMap(locale, NATAL_RULER_IN_HOUSE_I18N_OVERRIDES[locale] || {})
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

    checkMap('pt-BR', NATAL_RULER_IN_HOUSE_PTBR_OVERRIDES)
    LOCALES.forEach((locale) =>
      checkMap(locale, NATAL_RULER_IN_HOUSE_I18N_OVERRIDES[locale] || {})
    )
    expect(badSamples).toEqual([])
  })

  it('has no deterministic language in any locale', () => {
    const badSamples: Array<{ locale: string; key: string; reason: string }> = []

    const checkMap = (locale: string, map: Record<string, string>) => {
      Object.entries(map).forEach(([key, text]) => {
        if (hasDeterministicLanguage(text))
          badSamples.push({ locale, key, reason: 'deterministic_language' })
      })
    }

    checkMap('pt-BR', NATAL_RULER_IN_HOUSE_PTBR_OVERRIDES)
    LOCALES.forEach((locale) =>
      checkMap(locale, NATAL_RULER_IN_HOUSE_I18N_OVERRIDES[locale] || {})
    )
    expect(badSamples).toEqual([])
  })

  it('has no accented characters in es-ES entries', () => {
    const badSamples: Array<{ key: string; char: string }> = []
    const map = NATAL_RULER_IN_HOUSE_I18N_OVERRIDES['es-ES'] || {}

    Object.entries(map).forEach(([key, text]) => {
      const match = String(text || '').match(ACCENTED_CHARS_REGEX)
      if (match) badSamples.push({ key, char: match[0] })
    })
    expect(badSamples).toEqual([])
  })

  it('has no accented characters or apostrophes in it-IT entries', () => {
    const badSamples: Array<{ key: string; issue: string }> = []
    const map = NATAL_RULER_IN_HOUSE_I18N_OVERRIDES['it-IT'] || {}

    Object.entries(map).forEach(([key, text]) => {
      const accentMatch = String(text || '').match(ACCENTED_CHARS_REGEX)
      if (accentMatch) badSamples.push({ key, issue: `accented: ${accentMatch[0]}` })
      if (APOSTROPHE_REGEX.test(String(text || '')))
        badSamples.push({ key, issue: 'apostrophe' })
    })
    expect(badSamples).toEqual([])
  })

  it('resolveNatalRulerInHouseText returns null for out-of-range houses', () => {
    expect(resolveNatalRulerInHouseText(0, 5)).toBeNull()
    expect(resolveNatalRulerInHouseText(13, 5)).toBeNull()
    expect(resolveNatalRulerInHouseText(1, 0)).toBeNull()
    expect(resolveNatalRulerInHouseText(1, 13)).toBeNull()
  })

  it('resolveNatalRulerInHouseText returns pt-BR text for known combination', () => {
    const result = resolveNatalRulerInHouseText(1, 1, 'pt-BR')
    expect(result).not.toBeNull()
    expect(result!.length).toBeGreaterThan(50)
  })

  it('resolveNatalRulerInHouseText returns en-US text when requested', () => {
    const result = resolveNatalRulerInHouseText(1, 1, 'en-US')
    expect(result).not.toBeNull()
    expect(result!.length).toBeGreaterThan(50)
  })

  it('covers all 144 ruler-house combinations', () => {
    const missing: string[] = []
    for (let r = 1; r <= 12; r++) {
      for (let h = 1; h <= 12; h++) {
        const key = `natal:ruler${r}|house|${h}`
        if (!NATAL_RULER_IN_HOUSE_PTBR_OVERRIDES[key]) {
          missing.push(key)
        }
      }
    }
    expect(missing).toEqual([])
  })
})
