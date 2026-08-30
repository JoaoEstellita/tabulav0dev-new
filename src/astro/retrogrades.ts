import { PLANETS, getPlanetEclipticLongitude, type Planet } from './planets'

// Rastreador de retrógrados — client-side (astronomy-engine). Detecta as ESTAÇÕES
// (mudança de sentido) por varredura + bisecção na velocidade que cruza zero.

const DAY = 86400000
const SPEED_DT = 0.25 * DAY // intervalo p/ estimar a velocidade (sinal é o que importa)

const lonAt = (body: any, t: number) => getPlanetEclipticLongitude(new Date(t), body)
// Velocidade "assinada" no instante t: >0 direto, <0 retrógrado.
function speedSign(body: any, t: number): number {
  const a = lonAt(body, t)
  const b = lonAt(body, t + SPEED_DT)
  return ((b - a + 540) % 360) - 180 // deslocamento curto assinado
}
const isRetroAt = (body: any, t: number) => speedSign(body, t) < 0

// Bisecção da estação entre tLo e tHi (onde o sinal da velocidade muda).
function findStation(body: any, tLo: number, tHi: number): number {
  let lo = tLo; let hi = tHi
  const retroLo = isRetroAt(body, lo)
  for (let i = 0; i < 44 && hi - lo > 3600000; i++) {
    const mid = (lo + hi) / 2
    if (isRetroAt(body, mid) === retroLo) lo = mid
    else hi = mid
  }
  return hi
}

export type RetroInfo = { currentlyRetro: boolean; start: Date | null; end: Date | null }

/** Próximo período retrógrado do planeta (ou o atual, se já estiver retrógrado). */
export function nextRetrograde(planet: Planet, from: Date = new Date(), horizonDays = 1100): RetroInfo | null {
  const body = PLANETS[planet]
  if (!body) return null
  const step = 4 * DAY
  const t0 = from.getTime()
  const currentlyRetro = isRetroAt(body, t0)
  const stations: { time: number; toRetro: boolean }[] = []
  let prev = currentlyRetro; let tPrev = t0
  for (let t = t0 + step; t <= t0 + horizonDays * DAY; t += step) {
    const r = isRetroAt(body, t)
    if (r !== prev) {
      stations.push({ time: findStation(body, tPrev, t), toRetro: r })
      prev = r
      if (stations.length >= 4) break
    }
    tPrev = t
  }
  if (currentlyRetro) {
    const dir = stations.find((s) => !s.toRetro)
    return { currentlyRetro: true, start: null, end: dir ? new Date(dir.time) : null }
  }
  const start = stations.find((s) => s.toRetro)
  if (!start) return null
  const end = stations.find((s) => !s.toRetro && s.time > start.time)
  return { currentlyRetro: false, start: new Date(start.time), end: end ? new Date(end.time) : null }
}

/** Status de um conjunto de planetas: quais estão retrógrados agora + próximo período. */
export function retrogradeStatus(planets: Planet[], from: Date = new Date()): Array<{ planet: Planet } & RetroInfo> {
  return planets.map((p) => ({ planet: p, ...(nextRetrograde(p, from) || { currentlyRetro: false, start: null, end: null }) }))
}

/** Só quem está retrógrado AGORA (cheap: 1 amostra por planeta). */
export function currentlyRetrograde(planets: Planet[], from: Date = new Date()): Planet[] {
  return planets.filter((p) => { const b = PLANETS[p]; return b && isRetroAt(b, from.getTime()) })
}
