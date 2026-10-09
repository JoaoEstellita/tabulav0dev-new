import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { calcularRaios } from '../../../astro/raiosDaRoda'
import { join } from 'node:path'

/**
 * Quem recebe o toque na roda depende da ORDEM em que o SVG é escrito.
 *
 * O hit-test do react-native-svg percorre os elementos do último para o
 * primeiro: o que é desenhado depois fica na frente e intercepta o toque antes
 * de ele chegar a quem está embaixo. Isso não dá erro, não quebra o desenho e
 * não aparece em nenhum teste de render — a roda fica idêntica e simplesmente
 * não responde.
 *
 * Custou três rodadas. Enquanto a camada de toque dos signos ficava no fundo do
 * desenho (antes dos glifos, das divisões e dos anéis), tocar num signo não
 * fazia nada; as casas, desenhadas quase no fim, sempre funcionaram. A correção
 * não foi descobrir QUAL elemento interceptava, foi tornar a camada de toque a
 * última de todas — o que elimina a classe inteira do problema.
 *
 * O teste lê o fonte porque o componente importa react-native-svg (Flow, que o
 * Vitest não parseia) e não monta aqui. É grosseiro, mas trava exatamente o que
 * regrediu.
 */

const FONTE = readFileSync(
  join(__dirname, '..', 'NatalChartWheelScreen.tsx'),
  'utf-8',
)

/** Posição no arquivo do bloco que registra o toque num signo. */
const posToqueSigno = () => FONTE.indexOf("setInfoRoda({ tipo: 'signo'")
const posToqueCasa = () => FONTE.indexOf("setInfoRoda({ tipo: 'casa'")

describe('ordem de desenho da roda — o toque depende dela', () => {
  it('as duas camadas de toque existem', () => {
    expect(posToqueSigno(), 'toque no signo').toBeGreaterThan(-1)
    expect(posToqueCasa(), 'toque na casa').toBeGreaterThan(-1)
  })

  it('a camada de toque dos signos é a ÚLTIMA coisa dentro do <Svg>', () => {
    // Nada pode ser desenhado depois dela, senão volta a interceptar.
    const fim = FONTE.indexOf('</Svg>')
    expect(fim).toBeGreaterThan(-1)
    const depois = FONTE.slice(posToqueSigno(), fim)
    // Entre o toque do signo e o fecho do SVG só pode haver o próprio bloco:
    // nenhum outro elemento desenhável.
    const intrusos = depois.match(/<(Circle|Line|SvgText|Rect|Polygon|Ellipse|Polyline)\b/g) || []
    expect(intrusos, 'elemento desenhado DEPOIS da camada de toque dos signos').toEqual([])
  })

  it('o toque dos signos vem depois do toque das casas', () => {
    // As casas eram as que funcionavam justamente por estarem mais no fim.
    // O anel do zodíaco é externo ao das casas, então não há disputa de área —
    // só de precedência.
    expect(posToqueSigno()).toBeGreaterThan(posToqueCasa())
  })

  it('o anel do zodíaco não tem planeta nenhum — a camada por cima não rouba toque', () => {
    // A justificativa de pôr a camada de toque dos signos por último: se
    // houvesse glifo de planeta dentro de zodiacIn..outer, ela o cobriria e o
    // planeta pararia de abrir.
    //
    // Lê os RAIOS REAIS (astro/raiosDaRoda), não o texto do componente: raio é
    // número, e comparar número é mais forte do que casar uma linha de código
    // que muda de forma a cada refatoração.
    for (const tamanho of [320, 380, 440]) {
      const bi = calcularRaios(tamanho, true)
      const natal = calcularRaios(tamanho, false)

      // Natais bem dentro do anel das casas, longe do zodíaco.
      expect(bi.planet, `natal invadiu o zodíaco em ${tamanho}px`).toBeLessThan(bi.zodiacIn)
      expect(natal.planet).toBeLessThan(natal.zodiacIn)

      // Trânsito na borda externa, fora do zodíaco — com o glifo inteiro.
      expect(bi.transit - bi.discTransit, `trânsito invadiu o zodíaco em ${tamanho}px`)
        .toBeGreaterThan(bi.outer)
    }
  })

  it('glifos e divisões do zodíaco são declarados non-interactive', () => {
    // Mesmo com a camada por último, o glifo do signo cai exatamente no meio do
    // setor — onde o dedo naturalmente mira. Sem `pointerEvents="none"` ele
    // engole justamente o toque mais provável.
    const blocoGlifo = FONTE.slice(
      FONTE.indexOf('{/* Símbolos dos signos */}'),
      FONTE.indexOf('{/* Divisões dos signos'),
    )
    expect(blocoGlifo, 'glifo do signo precisa ser non-interactive').toContain('pointerEvents="none"')

    const blocoDivisoes = FONTE.slice(
      FONTE.indexOf('{/* Divisões dos signos'),
      FONTE.indexOf('{/* Anel das casas'),
    )
    expect(blocoDivisoes, 'divisões do zodíaco precisam ser non-interactive').toContain('pointerEvents="none"')
  })

  it('a geometria do desenho cai em pixel inteiro', () => {
    // O SVG e vetorial: borrado nunca foi resolucao, sempre foi alinhamento.
    // `width` do useWindowDimensions vem fracionario no Android (392.7272...);
    // sem arredondar, svgSize herda a fracao, o centro vira 180.36 e TODA
    // coordenada derivada cai em meio-pixel — cada circulo, cada linha e cada
    // glifo entram em anti-aliasing e o desenho fica lavado.
    //
    // Um `Math.min` cru aqui nao quebra nada nem acusa em teste de render: so
    // volta o borrao.
    expect(
      FONTE,
      'svgSize precisa ser inteiro PAR, para cx e cy sairem inteiros',
    ).toMatch(/const svgSize = Math\.floor\(Math\.min\(width - \d+, \d+\) \/ 2\) \* 2/)

    // Os raios sao circulos concentricos — e onde o meio-pixel mais aparece.
    // Agora vêm prontos do módulo, que arredonda; o teste confere o resultado.
    for (const tamanho of [321, 383, 441]) {
      const r = calcularRaios(tamanho, true)
      for (const [nome, v] of Object.entries(r)) {
        if (typeof v !== 'number' || nome === 'stepNatal') continue
        expect(Number.isInteger(v), `${nome} saiu fracionário em ${tamanho}px: ${v}`).toBe(true)
      }
    }

    // Traco de 0.8px nao existe em tela nenhuma: vira cinza indefinido.
    const finos = FONTE.match(/strokeWidth=\{(0?\.[0-9]+)\}/g) || []
    expect(finos, 'traco abaixo de 1px vira borrao em vez de linha').toEqual([])
  })

  it('o preenchimento de toque tem alfa suficiente para o hit-test enxergar', () => {
    // Alfa 0.001 foi descartado pelo hit-test do Android: na prática equivale a
    // fill="none" e o setor deixa de existir para o dedo. `fill="none"` então
    // não pode aparecer em nenhuma camada de toque.
    const m = FONTE.match(/const TOQUE_INVISIVEL = 'rgba\(255,255,255,([0-9.]+)\)'/)
    expect(m, 'TOQUE_INVISIVEL precisa existir').toBeTruthy()
    expect(Number(m![1]), 'alfa baixo demais é tratado como fill none').toBeGreaterThanOrEqual(0.02)
  })
})

