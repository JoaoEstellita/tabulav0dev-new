import { describe, it, expect } from 'vitest'
import { calculateAspect } from '../aspect-engine'
import { detectAspects } from '../aspects.engine'
import ASPECTS_CONFIG from '../aspects.config'

const corpo = (name: string, longitude: number) => ({ name, longitude, speed: 1 }) as any

describe('separação angular dobra acima de 180°', () => {
  it('trígono que cruza o 0° de Áries é detectado', () => {
    // 300° e 60° estão a 120° um do outro — trígono exato. Sem dobrar, a conta
    // dá 240 e o aspecto some. Como cada par cai desse lado em ~metade dos
    // casos, o bug custava metade dos aspectos.
    const r = calculateAspect(corpo('Sun', 300), corpo('Moon', 60), undefined, ASPECTS_CONFIG)
    expect(r?.type).toBe('trígono')
    expect(r?.orb).toBeLessThan(0.01)
  })

  it('conjunção através do 0° é detectada', () => {
    const r = calculateAspect(corpo('Sun', 358), corpo('Moon', 2), undefined, ASPECTS_CONFIG)
    expect(r?.type).toBe('conjunção')
    expect(r?.orb).toBeCloseTo(4, 1)
  })

  it('oposição continua sendo oposição', () => {
    const r = calculateAspect(corpo('Sun', 10), corpo('Moon', 190), undefined, ASPECTS_CONFIG)
    expect(r?.type).toBe('oposição')
  })

  it('os dois motores concordam no caso que cruza o zero', () => {
    // Guarda contra os dois divergirem de novo: era exatamente aqui que o motor
    // morto discordava do vivo.
    const achados = detectAspects([corpo('Sun', 300)], [corpo('Moon', 60)], ASPECTS_CONFIG) as any[]
    const trigono = achados.find((a) => String(a.type).startsWith('tríg') || String(a.type).startsWith('trig'))
    expect(trigono).toBeTruthy()
  })
})
