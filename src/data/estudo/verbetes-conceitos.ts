import type { Unidade } from './tipos'

/**
 * Os conceitos transversais — o que não é planeta, signo, casa nem aspecto.
 *
 * ⚠️ A BIBLIOTECA CRESCE UM VERBETE POR VEZ. Cada um já é útil sozinho, então
 * nada aqui bloqueia a entrega: a tela funciona com um verbete e funciona com
 * cinquenta.
 */
export const VERBETES_CONCEITOS: Unidade[] = [
  {
    id: 'conceito-orbe',
    tipo: 'verbete',
    categoria: 'conceito',
    titulo: {
      'pt-BR': 'Orbe',
      'en-US': 'Orb',
      'es-ES': 'Orbe',
      'it-IT': 'Orbe',
    },
    resumo: {
      'pt-BR': 'A distância que ainda conta como encontro entre dois planetas.',
      'en-US': 'The distance that still counts as a meeting between two planets.',
      'es-ES': 'La distancia que todavia cuenta como encuentro entre dos planetas.',
      'it-IT': 'La distanza che conta ancora come incontro tra due pianeti.',
    },
    blocos: [
      {
        tipo: 'paragrafo',
        texto: {
          'pt-BR': 'Dois planetas quase nunca estão no ângulo exato. A orbe é a folga que a tradição aceita em volta do ângulo perfeito: quanto mais perto do exato, mais o encontro pesa na leitura.',
          'en-US': 'Two planets are almost never at the exact angle. The orb is the slack tradition accepts around the perfect angle: the closer to exact, the more the meeting weighs in the reading.',
          'es-ES': 'Dos planetas casi nunca estan en el angulo exacto. El orbe es la holgura que la tradicion acepta alrededor del angulo perfecto: cuanto mas cerca del exacto, mas pesa el encuentro en la lectura.',
          'it-IT': 'Due pianeti non sono quasi mai all angolo esatto. L orbe e la tolleranza che la tradizione accetta intorno all angolo perfetto: piu e vicino all esatto, piu l incontro pesa nella lettura.',
        },
      },
      {
        tipo: 'paragrafo',
        texto: {
          'pt-BR': 'É por isso que o app mostra um número de graus ao lado de cada aspecto. Zero grau é o encontro cheio; cinco ou seis graus é um encontro de fundo, que existe mas não domina o dia.',
          'en-US': 'That is why the app shows a degree figure next to each aspect. Zero degrees is the full meeting; five or six degrees is a background meeting, present but not ruling the day.',
          'es-ES': 'Por eso la app muestra un numero de grados junto a cada aspecto. Cero grados es el encuentro pleno; cinco o seis grados es un encuentro de fondo, que existe pero no domina el dia.',
          'it-IT': 'Per questo l app mostra un numero di gradi accanto a ogni aspetto. Zero gradi e l incontro pieno; cinque o sei gradi e un incontro di sfondo, presente ma che non domina la giornata.',
        },
      },
      {
        tipo: 'destaque',
        texto: {
          'pt-BR': 'Orbe pequena, efeito nítido. Orbe larga, efeito de fundo.',
          'en-US': 'Small orb, sharp effect. Wide orb, background effect.',
          'es-ES': 'Orbe pequeno, efecto nitido. Orbe amplio, efecto de fondo.',
          'it-IT': 'Orbe stretto, effetto netto. Orbe ampio, effetto di sfondo.',
        },
      },
    ],
    termos: ['orbe'],
    verTambem: [],
    minutos: 1,
  },
]
