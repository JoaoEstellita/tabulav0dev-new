// Interpretação GOCHARA (trânsito védico) — regra-based clássica: casa a partir da
// Lua (tema) + natureza do planeta (favorável/desafiador) + Sade Sati/Kantaka Shani.
// Lente = evolução de consciência (aprendizado ativo, sem determinismo).
// es-ES sem tildes; it-IT sem acentos.
import type { GocharaItem } from '../../astro/vedic/gochara'

type Lang = 'pt-BR' | 'en-US' | 'es-ES' | 'it-IT'
function L(l: string): Lang { return (l === 'en-US' || l === 'es-ES' || l === 'it-IT') ? l : 'pt-BR' }

const PLANET_NAME: Record<string, Record<Lang, string>> = {
  Sun: { 'pt-BR': 'Sol', 'en-US': 'Sun', 'es-ES': 'Sol', 'it-IT': 'Sole' },
  Moon: { 'pt-BR': 'Lua', 'en-US': 'Moon', 'es-ES': 'Luna', 'it-IT': 'Luna' },
  Mars: { 'pt-BR': 'Marte', 'en-US': 'Mars', 'es-ES': 'Marte', 'it-IT': 'Marte' },
  Mercury: { 'pt-BR': 'Mercúrio', 'en-US': 'Mercury', 'es-ES': 'Mercurio', 'it-IT': 'Mercurio' },
  Jupiter: { 'pt-BR': 'Júpiter', 'en-US': 'Jupiter', 'es-ES': 'Jupiter', 'it-IT': 'Giove' },
  Venus: { 'pt-BR': 'Vênus', 'en-US': 'Venus', 'es-ES': 'Venus', 'it-IT': 'Venere' },
  Saturn: { 'pt-BR': 'Saturno', 'en-US': 'Saturn', 'es-ES': 'Saturno', 'it-IT': 'Saturno' },
  Rahu: { 'pt-BR': 'Rahu', 'en-US': 'Rahu', 'es-ES': 'Rahu', 'it-IT': 'Rahu' },
  Ketu: { 'pt-BR': 'Ketu', 'en-US': 'Ketu', 'es-ES': 'Ketu', 'it-IT': 'Ketu' },
}

const HOUSE_THEME: Record<Lang, string[]> = {
  'pt-BR': ['', 'a si mesma, corpo e humor', 'recursos, fala e alimentação', 'coragem, iniciativa e irmãos', 'lar, mãe e paz interior', 'criatividade, filhos e romance', 'trabalho, saúde e obstáculos', 'parcerias e relações', 'transformações e o oculto', 'sorte, fé e propósito', 'carreira e ação no mundo', 'ganhos, redes e conquistas', 'descanso, perdas e espiritualidade'],
  'en-US': ['', 'self, body and mood', 'resources, speech and food', 'courage, initiative and siblings', 'home, mother and inner peace', 'creativity, children and romance', 'work, health and obstacles', 'partnerships and relationships', 'transformation and the hidden', 'luck, faith and purpose', 'career and action in the world', 'gains, networks and achievements', 'rest, loss and spirituality'],
  'es-ES': ['', 'el yo, el cuerpo y el animo', 'recursos, habla y alimentacion', 'coraje, iniciativa y hermanos', 'hogar, madre y paz interior', 'creatividad, hijos y romance', 'trabajo, salud y obstaculos', 'sociedades y relaciones', 'transformacion y lo oculto', 'suerte, fe y proposito', 'carrera y accion en el mundo', 'ganancias, redes y logros', 'descanso, perdidas y espiritualidad'],
  'it-IT': ['', 'se stessa, corpo e umore', 'risorse, parola e cibo', 'coraggio, iniziativa e fratelli', 'casa, madre e pace interiore', 'creativita, figli e romanticismo', 'lavoro, salute e ostacoli', 'partnership e relazioni', 'trasformazione e l\'occulto', 'fortuna, fede e scopo', 'carriera e azione nel mondo', 'guadagni, reti e conquiste', 'riposo, perdite e spiritualita'],
}

