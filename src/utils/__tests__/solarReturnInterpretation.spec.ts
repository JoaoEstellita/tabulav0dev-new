import { describe, it, expect } from 'vitest'
import { resolveSolarReturnPlanetInHouseText, resolveSolarReturnAscendantText, resolveSolarReturnAspectText } from '../solarReturnInterpretation'

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

  it('Ascendente do RS cobre os 12 signos nos 4 idiomas', () => {
    const signs = ['Áries', 'Touro', 'Gêmeos', 'Câncer', 'Leão', 'Virgem', 'Libra', 'Escorpião', 'Sagitário', 'Capricórnio', 'Aquário', 'Peixes']
    for (const lang of ['pt-BR', 'en-US', 'es-ES', 'it-IT']) {
      for (const s of signs) {
        const t = resolveSolarReturnAscendantText(s, lang)
        expect(t, `${lang} ${s}`).toBeTruthy()
        expect(t!.length, `${lang} ${s}`).toBeGreaterThan(60)
      }
    }
    // acentos proibidos
    expect(resolveSolarReturnAscendantText('Leão', 'es-ES')!).not.toMatch(/[áéíóúñ]/i)
    expect(resolveSolarReturnAscendantText('Leão', 'it-IT')!).not.toMatch(/[àèìòùáéíóú]/i)
  })

  it('Aspecto do RS compõe texto para todos os pares × aspectos × idiomas', () => {
    const planets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto']
    const aspects = ['conjunção', 'sextil', 'quadratura', 'trígono', 'oposição']
    for (const lang of ['pt-BR', 'en-US', 'es-ES', 'it-IT']) {
      for (let i = 0; i < planets.length; i++) {
        for (let j = i + 1; j < planets.length; j++) {
          for (const asp of aspects) {
            const t = resolveSolarReturnAspectText(planets[i], asp, planets[j], lang)
            expect(t, `${lang} ${planets[i]} ${asp} ${planets[j]}`).toBeTruthy()
            expect(t!.length).toBeGreaterThan(60)
          }
        }
      }
    }
    // aspecto em EN também normaliza
    expect(resolveSolarReturnAspectText('Sun', 'trine', 'Venus', 'en-US')).toBeTruthy()
    // acentos proibidos
    expect(resolveSolarReturnAspectText('Sun', 'trígono', 'Venus', 'es-ES')!).not.toMatch(/[áéíóúñ]/i)
    expect(resolveSolarReturnAspectText('Sun', 'trígono', 'Venus', 'it-IT')!).not.toMatch(/[àèìòùáéíóú]/i)
    // ponto sem domínio (Chiron) cai no fallback natal (pode ser null, não deve quebrar)
    expect(() => resolveSolarReturnAspectText('Chiron', 'trígono', 'Venus', 'pt-BR')).not.toThrow()
  })

  it('es-ES sem tildes e it-IT sem acentos', () => {
    const es = resolveSolarReturnPlanetInHouseText('Venus', 5, 'es-ES')!
    const it = resolveSolarReturnPlanetInHouseText('Venus', 5, 'it-IT')!
    expect(es).not.toMatch(/[áéíóúñ]/i)
    expect(it).not.toMatch(/[àèìòùáéíóú]/i)
  })
})
