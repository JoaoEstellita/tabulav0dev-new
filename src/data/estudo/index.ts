import type { Unidade } from './tipos'
import { TRILHA_ATO0 } from './trilha-ato0'
import { TRILHA_ATO1 } from './trilha-ato1'
import { TRILHA_ATO2 } from './trilha-ato2'
import { TRILHA_ATO3 } from './trilha-ato3'
import { TRILHA_ATO4 } from './trilha-ato4'
import { VERBETES_PLANETAS } from './verbetes-planetas'
import { VERBETES_SIGNOS } from './verbetes-signos'
import { VERBETES_CASAS } from './verbetes-casas'
import { VERBETES_ASPECTOS } from './verbetes-aspectos'
import { ABERTURAS, ESTANTES } from './capitulos'
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
  ...ABERTURAS,
  ...TRILHA_ATO0,
  ...TRILHA_ATO1,
  ...TRILHA_ATO2,
  ...TRILHA_ATO3,
  ...TRILHA_ATO4,
  ...VERBETES_PLANETAS,
  ...VERBETES_SIGNOS,
  ...VERBETES_CASAS,
  ...VERBETES_ASPECTOS,
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

/**
 * A ORDEM DO CURSO — toda unidade sabe o que vem antes e o que vem depois.
 *
 * ⚠️ ISTO EXISTE PORQUE `verTambem` ESTAVA FAZENDO AS VEZES DE PERCURSO, e ele
 * nunca foi isso: é uma lista de RELAÇÕES. Medido antes da correção: 37 das 53
 * unidades tinham link que VOLTAVA, e **28 das 53 não tinham para onde ir**. O
 * Sol apontava para a Lua e a Lua apontava de volta para o Sol — um ciclo de
 * duas unidades do qual não se saía.
 *
 * A ordem resolve isso de uma vez: abertura e lições de cada capítulo, na
 * sequência dos atos, e depois a biblioteca por estante. Toda unidade tem
 * anterior e próxima, e nenhuma seta aponta para trás.
 *
 * ⚠️ A BIBLIOTECA GANHA ORDEM SEM DEIXAR DE SER BIBLIOTECA. Ela continua se
 * consultando por busca e por estante — a ordem só garante que quem decide
 * percorrer nunca encontre um beco. É o mesmo princípio de um dicionário, que
 * tem ordem alfabética e nem por isso se lê do A ao Z.
 */
export const ORDEM_DO_CURSO: Unidade[] = [
  // Cada capítulo abre com a sua abertura, depois as lições dele em ordem.
  ...[0, 1, 2, 3, 4].flatMap((ato) => [
    ...CATALOGO.filter((u) => u.tipo === 'abertura' && u.ato === ato),
    ...LICOES.filter((l) => l.ato === ato),
  ]),
  // A biblioteca, estante por estante, na ordem em que as estantes aparecem.
  ...ESTANTES.flatMap(({ chave }) => VERBETES.filter((v) => v.categoria === chave)),
]

const POSICAO = new Map(ORDEM_DO_CURSO.map((u, i) => [u.id, i]))

/**
 * O que vem antes e depois desta unidade, na ordem do curso.
 *
 * ⚠️ VALE PARA TODAS AS UNIDADES, lição ou verbete. Antes só a trilha tinha
 * vizinhas e a biblioteca não tinha nenhuma: abrir um planeta pelo glossário
 * deixava a pessoa sem saída a não ser fechar.
 */
export function vizinhasNaOrdem(id: string): { anterior: Unidade | null; proxima: Unidade | null } {
  const i = POSICAO.get(id)
  if (i === undefined) return { anterior: null, proxima: null }
  return {
    anterior: i > 0 ? ORDEM_DO_CURSO[i - 1] : null,
    proxima: i < ORDEM_DO_CURSO.length - 1 ? ORDEM_DO_CURSO[i + 1] : null,
  }
}

/** A posição de uma unidade na ordem do curso, ou `null` se estiver fora. */
export function posicaoNaOrdem(id: string): number | null {
  const i = POSICAO.get(id)
  return i === undefined ? null : i
}

/**
 * A PRIMEIRA UNIDADE NÃO LIDA a partir de um ponto da ordem.
 *
 * ⚠️ POR QUE O "PRÓXIMA" SOZINHO NÃO BASTA. Quem já leu até a lição 5 e
 * reabre a 2 para consultar recebe, no rodapé, a lição 3 — que já leu. Seguir
 * dali é recomeçar um trecho conhecido, e o progresso fica parado enquanto a
 * pessoa acha que está avançando.
 *
 * ⚠️ PROCURA A PARTIR DO PONTO, E DEPOIS DO COMEÇO. Se tudo adiante já foi
 * lido mas ficou um buraco atrás — alguém que pulou a lição 4 e seguiu —
 * voltar para ele é o que mantém o progresso honesto. Dar `null` com buraco
 * aberto diria "acabou" sem ter acabado.
 */
export function proximaNaoLida(lidos: string[], depoisDe?: string): Unidade | null {
  const vistos = new Set(lidos)
  const inicio = depoisDe ? (POSICAO.get(depoisDe) ?? -1) + 1 : 0
  for (let i = inicio; i < ORDEM_DO_CURSO.length; i++) {
    if (!vistos.has(ORDEM_DO_CURSO[i].id)) return ORDEM_DO_CURSO[i]
  }
  for (let i = 0; i < inicio && i < ORDEM_DO_CURSO.length; i++) {
    if (!vistos.has(ORDEM_DO_CURSO[i].id)) return ORDEM_DO_CURSO[i]
  }
  return null
}
