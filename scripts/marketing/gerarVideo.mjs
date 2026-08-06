#!/usr/bin/env node
/**
 * Renderiza a carta do céu animada como MP4, pronta para Reels.
 *
 *   node scripts/marketing/gerarVideo.mjs
 *   node scripts/marketing/gerarVideo.mjs --data=2026-08-20 --segundos=12
 *   node scripts/marketing/gerarVideo.mjs --fps=24 --manter-frames
 *
 * Por que puppeteer-core e não o Chrome por linha de comando: cada `--screenshot`
 * lança um processo novo, o que custa 2 a 3 segundos. Com uma instância só o
 * quadro sai em cerca de 100ms, e a diferença entre 15 minutos e 40 segundos
 * decide se isso roda todo dia ou nunca. `-core` porque o Chrome já existe tanto
 * na máquina do João quanto no runner: não baixa navegador nenhum.
 *
 * O tempo é dirigido pelo render, não pelo relógio: a página expõe
 * `aplicarTempo(t)` e cada quadro é pedido explicitamente. Um render lento
 * produz o mesmo vídeo que um rápido.
 */
import { mkdir, writeFile, rm, readdir, readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import process from 'node:process'

import { lerLiterais } from './lib/catalogo.mjs'
import { encontroDoDia, areaDoEncontro, mapaDoCeu } from './lib/ceu.mjs'
import { eventosDoDia } from './lib/eventos.mjs'
import { escrever, rotuloDeVespera } from './lib/vozes.mjs'
import { montarAnimacao } from './lib/templateAnimado.mjs'

const execFileAsync = promisify(execFile)
const AQUI = path.dirname(fileURLToPath(import.meta.url))
const FRONTEND = path.resolve(AQUI, '../..')
const MONOREPO = path.resolve(FRONTEND, '..')

/** Imagens reais dos planetas, carregadas por file:// pelo Chrome. */
const DIR_PLANETAS = path.join(FRONTEND, 'public/planets').split(path.sep).join('/')

const CANDIDATOS_CHROME = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  process.env.LOCALAPPDATA && path.join(process.env.LOCALAPPDATA, 'Google/Chrome/Application/chrome.exe'),
  '/usr/bin/google-chrome-stable',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium-browser',
  '/usr/bin/chromium',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].filter(Boolean)

function acharChrome() {
  for (const c of CANDIDATOS_CHROME) if (existsSync(c)) return c
  throw new Error('Chrome não encontrado. Defina CHROME_PATH.')
}

function lerArgs(argv) {
  const args = {
    data: null,
    segundos: 12,
    fps: 30,
    saida: path.join(MONOREPO, 'marketing/out'),
    manterFrames: false,
    upload: false,
    backend: process.env.TABULA_BACKEND || 'https://tabulav0dev-backend.vercel.app',
    senha: process.env.MONITORING_PASSWORD || process.env.CRON_SECRET_TOKEN || '',
  }
  for (const a of argv.slice(2)) {
    if (a === '--manter-frames') { args.manterFrames = true; continue }
    if (a === '--upload') { args.upload = true; continue }
    const m = a.match(/^--([\w-]+)=(.+)$/)
    if (!m) continue
    if (m[1] === 'data') args.data = m[2]
    else if (m[1] === 'segundos') args.segundos = Math.max(3, Number(m[2]) || 12)
    else if (m[1] === 'fps') args.fps = Math.max(12, Math.min(60, Number(m[2]) || 30))
    else if (m[1] === 'saida') args.saida = path.resolve(m[2])
    else if (m[1] === 'backend') args.backend = m[2].replace(/\/+$/, '')
  }
  if (args.upload && !args.senha) {
    throw new Error('Upload pedido, mas falta MONITORING_PASSWORD no ambiente.')
  }
  return args
}

const meioDiaUTC = (iso) => {
  const [a, m, d] = iso.split('-').map(Number)
  return new Date(Date.UTC(a, m - 1, d, 12, 0, 0))
}
const paraISO = (data) => data.toISOString().slice(0, 10)

async function temFfmpeg() {
  try {
    await execFileAsync('ffmpeg', ['-version'], { timeout: 15_000 })
    return true
  } catch {
    return false
  }
}

