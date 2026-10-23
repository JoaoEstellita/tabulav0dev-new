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
 * "Desânimo", sem moldura, é lido como afirmação sobre a pessoa — e seria uma
 * afirmação que o dado não sustenta.
 *
 * ⚠️ REGRA DE DESENHO, aprendida medindo: CADA EMOÇÃO PRECISA DE UM PLANETA
 * DOMINANTE SÓ DELA. A primeira versão tinha seis palavras e três pares que
 * eram a mesma informação com nomes diferentes — alegria×otimismo r=+0,81,
 * stress×raiva r=+0,81, ansiedade×stress r=+0,75 nos 21 usuários reais. Dois
 * anéis que leem os mesmos planetas se mexem juntos para sempre, e o segundo
 * não acrescenta nada à tela. "Stress" era o pior caso: não tinha planeta
 * próprio, era a soma de tudo que é duro.
 *
 * Antes de acrescentar ou renomear qualquer emoção aqui, medir o cosseno entre
 * o vetor de pesos dela e os das outras. Acima de ~0,7 é anel repetido.
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
 * saturar em 100 — todos os anéis cheios, todo dia, para todo mundo.
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

export type ChaveEmocao =
  | 'ansiedade'
  | 'irritacao'
  | 'pressao'
  | 'confusao'
  | 'desanimo'
  | 'calma'
  | 'animo'
  | 'afeto'

/**
 * A ordem em que os anéis aparecem.
 *
 * Tensão primeiro, alívio depois — e `desanimo` encosta em `calma` de propósito:
 * são os dois polos do mesmo eixo (o peso e o chão), e lado a lado um dá
 * contexto ao outro.
 */
export const EMOCOES: readonly ChaveEmocao[] = [
  'ansiedade', 'irritacao', 'pressao', 'confusao',
  'desanimo', 'calma', 'animo', 'afeto',
] as const

