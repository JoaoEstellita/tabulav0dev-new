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
 * DOMINANTE SÓ DELA, e os pesos cruzados têm de ser POUCOS.
 *
 * A primeira versão tinha seis palavras e três pares que eram a mesma
 * informação com nomes diferentes — alegria×otimismo r=+0,81, stress×raiva
 * r=+0,81, ansiedade×stress r=+0,75 nos 21 usuários reais. Dois anéis que leem
 * os mesmos planetas se mexem juntos para sempre, e o segundo não acrescenta
 * nada à tela. "Stress" era o pior caso: não tinha planeta próprio, era a soma
 * de tudo que é duro.
 *
 * A segunda lição veio depois, voltando de oito anéis para seis: com poucos
 * anéis, cada um absorve muitos planetas e nenhum consegue mais zerar — na
 * primeira tentativa de 3+3, ansiedade nunca descia de 19 e afeto de 20.
 * Cortar os pesos cruzados pequenos resolveu: hoje os seis podem zerar.
 *
 * Antes de acrescentar ou renomear qualquer emoção aqui: medir o cosseno entre
 * o vetor de pesos dela e os das outras (acima de ~0,7 é anel repetido) E
 * conferir que todo anel ainda chega a zero em algum dia real.
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
  /** Planeta lento. Só `transitosRicos` traz; no outro caminho é deduzido. */
  lento?: boolean
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
  | 'afeto'
  | 'entusiasmo'
  | 'calma'
  | 'sensibilidade'
  | 'estresse'
  | 'desanimo'
  | 'ansiedade'
  | 'pressao'

/**
 * A ordem em que os anéis aparecem: TRÊS BONS EM CIMA, três difíceis embaixo.
 *
 * ⚠️ A simetria é deliberada e é metade do que a seção comunica. Com mais
 * anéis de tensão do que de alívio, a tela afirma que o dia é majoritariamente
 * ruim antes mesmo de calcular qualquer coisa — o desenho vira o veredicto.
 * Três de cada lado deixa o resultado falar.
 *
 * ⚠️ A ORDEM TAMBÉM É O DESENHO: com quatro por linha, os índices 0-4, 1-5,
 * 2-6 e 3-7 caem um em cima do outro e cada COLUNA vira um par de opostos:
 *
 *     afeto       entusiasmo    calma        sensibilidade
 *     estresse    desânimo      ansiedade    pressão
 *      Vênus↔Marte  Júpiter↔Saturno  chão↔sobressalto  sentir↔apertar
 *
 * Vênus/Marte e Júpiter/Saturno são os dois pares clássicos da tradição. Lida
 * em coluna, a grade dá quatro eixos em vez de oito números soltos — que era a
 * queixa de não dar para ter noção geral do dia.
 *
 * Mexer nesta ordem (ou em `porLinha` no componente) desfaz o pareamento sem
 * quebrar nada: a tela continua funcionando e só para de significar isso.
 */
export const EMOCOES: readonly ChaveEmocao[] = [
  'afeto', 'entusiasmo', 'calma', 'sensibilidade',
  'estresse', 'desanimo', 'ansiedade', 'pressao',
] as const

