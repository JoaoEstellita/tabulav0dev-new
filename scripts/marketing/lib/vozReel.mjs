/**
 * A voz do vídeo — conversa direta.
 *
 * O que existia antes descrevia o céu e proibia falar com quem assiste. A regra
 * nasceu certa (impedir o vício do horóscopo: "hoje é seu dia de sorte") e virou
 * outra coisa: textos que não falam com ninguém. O João olhou o material e disse
 * que estava quase desistindo, e a frase que ele citou era minha —
 * "o céu é de todos, a casa é de cada um" — repetida em toda peça como se
 * explicasse alguma coisa.
 *
 * REGRAS DESTA VOZ
 *   1. Frase curta. Se dá para cortar uma palavra, corta.
 *   2. Fala com a pessoa: "a gente", "você". Sem cerimônia e sem locução.
 *   3. Nenhum termo técnico sem tradução NA MESMA FRASE. "Retrógrado" só
 *      aparece junto de "anda para trás".
 *   4. Um fato calculado por peça, no mínimo. Nada que sirva para qualquer dia.
 *   5. Nunca prometer, nunca mandar fazer, nunca dizer o que vai acontecer com
 *      a vida de alguém.
 *   6. Nada de jargão de encerramento. A peça acaba no fato, não no bordão.
 *
 * OS QUATRO TEMPOS
 *   1. o que acontece hoje, com hora
 *   2. o contraste concreto — de onde vem, quanto tempo ficou
 *   3. o fato que faz parar — de `lib/fatos.mjs`, sempre calculado
 *   4. o gancho — o próximo evento, com a distância em dias
 */
import { tempoNoSigno, ritmo, luaDeHoje, percursoDoDia, quemRecebe, casasPorAscendente, estacaoProxima } from './fatos.mjs'
import { NOMES_PT } from './ceu.mjs'
import { dignidade, textoEmSigno, primeirasFrases } from './interpretacao.mjs'

/** 0.48 → "0,48". Número com ponto decimal denuncia texto gerado. */
const num = (n, casas = 2) => Number(n).toFixed(casas).replace('.', ',').replace(/,00$/, '')

const hora = (d) =>
  new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo',
  }).format(d).replace(':', 'h')

const dia = (d) =>
  new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric', month: 'long', timeZone: 'America/Sao_Paulo',
  }).format(d)

/** Sol e Lua pedem artigo; os outros são nomes próprios. */
const art = (nome) => (nome === 'Sol' ? 'o Sol' : nome === 'Lua' ? 'a Lua' : nome)
const Art = (nome) => (nome === 'Sol' ? 'O Sol' : nome === 'Lua' ? 'A Lua' : nome)

/**
 * O que muda no tom quando um corpo entra num signo.
 *
 * Combinatório de propósito: 10 corpos × 12 signos são 120 textos que
 * envelheceriam mal. Aqui cada corpo tem um assunto e cada signo tem um jeito, e
 * a frase nasce do encontro — em linguagem de conversa, não de manual.
 */
const ASSUNTO = {
  Sun: 'a vontade de aparecer',
  Moon: 'o humor',
  Mercury: 'o jeito de falar',
  Venus: 'o gosto',
  Mars: 'a vontade de agir',
  Jupiter: 'a vontade de mais',
  Saturn: 'a paciência',
  Uranus: 'a vontade de mudar tudo',
  Neptune: 'a imaginação',
  Pluto: 'o que já não dá para segurar',
}

const JEITO = {
  'Áries': 'ganha pressa',
  'Touro': 'desacelera e quer garantia',
  'Gêmeos': 'se divide em várias direções',
  'Câncer': 'recua e procura abrigo',
  'Leão': 'sobe o tom e quer plateia',
  'Virgem': 'vai para o detalhe',
  'Libra': 'passa a depender do acordo',
  'Escorpião': 'não se contenta com pouco',
  'Sagitário': 'abre o horizonte',
  'Capricórnio': 'cobra resultado',
  'Aquário': 'toma distância',
  'Peixes': 'perde o contorno',
}

