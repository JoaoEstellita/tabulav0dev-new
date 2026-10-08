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
 *   roda       → de onde a resposta saiu
 *   grade      → o detalhe técnico (sai dentro do componente da roda)
 *   status     → onde isso pega na vida
 *   o resto    → fita de planetas, card de trânsitos, céu coletivo
 *
 * Nada disso quebra se mudar de lugar: a tela continua montando, os testes de
 * render continuam passando, e só a leitura fica pior.
 */

const raiz = join(__dirname, '..', '..', '..')
const HOME = readFileSync(join(raiz, 'screens', 'home', 'HomeScreen.tsx'), 'utf-8')
const RODA = readFileSync(join(raiz, 'screens', 'cosmos', 'NatalChartWheelScreen.tsx'), 'utf-8')

const pos = (t: string) => HOME.indexOf(t)

describe('ordem dos blocos da Home', () => {
  it('é "Seu dia", roda, status, e então o resto', () => {
    const frase = pos('<FraseDoDia')
    const roda = pos('<NatalChartWheelContent')
    const status = pos('<AreaCardItem')
    const banners = pos('<NotificationOptInBanner')
    const coletiva = pos('<HomeCollectiveGrid />')

    for (const [nome, v] of Object.entries({ frase, roda, status, banners, coletiva })) {
      expect(v, `bloco ${nome} não encontrado na Home`).toBeGreaterThan(-1)
    }

    expect(frase, '"Seu dia" vem ANTES da roda').toBeLessThan(roda)
    expect(status, 'o status vem DEPOIS da roda — a grade sai dentro dela').toBeGreaterThan(roda)
    expect(status, 'e antes dos banners e do resto').toBeLessThan(banners)
    expect(banners, 'o céu coletivo fecha a página').toBeLessThan(coletiva)
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
