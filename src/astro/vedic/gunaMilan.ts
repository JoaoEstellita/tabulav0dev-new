/**
 * Guna Milan (Ashtakoot) — compatibilidade védica clássica, 36 pontos em 8 kutas.
 * Determinístico, table-driven. Segue o padrão Parashari (fontes Jyotish variam
 * levemente em alguns cruzamentos — ver `approx` nos kutas Yoni/Vashya, que têm
 * matriz longa; a QA confere o TOTAL contra uma calculadora de referência).
 *
 * Entrada: dois resultados de nakshatra (que já trazem yoni/gana/nadi + rashi).
 * Convenção A = usuário/"noivo", B = outra pessoa (relevante só p/ Varna).
 */
import type { NakshatraResult } from './nakshatra'

export interface KutaScore {
  key: string
  points: number
  max: number
  approx?: boolean
  dosha?: boolean // dosha tradicional (Nadi/Bhakoot) — bandeira de atenção
}

export interface GunaMilanResult {
  kutas: KutaScore[]
  total: number
  max: 36
  band: 'baixo' | 'medio' | 'bom' | 'excelente'
  hasNadiDosha: boolean
  hasBhakootDosha: boolean
}

// ── Tabelas por Rashi (0=Áries … 11=Peixes) ─────────────────────────────────
const RASHI_LORD = ['mars', 'venus', 'mercury', 'moon', 'sun', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'saturn', 'jupiter']
// Varna por elemento: Água=Brahmin(4) Fogo=Kshatriya(3) Terra=Vaishya(2) Ar=Shudra(1)
const RASHI_VARNA = [3, 2, 1, 4, 3, 2, 1, 4, 3, 2, 1, 4]
// Vashya: grupo por rashi (simplificação signo-inteiro).
const RASHI_VASHYA = ['chatushpada', 'chatushpada', 'manav', 'jalachar', 'vanachar', 'manav', 'manav', 'keeta', 'manav', 'jalachar', 'manav', 'jalachar']

// Amizade planetária natural (Parashari). neutral = o que não está em friend/enemy.
const FRIEND: Record<string, string[]> = {
  sun: ['moon', 'mars', 'jupiter'], moon: ['sun', 'mercury'], mars: ['sun', 'moon', 'jupiter'],
  mercury: ['sun', 'venus'], jupiter: ['sun', 'moon', 'mars'], venus: ['mercury', 'saturn'], saturn: ['mercury', 'venus'],
}
const ENEMY: Record<string, string[]> = {
  sun: ['venus', 'saturn'], moon: [], mars: ['mercury'],
  mercury: ['moon'], jupiter: ['mercury', 'venus'], venus: ['sun', 'moon'], saturn: ['sun', 'moon', 'mars'],
}
function relation(p: string, q: string): 'friend' | 'neutral' | 'enemy' {
  if (FRIEND[p]?.includes(q)) return 'friend'
  if (ENEMY[p]?.includes(q)) return 'enemy'
  return 'neutral'
}

// Yoni Kuta — classificação da fonte Jyotish (findyourfate / Vedik Astrologer):
// mesmo=4, amigo=3, inimigo-mortal=0, resto neutro=2.
// Bitter = 6 pares canônicos (Macaco-Carneiro é NEUTRO na fonte, fora do bitter).
const YONI_BITTER: Array<[string, string]> = [
  ['cow', 'tiger'], ['elephant', 'lion'], ['horse', 'buffalo'],
  ['dog', 'deer'], ['serpent', 'mongoose'], ['cat', 'rat'],
]
// Pares amigos (3 pts) — simétrico. 'deer' cobre o yoni Mriga (lebre/cervo).
const YONI_FRIEND: Array<[string, string]> = [
  ['horse', 'serpent'], ['horse', 'deer'], ['horse', 'monkey'],
  ['elephant', 'sheep'], ['elephant', 'serpent'], ['elephant', 'buffalo'], ['elephant', 'monkey'],
  ['sheep', 'cow'], ['sheep', 'buffalo'], ['sheep', 'mongoose'],
  ['cat', 'deer'], ['cat', 'monkey'],
  ['cow', 'buffalo'], ['cow', 'deer'],
  ['monkey', 'mongoose'],
]
const inPairs = (pairs: Array<[string, string]>, a: string, b: string) =>
  pairs.some(([x, y]) => (a === x && b === y) || (a === y && b === x))
const isBitter = (a: string, b: string) => inPairs(YONI_BITTER, a, b)
const isFriend = (a: string, b: string) => inPairs(YONI_FRIEND, a, b)

