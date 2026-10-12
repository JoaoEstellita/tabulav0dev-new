import { translatePlanet, aspectNature, type AppLanguage } from './astro/pt'
import { areasAffectedByTransit } from './transitLifeAreas'
import { getLifeAreaLabelI18n } from '../constants/lifeAreas'
import { nomeDoPonto, efeitoNoPonto } from './efeitoDoTransito'
import { enumerar, costurar, janelaEmPalavras } from './leituraDoDia'

/**
 * Síntese do momento a partir de TODOS os trânsitos ativos.
 *
 * A versão anterior usava um só — o de maior força — e ignorava os outros seis.
 * Pior: misturava escalas de tempo. "Urano sobre Júpiter" é um tema de meses;
 * "Lua em trígono a Netuno" dura horas. Tratar os dois como "hoje" é o que
 * fazia o texto soar solto, por mais correto que estivesse.
 *
 * Quatro camadas, nesta ordem:
 *
 *  1. VELOCIDADE — lentos são o pano de fundo do período; rápidos são o que
 *     ativa hoje. Essa separação sozinha muda o texto de patamar.
 *  2. CONVERGÊNCIA — duas coisas apontando para o mesmo lugar é o que faz uma
 *     leitura parecer certeira: a mesma casa tocada por dois trânsitos, ou o
 *     mesmo ponto natal recebendo dois.
 *  3. FASE — a janela diz se o trânsito já passou do ponto exato (efeito, hora
 *     de digerir) ou ainda vai chegar (preparação). Muda o conselho.
 *  4. BALANÇO — tensos contra harmônicos, PONDERADO por força, para o
 *     fechamento não ser chute.
 *
 * Tudo determinístico: regras lendo os dados, sem IA e sem custo por uso. A
 * vantagem não é só o preço — é que o resultado é reproduzível, testável e
 * nunca inventa um trânsito que não existe.
 */

export interface TransitoAtivo {
  transitPlanet?: string
  natalPlanet?: string
  type?: string
  strength?: number
  house?: number | null
  window?: { start?: string; exact?: string; end?: string; days?: number } | null
}

export interface BlocoDaSintese {
  chave: 'fundo' | 'hoje' | 'vemAi' | 'saldo'
  rotulo: string
  texto: string
}

/**
 * Uma leitura do dia: o EFEITO em destaque, a origem astrológica discreta.
 *
 * A ordem antiga era a inversa — "Hoje a Lua e Vênus pressionam a sua
 * presença. O jeito como você aparece encontra mais resistência que o normal."
 * — e punha na frente o que menos importa para quem lê. O aspecto é a FONTE da
 * informação, não a informação; quem abre o app quer saber o que muda no dia,
 * e só depois (se quiser) de onde isso sai.
 *
 * Por isso vêm separados, e não costurados numa frase só: a tela dá tamanho e
 * cor diferentes a cada parte.
 */
export interface FraseDoDia {
  /** O que muda hoje — o texto que ganha destaque. */
  efeito: string
  /** De onde vem: "Sol em quadratura com o seu Netuno · Lua em trígono ao seu Netuno". */
  fonte: string
  /** Identifica os trânsitos citados, para a lista detalhada não repetir. */
  chaves: string[]
  /**
   * Onde está no arco: chegando, exato agora, ou já passou do pico.
   *
   * É o que permite agrupar a leitura por TEMPO em vez de por força. Doze
   * frases numa lista única são doze blocos iguais; separadas em "acontecendo
   * agora", "chegando" e "já passou", viram uma narrativa — e respondem
   * primeiro a pergunta que a pessoa tem de manhã, que é "o que é hoje?".
   */
  fase: Fase
  /** A casa tocada, quando há uma. */
  casa: number | null
  /** Onde isso pega na vida (no máximo duas — três viram lista). */
  areas: string[]
  /** "chega ao exato em 3 dias", "passou pelo ponto exato há 6 dias". */
  quando: string
}

export interface SinteseDoDia {
  /** Uma ou duas frases para o topo da Home — o que ativa HOJE. */
  resumo: string
  /**
   * As leituras de hoje, uma por ponto do mapa tocado, da mais forte para a
   * mais fraca. Antes só o ponto MAIS tocado virava frase e todo o resto do
   * céu ficava mudo — num dia com 44 trânsitos ativos, uma frase só.
   */
  frases: FraseDoDia[]
  /** O detalhe, para o "Ler mais". */
  blocos: BlocoDaSintese[]
}

