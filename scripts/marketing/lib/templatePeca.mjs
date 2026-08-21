/**
 * A peça v3: a roda REAL do céu do dia, sobre fundo procedural da marca.
 *
 * ── POR QUE SUBSTITUI A FOTO ───────────────────────────────────────────────
 *
 * A `templateFoto.mjs` pôs foto da NASA ao fundo para fugir do card confuso de
 * sete blocos. Resolveu a poluição, mas a imagem virou genérica — o João olhou
 * o post das casas: "não está com a nossa identidade". A foto de aurora podia
 * ser de qualquer conta.
 *
 * Aqui o fundo é da marca (navy + campo estelar + brilho dourado) e o herói é a
 * roda real do dia: signos, casas e planetas nas posições reais, com o corpo do
 * assunto realçado. É a v3 do mockup que o João aprovou.
 *
 * Duas funções, uma moldura: `montarPeca` (post/story) e `montarSlide` (os
 * slides do carrossel educativo). As duas compartilham o fundo e a assinatura.
 *
 * DIREÇÕES: `forte` (eclipse, lunação, ingresso de peso) acende a Nebulosa —
 * brilho dourado, atmosférico. O dia comum fica na Efeméride — quase liso.
 */
import { SANS, MONO, SERIF, fontesEmbutidas, SANS_ESCOLHIDA } from './fontes.mjs'
import { NOITE, NOITE_2, OURO, OURO_CLARO, CREME, assinatura, estrelaDeOitoPontas, CSS_ASSINATURA } from './marca.mjs'
import { svgRodaReal } from './rodaReal.mjs'
import { primeirasFrases } from './interpretacao.mjs'

/** Semente determinística do campo estelar: mesma peça, mesmo céu de fundo. */
function semente(signo, variacao) {
  let h = 2166136261
  const s = `${signo || ''}#${variacao || 0}`
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) }
  return (h >>> 0) % 2147483647 || 12345
}

const escapar = (s) =>
  String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/**
 * A moldura comum: fundo da marca, campo estelar, as duas direções, e a
 * assinatura. Quem chama injeta `dentro` (o conteúdo do `.conteudo`).
 */
