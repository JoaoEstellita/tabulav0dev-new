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
export function buildFallbackTransitTitle(
  transitPlanet: string,
  natalTarget: string,
  aspect: string,
): string | null {
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
