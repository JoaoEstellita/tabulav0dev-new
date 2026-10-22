/**
 * O CLIMA EMOCIONAL do dia, derivado dos trânsitos.
 *
 * ⚠️ LEIA ISTO ANTES DE MEXER: estes números NÃO medem a emoção da pessoa.
 *
 * Não existe no app nenhum dado sobre o estado emocional real de ninguém — não
 * há questionário, sensor nem histórico de humor. O que existe é o céu. Então
 * "Ansiedade 58" não é um diagnóstico nem uma medição: é a leitura de quanto o
 * céu de hoje carrega o tipo de tensão que a tradição associa à ansiedade.
 *
 * A tela precisa dizer isso. Um número de dois dígitos ao lado da palavra
 * "Tristeza", sem moldura, é lido como afirmação sobre a pessoa — e seria uma
 * afirmação que o dado não sustenta.
 *
 * O cálculo é DETERMINÍSTICO: mesma entrada, mesmo número, sempre. Nada de IA
 * em runtime, nada de aleatório. Isso é o que permite testar e auditar.
 */

/**
 * Um trânsito, em QUALQUER das duas formas que existem no projeto.
 *
 * ⚠️ Elas têm nomes de campo diferentes, e isso quase derrubou esta tela em
 * silêncio. O backend grava `transitosRicos` com `{t, a, n, orb}`; o motor
 * local produz `personalTodayRich` com `{transitPlanet, type, natalPlanet}` e
 * SEM orbe. Ligar o componente numa delas esperando a outra não dá erro: os
 * campos vêm `undefined`, tudo é filtrado, a função devolve `null` e a seção
 * simplesmente nunca aparece.
 *
 * Também muda a ESCALA: em `transitosRicos` o `strength` vem 1; em
 * `personalTodayRich` vem de 0 a 100. Multiplicar direto faria todo número
 * saturar em 100 — seis anéis cheios, todo dia, para todo mundo.
 */
export type TransitoParaEmocao = {
  /** Planeta em trânsito (forma do backend). */
  t?: string
  /** Nome do aspecto (forma do backend). */
  a?: string
  /** Ponto natal tocado (forma do backend). */
  n?: string
  /** Planeta em trânsito (forma do motor local). */
  transitPlanet?: string
  /** Nome do aspecto (forma do motor local). */
  type?: string
  /** Ponto natal tocado (forma do motor local). */
  natalPlanet?: string
  /** Distância do ponto exato, em graus. Pode não existir. */
  orb?: number
  /** Peso do trânsito — 0–1 numa forma, 0–100 na outra. */
  strength?: number
}

/** O planeta, o aspecto e o alvo, venham eles de qual forma vierem. */
function lerTransito(t: TransitoParaEmocao) {
  return {
    planeta: norm(t?.t ?? t?.transitPlanet),
    aspecto: norm(t?.a ?? t?.type),
    alvo: norm(t?.n ?? t?.natalPlanet),
  }
}

/**
 * A força do trânsito, sempre entre 0 e 1.
 *
 * ⚠️ As duas fontes usam escalas diferentes: 1 numa, 0–100 na outra. Sem
 * normalizar, a mesma informação produziria números cem vezes maiores de um
 * lado — e a curva saturaria tudo em 100.
 *
 * Ausente vale 1, não 0: um trânsito sem o campo preenchido existe do mesmo
 * jeito, e zerá-lo o apagaria da conta.
 */
export function forcaNormalizada(strength: unknown): number {
  const n = Number(strength)
  if (!Number.isFinite(n) || n <= 0) return 1
  return n > 1 ? Math.min(1, n / 100) : Math.min(1, n)
}

export type ChaveEmocao = 'ansiedade' | 'stress' | 'raiva' | 'alegria' | 'tristeza' | 'otimismo'

export const EMOCOES: readonly ChaveEmocao[] = [
  'ansiedade', 'stress', 'raiva', 'alegria', 'tristeza', 'otimismo',
] as const

/** As quatro que pesam e as duas que aliviam — usado para o resumo e as cores. */
export const EMOCAO_PESA: Record<ChaveEmocao, boolean> = {
  ansiedade: true, stress: true, raiva: true, tristeza: true,
  alegria: false, otimismo: false,
}

