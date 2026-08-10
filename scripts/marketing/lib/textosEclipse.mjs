/**
 * Os textos de eclipse.
 *
 * O João leu a legenda que saía e disse: "tá tão fraco". Estava — quatro frases
 * sobre três assuntos, com grau, visibilidade do Brasil e um gancho para outro
 * evento, e nenhuma delas era o que a pessoa abriu o post para ler. Ele pediu
 * foco em UM assunto, interpretação direta e o que acontece no nível psicológico
 * e espiritual.
 *
 * Nenhum dos 1.189 textos curados do app fala de eclipse. Estes foram escritos
 * para esta peça.
 *
 * ── A RÉGUA MUDOU, E É DECISÃO DELE ────────────────────────────────────────
 *
 * Até aqui nenhuma peça previa fato: era o que separava o material de horóscopo.
 * Perguntei explicitamente até onde a linguagem podia ir e ele escolheu poder
 * dizer o que TENDE A acontecer. Então:
 *
 *   PODE   "relações que dependiam do seu silêncio tendem a ruir"
 *   NÃO    "você vai receber uma proposta" — futuro fechado, nada sustenta
 *   NÃO    "o universo conspira", "energia poderosa" — charlatanice pura
 *
 * "Tende a" é o teto. É o que permite falar do que costuma acontecer sem afirmar
 * o que ninguém pode saber, e é o que os testes travam.
 *
 * ── O QUE NÃO ENTRA NO TEXTO ───────────────────────────────────────────────
 *
 * Grau, hora e visibilidade do Brasil continuam calculados e vão para o rodapé
 * da peça. No corpo, ocupavam o lugar da leitura.
 */

/**
 * A abertura da peça: o corte e a pergunta.
 *
 * O primeiro gancho que escrevi era o ciclo Saros — "este eclipse já aconteceu
 * antes, o anterior foi em agosto de 2008". O João leu e disse que não achava
 * relevante, e tinha razão por dois motivos: "série 126" é jargão que não diz
 * nada a quem assiste, e mandar a pessoa lembrar de 2008 adia justamente o que
 * ela abriu o post para saber, que é sobre agora.
 *
 * Estes três quadros são os primeiros três segundos — os que decidem se alguém
 * fica. Data e signo aparecem já no primeiro; o segundo diz o que aquele signo
 * não tolera; o terceiro é uma pergunta que a pessoa responde sozinha, sobre a
 * vida dela.
 */
export const PROVOCACAO = {
  'Áries': {
    corte: 'E Áries não sabe esperar a hora certa.',
    pergunta: 'O que você vem adiando por medo de fazer errado?',
  },
  'Touro': {
    corte: 'E Touro não larga o que já não sustenta.',
    pergunta: 'O que você continua segurando só porque sempre esteve aí?',
  },
  'Gêmeos': {
    corte: 'E Gêmeos não guarda segredo por muito tempo.',
    pergunta: 'O que você ainda não disse e já está pesando?',
  },
  'Câncer': {
    corte: 'E Câncer não finge que está tudo bem em casa.',
    pergunta: 'O que na sua família todo mundo vê e ninguém nomeia?',
  },
  'Leão': {
    corte: 'E Leão não aceita ser vivido pela metade.',
    pergunta: 'O que você vem fazendo pequeno para não incomodar ninguém?',
  },
  'Virgem': {
    corte: 'E Virgem não aguenta rotina que consome mais do que devolve.',
    pergunta: 'Que rotina está te gastando mais do que te sustenta?',
  },
  'Libra': {
    corte: 'E Libra não sustenta acordo em que só um lado cede.',
    pergunta: 'Em que relação é sempre você quem abre mão?',
  },
  'Escorpião': {
    corte: 'E Escorpião não deixa nada enterrado pela metade.',
    pergunta: 'O que você já sabe e finge que não sabe?',
  },
  'Sagitário': {
    corte: 'E Sagitário não vive de crença que já não explica nada.',
    pergunta: 'Em que você acredita hoje apenas por hábito?',
  },
  'Capricórnio': {
    corte: 'E Capricórnio não carrega estrutura que só cobra.',
    pergunta: 'Que peso você carrega achando que é obrigação sua?',
  },
  'Aquário': {
    corte: 'E Aquário não pertence por costume.',
    pergunta: 'De que grupo você faz parte só porque sempre fez?',
  },
  'Peixes': {
    corte: 'E Peixes não segura o que já se dissolveu.',
    pergunta: 'O que já acabou e você continua alimentando?',
  },
}

/** O que cada tipo de eclipse faz. Abre a peça. */
export const ABERTURA = {
  solar:
    'Todo eclipse solar é uma Lua Nova que apaga o Sol. O que rege a identidade ' +
    'some por alguns minutos, e o que sobra é o que existe sem plateia. ' +
    'Começos que nascem aqui costumam vir depois de um susto. Algo termina ' +
    'antes, sem pedir licença, e é do vazio que o novo aparece.',
  lunar:
    'Todo eclipse lunar é uma Lua Cheia dentro da sombra da Terra. O que estava ' +
    'guardado no escuro vem à superfície de uma vez, e é tarde demais para ' +
    'fingir que não se viu. Eclipse lunar não começa nada: ele encerra, e o que ' +
    'ele encerra raramente volta.',
}

