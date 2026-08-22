#!/usr/bin/env node
/**
 * O carrossel v4 de um tema curado — capa IA fresca + miolo com a roda real.
 *
 *   node scripts/marketing/gerarCarrosselV4.mjs --tema=aspectos_movimento
 *   node scripts/marketing/gerarCarrosselV4.mjs --tema=... --data=2026-08-22 --upload
 *
 * A capa é gerada pelo Higgsfield (Soul) na hora; se ele falhar (sem login/rede
 * no ambiente), a capa cai no fundo procedural e o carrossel sai mesmo assim.
 * Os slides sobem como `carrossel/NN.png`, no mesmo formato que o Estúdio já lê.
 */
import { mkdir, writeFile, rm, readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { exec } from 'node:child_process'
import { promisify } from 'node:util'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import process from 'node:process'

import { slidesDoTema, TEMAS_V4 } from './lib/temasCarrosselV4.mjs'
import { montarSlideCard } from './lib/cardCarrossel.mjs'
import { promptDaCapa, gerarCapaIA } from './lib/imagemIA.mjs'
import { eventoAncoravel, slidesAncorados } from './lib/ancoragem.mjs'
import { lerHistorico, salvarHistorico, entradaDoDia } from './lib/historico.mjs'

const execAsync = promisify(exec)
const AQUI = path.dirname(fileURLToPath(import.meta.url))
const MONOREPO = path.resolve(AQUI, '../../..')
const BACKEND_PADRAO = 'https://tabulav0dev-backend.vercel.app'

const CANDIDATOS_CHROME = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  process.env.LOCALAPPDATA && path.join(process.env.LOCALAPPDATA, 'Google/Chrome/Application/chrome.exe'),
  '/usr/bin/google-chrome-stable', '/usr/bin/google-chrome', '/usr/bin/chromium-browser', '/usr/bin/chromium',
].filter(Boolean)

function acharChrome() {
  for (const c of CANDIDATOS_CHROME) if (existsSync(c)) return c
  throw new Error('Chrome não encontrado. Defina CHROME_PATH.')
}

function lerArgs(argv) {
  const a = { tema: '', data: '', ancorado: false, upload: false, saida: '', backend: process.env.TABULA_BACKEND || BACKEND_PADRAO, senha: process.env.MONITORING_PASSWORD || '' }
  for (const x of argv.slice(2)) {
    if (x === '--upload') a.upload = true
    else if (x === '--ancorado') a.ancorado = true
    else if (x.startsWith('--tema=')) a.tema = x.slice(7)
    else if (x.startsWith('--data=')) a.data = x.slice(7)
    else if (x.startsWith('--saida=')) a.saida = path.resolve(x.slice(8))
  }
  if (!a.saida) a.saida = path.join(MONOREPO, 'marketing/out')
  return a
}

async function renderizar(chrome, html, destino) {
  const temp = destino.replace(/\.png$/, '.html')
  await writeFile(temp, html, 'utf8')
  const flagsCI = process.env.CI ? ['--no-sandbox', '--disable-dev-shm-usage'] : []
  const args = ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1.5',
    ...flagsCI, '--window-size=1080,1080', '--virtual-time-budget=5000',
    `--screenshot=${destino}`, `file:///${temp.replace(/\\/g, '/')}`]
  await execAsync(`"${chrome}" ${args.join(' ')}`, { timeout: 60_000 })
  if (!existsSync(destino)) throw new Error(`Chrome não gerou ${path.basename(destino)}`)
  await rm(temp, { force: true })
}

