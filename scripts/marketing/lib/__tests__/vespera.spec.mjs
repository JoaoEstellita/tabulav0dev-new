import { describe, expect, it } from 'vitest'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { lerLiterais } from '../catalogo.mjs'
import { opcoesDoDia } from '../pautas.mjs'
import { escrever, corpoDeVespera } from '../vozes.mjs'

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
 * O defeito que o João viu na tela antes de qualquer post sair.
 *
 * A editorial oferecia o eclipse de 12/08 em quatro dias — "Faltam 3 dias",
 * "Faltam 2 dias", "Amanhã", e o dia. Medido, os quatro saíam com título, dado
 * e CORPO idênticos: 9 das 12 linhas da legenda se repetiam e só o prefixo
 * mudava. Marcar os quatro era publicar a mesma peça quatro vezes.
 */
describe('o mesmo evento em dias diferentes', () => {
  const DIAS = ['2026-08-09', '2026-08-10', '2026-08-11', '2026-08-12']

  const eclipseDe = (dia) => {
    const o = opcoesDoDia(meioDia(dia), DEPS).find((x) => x.tipo === 'eclipse')
    return o ? escrever(o.evento) : null
  }

  it('os quatro dias de véspera de um eclipse trazem corpos distintos', () => {
    const textos = DIAS.map(eclipseDe).filter(Boolean).map((v) => v.texto)
    expect(textos.length, 'o eclipse precisa aparecer nos quatro dias').toBe(4)
    expect(new Set(textos).size, textos.join('\n---\n')).toBe(4)
  })

  // O dado é o mesmo de propósito: é o mesmo evento, e mentir sobre a hora para
  // parecer novidade seria o oposto do que a conta defende.
  it('o dado NÃO muda — é o mesmo eclipse', () => {
    const dados = DIAS.map(eclipseDe).filter(Boolean).map((v) => v.dado)
    expect(new Set(dados).size).toBe(1)
  })

  it('só a véspera fala em "amanhã", e só ela traz a hora', () => {
    const amanha = eclipseDe('2026-08-11').texto
    expect(amanha).toMatch(/^Amanhã, às \d{2}:\d{2}/)
    for (const dia of ['2026-08-09', '2026-08-10']) {
      expect(eclipseDe(dia).texto, dia).not.toContain('Amanhã')
    }
  })
})

describe('as quatro faixas', () => {
  const eclipse = {
    tipo: 'eclipse', luminar: 'solar', especie: 'total', signo: 'Leão', grau: 20,
    quando: new Date('2026-08-12T17:45:00Z'), visivelBR: false,
  }

  it('cada distância produz um texto próprio', () => {
    const faixas = [3, 2, 1].map((d) => corpoDeVespera({ ...eclipse, vespera: true, diasFalta: d }))
    expect(new Set(faixas).size).toBe(3)
    for (const f of faixas) expect(f.length).toBeGreaterThan(80)
  })

  it('no dia do evento não há variante: vale o texto de sempre', () => {
    expect(corpoDeVespera({ ...eclipse, vespera: false, diasFalta: 0 })).toBe('')
  })

  it('tipo sem variante devolve vazio em vez de inventar', () => {
    expect(corpoDeVespera({ tipo: 'lua_fora_de_curso', vespera: true, diasFalta: 2 })).toBe('')
    expect(corpoDeVespera(null)).toBe('')
  })

  // Régua 4 da casa: sem misticismo e sem promessa. Um texto de véspera é onde
  // esse vício entra com mais facilidade — é o espaço da expectativa.
  it('nenhuma faixa promete nem manda fazer nada', () => {
    const proibido = /prepare|energia|poderos|aproveite|não perca|transforme sua/i
    for (const dia of ['2026-08-09', '2026-08-10', '2026-08-11']) {
      for (const o of opcoesDoDia(meioDia(dia), DEPS)) {
        if (!o.evento?.vespera) continue
        expect(escrever(o.evento).texto, `${dia} — ${o.titulo}`).not.toMatch(proibido)
      }
    }
  })

  /**
   * O card mostra DUAS frases — `primeirasFrases(texto, 2)` em gerarCard.mjs,
   * porque o espaço é fixo e o texto inteiro empurra o rodapé para fora.
   *
   * As primeiras variantes tinham três: a terceira sobrevivia na legenda e
   * sumia da imagem, e era justamente a conclusão ("por isso eclipse vem em
   * temporada"). Quem vê o card no feed sem abrir a legenda perdia o melhor.
   */
  it('toda variante cabe em duas frases, que é o que o card mostra', () => {
    const emDuasFrases = (t) => (t.match(/[^.!?]+[.!?]+/g) || [t]).length <= 2
    for (const dia of ['2026-08-09', '2026-08-10', '2026-08-11', '2026-08-30', '2026-09-08']) {
      for (const o of opcoesDoDia(meioDia(dia), DEPS)) {
        if (!o.evento?.vespera) continue
        const texto = escrever(o.evento).texto
        expect(emDuasFrases(texto), `${dia} — ${o.titulo}: ${texto}`).toBe(true)
      }
    }
  })

  // A véspera do ingresso é a única que fala de casa, e é a régua 5: o céu é de
  // todos, a casa é de cada um.
  it('a véspera de um ingresso separa o que muda do que não muda', () => {
    const ingresso = {
      tipo: 'ingresso', corpo: 'Mars', corpoPt: 'Marte', signo: 'Câncer',
      signoAnterior: 'Gêmeos', quando: new Date('2026-08-11T11:23:00Z'),
      vespera: true, diasFalta: 1,
    }
    const texto = corpoDeVespera(ingresso)
    // sem âncora de maiúscula: a frase pode estar no meio do período
    expect(texto).toMatch(/o que muda/i)
    expect(texto).toMatch(/o que não muda/i)
    expect(texto).toContain('casa')
  })
})
