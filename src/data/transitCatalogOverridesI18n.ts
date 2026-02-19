import type { AppLanguage } from '../i18n/appI18n'

type TransitOverrideMap = Record<string, string>

export const TRANSIT_CATALOG_I18N_OVERRIDES: Partial<Record<AppLanguage, TransitOverrideMap>> = {
  'en-US': {
    'transit:jupiter|conjuncao|meio_do_ceu':
      'Jupiter conjunct Midheaven can increase visibility and open room for professional growth. This cycle favors recognition when direction is clear, execution is consistent, and expectations stay realistic. Avoid overpromising and consolidate progress in practical steps.',
    'transit:jupiter|sextil|meio_do_ceu':
      'Jupiter sextile Midheaven supports agreements and momentum for career development. This phase tends to be favorable for expansion with strategy and focus on priorities. Small, well-executed decisions can produce meaningful medium-term impact.',
    'transit:jupiter|trigono|meio_do_ceu':
      'Jupiter trine Midheaven improves flow in public and professional goals. Recognition is more likely when technical quality is paired with clear communication. Use this phase to build sustainable growth without excess confidence.',
    'transit:saturn|quadratura|saturn':
      'Saturn square Saturn marks a period of structural review and maturity. Pressure may arise to adjust timelines, limits, and responsibilities more objectively. Gains come from simplifying commitments and reinforcing what truly sustains your plan.',
    'transit:saturn|sextil|sun':
      'Saturn sextile Sun supports discipline, stability, and consistent progress. This phase helps translate intention into results through routine and criteria. Advances may come in smaller but steadier steps.',
    'transit:saturn|trigono|sun':
      'Saturn trine Sun reinforces focus, consistency, and practical confidence in decisions. This period tends to support consolidation of goals with less dispersion. Prioritize essentials and keep a sustainable pace.',
    'transit:saturn|oposicao|uranus':
      'Saturn opposition Uranus brings tension between stability and the need for change. This cycle asks for balance between preserving structure and opening room for smart adjustments. Avoid extremes and move with controlled experiments.',
    'transit:saturn|quadratura|uranus':
      'Saturn square Uranus signals friction between control and renewal. Discomfort may appear around old rules or changes that move too fast. Best use of this phase is to reorganize processes without breaking what still works.',
    'transit:saturn|sextil|mars':
      'Saturn sextile Mars favors disciplined action and efficient execution. Energy tends to perform better when priorities are organized and impulsive reactions are reduced. Good period to complete demanding tasks with consistency.',
    'transit:saturn|trigono|mars':
      'Saturn trine Mars strengthens productivity, persistence, and long-range strategy. This phase helps convert effort into concrete results with less waste. Direct energy to clear and measurable goals.',
    'transit:saturn|sextil|saturn':
      'Saturn sextile Saturn supports consolidation and maturity of important structures. The period favors reviewing processes, contracts, and responsibilities with pragmatism. Gradual adjustments can build a more stable foundation.',
    'transit:saturn|trigono|saturn':
      'Saturn trine Saturn indicates functional stability and good organizational capacity. It is easier to keep discipline and complete stages with quality. Use the period to consolidate fundamentals and reduce operational noise.',
    'transit:sun|oposicao|pluto':
      'Sun opposition Pluto intensifies themes of control, personal power, and real priorities. This cycle may expose polarities that ask for a conscious stance with less reactivity. Focus on what is essential with firmness and no unnecessary confrontation.',
    'transit:saturn|oposicao|mars':
      'Saturn opposition Mars can create a sense of braking or delay in execution. This phase asks to calibrate force and timing, avoiding both impulsiveness and total blockage. Tactical planning and consistency help recover traction safely.',
    'transit:saturn|quadratura|mercury':
      'Saturn square Mercury demands precision in communication and review of assumptions. Extra mental pressure, delays, or need for details may arise. Validate information, simplify messages, and progress in stages.',
    'transit:saturn|quadratura|sun':
      'Saturn square Sun raises responsibility and tests consistency. The period can feel more demanding, asking focus on essentials and reduction of excess. Structure, rest, and clear priorities prevent unproductive strain.',
    'transit:saturn|sextil|venus':
      'Saturn sextile Venus supports mature choices in relationships, agreements, and values. This phase favors sustainable commitment with less idealization and more practical coherence. Good period to align expectations and strengthen reliable bonds.',
    'transit:saturn|trigono|venus':
      'Saturn trine Venus reinforces affective and financial stability through criteria. There is a tendency to prefer quality, consistency, and long-term agreements. Use the cycle to consolidate what has real value in your routine.',
    'transit:saturn|sextil|jupiter':
      'Saturn sextile Jupiter combines expansion with strategic realism. The period favors growth with planning while preserving structural safety. Move with concrete goals, clear deadlines, and periodic reviews.',
    'transit:saturn|trigono|jupiter':
      'Saturn trine Jupiter supports consistent growth with balance between vision and execution. This phase tends to ease solid progress when method and patience are present. Structure opportunities in stages for durable results.',
    'transit:pluto|ingress|house_10':
      'Pluto entering House 10 tends to begin a deep repositioning cycle in career, reputation, and public direction. This phase often asks for more authentic choices and less compromise with paths that no longer fit. Move with medium-term strategy and pace your visibility to what you can sustain.',
    'transit:pluto|ingress|house_4':
      'Pluto entering House 4 tends to deepen themes around emotional foundations, family, and home structure. This cycle may expose old patterns that no longer support inner safety with quality. Best use of the phase is to reorganize your foundations with calm, firmness, and clearer boundaries.',
    'transit:saturn|ingress|house_10':
      'Saturn entering House 10 marks a professional consolidation phase through responsibility, consistency, and criteria. The tendency is to reduce dispersion, prioritize concrete delivery, and align expectations with real process. Use this period to build reputation with sustainable, predictable steps.',
    'transit:saturn|ingress|house_6':
      'Saturn entering House 6 supports reorganization of routine, daily work, and functional health through method. This cycle tends to ask for simple discipline, steadier rhythms, and cuts in recurring overload patterns. Small repeated adjustments can produce meaningful medium-term gains.',
    'transit:jupiter|ingress|house_2':
      'Jupiter entering House 2 tends to broaden opportunities around resources, values, and material safety. This phase favors growth when planning, risk criteria, and result tracking are present. Expansion with practical structure is usually more productive than enthusiasm without method.',
    'transit:jupiter|ingress|house_11':
      'Jupiter entering House 11 opens a favorable window for networks, collaboration, and future-oriented collective projects. This cycle tends to expand useful connections when goals are clear and reciprocity is real. Prioritize reliable alliances and turn contacts into concrete cooperation.',
    'transit:uranus|ingress|house_7':
      'Uranus entering House 7 tends to renew partnership dynamics, agreements, and key relationships. This period may ask for more autonomy, flexibility, and direct conversations about expectations on both sides. Conscious adjustments help avoid reactive breaks and support relational evolution.',
    'transit:neptune|ingress|house_12':
      'Neptune entering House 12 tends to increase sensitivity, intuition, and inner closure processes. This phase can heighten subtle perception and asks for discernment between intuition and idealization. Rest routines, silence, and mental hygiene help stabilize this cycle.',
    'transit:mars|ingress|house_10':
      'Mars entering House 10 raises drive to act in career and occupy space more visibly. The energy favors initiative when direction is clear and pacing is regulated to avoid burnout. Execute by priorities and convert urgency into measurable progress.',
    'transit:sun|ingress|house_10':
      'Sun entering House 10 highlights public goals, responsibility, and professional direction. This phase tends to support visibility when you combine presence, consistency, and clear communication. Focus on essentials and use exposure to reinforce coherent positioning.',
  },
  'es-ES': {
    'transit:jupiter|conjuncao|meio_do_ceu':
      'Jupiter en conjuncion al Medio Cielo puede aumentar visibilidad y abrir espacio para crecimiento profesional. Este ciclo favorece reconocimiento cuando hay direccion clara, ejecucion constante y expectativas realistas. Evita prometer de mas y consolida avances por etapas.',
    'transit:jupiter|sextil|meio_do_ceu':
      'Jupiter en sextil al Medio Cielo facilita acuerdos e impulso para evolucion profesional. Esta fase suele favorecer expansion con estrategia y foco en prioridades. Decisiones pequenas y bien ejecutadas pueden generar impacto relevante a medio plazo.',
    'transit:jupiter|trigono|meio_do_ceu':
      'Jupiter en trigono al Medio Cielo mejora fluidez en metas publicas y profesionales. El reconocimiento es mas probable cuando calidad tecnica y comunicacion clara van juntas. Aprovecha la fase para crecimiento sostenible, sin exceso de confianza.',
    'transit:saturn|quadratura|saturn':
      'Saturno en cuadratura con Saturno marca un periodo de revision estructural y madurez. Puede surgir presion para ajustar plazos, limites y responsabilidades con mas objetividad. La ganancia llega al simplificar compromisos y reforzar lo que sostiene tu plan.',
    'transit:saturn|sextil|sun':
      'Saturno en sextil al Sol favorece disciplina, estabilidad y progreso constante. Esta fase ayuda a convertir intencion en resultado mediante rutina y criterio. Los avances pueden venir en pasos mas pequenos, pero firmes.',
    'transit:saturn|trigono|sun':
      'Saturno en trigono al Sol refuerza foco, constancia y confianza practica en decisiones. Este periodo suele apoyar consolidacion de metas con menos dispersion. Prioriza lo esencial y manten un ritmo sostenible.',
    'transit:saturn|oposicao|uranus':
      'Saturno en oposicion a Urano trae tension entre estabilidad y necesidad de cambio. Este ciclo pide equilibrio entre conservar estructura y abrir espacio para ajustes inteligentes. Evita extremos y avanza con experimentos controlados.',
    'transit:saturn|quadratura|uranus':
      'Saturno en cuadratura a Urano senala friccion entre control y renovacion. Puede aparecer incomodidad con reglas antiguas o con cambios demasiado rapidos. El mejor uso de la fase es reorganizar procesos sin romper lo que aun funciona.',
    'transit:saturn|sextil|mars':
      'Saturno en sextil a Marte favorece accion disciplinada y ejecucion eficiente. La energia rinde mejor cuando se ordenan prioridades y se reducen impulsos. Buen periodo para cerrar tareas exigentes con constancia.',
    'transit:saturn|trigono|mars':
      'Saturno en trigono a Marte fortalece productividad, persistencia y estrategia de largo plazo. Esta fase ayuda a transformar esfuerzo en resultado concreto con menor desgaste. Dirige energia a metas claras y medibles.',
    'transit:saturn|sextil|saturn':
      'Saturno en sextil a Saturno apoya consolidacion y madurez de estructuras importantes. El periodo favorece revisar procesos, acuerdos y responsabilidades con pragmatismo. Ajustes graduales pueden crear una base mas estable.',
    'transit:saturn|trigono|saturn':
      'Saturno en trigono a Saturno indica estabilidad funcional y buena capacidad organizativa. Hay mas facilidad para sostener disciplina y completar etapas con calidad. Usa el periodo para consolidar fundamentos y reducir ruido operativo.',
    'transit:sun|oposicao|pluto':
      'Sol en oposicion a Pluto intensifica temas de control, poder personal y prioridades reales. Este ciclo puede exponer polaridades que piden una postura mas consciente y menos reactiva. Enfocate en lo esencial con firmeza y sin confrontaciones innecesarias.',
    'transit:saturn|oposicao|mars':
      'Saturno en oposicion a Marte puede generar sensacion de freno o demora en la ejecucion. Esta fase pide calibrar fuerza y tiempo, evitando tanto impulso como bloqueo total. Planificacion tactica y constancia ayudan a recuperar traccion.',
    'transit:saturn|quadratura|mercury':
      'Saturno en cuadratura a Mercurio exige precision en comunicacion y revision de supuestos. Puede haber mayor exigencia mental, demoras o necesidad de detalle extra. Valida informacion, simplifica mensajes y avanza por etapas.',
    'transit:saturn|quadratura|sun':
      'Saturno en cuadratura al Sol aumenta sentido de responsabilidad y prueba de consistencia. El periodo puede sentirse mas exigente y pedir foco en lo esencial con recorte de excesos. Estructura, descanso y prioridades claras evitan desgaste inutil.',
    'transit:saturn|sextil|venus':
      'Saturno en sextil a Venus favorece elecciones maduras en vinculos, acuerdos y valores. Esta fase apoya compromiso sostenible con menos idealizacion y mas coherencia practica. Buen momento para alinear expectativas y fortalecer lazos confiables.',
    'transit:saturn|trigono|venus':
      'Saturno en trigono a Venus refuerza estabilidad afectiva y financiera mediante criterio. Hay tendencia a preferir calidad, constancia y acuerdos de largo plazo. Usa el ciclo para consolidar lo que tiene valor real en tu rutina.',
    'transit:saturn|sextil|jupiter':
      'Saturno en sextil a Jupiter combina expansion con realismo estrategico. El periodo favorece crecimiento con planificacion sin perder seguridad de base. Avanza con metas concretas, plazos claros y revisiones periodicas.',
    'transit:saturn|trigono|jupiter':
      'Saturno en trigono a Jupiter sostiene crecimiento constante con equilibrio entre vision y ejecucion. Esta fase suele facilitar progreso solido cuando hay metodo y paciencia. Estructura oportunidades por etapas para resultados duraderos.',
    'transit:pluto|ingress|house_10':
      'Pluton en ingreso a Casa 10 tiende a iniciar un ciclo de reposicionamiento profundo en carrera, reputacion y direccion publica. Esta fase suele pedir decisiones mas autenticas y menos concesion a caminos que ya no encajan. Avanza con estrategia de medio plazo y regula tu exposicion segun tu capacidad real.',
    'transit:pluto|ingress|house_4':
      'Pluton en ingreso a Casa 4 tiende a profundizar temas de base emocional, familia y estructura del hogar. Este ciclo puede revelar patrones antiguos que ya no sostienen seguridad interna con calidad. El mejor uso de la fase es reorganizar fundamentos con calma, firmeza y limites mas claros.',
    'transit:saturn|ingress|house_10':
      'Saturno en ingreso a Casa 10 marca una fase de consolidacion profesional mediante responsabilidad, constancia y criterio. La tendencia es reducir dispersion, priorizar entrega concreta y alinear expectativas con proceso real. Usa este periodo para construir reputacion con pasos sostenibles.',
    'transit:saturn|ingress|house_6':
      'Saturno en ingreso a Casa 6 favorece reorganizacion de rutina, trabajo diario y salud funcional con metodo. Este ciclo suele pedir disciplina simple, ritmos mas estables y recorte de sobrecarga recurrente. Pequenos ajustes repetidos pueden generar mejora relevante a medio plazo.',
    'transit:jupiter|ingress|house_2':
      'Jupiter en ingreso a Casa 2 tiende a ampliar oportunidades sobre recursos, valores y seguridad material. Esta fase favorece crecimiento cuando hay planificacion, criterio de riesgo y seguimiento de resultados. La expansion con estructura practica suele rendir mejor que entusiasmo sin metodo.',
    'transit:jupiter|ingress|house_11':
      'Jupiter en ingreso a Casa 11 abre ventana favorable para redes, colaboracion y proyectos colectivos de futuro. Este ciclo tiende a ampliar conexiones utiles cuando hay objetivo claro y reciprocidad real. Prioriza alianzas confiables y transforma contactos en cooperacion concreta.',
    'transit:uranus|ingress|house_7':
      'Urano en ingreso a Casa 7 tiende a renovar dinamicas de pareja, acuerdos y vinculos importantes. Este periodo puede pedir mas autonomia, flexibilidad y conversacion directa sobre expectativas de ambos lados. Ajustes conscientes ayudan a evitar rupturas reactivas y favorecen evolucion del vinculo.',
    'transit:neptune|ingress|house_12':
      'Neptuno en ingreso a Casa 12 tiende a ampliar sensibilidad, intuicion y procesos de cierre interno. Esta fase puede aumentar percepcion sutil y pide discernimiento para separar intuicion de idealizacion. Rutinas de descanso, silencio e higiene mental ayudan a estabilizar el ciclo.',
    'transit:mars|ingress|house_10':
      'Marte en ingreso a Casa 10 aumenta impulso para actuar en carrera y ocupar espacio con mayor visibilidad. La energia favorece iniciativa cuando hay direccion clara y regulacion del ritmo para evitar desgaste. Ejecuta por prioridades y convierte urgencia en progreso medible.',
    'transit:sun|ingress|house_10':
      'Sol en ingreso a Casa 10 ilumina metas publicas, responsabilidad y direccion profesional. Este momento tiende a favorecer visibilidad cuando combinas presencia, constancia y mensaje claro. Enfocate en lo esencial y usa la exposicion para reforzar posicionamiento coherente.',
  },
  'it-IT': {
    'transit:jupiter|conjuncao|meio_do_ceu':
      'Giove in congiunzione al Medio Cielo puo aumentare visibilita e aprire spazio a crescita professionale. Questo ciclo favorisce riconoscimento quando direzione, costanza e aspettative restano realistiche. Evita promesse eccessive e consolida progressi per fasi.',
    'transit:jupiter|sextil|meio_do_ceu':
      'Giove in sestile al Medio Cielo facilita accordi e slancio per evoluzione professionale. La fase tende a favorire espansione con strategia e priorita chiare. Piccole decisioni ben eseguite possono avere impatto concreto nel medio periodo.',
    'transit:jupiter|trigono|meio_do_ceu':
      'Giove in trigono al Medio Cielo migliora fluidita negli obiettivi pubblici e professionali. Il riconoscimento e piu probabile quando qualita tecnica e comunicazione chiara procedono insieme. Usa la fase per crescita sostenibile senza eccesso di fiducia.',
    'transit:saturn|quadratura|saturn':
      'Saturno in quadratura con Saturno indica un periodo di revisione strutturale e maturazione. Puo emergere pressione per regolare tempi, limiti e responsabilita con maggiore oggettivita. Il guadagno arriva semplificando impegni e rafforzando le basi reali.',
    'transit:saturn|sextil|sun':
      'Saturno in sestile al Sole favorisce disciplina, stabilita e progresso costante. Questa fase aiuta a tradurre intenzione in risultato con routine e criterio. I passi possono essere piccoli, ma piu solidi.',
    'transit:saturn|trigono|sun':
      'Saturno in trigono al Sole rafforza focus, costanza e fiducia pratica nelle decisioni. Il periodo tende a sostenere consolidamento degli obiettivi con meno dispersione. Dai priorita all essenziale e mantieni un ritmo sostenibile.',
    'transit:saturn|oposicao|uranus':
      'Saturno in opposizione a Urano porta tensione tra stabilita e bisogno di cambiamento. Questo ciclo chiede equilibrio tra preservare struttura e aprire spazio ad aggiustamenti intelligenti. Evita estremi e procedi con esperimenti controllati.',
    'transit:saturn|quadratura|uranus':
      'Saturno in quadratura a Urano segnala attrito tra controllo e rinnovamento. Puoi avvertire disagio verso regole vecchie o cambi troppo rapidi. Il miglior uso della fase e riorganizzare processi senza rompere cio che funziona.',
    'transit:saturn|sextil|mars':
      'Saturno in sestile a Marte favorisce azione disciplinata ed esecuzione efficiente. L energia rende meglio quando le priorita sono ordinate e l impulso viene regolato. Buon periodo per completare compiti impegnativi con costanza.',
    'transit:saturn|trigono|mars':
      'Saturno in trigono a Marte rafforza produttivita, perseveranza e strategia di lungo periodo. Questa fase aiuta a trasformare sforzo in risultato concreto con meno dispersione. Dirigi energia verso obiettivi chiari e misurabili.',
    'transit:saturn|sextil|saturn':
      'Saturno in sestile a Saturno sostiene consolidamento e maturita di strutture importanti. Il periodo favorisce revisione pragmatica di processi, accordi e responsabilita. Aggiustamenti graduali possono creare basi piu stabili.',
    'transit:saturn|trigono|saturn':
      'Saturno in trigono a Saturno indica stabilita funzionale e buona capacita organizzativa. Diventa piu semplice mantenere disciplina e completare tappe con qualita. Usa il periodo per consolidare fondamenta e ridurre rumore operativo.',
    'transit:sun|oposicao|pluto':
      'Sole in opposizione a Plutone intensifica temi di controllo, potere personale e priorita reali. Questo ciclo puo mostrare polarita che chiedono una postura piu consapevole e meno reattiva. Concentrati sull essenziale con fermezza e senza scontri inutili.',
    'transit:saturn|oposicao|mars':
      'Saturno in opposizione a Marte puo dare sensazione di freno o ritardo nell esecuzione. La fase chiede di calibrare forza e tempi, evitando sia impulso sia blocco totale. Pianificazione tattica e costanza aiutano a recuperare trazione.',
    'transit:saturn|quadratura|mercury':
      'Saturno in quadratura a Mercurio richiede precisione nella comunicazione e revisione delle ipotesi. Possono emergere maggiore pressione mentale, ritardi o bisogno di dettagli extra. Verifica informazioni, semplifica messaggi e avanza per fasi.',
    'transit:saturn|quadratura|sun':
      'Saturno in quadratura al Sole aumenta senso di responsabilita e test di coerenza. Il periodo puo risultare piu esigente, chiedendo focus sull essenziale e taglio degli eccessi. Struttura, riposo e priorita chiare evitano usura improduttiva.',
    'transit:saturn|sextil|venus':
      'Saturno in sestile a Venere favorisce scelte mature in relazioni, accordi e valori. La fase sostiene impegno sostenibile con meno idealizzazione e piu coerenza pratica. Buon periodo per allineare aspettative e rafforzare legami affidabili.',
    'transit:saturn|trigono|venus':
      'Saturno in trigono a Venere rafforza stabilita affettiva e finanziaria attraverso criterio. C e tendenza a preferire qualita, costanza e accordi di lungo periodo. Usa il ciclo per consolidare cio che ha valore reale nella routine.',
    'transit:saturn|sextil|jupiter':
      'Saturno in sestile a Giove unisce espansione e realismo strategico. Il periodo favorisce crescita con pianificazione senza perdere sicurezza di base. Avanza con obiettivi concreti, scadenze chiare e revisioni periodiche.',
    'transit:saturn|trigono|jupiter':
      'Saturno in trigono a Giove sostiene crescita costante con equilibrio tra visione ed esecuzione. Questa fase tende a facilitare progresso solido quando metodo e pazienza sono presenti. Struttura opportunita per fasi per risultati durevoli.',
    'transit:pluto|ingress|house_10':
      'Plutone in ingresso in Casa 10 tende ad avviare un ciclo di riposizionamento profondo su carriera, reputazione e direzione pubblica. Questa fase chiede spesso scelte piu autentiche e meno compromessi con percorsi non piu coerenti. Procedi con strategia di medio periodo e calibra l esposizione in modo sostenibile.',
    'transit:pluto|ingress|house_4':
      'Plutone in ingresso in Casa 4 tende ad approfondire temi di base emotiva, famiglia e struttura della casa. Questo ciclo puo mostrare schemi antichi che non sostengono piu sicurezza interiore con qualita. Il miglior uso della fase e riorganizzare fondamenta con calma, fermezza e confini piu chiari.',
    'transit:saturn|ingress|house_10':
      'Saturno in ingresso in Casa 10 indica una fase di consolidamento professionale attraverso responsabilita, costanza e criterio. La tendenza e ridurre dispersione, dare priorita a consegne concrete e allineare aspettative al processo reale. Usa il periodo per costruire reputazione con passi sostenibili e prevedibili.',
    'transit:saturn|ingress|house_6':
      'Saturno in ingresso in Casa 6 favorisce riorganizzazione di routine, lavoro quotidiano e salute funzionale con metodo. Questa fase tende a chiedere disciplina semplice, ritmi piu stabili e riduzione del sovraccarico ricorrente. Piccoli aggiustamenti ripetuti possono produrre miglioramento rilevante nel medio periodo.',
    'transit:jupiter|ingress|house_2':
      'Giove in ingresso in Casa 2 tende ad ampliare opportunita su risorse, valori e sicurezza materiale. La fase favorisce crescita quando sono presenti pianificazione, criterio di rischio e monitoraggio dei risultati. Espansione con struttura pratica tende a rendere piu di entusiasmo senza metodo.',
    'transit:jupiter|ingress|house_11':
      'Giove in ingresso in Casa 11 apre una finestra favorevole per reti, collaborazione e progetti collettivi orientati al futuro. Questo ciclo tende ad ampliare connessioni utili quando obiettivi e reciprocita sono chiari. Dai priorita ad alleanze affidabili e trasforma contatti in cooperazione concreta.',
    'transit:uranus|ingress|house_7':
      'Urano in ingresso in Casa 7 tende a rinnovare dinamiche di relazione, accordi e legami importanti. Questo periodo puo chiedere piu autonomia, flessibilita e dialogo diretto sulle aspettative di entrambe le parti. Aggiustamenti consapevoli aiutano a evitare rotture reattive e favoriscono evoluzione del legame.',
    'transit:neptune|ingress|house_12':
      'Nettuno in ingresso in Casa 12 tende ad ampliare sensibilita, intuizione e processi di chiusura interiore. Questa fase puo aumentare percezioni sottili e richiede discernimento tra intuizione e idealizzazione. Routine di riposo, silenzio e igiene mentale aiutano a stabilizzare il ciclo.',
    'transit:mars|ingress|house_10':
      'Marte in ingresso in Casa 10 aumenta la spinta ad agire nella carriera e occupare spazio con piu visibilita. L energia favorisce iniziativa quando direzione e chiara e il ritmo e regolato per evitare usura. Esegui per priorita e trasforma urgenza in progresso misurabile.',
    'transit:sun|ingress|house_10':
      'Sole in ingresso in Casa 10 mette in luce obiettivi pubblici, responsabilita e direzione professionale. Questa fase tende a favorire visibilita quando unisci presenza, coerenza e comunicazione chiara. Concentrati sull essenziale e usa l esposizione per rafforzare un posizionamento coerente.',
  },
}
