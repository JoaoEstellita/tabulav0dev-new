export function approximateTimezoneOffsetHours(date: Date, longitude: number, latitude?: number): number {
  // Aproxima fuso por meridiano e aplica heurística de DST para hemisfério sul (Brasil)
  const base = Math.round(longitude / 15) // ex.: -43 -> -3h
  const month = date.getUTCMonth() + 1
  // Heurística simples: meses de verão (Out–Fev) em latitudes sul aplicam +1
  const isSouthern = typeof latitude === 'number' ? latitude < 0 : true
  const dst = isSouthern && (month === 10 || month === 11 || month === 12 || month === 1 || month === 2) ? 1 : 0
  return base + dst
}


