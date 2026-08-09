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
const forte =
  escolhido?.tipo === 'eclipse' ||
  escolhido?.tipo === 'fase' ||
  (escolhido?.tipo === 'ingresso' && CORPOS_DE_PESO.includes(escolhido.evento?.corpo))

console.log(escolhido ? escolhido.formatos.join(',') : 'reel')
console.log(escolhido ? escolhido.id : '')
console.log(forte ? 'forte' : 'comum')
