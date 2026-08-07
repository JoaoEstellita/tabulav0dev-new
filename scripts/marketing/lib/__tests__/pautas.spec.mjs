import { describe, expect, it } from 'vitest'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { lerLiterais } from '../catalogo.mjs'
import { opcoesDoDia, acharOpcao, idDoAssunto, formatosDoAssunto } from '../pautas.mjs'

const FRONTEND = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..')

const [ps, an, orbes] = await Promise.all([
  lerLiterais(path.join(FRONTEND, 'src/data/planetInSignOverridesPtBR.ts'), [
    'PLANET_IN_SIGN_PTBR_OVERRIDES',
  ]),
  lerLiterais(path.join(FRONTEND, 'src/data/natalPlanetAspectOverridesPtBR.ts'), [
    'NATAL_PLANET_ASPECT_PTBR_OVERRIDES',
  ]),
  lerLiterais(path.join(FRONTEND, 'src/astro/aspect-config.ts'), ['PLANET_ASPECT_ORBS']),
])

const DEPS = {
  catalogos: {
    planetaNoSigno: ps.PLANET_IN_SIGN_PTBR_OVERRIDES,
    aspectoNatal: an.NATAL_PLANET_ASPECT_PTBR_OVERRIDES,
  },
  orbes: orbes.PLANET_ASPECT_ORBS,
}

const meioDia = (d) => new Date(`${d}T12:00:00Z`)

/**
 * A editorial nasceu listando o mesmo evento repetido por ângulo de publicação —
 * "Mercúrio entra em Leão" na véspera e no dia, "Eclipse solar" quatro vezes — e
 * o João disse o que era: aquilo não são opções, é a mesma coisa várias vezes.
 */
describe('opções de um dia', () => {
  it('cada dia oferece ao menos três assuntos', () => {
    for (const dia of ['2026-08-08', '2026-08-12', '2026-08-15', '2026-08-30']) {
      const ops = opcoesDoDia(meioDia(dia), DEPS)
      expect(ops.length, dia).toBeGreaterThanOrEqual(3)
    }
  })

  it('os títulos não se repetem dentro do mesmo dia', () => {
    for (const dia of ['2026-08-08', '2026-08-12', '2026-08-15']) {
      const ops = opcoesDoDia(meioDia(dia), DEPS)
      const titulos = ops.map((o) => o.titulo)
      expect(new Set(titulos).size, `${dia}: ${titulos.join(' | ')}`).toBe(titulos.length)
    }
  })

  it('os ids não se repetem dentro do mesmo dia', () => {
    for (const dia of ['2026-08-08', '2026-08-12', '2026-08-15']) {
      const ids = opcoesDoDia(meioDia(dia), DEPS).map((o) => o.id)
      expect(new Set(ids).size, dia).toBe(ids.length)
    }
  })

  // A pauta guarda o id e o gerador o procura no dia seguinte. Id instável
  // significa escolha do João sumindo sem aviso.
  it('o id é estável entre duas chamadas', () => {
    const d = meioDia('2026-08-12')
    const a = opcoesDoDia(d, DEPS).map((o) => o.id)
    const b = opcoesDoDia(d, DEPS).map((o) => o.id)
    expect(a).toEqual(b)
  })

  it('oferece mais de um educativo, e distintos', () => {
    const educativos = opcoesDoDia(meioDia('2026-08-15'), DEPS).filter((o) => o.tipo === 'educativo')
    expect(educativos.length).toBeGreaterThanOrEqual(2)
    expect(new Set(educativos.map((o) => o.titulo)).size).toBe(educativos.length)
  })

  // O aspecto nunca encabeça uma peça — fica exato por semanas e sai repetido.
  // Oferecê-lo como assunto seria oferecer algo que o gerador recusaria.
  it('não oferece aspecto como assunto', () => {
    for (const dia of ['2026-08-08', '2026-08-12', '2026-08-15']) {
      const ops = opcoesDoDia(meioDia(dia), DEPS)
      expect(ops.some((o) => o.tipo === 'aspecto'), dia).toBe(false)
    }
  })

  it('todo assunto comporta ao menos o card', () => {
    for (const o of opcoesDoDia(meioDia('2026-08-12'), DEPS)) {
      expect(o.formatos, o.titulo).toContain('card')
    }
  })

  it('só eclipse e evento do dia com eixo comportam carrossel', () => {
    const ops = opcoesDoDia(meioDia('2026-08-12'), DEPS)
    const comCarrossel = ops.filter((o) => o.formatos.includes('carrossel'))
    for (const o of comCarrossel) {
      expect(['eclipse', 'ingresso', 'fase'], o.titulo).toContain(o.tipo)
    }
  })

  it('educativo e Lua fora de curso ficam no card', () => {
    expect(formatosDoAssunto({ tipo: 'educativo' })).toEqual(['card'])
    expect(formatosDoAssunto({ tipo: 'lua_fora_de_curso' })).toEqual(['card'])
  })

  it('acharOpcao devolve null quando o id não existe mais', () => {
    const ops = opcoesDoDia(meioDia('2026-08-12'), DEPS)
    expect(acharOpcao(ops, 'educativo:natal:inexistente')).toBeNull()
    expect(acharOpcao(ops, '')).toBeNull()
    expect(acharOpcao(ops, ops[0].id)).toBe(ops[0])
  })

  it('o id carrega o tipo, para ser legível no JSON da pauta', () => {
    expect(idDoAssunto({ tipo: 'ingresso', corpo: 'Venus', signo: 'Libra' }))
      .toBe('ingresso:Venus:Libra')
    expect(idDoAssunto({ tipo: 'educativo', chave: 'natal:venus_in_libra' }))
      .toBe('educativo:natal:venus_in_libra')
  })
})
