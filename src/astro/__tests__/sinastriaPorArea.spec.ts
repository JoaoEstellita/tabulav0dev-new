import { describe, it, expect } from 'vitest'
import {
  vinculoDaArea, vinculoPorArea, aspectosDaArea,
  AREAS_SINASTRIA, PLANETAS_DA_AREA, MIN_ASPECTOS_POR_AREA,
} from '../sinastriaPorArea'

/**
 * O VÍNCULO POR ÁREA.
 *
 * ⚠️ O vínculo é FIXO: os aspectos entre dois mapas não mudam. Este número não
 * tem "hoje" — o que muda é o que o céu ativa nele, e isso vive separado de
 * propósito. Fundir os dois daria uma nota que sobe e desce sem a pessoa saber
 * se mudou o vínculo ou o céu.
 */

const asp = (mine: string, theirs: string, aspect: string, tone: string, orb = 1) =>
  ({ mine, theirs, aspect, symbol: '', tone, orb } as any)

describe('vínculo por área', () => {
  it('cada área tem planetas, e eles se sobrepõem de propósito', () => {
    expect(AREAS_SINASTRIA.length).toBe(5)
    for (const a of AREAS_SINASTRIA) {
      expect(PLANETAS_DA_AREA[a].size, `${a} sem planetas`).toBeGreaterThan(0)
    }
    // ⚠️ Vênus está em DOIS: afeto e química. Vênus–Marte é as duas coisas, e
    // forçar cada aspecto numa caixa só obrigaria a uma escolha arbitrária.
    expect(PLANETAS_DA_AREA.afeto.has('venus')).toBe(true)
    expect(PLANETAS_DA_AREA.quimica.has('venus')).toBe(true)
  })

  it('um aspecto entra em todas as áreas que ele toca', () => {
    const venusMarte = [asp('venus', 'mars', 'trigono', 'harmonioso')]
    expect(aspectosDaArea('afeto', venusMarte as any).length).toBe(1)
    expect(aspectosDaArea('quimica', venusMarte as any).length).toBe(1)
    expect(aspectosDaArea('comunicacao', venusMarte as any).length).toBe(0)
  })

  /**
   * ⚠️ UM ASPECTO SÓ NÃO FAZ NÚMERO. Produziria 5 ou 95 conforme o tom dele —
   * um extremo apoiado numa única quadratura parece certeza e não é. A área
   * devolve `null`, e a tela diz que não há contato forte ali: é informação, e
   * é verdade.
   */
  it('área com contato insuficiente não pontua', () => {
    expect(vinculoDaArea('comunicacao', [asp('mercury', 'sun', 'trigono', 'harmonioso')] as any)).toBeNull()
    expect(MIN_ASPECTOS_POR_AREA).toBeGreaterThanOrEqual(2)
    const comDois = vinculoDaArea('comunicacao', [
      asp('mercury', 'sun', 'trigono', 'harmonioso'),
      asp('mercury', 'moon', 'sextil', 'harmonioso'),
    ] as any)
    expect(comDois, 'com dois aspectos já pontua').not.toBeNull()
  })

  it('harmônico sobe e tenso desce', () => {
    const bom = vinculoDaArea('afeto', [
      asp('venus', 'venus', 'trigono', 'harmonioso'),
      asp('moon', 'venus', 'sextil', 'harmonioso'),
    ] as any)!
    const ruim = vinculoDaArea('afeto', [
      asp('venus', 'venus', 'quadratura', 'tenso'),
      asp('moon', 'venus', 'oposicao', 'tenso'),
    ] as any)!
    expect(bom.pct).toBeGreaterThan(50)
    expect(ruim.pct).toBeLessThan(50)
    expect(bom.harmonicos).toBe(2)
    expect(ruim.tensos).toBe(2)
  })

  it('orbe mais exata pesa mais', () => {
    const exato = vinculoDaArea('afeto', [
      asp('venus', 'venus', 'trigono', 'harmonioso', 0),
      asp('moon', 'venus', 'trigono', 'harmonioso', 0),
    ] as any)!
    const largo = vinculoDaArea('afeto', [
      asp('venus', 'venus', 'trigono', 'harmonioso', 5.5),
      asp('moon', 'venus', 'trigono', 'harmonioso', 5.5),
    ] as any)!
    expect(exato.pct).toBeGreaterThan(largo.pct)
  })

  it('o número vem com a explicação, ordenada pelo que mais pesou', () => {
    const v = vinculoDaArea('afeto', [
      asp('venus', 'venus', 'trigono', 'harmonioso', 0),
      asp('moon', 'neptune', 'quadratura', 'tenso', 5),
    ] as any)!
    expect(v.porque.length).toBeGreaterThan(0)
    expect(Math.abs(v.porque[0].peso)).toBeGreaterThanOrEqual(Math.abs(v.porque[v.porque.length - 1].peso))
    expect(v.quantos).toBe(2)
  })

  it('sem aspectos não há vínculo a mostrar', () => {
    expect(vinculoPorArea(null)).toBeNull()
    expect(vinculoPorArea([])).toBeNull()
    // Aspectos que não tocam área nenhuma: nada a dizer, não zeros.
    expect(vinculoPorArea([asp('jupiter', 'neptune', 'trigono', 'harmonioso')] as any)).toBeNull()
  })

  /**
   * ⚠️ AS ÁREAS TÊM DE SER COMPARÁVEIS ENTRE SI — é a razão de existirem lado a
   * lado num gráfico. Medido em 400 pares sintéticos: as medianas ficam entre
   * 53 e 60 e nenhuma satura.
   *
   * E é por isso que o % GERAL não entra no mesmo gráfico: medido nos mesmos
   * 400 pares, ele dá 52/73/95 — um quarto dos pares bate no teto de 95, porque
   * soma 20+ aspectos pela mesma curva calibrada para poucos. É a armadilha de
   * sempre: curva de um tamanho de entrada aplicada a outro.
   */
  it('a curva é a mesma do score geral — e é por isso que ela satura lá', () => {
    // Muitos aspectos harmônicos saturam no teto: o comportamento é o do geral.
    const muitos = Array.from({ length: 12 }, (_, i) =>
      asp(i % 2 ? 'venus' : 'moon', 'venus', 'trigono', 'harmonioso', 0))
    const v = vinculoDaArea('afeto', muitos as any)!
    expect(v.pct, 'com muitos harmônicos exatos, satura no teto').toBe(95)
    // Com poucos (o caso comum numa ÁREA), fica no meio da escala — que é o que
    // torna as cinco comparáveis entre si.
    const poucos = vinculoDaArea('afeto', [
      asp('venus', 'venus', 'trigono', 'harmonioso', 3),
      asp('moon', 'venus', 'quadratura', 'tenso', 3),
    ] as any)!
    expect(poucos.pct).toBeGreaterThan(30)
    expect(poucos.pct).toBeLessThan(70)
  })
})
