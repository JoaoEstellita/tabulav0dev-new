/**
 * O mês por signo e por ascendente.
 *
 * A referência que originou isto (@harmoniq.waves, 2.234 salvamentos num post)
 * escreve: *"Two eclipses — one in your sign. Your routines reset. Your identity
 * culminates."* A primeira frase é verdade astronômica. As duas seguintes
 * assumem que Peixes é a casa 1 de quem lê — é astrologia de signo solar, e é
 * exatamente o que esta conta existe para contradizer.
 *
 * A saída aqui é dupla, e nos deixa mais precisos que a referência:
 *
 *   1. Por SIGNO, no condicional. "Se o seu Sol, Lua ou ascendente está aqui" —
 *      não afirma nada sobre a vida de ninguém, e ainda dá o gancho de
 *      identificação que faz alguém parar.
 *
 *   2. Por ASCENDENTE, com número exato. Em casas inteiras a casa é aritmética:
 *      `((signo do evento − signo do ascendente + 12) mod 12) + 1`. É a mesma
 *      conta de `src/astro/houses.math.ts:83`, então a peça bate com o app.
 *      Em Placidus as cúspides deslocam e isso deixaria de ser exato — por isso
 *      o sistema é DECLARADO na peça.
 */
import { SIGNOS_INFO } from './ceu.mjs'
import {
  pesoBase,
  eclipsesProximos,
  ingressosProximos,
  estacoesProximas,
  fasesDaLua,
} from './eventos.mjs'
import { escrever, eixoDoSigno } from './vozes.mjs'

/** A ordem dos signos é a ordem do zodíaco, e o índice é a conta das casas. */
export const ORDEM_SIGNOS = SIGNOS_INFO.map((s) => s.nome)

/**
 * Glifos com seletor de variação textual (U+FE0E).
 *
 * Sem ele, o Chrome escolhe a apresentação em emoji e ♓ sai como um quadrado
 * colorido no meio de um rótulo em bronze. O seletor força o desenho de fonte,
 * que é o que combina com a peça.
 */
const TEXTO = '︎'
export const GLIFO = {
  'Áries': `♈${TEXTO}`, 'Touro': `♉${TEXTO}`, 'Gêmeos': `♊${TEXTO}`, 'Câncer': `♋${TEXTO}`,
  'Leão': `♌${TEXTO}`, 'Virgem': `♍${TEXTO}`, 'Libra': `♎${TEXTO}`, 'Escorpião': `♏${TEXTO}`,
  'Sagitário': `♐${TEXTO}`, 'Capricórnio': `♑${TEXTO}`, 'Aquário': `♒${TEXTO}`, 'Peixes': `♓${TEXTO}`,
}

const MESES = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
]

export const nomeDoMes = (mes) => MESES[mes]

const diaDoMes = (data) =>
  new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit', month: '2-digit', timeZone: 'America/Sao_Paulo',
  }).format(data)

/**
 * Casa que um evento ocupa para quem tem o ascendente num signo.
 *
 * Casas inteiras: o signo do ascendente é a casa 1 inteira, o seguinte é a 2, e
 * assim por diante. Não depende de grau nem de latitude — por isso pode ser dita
 * numa peça pública sem o mapa de ninguém.
 */
export function casaPorAscendente(signoDoEvento, signoDoAscendente) {
  const iEvento = ORDEM_SIGNOS.indexOf(signoDoEvento)
  const iAsc = ORDEM_SIGNOS.indexOf(signoDoAscendente)
  if (iEvento < 0 || iAsc < 0) return null
  return ((iEvento - iAsc + 12) % 12) + 1
}

/**
 * Eventos fortes de um mês, sem a lunação que o eclipse já contém.
 *
 * @param {number} ano
 * @param {number} mes 0 a 11, como o Date
 */
export function eventosDoMes(ano, mes) {
  const inicio = new Date(Date.UTC(ano, mes, 1))
  const fim = new Date(Date.UTC(ano, mes + 1, 1))
  const dias = Math.round((fim - inicio) / 86_400_000)

  const brutos = [
    ...eclipsesProximos(inicio, dias),
    ...ingressosProximos(inicio, dias),
    ...estacoesProximas(inicio, dias),
    // seis quartos cobrem qualquer mês com folga
    ...fasesDaLua(inicio, 6),
  ].filter((e) => e.quando >= inicio && e.quando < fim)

  // Todo eclipse É uma lunação: sem isto o dia apareceria duas vezes na conta,
  // e "dois eclipses em agosto" viraria "quatro eventos".
  const diasComEclipse = new Set(
    brutos.filter((e) => e.tipo === 'eclipse').map((e) => e.quando.toISOString().slice(0, 10))
  )

  return brutos
    .filter((e) => !(e.tipo === 'fase' && diasComEclipse.has(e.quando.toISOString().slice(0, 10))))
    .sort((a, b) => a.quando - b.quando)
}

/**
 * Eventos fortes de uma semana, da segunda ao domingo.
 *
 * Mesma regra do mês, janela menor: o carrossel dos doze signos passou a ser
 * semanal, porque um mês inteiro num slide vira lista e ninguém guarda sete
 * datas. Numa semana costumam caber de um a três eventos, que é o que se lê.
 *
 * @param {Date} inicio qualquer dia da semana desejada
 */
