/**
 * A peça dos dias em que o céu não é notícia.
 *
 * Em 60 dias a partir de 06/08/2026, treze não têm evento forte — dez só com a
 * Lua fora de curso, três sem nada — e vêm em blocos de três e quatro seguidos.
 * Pior: um período de Lua fora de curso dura 42h e atravessa três dias, então
 * 13, 14 e 15 de agosto puxavam título, janela e texto IDÊNTICOS.
 *
 * A saída não é inventar evento. É trocar de assunto: em vez de anunciar o que
 * não aconteceu, explicar o que as posições significam num mapa natal. O corpus
 * para isso já existe e nunca saiu do app — 369 textos curados em terceira
 * pessoa, com ~340 caracteres cada:
 *
 *   planetInSignOverridesPtBR      120   natal:{planeta}_in_{signo}
 *   natalPlanetAspectOverridesPtBR 225   natal:{p1}|{aspecto}|{p2}
 *   chironInHouseOverridesPtBR      12   (fora: depende da casa, e casa exige mapa)
 *   signInHouseOverridesPtBR       144   (fora: fala "você")
 *
 * REGRA QUE NÃO SE NEGOCIA
 * ------------------------
 * O texto descreve uma posição NATAL. O céu de hoje só decide qual assunto
 * entra — nunca vira previsão sobre o dia. A peça precisa dizer isso na cara,
 * e é o que separa a conta de um horóscopo: trânsito e mapa natal são coisas
 * diferentes, e essa é a tese da campanha inteira.
 */
import { SIGNOS_INFO, NOMES_PT, ASPECTOS } from './ceu.mjs'

/** Os catálogos usam o nome do signo em inglês, minúsculo. */
const SIGNO_EN = {
  'Áries': 'aries', 'Touro': 'taurus', 'Gêmeos': 'gemini', 'Câncer': 'cancer',
  'Leão': 'leo', 'Virgem': 'virgo', 'Libra': 'libra', 'Escorpião': 'scorpio',
  'Sagitário': 'sagittarius', 'Capricórnio': 'capricorn', 'Aquário': 'aquarius',
  'Peixes': 'pisces',
}

/**
 * A chave de aspecto natal segue a ordem tradicional dos corpos, não a
 * alfabética: existe `natal:venus|quadratura|mars` e não o inverso. Procurar na
 * ordem errada devolve `undefined` sem erro nenhum, e a peça sairia sem texto.
 */
const ORDEM_TRADICIONAL = [
  'sun', 'moon', 'mercury', 'venus', 'mars',
  'jupiter', 'saturn', 'uranus', 'neptune', 'pluto',
]

function chaveAspectoNatal(a, b, aspecto) {
  const [p1, p2] = [a.toLowerCase(), b.toLowerCase()].sort(
    (x, y) => ORDEM_TRADICIONAL.indexOf(x) - ORDEM_TRADICIONAL.indexOf(y)
  )
  return `natal:${p1}|${aspecto}|${p2}`
}

/**
 * A Lua troca de signo a cada dois dias e meio: "Lua em Gêmeos num mapa" seria
 * assunto de terça e de sexta. Os lentos ficam de fora por outro motivo —
 * Netuno passa catorze anos num signo, e a peça voltaria todo mês igual.
 */
const PLANETAS_DE_SIGNO = ['Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn']

/**
 * Aspecto entre dois lentos é geracional, e não serve como leitura de mapa.
 *
 * Plutão sextil Netuno fica de pé por ANOS: descreve todo mundo nascido numa
 * década inteira, e apresentar isso como característica de alguém é o mesmo
 * vício do horóscopo por signo solar que a conta existe para contradizer. Exigir
 * ao menos um corpo pessoal no par resolve — sem ele, o texto não fala de
 * ninguém em particular.
 */
const CORPOS_PESSOAIS = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars']

const ROTULO_ASPECTO = Object.fromEntries(ASPECTOS.map((a) => [a.chave, a.rotulo]))

/**
 * Sol e Lua pedem artigo em português; os demais planetas, não.
 *
 * "Hoje Sol apenas passa por ali" é o tipo de erro que denuncia texto gerado.
 * Marte, Vênus e os outros são nomes próprios e dispensam o artigo.
 */
const ARTIGO = { Sol: 'o ', Lua: 'a ' }
const comArtigo = (nome, maiuscula = false) => {
  const art = ARTIGO[nome] || ''
  return (maiuscula && art ? art[0].toUpperCase() + art.slice(1) : art) + nome
}

/**
 * Escolhe o assunto do dia entre os candidatos ancorados no céu de agora.
 *
 * @param {object} mapa saída de `mapaDoCeu` — corpos e aspectos vigentes
 * @param {object} catalogos `{ planetaNoSigno, aspectoNatal }`
 * @param {Set<string>} usadas chaves publicadas na janela recente
 * @returns {object|null}
 */
