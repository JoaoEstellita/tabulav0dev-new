/**
 * Glossário dos termos técnicos que aparecem na interface.
 *
 * O app fala a língua de quem já estuda astrologia: "quadratura" aparece 142
 * vezes na UI, "sextil" 135, "orbe" 29. Para quem nunca viu um mapa, cada um
 * desses é uma parede — e o trial dura 3 dias.
 *
 * Este arquivo serve a dois usos:
 *  - `explicacao`: a frase que abre quando a pessoa toca no termo (glossário).
 *  - `simples`: a palavra que SUBSTITUI a técnica quando o modo Explicado está
 *    ligado. Nem todo termo tem: "Ascendente" não tem sinônimo honesto, então
 *    continua Ascendente e ganha só a explicação ao toque.
 *
 * Regras de escrita:
 *  - a explicação cabe em duas linhas no celular e não usa outro termo técnico;
 *  - descreve o que a pessoa SENTE, não a geometria (ângulo, grau, eclíptica);
 *  - es-ES sem tildes e it-IT sem acentos, como o resto do projeto.
 */

export type IdiomaGlossario = 'pt-BR' | 'en-US' | 'es-ES' | 'it-IT'

export interface TermoGlossario {
  /** Frase de uma ou duas linhas, sem jargão, mostrada ao tocar no termo. */
  explicacao: Record<IdiomaGlossario, string>
  /** Substituto em linguagem comum para o modo Explicado. Ausente = sem troca. */
  simples?: Record<IdiomaGlossario, string>
  /**
   * Nunca vira palavra tocavel no texto, so responde se perguntarem por ele.
   *
   * Para termo que aparece em quase toda linha: realcar um deles por bloco
   * ainda significa um sublinhado em cada card da lista, e o texto fica
   * ilegivel de tanto destaque.
   */
  semRealce?: boolean
}

