import { describe, it, expect } from 'vitest'
import { lahiriAyanamsa, tropicalToSidereal } from '../ayanamsa'
import { NAKSHATRAS, nakshatraFromSidereal, NAKSHATRA_ARC } from '../nakshatra'
import { computeGunaMilan } from '../gunaMilan'
import { buildDashaTimeline, currentDasha, VIMSHOTTARI } from '../dasha'

describe('ayanamsa Lahiri', () => {
  it('≈ 23.85° em J2000 e ≈ 24.1-24.2° em 2024', () => {
    expect(lahiriAyanamsa(new Date('2000-01-01T12:00:00Z'))).toBeCloseTo(23.853, 2)
    const y2024 = lahiriAyanamsa(new Date('2024-01-01T00:00:00Z'))
    expect(y2024).toBeGreaterThan(24.0)
    expect(y2024).toBeLessThan(24.3)
  })
  it('sideral = tropical − ayanamsa, normalizado', () => {
    const d = new Date('2024-01-01T00:00:00Z')
    const norm = (((10 - lahiriAyanamsa(d)) % 360) + 360) % 360
    expect(tropicalToSidereal(10, d)).toBeCloseTo(norm, 4) // −14.19 normaliza p/ ~345.81
    expect(tropicalToSidereal(0, d)).toBeGreaterThan(300) // 0 − 24 → ~336
  })
})

describe('tabela de nakshatras', () => {
  it('tem 27 entradas com índice sequencial', () => {
    expect(NAKSHATRAS).toHaveLength(27)
    NAKSHATRAS.forEach((n, i) => expect(n.index).toBe(i))
  })
  it('gana e nadi particionam 9/9/9', () => {
    const count = (arr: string[], v: string) => arr.filter((x) => x === v).length
    const ganas = NAKSHATRAS.map((n) => n.gana)
    const nadis = NAKSHATRAS.map((n) => n.nadi)
    expect(count(ganas, 'deva')).toBe(9)
    expect(count(ganas, 'manushya')).toBe(9)
    expect(count(ganas, 'rakshasa')).toBe(9)
    expect(count(nadis, 'adi')).toBe(9)
    expect(count(nadis, 'madhya')).toBe(9)
    expect(count(nadis, 'antya')).toBe(9)
  })
  it('regentes seguem a ordem Vimshottari (Ketu, Vênus, Sol, Lua, Marte, Rahu, Júpiter, Saturno, Mercúrio)', () => {
    const ordem = VIMSHOTTARI.map((v) => v.lord)
    NAKSHATRAS.forEach((n, i) => expect(n.lord).toBe(ordem[i % 9]))
  })
  it('Rohini e Mrigashira: mesmo yoni (serpente); nadi diferente (antya vs madhya)', () => {
    const rohini = NAKSHATRAS[3]
    const mrigashira = NAKSHATRAS[4]
    expect(rohini.name).toBe('Rohini')
    expect(mrigashira.name).toBe('Mrigashira')
    expect(rohini.yoni).toBe('serpent')
    expect(mrigashira.yoni).toBe('serpent')
    expect(rohini.nadi).not.toBe(mrigashira.nadi)
  })
})

describe('nakshatra a partir de longitude sideral', () => {
  it('limites, pada e rashi', () => {
    expect(nakshatraFromSidereal(0).nakshatra.key).toBe('ashwini')
    expect(nakshatraFromSidereal(0).pada).toBe(1)
    expect(nakshatraFromSidereal(NAKSHATRA_ARC - 0.01).nakshatra.key).toBe('ashwini')
    expect(nakshatraFromSidereal(NAKSHATRA_ARC - 0.01).pada).toBe(4)
    expect(nakshatraFromSidereal(NAKSHATRA_ARC + 0.01).nakshatra.key).toBe('bharani')
    // 46.67° cai em Rohini (Touro); 60° em Mrigashira (Gêmeos)
    expect(nakshatraFromSidereal(46.67).nakshatra.key).toBe('rohini')
    expect(nakshatraFromSidereal(46.67).rashi.name).toBe('Touro')
    expect(nakshatraFromSidereal(60).nakshatra.key).toBe('mrigashira')
  })
})

describe('golden — âncoras reais (Lua sideral via astronomy-engine; ver scratchpad/vedic_anchor.js)', () => {
  it('João 1989-04-10 09:59Z → Lua sideral ~55.49° → Mrigashira', () => {
    expect(nakshatraFromSidereal(55.49).nakshatra.key).toBe('mrigashira')
  })
  it('Érica 2003-05-29 16:57Z → Lua sideral ~27.92° → Krittika', () => {
    expect(nakshatraFromSidereal(27.92).nakshatra.key).toBe('krittika')
  })
})

describe('Guna Milan (Ashtakoot)', () => {
  const rohini = nakshatraFromSidereal(46.67)
  const mrigashira = nakshatraFromSidereal(60)

  it('Rohini × Mrigashira: Yoni 4/4 (serpente), Nadi 8/8 (sem dosha), total plausível', () => {
    const gm = computeGunaMilan(rohini, mrigashira)
    const yoni = gm.kutas.find((k) => k.key === 'yoni')!
    const nadi = gm.kutas.find((k) => k.key === 'nadi')!
    expect(yoni.points).toBe(4)
    expect(nadi.points).toBe(8)
    expect(gm.hasNadiDosha).toBe(false)
    expect(gm.total).toBeGreaterThanOrEqual(22)
    expect(gm.total).toBeLessThanOrEqual(36)
    expect(['bom', 'excelente', 'medio']).toContain(gm.band)
  })

  it('mesma nadi → Nadi dosha (0 pontos)', () => {
    const ashwini = nakshatraFromSidereal(3) // adi
    const ardra = nakshatraFromSidereal(5 * NAKSHATRA_ARC + 3) // Ardra, adi
    const gm = computeGunaMilan(ashwini, ardra)
    expect(gm.kutas.find((k) => k.key === 'nadi')!.points).toBe(0)
    expect(gm.hasNadiDosha).toBe(true)
  })

  it('total nunca passa de 36 e cada kuta respeita seu máximo', () => {
    const gm = computeGunaMilan(rohini, mrigashira)
    expect(gm.total).toBeLessThanOrEqual(36)
    gm.kutas.forEach((k) => expect(k.points).toBeLessThanOrEqual(k.max))
  })
})

describe('Vimshottari Dasha', () => {
  it('durações somam 120 anos', () => {
    expect(VIMSHOTTARI.reduce((s, v) => s + v.years, 0)).toBe(120)
  })
  it('Lua no início de Rohini (regente Lua) → 1º período = Lua, saldo ~10 anos', () => {
    const birth = new Date('2000-01-01T00:00:00Z')
    const timeline = buildDashaTimeline(40, birth) // 40° sideral = início de Rohini
    expect(timeline[0].lord).toBe('moon')
    const anos = (timeline[0].end.getTime() - timeline[0].start.getTime()) / (365.25 * 24 * 3600 * 1000)
    expect(anos).toBeCloseTo(10, 1)
    expect(timeline[1].lord).toBe('mars') // próximo após Lua na ordem Vimshottari
  })
  it('currentDasha acha o período vigente', () => {
    const birth = new Date('2000-01-01T00:00:00Z')
    expect(currentDasha(40, birth, new Date('2005-01-01Z'))!.lord).toBe('moon')
    expect(currentDasha(40, birth, new Date('2015-01-01Z'))!.lord).toBe('mars')
  })
})
