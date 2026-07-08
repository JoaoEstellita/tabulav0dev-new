// Catálogo i18n: Nódulos Lunares — eixo Nódulo Norte por signo
// 36 entradas: 12 signos × 3 idiomas (en-US, es-ES, it-IT)
// Regras:
//   en-US — sem "will", presente simples
//   es-ES — sem acentos (sin tildes)
//   it-IT — sem acentos e sem apóstrofos

import type { AppLanguage } from '../i18n/appI18n'

export const LUNAR_NODE_SIGN_I18N_OVERRIDES: Partial<Record<AppLanguage, Record<string, string>>> = {

  'en-US': {
    'natal:nn_sign_aries':
      'The North Node in Aries invites you to develop autonomy, initiative, and the courage to act on your own behalf. The South Node in Libra marks a comfort zone in relationships: the familiar tendency is to decide through the eyes of others, postpone choices to preserve harmony, and define yourself through partnership. Growth comes from discovering what you want regardless of pleasing anyone, holding your own positions, and learning that healthy conflict does not destroy true bonds — it strengthens the presence you bring to them.',

    'natal:nn_sign_taurus':
      'The North Node in Taurus invites you to build stability, presence in the body, and a serene relationship with your own worth. The South Node in Scorpio points to familiarity with intensity: crises, deep emotional fusion, and the feeling that only the dramatic is real. The growth path trades the roller coaster for constancy — learning to trust, relax control, nurture simple pleasures, and let security arise from within, without being tested by the abyss.',

    'natal:nn_sign_gemini':
      'The North Node in Gemini invites you to cultivate genuine curiosity, listening, and exchange with your immediate surroundings. The South Node in Sagittarius marks comfort in ready-made truths: the tendency is to preach instead of asking, generalize instead of observing, and cling to convictions that dismiss dissent. Growth happens when you allow yourself not to know, gather different perspectives before concluding, and discover that wisdom also lives in small conversations and everyday details.',

    'natal:nn_sign_cancer':
      'The North Node in Cancer invites you to develop emotional intimacy, care, and the courage to feel. The South Node in Capricorn points to a comfort zone in control and performance: the familiar tendency is to answer life with duty, structure, and self-sufficiency, keeping emotions under management. The growth path involves allowing vulnerability, receiving care as well as providing it, and recognizing that belonging to an inner home matters as much as any external achievement.',

    'natal:nn_sign_leo':
      'The North Node in Leo invites you to occupy the center of your own life: express talents with authorship, create, lead from the heart, and allow yourself to be seen. The South Node in Aquarius marks comfort in the neutrality of the group — observing from afar, serving the collective cause, and avoiding the risk of being special. Growth happens when you stop diluting your own light for the sake of belonging and discover that expressing who you are, with generosity, is also a way of serving.',

    'natal:nn_sign_virgo':
      'The North Node in Virgo invites you to embody: turn inspiration into practice, vision into craft, intention into routines that sustain. The South Node in Pisces points to familiarity with the diffuse — dreaming, absorbing the emotions of others, escaping the concrete when it weighs. The growth path asks for loving discernment: separating the essential from the illusory, caring for the body and the details, and discovering that the sacred also shows itself in work well done and everyday service.',

    'natal:nn_sign_libra':
      'The North Node in Libra invites you to develop the art of encounter: cooperating, listening, and building with others what cannot be built alone. The South Node in Aries marks a comfort zone in self-sufficiency — solving everything on your own, competing, and imposing your own pace. Growth comes from noticing that winning alone satisfies less than it seemed, valuing what others think and feel, and learning that balancing interests does not mean losing identity — it expands it.',

    'natal:nn_sign_scorpio':
      'The North Node in Scorpio invites you to dive deep: real intimacy, transformation, and the courage to share resources and vulnerabilities. The South Node in Taurus points to comfort in the stable and the accumulated — clinging to what is safe, resisting change, and confusing possession with security. The growth path asks for release of what no longer serves, willingness to cross crises as portals of renewal, and the discovery that true solidity survives transformation.',

    'natal:nn_sign_sagittarius':
      'The North Node in Sagittarius invites you to lift your gaze: seek meaning, trust intuition, and live life as a journey that expands consciousness. The South Node in Gemini marks comfort in mental dispersion — collecting information, opining on everything, and getting lost in a thousand curiosities without synthesis. Growth happens when you choose a direction that resonates deeply, turn data into lived understanding, and accept that some truths only reveal themselves to those who walk the path.',

    'natal:nn_sign_capricorn':
      'The North Node in Capricorn invites you to take authority over your own life: set goals, sustain commitments, and build something that lasts. The South Node in Cancer points to familiarity with emotional dependence — seeking shelter, reacting through sensitivity, and using the past as refuge. The growth path involves maturing without hardening: honoring your roots without living in them, turning the need for protection into the capacity to structure, and discovering the pleasure of being responsible for your own destiny.',

    'natal:nn_sign_aquarius':
      'The North Node in Aquarius invites you to serve something larger than your own stage: causes, networks, a vision of the future, and a freedom that includes everyone. The South Node in Leo marks comfort in centrality — the familiar need for applause, personal recognition, and drama as a way of existing. Growth happens when individual brilliance becomes collective contribution, when you lead without needing to be the center, and discover that belonging to a shared vision frees you more than any audience.',

    'natal:nn_sign_pisces':
      'The North Node in Pisces invites you to trust the flow: develop faith, compassion, and the capacity to surrender to what cannot be controlled. The South Node in Virgo points to comfort in analysis and refinement — the familiar tendency is to manage life through details, criticize the imperfect, and believe that only meticulous effort guarantees safety. The growth path asks you to loosen excess control, welcome mystery and imperfection, and discover that a larger order works in your favor when you stop supervising it.',
  },

  'es-ES': {
    // Regra: sem acentos (sin tildes)
    'natal:nn_sign_aries':
      'El Nodo Norte en Aries invita a desarrollar autonomia, iniciativa y el coraje de actuar en nombre propio. El Nodo Sur en Libra marca una zona de confort en las relaciones: la tendencia familiar es decidir por los ojos del otro, aplazar elecciones para preservar la armonia y definirse por la pareja. El crecimiento pasa por descubrir lo que quieres sin buscar agradar, sostener posiciones propias y aprender que el conflicto sano no destruye los vinculos verdaderos — fortalece la presencia con la que llegas a ellos.',

    'natal:nn_sign_taurus':
      'El Nodo Norte en Tauro invita a construir estabilidad, presencia en el cuerpo y una relacion serena con el propio valor. El Nodo Sur en Escorpio apunta a familiaridad con la intensidad: crisis, fusiones emocionales profundas y la sensacion de que solo lo dramatico es real. El camino de crecimiento cambia la montana rusa por la constancia — aprender a confiar, relajar el control, nutrir placeres simples y dejar que la seguridad nazca de dentro, sin necesidad de ser probada por el abismo.',

    'natal:nn_sign_gemini':
      'El Nodo Norte en Geminis invita a cultivar curiosidad genuina, escucha e intercambio con el entorno inmediato. El Nodo Sur en Sagitario indica confort en las grandes verdades listas: la tendencia es predicar en vez de preguntar, generalizar en vez de observar y aferrarse a convicciones que descartan lo contrario. El crecimiento ocurre cuando te permites no saber, reunes perspectivas diferentes antes de concluir y descubres que la sabiduria tambien vive en las conversaciones pequenas y en los detalles cotidianos.',

    'natal:nn_sign_cancer':
      'El Nodo Norte en Cancer invita a desarrollar intimidad emocional, cuidado y el coraje de sentir. El Nodo Sur en Capricornio apunta a una zona de confort en el control y el desempeno: la tendencia familiar es responder a la vida con deber, estructura y autosuficiencia, manteniendo las emociones bajo gestion. El camino de crecimiento pasa por permitir la vulnerabilidad, recibir cuidado ademas de proveerlo y reconocer que pertenecer a un hogar interno importa tanto como cualquier conquista externa.',

    'natal:nn_sign_leo':
      'El Nodo Norte en Leo invita a ocupar el centro de la propia vida: expresar talentos con autoria, crear, liderar desde el corazon y permitirse ser visto. El Nodo Sur en Acuario marca confort en la neutralidad del grupo — observar de lejos, servir a la causa colectiva y evitar el riesgo de ser especial. El crecimiento ocurre cuando dejas de diluir tu propio brillo en nombre de la pertenencia y descubres que expresar quien eres, con generosidad, tambien es una forma de servir.',

    'natal:nn_sign_virgo':
      'El Nodo Norte en Virgo invita a encarnar: transformar inspiracion en practica, vision en oficio, intencion en rutina que sostiene. El Nodo Sur en Piscis apunta a familiaridad con lo difuso — sonar, absorber emociones ajenas, escapar de lo concreto cuando pesa. El camino de crecimiento pide discernimiento amoroso: separar lo esencial de lo ilusorio, cuidar el cuerpo y los detalles, y descubrir que lo sagrado tambien se manifiesta en la tarea bien hecha y el servicio cotidiano.',

    'natal:nn_sign_libra':
      'El Nodo Norte en Libra invita a desarrollar el arte del encuentro: cooperar, escuchar y construir con el otro lo que no se construye solo. El Nodo Sur en Aries indica una zona de confort en la autosuficiencia — resolver todo por cuenta propia, competir e imponer el propio ritmo. El crecimiento pasa por percibir que vencer solo satisface menos de lo que parecia, valorar lo que el otro piensa y siente, y aprender que equilibrar intereses no es perder identidad — es ampliarla.',

    'natal:nn_sign_scorpio':
      'El Nodo Norte en Escorpio invita a sumergirse: intimidad real, transformacion y el coraje de compartir recursos y vulnerabilidades. El Nodo Sur en Tauro apunta a confort en lo estable y lo acumulado — aferrarse a lo seguro, resistir los cambios y confundir posesion con seguridad. El camino de crecimiento pide desapego de lo que ya no sirve, disposicion para atravesar crisis como portales de renovacion y el descubrimiento de que la verdadera solidez sobrevive a las transformaciones.',

    'natal:nn_sign_sagittarius':
      'El Nodo Norte en Sagitario invita a levantar la mirada: buscar sentido, confiar en la intuicion y vivir la vida como travesia que expande la conciencia. El Nodo Sur en Geminis indica confort en la dispersion mental — coleccionar informacion, opinar sobre todo y perderse en mil curiosidades sin sintesis. El crecimiento ocurre cuando eliges una direccion que vibra grande, transformas datos en comprension vivida y aceptas que algunas verdades solo se revelan a quien camina.',

    'natal:nn_sign_capricorn':
      'El Nodo Norte en Capricornio invita a asumir autoridad sobre la propia vida: definir metas, sostener compromisos y construir algo que permanezca. El Nodo Sur en Cancer apunta a familiaridad con la dependencia emocional — buscar amparo, reaccionar por la sensibilidad y usar el pasado como refugio. El camino de crecimiento pasa por madurar sin endurecer: honrar las raices sin vivir en ellas, transformar la necesidad de proteccion en capacidad de estructurar y descubrir el placer de ser responsable del propio destino.',

    'natal:nn_sign_aquarius':
      'El Nodo Norte en Acuario invita a servir a algo mayor que el propio escenario: causas, redes, vision de futuro y la libertad que incluye a todos. El Nodo Sur en Leo marca confort en la centralidad — la necesidad familiar de aplauso, reconocimiento personal y drama como forma de existir. El crecimiento ocurre cuando el brillo individual se vuelve contribucion colectiva, cuando lideras sin necesidad de ser el centro y descubres que pertenecer a una vision compartida libera mas que cualquier publico.',

    'natal:nn_sign_pisces':
      'El Nodo Norte en Piscis invita a confiar en el flujo: desarrollar fe, compasion y la capacidad de rendirse a lo que no se controla. El Nodo Sur en Virgo apunta a confort en el analisis y el perfeccionamiento — la tendencia familiar es gestionar la vida por los detalles, criticar lo imperfecto y creer que solo el esfuerzo meticuloso garantiza seguridad. El camino de crecimiento pide soltar el exceso de control, acoger el misterio y la imperfeccion, y descubrir que existe un orden mayor que trabaja a tu favor cuando dejas de supervisarlo.',
  },

  'it-IT': {
    // Regra: sem acentos e sem apóstrofos
    'natal:nn_sign_aries':
      'Il Nodo Nord in Ariete invita a sviluppare autonomia, iniziativa e il coraggio di agire in nome proprio. Il Nodo Sud in Bilancia segna una zona di comfort nelle relazioni: la tendenza familiare e decidere attraverso gli occhi degli altri, rimandare le scelte per preservare la armonia e definirsi attraverso il legame. La crescita passa dallo scoprire cio che vuoi senza cercare di piacere, sostenere posizioni proprie e imparare che il conflitto sano non distrugge i legami veri — rafforza la presenza con cui arrivi in essi.',

    'natal:nn_sign_taurus':
      'Il Nodo Nord in Toro invita a costruire stabilita, presenza nel corpo e una relazione serena con il proprio valore. Il Nodo Sud in Scorpione indica familiarita con la intensita: crisi, fusioni emotive profonde e la sensazione che solo il drammatico sia reale. Il cammino di crescita scambia le montagne russe con la costanza — imparare a fidarsi, allentare il controllo, nutrire piaceri semplici e lasciare che la sicurezza nasca da dentro, senza dover essere messa alla prova dallo abisso.',

    'natal:nn_sign_gemini':
      'Il Nodo Nord in Gemelli invita a coltivare curiosita genuina, ascolto e scambio con lo ambiente immediato. Il Nodo Sud in Sagittario segna comfort nelle grandi verita pronte: la tendenza e predicare invece di domandare, generalizzare invece di osservare e aggrapparsi a convinzioni che escludono il contraddittorio. La crescita avviene quando ti permetti di non sapere, raccogli prospettive diverse prima di concludere e scopri che la saggezza vive anche nelle piccole conversazioni e nei dettagli quotidiani.',

    'natal:nn_sign_cancer':
      'Il Nodo Nord in Cancro invita a sviluppare intimita emotiva, cura e il coraggio di sentire. Il Nodo Sud in Capricorno indica una zona di comfort nel controllo e nella prestazione: la tendenza familiare e rispondere alla vita con dovere, struttura e autosufficienza, tenendo le emozioni sotto gestione. Il cammino di crescita passa dal permettere la vulnerabilita, ricevere cura oltre a offrirla e riconoscere che appartenere a una casa interiore conta quanto qualsiasi conquista esterna.',

    'natal:nn_sign_leo':
      'Il Nodo Nord in Leone invita a occupare il centro della propria vita: esprimere talenti con firma propria, creare, guidare con il cuore e permettersi di essere visti. Il Nodo Sud in Aquario segna comfort nella neutralita del gruppo — osservare da lontano, servire la causa collettiva ed evitare il rischio di essere speciali. La crescita avviene quando smetti di diluire la tua luce in nome della appartenenza e scopri che esprimere chi sei, con generosita, e anche un modo di servire.',

    'natal:nn_sign_virgo':
      'Il Nodo Nord in Vergine invita a incarnare: trasformare ispirazione in pratica, visione in mestiere, intenzione in routine che sostiene. Il Nodo Sud in Pesci indica familiarita con il diffuso — sognare, assorbire emozioni altrui, sfuggire al concreto quando pesa. Il cammino di crescita chiede discernimento amorevole: separare lo essenziale dallo illusorio, curare il corpo e i dettagli, e scoprire che il sacro si manifesta anche nel lavoro ben fatto e nel servizio quotidiano.',

    'natal:nn_sign_libra':
      'Il Nodo Nord in Bilancia invita a sviluppare la arte dello incontro: cooperare, ascoltare e costruire con gli altri cio che non si costruisce da soli. Il Nodo Sud in Ariete indica una zona di comfort nella autosufficienza — risolvere tutto da soli, competere e imporre il proprio ritmo. La crescita passa dal percepire che vincere da soli soddisfa meno di quanto sembrava, valorizzare cio che gli altri pensano e sentono, e imparare che equilibrare interessi non significa perdere identita — significa ampliarla.',

    'natal:nn_sign_scorpio':
      'Il Nodo Nord in Scorpione invita a immergersi: intimita reale, trasformazione e il coraggio di condividere risorse e vulnerabilita. Il Nodo Sud in Toro indica comfort nello stabile e nello accumulato — aggrapparsi al sicuro, resistere ai cambiamenti e confondere possesso con sicurezza. Il cammino di crescita chiede distacco da cio che non serve piu, disponibilita ad attraversare le crisi come portali di rinnovamento e la scoperta che la vera solidita sopravvive alle trasformazioni.',

    'natal:nn_sign_sagittarius':
      'Il Nodo Nord in Sagittario invita ad alzare lo sguardo: cercare senso, fidarsi della intuizione e vivere la vita come traversata che espande la coscienza. Il Nodo Sud in Gemelli segna comfort nella dispersione mentale — collezionare informazioni, opinare su tutto e perdersi in mille curiosita senza sintesi. La crescita avviene quando scegli una direzione che vibra in grande, trasformi dati in comprensione vissuta e accetti che alcune verita si rivelano solo a chi cammina.',

    'natal:nn_sign_capricorn':
      'Il Nodo Nord in Capricorno invita ad assumere autorita sulla propria vita: definire mete, sostenere impegni e costruire qualcosa che resti. Il Nodo Sud in Cancro indica familiarita con la dipendenza emotiva — cercare riparo, reagire con la sensibilita e usare il passato come rifugio. Il cammino di crescita passa dal maturare senza indurirsi: onorare le radici senza abitarci, trasformare il bisogno di protezione in capacita di strutturare e scoprire il piacere di essere responsabile del proprio destino.',

    'natal:nn_sign_aquarius':
      'Il Nodo Nord in Aquario invita a servire qualcosa di piu grande del proprio palco: cause, reti, visione del futuro e una liberta che include tutti. Il Nodo Sud in Leone segna comfort nella centralita — il bisogno familiare di applauso, riconoscimento personale e dramma come modo di esistere. La crescita avviene quando la luce individuale diventa contributo collettivo, quando guidi senza bisogno di essere il centro e scopri che appartenere a una visione condivisa libera piu di qualsiasi platea.',

    'natal:nn_sign_pisces':
      'Il Nodo Nord in Pesci invita a fidarsi del flusso: sviluppare fede, compassione e la capacita di arrendersi a cio che non si controlla. Il Nodo Sud in Vergine indica comfort nella analisi e nel perfezionamento — la tendenza familiare e gestire la vita attraverso i dettagli, criticare lo imperfetto e credere che solo lo sforzo meticoloso garantisca sicurezza. Il cammino di crescita chiede di allentare il controllo eccessivo, accogliere il mistero e la imperfezione, e scoprire che esiste un ordine piu grande che lavora a tuo favore quando smetti di sorvegliarlo.',
  },
}
