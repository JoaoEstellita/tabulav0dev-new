// Leitura de PLANETA RETRÓGRADO NO NASCIMENTO. Um planeta retrógrado no mapa não é
// defeito: sua energia é INTERNALIZADA — processada por dentro antes de sair, com um
// ritmo de revisão e amadurecimento próprio. Sol e Lua NUNCA retrogradam.
// Regras i18n: en-US sem "will"; es-ES sem tildes; it-IT sem acentos.
import type { AppLanguage } from '../i18n/appI18n'

// Chave = nome do planeta em inglês (como vem do engine).
export const NATAL_RETROGRADE_READINGS: Record<string, Record<AppLanguage, string>> = {
  Mercury: {
    'pt-BR': 'Sua mente processa por dentro antes de falar: você pensa em espiral, revisa e entende reprocessando — não na primeira passada. Pode ter demorado a se sentir à vontade para se expressar, mas a compreensão que vem é mais profunda e original. Aprender e comunicar do seu jeito, sem pressa, é a chave.',
    'en-US': 'Your mind processes inwardly before speaking: you think in spirals, review, and understand by reprocessing — not on the first pass. You may have taken a while to feel at ease expressing yourself, but the understanding that comes is deeper and more original. Learning and communicating your own way, without rushing, is the key.',
    'es-ES': 'Tu mente procesa por dentro antes de hablar: piensas en espiral, revisas y comprendes reprocesando, no a la primera. Puede que tardaras en sentirte comodo expresandote, pero la comprension que llega es mas profunda y original. Aprender y comunicar a tu manera, sin prisa, es la clave.',
    'it-IT': 'La tua mente elabora dentro prima di parlare: pensi a spirale, rivedi e capisci rielaborando, non al primo passaggio. Forse hai impiegato tempo a sentirti a tuo agio nell\'esprimerti, ma la comprensione che arriva e piu profonda e originale. Imparare e comunicare a modo tuo, senza fretta, e la chiave.',
  },
  Venus: {
    'pt-BR': 'Você revê por dentro o próprio valor e o modo de amar. O afeto e o gosto não seguem o padrão de fora: pode amar de forma pouco convencional, ou levar tempo para reconhecer o que (e quem) realmente merece você. Aprende sobre amor e dinheiro reavaliando — e o autovalor que constrói assim é sólido.',
    'en-US': 'You review your own worth and your way of loving from within. Affection and taste do not follow the outer norm: you may love in unconventional ways, or take time to recognize what — and who — truly deserves you. You learn about love and money by reappraising — and the self-worth you build this way is solid.',
    'es-ES': 'Revisas por dentro tu propio valor y tu manera de amar. El afecto y el gusto no siguen el patron de afuera: puedes amar de forma poco convencional, o tardar en reconocer lo que (y quien) de verdad te merece. Aprendes sobre el amor y el dinero reevaluando, y el autovalor que construyes asi es solido.',
    'it-IT': 'Rivedi dentro il tuo valore e il tuo modo di amare. L\'affetto e il gusto non seguono la norma esterna: puoi amare in modo poco convenzionale, o metterci tempo a riconoscere cosa (e chi) ti merita davvero. Impari sull\'amore e sul denaro rivalutando, e l\'autostima che costruisci cosi e solida.',
  },
  Mars: {
    'pt-BR': 'Sua energia e seu desejo voltam-se para dentro antes de agir: você rumina, planeja e só então se lança — a assertividade amadurece com o tempo. A raiva costuma ser contida ou estratégica, não explosiva. Aprender a afirmar o que quer sem culpa, no seu próprio ritmo, é a sua conquista.',
    'en-US': 'Your energy and desire turn inward before acting: you ruminate, plan, and only then launch — assertiveness matures over time. Anger tends to be contained or strategic, not explosive. Learning to assert what you want without guilt, at your own pace, is your achievement.',
    'es-ES': 'Tu energia y tu deseo se vuelven hacia dentro antes de actuar: rumias, planeas y solo entonces te lanzas; la asertividad madura con el tiempo. La ira suele ser contenida o estrategica, no explosiva. Aprender a afirmar lo que quieres sin culpa, a tu ritmo, es tu conquista.',
    'it-IT': 'La tua energia e il tuo desiderio si volgono dentro prima di agire: rimugini, pianifichi e solo allora ti lanci; l\'assertivita matura col tempo. La rabbia tende a essere contenuta o strategica, non esplosiva. Imparare ad affermare cio che vuoi senza colpa, al tuo ritmo, e la tua conquista.',
  },
  Jupiter: {
    'pt-BR': 'Você busca fé, sentido e crescimento por dentro, não em dogmas ou fórmulas de fora. Sua filosofia de vida é construída revendo crenças e experiências próprias — a expansão vem da sabedoria interior, não da aprovação externa. Confiar no seu senso de propósito é o que te faz florescer.',
    'en-US': 'You seek faith, meaning and growth from within, not in outer dogmas or formulas. Your life philosophy is built by revising your own beliefs and experiences — expansion comes from inner wisdom, not external approval. Trusting your own sense of purpose is what makes you flourish.',
    'es-ES': 'Buscas fe, sentido y crecimiento por dentro, no en dogmas o formulas de afuera. Tu filosofia de vida se construye revisando creencias y experiencias propias; la expansion viene de la sabiduria interior, no de la aprobacion externa. Confiar en tu sentido de proposito es lo que te hace florecer.',
    'it-IT': 'Cerchi fede, senso e crescita dentro di te, non in dogmi o formule esterne. La tua filosofia di vita si costruisce rivedendo credenze ed esperienze proprie: l\'espansione viene dalla saggezza interiore, non dall\'approvazione esterna. Fidarti del tuo senso di scopo e cio che ti fa fiorire.',
  },
  Saturn: {
    'pt-BR': 'A autoridade e a estrutura são vividas por dentro: você é seu próprio juiz mais duro e constrói disciplina revendo regras, limites e a figura do pai/autoridade. O medo e a autocobrança, trabalhados, viram maturidade rara. Aprender a se validar por dentro — sem esperar o aval de fora — liberta.',
    'en-US': 'Authority and structure are lived inwardly: you are your own harshest judge, and you build discipline by revising rules, limits and the father/authority figure. Fear and self-demand, once worked through, become rare maturity. Learning to validate yourself from within — without waiting for outside approval — sets you free.',
    'es-ES': 'La autoridad y la estructura se viven por dentro: eres tu juez mas duro y construyes disciplina revisando reglas, limites y la figura del padre/autoridad. El miedo y la autoexigencia, trabajados, se vuelven madurez rara. Aprender a validarte por dentro, sin esperar el aval de afuera, libera.',
    'it-IT': 'L\'autorita e la struttura si vivono dentro: sei il tuo giudice piu severo e costruisci disciplina rivedendo regole, limiti e la figura del padre/autorita. La paura e l\'autoesigenza, elaborate, diventano maturita rara. Imparare a convalidarti dentro, senza aspettare l\'avallo esterno, libera.',
  },
  Uranus: {
    'pt-BR': 'Geracional, mas com cor pessoal: a ruptura e a originalidade são vividas por dentro. Sua rebeldia e seu gênio criativo trabalham em silêncio, e a libertação que você busca começa numa mudança interna antes de aparecer fora.',
    'en-US': 'Generational, yet personally colored: rupture and originality are lived inwardly. Your rebellion and creative genius work in silence, and the freedom you seek begins as an inner shift before showing outside.',
    'es-ES': 'Generacional, pero con color personal: la ruptura y la originalidad se viven por dentro. Tu rebeldia y tu genio creativo trabajan en silencio, y la liberacion que buscas empieza en un cambio interno antes de aparecer afuera.',
    'it-IT': 'Generazionale, ma con colore personale: la rottura e l\'originalita si vivono dentro. La tua ribellione e il tuo genio creativo lavorano in silenzio, e la liberazione che cerchi comincia in un cambiamento interno prima di apparire fuori.',
  },
  Neptune: {
    'pt-BR': 'Geracional: a sensibilidade, o sonho e a espiritualidade são processados nas profundezas internas. Sua imaginação e sua fé se voltam para dentro — o contato com o sutil acontece no silêncio, não no palco.',
    'en-US': 'Generational: sensitivity, dream and spirituality are processed in the inner depths. Your imagination and faith turn inward — contact with the subtle happens in silence, not on stage.',
    'es-ES': 'Generacional: la sensibilidad, el sueno y la espiritualidad se procesan en las profundidades internas. Tu imaginacion y tu fe se vuelven hacia dentro; el contacto con lo sutil ocurre en el silencio, no en el escenario.',
    'it-IT': 'Generazionale: la sensibilita, il sogno e la spiritualita si elaborano nelle profondita interne. La tua immaginazione e la tua fede si volgono dentro: il contatto col sottile avviene nel silenzio, non sul palco.',
  },
  Pluto: {
    'pt-BR': 'Geracional: o poder e a transformação operam nas camadas mais profundas de você. A intensidade e a capacidade de renascer trabalham por dentro, longe dos olhos — o que se transmuta em silêncio depois muda tudo.',
    'en-US': 'Generational: power and transformation operate in your deepest layers. Intensity and the capacity to be reborn work inwardly, away from view — what transmutes in silence later changes everything.',
    'es-ES': 'Generacional: el poder y la transformacion operan en las capas mas profundas de ti. La intensidad y la capacidad de renacer trabajan por dentro, lejos de la vista; lo que se transmuta en silencio luego lo cambia todo.',
    'it-IT': 'Generazionale: il potere e la trasformazione operano negli strati piu profondi di te. L\'intensita e la capacita di rinascere lavorano dentro, lontano dagli occhi: cio che si trasmuta in silenzio poi cambia tutto.',
  },
}

/** Resolve o texto do planeta retrógrado natal (fallback pt-BR). null se sem catálogo. */
export function resolveNatalRetrograde(planet: string, language: AppLanguage): string | null {
  const byLang = NATAL_RETROGRADE_READINGS[planet]
  if (!byLang) return null
  return byLang[language] || byLang['pt-BR']
}
