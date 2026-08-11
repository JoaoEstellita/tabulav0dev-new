/**
 * O que se mexe quando um trânsito cai em cada casa.
 *
 * ── POR QUE ISTO EXISTE ────────────────────────────────────────────────────
 *
 * O carrossel usava o catálogo natal do app: "A Lua na Casa 12 internaliza as
 * emoções de forma profunda, criando uma vida interior rica". É um bom texto e
 * está no lugar errado. Ele descreve quem NASCEU com a Lua na casa 12, uma
 * condição vitalícia. O slide fala de um quarto minguante que passa numa sexta.
 * São duas coisas diferentes com as mesmas palavras, e é exatamente o defeito
 * que o João apontou na peça de evento: "o texto fala da posição, não do que
 * muda agora".
 *
 * ── O QUE ESTES TEXTOS SÃO ─────────────────────────────────────────────────
 *
 * O território de cada casa dito em voz de acontecimento: como o movimento
 * costuma CHEGAR ali, não o que significa ter um planeta ali de nascença.
 * Servem para qualquer evento, porque a casa é o lugar e o evento é o que
 * acontece no lugar. O que muda de slide para slide é a casa que cada
 * ascendente recebe, e essa conta é exata.
 *
 * Sem travessão, sem "setor", sem "regência", sem defesa de método.
 */

export const CASA_EM_TRANSITO = {
  1: 'É a parte da vida em que você aparece: o corpo, o humor, o jeito de ' +
     'entrar num lugar. Movimento aqui é sentido na pele antes de ser ' +
     'entendido. Muda primeiro a disposição, depois o que você faz com ela.',

  2: 'Aqui está o que entra e o que você decide manter. Movimento nesta parte ' +
     'mexe com dinheiro, mas não só: mexe com o que vale o esforço. Às vezes a ' +
     'conta só fecha quando alguma coisa é largada.',

  3: 'O território das conversas curtas, dos irmãos, do trajeto de todo dia. ' +
     'Movimento aqui chega como mensagem que muda o rumo, papo que precisava ' +
     'acontecer, e cabeça acelerada de quem tem coisa demais aberta ao mesmo tempo.',

  4: 'A casa, a família, o chão. Movimento nesta parte raramente é público: ' +
     'mexe com quem mora com você, com o que a infância deixou, e com a ' +
     'vontade de arrumar a casa justamente quando o resto está bagunçado.',

  5: 'O que você faz porque quer, não porque deve: criar, namorar, jogar, os ' +
     'filhos. Movimento aqui devolve apetite e coragem, e cobra que você ' +
     'apareça em vez de assistir.',

  6: 'A rotina e o corpo funcionando: o trabalho de todo dia, a saúde, os ' +
     'ajustes pequenos. Movimento nesta parte não é dramático, é insistente. ' +
     'Costuma cobrar pelo cansaço o que não foi resolvido pelo método.',

  7: 'O outro. Sociedade, casamento, contrato, e também quem se opõe a você. ' +
     'Movimento aqui chega pelas pessoas: alguém procura, alguém cobra, alguém ' +
     'propõe, e a decisão deixa de ser só sua.',

  8: 'O que se divide com alguém: dinheiro junto, intimidade, dívida, e o que ' +
     'termina. Movimento nesta parte mexe com o que estava guardado. Raramente ' +
     'é confortável, e quase sempre é o que destrava o resto.',

  9: 'O que amplia a vista: estudo, viagem, fé, gente de fora. Movimento aqui ' +
     'vem como convite ou como inquietação, a sensação de que o mundo é maior ' +
     'do que a rotina vinha deixando ver.',

  10: 'A carreira e o que os outros veem de você. Movimento nesta parte é ' +
      'público: cobrança de quem manda, mudança de posição, seu nome circulando. ' +
      'O que você faz aqui é visto mesmo quando você preferia que não fosse.',

  11: 'Os grupos, as amizades, o que é de mais gente. Movimento aqui aparece ' +
      'como convite, como projeto coletivo, e às vezes como a percepção de que ' +
      'um grupo já não cabe mais em você.',

  12: 'O que acontece longe dos olhos: o descanso, o que você adia, o que ' +
      'precisa acabar. Movimento nesta parte é sentido antes de ser visto, ' +
      'costuma chegar como cansaço ou sono estranho, e o que se resolve aqui ' +
      'se resolve em silêncio.',
}

/** O texto da casa, ou string vazia se o número não for de 1 a 12. */
export function textoDaCasa(casa) {
  return CASA_EM_TRANSITO[casa] || ''
}
