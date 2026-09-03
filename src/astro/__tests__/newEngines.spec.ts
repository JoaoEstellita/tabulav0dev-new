// Testes de VALOR dos motores novos (funções puras) — verifica contra regras
// clássicas conhecidas, além do typecheck. Cobre dignidade, Navamsa e relações de
// animais chineses (Gochara/sinastria). Não usa efeméride (só índices).
import { describe, it, expect } from 'vitest'
import { computeDignity } from '../vedic/dignity'
import { navamsaRashi } from '../vedic/navamsa'
import { buildAntardashas, type DashaPeriod } from '../vedic/dasha'
import { animalRelation } from '../chinese/chineseTransit'
import { navamsaSynastry } from '../../data/vedic/navamsaSynastry'

// Índices de rashi: 0=Áries … 11=Peixes.
describe('dignidade védica', () => {
  it('exaltações clássicas', () => {
    expect(computeDignity('Sun', 0)).toBe('exalted')      // Sol em Áries
    expect(computeDignity('Saturn', 6)).toBe('exalted')   // Saturno em Libra
    expect(computeDignity('Jupiter', 3)).toBe('exalted')  // Júpiter em Câncer
    expect(computeDignity('Venus', 11)).toBe('exalted')   // Vênus em Peixes
  })
  it('debilitações (7º da exaltação)', () => {
    expect(computeDignity('Sun', 6)).toBe('debilitated')  // Sol em Libra
    expect(computeDignity('Saturn', 0)).toBe('debilitated') // Saturno em Áries
    expect(computeDignity('Jupiter', 9)).toBe('debilitated') // Júpiter em Capricórnio
  })
  it('signo próprio', () => {
    expect(computeDignity('Sun', 4)).toBe('own')          // Sol em Leão
    expect(computeDignity('Mars', 7)).toBe('own')         // Marte em Escorpião
    expect(computeDignity('Saturn', 10)).toBe('own')      // Saturno em Aquário
  })
  it('amigo/inimigo pelo regente do signo', () => {
    // Sol em Câncer (regente Lua, amiga do Sol) → amigo
    expect(computeDignity('Sun', 3)).toBe('friend')
    // Sol em Capricórnio (regente Saturno, inimigo do Sol) → inimigo
    expect(computeDignity('Sun', 9)).toBe('enemy')
  })
})

describe('Navamsa (D9)', () => {
  it('início do signo móvel = próprio signo (D9 do 1º navamsa de Áries = Áries)', () => {
    expect(navamsaRashi(0.5)).toBe(0)   // ~0°30' Áries → D9 Áries
  })
  it('signo fixo começa no 9º signo (0° Touro → D9 Capricórnio)', () => {
    expect(navamsaRashi(30.5)).toBe(9)  // início de Touro (fixo) → D9 Capricórnio (índice 9)
  })
  it('signo dual começa no 5º signo (0° Gêmeos → D9 Libra)', () => {
    expect(navamsaRashi(60.5)).toBe(6)  // início de Gêmeos (dual) → D9 Libra (índice 6)
  })
  it('último navamsa de um signo (≈29°) avança 8 casas do início', () => {
    expect(navamsaRashi(29.9)).toBe(8)  // fim de Áries: início 0 + navamsa 8 = índice 8 (Sagitário)
  })
})

describe('relações de animais chinesas', () => {
  it('choque (Chong) — Rato × Cavalo', () => { expect(animalRelation(0, 6)).toBe('clash') })
  it('amigo secreto (Liu He) — Rato × Boi', () => { expect(animalRelation(0, 1)).toBe('secret-friend') })
  it('aliados (San He) — Rato × Dragão × Macaco', () => {
    expect(animalRelation(0, 4)).toBe('ally')
    expect(animalRelation(4, 8)).toBe('ally')
  })
  it('mesmo animal', () => { expect(animalRelation(3, 3)).toBe('same') })
})

describe('Antardasha (Bhukti)', () => {
  it('9 sub-períodos que somam a Mahadasha', () => {
    const maha: DashaPeriod = { lord: 'jupiter', start: new Date('2020-01-01'), end: new Date('2036-01-01') }
    const antars = buildAntardashas(maha)
    expect(antars.length).toBe(9)
    expect(antars[0].lord).toBe('jupiter') // começa pelo lorde da Maha
    expect(antars[0].start.getTime()).toBe(maha.start.getTime())
    expect(antars[8].end.getTime()).toBe(maha.end.getTime()) // fecha no fim da Maha
  })
})

describe('Navamsa synastry', () => {
  it('mesmo D9 → excelente', () => {
    const r = navamsaSynastry(0.5, 0.5, 'pt-BR') // ambos D9 Áries
    expect(r?.level).toBe('excellent')
  })
  it('null se faltar dado', () => {
    expect(navamsaSynastry(null, 10, 'pt-BR')).toBeNull()
  })
})
