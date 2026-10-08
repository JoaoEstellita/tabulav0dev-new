import { describe, it, expect } from 'vitest'
import { calcularRaios, glifosQueCabem, FRACAO, MARGEM_DO_QUADRO } from '../raiosDaRoda'

/**
 * A conta do espaço da roda.
 *
 * Bug visto na tela: planetas natais sobrepostos na bi-roda. A causa não era a
 * anti-colisão — era que não havia espaço para ela trabalhar. A faixa onde um
 * glifo pode se afastar radialmente media 17px, com passo de 23px: não cabia
 * nem um nível de empilhamento, então o clamp juntava o aglomerado inteiro no
 * mesmo raio.
 *
 * Nada disso aparece em teste de render nem em typecheck — é aritmética de
 * layout, e o único jeito de ver era medindo. Agora é medido aqui.
 */

// Tamanhos reais de tela, incluindo os quebrados: o arredondamento do disco
// para pixel inteiro faz a conta fechar num e falhar no vizinho.
const TAMANHOS = [320, 340, 360, 380, 400, 420, 440]

describe('faixa dos planetas natais', () => {
  it('comporta um aglomerado de 3 na bi-roda', () => {
    // Três planetas no mesmo grau acontecem toda hora (stellium, Lua rápida
    // alcançando dois lentos). Se três não cabem, a roda se sobrepõe no uso
    // normal, não num caso raro.
    for (const t of TAMANHOS) {
      const r = calcularRaios(t, true)
      expect(glifosQueCabem(r), `bi-roda em ${t}px comporta só ${glifosQueCabem(r)} glifos`).toBeGreaterThanOrEqual(3)
    }
  })

  it('comporta ainda mais na roda sozinha, que tem mais espaço', () => {
    for (const t of TAMANHOS) {
      const r = calcularRaios(t, false)
      expect(glifosQueCabem(r), `roda natal em ${t}px`).toBeGreaterThanOrEqual(3)
    }
  })

  it('a faixa é positiva e o raio padrão fica DENTRO dela', () => {
    // Raio padrão fora da faixa faria todo glifo nascer clampado.
    for (const t of TAMANHOS) {
      for (const bi of [true, false]) {
        const r = calcularRaios(t, bi)
        expect(r.faixaNatal.max, `${t}/${bi}`).toBeGreaterThan(r.faixaNatal.min)
        expect(r.planet).toBeGreaterThanOrEqual(r.faixaNatal.min)
        expect(r.planet).toBeLessThanOrEqual(r.faixaNatal.max)
      }
    }
  })
})

describe('nada vaza para fora do quadro', () => {
  it('o anel de trânsito cabe, com o glifo inteiro', () => {
    // R_TRANSIT não leva escala: é o que mais se aproxima da borda.
    for (const t of TAMANHOS) {
      const r = calcularRaios(t, true)
      expect(r.transit + r.discTransit, `trânsito estoura em ${t}px`).toBeLessThanOrEqual(t / 2)
    }
  })

  it('o zodíaco não invade o anel de trânsito', () => {
    // Se o zodíaco crescer até o anel de fora, os dois se sobrepõem e a
    // bi-roda vira uma mancha.
    for (const t of TAMANHOS) {
      const r = calcularRaios(t, true)
      expect(r.outer, `zodíaco encosta no trânsito em ${t}px`).toBeLessThan(r.transit - r.discTransit)
    }
  })

  it('a roda sozinha cabe no quadro', () => {
    for (const t of TAMANHOS) {
      const r = calcularRaios(t, false)
      expect(r.outer).toBeLessThanOrEqual(t * MARGEM_DO_QUADRO)
    }
  })
})

describe('a ordem dos anéis nunca inverte', () => {
  it('de fora para dentro: zodíaco, casas, planetas, miolo', () => {
    for (const t of TAMANHOS) {
      for (const bi of [true, false]) {
        const r = calcularRaios(t, bi)
        const ordem = [r.outer, r.zodiacIn, r.houseOut, r.houseIn, r.planet, r.inner]
        const decrescente = ordem.every((v, i) => i === 0 || v < ordem[i - 1])
        expect(decrescente, `${t}/${bi}: ${ordem.join(' > ')}`).toBe(true)
      }
    }
  })

  it('as frações declaradas já estão em ordem', () => {
    expect(FRACAO.outer).toBeGreaterThan(FRACAO.zodiacIn)
    expect(FRACAO.zodiacIn).toBeGreaterThan(FRACAO.houseOut)
    expect(FRACAO.houseOut).toBeGreaterThan(FRACAO.houseIn)
    expect(FRACAO.houseIn).toBeGreaterThan(FRACAO.planet)
    expect(FRACAO.planet).toBeGreaterThan(FRACAO.inner)
  })
})
