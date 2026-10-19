import { describe, it, expect } from 'vitest'
import {
  anguloDoEixo,
  fracaoDoValor,
  pontoNoEixo,
  poligonoDosValores,
  anelDeReferencia,
  paraPoints,
  rotuloDoEixo,
  corDoValor,
} from '../geometriaDaRoda'

const CENTRO = { x: 100, y: 100 }
const RAIO = 80
const perto = (a: number, b: number, tol = 0.01) => Math.abs(a - b) < tol

describe('geometria da roda de status', () => {
  // ⚠️ Sem o -90° o primeiro eixo nasceria na direita e a figura inteira
  // pareceria girada — uma roda de atributos se lê a partir do topo.
  it('o primeiro eixo fica no TOPO e a volta é horária', () => {
    const topo = pontoNoEixo(0, 4, 1, RAIO, CENTRO)
    expect(perto(topo.x, CENTRO.x)).toBe(true)
    expect(perto(topo.y, CENTRO.y - RAIO)).toBe(true)

    const direita = pontoNoEixo(1, 4, 1, RAIO, CENTRO)
    expect(perto(direita.x, CENTRO.x + RAIO)).toBe(true)
    expect(perto(direita.y, CENTRO.y)).toBe(true)
  })

  it('os eixos são igualmente espaçados', () => {
    const n = 8
    const passo = (Math.PI * 2) / n
    for (let i = 1; i < n; i++) {
      expect(perto(anguloDoEixo(i, n) - anguloDoEixo(i - 1, n), passo)).toBe(true)
    }
  })

  // Valor 0 no centro e 100 na borda é o contrato que torna a figura
  // comparável entre dias. Auto-escalar quebraria isso.
  it('0 cai no centro, 100 na borda, e o que passa disso é preso', () => {
    expect(fracaoDoValor(0)).toBe(0)
    expect(fracaoDoValor(100)).toBe(1)
    expect(fracaoDoValor(50)).toBe(0.5)
    expect(fracaoDoValor(130)).toBe(1)
    expect(fracaoDoValor(-20)).toBe(0)

    const centro = pontoNoEixo(0, 8, fracaoDoValor(0), RAIO, CENTRO)
    expect(perto(centro.x, CENTRO.x) && perto(centro.y, CENTRO.y)).toBe(true)
  })

  // ⚠️ Nulo, undefined e lixo viram 0 — nunca NaN. Um NaN no `points` do SVG
  // não desenha nada e não avisa: a roda sumiria em silêncio.
  it('valor ausente ou inválido vira 0, nunca NaN', () => {
    for (const v of [null, undefined, NaN, 'abc' as any, {} as any]) {
      expect(fracaoDoValor(v), String(v)).toBe(0)
    }
    const pts = poligonoDosValores(
      [{ chave: 'a', rotulo: 'A', valor: null }, { chave: 'b', rotulo: 'B', valor: 50 }],
      RAIO, CENTRO,
    )
    expect(paraPoints(pts)).not.toMatch(/NaN/)
  })

  it('o polígono tem um vértice por eixo, na ordem recebida', () => {
    const eixos = Array.from({ length: 8 }, (_, i) => ({ chave: `e${i}`, rotulo: `E${i}`, valor: 50 }))
    const pts = poligonoDosValores(eixos, RAIO, CENTRO)
    expect(pts).toHaveLength(8)
    // Todos a meio caminho do centro: 50 de 100.
    for (const p of pts) {
      const d = Math.hypot(p.x - CENTRO.x, p.y - CENTRO.y)
      expect(perto(d, RAIO / 2)).toBe(true)
    }
  })

  // ⚠️ O anel é POLÍGONO, não círculo: num radar o valor mora no vértice, e um
  // anel circular passaria por dentro das arestas — um valor que encosta no
  // limiar pareceria estar abaixo dele.
  it('o anel de referência tem os mesmos vértices do polígono naquela fração', () => {
    const anel = anelDeReferencia(0.35, 8, RAIO, CENTRO)
    const valores = poligonoDosValores(
      Array.from({ length: 8 }, (_, i) => ({ chave: `e${i}`, rotulo: '', valor: 35 })),
      RAIO, CENTRO,
    )
    expect(anel).toHaveLength(8)
    anel.forEach((p, i) => {
      expect(perto(p.x, valores[i].x) && perto(p.y, valores[i].y), `vértice ${i}`).toBe(true)
    })
  })

  // ⚠️ Oito rótulos num celular estreito: sem ancoragem por lado, os das
  // laterais invadem o desenho ou saem da tela.
  it('o rótulo ancora pelo lado da roda em que está', () => {
    const n = 8
    const topo = rotuloDoEixo(0, n, RAIO, CENTRO, 14)
    const direita = rotuloDoEixo(2, n, RAIO, CENTRO, 14)
    const baixo = rotuloDoEixo(4, n, RAIO, CENTRO, 14)
    const esquerda = rotuloDoEixo(6, n, RAIO, CENTRO, 14)

    expect(topo.ancora).toBe('middle')
    expect(baixo.ancora).toBe('middle')
    expect(direita.ancora).toBe('start')
    expect(esquerda.ancora).toBe('end')
    // E fica FORA do desenho, senão cobre o polígono.
    expect(Math.hypot(direita.x - CENTRO.x, direita.y - CENTRO.y)).toBeGreaterThan(RAIO)
  })

  it('a cor segue as mesmas faixas dos cards, e o vazio tem cor própria', () => {
    const lim = { criticalBelow: 35, positiveAbove: 62 }
    const cores = { critico: 'C', moderado: 'M', bom: 'B', vazio: 'V' }
    expect(corDoValor(10, lim, cores)).toBe('C')
    expect(corDoValor(34.9, lim, cores)).toBe('C')
    expect(corDoValor(35, lim, cores)).toBe('M')
    expect(corDoValor(61.9, lim, cores)).toBe('M')
    expect(corDoValor(62, lim, cores)).toBe('B')
    // ⚠️ Este caso reprovou a primeira versão: `Number(null)` e ZERO e
    // `isFinite(0)` e true, entao a area sem dado saia vermelha de critico.
    expect(corDoValor(null, lim, cores)).toBe('V')
    expect(corDoValor(undefined, lim, cores)).toBe('V')
    expect(corDoValor('' as any, lim, cores)).toBe('V')
    expect(corDoValor(NaN, lim, cores)).toBe('V')
    // E zero DE VERDADE continua sendo critico, nao vazio.
    expect(corDoValor(0, lim, cores)).toBe('C')
  })

  // Os limiares vêm do backend em runtime; a roda não pode ter régua própria.
  it('mudar o limiar move a faixa, sem a roda saber dos números', () => {
    const cores = { critico: 'C', moderado: 'M', bom: 'B', vazio: 'V' }
    expect(corDoValor(50, { criticalBelow: 35, positiveAbove: 62 }, cores)).toBe('M')
    expect(corDoValor(50, { criticalBelow: 35, positiveAbove: 45 }, cores)).toBe('B')
    expect(corDoValor(50, { criticalBelow: 55, positiveAbove: 80 }, cores)).toBe('C')
  })
})
