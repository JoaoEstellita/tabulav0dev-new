import { describe, it, expect } from 'vitest'
import { palavraDeSentido } from '../../utils/palavraDeSentido'

/**
 * A âncora tocável da leitura do dia tem de ser uma palavra de SENTIDO.
 *
 * `buildArchetypeKeywordsForTransit` devolve, nesta ordem: nome do planeta em
 * trânsito, nome do aspecto, alvo, arquétipos, casa, área. Os primeiros são
 * justamente o que não serve de âncora — "Saturno" e "quadratura" não dizem a
 * ninguém o que fazer com o dia. Por isso a busca vem de trás para frente.
 *
 * Se esta escolha regredir, o texto volta a ficar com nome de planeta sublinhado
 * no meio da frase — tecnicamente certo e inútil para quem o app quer alcançar.
 */

describe('âncora da leitura do dia', () => {
  it('ignora o nome do planeta e o do aspecto', () => {
    const kw = ['Saturno', 'quadratura', 'Sol', 'estrutura']
    expect(palavraDeSentido(kw, 'Saturno', 'Sol', 'quadratura')).toBe('estrutura')
  })

  it('ignora localização ("Casa 7") — diz onde, não o quê', () => {
    const kw = ['Vênus', 'trígono', 'Casa 7', 'afeto']
    expect(palavraDeSentido(kw, 'Vênus', 'Lua', 'trígono')).toBe('afeto')
  })

  it('exige uma palavra só: âncora longa não se destaca no meio da frase', () => {
    const kw = ['Marte', 'sextil', 'iniciativa prática', 'impulso']
    expect(palavraDeSentido(kw, 'Marte', 'Marte', 'sextil')).toBe('impulso')
  })

  it('descarta palavra curta demais para ser clicável', () => {
    const kw = ['Lua', 'oposição', 'eu', 'cuidado']
    expect(palavraDeSentido(kw, 'Lua', 'Sol', 'oposição')).toBe('cuidado')
  })

  it('compara sem acento e sem caixa', () => {
    // "Vênus" na lista e "venus" vindo do dado não podem escapar do filtro.
    const kw = ['Vênus', 'Trígono', 'harmonia']
    expect(palavraDeSentido(kw, 'venus', 'lua', 'trigono')).toBe('harmonia')
  })

  it('devolve null quando só há nome próprio — e aí o texto usa o fallback', () => {
    expect(palavraDeSentido(['Saturno', 'Sol'], 'Saturno', 'Sol', 'conjunção')).toBeNull()
    expect(palavraDeSentido([], 'Saturno', 'Sol', 'conjunção')).toBeNull()
  })

  it('prefere o arquétipo mais específico, que vem por último', () => {
    // A lista vai do genérico ao específico; pegar o primeiro traria o nome.
    const kw = ['Júpiter', 'trígono', 'Lua', 'expansão', 'generosidade']
    expect(palavraDeSentido(kw, 'Júpiter', 'Lua', 'trígono')).toBe('generosidade')
  })
})
