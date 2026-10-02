import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'

/**
 * A grade de aspectos precisa de altura EXPLÍCITA no ScrollView.
 *
 * Um `<ScrollView horizontal>` tem o eixo cruzado na VERTICAL, então o
 * `alignItems: "center"` do contentContainerStyle centraliza o SVG na vertical.
 * No web o ScrollView encolhe até o filho; sob a New Architecture (Fabric) ele
 * estica, e sem `height` o conteúdo passa a boiar.
 *
 * O projeto não tem infra de render de componente, então a guarda é estática.
 * Ela casa o bloco inteiro da tag (não a linha), para não quebrar quando o JSX
 * é reformatado em várias linhas — foi o que aconteceu na primeira versão.
 */

const FONTE = readFileSync(resolve(__dirname, '../AspectGrid.tsx'), 'utf8')

/** Blocos `<ScrollView ... >` completos, com atributos em qualquer número de linhas. */
const blocosScrollView = (): string[] =>
  [...FONTE.matchAll(/<ScrollView\b[\s\S]*?>/g)]
    .map((m) => m[0])
    .filter((b) => /\bhorizontal\b/.test(b))

describe('AspectGrid — layout sob Fabric', () => {
  it('tem as duas grades (simples e cruzada)', () => {
    expect(blocosScrollView().length).toBe(2)
  })

  it('todo ScrollView horizontal declara altura explícita', () => {
    const semAltura = blocosScrollView().filter((b) => !/style=\{\{[^}]*height:/.test(b))
    expect(
      semAltura.length,
      'ScrollView horizontal sem height volta a esticar no APK e a grade boia num vão',
    ).toBe(0)
  })

  it('a altura usada é a do próprio SVG (H), não um número solto', () => {
    const alturas = blocosScrollView()
      .map((b) => b.match(/style=\{\{\s*height:\s*([^}\s]+)\s*\}\}/)?.[1])
      .filter(Boolean)

    expect(alturas.length, 'as duas grades devem declarar altura').toBe(2)
    expect(new Set(alturas), 'ambas devem usar a altura calculada do SVG').toEqual(new Set(['H']))
  })
})
