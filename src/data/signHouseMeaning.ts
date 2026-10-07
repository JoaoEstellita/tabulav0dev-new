/**
 * Significado dos 12 signos e das 12 casas, para o toque na roda.
 *
 * A roda já abria o planeta ao toque, mas signo e casa — que ocupam a maior
 * parte da área do desenho — não respondiam a nada. Quem não estuda astrologia
 * olha um anel cheio de símbolos sem nenhuma forma de perguntar "o que é isso?".
 *
 * Mesma régua do glossário: duas linhas, sem jargão, descrevendo o que a pessoa
 * reconhece em si ou na vida — não a mecânica celeste. es-ES sem tildes e it-IT
 * sem acentos, como o resto do projeto.
 */

export type Lang = 'pt-BR' | 'en-US' | 'es-ES' | 'it-IT'

export interface SignificadoRoda {
  /** Nome exibido no título do modal. */
  nome: string
  /** Três palavras que resumem — lidas antes do parágrafo. */
  palavras: string
  /** O parágrafo, em linguagem comum. */
  texto: string
  /**
   * Ficha técnica: elemento, modalidade e regente — só para signo.
   *
   * Fica DEPOIS do parágrafo e em tipo menor, de propósito. Quem chegou agora lê
   * a explicação e ignora esta linha; quem estuda astrologia procura exatamente
   * ela e não encontrava em lugar nenhum. Serve aos dois sem obrigar um a
   * engolir o conteúdo do outro.
   */
  ficha?: string
}

