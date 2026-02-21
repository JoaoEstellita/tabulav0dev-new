import { describe, expect, it } from 'vitest'
import { TRANSIT_CATALOG_BLOCKED_KEYS } from '../../data/transitCatalogBlockedKeys'
import { TRANSIT_CATALOG_PTBR_OVERRIDES } from '../../data/transitCatalogOverridesPtBR'
import { TRANSIT_CATALOG_I18N_OVERRIDES } from '../../data/transitCatalogOverridesI18n'

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

const hasMojibake = (text: string): boolean =>
  MOJIBAKE_TOKENS.some((token) => String(text || '').includes(token))

const hasDeterministicLanguage = (text: string): boolean => {
  const normalized = String(text || '').toLowerCase()
  return DETERMINISTIC_TOKENS.some((token) => normalized.includes(token))
}

describe('curated transit catalog coverage', () => {
  it('ensures i18n locales stay in sync with full curated pt-BR keyset', () => {
    const ptKeys = new Set(Object.keys(TRANSIT_CATALOG_PTBR_OVERRIDES))
    const diffByLocale: Record<string, { missing: string[]; extra: string[] }> = {}

    LOCALES.forEach((locale) => {
      const localeMap = TRANSIT_CATALOG_I18N_OVERRIDES[locale] || {}
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

  it('ensures every blocked key has curated pt-BR replacement', () => {
    const missingPt: string[] = []
    Array.from(TRANSIT_CATALOG_BLOCKED_KEYS).forEach((key) => {
      const text = TRANSIT_CATALOG_PTBR_OVERRIDES[key]
      if (!text || text.trim().length < 40) missingPt.push(key)
    })
    expect(missingPt).toEqual([])
  })

  it('ensures every blocked key has curated localized replacements', () => {
    const missingByLocale: Record<string, string[]> = {}
    LOCALES.forEach((locale) => {
      const localeMap = TRANSIT_CATALOG_I18N_OVERRIDES[locale] || {}
      const missing: string[] = []
      Array.from(TRANSIT_CATALOG_BLOCKED_KEYS).forEach((key) => {
        const text = localeMap[key]
        if (!text || text.trim().length < 40) missing.push(key)
      })
      missingByLocale[locale] = missing
    })

    LOCALES.forEach((locale) => {
      expect(missingByLocale[locale]).toEqual([])
    })
  })

  it('keeps curated overrides clean from mojibake and deterministic language', () => {
    const badSamples: Array<{ locale: string; key: string; reason: string }> = []

    const check = (locale: string, map: Record<string, string>) => {
      Object.entries(map).forEach(([key, text]) => {
        if (hasMojibake(text)) badSamples.push({ locale, key, reason: 'mojibake' })
        if (hasDeterministicLanguage(text)) {
          badSamples.push({ locale, key, reason: 'deterministic_language' })
        }
      })
    }

    check('pt-BR', TRANSIT_CATALOG_PTBR_OVERRIDES)
    LOCALES.forEach((locale) => check(locale, TRANSIT_CATALOG_I18N_OVERRIDES[locale] || {}))

    expect(badSamples).toEqual([])
  })
})
