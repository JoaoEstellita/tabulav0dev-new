import { describe, expect, it } from 'vitest'
import { NATAL_PLANET_IN_HOUSE_PTBR_OVERRIDES } from '../../data/natalPlanetInHouseOverridesPtBR'
import { NATAL_PLANET_IN_HOUSE_I18N_OVERRIDES } from '../../data/natalPlanetInHouseOverridesI18n'
import { resolveNatalPlanetInHouseText } from '../natalInterpretation'

const PLANETS = [
  'sun', 'moon', 'mercury', 'venus', 'mars',
  'jupiter', 'saturn', 'uranus', 'neptune', 'pluto',
] as const

const HOUSES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const
const LOCALES = ['en-US', 'es-ES', 'it-IT'] as const

const MOJIBAKE_TOKENS = ['Ã', '\uFFFD', 'â€™', 'â€œ', 'â€']
const DETERMINISTIC_TOKENS = [
  'vai acontecer',
  'com certeza',
  'inevitavel',
  'inevitable',
  'garantido',
  'garantida',
]

// es-ES: proibido qualquer char acentuado
const ACCENTED_CHARS_REGEX = /[áéíóúàèìòùâêîôûãõäëïöüñ]/i

// it-IT: proibido chars acentuados + apóstrofes dentro de strings com aspas simples
// (verificamos apóstrofes diretas no texto — o parser TypeScript já bloquearia na sintaxe)
const APOSTROPHE_REGEX = /'/

const hasMojibake = (text: string): boolean =>
  MOJIBAKE_TOKENS.some((token) => String(text || '').includes(token))

const hasDeterministicLanguage = (text: string): boolean => {
  const normalized = String(text || '').toLowerCase()
  return DETERMINISTIC_TOKENS.some((token) => normalized.includes(token))
}

// Conta frases terminadas com pontuação final
const countSentences = (text: string): number =>
  (text.match(/[.!?]+(?:\s|$)/g) || []).length

describe('natal planet-in-house catalog coverage', () => {
  it('has all 120 required keys in pt-BR (10 planets × 12 houses)', () => {
    const missing: string[] = []
    for (const planet of PLANETS) {
      for (const house of HOUSES) {
        const key = `natal:${planet}|house|${house}`
        const text = NATAL_PLANET_IN_HOUSE_PTBR_OVERRIDES[key]
        if (!text || text.trim().length < 50) missing.push(key)
      }
    }
    expect(missing).toEqual([])
  })

  it('keeps i18n locales in exact parity with pt-BR keyset', () => {
    const ptKeys = new Set(Object.keys(NATAL_PLANET_IN_HOUSE_PTBR_OVERRIDES))
    const diffByLocale: Record<string, { missing: string[]; extra: string[] }> = {}

    LOCALES.forEach((locale) => {
      const localeMap = NATAL_PLANET_IN_HOUSE_I18N_OVERRIDES[locale] || {}
      const localeKeys = new Set(Object.keys(localeMap))

      const missing = Array.from(ptKeys).filter((key) => !localeKeys.has(key))
      const extra = Array.from(localeKeys).filter((key) => !ptKeys.has(key))

      diffByLocale[locale] = { missing, extra }
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

    checkMap('pt-BR', NATAL_PLANET_IN_HOUSE_PTBR_OVERRIDES)
    LOCALES.forEach((locale) =>
      checkMap(locale, NATAL_PLANET_IN_HOUSE_I18N_OVERRIDES[locale] || {})
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

    checkMap('pt-BR', NATAL_PLANET_IN_HOUSE_PTBR_OVERRIDES)
    LOCALES.forEach((locale) =>
      checkMap(locale, NATAL_PLANET_IN_HOUSE_I18N_OVERRIDES[locale] || {})
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

    checkMap('pt-BR', NATAL_PLANET_IN_HOUSE_PTBR_OVERRIDES)
    LOCALES.forEach((locale) =>
      checkMap(locale, NATAL_PLANET_IN_HOUSE_I18N_OVERRIDES[locale] || {})
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

    checkMap('pt-BR', NATAL_PLANET_IN_HOUSE_PTBR_OVERRIDES)
    LOCALES.forEach((locale) =>
      checkMap(locale, NATAL_PLANET_IN_HOUSE_I18N_OVERRIDES[locale] || {})
    )

    expect(badSamples).toEqual([])
  })

  it('has no accented characters in es-ES entries', () => {
    const badSamples: Array<{ key: string; char: string }> = []
    const map = NATAL_PLANET_IN_HOUSE_I18N_OVERRIDES['es-ES'] || {}

    Object.entries(map).forEach(([key, text]) => {
      const match = String(text || '').match(ACCENTED_CHARS_REGEX)
      if (match) badSamples.push({ key, char: match[0] })
    })

    expect(badSamples).toEqual([])
  })

  it('has no accented characters or apostrophes in it-IT entries', () => {
    const badSamples: Array<{ key: string; issue: string }> = []
    const map = NATAL_PLANET_IN_HOUSE_I18N_OVERRIDES['it-IT'] || {}

    Object.entries(map).forEach(([key, text]) => {
      const accentMatch = String(text || '').match(ACCENTED_CHARS_REGEX)
      if (accentMatch) badSamples.push({ key, issue: `accented: ${accentMatch[0]}` })
      if (APOSTROPHE_REGEX.test(String(text || '')))
        badSamples.push({ key, issue: 'apostrophe' })
    })

    expect(badSamples).toEqual([])
  })

  it('resolveNatalPlanetInHouseText returns null for unknown planet', () => {
    expect(resolveNatalPlanetInHouseText('unknown', 1)).toBeNull()
    expect(resolveNatalPlanetInHouseText('chiron', 5)).toBeNull()
  })

  it('resolveNatalPlanetInHouseText returns null for invalid house', () => {
    expect(resolveNatalPlanetInHouseText('sun', 0)).toBeNull()
    expect(resolveNatalPlanetInHouseText('sun', 13)).toBeNull()
  })

  it('resolveNatalPlanetInHouseText returns text when key exists', () => {
    // Este teste só passa quando o catálogo tiver pelo menos 1 entrada
    const allKeys = Object.keys(NATAL_PLANET_IN_HOUSE_PTBR_OVERRIDES)
    if (allKeys.length === 0) return // catálogo ainda vazio — ok durante infraestrutura

    const firstKey = allKeys[0]
    const match = firstKey.match(/^natal:(\w+)\|house\|(\d+)$/)
    if (!match) return

    const [, planet, houseStr] = match
    const house = Number(houseStr)

    const result = resolveNatalPlanetInHouseText(planet, house, 'pt-BR')
    expect(result).not.toBeNull()
    expect(result!.length).toBeGreaterThan(50)
  })

  it('resolveNatalPlanetInHouseText returns null for missing locale translation', () => {
    const allKeys = Object.keys(NATAL_PLANET_IN_HOUSE_PTBR_OVERRIDES)
    if (allKeys.length === 0) return // catálogo ainda vazio — ok

    // Se pt-BR tiver entrada mas i18n estiver vazio, retorna null
    const i18nKeys = Object.keys(NATAL_PLANET_IN_HOUSE_I18N_OVERRIDES['en-US'] || {})
    if (i18nKeys.length === 0) {
      const match = allKeys[0].match(/^natal:(\w+)\|house\|(\d+)$/)
      if (!match) return
      const [, planet, houseStr] = match
      const result = resolveNatalPlanetInHouseText(planet, Number(houseStr), 'en-US')
      expect(result).toBeNull()
    }
  })
})
