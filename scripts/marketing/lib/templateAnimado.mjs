/**
 * Carta do céu animada, para Reels.
 *
 * A página expõe `aplicarTempo(t)` com t entre 0 e 1, e o gerador de vídeo
 * chama essa função frame a frame antes de fotografar. Nada depende do relógio
 * nem de `requestAnimationFrame`: o mesmo t produz sempre o mesmo quadro, então
 * o vídeo é reproduzível e o render não corre atrás do tempo real.
 *
 * A animação conta a carta sendo construída: primeiro o zodíaco, depois os
 * corpos entrando do mais lento ao mais rápido, depois os aspectos se
 * desenhando entre eles, e por fim a leitura do dia.
 */
import { SIGNOS_INFO } from './ceu.mjs'
import {
  CX, CY, R_SIGNO_FORA, R_SIGNO_DENTRO, R_ASPECTO, R_PLANETA,
  RAIO_CORPO, CORES_CARTA, ponto, arredonda, setorSigno, distribuir, desenhoCorpo, imagemCorpo,
} from './templateCarta.mjs'

const { VOID, VELLUM, BRONZE, SLATE, TRACO, COR_HARMONICO, COR_TENSO, COR_ELEMENTO } = CORES_CARTA

/**
 * Entrada em meio segundo, e só.
 *
 * A primeira versão revelava a carta em etapas e o conteúdo só ficava completo
 * perto do fim. No Reels os dois primeiros segundos decidem a retenção, e quem
 * chegava via uma roda vazia se desenhando: a animação estava cobrando espera
 * para entregar o que já existia.
 *
 * Agora tudo está legível quase no primeiro quadro e o movimento é atmosfera —
 * brilho pulsando, estrelas cintilando, roda girando devagar.
 */
const FASE = {
  abertura: [0.00, 0.04],
  zodiaco: [0.00, 0.05],
  corpos: [0.01, 0.06],
  aspectos: [0.02, 0.08],
  posicoes: [0.03, 0.08],
  leitura: [0.04, 0.10],
}

