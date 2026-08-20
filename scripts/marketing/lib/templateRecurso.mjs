/**
 * A peça de recurso: o celular sobre o céu da marca, e o texto embaixo.
 *
 * As peças de céu têm dois elementos, a roda e o texto. Esta tem três, e o
 * terceiro é o motivo de ela existir: a tela. O celular fica grande e cortado
 * pela borda inferior do texto, que é como post de produto se lê — a tela
 * aparece inteira o bastante para ser reconhecida e não disputa o rodapé.
 *
 * O fundo é o mesmo procedural da marca das peças v3 (navy + campo estelar +
 * brilho dourado), para a peça de recurso pertencer visivelmente à mesma conta
 * — antes reusava as fotos da NASA e destoava da identidade nova.
 */
import { SANS, MONO, SERIF, fontesEmbutidas, SANS_ESCOLHIDA } from './fontes.mjs'
import { NOITE, NOITE_2, OURO, OURO_CLARO, CREME, assinatura, CSS_ASSINATURA } from './marca.mjs'
import { molduraDeCelular, estiloDoApp } from './telaDoApp.mjs'

const VOID = NOITE
const VELLUM = CREME
const BRONZE = OURO

const escapar = (s) => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** Semente determinística do campo estelar: mesma peça, mesmo céu de fundo. */
function semente(signo, variacao) {
  let h = 2166136261
  const s = `${signo || ''}#${variacao || 0}`
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) }
  return (h >>> 0) % 2147483647 || 12345
}

/**
 * @param {object} peca
 *   `{ olho, titulo, texto, onde, tela, dadosDaTela, signo, variacao, formato }`
 */
export function montarRecurso(peca) {
  const story = peca.formato === 'story'
  const largura = 1080
  const altura = story ? 1920 : 1350

  const escala = story ? 1.0 : 0.78
  const n = String(peca.texto || '').length
  const corpo = n <= 220 ? 3.6 : n <= 320 ? 3.3 : 3.0
  const seed = semente(peca.signo, peca.variacao)

  return `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8">
<style>
  ${fontesEmbutidas(SANS_ESCOLHIDA)}
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: ${largura}px; height: ${altura}px; overflow: hidden; background: ${VOID}; }

  .peca {
    position: relative; width: ${largura}px; height: ${altura}px;
    container-type: size; overflow: hidden; background: ${VOID};
  }
  canvas, .glow, .glow-ouro { position: absolute; }
  canvas { inset: 0; width: 100%; height: 100%; }

  .glow {
    left: 50%; bottom: -30cqw; width: 132cqw; height: 92cqw;
    transform: translateX(-50%);
    background: radial-gradient(ellipse at center, ${NOITE_2} 0%, rgba(11,14,34,0) 66%);
    opacity: 0.5;
  }
  .glow-ouro {
    left: 50%; top: 12cqw; width: 92cqw; height: 80cqw;
    transform: translateX(-50%);
    background: radial-gradient(ellipse at center,
      color-mix(in srgb, ${OURO} 24%, transparent) 0%,
      color-mix(in srgb, ${OURO} 8%, transparent) 34%,
      rgba(11,14,34,0) 64%);
    opacity: 0.4;
  }

  .conteudo {
    position: absolute; inset: 0; z-index: 2;
    padding: ${story ? '7cqw 7.5cqw 7cqw' : '5cqw 7.5cqw 6.5cqw'};
    display: flex; flex-direction: column; align-items: center;
  }

  /* O aparelho fica centrado no espaço que sobra: com margem inferior fixa ele
     colava no topo, e a tela de Grupos, que tem três linhas, deixava um vão de
     meio quadro entre o celular e o texto. (Sem crase aqui dentro: este bloco
     vive num template literal, e uma crase fecharia a string.) */
  .aparelho { flex: 0 0 auto; margin: auto 0 ${story ? '5cqw' : '3.2cqw'}; }

  ${estiloDoApp(escala)}

  .texto-bloco { width: 100%; margin-top: auto; }

  .olho {
    font-family: ${MONO}; font-size: 2.3cqw;
    letter-spacing: 0.22em; text-transform: uppercase; color: ${BRONZE};
    margin-bottom: 2cqw;
  }

  .titulo {
    font-family: ${SERIF}; font-weight: 600; color: ${VELLUM};
    font-size: 5.6cqw; line-height: 1.14; letter-spacing: 0.005em;
    white-space: pre-line;
    text-shadow: 0 0.4cqw 3cqw rgba(11,14,34,0.9);
  }

  .texto {
    font-family: ${SANS}; color: #E8E2D6;
    font-size: ${corpo}cqw; line-height: 1.44;
    margin-top: 2.6cqw; white-space: pre-line;
    text-shadow: 0 0.3cqw 2cqw rgba(11,14,34,0.8);
  }

  .rodape {
    margin-top: 3.4cqw; padding-top: 2.6cqw;
    border-top: 0.12cqw solid rgba(242,231,206,0.22);
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
    <div class="conteudo">
      <div class="aparelho">${molduraDeCelular(peca.tela, peca.dadosDaTela || {})}</div>
      <div class="texto-bloco">
        ${peca.olho ? `<div class="olho">${escapar(peca.olho)}</div>` : ''}
        <h1 class="titulo">${escapar(peca.titulo)}</h1>
        ${peca.texto ? `<p class="texto">${escapar(peca.texto)}</p>` : ''}
        <div class="rodape">
          <span>${escapar(peca.onde || '')}</span>
          ${assinatura(24)}
        </div>
      </div>
    </div>
  </div>
<script>
  (function () {
    var c = document.getElementById('ceu');
    var g = c.getContext('2d');
    var W = c.width, H = c.height;
    g.fillStyle = '${VOID}'; g.fillRect(0, 0, W, H);
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
      var bx = rnd() * W, by = rnd() * H * 0.5;
      var gr = g.createRadialGradient(bx, by, 0, bx, by, 34);
      gr.addColorStop(0, 'rgba(245,211,131,0.5)');
      gr.addColorStop(0.25, 'rgba(232,179,60,0.12)');
      gr.addColorStop(1, 'rgba(11,14,34,0)');
      g.fillStyle = gr; g.fillRect(bx - 34, by - 34, 68, 68);
    }
    document.documentElement.setAttribute('data-pronto', '1');
  })();
</script>
</body></html>`
}
