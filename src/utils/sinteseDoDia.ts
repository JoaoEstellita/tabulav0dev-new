import { translatePlanet, aspectNature, type AppLanguage } from './astro/pt'
import { areasAffectedByTransit } from './transitLifeAreas'
import { getLifeAreaLabelI18n } from '../constants/lifeAreas'
import { nomeDoPonto, efeitoNoPonto, detalheDoPonto } from './efeitoDoTransito'
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
  /**
   * A segunda linha: como isso aparece no dia e o que fazer com isso.
   *
   * ⚠️ A manchete sozinha e bonita e vaga — diz que ha uma tensao, nao diz
   * o que a pessoa faz com ela. Esta linha e o que transforma a frase em
   * leitura.
   *
   * ⚠️ PODE VIR VAZIA, e quem renderiza tem de aguentar isso sem sumir com
   * a frase: a manchete continua valendo sozinha.
   */
  detalhe: string
  /** De onde vem, tudo numa linha (compatibilidade). */
  fonte: string
  /**
   * Cada trânsito citado, com o SEU período.
   *
   * ⚠️ A frase agrupa por ponto e cita até dois trânsitos — mas a janela era
   * uma só, a do mais forte. "Mercúrio em conjunção e a Lua em conjunção com o
   * seu Plutão · 10/10 a 16/10" não diz de QUEM é esse período, e os dois têm
   * janelas diferentes: a Lua passa em dois dias, Mercúrio leva uma semana.
   *
   * Um período solto embaixo de dois trânsitos é pior que nenhum: parece valer
   * para os dois.
   */
  origens: Array<{ texto: string; quando: string }>
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
  /**
   * Quando o trânsito principal da frase COMEÇOU (ISO), para ordenar.
   *
   * ⚠️ `quando` é texto formatado e não serve para ordenar — "03/10 a 23/10" e
   * "13/04/26 a 13/04/27" não se comparam como string, e a comparação até
   * funcionaria por acidente dentro do mesmo ano, que é o pior tipo de bug.
   */
  inicio: string | null
  /**
   * Trânsito de planeta lento: tema de meses, não do dia.
   *
   * Essa distinção era a razão de existir do bloco "O fundo" — misturar um
   * tema de meses com um aspecto que dura horas faz os dois soarem igual.
   * Com o fundo removido, ela não podia sumir junto: passou a viver na
   * própria frase, dita em palavras ("tema de meses") em vez de num bloco
   * separado.
   */
  lento: boolean
  /**
   * De que lado o ponto pende: pressiona, favorece, ou os dois.
   *
   * É o que permite colorir o toque — vermelho pede atenção, verde favorece,
   * azul para o dividido, que não pende para lado nenhum. Varrer doze frases
   * por cor é mais rápido que ler doze frases.
   */
  natureza: 'tenso' | 'facil' | 'misto'
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
// ⚠️ MERCURIO faltava nas duas listas, e isso APAGAVA transitos.
//
// Conjuncao de planeta fora das duas caia em 'neutro', e a frase era
// descartada (so entram pontos com lado definido). Entao toda conjuncao de
// Mercurio sumia da leitura — e Mercurio conjunto a um ponto natal e um dos
// transitos mais frequentes que existem.
//
// Passava despercebido quando outro planeta tocava o mesmo ponto no mesmo dia:
// o grupo sobrevivia pelo outro, e a ausencia de Mercurio nao aparecia.
//
// Ele entra como LEVE: Mercurio nao pesa por si — assume a cor do que toca —,
// e em conjuncao o que faz e ativar.
const CONJUNCAO_LEVE = new Set(['Venus', 'Jupiter', 'Sun', 'Moon', 'Mercury'])

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
/**
 * Nome do aspecto e PREPOSIÇÃO, separados.
 *
 * Vinham colados ("em conjunção com"), o que impedia fatorar o alvo quando
 * dois trânsitos tocam o mesmo ponto: "Sol em trígono ao seu Marte · Lua em
 * sesquiquadratura com o seu Marte" repetia o Marte duas vezes.
 *
 * Separados, dá para escrever "Sol em trígono e Lua em sesquiquadratura com o
 * seu Marte" — e a regência fica correta, porque a preposição que rege é a do
 * ÚLTIMO aspecto citado.
 */
