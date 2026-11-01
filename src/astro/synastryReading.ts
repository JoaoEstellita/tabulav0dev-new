// Leitura enriquecida de sinastria (determinística, sem catálogo gigante):
//  - synastryScore: índice de compatibilidade da dupla a partir dos aspectos.
//  - synastryAspectLine: frase legível por aspecto, composta de dois mapas
//    (domínio do planeta × frase do aspecto) nos 4 idiomas.
// Consome os SynastryAspect de ./synastry (aspect.mine/theirs = chave en minúscula).

import type { SynastryAspect, NatalChart } from './synastry'
import type { RealPlanetPosition } from '../services/astrology/RealAstrologyEngine'
import { getHousePositionalFocus } from '../utils/astroInterpretation'
import { synastryPairBody } from '../data/synastryPairReadings'

type Lang = 'pt-BR' | 'en-US' | 'es-ES' | 'it-IT'

const PERSONAL = new Set(['sun', 'moon', 'mercury', 'venus', 'mars'])

export type SynastryBand = 'harmonica' | 'mista' | 'tensa' | 'neutra'

export interface SynastryScore {
  pct: number
  bandKey: SynastryBand
  harmonics: number
  tensions: number
  /**
   * ⚠️ O PESO dos dois lados, não a contagem — é daqui que sai o número.
   * `harmonics`/`tensions` contam cabeças; estes pesam cada contato pela orbe
   * e por quem são os planetas. Um trígono Vênus–Marte exato e um sextil
   * Netuno–Júpiter na borda contam 1 cada, mas pesam muito diferente, e é o
   * peso que decide a porcentagem.
   */
  apoio: number
  tensao: number
}

/**
 * ⚠️ POR QUE ESTA FÓRMULA, e por que a anterior estava errada.
 *
 * A anterior era `50 + soma × 5`, somando TODOS os aspectos. Medido em 600
 * pares: p50=74, p75 E p90 ambos em 95, 28% nas pontas, e 66% dos pares
 * lendo "harmônica". Um índice de compatibilidade que diz "harmônica" para
 * dois terços das pessoas não distingue nada.
 *
 * A causa é a de sempre nesta base: curva calibrada para poucos itens
 * recebendo muitos. Um par tem 20–25 aspectos — a soma estoura o teto de 95
 * antes do décimo, e a partir dali todo par recebe o mesmo número.
 *
 * ⚠️ A CORREÇÃO É A RECEITA QUE O PRÓPRIO PROJETO JÁ USA no status
 * (`scoreFromSupportPressure`, no backend), com as MESMAS constantes de
 * `STATUS_POLICY.calc`. Separa duas coisas que a soma confundia:
 *
 *   BALANÇO   — (apoio − tensão) / total. Normalizado, então o NÚMERO de
 *               aspectos não infla nada: 20 harmônicos e 2 harmônicos dão o
 *               mesmo balanço, que é o certo.
 *   AMPLITUDE — quanto contato existe. É ela que separa "forte e harmônico"
 *               de "mal se tocam": com pouco contato o resultado fica perto
 *               de 50, porque há pouco a dizer.
 *
 * Medido com a mesma amostra: p10=38 p25=46 p50=54 p75=62 p90=69, ZERO nas
 * pontas, e as faixas em 25% harmônica / 53% mista / 22% tensa.
 *
 * ⚠️ A CONJUNÇÃO PEGA O SINAL DE QUEM SE FUNDE, e não um +0,6 fixo. A regra é
 * a mesma do cálculo das emoções e da ativação: Saturno, Plutão, Marte, Urano
 * e Netuno pesam; o resto afaga. O +0,6 era um viés constante a favor,
 * aplicado ao aspecto mais frequente que existe.
 *
 * ⚠️ ISTO MUDA O NÚMERO QUE JÁ ESTÁ NO AR, de propósito. Um par que mostrava
 * 95% passa a mostrar ~69. O 95 não era um elogio: era o teto da escala.
 */
const CALC = { eps: 1e-6, beta: 1.2, k: 0.9, gamma: 1.6 }

/** Planetas cuja conjunção PESA — mesma lista das emoções e da ativação. */
const CONJUNCAO_PESADA = new Set(['saturn', 'pluto', 'mars', 'uranus', 'neptune'])

/**
 * Tom pelo nome do aspecto, quando quem chama nao mandou `tone`.
 *
 * ⚠️ MENORES DUROS SAO TENSOS (quincuncio, semiquadratura,
 * sesquiquadratura) — decisao ja tomada em `getAspectType` (`b96acf8`).
 * ⚠️ ESTE FALLBACK EXISTE PARA A PARIDADE com o gemeo do backend, que
 * recebe os contatos sem `tone` (o Match manda `labelPt`). Sem ele, o mesmo par
 * daria numeros diferentes no app e na Rede.
 */
