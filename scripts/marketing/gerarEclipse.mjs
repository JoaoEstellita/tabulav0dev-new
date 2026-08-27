#!/usr/bin/env node
/**
 * A peça do eclipse lunar parcial em Peixes (28/08/2026).
 *
 * Um eclipse é o momento mais forte do calendário — "leva o carrossel dos doze"
 * (`formatosDoAssunto`). Este script gera o pacote inteiro, no padrão v4
 * dourado, para o João baixar e postar:
 *
 *   - post   : um card v4 com o sentido coletivo (capa por IA + gancho denso)
 *   - story  : versão vertical do mesmo recado
 *   - carrossel : capa + um card por ascendente (onde o eclipse cai no seu mapa)
 *                 + CTA para o app. A casa de cada ascendente é whole-sign:
 *                 `((Peixes − ascendente + 12) mod 12) + 1`.
 *
 * O texto coletivo é adaptado do que o João aprovou (finais, eixo Virgem–Peixes,
 * soltar o controle). A leitura por casa é curada, uma por ascendente.
 *
 * Uso:
 *   node scripts/marketing/gerarEclipse.mjs                 # salva em marketing/out/2026-08-28/eclipse
 *   node scripts/marketing/gerarEclipse.mjs --saida=...
 */
import { mkdir, writeFile, rm, readFile, copyFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { exec } from 'node:child_process'
import { promisify } from 'node:util'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import process from 'node:process'

import { montarSlideCard } from './lib/cardCarrossel.mjs'
import { montarPeca } from './lib/templatePeca.mjs'
import { gerarCapaIA } from './lib/imagemIA.mjs'
import { diagramaFase } from './lib/diagramaFato.mjs'
import { svgDoSigno } from './lib/simbolos.mjs'

const execAsync = promisify(exec)
const AQUI = path.dirname(fileURLToPath(import.meta.url))
const MONOREPO = path.resolve(AQUI, '../../..')

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

const ISO = '2026-08-28'
const DATA_ROTULO = '28 de agosto'

/** Capa por IA: lua de sangue sobre água — energia de Peixes, não o eclipse solar padrão. */
const PROMPT_CAPA =
  'a dramatic total lunar eclipse, deep coppery blood-red moon glowing low over a calm misty ocean at night, ' +
  'ethereal dreamlike Pisces water energy, soft reflections on still water, luxurious deep navy blue and gold ' +
  'color palette, mystical elegant cinematic, no text, no words, vertical composition'

/** O sentido coletivo — adaptado do texto que o João aprovou. */
const CAPA = {
  olho: `Eclipse Lunar · ${DATA_ROTULO}`,
  titulo: 'O último eclipse em *Peixes*.',
  corpo: 'Lua Cheia sobre os Nós, no signo dos finais. Dois anos de eclipses no eixo Virgem–Peixes se fecham — e pedem que você solte o controle do incontrolável.',
}

const POST_CORPO =
  'Todo eclipse lunar é uma Lua Cheia alinhada aos Nós, os pontos do destino. Daí a intensidade extra: é como várias luas cheias de uma vez, trazendo realinhamentos rápidos, finais e viradas súbitas.\n\n' +
  'Este é o ÚLTIMO eclipse em Peixes do ciclo. Depois de dois anos alternando no eixo Virgem–Peixes, ele fecha o processo com um grande final: soltar a necessidade de controlar o incontrolável e confiar no fluxo.\n\n' +
  'Virgem é ordem, rotina, o prático. Peixes é intuição, sensibilidade, a arte de soltar. O eclipse pergunta: o que ainda precisa de estrutura — e o que já pede para ser deixado para trás?'

const LEGENDA =
  'O último eclipse em Peixes deste ciclo. 🌑\n\n' +
  'Todo eclipse lunar é uma Lua Cheia alinhada aos Nós, os pontos do destino — por isso a intensidade extra, como várias luas cheias de uma vez: realinhamentos rápidos, finais e viradas súbitas.\n\n' +
  'Depois de dois anos de eclipses no eixo Virgem–Peixes, este fecha o ciclo com um grande final. Virgem é ordem e rotina; Peixes é intuição e a arte de soltar. O eclipse pergunta o que ainda precisa de estrutura e o que já pede para ser deixado para trás.\n\n' +
  'Peixes rege os finais, o inconsciente, o que soltamos sem ruído. Arraste e veja onde o eclipse cai no SEU mapa, pelo ascendente. 👇\n\n' +
  'A leitura completa, com as casas calculadas do seu nascimento, está no app. Link na bio.'

/**
 * A leitura por ascendente. A ordem segue o zodíaco; a casa é onde Peixes cai
 * em casas inteiras para cada ascendente. Cada texto leva o mesmo tom de final
 * e entrega, filtrado pela área daquela casa.
 */
const ASCENDENTES = [
  { asc: 'Áries', casa: 12, titulo: 'O que se *solta* sem ruído.',
    corpo: 'O eclipse fecha um ciclo no seu mundo invisível: sonhos, medos, o que você carrega sem perceber. Hora de descansar, entregar e soltar o que já não é seu para segurar.' },
  { asc: 'Touro', casa: 11, titulo: 'Um sonho antigo se *dissolve*.',
    corpo: 'Amizades e projetos coletivos chegam a um ponto de virada. Um grupo se encerra, um sonho antigo se solta — e abre espaço para uma rede mais verdadeira.' },
  { asc: 'Gêmeos', casa: 10, titulo: 'Um capítulo público *culmina*.',
    corpo: 'Carreira, reputação, um objetivo de anos: algo se conclui ou muda de rota. Confie que soltar aqui é subir, não cair.' },
  { asc: 'Câncer', casa: 9, titulo: 'Uma verdade antiga *cai*.',
    corpo: 'Uma crença se desfaz. O que você tinha como certeza sobre a vida, a fé, o sentido, pede revisão. Um estudo, uma viagem ou uma verdade nova fecha o ciclo.' },
  { asc: 'Leão', casa: 8, titulo: 'O mais profundo se *transforma*.',
    corpo: 'O eclipse mexe na intimidade, nos medos, no que é dividido com o outro. Uma transformação se completa. Solte o controle sobre o que nunca foi controlável.' },
  { asc: 'Virgem', casa: 7, titulo: 'Um vínculo chega à *verdade*.',
    corpo: 'Com o eixo caindo na sua casa das relações, uma parceria se firma ou se encerra. O que era para ser seu, fica; o resto se solta.' },
  { asc: 'Libra', casa: 6, titulo: 'A rotina pede *recomeço*.',
    corpo: 'Trabalho, saúde e hábitos chegam a uma virada. Algo se encerra no dia a dia, o corpo cobra escuta. Solte o excesso e cuide do que sustenta seus dias.' },
  { asc: 'Escorpião', casa: 5, titulo: 'O coração se *entrega*.',
    corpo: 'O eclipse toca o amor, a criatividade, o prazer, os filhos. Um romance ou um projeto criativo culmina. Deixe a emoção fluir sem dirigir cada passo.' },
  { asc: 'Sagitário', casa: 4, titulo: 'As raízes se *reorganizam*.',
    corpo: 'Casa, família e base emocional chegam a uma virada. Algo se encerra no lar. Solte o passado para sentir onde é o seu lugar agora.' },
  { asc: 'Capricórnio', casa: 3, titulo: 'A mente se *reorganiza*.',
    corpo: 'Palavra, ideias e o dia a dia próximo se reorganizam. Uma conversa se conclui, um pensamento antigo se solta. Repare nos sinais — eles vêm sutis neste eclipse.' },
  { asc: 'Aquário', casa: 2, titulo: 'O seu *valor* se redefine.',
    corpo: 'Dinheiro, recursos e autoestima chegam a um ponto de virada. O que você valoriza muda. Solte a segurança que já não serve e confie no próprio valor.' },
  { asc: 'Peixes', casa: 1, titulo: 'Você não é mais *quem era*.',
    corpo: 'O eclipse cai sobre você mesmo: identidade, corpo, a forma como se mostra ao mundo. Um ciclo de dois anos se fecha aqui — e tudo bem soltar quem você foi.' },
]

const CTA = {
  olho: 'Tábula Estelar',
  titulo: 'Onde isso cai no *seu* mapa?',
  corpo: 'Isto é pelo ascendente. A leitura real usa o seu mapa inteiro, com as casas calculadas da sua hora e do seu lugar de nascimento.',
  cta: 'Veja no seu mapa · link na bio',
}

async function renderizar(chrome, html, destino, { largura = 1080, altura = 1080 } = {}) {
  const temp = destino.replace(/\.png$/, '.html')
  await writeFile(temp, html, 'utf8')
  const flagsCI = process.env.CI ? ['--no-sandbox', '--disable-dev-shm-usage'] : []
  const args = ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1.5',
    ...flagsCI, `--window-size=${largura},${altura}`, '--virtual-time-budget=5000',
    `--screenshot=${destino}`, `file:///${temp.replace(/\\/g, '/')}`]
  await execAsync(`"${chrome}" ${args.join(' ')}`, { timeout: 60_000 })
  if (!existsSync(destino)) throw new Error(`Chrome não gerou ${path.basename(destino)}`)
  await rm(temp, { force: true })
}