const norm = (v: unknown) =>
  String(v || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z]/g, '')

/**
 * Aspectos DUROS: atrito, pressão, ajuste forçado.
 *
 * ⚠️ Os menores entram, e isso não é detalhe: desde `b96acf8` o motor trata
 * semiquadratura, sesquiquadratura e quincúncio como tensos, e eles são 17 dos
 * 120 trânsitos da amostra real. Deixá-los de fora faria o clima de dias
 * carregados parecer leve.
 */
const DUROS = new Set(['quadratura', 'oposicao', 'semiquadratura', 'sesquiquadratura', 'quincuncio'])
/** Aspectos MACIOS: fluxo, facilidade. */
const MACIOS = new Set(['trigono', 'sextil', 'semissextil'])

/**
 * A CONJUNÇÃO não tem natureza própria — quem decide é o planeta que chega.
 *
 * Saturno em conjunção pesa; Vênus em conjunção afaga. Tratar as duas como
 * "neutras" jogaria fora 22 dos 120 trânsitos da amostra, e são justamente os
 * mais fortes (orbe pequeno, contato direto).
 */
const CONJUNCAO_PESADA = new Set(['saturn', 'pluto', 'mars', 'neptune', 'uranus'])

/**
 * Afinidade de cada planeta com cada emoção, quando o aspecto PESA.
 *
 * As associações são as tradicionais: Marte com a raiva, Saturno com o peso e a
 * tristeza, Urano com o sobressalto e a ansiedade, Netuno com a névoa e o
 * desânimo, Plutão com a intensidade, Mercúrio com a mente acelerada.
 *
 * ⚠️ Só os dez planetas. Ângulos e nódulos entram como ALVO (abaixo), nunca
 * como agente — "o Ascendente faz quadratura" não existe; é sempre um planeta
 * chegando nele.
 */
const PESO_DURO: Record<string, Partial<Record<ChaveEmocao, number>>> = {
  mars:    { raiva: 1.0, stress: 0.7, ansiedade: 0.3 },
  saturn:  { tristeza: 0.9, stress: 0.8, ansiedade: 0.4 },
  uranus:  { ansiedade: 1.0, stress: 0.6, raiva: 0.3 },
  pluto:   { stress: 0.9, raiva: 0.6, ansiedade: 0.5 },
  neptune: { tristeza: 0.8, ansiedade: 0.5 },
  mercury: { ansiedade: 0.7, stress: 0.4 },
  sun:     { stress: 0.5, raiva: 0.3 },
  moon:    { tristeza: 0.6, ansiedade: 0.5 },
  venus:   { tristeza: 0.4, stress: 0.2 },
  jupiter: { stress: 0.3, ansiedade: 0.2 },
}

/**
 * Afinidade quando o aspecto ALIVIA — e aqui há valores NEGATIVOS.
 *
 * ⚠️ A primeira versão dava otimismo a TODOS os dez planetas, e isso media mal
 * a realidade: aspecto macio é comum (73 de 168 trânsitos reais) e Saturno e
 * Netuno são dois dos mais frequentes nele. O resultado era um piso — otimismo
 * nunca descia de 41, para ninguém. Um indicador que nunca desce não indica.
 *
 * O erro era astrológico antes de ser estatístico: Saturno em trígono não é
 * otimismo, é ESTRUTURA QUE SEGURA; Netuno macio é sensibilidade, não ânimo.
 * Agora eles aliviam a tensão em vez de inventar entusiasmo — e o alívio entra
 * como número negativo, que a curva depois trunca em zero.
 *
 * Medido depois da mudança: otimismo passou a usar de 0 a 82, e alguns dias
 * reais zeram a ansiedade, o que antes era impossível.
 */
const PESO_MACIO: Record<string, Partial<Record<ChaveEmocao, number>>> = {
  jupiter: { otimismo: 1.0, alegria: 0.7 },
  venus:   { alegria: 1.0, otimismo: 0.4 },
  sun:     { alegria: 0.6, otimismo: 0.7 },
  moon:    { alegria: 0.6 },
  mercury: { otimismo: 0.3, alegria: 0.2 },
  mars:    { alegria: 0.35 },
  uranus:  { alegria: 0.3 },
  // Saturno macio SEGURA: tira ansiedade e pressão em vez de animar.
  saturn:  { ansiedade: -0.35, stress: -0.25 },
  // Netuno macio embala: alivia o peso e acrescenta um pouco de leveza.
  neptune: { alegria: 0.25, tristeza: -0.2 },
  // Plutão macio sustenta o que é difícil.
  pluto:   { stress: -0.2 },
}

