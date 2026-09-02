/**
 * Sistema de LENTES — fonte única de cor, rótulo e faixa de afinidade dos 4 sistemas
 * (Astro/Ocidental · Tzolkin · Védico · Chinês). Todas as telas (deck, modal, abas,
 * match views, grupos) importam daqui → coesão garantida, fim da divergência de cor/termo.
 */
export type LensKey = 'astro' | 'tzolkin' | 'vedic' | 'chinese'
export type Lang = 'pt-BR' | 'en-US' | 'es-ES' | 'it-IT' | string

interface LensDef { color: string; soft: string; border: string; label: [string, string, string, string] }

// Cor canônica por lente. Védico = ÍNDIGO (distinto do roxo do Tzolkin).
export const LENS: Record<LensKey, LensDef> = {
  astro: { color: '#f5c542', soft: 'rgba(245,197,66,0.16)', border: 'rgba(245,197,66,0.55)', label: ['Astro', 'Astro', 'Astro', 'Astro'] },
  tzolkin: { color: '#8b7cf6', soft: 'rgba(139,124,246,0.16)', border: 'rgba(139,124,246,0.55)', label: ['Tzolkin', 'Tzolkin', 'Tzolkin', 'Tzolkin'] },
  vedic: { color: '#6c8cff', soft: 'rgba(108,140,255,0.16)', border: 'rgba(108,140,255,0.55)', label: ['Védico', 'Vedic', 'Vedico', 'Vedico'] },
  chinese: { color: '#e4572e', soft: 'rgba(228,87,46,0.16)', border: 'rgba(228,87,46,0.55)', label: ['Chinês', 'Chinese', 'Chino', 'Cinese'] },
}

const langIdx = (l: Lang) => (l === 'en-US' ? 1 : l === 'es-ES' ? 2 : l === 'it-IT' ? 3 : 0)
export const lensColor = (k: LensKey) => LENS[k].color
export const lensLabel = (k: LensKey, lang: Lang) => LENS[k].label[langIdx(lang)]

// ── Afinidade: UMA palavra, UMA escala de faixas (5), em todas as telas ──────────
export type AffinityBand = 'altissima' | 'alta' | 'boa' | 'moderada' | 'baixa'
export function affinityBand(pct: number): AffinityBand {
  if (pct >= 80) return 'altissima'
  if (pct >= 65) return 'alta'
  if (pct >= 50) return 'boa'
  if (pct >= 35) return 'moderada'
  return 'baixa'
}
const BAND_LABEL: Record<AffinityBand, [string, string, string, string]> = {
  altissima: ['Afinidade altíssima', 'Very high affinity', 'Afinidad altisima', 'Affinita altissima'],
  alta: ['Alta afinidade', 'High affinity', 'Alta afinidad', 'Alta affinita'],
  boa: ['Boa afinidade', 'Good affinity', 'Buena afinidad', 'Buona affinita'],
  moderada: ['Afinidade moderada', 'Moderate affinity', 'Afinidad moderada', 'Affinita moderata'],
  baixa: ['Afinidade baixa', 'Low affinity', 'Afinidad baja', 'Affinita bassa'],
}
export const affinityLabel = (band: AffinityBand, lang: Lang) => BAND_LABEL[band][langIdx(lang)]
/** "Afinidade" — a palavra canônica pro conceito de score entre pessoas. */
export const affinityWord = (lang: Lang) => (['Afinidade', 'Affinity', 'Afinidad', 'Affinita'][langIdx(lang)])
/** Cor da afinidade por faixa (verde→âmbar→vermelho). */
export function affinityColor(pct: number): string {
  if (pct >= 65) return '#3ecf8e'
  if (pct >= 50) return '#d0a95c'
  if (pct >= 35) return '#e0a03a'
  return '#e4572e'
}
