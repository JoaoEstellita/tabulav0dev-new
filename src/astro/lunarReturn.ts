// Momento do RETORNO LUNAR vigente — o instante em que a Lua volta ao grau eclíptico
// exato que tinha no nascimento. Ciclo ~27,32 dias (mês astrológico). Mesma ideia do
// Retorno Solar, mas a Lua é rápida (~13,2°/dia), então a varredura é em horas.
import { Body } from 'astronomy-engine'
import { getPlanetEclipticLongitude } from './planets'

const angDiff = (a: number, b: number) => ((a - b + 540) % 360) - 180

function refine(loMs: number, hiMs: number, target: number): Date {
  let a = loMs
  let b = hiMs
  for (let i = 0; i < 44; i++) {
    const m = (a + b) / 2
    const d = angDiff(getPlanetEclipticLongitude(new Date(m), Body.Moon), target)
    if (d < 0) a = m
    else b = m
  }
  return new Date((a + b) / 2)
}

/**
 * Momento (UTC) do Retorno Lunar vigente — o retorno mais recente antes de `now`.
 * Anda 6 horas por vez para trás até a Lua cruzar o grau natal; refina por bisseção.
 * @param natalMoonLon longitude eclíptica da Lua natal (0–360)
 */
export function findLunarReturnMoment(natalMoonLon: number, now: Date = new Date()): Date {
  let t = now.getTime()
  const STEP = 6 * 3600000 // 6 horas
  let diff = angDiff(getPlanetEclipticLongitude(new Date(t), Body.Moon), natalMoonLon)
  // ~30 dias / 6h = 120 passos; folga para cobrir o ciclo anômalo.
  for (let i = 0; i < 160; i++) {
    const tPrev = t - STEP
    const dPrev = angDiff(getPlanetEclipticLongitude(new Date(tPrev), Body.Moon), natalMoonLon)
    // cruzamento indo para trás: agora já passou o grau (diff>=0) e no passo anterior não (dPrev<0)
    if (diff >= 0 && dPrev < 0) return refine(tPrev, t, natalMoonLon)
    t = tPrev
    diff = dPrev
  }
  return new Date(t)
}
