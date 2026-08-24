import { describe, it, expect } from 'vitest'
import { resolveSolarReturnPlanetInHouseText } from '../solarReturnInterpretation'

describe('resolveSolarReturnPlanetInHouseText', () => {
  it('retorna texto de RS curado em pt-BR (Sol casa 10)', () => {
    const t = resolveSolarReturnPlanetInHouseText('Sun', 10, 'pt-BR')
    expect(t).toBeTruthy()
    expect(t!.toLowerCase()).toContain('retorno solar')
    expect(t!.length).toBeGreaterThan(80)
  })

  it('cobre os 4 idiomas para todas as 120 combinações', () => {
    const planets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto']
    for (const lang of ['pt-BR', 'en-US', 'es-ES', 'it-IT']) {
      for (const p of planets) {
        for (let h = 1; h <= 12; h++) {
          const t = resolveSolarReturnPlanetInHouseText(p, h, lang)
          expect(t, `${lang} ${p} ${h}`).toBeTruthy()
          expect(t!.length, `${lang} ${p} ${h}`).toBeGreaterThan(60)
        }
      }
    }
  })

  it('es-ES sem tildes e it-IT sem acentos', () => {
    const es = resolveSolarReturnPlanetInHouseText('Venus', 5, 'es-ES')!
    const it = resolveSolarReturnPlanetInHouseText('Venus', 5, 'it-IT')!
    expect(es).not.toMatch(/[áéíóúñ]/i)
    expect(it).not.toMatch(/[àèìòùáéíóú]/i)
  })
})