export const GLOSSARIO: Record<string, TermoGlossario> = {
  // ─── Aspectos (como dois planetas se falam) ────────────────────────────────
  conjuncao: {
    // Sobre o card branco da lista o realce dourado fica ilegivel, e o nome
    // do aspecto ja vem acompanhado do simbolo: nao precisa de link para
    // ser entendido. Continua no glossario para quem perguntar por ele.
    semRealce: true,
    explicacao: {
      'pt-BR': 'Dois planetas no mesmo ponto do céu: as forças deles se misturam e agem como uma só, para o bem e para o difícil.',
      'en-US': 'Two planets at the same spot in the sky: their forces blend and act as one, for better and for harder.',
      'es-ES': 'Dos planetas en el mismo punto del cielo: sus fuerzas se mezclan y actuan como una sola, para bien y para lo dificil.',
      'it-IT': 'Due pianeti nello stesso punto del cielo: le loro forze si mescolano e agiscono come una sola, nel bene e nel difficile.',
    },
  },
  oposicao: {
    // Sobre o card branco da lista o realce dourado fica ilegivel, e o nome
    // do aspecto ja vem acompanhado do simbolo: nao precisa de link para
    // ser entendido. Continua no glossario para quem perguntar por ele.
    semRealce: true,
    explicacao: {
      'pt-BR': 'Dois planetas em lados opostos do céu: puxam você para direções contrárias e pedem equilíbrio entre as duas.',
      'en-US': 'Two planets on opposite sides of the sky: they pull you in contrary directions and ask for balance between them.',
      'es-ES': 'Dos planetas en lados opuestos del cielo: tiran de ti hacia direcciones contrarias y piden equilibrio entre ambas.',
      'it-IT': 'Due pianeti su lati opposti del cielo: ti tirano in direzioni contrarie e chiedono equilibrio tra le due.',
    },
  },
  quadratura: {
    // Sobre o card branco da lista o realce dourado fica ilegivel, e o nome
    // do aspecto ja vem acompanhado do simbolo: nao precisa de link para
    // ser entendido. Continua no glossario para quem perguntar por ele.
    semRealce: true,
    explicacao: {
      'pt-BR': 'Um atrito entre dois planetas. Incomoda, mas é o tipo de pressão que faz você mudar algo que estava parado.',
      'en-US': 'Friction between two planets. It bothers, but it is the kind of pressure that makes you change something that was stuck.',
      'es-ES': 'Una friccion entre dos planetas. Incomoda, pero es el tipo de presion que te hace cambiar algo que estaba detenido.',
      'it-IT': 'Un attrito tra due pianeti. Da fastidio, ma e il tipo di pressione che ti fa cambiare qualcosa che era fermo.',
    },
  },
  trigono: {
    // Sobre o card branco da lista o realce dourado fica ilegivel, e o nome
    // do aspecto ja vem acompanhado do simbolo: nao precisa de link para
    // ser entendido. Continua no glossario para quem perguntar por ele.
    semRealce: true,
    explicacao: {
      'pt-BR': 'Dois planetas que se dão bem: as coisas fluem com pouco esforço nessa área. O risco é só acomodar.',
      'en-US': 'Two planets that get along: things flow with little effort here. The only risk is coasting.',
      'es-ES': 'Dos planetas que se llevan bien: las cosas fluyen con poco esfuerzo en esa area. El riesgo es solo acomodarse.',
      'it-IT': 'Due pianeti che vanno d accordo: le cose scorrono con poco sforzo in quell area. Il rischio e solo adagiarsi.',
    },
  },
  sextil: {
    // Sobre o card branco da lista o realce dourado fica ilegivel, e o nome
    // do aspecto ja vem acompanhado do simbolo: nao precisa de link para
    // ser entendido. Continua no glossario para quem perguntar por ele.
    semRealce: true,
    explicacao: {
      'pt-BR': 'Uma porta aberta entre dois planetas. A chance existe, mas só acontece se você der o primeiro passo.',
      'en-US': 'An open door between two planets. The chance is there, but it only happens if you take the first step.',
      'es-ES': 'Una puerta abierta entre dos planetas. La oportunidad existe, pero solo ocurre si das el primer paso.',
      'it-IT': 'Una porta aperta tra due pianeti. L occasione c e, ma accade solo se fai il primo passo.',
    },
  },
  quincuncio: {
    // Sobre o card branco da lista o realce dourado fica ilegivel, e o nome
    // do aspecto ja vem acompanhado do simbolo: nao precisa de link para
    // ser entendido. Continua no glossario para quem perguntar por ele.
    semRealce: true,
    explicacao: {
      'pt-BR': 'Dois planetas que não se entendem bem: pedem coisas diferentes e exigem ajuste constante de você.',
      'en-US': 'Two planets that do not quite understand each other: they ask for different things and require constant adjustment from you.',
      'es-ES': 'Dos planetas que no se entienden bien: piden cosas distintas y exigen ajuste constante de tu parte.',
      'it-IT': 'Due pianeti che non si capiscono bene: chiedono cose diverse e richiedono aggiustamento costante da te.',
    },
  },

  // ─── Medidas e tempo ───────────────────────────────────────────────────────
  orbe: {
    explicacao: {
      'pt-BR': 'O quanto esse encontro entre planetas está exato. Quanto menor o número, mais forte você sente.',
      'en-US': 'How exact this meeting between planets is. The smaller the number, the stronger you feel it.',
      'es-ES': 'Que tan exacto esta este encuentro entre planetas. Cuanto menor el numero, mas fuerte lo sientes.',
      'it-IT': 'Quanto e esatto questo incontro tra pianeti. Piu piccolo e il numero, piu forte lo senti.',
    },
    simples: { 'pt-BR': 'precisão', 'en-US': 'exactness', 'es-ES': 'precision', 'it-IT': 'precisione' },
  },
  transito: {
    explicacao: {
      'pt-BR': 'Onde os planetas estão hoje, e como isso toca o céu do seu nascimento. É o que muda — seu mapa de nascimento não muda nunca.',
      'en-US': 'Where the planets are today, and how that touches the sky of your birth. This is what changes — your birth chart never does.',
      'es-ES': 'Donde estan los planetas hoy, y como eso toca el cielo de tu nacimiento. Es lo que cambia — tu carta natal no cambia nunca.',
      'it-IT': 'Dove sono i pianeti oggi, e come questo tocca il cielo della tua nascita. E cio che cambia — il tuo tema natale non cambia mai.',
    },
    simples: { 'pt-BR': 'movimento de hoje', 'en-US': "today's movement", 'es-ES': 'movimiento de hoy', 'it-IT': 'movimento di oggi' },
  },
  natal: {
    explicacao: {
      'pt-BR': 'O céu exato do momento em que você nasceu. É a sua base e não muda nunca.',
      'en-US': 'The exact sky at the moment you were born. It is your baseline and never changes.',
      'es-ES': 'El cielo exacto del momento en que naciste. Es tu base y no cambia nunca.',
      'it-IT': 'Il cielo esatto del momento in cui sei nato. E la tua base e non cambia mai.',
    },
    // Aparece em quase toda linha de transito ("Netuno (natal)"). Realcar e
    // trocar por "(de nascimento)" enchia a lista de sublinhados dourados e
    // alongava cada linha — virou ruido em vez de ajuda. "Natal" ja e curto e
    // o contexto ensina; quem quiser a definicao acha no termo "transito".
    semRealce: true,
  },
  retrogrado: {
    explicacao: {
      'pt-BR': 'O planeta parece andar para trás visto da Terra. Costuma pedir revisão: rever, refazer, retomar.',
      'en-US': 'The planet appears to move backwards seen from Earth. It usually asks for review: revisit, redo, resume.',
      'es-ES': 'El planeta parece andar hacia atras visto desde la Tierra. Suele pedir revision: revisar, rehacer, retomar.',
      'it-IT': 'Il pianeta sembra andare indietro visto dalla Terra. Di solito chiede revisione: rivedere, rifare, riprendere.',
    },
  },

  // ─── Pontos e estruturas do mapa ───────────────────────────────────────────
  ascendente: {
    explicacao: {
      'pt-BR': 'O signo que estava nascendo no horizonte na sua hora de nascimento. É a primeira impressão que você passa.',
      'en-US': 'The sign rising on the horizon at your birth time. It is the first impression you give.',
      'es-ES': 'El signo que estaba naciendo en el horizonte en tu hora de nacimiento. Es la primera impresion que das.',
      'it-IT': 'Il segno che sorgeva all orizzonte alla tua ora di nascita. E la prima impressione che dai.',
    },
  },
  casa: {
    explicacao: {
      'pt-BR': 'Uma das 12 áreas da vida no mapa: dinheiro, amor, trabalho, família. Diz ONDE o assunto acontece.',
      'en-US': 'One of the 12 areas of life in the chart: money, love, work, family. It says WHERE the matter happens.',
      'es-ES': 'Una de las 12 areas de la vida en el mapa: dinero, amor, trabajo, familia. Dice DONDE ocurre el asunto.',
      'it-IT': 'Una delle 12 aree della vita nel tema: denaro, amore, lavoro, famiglia. Dice DOVE accade la cosa.',
    },
    simples: { 'pt-BR': 'área da vida', 'en-US': 'area of life', 'es-ES': 'area de vida', 'it-IT': 'area della vita' },
  },
  'meio do ceu': {
    explicacao: {
      'pt-BR': 'O ponto mais alto do seu mapa. Fala de carreira, reputação e do que você quer ser reconhecido por fazer.',
      'en-US': 'The highest point of your chart. It speaks of career, reputation and what you want to be known for.',
      'es-ES': 'El punto mas alto de tu mapa. Habla de carrera, reputacion y de aquello por lo que quieres ser reconocido.',
      'it-IT': 'Il punto piu alto del tuo tema. Parla di carriera, reputazione e di cio per cui vuoi essere riconosciuto.',
    },
  },
  stellium: {
    explicacao: {
      'pt-BR': 'Três ou mais planetas juntos no mesmo lugar do mapa. Concentra muita energia num só assunto da sua vida.',
      'en-US': 'Three or more planets together in the same spot of the chart. It concentrates a lot of energy on a single matter of your life.',
      'es-ES': 'Tres o mas planetas juntos en el mismo lugar del mapa. Concentra mucha energia en un solo asunto de tu vida.',
      'it-IT': 'Tre o piu pianeti insieme nello stesso punto del tema. Concentra molta energia su una sola questione della tua vita.',
    },
    simples: { 'pt-BR': 'concentração de planetas', 'en-US': 'planet cluster', 'es-ES': 'concentracion de planetas', 'it-IT': 'concentrazione di pianeti' },
  },
  cuspide: {
    explicacao: {
      'pt-BR': 'A linha onde uma área da vida termina e a próxima começa no seu mapa.',
      'en-US': 'The line where one area of life ends and the next begins in your chart.',
      'es-ES': 'La linea donde un area de la vida termina y la siguiente comienza en tu mapa.',
      'it-IT': 'La linea dove un area della vita finisce e la successiva inizia nel tuo tema.',
    },
    simples: { 'pt-BR': 'início da área', 'en-US': 'area start', 'es-ES': 'inicio del area', 'it-IT': 'inizio dell area' },
  },
  sinastria: {
    explicacao: {
      'pt-BR': 'A comparação entre dois mapas. Mostra onde vocês se encaixam e onde costumam esbarrar.',
      'en-US': 'The comparison between two charts. It shows where you fit together and where you tend to clash.',
      'es-ES': 'La comparacion entre dos mapas. Muestra donde encajan y donde suelen chocar.',
      'it-IT': 'Il confronto tra due temi. Mostra dove vi incastrate e dove tendete a scontrarvi.',
    },
    simples: { 'pt-BR': 'comparação de mapas', 'en-US': 'chart comparison', 'es-ES': 'comparacion de mapas', 'it-IT': 'confronto di temi' },
  },
  efemeride: {
    explicacao: {
      'pt-BR': 'A tabela que diz onde cada planeta estava em cada dia. É a fonte dos cálculos do app.',
      'en-US': 'The table that says where each planet was on each day. It is the source of the app calculations.',
      'es-ES': 'La tabla que dice donde estaba cada planeta en cada dia. Es la fuente de los calculos de la app.',
      'it-IT': 'La tabella che dice dove era ogni pianeta in ogni giorno. E la fonte dei calcoli dell app.',
    },
  },
  'revolucao solar': {
    explicacao: {
      'pt-BR': 'O mapa do seu aniversário, quando o Sol volta ao ponto exato do nascimento. Dá o tom do seu ano.',
      'en-US': 'Your birthday chart, when the Sun returns to its exact birth position. It sets the tone of your year.',
      'es-ES': 'El mapa de tu cumpleanos, cuando el Sol vuelve al punto exacto del nacimiento. Da el tono de tu anno.',
      'it-IT': 'Il tema del tuo compleanno, quando il Sole torna al punto esatto della nascita. Da il tono del tuo anno.',
    },
    simples: { 'pt-BR': 'mapa do aniversário', 'en-US': 'birthday chart', 'es-ES': 'mapa del cumpleanos', 'it-IT': 'tema del compleanno' },
  },
}