const ASPECTO_NOME: Record<string, [string, string, string, string]> = {
  conjuncao: ['conjunção', 'conjunct', 'conjuncion', 'congiunzione'],
  oposicao: ['oposição', 'opposite', 'oposicion', 'opposizione'],
  quadratura: ['quadratura', 'square', 'cuadratura', 'quadratura'],
  trigono: ['trígono', 'trine', 'trigono', 'trigono'],
  sextil: ['sextil', 'sextile', 'sextil', 'sestile'],
  quincuncio: ['quincúncio', 'quincunx', 'quincuncio', 'quinconce'],
  semiquadratura: ['semiquadratura', 'semisquare', 'semicuadratura', 'semiquadrato'],
  sesquiquadratura: ['sesquiquadratura', 'sesquisquare', 'sesquicuadratura', 'sesquiquadrato'],
}

/** Em pt/es/it o aspecto rege preposição; em inglês o nome já é a preposição. */
const ASPECTO_PREP: Record<string, [string, string, string, string]> = {
  conjuncao: ['com', '', 'con', 'con'],
  oposicao: ['a', '', 'a', 'a'],
  quadratura: ['com', '', 'con', 'con'],
  trigono: ['a', '', 'a', 'a'],
  sextil: ['com', '', 'con', 'con'],
  quincuncio: ['com', '', 'con', 'con'],
  semiquadratura: ['com', '', 'con', 'con'],
  sesquiquadratura: ['com', '', 'con', 'con'],
}

/**
 * "Sol em quadratura com Netuno" — a origem, dita por extenso.
 *
 * Por extenso e não por sigla: o modo Linguagem simples vem LIGADO por padrão
 * no app, e "ASC" contraria isso. "Ascendente" continua sendo o termo técnico,
 * só que legível para quem não decorou abreviação.
 */
/** O ponto natal pelo nome, com possessivo — é o que o distingue do trânsito. */
/**
 * O alvo natal e FEMININO neste idioma?
 *
 * ⚠️ "o Sol em trigono ao seu Lua" e "Jupiter em sextil com o seu Lua" sairam
 * assim na tela do Joao: a Lua e feminina e o possessivo estava fixo no
 * masculino. Em italiano o buraco e maior — Luna E Venere sao femininas, e a
 * frase saia "il tuo Luna".
 *
 * Espanhol usa "tu", que nao flexiona; ingles usa "your". So pt-BR e it-IT
 * precisam saber o genero.
 */
const ALVO_FEMININO: Partial<Record<AppLanguage, Set<string>>> = {
  'pt-BR': new Set(['lua', 'lilith']),
  'it-IT': new Set(['luna', 'venere', 'lilith']),
}

function alvoEhFeminino(nomeAlvo: string, idioma: AppLanguage): boolean {
  const set = ALVO_FEMININO[idioma]
  if (!set) return false
  return set.has(String(nomeAlvo || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''))
}

/** "seu Marte" / "sua Lua" — o possessivo que concorda com o alvo. */
function possessivo(nomeAlvo: string, idioma: AppLanguage, prepA = false): string {
  const fem = alvoEhFeminino(nomeAlvo, idioma)
  if (idioma === 'en-US') return 'your'
  if (idioma === 'es-ES') return 'tu'
  // Em italiano a preposicao "a" funde com o artigo do possessivo: "al tuo
  // Plutone", "alla tua Luna". Por isso ela chega ate aqui em vez de ficar solta.
  if (idioma === 'it-IT') {
    if (prepA) return fem ? 'alla tua' : 'al tuo'
    return fem ? 'la tua' : 'il tuo'
  }
  return fem ? 'sua' : 'seu'
}

