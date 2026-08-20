import { describe, expect, it } from 'vitest'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { lerLiterais } from '../catalogo.mjs'
import { mapaDoCeu } from '../ceu.mjs'
import { assuntoDoDia, chaveDoAssunto } from '../assuntoDoDia.mjs'
import { pecaDoAssunto } from '../pecaDoAssunto.mjs'
import { chavesRecentes } from '../historico.mjs'
import { CONCEITO, conceitoDoDia } from '../textosConceito.mjs'
import { LUA_VAZIA_POR_SIGNO } from '../textosLuaVazia.mjs'
import { carregarCatalogos } from '../interpretacao.mjs'

const FRONTEND = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..')

const [ps, an, orbes] = await Promise.all([
  lerLiterais(path.join(FRONTEND, 'src/data/planetInSignOverridesPtBR.ts'),
    ['PLANET_IN_SIGN_PTBR_OVERRIDES']),
  lerLiterais(path.join(FRONTEND, 'src/data/natalPlanetAspectOverridesPtBR.ts'),
    ['NATAL_PLANET_ASPECT_PTBR_OVERRIDES']),
  lerLiterais(path.join(FRONTEND, 'src/astro/aspect-config.ts'), ['PLANET_ASPECT_ORBS']),
])

const CATALOGOS = {
  planetaNoSigno: ps.PLANET_IN_SIGN_PTBR_OVERRIDES,
  aspectoNatal: an.NATAL_PLANET_ASPECT_PTBR_OVERRIDES,
}
const INTERPRETACAO = await carregarCatalogos()

const meioDia = (iso) => new Date(`${iso}T12:00:00Z`)

/** Um dia, com o histórico da janela já aplicado. */
function escolher(iso, historico = {}) {
  const data = meioDia(iso)
  return assuntoDoDia(data, {
    mapa: mapaDoCeu(data, orbes.PLANET_ASPECT_ORBS),
    catalogos: CATALOGOS,
    iso,
    usadas: chavesRecentes(historico, iso),
  })
}

/** Roda uma sequência de dias como a produção roda: um por vez, com histórico. */
function correr(isoInicial, dias) {
  const historico = {}
  const saida = []
  const base = meioDia(isoInicial)
  for (let i = 0; i < dias; i++) {
    const iso = new Date(base.getTime() + i * 86_400_000).toISOString().slice(0, 10)
    const a = escolher(iso, historico)
    const chave = chaveDoAssunto(a)
    historico[iso] = chave
    saida.push({ iso, chave, assunto: a })
  }
  return saida
}

describe('o assunto do dia', () => {
  it('nunca devolve vazio', () => {
    for (const { iso, assunto } of correr('2026-08-12', 30)) {
      expect(assunto, iso).toBeTruthy()
      expect(assunto.tipo, iso).toBeTruthy()
    }
  })

  /**
   * A lua fora de curso de 13/08/2026 dura 42,3h e `eventosDoDia` a devolve nos
   * dias 13, 14 e 15, porque `emCurso` é verdadeiro nos três. Era o caminho
   * direto para três posts idênticos.
   */
  it('a lua fora de curso de 42h sai em um dia só', () => {
    const dias = correr('2026-08-12', 6)
    const luas = dias.filter((d) => d.chave.startsWith('luav:2026-08-13'))
    expect(luas.map((l) => l.iso)).toEqual(['2026-08-13'])
  })

  /**
   * Dois planetas lentos ficam com orbe fechado por semanas: Plutão sextil
   * Netuno apareceria seis vezes em trinta dias como assunto do dia.
   */
  it('aspecto entre dois planetas lentos nunca encabeça', () => {
    for (const { iso, assunto } of correr('2026-08-12', 45)) {
      if (assunto.tipo !== 'aspecto') continue
      const { agente, alvo } = assunto.aspecto
      const pessoais = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars']
      expect(
        pessoais.includes(agente) || pessoais.includes(alvo),
        `${iso}: ${agente} e ${alvo}`
      ).toBe(true)
    }
  })

  it('não repete assunto dentro de catorze dias', () => {
    const dias = correr('2026-08-12', 45)
    for (let i = 0; i < dias.length; i++) {
      for (let j = i + 1; j < Math.min(i + 15, dias.length); j++) {
        expect(dias[i].chave, `${dias[i].iso} e ${dias[j].iso}`).not.toBe(dias[j].chave)
      }
    }
  })

  /** Os dois foram pedidos, e o educativo sozinho sufocava o conceito. */
  it('conceito e educativo aparecem, alternando', () => {
    const chaves = correr('2026-08-12', 60).map((d) => d.chave)
    expect(chaves.filter((c) => c.startsWith('conceito:')).length).toBeGreaterThan(0)
    expect(chaves.filter((c) => c.startsWith('luav:')).length).toBeGreaterThan(0)
  })

  /**
   * Aspecto de trânsito só vira peça com texto de TRÂNSITO próprio.
   *
   * Antes puxava o texto NATAL do app ("quem nasce assim…"), descrição do mapa
   * e não do céu de hoje. Sem nenhum texto de trânsito de aspecto escrito ainda,
   * nenhum aspecto deve encabeçar — cai no educativo.
   */
  it('aspecto não vira peça sem texto de trânsito', () => {
    const chaves = correr('2026-08-12', 60).map((d) => d.chave)
    expect(chaves.filter((c) => c.startsWith('asp:')).length).toBe(0)
  })

  it('a chave de um assunto é estável entre duas chamadas', () => {
    expect(chaveDoAssunto(escolher('2026-08-23'))).toBe(chaveDoAssunto(escolher('2026-08-23')))
  })

  /** Regerar um dia publicado não pode trocar o assunto. */
  it('regerar o mesmo dia devolve o mesmo assunto', () => {
    const historico = { '2026-08-23': 'ingresso:Sun:Virgem' }
    expect(chaveDoAssunto(escolher('2026-08-23', historico))).toBe('ingresso:Sun:Virgem')
  })
})

