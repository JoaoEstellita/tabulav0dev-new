import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { pontoDoMovimento, pontoNoEixo, fracaoDoValor, type EixoDaRoda } from '../geometriaDaRoda'

const RODA = readFileSync(
  join(__dirname, '..', '..', 'components', 'RodaDeStatus.tsx'),
  'utf-8',
)

const CENTRO = { x: 100, y: 100 }
const RAIO = 80
const eixo = (valor: number | null, movimento?: number | null): EixoDaRoda =>
  ({ chave: 'x', rotulo: 'X', valor, movimento })

describe('o raio do movimento', () => {
  /**
   * ⚠️ O MOVIMENTO NUNCA PASSA DO VALOR.
   *
   * O raio vai do centro até o valor; o trecho aceso é a fatia dele que se
   * mexe. Se o aceso passasse do vértice, a linha sairia para fora do polígono
   * e deixaria de significar "parte de" — viraria uma segunda medida solta,
   * que é exatamente o problema do polígono de sombra que isto substituiu.
   */
  it('fica sempre entre o centro e o vértice', () => {
    const dist = (p: { x: number; y: number }) => Math.hypot(p.x - CENTRO.x, p.y - CENTRO.y)
    for (const valor of [0, 20, 50, 100]) {
      for (const mov of [0, 25, 50, 100]) {
        const fim = pontoNoEixo(0, 8, fracaoDoValor(valor), RAIO, CENTRO)
        const m = pontoDoMovimento(eixo(valor, mov), 0, 8, RAIO, CENTRO)
        expect(dist(m), `valor ${valor} mov ${mov}`).toBeLessThanOrEqual(dist(fim) + 0.001)
      }
    }
  })

  it('movimento 100 encosta no vértice; 0 colapsa no centro', () => {
    const fim = pontoNoEixo(0, 8, fracaoDoValor(60), RAIO, CENTRO)
    const cheio = pontoDoMovimento(eixo(60, 100), 0, 8, RAIO, CENTRO)
    expect(cheio.x).toBeCloseTo(fim.x, 5)
    expect(cheio.y).toBeCloseTo(fim.y, 5)

    const vazio = pontoDoMovimento(eixo(60, 0), 0, 8, RAIO, CENTRO)
    expect(vazio.x).toBeCloseTo(CENTRO.x, 5)
    expect(vazio.y).toBeCloseTo(CENTRO.y, 5)
  })

  /**
   * ⚠️ Sem movimento conhecido o raio fica APAGADO, não cheio. Desenhá-lo
   * inteiro afirmaria "tudo se mexe" quando a verdade é "não sabemos", que é o
   * mesmo erro de pintar área sem dado como zero (e sair vermelha).
   */
  it('sem movimento, colapsa no centro em vez de encher', () => {
    for (const m of [null, undefined, NaN, 'abc' as any]) {
      const p = pontoDoMovimento(eixo(60, m as any), 0, 8, RAIO, CENTRO)
      expect(p.x, String(m)).toBeCloseTo(CENTRO.x, 5)
    }
  })
})

/**
 * ⚠️ ESTES TESTES LEEM O FONTE, e isso é deliberado: em SVG quem vem depois
 * ganha, e camada demais é o defeito que esta roda teve desde o começo. Nenhum
 * teste de valor pega "o desenho ficou ilegível".
 */
describe('o desenho da roda', () => {
  /**
   * O crítico é uma ZONA, não um traço. Linha não diz de que lado fica o ruim;
   * mancha diz, e sem legenda. Se o `fill` sair, volta a ser um contorno
   * tracejado que ninguém sabe ler.
   */
  it('a zona crítica é preenchida, não só contornada', () => {
    expect(RODA).toContain('points={geo.critico} fill={CORES.critico}')
  })

  /**
   * ⚠️ Seis anéis concêntricos e nenhum dizia um número. E o anel do BOM quase
   * nunca era cruzado: medido em 60 pessoas, 7% dos valores passam de 62
   * contra 28% abaixo de 35. Linha que ninguém toca não ensina, só polui.
   */
  it('as teias e o anel do "bom" não voltaram', () => {
    expect(RODA, 'as teias 25/50/75 voltaram').not.toContain('geo.teias')
    expect(RODA, 'o anel do bom voltou').not.toContain('geo.bom')
  })

  /**
   * O movimento é LINHA sobre o raio, não polígono. Como segunda silhueta ele
   * lia como dois gráficos concorrentes — e antes disso nem aparecia, porque
   * era desenhado atrás do preenchimento do principal.
   */
  it('o movimento é raio aceso, não um segundo polígono', () => {
    expect(RODA, 'o polígono de sombra voltou').not.toContain('geo.sombra')
    expect(RODA).toContain('geo.raios.map')
    expect(RODA, 'o raio tem de ser Line').toMatch(/<Line[\s\S]{0,200}stroke=\{MOVIMENTO\}/)
  })

  /** Quatro círculos por vértice eram trinta e dois na tela, para marcar oito. */
  it('o vértice usa dois círculos, não quatro', () => {
    const circulos = (RODA.match(/<Circle\s/g) || []).length
    expect(circulos, `achei ${circulos} <Circle> no fonte`).toBeLessThanOrEqual(2)
  })
})
