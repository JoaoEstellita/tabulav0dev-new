/**
 * Os símbolos dos doze signos, desenhados.
 *
 * O João pediu imagem por signo, "pode ser símbolo". O glifo tipográfico
 * resolvia o reconhecimento, mas vinha da fonte: desenho de outra pessoa, com o
 * peso e o acabamento que a família de texto tiver. Numa peça em que o símbolo
 * ocupa um quarto do quadro, isso aparece.
 *
 * Estes são SVG, traçados no mesmo peso de linha, e escalam sem serrilhar.
 * Cada um segue o desenho tradicional do glifo — não é reinterpretação: quem
 * conhece astrologia reconhece na hora, que é o ponto.
 *
 * `viewBox` de 100×100 em todos, para trocar de tamanho sem recalcular nada.
 */

/** Traço uniforme: o que faz os doze parecerem de uma família só. */
const T = 'fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"'

export const SIMBOLO = {
  // ♈ os chifres do carneiro
  'Áries': `<path ${T} d="M50 88 V38 M50 38 C50 18 34 12 24 20 C14 28 16 44 26 50 M50 38 C50 18 66 12 76 20 C86 28 84 44 74 50"/>`,

  // ♉ a cabeça do touro
  'Touro': `<circle ${T} cx="50" cy="62" r="26"/><path ${T} d="M22 36 C22 16 44 10 50 30 C56 10 78 16 78 36"/>`,

  // ♊ os gêmeos, duas colunas
  'Gêmeos': `<path ${T} d="M26 18 C42 26 58 26 74 18 M26 82 C42 74 58 74 74 82 M38 22 V78 M62 22 V78"/>`,

  // ♋ as duas pinças do caranguejo
  'Câncer': `<path ${T} d="M14 40 C24 26 52 26 62 40"/><circle ${T} cx="26" cy="46" r="9"/><path ${T} d="M86 60 C76 74 48 74 38 60"/><circle ${T} cx="74" cy="54" r="9"/>`,

  // ♌ a juba e a cauda do leão
  'Leão': `<path ${T} d="M34 74 C18 74 14 56 26 48 C38 40 50 48 48 62 C46 78 56 86 70 84 C80 82 86 74 86 66"/><circle ${T} cx="30" cy="34" r="14"/>`,

  // ♍ o M com a volta da virgem
  'Virgem': `<path ${T} d="M18 30 V70 M18 34 C18 24 34 24 34 34 V64 M34 36 C34 26 50 26 50 36 V70 M50 44 C50 32 66 30 72 42 C78 54 70 68 58 72 M64 58 C74 62 82 72 86 84"/>`,

  // ♎ a balança
  'Libra': `<path ${T} d="M16 78 H84 M16 58 H40 M60 58 H84 M40 58 C40 40 60 40 60 58"/>`,

  // ♏ o M com o ferrão
  'Escorpião': `<path ${T} d="M14 30 V70 M14 34 C14 24 30 24 30 34 V70 M30 34 C30 24 46 24 46 34 V70 M46 34 C46 24 62 24 62 34 V74 L80 74 M80 74 L72 66 M80 74 L72 82"/>`,

  // ♐ a flecha
  'Sagitário': `<path ${T} d="M22 78 L80 20 M56 20 H80 V44 M36 44 L58 66"/>`,

  // ♑ a cabra-peixe
  'Capricórnio': `<path ${T} d="M16 32 C16 32 26 30 30 42 C34 54 34 66 34 66 M34 40 C42 26 56 28 58 42 C60 56 52 68 44 68 M58 50 C74 46 84 56 80 68 C76 80 62 80 58 70"/>`,

  // ♒ as duas ondas
  'Aquário': `<path ${T} d="M14 42 L28 30 L42 42 L56 30 L70 42 L84 30 M14 68 L28 56 L42 68 L56 56 L70 68 L84 56"/>`,

  // ♓ os dois peixes
  'Peixes': `<path ${T} d="M28 16 C14 34 14 66 28 84 M72 16 C86 34 86 66 72 84 M18 50 H82"/>`,
}

/**
 * O símbolo como SVG pronto para a peça.
 *
 * `currentColor` no traço: a cor vem do CSS de quem usa, sem duplicar paleta.
 */
export function svgDoSigno(signo, tamanho = 100) {
  const desenho = SIMBOLO[signo]
  if (!desenho) return ''
  return `<svg viewBox="0 0 100 100" width="${tamanho}" height="${tamanho}" role="img" aria-label="${signo}">${desenho}</svg>`
}
