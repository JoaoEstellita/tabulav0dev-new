import type { Desvio } from '../utils/emocoesDoDia'
// A ESCALA EXIBIDA — 50 e o tipico, em toda medida que o app mostra.
//
// ⚠️ GEMEO de `backend/lib/status/escala-exibida.js`. Paridade em
// `backend/tests/escala-exibida.unit.js`.
//
// ⚠️ TRES MEDIDAS, UMA CURVA SO. Areas da vida, aneis emocionais e score do
// dia tinham o MESMO defeito, descoberto na mesma auditoria: um numero entre 0
// e 100 que parece nota, mas cujo tipico nao e 50 — e que nem sequer e o mesmo
// tipico de um item para o outro. Medido com o motor real:
//
//   SCORE DO DIA      mediana 34, maximo 73. Com as faixas antigas,
//                     89% dos dias liam "atencao" ou "desafiador" e
//                     "muito favoravel" NUNCA aconteceu — 0 em 2400 leituras.
//   AREAS DA VIDA     mediana 41, e so 24% chegavam a 50. Patamar diferente
//                     por area: Carreira 36 contra Comunicacao 45.
//   ANEIS EMOCIONAIS  medianas de 32 (Afeto) a 52 (Ansiedade) — vinte pontos
//                     de diferenca entre circulos desenhados LADO A LADO, numa
//                     roda que convida a comparar.
//
// O efeito agregado era o app dizer, para quase todo mundo e quase todo dia,
// que a vida vai mal. Isso nao e leitura astrologica: e artefato de escala.
//
// ⚠️ A TRANSFORMACAO E MONOTONICA. Nenhum dia muda de posicao em relacao a
// outro da mesma medida. Muda a regua, nao o julgamento.
//
// ⚠️ O VALOR GRAVADO CONTINUA CRU. `userStatus` guarda o numero do motor; o
// remapeamento acontece na BORDA (tela, agente, limiar de alerta). Gravar
// remapeado faria o historico de 30 dias misturar escalas no dia da virada, e
// nada acusaria.
//
// Para remedir: `node scripts/calibrar-areas.js --mapas 20 --datas 120` e
// `node scripts/calibrar-aneis.js`.

/**
 * Para onde as sete ancoras vao, sempre.
 *
 * ⚠️ 50 NO TIPICO e o ponto de tudo isto. 25 e 75 nos decis fazem "abaixo de
 * 25" significar literalmente "um dos 10% piores dias desta medida" — um
 * limiar que se explica sozinho, em vez de um corte fixo que acerta uma medida
 * e erra outra.
 */
export const DESTINO = [2, 5, 25, 50, 75, 95, 98]

/** O piso e o teto: o extremo absoluto nao deve ser alcancavel. */
export const MINIMO = 2
export const MAXIMO = 98

/** O tipico, na escala exibida — igual para tudo, que e o ponto. */
export const TIPICO = 50

/**
 * AREAS DA VIDA — [p002, p01, p10, p50, p90, p99, p998] do valor CRU.
 *
 * Medido com o motor de verdade, 20 mapas reais x 120 datas no ano (19.200
 * leituras de area).
 *
 * ⚠️ SETE PONTOS, NAO CINCO — e a correcao de um defeito que apareceu em uso.
 * Com cinco, o trecho abaixo de p01 era extrapolado pela inclinacao do trecho
 * (p01, p10), que e ingreme. Abaixo de p01 isso batia no piso quase
 * imediatamente e TUDO de cru 19 para baixo virava 2 — vinte pontos de
 * informacao esmagados num valor so, justo na faixa em que a pessoa mais quer
 * saber QUAO ruim esta.
 */
export const ANCORAS_POR_AREA: Record<string, number[]> = {
  amor: [17, 22, 28, 40, 55, 66, 72],
  carreira: [18, 20, 25, 36, 51, 66, 70],
  comunicacao: [17, 22, 31, 45, 59, 68, 71],
  espiritualidade: [22, 25, 32, 45, 59, 69, 73],
  familia: [20, 22, 28, 39, 55, 70, 75],
  financas: [20, 22, 30, 42, 57, 68, 72],
  saude: [16, 19, 29, 42, 58, 68, 72],
  transformacao: [18, 21, 27, 39, 56, 68, 72],
}
/**
 * ANEIS EMOCIONAIS — mesmas ancoras, 20.000 dias reamostrados do pool real.
 *
 * ⚠️ MEDIDO SO NAS LEITURAS COM MATERIAL. Um anel que nenhum transito toca
 * vale 0 e a roda desenha um traco; incluir esses zeros na calibracao enfiaria
 * "nada aconteceu" dentro da escala de INTENSIDADE e puxaria todas as ancoras
 * de baixo para zero. Quao comum e isso varia muito: Sensibilidade fica sem
 * material em 32% dos dias, Entusiasmo em 7%.
 *
 * ⚠️ ALTO NAO QUER DIZER BOM AQUI. Estresse 75 e "pressao bem acima do
 * tipico", nao "otimo". Por isso os aneis NAO recebem as palavras de faixa do
 * status (`bandLabel`) — eles tem leitura propria, com `EMOCAO_PESA` dizendo
 * qual lado e qual.
 */
