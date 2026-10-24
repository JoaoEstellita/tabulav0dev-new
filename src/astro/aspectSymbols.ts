// Vocabulário visual dos aspectos: símbolo, cor e rótulo.
//
// ⚠️ Vive FORA do componente de propósito. Enquanto morava dentro de
// `AspectGrid.tsx`, nenhum teste conseguia olhar para ele — importar o
// componente puxa `react-native`, que o vitest não parseia (Flow). E o jeito
// como esta tabela falha é silencioso: sem símbolo, `ASPECT_SYM[norm(type)]`
// dá undefined, a célula sai vazia e o aspecto some da grade sem erro nenhum.
// Foi o que aconteceu com semiquadratura, sesquiquadratura e semissextil.
import { norm } from './transitCellId'

/**
 * GLIFOS DE PLANETA E PONTO.
 *
 * ⚠️ Vieram de TRÊS cópias idênticas — `AspectGrid`, `ForecastEphemerisChart`
 * e `PlanetQuickNav` tinham cada um a sua. As três concordavam nos dez
 * planetas, mas divergiam na cobertura (só uma tinha Lilith e nódulos, só uma
 * tinha ângulos), então o mesmo ponto aparecia com glifo numa tela e com as
 * duas primeiras letras na outra.
 *
 * ⚠️ `ForecastEphemerisChart` ainda tem uma tabela PRÓPRIA de aspectos, com
 * símbolos diferentes dos daqui (✶ para sextil, □ para quadratura). Não mexi
 * para não arrastar o layout daquela tela junto, mas é divergência conhecida:
 * o mesmo aspecto desenhado de dois jeitos no mesmo app.
 */
export const PLANET_SYM: Record<string, string> = {
  Sun: '☉', Moon: '☽', Mercury: '☿', Venus: '♀', Mars: '♂',
  Jupiter: '♃', Saturn: '♄', Uranus: '♅', Neptune: '♆', Pluto: '♇',
  Lilith: '⚸', Chiron: '⚷',
  NorthNode: '☊', SouthNode: '☋',
}

/** Ângulos e pontos que não são planeta. Sem glifo consagrado: vão por sigla. */
export const PONTO_SYM: Record<string, string> = {
  ...PLANET_SYM,
  Ascendant: 'Asc', ASC: 'Asc', Asc: 'Asc',
  Midheaven: 'MC', MC: 'MC',
  Descendant: 'Dsc', DSC: 'Dsc', Dsc: 'Dsc',
  IC: 'IC',
}

/**
 * O glifo de um ponto. Sem correspondência, devolve as DUAS primeiras letras —
 * nunca string vazia, que deixaria um buraco no lugar do símbolo.
 */
export const pontoSymbol = (nome: string): string => {
  const n = String(nome || '').trim()
  return PONTO_SYM[n] || n.slice(0, 2)
}

export const ASPECT_SYM: Record<string, string> = {
  conjuncao: "☌", conjunction: "☌",
  sextil: "⚹", sextile: "⚹",
  quadratura: "□", square: "□",
  trigono: "△", trine: "△",
  oposicao: "☍", opposition: "☍",
  quincuncio: "⚻", quincunx: "⚻",
  // ⚠️ Faltavam os dois menores duros. O motor os emite desde `b96acf8` e a
  // grade os DESCARTAVA em silêncio: `ASPECT_SYM[norm(type)]` undefined =
  // célula vazia, sem nada na tela dizendo que ali havia um aspecto.
  semiquadratura: "∠", semisquare: "∠",
  sesquiquadratura: "⚼", sesquisquare: "⚼", sesquiquadrate: "⚼",
  semissextil: "⚺", semisextil: "⚺", semisextile: "⚺", semisestile: "⚺",
}
export const ASPECT_TONE: Record<string, string> = {
  conjuncao: "#FFD700", conjunction: "#FFD700",
  sextil: "#22C55E", sextile: "#22C55E",
  trigono: "#4A90E2", trine: "#4A90E2",
  quadratura: "#EF4444", square: "#EF4444",
  oposicao: "#F59E0B", opposition: "#F59E0B",
  quincuncio: "#B39DDB", quincunx: "#B39DDB",
  // Tensos como a quadratura, porém mais apagados: são secundários por
  // definição e não devem disputar o olho com os maiores.
  semiquadratura: "#B06B66", semisquare: "#B06B66",
  sesquiquadratura: "#B0846B", sesquisquare: "#B0846B", sesquiquadrate: "#B0846B",
  // Brando e de apoio, como o sextil — porém apagado, porque é menor.
  semissextil: "#6B9E6B", semisextil: "#6B9E6B", semisextile: "#6B9E6B", semisestile: "#6B9E6B",
}
export const ASPECT_LABEL: Record<string, string> = {
  conjuncao: "Conjunção", sextil: "Sextil", quadratura: "Quadratura",
  trigono: "Trígono", oposicao: "Oposição", quincuncio: "Quincúncio",
  semiquadratura: "Semiquadratura", sesquiquadratura: "Sesquiquadratura",
  semissextil: "Semissextil",
}

/**
 * O símbolo do aspecto, ou vazio se a grade não souber desenhá-lo.
 * O teste de cobertura confronta isto com o que `aspects.config` emite.
 */
export const aspectSymbol = (type: string): string => ASPECT_SYM[norm(type)] || ''

/**
 * A cor do aspecto — a MESMA régua da grade.
 *
 * Existe espelhando `aspectSymbol` porque `norm` é privado do módulo: sem este
 * helper, quem precisasse da cor teria de reimplementar a normalização, e duas
 * normalizações com regras levemente diferentes é como o projeto já pintou o
 * mesmo aspecto de duas cores.
 */
export const aspectTone = (type: string): string | undefined => ASPECT_TONE[norm(type)]

/** A ordem em que a legenda lista os aspectos presentes. */
export const ORDEM_DA_LEGENDA = [
  'conjuncao', 'sextil', 'quadratura', 'trigono', 'oposicao',
  'quincuncio', 'semiquadratura', 'sesquiquadratura', 'semissextil',
]
