import type { HeavenlyStem, EarthlyBranch, Element, Polarity, TenGodKey } from './types'

// 10 Troncos Celestiais (甲..癸).
export const STEMS: HeavenlyStem[] = [
  { index: 0, hanzi: '甲', pinyin: 'Jiǎ', element: 'wood', polarity: 'yang', namePt: 'Madeira Yang', nameEn: 'Yang Wood' },
  { index: 1, hanzi: '乙', pinyin: 'Yǐ', element: 'wood', polarity: 'yin', namePt: 'Madeira Yin', nameEn: 'Yin Wood' },
  { index: 2, hanzi: '丙', pinyin: 'Bǐng', element: 'fire', polarity: 'yang', namePt: 'Fogo Yang', nameEn: 'Yang Fire' },
  { index: 3, hanzi: '丁', pinyin: 'Dīng', element: 'fire', polarity: 'yin', namePt: 'Fogo Yin', nameEn: 'Yin Fire' },
  { index: 4, hanzi: '戊', pinyin: 'Wù', element: 'earth', polarity: 'yang', namePt: 'Terra Yang', nameEn: 'Yang Earth' },
  { index: 5, hanzi: '己', pinyin: 'Jǐ', element: 'earth', polarity: 'yin', namePt: 'Terra Yin', nameEn: 'Yin Earth' },
  { index: 6, hanzi: '庚', pinyin: 'Gēng', element: 'metal', polarity: 'yang', namePt: 'Metal Yang', nameEn: 'Yang Metal' },
  { index: 7, hanzi: '辛', pinyin: 'Xīn', element: 'metal', polarity: 'yin', namePt: 'Metal Yin', nameEn: 'Yin Metal' },
  { index: 8, hanzi: '壬', pinyin: 'Rén', element: 'water', polarity: 'yang', namePt: 'Água Yang', nameEn: 'Yang Water' },
  { index: 9, hanzi: '癸', pinyin: 'Guǐ', element: 'water', polarity: 'yin', namePt: 'Água Yin', nameEn: 'Yin Water' },
]

// 12 Ramos Terrestres (子..亥) — polaridade = par(yang)/ímpar(yin).
export const BRANCHES: EarthlyBranch[] = [
  { index: 0, hanzi: '子', pinyin: 'Zǐ', animalPt: 'Rato', animalEn: 'Rat', element: 'water', polarity: 'yang', hourStart: 23, hiddenStems: [9] },
  { index: 1, hanzi: '丑', pinyin: 'Chǒu', animalPt: 'Boi', animalEn: 'Ox', element: 'earth', polarity: 'yin', hourStart: 1, hiddenStems: [5, 9, 7] },
  { index: 2, hanzi: '寅', pinyin: 'Yín', animalPt: 'Tigre', animalEn: 'Tiger', element: 'wood', polarity: 'yang', hourStart: 3, hiddenStems: [0, 2, 4] },
  { index: 3, hanzi: '卯', pinyin: 'Mǎo', animalPt: 'Coelho', animalEn: 'Rabbit', element: 'wood', polarity: 'yin', hourStart: 5, hiddenStems: [1] },
  { index: 4, hanzi: '辰', pinyin: 'Chén', animalPt: 'Dragão', animalEn: 'Dragon', element: 'earth', polarity: 'yang', hourStart: 7, hiddenStems: [4, 1, 9] },
  { index: 5, hanzi: '巳', pinyin: 'Sì', animalPt: 'Serpente', animalEn: 'Snake', element: 'fire', polarity: 'yin', hourStart: 9, hiddenStems: [2, 4, 6] },
  { index: 6, hanzi: '午', pinyin: 'Wǔ', animalPt: 'Cavalo', animalEn: 'Horse', element: 'fire', polarity: 'yang', hourStart: 11, hiddenStems: [3, 5] },
  { index: 7, hanzi: '未', pinyin: 'Wèi', animalPt: 'Cabra', animalEn: 'Goat', element: 'earth', polarity: 'yin', hourStart: 13, hiddenStems: [5, 3, 1] },
  { index: 8, hanzi: '申', pinyin: 'Shēn', animalPt: 'Macaco', animalEn: 'Monkey', element: 'metal', polarity: 'yang', hourStart: 15, hiddenStems: [6, 8, 4] },
  { index: 9, hanzi: '酉', pinyin: 'Yǒu', animalPt: 'Galo', animalEn: 'Rooster', element: 'metal', polarity: 'yin', hourStart: 17, hiddenStems: [7] },
  { index: 10, hanzi: '戌', pinyin: 'Xū', animalPt: 'Cão', animalEn: 'Dog', element: 'earth', polarity: 'yang', hourStart: 19, hiddenStems: [4, 7, 3] },
  { index: 11, hanzi: '亥', pinyin: 'Hài', animalPt: 'Porco', animalEn: 'Pig', element: 'water', polarity: 'yin', hourStart: 21, hiddenStems: [8, 0] },
]

