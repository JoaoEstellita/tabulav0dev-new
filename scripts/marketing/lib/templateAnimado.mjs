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
import { SANS, MONO, fontesEmbutidas, SANS_ESCOLHIDA } from './fontes.mjs'
import { SIGNOS_INFO } from './ceu.mjs'
import {
  CX, CY, R_SIGNO_FORA, R_SIGNO_DENTRO, R_ASPECTO, R_PLANETA,
  RAIO_CORPO, CORES_CARTA, ACHATAMENTO,
  ponto, arredonda, setorSigno, distribuir, desenhoCorpo, imagemCorpo,
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
  const temLegenda = Array.isArray(dados.roteiroLegenda) && dados.roteiroLegenda.length > 0

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
                  font-family="${MONO}"
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

  // Índice de cada corpo na efeméride animada, para o script achar a longitude
  // do quadro sem procurar por nome a cada frame.
  const indiceNaEfemeride = Object.fromEntries(
    (dados.efemeride?.nomes || []).map((n, i) => [n, i])
  )

  const corposSvg = distribuidos.map((c) => {
    const p = ponto(c.longitude, c.raio)
    const t1 = ponto(c.longitude, R_SIGNO_DENTRO)
    const t2 = ponto(c.longitude, R_SIGNO_DENTRO - 22)
    const i = ordemEntrada.indexOf(c.nome)
    const idx = indiceNaEfemeride[c.nome]
    // `data-corpo` e `data-raio` são o que o script usa para reposicionar o
    // grupo a cada quadro; sem efeméride embutida nada se move e o desenho
    // continua exatamente como antes.
    /**
     * Quem não é o assunto entra apagado.
     *
     * O João assistiu e viu a Lua atravessando dois signos enquanto a manchete
     * falava de Mercúrio. Medido na mesma janela: a Lua varre 74,7° e Mercúrio
     * anda 7,3° — dez vezes mais. O olho segue o que se move, então sem
     * hierarquia o vídeo entrega o protagonismo a quem passava por ali.
     *
     * Apagar, e não esconder: o céu inteiro continua ali, que é o que separa
     * esta peça de uma ilustração.
     */
    const ehProtagonista = c.nome === dados.corpoProtagonista
    const opacidade = !dados.corpoProtagonista ? 1 : ehProtagonista ? 1 : 0.25

    /**
     * O anel e o nome do protagonista.
     *
     * Só apagar os outros não bastou: dez discos coloridos numa roda grande, e
     * o de Mercúrio tem 13px de raio. Sem uma marca própria, ele continua sendo
     * mais um ponto — e o rastro, num planeta que anda 7° na janela, é curto
     * demais para servir de indicação.
     */
    const raioDisco = RAIO_CORPO[c.nome]
    const marca = ehProtagonista
      ? `<circle class="anel" r="${arredonda(raioDisco + 11)}" fill="none"
                 stroke="${BRONZE}" stroke-width="2.4" opacity="0.9"/>
         <text class="nome-prot" x="0" y="${arredonda(-raioDisco - 22)}" text-anchor="middle"
               fill="${BRONZE}" font-family="${MONO}" font-size="21" letter-spacing="2.6">${(c.nomePt || c.nome).toUpperCase()}</text>`
      : ''

    return `<g class="corpo" data-ordem="${i < 0 ? 0 : i}"
                data-corpo="${idx === undefined ? '' : idx}" data-raio="${c.raio}"
                data-protagonista="${ehProtagonista ? '1' : ''}"
                data-alvo-opacidade="${opacidade}" opacity="${opacidade}">
      <line class="tique" x1="${arredonda(t1.x)}" y1="${arredonda(t1.y)}" x2="${arredonda(t2.x)}" y2="${arredonda(t2.y)}"
            stroke="${VELLUM}" stroke-width="1.6" opacity="0.5"/>
      ${c.raio < R_PLANETA ? (() => {
        const a = ponto(c.longitude, c.raio + RAIO_CORPO[c.nome] + 3)
        const b = ponto(c.longitude, R_SIGNO_DENTRO - 24)
        return `<line class="haste" x1="${arredonda(a.x)}" y1="${arredonda(a.y)}" x2="${arredonda(b.x)}" y2="${arredonda(b.y)}"
                      stroke="${SLATE}" stroke-width="1" opacity="0.55" stroke-dasharray="3 4"/>`
      })() : ''}
      <g class="disco" transform="translate(${arredonda(p.x)} ${arredonda(p.y)})">${dados.dirPlanetas ? imagemCorpo(c.nome, dados.dirPlanetas) : desenhoCorpo(c.nome)}${marca}</g>
    </g>`
  }).join('')

  // Rastro do protagonista: um arco tênue do ponto de partida até onde ele está.
  // É o que faz o movimento ser lido em dois segundos em vez de exigir que
  // alguém compare mentalmente o primeiro quadro com o último.
  const rastro = dados.efemeride
    ? `<path id="rastro" fill="none" stroke="${BRONZE}" stroke-width="7"
             stroke-linecap="round" stroke-linejoin="round" opacity="0.8" d=""/>`
    : ''

  // `data-corpo` liga a linha da lista à efeméride: sem isso a lista ficava
  // congelada no instante inicial enquanto a roda andava, e "Mercúrio 26° Câncer"
  // aparecia embaixo de um desenho que já mostrava Mercúrio entrando em Leão.
  const posicoes = dados.corpos.map((c, i) => `
    <div class="pos" data-ordem="${i}" data-corpo="${indiceNaEfemeride[c.nome] ?? ''}">
      <svg viewBox="-26 -26 52 52" aria-hidden="true"><g transform="scale(0.94)">${dados.dirPlanetas ? imagemCorpo(c.nome, dados.dirPlanetas) : desenhoCorpo(c.nome)}</g></svg>
      <span class="pn">${c.nomePt}${c.retrogrado ? '<i>℞</i>' : ''}</span>
      <span class="pg">${c.grau}° ${c.signo}</span>
    </div>`).join('')

  return `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8">
<style>
  ${fontesEmbutidas(SANS_ESCOLHIDA)}
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

  /* A roda é a peça. Com os blocos de canto fora, ela ocupa o quadro inteiro e
     fica centrada no espaço que sobra acima da legenda queimada. */
  .roda { display: grid; place-items: center; margin-top: 3cqw; }
  .roda svg { width: 100%; height: auto; display: block; }

  /* As dez posições, discretas, num rodapé de ordem fixa — a única informação
     de canto que o João quis manter. Duas colunas de cinco: a ordem não muda
     entre os dias, então quem acompanha sabe onde procurar. */
  /* No TOPO, e legível. Estava no rodapé e a 72% de opacidade: no celular, com
     o vídeo rodando, virava um borrão cinza. Quem lê a lista quer conferir um
     grau — se precisa apertar os olhos, não serve para nada. */
  .posicoes {
    display: grid; grid-template-columns: repeat(2, 1fr);
    gap: 0.9cqw 3.4cqw;
    margin-bottom: 1cqw;
  }
  .pos {
    display: flex; align-items: center; gap: 1.2cqw;
    font-family: ${MONO};
    font-size: 2.25cqw;
  }
  .pos svg { flex-shrink: 0; width: 2.8cqw; height: 2.8cqw; }
  .pn { color: ${VELLUM}; letter-spacing: 0.04em; }
  .pn i { font-style: normal; color: ${BRONZE}; margin-left: 0.5cqw; }
  .pg { color: #9AA3C0; margin-left: auto; font-variant-numeric: tabular-nums; }

  /* legenda queimada: faixa fixa, alta o bastante para caber duas linhas sem
     empurrar nada — a posição não pode dançar entre segmentos */
  .faixa {
    position: absolute; left: 0; right: 0; bottom: 9cqw; z-index: 6;
    display: flex; justify-content: center; padding: 0 7cqw;
    pointer-events: none;
  }
  .faixa-caixa {
    max-width: 88%; padding: 2.6cqw 3.6cqw; border-radius: 2.2cqw;
    background: rgba(11,10,20,0.86);
    border: 0.12cqw solid rgba(201,162,39,0.35);
    font-family: ${SANS};
    font-size: 5.2cqw; line-height: 1.24; color: ${VELLUM}; text-align: center;
    text-wrap: balance; opacity: 0;
  }

  /* o primeiro tempo: a manchete sozinha, sobre o campo estelar */
  .hook {
    position: absolute; inset: 0; z-index: 5;
    display: flex; flex-direction: column; justify-content: center; align-items: center;
    gap: 3cqw; padding: 0 9cqw; text-align: center;
    /* Sem cortina: quem some é o conteúdo, não o fundo. Cobrir a carta com um
       véu deixava a roda e a lista de planetas atravessando o texto do hook, e
       um véu opaco apagaria o campo estelar junto. */
  }
  .hook-rot, .hook-dado {
    font-family: ${MONO};
    font-size: 2.9cqw; letter-spacing: 0.16em; text-transform: uppercase; color: ${BRONZE};
  }
  .hook-dado { color: ${SLATE}; letter-spacing: 0.1em; }
  .hook-titulo {
    font-family: ${SANS};
    font-size: 10.5cqw; line-height: 1.02; font-weight: 400; color: ${VELLUM};
    letter-spacing: -0.015em; text-wrap: balance;
    text-shadow: 0 0.4cqw 3cqw rgba(7,10,24,0.9);
  }
</style></head>
<body>
  <div class="palco">
    <canvas id="ceu" width="${largura}" height="${altura}"></canvas>
    <div class="brilho"></div>

    ${/* O primeiro tempo. A carta já estava toda visível no quadro zero — o
          problema não era espera, era hierarquia: a roda ocupa 60% da tela e a
          manchete ficava pequena embaixo, então em miniatura o olho lia o
          gráfico primeiro. Aqui a afirmação abre sozinha e sai em 1,4s. */ ''}
    <div class="hook" id="hook">
      ${dados.vesperaRotulo ? `<span class="hook-rot">${dados.vesperaRotulo}</span>` : ''}
      <h2 class="hook-titulo">${dados.titulo}</h2>
      ${dados.subtitulo ? `<span class="hook-dado">${dados.subtitulo}</span>` : ''}
    </div>

    ${/* A maioria assiste sem som. Sem isto o Reel depende de alguém parar para
          ler o bloco estático embaixo do gráfico, e é aí que o dedo passa. */ ''}
    <div class="faixa"><div class="faixa-caixa" id="faixa"></div></div>

    <div class="conteudo">
      ${/* Nada nos cantos além da lista de planetas. Saíram "Carta do céu", a
            data, a legenda de harmônico/tenso, o bloco de título e a assinatura:
            o pedido do João foi "apenas a imagem e a legenda", e cada um desses
            elementos disputava atenção com o mapa sem informar nada que a
            legenda já não diga. */ ''}
      <div class="posicoes">${posicoes}</div>

      <div class="roda">
        <svg viewBox="0 0 1000 1000" role="img" aria-label="Carta do céu do dia, animada">
          <g id="giro">
            <ellipse class="aro" cx="${CX}" cy="${CY}" rx="${R_SIGNO_FORA}" ry="${arredonda(R_SIGNO_FORA * ACHATAMENTO)}" fill="none" stroke="${TRACO}" stroke-width="1.6" opacity="1"/>
            <ellipse class="aro" cx="${CX}" cy="${CY}" rx="${R_SIGNO_DENTRO}" ry="${arredonda(R_SIGNO_DENTRO * ACHATAMENTO)}" fill="none" stroke="${TRACO}" stroke-width="1.4" opacity="1"/>
            <ellipse class="aro" cx="${CX}" cy="${CY}" rx="${R_ASPECTO}" ry="${arredonda(R_ASPECTO * ACHATAMENTO)}" fill="none" stroke="#1B2035" stroke-width="1" opacity="1"/>
            ${setores}${divisoes}${rotulosSigno}
            ${linhasAspecto}
            ${rastro}
            ${corposSvg}
            <circle class="aro" cx="${CX}" cy="${CY}" r="3.5" fill="${SLATE}" opacity="1"/>
          </g>
        </svg>
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

  var hook = document.getElementById('hook');
  var conteudo = document.querySelector('.conteudo');
  var faixa = document.getElementById('faixa');
  var roteiro = ${JSON.stringify(dados.roteiroLegenda || [])};

  // Efeméride quadro a quadro, calculada em Node. O navegador não faz
  // astronomia: só lê a longitude do quadro. É o que mantém o vídeo
  // determinístico — o mesmo dia produz o mesmo arquivo.
  var QUADROS = ${JSON.stringify(dados.efemeride?.quadros || [])};
  var CX = ${CX}, CY = ${CY}, ACHATA = ${ACHATAMENTO};
  var rastro = document.getElementById('rastro');
  var gruposCorpo = Array.prototype.slice.call(document.querySelectorAll('.corpo'));
  var linhasPos = Array.prototype.slice.call(document.querySelectorAll('.pos'));
  var NOMES_SIGNO = ${JSON.stringify(SIGNOS_INFO.map((s) => s.nome))};

  /** Signo e grau a partir da longitude — aritmética, não astronomia. */
  function posicaoEmSigno(lon) {
    var l = ((lon % 360) + 360) % 360;
    return { signo: NOMES_SIGNO[Math.floor(l / 30)], grau: Math.floor(l % 30) };
  }

  function pontoDaRoda(lon, raio) {
    var a = ((180 + lon) * Math.PI) / 180;
    return { x: CX + raio * Math.cos(a), y: CY - raio * Math.sin(a) * ACHATA };
  }

  function moverCeu(t) {
    if (!QUADROS.length) return;
    var q = Math.min(QUADROS.length - 1, Math.max(0, Math.round(t * (QUADROS.length - 1))));
    var linha = QUADROS[q];

    for (var i = 0; i < gruposCorpo.length; i++) {
      var g = gruposCorpo[i];
      var idx = g.dataset.corpo;
      if (idx === '') continue;
      var lon = linha[Number(idx)];
      var raio = Number(g.dataset.raio);

      var p = pontoDaRoda(lon, raio);
      var t1 = pontoDaRoda(lon, ${R_SIGNO_DENTRO});
      var t2 = pontoDaRoda(lon, ${R_SIGNO_DENTRO - 22});

      var disco = g.querySelector('.disco');
      if (disco) disco.setAttribute('transform', 'translate(' + p.x.toFixed(2) + ' ' + p.y.toFixed(2) + ')');
      var tique = g.querySelector('.tique');
      if (tique) {
        tique.setAttribute('x1', t1.x.toFixed(2)); tique.setAttribute('y1', t1.y.toFixed(2));
        tique.setAttribute('x2', t2.x.toFixed(2)); tique.setAttribute('y2', t2.y.toFixed(2));
      }
      // a haste liga o corpo recuado ao seu tique; some junto quando não há
      var haste = g.querySelector('.haste');
      if (haste) {
        var a = pontoDaRoda(lon, raio + 26);
        var b = pontoDaRoda(lon, ${R_SIGNO_DENTRO - 24});
        haste.setAttribute('x1', a.x.toFixed(2)); haste.setAttribute('y1', a.y.toFixed(2));
        haste.setAttribute('x2', b.x.toFixed(2)); haste.setAttribute('y2', b.y.toFixed(2));
      }

      if (rastro && g.dataset.protagonista === '1' && q > 0) {
        var d = '';
        for (var k = 0; k <= q; k += 3) {
          var pk = pontoDaRoda(QUADROS[k][Number(idx)], raio);
          d += (k === 0 ? 'M ' : 'L ') + pk.x.toFixed(1) + ' ' + pk.y.toFixed(1) + ' ';
        }
        rastro.setAttribute('d', d);
      }
    }

    // A lista anda junto: os graus embaixo têm que bater com os discos em cima.
    for (var n = 0; n < linhasPos.length; n++) {
      var el = linhasPos[n];
      var ip = el.dataset.corpo;
      if (ip === '') continue;
      var pos = posicaoEmSigno(linha[Number(ip)]);
      var alvo = el.querySelector('.pg');
      var novo = pos.grau + '\\u00b0 ' + pos.signo;
      if (alvo && alvo.textContent !== novo) alvo.textContent = novo;
    }
  }

  window.aplicarTempo = function (t) {
    // Legenda queimada. Um segmento por vez, com entrada e saída curtas: o
    // corte seco pisca no vídeo, e dois visíveis ao mesmo tempo viram borrão.
    var atual = null;
    for (var k = 0; k < roteiro.length; k++) {
      if (t >= roteiro[k].de && t < roteiro[k].ate) { atual = roteiro[k]; break; }
    }
    if (!atual) {
      faixa.style.opacity = 0;
    } else {
      if (faixa.dataset.texto !== atual.texto) {
        faixa.textContent = atual.texto;
        faixa.dataset.texto = atual.texto;
      }
      var dur = atual.ate - atual.de;
      var borda = Math.min(0.012, dur * 0.22);
      var entrando = Math.min(1, (t - atual.de) / borda);
      var saindo = Math.min(1, (atual.ate - t) / borda);
      faixa.style.opacity = Math.max(0, Math.min(entrando, saindo)).toFixed(3);
    }

    // Segura a manchete até 7% e some até 12%: em 12 segundos são 0,84s parado
    // e 0,6s de saída. Curto de propósito — o problema que a versão anterior
    // resolveu era espera entregando NADA; aqui o primeiro quadro já entrega a
    // informação mais importante, e a carta aparece antes de qualquer desistência.
    hook.style.opacity = t <= 0.07 ? 1 : Math.max(0, 1 - (t - 0.07) / 0.03);
    // O conteúdo só começa a entrar depois de o hook ter sumido. Com as
    // passagens sobrepostas, o mesmo título aparecia duas vezes no mesmo quadro
    // — o fantasma grande no meio e o definitivo embaixo.
    conteudo.style.opacity = Math.min(1, Math.max(0, (t - 0.10) / 0.05));




    moverCeu(t);

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
