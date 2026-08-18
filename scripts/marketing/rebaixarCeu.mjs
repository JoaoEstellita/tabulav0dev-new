#!/usr/bin/env node
/**
 * Rebaixa o acervo de fundos a partir das ORIGINAIS da NASA.
 *
 * ── POR QUE ISTO EXISTE ────────────────────────────────────────────────────
 *
 * O João pediu nitidez máxima e falou em usar IA para conseguir. Medi antes de
 * gastar crédito, e o diagnóstico foi outro:
 *
 *   as8-14-2392 (Apollo 8), o que temos:   1400 x 1406
 *   as8-14-2392, a original da NASA:       4077 x 4096
 *
 * Oito vezes e meia mais pixels, de graça, na mesma foto. A coleta original
 * pegou a variante `~large` do `images-assets.nasa.gov` em vez da `~orig`, e
 * ninguém notou porque a peça saía em 1080x1350 — no tamanho antigo o defeito
 * não aparecia.
 *
 * Com o render em 2x (2160x2700), aparece: a Lua fica com as crateras
 * borradas enquanto o glifo vetorial ao lado sai perfeito.
 *
 * ── POR QUE NÃO GERAR POR IA ───────────────────────────────────────────────
 *
 * Cheguei a levantar o custo: ampliar uma foto no Higgsfield custa 2 créditos
 * (22 fotos = 44, e o plano tem 10), e gerar nova no Soul 2.0 custa 0,12 mas
 * para em qualidade 2k, que ainda não cobre 2160x2700.
 *
 * Nenhum dos dois se justifica quando a original existe, é gratuita, é de
 * DOMÍNIO PÚBLICO e é a fotografia astronômica de verdade — que é justamente o
 * que a conta vende. Trocar Hubble e Apollo por nebulosa inventada seria perder
 * o argumento para ganhar pixel.
 *
 * ── O QUE ESTE SCRIPT FAZ ──────────────────────────────────────────────────
 *
 * Lê os identificadores da NASA no `CREDITOS.md`, baixa a `~orig` de cada um e
 * grava no tamanho que o render em 2x precisa. A procedência não muda: é a
 * mesma foto, do mesmo lugar, com a mesma licença.
 *
 * Uso:
 *   node scripts/marketing/rebaixarCeu.mjs --so=lua-20.jpg   (uma, para testar)
 *   node scripts/marketing/rebaixarCeu.mjs                   (todas)
 *   node scripts/marketing/rebaixarCeu.mjs --seco            (só mostra o plano)
 */
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { readFileSync, existsSync, statSync } from 'node:fs'
import { rm, rename } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import process from 'node:process'

const execFileAsync = promisify(execFile)
const AQUI = path.dirname(fileURLToPath(import.meta.url))
const PASTA = path.join(AQUI, 'assets/ceu')

/**
 * O lado maior do arquivo guardado.
 *
 * A peça sai em 2160x2700 (1080x1350 renderizado em 2x). Uma foto que cubra
 * esse quadro sem esticar precisa de pelo menos 2160 de largura E 2700 de
 * altura, e as fotos vêm em proporções variadas. 3000 no lado maior garante a
 * cobertura em qualquer orientação, com folga para o recorte.
 *
 * Não vale guardar a original inteira: ela é embutida em `data:` URI dentro do
 * HTML que o Chrome renderiza, e 2 MB de base64 viram quase 3 MB de HTML por
 * peça.
 */
const LADO_MAIOR = 3000

/**
 * O quadro que a peça renderiza: 1080x1350 em 2x.
 *
 * É contra ele que se mede se uma foto é melhor que outra. "Maior" não serve
 * como critério: uma foto 3000x720 tem mais pixels que uma 1080x1920 e cobre
 * MUITO pior um quadro em retrato.
 */
const QUADRO_L = 2160
const QUADRO_A = 2700

/**
 * Quanto a foto precisa esticar para cobrir o quadro. Menor é melhor; 1 ou
 * menos significa que não estica nada.
 */
function fatorDeCobertura(w, h) {
  return Math.max(QUADRO_L / w, QUADRO_A / h)
}

/**
 * Qualidade JPEG do ffmpeg: 1 é a melhor, 31 a pior.
 *
 * A coleta antiga usava 4, que é onde o artefato começa a aparecer em gradiente
 * — e fundo de nebulosa é quase todo gradiente. 2 pesa uns 40% mais e não tem
 * artefato visível.
 */
const QUALIDADE = 2

/** Lê os identificadores da NASA da tabela de créditos. */
function lerCreditos() {
  const md = readFileSync(path.join(PASTA, 'CREDITOS.md'), 'utf8')
  const linhas = [...md.matchAll(
    /^\| `([a-z]+-\d+\.jpg)` \| (.+?) \| (.+?) \| \[(.+?)\]\((.+?)\) \|$/gm
  )]
  return linhas.map(([, arquivo, titulo, centro, ident]) => ({
    arquivo, titulo: titulo.trim(), centro: centro.trim(), ident: ident.trim(),
  }))
}

/**
 * A URL da original.
 *
 * A API devolve as variantes (`~orig`, `~large`, `~medium`, `~small`,
 * `~thumb`), e a coleta antiga pegou `~large`. Aqui só interessa `~orig`.
 *
 * `http:` vira `https:` porque a API devolve os hrefs sem TLS e o redirect
 * cruza domínio.
 */
