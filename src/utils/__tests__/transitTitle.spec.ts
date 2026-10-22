import { describe, it, expect } from 'vitest'
import { buildTransitTitle, rotuloDeAspecto } from '../transitPresentation'

// Os rótulos "(trânsito)/(natal)" existem porque títulos como "Lua □ Lua" ou
// "Plutão △ Júpiter" não diziam qual lado era qual. Mas eles SÓ podem aparecer
// quando o alvo é um ponto natal — em alvo de casa/ingresso a frase já diz
// "em trânsito na Casa X" e o rótulo seria redundante/errado.

describe('buildTransitTitle — rótulos trânsito/natal', () => {
  it('marca os dois lados quando o alvo é um planeta natal', () => {
    const title = buildTransitTitle(
      { transitPlanet: 'Pluto', aspectLabel: 'trigono', targetLabel: 'Jupiter' },
      'pt-BR',
    )
    expect(title).toContain('(trânsito)')
    expect(title).toContain('(natal)')
    // trânsito vem primeiro (convenção do app e da astrologia)
    expect(title.indexOf('(trânsito)')).toBeLessThan(title.indexOf('(natal)'))
  })

  it('desfaz a ambiguidade do mesmo planeta dos dois lados', () => {
    const title = buildTransitTitle(
      { transitPlanet: 'Moon', aspectLabel: 'quadratura', targetLabel: 'Moon' },
      'pt-BR',
    )
    expect(title).toMatch(/\(trânsito\).*\(natal\)/)
  })

  it('marca ângulos natais (ASC/MC) como natal', () => {
    const title = buildTransitTitle(
      { transitPlanet: 'Jupiter', aspectLabel: 'conjuncao', targetLabel: 'MC' },
      'pt-BR',
    )
    expect(title).toContain('(natal)')
  })

  it('NÃO rotula quando o alvo é uma casa', () => {
    const title = buildTransitTitle(
      { transitPlanet: 'Sun', aspectLabel: 'quadratura', targetLabel: 'Casa 7' },
      'pt-BR',
    )
    expect(title).not.toContain('(natal)')
  })

  it('NÃO rotula trânsito sem alvo (só casa)', () => {
    const title = buildTransitTitle({ transitPlanet: 'Sun', houseNumber: 7 }, 'pt-BR')
    expect(title).not.toContain('(natal)')
    expect(title).not.toContain('(trânsito)')
  })

  it('traduz os rótulos nos 4 idiomas', () => {
    const base = { transitPlanet: 'Pluto', aspectLabel: 'trigono', targetLabel: 'Jupiter' }
    expect(buildTransitTitle(base, 'en-US')).toContain('(transit)')
    expect(buildTransitTitle(base, 'en-US')).toContain('(natal)')
    expect(buildTransitTitle(base, 'es-ES')).toContain('(transito)')
    expect(buildTransitTitle(base, 'it-IT')).toContain('(transito)')
    expect(buildTransitTitle(base, 'it-IT')).toContain('(natale)')
  })
})

/**
 * ⚠️ O token do motor NÃO é texto de tela.
 *
 * `transitosRicos` grava `oposicao`, `quincuncio`, `trigono` — sem acento — e o
 * caminho do forecast grava em inglês (`square`, `trine`). Toda tela que mostrar
 * o token direto escreve errado em pt-BR, e isso não quebra nada: só aparece
 * torto para o usuário.
 */
describe('rótulo do aspecto', () => {
  it('acentua o token cru do motor em pt-BR', () => {
    expect(rotuloDeAspecto('oposicao')).toBe('Oposição')
    expect(rotuloDeAspecto('quincuncio')).toBe('Quincúncio')
    expect(rotuloDeAspecto('trigono')).toBe('Trígono')
    expect(rotuloDeAspecto('conjuncao')).toBe('Conjunção')
  })

  it('aceita o token em inglês que vem do forecast', () => {
    expect(rotuloDeAspecto('square')).toBe('Quadratura')
    expect(rotuloDeAspecto('trine')).toBe('Trígono')
    expect(rotuloDeAspecto('opposition')).toBe('Oposição')
  })

  it('respeita o idioma, sem tilde em es-ES nem acento em it-IT', () => {
    expect(rotuloDeAspecto('oposicao', 'es-ES')).toBe('Oposicion')
    expect(rotuloDeAspecto('conjuncao', 'it-IT')).toBe('Congiunzione')
    expect(rotuloDeAspecto('quadratura', 'en-US')).toBe('Square')
  })

  it('devolve vazio para entrada vazia, e devolve o texto quando não conhece', () => {
    expect(rotuloDeAspecto('')).toBe('')
    expect(rotuloDeAspecto(null)).toBe('')
    expect(rotuloDeAspecto(undefined)).toBe('')
    // Melhor mostrar o que veio do que um rótulo inventado.
    expect(rotuloDeAspecto('paralelo')).toBe('paralelo')
  })
})
