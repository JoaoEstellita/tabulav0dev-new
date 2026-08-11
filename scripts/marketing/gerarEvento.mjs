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
import { eventosDoDia } from './lib/eventos.mjs'
import { montarFoto } from './lib/templateFoto.mjs'
import { svgDoSigno } from './lib/simbolos.mjs'
import { carregarCatalogos, textoEmSigno, dignidade, primeirasFrases } from './lib/interpretacao.mjs'
import { casasPorAscendente } from './lib/fatos.mjs'
import { textoDoEvento, chaveDoEvento } from './lib/textosEvento.mjs'
import { ABERTURA, POR_CASA } from './lib/textosEclipse.mjs'

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

/** O corpo que protagoniza o evento. */
const corpoDoEvento = (ev) =>
  ev.corpo || (ev.tipo === 'eclipse' || ev.tipo === 'fase'
    ? (ev.luminar === 'solar' || ev.fase === 'Lua Nova' ? 'Sun' : 'Moon')
    : null)

/** O sujeito da frase da dignidade, com artigo, quando o evento não traz nome. */
const nomeDoCorpo = (corpo) => ({ Sun: 'O Sol', Moon: 'A Lua' }[corpo] || '')

const diaMes = (d) =>
  new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long', timeZone: 'America/Sao_Paulo' }).format(d)

