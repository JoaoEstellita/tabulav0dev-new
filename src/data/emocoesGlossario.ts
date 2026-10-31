import type { ChaveEmocao } from '../utils/emocoesDoDia'

/**
 * O QUE CADA TENDÊNCIA SIGNIFICA — o texto que abre junto com o número.
 *
 * ⚠️ Mora num `.ts` e não num `.tsx` de propósito: o Vitest não consegue
 * interpretar `react-native` (Flow), então qualquer dado que precise de teste
 * tem de ficar fora de arquivo de componente. Este projeto já tropeçou nisso
 * três vezes na mesma sessão.
 *
 * Por que existe: "Ansiedade 73" sozinho é um oráculo. A pessoa não sabe se é
 * muito, se é dela, nem o que fazer com aquilo. Três coisas tiram o número do
 * escuro — a definição (o que esta palavra mede aqui), a leitura (o que fazer
 * com alto e com baixo) e a fonte (que planetas movem este anel, mesmo nos
 * dias em que nenhum deles aparece na lista de baixo).
 *
 * ⚠️ REGRA DE REDAÇÃO: o texto fala do DIA, nunca da pessoa. "O atrito do dia",
 * não "você está estressado". O app não tem nenhum dado sobre o estado
 * emocional de ninguém, e a diferença entre as duas frases é a diferença entre
 * uma leitura e um diagnóstico que o dado não sustenta.
 *
 * ⚠️ i18n: es-ES sem tis nem ñ, it-IT sem acentos — regra do projeto, travada
 * em teste. pt-BR mantém a acentuação inteira.
 */

/** [pt-BR, en-US, es-ES, it-IT] */
type Quatro = [string, string, string, string]

export type VerbeteEmocao = {
  /** O que esta palavra mede aqui. Duas linhas no máximo. */
  definicao: Quatro
  /** Como ler o número alto e o baixo. O "e daí" da coisa. */
  leitura: Quatro
  /** Os planetas que movem o anel — ensina mesmo quando não aparecem hoje. */
  fonte: Quatro
  /**
   * O que um valor ALTO significa no MAPA NATAL — temperamento, não o dia.
   *
   * ⚠️ As outras três linhas falam do DIA ("o atrito do dia"), e no mapa isso
   * estaria errado: o natal não é um dia. A distinção que esta linha carrega é
   * sempre a mesma — o que é de ESTRUTURA contra o que é do momento.
   *
   * ⚠️ Fala do MAPA, nunca da pessoa. Aqui a tentação é maior do que no resto
   * da feature, porque o natal parece descrever quem alguém é; ele descreve
   * quantos aspectos natais alimentam aquele anel.
   */
  natal: Quatro
}

