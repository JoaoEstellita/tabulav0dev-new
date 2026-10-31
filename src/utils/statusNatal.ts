/**
 * O STATUS NATAL — quanto o MAPA sustenta cada área da vida.
 *
 * O status do dia responde "como está essa área hoje". Este responde "o que o
 * seu mapa já traz nela" — e é a comparação entre os dois que diz se o dia está
 * mexendo num ponto naturalmente forte ou num que já pede cuidado.
 *
 * ⚠️ GÊMEO de `backend/lib/status/status-natal.js`. O cabeçalho longo (a
 * definição da tríade casa/regente/significador e por que ela) está lá; aqui
 * fica o essencial e a trava: `statusNatalParidade.spec.ts` compara as
 * constantes e os VALORES contra o backend.
 *
 * ⚠️ POR QUE O APP CALCULA. Na aba Grupos o mapa do membro é montado
 * LOCALMENTE e nunca passou pelo status dele — que o app nem poderia ler. Sem
 * o cálculo aqui, o status natal existiria só para o dono da conta. É a mesma
 * razão que levou a tendência emocional natal a ser portada.
 *
 * ⚠️ NÃO É DIAGNÓSTICO NEM DESTINO. "Amor 38 no mapa" quer dizer que os
 * planetas ligados ao tema recebem mais aspecto duro que macio — não que a
 * pessoa terá uma vida afetiva difícil. Aqui a fronteira é mais fácil de
 * atravessar do que nas emoções, porque o natal parece falar de destino.
 */

/** As áreas, com as casas e os planetas que as regem. Espelha `LIFE_AREAS`. */
export const AREAS_NATAIS: Record<string, { houses: number[]; planets: string[] }> = {
  amor: { houses: [5, 7], planets: ['Venus', 'Mars'] },
  carreira: { houses: [10, 6], planets: ['Saturn', 'Mars', 'Sun'] },
  financas: { houses: [2, 8], planets: ['Venus', 'Jupiter'] },
  saude: { houses: [1, 6], planets: ['Mars', 'Sun'] },
  familia: { houses: [4, 10], planets: ['Moon', 'Saturn'] },
  espiritualidade: { houses: [9, 12], planets: ['Neptune', 'Jupiter'] },
  comunicacao: { houses: [3, 9], planets: ['Mercury', 'Uranus'] },
  transformacao: { houses: [8, 12], planets: ['Pluto', 'Uranus'] },
}

export const CHAVES_NATAIS = Object.keys(AREAS_NATAIS)

/**
 * ⚠️ OS CINCO NÚMEROS DO MARCADOR, copiados de `STATUS_POLICY.calc`.
 *
 * É o que faz o status natal cair na MESMA escala do status do dia, pela mesma
 * curva — sem calibragem. Medido em 424 pares: o natal fica acima do dia em
 * 56% deles, diferença mediana de 5 pontos. Esse equilíbrio é o que torna a
 * comparação honesta, e ele vem de usar a curva do dia, não uma inventada.
 *
 * Se divergirem do backend, as duas pontuações deixam de ser comparáveis sem
 * nada acusar — por isso há teste de paridade.
 */
export const CALC_NATAL = { eps: 0.000001, beta: 1.2, k: 0.9, gamma: 1.6, conflictC: 6 }

const DUROS = new Set(['quadratura', 'oposicao', 'semiquadratura', 'sesquiquadratura', 'quincuncio'])
const MACIOS = new Set(['trigono', 'sextil', 'semissextil'])
/** A conjunção não tem natureza própria: quem decide é o planeta que chega. */
const CONJUNCAO_PESADA = new Set(['saturn', 'pluto', 'mars', 'neptune', 'uranus'])