// Natureza do planeta em trânsito: favorável × desafiador.
const PLANET_TEXT: Record<string, { good: Record<Lang, string>; hard: Record<Lang, string> }> = {
  Sun: { good: { 'pt-BR': 'clareza, energia e reconhecimento fluem', 'en-US': 'clarity, energy and recognition flow', 'es-ES': 'fluyen claridad, energia y reconocimiento', 'it-IT': 'fluiscono chiarezza, energia e riconoscimento' }, hard: { 'pt-BR': 'pressão de ego, cansaço e atritos com quem manda', 'en-US': 'ego pressure, fatigue and friction with authority', 'es-ES': 'presion del ego, cansancio y roces con la autoridad', 'it-IT': 'pressione dell\'ego, stanchezza e attriti con l\'autorita' } },
  Moon: { good: { 'pt-BR': 'estabilidade emocional e boas conexões', 'en-US': 'emotional stability and good connections', 'es-ES': 'estabilidad emocional y buenas conexiones', 'it-IT': 'stabilita emotiva e buone connessioni' }, hard: { 'pt-BR': 'oscilação de humor e sensibilidade à flor da pele', 'en-US': 'mood swings and raw sensitivity', 'es-ES': 'cambios de animo y sensibilidad a flor de piel', 'it-IT': 'sbalzi d\'umore e sensibilita a fior di pelle' } },
  Mars: { good: { 'pt-BR': 'coragem, ação e vitória sobre obstáculos', 'en-US': 'courage, action and victory over obstacles', 'es-ES': 'coraje, accion y victoria sobre los obstaculos', 'it-IT': 'coraggio, azione e vittoria sugli ostacoli' }, hard: { 'pt-BR': 'irritação, pressa e risco de conflito ou acidente', 'en-US': 'irritation, haste and risk of conflict or accident', 'es-ES': 'irritacion, prisa y riesgo de conflicto o accidente', 'it-IT': 'irritazione, fretta e rischio di conflitto o incidente' } },
  Mercury: { good: { 'pt-BR': 'mente afiada, boa comunicação e negócios', 'en-US': 'sharp mind, good communication and deals', 'es-ES': 'mente aguda, buena comunicacion y negocios', 'it-IT': 'mente acuta, buona comunicazione e affari' }, hard: { 'pt-BR': 'ruído mental, mal-entendidos e dispersão', 'en-US': 'mental noise, misunderstandings and scattering', 'es-ES': 'ruido mental, malentendidos y dispersion', 'it-IT': 'rumore mentale, malintesi e dispersione' } },
  Jupiter: { good: { 'pt-BR': 'expansão, sorte, sabedoria e crescimento', 'en-US': 'expansion, luck, wisdom and growth', 'es-ES': 'expansion, suerte, sabiduria y crecimiento', 'it-IT': 'espansione, fortuna, saggezza e crescita' }, hard: { 'pt-BR': 'excesso, otimismo demais ou peso de responsabilidade', 'en-US': 'excess, over-optimism or the weight of responsibility', 'es-ES': 'exceso, optimismo excesivo o peso de la responsabilidad', 'it-IT': 'eccesso, troppo ottimismo o peso della responsabilita' } },
  Venus: { good: { 'pt-BR': 'prazer, afeto, beleza e harmonia nas relações', 'en-US': 'pleasure, affection, beauty and harmony in relationships', 'es-ES': 'placer, afecto, belleza y armonia en las relaciones', 'it-IT': 'piacere, affetto, bellezza e armonia nelle relazioni' }, hard: { 'pt-BR': 'indulgência, dependência afetiva ou desequilíbrio', 'en-US': 'indulgence, emotional dependence or imbalance', 'es-ES': 'indulgencia, dependencia afectiva o desequilibrio', 'it-IT': 'indulgenza, dipendenza affettiva o squilibrio' } },
  Saturn: { good: { 'pt-BR': 'disciplina que consolida e colheita do esforço', 'en-US': 'discipline that consolidates and the harvest of effort', 'es-ES': 'disciplina que consolida y la cosecha del esfuerzo', 'it-IT': 'disciplina che consolida e il raccolto dello sforzo' }, hard: { 'pt-BR': 'peso, atraso e provas que pedem paciência e maturidade', 'en-US': 'weight, delay and tests that ask for patience and maturity', 'es-ES': 'peso, retraso y pruebas que piden paciencia y madurez', 'it-IT': 'peso, ritardo e prove che chiedono pazienza e maturita' } },
  Rahu: { good: { 'pt-BR': 'impulso incomum, oportunidades e ambição', 'en-US': 'unusual drive, opportunities and ambition', 'es-ES': 'impulso inusual, oportunidades y ambicion', 'it-IT': 'spinta insolita, opportunita e ambizione' }, hard: { 'pt-BR': 'obsessão, ilusão e agitação que desestabiliza', 'en-US': 'obsession, illusion and unsettling agitation', 'es-ES': 'obsesion, ilusion y agitacion que desestabiliza', 'it-IT': 'ossessione, illusione e agitazione che destabilizza' } },
  Ketu: { good: { 'pt-BR': 'desapego que liberta e foco espiritual', 'en-US': 'detachment that frees and spiritual focus', 'es-ES': 'desapego que libera y enfoque espiritual', 'it-IT': 'distacco che libera e focus spirituale' }, hard: { 'pt-BR': 'confusão, perda de direção e sensação de vazio', 'en-US': 'confusion, loss of direction and a sense of emptiness', 'es-ES': 'confusion, perdida de rumbo y sensacion de vacio', 'it-IT': 'confusione, perdita di direzione e senso di vuoto' } },
}

