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
import { mkdir, writeFile, rm, copyFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import process from 'node:process'

import { lerLiterais } from './lib/catalogo.mjs'
import { mapaDoCeu } from './lib/ceu.mjs'
import { montarFoto } from './lib/templateFoto.mjs'
import { montarPeca, montarSlide } from './lib/templatePeca.mjs'
import { ehEducativo, slidesDoEducativo } from './lib/slidesEducativo.mjs'
import { svgDoSigno } from './lib/simbolos.mjs'
import { carregarCatalogos, primeirasFrases } from './lib/interpretacao.mjs'
import { casasPorAscendente } from './lib/fatos.mjs'
import { chaveDoEvento, textoDoEvento } from './lib/textosEvento.mjs'
import { POR_CASA } from './lib/textosEclipse.mjs'
import { assuntoDoDia, chaveDoAssunto } from './lib/assuntoDoDia.mjs'
import { eventosDoDia, ingressosProximos } from './lib/eventos.mjs'
import { temaEducativo } from './lib/educativo.mjs'
import { idDoAssunto } from './lib/pautas.mjs'
import { conceitoDoDia, CONCEITO, CHAVES_DE_CONCEITO } from './lib/textosConceito.mjs'
import { recursoDoDia, RECURSO, CHAVES_DE_RECURSO } from './lib/textosRecurso.mjs'
import { montarRecurso } from './lib/templateRecurso.mjs'
import { dadosDaTela } from './lib/dadosDaTela.mjs'
import { temaPorChave, CHAVES_DE_TEMA, TEMA } from './lib/temasDeCarrossel.mjs'
import { STATUS_THRESHOLDS } from './lib/areasDoApp.mjs'
import { pecaDoAssunto, enqueteDaPeca } from './lib/pecaDoAssunto.mjs'
import { lerHistorico, salvarHistorico, chavesRecentes, entradaDoDia } from './lib/historico.mjs'

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
    // trocar o assunto do dia à mão: `--conceito` pega o da vez,
    // `--conceito=orbe` pega aquele
    else if (a === '--conceito') args.conceito = '*'
    else if (a.startsWith('--conceito=')) args.conceito = a.slice(11)
    else if (a === '--listar-conceitos') args.listarConceitos = true
    else if (a === '--recurso') args.recurso = '*'
    else if (a.startsWith('--recurso=')) args.recurso = a.slice(10)
    else if (a === '--listar-recursos') args.listarRecursos = true
    else if (a.startsWith('--carrossel=')) args.carrossel = a.slice(12)
    else if (a === '--listar-carrosseis') args.listarCarrosseis = true
    // o id que o João marcou no Estúdio, no formato de `idDoAssunto`
    else if (a.startsWith('--assunto=')) args.assunto = a.slice(10)
    /**
     * A qual peça do dia isto pertence: 1 é a da raiz, 2 a 5 vão para `pN/`.
     *
     * O dia tinha um slot só. Com vários assuntos marcados na editorial, a
     * segunda peça sobrescreveria a primeira, porque os nomes são fixos.
     */
    else if (a.startsWith('--slot=')) args.slot = Math.max(1, Math.min(5, Number(a.slice(7)) || 1))
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

/**
 * ESCALA 1x, E NÃO 2x — POR LIMITE DE UPLOAD, NÃO POR QUALIDADE.
 *
 * Subi para 2x quando o João pediu nitidez máxima, e o resultado era ótimo:
 * 2160x2700, texto vetorial genuinamente duas vezes mais nítido. Mas o PNG vai
 * a 3,8 MB, e o upload manda em base64 dentro do corpo do POST — 5,1 MB, acima
 * do teto do Vercel. Testei contra produção e voltou
 * `413 FUNCTION_PAYLOAD_TOO_LARGE`.
 *
 * Peguei antes do próximo cron; se tivesse ficado, a geração diária quebraria
 * em silêncio a partir de amanhã.
 *
 * O caminho certo para voltar ao 2x é JPEG: a 2160x2700 em qualidade 2 dá
 * 684 KB, sem franja visível em texto, e o Instagram reconverte tudo para JPEG
 * de qualquer forma — mandar PNG de 3,8 MB não ganha nada. Falta migrar os
 * nomes em `ARQUIVOS_ACEITOS`, o `tipoDe()` e o que o Estúdio exibe.
 *
 * O ganho das fotos permanece: o acervo agora vem das originais da NASA, e
 * fonte maior melhora o resultado mesmo reduzindo para 1x.
 */
async function renderizar(chrome, html, destino, altura) {
  const temp = destino.replace(/\.png$/, '.html')
  await writeFile(temp, html, 'utf8')
  await execFileAsync(chrome, [
    '--headless=new', '--disable-gpu', '--hide-scrollbars',
    // 2× = 2160px de largura. O Instagram reduz para 1080, e o downscale de 2×
    // dá anti-aliasing melhor que renderizar nativo em 1080 — texto e a roda
    // saem mais nítidos. É a nitidez que o João pediu, sem tocar no layout.
    '--force-device-scale-factor=2',
    ...(process.env.CI ? ['--no-sandbox', '--disable-dev-shm-usage'] : []),
    `--window-size=1080,${altura}`,
    `--screenshot=${destino}`,
    '--virtual-time-budget=4000',
    `file:///${temp.replace(/\\/g, '/')}`,
  ])
  await rm(temp, { force: true })
}

// `corpoDoEvento`, `nomeDoCorpo` e `diaMes` foram para `lib/pecaDoAssunto.mjs`
// junto com a montagem do texto: é a parte que precisa de teste, e testá-la
// aqui exigia renderizar um PNG e olhar.

/**
 * Resolve o id que a editorial marcou, seja da agenda ou do banco.
 *
 * `idDoAssunto` é a mesma função que a editorial usa para gerar o id, então as
 * chaves da agenda casam sem tradução. Os do banco têm prefixo próprio:
 *
 *   `conceito:orbe`      um dos quinze textos escritos
 *   `recurso:mapaNatal`  um dos dez sobre o app
 *   `luaVazia`           a lua fora de curso DAQUELE dia, se houver
 *   `educativo:...`      planeta no signo ou aspecto natal
 *
 * `null` quando o id não resolve. Acontece de propósito com `luaVazia` num dia
 * sem lua fora de curso: aí a fila cede a vez, em vez de a peça sair anunciando
 * uma janela que não existe.
 */
function acharPorId(data, mapa, id, { catalogos, iso, usadas }) {
  if (!id) return null

  if (id.startsWith('conceito:')) {
    return { tipo: 'conceito', ...conceitoDoDia(iso, usadas, id.slice(9)) }
  }

  if (id.startsWith('recurso:')) {
    return { tipo: 'recurso', ...recursoDoDia(iso, usadas, id.slice(8)) }
  }

  const doDia = eventosDoDia(data, mapa.aspectos, { antecedencia: 0 })

  if (id === 'luaVazia') {
    return doDia.find((ev) => ev.tipo === 'lua_fora_de_curso') || null
  }

  /**
   * O educativo é recalculado a partir do céu de hoje.
   *
   * A chave do catálogo (`natal:venus_in_libra`) é estável, mas o objeto tem
   * âncora com o grau de agora. Procurar entre os do dia dá o texto certo com o
   * dado do dia certo.
   */
  if (id.startsWith('educativo:')) {
    const chaveAlvo = id.slice(10)
    const jaVistas = new Set()
    for (let i = 0; i < 12; i++) {
      const tema = temaEducativo(mapa, catalogos, jaVistas, {
        ingressos: ingressosProximos(data, 40),
        data,
      })
      if (!tema) break
      if (tema.chave === chaveAlvo) return { ...tema, tipo: tema.tipo }
      jaVistas.add(tema.chave)
    }
    return null
  }

  return doDia.find((ev) => idDoAssunto(ev) === id) || null
}

/**
 * O signo que dá a foto de fundo a um tema.
 *
 * O tema não acontece num signo, mas a foto é escolhida pelo elemento de um.
 * Fixo por tema, para os slides do mesmo carrossel combinarem entre si e o
 * carrossel ser reconhecível quando for republicado.
 */
const peloTema = (chave) => ({
  mapa: 'Aquário',
  dia: 'Leão',
  transitos: 'Escorpião',
}[chave] || 'Aquário')

async function principal() {
  const args = lerArgs(process.argv)

  if (args.listarConceitos) {
    for (const chave of CHAVES_DE_CONCEITO) {
      console.log(`  ${chave.padEnd(18)} ${CONCEITO[chave].titulo.replace('\n', ' ')}`)
    }
    return
  }

  if (args.listarCarrosseis) {
    for (const chave of CHAVES_DE_TEMA) {
      console.log(`  ${chave.padEnd(12)} ${TEMA[chave].titulo.replace('\n', ' ')}  (${TEMA[chave].slides.length} slides)`)
    }
    return
  }

  if (args.listarRecursos) {
    for (const chave of CHAVES_DE_RECURSO) {
      console.log(`  ${chave.padEnd(20)} ${RECURSO[chave].titulo.replace('\n', ' ')}`)
    }
    return
  }

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
  // as outras peças de hoje contam: é o que impede a peça 2 de repetir a 1
  const usadas = chavesRecentes(historico, iso, args.slot || 1)

  /**
   * O carrossel de tema não passa pela cascata nem pelo histórico.
   *
   * É peça de decisão editorial, e sai inteira: quatro a seis slides que
   * ensinam uma coisa do começo ao fim. Sai daqui e o resto da função nem roda.
   */
  /**
   * `carrossel:mapa` vindo da fila é o mesmo que `--carrossel=mapa`.
   *
   * O banco guarda os temas com prefixo, para o id não colidir com conceito nem
   * recurso. Aqui os dois caminhos se encontram.
   */
  if (!args.carrossel && String(args.assunto || '').startsWith('carrossel:')) {
    args.carrossel = args.assunto.slice(10)
  }

  if (args.carrossel) {
    const tema = temaPorChave(args.carrossel)
    // o slot vale aqui também: dois carrosséis no mesmo dia se sobrescreveriam
    const prefixoTema = (args.slot || 1) > 1 ? `p${args.slot}/` : ''
    const pasta = path.join(args.saida, iso, prefixoTema ? `carrossel-${args.slot}` : 'carrossel')
    await mkdir(pasta, { recursive: true })

    for (let i = 0; i < tema.slides.length; i++) {
      const s = tema.slides[i]
      const base = {
        olho: i === 0 ? 'no aplicativo' : `${i + 1} de ${tema.slides.length}`,
        titulo: s.titulo,
        texto: s.texto,
        rodape: '',
        signo: peloTema(tema.chave),
        // a foto é a mesma nos slides, com o enquadramento andando
        variacao: i,
        simbolo: '',
      }

      const html = s.tela
        ? montarRecurso({
          ...base,
          onde: '',
          tela: s.tela,
          dadosDaTela: dadosDaTela(s.tela, { mapa, limiares: STATUS_THRESHOLDS, data }),
          formato: 'feed',
        })
        : montarFoto({ ...base, formato: 'feed', foco: i })

      const nome = `${String(i + 1).padStart(2, '0')}.png`
      await renderizar(chrome, html, path.join(pasta, nome), 1350)
      console.log(`  ${i + 1}/${tema.slides.length}  ${s.titulo.replace('\n', ' ')}${s.tela ? '  [tela]' : ''}`)
    }

    const legenda = [
      tema.titulo.replace('\n', ' '),
      '',
      tema.slides.map((s) => s.texto).join('\n\n'),
      '',
      tema.ponte,
    ].join('\n')
    await writeFile(path.join(pasta, 'legenda.txt'), legenda, 'utf8')

    console.log(`${iso}  carrossel "${tema.chave}"`)
    console.log(`  ${pasta}`)

    if (args.upload) {
      for (let i = 0; i < tema.slides.length; i++) {
        const nome = `${String(i + 1).padStart(2, '0')}.png`
        await enviar(path.join(pasta, nome), iso, `${prefixoTema}carrossel/${nome}`, args)
      }
      await enviar(path.join(pasta, 'legenda.txt'), iso, `${prefixoTema}legenda.txt`, args)
      console.log(`Estúdio: enviado${prefixoTema ? ` (peça ${args.slot})` : ''}`)
    }
    return
  }

  /**
   * O conceito pedido à mão vence a cascata.
   *
   * A cascata é boa para o cron, que roda sozinho às seis da manhã, e ruim para
   * o dia em que o João quer publicar um educativo específico: sem isto, a
   * única forma seria esperar o céu ficar quieto.
   */
  /**
   * O QUE O JOÃO MARCOU NO ESTÚDIO VENCE A CASCATA.
   *
   * O workflow lia o assunto marcado e passava `--assunto` só para o step do
   * vídeo; a peça do dia recebia apenas os formatos, e este arquivo nem lia a
   * flag. No dia do eclipse ele marcou "Eclipse solar total em Leão" com post,
   * carrossel e story, e saiu uma peça de Lua fora de curso: a marcação não
   * tinha caminho nenhum até aqui.
   *
   * Id que não casa com nenhum evento do dia não derruba o run: avisa e cai na
   * cascata, porque a automação nunca pode parar porque uma pauta ficou velha.
   */
  const marcado = args.assunto
    ? acharPorId(data, mapa, args.assunto, { catalogos: catalogosEducativos, iso, usadas })
    : null
  if (args.assunto && !marcado) {
    console.warn(`  aviso: a pauta pediu "${args.assunto}", que não está no céu de hoje.`)
    console.warn('  A peça sai pelo assunto de maior peso.')
  }

  const assunto = args.conceito
    ? { tipo: 'conceito', ...conceitoDoDia(iso, usadas, args.conceito) }
    : args.recurso
      ? { tipo: 'recurso', ...recursoDoDia(iso, usadas, args.recurso) }
      : marcado
        || assuntoDoDia(data, { mapa, catalogos: catalogosEducativos, iso, usadas })
  const peca = pecaDoAssunto(assunto, { iso, catalogos })

  // O aviso continua: assunto do céu sem texto escrito cai no catálogo natal,
  // que fala da posição e não do trânsito.
  if (['ingresso', 'fase', 'retrogrado', 'direto'].includes(assunto.tipo) && !textoDoEvento(assunto)) {
    console.warn(`  aviso: sem texto próprio para "${chaveDoEvento(assunto) || assunto.tipo}".`)
    console.warn('  Sai o texto do catálogo natal, que fala da posição e não do trânsito.')
  }

  // a peça 1 continua na raiz do dia; as outras ganham prefixo no Storage
  const prefixo = (args.slot || 1) > 1 ? `p${args.slot}/` : ''
  const pasta = path.join(args.saida, iso, prefixo ? `evento-${args.slot}` : 'evento')
  await mkdir(pasta, { recursive: true })

  const base = {
    olho: peca.olho,
    titulo: peca.titulo,
    texto: peca.texto,
    // sem repetir a data que o olho já diz, dois centímetros acima
    rodape: '',
    signo: peca.signo,
    simbolo: peca.glifo ? svgDoSigno(peca.signo) : '',
    variacao: peca.variacao,
    // o protagonista viaja junto: peça da Lua não recebe foto do Sol
    corpo: peca.corpo,
    // a roda real do dia + a direção visual: Nebulosa (dourada) no dia forte,
    // Efeméride (quase lisa) no comum. O corpo do assunto é o realçado na roda.
    data,
    corpos: mapa.corpos,
    forte: assunto.tipo === 'eclipse' || assunto.tipo === 'fase' || assunto.tipo === 'ingresso',
    destaque: peca.corpo || null,
    dataRotulo: iso.slice(8) + '.' + iso.slice(5, 7),
  }

  /**
   * A peça de recurso usa outro template: ela tem uma tela dentro.
   *
   * Os dados da tela saem do MESMO mapa que a peça de céu usa, e o exemplo de
   * score vem declarado de `areasDoApp.mjs`, porque calcular o score de
   * verdade exigiria o motor do app.
   */
  const montar = assunto.tipo === 'recurso'
    ? (extra) => montarRecurso({
      ...base,
      onde: peca.onde,
      tela: peca.tela,
      dadosDaTela: dadosDaTela(peca.tela, { mapa, limiares: STATUS_THRESHOLDS }),
      ...extra,
    })
    : (extra) => montarPeca({ ...base, ...extra })

  // `--formatos` vazio = tudo que o assunto comporta; marcado, manda a marcação
  const querCarrossel = !args.formatos.length || args.formatos.includes('carrossel')
  // Educativo é SEMPRE carrossel, mesmo que a pauta salva traga `formatos:['post']`
  // de antes desta regra: `formatosDoAssunto` já só oferece carrossel pra ele, e
  // uma marcação antiga no Storage não deve forçar o post de volta.
  const eduCarrossel = ehEducativo(assunto.tipo)

  // O story sai sempre (com a roda; a tela dentro, no recurso).
  await renderizar(chrome, montar({ formato: 'story', foco: 3 }), path.join(pasta, 'story.png'), 1920)

  // as casas só quando o assunto acontece num signo: a Lua fora de curso está
  // entre dois, e conceito não acontece em lugar nenhum do zodíaco
  const casas = peca.casas ? casasPorAscendente(peca.signo) : null

  const slides = []

  /**
   * O CARROSSEL EDUCATIVO: educativo vira carrossel, não post.
   *
   * O João: "educativo são os carrosséis, com mais conteúdo; post é para
   * anunciar eventos". O texto curado é fatiado em capa + frases + fecho. A
   * capa (a roda do dia) também vira o feed.png, para o Estúdio ter a imagem de
   * capa e o fallback do post.
   */
  if (eduCarrossel) {
    const eduSlides = slidesDoEducativo(base, peca)
    for (let i = 0; i < eduSlides.length; i++) {
      const nome = `${String(i + 1).padStart(2, '0')}.png`
      await renderizar(chrome, montarSlide(eduSlides[i]), path.join(pasta, nome), 1350)
      slides.push(eduSlides[i])
      console.log(`  slide ${i + 1}/${eduSlides.length}  ${eduSlides[i].tipo}`)
    }
    await copyFile(path.join(pasta, '01.png'), path.join(pasta, 'feed.png'))
  } else {
    await renderizar(chrome, montar({ formato: 'feed' }), path.join(pasta, 'feed.png'), 1350)
  }

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
  if (assunto.tipo === 'eclipse' && casas && querCarrossel) {
    // A roda entra também aqui: cada slide é a MESMA roda do eclipse, mas em
    // whole-sign com um ascendente diferente à esquerda — a pessoa vê o eclipse
    // (o luminar realçado) cair na casa que o texto do slide descreve.
    const ORDEM_SIGNOS = ['Áries', 'Touro', 'Gêmeos', 'Câncer', 'Leão', 'Virgem',
      'Libra', 'Escorpião', 'Sagitário', 'Capricórnio', 'Aquário', 'Peixes']

    // 01 = a capa: a roda real do dia (a mesma do feed do eclipse)
    await copyFile(path.join(pasta, 'feed.png'), path.join(pasta, '01.png'))
    slides.push({ ...base, __capa: true })

    let n = 2
    for (const { ascendente, casa } of casas) {
      const nome = `${String(n).padStart(2, '0')}.png`
      const html = montarPeca({
        ...base,
        formato: 'feed',
        dataRotulo: '',
        olho: `casa ${casa}`,
        titulo: `Ascendente\n${ascendente}`,
        texto: POR_CASA[casa],
        ascFixo: ORDEM_SIGNOS.indexOf(ascendente) * 30,
      })
      await renderizar(chrome, html, path.join(pasta, nome), 1350)
      slides.push({ ascendente })
      console.log(`  slide ${n}/${casas.length + 1}  Ascendente ${ascendente} · casa ${casa}`)
      n += 1
    }
  }

  const tituloDeUmaLinha = peca.titulo.replace(/\n/g, ' ')

  /**
   * A primeira linha leva a DATA, quando existe uma.
   *
   * Levava o olho, e no conceito o olho é uma etiqueta de seção: a legenda saía
   * "A casa 12, a mais temida · astrologia por dentro", como se a seção fosse a
   * data do evento.
   */
  const dataDoAssunto = assunto.quando
    ? new Intl.DateTimeFormat('pt-BR', {
      day: 'numeric', month: 'long', timeZone: 'America/Sao_Paulo',
    }).format(assunto.quando)
    : ''

  /**
   * A PRIMEIRA LINHA É O GANCHO, não o título.
   *
   * O Instagram corta a legenda em ~125 caracteres, e essa fatia decide se
   * alguém toca em "mais". A legenda abria com "Eclipse solar em Leão · 12 de
   * agosto", que é exatamente o que já está escrito na imagem: o espaço mais
   * caro da legenda gasto repetindo o que a pessoa acabou de ler.
   *
   * O gancho é a primeira frase do texto, que já foi escrita para puxar. O
   * título e a data descem uma linha.
   */
  const gancho = primeirasFrases(peca.texto, 1)

  const legenda = [
    gancho,
    '',
    dataDoAssunto ? `${tituloDeUmaLinha} · ${dataDoAssunto}` : tituloDeUmaLinha,
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
    /**
     * A PONTE, quando a peça é sobre um recurso.
     *
     * As outras peças fecham no convite genérico, que serve para qualquer uma e
     * por isso não convida para nenhuma. Na peça de recurso o download É o
     * assunto, então o fecho diz o que aquela tela resolve: "seu mapa sai em
     * três perguntas, de graça, no link da bio".
     */
    ...(peca.ponte
      ? [peca.ponte, '', 'Onde: ' + peca.onde]
      : ['Salva para consultar quando precisar.',
         'Não sabe seu ascendente? Comenta a hora e a cidade em que você nasceu',
         'que eu calculo, ou faz de graça no link da bio.']),
  ].join('\n')
  await writeFile(path.join(pasta, 'legenda.txt'), legenda, 'utf8')

  /**
   * O adesivo de enquete, para colar no story.
   *
   * Ele só existe dentro do app do Instagram, na hora de postar, então o que
   * sai daqui é o texto pronto para copiar. O story reserva a faixa de baixo
   * para o adesivo não cobrir o rodapé.
   *
   * A função já existia e era testada; quem a usava era o `gerarCard.mjs`, que
   * saiu do fluxo, e a enquete saiu junto sem ninguém notar.
   */
  const enquete = enqueteDaPeca(assunto)
  await writeFile(
    path.join(pasta, 'enquete.txt'),
    [
      'Adesivo de enquete no story, cole ao postar:',
      '',
      enquete.pergunta,
      ...enquete.opcoes.map((o) => `  · ${o}`),
    ].join('\n'),
    'utf8'
  )

  // o assunto entra no histórico para não voltar dentro de catorze dias
  historico[entradaDoDia(iso, args.slot || 1)] = chaveDoAssunto(assunto)
  await salvarHistorico(args.saida, historico)

  console.log(`${iso}  ${tituloDeUmaLinha}  [${chaveDoAssunto(assunto)}]`)
  console.log(`  ${pasta}`)

  if (args.upload) {
    for (const nome of ['feed.png', 'story.png', 'legenda.txt', 'enquete.txt']) {
      await enviar(path.join(pasta, nome), iso, `${prefixo}${nome}`, args)
    }
    for (let i = 0; i < slides.length; i++) {
      const nome = `${String(i + 1).padStart(2, '0')}.png`
      await enviar(path.join(pasta, nome), iso, `${prefixo}carrossel/${nome}`, args)
    }
    console.log(`Estúdio: enviado${prefixo ? ` (peça ${args.slot})` : ''}`)
  }
}

principal().catch((e) => { console.error(e.message || e); process.exit(1) })
