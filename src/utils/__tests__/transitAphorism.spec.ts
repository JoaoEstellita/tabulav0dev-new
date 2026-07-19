import { describe, it, expect } from 'vitest'
import { resolveTransitAphorism, resolveStrongestAphorism } from '../transitAphorism'

const t = (transitPlanet: string, type: string, natalPlanet: string, extra: any = {}) => ({
  transitPlanet,
  type,
  natalPlanet,
  ...extra,
})

describe('resolveTransitAphorism', () => {
  it('resolve pela mesma chave do texto curado', () => {
    expect(resolveTransitAphorism(t('Mercury', 'quadratura', 'Sun'), 'pt-BR')).toBe(
      'Se a fala é prata, o silêncio é ouro.',
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

describe('resolveStrongestAphorism', () => {
  it('pula os trânsitos sem frase e pega o primeiro que tem', () => {
    // Parar no mais forte deixaria a área quase sempre muda.
    const lista = [
      t('Neptune', 'semissextil', 'Pluto'), // sem frase
      t('Uranus', 'quincuncio', 'Neptune'), // sem frase
      t('Mercury', 'quadratura', 'Sun'), // tem
    ]
    expect(resolveStrongestAphorism(lista, 'pt-BR')).toBe('Se a fala é prata, o silêncio é ouro.')
  })

  it('devolve null quando nenhum tem frase', () => {
    expect(resolveStrongestAphorism([t('Neptune', 'semissextil', 'Pluto')], 'pt-BR')).toBeNull()
    expect(resolveStrongestAphorism([], 'pt-BR')).toBeNull()
    expect(resolveStrongestAphorism(null, 'pt-BR')).toBeNull()
  })
})
