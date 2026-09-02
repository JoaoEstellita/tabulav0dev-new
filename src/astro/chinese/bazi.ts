import type { BaziChart, ChineseProfile, Pillar, FiveElementsCount, BranchInteraction, TenGodKey, Element } from './types'
import { STEMS, BRANCHES, MONTH_JIE_LONGITUDES, MONTH_BRANCH_ORDER, tenGod, firstMonthStem, firstHourStem, SIX_HARMONIES, SIX_CLASHES, THREE_HARMONIES, HARMS, PUNISHMENTS } from './constants'
import { sunLongitude, jdFromDate, solarTermInstant, equationOfTime, julianDayNumber } from './sun'

export const ENGINE_VERSION = 1
export const METHODOLOGY_VERSION = 1

const DAY_JIAZI_OFFSET = 49 // (JDN_noon + 49) % 60, validado 1989-04-10 → 庚子(36)

function pillar(stem: number, branch: number): Pillar {
  // cycleIndex Jiazi (0..59): único índice com esse stem(mod10) e branch(mod12).
  let idx = 0
  for (let k = 0; k < 60; k++) if (k % 10 === stem && k % 12 === branch) { idx = k; break }
  return { stem, branch, cycleIndex: idx }
}

export interface ChineseInput {
  year: number; month: number; day: number // data civil LOCAL
  hour?: number; minute?: number // hora civil LOCAL (opcional)
  longitude: number // do local de nascimento (leste +)
  utc: Date // instante UTC do nascimento (para longitude do Sol / hora solar)
  dayBoundaryMode?: 'midnight' | 'late_zi_next_day'
}

export function buildChineseChart(input: ChineseInput): ChineseProfile {
  const { year, month, day, longitude, utc } = input
  const hasTime = typeof input.hour === 'number'
  const dayMode = input.dayBoundaryMode || 'midnight'

  // ── Pilar do Ano (fronteira Lì Chūn = Sol a 315°) ─────────────────────────
  const liChun = solarTermInstant(year, 315, 2) // ~fevereiro
  const baziYear = (liChun && utc.getTime() >= liChun.getTime()) ? year : year - 1
  const yIdx = ((baziYear - 1984) % 60 + 60) % 60
  const yearP = pillar(yIdx % 10, yIdx % 12)

  // ── Pilar do Mês (Jie pela longitude do Sol) ──────────────────────────────
  const sunLon = sunLongitude(jdFromDate(utc))
  const monthOrder = Math.floor((((sunLon - MONTH_JIE_LONGITUDES[0]) % 360) + 360) % 360 / 30) // 0=寅
  const monthBranch = MONTH_BRANCH_ORDER[monthOrder]
  const monthStem = (firstMonthStem(yearP.stem) + monthOrder) % 10
  const monthP = pillar(monthStem, monthBranch)

  // ── Pilar do Dia (ciclo sexagenário contínuo) ─────────────────────────────
  let dY = year, dM = month, dD = day
  if (dayMode === 'late_zi_next_day' && hasTime && (input.hour as number) >= 23) {
    const nx = new Date(Date.UTC(year, month - 1, day + 1))
    dY = nx.getUTCFullYear(); dM = nx.getUTCMonth() + 1; dD = nx.getUTCDate()
  }
  const dayIdx = (julianDayNumber(dY, dM, dD) + DAY_JIAZI_OFFSET) % 60
  const dayP = pillar(dayIdx % 10, dayIdx % 12)
  const dayMaster = dayP.stem

  // ── Pilar da Hora (tempo solar verdadeiro) ────────────────────────────────
  let hourP: Pillar | null = null
  let boundaryWarning: string | undefined
  if (hasTime) {
    const eot = equationOfTime(jdFromDate(utc)) // minutos
    const solarMs = utc.getTime() + (longitude / 15) * 3600000 + eot * 60000
    const sd = new Date(solarMs)
    const solarHour = sd.getUTCHours() + sd.getUTCMinutes() / 60
    const hourBranch = Math.floor((((solarHour + 1) % 24)) / 2) // 子=23..0:59
    const hourStem = (firstHourStem(dayMaster) + hourBranch) % 10
    hourP = pillar(hourStem, hourBranch)
    // aviso se a correção solar mudou o ramo vs hora civil
    const civilHour = (input.hour as number) + (input.minute || 0) / 60
    const civilBranch = Math.floor((((civilHour + 1) % 24)) / 2)
    if (civilBranch !== hourBranch) boundaryWarning = 'hour_solar_shift'
  }

  // ── Cinco Elementos (presença estrutural: stems + ramos + ocultos) ────────
  const fe: FiveElementsCount = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 }
  const pillars = [yearP, monthP, dayP, ...(hourP ? [hourP] : [])]
  for (const p of pillars) {
    fe[STEMS[p.stem].element]++
    fe[BRANCHES[p.branch].element]++
    for (const hs of BRANCHES[p.branch].hiddenStems) fe[STEMS[hs].element]++
  }

  // ── Dez Deuses (stem de cada pilar vs Day Master) ─────────────────────────
  const dm = STEMS[dayMaster]
  const tg = (stem: number): TenGodKey => tenGod(dm, STEMS[stem])
  const tenGods = { year: tg(yearP.stem), month: tg(monthP.stem), hour: hourP ? tg(hourP.stem) : null }

  // ── Interações entre ramos presentes ──────────────────────────────────────
  const branches = pillars.map((p) => p.branch)
  const has = (b: number) => branches.includes(b)
  const interactions: BranchInteraction[] = []
  for (const [a, b] of SIX_HARMONIES) if (has(a) && has(b)) interactions.push({ type: 'six-harmony', branches: [a, b] })
  for (const [a, b] of SIX_CLASHES) if (has(a) && has(b)) interactions.push({ type: 'six-clash', branches: [a, b] })
  for (const th of THREE_HARMONIES) if (th.branches.every(has)) interactions.push({ type: 'three-harmony', branches: th.branches, transformsTo: th.element })
  for (const [a, b] of HARMS) if (has(a) && has(b)) interactions.push({ type: 'harm', branches: [a, b] })
  for (const pn of PUNISHMENTS) {
    if (pn.length === 1) { if (branches.filter((x) => x === pn[0]).length >= 2) interactions.push({ type: 'punishment', branches: pn }) }
    else if (pn.every(has)) interactions.push({ type: 'punishment', branches: pn })
  }

  const bazi: BaziChart = {
    year: yearP, month: monthP, day: dayP, hour: hourP,
    dayMaster, fiveElements: fe, tenGods, interactions,
    confidence: hasTime ? 'high' : 'limited',
    methodology: { yearBoundary: 'li_chun', monthBoundary: 'jie', hourTimeMode: 'true_apparent_solar', dayBoundaryMode: dayMode },
    boundaryWarning,
  }

  const zb = BRANCHES[yearP.branch]
  const zodiac = { animalBranch: yearP.branch, lunarYear: baziYear, element: zb.element as Element, polarity: zb.polarity }

  return { zodiac, bazi, engineVersion: ENGINE_VERSION, methodologyVersion: METHODOLOGY_VERSION }
}
