#!/usr/bin/env node
/**
 * As peças de um dia: uma por assunto marcado na editorial.
 *
 * ── POR QUE EXISTE ─────────────────────────────────────────────────────────
 *
 * O dia tinha uma peça só, e o workflow chamava `gerarEvento.mjs` uma vez. O
 * João pediu para escolher quantos assuntos quiser: "quero que eu consiga
 * selecionar quais eu quero criar independente de quantidade", "podendo ser
 * mais de um e mais de um carrossel ou post mesmo".
 *
 * Este script lê a pauta salva no Estúdio e chama o gerador uma vez por
 * assunto, cada um no seu slot. Sem pauta, gera uma peça só, pela cascata — a
 * automação nunca pode parar porque ninguém abriu a editorial.
 *
 * ── POR QUE UM PROCESSO POR PEÇA ───────────────────────────────────────────
 *
 * Cada chamada recarrega catálogo e sobe o Chrome, o que custa uns vinte
 * segundos. Em troca, uma peça que falha não leva as outras junto, e o
 * histórico é lido do disco já com o que a peça anterior gravou, que é o que
 * impede a segunda de repetir o assunto da primeira.
 *
 * Uso:
 *   node scripts/marketing/gerarDia.mjs --data=2026-08-13
 *   node scripts/marketing/gerarDia.mjs --upload
 */
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import process from 'node:process'

const execFileAsync = promisify(execFile)
const AQUI = path.dirname(fileURLToPath(import.meta.url))
const GERADOR = path.join(AQUI, 'gerarEvento.mjs')

/** Teto de peças por dia, o mesmo do backend (`p2` a `p5` mais a raiz). */
const MAXIMO = 5

function lerArgs(argv) {
  const args = {
    data: '',
    saida: '',
    upload: false,
    backend: process.env.TABULA_BACKEND || 'https://tabulav0dev-backend.vercel.app',
    senha: process.env.MONITORING_PASSWORD || process.env.CRON_SECRET_TOKEN || '',
  }
  for (const a of argv.slice(2)) {
    if (a === '--upload') args.upload = true
    else if (a.startsWith('--data=')) args.data = a.slice(7)
    else if (a.startsWith('--saida=')) args.saida = a.slice(8)
  }
  return args
}

/**
 * A pauta daquele dia, ou `null`.
 *
 * Falha de rede, senha errada e JSON quebrado dão o mesmo resultado: `null`, e
 * o dia sai com uma peça pela cascata. A editorial é conveniência, não
 * dependência.
 */
async function pautaDoDia(iso, { backend, senha }) {
  if (!senha) return null
  try {
    const r = await fetch(`${backend}/api/marketing-cards`, {
      headers: { Authorization: `Bearer ${senha}` },
    })
    if (!r.ok) return null
    const { dias } = await r.json()
    return (dias || []).find((d) => d.dia === iso)?.pauta || null
  } catch {
    return null
  }
}

/**
 * Os assuntos marcados, no formato novo ou no antigo.
 *
 * `opcoes` é a lista; `opcaoId` é a pauta de quando havia um assunto só, e
 * continua sendo lida porque há pautas antigas no Storage.
 */
function assuntosDaPauta(pauta) {
  if (!pauta) return []
  if (Array.isArray(pauta.opcoes) && pauta.opcoes.length) {
    return pauta.opcoes.slice(0, MAXIMO)
  }
  if (pauta.opcaoId) return [{ id: pauta.opcaoId, formatos: pauta.formatos || [] }]
  return []
}

async function principal() {
  const args = lerArgs(process.argv)
  const iso = args.data || new Date().toISOString().slice(0, 10)

  const pauta = await pautaDoDia(iso, args)
  const assuntos = assuntosDaPauta(pauta)

  if (!assuntos.length) {
    console.log(`${iso}: sem pauta marcada. Uma peça, pela cascata.`)
  } else {
    console.log(`${iso}: ${assuntos.length} assunto(s) marcado(s) na editorial.`)
  }

  // sem pauta, uma peça só: a lista de um item vazio faz o laço rodar uma vez
  const aGerar = assuntos.length ? assuntos : [null]
  const falhas = []

  for (let i = 0; i < aGerar.length; i++) {
    const slot = i + 1
    const a = aGerar[i]

    const argumentos = [GERADOR, `--data=${iso}`, `--slot=${slot}`]
    if (args.saida) argumentos.push(`--saida=${args.saida}`)
    if (args.upload) argumentos.push('--upload')
    if (a?.id) argumentos.push(`--assunto=${a.id}`)
    if (a?.formatos?.length) argumentos.push(`--formatos=${a.formatos.join(',')}`)

    try {
      const { stdout } = await execFileAsync(process.execPath, argumentos, {
        env: process.env,
        maxBuffer: 8 * 1024 * 1024,
      })
      process.stdout.write(stdout)
    } catch (erro) {
      // uma peça que falha não leva as outras junto: o dia sai incompleto, e o
      // log diz qual faltou
      console.error(`  peça ${slot} falhou: ${(erro.stderr || erro.message || '').slice(0, 300)}`)
      falhas.push(slot)
    }
  }

  if (falhas.length) {
    console.error(`\n${falhas.length} peça(s) não saíram: ${falhas.join(', ')}`)
    process.exit(1)
  }
}

principal().catch((e) => { console.error(e.message || e); process.exit(1) })
