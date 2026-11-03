import type { Unidade } from './tipos'
import { TRILHA_ATO0 } from './trilha-ato0'
import { VERBETES_PLANETAS } from './verbetes-planetas'
import { VERBETES_CONCEITOS } from './verbetes-conceitos'

export * from './tipos'

/**
 * O CATÁLOGO INTEIRO — lições e verbetes juntos.
 *
 * ⚠️ A ORDEM DESTE ARRAY NÃO É A ORDEM DA TELA. A trilha ordena por `ordem` e
 * a biblioteca agrupa por categoria; juntar tudo aqui serve à busca e à
 * validação de integridade, que precisam ver o conjunto completo.
 */
export const CATALOGO: Unidade[] = [
  ...TRILHA_ATO0,
  ...VERBETES_PLANETAS,
  ...VERBETES_CONCEITOS,
]

/** As lições da trilha, já na ordem de leitura. */
export const LICOES: Unidade[] = CATALOGO
  .filter((u) => u.tipo === 'licao')
  .sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0))

/** Os verbetes da biblioteca. */
export const VERBETES: Unidade[] = CATALOGO.filter((u) => u.tipo === 'verbete')

const PORID = new Map(CATALOGO.map((u) => [u.id, u]))

/** A unidade de um id, ou `null`. Nunca lança — id morto não derruba tela. */
export function porId(id: string): Unidade | null {
  return PORID.get(id) ?? null
}

/**
 * O verbete que é destino do "ver a fundo" de um termo do glossário.
 *
 * ⚠️ SÓ VERBETE. A lição declara termos para a busca, mas o aprofundamento de
 * um termo é sempre um verbete — ver o comentário em `Unidade.termos`.
 */
export function verbeteDoTermo(termo: string): Unidade | null {
  return VERBETES.find((v) => v.termos.includes(termo)) ?? null
}
