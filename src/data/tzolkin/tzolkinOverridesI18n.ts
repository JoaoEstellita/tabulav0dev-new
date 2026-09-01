// Tzolkin Dreamspell — dados localizados. pt-BR e en-US vêm das constants;
// aqui ficam es-ES (SEM tildes) e it-IT (SEM acentos) das palavras de selo/tom,
// e os textos de papel/família/castelo/disclaimer nos 4 idiomas.
import { SEALS, TONES } from '../../astro/tzolkin/constants'

export type TzLang = 'pt-BR' | 'en-US' | 'es-ES' | 'it-IT'
export interface Words { name: string; power: string; action: string; essence: string }

// [name, power, action, essence] — índice 0 = selo 1.
const SEAL_ES: [string, string, string, string][] = [
  ['Dragon', 'Nacimiento', 'Nutrir', 'Ser'],
  ['Viento', 'Espiritu', 'Comunicar', 'Aliento'],
  ['Noche', 'Abundancia', 'Sonar', 'Intuicion'],
  ['Semilla', 'Florecimiento', 'Enfocar', 'Conciencia'],
  ['Serpiente', 'Fuerza Vital', 'Sobrevivir', 'Instinto'],
  ['Enlazador de Mundos', 'Muerte', 'Igualar', 'Oportunidad'],
  ['Mano', 'Realizacion', 'Conocer', 'Sanacion'],
  ['Estrella', 'Elegancia', 'Embellecer', 'Arte'],
  ['Luna', 'Agua Universal', 'Purificar', 'Flujo'],
  ['Perro', 'Corazon', 'Amar', 'Lealtad'],
  ['Mono', 'Magia', 'Jugar', 'Ilusion'],
  ['Humano', 'Libre Albedrio', 'Influir', 'Sabiduria'],
  ['Caminante del Cielo', 'Espacio', 'Explorar', 'Vigilia'],
  ['Mago', 'Atemporalidad', 'Encantar', 'Receptividad'],
  ['Aguila', 'Vision', 'Crear', 'Mente'],
  ['Guerrero', 'Inteligencia', 'Cuestionar', 'Intrepidez'],
  ['Tierra', 'Navegacion', 'Evolucionar', 'Sincronicidad'],
  ['Espejo', 'Sin Fin', 'Reflejar', 'Orden'],
  ['Tormenta', 'Autogeneracion', 'Catalizar', 'Energia'],
  ['Sol', 'Fuego Universal', 'Iluminar', 'Vida'],
]
const SEAL_IT: [string, string, string, string][] = [
  ['Drago', 'Nascita', 'Nutrire', 'Essere'],
  ['Vento', 'Spirito', 'Comunicare', 'Respiro'],
  ['Notte', 'Abbondanza', 'Sognare', 'Intuizione'],
  ['Seme', 'Fioritura', 'Focalizzare', 'Consapevolezza'],
  ['Serpente', 'Forza Vitale', 'Sopravvivere', 'Istinto'],
  ['Congiuntore di Mondi', 'Morte', 'Equalizzare', 'Opportunita'],
  ['Mano', 'Realizzazione', 'Conoscere', 'Guarigione'],
  ['Stella', 'Eleganza', 'Abbellire', 'Arte'],
  ['Luna', 'Acqua Universale', 'Purificare', 'Flusso'],
  ['Cane', 'Cuore', 'Amare', 'Lealta'],
  ['Scimmia', 'Magia', 'Giocare', 'Illusione'],
  ['Umano', 'Libero Arbitrio', 'Influenzare', 'Saggezza'],
  ['Viandante del Cielo', 'Spazio', 'Esplorare', 'Vigilanza'],
  ['Mago', 'Atemporalita', 'Incantare', 'Ricettivita'],
  ['Aquila', 'Visione', 'Creare', 'Mente'],
  ['Guerriero', 'Intelligenza', 'Interrogare', 'Coraggio'],
  ['Terra', 'Navigazione', 'Evolvere', 'Sincronicita'],
  ['Specchio', 'Senza Fine', 'Riflettere', 'Ordine'],
  ['Tempesta', 'Autogenerazione', 'Catalizzare', 'Energia'],
  ['Sole', 'Fuoco Universale', 'Illuminare', 'Vita'],
]
// [name, essence, power, action] — índice 0 = tom 1.
const TONE_ES: [string, string, string, string][] = [
  ['Magnetico', 'Proposito', 'Unificar', 'Atraer'],
  ['Lunar', 'Desafio', 'Polarizar', 'Estabilizar'],
  ['Electrico', 'Servicio', 'Activar', 'Vincular'],
  ['Autoexistente', 'Forma', 'Definir', 'Medir'],
  ['Entonado', 'Radiancia', 'Potenciar', 'Comandar'],
  ['Ritmico', 'Igualdad', 'Organizar', 'Equilibrar'],
  ['Resonante', 'Sintonia', 'Canalizar', 'Inspirar'],
  ['Galactico', 'Integridad', 'Armonizar', 'Modelar'],
  ['Solar', 'Intencion', 'Pulsar', 'Realizar'],
  ['Planetario', 'Manifestacion', 'Perfeccionar', 'Producir'],
  ['Espectral', 'Liberacion', 'Disolver', 'Liberar'],
  ['Cristal', 'Cooperacion', 'Dedicar', 'Universalizar'],
  ['Cosmico', 'Presencia', 'Perseverar', 'Trascender'],
]
const TONE_IT: [string, string, string, string][] = [
  ['Magnetico', 'Proposito', 'Unificare', 'Attrarre'],
  ['Lunare', 'Sfida', 'Polarizzare', 'Stabilizzare'],
  ['Elettrico', 'Servizio', 'Attivare', 'Collegare'],
  ['Autoesistente', 'Forma', 'Definire', 'Misurare'],
  ['Armonico', 'Radianza', 'Potenziare', 'Comandare'],
  ['Ritmico', 'Uguaglianza', 'Organizzare', 'Equilibrare'],
  ['Risonante', 'Sintonia', 'Canalizzare', 'Ispirare'],
  ['Galattico', 'Integrita', 'Armonizzare', 'Modellare'],
  ['Solare', 'Intenzione', 'Pulsare', 'Realizzare'],
  ['Planetario', 'Manifestazione', 'Perfezionare', 'Produrre'],
  ['Spettrale', 'Liberazione', 'Dissolvere', 'Liberare'],
  ['Cristallo', 'Cooperazione', 'Dedicare', 'Universalizzare'],
  ['Cosmico', 'Presenza', 'Perseverare', 'Trascendere'],
]

