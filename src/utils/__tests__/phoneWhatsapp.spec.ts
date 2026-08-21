import { describe, expect, it } from 'vitest'
import { splitWhatsapp, toE164 } from '../phoneWhatsapp'

describe('splitWhatsapp — detecta DDI de um número guardado', () => {
  it('BR com 55 → ddi 55 + local', () => {
    expect(splitWhatsapp('5522992454642')).toEqual({ ddi: '55', local: '22992454642' })
  })
  it('EUA/CA com 1 → ddi 1 + local (não confunde com BR)', () => {
    expect(splitWhatsapp('12025551234')).toEqual({ ddi: '1', local: '2025551234' })
  })
  it('Portugal 351 → ddi 351 + local', () => {
    expect(splitWhatsapp('351912345678')).toEqual({ ddi: '351', local: '912345678' })
  })
  it('E.164 com "+" → ignora o + e detecta o código', () => {
    expect(splitWhatsapp('+5522992454642')).toEqual({ ddi: '55', local: '22992454642' })
  })
  it('vazio → fallback 55, local vazio', () => {
    expect(splitWhatsapp('')).toEqual({ ddi: '55', local: '' })
  })
  it('BR cru sem código (nenhum DDI casa) → cai no fallback 55', () => {
    // "22..." não é um código; sem prefixo válido, o DDI vai pro fallback.
    expect(splitWhatsapp('22992454642')).toEqual({ ddi: '55', local: '22992454642' })
  })
  it('respeita fallback custom quando nada casa', () => {
    expect(splitWhatsapp('', '1')).toEqual({ ddi: '1', local: '' })
  })
})

describe('toE164 — monta +<ddi><local> só com dígitos', () => {
  it('BR', () => {
    expect(toE164('55', '22992454642')).toBe('+5522992454642')
  })
  it('EUA', () => {
    expect(toE164('1', '2025551234')).toBe('+12025551234')
  })
  it('local vazio → string vazia (não emite "+55")', () => {
    expect(toE164('55', '')).toBe('')
  })
  it('limpa formatação do local e do ddi', () => {
    expect(toE164('+55', '(22) 99245-4642')).toBe('+5522992454642')
  })
})
