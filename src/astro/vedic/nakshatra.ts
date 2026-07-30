/**
 * Nakshatras (27 mansões lunares) + Rashi (signo lunar sideral).
 *
 * A nakshatra de nascimento (Janma Nakshatra) vem da LONGITUDE DA LUA sideral.
 * Cada nakshatra = 13°20'; cada pada (quarto) = 3°20'. O regente segue a ordem
 * Vimshottari (base do Dasha). Yoni/Gana/Nadi alimentam o Guna Milan (sinastria).
 *
 * Tabelas conferidas contra fontes Jyotish padrão (BV Raman). Gana e Nadi são
 * montados a partir de CONJUNTOS DE ÍNDICES canônicos (não linha-a-linha) para
 * evitar erro de transcrição — o teste valida a partição (9/9/9).
 */
import { tropicalToSidereal } from './ayanamsa'

export const NAKSHATRA_ARC = 360 / 27 // 13.3333°
export const PADA_ARC = NAKSHATRA_ARC / 4 // 3.3333°

export type Gana = 'deva' | 'manushya' | 'rakshasa'
export type Nadi = 'adi' | 'madhya' | 'antya'

export interface NakshatraDef {
  index: number // 0–26
  key: string // slug p/ chave de catálogo
  name: string // nome sânscrito
  lord: string // regente Vimshottari (chave lowercase)
  yoni: string // animal (Guna Milan — Yoni Kuta)
  gana: Gana
  nadi: Nadi
}

// Ordem canônica 0–26. [key, name, lord, yoni]
const BASE: Array<[string, string, string, string]> = [
  ['ashwini', 'Ashwini', 'ketu', 'horse'],
  ['bharani', 'Bharani', 'venus', 'elephant'],
  ['krittika', 'Krittika', 'sun', 'sheep'],
  ['rohini', 'Rohini', 'moon', 'serpent'],
  ['mrigashira', 'Mrigashira', 'mars', 'serpent'],
  ['ardra', 'Ardra', 'rahu', 'dog'],
  ['punarvasu', 'Punarvasu', 'jupiter', 'cat'],
  ['pushya', 'Pushya', 'saturn', 'sheep'],
  ['ashlesha', 'Ashlesha', 'mercury', 'cat'],
  ['magha', 'Magha', 'ketu', 'rat'],
  ['purva_phalguni', 'Purva Phalguni', 'venus', 'rat'],
  ['uttara_phalguni', 'Uttara Phalguni', 'sun', 'cow'],
  ['hasta', 'Hasta', 'moon', 'buffalo'],
  ['chitra', 'Chitra', 'mars', 'tiger'],
  ['swati', 'Swati', 'rahu', 'buffalo'],
  ['vishakha', 'Vishakha', 'jupiter', 'tiger'],
  ['anuradha', 'Anuradha', 'saturn', 'deer'],
  ['jyeshtha', 'Jyeshtha', 'mercury', 'deer'],
  ['mula', 'Mula', 'ketu', 'dog'],
  ['purva_ashadha', 'Purva Ashadha', 'venus', 'monkey'],
  ['uttara_ashadha', 'Uttara Ashadha', 'sun', 'mongoose'],
  ['shravana', 'Shravana', 'moon', 'monkey'],
  ['dhanishta', 'Dhanishta', 'mars', 'lion'],
  ['shatabhisha', 'Shatabhisha', 'rahu', 'horse'],
  ['purva_bhadrapada', 'Purva Bhadrapada', 'jupiter', 'lion'],
  ['uttara_bhadrapada', 'Uttara Bhadrapada', 'saturn', 'cow'],
  ['revati', 'Revati', 'mercury', 'elephant'],
]

// Conjuntos canônicos (índices 0–26). Cada um deve ter 9 e os três particionam 0–26.
const GANA_SET: Record<Gana, number[]> = {
  deva: [0, 4, 6, 7, 12, 14, 16, 21, 26],
  manushya: [1, 3, 5, 10, 11, 19, 20, 24, 25],
  rakshasa: [2, 8, 9, 13, 15, 17, 18, 22, 23],
}
const NADI_SET: Record<Nadi, number[]> = {
  adi: [0, 5, 6, 11, 12, 17, 18, 23, 24],
  madhya: [1, 4, 7, 10, 13, 16, 19, 22, 25],
  antya: [2, 3, 8, 9, 14, 15, 20, 21, 26],
}

function ganaOf(i: number): Gana {
  if (GANA_SET.deva.includes(i)) return 'deva'
  if (GANA_SET.manushya.includes(i)) return 'manushya'
  return 'rakshasa'
}
function nadiOf(i: number): Nadi {
  if (NADI_SET.adi.includes(i)) return 'adi'
  if (NADI_SET.madhya.includes(i)) return 'madhya'
  return 'antya'
}

export const NAKSHATRAS: NakshatraDef[] = BASE.map(([key, name, lord, yoni], i) => ({
  index: i, key, name, lord, yoni, gana: ganaOf(i), nadi: nadiOf(i),
}))

// Signos siderais (Rashi) na ordem 0–11.
export const RASHIS: Array<{ key: string; name: string }> = [
  { key: 'mesha', name: 'Áries' }, { key: 'vrishabha', name: 'Touro' },
  { key: 'mithuna', name: 'Gêmeos' }, { key: 'karka', name: 'Câncer' },
  { key: 'simha', name: 'Leão' }, { key: 'kanya', name: 'Virgem' },
  { key: 'tula', name: 'Libra' }, { key: 'vrishchika', name: 'Escorpião' },
  { key: 'dhanu', name: 'Sagitário' }, { key: 'makara', name: 'Capricórnio' },
  { key: 'kumbha', name: 'Aquário' }, { key: 'meena', name: 'Peixes' },
]

export interface NakshatraResult {
  nakshatra: NakshatraDef
  pada: 1 | 2 | 3 | 4
  rashi: { index: number; key: string; name: string }
  siderealLon: number
}

/** Nakshatra + pada + rashi a partir de uma longitude sideral (0–360). */
export function nakshatraFromSidereal(siderealLon: number): NakshatraResult {
  const lon = ((siderealLon % 360) + 360) % 360
  const nIndex = Math.floor(lon / NAKSHATRA_ARC) % 27
  const within = lon - nIndex * NAKSHATRA_ARC
  const pada = (Math.floor(within / PADA_ARC) + 1) as 1 | 2 | 3 | 4
  const rIndex = Math.floor(lon / 30) % 12
  return {
    nakshatra: NAKSHATRAS[nIndex],
    pada,
    rashi: { index: rIndex, key: RASHIS[rIndex].key, name: RASHIS[rIndex].name },
    siderealLon: lon,
  }
}

/** Nakshatra a partir de uma longitude TROPICAL (converte via Lahiri na data). */
export function nakshatraFromTropical(tropicalLon: number, date: Date): NakshatraResult {
  return nakshatraFromSidereal(tropicalToSidereal(tropicalLon, date))
}