// Longitudes eclípticas (graus) dos 12 Jie que iniciam cada mês BaZi — em ordem
// a partir de 寅 (Lì Chūn 315°). Índice = ordem do mês (0 = 寅).
export const MONTH_JIE_LONGITUDES = [315, 345, 15, 45, 75, 105, 135, 165, 195, 225, 255, 285]
// Ramo de cada mês na mesma ordem (0=寅 ... começa em 2).
export const MONTH_BRANCH_ORDER = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1]

// Wu Xing — geração (sheng) e controle (ke).
export const GENERATES: Record<Element, Element> = { wood: 'fire', fire: 'earth', earth: 'metal', metal: 'water', water: 'wood' }
export const CONTROLS: Record<Element, Element> = { wood: 'earth', earth: 'water', water: 'fire', fire: 'metal', metal: 'wood' }

// Interações entre ramos (tabelas tradicionais).
export const SIX_HARMONIES: [number, number][] = [[0, 1], [2, 11], [3, 10], [4, 9], [5, 8], [6, 7]]
export const SIX_CLASHES: [number, number][] = [[0, 6], [1, 7], [2, 8], [3, 9], [4, 10], [5, 11]]
export const THREE_HARMONIES: { branches: number[]; element: Element }[] = [
  { branches: [8, 0, 4], element: 'water' }, { branches: [11, 3, 7], element: 'wood' },
  { branches: [2, 6, 10], element: 'fire' }, { branches: [5, 9, 1], element: 'metal' },
]
export const HARMS: [number, number][] = [[0, 7], [1, 6], [2, 5], [3, 4], [8, 11], [9, 10]]
export const PUNISHMENTS: number[][] = [[2, 5, 8], [1, 10, 7], [0, 3], [4], [6], [9], [11]]

// Dez Deuses — relação (elemento×polaridade) de um stem vs o Day Master.
export function tenGod(dm: HeavenlyStem, other: HeavenlyStem): TenGodKey {
  const same = other.element === dm.element
  const samePol = other.polarity === dm.polarity
  if (same) return samePol ? 'bi-jian' : 'jie-cai'
  if (GENERATES[dm.element] === other.element) return samePol ? 'shi-shen' : 'shang-guan' // DM produz
  if (CONTROLS[dm.element] === other.element) return samePol ? 'pian-cai' : 'zheng-cai'   // DM controla
  if (CONTROLS[other.element] === dm.element) return samePol ? 'qi-sha' : 'zheng-guan'     // controla DM
  return samePol ? 'pian-yin' : 'zheng-yin'                                                // produz DM
}

// Cinco Tigres: stem do 1º mês (寅) a partir do stem do ano.
export function firstMonthStem(yearStem: number): number { return ((yearStem % 5) * 2 + 2) % 10 }
// Cinco Ratos: stem da 1ª hora (子) a partir do stem do dia.
export function firstHourStem(dayStem: number): number { return ((dayStem % 5) * 2) % 10 }
