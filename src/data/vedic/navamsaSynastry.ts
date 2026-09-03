// Afinidade de NAVAMSA (D9) na sinastria védica — compara o signo D9 da Lua de
// cada pessoa. No Jyotish clássico o D9 rege o casamento; Luas D9 no mesmo signo
// ou em elementos harmônicos indicam vínculo profundo. es-ES sem tildes; it sem acentos.
import { navamsaRashi } from '../../astro/vedic/navamsa'
import { RASHIS } from '../../astro/vedic/nakshatra'

type Lang = 'pt-BR' | 'en-US' | 'es-ES' | 'it-IT'
function L(l: string): Lang { return (l === 'en-US' || l === 'es-ES' || l === 'it-IT') ? l : 'pt-BR' }
type Level = 'excellent' | 'strong' | 'good' | 'challenging'

const READ: Record<Level, Record<Lang, string>> = {
  excellent: {
    'pt-BR': 'Luas no MESMO signo do Navamsa — vínculo de alma raro: familiaridade profunda, como se já se conhecessem. Base forte pra um compromisso duradouro.',
    'en-US': 'Moons in the SAME Navamsa sign — a rare soul bond: deep familiarity, as if you already knew each other. A strong base for lasting commitment.',
    'es-ES': 'Lunas en el MISMO signo del Navamsa — vinculo de alma raro: familiaridad profunda, como si ya se conocieran. Base fuerte para un compromiso duradero.',
    'it-IT': 'Lune nello STESSO segno del Navamsa — legame d\'anima raro: familiarita profonda, come se vi conosceste gia. Base forte per un impegno duraturo.',
  },
  strong: {
    'pt-BR': 'Luas do Navamsa no mesmo elemento — sintonia emocional natural: sentem o mundo de um jeito parecido e se acolhem sem esforço.',
    'en-US': 'Navamsa Moons in the same element — natural emotional attunement: you feel the world alike and hold each other with ease.',
    'es-ES': 'Lunas del Navamsa en el mismo elemento — sintonia emocional natural: sienten el mundo de forma parecida y se acogen sin esfuerzo.',
    'it-IT': 'Lune del Navamsa nello stesso elemento — sintonia emotiva naturale: sentite il mondo in modo simile e vi accogliete senza sforzo.',
  },
  good: {
    'pt-BR': 'Luas do Navamsa em elementos complementares — um estimula o outro: a diferença vira crescimento e movimento, com bom equilíbrio.',
    'en-US': 'Navamsa Moons in complementary elements — you spark each other: the difference becomes growth and movement, with good balance.',
    'es-ES': 'Lunas del Navamsa en elementos complementarios — se estimulan mutuamente: la diferencia se vuelve crecimiento y movimiento, con buen equilibrio.',
    'it-IT': 'Lune del Navamsa in elementi complementari — vi stimolate a vicenda: la differenza diventa crescita e movimento, con buon equilibrio.',
  },
  challenging: {
    'pt-BR': 'Luas do Navamsa em elementos de ritmos diferentes — pede tradução: o que é óbvio pra um não é pro outro. Funciona com escuta e paciência.',
    'en-US': 'Navamsa Moons in elements of different rhythms — it asks for translation: what is obvious to one is not to the other. It works with listening and patience.',
    'es-ES': 'Lunas del Navamsa en elementos de ritmos distintos — pide traduccion: lo obvio para uno no lo es para el otro. Funciona con escucha y paciencia.',
    'it-IT': 'Lune del Navamsa in elementi di ritmi diversi — chiede traduzione: cio che e ovvio per uno non lo e per l\'altro. Funziona con ascolto e pazienza.',
  },
}
const AXIS_NOTE: Record<Lang, string> = {
  'pt-BR': ' As Luas D9 caem no eixo 1–7 (você e o outro) — a polaridade clássica de parceria: atração pela diferença que se completa.',
  'en-US': ' The D9 Moons fall on the 1–7 axis (self and other) — the classic partnership polarity: attraction through the difference that completes.',
  'es-ES': ' Las Lunas D9 caen en el eje 1–7 (yo y el otro) — la polaridad clasica de pareja: atraccion por la diferencia que completa.',
  'it-IT': ' Le Lune D9 cadono sull\'asse 1–7 (io e l\'altro) — la polarita classica di coppia: attrazione per la differenza che completa.',
}
const LEVEL_LABEL: Record<Level, Record<Lang, string>> = {
  excellent: { 'pt-BR': 'excelente', 'en-US': 'excellent', 'es-ES': 'excelente', 'it-IT': 'eccellente' },
  strong: { 'pt-BR': 'forte', 'en-US': 'strong', 'es-ES': 'fuerte', 'it-IT': 'forte' },
  good: { 'pt-BR': 'boa', 'en-US': 'good', 'es-ES': 'buena', 'it-IT': 'buona' },
  challenging: { 'pt-BR': 'requer jogo de cintura', 'en-US': 'needs flexibility', 'es-ES': 'requiere flexibilidad', 'it-IT': 'richiede flessibilita' },
}

const COMPLEMENT = (a: number, b: number) => (a === 0 && b === 2) || (a === 2 && b === 0) || (a === 1 && b === 3) || (a === 3 && b === 1)

export interface NavamsaSynastry { d9A: number; d9B: number; d9AName: string; d9BName: string; level: Level; levelLabel: string; reading: string; color: string }

/** Afinidade Navamsa entre 2 Luas SIDERAIS. null se faltar dado. */
export function navamsaSynastry(moonSidA?: number | null, moonSidB?: number | null, lang: string = 'pt-BR'): NavamsaSynastry | null {
  if (moonSidA == null || moonSidB == null || !Number.isFinite(Number(moonSidA)) || !Number.isFinite(Number(moonSidB))) return null
  const l = L(lang)
  const d9A = navamsaRashi(Number(moonSidA))
  const d9B = navamsaRashi(Number(moonSidB))
  const elA = d9A % 4, elB = d9B % 4
  const axis = ((d9A - d9B + 12) % 12) === 6
  let level: Level
  if (d9A === d9B) level = 'excellent'
  else if (elA === elB) level = 'strong'
  else if (COMPLEMENT(elA, elB)) level = 'good'
  else level = axis ? 'good' : 'challenging'
  let reading = READ[level][l]
  if (axis && d9A !== d9B) reading += AXIS_NOTE[l]
  const color = level === 'excellent' ? '#46d39a' : level === 'strong' ? '#8bd9c0' : level === 'good' ? '#a0c8ff' : '#f0a58c'
  return { d9A, d9B, d9AName: RASHIS[d9A].name, d9BName: RASHIS[d9B].name, level, levelLabel: LEVEL_LABEL[level][l], reading, color }
}