export function getSealWords(seal: number, lang: TzLang): Words {
  const c = SEALS[seal - 1]
  if (lang === 'pt-BR') return { name: c.namePt, power: c.powerPt, action: c.actionPt, essence: c.essencePt }
  if (lang === 'en-US') return { name: c.nameEn, power: c.powerEn, action: c.actionEn, essence: c.essenceEn }
  const src = (lang === 'es-ES' ? SEAL_ES : SEAL_IT)[seal - 1]
  return { name: src[0], power: src[1], action: src[2], essence: src[3] }
}

export function getToneWords(tone: number, lang: TzLang): Words {
  const c = TONES[tone - 1]
  if (lang === 'pt-BR') return { name: c.namePt, power: c.powerPt, action: c.actionPt, essence: c.essencePt }
  if (lang === 'en-US') return { name: c.nameEn, power: c.powerEn, action: c.actionEn, essence: c.essenceEn }
  const src = (lang === 'es-ES' ? TONE_ES : TONE_IT)[tone - 1]
  return { name: src[0], essence: src[1], power: src[2], action: src[3] }
}

type RoleKey = 'guide' | 'analog' | 'antipode' | 'occult'
export const ORACLE_ROLE_I18N: Record<Exclude<TzLang, 'pt-BR'>, Record<RoleKey, { title: string; text: string }>> = {
  'en-US': {
    guide: { title: 'Guide', text: 'The energy that orients and leads the Kin — the higher power pointing the way. It symbolizes the direction that expands purpose.' },
    analog: { title: 'Analog', text: 'Support and complementarity — the force that walks alongside, easing and sustaining. It can indicate natural partnerships and affinities.' },
    antipode: { title: 'Antipode', text: 'The challenge that strengthens — the polarity that stretches and develops. NOT incompatibility: the friction that makes you grow.' },
    occult: { title: 'Hidden', text: 'The hidden power — the inner complementarity revealed over time. It symbolizes the potential that ripens within.' },
  },
  'es-ES': {
    guide: { title: 'Guia', text: 'La energia que orienta y conduce al Kin, el poder superior que senala el camino. Simboliza la direccion que amplia el proposito.' },
    analog: { title: 'Analogo', text: 'Apoyo y complementariedad, la fuerza que camina al lado, facilitando y sosteniendo. Puede indicar afinidades naturales.' },
    antipode: { title: 'Antipoda', text: 'El desafio que fortalece, la polaridad que estira y desarrolla. NO es incompatibilidad: es el roce que hace crecer.' },
    occult: { title: 'Oculto', text: 'El poder escondido, la complementariedad interna que se revela con el tiempo. Simboliza el potencial que madura por dentro.' },
  },
  'it-IT': {
    guide: { title: 'Guida', text: 'L energia che orienta e conduce il Kin, il potere superiore che indica la via. Simboleggia la direzione che amplia lo scopo.' },
    analog: { title: 'Analogo', text: 'Sostegno e complementarita, la forza che cammina a fianco, facilitando e sostenendo. Puo indicare affinita naturali.' },
    antipode: { title: 'Antipode', text: 'La sfida che rafforza, la polarita che tende e sviluppa. NON e incompatibilita: e l attrito che fa crescere.' },
    occult: { title: 'Occulto', text: 'Il potere nascosto, la complementarita interna che si rivela nel tempo. Simboleggia il potenziale che matura dentro.' },
  },
}

