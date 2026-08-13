import { describe, expect, it } from 'vitest'

import { CONCEITO } from '../textosConceito.mjs'
import { RECURSO } from '../textosRecurso.mjs'
import { LUA_VAZIA_POR_SIGNO, REGRA_DA_TRADICAO } from '../textosLuaVazia.mjs'
import { TEXTO_DO_EVENTO } from '../textosEvento.mjs'
import { POR_SIGNO, POR_CASA, ABERTURA } from '../textosEclipse.mjs'
import { CASA_EM_TRANSITO } from '../textosCasa.mjs'
import { TEMA } from '../temasDeCarrossel.mjs'

/**
 * LINGUAGEM CLARA E ACESSÍVEL.
 *
 * O João pediu junto com o carrossel da lua fora de curso, e o texto que ele
 * mandou mostra bem onde o problema mora: "último aspecto maior",
 * "incomunicável", "vazia de curso". Quem não estuda astrologia não sabe o que é
 * um aspecto maior, e a palavra sai sem prejuízo nenhum — "terminou de conversar
 * com os planetas daquele signo" diz o mesmo e não pede nota de rodapé.
 *
 * Este arquivo é a régua, aplicada a TODO o material escrito: 99 textos hoje.
 * Medido antes de escrever o teste, para saber o tamanho real do problema em vez
 * de supor: 4 continham termo técnico, e 3 deles eram conceitos que existem para
 * explicar justamente aquele termo.
 */

/** Termos que só fazem sentido para quem já estuda o assunto. */
const JARGAO = [
  /aspecto maior/i,
  /an[aá]r[eé]tico/i,
  /\borbe\b/i,
  /incomunic[aá]vel/i,
  /c[uú]spide/i,
  /dignidade essencial/i,
  /\bregência\b/i,
  /\bsextil\b/i, /\btrígono\b/i, /\bquadratura\b/i,
]

/**
 * O outro extremo, e afasta pelo motivo oposto.
 *
 * Jargão exclui quem não sabe; misticismo espanta quem desconfia. A conta vive
 * de dizer que o cálculo é real, e "portal de energia" desmonta isso sozinho.
 */
const MISTICO = [
  /\benergias? d[eo]\b/i,
  /vibra[çc][ãa]o/i,
  /\bportal\b/i,
  /alinhamento c[oó]smico/i,
  /\bmanifest(e|ar) seus desejos/i,
]

/**
 * Os conceitos podem nomear o termo que explicam.
 *
 * "O que é um orbe" precisa dizer "orbe" — a peça existe para ensinar a palavra.
 * A liberação é por texto, e só do termo que aquele texto define.
 */
const CONCEITO_EXPLICA = {
  orbe: /\borbe\b/i,
  dignidades: /domicílio|exílio/i,
  aspectos: /\bsextil\b|\btrígono\b|\bquadratura\b|conjunção|oposição/i,
  retrogrado: /retrógrad/i,
  nodulos: /nódulo/i,
}

/** Todo texto que chega a uma peça, com o nome da fonte para o erro ser útil. */
function todosOsTextos() {
  const saida = []
  const juntar = (fonte, lista) => {
    for (const [chave, texto] of lista) saida.push({ fonte, chave, texto })
  }

  juntar('conceito', Object.entries(CONCEITO).map(([k, v]) => [k, v.texto]))
  juntar('recurso', Object.entries(RECURSO).map(([k, v]) => [k, v.texto]))
  juntar('luaVazia', Object.entries(LUA_VAZIA_POR_SIGNO))
  juntar('evento', Object.entries(TEXTO_DO_EVENTO))
  juntar('eclipseSigno', Object.entries(POR_SIGNO))
  juntar('eclipseCasa', Object.entries(POR_CASA))
  juntar('eclipseAbertura', Object.entries(ABERTURA))
  juntar('casa', Object.entries(CASA_EM_TRANSITO))
  juntar('tradicao', [['regra', REGRA_DA_TRADICAO]])

  for (const [tema, t] of Object.entries(TEMA)) {
    for (const s of t.slides) saida.push({ fonte: `carrossel:${tema}`, chave: s.titulo.replace(/\n/g, ' '), texto: s.texto })
  }

  return saida
}

describe('linguagem clara', () => {
  const textos = todosOsTextos()

  it('há material para conferir', () => {
    expect(textos.length).toBeGreaterThan(90)
  })

  it('nenhum texto usa termo técnico sem ser para explicá-lo', () => {
    for (const { fonte, chave, texto } of textos) {
      const liberado = fonte === 'conceito' ? CONCEITO_EXPLICA[chave] : null
      for (const termo of JARGAO) {
        if (liberado && String(liberado) === String(termo)) continue
        if (liberado && liberado.test(texto) && termo.test(texto)) continue
        expect(termo.test(texto), `${fonte}/${chave}: ${texto.slice(0, 90)}`).toBe(false)
      }
    }
  })

  it('nenhum texto apela para misticismo', () => {
    for (const { fonte, chave, texto } of textos) {
      for (const termo of MISTICO) {
        expect(termo.test(texto), `${fonte}/${chave}: ${texto.slice(0, 90)}`).toBe(false)
      }
    }
  })

  /** Frase longa é onde a ideia se perde, e é o defeito mais comum. */
  it('as frases cabem numa respiração', () => {
    for (const { fonte, chave, texto } of textos) {
      const frases = texto.split(/(?<=[.!?])\s+/).filter((f) => f.trim().length > 1)
      for (const f of frases) {
        expect(f.length, `${fonte}/${chave}: "${f.slice(0, 70)}…"`).toBeLessThan(260)
      }
    }
  })

  it('e nenhum usa travessão', () => {
    for (const { fonte, chave, texto } of textos) {
      expect(texto.includes('—'), `${fonte}/${chave}`).toBe(false)
    }
  })
})

/**
 * O carrossel que o João escreveu, com o texto dele.
 *
 * Ele mandou o conteúdo pronto e pediu linguagem clara na mesma mensagem. O
 * conteúdo ficou; o vocabulário foi traduzido.
 */
describe('o carrossel da lua fora de curso', () => {
  const luaVazia = TEMA.luaVazia

  it('existe e tem começo, meio e fim', () => {
    expect(luaVazia.slides.length).toBeGreaterThanOrEqual(5)
    expect(luaVazia.ponte).toBeTruthy()
  })

  it('diz o que evitar e o que rende, que é o que ele pediu', () => {
    // minúsculas: "Cirurgia" abre frase, e o teste não é sobre ortografia
    const tudo = luaVazia.slides.map((s) => s.texto).join(' ').toLowerCase()
    for (const termo of ['contrato', 'cirurgia', 'rotina', 'descansar']) {
      expect(tudo, `falta "${termo}"`).toContain(termo)
    }
  })

  it('sem o vocabulário que o texto original trazia', () => {
    const tudo = luaVazia.slides.map((s) => s.texto).join(' ')
    expect(tudo).not.toMatch(/aspecto maior|incomunicável/i)
    // e sem a fala de chatbot que fechava o texto original
    expect(tudo).not.toMatch(/se quiser, posso|como prefere prosseguir/i)
  })
})