/**
 * O ALVO natal amplifica o que é da área dele.
 *
 * Um trânsito duro sobre a Lua mexe com o humor mais do que o mesmo trânsito
 * sobre Júpiter. Sem isto, o alvo não contaria — e o alvo é metade do aspecto.
 */
const AMPLIFICA_ALVO: Record<string, Partial<Record<ChaveEmocao, number>>> = {
  moon:    { tristeza: 1.35, ansiedade: 1.25, alegria: 1.25 },
  mercury: { ansiedade: 1.35, stress: 1.15 },
  mars:    { raiva: 1.35, stress: 1.15 },
  venus:   { alegria: 1.3, tristeza: 1.2 },
  sun:     { alegria: 1.15, stress: 1.15, otimismo: 1.15 },
  saturn:  { tristeza: 1.2, stress: 1.15 },
  jupiter: { otimismo: 1.3, alegria: 1.15 },
  ascendant: { ansiedade: 1.2, alegria: 1.1 },
  midheaven: { stress: 1.2 },
}

/**
 * Quanto o aspecto vale pela PROXIMIDADE do ponto exato.
 *
 * Um aspecto a 0,1° de distância age; o mesmo a 6° mal se sente. A queda é
 * suave e nunca chega a zero: o trânsito existe enquanto está no orbe.
 */
export function pesoDoOrbe(orb: unknown): number {
  const o = Number(orb)
  // ⚠️ Sem o campo vale 1, não 0.6. `personalTodayRich` NÃO traz orbe, e
  // penalizar todos os trânsitos dessa fonte faria a mesma pessoa ver números
  // menores dependendo de qual caminho carregou o dia.
  if (!Number.isFinite(o)) return 1
  return Math.max(0.25, 1 - Math.min(Math.abs(o), 8) / 10)
}

/**
 * A soma bruta de cada emoção, antes de virar 0–100.
 *
 * Exportada para o teste poder olhar o meio do caminho — e para a calibração
 * da curva ter como ser refeita quando a base mudar.
 */
/** O que UM trânsito acrescenta a cada emoção. Negativo = alivia. */
export type Contribuicao = {
  /** Os nomes como vieram, para a tela poder traduzir. */
  planeta: string
  aspecto: string
  alvo: string
  /** Quanto este trânsito somou naquela emoção. Pode ser negativo. */
  valor: number
}

/**
 * As contribuições de cada trânsito, emoção por emoção.
 *
 * ⚠️ É AQUI que a regra mora; `somasBrutas` só soma o que sai daqui. Ter a
 * conta num lugar só é o que garante que a explicação mostrada na tela seja
 * exatamente o que gerou o número — e não uma segunda versão da regra que um
 * dia discorda da primeira sem ninguém notar.
 */
export function contribuicoesPorEmocao(
  transitos: ReadonlyArray<TransitoParaEmocao>,
): Record<ChaveEmocao, Contribuicao[]> {
  const out: Record<ChaveEmocao, Contribuicao[]> = {
    ansiedade: [], stress: [], raiva: [], alegria: [], tristeza: [], otimismo: [],
  }
  for (const t of transitos || []) {
    const { planeta, aspecto, alvo } = lerTransito(t)
    if (!planeta || !aspecto) continue

    let pesa: boolean
    if (DUROS.has(aspecto)) pesa = true
    else if (MACIOS.has(aspecto)) pesa = false
    else if (aspecto === 'conjuncao') pesa = CONJUNCAO_PESADA.has(planeta)
    else continue // aspecto que o motor não emite: ignora em vez de adivinhar

    const tabela = pesa ? PESO_DURO[planeta] : PESO_MACIO[planeta]
    if (!tabela) continue

    const base = forcaNormalizada(t?.strength) * pesoDoOrbe(t?.orb)
    const amp = AMPLIFICA_ALVO[alvo] || {}
    const cru = {
      planeta: String(t?.t ?? t?.transitPlanet ?? ''),
      aspecto: String(t?.a ?? t?.type ?? ''),
      alvo: String(t?.n ?? t?.natalPlanet ?? ''),
    }

    for (const [chave, valor] of Object.entries(tabela) as [ChaveEmocao, number][]) {
      out[chave].push({ ...cru, valor: valor * base * (amp[chave] ?? 1) })
    }
  }
  // Maior influência primeiro; os alívios (negativos) no fim.
  for (const chave of EMOCOES) out[chave].sort((a, b) => b.valor - a.valor)
  return out
}

