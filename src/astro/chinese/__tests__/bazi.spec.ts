import { describe, it, expect } from 'vitest'
import { buildChineseChart } from '../bazi'
import { STEMS, BRANCHES } from '../constants'

// Rio de Janeiro UTC-3, longitude ~-43.2.
describe('bazi — 10/04/1989 (regressão âncora)', () => {
  // Sem hora: usa meio-dia local (12:00 Rio = 15:00 UTC) para a longitude do Sol.
  const c = buildChineseChart({ year: 1989, month: 4, day: 10, longitude: -43.2, utc: new Date(Date.UTC(1989, 3, 10, 15)) })

  it('Pilar do Ano = 己巳 (Terra Yin · Serpente)', () => {
    expect(STEMS[c.bazi.year.stem].hanzi).toBe('己')
    expect(BRANCHES[c.bazi.year.branch].hanzi).toBe('巳')
  })
  it('Pilar do Mês = 戊辰 (Terra Yang · Dragão)', () => {
    expect(STEMS[c.bazi.month.stem].hanzi).toBe('戊')
    expect(BRANCHES[c.bazi.month.branch].hanzi).toBe('辰')
  })
  it('Pilar do Dia = 庚子 (Metal Yang · Rato)', () => {
    expect(STEMS[c.bazi.day.stem].hanzi).toBe('庚')
    expect(BRANCHES[c.bazi.day.branch].hanzi).toBe('子')
  })
  it('Day Master = 庚 (Metal Yang)', () => {
    expect(c.bazi.dayMaster).toBe(6)
    expect(STEMS[6].element).toBe('metal'); expect(STEMS[6].polarity).toBe('yang')
  })
  it('animal do ano = Serpente', () => {
    expect(BRANCHES[c.zodiac.animalBranch].animalPt).toBe('Serpente')
  })
  it('sem hora → confidence limited, sem Pilar da Hora', () => {
    expect(c.bazi.hour).toBeNull(); expect(c.bazi.confidence).toBe('limited')
  })
})

describe('bazi — boundary da hora (06:59 Rio → correção solar cruza 卯/辰)', () => {
  // 06:59 local Rio (UTC-3) = 09:59 UTC. Correção solar ~ -2h53 + EoT → ~07:06 solar → 辰.
  const c = buildChineseChart({ year: 1989, month: 4, day: 10, hour: 6, minute: 59, longitude: -43.2, utc: new Date(Date.UTC(1989, 3, 10, 9, 59)) })
  it('hora civil 06:59 seria 卯, mas solar vira 辰', () => {
    expect(BRANCHES[c.bazi.hour!.branch].hanzi).toBe('辰')
    expect(c.bazi.boundaryWarning).toBe('hour_solar_shift')
  })
  it('com hora → confidence high', () => { expect(c.bazi.confidence).toBe('high') })
})

describe('bazi — Jiazi e Ten Gods', () => {
  it('day pillar cycleIndex de 庚子 = 36', () => {
    const c = buildChineseChart({ year: 1989, month: 4, day: 10, longitude: -43.2, utc: new Date(Date.UTC(1989, 3, 10, 15)) })
    expect(c.bazi.day.cycleIndex).toBe(36)
  })
  it('Ten God do ano (己 Terra Yin vs DM 庚 Metal Yang) = zheng-yin (produz DM, pol. oposta)', () => {
    const c = buildChineseChart({ year: 1989, month: 4, day: 10, longitude: -43.2, utc: new Date(Date.UTC(1989, 3, 10, 15)) })
    expect(c.bazi.tenGods.year).toBe('zheng-yin')
  })
})
