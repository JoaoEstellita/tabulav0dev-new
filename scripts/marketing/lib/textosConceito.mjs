/**
 * Os conceitos, para os dias em que o céu não dá assunto.
 *
 * A medição deu oito dias assim a cada sessenta. São poucos e são os melhores:
 * conteúdo que explica o vocabulário é o que faz alguém querer ver o próprio
 * mapa, e o app é justamente uma calculadora de mapa com catálogo curado.
 *
 * ── A REGRA QUE ESTES TEXTOS SEGUEM ────────────────────────────────────────
 *
 * Explicar sem catequizar. Nenhum texto defende a astrologia, promete acerto ou
 * responde a quem duvida: o João já cortou uma frase minha por isso ("a casa é
 * calculada, não é chute") e a razão vale para todo o resto. Quem abriu o post
 * não perguntou se funciona.
 *
 * Também não se explica o óbvio.
 *
 * ── O RITMO, DEPOIS DO PRIMEIRO RETORNO REAL ───────────────────────────────
 *
 * O João publicou e disse que parecia texto de IA. Medi: 84 caracteres de média
 * por frase, e só 9% de frases curtas. Toda frase com o mesmo peso vira
 * metrônomo, e o dois-pontos aparecia em 76% dos textos como muleta de
 * transição.
 *
 * Aqui a frase curta é obrigação, não enfeite. Terceira pessoa, sem "você".
 *
 * Sem travessão.
 */

/**
 * @type {Record<string, {titulo: string, texto: string}>}
 *
 * A chave entra no histórico como `conceito:<chave>`, então não se repete
 * dentro de catorze dias.
 */
