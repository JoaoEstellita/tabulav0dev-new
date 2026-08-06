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
 * Mudanças de signo na janela.
 *
 * A busca é pela raiz da distância até o próximo limite de 30°, que troca de
 * sinal exatamente no ingresso. Normalizar a diferença é o que faz isso
 * funcionar na virada de Peixes para Áries, onde a subtração crua daria 360.
 */
export function ingressosProximos(data, dias = 30) {
  const inicio = new A.AstroTime(data)
  const fim = new A.AstroTime(new Date(data.getTime() + dias * 86_400_000))
  const achados = []

  for (const nome of INGRESSO_RELEVANTE) {
    const corpo = CORPOS[nome]
    const atual = longitude(corpo, data)
    const limite = ((Math.floor(atual / 30) + 1) * 30) % 360

    try {
      const t = A.Search((quando) => diferenca(longitude(corpo, quando), limite), inicio, fim, 1)
      if (!t) continue
      achados.push({
        tipo: 'ingresso',
        corpo: nome,
        corpoPt: NOMES_PT[nome],
        signo: SIGNOS_INFO[(limite / 30) % 12].nome,
        elemento: SIGNOS_INFO[(limite / 30) % 12].elemento,
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
 * Início e fim de retrogradação na janela.
 *
 * Varre dia a dia procurando troca de sinal na velocidade. Passo diário basta:
 * uma estação leva horas para se completar e o card fala em data, não em minuto.
 */
export function estacoesProximas(data, dias = 45) {
  const achados = []

  for (const nome of PODE_RETROGRADAR) {
    const corpo = CORPOS[nome]
    let anterior = null

    for (let d = 0; d <= dias; d++) {
      const t1 = new Date(data.getTime() + d * 86_400_000)
      const t2 = new Date(data.getTime() + (d + 1) * 86_400_000)
      const retro = diferenca(longitude(corpo, t2), longitude(corpo, t1)) < 0

      if (anterior !== null && retro !== anterior) {
        const pos = posicaoEmSigno(longitude(corpo, t1))
        achados.push({
          tipo: retro ? 'retrogrado' : 'direto',
          corpo: nome,
          corpoPt: NOMES_PT[nome],
          signo: pos.signo,
          grau: pos.grau,
          elemento: SIGNOS_INFO[Math.floor(longitude(corpo, t1) / 30)].elemento,
          quando: t1,
          hoje: mesmoDia(t1, data),
        })
      }
      anterior = retro
    }
  }

  return achados.sort((a, b) => a.quando - b.quando)
}

/** Próximas fases da lua. */
export function fasesDaLua(data, quantas = 4) {
  const saida = []
  let q = A.SearchMoonQuarter(data)

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
      1
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
    proximoSigno: SIGNOS_INFO[(limite / 30) % 12].nome,
    elemento: SIGNOS_INFO[(limite / 30) % 12].elemento,
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
export function eventosDoDia(data, aspectos = []) {
  const eventos = []

  for (const i of ingressosProximos(data, 2)) {
    if (i.hoje) eventos.push({ ...i, peso: 100 })
  }
  for (const e of estacoesProximas(data, 2)) {
    if (e.hoje) eventos.push({ ...e, peso: 95 })
  }
  for (const f of fasesDaLua(data, 2)) {
    if (f.hoje) eventos.push({ ...f, peso: 90 })
  }

  // a Lua fora de curso vale como aviso do dia: dura horas e volta toda semana
  const vazia = luaForaDeCurso(data)
  if (vazia && (vazia.emCurso || mesmoDia(vazia.inicio, data))) {
    eventos.push({ ...vazia, peso: 85 })
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
        peso: 80 - a.orbe * 10,
      })
    }
  }

  return eventos.sort((a, b) => b.peso - a.peso)
}
