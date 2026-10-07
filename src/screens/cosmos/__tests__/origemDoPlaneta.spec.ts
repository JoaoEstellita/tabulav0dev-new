import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

/**
 * Natal e trânsito são leituras diferentes do MESMO glifo.
 *
 * A roda desenha dois anéis de planetas: o de dentro é o mapa de nascimento (não
 * muda nunca) e o de fora é o céu de hoje. Os dois usavam o mesmo estado e
 * abriam o mesmo modal, então tocar em Marte no anel de fora mostrava a
 * interpretação do Marte NATAL — mesmo nome, mesmo símbolo, leitura trocada, e
 * nada na tela avisava qual das duas estava sendo lida.
 *
 * É a classe de bug que o projeto mais paga: não quebra, não dá erro, continua
 * bonito, e afirma com toda a confiança uma coisa que não é verdade. Quem lê não
 * tem como desconfiar, porque o texto é plausível.
 *
 * O teste lê o fonte porque o componente importa react-native-svg (Flow, que o
 * Vitest não parseia) e não monta aqui.
 */

const FONTE = readFileSync(join(__dirname, '..', 'NatalChartWheelScreen.tsx'), 'utf-8')

describe('origem do planeta tocado: natal ou trânsito', () => {
  it('o estado carrega a origem, não só o planeta', () => {
    expect(FONTE, 'sem a origem os dois anéis são indistinguíveis').toMatch(
      /origem:\s*'natal'\s*\|\s*'transito'/,
    )
  })

  it('o anel de dentro abre como natal e o de fora como trânsito', () => {
    // As duas chamadas existem e estão em lados opostos. Se as duas passarem a
    // mesma origem, metade da roda passa a mentir.
    expect(FONTE).toContain("abrirPlaneta(p, 'natal')")
    expect(FONTE).toContain("abrirPlaneta(p, 'transito')")

    // O glifo de trânsito é o que tem a chave prefixada (`t-`).
    const linhaTransito = FONTE.split('\n').find((l) => l.includes('key={`t-${p.name}`}'))
    expect(linhaTransito, 'o glifo do anel de trânsito desapareceu').toBeTruthy()
    expect(linhaTransito, 'o anel de fora precisa abrir como trânsito').toContain("'transito'")
  })

  it('o modal mostra um selo dizendo QUAL leitura está na tela', () => {
    expect(FONTE).toMatch(/EM TR[ÂA]NSITO HOJE/)
    expect(FONTE).toMatch(/PLANETA NATAL/)
  })

  it('catálogo NATAL nunca é aplicado a um planeta em trânsito', () => {
    // O erro central. "Marte em Áries hoje" não quer dizer o que "Marte em Áries
    // no nascimento" quer; usar o texto natal para um trânsito é inventar uma
    // afirmação convincente e falsa.
    const noSigno = FONTE.split('\n').find((l) => l.includes('const noSigno ='))
    const naCasa = FONTE.split('\n').find((l) => l.includes('const naCasa ='))
    expect(noSigno, 'resolvePlanetInSignText precisa ficar atrás da guarda de origem')
      .toMatch(/ehTransito\s*\?\s*null\s*:/)
    expect(naCasa, 'resolveNatalPlanetInHouseText precisa ficar atrás da guarda de origem')
      .toMatch(/!ehTransito/)
  })

  it('a casa do planeta em trânsito é a NATAL percorrida', () => {
    // Regra antiga do projeto: casa de trânsito usa as cúspides de NASCIMENTO
    // (houseOfLon), não a casa do céu de agora — essa não diz nada sobre a
    // pessoa. O `house` que vem no planeta de trânsito pode ser a outra.
    const bloco = FONTE.slice(FONTE.indexOf('const casa = ehTransito'), FONTE.indexOf('const essencia ='))
    expect(bloco, 'trânsito tem de resolver a casa por houseOfLon').toContain('houseOfLon(lon)')
  })

  it('os lados do aspecto não invertem ao listar os trânsitos do planeta', () => {
    // planet1 = quem age (trânsito), planet2 = quem recebe (natal). Trocar aqui
    // atribuiria o aspecto ao par errado — e o par errado existe de verdade no
    // céu, então o resultado passa por correto.
    const linha = FONTE.split('\n').find((l) => l.includes('ehTransito ? a?.planet1 === nome'))
    expect(linha, 'o filtro por lado do aspecto mudou de forma').toBeTruthy()
    expect(linha).toContain('a?.planet2 === nome')
  })

  it('o modal do planeta leva até a lista de trânsitos', () => {
    // Pedido explícito: o modal explica, a lista é onde a pessoa compara.
    expect(FONTE).toMatch(/Ver na lista de tr[âa]nsitos/)
    expect(FONTE, 'o link da lista precisa usar o id do trânsito').toContain('onSelectTransitAspect(id)')
  })

  it('o toque num trânsito listado fecha este modal antes de abrir o outro', () => {
    // Dois Modal empilhados no Android deixam o de baixo capturando o toque.
    const linha = FONTE.split('\n').find((l) => l.includes('openTransitAspectModal(idDoTransito(a))'))
    expect(linha).toBeTruthy()
    expect(linha, 'fechar o modal do planeta antes é o que impede o travamento')
      .toContain('setSelectedPlanet(null)')
  })
})
