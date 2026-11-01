import { describe, it, expect } from 'vitest'
import { normalizarOrdem, moverNaOrdem, ORDEM_PADRAO, type BlocoDaHome } from '../../hooks/useOrdemDaHome'

describe('a ordem escolhida dos blocos da Home', () => {
  /**
   * ⚠️ ESTE ASSERT É FIXO DE PROPÓSITO, ao contrário dos outros deste arquivo.
   * Os demais derivam de `ORDEM_PADRAO` porque cobram COMPORTAMENTO; este
   * cobra a ESCOLHA, e uma escolha que o teste deriva de si mesma não está
   * sendo guardada por ninguém. Se a ordem mudar, é para este assert quebrar e
   * alguém confirmar que foi de caso pensado.
   *
   * ⚠️ O padrão é do MAIS IMEDIATO para o mais técnico. As áreas respondem
   * "onde isso pega na minha vida hoje", que é a pergunta que traz a pessoa ao
   * app; as emoções dão o tom em oito palavras do dia a dia; o céu fecha, e é
   * a parte densa. A ordem que esta Home teve por meses (céu primeiro) pedia
   * que a pessoa atravessasse uma roda natal e uma grade de cem símbolos antes
   * de chegar na parte que ela entende de graça.
   */
  it('a ordem de fábrica vai do imediato ao técnico: áreas, emoções, céu', () => {
    expect([...ORDEM_PADRAO]).toEqual(['status', 'emocoes', 'ceu'])
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
      // ⚠️ DERIVADO DE `ORDEM_PADRAO`, não escrito à mão. A ordem de fábrica já
      // mudou três vezes, e a cada mudança estes asserts quebravam sem que
      // nada estivesse errado — exatamente o padrão que deixou
      // `costing.unit.js` meses vermelho. O contrato é "mantém o escolhido na
      // frente, completa com o resto NA ORDEM DO PADRÃO"; é isso que se cobra.
      const completando = (escolhidos: string[]) => [
        ...escolhidos,
        ...ORDEM_PADRAO.filter((b) => !escolhidos.includes(b)),
      ]
      for (const escolhido of ORDEM_PADRAO) {
        expect(normalizarOrdem([escolhido])).toEqual(completando([escolhido]))
      }
      expect(normalizarOrdem([])).toEqual([...ORDEM_PADRAO])
    })

    it('descarta nome desconhecido e repetição', () => {
      const completando = (escolhidos: string[]) => [
        ...escolhidos,
        ...ORDEM_PADRAO.filter((b) => !escolhidos.includes(b)),
      ]
      expect(normalizarOrdem(['emocoes', 'emocoes', 'xpto', 'ceu']))
        .toEqual(completando(['emocoes', 'ceu']))
      expect(normalizarOrdem(['status', 'status'])).toEqual(completando(['status']))
    })

    it('lixo total cai no padrão — a Home nunca fica vazia', () => {
      for (const lixo of [null, undefined, 'abc', 42, {}, [1, 2, 3]]) {
        expect(normalizarOrdem(lixo as any), String(lixo)).toEqual([...ORDEM_PADRAO])
      }
    })
  })
})
