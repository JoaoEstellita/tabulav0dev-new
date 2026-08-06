import { describe, expect, it } from 'vitest'

import {
  eclipsesProximos,
  ingressosProximos,
  estacoesProximas,
  fasesDaLua,
  eventosDoDia,
} from '../eventos.mjs'
import { eixoDoSigno, mereceEixo, rotuloDeVespera } from '../vozes.mjs'

/**
 * Golden de efeméride para agosto e setembro de 2026.
 *
 * Este arquivo nasceu de um erro alheio. Uma ferramenta de IA de conteúdo
 * sugeriu ao João postar "Lua Cheia em Aquário" em 11 de agosto de 2026. A Lua
 * Cheia em Aquário tinha sido em 29 de JULHO; em 11 de agosto não há fase
 * nenhuma; a Lua Nova é dia 12 e a próxima Cheia, dia 28, em Peixes. Fase
 * errada, signo errado, data errada — publicado como se fosse futuro.
 *
 * A vantagem do Tábula Estelar sobre essas ferramentas é a única que importa
 * aqui: os valores saem de efeméride calculada. Estes testes existem para que
 * continue assim depois que ninguém lembrar por quê.
 *
 * Datas em UTC. Tolerância de dois minutos absorve mudança de implementação sem
 * deixar passar erro de dia.
 */
const DOIS_MINUTOS = 2 * 60 * 1000
const emUTC = (iso) => new Date(iso)
const meioDia = (dia) => new Date(`${dia}T12:00:00Z`)

function pertoDe(recebido, esperadoISO) {
  const delta = Math.abs(recebido.getTime() - emUTC(esperadoISO).getTime())
  return { passou: delta <= DOIS_MINUTOS, delta, recebido: recebido.toISOString() }
}

describe('ingressos', () => {
  const achados = ingressosProximos(meioDia('2026-08-06'), 20)
  const porCorpo = Object.fromEntries(achados.map((i) => [i.corpo, i]))

  it('Vênus entra em Libra em 6 de agosto de 2026, 19h08 UTC', () => {
    const r = pertoDe(porCorpo.Venus.quando, '2026-08-06T19:08:09Z')
    expect(r.passou, `veio ${r.recebido}`).toBe(true)
    expect(porCorpo.Venus.signo).toBe('Libra')
    expect(porCorpo.Venus.grau).toBe(0)
  })

  it('Marte entra em Câncer em 11 de agosto, 08h23 UTC', () => {
    const r = pertoDe(porCorpo.Mars.quando, '2026-08-11T08:23:04Z')
    expect(r.passou, `veio ${r.recebido}`).toBe(true)
    expect(porCorpo.Mars.signo).toBe('Câncer')
  })

  // A busca partia do meio-dia, então um ingresso da manhã já tinha passado e
  // sumia do próprio dia. O card de 11 de agosto não mencionava Marte.
  it('evento da manhã não some no dia em que acontece', () => {
    const doDia = ingressosProximos(meioDia('2026-08-11'), 2)
    expect(doDia.some((i) => i.corpo === 'Mars' && i.hoje)).toBe(true)
  })
})

describe('estações retrógradas', () => {
  // Amostragem diária do DESLOCAMENTO de 24h dava 11 de setembro: perto da
  // estação o saldo do dia ainda é direto. O sinal certo é a velocidade
  // instantânea, e a data sai de busca de raiz dentro do par de dias.
  it('Urano fica retrógrado em 10 de setembro de 2026, não em 11', () => {
    const achados = estacoesProximas(meioDia('2026-08-06'), 70)
    const urano = achados.find((e) => e.corpo === 'Uranus')
    expect(urano.tipo).toBe('retrogrado')
    expect(urano.quando.toISOString().slice(0, 10)).toBe('2026-09-10')
    const r = pertoDe(urano.quando, '2026-09-10T16:02:45Z')
    expect(r.passou, `veio ${r.recebido}`).toBe(true)
  })
})

