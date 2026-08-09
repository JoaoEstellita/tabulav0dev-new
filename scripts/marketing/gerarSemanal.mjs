#!/usr/bin/env node
/**
 * O carrossel da semana: capa mais um slide por signo.
 *
 * O João pediu depois de olhar o vídeo diário: "pensei de fazermos leitura por
 * signos, e postar semanalmente todos os 12". É o formato que gera salvamento —
 * a pessoa precisa voltar para conferir o próprio, e por isso guarda o post. Na
 * referência que ele mostrou (@harmoniq.waves), esse tipo de peça teve 2.234
 * salvamentos contra 5.803 curtidas, proporção que post comum não alcança.
 *
 * O motor é o mesmo da peça mensal, com janela de sete dias: um mês inteiro num
 * slide vira lista de datas e ninguém guarda sete. Numa semana cabem um a três
 * eventos, que é o que se lê de passagem.
 *
 * O que faz cada slide ser diferente dos outros onze é a casa — em casas
 * inteiras, `((signo do evento − ascendente + 12) mod 12) + 1`. Doze
 * ascendentes, doze contas, doze textos. Sem isso, seria a mesma frase doze
 * vezes trocando o nome do signo, que é o que quase toda conta faz.
 *
 * Uso:
 *   node scripts/marketing/gerarSemanal.mjs                 # a semana de hoje
 *   node scripts/marketing/gerarSemanal.mjs --data=2026-08-10
 *   node scripts/marketing/gerarSemanal.mjs --upload
 */
import { mkdir, writeFile, rm } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import process from 'node:process'

import { eventosDaSemana, ORDEM_SIGNOS, GLIFO } from './lib/mensal.mjs'
import { semanaPorSigno, capaDaSemana } from './lib/vozSemana.mjs'
import { montarSlide } from './lib/templateCarrossel.mjs'

const execFileAsync = promisify(execFile)
const AQUI = path.dirname(fileURLToPath(import.meta.url))
const FRONTEND = path.resolve(AQUI, '..')
const MONOREPO = path.resolve(FRONTEND, '../..')

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
  const args = {
    data: '',
    saida: path.join(MONOREPO, 'marketing/out'),
    upload: false,
    backend: process.env.TABULA_BACKEND || 'https://tabulav0dev-backend.vercel.app',
    senha: process.env.MONITORING_PASSWORD || process.env.CRON_SECRET_TOKEN || '',
  }
  for (const a of argv.slice(2)) {
    if (a === '--upload') args.upload = true
    else if (a.startsWith('--data=')) args.data = a.slice(7)
    else if (a.startsWith('--saida=')) args.saida = path.resolve(a.slice(8))
  }
  if (args.upload && !args.senha) {
    throw new Error('Upload pedido, mas falta MONITORING_PASSWORD no ambiente.')
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
    '--force-device-scale-factor=1',
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

  const base = args.data ? new Date(`${args.data}T12:00:00Z`) : new Date()
  const semana = eventosDaSemana(base)

  if (!semana.eventos.length) {
    console.log('Semana sem evento forte: o carrossel não teria o que dizer em doze slides.')
    process.exit(0)
  }

  const capa = capaDaSemana(semana.eventos, semana.inicio, semana.fim)
  const iso = semana.inicio.toISOString().slice(0, 10)

  const slides = [
    {
      tipo: 'capa',
      olho: 'A semana no céu',
      titulo: capa.periodo.replace(' a ', '\na '),
      texto: capa.texto,
      rodape: 'efeméride calculada · casas inteiras',
    },
  ]

  for (const signo of ORDEM_SIGNOS) {
    const leitura = semanaPorSigno(semana.eventos, signo)
    if (!leitura) continue

    slides.push({
      tipo: 'signo',
      olho: `${GLIFO[signo]}  ${signo}`,
      titulo: signo,
      texto: leitura.texto,
      // A casa exata em bloco próprio: é o número que a pessoa veio procurar, e
      // diluído no parágrafo ele passa despercebido.
      destaque: {
        rotulo: `Ascendente em ${signo} · casas inteiras`,
        texto: leitura.extras.length ? leitura.extras.join('\n') : `Só este evento toca o seu mapa esta semana.`,
      },
      rodape: `${capa.periodo} · casa ${leitura.casa}`,
    })
  }

  const pasta = path.join(args.saida, iso, 'semanal')
  await mkdir(pasta, { recursive: true })
  const semente = Number(iso.replace(/-/g, ''))

  console.log(`Semana de ${capa.periodo}`)
  console.log(`Eventos: ${semana.eventos.length}`)
  console.log(`Slides : ${slides.length}\n`)

  for (let i = 0; i < slides.length; i++) {
    const nome = `${String(i + 1).padStart(2, '0')}.png`
    await renderizar(chrome, montarSlide({ ...slides[i], indice: i, total: slides.length }, semente), path.join(pasta, nome))
    console.log(`  ${i + 1}/${slides.length}  ${slides[i].titulo.replace('\n', ' ')}`)
  }

  // A legenda do post vai junto: sem ela a peça chega ao Estúdio sem o texto
  // para colar, e escrever à mão todo domingo é o atrito que mata a rotina.
  const legenda = [
    `A semana no céu · ${capa.periodo}`,
    '',
    capa.texto,
    '',
    ...ORDEM_SIGNOS.map((s) => {
      const l = semanaPorSigno(semana.eventos, s)
      return l ? `${s}: casa ${l.casa}` : null
    }).filter(Boolean),
    '',
    'A casa sai da conta de casas inteiras, a partir do ascendente. Se você não',
    'sabe o seu, dá para calcular de graça pelo WhatsApp — link na bio.',
  ].join('\n')
  await writeFile(path.join(pasta, 'legenda.txt'), legenda, 'utf8')

  console.log(`\nPronto: ${pasta}`)

  if (args.upload) {
    for (let i = 0; i < slides.length; i++) {
      const nome = `${String(i + 1).padStart(2, '0')}.png`
      await enviar(path.join(pasta, nome), iso, `carrossel/${nome}`, args)
    }
    await enviar(path.join(pasta, 'legenda.txt'), iso, 'legenda.txt', args)
    console.log('Estúdio: enviado')
  }
}

/**
 * Sobe um arquivo para o Estúdio.
 *
 * O backend aceita `carrossel/01..20` — subiu de dez por causa desta peça, que
 * tem treze slides. Com o teto antigo, Capricórnio, Aquário e Peixes não subiam.
 */
async function enviar(arquivo, iso, nome, { backend, senha }) {
  const { readFile } = await import('node:fs/promises')
  const conteudo = await readFile(arquivo)
  const resposta = await fetch(`${backend}/api/marketing-cards`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${senha}` },
    body: JSON.stringify({ dia: iso, arquivo: nome, conteudoBase64: conteudo.toString('base64') }),
  })
  if (!resposta.ok) {
    throw new Error(`${nome}: HTTP ${resposta.status} ${(await resposta.text()).slice(0, 120)}`)
  }
}

principal().catch((erro) => {
  console.error(erro.message || erro)
  process.exit(1)
})
