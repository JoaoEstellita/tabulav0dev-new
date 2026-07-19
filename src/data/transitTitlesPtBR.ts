/**
 * Títulos temáticos por trânsito — a "definição" em negrito que abre o card,
 * antes da leitura, no estilo que o João pediu ("Momento de ousadia.").
 *
 * Chave idêntica à do catálogo de interpretações
 * (`transit:{planetaTransito}|{aspecto}|{alvoNatal}`), então mapeia 1:1 com os
 * 724 textos curados.
 *
 * COBERTURA PARCIAL POR DESIGN. Sem título, o card mostra o nome técnico como
 * sempre ("Urano (trânsito) ☌ Júpiter (natal)") — nada quebra e o catálogo cresce
 * em lotes. Este primeiro lote cobre os trânsitos de planetas lentos e sociais
 * sobre pontos pessoais, que são os que aparecem em destaque na tela.
 *
 * Regra de escrita: frase nominal curta, sem verbo no futuro, sem promessa. É um
 * rótulo do TEMA, não uma previsão.
 */
export const TRANSIT_TITLES_PTBR: Record<string, string> = {
  // ─── Saturno ──────────────────────────────────────────────────────────────
  'transit:saturn|conjuncao|sun': 'Hora de assumir o próprio peso',
  'transit:saturn|quadratura|sun': 'Prova de maturidade',
  'transit:saturn|oposicao|sun': 'Balanço de meio de ciclo',
  'transit:saturn|trigono|sun': 'Construção que se sustenta',
  'transit:saturn|sextil|sun': 'Chão firme sob os pés',
  'transit:saturn|conjuncao|moon': 'Recolhimento necessário',
  'transit:saturn|quadratura|moon': 'Frio nas emoções',
  'transit:saturn|oposicao|moon': 'Distância entre querer e poder',
  'transit:saturn|trigono|moon': 'Maturidade afetiva',
  'transit:saturn|conjuncao|venus': 'Amor posto à prova do tempo',
  'transit:saturn|quadratura|venus': 'Escassez afetiva',
  'transit:saturn|oposicao|venus': 'Medida no afeto',
  'transit:saturn|trigono|venus': 'Vínculo que amadurece',
  'transit:saturn|conjuncao|mercury': 'Pensamento denso',
  'transit:saturn|quadratura|mercury': 'Trava na comunicação',
  'transit:saturn|trigono|mercury': 'Clareza estruturada',
  'transit:saturn|conjuncao|mars': 'Força contida',
  'transit:saturn|quadratura|mars': 'Ação com freio de mão',
  'transit:saturn|trigono|mars': 'Persistência produtiva',
  'transit:saturn|conjuncao|ascendente': 'Nova imagem de si',
  'transit:saturn|conjuncao|meio_do_ceu': 'Cume da responsabilidade',
  'transit:saturn|quadratura|meio_do_ceu': 'Inverno da carreira',

  // ─── Júpiter ──────────────────────────────────────────────────────────────
  'transit:jupiter|conjuncao|sun': 'Momento de ousadia',
  'transit:jupiter|quadratura|sun': 'Risco de exagero',
  'transit:jupiter|oposicao|sun': 'Excesso de promessa',
  'transit:jupiter|trigono|sun': 'Janela de crescimento',
  'transit:jupiter|sextil|sun': 'Portas entreabertas',
  'transit:jupiter|conjuncao|moon': 'Vivificação do humor',
  'transit:jupiter|quadratura|moon': 'Fome que não se sacia',
  'transit:jupiter|trigono|moon': 'Bem-estar emocional',
  'transit:jupiter|conjuncao|venus': 'Prazer e generosidade',
  'transit:jupiter|quadratura|venus': 'Doçura em excesso',
  'transit:jupiter|trigono|venus': 'Encontros que somam',
  'transit:jupiter|conjuncao|mercury': 'Ideias em expansão',
  'transit:jupiter|quadratura|mercury': 'Promessa maior que a entrega',
  'transit:jupiter|conjuncao|mars': 'Dinamizando a própria vida',
  'transit:jupiter|conjuncao|meio_do_ceu': 'Visibilidade profissional',
  'transit:jupiter|trigono|meio_do_ceu': 'Reconhecimento merecido',

  // ─── Plutão ───────────────────────────────────────────────────────────────
  'transit:pluto|conjuncao|sun': 'Travessia que refunda',
  'transit:pluto|quadratura|sun': 'Queda de braço com o próprio poder',
  'transit:pluto|oposicao|sun': 'Espelho no outro',
  'transit:pluto|trigono|sun': 'Poder pessoal disponível',
  'transit:pluto|conjuncao|moon': 'Fundo emocional revirado',
  'transit:pluto|quadratura|moon': 'O que foi enterrado vivo',
  'transit:pluto|conjuncao|venus': 'Amor que transforma',
  'transit:pluto|quadratura|venus': 'Desejo e controle',
  'transit:pluto|trigono|venus': 'Intimidade verdadeira',
  'transit:pluto|conjuncao|mercury': 'Palavra que revira',
  'transit:pluto|quadratura|mercury': 'Verdade como arma',
  'transit:pluto|conjuncao|mars': 'Vontade em brasa',
  'transit:pluto|quadratura|meio_do_ceu': 'Disputa de poder na carreira',

  // ─── Urano ────────────────────────────────────────────────────────────────
  'transit:uranus|conjuncao|sun': 'Ruptura com o que era',
  'transit:uranus|quadratura|sun': 'Chão que treme',
  'transit:uranus|oposicao|sun': 'Liberdade em negociação',
  'transit:uranus|trigono|sun': 'Ar novo bem-vindo',
  'transit:uranus|conjuncao|moon': 'Inquietação emocional',
  'transit:uranus|quadratura|moon': 'Ninho que aperta',
  'transit:uranus|conjuncao|venus': 'Afeto sem amarras',
  'transit:uranus|quadratura|venus': 'Sobressalto no coração',
  'transit:uranus|conjuncao|mercury': 'Insight fora da curva',
  'transit:uranus|conjuncao|mars': 'Impulso elétrico',

  // ─── Netuno ───────────────────────────────────────────────────────────────
  'transit:neptune|conjuncao|sun': 'Contornos que se dissolvem',
  'transit:neptune|quadratura|sun': 'Névoa sobre a direção',
  'transit:neptune|oposicao|sun': 'Espelho embaçado',
  'transit:neptune|trigono|sun': 'Sensibilidade a favor',
  'transit:neptune|conjuncao|moon': 'Necessidade de se recolher',
  'transit:neptune|quadratura|moon': 'Saudade sem endereço',
  'transit:neptune|conjuncao|venus': 'Amor idealizado',
  'transit:neptune|quadratura|venus': 'Encanto que confunde',
  'transit:neptune|quadratura|mercury': 'Ruído na clareza',

  // ─── Mercúrio ─────────────────────────────────────────────────────────────
  'transit:mercury|conjuncao|sun': 'Mente em primeiro plano',
  'transit:mercury|quadratura|sun': 'Atrito na comunicação',
  'transit:mercury|oposicao|sun': 'Debate que não convence',
  'transit:mercury|trigono|sun': 'Boa comunicação',
  'transit:mercury|quadratura|moon': 'Razão versus sentimento',
  'transit:mercury|quadratura|mars': 'Palavra afiada',
  'transit:mercury|quadratura|saturn': 'Pensamento pesado',

  // ─── Marte ────────────────────────────────────────────────────────────────
  'transit:mars|conjuncao|sun': 'Energia em alta',
  'transit:mars|quadratura|sun': 'Briga com o próprio ritmo',
  'transit:mars|quadratura|moon': 'Pavio curto',
  'transit:mars|quadratura|venus': 'Querer à força',
  'transit:mars|conjuncao|mars': 'Retomada de impulso',
  'transit:mars|quadratura|saturn': 'Ação travada',

  // ─── Vênus ────────────────────────────────────────────────────────────────
  'transit:venus|conjuncao|sun': 'Prazer e diversão',
  'transit:venus|quadratura|sun': 'Agradar demais',
  'transit:venus|trigono|moon': 'Casa em paz',
  'transit:venus|quadratura|saturn': 'Afeto medido',
}
