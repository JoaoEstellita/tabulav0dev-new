import { describe, it, expect } from 'vitest'
import { polaridadeDoAspecto, aspectSymbol } from '../../astro/aspectSymbols'
import { aspectNature } from '../astro/pt'

describe('para onde o aspecto puxa', () => {
  it('macios puxam para o bom', () => {
    for (const a of ['trigono', 'trígono', 'sextil', 'semissextil']) {
      expect(polaridadeDoAspecto(a), a).toBe('bom')
    }
  })

  /**
   * ⚠️ OS MENORES DUROS CONTAM COMO DIFÍCEIS.
   *
   * Já houve uma versão que os tratava como neutros (`getAspectType`, corrigido
   * em `b96acf8`): quincúncio, semiquadratura e sesquiquadratura são tensos, e
   * são 25% dos trânsitos do dia. Neutralizá-los apagava um quarto da tensão
   * real da tela.
   */
  it('duros puxam para o difícil, maiores e menores', () => {
    for (const a of ['quadratura', 'oposicao', 'oposição', 'quincuncio', 'quincúncio',
                     'semiquadratura', 'sesquiquadratura']) {
      expect(polaridadeDoAspecto(a), a).toBe('dificil')
    }
  })

  /**
   * ⚠️ A CONJUNÇÃO DEPENDE DO PLANETA. Saturno em conjunção pesa; Vênus em
   * conjunção afaga. Tratá-la como neutra joga fora quase um quinto dos
   * trânsitos reais, e são os mais fortes — orbe pequeno, contato direto.
   */
  describe('a conjunção depende de quem chega', () => {
    it('planeta pesado torna a conjunção difícil', () => {
      for (const p of ['Saturn', 'Pluto', 'Mars', 'Neptune', 'Uranus']) {
        expect(polaridadeDoAspecto('conjuncao', p), p).toBe('dificil')
      }
    })
    it('planeta leve torna a conjunção boa', () => {
      for (const p of ['Venus', 'Jupiter', 'Sun', 'Moon', 'Mercury']) {
        expect(polaridadeDoAspecto('conjuncao', p), p).toBe('bom')
      }
    })
    it('aceita o nome em português, que é como o motor às vezes grava', () => {
      expect(polaridadeDoAspecto('conjuncao', 'Saturno')).toBe('dificil')
      expect(polaridadeDoAspecto('conjuncao', 'Plutão')).toBe('dificil')
    })
    it('sem planeta não inventa peso — cai no lado leve', () => {
      expect(polaridadeDoAspecto('conjuncao')).toBe('bom')
    })
  })

  /**
   * ⚠️ O BURACO QUE ESTA FUNÇÃO FECHA.
   *
   * `aspectNature` (em `utils/astro/pt`) devolve `'outro'` para SEMISSEXTIL,
   * enquanto `emocoesDoDia` o conta como macio — o mesmo aspecto classificado
   * de dois jeitos no mesmo app. Este teste documenta a divergência em vez de
   * deixá-la implícita: se alguém corrigir `aspectNature` um dia, ele quebra e
   * aponta para cá.
   */
  it('semissextil é macio aqui, mesmo que aspectNature diga "outro"', () => {
    expect(polaridadeDoAspecto('semissextil')).toBe('bom')
    expect(aspectNature('semissextil'), 'aspectNature mudou — reveja a divergência').toBe('outro')
  })

  it('aspecto desconhecido é neutro, não um palpite', () => {
    for (const a of ['', 'paralelo', 'xpto', undefined as any, null as any]) {
      expect(polaridadeDoAspecto(a), String(a)).toBe('neutro')
    }
  })

  /**
   * O chip mostra a direção e o glifo mostra QUAL aspecto é. Se um aspecto
   * tiver polaridade mas não tiver glifo, a linha fica com um chip colorido e
   * vazio — pior que não ter chip.
   */
  it('todo aspecto com polaridade tem glifo para pôr dentro do chip', () => {
    for (const a of ['trigono', 'sextil', 'semissextil', 'quadratura', 'oposicao',
                     'quincuncio', 'semiquadratura', 'sesquiquadratura', 'conjuncao']) {
      expect(polaridadeDoAspecto(a, 'Saturn'), a).not.toBe('neutro')
      expect(aspectSymbol(a), `${a} sem glifo`).toBeTruthy()
    }
  })
})
