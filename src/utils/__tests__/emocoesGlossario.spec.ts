import { describe, it, expect } from 'vitest'
import { GLOSSARIO_EMOCOES, indiceIdioma } from '../../data/emocoesGlossario'
import { EMOCOES, type ChaveEmocao } from '../emocoesDoDia'

const CAMPOS = ['definicao', 'leitura', 'fonte'] as const
const IDIOMAS = ['pt-BR', 'en-US', 'es-ES', 'it-IT'] as const

describe('glossário das tendências emocionais', () => {
  /**
   * ⚠️ UM VERBETE PARA CADA ANEL, SEMPRE.
   *
   * O modal lê `GLOSSARIO_EMOCOES[chave]` sem nenhuma defesa. Acrescentar uma
   * emoção nova em `EMOCOES` e esquecer o texto aqui derruba a tela ao tocar
   * naquele anel — e só naquele, o que é fácil de não notar em teste manual.
   */
  it('cobre exatamente as emoções que existem', () => {
    expect(Object.keys(GLOSSARIO_EMOCOES).sort()).toEqual([...EMOCOES].sort())
  })

  it('os quatro idiomas estão preenchidos em todos os campos', () => {
    for (const chave of EMOCOES) {
      for (const campo of CAMPOS) {
        const t = GLOSSARIO_EMOCOES[chave][campo]
        expect(t, `${chave}.${campo}`).toHaveLength(4)
        t.forEach((texto, i) => {
          expect(texto.trim().length, `${chave}.${campo} [${IDIOMAS[i]}] vazio`).toBeGreaterThan(10)
        })
      }
    }
  })

  /**
   * ⚠️ REGRA DO PROJETO: es-ES sem tis nem ñ, it-IT sem acentos.
   *
   * Vem do catálogo de interpretações e vale para todo texto novo. pt-BR
   * mantém a acentuação inteira — é a língua base.
   */
  it('es-ES não leva til nem ñ; it-IT não leva acento', () => {
    const PROIBIDO = /[áàâãéêíóôõúüñÁÀÂÃÉÊÍÓÔÕÚÜÑ]/
    for (const chave of EMOCOES) {
      for (const campo of CAMPOS) {
        const [, , es, it] = GLOSSARIO_EMOCOES[chave][campo]
        expect(PROIBIDO.test(es), `es-ES ${chave}.${campo}: ${es}`).toBe(false)
        expect(PROIBIDO.test(it), `it-IT ${chave}.${campo}: ${it}`).toBe(false)
      }
    }
  })

  it('o pt-BR mantém a acentuação — não é texto sanitizado por engano', () => {
    const tudo = EMOCOES.map((c) => GLOSSARIO_EMOCOES[c].definicao[0] + GLOSSARIO_EMOCOES[c].leitura[0]).join(' ')
    expect(/[áàâãéêíóôõúç]/i.test(tudo)).toBe(true)
  })

  /**
   * ⚠️ O TEXTO FALA DO DIA, NUNCA DA PESSOA.
   *
   * "O atrito do dia" e não "você está estressado". O app não tem nenhum dado
   * sobre o estado emocional de ninguém, e a diferença entre as duas frases é
   * a diferença entre uma leitura e um diagnóstico que o dado não sustenta.
   *
   * A `leitura` pode falar com a pessoa (é conselho: "ajuda ter plano B"), mas
   * a `definicao` não pode afirmar nada sobre ela.
   */
  it('nenhuma definição afirma algo sobre o estado da pessoa', () => {
    const AFIRMA = /\b(você está|voce esta|você se sente|voce se sente|you are feeling|you feel|estas sintiendo|ti senti)\b/i
    for (const chave of EMOCOES) {
      for (const texto of GLOSSARIO_EMOCOES[chave].definicao) {
        expect(AFIRMA.test(texto), `${chave}: "${texto}"`).toBe(false)
      }
    }
  })

  /**
   * A `fonte` ensina quais planetas movem o anel. Se ela listar um planeta que
   * não alimenta aquela emoção, o texto mente — e mente de um jeito que só um
   * astrólogo notaria.
   */
  it('a fonte de cada anel nomeia o planeta dominante dele', () => {
    const DOMINANTE: Record<ChaveEmocao, string> = {
      afeto: 'Vênus', entusiasmo: 'Júpiter', calma: 'Saturno', sensibilidade: 'Lua',
      estresse: 'Marte', desanimo: 'Saturno', ansiedade: 'Urano', pressao: 'Plutão',
    }
    for (const chave of EMOCOES) {
      expect(
        GLOSSARIO_EMOCOES[chave].fonte[0],
        `${chave} deveria citar ${DOMINANTE[chave]}`,
      ).toContain(DOMINANTE[chave])
    }
  })

  it('a fonte diz se o aspecto é duro ou macio, e diz o certo', () => {
    for (const chave of EMOCOES) {
      const pt = GLOSSARIO_EMOCOES[chave].fonte[0]
      const esperado = ['estresse', 'desanimo', 'ansiedade', 'pressao'].includes(chave)
        ? 'duro'
        : 'macio'
      expect(pt, `${chave}: ${pt}`).toContain(esperado)
    }
  })

  it('o idioma vira índice, com pt-BR de reserva', () => {
    expect(indiceIdioma('pt-BR')).toBe(0)
    expect(indiceIdioma('en-US')).toBe(1)
    expect(indiceIdioma('es-ES')).toBe(2)
    expect(indiceIdioma('it-IT')).toBe(3)
    expect(indiceIdioma('en')).toBe(1)
    expect(indiceIdioma(undefined)).toBe(0)
    expect(indiceIdioma('xx-YY')).toBe(0)
  })
})
