// Textos do calendário das 13 Luas. Nome da lua = nome do tom (getToneWords);
// aqui ficam os totens (animais) ×4 e os plasmas. es SEM tildes, it SEM acentos.
import { getToneWords } from './tzolkinOverridesI18n'
import { wavespellQuestion } from './reading'

type Lang = 'pt-BR' | 'en-US' | 'es-ES' | 'it-IT'
function L(l: string): Lang { return (l === 'en-US' || l === 'es-ES' || l === 'it-IT') ? l : 'pt-BR' }

const TOTEM: Record<Lang, string[]> = {
  'pt-BR': ['Morcego', 'Escorpião', 'Veado', 'Coruja', 'Pavão', 'Lagarto', 'Macaco', 'Falcão', 'Jaguar', 'Cão', 'Serpente', 'Coelho', 'Tartaruga'],
  'en-US': ['Bat', 'Scorpion', 'Deer', 'Owl', 'Peacock', 'Lizard', 'Monkey', 'Hawk', 'Jaguar', 'Dog', 'Serpent', 'Rabbit', 'Turtle'],
  'es-ES': ['Murcielago', 'Escorpion', 'Ciervo', 'Buho', 'Pavo Real', 'Lagarto', 'Mono', 'Halcon', 'Jaguar', 'Perro', 'Serpiente', 'Conejo', 'Tortuga'],
  'it-IT': ['Pipistrello', 'Scorpione', 'Cervo', 'Gufo', 'Pavone', 'Lucertola', 'Scimmia', 'Falco', 'Giaguaro', 'Cane', 'Serpente', 'Coniglio', 'Tartaruga'],
}

// Plasmas radiais (nomes próprios, iguais nos idiomas).
const PLASMAS = ['Dali', 'Seli', 'Gamma', 'Kali', 'Alpha', 'Limi', 'Silio']

/** Nome da lua: tom + totem (ex.: "Lua Magnética do Morcego"). */
export function moonName(moon: number, l: string): string {
  const lang = L(l)
  const tone = getToneWords(moon, lang)
  const totem = TOTEM[lang][moon - 1] || ''
  const of = lang === 'en-US' ? 'of the' : lang === 'it-IT' ? 'del' : 'do'
  const luna = lang === 'en-US' ? 'Moon' : lang === 'it-IT' ? 'Luna' : lang === 'es-ES' ? 'Luna' : 'Lua'
  return `${luna} ${tone.name} ${of} ${totem}`
}

export function totemName(moon: number, l: string): string { return TOTEM[L(l)][moon - 1] || '' }
export function plasmaName(plasma: number): string { return PLASMAS[plasma - 1] || '' }
/** Pergunta/tema da lua = a mesma câmara da Onda (lua N = tom N). */
export function moonQuestion(moon: number, l: string): string { return wavespellQuestion(moon, l) }
