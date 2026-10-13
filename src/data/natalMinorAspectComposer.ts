// Composer de ASPECTOS MENORES natais entre dois PLANETAS.
//
// ⚠️ Por que existe: o catálogo curado `natalPlanetAspectOverrides*` tem
// exatamente 225 chaves = 45 pares × 5 aspectos MAIORES. Quincúncio,
// semiquadratura e sesquiquadratura nunca estiveram lá — e o motor os emite
// (desde `b96acf8` eles contam como tensos). Resultado na aba Mapa: "Júpiter
// quincúncio Urano · 0.1°", "Júpiter semiquadratura Sol · 0.3°" com título,
// orbe e NENHUM texto, no meio de aspectos que tinham leitura.
//
// Catálogo par-a-par custaria 45 × 3 × 4 idiomas = 540 textos. Compomos a
// partir de dois blocos pequenos e curados, como já se faz no Retorno Solar:
//   1. a FUNÇÃO natal de cada planeta (o que ele rege na pessoa, não no ano);
//   2. a DINÂMICA de cada aspecto menor (como as duas funções se relacionam).
//
// Os maiores continuam vindo do catálogo curado — este composer só é chamado
// quando a chave não se forma. Regras i18n: en-US sem "will"; es-ES sem tildes
// nem ñ; it-IT sem acentos.

// Função natal (frase nominal com possessivo). Chave: planeta lower.
export const NATAL_PLANET_FUNCTION: Record<string, Record<string, string>> = {
  'pt-BR': {
    sun: 'a sua identidade', moon: 'a sua vida emocional', mercury: 'o seu modo de pensar',
    venus: 'o seu jeito de amar', mars: 'a sua forma de agir',
    jupiter: 'a sua vontade de expandir', saturn: 'o seu senso de limite',
    uranus: 'a sua necessidade de liberdade', neptune: 'a sua sensibilidade',
    pluto: 'a sua força de transformação',
  },
  'en-US': {
    sun: 'your identity', moon: 'your emotional life', mercury: 'your way of thinking',
    venus: 'your way of loving', mars: 'your way of acting',
    jupiter: 'your drive to expand', saturn: 'your sense of limits',
    uranus: 'your need for freedom', neptune: 'your sensitivity',
    pluto: 'your power to transform',
  },
  'es-ES': {
    sun: 'tu identidad', moon: 'tu vida emocional', mercury: 'tu modo de pensar',
    venus: 'tu manera de amar', mars: 'tu forma de actuar',
    jupiter: 'tu impulso de expandirte', saturn: 'tu sentido del limite',
    uranus: 'tu necesidad de libertad', neptune: 'tu sensibilidad',
    pluto: 'tu fuerza de transformacion',
  },
  'it-IT': {
    sun: 'la tua identita', moon: 'la tua vita emotiva', mercury: 'il tuo modo di pensare',
    venus: 'il tuo modo di amare', mars: 'il tuo modo di agire',
    jupiter: 'la tua spinta a espanderti', saturn: 'il tuo senso del limite',
    uranus: 'il tuo bisogno di liberta', neptune: 'la tua sensibilita',
    pluto: 'la tua forza di trasformazione',
  },
}

// Conectivo entre as duas funções, por idioma.
export const NATAL_MINOR_CONJUNCTION: Record<string, string> = {
  'pt-BR': 'e', 'en-US': 'and', 'es-ES': 'y', 'it-IT': 'e',
}

type Dinamica = { verb: string; interaction: string; advice: string }

