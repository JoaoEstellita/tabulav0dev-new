/**
 * Geometria dos anéis da roda.
 *
 * Estava tudo em números soltos dentro do componente, e por isso ninguém
 * percebeu que a conta não fechava: na bi-roda (`escala` 0,80) a faixa onde os
 * planetas natais podem se afastar radialmente era de **17px**, com um passo de
 * empilhamento de 23px. Não cabia nem um nível. Três planetas próximos batiam
 * no limite, o clamp juntava todos no mesmo raio e eles se sobrepunham — foi o
 * que apareceu na tela.
 *
 * Aqui os raios viram função testável, e o teste confere o que o olho não
 * confere: que a faixa comporta um aglomerado real e que nada vaza para fora do
 * quadro.
 *
 * ── Como o espaço é dividido (fração do lado do quadro) ────────────────────
 * De fora para dentro: anel do zodíaco, anel das casas, anel dos planetas
 * natais e o miolo dos aspectos. O anel de trânsito fica FORA de tudo e não
 * leva escala — por isso o natal encolhe quando a bi-roda está ligada, para
 * abrir espaço sem estourar o quadro.
 */

export interface RaiosDaRoda {
  outer: number
  zodiacIn: number
  houseOut: number
  houseIn: number
  planet: number
  inner: number
  transit: number
  discNatal: number
  discTransit: number
  stepNatal: number
  /** Limite interno e externo em que um glifo natal pode ser empilhado. */
  faixaNatal: { min: number; max: number }
}

/**
 * Frações do lado do quadro.
 *
 * Os valores foram reequilibrados para alargar a faixa dos planetas: o miolo
 * cedeu um pouco e as casas começam mais para fora. O anel de planetas é o
 * único que precisa de ESPAÇO VARIÁVEL (os outros são faixas fixas), então é
 * ele que recebe a folga.
 */
export const FRACAO = {
  outer: 0.47,
  // Anel do zodiaco com 0,07 de largura: o simbolo do signo e desenhado em
  // 0,055 do lado, entao faixa menor que isso corta o glifo.
  zodiacIn: 0.40,
  houseOut: 0.385,
  // Anel das casas com 0,07: o numero da casa usa 0,036 do lado e precisa de
  // folga em volta para nao encostar nas duas bordas.
  houseIn: 0.32,
  planet: 0.205,
  inner: 0.09,
  /** O anel de trânsito NÃO leva escala: vive na borda do quadro. */
  transit: 0.45,
  discNatalBiRoda: 0.029,
  discNatalSozinho: 0.034,
  discTransit: 0.028,
  /**
   * Espaçamento radial entre glifos empilhados, em múltiplos do raio do disco.
   *
   * 1,85 deixa os discos levemente encostados. Parece pouco, mas e o que faz
   * um aglomerado de tres caber em TODO tamanho de tela — com 1,95 a conta
   * fechava em 320 e 380 e falhava em 400, por causa do arredondamento do
   * disco para pixel inteiro. E quando nao cabe, o clamp junta o grupo todo
   * no mesmo raio: a sobreposicao total, que e justamente o que isto evita.
   * Discos encostados sao muito melhores que discos empilhados.
   */
  passo: 1.85,
} as const

/** Margem entre o desenho e a borda do quadro, em fração do lado. */
export const MARGEM_DO_QUADRO = 0.485

export function calcularRaios(svgSize: number, comTransitos: boolean): RaiosDaRoda {
  const px = (v: number) => Math.round(v)
  const escala = comTransitos ? 0.8 : 1

  const inner = px(svgSize * FRACAO.inner * escala)
  const houseIn = px(svgSize * FRACAO.houseIn * escala)
  const discNatal = px(svgSize * (comTransitos ? FRACAO.discNatalBiRoda : FRACAO.discNatalSozinho))
  const discTransit = px(svgSize * FRACAO.discTransit)

  return {
    outer: px(svgSize * FRACAO.outer * escala),
    zodiacIn: px(svgSize * FRACAO.zodiacIn * escala),
    houseOut: px(svgSize * FRACAO.houseOut * escala),
    houseIn,
    planet: px(svgSize * FRACAO.planet * escala),
    inner,
    transit: px(svgSize * FRACAO.transit),
    discNatal,
    discTransit,
    stepNatal: discNatal * FRACAO.passo,
    // +2 / -1: o glifo não pode encostar no miolo nem invadir o anel das casas.
    faixaNatal: { min: inner + discNatal + 2, max: houseIn - discNatal - 1 },
  }
}

/**
 * Quantos glifos de um aglomerado cabem empilhados sem o clamp juntá-los.
 *
 * É a medida que faltava. Um aglomerado de `n` ocupa `(n-1) * passo`, centrado
 * no raio padrão; se isso não couber na faixa, os das pontas são clampados para
 * o mesmo raio e voltam a se sobrepor.
 */
export function glifosQueCabem(r: RaiosDaRoda): number {
  const largura = r.faixaNatal.max - r.faixaNatal.min
  if (largura <= 0 || r.stepNatal <= 0) return 1
  return Math.floor(largura / r.stepNatal) + 1
}
