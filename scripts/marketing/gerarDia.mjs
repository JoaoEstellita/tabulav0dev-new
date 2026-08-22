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

import { lerHistorico, chavesRecentes } from './lib/historico.mjs'

const execFileAsync = promisify(execFile)
const AQUI = path.dirname(fileURLToPath(import.meta.url))
const GERADOR = path.join(AQUI, 'gerarEvento.mjs')
/** A leitura dos doze ascendentes tem gerador próprio, com treze slides. */
const GERADOR_SEMANAL = path.join(AQUI, 'gerarSemanal.mjs')
/** Os temas curados do carrossel v4 (capa IA + card denso) têm gerador próprio. */
const GERADOR_V4 = path.join(AQUI, 'gerarCarrosselV4.mjs')

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
    // quantas peças, sem passar pelo Estúdio: é o único jeito de conferir o
    // laço da cascata numa máquina sem a senha do painel
    else if (a.startsWith('--pecas=')) args.pecas = Number(a.slice(8)) || 0
  }
  // o mesmo default de `gerarEvento`, para os dois lerem o mesmo histórico
  if (!args.saida) {
    args.saida = path.resolve(AQUI, '../../..', 'marketing/out')
  }
  return args
}

/**
 * O PRÓXIMO DA FILA: por POSIÇÃO, não por disponibilidade.
 *
 * A primeira versão pegava o primeiro item que não estivesse na janela de
 * catorze dias. Medido em trinta dias: a fila oscilava nos catorze primeiros e
 * nunca chegava ao décimo quinto, porque assim que o item 1 saía da janela ele
 * voltava a ser o primeiro disponível. Dez repetições em trinta dias, com 38
 * itens parados no banco.
 *
 * Agora a fila anda: acha onde parou (o último item dela que foi publicado) e
 * segue do seguinte. Dá a volta quando chega ao fim, pulando o que ainda está
 * na janela.
 */
export function proximoDaFila(fila, historico, iso) {
  if (!fila.length) return null

  const usadas = chavesRecentes(historico, iso, 1)

  // onde a fila parou: a entrada mais recente do histórico que está nela
  const entradas = Object.entries(historico)
    .filter(([, chave]) => fila.includes(chave))
    .sort(([a], [b]) => String(b).localeCompare(String(a)))

  const ultimo = entradas.length ? fila.indexOf(entradas[0][1]) : -1

  for (let salto = 1; salto <= fila.length; salto++) {
    const candidato = fila[(ultimo + salto) % fila.length]
    if (!usadas.has(candidato)) return candidato
  }

  // fila inteira publicada dentro da janela: recicla do topo em vez de parar
  return fila[(ultimo + 1) % fila.length]
}

/**
 * A pauta daquele dia, ou `null`.
 *
 * Falha de rede, senha errada e JSON quebrado dão o mesmo resultado: `null`, e
 * o dia sai com uma peça pela cascata. A editorial é conveniência, não
 * dependência.
 */
