#!/usr/bin/env node
/**
 * Gera o card diário "céu de hoje" para Instagram — feed, story e legenda.
 *
 *   node scripts/marketing/gerarCard.mjs
 *   node scripts/marketing/gerarCard.mjs --data=2026-08-12
 *   node scripts/marketing/gerarCard.mjs --dias=9          (enche a grade)
 *   node scripts/marketing/gerarCard.mjs --saida=D:/algum/lugar
 *
 * Saída padrão: <monorepo>/marketing/out/AAAA-MM-DD/ — fora dos repositórios
 * git, para não sujar o versionamento com binários.
 *
 * Renderiza com o Chrome já instalado (flag `--screenshot`), sem dependência
 * nova: o design mora em HTML/CSS e o screenshot é fiel ao que o navegador
 * mostra ao abrir o arquivo.
 */
import { mkdir, writeFile, readFile, rm } from 'node:fs/promises'
import process from 'node:process'
import { existsSync } from 'node:fs'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

import { lerLiterais } from './lib/catalogo.mjs'
import { encontroDoDia, areaDoEncontro } from './lib/ceu.mjs'
import { montarCard } from './lib/template.mjs'

const execFileAsync = promisify(execFile)

const AQUI = path.dirname(fileURLToPath(import.meta.url))
const FRONTEND = path.resolve(AQUI, '../..')
const MONOREPO = path.resolve(FRONTEND, '..')

const CANDIDATOS_CHROME = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  process.env.LOCALAPPDATA && path.join(process.env.LOCALAPPDATA, 'Google/Chrome/Application/chrome.exe'),
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  // Linux: o runner do GitHub Actions traz google-chrome-stable
  '/usr/bin/google-chrome-stable',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium-browser',
  '/usr/bin/chromium',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].filter(Boolean)

function acharChrome() {
  for (const c of CANDIDATOS_CHROME) if (existsSync(c)) return c
  throw new Error(
    'Chrome não encontrado. Defina CHROME_PATH apontando para o executável.\n' +
      'Procurei em:\n  ' + CANDIDATOS_CHROME.join('\n  ')
  )
}

const BACKEND_PADRAO = 'https://tabulav0dev-backend.vercel.app'

function lerArgs(argv) {
  const args = {
    dias: 1,
    data: null,
    saida: path.join(MONOREPO, 'marketing/out'),
    upload: false,
    // Localmente uma falha de rede não deve abortar nada: o card já está no
    // disco. Na automação, silêncio é pior — ninguém veria o Estúdio parar.
    exigirUpload: false,
    backend: process.env.TABULA_BACKEND || BACKEND_PADRAO,
  }
  for (const a of argv.slice(2)) {
    if (a === '--upload') { args.upload = true; continue }
    if (a === '--exigir-upload') { args.upload = true; args.exigirUpload = true; continue }
    const m = a.match(/^--(\w+)=(.+)$/)
    if (!m) continue
    if (m[1] === 'dias') args.dias = Math.max(1, parseInt(m[2], 10) || 1)
    else if (m[1] === 'data') args.data = m[2]
    else if (m[1] === 'saida') args.saida = path.resolve(m[2])
    else if (m[1] === 'backend') args.backend = m[2].replace(/\/+$/, '')
    else if (m[1] === 'upload') args.upload = m[2] !== 'false'
  }
  return args
}

/**
 * Envia os arquivos do dia para o Storage, via backend.
 *
 * O gerador precisa do Chrome, então roda nesta máquina; o Instagram se posta
 * do celular. Sem o upload, publicar exige estar em casa, no mesmo Wi-Fi, com o
 * PC ligado. A senha é a mesma do painel de monitoramento.
 */
