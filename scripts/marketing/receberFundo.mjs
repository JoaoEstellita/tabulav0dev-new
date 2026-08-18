#!/usr/bin/env node
/**
 * Entrada única do acervo de fundos.
 *
 * ── POR QUE ISTO EXISTE ────────────────────────────────────────────────────
 *
 * O João perguntou se dá para automatizar a geração de imagem junto com a
 * criação diária. Não do jeito direto: a criação diária roda no GitHub Actions
 * (`card-diario.yml`, cron 6h), e ferramenta MCP só existe dentro de uma sessão
 * do Claude. O runner não tem nenhuma, e não vai ter.
 *
 * O que funciona é o desenho que o acervo JÁ usa: as 22 fotos da NASA estão
 * commitadas em `assets/ceu/`, e o cron só escolhe entre elas. Gerar imagem
 * passa a ser uma etapa de ABASTECIMENTO, feita numa sessão com o Higgsfield
 * ligado, e o cron continua sem credencial, sem custo por execução e sem
 * depender de um serviço de fora estar de pé às seis da manhã.
 *
 * Este script é a porta desse abastecimento, e vale para qualquer fonte.
 *
 * ── O QUE ELE GARANTE ──────────────────────────────────────────────────────
 *
 * 1. O NOME. A família decide a foto (`fogo`, `terra`, `ar`, `agua`, `lua`), e
 *    `lua` é reservada: entra só quando a Lua protagoniza. Numeração contínua,
 *    para não sobrescrever nada.
 *
 * 2. A PROCEDÊNCIA. Toda imagem entra com origem e licença declaradas em
 *    `procedencia.json`, e `acervo.spec.mjs` falha se algum arquivo do disco
 *    ficar sem entrada. O acervo era 100% domínio público da NASA, com uso
 *    comercial garantido; misturar imagem gerada muda isso, e a diferença tem
 *    de ficar registrada por arquivo, não numa nota de rodapé.
 *
 * 3. O FORMATO. O template embute a foto em `data:` URI, então arquivo grande
 *    incha o HTML e o PNG final. Com o render em 2x o acervo vai de 60 KB a
 *    3,3 MB, e o teto está em `LIMITE_BYTES`.
 *
 * Uso:
 *   node scripts/marketing/receberFundo.mjs \
 *     --arquivo=C:/tmp/gerada.png --familia=agua \
 *     --origem=higgsfield --licenca=? --nota="modelo X, prompt Y"
 *
 *   node scripts/marketing/receberFundo.mjs --auditar
 */
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { existsSync, readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import process from 'node:process'

const execFileAsync = promisify(execFile)
const AQUI = path.dirname(fileURLToPath(import.meta.url))
const PASTA = path.join(AQUI, 'assets/ceu')
const MANIFESTO = path.join(PASTA, 'procedencia.json')

/** As mesmas de `templateFoto.mjs`. `lua` é reservada. */
export const FAMILIAS = ['fogo', 'terra', 'ar', 'agua', 'lua']

/**
 * Origens aceitas, e o que cada uma obriga a declarar.
 *
 * `licencaConhecida: false` força o campo `--licenca` a ser preenchido à mão:
 * o acervo da NASA tem licença conhecida e uniforme, uma imagem gerada não tem
 * — depende dos termos do serviço e do plano contratado.
 */
export const ORIGENS = {
  nasa: { licencaConhecida: true, licenca: 'dominio-publico', usoComercial: true },
  higgsfield: { licencaConhecida: false },
  outra: { licencaConhecida: false },
}

/**
 * Teto do arquivo.
 *
 * ── POR QUE SUBIU DE 400 KB PARA 3,5 MB ────────────────────────────────────
 *
 * O teto antigo foi definido quando a peça saía em 1080x1350 e o acervo inteiro
 * cabia em 274 KB. Com o render em 2x o quadro virou 2160x2700, e uma foto que
 * cubra isso sem esticar tem de ser grande de verdade: a nebulosa do Hubble em
 * 3000x2850 pesa 3,3 MB no nível de qualidade que não deixa artefato em
 * gradiente.
 *
 * O custo é real e conhecido: a foto vira `data:` URI dentro do HTML, e base64
 * infla um terço. Uma peça com a maior foto do acervo gera um HTML de uns 4,4
 * MB, que o Chrome renderiza sem reclamar e que é apagado logo depois.
 *
 * Vale a troca porque o defeito que isto corrige é visível e o custo não é: o
 * João pediu nitidez máxima depois de ver crateras borradas.
 */
const LIMITE_BYTES = 3.5 * 1024 * 1024

export function lerManifesto() {
  return existsSync(MANIFESTO) ? JSON.parse(readFileSync(MANIFESTO, 'utf8')) : {}
}

/** O próximo número livre, olhando o disco e o manifesto. */
export function proximoNumero(manifesto = lerManifesto()) {
  const doDisco = existsSync(PASTA)
    ? readdirSync(PASTA).filter((f) => f.endsWith('.jpg'))
    : []
  const usados = [...doDisco, ...Object.keys(manifesto)]
    .map((f) => Number(/-(\d+)\.jpg$/.exec(f)?.[1]))
    .filter(Number.isFinite)
  return (usados.length ? Math.max(...usados) : 0) + 1
}

function lerArgs(argv) {
  const args = {
    arquivo: '', familia: '', origem: '', licenca: '', nota: '', auditar: false,
  }
  for (const a of argv.slice(2)) {
    if (a === '--auditar') args.auditar = true
    else if (a.startsWith('--arquivo=')) args.arquivo = a.slice(10)
    else if (a.startsWith('--familia=')) args.familia = a.slice(10)
    else if (a.startsWith('--origem=')) args.origem = a.slice(9)
    else if (a.startsWith('--licenca=')) args.licenca = a.slice(10)
    else if (a.startsWith('--nota=')) args.nota = a.slice(7)
  }
  return args
}

/**
 * O que falta para a auditoria fechar.
 *
 * Devolve lista de problemas em vez de lançar: quem chama decide se isso é um
 * aviso no console ou um teste vermelho.
 */
export function auditar() {
  const manifesto = lerManifesto()
  const noDisco = readdirSync(PASTA).filter((f) => f.endsWith('.jpg'))
  const problemas = []

  for (const arq of noDisco) {
    const p = manifesto[arq]
    if (!p) {
      problemas.push(`${arq}: no disco e fora do manifesto`)
      continue
    }
    if (!p.origem) problemas.push(`${arq}: sem origem`)
    if (!p.licenca) problemas.push(`${arq}: sem licença declarada`)
    // uso comercial indefinido é o caso perigoso: a peça vai para um perfil
    // comercial, e "não sei" não é resposta na hora de publicar
    if (p.usoComercial !== true && p.usoComercial !== false) {
      problemas.push(`${arq}: uso comercial não resolvido`)
    }
    if (!FAMILIAS.some((f) => arq.startsWith(`${f}-`))) {
      problemas.push(`${arq}: família fora da lista (${FAMILIAS.join(', ')})`)
    }
  }

  for (const arq of Object.keys(manifesto)) {
    if (!noDisco.includes(arq)) problemas.push(`${arq}: no manifesto e fora do disco`)
  }

  return problemas
}

/**
 * O lado maior e a qualidade, iguais aos de `rebaixarCeu.mjs`.
 *
 * 1400 e qualidade 4 eram o padrão de quando a peça saía em 1080x1350. Com o
 * render em 2x isso vira upscale visível, e 4 deixa artefato em gradiente —
 * que é do que um fundo de nebulosa é quase todo feito.
 *
 * Os dois scripts precisam concordar: se um abastecer o acervo com foto pequena
 * enquanto o outro busca 3000, o resultado fica desigual de peça para peça, e
 * isso lê como descuido no feed.
 */
const LADO_MAIOR = 3000
const QUALIDADE = 2

async function converter(entrada, saida) {
  // ffmpeg está instalado aqui (scoop). `min(...)` para nunca AMPLIAR: uma
  // imagem que já chega pequena passa intacta em vez de ser esticada aqui.
  await execFileAsync('ffmpeg', [
    '-y', '-loglevel', 'error',
    '-i', entrada,
    '-vf', `scale='if(gt(iw,ih),min(iw,${LADO_MAIOR}),-2)':'if(gt(iw,ih),-2,min(ih,${LADO_MAIOR}))'`,
    '-q:v', String(QUALIDADE),
    '-update', '1',
    saida,
  ])
}

async function principal() {
  const args = lerArgs(process.argv)

  if (args.auditar) {
    const problemas = auditar()
    if (!problemas.length) {
      const n = readdirSync(PASTA).filter((f) => f.endsWith('.jpg')).length
      console.log(`acervo íntegro: ${n} imagens, todas com procedência declarada.`)
      return
    }
    console.error(`${problemas.length} problema(s):`)
    for (const p of problemas) console.error(`  ${p}`)
    process.exit(1)
  }

  if (!args.arquivo || !args.familia || !args.origem) {
    console.error('Uso: --arquivo=<path> --familia=<' + FAMILIAS.join('|') + '> --origem=<' +
      Object.keys(ORIGENS).join('|') + '> [--licenca=...] [--nota=...]')
    process.exit(1)
  }
  if (!FAMILIAS.includes(args.familia)) {
    console.error(`família "${args.familia}" não existe. Há: ${FAMILIAS.join(', ')}`)
    process.exit(1)
  }
  const regra = ORIGENS[args.origem]
  if (!regra) {
    console.error(`origem "${args.origem}" não existe. Há: ${Object.keys(ORIGENS).join(', ')}`)
    process.exit(1)
  }
  /**
   * Sem licença declarada a imagem não entra, e isto não é burocracia.
   *
   * O acervo inteiro é domínio público com uso comercial garantido, e as peças
   * vão para um perfil comercial. Uma imagem de origem incerta no meio das 22
   * some de vista em uma semana, e o problema só aparece quando alguém cobra.
   */
  if (!regra.licencaConhecida && !args.licenca) {
    console.error(
      `origem "${args.origem}" não tem licença conhecida: passe --licenca=<termo> ` +
      'com o que os termos do serviço dizem sobre uso comercial.'
    )
    process.exit(1)
  }
  if (!existsSync(args.arquivo)) {
    console.error(`arquivo não encontrado: ${args.arquivo}`)
    process.exit(1)
  }

  const manifesto = lerManifesto()
  const numero = String(proximoNumero(manifesto)).padStart(2, '0')
  const nome = `${args.familia}-${numero}.jpg`
  const destino = path.join(PASTA, nome)

  await converter(args.arquivo, destino)

  const bytes = statSync(destino).size
  if (bytes > LIMITE_BYTES) {
    console.warn(
      `  aviso: ${Math.round(bytes / 1024)} KB, acima do teto de ` +
      `${LIMITE_BYTES / 1024} KB. A foto vai embutida no HTML da peça.`
    )
  }

  manifesto[nome] = {
    origem: args.origem,
    licenca: args.licenca || regra.licenca,
    usoComercial: regra.licencaConhecida ? regra.usoComercial : null,
    nota: args.nota || '',
    recebidoDe: path.basename(args.arquivo),
  }
  writeFileSync(MANIFESTO, `${JSON.stringify(manifesto, null, 2)}\n`, 'utf8')

  console.log(`${nome}  (${Math.round(bytes / 1024)} KB, ${args.origem})`)
  if (manifesto[nome].usoComercial === null) {
    console.log('  uso comercial NÃO resolvido: edite procedencia.json antes de publicar.')
  }
}

// só roda como script; os testes importam as funções
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))) {
  principal().catch((erro) => {
    console.error(erro)
    process.exit(1)
  })
}
