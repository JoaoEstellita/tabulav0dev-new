import { describe, it, expect } from 'vitest'
import aspectsConfig from '../aspects.config'
import { detectAspects } from '../aspects.engine'

describe('aspects.engine detectAspects', () => {

  it('detecta aspectos de trânsito com MC e IC', () => {
    // MC at 200°, IC at 20° (opposite)
    const transit = [
      { name: 'Mars', longitude: 200, speed: 0.8 },
      { name: 'Venus', longitude: 20, speed: 1.2 }
    ];
    const natal = [
      { name: 'MC', longitude: 200, speed: 0 },
      { name: 'IC', longitude: 20, speed: 0 }
    ];
    const res = detectAspects(transit, natal, aspectsConfig);
    // Mars conjunct MC
    const marsMc = res.find(r => r.type === 'conjunção' && r.planet1 === 'Mars' && r.planet2 === 'MC');
    expect(marsMc).toBeTruthy();
    expect(marsMc!.orb).toBeLessThanOrEqual(1);
    // Venus conjunct IC
    const venusIc = res.find(r => r.type === 'conjunção' && r.planet1 === 'Venus' && r.planet2 === 'IC');
    expect(venusIc).toBeTruthy();
    expect(venusIc!.orb).toBeLessThanOrEqual(1);
  });
  it('detecta conjunção com orbe pequena', () => {
    const A = [{ name: 'Sun', longitude: 10, speed: 1.0 }]
    const B = [{ name: 'Moon', longitude: 12, speed: 12.0 }]
    const res = detectAspects(A, B, aspectsConfig)
    const conj = res.find(r => r.type === 'conjunção' && r.planet1 === 'Sun' && r.planet2 === 'Moon')
    expect(conj).toBeTruthy()
    expect(conj!.orb).toBeCloseTo(2, 5)
  })

  it('detecta quadratura próxima de 90°', () => {
    const A = [{ name: 'Mars', longitude: 50, speed: 0.6 }]
    const B = [{ name: 'Venus', longitude: 140, speed: 1.2 }]
    const res = detectAspects(A, B, aspectsConfig)
    const quad = res.find(r => r.type === 'quadratura')
    expect(quad).toBeTruthy()
    expect(quad!.orb).toBeLessThanOrEqual(6)
  })

  it('detecta sextil e respeita limite de orbe', () => {
    // Para Mercury e Jupiter, orbe máximo para sextil é ~3.89°
    // Usar posições dentro desse orbe
    const A = [{ name: 'Mercury', longitude: 0, speed: 1.4 }]
    const B = [{ name: 'Jupiter', longitude: 63, speed: 0.2 }]
    const res = detectAspects(A, B, aspectsConfig)
    const sext = res.find(r => r.type === 'sextil')
    expect(sext).toBeTruthy()
    expect(sext!.orb).toBeLessThanOrEqual(3.89)
  })

  it('marca aplicante quando planeta A é mais rápido que B', () => {
    const A = [{ name: 'Moon', longitude: 100, speed: 13.0 }]
    const B = [{ name: 'Saturn', longitude: 100.5, speed: 0.05 }]
    const res = detectAspects(A, B, aspectsConfig)
    const conj = res.find(r => r.type === 'conjunção')
    expect(conj).toBeTruthy()
    expect(conj!.isApplying).toBe(true)
  })
})


