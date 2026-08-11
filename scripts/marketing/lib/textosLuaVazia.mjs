/**
 * A Lua fora de curso, signo por signo.
 *
 * ── POR QUE DOZE E NÃO UM ──────────────────────────────────────────────────
 *
 * A medição de sessenta dias deu dezenove luas fora de curso: quase um terço de
 * tudo o que vai sair. Com um texto só, a peça mais frequente da conta seria
 * também a mais repetida, e o João já leu esse resultado uma vez e chamou de
 * "informações totalmente genéricas".
 *
 * O que muda de uma para a outra é o signo onde a Lua está quando solta. É a
 * mesma mecânica com outro conteúdo emocional, e é isso que estes textos dizem.
 *
 * ── O QUE A PEÇA TEM ALÉM DISTO ────────────────────────────────────────────
 *
 * A janela real, em hora de Brasília: "das 14h20 às 21h05". `luaForaDeCurso`
 * calcula início, fim e duração, e é o dado que quase nenhuma conta publica
 * porque quase nenhuma calcula. O texto é o significado; a janela é a prova.
 *
 * ── A REGRA DA TRADIÇÃO ────────────────────────────────────────────────────
 *
 * "Começo feito aqui tende a não vingar" é astrologia horária, com séculos de
 * uso. A peça diz isso sem transformar em superstição: nenhum texto manda
 * cancelar nada, e nenhum promete desgraça.
 *
 * Sem travessão.
 */

export const LUA_VAZIA_POR_SIGNO = {
  'Áries': 'A Lua terminou o que tinha a fazer em Áries e caminha sozinha até ' +
    'Touro. O impulso continua, mas sem alvo: é a hora em que se bate o pé por ' +
    'hábito e não por convicção, e em que discussão começada esquenta rápido e ' +
    'não conclui nada. O que for iniciado agora costuma perder o gás junto com ' +
    'o impulso que o gerou.',

  'Touro': 'A Lua já fez seu último aspecto em Touro e segue sozinha até ' +
    'Gêmeos. O corpo pede que nada mude, e essa é a leitura correta do ' +
    'período: bom para terminar, para arrumar, para comer devagar. Decisão de ' +
    'compra tomada agora costuma parecer óbvia na hora e estranha depois.',

  'Gêmeos': 'A Lua soltou os últimos fios em Gêmeos e caminha sozinha até ' +
    'Câncer. A cabeça continua acelerada e as conversas não fecham: muita ' +
    'mensagem, pouca decisão. É período de anotar o que aparecer sem cobrar ' +
    'conclusão, porque a conclusão não vem enquanto ela estiver assim.',

  'Câncer': 'A Lua fez seu último aspecto em Câncer, onde é dona da casa, e ' +
    'atravessa sozinha até Leão. A emoção fica sem endereço: sente-se muito e ' +
    'não se sabe bem sobre o quê, e a memória traz coisa antiga sem ser ' +
    'chamada. Não é hora de conversar sobre a relação, é hora de deixar ' +
    'assentar.',

  'Leão': 'A Lua terminou seu curso em Leão e segue sozinha até Virgem. A ' +
    'vontade de aparecer continua, mas o palco está vazio: é a hora em que se ' +
    'posta e se arrepende, em que se cobra reconhecimento de quem não estava ' +
    'olhando. O que for lançado agora dificilmente encontra a plateia que ' +
    'merecia.',

  'Virgem': 'A Lua já fez seu último aspecto em Virgem e caminha sozinha até ' +
    'Libra. A vontade de organizar continua sem entregar resultado: revisa-se ' +
    'a mesma linha três vezes, refaz-se a lista que já estava boa. Serve para ' +
    'limpar e arquivar. Não serve para julgar o próprio trabalho, porque a ' +
    'régua está torta.',

  'Libra': 'A Lua soltou o último aspecto em Libra e atravessa sozinha até ' +
    'Escorpião. A balança fica parada no meio: pesa-se dos dois lados e não se ' +
    'escolhe nenhum. Acordo fechado agora costuma precisar de nova conversa, e ' +
    'não porque alguém agiu de má-fé, mas porque ninguém estava inteiro na ' +
    'decisão.',

  'Escorpião': 'A Lua fez seu último aspecto em Escorpião e segue sozinha até ' +
    'Sagitário. A intensidade continua sem ter onde descarregar, e é aí que ' +
    'nasce a mensagem que se escreve às três da manhã. O que se suspeita agora ' +
    'costuma dizer mais sobre o próprio estado do que sobre a outra pessoa.',

  'Sagitário': 'A Lua terminou seu curso em Sagitário e caminha sozinha até ' +
    'Capricórnio. O otimismo continua, sem chão: promete-se mais do que se vai ' +
    'entregar, compra-se passagem para viagem que ainda não existe. Bom para ' +
    'imaginar em voz alta, ruim para assinar embaixo do que foi imaginado.',

  'Capricórnio': 'A Lua já fez seu último aspecto em Capricórnio e atravessa ' +
    'sozinha até Aquário. A cobrança continua e a estrutura não responde: ' +
    'trabalha-se sem sair do lugar e conclui-se, erradamente, que o problema é ' +
    'falta de esforço. Reunião marcada agora tende a terminar sem decisão.',

  'Aquário': 'A Lua soltou o último aspecto em Aquário e segue sozinha até ' +
    'Peixes. A distância que Aquário usa para pensar vira desligamento: ' +
    'observa-se a própria vida de longe, como se fosse de outra pessoa. É bom ' +
    'para ter ideia e péssimo para avaliar vínculo, porque tudo parece menos ' +
    'importante do que é.',

  'Peixes': 'A Lua fez seu último aspecto em Peixes e caminha sozinha até ' +
    'Áries. O contorno se dissolve: cansa-se sem motivo aparente, confunde-se ' +
    'o que é próprio com o que é do ambiente, e o sono fica mais pesado ou mais ' +
    'estranho. É o melhor trecho do ciclo para não fazer nada e o pior para ' +
    'acreditar em tudo o que se sente.',
}

/** A regra da tradição, dita uma vez, sem virar superstição. */
export const REGRA_DA_TRADICAO =
  'Astrologia horária chama de fora de curso e diz que começo feito aqui tende ' +
  'a não vingar. Não é proibição: é que falta engate. O que já está andando ' +
  'segue andando.'

export function textoDaLuaVazia(signo) {
  return LUA_VAZIA_POR_SIGNO[signo] || null
}
