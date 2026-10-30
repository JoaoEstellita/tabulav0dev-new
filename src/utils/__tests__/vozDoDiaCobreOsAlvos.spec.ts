import { describe, it, expect } from 'vitest'
import { nomeDoPonto, efeitoNoPonto, detalheDoPonto } from '../efeitoDoTransito'

/**
 * ⚠️ Sem entrada no vocabulário, a frase do dia SOME.
 *
 * `sinteseDoDia` faz `if (!efeitoBruto) continue` — um alvo sem texto não gera
 * linha nenhuma e não deixa rastro. Em 13/10, no dado de produção, 3 dos 6
 * usuários tinham trânsito a `IC` e 3 a `DSC`, e nenhum dos dois existia na
 * tabela: aquelas leituras simplesmente não apareciam. No WhatsApp o mesmo
 * buraco saía pior, com a sigla crua ("Hoje Mercúrio pressiona DSC").
 *
 * Os ALVOS abaixo são as grafias que o motor grava em
 * `currentTransits.transitosRicos.n` — vistas no banco, não inventadas aqui.
 */
const ALVOS = [
  'Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto',
  'ASC', 'DSC', 'MC', 'IC',
  'Ascendant', 'Descendant', 'Midheaven', 'ImumCoeli', 'NorthNode',
]
const IDIOMAS = ['pt-BR', 'en-US', 'es-ES', 'it-IT'] as const
const NATUREZAS = ['tenso', 'facil', 'misto'] as const

