import type { HouseResult } from './houses'
import type { HouseSystem } from './houseSystem'

const mem = new Map<string, HouseResult>()

export function makeKey(dateUTC: Date, lat: number, lon: number, system: HouseSystem): string {
  return `${system}|${dateUTC.toISOString()}|${lat.toFixed(6)}|${lon.toFixed(6)}`
}

export function getCachedHouses(key: string): HouseResult | undefined {
  return mem.get(key)
}

export function setCachedHouses(key: string, v: HouseResult): void {
  mem.set(key, v)
}


