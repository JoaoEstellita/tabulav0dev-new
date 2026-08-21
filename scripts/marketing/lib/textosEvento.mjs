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

import { POR_SIGNO } from './textosEclipse.mjs'

/**
 * Chave: `{tipo}:{corpo}:{signo}`.
 *
 * Para fases, o corpo é a fase: `fase:Lua Nova:Virgem`.
 */
export const TEXTO_DO_EVENTO = {
  'ingresso:Sun:Virgem':
    'Depois de um verão de holofote, o céu baixa o tom. Por um mês o Sol ' +
    'atravessa Virgem, o signo do que funciona sem aparecer: rotina, saúde, ' +
    'o detalhe bem-feito. Boa hora de arrumar a casa por dentro, sem se ' +
    'cobrar a perfeição.',

  'ingresso:Mars:Câncer':
    'Nem toda força se mostra empurrando. Por seis semanas Marte, o planeta ' +
    'da ação, atravessa Câncer, onde agir é proteger, cuidar, ir pelo lado. ' +
    'A vontade não some, muda de rota, e costuma render mais dentro de casa ' +
    'do que na rua.',

  'ingresso:Venus:Escorpião':
    'O morno começa a incomodar sem motivo aparente. Por quatro semanas ' +
    'Vênus, o planeta dos afetos, passa por Escorpião, onde o gosto pede ' +
    'profundidade. Vínculo de superfície perde a graça, e a vontade vira de ' +
    'intensidade, de verdade, de tudo ou nada.',

  'ingresso:Mercury:Libra':
    'Às vezes a resposta certa é esperar antes de responder. Por três ' +
    'semanas Mercúrio, o planeta da conversa, fica em Libra, onde pensar é ' +
    'pesar os dois lados. Boa fase para negociar e desfazer mal-entendido, ' +
    'desde que decidir não vire adiar.',

  'fase:Lua Nova:Virgem':
    'Recomeçar é mais fácil quando ninguém está vendo, e o céu concorda. Na ' +
    'Lua Nova a Lua e o Sol se alinham e o céu fica escuro: é o zero do ' +
    'ciclo, a hora de plantar. Em Virgem o que se planta é miúdo e prático, ' +
    'uma rotina, um hábito, um ajuste, e é o miúdo que costuma pegar raiz.',

  'fase:Quarto Crescente:Escorpião':
    'Toda meta perde força por volta do sétimo dia, e isso é astronomia, não ' +
    'preguiça. Hoje a Lua faz 90° com o Sol, o quarto crescente: o ponto do ' +
    'ciclo em que o começo encontra a primeira resistência. Em Escorpião, ela ' +
    'vem de dentro, do que a gente evitou olhar na hora de decidir.',

  'retrogrado:Uranus:Gêmeos':
    'Nem todo planeta que parece voltar está voltando de verdade. Urano fica ' +
    'retrógrado por cinco meses: visto da Terra ele parece andar para trás, ' +
    'mas é ilusão de perspectiva. Como Urano mexe com mudança, é hora de ' +
    'rever o que se rompeu por impulso, não de romper mais.',
}

/** A chave deste evento, ou `null` quando o tipo não tem texto próprio. */
export function chaveDoEvento(evento) {
  // O eclipse não mora aqui: os 38 textos dele estão em `textosEclipse.mjs`,
  // escritos antes desta tabela existir. A chave serve para o aviso do console.
  if (evento.tipo === 'eclipse') return `eclipse:${evento.luminar}:${evento.signo}`
  if (evento.tipo === 'ingresso' && evento.corpo) return `ingresso:${evento.corpo}:${evento.signo}`
  if (evento.tipo === 'fase' && evento.fase) return `fase:${evento.fase}:${evento.signo}`
  if (evento.tipo === 'retrogrado' && evento.corpo) return `retrogrado:${evento.corpo}:${evento.signo}`
  if (evento.tipo === 'direto' && evento.corpo) return `direto:${evento.corpo}:${evento.signo}`
  // O aspecto de trânsito segue a mesma regra dos outros: só vira peça se
  // alguém escreveu o texto de TRÂNSITO aqui. Sem isso, `textoDoEvento` devolve
  // null e o assunto cai no educativo — em vez de usar o texto NATAL do app,
  // que descreve o mapa de quem nasce, não o céu de hoje.
  if (evento.tipo === 'aspecto' && evento.aspecto) {
    return `aspecto:${evento.aspecto.agente}:${evento.aspecto.aspecto}:${evento.aspecto.alvo}`
  }
  return null
}

/**
 * O texto deste evento, se houver um escrito.
 *
 * `null` é resposta legítima e frequente: significa que ninguém escreveu ainda,
 * e a peça não deveria sair sem que alguém escreva.
 */
export function textoDoEvento(evento) {
  /**
   * O eclipse tem leitura própria, por signo.
   *
   * Sem este desvio, `chaveDoEvento` devolvia `null` e a peça caía no catálogo
   * natal: o post do eclipse em Leão saiu dizendo "A identidade se manifesta
   * pela expressão criativa", que é o que significa ter o Sol em Leão no mapa.
   * O texto certo já estava escrito e nunca tinha sido ligado a uma peça.
   */
  if (evento.tipo === 'eclipse') return POR_SIGNO[evento.signo] || null

  const chave = chaveDoEvento(evento)
  return (chave && TEXTO_DO_EVENTO[chave]) || null
}
