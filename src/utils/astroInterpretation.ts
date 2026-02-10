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
  quincuncio: 'desalinhamento fino que pede recalibragem',
  semissextil: 'ajuste sutil por observacao e refinamento',
  semiquadratura: 'irritacao leve que sinaliza ponto de ajuste',
  sesquiquadratura: 'atrito intermitente que pede reposicionamento',
  harmonic: 'fase de apoio e fluidez relativa',
  tense: 'fase de friccao e necessidade de ajuste',
  neutral: 'fase de observacao, sem puxar para extremos',
  ingress: 'mudanca de foco por troca de casa/ambiente',
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
  const transitPlanetRaw = String(transit?.transitPlanet || 'Transito')
  const transitPlanet = PLANET_PT[transitPlanetRaw] || transitPlanetRaw
  const planetMeaning = PLANET_SYMBOLISM[transitPlanetRaw] || 'movimento de foco e resposta'
  const aspectKey = normalizeAspect(transit?.aspectName || transit?.type || transit?.aspect || transit?.aspectType)
  const aspectMeaning = ASPECT_MEANING[aspectKey] || 'movimento de ajuste em curso'
  const house = getHouseNumber(transit)
  const targetLabel = getTargetLabel(transit)
  const phaseLabel = getPhaseLabel(transit)
  const area = String(areaLabel || 'a area atual').toLowerCase()
  const houseMeaning = house ? HOUSE_SYMBOLISM[house] : ''

  let directText = ''
  if (house && aspectKey === 'ingress') {
    directText = `${transitPlanet} ingressa na Casa ${house}, ativando ${houseMeaning}. ${phaseLabel}, isso reorganiza prioridades em ${area}.`
  } else if (house && (!aspectKey || aspectKey === 'neutral')) {
    directText = `${transitPlanet} na Casa ${house} ativa ${houseMeaning}. ${phaseLabel}, isso muda o ritmo de decisao em ${area}.`
  } else {
    directText = `${transitPlanet} em ${aspectKey || 'transito'} com ${targetLabel} indica ${aspectMeaning}. ${phaseLabel}, o foco recai em ${area}.`
  }

  const fullParts = [
    `Base astrologica: ${transitPlanet} simboliza ${planetMeaning}.`,
    house
      ? `Posicao atual: Casa ${house} (${houseMeaning}).`
      : `Alvo ativado: ${targetLabel}.`,
    `Leitura do aspecto/transito: ${aspectMeaning}.`,
    `Fase temporal: ${phaseLabel}.`,
    `Conexao com ${area}: esta dinamica altera como voce percebe, decide e executa nessa area.`,
  ]

  return {
    directText,
    fullText: fullParts.join('\n\n'),
  }
}

