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
import { dignidade } from './interpretacao.mjs'
import { textoDaCasa } from './textosCasa.mjs'

const DIA_DA_SEMANA = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado']

/** "na terça", "no sábado" — mais natural que "dia 11" numa peça semanal. */
function quando(data) {
  const emBrasilia = new Date(data.getTime() - 3 * 3_600_000)
  const nome = DIA_DA_SEMANA[emBrasilia.getUTCDay()]
  return nome === 'domingo' || nome === 'sábado' ? `no ${nome}` : `na ${nome}`
}

/**
 * O artigo de cada fase.
 *
 * "A quarto minguante" saiu numa peça pronta: `a ${fase}` funcionava para Lua
 * Nova e Lua Cheia e errava nos dois quartos, que são masculinos.
 */
const ARTIGO_DA_FASE = {
  'Lua Nova': 'a', 'Lua Cheia': 'a',
  'Quarto Crescente': 'o', 'Quarto Minguante': 'o',
}

/** O que o evento é, em duas ou três palavras de conversa. */
function oQueE(ev) {
  switch (ev.tipo) {
    case 'ingresso': return `${ev.corpoPt} entra em ${ev.signo}`
    case 'eclipse': return `o eclipse ${ev.luminar === 'solar' ? 'do Sol' : 'da Lua'} em ${ev.signo}`
    case 'fase': return `${ARTIGO_DA_FASE[ev.fase] || 'a'} ${ev.fase.toLowerCase()} em ${ev.signo}`
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
export function semanaPorSigno(eventos, ascendente, catalogos = null) {
  if (!eventos.length) return null

  const porPeso = [...eventos].sort((a, b) => (b.peso || 0) - (a.peso || 0))
  const principal = porPeso[0]
  const casa = casaPorAscendente(principal.signo, ascendente)
  if (!casa) return null

  const corpoDoEvento = principal.corpo ||
    (principal.tipo === 'eclipse' || principal.tipo === 'fase'
      ? (principal.luminar === 'solar' || principal.fase === 'Lua Nova' ? 'Sun' : 'Moon')
      : null)

  /**
   * O texto é do TRÂNSITO na casa, não do planeta natal na casa.
   *
   * Aqui vinha o catálogo curado do app, e o slide saiu assim: "O quarto
   * minguante em Gêmeos na sexta, na sua casa 12. A Lua na Casa 12 internaliza
   * as emoções de forma profunda, criando uma vida interior rica". A segunda
   * frase descreve quem nasceu com a Lua ali, para a vida toda. A primeira fala
   * de uma sexta-feira. É o mesmo defeito que o João apontou na peça de evento,
   * e o catálogo continua ótimo no lugar dele, que é o app.
   */
  const dizer = oQueE(principal)
  const texto = `${dizer[0].toUpperCase()}${dizer.slice(1)} ${quando(principal.quando)}, ` +
    `na sua casa ${casa}.

${textoDaCasa(casa)}`

  /**
   * UMA PEÇA, UM EVENTO.
   *
   * Os outros eventos da semana saíam aqui como linhas soltas, e o resultado foi
   * o slide que o João leu: o corpo falava de Marte na casa 4 e o destaque, do
   * eclipse na casa 5. Dois assuntos no mesmo quadro não é resumo — é confusão.
   *
   * O que ocupa o destaque agora é a mesma coisa que o corpo: a casa que recebe
   * o evento, dita em uma linha, para quem só bate o olho.
   */
  const extras = []

  const dig = corpoDoEvento ? dignidade(corpoDoEvento, principal.signo) : null

  return { signo: ascendente, casa, texto, extras, dignidade: dig }
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

  /**
   * A capa diz O QUE acontece, não quantos eventos há.
   *
   * "1 evento no céu esta semana" foi o que saiu, e contagem não é assunto:
   * ninguém abre um post para saber que houve um. O nome do evento é a única
   * coisa da capa que faz alguém arrastar.
   */
  const principal = [...eventos].sort((a, b) => (b.peso || 0) - (a.peso || 0))[0]
  const dizer = oQueE(principal)
  const abertura = `${dizer[0].toUpperCase()}${dizer.slice(1)} ${quando(principal.quando)}.`

  /**
   * Nada sobre o método.
   *
   * A capa dizia "a casa é calculada, não é chute", e o João leu e disse o que
   * era: "esse tipo de frase mais confunde do que instrui". Defesa
   * metodológica só faz sentido para quem já desconfia de astrologia — quem
   * abriu o post não perguntou sobre chute, e a frase planta uma dúvida que não
   * existia. Mesmo defeito do "o céu é de todos, a casa é de cada um".
   *
   * O que a capa tem de fazer é dizer o que a peça entrega.
   */
  return {
    periodo,
    texto: `${abertura} Cada ascendente recebe numa parte diferente da vida. Arrasta e acha a sua.`,
  }
}

export { ORDEM_SIGNOS }