function alvoNatalLegivel(t: TransitoAtivo, idioma: AppLanguage, prepA = false): string {
  const T = tl(idioma)
  const alvo = String(t.natalPlanet || '')
  const chave = alvo.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z]/g, '')
  const nomeAlvo = translatePlanet(alvo, idioma)

  // ⚠️ O transito pode tocar o PROPRIO planeta, e ai a frase saia "Sol em
  // oposicao a Sol" — le como erro de digitacao, nao como informacao. E um dos
  // transitos mais significativos que existem (o retorno do planeta a si
  // mesmo), entao "natal" entra para dizer qual e qual.
  const mesmoPlaneta =
    !!t.transitPlanet && !!t.natalPlanet &&
    String(t.transitPlanet).toLowerCase() === String(t.natalPlanet).toLowerCase()
  if (mesmoPlaneta) {
    const p = possessivo(nomeAlvo, idioma, prepA)
    return T(`${p} ${nomeAlvo} natal`, `your natal ${nomeAlvo}`, `${p} ${nomeAlvo} natal`,
             `${p} ${nomeAlvo} ${alvoEhFeminino(nomeAlvo, idioma) ? 'natale' : 'natale'}`)
  }
  if (chave === 'meiodoceu' || chave === 'midheaven' || chave === 'mc') {
    return T('seu Meio do Céu', 'your Midheaven', 'tu Medio Cielo', 'il tuo Medio Cielo')
  }
  if (chave === 'ascendente' || chave === 'ascendant' || chave === 'asc') {
    return T('seu Ascendente', 'your Ascendant', 'tu Ascendente', 'il tuo Ascendente')
  }
  // ⚠️ "Sol em trigono a Marte" nao diz QUAL e o transito e qual e o ponto do
  // mapa da pessoa — e essa distincao e o que faz a frase significar algo. O
  // possessivo resolve sem poluir: o alvo leva "seu" porque e dela; o
  // primeiro planeta, sem possessivo, e o ceu de hoje.
  const p = possessivo(nomeAlvo, idioma, prepA)
  return T(`${p} ${nomeAlvo}`, `your ${nomeAlvo}`, `${p} ${nomeAlvo}`, `${p} ${nomeAlvo}`)
}

