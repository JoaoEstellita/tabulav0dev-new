import { describe, it, expect } from 'vitest'
import { TRANSIT_TITLES_PTBR, buildFallbackTransitTitle } from '../transitTitlesPtBR'

describe('buildFallbackTransitTitle', () => {
  it('cobre os alvos que apareciam crus na tela', () => {
    // Exatamente os do print do João: IC, MC, Saturno, Plutão.
    expect(buildFallbackTransitTitle('IC', 'conjuncao')).toBe('Foco nas raízes')
    expect(buildFallbackTransitTitle('MC', 'oposicao')).toBe('Confronto na carreira')
    expect(buildFallbackTransitTitle('Saturn', 'trigono')).toBe('Fluidez na estrutura')
    expect(buildFallbackTransitTitle('Pluto', 'trigono')).toBe('Fluidez no poder pessoal')
  })

  it('aceita o alvo acentuado e por extenso', () => {
    expect(buildFallbackTransitTitle('Ascendente', 'quadratura')).toBe('Tensão na sua imagem')
    expect(buildFallbackTransitTitle('Fundo do Céu', 'sextil')).toBe('Abertura nas raízes')
  })

  it('cada aspecto menor tem verbo próprio — senão viram cards idênticos', () => {
    const alvo = 'Mercury'
    const titulos = ['quincuncio', 'semissextil', 'semiquadratura', 'sesquiquadratura'].map((a) =>
      buildFallbackTransitTitle(alvo, a),
    )
    expect(new Set(titulos).size).toBe(4)
    expect(titulos).toContain('Ajuste na comunicação')
  })

  it('aspecto desconhecido não some — cai em "Ajuste"', () => {
    expect(buildFallbackTransitTitle('Mercury', 'quintil')).toBe('Ajuste na comunicação')
  })

  it('devolve null quando o alvo é casa — ali o título de casa já se explica', () => {
    expect(buildFallbackTransitTitle('Casa 7', 'conjuncao')).toBeNull()
    expect(buildFallbackTransitTitle('', 'conjuncao')).toBeNull()
  })

  it('curado tem prioridade sobre gerado', () => {
    // Se um dia o gerado vazar por cima do curado, este teste quebra.
    const chaveCurada = Object.keys(TRANSIT_TITLES_PTBR)[0]
    expect(TRANSIT_TITLES_PTBR[chaveCurada]).toBeTruthy()
    expect(TRANSIT_TITLES_PTBR[chaveCurada]).not.toMatch(
      /^(Foco|Abertura|Fluidez|Tensão|Confronto|Ajuste) n[ao]s? /,
    )
  })
})
