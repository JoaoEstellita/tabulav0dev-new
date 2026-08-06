/**
 * Carta do céu do dia: a roda inteira, com os doze signos, os dez corpos nas
 * posições reais e todos os aspectos maiores desenhados entre eles.
 *
 * O card diário mostra UM encontro, o mais forte. Esta peça mostra o céu
 * completo — serve para o post que quer impressionar, e é o que os perfis
 * grandes de astrologia publicam, só que aqui os graus são calculados, não
 * ilustrados.
 *
 * Convenção da roda: 0° de Áries à esquerda, signos correndo em sentido
 * anti-horário, como em carta astrológica de verdade.
 */
import { SIGNOS_INFO } from './ceu.mjs'

const VOID = '#070A18'
const VOID_2 = '#0D1229'
const VELLUM = '#EDE6D8'
const BRONZE = '#C9A227'
const SLATE = '#4A5372'
const TRACO = '#2A3050'

/** Aspecto harmônico puxa para o frio; tenso, para o quente. Convenção antiga. */
const COR_HARMONICO = '#4ECDC4'
const COR_TENSO = '#D9694A'

/** Cores de elemento vindas da paleta das áreas da vida do app. */
const COR_ELEMENTO = {
  fogo: '#FF9F40',
  terra: '#96E6A1',
  ar: '#60A5FA',
  agua: '#B19CD9',
}

export const CX = 500
export const CY = 500
export const R_SIGNO_FORA = 468
export const R_SIGNO_DENTRO = 396
export const R_PLANETA = 336
export const R_ASPECTO = 286

export const CORES_CARTA = {
  VOID, VOID_2, VELLUM, BRONZE, SLATE, TRACO,
  COR_HARMONICO, COR_TENSO, COR_ELEMENTO,
}

/** Raio do disco de cada corpo. Menores que no card diário: aqui são dez. */
export const RAIO_CORPO = {
  Sun: 21, Moon: 18, Mercury: 13, Venus: 16, Mars: 15,
  Jupiter: 22, Saturn: 20, Uranus: 16, Neptune: 16, Pluto: 12,
}

/**
 * Longitude eclíptica para ponto na tela.
 *
 * 180 + L coloca 0° de Áries à esquerda e faz os signos correrem no sentido
 * anti-horário; o seno é subtraído porque em SVG o Y cresce para baixo.
 */
export function ponto(longitude, raio) {
  const t = ((180 + longitude) * Math.PI) / 180
  return { x: CX + raio * Math.cos(t), y: CY - raio * Math.sin(t) }
}

export const arredonda = (n) => Math.round(n * 100) / 100

/** Setor de 30° de um signo, como caminho de anel. */
export function setorSigno(indice) {
  const l0 = indice * 30
  const l1 = l0 + 30
  const a = ponto(l0, R_SIGNO_FORA)
  const b = ponto(l1, R_SIGNO_FORA)
  const c = ponto(l1, R_SIGNO_DENTRO)
  const d = ponto(l0, R_SIGNO_DENTRO)
  // sweep 0: no sentido em que a longitude cresce, que na tela é anti-horário
  return `M ${arredonda(a.x)} ${arredonda(a.y)}
          A ${R_SIGNO_FORA} ${R_SIGNO_FORA} 0 0 0 ${arredonda(b.x)} ${arredonda(b.y)}
          L ${arredonda(c.x)} ${arredonda(c.y)}
          A ${R_SIGNO_DENTRO} ${R_SIGNO_DENTRO} 0 0 1 ${arredonda(d.x)} ${arredonda(d.y)} Z`
}

/**
 * Afasta radialmente os corpos que ficariam sobrepostos.
 *
 * Conjunção é comum e junta dois ou três corpos no mesmo grau; desenhados no
 * mesmo raio eles viram um borrão. Agrupa quem está a menos de 9° e escalona o
 * grupo para dentro, do mais lento para o mais rápido.
 */
