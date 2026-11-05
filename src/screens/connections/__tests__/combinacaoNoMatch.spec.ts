import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

/**
 * A COMBINAÇÃO APARECE NOS GRUPOS E NO MATCH — com UM componente só.
 *
 * ⚠️ O MESMO `CombinacaoDoCasal` NOS TRÊS LUGARES: modal do grupo, embutido no
 * card do membro e embutido no card do Match. A roda, o cálculo do vínculo, a
 * curva de 45 dias e os textos por área são o conteúdo inteiro dessa tela —
 * uma segunda versão "simplificada" divergiria no primeiro ajuste, e a
 * divergência seria invisível: duas telas mostrando a mesma combinação com
 * números diferentes.
 */
const LF = String.fromCharCode(10)
const limpar = (p: string) => readFileSync(p, 'utf8')
  .split(LF).filter((l) => !/^\s*(\/\/|\*|\/\*)/.test(l)).join(LF)

const DECK = limpar(join(__dirname, '..', 'DiscoverDeck.tsx'))
const GRUPOS = limpar(join(__dirname, '..', '..', 'groups', 'GroupsScreen.tsx'))
const COMB = limpar(join(__dirname, '..', '..', '..', 'components', 'CombinacaoDoCasal.tsx'))

describe('a combinação no Match e nos Grupos', () => {
  it('as duas telas usam o mesmo componente, embutido', () => {
    expect(DECK, 'o Match perdeu a combinação').toMatch(/<CombinacaoDoCasal\s+embutido/)
    expect(GRUPOS, 'o card do membro perdeu a combinação').toMatch(/<CombinacaoDoCasal\s+embutido/)
  })

  /**
   * ⚠️ O TOM SAI DE `synastryToneOf`, a mesma função do resto do app. Uma
   * tabela própria aqui faria esta tela chamar de tenso o que as outras
   * chamam de neutro — os aspectos menores duros já morderam o projeto assim.
   */
  it('o Match deriva o tom do aspecto da fonte única', () => {
    expect(DECK, 'o tom do aspecto virou tabela local')
      .toMatch(/tone: synastryToneOf\(nome\)/)
  })

  /** ⚠️ Embutido não pode abrir modal dentro de modal nem rolar dentro de rolagem. */
  it('embutido não renderiza a folha modal', () => {
    const trecho = COMB.slice(COMB.indexOf('const Folha = embutido'))
    const ate = trecho.slice(0, trecho.indexOf('const Rolagem'))
    expect(ate, 'o embutido voltaria a abrir um Modal').toMatch(/\? \(\{ children \}[^)]*\) => <View style=\{s\.embutido\}>/)
  })

  it('embutido não aninha rolagem', () => {
    const trecho = COMB.slice(COMB.indexOf('const Rolagem = embutido'))
    const ate = trecho.slice(0, trecho.indexOf('return ('))
    expect(ate, 'duas rolagens verticais aninhadas travam uma à outra no Android')
      .toMatch(/\? \(\{ children \}[^)]*\) => <>\{children\}<\/>/)
  })

  /**
   * ⚠️ O SELO DE COMBINAÇÃO NO RESUMO RESPEITA `shareSynastry`. Um número ali
   * para quem desligou o compartilhamento vazaria o que a pessoa fechou.
   */
  it('o selo no resumo respeita quem não compartilha', () => {
    const i = GRUPOS.indexOf('combinacaoSelo}')
    const antes = GRUPOS.slice(Math.max(0, i - 400), i)
    expect(antes, 'o selo apareceria para quem desligou a sinastria')
      .toMatch(/shareSynastry !== false/)
  })
})
