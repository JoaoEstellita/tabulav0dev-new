import { describe, it, expect } from 'vitest'
import { getSignMeaning, getHouseMeaning, type Lang } from '../signHouseMeaning'

const IDIOMAS: Lang[] = ['pt-BR', 'en-US', 'es-ES', 'it-IT']
const SIGNOS_EN = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces']

describe('significados de signo e casa (toque na roda)', () => {
  it('os 12 signos respondem nos 4 idiomas', () => {
    const faltando: string[] = []
    for (const signo of SIGNOS_EN) {
      for (const idioma of IDIOMAS) {
        const m = getSignMeaning(signo, idioma)
        if (!m?.nome?.trim() || !m?.palavras?.trim() || !m?.texto?.trim()) faltando.push(`${signo}/${idioma}`)
      }
    }
    expect(faltando).toEqual([])
  })

  it('as 12 casas respondem nos 4 idiomas', () => {
    const faltando: string[] = []
    for (let casa = 1; casa <= 12; casa++) {
      for (const idioma of IDIOMAS) {
        const m = getHouseMeaning(casa, idioma)
        if (!m?.nome?.trim() || !m?.palavras?.trim() || !m?.texto?.trim()) faltando.push(`${casa}/${idioma}`)
      }
    }
    expect(faltando).toEqual([])
  })

  it('aceita o nome do signo em qualquer idioma', () => {
    // A roda passa o nome em EN, mas o mesmo dado chega em pt/es/it por outros
    // caminhos — e errar aqui deixaria o toque sem resposta.
    expect(getSignMeaning('Gêmeos', 'pt-BR')?.nome).toBe('Gêmeos')
    expect(getSignMeaning('Gemini', 'pt-BR')?.nome).toBe('Gêmeos')
    expect(getSignMeaning('Geminis', 'es-ES')?.nome).toBe('Geminis')
    expect(getSignMeaning('Gemelli', 'it-IT')?.nome).toBe('Gemelli')
    expect(getSignMeaning('ESCORPIÃO', 'pt-BR')?.nome).toBe('Escorpião')
  })

  it('devolve null para o que não existe, em vez de um modal vazio', () => {
    expect(getSignMeaning('Banana', 'pt-BR')).toBeNull()
    expect(getSignMeaning('', 'pt-BR')).toBeNull()
    expect(getHouseMeaning(0, 'pt-BR')).toBeNull()
    expect(getHouseMeaning(13, 'pt-BR')).toBeNull()
  })

  it('es-ES e it-IT seguem a regra do projeto (sem acento)', () => {
    const ACENTO = /[áàâãäéèêëíìîïóòôõöúùûüçñ]/i
    const ofensores: string[] = []
    const checar = (m: { nome: string; palavras: string; texto: string } | null, id: string) => {
      if (!m) return
      if (ACENTO.test(m.nome) || ACENTO.test(m.palavras) || ACENTO.test(m.texto)) ofensores.push(id)
    }
    for (const idioma of ['es-ES', 'it-IT'] as Lang[]) {
      for (const s of SIGNOS_EN) checar(getSignMeaning(s, idioma), `${s}/${idioma}`)
      for (let c = 1; c <= 12; c++) checar(getHouseMeaning(c, idioma), `casa${c}/${idioma}`)
    }
    expect(ofensores).toEqual([])
  })

  it('o texto é curto o bastante para caber no modal', () => {
    // Duas linhas no celular. Texto longo vira parede e perde quem a gente quer
    // alcançar — que é exatamente quem não estuda astrologia.
    const longos: string[] = []
    for (const s of SIGNOS_EN) {
      const m = getSignMeaning(s, 'pt-BR')
      if (m && m.texto.length > 260) longos.push(`${s} (${m.texto.length})`)
    }
    for (let c = 1; c <= 12; c++) {
      const m = getHouseMeaning(c, 'pt-BR')
      if (m && m.texto.length > 260) longos.push(`casa ${c} (${m.texto.length})`)
    }
    expect(longos).toEqual([])
  })

  it('as palavras-chave são três, separadas por ponto médio', () => {
    for (const s of SIGNOS_EN) {
      const m = getSignMeaning(s, 'pt-BR')!
      expect(m.palavras.split('·').length, `${s}: ${m.palavras}`).toBe(3)
    }
  })
})