export function distribuir(corpos) {
  const ordenados = [...corpos].sort((a, b) => a.longitude - b.longitude)
  const grupos = []

  for (const c of ordenados) {
    const ultimo = grupos[grupos.length - 1]
    const anterior = ultimo && ultimo[ultimo.length - 1]
    let perto = false
    if (anterior) {
      const d = Math.abs(c.longitude - anterior.longitude)
      perto = Math.min(d, 360 - d) < 9
    }
    if (perto) ultimo.push(c)
    else grupos.push([c])
  }

  // o primeiro e o último grupo podem se tocar através de 0° de Áries
  if (grupos.length > 1) {
    const primeiro = grupos[0][0]
    const ultimo = grupos[grupos.length - 1][grupos[grupos.length - 1].length - 1]
    const d = Math.abs(primeiro.longitude - ultimo.longitude)
    if (Math.min(d, 360 - d) < 9) {
      grupos[0] = grupos.pop().concat(grupos[0])
    }
  }

  const saida = []
  for (const grupo of grupos) {
    grupo.forEach((c, i) => {
      saida.push({ ...c, raio: R_PLANETA - i * 46 })
    })
  }
  return saida
}

/**
 * Imagem real do corpo, quando há uma pasta de planetas disponível.
 *
 * Os desenhos abaixo distinguem os corpos por forma e tamanho, mas ninguém
 * reconhece Júpiter num círculo com três riscos: era por isso que cada um
 * precisava de rótulo escrito ao lado. As imagens de `public/planets` resolvem
 * na hora, e o Chrome as carrega por file:// sem reclamar.
 */
export function imagemCorpo(nome, dirPlanetas) {
  const r = RAIO_CORPO[nome]
  const lado = r * 2.9
  return `<image href="file:///${dirPlanetas}/${nome}.png"
                 x="${arredonda(-lado / 2)}" y="${arredonda(-lado / 2)}"
                 width="${arredonda(lado)}" height="${arredonda(lado)}"
                 preserveAspectRatio="xMidYMid meet"/>`
}

/** Desenho vetorial, usado quando não há imagem à mão. */
export function desenhoCorpo(nome) {
  const r = RAIO_CORPO[nome]
  switch (nome) {
    case 'Sun':
      return `<circle r="${r}" fill="${VELLUM}"/><circle r="5" fill="${VOID_2}"/>`
    case 'Moon':
      return `<mask id="m-lua"><circle r="${r}" fill="#fff"/><circle cx="${r * 0.6}" cy="${-r * 0.3}" r="${r * 0.9}" fill="#000"/></mask>
              <circle r="${r}" fill="${VELLUM}" mask="url(#m-lua)"/>
              <circle r="${r}" fill="none" stroke="${SLATE}" stroke-width="1"/>`
    case 'Mercury':
      return `<circle r="${r}" fill="${VOID_2}" stroke="${VELLUM}" stroke-width="1.6"/>
              <circle r="${r * 0.4}" fill="${VELLUM}" opacity="0.45"/>`
    case 'Venus':
      return `<circle r="${r}" fill="${VOID_2}" stroke="${VELLUM}" stroke-width="1.8"/>
              <circle r="${r * 0.45}" fill="${VELLUM}" opacity="0.5"/>`
    case 'Mars':
      return `<circle r="${r}" fill="${VOID_2}" stroke="${BRONZE}" stroke-width="1.8"/>
              <path d="M ${-r * 0.5} ${-r * 0.4} A ${r * 0.6} ${r * 0.6} 0 0 1 ${r * 0.5} ${-r * 0.4}"
                    fill="none" stroke="${BRONZE}" stroke-width="1.3" opacity="0.65"/>`
    case 'Jupiter':
      return `<clipPath id="c-jup"><circle r="${r}"/></clipPath>
              <circle r="${r}" fill="${VOID_2}" stroke="${BRONZE}" stroke-width="1.8"/>
              <g clip-path="url(#c-jup)" stroke="${BRONZE}" stroke-width="1.3" opacity="0.55">
                <line x1="${-r - 2}" y1="${-r * 0.42}" x2="${r + 2}" y2="${-r * 0.42}"/>
                <line x1="${-r - 2}" y1="0" x2="${r + 2}" y2="0"/>
                <line x1="${-r - 2}" y1="${r * 0.42}" x2="${r + 2}" y2="${r * 0.42}"/>
              </g>`
    case 'Saturn':
      return `<circle r="${r}" fill="${VOID_2}" stroke="${BRONZE}" stroke-width="1.8"/>
              <ellipse rx="${r * 1.6}" ry="${r * 0.4}" fill="none" stroke="${BRONZE}"
                       stroke-width="1.7" transform="rotate(-18)"/>`
    case 'Uranus':
      return `<circle r="${r}" fill="${VOID_2}" stroke="${VELLUM}" stroke-width="1.6"/>
              <ellipse rx="${r * 1.45}" ry="${r * 0.3}" fill="none" stroke="${VELLUM}"
                       stroke-width="1.4" opacity="0.75" transform="rotate(78)"/>`
    case 'Neptune':
      return `<clipPath id="c-net"><circle r="${r}"/></clipPath>
              <circle r="${r}" fill="${VOID_2}" stroke="${VELLUM}" stroke-width="1.6"/>
              <g clip-path="url(#c-net)" stroke="${VELLUM}" stroke-width="1.2" opacity="0.5">
                <line x1="${-r - 2}" y1="${-r * 0.32}" x2="${r + 2}" y2="${-r * 0.32}"/>
                <line x1="${-r - 2}" y1="${r * 0.34}" x2="${r + 2}" y2="${r * 0.34}"/>
              </g>`
    default:
      return `<circle r="${r}" fill="${VOID_2}" stroke="${VELLUM}" stroke-width="1.5"/>
              <circle r="${r * 0.32}" fill="${VELLUM}" opacity="0.45"/>`
  }
}

