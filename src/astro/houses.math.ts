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


