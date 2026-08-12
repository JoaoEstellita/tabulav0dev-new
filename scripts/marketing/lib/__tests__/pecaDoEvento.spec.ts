/**
 * A peça do evento: qual evento ela escolhe e de onde vem o texto.
 *
 * O cron do dia 11 subiu ao Estúdio o post do eclipse do dia 12, e no dia 12
 * subiria o mesmo post outra vez. O João viu as duas coisas de uma vez: "foi
 * criado pro dia 12 hoje no dia 11" e "também não quero repetir os posts".
 *
 * A causa era um default: `eventosDoDia` antecipa três dias, e a peça pegava o
 * primeiro da lista sem olhar se era de hoje.
 */
import { describe, it, expect } from 'vitest'
// @ts-expect-error - módulos .mjs sem tipos
import { eventosDoDia } from '../eventos.mjs'
// @ts-expect-error - módulos .mjs sem tipos
import { textoDoEvento, chaveDoEvento } from '../textosEvento.mjs'
// @ts-expect-error - módulos .mjs sem tipos
import { POR_SIGNO, POR_CASA } from '../textosEclipse.mjs'
// @ts-expect-error - módulos .mjs sem tipos
import { casasPorAscendente } from '../fatos.mjs'

/** O eclipse solar de 12/08/2026, em Leão. */
const ECLIPSE = new Date('2026-08-12T12:00:00Z')
const VESPERA = new Date('2026-08-11T12:00:00Z')

describe('qual evento vira peça', () => {
  it('na véspera, o evento de amanhã não entra', () => {
    const hoje = eventosDoDia(VESPERA, [], { antecedencia: 0 })
    expect(hoje.every((e: any) => e.diasFalta === 0)).toBe(true)
    expect(hoje.some((e: any) => e.tipo === 'eclipse')).toBe(false)
  })

  it('sem o filtro, o eclipse de amanhã encabeçaria a peça de hoje', () => {
    // o bug, preservado: é este default que mandou a peça um dia adiantada
    const comAntecipacao = eventosDoDia(VESPERA, [])
    expect(comAntecipacao[0].tipo).toBe('eclipse')
    expect(comAntecipacao[0].diasFalta).toBe(1)
  })

  it('no dia do eclipse, ele é o assunto', () => {
    const hoje = eventosDoDia(ECLIPSE, [], { antecedencia: 0 })
    expect(hoje[0].tipo).toBe('eclipse')
    expect(hoje[0].signo).toBe('Leão')
    expect(hoje[0].diasFalta).toBe(0)
  })

  /** Um evento, um dia: é isso que impede a peça repetida. */
  it('o eclipse aparece em um dia só', () => {
    const dias = ['2026-08-10', '2026-08-11', '2026-08-12', '2026-08-13']
    const comEclipse = dias.filter((d) =>
      eventosDoDia(new Date(`${d}T12:00:00Z`), [], { antecedencia: 0 })
        .some((e: any) => e.tipo === 'eclipse'))
    expect(comEclipse).toEqual(['2026-08-12'])
  })
})

describe('o texto do eclipse', () => {
  const eclipse = { tipo: 'eclipse', luminar: 'solar', signo: 'Leão' }

  it('vem de textosEclipse, não do catálogo natal', () => {
    expect(textoDoEvento(eclipse)).toBe(POR_SIGNO['Leão'])
    // a frase que saiu na peça errada: é o Sol NATAL em Leão, não o eclipse
    expect(textoDoEvento(eclipse)).not.toContain('A identidade se manifesta')
  })

  it('tem chave para o aviso do console', () => {
    expect(chaveDoEvento(eclipse)).toBe('eclipse:solar:Leão')
  })

  it('cobre os doze signos', () => {
    for (const signo of Object.keys(POR_CASA).map(Number)) {
      expect(POR_CASA[signo].length).toBeGreaterThan(150)
    }
    expect(Object.keys(POR_SIGNO)).toHaveLength(12)
  })
})

describe('o carrossel do eclipse', () => {
  it('dá uma casa diferente a cada ascendente', () => {
    const casas = casasPorAscendente('Leão')
    expect(casas).toHaveLength(12)
    expect(new Set(casas.map((c: any) => c.casa)).size).toBe(12)
    // Leão é o quinto signo a partir de Áries
    expect(casas.find((c: any) => c.ascendente === 'Áries').casa).toBe(5)
    expect(casas.find((c: any) => c.ascendente === 'Leão').casa).toBe(1)
  })

  it('cada casa tem texto próprio de eclipse', () => {
    const textos = casasPorAscendente('Leão').map((c: any) => POR_CASA[c.casa])
    expect(textos.every(Boolean)).toBe(true)
    expect(new Set(textos).size).toBe(12)
    for (const t of textos) expect(t).not.toContain('—')
  })
})

/**
 * O DIA EM QUE O ECLIPSE NÃO SAIU.
 *
 * O João abriu o Estúdio no dia do eclipse e achou uma peça de Lua fora de
 * curso. O eclipse tinha peso 130 contra 85 e acontecia naquele dia, e mesmo
 * assim perdeu: a chave `eclipse:solar:2026-08-12` estava no histórico, posta
 * lá pelo card antigo, que publicava o mesmo evento como véspera nos dias 9, 10
 * e 11 gravando sempre a chave do EVENTO. A janela de catorze dias acabou
 * bloqueando o próprio dia do evento.
 */
