#!/usr/bin/env node
/**
 * A peça do mês: capa mais um slide por signo.
 *
 * Nasceu de uma referência — um post mensal por signo com 2.234 salvamentos
 * contra 5.803 curtidas. Proporção de conteúdo de consulta, do tipo que a pessoa
 * guarda para voltar, e o formato que mais falta no nosso pipeline.
 *
 * A diferença editorial está em `lib/mensal.mjs`: por signo a peça fala no
 * CONDICIONAL, e por ascendente ela dá o número exato da casa. A referência
 * afirma "your routines reset" presumindo a casa; aqui a casa é conta.
 *
 * Uso:
 *   node scripts/marketing/gerarMensal.mjs                     # mês corrente
 *   node scripts/marketing/gerarMensal.mjs --mes=2026-08
 *   node scripts/marketing/gerarMensal.mjs --separados         # 12 peças avulsas
 *   node scripts/marketing/gerarMensal.mjs --saida=D:/algum/lugar
 */
import { mkdir, writeFile, rm } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import process from 'node:process'

import {
  eventosDoMes,
  mesPorSigno,
  aberturaDoSigno,
  datasDoSigno,
  linhaDoAscendente,
  ORDEM_SIGNOS,
  GLIFO,
  nomeDoMes,
} from './lib/mensal.mjs'
import { montarSlide } from './lib/templateCarrossel.mjs'

const execFileAsync = promisify(execFile)
const AQUI = path.dirname(fileURLToPath(import.meta.url))
const FRONTEND = path.resolve(AQUI, '../..')
const MONOREPO = path.resolve(FRONTEND, '..')

const CHROME = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  '/usr/bin/google-chrome-stable',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium-browser',
  '/usr/bin/chromium',
].filter(Boolean)

function acharChrome() {
  const achado = CHROME.find((c) => existsSync(c))
  if (!achado) throw new Error('Chrome não encontrado. Defina CHROME_PATH.')
  return achado
}

function lerArgs(argv) {
  const args = { mes: '', separados: false, saida: path.join(MONOREPO, 'marketing/out') }
  for (const a of argv.slice(2)) {
    if (a === '--separados') args.separados = true
    else if (a.startsWith('--mes=')) args.mes = a.slice(6)
    else if (a.startsWith('--saida=')) args.saida = path.resolve(a.slice(8))
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

async function principal() {
  const args = lerArgs(process.argv)
  const chrome = acharChrome()

  const agora = new Date()
  const [ano, mes] = args.mes
    ? args.mes.split('-').map(Number)
    : [agora.getUTCFullYear(), agora.getUTCMonth() + 1]
  const mesIndice = mes - 1

  const eventos = eventosDoMes(ano, mesIndice)
  const totalEclipses = eventos.filter((e) => e.tipo === 'eclipse').length
  const rotuloMes = `${nomeDoMes(mesIndice)} de ${ano}`

  if (!eventos.length) {
    console.log(`${rotuloMes} — sem evento forte. A peça mensal não teria o que dizer.`)
    process.exit(0)
  }

  const slides = [
    {
      tipo: 'capa',
      olho: 'O mês inteiro',
      titulo: `${nomeDoMes(mesIndice)[0].toUpperCase()}${nomeDoMes(mesIndice).slice(1)}\nno céu`,
      texto:
        totalEclipses > 0
          ? `${totalEclipses === 1 ? 'Um eclipse' : 'Dois eclipses'}, ${eventos.length} eventos, doze eixos. O seu está aqui dentro.`
          : `${eventos.length} eventos no mês, doze eixos. O seu está aqui dentro.`,
      rodape: rotuloMes,
    },
  ]

  for (const signo of ORDEM_SIGNOS) {
    const resumo = mesPorSigno(eventos, signo)
    const datas = datasDoSigno(resumo)
    const asc = linhaDoAscendente(resumo)

    // O condicional não é timidez: é o que separa a peça de horóscopo. Nada aqui
    // afirma o que vai acontecer com quem lê.
    const corpo = [
      aberturaDoSigno(resumo, totalEclipses),
      '',
      `Se o seu Sol, Lua ou ascendente está em ${signo}, é este eixo que recebe o mês.`,
    ]

    slides.push({
      tipo: 'signo',
      olho: `${GLIFO[signo]}  ${signo}`,
      titulo: signo,
      texto: corpo.join('\n'),
      // A casa exata sai em bloco próprio: é o número que a referência não tem,
      // e diluído no parágrafo ele passa despercebido.
      destaque: asc
        ? { rotulo: `Ascendente em ${signo}`, texto: asc.texto }
        : null,
      rodape: datas.length
        ? datas.map((d) => `${d.quando} ${d.titulo}`).join('  ·  ')
        : `${rotuloMes} · sem evento no eixo`,
    })
  }

  const iso = `${ano}-${String(mes).padStart(2, '0')}`
  const pasta = path.join(args.saida, iso, 'mensal')
  await mkdir(pasta, { recursive: true })

  const semente = Number(`${ano}${String(mes).padStart(2, '0')}01`)

  console.log(`${rotuloMes}`)
  console.log(`Eventos : ${eventos.length} (${totalEclipses} eclipse${totalEclipses === 1 ? '' : 's'})`)
  console.log(`Formato : ${args.separados ? '12 peças avulsas' : 'carrossel de ' + slides.length + ' slides'}`)
  console.log(`Saída   : ${pasta}\n`)

  // `--separados` emite as doze sem capa e sem numeração: são peças de post
  // único, e "3/13" num post solto não quer dizer nada.
  const aRenderizar = args.separados ? slides.slice(1) : slides
  const total = aRenderizar.length

  for (let i = 0; i < total; i++) {
    const slide = {
      ...aRenderizar[i],
      indice: i,
      total: args.separados ? 1 : total,
    }
    const nome = args.separados
      ? `${String(i + 1).padStart(2, '0')}-${slide.titulo.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')}.png`
      : `${String(i).padStart(2, '0')}.png`
    await renderizar(chrome, montarSlide(slide, semente), path.join(pasta, nome))
    console.log(`  ${String(i + 1).padStart(2)}/${total}  ${slide.titulo.replace(/\n/g, ' ')}`)
  }

  console.log(`\n${total} peça${total === 1 ? '' : 's'} gerada${total === 1 ? '' : 's'}.`)
}

principal().catch((erro) => {
  console.error('\nFalhou:', erro.message)
  process.exit(1)
})
