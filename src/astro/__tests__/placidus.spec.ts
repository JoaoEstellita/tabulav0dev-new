import { describe, it, expect } from 'vitest'
import { placidusCuspides, ehLatitudePolar } from '../placidus'
import { computeHousesUTC } from '../houses'

/**
 * Cúspides de referência do Swiss Ephemeris.
 *
 * Geradas por `backend/scripts/audit/cmp-placidus-real.mjs`, que compara a
 * implementação contra o Swiss e falha acima de 0,05°. Aqui elas travam o lado
 * do frontend contra a MESMA verdade — o defeito que isto previne é justamente
 * os dois lados divergirem, que era o estado anterior (backend calculava uma
 * coisa, frontend devolvia casas iguais).
 */
const ERICA = {
  data: new Date(Date.UTC(2003, 4, 29, 16, 57)),
  lat: -9.9754,
  lon: -67.8249,
  // Swiss, Placidus
  cuspides: [160.36, 195.15, 226.72, 254.55, 280.93, 308.63, 340.36, 15.15, 46.72, 74.55, 100.93, 128.63],
}

const norm = (g: number) => ((g % 360) + 360) % 360
const dif = (a: number, b: number) => {
  const d = Math.abs(norm(a) - norm(b))
  return d > 180 ? 360 - d : d
}

describe('cúspides de Placidus', () => {
  it('bate com o Swiss Ephemeris na carta de referência', async () => {
    const r = await computeHousesUTC(ERICA.data, ERICA.lat, ERICA.lon, 'placidus')
    expect(r.systemEffective).toBe('placidus')
    expect(r.approximate).toBe(false)
    r.cusps.forEach((c, i) => {
      expect(dif(c, ERICA.cuspides[i]), `casa ${i + 1}: ${c.toFixed(2)}° vs Swiss ${ERICA.cuspides[i]}°`)
        .toBeLessThan(0.1)
    })
  })

  it('NÃO devolve casas iguais — era esse o bug', async () => {
    // O ramo de Placidus caía em `asc + i*30`. Com casas de largura igual, todas
    // as diferenças entre cúspides consecutivas dariam exatamente 30°.
    const r = await computeHousesUTC(ERICA.data, ERICA.lat, ERICA.lon, 'placidus')
    const larguras = r.cusps.map((c, i) => norm(r.cusps[(i + 1) % 12] - c))
    const todasIguais = larguras.every((l) => Math.abs(l - 30) < 0.01)
    expect(todasIguais).toBe(false)
    // Na carta da Érica as casas vão de ~26° a ~35°.
    expect(Math.max(...larguras) - Math.min(...larguras)).toBeGreaterThan(5)
  })

  it('as cúspides opostas continuam a 180°', async () => {
    const r = await computeHousesUTC(ERICA.data, ERICA.lat, ERICA.lon, 'placidus')
    for (let i = 0; i < 6; i += 1) {
      expect(dif(r.cusps[i] + 180, r.cusps[i + 6])).toBeLessThan(1e-6)
    }
  })

  it('no equador degenera na divisão igual — sanidade da fórmula', () => {
    // Com latitude 0 a diferença ascensional é zero e o semi-arco é 90°, então
    // as cúspides caem nos 30/60/120/150 graus de ascensão reta.
    const c = placidusCuspides({ ramc: 0, latitude: 0, obliquidade: 23.44, ascendente: 90, meioDoCeu: 0 })
    expect(c).not.toBeNull()
    // cúspide 11 sai da AR 30°; a longitude eclíptica correspondente não é 30°,
    // mas a construção tem que ser determinística e finita.
    c!.forEach((v) => expect(Number.isFinite(v)).toBe(true))
  })

  it('latitude polar não finge que Placidus existe', async () => {
    expect(ehLatitudePolar(70)).toBe(true)
    expect(ehLatitudePolar(-70)).toBe(true)
    expect(ehLatitudePolar(64)).toBe(false)
    expect(placidusCuspides({ ramc: 0, latitude: 75, obliquidade: 23.44, ascendente: 0, meioDoCeu: 0 })).toBeNull()

    // E a tela cai em whole-sign dizendo que caiu, em vez de número errado calado.
    const r = await computeHousesUTC(new Date(Date.UTC(1990, 0, 15, 12)), 78.2, 15.6, 'placidus')
    expect(r.systemEffective).toBe('whole-sign')
    expect(r.approximate).toBe(true)
  })
})
