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

  // ─── Lote 2: planetas lentos sobre pontos pessoais ──────────────────────
  // São os que o aviso do dia usa: ele mostra o trânsito de maior força, e
  // força alta quase sempre é planeta lento. Sem título aqui, a frase mais
  // lida da Home cai no gerado.

  'transit:jupiter|conjuncao|ascendente': 'Presença que ocupa mais espaço',
  'transit:jupiter|oposicao|ascendente': 'Excesso que vem do outro',
  'transit:jupiter|quadratura|ascendente': 'Promessa maior que o corpo',
  'transit:jupiter|sextil|ascendente': 'Porta que se abre ao chegar',
  'transit:jupiter|trigono|ascendente': 'Facilidade de ser bem recebido',
  'transit:jupiter|oposicao|mars': 'Impulso sem medida',
  'transit:jupiter|quadratura|mars': 'Ambição maior que a força',
  'transit:jupiter|sextil|mars': 'Coragem com boa hora',
  'transit:jupiter|trigono|mars': 'Ação que rende',
  'transit:jupiter|oposicao|meio_do_ceu': 'Casa pesa mais que carreira',
  'transit:jupiter|quadratura|meio_do_ceu': 'Ambição em descompasso',
  'transit:jupiter|sextil|meio_do_ceu': 'Chance no trabalho',
  'transit:jupiter|oposicao|mercury': 'Ideia grande demais para o prazo',
  'transit:jupiter|sextil|mercury': 'Conversa que abre caminho',
  'transit:jupiter|trigono|mercury': 'Pensamento amplo e claro',
  'transit:jupiter|oposicao|moon': 'Emoção que transborda',
  'transit:jupiter|sextil|moon': 'Acolhimento fácil',
  'transit:jupiter|oposicao|venus': 'Afeto que pede demais',
  'transit:jupiter|sextil|venus': 'Convite agradável',
  'transit:saturn|oposicao|ascendente': 'Cobrança que vem de fora',
  'transit:saturn|quadratura|ascendente': 'Imagem em revisão dura',
  'transit:saturn|sextil|ascendente': 'Postura que se firma',
  'transit:saturn|trigono|ascendente': 'Seriedade que cai bem',
  'transit:saturn|oposicao|mars': 'Força que esbarra em muro',
  'transit:saturn|sextil|mars': 'Esforço bem dirigido',
  'transit:saturn|oposicao|meio_do_ceu': 'Peso entre casa e trabalho',
  'transit:saturn|sextil|meio_do_ceu': 'Degrau construído com calma',
  'transit:saturn|trigono|meio_do_ceu': 'Reconhecimento que se sustenta',
  'transit:saturn|oposicao|mercury': 'Diálogo que trava',
  'transit:saturn|sextil|mercury': 'Palavra medida',
  'transit:saturn|sextil|moon': 'Segurança emocional discreta',
  'transit:saturn|sextil|venus': 'Afeto sóbrio e firme',
  'transit:uranus|conjuncao|ascendente': 'Virada na própria pele',
  'transit:uranus|oposicao|ascendente': 'Imprevisto que vem do outro',
  'transit:uranus|quadratura|ascendente': 'Inquietação na própria imagem',
  'transit:uranus|sextil|ascendente': 'Abertura para mudar de forma',
  'transit:uranus|trigono|ascendente': 'Originalidade sem atrito',
  'transit:uranus|oposicao|mars': 'Reação fora de hora',
  'transit:uranus|quadratura|mars': 'Reação em curto-circuito',
  'transit:uranus|sextil|mars': 'Coragem de tentar diferente',
  'transit:uranus|trigono|mars': 'Ousadia que funciona',
  'transit:uranus|conjuncao|meio_do_ceu': 'Guinada na carreira',
  'transit:uranus|oposicao|meio_do_ceu': 'Raízes contra o rumo',
  'transit:uranus|quadratura|meio_do_ceu': 'Rota profissional sacudida',
  'transit:uranus|sextil|meio_do_ceu': 'Caminho novo no trabalho',
  'transit:uranus|trigono|meio_do_ceu': 'Liberdade que cabe no ofício',
  'transit:uranus|oposicao|mercury': 'Ideia que choca',
  'transit:uranus|quadratura|mercury': 'Pensamento acelerado demais',
  'transit:uranus|sextil|mercury': 'Insight que chega inteiro',
  'transit:uranus|trigono|mercury': 'Clareza repentina',
  'transit:uranus|oposicao|moon': 'Humor sem aviso',
  'transit:uranus|sextil|moon': 'Espaço para sentir diferente',
  'transit:uranus|trigono|moon': 'Emoção que se solta',
  'transit:uranus|sextil|sun': 'Vontade de experimentar',
  'transit:uranus|oposicao|venus': 'Atração inesperada',
  'transit:uranus|sextil|venus': 'Encontro fora do roteiro',
  'transit:uranus|trigono|venus': 'Liberdade que combina',
  'transit:neptune|conjuncao|ascendente': 'Contorno que se dissolve',
  'transit:neptune|oposicao|ascendente': 'Névoa no espelho do outro',
  'transit:neptune|quadratura|ascendente': 'Imagem fora de foco',
  'transit:neptune|sextil|ascendente': 'Presença mais suave',
  'transit:neptune|trigono|ascendente': 'Encanto natural',
  'transit:neptune|conjuncao|mars': 'Força que escorre',
  'transit:neptune|oposicao|mars': 'Vontade sem direção',
  'transit:neptune|quadratura|mars': 'Energia que não encontra alvo',
  'transit:neptune|sextil|mars': 'Ação inspirada',
  'transit:neptune|trigono|mars': 'Esforço que flui sem peso',
  'transit:neptune|conjuncao|meio_do_ceu': 'Vocação em busca de sentido',
  'transit:neptune|oposicao|meio_do_ceu': 'Rumo profissional difuso',
  'transit:neptune|quadratura|meio_do_ceu': 'Carreira sem contorno',
  'transit:neptune|sextil|meio_do_ceu': 'Trabalho com alma',
  'transit:neptune|trigono|meio_do_ceu': 'Ofício que inspira',
  'transit:neptune|conjuncao|mercury': 'Pensamento em bruma',
  'transit:neptune|oposicao|mercury': 'Mal-entendido no ar',
  'transit:neptune|sextil|mercury': 'Intuição que encontra palavra',
  'transit:neptune|trigono|mercury': 'Imaginação articulada',
  'transit:neptune|oposicao|moon': 'Sensibilidade sem borda',
  'transit:neptune|sextil|moon': 'Ternura silenciosa',
  'transit:neptune|trigono|moon': 'Emoção que embala',
  'transit:neptune|sextil|sun': 'Clareza vinda da calma',
  'transit:neptune|oposicao|venus': 'Idealização do afeto',
  'transit:neptune|sextil|venus': 'Beleza que comove',
  'transit:neptune|trigono|venus': 'Amor sem exigência',
  'transit:pluto|conjuncao|ascendente': 'Outra pessoa no espelho',
  'transit:pluto|oposicao|ascendente': 'Intensidade que vem do outro',
  'transit:pluto|quadratura|ascendente': 'Imagem sob pressão',
  'transit:pluto|sextil|ascendente': 'Presença que ganha peso',
  'transit:pluto|trigono|ascendente': 'Força tranquila',
  'transit:pluto|oposicao|mars': 'Disputa de força',
  'transit:pluto|quadratura|mars': 'Vontade contra vontade',
  'transit:pluto|sextil|mars': 'Determinação bem usada',
  'transit:pluto|trigono|mars': 'Potência sem desperdício',
  'transit:pluto|conjuncao|meio_do_ceu': 'Virada de rumo na vida pública',
  'transit:pluto|oposicao|meio_do_ceu': 'Raiz revirada pela carreira',
  'transit:pluto|sextil|meio_do_ceu': 'Autoridade que se constrói',
  'transit:pluto|trigono|meio_do_ceu': 'Poder que se assenta',
  'transit:pluto|oposicao|mercury': 'Palavra que fere',
  'transit:pluto|sextil|mercury': 'Pensamento que vai ao fundo',
  'transit:pluto|trigono|mercury': 'Clareza sobre o que estava oculto',
  'transit:pluto|oposicao|moon': 'Emoção que vem do porão',
  'transit:pluto|sextil|moon': 'Verdade afetiva que emerge',
  'transit:pluto|trigono|moon': 'Profundidade sem susto',
  'transit:pluto|sextil|sun': 'Vontade que se afirma',
  'transit:pluto|oposicao|venus': 'Desejo que domina',
  'transit:pluto|sextil|venus': 'Vínculo que se aprofunda',
}

