import { desvioDaReferencia, type Desvio } from '../utils/emocoesDoDia'

/**
 * O "NORMAL" DE CADA ÁREA DA VIDA — e por que ele precisa existir.
 *
 * ⚠️ O NÚMERO DA ÁREA NÃO É UMA NOTA DE 0 A 100. Medido com o motor de
 * verdade, 20 mapas reais × 60 datas espalhadas pelo ano (1200 leituras):
 *
 *   mediana geral 41 — e só 24% das leituras chegam a 50.
 *
 * Três de cada quatro leituras ficam abaixo do meio. Como a tela mostra um
 * número solto que parece nota, o app diz para quase todo mundo, quase todo
 * dia, que a vida está abaixo da média. Isso não é leitura astrológica: é
 * artefato de escala.
 *
 * ⚠️ E AS ÁREAS NÃO ESTÃO NA MESMA ESCALA ENTRE SI. Carreira tem mediana 36;
 * Comunicação e Espiritualidade, 45. Nove pontos de desvio sistemático,
 * sustentados ao longo do ano inteiro — não é o céu de um dia. A roda põe as
 * oito lado a lado e convida a comparar, então "Carreira 36 · Comunicação 45"
 * aparenta uma diferença de nove pontos que, de fato, é ZERO: as duas estão
 * exatamente no normal delas.
 *
 * ⚠️ POR QUE MEDIR COM O MOTOR E NÃO COM OS DOCUMENTOS SALVOS. A primeira
 * medição usou 60 `userStatus` reais e deu Comunicação 50. Reamostrando o ano
 * inteiro, Comunicação é 45 — os 5 pontos de diferença eram o céu daqueles
 * dias. Congelar a primeira teria enfiado o ruído de uma semana numa constante
 * para sempre, que é exatamente o erro que a calibração dos anéis existiu para
 * evitar. Ver `backend/scripts/calibrar-areas.js`.
 *
 * ⚠️ ISTO NÃO MUDA NENHUM NÚMERO. A referência não recalibra a escala: ela dá
 * ao número um ponto de comparação, para "Carreira 36" poder ser lido como "no
 * seu normal" em vez de como fracasso. Recentrar a escala mexeria também nos
 * limiares de alerta, e é outra decisão.
 */
export const REFERENCIA_POR_AREA: Record<string, number> = {
  amor: 40,
  carreira: 36,
  comunicacao: 45,
  espiritualidade: 45,
  familia: 39,
  financas: 42,
  saude: 42,
  transformacao: 39,
}

/** Normaliza a chave da área: o app usa acento em alguns lugares. */
function chaveDaArea(area: unknown): string {
  return String(area || '')
    .toLowerCase()
    .trim()
    // ⚠️ Hermes NÃO suporta regex `\p{...}` — usar o range direto.
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
}

/**
 * Como este valor se compara ao normal daquela área.
 *
 * ⚠️ USA A MESMA MÁQUINA DOS ANÉIS (`desvioDaReferencia`), de propósito: a
 * margem, os cinco degraus e as palavras já existem e já foram calibrados.
 * Uma segunda régua diria "acima" a partir de um ponto diferente, e as duas
 * telas usariam a mesma palavra para coisas distintas.
 */
export function desvioDaArea(area: unknown, valor: unknown): Desvio | null {
  const ref = REFERENCIA_POR_AREA[chaveDaArea(area)]
  if (ref == null) return null
  return desvioDaReferencia(valor, ref)
}

/** A referência crua, para quem quer mostrar o número ao lado. */
export function referenciaDaArea(area: unknown): number | null {
  const ref = REFERENCIA_POR_AREA[chaveDaArea(area)]
  return typeof ref === 'number' ? ref : null
}

/**
 * A frase que acompanha o número, nos 4 idiomas.
 *
 * ⚠️ FALA DO NORMAL DA ÁREA, não do normal da pessoa. O histórico pessoal é
 * outra coisa (e exige dias guardados); isto aqui vale desde a primeira
 * abertura, e é justamente quem nunca viu o app que mais precisa saber que 36
 * em Carreira não é um aviso.
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
