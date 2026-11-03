import type { Unidade } from './tipos'

/**
 * ATO 4 — LER SOZINHO.
 *
 * ⚠️ O CURSO TERMINA DEVOLVENDO A LEITURA. Tudo o que veio antes foi peça
 * solta; aqui elas viram método, numa ordem que impede o erro mais comum de
 * quem aprendeu as peças — sair somando significado de planeta em planeta até
 * produzir um retrato que não se parece com ninguém.
 *
 * ⚠️ A LIÇÃO 12 CARREGA OS GANCHOS DA FASE 2, inertes. É a lição em que o
 * leitor abre o próprio mapa, então é onde a personalização aterrissa — e
 * deixá-los escritos agora é o que permite a fase 2 só preencher, sem
 * reescrever lição publicada.
 */
export const TRILHA_ATO4: Unidade[] = [
  {
    id: 'licao-11-ordem-de-leitura',
    tipo: 'licao',
    ato: 4,
    ordem: 11,
    titulo: {
      'pt-BR': 'A ordem de leitura',
      'en-US': 'The reading order',
      'es-ES': 'El orden de lectura',
      'it-IT': 'L ordine di lettura',
    },
    resumo: {
      'pt-BR': 'Do conjunto para a parte. Começar pelo detalhe é como se perde o mapa.',
      'en-US': 'From the whole to the part. Starting at the detail is how a chart gets lost.',
      'es-ES': 'Del conjunto a la parte. Empezar por el detalle es como se pierde la carta.',
      'it-IT': 'Dall insieme alla parte. Iniziare dal dettaglio e come si perde la carta.',
    },
    blocos: [
      {
        tipo: 'paragrafo',
        texto: {
          'pt-BR': 'Com as peças na mão, aparece o erro clássico: abrir o mapa e sair lendo planeta por planeta, somando significados até formar um retrato que não se parece com ninguém. Um mapa tem umas quarenta informações, e lidas em ordem errada elas se anulam.',
          'en-US': 'With the pieces in hand, the classic mistake appears: opening the chart and reading planet by planet, adding meanings until you have a portrait that resembles no one. A chart holds some forty pieces of information, and read in the wrong order they cancel each other out.',
          'es-ES': 'Con las piezas en la mano aparece el error clasico: abrir la carta y leer planeta por planeta, sumando significados hasta formar un retrato que no se parece a nadie. Una carta tiene unas cuarenta informaciones, y leidas en el orden equivocado se anulan.',
          'it-IT': 'Con i pezzi in mano compare l errore classico: aprire la carta e leggere pianeta per pianeta, sommando significati fino a formare un ritratto che non somiglia a nessuno. Una carta ha una quarantina di informazioni, e lette nell ordine sbagliato si annullano.',
        },
      },
      {
        tipo: 'figura',
        chave: 'ordem-de-leitura',
        descricao: {
          'pt-BR': 'Quatro passos numerados numa linha vertical: primeiro o conjunto e o elemento que pesa, depois Sol, Lua e Ascendente, depois o que grita no mapa, e por ultimo planeta a planeta.',
          'en-US': 'Four numbered steps on a vertical line: first the whole and the element that weighs, then Sun, Moon and Ascendant, then whatever shouts in the chart, and last planet by planet.',
          'es-ES': 'Cuatro pasos numerados en una linea vertical: primero el conjunto y el elemento que pesa, luego Sol, Luna y Ascendente, luego lo que grita en la carta, y por ultimo planeta a planeta.',
          'it-IT': 'Quattro passi numerati su una linea verticale: prima l insieme e l elemento che pesa, poi Sole, Luna e Ascendente, poi cio che grida nella carta, e infine pianeta per pianeta.',
        },
      },
      {
        tipo: 'paragrafo',
        texto: {
          'pt-BR': 'Comece pelo conjunto: que elemento domina, se falta algum, se as casas estão cheias de um lado só. Depois os três pilares — Sol, Lua e Ascendente, que já dizem a maior parte. Depois o que grita: um aglomerado de planetas, um aspecto quase exato. Só então, se ainda fizer falta, planeta por planeta.',
          'en-US': 'Start with the whole: which element dominates, whether one is missing, whether the houses are crowded on one side. Then the three pillars — Sun, Moon and Ascendant, which already say most of it. Then whatever shouts: a cluster of planets, a nearly exact aspect. Only then, if still needed, planet by planet.',
          'es-ES': 'Empieza por el conjunto: que elemento domina, si falta alguno, si las casas estan llenas de un solo lado. Luego los tres pilares: Sol, Luna y Ascendente, que ya dicen la mayor parte. Luego lo que grita: un cumulo de planetas, un aspecto casi exacto. Solo entonces, si aun hace falta, planeta por planeta.',
          'it-IT': 'Inizia dall insieme: quale elemento domina, se ne manca uno, se le case sono affollate da un lato solo. Poi i tre pilastri: Sole, Luna e Ascendente, che gia dicono la maggior parte. Poi cio che grida: un grappolo di pianeti, un aspetto quasi esatto. Solo allora, se serve ancora, pianeta per pianeta.',
        },
      },
      {
        tipo: 'destaque',
        texto: {
          'pt-BR': 'Do todo para a parte, nunca o contrário. O detalhe só significa alguma coisa dentro do conjunto que o contém.',
          'en-US': 'From whole to part, never the reverse. A detail only means something inside the whole that holds it.',
          'es-ES': 'Del todo a la parte, nunca al reves. El detalle solo significa algo dentro del conjunto que lo contiene.',
          'it-IT': 'Dall insieme alla parte, mai il contrario. Il dettaglio significa qualcosa solo dentro l insieme che lo contiene.',
        },
      },
      {
        tipo: 'exemplo',
        texto: {
          'pt-BR': 'Um mapa sem nenhum planeta em água, com Sol em Capricórnio e cinco planetas na casa 10, já disse quase tudo antes de você olhar para Mercúrio: é alguém construído para realizar, que vai precisar aprender a sentir. O resto são ajustes nesse retrato.',
          'en-US': 'A chart with no planet in water, Sun in Capricorn and five planets in house 10 has said almost everything before you look at Mercury: this is someone built to achieve, who has to learn to feel. The rest are adjustments to that portrait.',
          'es-ES': 'Una carta sin ningun planeta en agua, con Sol en Capricornio y cinco planetas en la casa 10, ya dijo casi todo antes de que mires a Mercurio: es alguien construido para realizar, que tendra que aprender a sentir. El resto son ajustes a ese retrato.',
          'it-IT': 'Una carta senza nessun pianeta in acqua, con Sole in Capricorno e cinque pianeti in casa 10, ha gia detto quasi tutto prima che tu guardi Mercurio: e qualcuno costruito per realizzare, che dovra imparare a sentire. Il resto sono aggiustamenti a quel ritratto.',
        },
      },
    ],
    termos: ['ascendente', 'stellium'],
    verTambem: ['licao-12-seu-mapa'],
    minutos: 2,
  },

  {
    id: 'licao-12-seu-mapa',
    tipo: 'licao',
    ato: 4,
    ordem: 12,
    titulo: {
      'pt-BR': 'Seu mapa, do começo ao fim',
      'en-US': 'Your chart, start to finish',
      'es-ES': 'Tu carta, de principio a fin',
      'it-IT': 'La tua carta, dall inizio alla fine',
    },
    resumo: {
      'pt-BR': 'A travessia completa, aplicada ao único mapa que interessa: o seu.',
      'en-US': 'The full crossing, applied to the only chart that matters: yours.',
      'es-ES': 'La travesia completa, aplicada a la unica carta que importa: la tuya.',
      'it-IT': 'La traversata completa, applicata all unica carta che conta: la tua.',
    },
    blocos: [
      {
        tipo: 'paragrafo',
        texto: {
          'pt-BR': 'Agora as peças se juntam. Abra a aba Mapas, deixe o seu diante de você, e percorra os quatro passos da lição anterior sem pressa. O que você vai fazer aqui não é conferir se acertou — é praticar a leitura, que é a única coisa que não dá para aprender lendo.',
          'en-US': 'Now the pieces come together. Open the Charts tab, leave yours in front of you, and walk the four steps of the previous lesson without hurry. What you do here is not checking whether it got you right — it is practising the reading, the one thing that cannot be learnt by reading.',
          'es-ES': 'Ahora las piezas se juntan. Abre la pestana Mapas, deja la tuya delante de ti, y recorre los cuatro pasos de la leccion anterior sin prisa. Lo que haras aqui no es comprobar si acerto: es practicar la lectura, que es lo unico que no se aprende leyendo.',
          'it-IT': 'Ora i pezzi si uniscono. Apri la scheda Carte, lascia la tua davanti a te, e percorri i quattro passi della lezione precedente senza fretta. Cio che farai qui non e verificare se ha indovinato: e praticare la lettura, l unica cosa che non si impara leggendo.',
        },
      },
      // ⚠️ INERTE NA FASE 1. Aqui a fase 2 aterrissa o signo do leitor, no
      // ponto exato em que a lição manda olhar o conjunto do próprio mapa.
      { tipo: 'ganchoPessoal', chave: 'planeta-no-signo' },
      {
        tipo: 'paragrafo',
        texto: {
          'pt-BR': 'Primeiro o conjunto: conte quantos planetas em cada elemento e veja o que sobra e o que falta. Depois os três pilares. O Sol diz o que você está aqui para ser; a Lua, o que você sente antes de pensar; o Ascendente, a porta por onde você entra num ambiente — e é ele que define onde começam as suas casas.',
          'en-US': 'First the whole: count how many planets in each element and see what is plentiful and what is missing. Then the three pillars. The Sun says what you are here to be; the Moon, what you feel before thinking; the Ascendant, the door you enter a room by — and it is the Ascendant that sets where your houses begin.',
          'es-ES': 'Primero el conjunto: cuenta cuantos planetas hay en cada elemento y mira que sobra y que falta. Luego los tres pilares. El Sol dice lo que viniste a ser; la Luna, lo que sientes antes de pensar; el Ascendente, la puerta por la que entras en un ambiente, y es el que define donde empiezan tus casas.',
          'it-IT': 'Prima l insieme: conta quanti pianeti in ogni elemento e guarda cosa abbonda e cosa manca. Poi i tre pilastri. Il Sole dice cosa sei qui per essere; la Luna, cosa senti prima di pensare; l Ascendente, la porta da cui entri in un ambiente, ed e lui a definire dove iniziano le tue case.',
        },
      },
      // ⚠️ INERTE. A casa de cada planeta é o passo seguinte do roteiro.
      { tipo: 'ganchoPessoal', chave: 'planeta-na-casa' },
      {
        tipo: 'paragrafo',
        texto: {
          'pt-BR': 'Depois procure o que grita: três ou mais planetas juntos na mesma casa, ou um aspecto com orbe abaixo de um grau. Esses são os traços que a pessoa reconhece de imediato quando ouve. Toque num aspecto da grade e o app abre a leitura dele.',
          'en-US': 'Then look for what shouts: three or more planets together in one house, or an aspect with an orb under one degree. Those are the traits a person recognises at once when they hear them. Tap an aspect in the grid and the app opens its reading.',
          'es-ES': 'Luego busca lo que grita: tres o mas planetas juntos en la misma casa, o un aspecto con orbe por debajo de un grado. Esos son los rasgos que la persona reconoce de inmediato al oirlos. Toca un aspecto de la rejilla y la app abre su lectura.',
          'it-IT': 'Poi cerca cio che grida: tre o piu pianeti insieme nella stessa casa, o un aspetto con orbe sotto un grado. Sono i tratti che la persona riconosce subito quando li sente. Tocca un aspetto nella griglia e l app ne apre la lettura.',
        },
      },
      // ⚠️ INERTE. O aspecto mais exato do mapa de quem lê, que é exatamente
      // o que o parágrafo acima manda procurar.
      { tipo: 'ganchoPessoal', chave: 'aspecto-mais-exato' },
      {
        tipo: 'paragrafo',
        texto: {
          'pt-BR': 'Por último, o céu de hoje por cima. Volte à Home e olhe os números das áreas sabendo o que eles são: trânsito, não sentença. A área baixa desta semana não é um defeito seu — é um relevo que você está atravessando agora.',
          'en-US': 'Last, today sky on top. Go back to the Home and look at the area numbers knowing what they are: transit, not verdict. The low area this week is not a flaw of yours — it is a relief you are crossing right now.',
          'es-ES': 'Por ultimo, el cielo de hoy encima. Vuelve a la Home y mira los numeros de las areas sabiendo lo que son: transito, no sentencia. El area baja de esta semana no es un defecto tuyo: es un relieve que estas atravesando ahora.',
          'it-IT': 'Infine, il cielo di oggi sopra. Torna alla Home e guarda i numeri delle aree sapendo cosa sono: transito, non sentenza. L area bassa di questa settimana non e un tuo difetto: e un rilievo che stai attraversando adesso.',
        },
      },
      {
        tipo: 'destaque',
        texto: {
          'pt-BR': 'O mapa não é a sua sentença, e também não é a sua desculpa. É o relevo da travessia — e quem atravessa é você.',
          'en-US': 'The chart is not your verdict, and it is not your excuse either. It is the relief of the crossing — and the one crossing is you.',
          'es-ES': 'La carta no es tu sentencia, y tampoco es tu excusa. Es el relieve de la travesia, y quien atraviesa eres tu.',
          'it-IT': 'La carta non e la tua sentenza, e non e nemmeno la tua scusa. E il rilievo della traversata, e chi attraversa sei tu.',
        },
      },
      {
        tipo: 'cuidado',
        texto: {
          'pt-BR': 'Se algum trecho do seu mapa não bater com você, a leitura é que está errada — não você. O mapa descreve um terreno; só você sabe como atravessou.',
          'en-US': 'If some part of your chart does not match you, it is the reading that is wrong — not you. The chart describes a ground; only you know how you crossed it.',
          'es-ES': 'Si alguna parte de tu carta no coincide contigo, la lectura es la que esta equivocada, no tu. La carta describe un terreno; solo tu sabes como lo atravesaste.',
          'it-IT': 'Se qualche parte della tua carta non ti corrisponde, e la lettura a essere sbagliata, non tu. La carta descrive un terreno; solo tu sai come l hai attraversato.',
        },
      },
    ],
    termos: ['ascendente', 'casa', 'orbe'],
    verTambem: ['licao-03-quem-atravessa', 'conceito-aspecto'],
    minutos: 2,
  },
]
