import type { Desvio } from '../utils/emocoesDoDia'
// A ESCALA EXIBIDA das areas da vida — 50 e o tipico.
//
// ⚠️ GEMEO de `backend/lib/status/escala-da-area.js`. Paridade em
// `backend/tests/escala-areas.unit.js`.
//
// ⚠️ POR QUE REMAPEAR, e nao so anotar o numero.
//
// Medido com o motor de verdade (`scripts/calibrar-areas.js`), 20 mapas reais
// x 120 datas no ano — 2400 leituras: a mediana das areas e 41 e so 24% das
// leituras chegam a 50. Tres de cada quatro leituras ficam abaixo do meio. Como
// a tela mostra um numero solto que parece nota de 0 a 100, o app dizia para
// quase todo mundo, quase todo dia, que a vida esta abaixo da media.
//
// E as areas nao vivem no mesmo patamar: Carreira tem mediana 36 e Comunicacao
// 45. Isso nao estragava so o numero exibido — contaminava DECISOES. Pelo
// numero cru, Carreira saia como "area mais sensivel" em 25% das leituras e
// Espiritualidade em 4%, quando o esperado seria ~12,5% cada.
//
// Anotar o numero com uma referencia corrige quem le o modal e mais nada.
// Remapear corrige a origem: depois disto, 50 e o tipico EM TODA AREA, as oito
// ficam comparaveis por construcao, e qualquer lugar que compare areas acerta
// sem precisar lembrar de aplicar correcao.
//
// ⚠️ A ORDEM DENTRO DE CADA AREA E PRESERVADA. A transformacao e monotonica:
// nenhum dia muda de posicao em relacao a outro do mesmo mapa. Muda a regua,
// nao o julgamento.
//
// ⚠️ ISTO NAO TOCA EM LIMIAR DE ALERTA. `cron-status-broadcast` continua lendo
// o valor CRU de `userStatus`, de proposito: mudar a escala e mudar quem
// recebe WhatsApp/push sao duas decisoes, e so a primeira foi tomada. O valor
// gravado tambem segue cru, senao o historico de 30 dias misturaria escalas.

/**
 * As ancoras medidas: [p01, p10, p50, p90, p99] do valor CRU de cada area.
 *
 * ⚠️ SAIRAM DA MEDICAO, nao de palpite — `node scripts/calibrar-areas.js
 * --mapas 20 --datas 120`. Conferidas duas vezes: com 1200 e com 2400
 * leituras as medianas sairam identicas e os decis dentro de 1 ponto.
 *
 * ⚠️ p01/p99 E NAO min/max: minimo e maximo sao UMA observacao cada e pulam de
 * rodada para rodada; os percentis extremos sao estaveis.
 */
export const ANCORAS_POR_AREA: Record<string, number[]> = {
  amor: [22, 28, 40, 55, 66],
  carreira: [20, 25, 36, 51, 66],
  comunicacao: [22, 31, 45, 59, 68],
  espiritualidade: [25, 32, 45, 59, 69],
  familia: [22, 28, 39, 55, 70],
  financas: [22, 30, 42, 57, 68],
  saude: [19, 29, 42, 58, 68],
  transformacao: [21, 27, 39, 56, 68],
}
/**
 * Para onde cada ancora vai na escala exibida.
 *
 * ⚠️ 50 NO TIPICO e o ponto de tudo isto. 25 e 75 nos decis fazem "abaixo de
 * 25" significar literalmente "um dos 10% piores dias desta area" — um limiar
 * que se explica sozinho, em vez de um corte fixo que acerta uma area e erra
 * outra.
 */
export const DESTINO = [5, 25, 50, 75, 95]

/** O piso e o teto: o extremo absoluto nao deve ser alcancavel. */
export const MINIMO = 2
export const MAXIMO = 98

/** ⚠️ Hermes NAO suporta regex `\p{...}` — o gemeo usa o range direto. */
export const chaveDaArea = (area: unknown): string => String(area || '')
  .toLowerCase()
  .trim()
  .normalize('NFD')
  .replace(/[̀-ͯ]/g, '')
