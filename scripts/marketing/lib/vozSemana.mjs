/**
 * A leitura da semana, signo por signo.
 *
 * O carrossel dos doze é o formato que faz alguém salvar o post — a pessoa
 * precisa voltar para conferir o próprio. Só funciona se cada slide disser algo
 * DIFERENTE dos outros onze, e é aí que quase toda conta de astrologia entrega
 * a mesma frase doze vezes trocando o nome do signo.
 *
 * Aqui cada slide sai de uma conta: em casas inteiras, a casa que recebe o
 * evento é `((signo do evento − ascendente + 12) mod 12) + 1`, a mesma de
 * `src/astro/houses.math.ts:83`. Doze ascendentes, doze casas, doze textos
 * diferentes — sem nenhuma opinião no meio.
 *
 * Vale a voz de `lib/vozReel.mjs`: conversa direta, sem jargão, sem promessa.
 */
import { casaPorAscendente, ORDEM_SIGNOS } from './mensal.mjs'
import { escrever } from './vozes.mjs'

/**
 * O que cada casa é, em uma linha que alguém entenda de primeira.
 *
 * Sem "regência", sem "domicílio", sem "setor". Quem já sabe o jargão reconhece
 * assim mesmo; quem não sabe consegue acompanhar, que é o ponto.
 */
export const CASA = {
  1: 'você mesmo — o corpo, o jeito de chegar nos lugares',
  2: 'o dinheiro e o que você valoriza o bastante para guardar',
  3: 'as conversas do dia a dia, os irmãos, o perto',
  4: 'a casa, a família e o que te dá base',
  5: 'o que você cria, o que dá prazer, os filhos, o palco',
  6: 'a rotina, o trabalho de todo dia, o corpo funcionando',
  7: 'o outro — as relações a dois, os acordos',
  8: 'o que se divide com alguém: dinheiro junto, intimidade, o que termina',
  9: 'o estudo, a viagem, o que amplia a vista',
  10: 'a carreira e o que os outros veem de você',
  11: 'os grupos, as amizades, o projeto que é de mais gente',
  12: 'o que fica nos bastidores, o descanso, o que precisa acabar',
}

const DIA_DA_SEMANA = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado']

/** "na terça", "no sábado" — mais natural que "dia 11" numa peça semanal. */
function quando(data) {
  const emBrasilia = new Date(data.getTime() - 3 * 3_600_000)
  const nome = DIA_DA_SEMANA[emBrasilia.getUTCDay()]
  return nome === 'domingo' || nome === 'sábado' ? `no ${nome}` : `na ${nome}`
}

/** O que o evento é, em duas ou três palavras de conversa. */
function oQueE(ev) {
  switch (ev.tipo) {
    case 'ingresso': return `${ev.corpoPt} entra em ${ev.signo}`
    case 'eclipse': return `o eclipse ${ev.luminar === 'solar' ? 'do Sol' : 'da Lua'} em ${ev.signo}`
    case 'fase': return `a ${ev.fase.toLowerCase()} em ${ev.signo}`
    case 'retrogrado': return `${ev.corpoPt} começa a andar para trás`
    case 'direto': return `${ev.corpoPt} volta a andar para a frente`
    default: return escrever(ev).titulo
  }
}

/**
 * A leitura de um signo para a semana.
 *
 * O evento principal é o de maior peso da semana; os outros entram como linha
 * curta. A casa é sempre pelo ASCENDENTE, e a peça diz isso — em Placidus as
 * cúspides deslocam e a conta deixaria de ser exata.
 *
 * @returns {{signo, casa, texto, extras: string[]}|null}
 */
export function semanaPorSigno(eventos, ascendente) {
  if (!eventos.length) return null

  const porPeso = [...eventos].sort((a, b) => (b.peso || 0) - (a.peso || 0))
  const principal = porPeso[0]
  const casa = casaPorAscendente(principal.signo, ascendente)
  if (!casa) return null

  const texto =
    `${oQueE(principal)[0].toUpperCase()}${oQueE(principal).slice(1)} ${quando(principal.quando)}. ` +
    `Com ascendente em ${ascendente}, isso cai na sua casa ${casa} — ${CASA[casa]}.`

  // Os demais eventos viram uma linha cada: quem lê está procurando a própria
  // casa, e três parágrafos afastam do que veio ver.
  const extras = porPeso.slice(1, 3).map((e) => {
    const c = casaPorAscendente(e.signo, ascendente)
    if (!c) return null
    const linha = `${oQueE(e)} ${quando(e.quando)} → casa ${c}`
    return linha[0].toUpperCase() + linha.slice(1)
  }).filter(Boolean)

  return { signo: ascendente, casa, texto, extras }
}

/**
 * A capa: quantos eventos a semana tem e o que ela oferece.
 *
 * Sem "prepare-se", sem "semana poderosa". A capa diz o tamanho da semana e
 * convida a procurar o próprio signo, que é o motivo de o carrossel existir.
 */
export function capaDaSemana(eventos, inicio, fim) {
  const dm = (d) => new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric', month: 'long', timeZone: 'America/Sao_Paulo',
  }).format(d)

  const ultimo = new Date(fim.getTime() - 86_400_000)
  const periodo = `${dm(inicio)} a ${dm(ultimo)}`

  const eclipses = eventos.filter((e) => e.tipo === 'eclipse').length
  const abertura = eclipses
    ? `${eclipses === 1 ? 'Tem eclipse esta semana' : 'Dois eclipses esta semana'}.`
    : `${eventos.length} ${eventos.length === 1 ? 'evento' : 'eventos'} no céu esta semana.`

  return {
    periodo,
    texto: `${abertura} Arrasta e acha o seu ascendente — a casa é calculada, não é chute.`,
  }
}

export { ORDEM_SIGNOS }
