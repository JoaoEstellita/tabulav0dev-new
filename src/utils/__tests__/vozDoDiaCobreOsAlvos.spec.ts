import { describe, it, expect } from 'vitest'
import { nomeDoPonto, efeitoNoPonto } from '../efeitoDoTransito'

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
      }
      expect(nomeDoPonto(alvo, 'es-ES')!, alvo).not.toMatch(/[áéíóúüñ]/i)
      expect(nomeDoPonto(alvo, 'it-IT')!, alvo).not.toMatch(/[àèìòùáéíóú]/i)
    }
  })

  it('en-US sem "will" (presente, não futuro)', () => {
    for (const alvo of ALVOS) {
      for (const nat of NATUREZAS) {
        expect(efeitoNoPonto(alvo, nat, 'en-US')!, `${alvo}.${nat}`).not.toMatch(/\bwill\b/i)
      }
    }
  })
})