/** As quatro que pesam e as quatro que aliviam — usado no texto do detalhe. */
export const EMOCAO_PESA: Record<ChaveEmocao, boolean> = {
  afeto: false, entusiasmo: false, calma: false, sensibilidade: false,
  estresse: true, desanimo: true, ansiedade: true, pressao: true,
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
 * Aspecto duro só alimenta as TRÊS difíceis; ele nunca acende afeto, entusiasmo
 * nem calma. Cada uma tem um planeta dominante (peso 1.0) e nenhum planeta é
 * dominante em duas:
 *
 *     Marte    → estresse    (atrito, pavio curto)
 *     Saturno  → desânimo    (peso, cansaço, porta fechada)
 *     Urano    → ansiedade   (sobressalto, chão que se move)
 *     Plutão   → pressão     (aperto que não dá para desviar)
 *
 * Os outros seis se distribuem entre os quatro pelo que a tradição associa a
 * cada um: Mercúrio com a mente acelerada, Netuno com a névoa que desanima,
 * Vênus com o desgosto, o Sol com a exposição que cansa.
 *
 * ⚠️ OS PESOS CRUZADOS SÃO POUCOS DE PROPÓSITO. Uma versão com mais deles
 * criou piso: cada anel recebia alguma coisa de quase todo planeta e nenhum
 * conseguia mais chegar a zero (ansiedade nunca abaixo de 19). Acrescentar um
 * peso pequeno aqui parece inofensivo e é o jeito de matar a faixa de baixo.
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
  mars:    { estresse: 1.0 },
  sun:     { estresse: 0.50 },
  jupiter: { estresse: 0.25 },
  saturn:  { desanimo: 1.0, pressao: 0.30 },
  neptune: { desanimo: 0.85 },
  venus:   { desanimo: 0.60 },
  uranus:  { ansiedade: 1.0 },
  mercury: { ansiedade: 0.85 },
  moon:    { ansiedade: 0.40, desanimo: 0.45 },
  // ⚠️ Plutão NÃO alimenta o estresse, e isso foi medido. Com ele dando 0.30
  // ao estresse, estresse×pressão ficava em r=+0,51 — os dois anéis subiam
  // juntos e o de baixo não acrescentava nada. Tirando, o pior par do conjunto
  // cai para +0,43 e deixa de ser este. Marte é o atrito; Plutão é o aperto.
  pluto:   { pressao: 1.0 },
}

/**
 * Afinidade quando o aspecto ALIVIA. Mesma regra: um dominante por emoção.
 *
 *     Vênus    → afeto          (prazer, carinho, gosto pelas coisas)
 *     Júpiter  → entusiasmo     (impulso, vontade, horizonte aberto)
 *     Saturno  → calma          (estrutura que segura, chão firme)
 *     Lua      → sensibilidade  (pele fina, o que se capta sem ser dito)
 *
 * As quatro cobrem o espaço do que é bom sem se repetir: o afeto é RECEPTIVO
 * (o que faz bem), o entusiasmo é ATIVO (o que põe para fora), a calma é o
 * sossego e a sensibilidade é a abertura. Quem já teve um dia produtivo e seco
 * sabe que não são a mesma coisa.
 *
 * ⚠️ As duas primeiras já se chamaram "alegria" e "ânimo", e foram trocadas
 * por serem palavras parecidas demais em português para coisas que o cálculo
 * separa bem: nos 21 usuários reais elas medem r=-0,11, ou seja, nenhuma
 * relação — há quem tenha 12 de uma e 76 da outra no mesmo dia. O problema
 * nunca foi o número, era a palavra.
 *
 * ⚠️ NÃO HÁ PESO NEGATIVO AQUI, e a escolha foi deliberada. Numa versão antiga
 * Saturno macio *subtraía* da ansiedade; o alívio existia no cálculo mas era
 * invisível na tela, e a pessoa lia "Ansiedade 40" sem saber que havia sido
 * abatida. Agora ele ACENDE a Calma: "Ansiedade 60 · Calma 65" conta os dois
 * fatos, que são dois trânsitos diferentes, em vez de esconder um no outro.
 *
 * ⚠️ Saturno e Netuno macios NÃO dão ânimo, e isso já foi um bug. Dar o número
 * bom aos dez planetas criava um PISO: como aspecto macio é comum (73 de 168
 * trânsitos reais) e Saturno e Netuno são dos mais frequentes nele, o número
 * nunca descia de 41 para ninguém — e indicador que nunca desce não indica.
 * Saturno em trígono é estrutura, não entusiasmo; Netuno macio é sossego.
 */
