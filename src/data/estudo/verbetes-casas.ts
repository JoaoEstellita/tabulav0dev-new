import type { Unidade } from './tipos'

/**
 * AS DOZE CASAS — os setores da vida.
 *
 * ⚠️ CADA VERBETE MOSTRA A RODA INTEIRA com a sua casa acesa, e nunca a casa
 * sozinha. Ver a 7 acesa DENTRO do círculo ensina onde ela fica — de frente
 * para a 1, acima do horizonte — e um desenho isolado não ensinaria nada
 * disso. É a mesma figura nos doze, com `foco` diferente: doze desenhos
 * quase iguais seriam doze lugares para divergirem no primeiro ajuste.
 *
 * ⚠️ AS CASAS DEPENDEM DA HORA DE NASCIMENTO e giram uma a cada duas horas.
 * A lição 6 avisa disso; os verbetes não repetem o aviso para não virarem
 * doze cópias da mesma ressalva.
 *
 * ⚠️ GERADOS POR SCRIPT (`scratchpad/casas.py`) porque são estruturalmente
 * idênticos e só o conteúdo muda. Escrever os doze à mão seria copiar a
 * mesma forma doze vezes.
 */
export const VERBETES_CASAS: Unidade[] = [
  {
    id: 'casa-01',
    tipo: 'verbete',
    categoria: 'casa',
    titulo: {
      'pt-BR': 'Casa 1',
      'en-US': 'House 1',
      'es-ES': 'Casa 1',
      'it-IT': 'Casa 1',
    },
    resumo: {
      'pt-BR': 'O corpo e a primeira impressão.',
      'en-US': 'The body and the first impression.',
      'es-ES': 'El cuerpo y la primera impresion.',
      'it-IT': 'Il corpo e la prima impressione.',
    },
    blocos: [{
      tipo: 'figura',
      chave: 'as-doze-casas',
      foco: '1',
      descricao: {
        'pt-BR': 'A roda das doze casas, com a casa 1 acesa no seu setor. A linha horizontal que corta a roda e o horizonte do nascimento.',
        'en-US': 'The wheel of the twelve houses, with house 1 lit in its sector. The horizontal line crossing the wheel is the horizon of birth.',
        'es-ES': 'La rueda de las doce casas, con la casa 1 encendida en su sector. La linea horizontal que corta la rueda es el horizonte del nacimiento.',
        'it-IT': 'La ruota delle dodici case, con la casa 1 accesa nel suo settore. La linea orizzontale che taglia la ruota e l orizzonte della nascita.',
      },
    }, {
      tipo: 'paragrafo',
      texto: {
        'pt-BR': 'Começa no Ascendente, no horizonte do seu nascimento. É a porta por onde você entra num ambiente: o corpo, o jeito, o que os outros notam antes de você dizer qualquer coisa. Não é a sua essência — é a embalagem que a essência usa para circular.',
        'en-US': 'It starts at the Ascendant, at the horizon of your birth. It is the door you enter a room by: the body, the manner, what others notice before you say anything. It is not your essence — it is the packaging the essence travels in.',
        'es-ES': 'Empieza en el Ascendente, en el horizonte de tu nacimiento. Es la puerta por la que entras en un ambiente: el cuerpo, el modo, lo que los demas notan antes de que digas nada. No es tu esencia: es el envoltorio que la esencia usa para circular.',
        'it-IT': 'Inizia all Ascendente, all orizzonte della tua nascita. E la porta da cui entri in un ambiente: il corpo, il modo, cio che gli altri notano prima che tu dica qualcosa. Non e la tua essenza: e l involucro che l essenza usa per circolare.',
      },
    }, {
      tipo: 'destaque',
      texto: {
        'pt-BR': 'É onde a roda começa. Tudo o que vem depois se conta a partir daqui.',
        'en-US': 'It is where the wheel begins. Everything after is counted from here.',
        'es-ES': 'Es donde empieza la rueda. Todo lo que viene despues se cuenta desde aqui.',
        'it-IT': 'E dove la ruota inizia. Tutto cio che segue si conta da qui.',
      },
    }],
    termos: [],
    verTambem: ['licao-06-casa-onde'],
    minutos: 1,
  },
  {
    id: 'casa-02',
    tipo: 'verbete',
    categoria: 'casa',
    titulo: {
      'pt-BR': 'Casa 2',
      'en-US': 'House 2',
      'es-ES': 'Casa 2',
      'it-IT': 'Casa 2',
    },
    resumo: {
      'pt-BR': 'O que é seu, e o que você acha que vale.',
      'en-US': 'What is yours, and what you count as worth.',
      'es-ES': 'Lo que es tuyo, y lo que consideras que vale.',
      'it-IT': 'Cio che e tuo, e cio che ritieni valga.',
    },
    blocos: [{
      tipo: 'figura',
      chave: 'as-doze-casas',
      foco: '2',
      descricao: {
        'pt-BR': 'A roda das doze casas, com a casa 2 acesa no seu setor. A linha horizontal que corta a roda e o horizonte do nascimento.',
        'en-US': 'The wheel of the twelve houses, with house 2 lit in its sector. The horizontal line crossing the wheel is the horizon of birth.',
        'es-ES': 'La rueda de las doce casas, con la casa 2 encendida en su sector. La linea horizontal que corta la rueda es el horizonte del nacimiento.',
        'it-IT': 'La ruota delle dodici case, con la casa 2 accesa nel suo settore. La linea orizzontale che taglia la ruota e l orizzonte della nascita.',
      },
    }, {
      tipo: 'paragrafo',
      texto: {
        'pt-BR': 'Dinheiro, bens, talento que se pode usar — e, antes de tudo, o critério de valor. A casa 2 não pergunta quanto você tem, pergunta o que você considera que merece ser tido.',
        'en-US': 'Money, possessions, usable talent — and, before all that, the criterion of worth. House 2 does not ask how much you have, it asks what you count as worth having.',
        'es-ES': 'Dinero, bienes, talento que se puede usar y, antes que nada, el criterio de valor. La casa 2 no pregunta cuanto tienes, pregunta que consideras que merece ser tenido.',
        'it-IT': 'Denaro, beni, talento utilizzabile e, prima di tutto, il criterio di valore. La casa 2 non chiede quanto hai, chiede cosa ritieni valga la pena avere.',
      },
    }, {
      tipo: 'destaque',
      texto: {
        'pt-BR': 'Autoestima e patrimônio moram na mesma casa, e não por acaso.',
        'en-US': 'Self-worth and net worth share a house, and not by accident.',
        'es-ES': 'La autoestima y el patrimonio viven en la misma casa, y no por casualidad.',
        'it-IT': 'Autostima e patrimonio abitano la stessa casa, e non per caso.',
      },
    }],
    termos: [],
    verTambem: ['licao-06-casa-onde'],
    minutos: 1,
  },
  {
    id: 'casa-03',
    tipo: 'verbete',
    categoria: 'casa',
    titulo: {
      'pt-BR': 'Casa 3',
      'en-US': 'House 3',
      'es-ES': 'Casa 3',
      'it-IT': 'Casa 3',
    },
    resumo: {
      'pt-BR': 'A conversa, o trajeto curto, o irmão.',
      'en-US': 'Conversation, the short trip, the sibling.',
      'es-ES': 'La conversacion, el trayecto corto, el hermano.',
      'it-IT': 'La conversazione, il tragitto breve, il fratello.',
    },
    blocos: [{
      tipo: 'figura',
      chave: 'as-doze-casas',
      foco: '3',
      descricao: {
        'pt-BR': 'A roda das doze casas, com a casa 3 acesa no seu setor. A linha horizontal que corta a roda e o horizonte do nascimento.',
        'en-US': 'The wheel of the twelve houses, with house 3 lit in its sector. The horizontal line crossing the wheel is the horizon of birth.',
        'es-ES': 'La rueda de las doce casas, con la casa 3 encendida en su sector. La linea horizontal que corta la rueda es el horizonte del nacimiento.',
        'it-IT': 'La ruota delle dodici case, con la casa 3 accesa nel suo settore. La linea orizzontale che taglia la ruota e l orizzonte della nascita.',
      },
    }, {
      tipo: 'paragrafo',
      texto: {
        'pt-BR': 'O ambiente imediato: como você fala e escreve, o bairro, a escola, os irmãos, o aprendizado que se faz por contato e não por estudo formal. É a casa da informação que circula perto.',
        'en-US': 'The immediate surroundings: how you speak and write, the neighbourhood, the school, siblings, the learning done by contact rather than formal study. It is the house of information circulating close by.',
        'es-ES': 'El ambiente inmediato: como hablas y escribes, el barrio, la escuela, los hermanos, el aprendizaje que se hace por contacto y no por estudio formal. Es la casa de la informacion que circula cerca.',
        'it-IT': 'L ambiente immediato: come parli e scrivi, il quartiere, la scuola, i fratelli, l apprendimento che si fa per contatto e non per studio formale. E la casa dell informazione che circola vicino.',
      },
    }, {
      tipo: 'destaque',
      texto: {
        'pt-BR': 'O que você sabe sem ter estudado veio daqui.',
        'en-US': 'What you know without having studied it came from here.',
        'es-ES': 'Lo que sabes sin haber estudiado vino de aqui.',
        'it-IT': 'Cio che sai senza aver studiato viene da qui.',
      },
    }],
    termos: [],
    verTambem: ['licao-06-casa-onde'],
    minutos: 1,
  },
  {
    id: 'casa-04',
    tipo: 'verbete',
    categoria: 'casa',
    titulo: {
      'pt-BR': 'Casa 4',
      'en-US': 'House 4',
      'es-ES': 'Casa 4',
      'it-IT': 'Casa 4',
    },
    resumo: {
      'pt-BR': 'A origem, a família, o chão de dentro.',
      'en-US': 'The origin, the family, the inner ground.',
      'es-ES': 'El origen, la familia, el suelo de dentro.',
      'it-IT': 'L origine, la famiglia, il suolo interiore.',
    },
    blocos: [{
      tipo: 'figura',
      chave: 'as-doze-casas',
      foco: '4',
      descricao: {
        'pt-BR': 'A roda das doze casas, com a casa 4 acesa no seu setor. A linha horizontal que corta a roda e o horizonte do nascimento.',
        'en-US': 'The wheel of the twelve houses, with house 4 lit in its sector. The horizontal line crossing the wheel is the horizon of birth.',
        'es-ES': 'La rueda de las doce casas, con la casa 4 encendida en su sector. La linea horizontal que corta la rueda es el horizonte del nacimiento.',
        'it-IT': 'La ruota delle dodici case, con la casa 4 accesa nel suo settore. La linea orizzontale che taglia la ruota e l orizzonte della nascita.',
      },
    }, {
      tipo: 'paragrafo',
      texto: {
        'pt-BR': 'O ponto mais fundo da roda: de onde você veio, a casa em que cresceu, o que ficou de herança emocional. É também onde você se recolhe quando o mundo pesa — a base de que o resto depende.',
        'en-US': 'The deepest point of the wheel: where you came from, the home you grew up in, what remained as emotional inheritance. It is also where you retreat when the world weighs — the base the rest depends on.',
        'es-ES': 'El punto mas hondo de la rueda: de donde viniste, la casa en que creciste, lo que quedo de herencia emocional. Es tambien donde te recoges cuando el mundo pesa: la base de la que depende el resto.',
        'it-IT': 'Il punto piu profondo della ruota: da dove vieni, la casa in cui sei cresciuto, cio che e rimasto come eredita emotiva. E anche dove ti ritiri quando il mondo pesa: la base da cui dipende il resto.',
      },
    }, {
      tipo: 'destaque',
      texto: {
        'pt-BR': 'Ninguém constrói acima do que não sustenta embaixo.',
        'en-US': 'No one builds above what does not hold underneath.',
        'es-ES': 'Nadie construye encima de lo que no sostiene debajo.',
        'it-IT': 'Nessuno costruisce sopra cio che non regge sotto.',
      },
    }],
    termos: [],
    verTambem: ['planeta-lua'],
    minutos: 1,
  },
  {
    id: 'casa-05',
    tipo: 'verbete',
    categoria: 'casa',
    titulo: {
      'pt-BR': 'Casa 5',
      'en-US': 'House 5',
      'es-ES': 'Casa 5',
      'it-IT': 'Casa 5',
    },
    resumo: {
      'pt-BR': 'O que sai de você e leva a sua marca.',
      'en-US': 'What comes out of you bearing your mark.',
      'es-ES': 'Lo que sale de ti y lleva tu marca.',
      'it-IT': 'Cio che esce da te e porta il tuo segno.',
    },
    blocos: [{
      tipo: 'figura',
      chave: 'as-doze-casas',
      foco: '5',
      descricao: {
        'pt-BR': 'A roda das doze casas, com a casa 5 acesa no seu setor. A linha horizontal que corta a roda e o horizonte do nascimento.',
        'en-US': 'The wheel of the twelve houses, with house 5 lit in its sector. The horizontal line crossing the wheel is the horizon of birth.',
        'es-ES': 'La rueda de las doce casas, con la casa 5 encendida en su sector. La linea horizontal que corta la rueda es el horizonte del nacimiento.',
        'it-IT': 'La ruota delle dodici case, con la casa 5 accesa nel suo settore. La linea orizzontale che taglia la ruota e l orizzonte della nascita.',
      },
    }, {
      tipo: 'paragrafo',
      texto: {
        'pt-BR': 'Criação em todo sentido: arte, filhos, jogo, romance, o prazer de fazer algo porque sim. É a casa onde você aparece sem pedir licença — e por isso também a do risco de só fazer o que tem plateia.',
        'en-US': 'Creation in every sense: art, children, play, romance, the pleasure of making something just because. It is the house where you show up without asking permission — and so also the one risking doing only what has an audience.',
        'es-ES': 'Creacion en todo sentido: arte, hijos, juego, romance, el placer de hacer algo porque si. Es la casa donde apareces sin pedir permiso, y por eso tambien la del riesgo de hacer solo lo que tiene publico.',
        'it-IT': 'Creazione in ogni senso: arte, figli, gioco, romanticismo, il piacere di fare qualcosa perche si. E la casa dove ti mostri senza chiedere permesso, e percio anche quella del rischio di fare solo cio che ha pubblico.',
      },
    }, {
      tipo: 'destaque',
      texto: {
        'pt-BR': 'Aqui a pergunta não é se é útil. É se é seu.',
        'en-US': 'Here the question is not whether it is useful. It is whether it is yours.',
        'es-ES': 'Aqui la pregunta no es si es util. Es si es tuyo.',
        'it-IT': 'Qui la domanda non e se sia utile. E se sia tuo.',
      },
    }],
    termos: [],
    verTambem: ['planeta-sol'],
    minutos: 1,
  },
  {
    id: 'casa-06',
    tipo: 'verbete',
    categoria: 'casa',
    titulo: {
      'pt-BR': 'Casa 6',
      'en-US': 'House 6',
      'es-ES': 'Casa 6',
      'it-IT': 'Casa 6',
    },
    resumo: {
      'pt-BR': 'A rotina, o ofício, o corpo que trabalha.',
      'en-US': 'Routine, the craft, the working body.',
      'es-ES': 'La rutina, el oficio, el cuerpo que trabaja.',
      'it-IT': 'La routine, il mestiere, il corpo che lavora.',
    },
    blocos: [{
      tipo: 'figura',
      chave: 'as-doze-casas',
      foco: '6',
      descricao: {
        'pt-BR': 'A roda das doze casas, com a casa 6 acesa no seu setor. A linha horizontal que corta a roda e o horizonte do nascimento.',
        'en-US': 'The wheel of the twelve houses, with house 6 lit in its sector. The horizontal line crossing the wheel is the horizon of birth.',
        'es-ES': 'La rueda de las doce casas, con la casa 6 encendida en su sector. La linea horizontal que corta la rueda es el horizonte del nacimiento.',
        'it-IT': 'La ruota delle dodici case, con la casa 6 accesa nel suo settore. La linea orizzontale che taglia la ruota e l orizzonte della nascita.',
      },
    }, {
      tipo: 'paragrafo',
      texto: {
        'pt-BR': 'O dia comum: o trabalho que se faz, a saúde, os hábitos, o que você repete sem pensar. Não é a carreira — é a tarefa. A casa 6 trata do que sustenta tudo o mais funcionando por baixo.',
        'en-US': 'The ordinary day: the work done, health, habits, what you repeat without thinking. It is not the career — it is the task. House 6 is about what keeps everything else running underneath.',
        'es-ES': 'El dia comun: el trabajo que se hace, la salud, los habitos, lo que repites sin pensar. No es la carrera: es la tarea. La casa 6 trata de lo que sostiene todo lo demas funcionando por debajo.',
        'it-IT': 'Il giorno comune: il lavoro che si fa, la salute, le abitudini, cio che ripeti senza pensare. Non e la carriera: e il compito. La casa 6 riguarda cio che tiene tutto il resto in funzione sotto.',
      },
    }, {
      tipo: 'destaque',
      texto: {
        'pt-BR': 'O que você faz todo dia constrói mais do que o que você planeja.',
        'en-US': 'What you do every day builds more than what you plan.',
        'es-ES': 'Lo que haces cada dia construye mas que lo que planeas.',
        'it-IT': 'Cio che fai ogni giorno costruisce piu di cio che pianifichi.',
      },
    }],
    termos: [],
    verTambem: ['licao-06-casa-onde'],
    minutos: 1,
  },
  {
    id: 'casa-07',
    tipo: 'verbete',
    categoria: 'casa',
    titulo: {
      'pt-BR': 'Casa 7',
      'en-US': 'House 7',
      'es-ES': 'Casa 7',
      'it-IT': 'Casa 7',
    },
    resumo: {
      'pt-BR': 'O outro: parceria, sociedade, e também o adversário.',
      'en-US': 'The other: partnership, alliance, and the adversary too.',
      'es-ES': 'El otro: pareja, sociedad, y tambien el adversario.',
      'it-IT': 'L altro: partnership, societa, e anche l avversario.',
    },
    blocos: [{
      tipo: 'figura',
      chave: 'as-doze-casas',
      foco: '7',
      descricao: {
        'pt-BR': 'A roda das doze casas, com a casa 7 acesa no seu setor. A linha horizontal que corta a roda e o horizonte do nascimento.',
        'en-US': 'The wheel of the twelve houses, with house 7 lit in its sector. The horizontal line crossing the wheel is the horizon of birth.',
        'es-ES': 'La rueda de las doce casas, con la casa 7 encendida en su sector. La linea horizontal que corta la rueda es el horizonte del nacimiento.',
        'it-IT': 'La ruota delle dodici case, con la casa 7 accesa nel suo settore. La linea orizzontale che taglia la ruota e l orizzonte della nascita.',
      },
    }, {
      tipo: 'paragrafo',
      texto: {
        'pt-BR': 'Exatamente de frente para a casa 1: onde você deixa de estar sozinho. Casamento, sociedade, contrato — e o conflito aberto, que também é um encontro. O que você procura no outro costuma ser o que não reconhece em si.',
        'en-US': 'Exactly opposite house 1: where you stop being alone. Marriage, partnership, contract — and open conflict, which is also an encounter. What you look for in another is usually what you do not recognise in yourself.',
        'es-ES': 'Exactamente enfrente de la casa 1: donde dejas de estar solo. Matrimonio, sociedad, contrato, y el conflicto abierto, que tambien es un encuentro. Lo que buscas en el otro suele ser lo que no reconoces en ti.',
        'it-IT': 'Esattamente di fronte alla casa 1: dove smetti di essere solo. Matrimonio, societa, contratto, e il conflitto aperto, che e anch esso un incontro. Cio che cerchi nell altro di solito e cio che non riconosci in te.',
      },
    }, {
      tipo: 'destaque',
      texto: {
        'pt-BR': 'A casa 7 fica de frente para a 1 porque o outro é o espelho do eu.',
        'en-US': 'House 7 faces house 1 because the other is the mirror of the self.',
        'es-ES': 'La casa 7 esta enfrente de la 1 porque el otro es el espejo del yo.',
        'it-IT': 'La casa 7 sta di fronte alla 1 perche l altro e lo specchio dell io.',
      },
    }],
    termos: [],
    verTambem: ['licao-06-casa-onde'],
    minutos: 1,
  },
  {
    id: 'casa-08',
    tipo: 'verbete',
    categoria: 'casa',
    titulo: {
      'pt-BR': 'Casa 8',
      'en-US': 'House 8',
      'es-ES': 'Casa 8',
      'it-IT': 'Casa 8',
    },
    resumo: {
      'pt-BR': 'O que termina, o que é partilhado, o que não se controla.',
      'en-US': 'What ends, what is shared, what cannot be controlled.',
      'es-ES': 'Lo que termina, lo que se comparte, lo que no se controla.',
      'it-IT': 'Cio che finisce, cio che e condiviso, cio che non si controlla.',
    },
    blocos: [{
      tipo: 'figura',
      chave: 'as-doze-casas',
      foco: '8',
      descricao: {
        'pt-BR': 'A roda das doze casas, com a casa 8 acesa no seu setor. A linha horizontal que corta a roda e o horizonte do nascimento.',
        'en-US': 'The wheel of the twelve houses, with house 8 lit in its sector. The horizontal line crossing the wheel is the horizon of birth.',
        'es-ES': 'La rueda de las doce casas, con la casa 8 encendida en su sector. La linea horizontal que corta la rueda es el horizonte del nacimiento.',
        'it-IT': 'La ruota delle dodici case, con la casa 8 accesa nel suo settore. La linea orizzontale che taglia la ruota e l orizzonte della nascita.',
      },
    }, {
      tipo: 'paragrafo',
      texto: {
        'pt-BR': 'A casa das passagens: perdas, heranças, dinheiro de outros, intimidade profunda, e tudo que exige entregar o controle. Tem fama pesada porque trata do que não se negocia — e é onde a transformação de verdade acontece.',
        'en-US': 'The house of passages: losses, inheritances, other people money, deep intimacy, and everything demanding you hand over control. It has a heavy reputation because it deals with the non-negotiable — and it is where real transformation happens.',
        'es-ES': 'La casa de los pasajes: perdidas, herencias, dinero de otros, intimidad profunda, y todo lo que exige entregar el control. Tiene fama pesada porque trata de lo que no se negocia, y es donde ocurre la transformacion de verdad.',
        'it-IT': 'La casa dei passaggi: perdite, eredita, denaro altrui, intimita profonda, e tutto cio che chiede di cedere il controllo. Ha una fama pesante perche tratta del non negoziabile, ed e dove accade la trasformazione vera.',
      },
    }, {
      tipo: 'destaque',
      texto: {
        'pt-BR': 'Ninguém atravessa a casa 8 igual ao que entrou. É esse o assunto dela.',
        'en-US': 'No one crosses house 8 the same as they entered. That is its subject.',
        'es-ES': 'Nadie atraviesa la casa 8 igual que entro. Ese es su asunto.',
        'it-IT': 'Nessuno attraversa la casa 8 uguale a com e entrato. E questo il suo argomento.',
      },
    }],
    termos: [],
    verTambem: ['planeta-plutao'],
    minutos: 1,
  },
  {
    id: 'casa-09',
    tipo: 'verbete',
    categoria: 'casa',
    titulo: {
      'pt-BR': 'Casa 9',
      'en-US': 'House 9',
      'es-ES': 'Casa 9',
      'it-IT': 'Casa 9',
    },
    resumo: {
      'pt-BR': 'O sentido, o longe, o que amplia a visão.',
      'en-US': 'Meaning, the far away, what widens the view.',
      'es-ES': 'El sentido, lo lejano, lo que amplia la vision.',
      'it-IT': 'Il senso, il lontano, cio che allarga la vista.',
    },
    blocos: [{
      tipo: 'figura',
      chave: 'as-doze-casas',
      foco: '9',
      descricao: {
        'pt-BR': 'A roda das doze casas, com a casa 9 acesa no seu setor. A linha horizontal que corta a roda e o horizonte do nascimento.',
        'en-US': 'The wheel of the twelve houses, with house 9 lit in its sector. The horizontal line crossing the wheel is the horizon of birth.',
        'es-ES': 'La rueda de las doce casas, con la casa 9 encendida en su sector. La linea horizontal que corta la rueda es el horizonte del nacimiento.',
        'it-IT': 'La ruota delle dodici case, con la casa 9 accesa nel suo settore. La linea orizzontale che taglia la ruota e l orizzonte della nascita.',
      },
    }, {
      tipo: 'paragrafo',
      texto: {
        'pt-BR': 'Estudo superior, viagem longa, religião, filosofia, o estrangeiro. Tudo o que tira você do ambiente conhecido e obriga a rever o que parecia óbvio. Se a casa 3 é o bairro, a 9 é o mundo.',
        'en-US': 'Higher study, long travel, religion, philosophy, the foreign. Everything that takes you out of the known surroundings and forces a review of what seemed obvious. If house 3 is the neighbourhood, house 9 is the world.',
        'es-ES': 'Estudio superior, viaje largo, religion, filosofia, lo extranjero. Todo lo que te saca del ambiente conocido y obliga a revisar lo que parecia obvio. Si la casa 3 es el barrio, la 9 es el mundo.',
        'it-IT': 'Studio superiore, viaggio lungo, religione, filosofia, lo straniero. Tutto cio che ti toglie dall ambiente noto e obbliga a rivedere cio che sembrava ovvio. Se la casa 3 e il quartiere, la 9 e il mondo.',
      },
    }, {
      tipo: 'destaque',
      texto: {
        'pt-BR': 'Só se vê o próprio lugar depois de sair dele.',
        'en-US': 'You only see your own place after leaving it.',
        'es-ES': 'Solo se ve el propio lugar despues de salir de el.',
        'it-IT': 'Si vede il proprio posto solo dopo esserne usciti.',
      },
    }],
    termos: [],
    verTambem: ['licao-06-casa-onde'],
    minutos: 1,
  },
  {
    id: 'casa-10',
    tipo: 'verbete',
    categoria: 'casa',
    titulo: {
      'pt-BR': 'Casa 10',
      'en-US': 'House 10',
      'es-ES': 'Casa 10',
      'it-IT': 'Casa 10',
    },
    resumo: {
      'pt-BR': 'A obra, a carreira, o que te reconhecem por fazer.',
      'en-US': 'The work, the career, what you are known for doing.',
      'es-ES': 'La obra, la carrera, lo que te reconocen por hacer.',
      'it-IT': 'L opera, la carriera, cio per cui ti riconoscono.',
    },
    blocos: [{
      tipo: 'figura',
      chave: 'as-doze-casas',
      foco: '10',
      descricao: {
        'pt-BR': 'A roda das doze casas, com a casa 10 acesa no seu setor. A linha horizontal que corta a roda e o horizonte do nascimento.',
        'en-US': 'The wheel of the twelve houses, with house 10 lit in its sector. The horizontal line crossing the wheel is the horizon of birth.',
        'es-ES': 'La rueda de las doce casas, con la casa 10 encendida en su sector. La linea horizontal que corta la rueda es el horizonte del nacimiento.',
        'it-IT': 'La ruota delle dodici case, con la casa 10 accesa nel suo settore. La linea orizzontale che taglia la ruota e l orizzonte della nascita.',
      },
    }, {
      tipo: 'paragrafo',
      texto: {
        'pt-BR': 'O ponto mais alto da roda, oposto à casa 4: o que você constrói à vista de todos. Não é só emprego — é o lugar que você ocupa no mundo e a responsabilidade que vem junto.',
        'en-US': 'The highest point of the wheel, opposite house 4: what you build in plain sight. It is not just a job — it is the place you hold in the world and the responsibility that comes with it.',
        'es-ES': 'El punto mas alto de la rueda, opuesto a la casa 4: lo que construyes a la vista de todos. No es solo empleo: es el lugar que ocupas en el mundo y la responsabilidad que viene con el.',
        'it-IT': 'Il punto piu alto della ruota, opposto alla casa 4: cio che costruisci sotto gli occhi di tutti. Non e solo lavoro: e il posto che occupi nel mondo e la responsabilita che ne deriva.',
      },
    }, {
      tipo: 'destaque',
      texto: {
        'pt-BR': 'A casa 10 só sustenta o que a casa 4 segurou por baixo.',
        'en-US': 'House 10 only holds up what house 4 held underneath.',
        'es-ES': 'La casa 10 solo sostiene lo que la casa 4 sujeto por debajo.',
        'it-IT': 'La casa 10 regge solo cio che la casa 4 ha tenuto sotto.',
      },
    }],
    termos: [],
    verTambem: ['planeta-saturno'],
    minutos: 1,
  },
  {
    id: 'casa-11',
    tipo: 'verbete',
    categoria: 'casa',
    titulo: {
      'pt-BR': 'Casa 11',
      'en-US': 'House 11',
      'es-ES': 'Casa 11',
      'it-IT': 'Casa 11',
    },
    resumo: {
      'pt-BR': 'O grupo, a causa, o futuro que se quer.',
      'en-US': 'The group, the cause, the future one wants.',
      'es-ES': 'El grupo, la causa, el futuro que se quiere.',
      'it-IT': 'Il gruppo, la causa, il futuro che si vuole.',
    },
    blocos: [{
      tipo: 'figura',
      chave: 'as-doze-casas',
      foco: '11',
      descricao: {
        'pt-BR': 'A roda das doze casas, com a casa 11 acesa no seu setor. A linha horizontal que corta a roda e o horizonte do nascimento.',
        'en-US': 'The wheel of the twelve houses, with house 11 lit in its sector. The horizontal line crossing the wheel is the horizon of birth.',
        'es-ES': 'La rueda de las doce casas, con la casa 11 encendida en su sector. La linea horizontal que corta la rueda es el horizonte del nacimiento.',
        'it-IT': 'La ruota delle dodici case, con la casa 11 accesa nel suo settore. La linea orizzontale che taglia la ruota e l orizzonte della nascita.',
      },
    }, {
      tipo: 'paragrafo',
      texto: {
        'pt-BR': 'Amizades, redes, movimentos, projetos coletivos. É a casa do que você quer construir com outros e do que espera que venha depois — o lugar onde a obra pessoal vira parte de algo maior.',
        'en-US': 'Friendships, networks, movements, collective projects. It is the house of what you want to build with others and what you hope comes next — where personal work becomes part of something larger.',
        'es-ES': 'Amistades, redes, movimientos, proyectos colectivos. Es la casa de lo que quieres construir con otros y de lo que esperas que venga despues: donde la obra personal pasa a ser parte de algo mayor.',
        'it-IT': 'Amicizie, reti, movimenti, progetti collettivi. E la casa di cio che vuoi costruire con altri e di cio che speri venga dopo: dove l opera personale diventa parte di qualcosa di piu grande.',
      },
    }, {
      tipo: 'destaque',
      texto: {
        'pt-BR': 'Depois de ter uma obra, a pergunta vira: para quem.',
        'en-US': 'Once there is work, the question becomes: for whom.',
        'es-ES': 'Despues de tener una obra, la pregunta pasa a ser: para quien.',
        'it-IT': 'Dopo aver fatto un opera, la domanda diventa: per chi.',
      },
    }],
    termos: [],
    verTambem: ['licao-06-casa-onde'],
    minutos: 1,
  },
  {
    id: 'casa-12',
    tipo: 'verbete',
    categoria: 'casa',
    titulo: {
      'pt-BR': 'Casa 12',
      'en-US': 'House 12',
      'es-ES': 'Casa 12',
      'it-IT': 'Casa 12',
    },
    resumo: {
      'pt-BR': 'O que fica fora da vista — inclusive de você.',
      'en-US': 'What stays out of sight — yours included.',
      'es-ES': 'Lo que queda fuera de la vista, incluida la tuya.',
      'it-IT': 'Cio che resta fuori dalla vista, anche dalla tua.',
    },
    blocos: [{
      tipo: 'figura',
      chave: 'as-doze-casas',
      foco: '12',
      descricao: {
        'pt-BR': 'A roda das doze casas, com a casa 12 acesa no seu setor. A linha horizontal que corta a roda e o horizonte do nascimento.',
        'en-US': 'The wheel of the twelve houses, with house 12 lit in its sector. The horizontal line crossing the wheel is the horizon of birth.',
        'es-ES': 'La rueda de las doce casas, con la casa 12 encendida en su sector. La linea horizontal que corta la rueda es el horizonte del nacimiento.',
        'it-IT': 'La ruota delle dodici case, con la casa 12 accesa nel suo settore. La linea orizzontale che taglia la ruota e l orizzonte della nascita.',
      },
    }, {
      tipo: 'paragrafo',
      texto: {
        'pt-BR': 'A última casa, antes de a roda recomeçar: o inconsciente, o que se faz em silêncio, o retiro, e também o que você esconde de si mesmo. Tem fama difícil, mas é a casa do descanso e do que se elabora longe dos olhos.',
        'en-US': 'The last house, before the wheel restarts: the unconscious, what is done in silence, retreat, and also what you hide from yourself. It has a difficult reputation, but it is the house of rest and of what gets worked out away from eyes.',
        'es-ES': 'La ultima casa, antes de que la rueda vuelva a empezar: el inconsciente, lo que se hace en silencio, el retiro, y tambien lo que escondes de ti mismo. Tiene fama dificil, pero es la casa del descanso y de lo que se elabora lejos de los ojos.',
        'it-IT': 'L ultima casa, prima che la ruota ricominci: l inconscio, cio che si fa in silenzio, il ritiro, e anche cio che nascondi a te stesso. Ha una fama difficile, ma e la casa del riposo e di cio che si elabora lontano dagli occhi.',
      },
    }, {
      tipo: 'destaque',
      texto: {
        'pt-BR': 'Nem tudo que não aparece está perdido. Parte está sendo preparada.',
        'en-US': 'Not everything unseen is lost. Some of it is being prepared.',
        'es-ES': 'No todo lo que no aparece esta perdido. Parte se esta preparando.',
        'it-IT': 'Non tutto cio che non si vede e perduto. Parte si sta preparando.',
      },
    }],
    termos: [],
    verTambem: ['planeta-netuno'],
    minutos: 1,
  },
]
