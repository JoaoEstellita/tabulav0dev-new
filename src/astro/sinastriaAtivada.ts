import { Body } from 'astronomy-engine'
import { getPlanetEclipticLongitude } from './planets'
import type { SynastryAspect } from './synastry'
import { PLANETAS_DA_AREA, AREAS_SINASTRIA, type AreaSinastria } from './sinastriaPorArea'

/**
 * O QUE O CÉU ESTÁ ATIVANDO NO VÍNCULO — hoje e à frente.
 *
 * O vínculo (`sinastriaPorArea`) é FIXO: os aspectos entre dois mapas não mudam
 * nunca. O que muda é quais desses contatos o céu está tocando. Esta é a outra
 * metade, e ela vive separada de propósito — num número só, a pessoa não
 * saberia se mudou o vínculo ou o céu.
 *
 * ⚠️ O MODELO: um contato de sinastria (a Vênus dela em trígono com o Marte
 * dele) é ativado quando um planeta em trânsito faz aspecto com o GRAU de uma
 * das duas pontas. É o mesmo raciocínio do trânsito sobre o natal, aplicado ao
 * ponto onde os dois mapas se tocam.
 *
 * ⚠️ UM PONTO POR DIA SERIA RUÍDO COM CARA DE SINAL. O que move a leitura de um
 * casal em 45 dias são os trânsitos LENTOS; a Lua muda o número todo dia e não
 * diz nada sobre o período. Por isso a Lua fica de fora da curva e a amostragem
 * é a cada poucos dias — uma curva lisa onde cada ponto se sustenta, em vez de
 * uma serrilha que parece precisão.
 *
 * ⚠️ NÃO É PREVISÃO DE RELACIONAMENTO. O número diz quanto do vínculo está
 * sendo tocado, não se o dia vai ser bom. "O céu está mexendo no que vocês têm
 * de afeto" é leitura; "hoje é um bom dia para vocês" é outra coisa, e o app
 * não faz isso em lugar nenhum.
 */

/**
 * Os planetas que formam a curva.
 *
 * ⚠️ SEM A LUA, de propósito — ver o cabeçalho. Ela daria um dente de serra
 * diário sobre uma leitura que é de semanas.
 */
const TRANSITANTES: Array<{ nome: string; body: Body; durabilidade: number }> = [
  { nome: 'Sun', body: Body.Sun, durabilidade: 0.9 },
  { nome: 'Mercury', body: Body.Mercury, durabilidade: 0.9 },
  { nome: 'Venus', body: Body.Venus, durabilidade: 0.95 },
  { nome: 'Mars', body: Body.Mars, durabilidade: 1.15 },
  { nome: 'Jupiter', body: Body.Jupiter, durabilidade: 1.35 },
  { nome: 'Saturn', body: Body.Saturn, durabilidade: 1.5 },
  { nome: 'Uranus', body: Body.Uranus, durabilidade: 1.5 },
  { nome: 'Neptune', body: Body.Neptune, durabilidade: 1.5 },
  { nome: 'Pluto', body: Body.Pluto, durabilidade: 1.6 },
]

/** Os ângulos que contam, com o tom e a orbe de cada um. */
const ASPECTOS = [
  { nome: 'conjuncao', angulo: 0, orbe: 6, sinal: 0.5 },
  { nome: 'sextil', angulo: 60, orbe: 4, sinal: 1 },
  { nome: 'quadratura', angulo: 90, orbe: 5, sinal: -1 },
  { nome: 'trigono', angulo: 120, orbe: 5, sinal: 1 },
  { nome: 'oposicao', angulo: 180, orbe: 6, sinal: -1 },
]

const norm360 = (v: number) => ((v % 360) + 360) % 360
const separacao = (a: number, b: number) => {
  const d = Math.abs(norm360(a) - norm360(b)) % 360
  return d > 180 ? 360 - d : d
}
const chave = (p: unknown) => String(p || '').toLowerCase().trim()

/**
 * Na conjunção quem decide é quem se funde — MESMA lista do cálculo das
 * emoções (`emocoesDoDia`). Divergir faria a mesma conjunção pesar de um jeito
 * nos anéis e de outro aqui, no mesmo mapa.
 */
