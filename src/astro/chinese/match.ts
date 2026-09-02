// Chinese Match (BaZi) — camada de compatibilidade entre 2 mapas. Score = MODELO
// DO APP construído sobre relações BaZi, não "compatibilidade oficial chinesa".
import { buildChineseChart, type ChineseInput } from './bazi'
import { STEMS, BRANCHES, GENERATES, CONTROLS, SIX_HARMONIES, SIX_CLASHES, HARMS, THREE_HARMONIES, tenGod } from './constants'
import type { ChineseProfile, TenGodKey, Element } from './types'

export const CHINESE_MATCH_WEIGHTS = { dayMaster: 0.25, dayBranch: 0.25, crossBranch: 0.20, tenGods: 0.15, elemental: 0.10, animal: 0.05 }

export interface ChineseMatchScores { overall: number; support: number; growth: number; communication: number; rhythm: number; intensity: number; stability: number }
export interface ChineseMatch {
  a: ChineseProfile; b: ChineseProfile
  connections: { type: string; note: string }[]
  dayMasterRelation: 'a-feeds-b' | 'b-feeds-a' | 'a-controls-b' | 'b-controls-a' | 'same' | 'neutral'
  relationshipKinNote: string
  scores: ChineseMatchScores
  tags: string[]
}

function clamp(n: number): number { return Math.max(0, Math.min(100, Math.round(n))) }
function branchPair(x: number, y: number, table: [number, number][]): boolean {
  return table.some(([a, b]) => (a === x && b === y) || (a === y && b === x))
}

