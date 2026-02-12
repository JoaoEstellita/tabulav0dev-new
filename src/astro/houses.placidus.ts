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
  const approxByLat: boolean = Math.abs(latDeg) >= 66
  if (approxByLat){
    const cusps = Array.from({length:12}, (_,i)=>norm360(ascDeg + 30*i))
    return { cusps, asc: ascDeg, mc: mcDeg, approximate: true }
  }

  // astronomy-engine returns Greenwich sidereal time; convert to local with longitude.
  const lstHours = SiderealTime(dateUTC) + lonDeg / 15
  const RAMC = norm360(lstHours*15)
  const epsRad = obliquityRad()
  const latRad = toRad(latDeg)

  // helpers em graus
  const deg2rad = (d:number)=> d*Math.PI/180
  const rad2deg = (r:number)=> r*180/Math.PI
  const normalize = (d:number)=> ((d%360)+360)%360
  const sin = Math.sin, cos = Math.cos, tan = Math.tan, asin = Math.asin, atan2 = Math.atan2, acos = Math.acos

  function raFromLon(lonDeg:number): number {
    const L = deg2rad(lonDeg)
    const a = atan2(sin(L)*cos(epsRad), cos(L))
    let A = rad2deg(a); if (A<0) A+=360; return A
  }
  function decFromLon(lonDeg:number): number {
    const L = deg2rad(lonDeg)
    const d = asin(sin(epsRad)*sin(L))
    return rad2deg(d)
  }
  function H0FromDec(decDeg:number): number {
    const D = deg2rad(decDeg)
    const val = -tan(latRad)*tan(D)
    const clamped = Math.max(-1, Math.min(1, val))
    return rad2deg(acos(clamped))
  }
  function solveCusp(baseRAMC:number, k:number, sign:number, seed:number): number {
    // f(lon) = RA(lon) - (base + sign*k*H0(dec(lon)))
    const f = (lon:number)=>{
      const ra = raFromLon(lon)
      const dec = decFromLon(lon)
      const H0 = H0FromDec(dec)
      const target = normalize(baseRAMC + sign*k*H0)
      let diff = normalize(ra - target)
      if (diff > 180) diff -= 360
      return diff
    }
    let x0 = normalize(seed)
    let x1 = normalize(seed + (sign>0?+5:-5))
    let y0 = f(x0)
    let y1 = f(x1)
    for (let i=0;i<40;i++){
      if (Math.abs(y1 - y0) < 1e-9) break
      let x2 = normalize(x1 - y1*(x1 - x0)/(y1 - y0))
      const y2 = f(x2)
      x0 = x1; y0 = y1
      x1 = x2; y1 = y2
      if (Math.abs(y1) < 1e-4) break
    }
    return normalize(x1)
  }

  // Porphyry seeds em eclíptica
  const asc = normalize(ascDeg), mc = normalize(mcDeg)
  const dsc = normalize(asc + 180), ic = normalize(mc + 180)
  const span = (a:number,b:number)=> normalize(b - a)
  const along = (a:number,b:number,frac:number)=> normalize(a + frac*span(a,b))
  const seed12 = along(mc, asc, 2/3)
  const seed11 = along(mc, asc, 1/3)
  const seed9  = along(dsc, mc, 1/3)
  const seed8  = along(dsc, mc, 2/3)

  // Resolver
  // Mapeamento k calibrado: 11 = 1/3, 12 = 2/3 (leste/acima); 9 = 2/3, 8 = 1/3 (oeste/acima)
  const c11 = solveCusp(RAMC, 1/3, +1, seed11)
  const c12 = solveCusp(RAMC, 2/3, +1, seed12)
  const c9  = solveCusp(RAMC, 2/3, -1, seed9)
  const c8  = solveCusp(RAMC, 1/3, -1, seed8)

  // Opostos
  const c5 = norm360(c11 + 180)
  const c6 = norm360(c12 + 180)
  const c3 = norm360(c9  + 180)
  const c2 = norm360(c8  + 180)
  const c7 = norm360(ascDeg + 180)
  const icOpp = norm360(mcDeg + 180)

  // Montar cúspides
  const cusps = [
    norm360(ascDeg),
    c2,
    c3,
    icOpp,
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

  return { cusps, asc: ascDeg, mc: mcDeg, approximate: false }
}


