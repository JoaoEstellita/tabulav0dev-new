/**
 * Eventos do céu: o que MUDA num dia, não o que está igual há semanas.
 *
 * O card escolhia o aspecto mais exato do dia, e aspecto de planeta lento dura
 * semanas: "Saturno trígono Sol" era a mesma notícia por doze dias seguidos.
 * Enquanto isso, Vênus entrando em Libra ou Mercúrio ficando retrógrado passavam
 * despercebidos, e são exatamente os eventos que o público reconhece.
 *
 * Tudo sai do `astronomy-engine` que o app já usa. Nenhuma dependência nova.
 */
import * as A from 'astronomy-engine'
import { SIGNOS_INFO, NOMES_PT, posicaoEmSigno } from './ceu.mjs'

const CORPOS = {
  Sun: A.Body.Sun, Moon: A.Body.Moon, Mercury: A.Body.Mercury,
  Venus: A.Body.Venus, Mars: A.Body.Mars, Jupiter: A.Body.Jupiter,
  Saturn: A.Body.Saturn, Uranus: A.Body.Uranus, Neptune: A.Body.Neptune,
  Pluto: A.Body.Pluto,
}

/** A Lua troca de signo a cada 2 dias e meio: viraria a notícia de todo dia. */
const INGRESSO_RELEVANTE = [
  'Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto',
]

/** Sol e Lua nunca retrogradam vistos da Terra. */
const PODE_RETROGRADAR = [
  'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto',
]

const FASES = ['Lua Nova', 'Quarto Crescente', 'Lua Cheia', 'Quarto Minguante']

function longitude(corpo, t) {
  const e = A.Ecliptic(A.GeoVector(corpo, t, false))
  return ((e.elon % 360) + 360) % 360
}

/** Diferença angular assinada, normalizada para [-180, 180]. */
function diferenca(a, b) {
  let d = a - b
  if (d > 180) d -= 360
  if (d < -180) d += 360
  return d
}

const mesmoDia = (a, b) => a.toISOString().slice(0, 10) === b.toISOString().slice(0, 10)

/**
 * Meia-noite UTC do dia pedido.
 *
 * Toda busca do astronomy-engine anda para a FRENTE a partir do instante dado.
 * Partindo do meio-dia, um evento da manhã já passou e some do próprio dia:
 * Marte entrou em Câncer às 08h23 de 11/08/2026 e o card daquele dia não o
 * mencionava. Ancorar no começo do dia é o que faz "hoje" significar o dia
 * inteiro.
 */
function inicioDoDia(data) {
  return new Date(Date.UTC(data.getUTCFullYear(), data.getUTCMonth(), data.getUTCDate()))
}

/**
 * O quarto parâmetro de `A.Search` é um objeto de opções, não um número.
 * Passar `1` — como estava — não vira tolerância de um segundo: vira
 * `options.dt_tolerance_seconds === undefined` e o padrão assume. Em função
 * íngreme como um ingresso isso passa despercebido; na velocidade de um planeta
 * lento perto da estação, onde a derivada vale 1e-5, o padrão não converge e a
 * busca devolve `null` sem erro.
 */
const TOLERANCIA = { dt_tolerance_seconds: 60 }

/**
 * Mudanças de signo na janela.
 *
 * A busca é pela raiz da distância até o próximo limite de 30°, que troca de
 * sinal exatamente no ingresso. Normalizar a diferença é o que faz isso
 * funcionar na virada de Peixes para Áries, onde a subtração crua daria 360.
 */
