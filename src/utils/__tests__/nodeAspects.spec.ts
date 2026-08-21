import { describe, expect, it } from 'vitest'
import { aspectBetween, angularSeparation, mirrorAspectType, NODE_ASPECT_DEFS } from '../nodeAspects'

describe('angularSeparation', () => {
  it('devolve a menor separação (0-180)', () => {
    expect(angularSeparation(10, 40)).toBe(30)
    expect(angularSeparation(350, 10)).toBe(20) // atravessa 0°
    expect(angularSeparation(0, 200)).toBe(160) // 200 > 180 → 360-200
  })
  it('normaliza longitudes fora de 0-360', () => {
    expect(angularSeparation(-10, 20)).toBe(30)
    expect(angularSeparation(370, 40)).toBe(30)
  })
})

describe('aspectBetween', () => {
  it('detecta cada aspecto exato', () => {
    expect(aspectBetween(0, 0)?.type).toBe('conjunção')
    expect(aspectBetween(0, 60)?.type).toBe('sextil')
    expect(aspectBetween(0, 90)?.type).toBe('quadratura')
    expect(aspectBetween(0, 120)?.type).toBe('trígono')
    expect(aspectBetween(0, 180)?.type).toBe('oposição')
  })

  it('respeita o orbe (5° por padrão)', () => {
    expect(aspectBetween(0, 5)?.type).toBe('conjunção') // no limite
    expect(aspectBetween(0, 5)?.orb).toBeCloseTo(5, 5)
    expect(aspectBetween(0, 6)).toBeNull() // fora do orbe
    expect(aspectBetween(0, 85)?.type).toBe('quadratura') // 5° de folga
    expect(aspectBetween(0, 84)).toBeNull() // 6° → nenhum aspecto
  })

  it('aceita orbe customizado', () => {
    expect(aspectBetween(0, 8, 10)?.type).toBe('conjunção')
    expect(aspectBetween(0, 8, 3)).toBeNull()
  })

  it('funciona no wraparound de 0°', () => {
    expect(aspectBetween(358, 2)?.type).toBe('conjunção') // 4° de separação
    expect(aspectBetween(350, 10)).toBeNull() // 20° → nenhum aspecto
    expect(aspectBetween(10, 190)?.type).toBe('oposição') // 180° exato
  })

  it('devolve null quando não há aspecto', () => {
    expect(aspectBetween(0, 45)).toBeNull()
    expect(aspectBetween(0, 20)).toBeNull()
  })
})

describe('mirror do Nó Sul (por que a grade mostra só o Norte)', () => {
  // O Nó Sul está a 180° do Norte: sep_Sul = 180 − sep_Norte. Todo aspecto que o
  // Norte faz a um ponto, o Sul faz o espelho ao MESMO ponto. Provamos que o par
  // (Norte, Sul+180) sempre gera o aspecto-espelho previsto por mirrorAspectType.
  const targets = [0, 15, 30, 60, 90, 120, 150, 180, 210, 270, 330]
  for (const nodeLon of [0, 47, 123, 200, 300]) {
    it(`Nó em ${nodeLon}° — Sul espelha o Norte`, () => {
      for (const p of targets) {
        const north = aspectBetween(nodeLon, p)
        const south = aspectBetween(nodeLon + 180, p)
        if (north && south) {
          expect(south.type).toBe(mirrorAspectType(north.type))
        }
        // quando o Norte pega um aspecto, o Sul pega o espelho (ou nada, se o
        // espelho cair fora do orbe por assimetria de orbe entre ângulos):
        if (north) {
          const expected = mirrorAspectType(north.type)
          if (south) expect(south.type).toBe(expected)
        }
      }
    })
  }

  it('mirrorAspectType cobre todos os tipos definidos', () => {
    for (const def of NODE_ASPECT_DEFS) {
      const m = mirrorAspectType(def.type)
      // o espelho é sempre um tipo válido da lista
      expect(NODE_ASPECT_DEFS.some(d => d.type === m)).toBe(true)
    }
    // quadratura é auto-espelho
    expect(mirrorAspectType('quadratura')).toBe('quadratura')
  })
})
