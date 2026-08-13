// Leitura enriquecida de sinastria (determinística, sem catálogo gigante):
//  - synastryScore: índice de compatibilidade da dupla a partir dos aspectos.
//  - synastryAspectLine: frase legível por aspecto, composta de dois mapas
//    (domínio do planeta × frase do aspecto) nos 4 idiomas.
// Consome os SynastryAspect de ./synastry (aspect.mine/theirs = chave en minúscula).

import type { SynastryAspect, NatalChart } from './synastry'
import type { RealPlanetPosition } from '../services/astrology/RealAstrologyEngine'
import { getHousePositionalFocus } from '../utils/astroInterpretation'

type Lang = 'pt-BR' | 'en-US' | 'es-ES' | 'it-IT'

const PERSONAL = new Set(['sun', 'moon', 'mercury', 'venus', 'mars'])

export type SynastryBand = 'harmonica' | 'mista' | 'tensa' | 'neutra'

export interface SynastryScore {
  pct: number
  bandKey: SynastryBand
  harmonics: number
  tensions: number
}

/**
 * Índice de compatibilidade 0–100 + faixa. Harmônicos somam, tensos descontam,
 * conjunção quase-neutra; contato mais exato e entre planetas pessoais pesa mais.
 */
export function synastryScore(aspects: SynastryAspect[] | null | undefined): SynastryScore {
  const list = Array.isArray(aspects) ? aspects : []
  if (list.length === 0) return { pct: 50, bandKey: 'neutra', harmonics: 0, tensions: 0 }
  const TONE_BASE: Record<string, number> = { harmonioso: 2, tenso: -2, neutro: 0.6 }
  let sum = 0
  let harmonics = 0
  let tensions = 0
  for (const a of list) {
    if (a.tone === 'harmonioso') harmonics++
    else if (a.tone === 'tenso') tensions++
    const closeness = Math.max(0, (6 - Math.min(6, a.orb)) / 6) // 0..1 (0° = 1)
    const personals = (PERSONAL.has(a.mine) ? 1 : 0) + (PERSONAL.has(a.theirs) ? 1 : 0)
    const personalMult = personals >= 2 ? 1.4 : personals === 1 ? 1.15 : 1
    sum += (TONE_BASE[a.tone] ?? 0) * closeness * personalMult
  }
  const pct = Math.max(5, Math.min(95, Math.round(50 + sum * 5)))
  const bandKey: SynastryBand = pct >= 62 ? 'harmonica' : pct >= 45 ? 'mista' : 'tensa'
  return { pct, bandKey, harmonics, tensions }
}

// Domínio relacional de cada planeta (1 palavra), nos 4 idiomas.
const PLANET_REL: Record<string, Record<Lang, string>> = {
  sun: { 'pt-BR': 'identidade', 'en-US': 'identity', 'es-ES': 'identidad', 'it-IT': 'identita' },
  moon: { 'pt-BR': 'emoções', 'en-US': 'emotions', 'es-ES': 'emociones', 'it-IT': 'emozioni' },
  mercury: { 'pt-BR': 'comunicação', 'en-US': 'communication', 'es-ES': 'comunicacion', 'it-IT': 'comunicazione' },
  venus: { 'pt-BR': 'afeto', 'en-US': 'affection', 'es-ES': 'afecto', 'it-IT': 'affetto' },
  mars: { 'pt-BR': 'desejo', 'en-US': 'desire', 'es-ES': 'deseo', 'it-IT': 'desiderio' },
  jupiter: { 'pt-BR': 'crescimento', 'en-US': 'growth', 'es-ES': 'crecimiento', 'it-IT': 'crescita' },
  saturn: { 'pt-BR': 'compromisso', 'en-US': 'commitment', 'es-ES': 'compromiso', 'it-IT': 'impegno' },
  uranus: { 'pt-BR': 'liberdade', 'en-US': 'freedom', 'es-ES': 'libertad', 'it-IT': 'liberta' },
  neptune: { 'pt-BR': 'sonho', 'en-US': 'dreams', 'es-ES': 'sueno', 'it-IT': 'sogno' },
  pluto: { 'pt-BR': 'intensidade', 'en-US': 'intensity', 'es-ES': 'intensidad', 'it-IT': 'intensita' },
}

