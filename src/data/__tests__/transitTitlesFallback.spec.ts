import { describe, it, expect } from 'vitest'
import { TRANSIT_TITLES_PTBR, buildFallbackTransitTitle } from '../transitTitlesPtBR'

describe('buildFallbackTransitTitle', () => {
  it('nomeia o agente e o alvo', () => {
    expect(buildFallbackTransitTitle('Mars', 'Saturn', 'quadratura')).toBe(
      'Impulso e estrutura em choque',
    )
    expect(buildFallbackTransitTitle('Moon', 'MC', 'trigono')).toBe(
      'Sensibilidade e carreira em fluxo',
    )
    expect(buildFallbackTransitTitle('Sun', 'IC', 'conjuncao')).toBe(
      'Vitalidade e raízes no mesmo ponto',
    )
  })

  it('o planeta em trânsito separa títulos que antes colidiam', () => {
    // O bug que motivou a v2: sem o agente, estes três eram o mesmo texto.
    const mesmoAlvoMesmoAspecto = ['Mars', 'Moon', 'Saturn'].map((p) =>
      buildFallbackTransitTitle(p, 'Saturn', 'quincuncio'),
    )
    expect(new Set(mesmoAlvoMesmoAspecto).size).toBe(3)
  })

  it('cada aspecto tem encontro próprio', () => {
    const aspectos = [
      'conjuncao',
      'sextil',
      'trigono',
      'quadratura',
      'oposicao',
      'quincuncio',
      'semissextil',
      'semiquadratura',
      'sesquiquadratura',
    ]
    const titulos = aspectos.map((a) => buildFallbackTransitTitle('Mars', 'Mercury', a))
    expect(new Set(titulos).size).toBe(aspectos.length)
  })

  it('encontro é locução invariável — nada de concordar com dois gêneros', () => {
    // "Sensibilidade e poder pessoal" mistura feminino e masculino: qualquer
    // adjetivo erraria a concordância de um dos dois lados.
    const t = buildFallbackTransitTitle('Moon', 'Pluto', 'oposicao')
    expect(t).toBe('Sensibilidade e poder pessoal em polos opostos')
  })

  it('aceita o alvo acentuado e por extenso', () => {
    expect(buildFallbackTransitTitle('Venus', 'Fundo do Céu', 'sextil')).toBe(
      'Afeto e raízes em sintonia',
    )
    expect(buildFallbackTransitTitle('Mercury', 'Ascendente', 'quadratura')).toBe(
      'Raciocínio e imagem em choque',
    )
  })

  it('aspecto desconhecido degrada para "em contato" em vez de sumir', () => {
    expect(buildFallbackTransitTitle('Mars', 'Mercury', 'quintil')).toBe(
      'Impulso e comunicação em contato',
    )
  })

  it('agente desconhecido cai na forma curta em vez de sumir', () => {
    expect(buildFallbackTransitTitle('Ceres', 'Saturn', 'quadratura')).toBe(
      'Estrutura em choque',
    )
  })

  it('cabe numa linha do card', () => {
    const todos: string[] = []
    for (const p of ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto']) {
      for (const alvo of ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto', 'ASC', 'MC', 'IC', 'DC']) {
        for (const asp of ['conjuncao', 'oposicao', 'quincuncio', 'sesquiquadratura']) {
          const t = buildFallbackTransitTitle(p, alvo, asp)
          if (t) todos.push(t)
        }
      }
    }
    expect(todos.length).toBeGreaterThan(500)
    const maisLongo = todos.reduce((a, b) => (b.length > a.length ? b : a))
    expect(maisLongo.length).toBeLessThanOrEqual(52)
  })

  it('planeta sobre a própria posição natal é retorno, não encontro', () => {
    // "Impulso e ação no mesmo ponto" descreveria mal um retorno de Marte.
    expect(buildFallbackTransitTitle('Mars', 'Mars', 'conjuncao')).toBe('Retorno de Marte')
    expect(buildFallbackTransitTitle('Saturn', 'Saturn', 'conjuncao')).toBe('Retorno de Saturno')
    // Só na conjunção: Saturno em quadratura ao próprio Saturno não é retorno.
    expect(buildFallbackTransitTitle('Saturn', 'Saturn', 'quadratura')).toBe(
      'Cobrança e estrutura em choque',
    )
  })

  it('devolve null quando o alvo é casa — ali o título de casa já se explica', () => {
    expect(buildFallbackTransitTitle('Mars', 'Casa 7', 'conjuncao')).toBeNull()
    expect(buildFallbackTransitTitle('Mars', '', 'conjuncao')).toBeNull()
  })

  it('curado tem prioridade sobre gerado', () => {
    // Se um dia o gerado vazar por cima do curado, este teste quebra.
    const chaveCurada = Object.keys(TRANSIT_TITLES_PTBR)[0]
    expect(TRANSIT_TITLES_PTBR[chaveCurada]).toBeTruthy()
    expect(TRANSIT_TITLES_PTBR[chaveCurada]).not.toMatch(
      / (no mesmo ponto|em sintonia|em fluxo|em choque|em polos opostos|sem encaixe|de raspão|em fricção|em atrito|em contato)$/,
    )
  })
})