function moldura({ largura, altura, story, forte, seed, dentro }) {
  return `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8">
<style>
  ${fontesEmbutidas(SANS_ESCOLHIDA)}
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: ${largura}px; height: ${altura}px; overflow: hidden; background: ${NOITE}; }

  .peca {
    position: relative; width: ${largura}px; height: ${altura}px;
    container-type: size; overflow: hidden; background: ${NOITE};
  }
  canvas, .glow, .glow-ouro { position: absolute; }
  canvas { inset: 0; width: 100%; height: 100%; }

  /* EFEMÉRIDE (dia comum): brilho baixo, quase liso. NEBULOSA (dia forte):
     atmosfera dourada, imersiva. */
  .glow {
    left: 50%; bottom: -30cqw; width: 132cqw; height: 92cqw;
    transform: translateX(-50%);
    background: radial-gradient(ellipse at center, ${NOITE_2} 0%, rgba(11,14,34,0) 66%);
    opacity: ${forte ? 0.9 : 0.5};
  }
  .glow-ouro {
    left: 50%; top: 20cqw; width: 96cqw; height: 84cqw;
    transform: translateX(-50%);
    background: radial-gradient(ellipse at center,
      color-mix(in srgb, ${OURO} 30%, transparent) 0%,
      color-mix(in srgb, ${OURO} 10%, transparent) 34%,
      rgba(11,14,34,0) 64%);
    opacity: ${forte ? 0.55 : 0};
  }

  .conteudo {
    position: absolute; inset: 0; z-index: 2;
    padding: ${story ? '9cqw 7.5cqw 26cqw' : '7cqw 7.5cqw 7cqw'};
    display: flex; flex-direction: column;
  }

  .olho {
    font-family: ${MONO}; font-size: 2.3cqw;
    letter-spacing: 0.22em; text-transform: uppercase; color: ${OURO};
    display: flex; justify-content: space-between; align-items: center;
  }

  /* A roda é o herói: ocupa a metade de cima e centraliza. */
  .roda { display: grid; place-items: center; margin: ${story ? '4cqw 0 2cqw' : '1.5cqw 0 0.5cqw'}; }
  .roda svg { width: ${story ? '74%' : '66%'}; height: auto; display: block;
    filter: drop-shadow(0 0.6cqw 3cqw rgba(0,0,0,0.45)); }

  .titulo {
    font-family: ${SERIF}; font-weight: 600; color: ${CREME};
    font-size: ${story ? 7.8 : 6.0}cqw; line-height: 1.1; letter-spacing: 0.005em;
    text-wrap: balance; white-space: pre-line; margin-top: 1cqw;
    text-shadow: 0 0.4cqw 3cqw rgba(11,14,34,0.9);
  }
  .texto {
    font-family: ${SANS}; color: #E8E2D6;
    line-height: 1.44; margin-top: 3cqw; white-space: pre-line; max-width: 96%;
    text-shadow: 0 0.3cqw 2cqw rgba(11,14,34,0.8);
  }

  /* selo — estrela de oito pontas grande, marca d'água dos slides de texto */
  .selo {
    position: absolute; z-index: 1; opacity: 0.10;
    top: 50%; left: 50%; width: 74cqw; height: 74cqw;
    transform: translate(-50%,-50%);
  }
  .selo svg { width: 100%; height: 100%; display: block; }

  /* número do slide no carrossel */
  .passo {
    font-family: ${MONO}; font-size: 2.4cqw; letter-spacing: 0.2em;
    color: ${OURO}; display: flex; align-items: center; gap: 1.2cqw;
  }
  .passo .traco { flex: 1; height: 1px; background: rgba(232,179,60,0.35); }

  /* texto grande e centrado do slide de conteúdo */
  .slide-corpo {
    flex: 1; display: flex; flex-direction: column; justify-content: center;
    z-index: 2; position: relative;
  }
  .slide-frase {
    font-family: ${SERIF}; font-weight: 400; color: ${CREME};
    font-size: 6.4cqw; line-height: 1.24; letter-spacing: 0.004em;
    text-wrap: balance; text-shadow: 0 0.4cqw 3cqw rgba(11,14,34,0.9);
  }
  .cta-titulo {
    font-family: ${SERIF}; font-weight: 600; color: ${CREME};
    font-size: 7cqw; line-height: 1.1; text-wrap: balance;
  }
  .cta-linha {
    font-family: ${SANS}; color: #E8E2D6; font-size: 4cqw; line-height: 1.4;
    margin-top: 3cqw; max-width: 90%;
  }

  .rodape {
    margin-top: auto; padding-top: 3cqw;
    border-top: 0.12cqw solid rgba(242,231,206,0.20);
    font-family: ${MONO}; font-size: 2.2cqw; letter-spacing: 0.12em;
    color: rgba(242,231,206,0.55);
    display: flex; justify-content: space-between; align-items: center;
  }
  ${CSS_ASSINATURA}
</style></head>
<body>
  <div class="peca">
    <canvas id="ceu" width="${largura}" height="${altura}"></canvas>
    <div class="glow"></div>
    <div class="glow-ouro"></div>
    ${dentro}
  </div>
<script>
  (function () {
    var c = document.getElementById('ceu');
    var g = c.getContext('2d');
    var W = c.width, H = c.height;
    g.fillStyle = '${NOITE}'; g.fillRect(0, 0, W, H);
    var seed = ${seed};
    function rnd() { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; }
    var n = Math.round(W * H / 3400);
    for (var i = 0; i < n; i++) {
      var x = rnd() * W, y = rnd() * H;
      var r = rnd() * 1.7 + 0.35, a = rnd() * 0.55 + 0.08;
      g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2);
      g.fillStyle = 'rgba(242,231,206,' + a.toFixed(3) + ')'; g.fill();
    }
    for (var j = 0; j < 5; j++) {
      var bx = rnd() * W, by = rnd() * H * 0.6;
      var gr = g.createRadialGradient(bx, by, 0, bx, by, 34);
      gr.addColorStop(0, 'rgba(245,211,131,0.55)');
      gr.addColorStop(0.25, 'rgba(232,179,60,0.14)');
      gr.addColorStop(1, 'rgba(11,14,34,0)');
      g.fillStyle = gr; g.fillRect(bx - 34, by - 34, 68, 68);
    }
    document.documentElement.setAttribute('data-pronto', '1');
  })();
</script>
</body></html>`
}

/**
 * Uma peça: fundo da marca, a roda do dia, e o texto.
 *
 * @param {object} peca
 *   `{ olho, titulo, texto, rodape, dataRotulo, signo, variacao, formato,
 *      data, corpos, forte, destaque }`
 *   formato: 'feed' (1080×1350) ou 'story' (1080×1920)
 */
