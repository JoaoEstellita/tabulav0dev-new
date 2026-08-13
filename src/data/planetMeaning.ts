// Significado acessível de cada planeta/ponto (arquétipo puro), para o modal de
// leitura e para os cards do mapa natal. Substitui as frases genéricas antigas
// ("Força arquetípica em leitura aplicada") por texto real e humano.
//
// Fonte de base: Txt/Modern_Planet_Description.txt (Paul Hysen) reescrito em tom
// acessível (2ª pessoa, concreto), nos 4 idiomas do app.
//
// Convenção i18n do projeto (igual aos *OverridesI18n.ts):
//   pt-BR — acentuação completa
//   en-US — inglês natural
//   es-ES — SEM tildes
//   it-IT — SEM acentos e SEM apóstrofos
//
// Três campos por planeta, um por seção do modal:
//   essence  → "Força do planeta" (o que ele é em você)
//   inAspect → "Efeito em aspecto"
//   inHouse  → "Efeito em casa"

import { normalizeKey } from '../utils/astro/normalizeKey'

export interface PlanetMeaning {
  essence: string
  inAspect: string
  inHouse: string
}

type Lang = 'pt-BR' | 'en-US' | 'es-ES' | 'it-IT'

const DATA: Record<string, Record<Lang, PlanetMeaning>> = {
  sun: {
    'pt-BR': {
      essence: 'O Sol é o seu núcleo — quem você é quando está inteiro. É de onde vem sua vontade de brilhar, sua vitalidade e o senso de estar no comando da própria vida.',
      inAspect: 'Nos aspectos, o Sol mostra onde sua identidade ganha força ou pede ajuste: onde você lidera com naturalidade e onde o ego busca equilíbrio.',
      inHouse: 'Na casa em que está, o Sol indica a área da vida onde você mais busca se expressar e ser reconhecido.',
    },
    'en-US': {
      essence: 'The Sun is your core — who you are when you feel whole. It is the source of your drive to shine, your vitality, and the sense of being in charge of your own life.',
      inAspect: 'In aspects, the Sun shows where your identity gains strength or needs adjusting: where you lead naturally and where the ego seeks balance.',
      inHouse: 'In its house, the Sun points to the area of life where you most seek to express yourself and be recognized.',
    },
    'es-ES': {
      essence: 'El Sol es tu nucleo, quien eres cuando estas entero. Es de donde nace tu deseo de brillar, tu vitalidad y la sensacion de estar al mando de tu propia vida.',
      inAspect: 'En los aspectos, el Sol muestra donde tu identidad gana fuerza o pide ajuste: donde lideras con naturalidad y donde el ego busca equilibrio.',
      inHouse: 'En su casa, el Sol indica el area de la vida donde mas buscas expresarte y ser reconocido.',
    },
    'it-IT': {
      essence: 'Il Sole e il tuo nucleo, chi sei quando ti senti intero. E la fonte del tuo desiderio di brillare, della tua vitalita e del senso di essere al comando della tua vita.',
      inAspect: 'Negli aspetti, il Sole mostra dove la tua identita prende forza o chiede regolazione: dove guidi con naturalezza e dove lego cerca equilibrio.',
      inHouse: 'Nella sua casa, il Sole indica larea della vita in cui piu cerchi di esprimerti e di essere riconosciuto.',
    },
  },
  moon: {
    'pt-BR': {
      essence: 'A Lua é onde mora o seu entusiasmo — a fonte da sua vontade de viver e o que te nutre por dentro, sem você precisar pensar. É a sua casa emocional, o que te dá segurança e aconchego.',
      inAspect: 'Nos aspectos, a Lua revela como você sente e reage: onde as emoções fluem livres e onde velhos hábitos pedem cuidado.',
      inHouse: 'Na casa em que está, a Lua mostra onde você procura conforto, pertencimento e um lugar seguro para se recolher.',
    },
    'en-US': {
      essence: 'The Moon is where your enthusiasm lives — the source of your will to live and what nourishes you inside without your having to think. It is your emotional home, what gives you safety and comfort.',
      inAspect: 'In aspects, the Moon reveals how you feel and react: where emotions flow freely and where old habits call for care.',
      inHouse: 'In its house, the Moon shows where you look for comfort, belonging, and a safe place to retreat.',
    },
    'es-ES': {
      essence: 'La Luna es donde vive tu entusiasmo, la fuente de tus ganas de vivir y lo que te nutre por dentro sin que tengas que pensarlo. Es tu casa emocional, lo que te da seguridad y refugio.',
      inAspect: 'En los aspectos, la Luna revela como sientes y reaccionas: donde las emociones fluyen libres y donde los viejos habitos piden cuidado.',
      inHouse: 'En su casa, la Luna muestra donde buscas consuelo, pertenencia y un lugar seguro donde recogerte.',
    },
    'it-IT': {
      essence: 'La Luna e dove vive il tuo entusiasmo, la fonte della tua voglia di vivere e cio che ti nutre dentro senza che tu debba pensarci. E la tua casa emotiva, cio che ti da sicurezza e conforto.',
      inAspect: 'Negli aspetti, la Luna rivela come senti e reagisci: dove le emozioni scorrono libere e dove le vecchie abitudini chiedono cura.',
      inHouse: 'Nella sua casa, la Luna mostra dove cerchi conforto, appartenenza e un luogo sicuro in cui ritirarti.',
    },
  },
  mercury: {
    'pt-BR': {
      essence: 'Mercúrio é a sua mente em movimento — como você pensa, aprende, fala e conecta ideias. É a ponte entre você e o mundo através das palavras.',
      inAspect: 'Nos aspectos, Mercúrio mostra como sua comunicação encontra clareza ou ruído: onde as ideias fluem e onde vale ouvir com mais calma.',
      inHouse: 'Na casa em que está, Mercúrio aponta a área da vida que mais ocupa seus pensamentos e conversas.',
    },
    'en-US': {
      essence: 'Mercury is your mind in motion — how you think, learn, speak, and connect ideas. It is the bridge between you and the world through words.',
      inAspect: 'In aspects, Mercury shows how your communication finds clarity or noise: where ideas flow and where it pays to listen more calmly.',
      inHouse: 'In its house, Mercury points to the area of life that most occupies your thoughts and conversations.',
    },
    'es-ES': {
      essence: 'Mercurio es tu mente en movimiento: como piensas, aprendes, hablas y conectas ideas. Es el puente entre tu y el mundo a traves de las palabras.',
      inAspect: 'En los aspectos, Mercurio muestra como tu comunicacion encuentra claridad o ruido: donde las ideas fluyen y donde conviene escuchar con mas calma.',
      inHouse: 'En su casa, Mercurio senala el area de la vida que mas ocupa tus pensamientos y conversaciones.',
    },
    'it-IT': {
      essence: 'Mercurio e la tua mente in movimento: come pensi, impari, parli e colleghi le idee. E il ponte tra te e il mondo attraverso le parole.',
      inAspect: 'Negli aspetti, Mercurio mostra come la tua comunicazione trova chiarezza o rumore: dove le idee scorrono e dove conviene ascoltare con piu calma.',
      inHouse: 'Nella sua casa, Mercurio indica larea della vita che piu occupa i tuoi pensieri e le tue conversazioni.',
    },
  },
  venus: {
    'pt-BR': {
      essence: 'Vênus é onde está o seu magnetismo — o que você acha belo, o que te dá prazer e como você ama e se conecta. É a sua capacidade de atrair e de valorizar.',
      inAspect: 'Nos aspectos, Vênus mostra como seus vínculos e afetos encontram harmonia ou tensão: onde o amor flui e onde valores pedem acordo.',
      inHouse: 'Na casa em que está, Vênus revela onde você busca prazer, afeto e beleza na vida.',
    },
    'en-US': {
      essence: 'Venus is where your magnetism lives — what you find beautiful, what gives you pleasure, and how you love and connect. It is your power to attract and to cherish.',
      inAspect: 'In aspects, Venus shows how your bonds and affections find harmony or tension: where love flows and where values need agreement.',
      inHouse: 'In its house, Venus reveals where you seek pleasure, affection, and beauty in life.',
    },
    'es-ES': {
      essence: 'Venus es donde esta tu magnetismo: lo que te parece bello, lo que te da placer y como amas y te conectas. Es tu capacidad de atraer y de valorar.',
      inAspect: 'En los aspectos, Venus muestra como tus vinculos y afectos encuentran armonia o tension: donde el amor fluye y donde los valores piden acuerdo.',
      inHouse: 'En su casa, Venus revela donde buscas placer, afecto y belleza en la vida.',
    },
    'it-IT': {
      essence: 'Venere e dove risiede il tuo magnetismo: cio che trovi bello, cio che ti da piacere e come ami e ti leghi. E la tua capacita di attrarre e di dare valore.',
      inAspect: 'Negli aspetti, Venere mostra come i tuoi legami e affetti trovano armonia o tensione: dove lamore scorre e dove i valori chiedono accordo.',
      inHouse: 'Nella sua casa, Venere rivela dove cerchi piacere, affetto e bellezza nella vita.',
    },
  },
  mars: {
    'pt-BR': {
      essence: 'Marte é a sua força de ação — a coragem de ir atrás do que quer, sua energia, seu impulso e o jeito como você luta pelo que importa.',
      inAspect: 'Nos aspectos, Marte mostra como sua energia se dirige: onde você age com firmeza e onde a impaciência pede canalização.',
      inHouse: 'Na casa em que está, Marte indica a área da vida onde você coloca mais garra, iniciativa e disposição para conquistar.',
    },
    'en-US': {
      essence: 'Mars is your force of action — the courage to go after what you want, your energy, your drive, and the way you fight for what matters.',
      inAspect: 'In aspects, Mars shows how your energy is directed: where you act with firmness and where impatience needs channeling.',
      inHouse: 'In its house, Mars marks the area of life where you put the most grit, initiative, and will to achieve.',
    },
    'es-ES': {
      essence: 'Marte es tu fuerza de accion: el coraje para ir tras lo que quieres, tu energia, tu impulso y la forma en que luchas por lo que importa.',
      inAspect: 'En los aspectos, Marte muestra como se dirige tu energia: donde actuas con firmeza y donde la impaciencia pide canalizarse.',
      inHouse: 'En su casa, Marte indica el area de la vida donde pones mas garra, iniciativa y ganas de conquistar.',
    },
    'it-IT': {
      essence: 'Marte e la tua forza di azione: il coraggio di andare verso cio che vuoi, la tua energia, il tuo slancio e il modo in cui lotti per cio che conta.',
      inAspect: 'Negli aspetti, Marte mostra come si dirige la tua energia: dove agisci con fermezza e dove limpazienza chiede di essere incanalata.',
      inHouse: 'Nella sua casa, Marte indica larea della vita in cui metti piu grinta, iniziativa e voglia di conquistare.',
    },
  },
  jupiter: {
    'pt-BR': {
      essence: 'Júpiter é o seu senso de expansão — a confiança de que a vida pode crescer, sua fé, seu otimismo e a busca por sentido e liberdade.',
      inAspect: 'Nos aspectos, Júpiter mostra onde a vida se abre com generosidade e onde o excesso pede medida.',
      inHouse: 'Na casa em que está, Júpiter aponta a área onde você tende a crescer, prosperar e encontrar oportunidades.',
    },
    'en-US': {
      essence: 'Jupiter is your sense of expansion — the trust that life can grow, your faith, your optimism, and the search for meaning and freedom.',
      inAspect: 'In aspects, Jupiter shows where life opens up generously and where excess needs measure.',
      inHouse: 'In its house, Jupiter points to the area where you tend to grow, prosper, and find opportunities.',
    },
    'es-ES': {
      essence: 'Jupiter es tu sentido de expansion: la confianza de que la vida puede crecer, tu fe, tu optimismo y la busqueda de sentido y libertad.',
      inAspect: 'En los aspectos, Jupiter muestra donde la vida se abre con generosidad y donde el exceso pide medida.',
      inHouse: 'En su casa, Jupiter senala el area donde tiendes a crecer, prosperar y encontrar oportunidades.',
    },
    'it-IT': {
      essence: 'Giove e il tuo senso di espansione: la fiducia che la vita possa crescere, la tua fede, il tuo ottimismo e la ricerca di senso e liberta.',
      inAspect: 'Negli aspetti, Giove mostra dove la vita si apre con generosita e dove leccesso chiede misura.',
      inHouse: 'Nella sua casa, Giove indica larea in cui tendi a crescere, prosperare e trovare opportunita.',
    },
  },
  saturn: {
    'pt-BR': {
      essence: 'Saturno é a sua estrutura — a maturidade que se constrói com tempo, disciplina e responsabilidade. É onde a vida pede seriedade, mas também onde você constrói algo sólido.',
      inAspect: 'Nos aspectos, Saturno mostra onde você encontra limites e lições: onde o esforço amadurece e onde o medo pede paciência.',
      inHouse: 'Na casa em que está, Saturno indica a área da vida que exige compromisso e onde, com o tempo, vem sua maior solidez.',
    },
    'en-US': {
      essence: 'Saturn is your structure — the maturity built through time, discipline, and responsibility. It is where life asks for seriousness, but also where you build something solid.',
      inAspect: 'In aspects, Saturn shows where you meet limits and lessons: where effort matures and where fear calls for patience.',
      inHouse: 'In its house, Saturn marks the area of life that demands commitment and where, in time, your greatest solidity comes.',
    },
    'es-ES': {
      essence: 'Saturno es tu estructura: la madurez que se construye con tiempo, disciplina y responsabilidad. Es donde la vida pide seriedad, pero tambien donde construyes algo solido.',
      inAspect: 'En los aspectos, Saturno muestra donde encuentras limites y lecciones: donde el esfuerzo madura y donde el miedo pide paciencia.',
      inHouse: 'En su casa, Saturno indica el area de la vida que exige compromiso y donde, con el tiempo, llega tu mayor solidez.',
    },
    'it-IT': {
      essence: 'Saturno e la tua struttura: la maturita che si costruisce con tempo, disciplina e responsabilita. E dove la vita chiede serieta, ma anche dove costruisci qualcosa di solido.',
      inAspect: 'Negli aspetti, Saturno mostra dove incontri limiti e lezioni: dove lo sforzo matura e dove la paura chiede pazienza.',
      inHouse: 'Nella sua casa, Saturno indica larea della vita che richiede impegno e dove, col tempo, arriva la tua maggiore solidita.',
    },
  },
  uranus: {
    'pt-BR': {
      essence: 'Urano é o seu impulso de liberdade — a parte de você que quer romper o comum, inovar e ser quem é sem pedir licença.',
      inAspect: 'Nos aspectos, Urano traz mudanças e viradas: onde você se renova de repente e onde a inquietação pede espaço.',
      inHouse: 'Na casa em que está, Urano mostra a área da vida onde você busca originalidade, independência e o inesperado.',
    },
    'en-US': {
      essence: 'Uranus is your impulse toward freedom — the part of you that wants to break the ordinary, innovate, and be who you are without asking permission.',
      inAspect: 'In aspects, Uranus brings changes and turning points: where you renew yourself suddenly and where restlessness needs room.',
      inHouse: 'In its house, Uranus shows the area of life where you seek originality, independence, and the unexpected.',
    },
    'es-ES': {
      essence: 'Urano es tu impulso de libertad: la parte de ti que quiere romper lo comun, innovar y ser quien eres sin pedir permiso.',
      inAspect: 'En los aspectos, Urano trae cambios y giros: donde te renuevas de repente y donde la inquietud pide espacio.',
      inHouse: 'En su casa, Urano muestra el area de la vida donde buscas originalidad, independencia y lo inesperado.',
    },
    'it-IT': {
      essence: 'Urano e il tuo impulso di liberta: la parte di te che vuole rompere il comune, innovare ed essere chi sei senza chiedere permesso.',
      inAspect: 'Negli aspetti, Urano porta cambiamenti e svolte: dove ti rinnovi allimprovviso e dove linquietudine chiede spazio.',
      inHouse: 'Nella sua casa, Urano mostra larea della vita in cui cerchi originalita, indipendenza e limprevisto.',
    },
  },
  neptune: {
    'pt-BR': {
      essence: 'Netuno é a sua sensibilidade sem fronteiras — a imaginação, os sonhos, a intuição e a vontade de se conectar com algo maior que você.',
      inAspect: 'Nos aspectos, Netuno mostra onde a inspiração flui e onde a névoa pede discernimento, para não confundir sonho com ilusão.',
      inHouse: 'Na casa em que está, Netuno aponta a área da vida onde você sonha, se entrega e busca transcendência.',
    },
    'en-US': {
      essence: 'Neptune is your sensitivity without borders — imagination, dreams, intuition, and the longing to connect with something greater than yourself.',
      inAspect: 'In aspects, Neptune shows where inspiration flows and where the fog calls for discernment, so you do not mistake a dream for an illusion.',
      inHouse: 'In its house, Neptune points to the area of life where you dream, surrender, and seek transcendence.',
    },
    'es-ES': {
      essence: 'Neptuno es tu sensibilidad sin fronteras: la imaginacion, los suenos, la intuicion y el deseo de conectarte con algo mas grande que tu.',
      inAspect: 'En los aspectos, Neptuno muestra donde fluye la inspiracion y donde la niebla pide discernimiento, para no confundir el sueno con la ilusion.',
      inHouse: 'En su casa, Neptuno senala el area de la vida donde suenas, te entregas y buscas trascendencia.',
    },
    'it-IT': {
      essence: 'Nettuno e la tua sensibilita senza confini: limmaginazione, i sogni, lintuizione e il desiderio di connetterti con qualcosa di piu grande di te.',
      inAspect: 'Negli aspetti, Nettuno mostra dove lispirazione scorre e dove la nebbia chiede discernimento, per non confondere il sogno con lillusione.',
      inHouse: 'Nella sua casa, Nettuno indica larea della vita in cui sogni, ti abbandoni e cerchi trascendenza.',
    },
  },
  pluto: {
    'pt-BR': {
      essence: 'Plutão é a sua força de transformação — o poder que vive no fundo, capaz de destruir o que não serve mais e renascer mais inteiro.',
      inAspect: 'Nos aspectos, Plutão mostra onde você vive intensidades e recomeços: onde o poder se afirma e onde o controle pede entrega.',
      inHouse: 'Na casa em que está, Plutão indica a área da vida que passa por mortes e renascimentos profundos.',
    },
    'en-US': {
      essence: 'Pluto is your force of transformation — the power that lives deep down, able to destroy what no longer serves and be reborn more whole.',
      inAspect: 'In aspects, Pluto shows where you live intensities and fresh starts: where power asserts itself and where control calls for letting go.',
      inHouse: 'In its house, Pluto marks the area of life that goes through deep deaths and rebirths.',
    },
    'es-ES': {
      essence: 'Pluton es tu fuerza de transformacion: el poder que vive en el fondo, capaz de destruir lo que ya no sirve y renacer mas entero.',
      inAspect: 'En los aspectos, Pluton muestra donde vives intensidades y comienzos: donde el poder se afirma y donde el control pide soltar.',
      inHouse: 'En su casa, Pluton indica el area de la vida que pasa por muertes y renacimientos profundos.',
    },
    'it-IT': {
      essence: 'Plutone e la tua forza di trasformazione: il potere che vive nel profondo, capace di distruggere cio che non serve piu e rinascere piu intero.',
      inAspect: 'Negli aspetti, Plutone mostra dove vivi intensita e nuovi inizi: dove il potere si afferma e dove il controllo chiede di lasciar andare.',
      inHouse: 'Nella sua casa, Plutone indica larea della vita che attraversa morti e rinascite profonde.',
    },
  },
  lilith: {
    'pt-BR': {
      essence: 'Lilith, a Lua Negra, é a sua força indomada — o desejo que não se dobra, aquilo que você aprendeu a esconder ou reprimir e que pede espaço para existir sem culpa.',
      inAspect: 'Nos aspectos, Lilith mostra onde você toca temas de poder, desejo e liberdade — onde algo autêntico insiste em vir à tona.',
      inHouse: 'Na casa em que está, Lilith aponta a área da vida onde você reivindica sua verdade mais crua e se recusa a se apagar.',
    },
    'en-US': {
      essence: 'Lilith, the Black Moon, is your untamed force — the desire that will not bend, what you learned to hide or suppress and that asks for room to exist without guilt.',
      inAspect: 'In aspects, Lilith shows where you touch themes of power, desire, and freedom — where something authentic insists on surfacing.',
      inHouse: 'In its house, Lilith points to the area of life where you claim your rawest truth and refuse to erase yourself.',
    },
    'es-ES': {
      essence: 'Lilith, la Luna Negra, es tu fuerza indomada: el deseo que no se doblega, aquello que aprendiste a esconder o reprimir y que pide espacio para existir sin culpa.',
      inAspect: 'En los aspectos, Lilith muestra donde tocas temas de poder, deseo y libertad, donde algo autentico insiste en salir a la luz.',
      inHouse: 'En su casa, Lilith senala el area de la vida donde reclamas tu verdad mas cruda y te niegas a borrarte.',
    },
    'it-IT': {
      essence: 'Lilith, la Luna Nera, e la tua forza indomata: il desiderio che non si piega, cio che hai imparato a nascondere o reprimere e che chiede spazio per esistere senza colpa.',
      inAspect: 'Negli aspetti, Lilith mostra dove tocchi temi di potere, desiderio e liberta, dove qualcosa di autentico insiste per venire a galla.',
      inHouse: 'Nella sua casa, Lilith indica larea della vita in cui rivendichi la tua verita piu cruda e ti rifiuti di cancellarti.',
    },
  },
  northnode: {
    'pt-BR': {
      essence: 'O Nódulo Norte é a sua direção de crescimento — as qualidades e experiências que esta vida convida você a desenvolver, mesmo que pareçam desafiadoras no começo.',
      inAspect: 'Nos aspectos, o Nódulo Norte mostra o que apoia ou desafia o seu caminho de evolução.',
      inHouse: 'Na casa em que está, o Nódulo Norte indica a área da vida onde está o seu convite de amadurecimento.',
    },
    'en-US': {
      essence: 'The North Node is your direction of growth — the qualities and experiences this life invites you to develop, even if they seem challenging at first.',
      inAspect: 'In aspects, the North Node shows what supports or challenges your path of evolution.',
      inHouse: 'In its house, the North Node marks the area of life where your invitation to mature lies.',
    },
    'es-ES': {
      essence: 'El Nodo Norte es tu direccion de crecimiento: las cualidades y experiencias que esta vida te invita a desarrollar, aunque parezcan desafiantes al principio.',
      inAspect: 'En los aspectos, el Nodo Norte muestra lo que apoya o desafia tu camino de evolucion.',
      inHouse: 'En su casa, el Nodo Norte indica el area de la vida donde esta tu invitacion a madurar.',
    },
    'it-IT': {
      essence: 'Il Nodo Nord e la tua direzione di crescita: le qualita e le esperienze che questa vita ti invita a sviluppare, anche se allinizio sembrano impegnative.',
      inAspect: 'Negli aspetti, il Nodo Nord mostra cio che sostiene o sfida il tuo cammino di evoluzione.',
      inHouse: 'Nella sua casa, il Nodo Nord indica larea della vita dove si trova il tuo invito a maturare.',
    },
  },
  southnode: {
    'pt-BR': {
      essence: 'O Nódulo Sul é a sua bagagem de talentos — o que já vem fácil, familiar e confortável, e que às vezes vira zona de conforto a ser ultrapassada.',
      inAspect: 'Nos aspectos, o Nódulo Sul mostra onde velhos padrões dão segurança e onde eles pedem para ser deixados para trás.',
      inHouse: 'Na casa em que está, o Nódulo Sul aponta a área da vida onde você já tem domínio natural.',
    },
    'en-US': {
      essence: 'The South Node is your baggage of talents — what already comes easily, familiar and comfortable, and that sometimes becomes a comfort zone to move beyond.',
      inAspect: 'In aspects, the South Node shows where old patterns give safety and where they ask to be left behind.',
      inHouse: 'In its house, the South Node points to the area of life where you already have natural mastery.',
    },
    'es-ES': {
      essence: 'El Nodo Sur es tu bagaje de talentos: lo que ya viene facil, familiar y comodo, y que a veces se vuelve zona de confort por superar.',
      inAspect: 'En los aspectos, el Nodo Sur muestra donde los viejos patrones dan seguridad y donde piden quedar atras.',
      inHouse: 'En su casa, el Nodo Sur senala el area de la vida donde ya tienes dominio natural.',
    },
    'it-IT': {
      essence: 'Il Nodo Sud e il tuo bagaglio di talenti: cio che gia viene facile, familiare e comodo, e che a volte diventa zona di comfort da superare.',
      inAspect: 'Negli aspetti, il Nodo Sud mostra dove i vecchi schemi danno sicurezza e dove chiedono di essere lasciati indietro.',
      inHouse: 'Nella sua casa, il Nodo Sud indica larea della vita in cui hai gia una padronanza naturale.',
    },
  },
  fortune: {
    'pt-BR': {
      essence: 'A Parte da Fortuna é o seu ponto de fluidez — onde corpo, emoção e identidade se alinham e a vida tende a fluir com mais leveza e bem-estar.',
      inAspect: 'Nos aspectos, a Parte da Fortuna mostra o que favorece ou atrapalha o seu senso de plenitude no dia a dia.',
      inHouse: 'Na casa em que está, a Parte da Fortuna indica a área da vida onde você encontra satisfação e sorte natural.',
    },
    'en-US': {
      essence: 'The Part of Fortune is your point of ease — where body, emotion, and identity align and life tends to flow with more lightness and well-being.',
      inAspect: 'In aspects, the Part of Fortune shows what favors or hinders your sense of fulfillment day to day.',
      inHouse: 'In its house, the Part of Fortune marks the area of life where you find satisfaction and natural luck.',
    },
    'es-ES': {
      essence: 'La Parte de la Fortuna es tu punto de fluidez: donde cuerpo, emocion e identidad se alinean y la vida tiende a fluir con mas ligereza y bienestar.',
      inAspect: 'En los aspectos, la Parte de la Fortuna muestra lo que favorece o dificulta tu sentido de plenitud en el dia a dia.',
      inHouse: 'En su casa, la Parte de la Fortuna indica el area de la vida donde encuentras satisfaccion y suerte natural.',
    },
    'it-IT': {
      essence: 'La Parte della Fortuna e il tuo punto di scorrevolezza: dove corpo, emozione e identita si allineano e la vita tende a fluire con piu leggerezza e benessere.',
      inAspect: 'Negli aspetti, la Parte della Fortuna mostra cio che favorisce o ostacola il tuo senso di pienezza giorno per giorno.',
      inHouse: 'Nella sua casa, la Parte della Fortuna indica larea della vita in cui trovi soddisfazione e fortuna naturale.',
    },
  },
  ascendant: {
    'pt-BR': {
      essence: 'O Ascendente é a sua porta de entrada — o jeito como você se apresenta ao mundo e a primeira impressão que causa. É a roupa da sua alma.',
      inAspect: 'Nos aspectos, o Ascendente mostra como a sua forma de se mostrar encontra apoio ou ajuste.',
      inHouse: 'O Ascendente marca o início da sua Casa 1 — o campo do eu, do corpo e da presença.',
    },
    'en-US': {
      essence: 'The Ascendant is your doorway — the way you present yourself to the world and the first impression you make. It is the clothing of your soul.',
      inAspect: 'In aspects, the Ascendant shows how your way of showing yourself finds support or adjustment.',
      inHouse: 'The Ascendant marks the start of your 1st House — the field of the self, the body, and presence.',
    },
    'es-ES': {
      essence: 'El Ascendente es tu puerta de entrada: la forma en que te presentas al mundo y la primera impresion que causas. Es el traje de tu alma.',
      inAspect: 'En los aspectos, el Ascendente muestra como tu forma de mostrarte encuentra apoyo o ajuste.',
      inHouse: 'El Ascendente marca el inicio de tu Casa 1: el campo del yo, del cuerpo y de la presencia.',
    },
    'it-IT': {
      essence: 'LAscendente e la tua porta di ingresso: il modo in cui ti presenti al mondo e la prima impressione che dai. E labito della tua anima.',
      inAspect: 'Negli aspetti, lAscendente mostra come il tuo modo di mostrarti trova sostegno o regolazione.',
      inHouse: 'LAscendente segna linizio della tua Casa 1: il campo dellio, del corpo e della presenza.',
    },
  },
  midheaven: {
    'pt-BR': {
      essence: 'O Meio do Céu é o seu ponto mais alto — suas aspirações, sua vocação e o lugar que você quer ocupar no mundo.',
      inAspect: 'Nos aspectos, o Meio do Céu mostra o que impulsiona ou testa os seus objetivos de vida.',
      inHouse: 'O Meio do Céu marca o topo da carta — o campo da carreira, da imagem pública e do propósito.',
    },
    'en-US': {
      essence: 'The Midheaven is your highest point — your aspirations, your vocation, and the place you want to hold in the world.',
      inAspect: 'In aspects, the Midheaven shows what drives or tests your life goals.',
      inHouse: 'The Midheaven marks the top of the chart — the field of career, public image, and purpose.',
    },
    'es-ES': {
      essence: 'El Medio Cielo es tu punto mas alto: tus aspiraciones, tu vocacion y el lugar que quieres ocupar en el mundo.',
      inAspect: 'En los aspectos, el Medio Cielo muestra lo que impulsa o pone a prueba tus objetivos de vida.',
      inHouse: 'El Medio Cielo marca la cima de la carta: el campo de la carrera, la imagen publica y el proposito.',
    },
    'it-IT': {
      essence: 'Il Medio Cielo e il tuo punto piu alto: le tue aspirazioni, la tua vocazione e il posto che vuoi occupare nel mondo.',
      inAspect: 'Negli aspetti, il Medio Cielo mostra cio che spinge o mette alla prova i tuoi obiettivi di vita.',
      inHouse: 'Il Medio Cielo segna la cima della carta: il campo della carriera, dellimmagine pubblica e dello scopo.',
    },
  },
}