const SIGNOS: Record<string, Record<Lang, SignificadoRoda>> = {
  aries: {
    'pt-BR': { nome: 'Áries', palavras: 'início · coragem · impulso', texto: 'A energia de começar. Áries age antes de pensar demais, encara o novo de peito aberto e não tem paciência com rodeios. Onde ele está no seu mapa, você avança sozinho.', ficha: 'Fogo · Cardinal · regido por Marte' },
    'en-US': { nome: 'Aries', palavras: 'beginning · courage · drive', texto: 'The energy of starting. Aries acts before overthinking, faces the new head-on and has no patience for detours. Where it sits in your chart, you move on your own.', ficha: 'Fire · Cardinal · ruled by Mars' },
    'es-ES': { nome: 'Aries', palavras: 'inicio · coraje · impulso', texto: 'La energia de empezar. Aries actua antes de pensar demasiado, enfrenta lo nuevo de frente y no tiene paciencia para rodeos. Donde esta en tu mapa, avanzas solo.', ficha: 'Fuego · Cardinal · regido por Marte' },
    'it-IT': { nome: 'Ariete', palavras: 'inizio · coraggio · slancio', texto: 'L energia di cominciare. Ariete agisce prima di pensarci troppo, affronta il nuovo a viso aperto e non ha pazienza per i giri di parole. Dove sta nel tuo tema, avanzi da solo.', ficha: 'Fuoco · Cardinale · governato da Marte' },
  },
  taurus: {
    'pt-BR': { nome: 'Touro', palavras: 'estabilidade · prazer · constância', texto: 'A energia de construir devagar e manter. Touro quer segurança, conforto e o que dura. Onde ele está, você não tem pressa — e o que faz, faz para ficar.', ficha: 'Terra · Fixo · regido por Vênus' },
    'en-US': { nome: 'Taurus', palavras: 'stability · pleasure · constancy', texto: 'The energy of building slowly and keeping. Taurus wants security, comfort and what lasts. Where it sits, you are in no hurry — and what you make, you make to stay.', ficha: 'Earth · Fixed · ruled by Venus' },
    'es-ES': { nome: 'Tauro', palavras: 'estabilidad · placer · constancia', texto: 'La energia de construir despacio y mantener. Tauro quiere seguridad, comodidad y lo que dura. Donde esta, no tienes prisa — y lo que haces, lo haces para quedarse.', ficha: 'Tierra · Fijo · regido por Venus' },
    'it-IT': { nome: 'Toro', palavras: 'stabilita · piacere · costanza', texto: 'L energia di costruire piano e mantenere. Toro vuole sicurezza, comfort e cio che dura. Dove sta, non hai fretta — e cio che fai, lo fai per restare.', ficha: 'Terra · Fisso · governato da Venere' },
  },
  gemini: {
    'pt-BR': { nome: 'Gêmeos', palavras: 'curiosidade · troca · versatilidade', texto: 'A energia de perguntar e conectar. Gêmeos quer saber de tudo um pouco, conversa com qualquer um e muda de ideia sem culpa. Onde ele está, você aprende circulando.', ficha: 'Ar · Mutável · regido por Mercúrio' },
    'en-US': { nome: 'Gemini', palavras: 'curiosity · exchange · versatility', texto: 'The energy of asking and connecting. Gemini wants a bit of everything, talks to anyone and changes its mind without guilt. Where it sits, you learn by circulating.', ficha: 'Air · Mutable · ruled by Mercury' },
    'es-ES': { nome: 'Geminis', palavras: 'curiosidad · intercambio · versatilidad', texto: 'La energia de preguntar y conectar. Geminis quiere saber un poco de todo, conversa con cualquiera y cambia de idea sin culpa. Donde esta, aprendes circulando.', ficha: 'Aire · Mutable · regido por Mercurio' },
    'it-IT': { nome: 'Gemelli', palavras: 'curiosita · scambio · versatilita', texto: 'L energia di chiedere e collegare. Gemelli vuole sapere un po di tutto, parla con chiunque e cambia idea senza colpa. Dove sta, impari circolando.', ficha: 'Aria · Mobile · governato da Mercurio' },
  },
  cancer: {
    'pt-BR': { nome: 'Câncer', palavras: 'cuidado · memória · pertencimento', texto: 'A energia de acolher e proteger. Câncer sente antes de entender, guarda o que viveu e cria laços de família onde passa. Onde ele está, você se envolve de verdade.', ficha: 'Água · Cardinal · regido pela Lua' },
    'en-US': { nome: 'Cancer', palavras: 'care · memory · belonging', texto: 'The energy of sheltering and protecting. Cancer feels before it understands, keeps what it lived and makes family wherever it goes. Where it sits, you get truly involved.', ficha: 'Water · Cardinal · ruled by the Moon' },
    'es-ES': { nome: 'Cancer', palavras: 'cuidado · memoria · pertenencia', texto: 'La energia de acoger y proteger. Cancer siente antes de entender, guarda lo que vivio y crea lazos de familia donde pasa. Donde esta, te involucras de verdad.', ficha: 'Agua · Cardinal · regido por la Luna' },
    'it-IT': { nome: 'Cancro', palavras: 'cura · memoria · appartenenza', texto: 'L energia di accogliere e proteggere. Cancro sente prima di capire, custodisce cio che ha vissuto e crea legami di famiglia dove passa. Dove sta, ti coinvolgi davvero.', ficha: 'Acqua · Cardinale · governato dalla Luna' },
  },
  leo: {
    'pt-BR': { nome: 'Leão', palavras: 'presença · criação · generosidade', texto: 'A energia de aparecer e dar. Leão quer ser visto pelo que tem de melhor, cria com o coração e não economiza afeto. Onde ele está, você brilha sem pedir licença.', ficha: 'Fogo · Fixo · regido pelo Sol' },
    'en-US': { nome: 'Leo', palavras: 'presence · creation · generosity', texto: 'The energy of showing up and giving. Leo wants to be seen at its best, creates with the heart and does not ration affection. Where it sits, you shine without asking permission.', ficha: 'Fire · Fixed · ruled by the Sun' },
    'es-ES': { nome: 'Leo', palavras: 'presencia · creacion · generosidad', texto: 'La energia de aparecer y dar. Leo quiere ser visto por lo mejor que tiene, crea con el corazon y no escatima afecto. Donde esta, brillas sin pedir permiso.', ficha: 'Fuego · Fijo · regido por el Sol' },
    'it-IT': { nome: 'Leone', palavras: 'presenza · creazione · generosita', texto: 'L energia di farsi vedere e dare. Leone vuole essere visto per il suo meglio, crea col cuore e non risparmia affetto. Dove sta, brilli senza chiedere permesso.', ficha: 'Fuoco · Fisso · governato dal Sole' },
  },
  virgo: {
    'pt-BR': { nome: 'Virgem', palavras: 'cuidado prático · método · melhoria', texto: 'A energia de aperfeiçoar e servir. Virgem repara no detalhe que ninguém viu e quer deixar as coisas funcionando. Onde ele está, você caprichar é o jeito de cuidar.', ficha: 'Terra · Mutável · regido por Mercúrio' },
    'en-US': { nome: 'Virgo', palavras: 'practical care · method · refinement', texto: 'The energy of refining and serving. Virgo notices the detail nobody saw and wants things working. Where it sits, doing it well is your way of caring.', ficha: 'Earth · Mutable · ruled by Mercury' },
    'es-ES': { nome: 'Virgo', palavras: 'cuidado practico · metodo · mejora', texto: 'La energia de perfeccionar y servir. Virgo repara en el detalle que nadie vio y quiere dejar las cosas funcionando. Donde esta, esmerarte es tu forma de cuidar.', ficha: 'Tierra · Mutable · regido por Mercurio' },
    'it-IT': { nome: 'Vergine', palavras: 'cura pratica · metodo · miglioramento', texto: 'L energia di perfezionare e servire. Vergine nota il dettaglio che nessuno ha visto e vuole le cose funzionanti. Dove sta, farlo bene e il tuo modo di prenderti cura.', ficha: 'Terra · Mobile · governato da Mercurio' },
  },
  libra: {
    'pt-BR': { nome: 'Libra', palavras: 'relação · equilíbrio · beleza', texto: 'A energia de se encontrar no outro. Libra pesa os dois lados, busca acordo e não suporta ambiente feio ou áspero. Onde ele está, você pensa a dois.', ficha: 'Ar · Cardinal · regido por Vênus' },
    'en-US': { nome: 'Libra', palavras: 'relationship · balance · beauty', texto: 'The energy of finding yourself in the other. Libra weighs both sides, seeks agreement and cannot stand a harsh or ugly setting. Where it sits, you think in pairs.', ficha: 'Air · Cardinal · ruled by Venus' },
    'es-ES': { nome: 'Libra', palavras: 'relacion · equilibrio · belleza', texto: 'La energia de encontrarse en el otro. Libra pesa los dos lados, busca acuerdo y no soporta un ambiente feo o aspero. Donde esta, piensas de a dos.', ficha: 'Aire · Cardinal · regido por Venus' },
    'it-IT': { nome: 'Bilancia', palavras: 'relazione · equilibrio · bellezza', texto: 'L energia di trovarsi nell altro. Bilancia pesa le due parti, cerca accordo e non sopporta un ambiente brutto o aspro. Dove sta, pensi in due.', ficha: 'Aria · Cardinale · governato da Venere' },
  },
  scorpio: {
    'pt-BR': { nome: 'Escorpião', palavras: 'intensidade · verdade · transformação', texto: 'A energia de ir ao fundo. Escorpião não se contenta com a superfície, enxerga o que está escondido e não teme o que dói. Onde ele está, você vive em intensidade total.', ficha: 'Água · Fixo · regido por Marte' },
    'en-US': { nome: 'Scorpio', palavras: 'intensity · truth · transformation', texto: 'The energy of going deep. Scorpio is not satisfied with the surface, sees what is hidden and does not fear what hurts. Where it sits, you live at full intensity.', ficha: 'Water · Fixed · ruled by Mars' },
    'es-ES': { nome: 'Escorpio', palavras: 'intensidad · verdad · transformacion', texto: 'La energia de ir al fondo. Escorpio no se contenta con la superficie, ve lo que esta oculto y no teme lo que duele. Donde esta, vives en intensidad total.', ficha: 'Agua · Fijo · regido por Marte' },
    'it-IT': { nome: 'Scorpione', palavras: 'intensita · verita · trasformazione', texto: 'L energia di andare a fondo. Scorpione non si accontenta della superficie, vede cio che e nascosto e non teme cio che fa male. Dove sta, vivi a intensita piena.', ficha: 'Acqua · Fisso · governato da Marte' },
  },
  sagittarius: {
    'pt-BR': { nome: 'Sagitário', palavras: 'expansão · sentido · liberdade', texto: 'A energia de ir além. Sagitário quer entender o porquê das coisas, viajar — de corpo ou de ideia — e não aceita gaiola. Onde ele está, você precisa de horizonte.', ficha: 'Fogo · Mutável · regido por Júpiter' },
    'en-US': { nome: 'Sagittarius', palavras: 'expansion · meaning · freedom', texto: 'The energy of going further. Sagittarius wants to understand why things are, to travel — in body or in thought — and takes no cage. Where it sits, you need horizon.', ficha: 'Fire · Mutable · ruled by Jupiter' },
    'es-ES': { nome: 'Sagitario', palavras: 'expansion · sentido · libertad', texto: 'La energia de ir mas alla. Sagitario quiere entender el porque de las cosas, viajar — de cuerpo o de idea — y no acepta jaula. Donde esta, necesitas horizonte.', ficha: 'Fuego · Mutable · regido por Jupiter' },
    'it-IT': { nome: 'Sagittario', palavras: 'espansione · senso · liberta', texto: 'L energia di andare oltre. Sagittario vuole capire il perche delle cose, viaggiare — col corpo o col pensiero — e non accetta gabbie. Dove sta, ti serve orizzonte.', ficha: 'Fuoco · Mobile · governato da Giove' },
  },
  capricorn: {
    'pt-BR': { nome: 'Capricórnio', palavras: 'responsabilidade · construção · tempo', texto: 'A energia de assumir e sustentar. Capricórnio pensa a longo prazo, aguenta o que precisa ser aguentado e constrói degrau por degrau. Onde ele está, você amadurece cedo.', ficha: 'Terra · Cardinal · regido por Saturno' },
    'en-US': { nome: 'Capricorn', palavras: 'responsibility · building · time', texto: 'The energy of taking on and holding. Capricorn thinks long term, bears what must be borne and builds step by step. Where it sits, you mature early.', ficha: 'Earth · Cardinal · ruled by Saturn' },
    'es-ES': { nome: 'Capricornio', palavras: 'responsabilidad · construccion · tiempo', texto: 'La energia de asumir y sostener. Capricornio piensa a largo plazo, aguanta lo que hay que aguantar y construye escalon por escalon. Donde esta, maduras temprano.', ficha: 'Tierra · Cardinal · regido por Saturno' },
    'it-IT': { nome: 'Capricorno', palavras: 'responsabilita · costruzione · tempo', texto: 'L energia di assumersi e sostenere. Capricorno pensa a lungo termine, regge cio che va retto e costruisce gradino per gradino. Dove sta, maturi presto.', ficha: 'Terra · Cardinale · governato da Saturno' },
  },
  aquarius: {
    'pt-BR': { nome: 'Aquário', palavras: 'originalidade · coletivo · ruptura', texto: 'A energia de pensar diferente. Aquário questiona o que todo mundo aceita, se importa com o grupo e não cabe em molde. Onde ele está, você foge do óbvio.', ficha: 'Ar · Fixo · regido por Saturno' },
    'en-US': { nome: 'Aquarius', palavras: 'originality · collective · rupture', texto: 'The energy of thinking differently. Aquarius questions what everyone accepts, cares about the group and fits no mould. Where it sits, you escape the obvious.', ficha: 'Air · Fixed · ruled by Saturn' },
    'es-ES': { nome: 'Acuario', palavras: 'originalidad · colectivo · ruptura', texto: 'La energia de pensar distinto. Acuario cuestiona lo que todos aceptan, se preocupa por el grupo y no cabe en molde. Donde esta, huyes de lo obvio.', ficha: 'Aire · Fijo · regido por Saturno' },
    'it-IT': { nome: 'Acquario', palavras: 'originalita · collettivo · rottura', texto: 'L energia di pensare diversamente. Acquario mette in dubbio cio che tutti accettano, tiene al gruppo e non sta in uno stampo. Dove sta, sfuggi all ovvio.', ficha: 'Aria · Fisso · governato da Saturno' },
  },
  pisces: {
    'pt-BR': { nome: 'Peixes', palavras: 'sensibilidade · entrega · imaginação', texto: 'A energia de dissolver fronteiras. Peixes sente o que está no ar, se comove fácil e vive entre o real e o sonhado. Onde ele está, você não separa você do mundo.', ficha: 'Água · Mutável · regido por Júpiter' },
    'en-US': { nome: 'Pisces', palavras: 'sensitivity · surrender · imagination', texto: 'The energy of dissolving borders. Pisces feels what is in the air, is easily moved and lives between the real and the dreamed. Where it sits, you do not separate yourself from the world.', ficha: 'Water · Mutable · ruled by Jupiter' },
    'es-ES': { nome: 'Piscis', palavras: 'sensibilidad · entrega · imaginacion', texto: 'La energia de disolver fronteras. Piscis siente lo que esta en el aire, se conmueve facil y vive entre lo real y lo sonnado. Donde esta, no separas tu del mundo.', ficha: 'Agua · Mutable · regido por Jupiter' },
    'it-IT': { nome: 'Pesci', palavras: 'sensibilita · abbandono · immaginazione', texto: 'L energia di dissolvere i confini. Pesci sente cio che e nell aria, si commuove facilmente e vive tra il reale e il sognato. Dove sta, non separi te stesso dal mondo.', ficha: 'Acqua · Mobile · governato da Giove' },
  },
}

