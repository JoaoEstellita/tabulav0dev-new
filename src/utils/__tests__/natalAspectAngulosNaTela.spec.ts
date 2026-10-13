import { describe, it, expect } from 'vitest'
import { resolveNatalPlanetAspectText } from '../natalInterpretation'
import { resolveNamedPointAspectText } from '../pointAspectInterpretation'

// ⚠️ A aba Mapa chama `resolveNatalPlanetAspectText` — NÃO o resolver de pontos.
// A cobertura de ângulos/aspectos menores foi feita no resolver de pontos e
// mesmo assim a tela seguiu mostrando "Mercúrio conjunção Ascendente · 5.2°"
// sem texto: o catálogo curado é planeta×planeta e a porta da tela parava nele.
// Este teste trava a PORTA, não a cozinha.
describe('aspectos a ângulos chegam pela porta que a tela usa', () => {
  // Nomes como o engine os emite (`aspectsNatalToNatal`) e os apelidos que a UI usa.
  const pontos = ['Ascendant', 'Descendant', 'Midheaven', 'ImumCoeli', 'Dsc', 'Ic', 'NorthNode', 'SouthNode']
  const planetas = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto']
  // `a.type` vem em pt-BR acentuado na tela; os menores são os que não tinham texto.
  const aspectos = ['conjunção', 'sextil', 'quadratura', 'trígono', 'oposição', 'quincúncio', 'semiquadratura', 'sesquiquadratura']
  const idiomas = ['pt-BR', 'en-US', 'es-ES', 'it-IT']

  it('ponto × planeta × aspecto × idioma: nenhum cai sem texto', () => {
    const vazios: string[] = []
    for (const lang of idiomas) {
      for (const ponto of pontos) {
        for (const planeta of planetas) {
          for (const asp of aspectos) {
            // As duas ordens: o engine emite o par em qualquer uma.
            for (const [a, b] of [[ponto, planeta], [planeta, ponto]] as const) {
              const t = resolveNatalPlanetAspectText(a, asp, b, lang)
              if (!t || t.trim().length < 40) vazios.push(`${lang} ${a} ${asp} ${b}`)
            }
          }
        }
      }
    }
    expect(vazios, `sem texto:\n${vazios.slice(0, 20).join('\n')}`).toEqual([])
  })

  it('o curado planeta×planeta continua ganhando do composer', () => {
    const curado = resolveNatalPlanetAspectText('Sun', 'conjunção', 'Moon', 'pt-BR')
    expect(curado).toBeTruthy()
    // O composer de pontos devolve null para planeta×planeta: se o texto viesse
    // dele, este par teria perdido a leitura curada.
    expect(resolveNamedPointAspectText('Sun', 'conjunção', 'Moon', 'pt-BR')).toBeNull()
  })

  it('ângulo × ângulo segue sem texto (não há leitura para o eixo contra si)', () => {
    expect(resolveNatalPlanetAspectText('Ascendant', 'quadratura', 'Midheaven', 'pt-BR')).toBeNull()
  })
})
