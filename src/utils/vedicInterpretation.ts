/**
 * Resolvers védicos — juntam os dados do MOTOR (astro/vedic) com o CONTEÚDO
 * curado (data/vedic) para a UI e o agente. Fallback seguro: se faltar conteúdo
 * curado de um nakshatra, devolve uma leitura básica a partir do motor (nunca
 * quebra, nunca inventa placar/kuta). pt-BR por enquanto; i18n entra depois.
 */
import { type NakshatraDef } from '../astro/vedic/nakshatra'
import type { GunaMilanResult } from '../astro/vedic/gunaMilan'
import type { DashaPeriod } from '../astro/vedic/dasha'
import { NAKSHATRA_PTBR } from '../data/vedic/nakshatraOverridesPtBR'
import { NAKSHATRA_I18N } from '../data/vedic/nakshatraOverridesI18n'
import { KUTA_PTBR, GUNA_BANDS_PTBR, GUNA_DISCLAIMER_PTBR } from '../data/vedic/kutaOverridesPtBR'
import { DASHA_PTBR } from '../data/vedic/dashaOverridesPtBR'
import { DASHA_I18N } from '../data/vedic/dashaOverridesI18n'

export type VedicLang = 'pt-BR' | 'en-US' | 'es-ES' | 'it-IT'

const PLANET_PT: Record<string, string> = {
  sun: 'Sol', moon: 'Lua', mars: 'Marte', mercury: 'Mercúrio', jupiter: 'Júpiter',
  venus: 'Vênus', saturn: 'Saturno', rahu: 'Rahu', ketu: 'Ketu',
}
export const planetPt = (key: string) => PLANET_PT[key] || key

export interface ResolvedNakshatra {
  key: string
  name: string
  lord: string
  lordPt: string
  yoni: string
  gana: string
  nadi: string
  pada?: number
  rashiName?: string
  deity: string
  symbol: string
  essencia: string
  personalidade: string
  forcas: string[]
  desafios: string[]
  amor: string
  trabalho: string
  moodLine: string
  hasContent: boolean
}

/** Nakshatra resolvido (motor + conteúdo curado, com fallback). i18n via `lang`. */
export function resolveNakshatra(nak: NakshatraDef, opts?: { pada?: number; rashiName?: string; lang?: VedicLang }): ResolvedNakshatra {
  const lang = opts?.lang || 'pt-BR'
  const c = NAKSHATRA_PTBR[nak.key]
  const t = lang !== 'pt-BR' ? NAKSHATRA_I18N[lang]?.[nak.key] : undefined
  const lordPt = planetPt(nak.lord)
  const base = {
    key: nak.key, name: nak.name, lord: nak.lord, lordPt,
    yoni: nak.yoni, gana: nak.gana, nadi: nak.nadi,
    pada: opts?.pada, rashiName: opts?.rashiName,
  }
  if (c) return {
    ...base, ...c,
    essencia: t?.essencia || c.essencia,
    personalidade: t?.personalidade || c.personalidade,
    hasContent: true,
  }
  // Fallback: leitura básica a partir do motor (sem conteúdo curado ainda).
  return {
    ...base,
    deity: '—',
    symbol: '—',
    essencia: `Nakshatra regida por ${lordPt}.`,
    personalidade: `Mansão lunar regida por ${lordPt}. Leitura curada completa em breve.`,
    forcas: [], desafios: [], amor: '', trabalho: '',
    moodLine: `energia de ${nak.name}`,
    hasContent: false,
  }
}

export interface ResolvedKuta {
  key: string
  nome: string
  oQueMede: string
  points: number
  max: number
  leitura: string
  approx?: boolean
  dosha?: boolean
}
export interface ResolvedGunaMilan {
  total: number
  max: number
  bandKey: string
  bandFaixa: string
  bandTexto: string
  disclaimer: string
  kutas: ResolvedKuta[]
  hasNadiDosha: boolean
  hasBhakootDosha: boolean
}

function pickLeitura(points: number, max: number, c: { alta: string; media: string; baixa: string }): string {
  const ratio = max > 0 ? points / max : 0
  if (ratio >= 0.75) return c.alta
  if (ratio <= 0.25) return c.baixa
  return c.media !== '—' ? c.media : ratio >= 0.5 ? c.alta : c.baixa
}

/** Guna Milan resolvido para exibição/narração. */
export function resolveGunaMilan(result: GunaMilanResult): ResolvedGunaMilan {
  const band = GUNA_BANDS_PTBR[result.band]
  const kutas: ResolvedKuta[] = result.kutas.map((k) => {
    const c = KUTA_PTBR[k.key]
    return {
      key: k.key,
      nome: c?.nome || k.key,
      oQueMede: c?.oQueMede || '',
      points: k.points,
      max: k.max,
      leitura: c ? pickLeitura(k.points, k.max, c) : '',
      approx: k.approx,
      dosha: k.dosha,
    }
  })
  return {
    total: result.total,
    max: result.max,
    bandKey: result.band,
    bandFaixa: band?.faixa || '',
    bandTexto: band?.texto || '',
    disclaimer: GUNA_DISCLAIMER_PTBR,
    kutas,
    hasNadiDosha: result.hasNadiDosha,
    hasBhakootDosha: result.hasBhakootDosha,
  }
}

export interface ResolvedDasha {
  lord: string
  lordPt: string
  nome: string
  anos: number
  tema: string
  palavrasChave: string[]
  start?: Date
  end?: Date
}
/** Mahadasha resolvida (conteúdo + datas). null se não houver período. i18n via `lang`. */
export function resolveDasha(period: DashaPeriod | null, lang: VedicLang = 'pt-BR'): ResolvedDasha | null {
  if (!period) return null
  const c = DASHA_PTBR[period.lord]
  const temaI18n = lang !== 'pt-BR' ? DASHA_I18N[lang]?.[period.lord] : undefined
  return {
    lord: period.lord,
    lordPt: planetPt(period.lord),
    nome: c?.nome || planetPt(period.lord),
    anos: c?.anos || 0,
    tema: temaI18n || c?.tema || `Período regido por ${planetPt(period.lord)}.`,
    palavrasChave: c?.palavrasChave || [],
    start: period.start,
    end: period.end,
  }
}

/** Frase curta da "Lua de hoje em [nakshatra]" para o panorama diário. */
export function resolveMoonNakshatraDaily(nak: NakshatraDef): string {
  const c = NAKSHATRA_PTBR[nak.key]
  return `Lua hoje em *${nak.name}* — ${c?.moodLine || `energia de ${nak.name}`}`
}