export function anelDosSignos() {
  const setores = SIGNOS_INFO.map((s, i) => {
    const cor = COR_ELEMENTO[s.elemento]
    return `<path d="${setorSigno(i)}" fill="${cor}" opacity="0.07"/>`
  }).join('')

  const divisoes = SIGNOS_INFO.map((_, i) => {
    const a = ponto(i * 30, R_SIGNO_FORA)
    const b = ponto(i * 30, R_SIGNO_DENTRO - 14)
    return `<line x1="${arredonda(a.x)}" y1="${arredonda(a.y)}" x2="${arredonda(b.x)}" y2="${arredonda(b.y)}"
                  stroke="${TRACO}" stroke-width="1.4"/>`
  }).join('')

  const rotulos = SIGNOS_INFO.map((s, i) => {
    const p = ponto(i * 30 + 15, (R_SIGNO_FORA + R_SIGNO_DENTRO) / 2)
    return `<text x="${arredonda(p.x)}" y="${arredonda(p.y + 7)}" text-anchor="middle"
                  fill="${COR_ELEMENTO[s.elemento]}" opacity="0.92"
                  font-family="ui-monospace, Consolas, 'DejaVu Sans Mono', monospace"
                  font-size="21" letter-spacing="2.4">${s.abrev}</text>`
  }).join('')

  // graduação de 10 em 10 graus, virada para dentro
  const ticks = []
  for (let g = 0; g < 360; g += 10) {
    if (g % 30 === 0) continue
    const a = ponto(g, R_SIGNO_DENTRO)
    const b = ponto(g, R_SIGNO_DENTRO - (g % 5 === 0 ? 11 : 7))
    ticks.push(`<line x1="${arredonda(a.x)}" y1="${arredonda(a.y)}" x2="${arredonda(b.x)}" y2="${arredonda(b.y)}"
                      stroke="${TRACO}" stroke-width="1"/>`)
  }

  return `
    <circle cx="${CX}" cy="${CY}" r="${R_SIGNO_FORA}" fill="none" stroke="${TRACO}" stroke-width="1.6"/>
    <circle cx="${CX}" cy="${CY}" r="${R_SIGNO_DENTRO}" fill="none" stroke="${TRACO}" stroke-width="1.4"/>
    <circle cx="${CX}" cy="${CY}" r="${R_ASPECTO}" fill="none" stroke="#1B2035" stroke-width="1"/>
    ${setores}${divisoes}${ticks.join('')}${rotulos}`
}

function linhasDeAspecto(aspectos, porNome) {
  return aspectos
    .filter((a) => a.aspecto !== 'conjuncao')
    .map((a) => {
      const p1 = porNome[a.agente]
      const p2 = porNome[a.alvo]
      if (!p1 || !p2) return ''
      const q1 = ponto(p1.longitude, R_ASPECTO)
      const q2 = ponto(p2.longitude, R_ASPECTO)
      const tenso = a.aspecto === 'quadratura' || a.aspecto === 'oposicao'
      const cor = tenso ? COR_TENSO : COR_HARMONICO
      // aspecto mais exato aparece mais forte: a leitura segue a precisão
      const forca = Math.max(0.22, 1 - a.orbe / (a.orbeMax || 6))
      return `<line x1="${arredonda(q1.x)}" y1="${arredonda(q1.y)}" x2="${arredonda(q2.x)}" y2="${arredonda(q2.y)}"
                    stroke="${cor}" stroke-width="${arredonda(1 + forca * 1.6)}"
                    opacity="${arredonda(0.2 + forca * 0.55)}"
                    ${a.aspecto === 'sextil' ? 'stroke-dasharray="7 6"' : ''}/>`
    })
    .join('')
}

