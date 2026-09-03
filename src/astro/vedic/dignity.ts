/**
 * Dignidade (estado) planetária védica — exaltado (uchcha), debilitado (neecha),
 * signo próprio (swakshetra), ou amigo/inimigo/neutro (naisargika) pelo regente do
 * signo. Índice de rashi: 0=Áries … 11=Peixes. Puro/determinístico.
 */
export type DignityState = 'exalted' | 'debilitated' | 'own' | 'friend' | 'enemy' | 'neutral'

// Signo de exaltação por planeta (índice 0-11).
const EXALT: Record<string, number> = { Sun: 0, Moon: 1, Mars: 9, Mercury: 5, Jupiter: 3, Venus: 11, Saturn: 6, Rahu: 1, Ketu: 7 }
// Signos próprios.
const OWN: Record<string, number[]> = {
  Sun: [4], Moon: [3], Mars: [0, 7], Mercury: [2, 5], Jupiter: [8, 11], Venus: [1, 6], Saturn: [9, 10],
}
// Regente de cada signo (0-11).
const SIGN_LORD = ['Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter']
// Amizades naturais (naisargika). Fora dessas listas = neutro.
const FRIENDS: Record<string, string[]> = {
  Sun: ['Moon', 'Mars', 'Jupiter'], Moon: ['Sun', 'Mercury'], Mars: ['Sun', 'Moon', 'Jupiter'],
  Mercury: ['Sun', 'Venus'], Jupiter: ['Sun', 'Moon', 'Mars'], Venus: ['Mercury', 'Saturn'], Saturn: ['Mercury', 'Venus'],
}
const ENEMIES: Record<string, string[]> = {
  Sun: ['Venus', 'Saturn'], Moon: [], Mars: ['Mercury'], Mercury: ['Moon'],
  Jupiter: ['Mercury', 'Venus'], Venus: ['Sun', 'Moon'], Saturn: ['Sun', 'Moon', 'Mars'],
}

/** Estado do planeta no signo (rashiIndex 0-11). Nodes: só exalt/debil, senão neutro. */
export function computeDignity(planet: string, rashiIndex: number): DignityState {
  const p = planet
  if (EXALT[p] === rashiIndex) return 'exalted'
  if (EXALT[p] != null && ((EXALT[p] + 6) % 12) === rashiIndex) return 'debilitated'
  if ((OWN[p] || []).includes(rashiIndex)) return 'own'
  const lord = SIGN_LORD[rashiIndex]
  if (!FRIENDS[p]) return 'neutral' // Rahu/Ketu sem tabela de amizade
  if (lord === p) return 'own'
  if ((FRIENDS[p] || []).includes(lord)) return 'friend'
  if ((ENEMIES[p] || []).includes(lord)) return 'enemy'
  return 'neutral'
}

const LABEL: Record<DignityState, Record<string, string>> = {
  exalted: { 'pt-BR': 'Exaltado', 'en-US': 'Exalted', 'es-ES': 'Exaltado', 'it-IT': 'Esaltato' },
  debilitated: { 'pt-BR': 'Debilitado', 'en-US': 'Debilitated', 'es-ES': 'Caido', 'it-IT': 'Caduto' },
  own: { 'pt-BR': 'Signo próprio', 'en-US': 'Own sign', 'es-ES': 'Signo propio', 'it-IT': 'Segno proprio' },
  friend: { 'pt-BR': 'Amigo', 'en-US': 'Friendly', 'es-ES': 'Amigo', 'it-IT': 'Amico' },
  enemy: { 'pt-BR': 'Inimigo', 'en-US': 'Enemy', 'es-ES': 'Enemigo', 'it-IT': 'Nemico' },
  neutral: { 'pt-BR': 'Neutro', 'en-US': 'Neutral', 'es-ES': 'Neutral', 'it-IT': 'Neutro' },
}
const NOTE: Record<DignityState, Record<string, string>> = {
  exalted: { 'pt-BR': 'no auge da sua força — expressa o melhor de si.', 'en-US': 'at peak strength — expresses its best.', 'es-ES': 'en su maxima fuerza — expresa lo mejor de si.', 'it-IT': 'al culmine della forza — esprime il meglio di se.' },
  debilitated: { 'pt-BR': 'em terreno difícil — a energia custa mais e pede consciência (há mitigações no mapa).', 'en-US': 'on hard ground — the energy costs more and asks for awareness (chart can mitigate).', 'es-ES': 'en terreno dificil — la energia cuesta mas y pide conciencia (hay mitigaciones).', 'it-IT': 'su terreno difficile — l\'energia costa di piu e chiede consapevolezza (ci sono mitigazioni).' },
  own: { 'pt-BR': 'em casa — estável, confortável e confiável.', 'en-US': 'at home — stable, comfortable and reliable.', 'es-ES': 'en casa — estable, comodo y confiable.', 'it-IT': 'a casa — stabile, comodo e affidabile.' },
  friend: { 'pt-BR': 'bem acolhido pelo regente do signo — flui com apoio.', 'en-US': 'well received by the sign lord — flows with support.', 'es-ES': 'bien acogido por el regente del signo — fluye con apoyo.', 'it-IT': 'ben accolto dal signore del segno — scorre con sostegno.' },
  enemy: { 'pt-BR': 'em signo do regente rival — mais atrito, pede jogo de cintura.', 'en-US': 'in a rival lord\'s sign — more friction, asks for flexibility.', 'es-ES': 'en signo de regente rival — mas friccion, pide flexibilidad.', 'it-IT': 'in segno del signore rivale — piu attrito, chiede flessibilita.' },
  neutral: { 'pt-BR': 'em terreno neutro — sem reforço nem atrito marcado.', 'en-US': 'on neutral ground — neither boosted nor strained.', 'es-ES': 'en terreno neutral — sin refuerzo ni tension marcada.', 'it-IT': 'su terreno neutro — ne rafforzato ne teso.' },
}
function L(l: string): string { return (l === 'en-US' || l === 'es-ES' || l === 'it-IT') ? l : 'pt-BR' }
export function dignityLabel(st: DignityState, lang: string): string { return LABEL[st][L(lang)] }
export function dignityNote(st: DignityState, lang: string): string { return NOTE[st][L(lang)] }
/** Cor do estado (verde forte → vermelho fraco). */
export function dignityColor(st: DignityState): string {
  return st === 'exalted' ? '#46d39a' : st === 'own' ? '#8bd9c0' : st === 'friend' ? '#a0c8ff'
    : st === 'debilitated' ? '#e4572e' : st === 'enemy' ? '#f0a58c' : '#9c96c6'
}
