import { describe, it, expect } from 'vitest'
import { dignidadeDe, dignidadePorLongitude, sinalDaDignidade, rotuloDaDignidade } from '../dignidades'

/**
 * Dignidade essencial.
 *
 * Erro aqui não dá erro: só afirma que Vênus está confortável quando ela está
 * em território hostil — e a leitura inteira daquele planeta vira do avesso.
 *
 * REGÊNCIA TRADICIONAL, igual ao resto do app (Marte rege Escorpião, Saturno
 * rege Aquário, Júpiter rege Peixes). Já há teste travando que a ficha do signo
 * não divirja disso; aqui o confronto é o mesmo, pelo outro lado.
 */

const ARIES = 0, TOURO = 1, GEMEOS = 2, CANCER = 3, LEAO = 4, VIRGEM = 5
const LIBRA = 6, ESCORPIAO = 7, SAGITARIO = 8, CAPRICORNIO = 9, AQUARIO = 10, PEIXES = 11

describe('domicílio — o planeta em casa', () => {
  it('cada planeta tradicional rege o que deve', () => {
    expect(dignidadeDe('Sun', LEAO)).toBe('domicilio')
    expect(dignidadeDe('Moon', CANCER)).toBe('domicilio')
    expect(dignidadeDe('Mercury', GEMEOS)).toBe('domicilio')
    expect(dignidadeDe('Mercury', VIRGEM)).toBe('domicilio')
    expect(dignidadeDe('Venus', TOURO)).toBe('domicilio')
    expect(dignidadeDe('Venus', LIBRA)).toBe('domicilio')
    expect(dignidadeDe('Mars', ARIES)).toBe('domicilio')
    expect(dignidadeDe('Jupiter', SAGITARIO)).toBe('domicilio')
    expect(dignidadeDe('Saturn', CAPRICORNIO)).toBe('domicilio')
  })

  it('usa a regência TRADICIONAL, não a moderna', () => {
    // O ponto onde os dois sistemas divergem — e onde o app já escolheu lado.
    expect(dignidadeDe('Mars', ESCORPIAO), 'Escorpião é de Marte, não de Plutão').toBe('domicilio')
    expect(dignidadeDe('Saturn', AQUARIO), 'Aquário é de Saturno, não de Urano').toBe('domicilio')
    expect(dignidadeDe('Jupiter', PEIXES), 'Peixes é de Júpiter, não de Netuno').toBe('domicilio')
  })

  it('transpessoal não tem domicílio — não inventa um', () => {
    for (const s of [ESCORPIAO, AQUARIO, PEIXES]) {
      expect(dignidadeDe('Pluto', s)).toBeNull()
      expect(dignidadeDe('Uranus', s)).toBeNull()
      expect(dignidadeDe('Neptune', s)).toBeNull()
    }
  })
})

describe('exílio — o oposto do domicílio', () => {
  it('é sempre o signo oposto ao que o planeta rege', () => {
    expect(dignidadeDe('Sun', AQUARIO)).toBe('exilio')
    expect(dignidadeDe('Moon', CAPRICORNIO)).toBe('exilio')
    expect(dignidadeDe('Venus', ESCORPIAO)).toBe('exilio')
    expect(dignidadeDe('Venus', ARIES)).toBe('exilio')
    expect(dignidadeDe('Mars', LIBRA)).toBe('exilio')
    expect(dignidadeDe('Saturn', CANCER)).toBe('exilio')
  })
})

describe('exaltação e queda', () => {
  it('as exaltações clássicas', () => {
    expect(dignidadeDe('Sun', ARIES)).toBe('exaltacao')
    expect(dignidadeDe('Moon', TOURO)).toBe('exaltacao')
    expect(dignidadeDe('Venus', PEIXES)).toBe('exaltacao')
    expect(dignidadeDe('Mars', CAPRICORNIO)).toBe('exaltacao')
    expect(dignidadeDe('Jupiter', CANCER)).toBe('exaltacao')
    expect(dignidadeDe('Saturn', LIBRA)).toBe('exaltacao')
  })

  it('queda é o oposto da exaltação', () => {
    expect(dignidadeDe('Sun', LIBRA)).toBe('queda')
    expect(dignidadeDe('Moon', ESCORPIAO)).toBe('queda')
    expect(dignidadeDe('Venus', VIRGEM)).toBe('queda')
    expect(dignidadeDe('Mars', CANCER)).toBe('queda')
    expect(dignidadeDe('Saturn', ARIES)).toBe('queda')
  })

  it('Mercúrio em Virgem é domicílio E exaltação — domicílio vence', () => {
    // Caso clássico de sobreposição. Marcar os dois confundiria; o domicílio é
    // o mais forte e é o que a roda mostra.
    expect(dignidadeDe('Mercury', VIRGEM)).toBe('domicilio')
  })
})

describe('a maioria das posições não tem dignidade', () => {
  it('devolve null em vez de forçar um rótulo', () => {
    // Se tudo tivesse dignidade, marcar deixaria de significar algo.
    expect(dignidadeDe('Sun', GEMEOS)).toBeNull()
    expect(dignidadeDe('Venus', SAGITARIO)).toBeNull()
    expect(dignidadeDe('Jupiter', TOURO)).toBeNull()
  })

  it('planeta desconhecido não quebra', () => {
    expect(dignidadeDe('Quiron', ARIES)).toBeNull()
    expect(dignidadeDe('', ARIES)).toBeNull()
  })
})

describe('entrada por longitude, que é como o dado chega', () => {
  it('converte grau em signo corretamente', () => {
    expect(dignidadePorLongitude('Sun', 125)).toBe('domicilio')  // 125° = Leão
    expect(dignidadePorLongitude('Sun', 5)).toBe('exaltacao')    // 5° = Áries
    expect(dignidadePorLongitude('Mars', 190)).toBe('exilio')    // 190° = Libra
  })

  it('aceita longitude fora de 0-360 e rejeita lixo', () => {
    expect(dignidadePorLongitude('Sun', 485)).toBe('domicilio')  // 485 - 360 = 125
    expect(dignidadePorLongitude('Sun', -235)).toBe('domicilio') // -235 + 360 = 125
    expect(dignidadePorLongitude('Sun', NaN)).toBeNull()
  })
})

describe('força e rótulo', () => {
  it('domicílio e exaltação somam; exílio e queda subtraem', () => {
    expect(sinalDaDignidade('domicilio')).toBe(1)
    expect(sinalDaDignidade('exaltacao')).toBe(1)
    expect(sinalDaDignidade('exilio')).toBe(-1)
    expect(sinalDaDignidade('queda')).toBe(-1)
    expect(sinalDaDignidade(null)).toBe(0)
  })

  it('rótulo nos 4 idiomas, com es/it sem acento', () => {
    const ACENTO = /[áàâãéèêíìóòôõúùçñ]/i
    for (const d of ['domicilio', 'exaltacao', 'exilio', 'queda'] as const) {
      for (const idioma of ['es-ES', 'it-IT'] as const) {
        expect(ACENTO.test(rotuloDaDignidade(d, idioma)), `${d}/${idioma}`).toBe(false)
      }
      expect(rotuloDaDignidade(d, 'en-US')).toBeTruthy()
    }
  })
})
