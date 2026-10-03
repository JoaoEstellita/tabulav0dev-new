import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'

/**
 * O guia de primeiro acesso precisa de saídas óbvias.
 *
 * Ele tinha uma única: um "Sair" em texto pequeno no rodapé do balão. Tocar fora
 * não fazia nada, não havia X, e o botão voltar do aparelho **encerrava o app** —
 * justamente o reflexo que quase todo mundo tenta primeiro para se livrar de um
 * overlay. Quem só queria usar o app era expulso dele.
 *
 * Três saídas agora: tocar fora, o X no canto e o botão voltar. Guarda estática,
 * já que o overlay depende de navegação e de medidas de tela para montar.
 */

const FONTE = readFileSync(resolve(__dirname, '../TourOverlay.tsx'), 'utf8')

describe('saídas do guia', () => {
  it('tocar fora do balão fecha', () => {
    // As áreas escuras em volta do holofote precisam reagir ao toque.
    const dimTocaveis = (FONTE.match(/<TouchableOpacity[^>]*onPress=\{stop\}[^>]*style=\{\[s\.dim/g) || []).length
    expect(dimTocaveis, 'as 4 áreas em volta do holofote devem fechar ao toque').toBe(4)
    expect(
      /<TouchableOpacity[^>]*onPress=\{stop\}[^>]*StyleSheet\.absoluteFill/.test(FONTE),
      'o passo sem holofote usa a tela cheia escurecida e também deve fechar',
    ).toBe(true)
  })

  it('tem um X visível, não só o "Sair" de texto', () => {
    expect(/accessibilityLabel=\{tl\('Fechar o guia'/.test(FONTE)).toBe(true)
    expect(/✕/.test(FONTE), 'o X é a saída que as pessoas procuram primeiro').toBe(true)
  })

  it('o botão voltar fecha o guia em vez de sair do app', () => {
    expect(/BackHandler\.addEventListener\('hardwareBackPress'/.test(FONTE)).toBe(true)
    // Precisa devolver true: sem isso o evento propaga e o app fecha mesmo assim.
    expect(/return true/.test(FONTE), 'sem consumir o evento, o app fecha do mesmo jeito').toBe(true)
    // E só enquanto o guia está ativo — senão sequestra o voltar do app inteiro.
    expect(/if \(!active \|\| Platform\.OS !== 'android'\) return/.test(FONTE)).toBe(true)
  })

  it('remove o listener ao sair', () => {
    // Listener vazado continua engolindo o botão voltar depois do guia fechar.
    expect(/return \(\) => sub\.remove\(\)/.test(FONTE)).toBe(true)
  })
})
