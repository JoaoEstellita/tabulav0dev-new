import { describe, it, expect } from 'vitest'
import { transitosDoMembro, transitosDaArea } from '../transitosDoMembro'
import { emocoesDoDia } from '../emocoesDoDia'

const T = (transitPlanet: string, type: string, natalPlanet: string, extra = {}) =>
  ({ transitPlanet, type, natalPlanet, orb: 1, strength: 80, ...extra })

describe('trânsitos de um membro do grupo', () => {
  /**
   * ⚠️ O TESTE QUE JUSTIFICA O ARQUIVO.
   *
   * O grupo entrega os trânsitos agrupados por área, e o MESMO trânsito aparece
   * em várias: Saturno em quadratura com o Sol conta em carreira, saúde e
   * família ao mesmo tempo. Concatenar sem deduplicar faria esse trânsito pesar
   * três vezes nas emoções, inflando os números sem nada denunciar — nenhum
   * erro, nenhum campo faltando, só valores altos demais.
   */
  it('o mesmo trânsito em três áreas entra UMA vez', () => {
    const saturno = T('Saturn', 'quadratura', 'Sun')
    const r = transitosDoMembro({
      carreira: [saturno],
      saude: [{ ...saturno }],
      familia: [{ ...saturno }],
    })
    expect(r).toHaveLength(1)
  })

  it('e isso muda o resultado das emoções', () => {
    const saturno = T('Saturn', 'quadratura', 'Sun')
    const umaVez = emocoesDoDia(transitosDoMembro({ carreira: [saturno] }) as any)!
    const repetido = emocoesDoDia(transitosDoMembro({
      carreira: [saturno], saude: [{ ...saturno }], familia: [{ ...saturno }], amor: [{ ...saturno }],
    }) as any)!
    const de = (r: typeof umaVez, k: string) => r.find((e) => e.chave === k)!.valor
    // Deduplicado, o desânimo tem de dar o MESMO número das duas formas.
    expect(de(repetido, 'desanimo')).toBe(de(umaVez, 'desanimo'))
  })

  it('trânsitos diferentes do mesmo planeta não são confundidos', () => {
    const r = transitosDoMembro({
      carreira: [T('Saturn', 'quadratura', 'Sun'), T('Saturn', 'quadratura', 'Moon')],
      saude: [T('Saturn', 'trigono', 'Sun')],
    })
    expect(r).toHaveLength(3)
  })

  it('a chave ignora caixa e espaço — o mesmo trânsito escrito de dois jeitos', () => {
    const r = transitosDoMembro({
      a: [T('Saturn', 'quadratura', 'Sun')],
      b: [T('saturn ', ' quadratura', 'SUN')],
    })
    expect(r).toHaveLength(1)
  })

  it('descarta entrada sem planeta ou sem aspecto', () => {
    const r = transitosDoMembro({
      a: [T('Saturn', 'quadratura', 'Sun'), { natalPlanet: 'Sun' } as any, { transitPlanet: 'Mars' } as any],
    })
    expect(r).toHaveLength(1)
  })

  it('lixo na entrada devolve lista vazia, sem quebrar', () => {
    for (const lixo of [null, undefined, 'abc', 42, [], { a: null }, { a: 'nao-array' }]) {
      expect(transitosDoMembro(lixo as any), String(lixo)).toEqual([])
    }
  })

  it('preserva os campos que o cálculo usa', () => {
    const [t] = transitosDoMembro({
      carreira: [T('Saturn', 'quadratura', 'Sun', { durationClass: 'longo', orb: 2.5, strength: 73 })],
    })
    expect(t.orb).toBe(2.5)
    expect(t.strength).toBe(73)
    expect(t.durationClass).toBe('longo')
  })
})

describe('trânsitos de uma área só', () => {
  it('devolve a lista da área pedida', () => {
    const areas = { carreira: [T('Saturn', 'quadratura', 'Sun')], amor: [T('Venus', 'trigono', 'Moon')] }
    expect(transitosDaArea(areas, 'carreira')).toHaveLength(1)
    expect(transitosDaArea(areas, 'amor')[0].transitPlanet).toBe('Venus')
  })

  it('área ausente ou dado torto devolve vazio', () => {
    expect(transitosDaArea({}, 'carreira')).toEqual([])
    expect(transitosDaArea(null, 'carreira')).toEqual([])
    expect(transitosDaArea({ carreira: 'nao-array' } as any, 'carreira')).toEqual([])
  })
})
