import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync } from 'fs'
import { resolve } from 'path'

/**
 * O glossário precisa estar LIGADO em tela.
 *
 * Na primeira entrega o `TextoComGlossario` e o modo Linguagem simples foram
 * criados, testados e commitados — sem nenhuma tela usar. Tudo verde, nada
 * visível: o glossário não abria e o modo simples não trocava palavra nenhuma.
 * Componente novo sem call site passa em qualquer suíte.
 *
 * Esta guarda cobre o essencial: as telas onde o jargão se concentra continuam
 * usando o componente. Se alguém trocar de volta por `<Text>`, quebra aqui em
 * vez de a funcionalidade sumir em silêncio.
 */

const RAIZ = resolve(__dirname, '../..')

const TELAS_COM_JARGAO = [
  // Rótulo "Sol quadratura Lua" + leitura de cada aspecto natal.
  'screens/cosmos/AstroProfileScreen.tsx',
  // Corpo do modal que abre ao tocar numa célula da grade.
  'screens/cosmos/NatalChartWheelScreen.tsx',
  // "Vênus quadratura Marte" nos cards de trânsito do dia.
  'components/TransitInsightCard.tsx',
]

describe('glossário ligado nas telas', () => {
  for (const caminho of TELAS_COM_JARGAO) {
    it(`${caminho} usa TextoComGlossario`, () => {
      const src = readFileSync(resolve(RAIZ, caminho), 'utf8')
      expect(
        /<TextoComGlossario\b/.test(src),
        'sem call site o glossário não abre e o modo Linguagem simples não troca nada',
      ).toBe(true)
      expect(/import TextoComGlossario/.test(src), 'componente usado sem import').toBe(true)
    })
  }

  it('o componente é usado em pelo menos 3 arquivos', () => {
    // Trava o alcance: ligar num canto só não resolve o problema que motivou.
    const usos: string[] = []
    const varrer = (dir: string) => {
      for (const e of readdirSync(dir, { withFileTypes: true })) {
        if (e.name === '__tests__' || e.name === 'node_modules') continue
        const cam = resolve(dir, e.name)
        if (e.isDirectory()) varrer(cam)
        else if (e.name.endsWith('.tsx') && e.name !== 'TextoComGlossario.tsx') {
          if (/<TextoComGlossario\b/.test(readFileSync(cam, 'utf8'))) usos.push(e.name)
        }
      }
    }
    varrer(RAIZ)
    expect(usos.length).toBeGreaterThanOrEqual(3)
  })
})
