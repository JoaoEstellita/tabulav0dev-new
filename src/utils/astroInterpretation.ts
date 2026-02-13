import { normalizeLanguage, type AppLanguage } from '../i18n/appI18n'

type AnyTransit = Record<string, any>

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
    scoreLinkPrefix: 'Conexao com o status',
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
    scoreLinkPrefix: 'Status link',
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
    scoreLinkPrefix: 'Conexion con el estado',
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
    scoreLinkPrefix: 'Connessione con lo stato',
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

function pickVariant(seed: number, options: string[], offset = 0): string {
  if (!options.length) return ''
  return options[(seed + offset) % options.length]
}

function getAreaLabel(areaLabel?: string | null, language?: string | null): string {
  const lang = getLang(language)
  const value = String(areaLabel || '').trim()
  if (!value) return I18N[lang].areaDefault
  return value.toLowerCase()
}

function buildActionHint(aspectKey: string, house: number | null, areaLabel?: string | null, language?: string | null): string {
  const lang = getLang(language)
  const area = getAreaLabel(areaLabel, lang)
  if (['quadratura', 'oposicao', 'quincuncio', 'semiquadratura', 'sesquiquadratura', 'tense'].includes(aspectKey)) {
    if (lang === 'en-US') return `Practical action: reduce friction, set one objective priority in ${area}, and adjust pace for 48h.`
    if (lang === 'es-ES') return `Accion practica: reduce friccion, define una prioridad objetiva en ${area} y ajusta el ritmo por 48h.`
    if (lang === 'it-IT') return `Azione pratica: riduci attrito, definisci una priorita oggettiva in ${area} e regola il ritmo per 48h.`
    return `Acao pratica: reduza atrito, defina uma prioridade objetiva em ${area} e ajuste o ritmo por 48h.`
  }
  if (['trigono', 'sextil', 'harmonic'].includes(aspectKey)) {
    if (lang === 'en-US') return `Practical action: use the flow to complete one concrete delivery in ${area}.`
    if (lang === 'es-ES') return `Accion practica: aprovecha la fluidez para concluir una entrega concreta en ${area}.`
    if (lang === 'it-IT') return `Azione pratica: sfrutta la fluidita per completare un risultato concreto in ${area}.`
    return `Acao pratica: aproveite a fluidez para concluir uma entrega concreta em ${area}.`
  }
  if (aspectKey === 'ingress' && house) {
    if (lang === 'en-US') return `Practical action: reorganize your schedule around House ${house} themes and track daily effects.`
    if (lang === 'es-ES') return `Accion practica: reorganiza la agenda segun los temas de la Casa ${house} y observa el efecto diario.`
    if (lang === 'it-IT') return `Azione pratica: riorganizza l agenda secondo i temi della Casa ${house} e monitora l effetto quotidiano.`
    return `Acao pratica: reorganize a agenda conforme os temas da Casa ${house} e acompanhe o efeito no dia a dia.`
  }
  if (lang === 'en-US') return `Practical action: observe signals, log decisions, and execute one simple next step in ${area}.`
  if (lang === 'es-ES') return `Accion practica: observa senales, registra decisiones y ejecuta un siguiente paso simple en ${area}.`
  if (lang === 'it-IT') return `Azione pratica: osserva i segnali, registra le decisioni ed esegui un passo semplice in ${area}.`
  return `Acao pratica: observe sinais, registre decisoes e execute um proximo passo simples em ${area}.`
}

