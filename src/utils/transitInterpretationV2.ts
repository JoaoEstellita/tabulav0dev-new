export type TransitValence = 'positive' | 'neutral' | 'alert'

export type TransitInterpretationV2 = {
  transitKey: string
  header: string
  subheader: string
  tldr: string
  medium: string
  long: string
  callouts: {
    opportunities: string[]
    watchOuts: string[]
  }
  actionables: string[]
  valence: TransitValence
  confidenceScore: number
  confidenceWhy: string
  timeWindow: string
  exactness: string
  uncertaintyNotes: string[]
}

type BuildTransitV2Input = {
  transitKey?: string | null
  aspectKey?: string | null
  title: string
  lifeArea?: string | null
  houseLabel?: string | null
  timingLabel?: string | null
  shortText: string
  fullText: string
  actionText?: string | null
  metaText?: string | null
}

const FORBIDDEN_DETERMINISTIC = [
  'vai acontecer',
  'com certeza',
  'inevitavel',
  'inevitável',
  'garantido',
  'garantida',
]

const compact = (value: string): string => String(value || '').replace(/\s+/g, ' ').trim()

const clamp = (value: number, min = 0, max = 1): number => Math.max(min, Math.min(max, value))

const splitSentences = (value: string): string[] =>
  compact(value)
    .split(/(?<=[.!?])\s+/)
    .map((part) => part.trim())
    .filter(Boolean)

const splitParagraphs = (value: string): string[] =>
  String(value || '')
    .split(/\n{2,}/)
    .map((part) => compact(part))
    .filter(Boolean)

const withAreaHouse = (text: string, area: string, house: string): string => {
  const normalized = compact(text)
  const areaLower = area.toLowerCase()
  const hasArea = normalized.toLowerCase().includes(areaLower)
  const hasHouse = house ? normalized.toLowerCase().includes(house.toLowerCase()) : true
  if (hasArea && hasHouse) return normalized
  if (!hasArea && !hasHouse && house) return `${normalized} Nesta fase, o foco em ${area} passa por ${house}.`
  if (!hasArea) return `${normalized} Isso aparece com mais forca em ${area}.`
  if (!hasHouse && house) return `${normalized} O tema fica mais visivel em ${house}.`
  return normalized
}

const sanitizeDeterministicLanguage = (text: string): string => {
  let out = String(text || '')
  FORBIDDEN_DETERMINISTIC.forEach((token) => {
    const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    out = out.replace(new RegExp(escaped, 'gi'), 'tende a acontecer')
  })
  return compact(out)
}

const buildMedium = (base: string, shortText: string, area: string, house: string): string => {
  const fromBase = splitSentences(base)
  const fromShort = splitSentences(shortText)
  const merged = [...fromShort, ...fromBase].map(sanitizeDeterministicLanguage).filter(Boolean)
  const picked = merged.slice(0, 4)
  while (picked.length < 3) {
    picked.push('Use esta leitura como referencia de tendencia, nao como determinismo.')
  }
  return withAreaHouse(picked.join(' '), area, house)
}

const buildLong = (base: string, medium: string, action: string, area: string, house: string): string => {
  const paragraphs = splitParagraphs(base)
  const first = sanitizeDeterministicLanguage(withAreaHouse(paragraphs[0] || medium, area, house))
  const second = paragraphs[1] || 'Observe como essa dinamica aparece no cotidiano e ajuste ritmo, comunicacao e prioridades.'
  const third = action || 'Micro-acao: escolha um ajuste pequeno hoje e revise em 24h.'
  const fourth = 'Pergunta de reflexao: qual decisao, hoje, reduz ruído e aumenta consistencia?'
  return [first, sanitizeDeterministicLanguage(second), sanitizeDeterministicLanguage(third), fourth]
    .slice(0, 5)
    .join('\n\n')
}