const norm = (v: unknown) =>
  String(v || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim()

/** Traduz os nomes que chegam do motor para a chave que as tabelas usam. */
const ALIAS_ASPECTO: Record<string, string> = {
  conjunção: 'conjuncao', conjunction: 'conjuncao',
  oposição: 'oposicao', opposition: 'oposicao',
  trígono: 'trigono', trine: 'trigono',
  quadratura: 'quadratura', square: 'quadratura',
  sextil: 'sextil', sextile: 'sextil',
  quincúncio: 'quincuncio', quincunx: 'quincuncio',
  semissextil: 'semissextil', semisextile: 'semissextil',
  semiquadratura: 'semiquadratura', semisquare: 'semiquadratura',
  sesquiquadratura: 'sesquiquadratura', sesquisquare: 'sesquiquadratura',
}
const tipoDeAspecto = (t: unknown) => {
  const n = norm(t)
  return ALIAS_ASPECTO[n] || ALIAS_ASPECTO[String(t || '').toLowerCase()] || n
}

/**
 * O quanto um aspecto conta, pela exatidão.
 *
 * ⚠️ Orbe ausente vale como razoável (0,6) e não como exato: um aspecto sem
 * orbe preenchido existe, mas afirmar que é exato seria inventar precisão.
 */
export function pesoDoOrbeNatal(orb: unknown): number {
  const n = Number(orb)
  if (!Number.isFinite(n)) return 0.6
  if (n <= 1) return 1
  if (n >= 8) return 0.25
  return 1 - ((n - 1) / 7) * 0.75
}

export type AspectoNatalBruto = { planet1?: string; planet2?: string; type?: string; orb?: unknown }
export type PlanetaComCasa = { name?: string; planetEn?: string; house?: unknown; natalHouse?: unknown }

/** Apoio e pressão que um PLANETA recebe dos aspectos natais. */
export function condicaoDoPlaneta(planeta: string, aspectos: ReadonlyArray<AspectoNatalBruto> | null | undefined) {
  const alvo = norm(planeta)
  let support = 0
  let pressure = 0
  let quantos = 0
  for (const a of (aspectos || [])) {
    const p1 = norm(a?.planet1)
    const p2 = norm(a?.planet2)
    if (p1 !== alvo && p2 !== alvo) continue
    const outro = p1 === alvo ? a?.planet2 : a?.planet1
    const tipo = tipoDeAspecto(a?.type)
    if (!tipo) continue

    let pesa: boolean
    if (DUROS.has(tipo)) pesa = true
    else if (MACIOS.has(tipo)) pesa = false
    else if (tipo === 'conjuncao') pesa = CONJUNCAO_PESADA.has(norm(outro))
    else continue

    const peso = pesoDoOrbeNatal(a?.orb)
    if (pesa) pressure += peso
    else support += peso
    quantos++
  }
  return { support, pressure, quantos }
}

/** O marcador do status do dia — ver CALC_NATAL. */
function pontuar(support: number, pressure: number): number {
  const { eps, beta, k, gamma, conflictC } = CALC_NATAL
  const aRaw = support + pressure
  const tRaw = (support - pressure) / (support + pressure + eps)
  const t = Math.tanh(beta * tRaw)
  const amp = Math.pow(1 - Math.exp(-k * aRaw), gamma)
  const base = 50 + 50 * amp * t
  const conflito = Math.min(10, Math.max(0, conflictC * (1 - Math.exp(-k * aRaw)) * (1 - Math.abs(t))))
  return Math.min(100, Math.max(0, base - conflito))
}

/**
 * Os planetas que respondem por uma área, nos três papéis.
 *
 * ⚠️ UM PLANETA PODE ENTRAR POR MAIS DE UM PAPEL (ser significador de Amor E
 * morar na Casa 7), e conta mais de uma vez — de propósito. Um Vênus na própria
 * Casa 7 responde pelo amor duas vezes, e achatar isso apagaria a ênfase que o
 * mapa está mostrando.
 */
export function planetasDaArea(
  area: string,
  planetas: ReadonlyArray<PlanetaComCasa> | null | undefined,
  regentes: Record<string | number, any> | null | undefined,
) {
  const def = AREAS_NATAIS[area]
  if (!def) return [] as Array<{ planeta: string; papel: string; casa: number | null }>
  const out: Array<{ planeta: string; papel: string; casa: number | null }> = []

  for (const p of (planetas || [])) {
    const casa = Number(p?.house ?? p?.natalHouse)
    if (!Number.isFinite(casa)) continue
    if (def.houses.includes(casa)) out.push({ planeta: String(p?.name || p?.planetEn || ''), papel: 'ocupacao', casa })
  }
  // ⚠️ O regente chega como ARRAY: no modo híbrido um signo pode ter regente
  // tradicional E moderno (Escorpião dá ['Mars','Pluto']). A primeira versão
  // esperava string e descartava o array em silêncio — a perna da REGÊNCIA não
  // entrava na conta, e a medição inicial foi feita sem ela.
  //
  // ⚠️ SÓ O PRIMEIRO (o tradicional): contar os dois faria uma cúspide em
  // Escorpião pesar o dobro de uma em Leão, sem razão astrológica.
  for (const casa of def.houses) {
    const bruto = regentes?.[casa] ?? regentes?.[String(casa)]
    const nome = Array.isArray(bruto) ? bruto[0] : (typeof bruto === 'string' ? bruto : bruto?.planet)
    if (nome) out.push({ planeta: String(nome), papel: 'regencia', casa })
  }
  for (const nome of def.planets) out.push({ planeta: nome, papel: 'significador', casa: null })

  return out.filter((x) => x.planeta)
}

/**
 * Os REGENTES de cada casa, pelo signo na cúspide.
 *
 * ⚠️ SÓ O TRADICIONAL, e isso é consistente com o cálculo: o backend devolve
 * array no modo híbrido (Escorpião = ['Mars','Pluto']) e `planetasDaArea` usa
 * apenas o primeiro — contar os dois faria uma cúspide em Escorpião pesar o
 * dobro de uma em Leão, sem razão astrológica. Portar o híbrido inteiro para
 * depois descartar metade seria superfície a mais para divergir. Conferido: os
 * doze signos dão o mesmo regente dos dois lados.
 *
 * ⚠️ Sem as doze cúspides devolve `null`, e a perna da REGÊNCIA some da tríade
 * — de propósito: inventar o regente de uma casa que não se sabe onde começa
 * daria um número com cara de certo.
 */
export const REGENTE_TRADICIONAL: readonly string[] = [
  'Mars',    // Áries
  'Venus',   // Touro
  'Mercury', // Gêmeos
  'Moon',    // Câncer
  'Sun',     // Leão
  'Mercury', // Virgem
  'Venus',   // Libra
  'Mars',    // Escorpião
  'Jupiter', // Sagitário
  'Saturn',  // Capricórnio
  'Saturn',  // Aquário
  'Jupiter', // Peixes
]

export function regentesDasCasas(cuspides: ReadonlyArray<unknown> | null | undefined): Record<number, string> | null {
  if (!Array.isArray(cuspides) || cuspides.length < 12) return null
  const out: Record<number, string> = {}
  for (let casa = 1; casa <= 12; casa++) {
    const c = Number(cuspides[casa - 1])
    if (!Number.isFinite(c)) continue
    const idx = Math.floor((((c % 360) + 360) % 360) / 30)
    const r = REGENTE_TRADICIONAL[idx]
    if (r) out[casa] = r
  }
  return Object.keys(out).length ? out : null
}

export type AreaNatal = {
  percentage: number
  porque: Array<{ planeta: string; papel: string; casa: number | null; apoio: number; pressao: number }>
}

/**
 * O STATUS NATAL de cada área.
 *
 * `null` sem dado — e `null` é resposta: oito percentuais calculados sobre nada
 * diriam que o mapa não sustenta área nenhuma, que é diferente de não haver
 * mapa.
 */
export function statusNatal(entrada: {
  planetasNatais?: ReadonlyArray<PlanetaComCasa> | null
  aspectosNatais?: ReadonlyArray<AspectoNatalBruto> | null
  /** Regentes prontos, quando quem chama já os tem. */
  regentes?: Record<string | number, any> | null
  /** As doze cúspides — de onde os regentes saem quando não vierem prontos. */
  cuspides?: ReadonlyArray<unknown> | null
}): Record<string, AreaNatal> | null {
  const aspectos = entrada?.aspectosNatais
  if (!aspectos || !aspectos.length) return null
  const regentes = entrada.regentes || regentesDasCasas(entrada.cuspides)

  const cache = new Map<string, ReturnType<typeof condicaoDoPlaneta>>()
  const condicao = (nome: string) => {
    const k = norm(nome)
    if (!cache.has(k)) cache.set(k, condicaoDoPlaneta(nome, aspectos))
    return cache.get(k)!
  }

  const areas: Record<string, AreaNatal> = {}
  for (const chave of CHAVES_NATAIS) {
    const papeis = planetasDaArea(chave, entrada.planetasNatais, regentes)
    let support = 0
    let pressure = 0
    const porque: AreaNatal['porque'] = []
    for (const p of papeis) {
      const c = condicao(p.planeta)
      if (!c.quantos) continue
      support += c.support
      pressure += c.pressure
      porque.push({
        planeta: p.planeta,
        papel: p.papel,
        casa: p.casa,
        apoio: Math.round(c.support * 100) / 100,
        pressao: Math.round(c.pressure * 100) / 100,
      })
    }
    if (!porque.length) continue
    areas[chave] = {
      percentage: Math.round(pontuar(support, pressure)),
      porque: porque.sort((a, b) => (b.apoio + b.pressao) - (a.apoio + a.pressao)).slice(0, 6),
    }
  }

  return Object.keys(areas).length ? areas : null
}
