/**
 * Os assuntos que um dia comporta.
 *
 * A editorial nasceu mostrando o mesmo evento repetido por ângulo — "Mercúrio
 * entra em Leão" na véspera e no dia, "Eclipse solar total" quatro vezes — e o
 * João disse o que era: aquilo não são opções. Eu tinha montado a lista pelo
 * eixo errado.
 *
 * Os assuntos alternativos já eram calculados; nunca chegavam à tela. Num dia
 * qualquer há de quatro a sete, entre evento do céu, Lua fora de curso e os
 * educativos ancorados nas posições de agora.
 *
 * Este módulo é compartilhado de propósito: o calendário e o gerador precisam
 * concordar no ID de cada assunto, senão a pauta salva ontem aponta para nada.
 */
import {
  eventosDoDia,
  ingressosProximos,
  retrogradacoesVigentes,
  grausCriticos,
  eixoDosNodulos,
} from './eventos.mjs'
import { mapaDoCeu } from './ceu.mjs'
import { temaEducativo, falaComQuemLe } from './educativo.mjs'
import { escrever, rotuloDeVespera } from './vozes.mjs'

/** Os catálogos usam o nome do signo em inglês, minúsculo. */
const SIGNO_EN = {
  'Áries': 'aries', 'Touro': 'taurus', 'Gêmeos': 'gemini', 'Câncer': 'cancer',
  'Leão': 'leo', 'Virgem': 'virgo', 'Libra': 'libra', 'Escorpião': 'scorpio',
  'Sagitário': 'sagittarius', 'Capricórnio': 'capricorn', 'Aquário': 'aquarius',
  'Peixes': 'pisces',
}

/**
 * Identidade estável de um assunto.
 *
 * Estável é a palavra: a pauta guarda o id e o gerador o procura no dia
 * seguinte. Se ele mudar entre uma chamada e outra — por depender de ordem, de
 * relógio ou de sorteio — a escolha do João some sem aviso.
 */
export function idDoAssunto(ev) {
  switch (ev.tipo) {
    case 'lua_fora_de_curso':
      return `vazia:${ev.inicio.toISOString()}`
    // o estado dura semanas: a identidade e o corpo mais a data de inicio, para
    // dois retrogrados do mesmo planeta em anos diferentes nao colidirem
    case 'retrogradacao':
      return `retro:${ev.corpo}:${ev.desde ? ev.desde.toISOString().slice(0, 10) : 'atual'}`
    case 'grau_critico':
      return `grau:${ev.corpo}:${ev.signo}:${ev.grau}`
    case 'nodulos':
      return `nodulos:${ev.norte.signo}`
    case 'eclipse':
      return `eclipse:${ev.luminar}:${ev.quando.toISOString().slice(0, 10)}`
    case 'ingresso':
      return `ingresso:${ev.corpo}:${ev.signo}`
    case 'fase':
      return `fase:${ev.fase}:${ev.signo}`
    case 'retrogrado':
    case 'direto':
      return `${ev.tipo}:${ev.corpo}`
    case 'educativo':
      return `educativo:${ev.chave}`
    case 'aspecto':
      return ev.aspecto?.chave || 'aspecto'
    default:
      return ev.tipo
  }
}

/** O ângulo editorial, conforme a distância do evento. */
export function anguloDoAssunto(ev) {
  if (ev.tipo === 'educativo') return 'O que significa num mapa natal'
  if (ev.tipo === 'lua_fora_de_curso') return 'Aviso do dia — dura horas, e volta toda semana'
  if (ev.tipo === 'retrogradacao') {
    const d = ev.diasRestantes ? Math.round(ev.diasRestantes) : null
    return d ? `Em curso — faltam ${d} dias para acabar` : 'Em curso — o assunto mais procurado do nicho'
  }
  if (ev.tipo === 'grau_critico') {
    return ev.extremo === 'saida' ? 'Último grau — a tradição chama de anarético' : 'Primeiro grau — começo cru'
  }
  if (ev.tipo === 'nodulos') return 'O eixo que quase ninguém explica'
  const falta = ev.diasFalta ?? 0
  if (falta === 0) return 'É hoje — o dado exato, com hora'
  if (falta === 1) return 'Amanhã — o que muda e o que não muda'
  return `Faltam ${falta} dias — explica o que é, antes de todo mundo repetir`
}

/** Corpos cuja entrada em signo o público reconhece sem explicação. */
const CORPOS_DE_PESO = ['Sun', 'Venus', 'Mars', 'Mercury', 'Jupiter', 'Saturn']

