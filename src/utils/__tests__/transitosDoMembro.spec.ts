import { describe, it, expect } from 'vitest'
import {
  transitosDoMembro,
  transitosDaArea,
  paraFormatoDoCalculo,
  duracaoDoTransito,
} from '../transitosDoMembro'
import { emocoesDoDia } from '../emocoesDoDia'

/** Um item no formato REAL de `lifeAreas[area].activeTransits`. */
const A = (transitPlanet: string, aspectName: string, natalPlanet: string, extra = {}) => ({
  transitPlanet,
  aspectName,
  target: { natalPlanet },
  orb: 1.2,
  impact: 0.8,
  applying: true,
  ...extra,
})

const membro = (lifeAreas: Record<string, any>) => ({ lifeAreas })

describe('trânsitos de um membro do grupo', () => {
  /**
   * ⚠️ O CAMPO CERTO É `lifeAreas[area].activeTransits`.
   *
   * `member.areaTransits` existe no tipo e chega SEMPRE VAZIO — o backend o
   * zera de propósito para não reintroduzir cache velho. A primeira versão
   * deste módulo lia dali: a lista vinha vazia, `emocoesDoDia` devolvia null e
   * a tendência emocional não aparecia para membro nenhum, sem erro algum.
   */
  it('lê de lifeAreas[area].activeTransits, não de areaTransits', () => {
    const comAreaTransits: any = {
      areaTransits: { carreira: [A('Saturn', 'quadratura', 'Sun')] },
      lifeAreas: {},
    }
    expect(transitosDoMembro(comAreaTransits), 'areaTransits não é fonte').toEqual([])

    const certo = membro({ carreira: { activeTransits: [A('Saturn', 'quadratura', 'Sun')] } })
    expect(transitosDoMembro(certo)).toHaveLength(1)
  })

  /**
   * ⚠️ O FORMATO É OUTRO: `aspectName` em vez de `type`, `target.natalPlanet`
   * aninhado em vez de `natalPlanet`, `impact` em vez de `strength`. Passar o
   * item cru adiante não quebraria nada visível — os campos chegariam
   * undefined, tudo seria filtrado e a conta daria zero.
   */
  describe('a tradução de formato', () => {
    it('desaninha o alvo e renomeia os campos', () => {
      const t = paraFormatoDoCalculo(A('Saturn', 'quadratura', 'Sun'))!
      expect(t.transitPlanet).toBe('Saturn')
      expect(t.type).toBe('quadratura')
      expect(t.natalPlanet).toBe('Sun')
      expect(t.orb).toBe(1.2)
      expect(t.strength).toBe(0.8)
    })

    it('aceita ângulo como alvo, não só planeta natal', () => {
      const t = paraFormatoDoCalculo({
        transitPlanet: 'Pluto', aspectName: 'conjuncao', target: { angle: 'MC' },
      })!
      expect(t.natalPlanet).toBe('MC')
    })

    it('descarta ênfase de casa — entra em activeTransits sem aspecto', () => {
      expect(paraFormatoDoCalculo({ transitPlanet: 'Mars', target: { house: 6 } })).toBeNull()
      expect(paraFormatoDoCalculo({ aspectName: 'quadratura', target: { natalPlanet: 'Sun' } })).toBeNull()
    })

    it('o resultado é consumível por emocoesDoDia', () => {
      const r = emocoesDoDia(transitosDoMembro(
        membro({ carreira: { activeTransits: [A('Mars', 'quadratura', 'Mars')] } }),
      ) as any)
      expect(r).not.toBeNull()
      expect(r!.find((e) => e.chave === 'estresse')!.valor).toBeGreaterThan(0)
    })
  })

  /**
   * `activeTransits` não traz `durationClass`, mas traz a janela — e é a
   * duração que diz se o trânsito é notícia do dia ou pano de fundo.
   */
  describe('a duração vinda da janela', () => {
    const dias = (n: number) => ({
      startAt: new Date('2026-01-01T00:00:00Z').toISOString(),
      endAt: new Date(Date.UTC(2026, 0, 1 + n)).toISOString(),
    })

    it('classifica pela largura da janela', () => {
      expect(duracaoDoTransito(dias(3))).toBe('curto')
      expect(duracaoDoTransito(dias(40))).toBe('medio')
      expect(duracaoDoTransito(dias(300))).toBe('longo')
    })

    it('janela ausente ou torta não inventa classe', () => {
      expect(duracaoDoTransito({})).toBeUndefined()
      expect(duracaoDoTransito({ startAt: 'abc', endAt: 'def' })).toBeUndefined()
      // Fim antes do começo é dado corrompido, não um trânsito de duração zero.
      expect(duracaoDoTransito({ startAt: dias(10).endAt, endAt: dias(10).startAt })).toBeUndefined()
    })

    it('chega no formato do cálculo', () => {
      expect(paraFormatoDoCalculo(A('Saturn', 'quadratura', 'Sun', dias(200)))!.durationClass).toBe('longo')
    })
  })

  /**
   * ⚠️ A DEDUPLICAÇÃO É O MOTIVO DESTE MÓDULO EXISTIR.
   *
   * Os trânsitos vivem dentro de cada área e o mesmo aparece em várias:
   * Saturno em quadratura com o Sol conta em carreira, saúde e família ao
   * mesmo tempo. Sem deduplicar, ele pesa três vezes nas emoções e os números
   * saem inflados sem nada denunciar.
   */
  describe('deduplicação', () => {
    it('o mesmo trânsito em três áreas entra UMA vez', () => {
      const t = A('Saturn', 'quadratura', 'Sun')
      const r = transitosDoMembro(membro({
        carreira: { activeTransits: [t] },
        saude: { activeTransits: [{ ...t }] },
        familia: { activeTransits: [{ ...t }] },
      }))
      expect(r).toHaveLength(1)
    })

    it('e isso muda o resultado das emoções', () => {
      const t = A('Saturn', 'quadratura', 'Sun')
      const umaVez = emocoesDoDia(transitosDoMembro(membro({ carreira: { activeTransits: [t] } })) as any)!
      const repetido = emocoesDoDia(transitosDoMembro(membro({
        carreira: { activeTransits: [t] },
        saude: { activeTransits: [{ ...t }] },
        familia: { activeTransits: [{ ...t }] },
        amor: { activeTransits: [{ ...t }] },
      })) as any)!
      const de = (r: typeof umaVez, k: string) => r.find((e) => e.chave === k)!.valor
      expect(de(repetido, 'desanimo')).toBe(de(umaVez, 'desanimo'))
    })

    it('trânsitos diferentes do mesmo planeta não são confundidos', () => {
      const r = transitosDoMembro(membro({
        carreira: { activeTransits: [A('Saturn', 'quadratura', 'Sun'), A('Saturn', 'quadratura', 'Moon')] },
        saude: { activeTransits: [A('Saturn', 'trigono', 'Sun')] },
      }))
      expect(r).toHaveLength(3)
    })

    it('a chave ignora caixa e espaço', () => {
      const r = transitosDoMembro(membro({
        a: { activeTransits: [A('Saturn', 'quadratura', 'Sun')] },
        b: { activeTransits: [A('saturn ', ' quadratura', 'SUN')] },
      }))
      expect(r).toHaveLength(1)
    })
  })

  it('lixo na entrada devolve lista vazia, sem quebrar', () => {
    for (const lixo of [null, undefined, 'abc', 42, {}, { lifeAreas: null }, { lifeAreas: 'x' },
                        { lifeAreas: { a: null } }, { lifeAreas: { a: { activeTransits: 'x' } } }]) {
      expect(transitosDoMembro(lixo as any), JSON.stringify(lixo)).toEqual([])
    }
  })
})

describe('trânsitos de uma área só', () => {
  it('devolve a lista da área pedida, já traduzida', () => {
    const m = membro({
      carreira: { activeTransits: [A('Saturn', 'quadratura', 'Sun')] },
      amor: { activeTransits: [A('Venus', 'trigono', 'Moon')] },
    })
    expect(transitosDaArea(m, 'carreira')).toHaveLength(1)
    expect(transitosDaArea(m, 'amor')[0].transitPlanet).toBe('Venus')
    expect(transitosDaArea(m, 'amor')[0].type).toBe('trigono')
  })

  it('área ausente ou dado torto devolve vazio', () => {
    expect(transitosDaArea(membro({}), 'carreira')).toEqual([])
    expect(transitosDaArea(null, 'carreira')).toEqual([])
    expect(transitosDaArea(membro({ carreira: { activeTransits: 'x' } }) as any, 'carreira')).toEqual([])
  })
})