// ── Kutas ────────────────────────────────────────────────────────────────
function varnaKuta(a: NakshatraResult, b: NakshatraResult): KutaScore {
  const va = RASHI_VARNA[a.rashi.index]
  const vb = RASHI_VARNA[b.rashi.index]
  return { key: 'varna', points: va >= vb ? 1 : 0, max: 1 }
}

// Vashya (fonte Jyotish): mesmo grupo=2; Chatushpada×Vanachar (predador-presa)=0;
// resto parcial=1. (Matriz completa varia por fonte; impacto ≤2 pts.)
function vashyaKuta(a: NakshatraResult, b: NakshatraResult): KutaScore {
  const ga = RASHI_VASHYA[a.rashi.index]
  const gb = RASHI_VASHYA[b.rashi.index]
  const clash = (ga === 'chatushpada' && gb === 'vanachar') || (ga === 'vanachar' && gb === 'chatushpada')
  const pts = ga === gb ? 2 : clash ? 0 : 1
  return { key: 'vashya', points: pts, max: 2 }
}

function taraKuta(a: NakshatraResult, b: NakshatraResult): KutaScore {
  const good = (from: number, to: number) => {
    const count = ((to - from + 27) % 27) + 1
    const tara = count % 9 === 0 ? 9 : count % 9
    return ![3, 5, 7].includes(tara)
  }
  const pts = (good(a.nakshatra.index, b.nakshatra.index) ? 1.5 : 0) + (good(b.nakshatra.index, a.nakshatra.index) ? 1.5 : 0)
  return { key: 'tara', points: pts, max: 3 }
}

function yoniKuta(a: NakshatraResult, b: NakshatraResult): KutaScore {
  const ya = a.nakshatra.yoni
  const yb = b.nakshatra.yoni
  const pts = ya === yb ? 4 : isBitter(ya, yb) ? 0 : isFriend(ya, yb) ? 3 : 2
  return { key: 'yoni', points: pts, max: 4 }
}

function grahaMaitriKuta(a: NakshatraResult, b: NakshatraResult): KutaScore {
  const la = RASHI_LORD[a.rashi.index]
  const lb = RASHI_LORD[b.rashi.index]
  const r1 = relation(la, lb)
  const r2 = relation(lb, la)
  const set = [r1, r2].sort().join('+')
  const table: Record<string, number> = {
    'friend+friend': 5, 'friend+neutral': 4, 'neutral+neutral': 3,
    'enemy+friend': 1, 'enemy+neutral': 0.5, 'enemy+enemy': 0,
  }
  return { key: 'graha_maitri', points: table[set] ?? 3, max: 5 }
}

function ganaKuta(a: NakshatraResult, b: NakshatraResult): KutaScore {
  const ga = a.nakshatra.gana
  const gb = b.nakshatra.gana
  let pts: number
  if (ga === gb) pts = 6
  else {
    const set = [ga, gb].sort().join('+')
    pts = set === 'deva+manushya' ? 5 : set === 'manushya+rakshasa' ? 1 : 0 // deva+rakshasa=0
  }
  return { key: 'gana', points: pts, max: 6 }
}

function bhakootKuta(a: NakshatraResult, b: NakshatraResult): KutaScore {
  const d = ((b.rashi.index - a.rashi.index + 12) % 12) + 1
  const dosha = [2, 12, 6, 8, 5, 9].includes(d) // 2/12, 6/8, 5/9
  return { key: 'bhakoot', points: dosha ? 0 : 7, max: 7, dosha }
}

function nadiKuta(a: NakshatraResult, b: NakshatraResult): KutaScore {
  const same = a.nakshatra.nadi === b.nakshatra.nadi
  return { key: 'nadi', points: same ? 0 : 8, max: 8, dosha: same }
}

/** Guna Milan completo (36 pontos). */
export function computeGunaMilan(a: NakshatraResult, b: NakshatraResult): GunaMilanResult {
  const kutas = [
    varnaKuta(a, b), vashyaKuta(a, b), taraKuta(a, b), yoniKuta(a, b),
    grahaMaitriKuta(a, b), ganaKuta(a, b), bhakootKuta(a, b), nadiKuta(a, b),
  ]
  const total = kutas.reduce((s, k) => s + k.points, 0)
  const band = total < 18 ? 'baixo' : total < 24 ? 'medio' : total < 32 ? 'bom' : 'excelente'
  return {
    kutas,
    total,
    max: 36,
    band,
    hasNadiDosha: kutas.find((k) => k.key === 'nadi')?.dosha === true,
    hasBhakootDosha: kutas.find((k) => k.key === 'bhakoot')?.dosha === true,
  }
}
