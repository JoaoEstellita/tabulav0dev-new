export const LIFE_AREA_ORDER = [
  'amor',
  'carreira',
  'financas',
  'saude',
  'familia',
  'espiritualidade',
  'comunicacao',
  'transformacao',
] as const

export type LifeAreaKey = (typeof LIFE_AREA_ORDER)[number]

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

export function getLifeAreaLabel(raw: string | null | undefined): string {
  const key = normalizeLifeArea(raw) || String(raw || '').trim().toLowerCase()
  return LIFE_AREA_LABELS[key as keyof typeof LIFE_AREA_LABELS] || key || 'Área'
}
