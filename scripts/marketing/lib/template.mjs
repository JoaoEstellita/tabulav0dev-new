/**
 * Template do card diário — HTML autocontido, renderizado pelo Chrome headless.
 *
 * O design vive aqui em HTML/CSS, e não em código de desenho em canvas, para
 * que ajustar o card seja ajustar CSS. O screenshot do Chrome garante que o
 * publicado é exatamente o que se vê no navegador ao abrir o arquivo.
 */

const VOID = '#070A18'
const VOID_2 = '#0D1229'
const VELLUM = '#EDE6D8'
const BRONZE = '#C9A227'
const SLATE = '#4A5372'

const RAIO_RODA = 108
const CX = 220
const CY = 210
const ARO_EXTERNO = 140
const ARO_INTERNO = 78

/** Raio do disco de cada corpo — a diferença de tamanho é o que os distingue. */
const RAIO_CORPO = {
  Sun: 22, Moon: 18, Mercury: 14, Venus: 19, Mars: 16,
  Jupiter: 27, Saturn: 25, Uranus: 21, Neptune: 20, Pluto: 13,
}

const grausParaRad = (g) => (g * Math.PI) / 180

/** Ponto na roda: 0° é o topo, sentido horário. */
function pontoNaRoda(anguloGraus, raio = RAIO_RODA) {
  const r = grausParaRad(anguloGraus)
  return { x: CX + raio * Math.sin(r), y: CY - raio * Math.cos(r) }
}

/**
 * Desenho de cada corpo. Monocromático de propósito: a paleta é bronze sobre
 * pergaminho, então os corpos se distinguem por forma e tamanho, não por cor.
 */
function desenhoCorpo(nome, id) {
  const r = RAIO_CORPO[nome]

  switch (nome) {
    case 'Sun':
      return `<circle r="${r}" fill="${VELLUM}"/><circle r="5.5" fill="${VOID_2}"/>`

    case 'Moon':
      return `
        <mask id="lua-${id}">
          <circle r="${r}" fill="#fff"/>
          <circle cx="${r * 0.62}" cy="${-r * 0.28}" r="${r * 0.92}" fill="#000"/>
        </mask>
        <circle r="${r}" fill="${VELLUM}" mask="url(#lua-${id})"/>
        <circle r="${r}" fill="none" stroke="${SLATE}" stroke-width="1"/>`

    case 'Mercury':
      return `<circle r="${r}" fill="${VOID_2}" stroke="${VELLUM}" stroke-width="1.6"/>
              <circle r="${r * 0.38}" fill="${VELLUM}" opacity="0.45"/>`

    case 'Venus':
      return `<circle r="${r}" fill="${VOID_2}" stroke="${VELLUM}" stroke-width="1.8"/>
              <circle r="${r * 0.44}" fill="${VELLUM}" opacity="0.45"/>`

    case 'Mars':
      return `<circle r="${r}" fill="${VOID_2}" stroke="${BRONZE}" stroke-width="1.8"/>
              <path d="M ${-r * 0.5} ${-r * 0.42} A ${r * 0.6} ${r * 0.6} 0 0 1 ${r * 0.5} ${-r * 0.42}"
                    fill="none" stroke="${BRONZE}" stroke-width="1.3" opacity="0.6"/>`

    case 'Jupiter':
      return `
        <clipPath id="jup-${id}"><circle r="${r}"/></clipPath>
        <circle r="${r}" fill="${VOID_2}" stroke="${BRONZE}" stroke-width="1.8"/>
        <g clip-path="url(#jup-${id})" stroke="${BRONZE}" stroke-width="1.4" opacity="0.55">
          <line x1="${-r - 2}" y1="${-r * 0.4}" x2="${r + 2}" y2="${-r * 0.4}"/>
          <line x1="${-r - 2}" y1="0" x2="${r + 2}" y2="0"/>
          <line x1="${-r - 2}" y1="${r * 0.4}" x2="${r + 2}" y2="${r * 0.4}"/>
        </g>`

    case 'Saturn':
      return `<circle r="${r}" fill="${VOID_2}" stroke="${BRONZE}" stroke-width="1.8"/>
              <ellipse rx="${r * 1.55}" ry="${r * 0.38}" fill="none" stroke="${BRONZE}"
                       stroke-width="1.8" transform="rotate(-18)"/>`

    case 'Uranus':
      return `<circle r="${r}" fill="${VOID_2}" stroke="${VELLUM}" stroke-width="1.6"/>
              <ellipse rx="${r * 1.45}" ry="${r * 0.3}" fill="none" stroke="${VELLUM}"
                       stroke-width="1.5" opacity="0.75" transform="rotate(78)"/>`

    case 'Neptune':
      return `
        <clipPath id="net-${id}"><circle r="${r}"/></clipPath>
        <circle r="${r}" fill="${VOID_2}" stroke="${VELLUM}" stroke-width="1.6"/>
        <g clip-path="url(#net-${id})" stroke="${VELLUM}" stroke-width="1.3" opacity="0.5">
          <line x1="${-r - 2}" y1="${-r * 0.3}" x2="${r + 2}" y2="${-r * 0.3}"/>
          <line x1="${-r - 2}" y1="${r * 0.32}" x2="${r + 2}" y2="${r * 0.32}"/>
        </g>`

    case 'Pluto':
    default:
      return `<circle r="${r}" fill="${VOID_2}" stroke="${VELLUM}" stroke-width="1.5"/>
              <circle r="${r * 0.3}" fill="${VELLUM}" opacity="0.4"/>`
  }
}

