import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'

/**
 * Falha do motor local não pode voltar a ser invisível.
 *
 * O `catch` de `loadTransitData` não seta erro quando o backend respondeu bem —
 * e isso é proposital: o snapshot do backend cobre parte da tela, então derrubar
 * tudo seria pior. O preço é que a pessoa vê seções vazias sem explicação.
 *
 * Foi exatamente esse silêncio que fez a caça ao bug do Mapa durar quatro
 * rodadas: o Sentry era chamado, mas o evento chegava sem contexto, igual a uma
 * queda de rede qualquer. Quatro dias procurando dado faltando num bug de
 * layout, com a evidência sendo apagada a cada tentativa.
 *
 * O hook depende de Firebase e do motor astral, o que inviabiliza montá-lo em
 * teste aqui. A guarda é estática e cobre o essencial: o caminho silencioso
 * continua marcado e reportado com o contexto que o separa de falha de rede.
 */

const FONTE = readFileSync(resolve(__dirname, '../useLifeAreas.ts'), 'utf8')

describe('useLifeAreas — falha do motor local', () => {
  it('marca engineFailed no catch', () => {
    expect(
      /setEngineFailed\(true\)/.test(FONTE),
      'sem a marca, a tela não tem como saber que ficou incompleta',
    ).toBe(true)
  })

  it('limpa a marca quando uma carga dá certo', () => {
    expect(
      /setEngineFailed\(false\)/.test(FONTE),
      'sem o reset, um erro antigo contamina todas as cargas seguintes',
    ).toBe(true)
  })

  it('expõe engineFailed para quem consome o hook', () => {
    expect(/engineFailed,/.test(FONTE)).toBe(true)
    expect(/engineFailed: boolean/.test(FONTE)).toBe(true)
  })

  it('reporta ao Sentry distinguindo o caso silencioso', () => {
    // A tag `silenciado` é o que permite filtrar "a tela não mostrou erro e o
    // usuário só viu seções vazias" — o caso perigoso — de uma queda de rede.
    expect(/silenciado:/.test(FONTE), 'evento sem essa tag não se distingue de falha de rede').toBe(true)
    expect(/Sentry\.captureException/.test(FONTE)).toBe(true)
  })

  it('ainda mostra erro de verdade quando NÃO há snapshot do backend', () => {
    // Sem backend e sem motor local não há o que exibir: aí o erro tem de subir.
    expect(/if \(!temSnapshotBackend\) \{/.test(FONTE)).toBe(true)
  })
})
