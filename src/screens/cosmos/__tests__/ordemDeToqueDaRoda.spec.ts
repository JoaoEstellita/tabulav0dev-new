import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
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
    // A justificativa de pôr os signos por último: se houvesse glifo de planeta
    // dentro de R_ZODIAC_IN..R_OUTER, a camada o cobriria e o planeta pararia de
    // abrir. Os raios provam que não há.
    // Regex literal, nao `new RegExp` com template string: num template
    // literal `\*` colapsa para `*` e o padrao passa a casar qualquer coisa.
    const raio = (re: RegExp) => Number(re.exec(FONTE)?.[1] ?? NaN)
    const zodiacoIn = raio(/const R_ZODIAC_IN = px\(svgSize \* ([0-9.]+)/)
    const zodiacoOut = raio(/const R_OUTER = px\(svgSize \* ([0-9.]+)/)
    const planeta = raio(/const R_PLANET = px\(svgSize \* ([0-9.]+)/)
    const transito = raio(/const R_TRANSIT = px\(svgSize \* ([0-9.]+)/)

    for (const [nome, v] of Object.entries({ zodiacoIn, zodiacoOut, planeta, transito })) {
      expect(Number.isNaN(v), `raio ${nome} nao foi encontrado no fonte`).toBe(false)
    }
    // Natais bem dentro. Os dois raios levam o mesmo `scale`, então a razão
    // basta — vale na roda simples e na bi-roda.
    expect(planeta, 'planetas natais invadiram o anel do zodíaco').toBeLessThan(zodiacoIn)

    // Trânsito é o caso delicado: R_TRANSIT NÃO leva `scale`, R_OUTER leva.
    // Glifo de trânsito só existe quando a bi-roda está ligada, e aí o zodíaco
    // encolhe por `scale` justamente para abrir espaço. Comparar os dois crus
    // daria 0.45 < 0.46 e pareceria invasão que não acontece.
    const escalaBiRoda = Number(
      /const scale = showTransits \? ([0-9.]+) : 1/.exec(FONTE)?.[1] ?? NaN,
    )
    expect(Number.isNaN(escalaBiRoda), 'a escala da bi-roda mudou de forma').toBe(false)
    expect(
      transito,
      'glifos de trânsito invadiram o anel do zodíaco na bi-roda',
    ).toBeGreaterThanOrEqual(zodiacoOut * escalaBiRoda)
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
    ).toMatch(/const svgSize = Math\.floor\(Math\.min\(width - 32, 380\) \/ 2\) \* 2/)

    // Os raios sao circulos concentricos — e onde o meio-pixel mais aparece.
    for (const nome of ['R_OUTER', 'R_ZODIAC_IN', 'R_HOUSE_OUT', 'R_HOUSE_IN', 'R_PLANET', 'R_INNER']) {
      expect(FONTE, `${nome} precisa passar por px()`).toContain(`const ${nome} = px(`)
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
