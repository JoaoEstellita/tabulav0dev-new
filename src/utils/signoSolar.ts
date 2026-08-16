import * as Astronomy from 'astronomy-engine'

/**
 * O signo solar, calculado — não tabelado.
 *
 * ── POR QUE NÃO USAR AS DATAS DE SEMPRE ────────────────────────────────────
 *
 * "Libra: 23/09 a 22/10" é o que todo site publica, e está errado com
 * frequência: o instante em que o Sol cruza 180° muda de ano para ano em até
 * um dia inteiro. Quem nasceu em 22/09/2000 é de Virgem, e em 23/09/2000 é de
 * Libra — nenhuma tabela fixa acerta os dois.
 *
 * A tese da campanha inteira é cálculo contra chute. Abrir o produto com um
 * signo tabelado contradiz isso logo no primeiro passo, e para quem nasceu na
 * virada entrega a resposta errada.
 *
 * ── A RESSALVA DA HORA ─────────────────────────────────────────────────────
 *
 * No primeiro passo do quiz só existe a DATA; a hora vem no passo seguinte. O
 * cálculo usa meio-dia UTC, que é o melhor palpite possível sem a hora. Em
 * praticamente todo nascimento isso não muda nada, porque o Sol anda ~1° por
 * dia e o signo dura 30°.
 *
 * Perto da virada, muda. Por isso `naVirada` existe: quando o Sol está a menos
 * de um grau da fronteira, a hora do nascimento pode jogar a pessoa para o
 * outro lado, e o texto tem de dizer isso em vez de afirmar. O mapa final, com
 * a hora real, é que vale.
 */

export const SIGNOS = [
  'Áries', 'Touro', 'Gêmeos', 'Câncer', 'Leão', 'Virgem',
  'Libra', 'Escorpião', 'Sagitário', 'Capricórnio', 'Aquário', 'Peixes',
] as const

export type Signo = (typeof SIGNOS)[number]

export type SignoSolar = {
  signo: Signo
  /** Grau dentro do signo, 0 a 30. */
  grau: number
  /** A menos de 1° de uma fronteira: a hora do nascimento pode mudar o signo. */
  naVirada: boolean
}

/**
 * @param dataISO `AAAA-MM-DD`
 * @returns `null` quando a data não é válida — quem chama decide o que fazer.
 */
export function signoSolarDaData(dataISO: string): SignoSolar | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dataISO)) return null

  const quando = new Date(`${dataISO}T12:00:00Z`)
  if (Number.isNaN(quando.getTime())) return null

  try {
    const vetor = Astronomy.GeoVector(Astronomy.Body.Sun, quando, true)
    const lon = ((Astronomy.Ecliptic(vetor).elon % 360) + 360) % 360

    const indice = Math.floor(lon / 30)
    const grau = lon - indice * 30

    return {
      signo: SIGNOS[indice],
      grau,
      // menos de 1° de qualquer das duas bordas
      naVirada: grau < 1 || grau > 29,
    }
  } catch {
    return null
  }
}