/**
 * O que o planeta EM TRÂNSITO traz. Ele é o agente: é ele que se move e provoca.
 *
 * A primeira versão deste gerador ignorava o agente e só olhava alvo + aspecto —
 * por isso Marte, Lua e Saturno quincúncio Saturno viravam três cards com o
 * mesmíssimo "Ajuste na estrutura". Com o agente, os três se separam.
 */
const AGENTE_EM_TRANSITO: Record<string, string> = {
  sun: 'Vitalidade',
  moon: 'Sensibilidade',
  mercury: 'Raciocínio',
  venus: 'Afeto',
  mars: 'Impulso',
  jupiter: 'Otimismo',
  saturn: 'Cobrança',
  uranus: 'Inquietação',
  neptune: 'Devaneio',
  pluto: 'Intensidade',
  chiron: 'Ferida',
  lilith: 'Instinto',
  northnode: 'Chamado',
  southnode: 'Hábito antigo',
}

/** O ponto natal tocado, como substantivo nu — o que ali é atingido. */
const ALVO_NATAL: Record<string, string> = {
  sun: 'identidade',
  moon: 'mundo emocional',
  mercury: 'comunicação',
  venus: 'afetos',
  mars: 'ação',
  jupiter: 'expansão',
  saturn: 'estrutura',
  uranus: 'liberdade',
  neptune: 'imaginação',
  pluto: 'poder pessoal',
  chiron: 'ferida antiga',
  lilith: 'o que foi reprimido',
  northnode: 'direção de vida',
  southnode: 'bagagem antiga',
  asc: 'imagem',
  dc: 'parcerias',
  mc: 'carreira',
  ic: 'raízes',
  ascendant: 'imagem',
  ascendente: 'imagem',
  descendant: 'parcerias',
  descendente: 'parcerias',
  midheaven: 'carreira',
  meiodoceu: 'carreira',
  imumcoeli: 'raízes',
  fundodoceu: 'raízes',
}