const CASAS: Record<number, Record<Lang, SignificadoRoda>> = {
  1: {
    'pt-BR': { nome: 'Casa 1', palavras: 'você · corpo · primeira impressão', texto: 'Como você chega e como os outros te veem antes de te conhecerem. É o seu jeito de aparecer no mundo, o corpo e o começo de tudo.' },
    'en-US': { nome: 'House 1', palavras: 'you · body · first impression', texto: 'How you arrive and how others see you before knowing you. Your way of showing up in the world, the body, and the start of everything.' },
    'es-ES': { nome: 'Casa 1', palavras: 'tu · cuerpo · primera impresion', texto: 'Como llegas y como te ven los demas antes de conocerte. Tu forma de aparecer en el mundo, el cuerpo y el comienzo de todo.' },
    'it-IT': { nome: 'Casa 1', palavras: 'tu · corpo · prima impressione', texto: 'Come arrivi e come ti vedono gli altri prima di conoscerti. Il tuo modo di presentarti al mondo, il corpo e l inizio di tutto.' },
  },
  2: {
    'pt-BR': { nome: 'Casa 2', palavras: 'dinheiro · valor · segurança', texto: 'O que você tem e o que você acha que vale. Dinheiro, bens, talentos que rendem — e a sensação de estar seguro ou não.' },
    'en-US': { nome: 'House 2', palavras: 'money · worth · security', texto: 'What you have and what you believe you are worth. Money, belongings, talents that pay — and whether you feel safe or not.' },
    'es-ES': { nome: 'Casa 2', palavras: 'dinero · valor · seguridad', texto: 'Lo que tienes y lo que crees que vales. Dinero, bienes, talentos que rinden — y la sensacion de estar seguro o no.' },
    'it-IT': { nome: 'Casa 2', palavras: 'denaro · valore · sicurezza', texto: 'Cio che hai e quanto pensi di valere. Denaro, beni, talenti che rendono — e la sensazione di essere al sicuro o no.' },
  },
  3: {
    'pt-BR': { nome: 'Casa 3', palavras: 'conversa · estudo · irmãos', texto: 'Como você fala, aprende e circula no dia a dia. Irmãos, vizinhos, trajetos curtos e tudo que se troca em palavra.' },
    'en-US': { nome: 'House 3', palavras: 'talk · study · siblings', texto: 'How you speak, learn and move around day to day. Siblings, neighbours, short trips and everything exchanged in words.' },
    'es-ES': { nome: 'Casa 3', palavras: 'conversacion · estudio · hermanos', texto: 'Como hablas, aprendes y circulas en el dia a dia. Hermanos, vecinos, trayectos cortos y todo lo que se intercambia en palabras.' },
    'it-IT': { nome: 'Casa 3', palavras: 'conversazione · studio · fratelli', texto: 'Come parli, impari e ti muovi ogni giorno. Fratelli, vicini, tragitti brevi e tutto cio che si scambia a parole.' },
  },
  4: {
    'pt-BR': { nome: 'Casa 4', palavras: 'casa · família · raiz', texto: 'De onde você vem e onde se recolhe. Pai e mãe, a casa em que cresceu, o que é base — e o lugar onde você pode baixar a guarda.' },
    'en-US': { nome: 'House 4', palavras: 'home · family · roots', texto: 'Where you come from and where you retreat. Parents, the house you grew up in, what is foundation — and where you can drop your guard.' },
    'es-ES': { nome: 'Casa 4', palavras: 'casa · familia · raiz', texto: 'De donde vienes y donde te recoges. Padre y madre, la casa en que creciste, lo que es base — y el lugar donde puedes bajar la guardia.' },
    'it-IT': { nome: 'Casa 4', palavras: 'casa · famiglia · radice', texto: 'Da dove vieni e dove ti ritiri. Padre e madre, la casa in cui sei cresciuto, cio che e base — e il luogo dove puoi abbassare la guardia.' },
  },
  5: {
    'pt-BR': { nome: 'Casa 5', palavras: 'prazer · criação · filhos', texto: 'O que você faz por gosto, não por obrigação. Romance, arte, brincadeira, filhos — e tudo que te faz sentir vivo.' },
    'en-US': { nome: 'House 5', palavras: 'pleasure · creation · children', texto: 'What you do for the joy of it, not from duty. Romance, art, play, children — and everything that makes you feel alive.' },
    'es-ES': { nome: 'Casa 5', palavras: 'placer · creacion · hijos', texto: 'Lo que haces por gusto, no por obligacion. Romance, arte, juego, hijos — y todo lo que te hace sentir vivo.' },
    'it-IT': { nome: 'Casa 5', palavras: 'piacere · creazione · figli', texto: 'Cio che fai per piacere, non per dovere. Romanticismo, arte, gioco, figli — e tutto cio che ti fa sentire vivo.' },
  },
  6: {
    'pt-BR': { nome: 'Casa 6', palavras: 'rotina · trabalho · saúde', texto: 'O dia comum: o que você faz toda semana, como cuida do corpo e como organiza (ou não) a vida prática.' },
    'en-US': { nome: 'House 6', palavras: 'routine · work · health', texto: 'The ordinary day: what you do every week, how you care for your body and how you organise — or not — practical life.' },
    'es-ES': { nome: 'Casa 6', palavras: 'rutina · trabajo · salud', texto: 'El dia comun: lo que haces cada semana, como cuidas el cuerpo y como organizas (o no) la vida practica.' },
    'it-IT': { nome: 'Casa 6', palavras: 'routine · lavoro · salute', texto: 'Il giorno comune: cio che fai ogni settimana, come curi il corpo e come organizzi (o no) la vita pratica.' },
  },
  7: {
    'pt-BR': { nome: 'Casa 7', palavras: 'parceria · casamento · o outro', texto: 'Quem você escolhe para estar junto — no amor e no trabalho. O tipo de pessoa que te atrai e o que você espera de uma relação.' },
    'en-US': { nome: 'House 7', palavras: 'partnership · marriage · the other', texto: 'Who you choose to be with — in love and at work. The kind of person who draws you and what you expect from a relationship.' },
    'es-ES': { nome: 'Casa 7', palavras: 'pareja · matrimonio · el otro', texto: 'A quien eliges para estar junto — en el amor y en el trabajo. El tipo de persona que te atrae y lo que esperas de una relacion.' },
    'it-IT': { nome: 'Casa 7', palavras: 'coppia · matrimonio · l altro', texto: 'Chi scegli per stare insieme — in amore e nel lavoro. Il tipo di persona che ti attrae e cosa ti aspetti da una relazione.' },
  },
  8: {
    'pt-BR': { nome: 'Casa 8', palavras: 'intimidade · crise · o que se divide', texto: 'O que você só vive junto com alguém: dinheiro compartilhado, sexo, perdas e renascimentos. A casa das viradas profundas.' },
    'en-US': { nome: 'House 8', palavras: 'intimacy · crisis · what is shared', texto: 'What you only live with someone else: shared money, sex, losses and rebirths. The house of deep turning points.' },
    'es-ES': { nome: 'Casa 8', palavras: 'intimidad · crisis · lo que se comparte', texto: 'Lo que solo vives junto a alguien: dinero compartido, sexo, perdidas y renacimientos. La casa de los giros profundos.' },
    'it-IT': { nome: 'Casa 8', palavras: 'intimita · crisi · cio che si divide', texto: 'Cio che vivi solo insieme a qualcuno: denaro condiviso, sesso, perdite e rinascite. La casa delle svolte profonde.' },
  },
  9: {
    'pt-BR': { nome: 'Casa 9', palavras: 'viagem · fé · estudo longo', texto: 'O que amplia o seu mundo: viagens longas, outra cultura, faculdade, religião ou filosofia. Onde você busca sentido maior.' },
    'en-US': { nome: 'House 9', palavras: 'travel · faith · higher study', texto: 'What widens your world: long journeys, another culture, university, religion or philosophy. Where you look for larger meaning.' },
    'es-ES': { nome: 'Casa 9', palavras: 'viaje · fe · estudio largo', texto: 'Lo que amplia tu mundo: viajes largos, otra cultura, universidad, religion o filosofia. Donde buscas sentido mayor.' },
    'it-IT': { nome: 'Casa 9', palavras: 'viaggio · fede · studio lungo', texto: 'Cio che allarga il tuo mondo: viaggi lunghi, altra cultura, universita, religione o filosofia. Dove cerchi un senso piu grande.' },
  },
  10: {
    'pt-BR': { nome: 'Casa 10', palavras: 'carreira · reputação · lugar no mundo', texto: 'O que você constrói para fora e pelo que quer ser reconhecido. Profissão, posição e a imagem pública que te segue.' },
    'en-US': { nome: 'House 10', palavras: 'career · reputation · place in the world', texto: 'What you build outwardly and what you want to be known for. Profession, standing and the public image that follows you.' },
    'es-ES': { nome: 'Casa 10', palavras: 'carrera · reputacion · lugar en el mundo', texto: 'Lo que construyes hacia afuera y aquello por lo que quieres ser reconocido. Profesion, posicion y la imagen publica que te sigue.' },
    'it-IT': { nome: 'Casa 10', palavras: 'carriera · reputazione · posto nel mondo', texto: 'Cio che costruisci verso l esterno e per cosa vuoi essere riconosciuto. Professione, posizione e l immagine pubblica che ti segue.' },
  },
  11: {
    'pt-BR': { nome: 'Casa 11', palavras: 'amigos · grupos · projetos', texto: 'As pessoas que você escolhe e as causas que abraça. Amizades, turmas, redes — e o futuro que você quer construir junto.' },
    'en-US': { nome: 'House 11', palavras: 'friends · groups · projects', texto: 'The people you choose and the causes you take up. Friendships, circles, networks — and the future you want to build together.' },
    'es-ES': { nome: 'Casa 11', palavras: 'amigos · grupos · proyectos', texto: 'Las personas que eliges y las causas que abrazas. Amistades, grupos, redes — y el futuro que quieres construir junto.' },
    'it-IT': { nome: 'Casa 11', palavras: 'amici · gruppi · progetti', texto: 'Le persone che scegli e le cause che abbracci. Amicizie, gruppi, reti — e il futuro che vuoi costruire insieme.' },
  },
  12: {
    'pt-BR': { nome: 'Casa 12', palavras: 'silêncio · inconsciente · entrega', texto: 'O que fica fora do seu alcance consciente: sonhos, medos antigos, o que você esconde até de si. Também é onde você se recolhe para se refazer.' },
    'en-US': { nome: 'House 12', palavras: 'silence · unconscious · surrender', texto: 'What sits beyond your conscious reach: dreams, old fears, what you hide even from yourself. It is also where you retreat to remake yourself.' },
    'es-ES': { nome: 'Casa 12', palavras: 'silencio · inconsciente · entrega', texto: 'Lo que queda fuera de tu alcance consciente: suenos, miedos antiguos, lo que escondes hasta de ti. Tambien es donde te recoges para rehacerte.' },
    'it-IT': { nome: 'Casa 12', palavras: 'silenzio · inconscio · abbandono', texto: 'Cio che resta fuori dalla tua portata cosciente: sogni, paure antiche, cio che nascondi persino a te. E anche dove ti ritiri per rifarti.' },
  },
}