export function getChineseMatchFromCharts(a: ChineseProfile, b: ChineseProfile): ChineseMatch {
  const dmA = STEMS[a.bazi.dayMaster], dmB = STEMS[b.bazi.dayMaster]
  const dbA = a.bazi.day.branch, dbB = b.bazi.day.branch
  const conns: { type: string; note: string }[] = []

  // Relação entre Day Masters (elemento + polaridade).
  let dmRel: ChineseMatch['dayMasterRelation'] = 'neutral'
  if (dmA.element === dmB.element) dmRel = 'same'
  else if (GENERATES[dmA.element] === dmB.element) dmRel = 'a-feeds-b'
  else if (GENERATES[dmB.element] === dmA.element) dmRel = 'b-feeds-a'
  else if (CONTROLS[dmA.element] === dmB.element) dmRel = 'a-controls-b'
  else if (CONTROLS[dmB.element] === dmA.element) dmRel = 'b-controls-a'
  const polComplement = dmA.polarity !== dmB.polarity

  let support = 30, growth = 30, communication = 30, rhythm = 30, intensity = 30, stability = 30
  if (dmRel === 'a-feeds-b' || dmRel === 'b-feeds-a') { support += 30; communication += 15; conns.push({ type: 'dm-generates', note: 'Um Day Master nutre o outro (ciclo de geração).' }) }
  if (dmRel === 'a-controls-b' || dmRel === 'b-controls-a') { intensity += 30; growth += 20; stability -= 10; conns.push({ type: 'dm-controls', note: 'Um Day Master controla o outro — dinâmica intensa e transformadora.' }) }
  if (dmRel === 'same') { rhythm += 25; support += 10; conns.push({ type: 'dm-same', note: 'Mesmo elemento de Day Master — forte identificação e ritmo comum.' }) }
  if (polComplement) { support += 15; rhythm += 10; conns.push({ type: 'polarity-complement', note: 'Polaridades Yin/Yang complementares.' }) }
  else { intensity += 10 }

  // Pilar do Dia (palácio do cônjuge) — relação entre os ramos do dia.
  if (dbA === dbB) { rhythm += 20; conns.push({ type: 'day-branch-same', note: 'Mesmo Ramo do Dia — grande afinidade íntima.' }) }
  if (branchPair(dbA, dbB, SIX_HARMONIES)) { support += 30; stability += 20; conns.push({ type: 'day-branch-harmony', note: 'Harmonia (六合) entre os Ramos do Dia.' }) }
  if (branchPair(dbA, dbB, SIX_CLASHES)) { intensity += 30; growth += 15; stability -= 15; conns.push({ type: 'day-branch-clash', note: 'Choque (六沖) entre os Ramos do Dia — atrai e transforma.' }) }
  if (branchPair(dbA, dbB, HARMS)) { growth += 10; stability -= 8; conns.push({ type: 'day-branch-harm', note: 'Dano (六害) entre os Ramos do Dia.' }) }

  // Cruzamento de todos os ramos.
  const branchesA = [a.bazi.year.branch, a.bazi.month.branch, dbA, ...(a.bazi.hour ? [a.bazi.hour.branch] : [])]
  const branchesB = [b.bazi.year.branch, b.bazi.month.branch, dbB, ...(b.bazi.hour ? [b.bazi.hour.branch] : [])]
  let harmonies = 0, clashes = 0
  for (const x of branchesA) for (const y of branchesB) {
    if (branchPair(x, y, SIX_HARMONIES)) harmonies++
    if (branchPair(x, y, SIX_CLASHES)) clashes++
  }
  support += Math.min(harmonies * 5, 20); intensity += Math.min(clashes * 5, 20)
  // Três harmonias formadas ao juntar os dois mapas.
  const allBranches = [...branchesA, ...branchesB]
  for (const th of THREE_HARMONIES) if (th.branches.every((br) => allBranches.includes(br))) { support += 12; conns.push({ type: 'three-harmony', note: `Tripla harmonia (${th.element}) formada entre os dois mapas.` }) }

  // Ten Gods mútuos (relação de cada DM ao outro).
  const tgAB: TenGodKey = tenGod(dmA, dmB)
  const tgBA: TenGodKey = tenGod(dmB, dmA)
  if (tgAB === 'zheng-guan' || tgBA === 'zheng-guan' || tgAB === 'zheng-cai' || tgBA === 'zheng-cai') { stability += 12; conns.push({ type: 'ten-god-structure', note: 'Relação de estrutura/recurso entre os Day Masters.' }) }
  if (tgAB === 'qi-sha' || tgBA === 'qi-sha') { intensity += 12; growth += 8 }
  communication += 10

  // Complementaridade elemental (o que um tem em excesso e o outro carece).
  let complement = 0
  const els: Element[] = ['wood', 'fire', 'earth', 'metal', 'water']
  for (const e of els) { const fa = a.bazi.fiveElements[e], fb = b.bazi.fiveElements[e]; if ((fa >= 3 && fb <= 1) || (fb >= 3 && fa <= 1)) complement++ }
  support += Math.min(complement * 4, 12)

  support = clamp(support); growth = clamp(growth); communication = clamp(communication); rhythm = clamp(rhythm); intensity = clamp(intensity); stability = clamp(stability)
  const W = CHINESE_MATCH_WEIGHTS
  const overall = clamp(support * W.dayMaster + rhythm * W.dayBranch + (support * 0.5 + intensity * 0.5) * W.crossBranch + communication * W.tenGods + support * W.elemental + rhythm * W.animal)
  const scores: ChineseMatchScores = { overall, support, growth, communication, rhythm, intensity, stability }

  const tags: string[] = []
  if (support >= 70) tags.push('high-sync')
  if (growth >= 70) tags.push('transformative')
  if (intensity >= 70) tags.push('intense')
  if (stability >= 70) tags.push('stable')
  if (dmRel === 'a-feeds-b' || dmRel === 'b-feeds-a') tags.push('nurturing')
  if (branchPair(dbA, dbB, SIX_HARMONIES)) tags.push('complementary')
  if (branchPair(dbA, dbB, SIX_CLASHES)) tags.push('challenging')
  if (!tags.length) tags.push('few-relations')

  const animalA = BRANCHES[a.zodiac.animalBranch].animalPt, animalB = BRANCHES[b.zodiac.animalBranch].animalPt
  return { a, b, connections: conns, dayMasterRelation: dmRel, relationshipKinNote: `${animalA} × ${animalB}`, scores, tags }
}

export function getChineseMatch(a: ChineseInput, b: ChineseInput): ChineseMatch {
  return getChineseMatchFromCharts(buildChineseChart(a), buildChineseChart(b))
}
export function chineseMatchScore(a: ChineseInput, b: ChineseInput): number {
  return getChineseMatch(a, b).scores.overall
}