export const CONCEITO = {
  ascendente: {
    titulo: 'O que é\no ascendente',
    texto: 'É o signo que estava subindo no horizonte no minuto do nascimento. ' +
      'Muda a cada duas horas. E é ele que decide onde cada área da vida fica ' +
      'no mapa. Duas pessoas do mesmo signo solar, uma nascida de manhã e outra ' +
      'à noite, têm o mesmo Sol e mapas que quase não se parecem. Quando alguém ' +
      'diz que nunca se identificou com o próprio signo, a resposta costuma ' +
      'estar aqui.',
  },

  casas: {
    titulo: 'O que são\nas casas',
    texto: 'Os signos dizem como alguma coisa acontece. As casas dizem onde. ' +
      'São doze partes da vida, do corpo ao trabalho. Um trânsito só vira ' +
      'experiência concreta quando se sabe em qual delas ele cai. É por isso ' +
      'que o mesmo eclipse mexe com a carreira de uma pessoa e com a casa de ' +
      'outra. Mesmo céu, casas diferentes.',
  },

  casa12: {
    titulo: 'A casa 12,\na mais temida',
    texto: 'Ganhou fama de casa ruim porque fala do que não se vê. O que se ' +
      'adia. O que cansa em silêncio. O que precisa terminar. Nada disso é ' +
      'castigo. É a parte da vida que funciona sem plateia, e por isso a mais ' +
      'difícil de reconhecer enquanto está acontecendo. Muita coisa resolvida ' +
      'aqui só faz sentido meses depois.',
  },

  retrogrado: {
    titulo: 'Retrógrado\nnão é castigo',
    texto: 'Nenhum planeta anda para trás. O que muda é o movimento aparente, ' +
      'porque a Terra ultrapassa o planeta na órbita. É como o carro do lado ' +
      'parecer recuar quando o seu passa por ele. Na leitura, o assunto daquele ' +
      'planeta para de avançar e passa a pedir revisão. Mercúrio retrógrado não ' +
      'quebra contrato. Ele cobra a leitura que ninguém fez.',
  },

  orbe: {
    titulo: 'O que é\num orbe',
    texto: 'É a distância que ainda conta. Um ângulo exato de 120 graus ' +
      'continua valendo a 117, só que mais fraco. O orbe é essa margem. Ela ' +
      'explica por que um contato se sente dias antes de fechar. E por que dois ' +
      'astrólogos discordam sobre se algo está em jogo ou não. Cada um usa uma ' +
      'margem.',
  },

  dignidades: {
    titulo: 'Planeta\nem casa própria',
    texto: 'Cada planeta manda em um ou dois signos. No signo onde manda, age ' +
      'do jeito mais direto que sabe. A tradição chama isso de domicílio. No ' +
      'signo oposto, trabalha contra a própria natureza, e aí é exílio. Não é ' +
      'bom nem ruim. Marte em Câncer não é um Marte fraco. É um Marte que ataca ' +
      'de lado, pela memória e pelo vínculo, em vez de ir de frente.',
  },

  nodulos: {
    titulo: 'Os nódulos\nda Lua',
    texto: 'Não são corpos. São os dois pontos onde a órbita da Lua cruza o ' +
      'caminho do Sol no céu. É por isso que não há eclipse toda Lua Nova. Só ' +
      'quando a lunação cai perto desses pontos. No mapa, o eixo deles aponta o ' +
      'que já se sabe fazer de olhos fechados e o que ainda custa. Leva dezoito ' +
      'anos para dar a volta completa.',
  },

  elementos: {
    titulo: 'Fogo, terra,\nar e água',
    texto: 'Os quatro elementos agrupam os doze signos por temperamento. Fogo ' +
      'age, terra constrói, ar pensa, água sente. Serve para ler um mapa de ' +
      'longe, antes de entrar no detalhe. Quem tem muita água e pouco fogo ' +
      'sente tudo antes de conseguir fazer alguma coisa com o que sentiu. ' +
      'Reconhecer isso já muda a forma de se cobrar.',
  },

  modalidades: {
    titulo: 'Cardinal, fixo\ne mutável',
    texto: 'Cada elemento aparece em três tempos. Os cardinais começam. Os ' +
      'fixos sustentam. Os mutáveis mudam de forma. É a diferença entre quem ' +
      'abre o negócio, quem o mantém de pé por dez anos e quem o reinventa ' +
      'quando o mercado vira. Nenhum funciona sozinho. E quase todo atrito ' +
      'entre duas pessoas está aqui antes de estar no signo.',
  },

  regente: {
    titulo: 'O regente\ndo mapa',
    texto: 'É o planeta que manda no signo do ascendente. Funciona como o ' +
      'protagonista da história. Onde ele está, no signo e na casa, diz o ' +
      'assunto para o qual a vida volta sempre. Ascendente em Libra tem Vênus ' +
      'como regente. Se esse Vênus estiver na casa 10, a vida gira em torno de ' +
      'trabalho, imagem e do que se constrói aos olhos dos outros.',
  },

  transito: {
    titulo: 'Trânsito\ne mapa natal',
    texto: 'O mapa natal é a foto do céu no nascimento. Não muda nunca. ' +
      'Trânsito é onde os planetas estão agora. A leitura acontece no encontro ' +
      'dos dois. Saturno em Peixes é o mesmo para todo mundo. Em que casa ele ' +
      'cai e o que ele toca num mapa é que muda de pessoa para pessoa. É por ' +
      'isso que previsão genérica erra tanto.',
  },

  eclipseLunacao: {
    titulo: 'Eclipse\nou lunação',
    texto: 'Todo eclipse é uma Lua Nova ou uma Lua Cheia. Mas nem toda lunação ' +
      'é eclipse. A diferença está no alinhamento, e ela muda a escala. Uma Lua ' +
      'Nova comum abre um ciclo de um mês. Um eclipse abre um de meses, e ' +
      'costuma chegar depois que alguma coisa terminou sem pedir licença.',
  },

  horaDoNascimento: {
    titulo: 'Por que a hora\nmuda tudo',
    texto: 'Sem a hora, dá para saber em que signo estavam os planetas. E é só. ' +
      'Ascendente, casas e Meio do Céu ficam de fora, e são eles que dizem em ' +
      'que área da vida cada coisa acontece. Um mapa sem hora responde como a ' +
      'pessoa é. Com hora, responde onde isso aparece. Que é a pergunta que as ' +
      'pessoas realmente fazem.',
  },

  meioDoCeu: {
    titulo: 'O Meio\ndo Céu',
    texto: 'É o ponto mais alto do mapa, o que estava bem acima da cabeça na ' +
      'hora do nascimento. Fala de carreira, mas não no sentido de emprego. ' +
      'Fala do que os outros enxergam de longe, e do lugar que se ocupa em ' +
      'público. Muita gente descobre pelo Meio do Céu que a profissão que ' +
      'exerce e a reputação que construiu não são a mesma coisa.',
  },

  aspectos: {
    titulo: 'O que os\naspectos dizem',
    texto: 'São os ângulos entre dois planetas, e cada ângulo é um tipo de ' +
      'conversa. Na conjunção os dois falam juntos, e é difícil separar quem ' +
      'disse o quê. Na oposição, puxam para lados contrários e pedem ' +
      'equilíbrio. A quadratura é atrito, e atrito obriga a agir. O trígono ' +
      'flui tão fácil que passa despercebido. E o sextil é oportunidade que só ' +
      'rende se alguém fizer alguma coisa.',
  },
}

/** As chaves, em ordem estável. */
export const CHAVES_DE_CONCEITO = Object.keys(CONCEITO)

/**
 * Um conceito ainda não usado na janela.
 *
 * A escolha é determinística pela data: regerar o mesmo dia devolve o mesmo
 * conceito, que é a regra de toda peça aqui. Quando os quinze já saíram na
 * janela, volta ao começo em vez de devolver nada, porque um dia sem peça é
 * pior que um conceito repetido.
 */
export function conceitoDoDia(iso, usadas = new Set(), pedido = '') {
  // pedido à mão pela linha de comando: `--conceito=orbe`
  if (pedido && pedido !== '*') {
    if (!CONCEITO[pedido]) {
      throw new Error(
        `conceito "${pedido}" não existe. Há: ${CHAVES_DE_CONCEITO.join(', ')}`
      )
    }
    return { chave: pedido, ...CONCEITO[pedido] }
  }

  const semente = Number(String(iso).replace(/-/g, '')) || 0
  const total = CHAVES_DE_CONCEITO.length

  for (let i = 0; i < total; i++) {
    const chave = CHAVES_DE_CONCEITO[(semente + i) % total]
    if (!usadas.has(`conceito:${chave}`)) return { chave, ...CONCEITO[chave] }
  }

  const chave = CHAVES_DE_CONCEITO[semente % total]
  return { chave, ...CONCEITO[chave] }
}
