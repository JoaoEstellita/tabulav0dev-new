/**
 * O aspecto ainda vai exatar, ou já passou?
 *
 * Aplicativo = os planetas ainda estão se aproximando do ângulo exato; o
 * assunto está chegando. Separativo = já passaram; é resíduo. É a diferença
 * entre "vai acontecer" e "aconteceu", e a roda não mostrava nenhuma das duas:
 * todas as linhas eram iguais.
 *
 * Para TRÂNSITO dá para ler da janela (`window.exact`). Para aspecto NATAL não
 * existe janela — o mapa é um instante — e a resposta vem da VELOCIDADE dos
 * dois corpos no momento do nascimento, que o motor já entrega em `speed`.
 *
 * Velocidade negativa é retrógrado, e isso inverte o sentido: um planeta
 * retrógrado pode transformar um aspecto que estava chegando em um que se
 * afasta. Tratar retrógrado como se andasse para a frente erraria exatamente
 * os casos mais interessantes.
 */

export type Movimento = 'aplicativo' | 'separativo' | 'estacionario'

/** Diferença angular com sinal, em (-180, 180]. */
function diferencaComSinal(a: number, b: number): number {
  const d = (((b - a) % 360) + 360) % 360
  return d > 180 ? d - 360 : d
}

/**
 * Quanto falta (ou sobrou) para o ângulo exato, com sinal.
 *
 * Zero é o aspecto perfeito. O sinal diz de que lado da exatidão os planetas
 * estão, e é o que permite saber se a velocidade aproxima ou afasta.
 */
export function orbeComSinal(lon1: number, lon2: number, anguloDoAspecto: number): number {
  const sep = diferencaComSinal(lon1, lon2)
  const alvo = Math.abs(anguloDoAspecto)
  // O aspecto vale dos dois lados (90° e -90° são a mesma quadratura): fica
  // com o lado mais perto, que é onde o aspecto de fato está se formando.
  const porCima = sep - alvo
  const porBaixo = sep + alvo
  return Math.abs(porCima) <= Math.abs(porBaixo) ? porCima : porBaixo
}

/**
 * Se o aspecto está se formando ou se desfazendo.
 *
 * `velocidade1`/`velocidade2` em graus por dia, negativas quando retrógrado.
 * Sem velocidade confiável devolve 'estacionario' em vez de chutar — uma linha
 * desenhada como "chegando" quando na verdade passou é informação errada.
 */
export function movimentoDoAspecto(
  lon1: number,
  lon2: number,
  anguloDoAspecto: number,
  velocidade1: number | undefined | null,
  velocidade2: number | undefined | null,
): Movimento {
  if (!Number.isFinite(lon1) || !Number.isFinite(lon2)) return 'estacionario'
  // null e undefined ANTES de Number(): `Number(null)` e 0, que passa no
  // isFinite e viraria "parado" — mas velocidade ausente e desconhecida, nao
  // zero. A diferenca importa: zero diz que o aspecto nao se move, desconhecido
  // diz que nao da para saber.
  if (velocidade1 == null || velocidade2 == null) return 'estacionario'
  const v1 = Number(velocidade1)
  const v2 = Number(velocidade2)
  if (!Number.isFinite(v1) || !Number.isFinite(v2)) return 'estacionario'

  const orbe = orbeComSinal(lon1, lon2, anguloDoAspecto)
  // Como o orbe muda com o tempo: a separação cresce à taxa (v2 - v1).
  const taxa = v2 - v1

  // Praticamente parado: nem aproxima nem afasta de forma perceptível.
  if (Math.abs(taxa) < 1e-6) return 'estacionario'
  // Orbe caminhando para zero = aplicativo. Sinais opostos significam que a
  // variação está puxando o orbe na direção da exatidão.
  return orbe * taxa < 0 ? 'aplicativo' : 'separativo'
}

/** Ângulo de cada aspecto, pelo nome em português (como o motor emite). */
const ANGULO: Record<string, number> = {
  conjuncao: 0,
  semisextil: 30,
  semiquadratura: 45,
  sextil: 60,
  quadratura: 90,
  trigono: 120,
  sesquiquadratura: 135,
  quincuncio: 150,
  oposicao: 180,
}

const ALIAS: Record<string, string> = {
  conjunction: 'conjuncao',
  sextile: 'sextil',
  square: 'quadratura',
  trine: 'trigono',
  opposition: 'oposicao',
  quincunx: 'quincuncio',
  semisextile: 'semisextil',
  semisquare: 'semiquadratura',
  sesquisquare: 'sesquiquadratura',
}

/** Grau do aspecto a partir do nome, aceitando acento, caixa e inglês. */
export function anguloDoAspecto(tipo: string): number | null {
  const k = String(tipo || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z]/g, '')
  const chave = ALIAS[k] || k
  return chave in ANGULO ? ANGULO[chave] : null
}

/** Conveniência: recebe o aspecto pelo nome e os dois corpos. */
export function movimentoPorNome(
  tipo: string,
  corpo1: { longitude?: number; speed?: number } | null | undefined,
  corpo2: { longitude?: number; speed?: number } | null | undefined,
): Movimento {
  const alvo = anguloDoAspecto(tipo)
  if (alvo == null || !corpo1 || !corpo2) return 'estacionario'
  return movimentoDoAspecto(
    Number(corpo1.longitude),
    Number(corpo2.longitude),
    alvo,
    corpo1.speed,
    corpo2.speed,
  )
}
