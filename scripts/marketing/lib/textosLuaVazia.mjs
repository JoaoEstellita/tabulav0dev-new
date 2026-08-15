/**
 * A Lua fora de curso, signo por signo.
 *
 * ── POR QUE DOZE E NÃO UM ──────────────────────────────────────────────────
 *
 * A medição de sessenta dias deu dezenove luas fora de curso: quase um terço de
 * tudo o que vai sair. Com um texto só, a peça mais frequente da conta seria
 * também a mais repetida.
 *
 * O que muda de uma para a outra é o signo onde a Lua está quando solta. É a
 * mesma mecânica com outro conteúdo emocional, e é isso que estes textos dizem.
 *
 * ── A VOZ, DEPOIS DO PRIMEIRO RETORNO REAL ─────────────────────────────────
 *
 * O João publicou e disse: "parece algo feito por IA". Medi os 99 textos e o
 * que denunciava era o ritmo: 84 caracteres de média por frase, mediana 80, e
 * só 9% de frases curtas. Toda frase com o mesmo peso vira metrônomo. Somado ao
 * dois-pontos em 76% dos textos e ao "costuma/tende a" em 38%, saía laudo.
 *
 * Aqui o ritmo é quebrado de propósito: frase longa, frase curta, frase de
 * quatro palavras. Terceira pessoa, sem "você" e sem gíria, que foi a voz que
 * ele escolheu.
 *
 * ── O QUE A PEÇA TEM ALÉM DISTO ────────────────────────────────────────────
 *
 * A janela real, em hora de Brasília. `luaForaDeCurso` calcula início, fim e
 * duração, e é o dado que quase nenhuma conta publica porque quase nenhuma
 * calcula. O texto é o significado; a janela é a prova.
 *
 * Sem travessão.
 */

export const LUA_VAZIA_POR_SIGNO = {
  'Áries': 'A Lua terminou o serviço em Áries e atravessa sozinha até Touro. O ' +
    'impulso continua. O alvo é que sumiu. Nessas horas se bate o pé por ' +
    'hábito, não por convicção, e discussão que começa esquenta rápido sem ' +
    'chegar a lugar nenhum. O que nasce agora perde o gás junto com a pressa ' +
    'que o gerou.',

  'Touro': 'A Lua fez o último aspecto em Touro e segue sozinha até Gêmeos. O ' +
    'corpo pede que nada mude, e dessa vez ele tem razão. Bom para terminar. ' +
    'Bom para arrumar. Ótimo para comer devagar. Só a compra grande fica para ' +
    'depois, porque parece óbvia agora e estranha na semana que vem.',

  'Gêmeos': 'A Lua soltou o último fio em Gêmeos e caminha sozinha até Câncer. ' +
    'A cabeça continua acelerada. As conversas é que não fecham. Muita ' +
    'mensagem, pouca decisão. Vale anotar o que aparecer e não cobrar ' +
    'conclusão, que ela não vem enquanto a Lua estiver assim.',

  'Câncer': 'A Lua fez o último aspecto em Câncer, onde é dona da casa, e ' +
    'atravessa sozinha até Leão. A emoção fica sem endereço. Sente-se muito e ' +
    'não se sabe bem sobre o quê, e a memória traz coisa antiga sem ninguém ' +
    'ter chamado. Não é hora de conversar sobre a relação. É hora de deixar ' +
    'assentar.',

  'Leão': 'A Lua terminou o curso em Leão e segue sozinha até Virgem. A vontade ' +
    'de aparecer continua, só que o palco está vazio. É a hora de postar e se ' +
    'arrepender. De cobrar reconhecimento de quem nem estava olhando. O que ' +
    'for lançado agora dificilmente encontra a plateia que merecia.',

  'Virgem': 'A Lua fez o último aspecto em Virgem e caminha sozinha até Libra. ' +
    'A vontade de organizar continua. O resultado, não. É a mesma linha ' +
    'revisada três vezes, a lista refeita sem precisar. Serve para limpar e ' +
    'arquivar. Não serve para avaliar o próprio trabalho, porque hoje a régua ' +
    'está torta.',

  'Libra': 'A Lua soltou o último aspecto em Libra e atravessa sozinha até ' +
    'Escorpião. A balança para no meio. Pesa dos dois lados e não escolhe ' +
    'nenhum. Acordo fechado agora costuma pedir uma segunda conversa, e não ' +
    'por má-fé de ninguém. É que faltava alguém inteiro na mesa.',

  'Escorpião': 'A Lua fez o último aspecto em Escorpião e segue sozinha até ' +
    'Sagitário. A intensidade continua e não tem onde descarregar. Daí nasce a ' +
    'mensagem das três da manhã. O que se suspeita nessas horas fala mais do ' +
    'próprio estado do que da outra pessoa.',

  'Sagitário': 'A Lua terminou o curso em Sagitário e caminha sozinha até ' +
    'Capricórnio. O otimismo continua, agora sem chão. Promete-se mais do que ' +
    'se vai entregar. Compra-se passagem para viagem que ainda nem existe. Bom ' +
    'para imaginar em voz alta. Ruim para assinar embaixo do que foi imaginado.',

  'Capricórnio': 'A Lua fez o último aspecto em Capricórnio e atravessa ' +
    'sozinha até Aquário. A cobrança continua e a estrutura não responde. ' +
    'Trabalha-se sem sair do lugar, e no fim do dia a conclusão errada é a de ' +
    'que faltou esforço. Reunião marcada para agora termina sem decisão.',

  'Aquário': 'A Lua soltou o último aspecto em Aquário e segue sozinha até ' +
    'Peixes. A distância que Aquário usa para pensar vira desligamento. A ' +
    'própria vida passa a ser vista de longe, como se fosse a de outra pessoa. ' +
    'Boa hora para ter ideia. Péssima para avaliar vínculo, porque tudo parece ' +
    'menos importante do que é.',

  'Peixes': 'A Lua fez o último aspecto em Peixes e caminha sozinha até Áries. ' +
    'O contorno se dissolve. Cansa-se sem motivo aparente, confunde-se o que é ' +
    'próprio com o que é do ambiente, e o sono fica pesado ou estranho. É o ' +
    'melhor trecho do ciclo para não fazer nada. E o pior para acreditar em ' +
    'tudo o que se sente.',
}

/** A regra da tradição, dita uma vez, sem virar superstição. */
export const REGRA_DA_TRADICAO =
  'A astrologia horária chama esse intervalo de fora de curso e diz que começo ' +
  'feito aqui não vinga. Não é proibição. É falta de engate. O que já está ' +
  'andando segue andando.'

export function textoDaLuaVazia(signo) {
  return LUA_VAZIA_POR_SIGNO[signo] || null
}
