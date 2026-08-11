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
