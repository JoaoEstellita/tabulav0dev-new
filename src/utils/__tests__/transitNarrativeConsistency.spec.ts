import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { buildUnifiedTransitNarrative } from '../astroInterpretation'

const ROOT = path.resolve(__dirname, '..', '..')

function read(relPath: string): string {
  return fs.readFileSync(path.join(ROOT, relPath), 'utf8')
}

describe('transit narrative consistency', () => {
  it('returns stable base narrative for equal transit inputs', () => {
    const transit = {
      transitPlanet: 'Saturn',
      aspectName: 'quadratura',
      target: { natalPlanet: 'Mercury' },
      house: 10,
      phase: 'applying',
    }

    const a = buildUnifiedTransitNarrative(transit, 'carreira', 'pt-BR')
    const b = buildUnifiedTransitNarrative({ ...transit }, 'carreira', 'pt-BR')

    expect(a.transitKey).toBe(b.transitKey)
    expect(a.shortText).toBe(b.shortText)
    expect(a.modalIntro).toBe(b.modalIntro)
    expect(a.modalBody).toBe(b.modalBody)
  })

  it('keeps shared builder usage across forecast/modal/groups channels', () => {
    const files = [
      'components/LifeAreaDetailModal.tsx',
      'screens/forecast/ForecastScreen.tsx',
      'screens/forecast/ForecastPeriodEventsScreen.tsx',
      'screens/groups/GroupsScreen.tsx',
    ]

    for (const rel of files) {
      const source = read(rel)
      expect(source).toContain('buildUnifiedTransitNarrative')
      expect(source).toMatch(/buildUnifiedTransitNarrative\s*\(/)
    }
  })
})

