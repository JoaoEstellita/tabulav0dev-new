import { describe, expect, it } from 'vitest'

import { MEME, CHAVES_DE_MEME, memePorId } from '../temasDeMeme.mjs'
import { montarMeme } from '../templateMeme.mjs'

/**
 * O MEME TEM OUTRA RÉGUA, E ELA PRECISA EXISTIR.
 *
 * `linguagem.spec` não roda sobre estes textos de propósito: a voz sóbria vale
 * nas peças de leitura, e o meme é outro formato. Mas "outra régua" não é "sem
 * régua" — é o formato mais fácil de errar o tom de toda a conta, e o erro
 * característico é rir de quem lê.
 */
describe('a régua do meme', () => {
  const pares = CHAVES_DE_MEME.map((id) => memePorId(id))

  it('todo par tem as duas metades', () => {
    for (const p of pares) {
      expect(p.dizem, p.id).toBeTruthy()
      expect(p.mapa, p.id).toBeTruthy()
    }
  })

  /**
   * A segunda metade é a leitura, e leitura precisa de espaço. Um par em que a
   * correção é mais curta que o clichê virou provocação, não explicação.
   */
  it('a correção é mais longa que o clichê', () => {
    for (const p of pares) {
      expect(p.mapa.length, `${p.id}: ${p.mapa.length} vs ${p.dizem.length}`)
        .toBeGreaterThan(p.dizem.length)
    }
  })

  /**
   * O humor é a precisão, não o deboche.
   *
   * Quem lê tem aquele signo. "Todo mundo que acredita nisso é burro" perde o
   * leitor na primeira linha, e a conta existe para o leitor.
   */
  it('nenhum par ridiculariza quem lê', () => {
    const DEBOCHE = [
      /\bburr[oa]/i, /\bidiot/i, /\bignorant/i, /\bbobagem\b/i, /\bbesteira\b/i,
      /\brid[ií]cul/i, /\bpat[ée]tic/i, /\bacredita nisso\b/i,
    ]
    for (const p of pares) {
      const tudo = `${p.dizem} ${p.mapa}`
      for (const termo of DEBOCHE) {
        expect(termo.test(tudo), `${p.id}: ${tudo.slice(0, 80)}`).toBe(false)
      }
    }
  })

  /** Sem emoji e sem gíria: o contraste já é o humor. */
  it('e nenhum usa emoji', () => {
    const EMOJI = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u
    for (const p of pares) {
      expect(EMOJI.test(`${p.dizem} ${p.mapa}`), p.id).toBe(false)
    }
  })

  it('sem travessão, como todo o resto', () => {
    for (const p of pares) {
      expect(`${p.dizem} ${p.mapa}`.includes('—'), p.id).toBe(false)
    }
  })

  it('o template rende as duas metades e a assinatura', () => {
    const html = montarMeme(MEME.venusVirgem)
    expect(html).toContain('o que dizem')
    expect(html).toContain('o que o mapa diz')
    expect(html).toContain('@tabula_estelar')
    expect(html).toContain(MEME.venusVirgem.dizem)
    // sem isto o clichê sai igual à correção, e a peça perde o sentido
    expect(html).toContain('line-through')
  })

  it('um id que não existe falha com a lista de opções', () => {
    expect(() => memePorId('naoExiste')).toThrow(/venusVirgem/)
  })
})
