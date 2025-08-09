/**
 * Placidus semi-arc method (aproximação numérica) em TypeScript puro.
 * Referências: Meeus – Astronomical Algorithms (cap. 12–15), métodos clássicos.
 *
 * Observação: usa obliquidade média igual ao do módulo houses.ts para coerência.
 * O algoritmo busca AR (ascensão reta) do ponto na eclíptica cujo hour-angle é
 * uma fração do semi-arco (±1/3, ±2/3) a partir do meridiano, para gerar as
 * cúspides intermediárias. As cúspides opostas vêm por +180°.
 */

import { SiderealTime } from 'astronomy-engine'
import { angleDiffCCW, norm360, toDeg, toRad } from './houses.math'

const OBLIQUITY_DEG = 23.4392911

export interface PlacidusResult {
  cusps: number[]
  asc: number
  mc: number
  approximate: boolean
}

function obliquityRad(): number { return toRad(OBLIQUITY_DEG) }

// Conversões eclíptica ↔ equatorial
function lonToRaDec(lambdaDeg: number): { ra: number; dec: number } {
  const lam = toRad(norm360(lambdaDeg))
  const eps = obliquityRad()
  const sinLam = Math.sin(lam)
  const cosLam = Math.cos(lam)
  const ra = Math.atan2(sinLam * Math.cos(eps), cosLam) // em rad
  const dec = Math.asin(Math.sin(eps) * sinLam)
  return { ra, dec }
}

function raDecToLon(raRad: number, decRad: number): number {
  const eps = obliquityRad()
  // a partir de ra, dec na esfera celeste → longitude eclíptica
  // tan λ = tan α cos ε / cos β  (β=lat eclíptica ≈ calculada da relação)
  const sinRa = Math.sin(raRad)
  const cosRa = Math.cos(raRad)
  const tanLam = (sinRa / cosRa) / Math.cos(eps)
  let lam = Math.atan2(sinRa * Math.cos(eps), cosRa)
  if (lam < 0) lam += 2*Math.PI
  return norm360(toDeg(lam))
}

// Semi-arco diurno: H0 = arccos(-tan φ tan δ)
function semiArcHours(decRad: number, latRad: number): number {
  const val = -Math.tan(latRad) * Math.tan(decRad)
  const clamped = Math.max(-1, Math.min(1, val))
  const H0 = Math.acos(clamped) // rad
  return H0
}

// Solver simples por bissecção + refinamento
function solveAngle(
  f: (x:number)=>number,
  lo: number,
  hi: number,
  tol = 1e-6,
  maxIter = 50
): number {
  let a = lo, b = hi
  let fa = f(a), fb = f(b)
  for (let i=0;i<maxIter;i++){
    const mid = 0.5*(a+b)
    const fm = f(mid)
    if (Math.abs(fm) < tol) return mid
    // escolher subintervalo
    if (fa*fm <= 0){ b = mid; fb = fm } else { a = mid; fa = fm }
  }
  return 0.5*(a+b)
}

export function computePlacidusCusps(
  dateUTC: Date,
  latDeg: number,
  lonDeg: number,
  ascDeg: number,
  mcDeg: number
): PlacidusResult {
  const approximate: boolean = Math.abs(latDeg) >= 66
  if (approximate){
    // fallback: usar Equal (com asc dado)
    const cusps = Array.from({length:12}, (_,i)=>norm360(ascDeg + 30*i))
    return { cusps, asc: ascDeg, mc: mcDeg, approximate: true }
  }

  // LST em horas
  const lstHours = SiderealTime(dateUTC, lonDeg)
  const lst = toRad(lstHours*15)
  const lat = toRad(latDeg)

  // MC e ASC já foram fornecidos (em graus). Precisamos derivar as cúspides 11/12/2/3 por semi-arcos.
  // Estratégia: procuramos AR (α) do ponto na eclíptica cujo hour-angle H satisfaça H = k*H0(dec), com k = ±1/3, ±2/3.

  const eps = obliquityRad()

  function errorForK(targetK: number, side: 'east'|'west'): (alpha: number)=>number {
    // alpha em rad; dec depende de λ correspondente, mas aqui aproximamos dec a partir de α assumindo lat e obliquidade.
    return (alpha: number) => {
      // Declinação aproximada de ponto na eclíptica com RA=alpha: dec = asin(sin ε sin λ), com λ ≈ atan2(sin α / cos ε, cos α)
      const lam = Math.atan2(Math.sin(alpha)/Math.cos(eps), Math.cos(alpha))
      const dec = Math.asin(Math.sin(eps)*Math.sin(lam))
      const H0 = semiArcHours(dec, lat) // rad
      // hour-angle do ponto relativo ao meridiano local: H = lst - alpha
      let H = lst - alpha
      // normalizar para (-π, π]
      while (H <= -Math.PI) H += 2*Math.PI
      while (H > Math.PI) H -= 2*Math.PI
      const target = targetK * H0 * (side==='west' ? -1 : +1)
      return H - target
    }
  }

  function solveAlphaFromK(k: number, side: 'east'|'west', seedDeg: number): number {
    const seed = toRad(seedDeg)
    const f = errorForK(k, side)
    const lo = seed - 0.6 // janela ampla
    const hi = seed + 0.6
    return solveAngle(f, lo, hi, 1e-6, 60)
  }

  // Seeds a partir de MC/ASC aproximando vizinhança
  const seeds = {
    c11: mcDeg - 20,
    c12: mcDeg - 40,
    c9:  mcDeg + 20,
    c8:  mcDeg + 40,
  }

  const a11 = solveAlphaFromK(1/3, 'east', seeds.c11)
  const a12 = solveAlphaFromK(2/3, 'east', seeds.c12)
  const a9  = solveAlphaFromK(1/3, 'west', seeds.c9)
  const a8  = solveAlphaFromK(2/3, 'west', seeds.c8)

  const c11 = raDecToLon(a11, 0)
  const c12 = raDecToLon(a12, 0)
  const c9  = raDecToLon(a9 , 0)
  const c8  = raDecToLon(a8 , 0)

  // Opostos
  const c5 = norm360(c11 + 180)
  const c6 = norm360(c12 + 180)
  const c3 = norm360(c9  + 180)
  const c2 = norm360(c8  + 180)
  const c7 = norm360(ascDeg + 180)
  const ic = norm360(mcDeg + 180)

  // Montar cúspides
  const cusps = [
    norm360(ascDeg),
    c2,
    c3,
    ic,
    c5,
    c6,
    c7,
    c8,
    c9,
    norm360(mcDeg),
    c11,
    c12,
  ]

  // Checar ordem anti-horária (crescentes) — se falhar, sinalizar approximate
  let bad = false
  for (let i=0;i<12;i++){
    const a = cusps[i]
    const b = cusps[(i+1)%12]
    const arc = angleDiffCCW(a, b)
    if (arc <= 0 || arc >= 180) { bad = true; break }
  }
  if (bad) {
    const eq = Array.from({length:12}, (_,i)=>norm360(ascDeg + 30*i))
    return { cusps: eq, asc: ascDeg, mc: mcDeg, approximate: true }
  }

  return { cusps, asc: ascDeg, mc: mcDeg, approximate }
}


