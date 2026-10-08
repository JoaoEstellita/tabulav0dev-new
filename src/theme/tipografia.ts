import type { TextStyle } from 'react-native'

/**
 * Escala tipográfica única — seis degraus, com PISO de legibilidade.
 *
 * O que foi medido no app antes disto: 1491 declarações de `fontSize`, em 41
 * valores distintos, das quais 568 (38%) em 12px ou menos — e 11px e 12px eram
 * os dois tamanhos MAIS usados de todos. Não era uma escala, era o acúmulo de
 * uma decisão por tela.
 *
 * `theme/ui.ts` já tentou resolver isso e dizia exatamente a coisa certa
 * ("importe estes em vez de repetir tamanhos soltos"). Terminou usado em dois
 * arquivos. A lição: token não pega por existir. Aqui vem junto um teste que
 * FALHA quando a quantidade de texto miúdo nas telas principais cresce
 * (`__tests__/pisoDeLegibilidade.spec.ts`) — é o que torna a escala real.
 *
 * O outro erro do `ui.ts` é que ele consagrou o problema: definiu corpo em 15,
 * subtítulo em 13, barra em 12. Aqui o CORPO começa em 15 e nunca desce de 14.
 *
 * ── Como escolher ───────────────────────────────────────────────────────────
 *  - `corpo`         texto que a pessoa LÊ (interpretação, explicação, frase)
 *  - `corpoMenor`    texto secundário que ainda é para ler — o PISO, 14px
 *  - `titulo`        título de modal, nome do planeta/signo
 *  - `secao`         cabeçalho de bloco
 *  - `rotulo`        etiqueta de campo, nome ao lado de um valor
 *  - `etiqueta`      CAPS de categoria — não é para ler, é para localizar
 *
 * Abaixo de `etiqueta` não há degrau. Se algo parece precisar de 10px, o que
 * está faltando é hierarquia por peso e cor, não letra menor: dois tamanhos com
 * pesos diferentes separam melhor que quatro tamanhos todos no mesmo peso.
 */

/** Nenhum texto destinado à LEITURA fica abaixo disto. */
export const PISO_CORPO = 14

/** Única exceção ao piso: CAPS curto de categoria, que se localiza sem ler. */
export const PISO_ETIQUETA = 11

export const T = {
  corpo: { fontSize: 16, lineHeight: 24 } as TextStyle,
  corpoMenor: { fontSize: PISO_CORPO, lineHeight: 21 } as TextStyle,
  titulo: { fontSize: 20, lineHeight: 27, fontWeight: '700' } as TextStyle,
  secao: { fontSize: 17, lineHeight: 23, fontWeight: '700' } as TextStyle,
  rotulo: { fontSize: PISO_CORPO, lineHeight: 20, fontWeight: '600' } as TextStyle,
  etiqueta: {
    fontSize: PISO_ETIQUETA,
    letterSpacing: 1.1,
    fontWeight: '700',
    textTransform: 'uppercase',
  } as TextStyle,
} as const

/**
 * Ritmo vertical em múltiplos de 8.
 *
 * Cada bloco da Home tinha o padding que calhou. Espaçamento regular faz a
 * mesma quantidade de conteúdo parecer metade do peso — é o ganho mais barato de
 * leveza que existe, porque não remove nada.
 */
export const E = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 } as const
