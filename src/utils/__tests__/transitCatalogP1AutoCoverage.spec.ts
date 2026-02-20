import { describe, expect, it } from 'vitest'
import { TRANSIT_CATALOG_PTBR } from '../../data/transitCatalogPtBR'
import {
  TRANSIT_CATALOG_P1_AUTO_OVERRIDES_I18N,
  TRANSIT_CATALOG_P1_AUTO_OVERRIDES_PTBR,
} from '../../data/transitCatalogP1AutoOverrides'

const ASPECT_KEYS = new Set(['conjuncao', 'oposicao', 'quadratura', 'trigono', 'sextil'])
const MAJOR_TARGETS = new Set([
  'sun',
  'moon',
  'mercury',
  'venus',
  'mars',
  'jupiter',
  'saturn',
  'uranus',
  'neptune',
  'pluto',
  'ascendente',
  'descendente',
  'meio_do_ceu',
  'fundo_do_ceu',
])
const HOUSE_TARGET_RX = /^house_([1-9]|1[0-2])$/
const DETERMINISTIC_TOKENS = [
  'vai acontecer',
  'com certeza',
  'inevitavel',
  'inevitable',
  'garantido',
  'garantida',
]

function isP1Key(key: string): boolean {
  const match = key.match(/^transit:([a-z_]+)\|([a-z_]+)\|([a-z_]+)$/)
  if (!match) return false
  const aspect = match[2]
  const target = match[3]
  return ASPECT_KEYS.has(aspect) && MAJOR_TARGETS.has(target)
}

function isIngressKey(key: string): boolean {
  return /^transit:[a-z_]+\|ingress\|house_([1-9]|1[0-2])$/.test(key)
}

function isAspectHouseKey(key: string): boolean {
  const match = key.match(/^transit:([a-z_]+)\|([a-z_]+)\|([a-z0-9_]+)$/)
  if (!match) return false
  const aspect = match[2]
  const target = match[3]
  return ASPECT_KEYS.has(aspect) && HOUSE_TARGET_RX.test(target)
}

function hasDeterministicLanguage(text: string): boolean {
  const normalized = String(text || '').toLowerCase()
  return DETERMINISTIC_TOKENS.some((token) => normalized.includes(token))
}

describe('transit catalog P1 auto overrides coverage', () => {
  it('covers all P1 keys in pt-BR auto map', () => {
    const p1Keys = Object.keys(TRANSIT_CATALOG_PTBR).filter(isP1Key)
    const missing = p1Keys.filter((key) => !TRANSIT_CATALOG_P1_AUTO_OVERRIDES_PTBR[key])
    expect(missing).toEqual([])
  })

  it('covers all P1 keys in en/es/it auto maps', () => {
    const p1Keys = Object.keys(TRANSIT_CATALOG_PTBR).filter(isP1Key)
    const locales: Array<'en-US' | 'es-ES' | 'it-IT'> = ['en-US', 'es-ES', 'it-IT']
    locales.forEach((locale) => {
      const map = TRANSIT_CATALOG_P1_AUTO_OVERRIDES_I18N[locale] || {}
      const missing = p1Keys.filter((key) => !map[key])
      expect(missing).toEqual([])
    })
  })

  it('covers all ingress keys in pt/en/es/it auto maps', () => {
    const ingressKeys = Object.keys(TRANSIT_CATALOG_PTBR).filter(isIngressKey)
    const locales: Array<'pt-BR' | 'en-US' | 'es-ES' | 'it-IT'> = ['pt-BR', 'en-US', 'es-ES', 'it-IT']
    locales.forEach((locale) => {
      const map = locale === 'pt-BR'
        ? TRANSIT_CATALOG_P1_AUTO_OVERRIDES_PTBR
        : TRANSIT_CATALOG_P1_AUTO_OVERRIDES_I18N[locale]
      const missing = ingressKeys.filter((key) => !map[key])
      expect(missing).toEqual([])
    })
  })

  it('covers all aspect-house keys in pt/en/es/it auto maps', () => {
    const aspectHouseKeys = Object.keys(TRANSIT_CATALOG_PTBR).filter(isAspectHouseKey)
    const locales: Array<'pt-BR' | 'en-US' | 'es-ES' | 'it-IT'> = ['pt-BR', 'en-US', 'es-ES', 'it-IT']
    locales.forEach((locale) => {
      const map = locale === 'pt-BR'
        ? TRANSIT_CATALOG_P1_AUTO_OVERRIDES_PTBR
        : TRANSIT_CATALOG_P1_AUTO_OVERRIDES_I18N[locale]
      const missing = aspectHouseKeys.filter((key) => !map[key])
      expect(missing).toEqual([])
    })
  })

  it('keeps auto-generated P1 text non-deterministic and resolved', () => {
    const samples: string[] = [
      ...Object.values(TRANSIT_CATALOG_P1_AUTO_OVERRIDES_PTBR),
      ...Object.values(TRANSIT_CATALOG_P1_AUTO_OVERRIDES_I18N['en-US'] || {}),
      ...Object.values(TRANSIT_CATALOG_P1_AUTO_OVERRIDES_I18N['es-ES'] || {}),
      ...Object.values(TRANSIT_CATALOG_P1_AUTO_OVERRIDES_I18N['it-IT'] || {}),
    ]

    const bad = samples.filter((text) => {
      const value = String(text || '')
      return (
        !value ||
        value.includes('{') ||
        value.includes('}') ||
        hasDeterministicLanguage(value)
      )
    })
    expect(bad).toEqual([])
  })
})
