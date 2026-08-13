import { RealAstrologyEngine, RealPlanetPosition } from '../services/astrology/RealAstrologyEngine'

// Sinastria entre dois mapas natais (aspectos cruzados planeta A × planeta B).
// Espelha a lógica do backend (context-builder.js computeSynastryAspects) para manter
// consistência com o agente WhatsApp: só aspectos maiores, orbe ≤ 6°, e descarta
// contatos externo↔externo (geracionais — não dizem nada sobre ESTA dupla).

export type SynastryTone = 'harmonioso' | 'tenso' | 'neutro'

export interface SynastryAspect {
  mine: string // planeta do usuário — chave em inglês minúsculo (sun, moon, ...)
  theirs: string // planeta do outro membro
  aspect: string // conjuncao | sextil | quadratura | trigono | oposicao
  symbol: string
  tone: SynastryTone
  orb: number
}

const MAJOR_ASPECTS: Array<{ name: string; angle: number; symbol: string; tone: SynastryTone }> = [
  { name: 'conjuncao', angle: 0, symbol: '☌', tone: 'neutro' },
  { name: 'sextil', angle: 60, symbol: '⚹', tone: 'harmonioso' },
  { name: 'quadratura', angle: 90, symbol: '□', tone: 'tenso' },
  { name: 'trigono', angle: 120, symbol: '△', tone: 'harmonioso' },
  { name: 'oposicao', angle: 180, symbol: '☍', tone: 'tenso' },
]

const ASPECT_ORB = 6

const PLANET_ORDER: Record<string, number> = {
  sun: 1, moon: 2, mercury: 3, venus: 4, mars: 5,
  jupiter: 6, saturn: 7, uranus: 8, neptune: 9, pluto: 10,
}

const PERSONAL_PLANETS = new Set(['sun', 'moon', 'mercury', 'venus', 'mars'])

function toList(pos: RealPlanetPosition[] | null | undefined) {
  return (pos || [])
    .map((p) => ({ key: String(p?.name || '').toLowerCase(), lon: Number(p?.longitude) }))
    .filter((p) => PLANET_ORDER[p.key] && Number.isFinite(p.lon))
}

export function computeSynastryAspects(
  mine: RealPlanetPosition[] | null | undefined,
  theirs: RealPlanetPosition[] | null | undefined,
  limit = 5
): SynastryAspect[] {
  const A = toList(mine)
  const B = toList(theirs)
  const found: Array<SynastryAspect & { personals: number }> = []
  for (const a of A) {
    for (const b of B) {
      let diff = Math.abs(a.lon - b.lon) % 360
      if (diff > 180) diff = 360 - diff
      for (const asp of MAJOR_ASPECTS) {
        const orb = Math.abs(diff - asp.angle)
        if (orb <= ASPECT_ORB) {
          const personals = (PERSONAL_PLANETS.has(a.key) ? 1 : 0) + (PERSONAL_PLANETS.has(b.key) ? 1 : 0)
          // Externo↔externo (Plutão/Netuno/Urano dos dois lados) = geracional, irrelevante para a dupla.
          if (personals === 0) break
          found.push({ mine: a.key, theirs: b.key, aspect: asp.name, symbol: asp.symbol, tone: asp.tone, orb, personals })
          break
        }
      }
    }
  }
  // Contato pessoal↔pessoal manda; orbe só desempata.
  return found
    .sort((x, y) => (y.personals - x.personals) || (x.orb - y.orb))
    .slice(0, limit)
    .map(({ personals, ...rest }) => rest)
}

export interface NatalChart {
  planets: RealPlanetPosition[]
  cusps: number[] | null // 12 cúspides das casas (para sobreposição de casas)
  ascendant: number | null
}

// Carta natal (posições + cúspides) de um membro a partir do birthData compartilhado.
// Reusa calculateRealAstrology (que resolve o fuso histórico pela coordenada); o
// datetime é hora-de-parede local (sem TZ embutido).
export async function computeNatalChart(
  birthData?: { datetime?: string; coordinates?: { latitude: number; longitude: number } } | null
): Promise<NatalChart | null> {
  const datetime = birthData?.datetime
  const coords = birthData?.coordinates
  if (!datetime || !coords || !Number.isFinite(coords.latitude) || !Number.isFinite(coords.longitude)) {
    return null
  }
  const [datePart, timePartRaw] = String(datetime).split('T')
  if (!datePart) return null
  const timePart = (timePartRaw || '12:00').slice(0, 5)
  try {
    const data = await RealAstrologyEngine.calculateRealAstrology(
      datePart,
      timePart,
      coords.latitude,
      coords.longitude,
      undefined,
      { natalLat: coords.latitude, natalLon: coords.longitude }
    )
    if (!data?.natalPlanets) return null
    const cusps = Array.isArray(data.natalHouses) && data.natalHouses.length >= 12 ? data.natalHouses : null
    const ascendant = Number.isFinite(data.natalAscendant) ? data.natalAscendant : null
    return { planets: data.natalPlanets, cusps, ascendant }
  } catch {
    return null
  }
}

// Só as longitudes natais (retrocompat — usado pela sinastria e por progressions.ts).
export async function computeNatalLongitudes(
  birthData?: { datetime?: string; coordinates?: { latitude: number; longitude: number } } | null
): Promise<RealPlanetPosition[] | null> {
  const chart = await computeNatalChart(birthData)
  return chart?.planets || null
}
