/**
 * A voz do Tábula Estelar nas peças públicas.
 *
 * O catálogo do app não serve aqui: foi escrito para mapa natal, fala "você" e
 * pressupõe casa. Num post público isso afirma coisas que não valem para quem
 * está vendo, e são 315 caracteres onde cabem duas linhas.
 *
 * Escrever 120 textos de ingresso (10 planetas × 12 signos) seria trabalho morto
 * e envelheceria mal. O léxico abaixo é combinatório: cada planeta tem um tema,
 * cada signo tem um modo, e a frase nasce do encontro dos dois.
 *
 * REGRAS, valendo para título, texto e legenda:
 *   1. Frase curta. Se cabe em uma linha, não usa duas.
 *   2. O dado primeiro: "Vênus entra em Libra, 19h08" antes de qualquer leitura.
 *   3. Sem segunda pessoa. A peça descreve o céu, não a pessoa que lê.
 *   4. Sem misticismo e sem promessa: nada de "energia poderosa", "prepare-se".
 *   5. Admite o limite: o céu é de todos, a casa é de cada um.
 */

/** O que cada corpo rege, em uma expressão que sirva de sujeito. */
export const TEMA_PLANETA = {
  Sun: 'o centro e o propósito',
  Moon: 'o humor e a necessidade',
  Mercury: 'a conversa e o raciocínio',
  Venus: 'o que se valoriza e o que atrai',
  Mars: 'a vontade e o impulso',
  Jupiter: 'a expansão e o sentido',
  Saturn: 'o limite e a estrutura',
  Uranus: 'a ruptura e o inesperado',
  Neptune: 'o sonho e a diluição',
  Pluto: 'o poder e a transformação',
}

/** Como cada signo modula o que passa por ele, em predicado. */
export const MODO_SIGNO = {
  'Áries': 'ganha pressa e quer começar',
  'Touro': 'desacelera e pede permanência',
  'Gêmeos': 'se divide e quer nomear',
  'Câncer': 'recua para dentro e busca abrigo',
  'Leão': 'quer ser visto e assumir o centro',
  'Virgem': 'se refina e quer ser útil',
  'Libra': 'passa a pedir reciprocidade',
  'Escorpião': 'aprofunda e não aceita superfície',
  'Sagitário': 'abre horizonte e quer sentido',
  'Capricórnio': 'endurece e cobra resultado',
  'Aquário': 'se distancia para enxergar o todo',
  'Peixes': 'perde contorno e se mistura',
}

/** O que uma retrogradação costuma pedir, por corpo. */
const RETRO_PLANETA = {
  Mercury: 'Revisão, releitura, conversa que volta.',
  Venus: 'Vínculos e valores voltam à mesa.',
  Mars: 'A ação perde tração; empurrar cansa mais.',
  Jupiter: 'A expansão vira exame do que já se tem.',
  Saturn: 'A estrutura é testada por dentro.',
  Uranus: 'A ruptura se recolhe e amadurece.',
  Neptune: 'O que era névoa começa a se nomear.',
  Pluto: 'O poder se volta para dentro.',
}

const FASE_SENTIDO = {
  'Lua Nova': 'Começo de ciclo.',
  'Quarto Crescente': 'Meio do caminho: o que cresce encontra resistência.',
  'Lua Cheia': 'Ponto de maior luz. O que estava em curso aparece.',
  'Quarto Minguante': 'Hora de soltar o que não segue adiante.',
}

const NOME_ASPECTO = {
  conjuncao: 'se juntam',
  sextil: 'se ajudam',
  quadratura: 'se atritam',
  trigono: 'fluem juntos',
  oposicao: 'se opõem',
}

/** Hora local de Brasília, que é o público da conta. */
function hora(data) {
  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo',
  }).format(data)
}

function dia(data) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric', month: 'long', timeZone: 'America/Sao_Paulo',
  }).format(data)
}

/**
 * Título e corpo de um evento, na voz da casa.
 *
 * @returns {{titulo: string, texto: string, dado: string}}
 */
