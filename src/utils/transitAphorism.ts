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
