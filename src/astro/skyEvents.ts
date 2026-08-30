import { SearchMoonPhase } from 'astronomy-engine'
import { PLANETS, type Planet } from './planets'
import { nextSignIngress } from './nextIngress'

// Próximos eventos do céu — TODOS client-side (astronomy-engine), custo zero de backend.

/** Próxima vez que a Lua atinge a fase `targetLon` (0=Nova, 90=Crescente, 180=Cheia, 270=Minguante). */
export function nextMoonPhase(targetLon: number, from: Date = new Date()): Date | null {
  try {
    const t = SearchMoonPhase(targetLon, from, 40)
    return t ? t.date : null
  } catch {
    return null
  }
}
export const nextNewMoon = (from: Date = new Date()) => nextMoonPhase(0, from)
export const nextFullMoon = (from: Date = new Date()) => nextMoonPhase(180, from)

/** Ingresso coletivo mais próximo entre os planetas (ignora a Lua, que muda de signo a cada ~2 dias). */
export function soonestIngress(from: Date = new Date()): { planet: Planet; signIdx: number; date: Date } | null {
  let best: { planet: Planet; signIdx: number; date: Date } | null = null
  for (const name of Object.keys(PLANETS) as Planet[]) {
    if (name === 'Moon') continue
    const ing = nextSignIngress(name, from)
    if (ing && (!best || ing.date < best.date)) best = { planet: name, signIdx: ing.signIdx, date: ing.date }
  }
  return best
}