export function escrever(evento) {
  switch (evento.tipo) {
    case 'ingresso': {
      const tema = TEMA_PLANETA[evento.corpo] || 'o que esse corpo rege'
      const modo = MODO_SIGNO[evento.signo] || 'muda de tom'
      return {
        titulo: `${evento.corpoPt} entra em ${evento.signo}`,
        texto: `${tema[0].toUpperCase()}${tema.slice(1)} ${modo}.`,
        dado: `${dia(evento.quando)}, ${hora(evento.quando)}`,
      }
    }

    case 'retrogrado':
      return {
        titulo: `${evento.corpoPt} fica retrógrado`,
        texto: RETRO_PLANETA[evento.corpo] || 'O movimento se volta para trás.',
        dado: `${dia(evento.quando)} · ${evento.grau}° de ${evento.signo}`,
      }

    case 'direto':
      return {
        titulo: `${evento.corpoPt} volta a andar direto`,
        texto: 'O que estava em revisão volta a seguir adiante.',
        dado: `${dia(evento.quando)} · ${evento.grau}° de ${evento.signo}`,
      }

    case 'fase':
      return {
        titulo: `${evento.fase} em ${evento.signo}`,
        texto: FASE_SENTIDO[evento.fase] || '',
        dado: `${dia(evento.quando)}, ${hora(evento.quando)} · ${evento.grau}°`,
      }

    case 'lua_fora_de_curso': {
      // quando o período atravessa a meia-noite, só a hora engana
      const mesmoDia = dia(evento.inicio) === dia(evento.fim)
      const janela = mesmoDia
        ? `${hora(evento.inicio)} às ${hora(evento.fim)}`
        : `${dia(evento.inicio)} ${hora(evento.inicio)} até ${dia(evento.fim)} ${hora(evento.fim)}`
      return {
        titulo: 'Lua fora de curso',
        texto: `A Lua já fez seu último aspecto em ${evento.signo} e caminha sozinha até ${evento.proximoSigno}. Tradição antiga: começo feito aqui tende a não vingar.`,
        dado: `${janela} · ${evento.horas}h`,
      }
    }

    case 'aspecto': {
      const a = evento.aspecto
      return {
        titulo: `${a.agentePt} e ${a.alvoPt} ${NOME_ASPECTO[a.aspecto] || 'se encontram'}`,
        texto: `${a.aspectoRotulo} exata: ${a.agentePt} a ${a.agentePos?.rotulo || ''}, ${a.alvoPt} a ${a.alvoPos?.rotulo || ''}.`,
        dado: `orbe ${a.orbeFormatado}`,
      }
    }

    default:
      return { titulo: '', texto: '', dado: '' }
  }
}

/** Uma linha só, para os eventos secundários da peça. */
export function escreverCurto(evento) {
  const e = escrever(evento)
  return `${e.titulo} · ${e.dado}`
}

/**
 * Legenda do post.
 *
 * Abre pelo fato, explica em uma linha, separa o que é céu do que é casa e
 * convida. Sem segunda pessoa até o convite, que é onde ela cabe.
 */
export function montarLegenda(principal, secundarios = []) {
  const p = escrever(principal)
  const linhas = [`${p.titulo}. ${p.dado}.`, '', p.texto]

  if (secundarios.length) {
    linhas.push('', 'Também hoje:')
    for (const s of secundarios) linhas.push(`· ${escreverCurto(s)}`)
  }

  linhas.push(
    '',
    'Isso é o céu, e vale para todo mundo igual. O que muda de pessoa para pessoa é a casa em que isso cai, e a casa depende da hora e do lugar do nascimento.',
    '',
    'Manda uma mensagem no WhatsApp e recebe seu mapa calculado, de graça: link na bio. 🌘',
    '',
    '#astrologia #mapanatal #transitos #astrologiareal #efemerides #astrologiabrasil'
  )

  return linhas.join('\n')
}
