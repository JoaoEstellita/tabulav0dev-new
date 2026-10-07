import { describe, it, expect } from 'vitest'
import { indiceDePalavras, fatiarComAncoras, semAcento } from '../ancorasDoTexto'

/**
 * As âncoras da frase do dia.
 *
 * O que não pode quebrar aqui: a palavra tocada tem de abrir O TRÂNSITO DELA.
 * Se o índice apontar para o trânsito errado, a pessoa lê um conselho e recebe a
 * interpretação de outro par de planetas — plausível, convincente e falso, sem
 * erro nenhum na tela. É a classe de bug mais cara do projeto.
 */

const kw = (id: string, ...keywords: string[]) => ({ id, keywords })

describe('índice de palavras → trânsito', () => {
  it('a palavra aponta para o trânsito que a declarou', () => {
    const i = indiceDePalavras([
      kw('txr-saturn-quadratura-sun', 'firmeza', 'limite'),
      kw('txr-venus-trigono-moon', 'abertura'),
    ])
    expect(i.get('firmeza')).toBe('txr-saturn-quadratura-sun')
    expect(i.get('abertura')).toBe('txr-venus-trigono-moon')
  })

  it('o primeiro trânsito da lista fica com a palavra disputada', () => {
    // A lista chega ordenada do mais forte para o mais fraco. A palavra tem de
    // cair no que mais pesa hoje, não num secundário.
    const i = indiceDePalavras([
      kw('txr-forte', 'revisao'),
      kw('txr-fraco', 'revisao'),
    ])
    expect(i.get('revisao')).toBe('txr-forte')
  })

  it('descarta o que não serve como palavra de sentido', () => {
    const i = indiceDePalavras([kw('txr-x', 'dia', 'casa 7', 'boa sorte', 'firmeza', '')])
    expect([...i.keys()]).toEqual(['firmeza'])
  })

  it('respeita a lista de proibidas', () => {
    // Nome de planeta e de aspecto não viram âncora: a frase existe justamente
    // para não depender deles.
    const i = indiceDePalavras(
      [kw('txr-x', 'saturno', 'quadratura', 'firmeza')],
      ['Saturno', 'quadratura'],
    )
    expect([...i.keys()]).toEqual(['firmeza'])
  })

  it('ignora entrada sem id', () => {
    const i = indiceDePalavras([{ id: '', keywords: ['firmeza'] }])
    expect(i.size).toBe(0)
  })
})

describe('fatiar o texto marcando as âncoras', () => {
  const indice = indiceDePalavras([
    kw('txr-saturn-quadratura-sun', 'firmeza'),
    kw('txr-venus-trigono-moon', 'abertura'),
  ])

  it('marca a palavra e preserva o resto do texto', () => {
    const p = fatiarComAncoras('O dia pede firmeza com calma.', indice)
    expect(p.map((x) => x.texto).join('')).toBe('O dia pede firmeza com calma.')
    const ancora = p.find((x) => x.id)
    expect(ancora?.texto).toBe('firmeza')
    expect(ancora?.id).toBe('txr-saturn-quadratura-sun')
  })

  it('acha a palavra acentuada e devolve a grafia ORIGINAL', () => {
    // A busca ignora acento; o que vai para a tela nunca pode perdê-lo.
    const i = indiceDePalavras([kw('txr-x', 'revisao')])
    const p = fatiarComAncoras('Tempo de revisão agora.', i)
    const ancora = p.find((x) => x.id)
    expect(ancora?.texto).toBe('revisão')
    expect(p.map((x) => x.texto).join('')).toBe('Tempo de revisão agora.')
  })

  it('não parte palavra no meio', () => {
    // "firmeza" não pode ser marcada dentro de "afirmeza"/"firmezas".
    const p = fatiarComAncoras('enfirmeza não conta', indice)
    expect(p.some((x) => x.id)).toBe(false)
  })

  it('marca só a primeira ocorrência, e compartilha isso entre blocos', () => {
    const usadas = new Set<string>()
    const a = fatiarComAncoras('pede firmeza hoje', indice, usadas)
    const b = fatiarComAncoras('e firmeza amanhã', indice, usadas)
    expect(a.filter((x) => x.id).length).toBe(1)
    expect(b.filter((x) => x.id).length, 'sublinhar a mesma palavra de novo vira ruído').toBe(0)
    expect(b.map((x) => x.texto).join('')).toBe('e firmeza amanhã')
  })

  it('a palavra mais longa ganha da mais curta', () => {
    const i = indiceDePalavras([kw('txr-longo', 'revisao'), kw('txr-curto', 'visao')])
    const p = fatiarComAncoras('hora de revisão', i)
    const ancora = p.find((x) => x.id)
    expect(ancora?.texto).toBe('revisão')
    expect(ancora?.id).toBe('txr-longo')
  })

  it('texto sem âncora volta inteiro, em um pedaço', () => {
    const p = fatiarComAncoras('nada aqui combina', indice)
    expect(p).toEqual([{ texto: 'nada aqui combina' }])
  })

  it('índice vazio não quebra', () => {
    expect(fatiarComAncoras('qualquer coisa', new Map())).toEqual([{ texto: 'qualquer coisa' }])
    expect(fatiarComAncoras('', new Map())).toEqual([])
  })

  it('nunca perde nem duplica caractere, com acento e maiúscula', () => {
    const i = indiceDePalavras([kw('txr-x', 'atencao'), kw('txr-y', 'firmeza')])
    const texto = 'Atenção: o dia pede FIRMEZA e mais atenção depois.'
    const p = fatiarComAncoras(texto, i)
    expect(p.map((x) => x.texto).join('')).toBe(texto)
    // Caixa diferente ainda casa, e só a primeira de cada palavra é marcada.
    expect(p.filter((x) => x.id).map((x) => x.texto)).toEqual(['Atenção', 'FIRMEZA'])
  })

  it('semAcento é o mesmo normalizador em todo lugar', () => {
    expect(semAcento('Revisão')).toBe('revisao')
    expect(semAcento('  AÇÃO ')).toBe('acao')
  })
})
