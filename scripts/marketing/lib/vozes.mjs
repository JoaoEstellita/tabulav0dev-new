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

/**
 * Como cada signo modula o que passa por ele, em predicado.
 *
 * No PLURAL: todo tema de planeta acima é sujeito composto — "a conversa e o
 * raciocínio", "o que se valoriza e o que atrai". Com verbo no singular saía
 * "a conversa e o raciocínio quer ser visto", errado em toda peça de ingresso.
 */
export const MODO_SIGNO = {
  'Áries': 'ganham pressa e querem começar',
  'Touro': 'desaceleram e pedem permanência',
  'Gêmeos': 'se dividem e querem nomear',
  'Câncer': 'recuam para dentro e buscam abrigo',
  'Leão': 'querem ser vistos e assumir o centro',
  'Virgem': 'se refinam e querem ser úteis',
  'Libra': 'passam a pedir reciprocidade',
  'Escorpião': 'aprofundam e não aceitam superfície',
  'Sagitário': 'abrem horizonte e querem sentido',
  'Capricórnio': 'endurecem e cobram resultado',
  'Aquário': 'se distanciam para enxergar o todo',
  'Peixes': 'perdem contorno e se misturam',
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

/**
 * Os quatro signos que recebem aspecto exato de um corpo neste signo.
 *
 * O recurso do "3 signos", "4 signos" é o que faz alguém parar para checar se é
 * ele. Só que quem usa isso normalmente chuta. Aqui é geometria: um signo, os
 * dois em quadratura e o oposto formam a cruz da modalidade, e são SEMPRE
 * quatro. Nada de opinião no meio.
 *
 * Não diz o que vai acontecer com essas pessoas — diz que o ângulo existe.
 * O que o ângulo faz depende da casa, e a casa depende do nascimento.
 */
/** Concordam com "cruz", que é feminino: a cruz cardinal, a cruz fixa. */
const MODALIDADE = ['cardinal', 'fixa', 'mutável']

const ORDEM_SIGNOS = [
  'Áries', 'Touro', 'Gêmeos', 'Câncer', 'Leão', 'Virgem',
  'Libra', 'Escorpião', 'Sagitário', 'Capricórnio', 'Aquário', 'Peixes',
]

export function eixoDoSigno(signo) {
  const i = ORDEM_SIGNOS.indexOf(signo)
  if (i < 0) return null
  const nome = (n) => ORDEM_SIGNOS[((n % 12) + 12) % 12]
  return {
    modalidade: MODALIDADE[i % 3],
    conjuncao: signo,
    // Em ordem do zodíaco: "Touro e Escorpião" lê melhor que "Escorpião e Touro".
    quadraturas: [nome(i + 3), nome(i + 9)].sort(
      (a, b) => ORDEM_SIGNOS.indexOf(a) - ORDEM_SIGNOS.indexOf(b)
    ),
    oposicao: nome(i + 6),
    /** Os quatro, na ordem do zodíaco, para listar sem parecer arbitrário. */
    todos: [signo, nome(i + 3), nome(i + 6), nome(i + 9)].sort(
      (a, b) => ORDEM_SIGNOS.indexOf(a) - ORDEM_SIGNOS.indexOf(b)
    ),
  }
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

    case 'eclipse': {
      const solar = evento.luminar === 'solar'
      const titulo = solar
        ? `Eclipse solar ${evento.especie} em ${evento.signo}`
        : `Eclipse lunar ${evento.especie} em ${evento.signo}`

      // A visibilidade é o dado que ninguém publica porque exige cálculo de
      // horizonte, e é o que separa "olhe para o céu" de mandar o público
      // brasileiro procurar uma sombra que passa pela Islândia.
      const ondeSeVe = evento.visivelBR
        ? solar
          ? `Visível do Brasil, ${evento.obscuracaoBR}% do disco.`
          : `Visível do Brasil: a Lua fica a ${evento.alturaBR}° acima do horizonte, quase no alto do céu.`
        : 'Não é visível do Brasil.'

      const sentido = solar
        ? 'Lua Nova com a Lua exatamente sobre o Sol. Começo de ciclo que costuma cobrar antes de abrir.'
        : 'Lua Cheia dentro da sombra da Terra. O que estava em curso chega ao ponto de virada.'

      return {
        titulo,
        texto: `${sentido} ${ondeSeVe}`,
        dado: `${dia(evento.quando)}, ${hora(evento.quando)} · ${evento.grau}° de ${evento.signo}`,
      }
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
 * Eventos que merecem o recurso dos quatro signos.
 *
 * Não é para usar todo dia: se toda peça recorta signos, o recurso vira ruído e
 * a conta vira horóscopo. Fica para eclipse, lunação e entrada dos planetas que
 * o público reconhece — os mesmos que a imprensa nota.
 */
const CORPOS_DE_PESO = ['Sun', 'Venus', 'Mars', 'Mercury', 'Jupiter', 'Saturn']

export function mereceEixo(evento) {
  if (evento.tipo === 'eclipse') return true
  if (evento.tipo === 'fase') return evento.fase === 'Lua Nova' || evento.fase === 'Lua Cheia'
  if (evento.tipo === 'ingresso') return CORPOS_DE_PESO.includes(evento.corpo)
  if (evento.tipo === 'retrogrado' || evento.tipo === 'direto') return true
  return false
}

/**
 * A véspera: dizer que falta, e quanto.
 *
 * O card publicava só no dia do evento, e por isso nunca criava espera. Quem
 * cresce nesse nicho publica antes — "está chegando", "faltam dois dias" — e o
 * público volta no dia. É a mesma efeméride, com a data lida de outro jeito.
 */
export function rotuloDeVespera(evento) {
  if (!evento?.vespera) return ''
  if (evento.diasFalta === 1) return 'Amanhã'
  return `Faltam ${evento.diasFalta} dias`
}

export function prefixoDeVespera(evento) {
  const rotulo = rotuloDeVespera(evento)
  return rotulo ? `${rotulo}: ` : ''
}

/**
 * Legenda do post.
 *
 * Abre pelo fato, explica em uma linha, separa o que é céu do que é casa e
 * convida. Sem segunda pessoa até o convite, que é onde ela cabe.
 */
export function montarLegenda(principal, secundarios = []) {
  const p = escrever(principal)
  const linhas = [`${prefixoDeVespera(principal)}${p.titulo}. ${p.dado}.`, '', p.texto]

  // Os quatro signos do eixo: geometria, não palpite. Entra só nos eventos de
  // peso para não virar cacoete.
  const eixo = mereceEixo(principal) ? eixoDoSigno(principal.signo) : null
  if (eixo) {
    linhas.push(
      '',
      `Os quatro signos que recebem ângulo exato — a cruz ${eixo.modalidade}:`,
      `· ${eixo.conjuncao} — conjunção`,
      `· ${eixo.quadraturas[0]} e ${eixo.quadraturas[1]} — quadratura`,
      `· ${eixo.oposicao} — oposição`
    )
  }

  if (secundarios.length) {
    linhas.push('', 'Também no radar:')
    for (const s of secundarios) linhas.push(`· ${prefixoDeVespera(s)}${escreverCurto(s)}`)
  }

  linhas.push('', ...fecho(principal.quando || new Date()))
  return linhas.join('\n')
}

/**
 * Legenda do card educativo.
 *
 * A ordem é deliberada: o texto curado primeiro, porque é o que vale a leitura,
 * e a moldura logo em seguida, antes que alguém termine achando que aquilo era
 * previsão do dia.
 */
export function montarLegendaEducativa(tema, aviso, quando = new Date()) {
  return [
    `${tema.titulo} — o que significa num mapa natal.`,
    '',
    tema.texto,
    '',
    aviso,
    '',
    tema.ancora,
    ...['', ...fecho(quando)],
  ].join('\n')
}

/**
 * A pergunta do adesivo de enquete no story.
 *
 * O story era o card em formato alto e nada mais — o formato tem enquete e a
 * gente não usava. O adesivo só existe na hora de postar, dentro do app, então
 * o que sai daqui é o texto pronto para colar.
 *
 * Toda pergunta puxa para a mesma direção: saber o próprio mapa. Quem responde
 * "não sei" acabou de descobrir que quer saber.
 */
export function perguntaDeEnquete(evento, tema = null) {
  if (tema) {
    return {
      pergunta: `Você sabe onde ${tema.corpoPt} está no seu mapa?`,
      opcoes: ['Sei', 'Não faço ideia'],
    }
  }

  switch (evento?.tipo) {
    case 'eclipse':
      return {
        pergunta: 'Sabia que todo eclipse é também uma Lua Nova ou Cheia?',
        opcoes: ['Sabia', 'Não fazia ideia'],
      }
    case 'ingresso':
      return {
        pergunta: `Sabe em que signo estava ${evento.corpoPt} quando você nasceu?`,
        opcoes: ['Sei', 'Não faço ideia'],
      }
    case 'fase':
      return {
        pergunta: 'Você repara nas fases da Lua no dia a dia?',
        opcoes: ['Sempre', 'Nunca'],
      }
    case 'retrogrado':
    case 'direto':
      return {
        pergunta: `Você sente diferença quando ${evento.corpoPt} fica retrógrado?`,
        opcoes: ['Sinto', 'Acho que não'],
      }
    case 'lua_fora_de_curso':
      return {
        pergunta: 'Já tinha ouvido falar em Lua fora de curso?',
        opcoes: ['Já', 'Nunca'],
      }
    default:
      return {
        pergunta: 'Você já viu seu mapa natal calculado de verdade?',
        opcoes: ['Já vi', 'Nunca vi'],
      }
  }
}

/**
 * O fecho da legenda: limite, convite e hashtags.
 *
 * Antes era um bloco fixo, idêntico em todo post. Para quem segue há semanas
 * isso lê como robô — e a régua da casa é justamente não parecer conteúdo
 * automático, mesmo sendo. A escolha é DETERMINÍSTICA pela data: regerar um dia
 * já publicado devolve a mesma legenda, que é a mesma regra do campo estelar e
 * do card.
 */
const LIMITES = [
  'Isso é o céu, e vale para todo mundo igual. O que muda de pessoa para pessoa é a casa em que isso cai, e a casa depende da hora e do lugar do nascimento.',
  'O céu é o mesmo para todo mundo hoje. Onde ele cai no seu mapa é que muda — e isso depende da hora e do lugar em que você nasceu.',
  'Nenhuma dessas posições diz o que vai acontecer com você. Diz onde o céu está. O resto depende da casa, e a casa vem do seu nascimento.',
  'Todo mundo tem esse céu hoje. O que ninguém tem igual é a casa em que ele cai — para saber a sua, precisa da hora e do lugar do nascimento.',
  'Isto é astronomia, confere em qualquer efeméride. Astrologia começa quando se pergunta onde isso cai no mapa de alguém.',
]

const CONVITES = [
  'Manda uma mensagem no WhatsApp e recebe seu mapa calculado, de graça: link na bio. 🌘',
  'Teu mapa calculado de verdade, sem custo, pelo WhatsApp — link na bio. 🌘',
  'Quer ver onde isso cai no seu mapa? É de graça e leva dois minutos: link na bio. 🌘',
  'O mapa natal completo sai por WhatsApp, calculado na hora e sem cobrar nada. Link na bio. 🌘',
  'Descobre a sua casa: mapa calculado de graça, link na bio. 🌘',
]

const TAGS = [
  '#astrologia #mapanatal #transitos #astrologiareal #efemerides #astrologiabrasil',
  '#astrologia #mapaastral #astrologiareal #transitosplanetarios #autoconhecimento #astrologiabrasil',
]

/** Índice estável a partir da data: mesmo dia, mesma escolha, sempre. */
function indiceDoDia(quando, tamanho) {
  const iso = new Date(quando).toISOString().slice(0, 10)
  let soma = 0
  for (let i = 0; i < iso.length; i++) soma = (soma * 31 + iso.charCodeAt(i)) % 100_000
  return soma % tamanho
}

function fecho(quando) {
  return [
    LIMITES[indiceDoDia(quando, LIMITES.length)],
    '',
    // deslocado de propósito: limite e convite não devem girar em bloco, senão
    // a combinação se repete a cada cinco dias em vez de a cada vinte e cinco
    CONVITES[(indiceDoDia(quando, CONVITES.length) + 2) % CONVITES.length],
    '',
    TAGS[indiceDoDia(quando, TAGS.length)],
  ]
}