const TOM_POR_ASPECTO: Record<string, string> = {
  trigono: 'harmonioso', sextil: 'harmonioso', semissextil: 'harmonioso',
  trine: 'harmonioso', sextile: 'harmonioso',
  quadratura: 'tenso', oposicao: 'tenso', quincuncio: 'tenso',
  semiquadratura: 'tenso', sesquiquadratura: 'tenso',
  square: 'tenso', opposition: 'tenso',
  conjuncao: 'neutro', conjunction: 'neutro',
}

/** ⚠️ Hermes NAO suporta regex `\p{...}` — usar o range direto. */
const semAcento = (x: unknown) => String(x || '').toLowerCase().trim()
  .normalize('NFD').replace(/[̀-ͯ]/g, '')

function tomDe(a: { tone?: unknown; aspect?: unknown; type?: unknown; labelPt?: unknown }): string {
  const t = semAcento(a?.tone)
  if (t === 'harmonioso' || t === 'tenso' || t === 'neutro') return t
  return TOM_POR_ASPECTO[semAcento(a?.aspect ?? a?.type ?? a?.labelPt)] || 'neutro'
}

/**
 * Os dois planetas de um contato.
 *
 * ⚠️ ACEITA `planet1/planet2` TAMBEM: e a forma que o motor natal usa e
 * a que o gemeo do backend recebe. Sem este ramo, um contato nessa forma caia
 * com os dois planetas vazios — nao entrava em PERSONAL nem em
 * CONJUNCAO_PESADA, e virava apoio em silencio.
 */
function planetasDe(a: Record<string, unknown>): [string, string] {
  const k = (x: unknown) => String(x ?? '').toLowerCase().trim()
  return [
    k(a?.mine != null ? a.mine : a?.planet1),
    k(a?.theirs != null ? a.theirs : a?.planet2),
  ]
}

/**
 * O marcador ÚNICO da sinastria: vale para a dupla inteira e para cada área.
 *
 * ⚠️ É O MESMO nos dois justamente para que possam ser lidos na mesma tela.
 * Com fórmulas diferentes, "Afeto 63" e "a dupla 69" seriam escalas distintas
 * e a comparação que a tela convida a fazer não significaria nada.
 */
export interface ContatoPontuavel {
  mine?: string
  theirs?: string
  /** Formato do motor natal — `tomDe`/`planetasDe` aceitam os dois. */
  planet1?: string
  planet2?: string
  tone?: string
  /** Quando `tone` não vem, o tom sai do nome do aspecto. */
  aspect?: string
  type?: string
  labelPt?: string
  orb: number
}

export function pontuarContatos(
  contatos: ReadonlyArray<ContatoPontuavel>,
): { pct: number; apoio: number; tensao: number } {
  let apoio = 0
  let tensao = 0
  for (const a of contatos || []) {
    const [m, t] = planetasDe(a as any)
    const exatidao = Math.max(0, (6 - Math.min(6, Number(a.orb) || 0)) / 6)
    const pessoais = (PERSONAL.has(m) ? 1 : 0) + (PERSONAL.has(t) ? 1 : 0)
    const peso = exatidao * (pessoais >= 2 ? 1.4 : pessoais === 1 ? 1.15 : 1)
    const tom = tomDe(a as any)
    const pesa = tom === 'tenso'
      || (tom !== 'harmonioso' && (CONJUNCAO_PESADA.has(m) || CONJUNCAO_PESADA.has(t)))
    if (pesa) tensao += peso
    else apoio += peso
  }
  const total = apoio + tensao
  if (total <= 0) return { pct: 50, apoio, tensao }
  const balanco = Math.tanh(CALC.beta * ((apoio - tensao) / (total + CALC.eps)))
  const amplitude = Math.pow(1 - Math.exp(-CALC.k * total), CALC.gamma)
  // 45 e não 50: o teto absoluto não deve ser alcançável — "100% compatível"
  // é uma promessa que nenhum mapa sustenta.
  const pct = Math.max(2, Math.min(98, Math.round(50 + 45 * amplitude * balanco)))
  return { pct, apoio, tensao }
}

/**
 * Índice de compatibilidade 0–100 + faixa, da dupla inteira.
 *
 * ⚠️ Usa o marcador ÚNICO (`pontuarContatos`), o mesmo das áreas — ver o
 * cabeçalho dele para a medição que motivou a troca.
 */
