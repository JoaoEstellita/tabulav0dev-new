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

function getTargetLabel(transit: AnyTransit): string {
  const house = getHouseNumber(transit)
  if (house) return `Casa ${house}`
  const target = transit?.natalPlanet || transit?.target?.natalPlanet || transit?.target?.angle || transit?.natalPoint
  if (!target) return 'seu mapa natal'
  const raw = String(target)
  return PLANET_PT[raw] || raw
}

function getPlanetArchetypeWord(planetRaw: string): string {
  const content = PLANET_SYMBOLISM[planetRaw] || ''
  return content.split(',')[0]?.trim() || 'movimento'
}

export function buildArchetypeKeywordsForTransit(
  transit: AnyTransit,
  areaLabel?: string | null
): string[] {
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
  add(ASPECT_ARCHETYPE[aspectKey] || aspectKey)
  if (targetRaw && PLANET_SYMBOLISM[targetRaw]) add(getPlanetArchetypeWord(targetRaw))
  if (house && HOUSE_SYMBOLISM[house]) add(HOUSE_SYMBOLISM[house].split(',')[0]?.trim() || `Casa ${house}`)
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

function getAreaLabel(areaLabel?: string | null): string {
  const value = String(areaLabel || '').trim()
  if (!value) return 'area de vida'
  return value.toLowerCase()
}

function buildActionHint(aspectKey: string, house: number | null, areaLabel?: string | null): string {
  const area = getAreaLabel(areaLabel)
  if (['quadratura', 'oposicao', 'quincuncio', 'semiquadratura', 'sesquiquadratura', 'tense'].includes(aspectKey)) {
    return `Acao pratica: reduza atrito, defina uma prioridade objetiva em ${area} e ajuste o ritmo por 48h.`
  }
  if (['trigono', 'sextil', 'harmonic'].includes(aspectKey)) {
    return `Acao pratica: aproveite a fluidez para concluir uma entrega concreta em ${area}.`
  }
  if (aspectKey === 'ingress' && house) {
    return `Acao pratica: reorganize a agenda conforme os temas da Casa ${house} e acompanhe o efeito no dia a dia.`
  }
  return `Acao pratica: observe sinais, registre decisoes e execute um proximo passo simples em ${area}.`
}

function buildScoreLink(aspectKey: string, areaLabel?: string | null): string {
  const area = getAreaLabel(areaLabel)
  if (['quadratura', 'oposicao', 'quincuncio', 'semiquadratura', 'sesquiquadratura', 'tense'].includes(aspectKey)) {
    return `Conexao com o status: este padrao tende a pressionar ${area} se voce agir no impulso; o score melhora com ajuste de estrategia.`
  }
  if (['trigono', 'sextil', 'harmonic'].includes(aspectKey)) {
    return `Conexao com o status: este padrao tende a favorecer ${area}; o score sobe quando voce transforma potencial em acao concreta.`
  }
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

function getPhaseLabel(transit: AnyTransit): string {
  const phase = String(transit?.phase || '').toLowerCase()
  if (phase === 'peak') return 'em pico'
  if (phase === 'start') return 'em aproximacao'
  if (phase === 'end') return 'afastando'
  if (transit?.isApplying === true || transit?.applying === true) return 'em aproximacao'
  if (transit?.isApplying === false || transit?.applying === false) return 'afastando'
  return 'em andamento'
}

export function buildAstroTransitNarrative(
  transit: AnyTransit,
  areaLabel?: string | null
): { directText: string; fullText: string } {
  const seed = buildSeed(transit)
  const transitPlanetRaw = String(transit?.transitPlanet || 'Transito')
  const transitPlanet = PLANET_PT[transitPlanetRaw] || transitPlanetRaw
  const planetMeaning = PLANET_SYMBOLISM[transitPlanetRaw] || 'movimento de foco e resposta'
  const aspectKey = normalizeAspect(transit?.aspectName || transit?.type || transit?.aspect || transit?.aspectType)
  const aspectMeaning = ASPECT_MEANING[aspectKey] || 'movimento de ajuste em curso'
  const house = getHouseNumber(transit)
  const targetLabel = getTargetLabel(transit)
  const phaseLabel = getPhaseLabel(transit)
  const area = getAreaLabel(areaLabel)
  const houseMeaning = house ? HOUSE_SYMBOLISM[house] : ''
  const actionHint = buildActionHint(aspectKey, house, areaLabel)
  const scoreLink = buildScoreLink(aspectKey, areaLabel)
  const phaseVerb = pickVariant(seed, ['sinaliza', 'reforca', 'reorganiza'], 1)
  const phaseBridge = pickVariant(seed, ['neste ciclo', 'nesta janela', 'neste momento'], 2)
  const flowVerb = pickVariant(seed, ['orienta', 'pede', 'favorece'], 3)

  let directText = ''
  if (house && aspectKey === 'ingress') {
    directText = `${transitPlanet} ingressa na Casa ${house}, ativando ${houseMeaning}. ${phaseLabel}, isso ${phaseVerb} prioridades em ${area}.`
  } else if (house && (!aspectKey || aspectKey === 'neutral')) {
    directText = `${transitPlanet} na Casa ${house} ativa ${houseMeaning}. ${phaseLabel}, isso ${flowVerb} ajuste de ritmo em ${area}.`
  } else {
    directText = `${transitPlanet} em ${aspectKey || 'transito'} com ${targetLabel} indica ${aspectMeaning}. ${phaseLabel}, ${phaseBridge} o foco recai em ${area}.`
  }
  const safeDirectText = sanitizeNarrativeText(directText) || `${transitPlanet} ativa um ciclo de ajustes praticos em ${area}.`

  const fullParts = [
    pickVariant(seed, [
      `Leitura tecnica: ${transitPlanet} simboliza ${planetMeaning}.`,
      `Base tecnica: ${transitPlanet} atua sobre ${planetMeaning}.`,
      `Fundamento tecnico: ${transitPlanet} mobiliza ${planetMeaning}.`,
    ], 4),
    house
      ? `Posicao atual: Casa ${house} (${houseMeaning}).`
      : `Alvo ativado: ${targetLabel}.`,
    `Aspecto em foco: ${aspectMeaning}.`,
    `Fase temporal: ${phaseLabel}.`,
    pickVariant(seed, [
      `Aplicacao pratica: ${actionHint.replace(/^Acao pratica:\s*/i, '')}`,
      `Direcionamento pratico: ${actionHint.replace(/^Acao pratica:\s*/i, '')}`,
      `Uso recomendado: ${actionHint.replace(/^Acao pratica:\s*/i, '')}`,
    ], 5),
    scoreLink,
  ]

  return {
    directText: safeDirectText,
    fullText: fullParts.join('\n\n'),
  }
}
