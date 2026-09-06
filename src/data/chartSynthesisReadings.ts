// Textos da SÍNTESE do mapa + composer que monta o parágrafo de "Visão Geral".
// Regras i18n: en-US sem "will"; es-ES sem tildes; it-IT sem acentos.
import type { AppLanguage } from '../i18n/appI18n'
import type { ChartSynthesis, ElementKey, ModalityKey } from '../astro/chartSynthesis'

type L = Record<AppLanguage, string>

const ELEMENT_DOMINANT: Record<ElementKey, L> = {
  fire: { 'pt-BR': 'ênfase em Fogo — você é caloroso, entusiasta e movido à ação: vive pela vontade, pela inspiração e pelo impulso de criar e agir', 'en-US': 'a Fire emphasis — you are warm, enthusiastic and action-driven: you live by will, inspiration and the urge to create and act', 'es-ES': 'enfasis en Fuego: eres calido, entusiasta y movido a la accion, vives por la voluntad, la inspiracion y el impulso de crear y actuar', 'it-IT': 'enfasi sul Fuoco: sei caloroso, entusiasta e mosso all\'azione, vivi per la volonta, l\'ispirazione e l\'impulso di creare e agire' },
  earth: { 'pt-BR': 'ênfase em Terra — você é prático, concreto e confiável: constrói no mundo material e valoriza o tangível, a estabilidade e o que dá pra sustentar', 'en-US': 'an Earth emphasis — you are practical, concrete and reliable: you build in the material world and value the tangible, stability and what can be sustained', 'es-ES': 'enfasis en Tierra: eres practico, concreto y confiable, construyes en el mundo material y valoras lo tangible, la estabilidad y lo que se puede sostener', 'it-IT': 'enfasi sulla Terra: sei pratico, concreto e affidabile, costruisci nel mondo materiale e dai valore al tangibile, alla stabilita e a cio che si puo sostenere' },
  air: { 'pt-BR': 'ênfase em Ar — você é mental, comunicativo e social: vive pelas ideias, pelas conexões e pelas trocas, e costuma pensar antes de sentir', 'en-US': 'an Air emphasis — you are mental, communicative and social: you live by ideas, connections and exchange, and tend to think before you feel', 'es-ES': 'enfasis en Aire: eres mental, comunicativo y social, vives por las ideas, las conexiones y los intercambios, y sueles pensar antes de sentir', 'it-IT': 'enfasi sull\'Aria: sei mentale, comunicativo e sociale, vivi per le idee, le connessioni e gli scambi, e tendi a pensare prima di sentire' },
  water: { 'pt-BR': 'ênfase em Água — você é sensível, emocional e intuitivo: sente tudo fundo e se guia pelo coração, pela memória afetiva e pela intuição', 'en-US': 'a Water emphasis — you are sensitive, emotional and intuitive: you feel everything deeply and are guided by the heart, emotional memory and intuition', 'es-ES': 'enfasis en Agua: eres sensible, emocional e intuitivo, sientes todo hondo y te guias por el corazon, la memoria afectiva y la intuicion', 'it-IT': 'enfasi sull\'Acqua: sei sensibile, emotivo e intuitivo, senti tutto in profondita e ti guidi col cuore, la memoria affettiva e l\'intuizione' },
}