/**
 * Como os dois se encontram.
 *
 * Todos são locuções invariáveis de propósito ("em choque", não "chocados"):
 * assim o título nunca precisa concordar em gênero com dois substantivos de
 * gêneros diferentes ("Sensibilidade e poder pessoal ..." quebraria qualquer
 * adjetivo). Aspecto desconhecido cai em "em contato".
 */
const ENCONTRO_DO_ASPECTO: Record<string, string> = {
  conjuncao: 'no mesmo ponto',
  sextil: 'em sintonia',
  trigono: 'em fluxo',
  quadratura: 'em choque',
  oposicao: 'em polos opostos',
  quincuncio: 'sem encaixe',
  semissextil: 'de raspão',
  semiquadratura: 'em fricção',
  sesquiquadratura: 'em atrito',
}

/**
 * Planeta em cima da própria posição natal: isso tem nome próprio na tradição e
 * é um marco de ciclo, não um encontro entre duas coisas. "Impulso e ação no
 * mesmo ponto" descreveria mal o retorno de Marte.
 */
const NOME_DO_PLANETA: Record<string, string> = {
  sun: 'Sol',
  moon: 'Lua',
  mercury: 'Mercúrio',
  venus: 'Vênus',
  mars: 'Marte',
  jupiter: 'Júpiter',
  saturn: 'Saturno',
  uranus: 'Urano',
  neptune: 'Netuno',
  pluto: 'Plutão',
  chiron: 'Quíron',
}