/**
 * Nome do corpo e sua posição no signo, empilhados.
 *
 * `lado` decide para onde o bloco sai do disco. Na conjunção os corpos ficam
 * colados, e só as laterais sobram — em cima ou embaixo os dois rótulos se
 * atropelariam, e embaixo ainda haveria o colchete do 0°.
 *
 * @param {'acima'|'abaixo'|'esquerda'|'direita'} lado
 */
function rotuloCorpo(nome, posicao, lado, raio) {
  const lateral = lado === 'esquerda' || lado === 'direita'

  const ancora = lateral ? (lado === 'esquerda' ? 'end' : 'start') : 'middle'
  const x = lateral ? (lado === 'esquerda' ? -raio - 10 : raio + 10) : 0
  const y1 = lateral ? -4 : lado === 'acima' ? -raio - 30 : raio + 26
  const y2 = lateral ? 14 : lado === 'acima' ? -raio - 13 : raio + 43

  return `
    <text x="${x}" y="${y1}" text-anchor="${ancora}" fill="${VELLUM}" font-family="ui-monospace, Consolas, 'DejaVu Sans Mono', monospace" font-size="15" letter-spacing="2.5">${nome.toUpperCase()}</text>
    <text x="${x}" y="${y2}" text-anchor="${ancora}" fill="${SLATE}" font-family="ui-monospace, Consolas, 'DejaVu Sans Mono', monospace" font-size="12.5" letter-spacing="1.2">${posicao}</text>`
}

/**
 * O diagrama do aspecto. O agente fica no topo; o alvo, no ângulo do aspecto.
 * Conjunção é o caso especial: 0° não tem arco, os corpos ficam lado a lado.
 */
