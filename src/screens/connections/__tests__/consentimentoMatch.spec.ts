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