// Aliases de nomes que podem chegar dos dados (pt/es/it) para a chave canônica.
const ALIASES: Record<string, string> = {
  sol: 'sun', lua: 'moon', mercurio: 'mercury', venus: 'venus', marte: 'mars',
  jupiter: 'jupiter', saturno: 'saturn', urano: 'uranus', netuno: 'neptune',
  nettuno: 'neptune', plutao: 'pluto', pluton: 'pluto', plutone: 'pluto',
  luanegra: 'lilith', blackmoon: 'lilith',
  nodonorte: 'northnode', nodulonorte: 'northnode', northnode: 'northnode', nodonord: 'northnode',
  nodosul: 'southnode', nodulosul: 'southnode', southnode: 'southnode', nodosur: 'southnode', nodosud: 'southnode',
  partedafortuna: 'fortune', partofortune: 'fortune', fortuna: 'fortune', fortune: 'fortune',
  ascendente: 'ascendant', asc: 'ascendant', ascendant: 'ascendant',
  meiodoceu: 'midheaven', mc: 'midheaven', midheaven: 'midheaven',
}

/**
 * Devolve o significado acessível do planeta/ponto no idioma pedido, ou null se
 * não houver entrada (o chamador cai no texto genérico de fallback).
 */
export function getPlanetMeaning(planetName: string, language: string): PlanetMeaning | null {
  const raw = normalizeKey(String(planetName || ''))
  const key = DATA[raw] ? raw : (ALIASES[raw.replace(/\s+/g, '')] || raw)
  const entry = DATA[key]
  if (!entry) return null
  return entry[(language as Lang)] || entry['pt-BR']
}
