/**
 * O slide do carrossel v4 — o padrão que o João aprovou (referência
 * realastrology): card com borda dourada, título com uma palavra em itálico
 * dourado, corpo denso, eyebrow de categoria, marca e numeração.
 *
 * Três variantes:
 *   capa  — imagem IA rica ao fundo (Higgsfield) + card + "deslize"
 *   texto — a roda/diagrama real ao fundo (nosso diferencial) + card denso
 *   cta   — selo da marca + chamada para o app
 *
 * O fundo cai no procedural (campo estelar + brilho dourado) quando não há
 * imagem IA nem figura — a peça nunca fica sem fundo.
 */
import { SANS, MONO, SERIF, fontesEmbutidas, SANS_ESCOLHIDA } from './fontes.mjs'
import { NOITE, NOITE_2, OURO, OURO_CLARO, CREME, estrelaDeOitoPontas } from './marca.mjs'

const SLATE = '#8A93BD'

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
/** `*palavra*` vira itálico dourado, como na referência. Escapa antes, marca depois. */
const comDestaque = (s) => esc(s).replace(/\*([^*]+)\*/g, `<em>$1</em>`)

function seedNum(txt, n) {
  let h = 2166136261
  const s = `${txt || ''}#${n || 0}`
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) }
  return (h >>> 0) % 2147483647 || 12345
}

/**
 * @param {object} slide
 *   `{ tipo:'capa'|'texto'|'cta', n, total, olho, titulo, corpo, cta,
 *      fundoImg?:dataUri, figura?:svgString }`
 */
