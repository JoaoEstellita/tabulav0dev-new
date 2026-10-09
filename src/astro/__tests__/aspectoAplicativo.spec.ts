import { describe, it, expect } from 'vitest'
import {
  movimentoDoAspecto,
  movimentoPorNome,
  orbeComSinal,
  anguloDoAspecto,
} from '../aspectoAplicativo'

/**
 * Aplicativo × separativo.
 *
 * É a diferença entre "vai acontecer" e "já aconteceu". Marcar errado inverte
 * o sentido do aspecto na leitura — e não dá erro nenhum, porque as duas
 * respostas são plausíveis.
 *
 * O caso que mais importa acertar é o RETRÓGRADO: velocidade negativa inverte
 * o sentido, e é justamente quando a leitura fica interessante.
 */

describe('orbe com sinal', () => {
  it('zero no aspecto exato', () => {
    expect(orbeComSinal(0, 90, 90)).toBeCloseTo(0, 10)
    expect(orbeComSinal(10, 130, 120)).toBeCloseTo(0, 10)
  })

  it('o sinal diz de que lado da exatidão estão', () => {
    // Separação maior que o aspecto: orbe positivo.
    expect(orbeComSinal(0, 95, 90)).toBeCloseTo(5, 10)
    // Separação menor: orbe negativo.
    expect(orbeComSinal(0, 85, 90)).toBeCloseTo(-5, 10)
  })

  it('a conjunção funciona na volta do zodíaco', () => {
    // 359° e 2° estão a 3° de conjunção, não a 357°.
    expect(Math.abs(orbeComSinal(359, 2, 0))).toBeCloseTo(3, 10)
  })
})

describe('movimento com planetas diretos', () => {
  it('o mais rápido atrás, alcançando: APLICATIVO', () => {
    // Lua (13°/dia) a 85° do Sol (1°/dia), indo para a quadratura de 90°.
    expect(movimentoDoAspecto(0, 85, 90, 1, 13)).toBe('aplicativo')
  })

  it('o mais rápido já passou: SEPARATIVO', () => {
    // Lua a 95°, afastando-se da quadratura.
    expect(movimentoDoAspecto(0, 95, 90, 1, 13)).toBe('separativo')
  })

  it('vale para conjunção e oposição também', () => {
    expect(movimentoDoAspecto(0, 357, 0, 1, 13), 'Lua chegando na conjunção').toBe('aplicativo')
    expect(movimentoDoAspecto(0, 175, 180, 1, 13), 'Lua chegando na oposição').toBe('aplicativo')
    expect(movimentoDoAspecto(0, 185, 180, 1, 13), 'Lua passando da oposição').toBe('separativo')
  })
})

describe('retrógrado inverte o sentido — é o caso que mais importa', () => {
  it('planeta retrógrado voltando para o aspecto: APLICATIVO', () => {
    // O corpo 2 já passou (95° > 90°) mas está retrógrado: volta para a
    // exatidão. Tratá-lo como direto diria "separativo", que é o oposto.
    expect(movimentoDoAspecto(0, 95, 90, 0, -0.3)).toBe('aplicativo')
  })

  it('planeta retrógrado afastando-se: SEPARATIVO', () => {
    expect(movimentoDoAspecto(0, 85, 90, 0, -0.3)).toBe('separativo')
  })

  it('os dois retrógrados: vale a velocidade RELATIVA', () => {
    // Ambos voltando, mas o 2 mais rápido: a separação encolhe.
    expect(movimentoDoAspecto(0, 95, 90, -0.1, -0.5)).toBe('aplicativo')
  })
})

describe('quando não dá para saber, não chuta', () => {
  it('sem velocidade devolve estacionário', () => {
    expect(movimentoDoAspecto(0, 85, 90, undefined, undefined)).toBe('estacionario')
    expect(movimentoDoAspecto(0, 85, 90, 1, null)).toBe('estacionario')
    expect(movimentoDoAspecto(0, 85, 90, 1, NaN)).toBe('estacionario')
  })

  it('velocidades iguais: a distância não muda', () => {
    expect(movimentoDoAspecto(0, 85, 90, 1, 1)).toBe('estacionario')
  })

  it('longitude inválida não quebra', () => {
    expect(movimentoDoAspecto(NaN, 85, 90, 1, 13)).toBe('estacionario')
  })
})

describe('ângulo pelo nome do aspecto', () => {
  it('reconhece os nomes do motor, com acento e caixa', () => {
    expect(anguloDoAspecto('conjuncao')).toBe(0)
    expect(anguloDoAspecto('quadratura')).toBe(90)
    expect(anguloDoAspecto('trígono')).toBe(120)
    expect(anguloDoAspecto('OPOSIÇÃO')).toBe(180)
    expect(anguloDoAspecto('quincuncio')).toBe(150)
  })

  it('aceita os nomes em inglês', () => {
    expect(anguloDoAspecto('square')).toBe(90)
    expect(anguloDoAspecto('trine')).toBe(120)
    expect(anguloDoAspecto('opposition')).toBe(180)
  })

  it('aspecto desconhecido devolve null em vez de zero', () => {
    // Zero seria conjunção — um default perigoso.
    expect(anguloDoAspecto('invencao')).toBeNull()
    expect(anguloDoAspecto('')).toBeNull()
  })
})

describe('atalho por nome e corpos', () => {
  it('monta tudo a partir do que a roda já tem', () => {
    const sol = { longitude: 0, speed: 1 }
    const lua = { longitude: 85, speed: 13 }
    expect(movimentoPorNome('quadratura', sol, lua)).toBe('aplicativo')
  })

  it('corpo ausente ou aspecto desconhecido não quebra', () => {
    expect(movimentoPorNome('quadratura', null, { longitude: 85, speed: 13 })).toBe('estacionario')
    expect(movimentoPorNome('invencao', { longitude: 0, speed: 1 }, { longitude: 85, speed: 13 })).toBe('estacionario')
  })
})
