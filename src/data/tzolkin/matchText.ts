// Rótulos e textos do Tzolkin Match ×4. es-ES SEM tildes; it-IT SEM acentos.
type Lang = 'pt-BR' | 'en-US' | 'es-ES' | 'it-IT'
function L(l: string): Lang { return (l === 'en-US' || l === 'es-ES' || l === 'it-IT') ? l : 'pt-BR' }

const TAGS: Record<string, Record<Lang, string>> = {
  'high-sync': { 'pt-BR': 'Alta sintonia', 'en-US': 'High attunement', 'es-ES': 'Alta sintonia', 'it-IT': 'Alta sintonia' },
  'transformative': { 'pt-BR': 'Transformadora', 'en-US': 'Transformative', 'es-ES': 'Transformadora', 'it-IT': 'Trasformativa' },
  'intense': { 'pt-BR': 'Intensa', 'en-US': 'Intense', 'es-ES': 'Intensa', 'it-IT': 'Intensa' },
  'communicative': { 'pt-BR': 'Comunicativa', 'en-US': 'Communicative', 'es-ES': 'Comunicativa', 'it-IT': 'Comunicativa' },
  'rhythm': { 'pt-BR': 'Ritmo em comum', 'en-US': 'Shared rhythm', 'es-ES': 'Ritmo en comun', 'it-IT': 'Ritmo comune' },
  'complementary': { 'pt-BR': 'Complementar', 'en-US': 'Complementary', 'es-ES': 'Complementaria', 'it-IT': 'Complementare' },
  'challenging': { 'pt-BR': 'Desafiadora', 'en-US': 'Challenging', 'es-ES': 'Desafiante', 'it-IT': 'Sfidante' },
  'few-relations': { 'pt-BR': 'Poucas relações diretas', 'en-US': 'Few direct relations', 'es-ES': 'Pocas relaciones directas', 'it-IT': 'Poche relazioni dirette' },
}

const DIMS: Record<string, Record<Lang, string>> = {
  overall: { 'pt-BR': 'Geral', 'en-US': 'Overall', 'es-ES': 'General', 'it-IT': 'Generale' },
  support: { 'pt-BR': 'Apoio', 'en-US': 'Support', 'es-ES': 'Apoyo', 'it-IT': 'Sostegno' },
  growth: { 'pt-BR': 'Crescimento', 'en-US': 'Growth', 'es-ES': 'Crecimiento', 'it-IT': 'Crescita' },
  communication: { 'pt-BR': 'Comunicação', 'en-US': 'Communication', 'es-ES': 'Comunicacion', 'it-IT': 'Comunicazione' },
  rhythm: { 'pt-BR': 'Ritmo', 'en-US': 'Rhythm', 'es-ES': 'Ritmo', 'it-IT': 'Ritmo' },
  intensity: { 'pt-BR': 'Intensidade', 'en-US': 'Intensity', 'es-ES': 'Intensidad', 'it-IT': 'Intensita' },
}

const RELATIONS: Record<string, Record<Lang, string>> = {
  'same-kin': { 'pt-BR': 'Mesmo Kin', 'en-US': 'Same Kin', 'es-ES': 'Mismo Kin', 'it-IT': 'Stesso Kin' },
  'same-seal': { 'pt-BR': 'Mesmo selo', 'en-US': 'Same seal', 'es-ES': 'Mismo sello', 'it-IT': 'Stesso sigillo' },
  'same-tone': { 'pt-BR': 'Mesmo tom', 'en-US': 'Same tone', 'es-ES': 'Mismo tono', 'it-IT': 'Stesso tono' },
  'guide': { 'pt-BR': 'É o Guia', 'en-US': 'Is the Guide', 'es-ES': 'Es la Guia', 'it-IT': 'E la Guida' },
  'analog': { 'pt-BR': 'É o Análogo (apoio)', 'en-US': 'Is the Analog (support)', 'es-ES': 'Es el Analogo (apoyo)', 'it-IT': 'E l Analogo (sostegno)' },
  'antipode': { 'pt-BR': 'É a Antípoda (desafio que fortalece)', 'en-US': 'Is the Antipode (challenge that strengthens)', 'es-ES': 'Es la Antipoda (desafio que fortalece)', 'it-IT': 'E l Antipode (sfida che rafforza)' },
  'occult': { 'pt-BR': 'É o Oculto (poder escondido)', 'en-US': 'Is the Hidden (hidden power)', 'es-ES': 'Es el Oculto (poder escondido)', 'it-IT': 'E l Occulto (potere nascosto)' },
}

