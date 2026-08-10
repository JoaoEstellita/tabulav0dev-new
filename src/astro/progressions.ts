import { computeNatalLongitudes } from './synastry'
import type { RealPlanetPosition } from '../services/astrology/RealAstrologyEngine'

/**
 * Progressões secundárias — "um dia por ano".
 *
 * A técnica avança o mapa natal um DIA para cada ANO de vida: quem tem 37 anos
 * lê o céu de 37 dias depois de nascer. Não é um trânsito (o céu real de hoje) e
 * sim um mapa simbólico do amadurecimento interno.
 *
 * O cálculo reaproveita `computeNatalLongitudes` (o mesmo util da sinastria, que
 * já resolve o fuso histórico pela coordenada): basta pedir as posições da data
 * progredida.
 *
 * ⚠️ Só a LUA progredida se move de forma perceptível (~1°/mês, uma volta a cada
 * ~27 anos). Sol, Mercúrio e Vênus andam cerca de 1°/ano; de Marte a Plutão a
 * posição praticamente não muda ao longo da vida. Por isso a ordenação abaixo
 * coloca a Lua primeiro — é ela que dá movimento à leitura.
 */

export type ProgressedAspect = {
  progressedPlanet: string
  natalPlanet: string
  aspect: string
  symbol: string
  tone: 'harmonioso' | 'tenso' | 'neutro'
  orb: number
}

const MAJOR_ASPECTS: Array<{ name: string; angle: number; symbol: string; tone: ProgressedAspect['tone'] }> = [
  { name: 'conjuncao', angle: 0, symbol: '☌', tone: 'neutro' },
  { name: 'sextil', angle: 60, symbol: '⚹', tone: 'harmonioso' },
  { name: 'quadratura', angle: 90, symbol: '□', tone: 'tenso' },
  { name: 'trigono', angle: 120, symbol: '△', tone: 'harmonioso' },
  { name: 'oposicao', angle: 180, symbol: '☍', tone: 'tenso' },
]

/**
 * Orbe da Lua progredida = 3°. A Lua progride ~1°/mês, então 3° corresponde a
 * uma janela de ~6 meses de cada lado — a mesma ordem de grandeza que efemérides
 * de referência (ex.: Personare) usam para dar as "fases" da Lua progredida.
 * Com 3° dois aspectos da Lua podem coexistir (ex.: oposição ao Sol separando e
 * oposição a Vênus aplicando), como de fato acontece no céu. Os DEMAIS planetas
 * quase não andam na progressão, então mantêm orbe apertada (1°) — senão
 * ficariam "ativos" a vida inteira.
 */
const ORB_LUA = 3.0
const ORB_DEMAIS = 1.0

/** A Lua lidera: é a única que se move o bastante para a leitura mudar. */
const ORDEM = ['Moon', 'Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto']

/**
 * Planetas que praticamente não andam na progressão (Júpiter a Plutão progridem
 * < 0,2°/ano). Um aspecto do planeta progredido lento ≈ o MESMO aspecto natal
 * (a posição progredida é quase a natal a vida inteira) — não é uma fase, é um
 * traço permanente, e o app já o interpreta na tela de aspectos NATAIS. Por isso
 * são ESCONDIDOS da progressão: só a Lua e os pessoais (Sol, Mercúrio, Vênus,
 * Marte) andam o bastante para formar fases de verdade.
 */
const LENTOS = new Set(['Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'])

/**
 * Data progredida: nascimento + (anos de vida) dias.
 * Usa a idade fracionária para a Lua progredida andar mês a mês, não aos saltos.
 */
export function progressedDate(birth: Date, now: Date = new Date()): Date {
  const anos = (now.getTime() - birth.getTime()) / (365.2422 * 86400000)
  return new Date(birth.getTime() + anos * 86400000)
}

/** Posições progredidas a partir dos dados de nascimento. */
export async function computeProgressedPositions(
  birthData?: { datetime?: string; coordinates?: { latitude: number; longitude: number } } | null,
  now: Date = new Date(),
): Promise<RealPlanetPosition[] | null> {
  const datetime = birthData?.datetime
  const coords = birthData?.coordinates
  if (!datetime || !coords) return null

  // Trata a data/hora de nascimento como UTC-naive (sufixo Z) para a aritmética
  // não depender do fuso da máquina. O fuso real é reaplicado por
  // computeNatalLongitudes a partir das coordenadas.
  const baseIso = String(datetime).replace(' ', 'T').slice(0, 19)
  const nascimento = new Date(`${baseIso}Z`)
  if (!Number.isFinite(nascimento.getTime())) return null

  // A progressão avança o instante de nascimento pela idade fracionária (1 dia
  // por ano). É PRECISO manter a FRAÇÃO de hora do resultado — descartá-la (só a
  // data) congelava a Lua progredida por ~1 ano e a fazia pular ~13° de vez,
  // em vez de andar ~1°/mês.
  const prog = progressedDate(nascimento, now)
  const iso = prog.toISOString()
  const dataProg = iso.slice(0, 10)
  const horaProg = iso.slice(11, 16)

  return computeNatalLongitudes({
    datetime: `${dataProg}T${horaProg}:00`,
    coordinates: coords,
  })
}

