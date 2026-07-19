/**
 * Cúspides de Placidus — solução real, por semi-arco.
 *
 * POR QUE EXISTE
 * `computeHousesUTC` nunca chamou o `houses.placidus.ts` que existia no repo:
 * para quem escolhia Placidus, ele caía em `asc + i*30`, que é **casas iguais**.
 * Enquanto isso o backend calculava outra coisa. Resultado: o número da casa de
 * um planeta divergia entre telas do mesmo app.
 *
 * Esta é a porta direta de `backend/lib/astro/placidus.js`, que bate com o Swiss
 * Ephemeris a 0,000° (`backend/scripts/audit/cmp-placidus-real.mjs`). Os dois
 * lados precisam concordar, e o jeito de garantir isso é ser o mesmo algoritmo.
 *
 * O MÉTODO
 * Placidus divide o TEMPO que um ponto leva para percorrer seu arco, não o
 * espaço. As cúspides 11 e 12 estão a 1/3 e 2/3 do semi-arco diurno; 2 e 3, do
 * noturno. O arco depende da declinação do ponto, que depende de onde a cúspide
 * cai — é circular, e por isso se resolve iterando.
 *
 * ⚠️ Em latitude polar (|φ| > 66°) Placidus é INDEFINIDO: o ponto não nasce nem
 * se põe, e não há semi-arco para dividir.
 */

const GRAU = Math.PI / 180

const sin = (g: number) => Math.sin(g * GRAU)
const cos = (g: number) => Math.cos(g * GRAU)
const tan = (g: number) => Math.tan(g * GRAU)
const asin = (v: number) => Math.asin(Math.max(-1, Math.min(1, v))) / GRAU
const atan2 = (y: number, x: number) => Math.atan2(y, x) / GRAU
const norm360 = (g: number) => ((g % 360) + 360) % 360

/** Longitude eclíptica do ponto da eclíptica (β=0) com esta ascensão reta. */
export function longitudeDaAscensaoReta(ar: number, obliquidade: number): number {
  return norm360(atan2(sin(ar), cos(ar) * cos(obliquidade)))
}

export function ehLatitudePolar(latitude: number): boolean {
  return Math.abs(latitude) > 66
}

function cuspideIntermediaria(
  ramc: number,
  latitude: number,
  obliquidade: number,
  fracao: number,
  noturno: boolean,
): number | null {
  // Chute inicial = a divisão igual, que é a resposta exata no equador.
  let anguloHorario = noturno ? 180 - fracao * 90 : fracao * 90

  for (let i = 0; i < 40; i += 1) {
    const longitude = longitudeDaAscensaoReta(ramc + anguloHorario, obliquidade)
    const declinacao = asin(sin(obliquidade) * sin(longitude))

    // |tan φ · tan δ| >= 1 significa ponto circumpolar — não há arco.
    const produto = tan(latitude) * tan(declinacao)
    if (Math.abs(produto) >= 1) return null
    const diferencaAscensional = asin(produto)

    const semiArco = noturno ? 90 - diferencaAscensional : 90 + diferencaAscensional
    const novo = noturno ? 180 - fracao * semiArco : fracao * semiArco

    if (Math.abs(novo - anguloHorario) < 1e-9) {
      anguloHorario = novo
      break
    }
    anguloHorario = novo
  }

  return longitudeDaAscensaoReta(ramc + anguloHorario, obliquidade)
}

/**
 * As 12 cúspides de Placidus, ou `null` quando o sistema não se aplica.
 *
 * `ramc` é a ascensão reta do meridiano — NÃO o MC eclíptico. Confundir os dois
 * já custou 2,29° de erro neste repo.
 */
export function placidusCuspides(params: {
  ramc: number
  latitude: number
  obliquidade: number
  ascendente: number
  meioDoCeu: number
}): number[] | null {
  const { ramc, latitude, obliquidade, ascendente, meioDoCeu } = params
  if (![ramc, latitude, obliquidade, ascendente, meioDoCeu].every(Number.isFinite)) return null
  if (ehLatitudePolar(latitude)) return null

  const c11 = cuspideIntermediaria(ramc, latitude, obliquidade, 1 / 3, false)
  const c12 = cuspideIntermediaria(ramc, latitude, obliquidade, 2 / 3, false)
  const c2 = cuspideIntermediaria(ramc, latitude, obliquidade, 2 / 3, true)
  const c3 = cuspideIntermediaria(ramc, latitude, obliquidade, 1 / 3, true)
  if (c11 === null || c12 === null || c2 === null || c3 === null) return null

  const cuspides = new Array<number>(12)
  cuspides[0] = norm360(ascendente)
  cuspides[1] = c2
  cuspides[2] = c3
  cuspides[3] = norm360(meioDoCeu + 180)
  cuspides[4] = norm360(c11 + 180)
  cuspides[5] = norm360(c12 + 180)
  cuspides[6] = norm360(ascendente + 180)
  cuspides[7] = norm360(c2 + 180)
  cuspides[8] = norm360(c3 + 180)
  cuspides[9] = norm360(meioDoCeu)
  cuspides[10] = c11
  cuspides[11] = c12
  return cuspides
}
