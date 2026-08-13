/**
 * Os carrosséis de tema: uma sequência que ensina uma coisa inteira.
 *
 * O post de recurso mostra uma tela e explica o que ela faz. Isso resolve
 * "existe isto", e não resolve "como eu leio isto". Um tema precisa de ordem:
 * primeiro o que é, depois onde fica, depois o que fazer com aquilo.
 *
 * Sai por comando (`--carrossel=mapa`), não pela cascata, porque é peça de
 * decisão editorial e não de calendário: seis slides não se produzem por acaso
 * num dia em que o céu ficou quieto.
 *
 * `tela` é opcional em cada slide. Quando existe, o slide mostra o celular;
 * quando não, é um slide de texto, no mesmo desenho das peças de céu. A mistura
 * é de propósito: seis telas seguidas cansam e ninguém chega ao fim.
 */

export const TEMA = {
  /**
   * A lua fora de curso, explicada.
   *
   * O João mandou o conteúdo e pediu, na mesma mensagem, "linguagem clara e
   * acessível". O texto que ele mandou é justamente onde o jargão se esconde:
   * "último aspecto maior", "incomunicável", "vazia de curso". Quem não estuda
   * astrologia não sabe o que é um aspecto maior, e a palavra sai sem prejuízo:
   * "terminou de conversar com os planetas" diz o mesmo e não pede nota de
   * rodapé.
   *
   * A comparação do barco sem leme é dele, e fica: é exatamente o tipo de
   * imagem que dispensa explicação.
   *
   * Este carrossel é o EXPLICATIVO, sem data. O aviso de cada janela continua
   * saindo em story, com a hora real do dia.
   */
  luaVazia: {
    titulo: 'Lua fora\nde curso',
    ponte: 'O app calcula a janela de cada dia. Link da bio.',
    slides: [
      {
        titulo: 'Lua fora\nde curso',
        texto: 'Você já teve um dia em que nada engata? Combina e desmarca, ' +
          'decide e volta atrás, trabalha e não sai do lugar. A astrologia tem ' +
          'nome para uma parte disso, e ele aparece no calendário. Arrasta.',
      },
      {
        titulo: 'O que\nestá acontecendo',
        texto: 'A Lua passa dois dias e meio em cada signo, conversando com os ' +
          'planetas pelo caminho. Quando ela termina a última dessas conversas ' +
          'e ainda não entrou no signo seguinte, fica um intervalo solta. É ' +
          'esse intervalo que se chama fora de curso.',
      },
      {
        titulo: 'Um barco\nsem leme',
        texto: 'A imagem é antiga e continua boa: o barco segue na água, mas ' +
          'ninguém está no comando. O que já estava andando continua andando. ' +
          'O que precisa de direção nova é que não pega.',
      },
      {
        titulo: 'O que\nnão engata',
        texto: 'Abrir empresa, assinar contrato, inaugurar. Compra grande, ' +
          'acordo fechado, primeiro encontro. Cirurgia marcada e exame que você ' +
          'nunca fez. Nada disso vira desastre: é que costuma precisar ser ' +
          'refeito, remarcado ou renegociado depois.',
      },
      {
        titulo: 'O que\nrende',
        texto: 'A rotina que já anda sozinha. Terminar o que está pela metade: ' +
          'papel acumulado, armário bagunçado, aquela pendência de três ' +
          'semanas. E descansar sem culpa, que é o melhor uso do período e o ' +
          'que quase ninguém faz.',
      },
      {
        titulo: 'Acontece\ntoda semana',
        texto: 'A cada dois ou três dias, por algumas horas. Às vezes vinte ' +
          'minutos, às vezes um dia inteiro. Saber a janela muda o dia: dá para ' +
          'empurrar a reunião importante em duas horas e resolver o resto ' +
          'primeiro.',
      },
    ],
  },

  mapa: {
    sobreOApp: true,
    titulo: 'Como ler\nseu mapa',
    ponte: 'Seu mapa sai em três perguntas, de graça, no link da bio.',
    slides: [
      {
        titulo: 'Como ler\nseu mapa',
        texto: 'Todo mapa astral responde três perguntas, nesta ordem: o que ' +
          'está acontecendo, onde isso acontece e como. Quem tenta ler tudo de ' +
          'uma vez desiste no primeiro glifo. Arrasta.',
      },
      {
        titulo: 'Primeiro:\nos planetas',
        texto: 'Cada planeta é uma função sua. O Sol é o que você quer ser, a ' +
          'Lua é o que você precisa para se sentir em casa, Mercúrio é como ' +
          'você pensa e fala, Vênus é o que te agrada, Marte é como você age. ' +
          'Os outros cinco são mais lentos e falam de tempo, não de rotina.',
        tela: 'mapa',
      },
      {
        titulo: 'Depois:\nos signos',
        texto: 'O signo diz o COMO. Marte em Áries age indo de frente; Marte em ' +
          'Câncer age pelo lado, pela memória, protegendo. É o mesmo Marte, com ' +
          'outro jeito. Por isso "sou de Áries" diz tão pouco: é só o signo de ' +
          'um dos dez.',
      },
      {
        titulo: 'Por fim:\nas casas',
        texto: 'A casa diz ONDE, na sua vida, aquilo acontece: no trabalho, em ' +
          'casa, nas relações, no corpo. É a camada que depende da hora exata ' +
          'do nascimento, e é a que transforma a leitura em alguma coisa que ' +
          'você reconhece na sua semana.',
        tela: 'mapa',
      },
      {
        titulo: 'E então\no mapa fala',
        texto: 'Planeta, signo e casa, juntos: "Marte em Câncer na casa 10" é a ' +
          'pessoa que constrói carreira protegendo os seus, e que briga por ' +
          'eles em público. Uma frase que não serve para mais ninguém.',
      },
    ],
  },

  dia: {
    sobreOApp: true,
    titulo: 'Seu dia\nem oito áreas',
    ponte: 'Seu dia calculado todo dia, no link da bio.',
    slides: [
      {
        titulo: 'Seu dia\nem oito áreas',
        texto: 'Horóscopo de revista dá uma frase para um doze avos da ' +
          'humanidade. Aqui o dia é comparado com o SEU mapa, e o resultado se ' +
          'divide em oito partes da vida. Arrasta para ver como.',
      },
      {
        titulo: 'De onde\nsai o número',
        texto: 'O app olha onde os planetas estão agora e onde eles caem no seu ' +
          'mapa. Cada contato desses vale um peso, que depende de quão exato ' +
          'ele está e de qual planeta é. A soma vira o score do dia.',
        tela: 'inicio',
      },
      {
        titulo: 'Por que oito\ne não uma',
        texto: 'Porque o mesmo dia pode estar ótimo para conversar e péssimo ' +
          'para assinar contrato. Cada área tem suas casas e seus planetas ' +
          'regentes, então cada uma recebe a própria nota. É o que um número ' +
          'só esconde.',
        tela: 'inicio',
      },
      {
        titulo: 'O que fazer\ncom isso',
        texto: 'Nada de cancelar o dia porque a nota está baixa. Área em ' +
          'vermelho é onde vale ter paciência e não forçar; área em verde é ' +
          'onde a mesma energia rende mais. Serve para escolher a ordem das ' +
          'coisas, não para deixar de fazê-las.',
      },
    ],
  },

  transitos: {
    sobreOApp: true,
    titulo: 'O que é\num trânsito',
    ponte: 'Veja os trânsitos sobre o seu mapa, no link da bio.',
    slides: [
      {
        titulo: 'O que é\num trânsito',
        texto: 'É a palavra que separa astrologia de horóscopo, e quase ninguém ' +
          'explica. Arrasta: são quatro slides.',
      },
      {
        titulo: 'Seu mapa\nnão muda',
        texto: 'O mapa natal é a foto do céu no minuto em que você nasceu. Ele ' +
          'é o mesmo aos vinte e aos oitenta anos. Tudo o que se lê nele é ' +
          'sobre como você funciona, não sobre o que vai acontecer.',
        tela: 'mapa',
      },
      {
        titulo: 'O céu\ncontinua andando',
        texto: 'Enquanto isso os planetas seguem em movimento. Onde eles estão ' +
          'HOJE é o trânsito. Sozinho, ele é igual para todo mundo: Saturno em ' +
          'Peixes é Saturno em Peixes para os oito bilhões.',
      },
      {
        titulo: 'O encontro\ndos dois',
        texto: 'A leitura acontece quando um planeta de hoje toca um ponto do ' +
          'seu mapa. Aí deixa de ser paisagem e vira endereço: qual ponto seu, ' +
          'em que casa, por quanto tempo. É isso que o app calcula e mostra.',
        tela: 'transitos',
      },
    ],
  },
}

export const CHAVES_DE_TEMA = Object.keys(TEMA)

export function temaPorChave(chave) {
  const t = TEMA[chave]
  if (!t) {
    throw new Error(`tema "${chave}" não existe. Há: ${CHAVES_DE_TEMA.join(', ')}`)
  }
  return { chave, ...t }
}
