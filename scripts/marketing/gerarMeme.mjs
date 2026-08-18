#!/usr/bin/env node
/**
 * O card de meme: o clichê contra a leitura.
 *
 * ── POR QUE POR COMANDO, E NÃO PELA CASCATA ────────────────────────────────
 *
 * Sai quando o João pede, como o carrossel de tema. O meme depende de leitura
 * de sala — o que está circulando naquela semana, o que alguém disse nos
 * comentários — e não de efeméride. Pôr no rodízio automático produziria a
 * mesma piada num dia em que ninguém estava falando daquilo.
 *
 * É também o formato mais fácil de errar o tom, e por isso o que menos deve
 * sair sozinho.
 *
 * Uso:
 *   node scripts/marketing/gerarMeme.mjs --par=venusVirgem
 *   node scripts/marketing/gerarMeme.mjs --par=venusVirgem --saida=D:/algum/lugar
 *   node scripts/marketing/gerarMeme.mjs --lista
 */
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { existsSync } from 'node:fs'
import { mkdir, writeFile, rm } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import process from 'node:process'

import { MEME, CHAVES_DE_MEME, memePorId } from './lib/temasDeMeme.mjs'
import { montarMeme } from './lib/templateMeme.mjs'

const execFileAsync = promisify(execFile)
const AQUI = path.dirname(fileURLToPath(import.meta.url))
const MONOREPO = path.resolve(AQUI, '../../..')

const CHROME = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  '/usr/bin/google-chrome-stable',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium-browser',
  '/usr/bin/chromium',
]

function acharChrome() {
  const achado = CHROME.find((c) => existsSync(c))
  if (!achado) throw new Error('Chrome não encontrado. Instale ou ajuste a lista em CHROME.')
  return achado
}

function lerArgs(argv) {
  const args = { par: '', saida: path.join(MONOREPO, 'marketing/out'), lista: false }
  for (const a of argv.slice(2)) {
    if (a === '--lista') args.lista = true
    else if (a.startsWith('--par=')) args.par = a.slice(6)
    else if (a.startsWith('--saida=')) args.saida = a.slice(8)
  }
  return args
}

async function renderizar(chrome, html, destino) {
  const temp = destino.replace(/\.png$/, '.html')
  await writeFile(temp, html, 'utf8')

  const flagsCI = process.env.CI ? ['--no-sandbox', '--disable-dev-shm-usage'] : []
  await execFileAsync(chrome, [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--force-device-scale-factor=2',
    '--default-background-color=00000000',
    ...flagsCI,
    '--window-size=1080,1350',
    `--screenshot=${destino}`,
    '--virtual-time-budget=1500',
    `file:///${temp.replace(/\\/g, '/')}`,
  ])

  await rm(temp, { force: true })
}

/**
 * A legenda repete a leitura e fecha com o convite.
 *
 * Sem repetir o clichê: fora do card, solto na legenda, ele circula como se
 * fosse a opinião da conta.
 */
function legendaDoMeme(meme) {
  return [
    meme.mapa,
    '',
    'Salva para lembrar quando alguém repetir.',
    'O mapa completo sai de graça no link da bio, em dois minutos: planetas, ' +
      'casas, aspectos e dignidades.',
  ].join('\n')
}

async function principal() {
  const args = lerArgs(process.argv)

  if (args.lista || !args.par) {
    console.log('Pares disponíveis:\n')
    for (const id of CHAVES_DE_MEME) {
      console.log(`  ${id.padEnd(18)} ${MEME[id].dizem}`)
    }
    console.log('\nUso: node scripts/marketing/gerarMeme.mjs --par=<id>')
    return
  }

  const meme = memePorId(args.par)
  const chrome = acharChrome()
  const destino = path.join(args.saida, 'memes', meme.id)
  await mkdir(destino, { recursive: true })

  const png = path.join(destino, 'feed.png')
  await renderizar(chrome, montarMeme(meme), png)
  await writeFile(path.join(destino, 'legenda.txt'), legendaDoMeme(meme), 'utf8')

  console.log(`${meme.id}  ${meme.dizem}`)
  console.log(`  ${destino}`)
}

principal().catch((erro) => {
  console.error(erro)
  process.exit(1)
})
