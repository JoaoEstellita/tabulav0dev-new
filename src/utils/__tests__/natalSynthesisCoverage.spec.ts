import { describe, it, expect } from 'vitest'
import { natalMoonPhase } from '../../astro/moonPhase'
import { NATAL_MOON_PHASE_READINGS, resolveNatalMoonPhase } from '../../data/natalMoonPhaseReadings'
import { NATAL_RETROGRADE_READINGS, resolveNatalRetrograde } from '../../data/natalRetrogradeReadings'
import { computeChartSynthesis } from '../../astro/chartSynthesis'
import { composeChartSynthesis } from '../../data/chartSynthesisReadings'

const LANGS = ['pt-BR', 'en-US', 'es-ES', 'it-IT'] as const

describe('Fase lunar natal', () => {
  it('deriva a fase pelo ângulo Lua−Sol', () => {
    expect(natalMoonPhase(0, 10)?.key).toBe('nova')          // 10° → Nova
    expect(natalMoonPhase(0, 190)?.key).toBe('cheia')        // 190° → Cheia
    expect(natalMoonPhase(0, 320)?.key).toBe('balsamica')    // 320° → Balsâmica
    expect(natalMoonPhase(350, 60)?.key).toBe('crescente')   // 70° (wrap) → Crescente
    expect(natalMoonPhase(null, 10)).toBeNull()
  })
  it('paridade i18n (8 fases × 4 idiomas, label + text)', () => {
    for (const key of Object.keys(NATAL_MOON_PHASE_READINGS) as (keyof typeof NATAL_MOON_PHASE_READINGS)[]) {
      for (const l of LANGS) {
        const r = resolveNatalMoonPhase(key, l)
        expect(r.label.length, `${key}/${l} label`).toBeGreaterThan(2)
        expect(r.text.length, `${key}/${l} text`).toBeGreaterThan(40)
      }
    }
    expect(Object.keys(NATAL_MOON_PHASE_READINGS)).toHaveLength(8)
  })
})

describe('Retrógrados natais', () => {
  it('paridade i18n + Sol/Lua ausentes', () => {
    expect(NATAL_RETROGRADE_READINGS.Sun).toBeUndefined()
    expect(NATAL_RETROGRADE_READINGS.Moon).toBeUndefined()
    for (const planet of Object.keys(NATAL_RETROGRADE_READINGS)) {
      for (const l of LANGS) {
        const t = resolveNatalRetrograde(planet, l)
        expect(t && t.length, `${planet}/${l}`).toBeGreaterThan(40)
      }
    }
  })
  it('planeta sem catálogo → null', () => {
    expect(resolveNatalRetrograde('Chiron', 'pt-BR')).toBeNull()
  })
})

describe('Síntese do mapa', () => {
  it('computa dominantes, stellium e hemisfério', () => {
    const s = computeChartSynthesis({
      elemental: { fire: 5, earth: 0, air: 3, water: 2 },
      modality: { cardinal: 6, fixed: 2, mutable: 2 },
      planets: [
        { name: 'Sun', sign: 'Áries', house: 10 },
        { name: 'Moon', sign: 'Áries', house: 10 },
        { name: 'Mercury', sign: 'Áries', house: 10 },
        { name: 'Venus', sign: 'Touro', house: 11 },
        { name: 'Mars', sign: 'Gêmeos', house: 12 },
        { name: 'Jupiter', sign: 'Câncer', house: 1 },
        { name: 'Saturn', sign: 'Leão', house: 2 },
        { name: 'Uranus', sign: 'Virgem', house: 11 },
        { name: 'Neptune', sign: 'Libra', house: 12 },
        { name: 'Pluto', sign: 'Escorpião', house: 10 },
      ],
    })
    expect(s.dominantElement).toBe('fire')
    expect(s.lackingElement).toBe('earth')     // earth: 0
    expect(s.dominantModality).toBe('cardinal')
    expect(s.stelliums.some(st => st.kind === 'house' && st.where === '10')).toBe(true)
    expect(s.stelliums.some(st => st.kind === 'sign' && st.where === 'Áries')).toBe(true)
    expect(s.hemisphereVertical).toBe('upper') // todos em casas 10-12 e 1-2 → maioria acima
  })
  it('compõe parágrafo em cada idioma', () => {
    const s = computeChartSynthesis({ elemental: { fire: 4, earth: 3, air: 2, water: 1 }, modality: { cardinal: 4, fixed: 3, mutable: 3 }, planets: [] })
    for (const l of LANGS) {
      const p = composeChartSynthesis(s, l)
      expect(p.length, l).toBeGreaterThan(30)
    }
  })
})
