// Leitura da FASE LUNAR DE NASCIMENTO (ciclo de lunação de Rudhyar) — camada de
// propósito e ritmo de vida. Cada fase = um momento no arco entre semear e soltar.
// Regras i18n: en-US sem "will"; es-ES sem tildes; it-IT sem acentos.
import type { MoonPhaseKey } from '../astro/moonPhase'
import type { AppLanguage } from '../i18n/appI18n'

interface PhaseReading { label: string; text: string }

export const NATAL_MOON_PHASE_READINGS: Record<MoonPhaseKey, Record<AppLanguage, PhaseReading>> = {
  nova: {
    'pt-BR': { label: 'Lua Nova', text: 'Você nasceu no impulso do recomeço: age por instinto, planta sementes novas sem enxergar ainda todo o caminho. Sua força é começar do zero e abrir trilhas — o sentido se revela fazendo, não planejando.' },
    'en-US': { label: 'New Moon', text: 'You were born in the impulse of the fresh start: you act on instinct, planting new seeds before the whole path is visible. Your strength is to begin from zero and open trails — meaning reveals itself through doing, not planning.' },
    'es-ES': { label: 'Luna Nueva', text: 'Naciste en el impulso del comienzo: actuas por instinto, plantando semillas nuevas sin ver aun todo el camino. Tu fuerza es empezar de cero y abrir senderos; el sentido se revela haciendo, no planeando.' },
    'it-IT': { label: 'Luna Nuova', text: 'Sei nato nell\'impulso del nuovo inizio: agisci per istinto, piantando semi nuovi senza vedere ancora tutto il cammino. La tua forza e cominciare da zero e aprire sentieri: il senso si rivela facendo, non pianificando.' },
  },
  crescente: {
    'pt-BR': { label: 'Lua Crescente', text: 'Sua vida é um esforço para firmar o novo contra o peso do velho. Você sente a puxada do passado e do hábito, e cresce quando junta coragem para se lançar adiante mesmo com medo. Tema: sair da inércia.' },
    'en-US': { label: 'Crescent Moon', text: 'Your life is an effort to steady the new against the weight of the old. You feel the pull of the past and of habit, and you grow when you gather courage to launch forward even while afraid. Theme: leaving inertia behind.' },
    'es-ES': { label: 'Luna Creciente', text: 'Tu vida es un esfuerzo por afirmar lo nuevo contra el peso de lo viejo. Sientes el tiron del pasado y del habito, y creces cuando reunes coraje para lanzarte adelante aun con miedo. Tema: salir de la inercia.' },
    'it-IT': { label: 'Luna Crescente', text: 'La tua vita e uno sforzo per consolidare il nuovo contro il peso del vecchio. Senti il richiamo del passato e dell\'abitudine, e cresci quando trovi il coraggio di lanciarti avanti anche con paura. Tema: uscire dall\'inerzia.' },
  },
  quarto_crescente: {
    'pt-BR': { label: 'Quarto Crescente', text: 'Você veio para construir e decidir sob pressão. A vida te coloca em crises de ação em que precisa romper resistências e erguer estruturas concretas. Sua força é a vontade que constrói — evolui enfrentando, não fugindo.' },
    'en-US': { label: 'First Quarter', text: 'You came to build and to decide under pressure. Life places you in crises of action where you must break through resistance and raise concrete structures. Your strength is the will that builds — you grow by facing, not fleeing.' },
    'es-ES': { label: 'Cuarto Creciente', text: 'Viniste a construir y a decidir bajo presion. La vida te pone en crisis de accion donde debes romper resistencias y levantar estructuras concretas. Tu fuerza es la voluntad que construye: evolucionas enfrentando, no huyendo.' },
    'it-IT': { label: 'Primo Quarto', text: 'Sei venuto a costruire e a decidere sotto pressione. La vita ti mette in crisi d\'azione in cui devi rompere resistenze e alzare strutture concrete. La tua forza e la volonta che costruisce: cresci affrontando, non fuggendo.' },
  },
  gibosa_crescente: {
    'pt-BR': { label: 'Gibosa Crescente', text: 'Seu dom é aperfeiçoar e dar sentido antes da colheita. Você analisa, refina e prepara — não se contenta com o cru. A busca por entender o "para quê" das coisas te move; cuidado só com o excesso de autocrítica.' },
    'en-US': { label: 'Gibbous Moon', text: 'Your gift is to perfect and to give meaning before the harvest. You analyze, refine and prepare — the raw does not satisfy you. The search to understand the "what for" of things moves you; just watch the excess of self-criticism.' },
    'es-ES': { label: 'Luna Gibosa', text: 'Tu don es perfeccionar y dar sentido antes de la cosecha. Analizas, refinas y preparas; lo crudo no te satisface. La busqueda de entender el "para que" de las cosas te mueve; solo cuida el exceso de autocritica.' },
    'it-IT': { label: 'Luna Gibbosa', text: 'Il tuo dono e perfezionare e dare senso prima del raccolto. Analizzi, raffini e prepari: il grezzo non ti basta. La ricerca di capire il "perche" delle cose ti muove; attento solo all\'eccesso di autocritica.' },
  },
  cheia: {
    'pt-BR': { label: 'Lua Cheia', text: 'Você nasceu na plenitude do ciclo: enxerga com clareza e se realiza através do OUTRO e das relações. A consciência vem de fora para dentro — o encontro te ilumina. Tema: equilibrar o subjetivo e o objetivo, viver com sentido e presença.' },
    'en-US': { label: 'Full Moon', text: 'You were born at the fullness of the cycle: you see with clarity and fulfill yourself through the OTHER and through relationship. Awareness comes from outside in — encounter lights you up. Theme: balancing the subjective and the objective, living with meaning and presence.' },
    'es-ES': { label: 'Luna Llena', text: 'Naciste en la plenitud del ciclo: ves con claridad y te realizas a traves del OTRO y de las relaciones. La conciencia viene de afuera hacia adentro; el encuentro te ilumina. Tema: equilibrar lo subjetivo y lo objetivo, vivir con sentido y presencia.' },
    'it-IT': { label: 'Luna Piena', text: 'Sei nato nella pienezza del ciclo: vedi con chiarezza e ti realizzi attraverso l\'ALTRO e le relazioni. La coscienza viene da fuori verso dentro: l\'incontro ti illumina. Tema: equilibrare il soggettivo e l\'oggettivo, vivere con senso e presenza.' },
  },
  gibosa_minguante: {
    'pt-BR': { label: 'Gibosa Minguante', text: 'Seu propósito é COMPARTILHAR o que colheu: ensinar, difundir, transmitir sentido. Você amadurece dando de volta ao mundo o que aprendeu — a vida ganha graça quando o seu conhecimento vira ponte para os outros.' },
    'en-US': { label: 'Disseminating Moon', text: 'Your purpose is to SHARE what you harvested: to teach, to spread, to pass on meaning. You mature by giving back to the world what you learned — life gains grace when your knowledge becomes a bridge for others.' },
    'es-ES': { label: 'Luna Diseminante', text: 'Tu proposito es COMPARTIR lo que cosechaste: ensenar, difundir, transmitir sentido. Maduras devolviendo al mundo lo que aprendiste; la vida gana gracia cuando tu conocimiento se vuelve puente para los demas.' },
    'it-IT': { label: 'Luna Disseminante', text: 'Il tuo scopo e CONDIVIDERE cio che hai raccolto: insegnare, diffondere, trasmettere senso. Maturi restituendo al mondo cio che hai imparato: la vita acquista grazia quando la tua conoscenza diventa ponte per gli altri.' },
  },
  quarto_minguante: {
    'pt-BR': { label: 'Quarto Minguante', text: 'Você veio para uma crise de consciência: revisar valores, desmontar o que já não serve e reorientar o rumo. Há um descompasso entre o que faz e o que acredita — e sua evolução é justamente resolver isso por dentro, soltando o velho molde.' },
    'en-US': { label: 'Last Quarter', text: 'You came for a crisis of consciousness: to review values, dismantle what no longer serves and reorient your course. There is a mismatch between what you do and what you believe — and your growth is precisely to resolve this within, releasing the old mold.' },
    'es-ES': { label: 'Cuarto Menguante', text: 'Viniste a una crisis de conciencia: revisar valores, desmontar lo que ya no sirve y reorientar el rumbo. Hay un desajuste entre lo que haces y lo que crees; y tu evolucion es justamente resolverlo por dentro, soltando el viejo molde.' },
    'it-IT': { label: 'Ultimo Quarto', text: 'Sei venuto per una crisi di coscienza: rivedere valori, smontare cio che non serve piu e riorientare la rotta. C\'e uno scarto tra cio che fai e cio che credi: e la tua evoluzione e proprio risolverlo dentro, lasciando il vecchio stampo.' },
  },
  balsamica: {
    'pt-BR': { label: 'Lua Balsâmica', text: 'Você fecha um ciclo antigo e carrega a semente do próximo: há em você uma sabedoria de fim de jornada, uma entrega e um olhar para além do imediato. Sua vida pede soltar o passado e confiar — o que planta agora floresce em outro tempo.' },
    'en-US': { label: 'Balsamic Moon', text: 'You close an old cycle and carry the seed of the next: there is in you a wisdom of journey\'s end, a surrender and a gaze beyond the immediate. Your life asks to release the past and trust — what you plant now blossoms in another time.' },
    'es-ES': { label: 'Luna Balsamica', text: 'Cierras un ciclo antiguo y llevas la semilla del proximo: hay en ti una sabiduria de fin de viaje, una entrega y una mirada mas alla de lo inmediato. Tu vida pide soltar el pasado y confiar; lo que plantas ahora florece en otro tiempo.' },
    'it-IT': { label: 'Luna Balsamica', text: 'Chiudi un ciclo antico e porti il seme del prossimo: c\'e in te una saggezza di fine viaggio, un abbandono e uno sguardo oltre l\'immediato. La tua vita chiede di lasciare il passato e fidarti: cio che pianti ora fiorisce in un altro tempo.' },
  },
}

/** Resolve o rótulo + texto da fase lunar natal no idioma dado (fallback pt-BR). */
export function resolveNatalMoonPhase(key: MoonPhaseKey, language: AppLanguage): PhaseReading {
  const byLang = NATAL_MOON_PHASE_READINGS[key]
  return byLang[language] || byLang['pt-BR']
}
