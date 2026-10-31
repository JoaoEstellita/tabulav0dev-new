import type { SynastryAspect } from './synastry'

/**
 * O VÍNCULO, ÁREA POR ÁREA — o que os dois mapas têm entre si, por tema.
 *
 * O `synastryScore` devolve UM número para a dupla inteira. Ele responde "vocês
 * combinam?" e para aí: um casal que conversa muito bem e se atrita no afeto
 * recebe o mesmo 50% de um que é morno nos dois. Aqui o mesmo material é lido
 * por tema, e a diferença entre as áreas é a leitura.
 *
 * ⚠️ O VÍNCULO É FIXO. Os aspectos entre dois mapas natais não mudam nunca —
 * este número não tem "hoje". O que muda é o que o céu ATIVA nele, e isso é
 * outra medida, que vive separada de propósito. Fundir as duas num número só
 * daria uma nota que sobe e desce sem a pessoa saber se mudou o vínculo ou o
 * céu — o mesmo erro que "hoje vs natal" existe para evitar nas emoções.
 *
 * ⚠️ A FÓRMULA É A DO `synastryScore`, não uma nova: mesmo peso de tom, mesma
 * curva de exatidão da orbe, mesmo bônus de planeta pessoal. Só muda QUAIS
 * aspectos entram em cada conta. Inventar uma fórmula por área exigiria
 * calibrá-la contra a geral depois, e áreas que não conversam com o total
 * seriam uma contradição na mesma tela.
 */

export type AreaSinastria = 'afeto' | 'comunicacao' | 'quimica' | 'sustentacao' | 'intensidade'

/**
 * Os planetas que respondem por cada área.
 *
 * ⚠️ UM ASPECTO PODE ENTRAR EM DUAS ÁREAS, de propósito: Vênus–Marte é afeto E
 * química, porque é as duas coisas. Forçar cada aspecto numa caixa só obrigaria
 * a escolher, e a escolha seria arbitrária.
 */
export const PLANETAS_DA_AREA: Record<AreaSinastria, ReadonlySet<string>> = {
  afeto: new Set(['venus', 'moon']),
  comunicacao: new Set(['mercury']),
  quimica: new Set(['mars', 'venus']),
  sustentacao: new Set(['saturn']),
  intensidade: new Set(['pluto', 'uranus']),
}

export const AREAS_SINASTRIA: AreaSinastria[] = ['afeto', 'comunicacao', 'quimica', 'sustentacao', 'intensidade']

/** Planetas pessoais pesam mais — mesma regra do `synastryScore`. */
const PESSOAIS = new Set(['sun', 'moon', 'mercury', 'venus', 'mars'])

/**
 * Peso do tom. Herdado do `synastryScore` para as duas contas conversarem.
 *
 * ⚠️ A conjunção é quase-neutra e POSITIVA (0,6), não zero: dois planetas no
 * mesmo grau se fundem, e fusão num vínculo é contato — o que decide se pesa é
 * QUEM se funde, e isso já entra pelo multiplicador de planeta pessoal.
 */
const PESO_DO_TOM: Record<string, number> = { harmonioso: 2, tenso: -2, neutro: 0.6 }

const chave = (p: unknown) => String(p || '').toLowerCase().trim()

export type ScoreDeArea = {
  /** 0–100, na mesma escala do `synastryScore` geral. */
  pct: number
  /** Quantos aspectos sustentam o número — é o que diz se dá para confiar nele. */
  quantos: number
  harmonicos: number
  tensos: number
  /** Os aspectos que mais pesaram, para a tela poder dizer de onde vem. */
  porque: Array<{ mine: string; theirs: string; aspect: string; tone: string; orb: number; peso: number }>
}

/**
 * ⚠️ MÍNIMO DE ASPECTOS PARA O NÚMERO EXISTIR.
 *
 * Uma área com UM aspecto só produziria 0 ou 100 conforme o tom dele — e um
 * número extremo apoiado numa única quadratura parece certeza e não é. Abaixo
 * disto a área devolve `null`, e a tela diz que o vínculo não tem contato forte
 * ali: que é uma informação, e verdadeira.
 */
export const MIN_ASPECTOS_POR_AREA = 2

/** O peso de um aspecto — exatidão × planetas pessoais, como no score geral. */
function pesoDoAspecto(a: SynastryAspect): number {
  const exatidao = Math.max(0, (6 - Math.min(6, Number(a.orb) || 0)) / 6)
  const pessoais = (PESSOAIS.has(chave(a.mine)) ? 1 : 0) + (PESSOAIS.has(chave(a.theirs)) ? 1 : 0)
  const mult = pessoais >= 2 ? 1.4 : pessoais === 1 ? 1.15 : 1
  return exatidao * mult
}

/** Os aspectos que tocam uma área (qualquer um dos dois planetas basta). */
export function aspectosDaArea(
  area: AreaSinastria,
  aspectos: ReadonlyArray<SynastryAspect> | null | undefined,
): SynastryAspect[] {
  const planetas = PLANETAS_DA_AREA[area]
  if (!planetas) return []
  return (aspectos || []).filter((a) => planetas.has(chave(a.mine)) || planetas.has(chave(a.theirs)))
}

/**
 * O vínculo de UMA área. `null` com contato insuficiente — ver
 * MIN_ASPECTOS_POR_AREA.
 */
export function vinculoDaArea(
  area: AreaSinastria,
  aspectos: ReadonlyArray<SynastryAspect> | null | undefined,
): ScoreDeArea | null {
  const lista = aspectosDaArea(area, aspectos)
  if (lista.length < MIN_ASPECTOS_POR_AREA) return null

  let soma = 0
  let harmonicos = 0
  let tensos = 0
  const porque: ScoreDeArea['porque'] = []

  for (const a of lista) {
    const tom = chave(a.tone)
    if (tom === 'harmonioso') harmonicos++
    else if (tom === 'tenso') tensos++
    const peso = pesoDoAspecto(a)
    const contrib = (PESO_DO_TOM[tom] ?? 0) * peso
    soma += contrib
    porque.push({
      mine: String(a.mine), theirs: String(a.theirs), aspect: String(a.aspect),
      tone: tom, orb: Number(a.orb) || 0, peso: Math.round(contrib * 100) / 100,
    })
  }

  // ⚠️ A MESMA CURVA do score geral (50 + soma×5, travada em 5–95). Mantê-la
  // idêntica é o que faz "Afeto 68" e "a dupla 62" serem comparáveis na mesma
  // tela; uma curva própria aqui exigiria calibração contra a outra.
  const pct = Math.max(5, Math.min(95, Math.round(50 + soma * 5)))

  porque.sort((x, y) => Math.abs(y.peso) - Math.abs(x.peso))
  return { pct, quantos: lista.length, harmonicos, tensos, porque: porque.slice(0, 5) }
}

/** As cinco áreas de uma vez. Áreas sem contato suficiente saem de fora. */
export function vinculoPorArea(
  aspectos: ReadonlyArray<SynastryAspect> | null | undefined,
): Partial<Record<AreaSinastria, ScoreDeArea>> | null {
  if (!aspectos || !aspectos.length) return null
  const out: Partial<Record<AreaSinastria, ScoreDeArea>> = {}
  for (const area of AREAS_SINASTRIA) {
    const v = vinculoDaArea(area, aspectos)
    if (v) out[area] = v
  }
  return Object.keys(out).length ? out : null
}
