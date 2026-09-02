// Composição da leitura Tzolkin nos 4 idiomas a partir de dados estruturados.
// Sem bespoke por Kin — compõe selo/tom/oráculo/família/castelo com templates curtos.
import { getSealWords, getToneWords, ORACLE_ROLE_I18N, FAMILY_I18N, CASTLE_I18N, DISCLAIMER_I18N, type TzLang } from './tzolkinOverridesI18n'
import { TZOLKIN_ORACLE_ROLE_PT, TZOLKIN_FAMILY_PT, TZOLKIN_CASTLE_PT, TZOLKIN_DISCLAIMER_PT } from './tzolkinOverridesPtBR'
import { SEAL_DEEP_PT, TONE_DEEP_PT } from './deepReadings'

function lang(l: string): TzLang {
  if (l === 'en-US' || l === 'es-ES' || l === 'it-IT') return l
  return 'pt-BR'
}

export function readSeal(seal: number, l: string): string {
  const L = lang(l)
  if (L === 'pt-BR') {
    const d = SEAL_DEEP_PT[seal]
    if (d) return `${d.essence}\n\n${d.potential}\n\n⚠️ Sombra: ${d.shadow}\n\n✨ Dom: ${d.gift}`
  }
  const w = getSealWords(seal, L)
  const t: Record<TzLang, string> = {
    'pt-BR': `O selo ${w.name} traz ${w.essence} — seu poder é ${w.power}, sua ação é ${w.action}. Simboliza essa qualidade viva em você, um convite a encarná-la com consciência.`,
    'en-US': `The ${w.name} seal carries ${w.essence} — its power is ${w.power}, expressed through the action to ${w.action}. It symbolizes this quality alive in you, an invitation to embody it consciously.`,
    'es-ES': `El sello ${w.name} trae ${w.essence}: su poder es ${w.power}, expresado en la accion de ${w.action}. Simboliza esta cualidad viva en ti, una invitacion a encarnarla con consciencia.`,
    'it-IT': `Il sigillo ${w.name} porta ${w.essence}: il suo potere e ${w.power}, espresso nell azione di ${w.action}. Simboleggia questa qualita viva in te, un invito a incarnarla con consapevolezza.`,
  }
  return t[L]
}

export function readTone(tone: number, l: string): string {
  const L = lang(l)
  if (L === 'pt-BR') { const d = TONE_DEEP_PT[tone]; if (d) return d }
  const w = getToneWords(tone, L)
  const t: Record<TzLang, string> = {
    'pt-BR': `Tom ${w.name}: essência de ${w.essence}. Traz o poder de ${w.power} e a ação de ${w.action} — a etapa da jornada em que essa força se expressa.`,
    'en-US': `${w.name} tone: essence of ${w.essence}. It brings the power to ${w.power} and the action to ${w.action} — the stage of the journey where this force expresses itself.`,
    'es-ES': `Tono ${w.name}: esencia de ${w.essence}. Trae el poder de ${w.power} y la accion de ${w.action}, la etapa del viaje donde esta fuerza se expresa.`,
    'it-IT': `Tono ${w.name}: essenza di ${w.essence}. Porta il potere di ${w.power} e l azione di ${w.action}, la tappa del viaggio in cui questa forza si esprime.`,
  }
  return t[L]
}

export function readSynthesis(seal: number, tone: number, l: string): string {
  const L = lang(l), s = getSealWords(seal, L), tn = getToneWords(tone, L)
  const t: Record<TzLang, string> = {
    'pt-BR': `${s.name} ${tn.name}: ${s.power} conduzido por ${tn.essence} — ${s.action} com o poder de ${tn.power}.`,
    'en-US': `${s.name} ${tn.name}: ${s.power} led by ${tn.essence} — ${s.action} with the power to ${tn.power}.`,
    'es-ES': `${s.name} ${tn.name}: ${s.power} conducido por ${tn.essence}, ${s.action} con el poder de ${tn.power}.`,
    'it-IT': `${s.name} ${tn.name}: ${s.power} condotto da ${tn.essence}, ${s.action} con il potere di ${tn.power}.`,
  }
  return t[L]
}

// A Onda Encantada é uma jornada de 13 câmaras — cada posição (tom) faz uma
// pergunta. Estrutura canônica do Dreamspell.
const WAVESPELL_Q: Record<TzLang, string[]> = {
  'pt-BR': ['Qual é o meu propósito?', 'Quais são meus obstáculos?', 'Como posso melhor servir?', 'Qual é a forma da minha ação?', 'Como me fortaleço?', 'Como estendo minha igualdade aos outros?', 'Como sintonizo meu serviço com os outros?', 'Vivo aquilo em que acredito?', 'Como realizo meu propósito?', 'Como aperfeiçoo o que faço?', 'Como solto e libero?', 'Como me dedico a tudo que vive?', 'Como expando minha alegria e meu amor?'],
  'en-US': ['What is my purpose?', 'What are my obstacles?', 'How can I best serve?', 'What is the form of my action?', 'How do I empower myself?', 'How do I extend my equality to others?', 'How do I attune my service to others?', 'Do I live what I believe?', 'How do I realize my purpose?', 'How do I perfect what I do?', 'How do I let go and release?', 'How do I dedicate myself to all that lives?', 'How do I expand my joy and love?'],
  'es-ES': ['Cual es mi proposito?', 'Cuales son mis obstaculos?', 'Como puedo servir mejor?', 'Cual es la forma de mi accion?', 'Como me fortalezco?', 'Como extiendo mi igualdad a los demas?', 'Como sintonizo mi servicio con los demas?', 'Vivo lo que creo?', 'Como realizo mi proposito?', 'Como perfecciono lo que hago?', 'Como suelto y libero?', 'Como me dedico a todo lo que vive?', 'Como expando mi alegria y mi amor?'],
  'it-IT': ['Qual e il mio scopo?', 'Quali sono i miei ostacoli?', 'Come posso servire meglio?', 'Qual e la forma della mia azione?', 'Come mi rafforzo?', 'Come estendo la mia uguaglianza agli altri?', 'Come sintonizzo il mio servizio con gli altri?', 'Vivo cio in cui credo?', 'Come realizzo il mio scopo?', 'Come perfeziono cio che faccio?', 'Come lascio andare e libero?', 'Come mi dedico a tutto cio che vive?', 'Come espando la mia gioia e il mio amore?'],
}
/** Pergunta da câmara (posição 1..13) da Onda Encantada. */
export function wavespellQuestion(position: number, l: string): string {
  return (WAVESPELL_Q[lang(l)] || WAVESPELL_Q['pt-BR'])[position - 1] || ''
}