/** As cinco que pesam e as três que aliviam — usado no texto do detalhe. */
export const EMOCAO_PESA: Record<ChaveEmocao, boolean> = {
  ansiedade: true, irritacao: true, pressao: true, confusao: true, desanimo: true,
  calma: false, animo: false, afeto: false,
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
 * Cada emoção tem UM planeta dominante (peso 1.0) e nenhum planeta é dominante
 * em duas. É isso que mantém os anéis independentes — ver a regra no topo.
 *
 *     Urano    → ansiedade   (sobressalto, chão que se move)
 *     Marte    → irritação   (pavio curto, atrito)
 *     Plutão   → pressão     (cobrança, intensidade que não dá para desviar)
 *     Netuno   → confusão    (névoa, falta de clareza)
 *     Saturno  → desânimo    (peso, cansaço, porta fechada)
 *
 * ⚠️ NETUNO NÃO ALIMENTA O DESÂNIMO. Ele alimentava, e isso deixava desânimo e
 * confusão correlacionados em +0,68 nos dados reais — dois anéis contando o
 * mesmo Netuno. O peso que o desânimo perdeu foi para Vênus duro (0,55), que é
 * o desgosto propriamente dito.
 *
 * ⚠️ Só os dez planetas. Ângulos e nódulos entram como ALVO (abaixo), nunca
 * como agente — "o Ascendente faz quadratura" não existe; é sempre um planeta
 * chegando nele.
 *
 * ⚠️ A LUA aqui é código morto na prática: nos 168 trânsitos reais ela aparece
 * 0 vez em aspecto duro (o motor não emite — ela muda de aspecto em horas).
 * Fica porque não custa nada e porque como ALVO ela é das mais importantes.
 */
const PESO_DURO: Record<string, Partial<Record<ChaveEmocao, number>>> = {
  uranus:  { ansiedade: 1.0, irritacao: 0.30, confusao: 0.20 },
  mars:    { irritacao: 1.0, pressao: 0.30, ansiedade: 0.25 },
  pluto:   { pressao: 1.0, irritacao: 0.35, ansiedade: 0.30 },
  neptune: { confusao: 1.0 },
  saturn:  { desanimo: 1.0, pressao: 0.40, ansiedade: 0.25 },
  mercury: { ansiedade: 0.80, confusao: 0.35 },
  venus:   { desanimo: 0.55 },
  sun:     { pressao: 0.45, irritacao: 0.30 },
  moon:    { desanimo: 0.50, ansiedade: 0.40 },
  jupiter: { pressao: 0.30, ansiedade: 0.20 },
}

/**
 * Afinidade quando o aspecto ALIVIA. Mesma regra: um dominante por emoção.
 *
 *     Júpiter  → ânimo   (vontade, horizonte aberto)
 *     Vênus    → afeto   (ternura, prazer, gosto pelas coisas)
 *     Saturno  → calma   (estrutura que segura, chão firme)
 *
 * ⚠️ NÃO HÁ MAIS PESO NEGATIVO AQUI, e a troca foi deliberada. Antes, Saturno
 * macio *subtraía* da ansiedade; o alívio existia no cálculo mas era invisível
 * na tela, e a pessoa lia "Ansiedade 40" sem saber que havia sido abatida.
 * Agora o mesmo Saturno macio ACENDE a Calma: "Ansiedade 60 · Calma 65" conta
 * os dois fatos, que são dois trânsitos diferentes, em vez de esconder um
 * dentro do outro.
 *
 * ⚠️ Saturno e Netuno macios NÃO dão ânimo, e isso já foi um bug. Dar otimismo
 * aos dez planetas criava um PISO: como aspecto macio é comum (73 de 168
 * trânsitos reais) e Saturno e Netuno são dos mais frequentes nele, o número
 * nunca descia de 41 para ninguém — e indicador que nunca desce não indica.
 * Saturno em trígono é estrutura, não entusiasmo; Netuno macio é sensibilidade.
 */
const PESO_MACIO: Record<string, Partial<Record<ChaveEmocao, number>>> = {
  jupiter: { animo: 1.0, afeto: 0.30 },
  venus:   { afeto: 1.0, animo: 0.35 },
  saturn:  { calma: 1.0 },
  sun:     { animo: 0.80, calma: 0.20 },
  moon:    { afeto: 0.70, calma: 0.30 },
  mars:    { animo: 0.50 },
  pluto:   { calma: 0.50, animo: 0.20 },
  neptune: { calma: 0.45, afeto: 0.30 },
  uranus:  { animo: 0.40 },
  mercury: { animo: 0.30, calma: 0.30 },
}

/**
 * O ALVO natal amplifica o que é da área dele.
 *
 * Um trânsito duro sobre a Lua mexe com o humor mais do que o mesmo trânsito
 * sobre Júpiter. Sem isto, o alvo não contaria — e o alvo é metade do aspecto.
 */
const AMPLIFICA_ALVO: Record<string, Partial<Record<ChaveEmocao, number>>> = {
  moon:      { desanimo: 1.30, ansiedade: 1.25, afeto: 1.30 },
  mercury:   { ansiedade: 1.35, confusao: 1.30 },
  mars:      { irritacao: 1.35, pressao: 1.15 },
  venus:     { afeto: 1.30, desanimo: 1.15 },
  sun:       { animo: 1.15, pressao: 1.15 },
  saturn:    { desanimo: 1.20, calma: 1.15 },
  jupiter:   { animo: 1.30 },
  neptune:   { confusao: 1.20 },
  ascendant: { ansiedade: 1.20, animo: 1.10 },
  midheaven: { pressao: 1.25 },
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
/** O que UM trânsito acrescenta a cada emoção. */
export type Contribuicao = {
  /** Os nomes como vieram, para a tela poder traduzir. */
  planeta: string
  aspecto: string
  alvo: string
  /** Quanto este trânsito somou naquela emoção. */
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
    ansiedade: [], irritacao: [], pressao: [], confusao: [],
    desanimo: [], calma: [], animo: [], afeto: [],
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
  // Maior influência primeiro. O detalhe na tela lê nesta ordem.
  for (const chave of EMOCOES) out[chave].sort((a, b) => b.valor - a.valor)
  return out
}

export function somasBrutas(transitos: ReadonlyArray<TransitoParaEmocao>): Record<ChaveEmocao, number> {
  const porEmocao = contribuicoesPorEmocao(transitos)
  const soma: Record<ChaveEmocao, number> = {
    ansiedade: 0, irritacao: 0, pressao: 0, confusao: 0,
    desanimo: 0, calma: 0, animo: 0, afeto: 0,
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
 * MEDIDO contra 21 usuários reais (168 trânsitos). Mediana geral por K:
 *
 *     K = 0.45  →  33        K = 0.65  →  45
 *     K = 0.55  →  40
 *
 * Escolhido 0.55, e o valor SUBIU de 0.45 junto com a passagem de seis para
 * oito emoções: com mais anéis, o mesmo dia reparte os pesos em mais casas e
 * cada número cai. Em 0.55 a mediana volta aos ~40 de antes, que é o nível de
 * leitura que já estava calibrado — o dia comum pouco abaixo da metade, com
 * faixa de sobra para o dia de fato carregado. Em 0.65 a mediana vai a 45 e o
 * número começa a soar alarme todo dia; alarme que toca sempre não é alarme.
 *
 * Faixa efetiva com 0.55, nos dados reais:
 *
 *     ansiedade 10–87   irritação 0–72   pressão 0–73
 *     confusão   0–71   desânimo  0–75
 *     calma      0–76   ânimo    10–89   afeto  10–76
 *
 * ⚠️ Nenhum anel é morto e nenhum tem piso: o maior número de dias zerados é o
 * desânimo (9 de 21), que é exatamente o que se espera de dias leves.
 *
 * ⚠️ Duas correções minhas ficam aqui de propósito. Uma versão deste comentário
 * dizia "mediana perto de 45" com K=0.55, o que a medição desmentiu; e a
 * primeira tabela de pesos macios criava um PISO de otimismo em 41. Se a base
 * mudar, refazer a medição em vez de confiar nestes números.
 */
export const K_CURVA = 0.55

/** A soma bruta vira 0–100 por uma curva que satura. */
export function paraEscala(soma: number): number {
  if (!Number.isFinite(soma) || soma <= 0) return 0
  return Math.round(100 * (1 - Math.exp(-K_CURVA * soma)))
}

export type EmocaoDoDia = {
  chave: ChaveEmocao
  valor: number
  pesa: boolean
  /** Os trânsitos que produziram este número, do que mais pesa ao que menos. */
  porque: Contribuicao[]
}

/**
 * As oito tendências do dia, de 0 a 100.
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