export function somasBrutas(transitos: ReadonlyArray<TransitoParaEmocao>): Record<ChaveEmocao, number> {
  const porEmocao = contribuicoesPorEmocao(transitos)
  const soma: Record<ChaveEmocao, number> = {
    ansiedade: 0, stress: 0, raiva: 0, alegria: 0, tristeza: 0, otimismo: 0,
  }
  for (const chave of EMOCOES) {
    soma[chave] = porEmocao[chave].reduce((acc, c) => acc + c.valor, 0)
  }
  return soma
}

/**
 * ⚠️ A CONSTANTE DA CURVA É CALIBRADA, não escolhida.
 *
 * A soma bruta não tem teto: um dia com oito trânsitos duros soma muito mais
 * que um com dois, e dividir pelo máximo teórico deixaria todo dia perto de
 * zero. A saída é uma curva que satura — cresce rápido no começo e encosta nos
 * 100 sem nunca estourar.
 *
 * MEDIDO contra 21 usuários reais (168 trânsitos), já com os pesos macios
 * corrigidos. Mediana das emoções que PESAM, por K:
 *
 *     K = 0.35  →  34        K = 0.55  →  48
 *     K = 0.45  →  41        K = 0.65  →  54
 *
 * Escolhido 0.45: o dia comum fica pouco abaixo da metade e sobra faixa para o
 * dia de fato carregado. Com 0.55 a mediana vai a 48 e o número começa a soar
 * alarme todo dia — e alarme que toca sempre deixa de ser alarme.
 *
 * Faixa efetiva com 0.45, nos dados reais:
 *
 *     ansiedade 0–83   stress 14–80   raiva 0–68
 *     alegria  20–74   tristeza 0–68  otimismo 0–82
 *
 * ⚠️ Duas correções minhas ficaram aqui de propósito: a primeira versão deste
 * comentário dizia "mediana perto de 45" com K=0.55, o que a medição desmentiu;
 * e a primeira tabela de pesos macios criava um PISO de otimismo em 41. Se a
 * base mudar, refazer a medição em vez de confiar nestes números.
 */
export const K_CURVA = 0.45

/** A soma bruta vira 0–100 por uma curva que satura. */
export function paraEscala(soma: number): number {
  if (!Number.isFinite(soma) || soma <= 0) return 0
  return Math.round(100 * (1 - Math.exp(-K_CURVA * soma)))
}

export type EmocaoDoDia = {
  chave: ChaveEmocao
  valor: number
  pesa: boolean
  /** Os trânsitos que produziram este número, do que mais pesa ao que alivia. */
  porque: Contribuicao[]
}

/**
 * As seis emoções do dia, de 0 a 100.
 *
 * Sem trânsito nenhum devolve `null` — e isso importa: zerar tudo diria "hoje
 * você não sente nada", quando o certo é "hoje não sabemos".
 */
export function emocoesDoDia(
  transitos: ReadonlyArray<TransitoParaEmocao> | null | undefined,
): EmocaoDoDia[] | null {
  const lista = Array.isArray(transitos)
    ? transitos.filter((t) => (t?.t ?? t?.transitPlanet) && (t?.a ?? t?.type))
    : []
  if (!lista.length) return null
  const porEmocao = contribuicoesPorEmocao(lista)
  return EMOCOES.map((chave) => ({
    chave,
    valor: paraEscala(porEmocao[chave].reduce((acc, c) => acc + c.valor, 0)),
    pesa: EMOCAO_PESA[chave],
    porque: porEmocao[chave],
  }))
}