/**
 * A LEITURA do evento — o terceiro tempo da fala.
 *
 * Era aqui que morava a trivia astronômica: "a Lua anda 15° e troca de signo",
 * "0,65° por dia contra 1,20 de costume". O João leu e respondeu o que precisava
 * ser dito: "quem se importa quantos graus ela anda um dia — quero profundidade
 * de interpretação astrológica".
 *
 * Agora vem do catálogo curado do app, que tem 1.189 textos e nunca tinha sido
 * usado numa peça, mais a dignidade essencial — Marte entrando em Câncer está em
 * QUEDA, e isso muda o tamanho da notícia. O número só entra quando serve de
 * apoio à leitura, nunca sozinho.
 */
function leituraDoEvento(evento, catalogos) {
  if (!catalogos) return ''

  const corpo = evento.corpo || (evento.tipo === 'eclipse' || evento.tipo === 'fase'
    ? (evento.luminar === 'solar' || evento.fase === 'Lua Nova' ? 'Sun' : 'Moon')
    : null)
  if (!corpo || !evento.signo) return ''

  const partes = []

  // A dignidade abre quando existe: é o que separa "Marte entra em Câncer" de
  // "Marte entra em Escorpião" — mesma notícia, tamanhos diferentes.
  const dig = dignidade(corpo, evento.signo)
  const nomePt = evento.corpoPt || NOMES_PT[corpo] || corpo
  if (dig) partes.push(`${Art(nomePt)} ${dig.texto}.`)

  const texto = textoEmSigno(catalogos, corpo, evento.signo)
  if (texto) partes.push(primeirasFrases(texto, dig ? 1 : 2))

  return partes.join(' ')
}

/** O apoio de efeméride, quando a leitura precisa de um número ao lado. */
function fatoMarcante(evento, data) {
  const corpo = evento.corpo || (evento.tipo === 'eclipse' ? (evento.luminar === 'solar' ? 'Sun' : 'Moon') : 'Moon')
  // `evento.corpoPt` falta em eclipse e fase, e sem isto saía "Sun está quase
  // parado no céu" — nome do corpo em inglês, no meio de um texto em português.
  const nomePt = evento.corpoPt || NOMES_PT[corpo] || corpo

  // 1. Ficou mais tempo que o normal no signo? Sempre tem uma explicação, e ela
  //    é a parte interessante.
  const tempo = tempoNoSigno(corpo, data)
  if (tempo?.esticado) {
    return `${Art(nomePt)} ficou ${tempo.texto} no mesmo signo. ` +
      `O normal são ${tempo.media}. Ficou mais porque andou para trás no meio do caminho.`
  }

  // 2. Está muito fora do passo de sempre?
  const r = ritmo(corpo, data)
  if (r && (r.como === 'quase parado' || r.como === 'acelerado')) {
    // A explicação da lentidão só entra se a estação estiver mesmo perto. Sem
    // esta checagem saía "é assim pouco antes de mudar de direção" para Vênus a
    // quarenta dias da estação — uma afirmação que o cálculo não sustenta.
    const paraEm = estacaoProxima(corpo, data)
    const porque = paraEm !== null && paraEm <= 12
      ? ` Daqui a ${paraEm} dias ele para e muda de direção.`
      : ''
    return r.como === 'quase parado'
      ? `${Art(nomePt)} está devagar: ${num(r.grausPorDia)}° por dia, contra os ${num(r.media)}° de costume.${porque}`
      : `${Art(nomePt)} está acelerado: ${num(r.grausPorDia)}° por dia, contra os ${num(r.media)}° de costume.${porque}`
  }

  // 3. A Lua sempre tem o que contar — é o corpo que mais se move.
  const lua = luaDeHoje(data)
  const caminho = percursoDoDia('Moon', data)
  if (lua.perto && lua.iluminacao > 80) {
    return `A Lua está no ponto mais perto da Terra no mês, a ${lua.km.toLocaleString('pt-BR')} km. ` +
      `É o que costumam chamar de superlua, e ela aparece maior mesmo.`
  }
  if (caminho && caminho.trocaDeSigno) {
    return `Hoje a Lua anda ${Math.round(caminho.graus)}° e troca de signo: ` +
      `começa o dia em ${caminho.de.signo} e termina em ${caminho.ate.signo}. ` +
      `Ela é o corpo mais rápido do céu, e passa dois dias e meio em cada signo.`
  }
  if (lua.iluminacao <= 2) {
    return `A Lua está invisível hoje: 0% iluminada, no mesmo lado do céu que o Sol. ` +
      `Ela reaparece fininha daqui a dois ou três dias, no fim da tarde.`
  }
  return `Hoje a Lua está ${lua.iluminacao}% iluminada e anda ${Math.round(caminho?.graus || 13)}°, ` +
    `mais que qualquer outro corpo do céu num dia.`
}