// Dinâmica dos três aspectos menores. Compõe: "{f1} {conj} {f2} {verb}. {interaction} {advice}".
// A substância astrológica de cada um é diferente e o texto precisa refletir isso —
// senão os três viram o mesmo aviso de tensão com as palavras trocadas.
export const NATAL_MINOR_ASPECT_DYNAMIC: Record<string, Record<string, Dinamica>> = {
  'pt-BR': {
    // 30°: signos vizinhos. Apoio discreto que só rende se for acionado.
    semissextil: {
      verb: 'se ajudam de leve, quase sem você perceber',
      interaction: 'São vizinhas no mapa: uma puxa a outra devagar, e o apoio aparece mais no acumulado do que num momento.',
      advice: 'Não é um talento que se impõe — rende quando você vai atrás dele de propósito.',
    },
    // 150°: signos sem elemento, modalidade ou polaridade em comum.
    quincuncio: {
      verb: 'não se encaixam de imediato',
      interaction: 'São duas partes sem linguagem em comum: nenhuma está errada, mas uma precisa ceder para a outra funcionar.',
      advice: 'O ajuste não se faz uma vez só — ele volta a ser pedido sempre que as duas são acionadas juntas.',
    },
    // 45°: atrito menor, recorrente.
    semiquadratura: {
      verb: 'se atritam em doses pequenas e repetidas',
      interaction: 'Não é um conflito aberto, e sim um incômodo miúdo que reaparece nas mesmas situações.',
      advice: 'O desgaste vem da repetição, não da intensidade — vale notar o padrão antes de ele cansar.',
    },
    // 135°: tensão que acumula e descarrega, muitas vezes por gatilho externo.
    sesquiquadratura: {
      verb: 'acumulam tensão até ela transbordar',
      interaction: 'A pressão se junta em silêncio e costuma sair de uma vez, quase sempre disparada por algo de fora.',
      advice: 'Dar vazão aos poucos evita que a conta chegue toda junta.',
    },
  },
  'en-US': {
    semissextil: {
      verb: 'help each other quietly, almost unnoticed',
      interaction: 'They are neighbors in the chart: one nudges the other slowly, and the support shows over time rather than in a moment.',
      advice: 'It is not a gift that imposes itself — it pays off when you go after it on purpose.',
    },
    quincuncio: {
      verb: 'do not fit together straight away',
      interaction: 'These two parts share no common language: neither is wrong, but one has to give way for the other to work.',
      advice: 'The adjustment is not made once — it comes up again every time the two are called on together.',
    },
    semiquadratura: {
      verb: 'chafe in small, repeated doses',
      interaction: 'It is not open conflict, more a minor irritation that shows up in the same situations.',
      advice: 'The wear comes from repetition, not from intensity — worth noticing the pattern before it tires you out.',
    },
    sesquiquadratura: {
      verb: 'build up tension until it spills over',
      interaction: 'The pressure gathers quietly and tends to come out all at once, usually set off by something external.',
      advice: 'Letting it out in small amounts keeps the bill from arriving in full.',
    },
  },
  'es-ES': {
    semissextil: {
      verb: 'se ayudan apenas, casi sin que lo notes',
      interaction: 'Son vecinas en el mapa: una empuja a la otra despacio, y el apoyo se ve mas en el acumulado que en un momento.',
      advice: 'No es un talento que se impone — rinde cuando lo buscas a proposito.',
    },
    quincuncio: {
      verb: 'no encajan de inmediato',
      interaction: 'Son dos partes sin lenguaje comun: ninguna esta equivocada, pero una debe ceder para que la otra funcione.',
      advice: 'El ajuste no se hace una sola vez — vuelve a pedirse cada vez que las dos se activan juntas.',
    },
    semiquadratura: {
      verb: 'rozan en dosis leves y repetidas',
      interaction: 'No es un conflicto abierto, sino una molestia menor que reaparece en las mismas situaciones.',
      advice: 'El desgaste viene de la repeticion, no de la intensidad — conviene ver el patron antes de que canse.',
    },
    sesquiquadratura: {
      verb: 'acumulan tension hasta que desborda',
      interaction: 'La presion se junta en silencio y suele salir de golpe, casi siempre disparada por algo externo.',
      advice: 'Darle salida poco a poco evita que la cuenta llegue entera.',
    },
  },
  'it-IT': {
    semissextil: {
      verb: 'si aiutano appena, quasi senza che tu te ne accorga',
      interaction: 'Sono vicine nel tema: una spinge l altra piano, e il sostegno si vede nel lungo periodo piu che in un momento.',
      advice: 'Non e un talento che si impone — rende quando lo cerchi di proposito.',
    },
    quincuncio: {
      verb: 'non si incastrano subito',
      interaction: 'Sono due parti senza una lingua comune: nessuna sbaglia, ma una deve cedere perche l altra funzioni.',
      advice: 'L aggiustamento non si fa una volta sola — torna a essere chiesto ogni volta che le due si attivano insieme.',
    },
    semiquadratura: {
      verb: 'si sfregano in dosi piccole e ripetute',
      interaction: 'Non e un conflitto aperto, ma un fastidio minuto che ritorna nelle stesse situazioni.',
      advice: 'Il logorio viene dalla ripetizione, non dall intensita — conviene notare lo schema prima che stanchi.',
    },
    sesquiquadratura: {
      verb: 'accumulano tensione finche trabocca',
      interaction: 'La pressione si raccoglie in silenzio e tende a uscire tutta insieme, quasi sempre innescata da qualcosa di esterno.',
      advice: 'Sfogarla poco per volta evita che il conto arrivi tutto in una volta.',
    },
  },
}