// Desfecho relacional por aspecto (chave = aspect.aspect), nos 4 idiomas.
const ASPECT_REL: Record<string, Record<Lang, string>> = {
  conjuncao: {
    'pt-BR': 'se fundem e se intensificam', 'en-US': 'merge and intensify',
    'es-ES': 'se funden y se intensifican', 'it-IT': 'si fondono e si intensificano',
  },
  sextil: {
    'pt-BR': 'fluem juntos com facilidade', 'en-US': 'flow together with ease',
    'es-ES': 'fluyen juntos con facilidad', 'it-IT': 'scorrono insieme con facilita',
  },
  trigono: {
    'pt-BR': 'se apoiam naturalmente', 'en-US': 'support each other naturally',
    'es-ES': 'se apoyan con naturalidad', 'it-IT': 'si sostengono con naturalezza',
  },
  quadratura: {
    'pt-BR': 'se atritam — crescimento pela fricção', 'en-US': 'clash — growth through friction',
    'es-ES': 'chocan — crecimiento por la friccion', 'it-IT': 'si scontrano — crescita per attrito',
  },
  oposicao: {
    'pt-BR': 'se puxam por polaridade — atração e ajuste', 'en-US': 'pull by polarity — attraction and adjustment',
    'es-ES': 'se atraen por polaridad — atraccion y ajuste', 'it-IT': 'si attraggono per polarita — attrazione e regolazione',
  },
}

const CONNECTOR: Record<Lang, string> = { 'pt-BR': 'e', 'en-US': 'and', 'es-ES': 'y', 'it-IT': 'e' }

const cap = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s)

/** Frase legível de um aspecto de sinastria. Vazio se planetas/aspecto desconhecidos. */
export function synastryAspectLine(aspect: SynastryAspect, language: string): string {
  const lang: Lang = (['pt-BR', 'en-US', 'es-ES', 'it-IT'].includes(language) ? language : 'pt-BR') as Lang
  const domA = PLANET_REL[aspect.mine]?.[lang]
  const domB = PLANET_REL[aspect.theirs]?.[lang]
  const outcome = ASPECT_REL[aspect.aspect]?.[lang]
  if (!domA || !domB || !outcome) return ''
  return `${cap(domA)} ${CONNECTOR[lang]} ${domB} ${outcome}.`
}

// ─── Sobreposição de casas (a "outra metade" da sinastria ocidental) ─────────
// Onde os planetas de uma pessoa caem NAS CASAS da outra: mostra qual área da
// vida cada um mais ativa no outro. Só planetas pessoais (Sol..Marte) para ficar
// legível; direcional (A→B e B→A).

const OVERLAY_PLANETS = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars']

export interface HouseOverlay {
  fromName: string
  toName: string
  planet: string // chave en minúscula (para translatePlanet)
  house: number
  focus: string
}

/** Casa (1–12) de uma longitude nas cúspides dadas, ou null. */
function houseFromCusps(longitude: number, cusps: number[] | null | undefined): number | null {
  if (!Array.isArray(cusps) || cusps.length < 12) return null
  for (let i = 0; i < 12; i++) {
    const start = cusps[i]
    const end = cusps[(i + 1) % 12]
    const span = ((end - start) % 360 + 360) % 360
    const offset = ((longitude - start) % 360 + 360) % 360
    if (offset < span || span === 0) return i + 1
  }
  return null
}

function overlaysOneWay(from: NatalChart, to: NatalChart, fromName: string, toName: string, lang: Lang): HouseOverlay[] {
  if (!to.cusps) return []
  const out: HouseOverlay[] = []
  const byName = new Map<string, RealPlanetPosition>((from.planets || []).map((p) => [p.name, p]))
  for (const name of OVERLAY_PLANETS) {
    const p = byName.get(name)
    if (!p || !Number.isFinite(p.longitude)) continue
    const house = houseFromCusps(p.longitude, to.cusps)
    if (!house) continue
    out.push({ fromName, toName, planet: name.toLowerCase(), house, focus: getHousePositionalFocus(lang, house) })
  }
  return out
}

/**
 * Sobreposição de casas nos DOIS sentidos (A→B e B→A). Vazio se faltarem cúspides.
 */
export function synastryHouseOverlays(
  chartA: NatalChart | null | undefined,
  chartB: NatalChart | null | undefined,
  aName: string,
  bName: string,
  language: string,
): HouseOverlay[] {
  if (!chartA || !chartB) return []
  const lang: Lang = (['pt-BR', 'en-US', 'es-ES', 'it-IT'].includes(language) ? language : 'pt-BR') as Lang
  return [
    ...overlaysOneWay(chartA, chartB, aName, bName, lang),
    ...overlaysOneWay(chartB, chartA, bName, aName, lang),
  ]
}
