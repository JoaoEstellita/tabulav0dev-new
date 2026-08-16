import { describe, expect, it } from 'vitest'

import { auditar, lerManifesto, proximoNumero, FAMILIAS, ORIGENS } from '../../receberFundo.mjs'

/**
 * NENHUMA IMAGEM PUBLICA SEM PROCEDÊNCIA.
 *
 * O acervo nasceu 100% domínio público da NASA, e o `CREDITOS.md` explica o
 * cuidado que houve na coleta: nada com `secondary_creator`, nada de APOD
 * (publica foto de amador com copyright próprio), nada de ESO (a licença CC BY
 * exigiria crédito visível na peça).
 *
 * Assim que uma imagem GERADA entrar no mesmo banco, essa garantia deixa de
 * valer por atacado e passa a valer por arquivo. Vinte e duas fotos numa pasta
 * são indistinguíveis a olho, e o problema só apareceria quando alguém cobrasse.
 *
 * Este teste é a rede: arquivo no disco sem entrada no manifesto, entrada sem
 * licença, ou uso comercial indefinido derrubam a suíte.
 */
describe('o acervo de fundos', () => {
  it('toda imagem tem origem, licença e uso comercial resolvidos', () => {
    expect(auditar().join('\n')).toBe('')
  })

  it('o manifesto não está vazio', () => {
    expect(Object.keys(lerManifesto()).length).toBeGreaterThan(10)
  })

  /**
   * A numeração é contínua e nunca reaproveita.
   *
   * `templateFoto` escolhe pelo índice dentro da família, então sobrescrever um
   * arquivo trocaria silenciosamente o fundo de peças já publicadas.
   */
  it('o próximo número é maior que todos os usados', () => {
    const usados = Object.keys(lerManifesto())
      .map((f) => Number(/-(\d+)\.jpg$/.exec(f)?.[1]))
      .filter(Number.isFinite)
    expect(proximoNumero()).toBeGreaterThan(Math.max(...usados))
  })

  it('as famílias são as que o template conhece', () => {
    // `templateFoto.mjs` deriva a família do elemento do signo, e reserva `lua`
    expect(FAMILIAS).toEqual(['fogo', 'terra', 'ar', 'agua', 'lua'])
    for (const arq of Object.keys(lerManifesto())) {
      expect(FAMILIAS.some((f) => arq.startsWith(`${f}-`)), arq).toBe(true)
    }
  })

  /**
   * Só a NASA entra com licença automática.
   *
   * Se alguém acrescentar uma origem nova com `licencaConhecida: true` sem
   * checar os termos, este teste avisa. É a decisão que não pode ser feita no
   * automático.
   */
  it('só a NASA dispensa declarar licença à mão', () => {
    for (const [nome, regra] of Object.entries(ORIGENS)) {
      if (nome === 'nasa') {
        expect(regra.licencaConhecida).toBe(true)
        expect(regra.usoComercial).toBe(true)
      } else {
        expect(regra.licencaConhecida, nome).toBe(false)
      }
    }
  })
})
