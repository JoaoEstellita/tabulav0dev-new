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
    'Todo eclipse solar é uma Lua Nova que apaga o Sol. O que rege a ' +
    'identidade some por alguns minutos, e o que sobra é o que existe sem ' +
    'plateia. Começo que nasce aqui costuma vir depois de um susto. Algo ' +
    'termina antes, sem pedir licença, e é do vazio que o novo aparece.',
  lunar:
    'Todo eclipse lunar é uma Lua Cheia dentro da sombra da Terra. O que ' +
    'estava guardado no escuro vem à superfície de uma vez. Fica tarde ' +
    'demais para fingir que não se viu. Eclipse lunar não começa nada. Ele ' +
    'encerra, e o que ele encerra raramente volta.',
}

/**
 * A leitura do eclipse pelo signo em que ele cai.
 *
 * É o assunto do dia — o que este eclipse cobra de todo mundo, antes de a peça
 * descer para a casa de cada um.
 */
export const POR_SIGNO = {
  'Áries':
    'Este eclipse cai em Áries, o signo de quem começa. O que vinha sendo ' +
    'adiado por medo de errar chega no ponto em que adiar custa mais caro ' +
    'que tentar. Decisões tomadas sozinho, sem pedir permissão a ninguém, ' +
    'aparecem agora. E o que se perde nelas costuma ser justamente o que ' +
    'precisava de aprovação para existir.',
  'Touro':
    'Este eclipse cai em Touro, o signo do que se constrói para durar. Mexe ' +
    'com dinheiro, com corpo, com o que se tem nas mãos. Alguma segurança ' +
    'sai de cena. O susto é grande na hora, e a pergunta que fica é melhor ' +
    'do que a resposta antiga: o que ainda vale, agora que a garantia ' +
    'acabou.',
  'Gêmeos':
    'Este eclipse cai em Gêmeos, o signo da palavra. Conversa adiada ' +
    'acontece sem planejamento nenhum. O que se diz nela não tem volta. É ' +
    'período de descobrir o que se pensava de verdade sobre alguém. E, com ' +
    'frequência, sobre si.',
  'Câncer':
    'Este eclipse cai em Câncer, o signo da raiz. Mexe com casa, com ' +
    'família, com o chão que sustenta. Endereço muda. Verdade antiga ' +
    'aparece. Arranjo doméstico que já não servia se desfaz. O chão treme ' +
    'para que fique claro o que segurava de verdade.',
  'Leão':
    'Este eclipse cai em Leão, o signo do que a alma quer expressar sem ' +
    'pedir licença. O que vinha sendo vivido pela metade, por medo de ' +
    'ocupar espaço, chega ao limite. Projeto guardado na gaveta sai dela. ' +
    'Relação que dependia do seu encolhimento rui. Não é castigo. É o ciclo ' +
    'cobrando verdade.',
  'Virgem':
    'Este eclipse cai em Virgem, o signo da rotina e do corpo. O ritmo que ' +
    'vinha sendo sustentado na base do café e da teimosia cobra a conta. ' +
    'Emprego troca. Hábito troca. Cuidado que se adiava vira urgência. E ' +
    'quase sempre depois de um sinal que já vinha sendo ignorado.',
  'Libra':
    'Este eclipse cai em Libra, o signo do outro. Relação que se sustentava ' +
    'pela inércia se define, para dentro ou para fora. O que aparece não é ' +
    'novidade para ninguém. É o que já se sabia e não se queria nomear.',
  'Escorpião':
    'Este eclipse cai em Escorpião, o signo do que se divide e do que ' +
    'termina. Dinheiro junto, intimidade, dívida, herança. Assunto guardado ' +
    'por anos vem à tona de uma vez. Não dá para fingir que não se viu. É ' +
    'onde o eclipse trabalha mais fundo, e onde menos pergunta se pode.',
  'Sagitário':
    'Este eclipse cai em Sagitário, o signo do sentido. O que se tinha como ' +
    'certo entra em revisão. A distância deixa de ser fuga e vira ' +
    'necessidade, seja ela geográfica ou não. Decisão de voltar a estudar ' +
    'ou de mudar de país se acelera.',
  'Capricórnio':
    'Este eclipse cai em Capricórnio, o signo do lugar que se ocupa no ' +
    'mundo. Mexe com carreira e com reputação. Promoção, saída, exposição. ' +
    'É a parte mais alta do mapa, e o que acontece nela dificilmente passa ' +
    'despercebido de quem está em volta.',
  'Aquário':
    'Este eclipse cai em Aquário, o signo do coletivo. Pertencimento antigo ' +
    'se desfaz sem briga nenhuma. Só deixa de fazer sentido. O que se quer ' +
    'para o futuro se reescreve, e quase nunca no rumo que vinha sendo ' +
    'seguido.',
  'Peixes':
    'Este eclipse cai em Peixes, o signo do que não tem contorno. Trabalha ' +
    'antes de aparecer. O corpo pede recolhimento, o sono fica mais vívido, ' +
    'e o que se descobre aqui só faz sentido meses depois. É o eclipse mais ' +
    'silencioso dos doze.',
}

