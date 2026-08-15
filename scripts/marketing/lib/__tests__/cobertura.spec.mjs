import { describe, expect, it } from 'vitest'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { lerLiterais } from '../catalogo.mjs'
import { aspectosDoCeu, mapaDoCeu } from '../ceu.mjs'
import { chaveAspectoNatal } from '../educativo.mjs'
import { ASPECTO_NATAL } from '../textosAspecto.mjs'
import { POSICAO } from '../textosPosicao.mjs'

/**
 * A PEÇA NUNCA DEVE CAIR NO CATÁLOGO DO APP.
 *
 * ── O QUE ESTE ARQUIVO GUARDA ──────────────────────────────────────────────
 *
 * O João publicou as primeiras peças, reescrevi 99 textos, e no dia seguinte a
 * peça saiu com o mesmo defeito. O motivo não era a escrita: `pecaDoAssunto`
 * resolve planeta-em-signo e aspecto puxando do catálogo natal do APP, e a
 * reescrita passou ao largo desses dois caminhos. Saiu "A energia de ação está
 * profundamente conectada ao estado emocional do momento presente" — texto do
 * produto, correto lá dentro e fora de lugar numa peça.
 *
 * O catálogo do app continua sendo o fallback, e isso é proposital: peça sem
 * texto seria pior. Mas o fallback tem de ser exceção, e sem teste ninguém
 * descobre que ele virou regra — descobre-se olhando um post publicado, que foi
 * exatamente como isto foi descoberto.
 *
 * ── COMO ELE MEDE ──────────────────────────────────────────────────────────
 *
 * Varre a efeméride de um ano e junta tudo que a cascata pode escolher. Se o
 * céu trouxer uma posição ou um ângulo sem texto próprio, o teste falha e diz
 * qual falta. É o mesmo cálculo que produziu as listas de 17 e de 100.
 */

const FRONTEND = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..')

const { PLANET_ASPECT_ORBS: ORBES } = await lerLiterais(
  path.join(FRONTEND, 'src/astro/aspect-config.ts'), ['PLANET_ASPECT_ORBS']
)

/** Um ano a partir do dia em que isto foi escrito. */
const DIAS = 365
const PRIMEIRO = Date.UTC(2026, 7, 15, 12)
const diaN = (n) => new Date(PRIMEIRO + n * 86_400_000)

/** As mesmas listas de `educativo.mjs` e `assuntoDoDia.mjs`. */
const PLANETAS_DE_SIGNO = ['Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn']
const PESSOAIS_NO_ASPECTO = ['Sun', 'Mercury', 'Venus', 'Mars']

describe('nenhuma peça cai no catálogo do app', () => {
  it('toda posição que o céu traz em um ano tem texto próprio', () => {
    const faltam = new Set()
    for (let n = 0; n < DIAS; n++) {
      for (const c of mapaDoCeu(diaN(n), ORBES).corpos) {
        if (!PLANETAS_DE_SIGNO.includes(c.nome)) continue
        const chave = `${c.nome}|${c.signo}`
        if (!POSICAO[chave]) faltam.add(chave)
      }
    }
    expect([...faltam].join(', ')).toBe('')
  })

  /**
   * A Lua fica de fora, e é decisão de produto, não esquecimento.
   *
   * Ela fecha e desfaz ângulo com tudo em algumas horas, então a âncora "Lua e
   * Saturno estão nesse ângulo hoje" vale por uma tarde. `assuntoDoDia` a exclui
   * em `NAO_ENCABECA_ASPECTO`; se essa exclusão cair, este teste passa a cobrar
   * 44 textos que não existem, e é assim que se descobre.
   */
  it('todo aspecto que a cascata pode escolher em um ano tem texto próprio', () => {
    const faltam = new Set()
    for (let n = 0; n < DIAS; n++) {
      for (const a of aspectosDoCeu(diaN(n), ORBES)) {
        if (a.agente === 'Moon' || a.alvo === 'Moon') continue
        if (!PESSOAIS_NO_ASPECTO.includes(a.agente) && !PESSOAIS_NO_ASPECTO.includes(a.alvo)) continue
        const chave = chaveAspectoNatal(a.agente, a.alvo, a.aspecto)
        if (!ASPECTO_NATAL[chave]) faltam.add(chave)
      }
    }
    expect([...faltam].join(', ')).toBe('')
  })
})