export function ingressosProximos(data, dias = 30) {
  const zero = inicioDoDia(data)
  const inicio = new A.AstroTime(zero)
  const fim = new A.AstroTime(new Date(zero.getTime() + dias * 86_400_000))
  const achados = []

  for (const nome of INGRESSO_RELEVANTE) {
    const corpo = CORPOS[nome]
    const atual = longitude(corpo, zero)
    const limite = ((Math.floor(atual / 30) + 1) * 30) % 360

    try {
      const t = A.Search(
        (quando) => diferenca(longitude(corpo, quando), limite),
        inicio,
        fim,
        TOLERANCIA
      )
      if (!t) continue
      achados.push({
        tipo: 'ingresso',
        corpo: nome,
        corpoPt: NOMES_PT[nome],
        signo: SIGNOS_INFO[(limite / 30) % 12].nome,
        elemento: SIGNOS_INFO[(limite / 30) % 12].elemento,
        // Um ingresso acontece exatamente no 0° do signo — explícito para que
        // quem consome não dependa de um valor padrão em outro arquivo.
        grau: 0,
        // De onde ele sai, e desde quando está lá. É o que permite a frase
        // condicional: sem o signo anterior não há o que a pessoa reconheça
        // ter vivido nas últimas semanas.
        signoAnterior: SIGNOS_INFO[((limite / 30) % 12 + 11) % 12].nome,
        desdeQuando: entradaNoSigno(nome, zero),
        quando: t.date,
        hoje: mesmoDia(t.date, data),
      })
    } catch {
      // corpo lento pode não cruzar limite nenhum na janela: não é erro
    }
  }

  return achados.sort((a, b) => a.quando - b.quando)
}

/**
 * Velocidade em longitude, por derivada numérica de doze horas.
 *
 * Base larga de propósito: para Urano a derivada de uma hora perto da estação
 * vale 2e-5 grau, na borda da precisão do próprio cálculo de posição. Doze horas
 * multiplicam o sinal por doze sem mover a raiz, que é o que a busca precisa.
 */
function velocidade(corpo, t) {
  const meia = 6 * 3_600_000
  const antes = new Date(t.getTime() - meia)
  const depois = new Date(t.getTime() + meia)
  return diferenca(longitude(corpo, depois), longitude(corpo, antes))
}

/**
 * Quando o corpo entrou no signo em que está.
 *
 * A peça precisa disso para dizer "Mercúrio sai de Câncer, onde estava desde
 * 26/07" — a frase que dá tamanho ao ciclo. Sem ela o texto fala de uma troca
 * sem dizer de onde se está saindo, que é metade da informação.
 *
 * A busca é para TRÁS a partir do limite inferior do signo atual, em 120 dias.
 *
 * Sessenta pareciam bastar e não bastavam: retrogradação estica a permanência
 * muito além do normal. Em 07/08/2026 Mercúrio estava em Câncer havia mais de
 * dois meses, porque retrogradou dentro do signo — e esse é justamente o caso
 * mais interessante de contar. Acima de 120 dias só sobram os lentos, onde a
 * frase não faria sentido.
 *
 * @returns {Date|null}
 */
export function entradaNoSigno(nome, data) {
  const corpo = CORPOS[nome]
  if (!corpo) return null

  const atual = longitude(corpo, data)
  const limite = Math.floor(atual / 30) * 30

  try {
    const t = A.Search(
      (quando) => diferenca(longitude(corpo, quando), limite),
      new A.AstroTime(new Date(data.getTime() - 120 * 86_400_000)),
      new A.AstroTime(data),
      TOLERANCIA
    )
    return t ? t.date : null
  } catch {
    // corpo lento que não cruzou limite nenhum em sessenta dias: não é erro
    return null
  }
}

/**
 * Início e fim de retrogradação na janela.
 *
 * A varredura diária só BRACKETA o evento; a data sai de uma busca de raiz na
 * velocidade dentro do par de dias encontrado. O passo diário sozinho erra em
 * até um dia nos planetas lentos, porque perto da estação o deslocamento de 24h
 * é quase zero e o sinal do dia depende de onde a amostra caiu: a estação de
 * Urano de 10/09/2026 16h30 aparecia como 11/09. Errar a data de um retrógrado
 * é exatamente o erro que desmonta a autoridade da peça.
 *
 * O laço começa um dia ANTES da janela para ter amostra de comparação — sem
 * isso, uma estação no primeiro dia não tem com o que ser comparada e some.
 */
