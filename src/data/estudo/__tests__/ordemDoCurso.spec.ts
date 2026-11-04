import { describe, it, expect } from 'vitest'
import { CATALOGO, LICOES, ORDEM_DO_CURSO, vizinhasNaOrdem, posicaoNaOrdem } from '../index'

/**
 * A ORDEM DO CURSO — ninguém fica sem saída, e nada anda para trás.
 *
 * ⚠️ ESTE ARQUIVO NASCEU DE UM DEFEITO REAL, relatado por quem usava: "na aba
 * do Sol leva pra Lua, mas da Lua leva pro Sol, não dando continuidade".
 *
 * A causa: `verTambem` fazia as vezes de percurso, e ele nunca foi isso — é
 * uma lista de RELAÇÕES. Medido antes da correção, com as 53 unidades:
 *
 *   37 de 53  tinham link que VOLTAVA (signo-aries -> planeta-marte, etc.)
 *   28 de 53  não tinham NENHUM link para frente — beco sem saída
 *   Sol -> Lua -> Sol: um ciclo de duas unidades do qual não se saía
 *
 * Agora a continuidade sai de `ORDEM_DO_CURSO` e `verTambem` volta a ser o que
 * é: aprofundamento lateral, exibido como "Relacionado".
 */
describe('a ordem do curso', () => {
  it('cobre todas as unidades do catálogo, sem sobra nem repetição', () => {
    const naOrdem = ORDEM_DO_CURSO.map((u) => u.id)
    expect(new Set(naOrdem).size, 'unidade repetida na ordem').toBe(naOrdem.length)
    const fora = CATALOGO.filter((u) => posicaoNaOrdem(u.id) === null).map((u) => u.id)
    expect(fora, 'unidade fora da ordem fica sem anterior e sem próxima').toEqual([])
    expect(naOrdem.length, 'a ordem perdeu unidades do catálogo').toBe(CATALOGO.length)
  })

  /**
   * ⚠️ O DEFEITO RELATADO, EM FORMA DE TESTE. Só a última unidade do curso
   * pode não ter próxima; qualquer outra sem saída é um beco.
   */
  it('nenhuma unidade é um beco sem saída', () => {
    const becos = ORDEM_DO_CURSO
      .slice(0, -1)
      .filter((u) => !vizinhasNaOrdem(u.id).proxima)
      .map((u) => u.id)
    expect(becos, 'unidade sem para onde ir: quem abre fica preso').toEqual([])
  })

  /** ⚠️ E a navegação nunca volta: a próxima está sempre adiante. */
  it('a próxima está sempre adiante, e a anterior sempre atrás', () => {
    const errados: string[] = []
    for (const u of ORDEM_DO_CURSO) {
      const aqui = posicaoNaOrdem(u.id)!
      const { anterior, proxima } = vizinhasNaOrdem(u.id)
      if (proxima && posicaoNaOrdem(proxima.id)! <= aqui) errados.push(`${u.id} -> ${proxima.id}`)
      if (anterior && posicaoNaOrdem(anterior.id)! >= aqui) errados.push(`${anterior.id} <- ${u.id}`)
    }
    expect(errados, 'a navegação anda para trás').toEqual([])
  })

  /**
   * ⚠️ O CICLO SOL/LUA, especificamente. Era o sintoma que o usuário viu, e
   * um teste que só mede o geral poderia passar com ele de volta.
   */
  it('seguir sempre a próxima chega ao fim, sem entrar em ciclo', () => {
    const vistos = new Set<string>()
    let atual = ORDEM_DO_CURSO[0]
    let passos = 0
    while (atual && passos <= CATALOGO.length + 1) {
      expect(vistos.has(atual.id), `ciclo: voltou a ${atual.id}`).toBe(false)
      vistos.add(atual.id)
      const p = vizinhasNaOrdem(atual.id).proxima
      if (!p) break
      atual = p
      passos++
    }
    expect(vistos.size, 'percorrer a ordem não alcança todas as unidades').toBe(CATALOGO.length)
  })

  /**
   * ⚠️ A ABERTURA VEM ANTES DAS LIÇÕES DO CAPÍTULO. Ela é o limiar: aparecer
   * depois da lição 1 a transformaria num resumo do que já foi lido.
   */
  it('cada capítulo abre com a sua abertura', () => {
    for (const ato of [0, 1, 2, 3, 4]) {
      const abertura = ORDEM_DO_CURSO.find((u) => u.tipo === 'abertura' && u.ato === ato)
      expect(abertura, `o capítulo ${ato} ficou sem abertura`).toBeTruthy()
      const primeira = LICOES.find((l) => l.ato === ato)
      if (!primeira || !abertura) continue
      expect(
        posicaoNaOrdem(abertura.id)! < posicaoNaOrdem(primeira.id)!,
        `a abertura do capítulo ${ato} vem depois da primeira lição`,
      ).toBe(true)
    }
  })

  /**
   * ⚠️ ABERTURA NÃO É LIÇÃO. A trilha tem doze, e é essa contagem que a tela
   * mostra ("Lição 4 de 12") — cinco aberturas entrando na conta virariam
   * dezessete em silêncio.
   */
  it('as aberturas não entram na contagem de lições', () => {
    expect(LICOES.length, 'a contagem da trilha mudou').toBe(12)
    expect(LICOES.some((l) => l.tipo === 'abertura'), 'abertura virou lição').toBe(false)
  })

  /**
   * ⚠️ A TRILHA INTEIRA VEM ANTES DA BIBLIOTECA. Misturar verbete no meio das
   * lições faria o rodapé saltar de uma lição para um planeta e voltar — que é
   * a sensação de embaralhado que a correção veio desfazer.
   */
  it('a trilha inteira vem antes da biblioteca', () => {
    const ultimaLicao = Math.max(...LICOES.map((l) => posicaoNaOrdem(l.id)!))
    const primeiroVerbete = Math.min(
      ...CATALOGO.filter((u) => u.tipo === 'verbete').map((u) => posicaoNaOrdem(u.id)!),
    )
    expect(primeiroVerbete, 'verbete apareceu no meio da trilha').toBeGreaterThan(ultimaLicao)
  })
})
