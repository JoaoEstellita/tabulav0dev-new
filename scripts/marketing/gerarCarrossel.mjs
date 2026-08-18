#!/usr/bin/env node
/**
 * Carrossel — o formato que faltava.
 *
 * O card único entrega um fato e acaba. O carrossel obriga a arrastar, e cada
 * arraste conta como interação. As duas contas que servem de referência usam
 * carrossel para tudo que precisa de mais de uma frase; a gente só tinha peça
 * de quadro único.
 *
 * Dois roteiros, e nenhum deles inventa conteúdo:
 *
 *   eixo         capa + um slide por signo da cruz + fecho     (6 slides)
 *   explicador   capa + o que é, por que é raro, dá pra ver    (5 slides)
 *
 * Uso:
 *   node scripts/marketing/gerarCarrossel.mjs                       # hoje, roteiro automático
 *   node scripts/marketing/gerarCarrossel.mjs --data=2026-08-12
 *   node scripts/marketing/gerarCarrossel.mjs --roteiro=eixo
 *   node scripts/marketing/gerarCarrossel.mjs --saida=D:/algum/lugar
 */
import { mkdir, writeFile, rm } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import process from 'node:process'

import { mapaDoCeu } from './lib/ceu.mjs'
import { eventosDoDia } from './lib/eventos.mjs'
import { lerLiterais } from './lib/catalogo.mjs'
import { escrever, eixoDoSigno, mereceEixo, rotuloDeVespera } from './lib/vozes.mjs'
import { montarSlide, SENTIDO_ANGULO } from './lib/templateCarrossel.mjs'

const execFileAsync = promisify(execFile)
const AQUI = path.dirname(fileURLToPath(import.meta.url))
const FRONTEND = path.resolve(AQUI, '../..')
const MONOREPO = path.resolve(FRONTEND, '..')

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
  const args = { data: '', roteiro: '', saida: path.join(MONOREPO, 'marketing/out') }
  for (const a of argv.slice(2)) {
    if (a.startsWith('--data=')) args.data = a.slice(7)
    else if (a.startsWith('--roteiro=')) args.roteiro = a.slice(10)
    else if (a.startsWith('--saida=')) args.saida = a.slice(8)
  }
  return args
}

const meioDiaUTC = (iso) => {
  const [a, m, d] = iso.split('-').map(Number)
  return new Date(Date.UTC(a, m - 1, d, 12, 0, 0))
}
const paraISO = (data) => data.toISOString().slice(0, 10)

const dia = (data) =>
  new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric', month: 'long', timeZone: 'America/Sao_Paulo',
  }).format(data)

const hora = (data) =>
  new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo',
  }).format(data)

/**
 * Roteiro do eixo: um slide por signo da cruz.
 *
 * O recorte é geometria — conjunção, duas quadraturas e a oposição — então cada
 * slide diz o ângulo e o que o ângulo é, sem prometer o que vai acontecer com
 * quem lê. O que acontece depende da casa, e a casa não está no post.
 */
function roteiroEixo(evento) {
  const v = escrever(evento)
  const eixo = eixoDoSigno(evento.signo)
  if (!eixo) return null

  const vespera = rotuloDeVespera(evento)
  const anguloDoSigno = (signo) => {
    if (signo === eixo.conjuncao) return 'conjuncao'
    if (eixo.quadraturas.includes(signo)) return 'quadratura'
    if (signo === eixo.oposicao) return 'oposicao'
    return 'conjuncao'
  }

  const slides = [
    {
      tipo: 'capa',
      olho: vespera || 'Céu de hoje',
      titulo: v.titulo,
      texto: `Os quatro signos da cruz ${eixo.modalidade} recebem ângulo exato.`,
      rodape: v.dado,
    },
  ]

  for (const signo of eixo.todos) {
    const angulo = anguloDoSigno(signo)
    slides.push({
      tipo: 'signo',
      olho: `Cruz ${eixo.modalidade}`,
      titulo: signo,
      texto: SENTIDO_ANGULO[angulo],
      rodape: `${signo} · ${angulo === 'conjuncao' ? 'conjunção' : angulo}`,
    })
  }

  slides.push({
    tipo: 'fecho',
    olho: 'O limite disto',
    titulo: 'O céu é de todos.\nA casa é de cada um.',
    texto:
      'Esses quatro signos recebem o ângulo. Onde ele cai na vida de alguém depende da casa — e a casa vem da hora e do lugar do nascimento.',
    rodape: 'Mapa calculado de graça pelo WhatsApp · link na bio',
  })

  return { nome: 'eixo', slides }
}

/**
 * Roteiro explicador: para eclipse, onde há o que ensinar antes do dia.
 *
 * A visibilidade sai calculada, não presumida — é o slide que nenhuma outra
 * conta consegue fazer sem errar.
 */
