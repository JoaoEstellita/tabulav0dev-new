/**
 * A âncora tocável da leitura do dia: o SENTIDO do trânsito, não o nome dele.
 *
 * `buildArchetypeKeywordsForTransit` devolve, nesta ordem: nome do planeta em
 * trânsito, nome do aspecto, alvo, arquétipos, casa, área. Os primeiros são
 * justamente o que não serve de âncora — "Saturno" e "quadratura" não dizem a
 * ninguém o que fazer com o dia. Por isso a busca vem de trás para frente.
 *
 * Mora fora do componente porque é regra de conteúdo, não de tela — e porque
 * dentro de um `.tsx` seria intestável: o arquivo puxa `react-native`, escrito
 * em Flow, que o Vitest não parseia.
 */

const semAcento = (x: string): string =>
  String(x || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')

export function palavraDeSentido(
  keywords: string[],
  planeta: string,
  natal: string,
  tipo: string,
): string | null {
  const proibidas = new Set([planeta, natal, tipo].map(semAcento))
  for (let i = (keywords || []).length - 1; i >= 0; i--) {
    const kw = String(keywords[i] || '').trim()
    if (kw.length < 4) continue
    if (proibidas.has(semAcento(kw))) continue
    if (/^casa \d+$/i.test(kw)) continue // localização, não sentido
    if (/\s/.test(kw)) continue // âncora precisa ser uma palavra só
    return kw.toLowerCase()
  }
  return null
}
