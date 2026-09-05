/**
 * Vargas (mapas divisionais) além do D9 — Parashari.
 * Cada varga divide o signo (30°) em N partes e mapeia para um signo-destino
 * segundo a regra do divisional. Recebem longitude SIDERAL (0-360). Puros.
 *
 *  D7  Saptamsha    — FILHOS, fertilidade, criatividade (7 partes de 4°17'8").
 *      ímpar: começa no próprio signo; par: no 7º signo (+6).
 *  D10 Dashamsha    — CARREIRA, ação no mundo, karma-yoga (10 partes de 3°).
 *      ímpar: começa no próprio signo; par: no 9º signo (+8).
 *  D12 Dwadashamsha — PAIS, ancestralidade, herança (12 partes de 2°30').
 *      sempre começa no próprio signo.
 *
 * "ímpar/par" é 1-indexado no Jyotish (Áries=1=ímpar). Em 0-index, ímpar = índice PAR.
 */

const norm = (lon: number) => ((Number(lon) % 360) + 360) % 360

/** Saptamsha (D7). Retorna rashiIndex 0-11. */
export function saptamshaRashi(siderealLon: number): number {
  const lon = norm(siderealLon)
  const sign = Math.floor(lon / 30) % 12
  const part = Math.floor((lon % 30) / (30 / 7)) // 0-6
  const oddSign = sign % 2 === 0 // 0-index par = signo ímpar (Áries/Gêmeos/…)
  const start = oddSign ? sign : (sign + 6) % 12
  return (start + part) % 12
}

/** Dashamsha (D10). Retorna rashiIndex 0-11. */
export function dashamshaRashi(siderealLon: number): number {
  const lon = norm(siderealLon)
  const sign = Math.floor(lon / 30) % 12
  const part = Math.floor((lon % 30) / 3) // 0-9
  const oddSign = sign % 2 === 0
  const start = oddSign ? sign : (sign + 8) % 12
  return (start + part) % 12
}

/** Dwadashamsha (D12). Retorna rashiIndex 0-11. */
export function dwadashamshaRashi(siderealLon: number): number {
  const lon = norm(siderealLon)
  const sign = Math.floor(lon / 30) % 12
  const part = Math.floor((lon % 30) / 2.5) // 0-11
  return (sign + part) % 12
}

export type VargaId = 'D7' | 'D10' | 'D12'

const VARGA_FN: Record<VargaId, (lon: number) => number> = {
  D7: saptamshaRashi,
  D10: dashamshaRashi,
  D12: dwadashamshaRashi,
}

export interface VargaPosition {
  name: string        // planeta ou 'Lagna'
  rashiIndex: number  // 0-11 no varga
}

export interface VargaChart {
  id: VargaId
  lagnaRashiIndex: number
  positions: VargaPosition[] // planetas no varga (com a casa relativa ao lagna do varga)
}

/**
 * Mapa divisional a partir de um conjunto de corpos com longitude sideral.
 * `bodies` = [{ name, siderealLon }] incluindo a Lagna como { name:'Lagna', siderealLon }.
 */
export function buildVargaChart(
  id: VargaId,
  bodies: Array<{ name: string; siderealLon: number }>,
): VargaChart | null {
  const fn = VARGA_FN[id]
  if (!fn || !Array.isArray(bodies) || !bodies.length) return null
  const lagna = bodies.find((b) => b.name === 'Lagna')
  const lagnaRashiIndex = lagna ? fn(lagna.siderealLon) : 0
  const positions = bodies
    .filter((b) => b.name !== 'Lagna')
    .map((b) => ({ name: b.name, rashiIndex: fn(b.siderealLon) }))
  return { id, lagnaRashiIndex, positions }
}