const tipoDoAspecto = (t: TransitoAtivo) =>
  String(t.type || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

/** "Sol em trígono", "Lua em sesquiquadratura" — sem o alvo. */
function agenteEAspecto(t: TransitoAtivo, idioma: AppLanguage): string {
  const T = tl(idioma)
  // Com artigo: "o Sol em quadratura e a Lua em trigono" le melhor que a
  // lista crua de nomes, e o artigo ja existe no mapa de planetas.
  const agente = comArtigo(String(t.transitPlanet || ''), idioma)
  const par = ASPECTO_NOME[tipoDoAspecto(t)]
  if (!par) return T(`${agente} sobre`, `${agente} over`, `${agente} sobre`, `${agente} su`)
  const nome = T(par[0], par[1], par[2], par[3])
  // ⚠️ O "em" era português e vazava para TODOS os idiomas menos o inglês:
  // "Sole em trigono", "Sol em trigono a tu Luna". A preposição que liga o
  // agente ao aspecto muda por idioma.
  const liga = T('em', '', 'en', 'in')
  return [agente, liga, nome].filter(Boolean).join(' ')
}

/**
 * A ORIGEM da leitura, com o alvo citado UMA vez.
 *
 * ⚠️ Antes cada trânsito trazia o seu próprio alvo, e como as frases agrupam
 * por ponto, o mesmo ponto aparecia duas vezes:
 *
 *     "Sol em trígono ao seu Marte · Lua em sesquiquadratura com o seu Marte"
 *
 * Fatorado, o alvo fica no fim e vale para os dois. A preposição que rege é a
 * do ÚLTIMO aspecto citado — é ela que encosta no alvo.
 */
function fonteDosTransitos(ts: ReadonlyArray<TransitoAtivo>, idioma: AppLanguage): string {
  if (!ts.length) return ''
  const T = tl(idioma)
  const ultimo = ts[ts.length - 1]
  const partes = ts.map((t) => agenteEAspecto(t, idioma))

  const parPrep = ASPECTO_PREP[tipoDoAspecto(ultimo)]
  let prep = parPrep ? T(parPrep[0], parPrep[1], parPrep[2], parPrep[3]) : ''

  // Contração em português: "a" + "seu" = "ao seu"; "com" + "seu" = "com o seu".
  // ⚠️ E concorda com o GENERO do alvo, senão sai "ao seu Lua" / "com o seu Lua".
  const fem = alvoEhFeminino(translatePlanet(String(ultimo.natalPlanet || ''), idioma), idioma)
  // ⚠️ Em italiano a preposição "a" FUNDE com o artigo do possessivo ("al tuo
  // Plutone", "alla tua Luna"); solta, saía "a la tua Luna", que não é italiano.
  // Por isso ela viaja até o alvo em vez de ficar entre os dois.
  const fundeNoAlvo = idioma === 'it-IT' && prep === 'a'
  if (idioma === 'pt-BR') {
    if (prep === 'a') prep = fem ? 'à' : 'ao'
    else if (prep === 'com') prep = fem ? 'com a' : 'com o'
  } else if (fundeNoAlvo) {
    prep = ''
  }

  const alvo = alvoNatalLegivel(ultimo, idioma, fundeNoAlvo)

  const sujeitos = partes.length > 1
    ? T(`${partes.slice(0, -1).join(', ')} e ${partes[partes.length - 1]}`,
        `${partes.slice(0, -1).join(', ')} and ${partes[partes.length - 1]}`,
        `${partes.slice(0, -1).join(', ')} y ${partes[partes.length - 1]}`,
        `${partes.slice(0, -1).join(', ')} e ${partes[partes.length - 1]}`)
    : partes[0]

  return [sujeitos, prep, alvo].filter(Boolean).join(' ')
}

/** Identidade de um trânsito, para a lista detalhada não repetir o que já foi dito. */
const chaveDoTransito = (t: TransitoAtivo) =>
  `${t.transitPlanet}|${t.type}|${t.natalPlanet}`

const MES = [
  ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'],
  ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
  ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'],
]

/**
 * Quanto tempo o trânsito LENTO ainda dura.
 *
 * ⚠️ Para um lento, dizer "passou pelo ponto exato há 9 dias" informa pouco e
 * engana um pouco: dá a impressão de algo que terminou, quando Plutão sobre o
 * Meio do Céu ainda tem meses pela frente. O pico passou; o trânsito, não.
 *
 * O que importa num tema de meses é até quando ele dura — e isso muda o que a
 * pessoa faz com a informação.
 */
/**
 * O período do trânsito, em datas: "10/10 a 16/10".
 *
 * ⚠️ Antes isto era relativo — "chega ao exato em 3 dias", "até abril", "no
 * ponto exato agora". Lê fácil, mas deixa a pergunta prática sem resposta:
 * quando começa e quando acaba. Para marcar uma conversa ou escolher uma
 * semana, a pessoa precisa da data.
 *
 * Só põe o ano quando o período cruza a virada — dentro do mesmo ano ele é
 * ruído repetido em doze linhas.
 */
function periodoEmDatas(t: TransitoAtivo, idioma: AppLanguage, agora: Date): string {
  const T = tl(idioma)
  const bruto = (v?: string) => (v ? new Date(v) : null)
  const valida = (d: Date | null): d is Date => !!d && !isNaN(d.getTime())
  const ini = bruto(t.window?.start)
  const fim = bruto(t.window?.end)
  if (!valida(ini) && !valida(fim)) return ''

  const ano = agora.getFullYear()
  const cruzaAno = (valida(ini) && ini.getFullYear() !== ano) || (valida(fim) && fim.getFullYear() !== ano)
  const dd = (d: Date) => String(d.getDate()).padStart(2, '0')
  const mm = (d: Date) => String(d.getMonth() + 1).padStart(2, '0')
  const fmt = (d: Date) => (cruzaAno ? dd(d) + '/' + mm(d) + '/' + String(d.getFullYear()).slice(-2) : dd(d) + '/' + mm(d))

  if (valida(ini) && valida(fim)) {
    return T(fmt(ini) + ' a ' + fmt(fim), fmt(ini) + ' to ' + fmt(fim), fmt(ini) + ' a ' + fmt(fim), fmt(ini) + ' al ' + fmt(fim))
  }
  if (valida(fim)) return T('até ' + fmt(fim), 'until ' + fmt(fim), 'hasta ' + fmt(fim), 'fino al ' + fmt(fim))
  return T('desde ' + fmt(ini as Date), 'since ' + fmt(ini as Date), 'desde ' + fmt(ini as Date), 'dal ' + fmt(ini as Date))
}

/** Dias inteiros de calendario entre hoje e uma data (ignora a hora). */
function diasDeCalendario(alvo: Date, agora: Date): number {
  const a = new Date(alvo.getFullYear(), alvo.getMonth(), alvo.getDate()).getTime()
  const b = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate()).getTime()
  return Math.round((a - b) / 86400000)
}

