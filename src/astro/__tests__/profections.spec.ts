import { describe, it, expect } from 'vitest'
import { computeProfection } from '../profections'
import { profectionHouseText, profectionLordBlurb, type ProfLang } from '../../data/profectionReadings'

describe('computeProfection', () => {
  // Asc a 15° de Áries (signIndex 0). Nasc. 1990-06-15.
  const birth = '1990-06-15'
  const ascAries = 15

  it('idade 0 → Casa 1, signo do Asc', () => {
    const r = computeProfection(birth, ascAries, new Date('1990-09-01T12:00:00Z'))!
    expect(r.ageYears).toBe(0)
    expect(r.house).toBe(1)
    expect(r.signIndex).toBe(0) // Áries
    expect(r.timeLordPt).toBe('Marte') // regente de Áries
    expect(r.timeLordEn).toBe('mars')
  })

  it('idade 12 → volta pra Casa 1 (ciclo de 12)', () => {
    const r = computeProfection(birth, ascAries, new Date('2002-09-01T12:00:00Z'))!
    expect(r.ageYears).toBe(12)
    expect(r.house).toBe(1)
    expect(r.signIndex).toBe(0)
  })

  it('idade 7 → Casa 8, signo profeccional 7 casas à frente do Asc', () => {
    const r = computeProfection(birth, ascAries, new Date('1997-09-01T12:00:00Z'))!
    expect(r.ageYears).toBe(7)
    expect(r.house).toBe(8)
    expect(r.signIndex).toBe(7) // Áries + 7 = Escorpião
    expect(r.timeLordPt).toBe('Marte') // regente de Escorpião (tradicional)
  })

  it('aniversário ainda não passou no ano → conta ano a menos', () => {
    // 2026-06-14 é 1 dia antes do aniversário de 2026 → ainda tem 35, não 36.
    const r = computeProfection(birth, ascAries, new Date('2026-06-14T12:00:00Z'))!
    expect(r.ageYears).toBe(35)
    expect(r.house).toBe(12) // 35 % 12 = 11 → casa 12
  })

  it('profecção mensal avança a partir da casa do ano', () => {
    // Logo após o aniversário → mês 0 = casa do ano.
    const r = computeProfection(birth, ascAries, new Date('1997-06-16T12:00:00Z'))!
    expect(r.monthHouse).toBe(r.house)
  })

  it('Asc em Leão (signIndex 4) → senhor do ano na Casa 1 é o Sol', () => {
    const r = computeProfection(birth, 4 * 30 + 10, new Date('1990-09-01T12:00:00Z'))!
    expect(r.signIndex).toBe(4)
    expect(r.timeLordEn).toBe('sun')
  })

  it('dados inválidos → null', () => {
    expect(computeProfection(null, 15)).toBeNull()
    expect(computeProfection('1990-06-15', null as any)).toBeNull()
    expect(computeProfection('lixo', 15)).toBeNull()
  })
})

describe('profectionReadings', () => {
  const langs: ProfLang[] = ['pt-BR', 'en-US', 'es-ES', 'it-IT']

  it('as 12 casas têm título + corpo nos 4 idiomas', () => {
    for (let h = 1; h <= 12; h++) {
      for (const lang of langs) {
        const t = profectionHouseText(h, lang)
        expect(t, `casa ${h} ${lang}`).toBeTruthy()
        expect(t!.title.length).toBeGreaterThan(0)
        expect(t!.body.length).toBeGreaterThan(20)
      }
    }
  })

  it('os 7 senhores do ano têm blurb nos 4 idiomas', () => {
    for (const lord of ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn']) {
      for (const lang of langs) {
        expect(profectionLordBlurb(lord, lang).length, `${lord} ${lang}`).toBeGreaterThan(10)
      }
    }
  })

  it('en-US sem "will"; es-ES sem tildes; it-IT sem acentos', () => {
    for (let h = 1; h <= 12; h++) {
      const en = profectionHouseText(h, 'en-US')!
      expect(/\bwill\b/i.test(en.title + ' ' + en.body), `casa ${h} en tem "will"`).toBe(false)
      const es = profectionHouseText(h, 'es-ES')!
      expect(/[áéíóúñ¿¡]/i.test(es.title + ' ' + es.body), `casa ${h} es tem tilde`).toBe(false)
      const it = profectionHouseText(h, 'it-IT')!
      expect(/[àèéìòù]/i.test(it.title + ' ' + it.body), `casa ${h} it tem acento`).toBe(false)
    }
  })
})