const ELEMENT_LACKING: Record<ElementKey, L> = {
  fire: { 'pt-BR': 'Fogo é o elemento mais ausente — pode faltar impulso e entusiasmo; cultivar coragem, iniciativa e espontaneidade equilibra o mapa', 'en-US': 'Fire is the most absent element — drive and enthusiasm may run low; cultivating courage, initiative and spontaneity balances the chart', 'es-ES': 'el Fuego es el elemento mas ausente: puede faltar impulso y entusiasmo; cultivar coraje, iniciativa y espontaneidad equilibra el mapa', 'it-IT': 'il Fuoco e l\'elemento piu assente: possono mancare slancio ed entusiasmo; coltivare coraggio, iniziativa e spontaneita riequilibra la carta' },
  earth: { 'pt-BR': 'Terra é o elemento mais ausente — pode faltar praticidade e aterramento; cultivar rotina, concretude e cuidado com o corpo equilibra o mapa', 'en-US': 'Earth is the most absent element — practicality and grounding may run low; cultivating routine, concreteness and body care balances the chart', 'es-ES': 'la Tierra es el elemento mas ausente: puede faltar practicidad y arraigo; cultivar rutina, concrecion y cuidado del cuerpo equilibra el mapa', 'it-IT': 'la Terra e l\'elemento piu assente: possono mancare praticita e radicamento; coltivare routine, concretezza e cura del corpo riequilibra la carta' },
  air: { 'pt-BR': 'Ar é o elemento mais ausente — pode faltar distância mental e objetividade; cultivar comunicação, leveza e o olhar de fora equilibra o mapa', 'en-US': 'Air is the most absent element — mental distance and objectivity may run low; cultivating communication, lightness and an outside view balances the chart', 'es-ES': 'el Aire es el elemento mas ausente: puede faltar distancia mental y objetividad; cultivar comunicacion, ligereza y la mirada de afuera equilibra el mapa', 'it-IT': 'l\'Aria e l\'elemento piu assente: possono mancare distanza mentale e obiettivita; coltivare comunicazione, leggerezza e lo sguardo da fuori riequilibra la carta' },
  water: { 'pt-BR': 'Água é o elemento mais ausente — pode faltar contato emocional e empatia; cultivar a escuta do sentir e a vulnerabilidade equilibra o mapa', 'en-US': 'Water is the most absent element — emotional contact and empathy may run low; cultivating attunement to feeling and vulnerability balances the chart', 'es-ES': 'el Agua es el elemento mas ausente: puede faltar contacto emocional y empatia; cultivar la escucha del sentir y la vulnerabilidad equilibra el mapa', 'it-IT': 'l\'Acqua e l\'elemento piu assente: possono mancare contatto emotivo ed empatia; coltivare l\'ascolto del sentire e la vulnerabilita riequilibra la carta' },
}

const MODALITY_DOMINANT: Record<ModalityKey, L> = {
  cardinal: { 'pt-BR': 'De temperamento iniciador (Cardeal): você começa, lidera e abre caminhos — tem energia de largada e gosta de fazer as coisas acontecerem', 'en-US': 'An initiating temperament (Cardinal): you start, lead and open paths — you carry starting energy and like to make things happen', 'es-ES': 'De temperamento iniciador (Cardinal): comienzas, lideras y abres caminos, tienes energia de arranque y te gusta hacer que las cosas pasen', 'it-IT': 'Di temperamento iniziatore (Cardinale): cominci, guidi e apri strade, hai energia di partenza e ami far accadere le cose' },
  fixed: { 'pt-BR': 'De temperamento sustentador (Fixo): você mantém, aprofunda e persiste — tem foco, lealdade e a força de levar as coisas até o fim', 'en-US': 'A sustaining temperament (Fixed): you hold, deepen and persist — you have focus, loyalty and the strength to see things through', 'es-ES': 'De temperamento sostenedor (Fijo): mantienes, profundizas y persistes, tienes foco, lealtad y la fuerza de llevar las cosas hasta el final', 'it-IT': 'Di temperamento sostenitore (Fisso): mantieni, approfondisci e persisti, hai concentrazione, lealta e la forza di portare le cose fino in fondo' },
  mutable: { 'pt-BR': 'De temperamento adaptável (Mutável): você flui, ajusta e transita com facilidade — tem versatilidade e a leveza de mudar quando é preciso', 'en-US': 'An adaptable temperament (Mutable): you flow, adjust and shift with ease — you have versatility and the lightness to change when needed', 'es-ES': 'De temperamento adaptable (Mutable): fluyes, ajustas y transitas con facilidad, tienes versatilidad y la ligereza de cambiar cuando hace falta', 'it-IT': 'Di temperamento adattabile (Mobile): fluisci, ti adatti e transiti con facilita, hai versatilita e la leggerezza di cambiare quando serve' },
}