export function synastryScore(aspects: SynastryAspect[] | null | undefined): SynastryScore {
  const list = Array.isArray(aspects) ? aspects : []
  if (list.length === 0) return { pct: 50, bandKey: 'neutra', harmonics: 0, tensions: 0, apoio: 0, tensao: 0 }
  let harmonics = 0
  let tensions = 0
  for (const a of list) {
    if (a.tone === 'harmonioso') harmonics++
    else if (a.tone === 'tenso') tensions++
  }
  const { pct, apoio, tensao } = pontuarContatos(list)
  const bandKey: SynastryBand = pct >= 62 ? 'harmonica' : pct >= 45 ? 'mista' : 'tensa'
  return { pct, bandKey, harmonics, tensions, apoio, tensao }
}

/**
 * A PORCENTAGEM EXPLICADA, em uma ou duas frases.
 *
 * ⚠️ UM NÚMERO SOZINHO NÃO SE DEFENDE. "71%" não diz de que escala, nem o que
 * seria 50, nem por que não é 95 — e sem isso a pessoa preenche o vazio com a
 * suposição mais comum, que é "71 de 100 pontos possíveis". Não é: é um saldo
 * entre o que flui e o que atrita, e 50 é o empate.
 *
 * ⚠️ FALA DE SALDO, NÃO DE QUANTIDADE, porque é assim que a conta funciona:
 * vinte contatos bons e dois contatos bons dão o mesmo resultado se a
 * proporção for a mesma. Dizer "15 harmônicos" sem isso convida a somar
 * cabeças, que é justamente a leitura errada — e era a fórmula antiga.
 */
export function explicarAfinidade(score: SynastryScore, lang: Lang): string[] {
  const i = lang === 'en-US' ? 1 : lang === 'es-ES' ? 2 : lang === 'it-IT' ? 3 : 0
  const tl = (pt: string, en: string, es: string, it: string) => [pt, en, es, it][i]
  const total = score.apoio + score.tensao
  // Participação de cada lado NO PESO — a mesma conta que produz a %.
  const parteApoio = total > 0 ? Math.round((score.apoio / total) * 100) : 50
  const linhas: string[] = []

  linhas.push(tl(
    `50% seria empate. Aqui, ${parteApoio}% do contato entre os dois mapas é do que flui, e o resto é do que atrita.`,
    `50% would be a tie. Here, ${parteApoio}% of the contact between the two charts is what flows, and the rest is what grinds.`,
    `50% seria empate. Aqui, ${parteApoio}% del contacto entre las dos cartas es lo que fluye, y el resto lo que roza.`,
    `50% sarebbe pareggio. Qui, ${parteApoio}% del contatto tra le due carte e cio che scorre, e il resto cio che attrita.`,
  ))

  // ⚠️ A RESSALVA DO SALDO só entra quando há os dois lados. Num par sem
  // nenhuma tensão ela soaria como desculpa para um número que não precisa de
  // nenhuma.
  if (score.harmonics > 0 && score.tensions > 0) {
    linhas.push(tl(
      'Conta o saldo, não a quantidade: dobrar os contatos do mesmo tipo não muda a leitura. O que muda é a proporção — e o quanto cada contato é exato.',
      'It is the balance that counts, not the count: doubling contacts of the same kind does not change the reading. What changes it is the proportion — and how exact each contact is.',
      'Cuenta el saldo, no la cantidad: duplicar contactos del mismo tipo no cambia la lectura. Lo que cambia es la proporcion, y cuan exacto es cada contacto.',
      'Conta il saldo, non la quantita: raddoppiare i contatti dello stesso tipo non cambia la lettura. Cambia la proporzione, e quanto ogni contatto e esatto.',
    ))
  }

  return linhas
}

