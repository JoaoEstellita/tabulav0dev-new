import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { emocoesDoNatal, aspectosDoNatal, K_NATAL, EMOCOES, REFERENCIA_POR_ANEL } from '../emocoesDoDia'

/**
 * A TENDÊNCIA DO NATAL — e a paridade do gêmeo novo.
 *
 * ⚠️ O app calcula o natal por conta própria porque precisa: na aba Grupos o
 * mapa do membro é montado LOCALMENTE e nunca passou pelo status dele, que o
 * app nem poderia ler. Sem isto, a tendência natal existiria só para o dono da
 * conta.
 *
 * ⚠️ E gêmeo novo é risco novo. O que não pode divergir aqui é a CALIBRAÇÃO: se
 * o K_NATAL do app sair do K_NATAL do backend, o mesmo mapa dá números
 * diferentes no app e no agente — sem erro, só discordância.
 */

const mapa = (pares: Array<[string, number]>) => pares.map(([name, longitude]) => ({ name, longitude }))

describe('tendência emocional do natal', () => {
  it('detecta os aspectos nos DOIS sentidos', () => {
    const asp = aspectosDoNatal(mapa([['Sun', 0], ['Moon', 90], ['Venus', 120]]))
    expect(asp.length % 2, 'lista ímpar — algum aspecto entrou por um lado só').toBe(0)
    const solLua = asp.filter((x) => (x.t === 'Sun' && x.n === 'Moon') || (x.t === 'Moon' && x.n === 'Sun'))
    expect(solLua.length, 'Sol-Lua tem de entrar dos dois lados').toBe(2)
  })

  /**
   * ⚠️ No natal não há quem transita. Eleger um planeta como ator seria decidir
   * por ordem alfabética — e numa quadratura Sol-Lua o Sol duro empurra
   * Estresse enquanto a Lua dura empurra Ansiedade e Desânimo. Contar só um
   * lado apagaria metade da leitura, sem dar erro.
   */
  it('os dois planetas de um aspecto duro contribuem', () => {
    const r = emocoesDoNatal(mapa([['Sun', 0], ['Moon', 90]]))!
    expect(r, 'Sol quadratura Lua deveria produzir leitura').not.toBeNull()
    const estresse = r.find((e) => e.chave === 'estresse')!
    const ansiedade = r.find((e) => e.chave === 'ansiedade')!
    expect(estresse.valor, 'o Sol duro não entrou').toBeGreaterThan(0)
    expect(ansiedade.valor, 'a Lua dura não entrou').toBeGreaterThan(0)
  })

  it('sem aspectos devolve null, não oito zeros', () => {
    expect(emocoesDoNatal(mapa([['Sun', 0], ['Moon', 45]]))).toBeNull()
    expect(emocoesDoNatal([])).toBeNull()
    expect(emocoesDoNatal(null)).toBeNull()
  })

  it('o número vem com a explicação, como no modo do dia', () => {
    const r = emocoesDoNatal(mapa([['Sun', 0], ['Moon', 90], ['Venus', 120], ['Saturn', 180]]))!
    for (const e of r) {
      if (e.valor > 0) {
        expect(e.porque.length, `${e.chave}: valor ${e.valor} sem contribuição`).toBeGreaterThan(0)
      }
    }
  })

  /**
   * ⚠️ UM K ÚNICO NÃO SERVE, e esse é o ponto da tabela inteira. Medido em 53
   * mapas: com o K do dia (0,45) o Afeto natal daria 57 para a pessoa mediana,
   * contra 21 no dia. Se as oito chaves convergirem, a calibração se perdeu e
   * "hoje acima do seu mapa" volta a ser afirmação sobre a curva.
   */
  it('os K diferem entre si — é essa a calibração', () => {
    const ks = EMOCOES.map((k) => K_NATAL[k])
    expect(ks.every((x) => Number.isFinite(x) && x > 0)).toBe(true)
    expect(Math.max(...ks) / Math.min(...ks), `os K quase não diferem (${Math.min(...ks)}–${Math.max(...ks)})`).toBeGreaterThan(2)
  })

  /**
   * ⚠️ E a calibração tem de continuar REPRODUZINDO a referência do dia. Sem
   * esta checagem, mexer num peso de PESO_DURO desalinharia o natal em silêncio
   * e os dois números deixariam de ser comparáveis.
   */
  it('cada K reproduz a referência do dia do seu anel', () => {
    const fora: string[] = []
    for (const k of EMOCOES) {
      const alvo = REFERENCIA_POR_ANEL[k]
      const somaQueGerou = -Math.log(1 - alvo / 100) / K_NATAL[k]
      const volta = Math.round(100 * (1 - Math.exp(-K_NATAL[k] * somaQueGerou)))
      if (Math.abs(volta - alvo) > 1) fora.push(`${k}: ${volta} ≠ ${alvo}`)
    }
    expect(fora, fora.join('\n')).toEqual([])
  })

  /**
   * ⚠️ A TRAVA FORTE: os VALORES, não só a tabela.
   *
   * A calibração igual não garante que os dois lados calculem igual — o
   * algoritmo pode divergir (uma orbe tratada diferente, um planeta a mais na
   * lista). Aqui quatro mapas fixos passam pelo cálculo do app e são comparados
   * contra o que o backend produziu, congelado em arquivo.
   *
   * Quando mudar de propósito: regenere o arquivo pelo backend e confira o diff
   * antes de commitar. Se um valor mudou e você não esperava, o gêmeo divergiu.
   */
  it('os números batem com o backend, mapa por mapa', () => {
    const ESPERADO = join(__dirname, '..', '..', '..', '..', 'backend', 'tests', 'fixtures', 'emocoes-natal-esperado.json')
    if (!existsSync(ESPERADO)) {
      console.warn(`[natal] esperado ausente em ${ESPERADO} — paridade de VALORES não verificada`)
      return
    }
    const esperado = JSON.parse(readFileSync(ESPERADO, 'utf8'))
    const divergencias: string[] = []
    for (const m of esperado.mapas as Array<{ id: string; p: Array<[string, number]> }>) {
      const r = emocoesDoNatal(mapa(m.p))
      const esp = esperado.valores[m.id]
      if (esp === null || esp === undefined) {
        if (r !== null) divergencias.push(`${m.id}: app calculou, backend devolveu null`)
        continue
      }
      if (!r) { divergencias.push(`${m.id}: app devolveu null, backend calculou`); continue }
      const got = Object.fromEntries(r.map((e) => [e.chave, e.valor]))
      for (const k of EMOCOES) {
        if (got[k] !== esp[k]) divergencias.push(`${m.id}.${k}: app ${got[k]} ≠ backend ${esp[k]}`)
      }
    }
    expect(divergencias, divergencias.join(' · ')).toEqual([])
  })

  /**
   * ⚠️ `Number(null)` É 0, E 0 PASSA NO `isFinite` — a mordida que este projeto
   * já levou duas vezes.
   *
   * Em `scoreDeltaText` ela virava "ontem foi zero" para quem não tinha
   * histórico. Aqui ela virou pior: a Home mostrou "No seu mapa: 0" nos oito
   * anéis enquanto a aba Mapa exibia 45, 43, 34... no mesmo aparelho, ao mesmo
   * tempo. "Zero" é uma AFIRMAÇÃO sobre o mapa da pessoa, e era falsa.
   *
   * A guarda certa é `typeof x === 'number'` ANTES do isFinite. Este teste
   * trava a propriedade no cálculo: ele nunca devolve zero por ausência de
   * dado — devolve `null`.
   */
  it('ausência de dado vira null, nunca zero', () => {
    for (const vazio of [null, undefined, [], [{}], [{ name: 'Sun' }]]) {
      const r = emocoesDoNatal(vazio as any)
      expect(r, `entrada ${JSON.stringify(vazio)} deveria dar null, não uma leitura`).toBeNull()
    }
    // E a armadilha nua, para quem for mexer nisto depois:
    expect(Number(null)).toBe(0)
    expect(Number.isFinite(Number(null)), 'é por isso que Number(x) não serve de guarda').toBe(true)
    expect(typeof null === 'number', 'a guarda que serve').toBe(false)
  })

  it('a calibração é a mesma no backend', () => {
    const JS = join(__dirname, '..', '..', '..', '..', 'backend', 'lib', 'status', 'emocoes-do-dia.js')
    if (!existsSync(JS)) {
      console.warn(`[natal] backend ausente em ${JS} — paridade NÃO verificada`)
      return
    }
    const fonte = readFileSync(JS, 'utf8')
    const bloco = fonte.match(/const K_NATAL = \{([\s\S]*?)\};/)
    expect(bloco, 'K_NATAL sumiu do backend').not.toBeNull()
    const doBackend: Record<string, number> = {}
    for (const m of bloco![1].matchAll(/(\w+):\s*([\d.]+)/g)) doBackend[m[1]] = Number(m[2])
    expect(doBackend, 'a calibração do natal divergiu entre app e backend').toEqual({ ...K_NATAL })
    // E a orbe, que decide quantos aspectos entram na conta.
    const orbe = fonte.match(/const ORBE_NATAL = (\d+)/)
    expect(orbe?.[1], 'a orbe natal divergiu').toBe('6')
  })
})
