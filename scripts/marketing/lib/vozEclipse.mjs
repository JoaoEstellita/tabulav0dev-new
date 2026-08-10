/**
 * O roteiro do vídeo de eclipse.
 *
 * Um assunto só, do começo ao fim. A peça anterior falava do eclipse, do grau,
 * da visibilidade do Brasil e ainda anunciava que Marte mudava de signo no dia
 * seguinte — quatro frases, três assuntos, e o João leu e disse: "tá tão fraco".
 *
 * A ordem foi escolhida pelo que a pesquisa de formato mostrou: quem não fisga
 * nos primeiros três segundos perde a distribuição.
 *
 * O primeiro gancho que escrevi era o ciclo Saros — "este eclipse já aconteceu
 * antes, o anterior foi em agosto de 2008". O João leu e disse que não achava
 * relevante: "série 126" é jargão, e pensar em 2008 adia o que a pessoa veio
 * saber. Saiu de vez, do vídeo e da legenda.
 *
 *   1  o gancho      data, signo, e a pergunta que ela responde sozinha
 *   2  o título      que eclipse é este, e quando
 *   3  a leitura     o que este eclipse é, e o que ele cobra
 *   4  os doze       um bloco por signo, com a casa de cada um
 *   5  o fecho       salvar, comentar o ascendente
 *
 * O corte de 60 segundos usa 1, 2, 3 e 5 — sem os doze. Serve para alcance:
 * quem chega novo não vai assistir três minutos, e quem já segue vai.
 */
import { ABERTURA, POR_SIGNO, POR_CASA, FECHO, PROVOCACAO } from './textosEclipse.mjs'
import { casaPorAscendente, ORDEM_SIGNOS } from './mensal.mjs'
import { dignidade } from './interpretacao.mjs'

/** "Hoje", "Amanhã" ou "Dia 12" — o que estiver certo no dia da publicação. */
function quandoRelativo(evento) {
  const falta = evento.diasFalta ?? 0
  if (falta === 0) return 'Hoje'
  if (falta === 1) return 'Amanhã'
  const dia = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', timeZone: 'America/Sao_Paulo' })
    .format(evento.quando)
  return `Dia ${dia}`
}

const diaMes = (d) =>
  new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric', month: 'long', timeZone: 'America/Sao_Paulo',
  }).format(d)

/**
 * O roteiro completo, em capítulos.
 *
 * @param {object} evento  o eclipse, de `eventosDoDia`
 * @param {'curto'|'completo'} formato
 * @returns {{capitulos: {tipo, olho, texto, signo?}[], titulo, legenda}}
 */