describe('fases da lua — o contraexemplo da ferramenta de IA', () => {
  it('a Lua Cheia em Aquário foi em 29 de JULHO de 2026', () => {
    const fases = fasesDaLua(meioDia('2026-07-20'), 6)
    const cheia = fases.find((f) => f.fase === 'Lua Cheia')
    expect(cheia.signo).toBe('Aquário')
    expect(cheia.quando.toISOString().slice(0, 10)).toBe('2026-07-29')
  })

  it('11 de agosto de 2026 não tem fase nenhuma', () => {
    const doDia = fasesDaLua(meioDia('2026-08-11'), 3).filter((f) => f.hoje)
    expect(doDia).toEqual([])
  })

  it('12 de agosto é Lua NOVA em Leão, e a próxima Cheia é em Peixes', () => {
    const fases = fasesDaLua(meioDia('2026-08-11'), 4)
    expect(fases[0].fase).toBe('Lua Nova')
    expect(fases[0].signo).toBe('Leão')
    expect(fases[0].quando.toISOString().slice(0, 10)).toBe('2026-08-12')

    const cheia = fases.find((f) => f.fase === 'Lua Cheia')
    expect(cheia.signo).toBe('Peixes')
    expect(cheia.quando.toISOString().slice(0, 10)).toBe('2026-08-28')
  })
})

describe('eclipses', () => {
  const achados = eclipsesProximos(meioDia('2026-08-06'), 60)

  it('acha o eclipse solar TOTAL de 12 de agosto de 2026, em Leão', () => {
    const solar = achados.find((e) => e.luminar === 'solar')
    expect(solar.especie).toBe('total')
    expect(solar.total).toBe(true)
    expect(solar.signo).toBe('Leão')
    expect(solar.grau).toBe(20)
    const r = pertoDe(solar.quando, '2026-08-12T17:45:47Z')
    expect(r.passou, `veio ${r.recebido}`).toBe(true)
  })

  // Mandar o público brasileiro olhar para uma sombra que passa pela Islândia é
  // o tipo de erro que custa a confiança inteira.
  it('sabe que o eclipse solar de 12/08 NÃO é visível do Brasil', () => {
    const solar = achados.find((e) => e.luminar === 'solar')
    expect(solar.visivelBR).toBe(false)
    expect(solar.obscuracaoBR).toBe(0)
  })

  it('acha o eclipse lunar parcial de 28 de agosto, em Peixes, VISÍVEL do Brasil', () => {
    const lunar = achados.find((e) => e.luminar === 'lunar')
    expect(lunar.especie).toBe('parcial')
    expect(lunar.signo).toBe('Peixes')
    expect(lunar.visivelBR).toBe(true)
    // quase no zênite: é o dado que transforma o post em "põe o despertador"
    expect(lunar.alturaBR).toBeGreaterThan(60)
  })
})

