import { describe, it, expect } from 'vitest'
import { getSignMeaning } from '../signHouseMeaning'

/**
 * O regente de um signo tem de ser o MESMO em toda tela.
 *
 * A ficha técnica do modal e as profecções usam tabelas separadas. Se uma delas
 * mudar — por exemplo alguém "modernizar" Escorpião para Plutão num lugar só — o
 * app passa a dizer Marte numa tela e Plutão na outra. Não quebra nada, não dá
 * erro: só mente para quem estuda, que é justamente quem repara.
 *
 * `DOMICILE_RULER_PT` (src/astro/profections.ts) é a referência, e bate com a
 * fonte do projeto (Txt/Horary_Sign_Description.txt). O app usa regência
 * TRADICIONAL: Marte para Escorpião, Saturno para Aquário, Júpiter para Peixes.
 */

// Cópia literal de DOMICILE_RULER_PT, na ordem dos signos. Importar o módulo
// traria a cadeia de astrologia inteira; o que importa aqui é o confronto.
const REGENTE_POR_SIGNO: Array<[string, string]> = [
  ['Aries', 'Marte'],
  ['Taurus', 'Vênus'],
  ['Gemini', 'Mercúrio'],
  ['Cancer', 'Lua'],
  ['Leo', 'Sol'],
  ['Virgo', 'Mercúrio'],
  ['Libra', 'Vênus'],
  ['Scorpio', 'Marte'],
  ['Sagittarius', 'Júpiter'],
  ['Capricorn', 'Saturno'],
  ['Aquarius', 'Saturno'],
  ['Pisces', 'Júpiter'],
]

describe('regência do signo é a mesma em todo lugar', () => {
  it('a ficha do modal cita o regente de DOMICILE_RULER_PT', () => {
    const divergentes: string[] = []
    for (const [signo, regente] of REGENTE_POR_SIGNO) {
      const ficha = getSignMeaning(signo, 'pt-BR')?.ficha || ''
      if (!ficha.includes(regente)) divergentes.push(`${signo}: esperava "${regente}", ficha diz "${ficha}"`)
    }
    expect(divergentes, 'regente divergente entre telas não dá erro — só mente').toEqual([])
  })

  it('todo signo tem ficha nos 4 idiomas', () => {
    const faltando: string[] = []
    for (const [signo] of REGENTE_POR_SIGNO) {
      for (const idioma of ['pt-BR', 'en-US', 'es-ES', 'it-IT'] as const) {
        if (!getSignMeaning(signo, idioma)?.ficha?.trim()) faltando.push(`${signo}/${idioma}`)
      }
    }
    expect(faltando).toEqual([])
  })

  it('a ficha traz elemento, modalidade e regente — nessa ordem', () => {
    // Três campos separados por ponto médio. Menos que isso é ficha incompleta.
    for (const [signo] of REGENTE_POR_SIGNO) {
      const ficha = getSignMeaning(signo, 'pt-BR')!.ficha!
      expect(ficha.split('·').length, `${signo}: ${ficha}`).toBe(3)
    }
  })

  it('os elementos seguem a roda: fogo, terra, ar, água, repetindo', () => {
    // A mesma sequência que tinge o anel do zodíaco. Se divergir, o fundo do
    // desenho passa a contradizer o texto do modal.
    const esperado = ['Fogo', 'Terra', 'Ar', 'Água']
    REGENTE_POR_SIGNO.forEach(([signo], i) => {
      const ficha = getSignMeaning(signo, 'pt-BR')!.ficha!
      expect(ficha.startsWith(esperado[i % 4]), `${signo}: ${ficha}`).toBe(true)
    })
  })

  it('as modalidades seguem cardinal, fixo, mutável, repetindo', () => {
    const esperado = ['Cardinal', 'Fixo', 'Mutável']
    REGENTE_POR_SIGNO.forEach(([signo], i) => {
      const ficha = getSignMeaning(signo, 'pt-BR')!.ficha!
      expect(ficha.includes(esperado[i % 3]), `${signo}: ${ficha}`).toBe(true)
    })
  })

  it('es-ES e it-IT seguem a regra do projeto (sem acento)', () => {
    const ACENTO = /[áàâãäéèêëíìîïóòôõöúùûüçñ]/i
    const ofensores: string[] = []
    for (const [signo] of REGENTE_POR_SIGNO) {
      for (const idioma of ['es-ES', 'it-IT'] as const) {
        const ficha = getSignMeaning(signo, idioma)?.ficha || ''
        if (ACENTO.test(ficha)) ofensores.push(`${signo}/${idioma}: ${ficha}`)
      }
    }
    expect(ofensores).toEqual([])
  })
})