describe('vocabulário do dia cobre todo alvo que o motor emite', () => {
  it('todo alvo tem nome e os três efeitos, nos 4 idiomas', () => {
    const faltando: string[] = []
    for (const lang of IDIOMAS) {
      for (const alvo of ALVOS) {
        if (!nomeDoPonto(alvo, lang)) faltando.push(`${lang} ${alvo} (nome)`)
        for (const nat of NATUREZAS) {
          if (!efeitoNoPonto(alvo, nat, lang)) faltando.push(`${lang} ${alvo}.${nat}`)
          if (!detalheDoPonto(alvo, nat, lang)) faltando.push(`${lang} ${alvo}.${nat} (detalhe)`)
        }
      }
    }
    expect(faltando, `sem texto:\n${faltando.slice(0, 20).join('\n')}`).toEqual([])
  })

  // As quatro pontas são DOIS eixos, mas cada ponta lê diferente: a presença da
  // pessoa não é o encontro com o outro, e o que aparece não é o que sustenta.
  it('cada ponta do eixo tem leitura própria, não a do oposto', () => {
    expect(nomeDoPonto('ASC', 'pt-BR')).not.toBe(nomeDoPonto('DSC', 'pt-BR'))
    expect(nomeDoPonto('MC', 'pt-BR')).not.toBe(nomeDoPonto('IC', 'pt-BR'))
    expect(efeitoNoPonto('ASC', 'tenso', 'pt-BR')).not.toBe(efeitoNoPonto('DSC', 'tenso', 'pt-BR'))
    expect(efeitoNoPonto('MC', 'tenso', 'pt-BR')).not.toBe(efeitoNoPonto('IC', 'tenso', 'pt-BR'))
  })

  it('a sigla e o nome por extenso caem no mesmo texto', () => {
    const pares: Array<[string, string]> = [
      ['ASC', 'Ascendant'], ['DSC', 'Descendant'], ['MC', 'Midheaven'], ['IC', 'ImumCoeli'],
    ]
    for (const [sigla, extenso] of pares) {
      expect(nomeDoPonto(sigla, 'pt-BR'), sigla).toBe(nomeDoPonto(extenso, 'pt-BR'))
      expect(efeitoNoPonto(sigla, 'misto', 'pt-BR'), sigla).toBe(efeitoNoPonto(extenso, 'misto', 'pt-BR'))
    }
  })

  it('es-ES sem tildes nem ñ, it-IT sem acentos', () => {
    for (const alvo of ALVOS) {
      for (const nat of NATUREZAS) {
        expect(efeitoNoPonto(alvo, nat, 'es-ES')!, `${alvo}.${nat}`).not.toMatch(/[áéíóúüñ]/i)
        expect(efeitoNoPonto(alvo, nat, 'it-IT')!, `${alvo}.${nat}`).not.toMatch(/[àèìòùáéíóú]/i)
        expect(detalheDoPonto(alvo, nat, 'es-ES')!, `${alvo}.${nat} (detalhe)`).not.toMatch(/[áéíóúüñ]/i)
        expect(detalheDoPonto(alvo, nat, 'it-IT')!, `${alvo}.${nat} (detalhe)`).not.toMatch(/[àèìòùáéíóú]/i)
      }
      expect(nomeDoPonto(alvo, 'es-ES')!, alvo).not.toMatch(/[áéíóúüñ]/i)
      expect(nomeDoPonto(alvo, 'it-IT')!, alvo).not.toMatch(/[àèìòùáéíóú]/i)
    }
  })

  it('en-US sem "will" (presente, não futuro)', () => {
    for (const alvo of ALVOS) {
      for (const nat of NATUREZAS) {
        expect(efeitoNoPonto(alvo, nat, 'en-US')!, `${alvo}.${nat}`).not.toMatch(/\bwill\b/i)
        expect(detalheDoPonto(alvo, nat, 'en-US')!, `${alvo}.${nat} (detalhe)`).not.toMatch(/\bwill\b/i)
      }
    }
  })

  /**
   * ⚠️ A SEGUNDA LINHA TEM DE ACRESCENTAR, nao repetir a manchete com outras
   * palavras. Duas versoes da mesma ideia uma embaixo da outra gastam o dobro
   * do espaco e informam o mesmo — e dao a impressao de que o app esta
   * enrolando. Se a segunda linha pudesse substituir a primeira, uma das duas
   * esta sobrando.
   *
   * O teste e grosseiro de proposito (as tres primeiras palavras): ele pega o
   * eco literal, que foi o defeito real — "o jeito como voce aparece..." na
   * manchete e "o jeito como voce chega..." logo abaixo.
   */
  it('a segunda linha não ecoa a abertura da manchete', () => {
    const ecos: string[] = []
    for (const alvo of ALVOS) {
      for (const nat of NATUREZAS) {
        const h = (efeitoNoPonto(alvo, nat, 'pt-BR') || '').toLowerCase().split(/\s+/).slice(0, 3).join(' ')
        const d = (detalheDoPonto(alvo, nat, 'pt-BR') || '').toLowerCase().split(/\s+/).slice(0, 3).join(' ')
        if (h && h === d) ecos.push(`${alvo}.${nat}: "${h}…"`)
      }
    }
    expect(ecos, `a segunda linha repete a abertura da manchete:\n${ecos.join('\n')}`).toEqual([])
  })

  /**
   * ⚠️ AS MESMAS REGRAS DE VOZ da manchete, e elas pesam MAIS aqui: ha mais
   * espaco para escorregar numa frase de duas linhas.
   *
   * Nada de hedge ("pode ser que", "tende a"), que tira a assertividade sem
   * devolver informacao; nada de prescricao ("e hora de"), que vira ordem. A
   * primeira versao do vocabulario foi relatada como "forte demais" na tela
   * justamente por decretar coisas sobre a pessoa.
   */
  it('a segunda linha não hedgeia nem prescreve', () => {
    const PROIBIDO = [/\bpode ser que\b/i, /\btende a\b/i, /\bé hora de\b/i, /\btalvez\b/i, /\bprovavelmente\b/i]
    const achados: string[] = []
    for (const alvo of ALVOS) {
      for (const nat of NATUREZAS) {
        const d = detalheDoPonto(alvo, nat, 'pt-BR') || ''
        for (const re of PROIBIDO) if (re.test(d)) achados.push(`${alvo}.${nat}: ${d}`)
      }
    }
    expect(achados, `voz proibida:\n${achados.join('\n')}`).toEqual([])
  })

  /**
   * Ela existe para EXPLICAR, entao precisa de corpo — mas duas linhas na tela,
   * nao um paragrafo. O teto evita que a leitura do dia vire texto corrido.
   */
  it('a segunda linha tem corpo, sem virar parágrafo', () => {
    for (const alvo of ALVOS) {
      for (const nat of NATUREZAS) {
        const d = detalheDoPonto(alvo, nat, 'pt-BR')!
        expect(d.length, `${alvo}.${nat} curta demais para explicar algo: ${d}`).toBeGreaterThan(55)
        expect(d.length, `${alvo}.${nat} virou parágrafo: ${d}`).toBeLessThanOrEqual(165)
        expect(d, `${alvo}.${nat} sem pontuação final`).toMatch(/[.!?]$/)
      }
    }
  })

  it('cada ponta do eixo também tem segunda linha própria', () => {
    expect(detalheDoPonto('ASC', 'tenso', 'pt-BR')).not.toBe(detalheDoPonto('DSC', 'tenso', 'pt-BR'))
    expect(detalheDoPonto('MC', 'tenso', 'pt-BR')).not.toBe(detalheDoPonto('IC', 'tenso', 'pt-BR'))
  })
})
