/**
 * i18n do Lagna (en-US / es-ES / it-IT). Resolver faz fallback ao pt-BR base.
 * Regras: en presente simples; es sem tildes; it sem acentos, apostrofos→espaco.
 */
export const LAGNA_I18N: Record<string, Partial<Record<string, string>>> = {
  'en-US': {
    mesha: 'Aries Lagna — you meet life with initiative, courage, and independence. An active body and a direct temperament; ruled by Mars, it asks you to channel the energy without trampling. A pioneer who opens the way.',
    vrishabha: 'Taurus Lagna — life is built on stability, beauty, and patience. You seek comfort and security; ruled by Venus, it brings sensuality and a taste for pleasure. Firm, loyal, a bit stubborn.',
    mithuna: 'Gemini Lagna — life is driven by curiosity, communication, and versatility. A quick mind and many interests; ruled by Mercury, it asks for focus so you do not scatter. Sociable and adaptable.',
    karka: 'Cancer Lagna — life is guided by emotion, care, and memory. Sensitive and protective; ruled by the Moon, your mood shifts with inner tides. You nurture your own and seek to belong.',
    simha: 'Leo Lagna — life is lived with dignity, warmth, and a wish to shine. Noble and generous; ruled by the Sun, it asks for a purpose worthy of you. A natural leader with healthy pride.',
    kanya: 'Virgo Lagna — life is organized by analysis, service, and improvement. Detailed and helpful; ruled by Mercury, you discern well but demand too much of yourself.',
    tula: 'Libra Lagna — life seeks balance, relationship, and beauty. Diplomatic and aesthetic; ruled by Venus, you have charm and avoid conflict. You complete yourself in meeting the other.',
    vrishchika: 'Scorpio Lagna — life is intense, deep, and transformative. Reserved and magnetic; ruled by Mars, it asks you to master your own passions. You are reborn from crises, stronger.',
    dhanu: 'Sagittarius Lagna — life is guided by faith, expansion, and meaning. Optimistic and philosophical; ruled by Jupiter, it brings luck and uprightness. You seek freedom and truth above all.',
    makara: 'Capricorn Lagna — life is built on discipline, ambition, and responsibility. Serious and persistent; ruled by Saturn, it asks for patience. You harvest late, but solid and lasting.',
    kumbha: 'Aquarius Lagna — life is driven by ideas, causes, and independence. Original and humanitarian; ruled by Saturn, it brings seriousness to innovation. You think ahead, sometimes distant.',
    meena: 'Pisces Lagna — life is guided by sensitivity, faith, and imagination. Compassionate and dreamy; ruled by Jupiter, it brings generosity. You need an anchor so you do not scatter in the dream.',
  },
  'es-ES': {
    mesha: 'Lagna de Aries: encaras la vida con iniciativa, coraje e independencia. Cuerpo activo y temperamento directo; regido por Marte, pide canalizar la energia sin atropellar. Pionero que abre camino.',
    vrishabha: 'Lagna de Tauro: la vida se construye con estabilidad, belleza y paciencia. Buscas confort y seguridad; regido por Venus, trae sensualidad y gusto por el placer. Firme, leal, algo terco.',
    mithuna: 'Lagna de Geminis: la vida se mueve por curiosidad, comunicacion y versatilidad. Mente agil y muchos intereses; regido por Mercurio, pide foco para no dispersarte. Sociable y adaptable.',
    karka: 'Lagna de Cancer: la vida se guia por la emocion, el cuidado y la memoria. Sensible y protector; regido por la Luna, oscila de humor con las mareas internas. Nutres a los tuyos y buscas pertenecer.',
    simha: 'Lagna de Leo: la vida se vive con dignidad, calor y ganas de brillar. Noble y generoso; regido por el Sol, pide un proposito a tu altura. Lider natural, con orgullo sano.',
    kanya: 'Lagna de Virgo: la vida se organiza por el analisis, el servicio y la mejora. Detallista y servicial; regido por Mercurio, disciernes bien, pero te exiges demasiado.',
    tula: 'Lagna de Libra: la vida busca equilibrio, relacion y belleza. Diplomatico y estetico; regido por Venus, tienes encanto y evitas el conflicto. Te completas en el encuentro con el otro.',
    vrishchika: 'Lagna de Escorpio: la vida es intensa, profunda y transformadora. Reservado y magnetico; regido por Marte, pide dominar tus propias pasiones. Renaces de las crisis, mas fuerte.',
    dhanu: 'Lagna de Sagitario: la vida se guia por fe, expansion y sentido. Optimista y filosofico; regido por Jupiter, trae suerte y rectitud. Buscas libertad y verdad por encima de todo.',
    makara: 'Lagna de Capricornio: la vida se construye con disciplina, ambicion y responsabilidad. Serio y persistente; regido por Saturno, pide paciencia. Cosechas tarde, pero solido y duradero.',
    kumbha: 'Lagna de Acuario: la vida se mueve por ideas, causas e independencia. Original y humanitario; regido por Saturno, lleva seriedad al innovar. Piensas por delante, a veces distante.',
    meena: 'Lagna de Piscis: la vida se guia por sensibilidad, fe e imaginacion. Compasivo y sonador; regido por Jupiter, trae generosidad. Necesitas un ancla para no dispersarte en el sueno.',
  },
  'it-IT': {
    mesha: 'Lagna dell Ariete: affronti la vita con iniziativa, coraggio e indipendenza. Corpo attivo e temperamento diretto; governato da Marte, chiede di incanalare l energia senza travolgere. Pioniere che apre la strada.',
    vrishabha: 'Lagna del Toro: la vita si costruisce con stabilita, bellezza e pazienza. Cerchi comfort e sicurezza; governato da Venere, porta sensualita e gusto per il piacere. Fermo, leale, un po testardo.',
    mithuna: 'Lagna dei Gemelli: la vita e mossa da curiosita, comunicazione e versatilita. Mente agile e molti interessi; governato da Mercurio, chiede focus per non disperderti. Socievole e adattabile.',
    karka: 'Lagna del Cancro: la vita e guidata dall emozione, dalla cura e dalla memoria. Sensibile e protettivo; governato dalla Luna, oscilla di umore con le maree interne. Nutri i tuoi e cerchi di appartenere.',
    simha: 'Lagna del Leone: la vita si vive con dignita, calore e voglia di brillare. Nobile e generoso; governato dal Sole, chiede uno scopo alla tua altezza. Leader naturale, con orgoglio sano.',
    kanya: 'Lagna della Vergine: la vita si organizza con l analisi, il servizio e il miglioramento. Attento ai dettagli e disponibile; governato da Mercurio, discerni bene ma pretendi troppo da te.',
    tula: 'Lagna della Bilancia: la vita cerca equilibrio, relazione e bellezza. Diplomatico ed estetico; governato da Venere, hai fascino ed eviti il conflitto. Ti completi nell incontro con l altro.',
    vrishchika: 'Lagna dello Scorpione: la vita e intensa, profonda e trasformatrice. Riservato e magnetico; governato da Marte, chiede di dominare le tue passioni. Rinasci dalle crisi, piu forte.',
    dhanu: 'Lagna del Sagittario: la vita e guidata da fede, espansione e senso. Ottimista e filosofico; governato da Giove, porta fortuna e rettitudine. Cerchi liberta e verita sopra ogni cosa.',
    makara: 'Lagna del Capricorno: la vita si costruisce con disciplina, ambizione e responsabilita. Serio e persistente; governato da Saturno, chiede pazienza. Raccogli tardi, ma solido e duraturo.',
    kumbha: 'Lagna dell Acquario: la vita e mossa da idee, cause e indipendenza. Originale e umanitario; governato da Saturno, porta serieta all innovare. Pensi in anticipo, a volte distante.',
    meena: 'Lagna dei Pesci: la vita e guidata da sensibilita, fede e immaginazione. Compassionevole e sognatore; governato da Giove, porta generosita. Hai bisogno di un ancora per non disperderti nel sogno.',
  },
}
