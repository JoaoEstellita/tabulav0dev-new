// Composição da leitura Tzolkin nos 4 idiomas a partir de dados estruturados.
// Sem bespoke por Kin — compõe selo/tom/oráculo/família/castelo com templates curtos.
import { getSealWords, getToneWords, ORACLE_ROLE_I18N, FAMILY_I18N, CASTLE_I18N, DISCLAIMER_I18N, type TzLang } from './tzolkinOverridesI18n'
import { TZOLKIN_ORACLE_ROLE_PT, TZOLKIN_FAMILY_PT, TZOLKIN_CASTLE_PT, TZOLKIN_DISCLAIMER_PT } from './tzolkinOverridesPtBR'

function lang(l: string): TzLang {
  if (l === 'en-US' || l === 'es-ES' || l === 'it-IT') return l
  return 'pt-BR'
}

export function readSeal(seal: number, l: string): string {
  const L = lang(l), w = getSealWords(seal, L)
  const t: Record<TzLang, string> = {
    'pt-BR': `O selo ${w.name} traz ${w.essence} — seu poder é ${w.power}, sua ação é ${w.action}.`,
    'en-US': `The ${w.name} seal carries ${w.essence} — its power is ${w.power}, its action is ${w.action}.`,
    'es-ES': `El sello ${w.name} trae ${w.essence}: su poder es ${w.power}, su accion es ${w.action}.`,
    'it-IT': `Il sigillo ${w.name} porta ${w.essence}: il suo potere e ${w.power}, la sua azione e ${w.action}.`,
  }
  return t[L]
}

export function readTone(tone: number, l: string): string {
  const L = lang(l), w = getToneWords(tone, L)
  const t: Record<TzLang, string> = {
    'pt-BR': `Tom ${w.name}: essência de ${w.essence}. Poder de ${w.power}, ação de ${w.action}.`,
    'en-US': `${w.name} tone: essence of ${w.essence}. Power to ${w.power}, action to ${w.action}.`,
    'es-ES': `Tono ${w.name}: esencia de ${w.essence}. Poder de ${w.power}, accion de ${w.action}.`,
    'it-IT': `Tono ${w.name}: essenza di ${w.essence}. Potere di ${w.power}, azione di ${w.action}.`,
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