async function urlDaOriginal(ident) {
  const r = await fetch(`https://images-api.nasa.gov/asset/${encodeURIComponent(ident)}`)
  if (!r.ok) return null
  const dados = await r.json()
  const hrefs = (dados?.collection?.items || []).map((i) => i.href)
  const orig = hrefs.find((h) => /~orig\.(jpg|jpeg|png|tif)$/i.test(h))
  return orig ? orig.replace(/^http:/, 'https:') : null
}

async function dimensoes(arquivo) {
  try {
    const { stdout } = await execFileAsync('ffprobe', [
      '-v', 'error', '-select_streams', 'v',
      '-show_entries', 'stream=width,height', '-of', 'csv=p=0', arquivo,
    ])
    const [w, h] = stdout.trim().split(',').map(Number)
    return { w, h }
  } catch {
    return null
  }
}

function lerArgs(argv) {
  const args = { so: '', seco: false }
  for (const a of argv.slice(2)) {
    if (a === '--seco') args.seco = true
    else if (a.startsWith('--so=')) args.so = a.slice(5)
  }
  return args
}

async function principal() {
  const args = lerArgs(process.argv)
  let itens = lerCreditos().filter((i) => existsSync(path.join(PASTA, i.arquivo)))
  if (args.so) itens = itens.filter((i) => i.arquivo === args.so)

  if (!itens.length) {
    console.error(args.so ? `nada a fazer para ${args.so}` : 'nenhum arquivo do CREDITOS.md está no disco')
    process.exit(1)
  }

  console.log(`${itens.length} foto(s) a rebaixar, lado maior ${LADO_MAIOR}px\n`)

  let melhoradas = 0
  for (const item of itens) {
    const destino = path.join(PASTA, item.arquivo)
    // baixa para um temporário: o original só é substituído se o novo cobrir melhor
    const temp = `${destino}.novo.jpg`
    const antes = await dimensoes(destino)

    const url = await urlDaOriginal(item.ident)
    if (!url) {
      console.warn(`  ${item.arquivo}: original não encontrada (${item.ident})`)
      continue
    }

    if (args.seco) {
      console.log(`  ${item.arquivo}: ${antes?.w}x${antes?.h} <- ${url}`)
      continue
    }

    try {
      /**
       * ffmpeg baixa e redimensiona numa passada.
       *
       * `-update 1` porque a saída é uma imagem só; sem ele o ffmpeg trata o
       * destino como sequência e reclama do nome sem `%d`.
       *
       * A escala reduz o lado MAIOR para o teto e deixa o outro proporcional,
       * e nunca amplia: `min(iw,LADO)` garante que uma foto já pequena passe
       * intacta em vez de ser esticada aqui dentro.
       */
      await execFileAsync('ffmpeg', [
        '-y', '-loglevel', 'error',
        '-i', url,
        '-vf', `scale='if(gt(iw,ih),min(iw,${LADO_MAIOR}),-2)':'if(gt(iw,ih),-2,min(ih,${LADO_MAIOR}))'`,
        '-q:v', String(QUALIDADE),
        '-update', '1',
        temp,
      ], { maxBuffer: 32 * 1024 * 1024 })

      const depois = await dimensoes(temp)
      if (!depois || !antes) {
        console.warn(`  ${item.arquivo}: nao consegui medir, mantido`)
        await rm(temp, { force: true })
        continue
      }

      /**
       * SÓ TROCA SE COBRIR MELHOR.
       *
       * Rodei sem esta guarda e degradei cinco fotos: `fogo-01` foi de
       * 1080x1920 para 946x946 porque a "original" da NASA daquele item é
       * pequena. Várias do acervo já tinham sido recortadas em retrato pela
       * coleta antiga, e o recorte cobre o quadro melhor que uma original
       * quadrada e maior.
       *
       * A comparação é pelo fator de cobertura, não pelo número de pixels.
       */
      const antesFator = fatorDeCobertura(antes.w, antes.h)
      const depoisFator = fatorDeCobertura(depois.w, depois.h)

      if (depoisFator >= antesFator) {
        console.log(
          `  ${item.arquivo}: mantido (${antes.w}x${antes.h} cobre ${antesFator.toFixed(2)}x; ` +
          `original ${depois.w}x${depois.h} cobriria ${depoisFator.toFixed(2)}x)`
        )
        await rm(temp, { force: true })
        continue
      }

      await rename(temp, destino)
      const kb = Math.round(statSync(destino).size / 1024)
      console.log(
        `  ${item.arquivo}: ${antes.w}x${antes.h} -> ${depois.w}x${depois.h}  ` +
        `estica ${antesFator.toFixed(2)}x -> ${depoisFator.toFixed(2)}x  (${kb} KB)`
      )
      melhoradas++
    } catch (erro) {
      console.error(`  ${item.arquivo}: falhou — ${String(erro.message).slice(0, 120)}`)
    }
  }

  if (!args.seco) {
    console.log(`\n${melhoradas} de ${itens.length} ganharam resolução.`)
    console.log('A procedência não muda: mesma foto, mesma origem, mesma licença.')
  }
}

principal().catch((erro) => {
  console.error(erro)
  process.exit(1)
})