/**
 * Sem teto: TODO ponto tocado vira frase.
 *
 * O teto existia para a leitura não virar planilha — mas o que fazia a tela
 * crescer não eram as frases, e sim a lista de aspectos logo abaixo, que
 * repetia cada trânsito com quatro a cinco linhas de texto do catálogo.
 *
 * Medido num dia de 44 trânsitos: 12 pontos distintos = 12 frases, ~24 linhas.
 * Menos que as 40+ do formato anterior, cobrindo o céu inteiro em vez de um
 * quarto dele. Cada frase é uma leitura fechada; nenhuma repete a outra,
 * porque o agrupamento é POR PONTO.
 */

/** Meses a anos no mesmo ponto: são o período, não o dia. */
const LENTOS = new Set(['Saturn', 'Uranus', 'Neptune', 'Pluto', 'Jupiter'])
/** Horas a dias: é o que muda a cara de hoje. */
const RAPIDOS = new Set(['Sun', 'Moon', 'Mercury', 'Venus', 'Mars'])

const forca = (t: TransitoAtivo) => (typeof t.strength === 'number' ? t.strength : 0)

type Fase = 'antes' | 'agora' | 'depois'

export function faseDoTransito(t: TransitoAtivo, agora: Date = new Date()): Fase {
  const exato = t.window?.exact
  if (!exato) return 'agora'
  const quando = new Date(exato).getTime()
  if (!Number.isFinite(quando)) return 'agora'
  const dif = quando - agora.getTime()
  if (Math.abs(dif) < 24 * 60 * 60 * 1000) return 'agora'
  return dif > 0 ? 'antes' : 'depois'
}

/** Dias inteiros até (positivo) ou desde (negativo) o ponto exato. */
export function diasAteExato(t: TransitoAtivo, agora: Date = new Date()): number | null {
  const exato = t.window?.exact
  if (!exato) return null
  const quando = new Date(exato).getTime()
  if (!Number.isFinite(quando)) return null
  return Math.round((quando - agora.getTime()) / (24 * 60 * 60 * 1000))
}

/**
 * A casa tocada por mais de um trânsito.
 *
 * Convergência é o achado mais valioso da síntese: quando dois movimentos
 * diferentes apontam para a mesma área da vida, isso não é coincidência de
 * cálculo — é o tema do período. Devolve a casa com mais peso somado.
 */
export function casaQueConcentra(transitos: ReadonlyArray<TransitoAtivo>): { casa: number; quantos: number } | null {
  const porCasa = new Map<number, { quantos: number; peso: number }>()
  for (const t of transitos) {
    const c = typeof t.house === 'number' ? t.house : 0
    if (!c) continue
    const atual = porCasa.get(c) || { quantos: 0, peso: 0 }
    porCasa.set(c, { quantos: atual.quantos + 1, peso: atual.peso + forca(t) })
  }
  let melhor: { casa: number; quantos: number; peso: number } | null = null
  for (const [casa, v] of porCasa) {
    if (v.quantos < 2) continue
    if (!melhor || v.peso > melhor.peso) melhor = { casa, quantos: v.quantos, peso: v.peso }
  }
  return melhor ? { casa: melhor.casa, quantos: melhor.quantos } : null
}

/** O ponto natal que recebe mais trânsitos — o foco do momento. */
export function pontoFocal(transitos: ReadonlyArray<TransitoAtivo>): { planeta: string; quantos: number } | null {
  const porAlvo = new Map<string, { quantos: number; peso: number }>()
  for (const t of transitos) {
    const alvo = String(t.natalPlanet || '')
    if (!alvo) continue
    const atual = porAlvo.get(alvo) || { quantos: 0, peso: 0 }
    porAlvo.set(alvo, { quantos: atual.quantos + 1, peso: atual.peso + forca(t) })
  }
  let melhor: { planeta: string; quantos: number; peso: number } | null = null
  for (const [planeta, v] of porAlvo) {
    if (v.quantos < 2) continue
    if (!melhor || v.peso > melhor.peso) melhor = { planeta, quantos: v.quantos, peso: v.peso }
  }
  return melhor ? { planeta: melhor.planeta, quantos: melhor.quantos } : null
}

/** Soma de força por natureza. Ponderar importa: dois sextis fracos não anulam uma quadratura exata. */
/**
 * Conjunção não é neutra — depende de QUEM transita.
 *
 * Plutão sobre o Meio do Céu com força 96 pesa, e muito; Vênus sobre a Lua
 * alivia. Tratar as duas como "outro" tirava do balanço justamente os dois
 * trânsitos mais fortes do mapa, e o saldo saía invertido: um dia de duas
 * conjunções pesadas era lido como "apoio predomina".
 */
