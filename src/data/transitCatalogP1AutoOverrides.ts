import { TRANSIT_CATALOG_PTBR } from './transitCatalogPtBR'

type Locale = 'pt-BR' | 'en-US' | 'es-ES' | 'it-IT'

const ASPECT_KEYS = new Set(['conjuncao', 'oposicao', 'quadratura', 'trigono', 'sextil'])
const AUTO_ASPECT_TARGETS = new Set([
  'sun',
  'moon',
  'mercury',
  'venus',
  'mars',
  'jupiter',
  'saturn',
  'uranus',
  'neptune',
  'pluto',
  'ascendente',
  'descendente',
  'meio_do_ceu',
  'fundo_do_ceu',
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

const HOUSE_FOCUS: Record<Locale, Record<number, string>> = {
  'pt-BR': {
    1: 'autoimagem, energia fisica e iniciativa',
    2: 'recursos, seguranca material e valor pessoal',
    3: 'comunicacao pratica, estudos e acordos curtos',
    4: 'base emocional, familia e estrutura de lar',
    5: 'expressao afetiva, criatividade e prazer',
    6: 'rotina, metodo e organizacao do cotidiano',
    7: 'relacoes, pactos e alinhamento com o outro',
    8: 'intimidade, partilhas e transformacao interna',
    9: 'visao de longo alcance, fe e aprendizado',
    10: 'carreira, reputacao e direcao publica',
    11: 'rede de apoio, colaboracoes e futuro',
    12: 'fechamentos, descanso e limpeza de padroes',
  },
  'en-US': {
    1: 'self-image, physical energy, and initiative',
    2: 'resources, material safety, and personal value',
    3: 'practical communication, study, and short agreements',
    4: 'emotional foundation, family, and home structure',
    5: 'affection expression, creativity, and joy',
    6: 'routine, method, and daily organization',
    7: 'relationships, agreements, and alignment with others',
    8: 'intimacy, shared resources, and inner transformation',
    9: 'long-range vision, meaning, and learning',
    10: 'career, reputation, and public direction',
    11: 'support network, collaboration, and future goals',
    12: 'closures, rest, and pattern release',
  },
  'es-ES': {
    1: 'autoimagen, energia fisica e iniciativa',
    2: 'recursos, seguridad material y valor personal',
    3: 'comunicacion practica, estudios y acuerdos cortos',
    4: 'base emocional, familia y estructura del hogar',
    5: 'expresion afectiva, creatividad y disfrute',
    6: 'rutina, metodo y organizacion diaria',
    7: 'vinculos, pactos y alineacion con el otro',
    8: 'intimidad, recursos compartidos y transformacion interna',
    9: 'vision de largo alcance, sentido y aprendizaje',
    10: 'carrera, reputacion y direccion publica',
    11: 'red de apoyo, colaboraciones y futuro',
    12: 'cierres, descanso y limpieza de patrones',
  },
  'it-IT': {
    1: 'immagine di se, energia fisica e iniziativa',
    2: 'risorse, sicurezza materiale e valore personale',
    3: 'comunicazione pratica, studio e accordi brevi',
    4: 'base emotiva, famiglia e struttura della casa',
    5: 'espressione affettiva, creativita e piacere',
    6: 'routine, metodo e organizzazione quotidiana',
    7: 'relazioni, patti e allineamento con l altro',
    8: 'intimita, risorse condivise e trasformazione interna',
    9: 'visione di lungo periodo, senso e apprendimento',
    10: 'carriera, reputazione e direzione pubblica',
    11: 'rete di supporto, collaborazioni e futuro',
    12: 'chiusure, riposo e rilascio dei vecchi schemi',
  },
}

function parseTransitKey(key: string): { planet: string; aspect: string; target: string } | null {
  const match = key.match(/^transit:([a-z_]+)\|([a-z_]+)\|([a-z0-9_]+)$/)
  if (!match) return null
  const [, planet, aspect, target] = match
  return { planet, aspect, target }
}

function isP1AspectKey(key: string): boolean {
  const parsed = parseTransitKey(key)
  if (!parsed) return false
  return ASPECT_KEYS.has(parsed.aspect) && AUTO_ASPECT_TARGETS.has(parsed.target)
}

function isIngressKey(key: string): boolean {
  const parsed = parseTransitKey(key)
  if (!parsed) return false
  return parsed.aspect === 'ingress' && /^house_([1-9]|1[0-2])$/.test(parsed.target)
}

function getIngressHouse(target: string): number | null {
  const match = target.match(/^house_([1-9]|1[0-2])$/)
  if (!match) return null
  return Number(match[1])
}

function buildAspectOverride(locale: Locale, key: string): string | null {
  const parsed = parseTransitKey(key)
  if (!parsed) return null
  const planet = PLANET_LABELS[locale][parsed.planet]
  const aspect = ASPECT_LABELS[locale][parsed.aspect]
  const target = TARGET_LABELS[locale][parsed.target]
  const theme = ASPECT_THEME[locale][parsed.aspect]
  if (!planet || !aspect || !target || !theme) return null

  if (locale === 'pt-BR') {
    return `${planet} em ${aspect} com ${target} ativa uma fase de ${theme}. O momento favorece leitura objetiva do contexto e escolhas graduais, sem movimentos extremos. Ajuste prioridades com constancia para transformar o sinal em progresso sustentavel.`
  }
  if (locale === 'en-US') {
    return `${planet} in ${aspect} with ${target} activates a phase of ${theme}. This moment favors objective context reading and gradual choices instead of extreme moves. Adjust priorities with consistency to turn this signal into sustainable progress.`
  }
  if (locale === 'es-ES') {
    return `${planet} en ${aspect} con ${target} activa una fase de ${theme}. Este momento favorece una lectura objetiva del contexto y decisiones graduales, evitando extremos. Ajusta prioridades con constancia para convertir esta senal en progreso sostenible.`
  }
  return `${planet} in ${aspect} con ${target} attiva una fase di ${theme}. Questo momento favorisce lettura oggettiva del contesto e scelte graduali, evitando mosse estreme. Regola le priorita con costanza per trasformare questo segnale in progresso sostenibile.`
}

function buildIngressOverride(locale: Locale, key: string): string | null {
  const parsed = parseTransitKey(key)
  if (!parsed) return null
  const house = getIngressHouse(parsed.target)
  if (!house) return null
  const planet = PLANET_LABELS[locale][parsed.planet]
  const focus = HOUSE_FOCUS[locale][house]
  if (!planet || !focus) return null

  if (locale === 'pt-BR') {
    return `${planet} em ingresso na Casa ${house} abre uma fase de reorganizacao em ${focus}. O periodo tende a funcionar melhor com ritmo simples, escolhas objetivas e revisao de prioridades. Transforme o impulso em passos praticos e consistentes.`
  }
  if (locale === 'en-US') {
    return `${planet} entering House ${house} starts a phase of reorganization in ${focus}. This period usually works better with simple pacing, objective choices, and priority review. Turn impulse into practical and consistent steps.`
  }
  if (locale === 'es-ES') {
    return `${planet} en ingreso en Casa ${house} abre una fase de reorganizacion en ${focus}. Este periodo suele funcionar mejor con ritmo simple, decisiones objetivas y revision de prioridades. Convierte el impulso en pasos practicos y consistentes.`
  }
  return `${planet} in ingresso in Casa ${house} apre una fase di riorganizzazione in ${focus}. Questo periodo funziona meglio con ritmo semplice, scelte oggettive e revisione delle priorita. Trasforma l impulso in passi pratici e costanti.`
}

function buildAutoOverrides(locale: Locale): Record<string, string> {
  const out: Record<string, string> = {}
  Object.keys(TRANSIT_CATALOG_PTBR).forEach((key) => {
    if (isP1AspectKey(key)) {
      const text = buildAspectOverride(locale, key)
      if (text) out[key] = text
      return
    }
    if (isIngressKey(key)) {
      const text = buildIngressOverride(locale, key)
      if (text) out[key] = text
    }
  })
  return out
}

export const TRANSIT_CATALOG_P1_AUTO_OVERRIDES_PTBR = buildAutoOverrides('pt-BR')
export const TRANSIT_CATALOG_P1_AUTO_OVERRIDES_I18N: Record<
  'en-US' | 'es-ES' | 'it-IT',
  Record<string, string>
> = {
  'en-US': buildAutoOverrides('en-US'),
  'es-ES': buildAutoOverrides('es-ES'),
  'it-IT': buildAutoOverrides('it-IT'),
}