export const ANCORAS_POR_ANEL: Record<string, number[]> = {
  afeto: [4, 4, 8, 32, 55, 69, 76],
  entusiasmo: [9, 14, 18, 44, 67, 80, 85],
  calma: [10, 10, 12, 36, 59, 75, 82],
  sensibilidade: [15, 15, 23, 33, 62, 77, 82],
  estresse: [5, 6, 17, 40, 61, 75, 80],
  desanimo: [7, 14, 21, 48, 71, 83, 87],
  ansiedade: [9, 13, 28, 52, 74, 86, 89],
  pressao: [6, 6, 12, 42, 63, 79, 85],
}
/**
 * SCORE GERAL DO DIA — 2400 leituras do motor real.
 *
 * ⚠️ ERA O PIOR DOS TRES. Mediana 34 e maximo 73: com as faixas antigas
 * (35/50/62/78), metade dos dias saia como "atencao", 39% como "desafiador" e
 * "muito favoravel" nao aconteceu nenhuma vez em 2400 leituras. Nove de cada
 * dez dias liam como ruins.
 */
export const ANCORAS_DO_DIA: number[] = [16, 18, 24, 34, 51, 63, 68]
/** ⚠️ Hermes NAO suporta regex `\p{...}` — o gemeo usa o range direto. */
export const chaveNormalizada = (x: unknown): string => String(x || '')
  .toLowerCase()
  .trim()
  .normalize('NFD')
  .replace(/[̀-ͯ]/g, '')
/**
 * Aplica a curva: interpola o valor CRU entre as ancoras ate a escala exibida.
 *
 * ⚠️ `Number(null)` E 0, E 0 PASSA EM `isFinite` — a armadilha que ja mordeu
 * este projeto cinco vezes. Aqui ela entraria como "o pior dia possivel".
 */
export function aplicar(ancoras: number[] | undefined, bruto: unknown): number | null {
  if (!Array.isArray(ancoras) || ancoras.length !== DESTINO.length) return null
  if (bruto === null || bruto === undefined || bruto === '') return null
  const v = Number(bruto)
  if (!Number.isFinite(v)) return null
  if (v <= ancoras[0]) {
    const larg = ancoras[1] - ancoras[0]
    // Ancoras coladas (cauda sem variacao medida) dariam divisao por zero.
    const frac = larg > 0 ? (v - ancoras[0]) / larg : 0
    return Math.max(MINIMO, Math.round(DESTINO[0] + frac * (DESTINO[1] - DESTINO[0])))
  }
  for (let i = 0; i < ancoras.length - 1; i++) {
    if (v <= ancoras[i + 1]) {
      const larg = ancoras[i + 1] - ancoras[i]
      const frac = larg > 0 ? (v - ancoras[i]) / larg : 0
      const out = DESTINO[i] + frac * (DESTINO[i + 1] - DESTINO[i])
      return Math.max(MINIMO, Math.min(MAXIMO, Math.round(out)))
    }
  }
  const ult = ancoras.length - 1
  const larg = ancoras[ult] - ancoras[ult - 1]
  const frac = larg > 0 ? (v - ancoras[ult]) / larg : 0
  const passo = DESTINO[ult] - DESTINO[ult - 1]
  return Math.min(MAXIMO, Math.round(DESTINO[ult] + frac * passo))
}

/** O valor exibido de uma AREA DA VIDA. `null` se nao der para converter. */
export function escalaDaArea(area: unknown, bruto: unknown): number | null {
  return aplicar(ANCORAS_POR_AREA[chaveNormalizada(area)], bruto)
}

/** O valor exibido de um ANEL EMOCIONAL. */
export function escalaDoAnel(anel: unknown, bruto: unknown): number | null {
  return aplicar(ANCORAS_POR_ANEL[chaveNormalizada(anel)], bruto)
}

/** O valor exibido do SCORE GERAL do dia. */
export function escalaDoDia(bruto: unknown): number | null {
  return aplicar(ANCORAS_DO_DIA, bruto)
}

/**
 * A frase que acompanha o número, nos 4 idiomas.
 *
 * ⚠️ FALA DO TÍPICO DA ESCALA, que depois do remapeamento é 50 em TODA área.
 * Antes isto comparava contra uma referência diferente por área; com o valor
 * já centrado, aquela comparação diria "abaixo do normal" sobre um número que
 * acabou de ser normalizado.
 *
 * ⚠️ Vale desde a primeira abertura do app — é justamente quem nunca viu a
 * tela que mais precisa saber onde fica o meio.
 */
export function textoDoDesvio(desvio: Desvio | null, lang: string): string | null {
  if (!desvio) return null
  const i = lang.startsWith('en') ? 1 : lang.startsWith('es') ? 2 : lang.startsWith('it') ? 3 : 0
  const tl = (pt: string, en: string, es: string, it: string) => [pt, en, es, it][i]
  switch (desvio) {
    case 'bem acima':
      return tl('bem acima do normal desta área', 'well above normal for this area',
        'bastante arriba de lo normal en esta area', 'ben sopra il normale per quest\'area')
    case 'acima':
      return tl('acima do normal desta área', 'above normal for this area',
        'arriba de lo normal en esta area', 'sopra il normale per quest\'area')
    case 'abaixo':
      return tl('abaixo do normal desta área', 'below normal for this area',
        'abajo de lo normal en esta area', 'sotto il normale per quest\'area')
    case 'bem abaixo':
      return tl('bem abaixo do normal desta área', 'well below normal for this area',
        'bastante abajo de lo normal en esta area', 'ben sotto il normale per quest\'area')
    default:
      return tl('no normal desta área', 'normal for this area',
        'en lo normal de esta area', 'nel normale per quest\'area')
  }
}
