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
 * Orbe apertada de propósito. A progressão é lentíssima — com orbe de trânsito
 * (6°) um aspecto da Lua progredida ficaria "ativo" por mais de um ano e todos
 * os outros planetas ficariam ativos a vida inteira.
 */
const ORB_LUA = 1.5
const ORB_DEMAIS = 1.0

/** A Lua lidera: é a única que se move o bastante para a leitura mudar. */
const ORDEM = ['Moon', 'Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto']

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

  const nascimento = new Date(String(datetime).replace(' ', 'T'))
  if (!Number.isFinite(nascimento.getTime())) return null

  const prog = progressedDate(nascimento, now)
  const iso = prog.toISOString()
  // Mantém a hora de nascimento como referência — o que avança é a data.
  const [dataProg] = iso.split('T')
  const horaNascimento = String(datetime).split('T')[1]?.slice(0, 5) || '12:00'

  return computeNatalLongitudes({
    datetime: `${dataProg}T${horaNascimento}:00`,
    coordinates: coords,
  })
}

/** Aspectos entre os planetas progredidos e os natais. */
export function computeProgressedAspects(
  progredidos: RealPlanetPosition[] | null | undefined,
  natais: RealPlanetPosition[] | null | undefined,
  limit = 8,
): ProgressedAspect[] {
  const A = (progredidos || []).filter((p) => Number.isFinite(Number(p?.longitude)))
  const B = (natais || []).filter((p) => Number.isFinite(Number(p?.longitude)))
  const achados: Array<ProgressedAspect & { ordem: number }> = []

  for (const a of A) {
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
