import { describe, expect, it } from 'vitest'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { lerLiterais } from '../catalogo.mjs'
import { mapaDoCeu, SIGNOS_INFO } from '../ceu.mjs'
import { temaEducativo, linhaDeHonestidade, paragrafoDeHonestidade } from '../educativo.mjs'
import { montarLegendaEducativa, perguntaDeEnquete } from '../vozes.mjs'

// __tests__ → lib → marketing → scripts → frontend
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

const CATALOGOS = {
  planetaNoSigno: ps.PLANET_IN_SIGN_PTBR_OVERRIDES,
  aspectoNatal: an.NATAL_PLANET_ASPECT_PTBR_OVERRIDES,
}
const ORBES = orbes.PLANET_ASPECT_ORBS

const meioDia = (dia) => new Date(`${dia}T12:00:00Z`)
const ceuDe = (dia) => mapaDoCeu(meioDia(dia), ORBES)

/**
 * A peça dos dias sem notícia.
 *
 * Em 60 dias a partir de 06/08/2026, treze não têm evento forte, e vêm em
 * blocos de três e quatro seguidos. Antes disso, o card repetia — 13, 14 e 15
 * de agosto saíam com a MESMA janela de Lua fora de curso, título e texto
 * idênticos. Estes testes existem para que o assunto continue mudando quando
 * ninguém mais lembrar o motivo.
 */
describe('tema educativo', () => {
  it('escolhe planeta em signo antes de aspecto: "Vênus em Libra" lê melhor que jargão', () => {
    const tema = temaEducativo(ceuDe('2026-08-13'), CATALOGOS)
    expect(tema.tipo).toBe('planeta_no_signo')
  })

  // A âncora é o que separa isto de sorteio: o assunto sai do céu de hoje.
  it('o planeta do texto está MESMO no signo do texto naquele dia', () => {
    for (const dia of ['2026-08-13', '2026-08-16', '2026-08-29', '2026-09-12']) {
      const mapa = ceuDe(dia)
      const tema = temaEducativo(mapa, CATALOGOS)
      if (tema.tipo !== 'planeta_no_signo') continue
      const corpo = mapa.corpos.find((c) => c.nome === tema.corpo)
      expect(corpo.signo, `${dia} — ${tema.titulo}`).toBe(tema.signo)
    }
  })

  // Plutão sextil Netuno fica de pé por anos: descreve todo mundo nascido numa
  // década, e apresentar isso como leitura de mapa é o vício do signo solar.
  it('nunca escolhe aspecto entre dois corpos lentos', () => {
    const lentos = ['Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto']
    const usadas = new Set()
    for (let d = 0; d < 30; d++) {
      const data = new Date(Date.UTC(2026, 7, 13) + d * 86_400_000)
      const tema = temaEducativo(mapaDoCeu(data, ORBES), CATALOGOS, usadas)
      if (!tema) continue
      usadas.add(tema.chave)
      if (tema.tipo !== 'aspecto_natal') continue
      const [, corpos] = tema.chave.split(':')
      const [p1, , p2] = corpos.split('|')
      const doisLentos =
        lentos.some((l) => l.toLowerCase() === p1) && lentos.some((l) => l.toLowerCase() === p2)
      expect(doisLentos, tema.titulo).toBe(false)
    }
  })

  it('não repete assunto em catorze dias seguidos — o pior caso', () => {
    const usadas = new Set()
    const vistos = []
    for (let d = 0; d < 14; d++) {
      const data = new Date(Date.UTC(2026, 7, 13) + d * 86_400_000)
      const tema = temaEducativo(mapaDoCeu(data, ORBES), CATALOGOS, usadas)
      expect(tema, `dia ${d}`).not.toBeNull()
      expect(tema.repetido, `dia ${d} — ${tema.titulo}`).toBe(false)
      usadas.add(tema.chave)
      vistos.push(tema.chave)
    }
    expect(new Set(vistos).size).toBe(14)
  })

  it('o pool se renova quando um planeta muda de signo', () => {
    // o Sol entra em Virgem em 23/08; no dia seguinte "Sol em Virgem" é assunto
    // inédito mesmo com "Sol em Leão" já gasto
    const mapa = ceuDe('2026-08-24')
    const tema = temaEducativo(mapa, CATALOGOS, new Set(['natal:sun_in_leo']))
    const sol = mapa.corpos.find((c) => c.nome === 'Sun')
    expect(sol.signo).toBe('Virgem')
    expect(CATALOGOS.planetaNoSigno['natal:sun_in_virgo']).toBeTruthy()
  })

  it('todo signo do catálogo existe em português na tabela do céu', () => {
    const nomes = new Set(SIGNOS_INFO.map((s) => s.nome))
    const usadas = new Set()
    for (let d = 0; d < 20; d++) {
      const data = new Date(Date.UTC(2026, 7, 13) + d * 86_400_000)
      const tema = temaEducativo(mapaDoCeu(data, ORBES), CATALOGOS, usadas)
      if (!tema) continue
      usadas.add(tema.chave)
      if (tema.signo) expect(nomes.has(tema.signo), tema.signo).toBe(true)
    }
  })
})

