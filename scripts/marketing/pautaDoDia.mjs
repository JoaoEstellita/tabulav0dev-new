#!/usr/bin/env node
/**
 * O assunto de maior peso do dia, e os formatos que ele comporta.
 *
 * Existe para o workflow saber o que gerar quando NÃO há pauta salva. Antes o
 * carrossel só saía se o João tivesse marcado à mão no Estúdio — então "um
 * carrossel por dia" nunca aconteceu sozinho, mesmo nos dias em que havia o que
 * explicar.
 *
 * Sai em duas linhas, para o shell ler sem depender de jq:
 *   linha 1  os formatos, separados por vírgula
 *   linha 2  o id do assunto
 *
 * Uso:
 *   node scripts/marketing/pautaDoDia.mjs [--data=AAAA-MM-DD]
 */
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

import { lerLiterais } from './lib/catalogo.mjs'
import { opcoesDoDia } from './lib/pautas.mjs'

const AQUI = path.dirname(fileURLToPath(import.meta.url))
const FRONTEND = path.resolve(AQUI, '../..')

const arg = process.argv.slice(2).find((a) => a.startsWith('--data='))
const iso = arg ? arg.slice(7) : new Date().toISOString().slice(0, 10)
const data = new Date(`${iso}T12:00:00Z`)

const [ps, an, orbes, nn] = await Promise.all([
  lerLiterais(path.join(FRONTEND, 'src/data/planetInSignOverridesPtBR.ts'), [
    'PLANET_IN_SIGN_PTBR_OVERRIDES',
  ]),
  lerLiterais(path.join(FRONTEND, 'src/data/natalPlanetAspectOverridesPtBR.ts'), [
    'NATAL_PLANET_ASPECT_PTBR_OVERRIDES',
  ]),
  lerLiterais(path.join(FRONTEND, 'src/astro/aspect-config.ts'), ['PLANET_ASPECT_ORBS']),
  lerLiterais(path.join(FRONTEND, 'src/data/lunarNodeSignOverridesPtBR.ts'), [
    'LUNAR_NODE_SIGN_PTBR_OVERRIDES',
  ]),
])

const opcoes = opcoesDoDia(data, {
  catalogos: {
    planetaNoSigno: ps.PLANET_IN_SIGN_PTBR_OVERRIDES,
    aspectoNatal: an.NATAL_PLANET_ASPECT_PTBR_OVERRIDES,
    noduloPorSigno: nn.LUNAR_NODE_SIGN_PTBR_OVERRIDES,
  },
  orbes: orbes.PLANET_ASPECT_ORBS,
})

// `opcoesDoDia` já vem em ordem de peso: o primeiro é o assunto do dia.
const escolhido = opcoes[0]

/**
 * O dia merece um post estático além do vídeo?
 *
 * O card voltou à produção, mas só nos dias que sustentam: eclipse, lunação e
 * entrada de planeta que o público reconhece. Nos outros, o vídeo dá conta —
 * card todo dia foi o que encheu o feed de peça que servia para qualquer dia.
 */
const CORPOS_DE_PESO = ['Sun', 'Venus', 'Mars', 'Mercury', 'Jupiter', 'Saturn']

/**
 * Dia forte é o dia DO evento, não a véspera.
 *
 * A editorial continua antecipando três dias — é o que deixa o João planejar a
 * semana no Estúdio. A produção, não: o cron do dia 11 marcou o dia como forte
 * por causa do eclipse do dia 12, e a peça saiu um dia adiantada.
 *
 * A conta é feita sobre o primeiro assunto DE HOJE, não sobre o de maior peso:
 * um eclipse de amanhã, mesmo com o desconto por dia, ainda ganha de uma
 * lunação de hoje — e ao olhar só o primeiro da lista o dia de hoje ficaria
 * "comum" tendo evento próprio.
 */
// estrito: retrogradação, grau crítico e educativo não têm `diasFalta`, e
// `?? 0` os faria passar por evento de hoje
const deHoje = opcoes.find((o) => o.evento?.diasFalta === 0)
const ev = deHoje?.evento

const forte = !!deHoje && (
  deHoje.tipo === 'eclipse' ||
  deHoje.tipo === 'fase' ||
  (deHoje.tipo === 'ingresso' && CORPOS_DE_PESO.includes(ev?.corpo))
)

/**
 * A terceira linha distingue eclipse de dia forte comum.
 *
 * O eclipse é a única peça que leva carrossel, e ele precisa vencer o carrossel
 * semanal quando os dois caírem na mesma segunda: dois carrosséis no mesmo dia
 * disputariam a mesma legenda no Estúdio e um sairia sem ser lido.
 */
const forca = deHoje?.tipo === 'eclipse' ? 'eclipse' : forte ? 'forte' : 'comum'

console.log(escolhido ? escolhido.formatos.join(',') : 'reel')
console.log(escolhido ? escolhido.id : '')
console.log(forca)