/** Aspectos entre os planetas progredidos e os natais. */
export function computeProgressedAspects(
  progredidos: RealPlanetPosition[] | null | undefined,
  natais: RealPlanetPosition[] | null | undefined,
  limit = 12,
): ProgressedAspect[] {
  const A = (progredidos || []).filter((p) => Number.isFinite(Number(p?.longitude)))
  const B = (natais || []).filter((p) => Number.isFinite(Number(p?.longitude)))
  const achados: Array<ProgressedAspect & { ordem: number }> = []

  for (const a of A) {
    // Planeta progredido lento (Júpiter→Plutão) não gera fase — escondido.
    if (LENTOS.has(a.name)) continue
    const ehLua = a.name === 'Moon'
    const orbMax = ehLua ? ORB_LUA : ORB_DEMAIS
    for (const b of B) {
      let diff = Math.abs(Number(a.longitude) - Number(b.longitude)) % 360
      if (diff > 180) diff = 360 - diff
      for (const asp of MAJOR_ASPECTS) {
        const orb = Math.abs(diff - asp.angle)
        if (orb <= orbMax) {
          achados.push({
            progressedPlanet: a.name,
            natalPlanet: b.name,
            aspect: asp.name,
            symbol: asp.symbol,
            tone: asp.tone,
            orb,
            ordem: ORDEM.indexOf(a.name),
          })
          break
        }
      }
    }
  }

  return achados
    .sort((x, y) => (x.ordem - y.ordem) || (x.orb - y.orb))
    .slice(0, limit)
    .map(({ ordem, ...resto }) => resto)
}

// ─── Janela real das progressões da Lua ──────────────────────────────────────

export type ProgressedWindow = {
  start: string   // ISO — entrada na orbe
  exact: string   // ISO — aspecto exato (projeção linear)
  end: string     // ISO — saída da orbe
  phase: 'aplicando' | 'exato' | 'separando'
  months: number  // duração aproximada da janela
}

/** Menor diferença angular assinada (quanto `from` precisa andar até `to`). */
function deltaAssinado(from: number, to: number): number {
  return ((to - from + 540) % 360) - 180
}

/**
 * Janela de cada aspecto da LUA progredida: quando entra na orbe, quando fica
 * exato e quando sai — a partir da velocidade REAL da Lua progredida (medida em
 * dois instantes) projetada linearmente. Só a Lua ganha janela: os demais
 * planetas progridem ~1°/ano e sua "janela" seria de anos (fora do foco).
 *
 * `progAtNow` é reaproveitado (a tela já calcula as posições progredidas de hoje)
 * — só o instante +30d é recalculado aqui para obter a taxa.
 */
export async function computeProgressedMoonWindows(
  birthData: { datetime?: string; coordinates?: { latitude: number; longitude: number } } | null,
  progAtNow: RealPlanetPosition[] | null | undefined,
  natais: RealPlanetPosition[] | null | undefined,
  aspects: ProgressedAspect[],
  now: Date = new Date(),
): Promise<Record<number, ProgressedWindow>> {
  const out: Record<number, ProgressedWindow> = {}
  const moonNow = Number((progAtNow || []).find((p) => p?.name === 'Moon')?.longitude)
  if (!Number.isFinite(moonNow)) return out

  const prog30 = await computeProgressedPositions(birthData, new Date(now.getTime() + 30 * 86400000))
  const moon30 = Number((prog30 || []).find((p) => p?.name === 'Moon')?.longitude)
  if (!Number.isFinite(moon30)) return out

  const taxaPorDia = deltaAssinado(moonNow, moon30) / 30 // °/dia real
  if (Math.abs(taxaPorDia) < 1e-6) return out

  aspects.forEach((a, i) => {
    if (a.progressedPlanet !== 'Moon') return
    const natalLon = Number((natais || []).find((p) => p?.name === a.natalPlanet)?.longitude)
    const angle = MAJOR_ASPECTS.find((m) => m.name === a.aspect)?.angle
    if (!Number.isFinite(natalLon) || angle == null) return

    // A Lua fica exata quando sua longitude = natal ± ângulo; escolhe o alvo mais
    // próximo da posição atual (o lado do aspecto que está de fato acontecendo).
    const alvoA = (natalLon + angle) % 360
    const alvoB = (natalLon - angle + 360) % 360
    const dA = deltaAssinado(moonNow, alvoA)
    const dB = deltaAssinado(moonNow, alvoB)
    const d = Math.abs(dA) <= Math.abs(dB) ? dA : dB

    const diasAoExato = d / taxaPorDia
    const meiaJanelaDias = Math.abs(ORB_LUA / taxaPorDia)
    const exact = new Date(now.getTime() + diasAoExato * 86400000)
    const start = new Date(exact.getTime() - meiaJanelaDias * 86400000)
    const end = new Date(exact.getTime() + meiaJanelaDias * 86400000)
    const months = (end.getTime() - start.getTime()) / (30.4368 * 86400000)
    const phase: ProgressedWindow['phase'] =
      Math.abs(now.getTime() - exact.getTime()) < 15 * 86400000 ? 'exato'
        : now.getTime() < exact.getTime() ? 'aplicando' : 'separando'

    out[i] = { start: start.toISOString(), exact: exact.toISOString(), end: end.toISOString(), phase, months }
  })

  return out
}