const PESO_MACIO: Record<string, Partial<Record<ChaveEmocao, number>>> = {
  venus:   { afeto: 1.0 },
  sun:     { entusiasmo: 0.80, afeto: 0.25 },
  jupiter: { entusiasmo: 1.0 },
  mars:    { entusiasmo: 0.50 },
  uranus:  { entusiasmo: 0.40 },
  saturn:  { calma: 1.0 },
  pluto:   { calma: 0.50 },
  mercury: { calma: 0.35 },
  // ⚠️ A LUA é a dona da sensibilidade, não Netuno — correção do João, e ele
  // está certo: a Lua É o planeta do humor na tradição. Eu tinha posto Netuno
  // ali por falta de dado, que é torcer a astrologia para caber num artefato.
  //
  // Netuno fica como segundo quase-dominante (0.90) por um motivo prático: a
  // Lua aparece em só 4 de 21 contas mesmo depois de dobrar a cota de rápidos,
  // porque os aspectos dela duram horas. Sem Netuno sustentando, o anel ficaria
  // apagado na maioria dos dias. Com os dois, zera em 4 de 21 — e quando a Lua
  // está lá, é ela que lidera.
  moon:    { sensibilidade: 1.0, afeto: 0.40 },
  neptune: { sensibilidade: 0.90 },
}

/**
 * O ALVO natal amplifica o que é da área dele.
 *
 * Um trânsito duro sobre a Lua mexe com o humor mais do que o mesmo trânsito
 * sobre Júpiter. Sem isto, o alvo não contaria — e o alvo é metade do aspecto.
 */
