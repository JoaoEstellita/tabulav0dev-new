/**
 * OS TRÂNSITOS DE UM MEMBRO DO GRUPO, em lista única e no formato do cálculo.
 *
 * ⚠️ O CAMPO CERTO É `lifeAreas[area].activeTransits`, NÃO `areaTransits`.
 *
 * `member.areaTransits` existe no tipo e chega SEMPRE VAZIO: o backend o zera
 * de propósito (`lib/group/status.js`, "areaTransits fica vazio para não
 * reintroduzir o cache local desatualizado"). Os trânsitos vivos moram dentro
 * de cada área, em `activeTransits`, que é o snapshot fresco.
 *
 * Minha primeira versão deste arquivo lia `areaTransits`. Não dava erro: a
 * lista vinha vazia, `emocoesDoDia` devolvia `null` e a seção de tendência
 * emocional simplesmente não aparecia para nenhum membro — indistinguível de
 * "esta pessoa não tem trânsitos hoje".
 *
 * ⚠️ E O FORMATO É OUTRO. `activeTransits` não usa os mesmos nomes de campo que
 * o resto do projeto:
 *
 *     aspectName          em vez de  type
 *     target.natalPlanet  em vez de  natalPlanet   (aninhado, e pode ser `angle`)
 *     impact              em vez de  strength
 *     startAt / endAt     em vez de  durationClass
 *
 * Passar o item cru adiante não quebraria nada visível — os campos chegariam
 * `undefined`, tudo seria filtrado e a conta daria zero. É a mesma classe de
 * falha silenciosa que já mordeu este projeto várias vezes.
 */

/** Um item como vem em `lifeAreas[area].activeTransits`. */
export type TransitoAtivo = {
  transitPlanet?: string
  aspectName?: string
  aspectType?: string
  target?: { natalPlanet?: string; angle?: string; house?: number } | null
  orb?: number | null
  impact?: number | null
  applying?: boolean
  startAt?: string | null
  endAt?: string | null
}

/** O formato que `emocoesDoDia` e `movimentoDaArea` esperam. */
export type TransitoDeArea = {
  transitPlanet?: string
  natalPlanet?: string
  type?: string
  orb?: number
  strength?: number
  durationClass?: 'curto' | 'medio' | 'longo'
}

/** Um membro, só na parte que interessa aqui. */
type MembroComAreas = {
  lifeAreas?: Record<string, { activeTransits?: ReadonlyArray<TransitoAtivo> } | any> | null
} | null | undefined

/**
 * A classe de duração, derivada da janela.
 *
 * `activeTransits` não traz `durationClass`, mas traz `startAt` e `endAt` — e é
 * a duração que diz se o trânsito é notícia do dia ou pano de fundo. Sem isto a
 * sombra de movimento da roda cairia toda no ramo de reserva (pelo planeta),
 * que é mais grosseiro.
 *
 * Os cortes seguem o resto do projeto: até duas semanas é curto, até três meses
 * é médio, daí para cima é longo.
 */
export function duracaoDoTransito(t: TransitoAtivo): 'curto' | 'medio' | 'longo' | undefined {
  const ini = t?.startAt ? new Date(t.startAt).getTime() : NaN
  const fim = t?.endAt ? new Date(t.endAt).getTime() : NaN
  if (!Number.isFinite(ini) || !Number.isFinite(fim) || fim <= ini) return undefined
  const dias = (fim - ini) / 86400000
  if (dias <= 14) return 'curto'
  if (dias <= 90) return 'medio'
  return 'longo'
}

/** Traduz um item de `activeTransits` para o formato do cálculo. */
export function paraFormatoDoCalculo(t: TransitoAtivo): TransitoDeArea | null {
  const planeta = String(t?.transitPlanet || '').trim()
  const aspecto = String(t?.aspectName || t?.aspectType || '').trim()
  // Sem planeta ou sem aspecto não há o que calcular. É o caso dos fatores de
  // ênfase de casa, que entram em `activeTransits` sem aspecto nenhum.
  if (!planeta || !aspecto) return null

  // O alvo vem ANINHADO, e pode ser um ponto natal ou um ângulo (ASC, MC…).
  const alvo = String(t?.target?.natalPlanet || t?.target?.angle || '').trim()

  const fora: TransitoDeArea = {
    transitPlanet: planeta,
    type: aspecto,
    natalPlanet: alvo || undefined,
  }
  if (typeof t?.orb === 'number' && Number.isFinite(t.orb)) fora.orb = t.orb
  if (typeof t?.impact === 'number' && Number.isFinite(t.impact)) fora.strength = t.impact
  const dur = duracaoDoTransito(t)
  if (dur) fora.durationClass = dur
  return fora
}

const chave = (t: TransitoDeArea) =>
  [t?.transitPlanet, t?.type, t?.natalPlanet]
    .map((v) => String(v || '').toLowerCase().trim())
    .join('|')

/**
 * A lista do dia inteira, sem repetição.
 *
 * ⚠️ A DEDUPLICAÇÃO NÃO É DETALHE. Os trânsitos vivem dentro de cada área, e o
 * mesmo trânsito aparece em VÁRIAS: Saturno em quadratura com o Sol conta em
 * carreira, saúde e família ao mesmo tempo — três entradas do mesmo evento
 * astronômico. Concatenar sem deduplicar faria esse trânsito pesar três vezes
 * nas emoções, e os números sairiam inflados sem nada denunciar.
 *
 * A chave é o TRIO que define o aspecto — planeta que chega, tipo e ponto natal
 * tocado. Orbe e força são consequência dele, não parte da identidade.
 */
export function transitosDoMembro(membro: MembroComAreas): TransitoDeArea[] {
  const areas = membro?.lifeAreas
  if (!areas || typeof areas !== 'object') return []

  const vistos = new Set<string>()
  const saida: TransitoDeArea[] = []
  for (const area of Object.values(areas)) {
    const lista = (area as any)?.activeTransits
    if (!Array.isArray(lista)) continue
    for (const bruto of lista) {
      const t = paraFormatoDoCalculo(bruto)
      if (!t) continue
      const k = chave(t)
      if (vistos.has(k)) continue
      vistos.add(k)
      saida.push(t)
    }
  }
  return saida
}

/**
 * Os trânsitos de UMA área, para a sombra de movimento da roda.
 *
 * Aqui NÃO se deduplica: é uma área só, e repetição dentro dela seria o mesmo
 * trânsito listado duas vezes pelo motor — o que não acontece.
 */
export function transitosDaArea(membro: MembroComAreas, area: string): TransitoDeArea[] {
  const lista = (membro?.lifeAreas as any)?.[area]?.activeTransits
  if (!Array.isArray(lista)) return []
  return lista.map(paraFormatoDoCalculo).filter(Boolean) as TransitoDeArea[]
}
