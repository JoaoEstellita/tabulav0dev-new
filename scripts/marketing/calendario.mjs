#!/usr/bin/env node
/**
 * Calendário editorial: os assuntos que cada dia comporta.
 *
 * Nasceu de uma comparação. Uma ferramenta de IA de conteúdo sugeriu ao João
 * cinco pautas para agosto de 2026, e uma delas era "Lua Cheia em Aquário —
 * 11 de agosto". A Lua Cheia em Aquário tinha sido em 29 de JULHO; em 11 de
 * agosto não há fase nenhuma; a Lua Nova é dia 12 e a próxima Cheia é dia 28,
 * em Peixes. Fase errada, signo errado, data errada.
 *
 * A primeira versão listava o mesmo evento repetido por ângulo de publicação —
 * "Mercúrio entra em Leão" na véspera e no dia, "Eclipse solar" quatro vezes — e
 * o João disse o que era: aquilo não são opções. A lista agora é por ASSUNTO, e
 * um dia qualquer oferece de quatro a sete.
 *
 * Uso:
 *   node scripts/marketing/calendario.mjs                    # 21 dias a partir de hoje
 *   node scripts/marketing/calendario.mjs --dias=45
 *   node scripts/marketing/calendario.mjs --data=2026-08-06
 *   node scripts/marketing/calendario.mjs --json
 *   node scripts/marketing/calendario.mjs --upload           # alimenta o Estúdio
 */
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import process from 'node:process'

import { lerLiterais } from './lib/catalogo.mjs'
import { opcoesDoDia, bancoDeAssuntos } from './lib/pautas.mjs'

const AQUI = path.dirname(fileURLToPath(import.meta.url))
const FRONTEND = path.resolve(AQUI, '../..')

const args = process.argv.slice(2)
const valor = (nome, padrao) => {
  const achado = args.find((a) => a.startsWith(`--${nome}=`))
  return achado ? achado.slice(nome.length + 3) : padrao
}

const dias = Number(valor('dias', '21'))
const base = valor('data', '') ? new Date(`${valor('data', '')}T12:00:00Z`) : new Date()
const comoJson = args.includes('--json')

const [ps, an, orbes, nodulos] = await Promise.all([
  lerLiterais(path.join(FRONTEND, 'src/data/planetInSignOverridesPtBR.ts'), [
    'PLANET_IN_SIGN_PTBR_OVERRIDES',
  ]),
  lerLiterais(path.join(FRONTEND, 'src/data/natalPlanetAspectOverridesPtBR.ts'), [
    'NATAL_PLANET_ASPECT_PTBR_OVERRIDES',
  ]),
  lerLiterais(path.join(FRONTEND, 'src/astro/aspect-config.ts'), ['PLANET_ASPECT_ORBS']),
  // doze textos que estavam escritos no app e nunca tinham saido de la
  lerLiterais(path.join(FRONTEND, 'src/data/lunarNodeSignOverridesPtBR.ts'), [
    'LUNAR_NODE_SIGN_PTBR_OVERRIDES',
  ]),
])

const deps = {
  catalogos: {
    planetaNoSigno: ps.PLANET_IN_SIGN_PTBR_OVERRIDES,
    aspectoNatal: an.NATAL_PLANET_ASPECT_PTBR_OVERRIDES,
    noduloPorSigno: nodulos.LUNAR_NODE_SIGN_PTBR_OVERRIDES,
  },
  orbes: orbes.PLANET_ASPECT_ORBS,
}

const meioDiaUTC = (d) => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 12))

const agenda = []
for (let i = 0; i < dias; i++) {
  const data = meioDiaUTC(new Date(base.getTime() + i * 86_400_000))
  const opcoes = opcoesDoDia(data, deps)
  if (!opcoes.length) continue
  agenda.push({
    dia: data.toISOString().slice(0, 10),
    // `evento` sai do JSON: carrega Date e objetos que só interessam ao gerador,
    // e o que vai para o Estúdio precisa ser leve o bastante para caber no
    // Storage e trafegar num celular.
    opcoes: opcoes.map(({ evento, ...resto }) => resto),
  })
}

/**
 * O BANCO: o que é assunto sem ser de um dia.
 *
 * Calculado uma vez, a partir de hoje, porque nada dele muda de um dia para o
 * outro: posição de planeta vale semanas, conceito e recurso não dependem do
 * céu. Era isso que enchia a agenda de repetição — "Marte em Câncer" apareceu
 * 21 vezes em 21 dias.
 */
const banco = bancoDeAssuntos(meioDiaUTC(base), deps)

if (comoJson) {
  console.log(JSON.stringify({ agenda, banco }, null, 2))
  process.exit(0)
}

// `--upload` publica as sugestões junto das peças do dia, e é o que alimenta a
// editorial do Estúdio. Sem isso a tela não teria o que oferecer para marcar.
if (args.includes('--upload')) {
  const senha = process.env.MONITORING_PASSWORD || process.env.CRON_SECRET_TOKEN || ''
  if (!senha) {
    console.error('Upload pedido, mas falta MONITORING_PASSWORD no ambiente.')
    process.exit(1)
  }
  const backend = (process.env.TABULA_BACKEND || 'https://tabulav0dev-backend.vercel.app').replace(/\/+$/, '')
  const hoje = new Date().toISOString().slice(0, 10)

  const enviar = async (arquivo, conteudo) => {
    const resposta = await fetch(`${backend}/api/marketing-cards`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${senha}` },
      body: JSON.stringify({
        dia: hoje,
        arquivo,
        conteudoBase64: Buffer.from(JSON.stringify(conteudo), 'utf8').toString('base64'),
      }),
    })
    if (!resposta.ok) {
      console.error(`Falha ao enviar ${arquivo}: HTTP ${resposta.status} ${(await resposta.text()).slice(0, 120)}`)
      process.exit(1)
    }
  }

  await enviar('calendario.json', agenda)
  await enviar('banco.json', banco)

  const total = agenda.reduce((n, d) => n + d.opcoes.length, 0)
  console.log(`Agenda: ${total} eventos em ${agenda.length} dias.`)
  console.log(`Banco: ${banco.length} assuntos sem data.`)
  console.log(`Enviados para o Estúdio (${hoje}).`)
  process.exit(0)
}

const dataBR = (iso) =>
  new Intl.DateTimeFormat('pt-BR', {
    weekday: 'short', day: '2-digit', month: '2-digit', timeZone: 'UTC',
  }).format(new Date(`${iso}T12:00:00Z`))

const total = agenda.reduce((n, d) => n + d.opcoes.length, 0)
console.log(`\nCalendário editorial — ${dias} dias a partir de ${base.toISOString().slice(0, 10)}`)
console.log(`${total} assuntos em ${agenda.length} dias, todos de efeméride calculada.\n`)

for (const d of agenda) {
  console.log(`${dataBR(d.dia)}`)
  for (const o of d.opcoes) {
    const marca = o.tipo === 'eclipse' ? '★' : o.tipo === 'educativo' ? '·' : '●'
    console.log(`  ${marca} ${o.titulo}`)
    console.log(`    ${o.angulo}  [${o.formatos.join(' ')}]`)
  }
  console.log()
}

console.log('★ eclipse  ● evento do céu  · educativo\n')