const inferValence = (aspectKey?: string | null, title?: string | null): TransitValence => {
  const key = compact(aspectKey || '').toLowerCase()
  const label = compact(title || '').toLowerCase()
  const normalized = key || label
  if (
    normalized.includes('quadratura') ||
    normalized.includes('oposicao') ||
    normalized.includes('semiquadratura') ||
    normalized.includes('sesquiquadratura') ||
    normalized.includes('quincuncio')
  ) {
    return 'alert'
  }
  if (normalized.includes('trigono') || normalized.includes('sextil')) {
    return 'positive'
  }
  return 'neutral'
}

const inferConfidence = (timingLabel?: string | null, metaText?: string | null): { score: number; why: string } => {
  const timing = compact(timingLabel || '').toLowerCase()
  const meta = compact(metaText || '').toLowerCase()
  let score = 0.68
  if (timing.includes('pico') || timing.includes('peak')) score += 0.12
  if (timing.includes('aprox')) score += 0.06
  if (timing.includes('afastando')) score -= 0.04
  if (meta.includes('orb')) score += 0.05
  if (meta.includes('dados parciais')) score -= 0.12
  const clamped = clamp(score, 0.35, 0.95)
  const reason =
    clamped >= 0.75
      ? 'Confiança alta: timing próximo da fase principal e sinais coerentes.'
      : clamped >= 0.55
      ? 'Confiança média: sinais consistentes, mas com variacao natural de contexto.'
      : 'Confiança moderada: leitura útil, com incerteza maior por dados incompletos.'
  return { score: clamped, why: reason }
}

export const hasUnrenderedPlaceholder = (value: string): boolean => /\{[a-zA-Z0-9_.-]+\}/.test(String(value || ''))

export function buildTransitInterpretationV2(input: BuildTransitV2Input): TransitInterpretationV2 {
  const area = compact(input.lifeArea || 'sua area atual').toLowerCase()
  const house = compact(input.houseLabel || '')
  const valence = inferValence(input.aspectKey, input.title)
  const confidence = inferConfidence(input.timingLabel, input.metaText)
  const tldrRaw = splitSentences(input.shortText)[0] || 'Leitura de tendencia para orientar seu proximo passo.'
  const tldr = sanitizeDeterministicLanguage(withAreaHouse(tldrRaw, area, house)).slice(0, 140)
  const medium = buildMedium(input.fullText, input.shortText, area, house)
  const long = buildLong(input.fullText, medium, compact(input.actionText || ''), area, house)
  const opportunities =
    valence === 'alert'
      ? ['Ajustar rota cedo reduz desgaste acumulado.']
      : ['Janela favoravel para consolidar pequenas decisoes com consistencia.']
  const watchOuts =
    valence === 'alert'
      ? ['Evite respostas impulsivas; priorize clareza e ritmo sustentável.']
      : ['Nao confundir fluidez momentânea com garantia de resultado.']
  const actionables = [
    compact(input.actionText || 'Escolha uma acao pequena e executavel para hoje.'),
    'Registre o que mudou e reavalie em 24h.',
  ]
  const uncertaintyNotes: string[] = []
  if (!house) uncertaintyNotes.push('Sem casa especifica disponivel para este evento.')
  if (!compact(input.metaText || '')) uncertaintyNotes.push('Metadados tecnicos reduzidos; leitura em modo essencial.')

  return {
    transitKey: compact(input.transitKey || input.title).toLowerCase(),
    header: compact(input.title),
    subheader: `Leitura aplicada em ${area}${house ? ` • ${house}` : ''}`,
    tldr,
    medium,
    long,
    callouts: { opportunities, watchOuts },
    actionables: actionables.filter(Boolean).slice(0, 3),
    valence,
    confidenceScore: confidence.score,
    confidenceWhy: confidence.why,
    timeWindow: compact(input.timingLabel || 'Janela em andamento'),
    exactness: compact(input.metaText || 'Sem metadados de orb/exatidao'),
    uncertaintyNotes,
  }
}
