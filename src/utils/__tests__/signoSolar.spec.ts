import { describe, expect, it } from 'vitest'
import { signoSolarDaData, SIGNOS } from '../signoSolar'

/**
 * O signo solar é a primeira coisa que o quiz devolve, e a primeira chance de
 * contradizer a própria tese. "Cálculo de verdade por trás de cada frase" está
 * escrito na landing; entregar um signo tabelado no passo 1 desmente isso para
 * quem nasceu na virada, que é justamente quem mais confere.
 */
describe('signo solar calculado', () => {
  it('acerta um caso comum', () => {
    expect(signoSolarDaData('1992-03-14')?.signo).toBe('Peixes')
  })

  /**
   * O par que prova que tabela fixa não serve.
   *
   * Todo site publica "Libra começa em 23/09". Em 2000 o Sol cruzou 180° entre
   * o dia 22 e o 23, e os dois dias caem em signos diferentes — resultado que
   * nenhuma tabela de datas fixas produz.
   */
  it('separa os dois lados da virada de Virgem para Libra', () => {
    expect(signoSolarDaData('2000-09-22')?.signo).toBe('Virgem')
    expect(signoSolarDaData('2000-09-23')?.signo).toBe('Libra')
  })

  it('marca quando a hora do nascimento ainda pode mudar o signo', () => {
    const naBorda = signoSolarDaData('2000-09-22')
    expect(naBorda?.naVirada).toBe(true)

    // meio do signo: a hora não muda nada
    const meio = signoSolarDaData('1992-08-05')
    expect(meio?.naVirada).toBe(false)
  })

  it('o grau fica entre 0 e 30', () => {
    for (const d of ['1992-03-14', '2000-09-23', '1988-12-21', '1975-06-30']) {
      const r = signoSolarDaData(d)
      expect(r).not.toBeNull()
      expect(r!.grau).toBeGreaterThanOrEqual(0)
      expect(r!.grau).toBeLessThan(30)
      expect(SIGNOS).toContain(r!.signo)
    }
  })

  /** Entrada ruim devolve null em vez de um signo inventado. */
  it('recusa data malformada', () => {
    for (const ruim of ['', '14/03/1992', '1992-3-4', 'abc', '1992-13-45']) {
      expect(signoSolarDaData(ruim), ruim).toBeNull()
    }
  })
})
