/**
 * Os textos de evento são o único lugar do fluxo escrito à mão.
 *
 * Tudo o mais é gerado; aqui alguém digita. Então o que estes testes protegem
 * não é cálculo, é o que o João já rejeitou por escrito — e rejeitou duas vezes,
 * porque na primeira eu consertei o texto e deixei a porta aberta para o
 * próximo entrar igual.
 */
import { describe, it, expect } from 'vitest'
// @ts-expect-error - módulo .mjs sem tipos
import { TEXTO_DO_EVENTO, chaveDoEvento, textoDoEvento } from '../textosEvento.mjs'

const TEXTOS: [string, string][] = Object.entries(TEXTO_DO_EVENTO as Record<string, string>)

describe('textos de evento', () => {
  it('tem texto escrito', () => {
    expect(TEXTOS.length).toBeGreaterThan(0)
  })

  /**
   * "quem se importa quantos graus ela anda um dia" — a frase dele.
   *
   * Mecânica de fenômeno é astronomia; a peça é de astrologia. A lista é
   * literal de propósito: quero que quebre em cima do que ele leu, não de uma
   * heurística minha sobre o que soa técnico.
   */
  it('não descreve a mecânica do fenômeno', () => {
    const proibido = [
      /graus? por dia/i, /\d+[,.]\d+°/, /a cada seis meses/i,
      /eixo dos nódulos/i, /lunaç(ão|ões)/i, /saros/i, /223/,
      /velocidade (aparente|média)/i, /perigeu|apogeu/i,
    ]
    for (const [chave, texto] of TEXTOS) {
      for (const p of proibido) {
        expect(`${chave}: ${texto}`).not.toMatch(p)
      }
    }
  })

  /** "nao use —" */
  it('não usa travessão', () => {
    for (const [chave, texto] of TEXTOS) {
      expect(`${chave}: ${texto}`).not.toContain('—')
    }
  })

  /**
   * Um texto de trânsito fala de um PERÍODO.
   *
   * É o que separa "o Sol em Virgem significa X" (catálogo natal, serve para
   * qualquer ano) de "por um mês o Sol atravessa Virgem" (o que muda agora).
   * Sem marca de tempo, o texto voltou a ser o do catálogo com outras palavras.
   *
   * Lunação não tem duração: é um instante. Para ela a marca é o "agora" — o
   * que a separa do natal não é o prazo, é o momento a que se refere.
   */
  it('marca o período do trânsito', () => {
    const tempo = /(por um mês|semanas?|meses|dias|período|enquanto|começa|fica |passa |agora|neste|nesta)/i
    for (const [chave, texto] of TEXTOS) {
      expect(tempo.test(texto), `sem marca de tempo em ${chave}`).toBe(true)
    }
  })

  /** Texto curto vira genérico; texto longo não cabe na peça. */
  it('cabe na peça sem virar recado', () => {
    for (const [chave, texto] of TEXTOS) {
      expect(texto.length, `${chave} curto demais`).toBeGreaterThan(220)
      expect(texto.length, `${chave} longo demais para o quadro`).toBeLessThan(460)
    }
  })

  it('a chave descreve um evento que o gerador produz', () => {
    for (const [chave] of TEXTOS) {
      expect(chave).toMatch(/^(ingresso|fase|retrogrado|direto):[^:]+:[^:]+$/)
    }
  })

  it('resolve pela forma do evento, e devolve null quando ninguém escreveu', () => {
    const sol = { tipo: 'ingresso', corpo: 'Sun', signo: 'Virgem' }
    expect(chaveDoEvento(sol)).toBe('ingresso:Sun:Virgem')
    expect(textoDoEvento(sol)).toContain('Virgem')

    // silêncio é resposta legítima: a peça avisa em vez de inventar
    expect(textoDoEvento({ tipo: 'ingresso', corpo: 'Pluto', signo: 'Peixes' })).toBeNull()
    expect(chaveDoEvento({ tipo: 'eclipse', luminar: 'solar', signo: 'Leão' })).toBeNull()
  })
})