/**
 * ONDE HOJE ESTA dentro da janela — a pergunta que o periodo sozinho nao responde.
 *
 * ⚠️ "07/10 a 18/10" nao diz se o transito esta subindo, no pico, ou acabando,
 * e e justamente isso que muda o que a pessoa faz com a informacao. Um transito
 * no ponto exato hoje le completamente diferente de um que esta se afastando —
 * e os dois aparecem com a mesma cara na lista.
 *
 * O dado ja existia: `window.exact`. A matinal do WhatsApp ja imprime "pico
 * hoje"; o app nao imprimia nada. Mesmo dado, dois comportamentos.
 *
 * Fragmento CURTO de proposito (no maximo tres palavras): ele entra depois das
 * datas, e a linha de origem precisa continuar sendo discreta.
 */
function faseDaJanela(t: TransitoAtivo, idioma: AppLanguage, agora: Date): string {
  const T = tl(idioma)
  const data = (v?: string) => {
    const d = v ? new Date(v) : null
    return d && !isNaN(d.getTime()) ? d : null
  }
  const ini = data(t.window?.start)
  const exato = data(t.window?.exact)
  const fim = data(t.window?.end)

  // ⚠️ SÓ DOIS CASOS. A primeira versão rotulava TODA linha — "pico em 2 dias",
  // "depois do pico", "em curso" — e com dez trânsitos na tela cada linha virava
  // duas, com a maioria carregando "depois do pico", que é o rótulo mais comum e
  // o que menos muda a decisão de hoje.
  //
  // Marcador que aparece sempre não marca nada. Ficam os dois que mudam o que a
  // pessoa faz AGORA: o dia do pico e o último dia. O resto é o período, e o
  // período já está nas datas ao lado.
  if (fim && diasDeCalendario(fim, agora) === 0) {
    return T('último dia', 'last day', 'ultimo dia', 'ultimo giorno')
  }
  if (exato && diasDeCalendario(exato, agora) === 0) {
    return T('pico hoje', 'peak today', 'pico hoy', 'picco oggi')
  }
  // Datas sem fase: o começo, o fim e o pico futuro se leem direto do período.
  void ini
  return ''
}

/**
 * O periodo de um transito: as datas, e a fase só quando ela é excecao.
 *
 * ⚠️ "em curso" saiu. Ele resolvia uma leitura ruim — "12/04/26 a 12/04/27" com
 * hoje em 13/10/26 parece compromisso marcado, nao algo ja ativo ha seis meses —
 * mas custava duas palavras em TODA linha de lento, e com o periodo mais a fase
 * a linha quebrava em duas. O agrupamento "Transitos lentos" ja diz que aquilo
 * e um tema em andamento; o rotulo repetia por linha o que o titulo diz uma vez.
 */
