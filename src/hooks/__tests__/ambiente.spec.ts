import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { areasQuePedemAtencao, AREAS_NO_MODO_LEVE } from '../useAmbiente'

/**
 * O ambiente leve: quanto a Home mostra de uma vez.
 *
 * Medido antes: nove blocos empilhados respondendo cinco perguntas ao mesmo
 * tempo. Para quem abre o app de manhã querendo saber como está o dia, isso é
 * um painel de instrumentos onde devia haver uma frase.
 *
 * O risco do modo é esconder algo e a pessoa não achar de volta — por isso o
 * botão de alternar é testado aqui junto: um modo que oculta conteúdo sem
 * caminho visível de volta é pior que a tela cheia.
 */

const raiz = join(__dirname, '..', '..')
const HOME = readFileSync(join(raiz, 'screens', 'home', 'HomeScreen.tsx'), 'utf-8')
const RODA = readFileSync(join(raiz, 'screens', 'cosmos', 'NatalChartWheelScreen.tsx'), 'utf-8')

const area = (nome: string, percentage: number | null) =>
  ({ name: nome, normalizedArea: { percentage } }) as any

describe('áreas que mais pedem atenção', () => {
  it('traz as de PIOR pontuação primeiro', () => {
    // Mostrar as oito em ordem fixa gasta a tela com o que está tudo bem.
    const r = areasQuePedemAtencao([area('a', 80), area('b', 20), area('c', 50)], 3)
    expect(r.map((x: any) => x.name)).toEqual(['b', 'c', 'a'])
  })

  it('corta na quantidade pedida', () => {
    const r = areasQuePedemAtencao([area('a', 80), area('b', 20), area('c', 50), area('d', 10)])
    expect(r).toHaveLength(AREAS_NO_MODO_LEVE)
    expect(r.map((x: any) => x.name)).toEqual(['d', 'b', 'c'])
  })

  it('NÃO reordena o array recebido', () => {
    // `memoizedAreas` é memorizado e compartilhado com o modo completo, onde a
    // ordem canônica das áreas tem de ser preservada.
    const entrada = [area('a', 80), area('b', 20)]
    const copia = [...entrada]
    areasQuePedemAtencao(entrada, 2)
    expect(entrada).toEqual(copia)
  })

  it('área sem pontuação vai para o fim, não para a frente', () => {
    // Sem número não há como dizer que pede atenção; deixá-la na frente
    // esconderia uma área que de fato pede.
    const r = areasQuePedemAtencao([area('semNota', null), area('ruim', 15), area('boa', 90)], 3)
    expect(r.map((x: any) => x.name)).toEqual(['ruim', 'boa', 'semNota'])
  })

  it('lista vazia não quebra', () => {
    expect(areasQuePedemAtencao([], 3)).toEqual([])
  })
})

describe('Home no ambiente leve', () => {
  it('a grade de aspectos é desligada pela roda, não escondida por fora', () => {
    expect(RODA, 'a roda precisa aceitar desligar a grade').toContain('mostrarGrade = true')
    expect(HOME).toContain('mostrarGrade={!leve}')
  })

  it('o que é denso só aparece no modo completo', () => {
    // Fita de planetas, card de trânsitos e céu coletivo.
    expect(HOME).toMatch(/\{!leve &&[\s\S]{0,400}PlanetQuickNav/)
    expect(HOME).toMatch(/\{!leve &&[\s\S]{0,400}aTransits/)
    expect(HOME).toContain('{!leve ? <HomeCollectiveGrid /> : null}')
  })

  it('no leve mostra só as 3 áreas que mais pedem atenção', () => {
    expect(HOME).toContain('areasQuePedemAtencao(memoizedAreas, AREAS_NO_MODO_LEVE)')
  })

  it('há um caminho VISÍVEL de volta, na própria Home', () => {
    // Enterrado em Configurações viraria conteúdo perdido: a pessoa não procura
    // o que não sabe que existe.
    expect(HOME).toContain('onPress={alternarAmbiente}')
    expect(HOME).toMatch(/Ver tudo do meu c[ée]u/)
  })
})

describe('ordem de leitura da Home', () => {
  const pos = (t: string) => HOME.indexOf(t)

  it('e roda, "Seu dia", status, grade', () => {
    // O desenho mostra o ceu; a frase diz o que aquilo significa; o status diz
    // onde pega na vida; so entao vem a tabela. Essa ordem foi pedida tres
    // vezes seguidas porque cada bloco que entrava no meio quebrava a leitura.
    //
    // Frase e status moram no slot `entreRodaEGrade` da roda justamente por
    // isso: e o unico ponto que fica DEPOIS do desenho e ANTES da grade. Soltos
    // na Home, qualquer bloco novo pode cair entre eles.
    const slot = pos('entreRodaEGrade={(')
    const frase = pos('<FraseDoDia')
    const status = pos('<AreaCardItem')
    const banners = pos('<NotificationOptInBanner')

    expect(slot, 'o slot entre roda e grade sumiu').toBeGreaterThan(-1)
    expect(frase, 'a frase precisa estar dentro do slot').toBeGreaterThan(slot)
    expect(status, 'o status vem DEPOIS da frase').toBeGreaterThan(frase)
    expect(status, 'e ANTES de tudo que vem depois da grade').toBeLessThan(banners)
  })

  it('o status nao ficou solto fora do slot', () => {
    // Se voltar a ser renderizado no corpo da Home, volta a cair depois da
    // grade e da lista — foi exatamente o que precisou ser corrigido.
    // O fim do slot e o fechamento do fragmento, nao o primeiro `/>` (esse e
    // da propria frase).
    const slotFim = HOME.indexOf('</>', HOME.indexOf('entreRodaEGrade={('))
    expect(slotFim, 'fragmento do slot nao encontrado').toBeGreaterThan(-1)
    expect(pos('<AreaCardItem')).toBeLessThan(slotFim)
  })

  it('a legenda de planetas abaixo da roda foi removida', () => {
    const RODA = readFileSync(join(raiz, 'screens', 'cosmos', 'NatalChartWheelScreen.tsx'), 'utf-8')
    expect(RODA, 'a fita de glifo+nome ocupava duas linhas inteiras sob a roda')
      .not.toContain('legendaSimbolos')
  })

  it('o botao de alternar fecha a pagina, depois de todo o conteudo', () => {
    expect(pos('onPress={alternarAmbiente}')).toBeGreaterThan(pos('<HomeCollectiveGrid />'))
  })
})
