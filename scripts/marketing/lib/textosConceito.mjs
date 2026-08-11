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
 * Também não se explica o óbvio. Saiu daqui a linha "o ascendente depende da
 * hora e do lugar em que você nasceu" pelo mesmo motivo que ele apontou: quem
 * leu até ali já sabe.
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
    texto: 'É o signo que estava subindo no horizonte leste no minuto em que ' +
      'você nasceu. Muda a cada duas horas, e é ele que decide onde cada área ' +
      'da vida fica no seu mapa: duas pessoas do mesmo signo solar, nascidas de ' +
      'manhã e à noite, têm o mesmo Sol e mapas que quase não se parecem. ' +
      'Quando alguém diz que nunca se identificou com o próprio signo, é aqui ' +
      'que costuma estar a resposta.',
  },

  casas: {
    titulo: 'O que são\nas casas',
    texto: 'Os signos dizem COMO alguma coisa acontece. As casas dizem ONDE. ' +
      'São doze setores da vida, do corpo ao trabalho, e um trânsito só vira ' +
      'experiência concreta quando se sabe em qual deles ele cai. É por isso ' +
      'que o mesmo eclipse mexe com a carreira de uma pessoa e com a casa de ' +
      'outra: mesmo céu, casas diferentes.',
  },

  casa12: {
    titulo: 'A casa 12,\na mais temida',
    texto: 'Ganhou fama de casa ruim porque fala do que não se vê: o que se ' +
      'adia, o que cansa em silêncio, o que precisa terminar. Nada disso é ' +
      'castigo. É a parte da vida que funciona sem plateia, e por isso a mais ' +
      'difícil de reconhecer enquanto acontece. Muita coisa que se resolve aqui ' +
      'só faz sentido meses depois.',
  },

  retrogrado: {
    titulo: 'Retrógrado\nnão é castigo',
    texto: 'Nenhum planeta anda para trás. O movimento aparente muda de sentido ' +
      'porque a Terra ultrapassa o planeta na órbita, como um carro que parece ' +
      'recuar quando outro o passa. Astrologicamente, o assunto daquele planeta ' +
      'para de avançar para fora e passa a pedir revisão. Mercúrio retrógrado ' +
      'não quebra contrato: ele cobra a leitura que ninguém fez.',
  },

  orbe: {
    titulo: 'O que é\num orbe',
    texto: 'É a distância que ainda conta. Um trígono exato tem 120 graus, mas ' +
      'a 117 ele continua valendo, mais fraco. O orbe é essa margem, e ela ' +
      'explica por que um aspecto se sente por dias antes de fechar e por que ' +
      'dois astrólogos discordam sobre se algo está ou não em jogo: eles usam ' +
      'margens diferentes.',
  },

  dignidades: {
    titulo: 'Planeta\nem casa própria',
    texto: 'Cada planeta rege um ou dois signos, e no signo que rege ele age do ' +
      'jeito mais direto que sabe: chama-se domicílio. No signo oposto a esse, ' +
      'trabalha contra a própria natureza, e chama-se exílio. Não é bom nem ' +
      'ruim: Marte em Câncer não é um Marte fraco, é um Marte que ataca de ' +
      'lado, pela memória e pelo vínculo, em vez de ir de frente.',
  },

  nodulos: {
    titulo: 'Os nódulos\nda Lua',
    texto: 'Não são corpos, são os dois pontos onde a órbita da Lua cruza o ' +
      'caminho aparente do Sol. É por isso que eclipse não acontece toda Lua ' +
      'Nova: só quando a lunação cai perto desses pontos. No mapa, o eixo deles ' +
      'aponta o que já se sabe fazer de olhos fechados e o que ainda custa, e ' +
      'leva dezoito anos para dar a volta completa.',
  },

  elementos: {
    titulo: 'Fogo, terra,\nar e água',
    texto: 'Os quatro elementos agrupam os doze signos por temperamento: fogo ' +
      'age, terra constrói, ar pensa, água sente. Serve para ler um mapa de ' +
      'longe antes de entrar no detalhe. Quem tem muita água e pouco fogo ' +
      'costuma sentir tudo antes de conseguir fazer alguma coisa com o que ' +
      'sentiu, e reconhecer isso já muda a forma de se cobrar.',
  },

  modalidades: {
    titulo: 'Cardinal, fixo\ne mutável',
    texto: 'Cada elemento aparece em três tempos. Os cardinais começam, os ' +
      'fixos sustentam, os mutáveis mudam de forma. É a diferença entre quem ' +
      'abre o negócio, quem o mantém de pé por dez anos e quem o reinventa ' +
      'quando o mercado vira. Nenhum funciona sozinho, e quase todo atrito ' +
      'entre duas pessoas está aqui antes de estar no signo.',
  },

  regente: {
    titulo: 'O regente\ndo mapa',
    texto: 'É o planeta que rege o signo do seu ascendente, e funciona como o ' +
      'protagonista da sua história: onde ele está, no signo e na casa, diz o ' +
      'assunto para o qual sua vida volta sempre. Ascendente em Libra tem Vênus ' +
      'como regente; se Vênus estiver na casa 10, a vida gira em torno de ' +
      'trabalho, imagem pública e do que se constrói aos olhos dos outros.',
  },

  transito: {
    titulo: 'Trânsito\ne mapa natal',
    texto: 'O mapa natal é uma foto do céu no seu nascimento e não muda nunca. ' +
      'Trânsito é onde os planetas estão agora. A leitura acontece no encontro ' +
      'dos dois: Saturno em Peixes é o mesmo para todo mundo, mas em qual casa ' +
      'ele cai e o que ele toca no seu mapa é só seu. É por isso que previsão ' +
      'genérica erra tanto.',
  },

  eclipseLunacao: {
    titulo: 'Eclipse\nou lunação',
    texto: 'Todo eclipse é uma Lua Nova ou uma Lua Cheia, mas nem toda lunação ' +
      'é eclipse. A diferença é o alinhamento com os nódulos, e ela muda a ' +
      'escala: uma Lua Nova comum abre um ciclo de um mês, um eclipse abre um ' +
      'de meses e costuma vir depois que alguma coisa termina sem pedir ' +
      'licença.',
  },

  horaDoNascimento: {
    titulo: 'Por que a hora\nmuda tudo',
    texto: 'Sem hora, dá para saber em que signo estavam os planetas, e é só. ' +
      'Ascendente, casas e Meio do Céu ficam de fora, e são eles que dizem em ' +
      'que área da vida cada coisa acontece. Um mapa sem hora responde "como ' +
      'você é". Com hora, responde "onde isso aparece", que é a pergunta que ' +
      'as pessoas realmente fazem.',
  },

  meioDoCeu: {
    titulo: 'O Meio\ndo Céu',
    texto: 'É o ponto mais alto do mapa, o que estava no zênite quando você ' +
      'nasceu. Fala de carreira, mas não no sentido de emprego: fala do que os ' +
      'outros veem quando pensam em você, e do lugar que você ocupa em público. ' +
      'Muita gente descobre pelo Meio do Céu que a profissão que exerce e a ' +
      'reputação que construiu não são a mesma coisa.',
  },

  aspectos: {
    titulo: 'O que os\naspectos dizem',
    texto: 'São os ângulos entre dois planetas, e cada ângulo é um tipo de ' +
      'conversa. Conjunção: os dois falam juntos e é difícil separar. Oposição: ' +
      'puxam para lados contrários e pedem equilíbrio. Quadratura: atrito que ' +
      'obriga a agir. Trígono: fluência tão fácil que passa despercebida. ' +
      'Sextil: oportunidade que só rende se alguém fizer alguma coisa.',
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
export function conceitoDoDia(iso, usadas = new Set()) {
  const semente = Number(String(iso).replace(/-/g, '')) || 0
  const total = CHAVES_DE_CONCEITO.length

  for (let i = 0; i < total; i++) {
    const chave = CHAVES_DE_CONCEITO[(semente + i) % total]
    if (!usadas.has(`conceito:${chave}`)) return { chave, ...CONCEITO[chave] }
  }

  const chave = CHAVES_DE_CONCEITO[semente % total]
  return { chave, ...CONCEITO[chave] }
}