/**
 * Título de reserva, gerado.
 *
 * O catálogo curado cobre 87 das 724 chaves. Sem isto, uns cards apareciam com
 * título temático e outros com o nome técnico cru, e a lista alternava duas
 * anatomias no mesmo scroll. O gerado é mais pobre que o curado (por isso o
 * curado vem primeiro), mas dá a todo card a mesma forma.
 *
 * Formato: "{agente} e {alvo} {encontro}" — "Impulso e estrutura em choque".
 * 14 agentes × 26 alvos × 9 aspectos: repetição só quando o trânsito repete
 * mesmo. Cabe numa linha.
 *
 * Só pt-BR — os outros idiomas seguem mostrando o nome técnico como título.
 */
/**
 * O tema de cada casa, em duas ou três palavras.
 *
 * Serve ao ingresso ("Júpiter entra na Casa 2"), que não tem planeta natal do
 * outro lado — o alvo é a casa. Sem isto, os 119 ingressos do catálogo ficavam
 * sem título nenhum: o gerador procurava um alvo em ALVO_NATAL, não achava
 * `house_2` e devolvia null.
 *
 * Texto curto de propósito: entra dentro de uma frase nominal já começada.
 */
const AREA_DA_CASA: Record<string, string> = {
  '1': 'imagem e presença',
  '2': 'recursos e segurança',
  '3': 'conversas e rotina',
  '4': 'casa e raízes',
  '5': 'prazer e criação',
  '6': 'trabalho e saúde',
  '7': 'parcerias',
  '8': 'o que se partilha',
  '9': 'horizonte e estudo',
  '10': 'carreira e imagem pública',
  '11': 'amizades e projetos',
  '12': 'retiro e bastidores',
}

export function buildFallbackTransitTitle(
  transitPlanet: string,
  natalTarget: string,
  aspect: string,
): string | null {
  // Ingresso: o alvo é uma casa, não um planeta.
  const casa = /^house_?(\d{1,2})$/.exec(String(natalTarget || '').trim().toLowerCase())
  if (casa) {
    const area = AREA_DA_CASA[casa[1]]
    const agenteCasa = AGENTE_EM_TRANSITO[normalizeChave(transitPlanet)]
    if (area && agenteCasa) return `${capitalizar(agenteCasa)} em ${area}`
    if (area) return `Novo ciclo em ${area}`
  }

  const alvo = ALVO_NATAL[normalizeChave(natalTarget)]
  if (!alvo) return null

  const agenteNorm = normalizeChave(transitPlanet)
  if (agenteNorm === normalizeChave(natalTarget) && normalizeChave(aspect) === 'conjuncao') {
    const nome = NOME_DO_PLANETA[agenteNorm]
    if (nome) return `Retorno de ${nome}`
  }

  const encontro = ENCONTRO_DO_ASPECTO[normalizeChave(aspect)] || 'em contato'
  const agente = AGENTE_EM_TRANSITO[agenteNorm]
  // Sem agente conhecido, degrada para a forma curta em vez de sumir.
  if (!agente) return `${capitalizar(alvo)} ${encontro}`

  return `${agente} e ${alvo} ${encontro}`
}

function capitalizar(v: string): string {
  return v.charAt(0).toUpperCase() + v.slice(1)
}

function normalizeChave(v: string): string {
  return String(v || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // tira acento: "Fundo do Céu" e "Fundo do Ceu" sao a mesma chave
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '') // tira espaco/pontuacao: "Fundo do Ceu" -> "fundodoceu"
}
