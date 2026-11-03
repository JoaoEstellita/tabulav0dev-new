import type { Unidade } from './tipos'

/**
 * OS DEZ PLANETAS — e POR QUE cada um carrega a força que carrega.
 *
 * ⚠️ DUAS ORIGENS DE SIGNIFICADO, e o texto diz qual é qual. Os sete clássicos
 * são visíveis a olho nu e conhecidos desde antes de qualquer registro: o
 * significado deles veio de milênios de observação acumulada — do que o astro
 * FAZ no céu (a velocidade de Mercúrio, a lentidão de Saturno, o brilho de
 * Vênus). Urano, Netuno e Plutão foram descobertos com a história já sendo
 * escrita em volta, e por isso ganham um bloco `sincronicidade`: dá para pôr a
 * data ao lado do que acontecia no mundo e deixar o leitor ver.
 *
 * ⚠️ FATO E LEITURA FICAM SEPARADOS. `ano`, `descoberta` e `noMundo` são
 * verificáveis; `leitura` é interpretação da tradição, e o renderizador a
 * separa por uma linha. Emendá-las apresentaria a terceira como demonstrada —
 * e é justamente a credibilidade que esta área existe para construir. Um teste
 * recusa palavras como "prova" e "portanto" dentro da leitura.
 *
 * ⚠️ QUÍRON NÃO ENTRA: o motor não o calcula, e um verbete prometeria o que o
 * mapa não mostra.
 */
