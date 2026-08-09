import { describe, it, expect, vi, beforeEach } from 'vitest'
import { progressedDate, computeProgressedAspects, computeProgressedPositions } from '../progressions'
import { computeNatalLongitudes } from '../synastry'

vi.mock('../synastry', () => ({ computeNatalLongitudes: vi.fn(async () => []) }))

const p = (name: string, longitude: number) => ({ name, longitude } as any)

describe('progressedDate — um dia por ano', () => {
  it('37 anos de vida avançam ~37 dias no mapa', () => {
    const nascimento = new Date('1989-04-10T06:59:00Z')
    const agora = new Date('2026-04-10T06:59:00Z') // 37 anos exatos
    const prog = progressedDate(nascimento, agora)
    const dias = (prog.getTime() - nascimento.getTime()) / 86400000
    expect(dias).toBeGreaterThan(36.8)
    expect(dias).toBeLessThan(37.2)
  })

  it('avança fracionado (não aos saltos anuais)', () => {
    const nascimento = new Date('1989-04-10T06:59:00Z')
    const meio = progressedDate(nascimento, new Date('2026-10-10T06:59:00Z'))
    const cheio = progressedDate(nascimento, new Date('2026-04-10T06:59:00Z'))
    const delta = (meio.getTime() - cheio.getTime()) / 86400000
    // meio ano de vida ≈ meio dia de progressão
    expect(delta).toBeGreaterThan(0.4)
    expect(delta).toBeLessThan(0.6)
  })
})

describe('computeProgressedPositions — a fração do dia progredido é o mapa inteiro', () => {
  const birth = {
    datetime: '1989-04-10T06:59:00',
    coordinates: { latitude: -22.9, longitude: -43.2 },
  }
  const agora = new Date('2026-08-09T12:00:00Z')

  beforeEach(() => vi.mocked(computeNatalLongitudes).mockClear())

  it('manda ao efemeride a HORA progredida, não a hora de nascimento', async () => {
    // 37,332 anos de vida => nascimento + 37,332 DIAS. Descartar a fração e
    // recolar a hora de nascimento desloca a Lua progredida em vários graus
    // (ela anda ~13°/dia progredido) — foi o que sumia com aspectos reais.
    await computeProgressedPositions(birth, agora)
    const arg = vi.mocked(computeNatalLongitudes).mock.calls[0][0] as any
    expect(arg.datetime).toBe('1989-05-17T14:57:00')
    expect(arg.datetime).not.toContain('06:59')
  })

  it('um mês a mais de vida move a hora progredida (~2h = ~1° de Lua)', async () => {
    await computeProgressedPositions(birth, agora)
    await computeProgressedPositions(birth, new Date('2026-09-09T12:00:00Z'))
    const [a, b] = vi.mocked(computeNatalLongitudes).mock.calls.map((c) => (c[0] as any).datetime)
    expect(a).not.toBe(b)
  })

  it('sem data ou sem coordenada não calcula nada', async () => {
    expect(await computeProgressedPositions(null)).toBeNull()
    expect(await computeProgressedPositions({ datetime: '1989-04-10T06:59:00' })).toBeNull()
  })
})

describe('computeProgressedAspects', () => {
  it('detecta aspecto da Lua progredida ao Sol natal', () => {
    const asp = computeProgressedAspects([p('Moon', 100)], [p('Sun', 280)])
    expect(asp).toHaveLength(1)
    expect(asp[0].aspect).toBe('oposicao')
    expect(asp[0].progressedPlanet).toBe('Moon')
    expect(asp[0].natalPlanet).toBe('Sun')
  })

  it('orbe da Lua = 3° (janela ~6 meses), menor que a de trânsito (6°)', () => {
    // 4.5° do sextil: seria aspecto num trânsito (orbe 6), mas não na progressão
    expect(computeProgressedAspects([p('Moon', 64.5)], [p('Sun', 0)])).toHaveLength(0)
    // 2° do sextil: dentro da orbe de 3° da Lua progredida
    expect(computeProgressedAspects([p('Moon', 62)], [p('Sun', 0)])).toHaveLength(1)
  })

  it('a Lua vem primeiro — é a única que se move de verdade', () => {
    const asp = computeProgressedAspects(
      [p('Saturn', 0), p('Moon', 0)],
      [p('Sun', 0)],
    )
    expect(asp[0].progressedPlanet).toBe('Moon')
  })

  it('entradas vazias não quebram', () => {
    expect(computeProgressedAspects(null, null)).toEqual([])
    expect(computeProgressedAspects([], [p('Sun', 0)])).toEqual([])
  })
})

describe('artefatos de imobilidade', () => {
  it('descarta conjunção do planeta lento com ele mesmo', () => {
    // Saturno progredido conjunção Saturno natal não é evento: é o planeta
    // parado onde sempre esteve. Apareceria na tela a vida inteira.
    const p = (name: string, longitude: number) => ({ name, longitude } as any)
    expect(computeProgressedAspects([p('Saturn', 100)], [p('Saturn', 100)])).toEqual([])
    expect(computeProgressedAspects([p('Neptune', 50)], [p('Neptune', 50)])).toEqual([])
    expect(computeProgressedAspects([p('Uranus', 10)], [p('Uranus', 10)])).toEqual([])
  })

  it('MANTÉM o retorno lunar — é ciclo real de ~27 anos', () => {
    const p = (name: string, longitude: number) => ({ name, longitude } as any)
    expect(computeProgressedAspects([p('Moon', 100)], [p('Moon', 100)])).toHaveLength(1)
  })

  it('mantém aspecto entre planetas lentos DIFERENTES', () => {
    const p = (name: string, longitude: number) => ({ name, longitude } as any)
    expect(computeProgressedAspects([p('Saturn', 100)], [p('Pluto', 160)])).toHaveLength(1)
  })
})
