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

  /**
   * A janela é o PRÓPRIO DIA, e não mais cinco dias de aproximação.
   *
   * O João assistiu à versão anterior e disse o que estava errado: "a lua anda
   * 2 signos". Andava — 74,7° na janela de cinco dias, contra 7,3° do planeta
   * que a manchete anunciava. Quem assiste segue o que se move, e o que se
   * movia não era o assunto. A peça passou a ser o retrato de um dia.
   */
  it('a janela cobre exatamente 24 horas', () => {
    expect(Math.round((ef.janela.fim - ef.janela.inicio) / 3_600_000)).toBe(24)
  })

  it('começa à meia-noite de Brasília, não ao meio-dia', () => {
    // 03:00 UTC é 00:00 em Brasília (UTC−3)
    expect(ef.janela.inicio.getUTCHours()).toBe(3)
    expect(ef.janela.inicio.toISOString().slice(0, 10)).toBe('2026-08-07')
  })

  it('a Lua não atravessa um signo inteiro', () => {
    const graus = deslocamentoDoProtagonista(ef, 'Moon')
    expect(graus, `${graus.toFixed(1)}° num dia`).toBeGreaterThan(11)
    expect(graus, `${graus.toFixed(1)}° num dia`).toBeLessThan(16)
  })

  // Um dia de céu é pouco movimento para os planetas, e é isso mesmo: quem
  // anda visivelmente é a Lua. A trava anterior — "o protagonista precisa
  // andar 30px" — não vale mais, porque a peça deixou de ser sobre a viagem.
  it('os planetas quase não saem do lugar, como no céu de verdade', () => {
    expect(deslocamentoDoProtagonista(ef, 'Mercury')).toBeLessThan(3)
    expect(deslocamentoDoProtagonista(ef, 'Jupiter')).toBeLessThan(0.5)
  })

  it('a janela é a mesma com ou sem evento', () => {
    const comEvento = janelaDaAnimacao(d, evento)
    const semEvento = janelaDaAnimacao(d, null)
    expect(semEvento.inicio.getTime()).toBe(comEvento.inicio.getTime())
    expect(semEvento.fim.getTime()).toBe(comEvento.fim.getTime())
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
