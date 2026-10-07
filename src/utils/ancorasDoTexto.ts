/**
 * Transforma palavras do texto em âncoras tocáveis.
 *
 * A frase do dia é escrita em português comum, e cada trânsito tem um punhado de
 * palavras-chave de arquétipo ("firmeza", "revisão", "abertura"). Quando uma
 * dessas palavras aparece no texto, ela deixa de ser só palavra: tocando nela, a
 * pessoa abre a interpretação do trânsito de onde aquele sentido saiu.
 *
 * Isso é o contrário de nomear o aspecto. Quem não estuda astrologia não procura
 * "Saturno quadratura Sol" — procura o que fazer com o dia. A palavra prática é a
 * porta; o nome técnico fica do outro lado dela, disponível e nunca imposto.
 *
 * Mora fora do componente de propósito: o Vitest não parseia o Flow que vem com
 * o react-native, então qualquer lógica dentro do `.tsx` fica sem teste. Já
 * custou três repetições do mesmo erro no projeto.
 */

export type Pedaco = {
  texto: string
  /** Quando presente, o pedaço é tocável e abre este trânsito. */
  id?: string
}

/** Minúsculas, sem acento. `\p{...}` não existe no Hermes — faixa manual. */
export const semAcento = (s: string): string =>
  String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim()

/** Palavra curta demais não vira âncora: "dia", "sol" e "um" viram ruído. */
const MIN_LETRAS = 4

export interface EntradaDeIndice {
  /** Id do trânsito a abrir (ex.: `txr-saturn-quadratura-sun`). */
  id: string
  /** Palavras-chave do arquétipo daquele trânsito. */
  keywords?: ReadonlyArray<string> | null
}

/**
 * Índice palavra → trânsito.
 *
 * A ordem das entradas importa: a primeira que reivindica uma palavra fica com
 * ela. Passe os trânsitos do mais forte para o mais fraco, para a palavra cair
 * no trânsito que mais pesa hoje em vez de num secundário qualquer.
 */
export function indiceDePalavras(
  entradas: ReadonlyArray<EntradaDeIndice>,
  proibidas: ReadonlyArray<string> = [],
): Map<string, string> {
  const bloqueadas = new Set(proibidas.map(semAcento).filter(Boolean))
  const indice = new Map<string, string>()

  for (const entrada of entradas || []) {
    if (!entrada?.id) continue
    for (const bruta of entrada.keywords || []) {
      const kw = semAcento(bruta)
      if (kw.length < MIN_LETRAS) continue
      // Só palavra única: expressão com espaço raramente aparece literal no
      // texto, e quando aparece o recorte fica torto.
      if (/\s/.test(kw)) continue
      // "casa 7" e afins são referência técnica, não palavra de sentido.
      if (/\d/.test(kw)) continue
      if (bloqueadas.has(kw)) continue
      if (!indice.has(kw)) indice.set(kw, entrada.id)
    }
  }

  return indice
}

const escaparRegex = (s: string): string => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/**
 * Quebra o texto marcando as palavras que estão no índice.
 *
 * `jaUsadas` é compartilhado entre chamadas e MUTADO: a mesma palavra sublinhada
 * cinco vezes no parágrafo vira sopa de links e cansa mais do que ajuda. Passe o
 * mesmo Set para todos os blocos da frase.
 */
export function fatiarComAncoras(
  texto: string,
  indice: Map<string, string>,
  jaUsadas: Set<string> = new Set(),
): Pedaco[] {
  const bruto = String(texto || '')
  if (!bruto || !indice.size) return bruto ? [{ texto: bruto }] : []

  // Do mais longo para o mais curto, para "revisão" ganhar de "visão".
  const alvos = [...indice.keys()]
    .filter((k) => !jaUsadas.has(k))
    .sort((a, b) => b.length - a.length)
  if (!alvos.length) return [{ texto: bruto }]

  // Casa sobre o texto SEM acento para "revisao" achar "revisão", mas recorta
  // sempre do original: normalizar o que é exibido estragaria a ortografia.
  // NFD decompõe o acento em caractere próprio e desalinharia os índices, então
  // a versão de busca remove só o acento, preservando um-para-um as letras.
  const semAcentoMesmoTamanho = bruto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')

  // Só vale quando a remoção não mudou o comprimento (sem ligaduras exóticas).
  const busca = semAcentoMesmoTamanho.length === bruto.length ? semAcentoMesmoTamanho : bruto.toLowerCase()

  const padrao = new RegExp(
    `(^|[^\\wÀ-ÿ])(${alvos.map(escaparRegex).join('|')})(?=$|[^\\wÀ-ÿ])`,
    'g',
  )

  const saida: Pedaco[] = []
  let ultimo = 0

  for (const m of busca.matchAll(padrao)) {
    const inicio = (m.index ?? 0) + m[1].length
    const palavra = m[2]
    if (jaUsadas.has(palavra)) continue
    const id = indice.get(palavra)
    if (!id) continue
    jaUsadas.add(palavra)

    if (inicio > ultimo) saida.push({ texto: bruto.slice(ultimo, inicio) })
    saida.push({ texto: bruto.slice(inicio, inicio + palavra.length), id })
    ultimo = inicio + palavra.length
  }

  if (ultimo < bruto.length) saida.push({ texto: bruto.slice(ultimo) })
  return saida.length ? saida : [{ texto: bruto }]
}
