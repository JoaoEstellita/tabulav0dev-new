import { describe, it, expect } from 'vitest'
import { computeSynastryAspects } from '../synastry'

// Helper: monta um RealPlanetPosition mínimo (só o que o util lê: name + longitude).
const p = (name: string, longitude: number) => ({ name, longitude } as any)

describe('computeSynastryAspects', () => {
  it('detecta aspectos maiores entre dois mapas (planeta A × planeta B)', () => {
    const mine = [p('Sun', 0), p('Venus', 120)]
    const theirs = [p('Moon', 60), p('Mars', 180)]
    const aspects = computeSynastryAspects(mine, theirs)
    // Sun(0) x Moon(60) = sextil; Sun(0) x Mars(180) = oposicao; Venus(120) x Moon(60) = sextil; Venus(120) x Mars(180) = sextil
    const pairs = aspects.map((a) => `${a.mine}-${a.aspect}-${a.theirs}`)
    expect(pairs).toContain('sun-sextil-moon')
    expect(pairs).toContain('sun-oposicao-mars')
    expect(aspects.every((a) => a.orb <= 6)).toBe(true)
    // tom classificado
    expect(aspects.find((a) => a.aspect === 'sextil')?.tone).toBe('harmonioso')
    expect(aspects.find((a) => a.aspect === 'oposicao')?.tone).toBe('tenso')
  })

  it('descarta contatos externo↔externo (geracionais)', () => {
    const mine = [p('Pluto', 0), p('Neptune', 100)]
    const theirs = [p('Pluto', 60), p('Uranus', 40)]
    // Pluto(0) x Pluto(60) = sextil mas ambos externos → deve ser descartado.
    // Neptune(100) x Uranus(40) = sextil mas ambos externos → descartado.
    const aspects = computeSynastryAspects(mine, theirs)
    expect(aspects.length).toBe(0)
  })

  it('mantém contato pessoal↔externo (ao menos um planeta pessoal)', () => {
    const mine = [p('Venus', 0)]
    const theirs = [p('Pluto', 120)]
    const aspects = computeSynastryAspects(mine, theirs)
    expect(aspects).toHaveLength(1)
    expect(aspects[0].aspect).toBe('trigono')
    expect(aspects[0].mine).toBe('venus')
    expect(aspects[0].theirs).toBe('pluto')
  })

  it('respeita a órbita de 6° (fora da órbita não conta)', () => {
    const mine = [p('Sun', 0)]
    const theirs = [p('Moon', 67)] // 7° de sextil (60) → fora da órbita
    expect(computeSynastryAspects(mine, theirs)).toHaveLength(0)
  })

  it('prioriza pessoal↔pessoal e limita a quantidade', () => {
    const mine = [p('Sun', 0), p('Moon', 90), p('Venus', 120)]
    const theirs = [p('Sun', 0), p('Mars', 90), p('Jupiter', 180)]
    const aspects = computeSynastryAspects(mine, theirs, 2)
    expect(aspects).toHaveLength(2)
    // primeiro resultado tem dois planetas pessoais
    const personal = new Set(['sun', 'moon', 'mercury', 'venus', 'mars'])
    expect(personal.has(aspects[0].mine) && personal.has(aspects[0].theirs)).toBe(true)
  })
})