export function montarSlideCard(slide) {
  const L = 1080
  const capa = slide.tipo === 'capa'
  const cta = slide.tipo === 'cta'
  const seed = seedNum(slide.olho || slide.titulo, slide.n)

  // o que vai atrás do card
  const fundo = slide.fundoImg
    ? `<div class="foto" style="background-image:url('${slide.fundoImg}')"></div><div class="veu"></div>`
    : `<canvas id="ceu" width="${L}" height="${L}"></canvas><div class="glow"></div>
       ${slide.figura ? `<div class="figura">${slide.figura}</div>` : ''}
       ${cta ? `<div class="selo">${estrelaDeOitoPontas(420, true)}</div>` : ''}`

  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><style>
  ${fontesEmbutidas(SANS_ESCOLHIDA)}
  *{margin:0;padding:0;box-sizing:border-box}
  html,body{width:${L}px;height:${L}px;overflow:hidden;background:${NOITE}}
  .peca{position:relative;width:${L}px;height:${L}px;overflow:hidden;background:${NOITE};container-type:size}
  canvas,.glow,.foto,.veu,.figura,.selo{position:absolute}
  canvas,.foto{inset:0;width:100%;height:100%}
  .foto{background-size:cover;background-position:center}
  .veu{inset:0;background:linear-gradient(180deg,rgba(11,14,34,.12) 0%,rgba(11,14,34,.34) 46%,rgba(11,14,34,.82) 74%,rgba(11,14,34,.95) 100%)}
  .glow{left:50%;top:8cqw;width:96cqw;height:70cqw;transform:translateX(-50%);
    background:radial-gradient(ellipse at center,color-mix(in srgb,${OURO} 24%,transparent) 0%,color-mix(in srgb,${OURO} 8%,transparent) 34%,rgba(11,14,34,0) 62%);opacity:.5}
  .figura{z-index:1;top:11cqw;left:50%;transform:translateX(-50%);width:56cqw;height:56cqw;display:grid;place-items:center}
  .figura svg{width:100%;height:auto;filter:drop-shadow(0 1cqw 4cqw rgba(0,0,0,.5))}
  .selo{z-index:1;top:50%;left:50%;width:74cqw;height:74cqw;transform:translate(-50%,-50%);opacity:.14}
  .selo svg{width:100%;height:100%}
  .topo{position:absolute;z-index:3;top:5cqw;left:6cqw;right:6cqw;display:flex;justify-content:space-between;align-items:center}
  .marca{display:flex;align-items:center;gap:1.3cqw;font-family:${MONO};font-size:2cqw;letter-spacing:.2em;text-transform:uppercase;color:${OURO}}
  .marca svg{width:3.6cqw;height:3.6cqw}
  .num{font-family:${MONO};font-size:2cqw;letter-spacing:.1em;color:${SLATE};border:1px solid rgba(232,179,60,.42);border-radius:99px;padding:.8cqw 2.4cqw}
  .card{position:absolute;z-index:3;left:5cqw;right:5cqw;bottom:5cqw;
    background:linear-gradient(180deg,rgba(11,14,34,${slide.fundoImg ? '.55' : '.72'}),rgba(11,14,34,.9));
    border:1px solid rgba(232,179,60,.45);border-radius:3cqw;padding:5.4cqw 5.4cqw 4.8cqw;backdrop-filter:blur(5px);
    box-shadow:0 2cqw 8cqw rgba(0,0,0,.5),inset 0 0 0 1px rgba(245,211,131,.07)}
  .olho{font-family:${MONO};font-size:2.1cqw;letter-spacing:.28em;text-transform:uppercase;color:${OURO};margin-bottom:2.3cqw}
  .titulo{font-family:${SERIF};font-weight:600;color:${CREME};font-size:${cta ? 6.2 : capa ? 6.6 : 6.4}cqw;line-height:1.08;letter-spacing:.003em;text-wrap:balance}
  .titulo em{font-style:italic;color:${OURO_CLARO}}
  .corpo{font-family:${SANS};color:#D9D3C6;font-size:3.15cqw;line-height:1.5;margin-top:2.8cqw}
  .btn{margin-top:3.6cqw;border:1px solid rgba(232,179,60,.6);border-radius:99px;padding:2.6cqw;text-align:center;font-family:${MONO};font-size:2.4cqw;letter-spacing:.12em;color:${OURO_CLARO}}
  .deslize{margin-top:2.8cqw;font-family:${MONO};font-size:2.2cqw;letter-spacing:.2em;color:${SLATE}}
  </style></head><body>
  <div class="peca">
    ${fundo}
    <div class="topo">
      <span class="marca">${estrelaDeOitoPontas(36)}Tábula Estelar</span>
      <span class="num">${slide.n} / ${slide.total}</span>
    </div>
    <div class="card">
      <div class="olho">${esc(slide.olho || '')}</div>
      <h1 class="titulo">${comDestaque(slide.titulo || '')}</h1>
      ${slide.corpo ? `<p class="corpo">${esc(slide.corpo)}</p>` : ''}
      ${cta && slide.cta ? `<div class="btn">${esc(slide.cta)}</div>` : ''}
      ${capa ? `<div class="deslize">→ deslize</div>` : ''}
    </div>
  </div>
  ${slide.fundoImg ? '' : `<script>
    (function(){var c=document.getElementById('ceu');if(!c)return;var g=c.getContext('2d'),W=c.width,H=c.height;
    g.fillStyle='${NOITE}';g.fillRect(0,0,W,H);var seed=${seed};
    function rnd(){seed=(seed*1664525+1013904223)%4294967296;return seed/4294967296}
    for(var i=0;i<Math.round(W*H/3400);i++){var x=rnd()*W,y=rnd()*H,r=rnd()*1.6+.3,a=rnd()*.5+.08;
      g.beginPath();g.arc(x,y,r,0,7);g.fillStyle='rgba(242,231,206,'+a.toFixed(3)+')';g.fill()}
    for(var j=0;j<5;j++){var bx=rnd()*W,by=rnd()*H*.55,gr=g.createRadialGradient(bx,by,0,bx,by,34);
      gr.addColorStop(0,'rgba(245,211,131,.5)');gr.addColorStop(.25,'rgba(232,179,60,.12)');gr.addColorStop(1,'rgba(11,14,34,0)');
      g.fillStyle=gr;g.fillRect(bx-34,by-34,68,68)}
    document.documentElement.setAttribute('data-pronto','1')})();
  </script>`}
  </body></html>`
}