export function estacoesProximas(data, dias = 45) {
  const zero = inicioDoDia(data)
  const achados = []

  for (const nome of PODE_RETROGRADAR) {
    const corpo = CORPOS[nome]
    let anterior = null

    for (let d = -1; d <= dias; d++) {
      const t1 = new Date(zero.getTime() + d * 86_400_000)
      const t2 = new Date(zero.getTime() + (d + 1) * 86_400_000)
      // Velocidade INSTANTÂNEA, não o deslocamento de 24h. Perto da estação o
      // saldo do dia mistura os dois sentidos e ainda dá direto: no dia da
      // estação de Urano o deslocamento líquido era positivo, o que jogava o
      // bracket um dia para a frente e a busca de raiz não achava nada dentro
      // dele.
      const retro = velocidade(corpo, t1) < 0

      if (anterior !== null && retro !== anterior) {
        // A virada está entre a amostra ANTERIOR e esta, não entre esta e a
        // seguinte. Buscar em [t1, t2] procurava no intervalo errado e sempre
        // caía no fallback.
        const desde = new Date(t1.getTime() - 86_400_000)
        let instante = desde
        try {
          const raiz = A.Search(
            (quando) => velocidade(corpo, quando.date),
            new A.AstroTime(desde),
            new A.AstroTime(t1),
            TOLERANCIA
          )
          if (raiz) instante = raiz.date
        } catch {
          // sem raiz limpa no intervalo, o começo do dia serve de aproximação
        }

        const pos = posicaoEmSigno(longitude(corpo, instante))
        achados.push({
          tipo: retro ? 'retrogrado' : 'direto',
          corpo: nome,
          corpoPt: NOMES_PT[nome],
          signo: pos.signo,
          grau: pos.grau,
          elemento: SIGNOS_INFO[Math.floor(longitude(corpo, instante) / 30)].elemento,
          quando: instante,
          hoje: mesmoDia(instante, data),
        })
      }
      anterior = retro
    }
  }

  return achados.sort((a, b) => a.quando - b.quando)
}

/**
 * Retrogradações VIGENTES — o estado, não a virada.
 *
 * `estacoesProximas` só acha o instante em que o movimento inverte. Isso vira
 * evento em dois dias do ano por planeta, e nos vinte e poucos dias entre uma
 * estação e outra ninguém fala nada — justamente o período em que o público
 * mais pergunta. "Mercúrio retrógrado" é o assunto mais procurado do nicho, e
 * era o único que a gente não cobria.
 *
 * A busca vai 120 dias para trás e 120 para frente: Mercúrio retrograda por três
 * semanas, mas Plutão passa quase metade do ano assim, e sem a janela larga o
 * começo ou o fim ficaria de fora.
 *
 * @returns {{corpo, corpoPt, desde, ate, signo, grau, diasRestantes}[]}
 */
/**
 * Só os retrógrados que são experiência vivida.
 *
 * Urano, Netuno e Plutão passam cerca de cinco meses por ano retrógrados: como
 * assunto diário virariam ruído permanente, do mesmo jeito que o aspecto entre
 * dois lentos. Mercúrio, Vênus e Marte duram semanas, todo mundo já ouviu falar,
 * e têm data de fim — que é a informação que quem procura realmente quer.
 */
const RETRO_QUE_IMPORTA = ['Mercury', 'Venus', 'Mars']

export function retrogradacoesVigentes(data) {
  const zero = inicioDoDia(data)
  const vigentes = []

  for (const nome of RETRO_QUE_IMPORTA) {
    const corpo = CORPOS[nome]
    if (velocidade(corpo, zero) >= 0) continue

    const estacoes = estacoesProximas(new Date(zero.getTime() - 120 * 86_400_000), 240)
    const doCorpo = estacoes.filter((e) => e.corpo === nome)
    const inicio = [...doCorpo].reverse().find((e) => e.tipo === 'retrogrado' && e.quando <= zero)
    const fim = doCorpo.find((e) => e.tipo === 'direto' && e.quando > zero)

    const pos = posicaoEmSigno(longitude(corpo, zero))
    vigentes.push({
      tipo: 'retrogradacao',
      corpo: nome,
      corpoPt: NOMES_PT[nome],
      desde: inicio?.quando || null,
      ate: fim?.quando || null,
      signo: pos.signo,
      grau: pos.grau,
      elemento: SIGNOS_INFO[Math.floor(longitude(corpo, zero) / 30)].elemento,
      quando: zero,
      hoje: true,
      diasRestantes: fim ? (fim.quando - zero) / 86_400_000 : null,
    })
  }

  return vigentes
}

