#!/usr/bin/env node
/**
 * Estúdio — visor dos cards gerados, para abrir no celular.
 *
 *   node scripts/marketing/estudio.mjs
 *   node scripts/marketing/estudio.mjs --porta=4173 --saida=D:/outro/lugar
 *
 * Existe por um motivo específico: o gerador roda no PC e o Instagram se posta
 * do celular. Transferir arquivo todo dia é atrito, e atrito diário mata a
 * consistência — que é a única coisa que faz o orgânico funcionar.
 *
 * Deliberadamente NÃO é um CMS: não edita, não agenda, não guarda estado. Só
 * mostra o que o gerador já produziu, com a legenda pronta para copiar. Servidor
 * local em rede doméstica, sem deploy, sem auth, sem custo de Firestore.
 */
import { createServer } from 'node:http'
import { readdir, readFile, stat } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import os from 'node:os'

const AQUI = path.dirname(fileURLToPath(import.meta.url))
const MONOREPO = path.resolve(AQUI, '../../..')

function lerArgs(argv) {
  const args = { porta: 4173, saida: path.join(MONOREPO, 'marketing/out') }
  for (const a of argv.slice(2)) {
    const m = a.match(/^--(\w+)=(.+)$/)
    if (!m) continue
    if (m[1] === 'porta') args.porta = parseInt(m[2], 10) || 4173
    else if (m[1] === 'saida') args.saida = path.resolve(m[2])
  }
  return args
}

const args = lerArgs(process.argv)

/** Pastas `AAAA-MM-DD` com pelo menos um PNG, da mais recente para a mais antiga. */
async function listarDias() {
  let entradas
  try {
    entradas = await readdir(args.saida, { withFileTypes: true })
  } catch {
    return []
  }

  const dias = []
  for (const e of entradas) {
    if (!e.isDirectory() || !/^\d{4}-\d{2}-\d{2}$/.test(e.name)) continue

    const pasta = path.join(args.saida, e.name)
    const temFeed = await existe(path.join(pasta, 'feed.png'))
    if (!temFeed) continue

    dias.push({
      iso: e.name,
      story: await existe(path.join(pasta, 'story.png')),
      carta: await existe(path.join(pasta, 'carta.png')),
      legenda: await ler(path.join(pasta, 'legenda.txt')),
    })
  }

  return dias.sort((a, b) => b.iso.localeCompare(a.iso))
}

const existe = async (p) => { try { await stat(p); return true } catch { return false } }
const ler = async (p) => { try { return await readFile(p, 'utf8') } catch { return '' } }

const escapar = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')

/**
 * Data por extenso. `Intl` em vez de tabela de meses própria: acerta as
 * preposições do português sozinho ("13 de agosto", não "13 De Ago") e não
 * exige manutenção.
 */
const FORMATO_DATA = new Intl.DateTimeFormat('pt-BR', {
  weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC',
})

function rotularData(iso) {
  const [a, m, d] = iso.split('-').map(Number)
  const texto = FORMATO_DATA.format(new Date(Date.UTC(a, m - 1, d)))
  const prefixo = iso === new Date().toISOString().slice(0, 10) ? 'Hoje · ' : ''
  return prefixo + texto.charAt(0).toUpperCase() + texto.slice(1)
}

function paginaVazia() {
  return `<p class="vazio">Nenhum card gerado ainda.<br><br>
    Rode <code>node scripts/marketing/gerarCard.mjs --dias=9</code> e recarregue.</p>`
}

