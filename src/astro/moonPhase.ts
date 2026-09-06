// Fase lunar de NASCIMENTO (lunação natal) — a relação Sol↔Lua no instante do
// nascimento. É uma camada de PROPÓSITO/ritmo de vida: onde a pessoa está no ciclo
// entre semear (Nova) e soltar (Balsâmica). Independe do signo da Lua.
//
// Fase = distância angular (Lua − Sol) normalizada em 0–360°, dividida em 8 arcos
// de 45°. Só precisa das longitudes eclípticas de Sol e Lua (já no mapa natal).

export type MoonPhaseKey =
  | 'nova' | 'crescente' | 'quarto_crescente' | 'gibosa_crescente'
  | 'cheia' | 'gibosa_minguante' | 'quarto_minguante' | 'balsamica'

export interface NatalMoonPhase {
  key: MoonPhaseKey
  index: number      // 0..7
  emoji: string
  angle: number      // distância Lua−Sol em graus (0–360)
}

const PHASES: { key: MoonPhaseKey; emoji: string }[] = [
  { key: 'nova', emoji: '🌑' },
  { key: 'crescente', emoji: '🌒' },
  { key: 'quarto_crescente', emoji: '🌓' },
  { key: 'gibosa_crescente', emoji: '🌔' },
  { key: 'cheia', emoji: '🌕' },
  { key: 'gibosa_minguante', emoji: '🌖' },
  { key: 'quarto_minguante', emoji: '🌗' },
  { key: 'balsamica', emoji: '🌘' },
]

/** Deriva a fase lunar natal a partir das longitudes de Sol e Lua. null se faltar dado. */
export function natalMoonPhase(sunLongitude?: number | null, moonLongitude?: number | null): NatalMoonPhase | null {
  if (typeof sunLongitude !== 'number' || typeof moonLongitude !== 'number') return null
  if (!Number.isFinite(sunLongitude) || !Number.isFinite(moonLongitude)) return null
  const angle = ((moonLongitude - sunLongitude) % 360 + 360) % 360
  const index = Math.floor(angle / 45) % 8
  const p = PHASES[index]
  return { key: p.key, index, emoji: p.emoji, angle }
}
