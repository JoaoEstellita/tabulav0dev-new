/**
 * Trânsito CHINÊS do ANO — o animal+elemento do ano vigente (pilar do ano de hoje)
 * e a relação dele com o animal natal: mesmo (ano do próprio signo), amigo secreto
 * (Liu He), trígono de aliados (San He), choque (Chong), dano (Hai) ou neutro.
 */
import { buildChineseChart } from './bazi'
import { SIX_HARMONIES, SIX_CLASHES, THREE_HARMONIES, HARMS } from './constants'

export type YearRelation = 'same' | 'secret-friend' | 'ally' | 'clash' | 'harm' | 'neutral'

export interface ChineseYearTransit {
  branch: number        // 0-11 (animal do ano)
  element: string       // wood/fire/earth/metal/water
  polarity: string
  lunarYear: number
  relation: YearRelation
}

const pairHas = (pairs: [number, number][], a: number, b: number) =>
  pairs.some(([x, y]) => (x === a && y === b) || (x === b && y === a))

/** Relação entre 2 animais (0-11): mesmo, amigo secreto, aliados, choque, dano, neutro. */
export function animalRelation(a: number, b: number): YearRelation {
  if (a === b) return 'same'
  if (pairHas(SIX_HARMONIES, a, b)) return 'secret-friend'
  if (THREE_HARMONIES.some((th: any) => th.branches.includes(a) && th.branches.includes(b))) return 'ally'
  if (pairHas(SIX_CLASHES, a, b)) return 'clash'
  if (pairHas(HARMS, a, b)) return 'harm'
  return 'neutral'
}

/** Trânsito do ano para um animal natal (0-11). `date` default = hoje. */
export function chineseYearTransit(natalBranch: number, date: Date = new Date()): ChineseYearTransit | null {
  if (!Number.isFinite(Number(natalBranch))) return null
  // longitude 0 basta: o pilar do ANO (o que usamos) depende só da data + Lì Chūn.
  const chart = buildChineseChart({ year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate(), longitude: 0, utc: date })
  const cur = chart.zodiac.animalBranch
  return { branch: cur, element: chart.zodiac.element, polarity: chart.zodiac.polarity, lunarYear: chart.zodiac.lunarYear, relation: animalRelation(cur, natalBranch) }
}
