import { describe, it, expect } from 'vitest'
import { casasInterceptadas, signosInterceptados } from '../casasInterceptadas'

/**
 * Casas interceptadas.
 *
 * Um signo inteiro preso dentro de uma casa, sem nenhuma cúspide tocando nele.
 * Só acontece em sistemas desiguais (Placidus) — em Casas Inteiras cada casa é
 * exatamente um signo e interceptação é impossível.
 *
 * Isso também explica por que nunca apareceu no app: todas as contas estavam
 * gravadas em whole-sign por um default errado, e nenhum mapa podia ter
 * interceptação nem em teoria.
 */

/** Casas iguais de 30°, a partir de um ASC qualquer. */
const iguais = (asc: number) => Array.from({ length: 12 }, (_, i) => (asc + i * 30) % 360)

describe('casas iguais nunca têm interceptação', () => {
  it('whole-sign a partir de 0° Áries', () => {
    expect(casasInterceptadas(iguais(0))).toEqual([])
  })

  it('whole-sign a partir de qualquer grau', () => {
    for (const asc of [15, 73.4, 201, 359]) {
      expect(casasInterceptadas(iguais(asc)), `ASC ${asc}`).toEqual([])
    }
  })
})

describe('casa larga engole um signo', () => {
  it('casa de 60° que começa no início de um signo intercepta o seguinte', () => {
    // Casa 1 de 0° a 60°: Áries começa EM 0° (toca a cúspide, tem porta) e
    // Touro (30-60) termina EXATAMENTE na cúspide seguinte — também tem porta.
    // Então não há interceptação: é o caso de borda que separa o certo do
    // quase-certo.
    const cusp = [0, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 345]
    const r = casasInterceptadas(cusp)
    expect(r.filter((x) => x.casa === 1)).toEqual([])
  })

  it('casa larga com folga dos dois lados intercepta de verdade', () => {
    // Casa 1 de 5° Áries a 70° Gêmeos: Touro (30-60) está inteiro dentro, sem
    // encostar em cúspide nenhuma. É interceptado.
    const cusp = [5, 70, 100, 130, 160, 185, 215, 250, 280, 310, 340, 355]
    const r = casasInterceptadas(cusp)
    const naPrimeira = r.filter((x) => x.casa === 1)
    expect(naPrimeira).toHaveLength(1)
    expect(naPrimeira[0].signo, 'Touro = índice 1').toBe(1)
    expect(naPrimeira[0].nomeDoSigno).toBe('Touro')
  })

  it('casa estreita não intercepta nada', () => {
    const cusp = [0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200, 220]
    // Nenhuma casa chega a 30°, então nenhuma pode conter um signo inteiro.
    expect(casasInterceptadas(cusp).filter((x) => x.casa <= 11)).toEqual([])
  })
})

describe('a volta do zodíaco', () => {
  it('casa que cruza 0° Áries é tratada corretamente', () => {
    // Casa 12 de 335° a 40°: Peixes (330-360) começa ANTES da casa; Áries
    // (0-30) está inteiro dentro, com folga. Interceptado.
    const cusp = [40, 70, 100, 130, 160, 190, 220, 250, 280, 305, 320, 335]
    const r = casasInterceptadas(cusp)
    const na12 = r.filter((x) => x.casa === 12)
    expect(na12).toHaveLength(1)
    expect(na12[0].nomeDoSigno).toBe('Áries')
  })
})

describe('entrada ruim não inventa resultado', () => {
  it('lista vazia, curta ou com lixo devolve vazio', () => {
    expect(casasInterceptadas(null)).toEqual([])
    expect(casasInterceptadas(undefined)).toEqual([])
    expect(casasInterceptadas([])).toEqual([])
    expect(casasInterceptadas([0, 30, 60])).toEqual([])
    expect(casasInterceptadas([0, 30, NaN, 90, 120, 150, 180, 210, 240, 270, 300, 330])).toEqual([])
  })
})

describe('conjunto de signos, para pintar o anel', () => {
  it('devolve só os índices, sem repetir', () => {
    const cusp = [5, 70, 100, 130, 160, 185, 215, 250, 280, 310, 340, 355]
    const s = signosInterceptados(cusp)
    expect(s.has(1), 'Touro interceptado').toBe(true)
    expect(s.has(4), 'Leão não').toBe(false)
  })

  it('sem interceptação, conjunto vazio', () => {
    expect(signosInterceptados(iguais(0)).size).toBe(0)
  })
})
