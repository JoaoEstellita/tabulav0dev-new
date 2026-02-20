import { TRANSIT_CATALOG_PTBR } from './transitCatalogPtBR'

type Locale = 'pt-BR' | 'en-US' | 'es-ES' | 'it-IT'

const ASPECT_KEYS = new Set(['conjuncao', 'oposicao', 'quadratura', 'trigono', 'sextil'])
const MAJOR_TARGETS = new Set([
  'sun',
  'moon',
  'mercury',
  'venus',
  'mars',
  'jupiter',
  'saturn',
  'ascendente',
  'meio_do_ceu',
])

const PLANET_LABELS: Record<Locale, Record<string, string>> = {
  'pt-BR': {
    sun: 'Sol',
    moon: 'Lua',
    mercury: 'Mercurio',
    venus: 'Venus',
    mars: 'Marte',
    jupiter: 'Jupiter',
    saturn: 'Saturno',
    uranus: 'Urano',
    neptune: 'Netuno',
    pluto: 'Plutao',
  },
  'en-US': {
    sun: 'Sun',
    moon: 'Moon',
    mercury: 'Mercury',
    venus: 'Venus',
    mars: 'Mars',
    jupiter: 'Jupiter',
    saturn: 'Saturn',
    uranus: 'Uranus',
    neptune: 'Neptune',
    pluto: 'Pluto',
  },
  'es-ES': {
    sun: 'Sol',
    moon: 'Luna',
    mercury: 'Mercurio',
    venus: 'Venus',
    mars: 'Marte',
    jupiter: 'Jupiter',
    saturn: 'Saturno',
    uranus: 'Urano',
    neptune: 'Neptuno',
    pluto: 'Pluton',
  },
  'it-IT': {
    sun: 'Sole',
    moon: 'Luna',
    mercury: 'Mercurio',
    venus: 'Venere',
    mars: 'Marte',
    jupiter: 'Giove',
    saturn: 'Saturno',
    uranus: 'Urano',
    neptune: 'Nettuno',
    pluto: 'Plutone',
  },
}

const TARGET_LABELS: Record<Locale, Record<string, string>> = {
  'pt-BR': {
    ...PLANET_LABELS['pt-BR'],
    ascendente: 'Ascendente',
    meio_do_ceu: 'Meio do Ceu',
  },
  'en-US': {
    ...PLANET_LABELS['en-US'],
    ascendente: 'Ascendant',
    meio_do_ceu: 'Midheaven',
  },
  'es-ES': {
    ...PLANET_LABELS['es-ES'],
    ascendente: 'Ascendente',
    meio_do_ceu: 'Medio Cielo',
  },
  'it-IT': {
    ...PLANET_LABELS['it-IT'],
    ascendente: 'Ascendente',
    meio_do_ceu: 'Medio Cielo',
  },
}

const ASPECT_LABELS: Record<Locale, Record<string, string>> = {
  'pt-BR': {
    conjuncao: 'conjuncao',
    oposicao: 'oposicao',
    quadratura: 'quadratura',
    trigono: 'trigono',
    sextil: 'sextil',
  },
  'en-US': {
    conjuncao: 'conjunction',
    oposicao: 'opposition',
    quadratura: 'square',
    trigono: 'trine',
    sextil: 'sextile',
  },
  'es-ES': {
    conjuncao: 'conjuncion',
    oposicao: 'oposicion',
    quadratura: 'cuadratura',
    trigono: 'trigono',
    sextil: 'sextil',
  },
  'it-IT': {
    conjuncao: 'congiunzione',
    oposicao: 'opposizione',
    quadratura: 'quadratura',
    trigono: 'trigono',
    sextil: 'sestile',
  },
}

