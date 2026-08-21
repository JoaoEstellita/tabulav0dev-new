// Aspectos usados para os nódulos lunares (☊/☋) na roda e na grade.
//
// Extraído de NatalChartWheelScreen para poder ser testado como função pura,
// sem arrastar react-native no teste. A roda desenha o eixo ☊/☋ inteiro, mas na
// GRADE só o Nó Norte entra: o Sul é sempre o eixo oposto (Norte+180°), então
// todo aspecto do Norte tem o espelho do Sul (☌↔☍, △↔✶, □↔□), o que dobrava as
// linhas. Ver `mirrorAspectType` para a relação.

export type NodeAspect = { type: string; orb: number }

export const NODE_ASPECT_DEFS: { type: string; angle: number }[] = [
  { type: 'conjunção', angle: 0 },
  { type: 'sextil', angle: 60 },
  { type: 'quadratura', angle: 90 },
  { type: 'trígono', angle: 120 },
  { type: 'oposição', angle: 180 },
]

const norm = (d: number) => ((d % 360) + 360) % 360

/** Separação angular mais curta (0-180) entre duas longitudes eclípticas. */
export function angularSeparation(lon1: number, lon2: number): number {
  const x = Math.abs(norm(lon1) - norm(lon2))
  return x > 180 ? 360 - x : x
}

/**
 * Detecta o aspecto entre duas longitudes dentro do orbe (padrão 5°). Devolve o
 * primeiro aspecto cujo ângulo está dentro do orbe, ou null se nenhum encaixa.
 */
export function aspectBetween(lon1: number, lon2: number, orb = 5): NodeAspect | null {
  const s = angularSeparation(lon1, lon2)
  for (const def of NODE_ASPECT_DEFS) {
    const o = Math.abs(s - def.angle)
    if (o <= orb) return { type: def.type, orb: o }
  }
  return null
}

/**
 * O aspecto-espelho que o Nó Sul faz ao mesmo ponto que o Norte: como o Sul está
 * a 180° do Norte, a separação vira (180 − sep_Norte). Documenta por que a grade
 * mostra só o Norte.
 */
export function mirrorAspectType(type: string): string {
  switch (type) {
    case 'conjunção': return 'oposição'
    case 'oposição': return 'conjunção'
    case 'sextil': return 'trígono'
    case 'trígono': return 'sextil'
    case 'quadratura': return 'quadratura'
    default: return type
  }
}