const AMPLIFICA_ALVO: Record<string, Partial<Record<ChaveEmocao, number>>> = {
  moon:    { sensibilidade: 1.35, desanimo: 1.20, ansiedade: 1.25, afeto: 1.25 },
  mercury: { ansiedade: 1.35 },
  mars:    { estresse: 1.30 },
  venus:   { afeto: 1.30, desanimo: 1.15 },
  sun:     { entusiasmo: 1.15, estresse: 1.15 },
  saturn:  { desanimo: 1.20, calma: 1.15 },
  jupiter: { entusiasmo: 1.30 },
  neptune: { sensibilidade: 1.20 },
  // ⚠️ AS CHAVES DOS ÂNGULOS SÃO `asc` / `mc` / `dsc` / `ic`.
  //
  // Estavam escritas `ascendant` e `midheaven`, que é como NINGUÉM grava: o
  // motor usa a forma curta. As duas entradas nunca dispararam, e `dsc` e `ic`
  // não tinham entrada nenhuma — 52 dos 168 trânsitos da base antiga, 31%,
  // passavam sem amplificação. Não dava erro; só não acontecia.
  asc:     { ansiedade: 1.20, afeto: 1.10 },
  mc:      { pressao: 1.25, estresse: 1.15 },
  dsc:     { afeto: 1.25, estresse: 1.15 },
  ic:      { desanimo: 1.20, calma: 1.20 },
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
 * Planetas LENTOS — a mesma lista do backend (`SLOW_PLANETS` em
 * `backend/lib/status/status-engine.js`). Mantida aqui porque
 * `personalTodayRich` NÃO traz o campo `lento`, só `transitosRicos` traz.
 */
const LENTOS = new Set(['jupiter', 'saturn', 'uranus', 'neptune', 'pluto', 'chiron'])

/**
 * ⚠️ A COTA. Sem ela este cálculo não significa nada.
 *
 * O projeto tem duas listas de trânsito do dia, e elas têm TAMANHOS diferentes:
 *
 *   `transitosRicos`     backend, LIMITADO a 5 lentos + 3 rápidos  → 8/dia
 *   `personalTodayRich`  motor local, lista COMPLETA, sem teto      → 25 ou mais
 *
 * A soma cresce com o tamanho da lista e a curva satura. A calibração foi feita
 * contra a lista de 8; medido contra a mesma base multiplicada, uma lista 3×
 * maior levaria a mediana de 38 para 77, com 34% dos anéis acima de 90. Seis
 * anéis quase cheios, todo dia, para todo mundo — e nada disso daria erro.
 *
 * A saída é aplicar aqui a MESMA seleção que o backend já faz, para que o
 * número não dependa de qual caminho carregou o dia. A cota também é o que
 * garante trânsito RÁPIDO todo dia: sem ela os lentos ocupam a lista inteira e
 * os anéis ancorados em Saturno e Urano ficam parados por semanas.
 *
 * ⚠️ A REPARTIÇÃO 6+6 NÃO É SIMETRIA DECORATIVA. Com 5+3, medido em 21 contas
 * reais, as três vagas rápidas eram disputadas assim: Vênus 38%, Sol 25%,
 * Marte 17%, Mercúrio 11%, Lua 8%. Vênus e Marte consumiam mais da metade, e
 * em aspecto macio sobrava Mercúrio em 1 conta e a Lua em 3 — ou seja, o
 * planeta do humor era cortado antes de qualquer conta. Depois de 6+6: Sol
 * 26%, Marte 23%, Vênus 22%, Mercúrio 19%, Lua 10%, e nenhum anel fica mudo.
 *
 * ⚠️ MUDAR ESTES NÚMEROS EXIGE RECALIBRAR `K_CURVA`. Eles são o tamanho da
 * entrada, e o K é função dele. Por isso estão aqui em cima, com nome, e não
 * enfiados como literal no meio da função.
 */
export const COTA_LENTOS = 6
export const COTA_RAPIDOS = 6

/**
 * Quantos trânsitos de cada natureza (duro e macio) a seleção garante.
 *
 * Dois, não três: é piso de segurança, não cota. Nos 21 usuários reais a
 * seleção por velocidade já traz de 2 a 8 macios, então ele nunca dispara —
 * existe para o dia em que a ordenação puxa tudo para um lado só.
 */
export const PISO_POR_NATUREZA = 2

/** Quanto um trânsito pesa na disputa por vaga. */
function relevancia(t: TransitoParaEmocao): number {
  return forcaNormalizada(t?.strength) * pesoDoOrbe(t?.orb)
}

/**
 * Os trânsitos que entram na conta: os mais fortes de cada velocidade.
 *
 * Quando um dos lados não enche a própria cota — um dia com poucos rápidos, por
 * exemplo — o outro aproveita as vagas, igual ao backend. O total é sempre o
 * mesmo, que é o ponto.
 */
export function selecionarTransitos(
  transitos: ReadonlyArray<TransitoParaEmocao>,
): TransitoParaEmocao[] {
  const TETO = COTA_LENTOS + COTA_RAPIDOS
  const lista = [...(transitos || [])].sort((a, b) => relevancia(b) - relevancia(a))

  const ehLento = (t: TransitoParaEmocao) =>
    t?.lento ?? LENTOS.has(norm(t?.t ?? t?.transitPlanet))

  /** 'd' duro, 'm' macio, null para aspecto que o cálculo ignora. */
  const natureza = (t: TransitoParaEmocao): 'd' | 'm' | null => {
    const a = norm(t?.a ?? t?.type)
    if (DUROS.has(a)) return 'd'
    if (MACIOS.has(a)) return 'm'
    if (a === 'conjuncao') return CONJUNCAO_PESADA.has(norm(t?.t ?? t?.transitPlanet)) ? 'd' : 'm'
    return null
  }

  // Passo 1: a cota do backend, por VELOCIDADE. É a seleção principal.
  const escolhidos = [
    ...lista.filter(ehLento).slice(0, COTA_LENTOS),
    ...lista.filter((t) => !ehLento(t)).slice(0, COTA_RAPIDOS),
  ]
  if (escolhidos.length < TETO) {
    const dentro = new Set(escolhidos)
    for (const t of lista) {
      if (escolhidos.length >= TETO) break
      if (!dentro.has(t)) { escolhidos.push(t); dentro.add(t) }
    }
  }

  // Passo 2: o PISO POR NATUREZA, que só age quando é violado.
  //
  // ⚠️ Por que existe: no caminho do app o motor embute o tipo do aspecto na
  // própria `strength` (conjunção 1.0, oposição 0.9, trígono 0.7, sextil 0.5)
  // e NÃO manda orbe — então ordenar por relevância ali é quase ordenar por
  // tipo, e oposição ganha de todo macio exceto um trígono exato. Numa lista
  // grande isso escolhe duro atrás de duro, e os quatro anéis bons ficam sem
  // material enquanto o céu tem trígonos de sobra.
  //
  // ⚠️ Por que é PISO e não cota fixa: reservar vagas de verdade fazia trânsito
  // FRACO da categoria reservada deslocar trânsito forte da outra, e aí
  // acrescentar ruído à lista mudava a leitura — medido, a mediana caía de 41
  // para 37. O piso troca só o necessário, e nos 21 usuários reais ele nunca
  // dispara: a seleção por velocidade já traz no mínimo 2 de cada.
  const dentro = new Set(escolhidos)
  for (const alvo of ['m', 'd'] as const) {
    let tem = escolhidos.filter((t) => natureza(t) === alvo).length
    if (tem >= PISO_POR_NATUREZA) continue
    const candidatos = lista.filter((t) => !dentro.has(t) && natureza(t) === alvo)
    for (const novo of candidatos) {
      if (tem >= PISO_POR_NATUREZA) break
      // Sai o MAIS FRACO do lado abundante, nunca um da categoria em falta.
      let piorIdx = -1
      for (let i = 0; i < escolhidos.length; i++) {
        if (natureza(escolhidos[i]) === alvo) continue
        if (piorIdx < 0 || relevancia(escolhidos[i]) < relevancia(escolhidos[piorIdx])) piorIdx = i
      }
      if (piorIdx < 0) break
      dentro.delete(escolhidos[piorIdx])
      escolhidos[piorIdx] = novo
      dentro.add(novo)
      tem++
    }
  }
  return escolhidos
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
    afeto: [], entusiasmo: [], calma: [], sensibilidade: [],
    estresse: [], desanimo: [], ansiedade: [], pressao: [],
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
    afeto: 0, entusiasmo: 0, calma: 0, sensibilidade: 0,
    estresse: 0, desanimo: 0, ansiedade: 0, pressao: 0,
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
 * MEDIDO contra 21 usuários reais, 252 trânsitos, já com a cota 6+6 e os oito
 * anéis. O K é buscado para colocar a mediana das que PESAM em 41, que é o
 * patamar de leitura calibrado desde a primeira versão: o dia comum pouco
 * abaixo da metade, com faixa de sobra para o dia de fato carregado.
 *
 *     6 anéis, cota 6+6   →  K = 0.32
 *     8 anéis, cota 6+6   →  K = 0.45   ← este
 *     8 anéis, cota 5+3   →  K = 0.70
 *
 * Note que MAIS anéis pedem K MAIOR e mais trânsitos pedem K MENOR, e os dois
 * efeitos brigam. Nunca mexa num sem remedir.
 *
 * ⚠️ O K DEPENDE DE DUAS COISAS, e as duas mudam sem avisar:
 *
 *   1. QUANTOS ANÉIS existem — com oito emoções o mesmo dia repartia os pesos
 *      em mais casas e cada número caía.
 *   2. QUANTOS TRÂNSITOS entram — ver `COTA_LENTOS` / `COTA_RAPIDOS`. Dobrar a
 *      cota praticamente dobra toda soma.
 *
 * Mudou qualquer um dos dois, remede. Este K vale para 6 anéis e cota 5+3.
 *
 * Faixa efetiva com 0.45, nos dados reais:
 *
 *     afeto          0–59      estresse   0–78
 *     entusiasmo    14–61      desânimo   0–85
 *     calma          0–72      ansiedade  0–89
 *     sensibilidade  0–67      pressão    0–63
 *
 * ⚠️ SETE DOS OITO CHEGAM A ZERO. A exceção é o entusiasmo, com piso em 14 —
 * ele é alimentado por Júpiter, Sol, Marte e Urano macios, e a união dos
 * quatro cobre as 21 contas. Um comentário anterior meu afirmava que os oito
 * zeravam; a medição desmentiu.
 *
 * Piso de 14 não é o defeito que já aconteceu aqui: o otimismo da primeira
 * versão tinha piso em 41, que o olho lê como "média". 14 lê como "quase
 * nada", que é justamente o que um dia sem Júpiter e sem Sol deve mostrar.
 * O limite para vigiar é ~25 — daí para cima o anel vira enfeite.
 *
 * ⚠️ As que PESAM alcançam mais alto que as que aliviam (89 contra 72), e isso
 * é do céu, não da tabela: os pesos somam quase o mesmo dos dois lados. Dia
 * carregado tem mais aspecto duro simultâneo do que dia bom tem macio.
 *
 * ⚠️ Duas correções minhas ficam aqui de propósito. Uma versão deste comentário
 * dizia "mediana perto de 45" com K=0.55, o que a medição desmentiu; e a
 * primeira tabela de pesos macios criava um PISO de 41. Se a base mudar,
 * refazer a medição em vez de confiar nestes números.
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
  /** Os trânsitos que produziram este número, do que mais pesa ao que menos. */
  porque: Contribuicao[]
}

/**
 * O NORMAL DE CADA ANEL — a referencia contra a qual o numero do dia se le.
 *
 * ⚠️ POR QUE EXISTE. Os oito aneis NAO estao na mesma escala, e a roda os mostra
 * lado a lado como se estivessem. Medido nos 21 mapas reais: o valor 45 fica
 * acima de 90% dos casos no Afeto e acima de apenas 33% no Entusiasmo. Mesmo
 * numero, leitura oposta. A causa e estrutural: cada anel tem um conjunto
 * diferente de planetas-fonte e somas de peso diferentes, logo tetos diferentes
 * (o Entusiasmo nao passa de 61 nem chega a zero; a Ansiedade vai a 89).
 *
 * ⚠️ DE ONDE SAIRAM ESTES NUMEROS. Nao da mediana dos 21 — sao 21 mapas num
 * UNICO dia, e qualquer ruido daquele ceu entraria na constante para sempre.
 * Vem de `backend/scripts/calibrar-aneis.js`: 12.000 dias sinteticos montados
 * por reamostragem do POOL REAL de transitos observados, com a mesma cota que o
 * motor aplica (6 lentos + 6 rapidos). O material e real; o que varia e a
 * combinacao.
 *
 * ⚠️ O MODELO FOI VALIDADO antes de virar constante: as medianas simuladas
 * reproduzem as observadas com no maximo 7 pontos de diferenca (a maioria em 4
 * ou menos). A primeira versao do script sorteava dias RALOS e errava feio — a
 * mediana do Afeto dava 8 contra 27 reais — e so a comparacao com o observado
 * mostrou isso. Sem essa checagem, a tabela errada teria entrado calada.
 *
 * ⚠️ ISTO NAO MUDA NENHUM NUMERO. E referencia de LEITURA: o valor do dia segue
 * o que sempre foi, e o mesmo que o agente e o WhatsApp usam.
 */
export const REFERENCIA_POR_ANEL: Record<ChaveEmocao, number> = {
  afeto: 21,
  entusiasmo: 43,
  calma: 32,
  sensibilidade: 32,
  estresse: 37,
  desanimo: 47,
  ansiedade: 48,
  pressao: 36,
}

/**
 * QUANTOS DIAS A MEMORIA GUARDA, e quantos ela exige para abrir a boca.
 *
 * ⚠️ O TETO E DE TAMANHO, nao de estatistica. O historico mora dentro de
 * `userStatus/{uid}`, que TODO cron que toca status le inteiro. Trinta dias em
 * forma compacta dao ~1,5 KB; foi por peso assim que o `porque` (uns 8 KB) ficou
 * de fora do documento. Mais dias dariam base melhor e custariam leitura em
 * todo cron, todo dia, para todo mundo.
 *
 * ⚠️ O PISO E DE HONESTIDADE. Com dois ou tres dias guardados, "acima do seu
 * normal" nao e leitura: e ruido com cara de descoberta. Abaixo de
 * MIN_DIAS_DE_BASE a funcao devolve `null` e quem chama volta para a referencia
 * do anel, que nao depende de historico nenhum.
 */
export const DIAS_DE_MEMORIA = 30
export const MIN_DIAS_DE_BASE = 7

/** Um dia guardado: a data e os oito valores, na ordem de `EMOCOES`. */
export type DiaDeMemoria = { d: string; v: number[] }

/**
 * O NORMAL DESTA PESSOA, de cada anel — a mediana dos dias guardados.
 *
 * ⚠️ MEDIANA e não média: um único dia extremo puxaria a média e a base
 * passaria a chamar de "normal" um dia que não é.
 *
 * ⚠️ Devolve `null` com memória curta. Prometer "o seu normal" com três dias é
 * pior do que não prometer, porque a pessoa acredita — e aí volta a valer a
 * referência do anel, que não depende de histórico.
 *
 * ⚠️ O app só LÊ o histórico; quem escreve é o backend (`avancarHistorico`, no
 * gêmeo). Escrever dos dois lados daria duas versões do mesmo dia.
 */
export function baseDaPessoa(
  historico: ReadonlyArray<DiaDeMemoria> | null | undefined,
): { referencia: Record<ChaveEmocao, number>; dias: number } | null {
  const h = (historico || []).filter((e) => e && Array.isArray(e.v) && e.v.length === EMOCOES.length)
  if (h.length < MIN_DIAS_DE_BASE) return null
  const out = {} as Record<ChaveEmocao, number>
  for (let i = 0; i < EMOCOES.length; i++) {
    const col = h.map((e) => Number(e.v[i])).filter((n) => Number.isFinite(n)).sort((a, b) => a - b)
    if (!col.length) return null
    const meio = Math.floor(col.length / 2)
    out[EMOCOES[i]] = col.length % 2 ? col[meio] : Math.round((col[meio - 1] + col[meio]) / 2)
  }
  return { referencia: out, dias: h.length }
}

/**
 * A TENDENCIA EMOCIONAL DO NATAL — o temperamento, contra o qual o dia se le.
 *
 * ⚠️ GEMEO de `backend/lib/status/emocoes-do-dia.js`. O cabecalho completo (de
 * onde vem o K por anel, e por que um K so nao serve) esta la; aqui fica o
 * resumo e a trava: `emocoesNatalParidade.spec.ts` compara a tabela dos dois.
 *
 * ⚠️ O K E POR ANEL, medido em 53 mapas reais. Com o K unico do dia (0,45) o
 * Afeto natal daria 57 para a pessoa mediana, contra 21 no dia: o natal tem uma
 * mistura de aspectos diferente da do transito, e a mesma curva produz escalas
 * diferentes. Sem calibrar, "hoje acima do seu mapa" seria afirmacao sobre a
 * curva e nao sobre a pessoa.
 *
 * ⚠️ OS DOIS PLANETAS DO ASPECTO CONTAM: no natal nao ha quem transita, e
 * eleger o primeiro como ator seria decidir por ordem alfabetica.
 *
 * ⚠️ NAO DIAGNOSTICA NINGUEM. "Ansiedade natal 48" quer dizer que o mapa tem a
 * quantidade tipica de aspectos que alimentam aquele anel — nao que a pessoa e
 * ansiosa.
 */
export const K_NATAL: Record<ChaveEmocao, number> = {
  afeto: 0.104,
  entusiasmo: 0.173,
  calma: 0.208,
  sensibilidade: 0.175,
  estresse: 0.239,
  desanimo: 0.199,
  ansiedade: 0.349,
  pressao: 0.465,
}

/** O que o motor devolve em `aspectsNatalToNatal`. */
export type AspectoNatal = { planet1?: string; planet2?: string; type?: string; orb?: unknown }

/**
 * Converte a lista de aspectos do motor para a forma que o calculo entende.
 * ⚠️ RECEBE OS ASPECTOS DO MOTOR, e nao os detecta. A primeira versao tinha
 * deteccao propria, com os cinco aspectos maiores e orbe fixa 6 — e produziu o
 * defeito que apareceu na tela: "Ansiedade 0" logo abaixo de uma grade cheia de
 * quadraturas e quincuncios. O projeto trata semiquadratura, sesquiquadratura e
 * quincuncio como DUROS (inclusive no calculo do dia, neste mesmo arquivo) e usa
 * orbe por planeta e por aspecto. Ter lista propria era divergir do produto
 * inteiro — e a grade, que a pessoa ve logo acima, desmentia o numero.
 *
 * ⚠️ OS DOIS PLANETAS CONTAM: no natal nao ha quem transita, e eleger o
 * primeiro seria decidir por ordem alfabetica.
 */
export function aspectosDoNatal(
  aspectos: ReadonlyArray<AspectoNatal> | null | undefined,
): TransitoParaEmocao[] {
  const out: TransitoParaEmocao[] = []
  for (const a of (aspectos || [])) {
    const p1 = String(a?.planet1 || '')
    const p2 = String(a?.planet2 || '')
    const tipo = String(a?.type || '')
    if (!p1 || !p2 || !tipo) continue
    const n = Number(a?.orb)
    const orb = Number.isFinite(n) ? n : 0
    out.push({ t: p1, a: tipo, n: p2, strength: 1, orb } as TransitoParaEmocao)
    out.push({ t: p2, a: tipo, n: p1, strength: 1, orb } as TransitoParaEmocao)
  }
  return out
}

/**
 * Os oito numeros do NATAL, com o `porque` de cada um.
 *
 * `null` sem aspectos — oito zeros afirmariam que a pessoa nao tem temperamento
 * nenhum, que e diferente de nao haver dado.
 */
export function emocoesDoNatal(
  aspectos: ReadonlyArray<AspectoNatal> | null | undefined,
): EmocaoDoDia[] | null {
  const lista = aspectosDoNatal(aspectos)
  if (!lista.length) return null
  const somas = somasBrutas(lista)
  const contribs = contribuicoesPorEmocao(lista)
  const out = EMOCOES.map((chave) => {
    const k = K_NATAL[chave] ?? K_CURVA
    const bruto = Math.round(100 * (1 - Math.exp(-k * (somas[chave] || 0))))
    return {
      chave,
      valor: Math.max(0, Math.min(100, bruto)),
      pesa: EMOCAO_PESA[chave],
      porque: [...(contribs[chave] || [])].sort((a, b) => b.valor - a.valor),
    }
  })
  return out.some((e) => e.valor > 0) ? out : null
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
  // ⚠️ A cota entra AQUI, antes de qualquer conta. Ver `selecionarTransitos`.
  const porEmocao = contribuicoesPorEmocao(selecionarTransitos(lista))
  return EMOCOES.map((chave) => ({
    chave,
    valor: paraEscala(porEmocao[chave].reduce((acc, c) => acc + c.valor, 0)),
    pesa: EMOCAO_PESA[chave],
    porque: porEmocao[chave],
  }))
}
