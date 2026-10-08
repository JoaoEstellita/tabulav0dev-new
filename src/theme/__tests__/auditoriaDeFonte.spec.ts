import { describe, it, expect } from 'vitest'
import { estilosDeTextoMiudo, contarTextoMiudo } from '../auditoriaDeFonte'

/**
 * O auditor que sustenta o piso de legibilidade.
 *
 * Testado com casos sintéticos antes de ser apontado para o app: um auditor que
 * conta errado é pior que nenhum — ele faz o limite subir sozinho e o problema
 * voltar sem ninguém perceber.
 */

describe('auditoria de fonte: acha texto miúdo de leitura', () => {
  it('acha o estilo abaixo do piso e diz o nome', () => {
    const fonte = `const s = StyleSheet.create({
  aviso: { color: '#fff', fontSize: 11 },
})`
    const r = estilosDeTextoMiudo(fonte, 14)
    expect(r).toHaveLength(1)
    expect(r[0].nome).toBe('aviso')
    expect(r[0].tamanho).toBe(11)
    expect(r[0].linha).toBe(2)
  })

  it('não acusa o que está no piso ou acima', () => {
    const fonte = `const s = StyleSheet.create({
  corpo: { fontSize: 14 },
  titulo: { fontSize: 20 },
})`
    expect(contarTextoMiudo(fonte, 14)).toBe(0)
  })

  it('CAPS de categoria é exceção, mesmo em 11px', () => {
    // "TRÂNSITO" em 11px com letterSpacing é um localizador, não um texto. Em
    // 14px passa a competir com o conteúdo que rotula.
    const fonte = `const s = StyleSheet.create({
  etiqueta: {
    color: '#888',
    fontSize: 11,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
})`
    expect(contarTextoMiudo(fonte, 14)).toBe(0)
  })

  it('a exceção vale mesmo quando o textTransform vem DEPOIS do fontSize', () => {
    // Decidir na hora de ler o fontSize classificaria esta etiqueta como
    // ofensora — o bloco inteiro tem de ser considerado.
    const fonte = `const s = StyleSheet.create({
  rotulo: { fontSize: 10, textTransform: 'uppercase' },
})`
    expect(contarTextoMiudo(fonte, 14)).toBe(0)
  })

  it('CAPS num estilo não desculpa o estilo vizinho', () => {
    const fonte = `const s = StyleSheet.create({
  etiqueta: { fontSize: 11, textTransform: 'uppercase' },
  corpo: { fontSize: 12 },
})`
    const r = estilosDeTextoMiudo(fonte, 14)
    expect(r.map((x) => x.nome)).toEqual(['corpo'])
  })

  it('pega fontSize em estilo inline dentro do JSX', () => {
    const fonte = `<Text style={{ fontSize: 12, color: '#fff' }}>oi</Text>`
    expect(contarTextoMiudo(fonte, 14)).toBe(1)
  })

  it('atribui ao estilo mais interno quando há aninhamento', () => {
    const fonte = `const s = StyleSheet.create({
  cartao: {
    padding: 8,
    legenda: { fontSize: 12 },
  },
})`
    const r = estilosDeTextoMiudo(fonte, 14)
    expect(r[0].nome).toBe('legenda')
  })

  it('conta decimais e cada ocorrência uma vez', () => {
    const fonte = `const s = StyleSheet.create({
  a: { fontSize: 11.5 },
  b: { fontSize: 13 },
  c: { fontSize: 14 },
})`
    const r = estilosDeTextoMiudo(fonte, 14)
    expect(r.map((x) => x.tamanho)).toEqual([11.5, 13])
  })

  it('fonte vazia ou sem estilo não quebra', () => {
    expect(contarTextoMiudo('', 14)).toBe(0)
    expect(contarTextoMiudo('const x = 1', 14)).toBe(0)
  })
})
