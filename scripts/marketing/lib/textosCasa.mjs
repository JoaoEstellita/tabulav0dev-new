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
  1:
     'É a parte da vida em que a pessoa aparece. O corpo, o humor, o jeito ' +
     'de entrar num lugar. Movimento aqui se sente na pele antes de ser ' +
     'entendido. Muda primeiro a disposição, depois o que se faz com ela.',

  2:
     'Aqui está o que entra e o que se decide manter. Movimento nesta parte ' +
     'mexe com dinheiro, mas não só. Mexe com o que vale o esforço. Às vezes ' +
     'a conta só fecha quando alguma coisa é largada.',

  3:
     'O território das conversas curtas, dos irmãos, do trajeto de todo dia. ' +
     'Movimento aqui chega como mensagem que muda o rumo. Como papo que ' +
     'precisava acontecer. E como cabeça acelerada de quem tem coisa demais ' +
     'aberta ao mesmo tempo.',

  4:
     'A casa, a família, o chão. Movimento nesta parte raramente é público. ' +
     'Mexe com quem mora junto, com o que a infância deixou, e com a vontade ' +
     'de arrumar a casa justamente quando o resto está bagunçado.',

  5:
     'O que se faz por querer, não por dever. Criar, namorar, jogar, os ' +
     'filhos. Movimento aqui devolve apetite e coragem. E cobra presença, em ' +
     'vez de plateia.',

  6:
     'A rotina e o corpo funcionando. O trabalho de todo dia, a saúde, os ' +
     'ajustes pequenos. Movimento nesta parte não é dramático. É insistente. ' +
     'Cobra pelo cansaço o que não foi resolvido pelo método.',

  7:
     'O outro. Sociedade, casamento, contrato, e também quem se opõe. ' +
     'Movimento aqui chega pelas pessoas. Alguém procura, alguém cobra, ' +
     'alguém propõe. E a decisão deixa de ser de uma pessoa só.',

  8:
     'O que se divide com alguém. Dinheiro junto, intimidade, dívida, e o ' +
     'que termina. Movimento nesta parte mexe com o que estava guardado. ' +
     'Raramente é confortável. Quase sempre é o que destrava o resto.',

  9:
     'O que amplia a vista. Estudo, viagem, fé, gente de fora. Movimento ' +
     'aqui vem como convite ou como inquietação. A sensação de que o mundo é ' +
     'maior do que a rotina vinha deixando ver.',

  10:
     'A carreira e o que os outros enxergam. Movimento nesta parte é ' +
     'público. Cobrança de quem manda, mudança de posição, o nome ' +
     'circulando. O que se faz aqui é visto mesmo quando se preferia que não ' +
     'fosse.',

  11:
     'Os grupos, as amizades, o que é de mais gente. Movimento aqui aparece ' +
     'como convite e como projeto coletivo. Às vezes aparece como a ' +
     'percepção de que um grupo já não cabe mais.',

  12:
     'O que acontece longe dos olhos. O descanso, o que se adia, o que ' +
     'precisa acabar. Movimento nesta parte se sente antes de ser visto. ' +
     'Chega como cansaço ou sono estranho. E o que se resolve aqui se ' +
     'resolve em silêncio.',
}

/** O texto da casa, ou string vazia se o número não for de 1 a 12. */
export function textoDaCasa(casa) {
  return CASA_EM_TRANSITO[casa] || ''
}
