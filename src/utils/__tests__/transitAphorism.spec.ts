import { describe, it, expect } from 'vitest'
import { resolveTransitAphorism } from '../transitAphorism'

const t = (transitPlanet: string, type: string, natalPlanet: string, extra: any = {}) => ({
  transitPlanet,
  type,
  natalPlanet,
  ...extra,
})

describe('resolveTransitAphorism', () => {
  it('resolve pela mesma chave do texto curado', () => {
    expect(resolveTransitAphorism(t('Mercury', 'quadratura', 'Sun'), 'pt-BR')).toBe(
      'Se a palavra é prata, o silêncio é ouro.',
    )
    expect(resolveTransitAphorism(t('Saturn', 'conjuncao', 'Sun'), 'pt-BR')).toBe(
      'O ouro se prova no fogo; a pessoa, no tempo.',
    )
  })

  it('aceita as variações de nomenclatura que o app usa', () => {
    // Se a normalização divergisse da do catálogo, o aforismo apareceria no
    // trânsito errado — pior do que não aparecer.
    expect(resolveTransitAphorism(t('mercury', 'Quadratura', 'sun'), 'pt-BR')).toBeTruthy()
    expect(resolveTransitAphorism({ transitPlanet: 'Mercury', aspectName: 'quadratura', natalPlanet: 'Sun' }, 'pt-BR')).toBeTruthy()
  })

  it('devolve null fora do pt-BR — não há catálogo nos outros idiomas', () => {
    expect(resolveTransitAphorism(t('Mercury', 'quadratura', 'Sun'), 'en-US')).toBeNull()
    expect(resolveTransitAphorism(t('Mercury', 'quadratura', 'Sun'), 'es-ES')).toBeNull()
  })

  it('devolve null sem frase curada, em vez de inventar', () => {
    // Cobertura é 87 de 724: o caso comum é NÃO ter frase.
    expect(resolveTransitAphorism(t('Neptune', 'semissextil', 'Pluto'), 'pt-BR')).toBeNull()
    expect(resolveTransitAphorism(null, 'pt-BR')).toBeNull()
    expect(resolveTransitAphorism({}, 'pt-BR')).toBeNull()
  })
})
