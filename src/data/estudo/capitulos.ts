import type { CategoriaVerbete, T } from './tipos'

/**
 * OS CAPÍTULOS DA TRILHA E AS ESTANTES DA BIBLIOTECA.
 *
 * ⚠️ ISTO É CONTEÚDO, e por isso mora em `data` e não na tela. Os nomes dos
 * atos estavam dentro do `EstudoScreen`, onde o índice, o cabeçalho da lição e
 * a própria lista precisavam deles — três lugares lendo de um arquivo de
 * interface, e cada tela nova seria a quarta cópia.
 *
 * ⚠️ A ABERTURA DIZ POR QUE O CAPÍTULO EXISTE, não o que ele contém. A lista
 * de lições logo abaixo já diz o conteúdo; repetir isso em prosa não ajudaria
 * ninguém a decidir se vale entrar.
 */
export interface Capitulo {
  ato: 0 | 1 | 2 | 3 | 4
  nome: T
  /** Duas ou três linhas, no topo do capítulo. */
  abertura: T
}

export const CAPITULOS: Capitulo[] = [
  {
    ato: 0,
    nome: {
      'pt-BR': 'Por que o céu diz algo',
      'en-US': 'Why the sky says anything',
      'es-ES': 'Por que el cielo dice algo',
      'it-IT': 'Perche il cielo dice qualcosa',
    },
    abertura: {
      'pt-BR': 'Antes de ler um mapa, é preciso saber por que alguém olharia para o céu em busca de resposta. O que vem aqui não pede fé: pede que você acompanhe de onde essa pergunta nasceu, e o que ela nunca prometeu.',
      'en-US': 'Before reading a chart, it helps to know why anyone would look up for an answer. What comes here asks for no faith: it asks you to follow where that question came from, and what it never promised.',
      'es-ES': 'Antes de leer una carta, hace falta saber por que alguien miraria al cielo en busca de respuesta. Lo que viene aqui no pide fe: pide que acompanes de donde nacio esa pregunta, y lo que ella nunca prometio.',
      'it-IT': 'Prima di leggere una carta, serve sapere perche qualcuno guarderebbe il cielo in cerca di risposta. Cio che segue non chiede fede: chiede di seguire da dove e nata quella domanda, e cosa non ha mai promesso.',
    },
  },
  {
    ato: 1,
    nome: {
      'pt-BR': 'As perguntas de um mapa',
      'en-US': 'The questions a chart answers',
      'es-ES': 'Las preguntas de una carta',
      'it-IT': 'Le domande di una carta',
    },
    abertura: {
      'pt-BR': 'Um mapa não é uma lista de símbolos para decorar. É um conjunto de respostas a três perguntas — o quê, como e onde. Quem aprende a separá-las lê qualquer linha deste app sem precisar de tabela.',
      'en-US': 'A chart is not a list of symbols to memorise. It is a set of answers to three questions — what, how and where. Whoever learns to tell them apart reads any line in this app without a table.',
      'es-ES': 'Una carta no es una lista de simbolos para memorizar. Es un conjunto de respuestas a tres preguntas: que, como y donde. Quien aprende a separarlas lee cualquier linea de esta app sin tabla alguna.',
      'it-IT': 'Una carta non e un elenco di simboli da memorizzare. E un insieme di risposte a tre domande: cosa, come e dove. Chi impara a distinguerle legge qualunque riga di questa app senza tabelle.',
    },
  },
  {
    ato: 2,
    nome: {
      'pt-BR': 'O que liga',
      'en-US': 'What connects',
      'es-ES': 'Lo que conecta',
      'it-IT': 'Cio che collega',
    },
    abertura: {
      'pt-BR': 'Até aqui cada peça estava sozinha. Agora elas se falam — e o ângulo entre duas decide se a conversa flui ou atrita. É neste capítulo que a maior parte do que o app mostra todo dia começa a fazer sentido.',
      'en-US': 'So far each piece stood alone. Now they speak to each other — and the angle between two decides whether the conversation flows or grinds. This is the chapter where most of what the app shows daily starts to make sense.',
      'es-ES': 'Hasta aqui cada pieza estaba sola. Ahora se hablan, y el angulo entre dos decide si la conversacion fluye o roza. En este capitulo empieza a tener sentido la mayor parte de lo que la app muestra cada dia.',
      'it-IT': 'Fin qui ogni pezzo stava da solo. Ora si parlano, e l angolo tra due decide se la conversazione scorre o attrita. In questo capitolo inizia ad avere senso gran parte di cio che l app mostra ogni giorno.',
    },
  },
  {
    ato: 3,
    nome: {
      'pt-BR': 'O tempo',
      'en-US': 'Time',
      'es-ES': 'El tiempo',
      'it-IT': 'Il tempo',
    },
    abertura: {
      'pt-BR': 'O mapa não muda; o céu não para. Destas duas coisas ao mesmo tempo nasce tudo o que você vê mudar na tela de um dia para o outro — e a diferença entre o que você é e o que está apenas passando.',
      'en-US': 'The chart does not change; the sky does not stop. From these two at once comes everything you see shift on the screen from one day to the next — and the difference between what you are and what is merely passing.',
      'es-ES': 'La carta no cambia; el cielo no se detiene. De estas dos cosas a la vez nace todo lo que ves cambiar en la pantalla de un dia a otro, y la diferencia entre lo que eres y lo que solo esta pasando.',
      'it-IT': 'La carta non cambia; il cielo non si ferma. Da queste due cose insieme nasce tutto cio che vedi cambiare sullo schermo da un giorno all altro, e la differenza tra cio che sei e cio che sta solo passando.',
    },
  },
  {
    ato: 4,
    nome: {
      'pt-BR': 'Ler sozinho',
      'en-US': 'Reading on your own',
      'es-ES': 'Leer por tu cuenta',
      'it-IT': 'Leggere da soli',
    },
    abertura: {
      'pt-BR': 'As peças estão na mesa. O que falta é a ordem em que se olha para elas — e é só ela que separa quem decora combinações de quem lê um mapa. Aqui a leitura volta para as suas mãos.',
      'en-US': 'The pieces are on the table. What is missing is the order you look at them in — and only that separates whoever memorises combinations from whoever reads a chart. Here the reading returns to your hands.',
      'es-ES': 'Las piezas estan sobre la mesa. Lo que falta es el orden en que se las mira, y solo eso separa a quien memoriza combinaciones de quien lee una carta. Aqui la lectura vuelve a tus manos.',
      'it-IT': 'I pezzi sono sul tavolo. Cio che manca e l ordine in cui li si guarda, e solo questo separa chi memorizza combinazioni da chi legge una carta. Qui la lettura torna nelle tue mani.',
    },
  },
]

