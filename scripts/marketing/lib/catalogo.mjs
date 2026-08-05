/**
 * Lê objetos literais de catálogos `.ts` do app dentro de um script Node puro.
 *
 * Node 20 não tem `--experimental-strip-types` (chegou no 22.6) e o projeto não
 * expõe esbuild. Duplicar os textos aqui faria o card divergir do app na
 * primeira curadoria, então extraímos o literal direto da fonte.
 *
 * Transpilar o arquivo inteiro seria frágil (há `const` tipado sem `export`,
 * funções com parâmetros tipados). Em vez disso, isolamos apenas o literal
 * pedido — varredura com profundidade de chaves, respeitando strings e
 * comentários — e avaliamos esse trecho. Nada além do literal é executado.
 */
import { readFile } from 'node:fs/promises'
import path from 'node:path'

/**
 * Localiza o literal de `export const <nome> ... = { … }` e devolve o trecho.
 * @param {string} codigo
 * @param {string} nome
 * @returns {string}
 */
function recortarLiteral(codigo, nome) {
  const decl = new RegExp(`export\\s+const\\s+${nome}\\b`).exec(codigo)
  if (!decl) throw new Error(`export const ${nome} não encontrado`)

  // do fim da declaração até o `=` que abre o valor (a anotação de tipo pode
  // atravessar linhas, mas nunca contém `=`)
  const igual = codigo.indexOf('=', decl.index + decl[0].length)
  if (igual === -1) throw new Error(`${nome}: declaração sem valor`)

  let i = igual + 1
  while (i < codigo.length && /\s/.test(codigo[i])) i++
  const abre = codigo[i]
  const fecha = abre === '{' ? '}' : abre === '[' ? ']' : null
  if (!fecha) throw new Error(`${nome}: valor não é objeto nem array (achei "${abre}")`)

  const inicio = i
  let prof = 0
  let aspas = null // caractere que abriu a string corrente
  let comentario = null // 'linha' | 'bloco'

  for (; i < codigo.length; i++) {
    const c = codigo[i]
    const prox = codigo[i + 1]

    if (comentario === 'linha') {
      if (c === '\n') comentario = null
      continue
    }
    if (comentario === 'bloco') {
      if (c === '*' && prox === '/') { comentario = null; i++ }
      continue
    }
    if (aspas) {
      if (c === '\\') { i++; continue }
      if (c === aspas) aspas = null
      continue
    }

    if (c === '/' && prox === '/') { comentario = 'linha'; i++; continue }
    if (c === '/' && prox === '*') { comentario = 'bloco'; i++; continue }
    if (c === "'" || c === '"' || c === '`') { aspas = c; continue }

    if (c === abre) prof++
    else if (c === fecha) {
      prof--
      if (prof === 0) return codigo.slice(inicio, i + 1)
    }
  }

  throw new Error(`${nome}: literal não fecha — arquivo truncado?`)
}

/**
 * Extrai um ou mais objetos literais exportados por um arquivo `.ts`.
 *
 * @param {string} arquivoTs caminho do `.ts`
 * @param {string[]} nomes nomes dos `export const` desejados
 * @returns {Promise<Record<string, any>>} mapa nome → valor
 */
export async function lerLiterais(arquivoTs, nomes) {
  const codigo = await readFile(arquivoTs, 'utf8')
  const saida = {}

  for (const nome of nomes) {
    let trecho
    try {
      trecho = recortarLiteral(codigo, nome)
    } catch (erro) {
      throw new Error(`${path.basename(arquivoTs)} → ${erro.message}`)
    }

    // `as const` / `as Record<…>` podem aparecer dentro do literal em outros
    // catálogos; removê-las é seguro porque não alteram o valor.
    const limpo = trecho
      .replace(/\s+as\s+const\b/g, '')
      .replace(/\s+as\s+Record<[^>]*>/g, '')

    try {
      saida[nome] = new Function(`return (${limpo})`)()
    } catch (erro) {
      throw new Error(`${path.basename(arquivoTs)} → ${nome} não avaliou: ${erro.message}`)
    }
  }

  return saida
}
