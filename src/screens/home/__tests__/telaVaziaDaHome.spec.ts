import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'

/**
 * A tela vazia não pode descartar conteúdo que já está na mão.
 *
 * O defeito: `transitData` vem EXCLUSIVAMENTE do motor astral local, e na web
 * esse motor não roda (`BACKEND_ONLY_STATUS` tem default `true`). A guarda do
 * estado vazio testava só `transitData`, então bastava o motor não rodar para a
 * Home desistir — com o snapshot do backend carregado, válido e pronto logo
 * atrás, alimentando `lifeAreasForDisplay` e `astrologyDataFallback`.
 *
 * O resultado era uma tela presa em "Mapa em processamento" prometendo um
 * cálculo que nunca viria. Trocar o texto para "não foi possível" tornou a tela
 * honesta e igualmente inútil: a correção de verdade é não mostrar tela de vazio
 * quando existe o que mostrar.
 *
 * ⚠️ Regra que isto trava: a condição de vazio precisa considerar TODAS as
 * fontes de conteúdo, não só a mais frágil.
 *
 * A Home depende de Firebase, navegação e do motor astral — montá-la aqui é
 * inviável. A guarda é estática e cobre o que importa: a condição não volta a
 * olhar só para `transitData`.
 */

const FONTE = readFileSync(resolve(__dirname, '../HomeScreen.tsx'), 'utf8')

// A linha do early return, isolada do resto do arquivo.
const GUARDA = (FONTE.match(/if \(!loading && !transitData[^)]*\) \{/) || [''])[0]

describe('Home — estado vazio', () => {
  it('a guarda do estado vazio existe', () => {
    expect(GUARDA, 'o early return do estado vazio mudou de forma; revise este teste').not.toBe('')
  })

  it('considera o snapshot do backend, não só o motor local', () => {
    expect(
      /!temSnapshotBackend/.test(GUARDA),
      'sem isto, a web desiste com o snapshot do backend pronto e a tela fica presa',
    ).toBe(true)
  })

  it('deriva o snapshot de backendLifeAreas com conteúdo', () => {
    expect(
      /const temSnapshotBackend = !!backendLifeAreas && Object\.keys\(backendLifeAreas\)\.length > 0/.test(
        FONTE,
      ),
      'objeto vazio não é conteúdo: contar as chaves é o que separa um do outro',
    ).toBe(true)
  })

  it('o bloco que depende do motor local segue guardado', () => {
    // Renderizar sem `transitData` só é seguro porque cada consumidor do motor
    // está atrás de `transitData?.`. Se um acesso cru vazar para fora de uma
    // guarda, a Home passa a quebrar justamente no caso que esta correção abriu.
    expect(
      /Array\.isArray\(transitData\?\.currentTransits\?\.planetComparisons\)/.test(FONTE),
      'o card de trânsitos precisa continuar atrás da guarda de presença',
    ).toBe(true)
  })

  it('avisa quando o conteúdo está incompleto', () => {
    // Renderizar parcial sem dizer nada devolve o problema original em outra
    // forma: seções ausentes que parecem defeito do mapa da pessoa.
    expect(
      /<AvisoConteudoIncompleto/.test(FONTE) && /visivel=\{engineFailed\}/.test(FONTE),
      'conteúdo parcial precisa vir com o aviso, senão a ausência parece defeito',
    ).toBe(true)
  })
})
