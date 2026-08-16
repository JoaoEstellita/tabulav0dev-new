/**
 * A regra de quem fica com o mapa, sem depender de nada.
 *
 * ── POR QUE SEPARADO DE `vincularConta.ts` ─────────────────────────────────
 *
 * Esta é a decisão que pode apagar a carta natal de alguém, e por isso precisa
 * de teste. `vincularConta.ts` importa o Firestore, o Firestore puxa o
 * react-native, e o vitest não parseia Flow — o teste morria no import antes de
 * rodar uma asserção.
 *
 * Sem I/O aqui dentro: entra objeto, sai booleano.
 */

/** Os campos que o onboarding grava e que precisam viajar juntos. */
export type PerfilPendente = {
  fullName?: string
  birthDate?: string
  birthTime?: string
  birthLocation?: unknown
  birthDataComplete?: boolean
}

/**
 * Um mapa só conta como pronto com os três: a marca, a data e o lugar.
 *
 * `birthDataComplete` sozinho não basta — ele já apareceu `true` em conta sem
 * `birthLocation`, e o cálculo de casas depende do lugar. Mesma tripla que o
 * backend confere em `claim-wa-onboarding.js`.
 */
export function temMapaCompleto(dados: PerfilPendente | null | undefined): boolean {
  if (!dados) return false
  return dados.birthDataComplete === true && !!dados.birthDate && !!dados.birthLocation
}

/**
 * Vale a pena fundir?
 *
 * Só quando a origem tem mapa e o destino não tem. Na dúvida, o antigo ganha:
 * o acidente caro é a pessoa perder a carta que já tinha por causa de um quiz
 * respondido às pressas, e mapa apagado não volta — a hora e o lugar vieram de
 * uma conversa que não se repete.
 */
export function deveFundir(
  origem: PerfilPendente | null | undefined,
  destino: PerfilPendente | null | undefined
): boolean {
  return temMapaCompleto(origem) && !temMapaCompleto(destino)
}
