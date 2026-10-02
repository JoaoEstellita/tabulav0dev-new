import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'

/**
 * A grade de aspectos precisa de altura EXPLÍCITA no ScrollView.
 *
 * Bug do APK (02/10): a grade aparecia no meio de um vão enorme — espaço vazio,
 * a tabela intacta, mais espaço vazio — nas abas Perfil e Mapa (natal, trânsitos,
 * solar e lunar). No navegador estava perfeita, o que mandou três rodadas de
 * investigação atrás de dado faltando. Não era dado: os números sempre estiveram
 * lá.
 *
 * Causa: `<ScrollView horizontal>` sem `height`. Sendo horizontal, o eixo cruzado
 * é o vertical, então o `alignItems: "center"` do contentContainerStyle centraliza
 * o SVG na vertical. No web o ScrollView encolhe para o filho e ninguém percebe;
 * sob a New Architecture (Fabric) ele estica, e o conteúdo passa a boiar no meio.
 *
 * O projeto não tem infra de render de componente, então a guarda é estática —
 * menos elegante que montar a árvore, mas pega a regressão que importa: alguém
 * mexer no AspectGrid e deixar um ScrollView horizontal sem altura de novo.
 */

const FONTE = readFileSync(resolve(__dirname, '../AspectGrid.tsx'), 'utf8')

describe('AspectGrid — layout sob Fabric', () => {
  it('todo ScrollView horizontal declara altura explícita', () => {
    const scrollViews = FONTE.split('\n')
      .map((linha, i) => ({ linha: linha.trim(), n: i + 1 }))
      .filter(({ linha }) => linha.startsWith('<ScrollView') && linha.includes('horizontal'))

    expect(scrollViews.length, 'o componente deveria ter as duas grades (simples e cruzada)').toBe(2)

    const semAltura = scrollViews.filter(({ linha }) => !/style=\{\{[^}]*height:/.test(linha))
    expect(
      semAltura.map(({ n }) => `linha ${n}`),
      'ScrollView horizontal sem height volta a esticar no APK e a grade boia num vão',
    ).toEqual([])
  })

  it('a altura usada é a do próprio SVG (H), não um número solto', () => {
    // H é calculado a partir do nº de linhas da grade; qualquer constante fixa
    // aqui voltaria a descolar o container do conteúdo.
    const alturas = [...FONTE.matchAll(/<ScrollView[^>]*horizontal[^>]*style=\{\{\s*height:\s*([^}\s]+)\s*\}\}/g)]
      .map((m) => m[1])

    expect(alturas.length, 'as duas grades devem casar o padrão de altura').toBe(2)
    expect(new Set(alturas), 'ambas devem usar a altura calculada do SVG').toEqual(new Set(['H']))
  })
})
