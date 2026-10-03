import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync } from 'fs'
import { resolve } from 'path'

/**
 * Modais globais só podem ser montados UMA vez.
 *
 * `TrialWelcomeModal` estava em dois lugares ao mesmo tempo — na instância global
 * do AppNavigator e de novo dentro da HomeScreen. Cada cópia tem o próprio estado
 * `visible`, então na Home as duas abriam e a pessoa recebia o mesmo aviso duas
 * vezes logo no primeiro acesso. A chave do AsyncStorage não protege: as duas leem
 * antes de qualquer uma escrever.
 *
 * Um modal duplicado não quebra teste nenhum e não aparece em log — só incomoda
 * quem usa. Por isso a guarda é estática.
 */

const RAIZ = resolve(__dirname, '../..')
const IGNORAR = new Set(['__tests__', 'node_modules', 'assets'])

/** Arquivos .tsx que montam `<Nome ...>`, excluindo o próprio componente. */
function ondeEMontado(nome: string, dir = RAIZ, achados: string[] = []): string[] {
  for (const entrada of readdirSync(dir, { withFileTypes: true })) {
    if (IGNORAR.has(entrada.name)) continue
    const caminho = resolve(dir, entrada.name)
    if (entrada.isDirectory()) {
      ondeEMontado(nome, caminho, achados)
    } else if (entrada.name.endsWith('.tsx') && entrada.name !== `${nome}.tsx`) {
      if (new RegExp(`<${nome}\\b`).test(readFileSync(caminho, 'utf8'))) {
        achados.push(caminho.slice(RAIZ.length + 1).replace(/\\/g, '/'))
      }
    }
  }
  return achados
}

describe('modais globais montados uma única vez', () => {
  it('TrialWelcomeModal aparece em exatamente um lugar', () => {
    const lugares = ondeEMontado('TrialWelcomeModal')
    expect(
      lugares,
      'montado em mais de um lugar, o mesmo aviso abre repetido no primeiro acesso',
    ).toHaveLength(1)
  })
})
