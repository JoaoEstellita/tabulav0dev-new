// Catálogo i18n: Nódulos Lunares — Nódulo Norte por casa natal
// 36 entradas: 12 casas × 3 idiomas (en-US, es-ES, it-IT)
// Regras:
//   en-US — sem "will", presente simples
//   es-ES — sem acentos (sin tildes)
//   it-IT — sem acentos e sem apóstrofos

import type { AppLanguage } from '../i18n/appI18n'

export const LUNAR_NODE_HOUSE_I18N_OVERRIDES: Partial<Record<AppLanguage, Record<string, string>>> = {

  'en-US': {
    'natal:nn_house_1':
      'The North Node in House 1 invites you to develop your own identity: to show up, decide, and exist in the first person. The South Node in House 7 marks a comfort zone in partnership — the familiar tendency is to define yourself through the other, over-negotiate your own wishes, and wait for the relationship to set the course. Growth happens when you take authorship of your own life and discover that relationships become healthier when there is a whole "I" inside them.',

    'natal:nn_house_2':
      'The North Node in House 2 invites you to build your own resources: values, talents, livelihood, and a security that depends on no one. The South Node in House 8 points to familiarity with what belongs to others — shared resources, borrowed intensity, other people’s crises. The growth path involves leaving dependence on what comes from outside and discovering the satisfaction of generating your own worth, at your own pace, with your own hands.',

    'natal:nn_house_3':
      'The North Node in House 3 invites you to value the near and the concrete: everyday communication, continuous learning, neighborhood, siblings, simple exchanges. The South Node in House 9 marks comfort in grand theories and distances — philosophizing, traveling, teaching from afar while avoiding direct dialogue and daily detail. Growth happens when you translate accumulated wisdom into accessible conversation and realize the extraordinary also lives in the simple question and in listening up close.',

    'natal:nn_house_4':
      'The North Node in House 4 invites you to grow roots: home, inner life, intimacy with your own story and with those who are truly family. The South Node in House 10 points to a comfort zone in public achievement — the familiar tendency is to measure your worth by status, position, and external recognition. The growth path leads back inward: caring for your emotional base, nurturing close bonds, and discovering that achievement without inner ground tires more than it sustains.',

    'natal:nn_house_5':
      'The North Node in House 5 invites you to create and express yourself: art, romance, play, children, everything that carries your personal signature. The South Node in House 11 marks comfort in dissolving into the group — joining causes and collectives without ever claiming your own desire and your own stage. Growth happens when you allow yourself to want something for pleasure, take the risk of being seen, and discover the joy of putting your heart into what you do.',

    'natal:nn_house_6':
      'The North Node in House 6 invites you to embody through routine: work well done, care for the body, order in daily life, concrete service. The South Node in House 12 points to familiarity with the invisible — taking refuge in imagination, in the background, in subtle escape from practical duties. The growth path asks for presence in the here and now: structuring habits, serving tangibly, and discovering that spirituality is also practiced by doing the dishes with attention.',

    'natal:nn_house_7':
      'The North Node in House 7 invites you to learn the art of encounter: partnership, cooperation, commitment to another as an equal. The South Node in House 1 marks a comfort zone in self-sufficiency — the familiar tendency is to do everything alone, decide without consulting, and treat the other as a supporting role. Growth happens when you truly let the other in: sharing decisions, honoring agreements, and discovering that a partner’s presence does not diminish yours — it reveals parts of you that solitude cannot reach.',

    'natal:nn_house_8':
      'The North Node in House 8 invites you to dive into what is shared: deep intimacy, joint resources, transformation, and the courage to cross crises with another. The South Node in House 2 points to comfort in what is only yours — attachment to possessions, values, and securities that do not mix. The growth path involves trusting enough to merge without losing yourself, releasing control over what is "mine", and discovering that some riches only exist in the encounter.',

    'natal:nn_house_9':
      'The North Node in House 9 invites you to expand horizons: a philosophy of life of your own, higher studies, transformative journeys, faith built through experience. The South Node in House 3 marks familiarity with the fragmented — too much information, opinions about everything, the known backyard as the limit of the world. Growth happens when you trade the collection of data for a vision that gives meaning and let life teach what facts alone cannot explain.',

    'natal:nn_house_10':
      'The North Node in House 10 invites you to embrace vocation and authority: building a public work, sustaining responsibilities, becoming a reference. The South Node in House 4 points to a comfort zone in the nest — the familiar tendency is to shelter in the private, in family, or in the past when the world demands exposure. The growth path involves stepping out of familiar protection, accepting the healthy weight of public responsibility, and discovering that maturing your own authority is also a way of caring for those you love.',

    'natal:nn_house_11':
      'The North Node in House 11 invites you to join the collective: friendships, networks, causes, and projects that benefit many. The South Node in House 5 marks comfort on your own stage — the familiar need to shine, dramatize, and centralize attention. Growth happens when personal talent becomes contribution to something larger, when you celebrate the success of others without feeling erased, and discover that belonging to a shared vision fulfills more than any individual applause.',

    'natal:nn_house_12':
      'The North Node in House 12 invites you to develop inner life: contemplation, compassion, surrender to what is greater than the ego, and silent service. The South Node in House 6 points to familiarity with control of routine — the tendency to manage every detail, demand productivity from yourself, and reduce life to what is useful and measurable. The growth path asks for moments of retreat without guilt, trust in the invisible process of things, and the discovery that surrendering, sometimes, is the most mature way of acting.',
  },

  'es-ES': {
    // Regra: sem acentos (sin tildes)
    'natal:nn_house_1':
      'El Nodo Norte en la Casa 1 invita a desarrollar identidad propia: aparecer, decidir y existir en primera persona. El Nodo Sur en la Casa 7 marca una zona de confort en la pareja — la tendencia familiar es definirse por el otro, negociar demasiado la propia voluntad y esperar que la relacion marque el rumbo. El crecimiento ocurre cuando asumes la autoria de tu propia vida y descubres que las relaciones se vuelven mas sanas cuando existe un "yo" entero dentro de ellas.',

    'natal:nn_house_2':
      'El Nodo Norte en la Casa 2 invita a construir recursos propios: valores, talentos, sustento y una seguridad que no depende de nadie. El Nodo Sur en la Casa 8 apunta a familiaridad con lo ajeno — recursos compartidos, crisis de otros, intensidad emocional prestada. El camino de crecimiento pasa por salir de la dependencia de lo que viene de fuera y descubrir la satisfaccion de generar el propio valor, a tu ritmo, con tus manos.',

    'natal:nn_house_3':
      'El Nodo Norte en la Casa 3 invita a valorar lo cercano y lo concreto: comunicacion cotidiana, aprendizaje continuo, vecindario, hermanos, intercambios simples. El Nodo Sur en la Casa 9 indica confort en las grandes teorias y las distancias — filosofar, viajar, ensenar de lejos evitando el dialogo directo y el detalle diario. El crecimiento ocurre cuando traduces la sabiduria acumulada en conversacion accesible y percibes que lo extraordinario tambien vive en la pregunta simple y en escuchar de cerca.',

    'natal:nn_house_4':
      'El Nodo Norte en la Casa 4 invita a crear raiz: hogar, vida interior, intimidad con la propia historia y con quien es familia de verdad. El Nodo Sur en la Casa 10 apunta a una zona de confort en la conquista publica — la tendencia familiar es medir el propio valor por estatus, cargo y reconocimiento externo. El camino de crecimiento pasa por volver hacia dentro: cuidar la base emocional, nutrir los vinculos cercanos y descubrir que el logro sin suelo interno cansa mas de lo que sostiene.',

    'natal:nn_house_5':
      'El Nodo Norte en la Casa 5 invita a crear y expresarse: arte, romance, juego, hijos, todo lo que lleva tu firma personal. El Nodo Sur en la Casa 11 indica confort en disolverse en el grupo — participar en causas y colectivos sin asumir nunca el propio deseo y el propio escenario. El crecimiento ocurre cuando te permites querer algo por placer, asumes el riesgo de ser visto y descubres la alegria de poner el corazon en lo que haces.',

    'natal:nn_house_6':
      'El Nodo Norte en la Casa 6 invita a encarnar en la rutina: trabajo bien hecho, cuidado del cuerpo, orden en lo cotidiano, servicio concreto. El Nodo Sur en la Casa 12 apunta a familiaridad con lo invisible — refugio en la imaginacion, en los bastidores, en la fuga sutil de las obligaciones practicas. El camino de crecimiento pide presencia en el aqui y ahora: estructurar habitos, servir de forma tangible y descubrir que la espiritualidad tambien se practica lavando los platos con atencion.',

    'natal:nn_house_7':
      'El Nodo Norte en la Casa 7 invita a aprender el encuentro: pareja, cooperacion, compromiso con el otro en pie de igualdad. El Nodo Sur en la Casa 1 marca una zona de confort en la autosuficiencia — la tendencia familiar es hacerlo todo solo, decidir sin consultar y tratar al otro como secundario. El crecimiento ocurre cuando dejas entrar al otro de verdad: compartes decisiones, sostienes acuerdos y descubres que la presencia de un companero no disminuye la tuya — revela partes tuyas que la soledad no alcanza.',

    'natal:nn_house_8':
      'El Nodo Norte en la Casa 8 invita a sumergirse en lo compartido: intimidad profunda, recursos conjuntos, transformacion y el coraje de atravesar crisis con el otro. El Nodo Sur en la Casa 2 apunta a confort en lo que es solo tuyo — apego a bienes, valores y seguridades que no se mezclan. El camino de crecimiento pasa por confiar lo suficiente para fundirse sin perderse, soltar el control sobre lo "mio" y descubrir que algunas riquezas solo existen en el encuentro.',

    'natal:nn_house_9':
      'El Nodo Norte en la Casa 9 invita a expandir horizontes: filosofia de vida propia, estudios mayores, viajes que transforman, fe construida por la experiencia. El Nodo Sur en la Casa 3 indica familiaridad con lo fragmentado — demasiada informacion, opinion sobre todo, el patio conocido como limite del mundo. El crecimiento ocurre cuando cambias la coleccion de datos por una vision que da sentido y dejas que la vida ensene lo que los hechos solos no explican.',

    'natal:nn_house_10':
      'El Nodo Norte en la Casa 10 invita a asumir vocacion y autoridad: construir una obra publica, sostener responsabilidades y ser referencia. El Nodo Sur en la Casa 4 apunta a una zona de confort en el nido — la tendencia familiar es refugiarse en lo privado, en la familia o en el pasado cuando el mundo exige exposicion. El camino de crecimiento pasa por salir de la proteccion de lo conocido, aceptar el peso sano de la responsabilidad publica y descubrir que madurar la propia autoridad tambien es una forma de cuidar a quienes amas.',

    'natal:nn_house_11':
      'El Nodo Norte en la Casa 11 invita a sumarse al colectivo: amistades, redes, causas y proyectos que benefician a muchos. El Nodo Sur en la Casa 5 indica confort en el propio escenario — la necesidad familiar de brillar, dramatizar y centralizar la atencion. El crecimiento ocurre cuando el talento personal se vuelve contribucion a algo mayor, cuando celebras el exito de los demas sin sentirte borrado y descubres que pertenecer a una vision compartida realiza mas que cualquier aplauso individual.',

    'natal:nn_house_12':
      'El Nodo Norte en la Casa 12 invita a desarrollar vida interior: contemplacion, compasion, entrega a lo que es mayor que el ego y servicio silencioso. El Nodo Sur en la Casa 6 apunta a familiaridad con el control de la rutina — la tendencia a gestionar cada detalle, exigirse productividad y reducir la vida a lo util y medible. El camino de crecimiento pide momentos de recogimiento sin culpa, confianza en el proceso invisible de las cosas y el descubrimiento de que rendirse, a veces, es la forma mas madura de actuar.',
  },

  'it-IT': {
    // Regra: sem acentos e sem apóstrofos
    'natal:nn_house_1':
      'Il Nodo Nord nella Casa 1 invita a sviluppare identita propria: mostrarsi, decidere ed esistere in prima persona. Il Nodo Sud nella Casa 7 segna una zona di comfort nel legame — la tendenza familiare e definirsi attraverso gli altri, negoziare troppo la propria volonta e aspettare che la relazione dia la direzione. La crescita avviene quando assumi la firma della tua vita e scopri che le relazioni diventano piu sane quando dentro esiste un "io" intero.',

    'natal:nn_house_2':
      'Il Nodo Nord nella Casa 2 invita a costruire risorse proprie: valori, talenti, sostentamento e una sicurezza che non dipende da nessuno. Il Nodo Sud nella Casa 8 indica familiarita con cio che appartiene agli altri — risorse condivise, crisi altrui, intensita emotiva presa in prestito. Il cammino di crescita passa dallo uscire dalla dipendenza di cio che viene da fuori e scoprire la soddisfazione di generare il proprio valore, al proprio ritmo, con le proprie mani.',

    'natal:nn_house_3':
      'Il Nodo Nord nella Casa 3 invita a valorizzare il vicino e il concreto: comunicazione quotidiana, apprendimento continuo, vicinato, fratelli, scambi semplici. Il Nodo Sud nella Casa 9 segna comfort nelle grandi teorie e nelle distanze — filosofare, viaggiare, insegnare da lontano evitando il dialogo diretto e il dettaglio quotidiano. La crescita avviene quando traduci la saggezza accumulata in conversazione accessibile e scopri che lo straordinario vive anche nella domanda semplice e nello ascolto da vicino.',

    'natal:nn_house_4':
      'Il Nodo Nord nella Casa 4 invita a mettere radici: casa, vita interiore, intimita con la propria storia e con chi e famiglia davvero. Il Nodo Sud nella Casa 10 indica una zona di comfort nella conquista pubblica — la tendenza familiare e misurare il proprio valore con status, carica e riconoscimento esterno. Il cammino di crescita passa dal tornare dentro: curare la base emotiva, nutrire i legami vicini e scoprire che la realizzazione senza un terreno interno stanca piu di quanto sostenga.',

    'natal:nn_house_5':
      'Il Nodo Nord nella Casa 5 invita a creare ed esprimersi: arte, romanticismo, gioco, figli, tutto cio che porta la tua firma personale. Il Nodo Sud nella Casa 11 segna comfort nel dissolversi nel gruppo — partecipare a cause e collettivi senza mai assumere il proprio desiderio e il proprio palco. La crescita avviene quando ti permetti di volere qualcosa per piacere, accetti il rischio di essere visto e scopri la gioia di mettere il cuore in cio che fai.',

    'natal:nn_house_6':
      'Il Nodo Nord nella Casa 6 invita a incarnarsi nella routine: lavoro ben fatto, cura del corpo, ordine nel quotidiano, servizio concreto. Il Nodo Sud nella Casa 12 indica familiarita con lo invisibile — rifugio nella immaginazione, nel dietro le quinte, nella fuga sottile dagli obblighi pratici. Il cammino di crescita chiede presenza nel qui e ora: strutturare abitudini, servire in modo tangibile e scoprire che la spiritualita si pratica anche lavando i piatti con attenzione.',

    'natal:nn_house_7':
      'Il Nodo Nord nella Casa 7 invita a imparare lo incontro: legame, cooperazione, impegno con lo altro da pari a pari. Il Nodo Sud nella Casa 1 segna una zona di comfort nella autosufficienza — la tendenza familiare e fare tutto da soli, decidere senza consultare e trattare lo altro come comparsa. La crescita avviene quando lasci entrare lo altro davvero: condividi decisioni, sostieni accordi e scopri che la presenza di un partner non diminuisce la tua — rivela parti di te che la solitudine non raggiunge.',

    'natal:nn_house_8':
      'Il Nodo Nord nella Casa 8 invita a immergersi in cio che si condivide: intimita profonda, risorse comuni, trasformazione e il coraggio di attraversare crisi insieme. Il Nodo Sud nella Casa 2 indica comfort in cio che e solo tuo — attaccamento a beni, valori e sicurezze che non si mescolano. Il cammino di crescita passa dal fidarsi abbastanza da fondersi senza perdersi, lasciare il controllo sul "mio" e scoprire che alcune ricchezze esistono solo nello incontro.',

    'natal:nn_house_9':
      'Il Nodo Nord nella Casa 9 invita ad ampliare gli orizzonti: filosofia di vita propria, studi superiori, viaggi che trasformano, fede costruita con la esperienza. Il Nodo Sud nella Casa 3 segna familiarita con il frammentato — troppa informazione, opinioni su tutto, il cortile conosciuto come limite del mondo. La crescita avviene quando scambi la collezione di dati con una visione che da senso e lasci che la vita insegni cio che i fatti da soli non spiegano.',

    'natal:nn_house_10':
      'Il Nodo Nord nella Casa 10 invita ad assumere vocazione e autorita: costruire una opera pubblica, sostenere responsabilita ed essere riferimento. Il Nodo Sud nella Casa 4 indica una zona di comfort nel nido — la tendenza familiare e ripararsi nel privato, nella famiglia o nel passato quando il mondo chiede esposizione. Il cammino di crescita passa dallo uscire dalla protezione del conosciuto, accettare il peso sano della responsabilita pubblica e scoprire che maturare la propria autorita e anche un modo di prendersi cura di chi ami.',

    'natal:nn_house_11':
      'Il Nodo Nord nella Casa 11 invita a unirsi al collettivo: amicizie, reti, cause e progetti che beneficiano molti. Il Nodo Sud nella Casa 5 segna comfort sul proprio palco — il bisogno familiare di brillare, drammatizzare e centralizzare la attenzione. La crescita avviene quando il talento personale diventa contributo a qualcosa di piu grande, quando celebri il successo degli altri senza sentirti cancellato e scopri che appartenere a una visione condivisa realizza piu di qualsiasi applauso individuale.',

    'natal:nn_house_12':
      'Il Nodo Nord nella Casa 12 invita a sviluppare vita interiore: contemplazione, compassione, resa a cio che e piu grande dello ego e servizio silenzioso. Il Nodo Sud nella Casa 6 indica familiarita con il controllo della routine — la tendenza a gestire ogni dettaglio, pretendere produttivita da se stessi e ridurre la vita a cio che e utile e misurabile. Il cammino di crescita chiede momenti di raccoglimento senza colpa, fiducia nel processo invisibile delle cose e la scoperta che arrendersi, a volte, e il modo piu maturo di agire.',
  },
}
