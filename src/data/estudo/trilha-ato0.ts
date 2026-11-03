import type { Unidade } from './tipos'

/**
 * ATO 0 — POR QUE O CÉU DIZ ALGO.
 *
 * ⚠️ ESTE ATO CARREGA A TESE DO APP, não informação neutra: o planeta é uma
 * gravidade a transmutar, não uma influência a que se reage. Tudo o que vem
 * nos atos seguintes (casas, signos, aspectos) só se lê direito depois destas
 * três lições — por isso elas vêm primeiro e por isso cada uma termina num
 * `cuidado` dizendo o que a astrologia NÃO afirma.
 *
 * A credibilidade desta área se constrói exatamente aí: separando o que é
 * registro histórico do que é leitura da tradição, em vez de emendar os dois.
 */
export const TRILHA_ATO0: Unidade[] = [
  {
    id: 'licao-01-ceu-observado',
    tipo: 'licao',
    ato: 0,
    ordem: 1,
    titulo: {
      'pt-BR': 'O céu que olharam por cinco mil anos',
      'en-US': 'The sky they watched for five thousand years',
      'es-ES': 'El cielo que miraron por cinco mil anos',
      'it-IT': 'Il cielo che hanno guardato per cinquemila anni',
    },
    resumo: {
      'pt-BR': 'Antes de significar qualquer coisa, a astrologia foi um registro do que se repetia.',
      'en-US': 'Before it meant anything, astrology was a record of what repeated.',
      'es-ES': 'Antes de significar algo, la astrologia fue un registro de lo que se repetia.',
      'it-IT': 'Prima di significare qualcosa, l astrologia fu un registro di cio che si ripeteva.',
    },
    blocos: [
      {
        tipo: 'paragrafo',
        texto: {
          'pt-BR': 'A astrologia começou como contabilidade. Povos que dependiam da cheia de um rio ou da chegada da chuva precisavam saber quando. O céu era o único relógio grande o bastante: as mesmas estrelas voltavam à mesma posição, e a enchente vinha junto.',
          'en-US': 'Astrology began as bookkeeping. Peoples who depended on a river flooding or the rains arriving needed to know when. The sky was the only clock large enough: the same stars returned to the same position, and the flood came with them.',
          'es-ES': 'La astrologia empezo como contabilidad. Pueblos que dependian de la crecida de un rio o de la llegada de la lluvia necesitaban saber cuando. El cielo era el unico reloj bastante grande: las mismas estrellas volvian a la misma posicion, y la crecida venia con ellas.',
          'it-IT': 'L astrologia nacque come contabilita. Popoli che dipendevano dalla piena di un fiume o dall arrivo della pioggia dovevano sapere quando. Il cielo era l unico orologio abbastanza grande: le stesse stelle tornavano alla stessa posizione, e la piena arrivava con loro.',
        },
      },
      {
        tipo: 'paragrafo',
        texto: {
          'pt-BR': 'O passo seguinte foi humano e inevitável: se o céu marca a cheia, marcaria também a colheita, a guerra, o nascimento de um rei. Mesopotâmia, Egito, Índia, China e Mesoamérica fizeram essa passagem separadamente, sem contato entre si.',
          'en-US': 'The next step was human and inevitable: if the sky marks the flood, it would also mark the harvest, the war, the birth of a king. Mesopotamia, Egypt, India, China and Mesoamerica made that leap separately, with no contact between them.',
          'es-ES': 'El paso siguiente fue humano e inevitable: si el cielo marca la crecida, marcaria tambien la cosecha, la guerra, el nacimiento de un rey. Mesopotamia, Egipto, India, China y Mesoamerica dieron ese paso por separado, sin contacto entre si.',
          'it-IT': 'Il passo seguente fu umano e inevitabile: se il cielo segna la piena, segnerebbe anche il raccolto, la guerra, la nascita di un re. Mesopotamia, Egitto, India, Cina e Mesoamerica fecero quel passaggio separatamente, senza contatto tra loro.',
        },
      },
      {
        tipo: 'destaque',
        texto: {
          'pt-BR': 'Cinco civilizações sem contato chegaram à mesma intuição: o que acontece em cima acompanha o que acontece embaixo.',
          'en-US': 'Five civilizations with no contact reached the same intuition: what happens above accompanies what happens below.',
          'es-ES': 'Cinco civilizaciones sin contacto llegaron a la misma intuicion: lo que pasa arriba acompana lo que pasa abajo.',
          'it-IT': 'Cinque civilta senza contatto giunsero alla stessa intuizione: cio che accade sopra accompagna cio che accade sotto.',
        },
      },
      {
        tipo: 'paragrafo',
        texto: {
          'pt-BR': 'A virada decisiva veio na Grécia, por volta do século II a.C. Até ali o céu falava do reino: a safra, o rei, a guerra. Foi ali que alguém perguntou pela primeira vez o que o céu dizia de uma pessoa comum, num instante comum — e nasceu o mapa natal, a fotografia do céu no minuto de um nascimento qualquer. É esse objeto, e não o antigo presságio de império, que este app calcula.',
          'en-US': 'The decisive turn came in Greece, around the second century BC. Until then the sky spoke of the kingdom: the harvest, the king, the war. It was there that someone first asked what the sky said about an ordinary person, at an ordinary instant — and the natal chart was born, the photograph of the sky at the minute of any given birth. That object, not the old imperial omen, is what this app computes.',
          'es-ES': 'El giro decisivo llego en Grecia, hacia el siglo II a.C. Hasta entonces el cielo hablaba del reino: la cosecha, el rey, la guerra. Fue alli donde alguien pregunto por primera vez que decia el cielo de una persona comun, en un instante comun, y nacio la carta natal, la fotografia del cielo en el minuto de un nacimiento cualquiera. Es ese objeto, y no el viejo presagio de imperio, lo que esta app calcula.',
          'it-IT': 'La svolta decisiva arrivo in Grecia, intorno al II secolo a.C. Fino ad allora il cielo parlava del regno: il raccolto, il re, la guerra. Fu li che qualcuno chiese per la prima volta cosa dicesse il cielo di una persona comune, in un istante comune, e nacque la carta natale, la fotografia del cielo nel minuto di una nascita qualsiasi. E questo oggetto, non il vecchio presagio d impero, cio che questa app calcola.',
        },
      },
      {
        tipo: 'paragrafo',
        texto: {
          'pt-BR': 'Por quase toda essa história, astronomia e astrologia foram a mesma profissão. Quem calculava a posição de Marte calculava para interpretá-la; Kepler, que descobriu as leis das órbitas planetárias, ganhava a vida levantando mapas. A separação é recente — e é a razão de o cálculo deste app ser astronômico de verdade, com a mesma efeméride que a ciência usa, enquanto a leitura é outra camada, declarada como tal.',
          'en-US': 'For almost all of that history, astronomy and astrology were the same profession. Whoever computed the position of Mars computed it in order to interpret it; Kepler, who found the laws of planetary orbits, made a living casting charts. The split is recent — and it is why the computation in this app is genuinely astronomical, using the same ephemeris science uses, while the reading is a separate layer, declared as such.',
          'es-ES': 'Durante casi toda esa historia, astronomia y astrologia fueron la misma profesion. Quien calculaba la posicion de Marte lo hacia para interpretarla; Kepler, que descubrio las leyes de las orbitas planetarias, se ganaba la vida levantando cartas. La separacion es reciente, y es la razon de que el calculo de esta app sea astronomico de verdad, con la misma efemeride que usa la ciencia, mientras que la lectura es otra capa, declarada como tal.',
          'it-IT': 'Per quasi tutta quella storia, astronomia e astrologia furono la stessa professione. Chi calcolava la posizione di Marte lo faceva per interpretarla; Keplero, che scopri le leggi delle orbite planetarie, si guadagnava da vivere stilando carte. La separazione e recente, ed e la ragione per cui il calcolo di questa app e astronomico davvero, con la stessa effemeride usata dalla scienza, mentre la lettura e un altro strato, dichiarato come tale.',
        },
      },
      {
        tipo: 'cuidado',
        texto: {
          'pt-BR': 'Convergência não é prova. Que povos distantes tenham chegado a leituras parecidas mostra que a pergunta é antiga e universal — não que a resposta esteja demonstrada.',
          'en-US': 'Convergence is not proof. That distant peoples reached similar readings shows the question is old and universal, not that the answer is demonstrated.',
          'es-ES': 'Convergencia no es prueba. Que pueblos distantes llegaran a lecturas parecidas muestra que la pregunta es antigua y universal, no que la respuesta este demostrada.',
          'it-IT': 'Convergenza non e prova. Che popoli distanti siano giunti a letture simili mostra che la domanda e antica e universale, non che la risposta sia dimostrata.',
        },
      },
    ],
    termos: ['efemeride'],
    verTambem: ['licao-02-gravidade-nao-destino'],
    minutos: 2,
  },

  {
    id: 'licao-02-gravidade-nao-destino',
    tipo: 'licao',
    ato: 0,
    ordem: 2,
    titulo: {
      'pt-BR': 'Gravidade, não destino',
      'en-US': 'Gravity, not destiny',
      'es-ES': 'Gravedad, no destino',
      'it-IT': 'Gravita, non destino',
    },
    resumo: {
      'pt-BR': 'O trânsito inclina o terreno. Quem escolhe a direção continua sendo você.',
      'en-US': 'A transit tilts the ground. The one choosing the direction is still you.',
      'es-ES': 'El transito inclina el terreno. Quien elige la direccion sigues siendo tu.',
      'it-IT': 'Il transito inclina il terreno. Chi sceglie la direzione sei ancora tu.',
    },
    blocos: [
      {
        tipo: 'paragrafo',
        texto: {
          'pt-BR': 'Um planeta em trânsito não manda em ninguém. Ele inclina o terreno. A diferença entre um empurrão e uma ordem é a mesma que existe entre andar numa ladeira e andar sobre um trilho: na ladeira você sente o peso a cada passo e ainda escolhe para onde vai; no trilho não há escolha nenhuma.',
          'en-US': 'A planet in transit commands no one. It tilts the ground. The difference between a push and an order is the same as between walking up a slope and walking on a rail: on the slope you feel the weight at every step and still choose where to go; on the rail there is no choice at all.',
          'es-ES': 'Un planeta en transito no manda en nadie. Inclina el terreno. La diferencia entre un empujon y una orden es la misma que hay entre caminar por una cuesta y caminar sobre un riel: en la cuesta sientes el peso a cada paso y aun eliges adonde vas; en el riel no hay eleccion alguna.',
          'it-IT': 'Un pianeta in transito non comanda nessuno. Inclina il terreno. La differenza tra una spinta e un ordine e la stessa che passa tra camminare su una salita e camminare su un binario: sulla salita senti il peso a ogni passo e scegli ancora dove andare; sul binario non c e scelta alcuna.',
        },
      },
      {
        tipo: 'paragrafo',
        texto: {
          'pt-BR': 'É aí que a leitura muda. A mesma passagem de Saturno pode virar duas coisas completamente diferentes. Quem reage a ela sente cobrança, cansaço, a sensação de que tudo ficou mais pesado sem motivo. Quem a usa descobre que o peso estava pedindo estrutura — e constrói o que antes não parava de pé. A pressão é a mesma; o que muda é quem atravessa.',
          'en-US': 'That is where the reading changes. The same passage of Saturn can become two completely different things. Whoever reacts to it feels demand, tiredness, the sense that everything got heavier for no reason. Whoever uses it discovers the weight was asking for structure, and builds what did not stand up before. The pressure is the same; what changes is who crosses it.',
          'es-ES': 'Ahi es donde cambia la lectura. El mismo paso de Saturno puede volverse dos cosas completamente distintas. Quien reacciona a el siente exigencia, cansancio, la sensacion de que todo se puso mas pesado sin motivo. Quien lo usa descubre que el peso pedia estructura, y construye lo que antes no se sostenia. La presion es la misma; lo que cambia es quien atraviesa.',
          'it-IT': 'E li che la lettura cambia. Lo stesso passaggio di Saturno puo diventare due cose completamente diverse. Chi vi reagisce sente pretesa, stanchezza, la sensazione che tutto sia diventato piu pesante senza motivo. Chi lo usa scopre che il peso chiedeva struttura, e costruisce cio che prima non stava in piedi. La pressione e la stessa; cio che cambia e chi attraversa.',
        },
      },
      {
        tipo: 'paragrafo',
        texto: {
          'pt-BR': 'Transmutar não é pensar positivo. É reconhecer a matéria-prima que chegou e trabalhá-la: a pressão de Saturno é material de construção, o corte de Plutão é material de limpeza, a névoa de Netuno é material de imaginação. Negar que a pressão existe não a dissolve — apenas entrega a direção a ela.',
          'en-US': 'To transmute is not to think positive. It is to recognise the raw material that arrived and work it: the pressure of Saturn is building material, the cut of Pluto is clearing material, the fog of Neptune is material for imagination. Denying the pressure exists does not dissolve it — it merely hands the direction over to it.',
          'es-ES': 'Transmutar no es pensar en positivo. Es reconocer la materia prima que llego y trabajarla: la presion de Saturno es material de construccion, el corte de Pluton es material de limpieza, la niebla de Neptuno es material de imaginacion. Negar que la presion existe no la disuelve, solo le entrega la direccion.',
          'it-IT': 'Trasmutare non e pensare positivo. E riconoscere la materia prima arrivata e lavorarla: la pressione di Saturno e materiale da costruzione, il taglio di Plutone e materiale di pulizia, la nebbia di Nettuno e materiale per l immaginazione. Negare che la pressione esista non la dissolve, le consegna soltanto la direzione.',
        },
      },
      {
        tipo: 'destaque',
        texto: {
          'pt-BR': 'O planeta puxa. Quem decide a direção é quem caminha.',
          'en-US': 'The planet pulls. The one who decides the direction is the one who walks.',
          'es-ES': 'El planeta tira. Quien decide la direccion es quien camina.',
          'it-IT': 'Il pianeta tira. Chi decide la direzione e chi cammina.',
        },
      },
      {
        tipo: 'exemplo',
        texto: {
          'pt-BR': 'Saturno passa sobre o seu Sol. Lido como sentença: "vai ser um ano difícil, melhor não tentar nada". Lido como gravidade: "há peso sobre quem eu sou, então este é o ano de tirar do caminho o que não me sustenta e firmar o que sustenta". Mesmo céu, dois anos diferentes.',
          'en-US': 'Saturn passes over your Sun. Read as a verdict: "a hard year ahead, better not try anything". Read as gravity: "there is weight on who I am, so this is the year to clear away what does not hold me and firm up what does". Same sky, two different years.',
          'es-ES': 'Saturno pasa sobre tu Sol. Leido como sentencia: "sera un ano dificil, mejor no intentar nada". Leido como gravedad: "hay peso sobre quien soy, entonces este es el ano de apartar lo que no me sostiene y afirmar lo que si". Mismo cielo, dos anos distintos.',
          'it-IT': 'Saturno passa sul tuo Sole. Letto come sentenza: "sara un anno difficile, meglio non tentare nulla". Letto come gravita: "c e peso su chi sono, quindi questo e l anno per togliere di mezzo cio che non mi sostiene e consolidare cio che mi sostiene". Stesso cielo, due anni diversi.',
        },
      },
      // ⚠️ INERTE NA FASE 1 — o renderizador pula este bloco. Ele nasce aqui,
      // junto do texto, porque a fase 2 vai mostrar o trânsito REAL de hoje
      // exatamente neste ponto da lição: logo depois do exemplo genérico de
      // Saturno. Encaixá-lo depois obrigaria a reescrever a lição publicada.
      { tipo: 'ganchoPessoal', chave: 'transito-de-hoje' },
      {
        tipo: 'cuidado',
        texto: {
          'pt-BR': 'Isso não é promessa de que a vontade anula a dificuldade. Um trânsito duro continua duro. É a recusa de ler o mapa como sentença — e nada além disso.',
          'en-US': 'This is not a promise that willpower cancels the difficulty. A hard transit stays hard. It is the refusal to read the chart as a verdict, and nothing beyond that.',
          'es-ES': 'Esto no es promesa de que la voluntad anule la dificultad. Un transito duro sigue duro. Es la negativa a leer la carta como sentencia, y nada mas.',
          'it-IT': 'Questo non e una promessa che la volonta annulli la difficolta. Un transito duro resta duro. E il rifiuto di leggere la carta come sentenza, e nulla di piu.',
        },
      },
    ],
    termos: ['transito'],
    verTambem: ['licao-03-quem-atravessa'],
    minutos: 2,
  },

  {
    id: 'licao-03-quem-atravessa',
    tipo: 'licao',
    ato: 0,
    ordem: 3,
    titulo: {
      'pt-BR': 'Quem atravessa a experiência',
      'en-US': 'Who crosses the experience',
      'es-ES': 'Quien atraviesa la experiencia',
      'it-IT': 'Chi attraversa l esperienza',
    },
    resumo: {
      'pt-BR': 'O mapa descreve o terreno da travessia. Não descreve quem atravessa.',
      'en-US': 'The chart describes the ground of the crossing. It does not describe who crosses.',
      'es-ES': 'La carta describe el terreno de la travesia. No describe a quien la atraviesa.',
      'it-IT': 'La carta descrive il terreno della traversata. Non descrive chi la attraversa.',
    },
    blocos: [
      {
        tipo: 'paragrafo',
        texto: {
          'pt-BR': 'Um mapa natal é um retrato do céu no instante em que você chegou. Ele descreve o terreno de uma travessia: onde há subida, onde há planície, onde o chão cede. O que ele não descreve, em nenhum ponto, é o viajante.',
          'en-US': 'A natal chart is a portrait of the sky at the instant you arrived. It describes the ground of a crossing: where the climb is, where the flat stretch is, where the floor gives way. What it does not describe, at any point, is the traveller.',
          'es-ES': 'Una carta natal es un retrato del cielo en el instante en que llegaste. Describe el terreno de una travesia: donde hay subida, donde hay llanura, donde el suelo cede. Lo que no describe, en ningun punto, es al viajero.',
          'it-IT': 'Una carta natale e un ritratto del cielo nell istante in cui sei arrivato. Descrive il terreno di una traversata: dove c e salita, dove c e pianura, dove il suolo cede. Cio che non descrive, in nessun punto, e il viaggiatore.',
        },
      },
      // ⚠️ INERTE NA FASE 1 — ver o comentário na lição 2. Aqui a fase 2 mostra
      // o aspecto mais exato do mapa de quem lê, para que "o terreno" deixe de
      // ser abstrato na frase seguinte.
      { tipo: 'ganchoPessoal', chave: 'aspecto-mais-exato' },
      {
        tipo: 'paragrafo',
        texto: {
          'pt-BR': 'Esta é a premissa que sustenta tudo o que vem adiante: somos espíritos atravessando uma experiência material, e os planetas são a topografia desse percurso, não a autoria dele. Levar em conta o relevo é sabedoria; confundi-lo com o caminhante é abrir mão da parte que de fato é sua.',
          'en-US': 'This is the premise holding up everything that follows: we are spirits crossing a material experience, and the planets are the topography of that route, not its authorship. Taking the relief into account is wisdom; mistaking it for the walker is giving up the part that is actually yours.',
          'es-ES': 'Esta es la premisa que sostiene todo lo que viene despues: somos espiritus atravesando una experiencia material, y los planetas son la topografia de ese recorrido, no su autoria. Tener en cuenta el relieve es sabiduria; confundirlo con el caminante es renunciar a la parte que de hecho es tuya.',
          'it-IT': 'Questa e la premessa che regge tutto cio che segue: siamo spiriti che attraversano un esperienza materiale, e i pianeti sono la topografia di quel percorso, non la sua autoria. Tenere conto del rilievo e saggezza; confonderlo con chi cammina e rinunciare alla parte che e davvero tua.',
        },
      },
      {
        tipo: 'paragrafo',
        texto: {
          'pt-BR': 'Na prática isso muda a pergunta que se leva ao mapa. Em vez de "o que vai acontecer comigo", que entrega a autoria a outro, a pergunta vira "o que está em jogo agora, e o que eu faço com isso". A primeira pede uma profecia; a segunda pede uma decisão — e só a segunda o mapa tem como responder.',
          'en-US': 'In practice that changes the question you bring to the chart. Instead of "what is going to happen to me", which hands the authorship to someone else, the question becomes "what is at stake now, and what do I do with it". The first asks for a prophecy; the second asks for a decision, and only the second is something a chart can answer.',
          'es-ES': 'En la practica eso cambia la pregunta que se le lleva a la carta. En vez de "que va a pasarme", que entrega la autoria a otro, la pregunta pasa a ser "que esta en juego ahora, y que hago con ello". La primera pide una profecia; la segunda pide una decision, y solo a la segunda la carta puede responder.',
          'it-IT': 'In pratica questo cambia la domanda che si porta alla carta. Invece di "cosa mi accadra", che consegna l autoria a un altro, la domanda diventa "cosa e in gioco adesso, e cosa ne faccio". La prima chiede una profezia; la seconda chiede una decisione, e solo alla seconda la carta puo rispondere.',
        },
      },
      {
        tipo: 'destaque',
        texto: {
          'pt-BR': 'O mapa é o terreno, não a sentença.',
          'en-US': 'The chart is the ground, not the verdict.',
          'es-ES': 'La carta es el terreno, no la sentencia.',
          'it-IT': 'La carta e il terreno, non la sentenza.',
        },
      },
      // ⚠️ O BLOCO MAIS IMPORTANTE DO CURSO. Dizer alto o que a astrologia não
      // afirma é o que permite dizer com credibilidade tudo o que ela afirma —
      // e é a diferença entre esta área e um aplicativo de adivinhação.
      {
        tipo: 'cuidado',
        texto: {
          'pt-BR': 'O que a astrologia não afirma, e este app não promete: ela não prevê acontecimentos, não determina escolhas e não substitui médico, advogado nem terapeuta. Ela descreve um clima — e clima se lê para decidir melhor, não para parar de decidir.',
          'en-US': 'What astrology does not claim, and this app does not promise: it does not predict events, it does not determine choices, and it does not replace a doctor, a lawyer or a therapist. It describes a climate, and a climate is read to decide better, not to stop deciding.',
          'es-ES': 'Lo que la astrologia no afirma, y esta app no promete: no predice acontecimientos, no determina elecciones y no sustituye a un medico, un abogado ni un terapeuta. Describe un clima, y el clima se lee para decidir mejor, no para dejar de decidir.',
          'it-IT': 'Cio che l astrologia non afferma, e questa app non promette: non prevede avvenimenti, non determina scelte e non sostituisce un medico, un avvocato ne un terapeuta. Descrive un clima, e il clima si legge per decidere meglio, non per smettere di decidere.',
        },
      },
    ],
    termos: ['natal'],
    // ⚠️ VAZIO DE PROPÓSITO. O destino natural daqui é a lição 4, que ainda não
    // existe — e um `verTambem` apontando para id inexistente é um beco
    // invisível, exatamente o que o teste de links mortos existe para impedir.
    // A Task 3 liga as duas quando a lição 4 nascer.
    verTambem: [],
    minutos: 2,
  },
]
