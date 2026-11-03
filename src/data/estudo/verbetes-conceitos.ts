import type { Unidade } from './tipos'

/**
 * Os conceitos transversais — o que não é planeta, signo, casa nem aspecto.
 *
 * ⚠️ A BIBLIOTECA CRESCE UM VERBETE POR VEZ. Cada um já é útil sozinho, então
 * nada aqui bloqueia a entrega: a tela funciona com um verbete e funciona com
 * cinquenta.
 */
export const VERBETES_CONCEITOS: Unidade[] = [
  {
    id: 'conceito-aspecto',
    tipo: 'verbete',
    categoria: 'conceito',
    titulo: {
      'pt-BR': 'Aspecto',
      'en-US': 'Aspect',
      'es-ES': 'Aspecto',
      'it-IT': 'Aspetto',
    },
    resumo: {
      'pt-BR': 'O angulo entre dois planetas — e o angulo e que diz como eles se falam.',
      'en-US': 'The angle between two planets — and the angle is what says how they talk.',
      'es-ES': 'El angulo entre dos planetas, y el angulo es el que dice como se hablan.',
      'it-IT': 'L angolo tra due pianeti, e l angolo e cio che dice come si parlano.',
    },
    blocos: [
      {
        tipo: 'paragrafo',
        texto: {
          'pt-BR': 'Aspecto e a distancia angular entre dois pontos do mapa. Dois planetas sempre estao a algum angulo um do outro; a tradicao so da nome a alguns, por dividirem o circulo de 360 graus em partes inteiras.',
          'en-US': 'An aspect is the angular distance between two points in a chart. Two planets always sit at some angle to each other; tradition only names a few, the ones that divide the 360-degree circle into whole parts.',
          'es-ES': 'Aspecto es la distancia angular entre dos puntos de la carta. Dos planetas siempre estan a algun angulo uno del otro; la tradicion solo nombra algunos, los que dividen el circulo de 360 grados en partes enteras.',
          'it-IT': 'Aspetto e la distanza angolare tra due punti della carta. Due pianeti stanno sempre a un qualche angolo l uno dall altro; la tradizione ne nomina solo alcuni, quelli che dividono il cerchio di 360 gradi in parti intere.',
        },
      },
      {
        tipo: 'figura',
        chave: 'angulos-dos-aspectos',
        descricao: {
          'pt-BR': 'Um circulo com um ponto de origem e linhas saindo dele nos angulos de 60, 90, 120 e 180 graus, cada um com seu nome. Os que fluem aparecem numa cor e os que atritam em outra.',
          'en-US': 'A circle with an origin point and lines leaving it at 60, 90, 120 and 180 degrees, each named. The flowing ones appear in one colour and the grinding ones in another.',
          'es-ES': 'Un circulo con un punto de origen y lineas que salen de el a 60, 90, 120 y 180 grados, cada una con su nombre. Los que fluyen aparecen en un color y los que rozan en otro.',
          'it-IT': 'Un cerchio con un punto di origine e linee che ne escono a 60, 90, 120 e 180 gradi, ognuna col suo nome. Quelli che scorrono appaiono in un colore e quelli che attritano in un altro.',
        },
      },
      {
        tipo: 'destaque',
        texto: {
          'pt-BR': 'Angulo macio nao e bom nem angulo duro e ruim. O macio entrega sem pedir nada, e por isso costuma passar despercebido; o duro cobra, e e por isso que move.',
          'en-US': 'A soft angle is not good, nor is a hard one bad. The soft one gives without asking, which is why it tends to go unnoticed; the hard one demands, and that is why it moves things.',
          'es-ES': 'Angulo suave no es bueno ni angulo duro es malo. El suave entrega sin pedir nada, y por eso suele pasar desapercibido; el duro exige, y por eso mueve.',
          'it-IT': 'Angolo morbido non e buono ne angolo duro e cattivo. Il morbido da senza chiedere nulla, e per questo tende a passare inosservato; il duro esige, ed e per questo che muove.',
        },
      },
      {
        tipo: 'cuidado',
        texto: {
          'pt-BR': 'O angulo quase nunca e exato — a folga aceita chama-se orbe, e quanto menor ela for, mais o encontro pesa na leitura.',
          'en-US': 'The angle is almost never exact — the accepted slack is called the orb, and the smaller it is, the more the meeting weighs in the reading.',
          'es-ES': 'El angulo casi nunca es exacto: la holgura aceptada se llama orbe, y cuanto menor sea, mas pesa el encuentro en la lectura.',
          'it-IT': 'L angolo non e quasi mai esatto: la tolleranza accettata si chiama orbe, e piu e stretta, piu l incontro pesa nella lettura.',
        },
      },
    ],
    termos: [],
    verTambem: ['conceito-orbe'],
    minutos: 2,
  },

  {
    id: 'conceito-orbe',
    tipo: 'verbete',
    categoria: 'conceito',
    titulo: {
      'pt-BR': 'Orbe',
      'en-US': 'Orb',
      'es-ES': 'Orbe',
      'it-IT': 'Orbe',
    },
    resumo: {
      'pt-BR': 'A distância que ainda conta como encontro entre dois planetas.',
      'en-US': 'The distance that still counts as a meeting between two planets.',
      'es-ES': 'La distancia que todavia cuenta como encuentro entre dos planetas.',
      'it-IT': 'La distanza che conta ancora come incontro tra due pianeti.',
    },
    blocos: [
      {
        tipo: 'paragrafo',
        texto: {
          'pt-BR': 'Dois planetas quase nunca estão no ângulo exato. A orbe é a folga que a tradição aceita em volta do ângulo perfeito: quanto mais perto do exato, mais o encontro pesa na leitura.',
          'en-US': 'Two planets are almost never at the exact angle. The orb is the slack tradition accepts around the perfect angle: the closer to exact, the more the meeting weighs in the reading.',
          'es-ES': 'Dos planetas casi nunca estan en el angulo exacto. El orbe es la holgura que la tradicion acepta alrededor del angulo perfecto: cuanto mas cerca del exacto, mas pesa el encuentro en la lectura.',
          'it-IT': 'Due pianeti non sono quasi mai all angolo esatto. L orbe e la tolleranza che la tradizione accetta intorno all angolo perfetto: piu e vicino all esatto, piu l incontro pesa nella lettura.',
        },
      },
      {
        tipo: 'paragrafo',
        texto: {
          'pt-BR': 'É por isso que o app mostra um número de graus ao lado de cada aspecto. Zero grau é o encontro cheio; cinco ou seis graus é um encontro de fundo, que existe mas não domina o dia.',
          'en-US': 'That is why the app shows a degree figure next to each aspect. Zero degrees is the full meeting; five or six degrees is a background meeting, present but not ruling the day.',
          'es-ES': 'Por eso la app muestra un numero de grados junto a cada aspecto. Cero grados es el encuentro pleno; cinco o seis grados es un encuentro de fondo, que existe pero no domina el dia.',
          'it-IT': 'Per questo l app mostra un numero di gradi accanto a ogni aspetto. Zero gradi e l incontro pieno; cinque o sei gradi e un incontro di sfondo, presente ma che non domina la giornata.',
        },
      },
      {
        tipo: 'destaque',
        texto: {
          'pt-BR': 'Orbe pequena, efeito nítido. Orbe larga, efeito de fundo.',
          'en-US': 'Small orb, sharp effect. Wide orb, background effect.',
          'es-ES': 'Orbe pequeno, efecto nitido. Orbe amplio, efecto de fondo.',
          'it-IT': 'Orbe stretto, effetto netto. Orbe ampio, effetto di sfondo.',
        },
      },
    ],
    termos: ['orbe'],
    verTambem: [],
    minutos: 1,
  },
]
