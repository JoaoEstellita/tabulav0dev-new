// Rótulos e textos do BaZi ×4. es-ES SEM tildes; it-IT SEM acentos.
import type { Element, TenGodKey } from '../../astro/chinese/types'

type Lang = 'pt-BR' | 'en-US' | 'es-ES' | 'it-IT'
function L(l: string): Lang { return (l === 'en-US' || l === 'es-ES' || l === 'it-IT') ? l : 'pt-BR' }

export const ELEMENT_LABEL: Record<Element, Record<Lang, string>> = {
  wood: { 'pt-BR': 'Madeira', 'en-US': 'Wood', 'es-ES': 'Madera', 'it-IT': 'Legno' },
  fire: { 'pt-BR': 'Fogo', 'en-US': 'Fire', 'es-ES': 'Fuego', 'it-IT': 'Fuoco' },
  earth: { 'pt-BR': 'Terra', 'en-US': 'Earth', 'es-ES': 'Tierra', 'it-IT': 'Terra' },
  metal: { 'pt-BR': 'Metal', 'en-US': 'Metal', 'es-ES': 'Metal', 'it-IT': 'Metallo' },
  water: { 'pt-BR': 'Água', 'en-US': 'Water', 'es-ES': 'Agua', 'it-IT': 'Acqua' },
}
export const ELEMENT_HEX: Record<Element, string> = { wood: '#3ecf8e', fire: '#e4572e', earth: '#d0a95c', metal: '#c9ccd6', water: '#3d6fd1' }

export function elementLabel(e: Element, l: string): string { return ELEMENT_LABEL[e][L(l)] }
export function polarityLabel(p: 'yang' | 'yin', l: string): string {
  return p === 'yang' ? 'Yang' : 'Yin'
}

// Dez Deuses — rótulo amigável + termo tradicional (hanzi/pinyin universais).
export const TEN_GOD: Record<TenGodKey, { hanzi: string; pinyin: string; label: Record<Lang, string> }> = {
  'bi-jian': { hanzi: '比肩', pinyin: 'Bǐ Jiān', label: { 'pt-BR': 'Companheiro', 'en-US': 'Companion', 'es-ES': 'Companero', 'it-IT': 'Compagno' } },
  'jie-cai': { hanzi: '劫財', pinyin: 'Jié Cái', label: { 'pt-BR': 'Competição e Autonomia', 'en-US': 'Competition', 'es-ES': 'Competencia', 'it-IT': 'Competizione' } },
  'shi-shen': { hanzi: '食神', pinyin: 'Shí Shén', label: { 'pt-BR': 'Expressão e Prazer', 'en-US': 'Expression', 'es-ES': 'Expresion', 'it-IT': 'Espressione' } },
  'shang-guan': { hanzi: '傷官', pinyin: 'Shāng Guān', label: { 'pt-BR': 'Talento e Ruptura', 'en-US': 'Talent', 'es-ES': 'Talento', 'it-IT': 'Talento' } },
  'pian-cai': { hanzi: '偏財', pinyin: 'Piān Cái', label: { 'pt-BR': 'Oportunidade', 'en-US': 'Opportunity', 'es-ES': 'Oportunidad', 'it-IT': 'Opportunita' } },
  'zheng-cai': { hanzi: '正財', pinyin: 'Zhèng Cái', label: { 'pt-BR': 'Recurso e Constância', 'en-US': 'Resource', 'es-ES': 'Recurso', 'it-IT': 'Risorsa' } },
  'qi-sha': { hanzi: '七殺', pinyin: 'Qī Shā', label: { 'pt-BR': 'Poder e Pressão', 'en-US': 'Power', 'es-ES': 'Poder', 'it-IT': 'Potere' } },
  'zheng-guan': { hanzi: '正官', pinyin: 'Zhèng Guān', label: { 'pt-BR': 'Estrutura e Disciplina', 'en-US': 'Structure', 'es-ES': 'Estructura', 'it-IT': 'Struttura' } },
  'pian-yin': { hanzi: '偏印', pinyin: 'Piān Yìn', label: { 'pt-BR': 'Intuição', 'en-US': 'Intuition', 'es-ES': 'Intuicion', 'it-IT': 'Intuizione' } },
  'zheng-yin': { hanzi: '正印', pinyin: 'Zhèng Yìn', label: { 'pt-BR': 'Apoio e Aprendizado', 'en-US': 'Support', 'es-ES': 'Apoyo', 'it-IT': 'Sostegno' } },
}
export function tenGodLabel(k: TenGodKey, l: string): string { return TEN_GOD[k].label[L(l)] }

