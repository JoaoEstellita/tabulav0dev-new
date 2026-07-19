import { TRANSIT_APHORISMS_PTBR } from '../data/transitAphorismsPtBR'
import { buildCatalogTransitKey } from './astroInterpretation'

/**
 * Frase de efeito do trânsito — o provérbio que resume a energia em uma linha.
 *
 * Usa `buildCatalogTransitKey`, a MESMA função que resolve o texto curado, em vez
 * de montar a chave de novo aqui. Uma normalização paralela divergiria com o
 * tempo e o aforismo passaria a aparecer no trânsito errado — pior do que não
 * aparecer.
 *
 * ⚠️ Cobertura parcial por design: 87 das 724 chaves. Quem chama TEM que tratar
 * `null` como "não mostra nada", nunca como espaço vazio no layout. Só pt-BR —
 * os outros idiomas não têm o catálogo curado.
 */
export function resolveTransitAphorism(
  transit: unknown,
  language?: string | null,
): string | null {
  if (language && language !== 'pt-BR') return null
  const key = buildCatalogTransitKey(transit as any)
  if (!key) return null
  return TRANSIT_APHORISMS_PTBR[key] || null
}

/**
 * O aforismo do trânsito mais forte de uma lista — para o topo de uma área do
 * status, onde a frase representa o conjunto e não um item.
 *
 * Percorre em ordem e devolve o primeiro que TEM frase curada, em vez de olhar
 * só o primeiro item: com 87 de 724 chaves cobertas, parar no mais forte faria
 * a área quase sempre ficar sem frase mesmo havendo uma disponível logo abaixo.
 */
export function resolveStrongestAphorism(
  transits: unknown[] | null | undefined,
  language?: string | null,
): string | null {
  if (!Array.isArray(transits)) return null
  for (const t of transits) {
    const frase = resolveTransitAphorism(t, language)
    if (frase) return frase
  }
  return null
}
