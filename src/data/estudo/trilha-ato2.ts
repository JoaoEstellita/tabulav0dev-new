import type { Unidade } from './tipos'

/**
 * ATO 2 — O QUE LIGA.
 *
 * ⚠️ AQUI MORA A CONFUSÃO MAIS CARA DO INICIANTE: achar que aspecto tenso é
 * aspecto ruim. A tela deste app mostra quadratura o tempo todo; sem desfazer
 * esse engano, o app inteiro lê como ameaça. A lição 7 existe principalmente
 * para isso.
 */
export const TRILHA_ATO2: Unidade[] = [
  {
    id: 'licao-07-aspecto-conversa',
    tipo: 'licao',
    ato: 2,
    ordem: 7,
    titulo: {
      'pt-BR': 'O aspecto é a conversa entre dois planetas',
      'en-US': 'The aspect is the conversation between two planets',
      'es-ES': 'El aspecto es la conversacion entre dos planetas',
      'it-IT': 'L aspetto e la conversazione tra due pianeti',
    },
    resumo: {
      'pt-BR': 'O ângulo entre dois planetas decide se eles colaboram ou se atritam.',
      'en-US': 'The angle between two planets decides whether they cooperate or grind.',
      'es-ES': 'El angulo entre dos planetas decide si colaboran o si rozan.',
      'it-IT': 'L angolo tra due pianeti decide se collaborano o se attritano.',
    },
    blocos: [
      {
        tipo: 'paragrafo',
        texto: {
          'pt-BR': 'Até aqui cada planeta estava sozinho. Mas eles se falam, e o que decide o tom da conversa é o ângulo entre os dois. A tradição dá nome a cinco ângulos, os que dividem o círculo de 360 graus em partes inteiras: 0, 60, 90, 120 e 180.',
          'en-US': 'So far each planet stood alone. But they talk to each other, and what sets the tone is the angle between them. Tradition names five angles, the ones dividing the 360-degree circle into whole parts: 0, 60, 90, 120 and 180.',
          'es-ES': 'Hasta aqui cada planeta estaba solo. Pero se hablan, y lo que decide el tono es el angulo entre los dos. La tradicion nombra cinco angulos, los que dividen el circulo de 360 grados en partes enteras: 0, 60, 90, 120 y 180.',
          'it-IT': 'Fin qui ogni pianeta stava da solo. Ma si parlano, e cio che decide il tono e l angolo tra i due. La tradizione nomina cinque angoli, quelli che dividono il cerchio di 360 gradi in parti intere: 0, 60, 90, 120 e 180.',
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
        tipo: 'paragrafo',
        texto: {
          'pt-BR': 'Trígono e sextil são encaixes: os dois planetas querem a mesma coisa e se ajudam sem esforço. Quadratura e oposição são atritos: os dois querem coisas diferentes e cada um atrapalha o outro. A conjunção é o caso especial — colados no mesmo ponto, eles viram uma coisa só, e se isso é bom depende inteiramente de quais planetas são.',
          'en-US': 'Trine and sextile are fits: the two planets want the same thing and help each other effortlessly. Square and opposition are frictions: the two want different things and each gets in the other way. Conjunction is the special case — glued at the same point, they become one thing, and whether that is good depends entirely on which planets they are.',
          'es-ES': 'Trigono y sextil son encajes: los dos planetas quieren lo mismo y se ayudan sin esfuerzo. Cuadratura y oposicion son roces: los dos quieren cosas distintas y cada uno estorba al otro. La conjuncion es el caso especial: pegados en el mismo punto, se vuelven una sola cosa, y si eso es bueno depende enteramente de cuales planetas son.',
          'it-IT': 'Trigono e sestile sono incastri: i due pianeti vogliono la stessa cosa e si aiutano senza sforzo. Quadrato e opposizione sono attriti: i due vogliono cose diverse e ciascuno intralcia l altro. La congiunzione e il caso speciale: incollati nello stesso punto, diventano una cosa sola, e se questo sia un bene dipende interamente da quali pianeti siano.',
        },
      },
      {
        tipo: 'destaque',
        texto: {
          'pt-BR': 'O aspecto macio entrega sem pedir nada — e por isso costuma passar despercebido a vida inteira. O duro cobra, e é exatamente por cobrar que move.',
          'en-US': 'The soft aspect gives without asking — which is why it often goes unnoticed for a lifetime. The hard one demands, and it is precisely by demanding that it moves things.',
          'es-ES': 'El aspecto suave entrega sin pedir nada, y por eso suele pasar desapercibido toda la vida. El duro exige, y es precisamente por exigir que mueve.',
          'it-IT': 'L aspetto morbido da senza chiedere nulla, e per questo spesso passa inosservato per tutta la vita. Quello duro esige, ed e proprio esigendo che muove.',
        },
      },
      {
        tipo: 'exemplo',
        texto: {
          'pt-BR': 'Pense em Sol e Saturno em quadratura: algo em você quer brilhar e algo em você freia. Soa péssimo — e é a assinatura de quase todo mundo que construiu obra duradoura. O freio é o que transformou o brilho em trabalho feito, em vez de intenção.',
          'en-US': 'Think of Sun square Saturn: something in you wants to shine and something in you brakes. It sounds awful — and it is the signature of nearly everyone who built lasting work. The brake is what turned the shine into work done instead of intention.',
          'es-ES': 'Piensa en Sol en cuadratura con Saturno: algo en ti quiere brillar y algo en ti frena. Suena pesimo, y es la firma de casi todos los que construyeron obra duradera. El freno es lo que convirtio el brillo en trabajo hecho en vez de intencion.',
          'it-IT': 'Pensa al Sole in quadrato con Saturno: qualcosa in te vuole brillare e qualcosa in te frena. Suona pessimo, ed e la firma di quasi tutti quelli che hanno costruito un opera duratura. Il freno e cio che ha trasformato la luce in lavoro fatto invece che in intenzione.',
        },
      },
      {
        tipo: 'cuidado',
        texto: {
          'pt-BR': 'Tenso não é ruim, e macio não é bom. Esta é a confusão mais cara de quem começa: a tela deste app mostra quadratura o tempo todo, e lida como ameaça ela transforma qualquer leitura em susto. Atrito é onde a vida pede movimento — exatamente a gravidade da lição 2.',
          'en-US': 'Tense is not bad, and soft is not good. This is the costliest confusion for a beginner: this app shows squares constantly, and read as a threat they turn any reading into a scare. Friction is where life asks for movement — exactly the gravity of lesson 2.',
          'es-ES': 'Tenso no es malo, y suave no es bueno. Esta es la confusion mas cara de quien empieza: la pantalla de esta app muestra cuadraturas todo el tiempo, y leidas como amenaza convierten cualquier lectura en susto. El roce es donde la vida pide movimiento, exactamente la gravedad de la leccion 2.',
          'it-IT': 'Teso non e cattivo, e morbido non e buono. Questa e la confusione piu costosa di chi inizia: lo schermo di questa app mostra quadrati di continuo, e letti come minaccia trasformano ogni lettura in spavento. L attrito e dove la vita chiede movimento, esattamente la gravita della lezione 2.',
        },
      },
    ],
    termos: ['conjuncao', 'oposicao', 'quadratura', 'trigono', 'sextil'],
    verTambem: ['licao-08-orbe-e-forca', 'conceito-aspecto'],
    minutos: 2,
  },

  {
    id: 'licao-08-orbe-e-forca',
    tipo: 'licao',
    ato: 2,
    ordem: 8,
    titulo: {
      'pt-BR': 'Orbe e força',
      'en-US': 'Orb and strength',
      'es-ES': 'Orbe y fuerza',
      'it-IT': 'Orbe e forza',
    },
    resumo: {
      'pt-BR': 'Nem todo aspecto pesa igual. A distância do ângulo exato decide quanto.',
      'en-US': 'Not every aspect weighs the same. Distance from the exact angle decides how much.',
      'es-ES': 'No todo aspecto pesa igual. La distancia del angulo exacto decide cuanto.',
      'it-IT': 'Non ogni aspetto pesa uguale. La distanza dall angolo esatto decide quanto.',
    },
    blocos: [
      {
        tipo: 'paragrafo',
        texto: {
          'pt-BR': 'Dois planetas quase nunca estão no ângulo exato. A orbe é a folga que a tradição aceita em volta do ângulo perfeito — e ela não é um detalhe técnico: é o que separa o aspecto que define uma vida do aspecto que mal se nota.',
          'en-US': 'Two planets are almost never at the exact angle. The orb is the slack tradition accepts around the perfect angle — and it is no technicality: it separates the aspect that defines a life from the one barely noticed.',
          'es-ES': 'Dos planetas casi nunca estan en el angulo exacto. El orbe es la holgura que la tradicion acepta alrededor del angulo perfecto, y no es un detalle tecnico: separa el aspecto que define una vida del que apenas se nota.',
          'it-IT': 'Due pianeti non sono quasi mai all angolo esatto. L orbe e la tolleranza che la tradizione accetta intorno all angolo perfetto, e non e un dettaglio tecnico: separa l aspetto che definisce una vita da quello che si nota appena.',
        },
      },
      {
        tipo: 'figura',
        chave: 'a-orbe-e-a-forca',
        descricao: {
          'pt-BR': 'Uma curva que comeca alta no angulo exato, a zero grau, e cai conforme se afasta dele, chegando perto do chao por volta de seis a oito graus. A queda e suave e continua, sem degraus.',
          'en-US': 'A curve starting high at the exact angle, at zero degrees, falling as it moves away and nearing the floor around six to eight degrees. The fall is smooth and continuous, with no steps.',
          'es-ES': 'Una curva que empieza alta en el angulo exacto, a cero grados, y cae conforme se aleja, acercandose al suelo hacia los seis u ocho grados. La caida es suave y continua, sin escalones.',
          'it-IT': 'Una curva che parte alta all angolo esatto, a zero gradi, e cala allontanandosi, avvicinandosi al fondo intorno ai sei o otto gradi. La discesa e dolce e continua, senza gradini.',
        },
      },
      {
        tipo: 'destaque',
        texto: {
          'pt-BR': 'Orbe pequena, efeito nítido. Orbe larga, efeito de fundo. É por isso que o app mostra os graus ao lado de cada aspecto.',
          'en-US': 'Small orb, sharp effect. Wide orb, background effect. That is why the app shows the degrees next to each aspect.',
          'es-ES': 'Orbe pequeno, efecto nitido. Orbe amplio, efecto de fondo. Por eso la app muestra los grados junto a cada aspecto.',
          'it-IT': 'Orbe stretto, effetto netto. Orbe ampio, effetto di sfondo. Per questo l app mostra i gradi accanto a ogni aspetto.',
        },
      },
      {
        tipo: 'paragrafo',
        texto: {
          'pt-BR': 'A queda é suave, não um degrau: não existe um corte em que o aspecto "desliga". Um aspecto a 1 grau pesa muito mais que um a 5, e o de 5 ainda está lá, de fundo. Sol e Lua ganham uma folga maior que os demais, por serem as duas luzes — a tradição sempre os tratou como caso à parte.',
          'en-US': 'The fall is smooth, not a step: there is no cut where the aspect "switches off". An aspect at 1 degree weighs far more than one at 5, and the one at 5 is still there, in the background. Sun and Moon get a wider slack than the rest, being the two lights — tradition always treated them as a case apart.',
          'es-ES': 'La caida es suave, no un escalon: no hay un corte donde el aspecto se "apaga". Un aspecto a 1 grado pesa mucho mas que uno a 5, y el de 5 sigue ahi, de fondo. Sol y Luna reciben una holgura mayor que los demas, por ser las dos luces: la tradicion siempre los trato como caso aparte.',
          'it-IT': 'La discesa e dolce, non un gradino: non esiste un taglio in cui l aspetto si "spegne". Un aspetto a 1 grado pesa molto piu di uno a 5, e quello a 5 e ancora li, sullo sfondo. Sole e Luna ricevono una tolleranza maggiore degli altri, essendo le due luci: la tradizione li ha sempre trattati come caso a parte.',
        },
      },
    ],
    termos: ['orbe'],
    verTambem: ['conceito-orbe', 'licao-09-transito'],
    minutos: 1,
  },
]
