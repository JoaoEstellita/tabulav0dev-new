import { describe, expect, it } from 'vitest'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { lerLiterais } from '../catalogo.mjs'
import { mapaDoCeu } from '../ceu.mjs'
import { eventosDoDia, ingressosProximos, entradaNoSigno } from '../eventos.mjs'
import { temaEducativo } from '../educativo.mjs'
import { efemerideAnimada, janelaDaAnimacao, deslocamentoDoProtagonista } from '../efemerideAnimada.mjs'
import { escrever } from '../vozes.mjs'

const FRONTEND = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..')

const [ps, an, orbesArq] = await Promise.all([
  lerLiterais(path.join(FRONTEND, 'src/data/planetInSignOverridesPtBR.ts'), [
    'PLANET_IN_SIGN_PTBR_OVERRIDES',
  ]),
  lerLiterais(path.join(FRONTEND, 'src/data/natalPlanetAspectOverridesPtBR.ts'), [
    'NATAL_PLANET_ASPECT_PTBR_OVERRIDES',
  ]),
  lerLiterais(path.join(FRONTEND, 'src/astro/aspect-config.ts'), ['PLANET_ASPECT_ORBS']),
])

const CATALOGOS = {
  planetaNoSigno: ps.PLANET_IN_SIGN_PTBR_OVERRIDES,
  aspectoNatal: an.NATAL_PLANET_ASPECT_PTBR_OVERRIDES,
}
const ORBES = orbesArq.PLANET_ASPECT_ORBS
const meioDia = (d) => new Date(`${d}T12:00:00Z`)

/**
 * O card de 07/08/2026 saiu com "Mercúrio em Câncer" — e Mercúrio entrava em
 * Leão dia 09. Das seis posições disponíveis era a ÚNICA expirando em dois
 * dias, e foi escolhida porque nenhuma tinha critério de validade: todas
 * pesavam 70 e o desempate caía na ordem do array.
 */
describe('validade do assunto educativo', () => {
  it('07/08/2026 deixa de escolher Mercúrio em Câncer', () => {
    const d = meioDia('2026-08-07')
    const tema = temaEducativo(mapaDoCeu(d, ORBES), CATALOGOS, new Set(), {
      ingressos: ingressosProximos(d, 40),
      data: d,
    })
    expect(tema.titulo).not.toBe('Mercúrio em Câncer')
    expect(tema.diasRestantes).toBeGreaterThanOrEqual(5)
  })

  it('nenhuma posição com menos de cinco dias vira assunto, em 45 dias', () => {
    const usadas = new Set()
    for (let i = 0; i < 45; i++) {
      const d = new Date(Date.UTC(2026, 7, 7) + i * 86_400_000)
      const tema = temaEducativo(mapaDoCeu(d, ORBES), CATALOGOS, usadas, {
        ingressos: ingressosProximos(d, 40),
        data: d,
      })
      if (!tema) continue
      usadas.add(tema.chave)
      if (tema.tipo !== 'planeta_no_signo') continue
      expect(tema.diasRestantes, `${d.toISOString().slice(0, 10)} — ${tema.titulo}`)
        .toBeGreaterThanOrEqual(5)
    }
  })

  // Retrogradação estica a permanência muito além do normal, e sessenta dias de
  // busca não bastavam: em 07/08/2026 Mercúrio estava em Câncer havia mais de
  // dois meses porque retrogradou dentro do signo.
  it('acha a entrada no signo mesmo com permanência esticada por retrógrado', () => {
    const entrada = entradaNoSigno('Mercury', meioDia('2026-08-07'))
    expect(entrada).not.toBeNull()
    expect(entrada.getTime()).toBeLessThan(meioDia('2026-08-07').getTime())
  })
})

/**
 * O Reel anunciava "Mercúrio entra em Leão · faltam 2 dias" e a carta mostrava
 * Mercúrio parado a 26° de Câncer. O rótulo não mentia, mas a imagem
 * contradizia o título.
 */
describe('céu em movimento', () => {
  const d = meioDia('2026-08-07')
  const mapa = mapaDoCeu(d, ORBES)
  const evento = eventosDoDia(d, mapa.aspectos)[0]
  const ef = efemerideAnimada(d, evento, ORBES, 360)

  it('a janela termina depois do evento, não em cima dele', () => {
    expect(evento.tipo).toBe('ingresso')
    expect(ef.janela.fim.getTime()).toBeGreaterThan(evento.quando.getTime())
    expect(ef.janela.comEvento).toBe(true)
  })

  // A prova de que a incoerência acabou: no último quadro o planeta já está do
  // outro lado da divisa que o título anuncia.
  it('no último quadro o planeta já cruzou para o signo do título', () => {
    const j = ef.nomes.indexOf('Mercury')
    const inicioDeLeao = 120
    expect(ef.quadros[0][j]).toBeLessThan(inicioDeLeao)
    expect(ef.quadros[ef.quadros.length - 1][j]).toBeGreaterThanOrEqual(inicioDeLeao)
  })

  // Numa véspera de dois dias Mercúrio andaria 3,65° — 21px de arco, no limite
  // do que se enxerga. Cinco dias de aproximação resolvem.
  it('o protagonista anda o suficiente para o movimento ser visto', () => {
    const graus = deslocamentoDoProtagonista(ef, 'Mercury')
    const pixels = (graus * Math.PI) / 180 * 336
    expect(pixels, `${graus.toFixed(2)}° = ${Math.round(pixels)}px`).toBeGreaterThan(30)
  })

  it('sem evento, a janela é a semana em torno de hoje', () => {
    const j = janelaDaAnimacao(d, null)
    expect(j.comEvento).toBe(false)
    expect(Math.round((j.fim - j.inicio) / 86_400_000)).toBe(7)
  })

  it('todo quadro traz uma longitude por corpo', () => {
    expect(ef.quadros).toHaveLength(360)
    for (const linha of ef.quadros) {
      expect(linha).toHaveLength(ef.nomes.length)
      for (const lon of linha) {
        expect(lon).toBeGreaterThanOrEqual(0)
        expect(lon).toBeLessThan(360)
      }
    }
  })
})

/**
 * "A conversa e o raciocínio querem ser vistos" não toca ninguém porque não
 * fala de nada que alguém reconheça ter vivido. O condicional propõe uma
 * observação e deixa a pessoa descartar se não bater — não afirma.
 */
describe('voz condicional', () => {
  const ingressos = ingressosProximos(meioDia('2026-08-07'), 60)

  it('todo ingresso com signo anterior conhecido abre no condicional', () => {
    for (const i of ingressos) {
      if (!i.signoAnterior) continue
      expect(escrever(i).texto, i.corpoPt).toMatch(/^Se /)
    }
  })

  it('diz de onde o planeta sai e desde quando', () => {
    const merc = ingressos.find((i) => i.corpo === 'Mercury')
    const texto = escrever(merc).texto
    expect(texto).toContain('sai de Câncer')
    expect(texto).toContain('onde estava desde')
  })

  // "as suas conversas andou mais defensivo" foi a primeira saída: sujeito
  // plural feminino com verbo singular e adjetivo masculino.
  it('concorda em número e gênero', () => {
    const merc = escrever(ingressos.find((i) => i.corpo === 'Mercury')).texto
    expect(merc).toContain('as suas conversas andaram')
    expect(merc).toContain('defensivas')
    expect(merc).not.toContain('conversas andou')

    const sol = escrever(ingressos.find((i) => i.corpo === 'Sun')).texto
    expect(sol).toContain('a sua vontade de aparecer andou')
    expect(sol).toContain('O Sol sai de')
  })
})
