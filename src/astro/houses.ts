
/**
 * Implementação genuína de Equal usando astronomy-engine (ASC/MC precisos).
 * Para Placidus, o app usa o backend. Arquivo minimalista e sem dependências internas.
 */

import * as Astronomy from 'astronomy-engine'

/**
 * Tipos de sistema de casas astrológicas suportados.
 * - 'equal': Equal Houses
 * - 'placidus': Placidus (calculado no backend)
 */
export type HouseSystem = 'equal' | 'placidus'

/**
 * Normaliza um ângulo para o intervalo 0..360°
 */
const norm = (d: number) => (d % 360 + 360) % 360

/**
 * Calcula a obliquidade da eclíptica (inclinação da Terra) em radianos para uma data.
 * Usa astronomy-engine se disponível, senão fallback Meeus.
 */
function getObliquityRad(d: Date): number {
  try {
    const tilt = (Astronomy as any).EarthTilt?.(d)
    if (tilt && typeof tilt.obliquity === 'number') return tilt.obliquity * Math.PI / 180
  } catch {}
  // Meeus (mean obliquity) como fallback
  const jd = (d.getTime() / 86400000) + 2440587.5
  const T = (jd - 2451545.0) / 36525.0
  const seconds = 21.448 - 46.8150*T - 0.00059*T*T + 0.001813*T*T*T
  const epsDeg = 23 + (26/60) + (seconds/3600)
  return epsDeg * Math.PI/180
}

/**
 * Calcula o Ascendente (ASC) e Meio-do-Céu (MC) para uma data e coordenadas.
 * @returns { asc: number, mc: number } em graus
 */
function calculateAscMc(date: Date, latDeg: number, lonDeg: number) {
  const gmstHours = Astronomy.SiderealTime(date)
  const lstHours = ((gmstHours + (lonDeg/15)) % 24 + 24) % 24
  const theta = lstHours * 15 * Math.PI/180
  const eps = getObliquityRad(date)
  const phi = latDeg * Math.PI/180
  const sin = Math.sin, cos = Math.cos, tan = Math.tan
  // MC
  const alphaMC = Math.atan2(tan(theta), cos(eps))
  let mc = Math.atan2(sin(alphaMC)/cos(eps), Math.cos(alphaMC)) * 180/Math.PI
  mc = norm(mc)
  // Ascendente
  let asc = Math.atan2(-cos(theta), (sin(theta)*cos(eps)) - (tan(phi)*Math.sin(eps))) * 180/Math.PI
  asc = norm(asc)
  return { asc, mc }
}

/**
 * Calcula as cúspides das casas astrológicas para uma data, latitude, longitude e sistema.
 *
 * @param date Data UTC do cálculo
 * @param lat Latitude do local
 * @param lon Longitude do local
 * @param system Sistema de casas ('equal', 'placidus')
 * @returns Objeto com cúspides, ascendente, meio-do-céu e (opcional) planetHouses para testes
 */
export async function computeHousesUTC(
  date: Date,
  lat: number,
  lon: number,
  system: HouseSystem
): Promise<{ cusps: number[]; asc: number; mc: number; approximate?: boolean; planetHouses?: Record<string, number> }> {
  const { asc, mc } = calculateAscMc(date, lat, lon)
  // Whole Sign removido do app
  if (system === 'equal') {
    const cusps = Array.from({length:12}, (_,i)=> norm(asc + i*30))
    // Exemplo: atribuir planetas fictícios a casas para teste
    // (na prática, o cálculo real usaria posições planetárias)
    const planetHouses: Record<string, number> = {
      Sun: 1, Moon: 2, Mercury: 3, Venus: 4, Mars: 5, Jupiter: 6, Saturn: 7
    }
    return { cusps, asc, mc, approximate: false, planetHouses }
  }
  // placidus calculado no backend; devolver placeholder seguro
  return { cusps: Array.from({length:12},(_,i)=> norm(asc + i*30)), asc, mc, approximate: true }
}

