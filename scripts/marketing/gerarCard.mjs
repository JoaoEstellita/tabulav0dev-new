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
import { encontroDoDia, areaDoEncontro, mapaDoCeu } from './lib/ceu.mjs'
import { eventosDoDia, ingressosProximos } from './lib/eventos.mjs'
import {
  escrever,
  montarLegenda as montarLegendaDaVoz,
  montarLegendaEducativa,
  perguntaDeEnquete,
  eixoDoSigno,
  mereceEixo,
  rotuloDeVespera,
} from './lib/vozes.mjs'
import {
  temaEducativo,
  linhaDeHonestidade,
  paragrafoDeHonestidade,
} from './lib/educativo.mjs'
// mesma funcao que o calendario usa: se os ids divergirem, a pauta salva
// ontem aponta para um assunto que o gerador nao encontra
import { idDoAssunto as chaveDeEvento, opcoesDoDia, acharOpcao } from './lib/pautas.mjs'
// o histórico saiu daqui para `lib/`: a peça diária precisa da mesma janela
import { lerHistorico, salvarHistorico, chavesRecentes } from './lib/historico.mjs'
// A mesma voz do vídeo: as duas peças do dia falam do mesmo assunto, e o card
// rodando depois sobrescrevia a legenda do vídeo com a voz antiga.
import { falaDoReel } from './lib/vozReel.mjs'
// alias: o gerarCard já tem uma `carregarCatalogos` própria, dos títulos e
// aforismos — o nome sem apelido colidia e o módulo nem carregava
import { carregarCatalogos as carregarInterpretacao } from './lib/interpretacao.mjs'
import { montarCard } from './lib/template.mjs'
import { montarCarta } from './lib/templateCarta.mjs'

const execFileAsync = promisify(execFile)

const AQUI = path.dirname(fileURLToPath(import.meta.url))
const FRONTEND = path.resolve(AQUI, '../..')
const MONOREPO = path.resolve(FRONTEND, '..')

/** Imagens reais dos planetas, que o Chrome carrega por file://. */
const DIR_PLANETAS = path.join(FRONTEND, 'public/planets').split(path.sep).join('/')

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
    // id vindo da pauta do Estudio; vazio deixa o gerador escolher
    assunto: '',
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
    else if (m[1] === 'assunto') args.assunto = m[2]
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
  // Os slides do carrossel entram se existirem — quem os gera é o
  // `gerarCarrossel.mjs`, num passo separado, e em dia sem evento forte nem
  // chegam a existir. Dez é o teto do Instagram e o do backend.
  const slides = Array.from(
    { length: 10 },
    (_, i) => `carrossel/${String(i + 1).padStart(2, '0')}.png`
  ).filter((nome) => existsSync(path.join(pasta, nome)))

  const arquivos = ['carta.png', 'feed.png', 'story.png', 'legenda.txt', 'enquete.txt', ...slides]
  const enviados = []
  const falhas = []

  // Cada arquivo é independente: abortar no primeiro erro derrubava os
  // seguintes. Foi assim que uma recusa de carta.png levou a legenda junto e o
  // Estúdio ficou sem texto para publicar.
  for (const nome of arquivos) {
    const alvo = path.join(pasta, nome)
    if (!existsSync(alvo)) continue

    try {
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
        falhas.push(`${nome}: HTTP ${resposta.status} ${detalhe.slice(0, 90)}`)
        continue
      }
      enviados.push(nome)
    } catch (erro) {
      falhas.push(`${nome}: ${erro.message}`)
    }
  }

  return { enviados, falhas }
}

/** Meio-dia UTC representa o dia inteiro sem depender do fuso de quem roda. */
function meioDiaUTC(iso) {
  const [a, m, d] = iso.split('-').map(Number)
  return new Date(Date.UTC(a, m - 1, d, 12, 0, 0))
}

const paraISO = (data) => data.toISOString().slice(0, 10)

