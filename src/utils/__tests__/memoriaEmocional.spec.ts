import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import {
  baseDaPessoa, EMOCOES, DIAS_DE_MEMORIA, MIN_DIAS_DE_BASE, REFERENCIA_POR_ANEL,
  type DiaDeMemoria,
} from '../emocoesDoDia'

/**
 * A MEMÓRIA EMOCIONAL — o que transforma "54" em leitura.
 *
 * Um número de 0 a 100 não diz nada sozinho. A referência do anel já ajuda
 * ("45 é alto no Afeto, baixo no Entusiasmo"), mas o que a pessoa quer saber é
 * se hoje está alto PARA ELA. Isso exige histórico, que o backend passou a
 * guardar: um registro por dia dentro do próprio `userStatus`.
 *
 * ⚠️ O app só LÊ. Quem escreve é o backend (`avancarHistorico`), e escrever dos
 * dois lados daria duas versões do mesmo dia.
 */

const dia = (d: string, v: number[]): DiaDeMemoria => ({ d, v })
const serie = (n: number, valores: number[]): DiaDeMemoria[] =>
  Array.from({ length: n }, (_, i) => dia(`2026-10-${String(i + 1).padStart(2, '0')}`, valores))

describe('memória emocional', () => {
  /**
   * ⚠️ A GUARDA MAIS IMPORTANTE. Com dois ou três dias, "acima do seu normal"
   * não é leitura: é ruído com cara de descoberta — e a pessoa acredita, porque
   * o app afirmou. Abaixo do piso, a base não existe e a referência do anel
   * continua valendo.
   */
  it('memória curta não vira base', () => {
    for (let n = 0; n < MIN_DIAS_DE_BASE; n++) {
      expect(baseDaPessoa(serie(n, [40, 40, 40, 40, 40, 40, 40, 40])), `${n} dias não deveria dar base`).toBeNull()
    }
    expect(baseDaPessoa(serie(MIN_DIAS_DE_BASE, [40, 40, 40, 40, 40, 40, 40, 40])), 'no piso, a base existe').not.toBeNull()
    expect(baseDaPessoa(null)).toBeNull()
    expect(baseDaPessoa(undefined)).toBeNull()
    expect(baseDaPessoa([])).toBeNull()
  })

  it('a base traz as oito e diz de quantos dias veio', () => {
    const b = baseDaPessoa(serie(12, [10, 20, 30, 40, 50, 60, 70, 80]))!
    expect(b.dias).toBe(12)
    expect(Object.keys(b.referencia).sort()).toEqual([...EMOCOES].sort())
    // Série constante: a mediana é o próprio valor, na ordem de EMOCOES.
    EMOCOES.forEach((k, i) => expect(b.referencia[k], k).toBe((i + 1) * 10))
  })

  /**
   * ⚠️ MEDIANA, NÃO MÉDIA — e este teste existe porque a diferença importa no
   * caso real: um único dia extremo (uma conjunção exata de Plutão) puxaria a
   * média e a base passaria a chamar de "normal" um dia que não é.
   */
  it('um dia extremo não desloca a base', () => {
    const normais = serie(20, [30, 30, 30, 30, 30, 30, 30, 30])
    const comPico = [...normais, dia('2026-10-21', [100, 100, 100, 100, 100, 100, 100, 100])]
    const b = baseDaPessoa(comPico)!
    for (const k of EMOCOES) {
      expect(b.referencia[k], `${k} foi puxado pelo dia extremo`).toBe(30)
    }
    const media = (30 * 20 + 100) / 21
    expect(media, 'a média seria deslocada — é por isso que não se usa média').toBeGreaterThan(32)
  })

  /** Registro malformado é descartado, não quebra nem entra na conta. */
  it('dia malformado não entra na base', () => {
    const bons = serie(10, [20, 20, 20, 20, 20, 20, 20, 20])
    const sujo = [
      ...bons,
      { d: '2026-10-11', v: [1, 2] } as DiaDeMemoria,
      null as any,
      { d: '2026-10-12' } as any,
    ]
    const b = baseDaPessoa(sujo)!
    expect(b.dias, 'só os dias completos contam').toBe(10)
  })

  /**
   * ⚠️ O TETO É DE TAMANHO, não de estatística: o histórico mora dentro de
   * `userStatus`, que todo cron que toca status lê inteiro. Foi por peso assim
   * que o `porque` (uns 8 KB) ficou de fora do documento.
   */
  it('a memória cabe no documento', () => {
    const cheia = serie(DIAS_DE_MEMORIA, [21, 43, 32, 32, 37, 47, 48, 36])
    const bytes = JSON.stringify(cheia).length
    expect(bytes, `memória cheia ocupa ${bytes} bytes`).toBeLessThan(2500)
    expect(DIAS_DE_MEMORIA).toBeGreaterThanOrEqual(MIN_DIAS_DE_BASE * 2)
  })

  /**
   * A base pessoal SUBSTITUI a referência do anel quando existe — e as duas
   * têm de ter a mesma forma, senão a troca quebra na hora de usar.
   */
  it('a base pessoal tem a mesma forma da referência do anel', () => {
    const b = baseDaPessoa(serie(10, [21, 43, 32, 32, 37, 47, 48, 36]))!
    expect(Object.keys(b.referencia).sort()).toEqual(Object.keys(REFERENCIA_POR_ANEL).sort())
  })

  /**
   * ⚠️ PARIDADE com o gêmeo. O backend escreve a memória e o app a lê: se os
   * dois discordarem do tamanho da janela ou do piso, um grava trinta dias e o
   * outro espera outra coisa — sem erro, só leitura errada.
   */
  it('os limites são os mesmos no backend', () => {
    const JS = join(__dirname, '..', '..', '..', '..', 'backend', 'lib', 'status', 'emocoes-do-dia.js')
    if (!existsSync(JS)) {
      console.warn(`[memória] backend ausente em ${JS} — paridade NÃO verificada`)
      return
    }
    const fonte = readFileSync(JS, 'utf8')
    const num = (nome: string) => {
      const m = fonte.match(new RegExp(`const ${nome} = (\\d+)`))
      return m ? Number(m[1]) : null
    }
    expect(num('DIAS_DE_MEMORIA'), 'janela da memória divergiu').toBe(DIAS_DE_MEMORIA)
    expect(num('MIN_DIAS_DE_BASE'), 'piso da base divergiu').toBe(MIN_DIAS_DE_BASE)
  })
})