/** Chave canônica de um termo: minúsculo, sem acento, espaços colapsados. */
export function chaveTermo(texto: string): string {
  return String(texto || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Termos conhecidos, do mais longo para o mais curto — casa "meio do ceu" antes de "casa". */
/**
 * Termos que o texto pode realcar, do mais longo para o mais curto (para
 * "meio do ceu" ganhar de "ceu"). Quem tem `semRealce` fica de fora: continua
 * no glossario e responde a `explicarTermo`, mas nao vira link no meio da
 * frase.
 */
export const TERMOS_ORDENADOS: string[] = Object.keys(GLOSSARIO)
  .filter((k) => !GLOSSARIO[k].semRealce)
  .sort((a, b) => b.length - a.length)

/** Explicação de um termo no idioma pedido, ou null se não for do glossário. */
export function explicarTermo(termo: string, idioma: IdiomaGlossario): string | null {
  const entrada = GLOSSARIO[chaveTermo(termo)]
  if (!entrada) return null
  return entrada.explicacao[idioma] || entrada.explicacao['pt-BR']
}

/** Versão em linguagem comum de um termo, ou null quando não há troca honesta. */
export function simplificarTermo(termo: string, idioma: IdiomaGlossario): string | null {
  const entrada = GLOSSARIO[chaveTermo(termo)]
  if (!entrada?.simples) return null
  return entrada.simples[idioma] || entrada.simples['pt-BR']
}
