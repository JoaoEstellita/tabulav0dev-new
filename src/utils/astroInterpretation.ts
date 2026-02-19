import { normalizeLanguage, type AppLanguage } from '../i18n/appI18n'
import { isInterpretationV2Enabled } from './featureFlags'
import {
  buildTransitInterpretationV2,
  type TransitInterpretationV2,
} from './transitInterpretationV2'
import { TRANSIT_CATALOG_PTBR } from '../data/transitCatalogPtBR'

type AnyTransit = Record<string, any>

const TARGET_ALIASES_TO_CANONICAL: Record<string, string> = {
  sun: 'sun',
  moon: 'moon',
  mercury: 'mercury',
  venus: 'venus',
  mars: 'mars',
  jupiter: 'jupiter',
  saturn: 'saturn',
  uranus: 'uranus',
  neptune: 'neptune',
  pluto: 'pluto',
  ascendente: 'ascendente',
  ascendant: 'ascendente',
  asc: 'ascendente',
  as: 'ascendente',
  meio_do_ceu: 'meio_do_ceu',
  meio_do_céu: 'meio_do_ceu',
  medio_cielo: 'meio_do_ceu',
  midheaven: 'meio_do_ceu',
  mc: 'meio_do_ceu',
  ic: 'fundo_do_ceu',
  fundo_do_ceu: 'fundo_do_ceu',
  fundo_do_céu: 'fundo_do_ceu',
  imum_coeli: 'fundo_do_ceu',
  dsc: 'descendente',
  descendant: 'descendente',
  descendente: 'descendente',
  dc: 'descendente',
}

const PLANET_SYMBOLISM: Record<string, string> = {
  Sun: 'identidade, direcao e vitalidade',
  Moon: 'emocao, seguranca e habitos',
  Mercury: 'comunicacao, pensamento e trocas',
  Venus: 'vinculos, prazer e valores',
  Mars: 'iniciativa, acao e assertividade',
  Jupiter: 'expansao, sentido e oportunidades',
  Saturn: 'estrutura, limite e responsabilidade',
  Uranus: 'mudanca, autonomia e ruptura de padrao',
  Neptune: 'sensibilidade, idealizacao e intuicao',
  Pluto: 'transformacao, poder e depuracao',
}

const PLANET_PT: Record<string, string> = {
  Sun: 'Sol',
  Moon: 'Lua',
  Mercury: 'Mercurio',
  Venus: 'Venus',
  Mars: 'Marte',
  Jupiter: 'Jupiter',
  Saturn: 'Saturno',
  Uranus: 'Urano',
  Neptune: 'Netuno',
  Pluto: 'Plutao',
}

const PLANET_LABELS: Record<AppLanguage, Record<string, string>> = {
  'pt-BR': PLANET_PT,
  'en-US': {
    Sun: 'Sun', Moon: 'Moon', Mercury: 'Mercury', Venus: 'Venus', Mars: 'Mars',
    Jupiter: 'Jupiter', Saturn: 'Saturn', Uranus: 'Uranus', Neptune: 'Neptune', Pluto: 'Pluto',
  },
  'es-ES': {
    Sun: 'Sol', Moon: 'Luna', Mercury: 'Mercurio', Venus: 'Venus', Mars: 'Marte',
    Jupiter: 'Jupiter', Saturn: 'Saturno', Uranus: 'Urano', Neptune: 'Neptuno', Pluto: 'Pluton',
  },
  'it-IT': {
    Sun: 'Sole', Moon: 'Luna', Mercury: 'Mercurio', Venus: 'Venere', Mars: 'Marte',
    Jupiter: 'Giove', Saturn: 'Saturno', Uranus: 'Urano', Neptune: 'Nettuno', Pluto: 'Plutone',
  },
}

const HOUSE_SYMBOLISM: Record<number, string> = {
  1: 'postura, corpo e modo de iniciar',
  2: 'recursos, valores e estabilidade material',
  3: 'comunicacao, estudo e deslocamentos',
  4: 'base emocional, lar e pertencimento',
  5: 'afeto, criatividade e expressao pessoal',
  6: 'rotina, trabalho diario e saude funcional',
  7: 'parcerias, contratos e espelhamento relacional',
  8: 'intimidade, partilha e transformacoes profundas',
  9: 'sentido, visao de mundo e aprendizado amplo',
  10: 'carreira, reputacao e direcao publica',
  11: 'redes, projetos coletivos e futuro',
  12: 'fechamentos, recolhimento e elaboracao interna',
}

const HOUSE_SYMBOLISM_EN: Record<number, string> = {
  1: 'posture, body and way of initiating',
  2: 'resources, values and material stability',
  3: 'communication, study and short movement',
  4: 'emotional base, home and belonging',
  5: 'affection, creativity and personal expression',
  6: 'routine, daily work and functional health',
  7: 'partnerships, agreements and relational mirroring',
  8: 'intimacy, sharing and deep transformation',
  9: 'meaning, worldview and broad learning',
  10: 'career, reputation and public direction',
  11: 'networks, collective projects and future',
  12: 'closures, retreat and inner processing',
}

const HOUSE_SYMBOLISM_ES: Record<number, string> = {
  1: 'postura, cuerpo y modo de iniciar',
  2: 'recursos, valores y estabilidad material',
  3: 'comunicacion, estudio y desplazamientos',
  4: 'base emocional, hogar y pertenencia',
  5: 'afecto, creatividad y expresion personal',
  6: 'rutina, trabajo diario y salud funcional',
  7: 'vinculos, acuerdos y espejo relacional',
  8: 'intimidad, intercambio y transformaciones profundas',
  9: 'sentido, vision del mundo y aprendizaje amplio',
  10: 'carrera, reputacion y direccion publica',
  11: 'redes, proyectos colectivos y futuro',
  12: 'cierres, recogimiento y elaboracion interna',
}

const HOUSE_SYMBOLISM_IT: Record<number, string> = {
  1: 'postura, corpo e modo di iniziare',
  2: 'risorse, valori e stabilita materiale',
  3: 'comunicazione, studio e spostamenti',
  4: 'base emotiva, casa e appartenenza',
  5: 'affetto, creativita ed espressione personale',
  6: 'routine, lavoro quotidiano e salute funzionale',
  7: 'relazioni, accordi e specchio relazionale',
  8: 'intimita, condivisione e trasformazioni profonde',
  9: 'senso, visione del mondo e apprendimento ampio',
  10: 'carriera, reputazione e direzione pubblica',
  11: 'reti, progetti collettivi e futuro',
  12: 'chiusure, ritiro ed elaborazione interiore',
}

