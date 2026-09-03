/**
 * GOCHARA (trânsito védico) — lê os planetas de HOJE a partir da LUA natal
 * (Chandra Lagna), a convenção clássica de Jyotish. Puro/determinístico.
 *
 * Casa a partir da Lua = ((rashiDoTrânsito − rashiDaLuaNatal + 12) % 12) + 1.
 * Casas favoráveis por planeta = tabela clássica (Gochara Phala). Saturno em
 * 12/1/2 da Lua = Sade Sati; em 4 ou 8 = Kantaka/Ashtama Shani.
 */
import type { RealPlanetPosition } from '../../services/astrology/RealAstrologyEngine'
import { tropicalToSidereal } from './ayanamsa'
import { RASHIS } from './nakshatra'

// Só os 9 grahas contam no Gochara clássico. Mapeia nomes do motor → chave.
const GRAHA_KEY: Record<string, string> = {
  sun: 'Sun', moon: 'Moon', mercury: 'Mercury', venus: 'Venus', mars: 'Mars',
  jupiter: 'Jupiter', saturn: 'Saturn',
  rahu: 'Rahu', ketu: 'Ketu', 'north node': 'Rahu', 'south node': 'Ketu',
  'true node': 'Rahu', 'mean node': 'Rahu',
}

// Casas favoráveis a partir da Lua (Gochara Phala clássico).
const FAVORABLE: Record<string, number[]> = {
  Sun: [3, 6, 10, 11],
  Moon: [1, 3, 6, 7, 10, 11],
  Mars: [3, 6, 11],
  Mercury: [2, 4, 6, 8, 10, 11],
  Jupiter: [2, 5, 7, 9, 11],
  Venus: [1, 2, 3, 4, 5, 8, 9, 11, 12],
  Saturn: [3, 6, 11],
  Rahu: [3, 6, 11],
  Ketu: [3, 6, 11],
}

export interface GocharaItem {
  planet: string          // 'Sun'..'Ketu'
  siderealLon: number
  rashiIndex: number
  rashiName: string
  houseFromMoon: number   // 1–12
  retro: boolean
  favorable: boolean
  sadeSati: boolean       // Saturno em 12/1/2 da Lua
  shaniKantaka: boolean   // Saturno em 4 ou 8 (Kantaka/Ashtama Shani)
}

export interface Gochara {
  moonRashiIndex: number
  moonRashiName: string
  transitDate: Date
  items: GocharaItem[]
}

/** Ordem de exibição: os lentos primeiro (mais relevantes no Gochara). */
const ORDER = ['Saturn', 'Jupiter', 'Rahu', 'Ketu', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon']

/**
 * Monta o Gochara. Precisa da Lua natal (posição TROPICAL) + planetas de trânsito
 * (posições TROPICAIS de hoje). null se faltar a Lua natal.
 */
export function buildGochara(
  natalPlanets: RealPlanetPosition[] | null | undefined,
  transitPlanets: RealPlanetPosition[] | null | undefined,
  birthDate: Date,
  transitDate: Date = new Date()
): Gochara | null {
  const moon = (natalPlanets || []).find((p) => String(p?.name || '').toLowerCase() === 'moon')
  if (!moon || !Number.isFinite(Number(moon.longitude)) || !(birthDate instanceof Date) || Number.isNaN(birthDate.getTime())) return null
  const moonSid = tropicalToSidereal(Number(moon.longitude), birthDate)
  const moonRashi = Math.floor(moonSid / 30) % 12

  const items: GocharaItem[] = []
  for (const p of (transitPlanets || [])) {
    const key = GRAHA_KEY[String(p?.name || '').toLowerCase()]
    if (!key || !Number.isFinite(Number(p.longitude))) continue
    if (items.some((it) => it.planet === key)) continue // dedup (nós podem vir 2×)
    const sid = tropicalToSidereal(Number(p.longitude), transitDate)
    const rIndex = Math.floor(sid / 30) % 12
    const house = ((rIndex - moonRashi + 12) % 12) + 1
    const favorable = (FAVORABLE[key] || []).includes(house)
    items.push({
      planet: key,
      siderealLon: sid,
      rashiIndex: rIndex,
      rashiName: RASHIS[rIndex].name,
      houseFromMoon: house,
      retro: (p as any).isRetrograde === true,
      favorable,
      sadeSati: key === 'Saturn' && (house === 12 || house === 1 || house === 2),
      shaniKantaka: key === 'Saturn' && (house === 4 || house === 8),
    })
  }
  items.sort((a, b) => ORDER.indexOf(a.planet) - ORDER.indexOf(b.planet))

  return {
    moonRashiIndex: moonRashi,
    moonRashiName: RASHIS[moonRashi].name,
    transitDate,
    items,
  }
}
