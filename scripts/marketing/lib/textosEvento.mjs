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
    'Durante cerca de um mês o Sol passa por Virgem, o signo ligado à ' +
    'organização, à saúde e ao trabalho bem-feito. É uma boa temporada para ' +
    'arrumar rotinas, cuidar do corpo e ajustar os detalhes que ficaram para ' +
    'trás. A ideia não é buscar perfeição, e sim fazer as coisas ' +
    'funcionarem. Vale ficar atento para o cuidado não virar excesso de ' +
    'autocrítica.',

  'ingresso:Mars:Câncer':
    'Por cerca de seis semanas Marte, o planeta da ação e da iniciativa, ' +
    'fica em Câncer. Aqui a energia para agir passa mais pelo lado emocional ' +
    'do que pela força direta: em vez de partir para cima, a gente age ' +
    'protegendo, cuidando e indo pelo caminho mais indireto. Marte não se ' +
    'sente muito à vontade em Câncer, então o período costuma render mais ' +
    'nas questões de casa e família do que nos embates de fora.',

  'ingresso:Venus:Escorpião':
    'Por cerca de quatro semanas Vênus, o planeta dos afetos e do prazer, ' +
    'fica em Escorpião. É uma fase em que os vínculos pedem mais ' +
    'profundidade: relações mais superficiais tendem a perder a graça, e ' +
    'cresce a vontade de intensidade e verdade no que se sente. Bom momento ' +
    'para se aproximar de quem importa de verdade. Vale lembrar que ' +
    'intensidade nem sempre é o mesmo que compatibilidade.',

  'ingresso:Mercury:Libra':
    'Por cerca de três semanas Mercúrio, o planeta da comunicação e do ' +
    'raciocínio, fica em Libra. As conversas tendem a ficar mais ' +
    'diplomáticas e ponderadas: a gente pesa os dois lados antes de decidir ' +
    'e escolhe melhor as palavras. É uma boa fase para negociar, fechar ' +
    'acordos e desfazer mal-entendidos. O cuidado é não adiar as decisões só ' +
    'para agradar todo mundo.',

  'fase:Lua Nova:Virgem':
    'A Lua Nova é o início do ciclo lunar, quando a Lua e o Sol se alinham ' +
    'no mesmo signo e o céu fica escuro. É o momento tradicional para plantar ' +
    'intenções e recomeçar. Esta cai em Virgem, então combina com começos ' +
    'práticos: uma rotina nova, um ajuste na saúde, um método que você quer ' +
    'testar de novo. São mudanças pequenas e concretas, e é justamente isso ' +
    'que costuma fazê-las durar.',

  'fase:Quarto Crescente:Escorpião':
    'O quarto crescente chega cerca de uma semana depois da Lua Nova, quando ' +
    'a Lua forma um ângulo de 90° com o Sol. É o momento do ciclo em que o ' +
    'que você começou pede esforço para continuar: costumam aparecer os ' +
    'primeiros obstáculos. Em Escorpião, eles tendem a ser mais internos do ' +
    'que externos, ligados ao que a gente evita olhar. Serve para ajustar o ' +
    'rumo com calma, não para desistir.',

  'retrogrado:Uranus:Gêmeos':
    'Urano entra em movimento retrógrado e fica assim por cerca de cinco ' +
    'meses. Retrógrado é uma ilusão de perspectiva: visto da Terra, o ' +
    'planeta parece andar para trás por um tempo. Urano tem a ver com ' +
    'mudanças e rupturas, então este é um período mais de rever do que de ' +
    'romper. Em vez de mudar tudo de uma vez, vale reavaliar o que foi feito ' +
    'por impulso. O que tem fundamento segue; o que foi só arroubo perde a ' +
    'força.',
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
