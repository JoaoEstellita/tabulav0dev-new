import { describe, it, expect } from 'vitest'
import { normalizarOrdem, moverNaOrdem, ORDEM_PADRAO, type BlocoDaHome } from '../../hooks/useOrdemDaHome'

describe('a ordem escolhida dos blocos da Home', () => {
  it('a ordem de fábrica é o roteiro de leitura: céu, status, emoções', () => {
    expect([...ORDEM_PADRAO]).toEqual(['ceu', 'status', 'emocoes'])
  })

  describe('mover um bloco', () => {
    it('sobe e desce uma casa', () => {
      const o: BlocoDaHome[] = ['ceu', 'status', 'emocoes']
      expect(moverNaOrdem(o, 'emocoes', -1)).toEqual(['ceu', 'emocoes', 'status'])
      expect(moverNaOrdem(o, 'ceu', 1)).toEqual(['status', 'ceu', 'emocoes'])
    })

    /**
     * ⚠️ Nas pontas não acontece nada, e a função devolve o MESMO array.
     *
     * A identidade importa: o hook usa `nova === ordemAtual` para decidir se
     * grava no disco e avisa os ouvintes. Devolvendo uma cópia, cada toque numa
     * seta desabilitada escreveria no AsyncStorage e redesenharia a Home.
     */
    it('nas pontas não faz nada e devolve o mesmo array', () => {
      const o: BlocoDaHome[] = ['ceu', 'status', 'emocoes']
      expect(moverNaOrdem(o, 'ceu', -1)).toBe(o)
      expect(moverNaOrdem(o, 'emocoes', 1)).toBe(o)
    })

    it('não inventa nem perde bloco', () => {
      let o: BlocoDaHome[] = [...ORDEM_PADRAO]
      for (const passo of [1, -1, 1, 1, -1] as const) {
        o = moverNaOrdem(o, o[Math.floor(Math.random() * o.length)], passo)
        expect([...o].sort()).toEqual([...ORDEM_PADRAO].sort())
      }
    })
  })

  describe('ler a ordem guardada no aparelho', () => {
    it('aceita uma ordem válida como está', () => {
      expect(normalizarOrdem(['emocoes', 'ceu', 'status'])).toEqual(['emocoes', 'ceu', 'status'])
    })

    /**
     * ⚠️ COMPLETAR COM O QUE FALTA é o ponto deste normalizador.
     *
     * Uma versão futura pode acrescentar um bloco, e a ordem guardada no
     * aparelho de quem já tinha preferência não o teria. Sem completar, a
     * seção nova simplesmente não apareceria — para parte das pessoas, em
     * silêncio, sem erro nenhum. É a mesma classe de falha que já mordeu neste
     * projeto várias vezes.
     */
    it('completa com os blocos que faltam, no fim', () => {
      expect(normalizarOrdem(['emocoes'])).toEqual(['emocoes', 'ceu', 'status'])
      expect(normalizarOrdem([])).toEqual([...ORDEM_PADRAO])
    })

    it('descarta nome desconhecido e repetição', () => {
      expect(normalizarOrdem(['emocoes', 'emocoes', 'xpto', 'ceu']))
        .toEqual(['emocoes', 'ceu', 'status'])
    })

    it('lixo total cai no padrão — a Home nunca fica vazia', () => {
      for (const lixo of [null, undefined, 'abc', 42, {}, [1, 2, 3]]) {
        expect(normalizarOrdem(lixo as any), String(lixo)).toEqual([...ORDEM_PADRAO])
      }
    })
  })
})
