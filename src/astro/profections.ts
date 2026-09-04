/**
 * Profecção anual (helenística) — timing por SIGNOS INTEIROS (whole-sign).
 *
 * A cada ano de vida, uma casa "se acende" a partir do Ascendente: aos 0 anos é a
 * Casa 1, aos 1 ano a Casa 2, … repetindo a cada 12 anos. O SIGNO daquela casa
 * profeccional tem um regente tradicional — o "senhor do ano" (time-lord): o
 * planeta cujos trânsitos/condição no mapa dizem por onde o ano se move.
 *
 * Também deriva a profecção MENSAL (cada ~mês avança um signo a partir da casa do ano).
 *
 * Puro: recebe data de nascimento + grau do Ascendente. Sem efeméride — é aritmética
 * de idade sobre o mapa que o app já calcula. Espelho ocidental da Dasha védica.
 */

// Regente de domicílio tradicional (7 planetas), indexado por signo 0=Áries.
const DOMICILE_RULER_PT: string[] = [
  'Marte',    // Áries
  'Vênus',    // Touro
  'Mercúrio', // Gêmeos
  'Lua',      // Câncer
  'Sol',      // Leão
  'Mercúrio', // Virgem
  'Vênus',    // Libra
  'Marte',    // Escorpião
  'Júpiter',  // Sagitário
  'Saturno',  // Capricórnio
  'Saturno',  // Aquário
  'Júpiter',  // Peixes
]

// Chave inglesa do planeta (casa com RealPlanetPosition.name / catálogos).
const PT_TO_EN_PLANET: Record<string, string> = {
  'Sol': 'sun', 'Lua': 'moon', 'Mercúrio': 'mercury', 'Vênus': 'venus',
  'Marte': 'mars', 'Júpiter': 'jupiter', 'Saturno': 'saturn',
}

const DAY_MS = 86400000
const TROPICAL_YEAR_DAYS = 365.2425

export interface ProfectionResult {
  ageYears: number        // anos COMPLETOS de vida
  house: number           // 1-12 — casa profeccional do ANO
  signIndex: number       // 0-11 — signo profeccional do ano (a partir do Asc)
  timeLordPt: string      // senhor do ano (regente do signo profeccional), em pt-BR
  timeLordEn: string      // idem, chave inglesa (sun, moon, …)
  monthHouse: number      // 1-12 — casa profeccional do MÊS atual
  monthSignIndex: number  // 0-11 — signo profeccional do mês
  monthLordPt: string     // senhor do mês
  monthLordEn: string
  nextBirthdayISO: string // quando a casa do ano vira (aniversário seguinte)
}

function toDate(d: Date | string | null | undefined): Date | null {
  if (!d) return null
  if (d instanceof Date) return Number.isNaN(d.getTime()) ? null : d
  const parsed = new Date(String(d).length <= 10 ? `${d}T12:00:00` : String(d))
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

/** Anos completos de vida entre o nascimento e `now` (ajusta se o aniversário ainda não passou no ano). */
function completedYears(birth: Date, now: Date): { years: number; lastBirthday: Date; nextBirthday: Date } {
  let years = now.getUTCFullYear() - birth.getUTCFullYear()
  const anniversaryThisYear = new Date(Date.UTC(now.getUTCFullYear(), birth.getUTCMonth(), birth.getUTCDate(), 12, 0, 0))
  if (now.getTime() < anniversaryThisYear.getTime()) years -= 1
  const lastBirthday = new Date(Date.UTC(birth.getUTCFullYear() + years, birth.getUTCMonth(), birth.getUTCDate(), 12, 0, 0))
  const nextBirthday = new Date(Date.UTC(birth.getUTCFullYear() + years + 1, birth.getUTCMonth(), birth.getUTCDate(), 12, 0, 0))
  return { years: Math.max(0, years), lastBirthday, nextBirthday }
}

export function computeProfection(
  birthData: Date | string | null | undefined,
  ascendantDeg: number | null | undefined,
  now: Date = new Date(),
): ProfectionResult | null {
  const birth = toDate(birthData)
  if (!birth || typeof ascendantDeg !== 'number' || !Number.isFinite(ascendantDeg)) return null

  const { years, lastBirthday, nextBirthday } = completedYears(birth, now)
  const ascSignIndex = Math.floor((((ascendantDeg % 360) + 360) % 360) / 30)

  const house = (years % 12) + 1
  const signIndex = (ascSignIndex + years) % 12
  const timeLordPt = DOMICILE_RULER_PT[signIndex]

  // Profecção mensal: cada ~1/12 do ano avança uma casa/signo a partir da casa do ano.
  const daysSinceBirthday = Math.max(0, (now.getTime() - lastBirthday.getTime()) / DAY_MS)
  const monthsElapsed = Math.min(11, Math.floor(daysSinceBirthday / (TROPICAL_YEAR_DAYS / 12)))
  const monthHouse = ((house - 1 + monthsElapsed) % 12) + 1
  const monthSignIndex = (signIndex + monthsElapsed) % 12
  const monthLordPt = DOMICILE_RULER_PT[monthSignIndex]

  return {
    ageYears: years,
    house,
    signIndex,
    timeLordPt,
    timeLordEn: PT_TO_EN_PLANET[timeLordPt] || timeLordPt.toLowerCase(),
    monthHouse,
    monthSignIndex,
    monthLordPt,
    monthLordEn: PT_TO_EN_PLANET[monthLordPt] || monthLordPt.toLowerCase(),
    nextBirthdayISO: nextBirthday.toISOString(),
  }
}