/** O gancho do fim: o próximo evento, com a distância em dias. */
function gancho(proximo, data) {
  if (!proximo?.quando) return ''
  const faltam = Math.round((proximo.quando - data) / 86_400_000)
  if (faltam < 0 || faltam > 12) return ''

  const oQue = proximo.tipo === 'eclipse'
    ? `eclipse ${proximo.luminar === 'solar' ? 'do Sol' : 'da Lua'}`
    : proximo.tipo === 'ingresso'
      ? `${art(proximo.corpoPt)} muda de signo`
      : proximo.tipo === 'fase'
        ? proximo.fase
        : proximo.tipo === 'retrogrado'
          ? `${art(proximo.corpoPt)} começa a andar para trás`
          : proximo.tipo === 'direto'
            ? `${art(proximo.corpoPt)} volta a andar para a frente`
            : null
  if (!oQue) return ''

  if (faltam === 0) return `Ainda hoje: ${oQue}.`
  return faltam === 1 ? `Amanhã: ${oQue}.` : `Daqui a ${faltam} dias: ${oQue}.`
}

/** A abertura de cada tipo de evento — o primeiro tempo da fala. */
function abertura(evento, data) {
  const quando = evento.diasFalta > 0
    ? (evento.diasFalta === 1
        ? `Amanhã, ${hora(evento.quando)}`
        : `Daqui a ${evento.diasFalta} dias, em ${dia(evento.quando)}`)
    : `Hoje, ${hora(evento.quando)}`

  switch (evento.tipo) {
    case 'ingresso':
      return `${quando}, ${art(evento.corpoPt)} entra em ${evento.signo}.`
    case 'eclipse':
      return `${quando}, ${evento.luminar === 'solar' ? 'a Lua passa na frente do Sol' : 'a Lua entra na sombra da Terra'}.`
    case 'fase':
      return `${quando}, ${evento.fase} em ${evento.signo}.`
    case 'retrogrado':
      return `${quando}, ${art(evento.corpoPt)} começa a andar para trás no céu.`
    case 'direto':
      return `${quando}, ${art(evento.corpoPt)} volta a andar para a frente.`
    case 'retrogradacao':
      return `${Art(evento.corpoPt)} está andando para trás no céu.`
    case 'lua_fora_de_curso':
      return `Hoje a Lua passa algumas horas sem fazer ângulo com ninguém.`
    default:
      return `O céu de hoje, ${dia(data)}.`
  }
}

/** O segundo tempo: o contraste concreto. */
function contraste(evento, data) {
  if (evento.tipo === 'ingresso') {
    /**
     * "O jeito de falar vira detalhe e utilidade. Vinha de Leão." — foi o que
     * saía, e não é português que alguém use. Os predicados agora são verbos,
     * não adjetivos: adjetivo teria de concordar com o sujeito, que muda de
     * gênero conforme o planeta, e era daí que vinha a estranheza.
     */
    const assunto = ASSUNTO[evento.corpo] || 'o assunto dele'
    const jeito = JEITO[evento.signo] || 'muda de tom'
    const antes = evento.signoAnterior ? `Sai de ${evento.signoAnterior}. ` : ''
    return `${antes}Em ${evento.signo}, ${assunto} ${jeito}.`
  }

  if (evento.tipo === 'eclipse') {
    const onde = evento.visivelBR
      ? evento.luminar === 'solar'
        ? `Dá para ver do Brasil: ${evento.obscuracaoBR}% do Sol coberto.`
        : `Dá para ver do Brasil, com a Lua bem alta.`
      : `Do Brasil não dá para ver nada: a sombra passa longe daqui.`
    return `Acontece a ${evento.grau}° de ${evento.signo}. ${onde}`
  }

  if (evento.tipo === 'fase') {
    const lua = luaDeHoje(data)
    return `A ${evento.grau}° de ${evento.signo}, com a Lua ${lua.iluminacao}% iluminada.`
  }

  if (evento.tipo === 'retrogrado' || evento.tipo === 'retrogradacao') {
    return `Ele não anda para trás de verdade: visto daqui da Terra, o desenho volta sobre si mesmo.`
  }

  if (evento.tipo === 'lua_fora_de_curso') {
    return `Dura ${Math.round(evento.horas)} horas. Acontece toda semana e quase ninguém repara.`
  }

  return ''
}

