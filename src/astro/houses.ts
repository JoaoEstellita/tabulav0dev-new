/**
 * Equal/whole-sign support using astronomy-engine (ASC/MC).
 * Placidus is computed on the backend.
 */

import * as Astronomy from 'astronomy-engine'
import type { HouseSystem } from './houseSystem'
import { normalizeHouseSystem } from './houseSystem'
import { placidusCuspides } from './placidus'

/**
 * Normalize an angle to 0..360 degrees.
 */
const norm = (d: number) => (d % 360 + 360) % 360

/**
 * Mean obliquity of the ecliptic in radians.
 */
function getObliquityRad(d: Date): number {
  try {
    // e_tilt, nao EarthTilt: `EarthTilt` nao existe no astronomy-engine, entao
    // este ramo nunca rodava e caia sempre na formula media abaixo. A media erra
    // ~0,003° contra a verdadeira — pouco, mas de graca resolver.
    const tilt = (Astronomy as any).e_tilt?.(new (Astronomy as any).AstroTime(d))
    if (tilt && typeof tilt.tobl === 'number') return tilt.tobl * Math.PI / 180
  } catch {}
  const jd = (d.getTime() / 86400000) + 2440587.5
  const T = (jd - 2451545.0) / 36525.0
  const seconds = 21.448 - 46.8150 * T - 0.00059 * T * T + 0.001813 * T * T * T
  const epsDeg = 23 + (26 / 60) + (seconds / 3600)
  return epsDeg * Math.PI / 180
}

/**
 * Compute ASC and MC for a given date and coordinates.
 */
function calculateAscMc(date: Date, latDeg: number, lonDeg: number) {
  const gmstHours = Astronomy.SiderealTime(date)
  const lstHours = ((gmstHours + (lonDeg / 15)) % 24 + 24) % 24
  const theta = lstHours * 15 * Math.PI / 180
  const eps = getObliquityRad(date)
  const phi = latDeg * Math.PI / 180
  const sin = Math.sin, cos = Math.cos, tan = Math.tan

  // MC = projeção do meridiano na eclíptica. A versão anterior fazia um desvio
  // por alphaMC com correção de quadrante e errava 1,22° nesta carta.
  const mc = norm(Math.atan2(sin(theta), cos(theta) * cos(eps)) * 180 / Math.PI)

  // ASC. O erro era UM PARÊNTESE: estava
  //   -sin θ·cos ε + tan φ·sin ε
  // quando o correto é
  //   -(sin θ·cos ε + tan φ·sin ε)
  // Custava 2,72° nesta carta — o suficiente para mudar planeta de casa, e para
  // o frontend discordar do backend sobre o mesmo mapa. Estas são as fórmulas do
  // backend, verificadas contra Swiss Ephemeris a 0,00°.
  const asc = norm(Math.atan2(cos(theta), -(sin(theta) * cos(eps) + tan(phi) * sin(eps))) * 180 / Math.PI)

  return { asc, mc, ramc: norm(lstHours * 15), obliquidade: eps * 180 / Math.PI }
}

export type HouseResult = {
  cusps: number[]
  asc: number
  mc: number
  approximate?: boolean
  system?: HouseSystem
  systemEffective?: HouseSystem
}

function buildWholeSignCusps(asc: number): number[] {
  const ascSignStart = Math.floor(norm(asc) / 30) * 30
  return Array.from({ length: 12 }, (_, i) => norm(ascSignStart + i * 30))
}

/**
 * Compute house cusps for a given system.
 */
export async function computeHousesUTC(
  date: Date,
  lat: number,
  lon: number,
  system: HouseSystem
): Promise<HouseResult> {
  const { asc, mc, ramc, obliquidade } = calculateAscMc(date, lat, lon)
  const resolvedSystem = normalizeHouseSystem(system)

  if (resolvedSystem === 'whole-sign') {
    return {
      cusps: buildWholeSignCusps(asc),
      asc,
      mc,
      approximate: false,
      system: resolvedSystem,
      systemEffective: 'whole-sign'
    }
  }

  // Placidus de verdade.
  //
  // Este ramo devolvia `asc + i*30` — CASAS IGUAIS, não Placidus. Quem escolhia
  // Placidus via um número de casa aqui e outro no backend, para o mesmo planeta
  // no mesmo mapa. Havia um `houses.placidus.ts` no repo que nunca chegou a ser
  // chamado — removido junto com esta correção.
  const cuspidesPlacidus = placidusCuspides({ ramc, latitude: lat, obliquidade, ascendente: asc, meioDoCeu: mc })
  if (cuspidesPlacidus) {
    return {
      cusps: cuspidesPlacidus,
      asc,
      mc,
      approximate: false,
      system: resolvedSystem,
      systemEffective: 'placidus'
    }
  }

  // Latitude polar: Placidus é indefinido. Cai em whole-sign, que é o outro
  // sistema que o app já suporta — e diz isso em systemEffective, em vez de
  // entregar número errado calado.
  return {
    cusps: buildWholeSignCusps(asc),
    asc,
    mc,
    approximate: true,
    system: resolvedSystem,
    systemEffective: 'whole-sign'
  }
}