export const FAMILY_I18N: Record<Exclude<TzLang, 'pt-BR'>, Record<string, { title: string; text: string }>> = {
  'en-US': {
    portal: { title: 'Portal Family', text: 'Channels energy between dimensions — opens passages and activates.' },
    polar: { title: 'Polar Family', text: 'Stabilizes the poles — holds the balance between opposites.' },
    cardinal: { title: 'Cardinal Family', text: 'Opens directions — initiates movement and points the way.' },
    core: { title: 'Core Family', text: 'Sustains the center — keeps coherence and essence.' },
    signal: { title: 'Signal Family', text: 'Communicates and reveals — translates and transmits.' },
  },
  'es-ES': {
    portal: { title: 'Familia Portal', text: 'Canaliza energia entre dimensiones, abre pasajes y activa.' },
    polar: { title: 'Familia Polar', text: 'Estabiliza los polos, sostiene el equilibrio entre opuestos.' },
    cardinal: { title: 'Familia Cardinal', text: 'Abre direcciones, inicia el movimiento y senala rumbos.' },
    core: { title: 'Familia Nucleo', text: 'Sostiene el centro, mantiene la coherencia y la esencia.' },
    signal: { title: 'Familia Senal', text: 'Comunica y revela, traduce y transmite.' },
  },
  'it-IT': {
    portal: { title: 'Famiglia Portale', text: 'Canalizza energia tra le dimensioni, apre passaggi e attiva.' },
    polar: { title: 'Famiglia Polare', text: 'Stabilizza i poli, sostiene l equilibrio tra gli opposti.' },
    cardinal: { title: 'Famiglia Cardinale', text: 'Apre direzioni, avvia il movimento e indica le rotte.' },
    core: { title: 'Famiglia Nucleo', text: 'Sostiene il centro, mantiene la coerenza e l essenza.' },
    signal: { title: 'Famiglia Segnale', text: 'Comunica e rivela, traduce e trasmette.' },
  },
}

export const CASTLE_I18N: Record<Exclude<TzLang, 'pt-BR'>, Record<string, { title: string; text: string }>> = {
  'en-US': {
    red: { title: 'Red Castle of the East', text: 'The Tower of Birth — where it all begins. Theme: to initiate.' },
    white: { title: 'White Castle of the North', text: 'The Tower of Crossing — refinement and passage. Theme: to cross.' },
    blue: { title: 'Blue Castle of the West', text: 'The Tower of Magic — transformation and burning. Theme: to transform.' },
    yellow: { title: 'Yellow Castle of the South', text: 'The Tower of Giving — ripening and intelligence. Theme: to flower.' },
    green: { title: 'Green Central Castle', text: 'The Tower of Enchantment — synchronization and matrix. Theme: to harmonize.' },
  },
  'es-ES': {
    red: { title: 'Castillo Rojo del Este', text: 'La Torre del Nacimiento, donde todo empieza. Tema: iniciar.' },
    white: { title: 'Castillo Blanco del Norte', text: 'La Torre de la Travesia, refinamiento y paso. Tema: atravesar.' },
    blue: { title: 'Castillo Azul del Oeste', text: 'La Torre de la Magia, transformacion y quema. Tema: transformar.' },
    yellow: { title: 'Castillo Amarillo del Sur', text: 'La Torre de la Entrega, maduracion e inteligencia. Tema: florecer.' },
    green: { title: 'Castillo Verde Central', text: 'La Torre del Encantamiento, sincronizacion y matriz. Tema: armonizar.' },
  },
  'it-IT': {
    red: { title: 'Castello Rosso dell Est', text: 'La Torre della Nascita, dove tutto comincia. Tema: iniziare.' },
    white: { title: 'Castello Bianco del Nord', text: 'La Torre della Traversata, raffinamento e passaggio. Tema: attraversare.' },
    blue: { title: 'Castello Blu dell Ovest', text: 'La Torre della Magia, trasformazione e fuoco. Tema: trasformare.' },
    yellow: { title: 'Castello Giallo del Sud', text: 'La Torre del Dono, maturazione e intelligenza. Tema: fiorire.' },
    green: { title: 'Castello Verde Centrale', text: 'La Torre dell Incanto, sincronizzazione e matrice. Tema: armonizzare.' },
  },
}

export const DISCLAIMER_I18N: Record<Exclude<TzLang, 'pt-BR'>, string> = {
  'en-US': 'This area uses Dreamspell / 13 Moons, a modern interpretation of the 260-Kin cycle inspired by the traditional Tzolkin. Readings are symbolic — they do not determine personality or destiny.',
  'es-ES': 'Esta area usa Dreamspell / 13 Lunas, una interpretacion moderna del ciclo de 260 Kines inspirada en el Tzolkin tradicional. Las lecturas son simbolicas, no determinan personalidad ni destino.',
  'it-IT': 'Questa area usa Dreamspell / 13 Lune, una interpretazione moderna del ciclo di 260 Kin ispirata al Tzolkin tradizionale. Le letture sono simboliche, non determinano personalita ne destino.',
}
