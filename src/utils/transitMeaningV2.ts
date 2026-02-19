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
const toAscii = (value: string): string =>
  compact(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

const parseOrbFromMeta = (metaText?: string | null): number | null => {
  const text = compact(metaText || '')
  if (!text) return null
  const match = text.match(/orb\s*[:=]?\s*([0-9]+(?:[.,][0-9]+)?)/i)
  if (!match?.[1]) return null
  const orb = Number(match[1].replace(',', '.'))
  return Number.isFinite(orb) ? orb : null
}

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
  const timing = toAscii(timingLabel || '')
  const meta = toAscii(metaText || '')
  const orb = parseOrbFromMeta(metaText)
  let score = 0.68
  if (timing.includes('pico') || timing.includes('peak') || timing.includes('exact')) score += 0.12
  if (timing.includes('aprox') || timing.includes('approach') || timing.includes('applying')) score += 0.06
  if (timing.includes('afastando') || timing.includes('separating')) score -= 0.04
  if (meta.includes('orb')) score += 0.05
  if (meta.includes('dados parciais') || meta.includes('partial data')) score -= 0.12
  if (orb != null) {
    if (orb <= 1) score += 0.07
    else if (orb <= 2) score += 0.03
    else if (orb >= 4) score -= 0.08
  } else {
    score -= 0.03
  }
  const clamped = clamp(score, 0.35, 0.95)
  const reasonParts: string[] = []
  if (orb != null) {
    if (orb <= 1) reasonParts.push('orbe curto')
    else if (orb >= 4) reasonParts.push('orbe amplo')
  } else {
    reasonParts.push('sem orbe explicito')
  }
  if (timing.includes('pico') || timing.includes('peak') || timing.includes('exact')) reasonParts.push('fase de pico')
  if (timing.includes('afastando') || timing.includes('separating')) reasonParts.push('fase separativa')
  const base =
    clamped >= 0.75
      ? 'Confianca alta'
      : clamped >= 0.55
      ? 'Confianca media'
      : 'Confianca moderada'
  const reason = `${base}: ${reasonParts.length ? reasonParts.join(', ') : 'sinais coerentes com variacao de contexto'}.`
  return { score: clamped, why: reason }
}

const deriveWhyNow = (timingLabel?: string | null): string => {
  const timing = toAscii(timingLabel || '')
  if (timing.includes('pico') || timing.includes('peak') || timing.includes('exact')) {
    return 'Janela de maior intensidade: pequenas decisoes tendem a amplificar resultados.'
  }
  if (timing.includes('aprox') || timing.includes('applying') || timing.includes('start')) {
    return 'Janela de aproximacao: o tema esta ganhando forca e pede preparo gradual.'
  }
  if (timing.includes('afastando') || timing.includes('separating') || timing.includes('end')) {
    return 'Janela de assimilacao: consolidar ajustes tende a render mais que iniciar excesso.'
  }
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
  const orb = parseOrbFromMeta(input.metaText)
  if (!houseLabel) uncertaintyNotes.push('Sem casa especifica disponivel para este evento.')
  if (!compact(input.metaText || '')) uncertaintyNotes.push('Metadados tecnicos reduzidos; leitura em modo essencial.')
  if (orb == null) uncertaintyNotes.push('Orbe nao informado; nivel de precisao temporal reduzido.')

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
