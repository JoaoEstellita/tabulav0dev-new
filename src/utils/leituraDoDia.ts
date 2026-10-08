import { TRANSIT_TITLES_PTBR, buildFallbackTransitTitle } from '../data/transitTitlesPtBR'

/**
 * Peças de texto da leitura do dia.
 *
 * O problema que isto resolve: a frase era montada com uma palavra-chave solta
 * ("foco") mais `buildActionHint`, que é um template de quatro variações por
 * tipo de aspecto. Com `areaLabel` nulo ele caía no ramo mais vago de todos e
 * escrevia "Ação prática: observe sinais, registre decisões e execute um
 * próximo passo simples em área de vida" — uma frase que serve para qualquer
 * pessoa em qualquer dia, que é outra forma de dizer que não serve.
 *
 * O material específico já existia e não estava sendo usado: os títulos
 * temáticos curados (`transitTitlesPtBR`) e o texto curado do catálogo de
 * interpretações. "Inquietação e expansão no mesmo ponto" diz algo; "o dia pede
 * foco" não diz nada.
 *
 * Mora fora do componente porque o Vitest não parseia o Flow que vem com o
 * react-native — lógica dentro do `.tsx` fica sem teste.
 */

const norm = (v: string): string =>
  String(v || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')

/**
 * Título temático do trânsito ("Prova de maturidade").
 *
 * Só pt-BR: o catálogo de títulos é pt-BR por design. Nos outros idiomas quem
 * abre a frase é a primeira sentença do texto curado, que já é específica.
 */
export function temaDoTransito(
  transitPlanet: string,
  tipo: string,
  natalPlanet: string,
  language?: string | null,
): string | null {
  if ((language || 'pt-BR') !== 'pt-BR') return null
  const chave = `transit:${norm(transitPlanet)}|${norm(tipo)}|${norm(natalPlanet)}`
  return (
    TRANSIT_TITLES_PTBR[chave] ||
    buildFallbackTransitTitle(transitPlanet, natalPlanet, tipo) ||
    null
  )
}

/** Normaliza espaços sem tocar na pontuação. */
const limpar = (t: string): string => String(t || '').replace(/\s+/g, ' ').trim()

/**
 * A primeira frase de um texto.
 *
 * Usada no resumo. Corta no primeiro ponto final seguido de espaço ou fim —
 * abreviação com ponto no meio ("1,5°.") é rara nos textos do catálogo, e um
 * corte a mais custa menos que um parágrafo inteiro no lugar do resumo.
 */
export function primeiraFrase(texto: string): string {
  const t = limpar(texto)
  if (!t) return ''
  const m = t.match(/^(.+?[.!?])(\s|$)/)
  return m ? m[1].trim() : t
}

/**
 * O texto SEM a primeira frase.
 *
 * É o que o "Ler mais" mostra do trânsito principal: a abertura já foi dita no
 * resumo, e repeti-la logo abaixo faz o bloco expandido parecer que não
 * acrescenta nada. Se só houver uma frase, devolve vazio — melhor não repetir
 * do que encher.
 */
export function semAPrimeiraFrase(texto: string): string {
  const t = limpar(texto)
  const primeira = primeiraFrase(t)
  if (!primeira || primeira === t) return ''
  return t.slice(primeira.length).trim()
}

/** Junta pedaços numa frase, sem espaço duplo nem pontuação solta. */
export function costurar(...partes: Array<string | null | undefined>): string {
  return partes
    .map((p) => limpar(p || ''))
    .filter(Boolean)
    .join(' ')
    .replace(/\s+([.,;:!?])/g, '$1')
    .replace(/([.,;:!?])\1+/g, '$1')
    .trim()
}

/**
 * Lista em linguagem natural: "a, b e c".
 *
 * `e` muda por idioma; sem isso a frase sai com vírgula no lugar da conjunção,
 * que é o tipo de detalhe que faz o texto parecer gerado.
 */
export function enumerar(itens: ReadonlyArray<string>, e: string): string {
  const lista = itens.map((i) => limpar(i)).filter(Boolean)
  if (!lista.length) return ''
  if (lista.length === 1) return lista[0]
  return `${lista.slice(0, -1).join(', ')} ${e} ${lista[lista.length - 1]}`
}
