// Cálculo do momento do RETORNO SOLAR — o instante em que o Sol volta ao grau
// eclíptico exato que tinha no nascimento. Puro e testável (astronomy-engine).
import { Body } from 'astronomy-engine'
import { getPlanetEclipticLongitude } from './planets'

// Diferença angular assinada em [-180, 180]. >0 = Sol já passou o grau natal.
const angDiff = (a: number, b: number) => ((a - b + 540) % 360) - 180

function refine(loMs: number, hiMs: number, target: number): Date {
  let a = loMs
  let b = hiMs
  for (let i = 0; i < 44; i++) {
    const m = (a + b) / 2
    const d = angDiff(getPlanetEclipticLongitude(new Date(m), Body.Sun), target)
    if (d < 0) a = m
    else b = m
  }
  return new Date((a + b) / 2)
}

/**
 * Momento (UTC) do Retorno Solar VIGENTE — o retorno mais recente antes de `now`
 * (o "ano astrológico" atual da pessoa). Parte de `now` e anda um dia por vez para
 * trás até o Sol cruzar o grau natal; refina por bisseção até o minuto.
 * @param natalSunLon longitude eclíptica do Sol natal (0–360)
 */
export function findSolarReturnMoment(natalSunLon: number, now: Date = new Date()): Date {
  let t = now.getTime()
  const DAY = 86400000
  let diff = angDiff(getPlanetEclipticLongitude(new Date(t), Body.Sun), natalSunLon)
  // ~400 passos cobrem >1 ano com folga (cobre anos bissextos e a órbita elíptica).
  for (let i = 0; i < 400; i++) {
    const tPrev = t - DAY
    const dPrev = angDiff(getPlanetEclipticLongitude(new Date(tPrev), Body.Sun), natalSunLon)
    // cruzamento (indo para trás): hoje já passou o grau (diff>=0) e ontem ainda não (dPrev<0)
    if (diff >= 0 && dPrev < 0) return refine(tPrev, t, natalSunLon)
    t = tPrev
    diff = dPrev
  }
  return new Date(t)
}

/** Idade que a pessoa completa NESTE retorno solar (para rotular "Retorno Solar de X anos"). */
export function solarReturnAge(birthYear: number, returnMoment: Date): number {
  return returnMoment.getUTCFullYear() - birthYear
}
