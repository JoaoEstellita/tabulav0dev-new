#!/usr/bin/env node
/**
 * A peça de um evento: post e story, na linguagem de foto.
 *
 * Substitui o card diário. O João pediu para reduzir: em vez de peça todo dia
 * sobre o que houver, uma peça quando há evento que importa — ingresso de peso,
 * lunação, estação. E um assunto só por peça: nada de anunciar no rodapé que
 * outro planeta muda de signo amanhã.
 *
 * O texto sai do catálogo curado do app (planeta no signo), com a dignidade
 * essencial quando ela existe. Nada de mecânica de fenômeno: quanto o planeta
 * anda por dia e de quanto em quanto tempo o evento se repete são coisas que
 * ele leu e resumiu assim: "quem se importa".
 *
 * Uso:
 *   node scripts/marketing/gerarEvento.mjs --data=2026-08-23
 *   node scripts/marketing/gerarEvento.mjs --data=2026-08-23 --upload
 */
import { mkdir, writeFile, rm } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import process from 'node:process'

import { lerLiterais } from './lib/catalogo.mjs'
import { mapaDoCeu } from './lib/ceu.mjs'
import { montarFoto } from './lib/templateFoto.mjs'
import { svgDoSigno } from './lib/simbolos.mjs'
import { carregarCatalogos } from './lib/interpretacao.mjs'
import { casasPorAscendente } from './lib/fatos.mjs'
import { chaveDoEvento, textoDoEvento } from './lib/textosEvento.mjs'
import { POR_CASA } from './lib/textosEclipse.mjs'
import { assuntoDoDia, chaveDoAssunto } from './lib/assuntoDoDia.mjs'
import { pecaDoAssunto } from './lib/pecaDoAssunto.mjs'
import { lerHistorico, salvarHistorico, chavesRecentes } from './lib/historico.mjs'

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
].filter(Boolean)

const acharChrome = () => {
  const achado = CHROME.find((c) => existsSync(c))
  if (!achado) throw new Error('Chrome não encontrado. Defina CHROME_PATH.')
  return achado
}

function lerArgs(argv) {
  const args = {
    data: '',
    saida: path.join(MONOREPO, 'marketing/out'),
    upload: false,
    formatos: [],
    backend: process.env.TABULA_BACKEND || 'https://tabulav0dev-backend.vercel.app',
    senha: process.env.MONITORING_PASSWORD || process.env.CRON_SECRET_TOKEN || '',
  }
  for (const a of argv.slice(2)) {
    if (a === '--upload') args.upload = true
    else if (a.startsWith('--data=')) args.data = a.slice(7)
    else if (a.startsWith('--saida=')) args.saida = path.resolve(a.slice(8))
    // o que o João marcou no Estúdio; vazio = tudo que o evento comporta
    else if (a.startsWith('--formatos=')) args.formatos = a.slice(11).split(',').filter(Boolean)
  }
  if (args.upload && !args.senha) {
    throw new Error('Upload pedido, mas falta MONITORING_PASSWORD no ambiente.')
  }
  return args
}