/**
 * AS ESTANTES DA BIBLIOTECA.
 *
 * ⚠️ A BIBLIOTECA NÃO TEM ORDEM, e isso é o que a separa da trilha: ela se
 * consulta, não se percorre. Por isso as estantes têm nome e não têm abertura
 * — uma prosa de apresentação sugeriria um começo que não existe.
 */
export const ESTANTES: Array<{ chave: CategoriaVerbete; nome: T }> = [
  {
    chave: 'planeta',
    nome: { 'pt-BR': 'Planetas', 'en-US': 'Planets', 'es-ES': 'Planetas', 'it-IT': 'Pianeti' },
  },
  {
    chave: 'signo',
    nome: { 'pt-BR': 'Signos', 'en-US': 'Signs', 'es-ES': 'Signos', 'it-IT': 'Segni' },
  },
  {
    chave: 'casa',
    nome: { 'pt-BR': 'Casas', 'en-US': 'Houses', 'es-ES': 'Casas', 'it-IT': 'Case' },
  },
  {
    chave: 'aspecto',
    nome: { 'pt-BR': 'Aspectos', 'en-US': 'Aspects', 'es-ES': 'Aspectos', 'it-IT': 'Aspetti' },
  },
  {
    chave: 'conceito',
    nome: { 'pt-BR': 'Conceitos', 'en-US': 'Concepts', 'es-ES': 'Conceptos', 'it-IT': 'Concetti' },
  },
]