/**
 * A leitura do eclipse pelo signo em que ele cai.
 *
 * É o assunto do dia — o que este eclipse cobra de todo mundo, antes de a peça
 * descer para a casa de cada um.
 */
export const POR_SIGNO = {
  'Áries':
    'Este eclipse cai em Áries, o signo de quem começa. O que vem sendo adiado ' +
    'por medo de errar chega ao ponto em que adiar já custa mais caro que ' +
    'tentar. Decisões tomadas sozinho, sem pedir permissão a ninguém, tendem a ' +
    'aparecer agora, e o que se perde nelas é justamente o que exigia ' +
    'aprovação para existir.',
  'Touro':
    'Este eclipse cai em Touro, o signo do que se segura com as duas mãos. ' +
    'Aquilo que dava segurança e já não dá tende a se revelar frágil de vez: ' +
    'um valor, um acordo, um bem. Não é perda gratuita: é o corpo cobrando ' +
    'que a estabilidade venha de dentro, não do que se acumulou.',
  'Gêmeos':
    'Este eclipse cai em Gêmeos, o signo da palavra. O que foi dito pela metade ' +
    'ou o que se calou por conveniência tende a vir à tona sem aviso. ' +
    'Conversas adiadas há meses acontecem em minutos, e o que se descobre ' +
    'nelas muda o desenho de vínculos que pareciam resolvidos.',
  'Câncer':
    'Este eclipse cai em Câncer, o signo do que é raiz. A casa, a família e o ' +
    'que se chama de origem entram em revisão. O que sustentava por hábito, ' +
    'não por verdade, tende a ceder. Sai daqui um pertencimento mais estreito ' +
    'e mais honesto do que o que havia antes.',
  'Leão':
    'Este eclipse cai em Leão, o signo do que a alma quer expressar sem pedir ' +
    'licença. O que estava sendo vivido pela metade, por medo de ocupar ' +
    'espaço, chega ao limite. Projetos guardados na gaveta tendem a sair dela, ' +
    'e relações que dependiam do seu encolhimento tendem a ruir. Não é castigo. ' +
    'É o ciclo cobrando verdade.',
  'Virgem':
    'Este eclipse cai em Virgem, o signo do que se faz todo dia. A rotina que ' +
    'consumia mais do que devolvia chega ao fim do que aguenta: corpo, ' +
    'trabalho, método. O que se organiza depois costuma ser mais simples, e ' +
    'mais seu, do que o sistema que ruiu.',
  'Libra':
    'Este eclipse cai em Libra, o signo do outro. Acordos que só se sustentavam ' +
    'porque um dos lados cedia sempre tendem a se desfazer, e vínculos que ' +
    'estavam mornos definem se são ou não são. A justiça que se busca aqui é ' +
    'menos sobre o outro do que sobre o que se aceitou em nome da paz.',
  'Escorpião':
    'Este eclipse cai em Escorpião, o signo do que não se diz em voz alta. ' +
    'Dinheiro dividido, intimidade, dívida, herança: o que estava encoberto ' +
    'tende a aparecer inteiro. Não há como desver. O que morre aqui costuma ' +
    'ser o que já estava morto e continuava sendo carregado.',
  'Sagitário':
    'Este eclipse cai em Sagitário, o signo do sentido. Uma crença que orientava ' +
    'escolhas há anos entra em xeque, e o horizonte que parecia certo se abre ' +
    'ou se fecha de uma vez. Viagens, estudos e a fé, em qualquer coisa, ' +
    'tendem a ser postos à prova pelo que a realidade mostra.',
  'Capricórnio':
    'Este eclipse cai em Capricórnio, o signo do que se constrói para durar. ' +
    'A estrutura que exigia mais do que retribuía chega ao ponto de ruptura: ' +
    'carreira, autoridade, o lugar ocupado aos olhos dos outros. O que se ergue ' +
    'depois costuma ser menor e mais firme.',
  'Aquário':
    'Este eclipse cai em Aquário, o signo do que é coletivo. O grupo, a causa e ' +
    'o projeto de muitos passam por uma prova de pertencimento, e quem estava ' +
    'ali por hábito tende a sair. O futuro que se imaginava se reescreve, e ' +
    'quase sempre para longe de onde se estava mirando.',
  'Peixes':
    'Este eclipse cai em Peixes, o signo do que não tem contorno. O que se ' +
    'evitava olhar, seja cansaço, ilusão ou um apego antigo, tende a subir sem ' +
    'convite. É um eclipse de dissolução: o que ele leva não volta, e o alívio ' +
    'costuma chegar depois do susto, não antes.',
}

/**
 * O que o eclipse mexe, casa por casa.
 *
 * É o que a pessoa veio procurar — a casa é calculada pelo ascendente dela, e a
 * leitura vem daqui. Cada texto fala de UM território da vida, no nível
 * psicológico, e diz o que tende a acontecer sem prometer fato.
 */
