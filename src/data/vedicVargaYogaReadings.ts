/**
 * Interpretações dos VARGAS (D7/D10/D12) e dos YOGAS védicos × 4 idiomas.
 * Regras i18n: en-US sem "will"; es-ES sem tildes; it-IT sem acentos.
 * Usado pelo perfil védico (app) e pelo agente WhatsApp (cópia no backend).
 */

export type VLang = 'pt-BR' | 'en-US' | 'es-ES' | 'it-IT'

interface DomainText { title: string; intro: string }

// Domínio de cada varga (o QUE ele revela) + como ler o Ascendente do varga.
const VARGA_DOMAIN: Record<'D7' | 'D10' | 'D12', Record<VLang, DomainText>> = {
  D7: {
    'pt-BR': { title: 'D7 · Saptamsha — Filhos e criação', intro: 'O mapa dos *filhos, da fertilidade e do que você gera no mundo* (não só filhos — projetos, frutos criativos, legado). Mostra a qualidade da sua capacidade de criar e nutrir.' },
    'en-US': { title: 'D7 · Saptamsha — Children and creation', intro: 'The chart of *children, fertility and what you bring into the world* (not only children — projects, creative fruits, legacy). It shows the quality of your power to create and nurture.' },
    'es-ES': { title: 'D7 · Saptamsha — Hijos y creacion', intro: 'El mapa de los *hijos, la fertilidad y lo que generas en el mundo* (no solo hijos — proyectos, frutos creativos, legado). Muestra la calidad de tu capacidad de crear y nutrir.' },
    'it-IT': { title: 'D7 · Saptamsha — Figli e creazione', intro: 'La mappa dei *figli, della fertilita e di cio che generi nel mondo* (non solo figli — progetti, frutti creativi, eredita). Mostra la qualita della tua capacita di creare e nutrire.' },
  },
  D10: {
    'pt-BR': { title: 'D10 · Dashamsha — Carreira e vocação', intro: 'O mapa da *carreira, da ação no mundo e do reconhecimento* — como o seu karma-yoga (ação com propósito) se realiza. É o divisional mais importante depois do D9 para vida profissional.' },
    'en-US': { title: 'D10 · Dashamsha — Career and vocation', intro: 'The chart of *career, action in the world and recognition* — how your karma-yoga (purposeful action) unfolds. The most important divisional after D9 for professional life.' },
    'es-ES': { title: 'D10 · Dashamsha — Carrera y vocacion', intro: 'El mapa de la *carrera, la accion en el mundo y el reconocimiento* — como tu karma-yoga (accion con proposito) se realiza. El divisional mas importante despues del D9 para la vida profesional.' },
    'it-IT': { title: 'D10 · Dashamsha — Carriera e vocazione', intro: 'La mappa della *carriera, dell azione nel mondo e del riconoscimento* — come il tuo karma-yoga (azione con scopo) si realizza. Il divisionale piu importante dopo il D9 per la vita professionale.' },
  },
  D12: {
    'pt-BR': { title: 'D12 · Dwadashamsha — Pais e ancestralidade', intro: 'O mapa dos *pais, das raízes e da herança ancestral* — o que veio da sua linhagem (dons e padrões) e o karma familiar que você carrega e transforma.' },
    'en-US': { title: 'D12 · Dwadashamsha — Parents and ancestry', intro: 'The chart of *parents, roots and ancestral inheritance* — what came from your lineage (gifts and patterns) and the family karma you carry and transform.' },
    'es-ES': { title: 'D12 · Dwadashamsha — Padres y ancestralidad', intro: 'El mapa de los *padres, las raices y la herencia ancestral* — lo que vino de tu linaje (dones y patrones) y el karma familiar que cargas y transformas.' },
    'it-IT': { title: 'D12 · Dwadashamsha — Genitori e ascendenza', intro: 'La mappa dei *genitori, delle radici e dell eredita ancestrale* — cio che viene dalla tua stirpe (doni e schemi) e il karma familiare che porti e trasformi.' },
  },
}

// Traço curto de cada signo (rashiIndex 0-11) — reusado pra ler o Ascendente do varga.
const SIGN_TRAIT: Record<VLang, string[]> = {
  'pt-BR': ['iniciativa e coragem', 'estabilidade e valor', 'comunicação e versatilidade', 'cuidado e raízes', 'brilho e liderança', 'método e serviço', 'harmonia e parceria', 'profundidade e poder', 'expansão e sentido', 'estrutura e ambição', 'originalidade e visão', 'sensibilidade e entrega'],
  'en-US': ['initiative and courage', 'stability and worth', 'communication and versatility', 'care and roots', 'shine and leadership', 'method and service', 'harmony and partnership', 'depth and power', 'expansion and meaning', 'structure and ambition', 'originality and vision', 'sensitivity and surrender'],
  'es-ES': ['iniciativa y coraje', 'estabilidad y valor', 'comunicacion y versatilidad', 'cuidado y raices', 'brillo y liderazgo', 'metodo y servicio', 'armonia y sociedad', 'profundidad y poder', 'expansion y sentido', 'estructura y ambicion', 'originalidad y vision', 'sensibilidad y entrega'],
  'it-IT': ['iniziativa e coraggio', 'stabilita e valore', 'comunicazione e versatilita', 'cura e radici', 'luce e leadership', 'metodo e servizio', 'armonia e partnership', 'profondita e potere', 'espansione e senso', 'struttura e ambizione', 'originalita e visione', 'sensibilita e dedizione'],
}