async function enviarParaNuvem(pasta, iso, { backend, senha }) {
  const arquivos = ['feed.png', 'story.png', 'legenda.txt']
  const enviados = []

  for (const nome of arquivos) {
    const alvo = path.join(pasta, nome)
    if (!existsSync(alvo)) continue

    const conteudo = await readFile(alvo)
    const resposta = await fetch(`${backend}/api/marketing-cards`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${senha}`,
      },
      body: JSON.stringify({ dia: iso, arquivo: nome, conteudoBase64: conteudo.toString('base64') }),
    })

    if (!resposta.ok) {
      const detalhe = await resposta.text().catch(() => '')
      throw new Error(`${nome}: HTTP ${resposta.status} ${detalhe.slice(0, 120)}`)
    }
    enviados.push(nome)
  }

  return enviados
}

/** Meio-dia UTC representa o dia inteiro sem depender do fuso de quem roda. */
function meioDiaUTC(iso) {
  const [a, m, d] = iso.split('-').map(Number)
  return new Date(Date.UTC(a, m - 1, d, 12, 0, 0))
}

const paraISO = (data) => data.toISOString().slice(0, 10)

async function carregarCatalogos() {
  const [titulos, aforismos, areas, orbes] = await Promise.all([
    lerLiterais(path.join(FRONTEND, 'src/data/transitTitlesPtBR.ts'), ['TRANSIT_TITLES_PTBR']),
    lerLiterais(path.join(FRONTEND, 'src/data/transitAphorismsPtBR.ts'), ['TRANSIT_APHORISMS_PTBR']),
    lerLiterais(path.join(FRONTEND, 'src/constants/lifeAreas.ts'), [
      'LIFE_AREA_ATTRIBUTION', 'LIFE_AREA_COLORS', 'LIFE_AREA_LABELS',
    ]),
    lerLiterais(path.join(FRONTEND, 'src/astro/aspect-config.ts'), ['PLANET_ASPECT_ORBS']),
  ])

  return {
    titulos: titulos.TRANSIT_TITLES_PTBR,
    aforismos: aforismos.TRANSIT_APHORISMS_PTBR,
    atribuicao: areas.LIFE_AREA_ATTRIBUTION,
    cores: areas.LIFE_AREA_COLORS,
    rotulos: areas.LIFE_AREA_LABELS,
    orbes: orbes.PLANET_ASPECT_ORBS,
  }
}

/** Semente do campo estelar: mesma data, mesmo céu. */
function semente(iso) {
  return Number(iso.replace(/-/g, ''))
}

/** Sol e Lua pedem artigo em português; os demais planetas, não. */
const ARTIGO = { Sol: 'o ', Lua: 'a ' }
const comArtigo = (nome, maiuscula = false) => {
  const art = ARTIGO[nome] || ''
  return (maiuscula && art ? art[0].toUpperCase() + art.slice(1) : art) + nome
}

/**
 * Legenda do post. Segue a régua da campanha: fala do céu (verificável), admite
 * o limite — o céu é de todos, a casa é sua — e transforma isso no CTA.
 */
function montarLegenda(e) {
  const agente = comArtigo(e.agentePt)
  const alvo = comArtigo(e.alvoPt)
  const pos = (p) => p.replace(/° /, '° de ')

  return `${e.titulo}.

Hoje ${agente} está a ${pos(e.agentePos)} e ${alvo} a ${pos(e.alvoPos)}. Entre os dois, ${e.aspectoRotulo.toLowerCase()} — ${e.orbeFormatado} de orbe. Isso é astronomia: dá pra conferir em qualquer efeméride.

Só que esse é o céu de todo mundo. O que muda de pessoa pra pessoa é ONDE ele cai no seu mapa — a casa. E é a casa que diz se o assunto é ${e.areaLabel.toLowerCase()} ou outra coisa inteiramente.

${e.aforismo}

Seu mapa calculado de verdade, grátis, no link da bio. 🌘

#astrologia #mapanatal #transitos #${e.agentePt.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')} #astrologiareal #autoconhecimento #astrologiabrasil #efemerides`
}

async function renderizar(chrome, html, destinoPng, largura, altura) {
  const temp = destinoPng.replace(/\.png$/, '.html')
  await writeFile(temp, html, 'utf8')

  // Em CI o Chrome pode rodar sem os privilegios que o sandbox exige, e /dev/shm
  // do container e pequeno demais para o rasterizador.
  const flagsCI = process.env.CI ? ['--no-sandbox', '--disable-dev-shm-usage'] : []

  await execFileAsync(chrome, [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--force-device-scale-factor=1',
    '--default-background-color=00000000',
    ...flagsCI,
    `--window-size=${largura},${altura}`,
    '--virtual-time-budget=4000',
    `--screenshot=${destinoPng}`,
    `file:///${temp.replace(/\\/g, '/')}`,
  ], { timeout: 60_000 })

  if (!existsSync(destinoPng)) {
    throw new Error(`Chrome não gerou ${path.basename(destinoPng)} — HTML preservado em ${temp}`)
  }
  await rm(temp, { force: true })
}

/**
 * Chaves publicadas nos últimos dias, para não repetir texto na grade.
 *
 * Guardado num JSON ao lado das imagens — não vale um banco, e apagar a pasta
 * de saída zera o histórico junto, que é o comportamento esperado.
 */
const JANELA_SEM_REPETIR = 14

async function lerHistorico(raizSaida) {
  try {
    const bruto = await readFile(path.join(raizSaida, '.historico.json'), 'utf8')
    return JSON.parse(bruto)
  } catch {
    return {}
  }
}

async function salvarHistorico(raizSaida, historico) {
  // mantém a janela enxuta: entradas antigas não influenciam mais nada
  const corte = new Date(Date.now() - JANELA_SEM_REPETIR * 3 * 86_400_000)
  const podado = Object.fromEntries(
    Object.entries(historico).filter(([iso]) => meioDiaUTC(iso) >= corte)
  )
  await writeFile(
    path.join(raizSaida, '.historico.json'),
    JSON.stringify(podado, null, 2),
    'utf8'
  )
}

/** Chaves usadas na janela que precede `iso`. */
function chavesRecentes(historico, iso) {
  const fim = meioDiaUTC(iso).getTime()
  const inicio = fim - JANELA_SEM_REPETIR * 86_400_000
  const usadas = new Set()
  for (const [dia, chave] of Object.entries(historico)) {
    const t = meioDiaUTC(dia).getTime()
    if (t >= inicio && t <= fim) usadas.add(chave)
  }
  return usadas
}

async function gerarUmDia(chrome, cat, iso, raizSaida, historico) {
  const data = meioDiaUTC(iso)
  const bruto = encontroDoDia(
    data, cat.orbes, cat.titulos, cat.aforismos, chavesRecentes(historico, iso)
  )

  if (!bruto) {
    return { iso, pulado: 'nenhum aspecto com texto curado no catálogo' }
  }

  const area = areaDoEncontro(bruto, cat.atribuicao)
  const encontro = {
    ...bruto,
    agentePos: bruto.agentePos.rotulo,
    alvoPos: bruto.alvoPos.rotulo,
    area,
    areaLabel: cat.rotulos[area] || area,
    cor: (cat.cores[area] || ['#4ECDC4'])[0],
    dataRotulo: iso.slice(8) + '.' + iso.slice(5, 7),
    semente: semente(iso),
  }

  const pasta = path.join(raizSaida, iso)
  await mkdir(pasta, { recursive: true })

  await renderizar(chrome, montarCard(encontro, 'feed'), path.join(pasta, 'feed.png'), 1080, 1350)
  await renderizar(chrome, montarCard(encontro, 'story'), path.join(pasta, 'story.png'), 1080, 1920)
  await writeFile(path.join(pasta, 'legenda.txt'), montarLegenda(encontro), 'utf8')

  return { iso, encontro, pasta }
}

async function principal() {
  const args = lerArgs(process.argv)
  const chrome = acharChrome()
  const cat = await carregarCatalogos()

  const inicio = args.data ? meioDiaUTC(args.data) : meioDiaUTC(paraISO(new Date()))

  await mkdir(args.saida, { recursive: true })
  const historico = await lerHistorico(args.saida)

  const senha = process.env.MONITORING_PASSWORD || process.env.CRON_SECRET_TOKEN || ''
  if (args.upload && !senha) {
    throw new Error(
      'Upload pedido, mas falta a senha.\n' +
        'Defina MONITORING_PASSWORD (a mesma do painel /monitoramento):\n' +
        '  Windows PowerShell:  $env:MONITORING_PASSWORD="..."\n' +
        '  Git Bash:            export MONITORING_PASSWORD="..."'
    )
  }

  console.log(`Chrome  : ${chrome}`)
  console.log(`Catálogo: ${Object.keys(cat.titulos).length} títulos, ${Object.keys(cat.aforismos).length} aforismos`)
  console.log(`Saída   : ${args.saida}`)
  console.log(`Upload  : ${args.upload ? args.backend : 'desligado (use --upload)'}\n`)

  let gerados = 0
  let repetidos = 0
  let enviados = 0

  for (let i = 0; i < args.dias; i++) {
    const dia = new Date(inicio.getTime() + i * 86_400_000)
    const iso = paraISO(dia)
    const r = await gerarUmDia(chrome, cat, iso, args.saida, historico)

    if (r.pulado) {
      console.log(`${iso}  —  pulado: ${r.pulado}`)
      continue
    }

    const e = r.encontro
    historico[iso] = e.chave
    if (e.repetido) repetidos++

    console.log(
      `${iso}  ${e.agentePt} ${e.aspectoRotulo} ${e.alvoPt}` +
        `  ·  orbe ${e.orbeFormatado}  ·  ${e.areaLabel}` +
        (e.repetido ? '  [repetido]' : '') +
        `\n            "${e.titulo}"`
    )
    gerados++

    if (args.upload) {
      try {
        const nomes = await enviarParaNuvem(r.pasta, iso, { backend: args.backend, senha })
        console.log(`            enviado: ${nomes.join(', ')}`)
        enviados++
      } catch (erro) {
        // o card já está no disco; falha de rede não deve abortar os outros dias
        console.log(`            upload falhou: ${erro.message}`)
      }
    }
  }

  await salvarHistorico(args.saida, historico)

  console.log(`\n${gerados} de ${args.dias} dia(s) gerado(s).`)
  if (gerados < args.dias) {
    console.log('Dias pulados não têm aspecto com texto curado — o catálogo cobre 87 chaves.')
  }
  if (repetidos > 0) {
    console.log(`${repetidos} dia(s) repetiram texto: o céu não ofereceu alternativa inédita na janela de ${JANELA_SEM_REPETIR} dias.`)
  }
  if (args.upload) {
    console.log(`${enviados} de ${gerados} enviado(s) para o Estúdio.`)
    if (args.exigirUpload && enviados < gerados) {
      throw new Error(
        `--exigir-upload: ${gerados - enviados} dia(s) não chegaram ao Estúdio.`
      )
    }
  }
}

principal().catch((erro) => {
  console.error('\nFalhou:', erro.message)
  process.exit(1)
})
