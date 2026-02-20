import { describe, expect, it } from 'vitest'
import { TRANSIT_CATALOG_PTBR } from '../../data/transitCatalogPtBR'
import { buildUnifiedTransitNarrative } from '../astroInterpretation'

type AnyTransit = Record<string, unknown>

const PLANET_CASE_MAP: Record<string, string> = {
  sun: 'Sun',
  moon: 'Moon',
  mercury: 'Mercury',
  venus: 'Venus',
  mars: 'Mars',
  jupiter: 'Jupiter',
  saturn: 'Saturn',
  uranus: 'Uranus',
  neptune: 'Neptune',
  pluto: 'Pluto',
}

const ANGLE_TARGETS = new Set(['ascendente', 'meio_do_ceu', 'fundo_do_ceu', 'descendente'])

const BANNED_PATTERNS: RegExp[] = [
  /Ã/g,
  /\uFFFD/g,
  /\\"/g,
  /foco recai em/gi,
  /a fase atual/gi,
  /sequencia pratica/gi,
  /primeiro ler o padrao/gi,
  /undefined/gi,
  /\bnull\b/gi,
]

function parseTransitFromCatalogKey(key: string): AnyTransit | null {
  const match = key.match(/^transit:([^|]+)\|([^|]+)\|(.+)$/)
  if (!match) return null
  const [, planet, aspect, target] = match
  const normalizedPlanet = String(planet || '').toLowerCase()
  const transitPlanet = PLANET_CASE_MAP[normalizedPlanet] || 'Sun'
  const transit: AnyTransit = {
    transitPlanet,
    aspectName: aspect,
    phase: 'active',
  }

  if (target.startsWith('house_')) {
    const houseNumber = Number(target.replace('house_', ''))
    if (!Number.isFinite(houseNumber) || houseNumber < 1 || houseNumber > 12) return null
    transit.house = houseNumber
    if (aspect !== 'ingress') {
      transit.target = { house: houseNumber }
    }
    return transit
  }

  if (ANGLE_TARGETS.has(target)) {
    transit.target = { angle: target }
    return transit
  }

  const normalizedTarget = String(target || '').toLowerCase()
  const natalPlanet = PLANET_CASE_MAP[normalizedTarget]
  if (!natalPlanet) return null
  transit.target = { natalPlanet }
  return transit
}

function collectNarrativeFields(narrative: ReturnType<typeof buildUnifiedTransitNarrative>): string {
  return [
    narrative.shortText,
    narrative.modalIntro,
    narrative.modalBody,
    narrative.actionText,
    narrative.metaText,
  ]
    .map((part) => String(part || ''))
    .join('\n')
    .toLowerCase()
}

describe('transit catalog global hygiene', () => {
  it('keeps rendered pt-BR narratives free from known textual noise', () => {
    const failures: Array<{ key: string; pattern: string }> = []

    Object.keys(TRANSIT_CATALOG_PTBR).forEach((key) => {
      const transit = parseTransitFromCatalogKey(key)
      if (!transit) return
      const narrative = buildUnifiedTransitNarrative(transit, 'carreira', 'pt-BR')
      const merged = collectNarrativeFields(narrative)

      BANNED_PATTERNS.forEach((pattern) => {
        if (pattern.test(merged)) {
          failures.push({ key, pattern: pattern.toString() })
        }
      })
    })

    expect(failures).toEqual([])
  })
})

