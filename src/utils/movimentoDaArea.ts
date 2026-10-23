/**
 * QUANTO DE UMA ÁREA DA VIDA ESTÁ EM MOVIMENTO HOJE.
 *
 * A roda de status mostra a NOTA de cada área — e uma nota sozinha não diz se
 * ela veio de um trânsito que acaba sexta-feira ou de um que está ali há dois
 * anos. São situações opostas para quem lê: uma pede ação agora, a outra pede
 * paciência, e as duas apareciam com o mesmo número.
 *
 * Este módulo responde a segunda pergunta: dos trânsitos que compõem a área,
 * quanto do peso vem do que está passando rápido.
 *
 * ⚠️ NÃO É previsão nem delta. O app não guarda histórico de status, então não
 * há "ontem" para comparar. É volatilidade: o quanto desta nota tende a mudar
 * em dias, e não em meses. Chamar isso de "variação" seria mentir sobre o dado.
 *
 * ⚠️ Mora num `.ts` e não num `.tsx` de propósito: o Vitest não interpreta
 * `react-native`, então dado que precisa de teste fica fora de componente.
 */

/** O formato de trânsito que `mergeAreaTransits` devolve. */
export type TransitoDaArea = {
  transitPlanet?: string
  strength?: number
  durationClass?: 'curto' | 'medio' | 'longo'
}

/**
 * Planetas RÁPIDOS — a reserva de quando `durationClass` não vem preenchido.
 *
 * A mesma lista que o resto do projeto usa pelo avesso (`LENTOS` em
 * `emocoesDoDia`): Sol, Lua, Mercúrio, Vênus e Marte trocam de aspecto em dias
 * ou semanas; de Júpiter para fora, em meses ou anos.
 */
const RAPIDOS = new Set(['sun', 'moon', 'mercury', 'venus', 'mars'])

const norm = (v: unknown) =>
  String(v || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z]/g, '')

/**
 * O quanto UM trânsito conta como "em movimento", de 0 a 1.
 *
 * ⚠️ `longo` não vale ZERO. Um trânsito de Plutão também se move — devagar, e
 * exatamente por isso ele é o pano de fundo e não a notícia. Zerar faria a
 * sombra sumir em áreas que de fato estão mudando, só que devagar.
 */
export function mobilidade(t: TransitoDaArea): number {
  switch (t?.durationClass) {
    case 'curto': return 1
    case 'medio': return 0.5
    case 'longo': return 0.15
    default:
      // Sem o campo, decide pelo planeta. `personalTodayRich` e algumas outras
      // fontes do projeto não trazem `durationClass`.
      return RAPIDOS.has(norm(t?.transitPlanet)) ? 1 : 0.15
  }
}

/** O peso do trânsito na área: a força que o motor deu, normalizada. */
function peso(t: TransitoDaArea): number {
  const n = Number(t?.strength)
  if (!Number.isFinite(n) || n <= 0) return 1
  return n > 1 ? Math.min(1, n / 100) : Math.min(1, n)
}

/**
 * De 0 a 100, quanto do peso da área vem do que passa rápido.
 *
 * Devolve `null` quando não há trânsito nenhum: a roda precisa distinguir
 * "nada se move" de "não sabemos", e pintar zero diria a primeira coisa quando
 * a verdade é a segunda.
 */
export function movimentoDaArea(transitos: ReadonlyArray<TransitoDaArea> | null | undefined): number | null {
  const lista = Array.isArray(transitos) ? transitos.filter(Boolean) : []
  if (!lista.length) return null

  let total = 0
  let movel = 0
  for (const t of lista) {
    const p = peso(t)
    total += p
    movel += p * mobilidade(t)
  }
  if (total <= 0) return null
  return Math.round(100 * (movel / total))
}

/**
 * O RAIO DA SOMBRA na roda: a parte da nota que está em jogo hoje.
 *
 * ⚠️ A sombra é sempre MENOR ou igual ao polígono principal, nunca maior, e é
 * isso que a torna legível: o desenho cheio é a nota, a sombra é a fatia dela
 * que se mexe, e o vão entre as duas é o que está assentado. Duas formas na
 * mesma escala contando partes do mesmo número.
 *
 * Desenhar a sombra no valor BRUTO do movimento (uma porcentagem independente)
 * criaria dois polígonos em escalas diferentes no mesmo lugar — que é o jeito
 * clássico de fazer um gráfico mentir sem querer.
 */
export function valorDaSombra(valor: number | null, movimento: number | null): number | null {
  if (valor === null || valor === undefined) return null
  if (movimento === null || movimento === undefined) return null
  const v = Number(valor)
  const m = Number(movimento)
  if (!Number.isFinite(v) || !Number.isFinite(m)) return null
  return Math.max(0, Math.min(100, v)) * (Math.max(0, Math.min(100, m)) / 100)
}