function roteiroExplicador(evento) {
  if (evento.tipo !== 'eclipse') return null
  const v = escrever(evento)
  const solar = evento.luminar === 'solar'
  const vespera = rotuloDeVespera(evento)

  // Sem "Sim."/"Não." no começo: o título do slide já responde, e repetir a
  // resposta na primeira palavra do corpo soa como formulário.
  const ondeSeVe = evento.visivelBR
    ? solar
      ? `Daqui o disco do Sol aparece ${evento.obscuracaoBR}% coberto. Nunca olhe direto sem filtro próprio — óculos de sol não servem.`
      : `A Lua fica a ${evento.alturaBR}° acima do horizonte, quase no alto do céu. É só olhar para cima, a olho nu, sem equipamento nenhum.`
    : solar
      ? 'A sombra passa longe daqui. Quem estiver no Brasil não vai ver nada diferente no céu — o eclipse existe, mas não para esta janela.'
      : 'Na hora do eclipse a Lua estará abaixo do horizonte no Brasil. O evento acontece, só não para quem está deste lado do planeta.'

  return {
    nome: 'explicador',
    slides: [
      {
        tipo: 'capa',
        olho: vespera || 'Céu de hoje',
        titulo: v.titulo,
        texto: 'Três coisas que quase ninguém explica sobre eclipse.',
        rodape: v.dado,
      },
      {
        tipo: 'conceito',
        olho: '1 · o que é',
        titulo: solar ? 'A Lua na frente do Sol' : 'A Terra na frente do Sol',
        texto: solar
          ? 'Num eclipse solar a Lua fica exatamente entre a Terra e o Sol. Por isso todo eclipse solar é também uma Lua Nova — não existe um sem o outro.'
          : 'Num eclipse lunar a Terra fica entre o Sol e a Lua, e é a sombra dela que cobre a Lua. Por isso todo eclipse lunar é também uma Lua Cheia.',
        rodape: `${evento.grau}° de ${evento.signo}`,
      },
      {
        tipo: 'conceito',
        olho: '2 · por que é raro',
        titulo: 'Cinco graus de diferença',
        texto:
          'A órbita da Lua é inclinada cerca de 5° em relação à da Terra. Na maioria dos meses ela passa acima ou abaixo, e não há eclipse. Só quando o cruzamento coincide com a lunação a sombra acerta.',
        rodape: 'É por isso que não há eclipse todo mês',
      },
      {
        tipo: 'conceito',
        olho: '3 · dá para ver daqui?',
        titulo: evento.visivelBR ? 'Dá para ver do Brasil' : 'Não dá para ver do Brasil',
        texto: ondeSeVe,
        rodape: `${dia(evento.quando)}, ${hora(evento.quando)}`,
      },
      {
        tipo: 'fecho',
        olho: 'O limite disto',
        titulo: 'O céu é de todos.\nA casa é de cada um.',
        texto:
          'O eclipse acontece para o planeta inteiro no mesmo instante. Onde ele cai na vida de alguém depende da casa — e a casa vem da hora e do lugar do nascimento.',
        rodape: 'Mapa calculado de graça pelo WhatsApp · link na bio',
      },
    ],
  }
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
  const iso = args.data || paraISO(new Date())
  const data = meioDiaUTC(iso)

  const orbes = await lerLiterais(path.join(FRONTEND, 'src/astro/aspect-config.ts'), [
    'PLANET_ASPECT_ORBS',
  ])
  const mapa = mapaDoCeu(data, orbes.PLANET_ASPECT_ORBS)
  const eventos = eventosDoDia(data, mapa.aspectos)
  const evento = eventos.find((e) => e.peso >= 90)

  if (!evento) {
    console.log(`${iso}  —  sem evento forte: carrossel não tem o que explicar.`)
    console.log('Dias assim já saem como card educativo pelo gerarCard.')
    process.exit(0)
  }

  // Eclipse pede o explicador; o resto, o eixo. `--roteiro` força qualquer um.
  let roteiro = null
  if (args.roteiro === 'explicador') roteiro = roteiroExplicador(evento)
  else if (args.roteiro === 'eixo') roteiro = roteiroEixo(evento)
  else roteiro = roteiroExplicador(evento) || (mereceEixo(evento) ? roteiroEixo(evento) : null)

  if (!roteiro) {
    console.log(`${iso}  —  ${evento.tipo} não tem roteiro de carrossel.`)
    process.exit(0)
  }

  const pasta = path.join(args.saida, iso, 'carrossel')
  await mkdir(pasta, { recursive: true })

  const semente = Number(iso.replace(/-/g, ''))
  const total = roteiro.slides.length

  console.log(`${iso}  ${escrever(evento).titulo}`)
  console.log(`Roteiro : ${roteiro.nome} · ${total} slides`)
  console.log(`Saída   : ${pasta}\n`)

  for (let i = 0; i < total; i++) {
    const slide = { ...roteiro.slides[i], indice: i, total }
    const destino = path.join(pasta, `${String(i + 1).padStart(2, '0')}.png`)
    await renderizar(chrome, montarSlide(slide, semente), destino)
    console.log(`  ${i + 1}/${total}  ${slide.titulo.replace(/\n/g, ' ')}`)
  }

  console.log(`\n${total} slides gerados.`)
}

principal().catch((erro) => {
  console.error('\nFalhou:', erro.message)
  process.exit(1)
})
