import { describe, it, expect } from 'vitest'
import LocationService, { SUPPORTED_COUNTRY_CODES } from '../LocationService'
describe('getSupportedCountries', () => {
  it('retorna todos os países suportados com bandeira e nome', async () => {
    const list = await LocationService.getSupportedCountries('', 'pt-BR')
    expect(list.length).toBe(SUPPORTED_COUNTRY_CODES.length)
    expect(list.every(c => c.flag && c.name && c.code)).toBe(true)
    expect(list.some(c => c.code === 'US')).toBe(true)
    expect(list.some(c => c.code === 'IT')).toBe(true)
    expect(list.some(c => c.code === 'BR')).toBe(true)
    expect(list.some(c => c.code === 'ES')).toBe(true)
    expect(list.some(c => c.code === 'PT')).toBe(true)
  })
  it('filtra por busca', async () => {
    const r = await LocationService.getSupportedCountries('bras', 'pt-BR')
    expect(r.some(c => c.code === 'BR')).toBe(true)
  })
})