export function roteiroDoEclipse(evento, formato = 'completo') {
  const solar = evento.luminar === 'solar'
  const titulo = `Eclipse ${solar ? 'solar' : 'lunar'} em ${evento.signo}`
  const quando = diaMes(evento.quando)

  const capitulos = []

  /**
   * 1. O GANCHO — três quadros, os que decidem se alguém fica.
   *
   * Data e signo no primeiro; o que aquele signo não tolera no segundo; e uma
   * pergunta sobre a vida de quem assiste no terceiro. Nada de explicar o que é
   * um eclipse antes de dar motivo para ficar.
   */
  const prov = PROVOCACAO[evento.signo]
  capitulos.push({ tipo: 'gancho', olho: '', texto: `${quandoRelativo(evento)} tem eclipse em ${evento.signo}.` })
  if (prov) {
    capitulos.push({ tipo: 'gancho', olho: '', texto: prov.corte })
    capitulos.push({ tipo: 'gancho', olho: '', texto: prov.pergunta })
  }

  // 2. O TÍTULO — só agora, quando já há motivo para ficar
  capitulos.push({ tipo: 'titulo', olho: quando, texto: titulo })

  // 3. A LEITURA — o que este eclipse é, e o que ele cobra
  capitulos.push({ tipo: 'leitura', olho: 'o que é', texto: ABERTURA[solar ? 'solar' : 'lunar'] })

  const doSigno = POR_SIGNO[evento.signo]
  if (doSigno) capitulos.push({ tipo: 'leitura', olho: evento.signo, texto: doSigno })

  // A dignidade quando ela dobra a aposta: eclipse solar em Leão tem o Sol
  // eclipsado E regente do signo. É o tipo de coisa que só quem calcula percebe.
  const corpo = solar ? 'Sun' : 'Moon'
  const dig = dignidade(corpo, evento.signo)
  if (dig?.tipo === 'domicilio') {
    capitulos.push({
      tipo: 'leitura',
      olho: 'e mais',
      texto: `${solar ? 'O Sol' : 'A Lua'} rege ${evento.signo}. Num eclipse aqui, ` +
        `quem apaga e quem governa são o mesmo, e é por isso que este pesa mais ` +
        `que um eclipse comum.`,
    })
  }

  // 4. OS DOZE — só no corte completo
  if (formato === 'completo') {
    for (const ascendente of ORDEM_SIGNOS) {
      const casa = casaPorAscendente(evento.signo, ascendente)
      const texto = POR_CASA[casa]
      if (!casa || !texto) continue
      capitulos.push({
        tipo: 'signo',
        olho: `ascendente em ${ascendente}`,
        signo: ascendente,
        casa,
        texto,
      })
    }
  }

  // 5. O FECHO
  capitulos.push({ tipo: 'fecho', olho: '', texto: FECHO.salvar })
  capitulos.push({ tipo: 'fecho', olho: '', texto: FECHO.comentar })

  return { capitulos, titulo, legenda: legendaDoPost(evento) }
}

/** A legenda do post, com as doze casas e o convite. */
function legendaDoPost(evento) {
  const solar = evento.luminar === 'solar'
  const linhas = [
    `Eclipse ${solar ? 'solar' : 'lunar'} em ${evento.signo} · ${diaMes(evento.quando)}`,
    '',
  ]

  const prov = PROVOCACAO[evento.signo]
  if (prov) linhas.push(`${prov.corte} ${prov.pergunta}`, '')

  linhas.push(ABERTURA[solar ? 'solar' : 'lunar'], '')
  if (POR_SIGNO[evento.signo]) linhas.push(POR_SIGNO[evento.signo], '')

  // Na legenda cabem as doze, mesmo no corte curto: é aqui que a pessoa procura
  // a própria casa depois de assistir.
  linhas.push('Onde isso cai, pelo seu ascendente:')
  for (const ascendente of ORDEM_SIGNOS) {
    const casa = casaPorAscendente(evento.signo, ascendente)
    if (casa) linhas.push(`${ascendente} → casa ${casa}`)
  }

  linhas.push('', FECHO.salvar, FECHO.comentar, FECHO.link)
  return linhas.join('\n')
}

/**
 * Quanto tempo cada capítulo fica na tela.
 *
 * Proporcional ao tamanho, com piso — os textos de casa têm 250 a 320
 * caracteres e ninguém lê isso em dois segundos. O gancho é a exceção: frase
 * curta que precisa de tempo, porque é ela que decide se a pessoa fica.
 */
export function tempoDosCapitulos(capitulos, segundos) {
  const PISO = { gancho: 2.6, titulo: 2.4, leitura: 4.5, signo: 4.5, fecho: 3 }

  const pesos = capitulos.map((c) => {
    const palavras = String(c.texto).split(/\s+/).length
    // ~3 palavras por segundo é a velocidade de leitura de legenda queimada
    return Math.max(PISO[c.tipo] || 3, palavras / 3)
  })

  const soma = pesos.reduce((a, b) => a + b, 0)
  const escala = segundos / soma

  let cursor = 0
  return capitulos.map((c, i) => {
    const dura = pesos[i] * escala
    const bloco = { ...c, de: cursor / segundos, ate: (cursor + dura) / segundos, segundos: dura }
    cursor += dura
    return bloco
  })
}
