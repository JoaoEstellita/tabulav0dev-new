// Retorno Lunar: área da vida de cada casa (para compor o foco emocional do MÊS).
// Compõe com o domínio-do-ano do planeta (solarReturnAspectComposer) + lead mensal.
// Regras i18n: en-US sem "will"; es-ES sem tildes; it-IT sem acentos.

type HouseArea = { area: string; focus: string }

export const LUNAR_HOUSE_AREA: Record<string, Record<number, HouseArea>> = {
  'pt-BR': {
    1: { area: 'você mesmo e sua energia', focus: 'cuidar de si e recomeçar' },
    2: { area: 'seus recursos e sua segurança', focus: 'organizar finanças e valores' },
    3: { area: 'a comunicação e o dia a dia', focus: 'conversar, aprender e circular' },
    4: { area: 'o lar e a família', focus: 'acolher e cuidar das raízes' },
    5: { area: 'o prazer e a criatividade', focus: 'se divertir e se expressar' },
    6: { area: 'o trabalho e a saúde', focus: 'ajustar a rotina e o corpo' },
    7: { area: 'as relações e parcerias', focus: 'cultivar os vínculos a dois' },
    8: { area: 'a intimidade e as transformações', focus: 'olhar para o que é profundo' },
    9: { area: 'a expansão e o aprendizado', focus: 'buscar sentido e novos ares' },
    10: { area: 'a carreira e a vida pública', focus: 'cuidar da direção profissional' },
    11: { area: 'as amizades e os projetos', focus: 'se conectar a grupos e metas' },
    12: { area: 'o descanso e a vida interior', focus: 'recolher-se e reabastecer' },
  },
  'en-US': {
    1: { area: 'yourself and your energy', focus: 'tend to yourself and begin again' },
    2: { area: 'your resources and security', focus: 'organize finances and values' },
    3: { area: 'communication and daily life', focus: 'talk, learn and circulate' },
    4: { area: 'home and family', focus: 'nurture and tend your roots' },
    5: { area: 'pleasure and creativity', focus: 'have fun and express yourself' },
    6: { area: 'work and health', focus: 'adjust routine and body' },
    7: { area: 'relationships and partnerships', focus: 'cultivate one-on-one bonds' },
    8: { area: 'intimacy and transformation', focus: 'look at what is deep' },
    9: { area: 'expansion and learning', focus: 'seek meaning and new horizons' },
    10: { area: 'career and public life', focus: 'tend your professional direction' },
    11: { area: 'friendships and projects', focus: 'connect with groups and goals' },
    12: { area: 'rest and inner life', focus: 'retreat and replenish' },
  },
  'es-ES': {
    1: { area: 'ti mismo y tu energia', focus: 'cuidarte y recomenzar' },
    2: { area: 'tus recursos y tu seguridad', focus: 'ordenar finanzas y valores' },
    3: { area: 'la comunicacion y el dia a dia', focus: 'conversar, aprender y circular' },
    4: { area: 'el hogar y la familia', focus: 'acoger y cuidar las raices' },
    5: { area: 'el placer y la creatividad', focus: 'divertirte y expresarte' },
    6: { area: 'el trabajo y la salud', focus: 'ajustar la rutina y el cuerpo' },
    7: { area: 'las relaciones y sociedades', focus: 'cultivar los vinculos de a dos' },
    8: { area: 'la intimidad y las transformaciones', focus: 'mirar lo que es profundo' },
    9: { area: 'la expansion y el aprendizaje', focus: 'buscar sentido y nuevos aires' },
    10: { area: 'la carrera y la vida publica', focus: 'cuidar la direccion profesional' },
    11: { area: 'las amistades y los proyectos', focus: 'conectarte con grupos y metas' },
    12: { area: 'el descanso y la vida interior', focus: 'recogerte y reabastecerte' },
  },
  'it-IT': {
    1: { area: 'te stesso e la tua energia', focus: 'curarti e ricominciare' },
    2: { area: 'le tue risorse e la tua sicurezza', focus: 'ordinare finanze e valori' },
    3: { area: 'la comunicazione e il quotidiano', focus: 'parlare, imparare e circolare' },
    4: { area: 'la casa e la famiglia', focus: 'accogliere e curare le radici' },
    5: { area: 'il piacere e la creativita', focus: 'divertirti ed esprimerti' },
    6: { area: 'il lavoro e la salute', focus: 'aggiustare la routine e il corpo' },
    7: { area: 'le relazioni e le societa', focus: 'coltivare i legami a due' },
    8: { area: "l'intimita e le trasformazioni", focus: 'guardare cio che e profondo' },
    9: { area: "l'espansione e l'apprendimento", focus: 'cercare senso e nuovi orizzonti' },
    10: { area: 'la carriera e la vita pubblica', focus: 'curare la direzione professionale' },
    11: { area: 'le amicizie e i progetti', focus: 'connetterti a gruppi e obiettivi' },
    12: { area: 'il riposo e la vita interiore', focus: 'ritirarti e ricaricarti' },
  },
}

// Lead mensal ("Neste mês,") por idioma.
export const LUNAR_LEAD: Record<string, string> = {
  'pt-BR': 'Neste mês,',
  'en-US': 'This month,',
  'es-ES': 'Este mes,',
  'it-IT': 'Questo mese,',
}