async function carregarPuppeteer() {
  try {
    return (await import('puppeteer-core')).default
  } catch {
    throw new Error(
      'puppeteer-core não está instalado.\n' +
        '  npm install puppeteer-core --no-save\n' +
        '(não baixa navegador: usa o Chrome que já existe na máquina)'
    )
  }
}

/** Mesmo criterio do card: o que muda hoje ganha do aspecto de sempre. */
function vozDoDia(data, aspectos) {
  const eventos = eventosDoDia(data, aspectos)
  const principal = eventos[0]
  if (!principal) return {}
  const v = escrever(principal)
  return {
    titulo: v.titulo,
    subtitulo: v.dado,
    textoEvento: v.texto,
    signoEvento: principal.signo || null,
    vesperaRotulo: rotuloDeVespera(principal),
    cor: COR_ELEMENTO[principal.elemento] || undefined,
  }
}

const COR_ELEMENTO = { fogo: '#FF9F40', terra: '#96E6A1', ar: '#60A5FA', agua: '#B19CD9' }

async function principal() {
  const args = lerArgs(process.argv)
  const chrome = acharChrome()
  const puppeteer = await carregarPuppeteer()

  const iso = args.data || paraISO(new Date())
  const data = meioDiaUTC(iso)

  const [titulos, aforismos, leituras, areas, orbes] = await Promise.all([
    lerLiterais(path.join(FRONTEND, 'src/data/transitTitlesPtBR.ts'), ['TRANSIT_TITLES_PTBR']),
    lerLiterais(path.join(FRONTEND, 'src/data/transitAphorismsPtBR.ts'), ['TRANSIT_APHORISMS_PTBR']),
    lerLiterais(path.join(FRONTEND, 'src/data/transitCatalogOverridesPtBR.ts'), [
      'TRANSIT_CATALOG_PTBR_OVERRIDES',
    ]),
    lerLiterais(path.join(FRONTEND, 'src/constants/lifeAreas.ts'), [
      'LIFE_AREA_ATTRIBUTION', 'LIFE_AREA_COLORS', 'LIFE_AREA_LABELS',
    ]),
    lerLiterais(path.join(FRONTEND, 'src/astro/aspect-config.ts'), ['PLANET_ASPECT_ORBS']),
  ])

  /** Duas primeiras frases: o texto inteiro do catálogo transborda o quadro. */
  const primeirasFrases = (texto, quantas = 2) => {
    if (!texto) return ''
    const frases = texto.match(/[^.!?]+[.!?]+/g)
    return frases ? frases.slice(0, quantas).join('').trim() : texto
  }

  const encontro = encontroDoDia(
    data,
    orbes.PLANET_ASPECT_ORBS,
    titulos.TRANSIT_TITLES_PTBR,
    aforismos.TRANSIT_APHORISMS_PTBR
  )
  if (!encontro) throw new Error(`${iso}: nenhum aspecto com texto curado no catálogo.`)

  const area = areaDoEncontro(encontro, areas.LIFE_AREA_ATTRIBUTION)
  const mapa = mapaDoCeu(data, orbes.PLANET_ASPECT_ORBS)

  const html = montarAnimacao({
    ...mapa,
    ...encontro,
    area,
    areaLabel: areas.LIFE_AREA_LABELS[area] || area,
    cor: (areas.LIFE_AREA_COLORS[area] || ['#4ECDC4'])[0],
    dataRotulo: iso.slice(8) + '.' + iso.slice(5, 7),
    semente: Number(iso.replace(/-/g, '')),
    leitura: primeirasFrases(leituras.TRANSIT_CATALOG_PTBR_OVERRIDES[encontro.chave], 2),
    dirPlanetas: DIR_PLANETAS,
    ...vozDoDia(data, mapa.aspectos),
  })

  const pasta = path.join(args.saida, iso)
  const pastaFrames = path.join(pasta, '_frames')
  await mkdir(pastaFrames, { recursive: true })

  const arquivoHtml = path.join(pastaFrames, 'cena.html')
  await writeFile(arquivoHtml, html, 'utf8')

  const total = Math.round(args.segundos * args.fps)
  console.log(`${iso}  ${encontro.agentePt} ${encontro.aspectoRotulo} ${encontro.alvoPt}`)
  console.log(`Chrome : ${chrome}`)
  console.log(`Quadros: ${total} (${args.segundos}s a ${args.fps}fps)\n`)

  const navegador = await puppeteer.launch({
    executablePath: chrome,
    headless: 'new',
    args: [
      '--hide-scrollbars',
      '--force-device-scale-factor=1',
      ...(process.env.CI ? ['--no-sandbox', '--disable-dev-shm-usage'] : []),
    ],
  })

  try {
    const pagina = await navegador.newPage()
    await pagina.setViewport({ width: 1080, height: 1920, deviceScaleFactor: 1 })
    await pagina.goto('file:///' + arquivoHtml.split(path.sep).join('/'), { waitUntil: 'load' })
    await pagina.waitForFunction('document.documentElement.dataset.pronto === "1"', { timeout: 30_000 })

    const inicio = Date.now()
    for (let i = 0; i < total; i++) {
      const t = total === 1 ? 0 : i / (total - 1)
      await pagina.evaluate((valor) => window.aplicarTempo(valor), t)
      await pagina.screenshot({
        path: path.join(pastaFrames, `q${String(i).padStart(5, '0')}.png`),
        optimizeForSpeed: true,
      })
      if ((i + 1) % 30 === 0 || i === total - 1) {
        const seg = ((Date.now() - inicio) / 1000).toFixed(0)
        process.stdout.write(`\r  ${i + 1}/${total} quadros  (${seg}s)`)
      }
    }
    process.stdout.write('\n')
  } finally {
    await navegador.close()
  }

  const destino = path.join(pasta, 'reel.mp4')

  if (!(await temFfmpeg())) {
    console.log('\nffmpeg não encontrado: os quadros ficaram em')
    console.log(`  ${pastaFrames}`)
    console.log('Instale o ffmpeg para montar o MP4, ou monte os quadros no editor de vídeo.')
    return
  }

  console.log('\nMontando o MP4...')
  await execFileAsync('ffmpeg', [
    '-y',
    '-framerate', String(args.fps),
    '-i', path.join(pastaFrames, 'q%05d.png'),
    // yuv420p e dimensões pares: sem isso o vídeo não abre em vários players
    '-c:v', 'libx264',
    '-pix_fmt', 'yuv420p',
    '-crf', '18',
    '-preset', 'slow',
    '-movflags', '+faststart',
    destino,
  ], { timeout: 600_000 })

  if (!args.manterFrames) await rm(pastaFrames, { recursive: true, force: true })

  const quantos = args.manterFrames ? (await readdir(pastaFrames)).length : total
  console.log(`\nPronto: ${destino}`)
  console.log(`${quantos} quadros · ${args.segundos}s · ${args.fps}fps`)

  if (args.upload) {
    const enviado = await enviarVideo(destino, iso, args)
    console.log(`Estúdio: ${enviado}`)
  }
}

/**
 * Sobe o MP4 direto ao Storage, por URL assinada.
 *
 * O POST comum passa pela função do Vercel, que corta o corpo em ~4,5 MB; um
 * Reel de 12 segundos passa disso. O backend assina uma URL de escrita e o
 * arquivo vai direto ao bucket, sem atravessar a função.
 */
async function enviarVideo(arquivo, iso, { backend, senha }) {
  const resposta = await fetch(`${backend}/api/marketing-cards?acao=url-envio`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${senha}` },
    body: JSON.stringify({ dia: iso, arquivo: 'reel.mp4' }),
  })
  if (!resposta.ok) {
    throw new Error(`URL de envio: HTTP ${resposta.status} ${(await resposta.text()).slice(0, 120)}`)
  }

  const { url, contentType, caminho } = await resposta.json()
  const corpo = await readFile(arquivo)

  const envio = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': contentType },
    body: corpo,
  })
  if (!envio.ok) {
    throw new Error(`envio do vídeo: HTTP ${envio.status} ${(await envio.text()).slice(0, 120)}`)
  }

  return caminho
}

principal().catch((erro) => {
  console.error('\nFalhou:', erro.message)
  process.exit(1)
})
