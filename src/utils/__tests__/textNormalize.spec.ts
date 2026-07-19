import { describe, it, expect } from 'vitest'
import { deaccentLower, hasMojibake } from '../textNormalize'

describe('deaccentLower', () => {
  it('deixa o guard casar com as duas grafias', () => {
    // O motivo de existir: as listas de token dos specs estão sem acento.
    expect(deaccentLower('É INEVITÁVEL')).toContain('inevitavel')
    expect(deaccentLower('inevitavel')).toContain('inevitavel')
    expect(deaccentLower('Júpiter')).toBe('jupiter')
    expect(deaccentLower('Coração, Ângulo e Vênus')).toBe('coracao, angulo e venus')
  })

  it('não quebra com entrada vazia', () => {
    expect(deaccentLower('')).toBe('')
    expect(deaccentLower(null as any)).toBe('')
  })
})

describe('hasMojibake', () => {
  it('pega a assinatura real: byte C3/C2 seguido da faixa de continuação', () => {
    expect(hasMojibake('coraÃ§Ã£o')).toBe(true) // "coração" lido como latin-1
    expect(hasMojibake('espaÃ§o')).toBe(true)
    expect(hasMojibake('texto com � perdido')).toBe(true)
  })

  it('NÃO acusa português correto que legitimamente usa Â e Ã', () => {
    // O guard antigo era /(?:Ã|Â|�)/ e descartava estes textos como corrompidos:
    // toda entrada do catálogo que começasse com "Ângulo" morria em silêncio.
    expect(hasMojibake('Ângulo de contato')).toBe(false)
    expect(hasMojibake('Âncora prática')).toBe(false)
    expect(hasMojibake('Ânimo renovado')).toBe(false)
    expect(hasMojibake('IRMÃS E IRMÃOS')).toBe(false)
    expect(hasMojibake('Sol em quadratura a Mercúrio natal')).toBe(false)
  })
})
