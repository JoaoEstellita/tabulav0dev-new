import { describe, it, expect } from 'vitest'
import { detectAspects } from '../aspects.engine'
import { transitCellId } from '../transitCellId'
// A config REAL do app, não uma inventada: um contrato testado contra regras
// paralelas não prova nada sobre o que roda de verdade.
import aspectsConfig from '../aspects.config'

/**
 * Invariantes que, se quebradas, NÃO dão erro — dão resposta errada.
 *
 * Esta é a classe de bug mais cara do projeto: a conta continua rodando, a tela
 * continua bonita, os testes continuam verdes, e o app passa a afirmar com toda
 * a confiança uma coisa que não é verdade. Quem lê não tem como desconfiar,
 * porque o resultado é plausível.
 *
 * O caso que motivou: "Saturno quadratura Sol" na grade e "Saturno conjunção
 * Sol" na lista, ao mesmo tempo. Investigado e os dois estavam CERTOS — são
 * pares diferentes (Saturno-trânsito sobre Sol-natal, e Sol-trânsito sobre
 * Saturno-natal). Mas bastaria `planet1` e `planet2` trocarem de lado em
 * qualquer ponto da cadeia para a tela mostrar o aspecto de um par atribuído ao
 * outro — e nada acusaria.
 *
 * Então o que se trava aqui não é o valor do cálculo (isso os testes de orbe e
 * efeméride já fazem), e sim QUEM É QUEM: a ordem dos lados, do começo ao fim.
 */

const corpo = (name: string, longitude: number, speed = 1) => ({ name, longitude, speed })

const CONFIG: any = aspectsConfig

describe('contrato: quem é trânsito e quem é natal nunca pode inverter', () => {
  it('detectAspects devolve planet1 do PRIMEIRO conjunto e planet2 do SEGUNDO', () => {
    // A chamada real é detectAspects(trânsito, natal). Se a ordem virar, cada
    // aspecto passa a ser atribuído ao par trocado — e continua "funcionando".
    const transito = [corpo('Saturn', 11.1)]
    const natal = [corpo('Sun', 20.4)]

    const r = detectAspects(transito as any, natal as any, CONFIG)
    expect(r.length).toBeGreaterThan(0)
    expect(r[0].planet1, 'planet1 tem de ser o corpo em TRÂNSITO').toBe('Saturn')
    expect(r[0].planet2, 'planet2 tem de ser o corpo NATAL').toBe('Sun')
  })

  it('marca explicitamente de qual lado cada corpo veio', () => {
    // `side1`/`side2` são a prova documentada da convenção. Se alguém reordenar
    // a saída, isto denuncia.
    const r = detectAspects([corpo('Sun', 14)] as any, [corpo('Saturn', 283.8)] as any, CONFIG)
    expect(r[0].side1).toBe('A')
    expect(r[0].side2).toBe('B')
  })

  it('inverter os conjuntos produz um aspecto DIFERENTE — e é por isso que a ordem importa', () => {
    // Prova viva com o céu real de 04/10/2026, que gerou a dúvida:
    //   Saturno(T) 11,1° Áries  ×  Sol(N) 20,4° Áries       → conjunção
    //   Sol(T)     14,0° Libra  ×  Saturno(N) 13,8° Capric. → quadratura
    // Mesmos dois nomes, aspectos distintos. Trocar os lados troca a leitura.
    const saturnoTransito = [corpo('Saturn', 11.1)]
    const solNatal = [corpo('Sun', 20.4)]
    const solTransito = [corpo('Sun', 194.0)]
    const saturnoNatal = [corpo('Saturn', 283.8)]

    const a = detectAspects(saturnoTransito as any, solNatal as any, CONFIG)[0]
    const b = detectAspects(solTransito as any, saturnoNatal as any, CONFIG)[0]

    expect(a.type).toBe('conjunção')
    expect(b.type).toBe('quadratura')
    expect(a.type).not.toBe(b.type)
  })

  it('o id da célula da grade mantém a ordem trânsito → natal', () => {
    // O id casa a célula da grade com o card da lista. Se a ordem dos argumentos
    // mudar, o toque passa a abrir o trânsito errado — sem erro nenhum.
    expect(transitCellId('Saturn', 'conjuncao', 'Sun')).toBe('txr-saturn-conjuncao-sun')
    expect(transitCellId('Sun', 'quadratura', 'Saturn')).toBe('txr-sun-quadratura-saturn')
    // Os dois pares do caso real precisam gerar ids DIFERENTES.
    expect(transitCellId('Saturn', 'conjuncao', 'Sun')).not.toBe(transitCellId('Sun', 'conjuncao', 'Saturn'))
  })

  it('o id ignora acento e caixa, mas nunca a posição', () => {
    // norm() iguala grafias; o que ele não pode fazer é igualar os lados.
    expect(transitCellId('Saturn', 'trígono', 'Sun')).toBe(transitCellId('saturn', 'TRIGONO', 'sun'))
    expect(transitCellId('Saturn', 'trígono', 'Sun')).not.toBe(transitCellId('Sun', 'trígono', 'Saturn'))
  })

  it('num mesmo conjunto, cada par aparece uma vez só', () => {
    // Aspectos natais usam o MESMO conjunto dos dois lados. Sem o corte, cada
    // par sairia duplicado e todo peso calculado em cima disso dobraria.
    const planetas = [corpo('Sun', 0), corpo('Moon', 90), corpo('Mars', 180)]
    const r = detectAspects(planetas as any, planetas as any, CONFIG)
    const pares = r.map((a) => [a.planet1, a.planet2].sort().join('-'))
    expect(new Set(pares).size, 'par duplicado dobra o peso do aspecto no cálculo').toBe(pares.length)
    // E nunca um corpo consigo mesmo.
    expect(r.every((a) => a.planet1 !== a.planet2)).toBe(true)
  })
})