export function montarAnimacao(dados) {
  const largura = 1080
  const altura = 1920

  const distribuidos = distribuir(dados.corpos)
  const porNome = Object.fromEntries(dados.corpos.map((c) => [c.nome, c]))
  const temRetrogrado = dados.corpos.some((c) => c.retrogrado)

  const setores = SIGNOS_INFO.map((s, i) =>
    `<path class="setor" d="${setorSigno(i)}" fill="${COR_ELEMENTO[s.elemento]}" opacity="0.07"/>`
  ).join('')

  const divisoes = SIGNOS_INFO.map((_, i) => {
    const a = ponto(i * 30, R_SIGNO_FORA)
    const b = ponto(i * 30, R_SIGNO_DENTRO - 14)
    return `<line class="divisao" x1="${arredonda(a.x)}" y1="${arredonda(a.y)}"
                  x2="${arredonda(b.x)}" y2="${arredonda(b.y)}"
                  stroke="${TRACO}" stroke-width="1.4" opacity="1"/>`
  }).join('')

  const rotulosSigno = SIGNOS_INFO.map((s, i) => {
    const p = ponto(i * 30 + 15, (R_SIGNO_FORA + R_SIGNO_DENTRO) / 2)
    return `<text class="rot-signo" x="${arredonda(p.x)}" y="${arredonda(p.y + 7)}"
                  text-anchor="middle" fill="${COR_ELEMENTO[s.elemento]}" opacity="1"
                  font-family="ui-monospace, Consolas, 'DejaVu Sans Mono', monospace"
                  font-size="21" letter-spacing="2.4">${s.abrev}</text>`
  }).join('')

  const linhasAspecto = dados.aspectos
    .filter((a) => a.aspecto !== 'conjuncao')
    .map((a) => {
      const p1 = porNome[a.agente]
      const p2 = porNome[a.alvo]
      if (!p1 || !p2) return ''
      const q1 = ponto(p1.longitude, R_ASPECTO)
      const q2 = ponto(p2.longitude, R_ASPECTO)
      const tenso = a.aspecto === 'quadratura' || a.aspecto === 'oposicao'
      const forca = Math.max(0.22, 1 - a.orbe / (a.orbeMax || 6))
      return `<line class="aspecto" x1="${arredonda(q1.x)}" y1="${arredonda(q1.y)}"
                    x2="${arredonda(q2.x)}" y2="${arredonda(q2.y)}"
                    stroke="${tenso ? COR_TENSO : COR_HARMONICO}"
                    stroke-width="${arredonda(1.2 + forca * 1.8)}"
                    data-alvo-opacidade="${arredonda(0.24 + forca * 0.58)}"
                    opacity="${arredonda(0.24 + forca * 0.58)}"/>`
    }).join('')

  // ordem de entrada: do mais lento ao mais rápido, que é como a carta se lê
  const ordemEntrada = ['Pluto', 'Neptune', 'Uranus', 'Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon']

  const corposSvg = distribuidos.map((c) => {
    const p = ponto(c.longitude, c.raio)
    const t1 = ponto(c.longitude, R_SIGNO_DENTRO)
    const t2 = ponto(c.longitude, R_SIGNO_DENTRO - 22)
    const i = ordemEntrada.indexOf(c.nome)
    return `<g class="corpo" data-ordem="${i < 0 ? 0 : i}" opacity="1">
      <line x1="${arredonda(t1.x)}" y1="${arredonda(t1.y)}" x2="${arredonda(t2.x)}" y2="${arredonda(t2.y)}"
            stroke="${VELLUM}" stroke-width="1.6" opacity="0.5"/>
      ${c.raio < R_PLANETA ? (() => {
        const a = ponto(c.longitude, c.raio + RAIO_CORPO[c.nome] + 3)
        const b = ponto(c.longitude, R_SIGNO_DENTRO - 24)
        return `<line x1="${arredonda(a.x)}" y1="${arredonda(a.y)}" x2="${arredonda(b.x)}" y2="${arredonda(b.y)}"
                      stroke="${SLATE}" stroke-width="1" opacity="0.55" stroke-dasharray="3 4"/>`
      })() : ''}
      <g transform="translate(${arredonda(p.x)} ${arredonda(p.y)})">${dados.dirPlanetas ? imagemCorpo(c.nome, dados.dirPlanetas) : desenhoCorpo(c.nome)}</g>
    </g>`
  }).join('')

  const posicoes = dados.corpos.map((c, i) => `
    <div class="pos" data-ordem="${i}">
      <svg viewBox="-26 -26 52 52" aria-hidden="true"><g transform="scale(0.94)">${dados.dirPlanetas ? imagemCorpo(c.nome, dados.dirPlanetas) : desenhoCorpo(c.nome)}</g></svg>
      <span class="pn">${c.nomePt}${c.retrogrado ? '<i>℞</i>' : ''}</span>
      <span class="pg">${c.grau}° ${c.signo}</span>
    </div>`).join('')

  return `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: ${largura}px; height: ${altura}px; overflow: hidden; background: ${VOID}; }

  .palco {
    position: relative; width: ${largura}px; height: ${altura}px;
    container-type: inline-size;
    background: ${VOID}; color: ${VELLUM}; overflow: hidden;
    --area: ${dados.cor};
  }
  canvas { position: absolute; inset: 0; width: 100%; height: 100%; }

  .brilho {
    position: absolute; left: 50%; bottom: -22cqw;
    width: 128cqw; height: 74cqw; transform: translateX(-50%);
    background: radial-gradient(ellipse at center, var(--area) 0%,
      color-mix(in srgb, var(--area) 26%, transparent) 34%, rgba(7,10,24,0) 68%);
    opacity: 0.34;
  }

  .conteudo {
    position: absolute; inset: 0; z-index: 2;
    padding: 7cqw 5.6cqw 7cqw;
    display: flex; flex-direction: column;
  }

  .alto {
    font-family: ui-monospace, 'Cascadia Mono', Consolas, 'DejaVu Sans Mono', monospace;
    font-size: 2.05cqw; letter-spacing: 0.24em; text-transform: uppercase;
    color: ${BRONZE};
    display: flex; justify-content: space-between; align-items: baseline;
  }
  .alto span:last-child { color: ${SLATE}; }

  .roda { display: grid; place-items: center; margin-top: 3cqw; }
  .roda svg { width: 92%; height: auto; display: block; }

  .legenda {
    display: flex; gap: 3.2cqw; justify-content: center;
    font-family: ui-monospace, 'Cascadia Mono', Consolas, 'DejaVu Sans Mono', monospace;
    font-size: 1.7cqw; letter-spacing: 0.1em; text-transform: uppercase;
    color: ${SLATE}; margin-top: 2cqw;
  }
  .legenda i { display: inline-block; width: 3.2cqw; height: 0.24cqw; vertical-align: middle; margin-right: 0.8cqw; }

  .posicoes {
    display: grid; grid-template-columns: repeat(2, 1fr);
    gap: 1cqw 3.4cqw; margin-top: 4cqw;
  }
  .pos {
    display: flex; align-items: center; gap: 1.4cqw;
    font-family: ui-monospace, 'Cascadia Mono', Consolas, 'DejaVu Sans Mono', monospace;
    font-size: 2.05cqw;
  }
  .pos svg { flex-shrink: 0; width: 2.9cqw; height: 2.9cqw; }
  .pn { color: ${VELLUM}; letter-spacing: 0.04em; }
  .pn i { font-style: normal; color: ${BRONZE}; margin-left: 0.5cqw; }
  .pg { color: ${SLATE}; margin-left: auto; font-variant-numeric: tabular-nums; }

  /* margem fixa em vez de auto: o Instagram cobre a faixa de baixo com a
     própria interface, então o respiro sobra ali e o texto fica na zona visível */
  .leitura { margin-top: 6cqw; }
  .leitura .rot {
    font-family: ui-monospace, 'Cascadia Mono', Consolas, 'DejaVu Sans Mono', monospace;
    font-size: 1.85cqw; letter-spacing: 0.15em; text-transform: uppercase;
    color: ${SLATE}; margin-bottom: 1.4cqw;
  }
  .leitura .rot b { color: ${BRONZE}; font-weight: 400; }
  .leitura h1 {
    font-family: 'Palatino Linotype', Palatino, 'Book Antiqua', 'P052', 'URW Palladio L', Georgia, serif;
    font-size: 6.4cqw; line-height: 1.06; font-weight: 400; letter-spacing: -0.012em;
  }
  .leitura .texto {
    font-family: 'Palatino Linotype', Palatino, 'Book Antiqua', 'P052', 'URW Palladio L', Georgia, serif;
    font-size: 3cqw; line-height: 1.4; color: #CFC9BD; margin-top: 1.6cqw;
  }
  .leitura .aforismo {
    font-family: 'Palatino Linotype', Palatino, 'Book Antiqua', 'P052', 'URW Palladio L', Georgia, serif;
    font-style: italic; font-size: 3cqw; line-height: 1.34;
    color: ${BRONZE}; margin-top: 1.4cqw; opacity: 0.9;
  }

  .rodape {
    margin-top: auto; padding-top: 3.4cqw;
    display: flex; align-items: center; justify-content: space-between;
    font-family: ui-monospace, 'Cascadia Mono', Consolas, 'DejaVu Sans Mono', monospace;
    font-size: 1.95cqw; letter-spacing: 0.13em; text-transform: uppercase;
  }
  .chip { color: var(--area); display: inline-flex; align-items: center; gap: 1.2cqw; }
  .chip::before { content: ""; width: 1.4cqw; height: 1.4cqw; border-radius: 50%; background: var(--area); }
  .arroba { color: ${SLATE}; }
</style></head>
<body>
  <div class="palco">
    <canvas id="ceu" width="${largura}" height="${altura}"></canvas>
    <div class="brilho"></div>

    <div class="conteudo">
      <div class="alto">
        <span>Carta do céu</span>
        <span>${dados.dataRotulo}</span>
      </div>

      <div class="roda">
        <svg viewBox="0 0 1000 1000" role="img" aria-label="Carta do céu do dia, animada">
          <g id="giro">
            <circle class="aro" cx="${CX}" cy="${CY}" r="${R_SIGNO_FORA}" fill="none" stroke="${TRACO}" stroke-width="1.6" opacity="1"/>
            <circle class="aro" cx="${CX}" cy="${CY}" r="${R_SIGNO_DENTRO}" fill="none" stroke="${TRACO}" stroke-width="1.4" opacity="1"/>
            <circle class="aro" cx="${CX}" cy="${CY}" r="${R_ASPECTO}" fill="none" stroke="#1B2035" stroke-width="1" opacity="1"/>
            ${setores}${divisoes}${rotulosSigno}
            ${linhasAspecto}
            ${corposSvg}
            <circle class="aro" cx="${CX}" cy="${CY}" r="3.5" fill="${SLATE}" opacity="1"/>
          </g>
        </svg>
      </div>

      <div class="legenda">
        <span><i style="background:${COR_HARMONICO}"></i>Harmônico</span>
        <span><i style="background:${COR_TENSO}"></i>Tenso</span>
        ${temRetrogrado ? '<span>℞ Retrógrado</span>' : ''}
      </div>

      <div class="posicoes">${posicoes}</div>

      <div class="leitura">
        <div class="rot">${dados.subtitulo || `${dados.aspectoRotulo} · ${dados.agentePt} e ${dados.alvoPt} · orbe <b>${dados.orbeFormatado}</b>`}</div>
        <h1>${dados.titulo}</h1>
        ${(dados.textoEvento || dados.leitura) ? `<p class="texto">${dados.textoEvento || dados.leitura}</p>` : ''}
        ${dados.textoEvento ? '' : `<p class="aforismo">${dados.aforismo}</p>`}
      </div>

      <div class="rodape">
        <span class="chip">${dados.signoEvento || 'Céu de hoje'}</span>
        <span class="arroba">@tabula_estelar</span>
      </div>
    </div>
  </div>

<script>
(function () {
  // ── campo estelar, desenhado uma vez ──
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
  for (var j = 0; j < 8; j++) {
    var bx = rnd() * W, by = rnd() * H;
    var gr = g.createRadialGradient(bx, by, 0, bx, by, 34);
    gr.addColorStop(0, 'rgba(237,230,216,0.6)');
    gr.addColorStop(0.2, 'rgba(201,162,39,0.15)');
    gr.addColorStop(1, 'rgba(7,10,24,0)');
    g.fillStyle = gr; g.fillRect(bx - 34, by - 34, 68, 68);
  }

  var FASE = ${JSON.stringify(FASE)};

  // ease-out-quart: sai rápido e assenta, sem quique
  function suave(x) { return 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 4); }

  /** Progresso de 0 a 1 dentro de uma fase, dado o tempo global. */
  function faixa(t, nome) {
    var f = FASE[nome];
    return suave((t - f[0]) / (f[1] - f[0]));
  }

  /** Progresso de um item que entra escalonado dentro da fase. */
  function escalonado(t, nome, indice, total) {
    var f = FASE[nome];
    var dur = f[1] - f[0];
    var passo = dur / (total + 3);
    var ini = f[0] + indice * passo;
    return suave((t - ini) / (dur - indice * passo * 0.5));
  }

  var aros = document.querySelectorAll('.aro');
  var setores = document.querySelectorAll('.setor');
  var divisoes = document.querySelectorAll('.divisao');
  var rotSignos = document.querySelectorAll('.rot-signo');
  var aspectos = document.querySelectorAll('.aspecto');
  var corpos = document.querySelectorAll('.corpo');
  var poss = document.querySelectorAll('.pos');
  var giro = document.getElementById('giro');

  // Sem dasharray: a linha nasce inteira. O desenho progressivo saiu junto com
  // a revelacao em etapas, e deixar o offset aqui escondia tudo em silencio.

  window.aplicarTempo = function (t) {







    // a roda respira: giro lento e contínuo, quase imperceptível quadro a quadro
    giro.style.transform = 'rotate(' + (t * 2.4).toFixed(3) + 'deg)';
    giro.style.transformOrigin = '${CX}px ${CY}px';

    // Depois que tudo já apareceu, o movimento vira brilho: os aspectos pulsam
    // devagar e os corpos ganham um halo que respira. É o que dá vida ao quadro
    // sem esconder nada de quem chegou agora.
    var pulso = 0.5 + 0.5 * Math.sin(t * Math.PI * 4);
    aspectos.forEach(function (el, i) {
      var base = parseFloat(el.dataset.alvoOpacidade || '0.6');
      var fora = (i % 3) * 0.33;
      var p = 0.5 + 0.5 * Math.sin((t * 4 + fora) * Math.PI);
      el.style.opacity = base * (0.72 + 0.28 * p);
    });
    corpos.forEach(function (el, i) {
      var p = 0.5 + 0.5 * Math.sin((t * 3 + i * 0.2) * Math.PI);
      el.style.filter = 'drop-shadow(0 0 ' + (3 + p * 7).toFixed(1) + 'px rgba(201,162,39,' + (0.25 + p * 0.35).toFixed(2) + '))';
    });

    document.documentElement.dataset.t = t;
  };

  window.aplicarTempo(0);
  document.documentElement.dataset.pronto = '1';
})();
</script>
</body></html>`
}
