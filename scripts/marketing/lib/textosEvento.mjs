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

  // ── A LUA ENTRANDO EM CADA SIGNO ───────────────────────────────────────────
  // A Lua troca de signo a cada ~2 dias e meio, treze vezes por mês. É o clima
  // emocional do período, não o mapa de quem nasce com a Lua ali. Período +
  // virada de tom + uso + risco, curto porque a passagem é curta.
  'ingresso:Moon:Áries':
    'Por dois dias e meio o clima emocional acelera. A Lua passa por Áries e o ' +
    'sentir vira impulso: vontade de agir agora, pavio mais curto, coragem que ' +
    'vem fácil. É um bom tempo para começar o que estava parado e encarar o que ' +
    'vinha adiando. O risco é responder no calor da hora, porque o que se diz ' +
    'com raiva não costuma voltar atrás.',

  'ingresso:Moon:Touro':
    'Por dois dias e meio o humor desacelera e pede chão. A Lua em Touro puxa ' +
    'conforto, calma e corpo: comida boa, descanso, um tempo sem pressa e perto ' +
    'da natureza. O afeto quer estabilidade e presença, e gestos simples valem ' +
    'mais que promessas. O risco é a teimosia, insistir no que já não serve só ' +
    'para não ter de mudar.',

  'ingresso:Moon:Gêmeos':
    'Por dois dias e meio a cabeça fica agitada. A Lua em Gêmeos espalha a ' +
    'atenção: vontade de conversar, trocar mensagem, saber de tudo ao mesmo ' +
    'tempo. O emocional vira palavra, e falar sobre o que se sente já alivia ' +
    'metade. O risco é a dispersão, começar dez coisas e não terminar nenhuma ' +
    'por não escolher um foco.',

  'ingresso:Moon:Câncer':
    'Por dois dias e meio o sentir fica em casa. A Lua volta ao próprio signo, ' +
    'Câncer, e tudo pesa um pouco mais: memória, família, a vontade de recolher ' +
    'no ninho. É um bom tempo para cuidar de quem se ama e de si, baixar o ritmo ' +
    'e ouvir a intuição. O risco é levar tudo para o lado pessoal e remoer o que ' +
    'nem era com você.',

  'ingresso:Moon:Leão':
    'Por dois dias e meio o coração quer aparecer. A Lua em Leão pede calor, ' +
    'reconhecimento e um gesto generoso, vontade de brilhar e de fazer o outro ' +
    'brilhar junto. É um ótimo tempo para se expressar, criar e celebrar sem ' +
    'economizar o afeto. O risco é a mágoa quando ninguém repara, e o orgulho ' +
    'que cobra em silêncio o que não pediu em voz alta.',

  'ingresso:Moon:Virgem':
    'Por dois dias e meio a emoção vira organização. A Lua em Virgem acalma ' +
    'arrumando: rotina em ordem, listas, cuidar do corpo e resolver o detalhe ' +
    'que incomodava. Servir e ser útil faz bem, e a mente encontra paz quando ' +
    'as coisas ficam no lugar. O risco é a autocrítica, cobrar perfeição de si ' +
    'e dos outros até o cuidado virar peso.',

  'ingresso:Moon:Libra':
    'Por dois dias e meio o humor busca harmonia. A Lua em Libra pede beleza, ' +
    'companhia e paz nas relações, vontade de estar junto e de deixar o clima ' +
    'leve. É um bom tempo para reconciliar, combinar e resolver no diálogo o que ' +
    'ficou torto. O risco é adiar a própria vontade só para agradar, e fugir do ' +
    'conflito necessário em nome da paz.',

  'ingresso:Moon:Escorpião':
    'Por dois dias e meio o sentir mergulha fundo. A Lua em Escorpião ' +
    'intensifica tudo: nada de superfície, o que estava guardado sobe e pede ' +
    'para ser olhado de frente. É um bom tempo para verdade, intimidade e para ' +
    'encarar o que se evitava. O risco é o ciúme, a desconfiança e o hábito de ' +
    'remoer a mesma ferida sem soltar.',

  'ingresso:Moon:Sagitário':
    'Por dois dias e meio o ânimo quer respirar. A Lua em Sagitário puxa ' +
    'liberdade, humor e horizonte: vontade de sair, aprender algo novo, rir e ' +
    'ver a vida de longe. É um ótimo tempo para desanuviar, planejar uma escapada ' +
    'e recuperar o otimismo. O risco é prometer mais do que cabe e escapar do ' +
    'que incomoda em vez de resolver.',

  'ingresso:Moon:Capricórnio':
    'Por dois dias e meio a emoção fica contida. A Lua em Capricórnio pede ' +
    'responsabilidade, foco e controle: sentir com o pé no chão e cuidar do que ' +
    'é sério. É um bom tempo para assumir compromisso, organizar o futuro e ' +
    'fazer o que precisa ser feito. O risco é a frieza e a autocobrança, tratar ' +
    'o afeto como tarefa e esquecer de sentir.',

  'ingresso:Moon:Aquário':
    'Por dois dias e meio o sentir toma distância. A Lua em Aquário ' +
    'racionaliza: vontade de espaço, de grupo e de ideias mais que de abraço. É ' +
    'um bom tempo para ver as coisas de fora, pensar no coletivo e dar ar a quem ' +
    'estava sufocado. O risco é parecer indiferente justamente com quem ' +
    'precisava de você por perto naquele momento.',

  'ingresso:Moon:Peixes':
    'Por dois dias e meio tudo fica mais sensível. A Lua em Peixes dissolve as ' +
    'bordas: intuição em alta, sonho, empatia e também um cansaço que chega sem ' +
    'aviso. É um bom tempo para descansar, criar, rezar ou apenas sentir sem ' +
    'ter de explicar. O risco é absorver o que não é seu, confundir a dor do ' +
    'outro com a sua e se perder no nevoeiro.',

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