async function principal() {
  const args = lerArgs(process.argv)
  const chrome = acharChrome()

  const iso = args.data || new Date().toISOString().slice(0, 10)
  const data = new Date(`${iso}T12:00:00Z`)

  const { PLANET_ASPECT_ORBS } = await lerLiterais(
    path.join(FRONTEND, 'src/astro/aspect-config.ts'), ['PLANET_ASPECT_ORBS'])
  const catalogos = await carregarCatalogos()

  const mapa = mapaDoCeu(data, PLANET_ASPECT_ORBS)

  /**
   * O evento é o de HOJE, não o de daqui a três dias.
   *
   * `eventosDoDia` antecipa em três dias por padrão, e era o certo quando a
   * peça de véspera existia. Sem filtro, o cron do dia 11 gerou o post do
   * eclipse do dia 12 — e no dia 12 geraria o mesmo post outra vez. O João viu
   * as duas coisas: "foi criado pro dia 12 hoje no dia 11" e "também não quero
   * repetir os posts".
   *
   * Com antecedência zero, cada evento tem um dia só e a peça sai nele.
   */
  const evento = eventosDoDia(data, mapa.aspectos, { antecedencia: 0 })[0]
  if (!evento) {
    console.log(`${iso}: sem evento no céu. Nenhuma peça.`)
    process.exit(0)
  }

  const corpo = corpoDoEvento(evento)
  const titulo = evento.tipo === 'ingresso'
    ? `${evento.corpoPt} entra\nem ${evento.signo}`
    : evento.tipo === 'fase'
      ? `${evento.fase}\nem ${evento.signo}`
      : evento.tipo === 'eclipse'
        ? `Eclipse ${evento.luminar === 'solar' ? 'solar' : 'lunar'}\nem ${evento.signo}`
        : `${evento.corpoPt}\nem ${evento.signo}`

  /**
   * O texto de TRÂNSITO vem primeiro.
   *
   * O catálogo natal descreve o que é ter o Sol em Virgem no mapa de alguém:
   * serve para qualquer pessoa e qualquer ano, e não diz nada sobre agosto de
   * 2026. É boa base e péssima peça. Quando há texto escrito para este evento,
   * é ele que sai; quando não há, a peça avisa em vez de fingir.
   */
  const dig = corpo ? dignidade(corpo, evento.signo) : null
  const doEvento = textoDoEvento(evento)

  if (!doEvento) {
    console.warn(`  aviso: sem texto próprio para "${chaveDoEvento(evento) || evento.tipo}".`)
    console.warn('  Sai o texto do catálogo natal, que fala da posição e não do trânsito.')
  }

  /**
   * A dignidade só sai com sujeito.
   *
   * `evento.corpoPt` existe em ingresso e é vazio em eclipse e em fase, então a
   * peça do eclipse saiu começando por " chega em casa: é o signo que ele rege"
   * — frase sem quem. `nomeDoCorpo` cobre o buraco pelo corpo que protagoniza o
   * evento; sem nome, a linha não sai.
   *
   * No eclipse ela não sai: "O Sol chega em casa, é o signo que ele rege" antes
   * de "Este eclipse cai em Leão" diz duas vezes o mesmo signo, e o assunto da
   * peça é o eclipse, não onde o Sol está bem.
   */
  const sujeito = evento.tipo === 'eclipse' ? '' : (evento.corpoPt || nomeDoCorpo(corpo))
  const texto = [
    dig && sujeito ? `${sujeito} ${dig.texto}.` : '',
    doEvento || (corpo ? primeirasFrases(textoEmSigno(catalogos, corpo, evento.signo), 2) : ''),
  ].filter(Boolean).join('\n\n')

  const pasta = path.join(args.saida, iso, 'evento')
  await mkdir(pasta, { recursive: true })

  const base = {
    olho: diaMes(evento.quando),
    titulo,
    texto,
    // sem repetir a data que o olho já diz, dois centímetros acima
    rodape: '',
    signo: evento.signo,
    simbolo: svgDoSigno(evento.signo),
    variacao: 0,
  }

  await renderizar(chrome, montarFoto({ ...base, formato: 'feed' }), path.join(pasta, 'feed.png'), 1350)
  await renderizar(chrome, montarFoto({ ...base, formato: 'story', foco: 3 }), path.join(pasta, 'story.png'), 1920)

  const casas = casasPorAscendente(evento.signo)

  /**
   * O CARROSSEL DO ECLIPSE, um slide por ascendente.
   *
   * O pedido do João: "no texto poderíamos ter com base no ascendente como que
   * afeta o eclipse na casa da pessoa". Os doze textos já estavam escritos em
   * `textosEclipse.mjs` desde a semana passada e nunca tinham sido ligados a
   * uma peça — a legenda dizia só "Áries: casa 5", que é o rótulo sem a
   * leitura.
   *
   * Só no eclipse. Ingresso e lunação não sustentam treze slides, e carrossel
   * por qualquer motivo foi o que encheu o feed antes.
   */
  // `--formatos` vazio = tudo que o evento comporta; marcado, manda a marcação
  const querCarrossel = !args.formatos.length || args.formatos.includes('carrossel')

  const slides = []
  if (evento.tipo === 'eclipse' && casas && querCarrossel) {
    slides.push({
      ...base,
      olho: diaMes(evento.quando),
      titulo,
      texto: ABERTURA[evento.luminar === 'solar' ? 'solar' : 'lunar'],
      simbolo: '',
    })
    for (const { ascendente, casa } of casas) {
      slides.push({
        ...base,
        olho: `casa ${casa}`,
        titulo: `Ascendente\n${ascendente}`,
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

  // A legenda leva as doze casas: é o que faz a pessoa procurar a dela e voltar.
  const legenda = [
    titulo.replace('\n', ' ') + ` · ${diaMes(evento.quando)}`,
    '',
    // no eclipse, a abertura explica o que é o fenômeno antes das doze casas
    ...(evento.tipo === 'eclipse'
      ? [ABERTURA[evento.luminar === 'solar' ? 'solar' : 'lunar'], '']
      : []),
    texto,
    '',
    'Onde isso cai, pelo seu ascendente:',
    ...(casas || []).map((c) => `${c.ascendente}: casa ${c.casa}`),
    '',
    'Salva para consultar quando o dia chegar.',
    'Não sabe seu ascendente? Comenta a hora e a cidade em que você nasceu',
    'que eu calculo, ou faz de graça no link da bio.',
  ].join('\n')
  await writeFile(path.join(pasta, 'legenda.txt'), legenda, 'utf8')

  console.log(`${iso}  ${titulo.replace('\n', ' ')}`)
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
