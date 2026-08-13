import { describe, expect, it } from 'vitest'

import { proximoDaFila } from '../../gerarDia.mjs'

/**
 * A FILA DO BANCO.
 *
 * A agenda passou a ter só o que acontece no dia — sete em trinta. Os outros
 * vinte e três vêm da fila que o João ordena no Estúdio.
 *
 * A primeira versão pegava o primeiro item fora da janela de catorze dias, e a
 * simulação de trinta dias mostrou o defeito: a fila oscilava nos catorze
 * primeiros e nunca chegava ao décimo quinto, porque assim que o item 1 saía da
 * janela ele voltava a ser o primeiro disponível. Dez repetições em trinta dias,
 * com 38 itens parados no banco.
 */
describe('a fila anda', () => {
  const fila = ['a', 'b', 'c', 'd', 'e']

  it('começa pelo primeiro quando nada saiu', () => {
    expect(proximoDaFila(fila, {}, '2026-08-13')).toBe('a')
  })

  it('segue de onde parou, e não do começo', () => {
    const historico = { '2026-08-13': 'a', '2026-08-14': 'b' }
    expect(proximoDaFila(fila, historico, '2026-08-15')).toBe('c')
  })

  /** O caso que a simulação pegou: item velho não pode puxar a fila de volta. */
  it('não volta ao topo só porque o primeiro saiu da janela', () => {
    const historico = {
      '2026-07-01': 'a', // fora da janela de 14 dias
      '2026-08-12': 'b',
    }
    expect(proximoDaFila(fila, historico, '2026-08-13')).toBe('c')
  })

  it('dá a volta ao chegar no fim', () => {
    const historico = { '2026-08-12': 'e' }
    expect(proximoDaFila(fila, historico, '2026-08-13')).toBe('a')
  })

  it('pula quem ainda está na janela', () => {
    const historico = { '2026-08-10': 'a', '2026-08-12': 'e' }
    // depois de 'e' viria 'a', mas 'a' saiu há três dias
    expect(proximoDaFila(fila, historico, '2026-08-13')).toBe('b')
  })

  /** Fila toda publicada na janela: recicla em vez de deixar o dia vazio. */
  it('recicla quando tudo está na janela', () => {
    const historico = {
      '2026-08-08': 'a', '2026-08-09': 'b', '2026-08-10': 'c',
      '2026-08-11': 'd', '2026-08-12': 'e',
    }
    expect(fila).toContain(proximoDaFila(fila, historico, '2026-08-13'))
  })

  it('fila vazia devolve null, e o dia cai na cascata', () => {
    expect(proximoDaFila([], {}, '2026-08-13')).toBeNull()
  })
})
