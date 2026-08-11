/**
 * O texto de cada evento: o que muda AGORA, não o que a posição significa.
 *
 * O João olhou a peça do Sol em Virgem e o problema ficou claro: o texto vinha
 * do catálogo natal, que descreve o que é ter o Sol em Virgem no mapa de alguém.
 * Serve para qualquer pessoa e qualquer ano, e não diz nada sobre agosto de
 * 2026. O catálogo continua sendo a base boa; a peça precisa de outra coisa.
 *
 * ── O QUE UM TEXTO DE TRÂNSITO TEM ─────────────────────────────────────────
 *
 *   · o período, com começo e fim (um mês, seis semanas, três dias)
 *   · o que muda de tom nesse tempo
 *   · o que tende a acontecer, sem prever fato
 *   · o risco — onde a mesma força vira problema
 *
 * ── COMO ESTE ARQUIVO CRESCE ───────────────────────────────────────────────
 *
 * Um evento por vez, escrito na véspera e aprovado pelo João antes de publicar.
 * Não há ambição de cobrir as 120 combinações de planeta e signo: a maioria
 * nunca vai virar peça, e texto escrito para preencher tabela é exatamente o que
 * ele leu e chamou de genérico.
 *
 * Sem texto próprio, `gerarEvento.mjs` avisa no console e cai no catálogo natal.
 */

/**
 * Chave: `{tipo}:{corpo}:{signo}`.
 *
 * Para fases, o corpo é a fase: `fase:Lua Nova:Virgem`.
 */
export const TEXTO_DO_EVENTO = {
  'ingresso:Sun:Virgem':
    'Por um mês o Sol atravessa Virgem, e o que estava solto pede método. É o ' +
    'trecho do ano em que a régua aparece: o corpo cobra rotina, o trabalho ' +
    'cobra acabamento, e o que foi feito às pressas começa a mostrar as ' +
    'costuras. Virgem não pede perfeição, pede que funcione. O risco é ' +
    'confundir cuidado com autocrítica e transformar ajuste em julgamento.',

  'ingresso:Mars:Câncer':
    'Marte passa seis semanas em Câncer, e a vontade de agir deixa de andar em ' +
    'linha reta. O que se quer conquistar continua o mesmo, mas o caminho vira ' +
    'contorno: pede-se pelo lado, insiste-se pela memória, briga-se pelo que ' +
    'não foi dito. Marte não está confortável aqui, e é isso que faz o período ' +
    'render mais quando a energia vai para dentro de casa do que para fora.',

  'ingresso:Venus:Escorpião':
    'Vênus fica quatro semanas em Escorpião, e o gosto perde a paciência com o ' +
    'morno. O que agrada passa a exigir profundidade, e vínculos que viviam da ' +
    'superfície começam a incomodar sem motivo aparente. É período de descobrir ' +
    'o quanto se quer de alguém, e de descobrir isso pela falta. O risco é ' +
    'confundir intensidade com verdade.',

  'ingresso:Mercury:Libra':
    'Mercúrio passa três semanas em Libra, e o pensamento começa a pesar os dois ' +
    'lados antes de escolher um. Conversas ficam mais diplomáticas e mais lentas: ' +
    'o que se quer dizer passa por um filtro de "como isso soa". Bom para ' +
    'negociar e para desfazer mal-entendido. O risco é adiar a decisão em nome ' +
    'de um acordo que ninguém pediu.',

  'fase:Lua Nova:Virgem':
    'Toda Lua Nova é um começo sem garantia: o céu está escuro e ainda assim se ' +
    'planta. Esta cai em Virgem, então o que nasce aqui não é grande, é ' +
    'aplicado. Rotinas novas, ajustes de saúde, o método que se tenta pela ' +
    'décima vez. O que se decide agora costuma parecer pequeno demais para ' +
    'contar a alguém, e é justamente isso que faz durar.',

  'fase:Quarto Crescente:Escorpião':
    'O quarto crescente é o ponto do ciclo em que o que começou encontra ' +
    'resistência. Em Escorpião, a resistência não vem de fora: vem do que se ' +
    'evitou olhar quando a decisão foi tomada. Dias de desconforto útil, em que ' +
    'o custo real do que se quer aparece, e em que desistir e insistir pesam ' +
    'quase o mesmo.',

  'retrogrado:Uranus:Gêmeos':
    'Urano começa a andar para trás e fica assim por cinco meses. A vontade de ' +
    'mudar tudo não some, muda de direção: em vez de romper com o que está ' +
    'fora, o período pede rever o que se rompeu por impulso. Mudanças anunciadas ' +
    'em voz alta tendem a se recolher, e o que volta em silêncio é o que tinha ' +
    'fundamento.',
}

/** A chave deste evento, ou `null` quando o tipo não tem texto próprio. */
export function chaveDoEvento(evento) {
  if (evento.tipo === 'ingresso' && evento.corpo) return `ingresso:${evento.corpo}:${evento.signo}`
  if (evento.tipo === 'fase' && evento.fase) return `fase:${evento.fase}:${evento.signo}`
  if (evento.tipo === 'retrogrado' && evento.corpo) return `retrogrado:${evento.corpo}:${evento.signo}`
  if (evento.tipo === 'direto' && evento.corpo) return `direto:${evento.corpo}:${evento.signo}`
  return null
}

/**
 * O texto deste evento, se houver um escrito.
 *
 * `null` é resposta legítima e frequente: significa que ninguém escreveu ainda,
 * e a peça não deveria sair sem que alguém escreva.
 */
export function textoDoEvento(evento) {
  const chave = chaveDoEvento(evento)
  return (chave && TEXTO_DO_EVENTO[chave]) || null
}