/**
 * Sobe um arquivo para o Estúdio.
 *
 * Os nomes são fechados no backend (`ARQUIVOS_ACEITOS`): a peça de feed é
 * `feed.png`, não `post.png`. Nome fora da lista volta 400 e o run fica verde
 * sem ter subido nada.
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

async function renderizar(chrome, html, destino, altura) {
  const temp = destino.replace(/\.png$/, '.html')
  await writeFile(temp, html, 'utf8')
  await execFileAsync(chrome, [
    '--headless=new', '--disable-gpu', '--hide-scrollbars',
    '--force-device-scale-factor=1',
    ...(process.env.CI ? ['--no-sandbox', '--disable-dev-shm-usage'] : []),
    `--window-size=1080,${altura}`,
    `--screenshot=${destino}`,
    '--virtual-time-budget=2500',
    `file:///${temp.replace(/\\/g, '/')}`,
  ])
  await rm(temp, { force: true })
}

// `corpoDoEvento`, `nomeDoCorpo` e `diaMes` foram para `lib/pecaDoAssunto.mjs`
// junto com a montagem do texto: é a parte que precisa de teste, e testá-la
// aqui exigia renderizar um PNG e olhar.

async function principal() {
  const args = lerArgs(process.argv)
  const chrome = acharChrome()

  const iso = args.data || new Date().toISOString().slice(0, 10)
  const data = new Date(`${iso}T12:00:00Z`)

  /**
   * DOIS catálogos, com formatos diferentes.
   *
   * `carregarCatalogos()` devolve o de interpretação (`emSigno`, `emCasa`), que
   * é o que a peça usa para escrever. A cascata precisa de outro: os literais
   * dos `.ts` de planeta-no-signo e aspecto-natal, no formato que
   * `temaEducativo` espera.
   *
   * Passar o primeiro no lugar do segundo não quebra nada e faz o aspecto e o
   * educativo desaparecerem em silêncio: `catalogos.aspectoNatal` fica
   * `undefined`, nenhum aspecto acha texto, e todo dia sem evento vira
   * conceito. Foi o que aconteceu na primeira execução.
   */
  const [{ PLANET_ASPECT_ORBS }, ps, an] = await Promise.all([
    lerLiterais(path.join(FRONTEND, 'src/astro/aspect-config.ts'), ['PLANET_ASPECT_ORBS']),
    lerLiterais(path.join(FRONTEND, 'src/data/planetInSignOverridesPtBR.ts'),
      ['PLANET_IN_SIGN_PTBR_OVERRIDES']),
    lerLiterais(path.join(FRONTEND, 'src/data/natalPlanetAspectOverridesPtBR.ts'),
      ['NATAL_PLANET_ASPECT_PTBR_OVERRIDES']),
  ])
  const catalogos = await carregarCatalogos()
  const catalogosEducativos = {
    planetaNoSigno: ps.PLANET_IN_SIGN_PTBR_OVERRIDES,
    aspectoNatal: an.NATAL_PLANET_ASPECT_PTBR_OVERRIDES,
  }

  const mapa = mapaDoCeu(data, PLANET_ASPECT_ORBS)

  /**
   * O assunto do dia, um só, já livre de repetição.
   *
   * A escolha saiu daqui para `lib/assuntoDoDia.mjs` quando a produção virou
   * diária. Pegar `eventosDoDia(...)[0]` bastava enquanto havia peça só em dia
   * forte; com peça todo dia, a lua fora de curso de 42h sairia em três dias
   * seguidos e Plutão sextil Netuno, seis vezes no mês.
   */
  const historico = await lerHistorico(args.saida)
  const usadas = chavesRecentes(historico, iso)

  const assunto = assuntoDoDia(data, { mapa, catalogos: catalogosEducativos, iso, usadas })
  const peca = pecaDoAssunto(assunto, { iso, catalogos })

  // O aviso continua: assunto do céu sem texto escrito cai no catálogo natal,
  // que fala da posição e não do trânsito.
  if (['ingresso', 'fase', 'retrogrado', 'direto'].includes(assunto.tipo) && !textoDoEvento(assunto)) {
    console.warn(`  aviso: sem texto próprio para "${chaveDoEvento(assunto) || assunto.tipo}".`)
    console.warn('  Sai o texto do catálogo natal, que fala da posição e não do trânsito.')
  }

  const pasta = path.join(args.saida, iso, 'evento')
  await mkdir(pasta, { recursive: true })

  const base = {
    olho: peca.olho,
    titulo: peca.titulo,
    texto: peca.texto,
    // sem repetir a data que o olho já diz, dois centímetros acima
    rodape: '',
    signo: peca.signo,
    simbolo: peca.glifo ? svgDoSigno(peca.signo) : '',
    variacao: 0,
  }

  await renderizar(chrome, montarFoto({ ...base, formato: 'feed' }), path.join(pasta, 'feed.png'), 1350)
  await renderizar(chrome, montarFoto({ ...base, formato: 'story', foco: 3 }), path.join(pasta, 'story.png'), 1920)

  // as casas só quando o assunto acontece num signo: a Lua fora de curso está
  // entre dois, e conceito não acontece em lugar nenhum do zodíaco
  const casas = peca.casas ? casasPorAscendente(peca.signo) : null

  /**
   * O CARROSSEL DO ECLIPSE, um slide por ascendente.
   *
   * O pedido do João: "no texto poderíamos ter com base no ascendente como que
   * afeta o eclipse na casa da pessoa". Os doze textos já estavam escritos em
   * `textosEclipse.mjs` e nunca tinham sido ligados a uma peça: a legenda dizia
   * só "Áries: casa 5", que é o rótulo sem a leitura.
   *
   * Só no eclipse. Ingresso e lunação não sustentam treze slides, e carrossel
   * por qualquer motivo foi o que encheu o feed antes.
   */
  // `--formatos` vazio = tudo que o assunto comporta; marcado, manda a marcação
  const querCarrossel = !args.formatos.length || args.formatos.includes('carrossel')

  const slides = []
  if (assunto.tipo === 'eclipse' && casas && querCarrossel) {
    slides.push({ ...base, texto: peca.legendaAbre, simbolo: '' })
    for (const { ascendente, casa } of casas) {
      slides.push({
        ...base,
        olho: `casa ${casa}`,
        titulo: `Ascendente
${ascendente}`,
        texto: POR_CASA[casa],
        simbolo: svgDoSigno(ascendente),
      })
    }

    for (let i = 0; i < slides.length; i++) {
      const nome = `${String(i + 1).padStart(2, '0')}.png`
      // a mesma foto nos treze, com o enquadramento andando: o conjunto lê como
      // sequência em vez de treze posts colados
      const html = montarFoto({ ...slides[i], formato: 'feed', foco: i })
      await renderizar(chrome, html, path.join(pasta, nome), 1350)
      console.log(`  slide ${i + 1}/${slides.length}  ${slides[i].titulo.replace('\n', ' ')}`)
    }
  }

  const tituloDeUmaLinha = peca.titulo.replace(/\n/g, ' ')

  const legenda = [
    peca.olho ? `${tituloDeUmaLinha} · ${peca.olho}` : tituloDeUmaLinha,
    '',
    // o que explica o fenômeno antes da leitura: a abertura do eclipse, a regra
    // da tradição na lua fora de curso
    ...(peca.legendaAbre ? [peca.legendaAbre, ''] : []),
    peca.texto,
    '',
    // A legenda leva as doze casas quando há casa: é o que faz a pessoa
    // procurar a dela e voltar ao post.
    ...(casas
      ? ['Onde isso cai, pelo seu ascendente:',
         ...casas.map((c) => `${c.ascendente}: casa ${c.casa}`), '']
      : []),
    'Salva para consultar quando precisar.',
    'Não sabe seu ascendente? Comenta a hora e a cidade em que você nasceu',
    'que eu calculo, ou faz de graça no link da bio.',
  ].join('\n')
  await writeFile(path.join(pasta, 'legenda.txt'), legenda, 'utf8')

  // o assunto entra no histórico para não voltar dentro de catorze dias
  historico[iso] = chaveDoAssunto(assunto)
  await salvarHistorico(args.saida, historico)

  console.log(`${iso}  ${tituloDeUmaLinha}  [${chaveDoAssunto(assunto)}]`)
  console.log(`  ${pasta}`)

  if (args.upload) {
    for (const nome of ['feed.png', 'story.png', 'legenda.txt']) {
      await enviar(path.join(pasta, nome), iso, nome, args)
    }
    for (let i = 0; i < slides.length; i++) {
      const nome = `${String(i + 1).padStart(2, '0')}.png`
      await enviar(path.join(pasta, nome), iso, `carrossel/${nome}`, args)
    }
    console.log('Estúdio: enviado')
  }
}

principal().catch((e) => { console.error(e.message || e); process.exit(1) })
