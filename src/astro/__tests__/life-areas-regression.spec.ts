import { describe, it, expect } from 'vitest'
import AstrologyCalculator, { AstrologyData } from '../../services/astrology/AstrologyCalculator'
import { calculateTransits } from '../aspect-engine'
import { ASPECTS_CONFIG } from '../aspect-config'

// Exemplo de dados de teste realistas
const planets = [
  { name: 'Sun', longitude: 15, latitude: 0, speed: 1.0, sign: 'Aries', house: 1, dignity: 5, retrograde: false },
  { name: 'Moon', longitude: 45, latitude: 0, speed: 13.0, sign: 'Taurus', house: 2, dignity: 4, retrograde: false },
  { name: 'Mercury', longitude: 12, latitude: 0, speed: 1.5, sign: 'Aries', house: 1, dignity: 3, retrograde: false },
  { name: 'Venus', longitude: 75, latitude: 0, speed: 1.2, sign: 'Gemini', house: 3, dignity: 2, retrograde: false },
  { name: 'Mars', longitude: 105, latitude: 0, speed: 0.8, sign: 'Cancer', house: 4, dignity: 1, retrograde: false },
  { name: 'Jupiter', longitude: 135, latitude: 0, speed: 0.1, sign: 'Leo', house: 5, dignity: 0, retrograde: false },
  { name: 'Saturn', longitude: 165, latitude: 0, speed: 0.05, sign: 'Virgo', house: 6, dignity: -1, retrograde: false },
]

const aspects = [
  { planet1: 'Sun', planet2: 'Moon', aspect: 'conjunção', orb: 2, exact: 0, applying: true, strength: 10 },
  { planet1: 'Mars', planet2: 'Venus', aspect: 'quadratura', orb: 5, exact: 0, applying: false, strength: 7 },
]

const houses = [
  { number: 1, sign: 'Aries', cusp: 0 },
  { number: 2, sign: 'Taurus', cusp: 30 },
  { number: 3, sign: 'Gemini', cusp: 60 },
  { number: 4, sign: 'Cancer', cusp: 90 },
  { number: 5, sign: 'Leo', cusp: 120 },
  { number: 6, sign: 'Virgo', cusp: 150 },
]

const astrologyData: AstrologyData = { planets, aspects, houses }

describe('🔬 Regressão dos cálculos de áreas da vida', () => {
  it('calcula status de amor de forma estável', () => {
  const result = AstrologyCalculator.calculateLifeAreaStatus('love', astrologyData)
    expect(result.adjustedScore).toBeGreaterThan(0)
    expect(result.adjustedScore).toBeLessThanOrEqual(95)
    expect(result.factors.planetaryScore).not.toBeNaN()
    expect(result.factors.aspectScore).not.toBeNaN()
  })

  it('calcula status de carreira de forma estável', () => {
  const result = AstrologyCalculator.calculateLifeAreaStatus('career', astrologyData)
    expect(result.adjustedScore).toBeGreaterThan(0)
    expect(result.adjustedScore).toBeLessThanOrEqual(95)
  })

  it('calcula trânsitos realistas sem erro', () => {
    const natal = planets.map(p => ({ name: p.name, longitude: p.longitude, speed: p.speed }))
    const transit = planets.map(p => ({ name: p.name, longitude: p.longitude + 10, speed: p.speed }))
    const transits = calculateTransits(natal, transit, undefined, ASPECTS_CONFIG)
    expect(Array.isArray(transits)).toBe(true)
    expect(transits.length).toBeGreaterThan(0)
  })
})