/**
 * Corpos na roda, sem rótulo de texto ao lado.
 *
 * A primeira versão escrevia nome e grau junto de cada corpo, e o texto, que é
 * horizontal, invadia o anel dos signos nas laterais: "SATURNO" caía em cima de
 * "ARI". Cartas profissionais resolvem assim — a roda fica limpa e as posições
 * vão para uma grade legível embaixo.
 *
 * A marca de grau no anel preserva o que o rótulo dava: onde exatamente o corpo
 * está.
 */
function corposNaRoda(distribuidos, dirPlanetas) {
  return distribuidos.map((c) => {
    const p = ponto(c.longitude, c.raio)
    const r = RAIO_CORPO[c.nome]

    // risco no anel interno, apontando o grau exato
    const t1 = ponto(c.longitude, R_SIGNO_DENTRO)
    const t2 = ponto(c.longitude, R_SIGNO_DENTRO - 22)
    const marca = `<line x1="${arredonda(t1.x)}" y1="${arredonda(t1.y)}" x2="${arredonda(t2.x)}" y2="${arredonda(t2.y)}"
                         stroke="${VELLUM}" stroke-width="1.6" opacity="0.5"/>`

    // corpo empurrado para dentro por conjunção ganha haste até a marca
    const haste = c.raio < R_PLANETA
      ? (() => {
          const a = ponto(c.longitude, c.raio + r + 3)
          const b = ponto(c.longitude, R_SIGNO_DENTRO - 24)
          return `<line x1="${arredonda(a.x)}" y1="${arredonda(a.y)}" x2="${arredonda(b.x)}" y2="${arredonda(b.y)}"
                        stroke="${SLATE}" stroke-width="1" opacity="0.55" stroke-dasharray="3 4"/>`
        })()
      : ''

    return `${marca}${haste}
      <g transform="translate(${arredonda(p.x)} ${arredonda(p.y)})">${dirPlanetas ? imagemCorpo(c.nome, dirPlanetas) : desenhoCorpo(c.nome)}</g>`
  }).join('')
}

/** Miniatura do corpo para a grade de posições. */
function miniatura(nome, dirPlanetas) {
  return `<svg viewBox="-26 -26 52 52" width="26" height="26" aria-hidden="true">
            <g transform="scale(0.94)">${dirPlanetas ? imagemCorpo(nome, dirPlanetas) : desenhoCorpo(nome)}</g>
          </svg>`
}

/** Grade com as dez posições: é aqui que se lê grau e signo. */
function gradeDePosicoes(corpos, dirPlanetas) {
  return corpos.map((c) => `
    <div class="pos">
      ${miniatura(c.nome, dirPlanetas)}
      <span class="pn">${c.nomePt}${c.retrogrado ? '<i>℞</i>' : ''}</span>
      <span class="pg">${c.grau}° ${c.signo}</span>
    </div>`).join('')
}

/**
 * @param {object} dados mapa do céu + textos do dia
 * @returns {string} HTML completo, pronto para o Chrome fotografar
 */
