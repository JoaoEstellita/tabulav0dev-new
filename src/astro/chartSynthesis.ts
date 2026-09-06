// Síntese do mapa — a camada que amarra as partes num RETRATO. Deriva, a partir do
// que o engine já calcula (elemental/modalidade) + dos planetas por casa/signo:
//  - elemento e modalidade DOMINANTES (temperamento base)
//  - elemento em FALTA (o que pede desenvolvimento consciente)
//  - STELLIUMS (3+ planetas concentrados numa casa ou signo = tema de vida)
//  - ênfase de HEMISFÉRIO (eu×outros, privado×público)
// Só os 10 planetas tradicionais entram (Sol..Plutão); nódulos/Lilith ficam de fora.

export type ElementKey = 'fire' | 'earth' | 'air' | 'water'
export type ModalityKey = 'cardinal' | 'fixed' | 'mutable'

export interface SynthesisPlanet { name: string; sign?: string; house?: number }

export interface ChartSynthesis {
  dominantElement: ElementKey | null
  lackingElement: ElementKey | null
  dominantModality: ModalityKey | null
  stelliums: { kind: 'house' | 'sign'; where: string; count: number }[]
  hemisphereVertical: 'upper' | 'lower' | null   // acima (público) × abaixo (privado) do horizonte
  hemisphereHorizontal: 'eastern' | 'western' | null // leste (autonomia) × oeste (relação)
}

const MAIN_PLANETS = new Set(['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'])

function argmax<K extends string>(counts: Record<K, number>): K | null {
  let best: K | null = null
  let bestVal = -Infinity
  for (const k of Object.keys(counts) as K[]) {
    if (counts[k] > bestVal) { bestVal = counts[k]; best = k }
  }
  return bestVal > 0 ? best : null
}

export function computeChartSynthesis(input: {
  elemental?: Record<ElementKey, number> | null
  modality?: Record<ModalityKey, number> | null
  planets: SynthesisPlanet[]
}): ChartSynthesis {
  const { elemental, modality } = input
  const planets = input.planets.filter(p => MAIN_PLANETS.has(p.name))

  const dominantElement = elemental ? argmax(elemental) : null
  // Falta = elemento com contagem ZERO (ausência real e significativa).
  let lackingElement: ElementKey | null = null
  if (elemental) {
    for (const el of ['fire', 'earth', 'air', 'water'] as ElementKey[]) {
      if (elemental[el] === 0) { lackingElement = el; break }
    }
  }
  const dominantModality = modality ? argmax(modality) : null

  // Stelliums: 3+ planetas na mesma casa ou no mesmo signo.
  const byHouse: Record<string, number> = {}
  const bySign: Record<string, number> = {}
  for (const p of planets) {
    if (typeof p.house === 'number') byHouse[p.house] = (byHouse[p.house] || 0) + 1
    if (p.sign) bySign[p.sign] = (bySign[p.sign] || 0) + 1
  }
  const stelliums: ChartSynthesis['stelliums'] = []
  for (const [h, c] of Object.entries(byHouse)) if (c >= 3) stelliums.push({ kind: 'house', where: h, count: c })
  for (const [s, c] of Object.entries(bySign)) if (c >= 3) stelliums.push({ kind: 'sign', where: s, count: c })
  stelliums.sort((a, b) => b.count - a.count)

  // Hemisférios (precisa de casa em ao menos ~8 dos 10 planetas para valer).
  const withHouse = planets.filter(p => typeof p.house === 'number')
  let hemisphereVertical: ChartSynthesis['hemisphereVertical'] = null
  let hemisphereHorizontal: ChartSynthesis['hemisphereHorizontal'] = null
  if (withHouse.length >= 8) {
    const upper = withHouse.filter(p => (p.house as number) >= 7).length // casas 7–12 acima do horizonte
    const lower = withHouse.length - upper
    const eastern = withHouse.filter(p => { const h = p.house as number; return h >= 10 || h <= 3 }).length // 10,11,12,1,2,3
    const western = withHouse.length - eastern
    const need = Math.ceil(withHouse.length * 0.7) // ênfase = ~70% de um lado
    if (upper >= need) hemisphereVertical = 'upper'
    else if (lower >= need) hemisphereVertical = 'lower'
    if (eastern >= need) hemisphereHorizontal = 'eastern'
    else if (western >= need) hemisphereHorizontal = 'western'
  }

  return { dominantElement, lackingElement, dominantModality, stelliums, hemisphereVertical, hemisphereHorizontal }
}