/**
 * O que o eclipse mexe, casa por casa.
 *
 * É o que a pessoa veio procurar — a casa é calculada pelo ascendente dela, e a
 * leitura vem daqui. Cada texto fala de UM território da vida, no nível
 * psicológico, e diz o que tende a acontecer sem prometer fato.
 */
export const POR_CASA = {
  1:
     'O eclipse cai sobre a própria pessoa. Corpo, nome, o jeito de chegar ' +
     'nos lugares. A imagem que vinha sendo sustentada por esforço racha, e ' +
     'o que aparece embaixo assusta antes de aliviar. Corte de cabelo, ' +
     'mudança de estilo, decisão sobre o próprio corpo. Tudo isso é sintoma, ' +
     'não causa.',
  2:
     'O eclipse cai sobre o que sustenta. Dinheiro, bens, o que se guarda ' +
     'por valer a pena. Uma fonte de renda muda de figura. A pergunta que ' +
     'sobra é mais dura que a conta bancária: o que ainda vale quando a ' +
     'garantia sai de cena.',
  3:
     'O eclipse cai sobre a palavra e o que está perto. Irmãos, vizinhança, ' +
     'o dia a dia. Uma conversa adiada acontece sem planejamento. O que se ' +
     'diz nela não tem volta. É período de descobrir o que se pensava de ' +
     'verdade sobre alguém, e às vezes sobre si.',
  4:
     'O eclipse cai sobre a raiz. Casa, família, o que dá base. Mudança de ' +
     'endereço, verdade sobre a origem, fim de um arranjo doméstico que já ' +
     'não servia. O chão treme para que fique claro o que sustentava de ' +
     'verdade.',
  5:
     'O eclipse cai sobre o que se cria e o que dá prazer. Filhos, arte, ' +
     'romance, palco. O que vinha sendo feito para agradar perde a graça de ' +
     'vez. O que era só seu pede espaço. Namoro morno e projeto de gaveta se ' +
     'definem aqui, para um lado ou para o outro.',
  6:
     'O eclipse cai sobre a rotina e o corpo. Trabalho de todo dia, saúde, ' +
     'método. O ritmo sustentado por cafeína e teimosia cobra a conta. Troca ' +
     'de emprego, de hábito, de cuidado. Quase sempre depois de um sinal que ' +
     'já vinha sendo ignorado.',
  7:
     'O eclipse cai sobre o outro. Casamento, sociedade, acordo a dois. ' +
     'Relação que se sustentava pela inércia se define, para dentro ou para ' +
     'fora. O que aparece não é novidade. É o que já se sabia e não se ' +
     'queria nomear.',
  8:
     'O eclipse cai sobre o que se divide e o que termina. Dinheiro do ' +
     'outro, intimidade, dívida, herança. Assunto guardado por anos vem à ' +
     'tona de uma vez, e não dá para fingir que não se viu. É a casa onde ' +
     'ele trabalha mais fundo, e onde menos pergunta se pode.',
  9:
     'O eclipse cai sobre o sentido. Estudo, viagem, a crença que orienta. O ' +
     'que se tinha como certo entra em revisão. A distância deixa de ser ' +
     'fuga e vira necessidade. Decisão de voltar a estudar ou de mudar de ' +
     'país se acelera aqui.',
  10:
     'O eclipse cai sobre a carreira e o nome público. O lugar que se ocupa ' +
     'aos olhos dos outros muda de forma visível. Promoção, saída, ' +
     'exposição. É a casa mais alta do mapa, e o que acontece nela ' +
     'dificilmente passa despercebido de quem está em volta.',
  11:
     'O eclipse cai sobre o coletivo. Amizade, grupo, o projeto que é de ' +
     'mais gente. Pertencimento antigo se desfaz sem briga. Só deixa de ' +
     'fazer sentido. O que se quer para o futuro se reescreve, e quase nunca ' +
     'no rumo que vinha sendo seguido.',
  12:
     'O eclipse cai sobre os bastidores. O que não se mostra, o que cansa em ' +
     'silêncio, o que precisa acabar. Este é o eclipse que trabalha antes de ' +
     'aparecer. O corpo pede recolhimento, os sonhos ficam mais vívidos, e o ' +
     'que se descobre aqui só faz sentido meses depois.',
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
  /**
   * O fecho diz O QUE SAI, e não só que é grátis.
   *
   * Era "Ou calcula de graça, em dois minutos, no link da bio". A gratuidade e o
   * tempo já estavam certos; faltava o conteúdo da entrega. O concorrente que o
   * João apontou vende exatamente isso na bio — "mapa astral completo e
   * gratuito, planetas, casas, aspectos e dignidades" — e a diferença entre as
   * duas frases é saber se vale gastar os dois minutos.
   *
   * "Sem cadastro pago" em vez de "sem cartão": o app tem assinatura, e dizer
   * que não há cartão em lugar nenhum seria falso.
   */
  link: 'Ou calcula de graça no link da bio, em dois minutos e sem cadastro ' +
    'pago: planetas, casas, aspectos e dignidades.',
}
