import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { movimentoDaArea, mobilidade, valorDaSombra } from '../movimentoDaArea'

const T = (durationClass?: 'curto' | 'medio' | 'longo', strength = 1, transitPlanet = 'Saturn') =>
  ({ durationClass, strength, transitPlanet })

describe('movimento de uma área da vida', () => {
  it('tudo curto dá 100; tudo longo fica baixo mas não zero', () => {
    expect(movimentoDaArea([T('curto'), T('curto')])).toBe(100)
    const longo = movimentoDaArea([T('longo'), T('longo')])!
    expect(longo).toBeGreaterThan(0)
    expect(longo).toBeLessThan(25)
  })

  /**
   * ⚠️ `longo` NÃO vale zero, e isso é decisão de desenho.
   *
   * Um trânsito de Plutão também se move — devagar, e é por isso que ele é o
   * pano de fundo e não a notícia. Zerando, a sombra sumiria justamente nas
   * áreas que estão mudando de verdade, só que em meses.
   */
  it('trânsito longo ainda conta como algum movimento', () => {
    expect(mobilidade(T('longo'))).toBeGreaterThan(0)
    expect(mobilidade(T('longo'))).toBeLessThan(mobilidade(T('medio')))
    expect(mobilidade(T('medio'))).toBeLessThan(mobilidade(T('curto')))
  })

  it('a força do trânsito pesa na conta', () => {
    // Um trânsito curto FORTE e um longo fraco: o movimento tem de ficar alto.
    const comForte = movimentoDaArea([T('curto', 1), T('longo', 0.1)])!
    // Invertendo as forças, tem de cair.
    const comFraco = movimentoDaArea([T('curto', 0.1), T('longo', 1)])!
    expect(comForte).toBeGreaterThan(comFraco)
  })

  /**
   * ⚠️ `durationClass` não vem em todas as fontes do projeto —
   * `personalTodayRich`, por exemplo, não traz. Sem a reserva pelo planeta, a
   * área inteira cairia no ramo default e todo trânsito contaria igual.
   */
  it('sem durationClass, decide pelo planeta', () => {
    expect(mobilidade({ transitPlanet: 'Moon' })).toBe(1)
    expect(mobilidade({ transitPlanet: 'Venus' })).toBe(1)
    expect(mobilidade({ transitPlanet: 'Pluto' })).toBeLessThan(0.5)
    expect(mobilidade({ transitPlanet: 'Saturn' })).toBeLessThan(0.5)
    // Acentuação e caixa não podem derrubar o reconhecimento.
    expect(mobilidade({ transitPlanet: 'MERCURY' })).toBe(1)
  })

  /**
   * ⚠️ Sem trânsito é `null`, não zero. A roda precisa distinguir "nada se
   * move" de "não sabemos" — pintar zero afirmaria a primeira quando a verdade
   * é a segunda, e é o mesmo erro que já fez área sem dado aparecer vermelha.
   */
  it('sem trânsito devolve null, não zero', () => {
    expect(movimentoDaArea([])).toBeNull()
    expect(movimentoDaArea(null)).toBeNull()
    expect(movimentoDaArea(undefined)).toBeNull()
  })

  it('lixo na entrada não vira NaN', () => {
    const r = movimentoDaArea([
      { strength: NaN } as any,
      { strength: null } as any,
      { transitPlanet: undefined } as any,
    ])
    expect(r === null || (Number.isFinite(r) && r >= 0 && r <= 100)).toBe(true)
  })
})

describe('o raio da sombra na roda', () => {
  /**
   * ⚠️ A SOMBRA NUNCA PODE PASSAR DO POLÍGONO PRINCIPAL.
   *
   * O desenho cheio é a nota; a sombra é a fatia dela que se mexe. Se a sombra
   * saísse para fora, as duas formas estariam em escalas diferentes no mesmo
   * lugar — o jeito clássico de um gráfico mentir sem querer.
   */
  it('fica sempre dentro do valor', () => {
    for (const valor of [0, 12, 50, 99, 100]) {
      for (const mov of [0, 25, 50, 100]) {
        const s = valorDaSombra(valor, mov)!
        expect(s, `valor ${valor} mov ${mov}`).toBeLessThanOrEqual(valor)
        expect(s).toBeGreaterThanOrEqual(0)
      }
    }
  })

  it('movimento 100 encosta no valor; movimento 0 some', () => {
    expect(valorDaSombra(60, 100)).toBe(60)
    expect(valorDaSombra(60, 0)).toBe(0)
    expect(valorDaSombra(60, 50)).toBe(30)
  })

  it('sem valor ou sem movimento, não desenha', () => {
    expect(valorDaSombra(null, 50)).toBeNull()
    expect(valorDaSombra(60, null)).toBeNull()
    expect(valorDaSombra(null, null)).toBeNull()
  })
})

/**
 * ⚠️ A SOMBRA PRECISA SER DESENHADA DEPOIS DO PREENCHIMENTO.
 *
 * Ela nasceu invisível: eu a desenhei ANTES do polígono principal para ficar
 * "por baixo", mas o principal tem `fill`, e esse preenchimento pintava por
 * cima dela. O gráfico ficou com uma informação a mais e nenhum pixel para
 * mostrá-la — sem erro, sem aviso, sem nada que denunciasse.
 *
 * Este teste lê a ordem no fonte porque é exatamente ali que o defeito mora:
 * em SVG, quem vem depois ganha. Não dá para pegar isso num teste de valor.
 */
describe('a ordem de desenho da roda', () => {
  const RODA = readFileSync(
    join(__dirname, '..', '..', 'components', 'RodaDeStatus.tsx'),
    'utf-8',
  )

  it('a sombra vem depois do preenchimento e antes do contorno', () => {
    const preenchimento = RODA.indexOf('fill="url(#area)"')
    const sombra = RODA.indexOf('points={geo.sombra}')
    const contorno = RODA.lastIndexOf('points={geo.valores}')

    for (const [nome, v] of Object.entries({ preenchimento, sombra, contorno })) {
      expect(v, `não achei ${nome} no fonte da roda`).toBeGreaterThan(-1)
    }
    expect(sombra, 'a sombra voltou para trás do preenchimento e sumiu').toBeGreaterThan(preenchimento)
    expect(contorno, 'o contorno tem de fechar o desenho por cima').toBeGreaterThan(sombra)
  })

  it('a sombra tem cor própria, não o azul do polígono com opacidade', () => {
    // Mesmo matiz, uma forma dentro da outra, lê como uma só — era o segundo
    // motivo de não dar para distinguir.
    expect(RODA).toMatch(/const MOVIMENTO = '#[0-9A-Fa-f]{6}'/)
    expect(RODA, 'a sombra voltou a usar a cor do polígono').not.toMatch(
      /points=\{geo\.sombra\}\s+fill=\{ACENTO\}/,
    )
  })

  it('o preenchimento do polígono não traz mais traço junto', () => {
    // Se voltar a trazer, o contorno aparece ANTES da sombra e ela fica com
    // uma linha sólida cruzando por cima.
    expect(RODA).toContain('<Polygon points={geo.valores} fill="url(#area)" stroke="none" />')
  })
})
