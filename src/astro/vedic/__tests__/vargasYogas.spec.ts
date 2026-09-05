import { describe, it, expect } from 'vitest'
import { saptamshaRashi, dashamshaRashi, dwadashamshaRashi, buildVargaChart } from '../vargas'
import { detectYogas } from '../yogas'
import { vargaDomain, yogaText, signTrait, signName, type VLang } from '../../../data/vedicVargaYogaReadings'

describe('vargas (Parashari)', () => {
  it('D12: signo próprio no início do signo, avança 1 a cada 2°30', () => {
    expect(dwadashamshaRashi(0)).toBe(0)      // 0° Áries → parte 0 → Áries
    expect(dwadashamshaRashi(2.6)).toBe(1)    // ~2°30' → parte 1 → Touro
    expect(dwadashamshaRashi(29.9)).toBe(11)  // fim de Áries → parte 11 → Peixes
  })
  it('D10: signo ímpar começa nele; par começa no 9º', () => {
    expect(dashamshaRashi(0)).toBe(0)         // Áries (ímpar) parte 0 → Áries
    expect(dashamshaRashi(3.1)).toBe(1)       // Áries parte 1 → Touro
    expect(dashamshaRashi(30)).toBe(9)        // 0° Touro (par) → começa no 9º de Touro = Capricórnio
  })
  it('D7: ímpar começa nele; par começa no 7º', () => {
    expect(saptamshaRashi(0)).toBe(0)         // Áries parte 0 → Áries
    expect(saptamshaRashi(30)).toBe(7)        // 0° Touro (par) → 7º de Touro = Escorpião
  })
  it('buildVargaChart mapeia planetas + Lagna', () => {
    const bodies = [
      { name: 'Lagna', siderealLon: 0 },
      { name: 'Sun', siderealLon: 3.1 },
      { name: 'Moon', siderealLon: 30 },
    ]
    const d10 = buildVargaChart('D10', bodies)!
    expect(d10.id).toBe('D10')
    expect(d10.lagnaRashiIndex).toBe(0)
    expect(d10.positions.find((p) => p.name === 'Sun')!.rashiIndex).toBe(1)
    expect(d10.positions.find((p) => p.name === 'Moon')!.rashiIndex).toBe(9)
  })
})

describe('yogas', () => {
  const P = (name: string, rashiIndex: number, house: number) => ({ name, rashiIndex, house })

  it('Gaja-Kesari: Júpiter em kendra da Lua', () => {
    const chart = { lagna: { rashiIndex: 0 }, planets: [P('Moon', 0, 1), P('Jupiter', 3, 4)] }
    expect(detectYogas(chart).some((y) => y.id === 'gaja_kesari')).toBe(true)
  })
  it('Budha-Aditya: Sol + Mercúrio no mesmo signo', () => {
    const chart = { lagna: { rashiIndex: 0 }, planets: [P('Sun', 4, 5), P('Mercury', 4, 5)] }
    expect(detectYogas(chart).some((y) => y.id === 'budha_aditya')).toBe(true)
  })
  it('Ruchaka: Marte em signo próprio (Áries) e em kendra', () => {
    const chart = { lagna: { rashiIndex: 0 }, planets: [P('Mars', 0, 1)] }
    expect(detectYogas(chart).some((y) => y.id === 'ruchaka')).toBe(true)
  })
  it('Sem yoga → lista vazia', () => {
    const chart = { lagna: { rashiIndex: 0 }, planets: [P('Saturn', 2, 3)] }
    expect(detectYogas(chart)).toEqual([])
  })
})

describe('catálogo varga/yoga i18n', () => {
  const langs: VLang[] = ['pt-BR', 'en-US', 'es-ES', 'it-IT']
  it('domínios D7/D10/D12 nos 4 idiomas', () => {
    for (const id of ['D7', 'D10', 'D12'] as const) for (const lang of langs) {
      const d = vargaDomain(id, lang)!
      expect(d.title.length, `${id} ${lang}`).toBeGreaterThan(0)
      expect(d.intro.length).toBeGreaterThan(20)
    }
  })
  it('8 yogas nos 4 idiomas', () => {
    for (const id of ['gaja_kesari', 'budha_aditya', 'chandra_mangala', 'ruchaka', 'bhadra', 'hamsa', 'malavya', 'sasa']) {
      for (const lang of langs) {
        const y = yogaText(id, lang)!
        expect(y.name.length, `${id} ${lang}`).toBeGreaterThan(0)
        expect(y.meaning.length).toBeGreaterThan(20)
      }
    }
  })
  it('en sem "will"; es sem tildes; it sem acentos', () => {
    for (const id of ['gaja_kesari', 'ruchaka', 'hamsa']) {
      expect(/\bwill\b/i.test(yogaText(id, 'en-US')!.meaning)).toBe(false)
      expect(/[áéíóúñ]/i.test(yogaText(id, 'es-ES')!.meaning)).toBe(false)
      expect(/[àèéìòù]/i.test(yogaText(id, 'it-IT')!.meaning)).toBe(false)
    }
    for (let i = 0; i < 12; i++) {
      expect(/[áéíóúñ]/i.test(signTrait(i, 'es-ES'))).toBe(false)
      expect(/[àèéìòù]/i.test(signTrait(i, 'it-IT'))).toBe(false)
    }
    expect(signName(0, 'pt-BR')).toBe('Áries')
  })
})