function diagrama(dados, id) {
  const { agente, alvo, agentePt, alvoPt, agentePos, alvoPos, angulo } = dados
  const rAgente = RAIO_CORPO[agente]
  const rAlvo = RAIO_CORPO[alvo]

  const conjuncao = angulo === 0
  const anguloAgente = conjuncao ? -16 : 0
  const anguloAlvo = conjuncao ? 16 : angulo
  const pAgente = pontoNaRoda(anguloAgente)
  const pAlvo = pontoNaRoda(anguloAlvo)

  // fora da conjunção o rótulo sai para fora da roda — para dentro cruzaria o
  // raio; na conjunção sai para as laterais, onde não disputa com o colchete
  const ladoAgente = conjuncao ? 'esquerda' : pAgente.y <= CY ? 'acima' : 'abaixo'
  const ladoAlvo = conjuncao ? 'direita' : pAlvo.y <= CY ? 'acima' : 'abaixo'

  let marcador
  if (conjuncao) {
    const yBase = pAgente.y + Math.max(rAgente, rAlvo) + 16
    marcador = `
      <path d="M ${pAgente.x} ${yBase} L ${pAgente.x} ${yBase + 10} L ${pAlvo.x} ${yBase + 10} L ${pAlvo.x} ${yBase}"
            fill="none" stroke="${BRONZE}" stroke-width="1.5" opacity="0.9"/>
      <text x="${CX}" y="${yBase + 32}" text-anchor="middle" fill="${BRONZE}"
            font-family="ui-monospace, Consolas, 'DejaVu Sans Mono', monospace" font-size="19" letter-spacing="1">0°</text>`
  } else {
    const a1 = pontoNaRoda(0, 56)
    const a2 = pontoNaRoda(angulo, 56)
    const meio = pontoNaRoda(angulo / 2, 78)
    marcador = `
      <path d="M ${a1.x} ${a1.y} A 56 56 0 ${angulo > 180 ? 1 : 0} 1 ${a2.x} ${a2.y}"
            fill="none" stroke="${BRONZE}" stroke-width="1.5" stroke-dasharray="3 4" opacity="0.9"/>
      <text x="${meio.x}" y="${meio.y + 6}" text-anchor="middle" fill="${BRONZE}"
            font-family="ui-monospace, Consolas, 'DejaVu Sans Mono', monospace" font-size="19" letter-spacing="1">${angulo}°</text>`
  }

  // o raio para na borda do disco: cruzar o planeta suja o desenho
  const raio = (ang, rCorpo) => {
    const fim = pontoNaRoda(ang, RAIO_RODA - rCorpo - 3)
    return `<line x1="${CX}" y1="${CY}" x2="${fim.x}" y2="${fim.y}" stroke="${SLATE}" stroke-width="1.6"/>`
  }
  const raios = raio(anguloAgente, rAgente) + raio(anguloAlvo, rAlvo)

  return `
<svg viewBox="0 0 440 430" role="img" aria-label="${agentePt} em ${dados.aspectoRotulo.toLowerCase()} com ${alvoPt} no céu de hoje">
  <circle cx="${CX}" cy="${CY}" r="${ARO_EXTERNO}" fill="none" stroke="#242A47" stroke-width="1.5"/>
  <circle cx="${CX}" cy="${CY}" r="${ARO_INTERNO}" fill="none" stroke="#1B2035" stroke-width="1"/>
  <g stroke="#242A47" stroke-width="1">
    <line x1="${CX}" y1="${CY - ARO_EXTERNO - 13}" x2="${CX}" y2="${CY - ARO_EXTERNO - 1}"/>
    <line x1="${CX + ARO_EXTERNO + 13}" y1="${CY}" x2="${CX + ARO_EXTERNO + 1}" y2="${CY}"/>
    <line x1="${CX}" y1="${CY + ARO_EXTERNO + 13}" x2="${CX}" y2="${CY + ARO_EXTERNO + 1}"/>
    <line x1="${CX - ARO_EXTERNO - 13}" y1="${CY}" x2="${CX - ARO_EXTERNO - 1}" y2="${CY}"/>
  </g>

  ${marcador}
  ${raios}

  <g transform="translate(${pAgente.x} ${pAgente.y})">
    ${desenhoCorpo(agente, id + 'a')}
    ${rotuloCorpo(agentePt, agentePos, ladoAgente, rAgente)}
  </g>

  <g transform="translate(${pAlvo.x} ${pAlvo.y})">
    ${desenhoCorpo(alvo, id + 'b')}
    ${rotuloCorpo(alvoPt, alvoPos, ladoAlvo, rAlvo)}
  </g>

  <circle cx="${CX}" cy="${CY}" r="3" fill="${SLATE}"/>
</svg>`
}