const CONJUNCAO_PESADA = new Set(['Saturn', 'Pluto', 'Mars', 'Uranus', 'Neptune'])
const CONJUNCAO_LEVE = new Set(['Venus', 'Jupiter', 'Sun', 'Moon'])

function naturezaReal(t: TransitoAtivo): 'desafiador' | 'harmonico' | 'outro' {
  const n = aspectNature(String(t.type || ''))
  if (n === 'desafiador' || n === 'harmonico') return n
  if (n === 'conjuncao') {
    const agente = String(t.transitPlanet || '')
    if (CONJUNCAO_PESADA.has(agente)) return 'desafiador'
    if (CONJUNCAO_LEVE.has(agente)) return 'harmonico'
  }
  return 'outro'
}

export function balanco(transitos: ReadonlyArray<TransitoAtivo>) {
  let tenso = 0
  let harmonico = 0
  let nTenso = 0
  let nHarmonico = 0
  for (const t of transitos) {
    const n = naturezaReal(t)
    if (n === 'desafiador') { tenso += forca(t); nTenso++ }
    else if (n === 'harmonico') { harmonico += forca(t); nHarmonico++ }
  }
  return { tenso, harmonico, nTenso, nHarmonico, dominante: tenso > harmonico ? 'tenso' : harmonico > tenso ? 'harmonico' : 'equilibrado' as const }
}

/**
 * Nome do planeta como se diz numa frase.
 *
 * "Hoje Sol pressiona" não é português. Sol e Lua pedem artigo; os outros são
 * nomes próprios e ficam certos sozinhos ("Hoje Marte pressiona"). Só pt-BR —
 * nos demais idiomas o nome solto já é a forma corrente.
 */
function comArtigo(planeta: string, idioma: AppLanguage): string {
  const nome = translatePlanet(planeta, idioma)
  if (idioma !== 'pt-BR') return nome
  if (nome === 'Sol') return 'o Sol'
  if (nome === 'Lua') return 'a Lua'
  return nome
}

/** Primeira letra maiúscula, para o efeito abrir uma frase. */
const maiuscula = (t: string) => (t ? t.charAt(0).toUpperCase() + t.slice(1) : t)

const tl = (idioma: AppLanguage) => (pt: string, en: string, es: string, it: string) =>
  idioma === 'en-US' ? en : idioma === 'es-ES' ? es : idioma === 'it-IT' ? it : pt

/** "Plutão no topo do mapa", "Urano sobre Júpiter" — como o trânsito é citado. */
function citar(t: TransitoAtivo, idioma: AppLanguage): string {
  const T = tl(idioma)
  const agente = translatePlanet(String(t.transitPlanet || ''), idioma)
  const alvo = String(t.natalPlanet || '')
  const alvoTraduzido = translatePlanet(alvo, idioma)
  // Tira o ACENTO antes de limpar: sem isto "Meio do Ceu" virava "meiodocu"
  // (o é cai junto com os espacos) e o angulo nunca era reconhecido.
  const chave = alvo.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z]/g, '')
  if (chave === 'meiodoceu' || chave === 'midheaven' || chave === 'mc') {
    return T(`${agente} no topo do mapa`, `${agente} at the top of the chart`, `${agente} en lo alto del mapa`, `${agente} in cima al tema`)
  }
  if (chave === 'ascendente' || chave === 'ascendant' || chave === 'asc') {
    return T(`${agente} sobre o Ascendente`, `${agente} over the Ascendant`, `${agente} sobre el Ascendente`, `${agente} sull Ascendente`)
  }
  return T(`${agente} sobre ${alvoTraduzido}`, `${agente} over ${alvoTraduzido}`, `${agente} sobre ${alvoTraduzido}`, `${agente} su ${alvoTraduzido}`)
}

/** O aspecto por extenso, para a linha discreta da fonte. */
const ASPECTO_POR_EXTENSO: Record<string, [string, string, string, string]> = {
  conjuncao: ['em conjunção com', 'conjunct', 'en conjuncion con', 'in congiunzione con'],
  oposicao: ['em oposição a', 'opposite', 'en oposicion a', 'in opposizione a'],
  quadratura: ['em quadratura com', 'square', 'en cuadratura con', 'in quadratura con'],
  trigono: ['em trígono a', 'trine', 'en trigono a', 'in trigono a'],
  sextil: ['em sextil com', 'sextile', 'en sextil con', 'in sestile con'],
  quincuncio: ['em quincúncio com', 'quincunx', 'en quincuncio con', 'in quinconce con'],
  semiquadratura: ['em semiquadratura com', 'semisquare', 'en semicuadratura con', 'in semiquadrato con'],
  sesquiquadratura: ['em sesquiquadratura com', 'sesquisquare', 'en sesquicuadratura con', 'in sesquiquadrato con'],
}

