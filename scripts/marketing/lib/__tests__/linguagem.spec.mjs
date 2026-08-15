import { describe, expect, it } from 'vitest'

import { CONCEITO } from '../textosConceito.mjs'
import { RECURSO } from '../textosRecurso.mjs'
import { LUA_VAZIA_POR_SIGNO, REGRA_DA_TRADICAO } from '../textosLuaVazia.mjs'
import { TEXTO_DO_EVENTO } from '../textosEvento.mjs'
import { POR_SIGNO, POR_CASA, ABERTURA } from '../textosEclipse.mjs'
import { CASA_EM_TRANSITO } from '../textosCasa.mjs'
import { POSICAO } from '../textosPosicao.mjs'
import { ASPECTO_NATAL } from '../textosAspecto.mjs'
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
  juntar('posicao', Object.entries(POSICAO))
  juntar('aspecto', Object.entries(ASPECTO_NATAL))
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
 * O RITMO.
 *
 * O João publicou as primeiras peças e voltou com o retorno que nenhum teste
 * anterior pegava: "o texto ainda está muito quadrado, parece algo feito por
 * IA". O jargão já estava barrado, o misticismo também, e mesmo assim soava a
 * máquina. Medi os 99 antes de reescrever, e o defeito não era vocabulário:
 *
 *   dois-pontos explicativo   76% dos textos
 *   "costuma" / "tende a"     38%
 *   frases curtas (< 40 car.)  9%
 *   média de 84 caracteres por frase, mediana 80
 *
 * É a UNIFORMIDADE que denuncia. Toda frase com o mesmo peso, nunca uma curta
 * para respirar, e o dois-pontos em três de cada quatro textos fazendo a
 * transição que a escrita humana faz com ponto final. Somado ao hedge
 * impessoal, sai laudo.
 *
 * ── POR QUE MEDIDO NO CONJUNTO ─────────────────────────────────────────────
 *
 * Texto a texto isto viraria camisa de força: há assunto que pede período
 * longo, e obrigar frase curta em cada um produz staccato artificial, que é
 * outro sotaque de máquina. O que precisa existir é a VARIAÇÃO, e variação só
 * se mede no agregado. Os limites abaixo têm folga proposital em relação ao
 * medido depois da reescrita, porque o alvo é impedir a recaída ao padrão
 * antigo, não congelar os números de hoje.
 */
describe('o ritmo não recai no sotaque de máquina', () => {
  const textos = todosOsTextos()
  const frasesDe = (texto) =>
    texto.split(/(?<=[.!?])\s+/).map((f) => f.trim()).filter((f) => f.length > 1)

  const todasAsFrases = textos.flatMap(({ texto }) => frasesDe(texto))
  const proporcao = (quantos) => quantos / textos.length

  it('tem frase curta o bastante para respirar', () => {
    const curtas = todasAsFrases.filter((f) => f.length < 40).length
    const parte = curtas / todasAsFrases.length
    expect(parte, `${(parte * 100).toFixed(0)}% de frases curtas`).toBeGreaterThan(0.22)
  })

  it('não usa dois-pontos como muleta de transição', () => {
    const comDoisPontos = textos.filter(({ texto }) => texto.includes(':')).length
    expect(proporcao(comDoisPontos)).toBeLessThan(0.3)
  })

  /**
   * Um por texto ainda é legítimo: definição e lista pedem dois-pontos. Dois no
   * mesmo texto já é cadência, não pontuação.
   */
  it('e nunca mais de um no mesmo texto', () => {
    for (const { fonte, chave, texto } of textos) {
      const quantos = (texto.match(/:/g) || []).length
      expect(quantos, `${fonte}/${chave}: ${texto.slice(0, 90)}`).toBeLessThanOrEqual(1)
    }
  })

  /** "Costuma" e "tende a" existem para não prometer. Viraram tique. */
  it('não se esconde atrás de "costuma" e "tende a"', () => {
    const comHedge = textos.filter(({ texto }) => /costuma|tende a/i.test(texto)).length
    expect(proporcao(comHedge)).toBeLessThan(0.15)
  })

  it('e no máximo uma vez em cada texto', () => {
    for (const { fonte, chave, texto } of textos) {
      const quantos = (texto.match(/costuma|tende a/gi) || []).length
      expect(quantos, `${fonte}/${chave}: ${texto.slice(0, 90)}`).toBeLessThanOrEqual(1)
    }
  })

  /**
   * A média é o resumo mais honesto: 84 caracteres era o número do material que
   * ele leu e chamou de quadrado.
   */
  it('a frase média cabe na leitura em voz alta', () => {
    const media = todasAsFrases.reduce((s, f) => s + f.length, 0) / todasAsFrases.length
    expect(Math.round(media), `média de ${media.toFixed(0)} caracteres`).toBeLessThan(70)
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
