import type { Unidade } from './tipos'

/**
 * ATO 3 — O TEMPO.
 *
 * ⚠️ A LIÇÃO 9 É A MAIS IMPORTANTE DO CURSO PARA O USO DIÁRIO. Ela separa o
 * que a pessoa É (natal, não muda nunca) do que está ACONTECENDO (trânsito,
 * passa). Sem essa distinção, todo número da Home lê como julgamento
 * permanente — "minha carreira é 18" em vez de "a carreira está apertada esta
 * semana". É a diferença entre um app que ajuda e um que condena.
 */
export const TRILHA_ATO3: Unidade[] = [
  {
    id: 'licao-09-transito',
    tipo: 'licao',
    ato: 3,
    ordem: 9,
    titulo: {
      'pt-BR': 'Trânsito: o céu de hoje no mapa de sempre',
      'en-US': 'Transit: today sky on the chart that never changes',
      'es-ES': 'Transito: el cielo de hoy en la carta de siempre',
      'it-IT': 'Transito: il cielo di oggi sulla carta di sempre',
    },
    resumo: {
      'pt-BR': 'O que você é não muda. O que está acontecendo passa. São duas coisas.',
      'en-US': 'What you are does not change. What is happening passes. They are two things.',
      'es-ES': 'Lo que eres no cambia. Lo que esta pasando pasa. Son dos cosas.',
      'it-IT': 'Cio che sei non cambia. Cio che accade passa. Sono due cose.',
    },
    blocos: [
      {
        tipo: 'paragrafo',
        texto: {
          'pt-BR': 'Seu mapa natal é a fotografia de um instante que não volta: o céu no minuto em que você chegou. Ele não muda nunca. Mas os planetas continuam andando — e o céu de hoje passa por cima daquela fotografia parada. Esse encontro é o trânsito.',
          'en-US': 'Your natal chart is the photograph of an instant that does not return: the sky at the minute you arrived. It never changes. But the planets keep moving — and today sky passes over that still photograph. That meeting is the transit.',
          'es-ES': 'Tu carta natal es la fotografia de un instante que no vuelve: el cielo en el minuto en que llegaste. No cambia nunca. Pero los planetas siguen andando, y el cielo de hoy pasa sobre esa fotografia quieta. Ese encuentro es el transito.',
          'it-IT': 'La tua carta natale e la fotografia di un istante che non torna: il cielo nel minuto in cui sei arrivato. Non cambia mai. Ma i pianeti continuano a muoversi, e il cielo di oggi passa sopra quella fotografia ferma. Quell incontro e il transito.',
        },
      },
      {
        tipo: 'figura',
        chave: 'natal-e-transito',
        descricao: {
          'pt-BR': 'Duas rodas concentricas. A de dentro, dourada e fixa, e o mapa natal com seus planetas parados. A de fora, tracejada, e o ceu de hoje, com uma seta mostrando que ela gira. Uma linha liga um ponto de fora a um de dentro: esse encontro e o transito.',
          'en-US': 'Two concentric wheels. The inner one, golden and fixed, is the natal chart with its planets still. The outer one, dashed, is today sky, with an arrow showing it turns. A line joins an outer point to an inner one: that meeting is the transit.',
          'es-ES': 'Dos ruedas concentricas. La de dentro, dorada y fija, es la carta natal con sus planetas quietos. La de fuera, punteada, es el cielo de hoy, con una flecha que muestra que gira. Una linea une un punto de fuera con uno de dentro: ese encuentro es el transito.',
          'it-IT': 'Due ruote concentriche. Quella interna, dorata e fissa, e la carta natale con i suoi pianeti fermi. Quella esterna, tratteggiata, e il cielo di oggi, con una freccia che mostra che ruota. Una linea unisce un punto esterno a uno interno: quell incontro e il transito.',
        },
      },
      {
        tipo: 'destaque',
        texto: {
          'pt-BR': 'O natal diz quem você é. O trânsito diz o que está acontecendo. Confundir os dois é ler um dia difícil como um defeito de caráter.',
          'en-US': 'The natal says who you are. The transit says what is happening. Confusing the two means reading a hard day as a character flaw.',
          'es-ES': 'La natal dice quien eres. El transito dice que esta pasando. Confundir los dos es leer un dia dificil como un defecto de caracter.',
          'it-IT': 'La natale dice chi sei. Il transito dice cosa sta accadendo. Confondere i due significa leggere una giornata difficile come un difetto di carattere.',
        },
      },
      {
        tipo: 'paragrafo',
        texto: {
          'pt-BR': 'É essa distinção que faz os números deste app significarem alguma coisa. Quando a tela mostra "Carreira 18", ela não está dizendo que a sua carreira é ruim — está dizendo que o céu desta semana não está ajudando essa área. Semana que vem o número é outro, com o mesmo mapa natal embaixo.',
          'en-US': 'This distinction is what makes the numbers in this app mean anything. When the screen shows "Career 18", it is not saying your career is bad — it is saying this week sky is not helping that area. Next week the number is different, with the same natal chart underneath.',
          'es-ES': 'Esta distincion es lo que hace que los numeros de esta app signifiquen algo. Cuando la pantalla muestra "Carrera 18", no dice que tu carrera sea mala: dice que el cielo de esta semana no esta ayudando a esa area. La semana que viene el numero es otro, con la misma carta natal debajo.',
          'it-IT': 'E questa distinzione a far si che i numeri di questa app significhino qualcosa. Quando lo schermo mostra "Carriera 18", non sta dicendo che la tua carriera e brutta: sta dicendo che il cielo di questa settimana non sta aiutando quell area. La settimana prossima il numero e un altro, con la stessa carta natale sotto.',
        },
      },
      {
        tipo: 'cuidado',
        texto: {
          'pt-BR': 'Trânsito tem prazo. Um trânsito da Lua dura horas; um de Marte, dias; um de Saturno, meses. Nenhum é permanente — e saber quanto dura é metade da leitura, porque muda o que fazer com ele.',
          'en-US': 'A transit has an expiry. A Moon transit lasts hours; a Mars one, days; a Saturn one, months. None is permanent — and knowing how long it lasts is half the reading, because it changes what to do with it.',
          'es-ES': 'El transito tiene plazo. Un transito de la Luna dura horas; uno de Marte, dias; uno de Saturno, meses. Ninguno es permanente, y saber cuanto dura es la mitad de la lectura, porque cambia que hacer con el.',
          'it-IT': 'Il transito ha una scadenza. Un transito della Luna dura ore; uno di Marte, giorni; uno di Saturno, mesi. Nessuno e permanente, e sapere quanto dura e meta della lettura, perche cambia cosa farne.',
        },
      },
    ],
    termos: ['transito', 'natal'],
    verTambem: ['licao-10-ciclos'],
    minutos: 2,
  },

  {
    id: 'licao-10-ciclos',
    tipo: 'licao',
    ato: 3,
    ordem: 10,
    titulo: {
      'pt-BR': 'Os ciclos que importam',
      'en-US': 'The cycles that matter',
      'es-ES': 'Los ciclos que importan',
      'it-IT': 'I cicli che contano',
    },
    resumo: {
      'pt-BR': 'Quanto dura cada volta decide o tamanho do que ela move numa vida.',
      'en-US': 'How long each lap takes decides the size of what it moves in a life.',
      'es-ES': 'Cuanto dura cada vuelta decide el tamano de lo que mueve en una vida.',
      'it-IT': 'Quanto dura ogni giro decide la dimensione di cio che muove in una vita.',
    },
    blocos: [
      {
        tipo: 'paragrafo',
        texto: {
          'pt-BR': 'Todo planeta volta ao lugar onde estava quando você nasceu. O tempo dessa volta é o que define o peso do ciclo: o que se repete toda semana mexe no humor, o que se repete uma ou duas vezes na vida mexe na biografia.',
          'en-US': 'Every planet returns to where it stood when you were born. The time of that lap defines the weight of the cycle: what repeats every week moves the mood, what repeats once or twice in a life moves the biography.',
          'es-ES': 'Todo planeta vuelve al lugar donde estaba cuando naciste. El tiempo de esa vuelta define el peso del ciclo: lo que se repite cada semana mueve el humor, lo que se repite una o dos veces en la vida mueve la biografia.',
          'it-IT': 'Ogni pianeta torna dove si trovava quando sei nato. Il tempo di quel giro definisce il peso del ciclo: cio che si ripete ogni settimana muove l umore, cio che si ripete una o due volte nella vita muove la biografia.',
        },
      },
      {
        tipo: 'figura',
        chave: 'duracao-dos-ciclos',
        descricao: {
          'pt-BR': 'Barras sobre uma regua de idade que vai do nascimento aos 84 anos. A Lua mal aparece, o Sol marca um ano, Jupiter doze, Saturno vinte e nove, e Urano ocupa a regua inteira.',
          'en-US': 'Bars over an age ruler running from birth to 84. The Moon barely shows, the Sun marks one year, Jupiter twelve, Saturn twenty-nine, and Uranus fills the whole ruler.',
          'es-ES': 'Barras sobre una regla de edad que va del nacimiento a los 84 anos. La Luna apenas aparece, el Sol marca un ano, Jupiter doce, Saturno veintinueve, y Urano ocupa la regla entera.',
          'it-IT': 'Barre su un righello di eta che va dalla nascita agli 84 anni. La Luna si vede appena, il Sole segna un anno, Giove dodici, Saturno ventinove, e Urano occupa l intero righello.',
        },
      },
      {
        tipo: 'paragrafo',
        texto: {
          'pt-BR': 'Os três que a tradição mais observa cabem numa vida e caem em idades reconhecíveis. O retorno de Saturno, perto dos 29 e de novo aos 58, costuma coincidir com a hora de assumir o próprio peso. A oposição de Urano, por volta dos 42, é o que o senso comum chama de crise da meia-idade. O retorno de Júpiter, a cada 12 anos, abre uma fase de crescimento.',
          'en-US': 'The three tradition watches most fit inside a life and land at recognisable ages. The Saturn return, near 29 and again at 58, tends to coincide with the hour of taking on your own weight. The Uranus opposition, around 42, is what common sense calls the midlife crisis. The Jupiter return, every 12 years, opens a phase of growth.',
          'es-ES': 'Los tres que la tradicion mas observa caben en una vida y caen en edades reconocibles. El retorno de Saturno, cerca de los 29 y de nuevo a los 58, suele coincidir con la hora de asumir el propio peso. La oposicion de Urano, hacia los 42, es lo que el sentido comun llama crisis de la mediana edad. El retorno de Jupiter, cada 12 anos, abre una fase de crecimiento.',
          'it-IT': 'I tre che la tradizione osserva di piu stanno dentro una vita e cadono a eta riconoscibili. Il ritorno di Saturno, verso i 29 e di nuovo a 58, tende a coincidere con l ora di assumere il proprio peso. L opposizione di Urano, intorno ai 42, e cio che il senso comune chiama crisi di mezza eta. Il ritorno di Giove, ogni 12 anni, apre una fase di crescita.',
        },
      },
      {
        tipo: 'destaque',
        texto: {
          'pt-BR': 'Ciclo curto muda o dia. Ciclo longo muda o capítulo. Saber qual dos dois está falando evita tratar uma semana ruim como uma virada de vida — e o contrário.',
          'en-US': 'A short cycle changes the day. A long one changes the chapter. Knowing which of the two is speaking keeps a bad week from being read as a turning point — and the reverse.',
          'es-ES': 'Ciclo corto cambia el dia. Ciclo largo cambia el capitulo. Saber cual de los dos habla evita tratar una mala semana como un giro de vida, y al reves.',
          'it-IT': 'Ciclo corto cambia la giornata. Ciclo lungo cambia il capitolo. Sapere quale dei due parla evita di trattare una brutta settimana come una svolta di vita, e viceversa.',
        },
      },
      {
        tipo: 'cuidado',
        texto: {
          'pt-BR': 'Retrógrado aparece muito nessas contas e assusta à toa: é um efeito de perspectiva, o planeta parecendo andar para trás visto da Terra. Nenhum planeta anda para trás de verdade. A tradição lê o período como tempo de revisar em vez de lançar.',
          'en-US': 'Retrograde shows up often in these counts and scares for nothing: it is a perspective effect, the planet appearing to move backwards seen from Earth. No planet actually moves backwards. Tradition reads the period as a time to revise rather than launch.',
          'es-ES': 'Retrogrado aparece mucho en estas cuentas y asusta en vano: es un efecto de perspectiva, el planeta pareciendo andar hacia atras visto desde la Tierra. Ningun planeta anda hacia atras de verdad. La tradicion lee el periodo como tiempo de revisar en vez de lanzar.',
          'it-IT': 'Retrogrado compare spesso in questi conti e spaventa a vuoto: e un effetto di prospettiva, il pianeta che sembra andare all indietro visto dalla Terra. Nessun pianeta va davvero all indietro. La tradizione legge il periodo come tempo per rivedere invece che lanciare.',
        },
      },
    ],
    termos: ['transito', 'retrogrado'],
    verTambem: ['licao-11-ordem-de-leitura', 'planeta-saturno'],
    minutos: 2,
  },
]