describe('o histórico não pode queimar o dia do evento', () => {
  const mapaDoDia = async (iso: string) => {
    // @ts-expect-error - módulos .mjs sem tipos
    const { mapaDoCeu } = await import('../ceu.mjs')
    // @ts-expect-error - módulos .mjs sem tipos
    const { lerLiterais } = await import('../catalogo.mjs')
    const { PLANET_ASPECT_ORBS } = await lerLiterais(
      'src/astro/aspect-config.ts', ['PLANET_ASPECT_ORBS'])
    return mapaDoCeu(new Date(`${iso}T12:00:00Z`), PLANET_ASPECT_ORBS)
  }

  it('o eclipse sai no dia dele mesmo já tendo saído como véspera', async () => {
    // @ts-expect-error - módulos .mjs sem tipos
    const { assuntoDoDia, chaveDoAssunto } = await import('../assuntoDoDia.mjs')
    const mapa = await mapaDoDia('2026-08-12')

    const queimado = new Set(['eclipse:solar:2026-08-12'])
    const escolhido = assuntoDoDia(new Date('2026-08-12T12:00:00Z'), {
      mapa, catalogos: {}, iso: '2026-08-12', usadas: queimado,
    })

    expect(chaveDoAssunto(escolhido)).toBe('eclipse:solar:2026-08-12')
  })

  /**
   * A correção acima não pode reabrir o defeito que o dedupe conserta: a lua
   * fora de curso de 42h aparecia em três dias seguidos.
   */
  it('a lua fora de curso continua deduplicada', async () => {
    // @ts-expect-error - módulos .mjs sem tipos
    const { assuntoDoDia, chaveDoAssunto } = await import('../assuntoDoDia.mjs')
    const mapa = await mapaDoDia('2026-08-14')

    const queimada = new Set(['luav:2026-08-13T20:00:00.000Z'])
    const escolhido = assuntoDoDia(new Date('2026-08-14T12:00:00Z'), {
      mapa, catalogos: {}, iso: '2026-08-14', usadas: queimada,
    })

    expect(chaveDoAssunto(escolhido)).not.toBe('luav:2026-08-13T20:00:00.000Z')
  })
})

/** A peça da Lua com o Sol de fundo: "não tem nada a ver". */
describe('o fundo combina com quem protagoniza', () => {
  it('peça da Lua nunca recebe foto do Sol', async () => {
    // @ts-expect-error - módulos .mjs sem tipos
    const { fundoDeCeu } = await import('../templateFoto.mjs')
    const FOGO = ['Áries', 'Leão', 'Sagitário']
    for (const signo of FOGO) {
      for (let v = 0; v < 8; v++) {
        expect(fundoDeCeu(signo, v, 'Moon').arquivo, `${signo} v${v}`).not.toMatch(/^fogo/)
      }
    }
  })

  it('peça do Sol continua podendo usar o Sol', async () => {
    // @ts-expect-error - módulos .mjs sem tipos
    const { fundoDeCeu } = await import('../templateFoto.mjs')
    expect(fundoDeCeu('Leão', 0, 'Sun').arquivo).toMatch(/^fogo/)
  })
})

/**
 * VÁRIAS PEÇAS NO MESMO DIA.
 *
 * "Quero que eu consiga selecionar quais eu quero criar independente de
 * quantidade", "podendo ser mais de um e mais de um carrossel ou post mesmo".
 *
 * O histórico guardava uma chave por dia, então a segunda peça sobrescrevia a
 * entrada da primeira e as duas podiam falar do mesmo assunto.
 */
describe('o histórico separa as peças do mesmo dia', () => {
  it('cada peça tem sua entrada', async () => {
    // @ts-expect-error - módulos .mjs sem tipos
    const { entradaDoDia } = await import('../historico.mjs')
    expect(entradaDoDia('2026-08-13', 1)).toBe('2026-08-13')
    expect(entradaDoDia('2026-08-13', 3)).toBe('2026-08-13#3')
  })

  /** A peça 2 precisa ver o que a peça 1 acabou de publicar. */
  it('a peça 2 enxerga o assunto que a peça 1 usou', async () => {
    // @ts-expect-error - módulos .mjs sem tipos
    const { chavesRecentes } = await import('../historico.mjs')
    const historico = { '2026-08-13': 'luav:x', '2026-08-13#2': 'asp:y' }

    const paraAPeca2 = chavesRecentes(historico, '2026-08-13', 2)
    expect(paraAPeca2.has('luav:x'), 'a peça 1 tem de contar').toBe(true)
    expect(paraAPeca2.has('asp:y'), 'a própria entrada não conta').toBe(false)
  })

  /** Regerar a peça 1 não pode trocar o assunto dela. */
  it('regerar uma peça devolve o mesmo assunto', async () => {
    // @ts-expect-error - módulos .mjs sem tipos
    const { chavesRecentes } = await import('../historico.mjs')
    const historico = { '2026-08-13': 'luav:x', '2026-08-13#2': 'asp:y' }

    const paraAPeca1 = chavesRecentes(historico, '2026-08-13', 1)
    expect(paraAPeca1.has('luav:x')).toBe(false)
    expect(paraAPeca1.has('asp:y')).toBe(true)
  })

  it('a janela de catorze dias continua valendo com sufixo', async () => {
    // @ts-expect-error - módulos .mjs sem tipos
    const { chavesRecentes } = await import('../historico.mjs')
    const historico = {
      '2026-08-01#2': 'antigo',   // 12 dias antes: dentro
      '2026-07-20#3': 'muitoAntigo', // 24 dias antes: fora
    }
    const usadas = chavesRecentes(historico, '2026-08-13', 1)
    expect(usadas.has('antigo')).toBe(true)
    expect(usadas.has('muitoAntigo')).toBe(false)
  })
})