/**
 * "Sol em quadratura com Netuno" — a origem, dita por extenso.
 *
 * Por extenso e não por sigla: o modo Linguagem simples vem LIGADO por padrão
 * no app, e "ASC" contraria isso. "Ascendente" continua sendo o termo técnico,
 * só que legível para quem não decorou abreviação.
 */
function fonteDoTransito(t: TransitoAtivo, idioma: AppLanguage): string {
  const T = tl(idioma)
  const agente = translatePlanet(String(t.transitPlanet || ''), idioma)
  const alvo = String(t.natalPlanet || '')
  const chave = alvo.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z]/g, '')
  const ehAngulo =
    chave === 'meiodoceu' || chave === 'midheaven' || chave === 'mc' ||
    chave === 'ascendente' || chave === 'ascendant' || chave === 'asc'

  // ⚠️ O transito pode tocar o PROPRIO planeta — e ai a frase saia "Sol em
  // oposicao a Sol", que le como erro de digitacao, nao como informacao.
  //
  // E um dos casos mais significativos que existem (o retorno do planeta a si
  // mesmo), entao merece ser dito com clareza: o segundo Sol e o NATAL, o do
  // mapa da pessoa. "ao seu Sol natal" resolve a repeticao e ainda diz qual e
  // qual.
  const mesmoPlaneta =
    !!t.transitPlanet && !!t.natalPlanet &&
    String(t.transitPlanet).toLowerCase() === String(t.natalPlanet).toLowerCase()

  // ⚠️ "Sol em trígono a Marte" não diz QUAL é o trânsito e qual é o ponto do
  // mapa da pessoa — e essa é a distinção que faz a frase significar algo.
  //
  // O possessivo resolve sem poluir: o alvo leva "seu/sua" porque é do mapa
  // dela; o primeiro planeta, sem possessivo, é o céu de hoje. Mais econômico
  // que carimbar "(trânsito)" e "(natal)" em toda linha.
  const nomeAlvo = translatePlanet(alvo, idioma)
  const alvoLegivel = mesmoPlaneta
    ? T(`seu ${nomeAlvo} natal`, `your natal ${nomeAlvo}`, `tu ${nomeAlvo} natal`, `il tuo ${nomeAlvo} natale`)
    : ehAngulo
      ? (chave === 'meiodoceu' || chave === 'midheaven' || chave === 'mc'
          ? T('seu Meio do Céu', 'your Midheaven', 'tu Medio Cielo', 'il tuo Medio Cielo')
          : T('seu Ascendente', 'your Ascendant', 'tu Ascendente', 'il tuo Ascendente'))
      : T(`seu ${nomeAlvo}`, `your ${nomeAlvo}`, `tu ${nomeAlvo}`, `il tuo ${nomeAlvo}`)
  const tipo = String(t.type || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  const par = ASPECTO_POR_EXTENSO[tipo]
  let asp = par ? T(par[0], par[1], par[2], par[3]) : T('sobre', 'over', 'sobre', 'su')

  // Os angulos pedem artigo em portugues: "em oposicao a Meio do Ceu" esta
  // errado — o certo e "ao Meio do Ceu". Planeta nao leva artigo ("a Netuno"),
  // entao a contracao vale so para Ascendente e Meio do Ceu.
  // "em oposição a" + "seu Marte" pede contração: "ao seu Marte". Como o alvo
  // agora leva sempre possessivo, a regra vale para todos.
  if (idioma === 'pt-BR') {
    if (asp.endsWith(' a')) asp = `${asp.slice(0, -2)} ao`
    else if (asp.endsWith(' com')) asp = `${asp} o`
  }
  return `${agente} ${asp} ${alvoLegivel}`
}

/** Identidade de um trânsito, para a lista detalhada não repetir o que já foi dito. */
const chaveDoTransito = (t: TransitoAtivo) =>
  `${t.transitPlanet}|${t.type}|${t.natalPlanet}`

/**
 * O VERBO do trânsito — o que ele faz com o ponto.
 *
 * Antes isto devolvia "em atrito" e "em fluxo", que descrevem a GEOMETRIA do
 * aspecto, não o que acontece. Quem lê não precisa saber o ângulo; precisa
 * saber que algo pressiona ou que algo facilita.
 */
