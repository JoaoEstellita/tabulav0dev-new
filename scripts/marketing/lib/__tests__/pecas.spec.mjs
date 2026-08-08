import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { roteiroDeLegenda, legendaDoReel, picar } from '../roteiroLegenda.mjs'
import { fontesEmbutidas, SANS, MONO, SANS_DISPONIVEIS } from '../fontes.mjs'

const LIB = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

/**
 * O ritmo do Reel.
 *
 * O João assistiu e disse: "em 12 segundos o texto fica muito rápido". Estava —
 * a janela útil de 9,7s dividida por até oito blocos dava 1,2s cada, e legenda
 * queimada se lê a uma velocidade de umas três palavras por segundo.
 */
describe('legenda queimada', () => {
  const SEGUNDOS = 20

  it('nenhum bloco fica menos de 1,8s na tela', () => {
    const texto =
      'Eclipse solar é Lua Nova em cima do eixo dos nódulos — o cruzamento entre a órbita ' +
      'da Lua e o caminho aparente do Sol. Nas outras onze Luas Novas do ano ela passa ' +
      'acima ou abaixo do Sol e não cobre nada: por isso eclipse vem em temporada.'
    const segmentos = roteiroDeLegenda([...picar(texto), 'O céu é de todos.'], { segundos: SEGUNDOS })

    for (const s of segmentos) {
      const dura = (s.ate - s.de) * SEGUNDOS
      expect(dura, `"${s.texto}" ficou ${dura.toFixed(2)}s`).toBeGreaterThanOrEqual(1.75)
    }
  })

  // Não é só tempo: legenda queimada disputa atenção com o que se move na
  // imagem, e depois de quatro blocos ninguém está mais lendo.
  it('no máximo quatro blocos, por mais longo que seja o texto', () => {
    const enorme = Array.from({ length: 12 }, (_, i) => `Frase número ${i} com algumas palavras aqui.`).join(' ')
    expect(roteiroDeLegenda(picar(enorme), { segundos: SEGUNDOS }).length).toBeLessThanOrEqual(4)
  })

  it('o limite da casa é sempre o último a ficar na tela', () => {
    const segmentos = legendaDoReel({ textoEvento: 'Um texto qualquer. Com duas frases.' }, SEGUNDOS)
    expect(segmentos[segmentos.length - 1].texto).toContain('casa é de cada um')
  })

  it('os blocos não se sobrepõem', () => {
    const segmentos = legendaDoReel({ textoEvento: 'Primeira frase. Segunda frase. Terceira frase aqui.' }, SEGUNDOS)
    for (let i = 1; i < segmentos.length; i++) {
      expect(segmentos[i].de).toBeGreaterThanOrEqual(segmentos[i - 1].ate - 0.0001)
    }
  })
})

/**
 * A fonte viaja dentro do HTML.
 *
 * Antes o card dependia de `Palatino Linotype` no Windows e de
 * `fonts-urw-base35` no runner: duas fontes diferentes desenhando a mesma peça,
 * e nenhuma garantia de que o aprovado era o publicado.
 */
describe('tipografia embutida', () => {
  it('o @font-face carrega a fonte por data: URI', () => {
    const css = fontesEmbutidas('inter')
    expect(css).toContain("font-family: 'TE Sans'")
    expect(css).toContain("font-family: 'TE Mono'")
    expect(css).toMatch(/url\(data:font\/woff2;base64,[A-Za-z0-9+/=]{5000,}\)/)
  })

  it('as duas famílias candidatas existem e são diferentes', () => {
    const a = fontesEmbutidas('inter')
    const b = fontesEmbutidas('grotesk')
    expect(Object.keys(SANS_DISPONIVEIS)).toEqual(['inter', 'grotesk'])
    expect(a).not.toBe(b)
  })

  // Se um template voltar a nomear uma fonte do sistema, a peça volta a sair
  // diferente em cada máquina — e isso não aparece em nenhum teste de conteúdo.
  it('nenhum template pede fonte instalada no sistema', () => {
    const proibidas = /Palatino|Book Antiqua|URW Palladio|P052|Cascadia|Consolas|DejaVu Sans Mono|Georgia/
    for (const arq of ['templateCarta.mjs', 'template.mjs', 'templateAnimado.mjs', 'templateCarrossel.mjs']) {
      const fonte = readFileSync(path.join(LIB, arq), 'utf8')
      const linhas = fonte.split('\n').filter((l) => proibidas.test(l) && !l.trimStart().startsWith('*') && !l.trimStart().startsWith('//') && !l.includes('/*'))
      expect(linhas, `${arq}: ${linhas.join(' | ')}`).toHaveLength(0)
    }
  })

  it('as pilhas nomeiam a família embutida primeiro', () => {
    expect(SANS.startsWith("'TE Sans'")).toBe(true)
    expect(MONO.startsWith("'TE Mono'")).toBe(true)
  })
})
