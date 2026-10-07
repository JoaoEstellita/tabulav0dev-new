import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

/**
 * A palavra tocada na leitura do dia ABRE a interpretação. Não rola a tela.
 *
 * A versão anterior rolava até a lista de trânsitos: tirava do lugar o texto que
 * a pessoa estava lendo e a largava num card que ela ainda não sabia ler. São
 * duas ações parecidas no código (as duas recebem o mesmo `cellId`) e trocar uma
 * pela outra não quebra nada nem dá erro — só devolve o comportamento ruim.
 *
 * Por isso os nomes são diferentes de propósito: `onAbrirTransito` abre o modal,
 * `onSelectTransitAspect` rola. O teste trava quem vai para onde.
 */

const raiz = join(__dirname, '..', '..')
const FRASE = readFileSync(join(raiz, 'components', 'FraseDoDia.tsx'), 'utf-8')
const HOME = readFileSync(join(raiz, 'screens', 'home', 'HomeScreen.tsx'), 'utf-8')
const RODA = readFileSync(join(raiz, 'screens', 'cosmos', 'NatalChartWheelScreen.tsx'), 'utf-8')

describe('leitura do dia: tocar abre a interpretação', () => {
  it('a frase recebe a ação de ABRIR, não a de rolar', () => {
    expect(FRASE).toContain('onAbrirTransito')
    // Identificador isolado: `onSelectTransitAspect` pode ser CITADO no
    // comentário (é o par dele, o que rola), e citar não é usar.
    expect(
      /\bonSelectTransit\b/.test(FRASE),
      'onSelectTransit era a prop que rolava a tela — não pode voltar aqui',
    ).toBe(false)
  })

  it('a Home liga a frase ao modal, e o scroll só à roda e à grade', () => {
    // As duas ações convivem na mesma tela; o que não pode é a frase receber a
    // que rola.
    expect(HOME, 'a frase precisa receber abrirTransito').toMatch(
      /onAbrirTransito=\{abrirTransito\}/,
    )
    expect(HOME, 'o scroll continua sendo o certo para a grade de aspectos').toContain(
      'onSelectTransitAspect={handleSelectTransitAspect}',
    )
  })

  it('a roda entrega a ação de abrir a quem renderiza conteúdo dentro dela', () => {
    // Sem isto a Home não tem como abrir o modal: ele vive dentro da roda.
    expect(RODA).toContain('abrirTransito: openTransitAspectModal')
    expect(RODA).toMatch(/entreRodaEGrade\?:\s*React\.ReactNode\s*\|\s*\(\(acoes: AcoesDaRoda\)/)
  })

  it('palavra tocável só quando a interpretação realmente abre', () => {
    // Link morto no meio do texto é pior que palavra sem link: a pessoa toca,
    // nada acontece, e conclui que o app travou. A checagem tem de espelhar a
    // chamada do modal, que reconstrói a narrativa só com os três nomes.
    expect(FRASE).toContain('const abreDeVerdade')
    expect(FRASE, 'o índice de âncoras precisa filtrar por isso').toContain('.filter(abreDeVerdade)')
    expect(FRASE, 'a âncora explícita também').toMatch(/if \(!abreDeVerdade\(t\)\)/)
  })

  it('o resumo do status entra no TEXTO, não só na escolha do foco', () => {
    // Antes o status só era consultado quando o trânsito não dizia nada — ficava
    // invisível para quem lê.
    expect(FRASE).toContain('getLifeAreaLabel')
    expect(FRASE, 'as duas pontas do status (pior e melhor) precisam aparecer').toMatch(
      /porStatus\.length >= 2/,
    )
  })

  it('a área citada leva ao trânsito que de fato a move', () => {
    // `areasAffectedByTransit` é o mesmo mapa que o motor usa para PONTUAR as
    // áreas. Um mapa paralelo faria o texto apontar para um trânsito que não
    // mexe naquela área — e nada acusaria.
    expect(FRASE).toContain('areasAffectedByTransit')
    expect(FRASE).toContain('const transitoDaArea')
  })

  it('nome de planeta e de aspecto não voltam a virar âncora', () => {
    // A frase existe para não depender do jargão. Marcá-lo o devolveria pela
    // porta dos fundos.
    expect(FRASE).toMatch(/proibidas\.push\(/)
    expect(FRASE).toMatch(/indiceDePalavras\([\s\S]{0,400}proibidas,/)
  })
})
