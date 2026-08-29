import { describe, it, expect } from 'vitest'
import { NETWORK_INTERESTS, interestLabel, interestEmoji, type NetworkLang } from '../networkInterests'

const LANGS: NetworkLang[] = ['pt-BR', 'en-US', 'es-ES', 'it-IT']

describe('catálogo de interesses da Rede', () => {
  it('tem >= 20 tags, slugs válidos e i18n completo', () => {
    expect(NETWORK_INTERESTS.length).toBeGreaterThanOrEqual(20)
    for (const t of NETWORK_INTERESTS) {
      expect(t.slug).toMatch(/^[a-z0-9-]+$/)
      expect(t.emoji).toBeTruthy()
      for (const l of LANGS) expect(t.label[l]).toBeTruthy()
    }
  })

  it('slugs são únicos', () => {
    const slugs = NETWORK_INTERESTS.map((t) => t.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('es-ES sem tildes e it-IT sem acentos (regra do projeto)', () => {
    const accents = /[áàâãéêíóôõúüçñìòù]/i
    for (const t of NETWORK_INTERESTS) {
      expect(accents.test(t.label['es-ES'])).toBe(false)
      expect(accents.test(t.label['it-IT'])).toBe(false)
    }
  })

  it('interestLabel resolve com fallback; interestEmoji retorna emoji', () => {
    expect(interestLabel('musica', 'pt-BR')).toBe('Música')
    expect(interestLabel('musica', 'en-US')).toBe('Music')
    expect(interestLabel('inexistente', 'pt-BR')).toBe('inexistente')
    expect(interestEmoji('musica')).toBe('🎵')
  })
})