function lerArgs(argv) {
  const a = { saida: '', capa: '' }
  for (const x of argv.slice(2)) {
    if (x.startsWith('--saida=')) a.saida = path.resolve(x.slice(8))
    // reusa uma capa IA já gerada (evita novo crédito Higgsfield num re-render)
    else if (x.startsWith('--capa=')) a.capa = path.resolve(x.slice(7))
  }
  if (!a.saida) a.saida = path.join(MONOREPO, 'marketing/out')
  return a
}

async function principal() {
  const args = lerArgs(process.argv)
  const chrome = acharChrome()
  const pasta = path.join(args.saida, ISO, 'eclipse')
  const pastaCar = path.join(pasta, 'carrossel')
  await rm(pasta, { recursive: true, force: true })
  await mkdir(pastaCar, { recursive: true })

  // capa por IA (lua de sangue). Uma só, reusada no post, na capa do carrossel e no story.
  const destinoCapa = path.join(pasta, 'capa-ia.png')
  let capaPng = null
  if (args.capa && existsSync(args.capa)) {
    await copyFile(args.capa, destinoCapa)
    capaPng = destinoCapa
    console.log(`Eclipse ${ISO}  capa IA: reusada (${path.basename(args.capa)})`)
  } else {
    capaPng = await gerarCapaIA(PROMPT_CAPA, destinoCapa)
    console.log(`Eclipse ${ISO}  capa IA: ${capaPng ? 'gerada' : 'procedural (fallback)'}`)
  }
  const capaUri = capaPng ? `data:image/png;base64,${(await readFile(capaPng)).toString('base64')}` : null

  // ── CARROSSEL: capa + 12 ascendentes + cta ────────────────────────────────
  const total = 2 + ASCENDENTES.length // capa + 12 + cta = 14
  const slides = [
    { tipo: 'capa', ...CAPA, fundoImg: capaUri, n: 1, total },
    ...ASCENDENTES.map((a, i) => ({
      tipo: 'texto',
      olho: `Ascendente ${a.asc} · casa ${a.casa}`,
      titulo: a.titulo,
      corpo: a.corpo,
      figura: svgDoSigno(a.asc, 100),
      n: i + 2,
      total,
    })),
    { tipo: 'cta', ...CTA, n: total, total },
  ]

  for (const s of slides) {
    const nome = `${String(s.n).padStart(2, '0')}.png`
    await renderizar(chrome, montarSlideCard(s), path.join(pastaCar, nome))
    console.log(`  carrossel ${s.n}/${total}  ${s.olho}`)
  }
  await writeFile(path.join(pasta, 'legenda.txt'), LEGENDA, 'utf8')

  // ── POST: um card v4 com o gancho (texto longo vai na legenda) ────────────
  // tipo 'texto' (não 'capa') para não mostrar "→ deslize": o post não desliza.
  await renderizar(
    chrome,
    montarSlideCard({
      tipo: 'texto', olho: CAPA.olho, titulo: CAPA.titulo,
      corpo: 'Todo eclipse lunar é uma Lua Cheia sobre os Nós, os pontos do destino — daí o peso de final. Este é o último em Peixes do ciclo: depois de dois anos no eixo Virgem–Peixes, um grande final que pede soltar o controle do incontrolável.',
      fundoImg: capaUri, n: 1, total: 1,
    }),
    path.join(pasta, 'post.png'),
  )
  console.log('  post.png')

  // ── STORY: vertical (1080×1920) ───────────────────────────────────────────
  await renderizar(
    chrome,
    montarPeca({
      formato: 'story',
      olho: CAPA.olho,
      titulo: 'O último eclipse em Peixes',
      texto: 'Lua Cheia sobre os Nós, no signo dos finais. Dois anos de eclipses no eixo Virgem–Peixes se fecham. Solte o controle do incontrolável.',
      rodape: 'Veja onde cai no seu mapa · link na bio',
      forte: true,
      figura: diagramaFase({ fase: 'Lua Cheia', luminar: 'Moon' }),
    }),
    path.join(pasta, 'story.png'),
    { largura: 1080, altura: 1920 },
  )
  console.log('  story.png')

  console.log(`\nPronto: ${pasta}`)
}

principal().catch((e) => { console.error(e.message || e); process.exit(1) })
