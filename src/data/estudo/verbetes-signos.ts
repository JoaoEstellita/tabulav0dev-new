import type { Unidade } from './tipos'

/**
 * OS DOZE SIGNOS.
 *
 * ⚠️ CADA UM ABRE DIZENDO ELEMENTO E MODALIDADE, e isso é deliberado: é a
 * única forma de o leitor PREVER um signo em vez de decorá-lo. Áries é fogo
 * cardinal, e quem entendeu a lição 5 já sabe a maior parte antes de ler a
 * frase seguinte. Verbete que começa listando adjetivos ensina a decorar.
 *
 * ⚠️ O SIGNO É O SOTAQUE, NÃO O ASSUNTO. Cada texto aqui descreve um MODO de
 * fazer as coisas, nunca uma pessoa — "Áries é impulsivo" descreveria gente,
 * e a maior parte do mapa de alguém não é o Sol. Ver a lição 5.
 */
export const VERBETES_SIGNOS: Unidade[] = [
  {
    id: 'signo-aries',
    tipo: 'verbete',
    categoria: 'signo',
    titulo: { 'pt-BR': 'Áries', 'en-US': 'Aries', 'es-ES': 'Aries', 'it-IT': 'Ariete' },
    resumo: {
      'pt-BR': 'Fogo cardinal: começa antes de ter certeza.',
      'en-US': 'Cardinal fire: starts before being sure.',
      'es-ES': 'Fuego cardinal: empieza antes de estar seguro.',
      'it-IT': 'Fuoco cardinale: inizia prima di esserne certo.',
    },
    blocos: [{
      tipo: 'figura',
      chave: 'elementos-e-modalidades',
      foco: 'aries',
      descricao: {
        'pt-BR': 'A tabela dos doze signos, quatro elementos por tres modalidades, com a celula de Aries acesa no cruzamento de fogo com cardinal.',
        'en-US': 'The table of the twelve signs, four elements by three modes, with the Aries cell lit where fire meets cardinal.',
        'es-ES': 'La tabla de los doce signos, cuatro elementos por tres modalidades, con la celda de Aries encendida en el cruce de fuego con cardinal.',
        'it-IT': 'La tabella dei dodici segni, quattro elementi per tre modalita, con la cella di Ariete accesa all incrocio di fuoco con cardinale.',
      },
    }, {
      tipo: 'paragrafo',
      texto: {
        'pt-BR': 'Fogo que começa. O que passa por Áries ganha pressa, coragem e pouca paciência para preparar terreno — a decisão vem antes da análise, e a correção vem depois, no caminho. Regido por Marte.',
        'en-US': 'Fire that starts. Whatever passes through Aries gains haste, courage and little patience for groundwork — the decision comes before the analysis, and the correction comes later, on the way. Ruled by Mars.',
        'es-ES': 'Fuego que empieza. Lo que pasa por Aries gana prisa, coraje y poca paciencia para preparar terreno: la decision viene antes del analisis, y la correccion despues, en el camino. Regido por Marte.',
        'it-IT': 'Fuoco che inizia. Cio che passa per l Ariete guadagna fretta, coraggio e poca pazienza per preparare il terreno: la decisione viene prima dell analisi, e la correzione dopo, per strada. Governato da Marte.',
      },
    }, {
      tipo: 'destaque',
      texto: {
        'pt-BR': 'A força dele é partir primeiro. O custo é partir sem mapa.',
        'en-US': 'Its strength is setting off first. The cost is setting off with no map.',
        'es-ES': 'Su fuerza es partir primero. El costo es partir sin mapa.',
        'it-IT': 'La sua forza e partire per primo. Il costo e partire senza mappa.',
      },
    }],
    termos: [],
    verTambem: ['planeta-marte', 'licao-05-signo-como'],
    minutos: 1,
  },
  {
    id: 'signo-touro',
    tipo: 'verbete',
    categoria: 'signo',
    titulo: { 'pt-BR': 'Touro', 'en-US': 'Taurus', 'es-ES': 'Tauro', 'it-IT': 'Toro' },
    resumo: {
      'pt-BR': 'Terra fixa: constrói devagar e não larga.',
      'en-US': 'Fixed earth: builds slowly and does not let go.',
      'es-ES': 'Tierra fija: construye despacio y no suelta.',
      'it-IT': 'Terra fissa: costruisce piano e non molla.',
    },
    blocos: [{
      tipo: 'figura',
      chave: 'elementos-e-modalidades',
      foco: 'touro',
      descricao: {
        'pt-BR': 'A tabela dos doze signos, quatro elementos por tres modalidades, com a celula de Touro acesa no cruzamento de terra com fixo.',
        'en-US': 'The table of the twelve signs, four elements by three modes, with the Taurus cell lit where earth meets fixed.',
        'es-ES': 'La tabla de los doce signos, cuatro elementos por tres modalidades, con la celda de Tauro encendida en el cruce de tierra con fijo.',
        'it-IT': 'La tabella dei dodici segni, quattro elementi per tre modalita, con la cella di Toro accesa all incrocio di terra con fisso.',
      },
    }, {
      tipo: 'paragrafo',
      texto: {
        'pt-BR': 'Terra que sustenta. O que passa por Touro ganha constância, apreço pelo concreto e uma resistência enorme a mudar de rota depois de escolhida. Regido por Vênus.',
        'en-US': 'Earth that sustains. Whatever passes through Taurus gains steadiness, a liking for the concrete and a huge resistance to changing route once chosen. Ruled by Venus.',
        'es-ES': 'Tierra que sostiene. Lo que pasa por Tauro gana constancia, aprecio por lo concreto y una enorme resistencia a cambiar de ruta una vez elegida. Regido por Venus.',
        'it-IT': 'Terra che sostiene. Cio che passa per il Toro guadagna costanza, gusto per il concreto e un enorme resistenza a cambiare rotta una volta scelta. Governato da Venere.',
      },
    }, {
      tipo: 'destaque',
      texto: {
        'pt-BR': 'A força dele é não desistir. O custo é não largar o que já acabou.',
        'en-US': 'Its strength is not giving up. The cost is not letting go of what is already over.',
        'es-ES': 'Su fuerza es no rendirse. El costo es no soltar lo que ya termino.',
        'it-IT': 'La sua forza e non arrendersi. Il costo e non lasciare cio che e gia finito.',
      },
    }],
    termos: [],
    verTambem: ['planeta-venus'],
    minutos: 1,
  },
  {
    id: 'signo-gemeos',
    tipo: 'verbete',
    categoria: 'signo',
    titulo: { 'pt-BR': 'Gêmeos', 'en-US': 'Gemini', 'es-ES': 'Geminis', 'it-IT': 'Gemelli' },
    resumo: {
      'pt-BR': 'Ar mutável: liga uma coisa na outra e segue adiante.',
      'en-US': 'Mutable air: connects one thing to another and moves on.',
      'es-ES': 'Aire mutable: conecta una cosa con otra y sigue adelante.',
      'it-IT': 'Aria mobile: collega una cosa all altra e prosegue.',
    },
    blocos: [{
      tipo: 'figura',
      chave: 'elementos-e-modalidades',
      foco: 'gemeos',
      descricao: {
        'pt-BR': 'A tabela dos doze signos, quatro elementos por tres modalidades, com a celula de Gemeos acesa no cruzamento de ar com mutavel.',
        'en-US': 'The table of the twelve signs, four elements by three modes, with the Gemini cell lit where air meets mutable.',
        'es-ES': 'La tabla de los doce signos, cuatro elementos por tres modalidades, con la celda de Geminis encendida en el cruce de aire con mutable.',
        'it-IT': 'La tabella dei dodici segni, quattro elementi per tre modalita, con la cella di Gemelli accesa all incrocio di aria con mobile.',
      },
    }, {
      tipo: 'paragrafo',
      texto: {
        'pt-BR': 'Ar que circula. O que passa por Gêmeos ganha curiosidade, facilidade de palavra e pressa de ir ao próximo assunto antes de esgotar o atual. Regido por Mercúrio.',
        'en-US': 'Air that circulates. Whatever passes through Gemini gains curiosity, ease with words and a hurry to reach the next subject before exhausting the current one. Ruled by Mercury.',
        'es-ES': 'Aire que circula. Lo que pasa por Geminis gana curiosidad, facilidad de palabra y prisa por ir al siguiente asunto antes de agotar el actual. Regido por Mercurio.',
        'it-IT': 'Aria che circola. Cio che passa per i Gemelli guadagna curiosita, facilita di parola e fretta di passare al prossimo argomento prima di esaurire quello attuale. Governato da Mercurio.',
      },
    }, {
      tipo: 'destaque',
      texto: {
        'pt-BR': 'A força dele é ver a ligação que ninguém viu. O custo é a profundidade que exige ficar.',
        'en-US': 'Its strength is seeing the link nobody saw. The cost is the depth that requires staying.',
        'es-ES': 'Su fuerza es ver el vinculo que nadie vio. El costo es la profundidad que exige quedarse.',
        'it-IT': 'La sua forza e vedere il legame che nessuno ha visto. Il costo e la profondita che richiede di restare.',
      },
    }],
    termos: [],
    verTambem: ['planeta-mercurio'],
    minutos: 1,
  },
  {
    id: 'signo-cancer',
    tipo: 'verbete',
    categoria: 'signo',
    titulo: { 'pt-BR': 'Câncer', 'en-US': 'Cancer', 'es-ES': 'Cancer', 'it-IT': 'Cancro' },
    resumo: {
      'pt-BR': 'Água cardinal: começa pelo cuidado.',
      'en-US': 'Cardinal water: starts from care.',
      'es-ES': 'Agua cardinal: empieza por el cuidado.',
      'it-IT': 'Acqua cardinale: inizia dalla cura.',
    },
    blocos: [{
      tipo: 'figura',
      chave: 'elementos-e-modalidades',
      foco: 'cancer',
      descricao: {
        'pt-BR': 'A tabela dos doze signos, quatro elementos por tres modalidades, com a celula de Cancer acesa no cruzamento de agua com cardinal.',
        'en-US': 'The table of the twelve signs, four elements by three modes, with the Cancer cell lit where water meets cardinal.',
        'es-ES': 'La tabla de los doce signos, cuatro elementos por tres modalidades, con la celda de Cancer encendida en el cruce de agua con cardinal.',
        'it-IT': 'La tabella dei dodici segni, quattro elementi per tre modalita, con la cella di Cancro accesa all incrocio di acqua con cardinale.',
      },
    }, {
      tipo: 'paragrafo',
      texto: {
        'pt-BR': 'Água que inicia. O que passa por Câncer ganha memória afetiva, instinto de proteger e a tendência a decidir pelo que sente antes do que calcula. Regido pela Lua.',
        'en-US': 'Water that initiates. Whatever passes through Cancer gains emotional memory, an instinct to protect and a tendency to decide by what it feels before what it calculates. Ruled by the Moon.',
        'es-ES': 'Agua que inicia. Lo que pasa por Cancer gana memoria afectiva, instinto de proteger y la tendencia a decidir por lo que siente antes que por lo que calcula. Regido por la Luna.',
        'it-IT': 'Acqua che inizia. Cio che passa per il Cancro guadagna memoria affettiva, istinto di proteggere e la tendenza a decidere per cio che sente prima che per cio che calcola. Governato dalla Luna.',
      },
    }, {
      tipo: 'destaque',
      texto: {
        'pt-BR': 'A força dele é fazer casa onde não havia. O custo é confundir proteger com segurar.',
        'en-US': 'Its strength is making a home where there was none. The cost is mistaking protecting for holding on.',
        'es-ES': 'Su fuerza es hacer casa donde no habia. El costo es confundir proteger con retener.',
        'it-IT': 'La sua forza e fare casa dove non c era. Il costo e confondere proteggere con trattenere.',
      },
    }],
    termos: [],
    verTambem: ['planeta-lua'],
    minutos: 1,
  },
  {
    id: 'signo-leao',
    tipo: 'verbete',
    categoria: 'signo',
    titulo: { 'pt-BR': 'Leão', 'en-US': 'Leo', 'es-ES': 'Leo', 'it-IT': 'Leone' },
    resumo: {
      'pt-BR': 'Fogo fixo: mantém a chama acesa e à vista.',
      'en-US': 'Fixed fire: keeps the flame lit and in sight.',
      'es-ES': 'Fuego fijo: mantiene la llama encendida y a la vista.',
      'it-IT': 'Fuoco fisso: tiene la fiamma accesa e in vista.',
    },
    blocos: [{
      tipo: 'figura',
      chave: 'elementos-e-modalidades',
      foco: 'leao',
      descricao: {
        'pt-BR': 'A tabela dos doze signos, quatro elementos por tres modalidades, com a celula de Leao acesa no cruzamento de fogo com fixo.',
        'en-US': 'The table of the twelve signs, four elements by three modes, with the Leo cell lit where fire meets fixed.',
        'es-ES': 'La tabla de los doce signos, cuatro elementos por tres modalidades, con la celda de Leo encendida en el cruce de fuego con fijo.',
        'it-IT': 'La tabella dei dodici segni, quattro elementi per tre modalita, con la cella di Leone accesa all incrocio di fuoco con fisso.',
      },
    }, {
      tipo: 'paragrafo',
      texto: {
        'pt-BR': 'Fogo que sustenta. O que passa por Leão ganha generosidade, vontade de criar algo que leve a própria marca e necessidade de ser reconhecido por isso. Regido pelo Sol.',
        'en-US': 'Fire that sustains. Whatever passes through Leo gains generosity, a wish to create something bearing its own mark and a need to be recognised for it. Ruled by the Sun.',
        'es-ES': 'Fuego que sostiene. Lo que pasa por Leo gana generosidad, ganas de crear algo con su propia marca y necesidad de ser reconocido por ello. Regido por el Sol.',
        'it-IT': 'Fuoco che sostiene. Cio che passa per il Leone guadagna generosita, voglia di creare qualcosa che porti il proprio segno e bisogno di essere riconosciuto per questo. Governato dal Sole.',
      },
    }, {
      tipo: 'destaque',
      texto: {
        'pt-BR': 'A força dele é dar sem medir. O custo é precisar que vejam.',
        'en-US': 'Its strength is giving without measuring. The cost is needing to be seen.',
        'es-ES': 'Su fuerza es dar sin medir. El costo es necesitar que lo vean.',
        'it-IT': 'La sua forza e dare senza misurare. Il costo e aver bisogno di essere visto.',
      },
    }],
    termos: [],
    verTambem: ['planeta-sol'],
    minutos: 1,
  },
  {
    id: 'signo-virgem',
    tipo: 'verbete',
    categoria: 'signo',
    titulo: { 'pt-BR': 'Virgem', 'en-US': 'Virgo', 'es-ES': 'Virgo', 'it-IT': 'Vergine' },
    resumo: {
      'pt-BR': 'Terra mutável: ajusta até funcionar.',
      'en-US': 'Mutable earth: adjusts until it works.',
      'es-ES': 'Tierra mutable: ajusta hasta que funcione.',
      'it-IT': 'Terra mobile: aggiusta finche funziona.',
    },
    blocos: [{
      tipo: 'figura',
      chave: 'elementos-e-modalidades',
      foco: 'virgem',
      descricao: {
        'pt-BR': 'A tabela dos doze signos, quatro elementos por tres modalidades, com a celula de Virgem acesa no cruzamento de terra com mutavel.',
        'en-US': 'The table of the twelve signs, four elements by three modes, with the Virgo cell lit where earth meets mutable.',
        'es-ES': 'La tabla de los doce signos, cuatro elementos por tres modalidades, con la celda de Virgo encendida en el cruce de tierra con mutable.',
        'it-IT': 'La tabella dei dodici segni, quattro elementi per tre modalita, con la cella di Vergine accesa all incrocio di terra con mobile.',
      },
    }, {
      tipo: 'paragrafo',
      texto: {
        'pt-BR': 'Terra que corrige. O que passa por Virgem ganha olho para o detalhe que não fecha, utilidade prática e uma régua interna que raramente dá o trabalho por pronto. Regido por Mercúrio.',
        'en-US': 'Earth that corrects. Whatever passes through Virgo gains an eye for the detail that does not add up, practical usefulness and an inner ruler that rarely calls the work finished. Ruled by Mercury.',
        'es-ES': 'Tierra que corrige. Lo que pasa por Virgo gana ojo para el detalle que no cierra, utilidad practica y una regla interna que rara vez da el trabajo por terminado. Regido por Mercurio.',
        'it-IT': 'Terra che corregge. Cio che passa per la Vergine guadagna occhio per il dettaglio che non torna, utilita pratica e un metro interno che di rado da il lavoro per finito. Governato da Mercurio.',
      },
    }, {
      tipo: 'destaque',
      texto: {
        'pt-BR': 'A força dele é fazer funcionar de verdade. O custo é a régua que nunca aprova.',
        'en-US': 'Its strength is making things actually work. The cost is the ruler that never approves.',
        'es-ES': 'Su fuerza es hacer que funcione de verdad. El costo es la regla que nunca aprueba.',
        'it-IT': 'La sua forza e far funzionare davvero. Il costo e il metro che non approva mai.',
      },
    }],
    termos: [],
    verTambem: ['planeta-mercurio'],
    minutos: 1,
  },
  {
    id: 'signo-libra',
    tipo: 'verbete',
    categoria: 'signo',
    titulo: { 'pt-BR': 'Libra', 'en-US': 'Libra', 'es-ES': 'Libra', 'it-IT': 'Bilancia' },
    resumo: {
      'pt-BR': 'Ar cardinal: começa pela relação.',
      'en-US': 'Cardinal air: starts from the relationship.',
      'es-ES': 'Aire cardinal: empieza por la relacion.',
      'it-IT': 'Aria cardinale: inizia dalla relazione.',
    },
    blocos: [{
      tipo: 'figura',
      chave: 'elementos-e-modalidades',
      foco: 'libra',
      descricao: {
        'pt-BR': 'A tabela dos doze signos, quatro elementos por tres modalidades, com a celula de Libra acesa no cruzamento de ar com cardinal.',
        'en-US': 'The table of the twelve signs, four elements by three modes, with the Libra cell lit where air meets cardinal.',
        'es-ES': 'La tabla de los doce signos, cuatro elementos por tres modalidades, con la celda de Libra encendida en el cruce de aire con cardinal.',
        'it-IT': 'La tabella dei dodici segni, quattro elementi per tre modalita, con la cella di Bilancia accesa all incrocio di aria con cardinale.',
      },
    }, {
      tipo: 'paragrafo',
      texto: {
        'pt-BR': 'Ar que inicia. O que passa por Libra ganha senso de medida, atenção ao outro lado e dificuldade de decidir sozinho o que afeta mais gente. Regido por Vênus.',
        'en-US': 'Air that initiates. Whatever passes through Libra gains a sense of measure, attention to the other side and difficulty deciding alone what affects more people. Ruled by Venus.',
        'es-ES': 'Aire que inicia. Lo que pasa por Libra gana sentido de la medida, atencion al otro lado y dificultad para decidir solo lo que afecta a mas gente. Regido por Venus.',
        'it-IT': 'Aria che inizia. Cio che passa per la Bilancia guadagna senso della misura, attenzione all altro lato e difficolta a decidere da solo cio che riguarda piu persone. Governato da Venere.',
      },
    }, {
      tipo: 'destaque',
      texto: {
        'pt-BR': 'A força dele é enxergar os dois lados. O custo é demorar a escolher um.',
        'en-US': 'Its strength is seeing both sides. The cost is taking long to pick one.',
        'es-ES': 'Su fuerza es ver los dos lados. El costo es tardar en elegir uno.',
        'it-IT': 'La sua forza e vedere entrambi i lati. Il costo e tardare a sceglierne uno.',
      },
    }],
    termos: [],
    verTambem: ['planeta-venus'],
    minutos: 1,
  },
  {
    id: 'signo-escorpiao',
    tipo: 'verbete',
    categoria: 'signo',
    titulo: { 'pt-BR': 'Escorpião', 'en-US': 'Scorpio', 'es-ES': 'Escorpio', 'it-IT': 'Scorpione' },
    resumo: {
      'pt-BR': 'Água fixa: não solta até chegar ao fundo.',
      'en-US': 'Fixed water: does not let go until it reaches the bottom.',
      'es-ES': 'Agua fija: no suelta hasta llegar al fondo.',
      'it-IT': 'Acqua fissa: non molla finche non tocca il fondo.',
    },
    blocos: [{
      tipo: 'figura',
      chave: 'elementos-e-modalidades',
      foco: 'escorpiao',
      descricao: {
        'pt-BR': 'A tabela dos doze signos, quatro elementos por tres modalidades, com a celula de Escorpiao acesa no cruzamento de agua com fixo.',
        'en-US': 'The table of the twelve signs, four elements by three modes, with the Scorpio cell lit where water meets fixed.',
        'es-ES': 'La tabla de los doce signos, cuatro elementos por tres modalidades, con la celda de Escorpio encendida en el cruce de agua con fijo.',
        'it-IT': 'La tabella dei dodici segni, quattro elementi per tre modalita, con la cella di Scorpione accesa all incrocio di acqua con fisso.',
      },
    }, {
      tipo: 'paragrafo',
      texto: {
        'pt-BR': 'Água que sustenta. O que passa por Escorpião ganha intensidade, faro para o que está escondido e desinteresse por qualquer versão superficial das coisas. Regido por Plutão, e antes dele por Marte.',
        'en-US': 'Water that sustains. Whatever passes through Scorpio gains intensity, a nose for what is hidden and no interest in any surface version of things. Ruled by Pluto, and before it by Mars.',
        'es-ES': 'Agua que sostiene. Lo que pasa por Escorpio gana intensidad, olfato para lo que esta escondido y desinteres por cualquier version superficial de las cosas. Regido por Pluton, y antes por Marte.',
        'it-IT': 'Acqua che sostiene. Cio che passa per lo Scorpione guadagna intensita, fiuto per cio che e nascosto e disinteresse per qualsiasi versione superficiale delle cose. Governato da Plutone, e prima da Marte.',
      },
    }, {
      tipo: 'destaque',
      texto: {
        'pt-BR': 'A força dele é não aceitar a superfície. O custo é não saber parar de cavar.',
        'en-US': 'Its strength is refusing the surface. The cost is not knowing when to stop digging.',
        'es-ES': 'Su fuerza es no aceptar la superficie. El costo es no saber dejar de cavar.',
        'it-IT': 'La sua forza e non accettare la superficie. Il costo e non saper smettere di scavare.',
      },
    }],
    termos: [],
    verTambem: ['planeta-plutao'],
    minutos: 1,
  },
  {
    id: 'signo-sagitario',
    tipo: 'verbete',
    categoria: 'signo',
    titulo: { 'pt-BR': 'Sagitário', 'en-US': 'Sagittarius', 'es-ES': 'Sagitario', 'it-IT': 'Sagittario' },
    resumo: {
      'pt-BR': 'Fogo mutável: espalha a chama e busca sentido.',
      'en-US': 'Mutable fire: spreads the flame and seeks meaning.',
      'es-ES': 'Fuego mutable: esparce la llama y busca sentido.',
      'it-IT': 'Fuoco mobile: diffonde la fiamma e cerca senso.',
    },
    blocos: [{
      tipo: 'figura',
      chave: 'elementos-e-modalidades',
      foco: 'sagitario',
      descricao: {
        'pt-BR': 'A tabela dos doze signos, quatro elementos por tres modalidades, com a celula de Sagitario acesa no cruzamento de fogo com mutavel.',
        'en-US': 'The table of the twelve signs, four elements by three modes, with the Sagittarius cell lit where fire meets mutable.',
        'es-ES': 'La tabla de los doce signos, cuatro elementos por tres modalidades, con la celda de Sagitario encendida en el cruce de fuego con mutable.',
        'it-IT': 'La tabella dei dodici segni, quattro elementi per tre modalita, con la cella di Sagittario accesa all incrocio di fuoco con mobile.',
      },
    }, {
      tipo: 'paragrafo',
      texto: {
        'pt-BR': 'Fogo que se espalha. O que passa por Sagitário ganha fé, vontade de ir longe — em viagem ou em ideia — e impaciência com limite que não entende. Regido por Júpiter.',
        'en-US': 'Fire that spreads. Whatever passes through Sagittarius gains faith, a wish to go far — in travel or in idea — and impatience with a limit it does not understand. Ruled by Jupiter.',
        'es-ES': 'Fuego que se esparce. Lo que pasa por Sagitario gana fe, ganas de ir lejos (en viaje o en idea) e impaciencia con el limite que no entiende. Regido por Jupiter.',
        'it-IT': 'Fuoco che si diffonde. Cio che passa per il Sagittario guadagna fede, voglia di andare lontano (in viaggio o in idea) e impazienza verso un limite che non capisce. Governato da Giove.',
      },
    }, {
      tipo: 'destaque',
      texto: {
        'pt-BR': 'A força dele é acreditar que vale a pena. O custo é prometer mais do que cabe.',
        'en-US': 'Its strength is believing it is worth it. The cost is promising more than fits.',
        'es-ES': 'Su fuerza es creer que vale la pena. El costo es prometer mas de lo que cabe.',
        'it-IT': 'La sua forza e credere che ne valga la pena. Il costo e promettere piu di quanto ci stia.',
      },
    }],
    termos: [],
    verTambem: ['planeta-jupiter'],
    minutos: 1,
  },
  {
    id: 'signo-capricornio',
    tipo: 'verbete',
    categoria: 'signo',
    titulo: { 'pt-BR': 'Capricórnio', 'en-US': 'Capricorn', 'es-ES': 'Capricornio', 'it-IT': 'Capricorno' },
    resumo: {
      'pt-BR': 'Terra cardinal: começa pela estrutura.',
      'en-US': 'Cardinal earth: starts from the structure.',
      'es-ES': 'Tierra cardinal: empieza por la estructura.',
      'it-IT': 'Terra cardinale: inizia dalla struttura.',
    },
    blocos: [{
      tipo: 'figura',
      chave: 'elementos-e-modalidades',
      foco: 'capricornio',
      descricao: {
        'pt-BR': 'A tabela dos doze signos, quatro elementos por tres modalidades, com a celula de Capricornio acesa no cruzamento de terra com cardinal.',
        'en-US': 'The table of the twelve signs, four elements by three modes, with the Capricorn cell lit where earth meets cardinal.',
        'es-ES': 'La tabla de los doce signos, cuatro elementos por tres modalidades, con la celda de Capricornio encendida en el cruce de tierra con cardinal.',
        'it-IT': 'La tabella dei dodici segni, quattro elementi per tre modalita, con la cella di Capricorno accesa all incrocio di terra con cardinale.',
      },
    }, {
      tipo: 'paragrafo',
      texto: {
        'pt-BR': 'Terra que inicia. O que passa por Capricórnio ganha disciplina, noção de prazo e disposição para carregar peso que os outros largaram. Regido por Saturno.',
        'en-US': 'Earth that initiates. Whatever passes through Capricorn gains discipline, a sense of deadline and a willingness to carry weight others put down. Ruled by Saturn.',
        'es-ES': 'Tierra que inicia. Lo que pasa por Capricornio gana disciplina, nocion de plazo y disposicion para cargar peso que otros soltaron. Regido por Saturno.',
        'it-IT': 'Terra che inizia. Cio che passa per il Capricorno guadagna disciplina, senso della scadenza e disponibilita a portare un peso che altri hanno lasciato. Governato da Saturno.',
      },
    }, {
      tipo: 'destaque',
      texto: {
        'pt-BR': 'A força dele é terminar o que começou. O custo é adiar a vida até terminar.',
        'en-US': 'Its strength is finishing what it started. The cost is postponing life until it is finished.',
        'es-ES': 'Su fuerza es terminar lo que empezo. El costo es aplazar la vida hasta terminar.',
        'it-IT': 'La sua forza e finire cio che ha iniziato. Il costo e rimandare la vita fino alla fine.',
      },
    }],
    termos: [],
    verTambem: ['planeta-saturno'],
    minutos: 1,
  },
  {
    id: 'signo-aquario',
    tipo: 'verbete',
    categoria: 'signo',
    titulo: { 'pt-BR': 'Aquário', 'en-US': 'Aquarius', 'es-ES': 'Acuario', 'it-IT': 'Acquario' },
    resumo: {
      'pt-BR': 'Ar fixo: mantém a ideia mesmo contra todos.',
      'en-US': 'Fixed air: holds the idea even against everyone.',
      'es-ES': 'Aire fijo: mantiene la idea aun contra todos.',
      'it-IT': 'Aria fissa: tiene l idea anche contro tutti.',
    },
    blocos: [{
      tipo: 'figura',
      chave: 'elementos-e-modalidades',
      foco: 'aquario',
      descricao: {
        'pt-BR': 'A tabela dos doze signos, quatro elementos por tres modalidades, com a celula de Aquario acesa no cruzamento de ar com fixo.',
        'en-US': 'The table of the twelve signs, four elements by three modes, with the Aquarius cell lit where air meets fixed.',
        'es-ES': 'La tabla de los doce signos, cuatro elementos por tres modalidades, con la celda de Acuario encendida en el cruce de aire con fijo.',
        'it-IT': 'La tabella dei dodici segni, quattro elementi per tre modalita, con la cella di Acquario accesa all incrocio di aria con fisso.',
      },
    }, {
      tipo: 'paragrafo',
      texto: {
        'pt-BR': 'Ar que sustenta. O que passa por Aquário ganha independência, lealdade a um princípio acima da conveniência e distância emocional suficiente para enxergar o conjunto. Regido por Urano, e antes dele por Saturno.',
        'en-US': 'Air that sustains. Whatever passes through Aquarius gains independence, loyalty to a principle over convenience and enough emotional distance to see the whole. Ruled by Uranus, and before it by Saturn.',
        'es-ES': 'Aire que sostiene. Lo que pasa por Acuario gana independencia, lealtad a un principio por encima de la conveniencia y distancia emocional suficiente para ver el conjunto. Regido por Urano, y antes por Saturno.',
        'it-IT': 'Aria che sostiene. Cio che passa per l Acquario guadagna indipendenza, lealta a un principio sopra la convenienza e distanza emotiva sufficiente a vedere l insieme. Governato da Urano, e prima da Saturno.',
      },
    }, {
      tipo: 'destaque',
      texto: {
        'pt-BR': 'A força dele é não precisar de aprovação. O custo é a frieza que isso às vezes cobra.',
        'en-US': 'Its strength is not needing approval. The cost is the coldness that sometimes charges.',
        'es-ES': 'Su fuerza es no necesitar aprobacion. El costo es la frialdad que eso a veces cobra.',
        'it-IT': 'La sua forza e non aver bisogno di approvazione. Il costo e la freddezza che questo a volte esige.',
      },
    }],
    termos: [],
    verTambem: ['planeta-urano'],
    minutos: 1,
  },
  {
    id: 'signo-peixes',
    tipo: 'verbete',
    categoria: 'signo',
    titulo: { 'pt-BR': 'Peixes', 'en-US': 'Pisces', 'es-ES': 'Piscis', 'it-IT': 'Pesci' },
    resumo: {
      'pt-BR': 'Água mutável: dissolve a borda entre as coisas.',
      'en-US': 'Mutable water: dissolves the edge between things.',
      'es-ES': 'Agua mutable: disuelve el borde entre las cosas.',
      'it-IT': 'Acqua mobile: dissolve il bordo tra le cose.',
    },
    blocos: [{
      tipo: 'figura',
      chave: 'elementos-e-modalidades',
      foco: 'peixes',
      descricao: {
        'pt-BR': 'A tabela dos doze signos, quatro elementos por tres modalidades, com a celula de Peixes acesa no cruzamento de agua com mutavel.',
        'en-US': 'The table of the twelve signs, four elements by three modes, with the Pisces cell lit where water meets mutable.',
        'es-ES': 'La tabla de los doce signos, cuatro elementos por tres modalidades, con la celda de Piscis encendida en el cruce de agua con mutable.',
        'it-IT': 'La tabella dei dodici segni, quattro elementi per tre modalita, con la cella di Pesci accesa all incrocio di acqua con mobile.',
      },
    }, {
      tipo: 'paragrafo',
      texto: {
        'pt-BR': 'Água que se adapta. O que passa por Peixes ganha sensibilidade, imaginação e uma porosidade que às vezes não distingue a própria emoção da do outro. Regido por Netuno, e antes dele por Júpiter.',
        'en-US': 'Water that adapts. Whatever passes through Pisces gains sensitivity, imagination and a porosity that sometimes cannot tell its own emotion from someone else. Ruled by Neptune, and before it by Jupiter.',
        'es-ES': 'Agua que se adapta. Lo que pasa por Piscis gana sensibilidad, imaginacion y una porosidad que a veces no distingue la propia emocion de la del otro. Regido por Neptuno, y antes por Jupiter.',
        'it-IT': 'Acqua che si adatta. Cio che passa per i Pesci guadagna sensibilita, immaginazione e una porosita che a volte non distingue la propria emozione da quella altrui. Governato da Nettuno, e prima da Giove.',
      },
    }, {
      tipo: 'destaque',
      texto: {
        'pt-BR': 'A força dele é sentir o que não foi dito. O custo é não achar a própria borda.',
        'en-US': 'Its strength is feeling what was not said. The cost is not finding its own edge.',
        'es-ES': 'Su fuerza es sentir lo que no fue dicho. El costo es no encontrar el propio borde.',
        'it-IT': 'La sua forza e sentire cio che non e stato detto. Il costo e non trovare il proprio bordo.',
      },
    }],
    termos: [],
    verTambem: ['planeta-netuno'],
    minutos: 1,
  },
]
