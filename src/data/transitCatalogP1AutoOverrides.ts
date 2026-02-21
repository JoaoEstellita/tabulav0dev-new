import { TRANSIT_CATALOG_PTBR } from './transitCatalogPtBR'

type Locale = 'pt-BR' | 'en-US' | 'es-ES' | 'it-IT'

const ASPECT_KEYS = new Set([
  'conjuncao',
  'oposicao',
  'quadratura',
  'trigono',
  'sextil',
  'quincuncio',
  'semissextil',
  'semiquadratura',
  'sesquiquadratura',
  'harmonic',
  'tense',
  'neutral',
])
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
  'house_1',
  'house_2',
  'house_3',
  'house_4',
  'house_5',
  'house_6',
  'house_7',
  'house_8',
  'house_9',
  'house_10',
  'house_11',
  'house_12',
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
    quincuncio: 'quincuncio',
    semissextil: 'semissextil',
    semiquadratura: 'semiquadratura',
    sesquiquadratura: 'sesquiquadratura',
    harmonic: 'harmonico',
    tense: 'desafiador',
    neutral: 'neutro',
  },
  'en-US': {
    conjuncao: 'conjunction',
    oposicao: 'opposition',
    quadratura: 'square',
    trigono: 'trine',
    sextil: 'sextile',
    quincuncio: 'quincunx',
    semissextil: 'semisextile',
    semiquadratura: 'semisquare',
    sesquiquadratura: 'sesquiquadrate',
    harmonic: 'harmonic',
    tense: 'challenging',
    neutral: 'neutral',
  },
  'es-ES': {
    conjuncao: 'conjuncion',
    oposicao: 'oposicion',
    quadratura: 'cuadratura',
    trigono: 'trigono',
    sextil: 'sextil',
    quincuncio: 'quincuncio',
    semissextil: 'semisextil',
    semiquadratura: 'semicuadratura',
    sesquiquadratura: 'sesquicuadratura',
    harmonic: 'armonico',
    tense: 'desafiante',
    neutral: 'neutro',
  },
  'it-IT': {
    conjuncao: 'congiunzione',
    oposicao: 'opposizione',
    quadratura: 'quadratura',
    trigono: 'trigono',
    sextil: 'sestile',
    quincuncio: 'quinconce',
    semissextil: 'semisestile',
    semiquadratura: 'semiquadratura',
    sesquiquadratura: 'sesquiquadratura',
    harmonic: 'armonico',
    tense: 'sfidante',
    neutral: 'neutro',
  },
}

