import { describe, it, expect } from 'vitest'
import { emocoesDoDia, EMOCOES } from '../emocoesDoDia'
import fixtures from './fixtures_transitos.json'

/**
 * O NÚMERO E A EXPLICAÇÃO TÊM DE VIR DA MESMA LISTA.
 *
 * ⚠️ ISTO É UM BUG RELATADO NA TELA, não uma precaução. O card mostrou:
 *
 *     Sensível                                    54
 *     ...
 *     Nenhum trânsito de hoje mexe nisso.
 *
 * Os 54 eram verdadeiros — vinham de `Neptune semissextil ASC` (0,900) e
 * `Neptune trigono IC` (0,828), ambos no `transitosRicos` que o backend usou
 * para gravar o valor. A frase embaixo também era "verdadeira" no seu próprio
 * mundo: ela saía do cálculo LOCAL, sobre `personalTodayRich`, que não tem
 * esses dois trânsitos.
 *
 * Duas listas, duas verdades, na mesma caixa. E o efeito não é um detalhe
 * errado: quem lê "não há nada movendo isso" embaixo de um anel em 54 passa a
 * duvidar dos oito números.
 *
 * A correção foi usar UMA lista: `ClimaEmocional` recalcula do
 * `transitosRicos` do backend, que já chega no mesmo documento. Este teste
 * trava a propriedade que a correção garante — valor positivo implica
 * contribuição listada — porque ela é fácil de perder numa refatoração que
 * "otimize" voltando a misturar as fontes.
 */

describe('o número bate com a explicação', () => {
  it('toda emoção com valor acima de zero tem ao menos uma contribuição', () => {
    const quebras: string[] = []
    for (const u of fixtures as any[]) {
      const r = emocoesDoDia(u.transitos)
      if (!r) continue
      for (const e of r) {
        if (e.valor > 0 && e.porque.length === 0) {
          quebras.push(`${u.uid}.${e.chave}: valor ${e.valor} sem nenhuma contribuição`)
        }
      }
    }
    expect(
      quebras,
      quebras.length
        ? `número sem explicação — foi exatamente o caso "Sensível 54 / nenhum trânsito":\n  ${quebras.slice(0, 10).join('\n  ')}`
        : '',
    ).toEqual([])
  })

  /**
   * O contrário também: contribuição listada sem valor nenhum seria mostrar
   * "de onde vem" um número que é zero — ruído com cara de informação.
   */
  it('emoção em zero não lista contribuição', () => {
    const quebras: string[] = []
    for (const u of fixtures as any[]) {
      const r = emocoesDoDia(u.transitos)
      if (!r) continue
      for (const e of r) {
        if (e.valor === 0 && e.porque.length > 0) {
          quebras.push(`${u.uid}.${e.chave}: zero, mas lista ${e.porque.length} contribuição(ões)`)
        }
      }
    }
    expect(quebras, quebras.join('\n')).toEqual([])
  })

  /**
   * ⚠️ O CASO EXATO QUE FOI RELATADO, congelado.
   *
   * Os dois trânsitos de Netuno que produziram os 54 de Sensibilidade. Se um
   * dia a tabela de pesos deixar de contá-los, este teste diz qual caso real
   * parou de funcionar — em vez de a frase voltar à tela meses depois sem
   * ninguém lembrar que já tinha acontecido.
   */
  it('os dois Netunos que geraram "Sensível 54" continuam movendo Sensibilidade', () => {
    const r = emocoesDoDia([
      { t: 'Neptune', a: 'semissextil', n: 'ASC', strength: 1, orb: 0.9 },
      { t: 'Neptune', a: 'trigono', n: 'IC', strength: 1, orb: 1.2 },
    ] as any)
    expect(r, 'os dois trânsitos têm de produzir leitura').not.toBeNull()
    const sens = r!.find((e) => e.chave === 'sensibilidade')!
    expect(sens.valor, 'Sensibilidade deveria subir com Netuno em aspecto macio').toBeGreaterThan(0)
    expect(
      sens.porque.length,
      'o número existe mas a explicação sumiu — é o bug "Sensível 54 / nenhum trânsito"',
    ).toBeGreaterThan(0)
    const planetas = sens.porque.map((c) => c.planeta.toLowerCase())
    expect(planetas.every((p) => p.includes('neptune') || p.includes('netuno'))).toBe(true)
  })

  /** Sanidade: o conjunto de chaves não mudou sem o teste saber. */
  it('são as oito de sempre', () => {
    expect(EMOCOES.length).toBe(8)
  })
})
