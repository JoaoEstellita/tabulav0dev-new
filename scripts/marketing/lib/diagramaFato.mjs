/**
 * O diagrama do FATO — a imagem que ilustra o que o texto diz.
 *
 * ── POR QUE EXISTE ─────────────────────────────────────────────────────────
 *
 * A roda do céu de hoje (rodaReal) era a mesma em toda peça, mas o texto muda:
 * numa fase, o fato é só o Sol e a Lua num ângulo; num conceito de casas, o
 * assunto são as doze casas, não o céu do dia. O João: "a imagem não condiz com
 * o que está dizendo". Aqui cada tipo de assunto ganha o desenho do SEU fato.
 *
 * A lógica vem do diagrama focado que o template antigo já tinha; o que muda é
 * a paleta (identidade v3: navy + ouro) e o fundo, que fica transparente porque
 * quem pinta o céu procedural atrás é o `templatePeca`.
 */
import { OURO, OURO_CLARO, CREME } from './marca.mjs'
import { COR_CORPO, GLIFO_CORPO, GLIFO_SIGNO } from './rodaDoCeu.mjs'

const NOITE_2 = '#141833'
const SLATE = '#8A93BD'
const ARO = '#3A4472'
const ARO_2 = '#2A3358'
const VS = String.fromCharCode(0xFE0E)

const LADO = 440
const CX = 220
const CY = 210
const RAIO = 118
const ARO_EXTERNO = 150
const ARO_INTERNO = 82

const rad = (g) => (g * Math.PI) / 180
/** 0° no topo, sentido horário. */
const ponto = (ang, r = RAIO) => ({ x: CX + r * Math.sin(rad(ang)), y: CY - r * Math.cos(rad(ang)) })

const RAIO_CORPO = {
  Sun: 22, Moon: 18, Mercury: 14, Venus: 18, Mars: 16,
  Jupiter: 24, Saturn: 22, Uranus: 19, Neptune: 18, Pluto: 13,
}

const NOMES_SIGNO = Object.keys(GLIFO_SIGNO)
const ORDEM = ['Áries', 'Touro', 'Gêmeos', 'Câncer', 'Leão', 'Virgem',
  'Libra', 'Escorpião', 'Sagitário', 'Capricórnio', 'Aquário', 'Peixes']

/** Um corpo: disco na cor dele + glifo. `halo` realça o protagonista. */
function corpo(nome, x, y, halo = false) {
  const r = RAIO_CORPO[nome] || 16
  const cor = COR_CORPO[nome] || CREME
  const brilho = halo
    ? `<circle cx="${x}" cy="${y}" r="${r + 8}" fill="none" stroke="${OURO}" stroke-width="1.3" opacity="0.55"/>`
    : ''
  return `${brilho}<circle cx="${x}" cy="${y}" r="${r}" fill="${NOITE_2}" stroke="${cor}" stroke-width="1.8"/>` +
    `<text x="${x}" y="${y}" font-size="${r * 1.15}" fill="${cor}" text-anchor="middle" dominant-baseline="central" style="font-variant-emoji:text">${GLIFO_CORPO[nome]}${VS}</text>`
}

/** A moldura comum: dois aros e as marcas dos quatro pontos cardeais. */
function moldura(aria) {
  return `<svg viewBox="0 0 ${LADO} ${LADO}" width="100%" height="auto" role="img" aria-label="${aria}" style="font-variant-emoji:text">
  <circle cx="${CX}" cy="${CY}" r="${ARO_EXTERNO}" fill="none" stroke="${ARO}" stroke-width="1.4" opacity="0.7"/>
  <circle cx="${CX}" cy="${CY}" r="${ARO_INTERNO}" fill="none" stroke="${ARO_2}" stroke-width="1" opacity="0.6"/>`
}

/** Arco entre dois ângulos, no raio do aro. */
function arco(de, ate, cor, largura, opacidade, tracejado = '') {
  const a = ponto(de, RAIO)
  const b = ponto(ate, RAIO)
  const grande = Math.abs(ate - de) > 180 ? 1 : 0
  const dash = tracejado ? `stroke-dasharray="${tracejado}"` : ''
  return `<path d="M ${a.x.toFixed(1)} ${a.y.toFixed(1)} A ${RAIO} ${RAIO} 0 ${grande} 1 ${b.x.toFixed(1)} ${b.y.toFixed(1)}" fill="none" stroke="${cor}" stroke-width="${largura}" opacity="${opacidade}" stroke-linecap="round" ${dash}/>`
}

const rotuloCentral = (txt) =>
  `<text x="${CX}" y="${CY + RAIO + 42}" font-size="21" fill="${OURO}" text-anchor="middle" font-family="serif">${txt}</text>`

/**
 * FASE: o Sol e a Lua no ângulo da fase. É a definição da fase desenhada —
 * 0° na Nova, 90° no crescente, 180° na cheia, 270° no minguante.
 */
