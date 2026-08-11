/**
 * O carrossel dos doze ascendentes.
 *
 * Três defeitos chegaram até a peça pronta e só apareceram quando alguém olhou
 * o PNG: "A quarto minguante" (concordância), o texto do catálogo NATAL num
 * slide sobre uma sexta-feira, e a capa anunciando "1 evento no céu esta
 * semana". Este arquivo é para que os três quebrem antes de virar imagem.
 */
import { describe, it, expect } from 'vitest'
// @ts-expect-error - módulos .mjs sem tipos
import { semanaPorSigno, capaDaSemana, ORDEM_SIGNOS } from '../vozSemana.mjs'
// @ts-expect-error - módulos .mjs sem tipos
import { CASA_EM_TRANSITO } from '../textosCasa.mjs'

const SEXTA = new Date('2026-09-04T15:00:00Z')

const fase = (nome: string, signo: string) => ({
  tipo: 'fase', fase: nome, signo, quando: SEXTA, peso: 60,
})

const ingresso = () => ({
  tipo: 'ingresso', corpo: 'Sun', corpoPt: 'Sol', signo: 'Virgem',
  quando: SEXTA, peso: 92,
})

describe('leitura da semana por ascendente', () => {
  it('concorda o artigo com a fase', () => {
    // os dois quartos são masculinos; "a quarto minguante" saiu numa peça
    for (const [nome, artigo] of [
      ['Quarto Minguante', 'O'], ['Quarto Crescente', 'O'],
      ['Lua Nova', 'A'], ['Lua Cheia', 'A'],
    ]) {
      const l = semanaPorSigno([fase(nome, 'Gêmeos')], 'Câncer')
      expect(l.texto.startsWith(`${artigo} ${nome.toLowerCase()}`), `${nome}: ${l.texto.slice(0, 30)}`).toBe(true)
    }
  })

  /**
   * O catálogo natal descreve quem NASCEU com o planeta ali, para a vida toda.
   * Estas frases vieram dele e chegaram à peça: se voltarem, o slide volta a
   * falar de outra coisa.
   */
  it('não usa o texto do catálogo natal', () => {
    const natal = [/\bna Casa \d+\b/, /desde a inf[âa]ncia/i, /a pessoa (tende|costuma)/i]
    for (const signo of ORDEM_SIGNOS) {
      const l = semanaPorSigno([fase('Quarto Minguante', 'Gêmeos')], signo)
      for (const p of natal) expect(`${signo}: ${l.texto}`).not.toMatch(p)
    }
  })

  it('dá casa e texto diferentes a cada ascendente', () => {
    const leituras = ORDEM_SIGNOS.map((s: string) => semanaPorSigno([ingresso()], s))
    expect(new Set(leituras.map((l: any) => l.casa)).size).toBe(12)
    // o corpo do slide muda junto com a casa: doze textos, não doze rótulos
    expect(new Set(leituras.map((l: any) => l.texto)).size).toBe(12)
  })

  it('diz uma casa que existe, e a mesma no olho e no corpo', () => {
    for (const signo of ORDEM_SIGNOS) {
      const l = semanaPorSigno([ingresso()], signo)
      expect(l.casa).toBeGreaterThanOrEqual(1)
      expect(l.casa).toBeLessThanOrEqual(12)
      expect(l.texto).toContain(`sua casa ${l.casa}`)
      expect(l.texto).toContain(CASA_EM_TRANSITO[l.casa])
    }
  })

  /** Um assunto por peça: o segundo evento da semana não entra no slide. */
  it('fala de um evento só', () => {
    const l = semanaPorSigno([ingresso(), fase('Lua Nova', 'Leão')], 'Áries')
    expect(l.texto).toContain('Virgem')
    expect(l.texto).not.toContain('Leão')
    expect(l.extras).toEqual([])
  })

  it('não usa travessão', () => {
    for (const signo of ORDEM_SIGNOS) {
      expect(semanaPorSigno([ingresso()], signo).texto).not.toContain('—')
    }
  })
})

describe('capa da semana', () => {
  const inicio = new Date('2026-08-31T03:00:00Z')
  const fim = new Date('2026-09-07T03:00:00Z')

  /** "1 evento no céu esta semana": contagem não é assunto. */
  it('anuncia o evento, não quantos são', () => {
    const capa = capaDaSemana([fase('Quarto Minguante', 'Gêmeos')], inicio, fim)
    expect(capa.texto).toContain('quarto minguante em Gêmeos')
    expect(capa.texto).not.toMatch(/\d+ eventos?/)
  })

  it('escolhe o evento de maior peso, não o primeiro da lista', () => {
    const fraco = { ...fase('Lua Nova', 'Leão'), peso: 40 }
    const forte = { ...ingresso(), peso: 92 }
    const capa = capaDaSemana([fraco, forte], inicio, fim)
    expect(capa.texto).toContain('Virgem')
    expect(capa.texto).not.toContain('Leão')
  })

  it('diz o período uma vez só', () => {
    const capa = capaDaSemana([ingresso()], inicio, fim)
    expect(capa.periodo).toBe('31 de agosto a 6 de setembro')
    expect(capa.texto).not.toContain(capa.periodo)
  })
})
