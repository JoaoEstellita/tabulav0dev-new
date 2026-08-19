/**
 * A roda REAL do céu do dia — como um mapa astral de verdade.
 *
 * POR QUE EXISTE
 * A `svgDaRoda` (rodaDoCeu.mjs) desenha um zodíaco FIXO (Áries sempre no topo) e
 * não tem casas. O João olhou o mockup e pediu o certo: "as posições e o círculo
 * precisam estar corretos, também pode pôr os signos e casas". Um mapa astral de
 * verdade gira pelo Ascendente (à esquerda), tem os doze signos no anel e as doze
 * casas do observador. É isso aqui.
 *
 * As posições dos corpos vêm de `mapaDoCeu` (mesmo cálculo do app). As casas vêm
 * de `ascMcCasas` (Placidus, observador de referência = Brasília). Convenção de
 * carta: ASC à esquerda (9h), a eclíptica cresce anti-horário a partir dele.
 */
import { mapaDoCeu } from './ceu.mjs'
import { ascMcCasas, OBSERVADOR_PADRAO } from './casas.mjs'
import { COR_CORPO, GLIFO_CORPO, GLIFO_SIGNO } from './rodaDoCeu.mjs'

const GRAU = Math.PI / 180
const norm360 = (g) => ((g % 360) + 360) % 360

const VOID_2 = '#0D1229'
const VELLUM = '#EDE6D8'
const BRONZE = '#C9A227'
const OURO_CLARO = '#F5D383'
const SLATE = '#4A5372'
const CASA_COR = '#5A6488'

const NOMES_SIGNO = Object.keys(GLIFO_SIGNO)
// VS15: força os glifos astrológicos a renderizar como texto mono, não emoji.
const VS = String.fromCharCode(0xFE0E)

/**
 * @param {object} opts
 * @param {Date} opts.data            instante do céu
 * @param {object[]} [opts.corpos]    de mapaDoCeu().corpos; calculado se ausente
 * @param {{lat,lon}} [opts.obs]      observador; padrão Brasília
 * @param {number} [opts.lado]        SVG quadrado
 * @param {string|null} [opts.destaque] nome do corpo a realçar (o do evento)
 * @returns {string} SVG
 */
