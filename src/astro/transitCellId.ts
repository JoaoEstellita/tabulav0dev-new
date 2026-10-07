/**
 * Identidade de um par trânsito→natal.
 *
 * Vive fora do componente de propósito. Esta função é um CONTRATO: ela casa a
 * célula da grade com o card da lista e com os termos tocáveis da leitura do
 * dia. Se a ordem dos argumentos mudar em qualquer ponto, o toque passa a abrir
 * o trânsito errado — e nada acusa, porque o id continua bem formado e a tela
 * continua funcionando.
 *
 * Enquanto morava dentro de `AspectGrid.tsx`, testá-la obrigava a carregar o
 * componente inteiro, que puxa `react-native` (escrito em Flow, que o Vitest não
 * parseia). Resultado prático: o contrato mais fácil de quebrar era o único sem
 * teste possível.
 *
 * A ordem é sempre TRÂNSITO → tipo → NATAL. Não inverta.
 */

/** Minúsculo, sem acento, sem espaço — iguala grafias sem igualar os lados. */
export const norm = (s: string): string =>
  String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, '')

export const transitCellId = (transit: string, type: string, natal: string): string =>
  `txr-${norm(transit)}-${norm(type)}-${norm(natal)}`