/**
 * Converte o valor CRU do motor para a escala exibida.
 *
 * Devolve `null` quando nao da para converter — area desconhecida ou valor
 * ausente. Quem chama decide o que fazer; devolver o cru calado misturaria as
 * duas escalas na mesma tela, que e pior que nao mostrar.
 *
 * ⚠️ `Number(null)` E 0, E 0 PASSA EM `isFinite` — a armadilha que ja mordeu
 * este projeto cinco vezes. Aqui ela entraria como "o pior dia possivel".
 */
export function escalaDaArea(area: unknown, bruto: unknown): number | null {
  if (bruto === null || bruto === undefined || bruto === '') return null
  const v = Number(bruto)
  if (!Number.isFinite(v)) return null
  const ancoras = ANCORAS_POR_AREA[chaveDaArea(area)]
  if (!ancoras) return null
  // Abaixo da primeira ancora: extrapola pela inclinacao do primeiro trecho,
  // sem deixar passar do piso.
  if (v <= ancoras[0]) {
    const larg = ancoras[1] - ancoras[0]
    const frac = larg > 0 ? (v - ancoras[0]) / larg : 0
    return Math.max(MINIMO, Math.round(DESTINO[0] + frac * (DESTINO[1] - DESTINO[0])))
  }
  for (let i = 0; i < ancoras.length - 1; i++) {
    if (v <= ancoras[i + 1]) {
      const larg = ancoras[i + 1] - ancoras[i]
      // Ancoras coladas (area sem variacao medida) dariam divisao por zero.
      const frac = larg > 0 ? (v - ancoras[i]) / larg : 0
      const out = DESTINO[i] + frac * (DESTINO[i + 1] - DESTINO[i])
      return Math.max(MINIMO, Math.min(MAXIMO, Math.round(out)))
    }
  }
  // Acima da ultima ancora: extrapola pelo ultimo trecho, limitado pelo teto.
  const larg = ancoras[ancoras.length - 1] - ancoras[ancoras.length - 2]
  const frac = larg > 0 ? (v - ancoras[ancoras.length - 1]) / larg : 0
  const passo = DESTINO[DESTINO.length - 1] - DESTINO[DESTINO.length - 2]
  return Math.min(MAXIMO, Math.round(DESTINO[DESTINO.length - 1] + frac * passo))
}

/** O tipico, na escala exibida — igual para toda area, que e o ponto. */
export const TIPICO = 50

/**
 * A frase que acompanha o número, nos 4 idiomas.
 *
 * ⚠️ FALA DO TÍPICO DA ESCALA, que depois do remapeamento é 50 em TODA área.
 * Antes isto comparava contra uma referência diferente por área; com o valor
 * já centrado, aquela comparação diria "abaixo do normal" sobre um número que
 * acabou de ser normalizado.
 *
 * ⚠️ Vale desde a primeira abertura do app — é justamente quem nunca viu a
 * tela que mais precisa saber onde fica o meio.
 */
export function textoDoDesvio(desvio: Desvio | null, lang: string): string | null {
  if (!desvio) return null
  const i = lang.startsWith('en') ? 1 : lang.startsWith('es') ? 2 : lang.startsWith('it') ? 3 : 0
  const tl = (pt: string, en: string, es: string, it: string) => [pt, en, es, it][i]
  switch (desvio) {
    case 'bem acima':
      return tl('bem acima do normal desta área', 'well above normal for this area',
        'bastante arriba de lo normal en esta area', 'ben sopra il normale per quest\'area')
    case 'acima':
      return tl('acima do normal desta área', 'above normal for this area',
        'arriba de lo normal en esta area', 'sopra il normale per quest\'area')
    case 'abaixo':
      return tl('abaixo do normal desta área', 'below normal for this area',
        'abajo de lo normal en esta area', 'sotto il normale per quest\'area')
    case 'bem abaixo':
      return tl('bem abaixo do normal desta área', 'well below normal for this area',
        'bastante abajo de lo normal en esta area', 'ben sotto il normale per quest\'area')
    default:
      return tl('no normal desta área', 'normal for this area',
        'en lo normal de esta area', 'nel normale per quest\'area')
  }
}