/**
 * Que peças o assunto comporta.
 *
 * Devolvia `['reel']` fixo, resíduo da fase em que saía um vídeo por dia. Como
 * o Estúdio monta as caixinhas a partir deste array, sobrou uma opção só — e
 * era justamente o formato que saiu da produção. O João viu: "no editorial não
 * tem mais os carrosséis?".
 *
 * Carrossel só no eclipse: são treze slides com um texto por ascendente, e é a
 * única peça que sustenta isso. Ingresso e lunação dão post e story. Educativo,
 * grau crítico e Lua fora de curso dão post — não sustentam story próprio nem
 * doze slides.
 *
 * O vídeo não aparece: saiu do automático enquanto o template é refeito.
 */
export function formatosDoAssunto(ev) {
  if (ev?.tipo === 'eclipse') return ['post', 'carrossel', 'story']
  if (ev?.tipo === 'fase') return ['post', 'story']
  if (ev?.tipo === 'ingresso' && CORPOS_DE_PESO.includes(ev.corpo)) return ['post', 'story']
  return ['post']
}

/** Quantos educativos oferecer por dia, além do que o céu já dá. */
const EDUCATIVOS_POR_DIA = 3

/**
 * As opções de um dia, em ordem de peso.
 *
 * O aspecto fica de fora: por regra ele nunca encabeça uma peça — fica exato por
 * semanas e sai repetido — então oferecê-lo como assunto seria oferecer algo que
 * o gerador recusaria.
 *
 * @param {Date} data
 * @param {object} deps `{ catalogos, orbes }`
 * @returns {{id, tipo, titulo, angulo, formatos, evento}[]}
 */
export function opcoesDoDia(data, { catalogos, orbes }) {
  const mapa = mapaDoCeu(data, orbes)
  const opcoes = []

  for (const ev of eventosDoDia(data, mapa.aspectos)) {
    if (ev.tipo === 'aspecto') continue
    const v = escrever(ev)
    const vespera = rotuloDeVespera(ev)
    opcoes.push({
      id: idDoAssunto(ev),
      tipo: ev.tipo,
      titulo: vespera ? `${vespera}: ${v.titulo}` : v.titulo,
      angulo: anguloDoAssunto(ev),
      formatos: formatosDoAssunto(ev),
      evento: ev,
    })
  }

  // Estados e posições que não são "evento" mas são assunto. Rodam num ritmo
  // diferente do céu de eventos: a retrogradação dura semanas e é a pergunta
  // mais feita do nicho; o grau crítico troca toda semana; o eixo dos nódulos
  // fica dezoito meses, mas quase ninguém explica.
  const extras = [
    ...retrogradacoesVigentes(data),
    ...grausCriticos(data),
  ]

  const nodulos = eixoDosNodulos(data)
  if (nodulos) {
    // o texto do catálogo vem por signo do Nódulo Norte, e estava parado no app
    const chave = `natal:nn_sign_${SIGNO_EN[nodulos.norte.signo] || ''}`
    const texto = catalogos.noduloPorSigno?.[chave] || ''
    // Metade dos doze textos de nódulo fala com quem lê. Sem assunto é melhor
    // que com assunto errado: o eixo simplesmente não entra nesses signos.
    if (texto && !falaComQuemLe(texto)) {
      extras.push({ ...nodulos, texto, corpoPt: 'Nódulo Norte' })
    }
  }

  for (const ev of extras) {
    const v = escrever(ev)
    opcoes.push({
      id: idDoAssunto(ev),
      tipo: ev.tipo,
      titulo: v.titulo,
      angulo: anguloDoAssunto(ev),
      formatos: formatosDoAssunto(ev),
      evento: ev,
    })
  }

  // Os educativos são pedidos em sequência, cada um marcando o anterior como
  // usado — é assim que saem três assuntos distintos em vez do mesmo três vezes.
  const usadas = new Set()
  const ingressos = ingressosProximos(data, 40)
  for (let i = 0; i < EDUCATIVOS_POR_DIA; i++) {
    const tema = temaEducativo(mapa, catalogos, usadas, { ingressos, data })
    if (!tema || tema.repetido) break
    usadas.add(tema.chave)
    const ev = { ...tema, tipo: 'educativo' }
    opcoes.push({
      id: idDoAssunto(ev),
      tipo: 'educativo',
      titulo: tema.titulo,
      angulo: anguloDoAssunto(ev),
      formatos: formatosDoAssunto(ev),
      evento: ev,
    })
  }

  return opcoes
}

/** Acha a opção que a pauta escolheu. `null` quando o id não existe mais. */
export function acharOpcao(opcoes, id) {
  if (!id) return null
  return opcoes.find((o) => o.id === id) || null
}
