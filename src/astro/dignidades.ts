/**
 * Dignidade essencial: o planeta está em casa, de visita ou em território hostil.
 *
 * É a primeira coisa que um astrólogo olha depois da posição. Vênus em Touro
 * (domicílio) age solta; Vênus em Escorpião (exílio) age torta — a mesma
 * posição, lida de dois jeitos opostos. Na roda isso não aparecia em lugar
 * nenhum.
 *
 * REGÊNCIA TRADICIONAL, para bater com o resto do app: Marte rege Escorpião,
 * Saturno rege Aquário, Júpiter rege Peixes. Já existe teste
 * (`data/__tests__/regenciaConsistente.spec.ts`) travando que a ficha do signo
 * não divirja de `DOMICILE_RULER_PT` — regente diferente em telas diferentes
 * não quebra nada, só mente para quem repara.
 *
 * Os transpessoais (Urano, Netuno, Plutão) NÃO entram: na tradição eles não
 * têm domicílio, e atribuir um é escolher um lado de uma discussão que o app
 * não precisa ter.
 */

export type Dignidade = 'domicilio' | 'exaltacao' | 'exilio' | 'queda'

/** Índice do signo, 0 = Áries. */
export type IndiceSigno = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11

const ARIES = 0, TOURO = 1, GEMEOS = 2, CANCER = 3, LEAO = 4, VIRGEM = 5
const LIBRA = 6, ESCORPIAO = 7, SAGITARIO = 8, CAPRICORNIO = 9, AQUARIO = 10, PEIXES = 11

/** Onde cada planeta rege (tradicional). */
const DOMICILIO: Record<string, number[]> = {
  Sun: [LEAO],
  Moon: [CANCER],
  Mercury: [GEMEOS, VIRGEM],
  Venus: [TOURO, LIBRA],
  Mars: [ARIES, ESCORPIAO],
  Jupiter: [SAGITARIO, PEIXES],
  Saturn: [CAPRICORNIO, AQUARIO],
}

/** Onde cada planeta se exalta. */
const EXALTACAO: Record<string, number> = {
  Sun: ARIES,
  Moon: TOURO,
  Mercury: VIRGEM,
  Venus: PEIXES,
  Mars: CAPRICORNIO,
  Jupiter: CANCER,
  Saturn: LIBRA,
}

/** O signo oposto — exílio é o oposto do domicílio, queda o oposto da exaltação. */
const oposto = (s: number): number => (s + 6) % 12

/**
 * A dignidade do planeta no signo, ou null quando não há nenhuma.
 *
 * A maioria das posições não tem dignidade — é o caso comum, e devolver null
 * é o que impede a roda de marcar tudo e não marcar nada.
 */
export function dignidadeDe(planeta: string, signo: number): Dignidade | null {
  const nome = String(planeta || '')
  const s = ((Math.trunc(signo) % 12) + 12) % 12

  const casa = DOMICILIO[nome]
  if (casa?.includes(s)) return 'domicilio'
  if (casa?.some((d) => oposto(d) === s)) return 'exilio'

  const alto = EXALTACAO[nome]
  if (alto === s) return 'exaltacao'
  if (alto !== undefined && oposto(alto) === s) return 'queda'

  return null
}

/** Dignidade a partir da longitude, que é como o dado chega da roda. */
export function dignidadePorLongitude(planeta: string, longitude: number): Dignidade | null {
  if (!Number.isFinite(longitude)) return null
  const s = Math.floor((((longitude % 360) + 360) % 360) / 30)
  return dignidadeDe(planeta, s)
}

/** Força: positiva quando o planeta age bem, negativa quando trabalha contra. */
export function sinalDaDignidade(d: Dignidade | null): 1 | -1 | 0 {
  if (d === 'domicilio' || d === 'exaltacao') return 1
  if (d === 'exilio' || d === 'queda') return -1
  return 0
}

type Idioma = 'pt-BR' | 'en-US' | 'es-ES' | 'it-IT'

const ROTULOS: Record<Dignidade, Record<Idioma, string>> = {
  domicilio: { 'pt-BR': 'domicílio', 'en-US': 'domicile', 'es-ES': 'domicilio', 'it-IT': 'domicilio' },
  exaltacao: { 'pt-BR': 'exaltação', 'en-US': 'exaltation', 'es-ES': 'exaltacion', 'it-IT': 'esaltazione' },
  exilio: { 'pt-BR': 'exílio', 'en-US': 'detriment', 'es-ES': 'exilio', 'it-IT': 'esilio' },
  queda: { 'pt-BR': 'queda', 'en-US': 'fall', 'es-ES': 'caida', 'it-IT': 'caduta' },
}

/** Uma frase curta dizendo o que a dignidade significa na prática. */
const EXPLICACAO: Record<Dignidade, Record<Idioma, string>> = {
  domicilio: {
    'pt-BR': 'está em casa: age com naturalidade, sem precisar forçar.',
    'en-US': 'is at home: it acts naturally, without forcing.',
    'es-ES': 'esta en casa: actua con naturalidad, sin forzar.',
    'it-IT': 'e a casa: agisce con naturalezza, senza forzare.',
  },
  exaltacao: {
    'pt-BR': 'está exaltado: age com força extra, às vezes demais.',
    'en-US': 'is exalted: it acts with extra force, sometimes too much.',
    'es-ES': 'esta exaltado: actua con fuerza extra, a veces de mas.',
    'it-IT': 'e esaltato: agisce con forza extra, a volte troppa.',
  },
  exilio: {
    'pt-BR': 'está em exílio: precisa de rodeio para fazer o que faria direto.',
    'en-US': 'is in detriment: it needs a detour to do what it would do directly.',
    'es-ES': 'esta en exilio: necesita rodeo para hacer lo que haria directo.',
    'it-IT': 'e in esilio: ha bisogno di giri per fare cio che farebbe diretto.',
  },
  queda: {
    'pt-BR': 'está em queda: age com menos confiança do que teria em outro signo.',
    'en-US': 'is in fall: it acts with less confidence than it would elsewhere.',
    'es-ES': 'esta en caida: actua con menos confianza que en otro signo.',
    'it-IT': 'e in caduta: agisce con meno fiducia che in altro segno.',
  },
}

export const rotuloDaDignidade = (d: Dignidade, idioma: Idioma = 'pt-BR'): string =>
  ROTULOS[d][idioma] || ROTULOS[d]['pt-BR']

export const explicarDignidade = (d: Dignidade, idioma: Idioma = 'pt-BR'): string =>
  EXPLICACAO[d][idioma] || EXPLICACAO[d]['pt-BR']
