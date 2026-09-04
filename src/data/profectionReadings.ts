/**
 * Interpretações da PROFECÇÃO ANUAL (casa do ano + senhor do ano) × 4 idiomas.
 * Regras i18n: en-US sem "will"; es-ES sem tildes; it-IT sem acentos.
 *
 * Usado pela aba Previsão (app) e pelo agente WhatsApp (via context-builder no backend
 * — o backend tem sua própria cópia deste texto; manter em paridade se editar).
 */

export type ProfLang = 'pt-BR' | 'en-US' | 'es-ES' | 'it-IT'

interface HouseText { title: string; body: string }

// Tema do ano quando cada casa se acende (foco, não destino fechado).
const HOUSE_THEME: Record<number, Record<ProfLang, HouseText>> = {
  1: {
    'pt-BR': { title: 'Ano de recomeço e identidade', body: 'A Casa 1 acende: é um ano sobre VOCÊ — corpo, vitalidade, imagem e novos começos. Tende a marcar uma virada pessoal, uma retomada de direção. Cuide da saúde e da energia; o que você iniciar agora pauta o ciclo à frente.' },
    'en-US': { title: 'A year of fresh starts and identity', body: 'The 1st house lights up: this year is about YOU — body, vitality, image and new beginnings. It tends to mark a personal turning point, a fresh direction. Tend to your health and energy; what you start now sets the tone for the cycle ahead.' },
    'es-ES': { title: 'Ano de reinicio e identidad', body: 'La Casa 1 se enciende: este ano trata de TI — cuerpo, vitalidad, imagen y nuevos comienzos. Suele marcar un giro personal, una direccion nueva. Cuida la salud y la energia; lo que inicies ahora marca el ciclo por venir.' },
    'it-IT': { title: 'Anno di ripartenza e identita', body: 'La Casa 1 si accende: e un anno su di TE — corpo, vitalita, immagine e nuovi inizi. Tende a segnare una svolta personale, una direzione nuova. Cura la salute e l energia; cio che inizi ora imposta il ciclo che viene.' },
  },
  2: {
    'pt-BR': { title: 'Ano de recursos e sustento', body: 'A Casa 2 acende: dinheiro, bens, valores e o que te sustenta ficam em foco. Ano de organizar as finanças, ganhar por conta própria e clarear o que de fato importa pra você. Vale investir no que dá base concreta.' },
    'en-US': { title: 'A year of resources and support', body: 'The 2nd house lights up: money, possessions, values and what sustains you come into focus. A year to organize finances, earn on your own terms and get clear on what truly matters. Worth investing in what gives you a solid base.' },
    'es-ES': { title: 'Ano de recursos y sustento', body: 'La Casa 2 se enciende: dinero, bienes, valores y lo que te sostiene entran en foco. Ano para ordenar las finanzas, ganar por cuenta propia y aclarar lo que de veras importa. Conviene invertir en lo que da base concreta.' },
    'it-IT': { title: 'Anno di risorse e sostegno', body: 'La Casa 2 si accende: denaro, beni, valori e cio che ti sostiene sono in primo piano. Anno per ordinare le finanze, guadagnare in proprio e chiarire cio che conta davvero. Vale investire in cio che da una base concreta.' },
  },
  3: {
    'pt-BR': { title: 'Ano de comunicação e movimento', body: 'A Casa 3 acende: conversas, estudos, irmãos, vizinhança e a rotina de curtas distâncias ganham peso. Ano bom pra aprender, escrever, negociar e circular. Muita informação passa por você — filtre o que importa.' },
    'en-US': { title: 'A year of communication and movement', body: 'The 3rd house lights up: conversations, learning, siblings, neighborhood and short-distance routine gain weight. A good year to study, write, negotiate and get around. A lot of information flows through you — filter what matters.' },
    'es-ES': { title: 'Ano de comunicacion y movimiento', body: 'La Casa 3 se enciende: conversaciones, estudios, hermanos, vecindario y la rutina de cortas distancias cobran peso. Buen ano para aprender, escribir, negociar y circular. Mucha informacion pasa por ti — filtra lo que importa.' },
    'it-IT': { title: 'Anno di comunicazione e movimento', body: 'La Casa 3 si accende: conversazioni, studi, fratelli, vicinato e la routine di corte distanze prendono peso. Buon anno per imparare, scrivere, negoziare e muoverti. Molte informazioni passano da te — filtra cio che conta.' },
  },
  4: {
    'pt-BR': { title: 'Ano de lar e raízes', body: 'A Casa 4 acende: casa, família, origem e a base emocional pedem atenção. Ano de mudanças de moradia, cuidado com os seus e reencontro com as raízes. O que você firma por dentro agora sustenta o resto.' },
    'en-US': { title: 'A year of home and roots', body: 'The 4th house lights up: home, family, origins and your emotional base ask for attention. A year of moves, caring for your people and reconnecting with roots. What you settle within now supports everything else.' },
    'es-ES': { title: 'Ano de hogar y raices', body: 'La Casa 4 se enciende: hogar, familia, origen y la base emocional piden atencion. Ano de mudanzas, cuidado de los tuyos y reencuentro con las raices. Lo que afirmas por dentro ahora sostiene el resto.' },
    'it-IT': { title: 'Anno di casa e radici', body: 'La Casa 4 si accende: casa, famiglia, origini e la base emotiva chiedono attenzione. Anno di traslochi, cura dei tuoi e riavvicinamento alle radici. Cio che consolidi dentro ora sostiene il resto.' },
  },
  5: {
    'pt-BR': { title: 'Ano de criação e prazer', body: 'A Casa 5 acende: criatividade, romance, filhos, jogo e o prazer de se expressar ficam vivos. Ano pra criar, se apaixonar, brincar e mostrar o seu brilho. Faça o que te dá alegria genuína — é o combustível do ciclo.' },
    'en-US': { title: 'A year of creation and pleasure', body: 'The 5th house lights up: creativity, romance, children, play and the joy of expressing yourself come alive. A year to create, fall in love, play and show your shine. Do what gives you genuine joy — it is the fuel of the cycle.' },
    'es-ES': { title: 'Ano de creacion y placer', body: 'La Casa 5 se enciende: creatividad, romance, hijos, juego y el placer de expresarte se avivan. Ano para crear, enamorarte, jugar y mostrar tu brillo. Haz lo que te da alegria genuina — es el combustible del ciclo.' },
    'it-IT': { title: 'Anno di creazione e piacere', body: 'La Casa 5 si accende: creativita, romanticismo, figli, gioco e il piacere di esprimerti si ravvivano. Anno per creare, innamorarti, giocare e mostrare la tua luce. Fai cio che ti da gioia genuina — e il carburante del ciclo.' },
  },
  6: {
    'pt-BR': { title: 'Ano de trabalho e saúde', body: 'A Casa 6 acende: rotina, trabalho, saúde, hábitos e serviço pedem foco. Ano de arrumar a casa por dentro — corpo, agenda e método. O progresso vem do dia a dia bem cuidado, não de um salto: consistência ganha.' },
    'en-US': { title: 'A year of work and health', body: 'The 6th house lights up: routine, work, health, habits and service ask for focus. A year to put the inner house in order — body, schedule and method. Progress comes from a well-tended everyday, not a leap: consistency wins.' },
    'es-ES': { title: 'Ano de trabajo y salud', body: 'La Casa 6 se enciende: rutina, trabajo, salud, habitos y servicio piden foco. Ano para ordenar la casa por dentro — cuerpo, agenda y metodo. El progreso viene del dia a dia bien cuidado, no de un salto: la constancia gana.' },
    'it-IT': { title: 'Anno di lavoro e salute', body: 'La Casa 6 si accende: routine, lavoro, salute, abitudini e servizio chiedono foco. Anno per mettere in ordine la casa interna — corpo, agenda e metodo. Il progresso viene dal quotidiano ben curato, non da un salto: la costanza vince.' },
  },
  7: {
    'pt-BR': { title: 'Ano de relações e parcerias', body: 'A Casa 7 acende: o OUTRO entra em cena — casamento, sociedades, contratos e a arte de se equilibrar a dois. Ano de compromisso, acordo e espelho: as relações mostram quem você é. Cuide dos vínculos e dos combinados.' },
    'en-US': { title: 'A year of relationships and partnerships', body: 'The 7th house lights up: the OTHER takes the stage — marriage, partnerships, contracts and the art of balancing as two. A year of commitment, agreement and mirror: relationships show who you are. Tend to bonds and to what you agree on.' },
    'es-ES': { title: 'Ano de relaciones y sociedades', body: 'La Casa 7 se enciende: el OTRO entra en escena — matrimonio, sociedades, contratos y el arte de equilibrarse de a dos. Ano de compromiso, acuerdo y espejo: las relaciones muestran quien eres. Cuida los vinculos y los acuerdos.' },
    'it-IT': { title: 'Anno di relazioni e partnership', body: 'La Casa 7 si accende: l ALTRO entra in scena — matrimonio, societa, contratti e l arte di equilibrarsi in due. Anno di impegno, accordo e specchio: le relazioni mostrano chi sei. Cura i legami e i patti.' },
  },
  8: {
    'pt-BR': { title: 'Ano de transformação e profundidade', body: 'A Casa 8 acende: crises fecundas, intimidade profunda, recursos compartilhados (dívidas, heranças, impostos) e o que precisa morrer pra renascer. Ano intenso de virada interna. Solte o que acabou; do fundo vem a renovação.' },
    'en-US': { title: 'A year of transformation and depth', body: 'The 8th house lights up: fertile crises, deep intimacy, shared resources (debts, inheritance, taxes) and what must die to be reborn. An intense year of inner turning. Let go of what is over; renewal rises from the depths.' },
    'es-ES': { title: 'Ano de transformacion y profundidad', body: 'La Casa 8 se enciende: crisis fecundas, intimidad profunda, recursos compartidos (deudas, herencias, impuestos) y lo que debe morir para renacer. Ano intenso de giro interno. Suelta lo que termino; del fondo viene la renovacion.' },
    'it-IT': { title: 'Anno di trasformazione e profondita', body: 'La Casa 8 si accende: crisi feconde, intimita profonda, risorse condivise (debiti, eredita, tasse) e cio che deve morire per rinascere. Anno intenso di svolta interna. Lascia cio che e finito; dal fondo viene il rinnovamento.' },
  },
  9: {
    'pt-BR': { title: 'Ano de expansão e sentido', body: 'A Casa 9 acende: viagens, estudos superiores, filosofia, fé e o horizonte que se alarga. Ano de buscar sentido, se formar, publicar ou conhecer outras culturas. Abra o mapa: crescer aqui é sair da bolha conhecida.' },
    'en-US': { title: 'A year of expansion and meaning', body: 'The 9th house lights up: travel, higher study, philosophy, faith and a widening horizon. A year to seek meaning, get trained, publish or meet other cultures. Open the map: growth here means leaving the familiar bubble.' },
    'es-ES': { title: 'Ano de expansion y sentido', body: 'La Casa 9 se enciende: viajes, estudios superiores, filosofia, fe y el horizonte que se amplia. Ano para buscar sentido, formarte, publicar o conocer otras culturas. Abre el mapa: crecer aqui es salir de la burbuja conocida.' },
    'it-IT': { title: 'Anno di espansione e senso', body: 'La Casa 9 si accende: viaggi, studi superiori, filosofia, fede e l orizzonte che si allarga. Anno per cercare senso, formarti, pubblicare o conoscere altre culture. Apri la mappa: crescere qui significa uscire dalla bolla nota.' },
  },
  10: {
    'pt-BR': { title: 'Ano de carreira e vocação', body: 'A Casa 10 acende: carreira, imagem pública, autoridade e o rumo profissional ficam no centro. Ano de colher reconhecimento, assumir responsabilidade e aparecer. O que você constrói agora define sua reputação por um tempo.' },
    'en-US': { title: 'A year of career and vocation', body: 'The 10th house lights up: career, public image, authority and professional direction take center stage. A year to reap recognition, take responsibility and be seen. What you build now shapes your reputation for a while.' },
    'es-ES': { title: 'Ano de carrera y vocacion', body: 'La Casa 10 se enciende: carrera, imagen publica, autoridad y el rumbo profesional quedan en el centro. Ano para cosechar reconocimiento, asumir responsabilidad y aparecer. Lo que construyes ahora define tu reputacion por un tiempo.' },
    'it-IT': { title: 'Anno di carriera e vocazione', body: 'La Casa 10 si accende: carriera, immagine pubblica, autorita e la direzione professionale al centro. Anno per raccogliere riconoscimenti, assumerti responsabilita e farti vedere. Cio che costruisci ora forma la tua reputazione per un po.' },
  },
  11: {
    'pt-BR': { title: 'Ano de amizades e projetos', body: 'A Casa 11 acende: amigos, grupos, redes, causas e planos de futuro se movimentam. Ano de pertencer, colaborar e colher frutos do que foi semeado na carreira. As pessoas certas abrem portas: cultive a rede.' },
    'en-US': { title: 'A year of friends and projects', body: 'The 11th house lights up: friends, groups, networks, causes and future plans get moving. A year to belong, collaborate and reap what was sown in your career. The right people open doors: cultivate the network.' },
    'es-ES': { title: 'Ano de amistades y proyectos', body: 'La Casa 11 se enciende: amigos, grupos, redes, causas y planes de futuro se mueven. Ano para pertenecer, colaborar y cosechar lo sembrado en la carrera. Las personas correctas abren puertas: cultiva la red.' },
    'it-IT': { title: 'Anno di amicizie e progetti', body: 'La Casa 11 si accende: amici, gruppi, reti, cause e piani futuri si muovono. Anno per appartenere, collaborare e raccogliere cio che hai seminato nella carriera. Le persone giuste aprono porte: coltiva la rete.' },
  },
  12: {
    'pt-BR': { title: 'Ano de recolhimento e cura', body: 'A Casa 12 acende: retiro, encerramentos, o invisível, o inconsciente e a espiritualidade pedem espaço. Ano de soltar o que pesa, descansar, cuidar por dentro e preparar o próximo ciclo (a Casa 1 vem depois). Menos agir, mais dissolver.' },
    'en-US': { title: 'A year of retreat and healing', body: 'The 12th house lights up: retreat, endings, the unseen, the unconscious and spirituality ask for room. A year to release what weighs, rest, heal within and prepare the next cycle (the 1st house comes next). Less doing, more dissolving.' },
    'es-ES': { title: 'Ano de recogimiento y cura', body: 'La Casa 12 se enciende: retiro, cierres, lo invisible, lo inconsciente y la espiritualidad piden espacio. Ano para soltar lo que pesa, descansar, cuidar por dentro y preparar el proximo ciclo (la Casa 1 viene despues). Menos actuar, mas disolver.' },
    'it-IT': { title: 'Anno di raccoglimento e cura', body: 'La Casa 12 si accende: ritiro, chiusure, l invisibile, l inconscio e la spiritualita chiedono spazio. Anno per lasciare cio che pesa, riposare, curarti dentro e preparare il prossimo ciclo (la Casa 1 viene dopo). Meno agire, piu dissolvere.' },
  },
}