/**
 * Planetas em grau crítico: recém-entrados (0°) ou de saída (29°).
 *
 * Os dois extremos do signo são assunto na tradição — o 29° é o "grau
 * anarético", onde o planeta está gastando o que aprendeu ali, e o 0° é o
 * começo cru. Rotaciona toda semana, ao contrário de planeta-em-signo, que fica
 * disponível o mês inteiro e por isso repetia como opção.
 */
export function grausCriticos(data) {
  const zero = inicioDoDia(data)
  const achados = []

  for (const nome of INGRESSO_RELEVANTE) {
    const lon = longitude(CORPOS[nome], zero)
    const pos = posicaoEmSigno(lon)
    // A Lua ficaria em grau crítico a cada dois dias e meio: viraria ruído.
    if (pos.grau !== 29 && pos.grau !== 0) continue
    achados.push({
      tipo: 'grau_critico',
      extremo: pos.grau === 29 ? 'saida' : 'entrada',
      corpo: nome,
      corpoPt: NOMES_PT[nome],
      signo: pos.signo,
      grau: pos.grau,
      elemento: SIGNOS_INFO[Math.floor(lon / 30)].elemento,
      quando: zero,
      hoje: true,
    })
  }

  return achados
}

/**
 * O eixo dos nódulos lunares, hoje.
 *
 * `SearchMoonNode` devolve o PRÓXIMO cruzamento, ascendente ou descendente — e
 * `kind` diz qual. Sem olhar o `kind`, chamadas em datas diferentes devolvem ora
 * um nódulo ora o outro, e o signo parece pular de Leão para Aquário sem que
 * nada tenha se movido.
 *
 * O eixo anda cerca de 19° por ano, para trás: fica no mesmo par de signos por
 * volta de dezoito meses.
 */
export function eixoDosNodulos(data) {
  const zero = inicioDoDia(data)
  try {
    const n = A.SearchMoonNode(zero)
    const lonDoNodulo = longitude(A.Body.Moon, n.time.date)
    // ascendente é o Nódulo Norte; descendente é o Sul, e o Norte fica oposto
    const ascendente = n.kind > 0
    const norte = ascendente ? lonDoNodulo : (lonDoNodulo + 180) % 360
    const sul = (norte + 180) % 360
    const pn = posicaoEmSigno(norte)
    const ps = posicaoEmSigno(sul)
    return {
      tipo: 'nodulos',
      norte: pn,
      sul: ps,
      signo: pn.signo,
      grau: pn.grau,
      elemento: SIGNOS_INFO[Math.floor(norte / 30)].elemento,
      quando: zero,
      hoje: true,
    }
  } catch {
    return null
  }
}

/** Próximas fases da lua. */
export function fasesDaLua(data, quantas = 4) {
  const saida = []
  let q = A.SearchMoonQuarter(inicioDoDia(data))

  for (let i = 0; i < quantas; i++) {
    const pos = posicaoEmSigno(longitude(A.Body.Moon, q.time.date))
    saida.push({
      tipo: 'fase',
      fase: FASES[q.quarter],
      quarto: q.quarter,
      signo: pos.signo,
      grau: pos.grau,
      elemento: SIGNOS_INFO[Math.floor(longitude(A.Body.Moon, q.time.date) / 30)].elemento,
      quando: q.time.date,
      hoje: mesmoDia(q.time.date, data),
    })
    q = A.NextMoonQuarter(q)
  }

  return saida
}

/**
 * Eclipses na janela, solares e lunares.
 *
 * Todo eclipse é uma lunação — solar é Lua Nova, lunar é Lua Cheia — então sem
 * isto o card trata o maior evento do ano como fase comum. Em 12/08/2026 há um
 * eclipse solar TOTAL, e a peça anunciaria "Lua Nova em Leão".
 *
 * A visibilidade é calculada, não presumida: o eclipse solar de 12/08 não é
 * visível do Brasil (o próximo em São Paulo é 06/02/2027, parcial), enquanto o
 * lunar de 28/08 tem a Lua a 68° de altitude à 01h12 de Brasília. Mandar alguém
 * olhar para o céu no dia errado é o tipo de erro que custa a confiança inteira.
 */
