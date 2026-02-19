export type TransitMeaningValence = 'positive' | 'neutral' | 'alert'

export type TransitMeaningInput = {
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

export type TransitMeaningV2 = {
  transitKey: string
  title: string
  coreTheme: string
  tensionVsOpportunity: TransitMeaningValence
  whyNow: string
  areaFocus: string
  pitfalls: string[]
  bestUse: string[]
  microAction: string
  confidenceScore: number
  confidenceWhy: string
  uncertaintyNotes: string[]
  timeWindow: string
  exactness: string
}

const clamp = (value: number, min = 0, max = 1): number => Math.max(min, Math.min(max, value))
const compact = (value: string): string => String(value || '').replace(/\s+/g, ' ').trim()

const inferValence = (aspectKey?: string | null, title?: string | null): TransitMeaningValence => {
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
  if (timing.includes('aprox') || timing.includes('approach')) score += 0.06
  if (timing.includes('afastando') || timing.includes('separating')) score -= 0.04
  if (meta.includes('orb')) score += 0.05
  if (meta.includes('dados parciais') || meta.includes('partial data')) score -= 0.12
  const clamped = clamp(score, 0.35, 0.95)
  const reason =
    clamped >= 0.75
      ? 'Confianca alta: timing proximo da fase principal e sinais coerentes.'
      : clamped >= 0.55
      ? 'Confianca media: sinais consistentes, com variacao natural de contexto.'
      : 'Confianca moderada: leitura util, com incerteza maior por dados incompletos.'
  return { score: clamped, why: reason }
}

const deriveWhyNow = (timingLabel?: string | null): string => {
  const timing = compact(timingLabel || '').toLowerCase()
  if (timing.includes('pico') || timing.includes('peak')) return 'Janela de maior intensidade: escolhas tem efeito mais visivel.'
  if (timing.includes('aprox') || timing.includes('applying')) return 'Janela de aproximacao: o tema esta ganhando forca progressivamente.'
  if (timing.includes('afastando') || timing.includes('separating')) return 'Janela de assimilacao: integrar ajustes tende a render mais.'
  return 'Janela ativa: o efeito existe, mas depende da consistencia das decisoes.'
}

export function buildTransitMeaningV2(input: TransitMeaningInput): TransitMeaningV2 {
  const lifeArea = compact(input.lifeArea || 'sua area atual').toLowerCase()
  const houseLabel = compact(input.houseLabel || '')
  const valence = inferValence(input.aspectKey, input.title)
  const confidence = inferConfidence(input.timingLabel, input.metaText)
  const shortTheme = compact(input.shortText || input.fullText || 'Leitura de tendencia para orientar seu proximo passo.')
  const areaFocus = houseLabel
    ? `Foco em ${lifeArea} com manifestacao mais clara em ${houseLabel}.`
    : `Foco principal em ${lifeArea}.`

  const pitfalls =
    valence === 'alert'
      ? ['Responder no impulso.', 'Misturar urgencia com prioridade real.']
      : ['Assumir que fluidez substitui execucao.', 'Perder ritmo apos o primeiro acerto.']

  const bestUse =
    valence === 'alert'
      ? ['Reduzir ruido e simplificar decisoes.', 'Definir um limite pratico para hoje.']
      : ['Consolidar um passo concreto.', 'Transformar potencial em entrega observavel.']

  const uncertaintyNotes: string[] = []
  if (!houseLabel) uncertaintyNotes.push('Sem casa especifica disponivel para este evento.')
  if (!compact(input.metaText || '')) uncertaintyNotes.push('Metadados tecnicos reduzidos; leitura em modo essencial.')

  return {
    transitKey: compact(input.transitKey || input.title).toLowerCase(),
    title: compact(input.title),
    coreTheme: shortTheme,
    tensionVsOpportunity: valence,
    whyNow: deriveWhyNow(input.timingLabel),
    areaFocus,
    pitfalls,
    bestUse,
    microAction: compact(input.actionText || 'Escolha uma acao pequena e executavel para hoje.'),
    confidenceScore: confidence.score,
    confidenceWhy: confidence.why,
    uncertaintyNotes,
    timeWindow: compact(input.timingLabel || 'Janela em andamento'),
    exactness: compact(input.metaText || 'Sem metadados de orb/exatidao'),
  }
}