const SADE_SATI: Record<Lang, string> = {
  'pt-BR': 'Sade Sati — Saturno transita perto da sua Lua (casa 12, 1 ou 2). Ciclo longo (~7 anos e meio) de amadurecimento profundo: pesa, mas lapida. Menos pressa, mais estrutura e disciplina; cuide da saúde e do emocional. O que se constrói agora com paciência dura.',
  'en-US': 'Sade Sati — Saturn transits near your Moon (house 12, 1 or 2). A long cycle (~7.5 years) of deep maturing: it weighs, but it polishes. Less haste, more structure and discipline; tend to health and emotions. What you build now with patience lasts.',
  'es-ES': 'Sade Sati — Saturno transita cerca de tu Luna (casa 12, 1 o 2). Ciclo largo (~7 anos y medio) de maduracion profunda: pesa, pero pule. Menos prisa, mas estructura y disciplina; cuida la salud y lo emocional. Lo que construyes ahora con paciencia perdura.',
  'it-IT': 'Sade Sati — Saturno transita vicino alla tua Luna (casa 12, 1 o 2). Ciclo lungo (~7 anni e mezzo) di maturazione profonda: pesa, ma leviga. Meno fretta, piu struttura e disciplina; cura salute ed emozioni. Cio che costruisci ora con pazienza dura.',
}

const SHANI_KANTAKA: Record<Lang, string> = {
  'pt-BR': 'Saturno na casa 4 ou 8 da Lua (Kantaka/Ashtama Shani) — fase de fricção: cautela em casa, saúde e finanças; evite decisões precipitadas e cuide do corpo.',
  'en-US': 'Saturn in house 4 or 8 from the Moon (Kantaka/Ashtama Shani) — a phase of friction: caution with home, health and finances; avoid rash decisions and care for the body.',
  'es-ES': 'Saturno en la casa 4 u 8 de la Luna (Kantaka/Ashtama Shani) — fase de friccion: cautela en el hogar, la salud y las finanzas; evita decisiones precipitadas y cuida el cuerpo.',
  'it-IT': 'Saturno in casa 4 o 8 dalla Luna (Kantaka/Ashtama Shani) — fase di attrito: cautela con casa, salute e finanze; evita decisioni affrettate e cura il corpo.',
}

/** Nome localizado do planeta. */
export function planetNameVedic(planet: string, lang: string): string {
  return PLANET_NAME[planet]?.[L(lang)] || planet
}

/** Leitura completa de um item de Gochara. */
export function gocharaReading(item: GocharaItem, lang: string): string {
  const l = L(lang)
  const name = planetNameVedic(item.planet, lang)
  const theme = HOUSE_THEME[l][item.houseFromMoon] || ''
  const nature = item.favorable ? PLANET_TEXT[item.planet]?.good[l] : PLANET_TEXT[item.planet]?.hard[l]
  const conn = l === 'pt-BR' ? 'a partir da Lua' : l === 'en-US' ? 'from the Moon' : l === 'es-ES' ? 'desde la Luna' : 'dalla Luna'
  const retro = item.retro ? (l === 'pt-BR' ? ' (retrógrado)' : l === 'en-US' ? ' (retrograde)' : l === 'es-ES' ? ' (retrogrado)' : ' (retrogrado)') : ''
  let txt = `${name}${retro} transita a casa ${item.houseFromMoon} ${conn} (${theme}) — ${nature}.`
  if (item.sadeSati) txt += `\n⚠️ ${SADE_SATI[l]}`
  else if (item.shaniKantaka) txt += `\n${SHANI_KANTAKA[l]}`
  return txt
}