// Como o senhor do ano (planeta regente do signo profeccional) colore o período.
const LORD_BLURB: Record<string, Record<ProfLang, string>> = {
  sun: {
    'pt-BR': 'o Sol rege o ano: propósito, vitalidade e reconhecimento guiam — é hora de brilhar e liderar a própria vida.',
    'en-US': 'the Sun rules the year: purpose, vitality and recognition lead — a time to shine and lead your own life.',
    'es-ES': 'el Sol rige el ano: proposito, vitalidad y reconocimiento guian — es hora de brillar y liderar tu vida.',
    'it-IT': 'il Sole regge l anno: scopo, vitalita e riconoscimento guidano — e ora di brillare e guidare la tua vita.',
  },
  moon: {
    'pt-BR': 'a Lua rege o ano: emoção, cuidado, casa e ciclos pedem escuta — o que nutre importa mais que o que aparenta.',
    'en-US': 'the Moon rules the year: emotion, care, home and cycles ask to be heard — what nourishes matters more than what shows.',
    'es-ES': 'la Luna rige el ano: emocion, cuidado, hogar y ciclos piden escucha — lo que nutre importa mas que lo que aparenta.',
    'it-IT': 'la Luna regge l anno: emozione, cura, casa e cicli chiedono ascolto — cio che nutre conta piu di cio che appare.',
  },
  mercury: {
    'pt-BR': 'Mercúrio rege o ano: mente, palavra, estudo e negócio ficam ágeis — pense, aprenda, escreva e conecte.',
    'en-US': 'Mercury rules the year: mind, word, study and business turn nimble — think, learn, write and connect.',
    'es-ES': 'Mercurio rige el ano: mente, palabra, estudio y negocio se agilizan — piensa, aprende, escribe y conecta.',
    'it-IT': 'Mercurio regge l anno: mente, parola, studio e affari diventano agili — pensa, impara, scrivi e connetti.',
  },
  venus: {
    'pt-BR': 'Vênus rege o ano: amor, valor, prazer e harmonia guiam — cultive vínculos, beleza e o que te dá gosto de viver.',
    'en-US': 'Venus rules the year: love, worth, pleasure and harmony lead — cultivate bonds, beauty and what makes life sweet.',
    'es-ES': 'Venus rige el ano: amor, valor, placer y armonia guian — cultiva vinculos, belleza y lo que te da gusto de vivir.',
    'it-IT': 'Venere regge l anno: amore, valore, piacere e armonia guidano — coltiva legami, bellezza e cio che rende dolce la vita.',
  },
  mars: {
    'pt-BR': 'Marte rege o ano: ação, coragem e iniciativa comandam — é hora de agir e afirmar, cuidando pra não brigar por impulso.',
    'en-US': 'Mars rules the year: action, courage and initiative take charge — a time to act and assert, careful not to fight on impulse.',
    'es-ES': 'Marte rige el ano: accion, coraje e iniciativa mandan — es hora de actuar y afirmar, con cuidado de no pelear por impulso.',
    'it-IT': 'Marte regge l anno: azione, coraggio e iniziativa comandano — e ora di agire e affermarti, attento a non litigare d impulso.',
  },
  jupiter: {
    'pt-BR': 'Júpiter rege o ano: expansão, sentido e oportunidade se abrem — aposte no crescimento, mas sem exagerar na aposta.',
    'en-US': 'Jupiter rules the year: expansion, meaning and opportunity open up — bet on growth, without overplaying the hand.',
    'es-ES': 'Jupiter rige el ano: expansion, sentido y oportunidad se abren — apuesta al crecimiento, sin exagerar la apuesta.',
    'it-IT': 'Giove regge l anno: espansione, senso e opportunita si aprono — punta sulla crescita, senza esagerare la scommessa.',
  },
  saturn: {
    'pt-BR': 'Saturno rege o ano: estrutura, limite, maturidade e tempo pedem disciplina — construa com paciência, o fruto é sólido e duradouro.',
    'en-US': 'Saturn rules the year: structure, limit, maturity and time ask for discipline — build with patience, the fruit is solid and lasting.',
    'es-ES': 'Saturno rige el ano: estructura, limite, madurez y tiempo piden disciplina — construye con paciencia, el fruto es solido y duradero.',
    'it-IT': 'Saturno regge l anno: struttura, limite, maturita e tempo chiedono disciplina — costruisci con pazienza, il frutto e solido e duraturo.',
  },
}

export function profectionHouseText(house: number, lang: ProfLang): HouseText | null {
  return HOUSE_THEME[house]?.[lang] || HOUSE_THEME[house]?.['pt-BR'] || null
}

export function profectionLordBlurb(timeLordEn: string, lang: ProfLang): string {
  const row = LORD_BLURB[timeLordEn]
  return row ? (row[lang] || row['pt-BR']) : ''
}