async function enviar(arquivo, iso, nome, { backend, senha }) {
  const conteudo = await readFile(arquivo)
  const r = await fetch(`${backend}/api/marketing-cards`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${senha}` },
    body: JSON.stringify({ dia: iso, arquivo: nome, conteudoBase64: conteudo.toString('base64') }),
  })
  if (!r.ok) throw new Error(`${nome}: HTTP ${r.status} ${(await r.text()).slice(0, 120)}`)
}

const semente = (iso) => [...iso].reduce((s, c) => s + c.charCodeAt(0), 0)

async function principal() {
  const args = lerArgs(process.argv)
  const iso = args.data || new Date().toISOString().slice(0, 10)

  // fonte dos slides: o céu de hoje (--ancorado) ou um tema evergreen (--tema)
  let t, rotulo, chaveAncora = null
  if (args.ancorado) {
    const achado = eventoAncoravel(new Date(`${iso}T12:00:00Z`))
    if (!achado) {
      console.log(`${iso}  sem evento ancorável hoje (nada no banco de textos ancorados). Nada gerado.`)
      return
    }
    t = slidesAncorados(achado.ev, achado.chave, iso)
    rotulo = `ancorado ${achado.chave}`
    chaveAncora = achado.chave
  } else {
    if (!args.tema || !TEMAS_V4[args.tema]) {
      console.error(`tema inválido. Disponíveis: ${Object.keys(TEMAS_V4).join(', ')}`)
      process.exit(1)
    }
    t = slidesDoTema(args.tema)
    rotulo = `tema "${args.tema}"`
  }

  const chrome = acharChrome()
  const pasta = path.join(args.saida, iso, 'carrossel-v4')
  await rm(pasta, { recursive: true, force: true })
  await mkdir(pasta, { recursive: true })

  // capa IA fresca — prompt da cena + semente do dia; null cai no procedural
  const capaPng = await gerarCapaIA(promptDaCapa({ tipo: t.cena }, semente(iso)), path.join(pasta, 'capa-ia.png'))
  const capaUri = capaPng ? `data:image/png;base64,${(await readFile(capaPng)).toString('base64')}` : null
  console.log(`${iso}  ${rotulo}  capa IA: ${capaPng ? 'gerada' : 'procedural (fallback)'}`)

  for (const s of t.slides) {
    const slide = s.tipo === 'capa' ? { ...s, fundoImg: capaUri } : s
    const nome = `${String(s.n).padStart(2, '0')}.png`
    await renderizar(chrome, montarSlideCard(slide), path.join(pasta, nome))
    console.log(`  slide ${s.n}/${s.total}  ${s.olho}`)
  }
  await writeFile(path.join(pasta, 'legenda.txt'), t.legenda || '', 'utf8')

  if (args.upload) {
    if (!args.senha) throw new Error('Upload pedido, mas falta MONITORING_PASSWORD.')
    for (const s of t.slides) {
      const nome = `${String(s.n).padStart(2, '0')}.png`
      await enviar(path.join(pasta, nome), iso, `carrossel/${nome}`, args)
    }
    await enviar(path.join(pasta, 'legenda.txt'), iso, 'legenda.txt', args)
    // a capa também vira o feed.png (imagem de capa no Estúdio)
    await enviar(path.join(pasta, '01.png'), iso, 'feed.png', args)
    console.log('Estúdio: enviado')
  }

  /**
   * A ÂNCORA REGISTRA O EVENTO DO DIA NO HISTÓRICO.
   *
   * A âncora sai como peça 1 e consome o evento forte do dia (Sol entra em
   * Virgem). Sem registrar isso, a cascata da peça 2 reescolhe o mesmo evento e
   * o dia sai com carrossel e post repetindo o mesmo assunto — o erro que já
   * mordeu três vezes. Gravar a chave no slot 1 faz o `usadasHoje` de
   * `gerarEvento` pular o evento na peça seguinte (os filhos rodam em série, um
   * de cada vez, então a peça 2 já lê o que a âncora gravou).
   *
   * Só o caminho ancorado grava: os temas evergreen (`--tema`) não disputam o
   * evento do dia, e o dedup deles já vem da fila.
   */
  if (chaveAncora) {
    const historico = await lerHistorico(args.saida)
    historico[entradaDoDia(iso, 1)] = chaveAncora
    await salvarHistorico(args.saida, historico)
  }
  console.log(`  ${pasta}`)
}

principal().catch((e) => { console.error(e.message || e); process.exit(1) })
