/**
 * Yogas (combinações nomeadas do Jyotish) — os mais reconhecíveis e determinísticos,
 * calculados só com signo/casa (sem regência de casa, que é frágil). Puros.
 *
 *  Gaja-Kesari  — Júpiter em kendra (1/4/7/10) a partir da LUA → sabedoria, fama, fortuna.
 *  Budha-Aditya — Sol + Mercúrio no mesmo signo → inteligência, comunicação, mente ágil.
 *  Chandra-Mangala — Lua + Marte no mesmo signo → força, iniciativa, ganho pelo esforço.
 *  Pancha Mahapurusha (5) — um planeta em signo PRÓPRIO ou EXALTADO E em kendra do Lagna:
 *    Marte→Ruchaka, Mercúrio→Bhadra, Júpiter→Hamsa, Vênus→Malavya, Saturno→Sasa.
 */

export type YogaId =
  | 'gaja_kesari' | 'budha_aditya' | 'chandra_mangala'
  | 'ruchaka' | 'bhadra' | 'hamsa' | 'malavya' | 'sasa'

export interface DetectedYoga {
  id: YogaId
  planets: string[] // planetas envolvidos (chave inglesa)
}

// Regência de domicílio (rashiIndex → dono não é necessário; usamos own/exalt por planeta).
const OWN_SIGNS: Record<string, number[]> = {
  Sun: [4], Moon: [3], Mars: [0, 7], Mercury: [2, 5],
  Jupiter: [8, 11], Venus: [1, 6], Saturn: [9, 10],
}
const EXALT_SIGN: Record<string, number> = {
  Sun: 0, Moon: 1, Mars: 9, Mercury: 5, Jupiter: 3, Venus: 11, Saturn: 6,
}
const MAHAPURUSHA: Record<string, YogaId> = {
  Mars: 'ruchaka', Mercury: 'bhadra', Jupiter: 'hamsa', Venus: 'malavya', Saturn: 'sasa',
}
const KENDRAS = new Set([1, 4, 7, 10])

interface ChartLike {
  lagna: { rashiIndex: number }
  planets: Array<{ name: string; rashiIndex: number; house: number }>
}

/** Detecta os yogas presentes no mapa D1. Retorna [] se nenhum. */
export function detectYogas(chart: ChartLike | null | undefined): DetectedYoga[] {
  if (!chart || !Array.isArray(chart.planets)) return []
  const byName: Record<string, { rashiIndex: number; house: number }> = {}
  for (const p of chart.planets) byName[p.name] = { rashiIndex: p.rashiIndex, house: p.house }
  const out: DetectedYoga[] = []

  const moon = byName.Moon
  const jup = byName.Jupiter
  // Gaja-Kesari: Júpiter em kendra a partir da Lua (distância 0/3/6/9 signos).
  if (moon && jup) {
    const dist = ((jup.rashiIndex - moon.rashiIndex) % 12 + 12) % 12
    if (dist === 0 || dist === 3 || dist === 6 || dist === 9) out.push({ id: 'gaja_kesari', planets: ['jupiter', 'moon'] })
  }
  // Budha-Aditya: Sol + Mercúrio no mesmo signo.
  if (byName.Sun && byName.Mercury && byName.Sun.rashiIndex === byName.Mercury.rashiIndex) {
    out.push({ id: 'budha_aditya', planets: ['sun', 'mercury'] })
  }
  // Chandra-Mangala: Lua + Marte no mesmo signo.
  if (moon && byName.Mars && moon.rashiIndex === byName.Mars.rashiIndex) {
    out.push({ id: 'chandra_mangala', planets: ['moon', 'mars'] })
  }
  // Pancha Mahapurusha: planeta em signo próprio/exaltado E em kendra do Lagna.
  for (const [planet, yogaId] of Object.entries(MAHAPURUSHA)) {
    const p = byName[planet]
    if (!p) continue
    const dignified = (OWN_SIGNS[planet] || []).includes(p.rashiIndex) || EXALT_SIGN[planet] === p.rashiIndex
    if (dignified && KENDRAS.has(p.house)) out.push({ id: yogaId, planets: [planet.toLowerCase()] })
  }
  return out
}