const HEMISPHERE: Record<'upper' | 'lower' | 'eastern' | 'western', L> = {
  upper: { 'pt-BR': 'A maioria dos seus planetas está acima do horizonte: sua vida se volta pro mundo — relações, realização pública e o que você constrói para fora', 'en-US': 'Most of your planets sit above the horizon: your life turns toward the world — relationships, public achievement and what you build outwardly', 'es-ES': 'La mayoria de tus planetas esta sobre el horizonte: tu vida se vuelca al mundo, las relaciones, la realizacion publica y lo que construyes hacia afuera', 'it-IT': 'La maggior parte dei tuoi pianeti sta sopra l\'orizzonte: la tua vita si volge al mondo, le relazioni, la realizzazione pubblica e cio che costruisci verso fuori' },
  lower: { 'pt-BR': 'A maioria dos seus planetas está abaixo do horizonte: sua vida se volta pra dentro — raízes, mundo pessoal e uma construção que começa no íntimo', 'en-US': 'Most of your planets sit below the horizon: your life turns inward — roots, personal world and a building that starts within', 'es-ES': 'La mayoria de tus planetas esta bajo el horizonte: tu vida se vuelca hacia dentro, las raices, el mundo personal y una construccion que empieza en lo intimo', 'it-IT': 'La maggior parte dei tuoi pianeti sta sotto l\'orizzonte: la tua vita si volge dentro, le radici, il mondo personale e una costruzione che parte dall\'intimo' },
  eastern: { 'pt-BR': 'Com os planetas concentrados a leste do mapa, você conduz o próprio destino: age por iniciativa própria e molda as circunstâncias à sua volta', 'en-US': 'With planets gathered on the eastern side, you steer your own destiny: you act on your own initiative and shape the circumstances around you', 'es-ES': 'Con los planetas concentrados al este del mapa, conduces tu propio destino: actuas por iniciativa propia y moldeas las circunstancias a tu alrededor', 'it-IT': 'Con i pianeti concentrati a est della carta, guidi il tuo destino: agisci di tua iniziativa e plasmi le circostanze attorno a te' },
  western: { 'pt-BR': 'Com os planetas concentrados a oeste do mapa, você se realiza através dos outros e das circunstâncias: o encontro e a resposta ao mundo te movem', 'en-US': 'With planets gathered on the western side, you fulfill yourself through others and circumstances: encounter and response to the world move you', 'es-ES': 'Con los planetas concentrados al oeste del mapa, te realizas a traves de los demas y las circunstancias: el encuentro y la respuesta al mundo te mueven', 'it-IT': 'Con i pianeti concentrati a ovest della carta, ti realizzi attraverso gli altri e le circostanze: l\'incontro e la risposta al mondo ti muovono' },
}

const HOUSE_AREA: Record<number, L> = {
  1: { 'pt-BR': 'identidade e presença', 'en-US': 'identity and presence', 'es-ES': 'identidad y presencia', 'it-IT': 'identita e presenza' },
  2: { 'pt-BR': 'valores e recursos', 'en-US': 'values and resources', 'es-ES': 'valores y recursos', 'it-IT': 'valori e risorse' },
  3: { 'pt-BR': 'mente e comunicação', 'en-US': 'mind and communication', 'es-ES': 'mente y comunicacion', 'it-IT': 'mente e comunicazione' },
  4: { 'pt-BR': 'lar e raízes', 'en-US': 'home and roots', 'es-ES': 'hogar y raices', 'it-IT': 'casa e radici' },
  5: { 'pt-BR': 'criação, amor e prazer', 'en-US': 'creativity, love and pleasure', 'es-ES': 'creacion, amor y placer', 'it-IT': 'creazione, amore e piacere' },
  6: { 'pt-BR': 'trabalho e saúde', 'en-US': 'work and health', 'es-ES': 'trabajo y salud', 'it-IT': 'lavoro e salute' },
  7: { 'pt-BR': 'relações e parcerias', 'en-US': 'relationships and partnerships', 'es-ES': 'relaciones y parejas', 'it-IT': 'relazioni e partnership' },
  8: { 'pt-BR': 'intimidade e transformação', 'en-US': 'intimacy and transformation', 'es-ES': 'intimidad y transformacion', 'it-IT': 'intimita e trasformazione' },
  9: { 'pt-BR': 'sentido, fé e expansão', 'en-US': 'meaning, faith and expansion', 'es-ES': 'sentido, fe y expansion', 'it-IT': 'senso, fede ed espansione' },
  10: { 'pt-BR': 'carreira e imagem pública', 'en-US': 'career and public image', 'es-ES': 'carrera e imagen publica', 'it-IT': 'carriera e immagine pubblica' },
  11: { 'pt-BR': 'comunidade e projetos', 'en-US': 'community and projects', 'es-ES': 'comunidad y proyectos', 'it-IT': 'comunita e progetti' },
  12: { 'pt-BR': 'interioridade e espiritualidade', 'en-US': 'inner life and spirituality', 'es-ES': 'interioridad y espiritualidad', 'it-IT': 'interiorita e spiritualita' },
}

