import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

/**
 * NENHUM CARACTERE DE CONTROLE NO CÓDIGO-FONTE.
 *
 * ⚠️ ISTO EXISTE PORQUE UM TESTE PASSOU SEM TESTAR NADA. O guarda que proibia
 * `<Image>` nas figuras do Estudo foi escrito por um script, e `\b` acabou
 * gravado como o BYTE 0x08 em vez do escape de borda de palavra. O regex virou
 * `/<Image<backspace>/`, que não casa com texto nenhum — então o `.not.toMatch`
 * passava sempre, inclusive depois de um `<Image>` ser de fato adicionado.
 *
 * ⚠️ E NÃO FOI UM CASO ISOLADO: a mesma varredura achou o mesmo defeito em
 * `ptBRAccentRegression.spec.ts`, de muito antes, onde dois asserts de acento
 * também nunca testaram nada. Teste que não testa é pior que teste nenhum —
 * ele compra confiança sem entregar cobertura, e não há como notar lendo o
 * código, porque 0x08 é invisível.
 *
 * ⚠️ POR QUE VALE PARA TODO O `src`, e não só para testes: a mesma gravação
 * por script produz literais de string e regex em código de produção. Um 0x08
 * dentro de um regex de catálogo faria a chave nunca casar — e este projeto já
 * sabe o que acontece quando uma chave não casa e o fallback cobre.
 *
 * Permitidos: tab (0x09), LF (0x0a) e CR (0x0d).
 */

const RAIZ = join(__dirname, '..', '..')
const EXTENSOES = /\.(ts|tsx|js|jsx)$/
/**
 * ⚠️ MONTADO POR `RegExp`, NAO escrito como literal. Um literal de regex com
 * esses bytes faria este arquivo violar a propria regra que ele guarda, e o
 * teste passaria a acusar a si mesmo para sempre. Com escapes dentro de uma
 * string comum, a fonte fica legivel e inerte.
 *
 * Faixa: 0x00-0x08, 0x0b, 0x0c, 0x0e-0x1f. Tab, LF e CR ficam de fora.
 */
const CONTROLE = new RegExp('[\u0000-\u0008\u000b\u000c\u000e-\u001f]')

function arquivosDe(dir: string): string[] {
  const out: string[] = []
  for (const nome of readdirSync(dir)) {
    if (nome === 'node_modules' || nome === '.git') continue
    const caminho = join(dir, nome)
    if (statSync(caminho).isDirectory()) out.push(...arquivosDe(caminho))
    else if (EXTENSOES.test(nome)) out.push(caminho)
  }
  return out
}

describe('código-fonte sem caractere de controle', () => {
  it('nenhum arquivo de src tem byte de controle solto', () => {
    const LF = String.fromCharCode(10)
    const sujos: string[] = []
    for (const caminho of arquivosDe(RAIZ)) {
      const texto = readFileSync(caminho, 'utf8')
      if (!CONTROLE.test(texto)) continue
      texto.split(LF).forEach((linha, i) => {
        if (!CONTROLE.test(linha)) return
        const codigos = [...linha]
          .filter((c) => CONTROLE.test(c))
          .map((c) => `0x${c.charCodeAt(0).toString(16).padStart(2, '0')}`)
          .join(',')
        sujos.push(`${caminho.slice(RAIZ.length + 1)}:${i + 1} [${codigos}]`)
      })
    }
    expect(
      sujos,
      'byte de controle é invisível no editor e faz regex nunca casar — o teste passa sem testar',
    ).toEqual([])
  })

  /**
   * ⚠️ A SONDA. Sem ela, um erro que fizesse a varredura não enxergar arquivo
   * nenhum deixaria este teste verde para sempre — que é exatamente o modo de
   * falha que ele existe para impedir.
   */
  it('a varredura realmente alcança os arquivos', () => {
    const achados = arquivosDe(RAIZ)
    expect(achados.length, 'a varredura não encontrou fonte nenhuma').toBeGreaterThan(100)
    expect(
      CONTROLE.test(`a${String.fromCharCode(8)}b`),
      'o detector deixou de reconhecer 0x08',
    ).toBe(true)
  })
})