export function montarPeca(peca) {
  const story = peca.formato === 'story'
  const largura = 1080
  const altura = story ? 1920 : 1350

  // A figura é o diagrama do FATO quando há um (fase, aspecto, ingresso,
  // conceito com desenho próprio); senão, a roda do céu do dia.
  const roda = peca.figura
    ? peca.figura
    : peca.data
      ? svgRodaReal({ data: peca.data, corpos: peca.corpos, destaque: peca.destaque || null, lado: 440, ascFixo: peca.ascFixo ?? null })
      : ''

  // A roda ocupa a metade de cima, então o texto na imagem é curto — o inteiro
  // vai na legenda. Story: 2 frases. Feed: 3.
  const texto = primeirasFrases(String(peca.texto || ''), story ? 2 : 3)
  const n = texto.length
  const corpoFonte = story
    ? (n <= 150 ? 5.2 : n <= 240 ? 4.6 : 4.0)
    : (n <= 160 ? 4.2 : n <= 260 ? 3.7 : 3.3)

  const dentro = `<div class="conteudo">
      <div class="olho"><span>${escapar(peca.olho || 'Céu de hoje')}</span><span>${escapar(peca.dataRotulo || '')}</span></div>
      ${roda ? `<div class="roda">${roda}</div>` : ''}
      <h1 class="titulo">${escapar(peca.titulo)}</h1>
      ${texto ? `<p class="texto" style="font-size:${corpoFonte}cqw">${escapar(texto)}</p>` : ''}
      <div class="rodape">
        <span>${escapar(peca.rodape || '')}</span>
        ${assinatura(26)}
      </div>
    </div>`

  return moldura({ largura, altura, story, forte: !!peca.forte, seed: semente(peca.signo, peca.variacao), dentro })
}

/**
 * Um slide do carrossel educativo.
 *
 * @param {object} slide
 *   comum: `{ olho, dataRotulo, forte, signo, variacao }`
 *   `tipo: 'capa'`  → a roda do dia + título + gancho (a mesma capa da peça)
 *   `tipo: 'texto'` → uma ou duas frases grandes, número do passo, selo ao fundo
 *   `tipo: 'fecho'` → chamada para o app + assinatura
 */
export function montarSlide(slide) {
  const largura = 1080
  const altura = 1350
  const seed = semente(slide.signo, (slide.variacao || 0) + (slide.passo || 0))
  const forte = !!slide.forte

  let dentro
  if (slide.tipo === 'capa') {
    const roda = slide.figura
      ? slide.figura
      : slide.data
        ? svgRodaReal({ data: slide.data, corpos: slide.corpos, destaque: slide.destaque || null, lado: 440 })
        : ''
    const gancho = primeirasFrases(String(slide.texto || ''), 1)
    dentro = `<div class="conteudo">
      <div class="olho"><span>${escapar(slide.olho || 'Astrologia por dentro')}</span><span>${escapar(slide.dataRotulo || '')}</span></div>
      ${roda ? `<div class="roda">${roda}</div>` : ''}
      <h1 class="titulo">${escapar(slide.titulo)}</h1>
      ${gancho ? `<p class="texto" style="font-size:3.6cqw">${escapar(gancho)}</p>` : ''}
      <div class="rodape"><span>arraste →</span>${assinatura(26)}</div>
    </div>`
  } else if (slide.tipo === 'fecho') {
    dentro = `<div class="selo">${estrelaDeOitoPontas(400, true)}</div>
    <div class="conteudo">
      <div class="passo"><span class="traco"></span></div>
      <div class="slide-corpo">
        <h2 class="cta-titulo">${escapar(slide.titulo || 'Veja no seu mapa')}</h2>
        <p class="cta-linha">${escapar(slide.texto || 'O cálculo completo, de graça, no link da bio.')}</p>
      </div>
      <div class="rodape"><span>@tabula_estelar</span>${assinatura(26)}</div>
    </div>`
  } else {
    // texto
    dentro = `<div class="selo">${estrelaDeOitoPontas(400, false)}</div>
    <div class="conteudo">
      <div class="passo">${slide.passo}/${slide.total}<span class="traco"></span></div>
      <div class="slide-corpo">
        <p class="slide-frase">${escapar(slide.texto)}</p>
      </div>
      <div class="rodape"><span>${escapar(slide.olho || '')}</span>${assinatura(26)}</div>
    </div>`
  }

  return moldura({ largura, altura, story: false, forte, seed, dentro })
}
