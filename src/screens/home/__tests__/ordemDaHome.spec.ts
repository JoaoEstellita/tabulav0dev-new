import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

/**
 * A ordem de leitura da Home.
 *
 * Escorregou três vezes seguidas durante o ajuste no aparelho, sempre do mesmo
 * jeito: um bloco novo entrava no meio e quebrava a sequência. A ordem não é
 * estética — é o roteiro da leitura:
 *
 *   "Seu dia"  → a resposta, para quem abre o app de manhã e não quer mais nada
 *   roda natal → o céu que produziu a resposta
 *   grade      → o mesmo céu em tabela (sai dentro do componente da roda)
 *   status     → onde isso pega na vida, em roda OU em fichas (alternável)
 *   emoções    → que tom o dia tende a ter
 *   filtro     → a porta para o detalhe planeta a planeta
 *   o resto    → card de trânsitos, céu coletivo
 *
 * Do que ACONTECE para o que SIGNIFICA: o céu primeiro, a vida depois.
 *
 * ⚠️ RODA E GRADE SÃO CONTÍGUAS. O filtro morava entre as duas (no slot
 * `entreRodaEGrade`, porque a grade vive dentro do componente da roda) e saiu
 * a pedido: ali ele separava duas visões da mesma coisa. Agora fica depois das
 * emoções, onde a leitura já fechou.
 *
 * ⚠️ As duas visões do status dividem um bloco só. Antes a roda ficava em cima
 * e as fichas lá embaixo — os MESMOS oito números em dois pontos da tela, com
 * a pessoa rolando duas vezes pela mesma informação.
 *
 * Nada disso quebra se mudar de lugar: a tela continua montando, os testes de
 * render continuam passando, e só a leitura fica pior.
 */

const raiz = join(__dirname, '..', '..', '..')
const HOME = readFileSync(join(raiz, 'screens', 'home', 'HomeScreen.tsx'), 'utf-8')
const RODA = readFileSync(join(raiz, 'screens', 'cosmos', 'NatalChartWheelScreen.tsx'), 'utf-8')

const pos = (t: string) => HOME.indexOf(t)

describe('ordem dos blocos da Home', () => {
  it('é "Seu dia", roda, grade, status, emoções, filtro, resto', () => {
    const frase = pos('<FraseDoDia')
    const natal = pos('<NatalChartWheelContent')
    const status = pos('<RodaDeStatus')
    const fichas = pos('<AreaCardItem')
    const emocoes = pos('<ClimaEmocional')
    const filtro = pos('<PlanetQuickNav')
    const banners = pos('<NotificationOptInBanner')
    const coletiva = pos('<HomeCollectiveGrid />')

    for (const [nome, v] of Object.entries({ frase, natal, status, fichas, emocoes, filtro, banners, coletiva })) {
      expect(v, `bloco ${nome} não encontrado na Home`).toBeGreaterThan(-1)
    }

    expect(frase, '"Seu dia" vem ANTES da roda natal').toBeLessThan(natal)
    expect(status, 'o status vem depois da roda e da grade').toBeGreaterThan(natal)
    expect(emocoes, 'as emoções vêm depois do status').toBeGreaterThan(status)
    expect(filtro, 'o filtro vem depois das emoções').toBeGreaterThan(emocoes)
    expect(filtro, 'e antes dos banners').toBeLessThan(banners)
    expect(banners, 'o céu coletivo fecha a página').toBeLessThan(coletiva)
  })

  /**
   * ⚠️ NADA ENTRE A RODA E A GRADE.
   *
   * O filtro morava ali — era o único jeito de colocá-lo entre as duas, já que
   * a grade vive dentro do componente da roda. Saiu a pedido: separava duas
   * visões da mesma coisa. Se o slot voltar a ser preenchido, isto reprova.
   */
  it('a roda e a grade ficam contíguas, sem o filtro no meio', () => {
    expect(HOME, 'o filtro voltou para dentro da roda').not.toMatch(/entreRodaEGrade=\{/)
  })

  /**
   * ⚠️ AS DUAS VISÕES DO STATUS TÊM DE DIVIDIR UM BLOCO SÓ.
   *
   * Elas mostram os mesmos oito números. Separadas, a pessoa rola duas vezes
   * pela mesma informação — foi o estado anterior. Se as fichas voltarem a
   * aparecer longe da roda, isto reprova.
   */
  it('roda e fichas moram no mesmo bloco, alternáveis', () => {
    const roda = pos('<RodaDeStatus')
    const fichas = pos('<AreaCardItem')
    expect(Math.abs(fichas - roda), 'roda e fichas se separaram na tela').toBeLessThan(1500)
    expect(HOME, 'sem o hook, não há como alternar').toContain('useVisaoDeStatus')
    expect(HOME).toContain("visaoDeStatus === 'roda'")
  })

  it('a grade continua morando dentro da roda', () => {
    // Se for movida para fora, a ordem pedida deixa de ser garantida pela
    // checagem acima — ela depende de a grade sair junto com a roda.
    expect(RODA).toContain('{!mostrarGrade ? null :')
  })
})

describe('a Home mostra tudo — sem corte', () => {
  it('não há modo que esconda blocos da tela', () => {
    // O ambiente leve escondia grade, fita, card e céu coletivo, e cortava as
    // oito áreas em três. Saiu a pedido: o corte atrapalhava mais do que
    // aliviava, e o "Ver tudo" ficava justamente em cima dos status.
    expect(HOME, 'o modo leve voltou').not.toMatch(/\bleve\b/)
    expect(HOME).not.toContain('useAmbiente')
    expect(HOME).not.toMatch(/Ver tudo do meu c[ée]u/)
  })

  it('as oito áreas aparecem, sem recorte', () => {
    expect(HOME).toContain('memoizedAreas.map')
    expect(HOME, 'o recorte das 3 que mais pedem atenção saiu junto')
      .not.toContain('areasQuePedemAtencao')
  })

  it('a fita de planetas e o céu coletivo não ficam atrás de condição de modo', () => {
    expect(HOME).toContain('<HomeCollectiveGrid />')
    expect(HOME).not.toMatch(/\{!leve/)
  })
})
