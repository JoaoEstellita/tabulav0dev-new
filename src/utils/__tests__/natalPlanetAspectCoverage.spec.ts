import { describe, expect, it } from 'vitest'
import { NATAL_PLANET_ASPECT_PTBR_OVERRIDES } from '../../data/natalPlanetAspectOverridesPtBR'
import { NATAL_PLANET_ASPECT_I18N_OVERRIDES } from '../../data/natalPlanetAspectOverridesI18n'
import { resolveNatalPlanetAspectText, buildNatalAspectKeyPublic } from '../natalInterpretation'

const PLANETS = [
  'sun', 'moon', 'mercury', 'venus', 'mars',
  'jupiter', 'saturn', 'uranus', 'neptune', 'pluto',
] as const

const ASPECTS = ['conjuncao', 'sextil', 'quadratura', 'trigono', 'oposicao'] as const
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

describe('natal planet-aspect catalog coverage', () => {
  it('has at least 200 pt-BR entries', () => {
    const count = Object.keys(NATAL_PLANET_ASPECT_PTBR_OVERRIDES).length
    expect(count).toBeGreaterThanOrEqual(200)
  })

  it('keeps i18n locales in exact parity with pt-BR keyset', () => {
    const ptKeys = new Set(Object.keys(NATAL_PLANET_ASPECT_PTBR_OVERRIDES))
    const diffByLocale: Record<string, { missing: string[]; extra: string[] }> = {}

    LOCALES.forEach((locale) => {
      const localeMap = NATAL_PLANET_ASPECT_I18N_OVERRIDES[locale] || {}
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

    checkMap('pt-BR', NATAL_PLANET_ASPECT_PTBR_OVERRIDES)
    LOCALES.forEach((locale) =>
      checkMap(locale, NATAL_PLANET_ASPECT_I18N_OVERRIDES[locale] || {})
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

    checkMap('pt-BR', NATAL_PLANET_ASPECT_PTBR_OVERRIDES)
    LOCALES.forEach((locale) =>
      checkMap(locale, NATAL_PLANET_ASPECT_I18N_OVERRIDES[locale] || {})
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

    checkMap('pt-BR', NATAL_PLANET_ASPECT_PTBR_OVERRIDES)
    LOCALES.forEach((locale) =>
      checkMap(locale, NATAL_PLANET_ASPECT_I18N_OVERRIDES[locale] || {})
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

    checkMap('pt-BR', NATAL_PLANET_ASPECT_PTBR_OVERRIDES)
    LOCALES.forEach((locale) =>
      checkMap(locale, NATAL_PLANET_ASPECT_I18N_OVERRIDES[locale] || {})
    )
    expect(badSamples).toEqual([])
  })

  it('has no accented characters in es-ES entries', () => {
    const badSamples: Array<{ key: string; char: string }> = []
    const map = NATAL_PLANET_ASPECT_I18N_OVERRIDES['es-ES'] || {}

    Object.entries(map).forEach(([key, text]) => {
      const match = String(text || '').match(ACCENTED_CHARS_REGEX)
      if (match) badSamples.push({ key, char: match[0] })
    })
    expect(badSamples).toEqual([])
  })

  it('has no accented characters or apostrophes in it-IT entries', () => {
    const badSamples: Array<{ key: string; issue: string }> = []
    const map = NATAL_PLANET_ASPECT_I18N_OVERRIDES['it-IT'] || {}

    Object.entries(map).forEach(([key, text]) => {
      const accentMatch = String(text || '').match(ACCENTED_CHARS_REGEX)
      if (accentMatch) badSamples.push({ key, issue: `accented: ${accentMatch[0]}` })
      if (APOSTROPHE_REGEX.test(String(text || '')))
        badSamples.push({ key, issue: 'apostrophe' })
    })
    expect(badSamples).toEqual([])
  })

  it('resolveNatalPlanetAspectText returns null for unknown planet', () => {
    expect(resolveNatalPlanetAspectText('chiron', 'conjuncao', 'sun')).toBeNull()
    expect(resolveNatalPlanetAspectText('sun', 'conjuncao', 'unknown')).toBeNull()
  })

  it('resolveNatalPlanetAspectText returns null for unknown aspect', () => {
    expect(resolveNatalPlanetAspectText('sun', 'quinquncio', 'moon')).toBeNull()
    expect(resolveNatalPlanetAspectText('sun', 'semisextil', 'moon')).toBeNull()
  })

  it('resolveNatalPlanetAspectText returns null for self-aspect', () => {
    expect(resolveNatalPlanetAspectText('sun', 'conjuncao', 'sun')).toBeNull()
  })

  it('resolveNatalPlanetAspectText uses canonical order (planet order independent)', () => {
    const moonConjMercury = resolveNatalPlanetAspectText('moon', 'conjuncao', 'mercury', 'pt-BR')
    const mercuryConjMoon = resolveNatalPlanetAspectText('mercury', 'conjuncao', 'moon', 'pt-BR')
    expect(moonConjMercury).not.toBeNull()
    expect(moonConjMercury).toBe(mercuryConjMoon)
  })

  it('resolveNatalPlanetAspectText returns pt-BR text for known pair', () => {
    const result = resolveNatalPlanetAspectText('sun', 'conjuncao', 'moon', 'pt-BR')
    expect(result).not.toBeNull()
    expect(result!.length).toBeGreaterThan(50)
  })

  it('resolveNatalPlanetAspectText returns en-US text when requested', () => {
    const result = resolveNatalPlanetAspectText('sun', 'conjuncao', 'moon', 'en-US')
    expect(result).not.toBeNull()
    expect(result!.length).toBeGreaterThan(50)
  })

  it('buildNatalAspectKeyPublic normalizes order correctly', () => {
    expect(buildNatalAspectKeyPublic('mercury', 'sextil', 'moon')).toBe('natal:moon|sextil|mercury')
    expect(buildNatalAspectKeyPublic('pluto', 'trigono', 'sun')).toBe('natal:sun|trigono|pluto')
    expect(buildNatalAspectKeyPublic('sun', 'oposicao', 'moon')).toBe('natal:sun|oposicao|moon')
  })

  it('covers all 45 planet pairs for each main aspect', () => {
    const missing: string[] = []
    for (let i = 0; i < PLANETS.length; i++) {
      for (let j = i + 1; j < PLANETS.length; j++) {
        for (const aspect of ASPECTS) {
          const key = buildNatalAspectKeyPublic(PLANETS[i], aspect, PLANETS[j])
          if (!key || !NATAL_PLANET_ASPECT_PTBR_OVERRIDES[key]) {
            missing.push(`${PLANETS[i]}|${aspect}|${PLANETS[j]}`)
          }
        }
      }
    }
    expect(missing).toEqual([])
  })
})
