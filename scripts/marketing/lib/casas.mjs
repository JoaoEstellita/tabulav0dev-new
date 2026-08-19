/**
 * Ascendente, Meio do Céu e cúspides de casa — para a roda das peças.
 *
 * POR QUE VIVE AQUI (e não importa do backend)
 * O gerador roda no CI (cron das 6h) com só o repo `frontend` no checkout; o
 * backend é outro repo git e não estaria presente. Então as fórmulas — as mesmas
 * validadas contra o Swiss Ephemeris a Δ0,00° (ASC atan2, MC projetado, Placidus
 * por semi-arco) — são portadas para cá, autocontidas, sobre `astronomy-engine`
 * que o marketing já usa.
 *
 * Casas dependem do observador. Uma peça pública não tem "o observador", então a
 * roda usa um ponto de referência fixo — Brasília, a capital — e as casas são o
 * céu daquele instante visto de lá. Signos e posições de planeta independem do
 * lugar; só as casas.
 */
import * as Astronomy from 'astronomy-engine'

const GRAU = Math.PI / 180
const norm360 = (g) => ((g % 360) + 360) % 360

// Brasília — observador de referência das peças.
export const OBSERVADOR_PADRAO = { lat: -15.7939, lon: -47.8828, nome: 'Brasília' }

const sin = (g) => Math.sin(g * GRAU)
const cos = (g) => Math.cos(g * GRAU)
const tan = (g) => Math.tan(g * GRAU)
const asin = (v) => Math.asin(Math.max(-1, Math.min(1, v))) / GRAU
const atan2 = (y, x) => Math.atan2(y, x) / GRAU

/** Longitude eclíptica do ponto da eclíptica (β=0) que tem esta ascensão reta. */
function longitudeDaAscensaoReta(ar, obliquidade) {
  return norm360(atan2(sin(ar), cos(ar) * cos(obliquidade)))
}

/** Placidus é indefinido acima do círculo polar: o ponto não nasce nem se põe. */
function ehLatitudePolar(latitude) {
  return Math.abs(latitude) > 66
}

/** Uma cúspide intermediária (11, 12, 2 ou 3), por iteração do semi-arco. */
function cuspideIntermediaria({ ramc, latitude, obliquidade, fracao, noturno }) {
  let anguloHorario = noturno ? 180 - fracao * 90 : fracao * 90
  for (let i = 0; i < 40; i += 1) {
    const ar = ramc + anguloHorario
    const longitude = longitudeDaAscensaoReta(ar, obliquidade)
    const declinacao = asin(sin(obliquidade) * sin(longitude))
    const produto = tan(latitude) * tan(declinacao)
    if (Math.abs(produto) >= 1) return null
    const diferencaAscensional = asin(produto)
    const semiArco = noturno ? 90 - diferencaAscensional : 90 + diferencaAscensional
    const novo = noturno ? 180 - fracao * semiArco : fracao * semiArco
    if (Math.abs(novo - anguloHorario) < 1e-9) { anguloHorario = novo; break }
    anguloHorario = novo
  }
  return longitudeDaAscensaoReta(ramc + anguloHorario, obliquidade)
}

/** As 12 cúspides de Placidus. `null` quando Placidus não se aplica. */
function placidusCuspides({ ramc, latitude, obliquidade, ascendente, meioDoCeu }) {
  if (!Number.isFinite(ramc) || !Number.isFinite(latitude) || !Number.isFinite(obliquidade)) return null
  if (!Number.isFinite(ascendente) || !Number.isFinite(meioDoCeu)) return null
  if (ehLatitudePolar(latitude)) return null

  const c11 = cuspideIntermediaria({ ramc, latitude, obliquidade, fracao: 1 / 3, noturno: false })
  const c12 = cuspideIntermediaria({ ramc, latitude, obliquidade, fracao: 2 / 3, noturno: false })
  const c2 = cuspideIntermediaria({ ramc, latitude, obliquidade, fracao: 2 / 3, noturno: true })
  const c3 = cuspideIntermediaria({ ramc, latitude, obliquidade, fracao: 1 / 3, noturno: true })
  if (c11 === null || c12 === null || c2 === null || c3 === null) return null

  const cuspides = new Array(12)
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

/** Trissecção linear dos quadrantes — só como último recurso (latitude polar). */
function trisseccaoDeQuadrante(ascendente, meioDoCeu) {
  const cuspides = new Array(12)
  cuspides[0] = norm360(ascendente)
  cuspides[3] = norm360(meioDoCeu + 180)
  cuspides[6] = norm360(ascendente + 180)
  cuspides[9] = norm360(meioDoCeu)
  const terco = (de, ate, n) => norm360(de + (norm360(ate - de) / 3) * n)
  cuspides[1] = terco(cuspides[0], cuspides[3], 1)
  cuspides[2] = terco(cuspides[0], cuspides[3], 2)
  cuspides[4] = terco(cuspides[3], cuspides[6], 1)
  cuspides[5] = terco(cuspides[3], cuspides[6], 2)
  cuspides[7] = terco(cuspides[6], cuspides[9], 1)
  cuspides[8] = terco(cuspides[6], cuspides[9], 2)
  cuspides[10] = terco(cuspides[9], cuspides[0], 1)
  cuspides[11] = terco(cuspides[9], cuspides[0], 2)
  return cuspides
}

/**
 * Ascendente, MC e as 12 cúspides para um instante e um lugar.
 *
 * @param {Date} data
 * @param {{lat:number, lon:number}} obs  observador; padrão Brasília
 * @returns {{asc:number, mc:number, ramc:number, obliquidade:number, cuspides:number[], sistema:string}}
 */
export function ascMcCasas(data, obs = OBSERVADOR_PADRAO) {
  const { lat, lon } = obs
  const astroTime = new Astronomy.AstroTime(data)
  const gstHours = Astronomy.SiderealTime(astroTime)
  let lstHours = gstHours + lon / 15
  lstHours = ((lstHours % 24) + 24) % 24
  const ramc = norm360(lstHours * 15)
  const eps = Astronomy.e_tilt(astroTime).tobl
  const epsRad = eps * GRAU
  const lstRad = ramc * GRAU
  const latRad = lat * GRAU

  // ASC = atan2(cos(RAMC), -(sin(RAMC)·cosε + tanφ·sinε))
  const ascNum = Math.cos(lstRad)
  const ascDen = -Math.sin(lstRad) * Math.cos(epsRad) - Math.tan(latRad) * Math.sin(epsRad)
  const asc = norm360(Math.atan2(ascNum, ascDen) / GRAU)
  // MC = atan2(sin(RAMC), cos(RAMC)·cosε)
  const mc = norm360(Math.atan2(Math.sin(lstRad), Math.cos(lstRad) * Math.cos(epsRad)) / GRAU)

  const real = placidusCuspides({ ramc, latitude: lat, obliquidade: eps, ascendente: asc, meioDoCeu: mc })
  if (real) return { asc, mc, ramc, obliquidade: eps, cuspides: real, sistema: 'placidus' }
  return { asc, mc, ramc, obliquidade: eps, cuspides: trisseccaoDeQuadrante(asc, mc), sistema: 'quadrante-trissecado' }
}