// Pilares.
export const PILLAR_LABEL: Record<'year' | 'month' | 'day' | 'hour', { title: Record<Lang, string>; theme: Record<Lang, string> }> = {
  year: { title: { 'pt-BR': 'Ano', 'en-US': 'Year', 'es-ES': 'Año', 'it-IT': 'Anno' }, theme: { 'pt-BR': 'Origens, ancestralidade e contexto social', 'en-US': 'Origins, ancestry and social context', 'es-ES': 'Origenes, ascendencia y contexto social', 'it-IT': 'Origini, antenati e contesto sociale' } },
  month: { title: { 'pt-BR': 'Mês', 'en-US': 'Month', 'es-ES': 'Mes', 'it-IT': 'Mese' }, theme: { 'pt-BR': 'Ambiente formativo, estrutura e carreira', 'en-US': 'Formative environment, structure and career', 'es-ES': 'Ambiente formativo, estructura y carrera', 'it-IT': 'Ambiente formativo, struttura e carriera' } },
  day: { title: { 'pt-BR': 'Dia', 'en-US': 'Day', 'es-ES': 'Dia', 'it-IT': 'Giorno' }, theme: { 'pt-BR': 'Você (Day Master) e as relações íntimas', 'en-US': 'You (Day Master) and intimate relationships', 'es-ES': 'Tu (Day Master) y las relaciones intimas', 'it-IT': 'Tu (Day Master) e le relazioni intime' } },
  hour: { title: { 'pt-BR': 'Hora', 'en-US': 'Hour', 'es-ES': 'Hora', 'it-IT': 'Ora' }, theme: { 'pt-BR': 'Expressão interna, projetos e legado', 'en-US': 'Inner expression, projects and legacy', 'es-ES': 'Expresion interna, proyectos y legado', 'it-IT': 'Espressione interna, progetti e eredita' } },
}
export function pillarTitle(k: 'year' | 'month' | 'day' | 'hour', l: string): string { return PILLAR_LABEL[k].title[L(l)] }
export function pillarTheme(k: 'year' | 'month' | 'day' | 'hour', l: string): string { return PILLAR_LABEL[k].theme[L(l)] }

// Animais es/it (pt/en já vêm das constants).
export const ANIMAL_ESIT: Record<number, { es: string; it: string }> = {
  0: { es: 'Rata', it: 'Ratto' }, 1: { es: 'Buey', it: 'Bue' }, 2: { es: 'Tigre', it: 'Tigre' }, 3: { es: 'Conejo', it: 'Coniglio' },
  4: { es: 'Dragon', it: 'Drago' }, 5: { es: 'Serpiente', it: 'Serpente' }, 6: { es: 'Caballo', it: 'Cavallo' }, 7: { es: 'Cabra', it: 'Capra' },
  8: { es: 'Mono', it: 'Scimmia' }, 9: { es: 'Gallo', it: 'Gallo' }, 10: { es: 'Perro', it: 'Cane' }, 11: { es: 'Cerdo', it: 'Maiale' },
}

export const CHINESE_DISCLAIMER: Record<Lang, string> = {
  'pt-BR': 'BaZi (Quatro Pilares) é uma leitura simbólica — não determina personalidade nem destino. O signo animal é apenas o Ramo do Pilar do Ano; o núcleo é o Day Master. Usamos Lì Chūn para o Pilar do Ano.',
  'en-US': 'BaZi (Four Pillars) is a symbolic reading — it does not determine personality or destiny. The animal sign is only the Year Pillar branch; the core is the Day Master. We use Lì Chūn for the Year Pillar.',
  'es-ES': 'BaZi (Cuatro Pilares) es una lectura simbolica, no determina personalidad ni destino. El signo animal es solo el Ramo del Pilar del Año; el nucleo es el Day Master. Usamos Li Chun para el Pilar del Año.',
  'it-IT': 'BaZi (Quattro Pilastri) e una lettura simbolica, non determina personalita ne destino. Il segno animale e solo il Ramo del Pilastro dell Anno; il nucleo e il Day Master. Usiamo Li Chun per il Pilastro dell Anno.',
}
export function chineseDisclaimer(l: string): string { return CHINESE_DISCLAIMER[L(l)] }