describe('a peça de cada tipo', () => {
  const CAMPOS = ['olho', 'titulo', 'texto', 'signo']

  it('nenhum tipo produz undefined, NaN ou objeto solto', () => {
    for (const { iso, assunto } of correr('2026-08-12', 45)) {
      const peca = pecaDoAssunto(assunto, { iso, catalogos: INTERPRETACAO })
      for (const campo of CAMPOS) {
        const v = String(peca[campo] ?? '')
        expect(v, `${iso} ${assunto.tipo} ${campo}`).not.toMatch(/undefined|NaN|\[object/)
        expect(v.length, `${iso} ${assunto.tipo} ${campo} vazio`).toBeGreaterThan(0)
      }
    }
  })

  it('o texto cabe no quadro', () => {
    for (const { iso, assunto } of correr('2026-08-12', 45)) {
      const { texto } = pecaDoAssunto(assunto, { iso, catalogos: INTERPRETACAO })
      expect(texto.length, `${iso} ${assunto.tipo}`).toBeLessThan(700)
    }
  })

  it('não usa travessão', () => {
    for (const { iso, assunto } of correr('2026-08-12', 45)) {
      const p = pecaDoAssunto(assunto, { iso, catalogos: INTERPRETACAO })
      expect(`${p.titulo} ${p.texto}`, `${iso} ${assunto.tipo}`).not.toContain('—')
    }
  })

  /** A Lua fora de curso está ENTRE dois signos: não cai em casa nenhuma. */
  it('só quem acontece num signo leva as doze casas', () => {
    for (const { iso, assunto } of correr('2026-08-12', 45)) {
      const p = pecaDoAssunto(assunto, { iso, catalogos: INTERPRETACAO })
      if (['lua_fora_de_curso', 'conceito', 'aspecto', 'planeta_no_signo'].includes(assunto.tipo)) {
        expect(p.casas, `${iso} ${assunto.tipo}`).toBe(false)
      }
    }
  })

  it('o conceito não leva glifo de signo', () => {
    const p = pecaDoAssunto({ tipo: 'conceito', ...conceitoDoDia('2026-08-15') }, { iso: '2026-08-15' })
    expect(p.glifo).toBe(false)
  })

  it('um tipo desconhecido quebra em vez de sair torto', () => {
    expect(() => pecaDoAssunto({ tipo: 'inventado' }, { iso: '2026-08-15' })).toThrow(/sem tratamento/)
  })
})

describe('os textos novos', () => {
  it('a lua fora de curso tem os doze signos', () => {
    expect(Object.keys(LUA_VAZIA_POR_SIGNO)).toHaveLength(12)
    for (const [signo, t] of Object.entries(LUA_VAZIA_POR_SIGNO)) {
      expect(t.length, signo).toBeGreaterThan(200)
      expect(t, signo).not.toContain('—')
    }
  })

  it('os conceitos não falam do método nem se defendem', () => {
    const defesa = /não é chute|de verdade mesmo|ciência|acredit|funciona mesmo/i
    for (const [chave, c] of Object.entries(CONCEITO)) {
      expect(`${chave}: ${c.texto}`).not.toMatch(defesa)
      expect(c.texto, chave).not.toContain('—')
      expect(c.titulo, chave).toContain('\n')
    }
  })

  it('o conceito do dia é determinístico e evita o que saiu na janela', () => {
    expect(conceitoDoDia('2026-08-15').chave).toBe(conceitoDoDia('2026-08-15').chave)
    const primeiro = conceitoDoDia('2026-08-15').chave
    const segundo = conceitoDoDia('2026-08-15', new Set([`conceito:${primeiro}`])).chave
    expect(segundo).not.toBe(primeiro)
  })
})