function montarPagina(dias) {
  const corpo = dias.length === 0 ? paginaVazia() : dias.map((dia, i) => `
    <article class="dia">
      <header>
        <h2>${escapar(rotularData(dia.iso))}</h2>
        <span class="iso" translate="no">${dia.iso}</span>
      </header>

      <div class="pecas">
        <figure>
          <img src="/img/${dia.iso}/feed.png" width="1080" height="1350"
               alt="Card de feed de ${escapar(rotularData(dia.iso))}" loading="lazy" decoding="async">
          <figcaption>Feed · 1080×1350</figcaption>
        </figure>
        ${dia.story ? `
        <figure>
          <img src="/img/${dia.iso}/story.png" width="1080" height="1920"
               alt="Card de story de ${escapar(rotularData(dia.iso))}" loading="lazy" decoding="async">
          <figcaption>Story · 1080×1920</figcaption>
        </figure>` : ''}
        ${dia.carta ? `
        <figure class="larga">
          <img src="/img/${dia.iso}/carta.png" width="1080" height="1350"
               alt="Carta do céu de ${escapar(rotularData(dia.iso))}" loading="lazy" decoding="async">
          <figcaption>Carta do céu · 1080×1350</figcaption>
        </figure>` : ''}
      </div>

      ${dia.legenda ? `
      <div class="legenda">
        <button type="button" class="copiar" data-alvo="leg-${i}">Copiar legenda</button>
        <p class="aviso" role="status" aria-live="polite"></p>
        <pre id="leg-${i}">${escapar(dia.legenda)}</pre>
      </div>` : ''}
    </article>`).join('')

  return `<!doctype html>
<html lang="pt-BR"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#070A18">
<title>Estúdio · Tábula Estelar</title>
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%23070A18'/%3E%3Ccircle cx='16' cy='16' r='11' fill='%23C9A227'/%3E%3Ccircle cx='21' cy='12' r='10' fill='%23070A18'/%3E%3C/svg%3E">
<style>
  :root {
    color-scheme: dark;
    --void: #070A18; --void-2: #0D1229; --vellum: #EDE6D8;
    --bronze: #C9A227; --slate: #4A5372; --linha: #1B2035;
    --serif: 'Palatino Linotype', Palatino, 'Book Antiqua', Georgia, serif;
    --mono: ui-monospace, 'Cascadia Mono', 'SF Mono', Menlo, Consolas, monospace;
  }
  * {
    margin: 0; padding: 0; box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
  }
  body {
    background: var(--void); color: var(--vellum);
    font-family: var(--mono); line-height: 1.6;
    padding: 24px 16px 64px;
    padding-left: max(16px, env(safe-area-inset-left));
    padding-right: max(16px, env(safe-area-inset-right));
    padding-bottom: max(64px, env(safe-area-inset-bottom));
    -webkit-font-smoothing: antialiased;
  }
  .topo { max-width: 640px; margin: 0 auto 32px; }
  .topo h1 {
    font-family: var(--serif); font-size: 27px; font-weight: 400; letter-spacing: -0.01em;
    text-wrap: balance;
  }
  .topo p { font-size: 12.5px; color: var(--slate); margin-top: 6px; }
  .topo .dica { color: var(--bronze); }

  .dia {
    max-width: 640px; margin: 0 auto 44px;
    border-top: 1px solid var(--linha); padding-top: 18px;
  }
  .dia header { display: flex; align-items: baseline; gap: 10px; margin-bottom: 14px; }
  .dia h2 {
    font-family: var(--serif); font-size: 20px; font-weight: 400;
    text-wrap: balance;
  }
  .iso {
    font-size: 11px; color: var(--slate); margin-left: auto; letter-spacing: .08em;
    font-variant-numeric: tabular-nums;
  }

  .pecas { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .pecas .larga { grid-column: 1 / -1; }
  figure { display: flex; flex-direction: column; gap: 7px; }
  img {
    width: 100%; height: auto; display: block;
    border: 1px solid var(--linha); border-radius: 2px;
  }
  figcaption { font-size: 10.5px; color: var(--slate); letter-spacing: .1em; text-transform: uppercase; }

  .legenda { margin-top: 16px; }
  pre {
    font-family: var(--mono); font-size: 12.5px; line-height: 1.65;
    white-space: pre-wrap; word-break: break-word;
    background: var(--void-2); border: 1px solid var(--linha);
    padding: 14px; margin-top: 10px; color: #C3BEB3;
  }
  .copiar {
    font-family: var(--mono); font-size: 12px; letter-spacing: .12em; text-transform: uppercase;
    background: transparent; color: var(--bronze);
    border: 1px solid var(--bronze); border-radius: 2px;
    padding: 11px 18px; cursor: pointer; width: 100%;
    transition: background .15s, color .15s;
  }
  .copiar:hover, .copiar:focus-visible { background: var(--bronze); color: var(--void); }
  .copiar:focus-visible { outline: 2px solid var(--vellum); outline-offset: 2px; }
  .copiar.feito { background: var(--bronze); color: var(--void); border-color: var(--bronze); }

  @media (prefers-reduced-motion: reduce) {
    .copiar { transition: none; }
  }

  /* o botão troca o próprio rótulo para quem enxerga; o leitor de tela recebe
     o aviso por aqui, que é uma região viva de verdade */
  .aviso {
    position: absolute; width: 1px; height: 1px;
    padding: 0; margin: -1px; overflow: hidden;
    clip-path: inset(50%); white-space: nowrap;
  }

  .vazio {
    max-width: 640px; margin: 60px auto; text-align: center;
    color: var(--slate); font-size: 14px;
  }
  .vazio code { color: var(--bronze); font-size: 12.5px; }

  @media (max-width: 480px) {
    .pecas { grid-template-columns: 1fr; gap: 18px; }
  }
</style>
</head><body>

<div class="topo">
  <h1>Estúdio</h1>
  <p>Segure a imagem para salvar no rolo da câmera. <span class="dica">Toque em copiar para a legenda.</span></p>
</div>

${corpo}

<script>
  // clipboard.writeText exige contexto seguro; em HTTP na rede local não existe,
  // então o caminho principal é o textarea + execCommand
  function copiar(texto) {
    var area = document.createElement('textarea');
    area.value = texto;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.top = '-1000px';
    document.body.appendChild(area);
    area.select();
    area.setSelectionRange(0, texto.length);
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    document.body.removeChild(area);

    if (!ok && navigator.clipboard) {
      navigator.clipboard.writeText(texto).catch(function () {});
      return true;
    }
    return ok;
  }

  document.querySelectorAll('.copiar').forEach(function (botao) {
    var aviso = botao.parentNode.querySelector('.aviso');

    botao.addEventListener('click', function () {
      var alvo = document.getElementById(botao.dataset.alvo);
      if (!alvo) return;

      var ok = copiar(alvo.textContent);
      botao.textContent = ok ? 'Copiado' : 'Selecione e copie à mão';
      botao.classList.toggle('feito', ok);
      if (aviso) {
        aviso.textContent = ok
          ? 'Legenda copiada para a área de transferência.'
          : 'Não foi possível copiar. Selecione o texto abaixo e copie à mão.';
      }

      setTimeout(function () {
        botao.textContent = 'Copiar legenda';
        botao.classList.remove('feito');
        if (aviso) aviso.textContent = '';
      }, 2200);
    });
  });
</script>
</body></html>`
}