export function montarCarta(dados) {
  const largura = 1080
  const altura = 1350

  const distribuidos = distribuir(dados.corpos)
  const porNome = Object.fromEntries(dados.corpos.map((c) => [c.nome, c]))
  const temRetrogrado = dados.corpos.some((c) => c.retrogrado)

  return `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: ${largura}px; height: ${altura}px; overflow: hidden; background: ${VOID}; }

  .carta {
    position: relative; width: ${largura}px; height: ${altura}px;
    container-type: inline-size;
    background: ${VOID}; color: ${VELLUM}; overflow: hidden;
    --area: ${dados.cor};
  }
  canvas { position: absolute; inset: 0; width: 100%; height: 100%; }

  .brilho {
    position: absolute; left: 50%; bottom: -26cqw;
    width: 132cqw; height: 86cqw; transform: translateX(-50%);
    background: radial-gradient(ellipse at center, var(--area) 0%,
      color-mix(in srgb, var(--area) 26%, transparent) 34%, rgba(7,10,24,0) 68%);
    opacity: 0.34;
  }

  .conteudo {
    position: absolute; inset: 0; z-index: 2;
    padding: 5.2cqw 5.4cqw 6.2cqw;
    display: flex; flex-direction: column;
  }

  .alto {
    font-family: ui-monospace, 'Cascadia Mono', Consolas, 'DejaVu Sans Mono', monospace;
    font-size: 2.05cqw; letter-spacing: 0.24em; text-transform: uppercase;
    color: ${BRONZE};
    display: flex; justify-content: space-between; align-items: baseline;
  }
  .alto span:last-child { color: ${SLATE}; }

  /* a roda encolheu para abrir espaço à leitura curada, que é o que faltava */
  .roda { display: grid; place-items: center; margin: 0.2cqw 0 0; }
  .roda svg { width: 56%; height: auto; display: block; }

  .legenda {
    display: flex; gap: 3.2cqw; justify-content: center; align-items: center;
    font-family: ui-monospace, 'Cascadia Mono', Consolas, 'DejaVu Sans Mono', monospace;
    font-size: 2cqw; letter-spacing: 0.1em; text-transform: uppercase;
    color: ${SLATE};
    margin-top: 0.4cqw;
  }
  .legenda i { display: inline-block; width: 3.2cqw; height: 0.24cqw; vertical-align: middle; margin-right: 0.8cqw; }

  /* as posições ficam aqui, não ao redor da roda: texto horizontal em volta de
     um círculo invade o anel dos signos nas laterais */
  .posicoes {
    display: grid; grid-template-columns: repeat(2, 1fr);
    gap: 0.9cqw 3.4cqw;
    margin-top: 2.6cqw;
  }
  .pos {
    display: flex; align-items: center; gap: 1.4cqw;
    font-family: ui-monospace, 'Cascadia Mono', Consolas, 'DejaVu Sans Mono', monospace;
    font-size: 2.3cqw;
  }
  .pos svg { flex-shrink: 0; width: 2.9cqw; height: 2.9cqw; }
  .pn { color: ${VELLUM}; letter-spacing: 0.04em; }
  .pn i { font-style: normal; color: ${BRONZE}; margin-left: 0.5cqw; }
  .pg { color: ${SLATE}; margin-left: auto; letter-spacing: 0.02em; font-variant-numeric: tabular-nums; }

  .destaque {
    border-top: 0.11cqw solid rgba(237,230,216,0.16);
    padding-top: 2.6cqw;
    margin-top: auto;
  }
  .destaque .rot {
    font-family: ui-monospace, 'Cascadia Mono', Consolas, 'DejaVu Sans Mono', monospace;
    font-size: 2.15cqw; letter-spacing: 0.14em; text-transform: uppercase;
    color: ${SLATE}; margin-bottom: 1.3cqw;
  }
  .destaque .rot b { color: ${BRONZE}; font-weight: 400; }
  .destaque h1 {
    font-family: 'Palatino Linotype', Palatino, 'Book Antiqua', 'P052', 'URW Palladio L', Georgia, serif;
    font-size: 6.4cqw; line-height: 1.05; font-weight: 400; letter-spacing: -0.012em;
  }
  /* a leitura curada do catálogo: é o que dá conteúdo à peça. Sem ela o card
     ficava com um título de quatro palavras e muito espaço vazio. */
  .destaque .leitura {
    font-family: 'Palatino Linotype', Palatino, 'Book Antiqua', 'P052', 'URW Palladio L', Georgia, serif;
    font-size: 2.85cqw; line-height: 1.4; color: #CFC9BD;
    margin-top: 1.6cqw;
  }
  /* eventos secundários: uma linha cada, quando o dia tem mais de um */
  .destaque .tambem {
    display: flex; flex-direction: column; gap: 0.7cqw;
    margin-top: 1.6cqw;
  }
  .destaque .tambem span {
    font-family: ui-monospace, 'Cascadia Mono', Consolas, 'DejaVu Sans Mono', monospace;
    font-size: 2.05cqw; color: ${BRONZE}; opacity: 0.88;
    letter-spacing: 0.02em;
  }
  .destaque p.aforismo {
    font-family: 'Palatino Linotype', Palatino, 'Book Antiqua', 'P052', 'URW Palladio L', Georgia, serif;
    font-style: italic; font-size: 2.85cqw; line-height: 1.34;
    color: ${BRONZE}; margin-top: 1.4cqw; opacity: 0.9;
  }

  .rodape {
    margin-top: 3cqw; display: flex; align-items: center; justify-content: space-between;
    font-family: ui-monospace, 'Cascadia Mono', Consolas, 'DejaVu Sans Mono', monospace;
    font-size: 1.95cqw; letter-spacing: 0.13em; text-transform: uppercase;
  }
  .chip { color: var(--area); display: inline-flex; align-items: center; gap: 1.2cqw; }
  .chip::before { content: ""; width: 1.4cqw; height: 1.4cqw; border-radius: 50%; background: var(--area); }
  .arroba { color: ${SLATE}; letter-spacing: 0.1em; }
</style></head>
<body>
  <div class="carta">
    <canvas id="ceu" width="${largura}" height="${altura}"></canvas>
    <div class="brilho"></div>

    <div class="conteudo">
      <div class="alto">
        <span>Carta do céu</span>
        <span>${dados.dataRotulo}</span>
      </div>

      <div class="roda">
        <svg viewBox="0 0 1000 1000" role="img" aria-label="Carta do céu com os doze signos, os dez corpos e os aspectos do dia">
          ${anelDosSignos()}
          ${linhasDeAspecto(dados.aspectos, porNome)}
          ${corposNaRoda(distribuidos, dados.dirPlanetas)}
          <circle cx="${CX}" cy="${CY}" r="3.5" fill="${SLATE}"/>
        </svg>
      </div>

      <div class="legenda">
        <span><i style="background:${COR_HARMONICO}"></i>Harmônico</span>
        <span><i style="background:${COR_TENSO}"></i>Tenso</span>
        ${temRetrogrado ? '<span>℞ Retrógrado</span>' : ''}
      </div>

      <div class="posicoes">${gradeDePosicoes(dados.corpos, dados.dirPlanetas)}</div>

      <div class="destaque">
        <div class="rot">${dados.subtitulo || `${dados.aspectoRotulo} · ${dados.agentePt} e ${dados.alvoPt} · orbe <b>${dados.orbeFormatado}</b>`}</div>
        <h1>${dados.titulo}</h1>
        ${dados.textoEvento
          ? `<p class="leitura">${dados.textoEvento}</p>`
          : dados.leitura ? `<p class="leitura">${dados.leitura}</p>` : ''}
        ${(dados.eventos || []).length
          ? `<div class="tambem">${dados.eventos.map((e) => `<span>${e.__linha || ''}</span>`).join('')}</div>`
          : `<p class="aforismo">${dados.aforismo}</p>`}
      </div>

      <div class="rodape">
        <span class="chip">${dados.signoEvento || dados.dataExtenso || 'Céu de hoje'}</span>
        <span class="arroba">@tabula_estelar</span>
      </div>
    </div>
  </div>

<script>
  (function () {
    var c = document.getElementById('ceu');
    var g = c.getContext('2d');
    var W = c.width, H = c.height;
    g.fillStyle = '${VOID}'; g.fillRect(0, 0, W, H);
    var seed = ${dados.semente};
    function rnd() { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; }
    var n = Math.round(W * H / 2600);
    for (var i = 0; i < n; i++) {
      var x = rnd() * W, y = rnd() * H;
      var r = rnd() * 1.7 + 0.3, a = rnd() * 0.5 + 0.06;
      g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2);
      g.fillStyle = 'rgba(237,230,216,' + a.toFixed(3) + ')'; g.fill();
    }
    for (var j = 0; j < 7; j++) {
      var bx = rnd() * W, by = rnd() * H;
      var gr = g.createRadialGradient(bx, by, 0, bx, by, 34);
      gr.addColorStop(0, 'rgba(237,230,216,0.6)');
      gr.addColorStop(0.2, 'rgba(201,162,39,0.15)');
      gr.addColorStop(1, 'rgba(7,10,24,0)');
      g.fillStyle = gr; g.fillRect(bx - 34, by - 34, 68, 68);
    }
  })();
</script>
</body></html>`
}
