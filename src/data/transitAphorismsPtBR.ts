/**
 * Aforismos por trânsito — frases curtas, proverbiais, para abrir a proativa do
 * agente no WhatsApp quando o trânsito do dia é forte.
 *
 * Registro DIFERENTE do catálogo de interpretações: aqui é uma linha só, no tom
 * de provérbio, para ser lida em 2 segundos. A interpretação longa continua no
 * app e no `transitCatalogOverridesPtBR`.
 *
 * Chave: `transit:{planetaEmTransito}|{aspecto}|{alvoNatal}` — mesmo padrão dos
 * demais catálogos. O alvo pode ser planeta ou ângulo (`ascendente`, `meio_do_ceu`).
 *
 * COBERTURA PARCIAL POR DESIGN. Quem consome deve tratar ausência como "sem
 * aforismo" e enviar a mensagem normal — assim o catálogo cresce em lotes sem
 * travar nada. Este primeiro lote prioriza os trânsitos que de fato disparam a
 * proativa: planetas lentos e sociais sobre pontos pessoais, que têm `strength`
 * alto e janela longa.
 */
export const TRANSIT_APHORISMS_PTBR: Record<string, string> = {
  // ─── Saturno: limite, tempo, estrutura ────────────────────────────────────
  'transit:saturn|conjuncao|sun': 'O ouro se prova no fogo; a pessoa, no tempo.',
  'transit:saturn|quadratura|sun': 'Muro que resiste é muro que ensina onde é a porta.',
  'transit:saturn|oposicao|sun': 'Toda conta chega — e quem a lê com calma paga menos.',
  'transit:saturn|trigono|sun': 'A colheita paciente não pede pressa ao sol.',
  'transit:saturn|sextil|sun': 'Alicerce firme não aparece na fotografia, mas sustenta a casa.',
  'transit:saturn|conjuncao|moon': 'Sentimento também precisa de teto e de porta.',
  'transit:saturn|quadratura|moon': 'Nem todo silêncio é frieza; às vezes é abrigo.',
  'transit:saturn|oposicao|moon': 'O coração pede colo, a vida pede prazo — cabe negociar.',
  'transit:saturn|trigono|moon': 'Casa arrumada por dentro dispensa barulho por fora.',
  'transit:saturn|conjuncao|venus': 'Amor que dura não teme a prova do tempo.',
  'transit:saturn|quadratura|venus': 'Quem cobra demais do afeto acaba pagando sozinho.',
  'transit:saturn|oposicao|venus': 'Distância também mede o quanto se quer.',
  'transit:saturn|trigono|venus': 'Vínculo antigo é vinho: melhora guardado com cuidado.',
  'transit:saturn|conjuncao|mercury': 'Palavra pesada é palavra pensada.',
  'transit:saturn|quadratura|mercury': 'Antes de convencer o outro, convença o papel.',
  'transit:saturn|trigono|mercury': 'Ideia bem amarrada não voa, mas chega.',
  'transit:saturn|conjuncao|mars': 'Força sem freio é força perdida na curva.',
  'transit:saturn|quadratura|mars': 'Empurrar porta trancada só cansa o ombro.',
  'transit:saturn|trigono|mars': 'Passo curto e constante vence a corrida longa.',
  'transit:saturn|conjuncao|ascendente': 'Quem se olha no espelho sem pressa aprende o próprio rosto.',
  'transit:saturn|conjuncao|meio_do_ceu': 'Cume alcançado devagar é cume que não desmorona.',
  'transit:saturn|quadratura|meio_do_ceu': 'Carreira também tem inverno; raiz cresce nele.',

  // ─── Júpiter: expansão, excesso, oportunidade ─────────────────────────────
  'transit:jupiter|conjuncao|sun': 'Vento a favor exige leme firme.',
  'transit:jupiter|quadratura|sun': 'Passo maior que a perna encurta o caminho.',
  'transit:jupiter|oposicao|sun': 'Nem tudo que reluz cabe na mala.',
  'transit:jupiter|trigono|sun': 'Porta aberta não espera quem chega amanhã.',
  'transit:jupiter|sextil|sun': 'Quem semeia com fé colhe com jeito.',
  'transit:jupiter|conjuncao|moon': 'Coração cheio transborda — escolha bem o copo.',
  'transit:jupiter|quadratura|moon': 'Apetite grande também engorda a saudade.',
  'transit:jupiter|trigono|moon': 'Casa com janela aberta respira melhor.',
  'transit:jupiter|conjuncao|venus': 'Generosidade é o afeto que não pede recibo.',
  'transit:jupiter|quadratura|venus': 'Doce demais também estraga o paladar.',
  'transit:jupiter|trigono|venus': 'Beleza que se compartilha volta em dobro.',
  'transit:jupiter|conjuncao|mercury': 'Boa ideia merece bom tamanho — nem mais, nem menos.',
  'transit:jupiter|quadratura|mercury': 'Quem promete demais entrega menos.',
  'transit:jupiter|conjuncao|mars': 'Coragem com direção move montanha; sem ela, só poeira.',
  'transit:jupiter|conjuncao|meio_do_ceu': 'Quem é visto de longe precisa estar inteiro de perto.',
  'transit:jupiter|trigono|meio_do_ceu': 'Reconhecimento chega mais leve a quem já fez o trabalho.',

  // ─── Plutão: transformação, poder, o que não volta ────────────────────────
  'transit:pluto|conjuncao|sun': 'Quem atravessa o fogo não sai igual — sai verdadeiro.',
  'transit:pluto|quadratura|sun': 'Segurar com força demais é o jeito mais rápido de perder.',
  'transit:pluto|oposicao|sun': 'O espelho mais duro é o que outro segura.',
  'transit:pluto|trigono|sun': 'Raiz profunda não teme vento forte.',
  'transit:pluto|conjuncao|moon': 'O que se enterra vivo continua batendo por baixo.',
  'transit:pluto|quadratura|moon': 'Emoção negada cobra juros.',
  'transit:pluto|conjuncao|venus': 'Amar de verdade é aceitar ser mudado.',
  'transit:pluto|quadratura|venus': 'Desejo que controla não é desejo, é medo.',
  'transit:pluto|trigono|venus': 'Vínculo que sobrevive à verdade fica inteiro.',
  'transit:pluto|conjuncao|mercury': 'Palavra dita no escuro tem peso de sentença.',
  'transit:pluto|quadratura|mercury': 'Nem toda verdade precisa ser arma.',
  'transit:pluto|conjuncao|mars': 'Vontade sem consciência vira demolição.',
  'transit:pluto|quadratura|meio_do_ceu': 'Poder que se agarra ao cargo já perdeu o posto.',

  // ─── Urano: ruptura, imprevisto, liberdade ────────────────────────────────
  'transit:uranus|conjuncao|sun': 'Quem não muda de ideia não muda de lugar.',
  'transit:uranus|quadratura|sun': 'Terremoto derruba o que já estava rachado.',
  'transit:uranus|oposicao|sun': 'Liberdade alheia também é liberdade.',
  'transit:uranus|trigono|sun': 'Vento novo só ajuda quem já içou a vela.',
  'transit:uranus|conjuncao|moon': 'Coração inquieto pede espaço, não explicação.',
  'transit:uranus|quadratura|moon': 'Ninho apertado ensina o pássaro a voar.',
  'transit:uranus|conjuncao|venus': 'Amor sem gaiola é o único que fica.',
  'transit:uranus|quadratura|venus': 'Novidade no afeto testa o que era hábito.',
  'transit:uranus|conjuncao|mercury': 'Ideia que assusta costuma ser a certa.',
  'transit:uranus|conjuncao|mars': 'Pressa somada a susto dá acidente.',

  // ─── Netuno: névoa, ideal, dissolução ─────────────────────────────────────
  'transit:neptune|conjuncao|sun': 'Quem se dissolve na névoa precisa de bússola, não de pressa.',
  'transit:neptune|quadratura|sun': 'Nem todo brilho é ouro; nem toda dúvida é fraqueza.',
  'transit:neptune|oposicao|sun': 'Espelho embaçado devolve o rosto que se quer ver.',
  'transit:neptune|trigono|sun': 'Sonho com raiz vira obra.',
  'transit:neptune|conjuncao|moon': 'Sensibilidade sem limite vira esponja.',
  'transit:neptune|quadratura|moon': 'Nem toda saudade é do que existiu.',
  'transit:neptune|conjuncao|venus': 'Amar o ideal é ficar sozinho com ele.',
  'transit:neptune|quadratura|venus': 'Quem enfeita demais esconde o que ama.',
  'transit:neptune|quadratura|mercury': 'Onde falta clareza, sobra suposição.',

  // ─── Mercúrio: palavra, mente, ruído ──────────────────────────────────────
  'transit:mercury|quadratura|sun': 'Se a palavra é prata, o silêncio é ouro.',
  'transit:mercury|conjuncao|sun': 'Quem pensa alto precisa ouvir baixo.',
  'transit:mercury|oposicao|sun': 'Discussão vencida raramente convence.',
  'transit:mercury|trigono|sun': 'Palavra na hora certa vale por mil na errada.',
  'transit:mercury|quadratura|moon': 'Fale ao coração antes de falar à razão.',
  'transit:mercury|quadratura|mars': 'Língua afiada corta primeiro quem a segura.',
  'transit:mercury|quadratura|saturn': 'Pensamento pesado também precisa de pausa.',

  // ─── Marte: ação, atrito, impulso ─────────────────────────────────────────
  'transit:mars|conjuncao|sun': 'Fogo aceso ilumina ou queima — depende do vento.',
  'transit:mars|quadratura|sun': 'Quem briga com o próprio ritmo perde as duas partidas.',
  'transit:mars|quadratura|moon': 'Irritação é medo com pressa.',
  'transit:mars|quadratura|venus': 'Querer à força afasta o que se quer.',
  'transit:mars|conjuncao|mars': 'Força renovada pede alvo escolhido.',
  'transit:mars|quadratura|saturn': 'Empurrar parede cansa; procurar a porta resolve.',

  // ─── Vênus: afeto, valor, medida ──────────────────────────────────────────
  'transit:venus|conjuncao|sun': 'Quem se gosta em paz atrai sem esforço.',
  'transit:venus|quadratura|sun': 'Agradar a todos é desagradar a si.',
  'transit:venus|trigono|moon': 'Casa em paz é o melhor perfume.',
  'transit:venus|quadratura|saturn': 'Afeto medido demais deixa de aquecer.',
}
