/**
 * Os tipos do Estudo Astrológico.
 *
 * ⚠️ CONTEÚDO É DADO TIPADO, NÃO MARKDOWN. Três motivos: o React Native não
 * renderiza markdown nativamente; cada tipo de bloco precisa de tratamento
 * visual próprio (uma sincronicidade não se parece com um parágrafo); e, com
 * campos nomeados, o teste de paridade confere os 4 idiomas BLOCO A BLOCO em
 * vez de confiar num texto grande.
 *
 * Ver `docs/superpowers/specs/2026-11-02-estudo-astrologico-design.md`.
 */

/** Os 4 idiomas do app. Toda string exibida existe nos quatro. */
export type IdiomaEstudo = 'pt-BR' | 'en-US' | 'es-ES' | 'it-IT'

export type T = Record<IdiomaEstudo, string>

/**
 * O que a FASE 2 vai ler do mapa de quem está lendo.
 *
 * ⚠️ EXISTE DESDE AGORA, INERTE. Na fase 1 o renderizador pula o bloco. A
 * condição acordada foi que a personalização não exigisse reescrever o
 * conteúdo já publicado — por isso o encaixe nasce junto com a lição, e não
 * depois.
 */
export type GanchoChave =
  | 'planeta-na-casa'
  | 'planeta-no-signo'
  | 'aspecto-mais-exato'
  | 'casa-do-ano'
  | 'transito-de-hoje'

export type CategoriaVerbete = 'planeta' | 'signo' | 'casa' | 'aspecto' | 'conceito'

export type Bloco =
  | { tipo: 'paragrafo'; texto: T }
  /** A frase que o leitor deveria levar embora. Uma por unidade, no máximo. */
  | { tipo: 'destaque'; texto: T }
  /**
   * A coincidência entre a descoberta de um planeta e o que acontecia no mundo.
   *
   * ⚠️ SEPARA FATO DE LEITURA NA PRÓPRIA ESTRUTURA. `ano` e `descoberta` são
   * verificáveis; `noMundo` também; `leitura` é interpretação da tradição. O
   * texto não pode apresentar a terceira como demonstrada — é o que protege a
   * credibilidade em vez de gastá-la, e é a mesma régua da lição 3.
   */
  | { tipo: 'sincronicidade'; ano: number; descoberta: T; noMundo: T; leitura: T }
  | { tipo: 'exemplo'; texto: T }
  /** O que a astrologia NÃO afirma. Nota discreta, nunca alarme. */
  | { tipo: 'cuidado'; texto: T }
  | { tipo: 'ganchoPessoal'; chave: GanchoChave }

export interface Unidade {
  id: string
  tipo: 'licao' | 'verbete'
  /** Só lição: 0 a 4. */
  ato?: 0 | 1 | 2 | 3 | 4
  /** Só lição: a posição na trilha, 1 a 12. */
  ordem?: number
  /** Só verbete. */
  categoria?: CategoriaVerbete
  titulo: T
  /**
   * UMA frase.
   *
   * ⚠️ SERVE OS DOIS USOS: o card da trilha e o toque no glossário. Duas
   * fontes divergiriam no primeiro ajuste — é o padrão de divergência
   * silenciosa que já mordeu este projeto várias vezes.
   */
  resumo: T
  blocos: Bloco[]
  /**
   * Chaves de `GLOSSARIO` que esta unidade cobre.
   *
   * ⚠️ SÓ O VERBETE É DESTINO DO "VER A FUNDO". Numa LIÇÃO este campo serve
   * apenas à busca — se lição e verbete disputassem o mesmo termo, o popup do
   * glossário não saberia para onde mandar. O teste cobra isso.
   */
  termos: string[]
  /** Ids de outras unidades. */
  verTambem: string[]
  /** Tempo de leitura honesto — o teste confere contra o tamanho do texto. */
  minutos: number
}
