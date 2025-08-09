// Utilidades matemáticas puras para cálculos de casas

export function norm360(deg: number): number {
  const d = deg % 360
  return d < 0 ? d + 360 : d
}

export function toRad(deg: number): number {
  return (deg * Math.PI) / 180
}

export function toDeg(rad: number): number {
  return (rad * 180) / Math.PI
}

// Arco anti-horário de a→b em graus (0..360)
export function angleDiffCCW(a: number, b: number): number {
  return norm360(norm360(b) - norm360(a))
}

export function wrapIndex(i: number, n = 12): number {
  return ((i % n) + n) % n
}

export function withinArcCCW(start: number, end: number, x: number, eps = 1e-9): boolean {
  const span = angleDiffCCW(start, end)
  const dx = angleDiffCCW(start, x)
  return dx > -eps && dx < span - eps
}

export function signIndexFromDegree(deg: number): number {
  return Math.floor(norm360(deg) / 30) % 12
}

export const SIGNS = [
  'Áries','Touro','Gêmeos','Câncer','Leão','Virgem','Libra','Escorpião','Sagitário','Capricórnio','Aquário','Peixes'
]

export function degToSign(deg: number): { sign: string; degInSign: number } {
  const d = norm360(deg)
  const idx = signIndexFromDegree(d)
  const degIn = d - idx * 30
  return { sign: SIGNS[idx], degInSign: degIn }
}

// Gera uma cópia monotônica das cúspides a partir do ASC (C1), "desenrolando" 360° quando necessário
// - Espera 12 valores normalizados 0–360 com C1 na posição 0
// - Retorna sequência estritamente crescente: C1 < C2 < ... < C12 < C1+360
export function makeMonotonicCuspsFromAsc(cuspsDeg: number[]): number[] {
  if (!Array.isArray(cuspsDeg) || cuspsDeg.length !== 12) {
    throw new Error('12 cusps expected')
  }
  const out: number[] = []
  const base = norm360(cuspsDeg[0])
  out.push(base)
  let prev = base
  for (let i = 1; i < 12; i++) {
    let x = norm360(cuspsDeg[i])
    while (x <= prev) x += 360
    out.push(x)
    prev = x
  }
  // validação básica dos arcos
  const arcs = out.map((c, i) => ((i < 11 ? out[i + 1] : out[0] + 360) - c))
  const okArcs = arcs.every(a => a > 0 && a < 180)
  const sum = arcs.reduce((a, b) => a + b, 0)
  if (!okArcs || Math.abs(sum - 360) > 0.2) {
    throw new Error(`Invalid house arcs (sum=${sum.toFixed(3)})`)
  }
  return out
}


