// Catálogo i18n: Quíron nas Casas Natais — en-US, es-ES, it-IT
// es-ES: sem caracteres acentuados
// it-IT: sem caracteres acentuados E sem apóstrofes

import type { AppLanguage } from '../i18n/appI18n'

export const CHIRON_IN_HOUSE_I18N_OVERRIDES: Partial<Record<AppLanguage, Record<string, string>>> = {
  'en-US': {
    'chiron:house|1':
      'Chiron in the 1st House often creates someone who champions others with ease, while struggling to offer that same care to themselves. There is a natural gift for counseling and perceiving what others need, frequently before recognizing their own. The path of integration involves extending to oneself the same generosity freely given to the world.',

    'chiron:house|2':
      'Chiron in the 2nd House can create an excellent financial advisor for others, while their own resources remain in disarray or scarcity. The wound here is connected to a sense of worthiness — there may be an unconscious belief that security and abundance are not deserved. Recognizing personal value beyond what one owns or produces is key to integration.',

    'chiron:house|3':
      'Chiron in the 3rd House often brings a sense of not being heard or understood, possibly rooted in childhood experiences. Paradoxically, there is a talent for teaching others to communicate better than the person manages to do for themselves. Recognizing that past pain need not be replayed in the present is the first step toward releasing the communicative gift this placement carries.',

    'chiron:house|4':
      'Chiron in the 4th House points to a wound around home, family of origin, and the sense of belonging. There may be difficulty feeling at home anywhere, or a history with one or both parents marked by emotional or physical absence. This placement can generate a special ability to help others with domestic and family matters, while personal challenges in that area persist.',

    'chiron:house|5':
      'Chiron in the 5th House indicates a wound in the area of love, creativity, and pleasure. There is often a capacity to help others in romantic relationships or creative development far greater than the person applies to themselves. This placement can also indicate someone who coaches others to extraordinary performances, surpassing personal limits in the process.',

    'chiron:house|6':
      'Chiron in the 6th House creates a health or wellness expert who frequently tends to others while neglecting their own habits. There may be a tendency toward irregular eating patterns or a complicated relationship with the body and daily routine. The challenge is to practice what is preached — applying to one own day-to-day the same care offered so competently to others.',

    'chiron:house|7':
      'Chiron in the 7th House projects the wound onto partnerships, whether romantic or professional. There is often a capacity to advise others on relationships with genuine wisdom, while the person own intimate bonds face recurring challenges. The healing path involves recognizing the pattern sought to be repeated through the other and meeting it consciously.',

    'chiron:house|8':
      'Chiron in the 8th House points to a wound around intimacy, transformation, and shared resources. There is a talent for facilitating emotional healing and transformation in others, while the person may resist their own process of deep renewal. This placement can also indicate a tendency to depend on others resources or to support others financially at the expense of oneself.',

    'chiron:house|9':
      'Chiron in the 9th House indicates a wound around the search for meaning, expansion, and beliefs. There may be someone who inspires everyone around them to travel, study, and grow, while feeling blocked from doing the same. The wound may manifest as an intense search for philosophy or religion as an attempt to heal inner pain that resists purely intellectual solutions.',

    'chiron:house|10':
      'Chiron in the 10th House places the wound in the career and public life. There may be a rejection of personal ambition or responsibility, possibly because parental pressure was excessive or because they unconsciously undermined the person success. This placement can also create someone who tends to everyone in the organization while their own professional needs remain secondary.',

    'chiron:house|11':
      'Chiron in the 11th House indicates a wound in friendships, groups, and hopes for the future. There may be difficulty maintaining lasting friendships, or a tendency to attract people who take advantage of generosity. Alternatively, there may be an intense search for belonging in groups or collective causes as a way of compensating for a deep fear of loneliness.',

    'chiron:house|12':
      'Chiron in the 12th House creates a strong compulsion to care for the vulnerable and excluded, often at the expense of personal well-being. There may be a tendency toward exhaustion, as the person places themselves constantly in service to others without clear limits. Learning to rest, to receive care, and to recognize personal needs is the central path of integration for this placement.',
  },

  'es-ES': {
    'chiron:house|1':
      'Quiron en Casa 1 suele crear a alguien que defiende a los demas con facilidad, pero que encuentra dificultad en aplicarse ese mismo cuidado. Hay un talento natural para el asesoramiento y para percibir lo que otros necesitan, con frecuencia antes de reconocer las propias necesidades. El camino de integracion pasa por ofrecer a si mismo la misma generosidad que se ofrece al mundo.',

    'chiron:house|2':
      'Quiron en Casa 2 puede crear un excelente asesor financiero para los demas, mientras los propios recursos permanecen en desorden o escasez. La herida aqui esta ligada al sentido de merecimiento: hay una creencia, muchas veces inconsciente, de que no se merece seguridad o abundancia. Reconocer el valor personal mas alla de lo que se posee o produce es la clave para la integracion.',

    'chiron:house|3':
      'Quiron en Casa 3 trae con frecuencia una sensacion de no ser escuchado o comprendido, que puede tener raices en experiencias de la infancia. Paradojicamente, hay un talento para ensennar a los demas a comunicarse mejor de lo que la propia persona consigue hacerlo. Reconocer que el dolor del pasado no necesita repetirse en el presente es el primer paso para liberar el don comunicativo que esta posicion conlleva.',

    'chiron:house|4':
      'Quiron en Casa 4 indica una herida relacionada con el hogar, la familia de origen y la sensacion de pertenencia. Puede haber dificultad para sentirse en casa en cualquier lugar, o una historia con los padres marcada por la ausencia emocional o fisica. Curiosamente, esta posicion puede generar una habilidad especial para ayudar a otros con cuestiones domesticas y familiares, mientras los propios desafios en esa area persisten.',

    'chiron:house|5':
      'Quiron en Casa 5 senala una herida en el area del amor, la creatividad y el placer. Hay con frecuencia una capacidad de ayudar a otros en relaciones romanticas o en el desarrollo creativo mucho mayor de la que la persona aplica a si misma. Esta posicion tambien puede indicar a alguien que entrena a otros para actuaciones extraordinarias, superando sus propios limites al hacerlo.',

    'chiron:house|6':
      'Quiron en Casa 6 crea un especialista en salud o bienestar que con frecuencia cuida a los demas mientras descuida sus propios habitos. Puede haber una tendencia a habitos alimenticios irregulares o a una relacion complicada con el cuerpo y la rutina diaria. El desafio aqui es practicar lo que se predica: aplicar a la propia vida cotidiana el mismo cuidado que se ofrece con tanta competencia a los demas.',

    'chiron:house|7':
      'Quiron en Casa 7 proyecta la herida en las asociaciones, ya sean amorosas o profesionales. Hay con frecuencia una capacidad de asesorar a los demas sobre relaciones con sabiduria genuina, mientras los propios vinculos afectivos enfrentan desafios recurrentes. El camino de sanacion pasa por reconocer el patron que se busca repetir a traves del otro y afrontarlo de manera consciente.',

    'chiron:house|8':
      'Quiron en Casa 8 senala una herida relacionada con la intimidad, la transformacion y los recursos compartidos. Hay un talento para facilitar la sanacion emocional y la transformacion de los demas, pero la propia persona puede resistirse a su proceso de renovacion profunda. Esta posicion puede tambien indicar una tendencia a depender de los recursos ajenos o a sostener a los demas economicamente en detrimento de uno mismo.',

    'chiron:house|9':
      'Quiron en Casa 9 indica una herida en torno a la busqueda de sentido, la expansion y las creencias. Puede haber alguien que inspira a todos a su alrededor a viajar, estudiar y crecer, mientras se siente bloqueado para hacer lo mismo. La herida puede manifestarse como una busqueda intensa de filosofia o religion como intento de sanar dolores internos que resisten las soluciones puramente intelectuales.',

    'chiron:house|10':
      'Quiron en Casa 10 situa la herida en la carrera y la vida publica. Puede haber un rechazo de la propia ambicion o responsabilidad, posiblemente porque la presion de los padres fue excesiva o porque sabotearon inconscientemente el exito de la persona. Esta posicion tambien puede crear a alguien que cuida de todos en la organizacion mientras sus propias necesidades profesionales quedan en segundo plano.',

    'chiron:house|11':
      'Quiron en Casa 11 senala una herida en las amistades, los grupos y las esperanzas de futuro. Puede haber dificultad para mantener amistades duraderas, o una tendencia a atraer a personas que se aprovechan de la generosidad. Por otro lado, puede surgir una busqueda intensa de pertenencia en grupos o causas colectivas como forma de compensar un miedo profundo a la soledad.',

    'chiron:house|12':
      'Quiron en Casa 12 crea una fuerte compulsion por cuidar a los vulnerables y excluidos, frecuentemente en detrimento del propio bienestar. Puede haber una tendencia al agotamiento, pues la persona se pone constantemente al servicio de los demas sin limites claros. Aprender a descansar, a recibir cuidado y a reconocer las propias necesidades es el camino central de integracion de esta posicion.',
  },

  'it-IT': {
    'chiron:house|1':
      'Chirone in Casa 1 tende a creare una persona che difende gli altri con facilita, ma che trova difficolta nel riservare a se stessa le stesse attenzioni. Vi e un talento naturale per il consiglio e per percepire cio di cui gli altri hanno bisogno, spesso prima di riconoscere i propri bisogni. Il percorso di integrazione passa per offrire a se stessi la stessa generosita che si offre al mondo.',

    'chiron:house|2':
      'Chirone in Casa 2 puo creare un ottimo consulente finanziario per gli altri, mentre le proprie risorse rimangono nel disordine o nella scarsita. La ferita qui e legata al senso di merito: vi e una convinzione, spesso inconscia, di non meritare sicurezza o abbondanza. Riconoscere il valore personale al di la di cio che si possiede o si produce e la chiave per la integrazione.',

    'chiron:house|3':
      'Chirone in Casa 3 porta spesso una sensazione di non essere ascoltati o capiti, che puo avere radici in esperienze infantili. Paradossalmente, vi e un talento per insegnare agli altri a comunicare meglio di quanto la persona stessa riesca a fare. Riconoscere che il dolore del passato non deve essere ripetuto nel presente e il primo passo per liberare il dono comunicativo che questa posizione porta con se.',

    'chiron:house|4':
      'Chirone in Casa 4 indica una ferita legata alla casa, alla famiglia di origine e al senso di appartenenza. Puo esserci difficolta nel sentirsi a casa ovunque, o una storia con i genitori segnata dalla assenza emotiva o fisica. Curiosamente, questa posizione puo generare una speciale capacita di aiutare gli altri con questioni domestiche e familiari, mentre le proprie sfide in quella area persistono.',

    'chiron:house|5':
      'Chirone in Casa 5 indica una ferita nel area del amore, della creativita e del piacere. Vi e spesso una capacita di aiutare gli altri in relazioni romantiche o nello sviluppo creativo molto maggiore di quella che la persona applica a se stessa. Questa posizione puo anche indicare qualcuno che allena gli altri a prestazioni straordinarie, superando i propri limiti nel farlo.',

    'chiron:house|6':
      'Chirone in Casa 6 crea uno specialista della salute o del benessere che spesso si prende cura degli altri mentre trascura le proprie abitudini. Puo esserci una tendenza a abitudini alimentari irregolari o a un rapporto complicato con il corpo e la routine quotidiana. La sfida qui e praticare cio che si predica: applicare alla propria vita quotidiana le stesse attenzioni offerte con tanta competenza agli altri.',

    'chiron:house|7':
      'Chirone in Casa 7 proietta la ferita nelle partnership, siano esse amorose o professionali. Vi e spesso una capacita di consigliare gli altri sulle relazioni con vera saggezza, mentre i propri legami affettivi affrontano sfide ricorrenti. Il percorso di guarigione passa per riconoscere il modello che si cerca di ripetere attraverso il altro e affrontarlo consapevolmente.',

    'chiron:house|8':
      'Chirone in Casa 8 indica una ferita legata alla intimita, alla trasformazione e alle risorse condivise. Vi e un talento per facilitare la guarigione emotiva e la trasformazione degli altri, ma la persona stessa puo resistere al proprio processo di rinnovamento profondo. Questa posizione puo anche indicare una tendenza a dipendere dalle risorse altrui o a sostenere gli altri economicamente a scapito di se stessa.',

    'chiron:house|9':
      'Chirone in Casa 9 indica una ferita intorno alla ricerca di senso, alla espansione e alle credenze. Puo esserci qualcuno che ispira tutti intorno a se a viaggiare, studiare e crescere, mentre si sente bloccato dal fare lo stesso. La ferita puo manifestarsi come una ricerca intensa di filosofia o religione come tentativo di guarire dolori interni che resistono alle soluzioni puramente intellettuali.',

    'chiron:house|10':
      'Chirone in Casa 10 pone la ferita nella carriera e nella vita pubblica. Puo esserci un rifiuto della propria ambizione o responsabilita, forse perche la pressione dei genitori e stata eccessiva o perche hanno sabotato inconsciamente il successo della persona. Questa posizione puo anche creare qualcuno che si prende cura di tutti nella organizzazione mentre i propri bisogni professionali rimangono in secondo piano.',

    'chiron:house|11':
      'Chirone in Casa 11 indica una ferita nelle amicizie, nei gruppi e nelle speranze per il futuro. Puo esserci difficolta nel mantenere amicizie durature, o una tendenza ad attirare persone che approfittano della generosita. In alternativa, puo emergere una ricerca intensa di appartenenza in gruppi o cause collettive come modo di compensare una profonda paura della solitudine.',

    'chiron:house|12':
      'Chirone in Casa 12 crea una forte compulsione a prendersi cura dei vulnerabili e degli esclusi, spesso a scapito del proprio benessere. Puo esserci una tendenza al esaurimento, poiche la persona si mette costantemente al servizio degli altri senza limiti chiari. Imparare a riposare, a ricevere cura e a riconoscere i propri bisogni e il percorso centrale di integrazione per questa posizione.',
  },
}