const ASPECT_THEME: Record<Locale, Record<string, string>> = {
  'pt-BR': {
    conjuncao: 'foco e concentracao no mesmo tema',
    oposicao: 'equilibrio entre polos de decisao',
    quadratura: 'ajuste pratico com mais exigencia',
    trigono: 'fluidez para consolidar avancos',
    sextil: 'oportunidade que pede iniciativa',
  },
  'en-US': {
    conjuncao: 'focus and concentration on the same theme',
    oposicao: 'balance between decision polarities',
    quadratura: 'practical adjustment under higher pressure',
    trigono: 'flow to consolidate progress',
    sextil: 'opportunity that depends on initiative',
  },
  'es-ES': {
    conjuncao: 'foco y concentracion en el mismo tema',
    oposicao: 'equilibrio entre polos de decision',
    quadratura: 'ajuste practico con mayor exigencia',
    trigono: 'fluidez para consolidar avances',
    sextil: 'oportunidad que requiere iniciativa',
  },
  'it-IT': {
    conjuncao: 'focus e concentrazione sullo stesso tema',
    oposicao: 'equilibrio tra poli decisionali',
    quadratura: 'aggiustamento pratico con maggiore pressione',
    trigono: 'fluidita per consolidare progressi',
    sextil: 'opportunita che richiede iniziativa',
  },
}

function parseTransitKey(key: string): { planet: string; aspect: string; target: string } | null {
  const match = key.match(/^transit:([a-z_]+)\|([a-z_]+)\|([a-z_]+)$/)
  if (!match) return null
  const [, planet, aspect, target] = match
  return { planet, aspect, target }
}

function isP1Key(key: string): boolean {
  const parsed = parseTransitKey(key)
  if (!parsed) return false
  return ASPECT_KEYS.has(parsed.aspect) && MAJOR_TARGETS.has(parsed.target)
}

function buildGenericOverride(locale: Locale, key: string): string | null {
  const parsed = parseTransitKey(key)
  if (!parsed) return null
  const planet = PLANET_LABELS[locale][parsed.planet]
  const aspect = ASPECT_LABELS[locale][parsed.aspect]
  const target = TARGET_LABELS[locale][parsed.target]
  const theme = ASPECT_THEME[locale][parsed.aspect]
  if (!planet || !aspect || !target || !theme) return null

  if (locale === 'pt-BR') {
    return `${planet} em ${aspect} com ${target} ativa uma fase de ${theme}. O ciclo favorece leitura objetiva do contexto e escolhas graduais, sem movimentos extremos. Ajuste prioridades com constancia para transformar o sinal em progresso sustentavel.`
  }
  if (locale === 'en-US') {
    return `${planet} in ${aspect} with ${target} activates a phase of ${theme}. This cycle favors objective reading of context and gradual choices instead of extreme moves. Adjust priorities with consistency to convert this signal into sustainable progress.`
  }
  if (locale === 'es-ES') {
    return `${planet} en ${aspect} con ${target} activa una fase de ${theme}. Este ciclo favorece lectura objetiva del contexto y decisiones graduales, evitando movimientos extremos. Ajusta prioridades con constancia para convertir esta senal en progreso sostenible.`
  }
  return `${planet} in ${aspect} con ${target} attiva una fase di ${theme}. Questo ciclo favorisce lettura oggettiva del contesto e scelte graduali, evitando mosse estreme. Regola le priorita con costanza per trasformare questo segnale in progresso sostenibile.`
}

function buildP1AutoOverrides(locale: Locale): Record<string, string> {
  const out: Record<string, string> = {}
  Object.keys(TRANSIT_CATALOG_PTBR).forEach((key) => {
    if (!isP1Key(key)) return
    const text = buildGenericOverride(locale, key)
    if (!text) return
    out[key] = text
  })
  return out
}

export const TRANSIT_CATALOG_P1_AUTO_OVERRIDES_PTBR = buildP1AutoOverrides('pt-BR')
export const TRANSIT_CATALOG_P1_AUTO_OVERRIDES_I18N: Record<'en-US' | 'es-ES' | 'it-IT', Record<string, string>> = {
  'en-US': buildP1AutoOverrides('en-US'),
  'es-ES': buildP1AutoOverrides('es-ES'),
  'it-IT': buildP1AutoOverrides('it-IT'),
}
