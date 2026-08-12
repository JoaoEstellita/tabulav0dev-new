/**
 * A roda do céu, enxuta, para caber dentro da tela de um celular desenhado.
 *
 * `template.mjs` tem uma roda muito mais elaborada, com Júpiter listrado e o
 * anel de Saturno, feita para ocupar meio quadro de 1080px. Aqui ela aparece
 * dentro de um mockup de app, com uns 300px de lado: as formas não se leem
 * nesse tamanho e o que identifica cada corpo é a cor e o glifo.
 *
 * As cores são as mesmas de `template.mjs`, para as duas peças combinarem.
 *
 * As POSIÇÕES são reais: vêm de `mapaDoCeu`, o mesmo cálculo do app. Um mockup
 * pode simplificar o desenho, não os dados.
 */

/** Mesma paleta de `template.mjs`: dessaturada, para assentar no campo estelar. */
export const COR_CORPO = {
  Sun: '#F2C14E',
  Moon: '#D8D3E0',
  Mercury: '#A8B0C0',
  Venus: '#E6C9A8',
  Mars: '#C8705A',
  Jupiter: '#D8A860',
  Saturn: '#C4A47C',
  Uranus: '#84BAC4',
  Neptune: '#7290C4',
  Pluto: '#9A8FA8',
}

/** Glifo de cada corpo, em texto: no tamanho da tela, é o que se lê. */
export const GLIFO_CORPO = {
  Sun: '☉', Moon: '☽', Mercury: '☿', Venus: '♀', Mars: '♂',
  Jupiter: '♃', Saturn: '♄', Uranus: '♅', Neptune: '♆', Pluto: '♇',
}

export const GLIFO_SIGNO = {
  'Áries': '♈', 'Touro': '♉', 'Gêmeos': '♊', 'Câncer': '♋',
  'Leão': '♌', 'Virgem': '♍', 'Libra': '♎', 'Escorpião': '♏',
  'Sagitário': '♐', 'Capricórnio': '♑', 'Aquário': '♒', 'Peixes': '♓',
}

const rad = (g) => (g * Math.PI) / 180

/** Ponto na roda: 0° no topo, sentido horário, como em `template.mjs`. */
export function pontoNaRoda(anguloGraus, raio, cx, cy) {
  const r = rad(anguloGraus)
  return { x: cx + raio * Math.sin(r), y: cy - raio * Math.cos(r) }
}

/**
 * A roda como SVG.
 *
 * @param {object[]} corpos  de `mapaDoCeu().corpos`: `{nome, longitude, signo}`
 * @param {number} lado  o SVG é quadrado
 */
export function svgDaRoda(corpos, lado = 300) {
  const cx = lado / 2
  const cy = lado / 2
  const aro = lado * 0.44
  const aroInterno = lado * 0.33
  const raioSigno = lado * 0.395
  const raioCorpo = lado * 0.255

  // as doze divisões de signo: é o que faz a roda ser lida como zodíaco
  const divisoes = Array.from({ length: 12 }, (_, i) => {
    const a = pontoNaRoda(i * 30, aro, cx, cy)
    const b = pontoNaRoda(i * 30, aroInterno, cx, cy)
    return `<line x1="${a.x.toFixed(1)}" y1="${a.y.toFixed(1)}" x2="${b.x.toFixed(1)}" y2="${b.y.toFixed(1)}" stroke="rgba(255,255,255,0.14)" stroke-width="1"/>`
  }).join('')

  const glifosDeSigno = Array.from({ length: 12 }, (_, i) => {
    const p = pontoNaRoda(i * 30 + 15, raioSigno, cx, cy)
    const nome = Object.keys(GLIFO_SIGNO)[i]
    return `<text x="${p.x.toFixed(1)}" y="${p.y.toFixed(1)}" fill="rgba(255,255,255,0.45)" font-size="${(lado * 0.052).toFixed(1)}" text-anchor="middle" dominant-baseline="central">${GLIFO_SIGNO[nome]}</text>`
  }).join('')

  const planetas = (corpos || []).map((c) => {
    const cor = COR_CORPO[c.nome]
    if (!cor) return ''
    const p = pontoNaRoda(c.longitude, raioCorpo, cx, cy)
    return `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${(lado * 0.038).toFixed(1)}" fill="rgba(15,15,35,0.85)" stroke="${cor}" stroke-width="1.4"/>` +
      `<text x="${p.x.toFixed(1)}" y="${p.y.toFixed(1)}" fill="${cor}" font-size="${(lado * 0.05).toFixed(1)}" text-anchor="middle" dominant-baseline="central">${GLIFO_CORPO[c.nome]}</text>`
  }).join('')

  return `<svg viewBox="0 0 ${lado} ${lado}" width="100%" height="100%" role="img" aria-label="roda do mapa">
  <circle cx="${cx}" cy="${cy}" r="${aro}" fill="none" stroke="rgba(255,255,255,0.22)" stroke-width="1.2"/>
  <circle cx="${cx}" cy="${cy}" r="${aroInterno}" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
  <circle cx="${cx}" cy="${cy}" r="${(lado * 0.16).toFixed(1)}" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
  ${divisoes}${glifosDeSigno}${planetas}
</svg>`
}
