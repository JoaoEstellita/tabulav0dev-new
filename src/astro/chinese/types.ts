// BaZi (Quatro Pilares) — tipos. Cálculo determinístico; IA só interpreta.

export type Element = 'wood' | 'fire' | 'earth' | 'metal' | 'water'
export type Polarity = 'yang' | 'yin'

export interface HeavenlyStem {
  index: number // 0..9 (甲=0 ... 癸=9)
  hanzi: string; pinyin: string
  element: Element; polarity: Polarity
  namePt: string; nameEn: string
}

export interface EarthlyBranch {
  index: number // 0..11 (子=0 ... 亥=11)
  hanzi: string; pinyin: string
  animalPt: string; animalEn: string
  element: Element; polarity: Polarity
  hourStart: number // hora inicial do ramo (子=23)
  hiddenStems: number[] // índices de stems ocultos (principal, secundário, residual)
}

export interface Pillar {
  stem: number // 0..9
  branch: number // 0..11
  cycleIndex: number // 0..59 (Jiazi)
}

export type TenGodKey =
  | 'bi-jian' | 'jie-cai' | 'shi-shen' | 'shang-guan' | 'pian-cai'
  | 'zheng-cai' | 'qi-sha' | 'zheng-guan' | 'pian-yin' | 'zheng-yin'

export interface FiveElementsCount { wood: number; fire: number; earth: number; metal: number; water: number }

export interface BranchInteraction {
  type: 'six-harmony' | 'six-clash' | 'three-harmony' | 'harm' | 'punishment'
  branches: number[]
  transformsTo?: Element // possível — NÃO assumido sem condições
}

export interface BaziChart {
  year: Pillar; month: Pillar; day: Pillar; hour: Pillar | null
  dayMaster: number // stem do Pilar do Dia (0..9)
  fiveElements: FiveElementsCount
  tenGods: { year: TenGodKey; month: TenGodKey; hour: TenGodKey | null } // do stem de cada pilar vs Day Master
  interactions: BranchInteraction[]
  confidence: 'high' | 'medium' | 'limited' // limited = sem hora
  methodology: { yearBoundary: 'li_chun'; monthBoundary: 'jie'; hourTimeMode: 'true_apparent_solar'; dayBoundaryMode: 'midnight' | 'late_zi_next_day' }
  boundaryWarning?: string
}

export interface ChineseZodiac {
  animalBranch: number // 0..11 (do ano lunar popular)
  lunarYear: number
  element: Element; polarity: Polarity
}

export interface ChineseProfile {
  zodiac: ChineseZodiac
  bazi: BaziChart
  engineVersion: number
  methodologyVersion: number
}