export function diagramaFase({ fase, luminar }) {
  const ang = fase === 'Lua Cheia' ? 180
    : fase === 'Quarto Crescente' ? 90
      : fase === 'Quarto Minguante' ? 270 : 0
  const pSol = ponto(0)
  const pLua = ponto(ang)
  const nova = ang === 0

  let s = moldura(`Sol e Lua a ${ang} graus`)
  if (!nova) s += arco(0, ang, OURO, 2.4, 0.5, '4 6')
  s += corpo('Sun', pSol.x, pSol.y, luminar === 'Sun')
  if (nova) {
    // na Nova a Lua cobre o Sol: os dois no mesmo ponto
    s += corpo('Moon', pSol.x + 6, pSol.y + 4, true)
  } else {
    s += corpo('Moon', pLua.x, pLua.y, luminar !== 'Sun')
  }
  s += rotuloCentral(`${ang}° entre Sol e Lua`)
  s += `</svg>`
  return s
}

/**
 * ASPECTO: dois planetas e o ângulo entre eles. Conjunção fica lado a lado; os
 * outros abrem no ângulo do aspecto, com o arco marcado.
 */
export function diagramaAspecto({ agente, alvo, angulo, destaque }) {
  const conj = angulo === 0
  const angA = conj ? -16 : 0
  const angB = conj ? 16 : angulo
  const pA = ponto(angA)
  const pB = ponto(angB)

  let s = moldura(`${agente} e ${alvo} a ${angulo} graus`)
  if (!conj) s += arco(0, angulo, OURO, 2.2, 0.7, '3 5')
  s += corpo(agente, pA.x, pA.y, destaque === agente)
  s += corpo(alvo, pB.x, pB.y, destaque === alvo)
  s += rotuloCentral(conj ? 'juntos, no mesmo grau' : `${angulo}° de distância`)
  s += `</svg>`
  return s
}

/**
 * INGRESSO: o planeta cruzando a divisa entre dois signos. O signo de onde sai
 * fica apagado; o que entra, aceso na cor do corpo. A divisa vertical no topo.
 */
export function diagramaIngresso({ corpo: nome, signo, signoAnterior }) {
  const cor = COR_CORPO[nome] || OURO
  const setor = (de, ate, c, op, w) => {
    const a = ponto(de, RAIO)
    const b = ponto(ate, RAIO)
    return `<path d="M ${a.x.toFixed(1)} ${a.y.toFixed(1)} A ${RAIO} ${RAIO} 0 0 1 ${b.x.toFixed(1)} ${b.y.toFixed(1)}" fill="none" stroke="${c}" stroke-width="${w}" opacity="${op}"/>`
  }
  const dentro = ponto(0, ARO_INTERNO + 4)
  const fora = ponto(0, ARO_EXTERNO - 4)
  const pCorpo = ponto(0)

  let s = moldura(`${nome} entra em ${signo}`)
  s += setor(-70, -3, SLATE, 0.45, 12)   // de onde sai: apagado
  s += setor(3, 70, cor, 0.8, 12)        // para onde entra: aceso
  s += `<line x1="${dentro.x.toFixed(1)}" y1="${dentro.y.toFixed(1)}" x2="${fora.x.toFixed(1)}" y2="${fora.y.toFixed(1)}" stroke="${CREME}" stroke-width="2" opacity="0.9"/>`
  s += corpo(nome, pCorpo.x, pCorpo.y, true)
  // glifos dos dois signos, dos dois lados da divisa
  const gEsq = ponto(-40, RAIO - 34)
  const gDir = ponto(40, RAIO - 34)
  s += `<text x="${gEsq.x.toFixed(1)}" y="${gEsq.y.toFixed(1)}" font-size="22" fill="${SLATE}" text-anchor="middle" dominant-baseline="central" style="font-variant-emoji:text">${GLIFO_SIGNO[signoAnterior] || ''}${VS}</text>`
  s += `<text x="${gDir.x.toFixed(1)}" y="${gDir.y.toFixed(1)}" font-size="22" fill="${OURO_CLARO}" text-anchor="middle" dominant-baseline="central" style="font-variant-emoji:text">${GLIFO_SIGNO[signo] || ''}${VS}</text>`
  s += rotuloCentral(`${signoAnterior || ''} → ${signo}`)
  s += `</svg>`
  return s
}

/** RETRÓGRADO / DIRETO: o planeta com o arco de ida e volta. */
export function diagramaMovimento({ corpo: nome, tipo }) {
  const pCorpo = ponto(0)
  // o arco andado (chega até o corpo) e a volta curta que inverte o movimento
  let s = moldura(`${nome} ${tipo}`)
  s += arco(-40, 0, COR_CORPO[nome] || OURO, 2.4, 0.4)
  s += `<path d="M ${ponto(0, RAIO).x.toFixed(1)} ${ponto(0, RAIO).y.toFixed(1)} A ${RAIO} ${RAIO} 0 0 0 ${ponto(-18, RAIO).x.toFixed(1)} ${ponto(-18, RAIO).y.toFixed(1)}" fill="none" stroke="${OURO}" stroke-width="2.6" opacity="0.85" stroke-linecap="round"/>`
  s += corpo(nome, pCorpo.x, pCorpo.y, true)
  s += rotuloCentral(tipo === 'retrogrado' ? 'para e volta' : 'volta a andar')
  s += `</svg>`
  return s
}