const CONN: Record<string, Record<Lang, string>> = {
  'shared-oracle-seal': { 'pt-BR': 'Selo compartilhado nos oráculos', 'en-US': 'Shared seal in the oracles', 'es-ES': 'Sello compartido en los oraculos', 'it-IT': 'Sigillo condiviso negli oracoli' },
  'consecutive-seals': { 'pt-BR': 'Selos consecutivos', 'en-US': 'Consecutive seals', 'es-ES': 'Sellos consecutivos', 'it-IT': 'Sigilli consecutivi' },
  'shared-wavespell': { 'pt-BR': 'Mesma Onda Encantada', 'en-US': 'Same Wavespell', 'es-ES': 'Misma Onda Encantada', 'it-IT': 'Stessa Onda Incantata' },
  'ruling-a-in-family-b': { 'pt-BR': 'Onda de um na Família do outro', 'en-US': 'One’s Wavespell in the other’s Family', 'es-ES': 'Onda de uno en la Familia del otro', 'it-IT': 'Onda di uno nella Famiglia dell altro' },
  'ruling-b-in-family-a': { 'pt-BR': 'Onda de um na Família do outro', 'en-US': 'One’s Wavespell in the other’s Family', 'es-ES': 'Onda de uno en la Familia del otro', 'it-IT': 'Onda di uno nella Famiglia dell altro' },
  'shared-castle': { 'pt-BR': 'Mesmo Castelo', 'en-US': 'Same Castle', 'es-ES': 'Mismo Castillo', 'it-IT': 'Stesso Castello' },
  'shared-family': { 'pt-BR': 'Mesma Família Terrestre', 'en-US': 'Same Earth Family', 'es-ES': 'Misma Familia Terrestre', 'it-IT': 'Stessa Famiglia Terrestre' },
}

const DISCLAIMER: Record<Lang, string> = {
  'pt-BR': 'O Tzolkin Match é um modelo do aplicativo construído sobre relações Dreamspell — não é uma regra tradicional maia de compatibilidade nem uma probabilidade de a relação dar certo. Desafio (Antípoda) não significa incompatibilidade.',
  'en-US': 'Tzolkin Match is an app model built on Dreamspell relations — not a traditional Maya compatibility rule nor a probability that the relationship will work. Challenge (Antipode) does not mean incompatibility.',
  'es-ES': 'Tzolkin Match es un modelo de la app construido sobre relaciones Dreamspell, no una regla maya tradicional de compatibilidad ni una probabilidad de que la relacion funcione. El desafio (Antipoda) no significa incompatibilidad.',
  'it-IT': 'Tzolkin Match e un modello dell app costruito sulle relazioni Dreamspell, non una regola maya tradizionale di compatibilita ne una probabilita che la relazione funzioni. La sfida (Antipode) non significa incompatibilita.',
}

export function tagLabel(key: string, lang: string): string { return (TAGS[key] || {} as any)[L(lang)] || key }
export function dimLabel(key: string, lang: string): string { return (DIMS[key] || {} as any)[L(lang)] || key }
export function relationLabel(key: string, lang: string): string { return (RELATIONS[key] || {} as any)[L(lang)] || key }
export function connLabel(key: string, lang: string): string { return (CONN[key] || {} as any)[L(lang)] || key }
export function matchDisclaimer(lang: string): string { return DISCLAIMER[L(lang)] }