/**
 * A moldura que impede a peça de virar horóscopo.
 *
 * Sem ela, um texto sobre valores relacionais debaixo de "Vênus em Libra" lê
 * como previsão do dia — exatamente o que a conta existe para contradizer.
 */
describe('moldura de honestidade', () => {
  it('a linha curta do card sempre diz NASCEU', () => {
    for (const dia of ['2026-08-13', '2026-08-16', '2026-08-30']) {
      const tema = temaEducativo(ceuDe(dia), CATALOGOS)
      expect(linhaDeHonestidade(tema)).toContain('NASCEU')
    }
  })

  it('o parágrafo da legenda separa passar de ter nascido', () => {
    const tema = temaEducativo(ceuDe('2026-08-13'), CATALOGOS)
    const p = paragrafoDeHonestidade(tema)
    expect(p).toContain('NASCEU')
    expect(p.toLowerCase()).toContain('diferentes')
  })

  it('a legenda educativa carrega o aviso, o texto e a âncora', () => {
    const tema = temaEducativo(ceuDe('2026-08-13'), CATALOGOS)
    const legenda = montarLegendaEducativa(tema, paragrafoDeHonestidade(tema), meioDia('2026-08-13'))
    expect(legenda).toContain(tema.texto)
    expect(legenda).toContain(tema.ancora)
    expect(legenda).toContain('NASCEU')
    // o convite gira entre cinco formulações, e nem todas trazem "link" em
    // minúscula — o que não pode faltar é o destino
    expect(legenda.toLowerCase()).toContain('link na bio')
  })

  // "Hoje Sol apenas passa por ali" é o tipo de erro que denuncia texto gerado.
  it('Sol e Lua vêm com artigo', () => {
    const tema = temaEducativo(ceuDe('2026-08-16'), CATALOGOS, new Set())
    if (tema.corpoPt !== 'Sol' && tema.corpoPt !== 'Lua') return
    expect(tema.ancora).toMatch(/^(O Sol|A Lua)/)
  })
})

describe('legenda', () => {
  // Regerar um dia já publicado precisa devolver a mesma legenda: é a mesma
  // regra do campo estelar e do card.
  it('a variação é determinística pela data', () => {
    const tema = temaEducativo(ceuDe('2026-08-13'), CATALOGOS)
    const a = montarLegendaEducativa(tema, 'aviso', meioDia('2026-08-13'))
    const b = montarLegendaEducativa(tema, 'aviso', meioDia('2026-08-13'))
    expect(a).toBe(b)
  })

  it('dias diferentes não terminam sempre igual', () => {
    const tema = temaEducativo(ceuDe('2026-08-13'), CATALOGOS)
    const fechos = new Set()
    for (let d = 0; d < 12; d++) {
      const data = new Date(Date.UTC(2026, 7, 13) + d * 86_400_000)
      fechos.add(montarLegendaEducativa(tema, 'aviso', data).split('\n').slice(-5).join('|'))
    }
    expect(fechos.size).toBeGreaterThan(1)
  })
})

describe('enquete do story', () => {
  it('o card educativo pergunta pelo mapa de quem lê', () => {
    const tema = temaEducativo(ceuDe('2026-08-13'), CATALOGOS)
    const q = perguntaDeEnquete(null, tema)
    expect(q.pergunta).toContain(tema.corpoPt)
    expect(q.opcoes).toHaveLength(2)
  })

  it('cada tipo de evento tem pergunta e duas opções', () => {
    const casos = [
      { tipo: 'eclipse' },
      { tipo: 'ingresso', corpoPt: 'Vênus' },
      { tipo: 'fase' },
      { tipo: 'retrogrado', corpoPt: 'Mercúrio' },
      { tipo: 'lua_fora_de_curso' },
      { tipo: 'aspecto' },
    ]
    for (const ev of casos) {
      const q = perguntaDeEnquete(ev)
      expect(q.pergunta.length, ev.tipo).toBeGreaterThan(10)
      expect(q.opcoes, ev.tipo).toHaveLength(2)
    }
  })
})