const HOUSE_POSITIONAL_FOCUS: Record<AppLanguage, Record<number, string>> = {
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
    1: 'self-image, physical energy and initiative',
    2: 'resources, material safety and personal value',
    3: 'practical communication, studies and short agreements',
    4: 'emotional foundation, family and home structure',
    5: 'affection expression, creativity and joy',
    6: 'routine, method and daily organization',
    7: 'relationships, agreements and alignment with others',
    8: 'intimacy, shared resources and inner transformation',
    9: 'long-range vision, meaning and learning',
    10: 'career, reputation and public direction',
    11: 'support network, collaboration and future goals',
    12: 'closures, rest and pattern release',
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

const ASPECT_MEANING: Record<string, string> = {
  conjuncao: 'concentracao forte de energia no mesmo tema',
  oposicao: 'polaridade que pede equilibrio entre extremos',
  quadratura: 'tensao de ajuste pratico e decisao',
  trigono: 'fluxo mais natural de recursos e talentos',
  sextil: 'abertura de oportunidade que depende de iniciativa',
  quincuncio: 'desalinhamento fino que pede ajuste consciente',
  semissextil: 'ajuste sutil por observacao e refinamento',
  semiquadratura: 'irritacao leve que sinaliza ponto de ajuste',
  sesquiquadratura: 'atrito intermitente que pede reposicionamento',
  harmonic: 'fase de apoio e fluidez relativa',
  tense: 'fase de friccao e necessidade de ajuste',
  neutral: 'fase de observacao, sem puxar para extremos',
  ingress: 'mudanca de foco por troca de casa/ambiente',
}

const ASPECT_ARCHETYPE: Record<string, string> = {
  conjuncao: 'foco',
  oposicao: 'equilibrio',
  quadratura: 'ajuste',
  trigono: 'fluidez',
  sextil: 'oportunidade',
  quincuncio: 'recalibracao',
  semissextil: 'refino',
  semiquadratura: 'friccao',
  sesquiquadratura: 'reposicionamento',
  harmonic: 'suporte',
  tense: 'tensao',
  neutral: 'observacao',
  ingress: 'mudanca de fase',
}

const ASPECT_LABELS: Record<AppLanguage, Record<string, string>> = {
  'pt-BR': {
    conjuncao: 'conjuncao', oposicao: 'oposicao', quadratura: 'quadratura', trigono: 'trigono',
    sextil: 'sextil', quincuncio: 'quincuncio', semissextil: 'semissextil', semiquadratura: 'semiquadratura',
    sesquiquadratura: 'sesquiquadratura', harmonic: 'harmonico', tense: 'desafiador', neutral: 'neutro', ingress: 'ingresso',
  },
  'en-US': {
    conjuncao: 'conjunction', oposicao: 'opposition', quadratura: 'square', trigono: 'trine',
    sextil: 'sextile', quincuncio: 'quincunx', semissextil: 'semisextile', semiquadratura: 'semisquare',
    sesquiquadratura: 'sesquiquadrate', harmonic: 'harmonic', tense: 'challenging', neutral: 'neutral', ingress: 'ingress',
  },
  'es-ES': {
    conjuncao: 'conjuncion', oposicao: 'oposicion', quadratura: 'cuadratura', trigono: 'trigono',
    sextil: 'sextil', quincuncio: 'quincuncio', semissextil: 'semisextil', semiquadratura: 'semicuadratura',
    sesquiquadratura: 'sesquicuadratura', harmonic: 'armonico', tense: 'desafiante', neutral: 'neutro', ingress: 'ingreso',
  },
  'it-IT': {
    conjuncao: 'congiunzione', oposicao: 'opposizione', quadratura: 'quadratura', trigono: 'trigono',
    sextil: 'sestile', quincuncio: 'quinconce', semissextil: 'semisestile', semiquadratura: 'semiquadratura',
    sesquiquadratura: 'sesquiquadratura', harmonic: 'armonico', tense: 'sfidante', neutral: 'neutro', ingress: 'ingresso',
  },
}

const ASPECT_MEANING_I18N: Record<AppLanguage, Record<string, string>> = {
  'pt-BR': ASPECT_MEANING,
  'en-US': {
    conjuncao: 'strong concentration of energy on the same theme',
    oposicao: 'polarity asking for balance between extremes',
    quadratura: 'practical tension requiring decisions and adjustment',
    trigono: 'more natural flow of resources and talents',
    sextil: 'opportunity opening that depends on initiative',
    quincuncio: 'fine misalignment requiring conscious recalibration',
    semissextil: 'subtle adjustment through observation and refinement',
    semiquadratura: 'light irritation signaling an adjustment point',
    sesquiquadratura: 'intermittent friction requiring repositioning',
    harmonic: 'phase of support and relative flow',
    tense: 'phase of friction and need for adjustment',
    neutral: 'observation phase, not pushing extremes',
    ingress: 'focus shift due to house/environment change',
  },
  'es-ES': {
    conjuncao: 'concentracion fuerte de energia en el mismo tema',
    oposicao: 'polaridad que pide equilibrio entre extremos',
    quadratura: 'tension de ajuste practico y decision',
    trigono: 'flujo mas natural de recursos y talentos',
    sextil: 'apertura de oportunidad que depende de iniciativa',
    quincuncio: 'desalineacion fina que pide ajuste consciente',
    semissextil: 'ajuste sutil por observacion y refinamiento',
    semiquadratura: 'irritacion leve que senala punto de ajuste',
    sesquiquadratura: 'friccion intermitente que pide reposicionamiento',
    harmonic: 'fase de apoyo y fluidez relativa',
    tense: 'fase de friccion y necesidad de ajuste',
    neutral: 'fase de observacion, sin extremos',
    ingress: 'cambio de foco por cambio de casa/ambiente',
  },
  'it-IT': {
    conjuncao: 'forte concentrazione di energia sullo stesso tema',
    oposicao: 'polarita che richiede equilibrio tra estremi',
    quadratura: 'tensione di aggiustamento pratico e decisione',
    trigono: 'flusso piu naturale di risorse e talenti',
    sextil: 'apertura di opportunita che dipende dall iniziativa',
    quincuncio: 'disallineamento fine che richiede ricalibrazione consapevole',
    semissextil: 'aggiustamento sottile tramite osservazione e rifinitura',
    semiquadratura: 'irritazione lieve che segnala punto di aggiustamento',
    sesquiquadratura: 'attrito intermittente che richiede riposizionamento',
    harmonic: 'fase di supporto e fluidita relativa',
    tense: 'fase di attrito e bisogno di aggiustamento',
    neutral: 'fase di osservazione, senza estremi',
    ingress: 'cambio di focus per cambio casa/ambiente',
  },
}

const ASPECT_ARCHETYPE_I18N: Record<AppLanguage, Record<string, string>> = {
  'pt-BR': ASPECT_ARCHETYPE,
  'en-US': {
    conjuncao: 'focus', oposicao: 'balance', quadratura: 'adjustment', trigono: 'flow',
    sextil: 'opportunity', quincuncio: 'recalibration', semissextil: 'refinement',
    semiquadratura: 'friction', sesquiquadratura: 'repositioning', harmonic: 'support',
    tense: 'tension', neutral: 'observation', ingress: 'phase shift',
  },
  'es-ES': {
    conjuncao: 'foco', oposicao: 'equilibrio', quadratura: 'ajuste', trigono: 'fluidez',
    sextil: 'oportunidad', quincuncio: 'recalibracion', semissextil: 'refino',
    semiquadratura: 'friccion', sesquiquadratura: 'reposicionamiento', harmonic: 'soporte',
    tense: 'tension', neutral: 'observacion', ingress: 'cambio de fase',
  },
  'it-IT': {
    conjuncao: 'focus', oposicao: 'equilibrio', quadratura: 'aggiustamento', trigono: 'fluidita',
    sextil: 'opportunita', quincuncio: 'ricalibrazione', semissextil: 'rifinitura',
    semiquadratura: 'attrito', sesquiquadratura: 'riposizionamento', harmonic: 'supporto',
    tense: 'tensione', neutral: 'osservazione', ingress: 'cambio fase',
  },
}

function getAspectLabel(aspectKey: string, lang: AppLanguage): string {
  return ASPECT_LABELS[lang][aspectKey] || ASPECT_LABELS['pt-BR'][aspectKey] || aspectKey
}

function getAspectMeaning(aspectKey: string, lang: AppLanguage): string {
  return ASPECT_MEANING_I18N[lang][aspectKey] || ASPECT_MEANING[aspectKey] || 'movimento de ajuste em curso'
}

function getAspectArchetype(aspectKey: string, lang: AppLanguage): string {
  return ASPECT_ARCHETYPE_I18N[lang][aspectKey] || ASPECT_ARCHETYPE[aspectKey] || aspectKey
}

const I18N = {
  'pt-BR': {
    areaDefault: 'area de vida',
    yourNatalChart: 'seu mapa natal',
    transitWord: 'Transito',
    houseWord: 'Casa',
    practicalActionPrefix: 'Acao pratica: ',
    technicalPrefix: 'Leitura tecnica',
    technicalBasePrefix: 'Base tecnica',
    technicalFundamentPrefix: 'Fundamento tecnico',
    currentPositionPrefix: 'Posicao atual',
    activatedTargetPrefix: 'Alvo ativado',
    focusedAspectPrefix: 'Aspecto em foco',
    phasePrefix: 'Fase temporal',
    practicalApplicationPrefix: 'Aplicacao pratica',
    practicalDirectionPrefix: 'Direcionamento pratico',
    recommendedUsePrefix: 'Uso recomendado',
    scoreLinkPrefix: 'Leitura pratica',
    phases: {
      peak: 'em pico',
      start: 'em aproximacao',
      end: 'afastando',
      applying: 'em aproximacao',
      movingAway: 'afastando',
      active: 'em andamento',
    },
    direct: {
      ingress: '{planet} ingressa na {houseLabel} {house}, ativando {houseMeaning}. {phaseLabel}, isso {phaseVerb} prioridades em {area}.',
      houseNeutral: '{planet} na {houseLabel} {house} ativa {houseMeaning}. {phaseLabel}, isso {flowVerb} ajuste de ritmo em {area}.',
      aspect: '{planet} em {aspectKey} com {targetLabel} indica {aspectMeaning}. {phaseLabel}, {phaseBridge} o foco recai em {area}.',
      fallback: '{planet} ativa um ciclo de ajustes praticos em {area}.',
    },
  },
  'en-US': {
    areaDefault: 'life area',
    yourNatalChart: 'your natal chart',
    transitWord: 'Transit',
    houseWord: 'House',
    practicalActionPrefix: 'Practical action: ',
    technicalPrefix: 'Technical reading',
    technicalBasePrefix: 'Technical base',
    technicalFundamentPrefix: 'Technical foundation',
    currentPositionPrefix: 'Current position',
    activatedTargetPrefix: 'Activated target',
    focusedAspectPrefix: 'Focused aspect',
    phasePrefix: 'Timing phase',
    practicalApplicationPrefix: 'Practical application',
    practicalDirectionPrefix: 'Practical direction',
    recommendedUsePrefix: 'Recommended use',
    scoreLinkPrefix: 'Practical reading',
    phases: {
      peak: 'at peak',
      start: 'approaching',
      end: 'moving away',
      applying: 'approaching',
      movingAway: 'moving away',
      active: 'in progress',
    },
    direct: {
      ingress: '{planet} enters {houseLabel} {house}, activating {houseMeaning}. {phaseLabel}, this {phaseVerb} priorities in {area}.',
      houseNeutral: '{planet} in {houseLabel} {house} activates {houseMeaning}. {phaseLabel}, this {flowVerb} pace adjustment in {area}.',
      aspect: '{planet} in {aspectKey} with {targetLabel} indicates {aspectMeaning}. {phaseLabel}, {phaseBridge} focus lands on {area}.',
      fallback: '{planet} activates a practical adjustment cycle in {area}.',
    },
  },
  'es-ES': {
    areaDefault: 'area de vida',
    yourNatalChart: 'tu carta natal',
    transitWord: 'Transito',
    houseWord: 'Casa',
    practicalActionPrefix: 'Accion practica: ',
    technicalPrefix: 'Lectura tecnica',
    technicalBasePrefix: 'Base tecnica',
    technicalFundamentPrefix: 'Fundamento tecnico',
    currentPositionPrefix: 'Posicion actual',
    activatedTargetPrefix: 'Objetivo activado',
    focusedAspectPrefix: 'Aspecto en foco',
    phasePrefix: 'Fase temporal',
    practicalApplicationPrefix: 'Aplicacion practica',
    practicalDirectionPrefix: 'Direccion practica',
    recommendedUsePrefix: 'Uso recomendado',
    scoreLinkPrefix: 'Lectura practica',
    phases: {
      peak: 'en pico',
      start: 'en aproximacion',
      end: 'alejandose',
      applying: 'en aproximacion',
      movingAway: 'alejandose',
      active: 'en curso',
    },
    direct: {
      ingress: '{planet} ingresa en {houseLabel} {house}, activando {houseMeaning}. {phaseLabel}, esto {phaseVerb} prioridades en {area}.',
      houseNeutral: '{planet} en {houseLabel} {house} activa {houseMeaning}. {phaseLabel}, esto {flowVerb} ajuste de ritmo en {area}.',
      aspect: '{planet} en {aspectKey} con {targetLabel} indica {aspectMeaning}. {phaseLabel}, {phaseBridge} el foco recae en {area}.',
      fallback: '{planet} activa un ciclo de ajustes practicos en {area}.',
    },
  },
  'it-IT': {
    areaDefault: 'area di vita',
    yourNatalChart: 'tema natale',
    transitWord: 'Transito',
    houseWord: 'Casa',
    practicalActionPrefix: 'Azione pratica: ',
    technicalPrefix: 'Lettura tecnica',
    technicalBasePrefix: 'Base tecnica',
    technicalFundamentPrefix: 'Fondamento tecnico',
    currentPositionPrefix: 'Posizione attuale',
    activatedTargetPrefix: 'Target attivato',
    focusedAspectPrefix: 'Aspetto in focus',
    phasePrefix: 'Fase temporale',
    practicalApplicationPrefix: 'Applicazione pratica',
    practicalDirectionPrefix: 'Direzione pratica',
    recommendedUsePrefix: 'Uso consigliato',
    scoreLinkPrefix: 'Lettura pratica',
    phases: {
      peak: 'al picco',
      start: 'in avvicinamento',
      end: 'in allontanamento',
      applying: 'in avvicinamento',
      movingAway: 'in allontanamento',
      active: 'in corso',
    },
    direct: {
      ingress: '{planet} entra in {houseLabel} {house}, attivando {houseMeaning}. {phaseLabel}, questo {phaseVerb} priorita in {area}.',
      houseNeutral: '{planet} in {houseLabel} {house} attiva {houseMeaning}. {phaseLabel}, questo {flowVerb} il ritmo in {area}.',
      aspect: '{planet} in {aspectKey} con {targetLabel} indica {aspectMeaning}. {phaseLabel}, {phaseBridge} il focus ricade su {area}.',
      fallback: '{planet} attiva un ciclo di aggiustamenti pratici in {area}.',
    },
  },
} as const

function getLang(language?: string | null): AppLanguage {
  return normalizeLanguage(language)
}

function interpolate(template: string, vars: Record<string, string | number | null | undefined>) {
  return Object.keys(vars).reduce(
    (acc, key) => acc.replace(new RegExp(`\\{${key}\\}`, 'g'), String(vars[key] ?? '')),
    template
  )
}

function getHouseSymbolism(language: AppLanguage, house: number): string {
  if (language === 'en-US') return HOUSE_SYMBOLISM_EN[house] || HOUSE_SYMBOLISM[house] || ''
  if (language === 'es-ES') return HOUSE_SYMBOLISM_ES[house] || HOUSE_SYMBOLISM[house] || ''
  if (language === 'it-IT') return HOUSE_SYMBOLISM_IT[house] || HOUSE_SYMBOLISM[house] || ''
  return HOUSE_SYMBOLISM[house] || ''
}

function getHousePositionalFocus(language: AppLanguage, house: number): string {
  return HOUSE_POSITIONAL_FOCUS[language]?.[house]
    || HOUSE_POSITIONAL_FOCUS['pt-BR']?.[house]
    || ''
}

function normalizeAspect(value: unknown): string {
  const raw = String(value || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
  if (!raw) return ''
  if (raw.includes('trigono') || raw.includes('trine')) return 'trigono'
  if (raw.includes('sesquiquadr')) return 'sesquiquadratura'
  if (raw.includes('semiquadr')) return 'semiquadratura'
  if (raw.includes('semissext') || raw.includes('semisext')) return 'semissextil'
  if (raw.includes('sext')) return 'sextil'
  if (raw.includes('quadr')) return 'quadratura'
  if (raw.includes('opos')) return 'oposicao'
  if (raw.includes('quinc')) return 'quincuncio'
  if (raw.includes('conj')) return 'conjuncao'
  if (raw.includes('harmon')) return 'harmonic'
  if (raw.includes('tense') || raw.includes('desafi')) return 'tense'
  if (raw.includes('neutral') || raw.includes('neutro')) return 'neutral'
  if (raw.includes('ingress')) return 'ingress'
  return raw
}

function getHouseNumber(transit: AnyTransit): number | null {
  const candidates = [
    transit?.target?.house,
    transit?.house,
    transit?.transitHouse,
    transit?.natalHouseImpacted,
    transit?.natalHouse,
  ]
  for (const candidate of candidates) {
    const n = Number(candidate)
    if (Number.isFinite(n) && n >= 1 && n <= 12) return Math.round(n)
  }
  const target = String(transit?.natalPlanet || transit?.target?.natalPlanet || '').toUpperCase()
  const match = target.match(/^HOUSE_(\d{1,2})$/)
  if (!match) return null
  const n = Number(match[1])
  if (!Number.isFinite(n) || n < 1 || n > 12) return null
  return n
}

function getTargetLabel(transit: AnyTransit, language?: string | null): string {
  const lang = getLang(language)
  const house = getHouseNumber(transit)
  if (house) return `${I18N[lang].houseWord} ${house}`
  const target = transit?.natalPlanet || transit?.target?.natalPlanet || transit?.target?.angle || transit?.natalPoint
  if (!target) return I18N[lang].yourNatalChart
  const raw = String(target)
  return PLANET_LABELS[lang][raw] || PLANET_PT[raw] || raw
}

function getPlanetArchetypeWord(planetRaw: string): string {
  const content = PLANET_SYMBOLISM[planetRaw] || ''
  return content.split(',')[0]?.trim() || 'movimento'
}

export function buildArchetypeKeywordsForTransit(
  transit: AnyTransit,
  areaLabel?: string | null,
  language?: string | null
): string[] {
  const lang = getLang(language)
  const out: string[] = []
  const add = (value?: string | null) => {
    const token = String(value || '').trim()
    if (!token) return
    const normalized = token
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
    if (!out.some((item) => item
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') === normalized)) out.push(token)
  }

  const transitPlanetRaw = String(transit?.transitPlanet || '').trim()
  const aspectKey = normalizeAspect(transit?.aspectName || transit?.type || transit?.aspect || transit?.aspectType)
  const house = getHouseNumber(transit)
  const targetRaw = String(transit?.natalPlanet || transit?.target?.natalPlanet || '').trim()

  add(getPlanetArchetypeWord(transitPlanetRaw))
  add(getAspectArchetype(aspectKey, lang))
  if (targetRaw && PLANET_SYMBOLISM[targetRaw]) add(getPlanetArchetypeWord(targetRaw))
  if (house) {
    const houseMeaning = getHouseSymbolism(lang, house)
    add(houseMeaning.split(',')[0]?.trim() || `${I18N[lang].houseWord} ${house}`)
  }
  add(areaLabel || null)

  return out.slice(0, 5)
}

function buildSeed(transit: AnyTransit): number {
  const raw = [
    transit?.id,
    transit?.transitPlanet,
    transit?.aspectName || transit?.type || transit?.aspect,
    transit?.natalPlanet || transit?.target?.natalPlanet || transit?.target?.angle || transit?.natalPoint,
    transit?.house || transit?.target?.house || transit?.transitHouse,
    transit?.phase,
  ]
    .filter(Boolean)
    .join('|')
  let hash = 0
  for (let i = 0; i < raw.length; i += 1) {
    hash = ((hash << 5) - hash + raw.charCodeAt(i)) | 0
  }
  return Math.abs(hash)
}

function normalizePhase(value: unknown): string {
  const phase = String(value || '').trim().toLowerCase()
  if (!phase) return 'active'
  if (['start', 'begin', 'initial', 'inicio', 'início'].includes(phase)) return 'start'
  if (['peak', 'pico', 'exact', 'exato', 'exacto'].includes(phase)) return 'peak'
  if (['end', 'finish', 'ending', 'fim', 'final'].includes(phase)) return 'end'
  return phase
}

function resolveCanonicalTransitTarget(transit: AnyTransit): { type: 'planet' | 'angle' | 'house' | 'unknown'; value: string } {
  const house = getHouseNumber(transit)
  if (house && normalizeAspect(transit?.aspectName || transit?.type || transit?.aspect || transit?.aspectType) === 'ingress') {
    return { type: 'house', value: `house_${house}` }
  }

  const rawTarget = normalizeTransitToken(
    transit?.natalPlanet
    || transit?.target?.natalPlanet
    || transit?.target?.angle
    || transit?.natalPoint
  )
  const canonical = TARGET_ALIASES_TO_CANONICAL[rawTarget] || rawTarget
  if (!canonical) return { type: 'unknown', value: 'unknown' }
  if (canonical.startsWith('house_')) return { type: 'house', value: canonical }
  if (['ascendente', 'meio_do_ceu', 'fundo_do_ceu', 'descendente', 'asc', 'mc', 'ic', 'dc'].includes(canonical)) {
    return { type: 'angle', value: canonical }
  }
  return { type: 'planet', value: canonical }
}

function buildCanonicalTransitKey(transit: AnyTransit): string {
  const planet = normalizeTransitToken(transit?.transitPlanet) || 'unknown_planet'
  const aspect = normalizeAspect(transit?.aspectName || transit?.type || transit?.aspect || transit?.aspectType) || 'neutral'
  const target = resolveCanonicalTransitTarget(transit)
  const house = getHouseNumber(transit)
  const phase = normalizePhase(transit?.phase)
  const parts = [
    planet,
    aspect,
    `${target.type}:${target.value}`,
    house ? `h${house}` : '',
    phase ? `phase:${phase}` : '',
  ].filter(Boolean)
  return `transit:${parts.join('|')}`
}

function normalizeTransitToken(value: unknown): string {
  return String(value || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, '_')
}

function buildCatalogTransitKey(transit: AnyTransit): string | null {
  const planet = normalizeTransitToken(transit?.transitPlanet)
  const aspect = normalizeAspect(transit?.aspectName || transit?.type || transit?.aspect || transit?.aspectType)
  if (!planet || !aspect) return null

  if (aspect === 'ingress') {
    const houseNumber = getHouseNumber(transit)
    if (!houseNumber || houseNumber < 1 || houseNumber > 12) return null
    return `transit:${planet}|ingress|house_${houseNumber}`
  }

  const target = resolveCanonicalTransitTarget(transit)
  if (target.type === 'unknown') return null
  return `transit:${planet}|${aspect}|${target.value}`
}

function sanitizeCatalogText(value: string): string {
  const countToken = (text: string, token: string): number => {
    if (!token) return 0
    return String(text).split(token).length - 1
  }

  const catalogCorruptionScore = (input: string): number => {
    const s = String(input || '')
    const replacement = countToken(s, '\uFFFD')
    const mojibake =
      countToken(s, '\u00C3')
      + countToken(s, '\u00C2')
      + countToken(s, '\u00E2\u20AC')
    return replacement * 4 + mojibake
  }

  const isCatalogTextReliable = (input: string): boolean => {
    const text = String(input || '').trim()
    if (!text || text.length < 50) return false
    if (catalogCorruptionScore(text) > 1) return false
    const alpha = (text.match(/[A-Za-z]/g) || []).length
    return alpha / text.length >= 0.45
  }

  const fixMojibake = (input: string): string => {
    const bytes = new Uint8Array(Array.from(input).map((ch) => ch.charCodeAt(0) & 0xff))
    const rescued = new TextDecoder('utf-8', { fatal: false }).decode(bytes)
    return catalogCorruptionScore(rescued) < catalogCorruptionScore(input) ? rescued : input
  }

  const replacements: Array<[RegExp, string]> = [
    [/\bvai acontecer\b/gi, 'tende a acontecer'],
    [/\bcom certeza\b/gi, 'com boa chance'],
    [/\binevitavel\b/gi, 'mais provavel'],
    [/\bgarantid[oa]\b/gi, 'favorecido'],
    [/\bstatus quo\b/gi, 'padrao atual'],
  ]
  let out = fixMojibake(String(value || ''))
  for (const [pattern, replacement] of replacements) {
    out = out.replace(pattern, replacement)
  }
  const sanitized = sanitizeNarrativeText(out)
  if (!isCatalogTextReliable(sanitized)) return ''
  return sanitized
}

function resolveCatalogTransitText(transit: AnyTransit, language?: string | null): string | null {
  const lang = getLang(language)
  if (lang !== 'pt-BR') return null
  const key = buildCatalogTransitKey(transit)
  if (!key) return null
  const entry = TRANSIT_CATALOG_PTBR[key]
  if (!entry?.text) return null
  const sanitized = sanitizeCatalogText(entry.text)
  return sanitized || null
}

function pickVariant(seed: number, options: string[], offset = 0): string {
  if (!options.length) return ''
  return options[(seed + offset) % options.length]
}

function getAreaLabel(areaLabel?: string | null, language?: string | null): string {
  const lang = getLang(language)
  const value = String(areaLabel || '')
    .trim()
    .replace(/\bstatus\b/gi, '')
    .replace(/\bestado\b/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim()
  if (!value) return I18N[lang].areaDefault
  return value.toLowerCase()
}

function normalizeAreaKey(value?: string | null): string {
  return String(value || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function getAreaContextTone(areaLabel?: string | null, language?: string | null): string {
  const lang = getLang(language)
  const key = normalizeAreaKey(areaLabel)

  const areaMapPt: Record<string, string> = {
    amor: 'No plano relacional, o momento exige qualidade de presenca e acordos claros.',
    carreira: 'No plano profissional, o momento favorece estrategia, consistencia e escolha de prioridades.',
    financas: 'No plano financeiro, o momento pede criterio, previsibilidade e decisao sem impulso.',
    familia: 'No plano familiar, o momento pede ajuste de limites e combinados mais objetivos.',
    saude: 'No plano de saude e rotina, o momento pede regularidade e leitura realista dos sinais do corpo.',
    espiritualidade: 'No plano espiritual, o momento favorece pratica simples, constancia e discernimento.',
    comunicacao: 'No plano da comunicacao, o momento pede precisao de linguagem e revisao antes de concluir.',
    transformacao: 'No plano de transformacao, o momento favorece cortes conscientes e reorganizacao progressiva.',
  }

  const areaMapEn: Record<string, string> = {
    amor: 'In relationships, this phase calls for presence quality and clear agreements.',
    carreira: 'In career matters, this phase supports strategy, consistency, and priority choices.',
    financas: 'In finances, this phase asks for criteria, predictability, and non-impulsive decisions.',
    familia: 'In family dynamics, this phase asks for boundary adjustments and clearer agreements.',
    saude: 'In health and routine, this phase asks for regularity and realistic body-signal reading.',
    espiritualidade: 'In spirituality, this phase supports simple practice, consistency, and discernment.',
    comunicacao: 'In communication, this phase asks for precise wording and review before closing.',
    transformacao: 'In transformation themes, this phase supports conscious cuts and progressive reorganization.',
  }

  const areaMapEs: Record<string, string> = {
    amor: 'En lo relacional, este momento pide calidad de presencia y acuerdos claros.',
    carreira: 'En lo profesional, este momento favorece estrategia, consistencia y prioridades claras.',
    financas: 'En finanzas, este momento pide criterio, previsibilidad y decisiones sin impulso.',
    familia: 'En lo familiar, este momento pide ajuste de limites y acuerdos mas objetivos.',
    saude: 'En salud y rutina, este momento pide regularidad y lectura realista de las senales del cuerpo.',
    espiritualidade: 'En lo espiritual, este momento favorece practica simple, constancia y discernimiento.',
    comunicacao: 'En comunicacion, este momento pide precision de lenguaje y revision antes de cerrar.',
    transformacao: 'En transformacion, este momento favorece cortes conscientes y reorganizacion progresiva.',
  }

  const areaMapIt: Record<string, string> = {
    amor: 'Sul piano relazionale, questo momento richiede qualita di presenza e accordi chiari.',
    carreira: 'Sul piano professionale, questo momento favorisce strategia, coerenza e priorita chiare.',
    financas: 'Sul piano finanziario, questo momento richiede criterio, prevedibilita e decisioni non impulsive.',
    familia: 'Sul piano familiare, questo momento richiede aggiustamento dei limiti e accordi piu chiari.',
    saude: 'Su salute e routine, questo momento richiede regolarita e lettura realistica dei segnali del corpo.',
    espiritualidade: 'Sul piano spirituale, questo momento favorisce pratica semplice, costanza e discernimento.',
    comunicacao: 'Nella comunicazione, questo momento richiede precisione e revisione prima di chiudere.',
    transformacao: 'Sul piano della trasformazione, questo momento favorisce tagli consapevoli e riorganizzazione progressiva.',
  }

  const aliases: Record<string, string> = {
    amor: 'amor',
    love: 'amor',
    amore: 'amor',

    carreira: 'carreira',
    career: 'carreira',
    carrera: 'carreira',
    carriera: 'carreira',

    financas: 'financas',
    finanzas: 'financas',
    finanze: 'financas',
    finances: 'financas',

    familia: 'familia',
    family: 'familia',
    famiglia: 'familia',

    saude: 'saude',
    salud: 'saude',
    salute: 'saude',
    health: 'saude',

    espiritualidade: 'espiritualidade',
    espiritualidad: 'espiritualidade',
    spiritualita: 'espiritualidade',
    spirituality: 'espiritualidade',

    comunicacao: 'comunicacao',
    comunicacion: 'comunicacao',
    comunicazione: 'comunicacao',
    communication: 'comunicacao',

    transformacao: 'transformacao',
    transformacion: 'transformacao',
    trasformazione: 'transformacao',
    transformation: 'transformacao',
  }

  const canonical = aliases[key] || key
  if (lang === 'en-US') return areaMapEn[canonical] || ''
  if (lang === 'es-ES') return areaMapEs[canonical] || ''
  if (lang === 'it-IT') return areaMapIt[canonical] || ''
  return areaMapPt[canonical] || ''
}

function buildActionHint(aspectKey: string, house: number | null, areaLabel?: string | null, language?: string | null): string {
  const lang = getLang(language)
  const area = getAreaLabel(areaLabel, lang)
  const houseFocus = house ? getHousePositionalFocus(lang, house) : ''
  if (['quadratura', 'oposicao', 'quincuncio', 'semiquadratura', 'sesquiquadratura', 'tense'].includes(aspectKey)) {
    if (lang === 'en-US') return `Practical action: reduce friction, set one objective priority in ${area}, and adjust pace for 48h${houseFocus ? ` with focus on ${houseFocus}` : ''}.`
    if (lang === 'es-ES') return `Accion practica: reduce friccion, define una prioridad objetiva en ${area} y ajusta el ritmo por 48h${houseFocus ? ` con foco en ${houseFocus}` : ''}.`
    if (lang === 'it-IT') return `Azione pratica: riduci attrito, definisci una priorita oggettiva in ${area} e regola il ritmo per 48h${houseFocus ? ` con focus su ${houseFocus}` : ''}.`
    return `Acao pratica: reduza atrito, defina uma prioridade objetiva em ${area} e ajuste o ritmo por 48h${houseFocus ? ` com foco em ${houseFocus}` : ''}.`
  }
  if (['trigono', 'sextil', 'harmonic'].includes(aspectKey)) {
    if (lang === 'en-US') return `Practical action: use the flow to complete one concrete delivery in ${area}${houseFocus ? `, prioritizing ${houseFocus}` : ''}.`
    if (lang === 'es-ES') return `Accion practica: aprovecha la fluidez para concluir una entrega concreta en ${area}${houseFocus ? `, priorizando ${houseFocus}` : ''}.`
    if (lang === 'it-IT') return `Azione pratica: sfrutta la fluidita per completare un risultato concreto in ${area}${houseFocus ? `, dando priorita a ${houseFocus}` : ''}.`
    return `Acao pratica: aproveite a fluidez para concluir uma entrega concreta em ${area}${houseFocus ? `, priorizando ${houseFocus}` : ''}.`
  }
  if (aspectKey === 'ingress' && house) {
    if (lang === 'en-US') return `Practical action: reorganize your schedule around House ${house} themes and track daily effects.`
    if (lang === 'es-ES') return `Accion practica: reorganiza la agenda segun los temas de la Casa ${house} y observa el efecto diario.`
    if (lang === 'it-IT') return `Azione pratica: riorganizza l agenda secondo i temi della Casa ${house} e monitora l effetto quotidiano.`
    return `Acao pratica: reorganize a agenda conforme os temas da Casa ${house} e acompanhe o efeito no dia a dia.`
  }
  if (lang === 'en-US') return `Practical action: observe signals, log decisions, and execute one simple next step in ${area}${houseFocus ? ` connected to ${houseFocus}` : ''}.`
  if (lang === 'es-ES') return `Accion practica: observa senales, registra decisiones y ejecuta un siguiente paso simple en ${area}${houseFocus ? ` conectado con ${houseFocus}` : ''}.`
  if (lang === 'it-IT') return `Azione pratica: osserva i segnali, registra le decisioni ed esegui un passo semplice in ${area}${houseFocus ? ` collegato a ${houseFocus}` : ''}.`
  return `Acao pratica: observe sinais, registre decisoes e execute um proximo passo simples em ${area}${houseFocus ? ` conectado a ${houseFocus}` : ''}.`
}

function buildScoreLink(aspectKey: string, areaLabel?: string | null, language?: string | null): string {
  const lang = getLang(language)
  const area = getAreaLabel(areaLabel, lang)
  if (['quadratura', 'oposicao', 'quincuncio', 'semiquadratura', 'sesquiquadratura', 'tense'].includes(aspectKey)) {
    if (lang === 'en-US') return `Practical reading: this pattern can pressure ${area} under impulse; outcomes improve with strategic adjustment.`
    if (lang === 'es-ES') return `Lectura practica: este patron puede presionar ${area} si actuas por impulso; el resultado mejora con ajuste de estrategia.`
    if (lang === 'it-IT') return `Lettura pratica: questo schema puo mettere pressione su ${area} se agisci d impulso; il risultato migliora con un aggiustamento strategico.`
    return `Leitura pratica: este padrao pode pressionar ${area} se voce agir no impulso; o resultado melhora com ajuste de estrategia.`
  }
  if (['trigono', 'sextil', 'harmonic'].includes(aspectKey)) {
    if (lang === 'en-US') return `Practical reading: this pattern tends to support ${area}; results improve when potential becomes concrete action.`
    if (lang === 'es-ES') return `Lectura practica: este patron tiende a favorecer ${area}; el resultado sube cuando conviertes potencial en accion concreta.`
    if (lang === 'it-IT') return `Lettura pratica: questo schema tende a favorire ${area}; il risultato cresce quando il potenziale diventa azione concreta.`
    return `Leitura pratica: este padrao tende a favorecer ${area}; o resultado melhora quando voce transforma potencial em acao concreta.`
  }
  if (lang === 'en-US') return `Practical reading: effect on ${area} depends more on consistent choices than transit intensity.`
  if (lang === 'es-ES') return `Lectura practica: el efecto en ${area} depende mas de la consistencia de tus decisiones que de la intensidad del transito.`
  if (lang === 'it-IT') return `Lettura pratica: l effetto su ${area} dipende piu dalla coerenza delle scelte che dall intensita del transito.`
  return `Leitura pratica: o efeito em ${area} depende mais da consistencia das escolhas do que da intensidade do transito.`
}

function stripActionPrefix(text: string, prefix: string): string {
  const safePrefix = prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return text.replace(new RegExp(`^${safePrefix}`, 'i'), '').trim()
}

function sanitizeNarrativeText(value: string): string {
  const text = String(value || '').replace(/\s+/g, ' ').trim()
  if (!text) return ''
  const banned = ['nesta area', 'nesta area.', 'fase de calibragem']
  const normalized = text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
  if (banned.some((pattern) => normalized.includes(pattern))) return ''
  return text
}

function normalizeNarrativeKey(value: unknown): string {
  return String(value || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function mergeNarrativeSegments(
  segments: Array<string | null | undefined>,
  options?: { exclude?: Array<string | null | undefined> }
): string[] {
  const out: string[] = []
  const excluded = (options?.exclude || [])
    .map((item) => normalizeNarrativeKey(item))
    .filter(Boolean)

  const add = (value: string | null | undefined) => {
    const text = String(value || '').trim()
    if (!text) return
    const normalized = normalizeNarrativeKey(text)
    if (!normalized) return
    if (excluded.some((item) => item === normalized || item.includes(normalized) || normalized.includes(item))) return
    const duplicated = out.some((existing) => {
      const key = normalizeNarrativeKey(existing)
      return key === normalized || key.includes(normalized) || normalized.includes(key)
    })
    if (!duplicated) out.push(text)
  }

  segments.forEach((segment) => add(segment))
  return out
}

function getPhaseLabel(transit: AnyTransit, language?: string | null): string {
  const lang = getLang(language)
  const phases = I18N[lang].phases
  const phase = String(transit?.phase || '').toLowerCase()
  if (phase === 'peak') return phases.peak
  if (phase === 'start') return phases.start
  if (phase === 'end') return phases.end
  if (transit?.isApplying === true || transit?.applying === true) return phases.applying
  if (transit?.isApplying === false || transit?.applying === false) return phases.movingAway
  return phases.active
}

export function buildAstroTransitNarrative(
  transit: AnyTransit,
  areaLabel?: string | null,
  language?: string | null
): { directText: string; fullText: string } {
  const lang = getLang(language)
  const tx = I18N[lang]
  const seed = buildSeed(transit)
  const transitPlanetRaw = String(transit?.transitPlanet || tx.transitWord)
  const transitPlanet = PLANET_LABELS[lang][transitPlanetRaw] || PLANET_PT[transitPlanetRaw] || transitPlanetRaw
  const planetMeaning = PLANET_SYMBOLISM[transitPlanetRaw] || 'movimento de foco e resposta'
  const aspectKey = normalizeAspect(transit?.aspectName || transit?.type || transit?.aspect || transit?.aspectType)
  const aspectMeaning = getAspectMeaning(aspectKey, lang)
  const house = getHouseNumber(transit)
  const targetLabel = getTargetLabel(transit, lang)
  const phaseLabel = getPhaseLabel(transit, lang)
  const area = getAreaLabel(areaLabel, lang)
  const houseMeaning = house ? getHouseSymbolism(lang, house) : ''
  const positionalFocus = house ? getHousePositionalFocus(lang, house) : ''
  const areaTone = getAreaContextTone(areaLabel, lang)
  const actionHint = buildActionHint(aspectKey, house, areaLabel, lang)
  const scoreLink = buildScoreLink(aspectKey, areaLabel, lang)
  const phaseVerb = pickVariant(seed, ['sinaliza', 'reforca', 'reorganiza'], 1)
  const phaseBridge = pickVariant(seed, ['neste ciclo', 'nesta janela', 'neste momento'], 2)
  const flowVerb = pickVariant(seed, ['orienta', 'pede', 'favorece'], 3)

  const phaseVerbLocalized =
    lang === 'en-US' ? pickVariant(seed, ['signals', 'reinforces', 'reorganizes'], 1)
      : lang === 'es-ES' ? pickVariant(seed, ['senala', 'refuerza', 'reorganiza'], 1)
        : lang === 'it-IT' ? pickVariant(seed, ['segnala', 'rafforza', 'riorganizza'], 1)
          : phaseVerb
  const phaseBridgeLocalized =
    lang === 'en-US' ? pickVariant(seed, ['in this cycle', 'in this window', 'right now'], 2)
      : lang === 'es-ES' ? pickVariant(seed, ['en este ciclo', 'en esta ventana', 'en este momento'], 2)
        : lang === 'it-IT' ? pickVariant(seed, ['in questo ciclo', 'in questa finestra', 'in questo momento'], 2)
          : phaseBridge
  const flowVerbLocalized =
    lang === 'en-US' ? pickVariant(seed, ['guides', 'asks for', 'supports'], 3)
      : lang === 'es-ES' ? pickVariant(seed, ['orienta', 'pide', 'favorece'], 3)
        : lang === 'it-IT' ? pickVariant(seed, ['orienta', 'chiede', 'favorisce'], 3)
          : flowVerb

  let directText = ''
  if (house && aspectKey === 'ingress') {
    directText = interpolate(tx.direct.ingress, {
      planet: transitPlanet,
      houseLabel: tx.houseWord,
      house,
      houseMeaning,
      phaseLabel,
      phaseVerb: phaseVerbLocalized,
      area,
    })
  } else if (house && (!aspectKey || aspectKey === 'neutral')) {
    directText = interpolate(tx.direct.houseNeutral, {
      planet: transitPlanet,
      houseLabel: tx.houseWord,
      house,
      houseMeaning,
      phaseLabel,
      flowVerb: flowVerbLocalized,
      area,
    })
  } else {
    directText = interpolate(tx.direct.aspect, {
      planet: transitPlanet,
      aspectKey: getAspectLabel(aspectKey, lang) || tx.transitWord.toLowerCase(),
      targetLabel,
      aspectMeaning,
      phaseLabel,
      phaseBridge: phaseBridgeLocalized,
      area,
    })
  }
  const safeDirectText = sanitizeNarrativeText(directText)
    || interpolate(tx.direct.fallback, { planet: transitPlanet, area })

  const actionCore = stripActionPrefix(actionHint, tx.practicalActionPrefix)
  const technicalNarrative = (() => {
    if (lang === 'en-US') {
      return pickVariant(seed, [
        `${transitPlanet} activates themes of ${planetMeaning}, shaping decisions in ${area}.`,
        `${transitPlanet} highlights ${planetMeaning}, making this tone more visible in ${area}.`,
        `${transitPlanet} works through ${planetMeaning}, setting the strategic tone for ${area}.`,
      ], 4)
    }
    if (lang === 'es-ES') {
      return pickVariant(seed, [
        `${transitPlanet} activa temas de ${planetMeaning}, moldeando decisiones en ${area}.`,
        `${transitPlanet} destaca ${planetMeaning}, dejando este tono mas visible en ${area}.`,
        `${transitPlanet} opera por ${planetMeaning}, definiendo el tono estrategico en ${area}.`,
      ], 4)
    }
    if (lang === 'it-IT') {
      return pickVariant(seed, [
        `${transitPlanet} attiva temi di ${planetMeaning}, influenzando le decisioni in ${area}.`,
        `${transitPlanet} mette in evidenza ${planetMeaning}, rendendo questo tono piu visibile in ${area}.`,
        `${transitPlanet} opera tramite ${planetMeaning}, definendo il tono strategico in ${area}.`,
      ], 4)
    }
    return pickVariant(seed, [
      `${transitPlanet} ativa temas de ${planetMeaning}, moldando decisoes em ${area}.`,
      `${transitPlanet} destaca ${planetMeaning}, deixando esse tom mais visivel em ${area}.`,
      `${transitPlanet} opera por ${planetMeaning}, definindo o tom estrategico em ${area}.`,
    ], 4)
  })()

  const positionNarrative = (() => {
    if (house) {
      if (lang === 'en-US') return `With emphasis on House ${house} (${houseMeaning}), the practical focus moves to concrete adjustments in this domain.`
      if (lang === 'es-ES') return `Con enfasis en la Casa ${house} (${houseMeaning}), el foco practico pasa a ajustes concretos en este dominio.`
      if (lang === 'it-IT') return `Con enfasi sulla Casa ${house} (${houseMeaning}), il focus pratico passa ad aggiustamenti concreti in questo ambito.`
      return `Com enfase na Casa ${house} (${houseMeaning}), o foco pratico migra para ajustes concretos neste dominio.`
    }
    if (lang === 'en-US') return `The activated target (${targetLabel}) shows where this movement is being concentrated in your chart.`
    if (lang === 'es-ES') return `El objetivo activado (${targetLabel}) muestra donde se concentra este movimiento en tu carta.`
    if (lang === 'it-IT') return `Il target attivato (${targetLabel}) mostra dove questo movimento si concentra nel tema.`
    return `O alvo ativado (${targetLabel}) mostra onde esse movimento esta sendo concentrado no seu mapa.`
  })()

  const phaseNarrative = (() => {
    if (lang === 'en-US') return `Timing now is ${phaseLabel}, and the aspect pattern points to ${aspectMeaning}.`
    if (lang === 'es-ES') return `La fase temporal esta ${phaseLabel}, y el padron del aspecto apunta a ${aspectMeaning}.`
    if (lang === 'it-IT') return `La fase temporale e ${phaseLabel}, e il pattern dell aspetto indica ${aspectMeaning}.`
    return `A fase temporal esta ${phaseLabel}, e o padrao do aspecto aponta para ${aspectMeaning}.`
  })()

  const guidanceNarrative = (() => {
    if (lang === 'en-US') return `${actionCore} ${scoreLink}`
    if (lang === 'es-ES') return `${actionCore} ${scoreLink}`
    if (lang === 'it-IT') return `${actionCore} ${scoreLink}`
    return `${actionCore} ${scoreLink}`
  })()

  const fullParts = mergeNarrativeSegments([
    technicalNarrative,
    areaTone,
    positionNarrative,
    phaseNarrative,
    guidanceNarrative,
  ], { exclude: [safeDirectText] })

  return {
    directText: safeDirectText,
    fullText: fullParts.join('\n\n'),
  }
}

export type UnifiedTransitNarrative = {
  transitKey?: string
  shortText: string
  modalIntro: string
  modalBody: string
  keywords: string[]
  actionText: string
  metaText: string
  interpretationV2?: TransitInterpretationV2 | null
}

export function buildUnifiedTransitNarrative(
  transit: AnyTransit,
  areaLabel?: string | null,
  language?: string | null
): UnifiedTransitNarrative {
  const lang = getLang(language)
  const tx = I18N[lang]
  const narrative = buildAstroTransitNarrative(transit, areaLabel, lang)
  const catalogDirectText = resolveCatalogTransitText(transit, lang)
  const directText = catalogDirectText || narrative.directText
  const keywords = buildArchetypeKeywordsForTransit(transit, areaLabel, lang)
  const aspectKey = normalizeAspect(transit?.aspectName || transit?.type || transit?.aspect || transit?.aspectType)
  const aspectLabel = getAspectLabel(aspectKey, lang) || tx.transitWord.toLowerCase()
  const aspectMeaning = getAspectMeaning(aspectKey, lang)
  const house = getHouseNumber(transit)
  const targetLabel = getTargetLabel(transit, lang)
  const area = getAreaLabel(areaLabel, lang)
  const transitPlanetRaw = String(transit?.transitPlanet || tx.transitWord)
  const transitPlanet = PLANET_LABELS[lang][transitPlanetRaw] || PLANET_PT[transitPlanetRaw] || transitPlanetRaw
  const phaseLabel = getPhaseLabel(transit, lang)
  const transitKey = buildCanonicalTransitKey(transit)
  const houseMeaning = house ? getHouseSymbolism(lang, house) : ''
  const positionalFocus = house ? getHousePositionalFocus(lang, house) : ''
  const areaTone = getAreaContextTone(areaLabel, lang)
  const actionText = buildActionHint(aspectKey, house, areaLabel, lang)
  const actionCore = stripActionPrefix(actionText, tx.practicalActionPrefix)
  const scoreLink = buildScoreLink(aspectKey, areaLabel, lang)
  const seed = buildSeed(transit)

  const modalIntro = (() => {
    const dynamicLine = (() => {
      if (house && aspectKey && aspectKey !== 'neutral') {
        if (lang === 'en-US') return `${transitPlanet} links ${aspectLabel} with ${targetLabel}, while House ${house} (${houseMeaning}) shows where this becomes concrete in ${area}${positionalFocus ? `, especially in ${positionalFocus}` : ''}.`
        if (lang === 'es-ES') return `${transitPlanet} vincula ${aspectLabel} con ${targetLabel}, y la Casa ${house} (${houseMeaning}) muestra donde esto se vuelve concreto en ${area}${positionalFocus ? `, especialmente en ${positionalFocus}` : ''}.`
        if (lang === 'it-IT') return `${transitPlanet} collega ${aspectLabel} a ${targetLabel}, mentre la Casa ${house} (${houseMeaning}) mostra dove questo diventa concreto in ${area}${positionalFocus ? `, soprattutto in ${positionalFocus}` : ''}.`
        return `${transitPlanet} conecta ${aspectLabel} com ${targetLabel}, enquanto a Casa ${house} (${houseMeaning}) mostra onde isso se torna concreto em ${area}${positionalFocus ? `, especialmente em ${positionalFocus}` : ''}.`
      }
      if (house) {
        if (lang === 'en-US') return `${transitPlanet} emphasizes House ${house} (${houseMeaning}), concentrating practical choices in ${area}${positionalFocus ? ` around ${positionalFocus}` : ''}.`
        if (lang === 'es-ES') return `${transitPlanet} enfatiza la Casa ${house} (${houseMeaning}), concentrando decisiones practicas en ${area}${positionalFocus ? ` alrededor de ${positionalFocus}` : ''}.`
        if (lang === 'it-IT') return `${transitPlanet} enfatizza la Casa ${house} (${houseMeaning}), concentrando scelte pratiche in ${area}${positionalFocus ? ` attorno a ${positionalFocus}` : ''}.`
        return `${transitPlanet} enfatiza a Casa ${house} (${houseMeaning}), concentrando escolhas praticas em ${area}${positionalFocus ? ` em torno de ${positionalFocus}` : ''}.`
      }
      if (lang === 'en-US') return `${transitPlanet} activates ${aspectMeaning} in ${area}, asking for strategic reading of timing and priorities.`
      if (lang === 'es-ES') return `${transitPlanet} activa ${aspectMeaning} en ${area}, pidiendo lectura estrategica de fase y prioridades.`
      if (lang === 'it-IT') return `${transitPlanet} attiva ${aspectMeaning} in ${area}, chiedendo una lettura strategica di fase e priorita.`
      return `${transitPlanet} ativa ${aspectMeaning} em ${area}, pedindo leitura estrategica de fase e prioridades.`
    })()
    return pickVariant(seed, [dynamicLine], 0)
  })()

  const strategyBlock = (() => {
    if (house && aspectKey) {
      if (lang === 'en-US') return `Current phase is ${phaseLabel}. This combination tends to evolve with practical sequence: first read the pattern, then adjust execution.`
      if (lang === 'es-ES') return `La fase actual es ${phaseLabel}. Esta combinacion tiende a evolucionar con secuencia practica: primero leer el patron, luego ajustar la ejecucion.`
      if (lang === 'it-IT') return `La fase attuale e ${phaseLabel}. Questa combinazione tende a evolvere con una sequenza pratica: prima leggere il pattern, poi regolare l esecuzione.`
      return `A fase atual e ${phaseLabel}. Essa combinacao tende a evoluir em sequencia pratica: primeiro ler o padrao, depois ajustar a execucao.`
    }
    if (lang === 'en-US') return `Current phase is ${phaseLabel}, so consistency of choices is more important than isolated intensity spikes.`
    if (lang === 'es-ES') return `La fase actual es ${phaseLabel}, por eso la consistencia de decisiones importa mas que picos aislados de intensidad.`
    if (lang === 'it-IT') return `La fase attuale e ${phaseLabel}, quindi la coerenza delle scelte conta piu dei picchi isolati di intensita.`
    return `A fase atual e ${phaseLabel}, por isso a consistencia das escolhas importa mais do que picos isolados de intensidade.`
  })()

  const metaParts = [
    `${tx.phasePrefix}: ${phaseLabel}.`,
    scoreLink,
  ]
  const modalBody = mergeNarrativeSegments([
    modalIntro,
    areaTone,
    strategyBlock,
    catalogDirectText ? `${catalogDirectText}\n\n${narrative.fullText}` : narrative.fullText,
    actionCore,
    ...metaParts,
  ], { exclude: [directText] }).join('\n\n')

  const interpretationV2 = (() => {
    if (!isInterpretationV2Enabled()) return null
    const houseLabel = house ? (lang === 'en-US' ? `House ${house}` : `Casa ${house}`) : null
    return buildTransitInterpretationV2({
      transitKey,
      aspectKey,
      title: `${transitPlanet} ${aspectLabel} ${targetLabel}`.trim(),
      lifeArea: area,
      houseLabel,
      timingLabel: `${tx.phasePrefix}: ${phaseLabel}`,
      shortText: directText,
      fullText: modalBody || narrative.fullText || directText,
      actionText,
      metaText: metaParts.join(' '),
    })
  })()

  return {
    transitKey,
    shortText: directText,
    modalIntro,
    modalBody: modalBody || narrative.fullText || directText,
    keywords,
    actionText,
    metaText: metaParts.join(' '),
    interpretationV2,
  }
}