function janelaCompleta(t: TransitoAtivo, idioma: AppLanguage, agora: Date, lento: boolean): string {
  const datas = periodoEmDatas(t, idioma, agora)
    || (lento ? duracaoDoLento(t, idioma, agora) : janelaEmPalavras(t.window as any, idioma as any, agora))
  const fase = faseDaJanela(t, idioma, agora)
  return [datas, fase].filter(Boolean).join('  ·  ')
}

function duracaoDoLento(t: TransitoAtivo, idioma: AppLanguage, agora: Date): string {
  const T = tl(idioma)
  const fim = t.window?.end ? new Date(t.window.end) : null
  if (!fim || isNaN(fim.getTime()) || fim <= agora) {
    return T('tema de meses', 'a theme of months', 'tema de meses', 'tema di mesi')
  }
  const idx = idioma === 'en-US' ? 1 : idioma === 'es-ES' ? 2 : idioma === 'it-IT' ? 3 : 0
  const mes = MES[idx][fim.getMonth()]
  const dias = Math.round((fim.getTime() - agora.getTime()) / 86400000)
  // Até uns dois meses a data fecha a conta; além disso, o mês já basta e o
  // número de dias vira precisão falsa num trânsito que ainda vai mudar.
  if (dias <= 60) {
    return T(`até ${fim.getDate()} de ${mes}`, `until ${mes} ${fim.getDate()}`,
             `hasta el ${fim.getDate()} de ${mes}`, `fino al ${fim.getDate()} di ${mes}`)
  }
  return T(`até ${mes}`, `until ${mes}`, `hasta ${mes}`, `fino a ${mes}`)
}

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

  // ── OS TRÊS BLOCOS SAÍRAM ────────────────────────────────────────────────
  //
  // Havia "O fundo" (os lentos em prosa), "Hoje" e "Vem aí" — três estruturas
  // para contar a mesma coisa que as frases já contam, cada uma com a sua
  // forma e o seu vocabulário.
  //
  // "Vem aí" era o mais frágil: produzia frases como "Em 1 dia, Mercúrio sobre
  // Plutão chega ao ponto exato em Amor" — que diz o quando e o quê, mas não
  // diz o que MUDA, que é o trabalho deste módulo inteiro.
  //
  // O grupo "Chegando" das frases entrega as três coisas melhor: o efeito em
  // destaque, o aspecto nomeado e a janela. E "O fundo" virou a marca `lento`
  // dentro da própria frase, para a distinção entre período e dia não se
  // perder junto com o bloco.
  //
  // Uma estrutura só, um vocabulário só.

  // ⚠️ TODO o ceu, nao so os rapidos.
  //
  // As frases cobriam `conjuntoHoje` (= rapidos) porque os lentos tinham
  // bloco proprio, "O fundo". Com o fundo removido, restringir aqui faria
  // Urano e Plutao — os transitos mais significativos que a pessoa tem —
  // sumirem da tela inteira.
  //
  // O que o fundo protegia era a distincao entre periodo e dia, e ela segue
  // viva: cada frase diz se e tema de meses ou se passa hoje.
  const porPonto = new Map<string, TransitoAtivo[]>()
  for (const t of ordenados) {
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
    // ⚠️ Dentro do grupo, o MAIS RECENTE primeiro — nao o mais forte.
    //
    // A forca ordenava bem a lista inteira, mas dentro de um grupo ja separado
    // por tempo ela mistura: um transito que passou do pico ha duas semanas
    // ficava acima de um que esta exato hoje so por pesar mais. Quem abre o
    // app de manha quer o que esta acontecendo agora no topo.
    //
    // Proximidade do ponto exato e o criterio: quanto mais perto do pico, mais
    // "agora" ele e. A forca segue como desempate.
    .sort((a, b) => {
      const porFase = PESO_DA_FASE[a.fase] - PESO_DA_FASE[b.fase]
      if (porFase) return porFase
      const dist = (g: typeof a) => {
        const d = diasAteExato([...g.ts].sort((x, y) => forca(y) - forca(x))[0], agora)
        return d == null ? Number.POSITIVE_INFINITY : Math.abs(d)
      }
      return (dist(a) - dist(b)) || (b.peso - a.peso)
    })

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
    // A segunda linha vem do MESMO ponto e da MESMA natureza da manchete —
    // senao as duas falariam de dias diferentes na mesma frase.
    const detalheBruto = detalheDoPonto(g.alvo, misto ? 'misto' : (tensos.length ? 'tenso' : 'facil'), idioma)
    const detalhe = detalheBruto ? `${maiuscula(detalheBruto)}` : ''

    // Os mais fortes primeiro, no máximo dois por linha: três origens numa
    // linha discreta deixam de ser referência e viram outra frase para ler.
    //
    // ⚠️ QUANDO É MISTO, UM DE CADA LADO — e isto não é preferência de ordem,
    // é honestidade.
    //
    // `tensos` e `faceis` são contados sobre o GRUPO INTEIRO, mas só dois
    // trânsitos aparecem na tela. Pegando os dois mais fortes sem olhar a
    // natureza, um grupo com três harmônicos fortes e um tenso fraco dizia
    // "a ação rende numa frente e esbarra em outra" e mostrava dois aspectos
    // harmônicos embaixo — a frase afirmava uma divisão que a evidência
    // visível negava, e quem sabe ler um sextil percebia na hora.
    //
    // O texto de `misto` existe para descrever a DIVISÃO; citar os dois lados
    // é o que o torna verificável. A síntese do WhatsApp já fazia assim, em
    // palavras ("Hoje X pressiona e Y favorece") — era só o app que não.
    const maisForte = (lista: typeof g.ts) =>
      [...lista].sort((a, b) => forca(b) - forca(a))[0]
    const citados = misto
      ? [maisForte(tensos), maisForte(faceis)]
          .filter(Boolean)
          .sort((a, b) => forca(b) - forca(a))
      : [...g.ts].sort((a, b) => forca(b) - forca(a)).slice(0, 2)
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
      detalhe,
      fonte: fonteDosTransitos(citados, idioma),
      // Uma linha por trânsito, cada uma com a sua janela. Desfaz a fatoração
      // do alvo (que aparecia uma vez só) — mas o alvo repetido custa menos
      // que um período que não se sabe de quem é.
      // ⚠️ `maiuscula` porque a linha ABRE com o agente, e Sol e Lua levam
      // artigo ("a Lua em conjunção…"). Minúscula no começo da linha lê como
      // erro de digitação, não como estilo.
      origens: citados.map((t) => ({
        texto: maiuscula(fonteDosTransitos([t], idioma)),
        quando: janelaCompleta(t, idioma, agora, LENTOS.has(String(t.transitPlanet || ''))),
      })),
      chaves: citados.map(chaveDoTransito),
      fase,
      casa,
      areas,
      lento: LENTOS.has(String(principal.transitPlanet || '')),
      natureza: misto ? 'misto' : (tensos.length ? 'tenso' : 'facil'),
      // ⚠️ DATA, nao mais tempo relativo — e para TODOS os grupos, inclusive o
      // "acontecendo agora", que antes ficava sem janela por ser redundante
      // com o cabecalho.
      //
      // Era redundante enquanto a janela dizia so "hoje". Dizendo de quando a
      // quando, deixa de ser: "chega ao exato em 3 dias" le facil mas nao
      // responde a pergunta pratica — para marcar uma conversa ou escolher uma
      // semana, a pessoa precisa da data.
      //
      // Sem data conhecida, cai no relativo: melhor "tema de meses" que nada.
      quando: janelaCompleta(principal, idioma, agora, LENTOS.has(String(principal.transitPlanet || ''))),
      inicio: principal.window?.start || null,
    })
  }

  // O topo da Home leva a primeira frase. Nao ha mais blocos para servirem de
  // alternativa: sem frase, a sintese nao tem o que dizer — e dizer nada e
  // melhor que uma frase vaga.
  const resumo = frases[0] ? frases[0].efeito : ''

  return { resumo, frases }
}
