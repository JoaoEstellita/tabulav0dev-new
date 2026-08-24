// Clima emocional da Lua em cada signo — 1 linha por signo, para dar vida ao
// Calendário Lunar. Chave normalizada: aries, touro, ... peixes.
// Regras i18n: en-US sem "will"; es-ES sem tildes; it-IT sem acentos.
export const MOON_SIGN_MOOD: Record<string, Record<string, string>> = {
  'pt-BR': {
    aries: 'Emoções diretas e impulsivas — vontade de agir e começar.',
    touro: 'Pede calma, conforto e prazeres simples. Ritmo mais lento.',
    gemeos: 'Mente inquieta e curiosa — vontade de conversar e circular.',
    cancer: 'Sensibilidade alta; o coração puxa para o lar e o cuidado.',
    leao: 'Coração generoso e caloroso — vontade de brilhar e criar.',
    virgem: 'Humor pede ordem, utilidade e cuidado com os detalhes.',
    libra: 'Busca por harmonia, beleza e boa companhia.',
    escorpiao: 'Emoções intensas e profundas — tudo ou nada.',
    sagitario: 'Ânimo otimista e livre — vontade de aventura e sentido.',
    capricornio: 'Emoções mais contidas; foco em responsabilidade.',
    aquario: 'Humor mental e independente, com olhar coletivo.',
    peixes: 'Sensibilidade sonhadora — intuição e vontade de recolher.',
  },
  'en-US': {
    aries: 'Direct, impulsive feelings — an urge to act and begin.',
    touro: 'Asks for calm, comfort and simple pleasures. A slower pace.',
    gemeos: 'A restless, curious mind — an urge to talk and circulate.',
    cancer: 'Heightened sensitivity; the heart pulls toward home and care.',
    leao: 'A warm, generous heart — an urge to shine and create.',
    virgem: 'The mood asks for order, usefulness and attention to detail.',
    libra: 'A search for harmony, beauty and good company.',
    escorpiao: 'Intense, deep emotions — all or nothing.',
    sagitario: 'An optimistic, free spirit — a wish for adventure and meaning.',
    capricornio: 'More contained emotions; focus on responsibility.',
    aquario: 'A mental, independent mood with a collective outlook.',
    peixes: 'Dreamy sensitivity — intuition and a wish to retreat.',
  },
  'es-ES': {
    aries: 'Emociones directas e impulsivas — ganas de actuar y empezar.',
    touro: 'Pide calma, confort y placeres simples. Ritmo mas lento.',
    gemeos: 'Mente inquieta y curiosa — ganas de conversar y circular.',
    cancer: 'Sensibilidad alta; el corazon tira hacia el hogar y el cuidado.',
    leao: 'Corazon generoso y calido — ganas de brillar y crear.',
    virgem: 'El humor pide orden, utilidad y cuidado con los detalles.',
    libra: 'Busqueda de armonia, belleza y buena compania.',
    escorpiao: 'Emociones intensas y profundas — todo o nada.',
    sagitario: 'Animo optimista y libre — ganas de aventura y sentido.',
    capricornio: 'Emociones mas contenidas; foco en la responsabilidad.',
    aquario: 'Humor mental e independiente, con mirada colectiva.',
    peixes: 'Sensibilidad sonadora — intuicion y ganas de recogerse.',
  },
  'it-IT': {
    aries: 'Emozioni dirette e impulsive — voglia di agire e iniziare.',
    touro: 'Chiede calma, conforto e piaceri semplici. Ritmo piu lento.',
    gemeos: 'Mente inquieta e curiosa — voglia di parlare e circolare.',
    cancer: 'Sensibilita alta; il cuore tira verso la casa e la cura.',
    leao: 'Cuore generoso e caldo — voglia di brillare e creare.',
    virgem: "L'umore chiede ordine, utilita e cura dei dettagli.",
    libra: 'Ricerca di armonia, bellezza e buona compagnia.',
    escorpiao: 'Emozioni intense e profonde — tutto o niente.',
    sagitario: 'Animo ottimista e libero — voglia di avventura e senso.',
    capricornio: 'Emozioni piu contenute; foco sulla responsabilita.',
    aquario: 'Umore mentale e indipendente, con sguardo collettivo.',
    peixes: 'Sensibilita sognante — intuizione e voglia di ritirarsi.',
  },
}

export const MOON_SIGN_GLYPH: Record<string, string> = {
  aries: '♈', touro: '♉', gemeos: '♊', cancer: '♋', leao: '♌', virgem: '♍',
  libra: '♎', escorpiao: '♏', sagitario: '♐', capricornio: '♑', aquario: '♒', peixes: '♓',
}

// Nomes do signo por idioma (índice 0=Áries ... 11=Peixes).
export const SIGN_NAMES_I18N: Record<string, string[]> = {
  'pt-BR': ['Áries', 'Touro', 'Gêmeos', 'Câncer', 'Leão', 'Virgem', 'Libra', 'Escorpião', 'Sagitário', 'Capricórnio', 'Aquário', 'Peixes'],
  'en-US': ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'],
  'es-ES': ['Aries', 'Tauro', 'Geminis', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'],
  'it-IT': ['Ariete', 'Toro', 'Gemelli', 'Cancro', 'Leone', 'Vergine', 'Bilancia', 'Scorpione', 'Sagittario', 'Capricorno', 'Acquario', 'Pesci'],
}

// Chaves normalizadas na ordem 0..11 (para casar índice → mood/glyph).
export const SIGN_KEYS = ['aries', 'touro', 'gemeos', 'cancer', 'leao', 'virgem', 'libra', 'escorpiao', 'sagitario', 'capricornio', 'aquario', 'peixes'] as const
