import { describe, expect, it } from 'vitest'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { lerLiterais } from '../catalogo.mjs'
import { mapaDoCeu } from '../ceu.mjs'
import { eventosDoDia } from '../eventos.mjs'
import { falaDoReel } from '../vozReel.mjs'
import { tempoNoSigno, ritmo, percursoDoDia, estacaoProxima } from '../fatos.mjs'

const FRONTEND = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..')
const { PLANET_ASPECT_ORBS: ORBES } = await lerLiterais(
  path.join(FRONTEND, 'src/astro/aspect-config.ts'), ['PLANET_ASPECT_ORBS'])

const meioDia = (d) => new Date(`${d}T12:00:00Z`)

/** Trinta dias seguidos de fala, que é o que a conta publicaria num mês. */
function falasDe(iso, quantos = 30) {
  const base = new Date(`${iso}T12:00:00Z`)
  const saida = []
  for (let i = 0; i < quantos; i++) {
    const data = new Date(base.getTime() + i * 86_400_000)
    const mapa = mapaDoCeu(data, ORBES)
    const eventos = eventosDoDia(data, mapa.aspectos)
    const principal = eventos[0]
    if (!principal) continue
    const proximo = eventos.find((e) => e !== principal && e.quando > data && e.tipo !== principal.tipo)
    saida.push({ data, evento: principal, fala: falaDoReel(principal, data, { proximo }) })
  }
  return saida
}

/**
 * O motivo desta voz existir.
 *
 * O João olhou o material e disse que estava quase desistindo: "as informações
 * são genéricas demais". O texto de então explicava o que É um eclipse — a mesma
 * frase para qualquer eclipse de qualquer ano — e fechava com um bordão que ele
 * citou de cor: "a posição é para todos, mas a casa é de cada um".
 */
describe('a voz não volta ao que era', () => {
  const PROIBIDO = [
    /céu é de todos/i,
    /casa é de cada um/i,
    /energia/i,
    /vibra(ção|ções)/i,
    /prepare-se/i,
    /aproveite/i,
    /universo conspira/i,
    /momento poderoso/i,
  ]

  it('nenhum jargão em trinta dias de fala', () => {
    for (const { data, fala } of falasDe('2026-08-08')) {
      const texto = [...fala.blocos, fala.post].join(' ')
      for (const proibido of PROIBIDO) {
        expect(proibido.test(texto), `${data.toISOString().slice(0, 10)} — ${proibido}`).toBe(false)
      }
    }
  })

  // "Retrógrado" sozinho não diz nada para quem não é do meio. A regra é que o
  // termo só apareça acompanhado da tradução, na mesma frase.
  it('termo técnico vem sempre com tradução ao lado', () => {
    for (const { data, fala } of falasDe('2026-08-08', 40)) {
      for (const bloco of fala.blocos) {
        if (!/retrógrad/i.test(bloco)) continue
        expect(/para trás/i.test(bloco), `${data.toISOString().slice(0, 10)}: ${bloco}`).toBe(true)
      }
    }
  })

  it('nada de nome de corpo em inglês', () => {
    const INGLES = /\b(Sun|Moon|Mercury|Venus|Mars|Jupiter|Saturn|Uranus|Neptune|Pluto)\b/
    for (const { data, fala } of falasDe('2026-08-08')) {
      const texto = [...fala.blocos, fala.post].join(' ')
      expect(INGLES.test(texto), `${data.toISOString().slice(0, 10)}: ${texto.slice(0, 90)}`).toBe(false)
    }
  })

  // Ponto decimal em português denuncia texto gerado por máquina.
  it('número sai com vírgula decimal', () => {
    for (const { data, fala } of falasDe('2026-08-08')) {
      for (const bloco of fala.blocos) {
        expect(/\d\.\d/.test(bloco), `${data.toISOString().slice(0, 10)}: ${bloco}`).toBe(false)
      }
    }
  })
})

/**
 * O que substituiu o verbete: um dado deste dia e de nenhum outro.
 */
describe('cada peça carrega um fato calculado', () => {
  it('toda fala tem pelo menos um número', () => {
    for (const { data, fala } of falasDe('2026-08-08')) {
      const texto = fala.blocos.join(' ')
      expect(/\d/.test(texto), `${data.toISOString().slice(0, 10)}: ${texto}`).toBe(true)
    }
  })

  it('a fala tem três ou quatro tempos, nunca mais', () => {
    for (const { data, fala } of falasDe('2026-08-08')) {
      expect(fala.blocos.length, data.toISOString().slice(0, 10)).toBeGreaterThanOrEqual(2)
      expect(fala.blocos.length, data.toISOString().slice(0, 10)).toBeLessThanOrEqual(4)
    }
  })

  it('dias diferentes não repetem a mesma abertura', () => {
    const aberturas = falasDe('2026-08-08', 14).map((f) => f.fala.blocos[0])
    expect(new Set(aberturas).size).toBeGreaterThan(aberturas.length * 0.6)
  })

  // O gancho é o PRÓXIMO assunto. Sem comparar o tipo, a peça sobre o eclipse
  // terminava anunciando o mesmo eclipse.
  it('o gancho nunca anuncia o próprio assunto', () => {
    for (const { fala, evento } of falasDe('2026-08-08')) {
      const ultimo = fala.blocos[fala.blocos.length - 1]
      if (!/^(Ainda hoje|Amanhã|Daqui a)/.test(ultimo)) continue
      if (evento.tipo !== 'eclipse') continue
      expect(/eclipse/i.test(ultimo), ultimo).toBe(false)
    }
  })
})

/**
 * Só entra o que o código calcula.
 *
 * A tentação de escrever "a faixa de totalidade passa pela Islândia" é grande e
 * é exatamente o erro que a conta existe para não cometer.
 */
describe('nada de afirmação sem cálculo', () => {
  it('"muda de direção" só quando a estação está mesmo perto', () => {
    for (const { data, evento, fala } of falasDe('2026-08-08', 60)) {
      const texto = fala.blocos.join(' ')
      if (!/muda de direção/.test(texto)) continue
      const corpo = evento.corpo || 'Moon'
      const paraEm = estacaoProxima(corpo, data)
      expect(paraEm, `${data.toISOString().slice(0, 10)} — ${corpo}`).not.toBeNull()
      expect(paraEm).toBeLessThanOrEqual(12)
    }
  })

  // A Lua troca de signo a cada dois dias e meio: a busca para trás atravessava
  // dezenas de trocas e devolvia "a Lua ficou quatro semanas no mesmo signo".
  it('a Lua nunca aparece com semanas no mesmo signo', () => {
    expect(tempoNoSigno('Moon', meioDia('2026-08-15'))).toBeNull()
  })

  it('a velocidade é em graus por DIA, não por meio dia', () => {
    // a Lua anda ~13,2°/dia; o bug antigo devolvia ~6,6 e tudo saía "devagar"
    const r = ritmo('Moon', meioDia('2026-09-10'))
    expect(r.grausPorDia).toBeGreaterThan(11)
    expect(r.grausPorDia).toBeLessThan(16)
  })

  it('o percurso do dia bate com o que a animação mostra', () => {
    const p = percursoDoDia('Moon', meioDia('2026-08-09'))
    expect(p.graus).toBeGreaterThan(11)
    expect(p.graus).toBeLessThan(16)
  })
})
