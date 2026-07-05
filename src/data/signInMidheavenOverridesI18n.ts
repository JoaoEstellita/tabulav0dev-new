// Catálogo i18n: Signo no Meio do Céu (MC)
// 36 entradas: 12 signos × 3 idiomas (en-US, es-ES, it-IT)
// Regras:
//   en-US — sem "will", frases no presente simples ou presente contínuo
//   es-ES — sem acentos (energía→energia, típico→tipico, etc.)
//   it-IT — sem acentos e sem apóstrofos

import type { AppLanguage } from '../i18n/appI18n'

export const SIGN_IN_MIDHEAVEN_I18N_OVERRIDES: Partial<Record<AppLanguage, Record<string, string>>> = {

  'en-US': {
    'natal:mc_aries':
      'Aries on the Midheaven signals a need for independence and personal freedom in career. Entrepreneurial energy favors self-employment, dynamic environments, and technical or physical challenges. Typical paths include engineering, mechanics, fitness instruction, electronics, and military service.',

    'natal:mc_taurus':
      'Taurus on the Midheaven points to a preference for a steady career with predictable income. Working outdoors or with nature brings particular satisfaction, as do activities related to the body, construction, or the land. Typical paths include horticulture, agriculture, accounting, financial management, gastronomy, and physiotherapy.',

    'natal:mc_gemini':
      'Gemini on the Midheaven makes communication the cornerstone of career fulfillment. Variety and intellectual stimulation matter more than hierarchical status or high ambition. Typical paths include journalism, advertising, teaching, translation, sales, and youth work.',

    'natal:mc_cancer':
      'Cancer on the Midheaven calls for continuity and stability in professional life. Providing security for a close-knit family or emotional circle motivates more than financial gain alone. Typical paths include nursing, social work, gastronomy, childcare, and architecture.',

    'natal:mc_leo':
      'Leo on the Midheaven drives a desire to occupy center stage and do work that generates genuine pride and recognition. Financial motivation exists, but only within a stimulating environment that carries real purpose. Typical paths include performing arts, fashion, medicine, politics, working with animals, and banking.',

    'natal:mc_virgo':
      'Virgo on the Midheaven favors working behind the scenes, away from the spotlight. Analytical skill and attention to detail make this native an indispensable collaborator, often the real force behind a leadership role. Typical paths include administration, secretarial work, psychology, journalism, and public service.',

    'natal:mc_libra':
      'Libra on the Midheaven demands a harmonious and pleasant professional environment. Natural mediation skills shine, while stressful atmospheres drain enthusiasm rapidly. Typical paths include law, diplomacy, fashion, interior design, languages, and negotiation.',

    'natal:mc_scorpio':
      'Scorpio on the Midheaven calls for deep emotional and personal involvement in career. Professional security and inner satisfaction weigh more than financial reward alone. Typical paths include investigation, medicine, psychotherapy, the military, investigative journalism, and mining.',

    'natal:mc_sagittarius':
      'Sagittarius on the Midheaven craves challenge and resists repetitive routine. Personal ambition and desire for expansion motivate more than salary; hardship is tolerated in exchange for real growth. Typical paths include law, university teaching, outdoor sports, tourism, aviation, and spirituality.',

    'natal:mc_capricorn':
      'Capricorn on the Midheaven prizes status and position above salary alone. This placement often marks the professional who builds a career through discipline and long-term vision. Typical paths include politics, engineering, dentistry, real estate, public service, and sculpting.',

    'natal:mc_aquarius':
      'Aquarius on the Midheaven calls for creative freedom and enough space for innovation. Personal growth and collective contribution matter more than remuneration alone. Typical paths include technology, telecommunications, photography, aviation, law, environmental conservation, and humanitarian work.',

    'natal:mc_pisces':
      'Pisces on the Midheaven inclines toward working discreetly, often in support or care roles. Emotionally demanding work is handled with ease, and this native tends to thrive when genuinely assisting others. Typical paths include healthcare, social assistance, music, arts, literature, the navy, and the wine industry.',
  },

  'es-ES': {
    // Regra: sem acentos (sin tildes)
    'natal:mc_aries':
      'Aries en el Medio Cielo indica necesidad de independencia y libertad personal en la carrera. La energia emprendedora favorece el trabajo autonomo, entornos dinamicos y desafios tecnicos o fisicos. Las carreras tipicas incluyen ingenieria, mecanica, instruccion fisica, electronica y servicio militar.',

    'natal:mc_taurus':
      'Tauro en el Medio Cielo apunta a preferencia por una carrera estable con ingresos predecibles. Trabajar al aire libre o con la naturaleza aporta satisfaccion especial, como las actividades ligadas al cuerpo, la construccion o la tierra. Las carreras tipicas incluyen horticultura, agricultura, contabilidad, gestion financiera, gastronomia y fisioterapia.',

    'natal:mc_gemini':
      'Geminis en el Medio Cielo convierte la comunicacion en la clave de una carrera plena. La variedad y la estimulacion intelectual importan mas que el estatus jerarquico o la alta ambicion. Las carreras tipicas incluyen periodismo, publicidad, ensenanza, traduccion, ventas y trabajo con jovenes.',

    'natal:mc_cancer':
      'Cancer en el Medio Cielo demanda continuidad y estabilidad en la vida profesional. Proporcionar seguridad al nucleo familiar o afectivo motiva mas que la ganancia financiera aislada. Las carreras tipicas incluyen enfermeria, trabajo social, gastronomia, cuidado infantil y arquitectura.',

    'natal:mc_leo':
      'Leo en el Medio Cielo impulsa el deseo de ocupar el centro de la escena y hacer un trabajo que genere orgullo y reconocimiento genuino. La motivacion financiera existe, pero solo en un entorno estimulante con proposito real. Las carreras tipicas incluyen artes escenicas, moda, medicina, politica, trabajo con animales y banca.',

    'natal:mc_virgo':
      'Virgo en el Medio Cielo favorece trabajar entre bastidores, lejos de los focos. La habilidad analitica y la atencion al detalle hacen de este nativo un colaborador indispensable. Las carreras tipicas incluyen administracion, secretariado, psicologia, periodismo y servicio publico.',

    'natal:mc_libra':
      'Libra en el Medio Cielo exige un entorno profesional armonioso y agradable. Las habilidades naturales de mediacion brillan, mientras que los ambientes estresantes agotan el entusiasmo rapidamente. Las carreras tipicas incluyen derecho, diplomacia, moda, diseno de interiores, idiomas y negociacion.',

    'natal:mc_scorpio':
      'Escorpio en el Medio Cielo demanda profunda implicacion emocional y personal en la carrera. La seguridad profesional y la satisfaccion interior pesan mas que la recompensa financiera aislada. Las carreras tipicas incluyen investigacion, medicina, psicoterapia, fuerzas armadas, periodismo de investigacion y mineria.',

    'natal:mc_sagittarius':
      'Sagitario en el Medio Cielo anhela desafios y rechaza la rutina repetitiva. La ambicion personal y el deseo de expansion motivan mas que el salario; se toleran dificultades a cambio de crecimiento real. Las carreras tipicas incluyen derecho, docencia universitaria, deportes al aire libre, turismo, aviacion y espiritualidad.',

    'natal:mc_capricorn':
      'Capricornio en el Medio Cielo valora el estatus y la posicion por encima del salario aislado. Esta posicion suele marcar al profesional que construye su trayectoria con disciplina y vision a largo plazo. Las carreras tipicas incluyen politica, ingenieria, odontologia, bienes raices, servicio publico y escultura.',

    'natal:mc_aquarius':
      'Acuario en el Medio Cielo demanda libertad creativa y espacio para innovar. El crecimiento personal y la contribucion colectiva importan mas que la remuneracion aislada. Las carreras tipicas incluyen tecnologia, telecomunicaciones, fotografia, aviacion, derecho, conservacion ambiental y trabajo humanitario.',

    'natal:mc_pisces':
      'Piscis en el Medio Cielo inclina hacia trabajar discretamente, a menudo en roles de apoyo o cuidado. Las demandas emocionalmente intensas se manejan con facilidad y este nativo prospera al ayudar a los demas de forma genuina. Las carreras tipicas incluyen salud, asistencia social, musica, artes, literatura, marina e industria vinicola.',
  },

  'it-IT': {
    // Regra: sem acentos e sem apóstrofos
    'natal:mc_aries':
      'Ariete al Medio Cielo segnala necessita di indipendenza e liberta personale nella carriera. La spinta imprenditoriale favorisce il lavoro autonomo, ambienti dinamici e sfide tecniche o fisiche. Le carriere tipiche includono ingegneria, meccanica, istruzione fisica, elettronica e servizio militare.',

    'natal:mc_taurus':
      'Toro al Medio Cielo indica preferenza per una carriera stabile con reddito prevedibile. Lavorare in ambienti aperti o con la natura porta soddisfazione speciale, come le attivita legate al corpo, alle costruzioni o alla terra. Le carriere tipiche includono orticoltura, agricoltura, contabilita, gestione finanziaria, gastronomia e fisioterapia.',

    'natal:mc_gemini':
      'Gemelli al Medio Cielo pone la comunicazione al centro di una carriera soddisfacente. La varieta e la stimolazione intellettuale contano piu dello status gerarchico o della grande ambizione. Le carriere tipiche includono giornalismo, pubblicita, insegnamento, traduzione, vendite e lavoro con i giovani.',

    'natal:mc_cancer':
      'Cancro al Medio Cielo richiede continuita e stabilita nella vita professionale. Garantire sicurezza al nucleo familiare o affettivo motiva piu del solo guadagno economico. Le carriere tipiche includono infermieristica, assistenza sociale, gastronomia, cura dei bambini e architettura.',

    'natal:mc_leo':
      'Leone al Medio Cielo spinge al desiderio di occupare il centro della scena e svolgere un lavoro che generi orgoglio e riconoscimento genuino. La motivazione economica esiste, ma solo in un ambiente stimolante con uno scopo reale. Le carriere tipiche includono arti sceniche, moda, medicina, politica, lavoro con animali e banca.',

    'natal:mc_virgo':
      'Vergine al Medio Cielo favorisce lavorare dietro le quinte, lontano dai riflettori. La capacita analitica e la cura per i dettagli rendono questo nativo un collaboratore indispensabile. Le carriere tipiche includono amministrazione, segretariato, psicologia, giornalismo e servizio pubblico.',

    'natal:mc_libra':
      'Bilancia al Medio Cielo richiede un ambiente professionale armonioso e piacevole. Le naturali capacita di mediazione brillano, mentre ambienti stressanti consumano rapidamente la motivazione. Le carriere tipiche includono diritto, diplomazia, moda, design di interni, lingue e negoziazione.',

    'natal:mc_scorpio':
      'Scorpione al Medio Cielo chiede profondo coinvolgimento emotivo e personale nella carriera. La sicurezza professionale e la soddisfazione interiore pesano piu della sola ricompensa economica. Le carriere tipiche includono investigazione, medicina, psicoterapia, forze armate, giornalismo investigativo e miniere.',

    'natal:mc_sagittarius':
      'Sagittario al Medio Cielo ricerca sfide e rifiuta la routine ripetitiva. La spinta personale e il desiderio di espansione motivano piu dello stipendio; si tollerano difficolta in cambio di una vera crescita. Le carriere tipiche includono diritto, insegnamento universitario, sport in natura, turismo, aviazione e spiritualita.',

    'natal:mc_capricorn':
      'Capricorno al Medio Cielo valorizza lo status e la posizione piu dello stipendio isolato. Questa posizione segna spesso il professionista che costruisce la carriera con disciplina e visione a lungo termine. Le carriere tipiche includono politica, ingegneria, odontoiatria, immobili, servizio pubblico e scultura.',

    'natal:mc_aquarius':
      'Aquario al Medio Cielo richiede liberta creativa e spazio per innovare. La crescita personale e il contributo collettivo contano piu della sola remunerazione. Le carriere tipiche includono tecnologia, telecomunicazioni, fotografia, aviazione, diritto, conservazione ambientale e lavoro umanitario.',

    'natal:mc_pisces':
      'Pesci al Medio Cielo inclina verso un lavoro discreto, spesso in ruoli di supporto o cura. Le richieste emotivamente intense si gestiscono con facilita e questo nativo prospera aiutando gli altri in modo genuino. Le carriere tipiche includono salute, assistenza sociale, musica, arti, letteratura, marina e industria vinicola.',
  },
}