export const VERBETES_PLANETAS: Unidade[] = [
  {
    id: 'planeta-sol',
    tipo: 'verbete',
    categoria: 'planeta',
    titulo: { 'pt-BR': 'Sol', 'en-US': 'Sun', 'es-ES': 'Sol', 'it-IT': 'Sole' },
    resumo: {
      'pt-BR': 'Quem você é quando ninguém precisa te aprovar.',
      'en-US': 'Who you are when nobody needs to approve of you.',
      'es-ES': 'Quien eres cuando nadie necesita aprobarte.',
      'it-IT': 'Chi sei quando nessuno deve approvarti.',
    },
    blocos: [
      {
        tipo: 'figura',
        chave: 'retrato-do-planeta',
        foco: 'sol',
        descricao: {
          'pt-BR': 'um disco dourado com raios em volta',
          'en-US': 'a golden disc with rays around it',
          'es-ES': 'un disco dorado con rayos alrededor',
          'it-IT': 'un disco dorato con raggi intorno',
        },
      },
      {
        tipo: 'paragrafo',
        texto: {
          'pt-BR': 'O Sol marca o centro: a identidade, a vontade, aquilo que você está aqui para ser. Não é a sua personalidade social nem o que os outros veem primeiro — é o núcleo que sobra quando todo o resto é tirado.',
          'en-US': 'The Sun marks the centre: identity, intent, what you are here to be. It is not your social personality nor what others see first — it is the core left when everything else is taken away.',
          'es-ES': 'El Sol marca el centro: la identidad, la voluntad, aquello que viniste a ser. No es tu personalidad social ni lo que los demas ven primero: es el nucleo que queda cuando se quita todo lo demas.',
          'it-IT': 'Il Sole segna il centro: l identita, la volonta, cio che sei qui per essere. Non e la tua personalita sociale ne cio che gli altri vedono per primo: e il nucleo che resta quando si toglie tutto il resto.',
        },
      },
      {
        tipo: 'destaque',
        texto: {
          'pt-BR': 'A força dele vem do óbvio: tudo no sistema gira em torno dele, e nada cresce sem a luz dele. O que o Sol toca no mapa é aquilo que, sem atenção, apaga o resto junto.',
          'en-US': 'Its force comes from the obvious: everything in the system turns around it, and nothing grows without its light. What the Sun touches in a chart is what, left unattended, dims everything else with it.',
          'es-ES': 'Su fuerza viene de lo obvio: todo en el sistema gira a su alrededor, y nada crece sin su luz. Lo que el Sol toca en la carta es aquello que, sin atencion, apaga lo demas con el.',
          'it-IT': 'La sua forza viene dall ovvio: tutto nel sistema gira intorno a lui, e nulla cresce senza la sua luce. Cio che il Sole tocca nella carta e cio che, senza attenzione, spegne con se anche il resto.',
        },
      },
    ],
    termos: [],
    verTambem: ['planeta-lua', 'licao-03-quem-atravessa'],
    minutos: 1,
  },

  {
    id: 'planeta-lua',
    tipo: 'verbete',
    categoria: 'planeta',
    titulo: { 'pt-BR': 'Lua', 'en-US': 'Moon', 'es-ES': 'Luna', 'it-IT': 'Luna' },
    resumo: {
      'pt-BR': 'O que você sente antes de decidir o que sentir.',
      'en-US': 'What you feel before deciding what to feel.',
      'es-ES': 'Lo que sientes antes de decidir que sentir.',
      'it-IT': 'Cio che senti prima di decidere cosa sentire.',
    },
    blocos: [
      {
        tipo: 'figura',
        chave: 'retrato-do-planeta',
        foco: 'lua',
        descricao: {
          'pt-BR': 'um disco acinzentado com os mares escuros e a sombra de uma fase cobrindo parte dele',
          'en-US': 'a greyish disc with the dark seas and the shadow of a phase covering part of it',
          'es-ES': 'un disco grisaceo con los mares oscuros y la sombra de una fase cubriendo parte de el',
          'it-IT': 'un disco grigiastro con i mari scuri e l ombra di una fase che ne copre una parte',
        },
      },
      {
        tipo: 'paragrafo',
        texto: {
          'pt-BR': 'A Lua é a reação antes do pensamento: o que te acalma, o que te assusta, de que jeito você pede colo. É também a memória emocional — o que ficou gravado antes de haver palavras para gravar.',
          'en-US': 'The Moon is the reaction before the thought: what calms you, what startles you, the way you ask for comfort. It is also emotional memory — what got recorded before there were words to record it.',
          'es-ES': 'La Luna es la reaccion antes del pensamiento: lo que te calma, lo que te asusta, el modo en que pides consuelo. Es tambien la memoria emocional: lo que quedo grabado antes de que hubiera palabras para grabarlo.',
          'it-IT': 'La Luna e la reazione prima del pensiero: cio che ti calma, cio che ti spaventa, il modo in cui chiedi conforto. E anche la memoria emotiva: cio che si e inciso prima che ci fossero parole per inciderlo.',
        },
      },
      {
        tipo: 'destaque',
        texto: {
          'pt-BR': 'A força dela vem do ciclo mais visível do céu: ela muda de cara a cada noite e volta ao início a cada 28 dias. É o astro que ensina que estado interno não é defeito — é fase.',
          'en-US': 'Its force comes from the most visible cycle in the sky: it changes face every night and returns to the start every 28 days. It is the body that teaches that an inner state is not a flaw — it is a phase.',
          'es-ES': 'Su fuerza viene del ciclo mas visible del cielo: cambia de cara cada noche y vuelve al inicio cada 28 dias. Es el astro que ensena que un estado interno no es un defecto: es una fase.',
          'it-IT': 'La sua forza viene dal ciclo piu visibile del cielo: cambia volto ogni notte e torna all inizio ogni 28 giorni. E l astro che insegna che uno stato interiore non e un difetto: e una fase.',
        },
      },
      {
        tipo: 'figura',
        chave: 'ciclo-da-lua',
        descricao: {
          'pt-BR': 'As oito fases da Lua em sequencia, da nova a cheia e de volta, com a marca de que o ciclo inteiro leva 28 dias e recomeca.',
          'en-US': 'The eight phases of the Moon in sequence, from new to full and back, marked with the whole cycle taking 28 days and restarting.',
          'es-ES': 'Las ocho fases de la Luna en secuencia, de nueva a llena y de vuelta, con la marca de que el ciclo entero dura 28 dias y vuelve a empezar.',
          'it-IT': 'Le otto fasi della Luna in sequenza, da nuova a piena e ritorno, con l indicazione che il ciclo intero dura 28 giorni e ricomincia.',
        },
      },
    ],
    termos: [],
    verTambem: ['planeta-sol'],
    minutos: 1,
  },

  {
    id: 'planeta-mercurio',
    tipo: 'verbete',
    categoria: 'planeta',
    titulo: { 'pt-BR': 'Mercúrio', 'en-US': 'Mercury', 'es-ES': 'Mercurio', 'it-IT': 'Mercurio' },
    resumo: {
      'pt-BR': 'Como você pensa, fala e liga uma coisa na outra.',
      'en-US': 'How you think, speak and connect one thing to another.',
      'es-ES': 'Como piensas, hablas y conectas una cosa con otra.',
      'it-IT': 'Come pensi, parli e colleghi una cosa all altra.',
    },
    blocos: [
      {
        tipo: 'figura',
        chave: 'retrato-do-planeta',
        foco: 'mercurio',
        descricao: {
          'pt-BR': 'um disco pequeno e cinzento, coberto de crateras',
          'en-US': 'a small grey disc covered in craters',
          'es-ES': 'un disco pequeno y gris, cubierto de crateres',
          'it-IT': 'un disco piccolo e grigio, coperto di crateri',
        },
      },
      {
        tipo: 'paragrafo',
        texto: {
          'pt-BR': 'Mercúrio é o trânsito de informação: a fala, a escrita, o raciocínio, o trajeto curto. Não diz o que você pensa — diz o COMO: rápido ou demorado, por imagem ou por lógica, em voz alta ou por dentro.',
          'en-US': 'Mercury is the traffic of information: speech, writing, reasoning, the short trip. It does not say what you think — it says HOW: fast or slow, by image or by logic, out loud or inwardly.',
          'es-ES': 'Mercurio es el transito de la informacion: el habla, la escritura, el razonamiento, el trayecto corto. No dice que piensas: dice COMO. Rapido o lento, por imagen o por logica, en voz alta o por dentro.',
          'it-IT': 'Mercurio e il transito dell informazione: la parola, la scrittura, il ragionamento, il tragitto breve. Non dice cosa pensi: dice COME. Veloce o lento, per immagini o per logica, ad alta voce o dentro di te.',
        },
      },
      {
        tipo: 'destaque',
        texto: {
          'pt-BR': 'A força dele vem da velocidade: é o planeta mais rápido, o que nunca se afasta muito do Sol, o que aparece e some do céu em questão de semanas. Mensageiro é o que ele faz, não uma metáfora escolhida.',
          'en-US': 'Its force comes from speed: the fastest planet, the one that never strays far from the Sun, the one that appears and vanishes from the sky within weeks. Messenger is what it does, not a metaphor someone picked.',
          'es-ES': 'Su fuerza viene de la velocidad: es el planeta mas rapido, el que nunca se aleja mucho del Sol, el que aparece y desaparece del cielo en semanas. Mensajero es lo que hace, no una metafora elegida.',
          'it-IT': 'La sua forza viene dalla velocita: e il pianeta piu rapido, quello che non si allontana mai molto dal Sole, quello che appare e sparisce dal cielo nel giro di settimane. Messaggero e cio che fa, non una metafora scelta.',
        },
      },
      {
        tipo: 'cuidado',
        texto: {
          'pt-BR': 'Mercúrio retrógrado não quebra aparelho nem cancela contrato. Retrógrado é um efeito de perspectiva: visto da Terra, o planeta parece andar para trás. A tradição lê isso como tempo de revisar em vez de lançar.',
          'en-US': 'Mercury retrograde does not break devices or cancel contracts. Retrograde is a matter of perspective: seen from Earth, the planet appears to move backwards. Tradition reads that as a time to revise rather than launch.',
          'es-ES': 'Mercurio retrogrado no rompe aparatos ni cancela contratos. Retrogrado es un efecto de perspectiva: visto desde la Tierra, el planeta parece andar hacia atras. La tradicion lo lee como tiempo de revisar en vez de lanzar.',
          'it-IT': 'Mercurio retrogrado non rompe apparecchi ne annulla contratti. Retrogrado e un effetto di prospettiva: visto dalla Terra, il pianeta sembra andare all indietro. La tradizione lo legge come tempo per rivedere invece che lanciare.',
        },
      },
      {
        tipo: 'figura',
        chave: 'elongacao-de-mercurio',
        descricao: {
          'pt-BR': 'O Sol no centro e a orbita de Mercurio em volta. Um arco destacado mostra que, visto da Terra, ele nunca se afasta mais de cerca de 28 graus do Sol.',
          'en-US': 'The Sun at the centre and the orbit of Mercury around it. A highlighted arc shows that, seen from Earth, it never strays more than about 28 degrees from the Sun.',
          'es-ES': 'El Sol en el centro y la orbita de Mercurio alrededor. Un arco destacado muestra que, visto desde la Tierra, nunca se aleja mas de unos 28 grados del Sol.',
          'it-IT': 'Il Sole al centro e l orbita di Mercurio intorno. Un arco evidenziato mostra che, visto dalla Terra, non si allontana mai piu di circa 28 gradi dal Sole.',
        },
      },
    ],
    termos: ['retrogrado'],
    verTambem: ['planeta-venus'],
    minutos: 2,
  },

  {
    id: 'planeta-venus',
    tipo: 'verbete',
    categoria: 'planeta',
    titulo: { 'pt-BR': 'Vênus', 'en-US': 'Venus', 'es-ES': 'Venus', 'it-IT': 'Venere' },
    resumo: {
      'pt-BR': 'O que te atrai, e como você se aproxima do que quer.',
      'en-US': 'What draws you, and how you move toward what you want.',
      'es-ES': 'Lo que te atrae, y como te acercas a lo que quieres.',
      'it-IT': 'Cio che ti attrae, e come ti avvicini a cio che vuoi.',
    },
    blocos: [
      {
        tipo: 'figura',
        chave: 'retrato-do-planeta',
        foco: 'venus',
        descricao: {
          'pt-BR': 'um disco creme com faixas de nuvem atravessando',
          'en-US': 'a cream disc with cloud bands crossing it',
          'es-ES': 'un disco crema con franjas de nube cruzandolo',
          'it-IT': 'un disco crema con fasce di nuvola che lo attraversano',
        },
      },
      {
        tipo: 'paragrafo',
        texto: {
          'pt-BR': 'Vênus é o gosto e o vínculo: o que você acha bonito, o que considera que vale, como se aproxima de alguém. Vale para afeto e vale para dinheiro — nos dois casos a pergunta é a mesma: o que, para você, merece ser tido por perto.',
          'en-US': 'Venus is taste and bond: what you find beautiful, what you count as worth, how you approach someone. It holds for affection and for money — in both the question is the same: what, to you, deserves being kept close.',
          'es-ES': 'Venus es el gusto y el vinculo: lo que te parece bello, lo que consideras que vale, como te acercas a alguien. Sirve para el afecto y para el dinero: en ambos la pregunta es la misma. Que, para ti, merece ser tenido cerca.',
          'it-IT': 'Venere e il gusto e il legame: cio che trovi bello, cio che consideri di valore, come ti avvicini a qualcuno. Vale per l affetto e per il denaro: in entrambi la domanda e la stessa. Cosa, per te, merita di essere tenuto vicino.',
        },
      },
      {
        tipo: 'destaque',
        texto: {
          'pt-BR': 'A força dela vem do brilho: é o objeto mais luminoso do céu depois do Sol e da Lua, a estrela que aparece primeiro ao anoitecer. Atração não é um atributo que deram a Vênus — é como ela se comporta no céu.',
          'en-US': 'Its force comes from brightness: the most luminous object in the sky after the Sun and Moon, the star that shows up first at dusk. Attraction is not an attribute given to Venus — it is how it behaves in the sky.',
          'es-ES': 'Su fuerza viene del brillo: es el objeto mas luminoso del cielo despues del Sol y la Luna, la estrella que aparece primero al anochecer. La atraccion no es un atributo que le dieron a Venus: es como se comporta en el cielo.',
          'it-IT': 'La sua forza viene dalla luminosita: e l oggetto piu luminoso del cielo dopo il Sole e la Luna, la stella che compare per prima al tramonto. L attrazione non e un attributo dato a Venere: e come si comporta in cielo.',
        },
      },
    ],
    termos: [],
    verTambem: ['planeta-marte'],
    minutos: 1,
  },

  {
    id: 'planeta-marte',
    tipo: 'verbete',
    categoria: 'planeta',
    titulo: { 'pt-BR': 'Marte', 'en-US': 'Mars', 'es-ES': 'Marte', 'it-IT': 'Marte' },
    resumo: {
      'pt-BR': 'Como você age, briga e sustenta o que quer.',
      'en-US': 'How you act, fight and hold on to what you want.',
      'es-ES': 'Como actuas, peleas y sostienes lo que quieres.',
      'it-IT': 'Come agisci, combatti e sostieni cio che vuoi.',
    },
    blocos: [
      {
        tipo: 'figura',
        chave: 'retrato-do-planeta',
        foco: 'marte',
        descricao: {
          'pt-BR': 'um disco vermelho com manchas escuras e uma calota branca no polo',
          'en-US': 'a red disc with dark patches and a white polar cap',
          'es-ES': 'un disco rojo con manchas oscuras y un casquete blanco en el polo',
          'it-IT': 'un disco rosso con macchie scure e una calotta bianca al polo',
        },
      },
      {
        tipo: 'paragrafo',
        texto: {
          'pt-BR': 'Marte é a força aplicada: a iniciativa, a coragem, a raiva, o modo como você defende um limite. Vênus diz o que você quer; Marte diz o que você faz para ter.',
          'en-US': 'Mars is applied force: initiative, courage, anger, the way you defend a boundary. Venus says what you want; Mars says what you do to get it.',
          'es-ES': 'Marte es la fuerza aplicada: la iniciativa, el coraje, la rabia, el modo en que defiendes un limite. Venus dice que quieres; Marte dice que haces para tenerlo.',
          'it-IT': 'Marte e la forza applicata: l iniziativa, il coraggio, la rabbia, il modo in cui difendi un confine. Venere dice cosa vuoi; Marte dice cosa fai per averlo.',
        },
      },
      {
        tipo: 'destaque',
        texto: {
          'pt-BR': 'A força dele vem da cor: Marte é visivelmente vermelho a olho nu, e foi assim em todas as culturas que olharam. Nenhuma precisou combinar com a outra para associá-lo a sangue, guerra e urgência.',
          'en-US': 'Its force comes from colour: Mars is visibly red to the naked eye, and was so for every culture that looked. None needed to agree with another to tie it to blood, war and urgency.',
          'es-ES': 'Su fuerza viene del color: Marte es visiblemente rojo a simple vista, y lo fue para todas las culturas que miraron. Ninguna necesito ponerse de acuerdo con otra para asociarlo a sangre, guerra y urgencia.',
          'it-IT': 'La sua forza viene dal colore: Marte e visibilmente rosso a occhio nudo, e lo e stato per ogni cultura che ha guardato. Nessuna ha dovuto accordarsi con un altra per legarlo a sangue, guerra e urgenza.',
        },
      },
    ],
    termos: [],
    verTambem: ['planeta-venus', 'planeta-saturno'],
    minutos: 1,
  },

  {
    id: 'planeta-jupiter',
    tipo: 'verbete',
    categoria: 'planeta',
    titulo: { 'pt-BR': 'Júpiter', 'en-US': 'Jupiter', 'es-ES': 'Jupiter', 'it-IT': 'Giove' },
    resumo: {
      'pt-BR': 'Onde você cresce, confia e às vezes exagera.',
      'en-US': 'Where you grow, trust and sometimes overdo it.',
      'es-ES': 'Donde creces, confias y a veces exageras.',
      'it-IT': 'Dove cresci, ti fidi e a volte esageri.',
    },
    blocos: [
      {
        tipo: 'figura',
        chave: 'retrato-do-planeta',
        foco: 'jupiter',
        descricao: {
          'pt-BR': 'um disco grande com faixas horizontais de cor e a grande mancha vermelha',
          'en-US': 'a large disc with horizontal colour bands and the great red spot',
          'es-ES': 'un disco grande con franjas horizontales de color y la gran mancha roja',
          'it-IT': 'un disco grande con fasce orizzontali di colore e la grande macchia rossa',
        },
      },
      {
        tipo: 'paragrafo',
        texto: {
          'pt-BR': 'Júpiter é expansão: sentido, fé, estudo, viagem longa, a aposta que se faz porque se acredita. É também o lugar onde falta medida — crescer sem critério é o mesmo movimento, só que sem freio.',
          'en-US': 'Jupiter is expansion: meaning, faith, study, the long journey, the bet made out of belief. It is also where measure runs short — growing without criteria is the same motion, just with no brake.',
          'es-ES': 'Jupiter es expansion: sentido, fe, estudio, viaje largo, la apuesta que se hace porque se cree. Es tambien el lugar donde falta medida: crecer sin criterio es el mismo movimiento, solo que sin freno.',
          'it-IT': 'Giove e espansione: senso, fede, studio, viaggio lungo, la scommessa fatta perche ci si crede. E anche il luogo dove manca la misura: crescere senza criterio e lo stesso movimento, solo senza freno.',
        },
      },
      {
        tipo: 'destaque',
        texto: {
          'pt-BR': 'A força dele vem do tamanho: Júpiter é maior que todos os outros planetas somados, e sua gravidade desvia cometas que viriam na nossa direção. Proteção e excesso são a mesma massa, lida de dois jeitos.',
          'en-US': 'Its force comes from size: Jupiter is larger than all the other planets combined, and its gravity deflects comets that would come our way. Protection and excess are the same mass, read two ways.',
          'es-ES': 'Su fuerza viene del tamano: Jupiter es mayor que todos los demas planetas juntos, y su gravedad desvia cometas que vendrian hacia nosotros. Proteccion y exceso son la misma masa, leida de dos modos.',
          'it-IT': 'La sua forza viene dalla dimensione: Giove e piu grande di tutti gli altri pianeti messi insieme, e la sua gravita devia comete che verrebbero verso di noi. Protezione ed eccesso sono la stessa massa, letta in due modi.',
        },
      },
      {
        tipo: 'figura',
        chave: 'tamanho-de-jupiter',
        descricao: {
          'pt-BR': 'O disco de Jupiter ao lado dos demais planetas, todos em escala real de diametro. Os sete juntos nao alcancam o tamanho dele.',
          'en-US': 'The disc of Jupiter beside the other planets, all at true diameter scale. The seven together do not match its size.',
          'es-ES': 'El disco de Jupiter junto a los demas planetas, todos a escala real de diametro. Los siete juntos no alcanzan su tamano.',
          'it-IT': 'Il disco di Giove accanto agli altri pianeti, tutti in scala reale di diametro. I sette insieme non raggiungono la sua dimensione.',
        },
      },
    ],
    termos: [],
    verTambem: ['planeta-saturno'],
    minutos: 1,
  },

  {
    id: 'planeta-saturno',
    tipo: 'verbete',
    categoria: 'planeta',
    titulo: { 'pt-BR': 'Saturno', 'en-US': 'Saturn', 'es-ES': 'Saturno', 'it-IT': 'Saturno' },
    resumo: {
      'pt-BR': 'O peso que cobra, e que por isso constrói.',
      'en-US': 'The weight that demands, and therefore builds.',
      'es-ES': 'El peso que exige, y que por eso construye.',
      'it-IT': 'Il peso che esige, e che per questo costruisce.',
    },
    blocos: [
      {
        tipo: 'figura',
        chave: 'retrato-do-planeta',
        foco: 'saturno',
        descricao: {
          'pt-BR': 'um disco cercado por aneis que passam por tras e por diante dele',
          'en-US': 'a disc circled by rings passing behind and in front of it',
          'es-ES': 'un disco rodeado por anillos que pasan por detras y por delante',
          'it-IT': 'un disco circondato da anelli che passano dietro e davanti',
        },
      },
      {
        tipo: 'paragrafo',
        texto: {
          'pt-BR': 'Saturno é limite, tempo e responsabilidade: onde a vida cobra constância, onde o atalho não funciona, onde você amadurece por repetição. É o planeta mais mal-afamado da tradição e o que mais entrega a quem fica.',
          'en-US': 'Saturn is limit, time and responsibility: where life demands constancy, where the shortcut does not work, where you mature by repetition. It is the most ill-reputed planet in tradition and the one that gives most to whoever stays.',
          'es-ES': 'Saturno es limite, tiempo y responsabilidad: donde la vida exige constancia, donde el atajo no funciona, donde maduras por repeticion. Es el planeta de peor fama en la tradicion y el que mas entrega a quien se queda.',
          'it-IT': 'Saturno e limite, tempo e responsabilita: dove la vita esige costanza, dove la scorciatoia non funziona, dove maturi per ripetizione. E il pianeta di peggior fama nella tradizione e quello che da di piu a chi resta.',
        },
      },
      {
        tipo: 'destaque',
        texto: {
          'pt-BR': 'A força dele vem da lentidão: até a descoberta de Urano, Saturno era o último planeta visível — a borda do mundo conhecido. Leva 29 anos para dar uma volta, que é por que seu retorno coincide com a saída da juventude.',
          'en-US': 'Its force comes from slowness: until Uranus was found, Saturn was the last visible planet — the edge of the known world. It takes 29 years for one lap, which is why its return coincides with leaving youth behind.',
          'es-ES': 'Su fuerza viene de la lentitud: hasta el descubrimiento de Urano, Saturno era el ultimo planeta visible, el borde del mundo conocido. Tarda 29 anos en dar una vuelta, y por eso su retorno coincide con la salida de la juventud.',
          'it-IT': 'La sua forza viene dalla lentezza: fino alla scoperta di Urano, Saturno era l ultimo pianeta visibile, il bordo del mondo conosciuto. Impiega 29 anni per un giro, ed e per questo che il suo ritorno coincide con l uscita dalla giovinezza.',
        },
      },
      {
        tipo: 'exemplo',
        texto: {
          'pt-BR': 'É o planeta da lição 2: a mesma passagem lida como cobrança vira cansaço; lida como gravidade, vira estrutura. Saturno é o caso mais claro de um astro que só é cruel para quem o trata como sentença.',
          'en-US': 'It is the planet from lesson 2: the same passage read as a demand becomes exhaustion; read as gravity, it becomes structure. Saturn is the clearest case of a body that is only cruel to whoever treats it as a verdict.',
          'es-ES': 'Es el planeta de la leccion 2: el mismo paso leido como exigencia se vuelve cansancio; leido como gravedad, se vuelve estructura. Saturno es el caso mas claro de un astro que solo es cruel con quien lo trata como sentencia.',
          'it-IT': 'E il pianeta della lezione 2: lo stesso passaggio letto come pretesa diventa stanchezza; letto come gravita, diventa struttura. Saturno e il caso piu chiaro di un astro crudele solo con chi lo tratta come sentenza.',
        },
      },
      {
        tipo: 'figura',
        chave: 'volta-de-saturno',
        descricao: {
          'pt-BR': 'Um circulo que representa uma volta completa de Saturno, marcada em 29 anos, com as idades intermediarias assinaladas ao longo do percurso.',
          'en-US': 'A circle standing for one full lap of Saturn, marked as 29 years, with the intermediate ages flagged along the way.',
          'es-ES': 'Un circulo que representa una vuelta completa de Saturno, marcada en 29 anos, con las edades intermedias senaladas a lo largo del recorrido.',
          'it-IT': 'Un cerchio che rappresenta un giro completo di Saturno, segnato in 29 anni, con le eta intermedie indicate lungo il percorso.',
        },
      },
    ],
    termos: [],
    verTambem: ['licao-02-gravidade-nao-destino', 'planeta-jupiter'],
    minutos: 2,
  },

  {
    id: 'planeta-urano',
    tipo: 'verbete',
    categoria: 'planeta',
    titulo: { 'pt-BR': 'Urano', 'en-US': 'Uranus', 'es-ES': 'Urano', 'it-IT': 'Urano' },
    resumo: {
      'pt-BR': 'A ruptura que liberta — e o planeta achado junto com a eletricidade.',
      'en-US': 'The rupture that frees — and the planet found alongside electricity.',
      'es-ES': 'La ruptura que libera, y el planeta hallado junto con la electricidad.',
      'it-IT': 'La rottura che libera, e il pianeta trovato insieme all elettricita.',
    },
    blocos: [
      {
        tipo: 'figura',
        chave: 'retrato-do-planeta',
        foco: 'urano',
        descricao: {
          'pt-BR': 'um disco azul-esverdeado com os aneis de pe, na vertical, porque o planeta gira deitado',
          'en-US': 'a blue-green disc with the rings standing upright, because the planet spins on its side',
          'es-ES': 'un disco azul verdoso con los anillos de pie, en vertical, porque el planeta gira tumbado',
          'it-IT': 'un disco verde-azzurro con gli anelli in piedi, verticali, perche il pianeta ruota coricato',
        },
      },
      {
        tipo: 'paragrafo',
        texto: {
          'pt-BR': 'Urano é o corte súbito: o que quebra o padrão, a independência, a ideia que chega pronta e desorganiza tudo. Onde ele está no mapa, a vida não evolui por degraus — ela dá saltos.',
          'en-US': 'Uranus is the sudden cut: what breaks the pattern, independence, the idea that arrives whole and disorganises everything. Where it sits in a chart, life does not evolve by steps — it jumps.',
          'es-ES': 'Urano es el corte subito: lo que rompe el patron, la independencia, la idea que llega entera y desordena todo. Donde esta en la carta, la vida no evoluciona por escalones: da saltos.',
          'it-IT': 'Urano e il taglio improvviso: cio che rompe lo schema, l indipendenza, l idea che arriva gia intera e scompiglia tutto. Dove si trova nella carta, la vita non evolve a gradini: fa salti.',
        },
      },
      {
        tipo: 'sincronicidade',
        ano: 1781,
        descoberta: {
          'pt-BR': 'William Herschel identifica Urano — o primeiro planeta encontrado com telescópio, e o primeiro acrescentado a um céu que tinha sete corpos desde a Antiguidade.',
          'en-US': 'William Herschel identifies Uranus — the first planet found with a telescope, and the first added to a sky that had held seven bodies since antiquity.',
          'es-ES': 'William Herschel identifica Urano: el primer planeta hallado con telescopio, y el primero anadido a un cielo que tenia siete cuerpos desde la Antiguedad.',
          'it-IT': 'William Herschel identifica Urano: il primo pianeta trovato col telescopio, e il primo aggiunto a un cielo che aveva sette corpi fin dall antichita.',
        },
        noMundo: {
          'pt-BR': 'A década é a das rupturas: a Revolução Americana em 1776, a Francesa em 1789. Em 1791 Galvani publica sobre a eletricidade animal, e dez anos depois Volta apresenta a primeira pilha.',
          'en-US': 'The decade is one of ruptures: the American Revolution in 1776, the French in 1789. In 1791 Galvani publishes on animal electricity, and ten years later Volta presents the first battery.',
          'es-ES': 'La decada es la de las rupturas: la Revolucion Americana en 1776, la Francesa en 1789. En 1791 Galvani publica sobre la electricidad animal, y diez anos despues Volta presenta la primera pila.',
          'it-IT': 'Il decennio e quello delle rotture: la Rivoluzione Americana nel 1776, la Francese nel 1789. Nel 1791 Galvani pubblica sull elettricita animale, e dieci anni dopo Volta presenta la prima pila.',
        },
        leitura: {
          'pt-BR': 'A tradição lê a coincidência assim: o planeta que desmontou o céu fechado apareceu quando a humanidade desmontava monarquias e domava a eletricidade. Urano passou a significar o que irrompe de fora e não cabe no sistema antigo.',
          'en-US': 'Tradition reads the coincidence this way: the planet that took apart a closed sky showed up as humanity was taking apart monarchies and taming electricity. Uranus came to mean what breaks in from outside and does not fit the old system.',
          'es-ES': 'La tradicion lee la coincidencia asi: el planeta que desarmo el cielo cerrado aparecio cuando la humanidad desarmaba monarquias y domaba la electricidad. Urano paso a significar lo que irrumpe desde fuera y no cabe en el sistema antiguo.',
          'it-IT': 'La tradizione legge la coincidenza cosi: il pianeta che ha smontato un cielo chiuso e comparso mentre l umanita smontava monarchie e domava l elettricita. Urano e arrivato a significare cio che irrompe da fuori e non entra nel sistema antico.',
        },
      },
      {
        tipo: 'cuidado',
        texto: {
          'pt-BR': 'Coincidência de datas não é causa. O que esse encontro mostra é como um significado astrológico NASCE — no espírito do tempo em que o astro foi visto — e não que o planeta tenha provocado nada daquilo.',
          'en-US': 'A coincidence of dates is not a cause. What this meeting shows is how an astrological meaning IS BORN — in the spirit of the time when the body was seen — not that the planet caused any of it.',
          'es-ES': 'Una coincidencia de fechas no es una causa. Lo que este encuentro muestra es como NACE un significado astrologico, en el espiritu del tiempo en que el astro fue visto, y no que el planeta haya provocado nada de aquello.',
          'it-IT': 'Una coincidenza di date non e una causa. Cio che questo incontro mostra e come NASCE un significato astrologico, nello spirito del tempo in cui l astro e stato visto, e non che il pianeta abbia provocato alcunche.',
        },
      },
      {
        tipo: 'figura',
        chave: 'linha-das-descobertas',
        descricao: {
          'pt-BR': 'Uma linha do tempo com tres marcos: 1781, 1846 e 1930. Acima dela, o planeta descoberto em cada data; abaixo, o que a humanidade descobria no mesmo periodo. Nada liga as duas faixas alem da data.',
          'en-US': 'A timeline with three marks: 1781, 1846 and 1930. Above it, the planet found on each date; below, what humanity was finding in the same period. Nothing links the two bands but the date.',
          'es-ES': 'Una linea del tiempo con tres hitos: 1781, 1846 y 1930. Encima, el planeta descubierto en cada fecha; debajo, lo que la humanidad descubria en el mismo periodo. Nada une las dos franjas salvo la fecha.',
          'it-IT': 'Una linea del tempo con tre tappe: 1781, 1846 e 1930. Sopra, il pianeta scoperto in ciascuna data; sotto, cio che l umanita scopriva nello stesso periodo. Nulla lega le due fasce se non la data.',
        },
      },
    ],
    termos: [],
    verTambem: ['planeta-netuno', 'licao-01-ceu-observado'],
    minutos: 2,
  },

  {
    id: 'planeta-netuno',
    tipo: 'verbete',
    categoria: 'planeta',
    titulo: { 'pt-BR': 'Netuno', 'en-US': 'Neptune', 'es-ES': 'Neptuno', 'it-IT': 'Nettuno' },
    resumo: {
      'pt-BR': 'O que dissolve o contorno — achado no ano da anestesia.',
      'en-US': 'What dissolves the outline — found in the year of anaesthesia.',
      'es-ES': 'Lo que disuelve el contorno, hallado en el ano de la anestesia.',
      'it-IT': 'Cio che dissolve il contorno, trovato nell anno dell anestesia.',
    },
    blocos: [
      {
        tipo: 'figura',
        chave: 'retrato-do-planeta',
        foco: 'netuno',
        descricao: {
          'pt-BR': 'um disco azul profundo com uma faixa clara e uma mancha escura',
          'en-US': 'a deep blue disc with a light band and a dark spot',
          'es-ES': 'un disco azul profundo con una franja clara y una mancha oscura',
          'it-IT': 'un disco blu profondo con una fascia chiara e una macchia scura',
        },
      },
      {
        tipo: 'paragrafo',
        texto: {
          'pt-BR': 'Netuno apaga fronteiras: a imaginação, a compaixão, a arte, a fé — e também a confusão, a ilusão e a fuga. Onde ele toca, o contorno entre você e o resto fica menos nítido, para o bem e para o mal.',
          'en-US': 'Neptune erases borders: imagination, compassion, art, faith — and also confusion, illusion and escape. Where it touches, the outline between you and everything else grows less sharp, for better and for worse.',
          'es-ES': 'Neptuno borra fronteras: la imaginacion, la compasion, el arte, la fe, y tambien la confusion, la ilusion y la huida. Donde toca, el contorno entre tu y el resto se vuelve menos nitido, para bien y para mal.',
          'it-IT': 'Nettuno cancella confini: l immaginazione, la compassione, l arte, la fede, e anche la confusione, l illusione e la fuga. Dove tocca, il contorno tra te e il resto si fa meno netto, nel bene e nel male.',
        },
      },
      {
        tipo: 'sincronicidade',
        ano: 1846,
        descoberta: {
          'pt-BR': 'Netuno é achado de um jeito inédito: Le Verrier calcula onde ele deveria estar, a partir de desvios na órbita de Urano, e Galle aponta o telescópio e o encontra na primeira noite. Um planeta visto no papel antes do céu.',
          'en-US': 'Neptune is found in an unprecedented way: Le Verrier computes where it ought to be, from deviations in the orbit of Uranus, and Galle points the telescope and finds it on the first night. A planet seen on paper before the sky.',
          'es-ES': 'Neptuno es hallado de un modo inedito: Le Verrier calcula donde deberia estar, a partir de desvios en la orbita de Urano, y Galle apunta el telescopio y lo encuentra la primera noche. Un planeta visto en el papel antes que en el cielo.',
          'it-IT': 'Nettuno viene trovato in un modo inedito: Le Verrier calcola dove dovrebbe stare, dagli scarti nell orbita di Urano, e Galle punta il telescopio e lo trova la prima notte. Un pianeta visto sulla carta prima che in cielo.',
        },
        noMundo: {
          'pt-BR': 'No mesmo ano de 1846, William Morton demonstra publicamente a anestesia com éter em Boston. Pela primeira vez na história, era possível operar um corpo sem que a pessoa sentisse — a dor deixou de ser inevitável.',
          'en-US': 'In that same year of 1846, William Morton publicly demonstrates ether anaesthesia in Boston. For the first time in history, a body could be operated on without the person feeling it — pain stopped being inevitable.',
          'es-ES': 'En ese mismo ano de 1846, William Morton demuestra publicamente la anestesia con eter en Boston. Por primera vez en la historia se podia operar un cuerpo sin que la persona sintiera: el dolor dejo de ser inevitable.',
          'it-IT': 'Nello stesso 1846, William Morton dimostra pubblicamente l anestesia con etere a Boston. Per la prima volta nella storia si poteva operare un corpo senza che la persona sentisse: il dolore smise di essere inevitabile.',
        },
        leitura: {
          'pt-BR': 'A tradição vê aí a assinatura de Netuno: o planeta que primeiro existiu como cálculo abstrato chegou junto com a substância que suspende a consciência. Dissolver o limite entre estar e não estar presente virou o sentido dele.',
          'en-US': 'Tradition sees the Neptune signature there: the planet that first existed as abstract computation arrived alongside the substance that suspends consciousness. Dissolving the line between being and not being present became its meaning.',
          'es-ES': 'La tradicion ve ahi la firma de Neptuno: el planeta que primero existio como calculo abstracto llego junto con la sustancia que suspende la conciencia. Disolver el limite entre estar y no estar presente paso a ser su sentido.',
          'it-IT': 'La tradizione vi legge la firma di Nettuno: il pianeta che prima e esistito come calcolo astratto e arrivato insieme alla sostanza che sospende la coscienza. Dissolvere il confine tra esserci e non esserci e diventato il suo senso.',
        },
      },
      {
        tipo: 'figura',
        chave: 'linha-das-descobertas',
        descricao: {
          'pt-BR': 'Uma linha do tempo com tres marcos: 1781, 1846 e 1930. Acima dela, o planeta descoberto em cada data; abaixo, o que a humanidade descobria no mesmo periodo. Nada liga as duas faixas alem da data.',
          'en-US': 'A timeline with three marks: 1781, 1846 and 1930. Above it, the planet found on each date; below, what humanity was finding in the same period. Nothing links the two bands but the date.',
          'es-ES': 'Una linea del tiempo con tres hitos: 1781, 1846 y 1930. Encima, el planeta descubierto en cada fecha; debajo, lo que la humanidad descubria en el mismo periodo. Nada une las dos franjas salvo la fecha.',
          'it-IT': 'Una linea del tempo con tre tappe: 1781, 1846 e 1930. Sopra, il pianeta scoperto in ciascuna data; sotto, cio che l umanita scopriva nello stesso periodo. Nulla lega le due fasce se non la data.',
        },
      },
    ],
    termos: [],
    verTambem: ['planeta-plutao', 'planeta-urano'],
    minutos: 2,
  },

  {
    id: 'planeta-plutao',
    tipo: 'verbete',
    categoria: 'planeta',
    titulo: { 'pt-BR': 'Plutão', 'en-US': 'Pluto', 'es-ES': 'Pluton', 'it-IT': 'Plutone' },
    resumo: {
      'pt-BR': 'O que morre para que algo nasça — achado às vésperas da era atômica.',
      'en-US': 'What dies so something can be born — found on the eve of the atomic age.',
      'es-ES': 'Lo que muere para que algo nazca, hallado en visperas de la era atomica.',
      'it-IT': 'Cio che muore perche qualcosa nasca, trovato alla vigilia dell era atomica.',
    },
    blocos: [
      {
        tipo: 'figura',
        chave: 'retrato-do-planeta',
        foco: 'plutao',
        descricao: {
          'pt-BR': 'um disco pequeno e palido, bem menor que os outros',
          'en-US': 'a small pale disc, much smaller than the others',
          'es-ES': 'un disco pequeno y palido, bastante menor que los otros',
          'it-IT': 'un disco piccolo e pallido, molto piu piccolo degli altri',
        },
      },
      {
        tipo: 'paragrafo',
        texto: {
          'pt-BR': 'Plutão é transformação sem volta: o que termina de vez, o poder, o que estava enterrado e vem à tona. Não negocia e não devolve o que levou — mas o que fica depois dele é mais verdadeiro do que era antes.',
          'en-US': 'Pluto is transformation with no return: what ends for good, power, what was buried and surfaces. It does not negotiate and does not give back what it took — but what remains after it is truer than what was there before.',
          'es-ES': 'Pluton es transformacion sin vuelta: lo que termina del todo, el poder, lo que estaba enterrado y sale a la superficie. No negocia ni devuelve lo que se llevo, pero lo que queda despues de el es mas verdadero que antes.',
          'it-IT': 'Plutone e trasformazione senza ritorno: cio che finisce del tutto, il potere, cio che era sepolto e viene a galla. Non negozia e non restituisce cio che ha preso, ma cio che resta dopo di lui e piu vero di prima.',
        },
      },
      {
        tipo: 'sincronicidade',
        ano: 1930,
        descoberta: {
          'pt-BR': 'Clyde Tombaugh encontra Plutão comparando fotografias do mesmo trecho de céu tiradas em noites diferentes, à procura do único ponto que tivesse se movido.',
          'en-US': 'Clyde Tombaugh finds Pluto by comparing photographs of the same patch of sky taken on different nights, hunting for the single point that had moved.',
          'es-ES': 'Clyde Tombaugh encuentra Pluton comparando fotografias del mismo trozo de cielo tomadas en noches distintas, buscando el unico punto que se hubiera movido.',
          'it-IT': 'Clyde Tombaugh trova Plutone confrontando fotografie della stessa porzione di cielo prese in notti diverse, cercando l unico punto che si fosse mosso.',
        },
        noMundo: {
          'pt-BR': 'Oito anos depois, Hahn e Strassmann demonstram a fissão nuclear; em 1945 a primeira bomba atômica é usada. É também o período em que a psicanálise se difunde e o mundo descobre o poder das massas e da propaganda.',
          'en-US': 'Eight years later, Hahn and Strassmann demonstrate nuclear fission; in 1945 the first atomic bomb is used. It is also the period when psychoanalysis spreads and the world discovers the power of crowds and propaganda.',
          'es-ES': 'Ocho anos despues, Hahn y Strassmann demuestran la fision nuclear; en 1945 se usa la primera bomba atomica. Es tambien el periodo en que el psicoanalisis se difunde y el mundo descubre el poder de las masas y la propaganda.',
          'it-IT': 'Otto anni dopo, Hahn e Strassmann dimostrano la fissione nucleare; nel 1945 viene usata la prima bomba atomica. E anche il periodo in cui la psicoanalisi si diffonde e il mondo scopre il potere delle masse e della propaganda.',
        },
        leitura: {
          'pt-BR': 'A tradição junta as duas pontas: o planeta mais distante e mais escuro foi visto quando a humanidade aprendia a partir o átomo e a olhar para o próprio inconsciente. Nos dois casos, a força estava no que era pequeno, invisível e enterrado.',
          'en-US': 'Tradition joins the two ends: the most distant and darkest planet was seen as humanity was learning to split the atom and to look into its own unconscious. In both, the force lay in what was small, invisible and buried.',
          'es-ES': 'La tradicion une las dos puntas: el planeta mas distante y mas oscuro fue visto cuando la humanidad aprendia a partir el atomo y a mirar su propio inconsciente. En ambos casos, la fuerza estaba en lo pequeno, invisible y enterrado.',
          'it-IT': 'La tradizione unisce i due capi: il pianeta piu lontano e piu scuro e stato visto mentre l umanita imparava a spezzare l atomo e a guardare il proprio inconscio. In entrambi i casi, la forza stava in cio che era piccolo, invisibile e sepolto.',
        },
      },
      {
        tipo: 'cuidado',
        texto: {
          'pt-BR': 'Plutão deixou de ser classificado como planeta pela astronomia em 2006. A astrologia continua a usá-lo porque o que ela mede não é o tamanho do corpo, e sim o ciclo — e o ciclo de Plutão não mudou com a reclassificação.',
          'en-US': 'Pluto stopped being classified as a planet by astronomy in 2006. Astrology still uses it because what it measures is not the size of the body but the cycle — and the cycle of Pluto did not change with the reclassification.',
          'es-ES': 'Pluton dejo de ser clasificado como planeta por la astronomia en 2006. La astrologia sigue usandolo porque lo que mide no es el tamano del cuerpo sino el ciclo, y el ciclo de Pluton no cambio con la reclasificacion.',
          'it-IT': 'Plutone ha smesso di essere classificato come pianeta dall astronomia nel 2006. L astrologia continua a usarlo perche cio che misura non e la dimensione del corpo ma il ciclo, e il ciclo di Plutone non e cambiato con la riclassificazione.',
        },
      },
      {
        tipo: 'figura',
        chave: 'linha-das-descobertas',
        descricao: {
          'pt-BR': 'Uma linha do tempo com tres marcos: 1781, 1846 e 1930. Acima dela, o planeta descoberto em cada data; abaixo, o que a humanidade descobria no mesmo periodo. Nada liga as duas faixas alem da data.',
          'en-US': 'A timeline with three marks: 1781, 1846 and 1930. Above it, the planet found on each date; below, what humanity was finding in the same period. Nothing links the two bands but the date.',
          'es-ES': 'Una linea del tiempo con tres hitos: 1781, 1846 y 1930. Encima, el planeta descubierto en cada fecha; debajo, lo que la humanidad descubria en el mismo periodo. Nada une las dos franjas salvo la fecha.',
          'it-IT': 'Una linea del tempo con tre tappe: 1781, 1846 e 1930. Sopra, il pianeta scoperto in ciascuna data; sotto, cio che l umanita scopriva nello stesso periodo. Nulla lega le due fasce se non la data.',
        },
      },
    ],
    termos: [],
    verTambem: ['planeta-netuno', 'licao-03-quem-atravessa'],
    minutos: 2,
  },
]