export function eventosDaSemana(inicio) {
  // Recua até a segunda-feira, ancorando em 03:00 UTC — meia-noite de Brasília.
  // Sem o fuso, a janela começava às 21h de domingo daqui, e a capa anunciava
  // "9 de agosto a 15" para a semana que começa no dia 10.
  const segunda = new Date(Date.UTC(
    inicio.getUTCFullYear(), inicio.getUTCMonth(), inicio.getUTCDate(), 3
  ))
  const diaDaSemana = (segunda.getUTCDay() + 6) % 7
  segunda.setUTCDate(segunda.getUTCDate() - diaDaSemana)
  const fim = new Date(segunda.getTime() + 7 * 86_400_000)

  const brutos = [
    ...eclipsesProximos(segunda, 8),
    ...ingressosProximos(segunda, 8),
    ...estacoesProximas(segunda, 8),
    ...fasesDaLua(segunda, 3),
  ].filter((e) => e.quando >= segunda && e.quando < fim)

  const diasComEclipse = new Set(
    brutos.filter((e) => e.tipo === 'eclipse').map((e) => e.quando.toISOString().slice(0, 10))
  )

  /**
   * O peso precisa vir junto, e por isso esta linha existe.
   *
   * Sem ele, `semanaPorSigno` ordenava por `(b.peso||0) - (a.peso||0)`, dava
   * empate em zero e caía na ordem cronológica. Na semana de 10/08 isso elegeu
   * o ingresso de Marte (dia 11) como assunto, em vez do eclipse (dia 12) — e o
   * slide saiu falando de Marte no corpo e do eclipse no destaque, que foi o que
   * o João viu: "fala do eclipse e o texto fala de marte, não faz sentido".
   *
   * `eventosDoDia` sempre aplicou `pesoBase`; a janela semanal, não.
   */
  return {
    inicio: segunda,
    fim,
    eventos: brutos
      .filter((e) => !(e.tipo === 'fase' && diasComEclipse.has(e.quando.toISOString().slice(0, 10))))
      .map((e) => ({ ...e, peso: e.peso ?? pesoBase(e) }))
      .sort((a, b) => (b.peso - a.peso) || (a.quando - b.quando)),
  }
}

/**
 * O que o mês faz com cada signo.
 *
 * `noSigno` são os eventos que caem no próprio signo; `noEixo`, os que caem na
 * cruz da modalidade — conjunção, as duas quadraturas e a oposição. Fora do
 * eixo, o ângulo é menor e não sustenta uma peça.
 */
export function mesPorSigno(eventos, signo) {
  const eixo = eixoDoSigno(signo)
  if (!eixo) return null

  const noSigno = eventos.filter((e) => e.signo === signo)
  const noEixo = eventos.filter((e) => e.signo && eixo.todos.includes(e.signo))
  const eclipses = eventos.filter((e) => e.tipo === 'eclipse')
  const eclipsesNoEixo = eclipses.filter((e) => eixo.todos.includes(e.signo))

  return { signo, eixo, noSigno, noEixo, eclipses, eclipsesNoEixo }
}

const plural = (n, um, muitos) => (n === 1 ? um : muitos)

/**
 * A abertura do slide: quantos eclipses o mês tem e se algum toca este eixo.
 *
 * O eclipse abre porque é o único evento que a imprensa não astrológica também
 * noticia — quem vê já ouviu falar. Quando não há eclipse no eixo, a abertura é
 * o evento mais próximo do próprio signo.
 */
export function aberturaDoSigno(resumo, totalEclipses) {
  const linhas = []

  if (totalEclipses > 0) {
    linhas.push(
      `${totalEclipses === 1 ? 'Um eclipse' : `${totalEclipses === 2 ? 'Dois' : totalEclipses} eclipses`} no mês.`
    )
  }

  const noProprio = resumo.eclipses.filter((e) => e.signo === resumo.signo)
  if (noProprio.length) {
    const e = noProprio[0]
    // "Dois eclipses no mês. Ele em Peixes" — a retomada concorda com o TOTAL
    // que a frase anterior anunciou, não com quantos caem neste signo.
    const retomada = totalEclipses > 1 ? 'Um deles' : 'Ele'
    linhas.push(`${retomada} em ${resumo.signo} — ${diaDoMes(e.quando)}, ${e.grau}°.`)
  } else if (resumo.eclipsesNoEixo.length) {
    const e = resumo.eclipsesNoEixo[0]
    linhas.push(`Um deles no seu eixo, em ${e.signo} — ${diaDoMes(e.quando)}.`)
  } else if (resumo.noSigno.length) {
    const e = resumo.noSigno[0]
    linhas.push(`${escrever(e).titulo} — ${diaDoMes(e.quando)}.`)
  } else if (resumo.noEixo.length) {
    const e = resumo.noEixo[0]
    linhas.push(`No eixo: ${escrever(e).titulo} — ${diaDoMes(e.quando)}.`)
  }

  return linhas.join(' ')
}

/**
 * As datas do mês para este eixo, em lista curta.
 *
 * Três é o teto: a peça é para consulta rápida, e uma lista de sete datas não se
 * lê num story.
 */
export function datasDoSigno(resumo, limite = 3) {
  return resumo.noEixo.slice(0, limite).map((e) => ({
    quando: diaDoMes(e.quando),
    titulo: escrever(e).titulo,
    signo: e.signo,
  }))
}

/**
 * A linha do ascendente — a que a referência não consegue fazer sem chutar.
 */
export function linhaDoAscendente(resumo) {
  const alvo = resumo.eclipses.find((e) => resumo.eixo.todos.includes(e.signo)) || resumo.noEixo[0]
  if (!alvo) return null

  const casa = casaPorAscendente(alvo.signo, resumo.signo)
  if (!casa) return null

  return {
    casa,
    texto: `${escrever(alvo).titulo}, em ${diaDoMes(alvo.quando)}, cai na sua casa ${casa}.`,
  }
}
