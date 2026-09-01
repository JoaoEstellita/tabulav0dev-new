import { describe, it, expect } from 'vitest'
import {
  calculateKin, kinOfDate, getOracle, getWavespell, getCastle, getEarthFamily,
  getKinDisplayName, buildProfile,
} from '../engine'
import { TONES, SEALS } from '../constants'

describe('tzolkin — cálculo do Kin', () => {
  it('26/07/1987 = Kin 34 (referência)', () => { expect(calculateKin('1987-07-26').kin).toBe(34) })
  it('01/01/1990 = Kin 143', () => { expect(calculateKin('1990-01-01').kin).toBe(143) })
  it('10/04/1989 = Kin 137 (selo 17, tom 7)', () => {
    const k = calculateKin('1989-04-10')
    expect(k.kin).toBe(137); expect(k.seal).toBe(17); expect(k.tone).toBe(7); expect(k.colorIndex).toBe(0)
  })
  it('29/05/2003 = Kin 96 (selo 16, tom 5)', () => {
    const k = calculateKin('2003-05-29')
    expect(k.kin).toBe(96); expect(k.seal).toBe(16); expect(k.tone).toBe(5)
  })
  it('dia anterior à referência 25/07/1987 = Kin 33', () => { expect(calculateKin('1987-07-25').kin).toBe(33) })
})

describe('tzolkin — 29/02 Hunab Ku', () => {
  it('29/02 marca isHunabKuLeapDay', () => { expect(calculateKin('2004-02-29').isHunabKuLeapDay).toBe(true) })
  it('29/02 não avança o Kin (Mar1 = Feb28 + 1)', () => {
    expect(calculateKin('2004-03-01').kin).toBe(calculateKin('2004-02-28').kin + 1)
  })
  it('data comum não marca Hunab Ku', () => { expect(calculateKin('2003-05-29').isHunabKuLeapDay).toBe(false) })
})

describe('tzolkin — bordas', () => {
  it('kinOfDate sempre 1..260', () => {
    for (const d of ['1900-01-01', '1850-06-15', '2150-12-31', '2026-09-01']) {
      const k = kinOfDate(d); expect(k).toBeGreaterThanOrEqual(1); expect(k).toBeLessThanOrEqual(260)
    }
  })
})

describe('tzolkin — oráculo da quinta força', () => {
  it('Kin 137', () => {
    const o = getOracle(137)
    expect(o.destiny.kin).toBe(137)
    expect(o.guide.kin).toBe(189)
    expect(o.analog.kin).toBe(202)
    expect(o.antipode.kin).toBe(7)
    expect(o.occult.kin).toBe(124)
  })
  it('Kin 96', () => {
    const o = getOracle(96)
    expect(o.guide.kin).toBe(44)
    expect(o.analog.kin).toBe(83)
    expect(o.antipode.kin).toBe(226)
    expect(o.occult.kin).toBe(165)
  })
  it('oculto 1↔260', () => { expect(getOracle(1).occult.kin).toBe(260); expect(getOracle(260).occult.kin).toBe(1) })
})

describe('tzolkin — onda/castelo/família', () => {
  it('onda do Kin 137 (Macaco, pos 7)', () => {
    const w = getWavespell(137)
    expect(w.index).toBe(11); expect(w.position).toBe(7); expect(w.startKin).toBe(131); expect(w.rulingSeal).toBe(11)
  })
  it('castelo do Kin 137 = Azul (105–156)', () => {
    const c = getCastle(137); expect(c.key).toBe('blue'); expect(c.startKin).toBe(105); expect(c.endKin).toBe(156)
  })
  it('família terrestre por selo', () => {
    expect(getEarthFamily(17)).toBe('core')
    expect(getEarthFamily(16)).toBe('cardinal')
    expect(getEarthFamily(9)).toBe('portal')
    expect(getEarthFamily(5)).toBe('polar')
    expect(getEarthFamily(13)).toBe('signal')
  })
})

describe('tzolkin — display + profile', () => {
  it('nome do Kin 137 = Terra Ressonante Vermelha', () => {
    expect(getKinDisplayName(137, 'pt-BR')).toBe('Terra Ressonante Vermelha')
  })
  it('nome do Kin 96 = Guerreiro Entonado Amarelo', () => {
    expect(getKinDisplayName(96, 'pt-BR')).toBe('Guerreiro Entonado Amarelo')
  })
  it('buildProfile agrega tudo', () => {
    const p = buildProfile('1989-04-10')
    expect(p.kin).toBe(137); expect(p.oracle.guide.kin).toBe(189)
    expect(p.wavespell.index).toBe(11); expect(p.castle.key).toBe('blue'); expect(p.earthFamily).toBe('core')
  })
})

describe('tzolkin — constantes', () => {
  it('13 tons e 20 selos completos', () => {
    expect(TONES).toHaveLength(13); expect(SEALS).toHaveLength(20)
    expect(TONES.every(t => t.namePt && t.essencePt)).toBe(true)
    expect(SEALS.every(s => s.namePt && s.color)).toBe(true)
  })
  it('cor do selo = (número-1)%4', () => {
    expect(SEALS[16].color).toBe('red')    // 17 Terra
    expect(SEALS[15].color).toBe('yellow') // 16 Guerreiro
    expect(SEALS[1].color).toBe('white')   // 2 Vento
    expect(SEALS[2].color).toBe('blue')    // 3 Noite
  })
})
