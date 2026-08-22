/**
 * O carrossel ANCORADO no céu do dia.
 *
 * ── POR QUE ─────────────────────────────────────────────────────────────────
 *
 * Os temas v4 (`temasCarrosselV4.mjs`) são evergreen: "o que é aspecto", "o que
 * são casas". Bons para autoridade, mas sem urgência. O ancorado fala do que
 * está acontecendo AGORA, calculado — "Hoje o Sol entra em Virgem" — no registro
 * do @astrologialuzesombra que o João trouxe: âncora real + personificação +
 * ponte para o mapa. É o nosso diferencial (só quem calcula pode ancorar).
 *
 * ── COMO EVITA O GENÉRICO ───────────────────────────────────────────────────
 *
 * O corpo NÃO é montado por molde ("hoje {x} faz {y}"), que sairia genérico. É
 * curado por COMBINAÇÃO (Sol+Virgem, Marte+Câncer) e reutilizável — Sol em
 * Virgem sai todo agosto. O que a máquina injeta é a âncora (data + evento +
 * diagrama real) e a ponte para o mapa; o texto denso é do editor.
 */
import { diagramaIngresso, diagramaFase } from './diagramaFato.mjs'
import { eventosDoDia } from './eventos.mjs'
import { mapaDoCeu } from './ceu.mjs'

const NOME_CORPO = {
  Sun: 'Sol', Moon: 'Lua', Mercury: 'Mercúrio', Venus: 'Vênus', Mars: 'Marte',
  Jupiter: 'Júpiter', Saturn: 'Saturno', Uranus: 'Urano', Neptune: 'Netuno', Pluto: 'Plutão',
}
const ORDEM = ['Áries', 'Touro', 'Gêmeos', 'Câncer', 'Leão', 'Virgem',
  'Libra', 'Escorpião', 'Sagitário', 'Capricórnio', 'Aquário', 'Peixes']
const signoAnterior = (s) => { const i = ORDEM.indexOf(s); return ORDEM[(i + 11) % 12] || ORDEM[11] }
// artigo antes do nome do corpo ("o Sol", "a Lua", "Mercúrio")
const ARTIGO = { Sun: 'o ', Moon: 'a ', Mercury: '', Venus: '', Mars: '', Jupiter: '', Saturn: '', Uranus: '', Neptune: '', Pluto: '' }

/**
 * O banco curado por combinação. Cada entrada = a linha da capa + os três
 * slides de corpo (personificação → insight → aplicação) + a legenda. Cresce um
 * a um, escrito e aprovado, como os textos de trânsito.
 */
export const TEXTOS_ANCORADOS = {
  'ingresso:Sun:Virgem': {
    capa: 'Por um mês, o nosso brilho troca de casa — e passa a vir do cuidado com as pequenas coisas.',
    slides: [
      { olho: 'O encontro', titulo: 'O brilho encontra o *cuidado*.',
        corpo: 'O Sol é a nossa vitalidade, o que faz a gente querer aparecer. Virgem é o signo que serve, que repara no detalhe, que faz bem-feito. Juntos, o brilho passa a vir não do palco, mas do capricho.' },
      { olho: 'O mal-entendido', titulo: 'Virgem não cobra *perfeição*.',
        corpo: 'O maior engano sobre Virgem é confundir com obsessão por perfeição. É outra coisa: é cuidado. É reparar no que ninguém vê e consertar com carinho. Cuidar dos detalhes é uma forma silenciosa de amor.' },
      { olho: 'Por um mês', titulo: 'O brilho vem de *fazer bem*.',
        corpo: 'Nas próximas quatro semanas, o que enche a alma não é o holofote — é o trabalho bem-feito, a rotina que flui, o corpo cuidado. Bom tempo para arrumar a casa por dentro.' },
    ],
    legenda:
      'Hoje o Sol entra em Virgem, e por um mês o nosso brilho troca de casa: passa a vir do cuidado com as pequenas coisas.\n\n' +
      'O Sol é a vitalidade, o que faz a gente querer aparecer. Virgem é o signo que serve, que repara no detalhe. Juntos, o brilho vem não do palco, mas do capricho.\n\n' +
      'E Virgem não é perfeccionismo — é cuidado. É reparar no que ninguém vê e consertar com carinho. Nas próximas quatro semanas, o que enche a alma é o trabalho bem-feito, a rotina que flui, o corpo cuidado.\n\n' +
      'Todos temos Virgem no mapa. No app, veja em qual área da vida o Sol vai iluminar no seu — calculado do seu nascimento. Link na bio.',
  },
}

/** A chave da combinação deste evento, se for um tipo ancorável. */
export function chaveAncorada(ev) {
  if (ev?.tipo === 'ingresso' && ev.corpo) return `ingresso:${ev.corpo}:${ev.signo}`
  if (ev?.tipo === 'fase' && ev.fase) return `fase:${ev.fase}:${ev.signo}`
  return null
}

/**
 * O evento do dia que TEM texto ancorado no banco. `null` quando o céu do dia
 * não casa com nada curado (aí o dia usa um tema evergreen ou uma peça normal).
 */
export function eventoAncoravel(data) {
  const m = mapaDoCeu(data, {})
  for (const ev of eventosDoDia(data, m.aspectos, { antecedencia: 0 })) {
    const chave = chaveAncorada(ev)
    if (chave && TEXTOS_ANCORADOS[chave]) return { ev, chave }
  }
  return null
}

/** Os slides do carrossel ancorado, prontos para `montarSlideCard`. */
export function slidesAncorados(ev, chave, iso) {
  const t = TEXTOS_ANCORADOS[chave]
  if (!t) return null

  const dataRotulo = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long', timeZone: 'UTC' })
    .format(new Date(`${iso}T12:00:00Z`))

  const ingresso = ev.tipo === 'ingresso'
  const figura = ingresso
    ? diagramaIngresso({ corpo: ev.corpo, signo: ev.signo, signoAnterior: signoAnterior(ev.signo) })
    : diagramaFase({ fase: ev.fase, luminar: 'Moon' })
  const cena = ingresso ? 'ingresso' : 'fase'

  const nome = NOME_CORPO[ev.corpo] || ev.corpo || 'a Lua'
  const capaTitulo = ingresso
    ? `Hoje ${ARTIGO[ev.corpo] || ''}${nome} entra em *${ev.signo}*.`
    : `Hoje a Lua está em *${ev.fase}*.`
  const acao = ingresso ? `${ARTIGO[ev.corpo] || ''}${nome} vai agir` : 'a Lua vai tocar'

  const slides = [
    { tipo: 'capa', olho: `Céu de hoje · ${dataRotulo}`, titulo: capaTitulo, corpo: t.capa },
    ...t.slides.map((s) => ({ tipo: 'texto', ...s, figura })),
    {
      tipo: 'cta', olho: 'Tábula Estelar',
      titulo: 'Em que *casa* isso cai pra você?',
      corpo: `Todos temos ${ev.signo} no mapa. No app, veja em qual área ${acao} no seu — calculado do seu nascimento.`,
      cta: 'Veja no seu mapa · link na bio',
    },
  ]
  const total = slides.length
  return {
    cena,
    legenda: t.legenda,
    slides: slides.map((s, i) => ({ ...s, n: i + 1, total })),
  }
}
