#!/usr/bin/env node
/**
 * Calendário editorial: o que postar, em que dia, e por quê.
 *
 * Nasceu de uma comparação. Uma ferramenta de IA de conteúdo sugeriu ao João
 * cinco pautas para agosto de 2026, e uma delas era "Lua Cheia em Aquário —
 * 11 de agosto". A Lua Cheia em Aquário tinha sido em 29 de JULHO; em 11 de
 * agosto não há fase nenhuma; a Lua Nova é dia 12 e a próxima Cheia é dia 28,
 * em Peixes. Fase errada, signo errado, data errada — e nenhuma menção ao
 * eclipse solar total de 12 de agosto, que é o maior evento do ano.
 *
 * O calendário aqui sai da efeméride, então não tem como inventar evento. Serve
 * para planejar a semana de uma vez em vez de descobrir a pauta na véspera.
 *
 * Uso:
 *   node scripts/marketing/calendario.mjs                    # 30 dias a partir de hoje
 *   node scripts/marketing/calendario.mjs --dias=45
 *   node scripts/marketing/calendario.mjs --data=2026-08-06
 *   node scripts/marketing/calendario.mjs --json
 */
import {
  eclipsesProximos,
  ingressosProximos,
  estacoesProximas,
  fasesDaLua,
} from './lib/eventos.mjs'
import { escrever, eixoDoSigno, mereceEixo } from './lib/vozes.mjs'

const args = process.argv.slice(2)
const valor = (nome, padrao) => {
  const achado = args.find((a) => a.startsWith(`--${nome}=`))
  return achado ? achado.slice(nome.length + 3) : padrao
}

const dias = Number(valor('dias', '30'))
const base = valor('data', '') ? new Date(`${valor('data', '')}T12:00:00Z`) : new Date()
const comoJson = args.includes('--json')

/**
 * Quantos dias antes vale começar a falar.
 *
 * Eclipse sustenta uma semana de antecipação porque o público já ouviu falar
 * dele em outro lugar. Ingresso de planeta rápido não sustenta: falar de Mercúrio
 * em Leão cinco dias antes é falar sozinho.
 */
function antecedencia(ev) {
  if (ev.tipo === 'eclipse') return [5, 2, 0]
  if (ev.tipo === 'fase') return [1, 0]
  if (ev.tipo === 'retrogrado' || ev.tipo === 'direto') return [2, 0]
  return [1, 0]
}

/** O ângulo editorial de cada peça, conforme a distância do evento. */
function angulo(ev, falta) {
  if (falta === 0) return 'É hoje — o dado exato, com hora'
  if (falta === 1) return 'Amanhã — o que muda e o que não muda'
  return `Faltam ${falta} dias — explica o que é, antes de todo mundo repetir`
}

const eventos = [
  ...eclipsesProximos(base, dias),
  ...ingressosProximos(base, dias),
  ...estacoesProximas(base, dias),
  ...fasesDaLua(base, Math.ceil(dias / 7) + 1),
].filter((e) => e.quando >= base && e.quando <= new Date(base.getTime() + dias * 86_400_000))

// Todo eclipse é uma lunação: sem isto o dia 12 apareceria duas vezes.
const diasComEclipse = new Set(
  eventos.filter((e) => e.tipo === 'eclipse').map((e) => e.quando.toISOString().slice(0, 10))
)
const limpos = eventos.filter(
  (e) => !(e.tipo === 'fase' && diasComEclipse.has(e.quando.toISOString().slice(0, 10)))
)

const pautas = []
for (const ev of limpos) {
  for (const falta of antecedencia(ev)) {
    const quando = new Date(ev.quando.getTime() - falta * 86_400_000)
    if (quando < base) continue
    pautas.push({ publicarEm: quando, falta, evento: ev })
  }
}
pautas.sort((a, b) => a.publicarEm - b.publicarEm)

if (comoJson) {
  console.log(
    JSON.stringify(
      pautas.map((p) => ({
        publicarEm: p.publicarEm.toISOString().slice(0, 10),
        diasAntes: p.falta,
        titulo: escrever(p.evento).titulo,
        tipo: p.evento.tipo,
        angulo: angulo(p.evento, p.falta),
        eixo: mereceEixo(p.evento) ? eixoDoSigno(p.evento.signo)?.todos : null,
      })),
      null,
      2
    )
  )
  process.exit(0)
}

const dataBR = (d) =>
  new Intl.DateTimeFormat('pt-BR', {
    weekday: 'short', day: '2-digit', month: '2-digit', timeZone: 'America/Sao_Paulo',
  }).format(d)

console.log(`\nCalendário editorial — ${dias} dias a partir de ${base.toISOString().slice(0, 10)}`)
console.log(`${pautas.length} pautas, todas ancoradas em efeméride calculada.\n`)

for (const p of pautas) {
  const e = escrever(p.evento)
  const marca = p.evento.tipo === 'eclipse' ? '★' : p.falta === 0 ? '●' : '○'
  console.log(`${marca} ${dataBR(p.publicarEm).padEnd(14)} ${e.titulo}`)
  console.log(`  ${' '.repeat(14)} ${angulo(p.evento, p.falta)}`)
  if (mereceEixo(p.evento)) {
    const eixo = eixoDoSigno(p.evento.signo)
    if (eixo) console.log(`  ${' '.repeat(14)} eixo: ${eixo.todos.join(', ')}`)
  }
  console.log()
}

console.log('★ eclipse  ● no dia  ○ antecipação\n')
