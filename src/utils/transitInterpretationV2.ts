import { buildTransitMeaningV2, type TransitMeaningInput } from './transitMeaningV2'

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

type BuildTransitV2Input = TransitMeaningInput

const FORBIDDEN_DETERMINISTIC = [
  'vai acontecer',
  'com certeza',
  'inevitavel',
  'inevitavel',
  'garantido',
  'garantida',
]

const compact = (value: string): string => String(value || '').replace(/\s+/g, ' ').trim()

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

const sanitizeDeterministicLanguage = (text: string): string => {
  let out = String(text || '')
  FORBIDDEN_DETERMINISTIC.forEach((token) => {
    const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    out = out.replace(new RegExp(escaped, 'gi'), 'tende a acontecer')
  })
  return compact(out)
}

const buildMedium = (base: string, shortText: string): string => {
  const fromBase = splitSentences(base)
  const fromShort = splitSentences(shortText)
  const merged = [...fromShort, ...fromBase].map(sanitizeDeterministicLanguage).filter(Boolean)
  const picked = merged.slice(0, 4)
  while (picked.length < 3) {
    picked.push('Use esta leitura como referencia de tendencia, nao como determinismo.')
  }
  return compact(picked.join(' '))
}

const buildLong = (base: string, medium: string, action: string): string => {
  const paragraphs = splitParagraphs(base)
  const first = sanitizeDeterministicLanguage(paragraphs[0] || medium)
  const second = sanitizeDeterministicLanguage(
    paragraphs[1] || 'Observe como essa dinamica aparece no cotidiano e ajuste ritmo, comunicacao e prioridades.'
  )
  const third = sanitizeDeterministicLanguage(action || 'Micro-acao: escolha um ajuste pequeno hoje e revise em 24h.')
  const fourth = sanitizeDeterministicLanguage(
    paragraphs[2] || 'Pergunta de reflexao: qual decisao, hoje, reduz ruido e aumenta consistencia?'
  )
  return [first, sanitizeDeterministicLanguage(second), sanitizeDeterministicLanguage(third), fourth]
    .slice(0, 5)
    .join('\n\n')
}

export const hasUnrenderedPlaceholder = (value: string): boolean => /\{[a-zA-Z0-9_.-]+\}/.test(String(value || ''))

export function buildTransitInterpretationV2(input: BuildTransitV2Input): TransitInterpretationV2 {
  const meaning = buildTransitMeaningV2(input)
  const area = compact(input.lifeArea || 'sua area atual').toLowerCase()
  const house = compact(input.houseLabel || '')
  const tldrRaw = splitSentences(meaning.coreTheme)[0] || 'Leitura de tendencia para orientar seu proximo passo.'
  const tldr = sanitizeDeterministicLanguage(tldrRaw).slice(0, 140)
  const medium = buildMedium(input.fullText, meaning.coreTheme)
  const long = buildLong(input.fullText, medium, meaning.microAction)
  const opportunities =
    meaning.tensionVsOpportunity === 'alert'
      ? ['Ajustar rota cedo reduz desgaste acumulado.']
      : ['Janela favoravel para consolidar pequenas decisoes com consistencia.']
  const watchOuts =
    meaning.tensionVsOpportunity === 'alert'
      ? ['Evite respostas impulsivas; priorize clareza e ritmo sustentavel.']
      : ['Nao confundir fluidez momentanea com garantia de resultado.']
  const actionables = [meaning.microAction, 'Registre o que mudou e reavalie em 24h.']

  return {
    transitKey: meaning.transitKey,
    header: meaning.title,
    subheader: `Leitura aplicada em ${area}${house ? ` • ${house}` : ''}`,
    tldr,
    medium,
    long,
    callouts: { opportunities, watchOuts },
    actionables: actionables.filter(Boolean).slice(0, 3),
    valence: meaning.tensionVsOpportunity,
    confidenceScore: meaning.confidenceScore,
    confidenceWhy: meaning.confidenceWhy,
    timeWindow: meaning.timeWindow,
    exactness: meaning.exactness,
    uncertaintyNotes: meaning.uncertaintyNotes,
  }
}