async function carregarCatalogos() {
  const [titulos, aforismos, leituras, areas, orbes, planetaSigno, aspectoNatal, nodulos] = await Promise.all([
    lerLiterais(path.join(FRONTEND, 'src/data/transitTitlesPtBR.ts'), ['TRANSIT_TITLES_PTBR']),
    lerLiterais(path.join(FRONTEND, 'src/data/transitAphorismsPtBR.ts'), ['TRANSIT_APHORISMS_PTBR']),
    // 724 interpretações de ~315 caracteres que as peças ignoravam: é o que
    // fazia o card parecer vazio, com um título curto e uma linha de aforismo
    lerLiterais(path.join(FRONTEND, 'src/data/transitCatalogOverridesPtBR.ts'), [
      'TRANSIT_CATALOG_PTBR_OVERRIDES',
    ]),
    lerLiterais(path.join(FRONTEND, 'src/constants/lifeAreas.ts'), [
      'LIFE_AREA_ATTRIBUTION', 'LIFE_AREA_COLORS', 'LIFE_AREA_LABELS',
    ]),
    lerLiterais(path.join(FRONTEND, 'src/astro/aspect-config.ts'), ['PLANET_ASPECT_ORBS']),
    // 345 textos curados que nunca saíram do app e são o conteúdo dos dias em
    // que o céu não é notícia. Terceira pessoa, ~340 caracteres.
    lerLiterais(path.join(FRONTEND, 'src/data/planetInSignOverridesPtBR.ts'), [
      'PLANET_IN_SIGN_PTBR_OVERRIDES',
    ]),
    lerLiterais(path.join(FRONTEND, 'src/data/natalPlanetAspectOverridesPtBR.ts'), [
      'NATAL_PLANET_ASPECT_PTBR_OVERRIDES',
    ]),
    lerLiterais(path.join(FRONTEND, 'src/data/lunarNodeSignOverridesPtBR.ts'), [
      'LUNAR_NODE_SIGN_PTBR_OVERRIDES',
    ]),
  ])

  return {
    titulos: titulos.TRANSIT_TITLES_PTBR,
    aforismos: aforismos.TRANSIT_APHORISMS_PTBR,
    leituras: leituras.TRANSIT_CATALOG_PTBR_OVERRIDES,
    atribuicao: areas.LIFE_AREA_ATTRIBUTION,
    cores: areas.LIFE_AREA_COLORS,
    rotulos: areas.LIFE_AREA_LABELS,
    orbes: orbes.PLANET_ASPECT_ORBS,
    educativo: {
      planetaNoSigno: planetaSigno.PLANET_IN_SIGN_PTBR_OVERRIDES,
      aspectoNatal: aspectoNatal.NATAL_PLANET_ASPECT_PTBR_OVERRIDES,
      noduloPorSigno: nodulos.LUNAR_NODE_SIGN_PTBR_OVERRIDES,
    },
  }
}

/** Cor do elemento do signo do evento: fato astronômico, não suposição. */
const COR_ELEMENTO = {
  fogo: '#FF9F40',
  terra: '#96E6A1',
  ar: '#60A5FA',
  agua: '#B19CD9',
}

/** Semente do campo estelar: mesma data, mesmo céu. */
function semente(iso) {
  return Number(iso.replace(/-/g, ''))
}

/**
 * As primeiras frases da leitura curada.
 *
 * Os textos do catálogo têm ~315 caracteres e foram escritos para a tela do
 * app, onde há rolagem. No card o espaço é fixo: o texto inteiro transborda e
 * empurra o rodapé para fora. As duas primeiras frases carregam a definição do
 * encontro; o resto costuma ser desdobramento e a pergunta final.
 */