const servidor = createServer(async (req, res) => {
  const url = new URL(req.url, 'http://local')

  if (url.pathname === '/') {
    const html = montarPagina(await listarDias())
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' })
    return res.end(html)
  }

  const img = url.pathname.match(/^\/img\/(\d{4}-\d{2}-\d{2})\/(feed|story|carta)\.png$/)
  if (img) {
    // o padrão da rota já limita dia e arquivo; nada de caminho vindo do cliente
    const arquivo = path.join(args.saida, img[1], `${img[2]}.png`)
    try {
      const dados = await readFile(arquivo)
      res.writeHead(200, { 'Content-Type': 'image/png', 'Cache-Control': 'no-store' })
      return res.end(dados)
    } catch {
      res.writeHead(404); return res.end('não encontrado')
    }
  }

  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
  res.end('não encontrado')
})

function enderecosDaRede() {
  const saida = []
  for (const [, faixas] of Object.entries(os.networkInterfaces())) {
    for (const f of faixas || []) {
      if (f.family === 'IPv4' && !f.internal) saida.push(f.address)
    }
  }
  return saida
}

servidor.listen(args.porta, '0.0.0.0', async () => {
  const dias = await listarDias()
  console.log(`\nEstúdio no ar — ${dias.length} dia(s) disponível(is)\n`)
  console.log(`  neste PC     http://localhost:${args.porta}`)
  for (const ip of enderecosDaRede()) {
    console.log(`  no celular   http://${ip}:${args.porta}`)
  }
  console.log(`\n  servindo     ${args.saida}`)
  console.log(`\nCelular precisa estar no mesmo Wi-Fi. Ctrl+C para encerrar.\n`)
})
