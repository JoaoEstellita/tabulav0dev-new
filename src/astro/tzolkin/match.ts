// Tzolkin Match — camada de relação entre 2 Kins. Motor puro, determinístico.
// TzolkinMatchScore é um MODELO DO APP construído sobre relações Dreamspell —
// não é "porcentagem maia" nem probabilidade. Antípoda = desafio/fortalecimento.
import { buildProfile, profileFromKin, kinBySealTone, getEarthFamily } from './engine'
import type { TzolkinProfile } from './types'

export type RelationKey = 'same-kin' | 'same-seal' | 'same-tone' | 'guide' | 'analog' | 'antipode' | 'occult'

export interface TzolkinMatchConnection {
  type: string
  canonical: boolean // true = relação Dreamspell canônica; false = regra do produto
  importance: number // 1..3
  aElement: string
  bElement: string
}

export interface TzolkinMatchScores {
  overall: number; support: number; growth: number; communication: number; rhythm: number; intensity: number
}

export interface TzolkinMatch {
  a: TzolkinProfile; b: TzolkinProfile
  directRelations: { aToB: RelationKey[]; bToA: RelationKey[] }
  crossConnections: TzolkinMatchConnection[]
  relationshipKin: number
  scores: TzolkinMatchScores
  tags: string[] // chaves de tag (i18n na UI)
}

// Pesos do combinado — NÃO hardcodar em componentes; centralizado aqui.
export const TZOLKIN_MATCH_WEIGHTS = { support: 0.25, communication: 0.30, growth: 0.20, rhythm: 0.15, intensity: 0.10 }

const ROLE_PT = ['destino', 'guia', 'analogo', 'antipoda', 'oculto']

function oracleSeals(p: TzolkinProfile): number[] {
  return [p.oracle.destiny.seal, p.oracle.guide.seal, p.oracle.analog.seal, p.oracle.antipode.seal, p.oracle.occult.seal]
}

function directRelations(a: TzolkinProfile, b: TzolkinProfile): RelationKey[] {
  const r: RelationKey[] = []
  if (a.kin === b.kin) r.push('same-kin')
  if (a.seal === b.seal) r.push('same-seal')
  if (a.tone === b.tone) r.push('same-tone')
  if (b.kin === a.oracle.guide.kin) r.push('guide')
  if (b.kin === a.oracle.analog.kin) r.push('analog')
  if (b.kin === a.oracle.antipode.kin) r.push('antipode')
  if (b.kin === a.oracle.occult.kin) r.push('occult')
  return r
}

function relationshipKin(a: TzolkinProfile, b: TzolkinProfile): number {
  let ss = a.seal + b.seal; if (ss > 20) ss -= 20
  let tt = a.tone + b.tone; if (tt > 13) tt -= 13
  return kinBySealTone(ss, tt)
}

function crossConnections(a: TzolkinProfile, b: TzolkinProfile): TzolkinMatchConnection[] {
  const conns: TzolkinMatchConnection[] = []
  const aS = oracleSeals(a), bS = oracleSeals(b)
  const seen = new Set<number>()
  for (let i = 0; i < 5; i++) for (let j = 0; j < 5; j++) {
    if (aS[i] === bS[j] && !seen.has(aS[i])) {
      seen.add(aS[i])
      conns.push({ type: 'shared-oracle-seal', canonical: true, importance: 2, aElement: ROLE_PT[i], bElement: ROLE_PT[j] })
    }
  }
  const sd = Math.abs(a.seal - b.seal)
  if (sd === 1 || sd === 19) conns.push({ type: 'consecutive-seals', canonical: false, importance: 1, aElement: String(a.seal), bElement: String(b.seal) })
  if (a.wavespell.index === b.wavespell.index) conns.push({ type: 'shared-wavespell', canonical: true, importance: 2, aElement: String(a.wavespell.index), bElement: String(b.wavespell.index) })
  if (getEarthFamily(a.wavespell.rulingSeal) === b.earthFamily) conns.push({ type: 'ruling-a-in-family-b', canonical: true, importance: 2, aElement: String(a.wavespell.rulingSeal), bElement: b.earthFamily })
  if (getEarthFamily(b.wavespell.rulingSeal) === a.earthFamily) conns.push({ type: 'ruling-b-in-family-a', canonical: true, importance: 2, aElement: String(b.wavespell.rulingSeal), bElement: a.earthFamily })
  if (a.castle.key === b.castle.key) conns.push({ type: 'shared-castle', canonical: true, importance: 1, aElement: a.castle.key, bElement: b.castle.key })
  if (a.earthFamily === b.earthFamily) conns.push({ type: 'shared-family', canonical: true, importance: 2, aElement: a.earthFamily, bElement: b.earthFamily })
  return conns
}