describe('eventos do dia', () => {
  it('o eclipse ganha de tudo e não duplica com a lunação', () => {
    const evs = eventosDoDia(meioDia('2026-08-12'))
    expect(evs[0].tipo).toBe('eclipse')
    expect(evs[0].vespera).toBe(false)
    // todo eclipse É uma lunação: sem a limpeza, "Lua Nova em Leão" apareceria
    // como evento secundário do mesmo instante
    expect(evs.some((e) => e.tipo === 'fase')).toBe(false)
  })

  it('antecipa: dois dias antes, o eclipse ainda lidera e se declara véspera', () => {
    const evs = eventosDoDia(meioDia('2026-08-10'))
    expect(evs[0].tipo).toBe('eclipse')
    expect(evs[0].vespera).toBe(true)
    expect(evs[0].diasFalta).toBe(2)
    expect(rotuloDeVespera(evs[0])).toBe('Faltam 2 dias')
  })

  it('um eclipse de amanhã ganha de um ingresso de hoje', () => {
    const evs = eventosDoDia(meioDia('2026-08-11'))
    expect(evs[0].tipo).toBe('eclipse')
    expect(evs[0].diasFalta).toBe(1)
    expect(rotuloDeVespera(evs[0])).toBe('Amanhã')
    // o ingresso de Marte continua na peça, como secundário
    expect(evs.some((e) => e.tipo === 'ingresso' && e.corpo === 'Mars')).toBe(true)
  })

  it('nada de véspera fora da janela pedida', () => {
    const evs = eventosDoDia(meioDia('2026-08-06'), [], { antecedencia: 0 })
    expect(evs.every((e) => e.vespera === false)).toBe(true)
  })

  // O elemento vinha do signo SEGUINTE, e o card imprimia "Virgem · ar" —
  // Virgem é terra. A cor da peça sai desse mesmo campo.
  it('a Lua fora de curso reporta o elemento do signo onde a Lua está', () => {
    const evs = eventosDoDia(meioDia('2026-08-13'))
    const vazia = evs.find((e) => e.tipo === 'lua_fora_de_curso')
    expect(vazia.signo).toBe('Virgem')
    expect(vazia.elemento).toBe('terra')
    expect(vazia.elementoProximo).toBe('ar')
    expect(typeof vazia.grau).toBe('number')
  })
})

describe('eixo dos quatro signos', () => {
  it('Libra abre a cruz cardinal', () => {
    const eixo = eixoDoSigno('Libra')
    expect(eixo.modalidade).toBe('cardinal')
    expect(eixo.conjuncao).toBe('Libra')
    expect(eixo.quadraturas).toEqual(['Câncer', 'Capricórnio'])
    expect(eixo.oposicao).toBe('Áries')
    expect(eixo.todos).toEqual(['Áries', 'Câncer', 'Libra', 'Capricórnio'])
  })

  it('Leão abre a cruz fixa', () => {
    expect(eixoDoSigno('Leão').todos).toEqual(['Touro', 'Leão', 'Escorpião', 'Aquário'])
  })

  it('são sempre quatro, para qualquer signo', () => {
    const signos = [
      'Áries', 'Touro', 'Gêmeos', 'Câncer', 'Leão', 'Virgem',
      'Libra', 'Escorpião', 'Sagitário', 'Capricórnio', 'Aquário', 'Peixes',
    ]
    for (const s of signos) {
      const eixo = eixoDoSigno(s)
      expect(eixo.todos, s).toHaveLength(4)
      expect(new Set(eixo.todos).size, s).toBe(4)
      expect(eixo.todos, s).toContain(s)
    }
  })

  // Se toda peça recortasse signos, o recurso viraria cacoete e a conta viraria
  // horóscopo. Fica para eclipse, lunação e planeta que o público reconhece.
  it('só entra nos eventos de peso', () => {
    expect(mereceEixo({ tipo: 'eclipse' })).toBe(true)
    expect(mereceEixo({ tipo: 'fase', fase: 'Lua Nova' })).toBe(true)
    expect(mereceEixo({ tipo: 'fase', fase: 'Quarto Crescente' })).toBe(false)
    expect(mereceEixo({ tipo: 'ingresso', corpo: 'Venus' })).toBe(true)
    // o Sol entra: a entrada dele é o que define as datas de signo que todo
    // mundo já conhece, e acontece doze vezes por ano — não vira repetição
    expect(mereceEixo({ tipo: 'ingresso', corpo: 'Sun' })).toBe(true)
    // os lentos ficam de fora: Netuno leva catorze anos num signo, e anunciar a
    // cruz dele todo ano seria a mesma notícia
    expect(mereceEixo({ tipo: 'ingresso', corpo: 'Neptune' })).toBe(false)
    expect(mereceEixo({ tipo: 'lua_fora_de_curso' })).toBe(false)
  })
})
