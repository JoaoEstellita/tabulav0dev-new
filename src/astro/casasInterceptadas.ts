/**
 * Casas interceptadas: um signo inteiro preso dentro de uma casa.
 *
 * Acontece quando uma casa é larga o bastante para engolir um signo sem que
 * nenhuma cúspide o toque. O signo fica "sem porta": seus temas existem no
 * mapa, mas não têm uma casa própria para se expressar — e o signo oposto fica
 * interceptado junto, do outro lado.
 *
 * Só existe em sistemas de casas desiguais (Placidus, Koch...). Em Casas
 * Inteiras cada casa é exatamente um signo e interceptação é impossível — o
 * que também explica por que isto nunca apareceu no app: todas as contas
 * estavam gravadas em whole-sign por um default errado.
 *
 * Em latitudes altas é comum; perto do equador, raro. É informação de quem
 * estuda, e vale marcar porque não se deduz olhando.
 */

const SIGNOS_PT = [
  'Áries', 'Touro', 'Gêmeos', 'Câncer', 'Leão', 'Virgem',
  'Libra', 'Escorpião', 'Sagitário', 'Capricórnio', 'Aquário', 'Peixes',
]

export interface Interceptacao {
  /** Casa 1..12. */
  casa: number
  /** Índice do signo (0 = Áries). */
  signo: number
  nomeDoSigno: string
}

const norm = (d: number): number => ((d % 360) + 360) % 360

/** O arco da casa, do começo até o próximo começo, sempre no sentido do zodíaco. */
function arcoDaCasa(cuspides: ReadonlyArray<number>, i: number): { de: number; tamanho: number } {
  const de = norm(cuspides[i])
  const ate = norm(cuspides[(i + 1) % 12])
  const tamanho = norm(ate - de)
  return { de, tamanho }
}

/**
 * Os signos interceptados, com a casa que os contém.
 *
 * Devolve vazio quando as cúspides não são 12, quando a casa não cabe um signo
 * inteiro, ou quando o sistema é de casas iguais — nunca inventa.
 */
export function casasInterceptadas(cuspides: ReadonlyArray<number> | null | undefined): Interceptacao[] {
  if (!Array.isArray(cuspides) || cuspides.length !== 12) return []
  if (!cuspides.every((c) => Number.isFinite(c))) return []

  const achados: Interceptacao[] = []

  for (let i = 0; i < 12; i++) {
    const { de, tamanho } = arcoDaCasa(cuspides, i)
    // Menos de 30° jamais contém um signo inteiro.
    if (tamanho < 30) continue

    for (let s = 0; s < 12; s++) {
      const inicioDoSigno = s * 30
      // Distância do começo da casa até o começo do signo, no sentido do zodíaco.
      const ateOInicio = norm(inicioDoSigno - de)
      // O signo inteiro cabe dentro da casa se o começo dele está depois do
      // começo da casa E o fim dele está antes do fim da casa. Estritamente:
      // tocar a cúspide significa que o signo TEM porta e não está interceptado.
      if (ateOInicio > 0 && ateOInicio + 30 < tamanho) {
        achados.push({ casa: i + 1, signo: s, nomeDoSigno: SIGNOS_PT[s] })
      }
    }
  }

  return achados
}

/** Só os índices dos signos interceptados — para pintar o anel do zodíaco. */
export function signosInterceptados(cuspides: ReadonlyArray<number> | null | undefined): Set<number> {
  return new Set(casasInterceptadas(cuspides).map((x) => x.signo))
}
