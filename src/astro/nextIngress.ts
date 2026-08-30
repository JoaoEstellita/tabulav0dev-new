import { PLANETS, getPlanetEclipticLongitude, type Planet } from './planets'

// Data EXATA do próximo ingresso (mudança de signo) de um planeta, a partir de `from`.
// Varredura grosseira por passo adaptado à velocidade média + bisecção no cruzamento.
// Usa astronomy-engine (getPlanetEclipticLongitude) — cálculo real, não estimativa.

const MEAN_SPEED: Record<Planet, number> = {
  Sun: 0.986, Moon: 13.2, Mercury: 1.2, Venus: 1.2, Mars: 0.52,
  Jupiter: 0.083, Saturn: 0.034, Uranus: 0.0117, Neptune: 0.006, Pluto: 0.004,
}
const DAY = 86400000
const signIdx = (lon: number) => Math.floor((((lon % 360) + 360) % 360) / 30) % 12

/** Próximo ingresso de `planet`. Retorna { date, signIdx } ou null se não achar no horizonte. */
export function nextSignIngress(planet: Planet, from: Date = new Date()): { date: Date; signIdx: number } | null {
  const body = PLANETS[planet]
  if (!body) return null
  const lonAt = (t: number) => getPlanetEclipticLongitude(new Date(t), body)
  const speed = MEAN_SPEED[planet] || 0.5
  const stepDays = Math.max(0.25, Math.min(3650, 12 / speed))
  const t0 = from.getTime()
  const horizon = t0 + 30 * 365 * DAY // teto de 30 anos (cobre Plutão)
  let tPrev = t0
  let sPrev = signIdx(lonAt(t0))
  for (let t = t0 + stepDays * DAY; t <= horizon; t += stepDays * DAY) {
    const s = signIdx(lonAt(t))
    if (s !== sPrev) {
      // Cruzou entre tPrev e t → bisecção até o minuto.
      let lo = tPrev
      let hi = t
      for (let i = 0; i < 44 && hi - lo > 60000; i++) {
        const mid = (lo + hi) / 2
        if (signIdx(lonAt(mid)) === sPrev) lo = mid
        else hi = mid
      }
      return { date: new Date(hi), signIdx: signIdx(lonAt(hi)) }
    }
    tPrev = t
    sPrev = s
  }
  return null
}