// Domínio relacional de cada planeta (1 palavra), nos 4 idiomas.
const PLANET_REL: Record<string, Record<Lang, string>> = {
  sun: { 'pt-BR': 'identidade', 'en-US': 'identity', 'es-ES': 'identidad', 'it-IT': 'identita' },
  moon: { 'pt-BR': 'emoções', 'en-US': 'emotions', 'es-ES': 'emociones', 'it-IT': 'emozioni' },
  mercury: { 'pt-BR': 'comunicação', 'en-US': 'communication', 'es-ES': 'comunicacion', 'it-IT': 'comunicazione' },
  venus: { 'pt-BR': 'afeto', 'en-US': 'affection', 'es-ES': 'afecto', 'it-IT': 'affetto' },
  mars: { 'pt-BR': 'desejo', 'en-US': 'desire', 'es-ES': 'deseo', 'it-IT': 'desiderio' },
  jupiter: { 'pt-BR': 'crescimento', 'en-US': 'growth', 'es-ES': 'crecimiento', 'it-IT': 'crescita' },
  saturn: { 'pt-BR': 'compromisso', 'en-US': 'commitment', 'es-ES': 'compromiso', 'it-IT': 'impegno' },
  uranus: { 'pt-BR': 'liberdade', 'en-US': 'freedom', 'es-ES': 'libertad', 'it-IT': 'liberta' },
  neptune: { 'pt-BR': 'sonho', 'en-US': 'dreams', 'es-ES': 'sueno', 'it-IT': 'sogno' },
  pluto: { 'pt-BR': 'intensidade', 'en-US': 'intensity', 'es-ES': 'intensidad', 'it-IT': 'intensita' },
}

// Desfecho relacional por aspecto (chave = aspect.aspect), nos 4 idiomas.
const ASPECT_REL: Record<string, Record<Lang, string>> = {
  conjuncao: {
    'pt-BR': 'se fundem e se intensificam', 'en-US': 'merge and intensify',
    'es-ES': 'se funden y se intensifican', 'it-IT': 'si fondono e si intensificano',
  },
  sextil: {
    'pt-BR': 'fluem juntos com facilidade', 'en-US': 'flow together with ease',
    'es-ES': 'fluyen juntos con facilidad', 'it-IT': 'scorrono insieme con facilita',
  },
  trigono: {
    'pt-BR': 'se apoiam naturalmente', 'en-US': 'support each other naturally',
    'es-ES': 'se apoyan con naturalidad', 'it-IT': 'si sostengono con naturalezza',
  },
  quadratura: {
    'pt-BR': 'se atritam — crescimento pela fricção', 'en-US': 'clash — growth through friction',
    'es-ES': 'chocan — crecimiento por la friccion', 'it-IT': 'si scontrano — crescita per attrito',
  },
  oposicao: {
    'pt-BR': 'se puxam por polaridade — atração e ajuste', 'en-US': 'pull by polarity — attraction and adjustment',
    'es-ES': 'se atraen por polaridad — atraccion y ajuste', 'it-IT': 'si attraggono per polarita — attrazione e regolazione',
  },
}

const CONNECTOR: Record<Lang, string> = { 'pt-BR': 'e', 'en-US': 'and', 'es-ES': 'y', 'it-IT': 'e' }

const cap = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s)

/** Frase legível de um aspecto de sinastria. Vazio se planetas/aspecto desconhecidos. */
export function synastryAspectLine(aspect: SynastryAspect, language: string): string {
  const lang: Lang = (['pt-BR', 'en-US', 'es-ES', 'it-IT'].includes(language) ? language : 'pt-BR') as Lang
  const domA = PLANET_REL[aspect.mine]?.[lang]
  const domB = PLANET_REL[aspect.theirs]?.[lang]
  const outcome = ASPECT_REL[aspect.aspect]?.[lang]
  if (!domA || !domB || !outcome) return ''
  return `${cap(domA)} ${CONNECTOR[lang]} ${domB} ${outcome}.`
}

// Dica relacional por TOM do aspecto (como lidar com o contato na relação).
const ASPECT_TIP: Record<string, Record<Lang, string>> = {
  harmonioso: {
    'pt-BR': 'Um ponto que flui fácil entre vocês — apoiem-se nele.',
    'en-US': 'A point that flows easily between you — lean on it.',
    'es-ES': 'Un punto que fluye facil entre ustedes — apoyense en el.',
    'it-IT': 'Un punto che scorre facile tra voi — appoggiatevi.',
  },
  tenso: {
    'pt-BR': 'Um ponto de fricção — cresce com diálogo e ajuste, não com força.',
    'en-US': 'A friction point — it grows with dialogue and adjustment, not force.',
    'es-ES': 'Un punto de friccion — crece con dialogo y ajuste, no con fuerza.',
    'it-IT': 'Un punto di attrito — cresce col dialogo e l aggiustamento, non con la forza.',
  },
  neutro: {
    'pt-BR': 'Uma fusão intensa — poderosa, pede consciência dos dois.',
    'en-US': 'An intense merging — powerful, it asks awareness from both.',
    'es-ES': 'Una fusion intensa — poderosa, pide conciencia de ambos.',
    'it-IT': 'Una fusione intensa — potente, chiede consapevolezza da entrambi.',
  },
}
const SIDES: Record<Lang, (a: string, b: string) => string> = {
  'pt-BR': (a, b) => `${cap(a)} de um lado, ${b} do outro.`,
  'en-US': (a, b) => `${cap(a)} on one side, ${b} on the other.`,
  'es-ES': (a, b) => `${cap(a)} de un lado, ${b} del otro.`,
  'it-IT': (a, b) => `${cap(a)} da un lato, ${b} dall'altro.`,
}

