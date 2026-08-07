/**
 * Slides do carrossel — o formato que as contas de referência mais usam e que a
 * gente não tinha.
 *
 * O card único entrega um fato e para. O carrossel obriga a arrastar, e cada
 * arraste é um sinal para o algoritmo — é o que faz um explicador de eclipse
 * render mais que a mesma informação num quadro só.
 *
 * Cada slide é uma página inteira renderizada pelo Chrome, igual ao card: mesma
 * paleta, mesmo campo estelar determinístico, mesmas fontes. Só muda o arranjo.
 */
import { CORES_CARTA } from './templateCarta.mjs'

const { VOID, VELLUM, BRONZE, SLATE } = CORES_CARTA

const SERIF = `'Palatino Linotype', Palatino, 'Book Antiqua', 'P052', 'URW Palladio L', Georgia, serif`
const MONO = `ui-monospace, 'Cascadia Mono', Consolas, 'DejaVu Sans Mono', 'Liberation Mono', monospace`

/**
 * O que cada ângulo é, em uma linha e sem promessa.
 *
 * Terceira pessoa e sem "você": o slide fala do ângulo, não de quem lê. Dizer
 * "vai mexer com a sua vida" seria afirmar o que não se sabe — o ângulo é o
 * mesmo para todo mundo, e o que muda é a casa.
 */
export const SENTIDO_ANGULO = {
  conjuncao: 'O evento cai neste signo. É o assunto passando por dentro.',
  quadratura: 'Noventa graus de distância. Ângulo de atrito: pede ação, não contemplação.',
  oposicao: 'Cento e oitenta graus. O que está do outro lado fica visível, e cobra equilíbrio.',
  trigono: 'Cento e vinte graus. Ângulo que corre solto — e por isso passa despercebido.',
  sextil: 'Sessenta graus. Abertura discreta: funciona se alguém for atrás.',
}

const escapar = (s) =>
  String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/**
 * Um slide.
 *
 * @param {object} slide `{ tipo, olho, titulo, texto, rodape, indice, total }`
 * @param {number} semente mantém o campo estelar igual entre regerações
 */
export function montarSlide(slide, semente) {
  const largura = 1080
  const altura = 1350

  const numeroDoSlide = slide.total > 1
    ? `<span class="passo">${slide.indice + 1} / ${slide.total}</span>`
    : ''

  // A capa é a única que ganha corpo grande: é ela que decide se alguém arrasta.
  const classeTitulo = slide.tipo === 'capa' ? 'titulo capa' : 'titulo'

  const arraste = slide.tipo === 'capa'
    ? `<div class="arraste">arraste &rarr;</div>`
    : ''

  const marca = slide.tipo === 'fecho'
    ? `<div class="marca">@tabula_estelar</div>`
    : ''

  return `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: ${largura}px; height: ${altura}px; overflow: hidden; background: ${VOID}; }
  .slide {
    position: relative; width: ${largura}px; height: ${altura}px;
    container-type: size; overflow: hidden;
  }
  canvas { position: absolute; inset: 0; }
  .brilho {
    position: absolute; left: 50%; bottom: -18cqw; width: 108cqw; height: 62cqw;
    transform: translateX(-50%);
    background: radial-gradient(ellipse at 50% 50%, rgba(201,162,39,0.20) 0%, rgba(201,162,39,0.05) 42%, rgba(7,10,24,0) 72%);
  }
  .inner {
    position: relative; z-index: 2; height: 100%;
    padding: 7.5cqw 7.5cqw 6.5cqw;
    display: flex; flex-direction: column;
  }
  .alto {
    display: flex; justify-content: space-between; align-items: baseline;
    font-family: ${MONO}; font-size: 2.3cqw; letter-spacing: 0.18em;
    text-transform: uppercase; color: ${BRONZE};
  }
  .passo { color: ${SLATE}; letter-spacing: 0.14em; }
  .meio { margin-top: auto; margin-bottom: auto; }
  .titulo {
    font-family: ${SERIF}; font-weight: 400; color: ${VELLUM};
    font-size: 7.6cqw; line-height: 1.06; letter-spacing: -0.012em;
    text-wrap: balance; text-shadow: 0 0.3cqw 2.4cqw rgba(7,10,24,0.75);
    /* honra o \\n do roteiro: sem isto a quebra vira espaço e o slide de fecho
       sai com as duas frases coladas numa linha só */
    white-space: pre-line;
  }
  .titulo.capa { font-size: 10.4cqw; }
  .texto {
    font-family: ${SERIF}; color: ${VELLUM}; opacity: 0.92;
    font-size: 4.1cqw; line-height: 1.42; margin-top: 3.4cqw; max-width: 94%;
  }
  .arraste {
    margin-top: 5cqw; font-family: ${MONO}; font-size: 2.7cqw;
    letter-spacing: 0.2em; text-transform: uppercase; color: ${BRONZE};
  }
  .baixo {
    margin-top: auto; padding-top: 3cqw;
    border-top: 0.12cqw solid rgba(237,230,216,0.18);
    font-family: ${MONO}; font-size: 2.3cqw; letter-spacing: 0.1em;
    color: ${SLATE}; line-height: 1.6;
  }
  .marca {
    margin-top: 2cqw; font-family: ${MONO}; font-size: 2.3cqw;
    letter-spacing: 0.1em; color: ${BRONZE};
  }
</style></head>
<body>
  <div class="slide">
    <canvas id="ceu" width="${largura}" height="${altura}"></canvas>
    <div class="brilho"></div>
    <div class="inner">
      <div class="alto">
        <span>${escapar(slide.olho || '')}</span>
        ${numeroDoSlide}
      </div>
      <div class="meio">
        <h1 class="${classeTitulo}">${escapar(slide.titulo)}</h1>
        ${slide.texto ? `<p class="texto">${escapar(slide.texto)}</p>` : ''}
        ${arraste}
      </div>
      ${slide.rodape ? `<div class="baixo">${escapar(slide.rodape)}</div>` : ''}
      ${marca}
    </div>
  </div>
<script>
  // Mesmo campo estelar do card: a semente vem da data, então regerar um
  // carrossel já publicado devolve exatamente a mesma imagem. O deslocamento por
  // slide evita que os seis fiquem com as estrelas idênticas.
  (function () {
    var c = document.getElementById('ceu');
    var g = c.getContext('2d');
    var W = c.width, H = c.height;
    g.fillStyle = '${VOID}'; g.fillRect(0, 0, W, H);

    var seed = ${semente + slide.indice * 7919};
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