/** Aliases de signo que podem chegar dos dados (pt/en/es/it) para a chave canônica. */
const ALIAS_SIGNO: Record<string, string> = {
  aries: 'aries', ariete: 'aries',
  touro: 'taurus', taurus: 'taurus', tauro: 'taurus', toro: 'taurus',
  gemeos: 'gemini', gemini: 'gemini', geminis: 'gemini', gemelli: 'gemini',
  cancer: 'cancer', cancro: 'cancer',
  leao: 'leo', leo: 'leo', leone: 'leo',
  virgem: 'virgo', virgo: 'virgo', vergine: 'virgo',
  libra: 'libra', bilancia: 'libra',
  escorpiao: 'scorpio', scorpio: 'scorpio', escorpio: 'scorpio', scorpione: 'scorpio',
  sagitario: 'sagittarius', sagittarius: 'sagittarius', sagittario: 'sagittarius',
  capricornio: 'capricorn', capricorn: 'capricorn', capricorno: 'capricorn',
  aquario: 'aquarius', aquarius: 'aquarius', acuario: 'aquarius', acquario: 'aquarius',
  peixes: 'pisces', pisces: 'pisces', piscis: 'pisces', pesci: 'pisces',
}

const chave = (v: string) =>
  String(v || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, '').trim()

/** Significado do signo no idioma pedido, ou null se não reconhecido. */
export function getSignMeaning(signo: string, language: string): SignificadoRoda | null {
  const k = ALIAS_SIGNO[chave(signo)]
  const entrada = k ? SIGNOS[k] : null
  if (!entrada) return null
  return entrada[(language as Lang)] || entrada['pt-BR']
}

/** Significado da casa (1–12) no idioma pedido, ou null fora da faixa. */
export function getHouseMeaning(numero: number, language: string): SignificadoRoda | null {
  const entrada = CASAS[Number(numero)]
  if (!entrada) return null
  return entrada[(language as Lang)] || entrada['pt-BR']
}

export const SIGNOS_DISPONIVEIS = Object.keys(SIGNOS)