/**
 * CONCEITO CASAS: as doze casas numeradas, sem planetas. É o desenho do que o
 * texto explica — o espaço dividido em doze, não o céu de hoje.
 */
export function diagramaCasas() {
  let s = moldura('as doze casas')
  for (let i = 0; i < 12; i++) {
    const a = ponto(i * 30, ARO_INTERNO)
    const b = ponto(i * 30, ARO_EXTERNO)
    s += `<line x1="${a.x.toFixed(1)}" y1="${a.y.toFixed(1)}" x2="${b.x.toFixed(1)}" y2="${b.y.toFixed(1)}" stroke="${ARO}" stroke-width="1" opacity="0.7"/>`
    const n = ponto(i * 30 + 15, (ARO_INTERNO + ARO_EXTERNO) / 2)
    s += `<text x="${n.x.toFixed(1)}" y="${n.y.toFixed(1)}" font-size="18" fill="${OURO_CLARO}" text-anchor="middle" dominant-baseline="central" font-family="serif">${i + 1}</text>`
  }
  s += `<circle cx="${CX}" cy="${CY}" r="3" fill="${SLATE}"/>`
  s += rotuloCentral('doze áreas da vida')
  s += `</svg>`
  return s
}

/** CONCEITO ASPECTOS: os quatro ângulos maiores, marcados no círculo. */
export function diagramaAngulos() {
  const marcas = [
    { ang: 0, nome: 'conjunção', g: 0 },
    { ang: 60, nome: 'sextil', g: 60 },
    { ang: 90, nome: 'quadratura', g: 90 },
    { ang: 120, nome: 'trígono', g: 120 },
    { ang: 180, nome: 'oposição', g: 180 },
  ]
  let s = moldura('os ângulos entre planetas')
  // um ponto fixo no topo (o primeiro planeta) e um ponto em cada ângulo maior
  const pTopo = ponto(0, RAIO)
  s += `<circle cx="${pTopo.x.toFixed(1)}" cy="${pTopo.y.toFixed(1)}" r="7" fill="${OURO_CLARO}"/>`
  for (const m of marcas) {
    if (m.ang === 0) continue
    const p = ponto(m.ang, RAIO)
    s += arco(0, m.ang, OURO, 1.4, 0.3, '2 5')
    s += `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="5.5" fill="${OURO}"/>`
    // o rótulo do ângulo só nos de cima, para não colidir com o texto central
    if (m.ang <= 90) {
      const rot = ponto(m.ang, ARO_EXTERNO + 12)
      s += `<text x="${rot.x.toFixed(1)}" y="${rot.y.toFixed(1)}" font-size="12" fill="${SLATE}" text-anchor="middle" dominant-baseline="central">${m.g}°</text>`
    }
  }
  s += `<circle cx="${CX}" cy="${CY}" r="3" fill="${SLATE}"/>`
  s += rotuloCentral('o ângulo é o que conta')
  s += `</svg>`
  return s
}

/**
 * A figura do assunto, ou `null` para cair na roda do céu.
 *
 * @param {object} assunto  de `assuntoDoDia`/marcação
 * @param {object} peca     de `pecaDoAssunto` (tem corpo, signo, etc.)
 */
export function diagramaDoAssunto(assunto, peca) {
  if (!assunto) return null
  switch (assunto.tipo) {
    case 'fase':
    case 'eclipse':
      return diagramaFase({ fase: assunto.fase, luminar: peca?.corpo || 'Moon' })
    case 'aspecto':
      return diagramaAspecto({
        agente: assunto.aspecto.agente, alvo: assunto.aspecto.alvo,
        angulo: assunto.aspecto.angulo ?? 0, destaque: assunto.aspecto.agente,
      })
    case 'ingresso':
      return diagramaIngresso({ corpo: assunto.corpo, signo: assunto.signo, signoAnterior: signoAnterior(assunto.signo) })
    case 'retrogrado':
    case 'direto':
      return diagramaMovimento({ corpo: assunto.corpo, tipo: assunto.tipo })
    case 'conceito':
      if (assunto.chave === 'casas' || assunto.chave === 'casa12' || assunto.chave === 'meioDoCeu' || assunto.chave === 'ascendente') return diagramaCasas()
      if (assunto.chave === 'aspectos') return diagramaAngulos()
      return null
    default:
      return null
  }
}

/** O signo anterior na roda, para o ingresso mostrar de onde o planeta veio. */
function signoAnterior(signo) {
  const i = ORDEM.indexOf(signo)
  return i > 0 ? ORDEM[(i + 11) % 12] : ORDEM[11]
}
