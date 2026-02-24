// Catálogo i18n de interpretações natais: planetas em casas
// Deve manter paridade exata de chaves com natalPlanetInHouseOverridesPtBR.ts
import type { AppLanguage } from '../i18n/appI18n'

type NatalOverrideMap = Record<string, string>

export const NATAL_PLANET_IN_HOUSE_I18N_OVERRIDES: Partial<Record<AppLanguage, NatalOverrideMap>> = {
  'en-US': {
    // ── Sun ──────────────────────────────────────────────────────────────────
    'natal:sun|house|1':
      'The Sun in House 1 places personal identity at the center of life expression, making self-image and bodily presence central themes. There is a natural orientation toward leadership, initiative, and a presence that stands out, with vitality as the main resource. The challenge is cultivating self-awareness without losing openness to what others and the environment reflect.',
    'natal:sun|house|2':
      'The Sun in House 2 channels vital energy toward building material security and developing a solid personal value system. Self-esteem tends to be tied to what one produces, accumulates, or sustains through personal effort. Working consistently with resources — finances, talents, and time — is the natural path to self-fulfillment.',
    'natal:sun|house|3':
      'The Sun in House 3 directs personal expression toward communication, learning, and daily exchanges with the immediate environment. There is a marked intellectual curiosity, pleasure in articulating ideas, and a tendency to build identity through words and knowledge. Siblings, neighbors, and short trips tend to play a relevant role in the personal story.',
    'natal:sun|house|4':
      'The Sun in House 4 anchors identity in family history, the home, and the search for roots that provide emotional security. The sense of who one is tends to develop more in private life than in external recognition, with home as the centering space. The second half of life often brings more fulfillment and recognition than the earlier years.',
    'natal:sun|house|5':
      'The Sun in House 5 illuminates creative expression, pleasure, and the capacity to show oneself authentically and magnetically. There is a natural impulse toward creativity, romance, and affective engagement with the world — including arts, entertainment, and connection with children. Authenticity in personal expression is the most direct path to fulfillment and recognition.',
    'natal:sun|house|6':
      'The Sun in House 6 channels vital energy toward service, daily work, and the pursuit of efficient everyday functioning. Identity tends to express through the quality of what is delivered, care for health, and technical competence. The risk is centering self-worth on performance, losing sight of intrinsic value beyond tasks.',
    'natal:sun|house|7':
      'The Sun in House 7 places significant partnerships at the center of identity development and personal fulfillment. One-on-one relationships — romantic, professional, or legal — are the main mirror through which the person comes to know and grow. The challenge is maintaining a sense of self within an identity that naturally strengthens through meeting others.',
    'natal:sun|house|8':
      'The Sun in House 8 channels vital energy toward deep transformation, intimacy, and processes of psychological renewal. There is a tendency to engage with what is intense, hidden, or shared — joint resources, depth in relationships, and the mysteries of existence. Personal growth tends to come from confronting discomfort and emerging transformed.',
    'natal:sun|house|9':
      'The Sun in House 9 directs vital expression toward the search for meaning, the expansion of horizons, and the construction of a broad worldview. Philosophy, religion, long travels, and higher education are natural arenas of fulfillment and brilliance. Identity forms and strengthens through contact with what is different, distant, or larger than the immediate everyday.',
    'natal:sun|house|10':
      'The Sun in House 10 places career, reputation, and public direction as the central axis of vital expression. There is a natural orientation toward authority, recognition, and building a visible legacy in professional and social life. Personal fulfillment tends to translate into achievements that others can see and validate.',
    'natal:sun|house|11':
      'The Sun in House 11 orients identity toward the collective, long-term projects, and participation in groups with shared purpose. There is satisfaction in being part of something larger than the individual, and friendship and collaboration tend to be genuine sources of vital energy. Recognition tends to come through contributions to ideals and causes that go beyond immediate personal interest.',
    'natal:sun|house|12':
      'The Sun in House 12 orients vital expression toward retreat, deep self-knowledge, and quiet service. There is a tendency for a rich inner life, sensitivity to what lies in the shadows, and connection with subtle dimensions of experience. Personal brilliance tends to manifest in spaces of retreat, spirituality, or silent dedication to something larger than the ego.',
  },
  'es-ES': {
    // Regra: sem acentos (a/e/i/o/u/n — nunca á/é/í/ó/ú/ñ)
    // ── Sol ──────────────────────────────────────────────────────────────────
    'natal:sun|house|1':
      'El Sol en la Casa 1 coloca la identidad personal en el centro de la expresion de vida, haciendo de la autoimagen y la presencia corporal temas centrales. Hay una orientacion natural hacia el liderazgo, la iniciativa y una presencia que se destaca, con la vitalidad como recurso principal. El desafio es cultivar la autoconciencia sin perder la apertura a lo que los demas y el entorno reflejan.',
    'natal:sun|house|2':
      'El Sol en la Casa 2 canaliza la energia vital hacia la construccion de seguridad material y el desarrollo de un sistema de valores personales solidos. La autoestima tiende a estar ligada a lo que se produce, acumula o sostiene con el propio esfuerzo. Trabajar de forma consistente con los recursos — finanzas, talentos y tiempo — es el camino natural hacia la autorrealizacion.',
    'natal:sun|house|3':
      'El Sol en la Casa 3 dirige la expresion personal hacia la comunicacion, el aprendizaje y los intercambios cotidianos con el entorno cercano. Hay una marcada curiosidad intelectual, placer en articular ideas y tendencia a construir la identidad a traves de la palabra y el conocimiento. Hermanos, vecinos y desplazamientos cortos tienden a desempenar un papel relevante en la historia personal.',
    'natal:sun|house|4':
      'El Sol en la Casa 4 ancla la identidad en la historia familiar, el hogar y la busqueda de raices que brindan seguridad emocional. El sentido de quien se es tiende a desarrollarse mas en la vida privada que en el reconocimiento externo, con el hogar como espacio de centralizacion. La segunda mitad de la vida suele traer mas realizacion y reconocimiento que los anos iniciales.',
    'natal:sun|house|5':
      'El Sol en la Casa 5 ilumina la expresion creativa, el placer y la capacidad de mostrarse de forma autentica y magnetica. Hay un impulso natural hacia la creatividad, el romanticismo y el compromiso afectivo con el mundo — incluyendo artes, entretenimiento y relacion con ninos. La autenticidad en la expresion personal es el camino mas directo hacia la realizacion y el reconocimiento.',
    'natal:sun|house|6':
      'El Sol en la Casa 6 canaliza la energia vital hacia el servicio, el trabajo diario y la busqueda de un funcionamiento cotidiano eficiente. La identidad tiende a expresarse a traves de la calidad de lo que se entrega, el cuidado de la salud y la competencia tecnica. El riesgo es centrar la autoestima en el desempeno, perdiendo de vista el valor propio mas alla de las tareas.',
    'natal:sun|house|7':
      'El Sol en la Casa 7 coloca las asociaciones significativas en el centro del desarrollo de la identidad y la realizacion personal. Las relaciones uno a uno — amorosas, profesionales o legales — son el espejo principal a traves del cual la persona se conoce y crece. El desafio es mantener el sentido propio dentro de una identidad que se fortalece naturalmente en el encuentro con el otro.',
    'natal:sun|house|8':
      'El Sol en la Casa 8 canaliza la energia vital hacia la transformacion profunda, la intimidad y los procesos de renovacion psicologica. Hay una tendencia a relacionarse con lo intenso, lo oculto o lo compartido — recursos conjuntos, profundidad en las relaciones y los misterios de la existencia. El crecimiento personal suele venir de confrontar lo incomodo y salir transformado.',
    'natal:sun|house|9':
      'El Sol en la Casa 9 dirige la expresion vital hacia la busqueda de sentido, la expansion de horizontes y la construccion de una vision del mundo amplia. Filosofia, religion, viajes largos y educacion superior son arenas naturales de realizacion y brillo. La identidad se forma y se fortalece a traves del contacto con lo diferente, lo lejano o lo mayor que el cotidiano inmediato.',
    'natal:sun|house|10':
      'El Sol en la Casa 10 coloca la carrera, la reputacion y la direccion publica como eje central de la expresion vital. Hay una orientacion natural hacia la autoridad, el reconocimiento y la construccion de un legado visible en la vida profesional y social. La realizacion personal tiende a traducirse en logros que otros pueden ver y validar.',
    'natal:sun|house|11':
      'El Sol en la Casa 11 orienta la identidad hacia lo colectivo, los proyectos de largo plazo y la participacion en grupos con proposito compartido. Hay satisfaccion en ser parte de algo mayor que lo individual, y la amistad y la colaboracion tienden a ser fuentes genuinas de energia vital. El reconocimiento tiende a llegar a traves de contribuciones a ideales y causas que van mas alla del interes personal inmediato.',
    'natal:sun|house|12':
      'El Sol en la Casa 12 orienta la expresion vital hacia el recogimiento, el autoconocimiento profundo y el servicio discreto. Hay una tendencia a una vida interior rica, sensibilidad a lo que esta en las sombras y conexion con dimensiones sutiles de la experiencia. El brillo personal tiende a manifestarse en espacios de retiro, espiritualidad o dedicacion silenciosa a algo mayor que el ego.',
  },
  'it-IT': {
    // Regra: sem acentos + sem apóstrofes em strings com aspas simples
    // ── Sole ─────────────────────────────────────────────────────────────────
    'natal:sun|house|1':
      'Il Sole nella Casa 1 pone l identita personale al centro dell espressione di vita, rendendo l immagine di se e la presenza corporea temi centrali. Vi e una tendenza naturale verso la leadership, l iniziativa e una presenza che si distingue, con la vitalita come risorsa principale. La sfida e coltivare la consapevolezza di se senza perdere l apertura a cio che gli altri e l ambiente riflettono.',
    'natal:sun|house|2':
      'Il Sole nella Casa 2 canalizza l energia vitale verso la costruzione della sicurezza materiale e lo sviluppo di un sistema di valori personali solidi. L autostima tende a legarsi a cio che si produce, accumula o sostiene con il proprio sforzo. Lavorare in modo costante con le risorse — finanze, talenti e tempo — e il percorso naturale verso l autorealizzazione.',
    'natal:sun|house|3':
      'Il Sole nella Casa 3 dirige l espressione personale verso la comunicazione, l apprendimento e gli scambi quotidiani con l ambiente immediato. Vi e una spiccata curiosita intellettuale, piacere nel articolare le idee e tendenza a costruire l identita attraverso la parola e la conoscenza. Fratelli, vicini e spostamenti brevi tendono a svolgere un ruolo rilevante nella storia personale.',
    'natal:sun|house|4':
      'Il Sole nella Casa 4 radica l identita nella storia familiare, nella casa e nella ricerca di radici che offrono sicurezza emotiva. Il senso di chi si e tende a svilupparsi piu nella vita privata che nel riconoscimento esterno, con la casa come spazio di centratura. La seconda meta della vita porta spesso piu realizzazione e riconoscimento rispetto agli anni iniziali.',
    'natal:sun|house|5':
      'Il Sole nella Casa 5 illumina l espressione creativa, il piacere e la capacita di mostrarsi in modo autentico e magnetico. Vi e un impulso naturale verso la creativita, il romanticismo e il coinvolgimento affettivo con il mondo — inclusi figli, arti e intrattenimento. L autenticita nella espressione personale e il percorso piu diretto verso la realizzazione e il riconoscimento.',
    'natal:sun|house|6':
      'Il Sole nella Casa 6 orienta l energia vitale verso il servizio, il lavoro quotidiano e la ricerca di un funzionamento efficiente del quotidiano. L identita tende a esprimersi attraverso la qualita di cio che si consegna, la cura della salute e la competenza tecnica. Il rischio e di centralizzare l autostima sulla performance, perdendo di vista il valore proprio al di la dei compiti.',
    'natal:sun|house|7':
      'Il Sole nella Casa 7 pone le relazioni significative al centro dello sviluppo dell identita e della realizzazione personale. Le relazioni uno a uno — amorose, professionali o legali — sono lo specchio principale attraverso cui la persona si conosce e cresce. La sfida e mantenere il senso di se dentro una identita che si rafforza naturalmente nell incontro con l altro.',
    'natal:sun|house|8':
      'Il Sole nella Casa 8 orienta l energia vitale verso la trasformazione profonda, l intimita e i processi di rinnovamento psicologico. Vi e una tendenza ad affrontare cio che e intenso, nascosto o condiviso — risorse in comune, profondita nelle relazioni e i misteri dell esistenza. La crescita personale tende a venire dal confronto con cio che e scomodo, emergendo trasformati.',
    'natal:sun|house|9':
      'Il Sole nella Casa 9 dirige l espressione vitale verso la ricerca di senso, l espansione degli orizzonti e la costruzione di una visione del mondo ampia. Filosofia, religione, viaggi lunghi e istruzione superiore sono arene naturali di realizzazione e brillantezza. L identita si forma e si rafforza attraverso il contatto con cio che e diverso, lontano o piu grande del quotidiano immediato.',
    'natal:sun|house|10':
      'Il Sole nella Casa 10 pone la carriera, la reputazione e la direzione pubblica come asse centrale dell espressione vitale. Vi e una orientazione naturale verso l autorita, il riconoscimento e la costruzione di un lascito visibile nella vita professionale e sociale. La realizzazione personale tende a tradursi in conquiste che gli altri possono vedere e valorizzare.',
    'natal:sun|house|11':
      'Il Sole nella Casa 11 orienta l identita verso il collettivo, i progetti di lungo termine e la partecipazione a gruppi con scopo condiviso. Vi e soddisfazione nel far parte di qualcosa di piu grande del singolo, e l amicizia e la collaborazione tendono a essere fonti genuine di energia vitale. Il riconoscimento tende ad arrivare attraverso contributi a ideali e cause che vanno oltre l interesse personale immediato.',
    'natal:sun|house|12':
      'Il Sole nella Casa 12 orienta l espressione vitale verso il ritiro, la conoscenza profonda di se e il servizio discreto. Vi e una tendenza a una vita interiore ricca, sensibilita a cio che e nelle ombre e connessione con dimensioni sottili dell esperienza. La luce personale tende a manifestarsi in spazi di ritiro, spiritualita o dedizione silenziosa a qualcosa di piu grande dell ego.',
  },
}
