import { describe, it, expect } from 'vitest'
import { dictionaries } from '../appI18n'

// Guarda das 2 regressões mais recorrentes de i18n:
//  1) toda chave existe nas 4 línguas (nada de idioma "cru" / fallback silencioso);
//  2) es-ES sem tildes e it-IT sem acentos (regra do projeto).
// `dictionaries` já vem com todos os postPatch* mesclados (Object.assign no load).

const LANGS = ['pt-BR', 'en-US', 'es-ES', 'it-IT'] as const

describe('appI18n — paridade de chaves', () => {
  const union = new Set<string>()
  for (const l of LANGS) for (const k of Object.keys(dictionaries[l])) union.add(k)

  for (const lang of LANGS) {
    it(`${lang} tem todas as ${union.size} chaves`, () => {
      const has = new Set(Object.keys(dictionaries[lang]))
      const missing = [...union].filter((k) => !has.has(k))
      expect(missing, `faltando em ${lang}: ${missing.slice(0, 20).join(', ')}`).toEqual([])
    })
  }
})

describe('appI18n — regra de acentuação', () => {
  // Caracteres acentuados latinos (inclui ñ e tildes). pt-BR e en-US ficam livres.
  const ACCENTED = /[áàâãäéèêëíìîïóòôõöúùûüçñÁÀÂÃÄÉÈÊËÍÌÎÏÓÒÔÕÖÚÙÛÜÇÑ]/

  for (const lang of ['es-ES', 'it-IT'] as const) {
    it(`${lang} não usa acentos`, () => {
      const offenders: string[] = []
      for (const [k, v] of Object.entries(dictionaries[lang])) {
        if (typeof v === 'string' && ACCENTED.test(v)) offenders.push(`${k} = ${v}`)
      }
      expect(offenders, `${lang} com acento:\n${offenders.slice(0, 20).join('\n')}`).toEqual([])
    })
  }
})