const KIND_PT = {
  total: 'total',
  annular: 'anular',
  partial: 'parcial',
  penumbral: 'penumbral',
  hybrid: 'híbrido',
}

/** São Paulo. Serve de referência para "dá para ver do Brasil". */
const OBSERVADOR_BR = new A.Observer(-23.55, -46.63, 760)

/** A Lua acima do horizonte no pico basta: eclipse lunar se vê a olho nu. */
function lunarVisivelDoBrasil(pico) {
  try {
    const t = new A.AstroTime(pico)
    const eq = A.Equator(A.Body.Moon, t, OBSERVADOR_BR, true, true)
    const h = A.Horizon(t, OBSERVADOR_BR, eq.ra, eq.dec, 'normal')
    return { visivel: h.altitude > 0, altitude: Math.round(h.altitude) }
  } catch {
    return { visivel: false, altitude: null }
  }
}

/** Para o solar, a pergunta é se a sombra passa por aqui — não basta ser dia. */
function solarVisivelDoBrasil(pico) {
  try {
    const local = A.SearchLocalSolarEclipse(
      new A.AstroTime(new Date(pico.getTime() - 86_400_000)),
      OBSERVADOR_BR
    )
    const mesmoEvento = Math.abs(local.peak.time.date - pico) < 12 * 3_600_000
    return {
      visivel: mesmoEvento,
      obscuracao: mesmoEvento ? Math.round(local.obscuration * 100) : 0,
    }
  } catch {
    return { visivel: false, obscuracao: 0 }
  }
}

export function eclipsesProximos(data, dias = 45) {
  const zero = inicioDoDia(data)
  const limite = new Date(zero.getTime() + dias * 86_400_000)
  const achados = []

  let s = A.SearchGlobalSolarEclipse(new A.AstroTime(zero))
  for (let i = 0; i < 4 && s.peak.date <= limite; i++) {
    const pos = posicaoEmSigno(longitude(A.Body.Sun, s.peak.date))
    const br = solarVisivelDoBrasil(s.peak.date)
    achados.push({
      tipo: 'eclipse',
      luminar: 'solar',
      especie: KIND_PT[s.kind] || s.kind,
      total: s.kind === 'total',
      signo: pos.signo,
      grau: pos.grau,
      elemento: SIGNOS_INFO[Math.floor(longitude(A.Body.Sun, s.peak.date) / 30)].elemento,
      quando: s.peak.date,
      hoje: mesmoDia(s.peak.date, data),
      visivelBR: br.visivel,
      obscuracaoBR: br.obscuracao,
    })
    s = A.NextGlobalSolarEclipse(s.peak)
  }

  let l = A.SearchLunarEclipse(new A.AstroTime(zero))
  for (let i = 0; i < 4 && l.peak.date <= limite; i++) {
    const pos = posicaoEmSigno(longitude(A.Body.Moon, l.peak.date))
    const br = lunarVisivelDoBrasil(l.peak.date)
    achados.push({
      tipo: 'eclipse',
      luminar: 'lunar',
      especie: KIND_PT[l.kind] || l.kind,
      total: l.kind === 'total',
      signo: pos.signo,
      grau: pos.grau,
      elemento: SIGNOS_INFO[Math.floor(longitude(A.Body.Moon, l.peak.date) / 30)].elemento,
      quando: l.peak.date,
      hoje: mesmoDia(l.peak.date, data),
      visivelBR: br.visivel,
      alturaBR: br.altitude,
      minutosParcial: Math.round(l.sd_partial * 2),
    })
    l = A.NextLunarEclipse(l.peak)
  }

  return achados.sort((a, b) => a.quando - b.quando)
}

/** Ângulos que contam como aspecto maior para encerrar o curso da Lua. */
const ANGULOS_MAIORES = [0, 60, 90, 120, 180]

/** Planetas com que a Lua "faz curso". Sol entra; os demais luminares não há. */
const PARCEIROS_DA_LUA = [
  'Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto',
]