export const POR_CASA = {
  1: 'O eclipse cai sobre você mesmo: corpo, nome, o jeito de chegar nos ' +
     'lugares. A imagem que vinha sendo sustentada por esforço tende a rachar, ' +
     'e o que aparece embaixo assusta antes de aliviar. Cortes de cabelo, ' +
     'mudanças de estilo e decisões sobre o próprio corpo costumam acontecer ' +
     'aqui. São o sintoma, não a causa.',
  2: 'O eclipse cai sobre o que sustenta: dinheiro, bens, o que se valoriza o ' +
     'bastante para guardar. Uma fonte de renda ou um bem material tende a ' +
     'mudar de figura, e a pergunta que fica é mais dura que a conta bancária: ' +
     'o que ainda vale, quando o que se tinha como garantia sai de cena.',
  3: 'O eclipse cai sobre a palavra e o perto: irmãos, vizinhança, o dia a dia. ' +
     'Uma conversa adiada tende a acontecer sem planejamento, e o que se diz ' +
     'nela não tem volta. É período de descobrir o que se pensava de verdade ' +
     'sobre alguém, inclusive sobre si.',
  4: 'O eclipse cai sobre a raiz: casa, família, o que dá base. Mudanças de ' +
     'endereço, revelações sobre a origem e o fim de arranjos domésticos que ' +
     'já não serviam tendem a se concentrar neste período. O chão treme para ' +
     'que se descubra o que sustentava de verdade.',
  5: 'O eclipse cai sobre o que se cria e o que dá prazer: filhos, arte, ' +
     'romance, palco. O que estava sendo feito para agradar tende a perder a ' +
     'graça de vez, e o que era só seu pede espaço. Namoros mornos e projetos ' +
     'de gaveta costumam se definir aqui, para um lado ou para o outro.',
  6: 'O eclipse cai sobre a rotina e o corpo: trabalho de todo dia, saúde, ' +
     'método. O ritmo que vinha sendo sustentado por cafeína e teimosia tende ' +
     'a cobrar a conta. Trocas de emprego, de hábito e de cuidado se concentram ' +
     'aqui, e quase sempre depois de um sinal que já vinha sendo ignorado.',
  7: 'O eclipse cai sobre o outro: casamento, sociedade, os acordos a dois. ' +
     'Relações que se sustentavam pela inércia tendem a se definir, para dentro ' +
     'ou para fora. O que aparece não é novidade: é o que já se sabia e não se ' +
     'queria nomear.',
  8: 'O eclipse cai sobre o que se divide e o que termina: dinheiro do outro, ' +
     'intimidade, dívida, herança. Assuntos guardados por anos tendem a vir à ' +
     'tona de uma vez, e não há como fingir que não se viu. É a casa onde o ' +
     'eclipse trabalha mais fundo, e onde ele menos pergunta se pode.',
  9: 'O eclipse cai sobre o sentido: estudo, viagem, a crença que orienta. ' +
     'O que se tinha como certo entra em revisão, e a distância, geográfica ou ' +
     'simbólica, deixa de ser fuga e vira necessidade. Decisões sobre voltar a ' +
     'estudar ou mudar de país tendem a se acelerar aqui.',
  10: 'O eclipse cai sobre a carreira e o nome público. O lugar que se ocupa aos ' +
      'olhos dos outros tende a mudar de forma visível: promoção, saída, ' +
      'exposição. É a casa mais alta do mapa, e o que acontece nela dificilmente ' +
      'passa despercebido de quem está em volta.',
  11: 'O eclipse cai sobre o coletivo: amizades, grupos, o projeto que é de mais ' +
      'gente. Pertencimentos antigos tendem a se desfazer sem briga: apenas ' +
      'deixam de fazer sentido. O que se quer para o futuro se reescreve, e ' +
      'quase nunca no rumo que se vinha seguindo.',
  12: 'O eclipse cai sobre os bastidores: o que não se mostra, o que cansa em ' +
      'silêncio, o que precisa acabar. Este é o eclipse que trabalha antes de ' +
      'aparecer. O corpo pede recolhimento, sonhos ficam mais vívidos, e o que ' +
      'se descobre aqui costuma só fazer sentido meses depois.',
}

/**
 * O fecho.
 *
 * Mudou depois da pesquisa de formato: em 2026 o algoritmo pesa salvamento e
 * conversa no direct muito acima de curtida, e pedir explicitamente aumenta as
 * duas coisas de forma relevante. O "link na bio" sozinho não pedia nada.
 *
 * O pedido do comentário tem uma segunda função: quem comenta a hora e a cidade
 * recebe a casa calculada de volta — é atendimento, não isca.
 */
export const FECHO = {
  salvar: 'Salva esse post para voltar no dia do eclipse.',
  comentar:
    'Não sabe seu ascendente? Comenta a hora e a cidade em que você nasceu ' +
    'que eu digo em que casa isso cai no seu mapa.',
  link: 'Ou calcula de graça, em dois minutos, no link da bio.',
}