async function doEstudio(iso, { backend, senha }) {
  if (!senha) return { pauta: null, fila: [], porDia: 1 }
  try {
    const r = await fetch(`${backend}/api/marketing-cards`, {
      headers: { Authorization: `Bearer ${senha}` },
    })
    if (!r.ok) return { pauta: null, fila: [], porDia: 1 }
    const { dias } = await r.json()
    const lista = dias || []

    /**
     * A fila não pertence a data nenhuma: fica no dia em que foi salva.
     *
     * Dois formatos: array puro (a primeira versão) e `{itens, porDia}`. O
     * antigo continua sendo lido como um por dia, porque já há fila salva no
     * Storage.
     *
     * ── POR QUE NÃO SE EXIGE `itens.length` ────────────────────────────────
     *
     * Exigia, e foi assim que o dia 15/08 saiu com uma peça só. O João marcou
     * "2 por dia" e não marcou nenhum item do banco; a fila salva ficou
     * `{itens: [], porDia: 2}`, esta busca a descartou por estar vazia, e o
     * `porDia` foi junto. Fila vazia e escolha de quantidade são duas
     * informações diferentes, e só uma delas depende de haver itens.
     *
     * A lista vem do backend em ordem decrescente de dia
     * (`marketing-cards.js:332`), então a primeira encontrada é a mais recente.
     */
    const comFila = lista.find((d) => d.fila)
    const bruta = comFila?.fila

    const itens = Array.isArray(bruta) ? bruta : (bruta?.itens || [])
    const porDia = Array.isArray(bruta) ? 1 : Math.max(1, Math.min(MAXIMO, bruta?.porDia || 1))

    return {
      pauta: lista.find((d) => d.dia === iso)?.pauta || null,
      fila: itens,
      porDia,
    }
  } catch {
    return { pauta: null, fila: [], porDia: 1 }
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

  const doPainel = await doEstudio(iso, args)
  const { pauta, fila } = doPainel
  // `--pecas` vence o Estúdio: existe para teste manual, e quem o digitou sabe
  const porDia = args.pecas
    ? Math.max(1, Math.min(MAXIMO, args.pecas))
    : doPainel.porDia
  const assuntos = assuntosDaPauta(pauta)

  /**
   * A AGENDA MANDA; QUANDO ELA NÃO TEM NADA, A FILA ASSUME.
   *
   * A agenda só traz o que acontece no dia, e em trinta dias só sete têm
   * evento. Nos outros vinte e três, o assunto vem da fila do banco, na ordem
   * que o João montou. O gerador pula quem já saiu na janela de catorze dias,
   * então a fila anda sozinha sem precisar de estado extra.
   */
  let origem = 'editorial'
  let aGerar = assuntos

  if (!aGerar.length && fila.length) {
    /**
     * Quantas o João escolheu, e não mais uma fixa.
     *
     * Cada uma consome o próximo item da fila. O histórico só é gravado quando
     * a peça sai, então dentro do mesmo dia eu preciso lembrar aqui o que já
     * foi escolhido, senão as três peças sairiam com o mesmo assunto.
     */
    const historico = await lerHistorico(args.saida)
    const escolhidos = []

    for (let n = 0; n < porDia; n++) {
      const jaEscolhidos = Object.fromEntries(
        escolhidos.map((id, i) => [`${iso}#pendente${i}`, id])
      )
      const proximo = proximoDaFila(fila, { ...historico, ...jaEscolhidos }, iso)
      if (!proximo || escolhidos.includes(proximo)) break
      escolhidos.push(proximo)
    }

    origem = 'fila'
    aGerar = escolhidos.map((id) => ({ id, daFila: true, formatos: [] }))
    console.log(`${iso}: sem evento marcado. Da fila (${fila.length} itens): ${escolhidos.join(', ')}`)
  } else if (!aGerar.length) {
    /**
     * SEM AGENDA E SEM FILA: A CASCATA, TAMBÉM NA QUANTIDADE ESCOLHIDA.
     *
     * Era uma peça fixa (`aGerar = [null]`), e o João marcou 2 no Estúdio e
     * recebeu 1 sem nenhum aviso: `porDia` só era lido no ramo da fila. A
     * quantidade é escolha dele e não tem relação nenhuma com a origem do
     * assunto.
     *
     * Cada `null` faz `gerarEvento` descer a cascata sozinho. O que impede as
     * duas de saírem iguais é o histórico em disco: o processo da peça 1
     * grava a chave antes de a peça 2 começar, e `assuntoDoDia` pula o que
     * está na janela de catorze dias. É o mesmo mecanismo que separa duas
     * peças da fila, só que ali eu preciso antecipá-lo à mão porque a escolha
     * acontece antes de qualquer processo rodar.
     */
    origem = 'cascata'
    aGerar = Array.from({ length: porDia }, () => null)
    console.log(`${iso}: sem pauta e sem fila. ${porDia} peça(s), pela cascata.`)
  } else {
    console.log(`${iso}: ${aGerar.length} assunto(s) marcado(s) na agenda.`)

    /**
     * COMPLETA COM A FILA ATÉ `porDia`.
     *
     * O João marca um assunto na agenda e escolhe "2 por dia", e esperava duas
     * peças — mas a agenda mandava sozinha e o `porDia` só valia em dia vago. Um
     * assunto marcado é uma escolha do dia, não o teto dele: se ainda faltam
     * peças para o número escolhido, a fila entra no restante, pulando o que já
     * foi marcado e o que saiu na janela.
     */
    if (aGerar.length < porDia && fila.length) {
      const historico = await lerHistorico(args.saida)
      const jaMarcados = new Set(aGerar.map((a) => a.id).filter(Boolean))
      const extras = []
      const faltam = porDia - aGerar.length

      for (let n = 0; n < faltam; n++) {
        // o histórico fake faz a fila andar sem repetir o marcado nem os extras
        const pendentes = Object.fromEntries([
          ...[...jaMarcados].map((id, i) => [`${iso}#marcado${i}`, id]),
          ...extras.map((id, i) => [`${iso}#extra${i}`, id]),
        ])
        const proximo = proximoDaFila(fila, { ...historico, ...pendentes }, iso)
        if (!proximo || jaMarcados.has(proximo) || extras.includes(proximo)) break
        extras.push(proximo)
      }

      if (extras.length) {
        aGerar = [...aGerar, ...extras.map((id) => ({ id, daFila: true, formatos: [] }))]
        console.log(`  completando com a fila até ${porDia}: +${extras.join(', ')}`)
      }
    }
  }

  if (origem === 'editorial' && fila.length) {
    // nada a fazer, mas o log ajuda a entender o dia quando algo sair estranho
    console.log(`  (a fila tem ${fila.length} itens esperando dia vago)`)
  }
  const falhas = []

  for (let i = 0; i < aGerar.length; i++) {
    const slot = i + 1
    const a = aGerar[i]

    /**
     * O carrossel dos doze ascendentes tem script próprio.
     *
     * Ele era um step à parte no workflow, rodando toda segunda por calendário.
     * Como item do banco, chega aqui como qualquer outro id, e o que muda é só
     * qual gerador atende.
     */
    const ehSemanal = a?.id === 'semanal'
    // um tema v4 marcado no Estúdio chega como `v4:<chave>` e tem gerador próprio
    // (capa IA + card denso). O que muda é só qual script atende.
    const ehV4 = typeof a?.id === 'string' && a.id.startsWith('v4:')
    const script = ehV4 ? GERADOR_V4 : ehSemanal ? GERADOR_SEMANAL : GERADOR

    const argumentos = [script, `--data=${iso}`]
    if (ehV4) argumentos.push(`--tema=${a.id.slice(3)}`)
    if (!ehSemanal && !ehV4) argumentos.push(`--slot=${slot}`)
    if (args.saida) argumentos.push(`--saida=${args.saida}`)
    if (args.upload) argumentos.push('--upload')
    if (!ehSemanal && !ehV4 && a?.id) argumentos.push(`--assunto=${a.id}`)
    if (!ehSemanal && !ehV4 && a?.formatos?.length) argumentos.push(`--formatos=${a.formatos.join(',')}`)

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