/**
 * Lua fora de curso: o intervalo entre o último aspecto maior que a Lua faz num
 * signo e o momento em que ela entra no signo seguinte.
 *
 * O app hoje lê isso de uma tabela copiada do Personare, fixada em 2026
 * (`backend/scripts/seed-astro-event-calendar.js`, `source: "personare_2026"`).
 * Aqui é calculado, então vale para qualquer data.
 *
 * A varredura é de hora em hora: a Lua anda cerca de meio grau por hora, o que
 * torna impossível ela entrar e sair de um aspecto dentro da mesma amostra.
 *
 * @returns {{inicio: Date, fim: Date, horas: number, ultimoAspecto: object, signo: string, proximoSigno: string, emCurso: boolean}|null}
 */
export function luaForaDeCurso(data) {
  const HORA = 3_600_000
  const lua = CORPOS.Moon

  // fim do período: quando a Lua troca de signo
  const atual = longitude(lua, data)
  const limite = ((Math.floor(atual / 30) + 1) * 30) % 360
  let ingresso
  try {
    ingresso = A.Search(
      (quando) => diferenca(longitude(lua, quando), limite),
      new A.AstroTime(data),
      new A.AstroTime(new Date(data.getTime() + 3 * 86_400_000)),
      TOLERANCIA
    )
  } catch {
    return null
  }
  if (!ingresso) return null

  const fim = ingresso.date

  // último aspecto maior antes do ingresso: varre para trás em passos de 1h
  const inicioBusca = new Date(data.getTime() - 3 * 86_400_000)
  const passos = Math.ceil((fim - inicioBusca) / HORA)

  let ultimo = null
  for (let i = 0; i < passos; i++) {
    const t1 = new Date(inicioBusca.getTime() + i * HORA)
    const t2 = new Date(t1.getTime() + HORA)
    if (t2 > fim) break

    const lua1 = longitude(lua, t1)
    const lua2 = longitude(lua, t2)

    for (const nome of PARCEIROS_DA_LUA) {
      const corpo = CORPOS[nome]
      const p1 = longitude(corpo, t1)
      const p2 = longitude(corpo, t2)

      // Diferença ASSINADA, testada contra +ângulo e -ângulo.
      //
      // Usar Math.abs antes de procurar troca de sinal parecia natural e
      // quebrava a conjunção: a separação absoluta nunca fica negativa, então
      // 0° nunca cruzava nada e o último aspecto caía longe demais para trás,
      // inflando o período em mais de um dia.
      const s1 = diferenca(lua1, p1)
      const s2 = diferenca(lua2, p2)

      for (const ang of ANGULOS_MAIORES) {
        for (const alvo of ang === 0 || ang === 180 ? [ang] : [ang, -ang]) {
          const d1 = diferenca(s1, alvo)
          const d2 = diferenca(s2, alvo)
          // salto de 180° é a volta do círculo, não um aspecto
          if (Math.abs(d1) > 90 || Math.abs(d2) > 90) continue
          if (d1 === 0 || d1 * d2 < 0) {
            ultimo = { quando: t2, corpo: nome, corpoPt: NOMES_PT[nome], angulo: ang }
          }
        }
      }
    }
  }

  if (!ultimo) return null

  const inicio = ultimo.quando
  const posLua = posicaoEmSigno(atual)
  return {
    tipo: 'lua_fora_de_curso',
    inicio,
    fim,
    horas: Math.round(((fim - inicio) / HORA) * 10) / 10,
    ultimoAspecto: ultimo,
    signo: posLua.signo,
    grau: posLua.grau,
    proximoSigno: SIGNOS_INFO[(limite / 30) % 12].nome,
    // Elemento do signo ONDE a Lua está, não do próximo. Vinha do próximo e o
    // card imprimia "Virgem · ar" no rodapé — e ainda pintava a peça com a cor
    // do elemento errado, porque a cor sai daqui.
    elemento: SIGNOS_INFO[Math.floor(atual / 30)].elemento,
    elementoProximo: SIGNOS_INFO[(limite / 30) % 12].elemento,
    // "em curso" no sentido de estar valendo agora
    emCurso: data >= inicio && data < fim,
    quando: inicio,
  }
}

/**
 * O céu do dia, em ordem de relevância jornalística.
 *
 * Um ingresso é notícia; um aspecto que dura três semanas não. A ordem aqui é o
 * que decide o assunto da peça, e é a diferença entre falar do que mudou hoje e
 * repetir a mesma manchete por doze dias.
 */
