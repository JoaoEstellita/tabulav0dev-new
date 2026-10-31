import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import {
  statusNatal, planetasDaArea, condicaoDoPlaneta, pesoDoOrbeNatal, regentesDasCasas,
  AREAS_NATAIS, CHAVES_NATAIS, CALC_NATAL,
} from '../statusNatal'

/**
 * O STATUS NATAL — e a paridade do gêmeo.
 *
 * ⚠️ O app calcula por conta própria porque precisa: na aba Grupos o mapa do
 * membro é montado LOCALMENTE e nunca passou pelo status dele. Sem isto, o
 * status natal existiria só para o dono da conta.
 *
 * ⚠️ O QUE NÃO PODE DIVERGIR é o MARCADOR. Ele é o mesmo do status do dia, e é
 * isso que faz as duas pontuações caírem na mesma escala pela mesma curva —
 * medido em 424 pares: o natal fica acima do dia em 56% deles, diferença
 * mediana de 5 pontos. Se os cinco números saírem de sincronia com o backend,
 * as duas deixam de ser comparáveis sem nada acusar.
 */

const BACKEND = join(__dirname, '..', '..', '..', '..', 'backend')

describe('status natal', () => {
  it('as oito áreas, com as mesmas casas do motor', () => {
    expect(CHAVES_NATAIS.length).toBe(8)
    expect(AREAS_NATAIS.amor.houses).toEqual([5, 7])
    expect(AREAS_NATAIS.carreira.houses).toEqual([10, 6])
    for (const k of CHAVES_NATAIS) {
      expect(AREAS_NATAIS[k].houses.length, `${k} sem casas`).toBeGreaterThan(0)
      expect(AREAS_NATAIS[k].planets.length, `${k} sem significadores`).toBeGreaterThan(0)
    }
  })

  /**
   * ⚠️ A TRÍADE é o que define o status natal: ocupação (quem mora na casa),
   * regência (quem rege a casa) e significador (quem rege o tema). Perder um
   * dos três não dá erro — dá um número mais pobre, calado.
   */
  it('os três papéis entram', () => {
    const papeis = planetasDaArea(
      'amor',
      [{ name: 'Jupiter', house: 7 }],
      { 5: 'Sun', 7: 'Moon' },
    )
    const porPapel = papeis.reduce<Record<string, string[]>>((a, p) => {
      (a[p.papel] = a[p.papel] || []).push(p.planeta); return a
    }, {})
    expect(porPapel.ocupacao, 'quem mora na casa').toContain('Jupiter')
    expect(porPapel.regencia, 'quem rege a casa').toContain('Moon')
    expect(porPapel.significador, 'quem rege o tema').toEqual(expect.arrayContaining(['Venus', 'Mars']))
  })

  /**
   * ⚠️ UM PLANETA PODE CONTAR DUAS VEZES, de propósito: Vênus na própria Casa 7
   * responde pelo amor como significador E como ocupante. Achatar apagaria a
   * ênfase que o mapa está mostrando.
   */
  it('um planeta em dois papéis conta nos dois', () => {
    const papeis = planetasDaArea('amor', [{ name: 'Venus', house: 7 }], {})
    expect(papeis.filter((p) => p.planeta === 'Venus').length).toBeGreaterThanOrEqual(2)
  })

  it('aspecto duro pressiona e macio apoia', () => {
    const duro = condicaoDoPlaneta('Venus', [{ planet1: 'Venus', planet2: 'Saturn', type: 'quadratura', orb: 1 }])
    expect(duro.pressure).toBeGreaterThan(0)
    expect(duro.support).toBe(0)
    const macio = condicaoDoPlaneta('Venus', [{ planet1: 'Venus', planet2: 'Jupiter', type: 'trigono', orb: 1 }])
    expect(macio.support).toBeGreaterThan(0)
    expect(macio.pressure).toBe(0)
  })

  /**
   * ⚠️ NA CONJUNÇÃO QUEM DECIDE É QUEM CHEGA — mesma regra do cálculo das
   * emoções. Vênus conjunto a Saturno pesa; conjunto a Júpiter, não. Divergir
   * faria o mesmo aspecto pesar de um jeito nos anéis e de outro nas áreas, no
   * mesmo mapa.
   */
  it('a conjunção pega a natureza do outro planeta', () => {
    const comSaturno = condicaoDoPlaneta('Venus', [{ planet1: 'Venus', planet2: 'Saturn', type: 'conjuncao', orb: 1 }])
    expect(comSaturno.pressure, 'Vênus conjunto a Saturno deveria pesar').toBeGreaterThan(0)
    const comJupiter = condicaoDoPlaneta('Venus', [{ planet1: 'Venus', planet2: 'Jupiter', type: 'conjuncao', orb: 1 }])
    expect(comJupiter.support, 'Vênus conjunto a Júpiter deveria apoiar').toBeGreaterThan(0)
  })

  it('orbe mais exata pesa mais, e orbe ausente não vira exata', () => {
    expect(pesoDoOrbeNatal(0.5)).toBe(1)
    expect(pesoDoOrbeNatal(4)).toBeLessThan(1)
    expect(pesoDoOrbeNatal(9)).toBe(0.25)
    // ⚠️ `Number(null)` é 0 e 0 passa no isFinite — a mordida de sempre. Orbe
    // ausente tem de cair no caso "razoável", não no "exato".
    expect(pesoDoOrbeNatal(undefined), 'orbe ausente não pode valer como exata').toBeLessThan(1)
    expect(pesoDoOrbeNatal('abc')).toBeLessThan(1)
  })

  it('sem aspectos devolve null, não oito percentuais', () => {
    expect(statusNatal({ planetasNatais: [{ name: 'Sun', house: 1 }], aspectosNatais: [] })).toBeNull()
    expect(statusNatal({ aspectosNatais: null })).toBeNull()
    expect(statusNatal({})).toBeNull()
  })

  it('o número vem com a explicação', () => {
    const r = statusNatal({
      planetasNatais: [{ name: 'Venus', house: 7 }],
      aspectosNatais: [{ planet1: 'Venus', planet2: 'Saturn', type: 'quadratura', orb: 1 }],
      regentes: { 5: 'Sun', 7: 'Venus' },
    })!
    expect(r.amor, 'amor deveria pontuar').toBeTruthy()
    expect(r.amor.porque.length, 'número sem explicação').toBeGreaterThan(0)
    expect(r.amor.percentage).toBeGreaterThanOrEqual(0)
    expect(r.amor.percentage).toBeLessThanOrEqual(100)
  })

  /**
   * ⚠️ AS CASAS TÊM DE SER AS MESMAS DO MOTOR. `AREAS_NATAIS` é cópia
   * deliberada de `LIFE_AREAS` (o original não é exportado). Se as casas de uma
   * área mudarem lá e não aqui, o status natal e o do dia passam a falar de
   * casas diferentes sob o MESMO nome — e os dois números continuam entre 0 e
   * 100, sem nada acusar.
   */
  it('as casas e os significadores batem com o motor', () => {
    const P = join(BACKEND, 'lib', 'status', 'status-engine.js')
    if (!existsSync(P)) {
      console.warn(`[status natal] backend ausente em ${P} — paridade das áreas NÃO verificada`)
      return
    }
    const fonte = readFileSync(P, 'utf8')
    const bloco = fonte.match(/const LIFE_AREAS = \{([\s\S]*?)\n\};/)
    expect(bloco, 'LIFE_AREAS sumiu do motor').not.toBeNull()
    const divergencias: string[] = []
    for (const k of CHAVES_NATAIS) {
      const linha = bloco![1].match(new RegExp(`${k}: \\{ houses: \\[([^\\]]*)\\], planets: \\[([^\\]]*)\\]`))
      if (!linha) { divergencias.push(`${k}: não existe no motor`); continue }
      const casas = linha[1].split(',').map((x) => Number(x.trim()))
      const planetas = linha[2].split(',').map((x) => x.trim().replace(/['"]/g, ''))
      if (JSON.stringify(casas) !== JSON.stringify(AREAS_NATAIS[k].houses)) {
        divergencias.push(`${k}: casas ${JSON.stringify(AREAS_NATAIS[k].houses)} ≠ motor ${JSON.stringify(casas)}`)
      }
      if (JSON.stringify(planetas) !== JSON.stringify(AREAS_NATAIS[k].planets)) {
        divergencias.push(`${k}: significadores ${JSON.stringify(AREAS_NATAIS[k].planets)} ≠ motor ${JSON.stringify(planetas)}`)
      }
    }
    expect(divergencias, divergencias.join(' · ')).toEqual([])
  })

  /**
   * ⚠️ A REGÊNCIA É A PERNA QUE JÁ SUMIU UMA VEZ. O backend devolve ARRAY por
   * casa (modo híbrido: Escorpião = ['Mars','Pluto']) e a primeira versão
   * esperava string — descartava o array em silêncio, e a medição inicial foi
   * feita sem a regência sem ninguém notar.
   */
  it('o regente chega como array e entra assim mesmo', () => {
    const comArray = planetasDaArea('amor', [], { 5: ['Sun'], 7: ['Venus', 'Pluto'] })
    const regentes = comArray.filter((p) => p.papel === 'regencia').map((p) => p.planeta)
    expect(regentes, 'array de regentes foi descartado').toEqual(['Sun', 'Venus'])
    // String e objeto também, para quem passar de outro jeito.
    expect(planetasDaArea('amor', [], { 7: 'Venus' }).some((p) => p.papel === 'regencia')).toBe(true)
  })

  it('os regentes saem das cúspides quando não vierem prontos', () => {
    // Cúspides em 0°, 30°, 60°… → Áries, Touro, Gêmeos…
    const cusps = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330]
    const r = regentesDasCasas(cusps)!
    expect(r, 'cúspides deveriam dar regentes').toBeTruthy()
    expect(r[1], 'casa 1 em Áries').toBe('Mars')
    expect(r[5], 'casa 5 em Leão').toBe('Sun')
    expect(r[8], 'casa 8 em Escorpião → tradicional').toBe('Mars')
    // Sem as doze, nada — inventar o regente daria um número com cara de certo.
    expect(regentesDasCasas([0, 30, 60])).toBeNull()
    expect(regentesDasCasas(null)).toBeNull()
  })

  it('o marcador é o mesmo do status do dia', () => {
    const P = join(BACKEND, 'lib', 'status', 'status-policy.js')
    if (!existsSync(P)) {
      console.warn(`[status natal] backend ausente em ${P} — paridade do marcador NÃO verificada`)
      return
    }
    const fonte = readFileSync(P, 'utf8')
    const num = (nome: string) => {
      const m = fonte.match(new RegExp(`${nome}:\\s*([\\d.e-]+)`))
      return m ? Number(m[1]) : null
    }
    for (const chave of ['beta', 'gamma', 'conflictC'] as const) {
      expect(num(chave), `${chave} divergiu do marcador do dia`).toBe((CALC_NATAL as any)[chave])
    }
  })

  /**
   * ⚠️ A TRAVA FORTE: os VALORES. Constantes iguais não garantem algoritmo
   * igual — um papel a menos, um alias de aspecto faltando, e os números
   * divergem em silêncio.
   */
  it('os números batem com o backend, mapa por mapa', () => {
    const ESPERADO = join(BACKEND, 'tests', 'fixtures', 'status-natal-esperado.json')
    if (!existsSync(ESPERADO)) {
      console.warn(`[status natal] esperado ausente em ${ESPERADO} — paridade de VALORES não verificada`)
      return
    }
    const esperado = JSON.parse(readFileSync(ESPERADO, 'utf8'))
    const divergencias: string[] = []
    for (const m of esperado.mapas as Array<{ id: string; planetas: any[]; aspectos: any[]; regentes: any }>) {
      const r = statusNatal({ planetasNatais: m.planetas, aspectosNatais: m.aspectos, regentes: m.regentes })
      const esp = esperado.valores[m.id]
      if (esp === null || esp === undefined) {
        if (r !== null) divergencias.push(`${m.id}: app calculou, backend devolveu null`)
        continue
      }
      if (!r) { divergencias.push(`${m.id}: app devolveu null, backend calculou`); continue }
      for (const k of Object.keys(esp)) {
        const got = r[k]?.percentage
        if (got !== esp[k]) divergencias.push(`${m.id}.${k}: app ${got} ≠ backend ${esp[k]}`)
      }
      for (const k of Object.keys(r)) {
        if (!(k in esp)) divergencias.push(`${m.id}.${k}: o app pontuou uma área que o backend não pontuou`)
      }
    }
    expect(divergencias, divergencias.join(' · ')).toEqual([])
  })
})
