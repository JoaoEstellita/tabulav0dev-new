import { describe, it, expect } from 'vitest'
import { GLOSSARIO, simplificarTermo, type IdiomaGlossario } from '../../data/glossarioAstrologico'

const IDIOMAS: IdiomaGlossario[] = ['pt-BR', 'en-US', 'es-ES', 'it-IT']

/**
 * O modo Explicado troca o termo técnico pela palavra comum. A troca só vale se
 * ela for de fato mais simples que o original — trocar "sextil" por outro termo
 * de ramo não ajuda ninguém, e trocar por algo vago engana.
 */
describe('modo explicado — qualidade das trocas', () => {
  it('a troca existe para os termos que mais aparecem na UI', () => {
    // Estes são os de maior frequência na interface e os que mais travam leitura.
    for (const t of ['quadratura', 'sextil', 'trigono', 'conjuncao', 'oposicao', 'orbe']) {
      expect(simplificarTermo(t, 'pt-BR'), `"${t}" precisa de versão em linguagem comum`).toBeTruthy()
    }
  })

  it('não troca termo que não tem equivalente honesto', () => {
    // "Ascendente" e "retrógrado" são nomes próprios do campo: inventar sinônimo
    // seria pior que ensinar o termo com uma explicação ao toque.
    expect(simplificarTermo('ascendente', 'pt-BR')).toBeNull()
    expect(simplificarTermo('retrogrado', 'pt-BR')).toBeNull()
  })

  it('a palavra comum nunca é outro termo do glossário', () => {
    const ofensores: string[] = []
    for (const [termo, entrada] of Object.entries(GLOSSARIO)) {
      if (!entrada.simples) continue
      for (const idioma of IDIOMAS) {
        const chave = entrada.simples[idioma]
          .toLowerCase()
          .normalize('NFD')
          .replace(/[̀-ͯ]/g, '')
        if (GLOSSARIO[chave]) ofensores.push(`${termo}/${idioma} → "${chave}" ainda é jargão`)
      }
    }
    expect(ofensores).toEqual([])
  })

  it('a palavra comum é curta o bastante para caber no lugar do termo', () => {
    // Substituir inline não pode rebentar o layout: mais de 3 palavras vira frase.
    const longos: string[] = []
    for (const [termo, entrada] of Object.entries(GLOSSARIO)) {
      if (!entrada.simples) continue
      for (const idioma of IDIOMAS) {
        if (entrada.simples[idioma].split(/\s+/).length > 3) longos.push(`${termo}/${idioma}`)
      }
    }
    expect(longos).toEqual([])
  })
})