describe('ordem de desenho: o que fica VISÍVEL', () => {
  it('o fundo do miolo vem ANTES das linhas de aspecto', () => {
    // As linhas ligam dois pontos da circunferência R_INNER e atravessam o
    // miolo. Com o disco opaco desenhado depois, elas eram calculadas,
    // desenhadas e pintadas por cima — a roda nunca mostrou um aspecto, e nada
    // acusava, porque o desenho continuava "correto": só invisível.
    const fundo = FONTE.indexOf('r={R_INNER} fill="#0d1018"')
    const linhas = FONTE.indexOf('{aspectLines.map(')
    expect(fundo, 'disco do miolo não encontrado').toBeGreaterThan(-1)
    expect(linhas, 'linhas de aspecto não encontradas').toBeGreaterThan(-1)
    expect(fundo, 'o disco opaco não pode cobrir as linhas').toBeLessThan(linhas)
  })

  it('cada planeta natal marca a própria longitude', () => {
    // O glifo pode se afastar no raio; o tick fica na longitude real e é o que
    // permite conferir a casa.
    expect(FONTE).toContain('tick-')
    expect(FONTE, 'o tick tem de usar o ângulo VERDADEIRO').toMatch(/R_HOUSE_IN,\s*p\.trueAngle/)
  })
})

describe('anti-colisão: a roda usa o módulo testado', () => {
  it('não há cópia local de declutterRing no componente', () => {
    // A cópia local foi onde o deslocamento angular entrou sem teste: a lógica
    // ficava dentro do .tsx, que o Vitest não parseia.
    expect(FONTE).toContain("from '../../astro/declutterRing'")
    expect(FONTE, 'lógica duplicada volta a escapar do teste')
      .not.toMatch(/function declutterRing</)
  })

  it('o componente não desloca glifo em ângulo por conta própria', () => {
    // A fórmula que movia o glifo de casa.
    expect(FONTE).not.toMatch(/glyphDeg \* 0\.85/)
  })
})

