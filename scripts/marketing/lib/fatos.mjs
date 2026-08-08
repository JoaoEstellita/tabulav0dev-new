/**
 * O fato que faz alguém parar de rolar.
 *
 * O João olhou o material e disse que estava quase desistindo: "as informações
 * são genéricas demais". Estava certo — o texto explicava o que É um eclipse,
 * que é a mesma frase para qualquer eclipse de qualquer ano. Isso não é
 * informação, é verbete.
 *
 * Aqui ficam os dados que são deste dia e de nenhum outro. Tudo sai de
 * efeméride: se o código não calcula, não entra. A tentação de escrever "a faixa
 * de totalidade passa pela Islândia" é grande e é exatamente o erro que a conta
 * existe para não cometer — as contas grandes chutam esse tipo de coisa, e é o
 * que nos separa delas.
 *
 * Cada função devolve `null` quando não tem o que dizer. Silêncio é melhor que
 * frase de encher.
 */
import * as A from 'astronomy-engine'

import { entradaNoSigno, velocidade, estacoesProximas } from './eventos.mjs'
import { posicaoEmSigno } from './ceu.mjs'

/** Quanto cada corpo costuma levar em um signo, em dias. */
const DIAS_NO_SIGNO = {
  Sun: 30.4, Moon: 2.5, Mercury: 21, Venus: 30, Mars: 45,
  Jupiter: 361, Saturn: 885, Uranus: 2557, Neptune: 5113, Pluto: 7000,
}

/** Graus por dia na média, para dizer se hoje está rápido ou devagar. */
const GRAUS_POR_DIA = {
  Sun: 0.99, Moon: 13.18, Mercury: 1.38, Venus: 1.2, Mars: 0.52,
  Jupiter: 0.083, Saturn: 0.033, Uranus: 0.012, Neptune: 0.006, Pluto: 0.004,
}

const CORPOS = {
  Sun: A.Body.Sun, Moon: A.Body.Moon, Mercury: A.Body.Mercury,
  Venus: A.Body.Venus, Mars: A.Body.Mars, Jupiter: A.Body.Jupiter,
  Saturn: A.Body.Saturn, Uranus: A.Body.Uranus, Neptune: A.Body.Neptune,
  Pluto: A.Body.Pluto,
}

const dias = (ms) => Math.round(ms / 86_400_000)

/** "cinco semanas", "dois meses e meio" — como se fala, não como se calcula. */
export function emPalavras(qtdDias) {
  const d = Math.round(qtdDias)
  if (d <= 1) return 'um dia'
  if (d < 14) return `${d} dias`
  if (d < 60) {
    const semanas = Math.round(d / 7)
    return `${porExtenso(semanas)} semanas`
  }
  const meses = d / 30.4
  const inteiro = Math.floor(meses)
  const resto = meses - inteiro
  if (resto > 0.3 && resto < 0.7) return `${porExtenso(inteiro)} meses e meio`
  return `${porExtenso(Math.round(meses))} meses`
}

const NUMEROS = ['zero', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete',
  'oito', 'nove', 'dez', 'onze', 'doze']
const porExtenso = (n) => NUMEROS[n] || String(n)

/**
 * Há quanto tempo o corpo está neste signo, e se isso é fora do normal.
 *
 * O caso interessante é quando passa do esperado, e o motivo é sempre o mesmo:
 * retrogradou dentro do signo e refez o caminho. Em agosto de 2026, Mercúrio
 * ficou dez semanas em Câncer contra as três de costume.
 */
export function tempoNoSigno(corpo, data) {
  // A Lua troca de signo a cada dois dias e meio, e a busca para trás — feita
  // para pegar retrogradação de planeta — atravessa dezenas de trocas dela e
  // volta uma data sem sentido. Saiu "a Lua ficou quatro semanas no mesmo
  // signo", que é impossível.
  if (corpo === 'Moon') return null

  const desde = entradaNoSigno(corpo, data)
  if (!desde) return null

  const quantos = dias(data - desde)
  const media = DIAS_NO_SIGNO[corpo]
  if (!media || quantos < 1) return null

  return {
    desde,
    dias: quantos,
    texto: emPalavras(quantos),
    media: emPalavras(media),
    // 40% acima da média já é uma diferença que se nota ao contar as semanas
    esticado: quantos > media * 1.4,
  }
}

/**
 * Velocidade de hoje contra a de costume.
 *
 * Perto da estação o planeta quase para — décimos de grau por dia contra mais de
 * um. Depois dela, dispara. É o que explica por que "o mesmo trânsito" às vezes
 * passa voando e às vezes se arrasta.
 */
