// Composer do RETORNO SOLAR: planeta no signo do RS.
// No RS o signo colore COMO o domínio-do-ano de cada planeta se expressa. Em vez de
// catálogo par-a-par (10 planetas × 12 signos × 4 idiomas = 480), compomos a partir
// do domínio-do-ano (ver solarReturnAspectComposer) + a qualidade de cada signo.
// Cobre os 120 pares. Fallback ao planeta-no-signo natal para pontos sem domínio.
// Regras i18n: en-US sem "will" futuro; es-ES sem tildes; it-IT sem acentos.

type SignFlavor = { name: string; tone: string; how: string }

// Chave normalizada: aries, touro, gemeos, cancer, leao, virgem, libra, escorpiao,
// sagitario, capricornio, aquario, peixes.
export const SR_SIGN_FLAVOR: Record<string, Record<string, SignFlavor>> = {
  'pt-BR': {
    aries: { name: 'Áries', tone: 'impulso, coragem e rapidez', how: 'Tende a se expressar de forma direta, pioneira e cheia de iniciativa' },
    touro: { name: 'Touro', tone: 'constância, prazer e solidez', how: 'Busca estabilidade, conforto e resultados concretos, no próprio ritmo' },
    gemeos: { name: 'Gêmeos', tone: 'curiosidade, versatilidade e troca', how: 'Move-se pela comunicação, pelas ideias e por vários interesses ao mesmo tempo' },
    cancer: { name: 'Câncer', tone: 'sensibilidade, cuidado e memória', how: 'Age a partir do vínculo, da proteção e do que toca o emocional' },
    leao: { name: 'Leão', tone: 'brilho, generosidade e criatividade', how: 'Expressa-se com calor, orgulho saudável e vontade de se mostrar' },
    virgem: { name: 'Virgem', tone: 'precisão, cuidado e utilidade', how: 'Funciona pelo detalhe, pela análise e pela melhora contínua' },
    libra: { name: 'Libra', tone: 'harmonia, diplomacia e beleza', how: 'Busca equilíbrio, parceria e o encontro com o outro' },
    escorpiao: { name: 'Escorpião', tone: 'intensidade, profundidade e poder', how: 'Age por camadas profundas, com foco no essencial e no que transforma' },
    sagitario: { name: 'Sagitário', tone: 'otimismo, liberdade e sentido', how: 'Expande-se pela aventura, pela fé e pela busca de significado' },
    capricornio: { name: 'Capricórnio', tone: 'disciplina, ambição e maturidade', how: 'Constrói com foco, responsabilidade e visão de longo prazo' },
    aquario: { name: 'Aquário', tone: 'originalidade, liberdade e visão coletiva', how: 'Inova, rompe padrões e se orienta pelo grupo e pelo futuro' },
    peixes: { name: 'Peixes', tone: 'sensibilidade, imaginação e compaixão', how: 'Flui pela intuição, pelo sonho e pela dissolução de fronteiras' },
  },
  'en-US': {
    aries: { name: 'Aries', tone: 'drive, courage and speed', how: 'It tends to express itself directly, boldly and full of initiative' },
    touro: { name: 'Taurus', tone: 'steadiness, pleasure and solidity', how: 'It seeks stability, comfort and concrete results, at its own pace' },
    gemeos: { name: 'Gemini', tone: 'curiosity, versatility and exchange', how: 'It moves through communication, ideas and several interests at once' },
    cancer: { name: 'Cancer', tone: 'sensitivity, care and memory', how: 'It acts from the bond, protection and what touches the emotions' },
    leao: { name: 'Leo', tone: 'shine, generosity and creativity', how: 'It expresses itself with warmth, healthy pride and a wish to be seen' },
    virgem: { name: 'Virgo', tone: 'precision, care and usefulness', how: 'It works through detail, analysis and continuous improvement' },
    libra: { name: 'Libra', tone: 'harmony, diplomacy and beauty', how: 'It seeks balance, partnership and the meeting with the other' },
    escorpiao: { name: 'Scorpio', tone: 'intensity, depth and power', how: 'It acts through deep layers, focused on the essential and what transforms' },
    sagitario: { name: 'Sagittarius', tone: 'optimism, freedom and meaning', how: 'It expands through adventure, faith and the search for significance' },
    capricornio: { name: 'Capricorn', tone: 'discipline, ambition and maturity', how: 'It builds with focus, responsibility and a long-term view' },
    aquario: { name: 'Aquarius', tone: 'originality, freedom and a collective vision', how: 'It innovates, breaks patterns and orients toward the group and the future' },
    peixes: { name: 'Pisces', tone: 'sensitivity, imagination and compassion', how: 'It flows through intuition, dream and the dissolving of boundaries' },
  },
  'es-ES': {
    aries: { name: 'Aries', tone: 'impulso, coraje y rapidez', how: 'Tiende a expresarse de forma directa, pionera y llena de iniciativa' },
    touro: { name: 'Tauro', tone: 'constancia, placer y solidez', how: 'Busca estabilidad, confort y resultados concretos, a su propio ritmo' },
    gemeos: { name: 'Geminis', tone: 'curiosidad, versatilidad e intercambio', how: 'Se mueve por la comunicacion, las ideas y varios intereses a la vez' },
    cancer: { name: 'Cancer', tone: 'sensibilidad, cuidado y memoria', how: 'Actua desde el vinculo, la proteccion y lo que toca lo emocional' },
    leao: { name: 'Leo', tone: 'brillo, generosidad y creatividad', how: 'Se expresa con calor, orgullo sano y ganas de mostrarse' },
    virgem: { name: 'Virgo', tone: 'precision, cuidado y utilidad', how: 'Funciona por el detalle, el analisis y la mejora continua' },
    libra: { name: 'Libra', tone: 'armonia, diplomacia y belleza', how: 'Busca equilibrio, pareja y el encuentro con el otro' },
    escorpiao: { name: 'Escorpio', tone: 'intensidad, profundidad y poder', how: 'Actua por capas profundas, con foco en lo esencial y lo que transforma' },
    sagitario: { name: 'Sagitario', tone: 'optimismo, libertad y sentido', how: 'Se expande por la aventura, la fe y la busqueda de significado' },
    capricornio: { name: 'Capricornio', tone: 'disciplina, ambicion y madurez', how: 'Construye con foco, responsabilidad y vision de largo plazo' },
    aquario: { name: 'Acuario', tone: 'originalidad, libertad y vision colectiva', how: 'Innova, rompe patrones y se orienta por el grupo y el futuro' },
    peixes: { name: 'Piscis', tone: 'sensibilidad, imaginacion y compasion', how: 'Fluye por la intuicion, el sueno y la disolucion de fronteras' },
  },
  'it-IT': {
    aries: { name: 'Ariete', tone: 'slancio, coraggio e rapidita', how: 'Tende a esprimersi in modo diretto, pioniere e pieno di iniziativa' },
    touro: { name: 'Toro', tone: 'costanza, piacere e solidita', how: 'Cerca stabilita, conforto e risultati concreti, al proprio ritmo' },
    gemeos: { name: 'Gemelli', tone: 'curiosita, versatilita e scambio', how: 'Si muove per la comunicazione, le idee e piu interessi insieme' },
    cancer: { name: 'Cancro', tone: 'sensibilita, cura e memoria', how: 'Agisce dal legame, dalla protezione e da cio che tocca l emotivo' },
    leao: { name: 'Leone', tone: 'splendore, generosita e creativita', how: 'Si esprime con calore, sano orgoglio e voglia di mostrarsi' },
    virgem: { name: 'Vergine', tone: 'precisione, cura e utilita', how: 'Funziona per il dettaglio, l analisi e il miglioramento continuo' },
    libra: { name: 'Bilancia', tone: 'armonia, diplomazia e bellezza', how: 'Cerca equilibrio, partnership e l incontro con l altro' },
    escorpiao: { name: 'Scorpione', tone: 'intensita, profondita e potere', how: 'Agisce per strati profondi, con foco sull essenziale e su cio che trasforma' },
    sagitario: { name: 'Sagittario', tone: 'ottimismo, liberta e senso', how: 'Si espande per l avventura, la fede e la ricerca di significato' },
    capricornio: { name: 'Capricorno', tone: 'disciplina, ambizione e maturita', how: 'Costruisce con foco, responsabilita e visione a lungo termine' },
    aquario: { name: 'Acquario', tone: 'originalita, liberta e visione collettiva', how: 'Innova, rompe schemi e si orienta al gruppo e al futuro' },
    peixes: { name: 'Pesci', tone: 'sensibilita, immaginazione e compassione', how: 'Fluisce per l intuizione, il sogno e la dissoluzione dei confini' },
  },
}

// Conector "assume o tom de" por idioma.
export const SR_SIGN_LINK: Record<string, string> = {
  'pt-BR': 'assume o tom de',
  'en-US': 'takes on the tone of',
  'es-ES': 'asume el tono de',
  'it-IT': 'assume il tono di',
}