function buildScoreLink(aspectKey: string, areaLabel?: string | null, language?: string | null): string {
  const lang = getLang(language)
  const area = getAreaLabel(areaLabel, lang)
  if (['quadratura', 'oposicao', 'quincuncio', 'semiquadratura', 'sesquiquadratura', 'tense'].includes(aspectKey)) {
    if (lang === 'en-US') return `Status link: this pattern tends to pressure ${area} under impulse; score improves with strategic adjustment.`
    if (lang === 'es-ES') return `Conexion con el estado: este patron tiende a presionar ${area} si actuas por impulso; el score mejora con ajuste de estrategia.`
    if (lang === 'it-IT') return `Connessione con lo stato: questo schema tende a premere ${area} se agisci d impulso; il punteggio migliora con aggiustamento strategico.`
    return `Conexao com o status: este padrao tende a pressionar ${area} se voce agir no impulso; o score melhora com ajuste de estrategia.`
  }
  if (['trigono', 'sextil', 'harmonic'].includes(aspectKey)) {
    if (lang === 'en-US') return `Status link: this pattern tends to support ${area}; score rises when potential becomes concrete action.`
    if (lang === 'es-ES') return `Conexion con el estado: este patron tiende a favorecer ${area}; el score sube cuando conviertes potencial en accion concreta.`
    if (lang === 'it-IT') return `Connessione con lo stato: questo schema tende a favorire ${area}; il punteggio sale quando il potenziale diventa azione concreta.`
    return `Conexao com o status: este padrao tende a favorecer ${area}; o score sobe quando voce transforma potencial em acao concreta.`
  }
  if (lang === 'en-US') return `Status link: effect on ${area} depends more on consistent choices than transit intensity.`
  if (lang === 'es-ES') return `Conexion con el estado: el efecto en ${area} depende mas de la consistencia de tus decisiones que de la intensidad del transito.`
  if (lang === 'it-IT') return `Connessione con lo stato: l effetto su ${area} dipende piu dalla coerenza delle scelte che dall intensita del transito.`
  return `Conexao com o status: o efeito em ${area} depende mais da consistencia das escolhas do que da intensidade do transito.`
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

  const fullParts = mergeNarrativeSegments([
    pickVariant(seed, [
      `${tx.technicalPrefix}: ${transitPlanet} simboliza ${planetMeaning}.`,
      `${tx.technicalBasePrefix}: ${transitPlanet} atua sobre ${planetMeaning}.`,
      `${tx.technicalFundamentPrefix}: ${transitPlanet} mobiliza ${planetMeaning}.`,
    ], 4),
    house
      ? `${tx.currentPositionPrefix}: ${tx.houseWord} ${house} (${houseMeaning}).`
      : `${tx.activatedTargetPrefix}: ${targetLabel}.`,
    `${tx.focusedAspectPrefix}: ${aspectMeaning}.`,
    `${tx.phasePrefix}: ${phaseLabel}.`,
    pickVariant(seed, [
      `${tx.practicalApplicationPrefix}: ${actionHint.replace(new RegExp(`^${tx.practicalActionPrefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i'), '')}`,
      `${tx.practicalDirectionPrefix}: ${actionHint.replace(new RegExp(`^${tx.practicalActionPrefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i'), '')}`,
      `${tx.recommendedUsePrefix}: ${actionHint.replace(new RegExp(`^${tx.practicalActionPrefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i'), '')}`,
    ], 5),
    scoreLink,
  ], { exclude: [safeDirectText] })

  return {
    directText: safeDirectText,
    fullText: fullParts.join('\n\n'),
  }
}

export type UnifiedTransitNarrative = {
  shortText: string
  modalIntro: string
  modalBody: string
  keywords: string[]
  actionText: string
  metaText: string
}

export function buildUnifiedTransitNarrative(
  transit: AnyTransit,
  areaLabel?: string | null,
  language?: string | null
): UnifiedTransitNarrative {
  const lang = getLang(language)
  const tx = I18N[lang]
  const narrative = buildAstroTransitNarrative(transit, areaLabel, lang)
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
  const houseMeaning = house ? getHouseSymbolism(lang, house) : ''

  const modalIntro = (() => {
    if (house && aspectKey) {
      if (lang === 'en-US') return `${transitPlanet} in ${aspectLabel} with ${targetLabel} activates House ${house} (${houseMeaning}) in ${area}.`
      if (lang === 'es-ES') return `${transitPlanet} en ${aspectLabel} con ${targetLabel} activa la Casa ${house} (${houseMeaning}) en ${area}.`
      if (lang === 'it-IT') return `${transitPlanet} in ${aspectLabel} con ${targetLabel} attiva la Casa ${house} (${houseMeaning}) in ${area}.`
      return `${transitPlanet} em ${aspectLabel} com ${targetLabel} ativa a Casa ${house} (${houseMeaning}) em ${area}.`
    }
    if (aspectKey) {
      if (lang === 'en-US') return `${transitPlanet} in ${aspectLabel} with ${targetLabel} activates ${aspectMeaning} in ${area}.`
      if (lang === 'es-ES') return `${transitPlanet} en ${aspectLabel} con ${targetLabel} activa ${aspectMeaning} en ${area}.`
      if (lang === 'it-IT') return `${transitPlanet} in ${aspectLabel} con ${targetLabel} attiva ${aspectMeaning} in ${area}.`
      return `${transitPlanet} em ${aspectLabel} com ${targetLabel} ativa ${aspectMeaning} em ${area}.`
    }
    if (house) {
      if (lang === 'en-US') return `${transitPlanet} activates House ${house} (${houseMeaning}) in ${area}.`
      if (lang === 'es-ES') return `${transitPlanet} activa la Casa ${house} (${houseMeaning}) en ${area}.`
      if (lang === 'it-IT') return `${transitPlanet} attiva la Casa ${house} (${houseMeaning}) in ${area}.`
      return `${transitPlanet} ativa a Casa ${house} (${houseMeaning}) em ${area}.`
    }
    return narrative.directText
  })()

  const actionText = buildActionHint(aspectKey, house, areaLabel, lang)
  const metaParts = [
    `${tx.phasePrefix}: ${phaseLabel}.`,
    buildScoreLink(aspectKey, areaLabel, lang),
  ]
  const modalBody = mergeNarrativeSegments([
    modalIntro,
    narrative.fullText,
    actionText,
    ...metaParts,
  ], { exclude: [narrative.directText] }).join('\n\n')

  return {
    shortText: narrative.directText,
    modalIntro,
    modalBody: modalBody || narrative.fullText || narrative.directText,
    keywords,
    actionText,
    metaText: metaParts.join(' '),
  }
}
