import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

/**
 * A TELA DE CONSENTIMENTO NÃO PODE APARECER PARA QUEM JÁ ATIVOU.
 *
 * ⚠️ DEFEITO RELATADO: "eu que já ativei o Match, sempre que acesso aparece a
 * tela de consentimento". Medido na conta dele: `discoveryProfiles/<uid>` tem
 * `matchActive: true` — a ativação ESTAVA gravada. O problema era a tela.
 *
 * `useSubscriptionCheck` começa com `isAdmin = false` e busca a assinatura por
 * rede. Sem esperar o `loading`, o primeiro render dava `gated = true` para
 * TODO MUNDO, e `gated` levava direto a `setMatchActive(false)` — a tela de
 * consentimento. Acontecia inclusive com ele, que é admin.
 *
 * ⚠️ E O `catch` FAZIA O MESMO: falha de rede virava "não ativou", pedindo
 * consentimento de novo a quem já tinha dado — e o aceite reescreveria um
 * perfil que já existe. É o mesmo padrão de erro-vira-estado-negativo que
 * este projeto já pagou caro em `useLifeAreas`.
 */
const LF = String.fromCharCode(10)
const FONTE = readFileSync(join(__dirname, '..', 'NetworkScreen.tsx'), 'utf8')
  .split(LF).filter((l) => !/^\s*(\/\/|\*|\/\*)/.test(l)).join(LF)

describe('o consentimento do Match', () => {
  it('espera a assinatura responder antes de decidir que não tem acesso', () => {
    expect(FONTE, '"ainda não sei" voltou a valer como "não tem acesso"')
      .toMatch(/const gated = !carregandoAssinatura &&/)
    expect(FONTE, 'a busca do perfil roda antes de a assinatura responder')
      .toMatch(/if \(carregandoAssinatura\) return/)
  })

  /** ⚠️ `null` é o estado de carregando da tela; `false` é o de não ativou. */
  it('falha de rede não vira "não ativou"', () => {
    const trecho = FONTE.slice(FONTE.indexOf('getMyProfile()'))
    const ate = trecho.slice(0, trecho.indexOf('}, ['))
    expect(ate, 'o catch voltou a afirmar que a pessoa não ativou')
      .not.toMatch(/catch\(\(\) => setMatchActive\(false\)\)/)
    expect(ate, 'o catch deixou de distinguir falha de recusa')
      .toMatch(/setMatchActive\(null\)/)
  })
})

/**
 * TODA CONEXÃO TEM SAÍDA — inclusive o pedido que você enviou.
 *
 * ⚠️ ERA O ÚNICO ESTADO SEM AÇÃO. Recusar um pedido recebido já existia
 * (`respondConnection(..., false)`) e desfazer uma conexão aceita também
 * (`removeConnection`) — mas o pedido ENVIADO só mostrava um relógio. Quem se
 * arrependia ficava aguardando para sempre uma resposta que não queria mais, e
 * a única saída era pedir para alguém apagar no banco.
 */
describe('sair de uma conexão', () => {
  it('o pedido enviado pode ser cancelado', () => {
    expect(FONTE, 'o pedido enviado voltou a ser um beco')
      .toMatch(/const cancelarEnviado = /)
    expect(FONTE, 'o botão de cancelar sumiu da lista de enviados')
      .toMatch(/onPress=\{\(\) => cancelarEnviado\(c\)\}/)
  })

  /**
   * ⚠️ CANCELAR É `remove`, NÃO `respond` com recusa. Recusar é ato de quem
   * RECEBEU: marcaria `declined` como se a outra pessoa tivesse dito não.
   */
  it('cancelar apaga o vínculo, não marca recusa', () => {
    const i = FONTE.indexOf('const cancelarEnviado')
    const corpo = FONTE.slice(i, FONTE.indexOf('const connMenu', i))
    expect(corpo, 'cancelar passou a registrar recusa da outra pessoa')
      .not.toMatch(/respondConnection/)
    expect(corpo, 'cancelar deixou de apagar o vínculo').toMatch(/removeConnection\(c\.other\)/)
  })

  /** ⚠️ Pede confirmação: a outra pessoa já recebeu o pedido. */
  it('cancelar pergunta antes', () => {
    const i = FONTE.indexOf('const cancelarEnviado')
    expect(FONTE.slice(i, i + 200), 'cancelou sem confirmar').toMatch(/Alert\.alert/)
  })

  /** As três saídas que a tela tem de oferecer, uma por estado. */
  it('recusar o recebido e desfazer o aceito continuam existindo', () => {
    expect(FONTE, 'recusar pedido recebido sumiu').toMatch(/respondConnection\(c\.other, false/)
    expect(FONTE, 'desfazer conexão aceita sumiu').toMatch(/const doRemove = /)
  })
})
