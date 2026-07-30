import { describe, it, expect } from 'vitest'
import { NAKSHATRAS, nakshatraFromSidereal } from '../../astro/vedic/nakshatra'
import { computeGunaMilan } from '../../astro/vedic/gunaMilan'
import { resolveNakshatra, resolveGunaMilan, resolveDasha, resolveMoonNakshatraDaily } from '../vedicInterpretation'
import { NAKSHATRA_PTBR } from '../../data/vedic/nakshatraOverridesPtBR'
import { NAKSHATRA_I18N } from '../../data/vedic/nakshatraOverridesI18n'
import { KUTA_PTBR } from '../../data/vedic/kutaOverridesPtBR'
import { DASHA_PTBR } from '../../data/vedic/dashaOverridesPtBR'
import { DASHA_I18N } from '../../data/vedic/dashaOverridesI18n'
import { VIMSHOTTARI } from '../../astro/vedic/dasha'

describe('cobertura de conteúdo pt-BR', () => {
  it('todos os 27 nakshatras têm conteúdo curado com campos não-vazios', () => {
    NAKSHATRAS.forEach((n) => {
      const c = NAKSHATRA_PTBR[n.key]
      expect(c, `faltou conteúdo: ${n.key}`).toBeTruthy()
      expect(c!.essencia).toBeTruthy()
      expect(c!.personalidade).toBeTruthy()
      expect(c!.forcas.length).toBeGreaterThan(0)
      expect(c!.moodLine).toBeTruthy()
      expect(c!.deity).not.toBe('—')
    })
  })
  it('todos os 8 kutas e 9 dashas têm conteúdo', () => {
    ;['varna', 'vashya', 'tara', 'yoni', 'graha_maitri', 'gana', 'bhakoot', 'nadi'].forEach((k) =>
      expect(KUTA_PTBR[k]?.nome, k).toBeTruthy())
    VIMSHOTTARI.forEach((v) => expect(DASHA_PTBR[v.lord]?.tema, v.lord).toBeTruthy())
  })
})

describe('resolveNakshatra', () => {
  it('nakshatra com conteúdo curado (Mrigashira) → hasContent + deidade', () => {
    const r = resolveNakshatra(NAKSHATRAS[4], { pada: 1, rashiName: 'Touro' })
    expect(r.name).toBe('Mrigashira')
    expect(r.hasContent).toBe(true)
    expect(r.deity).toMatch(/Soma/)
    expect(r.lordPt).toBe('Marte')
    expect(r.forcas.length).toBeGreaterThan(0)
  })
  it('nakshatra com chave desconhecida → fallback seguro (não quebra, não inventa)', () => {
    const fake = { index: 99, key: 'zzz_inexistente', name: 'Teste', lord: 'jupiter', yoni: 'horse', gana: 'deva', nadi: 'adi' } as any
    const r = resolveNakshatra(fake)
    expect(r.hasContent).toBe(false)
    expect(r.name).toBe('Teste')
    expect(r.essencia).toMatch(/regida por/)
    expect(r.forcas).toEqual([])
  })
})

describe('resolveGunaMilan (João Mrigashira × Érica Krittika)', () => {
  const joao = nakshatraFromSidereal(55.49) // Mrigashira / Touro
  const erica = nakshatraFromSidereal(27.92) // Krittika / Áries
  const resolved = resolveGunaMilan(computeGunaMilan(joao, erica))

  it('banda baixa com texto e disclaimer', () => {
    expect(resolved.bandKey).toBe('baixo')
    expect(resolved.bandTexto).toMatch(/não condena|lente/i)
    expect(resolved.disclaimer).toMatch(/Nadi/)
  })
  it('cada kuta traz leitura textual e respeita o máximo', () => {
    expect(resolved.kutas).toHaveLength(8)
    resolved.kutas.forEach((k) => {
      expect(k.nome).toBeTruthy()
      expect(k.leitura).toBeTruthy()
      expect(k.points).toBeLessThanOrEqual(k.max)
    })
  })
  it('Nadi limpo (8/8, sem dosha) e Bhakoot com dosha', () => {
    const nadi = resolved.kutas.find((k) => k.key === 'nadi')!
    expect(nadi.points).toBe(8)
    expect(resolved.hasNadiDosha).toBe(false)
    expect(resolved.hasBhakootDosha).toBe(true)
  })
})

describe('resolveDasha + Lua do dia', () => {
  it('dasha da Lua traz tema e palavras-chave', () => {
    const r = resolveDasha({ lord: 'moon', start: new Date('2000-01-01'), end: new Date('2010-01-01') })
    expect(r?.nome).toBe('Lua')
    expect(r?.tema).toBeTruthy()
    expect(r?.palavrasChave.length).toBeGreaterThan(0)
  })
  it('resolveDasha(null) → null', () => {
    expect(resolveDasha(null)).toBeNull()
  })
  it('Lua do dia monta a frase com moodLine', () => {
    const s = resolveMoonNakshatraDaily(NAKSHATRAS[4])
    expect(s).toMatch(/Mrigashira/)
    expect(s).toMatch(/curiosidade/)
  })
})

describe('i18n védico (en/es/it)', () => {
  it('resolveNakshatra em en-US traduz a essência (não é o pt)', () => {
    const r = resolveNakshatra(NAKSHATRAS[4], { lang: 'en-US' })
    expect(r.essencia).toMatch(/subtle search/i)
    expect(r.essencia).not.toMatch(/busca sutil/)
  })
  it('resolveDasha em es-ES traduz o tema', () => {
    const r = resolveDasha({ lord: 'jupiter', start: new Date(), end: new Date() }, 'es-ES')
    expect(r?.tema).toMatch(/sabiduria|crecimiento/i)
  })
  it('cobertura i18n: 27 nakshatras com essência+personalidade em en/es/it', () => {
    ;(['en-US', 'es-ES', 'it-IT'] as const).forEach((lang) => {
      NAKSHATRAS.forEach((n) => {
        const t = NAKSHATRA_I18N[lang]?.[n.key]
        expect(t?.essencia, `${lang}/${n.key} essencia`).toBeTruthy()
        expect(t?.personalidade, `${lang}/${n.key} personalidade`).toBeTruthy()
      })
    })
  })
  it('cobertura i18n: 9 dashas em en/es/it', () => {
    const lords = ['ketu', 'venus', 'sun', 'moon', 'mars', 'rahu', 'jupiter', 'saturn', 'mercury']
    ;(['en-US', 'es-ES', 'it-IT'] as const).forEach((lang) => {
      lords.forEach((l) => expect(DASHA_I18N[lang]?.[l], `${lang}/${l}`).toBeTruthy())
    })
  })
})
