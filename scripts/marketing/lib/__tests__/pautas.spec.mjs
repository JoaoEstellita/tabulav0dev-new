import { describe, expect, it } from 'vitest'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { lerLiterais } from '../catalogo.mjs'
import { opcoesDoDia, acharOpcao, idDoAssunto, formatosDoAssunto } from '../pautas.mjs'
import { falaComQuemLe } from '../educativo.mjs'

const FRONTEND = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..')

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

const DEPS = {
  catalogos: {
    planetaNoSigno: ps.PLANET_IN_SIGN_PTBR_OVERRIDES,
    aspectoNatal: an.NATAL_PLANET_ASPECT_PTBR_OVERRIDES,
    noduloPorSigno: nn.LUNAR_NODE_SIGN_PTBR_OVERRIDES,
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

  /**
   * O que o assunto comporta, e nada além.
   *
   * Devolvia `['reel']` para tudo, da fase do vídeo diário. Como o Estúdio monta
   * as caixinhas a partir deste array, o João abriu a editorial e viu uma opção
   * só — e era o formato que tinha saído da produção: "no editorial não tem mais
   * os carrosséis?".
   *
   * O vídeo não aparece porque saiu do automático enquanto o template é refeito.
   */
  it('nenhum assunto oferece vídeo enquanto ele está fora do automático', () => {
    for (const o of opcoesDoDia(meioDia('2026-08-12'), DEPS)) {
      expect(o.formatos, o.titulo).not.toContain('reel')
      expect(o.formatos.length, o.titulo).toBeGreaterThan(0)
    }
  })

  it('só o eclipse comporta carrossel', () => {
    expect(formatosDoAssunto({ tipo: 'eclipse' })).toEqual(['post', 'carrossel', 'story'])
    expect(formatosDoAssunto({ tipo: 'fase' })).toEqual(['post', 'story'])
    expect(formatosDoAssunto({ tipo: 'ingresso', corpo: 'Mars' })).toEqual(['post', 'story'])

    // treze slides sobre a Lua fora de curso seria carrossel por carrossel
    expect(formatosDoAssunto({ tipo: 'educativo' })).toEqual(['post'])
    expect(formatosDoAssunto({ tipo: 'lua_fora_de_curso' })).toEqual(['post'])
    // Plutão muda de signo uma vez por geração, e ninguém reconhece o nome
    expect(formatosDoAssunto({ tipo: 'ingresso', corpo: 'Pluto' })).toEqual(['post'])
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

/**
 * O defeito que passou despercebido por um dia inteiro em producao.
 *
 * A regra "sem segunda pessoa" sempre existiu, e a verificacao que a sustentava
 * estava quebrada: `\bvocê\b` NUNCA casa em JavaScript, porque `\b` so reconhece
 * `[A-Za-z0-9_]` como caractere de palavra e `ê` nao e um deles. A auditoria
 * dava zero e o card publicava "quando você lidera" com naturalidade.
 */
describe('segunda pessoa', () => {
  it('o regex pega o que o \b nao pegava', () => {
    expect(falaComQuemLe('quando você lidera sem precisar')).toBe(true)
    expect(falaComQuemLe('a necessidade de reconhecimento')).toBe(false)
    expect(falaComQuemLe('Sua determinacao permite agir')).toBe(true)
    expect(falaComQuemLe('o seu mapa')).toBe(true)
    // nao pode pegar palavra que apenas CONTEM o pronome
    expect(falaComQuemLe('a seiva sobe pela raiz')).toBe(false)
    expect(falaComQuemLe('suave e constante')).toBe(false)
  })

  it('nenhum assunto oferecido fala com quem le', () => {
    for (const dia of ['2026-08-08', '2026-08-15', '2026-11-01', '2026-11-15']) {
      for (const o of opcoesDoDia(meioDia(dia), DEPS)) {
        const texto = o.evento?.texto || ''
        expect(falaComQuemLe(texto), `${dia} — ${o.titulo}`).toBe(false)
      }
    }
  })
})

/**
 * Estados e posicoes que rodam num ritmo diferente do ceu de eventos. Sem eles
 * o pool repetia: planeta-em-signo fica disponivel o mes inteiro.
 */
describe('assuntos de ritmo proprio', () => {
  it('retrogradacao em curso vira assunto, com data de fim', () => {
    const ops = opcoesDoDia(meioDia('2026-11-01'), DEPS)
    const retro = ops.filter((o) => o.tipo === 'retrogradacao')
    expect(retro.length).toBeGreaterThan(0)
    for (const r of retro) {
      expect(r.evento.ate, r.titulo).toBeInstanceOf(Date)
      expect(r.angulo).toMatch(/faltam \d+ dias/)
    }
  })

  // Urano, Netuno e Plutao passam ~5 meses por ano retrogrados: como assunto
  // diario virariam ruido permanente, igual ao aspecto entre dois lentos.
  it('so Mercurio, Venus e Marte contam como retrogrado', () => {
    for (const dia of ['2026-08-07', '2026-11-01']) {
      for (const o of opcoesDoDia(meioDia(dia), DEPS)) {
        if (o.tipo !== 'retrogradacao') continue
        expect(['Mercury', 'Venus', 'Mars'], o.titulo).toContain(o.evento.corpo)
      }
    }
  })

  it('grau critico so em 0 e 29', () => {
    for (const dia of ['2026-08-07', '2026-09-01', '2026-10-01']) {
      for (const o of opcoesDoDia(meioDia(dia), DEPS)) {
        if (o.tipo !== 'grau_critico') continue
        expect([0, 29], o.titulo).toContain(o.evento.grau)
      }
    }
  })

  // `SearchMoonNode` devolve ora o ascendente ora o descendente, e sem olhar o
  // `kind` o signo parecia pular de Leao para Aquario sem nada ter se movido.
  it('o eixo dos nodulos e consistente entre datas proximas', () => {
    const a = opcoesDoDia(meioDia('2026-11-01'), DEPS).find((o) => o.tipo === 'nodulos')
    const b = opcoesDoDia(meioDia('2026-11-08'), DEPS).find((o) => o.tipo === 'nodulos')
    if (!a || !b) return // signo sem texto utilizavel
    expect(a.evento.norte.signo).toBe(b.evento.norte.signo)
  })

  it('o Norte e sempre oposto ao Sul', () => {
    const n = opcoesDoDia(meioDia('2026-11-01'), DEPS).find((o) => o.tipo === 'nodulos')
    if (!n) return
    const SIG = ['Áries','Touro','Gêmeos','Câncer','Leão','Virgem','Libra','Escorpião','Sagitário','Capricórnio','Aquário','Peixes']
    const iN = SIG.indexOf(n.evento.norte.signo)
    const iS = SIG.indexOf(n.evento.sul.signo)
    expect((iN + 6) % 12).toBe(iS)
  })
})