type RoleKey = 'guide' | 'analog' | 'antipode' | 'occult'
export function oracleRole(key: RoleKey, l: string): { title: string; text: string } {
  const L = lang(l)
  return L === 'pt-BR' ? TZOLKIN_ORACLE_ROLE_PT[key] : ORACLE_ROLE_I18N[L][key]
}
export function familyText(key: string, l: string): { title: string; text: string } {
  const L = lang(l)
  return L === 'pt-BR' ? TZOLKIN_FAMILY_PT[key] : FAMILY_I18N[L][key]
}
export function castleText(key: string, l: string): { title: string; text: string } {
  const L = lang(l)
  return L === 'pt-BR' ? TZOLKIN_CASTLE_PT[key] : CASTLE_I18N[L][key]
}
export function disclaimer(l: string): string {
  const L = lang(l)
  return L === 'pt-BR' ? TZOLKIN_DISCLAIMER_PT : DISCLAIMER_I18N[L]
}

// Relação do Kin de hoje com o Kin natal (calculada, nunca inventada).
export function todayRelation(natalKin: number, todayKin: number, oracle: { guide: { kin: number }; analog: { kin: number }; antipode: { kin: number }; occult: { kin: number } }, natalSeal: number, natalTone: number, todaySeal: number, todayTone: number, l: string): string | null {
  const L = lang(l)
  let key: RoleKey | 'same' | 'sameSeal' | 'sameTone' | null = null
  if (todayKin === natalKin) key = 'same'
  else if (todayKin === oracle.guide.kin) key = 'guide'
  else if (todayKin === oracle.analog.kin) key = 'analog'
  else if (todayKin === oracle.antipode.kin) key = 'antipode'
  else if (todayKin === oracle.occult.kin) key = 'occult'
  else if (todaySeal === natalSeal) key = 'sameSeal'
  else if (todayTone === natalTone) key = 'sameTone'
  if (!key) return null
  const map: Record<TzLang, Record<string, string>> = {
    'pt-BR': { same: 'Hoje é o seu próprio Kin — dia de sintonia total.', guide: 'Hoje ocupa a posição de Guia do seu Kin natal.', analog: 'Hoje é o Análogo do seu Kin natal — dia de apoio.', antipode: 'Hoje é a Antípoda do seu Kin natal — desafio que fortalece.', occult: 'Hoje é o Oculto do seu Kin natal — potencial escondido.', sameSeal: 'Hoje compartilha o selo do seu Kin natal.', sameTone: 'Hoje compartilha o tom do seu Kin natal.' },
    'en-US': { same: 'Today is your own Kin — a day of full attunement.', guide: 'Today holds the Guide position of your natal Kin.', analog: 'Today is the Analog of your natal Kin — a day of support.', antipode: 'Today is the Antipode of your natal Kin — a challenge that strengthens.', occult: 'Today is the Hidden of your natal Kin — hidden potential.', sameSeal: 'Today shares the seal of your natal Kin.', sameTone: 'Today shares the tone of your natal Kin.' },
    'es-ES': { same: 'Hoy es tu propio Kin, dia de sintonia total.', guide: 'Hoy ocupa la posicion de Guia de tu Kin natal.', analog: 'Hoy es el Analogo de tu Kin natal, dia de apoyo.', antipode: 'Hoy es la Antipoda de tu Kin natal, desafio que fortalece.', occult: 'Hoy es el Oculto de tu Kin natal, potencial escondido.', sameSeal: 'Hoy comparte el sello de tu Kin natal.', sameTone: 'Hoy comparte el tono de tu Kin natal.' },
    'it-IT': { same: 'Oggi e il tuo stesso Kin, giorno di piena sintonia.', guide: 'Oggi occupa la posizione di Guida del tuo Kin natale.', analog: 'Oggi e l Analogo del tuo Kin natale, giorno di sostegno.', antipode: 'Oggi e l Antipode del tuo Kin natale, sfida che rafforza.', occult: 'Oggi e l Occulto del tuo Kin natale, potenziale nascosto.', sameSeal: 'Oggi condivide il sigillo del tuo Kin natale.', sameTone: 'Oggi condivide il tono del tuo Kin natale.' },
  }
  return map[L][key]
}
