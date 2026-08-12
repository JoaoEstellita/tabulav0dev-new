/**
 * As fontes das peças, embutidas no HTML.
 *
 * O card dependia de `Palatino Linotype` no Windows e de `fonts-urw-base35` no
 * runner do GitHub — duas fontes diferentes desenhando a mesma peça, e nenhuma
 * garantia de que o que o João aprovava era o que ia para o Instagram. A mono
 * tinha o mesmo problema: Consolas aqui, DejaVu Sans Mono lá.
 *
 * Com `data:` URI o arquivo da fonte viaja dentro da página. Mesmo byte nos dois
 * lugares, sem `apt-get`, sem rede na hora de renderizar.
 *
 * Os nomes das famílias são internos de propósito — `TE Sans`, `TE Mono`. Trocar
 * a fonte passa a ser trocar um arquivo aqui, sem tocar em nenhum template.
 */
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const PASTA = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../assets/fonts')

/**
 * As duas candidatas a sans.
 *
 * Inter é a neutra — desenhada para tela, altura de x grande, aguenta o feed a
 * 380px. Space Grotesk tem mais caráter no título e é mais estreita, o que ajuda
 * num título de duas linhas.
 */
export const SANS_DISPONIVEIS = { inter: 'inter.woff2', grotesk: 'grotesk.woff2' }

/** Lidas uma vez: o carrossel monta dez páginas, e ler dez vezes é desperdício. */
const cache = new Map()

function base64(arquivo) {
  if (!cache.has(arquivo)) {
    cache.set(arquivo, readFileSync(path.join(PASTA, arquivo)).toString('base64'))
  }
  return cache.get(arquivo)
}

/**
 * O bloco `@font-face` para colar no `<style>` de qualquer template.
 *
 * `font-weight: 100 900` porque os arquivos são variable: um só arquivo cobre
 * do regular ao bold, e o navegador interpola. Sem isso o Chrome sintetiza o
 * negrito engordando o desenho, que é o que deixa título de card com cara de
 * screenshot.
 *
 * @param {'inter'|'grotesk'} sans qual família de texto usar
 */
export function fontesEmbutidas(sans = 'inter') {
  const arquivo = SANS_DISPONIVEIS[sans] || SANS_DISPONIVEIS.inter
  return `
  @font-face {
    font-family: 'TE Sans';
    src: url(data:font/woff2;base64,${base64(arquivo)}) format('woff2');
    font-weight: 100 900; font-style: normal; font-display: block;
  }
  @font-face {
    font-family: 'TE Mono';
    src: url(data:font/woff2;base64,${base64('mono.woff2')}) format('woff2');
    font-weight: 100 800; font-style: normal; font-display: block;
  }
  @font-face {
    font-family: 'TE Serif';
    src: url(data:font/woff2;base64,${base64('serif.woff2')}) format('woff2');
    font-weight: 400 900; font-style: normal; font-display: block;
  }`
}

/**
 * As pilhas para usar nos templates.
 *
 * O fallback existe só para o caso de a fonte embutida falhar em carregar; se
 * ele aparecer numa peça, é bug, não escolha.
 */
export const SANS = "'TE Sans', system-ui, -apple-system, 'Segoe UI', sans-serif"
export const MONO = "'TE Mono', ui-monospace, Consolas, 'DejaVu Sans Mono', monospace"

/**
 * A serif do TÍTULO, e só dele.
 *
 * É Cinzel, romana de caixa alta, a mais próxima do desenho do logotipo, que é
 * do mesmo gênero de letra. O corpo do texto continua na sans: Cinzel tem
 * altura de x pequena e não é feita para parágrafo, e usá-la no texto longo
 * deixaria a peça bonita e ilegível a 380px.
 */
export const SERIF = "'TE Serif', 'Cinzel', Georgia, 'Times New Roman', serif"

/**
 * Qual sans usar, com um respiro para experimentar sem editar código.
 *
 * `TABULA_SANS=grotesk node scripts/marketing/gerarCard.mjs …` gera a mesma peça
 * na outra família — foi assim que as duas foram comparadas lado a lado.
 */
export const SANS_ESCOLHIDA = process.env.TABULA_SANS === 'grotesk' ? 'grotesk' : 'inter'