const ASPECT_THEME: Record<Locale, Record<string, string>> = {
  'pt-BR': {
    conjuncao: 'foco e concentracao no mesmo tema',
    oposicao: 'equilibrio entre polos de decisao',
    quadratura: 'ajuste pratico com mais exigencia',
    trigono: 'fluidez para consolidar avancos',
    sextil: 'oportunidade que pede iniciativa',
    quincuncio: 'ajuste fino de rota e expectativas',
    semissextil: 'refino discreto em pontos de detalhe',
    semiquadratura: 'friccao leve que pede calibragem',
    sesquiquadratura: 'atrito intermitente com necessidade de reposicao',
    harmonic: 'apoio de contexto para avancar com fluidez',
    tense: 'tensao produtiva que pede estrutura',
    neutral: 'observacao objetiva sem puxar extremos',
  },
  'en-US': {
    conjuncao: 'focus and concentration on the same theme',
    oposicao: 'balance between decision polarities',
    quadratura: 'practical adjustment under higher pressure',
    trigono: 'flow to consolidate progress',
    sextil: 'opportunity that depends on initiative',
    quincuncio: 'fine route and expectation adjustment',
    semissextil: 'subtle refinement of detail points',
    semiquadratura: 'light friction asking for calibration',
    sesquiquadratura: 'intermittent friction requiring repositioning',
    harmonic: 'context support to move with flow',
    tense: 'productive tension requiring structure',
    neutral: 'objective observation without extremes',
  },
  'es-ES': {
    conjuncao: 'foco y concentracion en el mismo tema',
    oposicao: 'equilibrio entre polos de decision',
    quadratura: 'ajuste practico con mayor exigencia',
    trigono: 'fluidez para consolidar avances',
    sextil: 'oportunidad que requiere iniciativa',
    quincuncio: 'ajuste fino de ruta y expectativas',
    semissextil: 'refino discreto en puntos de detalle',
    semiquadratura: 'friccion leve que pide calibracion',
    sesquiquadratura: 'friccion intermitente con necesidad de reposicion',
    harmonic: 'apoyo de contexto para avanzar con fluidez',
    tense: 'tension productiva que pide estructura',
    neutral: 'observacion objetiva sin extremos',
  },
  'it-IT': {
    conjuncao: 'focus e concentrazione sullo stesso tema',
    oposicao: 'equilibrio tra poli decisionali',
    quadratura: 'aggiustamento pratico con maggiore pressione',
    trigono: 'fluidita per consolidare progressi',
    sextil: 'opportunita che richiede iniziativa',
    quincuncio: 'aggiustamento fine di rotta e aspettative',
    semissextil: 'rifinitura discreta dei dettagli',
    semiquadratura: 'attrito leggero che richiede calibrazione',
    sesquiquadratura: 'attrito intermittente che richiede riposizionamento',
    harmonic: 'supporto di contesto per avanzare con fluidita',
    tense: 'tensione produttiva che richiede struttura',
    neutral: 'osservazione oggettiva senza estremi',
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

const PLANET_INGRESS_STYLE: Record<Locale, Record<string, string>> = {
  'pt-BR': {
    sun: 'dar direcao ao que precisa de visibilidade',
    moon: 'organizar o clima emocional e as necessidades imediatas',
    mercury: 'clarear conversas, mensagens e ajustes de rota',
    venus: 'refinar vinculos, valores e trocas com mais qualidade',
    mars: 'agir com objetividade e evitar dispersao de energia',
    jupiter: 'expandir com criterio e consolidar aprendizados',
    saturn: 'estruturar limites, prazos e rotina com maturidade',
    uranus: 'renovar padroes com liberdade e responsabilidade',
    neptune: 'combinar sensibilidade com discernimento pratico',
    pluto: 'aprofundar mudancas com consistencia e estrategia',
  },
  'en-US': {
    sun: 'bring direction to what needs visibility',
    moon: 'organize emotional climate and immediate needs',
    mercury: 'clarify conversations, messages, and course corrections',
    venus: 'refine bonds, values, and exchanges with more quality',
    mars: 'act with objectivity and avoid energy dispersion',
    jupiter: 'expand with criteria and consolidate learning',
    saturn: 'structure limits, deadlines, and routine with maturity',
    uranus: 'renew patterns with freedom and responsibility',
    neptune: 'combine sensitivity with practical discernment',
    pluto: 'deepen change with consistency and strategy',
  },
  'es-ES': {
    sun: 'dar direccion a lo que pide visibilidad',
    moon: 'ordenar el clima emocional y las necesidades inmediatas',
    mercury: 'aclarar conversaciones, mensajes y ajustes de rumbo',
    venus: 'refinar vinculos, valores e intercambios con mas calidad',
    mars: 'actuar con objetividad y evitar dispersion de energia',
    jupiter: 'expandir con criterio y consolidar aprendizajes',
    saturn: 'estructurar limites, plazos y rutina con madurez',
    uranus: 'renovar patrones con libertad y responsabilidad',
    neptune: 'combinar sensibilidad con discernimiento practico',
    pluto: 'profundizar cambios con consistencia y estrategia',
  },
  'it-IT': {
    sun: 'dare direzione a cio che richiede visibilita',
    moon: 'organizzare il clima emotivo e i bisogni immediati',
    mercury: 'chiarire conversazioni, messaggi e correzioni di rotta',
    venus: 'rifinire legami, valori e scambi con maggiore qualita',
    mars: 'agire con oggettivita evitando dispersione di energia',
    jupiter: 'espandere con criterio e consolidare apprendimenti',
    saturn: 'strutturare limiti, scadenze e routine con maturita',
    uranus: 'rinnovare schemi con liberta e responsabilita',
    neptune: 'unire sensibilita e discernimento pratico',
    pluto: 'approfondire trasformazioni con coerenza e strategia',
  },
}

const ANGLE_FOCUS: Record<Locale, Record<string, string>> = {
  'pt-BR': {
    ascendente: 'identidade, postura e forma de iniciar movimentos',
    descendente: 'vinculos, acordos e equilibrio entre necessidades',
    meio_do_ceu: 'direcao publica, carreira e reputacao',
    fundo_do_ceu: 'base emocional, lar e sustentacao interna',
  },
  'en-US': {
    ascendente: 'identity, posture, and how you initiate movement',
    descendente: 'bonds, agreements, and balance of needs',
    meio_do_ceu: 'public direction, career, and reputation',
    fundo_do_ceu: 'emotional base, home, and inner support',
  },
  'es-ES': {
    ascendente: 'identidad, postura y forma de iniciar movimientos',
    descendente: 'vinculos, acuerdos y equilibrio de necesidades',
    meio_do_ceu: 'direccion publica, carrera y reputacion',
    fundo_do_ceu: 'base emocional, hogar y sosten interno',
  },
  'it-IT': {
    ascendente: 'identita, postura e modo di iniziare le azioni',
    descendente: 'legami, accordi ed equilibrio dei bisogni',
    meio_do_ceu: 'direzione pubblica, carriera e reputazione',
    fundo_do_ceu: 'base emotiva, casa e sostegno interiore',
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
  const theme = ASPECT_THEME[locale][parsed.aspect]
  if (!planet || !aspect || !theme) return null
  const houseTarget = getIngressHouse(parsed.target)
  const target =
    houseTarget != null
      ? locale === 'en-US'
        ? `House ${houseTarget}`
        : `Casa ${houseTarget}`
      : TARGET_LABELS[locale][parsed.target]
  if (!target) return null
  const angleFocus = houseTarget == null ? ANGLE_FOCUS[locale][parsed.target] : null
  const houseFocus = houseTarget != null ? HOUSE_FOCUS[locale][houseTarget] : null
  const targetFocus =
    angleFocus ||
    houseFocus ||
    (locale === 'pt-BR'
      ? `dinamica simbolizada por ${target}`
      : locale === 'en-US'
        ? `theme represented by ${target}`
        : locale === 'es-ES'
          ? `dinamica simbolizada por ${target}`
          : `dinamica rappresentata da ${target}`)

  const planetStyle = PLANET_INGRESS_STYLE[locale][parsed.planet]
  if (locale === 'pt-BR') {
    return `${planet} em ${aspect} com ${target} ativa uma fase de ${theme}. Este aspecto enfatiza ${targetFocus} e pede decisao mais consciente no ritmo atual. Vale direcionar a fase para ${planetStyle}, mantendo consistencia sem excesso de reacao.`
  }
  if (locale === 'en-US') {
    return `${planet} in ${aspect} with ${target} activates a phase of ${theme}. This aspect highlights ${targetFocus} and asks for more conscious decisions in the current rhythm. Use the phase to ${planetStyle}, with consistency and less reactivity.`
  }
  if (locale === 'es-ES') {
    return `${planet} en ${aspect} con ${target} activa una fase de ${theme}. Este aspecto enfatiza ${targetFocus} y pide decisiones mas conscientes en el ritmo actual. Conviene orientar la fase para ${planetStyle}, con consistencia y menos reaccion.`
  }
  return `${planet} in ${aspect} con ${target} attiva una fase di ${theme}. Questo aspetto evidenzia ${targetFocus} e richiede decisioni piu consapevoli nel ritmo attuale. Conviene orientare la fase a ${planetStyle}, con coerenza e meno reattivita.`
}

function buildIngressOverride(locale: Locale, key: string): string | null {
  const parsed = parseTransitKey(key)
  if (!parsed) return null
  const house = getIngressHouse(parsed.target)
  if (!house) return null
  const planet = PLANET_LABELS[locale][parsed.planet]
  const focus = HOUSE_FOCUS[locale][house]
  const style = PLANET_INGRESS_STYLE[locale][parsed.planet]
  if (!planet || !focus || !style) return null

  if (locale === 'pt-BR') {
    return `${planet} em ingresso na Casa ${house} destaca temas de ${focus}. A passagem tende a favorecer ${style}, com ajuste gradual de prioridade. Foque em uma acao concreta ligada a esta casa e acompanhe o efeito no cotidiano.`
  }
  if (locale === 'en-US') {
    return `${planet} entering House ${house} highlights themes of ${focus}. This passage tends to support ${style}, with gradual priority adjustment. Focus on one concrete action tied to this house and track its daily effect.`
  }
  if (locale === 'es-ES') {
    return `${planet} en ingreso en Casa ${house} destaca temas de ${focus}. Este paso tiende a favorecer ${style}, con ajuste gradual de prioridades. Enfoca una accion concreta vinculada a esta casa y observa su efecto diario.`
  }
  return `${planet} in ingresso in Casa ${house} evidenzia temi di ${focus}. Questo passaggio tende a favorire ${style}, con un aggiustamento graduale delle priorita. Concentrati su un azione concreta legata a questa casa e osservane l effetto quotidiano.`
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