/**
 * Peso base por classe de evento. Eclipse acima de tudo: é o único que a
 * imprensa não astrológica também noticia.
 */
function pesoBase(ev) {
  switch (ev.tipo) {
    case 'eclipse':
      if (ev.especie === 'penumbral') return 95
      return ev.luminar === 'solar' && ev.total ? 130 : 118
    case 'ingresso': return 100
    case 'retrogrado':
    case 'direto': return 95
    case 'fase': return 90
    case 'lua_fora_de_curso': return 85
    default: return 80
  }
}

/**
 * Quantos dias faltam, contando por data e não por horas: um evento às 23h de
 * amanhã falta um dia, não zero vírgula nove.
 */
function diasAte(quando, data) {
  const a = Date.UTC(data.getUTCFullYear(), data.getUTCMonth(), data.getUTCDate())
  const b = Date.UTC(quando.getUTCFullYear(), quando.getUTCMonth(), quando.getUTCDate())
  return Math.round((b - a) / 86_400_000)
}

/**
 * Antecipação: o desconto por dia de distância.
 *
 * Oito pontos por dia é o que faz um eclipse de amanhã (130−8=122) ganhar de um
 * ingresso de hoje (100), e um ingresso de amanhã (92) ganhar de uma fase de
 * hoje (90) por pouco. A conta importa porque o público espera o evento grande e
 * ignora o pequeno — @ecodosastros publica "está chegando" e é isso que gera a
 * volta no dia.
 */
const DESCONTO_POR_DIA = 8

export function eventosDoDia(data, aspectos = [], opcoes = {}) {
  const antecedencia = opcoes.antecedencia ?? 3
  const eventos = []

  /** Entra se é hoje ou se está dentro da janela de antecipação. */
  const considerar = (ev) => {
    const falta = diasAte(ev.quando, data)
    if (falta < 0 || falta > antecedencia) return
    eventos.push({
      ...ev,
      vespera: falta > 0,
      diasFalta: falta,
      peso: pesoBase(ev) - DESCONTO_POR_DIA * falta,
    })
  }

  for (const e of eclipsesProximos(data, antecedencia + 1)) considerar(e)
  for (const i of ingressosProximos(data, antecedencia + 1)) considerar(i)
  for (const e of estacoesProximas(data, antecedencia + 1)) considerar(e)
  for (const f of fasesDaLua(data, 3)) considerar(f)

  // Todo eclipse é uma lunação. Sem isto a peça anunciaria duas vezes o mesmo
  // instante — "Eclipse solar total" e "Lua Nova em Leão" — e o segundo ainda
  // ocuparia a linha dos eventos secundários.
  const diasComEclipse = new Set(
    eventos.filter((e) => e.tipo === 'eclipse').map((e) => e.quando.toISOString().slice(0, 10))
  )
  for (let i = eventos.length - 1; i >= 0; i--) {
    const e = eventos[i]
    if (e.tipo === 'fase' && diasComEclipse.has(e.quando.toISOString().slice(0, 10))) {
      eventos.splice(i, 1)
    }
  }

  // a Lua fora de curso vale como aviso do dia: dura horas e volta toda semana
  const vazia = luaForaDeCurso(data)
  if (vazia && (vazia.emCurso || mesmoDia(vazia.inicio, data))) {
    eventos.push({ ...vazia, vespera: false, diasFalta: 0, peso: 85 })
  }

  // aspecto que fecha hoje vale como evento; vigente há semanas, não
  for (const a of aspectos) {
    if (a.orbe < 1 && a.aspecto !== 'conjuncao') {
      eventos.push({
        tipo: 'aspecto',
        aspecto: a,
        corpoPt: a.agentePt,
        signo: a.agentePos?.signo,
        elemento: a.agentePos ? SIGNOS_INFO.find((s) => s.nome === a.agentePos.signo)?.elemento : null,
        quando: data,
        hoje: true,
        vespera: false,
        diasFalta: 0,
        peso: 80 - a.orbe * 10,
      })
    }
  }

  return eventos.sort((a, b) => b.peso - a.peso)
}