const STELLIUM_HOUSE: L = {
  'pt-BR': 'Há um stellium (concentração de forças) na Casa {n} — a área de {area} vira um tema central e forte da sua vida.',
  'en-US': 'There is a stellium (a concentration of forces) in House {n} — the area of {area} becomes a central, strong theme of your life.',
  'es-ES': 'Hay un stellium (concentracion de fuerzas) en la Casa {n}: el area de {area} se vuelve un tema central y fuerte de tu vida.',
  'it-IT': 'C\'e uno stellium (concentrazione di forze) nella Casa {n}: l\'area di {area} diventa un tema centrale e forte della tua vita.',
}
const STELLIUM_SIGN: L = {
  'pt-BR': 'Há um stellium no signo de {sign} — essa energia se acentua muito e colore fortemente o seu jeito.',
  'en-US': 'There is a stellium in {sign} — that energy is strongly accentuated and deeply colors who you are.',
  'es-ES': 'Hay un stellium en el signo de {sign}: esa energia se acentua mucho y colorea con fuerza tu manera de ser.',
  'it-IT': 'C\'e uno stellium nel segno di {sign}: quell\'energia si accentua molto e colora fortemente il tuo modo di essere.',
}

const OPENER: L = {
  'pt-BR': 'No conjunto, seu mapa tem ',
  'en-US': 'As a whole, your chart has ',
  'es-ES': 'En conjunto, tu mapa tiene ',
  'it-IT': 'Nel complesso, la tua carta ha ',
}

function tl(l: AppLanguage, m: L): string { return m[l] || m['pt-BR'] }

/**
 * Monta o parágrafo de Visão Geral a partir da síntese. `signName` traduz o signo
 * do stellium para o idioma (a tela já tem essa função). Retorna '' se nada relevante.
 */
export function composeChartSynthesis(
  s: ChartSynthesis,
  language: AppLanguage,
  signName?: (sign: string) => string,
): string {
  const parts: string[] = []

  // Frase 1: elemento dominante + modalidade.
  if (s.dominantElement) {
    let f = tl(language, OPENER) + tl(language, ELEMENT_DOMINANT[s.dominantElement]) + '.'
    parts.push(f)
  }
  if (s.dominantModality) parts.push(tl(language, MODALITY_DOMINANT[s.dominantModality]) + '.')
  if (s.lackingElement) parts.push(tl(language, ELEMENT_LACKING[s.lackingElement]) + '.')

  // Hemisférios (vertical + horizontal se houver ênfase clara).
  if (s.hemisphereVertical) parts.push(tl(language, HEMISPHERE[s.hemisphereVertical]) + '.')
  if (s.hemisphereHorizontal) parts.push(tl(language, HEMISPHERE[s.hemisphereHorizontal]) + '.')

  // Stelliums (no máximo 2, do maior).
  for (const st of s.stelliums.slice(0, 2)) {
    if (st.kind === 'house') {
      const n = Number(st.where)
      const area = HOUSE_AREA[n] ? tl(language, HOUSE_AREA[n]) : ''
      parts.push(tl(language, STELLIUM_HOUSE).replace('{n}', String(n)).replace('{area}', area))
    } else {
      const sign = signName ? signName(st.where) : st.where
      parts.push(tl(language, STELLIUM_SIGN).replace('{sign}', sign))
    }
  }

  return parts.join(' ')
}