const SIGN_NAME: Record<VLang, string[]> = {
  'pt-BR': ['Áries', 'Touro', 'Gêmeos', 'Câncer', 'Leão', 'Virgem', 'Libra', 'Escorpião', 'Sagitário', 'Capricórnio', 'Aquário', 'Peixes'],
  'en-US': ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'],
  'es-ES': ['Aries', 'Tauro', 'Geminis', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'],
  'it-IT': ['Ariete', 'Toro', 'Gemelli', 'Cancro', 'Leone', 'Vergine', 'Bilancia', 'Scorpione', 'Sagittario', 'Capricorno', 'Acquario', 'Pesci'],
}

interface YogaText { name: string; meaning: string }

const YOGA: Record<string, Record<VLang, YogaText>> = {
  gaja_kesari: {
    'pt-BR': { name: 'Gaja-Kesari', meaning: 'Júpiter forte em relação à Lua — yoga de *sabedoria, boa reputação e fortuna*. Inteligência que inspira confiança; tende a trazer respeito e proteção ao longo da vida.' },
    'en-US': { name: 'Gaja-Kesari', meaning: 'Jupiter strong in relation to the Moon — a yoga of *wisdom, good reputation and fortune*. An intelligence that inspires trust; tends to bring respect and protection through life.' },
    'es-ES': { name: 'Gaja-Kesari', meaning: 'Jupiter fuerte respecto a la Luna — yoga de *sabiduria, buena reputacion y fortuna*. Inteligencia que inspira confianza; suele traer respeto y proteccion en la vida.' },
    'it-IT': { name: 'Gaja-Kesari', meaning: 'Giove forte rispetto alla Luna — yoga di *saggezza, buona reputazione e fortuna*. Un intelligenza che ispira fiducia; tende a portare rispetto e protezione nella vita.' },
  },
  budha_aditya: {
    'pt-BR': { name: 'Budha-Aditya', meaning: 'Sol e Mercúrio juntos — yoga de *inteligência, comunicação e mente ágil*. Facilidade para aprender, expressar e brilhar pelo intelecto e pela palavra.' },
    'en-US': { name: 'Budha-Aditya', meaning: 'Sun and Mercury together — a yoga of *intelligence, communication and a quick mind*. Ease to learn, express and shine through intellect and words.' },
    'es-ES': { name: 'Budha-Aditya', meaning: 'Sol y Mercurio juntos — yoga de *inteligencia, comunicacion y mente agil*. Facilidad para aprender, expresar y brillar por el intelecto y la palabra.' },
    'it-IT': { name: 'Budha-Aditya', meaning: 'Sole e Mercurio insieme — yoga di *intelligenza, comunicazione e mente agile*. Facilita nell imparare, esprimere e brillare per intelletto e parola.' },
  },
  chandra_mangala: {
    'pt-BR': { name: 'Chandra-Mangala', meaning: 'Lua e Marte juntos — yoga de *força emocional, iniciativa e ganho pelo esforço*. Energia para agir sobre o que sente; prosperidade construída com garra.' },
    'en-US': { name: 'Chandra-Mangala', meaning: 'Moon and Mars together — a yoga of *emotional strength, initiative and gain through effort*. Energy to act on what you feel; prosperity built with grit.' },
    'es-ES': { name: 'Chandra-Mangala', meaning: 'Luna y Marte juntos — yoga de *fuerza emocional, iniciativa y ganancia por el esfuerzo*. Energia para actuar sobre lo que sientes; prosperidad construida con garra.' },
    'it-IT': { name: 'Chandra-Mangala', meaning: 'Luna e Marte insieme — yoga di *forza emotiva, iniziativa e guadagno con lo sforzo*. Energia per agire su cio che senti; prosperita costruita con grinta.' },
  },
  ruchaka: {
    'pt-BR': { name: 'Ruchaka (Mahapurusha)', meaning: 'Marte digno e angular — yoga de *coragem, liderança e vitalidade*. Presença forte, capacidade de comando e ação decidida.' },
    'en-US': { name: 'Ruchaka (Mahapurusha)', meaning: 'Mars dignified and angular — a yoga of *courage, leadership and vitality*. Strong presence, command and decisive action.' },
    'es-ES': { name: 'Ruchaka (Mahapurusha)', meaning: 'Marte digno y angular — yoga de *coraje, liderazgo y vitalidad*. Presencia fuerte, mando y accion decidida.' },
    'it-IT': { name: 'Ruchaka (Mahapurusha)', meaning: 'Marte dignitoso e angolare — yoga di *coraggio, leadership e vitalita*. Presenza forte, comando e azione decisa.' },
  },
  bhadra: {
    'pt-BR': { name: 'Bhadra (Mahapurusha)', meaning: 'Mercúrio digno e angular — yoga de *inteligência, eloquência e habilidade*. Mente brilhante para negócios, escrita e comunicação.' },
    'en-US': { name: 'Bhadra (Mahapurusha)', meaning: 'Mercury dignified and angular — a yoga of *intelligence, eloquence and skill*. A brilliant mind for business, writing and communication.' },
    'es-ES': { name: 'Bhadra (Mahapurusha)', meaning: 'Mercurio digno y angular — yoga de *inteligencia, elocuencia y habilidad*. Mente brillante para negocios, escritura y comunicacion.' },
    'it-IT': { name: 'Bhadra (Mahapurusha)', meaning: 'Mercurio dignitoso e angolare — yoga di *intelligenza, eloquenza e abilita*. Mente brillante per affari, scrittura e comunicazione.' },
  },
  hamsa: {
    'pt-BR': { name: 'Hamsa (Mahapurusha)', meaning: 'Júpiter digno e angular — yoga de *sabedoria, ética e graça*. Espírito elevado, respeitado por conhecimento e bondade.' },
    'en-US': { name: 'Hamsa (Mahapurusha)', meaning: 'Jupiter dignified and angular — a yoga of *wisdom, ethics and grace*. An elevated spirit, respected for knowledge and kindness.' },
    'es-ES': { name: 'Hamsa (Mahapurusha)', meaning: 'Jupiter digno y angular — yoga de *sabiduria, etica y gracia*. Espiritu elevado, respetado por conocimiento y bondad.' },
    'it-IT': { name: 'Hamsa (Mahapurusha)', meaning: 'Giove dignitoso e angolare — yoga di *saggezza, etica e grazia*. Spirito elevato, rispettato per conoscenza e bonta.' },
  },
  malavya: {
    'pt-BR': { name: 'Malavya (Mahapurusha)', meaning: 'Vênus digno e angular — yoga de *beleza, prazer e refinamento*. Charme, talento artístico e vida com conforto e harmonia.' },
    'en-US': { name: 'Malavya (Mahapurusha)', meaning: 'Venus dignified and angular — a yoga of *beauty, pleasure and refinement*. Charm, artistic talent and a life of comfort and harmony.' },
    'es-ES': { name: 'Malavya (Mahapurusha)', meaning: 'Venus digno y angular — yoga de *belleza, placer y refinamiento*. Encanto, talento artistico y una vida con confort y armonia.' },
    'it-IT': { name: 'Malavya (Mahapurusha)', meaning: 'Venere dignitoso e angolare — yoga di *bellezza, piacere e raffinatezza*. Fascino, talento artistico e una vita di comfort e armonia.' },
  },
  sasa: {
    'pt-BR': { name: 'Sasa (Mahapurusha)', meaning: 'Saturno digno e angular — yoga de *disciplina, autoridade e resiliência*. Poder construído com paciência; liderança que dura.' },
    'en-US': { name: 'Sasa (Mahapurusha)', meaning: 'Saturn dignified and angular — a yoga of *discipline, authority and resilience*. Power built with patience; leadership that lasts.' },
    'es-ES': { name: 'Sasa (Mahapurusha)', meaning: 'Saturno digno y angular — yoga de *disciplina, autoridad y resiliencia*. Poder construido con paciencia; liderazgo que perdura.' },
    'it-IT': { name: 'Sasa (Mahapurusha)', meaning: 'Saturno dignitoso e angolare — yoga di *disciplina, autorita e resilienza*. Potere costruito con pazienza; leadership che dura.' },
  },
}

export function vargaDomain(id: 'D7' | 'D10' | 'D12', lang: VLang): DomainText | null {
  return VARGA_DOMAIN[id]?.[lang] || VARGA_DOMAIN[id]?.['pt-BR'] || null
}
export function signName(idx: number, lang: VLang): string {
  return (SIGN_NAME[lang] || SIGN_NAME['pt-BR'])[((idx % 12) + 12) % 12] || ''
}
export function signTrait(idx: number, lang: VLang): string {
  return (SIGN_TRAIT[lang] || SIGN_TRAIT['pt-BR'])[((idx % 12) + 12) % 12] || ''
}
export function yogaText(id: string, lang: VLang): YogaText | null {
  return YOGA[id]?.[lang] || YOGA[id]?.['pt-BR'] || null
}
export function hasYoga(id: string): boolean {
  return !!YOGA[id]
}