export function ritmo(corpo, data) {
  const v = velocidade(corpo, data)
  const media = GRAUS_POR_DIA[corpo]
  if (!media) return null

  const razao = Math.abs(v) / media
  return {
    grausPorDia: Number(v.toFixed(2)),
    media,
    razao: Number(razao.toFixed(2)),
    retrogrado: v < 0,
    // as faixas são largas de propósito: variação de 10% não é notícia
    como: v < 0 ? 'para trás' : razao > 1.35 ? 'acelerado' : razao < 0.6 ? 'quase parado' : 'no passo de sempre',
  }
}

/**
 * Quantos dias faltam para o corpo parar e mudar de direção.
 *
 * Existe para não afirmar o que não se sabe: "está devagar, é assim pouco antes
 * de mudar de direção" só vale se a estação ESTIVER perto. Vênus a 0,65° por dia
 * pode estar simplesmente do outro lado do Sol.
 *
 * @returns {number|null} dias até a estação, ou null se não houver em 40 dias
 */
export function estacaoProxima(corpo, data) {
  for (const e of estacoesProximas(data, 40)) {
    if (e.corpo !== corpo) continue
    const d = Math.round((e.quando - data) / 86_400_000)
    if (d >= 0) return d
  }
  return null
}

/**
 * A Lua de hoje: quanto está iluminada e quão perto está.
 *
 * A distância varia 12% ao longo do mês, e a "superlua" que a imprensa anuncia é
 * exatamente isto — Lua cheia perto do perigeu. Dá para dizer sem chutar.
 */
export function luaDeHoje(data) {
  const il = A.Illumination(A.Body.Moon, data)
  const vetor = A.GeoVector(A.Body.Moon, data, false)
  const km = Math.round(Math.hypot(vetor.x, vetor.y, vetor.z) * 149_597_870.7)

  const PERIGEU = 363_300
  const APOGEU = 405_500
  const posicao = (km - PERIGEU) / (APOGEU - PERIGEU)

  return {
    iluminacao: Math.round(il.phase_fraction * 100),
    km,
    perto: posicao < 0.2,
    longe: posicao > 0.8,
  }
}

/**
 * Os quatro signos que recebem ângulo exato, com a faixa de grau.
 *
 * O recurso do "3 signos" é o que faz alguém parar para ver se é ele — e quem
 * usa normalmente chuta. Aqui é geometria: o signo, os dois em quadratura e o
 * oposto, e a faixa é a orbe de 2° em torno do grau do evento.
 */
export function quemRecebe(signo, grau) {
  const ORDEM = ['Áries', 'Touro', 'Gêmeos', 'Câncer', 'Leão', 'Virgem',
    'Libra', 'Escorpião', 'Sagitário', 'Capricórnio', 'Aquário', 'Peixes']
  const i = ORDEM.indexOf(signo)
  if (i < 0 || typeof grau !== 'number') return null

  const nome = (n) => ORDEM[((n % 12) + 12) % 12]
  return {
    signos: [signo, nome(i + 3), nome(i + 6), nome(i + 9)],
    de: Math.max(0, grau - 2),
    ate: Math.min(29, grau + 2),
    grau,
  }
}

/**
 * Em que casa o evento cai, para cada ascendente.
 *
 * Em casas inteiras a conta é aritmética e exata — a mesma de
 * `src/astro/houses.math.ts:83`. É o formato que gera salvamento: a pessoa
 * precisa voltar para conferir o próprio.
 */
export function casasPorAscendente(signoDoEvento) {
  const ORDEM = ['Áries', 'Touro', 'Gêmeos', 'Câncer', 'Leão', 'Virgem',
    'Libra', 'Escorpião', 'Sagitário', 'Capricórnio', 'Aquário', 'Peixes']
  const iEvento = ORDEM.indexOf(signoDoEvento)
  if (iEvento < 0) return null
  return ORDEM.map((asc, iAsc) => ({ ascendente: asc, casa: ((iEvento - iAsc + 12) % 12) + 1 }))
}

/**
 * Onde o corpo estava ao nascer do dia e onde estará ao fim.
 *
 * O vídeo passou a mostrar só o próprio dia, e este é o número que diz o que se
 * vê nele: a Lua anda 13°, quase meio signo; Mercúrio, pouco mais de um grau.
 */
export function percursoDoDia(corpo, data) {
  const body = CORPOS[corpo]
  if (!body) return null

  const inicio = new Date(Date.UTC(data.getUTCFullYear(), data.getUTCMonth(), data.getUTCDate(), 3))
  const fim = new Date(inicio.getTime() + 86_400_000)
  const lon = (t) => {
    const e = A.Ecliptic(A.GeoVector(body, t, false))
    return ((e.elon % 360) + 360) % 360
  }

  const a = lon(inicio)
  const b = lon(fim)
  let d = b - a
  if (d > 180) d -= 360
  if (d < -180) d += 360

  return {
    graus: Number(Math.abs(d).toFixed(2)),
    de: posicaoEmSigno(a),
    ate: posicaoEmSigno(b),
    trocaDeSigno: posicaoEmSigno(a).signo !== posicaoEmSigno(b).signo,
  }
}