function clamp(n: number): number { return Math.max(0, Math.min(100, Math.round(n))) }

function scoreOf(a: TzolkinProfile, b: TzolkinProfile, aToB: RelationKey[], bToA: RelationKey[], conns: TzolkinMatchConnection[]): TzolkinMatchScores {
  let support = 30, growth = 30, communication = 30, rhythm = 30, intensity = 30
  const any = (k: RelationKey) => aToB.includes(k) || bToA.includes(k)
  if (any('analog')) support += 35
  if (any('antipode')) { growth += 35; intensity += 30 }
  if (any('occult')) growth += 30
  if (any('guide')) { communication += 30; support += 10 }
  if (any('same-seal')) { intensity += 35; support += 10 }
  if (any('same-tone')) rhythm += 40
  if (any('same-kin')) { intensity += 25; support += 20; communication += 15 }
  const td = Math.min(Math.abs(a.tone - b.tone), 13 - Math.abs(a.tone - b.tone))
  if (td > 0 && td <= 2) rhythm += 15
  for (const c of conns) {
    if (c.type === 'shared-oracle-seal') communication += 15
    else if (c.type === 'consecutive-seals') growth += 10
    else if (c.type === 'shared-wavespell') support += 15
    else if (c.type.startsWith('ruling-')) support += 12
    else if (c.type === 'shared-castle') support += 12
    else if (c.type === 'shared-family') support += 18
  }
  support = clamp(support); growth = clamp(growth); communication = clamp(communication); rhythm = clamp(rhythm); intensity = clamp(intensity)
  const W = TZOLKIN_MATCH_WEIGHTS
  const overall = clamp(support * W.support + communication * W.communication + growth * W.growth + rhythm * W.rhythm + intensity * W.intensity)
  return { overall, support, growth, communication, rhythm, intensity }
}

function tagsOf(s: TzolkinMatchScores, aToB: RelationKey[], bToA: RelationKey[]): string[] {
  const t: string[] = []
  const any = (k: RelationKey) => aToB.includes(k) || bToA.includes(k)
  if (s.support >= 70) t.push('high-sync')
  if (s.growth >= 70) t.push('transformative')
  if (s.intensity >= 70) t.push('intense')
  if (s.communication >= 70) t.push('communicative')
  if (s.rhythm >= 70) t.push('rhythm')
  if (any('analog')) t.push('complementary')
  if (any('antipode')) t.push('challenging')
  if (t.length === 0) t.push('few-relations')
  return t
}

function matchProfiles(a: TzolkinProfile, b: TzolkinProfile): TzolkinMatch {
  const aToB = directRelations(a, b), bToA = directRelations(b, a)
  const conns = crossConnections(a, b)
  const scores = scoreOf(a, b, aToB, bToA, conns)
  return { a, b, directRelations: { aToB, bToA }, crossConnections: conns, relationshipKin: relationshipKin(a, b), scores, tags: tagsOf(scores, aToB, bToA) }
}

export function getTzolkinMatch(isoA: string, isoB: string): TzolkinMatch {
  return matchProfiles(buildProfile(isoA), buildProfile(isoB))
}

/** Match a partir dos Kins (quando não temos as datas — ex.: deck do Match). */
export function getTzolkinMatchByKins(kinA: number, kinB: number): TzolkinMatch {
  return matchProfiles(profileFromKin(kinA), profileFromKin(kinB))
}

// Score 0..100 só (para o combinedScore do ranking, frontend ou backend).
export function tzolkinMatchScore(isoA: string, isoB: string): number {
  return getTzolkinMatch(isoA, isoB).scores.overall
}
export function tzolkinMatchScoreByKins(kinA: number, kinB: number): number {
  return getTzolkinMatchByKins(kinA, kinB).scores.overall
}