export function svgRodaReal({ data, corpos, obs = OBSERVADOR_PADRAO, lado = 440, destaque = null, ascFixo = null }) {
  const cs = corpos || mapaDoCeu(data, {}).corpos
  // `ascFixo` (longitude) força uma roda WHOLE-SIGN com esse Ascendente à
  // esquerda — é o que o carrossel do eclipse usa, um ascendente por slide, para
  // mostrar em que casa o eclipse cai. Sem ele, casas de Placidus do observador.
  let asc, mc, cuspides
  if (ascFixo != null) {
    asc = norm360(ascFixo)
    cuspides = Array.from({ length: 12 }, (_, i) => norm360(asc + i * 30))
    mc = null
  } else {
    ({ asc, mc, cuspides } = ascMcCasas(data, obs))
  }

  const S = lado
  const cx = S / 2
  const cy = S / 2
  const rOuter = S * 0.465
  const rSignRing = S * 0.40
  const rHouseInner = S * 0.242
  const rBody = S * 0.19

  // ASC à esquerda; longitude cresce anti-horário
  const pt = (lon, r) => {
    const a = norm360(lon - asc) * GRAU
    return { x: cx - r * Math.cos(a), y: cy + r * Math.sin(a) }
  }

  let s = `<svg viewBox="0 0 ${S} ${S}" width="100%" height="auto" role="img" aria-label="roda do céu de hoje" style="font-variant-emoji:text">`

  s += `<circle cx="${cx}" cy="${cy}" r="${rOuter.toFixed(1)}" fill="none" stroke="${BRONZE}" stroke-width="1.4" opacity="0.85"/>`
  s += `<circle cx="${cx}" cy="${cy}" r="${rSignRing.toFixed(1)}" fill="none" stroke="rgba(255,255,255,0.14)" stroke-width="1"/>`
  s += `<circle cx="${cx}" cy="${cy}" r="${rHouseInner.toFixed(1)}" fill="none" stroke="rgba(255,255,255,0.10)" stroke-width="1"/>`

  // 12 divisões de signo + glifo no meio do setor
  for (let i = 0; i < 12; i++) {
    const lon = i * 30
    const p1 = pt(lon, rSignRing)
    const p2 = pt(lon, rOuter)
    s += `<line x1="${p1.x.toFixed(1)}" y1="${p1.y.toFixed(1)}" x2="${p2.x.toFixed(1)}" y2="${p2.y.toFixed(1)}" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>`
    const g = pt(lon + 15, (rSignRing + rOuter) / 2)
    s += `<text x="${g.x.toFixed(1)}" y="${g.y.toFixed(1)}" font-size="${(S * 0.042).toFixed(1)}" fill="${OURO_CLARO}" text-anchor="middle" dominant-baseline="central" style="font-variant-emoji:text">${GLIFO_SIGNO[NOMES_SIGNO[i]]}${VS}</text>`
  }

  // 12 cúspides de casa + número no meio do setor
  for (let i = 0; i < 12; i++) {
    const lon = cuspides[i]
    const p1 = pt(lon, rHouseInner)
    const p2 = pt(lon, rSignRing)
    const angular = i === 0 || i === 3 || i === 6 || i === 9
    s += `<line x1="${p1.x.toFixed(1)}" y1="${p1.y.toFixed(1)}" x2="${p2.x.toFixed(1)}" y2="${p2.y.toFixed(1)}" stroke="${angular ? BRONZE : CASA_COR}" stroke-width="${angular ? 1.5 : 0.8}" opacity="${angular ? 0.85 : 0.5}"/>`
    const next = cuspides[(i + 1) % 12]
    const mid = lon + norm360(next - lon) / 2
    const nm = pt(mid, rHouseInner + S * 0.03)
    s += `<text x="${nm.x.toFixed(1)}" y="${nm.y.toFixed(1)}" font-size="${(S * 0.026).toFixed(1)}" fill="${SLATE}" text-anchor="middle" dominant-baseline="central" opacity="0.75">${i + 1}</text>`
  }

  // eixos ASC / MC (DSC / IC discretos)
  const eixo = (lon, label, cor, peso) => {
    const p = pt(lon, rOuter + S * 0.012)
    return `<text x="${p.x.toFixed(1)}" y="${p.y.toFixed(1)}" font-size="${(S * 0.026).toFixed(1)}" fill="${cor}" text-anchor="middle" dominant-baseline="central" font-weight="${peso}" font-family="monospace">${label}</text>`
  }
  s += eixo(asc, 'ASC', BRONZE, 700)
  s += eixo(norm360(asc + 180), 'DSC', SLATE, 400)
  if (mc != null) {
    s += eixo(mc, 'MC', BRONZE, 700)
    s += eixo(norm360(mc + 180), 'IC', SLATE, 400)
  }

  // planetas — anti-colisão radial quando < 7° de longitude
  const ordenados = [...cs].filter((c) => COR_CORPO[c.nome]).sort((a, b) => a.longitude - b.longitude)
  const raioDe = new Map()
  const nivelDe = new Map()
  let ultimo = null, nivel = 0
  for (const c of ordenados) {
    if (ultimo !== null && norm360(c.longitude - ultimo) < 7) nivel = (nivel + 1) % 3
    else nivel = 0
    raioDe.set(c.nome, rBody + nivel * S * 0.038)
    nivelDe.set(c.nome, nivel)
    ultimo = c.longitude
  }

  const rDisco = S * 0.032
  for (const c of ordenados) {
    const cor = COR_CORPO[c.nome]
    const r = raioDe.get(c.nome)
    const p = pt(c.longitude, r)
    const realce = destaque && c.nome === destaque
    const tick = pt(c.longitude, rHouseInner - S * 0.004)
    s += `<line x1="${tick.x.toFixed(1)}" y1="${tick.y.toFixed(1)}" x2="${p.x.toFixed(1)}" y2="${p.y.toFixed(1)}" stroke="rgba(255,255,255,0.10)" stroke-width="0.6"/>`
    if (realce) {
      s += `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${(rDisco * 1.7).toFixed(1)}" fill="none" stroke="${BRONZE}" stroke-width="1.2" opacity="0.6"/>`
    }
    s += `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${rDisco.toFixed(1)}" fill="${VOID_2}" stroke="${cor}" stroke-width="1.5"/>`
    s += `<text x="${p.x.toFixed(1)}" y="${p.y.toFixed(1)}" font-size="${(S * 0.04).toFixed(1)}" fill="${cor}" text-anchor="middle" dominant-baseline="central" style="font-variant-emoji:text">${GLIFO_CORPO[c.nome]}${VS}</text>`
    if (nivelDe.get(c.nome) === 0) {
      const grauInt = Math.floor(c.longitude % 30)
      const rot = pt(c.longitude, r - S * 0.05)
      s += `<text x="${rot.x.toFixed(1)}" y="${rot.y.toFixed(1)}" font-size="${(S * 0.02).toFixed(1)}" fill="${SLATE}" text-anchor="middle" dominant-baseline="central">${grauInt}°</text>`
    }
  }

  s += `<circle cx="${cx}" cy="${cy}" r="3" fill="${SLATE}"/>`
  s += `</svg>`
  return s
}
