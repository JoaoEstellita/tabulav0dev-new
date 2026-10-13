import { describe, it, expect } from 'vitest'
import aspectsConfig from '../../astro/aspects.config'
import { resolveNatalPlanetAspectText, isMinorAspect } from '../natalInterpretation'
import { resolveNamedPointAspectText } from '../pointAspectInterpretation'
import { aspectSymbol } from '../../astro/aspectSymbols'

/**
 * ⚠️ A fonte da verdade é o MOTOR, não uma lista escrita à mão.
 *
 * `aspects.config` diz quais aspectos existem. Quem consome precisa cobrir
 * todos eles, e o jeito como cada consumidor falha é SILENCIOSO:
 *
 *  - a grade fazia `ASPECT_SYM[norm(type)]` e, sem símbolo, a célula saía
 *    vazia — semiquadratura, sesquiquadratura e semissextil simplesmente não
 *    existiam ali, sem nada na tela dizendo que havia um aspecto;
 *  - os resolvers devolvem `null`, e a tela imprime título e orbe com um vão
 *    embaixo, que lê como defeito do mapa da pessoa.
 *
 * Acrescentar um aspecto no config sem passar aqui quebra os dois de uma vez.
 */
const NOMES = aspectsConfig.aspects.map((a: { name: string }) => a.name)
const PLANETAS = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto']
const PONTOS = ['Ascendant', 'Descendant', 'Midheaven', 'ImumCoeli', 'NorthNode', 'SouthNode']
const IDIOMAS = ['pt-BR', 'en-US', 'es-ES', 'it-IT']

describe('cobertura dos aspectos que o motor emite', () => {
  it('o config não encolheu sem ninguém notar', () => {
    expect(NOMES.length).toBeGreaterThanOrEqual(9)
    expect(NOMES).toContain('semissextil')
    expect(NOMES).toContain('semiquadratura')
    expect(NOMES).toContain('sesquiquadratura')
  })

  it('todos têm símbolo na grade', () => {
    const sem = NOMES.filter((n) => !aspectSymbol(n))
    expect(sem, `sem símbolo: ${sem.join(', ')}`).toEqual([])
  })

  it('todos têm texto para planeta × planeta, nos 4 idiomas', () => {
    const vazios: string[] = []
    for (const lang of IDIOMAS) {
      for (const asp of NOMES) {
        for (let i = 0; i < PLANETAS.length; i++) {
          for (let j = i + 1; j < PLANETAS.length; j++) {
            const t = resolveNatalPlanetAspectText(PLANETAS[i], asp, PLANETAS[j], lang)
            if (!t || t.trim().length < 50) vazios.push(`${lang} ${PLANETAS[i]} ${asp} ${PLANETAS[j]}`)
          }
        }
      }
    }
    expect(vazios, `sem texto:\n${vazios.slice(0, 15).join('\n')}`).toEqual([])
  })

  it('todos têm texto para ponto × planeta, nos 4 idiomas', () => {
    const vazios: string[] = []
    for (const lang of IDIOMAS) {
      for (const asp of NOMES) {
        for (const ponto of PONTOS) {
          for (const planeta of PLANETAS) {
            const t = resolveNamedPointAspectText(ponto, asp, planeta, lang)
            if (!t || t.trim().length < 40) vazios.push(`${lang} ${ponto} ${asp} ${planeta}`)
          }
        }
      }
    }
    expect(vazios, `sem texto:\n${vazios.slice(0, 15).join('\n')}`).toEqual([])
  })

  // O controle conta pelo `isMinorAspect` e a grade desenha pelo símbolo. Se um
  // aspecto fosse contado como menor e não tivesse símbolo, o número prometeria
  // mais do que aparece ao ligar — e vice-versa.
  it('o que o controle conta como menor é exatamente o que a grade sabe desenhar', () => {
    const menores = NOMES.filter(isMinorAspect)
    expect(menores.sort()).toEqual(['quincúncio', 'semiquadratura', 'semissextil', 'sesquiquadratura'])
    for (const m of menores) expect(aspectSymbol(m), m).toBeTruthy()
  })
})
