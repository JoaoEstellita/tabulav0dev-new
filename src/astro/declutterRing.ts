/**
 * Anti-colisão dos glifos no anel da roda.
 *
 * REGRA INEGOCIÁVEL: o ÂNGULO de um planeta nunca muda. O ângulo é a longitude
 * dele — é o que diz em que signo e em que casa ele está. Mover o glifo em
 * ângulo para ganhar espaço é mover o planeta de casa no desenho, e a pessoa
 * não tem como desconfiar: a roda continua bonita e afirma uma coisa falsa.
 *
 * Isto não é hipótese. A versão anterior abria em ângulo quando o afastamento
 * radial batia no limite:
 *
 *     angulo[i + k] = trueAngle + (k - (n - 1) / 2) * (glyphDeg * 0.85)
 *
 * Com `glyphDeg` em torno de 18,5°, cada posição deslocava ~15,7°, e um grupo
 * de três espalhava mais de 31° — mais que uma casa inteira (30°). Júpiter
 * aparecia na Casa 1 estando na 2. O comentário da função já dizia que o ângulo
 * era mantido; o código tinha deixado de obedecê-lo.
 *
 * Quando o espaço radial acaba, a saída é aceitar glifos próximos — nunca
 * mentir sobre a posição. Para isso a roda desenha um tick na longitude exata
 * de cada planeta: mesmo com o glifo afastado, dá para ver onde ele está.
 *
 * Mora fora do componente porque o Vitest não parseia o Flow do react-native.
 */

const DEG2RAD = Math.PI / 180

/** ASC à esquerda (180°); longitude crescente gera ângulo DECRESCENTE. */
export const lonToSvgAngle = (lon: number, ascDeg: number): number =>
  (180 - (lon - ascDeg) + 360) % 360

export const polarToXY = (cx: number, cy: number, r: number, angleDeg: number) => ({
  x: cx + r * Math.cos(angleDeg * DEG2RAD),
  y: cy + r * Math.sin(angleDeg * DEG2RAD),
})

/** Distância angular mais curta (0-180) entre dois ângulos. */
export const angShort = (a: number, b: number): number =>
  Math.abs(((a - b) % 360 + 540) % 360 - 180)

export type PlacedPlanet<T> = T & {
  /** Ângulo REAL da longitude. É sempre o ângulo de desenho também. */
  trueAngle: number
  sx: number
  sy: number
  radius: number
}

/**
 * Distribui os glifos do anel afastando-os SÓ no raio.
 *
 * `step` é o espaçamento radial entre vizinhos de um mesmo aglomerado, e
 * [minR, maxR] é a faixa que o anel pode ocupar sem invadir o zodíaco nem o
 * centro.
 */
export function declutterRing<T extends { longitude: number }>(
  items: ReadonlyArray<T>,
  ascDeg: number,
  cx: number,
  cy: number,
  R: number,
  minR: number,
  maxR: number,
  step: number,
  glyphDeg: number,
): PlacedPlanet<T>[] {
  const comAngulo = (items || [])
    .map((p) => ({ item: p, trueAngle: lonToSvgAngle(p.longitude, ascDeg) }))
    .sort((a, b) => a.trueAngle - b.trueAngle)

  const raio = new Array<number>(comAngulo.length).fill(R)

  let i = 0
  while (i < comAngulo.length) {
    // Fecha o aglomerado: vizinhos a menos de um glifo de distância.
    let j = i
    while (
      j + 1 < comAngulo.length &&
      angShort(comAngulo[j + 1].trueAngle, comAngulo[j].trueAngle) < glyphDeg
    ) j++

    const n = j - i + 1
    for (let k = 0; k < n; k++) {
      const alvo = R + (k - (n - 1) / 2) * step
      // Clampar é a única concessão: fora da faixa o glifo invadiria o anel do
      // zodíaco ou o miolo dos aspectos. Dois glifos no mesmo raio ficam
      // próximos, e tudo bem — o tick marca a posição exata de cada um.
      raio[i + k] = Math.max(minR, Math.min(maxR, alvo))
    }
    i = j + 1
  }

  return comAngulo.map((w, idx) => {
    const pos = polarToXY(cx, cy, raio[idx], w.trueAngle)
    return { ...(w.item as T), trueAngle: w.trueAngle, sx: pos.x, sy: pos.y, radius: raio[idx] }
  })
}
