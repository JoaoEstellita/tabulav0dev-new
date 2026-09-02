import { STEMS } from '../../astro/chinese/constants'
import { DAY_MASTER_PT } from './dayMasterReadings'
import { elementLabel } from './chineseText'

type Lang = 'pt-BR' | 'en-US' | 'es-ES' | 'it-IT'
function L(l: string): Lang { return (l === 'en-US' || l === 'es-ES' || l === 'it-IT') ? l : 'pt-BR' }

/** Leitura do Day Master. pt-BR rica; en/es/it compostas do elemento+polaridade. */
export function dayMasterReading(stem: number, l: string): string {
  const lang = L(l)
  if (lang === 'pt-BR') {
    const d = DAY_MASTER_PT[stem]
    if (d) return `${d.metaphor}. ${d.essence}\n\n${d.potential}\n\n⚠️ Sombra: ${d.shadow}`
  }
  const s = STEMS[stem]
  const el = elementLabel(s.element, lang), pol = s.polarity === 'yang' ? 'Yang' : 'Yin'
  const t: Record<Lang, string> = {
    'pt-BR': `Seu Day Master é ${s.hanzi} — ${el} ${pol}. É o eixo do seu mapa: como você age, decide e se relaciona partem daqui.`,
    'en-US': `Your Day Master is ${s.hanzi} — ${el} ${pol}. It is the axis of your chart: how you act, decide and relate all stem from here.`,
    'es-ES': `Tu Day Master es ${s.hanzi} — ${el} ${pol}. Es el eje de tu carta: como actuas, decides y te relacionas parten de aqui.`,
    'it-IT': `Il tuo Day Master e ${s.hanzi} — ${el} ${pol}. E l asse della tua carta: come agisci, decidi e ti relazioni partono da qui.`,
  }
  return t[lang]
}