function verboDoTransito(t: TransitoAtivo, idioma: AppLanguage): string {
  const T = tl(idioma)
  const n = naturezaReal(t)
  if (n === 'desafiador') return T('pressiona', 'presses on', 'presiona', 'preme su')
  if (n === 'harmonico') return T('favorece', 'favours', 'favorece', 'favorisce')
  return T('ativa', 'activates', 'activa', 'attiva')
}

const areasDe = (t: TransitoAtivo, idioma: AppLanguage) =>
  areasAffectedByTransit(t.transitPlanet, t.natalPlanet, t.house).map((k) => getLifeAreaLabelI18n(k, idioma))

/**
 * Monta a leitura do momento.
 *
 * Devolve estrutura, não texto pronto: quem renderiza decide o que mostrar no
 * topo e o que fica atrás do "Ler mais".
 */
export function sintetizarODia(
  transitos: ReadonlyArray<TransitoAtivo>,
  idioma: AppLanguage = 'pt-BR',
  agora: Date = new Date(),
): SinteseDoDia | null {
  const ativos = (transitos || []).filter((t) => t?.transitPlanet && t?.natalPlanet && t?.type)
  if (!ativos.length) return null

  const T = tl(idioma)
  const E = T('e', 'and', 'y', 'e')
  const ordenados = [...ativos].sort((a, b) => forca(b) - forca(a))

  const lentos = ordenados.filter((t) => LENTOS.has(String(t.transitPlanet)))
  const rapidos = ordenados.filter((t) => RAPIDOS.has(String(t.transitPlanet)))

  const blocos: BlocoDaSintese[] = []

  // ── 1) O FUNDO: os lentos, que são o período e não o dia ─────────────────
  const fundo = lentos.slice(0, 2)
  if (fundo.length) {
    const citacoes = fundo.map((t) => {
      const area = areasDe(t, idioma)[0]
      const c = citar(t, idioma)
      return area ? T(`${c}, mexendo em ${area}`, `${c}, stirring ${area}`, `${c}, moviendo ${area}`, `${c}, muovendo ${area}`) : c
    })
    const todosPassados = fundo.every((t) => faseDoTransito(t, agora) === 'depois')
    const abertura = fundo.length > 1
      ? T('Dois movimentos longos sustentam o momento:', 'Two long movements hold the moment:', 'Dos movimientos largos sostienen el momento:', 'Due movimenti lunghi sostengono il momento:')
      : T('Um movimento longo sustenta o momento:', 'One long movement holds the moment:', 'Un movimiento largo sostiene el momento:', 'Un movimento lungo sostiene il momento:')
    // Dizer o que a pessoa PERCEBE, não classificar a fase. "Fase de efeito,
    // não de novidade" é vocabulário de quem escreve, não de quem lê.
    const nota = todosPassados
      ? T(' O momento mais forte dos dois já passou; o que sobra ainda se arruma.',
          ' The strongest moment of both has passed; what remains is still settling.',
          ' El momento mas fuerte de ambos ya paso; lo que queda aun se acomoda.',
          ' Il momento piu forte dei due e gia passato; cio che resta si sta ancora sistemando.')
      : ''
    blocos.push({
      chave: 'fundo',
      rotulo: T('O fundo', 'The background', 'El fondo', 'Lo sfondo'),
      texto: costurar(abertura, `${enumerar(citacoes, E)}.`, nota),
    })
  }

  // ── 2) HOJE: quem toca o quê, e o que isso faz ───────────────────────────
  //
  // UM conjunto só para achar o foco e para listar quem o toca. Antes o foco
  // era procurado num recorte e os trânsitos vinham de outro: o texto anunciava
  // "Netuno é o ponto focal" e mostrava um trânsito só, parecendo erro de conta.
  const conjuntoHoje = rapidos
  const focal = pontoFocal(conjuntoHoje)
  let textoHoje = ''

  if (focal) {
    // Dois trânsitos no mesmo ponto: diz o que CADA um faz, porque é a
    // diferença entre eles que descreve o dia.
    const noFoco = conjuntoHoje.filter((t) => t.natalPlanet === focal.planeta)
    const ponto = nomeDoPonto(focal.planeta, idioma) || translatePlanet(focal.planeta, idioma)
    const tensos = noFoco.filter((t) => naturezaReal(t) === 'desafiador')
    const faceis = noFoco.filter((t) => naturezaReal(t) === 'harmonico')

    const quem = (lista: TransitoAtivo[]) =>
      enumerar(lista.map((t) => comArtigo(String(t.transitPlanet), idioma)), E)

    if (tensos.length && faceis.length) {
      // O caso mais comum e o mais informativo: um puxa, outro solta.
      const efeitoTenso = efeitoNoPonto(focal.planeta, 'tenso', idioma)
      const efeitoFacil = efeitoNoPonto(focal.planeta, 'facil', idioma)
      textoHoje = costurar(
        T(`Hoje ${quem(tensos)} pressiona ${ponto} e ${quem(faceis)} favorece.`,
          `Today ${quem(tensos)} presses on ${ponto} and ${quem(faceis)} favours it.`,
          `Hoy ${quem(tensos)} presiona ${ponto} y ${quem(faceis)} lo favorece.`,
          `Oggi ${quem(tensos)} preme su ${ponto} e ${quem(faceis)} lo favorisce.`),
        efeitoTenso && efeitoFacil
          ? T(`${maiuscula(efeitoTenso)}, mas ${efeitoFacil}.`,
              `${maiuscula(efeitoTenso)}, but ${efeitoFacil}.`,
              `${maiuscula(efeitoTenso)}, pero ${efeitoFacil}.`,
              `${maiuscula(efeitoTenso)}, ma ${efeitoFacil}.`)
          : '',
      )
    } else {
      const natureza = tensos.length ? 'tenso' : 'facil'
      const efeito = efeitoNoPonto(focal.planeta, natureza, idioma)
      const verbo = tensos.length
        ? T('pressionam', 'press on', 'presionan', 'premono su')
        : T('favorecem', 'favour', 'favorecen', 'favoriscono')
      textoHoje = costurar(
        T(`Hoje ${quem(noFoco)} ${verbo} ${ponto}.`,
          `Today ${quem(noFoco)} ${verbo} ${ponto}.`,
          `Hoy ${quem(noFoco)} ${verbo} ${ponto}.`,
          `Oggi ${quem(noFoco)} ${verbo} ${ponto}.`),
        efeito ? `${maiuscula(efeito)}.` : '',
      )
    }
  } else {
    // Sem convergência, o mais forte do dia manda — com o efeito dito.
    const t = conjuntoHoje.find((x) => faseDoTransito(x, agora) !== 'antes') || conjuntoHoje[0]
    if (t) {
      const ponto = nomeDoPonto(String(t.natalPlanet), idioma) || translatePlanet(String(t.natalPlanet), idioma)
      const efeito = efeitoNoPonto(String(t.natalPlanet), naturezaReal(t) === 'desafiador' ? 'tenso' : 'facil', idioma)
      textoHoje = costurar(
        T(`Hoje ${comArtigo(String(t.transitPlanet), idioma)} ${verboDoTransito(t, idioma)} ${ponto}.`,
          `Today ${comArtigo(String(t.transitPlanet), idioma)} ${verboDoTransito(t, idioma)} ${ponto}.`,
          `Hoy ${comArtigo(String(t.transitPlanet), idioma)} ${verboDoTransito(t, idioma)} ${ponto}.`,
          `Oggi ${comArtigo(String(t.transitPlanet), idioma)} ${verboDoTransito(t, idioma)} ${ponto}.`),
        efeito ? `${maiuscula(efeito)}.` : '',
      )
    }
  }

  if (textoHoje) {
    blocos.push({ chave: 'hoje', rotulo: T('Hoje', 'Today', 'Hoy', 'Oggi'), texto: textoHoje })
  }

  // ── 3) VEM AÍ: o que ainda não chegou ao ponto exato ─────────────────────
  const chegando = ordenados
    .map((t) => ({ t, dias: diasAteExato(t, agora) }))
    .filter((x) => x.dias != null && x.dias >= 1 && x.dias <= 10)
    .sort((a, b) => (a.dias as number) - (b.dias as number))[0]

  if (chegando) {
    const { t, dias } = chegando
    const area = areasDe(t, idioma)[0]
    const casa = casaQueConcentra(ordenados)
    const soma = casa && typeof t.house === 'number' && t.house === casa.casa
      ? T(' — somando à área que o período já move.', ' — adding to the area the period already moves.',
          ' — sumando al area que el periodo ya mueve.', ' — sommandosi all area che il periodo gia muove.')
      : ''
    blocos.push({
      chave: 'vemAi',
      rotulo: T('Vem aí', 'Coming up', 'Viene', 'In arrivo'),
      texto: costurar(
        T(`Em ${dias} ${dias === 1 ? 'dia' : 'dias'}, ${citar(t, idioma)} chega ao ponto exato`,
          `In ${dias} ${dias === 1 ? 'day' : 'days'}, ${citar(t, idioma)} reaches its exact point`,
          `En ${dias} ${dias === 1 ? 'dia' : 'dias'}, ${citar(t, idioma)} llega al punto exacto`,
          `Tra ${dias} ${dias === 1 ? 'giorno' : 'giorni'}, ${citar(t, idioma)} arriva al punto esatto`),
        soma || (area ? T(` em ${area}.`, ` on ${area}.`, ` en ${area}.`, ` su ${area}.`) : '.'),
      ),
    })
  }

  // ── 4) NO SALDO: o balanço, ponderado ────────────────────────────────────
  const b = balanco(ordenados)
  const casa = casaQueConcentra(ordenados)
  // ⚠️ A CONTA PRECISA FECHAR NA FRENTE DE QUEM LE.
  //
  // Antes a frase anunciava `ordenados.length` como total e logo em seguida
  // dava duas parcelas que nao somavam: "44 transitos ativos: os 27 que pedem
  // cuidado pesam mais que os 15 de apoio" — 27 + 15 = 42. Os 2 que faltavam
  // eram os NEUTROS, que nao entram em nenhum dos lados.
  //
  // Um numero que nao bate com as proprias parcelas faz o leitor desconfiar do
  // resto do texto, e com razao. Como os neutros nao pesam no saldo, a saida e
  // nao prometer um total: cita-se as duas parcelas, que e o que a frase
  // realmente compara.
  const saldo = b.dominante === 'tenso'
    ? T(`Dos trânsitos ativos, os ${b.nTenso} que pedem cuidado pesam mais que os ${b.nHarmonico} de apoio.`,
        `Among the active transits, the ${b.nTenso} asking for care weigh more than the ${b.nHarmonico} supportive ones.`,
        `De los transitos activos, los ${b.nTenso} que piden cuidado pesan mas que los ${b.nHarmonico} de apoyo.`,
        `Fra i transiti attivi, i ${b.nTenso} che chiedono cura pesano piu dei ${b.nHarmonico} di sostegno.`)
    : b.dominante === 'harmonico'
      ? T(`Dos trânsitos ativos, os ${b.nHarmonico} de apoio pesam mais que os ${b.nTenso} que pedem cuidado.`,
          `Among the active transits, the ${b.nHarmonico} supportive ones weigh more than the ${b.nTenso} asking for care.`,
          `De los transitos activos, los ${b.nHarmonico} de apoyo pesan mas que los ${b.nTenso} que piden cuidado.`,
          `Fra i transiti attivi, i ${b.nHarmonico} di sostegno pesano piu dei ${b.nTenso} che chiedono cura.`)
      : T(`Entre os trânsitos ativos, apoio e pressão ficam em equilíbrio.`,
          `Among the active transits, support and pressure stay in balance.`,
          `Entre los transitos activos, apoyo y presion quedan en equilibrio.`,
          `Fra i transiti attivi, sostegno e pressione restano in equilibrio.`)

  const concentra = casa
    ? T(` A Casa ${casa.casa} concentra ${casa.quantos} deles.`, ` House ${casa.casa} holds ${casa.quantos} of them.`,
        ` La Casa ${casa.casa} concentra ${casa.quantos} de ellos.`, ` La Casa ${casa.casa} ne concentra ${casa.quantos}.`)
    : ''

  blocos.push({
    chave: 'saldo',
    rotulo: T('No saldo', 'The balance', 'En el saldo', 'Il bilancio'),
    texto: costurar(saldo, concentra),
  })

  // ── O CONSELHO SAIU ──────────────────────────────────────────────────────
  //
  // Havia um bloco "O que fazer" com uma recomendação derivada do balanço
  // ("Decisão grande pode esperar…"). Decisão do João: tirar.
  //
  // Faz sentido com o resto: as frases do dia já dizem o que muda e em relação
  // a quê, e a pessoa decide o que fazer com isso. O conselho vinha de um
  // conjunto pequeno de moldes, então repetia com frequência — e conselho que
  // se repete deixa de ser conselho.
  // ── AS FRASES DO DIA: efeito em destaque, origem discreta ───────────────
  //
  // Uma por PONTO DO MAPA tocado, não uma por trânsito: dois planetas no mesmo
  // ponto contam a mesma história e devem caber na mesma frase. Antes só o
  // ponto mais tocado virava texto — num dia com dezenas de trânsitos ativos,
  // todo o resto ficava mudo.
  //
  // Ordenadas por força somada: a primeira é a que a Home mostra sem abrir.
  const porPonto = new Map<string, TransitoAtivo[]>()
  for (const t of conjuntoHoje) {
    const alvo = String(t.natalPlanet || '')
    if (!alvo) continue
    const lista = porPonto.get(alvo) || []
    lista.push(t)
    porPonto.set(alvo, lista)
  }

  const frases: FraseDoDia[] = []
  // ⚠️ A ordem deixa de ser só por força.
  //
  // Doze frases ordenadas por peso são doze blocos iguais, e a pessoa não tem
  // como saber o que é de HOJE. Primeiro o que está exato agora, depois o que
  // vem, por último o que já passou do pico — dentro de cada grupo, a força
  // continua mandando.
  const PESO_DA_FASE: Record<Fase, number> = { agora: 0, antes: 1, depois: 2 }
  const gruposOrdenados = [...porPonto.entries()]
    .map(([alvo, ts]) => {
      const ordenadosPorForca = [...ts].sort((a, b) => forca(b) - forca(a))
      return {
        alvo,
        ts,
        peso: ts.reduce((a, t) => a + forca(t), 0),
        fase: faseDoTransito(ordenadosPorForca[0], agora),
      }
    })
    .sort((a, b) => (PESO_DA_FASE[a.fase] - PESO_DA_FASE[b.fase]) || (b.peso - a.peso))

  for (const g of gruposOrdenados) {
    const tensos = g.ts.filter((t) => naturezaReal(t) === 'desafiador')
    const faceis = g.ts.filter((t) => naturezaReal(t) === 'harmonico')
    // Sem lado definido não há efeito a descrever — citar só o aspecto seria
    // devolver a geometria, que é justamente o que este módulo existe p/ evitar.
    if (!tensos.length && !faceis.length) continue

    // ⚠️ Quando o ponto recebe os DOIS lados, isto colava `tenso` e `facil`
    // com um "mas". Como os dois foram escritos como espelhos, o resultado se
    // desdizia:
    //
    //     "Agir encontra mais obstáculo do que de costume — mas agir
    //      encontra menos obstáculo do que de costume."
    //
    // Funcionava por acaso quando os lados falavam de sujeitos diferentes
    // ("a clareza custa mais… mas a intuição fica mais afiada"). Com o mesmo
    // sujeito, virava contradição literal.
    //
    // Estar dividido é uma situação real e comum — um trânsito pressiona o
    // ponto enquanto outro o favorece — e tem texto próprio, que descreve a
    // DIVISÃO em vez de empilhar duas afirmações opostas.
    const misto = tensos.length && faceis.length
    const efeitoBruto = misto
      ? efeitoNoPonto(g.alvo, 'misto', idioma)
      : efeitoNoPonto(g.alvo, tensos.length ? 'tenso' : 'facil', idioma)
    if (!efeitoBruto) continue
    const efeito = `${maiuscula(efeitoBruto)}.`

    // Os mais fortes primeiro, no máximo dois por linha: três origens numa
    // linha discreta deixam de ser referência e viram outra frase para ler.
    const citados = [...g.ts].sort((a, b) => forca(b) - forca(a)).slice(0, 2)
    const principal = citados[0]

    // A fase vem do trânsito mais forte do grupo: é ele que define se a
    // leitura é de hoje, do que vem ou do que ficou.
    const fase = faseDoTransito(principal, agora)

    // Duas áreas no máximo. A terceira em diante deixa de informar e vira
    // lista — e a frase acima já disse o que acontece.
    const areas = [...new Set(citados.flatMap((t) => areasDe(t, idioma)))].slice(0, 2)

    const casa = citados.map((t) => Number(t.house)).find((h) => Number.isFinite(h) && h > 0) || null

    frases.push({
      efeito,
      fonte: citados.map((t) => fonteDoTransito(t, idioma)).join(' · '),
      chaves: citados.map(chaveDoTransito),
      fase,
      casa,
      areas,
      // No grupo "acontecendo agora" a janela é redundante (é hoje, e o
      // cabeçalho já diz). Nos outros dois ela é a informação principal.
      quando: fase === 'agora' ? '' : janelaEmPalavras(principal.window as any, idioma as any, agora),
    })
  }

  // O topo da Home leva a primeira frase; sem ela, o bloco "Hoje" ou o fundo.
  const resumo = frases[0]
    ? costurar(frases[0].efeito, '')
    : textoHoje || blocos[0]?.texto || ''

  return { resumo, frases, blocos }
}
