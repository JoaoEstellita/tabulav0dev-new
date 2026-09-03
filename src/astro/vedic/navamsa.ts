/**
 * Navamsa (D9) — o mapa divisional mais importante depois do D1 (casamento, alma,
 * dharma, força "real" dos planetas). Cada signo (30°) tem 9 navamsas de 3°20'.
 * O signo D9 depende da modalidade do signo:
 *   móvel (Áries/Câncer/Libra/Capricórnio): começa no próprio signo
 *   fixo  (Touro/Leão/Escorpião/Aquário): começa no 9º signo
 *   dual  (Gêmeos/Virgem/Sagitário/Peixes): começa no 5º signo
 * D9 = (início + navamsaN) % 12. Recebe longitude SIDERAL (0-360). Puro.
 */
const NAV = 30 / 9 // 3.3333°

/** Índice do signo Navamsa (0-11) a partir da longitude sideral. */
export function navamsaRashi(siderealLon: number): number {
  const lon = ((Number(siderealLon) % 360) + 360) % 360
  const sign = Math.floor(lon / 30) % 12
  const navN = Math.floor((lon % 30) / NAV) // 0-8
  const mod = sign % 3 // 0=móvel, 1=fixo, 2=dual
  const start = mod === 0 ? sign : mod === 1 ? (sign + 8) % 12 : (sign + 4) % 12
  return (start + navN) % 12
}
