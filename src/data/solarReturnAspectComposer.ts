// Composer de aspectos do RETORNO SOLAR.
// Em vez de um catálogo par-a-par (10 planetas → 45 pares × 5 aspectos × 4 idiomas
// = 900 textos), compomos o texto a partir de dois blocos pequenos e curados:
//   1. o DOMÍNIO do ano de cada planeta (o que ele rege nestes doze meses);
//   2. a DINÂMICA de cada tipo de aspecto (como as duas áreas se relacionam).
// Cobre 100% dos pares em tom de RS. Fallback para o aspecto natal quando algum
// dos pontos não tem domínio definido (nódulos, Quíron, ângulos etc.).
// Regras i18n: en-US sem "will" futuro; es-ES sem tildes; it-IT sem acentos.

// Domínio curto (frase nominal) de cada planeta no ano do RS. Chave: planeta lower.
export const SR_PLANET_YEAR_DOMAIN: Record<string, Record<string, string>> = {
  'pt-BR': {
    sun: 'a vitalidade', moon: 'as emoções', mercury: 'a mente', venus: 'o afeto',
    mars: 'a ação', jupiter: 'a expansão', saturn: 'a estrutura', uranus: 'a liberdade',
    neptune: 'a sensibilidade', pluto: 'a transformação',
  },
  'en-US': {
    sun: 'vitality', moon: 'emotions', mercury: 'the mind', venus: 'affection',
    mars: 'action', jupiter: 'expansion', saturn: 'structure', uranus: 'freedom',
    neptune: 'sensitivity', pluto: 'transformation',
  },
  'es-ES': {
    sun: 'la vitalidad', moon: 'las emociones', mercury: 'la mente', venus: 'el afecto',
    mars: 'la accion', jupiter: 'la expansion', saturn: 'la estructura', uranus: 'la libertad',
    neptune: 'la sensibilidad', pluto: 'la transformacion',
  },
  'it-IT': {
    sun: 'la vitalita', moon: 'le emozioni', mercury: 'la mente', venus: "l'affetto",
    mars: "l'azione", jupiter: "l'espansione", saturn: 'la struttura', uranus: 'la liberta',
    neptune: 'la sensibilita', pluto: 'la trasformazione',
  },
}

type Dynamic = { verb: string; interaction: string; advice: string }

// Dinâmica de cada aspecto. Chave normalizada: conjuncao, sextil, quadratura,
// trigono, oposicao. Compõe: "Neste ano, {d1} e {d2} {verb}. {interaction} {advice}".
export const SR_ASPECT_DYNAMIC: Record<string, Record<string, Dynamic>> = {
  'pt-BR': {
    conjuncao: {
      verb: 'se unem e passam a agir como uma só força',
      interaction: 'As duas áreas se fundem e se intensificam mutuamente.',
      advice: 'Aproveite a energia concentrada, cuidando para não exagerar em um só lado.',
    },
    sextil: {
      verb: 'se apoiam com leveza',
      interaction: 'As duas áreas colaboram e abrem oportunidades.',
      advice: 'Vale dar o primeiro passo para ativar esse potencial favorável.',
    },
    quadratura: {
      verb: 'entram em tensão ao longo do ano',
      interaction: 'As duas áreas se atritam e pedem ajustes.',
      advice: 'O desconforto impulsiona crescimento quando encarado de frente.',
    },
    trigono: {
      verb: 'fluem em harmonia',
      interaction: 'As duas áreas se favorecem com naturalidade.',
      advice: 'Um talento do ano que rende mais quando usado com consciência.',
    },
    oposicao: {
      verb: 'se equilibram em polos opostos',
      interaction: 'As duas áreas puxam para lados contrários e pedem integração.',
      advice: 'Busque o ponto de equilíbrio entre as duas, sem anular nenhuma.',
    },
  },
  'en-US': {
    conjuncao: {
      verb: 'unite and act as a single force',
      interaction: 'The two areas merge and intensify each other.',
      advice: 'Make the most of the concentrated energy, taking care not to overdo one side.',
    },
    sextil: {
      verb: 'support each other with ease',
      interaction: 'The two areas collaborate and open opportunities.',
      advice: 'It helps to take the first step to activate this favorable potential.',
    },
    quadratura: {
      verb: 'enter into tension through the year',
      interaction: 'The two areas rub against each other and ask for adjustments.',
      advice: 'The discomfort drives growth when you face it head-on.',
    },
    trigono: {
      verb: 'flow in harmony',
      interaction: 'The two areas favor each other naturally.',
      advice: 'A gift of the year that yields more when used consciously.',
    },
    oposicao: {
      verb: 'balance on opposite poles',
      interaction: 'The two areas pull in contrary directions and ask for integration.',
      advice: 'Seek the point of balance between the two, without canceling either.',
    },
  },
  'es-ES': {
    conjuncao: {
      verb: 'se unen y pasan a actuar como una sola fuerza',
      interaction: 'Las dos areas se funden y se intensifican mutuamente.',
      advice: 'Aprovecha la energia concentrada, cuidando de no exagerar en un solo lado.',
    },
    sextil: {
      verb: 'se apoyan con ligereza',
      interaction: 'Las dos areas colaboran y abren oportunidades.',
      advice: 'Conviene dar el primer paso para activar este potencial favorable.',
    },
    quadratura: {
      verb: 'entran en tension a lo largo del ano',
      interaction: 'Las dos areas se rozan y piden ajustes.',
      advice: 'La incomodidad impulsa el crecimiento cuando la enfrentas de frente.',
    },
    trigono: {
      verb: 'fluyen en armonia',
      interaction: 'Las dos areas se favorecen con naturalidad.',
      advice: 'Un talento del ano que rinde mas cuando se usa con conciencia.',
    },
    oposicao: {
      verb: 'se equilibran en polos opuestos',
      interaction: 'Las dos areas tiran hacia lados contrarios y piden integracion.',
      advice: 'Busca el punto de equilibrio entre las dos, sin anular ninguna.',
    },
  },
  'it-IT': {
    conjuncao: {
      verb: 'si uniscono e agiscono come una sola forza',
      interaction: 'Le due aree si fondono e si intensificano a vicenda.',
      advice: 'Sfrutta l energia concentrata, badando a non esagerare da un lato solo.',
    },
    sextil: {
      verb: 'si sostengono con leggerezza',
      interaction: 'Le due aree collaborano e aprono opportunita.',
      advice: 'Conviene fare il primo passo per attivare questo potenziale favorevole.',
    },
    quadratura: {
      verb: 'entrano in tensione lungo l anno',
      interaction: 'Le due aree si sfregano e chiedono aggiustamenti.',
      advice: 'Il disagio spinge la crescita quando lo affronti a viso aperto.',
    },
    trigono: {
      verb: 'scorrono in armonia',
      interaction: 'Le due aree si favoriscono con naturalezza.',
      advice: 'Un talento dell anno che rende di piu quando usato con consapevolezza.',
    },
    oposicao: {
      verb: 'si equilibrano su poli opposti',
      interaction: 'Le due aree tirano in direzioni contrarie e chiedono integrazione.',
      advice: "Cerca il punto di equilibrio tra le due, senza annullarne nessuna.",
    },
  },
}

// Prefixo "Neste ano," de cada idioma.
export const SR_ASPECT_LEAD: Record<string, string> = {
  'pt-BR': 'Neste ano,',
  'en-US': 'This year,',
  'es-ES': 'Este ano,',
  'it-IT': "Quest'anno,",
}
