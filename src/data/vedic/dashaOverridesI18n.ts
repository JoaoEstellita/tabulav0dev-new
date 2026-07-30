/**
 * i18n das Mahadashas (en/es/it) — só o `tema` (exibido no card do perfil).
 * O resolver faz merge sobre o pt-BR base. Regras: en presente; es sem tildes; it sem acentos.
 */
export const DASHA_I18N: Record<string, Partial<Record<string, string>>> = {
  'en-US': {
    ketu: 'A time of detachment and inner search. Things close to make room for the essential; the focus turns to meaning, spirituality, and the unseen. Less world, more soul.',
    venus: 'A long cycle of love, beauty, and pleasure. Relationships, art, comfort, and social life take center stage. A fertile time for affection, creation, and enjoyment.',
    sun: 'A time of identity and purpose. A wish to shine, take authority, and be recognized for who you are. Themes of leadership, direction, and the father figure.',
    moon: 'An emotional cycle of care. Family, home, sensitivity, and inner life weigh more. Good for nurturing bonds and yourself; mind your mood and rest.',
    mars: 'A period of action and courage. Energy to start, compete, and get things done; the body asks for movement. Watch haste and conflict — force well aimed builds.',
    rahu: 'A long cycle of ambition and expansion toward the new. A hunger for the world, to grow and break patterns; it can bring upheaval and obsessions. Great potential with direction.',
    jupiter: 'A time of wisdom, faith, and growth. Wider horizons, teaching, prosperity, and meaning. One of the most generous cycles — it opens doors and widens your view.',
    saturn: 'The longest cycle: maturity, work, and responsibility. A slow, solid harvest; limits and tests that ripen you. It rewards what is built with discipline.',
    mercury: 'A period of intellect and communication. Learning, business, versatility, and connections. A quick mind and many projects; great for studying, writing, and negotiating.',
  },
  'es-ES': {
    ketu: 'Un tiempo de desapego y busqueda interior. Las cosas se cierran para dar espacio a lo esencial; el foco va al sentido, la espiritualidad y lo invisible. Menos mundo, mas alma.',
    venus: 'Un largo ciclo de amor, belleza y placer. Relaciones, arte, confort y vida social ganan protagonismo. Un tiempo fertil para el afecto, la creacion y el disfrute.',
    sun: 'Un tiempo de identidad y proposito. Ganas de brillar, asumir autoridad y ser reconocido por lo que eres. Temas de liderazgo, rumbo de vida y figura paterna.',
    moon: 'Un ciclo emocional y de cuidado. Familia, hogar, sensibilidad y vida interior pesan mas. Bueno para nutrir vinculos y a ti; atiende el humor y el descanso.',
    mars: 'Un periodo de accion y coraje. Energia para iniciar, competir y realizar; el cuerpo pide movimiento. Cuidado con la prisa y el conflicto: la fuerza bien dirigida construye.',
    rahu: 'Un largo ciclo de ambicion y expansion hacia lo inedito. Hambre de mundo, de crecer y romper patrones; puede traer vuelcos y obsesiones. Gran potencia con direccion.',
    jupiter: 'Un tiempo de sabiduria, fe y crecimiento. Horizontes mas amplios, ensenanza, prosperidad y sentido. Uno de los ciclos mas generosos: abre puertas y amplia la vision.',
    saturn: 'El ciclo mas largo: madurez, trabajo y responsabilidad. Cosecha lenta y solida; limites y pruebas que maduran. Recompensa lo construido con disciplina.',
    mercury: 'Un periodo de intelecto y comunicacion. Aprendizaje, negocios, versatilidad y conexiones. Mente agil y muchos proyectos; ideal para estudiar, escribir y negociar.',
  },
  'it-IT': {
    ketu: 'Un tempo di distacco e ricerca interiore. Le cose si chiudono per fare spazio all essenziale; il focus va al senso, alla spiritualita e all invisibile. Meno mondo, piu anima.',
    venus: 'Un lungo ciclo di amore, bellezza e piacere. Relazioni, arte, comfort e vita sociale diventano centrali. Un tempo fertile per l affetto, la creazione e il godere.',
    sun: 'Un tempo di identita e scopo. Voglia di brillare, assumere autorita ed essere riconosciuto per cio che sei. Temi di leadership, direzione di vita e figura paterna.',
    moon: 'Un ciclo emotivo e di cura. Famiglia, casa, sensibilita e vita interiore pesano di piu. Buono per nutrire i legami e te stesso; attento all umore e al riposo.',
    mars: 'Un periodo di azione e coraggio. Energia per iniziare, competere e realizzare; il corpo chiede movimento. Attento a fretta e conflitto: la forza ben diretta costruisce.',
    rahu: 'Un lungo ciclo di ambizione ed espansione verso l inedito. Fame di mondo, di crescere e rompere schemi; puo portare svolte e ossessioni. Grande potenza con una direzione.',
    jupiter: 'Un tempo di saggezza, fede e crescita. Orizzonti piu ampi, insegnamento, prosperita e senso. Uno dei cicli piu generosi: apre porte e amplia la visione.',
    saturn: 'Il ciclo piu lungo: maturita, lavoro e responsabilita. Raccolto lento e solido; limiti e prove che fanno maturare. Premia cio che e costruito con disciplina.',
    mercury: 'Un periodo di intelletto e comunicazione. Apprendimento, affari, versatilita e connessioni. Mente agile e molti progetti; ottimo per studiare, scrivere e negoziare.',
  },
}
