import { describe, it, expect } from 'vitest'
import { resolveNatalPlanetAspectText, resolveNatalMinorAspectText, isMinorAspect } from '../natalInterpretation'
import { resolveSolarReturnAspectText, resolveLunarReturnAspectText } from '../solarReturnInterpretation'

// ⚠️ Segundo buraco da mesma família do de ângulos: o catálogo curado tem
// EXATAMENTE 225 chaves = 45 pares × 5 aspectos maiores. Quincúncio,
// semiquadratura e sesquiquadratura entre dois planetas nunca estiveram lá, e o
// motor os emite — "Júpiter quincúncio Urano · 0.1°" aparecia com orbe e sem
// texto. Como no outro caso, o teste mira a PORTA que a tela chama.
const PLANETAS = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto']
const MENORES = ['quincúncio', 'semiquadratura', 'sesquiquadratura']
const IDIOMAS = ['pt-BR', 'en-US', 'es-ES', 'it-IT']

describe('aspectos menores entre planetas', () => {
  it('os 45 pares × 3 menores × 4 idiomas resolvem pela porta da tela', () => {
    const vazios: string[] = []
    for (const lang of IDIOMAS) {
      for (let i = 0; i < PLANETAS.length; i++) {
        for (let j = i + 1; j < PLANETAS.length; j++) {
          for (const asp of MENORES) {
            for (const [a, b] of [[PLANETAS[i], PLANETAS[j]], [PLANETAS[j], PLANETAS[i]]] as const) {
              const t = resolveNatalPlanetAspectText(a, asp, b, lang)
              if (!t || t.trim().length < 60) vazios.push(`${lang} ${a} ${asp} ${b}`)
            }
          }
        }
      }
    }
    expect(vazios, `sem texto:\n${vazios.slice(0, 20).join('\n')}`).toEqual([])
  })

  it('a ordem do par não muda o texto — o motor emite em qualquer ordem', () => {
    for (const asp of MENORES) {
      const ab = resolveNatalPlanetAspectText('Jupiter', asp, 'Sun', 'pt-BR')
      const ba = resolveNatalPlanetAspectText('Sun', asp, 'Jupiter', 'pt-BR')
      expect(ab, asp).toBe(ba)
    }
  })

  it('os três menores leem DIFERENTE entre si (não é o mesmo aviso com outras palavras)', () => {
    const textos = MENORES.map(a => resolveNatalPlanetAspectText('Jupiter', a, 'Uranus', 'pt-BR'))
    expect(new Set(textos).size).toBe(3)
  })

  it('variantes de nome do aspecto em 4 idiomas chegam ao mesmo texto', () => {
    const alvo = resolveNatalPlanetAspectText('Sun', 'quincúncio', 'Pluto', 'pt-BR')
    for (const v of ['quincunx', 'inconjunct', 'quincuncio', 'Quinconce']) {
      expect(resolveNatalPlanetAspectText('Sun', v, 'Pluto', 'pt-BR'), v).toBe(alvo)
    }
    const semi = resolveNatalPlanetAspectText('Sun', 'semiquadratura', 'Pluto', 'pt-BR')
    for (const v of ['semisquare', 'semicuadratura', 'semiquadrato']) {
      expect(resolveNatalPlanetAspectText('Sun', v, 'Pluto', 'pt-BR'), v).toBe(semi)
    }
    const sesqui = resolveNatalPlanetAspectText('Sun', 'sesquiquadratura', 'Pluto', 'pt-BR')
    for (const v of ['sesquisquare', 'sesquicuadratura', 'sesquiquadrato']) {
      expect(resolveNatalPlanetAspectText('Sun', v, 'Pluto', 'pt-BR'), v).toBe(sesqui)
    }
  })

  it('o composer NÃO rouba os aspectos maiores do catálogo curado', () => {
    for (const asp of ['conjunção', 'sextil', 'quadratura', 'trígono', 'oposição']) {
      expect(resolveNatalMinorAspectText('Sun', asp, 'Moon', 'pt-BR'), asp).toBeNull()
      expect(resolveNatalPlanetAspectText('Sun', asp, 'Moon', 'pt-BR'), asp).toBeTruthy()
    }
  })

  it('não inventa texto para quem não é planeta nem para o planeta consigo mesmo', () => {
    expect(resolveNatalMinorAspectText('Ascendant', 'quincúncio', 'Midheaven', 'pt-BR')).toBeNull()
    expect(resolveNatalMinorAspectText('Chiron', 'quincúncio', 'Sun', 'pt-BR')).toBeNull()
    expect(resolveNatalMinorAspectText('Sun', 'quincúncio', 'Sun', 'pt-BR')).toBeNull()
  })

  it('es-ES sem tildes nem ñ, it-IT sem acentos', () => {
    for (const asp of MENORES) {
      expect(resolveNatalPlanetAspectText('Moon', asp, 'Saturn', 'es-ES')!, asp).not.toMatch(/[áéíóúüñ]/i)
      expect(resolveNatalPlanetAspectText('Moon', asp, 'Saturn', 'it-IT')!, asp).not.toMatch(/[àèìòùáéíóú]/i)
    }
  })

  // As visões Solar e Lunar da aba Mapa compõem pelo domínio do ANO, que só
  // tem os 5 aspectos maiores, e caem no resolver natal quando falta dinâmica
  // ou domínio. Ou seja: herdam os dois composers. Travado aqui porque o João
  // pediu a cobertura "no Natal E NOS OUTROS", e esse elo é fácil de quebrar
  // sem ninguém perceber — é um `||` no fim de outra função.
  it('Solar e Lunar herdam a cobertura pelo fallback no resolver natal', () => {
    for (const asp of [...MENORES, 'quincúncio']) {
      expect(resolveSolarReturnAspectText('Jupiter', asp, 'Uranus', 'pt-BR'), `solar ${asp}`).toBeTruthy()
      expect(resolveLunarReturnAspectText('Jupiter', asp, 'Uranus', 'pt-BR'), `lunar ${asp}`).toBeTruthy()
    }
    // E os ângulos, que não têm domínio de ano nenhum.
    expect(resolveSolarReturnAspectText('Mercury', 'conjunção', 'Ascendant', 'pt-BR')).toBeTruthy()
    expect(resolveLunarReturnAspectText('Moon', 'semiquadratura', 'ImumCoeli', 'pt-BR')).toBeTruthy()
  })

  // O toggle da aba Mapa esconde o que esta função classifica como menor. Se ela
  // marcasse um aspecto maior por engano, desligar os menores apagaria leitura de
  // verdade do mapa — e ninguém notaria, porque o conteúdo some em silêncio.
  it('isMinorAspect separa menor de maior em todos os idiomas', () => {
    const menores = [
      'quincúncio', 'quincunx', 'quinconce', 'inconjunct', 'quincuncio',
      'semiquadratura', 'semisquare', 'semicuadratura', 'semiquadrato',
      'sesquiquadratura', 'sesquisquare', 'sesquicuadratura', 'sesquiquadrato',
      'semissextil', 'semisextile', 'semisestile',
    ]
    for (const a of menores) expect(isMinorAspect(a), a).toBe(true)

    const maiores = [
      'conjunção', 'conjunction', 'conjuncion', 'congiunzione',
      'sextil', 'sextile', 'sestile',
      'quadratura', 'square', 'cuadratura',
      'trígono', 'trine', 'trigono', 'trino',
      'oposição', 'opposition', 'oposicion', 'opposizione',
    ]
    for (const a of maiores) expect(isMinorAspect(a), a).toBe(false)

    // ⚠️ O caso que engana: "semiquadratura" contém "quadratura", e
    // "semisquare" contém "square". Se a classificação olhasse só o trecho, o
    // maior e o menor cairiam no mesmo lado.
    expect(isMinorAspect('quadratura')).toBe(false)
    expect(isMinorAspect('semiquadratura')).toBe(true)
    expect(isMinorAspect('')).toBe(false)
  })

  it('en-US sem "will" (regra do projeto: presente, não futuro)', () => {
    for (const asp of MENORES) {
      expect(resolveNatalPlanetAspectText('Mars', asp, 'Neptune', 'en-US')!, asp).not.toMatch(/\bwill\b/i)
    }
  })
})
