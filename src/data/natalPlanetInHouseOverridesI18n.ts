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
    // ── Moon ─────────────────────────────────────────────────────────────────
    'natal:moon|house|1':
      'The Moon in House 1 makes emotions, sensitivity, and instinctive reactions a visible part of personal presence. There is a natural tendency to pick up on the emotional tone of the environment and respond with empathy, which draws people in but may generate mood swings without consistent self-care. Personal expression is fluid, shifting with context and reflecting the emotional needs of the moment.',
    'natal:moon|house|2':
      'The Moon in House 2 links emotional security directly to material stability, making finances and possessions themes of high emotional charge. Comfort, nourishment, and caring for the immediate environment are natural sources of inner well-being. The relationship with money tends to be cyclical, alternating between accumulation and generosity depending on the emotional state.',
    'natal:moon|house|3':
      'The Moon in House 3 makes communication a natural channel for emotional expression, with a tendency to speak, write, and connect through words laden with feeling. The mind is intuitive and receptive, picking up subtle nuances in the environment and in people nearby. Siblings, the neighborhood, and short trips tend to carry significant emotional weight in the personal story.',
    'natal:moon|house|4':
      'The Moon in House 4 anchors emotional needs deeply in the home, family, and roots — one of the strongest placements for the Moon in the natal chart. There is a strong affective bond with the maternal figure and with the sense of family belonging, which becomes the foundation for inner balance. Home is far more than a physical space — it is the emotional center of life.',
    'natal:moon|house|5':
      'The Moon in House 5 brings a creative and expressive emotionality, with a strong need for affection, recognition, and playful engagement with the world. There is an intense emotional connection with children, the arts, and romantic relationships, where feeling and creating interweave. Pleasure and genuine self-expression are fundamental sources of emotional nourishment.',
    'natal:moon|house|6':
      'The Moon in House 6 links emotional well-being to routine, work, and the act of serving and attending to details. Physical nourishment, hygiene, and daily organization carry significant emotional weight, and the inner state often reflects itself in health and in the body. When routine is in order, emotions tend to stabilize.',
    'natal:moon|house|7':
      'The Moon in House 7 orients emotional needs toward intimate relationships and partnerships, making others a central source of affective nourishment. There is a heightened sensitivity to what others feel and need, which fosters empathy but may generate emotional dependency. Finding balance between giving and receiving in relationships is an ongoing learning.',
    'natal:moon|house|8':
      'The Moon in House 8 plunges emotions into intense depths, tying emotional life to transformation, intimacy, and what lies hidden. There is a sharp intuition for what lies beneath the surface, with a natural attraction to psychology, mystery, and the denser layers of existence. Emotional growth comes from naming and integrating what was kept hidden.',
    'natal:moon|house|9':
      'The Moon in House 9 connects the emotional world to the search for meaning, faith, and expansion of horizons. There is an emotional hunger for learning, travel, and contact with different cultures, which functions as inner nourishment. Religious or philosophical beliefs may carry strong emotional charge and influence decisions arising from the emotional field.',
    'natal:moon|house|10':
      'The Moon in House 10 places emotional life in direct contact with the public and professional sphere, making career a field of expression for affective needs. There is a natural sensitivity to what the public or collective needs, which may favor careers in care, communication, or empathetic leadership. The relationship with the maternal figure often shapes the construction of the professional path.',
    'natal:moon|house|11':
      'The Moon in House 11 orients the emotional world toward groups, friendships, and collective causes, making the sense of belonging to something larger a genuine affective need. There is authentic emotional satisfaction in collaborating, supporting networks, and investing in deep friendships. Mood and inner well-being tend to respond to the state of collective relationships and the climate of frequented groups.',
    'natal:moon|house|12':
      'The Moon in House 12 internalizes emotions deeply, creating a rich inner life that may be difficult to access or communicate. There is a subtle sensitivity to the suffering of others, developed intuition, and a natural connection to what lies beyond the visible. Self-knowledge work and contact with the inner emotional life are fundamental paths of inner nourishment.',
    // ── Mercury ──────────────────────────────────────────────────────────────
    'natal:mercury|house|1':
      'Mercury in House 1 makes communication a central part of personal presence, with the mind and the spoken word functioning as a natural calling card. There is a tendency to process the surrounding world quickly and articulately, with keen curiosity and ease in adapting to different contexts and interlocutors. The ongoing challenge is learning to listen with the same intensity brought to speaking.',
    'natal:mercury|house|2':
      'Mercury in House 2 directs the mind toward practical questions of resources, value, and livelihood, making thought a direct tool for material building. There is a natural aptitude for negotiating, evaluating, and articulating proposals related to finances, business, and what holds concrete worth. Ideas function as capital — the better they are developed, the greater their capacity to generate security and stability.',
    'natal:mercury|house|3':
      'Mercury in House 3 is a position of great ease for the planet of the mind, favoring fluent communication, quick learning, and rich exchanges with the immediate environment. There is a natural curiosity about everyday life, language, and the flow of information — siblings, neighbors, and short trips tend to be constant sources of stimulation. Versatility of thought is a valuable resource, though depth may require additional effort.',
    'natal:mercury|house|4':
      'Mercury in House 4 connects the mind and language to the private, familial world and to roots — childhood memories and the story of home tend to shape patterns of thought. There is an intuitive capacity to process the past and to use communication as a way of nurturing or organizing the domestic environment. Reflective writing, therapy, or personal journaling may be important channels for internal processing.',
    'natal:mercury|house|5':
      'Mercury in House 5 brings lightness, creativity, and intellectual pleasure to communication, favoring expressive writing, humor, and the exchange of ideas as a form of enjoyment. There is a tendency toward original thinking, wordplay, and the ability to teach or communicate with a natural dose of entertainment. Creative expression through language — in writing, on stage, or in teaching — tends to be a genuine source of satisfaction.',
    'natal:mercury|house|6':
      'Mercury in House 6 directs the mind toward analysis, attention to detail, and the pursuit of efficiency in daily processes. There is a natural aptitude for organizing information, identifying gaps, and refining working methods — the mind functions well when oriented toward concrete and practical tasks. The connection between mind and body is pronounced, with mental state directly reflected in physical health and vitality.',
    'natal:mercury|house|7':
      'Mercury in House 7 places communication at the center of significant relationships, making dialogue, negotiation, and mutual understanding essential tools in close bonds. There is a tendency to attract intellectually stimulating partners and to build relationships based on verbal and mental exchange. The challenge is using the mind to deepen connections rather than merely analyzing or rationalizing what is felt.',
    'natal:mercury|house|8':
      'Mercury in House 8 develops an investigative mind, drawn to what is hidden, to psychological mechanisms, and to the deeper layers of reality. There is a natural talent for research, recognizing concealed patterns, and handling sensitive or complex information. Communication tends to be careful and precise — this Mercury prefers to say little and say it well.',
    'natal:mercury|house|9':
      'Mercury in House 9 expands the mind beyond the everyday, with genuine interest in philosophy, teaching, wide-ranging writing, and contact with ways of thinking beyond the familiar. There is an aptitude for communicating broad concepts, articulating worldviews, and learning through travel, cultures, and belief systems. Academic writing, teaching, and publishing are natural channels of expression for this placement.',
    'natal:mercury|house|10':
      'Mercury in House 10 directs communication skills toward public and professional life, making the spoken and written word a central resource in building reputation and authority. There is a tendency toward careers involving writing, speaking, teaching, or managing information in positions of visibility. Credibility tends to build through the quality of ideas and the clarity with which they are communicated.',
    'natal:mercury|house|11':
      'Mercury in House 11 connects the mind to the collective, making the exchange of ideas in groups, networks, and movements a natural source of intellectual stimulation. There is genuine pleasure in debate, collaboration on far-reaching projects, and communicating ideas that benefit a broad audience. Collective intelligence works better than solitary thinking — this Mercury thrives in contact with diverse minds.',
    'natal:mercury|house|12':
      'Mercury in House 12 internalizes mental processes, creating an intellectual life that is more intuitive, reflective, and less oriented toward public expression. There is a tendency toward symbolic thinking, dreams, and connections that emerge from the unconscious, making introspection a natural mode of processing. Private writing, meditation, and mental work in quiet spaces tend to be more productive than environments of intense exchange.',
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
    // ── Luna ─────────────────────────────────────────────────────────────────
    'natal:moon|house|1':
      'La Luna en la Casa 1 hace que las emociones, la sensibilidad y las reacciones instintivas sean parte visible de la presencia personal. Hay una tendencia natural a captar el tono emocional del entorno y responder con empatia, lo que atrae a las personas pero puede generar cambios de humor sin un autocuidado consistente. La expresion personal es fluida, cambia con el contexto y refleja las necesidades emocionales del momento.',
    'natal:moon|house|2':
      'La Luna en la Casa 2 vincula la seguridad emocional directamente con la estabilidad material, haciendo de las finanzas y las posesiones temas de gran carga afectiva. El confort, la nutricion y el cuidado del entorno propio son fuentes naturales de bienestar interno. La relacion con el dinero tiende a ser ciclica, alternando entre acumulacion y generosidad segun el estado emocional.',
    'natal:moon|house|3':
      'La Luna en la Casa 3 hace de la comunicacion un canal natural de expresion emocional, con tendencia a hablar, escribir y conectar a traves de palabras cargadas de sentimiento. La mente es intuitiva y receptiva, captando matices sutiles del entorno y de las personas cercanas. Hermanos, vecindad y desplazamientos cortos tienden a tener una carga emocional significativa en la historia personal.',
    'natal:moon|house|4':
      'La Luna en la Casa 4 ancla profundamente las necesidades emocionales en el hogar, la familia y las raices — una de las posiciones mas fuertes para la Luna en el mapa natal. Hay un fuerte vinculo afectivo con la figura materna y con el sentido de pertenencia familiar, que se convierte en la base del equilibrio interno. El hogar es mucho mas que un espacio fisico — es el centro emocional de la vida.',
    'natal:moon|house|5':
      'La Luna en la Casa 5 trae una emotividad creativa y expresiva, con una fuerte necesidad de afecto, reconocimiento y un compromiso ludico con el mundo. Hay una intensa conexion emocional con los ninos, las artes y las relaciones romanticas, donde sentir y crear se entrelazan. El placer y la expresion genuina son fuentes fundamentales de nutricion emocional.',
    'natal:moon|house|6':
      'La Luna en la Casa 6 vincula el bienestar emocional con la rutina, el trabajo y el acto de servir y atender los detalles. La nutricion fisica, la higiene y la organizacion diaria tienen un peso emocional significativo, y el estado interno suele reflejarse en la salud y el cuerpo. Cuando la rutina esta en orden, las emociones tienden a estabilizarse.',
    'natal:moon|house|7':
      'La Luna en la Casa 7 orienta las necesidades emocionales hacia las relaciones intimas y las asociaciones, haciendo del otro una fuente central de nutricion afectiva. Hay una sensibilidad acentuada hacia lo que el otro siente y necesita, lo que favorece la empatia pero puede generar dependencia emocional. Encontrar el equilibrio entre dar y recibir en los vinculos es un aprendizaje continuo.',
    'natal:moon|house|8':
      'La Luna en la Casa 8 sumerge las emociones en profundidades intensas, vinculando la vida emocional con la transformacion, la intimidad y lo oculto. Hay una intuicion aguda para lo que subyace a la superficie, con una atraccion natural por la psicologia, el misterio y las capas mas densas de la existencia. El crecimiento emocional viene de nombrar e integrar lo que estaba escondido.',
    'natal:moon|house|9':
      'La Luna en la Casa 9 conecta el mundo emocional con la busqueda de sentido, la fe y la expansion de horizontes. Hay un hambre emocional de aprendizaje, viajes y contacto con culturas diferentes, que funciona como nutricion interior. Las creencias religiosas o filosoficas pueden tener una fuerte carga afectiva e influir en decisiones que surgen del campo emocional.',
    'natal:moon|house|10':
      'La Luna en la Casa 10 pone la vida emocional en contacto directo con la esfera publica y profesional, haciendo de la carrera un campo de expresion de las necesidades afectivas. Hay una sensibilidad natural hacia lo que el publico o el colectivo necesita, lo que puede favorecer carreras de cuidado, comunicacion o liderazgo empatico. La relacion con la figura materna suele influir en la construccion de la trayectoria profesional.',
    'natal:moon|house|11':
      'La Luna en la Casa 11 orienta el mundo emocional hacia los grupos, las amistades y las causas colectivas, haciendo del sentido de pertenencia a algo mayor una necesidad afectiva real. Hay satisfaccion emocional genuina en colaborar, apoyar redes e invertir en amistades profundas. El estado de animo y el bienestar interno tienden a responder al clima de las relaciones colectivas y los grupos frecuentados.',
    'natal:moon|house|12':
      'La Luna en la Casa 12 internaliza las emociones de forma profunda, creando una vida interior rica pero a veces dificil de acceder o comunicar. Hay una sensibilidad sutil al sufrimiento de los demas, intuicion desarrollada y una conexion natural con lo que esta mas alla de lo visible. El trabajo de autoconocimiento y el contacto con la propia vida emocional son caminos fundamentales de nutricion interna.',
    // ── Mercurio ─────────────────────────────────────────────────────────────
    'natal:mercury|house|1':
      'Mercurio en la Casa 1 hace de la comunicacion una parte central de la presencia personal, con la mente y la palabra funcionando como presentacion natural ante el mundo. Hay una tendencia a procesar el entorno con rapidez y claridad, con curiosidad marcada y facilidad para adaptarse a distintos contextos e interlocutores. El reto permanente es aprender a escuchar con la misma intensidad con que se habla.',
    'natal:mercury|house|2':
      'Mercurio en la Casa 2 orienta la mente hacia cuestiones practicas de recursos, valor y sustento, convirtiendo el pensamiento en herramienta directa de construccion material. Hay una aptitud natural para negociar, evaluar y articular propuestas vinculadas a finanzas, negocios y lo que tiene valor concreto. Las ideas funcionan como capital — cuanto mejor desarrolladas, mayor su capacidad de generar seguridad y estabilidad.',
    'natal:mercury|house|3':
      'Mercurio en la Casa 3 es una posicion de gran comodidad para el planeta de la mente, que favorece la comunicacion fluida, el aprendizaje rapido y el intercambio rico con el entorno cercano. Hay una curiosidad natural por la vida cotidiana, el lenguaje y los flujos de informacion — hermanos, vecinos y desplazamientos cortos tienden a ser fuentes de estimulo constante. La versatilidad mental es un recurso valioso, aunque la profundidad puede requerir esfuerzo adicional.',
    'natal:mercury|house|4':
      'Mercurio en la Casa 4 conecta la mente y el lenguaje al mundo privado y familiar — los recuerdos de la infancia y la historia del hogar tienden a moldear los patrones de pensamiento. Hay una capacidad intuitiva para procesar el pasado y usar la comunicacion como forma de nutrir u organizar el ambiente domestico. La escritura reflexiva, la terapia o el diario personal pueden ser canales importantes de procesamiento interno.',
    'natal:mercury|house|5':
      'Mercurio en la Casa 5 aporta ligereza, creatividad y placer intelectual a la comunicacion, favoreciendo la escritura expresiva, el humor y el intercambio de ideas como forma de disfrute. Hay tendencia hacia el pensamiento original, el juego de palabras y la capacidad de ensenar o comunicar con una dosis natural de entretenimiento. La expresion creativa a traves del lenguaje — en la escritura, el escenario o la ensenanza — tiende a ser una fuente genuina de satisfaccion.',
    'natal:mercury|house|6':
      'Mercurio en la Casa 6 dirige la mente hacia el analisis, el detalle y la busqueda de eficiencia en los procesos cotidianos. Hay una aptitud natural para organizar informacion, identificar fallas y perfeccionar metodos de trabajo — la mente funciona bien cuando se orienta a tareas concretas y practicas. La conexion entre mente y cuerpo es pronunciada, con el estado mental reflejandose directamente en la salud y la disposicion fisica.',
    'natal:mercury|house|7':
      'Mercurio en la Casa 7 coloca la comunicacion en el centro de las relaciones significativas, haciendo del dialogo, la negociacion y el entendimiento mutuo herramientas esenciales en los vinculos. Hay una tendencia a atraer parejas intelectualmente estimulantes y a construir relaciones basadas en el intercambio verbal y mental. El reto es usar la mente para profundizar los vinculos en lugar de solo analizar o racionalizar lo que se siente.',
    'natal:mercury|house|8':
      'Mercurio en la Casa 8 desarrolla una mente investigadora, atraida por lo que esta oculto, los mecanismos psicologicos y las capas mas profundas de la realidad. Hay un talento natural para la investigacion, el reconocimiento de patrones ocultos y el manejo de informacion sensible o compleja. La comunicacion tiende a ser cuidadosa y precisa — este Mercurio prefiere decir poco y decirlo bien.',
    'natal:mercury|house|9':
      'Mercurio en la Casa 9 expande la mente mas alla de lo cotidiano, con interes genuino en la filosofia, la ensenanza, la escritura de largo alcance y el contacto con formas de pensar distintas. Hay una aptitud para comunicar conceptos amplios, articular visiones del mundo y aprender a traves de viajes, culturas y sistemas de creencia. La escritura academica, la docencia y la publicacion son canales naturales de expresion para este posicionamiento.',
    'natal:mercury|house|10':
      'Mercurio en la Casa 10 orienta las habilidades comunicativas hacia la vida publica y profesional, haciendo de la palabra un recurso central en la construccion de reputacion y autoridad. Hay una tendencia hacia carreras que involucran escritura, oratoria, ensenanza o gestion de informacion en posiciones visibles. La credibilidad suele construirse a traves de la calidad de las ideas y la claridad con que se comunican.',
    'natal:mercury|house|11':
      'Mercurio en la Casa 11 conecta la mente al colectivo, haciendo del intercambio de ideas en grupos, redes y movimientos una fuente natural de estimulo intelectual. Hay placer genuino en el debate, la colaboracion en proyectos de gran alcance y la comunicacion de ideas que beneficien a un publico amplio. La inteligencia colectiva funciona mejor que el pensamiento solitario — este Mercurio prospera en contacto con mentes diversas.',
    'natal:mercury|house|12':
      'Mercurio en la Casa 12 internaliza los procesos mentales, creando una vida intelectual mas intuitiva, reflexiva y menos orientada a la expresion publica. Hay tendencia hacia el pensamiento simbolico, los suenos y las conexiones que emergen del inconsciente, convirtiendo la introspeccion en un modo natural de procesamiento. La escritura privada, la meditacion y el trabajo mental en espacios de silencio tienden a ser mas productivos que los entornos de intercambio intenso.',
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
    // ── Luna ─────────────────────────────────────────────────────────────────
    'natal:moon|house|1':
      'La Luna nella Casa 1 rende le emozioni, la sensibilita e le reazioni istintive parte visibile della presenza personale. Vi e una tendenza naturale a cogliere il tono emotivo dell ambiente e rispondere con empatia, il che attira le persone ma puo generare instabilita emotiva senza un costante prendersi cura di se. L espressione personale e fluida, cambia con il contesto e riflette i bisogni emotivi del momento.',
    'natal:moon|house|2':
      'La Luna nella Casa 2 collega la sicurezza emotiva direttamente alla stabilita materiale, rendendo finanze e possessi temi di grande carica affettiva. Il conforto, il nutrimento e il prendersi cura del proprio ambiente sono fonti naturali di benessere interiore. Il rapporto con il denaro tende a essere ciclico, alternando accumulo e generosita a seconda dello stato emotivo.',
    'natal:moon|house|3':
      'La Luna nella Casa 3 rende la comunicazione un canale naturale di espressione emotiva, con tendenza a parlare, scrivere e connettersi attraverso parole cariche di sentimento. La mente e intuitiva e ricettiva, cogliendo sfumature sottili nell ambiente e nelle persone vicine. Fratelli, vicinato e spostamenti brevi tendono ad avere un peso emotivo significativo nella storia personale.',
    'natal:moon|house|4':
      'La Luna nella Casa 4 radica profondamente i bisogni emotivi nella casa, nella famiglia e nelle radici — uno dei posizionamenti piu forti per la Luna nel tema natale. Vi e un forte legame affettivo con la figura materna e con il senso di appartenenza familiare, che diventa la base dell equilibrio interiore. La casa e molto piu di uno spazio fisico — e il centro emotivo della vita.',
    'natal:moon|house|5':
      'La Luna nella Casa 5 porta una emotivita creativa ed espressiva, con un forte bisogno di affetto, riconoscimento e coinvolgimento ludico con il mondo. Vi e un intenso legame emotivo con i figli, le arti e le relazioni romantiche, dove sentire e creare si intrecciano. Il piacere e l espressione genuina sono fonti fondamentali di nutrimento emotivo.',
    'natal:moon|house|6':
      'La Luna nella Casa 6 collega il benessere emotivo alla routine, al lavoro e all atto di servire e curare i dettagli. Il nutrimento fisico, l igiene e l organizzazione quotidiana hanno un peso emotivo significativo, e lo stato interiore si riflette spesso nella salute e nel corpo. Quando la routine e in ordine, le emozioni tendono a stabilizzarsi.',
    'natal:moon|house|7':
      'La Luna nella Casa 7 orienta i bisogni emotivi verso le relazioni intime e le partnership, rendendo l altro una fonte centrale di nutrimento affettivo. Vi e una sensibilita accentuata verso cio che l altro sente e ha bisogno, che favorisce l empatia ma puo generare dipendenza emotiva. Trovare equilibrio tra dare e ricevere nei legami e un apprendimento continuo.',
    'natal:moon|house|8':
      'La Luna nella Casa 8 immerge le emozioni in profondita intense, legando la vita emotiva alla trasformazione, all intimita e a cio che e nascosto. Vi e un intuito acuto per cio che si cela sotto la superficie, con un naturale interesse per la psicologia, il mistero e gli strati piu densi dell esistenza. La crescita emotiva viene dal nominare e integrare cio che era tenuto nascosto.',
    'natal:moon|house|9':
      'La Luna nella Casa 9 connette il mondo emotivo alla ricerca di senso, alla fede e all espansione degli orizzonti. Vi e una fame emotiva di apprendimento, viaggi e contatto con culture diverse, che funziona come nutrimento interiore. Le credenze religiose o filosofiche possono avere una forte carica affettiva e influenzare decisioni che emergono dal campo emotivo.',
    'natal:moon|house|10':
      'La Luna nella Casa 10 pone la vita emotiva in diretto contatto con la sfera pubblica e professionale, rendendo la carriera un campo di espressione dei bisogni affettivi. Vi e una sensibilita naturale verso cio di cui il pubblico o il collettivo ha bisogno, che puo favorire carriere nel campo della cura, della comunicazione o della leadership empatica. Il rapporto con la figura materna spesso influenza la costruzione del percorso professionale.',
    'natal:moon|house|11':
      'La Luna nella Casa 11 orienta il mondo emotivo verso i gruppi, le amicizie e le cause collettive, rendendo il senso di appartenenza a qualcosa di piu grande un bisogno affettivo reale. Vi e una soddisfazione emotiva genuina nel collaborare, supportare reti e investire in amicizie profonde. L umore e il benessere interiore tendono a rispondere allo stato delle relazioni collettive e al clima dei gruppi frequentati.',
    'natal:moon|house|12':
      'La Luna nella Casa 12 internalizza le emozioni in modo profondo, creando una vita interiore ricca ma a volte difficile da accedere o comunicare. Vi e una sensibilita sottile alla sofferenza degli altri, intuizione sviluppata e una connessione naturale con cio che va oltre il visibile. Il lavoro di autoconoscenza e il contatto con la propria vita emotiva sono percorsi fondamentali di nutrimento interiore.',
    // ── Mercurio ─────────────────────────────────────────────────────────────
    'natal:mercury|house|1':
      'Mercurio nella Casa 1 fa della comunicazione una parte centrale della presenza personale, con la mente e la parola che funzionano come presentazione naturale nel mondo. Vi e una tendenza a elaborare il contesto con rapidita e chiarezza, con vivace curiosita e facilita di adattamento a diversi interlocutori. La sfida permanente e imparare ad ascoltare con la stessa intensita con cui si parla.',
    'natal:mercury|house|2':
      'Mercurio nella Casa 2 orienta la mente verso questioni pratiche di risorse, valore e sostentamento, rendendo il pensiero uno strumento diretto di costruzione materiale. Vi e una naturale attitudine a negoziare, valutare e articolare proposte legate a finanze, affari e cio che ha valore concreto. Le idee funzionano come capitale — quanto piu sono sviluppate, maggiore e la loro capacita di generare sicurezza e stabilita.',
    'natal:mercury|house|3':
      'Mercurio nella Casa 3 e una posizione di grande agio per il pianeta della mente, che favorisce la comunicazione fluente, l apprendimento rapido e lo scambio ricco con l ambiente circostante. Vi e una curiosita naturale per la vita quotidiana, il linguaggio e i flussi di informazione — fratelli, vicini e spostamenti brevi tendono a essere fonti di stimolo costante. La versatilita mentale e una risorsa preziosa, ma la profondita puo richiedere uno sforzo aggiuntivo.',
    'natal:mercury|house|4':
      'Mercurio nella Casa 4 connette la mente e il linguaggio al mondo privato e familiare — i ricordi dell infanzia e la storia della casa tendono a modellare i pattern di pensiero. Vi e una capacita intuitiva di elaborare il passato e di usare la comunicazione come modo di nutrire o organizzare l ambiente domestico. La scrittura riflessiva, la terapia o il diario personale possono essere canali importanti di elaborazione interna.',
    'natal:mercury|house|5':
      'Mercurio nella Casa 5 porta leggerezza, creativita e piacere intellettuale nella comunicazione, favorendo la scrittura espressiva, l umorismo e lo scambio di idee come forma di divertimento. Vi e una tendenza verso il pensiero originale, il gioco di parole e la capacita di insegnare o comunicare con una dose naturale di intrattenimento. L espressione creativa attraverso il linguaggio — nella scrittura, sul palco o nell insegnamento — tende a essere una fonte genuina di soddisfazione.',
    'natal:mercury|house|6':
      'Mercurio nella Casa 6 dirige la mente verso l analisi, il dettaglio e la ricerca di efficienza nei processi quotidiani. Vi e una naturale attitudine a organizzare le informazioni, identificare le lacune e perfezionare i metodi di lavoro — la mente funziona bene quando e orientata verso compiti concreti e pratici. Il legame tra mente e corpo e pronunciato, con lo stato mentale che si riflette direttamente nella salute e nella vitalita fisica.',
    'natal:mercury|house|7':
      'Mercurio nella Casa 7 pone la comunicazione al centro delle relazioni significative, rendendo il dialogo, la negoziazione e la comprensione reciproca strumenti essenziali nei legami. Vi e una tendenza ad attrarre partner intellettualmente stimolanti e a costruire relazioni basate sullo scambio verbale e mentale. La sfida e usare la mente per approfondire i legami invece di limitarsi ad analizzare o razionalizzare cio che si prova.',
    'natal:mercury|house|8':
      'Mercurio nella Casa 8 sviluppa una mente investigativa, attratta da cio che e nascosto, dai meccanismi psicologici e dagli strati piu profondi della realta. Vi e un talento naturale per la ricerca, il riconoscimento di pattern nascosti e la gestione di informazioni sensibili o complesse. La comunicazione tende a essere attenta e precisa — questo Mercurio preferisce dire poco e dirlo bene.',
    'natal:mercury|house|9':
      'Mercurio nella Casa 9 espande la mente oltre il quotidiano, con un genuino interesse per la filosofia, l insegnamento, la scrittura di ampio respiro e il contatto con modi di pensare diversi. Vi e una attitudine a comunicare concetti ampi, articolare visioni del mondo e imparare attraverso viaggi, culture e sistemi di credenza. La scrittura accademica, l insegnamento e la pubblicazione sono canali naturali di espressione per questo posizionamento.',
    'natal:mercury|house|10':
      'Mercurio nella Casa 10 orienta le capacita comunicative verso la vita pubblica e professionale, rendendo la parola una risorsa centrale nella costruzione di reputazione e autorita. Vi e una tendenza verso carriere che coinvolgono scrittura, oratoria, insegnamento o gestione delle informazioni in posizioni di visibilita. La credibilita tende a costruirsi attraverso la qualita delle idee e la chiarezza con cui vengono comunicate.',
    'natal:mercury|house|11':
      'Mercurio nella Casa 11 connette la mente al collettivo, rendendo lo scambio di idee in gruppi, reti e movimenti una fonte naturale di stimolo intellettuale. Vi e un genuino piacere nel dibattito, nella collaborazione su progetti di ampia portata e nella comunicazione di idee che beneficiano un vasto pubblico. L intelligenza collettiva funziona meglio del pensiero solitario — questo Mercurio prospera nel contatto con menti diverse.',
    'natal:mercury|house|12':
      'Mercurio nella Casa 12 interiorizza i processi mentali, creando una vita intellettuale piu intuitiva, riflessiva e meno orientata alla espressione pubblica. Vi e una tendenza verso il pensiero simbolico, i sogni e le connessioni che emergono dall inconscio, rendendo l introspezione un modo naturale di elaborazione. La scrittura privata, la meditazione e il lavoro mentale in spazi di silenzio tendono a essere piu produttivi degli ambienti di scambio intenso.',
  },
}
