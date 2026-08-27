import { describe, it, expect } from 'vitest'
import { resolveNamedPointAspectText } from '../pointAspectInterpretation'

describe('resolveNamedPointAspectText', () => {
  it('nódulo × planeta em todos os aspectos e idiomas', () => {
    const points = ['NorthNode', 'SouthNode', 'Ascendant', 'Midheaven']
    const planets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto']
    const aspects = ['conjunção', 'sextil', 'quadratura', 'trígono', 'oposição', 'quincúncio']
    for (const lang of ['pt-BR', 'en-US', 'es-ES', 'it-IT']) {
      for (const pt of points) {
        for (const p of planets) {
          for (const asp of aspects) {
            const t = resolveNamedPointAspectText(pt, asp, p, lang)
            expect(t, `${lang} ${pt} ${asp} ${p}`).toBeTruthy()
            expect(t!.length).toBeGreaterThan(40)
          }
        }
      }
    }
  })

  it('ordem invertida (planeta primeiro) também resolve', () => {
    expect(resolveNamedPointAspectText('Venus', 'trígono', 'NorthNode', 'pt-BR')).toBeTruthy()
    expect(resolveNamedPointAspectText('Mc', 'conjunção', 'Sun', 'pt-BR')).toBeTruthy()
  })

  it('null quando nenhum lado é ponto nomeado (planeta×planeta) ou ambos são', () => {
    expect(resolveNamedPointAspectText('Sun', 'trígono', 'Venus', 'pt-BR')).toBeNull()
    expect(resolveNamedPointAspectText('Ascendant', 'quadratura', 'Midheaven', 'pt-BR')).toBeNull()
  })

  it('es-ES sem tildes, it-IT sem acentos', () => {
    expect(resolveNamedPointAspectText('NorthNode', 'trígono', 'Venus', 'es-ES')!).not.toMatch(/[áéíóúñ]/i)
    expect(resolveNamedPointAspectText('NorthNode', 'trígono', 'Venus', 'it-IT')!).not.toMatch(/[àèìòùáéíóú]/i)
  })
})
