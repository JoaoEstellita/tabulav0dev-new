import type { Unidade } from './tipos'

/**
 * ATO 1 — AS TRÊS PERGUNTAS DE UM MAPA.
 *
 * ⚠️ PLANETA, SIGNO E CASA RESPONDEM COISAS DIFERENTES, e é só isso que
 * separa um mapa de uma lista de símbolos decorados. O quê, como e onde. Quem
 * entende as três perguntas lê qualquer linha do app sozinho; quem não
 * entende decora combinações para sempre.
 */
export const TRILHA_ATO1: Unidade[] = [
  {
    id: 'licao-04-planeta-o-que',
    tipo: 'licao',
    ato: 1,
    ordem: 4,
    titulo: {
      'pt-BR': 'O planeta diz o quê',
      'en-US': 'The planet says what',
      'es-ES': 'El planeta dice que',
      'it-IT': 'Il pianeta dice cosa',
    },
    resumo: {
      'pt-BR': 'Cada planeta é um assunto. A velocidade dele decide se é seu ou da sua geração.',
      'en-US': 'Each planet is a subject. Its speed decides whether it is yours or your generation.',
      'es-ES': 'Cada planeta es un asunto. Su velocidad decide si es tuyo o de tu generacion.',
      'it-IT': 'Ogni pianeta e un argomento. La sua velocita decide se e tuo o della tua generazione.',
    },
    blocos: [
      {
        tipo: 'paragrafo',
        texto: {
          'pt-BR': 'Um planeta é um assunto, e sempre o mesmo. Vênus trata de vínculo e de gosto onde quer que esteja; Marte trata de ação. O planeta não muda de tema — muda de jeito e de lugar, e é disso que tratam as duas lições seguintes.',
          'en-US': 'A planet is a subject, and always the same one. Venus deals with bond and taste wherever it sits; Mars deals with action. The planet does not change theme — it changes manner and place, and that is what the next two lessons are about.',
          'es-ES': 'Un planeta es un asunto, y siempre el mismo. Venus trata del vinculo y del gusto donde sea que este; Marte trata de la accion. El planeta no cambia de tema: cambia de modo y de lugar, y de eso tratan las dos lecciones siguientes.',
          'it-IT': 'Un pianeta e un argomento, e sempre lo stesso. Venere tratta di legame e di gusto ovunque si trovi; Marte tratta di azione. Il pianeta non cambia tema: cambia modo e luogo, ed e di questo che parlano le due lezioni seguenti.',
        },
      },
      {
        tipo: 'paragrafo',
        texto: {
          'pt-BR': 'O que separa os planetas em grupos não é a importância, é a velocidade. A Lua dá uma volta em 28 dias e o Sol em um ano: eles descrevem você. Júpiter leva 12 anos e Saturno 29 — descrevem fases de uma vida. Urano, Netuno e Plutão levam décadas no mesmo signo, então descrevem uma geração inteira, não uma pessoa.',
          'en-US': 'What sorts planets into groups is not importance, it is speed. The Moon laps in 28 days and the Sun in a year: they describe you. Jupiter takes 12 years and Saturn 29 — they describe phases of a life. Uranus, Neptune and Pluto spend decades in the same sign, so they describe a whole generation, not a person.',
          'es-ES': 'Lo que separa a los planetas en grupos no es la importancia, es la velocidad. La Luna da una vuelta en 28 dias y el Sol en un ano: describen a ti. Jupiter tarda 12 anos y Saturno 29: describen fases de una vida. Urano, Neptuno y Pluton pasan decadas en el mismo signo, asi que describen a una generacion entera, no a una persona.',
          'it-IT': 'Cio che divide i pianeti in gruppi non e l importanza, e la velocita. La Luna compie un giro in 28 giorni e il Sole in un anno: descrivono te. Giove impiega 12 anni e Saturno 29: descrivono fasi di una vita. Urano, Nettuno e Plutone passano decenni nello stesso segno, quindi descrivono un intera generazione, non una persona.',
        },
      },
      {
        tipo: 'figura',
        chave: 'velocidade-dos-planetas',
        descricao: {
          'pt-BR': 'Barras horizontais comparando quanto tempo cada planeta leva para dar uma volta, da Lua em 28 dias a Netuno em 165 anos, agrupadas em pessoais, sociais e de geracao. A escala e logaritmica.',
          'en-US': 'Horizontal bars comparing how long each planet takes for one lap, from the Moon at 28 days to Neptune at 165 years, grouped as personal, social and generational. The scale is logarithmic.',
          'es-ES': 'Barras horizontales que comparan cuanto tarda cada planeta en dar una vuelta, de la Luna en 28 dias a Neptuno en 165 anos, agrupadas en personales, sociales y de generacion. La escala es logaritmica.',
          'it-IT': 'Barre orizzontali che confrontano quanto impiega ogni pianeta per un giro, dalla Luna a 28 giorni a Nettuno a 165 anni, raggruppate in personali, sociali e generazionali. La scala e logaritmica.',
        },
      },
      {
        tipo: 'destaque',
        texto: {
          'pt-BR': 'Quanto mais rápido o planeta, mais ele fala de você em particular. Quanto mais lento, mais ele fala de todo mundo que nasceu por perto da sua época.',
          'en-US': 'The faster the planet, the more it speaks of you in particular. The slower it is, the more it speaks of everyone born around your time.',
          'es-ES': 'Cuanto mas rapido el planeta, mas habla de ti en particular. Cuanto mas lento, mas habla de todos los que nacieron cerca de tu epoca.',
          'it-IT': 'Piu il pianeta e veloce, piu parla di te in particolare. Piu e lento, piu parla di chiunque sia nato vicino alla tua epoca.',
        },
      },
      {
        tipo: 'cuidado',
        texto: {
          'pt-BR': 'Por isso "Plutão em Escorpião" não diz quase nada sobre você: milhões de pessoas nasceram com ele ali. O que individualiza um planeta lento é a CASA em que ele caiu e os aspectos que faz — nunca o signo sozinho.',
          'en-US': 'That is why "Pluto in Scorpio" says almost nothing about you: millions were born with it there. What individualises a slow planet is the HOUSE it fell in and the aspects it makes — never the sign alone.',
          'es-ES': 'Por eso "Pluton en Escorpio" no dice casi nada sobre ti: millones nacieron con el ahi. Lo que individualiza a un planeta lento es la CASA en que cayo y los aspectos que hace, nunca el signo solo.',
          'it-IT': 'Per questo "Plutone in Scorpione" non dice quasi nulla di te: milioni sono nati con lui li. Cio che individua un pianeta lento e la CASA in cui e caduto e gli aspetti che fa, mai il segno da solo.',
        },
      },
    ],
    termos: [],
    verTambem: ['licao-05-signo-como', 'planeta-sol'],
    minutos: 2,
  },

  {
    id: 'licao-05-signo-como',
    tipo: 'licao',
    ato: 1,
    ordem: 5,
    titulo: {
      'pt-BR': 'O signo diz como',
      'en-US': 'The sign says how',
      'es-ES': 'El signo dice como',
      'it-IT': 'Il segno dice come',
    },
    resumo: {
      'pt-BR': 'O signo não é o assunto — é o sotaque com que o planeta fala dele.',
      'en-US': 'The sign is not the subject — it is the accent the planet speaks it with.',
      'es-ES': 'El signo no es el asunto: es el acento con que el planeta lo habla.',
      'it-IT': 'Il segno non e l argomento: e l accento con cui il pianeta lo pronuncia.',
    },
    blocos: [
      {
        tipo: 'paragrafo',
        texto: {
          'pt-BR': 'Se o planeta é o assunto, o signo é o sotaque. Marte em Áries age primeiro e pensa depois; Marte em Libra age negociando. O assunto é o mesmo — agir — e o modo é outro. É por isso que "ser de Áries" explica tão pouco: isso descreve o sotaque de um planeta só, o Sol.',
          'en-US': 'If the planet is the subject, the sign is the accent. Mars in Aries acts first and thinks later; Mars in Libra acts by negotiating. The subject is the same — acting — and the manner is different. That is why "being an Aries" explains so little: it describes the accent of one planet only, the Sun.',
          'es-ES': 'Si el planeta es el asunto, el signo es el acento. Marte en Aries actua primero y piensa despues; Marte en Libra actua negociando. El asunto es el mismo, actuar, y el modo es otro. Por eso "ser de Aries" explica tan poco: describe el acento de un solo planeta, el Sol.',
          'it-IT': 'Se il pianeta e l argomento, il segno e l accento. Marte in Ariete agisce prima e pensa dopo; Marte in Bilancia agisce negoziando. L argomento e lo stesso, agire, e il modo e un altro. Per questo "essere dell Ariete" spiega cosi poco: descrive l accento di un pianeta solo, il Sole.',
        },
      },
      {
        tipo: 'paragrafo',
        texto: {
          'pt-BR': 'Os doze signos não são doze caracteres soltos para decorar. São quatro matérias — fogo, terra, ar e água — cruzadas com três jeitos de agir: começar, sustentar e adaptar. Quatro vezes três dá doze, e cada combinação acontece uma vez só. É essa grade que faz os doze serem doze.',
          'en-US': 'The twelve signs are not twelve loose characters to memorise. They are four materials — fire, earth, air and water — crossed with three ways of acting: starting, sustaining and adapting. Four times three is twelve, and each combination happens exactly once. That grid is what makes the twelve be twelve.',
          'es-ES': 'Los doce signos no son doce caracteres sueltos para memorizar. Son cuatro materias (fuego, tierra, aire y agua) cruzadas con tres modos de actuar: empezar, sostener y adaptar. Cuatro por tres da doce, y cada combinacion ocurre una sola vez. Esa rejilla es lo que hace que los doce sean doce.',
          'it-IT': 'I dodici segni non sono dodici caratteri sciolti da memorizzare. Sono quattro materie (fuoco, terra, aria e acqua) incrociate con tre modi di agire: iniziare, sostenere e adattare. Quattro per tre fa dodici, e ogni combinazione accade una volta sola. E questa griglia che fa si che i dodici siano dodici.',
        },
      },
      {
        tipo: 'figura',
        chave: 'elementos-e-modalidades',
        descricao: {
          'pt-BR': 'Uma tabela de quatro linhas por tres colunas. As linhas sao os elementos fogo, terra, ar e agua; as colunas sao as modalidades cardinal, fixo e mutavel. Cada uma das doze celulas traz um signo, e nenhuma combinacao se repete.',
          'en-US': 'A table of four rows by three columns. The rows are the elements fire, earth, air and water; the columns are the modes cardinal, fixed and mutable. Each of the twelve cells holds one sign, and no combination repeats.',
          'es-ES': 'Una tabla de cuatro filas por tres columnas. Las filas son los elementos fuego, tierra, aire y agua; las columnas son las modalidades cardinal, fijo y mutable. Cada una de las doce celdas lleva un signo, y ninguna combinacion se repite.',
          'it-IT': 'Una tabella di quattro righe per tre colonne. Le righe sono gli elementi fuoco, terra, aria e acqua; le colonne sono le modalita cardinale, fisso e mobile. Ognuna delle dodici celle porta un segno, e nessuna combinazione si ripete.',
        },
      },
      {
        tipo: 'destaque',
        texto: {
          'pt-BR': 'Elemento é a matéria de que a pessoa é feita. Modalidade é o que ela faz com essa matéria: começa, sustenta ou transforma.',
          'en-US': 'Element is the material a person is made of. Mode is what they do with it: start, sustain or transform.',
          'es-ES': 'Elemento es la materia de la que la persona esta hecha. Modalidad es lo que hace con ella: empieza, sostiene o transforma.',
          'it-IT': 'Elemento e la materia di cui la persona e fatta. Modalita e cio che ne fa: inizia, sostiene o trasforma.',
        },
      },
      {
        tipo: 'exemplo',
        texto: {
          'pt-BR': 'Áries, Leão e Sagitário são todos de fogo — os três se acendem rápido. Mas Áries começa o incêndio, Leão o mantém aceso e Sagitário o espalha. Mesma matéria, três empregos dela.',
          'en-US': 'Aries, Leo and Sagittarius are all fire — all three catch quickly. But Aries starts the blaze, Leo keeps it burning and Sagittarius spreads it. Same material, three uses of it.',
          'es-ES': 'Aries, Leo y Sagitario son todos de fuego: los tres se encienden rapido. Pero Aries empieza el incendio, Leo lo mantiene encendido y Sagitario lo esparce. Misma materia, tres empleos de ella.',
          'it-IT': 'Ariete, Leone e Sagittario sono tutti di fuoco: tutti e tre si accendono in fretta. Ma l Ariete inizia l incendio, il Leone lo tiene acceso e il Sagittario lo diffonde. Stessa materia, tre impieghi di essa.',
        },
      },
    ],
    termos: [],
    verTambem: ['licao-06-casa-onde'],
    minutos: 2,
  },

  {
    id: 'licao-06-casa-onde',
    tipo: 'licao',
    ato: 1,
    ordem: 6,
    titulo: {
      'pt-BR': 'A casa diz onde',
      'en-US': 'The house says where',
      'es-ES': 'La casa dice donde',
      'it-IT': 'La casa dice dove',
    },
    resumo: {
      'pt-BR': 'A casa é o setor da vida onde o assunto do planeta acontece de verdade.',
      'en-US': 'The house is the area of life where the planet subject actually happens.',
      'es-ES': 'La casa es el sector de la vida donde el asunto del planeta ocurre de verdad.',
      'it-IT': 'La casa e il settore di vita dove l argomento del pianeta accade davvero.',
    },
    blocos: [
      {
        tipo: 'paragrafo',
        texto: {
          'pt-BR': 'As casas dividem o mapa em doze setores de vida: o corpo, o dinheiro, a conversa, a família, a criação, a rotina, o outro, a crise, o sentido, a obra, o grupo, o recolhimento. Elas não vêm do céu — vêm do horizonte do lugar e do minuto em que você nasceu, girando uma casa a cada duas horas.',
          'en-US': 'Houses split the chart into twelve areas of life: the body, money, conversation, family, creation, routine, the other, crisis, meaning, work, the group, retreat. They do not come from the sky — they come from the horizon of the place and minute you were born, turning one house every two hours.',
          'es-ES': 'Las casas dividen la carta en doce sectores de vida: el cuerpo, el dinero, la conversacion, la familia, la creacion, la rutina, el otro, la crisis, el sentido, la obra, el grupo, el recogimiento. No vienen del cielo: vienen del horizonte del lugar y del minuto en que naciste, girando una casa cada dos horas.',
          'it-IT': 'Le case dividono la carta in dodici settori di vita: il corpo, il denaro, la conversazione, la famiglia, la creazione, la routine, l altro, la crisi, il senso, l opera, il gruppo, il ritiro. Non vengono dal cielo: vengono dall orizzonte del luogo e del minuto in cui sei nato, ruotando di una casa ogni due ore.',
        },
      },
      {
        tipo: 'figura',
        chave: 'as-doze-casas',
        descricao: {
          'pt-BR': 'Uma roda dividida em doze setores numerados, cada um com o assunto da casa escrito dentro. A linha horizontal que corta a roda ao meio e o horizonte do nascimento, e a casa 1 comeca nela.',
          'en-US': 'A wheel split into twelve numbered sectors, each with the house subject written inside. The horizontal line crossing the wheel is the horizon of birth, and house 1 starts at it.',
          'es-ES': 'Una rueda dividida en doce sectores numerados, cada uno con el asunto de la casa escrito dentro. La linea horizontal que corta la rueda es el horizonte del nacimiento, y la casa 1 empieza en ella.',
          'it-IT': 'Una ruota divisa in dodici settori numerati, ognuno con l argomento della casa scritto dentro. La linea orizzontale che taglia la ruota e l orizzonte della nascita, e la casa 1 inizia li.',
        },
      },
      {
        tipo: 'paragrafo',
        texto: {
          'pt-BR': 'Aqui está o que liga as três perguntas. O mesmo Marte em Áries — mesmo assunto, mesmo sotaque — muda completamente de endereço conforme a casa. Na casa 2 ele briga por dinheiro; na casa 7 briga dentro da relação; na casa 10 briga na carreira. O planeta diz o que, o signo diz como, a casa diz ONDE isso aparece na sua vida.',
          'en-US': 'Here is what ties the three questions together. The same Mars in Aries — same subject, same accent — changes address entirely depending on the house. In house 2 it fights over money; in house 7 it fights inside the relationship; in house 10 it fights in the career. The planet says what, the sign says how, the house says WHERE it shows up in your life.',
          'es-ES': 'Aqui esta lo que une las tres preguntas. El mismo Marte en Aries (mismo asunto, mismo acento) cambia de direccion por completo segun la casa. En la casa 2 pelea por dinero; en la casa 7 pelea dentro de la relacion; en la casa 10 pelea en la carrera. El planeta dice que, el signo dice como, la casa dice DONDE aparece en tu vida.',
          'it-IT': 'Ecco cio che lega le tre domande. Lo stesso Marte in Ariete (stesso argomento, stesso accento) cambia del tutto indirizzo a seconda della casa. In casa 2 litiga per il denaro; in casa 7 litiga dentro la relazione; in casa 10 litiga nella carriera. Il pianeta dice cosa, il segno dice come, la casa dice DOVE appare nella tua vita.',
        },
      },
      {
        tipo: 'destaque',
        texto: {
          'pt-BR': 'Planeta, signo e casa respondem perguntas diferentes. Quem entende as três lê qualquer linha deste app sozinho; quem não entende decora combinações para sempre.',
          'en-US': 'Planet, sign and house answer different questions. Whoever gets all three reads any line in this app unaided; whoever does not memorises combinations forever.',
          'es-ES': 'Planeta, signo y casa responden preguntas distintas. Quien entiende las tres lee cualquier linea de esta app solo; quien no, memoriza combinaciones para siempre.',
          'it-IT': 'Pianeta, segno e casa rispondono a domande diverse. Chi capisce tutte e tre legge da solo qualunque riga di questa app; chi no, memorizza combinazioni per sempre.',
        },
      },
      {
        tipo: 'cuidado',
        texto: {
          'pt-BR': 'As casas dependem da HORA de nascimento, e giram depressa: meia hora de erro já muda a casa de um planeta. Se você não sabe a hora exata, leia o mapa pelos planetas e signos e trate as casas com reserva.',
          'en-US': 'Houses depend on the TIME of birth and turn quickly: half an hour of error already moves a planet to another house. If you do not know the exact time, read the chart by planets and signs and treat houses with reserve.',
          'es-ES': 'Las casas dependen de la HORA de nacimiento y giran rapido: media hora de error ya cambia la casa de un planeta. Si no sabes la hora exacta, lee la carta por planetas y signos y trata las casas con reserva.',
          'it-IT': 'Le case dipendono dall ORA di nascita e ruotano in fretta: mezz ora di errore sposta gia un pianeta di casa. Se non sai l ora esatta, leggi la carta per pianeti e segni e tratta le case con riserva.',
        },
      },
    ],
    termos: ['casa', 'cuspide'],
    verTambem: ['licao-07-aspecto-conversa'],
    minutos: 2,
  },
]
