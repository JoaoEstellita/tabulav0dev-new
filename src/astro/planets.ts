import { Body, EclipticLongitude } from 'astronomy-engine'
import { norm360 } from './houses.math'

export type Planet =
  | 'Sun' | 'Moon' | 'Mercury' | 'Venus' | 'Mars'
  | 'Jupiter' | 'Saturn' | 'Uranus' | 'Neptune' | 'Pluto'

export const PLANETS: Record<Planet, Body> = {
  Sun: Body.Sun,
  Moon: Body.Moon,
  Mercury: Body.Mercury,
  Venus: Body.Venus,
  Mars: Body.Mars,
  Jupiter: Body.Jupiter,
  Saturn: Body.Saturn,
  Uranus: Body.Uranus,
  Neptune: Body.Neptune,
  Pluto: Body.Pluto,
}

export function getPlanetEclipticLongitude(dateUTC: Date, body: Body): number {
  const elon = EclipticLongitude(body, dateUTC)
  return norm360(elon)
}


