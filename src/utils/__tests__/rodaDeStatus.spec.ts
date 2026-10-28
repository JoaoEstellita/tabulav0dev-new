import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import {
  pontoDoMovimento,
  pontoNoEixo,
  fracaoDoValor,
  barraNoEixo,
  fracaoDoEixoSecundario,
  type EixoDaRoda,
} from '../geometriaDaRoda'

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
   * ⚠️ OS DOIS LIMIARES SÃO LINHA TRACEJADA, não mancha.
   *
   * Houve uma versão que pintou o crítico como ZONA vermelha. Lia melhor de
   * longe e perdeu o resto: uma área grande de cor no meio do gráfico virou o
   * assunto da tela, competindo com o polígono e com os raios num desenho que
   * existia justamente para mostrar três medidas por eixo.
   */
  it('crítico e favorável são anéis tracejados, não manchas', () => {
    expect(RODA, 'o crítico virou mancha de novo').not.toMatch(/points=\{geo\.critico\}\s+fill=\{CORES/)
    for (const anel of ['geo.critico', 'geo.bom']) {
      expect(RODA, `${anel} sumiu`).toContain(anel)
    }
    expect((RODA.match(/strokeDasharray="2 5"/g) || []).length, 'os dois limiares têm de ser tracejados')
      .toBeGreaterThanOrEqual(2)
  })

  /**
   * ⚠️ As teias seguem fora. Elas não marcavam número nenhum — a escala quem dá
   * é o número no chip —, e seis anéis concêntricos era o que deixava o desenho
   * ilegível.
   */
  it('as três teias não voltaram', () => {
    expect(RODA, 'as teias 25/50/75 voltaram').not.toContain('geo.teias')
  })

  /**
   * ⚠️ AS DUAS BARRAS SAEM DO MESMO PONTO, lado a lado.
   *
   * Houve uma versão em que a atenção crescia do vértice para a BORDA, na
   * direção oposta à do movimento. Lia como espigão: oito deles viravam uma
   * estrela laranja maior que o próprio polígono, e o que era medida virou
   * moldura. Partindo juntas, as duas se comparam direto — a mais longa é a
   * que manda naquela área.
   */
  it('movimento e atenção saem os dois do centro, deslocados', () => {
    expect(RODA, 'a atenção voltou a crescer do vértice').not.toContain('r.fim')
    for (const eixo of ['movimento', 'atencao']) {
      expect(RODA).toContain(`x1={r.${eixo}.inicio.x}`)
      expect(RODA).toContain(`x2={r.${eixo}.fim.x}`)
    }
    // Um para cada lado da linha do eixo: sem sinais opostos elas se sobrepõem.
    expect(RODA).toContain('giro, -DESLOCAMENTO)')
    expect(RODA).toContain('giro, DESLOCAMENTO)')
  })

  /**
   * ⚠️ As cores dos dois eixos vêm de `STATUS_AXIS_COLORS` — as mesmas das
   * barras M/A nas fichas de grupo. Uma versão inventou um violeta local: a
   * mesma grandeza com duas cores em duas telas, e o violeta claro ainda lia
   * como branco sobre o fundo escuro.
   */
  it('as cores dos eixos vêm da fonte única do projeto', () => {
    expect(RODA).toContain('STATUS_AXIS_COLORS.movement')
    expect(RODA).toContain('STATUS_AXIS_COLORS.attention')
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

  /**
   * ⚠️ Nada de linha-guia do centro a cada vértice. Oito delas viravam uma
   * estrela clara no meio do desenho, mais chamativa que o próprio dado — foi
   * a queixa que trouxe esta versão.
   */
  it('não há linha-guia até o vértice', () => {
    expect(RODA, 'a estrela de linhas-guia voltou').not.toMatch(/x2=\{r\.fim\.x\}[\s\S]{0,160}stroke=\{ACENTO\}/)
  })

  /** Quatro círculos por vértice eram trinta e dois na tela, para marcar oito. */
  it('o vértice usa dois círculos, não quatro', () => {
    const circulos = (RODA.match(/<Circle\s/g) || []).length
    expect(circulos, `achei ${circulos} <Circle> no fonte`).toBeLessThanOrEqual(2)
  })
})

describe('as barras paralelas de movimento e atenção', () => {
  const dist = (p: { x: number; y: number }, q: { x: number; y: number }) =>
    Math.hypot(p.x - q.x, p.y - q.y)

  /**
   * ⚠️ A BARRA É FATIA DA NOTA, não a nota do eixo secundário.
   *
   * Movimento e atenção são 0–100 na própria escala. Desenhados crus, uma área
   * de nota 18 com movimento 90 teria uma barra maior que o próprio polígono —
   * a parte passando o todo.
   */
  it('a barra nunca passa do ponto da nota', () => {
    for (const valor of [10, 44, 78, 100]) {
      for (const eixo of [0, 30, 70, 100]) {
        const nota = pontoNoEixo(0, 8, fracaoDoValor(valor), RAIO, CENTRO)
        const b = barraNoEixo(0, 8, fracaoDoEixoSecundario(valor, eixo), RAIO, CENTRO, 0, 0)
        expect(dist(CENTRO, b.fim), `nota ${valor} eixo ${eixo}`)
          .toBeLessThanOrEqual(dist(CENTRO, nota) + 0.001)
      }
    }
  })

  it('eixo em 100 encosta na nota; em 0 fica no centro', () => {
    const nota = pontoNoEixo(0, 8, fracaoDoValor(60), RAIO, CENTRO)
    const cheia = barraNoEixo(0, 8, fracaoDoEixoSecundario(60, 100), RAIO, CENTRO, 0, 0)
    expect(cheia.fim.x).toBeCloseTo(nota.x, 5)
    const vazia = barraNoEixo(0, 8, fracaoDoEixoSecundario(60, 0), RAIO, CENTRO, 0, 0)
    expect(dist(CENTRO, vazia.fim)).toBeCloseTo(0, 5)
  })

  /**
   * ⚠️ O DESLOCAMENTO É PERPENDICULAR, e as duas barras ficam PARALELAS.
   *
   * Girar a segunda em vez de deslocá-la faria o par abrir num V, e o ângulo
   * passaria a parecer dado — um gráfico dizendo algo que ninguém quis dizer.
   */
  it('as duas barras são paralelas e não se sobrepõem', () => {
    const a = barraNoEixo(0, 8, 0.6, RAIO, CENTRO, 0, -2.5)
    const b = barraNoEixo(0, 8, 0.6, RAIO, CENTRO, 0, 2.5)
    // Mesma direção: o vetor de uma é igual ao da outra.
    const va = { x: a.fim.x - a.inicio.x, y: a.fim.y - a.inicio.y }
    const vb = { x: b.fim.x - b.inicio.x, y: b.fim.y - b.inicio.y }
    expect(va.x).toBeCloseTo(vb.x, 5)
    expect(va.y).toBeCloseTo(vb.y, 5)
    // E separadas pelo dobro do deslocamento.
    expect(dist(a.inicio, b.inicio)).toBeCloseTo(5, 5)
  })

  it('eixo ausente ou torto não desenha nada', () => {
    for (const v of [null, undefined, NaN, 'abc' as any]) {
      expect(fracaoDoEixoSecundario(60, v as any), String(v)).toBe(0)
    }
  })

  it('sem nota não há fatia da nota', () => {
    expect(fracaoDoEixoSecundario(null, 90)).toBe(0)
  })
})
