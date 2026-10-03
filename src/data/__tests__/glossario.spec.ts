import { describe, it, expect } from 'vitest'
import {
  GLOSSARIO,
  TERMOS_ORDENADOS,
  chaveTermo,
  explicarTermo,
  simplificarTermo,
  type IdiomaGlossario,
} from '../glossarioAstrologico'

const IDIOMAS: IdiomaGlossario[] = ['pt-BR', 'en-US', 'es-ES', 'it-IT']

describe('glossário astrológico', () => {
  it('todo termo explica nos 4 idiomas', () => {
    const faltando: string[] = []
    for (const [termo, entrada] of Object.entries(GLOSSARIO)) {
      for (const idioma of IDIOMAS) {
        if (!entrada.explicacao[idioma]?.trim()) faltando.push(`${termo}/${idioma}`)
      }
    }
    expect(faltando, 'string exibida ao usuário existe nos 4 idiomas').toEqual([])
  })

  it('quando há versão simples, ela também cobre os 4 idiomas', () => {
    const faltando: string[] = []
    for (const [termo, entrada] of Object.entries(GLOSSARIO)) {
      if (!entrada.simples) continue
      for (const idioma of IDIOMAS) {
        if (!entrada.simples[idioma]?.trim()) faltando.push(`${termo}/${idioma}`)
      }
    }
    expect(faltando).toEqual([])
  })

  it('es-ES e it-IT seguem a regra do projeto (sem acento)', () => {
    const ACENTO = /[áàâãäéèêëíìîïóòôõöúùûüçñÁÀÂÃÄÉÈÊËÍÌÎÏÓÒÔÕÖÚÙÛÜÇÑ]/
    const ofensores: string[] = []
    for (const [termo, entrada] of Object.entries(GLOSSARIO)) {
      for (const idioma of ['es-ES', 'it-IT'] as const) {
        if (ACENTO.test(entrada.explicacao[idioma])) ofensores.push(`${termo}/${idioma}: ${entrada.explicacao[idioma]}`)
        if (entrada.simples && ACENTO.test(entrada.simples[idioma])) ofensores.push(`${termo}/${idioma} (simples)`)
      }
    }
    expect(ofensores).toEqual([])
  })

  it('a explicação não usa outro termo técnico do próprio glossário', () => {
    // Explicar "quadratura" dizendo "é um aspecto tenso" não ajuda ninguém:
    // troca uma palavra desconhecida por outra. A exceção é citar planetas.
    const ofensores: string[] = []
    for (const [termo, entrada] of Object.entries(GLOSSARIO)) {
      const texto = chaveTermo(entrada.explicacao['pt-BR'])
      for (const outro of Object.keys(GLOSSARIO)) {
        if (outro === termo) continue
        if (new RegExp(`\\b${outro}\\b`).test(texto)) ofensores.push(`${termo} usa "${outro}"`)
      }
    }
    expect(ofensores, 'explicação de leigo não pode depender de outro jargão').toEqual([])
  })

  it('termos longos vêm antes dos curtos (senão "casa" engole "meio do céu")', () => {
    const idxCasa = TERMOS_ORDENADOS.indexOf('casa')
    const idxMeio = TERMOS_ORDENADOS.indexOf('meio do ceu')
    expect(idxMeio).toBeLessThan(idxCasa)
  })

  it('chaveTermo normaliza acento e caixa', () => {
    expect(chaveTermo('Quadratura')).toBe('quadratura')
    expect(chaveTermo('TRÍGONO')).toBe('trigono')
    expect(chaveTermo('  Meio do Céu  ')).toBe('meio do ceu')
  })

  it('chaveTermo sobrevive a normalize quebrado (Hermes sem Intl)', () => {
    const original = String.prototype.normalize
    try {
      // eslint-disable-next-line no-extend-native
      String.prototype.normalize = function (this: string) { return String(this) } as any
      // Sem decomposição o acento permanece; o importante é não explodir e ainda
      // casar o que já vem sem acento (que é como as chaves são escritas).
      expect(chaveTermo('Quadratura')).toBe('quadratura')
      expect(explicarTermo('quadratura', 'pt-BR')).toBeTruthy()
    } finally {
      // eslint-disable-next-line no-extend-native
      String.prototype.normalize = original
    }
  })

  it('explicarTermo e simplificarTermo devolvem null para o que não é do glossário', () => {
    expect(explicarTermo('banana', 'pt-BR')).toBeNull()
    expect(simplificarTermo('banana', 'pt-BR')).toBeNull()
    // Ascendente existe, mas de propósito NÃO tem substituto simples.
    expect(explicarTermo('ascendente', 'pt-BR')).toBeTruthy()
    expect(simplificarTermo('ascendente', 'pt-BR')).toBeNull()
  })

  it('cobre os termos que mais aparecem na interface', () => {
    for (const t of ['quadratura', 'sextil', 'trigono', 'orbe', 'ascendente', 'casa', 'transito']) {
      expect(GLOSSARIO[t], `"${t}" é dos mais frequentes na UI e precisa estar no glossário`).toBeTruthy()
    }
  })
})
