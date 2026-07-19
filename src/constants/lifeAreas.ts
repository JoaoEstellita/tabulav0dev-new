export const LIFE_AREA_ORDER = [
  'amor',
  'saude',
  'familia',
  'comunicacao',
  'carreira',
  'financas',
  'espiritualidade',
  'transformacao',
] as const

export type LifeAreaKey = (typeof LIFE_AREA_ORDER)[number]

// Ordem de exibição dos cards SÓ na tela inicial (Home). Mesmas áreas de
// LIFE_AREA_ORDER, ordem própria — não afeta Groups/Forecast/notificações.
export const HOME_LIFE_AREA_ORDER: readonly LifeAreaKey[] = [
  'amor',
  'saude',
  'familia',
  'comunicacao',
  'carreira',
  'financas',
  'espiritualidade',
  'transformacao',
]

/**
 * A que área cada casa e cada planeta pertence.
 *
 * Era `private static LIFE_AREAS` dentro do RealAstrologyEngine — o motor
 * pontuava as áreas por aqui, mas nenhuma tela conseguia dizer ao usuário QUAL
 * área um trânsito afeta, porque o mapa não saía de lá. Agora é fonte única: o
 * motor importa daqui, e as telas também.
 */
export const LIFE_AREA_ATTRIBUTION: Record<
  LifeAreaKey,
  { houses: number[]; planets: string[]; weight: number }
> = {
  amor: { houses: [5, 7], planets: ['Venus', 'Mars'], weight: 1.0 },
  carreira: { houses: [10, 6], planets: ['Saturn', 'Mars', 'Sun'], weight: 1.0 },
  financas: { houses: [2, 8], planets: ['Venus', 'Jupiter'], weight: 1.0 },
  saude: { houses: [1, 6], planets: ['Mars', 'Sun'], weight: 1.0 },
  familia: { houses: [4, 10], planets: ['Moon', 'Saturn'], weight: 1.0 },
  espiritualidade: { houses: [9, 12], planets: ['Neptune', 'Jupiter'], weight: 1.0 },
  comunicacao: { houses: [3, 9], planets: ['Mercury', 'Uranus'], weight: 1.0 },
  transformacao: { houses: [8, 12], planets: ['Pluto', 'Uranus'], weight: 1.0 },
}

export const LIFE_AREA_LABELS: Record<string, string> = {
  amor: 'Amor',
  carreira: 'Carreira',
  financas: 'Finanças',
  saude: 'Saúde',
  familia: 'Família',
  espiritualidade: 'Espiritualidade',
  comunicacao: 'Comunicação',
  transformacao: 'Transformação',
  love: 'Amor e Relacionamentos',
  career: 'Carreira e Finanças',
  health: 'Saúde e Bem-estar',
  family: 'Família e Amizades',
  spirituality: 'Espiritualidade e Crescimento',
  finances: 'Finanças',
  communication: 'Comunicação',
  transformation: 'Transformação',
}

export const LIFE_AREA_COLORS: Record<string, string[]> = {
  amor: ['#FF6B9D', '#FF8E8E'],
  carreira: ['#4ECDC4', '#44A08D'],
  financas: ['#FFD93D', '#FF9F40'],
  saude: ['#96E6A1', '#7BC142'],
  familia: ['#FF9F40', '#FFD93D'],
  espiritualidade: ['#B19CD9', '#8B5CF6'],
  comunicacao: ['#60A5FA', '#3B82F6'],
  transformacao: ['#F472B6', '#EC4899'],
  love: ['#FF6B9D', '#FF8E8E'],
  career: ['#4ECDC4', '#44A08D'],
  health: ['#96E6A1', '#7BC142'],
  family: ['#FFD93D', '#FF9F40'],
  spirituality: ['#B19CD9', '#8B5CF6'],
  finances: ['#FFD93D', '#FF9F40'],
  communication: ['#60A5FA', '#3B82F6'],
  transformation: ['#F472B6', '#EC4899'],
}

export const LIFE_AREA_ICONS: Record<string, string> = {
  amor: 'heart',
  carreira: 'briefcase',
  financas: 'cash',
  saude: 'fitness',
  familia: 'people',
  espiritualidade: 'flower',
  comunicacao: 'chatbubble',
  transformacao: 'refresh',
  love: 'heart',
  career: 'briefcase',
  health: 'fitness',
  family: 'people',
  spirituality: 'flower',
  finances: 'cash',
  communication: 'chatbubble',
  transformation: 'refresh',
}

const LIFE_AREA_MAP: Record<string, string | null> = {
  love: 'amor',
  relationship: 'amor',
  relationships: 'amor',
  romance: 'amor',
  career: 'carreira',
  work: 'carreira',
  job: 'carreira',
  money: 'financas',
  finance: 'financas',
  finances: 'financas',
  health: 'saude',
  wellbeing: 'saude',
  family: 'familia',
  home: 'familia',
  spirituality: 'espiritualidade',
  spiritual: 'espiritualidade',
  communication: 'comunicacao',
  communicate: 'comunicacao',
  transformation: 'transformacao',
  transform: 'transformacao',
  emotions: null,
  emotion: null,
  energy: null,
  mood: null,
}

export function normalizeLifeArea(raw: string | null | undefined): string | null {
  const key = String(raw || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
  if (!key) return null
  if (Object.prototype.hasOwnProperty.call(LIFE_AREA_MAP, key)) {
    return LIFE_AREA_MAP[key]
  }
  if (LIFE_AREA_ORDER.includes(key as LifeAreaKey)) return key
  return null
}

export const normalizeDomain = normalizeLifeArea

export function getLifeAreaLabel(raw: string | null | undefined): string {
  const key = normalizeLifeArea(raw) || String(raw || '').trim().toLowerCase()
  return LIFE_AREA_LABELS[key as keyof typeof LIFE_AREA_LABELS] || key || 'Área'
}
