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

const MEDIUM_DISCLAIMER_POOL = [
  'Use esta leitura como orientação de tendência, não como determinismo.',
  'Interprete como uma direção provável — você tem agência sobre o resultado.',
  'Esta é uma tendência, não um destino — suas escolhas definem o desfecho.',
]

const OPPORTUNITY_POOL: Record<string, string[]> = {
  alert: [
    'Ajustar a rota cedo reduz o desgaste acumulado.',
    'Identificar o ponto de tensão abre caminho para mudança real.',
    'Encarar o desconforto com curiosidade transforma resistência em aprendizado.',
  ],
  positive: [
    'Janela favorável para consolidar pequenas decisões com consistência.',
    'Momento de agir com intenção — a energia está a seu favor.',
    'Aproveite a fluidez para avançar em projetos que pediram paciência.',
  ],
  neutral: [
    'Boa oportunidade para observar padrões e ajustar o rumo com calma.',
    'Momento propício para revisar intenções e alinhar ação com valores.',
  ],
}

const WATCHOUT_POOL: Record<string, string[]> = {
  alert: [
    'Evite respostas impulsivas; priorize clareza e ritmo sustentável.',
    'Cuidado com decisões tomadas no auge da tensão — espere o pico passar.',
    'Observe o que está sendo ativado internamente antes de agir.',
  ],
  positive: [
    'Não confundir fluidez momentânea com garantia de resultado.',
    'Janelas favoráveis também pedem foco — dispersão dilui a energia.',
    'Aproveite sem pressa; forçar demais pode interromper o fluxo natural.',
  ],
  neutral: [
    'Mantenha expectativas calibradas — tendências são convites, não certezas.',
    'Observe como o padrão aparece no dia a dia antes de tomar grandes decisões.',
  ],
}

const pickFromPool = (pool: string[], seed: string): string => {
  let hash = 0
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  return pool[hash % pool.length]
}

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
    picked.push(MEDIUM_DISCLAIMER_POOL[picked.length % MEDIUM_DISCLAIMER_POOL.length])
  }
  return compact(picked.join(' '))
}

const buildLong = (base: string, medium: string, action: string): string => {
  const paragraphs = splitParagraphs(base)
  const first = sanitizeDeterministicLanguage(paragraphs[0] || medium)
  const second = sanitizeDeterministicLanguage(
    paragraphs[1] || 'Preste atenção a como essa dinâmica se manifesta nas pequenas escolhas do dia — é aí que a mudança começa.'
  )
  const third = sanitizeDeterministicLanguage(action || 'Uma ação simples pode ser suficiente para ancorar a energia deste trânsito na prática.')
  const fourth = sanitizeDeterministicLanguage(
    paragraphs[2] || 'O que, hoje, está pedindo mais presença e menos reação automática?'
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
  const valence = meaning.tensionVsOpportunity
  const seed = meaning.transitKey
  const oppPool = OPPORTUNITY_POOL[valence] ?? OPPORTUNITY_POOL.neutral
  const watchPool = WATCHOUT_POOL[valence] ?? WATCHOUT_POOL.neutral
  const opportunities = [pickFromPool(oppPool, seed)]
  const watchOuts = [pickFromPool(watchPool, seed + '_w')]
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