export const GLOSSARIO_EMOCOES: Record<ChaveEmocao, VerbeteEmocao> = {
  afeto: {
    definicao: [
      'O lado gentil do dia: prazer, carinho, gosto pelas coisas, boa companhia.',
      "The day's gentle side: pleasure, warmth, liking things, good company.",
      'El lado amable del dia: placer, carino, gusto por las cosas, buena compania.',
      'Il lato gentile del giorno: piacere, affetto, gusto per le cose, buona compagnia.',
    ],
    leitura: [
      'Alto, o que for afetuoso tende a fluir. Baixo não é frieza — é o céu não estar empurrando pra esse lado.',
      'High, anything affectionate tends to flow. Low is not coldness — the sky just is not pushing that way.',
      'Alto, lo afectuoso tiende a fluir. Bajo no es frialdad: el cielo solo no empuja hacia ese lado.',
      'Alto, cio che e affettuoso tende a scorrere. Basso non e freddezza: il cielo non spinge da quella parte.',
    ],
    fonte: [
      'Vênus e Sol, em aspecto macio',
      'Venus and Sun, in soft aspect',
      'Venus y Sol, en aspecto suave',
      'Venere e Sole, in aspetto morbido',
    ],
    natal: [
      'Alto no mapa, o desenho já pende para o prazer e a troca; baixo, esse lado depende mais do dia.',
      'High in the chart, the design already leans toward pleasure and exchange; low, that side depends more on the day.',
      'Alto en la carta, el diseno ya se inclina al placer y al intercambio; bajo, ese lado depende mas del dia.',
      'Alto nella carta, il disegno pende gia verso il piacere e lo scambio; basso, quel lato dipende piu dal giorno.',
    ],
  },

  entusiasmo: {
    definicao: [
      'O impulso de agir: vontade, coragem, horizonte aberto. É o oposto ativo do afeto — um faz bem, o outro põe pra fora.',
      'The push to act: drive, nerve, open horizon. The active opposite of affection — one feels good, the other gets you moving.',
      'El impulso de actuar: ganas, valor, horizonte abierto. Es el opuesto activo del afecto: uno hace bien, el otro saca para fuera.',
      "La spinta ad agire: voglia, coraggio, orizzonte aperto. E l'opposto attivo dell'affetto: uno fa bene, l'altro ti muove.",
    ],
    leitura: [
      'Alto, é dia de começar e de pedir. Baixo, o combustível não está lá; não force.',
      'High, a day to start things and to ask. Low, the fuel is not there — do not force it.',
      'Alto, es dia de empezar y de pedir. Bajo, el combustible no esta ahi: no fuerces.',
      'Alto, e giorno per iniziare e per chiedere. Basso, il carburante non c e: non forzare.',
    ],
    fonte: [
      'Júpiter, Sol e Marte, em aspecto macio',
      'Jupiter, Sun and Mars, in soft aspect',
      'Jupiter, Sol y Marte, en aspecto suave',
      'Giove, Sole e Marte, in aspetto morbido',
    ],
    natal: [
      'Alto no mapa, há combustível próprio para começar; baixo, o impulso costuma vir de fora.',
      'High in the chart, there is fuel of its own to start things; low, the push usually comes from outside.',
      'Alto en la carta, hay combustible propio para empezar; bajo, el impulso suele venir de fuera.',
      'Alto nella carta, c e carburante proprio per iniziare; basso, la spinta di solito viene da fuori.',
    ],
  },

  calma: {
    definicao: [
      'O chão do dia: estrutura que segura, sossego, sensação de que as coisas aguentam.',
      "The day's floor: structure that holds, quiet, the sense that things will bear weight.",
      'El suelo del dia: estructura que sostiene, sosiego, sensacion de que las cosas aguantan.',
      'Il pavimento del giorno: struttura che regge, quiete, la sensazione che le cose tengano.',
    ],
    leitura: [
      'Alto, dá pra resolver o difícil sem pressa. Baixo não é agitação — isso é a Ansiedade. É falta de apoio.',
      'High, you can handle the hard thing unhurried. Low is not restlessness — that is Anxiety. It is lack of support.',
      'Alto, se puede resolver lo dificil sin prisa. Bajo no es agitacion: eso es la Ansiedad. Es falta de apoyo.',
      'Alto, puoi risolvere il difficile senza fretta. Basso non e agitazione: quella e l Ansia. E mancanza di appoggio.',
    ],
    fonte: [
      'Saturno, Plutão e Mercúrio, em aspecto macio',
      'Saturn, Pluto and Mercury, in soft aspect',
      'Saturno, Pluton y Mercurio, en aspecto suave',
      'Saturno, Plutone e Mercurio, in aspetto morbido',
    ],
    natal: [
      'Alto no mapa, há estrutura de base que segura; baixo, o apoio tende a vir da situação, não do desenho.',
      'High in the chart, there is underlying structure that holds; low, support tends to come from the situation, not the design.',
      'Alto en la carta, hay estructura de base que sostiene; bajo, el apoyo tiende a venir de la situacion, no del diseno.',
      'Alto nella carta, c e struttura di base che regge; basso, il sostegno tende a venire dalla situazione, non dal disegno.',
    ],
  },

  sensibilidade: {
    definicao: [
      'A pele fina do dia: o quanto o ambiente te alcança, o não dito pesa e as coisas comovem.',
      "The day's thin skin: how much the room reaches you, how much the unsaid weighs, how easily things move you.",
      'La piel fina del dia: cuanto te alcanza el ambiente, cuanto pesa lo no dicho, cuanto te conmueven las cosas.',
      'La pelle sottile del giorno: quanto l ambiente ti raggiunge, quanto pesa il non detto, quanto le cose ti commuovono.',
    ],
    leitura: [
      'Alto, serve pra escuta, arte e intuição — e cansa mais em lugar cheio. Baixo, o dia escorrega sem te marcar.',
      'High, good for listening, art and hunches — and more tiring in a crowd. Low, the day slides by without leaving a mark.',
      'Alto, sirve para escuchar, crear e intuir, y cansa mas en lugar lleno. Bajo, el dia resbala sin dejar marca.',
      'Alto, serve per ascoltare, creare e intuire, e stanca di piu in mezzo alla gente. Basso, il giorno scivola senza lasciare segno.',
    ],
    fonte: [
      'Lua e Netuno, em aspecto macio',
      'Moon and Neptune, in soft aspect',
      'Luna y Neptuno, en aspecto suave',
      'Luna e Nettuno, in aspetto morbido',
    ],
    natal: [
      'Alto no mapa, o ambiente alcança mais fundo por natureza; baixo, o dia escorrega com mais facilidade.',
      'High in the chart, the surroundings reach deeper by nature; low, the day slides by more easily.',
      'Alto en la carta, el ambiente alcanza mas hondo por naturaleza; bajo, el dia resbala con mas facilidad.',
      'Alto nella carta, l ambiente arriva piu a fondo per natura; basso, il giorno scivola piu facilmente.',
    ],
  },

  estresse: {
    definicao: [
      'O atrito do dia: pavio curto, cobrança, coisas que empurram de volta.',
      "The day's friction: short fuse, demands, things that push back.",
      'El roce del dia: mecha corta, exigencia, cosas que empujan de vuelta.',
      "L attrito del giorno: miccia corta, pretese, cose che spingono indietro.",
    ],
    leitura: [
      'Alto, menos briga e mais pausa. É a tendência que mais responde a mexer na agenda.',
      'High, fewer fights and more breaks. This is the one that responds most to changing the schedule.',
      'Alto, menos pelea y mas pausa. Es la que mas responde a mover la agenda.',
      'Alto, meno liti e piu pause. E quella che risponde di piu a cambiare l agenda.',
    ],
    fonte: [
      'Marte e Sol, em aspecto duro',
      'Mars and Sun, in hard aspect',
      'Marte y Sol, en aspecto duro',
      'Marte e Sole, in aspetto duro',
    ],
    natal: [
      'Alto no mapa, há atrito interno de fábrica; baixo, o pavio curto que aparecer é do dia, não do desenho.',
      'High in the chart, there is built-in friction; low, a short fuse that shows up belongs to the day, not the design.',
      'Alto en la carta, hay roce interno de fabrica; bajo, la mecha corta que aparezca es del dia, no del diseno.',
      'Alto nella carta, c e attrito interno di fabbrica; basso, la miccia corta che appare e del giorno, non del disegno.',
    ],
  },

  desanimo: {
    definicao: [
      'O peso do dia: cansaço, porta fechada, vontade baixa.',
      "The day's weight: tiredness, closed doors, low appetite.",
      'El peso del dia: cansancio, puerta cerrada, pocas ganas.',
      'Il peso del giorno: stanchezza, porta chiusa, poca voglia.',
    ],
    leitura: [
      'Alto, o dia pede menos e não mais. Não é tristeza de verdade — é o céu cobrando descanso.',
      'High, the day asks for less, not more. It is not real sadness — it is the sky asking for rest.',
      'Alto, el dia pide menos y no mas. No es tristeza de verdad: es el cielo pidiendo descanso.',
      'Alto, il giorno chiede meno e non di piu. Non e vera tristezza: e il cielo che chiede riposo.',
    ],
    fonte: [
      'Saturno, Netuno e Vênus, em aspecto duro',
      'Saturn, Neptune and Venus, in hard aspect',
      'Saturno, Neptuno y Venus, en aspecto duro',
      'Saturno, Nettuno e Venere, in aspetto duro',
    ],
    natal: [
      'Alto no mapa, o cansaço tem raiz estrutural; baixo, o peso que aparecer é do momento.',
      'High in the chart, the tiredness has a structural root; low, any weight that shows up belongs to the moment.',
      'Alto en la carta, el cansancio tiene raiz estructural; bajo, el peso que aparezca es del momento.',
      'Alto nella carta, la stanchezza ha radice strutturale; basso, il peso che appare e del momento.',
    ],
  },

  ansiedade: {
    definicao: [
      'O sobressalto do dia: chão que se move, mente acelerada, imprevisto.',
      "The day's jolt: ground that shifts, racing mind, the unforeseen.",
      'El sobresalto del dia: suelo que se mueve, mente acelerada, imprevisto.',
      'Il soprassalto del giorno: terreno che si muove, mente accelerata, imprevisto.',
    ],
    leitura: [
      'Alto, o que tira do eixo vem de fora e vem rápido. Ajuda ter plano B e adiar decisão apressada.',
      'High, what knocks you off balance comes from outside and comes fast. A plan B helps; rushed decisions do not.',
      'Alto, lo que te saca del eje viene de fuera y viene rapido. Ayuda tener plan B y aplazar decision apresurada.',
      'Alto, cio che ti sposta arriva da fuori e arriva in fretta. Aiuta avere un piano B e rimandare le decisioni affrettate.',
    ],
    fonte: [
      'Urano e Mercúrio, em aspecto duro',
      'Uranus and Mercury, in hard aspect',
      'Urano y Mercurio, en aspecto duro',
      'Urano e Mercurio, in aspetto duro',
    ],
    natal: [
      'Alto no mapa, o chão se move com mais facilidade por desenho; baixo, o sobressalto vem de fora.',
      'High in the chart, the ground shifts more easily by design; low, the jolt comes from outside.',
      'Alto en la carta, el suelo se mueve con mas facilidad por diseno; bajo, el sobresalto viene de fuera.',
      'Alto nella carta, il terreno si muove piu facilmente per disegno; basso, il soprassalto viene da fuori.',
    ],
  },

  pressao: {
    definicao: [
      'O aperto do dia: cobrança que não dá pra desviar, situação que não deixa saída fácil.',
      "The day's squeeze: a demand you cannot sidestep, a situation with no easy way out.",
      'El apreton del dia: exigencia que no se esquiva, situacion sin salida facil.',
      'La stretta del giorno: una richiesta che non si schiva, una situazione senza uscita facile.',
    ],
    leitura: [
      'Alto, não é dia de forçar saída — é de decidir o essencial e largar o resto. Diferente do Estresse: estresse é atrito, pressão é profundidade.',
      'High, not a day to force your way out — decide what matters and drop the rest. Unlike Stress: stress is friction, pressure is depth.',
      'Alto, no es dia de forzar salida: decide lo esencial y suelta el resto. Distinto del Estres: el estres es roce, la presion es profundidad.',
      'Alto, non e giorno per forzare l uscita: decidi l essenziale e lascia il resto. Diverso dallo Stress: lo stress e attrito, la pressione e profondita.',
    ],
    fonte: [
      'Plutão e Saturno, em aspecto duro',
      'Pluto and Saturn, in hard aspect',
      'Pluton y Saturno, en aspecto duro',
      'Plutone e Saturno, in aspetto duro',
    ],
    natal: [
      'Alto no mapa, há um aperto de fundo que acompanha; baixo, a cobrança que vier é da situação.',
      'High in the chart, there is a background squeeze that stays; low, any demand that comes is from the situation.',
      'Alto en la carta, hay un apreton de fondo que acompana; bajo, la exigencia que venga es de la situacion.',
      'Alto nella carta, c e una stretta di fondo che accompagna; basso, la richiesta che arriva e della situazione.',
    ],
  },
}

/** O índice do idioma dentro das tuplas. */
export function indiceIdioma(idioma: string | undefined): 0 | 1 | 2 | 3 {
  const l = String(idioma || 'pt-BR')
  if (l.startsWith('en')) return 1
  if (l.startsWith('es')) return 2
  if (l.startsWith('it')) return 3
  return 0
}