function primeirasFrases(texto, quantas = 2) {
  if (!texto) return ''
  const frases = texto.match(/[^.!?]+[.!?]+/g)
  if (!frases) return texto
  return frases.slice(0, quantas).join('').trim()
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

async function gerarUmDia(chrome, cat, iso, raizSaida, historico, assunto = '') {
  const data = meioDiaUTC(iso)
  const bruto = encontroDoDia(
    data, cat.orbes, cat.titulos, cat.aforismos, chavesRecentes(historico, iso)
  )

  if (!bruto) {
    return { iso, pulado: 'nenhum aspecto com texto curado no catálogo' }
  }

  // O que MUDA hoje vem antes do que está igual há semanas: ingresso, estação
  // retrógrada, fase da lua e Lua fora de curso ganham do aspecto vigente.
  const mapa = mapaDoCeu(data, cat.orbes)
  const usadas = chavesRecentes(historico, iso)
  const eventos = eventosDoDia(data, mapa.aspectos).filter((e) => {
    // Um período de Lua fora de curso dura até 42h e atravessa três dias, e os
    // três reportavam a MESMA janela, com título e texto idênticos. A chave é o
    // instante de início, então o período só vira manchete uma vez.
    if (e.tipo !== 'lua_fora_de_curso') return true
    return !usadas.has(chaveDeEvento(e))
  })

  // Peso 90 é o piso do que conta como notícia: eclipse, ingresso, estação e
  // fase. Abaixo disso só a Lua fora de curso ainda vira manchete, porque dura
  // horas e é acionável.
  //
  // O aspecto NUNCA encabeça. Ele continua entrando como evento secundário, mas
  // como manchete reproduz o problema que o `eventos.mjs` existe para resolver:
  // Plutão sextil Netuno fica exato por semanas e saía dois dias seguidos com o
  // mesmo texto. Sem manchete, o dia vira educativo — que é assunto novo.
  const forte = eventos.find((e) => e.peso >= 90) || null
  const automatico = forte || eventos.find((e) => e.tipo === 'lua_fora_de_curso') || null

  // O assunto que o João marcou no Estúdio manda. Quando ele não existe mais —
  // pauta velha, efeméride que mudou — a escolha automática assume, porque um
  // dia sem peça é pior que um dia com a peça errada.
  const escolhido = assunto
    ? acharOpcao(opcoesDoDia(data, { catalogos: cat.educativo, orbes: cat.orbes }), assunto)
    : null
  if (assunto && !escolhido) {
    console.warn(`  aviso: assunto "${assunto}" não existe mais em ${iso}; escolhendo sozinho.`)
  }

  const principal = escolhido
    ? escolhido.tipo === 'educativo'
      ? null
      : escolhido.evento
    : automatico

  // Os ingressos dos próximos 40 dias dizem quanto cada posição ainda dura — é o
  // que impede o card de falar de um planeta que troca de signo depois de amanhã.
  const tema = escolhido
    ? escolhido.tipo === 'educativo'
      ? escolhido.evento
      : null
    : principal
      ? null
      : temaEducativo(mapa, cat.educativo, usadas, {
          ingressos: ingressosProximos(data, 40),
          data,
        })

  const secundarios = principal ? eventos.filter((e) => e !== principal).slice(0, 2) : []

  const voz = principal ? escrever(principal) : null

  // a cor vem do elemento do signo, que é fato astronômico. A área da vida saiu:
  // sem o mapa de quem vê, dizer "Carreira" é afirmar o que não se sabe.
  const elemento = principal?.elemento || tema?.elemento || null
  const area = areaDoEncontro(bruto, cat.atribuicao)

  // O card educativo passa pelo mesmo caminho do card de evento: o `evento`
  // sintético faz o template usar o diagrama de um corpo só, e o texto vem do
  // catálogo curado em vez da voz combinatória.
  const eventoSintetico = tema
    ? {
        tipo: 'educativo',
        corpo: tema.corpo,
        corpoPt: tema.corpoPt,
        signo: tema.signo,
        grau: tema.grau,
        elemento: tema.elemento,
        vespera: false,
        diasFalta: 0,
      }
    : null

  const encontro = {
    ...bruto,
    agentePos: bruto.agentePos.rotulo,
    alvoPos: bruto.alvoPos.rotulo,
    cor: COR_ELEMENTO[elemento] || (cat.cores[area] || ['#4ECDC4'])[0],
    elemento,
    signoEvento: principal?.signo || tema?.signo || null,
    dataRotulo: iso.slice(8) + '.' + iso.slice(5, 7),
    semente: semente(iso),
    leitura: primeirasFrases(cat.leituras[bruto.chave], 2),
    dirPlanetas: DIR_PLANETAS,
    evento: principal || eventoSintetico,
    // O nome que vai sob o desenho do corpo. Eclipse e fase não trazem `corpoPt`
    // porque o protagonista é o luminar, não um planeta nomeado no evento.
    nomeCorpoEvento: principal
      ? principal.corpoPt ||
        (principal.tipo === 'eclipse' && principal.luminar === 'solar' ? 'Sol' : 'Lua')
      : tema?.corpoPt || '',
    olho: tema ? 'O que significa num mapa' : '',
    // A linha que impede a peça de virar previsão. Nunca é opcional.
    avisoEducativo: tema ? linhaDeHonestidade(tema) : '',
    tema,
    // Só nos eventos de peso — eclipse, lunação, entrada de planeta reconhecível.
    // Se toda peça recortasse signos, o recurso viraria cacoete e a conta viraria
    // horóscopo.
    eixo: principal && mereceEixo(principal) ? eixoDoSigno(principal.signo) : null,
    vesperaRotulo: principal ? rotuloDeVespera(principal) : '',
    // uma linha por evento secundário: dia cheio mostra mais de um, dia parado
    // continua com um só. O layout segue a quantidade, não o contrário.
    eventos: secundarios.map((e) => {
      const v = escrever(e)
      return { ...e, __linha: `${v.titulo} · ${v.dado}` }
    }),
    // quando há evento, ele manda no título; o aspecto vira pano de fundo
    titulo: voz ? voz.titulo : tema ? tema.titulo : bruto.titulo,
    subtitulo: voz ? voz.dado : tema ? tema.ancora : '',
    // Duas frases no card, texto inteiro na legenda: os textos do catálogo têm
    // ~340 caracteres e foram escritos para a tela do app, onde há rolagem.
    // Inteiros aqui, empurram o aviso e o rodapé para fora do quadro.
    // Duas frases, sempre. O texto do nodulo tem ~500 caracteres e empurrava o
    // rodape para fora do quadro — mesmo motivo do educativo.
    textoEvento: voz ? primeirasFrases(voz.texto, 2) : tema ? primeirasFrases(tema.texto, 2) : '',
    // a chave que vai para o histórico decide o que não se repete na janela
    chave: principal ? chaveDeEvento(principal) : tema ? tema.chave : bruto.chave,
    repetido: tema ? tema.repetido : bruto.repetido,
  }

  const pasta = path.join(raizSaida, iso)
  await mkdir(pasta, { recursive: true })

  await renderizar(chrome, montarCard(encontro, 'feed'), path.join(pasta, 'feed.png'), 1080, 1350)
  await renderizar(chrome, montarCard(encontro, 'story'), path.join(pasta, 'story.png'), 1080, 1920)

  // A carta mostra o céu inteiro: doze signos, dez corpos e todos os aspectos.
  await renderizar(
    chrome,
    montarCarta({ ...mapa, ...encontro }),
    path.join(pasta, 'carta.png'),
    1080,
    1350
  )

  /**
   * A legenda vem da voz nova quando há evento.
   *
   * O card e o vídeo saem no mesmo dia, sobre o mesmo assunto, e gravam o mesmo
   * `legenda.txt`. Como o card roda depois no workflow, a legenda que sobrava no
   * Estúdio era a dele — na voz antiga, com "os quatro signos que recebem ângulo
   * exato" e o bordão que saiu de todas as outras peças.
   */
  const legenda = principal
    ? falaDoReel(principal, data, {
        proximo: eventos.find((e) => e !== principal && e.quando > data && e.tipo !== principal.tipo),
        catalogos: await carregarInterpretacao(),
      }).post
    : tema
      ? montarLegendaEducativa(tema, paragrafoDeHonestidade(tema), data)
      : montarLegenda(encontro)

  // O adesivo de enquete só existe dentro do app do Instagram, na hora de
  // postar. O que dá para adiantar é o texto pronto — e a faixa reservada no
  // rodapé do story para o adesivo não cobrir a marca.
  const enquete = perguntaDeEnquete(principal, tema)
  await writeFile(
    path.join(pasta, 'enquete.txt'),
    [
      'Adesivo de enquete no story — cole ao postar:',
      '',
      enquete.pergunta,
      ...enquete.opcoes.map((o) => `  · ${o}`),
      '',
      'A faixa de baixo do story está livre para o adesivo.',
    ].join('\n'),
    'utf8'
  )
  await writeFile(path.join(pasta, 'legenda.txt'), legenda, 'utf8')

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
  const problemas = []

  for (let i = 0; i < args.dias; i++) {
    const dia = new Date(inicio.getTime() + i * 86_400_000)
    const iso = paraISO(dia)
    // o assunto vale para o primeiro dia da rodada: pauta e por dia, e gerar
    // varios dias de uma vez e um caso de reposicao, nao de curadoria
    const r = await gerarUmDia(chrome, cat, iso, args.saida, historico, i === 0 ? args.assunto : '')

    if (r.pulado) {
      console.log(`${iso}  —  pulado: ${r.pulado}`)
      continue
    }

    const e = r.encontro
    historico[iso] = e.chave
    if (e.repetido) repetidos++

    const secundarios = (e.eventos || []).length
    console.log(
      `${iso}  ${e.titulo}` +
        (e.subtitulo ? `  ·  ${e.subtitulo}` : '') +
        (secundarios ? `  (+${secundarios})` : '') +
        (e.textoEvento ? `\n            ${e.textoEvento}` : '')
    )
    gerados++

    if (args.upload) {
      const { enviados: nomes, falhas } = await enviarParaNuvem(
        r.pasta, iso, { backend: args.backend, senha }
      )
      if (nomes.length) console.log(`            enviado: ${nomes.join(', ')}`)
      for (const f of falhas) console.log(`            FALHOU  ${f}`)
      if (!falhas.length) enviados++
      else problemas.push(`${iso}: ${falhas.join(' | ')}`)
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
    console.log(`${enviados} de ${gerados} dia(s) completos no Estúdio.`)
    if (problemas.length) {
      console.log('\nArquivos que não subiram:')
      for (const p of problemas) console.log(`  ${p}`)
    }
    if (args.exigirUpload && problemas.length) {
      throw new Error(`--exigir-upload: ${problemas.length} dia(s) com arquivo faltando.`)
    }
  }
}

principal().catch((erro) => {
  console.error('\nFalhou:', erro.message)
  process.exit(1)
})