// Alguns aspectos de sinastria (ex.: os do endpoint /synastry) vêm sem `tone` —
// deriva do nome do aspecto (só os 5 maiores existem na sinastria).
export function synastryToneOf(aspectName: string): 'harmonioso' | 'tenso' | 'neutro' {
  if (aspectName === 'trigono' || aspectName === 'sextil') return 'harmonioso'
  if (aspectName === 'quadratura' || aspectName === 'oposicao') return 'tenso'
  return 'neutro'
}

type AspectLike = { mine: string; theirs: string; aspect: string; tone?: string; orb?: number }

/** Interpretação de um aspecto de sinastria: título curto + parágrafo relacional. */
export function synastryAspectDetail(aspect: AspectLike, language: string): { headline: string; body: string } {
  const lang: Lang = (['pt-BR', 'en-US', 'es-ES', 'it-IT'].includes(language) ? language : 'pt-BR') as Lang
  const headline = synastryAspectLine(aspect as SynastryAspect, lang)
  const domA = PLANET_REL[aspect.mine]?.[lang]
  const domB = PLANET_REL[aspect.theirs]?.[lang]
  const tone = aspect.tone || synastryToneOf(aspect.aspect)
  // Corpo CURADO por par de planetas (específico) tem prioridade; senão, composição genérica.
  const curated = synastryPairBody(aspect.mine, aspect.theirs, tone, lang)
  const tip = ASPECT_TIP[tone]?.[lang] || ASPECT_TIP.neutro[lang]
  const sides = domA && domB ? SIDES[lang](domA, domB) : ''
  return { headline, body: curated || `${sides} ${tip}`.trim() }
}

// ─── Sobreposição de casas (a "outra metade" da sinastria ocidental) ─────────
// Onde os planetas de uma pessoa caem NAS CASAS da outra: mostra qual área da
// vida cada um mais ativa no outro. Só planetas pessoais (Sol..Marte) para ficar
// legível; direcional (A→B e B→A).

const OVERLAY_PLANETS = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars']

export interface HouseOverlay {
  fromName: string
  toName: string
  planet: string // chave en minúscula (para translatePlanet)
  house: number
  focus: string
}

/** Casa (1–12) de uma longitude nas cúspides dadas, ou null. */
function houseFromCusps(longitude: number, cusps: number[] | null | undefined): number | null {
  if (!Array.isArray(cusps) || cusps.length < 12) return null
  for (let i = 0; i < 12; i++) {
    const start = cusps[i]
    const end = cusps[(i + 1) % 12]
    const span = ((end - start) % 360 + 360) % 360
    const offset = ((longitude - start) % 360 + 360) % 360
    if (offset < span || span === 0) return i + 1
  }
  return null
}

function overlaysOneWay(from: NatalChart, to: NatalChart, fromName: string, toName: string, lang: Lang): HouseOverlay[] {
  if (!to.cusps) return []
  const out: HouseOverlay[] = []
  const byName = new Map<string, RealPlanetPosition>((from.planets || []).map((p) => [p.name, p]))
  for (const name of OVERLAY_PLANETS) {
    const p = byName.get(name)
    if (!p || !Number.isFinite(p.longitude)) continue
    const house = houseFromCusps(p.longitude, to.cusps)
    if (!house) continue
    out.push({ fromName, toName, planet: name.toLowerCase(), house, focus: getHousePositionalFocus(lang, house) })
  }
  return out
}

/**
 * Sobreposição de casas nos DOIS sentidos (A→B e B→A). Vazio se faltarem cúspides.
 */
export function synastryHouseOverlays(
  chartA: NatalChart | null | undefined,
  chartB: NatalChart | null | undefined,
  aName: string,
  bName: string,
  language: string,
): HouseOverlay[] {
  if (!chartA || !chartB) return []
  const lang: Lang = (['pt-BR', 'en-US', 'es-ES', 'it-IT'].includes(language) ? language : 'pt-BR') as Lang
  return [
    ...overlaysOneWay(chartA, chartB, aName, bName, lang),
    ...overlaysOneWay(chartB, chartA, bName, aName, lang),
  ]
}
