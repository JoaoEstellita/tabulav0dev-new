import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import fixtures from './fixtures_transitos.json'
import { emocoesDoDia, EMOCOES, K_CURVA } from '../emocoesDoDia'

/**
 * PARIDADE com o gêmeo do backend (`backend/lib/status/emocoes-do-dia.js`).
 *
 * ⚠️ POR QUE ISTO EXISTE.
 *
 * O projeto tem arquivos gêmeos desde sempre e nunca teve teste provando que
 * eles concordam. O resultado já apareceu: a síntese do dia passou a citar
 * trânsitos diferentes no app e no WhatsApp, e ninguém notou por semanas —
 * porque os dois continuavam funcionando, só que diferente.
 *
 * Aqui o gêmeo calcula NÚMERO, e número errado não dá erro: dá outro número.
 * Os dois lados comparam contra o MESMO arquivo de valores congelados, gerado
 * uma vez e versionado. Se um lado mudar sozinho, o lado dele quebra.
 *
 * ⚠️ Os dois testes precisam rodar. Este cobre o app; o do backend é
 * `npm run test:emocoes` lá. Um só não prova paridade nenhuma — prova que
 * aquele lado não mudou.
 */

const ESPERADO = join(__dirname, '..', '..', '..', '..', 'backend', 'tests', 'fixtures', 'emocoes-esperado.json')

describe('paridade com o gêmeo do backend', () => {
  /**
   * ⚠️ O backend não é parte do pacote do app, então num checkout só do
   * frontend o arquivo não existe. Isso é PULAR com aviso, nunca passar calado:
   * um teste de paridade que passa sem comparar nada é pior que não existir.
   */
  const temEsperado = existsSync(ESPERADO)

  it('o arquivo de valores congelados está acessível', () => {
    if (!temEsperado) {
      console.warn(`[paridade] esperado ausente em ${ESPERADO} — checkout sem backend?`)
    }
    expect(true).toBe(true)
  })

  it.skipIf(!temEsperado)('a constante da curva é a mesma dos dois lados', () => {
    const esperado = JSON.parse(readFileSync(ESPERADO, 'utf8'))
    expect(esperado.k, 'K divergiu entre app e backend').toBe(K_CURVA)
  })

  it.skipIf(!temEsperado)('os oito números batem, usuário por usuário', () => {
    const esperado = JSON.parse(readFileSync(ESPERADO, 'utf8'))
    const divergencias: string[] = []

    for (const u of fixtures as any[]) {
      const esp = esperado.valores[u.uid]
      const r = emocoesDoDia(u.transitos)
      if (esp === null || esp === undefined) {
        if (r !== null) divergencias.push(`${u.uid}: app calculou, backend devolveu null`)
        continue
      }
      if (!r) { divergencias.push(`${u.uid}: app devolveu null, backend calculou`); continue }
      const got = Object.fromEntries(r.map((e) => [e.chave, e.valor]))
      for (const chave of EMOCOES) {
        if (got[chave] !== esp[chave]) {
          divergencias.push(`${u.uid}.${chave}: app ${got[chave]} ≠ backend ${esp[chave]}`)
        }
      }
    }

    expect(
      divergencias,
      divergencias.length
        ? `os gêmeos discordam:\n  ${divergencias.slice(0, 12).join('\n  ')}` +
          `\n\nVeja o cabeçalho de backend/lib/status/emocoes-do-dia.js.`
        : '',
    ).toEqual([])
  })

  /**
   * ⚠️ Emoção nova de um lado só passaria despercebida no laço acima, que
   * itera as chaves conhecidas. Este conta.
   */
  it.skipIf(!temEsperado)('os dois lados conhecem as mesmas oito emoções', () => {
    const esperado = JSON.parse(readFileSync(ESPERADO, 'utf8'))
    const doBackend = Object.keys(esperado.valores)
      .map((uid) => esperado.valores[uid])
      .find(Boolean)
    expect(doBackend, 'nenhum usuário com valores no esperado').toBeTruthy()
    expect(Object.keys(doBackend).sort()).toEqual([...EMOCOES].sort())
  })
})