const CONJUNCAO_PESADA = new Set(['saturn', 'pluto', 'mars', 'uranus', 'neptune'])

export type ContatoDoVinculo = {
  mine: string
  theirs: string
  aspect: string
  tone: string
  orb: number
  /** O grau de cada ponta — é por aqui que o trânsito toca. */
  lonMine: number
  lonTheirs: number
}

export type PontoDaCurva = {
  /** AAAA-MM-DD */
  dia: string
  /** Quanto do vínculo está sendo tocado, por área. 0 quando nada toca. */
  areas: Partial<Record<AreaSinastria, number>>
  /** O que mais pesa naquele ponto, para a tela poder nomear. */
  principal: { planeta: string; aspecto: string; contato: string } | null
}

/**
 * Monta os contatos com o GRAU de cada ponta.
 *
 * ⚠️ Sem as longitudes não há o que ativar: o trânsito toca um GRAU, não um
 * nome de planeta. Contato sem grau é descartado em vez de entrar com zero.
 */
export function contatosComGrau(
  aspectos: ReadonlyArray<SynastryAspect> | null | undefined,
  lonMine: Record<string, number> | null | undefined,
  lonTheirs: Record<string, number> | null | undefined,
): ContatoDoVinculo[] {
  const out: ContatoDoVinculo[] = []
  for (const a of (aspectos || [])) {
    const lm = Number(lonMine?.[chave(a.mine)])
    const lt = Number(lonTheirs?.[chave(a.theirs)])
    if (!Number.isFinite(lm) || !Number.isFinite(lt)) continue
    out.push({
      mine: chave(a.mine), theirs: chave(a.theirs), aspect: String(a.aspect),
      tone: chave(a.tone), orb: Number(a.orb) || 0, lonMine: lm, lonTheirs: lt,
    })
  }
  return out
}

/** As áreas que um contato alimenta (as mesmas regras do vínculo fixo). */
function areasDoContato(c: ContatoDoVinculo): AreaSinastria[] {
  return AREAS_SINASTRIA.filter((a) =>
    PLANETAS_DA_AREA[a].has(c.mine) || PLANETAS_DA_AREA[a].has(c.theirs))
}

/**
 * Quanto o céu de um instante toca cada área do vínculo.
 *
 * O sinal segue o TOM DO CONTATO, não o do trânsito: um trânsito que acende um
 * contato tenso acende a tensão. Ativar não é melhorar nem piorar — é trazer
 * o assunto para a mesa, e o assunto já tem a cor dele.
 */
export function ativacaoNoInstante(
  contatos: ReadonlyArray<ContatoDoVinculo>,
  quando: Date,
): { areas: Partial<Record<AreaSinastria, number>>; principal: PontoDaCurva['principal'] } {
  const soma: Partial<Record<AreaSinastria, number>> = {}
  let melhor: { peso: number; planeta: string; aspecto: string; contato: string } | null = null

  const lonsTransito = TRANSITANTES.map((t) => {
    let lon = NaN
    try { lon = getPlanetEclipticLongitude(quando, t.body) } catch { /* sem efeméride */ }
    return { ...t, lon }
  }).filter((t) => Number.isFinite(t.lon))

  for (const c of contatos) {
    const areas = areasDoContato(c)
    if (!areas.length) continue
    // ⚠️ A CONJUNÇÃO NÃO É "LEVEMENTE BOA". A primeira versão deu +0,4 a ela, e
    // a medição mostrou o estrago: como a conjunção é frequente, aquele +0,4
    // empurrava a soma de TODO par para o positivo (mediana bruta +2,43), e a
    // curva passava a dizer "o céu favorece" na maioria dos dias — um constante
    // que se lê como descoberta.
    //
    // A regra certa é a que o projeto já usa em toda parte: na conjunção quem
    // decide é QUEM se funde. Saturno, Plutão, Marte, Urano e Netuno pesam;
    // o resto afaga. Mesma lista do cálculo das emoções — divergir faria a
    // mesma conjunção pesar de um jeito nos anéis e de outro aqui.
    const sinalDoContato = c.tone === 'harmonioso' ? 1
      : c.tone === 'tenso' ? -1
        : (CONJUNCAO_PESADA.has(c.mine) || CONJUNCAO_PESADA.has(c.theirs) ? -1 : 1)

    for (const t of lonsTransito) {
      for (const ponta of [c.lonMine, c.lonTheirs]) {
        const sep = separacao(t.lon, ponta)
        for (const asp of ASPECTOS) {
          const orb = Math.abs(sep - asp.angulo)
          if (orb > asp.orbe) continue
          // Exatidão × durabilidade do planeta × força do aspecto de trânsito.
          const exatidao = 1 - orb / asp.orbe
          const peso = exatidao * t.durabilidade * Math.abs(asp.sinal)
          const contrib = peso * sinalDoContato
          for (const a of areas) soma[a] = (soma[a] || 0) + contrib
          if (!melhor || peso > melhor.peso) {
            melhor = { peso, planeta: t.nome, aspecto: asp.nome, contato: `${c.mine}-${c.theirs}` }
          }
          break // um aspecto por par trânsito↔ponta
        }
      }
    }
  }

  return {
    areas: soma,
    principal: melhor ? { planeta: melhor.planeta, aspecto: melhor.aspecto, contato: melhor.contato } : null,
  }
}