export function temaEducativo(mapa, catalogos, usadas = new Set()) {
  const candidatos = []

  // 1. Planeta no signo em que ele REALMENTE está hoje.
  for (const corpo of mapa.corpos) {
    if (!PLANETAS_DE_SIGNO.includes(corpo.nome)) continue
    const signoEn = SIGNO_EN[corpo.signo]
    if (!signoEn) continue
    const chave = `natal:${corpo.nome.toLowerCase()}_in_${signoEn}`
    const texto = catalogos.planetaNoSigno?.[chave]
    if (!texto) continue
    candidatos.push({
      tipo: 'planeta_no_signo',
      chave,
      texto,
      titulo: `${corpo.nomePt} em ${corpo.signo}`,
      // a âncora é o que torna a peça honesta: não foi sorteada
      ancora: `${comArtigo(corpo.nomePt, true)} está em ${corpo.signo} hoje, a ${corpo.grau}°.`,
      signo: corpo.signo,
      elemento: SIGNOS_INFO.find((s) => s.nome === corpo.signo)?.elemento || null,
      corpo: corpo.nome,
      corpoPt: corpo.nomePt,
      grau: corpo.grau,
      // Fonte preferida: "Vênus em Libra" é legível para qualquer pessoa,
      // enquanto "Vênus sextil Mercúrio" já pede vocabulário. O aspecto entra
      // quando os planetas em signo se esgotam na janela sem repetir.
      peso: 70,
    })
  }

  // 2. Aspecto que existe no céu agora, explicado como configuração natal.
  for (const a of mapa.aspectos) {
    if (!CORPOS_PESSOAIS.includes(a.agente) && !CORPOS_PESSOAIS.includes(a.alvo)) continue
    const chave = chaveAspectoNatal(a.agente, a.alvo, a.aspecto)
    const texto = catalogos.aspectoNatal?.[chave]
    if (!texto) continue
    candidatos.push({
      tipo: 'aspecto_natal',
      chave,
      texto,
      titulo: `${a.agentePt} ${ROTULO_ASPECTO[a.aspecto] || a.aspecto} ${a.alvoPt}`,
      ancora: `${comArtigo(a.agentePt, true)} e ${comArtigo(a.alvoPt)} estão nesse ângulo hoje, com ${a.orbeFormatado} de orbe.`,
      signo: a.agentePos?.signo || null,
      elemento: SIGNOS_INFO.find((s) => s.nome === a.agentePos?.signo)?.elemento || null,
      corpo: a.agente,
      corpoPt: a.agentePt,
      grau: a.agentePos?.grau ?? 0,
      // Abaixo do planeta em signo de propósito, e o orbe só desempata entre
      // aspectos: quanto mais exato, melhor o assunto.
      peso: 45 + (1 - Math.min(a.orbe, 6) / 6) * 15,
    })
  }

  const inéditos = candidatos.filter((c) => !usadas.has(c.chave))
  const pool = inéditos.length ? inéditos : candidatos
  if (!pool.length) return null

  pool.sort((x, y) => y.peso - x.peso)
  return { ...pool[0], tipo_peca: 'educativo', repetido: inéditos.length === 0 }
}

/**
 * A linha que impede a peça de virar previsão.
 *
 * Sem ela, "Vênus em Libra" com um texto sobre valores relacionais lê como
 * horóscopo do dia. Com ela, a peça ensina a diferença que a campanha vende.
 */
export function linhaDeHonestidade(tema) {
  if (tema.tipo === 'planeta_no_signo') {
    return `Descreve quem NASCEU com ${comArtigo(tema.corpoPt)} em ${tema.signo} — não o que hoje reserva.`
  }
  return 'Descreve quem NASCEU com esse ângulo — não o que hoje reserva.'
}

/**
 * A versão longa, para a legenda, onde há espaço.
 *
 * No card o aviso precisa caber em uma linha ou o rodapé sai do quadro; na
 * legenda cabe a explicação inteira, que é o que ensina a diferença.
 */
export function paragrafoDeHonestidade(tema) {
  if (tema.tipo === 'planeta_no_signo') {
    return `Atenção ao que isto é: descreve quem NASCEU com ${comArtigo(tema.corpoPt)} em ${tema.signo}. Hoje ${comArtigo(tema.corpoPt)} apenas passa por ali. Passar e ter nascido sob são coisas diferentes — a primeira dura dias, a segunda dura a vida.`
  }
  return 'Atenção ao que isto é: descreve quem NASCEU com esse ângulo entre os dois corpos. Hoje o ângulo existe no céu de todo mundo, e não é a mesma coisa que carregá-lo no mapa.'
}