/**
 * A fala completa da peça.
 *
 * @returns {{manchete, blocos: string[], post: string}}
 *   `blocos` é o que se queima no vídeo; `post` é a legenda para colar.
 */
export function falaDoReel(evento, data, { proximo = null, catalogos = null } = {}) {
  // A leitura curada manda; o fato de efeméride só entra quando o catálogo não
  // tem nada a dizer sobre este evento — dia de Lua fora de curso, por exemplo.
  const leitura = leituraDoEvento(evento, catalogos)

  const partes = [
    abertura(evento, data),
    contraste(evento, data),
    leitura || fatoMarcante(evento, data),
    gancho(proximo, data),
  ].filter(Boolean)

  const manchete =
    evento.tipo === 'ingresso' ? `${evento.corpoPt} entra em ${evento.signo}`
      : evento.tipo === 'eclipse' ? `Eclipse ${evento.luminar === 'solar' ? 'do Sol' : 'da Lua'} em ${evento.signo}`
        : evento.tipo === 'fase' ? `${evento.fase} em ${evento.signo}`
          : evento.tipo === 'retrogrado' ? `${evento.corpoPt} anda para trás`
            : evento.tipo === 'direto' ? `${evento.corpoPt} volta a andar`
              : evento.tipo === 'lua_fora_de_curso' ? 'A Lua sem rumo por algumas horas'
                : 'O céu de hoje'

  return { manchete, blocos: partes, post: montarPost(evento, partes, data) }
}

/**
 * A legenda do post.
 *
 * Aqui cabe o que não cabe no vídeo: as doze casas por ascendente, que é o
 * formato que faz alguém salvar para conferir o próprio, e o convite — que fica
 * SÓ aqui, nunca queimado na imagem.
 */
function montarPost(evento, partes, data) {
  const linhas = [...partes]

  const recebe = quemRecebe(evento.signo, evento.grau)
  if (recebe && (evento.tipo === 'eclipse' || evento.tipo === 'fase' || evento.tipo === 'ingresso')) {
    // "é aí que isso encosta" era o que estava aqui, e o João leu e disse o que
    // era: ninguém fala assim. A lista também precisava do "ou" antes do
    // último — sem ele parece enumeração de formulário.
    const lista = recebe.signos.length > 1
      ? `${recebe.signos.slice(0, -1).join(', ')} ou ${recebe.signos[recebe.signos.length - 1]}`
      : recebe.signos[0]
    linhas.push(
      '',
      `Se você tem Sol, Lua ou ascendente entre ${recebe.de}° e ${recebe.ate}° de ${lista}, ` +
      `é aí que ele pega no seu mapa. Fora dessa faixa, passa de longe.`
    )
  }

  const casas = casasPorAscendente(evento.signo)
  if (casas && evento.tipo === 'eclipse') {
    linhas.push('', 'Em que parte da vida isso cai, pelo seu ascendente:')
    for (const c of casas) linhas.push(`${c.ascendente} → casa ${c.casa}`)
  }

  /**
   * O fecho pede o que o algoritmo premia.
   *
   * Em 2026 salvamento e conversa no direct pesam muito acima de curtida, e
   * pedir explicitamente aumenta as duas coisas de forma relevante. "Link na
   * bio" sozinho não pedia nada — e o comentário do ascendente não é isca de
   * engajamento: quem comenta a hora e a cidade recebe a casa calculada de volta.
   */
  linhas.push(
    '',
    'Salva esse post para voltar quando o dia chegar.',
    'Não sabe seu ascendente? Comenta a hora e a cidade em que você nasceu que ' +
    'eu digo em que casa isso cai, ou calcula de graça no link da bio.'
  )
  return linhas.join('\n')
}