/**
 * ⚠️ A ESCALA. A soma bruta não tem teto natural, e um número sem teto não
 * desenha gráfico. A curva é a MESMA família que o resto do projeto usa
 * (`100 × (1 − e^(−K×soma))`).
 *
 * ⚠️ O K FOI MEDIDO, e a primeira tentativa errou por quatro vezes. Com K=0,55
 * a mediana escalada dava 81 e 27% dos pontos batiam no teto (0 ou 100) — um
 * gráfico que fica colado no topo não é gráfico. Medido em 3.597 amostras (120
 * pares × 6 datas × 5 áreas), a soma bruta tem |mediana| 4,4 e p90 14,1.
 *
 * Com K=0,12 a distribuição sai p10=23 · p25=37 · p50=54 · p75=71 · p90=84, e
 * NADA satura. É o espalhamento que faz a curva ter o que mostrar.
 */
export const K_ATIVACAO = 0.12

/** 0–100 a partir da soma bruta, preservando o sinal (tensão vs apoio). */
export function paraEscalaAtivacao(soma: number): number {
  const mag = Math.round(100 * (1 - Math.exp(-K_ATIVACAO * Math.abs(soma))))
  // 50 é "nada acontecendo"; acima, o céu acende o que há de bom; abaixo, o que
  // há de tenso. Um eixo só, porque é uma leitura só.
  return Math.max(0, Math.min(100, Math.round(50 + (soma >= 0 ? mag : -mag) / 2)))
}

export const DIAS_DA_CURVA = 45
/** ⚠️ Amostragem: ver o cabeçalho. Diário seria serrilha, não leitura. */
export const PASSO_DIAS = 3

/**
 * A curva do vínculo ativado, de hoje até `dias` à frente.
 *
 * Puro: não lê banco, não chama rede. Roda no aparelho em milissegundos e, no
 * backend, sem custo de leitura — o custo é CPU, e é pequeno.
 */
export function curvaDoVinculo(
  contatos: ReadonlyArray<ContatoDoVinculo>,
  opcoes?: { de?: Date; dias?: number; passo?: number },
): PontoDaCurva[] {
  if (!contatos?.length) return []
  const de = opcoes?.de ? new Date(opcoes.de) : new Date()
  const dias = Math.max(1, opcoes?.dias ?? DIAS_DA_CURVA)
  const passo = Math.max(1, opcoes?.passo ?? PASSO_DIAS)

  const pontos: PontoDaCurva[] = []
  for (let d = 0; d <= dias; d += passo) {
    const quando = new Date(de.getTime() + d * 86400000)
    const { areas, principal } = ativacaoNoInstante(contatos, quando)
    const escalado: Partial<Record<AreaSinastria, number>> = {}
    for (const a of AREAS_SINASTRIA) escalado[a] = paraEscalaAtivacao(areas[a] || 0)
    pontos.push({ dia: quando.toISOString().slice(0, 10), areas: escalado, principal })
  }
  return pontos
}