describe('a roda não pode roubar a rolagem da tela', () => {
  /**
   * A roda teve rotação de dois dedos, e ela custou a rolagem: o
   * `GestureDetector` envolve o SVG inteiro e passou a segurar o arrasto
   * vertical. Com a roda em 440px, quase todo deslize da Home começa sobre ela
   * — então arrastar para baixo simplesmente não funcionava.
   *
   * Rolar a página é essencial; girar o mapa é enfeite. O gesto saiu.
   *
   * Isto aqui existe porque a ideia de "deixar a roda interativa" volta sempre,
   * e o custo não é óbvio: o gesto funciona na demonstração e quebra a tela
   * inteira no uso real.
   */
  it('não há GestureDetector em volta do desenho', () => {
    expect(FONTE, 'o detector segura o arrasto vertical').not.toContain('<GestureDetector')
    expect(FONTE).not.toContain("from 'react-native-gesture-handler'")
  })

  it('nenhum gesto contínuo compete com a rolagem', () => {
    // Pan e Rotation são os que disputam o arrasto. Um toque simples (onPress)
    // não disputa — por isso signo, casa e planeta continuam tocáveis.
    expect(FONTE).not.toMatch(/Gesture\.(Pan|Rotation|Pinch|Fling)\(/)
  })

  it('os rótulos dos ângulos são derivados da longitude, não fixos', () => {
    // Ângulo fixo é a porta de entrada para a roda mentir, e custa nada manter
    // a marca presa ao ponto real.
    expect(FONTE).toContain('lonToSvgAngle(lon, ascDeg)')
    expect(FONTE).not.toMatch(/polarToXY\(cx, cy, [^,]+, 180\)/)
  })
})

describe('a roda como instrumento de leitura', () => {
  it('desenha os QUATRO ângulos, não só o ASC', () => {
    // `mcDeg` era calculado e nunca desenhado — o Meio do Céu é o segundo
    // ponto mais importante do mapa, o eixo da vocação, e não aparecia.
    for (const rotulo of ['ASC', 'DSC', 'MC', 'IC']) {
      expect(FONTE, `o ângulo ${rotulo} sumiu`).toContain(`rotulo: '${rotulo}'`)
    }
    expect(FONTE, 'o MC precisa ser usado, não só calculado').toMatch(/mcDeg \?/)
  })

  it('a linha do aspecto diz se ele vem chegando ou já passou', () => {
    // Aplicativo sólido, separativo tracejado. O dado (velocidade dos corpos)
    // sempre existiu e a roda jogava fora.
    expect(FONTE).toContain('movimentoPorNome')
    expect(FONTE).toMatch(/mov === 'separativo'/)
    expect(FONTE).toContain('strokeDasharray={l.tracejado}')
  })

  it('tocar num planeta acende os aspectos dele', () => {
    // Com trinta linhas, a teia não responde "com quem ESTE planeta conversa?".
    expect(FONTE).toContain('planetaEmFoco')
    expect(FONTE).toContain('acenderAspectos')
    // E há como voltar a ver tudo — esconder sem caminho de volta é pior.
    expect(FONTE).toMatch(/Ver todos os aspectos/)
  })

  it('dá para filtrar só os aspectos exatos', () => {
    expect(FONTE).toContain('soExatos')
    expect(FONTE, 'o corte é por orbe, não por quantidade').toMatch(/orbe <= 2/)
  })

  it('mostra a dignidade essencial do planeta', () => {
    // Primeira coisa que se olha depois da posição, e não aparecia na roda.
    expect(FONTE).toContain('dignidadePorLongitude')
    // Marcar sem explicar só gera dúvida: o modal diz o que significa.
    expect(FONTE).toContain('explicarDignidade')
  })

  it('mostra o grau de cada planeta no desenho', () => {
    // Estava só no modal: comparar dois planetas exigia abrir dois modais.
    expect(FONTE).toMatch(/% 30\)\}°/)
  })

  it('marca signo interceptado', () => {
    // Só existe em casas desiguais — e por isso nunca apareceu enquanto todas
    // as contas estavam gravadas em whole-sign.
    expect(FONTE).toContain('signosInterceptados')
    expect(FONTE).toContain('interceptados.has(z.i)')
  })

  it('as marcas de grau não roubam toque', () => {
    // São decorativas; o toque pertence aos setores de signo e casa.
    const bloco = FONTE.slice(FONTE.indexOf('Marcas de grau'), FONTE.indexOf('Os QUATRO'))
    expect(bloco).toContain('pointerEvents="none"')
  })
})