/**
 * @param {object} dados encontro do dia, já resolvido
 * @param {'feed'|'story'} formato
 * @returns {string} HTML completo
 */
export function montarCard(dados, formato = 'feed') {
  const largura = 1080
  const altura = formato === 'story' ? 1920 : 1350
  const id = formato

  const readout = dados.exato
    ? `${dados.aspectoRotulo} exata · orbe <b>${dados.orbeFormatado}</b>`
    : `${dados.aspectoRotulo} · orbe <b>${dados.orbeFormatado}</b>`

  return `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: ${largura}px; height: ${altura}px; overflow: hidden; background: ${VOID}; }

  .card {
    position: relative;
    width: ${largura}px;
    height: ${altura}px;
    container-type: inline-size;
    background: ${VOID};
    color: ${VELLUM};
    overflow: hidden;
    --area: ${dados.cor};
  }
  canvas, .glow, .hush { position: absolute; }
  canvas { inset: 0; width: 100%; height: 100%; }

  .glow {
    left: 50%; bottom: -30cqw; width: 130cqw; height: 92cqw;
    transform: translateX(-50%);
    background: radial-gradient(ellipse at center,
      var(--area) 0%,
      color-mix(in srgb, var(--area) 30%, transparent) 34%,
      rgba(7,10,24,0) 68%);
    opacity: 0.42;
  }
  .hush {
    left: 50%; top: 4cqw; width: 96cqw; height: ${formato === 'story' ? '52cqw' : '70cqw'};
    transform: translateX(-50%);
    background: radial-gradient(ellipse at center, ${VOID} 0%, rgba(7,10,24,0.86) 42%, rgba(7,10,24,0) 72%);
  }

  .inner {
    position: absolute; inset: 0; z-index: 2;
    padding: 7cqw;
    display: flex; flex-direction: column;
  }

  .eyebrow {
    font-family: ui-monospace, 'Cascadia Mono', Consolas, 'DejaVu Sans Mono', 'Liberation Mono', monospace;
    font-size: 2.1cqw; letter-spacing: 0.22em; text-transform: uppercase;
    color: ${BRONZE};
    display: flex; justify-content: space-between;
  }
  .eyebrow span:last-child { color: ${SLATE}; }

  /* o diagrama encolheu para abrir espaço à leitura curada */
  .figure { display: grid; place-items: center; margin: ${formato === 'story' ? '6cqw 0 2cqw' : '2cqw 0 0.5cqw'}; }
  .figure svg { width: ${formato === 'story' ? '78%' : '66%'}; height: auto; display: block; }

  .readout {
    font-family: ui-monospace, 'Cascadia Mono', Consolas, 'DejaVu Sans Mono', 'Liberation Mono', monospace;
    font-size: 2.3cqw; letter-spacing: 0.13em; text-transform: uppercase;
    color: ${SLATE}; text-align: center;
  }
  .readout b { color: ${BRONZE}; font-weight: 400; }

  .title {
    /* P052 e URW Palladio L sao o Palatino livre: mesmas metricas, e o que existe
       no Linux do runner. Sem eles o card sai com serif generico na automacao. */
    font-family: 'Palatino Linotype', Palatino, 'Book Antiqua', 'P052', 'URW Palladio L', Georgia, serif;
    /* margem fixa, não auto: com a leitura curada o conteúdo cresceu e o auto
       empurrava o rodapé para fora do quadro */
    font-size: 6.5cqw; line-height: 1.05; font-weight: 400;
    letter-spacing: -0.012em; margin-top: 2.2cqw;
    text-wrap: balance;
    text-shadow: 0 0.3cqw 2.4cqw rgba(7,10,24,0.75);
  }
  .aph {
    /* P052 e URW Palladio L sao o Palatino livre: mesmas metricas, e o que existe
       no Linux do runner. Sem eles o card sai com serif generico na automacao. */
    font-family: 'Palatino Linotype', Palatino, 'Book Antiqua', 'P052', 'URW Palladio L', Georgia, serif;
    font-style: italic; font-size: 3.1cqw; line-height: 1.36;
    color: #C9A227; margin-top: 2cqw; max-width: 92%; opacity: 0.9;
    text-shadow: 0 0.2cqw 2cqw rgba(7,10,24,0.85);
  }
  /* leitura curada: sem ela a peça tinha um título de quatro palavras, uma
     linha de aforismo e muito espaço vazio */
  .leitura {
    font-family: 'Palatino Linotype', Palatino, 'Book Antiqua', 'P052', 'URW Palladio L', Georgia, serif;
    font-size: 3.1cqw; line-height: 1.4; color: #CFC9BD;
    margin-top: 2.4cqw;
    text-shadow: 0 0.2cqw 2cqw rgba(7,10,24,0.85);
  }

  .foot {
    margin-top: auto; padding-top: 3cqw;
    border-top: 0.12cqw solid rgba(237,230,216,0.18);
    display: flex; align-items: center; justify-content: space-between;
  }
  .chip {
    display: inline-flex; align-items: center; gap: 1.4cqw;
    font-family: ui-monospace, 'Cascadia Mono', Consolas, 'DejaVu Sans Mono', 'Liberation Mono', monospace;
    font-size: 2.1cqw; letter-spacing: 0.14em; text-transform: uppercase;
    color: var(--area);
  }
  .chip::before {
    content: ""; width: 1.5cqw; height: 1.5cqw;
    border-radius: 50%; background: var(--area);
  }
  .handle {
    font-family: ui-monospace, 'Cascadia Mono', Consolas, 'DejaVu Sans Mono', 'Liberation Mono', monospace;
    font-size: 2.1cqw; letter-spacing: 0.1em; color: ${SLATE};
  }
</style></head>
<body>
  <div class="card">
    <canvas id="ceu" width="${largura}" height="${altura}"></canvas>
    <div class="hush"></div>
    <div class="glow"></div>
    <div class="inner">
      <div class="eyebrow"><span>Céu de hoje</span><span>${dados.dataRotulo}</span></div>
      <div class="figure">${diagrama(dados, id)}</div>
      <div class="readout">${readout}</div>
      <h1 class="title">${dados.titulo}</h1>
      ${dados.leitura ? `<p class="leitura">${dados.leitura}</p>` : ''}
      <p class="aph">${dados.aforismo}</p>
      <div class="foot">
        <span class="chip">${dados.areaLabel}</span>
        <span class="handle">@tabula_estelar</span>
      </div>
    </div>
  </div>

<script>
  // campo estelar determinístico: o mesmo dia gera sempre o mesmo céu, então
  // regerar um card já publicado não muda a imagem
  (function () {
    var c = document.getElementById('ceu');
    var g = c.getContext('2d');
    var W = c.width, H = c.height;
    g.fillStyle = '${VOID}'; g.fillRect(0, 0, W, H);

    var seed = ${dados.semente};
    function rnd() {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    }

    var n = Math.round(W * H / 3100);
    for (var i = 0; i < n; i++) {
      var x = rnd() * W, y = rnd() * H;
      var r = rnd() * 1.8 + 0.35, a = rnd() * 0.58 + 0.08;
      g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2);
      g.fillStyle = 'rgba(237,230,216,' + a.toFixed(3) + ')';
      g.fill();
    }
    for (var j = 0; j < 6; j++) {
      var bx = rnd() * W, by = rnd() * H;
      var gr = g.createRadialGradient(bx, by, 0, bx, by, 30);
      gr.addColorStop(0, 'rgba(237,230,216,0.70)');
      gr.addColorStop(0.20, 'rgba(201,162,39,0.18)');
      gr.addColorStop(1, 'rgba(7,10,24,0)');
      g.fillStyle = gr; g.fillRect(bx - 30, by - 30, 60, 60);
    }
    document.documentElement.setAttribute('data-pronto', '1');
  })();
</script>
</body></html>`
}
